let oldPathname = location.pathname
let currentPathname = location.pathname

let homePageShortsObserverActive = false
let homePagePremiumMusicObserverActive = false
let searchPageShortsObserverActive = false
let channelPageShortsObserverActive = false
let homePagePremMusicObserverActive = false

let homePageShortsObserverControl = { observerName: 'homeShorts', isActive: false, runObserver: true }
let homePagePremiumMusicObserverControl = { observerName: 'homePremiumMusicPrompt', isActive: false, runObserver: true }
let searchPageShortsObserverControl = { observerName: 'searchShorts', isActive: false, runObserver: true }
let channelPageShortsObserverControl = { observerName: 'channelShorts', isActive: false, runObserver: true }

//home page shorts containers hierarchy:
let homePageShortsParentSelector = '#contents.ytd-rich-grid-renderer'
let homePageShortsSelector = 'ytd-rich-section-renderer:not([hidden]):not([style*="display: none"])'

//search results page shorts containers hierarchy:
let searchPageResultsContainerSelector = '#container.ytd-search'
let searchPageShortsSelector = 'ytd-reel-shelf-renderer:not([hidden]):not([style*="display: none"])'

//channel page shorts containers hierarchy:
let channelPageResultsContainerSelector = 'ytd-browse:not([hidden]):not([style*="display: none"])'
let channelPageShortsSelector = 'ytd-reel-shelf-renderer:not([hidden]):not([style*="display: none"])'

// home page premium music prompt selector:
let homePagePremiumMusicParentSelector = '#contents.ytd-rich-grid-renderer'
let homePagePremiumMusicSelector = 'ytd-statement-banner-renderer:not([hidden]):not([style*="display: none"])'

// home page premium account prompt selector, haven't seen it for a while, will add it when/if it appears, maybe yt disabled it permanently.
let homePagePremiumAccountPromptSelector = ''

let hideShortsOnHomePage = true
let hidePremiumMusicPromptOnHomePage = true
let hidePremiumAccountPromptOnHomePage = true
let hideShortsOnVideoPage = true

consoleTranslation('extension-initialized', 'highlight blue')
listenForPathnameChange()
hideContentByPathname()

function hideContentByPathname() {
  if (currentPathname === '/') {
    console.log('[Old School YouTube]: Home page detected')
    homePageShortsObserverControl.runObserver = true
    homePagePremiumMusicObserverControl.runObserver = true
    searchPageShortsObserverControl.runObserver = false
    channelPageShortsObserverControl.runObserver = false
    hideHomePageShorts()
    // hideHomePagePremiumMusic()
  } else if (currentPathname.startsWith('/watch')) {
    console.log('[Old School YouTube]: Video page detected')
    homePageShortsObserverControl.runObserver = false
    homePagePremiumMusicObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = false
    channelPageShortsObserverControl.runObserver = false
  } else if (currentPathname.startsWith('/results')) {
    console.log('[Old School YouTube]: Search page detected')
    homePageShortsObserverControl.runObserver = false
    homePagePremiumMusicObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = true
    channelPageShortsObserverControl.runObserver = false
    hideSearchPageShorts()
  } else if (currentPathname.startsWith('/@')) {
    console.log('[Old School YouTube]: Channel page detected')
    homePageShortsObserverControl.runObserver = false
    homePagePremiumMusicObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = false
    channelPageShortsObserverControl.runObserver = true
    hideChannelPageShorts()
  } else {
    console.log('[Old School YouTube]: Where am I?')
    homePageShortsObserverControl.runObserver = false
    homePagePremiumMusicObserverControl.runObserver = false
    searchPageShortsObserverControl.runObserver = false
    channelPageShortsObserverControl.runObserver = false
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
  console.log(`[Old School YouTube]: Observer subtrees: ${subtree}, childList: ${childList}`)
  return new Promise((resolve) => {
    console.log(`[Old School YouTube]: Running waitForElement func with selector: ${selector}, observer: ${observerControl.observerName}, runObserver: ${observerControl.runObserver} `)
    if (!observerControl.runObserver) {
      console.log(`[Old School YouTube]: Observer ${observerControl.observerName} stopped, because runObserver is false`)
      return resolve(null)
    }

    let element = document.querySelector(selector)
    if (element) {
      console.log(`[Old School YouTube]: Element ${selector} found on initial load!`)
      return resolve(element)
    }
    let intervalId = null
    const elementObserver = new MutationObserver(() => {
      console.log(`%c[Old School YouTube]: Observer: ${observerControl.observerName} detected changes in ${observeElement} children`, 'color: blue; font-weight: bold;')
      element = document.querySelector(selector)
      if (element) {
        resolve(element)
        clearInterval(intervalId)
        elementObserver.disconnect()
      }
    })
    elementObserver.observe(observeElement, { childList: childList, subtree: subtree })
    console.log(`[Old School YouTube]: Observer ${observerControl.observerName} initialized`)
    const observerParams = { intervalId, observerControl, elementObserver, selector, resolve }
    intervalId = disconnectObserverAfterNavigation(observerParams)
    console.log(`[Old School YouTube]: Interval initialized for ${observerControl.observerName}`)
  })
}

function hideElement(hide, element) {
  if (hide) {
    if (!element.hasAttribute('hidden')) {
      element.setAttribute('hidden', true)
    }
  } else if (element.hasAttribute('hidden')) {
    element.removeAttribute('hidden')
  }
}

// home page has one shorts section that is rendered in random height of page, this means that sometimes user needs to scroll down to trigger its rendering
function hideHomePageShorts(hide = true) {
  console.log(`[Old School YouTube]: hideHomePageShorts called`)
  if (homePageShortsObserverActive) return
  homePageShortsObserverActive = true
  console.log(`[Old School YouTube]: hideHomePageShorts activated!`)

  waitForElement(homePageShortsParentSelector, document.body, homePageShortsObserverControl, { childList: true, subtree: true })
    .then((wrapperElement1) => {
      return waitForElement(homePageShortsSelector, wrapperElement1, homePageShortsObserverControl, { childList: true, subtree: false })
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
        consoleTranslation('shorts-hidden-on-homepage', 'highlight green')
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideHomePageShorts: ${error}`)
    })
    .finally(() => {
      homePageShortsObserverActive = false
    })
}

function hideHomePagePremiumMusic(hide = true) {
  if (homePagePremiumMusicObserverActive) return
  homePagePremiumMusicObserverActive = true

  waitForElement(homePagePremiumMusicParentSelector, document.body, homePagePremiumMusicObserverControl, { childList: true, subtree: true })
    .then((wrapperElement) => {
      return waitForElement(homePagePremiumMusicSelector, wrapperElement, homePagePremiumMusicObserverControl, { childList: true, subtree: false })
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
        consoleTranslation('premium-music-prompt-hidden-on-homepage', 'highlight green')
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideHomePageShorts: ${error}`)
    })
    .finally(() => {
      homePagePremiumMusicObserverActive = false
    })
}

