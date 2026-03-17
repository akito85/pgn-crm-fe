import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SVGIcon from "../../../src/assets/Icon/index";

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

/**
 * SubMenuItem -- renders a submenu <li> with expand/collapse (expanded mode)
 * or a hover-triggered popup flyout (collapsed mode).
 *
 * DOM constraint: must preserve .ant-menu-submenu > .ant-menu-sub > .ant-menu-item-selected
 * nesting for the :has() CSS selector in index.css that colors parent submenu icons.
 */
const SubMenuItem = ({
  item,
  isOpen,
  isSelected,
  isCollapsed,
  hoveredKey,
  onToggle,
  onHover,
  onLeave,
  selectedKeys,
  renderItems,
}) => {
  const titleRef = useRef(null);
  const [popupTop, setPopupTop] = useState(0);

  const isHovered = isCollapsed && hoveredKey === item.key;

  // Compute popup position when hover state changes (collapsed mode only).
  // useLayoutEffect ensures measurement happens before paint -- no position flicker.
  useLayoutEffect(() => {
    if (isHovered && titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const maxH = 300;
      setPopupTop(rect.top + maxH > vh ? vh - maxH - 8 : rect.top);
    }
  }, [isHovered]);

  const submenuClasses = [
    "ant-menu-submenu",
    "ant-menu-submenu-inline",
    isOpen && !isCollapsed ? "ant-menu-submenu-open" : "",
    isSelected ? "ant-menu-submenu-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Collapsed mode: popup flyout on hover
  if (isCollapsed) {
    return (
      <li
        className={submenuClasses}
        role="none"
        onMouseEnter={() => onHover(item.key)}
        onMouseLeave={onLeave}
      >
        <div
          className="ant-menu-submenu-title"
          ref={titleRef}
          aria-haspopup="true"
          aria-expanded={isHovered}
          style={{ paddingLeft: 0 }}
        >
          <span className="ant-menu-item-icon">
            <SVGIcon
              name={item?.icon}
              width={20}
              style={{
                marginRight: "80px",
                marginLeft: "-5px",
                marginTop: "10px",
              }}
              className="sidebar-icon"
            />
          </span>
          <span className="ant-menu-title-content">
            <span>{item.name}</span>
          </span>
        </div>
        {isHovered && (
          <ul
            className="ant-menu ant-menu-sub ant-menu-vertical custom-menu-popup"
            role="menu"
            style={{
              position: "fixed",
              left: 80,
              top: popupTop,
              zIndex: 1050,
            }}
          >
            {renderItems(item.children, selectedKeys, false)}
          </ul>
        )}
      </li>
    );
  }

  // Expanded mode: instant show/hide via display.
  // No CSS transition -- any transition on max-height or display is unreliable
  // in React 18 concurrent mode because isNavigatingRef can be cleared mid-render,
  // allowing animation to fire during programmatic navigation re-renders.
  return (
    <li className={submenuClasses} role="none">
      <div
        className="ant-menu-submenu-title"
        onClick={() => onToggle(item.key)}
        aria-expanded={isOpen}
        style={{ paddingLeft: 24 }}
      >
        <span className="ant-menu-item-icon">
          <SVGIcon
            name={item?.icon}
            width={20}
            style={{ marginRight: "12px" }}
            className="sidebar-icon"
          />
        </span>
        <span className="ant-menu-title-content">
          <span>{item.name}</span>
        </span>
        <i
          className="ant-menu-submenu-arrow"
          style={{
            transform: isOpen ? "rotate(-180deg) translateY(2px)" : "none",
          }}
        />
      </div>
      <ul
        className="ant-menu ant-menu-sub ant-menu-inline"
        role="menu"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {renderItems(item.children, selectedKeys, false)}
      </ul>
    </li>
  );
};

const SideMenu = ({ isCollapsed }) => {
  const location = useLocation();
  // openMenuKeys: which SubMenus are expanded
  const [openMenuKeys, setOpenMenuKeys] = useState([]);
  // urlLeafKeys: which leaf items match the current URL
  const [urlLeafKeys, setUrlLeafKeys] = useState([]);
  // temporaryKeys: fallback when on a form/detail page with no direct menu match
  const [temporaryKeys, setTemporaryKeys] = useState([]);
  // hoveredSubmenu: key of submenu being hovered in collapsed mode (drives popup visibility)
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const getLocation = location.pathname;
  // Select ONLY side_bar -- not the entire auth slice.
  // checkGrantedAccess modifies auth.loading, auth.user, auth.data_switch on every navigation.
  // Selecting the whole slice caused 2-4 spurious re-renders per click.
  const side_bar = useSelector((state) => state?.auth?.side_bar);

  const datas = useMemo(() => {
    try {
      return JSON.parse(side_bar) || [];
    } catch {
      return [];
    }
  }, [side_bar]);

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
      const extractingKeys = extractPaths(parentKey)?.map(
        (item) => item?.key
      );
      setTemporaryKeys(extractingKeys);
    }

    const allActiveItems = extractPaths(activeKeys);

    // Leaf keys: actual selectable items (no children) -- drives selectedKeys
    const leafKeys = allActiveItems
      .filter((item) => !item.children || item.children.length === 0)
      .map((item) => item.key);

    // Parent keys: submenus that must be open to show the current page
    const requiredParentKeys = allActiveItems
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.key);

    setUrlLeafKeys(leafKeys);

    // Only MERGE required parent keys -- never replace the full openMenuKeys.
    // This preserves any other submenus the user manually opened.
    if (requiredParentKeys.length > 0) {
      setOpenMenuKeys((prev) => {
        const merged = new Set([...(prev || []), ...requiredParentKeys]);
        const newKeys = Array.from(merged);
        if (
          prev &&
          prev.length === newKeys.length &&
          newKeys.every((k) => prev.includes(k))
        ) {
          return prev;
        }
        return newKeys;
      });
    }
  }, [getLocation]);

  // remove menu from whitelist -- non-mutating: returns new objects, never modifies datas
  function removeProfileItems(tree) {
    if (!Array.isArray(tree)) return tree;
    return tree
      .map((item) => {
        if (whitelistMenu.includes(item.name)) return null;
        if (item.children) {
          return { ...item, children: removeProfileItems(item.children) };
        }
        return item;
      })
      .filter(Boolean);
  }

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
    } else if (
      data?.path?.includes("http://10.129.2.39:8080/ords/f?p=113")
    ) {
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

  const toggleSubmenu = useCallback((key) => {
    setOpenMenuKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  // Fallback: when both openMenuKeys and urlLeafKeys are empty (form/detail pages),
  // use temporaryKeys as the effective open keys so the parent submenu auto-expands.
  const effectiveOpenKeys =
    openMenuKeys?.length === 0 && urlLeafKeys?.length === 0
      ? temporaryKeys
      : openMenuKeys;

  const selectedKeys =
    urlLeafKeys?.length === 0 ? temporaryKeys : urlLeafKeys;

  const menuData = useMemo(
    () => mappingMenu(removeProfileItems(datas)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datas]
  );

  const renderItems = useCallback(
    (items, selKeys, isTopLevel) => {
      return items.map((item) => {
        if (item.children) {
          const hasSelectedChild = selKeys.some((sk) =>
            extractPaths([item]).some(
              (child) =>
                child.key === sk &&
                (!child.children || child.children.length === 0)
            )
          );
          const isOpen = effectiveOpenKeys.includes(item.key);

          return (
            <SubMenuItem
              key={item.key}
              item={item}
              isOpen={isOpen}
              isSelected={hasSelectedChild}
              isCollapsed={isCollapsed}
              hoveredKey={hoveredSubmenu}
              onToggle={toggleSubmenu}
              onHover={setHoveredSubmenu}
              onLeave={() => setHoveredSubmenu(null)}
              selectedKeys={selKeys}
              renderItems={renderItems}
            />
          );
        }

        const isSelected = selKeys.includes(item.key);
        return (
          <li
            key={item.key}
            className={`ant-menu-item${
              isSelected ? " ant-menu-item-selected" : ""
            }`}
            role="menuitem"
            style={{
              paddingLeft: isTopLevel ? (isCollapsed ? 0 : 24) : 48,
            }}
          >
            {item.icon && (
              <span className="ant-menu-item-icon">
                <SVGIcon
                  name={item.icon}
                  width={20}
                  style={{
                    marginRight: isCollapsed ? "80px" : "12px",
                    marginLeft: isCollapsed ? "-5px" : "",
                    marginTop: isCollapsed ? "10px" : "",
                  }}
                  className="sidebar-icon"
                />
              </span>
            )}
            <span className="ant-menu-title-content">
              {newTabCallback(item)}
            </span>
          </li>
        );
      });
    },
    [
      isCollapsed,
      effectiveOpenKeys,
      hoveredSubmenu,
      newTabCallback,
      extractPaths,
      toggleSubmenu,
    ]
  );

  const rootClasses = [
    "ant-menu",
    "ant-menu-light",
    "ant-menu-root",
    "ant-menu-inline",
    isCollapsed ? "ant-menu-inline-collapsed" : "",
    "mb-6",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ul className={rootClasses} role="menu">
      {renderItems(menuData, selectedKeys, true)}
    </ul>
  );
};

export default React.memo(SideMenu);
