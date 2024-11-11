import React, { useEffect, useState } from "react";

import { contentClasses } from "../constants/constants.js";
import { findImagesWithClass } from "../utils/censorImages.js";

export const NudesResults = () => {
  const [popupNudesResults, setPopupNudesResults] = useState([]);
  console.log('nudes results:',popupNudesResults);
  useEffect(() => {
    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === 'nudes') {
        console.log(`Received nude type: ${message.type}`);
        console.log('Received nudeResult:', message.nudes);
        setPopupNudesResults(message.nudes);
        chrome.storage.sync.set({ nudeResult: message.nudes });

        sendResponse({ status: 'Message received', data: message.nudes });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['nudeResult'], (result) => {
      setPopupNudesResults(result.nudeResult || []);
      if(result.nudeResult?.length==0){
        findImagesWithClass(contentClasses.nudes)
      }
    });
  }, []);

  return (
    <div>
      <h2>Hidden nudes:</h2>
      {Array.isArray(popupNudesResults) && popupNudesResults.length > 0 ? (
        popupNudesResults.map((nude,index) => {
          // Check for the condition to skip rendering
          if (nude.detections?.length<2) return ; // Skip this image

          return (
            <div key={index}>
              <img className={'result-img'} src={nude.url} alt={`Result ${index}`} />
              {/*<p>Profanity in text: {image[1]}</p>*/}
            </div>
          );
        })
      ) :(
        <p></p>
      )}
    </div>
  );

};

