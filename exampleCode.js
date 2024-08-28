//this is just example of the code
//some variables are missing, they are not important for this example, ignore this fact

let observer = null

function someFunction() {
  // Do something

  observer = manageObserver('#app', hideYTShortsTab || hideYTShortsVideos, hideShortsCallback, observer, { childList: true, subtree: true })
}

function manageObserver(selector, active, callback, aObserver = null, { childList = false, subtree = false, attributes = false } = {}) {
  if (aObserver === null && active) {
    waitForElement(selector, document.body).then((node) => {
      aObserver = new MutationObserver(callback)
      aObserver.observe(node, { childList: childList, subtree: subtree, attributes: attributes })
    })
  } else if (aObserver !== null && !active) {
    aObserver.disconnect()
    aObserver = null
  }
  return aObserver
}

//some function can be run based on many different conditions

//some conditions
someFunction()
