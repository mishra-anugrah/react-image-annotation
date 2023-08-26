import { validFileTypes } from "../constants/constants";
import { v4 as uuid } from "uuid";

/**
 * File type validator to validate against the allowed file types
 * @param {(File[] | File)} files - files to validate
 * @returns {boolean} whether the file is allowed
 */
export const isValidUploadedFileType = (files) => {
  if (Array.isArray(files)) {
    // multiple file upload
    return files.every((file) => validFileTypes.includes(file.type));
  } else {
    // single file
    return validFileTypes.includes(files.type);
  }
};

/**
 * Transformer to prepare JSON data for downloading
 * @param {Object} data - Annotations data to transform
 * @returns {Object} Transformed Annotations to be downloaded
 */
export const prepareJSONData = (data) => {
  const transformedData = {};
  for (const [imageId, annotations] of Object.entries(data)) {
    const finalAnnotations = annotations.map((annotation) => {
      const { x1, y1, x2, y2 } = annotation;
      return { x1, y1, x2, y2 };
    });

    transformedData[imageId] = finalAnnotations;
  }

  return transformedData;
};

/**
 * Prepare Konva compatible data from JSON data
 * @param {Object} data - JSON annotations data
 * @returns {Object} Konva compatible data
 */
export const transformJSONDataToKonvaCompatible = (data) => {
  const transformedData = {};
  for (const [imageId, annotations] of Object.entries(data)) {
    const finalAnnotations = annotations.map((annotation) => {
      const { x1, y1, x2, y2 } = annotation;
      return {
        x1,
        y1,
        x2,
        y2,
        x: x1,
        y: y1,
        height: y1 + y2,
        width: x1 + x2,
        id: uuid(),
      };
    });

    transformedData[imageId] = finalAnnotations;
  }

  return transformedData;
};
