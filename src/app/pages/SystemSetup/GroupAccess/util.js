
/** process GA Menu from data detail for form value or Tree data value */
export const transformGaMenuDetail = (data_detail) => {
  const gaMenu = data_detail?.gaMenu || [];
  const resMenu = gaMenu.map((menu) => {
    return {
      gaMenuId: menu.gaMenuId,
      menuId: menu.menuId,
      title: menu.menuName,
      isSelected: true,
      key: menu.menuId.toString(),
      children: menu.gaAction.map((action) => {
        return {
          title: action.actionName,
          id: action.actionId,
          parent: menu.menuId,
          isSelected: true,
          key: `${menu.menuId}-${action.actionId}`,
        };
      }),
    };
  });
  return resMenu;
};