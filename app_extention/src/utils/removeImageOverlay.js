export function removeCensorImg(imagesClass) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: removeImgsOverlay,
      args:[imagesClass]
    })
  })
}

export function removeImgsOverlay(imagesClass) {
  let imgClass = 'qwerty-textImages-censored';

  if (imagesClass === 'qwerty-textImages-censored') {
    imgClass = 'qwerty-nudesImages-censored';
  }

  // Get all img elements and filter them by class name
  const images = Array.from(document.getElementsByTagName('img')).filter(
    (element) => element.classList.contains(imagesClass)
  );

  // Iterate over each filtered image element
  images.forEach((element) => {
    // Clone the element before removing the class
    const clone = element.cloneNode(true);

    // Remove the 'images-qwer' class from the clone
    clone.classList.remove('qwerty-textImages-censored');

    // Reset filter style
    clone.style.filter = 'none'; // Ensure filter is also reset on clone

    // Replace the old element with the clone
    element.parentNode.replaceChild(clone, element);
  });

  // Check for div elements and remove 'images-qwer' class if present
  const divs = Array.from(document.querySelectorAll('div')).filter(
    (div) => div.classList.contains(imgClass)
  );

  divs.forEach((div) => {
    // Remove 'images-qwer' class if present
    div.classList.remove(imgClass);

    // Reset filter style if the background image exists
    const style = window.getComputedStyle(div);
    if (style.backgroundImage && style.backgroundImage !== 'none') {
      div.style.filter = 'none';
    }
  });
}
