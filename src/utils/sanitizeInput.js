export const sanitizeNumericInput = (value) => {
  if (!value) return '';
  // Remove non-numeric characters except decimal point and comma
  return value.toString().replace(/[^\d.,]/g, '');
};
