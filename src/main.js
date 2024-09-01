console.log(`[Old Shool YouTube]: main.js file loaded`)

// consoleTranslation func is crushing the app, need to figure out why later
consoleTranslation('extension-initialized', 'highlight blue')
// not anymore, the reason was order of elements inside content scripts array in manifest.json

let lastPathname = window.location.pathname
let currentPathname = window.location.pathname

const pathNameObserver = watchPathnameChanges()
onNavigationChange()
// setTimeout(onNavigationChange, 500)

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
  console.log(`[Old Shool YouTube]: Navigation triggered`)
  // disable/enable observers according to the current pathname
  console.log(`[Old Shool YouTube]: currentPathname: ${currentPathname}`)
  observersData.forEach((observer) => {
    try {
      const regex = new RegExp(observer.regex)
      if (regex.test(currentPathname)) {
        console.log(`[Old Shool YouTube]: Enabling observer ${observer.name}`)
        observer.enabled = true
      } else {
        console.log(`[Old Shool YouTube]: Disabling observer ${observer.name}`)
        observer.enabled = false
      }
    } catch (error) {
      console.error(`[Old Shool YouTube]: Error processing observer ${observer.name}:`, error)
    }
  })

  const observerPromises = []

  observersData.forEach((observer) => {
    const promise = (async () => {
      const { enabled, parentSelector, targetSelector, parentObserver, targetObserver } = observer

      const results = await manageParentObserver(parentSelector, enabled, parentObserver)
      const parentElement = results.element
      observer.parentObserver = results.observer

      if (parentElement) {
        const results2 = await manageTargetObserver(targetSelector, enabled, targetObserver, parentElement)
        observer.targetObserver = results2.observer
      }
    })()
    observerPromises.push(promise)
  })

  // Await all promises concurrently
  await Promise.all(observerPromises)
}

function hideElement(element) {
  console.log(`[Old Shool YouTube]: If this logs i will be very happy =]`)
  consoleTranslation('element-hidden!', 'highlight blue')

  if (!element.hasAttribute('hidden')) {
    element.setAttribute('hidden', true)
  }
}

function trackElementWithObserver(selector, target = document.body, { childList = true, subtree = true } = {}) {
  console.log(`[Old Shool YouTube]: trackElementWithObserver triggered, selector: ${selector}`)

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
      }
    })
    observer.observe(target, { childList: childList, subtree: subtree })
  })
}

async function manageParentObserver(parentSelector, enabled, parentObserver = null, { childList = false, subtree = false } = {}) {
  console.log(`[Old Shool YouTube]: manageParentObserver triggered, parentSelector: ${parentSelector}`)

  if (parentObserver === null && enabled) {
    console.log(`[Old Shool YouTube]: creating parentObserver`)
    const elementAndObserver = await trackElementWithObserver(parentSelector, document.body, { childList: childList, subtree: subtree })
    return elementAndObserver
  } else if (parentObserver !== null && !enabled) {
    console.log(`[Old Shool YouTube]: disconnecting parentObserver`)
    parentObserver.disconnect()
    parentObserver = null
  }
  console.log(`[Old Shool YouTube]: awesome path triggered: parentObserver: ${parentObserver !== null}, enabled: ${enabled}`)

  return { element: null, observer: parentObserver }
}

async function manageTargetObserver(targetSelector, enabled, targetObserver = null, parentElement, { childList = false, subtree = false } = {}) {
  console.log(`[Old Shool YouTube]: manageTargetObserver triggered`)

  let results = null
  if (targetObserver === null && enabled) {
    results = await trackElementWithObserver(targetSelector, parentElement, { childList: childList, subtree: subtree })
    const targetElement = results.element
    targetObserver = results.observer
    if (targetElement) {
      hideElement(targetElement)
      targetObserver.disconnect()
      targetObserver = null
    }
  } else if (targetObserver !== null && !enabled) {
    targetObserver.disconnect()
    targetObserver = null
  }
}
