import React, { useEffect, useState } from "react";

import { contentClasses } from "../constants/constants.js";
import { findImagesWithClass } from "../utils/censorImages.js";

export const ImagesResults = () => {
  const [popupImagesResults, setPopupImagesResult] = useState([]);
  console.log('images results:',popupImagesResults);
  useEffect(() => {
    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === 'image') {
        console.log(`Received type: ${message.type}`);
        console.log('Received imageResult:', message.imageResult);
        setPopupImagesResult(message.imageResult);
        chrome.storage.sync.set({ imgResult: message.imageResult });

        sendResponse({ status: 'Message received', data: message.imageResult });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['imgResult'], (result) => {
      setPopupImagesResult(result.imgResult || []);
      if(result.imgResult?.length==0){
         findImagesWithClass(contentClasses.images)
      }
    });
  }, []);

  return (
    <div >
      <h2>Hidden images:</h2>
      {Array.isArray(popupImagesResults) && popupImagesResults.length > 0 ? (
        popupImagesResults.map((image, index) => {
          // Check for the condition to skip rendering
          if (image[2] === '__label__no_hate') return ; // Skip this image

          return (
            <div key={index} className={'text-images'}>
              <img className={'result-img'} src={image[0]} alt={`Result ${index}`} />
              <p>Profanity in text: {image[1]}</p>
            </div>
          );
        })
      ) :(
        <p></p>
      )}
    </div>
  );

};

