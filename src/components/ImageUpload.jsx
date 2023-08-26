import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { isValidUploadedFileType } from "../utils/utils";

export const ImageUpload = (props) => {
  const { handleImportImage, imageUploadSuccess, setImageUploadSuccess } =
    props;

  const [showInputDialog, setShowInputDialog] = useState(false);
  const [addByUrl, setAddByUrl] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadImageEvent, setUploadImageEvent] = useState(null);

  const handleClose = () => {
    // handle close "add image dialog"
    setShowInputDialog(!showInputDialog);
    setImageUploadSuccess(false);
  };

  const handleAddImage = () => {
    // handler for "Adding new image"
    if (addByUrl) {
      handleImportImage(newImageUrl, "url");
    } else {
      handleImportImage(uploadImageEvent, "upload");
    }
  };

  const handleFileInputChange = (event) => {
    // Handling change in uploda file element by first validating the file type
    if (isValidUploadedFileType(event.target.files[0])) {
      setUploadImageEvent(event);
    } else {
      alert("Invalid file type");
      event.target.value = "";
    }
  };

  return (
    <div className="image-upload">
      <Button
        className="toolbar__button"
        onClick={() => setShowInputDialog(!showInputDialog)}
      >
        Add image
      </Button>

      <Backdrop open={showInputDialog} sx={{ zIndex: 100 }}>
        <Dialog open={showInputDialog} className="image-upload__dialog">
          <DialogTitle>Add new image</DialogTitle>
          <DialogContent>
            <div className="add-image-switch">
              <Typography>Upload</Typography>
              <Switch
                checked={addByUrl}
                onChange={() => setAddByUrl(!addByUrl)}
                value={addByUrl}
                color="default"
              />
              <Typography>Add URL</Typography>
            </div>

            {addByUrl ? (
              <div className="add-image-by-url">
                <TextField
                  label="Enter Image URL"
                  value={newImageUrl}
                  onChange={(event) => setNewImageUrl(event.target.value)}
                />
              </div>
            ) : (
              <div className="add-image-by-upload">
                <input type="file" onChange={handleFileInputChange} />

                {imageUploadSuccess && (
                  <Typography>Image uploaded successfully</Typography>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {newImageUrl || uploadImageEvent ? (
              <Button onClick={handleAddImage}>Add Image</Button>
            ) : null}
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </div>
  );
};
