let oldPathname = location.pathname
let currentPathname = location.pathname

let homePageShortsObserverActive = false
let searchPageShortsObserverActive = false

//home page shorts containers hierarchy:
let homePageRichContentContainerSelector = '#contents.ytd-rich-grid-renderer'
let homePageContentGridSelector = '#content.ytd-rich-section-renderer'
let homePageShortsSelector = 'ytd-rich-shelf-renderer'
//search results page shorts containers hierarchy:
let searchPageResultsContainerSelector = '#contents.ytd-item-section-renderer'
let searchPageShortsSelector = 'ytd-reel-shelf-renderer:not([hidden="true"])'
// others:
let homePagePremiumMusicPromptSelector = 'ytd-statement-banner-renderer'
let homePagePremiumAccountPromptSelector = 'need to add this'
let videoPageShortsSelector = 'need to add this'

let hideShortsOnHomePage = true
let hidePremiumMusicPromptOnHomePage = true
let hidePremiumAccountPromptOnHomePage = true
let hideShortsOnVideoPage = true

console.log(chrome.i18n.getMessage('extension-initialized'))
listenForPathnameChange()
hideHomePageShorts()
hideSearchPageShorts()

function handleNavigation() {
  if (currentPathname === '/') {
    console.log('[Old School YouTube]: Home page detected')
    hideHomePageShorts()
  } else if (currentPathname.startsWith('/watch')) {
    console.log('[Old School YouTube]: Video page detected')
  } else if (currentPathname.startsWith('/results')) {
    hideSearchPageShorts()
    console.log('[Old School YouTube]: Search page detected')
  } else {
    console.log('[Old School YouTube]: Where am I?')
  }
}

function listenForPathnameChange() {
  setInterval(() => {
    currentPathname = location.pathname
    if (oldPathname !== currentPathname) {
      handleNavigation()
      oldPathname = currentPathname
    }
  }, 500)
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

// home page has one shorts section that generates on page load
function hideHomePageShorts(hide = true) {
  if (homePageShortsObserverActive) return
  homePageShortsObserverActive = true

  waitForElement(homePageRichContentContainerSelector, document.body)
    .then((wrapperElement1) => {
      return waitForElement(homePageContentGridSelector, wrapperElement1)
    })
    .then((wrapperElement2) => {
      return waitForElement(homePageShortsSelector, wrapperElement2)
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideHomePageShorts: ${error}`)
    })
    .finally(() => {
      homePageShortsObserverActive = false
    })
}

// serach page has multiple shorts sections, they generate while user is scrolling down
function hideSearchPageShorts(hide = true) {
  if (searchPageShortsObserverActive) return
  searchPageShortsObserverActive = true

  waitForElement(searchPageResultsContainerSelector, document.body)
    .then((wrapperElement1) => {
      return waitForElement(searchPageShortsSelector, wrapperElement1, { childList: true, subtree: false })
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideSearchPageShorts: ${error}`)
    })
    .finally(() => {
      searchPageShortsObserverActive = false
    })
}
