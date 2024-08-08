console.log(`[Old School YouTube] Extension initialized!`)

function runOnPageLoad() {
  const intervalId = setInterval(() => {
    if (document.querySelector('#dismissible.ytd-rich-shelf-renderer')) {
      console.log('[Old School YouTube]', document.querySelector('#dismissible.ytd-rich-shelf-renderer'))
      hideUnwantedContent()
      clearInterval(intervalId)
    }
  }, 500)
}

function hideUnwantedContent() {
  const allElements = document.querySelectorAll('*')
  console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)
  disableShorts(allElements)
  disableMusicSection(allElements)
  console.log(`[Old School YouTube] Welcome back to early YouTube days!`)
}

runOnPageLoad()

function isValidYouTubeUrl(url) {
  return url.hostname === 'www.youtube.com' && (url.pathname === '/' || url.pathname.startsWith('/?'))
}

let lastUrl = new URL(location.href)

function triggerOnNavigation() {
  new MutationObserver(() => {
    const url = new URL(location.href)
    if (url.href !== lastUrl.href) {
      lastUrl = url
      if (isValidYouTubeUrl(url)) {
        console.log(`[Old School YouTube] Url changed, scanning for unwanted content...`)
        triggerWhenShortsVisible()
      }
    }
  }).observe(document, { subtree: true, childList: true })
}
triggerOnNavigation()

// below code for element.getBoundingClientRect approach
//!!! this will not get triggered when video page was hard loaded or was opened as first page from YT SPA, will need to add some code here to handle this exception
function triggerWhenShortsVisible() {
  const shorts = document.querySelector('#dismissible.ytd-rich-shelf-renderer')
  if (!shorts) {
    console.log(`[Old School YouTube] Shorts section not found.`)
    return
  }

  let counter = 0

  function checkVisibility() {
    counter++
    if (counter > 20) {
      return
    }

    const rect = shorts.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      console.log(`[Old School YouTube] Shorts not ready to be disabled, waiting 100ms...`)
      setTimeout(checkVisibility, 500)
    } else {
      console.log(`[Old School YouTube] Removing Shorts section...`)
      hideUnwantedContent()
    }
  }
  checkVisibility()
}

function disableShorts(allElements) {
  const shortsElements = Array.from(allElements).filter((element) => element.id === 'dismissible' && element.classList.contains('ytd-rich-shelf-renderer'))
  console.log(`[Old School YouTube] Disabling Shorts...`)

  if (shortsElements.length > 0) {
    shortsElements.forEach((shorts) => {
      shorts.style.display = 'none'
    })
    console.log(`[Old School YouTube] Shorts disabled!`)
  } else {
    console.log(`[Old School YouTube] Error! Shorts ont found.`)
  }
}

function disableMusicSection(allElements) {
  const musicElements = Array.from(allElements).filter((element) => element.id === 'dismissible' && element.classList.contains('ytd-statement-banner-renderer'))
  console.log(`[Old School YouTube] Disabling Music section...`)

  if (musicElements.length > 0) {
    musicElements.forEach((music) => {
      music.style.display = 'none'
    })
    console.log(`[Old School YouTube] Music section disabled!`)
  } else {
    console.log(`[Old School YouTube] Error! Music section ont found.`)
  }
}
