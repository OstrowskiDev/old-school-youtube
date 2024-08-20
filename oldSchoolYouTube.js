console.log(`[Old School YouTube]: Extension initialized!`)

let mainPageShortsSelector = 'ytd-rich-shelf-renderer'
let mainPagePremiumMusicPromptSelector = 'ytd-statement-banner-renderer'
let mainPagePremiumAccountPromptSelector = 'need to find this'
let videoPageShortsSelector = 'need to find this'

let hideShortsOnMainPage = true
let hidePremiumMusicPromptOnMainPage = true
let hidePremiumAccountPromptOnMainPage = true
let hideShortsOnVideoPage = true

function hideUnwantedContent() {
  disableShorts()
  disableMusicSection(allElements)
}

function waitForElement(selector, observeElement = document.body, { childList = true, subtree = true } = {}) {
  return new Promise((resolve) => {
    let element = document.querySelector(selector)
    if (element) {
      return resolve(element)
    }
    const elementObserver = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        resolve(element)
        elementObserver.disconnect()
      }
    })
    elementObserver.observe(observeElement, { childList: childList, subtree: subtree })
  })
}

function waitForElementTimeout(selector, observeElement = document.body, { childList = true, subtree = true, timeout_ms = 150 } = {}) {
  return new Promise((resolve) => {
    let element = document.querySelector(selector)
    if (element) {
      return resolve(element)
    }
    let timer = null
    const elementObserver = new MutationObserver(() => {
      element = document.querySelector(selector)
      if (element) {
        clearTimeout(timer)
        resolve(element)
        elementObserver.disconnect()
      }
    })
    elementObserver.observe(observeElement, { childList: childList, subtree: subtree })
    if (timeout_ms > 0)
      timer = setTimeout(() => {
        resolve(null)
        elementObserver.disconnect()
      }, timeout_ms)
  })
}

function hideElement(hide, element, onHideCallback = () => {}) {
  if (hide) {
    if (!element.hasAttribute('hidden')) {
      element.setAttribute('hidden', true)
      onHideCallback()
    }
  } else if (element.hasAttribute('hidden')) {
    element.removeAttribute('hidden')
  }
}

function hidingShortsTimeout(callback, timeMs) {
  if (isHidingShortsTimeoutActive) return
  isHidingShortsTimeoutActive = true
  timeoutId = setTimeout(() => {
    callback()
    isHidingShortsTimeoutActive = false
  }, timeMs)
}

function clearShortsTimeout() {
  clearTimeout(timeoutId)
  isHidingShortsTimeoutActive = false
}
