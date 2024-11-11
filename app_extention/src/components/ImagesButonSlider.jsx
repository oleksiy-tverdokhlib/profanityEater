import React, {useEffect, useState} from 'react';
import {ButtonContainer} from "./ButtonContainer.jsx";
import {contentClasses} from "../constants/./constants.js";
import {removeCensorImg} from "../utils/removeImageOverlay.js";
import {censorImages, findImagesWithClass} from "../utils/censorImages.js";

export const ImagesButonSlider = () => {
  const imagesClass= contentClasses.images
  const [isImagesChecked, setIsImagesChecked] = useState(false);

  const handleOnToggle = (event) => {
    const checked = event.target.checked;
    setIsImagesChecked(checked);
    if (checked) {
      censorImages(imagesClass)
    } else {
      removeCensorImg(imagesClass)
    }
  };

  useEffect(() => {
    findImagesWithClass(imagesClass)
    chrome.storage.sync.get(['isImagesActive'], (result) => {
      const isActive = result.isImagesActive || false;
      setIsImagesChecked(isActive);

      if (isActive) {
        censorImages(imagesClass)
      } else {
        removeCensorImg(imagesClass)
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ isImagesActive: isImagesChecked });
  }, [isImagesChecked]);

  return (
    <ButtonContainer textBody={'Hide images with swear words'}>
      <input
        onChange={handleOnToggle}
        checked={isImagesChecked}
        type="checkbox"
        id="toggle"
      />
    </ButtonContainer>
  );
};
