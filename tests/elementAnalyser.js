console.log('[Old School YouTube]: Element analyser loaded')
const selector = 'ytd-rich-section-renderer'

const contentElement = document.querySelector(selector)
// let contentIdObserver = createContentObserver(contentElement)

const DOMChangesObserver = new MutationObserver(handleDomChanges)
DOMChangesObserver.observe(document.body, { childList: true, subtree: true })

function handleDomChanges(mutations) {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((node) => {
      if (node.id === 'content') {
        console.log(`[Old School YouTube]: ${selector} element removed`)
        // contentIdObserver.disconnect()
      }
    })

    mutation.addedNodes.forEach((node) => {
      if (node.id === 'content') {
        console.log(`[Old School YouTube]: ${selector} element added`)
        // contentIdObserver = createContentObserver(node)
      }
    })
  })
}

// function createContentObserver(element) {
//   const observer = new MutationObserver(() => {
//     let element = document.querySelectorAll(selector)
//     if (element) console.log('[Old School YouTube]: element found!')
//   })
//   observer.observe(element, { childList: true, subtree: true })
//   return observer
// }
