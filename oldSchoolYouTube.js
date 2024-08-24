let oldPathname = location.pathname
let currentPathname = location.pathname

let homePageShortsObserverActive = false
let searchPageShortsObserverActive = false

let homePageShortsObserverControl = { isActive: false, runObserver: true }
let searchPageShortsObserverControl = { isActive: false, runObserver: true }

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
hideContentByPathname()

function hideContentByPathname() {
  if (currentPathname === '/') {
    console.log('[Old School YouTube]: Home page detected')
    homePageShortsObserverControl.runObserver = true
    searchPageShortsObserverControl.runObserver = false
    hideHomePageShorts()
  } else if (currentPathname.startsWith('/watch')) {
    console.log('[Old School YouTube]: Video page detected')
    homePageShortsObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = false
  } else if (currentPathname.startsWith('/results')) {
    console.log('[Old School YouTube]: Search page detected')
    homePageShortsObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = true
    hideSearchPageShorts()
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

function handleNavigation() {
  hideContentByPathname()
}

function waitForElement(selector, observeElement = document.body, observerControl, { childList = true, subtree = true } = {}) {
  return new Promise((resolve) => {
    console.log(`[Old School YouTube]: Running waitForElement func with selector: ${selector}, runObserver: ${observerControl.runObserver} `)
    if (!observerControl.runObserver) {
      return resolve(null)
    }

    let element = document.querySelector(selector)
    if (element) {
      return resolve(element)
    }
    let intervalId = null
    const elementObserver = new MutationObserver(() => {
      console.log(`[Old School YouTube]: MUTATION OBSERVER CALLBACK TRIGGERED`)
      const observerParams = { intervalId, observerControl, elementObserver, selector, resolve }
      intervalId = disconnectObserverAfterNavigation(observerParams)
      element = document.querySelector(selector)
      if (element) {
        resolve(element)
        clearInterval(intervalId)
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

// home page has one shorts section that is rendered in random height of page, this means that sometimes user needs to scroll down to trigger its rendering
function hideHomePageShorts(hide = true) {
  if (homePageShortsObserverActive) return
  homePageShortsObserverActive = true

  waitForElement(homePageRichContentContainerSelector, document.body, homePageShortsObserverControl)
    .then((wrapperElement1) => {
      return waitForElement(homePageContentGridSelector, wrapperElement1, homePageShortsObserverControl)
    })
    .then((wrapperElement2) => {
      return waitForElement(homePageShortsSelector, wrapperElement2, homePageShortsObserverControl)
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
        console.log(`[Old School YouTube]: Shorts on homepage hidden!`)
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

  waitForElement(searchPageResultsContainerSelector, document.body, searchPageShortsObserverControl)
    .then((wrapperElement1) => {
      return waitForElement(searchPageShortsSelector, wrapperElement1, searchPageShortsObserverControl, { childList: true, subtree: false })
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

function disconnectObserverAfterNavigation({ intervalId, observerControl, elementObserver, selector, resolve }) {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      console.log(`[Old School YouTube]: Running interval, listening for ${selector} changes`)
      if (!observerControl.runObserver) {
        console.log(`[Old School YouTube]: Observer for ${selector} stopped`)
        elementObserver.disconnect()
        clearInterval(intervalId)
        return resolve(null)
      }
    }, 2000)
  }
  return intervalId
}
