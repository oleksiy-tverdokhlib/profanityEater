export const removeTextOverlay = (voc) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: removeBackgroundColor,
      args: [voc] // Pass the argument to the function
    });
  });
}

export const  removeBackgroundColor=(voc)=> {
  const className = '.' + voc
  const elements = document.querySelectorAll(className);
  console.log(className)
  elements.forEach((element) => {
    const newText = element.innerText;
    const node = document.createTextNode(newText);
    element.parentNode.replaceChild(node, element);
  });
}

