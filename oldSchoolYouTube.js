console.log(`[Old School YouTube]: Basic version 1.0 - Extension initialized!`)

function hideUnwantedContent() {
  console.log(`[Old School YouTube] Attempting to revert UI back to YouTube from good old days...`)
  disableShorts()
  disableMusicSection()
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

window.addEventListener('scroll', function () {
  const totalDistance = window.scrollY
  const distanceWithoutCheck = totalDistance - distanceChecked

  if (distanceWithoutCheck > 400) {
    console.log(`[Old School YouTube] - distance threshold reached!`)
    disableShorts()
    distanceChecked = distanceChecked + 400
  }
})

setTimeout(hideUnwantedContent, 1500)
