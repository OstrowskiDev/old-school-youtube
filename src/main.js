consoleTranslation('extension-initialized', 'highlight blue')

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
  console.log(`[Old School YouTube]: Navigation triggered`)
  console.log(`[Old School YouTube]: currentPathname: ${currentPathname}`)

  // disable/enable observers according to the current pathname
  observersData.forEach((observer) => {
    try {
      const regex = new RegExp(observer.regex)

      if (regex.test(currentPathname)) {
        console.log(`[Old School YouTube]: Enabling observer ${observer.name}`)
        observer.enabled = true
      } else {
        console.log(`[Old School YouTube]: Disabling observer ${observer.name}`)
        observer.enabled = false
      }
    } catch (error) {
      console.error(`[Old School YouTube]: Error processing observer ${observer.name}:`, error)
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
  console.log(`[Old School YouTube]: findAndHideElement called for ${observer.name}`)
  const parentElement = await manageParentObserver(observer)

  if (parentElement) {
    console.log(`[Old School YouTube]: parentElement found, initializing manageTargetObserver for ${observer.name}`)
    await manageTargetObserver(observer, parentElement)
  }
}

function hideElement(element) {
  console.log(`[Old School YouTube]: hideElement func called =]`)
  consoleTranslation('element-hidden!', 'highlight blue')

  if (!element.hasAttribute('hidden')) {
    element.setAttribute('hidden', true)
  }
}

function trackElementWithObserver(observerName, selector, target = document.body, options) {
  console.log(`[Old School YouTube]: trackElementWithObserver triggered, selector: ${observerName}`)

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
  console.log(`[Old School YouTube]: manageParentObserver called for ${observer.name}. parentObserver is null: ${observer.parentObserver === null}, observer is enabled: ${observer.enabled}, observerData is true: ${!!observer}. observer.targetObserver: ${observer.targetObserver}, observer.parentObserver: ${observer.parentObserver}`)

  let parentElement = null

  if (observer.parentObserver === null && observer.enabled) {
    console.log(`[Old School YouTube]: creating parentObserver ${observer.name}`)

    const combinedSelector = `${observer.parentSelector}${nonHiddenElements}`

    const { newObserver, element } = await trackElementWithObserver(observer.name, combinedSelector, document.body, observer.parentObsOptions)

    observer.parentObserver = newObserver
    parentElement = element

    if (parentElement) {
      disconnectObserver(observer, 'parent')
      return parentElement
    }
  } else if (observer.parentObserver !== null && !observer.enabled) {
    console.log(`[Old School YouTube]: disconnecting parentObserver ${observer.name}`)

    disconnectObserver(observer, 'parent')
  }

  return parentElement
}

async function manageTargetObserver(observer, parentElement) {
  if (observer.targetObserver === null && observer.enabled) {
    console.log(`[Old School YouTube]: creating targetObserver ${observer.name}`)

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
    console.log(`[Old School YouTube]: targetObserver disconnected for ${observer.name}`)
  } else if (type === 'parent' && observer.parentObserver !== null) {
    observer.parentObserver.disconnect()
    observer.parentObserver = null
    console.log(`[Old School YouTube]: parentObserver disconnected for ${observer.name}`)
  } else {
    console.log(`[Old School YouTube]: disconnectObserver called for ${observer.name}, type: ${type}, with observer instance === null. observer.targetObserver: ${observer.targetObserver}, observer.parentObserver: ${observer.parentObserver}`)
  }
}
