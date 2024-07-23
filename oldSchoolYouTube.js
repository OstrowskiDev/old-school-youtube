console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)

function hideShorts() {
  const allElements = document.querySelectorAll('*')
  const shortsElements = Array.from(allElements).filter((element) => element.id === 'dismissible' && element.classList.contains('ytd-rich-shelf-renderer'))

  if (shortsElements.length > 0) {
    console.log(`[Old School YouTube] Disabling Shorts...`)
    shortsElements.forEach((shorts) => {
      shorts.style.display = 'none'
    })
    console.log(`[Old School YouTube] Shorts disabled!`)
    console.log(`[Old School YouTube] Welcome back to early YouTube days!`)
  } else {
    console.log(`[Old School YouTube] Error! Shorts ont found.`)
  }
}

const intervalId = setInterval(() => {
  if (document.querySelector('#dismissible.ytd-rich-shelf-renderer')) {
    hideShorts()
    clearInterval(intervalId)
  }
}, 100)
