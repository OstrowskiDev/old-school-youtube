// Select all elements with the ID "dismissable" using an attribute selector
const elementsWithSameId = document.querySelectorAll('[id="dismissable"]')

// Loop through the NodeList and apply changes
elementsWithSameId.forEach((element) => {
  element.style.display = 'none'
})
