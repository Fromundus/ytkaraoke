import React from 'react';
import { BiFullscreen } from "react-icons/bi";

const FullscreenButton = () => {
  const handleFullscreen = () => {
    const elem = document.documentElement; // This targets the entire page

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE11
        elem.msRequestFullscreen();
      }
    } 
    // else {
    //   // Exit fullscreen
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.webkitExitFullscreen) { // Safari
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) { // IE11
    //     document.msExitFullscreen();
    //   }
    // }
  };

  return (
    <button
      onClick={handleFullscreen}
      className="text-4xl"
    >
      <BiFullscreen />
    </button>
  );
};

export default FullscreenButton;
