import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { v4 as uuid } from "uuid";
import { Annotation } from "./Annotation";
import { Toolbar } from "./Toolbar";
import { ImageContainer } from "./ImageContainer";
import { assets } from "../assets";

export const Dashboard = () => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);
  const [selectedId, selectAnnotation] = useState(null);
  const [canvasMeasures, setCanvasMeasures] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { image1, image2, image3, image4, image5 } = assets;

  // setting default value. In actual, we'll be getting this array from API
  // and thus the id for each image will be static
  const [images, setImages] = useState([
    {
      id: uuid(),
      url: image1,
    },
    {
      id: uuid(),
      url: image2,
    },
    {
      id: uuid(),
      url: image3,
    },
    {
      id: uuid(),
      url: image4,
    },
    {
      id: uuid(),
      url: image5,
    },
  ]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [allData, setAllData] = useState({});
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);

  useEffect(() => {
    const currentImageAnnotations = allData[images[selectedImage].id];
    if (currentImageAnnotations) setAnnotations([...currentImageAnnotations]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, selectedImage]);

  // creating new annotation
  const handleMouseDown = (event) => {
    if (selectedId === null && newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuid();
      setNewAnnotation([
        {
          x,
          y,
          width: 0,
          height: 0,
          id,
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          rotation: 0,
        },
      ]);
    }
  };

  // creating new annotation
  const handleMouseMove = (event) => {
    if (selectedId === null && newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = uuid();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id,
          x1: sx,
          y1: sy,
          x2: x,
          y2: y,
        },
      ]);
    }
  };

  // saving new Annotation in the annotations array
  const handleMouseUp = () => {
    if (selectedId === null && newAnnotation.length === 1) {
      annotations.push(...newAnnotation);
      setAnnotations(annotations);
      setNewAnnotation([]);
    }
  };

  // changing the cursor to denote ability to draw annotations
  const handleMouseEnter = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // deleting annotations via 'delete' keyboard button
  const handleKeyDown = (event) => {
    if (event.keyCode === 46) {
      if (selectedId !== null) {
        const newAnnotations = annotations.filter(
          (annotation) => annotation.id !== selectedId
        );
        setAnnotations(newAnnotations);
      }
    }
  };

  const handleImageChange = (index) => {
    // update the selected image index and pick annotations for current image
    setSelectedImage(index);
    setAnnotations(allData[index] ?? []);
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];

  const handleSave = () => {
    // save annotations for curernt image in allData object
    const data = { ...allData };
    data[images[selectedImage].id] = annotationsToDraw;
    setAllData(data);
  };

  const handleSubmit = () => {
    // download json file for
    const fileName = "annotations";
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
  };

  const handleClear = (clearAll) => {
    // clear annotations for current image
    if (clearAll) {
      // clear all annotations (saved + unsaved)
      setAnnotations([]);
      setAllData({ ...allData, [images[selectedImage].id]: [] });
    } else {
      // clear just unsaved annotations
      setAnnotations([...(allData[images[selectedImage].id] ?? [])]);
    }
  };

  const handleImportImage = (data, addImageMethod) => {
    // handler function for adding new images via URL or upload from system
    if (addImageMethod === "upload") {
      // handling uploading images.
      // Current logic supports one upload at a time for demo purpose
      // Can be extended to handle multiple uploads in a single go by adding loop
      const windowURL = window.webkitURL || window.URL;
      const fileURL = windowURL.createObjectURL(data.target.files[0]);

      if (fileURL) {
        const newImage = {
          id: uuid(),
          url: fileURL,
        };
        setImages([...images, newImage]);
        setImageUploadSuccess(true);
      }
    } else if (addImageMethod === "url") {
      // handling addition of new image via URL
      const newImage = {
        id: uuid(),
        url: data,
      };
      setImages([...images, newImage]);
      setImageUploadSuccess(true);
    }
  };

  return (
    <div className="dashboard" tabIndex={1} onKeyDown={handleKeyDown}>
      <Toolbar
        selectedImage={selectedImage + 1}
        handleImageChange={handleImageChange}
        handleSaveAnnotations={handleSave}
        totalImages={images.length}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
        handleImportImage={handleImportImage}
        imageUploadSuccess={imageUploadSuccess}
        setImageUploadSuccess={setImageUploadSuccess}
      />
      <div id="image-container">
        <Stage
          width={canvasMeasures.width}
          height={canvasMeasures.height}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          container={"image-container"}
        >
          <Layer>
            <ImageContainer
              setCanvasMeasures={setCanvasMeasures}
              imageUrl={images[selectedImage].url}
              onMouseDown={() => {
                // deselect when clicked on empty area
                selectAnnotation(null);
              }}
            />
            {annotationsToDraw.map((annotation, i) => {
              return (
                <Annotation
                  key={i}
                  shapeProps={annotation}
                  isSelected={annotation.id === selectedId}
                  onSelect={() => {
                    selectAnnotation(annotation.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = annotations.slice();
                    rects[i] = newAttrs;
                    setAnnotations(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
