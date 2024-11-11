import { contentClasses, textWords } from '../constants/constants.js'
import { removeBackgroundColor } from '../utils/removeTextOverlay.js'
import { changeBackgroundColor } from '../utils/changeTabContent.js'
import { removeImgsOverlay } from '../utils/removeImageOverlay.js'
import { analyseImages, findImages } from '../utils/censorImages.js'

export function adjustContentScript(textClass) {
  chrome.storage.sync.set({ currentLink: window.location.href}, () => {
    console.log('Updated currentLink' + ':', window.location.href );
  });

  // observeDOMChanges()
  if (document.readyState === 'complete') {
    handlePageEvent(textClass)
  } else {
    window.addEventListener('load', () => handlePageEvent(textClass))
  }

  window.addEventListener('visibilitychange', () => handleVisibilityChange(textClass))
  window.addEventListener(
    'scroll',
    throttle(() => handlePageEvent(textClass), 1000),
  )

  function handlePageEvent(textClass) {
    console.log('handlePageEvent invoked')
    if (textClass === contentClasses.text) {
      chrome.storage.sync.get(['isTextActive'], (result) => {
        const isActive = result.isTextActive || false
        if (isActive) {
          changeBackgroundColor(textWords, textClass)
        } else {
          removeBackgroundColor(textClass)
        }
      })
    } else if (textClass === contentClasses.vocabulary) {
      chrome.storage.sync.get(['isVocabularyActive', 'vocabularyWords'], (result) => {
        const isActive = result.isVocabularyActive || false
        if (isActive) {
          changeBackgroundColor(result.vocabularyWords, textClass)
        } else {
          removeBackgroundColor(textClass)
        }
      })
    } else if (textClass === contentClasses.images) {
      findImages(textClass)
      chrome.storage.sync.get(['isImagesActive'], (result) => {
        const isActive = result.isImagesActive || false
        if (isActive) {
          analyseImages(textClass)
        } else {
          removeImgsOverlay(textClass)
        }
      })
    } else if (textClass === contentClasses.nudes) {
      findImages(textClass)
      chrome.storage.sync.get(['isNudesBtnActive'], (result) => {
        const isActive = result.isNudesBtnActive || false
        if (isActive) {
          analyseImages(textClass)
        }
        // else {
        //   removeImgsOverlay(textClass)
        // }
      })
    }
  }
  function observeDOMChanges() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          const throttledHandlePageEvent = throttle(() => handlePageEvent(textClass), 1000)
          throttledHandlePageEvent()
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true, attributes: true })

    setTimeout(() => observer.disconnect(), 8000)
  }
  function handleVisibilityChange(textClass) {
    chrome.storage.sync.set({ vocResult: {}, textResult: {}, imgResult: [], nudeResult: [] })
    if (!document.hidden) {
      handlePageEvent(textClass)
    }
  }
  function throttle(func, limit) {
    let lastFunc
    let lastRan
    return function () {
      const context = this
      const args = arguments
      if (!lastRan) {
        func.apply(context, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(
          function () {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args)
              lastRan = Date.now()
            }
          },
          limit - (Date.now() - lastRan),
        )
      }
    }
  }
}
