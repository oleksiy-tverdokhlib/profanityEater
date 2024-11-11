export function censorImages(imagesClass) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: analyseImages,
      args: [imagesClass]
      }
    )
  })
}

export async function analyseImages(imagesClass) {
  console.log('analyseNudesClassImgs triggered', imagesClass);

  const censorFriendlyClass = 'censorFriendlyImageClass-qwerty'
  makeImagesBlack(censorFriendlyClass,imagesClass)

  const imageLinks = getLinksWithoutCustomClass(imagesClass,censorFriendlyClass)
  if(!imageLinks.length==0){

    fetchReplacements(imageLinks,imagesClass)
  }else{
    return
  }


  function censorNudes(imageResult,censorFriendlyClass,imagesClass) {
    const images = getImagesWithoutCustomClass(censorFriendlyClass,imagesClass);
    for (let i = 0; i < images.length; i++) {
      const element = images[i];

      if (imageResult[i].detections?.length <2) {
        if (element.tagName === 'IMG') {
          makeImageVisible(element);
          element.classList.add(censorFriendlyClass);
          element.setAttribute("nude-info", JSON.stringify(imageResult[i]?.detections));
        } else if (element.tagName === 'DIV') {
          makeDivVisible(element);
          element.classList.add(censorFriendlyClass);
          element.setAttribute("nude-info", JSON.stringify(imageResult[i]?.detections));
        }
      } else {
        element.style.filter = 'brightness(0)';
        if (element.tagName === 'IMG') {
          function mouseoverHandler() {
            element.style.filter = 'brightness(100%)';
          }
          function mouseoutHandler() {
            element.style.filter = 'brightness(0%)';
          }
          element.classList.add(imagesClass);
          element.setAttribute("nude-info", JSON.stringify(imageResult[i]?.detections));
          element.addEventListener('mouseover', mouseoverHandler);
          element.addEventListener('mouseout', mouseoutHandler);
        } else if (element.tagName === 'DIV') {

          function divMouseoverHandler() {
            element.style.filter = 'brightness(100%)';
          }
          function divMouseoutHandler() {
            element.style.filter = 'brightness(0%)';
          }
          element.classList.add(imagesClass);
          element.setAttribute("nude-info", JSON.stringify(imageResult[i]?.detections));
          element.addEventListener('mouseover', divMouseoverHandler);
          element.addEventListener('mouseout', divMouseoutHandler);
        }
      }
    }
  }
  function makeImageVisible(image) {
    if(image.className.includes('qwerty-textImages-censored')|| image.className.includes('qwerty-nudesImages-censored') )return
    image.style.filter = 'none';
  }
  function makeDivVisible(div) {
    if(div.className.includes('qwerty-textImages-censored')|| div.className.includes('qwerty-nudesImages-censored') )return
    div.style.filter = 'none';
  }
  function makeImagesBackToNormal(replacements,censorFriendlyClass,imagesClass) {

    const images = getImagesWithoutCustomClass();

    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      if (replacements[i][2] === '__label__no_hate') {
        if (element.tagName === 'IMG') {
          makeImageVisible(element);
          element.classList.add('noHate-qwer');
          element.setAttribute("image-text", replacements[i][1]);
        } else if (element.tagName === 'DIV') {
          makeDivVisible(element);
          element.classList.add('noHate-qwer');
          element.setAttribute("image-text", replacements[i][1]);
        }
      } else {
        element.style.filter = 'brightness(0)';
        if (element.tagName === 'IMG') {

          function mouseoverHandler() {
            element.style.filter = 'brightness(100%)';
          }
          function mouseoutHandler() {
            element.style.filter = 'brightness(0%)';
          }
          element.classList.add(imagesClass);
          element.setAttribute("image-text", replacements[i][1]);
          element.addEventListener('mouseover', mouseoverHandler);
          element.addEventListener('mouseout', mouseoutHandler);
        } else if (element.tagName === 'DIV') {

          function divMouseoverHandler() {
            element.style.filter = 'brightness(100%)';
          }
          function divMouseoutHandler() {
            element.style.filter = 'brightness(0%)';
          }
          element.classList.add(imagesClass);
          element.setAttribute("image-text", replacements[i][1]);
          element.addEventListener('mouseover', divMouseoverHandler);
          element.addEventListener('mouseout', divMouseoutHandler);
        }
      }
    }
  }


  // ---------------------------------------------------------------------
  async function fetchReplacements(imageLinks,imagesClass) {
    let requestName  = 'send_img'
    if(imagesClass ==='qwerty-nudesImages-censored' ){
      requestName = 'send_nudesImgs'
    }

    let response = await fetch(`http://127.0.0.1:5000/api/${requestName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageLinks),
    })

    let imageResult = await response.json()
    console.log(imageResult)
    // --------------------------------------------------

    if (Array.isArray(imageResult) && imageResult.length==0) {
      return
    }
    let storageKey = imagesClass + 'ResultStatistics';

    chrome.storage.sync.get([storageKey, 'currentLink'], (data) => {


      if (imagesClass === 'qwerty-nudesImages-censored') {
        censorNudes(imageResult, censorFriendlyClass, imagesClass)
        chrome.runtime.sendMessage({ type: 'nudes', nudes: imageResult });
        chrome.storage.sync.set({ nudeResult: imageResult });
      } else if (imagesClass === 'qwerty-textImages-censored') {
        makeImagesBackToNormal(imageResult, censorFriendlyClass, imagesClass)
        chrome.runtime.sendMessage({ type: 'image', imageResult });
        chrome.storage.sync.set({ imgResult: imageResult });
      }

      const currentUrl = window.location.href;

      chrome.storage.sync.get(storageKey, (data) => {
        if (data[storageKey] !== undefined) {
          console.log(`${storageKey} exists:`, data[storageKey]);
          if(data[storageKey].length > 0) {
            if (currentUrl === data.currentLink && JSON.stringify(sortObjectByKeys(imageResult)) === JSON.stringify(data[storageKey][data[storageKey].length - 1].results)) return;
          }

          const currentDate = new Date();
          const isoString = currentDate.toISOString();

          let currentImgResult = {
            date:isoString,
            link:currentUrl,
            results:sortObjectByKeys(imageResult)
          }
          console.log(currentImgResult)
          let previousResults = data[storageKey] ;
          console.log(data[storageKey],'data[storageKey]')
          let updatedResults = previousResults.concat(currentImgResult);

          chrome.storage.sync.set({ [storageKey]: updatedResults, currentLink: currentUrl }, () => {
            console.log('Updated ' + storageKey + ':', updatedResults);
          });
        } else {
          console.log(`${storageKey} does not exist.`);
          let ImgResult = [{
            date:new Date().toISOString(),
            link:currentUrl,
            results:sortObjectByKeys(imageResult)
          }]
          chrome.storage.sync.set({ [storageKey]:ImgResult, currentLink: currentUrl }, () => {
            console.log(storageKey +"exists now");
          });

        }
      });




    })
    function sortObjectByKeys(obj) {
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj = {};

      for (const key of sortedKeys) {
        sortedObj[key] = obj[key];
      }
      return sortedObj;
    }
  }

   function getLinksWithoutCustomClass(censorFriendlyClass,imagesClass) {
    const filteredImages = getImagesWithoutCustomClass(censorFriendlyClass,imagesClass)


    const extractImageUrls = (elements) => {
      return elements.flatMap(element => {
        if (element.tagName === 'IMG') {
          // For img elements, return their src attribute
          return [element.src];
        } else if (element.tagName === 'DIV') {
          // For div elements, extract the background image URL
          const style = window.getComputedStyle(element);
          const backgroundImage = style.backgroundImage;
          const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          return urlMatch ? [urlMatch[1]] : [];
        }
        return [];
      });
    };
    const imageUrls = extractImageUrls(filteredImages);

    return imageUrls
  }

  function getImagesWithoutCustomClass(censorFriendlyClass,imagesClass){
    let imgClass = 'qwerty-textImages-censored'
    let apropriateImgsClass = 'noHate-qwer'
    if(imagesClass == 'qwerty-textImages-censored'){
      imgClass = 'qwerty-nudesImages-censored'
      apropriateImgsClass =censorFriendlyClass
    }
    const divArrays = Array.from(document.querySelectorAll('div'))
      .filter(div => div.style.backgroundImage && div.style.backgroundImage !== 'none')
      .filter(div => !(div.className.includes(apropriateImgsClass) || div.className.includes(imgClass)));


    const imgArray = Array.from(document.querySelectorAll('img')).filter(image =>
      !(image.className.includes(apropriateImgsClass) || image.className.includes(imgClass))
    );
    const combinedArray = divArrays.concat(imgArray);

    return combinedArray
  }

  function makeImagesBlack(censorFriendlyClass,imagesClass) {
    let imgsClass = 'qwerty-textImages-censored'
    let apropriateImgClass = censorFriendlyClass
    if(imagesClass == 'qwerty-textImages-censored'){
      imgsClass = 'qwerty-nudesImages-censored'
      apropriateImgClass = 'noHate-qwer'
    }

    document.body.querySelectorAll('img').forEach((image) => {
      if (image.className.includes(apropriateImgClass) || image.className.includes(imgsClass)) return;
      image.style.filter = 'brightness(0)';
    });

    document.querySelectorAll('div').forEach(div => {
      if (div.className.includes(apropriateImgClass) || div.className.includes(imgsClass)) return;
      const style = window.getComputedStyle(div);
      if (style.backgroundImage && style.backgroundImage !== 'none') {
        div.style.filter = 'brightness(0)';
      }
    });
  }
}


export function findImagesWithClass(imgClass, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: findImages,
        args: [imgClass], // Pass imgClass as an argument
      }
    );
  });
}

export const findImages = (imgClass) => {

  if(imgClass==='qwerty-textImages-censored'){
    const imagesWithClass = Array.from(document.querySelectorAll(`img[class~="${imgClass}"]`));
    const imageResult = imagesWithClass.map(img => [img.src,img.getAttribute("image-text")])
    chrome.runtime.sendMessage({ type: 'image', imageResult });
    chrome.storage.sync.set({ imgResult:imageResult });
  }else {
    const imagesWithClass = Array.from(document.querySelectorAll(`img[class~="${'qwerty-nudesImages-censored'}"]`));
    const imageResult = imagesWithClass.map(img => [img.src, img.getAttribute("nude-info")])
    chrome.runtime.sendMessage({ type: 'nudes', nudes:imageResult });
    chrome.storage.sync.set({ nudeResult: imageResult });
  }
}





