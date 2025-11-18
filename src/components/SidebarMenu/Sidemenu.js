import { Menu } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SVGIcon from "../../../src/assets/Icon/index";

/** Whitelist Sidemenu */
const whitelistMenu = [
  "Profile", "Price Adjustment", "Account Service Agreement", "Account Service Agreement TOS", "Account Address",
  "Account Contact", "Account Gas Source", "Account Information", "Account Premise", "Account Service Point",
  "Account Service Point Asset", "Customer Information", "Bank Account Information", "Service Agreement Main",
  "Service Agreement Addon", "Service Agreement Amandemen", "Account Address Onetime", "Account Contact Onetime",
  "Account Financial Information One Time", "Account Distribution Media One Time", "Account Gas Source Onetime",
  "Account Information Onetime", "Account Premise Onetime", "Account Service Point Onetime",
  "Account Service Point Asset Onetime", "Late Charges Rule", "Rate Type", "Tax Implication Rule",
  "Billing Cycle Detail", "Distribution Media", "Financial Information", "Gas Source Quality",
  "Raw Material Source", "Product Distribution", "Gas Utilization", "Additional Information", "Account Equipment", "Detail Product",
];

const SideMenu = ({ isCollapsed }) => {
  const location = useLocation();
  const { side_bar } = useSelector((state) => state?.auth);

  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const datas = useMemo(() => {
    if (!side_bar) return [];
    let originalMenu = JSON.parse(side_bar);

    // --- Inject Activity Action into Debt & Collection ---
    const activityActionMenu = {
      id: "activity-action",
      name: "Activity Action",
      path: "/debt-and-collection/activity-action",
      icon: "solution", // Example icon
      children: [],
    };

    const injectMenu = (menuItems) => {
      return menuItems.map(item => {
        if (item.name === "Debt And Collection") {
          const newChildren = item.children ? [...item.children] : [];
          if (!newChildren.find(child => child.name === "Activity Action")) {
            newChildren.push(activityActionMenu);
          }
          return { ...item, children: newChildren };
        }
        if (item.children) {
          return { ...item, children: injectMenu(item.children) };
        }
        return item;
      });
    };

    return injectMenu(originalMenu);
    // ----------------------------------------------------

  }, [side_bar]);

  const mappingMenu = useCallback((data, parentKey = "") => {
    return data?.map((item) => {
      const uniqueKey = parentKey ? `${parentKey}-${item.id}` : item.id;
      const result = {
        ...item,
        key: uniqueKey.toString(),
        label: item.name,
      };
      if (item.children && item.children.length > 0) {
        result.children = mappingMenu(item.children, uniqueKey);
      }
      return result;
    });
  }, []);

  const menuItems = useMemo(() => mappingMenu(datas) || [], [datas, mappingMenu]);

  useEffect(() => {
    const getPath = (items, currentPath, parentKeys = []) => {
      for (const item of items) {
        // Use a less strict check for matching path
        if (item.path && currentPath.startsWith(item.path)) {
          const newParentKeys = [...parentKeys, item.key];
          // Check for exact match for selection
          if (currentPath === item.path) {
            return { open: newParentKeys, selected: [item.key] };
          }
          if (item.children) {
            const childResult = getPath(item.children, currentPath, newParentKeys);
            if (childResult) return childResult;
          }
          // Return parent keys even if no exact child match (for opening dropdowns)
          return { open: newParentKeys, selected: [] };
        }
      }
      return null;
    };

    const activePath = getPath(menuItems, location.pathname);
    if (activePath) {
      setOpenKeys(activePath.open);
      setSelectedKeys(activePath.selected);
    }
  }, [location.pathname, menuItems]);


  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const removeProfileItems = (tree) => {
    if (!Array.isArray(tree)) return tree;
    return tree
      .map((item) => {
        if (whitelistMenu.includes(item.name)) return null;
        if (item.children) {
          item.children = removeProfileItems(item.children);
        }
        return item;
      })
      .filter((item) => item !== null);
  };

  const finalMenu = useMemo(() => removeProfileItems(menuItems), [menuItems]);

  const newTabCallback = useCallback((data) => {
    if (data?.path?.includes("https://dev-plasma.pgn.co.id/")) {
      return <a href={"https://plasma.pgn.co.id/"} target="_blank" rel="noopener noreferrer">{data?.name}</a>;
    } else if (data?.path?.includes("http://10.129.2.39:8080/ords/f?p=113")) {
      return <a href={"http://rms.pgn.co.id:7780/apex/f?p=113"} target="_blank" rel="noopener noreferrer">{data?.name}</a>;
    } else {
      return <Link to={data?.path}>{data?.name}</Link>;
    }
  }, []);

  const generateMenuItems = useCallback((data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu
            key={item.key}
            icon={<SVGIcon name={item.icon} width={20} style={{ marginRight: isCollapsed ? "80px" : "12px", marginLeft: isCollapsed ? "-5px" : "", marginTop: isCollapsed ? "10px" : "" }} />}
            title={<span>{item.name}</span>}
          >
            {generateMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={<SVGIcon name={item.icon} width={20} style={{ marginRight: isCollapsed ? "80px" : "12px", marginLeft: isCollapsed ? "-5px" : "", marginTop: isCollapsed ? "10px" : "" }} />}
          >
            {newTabCallback(item)}
          </Menu.Item>
        );
      }
    });
  }, [isCollapsed, newTabCallback]);

  return (
    <div>
      <Menu
        theme="light"
        mode="inline"
        className={"mb-6"}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
      >
        {generateMenuItems(finalMenu)}
      </Menu>
    </div>
  );
};

export default React.memo(SideMenu);
