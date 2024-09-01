console.log(`[Old Shool YouTube]: observersData loaded`)

const observersData = [
  {
    name: 'homepageShorts',
    enabled: false,
    regex: '^/$',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-rich-section-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    name: 'resultsPageShorts',
    enabled: false,
    regex: '^/results',
    parentSelector: '#container.ytd-search',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    name: 'channelPageShorts',
    enabled: false,
    regex: '^/@',
    parentSelector: 'ytd-browse',
    targetSelector: 'ytd-reel-shelf-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
  {
    name: 'homepagePremiumMusicPrompt',
    enabled: false,
    regex: '^/$',
    parentSelector: '#contents.ytd-rich-grid-renderer',
    targetSelector: 'ytd-statement-banner-renderer',
    parentObserverId: null,
    targetObserverId: null,
  },
]
