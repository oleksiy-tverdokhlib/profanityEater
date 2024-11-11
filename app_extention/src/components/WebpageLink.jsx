import {useEffect, useState} from 'react'

export const WebpageLink = () => {
  const [webpageUrl, setWebpageUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      const link = activeTab.url
      if (activeTab && link) {
        setWebpageUrl(link);
        chrome.storage.sync.set({ currentLink: link }, () => {
          console.log('Updated currentLink' + ':', link);
        });
      }
    });
  }, []);

  return (
    <div>
      <h2>Active Tab URL:</h2>
      <p>{webpageUrl}</p>
    </div>
  );
}


