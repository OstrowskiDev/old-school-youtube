consoleTranslation('extension-initialized', 'highlight blue')

let lastPathname = window.location.pathname
let currentPathname = window.location.pathname

const pathNameObserver = watchPathnameChanges()

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
  // disable/enable observers according to the current pathname
  observerData.forEach((observer) => {
    if (observer.regex.test(currentPathname)) {
      observer.enabled = true
    } else {
      observer.enabled = false
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

function hideElement(selector) {
  console.log('if this logs i will be very happy')
}

function trackElementWithObserver(selector, target = document.body, { childList = true, subtree = true } = {}) {
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
  if (parentObserver === null && enabled) {
    const elementAndObserver = await trackElementWithObserver(parentSelector, document.body, { childList: childList, subtree: subtree })
    return elementAndObserver
  } else if (parentObserver !== null && !enabled) {
    parentObserver.disconnect()
    parentObserver = null
  }
  return { element: null, observer: parentObserver }
}

async function manageTargetObserver(targetSelector, enabled, targetObserver = null, parentElement, { childList = false, subtree = false } = {}) {
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
