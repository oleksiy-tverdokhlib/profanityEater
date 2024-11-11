import React, {useEffect, useState} from "react";
import {ButtonContainer} from "./ButtonContainer.jsx";

import {contentClasses} from "../constants/constants.js";
import {removeTextOverlay} from "../utils/removeTextOverlay.js";
import {changeTabContent} from "../utils/changeTabContent.js";


export const  VocabularyButtonSlider = ()=>{
  const vocClass = contentClasses.vocabulary
  const [isVocabularyChecked, setIsVocabularyChecked] = useState(false);
  const [words,setWords] = useState([])
  const handleOnToggle = (event) => {
    if (event.target.checked) {
      setIsVocabularyChecked(true)
      chrome.storage.sync.get(['vocabularyWords'], (result) => {
        changeTabContent(result.vocabularyWords,vocClass)
      })

    } else {
      setIsVocabularyChecked(false)
      removeTextOverlay(vocClass)
    }
  };


  useEffect(() => {
    chrome.storage.sync.get(['isVocabularyActive','vocabularyWords'], (result) => {
      if(result.isVocabularyActive){
        changeTabContent(result.vocabularyWords,vocClass)
      }else{
        removeTextOverlay(vocClass)
      }
      setIsVocabularyChecked(result.isVocabularyActive || false)
    })
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ isVocabularyActive: isVocabularyChecked})
    chrome.storage.sync.get(['vocabularyWords'], (result) => {
      setWords(result.vocabularyWords)
    })
  }, [isVocabularyChecked])

  return <>
    <ButtonContainer  textBody={'Hide words from vocabulary'}>
      <input  onChange={handleOnToggle} checked={isVocabularyChecked} type="checkbox" id="toggle"/>
    </ButtonContainer>
  </>
}
