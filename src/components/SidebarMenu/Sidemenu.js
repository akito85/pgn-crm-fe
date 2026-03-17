import { Menu } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
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
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedLeafKeys, setSelectedLeafKeys] = useState([]);
  const [temporaryKeys, setTemporaryKeys] = useState([]);
  const getLocation = location.pathname;
  const { side_bar } = useSelector((state) => state?.auth);

  const datas = useMemo(() => JSON.parse(side_bar), [side_bar]);

  // convert to flat map from tree data
  const extractPaths = useCallback(
    (data) =>
      data.flatMap((item) => [
        item,
        ...(item.children ? extractPaths(item.children) : []),
        // ...(item.children ? extractPaths(item.children) : []),
      ]),
    []
  );

  // flat aray from tree data
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

    // set temporary if user in the form page or detail
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

    // Get only leaf node keys (actual menu items, no children)
    const leafKeys = extractPaths(activeKeys)
      .filter((item) => !item.children || item.children.length === 0)
      .map((item) => item.key);

    // Get only parent keys required to expose the selected item
    const requiredParentKeys = extractPaths(activeKeys)
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.key);

    setSelectedLeafKeys(leafKeys);

    // Only MERGE required parent keys into openKeys — never replace
    // This prevents the collapse/expand flicker on navigation
    if (requiredParentKeys.length > 0) {
      setOpenKeys((prev) => {
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
  const generateMenuItems = useCallback(
    (data) => {
      return data.map((item) => {
        if (item.children) {
          // Check if any child is selected
          const hasSelectedChild = item.children.some((child) => {
            const flatChildren = extractPaths([child]);
            return flatChildren.some((flatChild) =>
              selectedLeafKeys?.includes(flatChild.key)
            );
          });

          return (
            <Menu.SubMenu
              key={item?.key}
              icon={
                <SVGIcon
                  name={item?.icon}
                  width={20}
                  color={hasSelectedChild ? "#0075BF" : "#000000"}
                  style={{
                    marginRight: isCollapsed ? "80px" : "12px",
                    marginLeft: isCollapsed ? "-5px" : "",
                    marginTop: isCollapsed ? "10px" : "",
                    transition: "color 0.3s ease",
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
              className={
                selectedLeafKeys?.includes(item?.key) &&
                isCollapsed &&
                "ant-menu-submenu ant-menu-submenu-vertical ant-menu-submenu-selected ant-menu-submenu-title"
              }
              icon={
                <SVGIcon
                  name={item?.icon}
                  width={20}
                  color={selectedLeafKeys?.includes(item?.key) ? "#0075BF" : "#000000"}
                  style={{
                    marginRight: isCollapsed ? "80px" : "12px",
                    marginLeft: isCollapsed ? "-5px" : "",
                    marginTop: isCollapsed ? "10px" : "",
                    transition: "color 0.3s ease",
                  }}
                  className="sidebar-icon"
                />
              }
            >
              {newTabCallback(item)}
              {/* <Link to={item.path}>{item.name}</Link> */}
            </Menu.Item>
          );
        }
      });
    },
    [selectedLeafKeys, isCollapsed, newTabCallback]
  );

  // render props if collapse
  const renderProps = (collapsed) => {
    const keysToUse = openKeys?.length === 0 ? temporaryKeys : openKeys;

    if (collapsed) {
      return {
        defaultOpenKeys: keysToUse,
      };
    } else {
      return {
        openKeys: keysToUse,
        onOpenChange: (keys) => {
          setOpenKeys(keys);
        },
      };
    }
  };

  return (
    <div>
      <Menu
        theme="light"
        selectedKeys={selectedLeafKeys}
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
