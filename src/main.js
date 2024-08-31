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
    const { isActive, pathName, parentSelector, targetSelector, parentObserver, targetObserver } = observer
    // check pathName and set isActive accordingly
    // for better clarity manageObserver function should be divided to manageParentObserver and manageTargetObserver, with return values their respective observers
    manageObserver(parentSelector, targetSelector, isActive, hideElement, parentObserver, targetObserver)
  }
}

function hideElement(selector) {
  //code here
}

function getDelayedElement(selector, target = document.body, { childList = true, subtree = true } = {}) {
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

function manageParentObserver(parentSelector, targetSelector, isActive, callback, parentObserver = null, targetObserver = null, { childList = false, subtree = false, attributes = false } = {}) {
  if (parentObserver === null && isActive) {
    let parentElement = getDelayedElement(parentSelector, document.body)
  } else if (parentObserver !== null && !isActive) {
    parentObserver.disconnect()
    parentObserver = null
  }
  return parentObserver
}

// function manageDblObserver(parentSelector, targetSelector, isActive, callback, parentObserver = null, targetObserver = null, { childList = false, subtree = false, attributes = false } = {}) {
//   if (targetObserver !== null && !isActive) {
//     targetObserver.disconnect()
//     targetObserver = null
//   }
//   if (parentObserver === null && isActive) {
//     getDelayedElement(parentSelector, document.body)
//       .then((parentElement) => {
//         return getDelayedElement(targetSelector, parentElement)
//       })
//       .then((targetElement) => {
//         parentObserver = new MutationObserver(callback)
//         parentObserver.observe(targetElement, { childList: childList, subtree: subtree, attributes: attributes })
//       })
//   } else if (parentObserver !== null && !isActive) {
//     parentObserver.disconnect()
//     parentObserver = null
//   }
//   return parentObserver
// }
