const elementsWithSameId = document.querySelectorAll('[id="dismissable"]')

elementsWithSameId.forEach((element) => {
  element.style.display = 'none'
})
