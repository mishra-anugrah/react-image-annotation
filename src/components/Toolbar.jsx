import React from "react";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@mui/material";

export const Toolbar = (props) => {
  const {
    selectedImage,
    handleImageChange,
    handleSaveAnnotations,
    totalImages,
    handleSubmit,
    handleClear,
    handleImportImage,
    imageUploadSuccess,
    setImageUploadSuccess,
  } = props;

  return (
    <div className="toolbar">
      <Button
        className={`toolbar__button previous-image ${
          selectedImage === 1 ? "disabled" : ""
        }`}
        onClick={() => {
          if (selectedImage !== 1) handleImageChange(selectedImage - 2);
        }}
      >
        Prev Image
      </Button>
      <Button className="toolbar__info">{`${selectedImage} / ${totalImages}`}</Button>
      <Button
        className={`next-image toolbar__button ${
          selectedImage === totalImages ? "disabled" : ""
        }`}
        onClick={() => {
          if (selectedImage !== totalImages) handleImageChange(selectedImage);
        }}
      >
        Next Image
      </Button>
      <Button className="toolbar__button" onClick={handleSaveAnnotations}>
        Save
      </Button>
      <Button className="toolbar__button" onClick={handleSubmit}>
        Submit
      </Button>
      <Button className="toolbar__button" onClick={() => handleClear(false)}>
        Clear unsaved
      </Button>
      <Button className="toolbar__button" onClick={() => handleClear(true)}>
        Clear all
      </Button>
      <ImageUpload
        handleImportImage={handleImportImage}
        imageUploadSuccess={imageUploadSuccess}
        setImageUploadSuccess={setImageUploadSuccess}
      />
    </div>
  );
};
