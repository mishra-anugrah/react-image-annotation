import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

export const ImageContainer = ({
  imageUrl,
  setCanvasMeasures,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}) => {
  const [image, setImage] = useState(null);

  // handle change in image URL to render the current image and set canvas measures accordingly
  useEffect(() => {
    // const canvasHeight = window.innerHeight - 40;
    // const canvasWidth = window.innerWidth - 10;

    const imageToLoad = new window.Image();
    imageToLoad.src = imageUrl;
    imageToLoad.addEventListener("load", () => {
      setImage(imageToLoad);
      setCanvasMeasures({
        // width: canvasWidth,
        // height: canvasHeight,
        width: imageToLoad.width,
        height: imageToLoad.height,
      });
    });
  }, [imageUrl, setImage, setCanvasMeasures]);

  return (
    <Image
      image={image}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};
