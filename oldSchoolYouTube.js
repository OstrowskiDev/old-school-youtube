console.log(`Reverting UI back to YouTube from good old days <3`)
console.log(`Its 2010 again baby!`)

function hideShorts() {
  const allElements = document.querySelectorAll('*')
  const shortsElements = Array.from(allElements).filter((element) => element.id === 'dismissible')

  if (shortsElements.length > 0) {
    console.log(`Found ${shortsElements.length} elements with id 'dismissible'`)
    shortsElements.forEach((shorts) => {
      console.log(`The Shorts element is:`, shorts)
      shorts.style.display = 'none'
      shorts.setAttribute('style', 'display: none !important;')
    })
  } else {
    console.log(`No elements with id 'dismissible' found`)
  }
}

setTimeout(hideShorts, 3000)
