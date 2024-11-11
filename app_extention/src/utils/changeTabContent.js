export const changeTabContent = (textWords,textClass) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: changeBackgroundColor,
      args: [textWords,textClass]
    });
  });
}

export const changeBackgroundColor = (textWords, textClass) => {
  function replaceHTML(registr) {
    if (!registr) return;

    const regex = new RegExp(`\\b\\w*${registr}\\w*\\b`, 'gi');

    function traverseAndHighlight(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;

        if (parent.classList && parent.classList.contains(textClass)) return;

        const newHtml = node.textContent.replace(regex, (match) => {
          const wrappedRegex = new RegExp(`<span class="${textClass}"[^>]*>${match}</span>`, 'i');
          return wrappedRegex.test(parent.innerHTML) ? match : `<span class="${textClass}" style="background: black; color: black;">${match}</span>`;
        });

        if (newHtml !== node.textContent) {
          const fragment = document.createRange().createContextualFragment(newHtml);
          parent.replaceChild(fragment, node);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.childNodes.forEach(traverseAndHighlight);
      }
    }
    traverseAndHighlight(document.body);
  }

  function foundMatchesFoo(foundMatches, text) {
    if (foundMatches) {
      if (text.toLowerCase() === text) {
        replaceHTML(text);
      } else {
        let upper = text[0].toUpperCase() + text.slice(1);
        replaceHTML(upper);
      }

      const qwertyElements = document.querySelectorAll(`.${textClass}`);

      qwertyElements.forEach(function (element) {
        element.addEventListener('mouseover', function () {
          this.style.color = 'white';
          this.style.backgroundColor = 'black';
        });
        element.addEventListener('mouseout', function () {
          this.style.color = 'black';
          this.style.backgroundColor = 'black';
        });
      });
    }
  }

  const matches = {};
  const visibleText = document.body.innerText.toLowerCase();

  function isTextContentMatching(searchString) {
    const currentClass = textClass === 'qwerty-voc' ? '.qwerty-text' : '.qwerty-voc';
    const elements = document.querySelectorAll(currentClass);

    for (const element of elements) {
      if (element.textContent.trim() === searchString.trim()) {
        return true; // If a match is found, return true
      }
    }
    return false;
  }

  textWords.forEach((text) => {
    if (isTextContentMatching(text)) return;

    const pattern = new RegExp('\\b' + text + '\\b(?!([^<]+)?>)', 'gi');
    const foundMatches = visibleText.match(pattern);
    if(foundMatches){
      matches[text] = foundMatches.length
    }

    foundMatchesFoo(foundMatches, text);
  });
  chrome.runtime.sendMessage({ type: textClass, matches });

  let storageKey = textClass + 'ResultStatistics';
  console.log(storageKey)
  if (Array.isArray(matches) && matches.length==0) {
    return
  } else if (matches && typeof matches === 'object' && matches.constructor === Object && Object.keys(matches).length === 0) {
    return
  }

  chrome.storage.sync.get([storageKey, 'currentLink'], (data) => {
    const currentUrl = window.location.href;

    chrome.storage.sync.get(storageKey, (data) => {
      if (data[storageKey] !== undefined) {
        console.log(`${storageKey} exists:`, data[storageKey]);
        if(data[storageKey].length > 0) {
          if (currentUrl === data.currentLink && JSON.stringify(sortObjectByKeys(matches)) === JSON.stringify(data[storageKey][data[storageKey].length - 1].results)) return;
        }

        const currentDate = new Date();
        const isoString = currentDate;

        let currentResult = {results:sortObjectByKeys(matches),date:isoString,link:currentUrl}
        let previousResults = data[storageKey];
        let updatedResults = previousResults.concat(currentResult);
        console.log(updatedResults)
        chrome.storage.sync.set({ [storageKey]: updatedResults, currentLink: currentUrl }, () => {
          console.log('Updated ' + storageKey + ':', updatedResults);
        });
      } else {
        console.log(`${storageKey} does not exist.`);
        let textResult = [{
          date:new Date().toISOString(),
          link:currentUrl,
          results:sortObjectByKeys(matches),
          }]
        chrome.storage.sync.set({ [storageKey]:textResult, currentLink: currentUrl }, () => {
          console.log(storageKey +"exists now");
        });

      }
    });

  });
  function sortObjectByKeys(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};

    for (const key of sortedKeys) {
      sortedObj[key] = obj[key];
    }
    return sortedObj;
  }
}

