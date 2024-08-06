console.log(`[Old School YouTube] Extension initialized!`)

function hideUnwantedContent() {
  const allElements = document.querySelectorAll('*')
  console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)
  disableShorts(allElements)
  disableMusicSection(allElements)
  console.log(`[Old School YouTube] Welcome back to early YouTube days!`)
}

function isValidYouTubeUrl(url) {
  return url.hostname === 'www.youtube.com' && (url.pathname === '/' || url.pathname.startsWith('/?'))
}

function hideContentOnLoad() {
  const intervalId = setInterval(() => {
    if (document.querySelector('#dismissible.ytd-rich-shelf-renderer')) {
      console.log('[Old School YouTube]', document.querySelector('#dismissible.ytd-rich-shelf-renderer'))
      hideUnwantedContent()
      clearInterval(intervalId)
    }
  }, 500)
}

hideContentOnLoad()

let lastUrl = new URL(location.href)

new MutationObserver(() => {
  const url = new URL(location.href)
  if (url.href !== lastUrl.href) {
    lastUrl = url
    if (isValidYouTubeUrl(url)) {
      console.log(`[Old School YouTube] Url changed, scanning for unwanted content...`)
      triggerWhenShortsVisible()
      // setTimeout(hideContentOnLoad, 1000)
    }
  }
}).observe(document, { subtree: true, childList: true })

function triggerWhenShortsVisible() {
  console.log(`[Old School YouTube] Waiting for Shorts to appear...`)
  let options = {
    root: document.documentElement,
    rootMargin: '0px',
    threshold: 0,
  }

  let observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        hideUnwantedContent()
        observer.disconnect()
      }
    })
  }

  let observer = new IntersectionObserver(observerCallback, options)
  let target = document.querySelector('#dismissible.ytd-rich-shelf-renderer')
  if (target) {
    observer.observe(target)
  } else {
    console.log(`[Old School YouTube] Error! Shorts not found.`)
  }
}

// function onElementVisible(selector, callback) {
//   const element = document.querySelector(selector)
//   if (element) {
//     const observer = new IntersectionObserver((entries, obs) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           callback(entry.target)
//           obs.disconnect()
//         }
//       })
//     })
//     observer.observe(element)
//   }
// }

// const mutationObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.type === 'childList') {
//       onElementVisible('#dismissible.ytd-rich-shelf-renderer', (element) => {
//         console.log('[Old School YouTube] Element visible, executing code...')
//         hideContentOnLoad()
//       })
//     }
//   })
// })

// mutationObserver.observe(document, { childList: true, subtree: true })

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
