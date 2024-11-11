import { adjustContentScript } from "./adjustContentScript.js";
import { contentClasses } from "../constants/constants.js";

console.log('contentScript is running')

adjustContentScript(contentClasses.text)
adjustContentScript(contentClasses.vocabulary)
adjustContentScript(contentClasses.images)
adjustContentScript(contentClasses.nudes)

