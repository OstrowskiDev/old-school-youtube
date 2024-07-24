console.log(`[Old School YouTube] Extension initialized!`)

function hideUnwantedContent() {
  const allElements = document.querySelectorAll('*')
  console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)
  disableShorts(allElements)
  disableMusicSection(allElements)
  console.log(`[Old School YouTube] Welcome back to early YouTube days!`)
}

const intervalId = setInterval(() => {
  if (document.querySelector('#dismissible.ytd-rich-shelf-renderer')) {
    hideUnwantedContent()
    clearInterval(intervalId)
  }
}, 100)

let lastUrl = location.href

new MutationObserver(() => {
  const url = location.href
  if (url !== lastUrl) {
    lastUrl = url
    if (url === 'https://www.youtube.com/' || url.startsWith('https://www.youtube.com/?')) {
      console.log(`[Old School YouTube] Url changed, scanning for unwanted content...`)
      hideUnwantedContent()
    }
  }
}).observe(document, { subtree: true, childList: true })

//!!!! need to add ulr sanitization!!!!

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
