import React, { useEffect, useState } from 'react';

export const VocabularyResults = () => {
  const [popupVocabularyResults,setPopupVocabularyResult] = useState({})

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type=='qwerty-voc') {
        console.log(`Received type: ${message.type}`);
        console.log('Received matches:', message.matches);
        setPopupVocabularyResult(message.matches)
        chrome.storage.sync.set({ vocResult: message.matches });

        sendResponse({ status: 'Message received', data: message.matches });
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(['vocResult'], (result) => {
      setPopupVocabularyResult(result.vocResult || {});
    });
  }, []);

  return (
    <div>
      <h2>Hidden words from vocabulary:</h2>
      {Object.entries(popupVocabularyResults).map(([key, value]) => (
        value !== 0 && ( // Only render if value is not 0
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        )
      ))}
    </div>
  );
};

