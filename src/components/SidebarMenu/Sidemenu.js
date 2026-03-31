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
  // Job Execution detail page — accessed via "View Details" action, not direct navigation
  "Detail Job Execution",
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <span
            className="ant-menu-item-icon"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <SVGIcon
              name={item?.icon}
              width={24}
              style={{ display: "block" }}
              className="sidebar-icon"
            />
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
              color: "rgba(0, 0, 0, 0.85)",
              backgroundColor: "#fff",
            }}
          >
            {renderItems(item.children, selectedKeys, false, false)}
          </ul>
        )}
      </li>
    );
  }

  // Expanded mode: smooth animation via max-height transitions.
  return (
    <li className={submenuClasses} role="none">
      <div
        className="ant-menu-submenu-title"
        onClick={() => onToggle(item.key)}
        aria-expanded={isOpen}
        style={{ paddingLeft: 24, display: "flex", alignItems: "center" }}
      >
        <span
          className="ant-menu-item-icon"
          style={{ display: "flex", alignItems: "center" }}
        >
          <SVGIcon
            name={item?.icon}
            width={20}
            style={{ marginRight: "12px", display: "block" }}
            className="sidebar-icon"
          />
        </span>
        <span className="ant-menu-title-content">
          <span>{item.name}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 10"
          width="10"
          height="10"
          style={{
            flexShrink: 0,
            marginLeft: "auto",
            display: "block",
            transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
            color: "rgba(0,0,0,0.45)",
          }}
        >
          <polyline
            points="1,3 5,7 9,3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <ul
          className="ant-menu ant-menu-sub ant-menu-inline"
          role="menu"
          style={{
            overflow: 'hidden',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderItems(item.children, selectedKeys, false)}
        </ul>
      </div>
    </li>
  );
};

const SideMenu = ({ isCollapsed }) => {
  const location = useLocation();
  // openMenuKeys: which SubMenus are expanded - now persisted across navigations
  const [openMenuKeys, setOpenMenuKeys] = useState(() => {
    // Try to restore from localStorage if available
    try {
      const saved = localStorage.getItem('sidebar_open_keys');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  // Update localStorage whenever openMenuKeys changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebar_open_keys', JSON.stringify(openMenuKeys));
    } catch (e) {
      console.warn('Could not save sidebar state to localStorage:', e);
    }
  }, [openMenuKeys]);

  useEffect(() => {
    // Only run if datas is valid
    if (!datas || !Array.isArray(datas)) {
      return;
    }

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

      // Merge fallback parent keys into openMenuKeys so they are never dropped
      // when openMenuKeys later becomes non-empty (the accordion / glitch root cause).
      const fallbackParentKeys = extractPaths(parentKey)
        ?.filter((item) => item.children && item.children.length > 0)
        ?.map((item) => item.key) || [];
      if (fallbackParentKeys.length > 0) {
        setOpenMenuKeys((prev) => {
          // Preserve all existing user-expanded keys and add required ones
          const newSet = new Set([...(prev || [])]);
          fallbackParentKeys.forEach(key => newSet.add(key));
          const newKeys = Array.from(newSet);

          // Only update if there are actual changes
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
    } else {
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
          // Preserve all existing user-expanded keys and add required ones
          const newSet = new Set([...(prev || [])]);
          requiredParentKeys.forEach(key => newSet.add(key));
          const newKeys = Array.from(newSet);

          // Only update if there are actual changes
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocation, datas]);

  // remove menu from whitelist -- non-mutating: returns new objects, never modifies datas.
  // If all children of a parent are filtered out, the parent is demoted to a leaf so it
  // continues to render with its icon and path (instead of becoming an empty, icon-less submenu).
  function removeProfileItems(tree) {
    if (!Array.isArray(tree)) return tree;
    return tree
      .map((item) => {
        if (whitelistMenu.includes(item.name)) return null;
        if (item.children) {
          const filteredChildren = removeProfileItems(item.children);
          if (filteredChildren.length === 0) {
            // Demote to leaf: drop the children array so renderItems treats it as a leaf item
            const { children, ...leafItem } = item;
            return leafItem;
          }
          return { ...item, children: filteredChildren };
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
    setOpenMenuKeys((prev) => {
      if (prev.includes(key)) {
        // Close the submenu
        return prev.filter((k) => k !== key);
      } else {
        // Open the submenu - add to the list
        return [...prev, key];
      }
    });
  }, []);

  // openMenuKeys is the single source of truth for which submenus are open.
  // Fallback parents (form/detail pages) are now merged into openMenuKeys directly
  // in the effect above, so there is no need to conditionally switch to temporaryKeys.
  // This eliminates the accordion effect and the open/close glitch on leaf navigation.
  const effectiveOpenKeys = openMenuKeys;

  const selectedKeys =
    urlLeafKeys?.length === 0 ? temporaryKeys : urlLeafKeys;

  const menuData = useMemo(
    () => mappingMenu(removeProfileItems(datas)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [datas]
  );

  const renderItems = useCallback(
    (items, selKeys, isTopLevel, inCollapsed = isCollapsed) => {
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
              isCollapsed={inCollapsed}
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
            style={
              inCollapsed
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }
                : { paddingLeft: isTopLevel ? 24 : 48 }
            }
          >
            {item.icon ? (
              <span
                className="ant-menu-item-icon"
                style={
                  inCollapsed
                    ? { display: "flex", alignItems: "center", justifyContent: "center" }
                    : { display: "flex", alignItems: "center" }
                }
              >
                <SVGIcon
                  name={item.icon}
                  width={inCollapsed ? 24 : 20}
                  style={inCollapsed ? { display: "block" } : { marginRight: "12px", display: "block" }}
                  className="sidebar-icon"
                />
              </span>
            ) : null}
            {!inCollapsed && (
              <span className="ant-menu-title-content">
                {newTabCallback(item)}
              </span>
            )}
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