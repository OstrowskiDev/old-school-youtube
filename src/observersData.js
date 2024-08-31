let homePageShortsObserver = null
let searchPageShortsObserver = null
let channelPageShortsObserver = null
let homePagePremiumMusicPromptsObserver = null

observersData = [
  {
    enabled: false,
    pathName: '/',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-rich-section-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    enabled: false,
    pathName: '/results?',
    parentSelector: '#container.ytd-search',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    enabled: false,
    pathName: '/@',
    parentSelector: 'ytd-browse',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    enabled: false,
    pathName: '/',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-statement-banner-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
]
