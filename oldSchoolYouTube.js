console.log(`[Old School YouTube]: Extension initialized!`)

function hideUnwantedContent() {
  disableShorts()
  disableMusicSection(allElements)
}

function disableShorts() {
  const shortsLikeElements = document.querySelectorAll('.ytd-rich-shelf-renderer')
  if (shortsLikeElements) {
  }
  const shortsElements = Array.from(shortsLikeElements).filter((element) => element.id === 'dismissible')

  if (shortsElements.length > 0) {
    shortsElements.forEach((shorts) => {
      shorts.style.display = 'none'
    })
  }
}

function disableMusicSection() {
  const musicSectionLikeElements = document.querySelectorAll('.ytd-statement-banner-renderer')
  const musicSectionElements = Array.from(musicSectionLikeElements).filter((element) => element.id === 'dismissible')

  if (musicSectionElements.length > 0) {
    musicSectionElements.forEach((music) => {
      music.style.display = 'none'
    })
  }
}

let distanceChecked = 0

function scrollListener() {
  window.addEventListener('scroll', function () {
    const totalDistance = window.scrollY
    const distanceWithoutCheck = totalDistance - distanceChecked

    if (distanceWithoutCheck > 400) {
      disableShorts()
      distanceChecked = distanceChecked + 400
    }
  })
}
scrollListener()

let lastUrl = new URL(location.href)

function isValidYouTubeUrl(url) {
  return url.hostname === 'www.youtube.com' && (url.pathname === '/' || url.pathname.startsWith('/?'))
}

function triggerOnNavigation() {
  new MutationObserver(() => {
    const url = new URL(location.href)
    if (url.href !== lastUrl.href) {
      lastUrl = url
      if (isValidYouTubeUrl(url)) {
        console.log(`[Old School YouTube] Url changed, scanning for unwanted content...`)
        disableShorts()
        disableMusicSection()
        distanceChecked = 0
        scrollListener()
      }
    }
  }).observe(document, { subtree: true, childList: true })
}
triggerOnNavigation()

function detectLogoClick() {
  const ytLogo = document.querySelector('.yt-simple-endpoint.ytd-topbar-logo-renderer')

  if (ytLogo) {
    ytLogo.addEventListener('click', () => {
      console.log('[Old School YouTube] YT logo was clicked! Reloading scripts...')
      distanceChecked = 0
      setTimeout(hideUnwantedContent, 1500)
    })
  } else {
    console.error('[Old School YouTube] YouTube logo element not found.')
  }
}

setTimeout(detectLogoClick, 1500)
setTimeout(hideUnwantedContent, 1500)
