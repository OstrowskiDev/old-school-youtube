console.log(`Reverting UI back to YouTube from good old days <3`)
console.log(`Its 2010 again baby!!!!!!`)

setTimeout(() => {
  const element = document.getElementById('dismissible')

  if (element) {
    console.log(`Found the element with id 'dismissible'`)
    console.log(`The element is:`, element)
    element.style.display = 'none'
    element.setAttribute('style', 'display: none !important;')
  } else {
    console.log(`Element with id 'dismissible' not found`)
  }
}, 3000)

// const element = document.getElementById('dismissible')

// if (element) {
//   console.log(`Found the element with id 'dismissible'`)
//   console.log(`the element is:`, element)
//   element.style.display = 'none'
// }

// const elementsWithSameId = document.querySelectorAll('[id="dismissible"]')

// elementsWithSameId.forEach((element) => {
//   element.style.display = 'none'
// })
