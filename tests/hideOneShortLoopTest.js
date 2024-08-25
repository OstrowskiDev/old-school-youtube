console.log('[Old School YouTube] Tests file: hideOneShortLoopTests loaded')

let counter = 0

function testHideOneShortLoop() {
  setInterval(() => {
    if (counter > 15) {
      console.error(`[Old School YouTube]: Error! hideSearchPageShorts loop is being triggered to many times. Loop was triggered ${counter} times in last two seconds.`)
      counter = 0
    }
  }, 2000)
}

function addTestCounter() {
  counter++
}
