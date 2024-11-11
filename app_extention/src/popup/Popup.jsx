import './Popup.css'
import {TextButtonSlider} from "../components/TextButtonSlider.jsx";
import {VocabularyInput} from "../components/VocabularyInput.jsx";
import {VocabularyButtonSlider} from "../components/VocabularyButtonSlider.jsx";
import {VocabularyResults} from "../components/VocabularyResults.jsx";
import {TextResults} from "../components/TextResults.jsx";
import {ImagesButonSlider} from "../components/ImagesButonSlider.jsx";
import {WebpageLink} from "../components/WebpageLink.jsx";
import { ImagesResults } from "../components/ImagesResults.jsx";
import { NudesButtonSlider } from "../components/NudesButtonSlider.jsx";
import { NudesResults } from "../components/NudesResults.jsx";

export const Popup = () => {
  return (
    <main>
      <h3>Profanity Eater</h3>
      <WebpageLink/>
      <div className="btns-container">
        <TextButtonSlider/>
        <VocabularyButtonSlider />
        <VocabularyInput />
        <ImagesButonSlider/>
        <NudesButtonSlider/>
      </div>
      <div className="result-container">
      <VocabularyResults/>
      <TextResults/>
      <ImagesResults/>
      <NudesResults/>
      </div>
    </main>
  );
}

