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
  // disable/enable observers according to the current pathname
  console.log(`[Old School YouTube]: currentPathname: ${currentPathname}`)
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

  // version 1: no callback:
  // observersData.forEach((observer) => {
  //   const promise = (async () => {
  //     const { name, enabled, parentSelector, targetSelector, parentObserver, targetObserver } = observer

  //     const results = await manageParentObserver(parentSelector, enabled, parentObserver, name)
  //     const parentElement = results.element
  //     observer.parentObserver = results.observer

  //     if (parentElement) {
  //       console.log(`[Old School YouTube]: parentElement found, initializing manageTargetObserver for ${observer.name}`)
  //       const results2 = await manageTargetObserver(targetSelector, enabled, targetObserver, parentElement, name)
  //       observer.targetObserver = results2.observer
  //     }
  //   })()
  //   observerPromises.push(promise)
  // })

  // version 2: callback function
  observersData.forEach((observer) => {
    const promise = findAndHideElement(observer)
    observerPromises.push(promise)
  })

  // Await all promises concurrently
  await Promise.all(observerPromises)
}

async function findAndHideElement(observer) {
  console.log(`[Old School YouTube]: findAndHideElement called`)
  const { name, enabled, parentSelector, targetSelector, parentObserver, targetObserver } = observer

  const results = await manageParentObserver(parentSelector, enabled, parentObserver, name)
  const parentElement = results.element
  observer.parentObserver = results.observer

  if (parentElement) {
    console.log(`[Old School YouTube]: parentElement found, initializing manageTargetObserver for ${observer.name}`)
    const results2 = await manageTargetObserver(targetSelector, enabled, targetObserver, parentElement, name)
    observer.targetObserver = results2.observer
  }
}

function hideElement(element) {
  console.log(`[Old School YouTube]: If this logs i will be very happy =]`)
  consoleTranslation('element-hidden!', 'highlight blue')

  if (!element.hasAttribute('hidden')) {
    element.setAttribute('hidden', true)
  }
}

function trackElementWithObserver(selector, target = document.body, observerName, { childList = true, subtree = true } = {}) {
  console.log(`[Old School YouTube]: trackElementWithObserver triggered, selector: ${observerName}`)

  return new Promise((resolve) => {
    let observer = null
    let element = document.querySelector(selector)
    if (element) {
      return resolve({ element: element, observer: observer })
    }
    observer = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        resolve({ element: element, observer: observer })
        observer.disconnect()
        observer = null
      }
    })
    console.log(`[Old School YouTube]: childList: ${childList}, subtree: ${subtree}`)
    observer.observe(target, { childList: childList, subtree: subtree })
  })
}

async function manageParentObserver(parentSelector, enabled, parentObserver = null, name, { childList = true, subtree = true } = {}) {
  // console.log(`[Old School YouTube]: manageParentObserver triggered, parentSelector: ${parentSelector}`)

  if (parentObserver === null && enabled) {
    console.log(`[Old School YouTube]: creating parentObserver ${name}`)
    const elementAndObserver = await trackElementWithObserver(parentSelector, document.body, name, { childList: childList, subtree: subtree })
    return elementAndObserver
  } else if (parentObserver !== null && !enabled) {
    console.log(`[Old School YouTube]: disconnecting parentObserver ${name}`)
    parentObserver.disconnect()
    parentObserver = null
  }
  // console.log(`[Old School YouTube]: awesome path triggered: parentObserver: ${parentObserver !== null}, enabled: ${enabled}`)

  return { element: null, observer: parentObserver }
}

async function manageTargetObserver(targetSelector, enabled, targetObserver = null, parentElement, name, { childList = true, subtree = true } = {}) {
  console.log(`[Old School YouTube]: manageTargetObserver triggered`)

  let results = null
  if (targetObserver === null && enabled) {
    const combinedSelector = `${targetSelector}${nonHiddenElements}`
    results = await trackElementWithObserver(combinedSelector, parentElement, name, { childList: childList, subtree: subtree })
    const targetElement = results.element
    targetObserver = results.observer
    if (targetElement) {
      hideElement(targetElement)
      targetObserver.disconnect()
      targetObserver = null
      //!tests: run the parent observer again
      //!change: this is not good function name, it represents just part of its functionality but managing observer part is not indicated in the name
      findAndHideElement(observer)
    }
  } else if (targetObserver !== null && !enabled) {
    targetObserver.disconnect()
    targetObserver = null
  }
}
