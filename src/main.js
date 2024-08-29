consoleTranslation('extension-initialized', 'highlight blue')

function getDelayedElement(selector, target = document.body, { childList = true, subtree = true } = {}) {
  return new Promise((resolve) => {
    let element = document.querySelector(selector)
    if (element) {
      return resolve(element)
    }
    const observer = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        resolve(element)
        observer.disconnect()
      }
    })
    observer.observe(target, { childList: childList, subtree: subtree })
  })
}

function manageObserver(selector, isActive, callback, observer = null, { childList = false, subtree = false, attributes = false } = {}) {
  if (observer === null && isActive) {
    waitForElement(selector, document.body).then((node) => {
      observer = new MutationObserver(callback)
      observer.observe(node, { childList: childList, subtree: subtree, attributes: attributes })
    })
  } else if (observer !== null && !isActive) {
    observer.disconnect()
    observer = null
  }
  return observer
}
