let counter = 0

export function testHideOneShortLoop() {
  setInterval(() => {
    if (counter > 15) {
      console.error(`[Old School YouTube]: Error! hideSearchPageShorts loop is being triggered to many times. Loop was triggered ${counter} times in last two seconds.`)
      counter = 0
    }
  }, 2000)
}

export function addTestCounter() {
  counter++
}
