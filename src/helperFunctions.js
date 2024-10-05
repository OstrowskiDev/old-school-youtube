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

const logger = {
  prefix: '[Old School Experience for YouTube] ',
  log: function (...message) {
    if (environment === 'development') {
      console.log(this.prefix + message.join(' '))
    }
  },
  error: function (...message) {
    console.error(this.prefix + message.join(' '))
  },
  important: function (...message) {
    if (environment === 'development') {
      console.log('%c' + this.prefix + message.join(' '), 'color: blue; font-weight: bold;')
    }
  },
}

logger.important(`helper functions file loaded`)
