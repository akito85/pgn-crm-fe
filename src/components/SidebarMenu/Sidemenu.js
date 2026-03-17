import { Menu } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SVGIcon from "../../../src/assets/Icon/index";
import { useState } from "react";

/** Whitelist Sidemenu */
const whitelistMenu = [
  "Profile",
  "Price Adjustment",
  "Account Service Agreement",
  "Account Service Agreement TOS",
  "Account Address",
  "Account Contact",
  "Account Gas Source",
  "Account Information",
  "Account Premise",
  "Account Service Point",
  "Account Service Point Asset",
  "Customer Information",
  "Bank Account Information",
  "Service Agreement Main",
  "Service Agreement Addon",
  "Service Agreement Amandemen",
  "Account Address Onetime",
  "Account Contact Onetime",
  "Account Financial Information One Time",
  "Account Distribution Media One Time",
  "Account Gas Source Onetime",
  "Account Information Onetime",
  "Account Premise Onetime",
  "Account Service Point Onetime",
  "Account Service Point Asset Onetime",
  "Late Charges Rule",
  "Rate Type",
  "Tax Implication Rule",
  "Billing Cycle Detail",
  "Distribution Media",
  "Financial Information",
  "Gas Source Quality",
  "Raw Material Source",
  "Product Distribution",
  "Gas Utilization",
  "Raw Material Source",
  "Product Distribution",
  "Additional Information",
  "Account Equipment",
  "Detail Product",
  "Relationship",
  "Notifications",
];

