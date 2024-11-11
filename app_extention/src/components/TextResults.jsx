import React, {useEffect, useState} from "react";

export const TextResults = ()=>{
  const [popupTextResults,setPopupTextResults] = useState({})

  console.log('textresults triggered',popupTextResults)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type=='qwerty-text') {
        console.log(`Received type: ${message.type}`);
        console.log('Received matches:', message.matches);
        setPopupTextResults(message.matches)
        chrome.storage.sync.set({ textResult: message.matches });

        sendResponse({ status: 'Message received', data: message.matches });
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['textResult'], (result) => {
      setPopupTextResults(result.textResult || {});
    });
  }, []);

  return (
    <div>
      <h2>Hidden swear words:</h2>
      {Object.entries(popupTextResults).map(([key, value]) => (
        value !== 0 && ( // Only render if value is not 0
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        )
      ))}
    </div>
  );
};
