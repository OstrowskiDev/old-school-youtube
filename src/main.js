consoleTranslation('extension-initialized', 'highlight blue')

const environment = 'development' // or "production"

let lastPathname = window.location.pathname
let currentPathname = window.location.pathname

const nonHiddenElements = ':not([hidden]):not([style*="display: none"])'

const pathNameObserver = watchPathnameChanges()
onNavigationChange()

function watchPathnameChanges() {
  let lastPathname = window.location.pathname

  const observer = new MutationObserver(() => {
    currentPathname = window.location.pathname
    if (currentPathname !== lastPathname) {
      lastPathname = currentPathname
      onNavigationChange()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  return observer
}

async function onNavigationChange() {
  logger.log(`Navigation triggered`)
  logger.log(`currentPathname: ${currentPathname}`)

  // disable/enable observers according to the current pathname
  observersData.forEach((observer) => {
    try {
      const regex = new RegExp(observer.regex)

      if (regex.test(currentPathname)) {
        logger.log(`Enabling observer ${observer.name}`)
        observer.enabled = true
      } else {
        logger.log(`Disabling observer ${observer.name}`)
        observer.enabled = false
      }
    } catch (error) {
      logger.error(`Error processing observer ${observer.name}:`, error)
    }
  })

  const observerPromises = []

  observersData.forEach((observer) => {
    const promise = findAndHideElement(observer)
    observerPromises.push(promise)
  })

  // Await all promises concurrently
  await Promise.all(observerPromises)
}

async function findAndHideElement(observer) {
  logger.log(`findAndHideElement called for ${observer.name}`)
  const parentElement = await manageParentObserver(observer)

  if (parentElement) {
    logger.log(`parentElement found, initializing manageTargetObserver for ${observer.name}`)
    await manageTargetObserver(observer, parentElement)
  }
}

function hideElement(element) {
  logger.important(`hideElement func called`)
  consoleTranslation('element-hidden!', 'highlight blue')

  if (!element.hasAttribute('hidden')) {
    element.setAttribute('hidden', true)
  }
}

function trackElementWithObserver(observerName, selector, target = document.body, options) {
  logger.log(`trackElementWithObserver triggered, selector: ${observerName}`)

  return new Promise((resolve) => {
    let newObserver = null
    let element = document.querySelector(selector)
    if (element) {
      return resolve({ element: element, newObserver: newObserver })
    }
    newObserver = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        resolve({ element: element, newObserver: newObserver })
      }
    })
    newObserver.observe(target, options)
  })
}

async function manageParentObserver(observer) {
  logger.log(`manageParentObserver called for ${observer.name}. parentObserver is null: ${observer.parentObserver === null}, observer is enabled: ${observer.enabled}, observerData is true: ${!!observer}. observer.targetObserver: ${observer.targetObserver}, observer.parentObserver: ${observer.parentObserver}`)

  let parentElement = null

  if (observer.parentObserver === null && observer.enabled) {
    logger.log(`creating parentObserver ${observer.name}`)

    const combinedSelector = `${observer.parentSelector}${nonHiddenElements}`

    const { newObserver, element } = await trackElementWithObserver(observer.name, combinedSelector, document.body, observer.parentObsOptions)

    observer.parentObserver = newObserver
    parentElement = element

    if (parentElement) {
      disconnectObserver(observer, 'parent')
      return parentElement
    }
  } else if (observer.parentObserver !== null && !observer.enabled) {
    logger.log(`disconnecting parentObserver ${observer.name}`)

    disconnectObserver(observer, 'parent')
  }

  return parentElement
}

async function manageTargetObserver(observer, parentElement) {
  if (observer.targetObserver === null && observer.enabled) {
    logger.log(`creating targetObserver ${observer.name}`)

    const combinedSelector = `${observer.targetSelector}${nonHiddenElements}`
    const { newObserver, element } = await trackElementWithObserver(observer.name, combinedSelector, parentElement, observer.targetObsOptions)

    const targetElement = element
    observer.targetObserver = newObserver

    if (targetElement) {
      hideElement(targetElement)
      disconnectObserver(observer, 'target')
      disconnectObserver(observer, 'parent')
      // run target observer again
      manageTargetObserver(observer, parentElement)
    }
  } else if (observer.targetObserver !== null && !observer.enabled) {
    disconnectObserver(observer, 'target')
  }
}

function disconnectObserver(observer, type) {
  if (type === 'target' && observer.targetObserver !== null) {
    observer.targetObserver.disconnect()
    observer.targetObserver = null
    logger.log(`targetObserver disconnected for ${observer.name}`)
  } else if (type === 'parent' && observer.parentObserver !== null) {
    observer.parentObserver.disconnect()
    observer.parentObserver = null
    logger.log(`parentObserver disconnected for ${observer.name}`)
  } else {
    logger.log(`disconnectObserver called for ${observer.name}, type: ${type}, with observer instance === null. observer.targetObserver: ${observer.targetObserver}, observer.parentObserver: ${observer.parentObserver}`)
  }
}
