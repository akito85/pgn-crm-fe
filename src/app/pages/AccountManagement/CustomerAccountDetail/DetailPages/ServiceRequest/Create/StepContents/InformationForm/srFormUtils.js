export const getDropdownItems = (dropdowns, key) => {
  const dropdown = dropdowns?.[key];
  if (!dropdown) return [];
  if (Array.isArray(dropdown)) return dropdown;
  if (Array.isArray(dropdown?.data)) return dropdown.data;
  return [];
};
