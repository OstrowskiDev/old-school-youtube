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

function onNavigationChange() {
  for (const observer of observersData) {
    const { enabled, pathName, parentSelector, targetSelector, parentObserver, targetObserver } = observer
    // check pathName and set enabled accordingly
    // for better clarity manageObserver function should be divided to manageParentObserver and manageTargetObserver, with return values their respective observers
    const results = manageParentObserver(parentSelector, enabled, parentObserver)
    const parentElement = results.targetElement
    parentObserver = results.parentObserver
    targetObserver = manageTargetObserver(targetSelector, enabled, targetObserver, parentElement)
  }
}

function hideElement(selector) {
  //code here
}

function observeDelayedElement(selector, target = document.body, { childList = true, subtree = true } = {}) {
  return new Promise((resolve) => {
    let observer = null
    let element = document.querySelector(selector)
    if (element) {
      return resolve({ element, observer })
    }
    observer = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        resolve({ element, observer })
        observer.disconnect()
      }
    })
    observer.observe(target, { childList: childList, subtree: subtree })
  })
}

function manageParentObserver(parentSelector, enabled, parentObserver = null, { childList = false, subtree = false } = {}) {
  // results: {parentElement, parentObserver}
  let results = null
  if (parentObserver === null && enabled) {
    results = observeDelayedElement(parentSelector, document.body, { childList: childList, subtree: subtree })
  } else if (parentObserver !== null && !enabled) {
    parentObserver.disconnect()
    parentObserver = null
  }
  return { results }
}

function manageTargetObserver(targetSelector, enabled, targetObserver = null, parentElement, { childList = false, subtree = false } = {}) {
  let results = null
  if (targetObserver === null && enabled) {
    results = observeDelayedElement(targetSelector, parentElement, { childList: childList, subtree: subtree })
    const targetElement = results.targetElement
    targetObserver = results.targetObserver
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

// function manageDblObserver(parentSelector, targetSelector, enabled, callback, parentObserver = null, targetObserver = null, { childList = false, subtree = false, attributes = false } = {}) {
//   if (targetObserver !== null && !enabled) {
//     targetObserver.disconnect()
//     targetObserver = null
//   }
//   if (parentObserver === null && enabled) {
//     observeDelayedElement(parentSelector, document.body)
//       .then((parentElement) => {
//         return observeDelayedElement(targetSelector, parentElement)
//       })
//       .then((targetElement) => {
//         parentObserver = new MutationObserver(callback)
//         parentObserver.observe(targetElement, { childList: childList, subtree: subtree, attributes: attributes })
//       })
//   } else if (parentObserver !== null && !enabled) {
//     parentObserver.disconnect()
//     parentObserver = null
//   }
//   return parentObserver
// }
