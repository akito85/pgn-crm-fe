import { message } from "antd";

export const ALLOWED_FILE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.xlsx'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates a single file against provided or default constraints.
 * @param {File} file - The file object to validate.
 * @param {Object} options - Validation constraints.
 * @returns {string[]} Array of error messages.
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = ALLOWED_FILE_TYPES,
    allowedExtensions = ALLOWED_EXTENSIONS,
    maxSize = MAX_FILE_SIZE
  } = options;

  const errors = [];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} tidak diizinkan`);
  }
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    errors.push(`Extension ${ext} tidak diizinkan`);
  }
  if (file.size > maxSize) {
    errors.push(`Ukuran file melebihi ${maxSize / 1024 / 1024}MB`);
  }
  return errors;
};

/**
 * Validates and uploads multiple attachments.
 * @param {Array} attachments - Array of attachment objects { file, fileCategoryId }.
 * @param {string|number} referensiId - The ID to associate the attachment with.
 * @param {string} category - The attachment category (e.g., PAYMENT_WARRANTY_PARTNER_BRANCH).
 * @param {Function} uploadFn - Async function (body) => promise that handles the actual upload logic.
 * @param {Object} options - Additional options including validation, etc.
 */
export const uploadAttachments = async (attachments, referensiId, category, uploadFn, options = {}) => {
  const {
    validate = true,
    validationOptions = {}
  } = options;

  for (const element of attachments) {
    if (validate) {
      const validationErrors = validateFile(element.file, validationOptions);
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(', ');
        message.error(errorMsg);
        throw new Error(errorMsg);
      }
    }

    const uploadBody = {
      referensiId: referensiId,
      files: element.file,
      category: category,
      fileCategoryId: element.fileCategoryId,
    };
    
    await uploadFn(uploadBody);
  }
};
