import { useState, useEffect } from 'react'

import './SidePanel.css'

export const SidePanel = () => {
  const [text, setText] = useState('');
  const [vocs, setVocs] = useState('');
  const [images, setImages] = useState([]);
  const [nudes, setNudes] = useState([]);

  // Function to handle changes to storage
  const handleStorageChange = (changes, areaName) => {
    if (areaName === 'sync') {  // We only care about changes in 'sync' storage
      console.log('Storage changes detected:', changes);

      if (changes['qwerty-textResultStatistics']) {
        console.log('Text result changed:', changes['qwerty-textResultStatistics']);
        setText(changes['qwerty-textResultStatistics'].newValue || '');
      }
      if (changes['qwerty-vocResultStatistics']) {
        console.log('Voc result changed:', changes['qwerty-vocResultStatistics']);
        setVocs(changes['qwerty-vocResultStatistics'].newValue || '');
      }
      if (changes['qwerty-textImages-censoredResultStatistics']) {
        console.log('Text images censored result changed:', changes['qwerty-textImages-censoredResultStatistics']);
        setImages(changes['qwerty-textImages-censoredResultStatistics'].newValue || []);
      }
      if (changes['qwerty-nudesImages-censoredResultStatistics']) {
        console.log('Nudes images censored result changed:', changes['qwerty-nudesImages-censoredResultStatistics']);
        setNudes(changes['qwerty-nudesImages-censoredResultStatistics'].newValue || []);
      }
    }
  };

  useEffect(() => {
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div>
      {/* Your component's content */}
    </div>
  );
};


export default SidePanel
