import React, { useEffect, useState } from "react";
import { ButtonContainer } from "./ButtonContainer.jsx";
import { contentClasses } from "../constants/constants.js";
import { censorImages, findImagesWithClass } from "../utils/censorImages.js";
import { removeCensorImg } from "../utils/removeImageOverlay.js";


export const NudesButtonSlider = () => {
  const [isNudesBtnChecked, setIsNudesBtnChecked] = useState(false);
  const nudesClass = contentClasses.nudes
  const handleOnToggle = (event) => {
    const checked = event.target.checked;
    setIsNudesBtnChecked(checked);
    if (checked) {
      censorImages(nudesClass)
    }
  };

  useEffect(() => {
    findImagesWithClass(nudesClass)
    chrome.storage.sync.get(['isNudesBtnActive'], (result) => {
      const isActive = result.isNudesBtnActive || false;
      setIsNudesBtnChecked(isActive);

      if (isActive) {
        censorImages(nudesClass)
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ isNudesBtnActive: isNudesBtnChecked });
  }, [isNudesBtnChecked]);


  return (
    <ButtonContainer textBody={'Hide nudes'}>
      <input onChange={handleOnToggle} checked={isNudesBtnChecked} type="checkbox" id="toggle"/>
    </ButtonContainer>
  );
};
