import React from "react";


export const  ButtonContainer = ({textBody,children})=>{

  return  <div className="btn-container">
      <span className="btn-text">{textBody}</span>
      <label className="slider">
        {children}
        <span className="slider-inner"></span>
      </label>
    </div>

}
