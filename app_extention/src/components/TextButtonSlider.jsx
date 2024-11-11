import React, { useEffect, useState } from 'react';
import { ButtonContainer } from "./ButtonContainer.jsx";
import { changeTabContent } from "../utils/changeTabContent.js";
import { removeTextOverlay } from "../utils/removeTextOverlay.js";
import {contentClasses, textWords} from "../constants/./constants.js";

export const TextButtonSlider = () => {
  const textClass= contentClasses.text
  const [isTextChecked, setIsTextChecked] = useState(false);

  const handleOnToggle = (event) => {
    const checked = event.target.checked;
    setIsTextChecked(checked);
    if (checked) {
      changeTabContent(textWords,textClass);
    } else {
      removeTextOverlay(textClass);
    }
  };

  useEffect(() => {
    chrome.storage.sync.get(['isTextActive'], (result) => {
      const isActive = result.isTextActive || false;
      setIsTextChecked(isActive);

      if (isActive) {
        changeTabContent(textWords,textClass);
      } else {
        removeTextOverlay(textClass);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ isTextActive: isTextChecked });
  }, [isTextChecked]);

  return (
    <ButtonContainer textBody={'Hide swear words'}>
      <input onChange={handleOnToggle} checked={isTextChecked} type="checkbox" id="toggle"/>
    </ButtonContainer>
  );
};
