console.log(`[Old Shool YouTube]: helper function file loaded`)

function consoleTranslation(message, style = '') {
  let messageStyle
  switch (style) {
    case 'highlight green':
      messageStyle = 'color: green; font-weight: bold;'
      break
    case 'highlight red':
      messageStyle = 'color: red; font-weight: bold;'
      break
    case 'highlight blue':
      messageStyle = 'color: blue; font-weight: bold;'
      break
  }
  return console.log(`%c${chrome.i18n.getMessage(message)}`, messageStyle)
}

function printObservers() {
  observersData.forEach((observer) => {
    console.log(`Name: ${observer.name}, Enabled: ${observer.enabled}, ParentObserver is active: ${observer.parentObserverId !== null}, TargetObserver is active: ${observer.targetObserverId !== null}`)
  })
}
