import { useEffect, useState } from 'react';
import {changeTabContent} from "../utils/changeTabContent.js";
import {contentClasses} from "../constants/constants.js";
import {removeTextOverlay} from "../utils/removeTextOverlay.js";

export const VocabularyInput = () => {
  const vocClass = contentClasses.vocabulary
  const [inputText, setInputText] = useState('');
  const [vocabularyWords, setVocabularyWords] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSave = () => {
    const newArray = [...vocabularyWords, inputText]
    setVocabularyWords(newArray);
    chrome.storage.sync.get(['isVocabularyActive'], (result) => {
      if(result.isVocabularyActive){
        changeTabContent(newArray,vocClass)
      }
    })
    setInputText('');
  };

  const handleDeleteItem = (word) => {
    const filteredWords = vocabularyWords.filter((element) => element !== word);
    setVocabularyWords([...filteredWords]);
    chrome.storage.sync.get(['isVocabularyActive'], (result) => {
      if(result.isVocabularyActive){
        removeTextOverlay(vocClass)
        changeTabContent(filteredWords,vocClass)
      }
    })

  };

  useEffect(() => {
    chrome.storage.sync.get(['vocabularyWords'], (result) => {
      setVocabularyWords(result.vocabularyWords || []);

    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ vocabularyWords });
  }, [vocabularyWords]);

  return (
    <div className={'voc-container'}>
      <div className={'input-container'}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          maxLength={50}
        />
        <button onClick={handleSave}>Save</button>
      </div>
      <h2 className={'vocabulary-content'}>Your vocabulary {vocabularyWords?.length>0?':':'is empty'}</h2>
      {vocabularyWords.map((word) => (
        <div key={word} className={'voc-word'}>
          <p>{word}</p>
          <span className={'delete-icon'} onClick={() => handleDeleteItem(word)}>x</span>
        </div>
      ))}
    </div>
  );
};
