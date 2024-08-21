// 'hp' prefix and 'HP' suffix used in variable names stans for 'home page'

console.log(`[Old School YouTube]: Extension initialized!`)

let homePageRichContentContainerSelector = '#contents.ytd-rich-grid-renderer'
// grid container, currently only has shorts section:
let homePageContentGridSelector = '#content.ytd-rich-section-renderer'
let homePageShortsSelector = 'ytd-rich-shelf-renderer'
let homePagePremiumMusicPromptSelector = 'ytd-statement-banner-renderer'
let homePagePremiumAccountPromptSelector = 'need to add this'
let videoPageShortsSelector = 'need to add this'

let hideShortsOnHomePage = true
let hidePremiumMusicPromptOnHomePage = true
let hidePremiumAccountPromptOnHomePage = true
let hideShortsOnVideoPage = true

hideHomePageShortsCallback()

// const homePageShortsObserver = manageObserver(homePageShortsSelector, hideShortsOnHomePage, hideHomePageShortsCallback, homePageShortsObserver, { childList: true, subtree: true })

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
        console.log(`[Old School YouTube]: Element found!`)
        console.log(`[Old School YouTube]: Disconnecting observer...`)
        elementObserver.disconnect()
      }
    })
    elementObserver.observe(observeElement, { childList: childList, subtree: subtree })
  })
}

function hideElement(hide, element, onHideCallback = () => {}) {
  console.log(`[Old School YouTube]: Initializing hideElement func...`)

  if (hide) {
    console.log(`[Old School YouTube]: hide is true`)

    if (!element.hasAttribute('hidden')) {
      console.log(`[Old School YouTube]: setting hidden attribute to true`)

      element.setAttribute('hidden', true)
      onHideCallback()
    }
  } else if (element.hasAttribute('hidden')) {
    element.removeAttribute('hidden')
  }
}

function hideHomePageShortsCallback(hide = true) {
  console.log(`[Old School YouTube]: Initializing ShortsCallback...`)
  waitForElement(homePageRichContentContainerSelector, document.body)
    .then((wrapperElement1) => {
      return waitForElement(homePageContentGridSelector, wrapperElement1)
    })
    .then((wrapperElement2) => {
      return waitForElement(homePageShortsSelector, wrapperElement2)
    })
    .then((element) => {
      if (element != null) {
        console.log(`[Old School YouTube]: element is not null`)
        hideElement(hide, element)
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideHomePageShortsCallback: ${error}`)
    })
}

// function manageObserver(selector, active, callback, aObserver = null, { childList = false, subtree = false, attributes = false } = {}) {
//   if (aObserver === null && active) {
//     waitForElement(selector, document.body).then((node) => {
//       aObserver = new MutationObserver(callback)
//       aObserver.observe(node, { childList: childList, subtree: subtree, attributes: attributes })
//     })
//   } else if (aObserver !== null && !active) {
//     aObserver.disconnect()
//     aObserver = null
//   }
//   return aObserver
// }

// function waitForElementTimeout(selector, observeElement = document.body, { childList = true, subtree = true, timeout_ms = 150 } = {}) {
//   return new Promise((resolve) => {
//     let element = document.querySelector(selector)
//     if (element) {
//       return resolve(element)
//     }
//     let timer = null
//     const elementObserver = new MutationObserver(() => {
//       element = document.querySelector(selector)
//       if (element) {
//         clearTimeout(timer)
//         resolve(element)
//         elementObserver.disconnect()
//       }
//     })
//     elementObserver.observe(observeElement, { childList: childList, subtree: subtree })
//     if (timeout_ms > 0)
//       timer = setTimeout(() => {
//         resolve(null)
//         elementObserver.disconnect()
//       }, timeout_ms)
//   })
// }

// function hidingShortsTimeout(callback, timeMs) {
//   if (isHidingShortsTimeoutActive) return
//   isHidingShortsTimeoutActive = true
//   timeoutId = setTimeout(() => {
//     callback()
//     isHidingShortsTimeoutActive = false
//   }, timeMs)
// }

// function clearShortsTimeout() {
//   clearTimeout(timeoutId)
//   isHidingShortsTimeoutActive = false
// }
