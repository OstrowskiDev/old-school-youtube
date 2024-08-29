let homePageShortsObserver = null
let searchPageShortsObserver = null
let channelPageShortsObserver = null
let homePagePremiumMusicPromptsObserver = null

observersData = [
  {
    isActive: false,
    pathName: '/',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-rich-section-renderer',
    observerId: homePageShortsObserver,
  },
  {
    isActive: false,
    pathName: '/results?',
    parentSelector: '#container.ytd-search',
    targetSelector: 'ytd-reel-shelf-renderer',
    observerId: searchPageShortsObserver,
  },
  {
    isActive: false,
    pathName: '/@',
    parentSelector: 'ytd-browse',
    targetSelector: 'ytd-reel-shelf-renderer',
    observerId: channelPageShortsObserver,
  },
  {
    isActive: false,
    pathName: '/',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-statement-banner-renderer',
    observerId: homePagePremiumMusicPromptsObserver,
  },
]
