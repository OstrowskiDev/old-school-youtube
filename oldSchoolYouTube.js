console.log(`[Old School YouTube]: Scrolling version 1.0 - Extension initialized!`)

function hideUnwantedContent() {
  console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)
  disableShorts()
  disableMusicSection(allElements)
  console.log(`[Old School YouTube] Welcome back to early YouTube days!`)
}

function disableShorts() {
  const shortsLikeElements = document.querySelectorAll('.ytd-rich-shelf-renderer')
  if (shortsLikeElements) {
    console.log(`[Old School YouTube] Shorts array length: ${shortsLikeElements.length}`)
  }
  const shortsElements = Array.from(shortsLikeElements).filter((element) => element.id === 'dismissible')
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

function disableMusicSection() {
  const musicSectionLikeElements = document.querySelectorAll('.ytd-statement-banner-renderer')
  const musicSectionElements = Array.from(musicSectionLikeElements).filter((element) => element.id === 'dismissible')
  console.log(`[Old School YouTube] Disabling Music section...`)

  if (musicSectionElements.length > 0) {
    musicSectionElements.forEach((music) => {
      music.style.display = 'none'
    })
    console.log(`[Old School YouTube] Music section disabled!`)
  } else {
    console.log(`[Old School YouTube] Error! Music section ont found.`)
  }
}

let distanceChecked = 0

function scrollListener() {
  window.addEventListener('scroll', function () {
    const totalDistance = window.scrollY
    const distanceWithoutCheck = totalDistance - distanceChecked

    if (distanceWithoutCheck > 400) {
      console.log(`[Old School YouTube] - distance threshold reached!`)
      disableShorts()
      distanceChecked = distanceChecked + 400
    }
  })
}
scrollListener()

let lastUrl = new URL(location.href)

function triggerOnNavigation() {
  new MutationObserver(() => {
    const url = new URL(location.href)
    if (url.href !== lastUrl.href) {
      lastUrl = url
      if (isValidYouTubeUrl(url)) {
        console.log(`[Old School YouTube] Url changed, scanning for unwanted content...`)
        disableShorts()
        disableMusicSection()
        scrollListener()
      }
    }
  }).observe(document, { subtree: true, childList: true })
}
triggerOnNavigation()

setTimeout(hideUnwantedContent, 1500)