const SideMenu = ({ isCollapsed }) => {
  const location = useLocation();
  // openMenuKeys: which SubMenus are expanded — only ever contains submenu keys, never leaf keys
  const [openMenuKeys, setOpenMenuKeys] = useState([]);
  // urlLeafKeys: which leaf items match the current URL — used for selectedKeys
  const [urlLeafKeys, setUrlLeafKeys] = useState([]);
  // temporaryKeys: fallback when on a form/detail page that has no direct menu match
  const [temporaryKeys, setTemporaryKeys] = useState([]);
  // requiredParentKeysRef: always holds the current page's ancestor submenu keys.
  // Used in onOpenChange to prevent Ant Design from collapsing the active parent
  // when it fires onOpenChange during <Link> navigation (a known Ant Design v4 quirk).
  const requiredParentKeysRef = useRef([]);
  const getLocation = location.pathname;
  const { side_bar } = useSelector((state) => state?.auth);

  const datas = useMemo(() => JSON.parse(side_bar), [side_bar]);

  // convert to flat map from tree data
  const extractPaths = useCallback(
    (data) =>
      data.flatMap((item) => [
        item,
        ...(item.children ? extractPaths(item.children) : []),
      ]),
    []
  );

  // flat array from tree data with unique keys
  const extractPathsKey = useCallback(
    (data, parentKey = "") =>
      data.flatMap((item) => {
        const uniqueKey = parentKey ? `${parentKey}-${item.id}` : item.id;
        return [
          { ...item, key: uniqueKey },
          ...(item.children ? extractPathsKey(item.children, uniqueKey) : []),
        ];
      }),
    []
  );

  // find specific parent
  const findMatchingPath = (data, currentPath) => {
    let bestMatch = null;
    const searchTree = (items, parentPath = "") => {
      for (const item of items) {
        const fullPath = `${parentPath}${item.path}`;
        if (currentPath.startsWith(fullPath)) {
          if (!bestMatch || fullPath.length > bestMatch.path.length) {
            bestMatch = { ...item, path: fullPath };
          }
          if (item.children) {
            searchTree(item.children, fullPath);
          }
        }
      }
    };

    searchTree(data);
    return bestMatch;
  };

  // mapping menu and add key
  const mappingMenu = (data, parentKey = "") => {
    return data?.map((item) => {
      const uniqueKey = parentKey ? `${parentKey}-${item.id}` : item.id;
      if (item?.children) {
        return {
          key: uniqueKey?.toString(),
          label: item?.name,
          path: item?.path,
          ...item,
          children: mappingMenu(item?.children, uniqueKey),
        };
      } else {
        return {
          key: uniqueKey?.toString(),
          label: item?.name,
          path: item?.path,
          ...item,
        };
      }
    });
  };

  // filtering path
  const filterMenuByPath = (data, targetPath) => {
    const filterRecursive = (items) => {
      return items
        ?.map((item) => {
          if (item?.path === targetPath) {
            return item;
          }
          if (item.children) {
            const filteredChildren = filterRecursive(item.children);
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
          }
          return null;
        })
        .filter((item) => item !== null);
    };

    return filterRecursive(data);
  };

  useEffect(() => {
    const activeKeys = filterMenuByPath(mappingMenu(datas), getLocation);

    // Set temporary if user is on a form/detail page with no direct menu match
    if (activeKeys?.length === 0) {
      const keys = extractPathsKey(datas);
      const findMatching = findMatchingPath(keys, getLocation);
      const parentKey = filterMenuByPath(
        mappingMenu(datas),
        findMatching?.path
      );
      const extractingKeys = extractPaths(parentKey)?.map((item) => item?.key);
      setTemporaryKeys(extractingKeys);
    }

    const allActiveItems = extractPaths(activeKeys);

    // Leaf keys: actual selectable items (no children) — drives icon color + selectedKeys
    const leafKeys = allActiveItems
      .filter((item) => !item.children || item.children.length === 0)
      .map((item) => item.key);

    // Parent keys: submenus that must be open to show the current page
    const requiredParentKeys = allActiveItems
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.key);

    // Keep the ref in sync — onOpenChange reads this to protect the active parent.
    requiredParentKeysRef.current = requiredParentKeys;

    setUrlLeafKeys(leafKeys);

    // Only MERGE required parent keys — never replace the full openMenuKeys.
    // This preserves any other submenus the user manually opened.
    // openMenuKeys never receives leaf keys, so Ant Design won't glitch on navigation.
    if (requiredParentKeys.length > 0) {
      setOpenMenuKeys((prev) => {
        const merged = new Set([...(prev || []), ...requiredParentKeys]);
        return Array.from(merged);
      });
    }
  }, [getLocation]);

  // remove menu from list
  function removeProfileItems(tree) {
    if (!Array.isArray(tree)) {
      return tree;
    }

    return tree
      .map((item) => {
        if (whitelistMenu.includes(item.name)) {
          return null;
        }

        if (item.children) {
          item.children = removeProfileItems(item.children);
        }

        return item;
      })
      .filter((item) => item !== null);
  }
  const menu = removeProfileItems(datas);

  const newTabCallback = useCallback((data) => {
    if (data?.path?.includes("https://dev-plasma.pgn.co.id/")) {
      return (
        <a
          href={"https://plasma.pgn.co.id/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data?.name}
        </a>
      );
    } else if (data?.path?.includes("http://10.129.2.39:8080/ords/f?p=113")) {
      return (
        <a
          href={"http://rms.pgn.co.id:7780/apex/f?p=113"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data?.name}
        </a>
      );
    } else {
      return <Link to={data?.path}>{data?.name}</Link>;
    }
  }, []);

  // render sub menu
  // Does NOT depend on urlLeafKeys — menu structure is stable across navigations.
  // Active state is communicated via selectedKeys/openKeys props only.
  // Icon coloring is handled by CSS :has(.ant-menu-item-selected) — no JS needed.
  const generateMenuItems = useCallback(
    (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <Menu.SubMenu
              key={item?.key}
              icon={
                <SVGIcon
                  name={item?.icon}
                  width={20}
                  style={{
                    marginRight: isCollapsed ? "80px" : "12px",
                    marginLeft: isCollapsed ? "-5px" : "",
                    marginTop: isCollapsed ? "10px" : "",
                  }}
                  className="sidebar-icon"
                />
              }
              title={<span>{item.name}</span>}
            >
              {generateMenuItems(item.children)}
            </Menu.SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item?.key}
              icon={
                <SVGIcon
                  name={item?.icon}
                  width={20}
                  style={{
                    marginRight: isCollapsed ? "80px" : "12px",
                    marginLeft: isCollapsed ? "-5px" : "",
                    marginTop: isCollapsed ? "10px" : "",
                  }}
                  className="sidebar-icon"
                />
              }
            >
              {newTabCallback(item)}
            </Menu.Item>
          );
        }
      });
    },
    [isCollapsed, newTabCallback]
  );

  // render props if collapse
  const renderProps = (collapsed) => {
    // Fall back to temporaryKeys only on form/detail pages (urlLeafKeys also empty).
    // When on a real page, respect openMenuKeys even if the user collapsed everything.
    const keysToUse =
      openMenuKeys?.length === 0 && urlLeafKeys?.length === 0
        ? temporaryKeys
        : openMenuKeys;

    if (collapsed) {
      return {
        defaultOpenKeys: keysToUse,
      };
    } else {
      return {
        openKeys: keysToUse,
        onOpenChange: (keys) => {
          // Ant Design v4 fires onOpenChange during <Link> navigation, passing a
          // reduced key set that excludes the active parent. Merge with the ref to
          // ensure the current page's ancestor submenus are never collapsed by this.
          setOpenMenuKeys(() => {
            const merged = new Set([...keys, ...requiredParentKeysRef.current]);
            return Array.from(merged);
          });
        },
      };
    }
  };

  return (
    <div>
      <Menu
        theme="light"
        selectedKeys={urlLeafKeys?.length === 0 ? temporaryKeys : urlLeafKeys}
        mode="inline"
        className={"mb-6"}
        {...renderProps(isCollapsed)}
      >
        {generateMenuItems(mappingMenu(menu))}
      </Menu>
    </div>
  );
};

export default React.memo(SideMenu);
