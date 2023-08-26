import { validFileTypes } from "../constants/constants";

/**
 *
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
