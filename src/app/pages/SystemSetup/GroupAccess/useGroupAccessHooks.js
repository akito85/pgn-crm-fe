import { useCallback, useEffect, useState } from "react";
import { hasValue } from "../../../../utils";

export const useGroupAccessHooks = () => {
  const [treeActions, setTreeActions] = useState([]);
  const [detailActions, setDetailActions] = useState([]);
  const [tempDetailActions, setTempDetailActions] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [infoNode, setInfoNode] = useState({ isChecked: false, node: {} });

  //   transform to render treeaction and menu
  const transformTreeActions = useCallback((tree = []) => {
    if (Array.isArray(tree)) {
      const transformActions = tree.map((item) => {
        return {
          menuId: item?.menuId,
          title: item?.name,
          key: item?.menuId.toString(),
          children: item?.actionList.map((act) => {
            return {
              title: act.name,
              parent: item?.menuId?.toString(),
              id: act.actionId,
              key: `${item?.menuId}-${act.actionId}`,
            };
          }),
        };
      });
      setTreeActions(transformActions);
      return transformActions;
    }
    return [];
  }, []);

  //   transform to detail action
  const transformDataDetailActions = useCallback((data_detail = []) => {
    if (Array.isArray(data_detail)) {
      const resMenu = data_detail.map((menu) => {
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
              gaActionId: action?.gaActionId,
              parent: menu?.menuId?.toString(),
              isSelected: true,
              key: `${menu.menuId}-${action.actionId}`,
            };
          }),
        };
      });
      setTempDetailActions(resMenu);
      setDetailActions(resMenu);
      return resMenu;
    }
    return [];
  }, []);

  //   tranform to keys array
  const transformGaMenuSelectedKeys = useCallback(
    (menu = [], data_detail = []) => {
      const checkedKeys = [];
      const traverse = (items) => {
        items.forEach((item) => {
          // Jika parent atau child isSelected, masukkan key-nya
          if (item.isSelected) {
            checkedKeys.push(item.key);
          }
          if (item.children && item.children.length > 0) {
            traverse(item.children);
          }
        });
      };

      traverse(data_detail);
      setSelectedKeys(checkedKeys);
      return checkedKeys;

      // data_detail?.forEach((itemDetail) => {
      //   const foundMenu = menu.find((item) => item.key === itemDetail.key);

      //   if (foundMenu && foundMenu.children?.length === 0) {
      //     checkedKeys.push(foundMenu.key);
      //   } else if (foundMenu && foundMenu.children?.length > 0) {
      //     const actionSelected = itemDetail.children.map((item) => item.key);
      //     foundMenu.children.forEach((action) => {
      //       if (actionSelected.includes(action.key)) {
      //         checkedKeys.push(action.key);
      //       }
      //     });
      //   }
      // });
      // return checkedKeys;
    },
    [],
  );

  const transformOnCheckSelectedTreeActions = useCallback(
    (selectedDatas = {}, keys = []) => {
      // console.log(selectedDatas, detailActions);
      // const result = [];
      // const pushedIds = new Set();
      // treeActions.forEach((treeItems) => {
      //   const matchedChild = treeItems?.children
      //     ?.filter((filterChild) => keys.includes(filterChild.key))
      //     .map((item) => ({ ...item, isSelected: true }));
      //   if (matchedChild.length > 0) {
      //     result.push({
      //       ...treeItems,
      //       isSelected: true,
      //       children: matchedChild,
      //     });
      //     pushedIds.add(treeItems?.menuId);
      //   }
      // });
      // selectedDatas.forEach((item) => {
      //   const isTopLevel = !item.parent && !pushedIds.has(item.menuId);
      //   if (isTopLevel) {
      //     result.push(item);
      //     pushedIds.add(item.menuId);
      //   }
      // });
      // return result;
    },
    [treeActions],
  );

  const transformBodyActions = useCallback(
    (selectedMenus = []) => {
      console.log(tempDetailActions, selectedMenus);

      if (Array.isArray(selectedMenus)) {
        const selectedMenuMap = new Map();
        const selectedActionMap = new Map();

        selectedMenus.forEach((menu) => {
          selectedMenuMap.set(menu.menuId, menu.isSelected);

          (menu.children || []).forEach((child) => {
            selectedActionMap.set(child.key, child.isSelected);
          });
        });

        const menuMap = new Map();

        [...tempDetailActions, ...selectedMenus].forEach((menu) => {
          const existing = menuMap.get(menu.menuId);
          const mergedChildren = [
            ...(existing?.children || []),
            ...(menu.children || []),
          ];

          const childrenMap = new Map();
          mergedChildren.forEach((child) => {
            childrenMap.set(child.id, {
              ...child,
              parent: parseInt(child?.parent),
              actionId: child?.id,
              gaActionId: hasValue(child?.gaActionId)
                ? child?.gaActionId
                : null,
              isSelected: selectedActionMap.has(child.key),
            });
          });

          const children = Array.from(childrenMap.values());

          menuMap.set(menu.menuId, {
            ...menu,
            key: parseInt(menu?.key),
            gaMenuId: hasValue(menu?.gaMenuId) ? menu?.gaMenuId : null,
            isSelected:
              selectedMenuMap.has(menu.menuId) ||
              children.some((c) => c.isSelected),
            children,
          });
        });

        const result = Array.from(menuMap.values());
        // console.log(result, " mauu liat hasil akhirnya");
        return result;
      }

      return [];
    },
    [tempDetailActions],
  );

  const onCheckingKeys = useCallback(
    (isChecked = false, infoNode = {}) => {
      setInfoNode({ isChecked, node: infoNode });
      if (isChecked && infoNode?.children) {
        setSelectedKeys((prev) => {
          const uniqueKeys = new Set([...prev, infoNode?.key]);
          return Array.from(uniqueKeys);
        });
      } else if (isChecked && infoNode?.parent) {
        setSelectedKeys((prev) => {
          const uniqueKeys = new Set([
            ...prev,
            infoNode?.key,
            infoNode?.parent,
          ]);
          return Array.from(uniqueKeys);
        });
      } else if (!isChecked && infoNode?.parent) {
        setSelectedKeys((prev) => prev.filter((key) => key !== infoNode?.key));
      } else {
        setSelectedKeys((prev) =>
          prev.filter(
            (key) =>
              key !== infoNode?.key &&
              !infoNode.children?.some((child) => child.key === key),
          ),
        );
      }
      return detailActions;
    },
    [detailActions],
  );

  const updatedDataActionsWhenChecking = useCallback(
    (infoNode) => {
      const findNodeInTree = (tree, key) => {
        for (const item of tree) {
          if (item.key === key) return item;
          if (item.children && item.children.length > 0) {
            const foundChild = item.children.find((child) => child.key === key);
            if (foundChild) return foundChild;
          }
        }
        return null;
      };
      const filterTree = (tree = [], keyNode, keyParent) =>
        tree
          .map((node) => {
            const match =
              [keyNode, keyParent].includes(node.key) ||
              node.parent === keyParent;
            const children = filterTree(
              node.children || [],
              keyNode,
              keyParent,
            );
            return match || children.length ? { ...node, children } : null;
          })
          .filter(Boolean);
      const foundNode = findNodeInTree(tempDetailActions, infoNode?.node?.key);
      const foundDataInMenu = findNodeInTree(treeActions, infoNode?.node?.key);

      let newValue = {};
      if (infoNode?.isChecked === true && infoNode?.node?.children) {
        if (hasValue(foundNode)) {
          setDetailActions((prev) => {
            const uniqueKeys = new Set([
              ...prev,
              { ...foundNode, children: [] },
            ]);
            return Array.from(uniqueKeys);
          });
        } else {
          newValue = {
            ...foundDataInMenu,
            gaMenuId: null,
            isSelected: infoNode?.isChecked,
            children: [],
          };

          setDetailActions((prev) => {
            const uniqueKeys = new Set([...prev, newValue]);
            return Array.from(uniqueKeys);
          });
        }
      } else if (infoNode?.isChecked === true && infoNode?.node?.parent) {
        const foundNodeParent = findNodeInTree(
          tempDetailActions,
          infoNode?.node?.parent,
        );
        let filteredTreeExact = [];
        if (foundNodeParent) {
          filteredTreeExact = filterTree(
            treeActions,
            infoNode?.node?.key,
            infoNode?.node?.parent,
          )?.map((item) => ({
            ...item,
            gaMenuId: hasValue(foundNodeParent?.gaMenuId)
              ? foundNodeParent?.gaMenuId
              : null,
            isSelected: infoNode?.isChecked,
            children: item?.children
              ? item?.children
                  ?.map((itemChild) => ({
                    ...itemChild,
                    isSelected: infoNode?.isChecked,
                  }))
                  ?.filter(
                    (itemKeyChild) => itemKeyChild?.key === infoNode?.node?.key,
                  )
              : [],
          }));
        } else {
          filteredTreeExact = filterTree(
            treeActions,
            infoNode?.node?.key,
            infoNode?.node?.parent,
          )?.map((item) => ({
            ...item,
            isSelected: infoNode?.isChecked,
            children: item?.children
              ? item?.children
                  ?.map((itemChild) => ({
                    ...itemChild,
                    isSelected: infoNode?.isChecked,
                  }))
                  ?.filter(
                    (itemKeyChild) => itemKeyChild?.key === infoNode?.node?.key,
                  )
              : [],
          }));
        }
        setDetailActions((prev) => {
          const mergedChild = [...filteredTreeExact];
          prev.forEach((sourceNode) => {
            const targetIndex = mergedChild.findIndex(
              (item) => item.key === sourceNode.key,
            );

            if (targetIndex === -1) {
              // Parent not found, add entire node
              mergedChild.push(sourceNode);
            } else {
              // Parent exists, merge children
              const existingChildren = mergedChild[targetIndex].children || [];

              const newChildren = sourceNode.children.filter(
                (child) =>
                  !existingChildren.some(
                    (existing) => existing.key === child.key,
                  ),
              );

              mergedChild[targetIndex].children = [
                ...existingChildren,
                ...newChildren,
              ];
            }
          });
          return mergedChild;
        });
      } else if (infoNode?.isChecked === false && infoNode?.node?.parent) {
        // if (foundNode) {
        setDetailActions((prev) => {
          const filterPrev = (tree = [], keyNode) => {
            return tree
              ?.filter((node) => node?.key !== keyNode)
              ?.map((itemNode) => ({
                ...itemNode,
                children: itemNode?.children
                  ? filterPrev(itemNode?.children, keyNode)
                  : [],
              }));
          };
          return filterPrev(prev, infoNode?.node?.key);
        });
      } else if (infoNode?.isChecked === false && infoNode?.node?.children) {
        setDetailActions((prev) =>
          prev.filter((itemPrev) => itemPrev?.key !== infoNode?.node?.key),
        );
      }
    },
    [tempDetailActions, treeActions],
  );

  useEffect(() => {
    if (selectedKeys?.length > 0) {
      updatedDataActionsWhenChecking(infoNode);
    } else {
      setDetailActions([]);
    }
  }, [infoNode, selectedKeys?.length, updatedDataActionsWhenChecking]);

  const clearAllState = useCallback(() => {
    setDetailActions([]);
    setSelectedKeys(
      transformGaMenuSelectedKeys(treeActions, tempDetailActions),
    );
    setInfoNode({ isChecked: false, node: {} });
    setTempDetailActions([]);
  }, [tempDetailActions, transformGaMenuSelectedKeys, treeActions]);

  return {
    transformTreeActions,
    transformDataDetailActions,
    transformGaMenuSelectedKeys,
    transformOnCheckSelectedTreeActions,
    transformBodyActions,
    onCheckingKeys,
    detailActions,
    selectedKeys,
    clearAllState,
  };
};
