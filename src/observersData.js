console.log(`[Old Shool YouTube]: observersData loaded`)

const observersData = [
  {
    name: 'homepageShorts',
    enabled: false,
    regex: '^/$',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-rich-section-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
  {
    name: 'homepagePremiumMusicPrompt',
    enabled: false,
    regex: '^/$',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-statement-banner-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
  {
    name: 'resultsPageShorts',
    enabled: false,
    regex: '^/results',
    parentSelector: '#container.ytd-search',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
  {
    name: 'channelPageShorts',
    enabled: false,
    regex: '^/@',
    parentSelector: 'ytd-browse',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
  {
    name: 'subscriptionPageShorts',
    enabled: false,
    regex: '^/feed',
    parentSelector: 'ytd-browse',
    targetSelector: 'ytd-rich-section-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
  {
    name: 'VideoPageShorts',
    enabled: false,
    regex: '^/watch',
    parentSelector: '#items.ytd-watch-next-secondary-results-renderer',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserver: null,
    targetObserver: null,
    parentObsOptions: { childList: true, subtree: true },
    targetObsOptions: { childList: true, subtree: true },
  },
]
