//   export function censorImg(imagesClass) {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: tabs[0].id },
//           function: analyseImgs,
//           args:[imagesClass]
//         }
//       )
//     })
//   }
//
//   export async function analyseImgs(imagesClass) {
//     console.log('analyseImgs trigered',imagesClass)
//     makeImagesBlack()
//
//     const imageLinks = getLinksWithoutCustomClass(imagesClass)
//
//     if(!imageLinks.length==0){
//       fetchReplacements(imageLinks,imagesClass)
//     }
//     function makeImagesBackToNormal(replacements,imagesClass) {
//       function makeImageVisible(image) {
//         if(image.className.includes('qwerty-nudesImages-censored'))return
//         image.style.filter = 'none';
//       }
//
//       function makeDivVisible(div) {
//         if(div.className.includes('qwerty-nudesImages-censored'))return
//         div.style.filter = 'none';
//       }
//
//       // Assume getImagesWithoutCustomClass returns an array of img and div elements
//       const images = getImagesWithoutCustomClass();
//       console.log('getImagesWithoutCustomClass',images);
//
//       for (let i = 0; i < images.length; i++) {
//         const element = images[i];
//         if (replacements[i][2] === '__label__no_hate') {
//           if (element.tagName === 'IMG') {
//             makeImageVisible(element);
//             element.classList.add('noHate-qwer');
//             element.setAttribute("image-text", replacements[i][1]);
//           } else if (element.tagName === 'DIV') {
//             makeDivVisible(element);
//             element.classList.add('noHate-qwer');
//             element.setAttribute("image-text", replacements[i][1]);
//           }
//         } else {
//
//           element.style.filter = 'brightness(0)';
//           if (element.tagName === 'IMG') {
//
//             function mouseoverHandler() {
//               element.style.filter = 'brightness(100%)';
//             }
//             function mouseoutHandler() {
//               element.style.filter = 'brightness(0%)';
//             }
//             element.classList.add(imagesClass);
//             element.setAttribute("image-text", replacements[i][1]);
//             element.addEventListener('mouseover', mouseoverHandler);
//             element.addEventListener('mouseout', mouseoutHandler);
//           } else if (element.tagName === 'DIV') {
//
//             function divMouseoverHandler() {
//               element.style.filter = 'brightness(100%)';
//             }
//             function divMouseoutHandler() {
//               element.style.filter = 'brightness(0%)';
//             }
//             element.classList.add(imagesClass);
//             element.setAttribute("image-text", replacements[i][1]);
//             element.addEventListener('mouseover', divMouseoverHandler);
//             element.addEventListener('mouseout', divMouseoutHandler);
//           }
//         }
//       }
//     }
//
//
//     //---------------------------------------------------------------------
//     async function fetchReplacements(imageLinks,imagesClass) {
//       let response = await fetch('http://127.0.0.1:5000/api/send_img', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(imageLinks),
//       })
//       let imageResult = await response.json()
//       chrome.runtime.sendMessage({ type: 'image', imageResult });
//       chrome.storage.sync.set({ imgResult:imageResult });
//
//       makeImagesBackToNormal(imageResult,imagesClass)
//     }
//
//     function getLinksWithoutCustomClass(imagesClass) {
//       const filteredImages = getImagesWithoutCustomClass(imagesClass)
//       console.log(filteredImages,'filteredImages')
//
//       const extractImageUrls = (elements) => {
//         return elements.flatMap(element => {
//           if (element.tagName === 'IMG') {
//             // For img elements, return their src attribute
//             return [element.src];
//           } else if (element.tagName === 'DIV') {
//             // For div elements, extract the background image URL
//             const style = window.getComputedStyle(element);
//             const backgroundImage = style.backgroundImage;
//             const urlMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
//             return urlMatch ? [urlMatch[1]] : [];
//           }
//           return [];
//         });
//       };
//
// // Extract URLs from the elements array
//       const imageUrls = extractImageUrls(filteredImages);
//
//       return imageUrls
//     }
//
//     function getImagesWithoutCustomClass(imagesClass){
//       const divArrays = Array.from(document.querySelectorAll('div'))
//         .filter(div => div.style.backgroundImage && div.style.backgroundImage !== 'none')
//         .filter(div => !(div.className.includes('noHate-qwer') || div.className.includes(imagesClass)));
//
//
//       const imgArray = Array.from(document.querySelectorAll('img')).filter(image =>
//         !(image.className.includes('noHate-qwer') || image.className.includes(imagesClass))
//       );
//
//       const combinedArray = divArrays.concat(imgArray);
//
//       return combinedArray
//     }
//
//
//     function makeImagesBlack() {
//       document.body.querySelectorAll('img').forEach((image) => {
//         if (image.className.includes('noHate-qwer') || image.className.includes('qwerty-nudesImages-censored')) return;
//         image.style.filter = 'brightness(0)';
//       });
//
//       document.querySelectorAll('div').forEach(div => {
//         if (div.className.includes('noHate-qwer') || div.className.includes('qwerty-nudesImages-censored')) return;
//
//         const style = window.getComputedStyle(div);
//         if (style.backgroundImage && style.backgroundImage !== 'none') {
//           div.style.filter = 'brightness(0)';
//         }
//       });
//
//     }
//   }
//
//
//
//
//
//
