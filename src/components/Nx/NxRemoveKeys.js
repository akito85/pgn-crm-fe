const nxRemoveKeys = (array) => array.map((item) => {
  delete item.key;

  return item;
});

export { nxRemoveKeys }