// serach page has multiple shorts sections, they generate while user is scrolling down
async function hideSearchPageShorts(hide = true) {
  //run observer all the time until user navigates to another page
  while (searchPageShortsObserverControl.runObserver) {
    try {
      // !test-logic
      addTestCounter()
      const result = await hideOneShortsContainerOnSearchPage()
    } catch (error) {
      console.error(`[Old School YouTube] Error in hideSearchPageShorts: ${error}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}
// refactor this baby to be async
async function hideOneShortsContainerOnSearchPage(hide = true) {
  console.log(`[Old School YouTube]: Running hide search page shorts func!`)
  console.log(`[Old School YouTube]: searchPageShortsObserverActive: ${searchPageShortsObserverActive}`)

  if (searchPageShortsObserverActive) return
  searchPageShortsObserverActive = true

  try {
    const wrapperElement1 = await waitForElement(searchPageResultsContainerSelector, document.body, searchPageShortsObserverControl)
    console.log(`[Old School YouTube]: Passing wrapperElement1!`)

    const element = await waitForElement(searchPageShortsSelector, wrapperElement1, searchPageShortsObserverControl, { childList: true, subtree: true })

    if (element != null) {
      consoleTranslation('shorts-hidden-on-search-page', 'highlight green')
      hideElement(hide, element)
    }
  } catch (error) {
    console.error(`[Old School YouTube]: Error in hideOneShortsContainerOnSearchPage: ${error}`)
  } finally {
    searchPageShortsObserverActive = false
  }
}

function hideChannelPageShorts(hide = true) {
  console.log(`[Old School YouTube]: hideChannelPageShorts called`)
  if (channelPageShortsObserverActive) return
  channelPageShortsObserverActive = true
  console.log(`[Old School YouTube]: hideChannelPageShorts activated!`)

  waitForElement(channelPageResultsContainerSelector, document.body, channelPageShortsObserverControl)
    .then((wrapperElement1) => {
      return waitForElement(channelPageShortsSelector, wrapperElement1, channelPageShortsObserverControl)
    })
    .then((element) => {
      if (element != null) {
        hideElement(hide, element)
        consoleTranslation('shorts-hidden-on-channel-page', 'highlight green')
      }
    })
    .catch((error) => {
      console.error(`[Old School YouTube]: Error in hideChannelPageShorts: ${error}`)
    })
    .finally(() => {
      channelPageShortsObserverActive = false
    })
}

function disconnectObserverAfterNavigation({ intervalId, observerControl, elementObserver, selector, resolve }) {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      console.log(`[Old School YouTube]: Running interval, listening for ${selector} changes for ${observerControl.observerName}`)
      if (!observerControl.runObserver) {
        console.log(`[Old School YouTube]: Observer ${observerControl.observerName} for ${selector} stopped`)
        elementObserver.disconnect()
        clearInterval(intervalId)
        return resolve(null)
      }
    }, 2000)
  }
  return intervalId
}

function consoleTranslation(message, style = '') {
  let messageStyle
  switch (style) {
    case 'highlight green':
      messageStyle = 'color: green; font-weight: bold;'
      break
    case 'highlight red':
      messageStyle = 'color: red; font-weight: bold;'
      break
    case 'highlight blue':
      messageStyle = 'color: blue; font-weight: bold;'
      break
  }
  return console.log(`%c${chrome.i18n.getMessage(message)}`, messageStyle)
}

// development tests section:
testHideOneShortLoop()
