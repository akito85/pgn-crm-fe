import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Badge } from 'antd';

/**
 * - LRU (Least Recently Used): Keep N most recent tabs mounted
 * - Priority: Always keep specified tabs mounted
 * - Lazy: Only mount active tab
 * - Aggressive: LRU + delayed unmounting
 */

const NxTab = ({
  tabs = [],
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  className = '',

  // Memory optimization configs
  maxMountedTabs = 3,
  priorityTabs = [],
  unmountDelay = 60000,
  strategy = 'lru',

  // UI configs
  scrollable = true,
  scrollStep = 250,
  animated = true,
  buttonStyle = 'solid',  // kept for backward compat
  variant,                // preferred: 'solid' | 'outlined' | 'underlined'
  size = 'middle',

  // Styling
  tabBarStyle = {},
  disabled = false,
}) => {
  // Resolve variant: explicit variant prop wins; otherwise derive from buttonStyle
  const resolvedVariant = variant ?? (buttonStyle === 'outline' ? 'outlined' : (buttonStyle ?? 'solid'));

  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || tabs[0]?.key);
  const [mountedTabs, setMountedTabs] = useState(new Set([defaultActiveKey || tabs[0]?.key]));
  const [tabAccessOrder, setTabAccessOrder] = useState([defaultActiveKey || tabs[0]?.key]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [animationClass, setAnimationClass] = useState('');

  const sliderRef = useRef(null);
  const unmountTimersRef = useRef({});
  const tabRefs = useRef({});
  const prevIndexRef = useRef(0);

  // Use controlled or uncontrolled value
  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey;

  // Strategy configurations
  const strategyConfig = {
    lru: { maxMounted: maxMountedTabs, useDelay: false },
    priority: { maxMounted: Infinity, useDelay: true },
    lazy: { maxMounted: 1, useDelay: false },
    aggressive: { maxMounted: maxMountedTabs, useDelay: true },
  };

  const config = strategyConfig[strategy];

  // Check if scrollable content overflows
  const checkOverflow = useCallback(() => {
    if (!sliderRef.current) return;

    if (scrollable) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }

    // Re-measure indicator position (handles window resize correctly)
    const activeTabEl = tabRefs.current[activeKey];
    const container = sliderRef.current;
    if (activeTabEl && container) {
      const tabRect = activeTabEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left + container.scrollLeft,
        width: tabRect.width,
      });
    }
  }, [scrollable, activeKey]);

  useEffect(() => {
    checkOverflow();

    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [checkOverflow, tabs]);

  // Measure the active tab's position to drive the indicator
  useLayoutEffect(() => {
    const activeTabEl = tabRefs.current[activeKey];
    const container = sliderRef.current;
    if (!activeTabEl || !container) return;

    const tabRect = activeTabEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setIndicatorStyle({
      left: tabRect.left - containerRect.left + container.scrollLeft,
      width: tabRect.width,
    });
  }, [activeKey, tabs]);

  // Clear animation class after keyframe completes (250ms animation + 50ms buffer)
  useEffect(() => {
    if (!animationClass) return;
    const timer = setTimeout(() => setAnimationClass(''), 300);
    return () => clearTimeout(timer);
  }, [animationClass]);

  // Clear unmount timer for a tab
  const clearUnmountTimer = useCallback((key) => {
    if (unmountTimersRef.current[key]) {
      clearTimeout(unmountTimersRef.current[key]);
      delete unmountTimersRef.current[key];
    }
  }, []);

  // Schedule tab unmounting after delay
  const scheduleUnmount = useCallback((key) => {
    if (!unmountDelay || priorityTabs.includes(key)) return;

    clearUnmountTimer(key);

    unmountTimersRef.current[key] = setTimeout(() => {
      setMountedTabs(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setTabAccessOrder(prev => prev.filter(k => k !== key));
    }, unmountDelay);
  }, [unmountDelay, priorityTabs, clearUnmountTimer]);

  // Enforce LRU cache limit
  const enforceMountLimit = useCallback((newKey) => {
    setMountedTabs(prev => {
      const mounted = Array.from(prev);
      const nonPriority = mounted.filter(k => !priorityTabs.includes(k));

      if (nonPriority.length >= config.maxMounted) {
        const lruTab = tabAccessOrder.find(
          k => nonPriority.includes(k) && k !== newKey
        );

        if (lruTab) {
          const next = new Set(prev);
          next.delete(lruTab);
          return next;
        }
      }

      return prev;
    });
  }, [priorityTabs, config.maxMounted, tabAccessOrder]);

  // Handle tab change with intelligent mounting/unmounting
  const handleTabChange = useCallback((key) => {
    if (key === activeKey || disabled) return;

    const tab = tabs.find(t => t.key === key);
    if (tab?.disabled) return;

    const previousKey = activeKey;

    // Track direction for content slide animation
    if (animated) {
      const newIdx = tabs.findIndex(t => t.key === key);
      const oldIdx = tabs.findIndex(t => t.key === activeKey);
      setAnimationClass(newIdx > oldIdx ? 'nx-slide-in-right' : 'nx-slide-in-left');
      prevIndexRef.current = newIdx;
    }

    // Update internal state only if uncontrolled
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key);
    }

    // Update LRU order
    setTabAccessOrder(prev => [key, ...prev.filter(k => k !== key)]);

    // Clear any scheduled unmount for the new active tab
    clearUnmountTimer(key);

    // Mount the new tab if not mounted
    if (!mountedTabs.has(key)) {
      setMountedTabs(prev => new Set([...prev, key]));
      enforceMountLimit(key);
    }

    // Handle previous tab based on strategy
    if (config.useDelay && !priorityTabs.includes(previousKey)) {
      scheduleUnmount(previousKey);
    } else if (strategy === 'lazy' && !priorityTabs.includes(previousKey)) {
      setMountedTabs(prev => {
        const next = new Set(prev);
        next.delete(previousKey);
        return next;
      });
    }

    onChange?.(key);
  }, [
    activeKey, controlledActiveKey, disabled, tabs, animated, onChange,
    mountedTabs, priorityTabs, strategy, config.useDelay,
    clearUnmountTimer, scheduleUnmount, enforceMountLimit,
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(unmountTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  // Scroll functions
  const scrollLeft = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      setTimeout(checkOverflow, 300);
    }
  }, [scrollStep, checkOverflow]);

  const scrollRight = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      setTimeout(checkOverflow, 300);
    }
  }, [scrollStep, checkOverflow]);

  const handleScroll = useCallback(() => {
    checkOverflow();
  }, [checkOverflow]);

  return (
    <div className={`nx-tab-container ${className}`} style={{ width: '100%' }}>
      <style>{`
            .nx-tab-container { width: 100%; }
            .nx-tab-slider::-webkit-scrollbar { display: none; }

            /* ── Common button base ── */
            .nx-tab-button {
              position: relative;
              cursor: pointer;
              transition: color 0.2s, border-color 0.2s;
              white-space: nowrap;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              font-weight: 400;
              z-index: 1;
              background: transparent;
            }
            .nx-tab-button.small  { padding: 0px 7px;  height: 24px; font-size: 14px; }
            .nx-tab-button.middle { padding: 4px 15px; height: 32px; font-size: 14px; }
            .nx-tab-button.large  { padding: 6px 15px; height: 40px; font-size: 16px; }

            /* ── Solid & Outlined ── */
            .nx-tab-button.solid,
            .nx-tab-button.outlined {
              border: 1px solid #d9d9d9;
              border-radius: 6px;
              color: rgba(0,0,0,0.88);
              box-shadow: 0 2px 0 rgba(0,0,0,0.016);
              min-width: 185px;
            }
            .nx-tab-button.solid:hover:not(:disabled):not(.active),
            .nx-tab-button.outlined:hover:not(:disabled):not(.active) {
              color: #0075bf; border-color: #0075bf;
            }
            .nx-tab-button.solid.active   { color: #fff;     border-color: #0075bf; }
            .nx-tab-button.outlined.active { color: #0075bf; border-color: #0075bf; }
            .nx-tab-button.solid:disabled,
            .nx-tab-button.outlined:disabled {
              cursor: not-allowed; opacity: 0.4;
              background: #f5f5f5; border-color: #d9d9d9;
              color: rgba(0,0,0,0.25); box-shadow: none;
            }
            .nx-tab-button:active:not(:disabled) { transform: translateY(1px); }

            /* ── Underlined ── */
            .nx-tab-button.underlined {
              border: none;
              color: rgba(0,0,0,0.88);
              padding-bottom: 10px;
              min-width: 0;
            }
            .nx-tab-button.underlined:hover:not(:disabled):not(.active) { color: #0075bf; }
            .nx-tab-button.underlined.active { color: #0075bf; font-weight: 500; }
            .nx-tab-button.underlined:disabled {
              cursor: not-allowed; opacity: 0.4; color: rgba(0,0,0,0.25);
            }

            /* ── Pill indicator (solid / outlined) ── */
            .nx-tab-pill {
              position: absolute;
              top: 50%; transform: translateY(-50%);
              height: calc(100% - 4px);
              border-radius: 6px;
              pointer-events: none;
              z-index: 0;
              transition: left 0.3s cubic-bezier(0.645,0.045,0.355,1),
                          width 0.3s cubic-bezier(0.645,0.045,0.355,1);
            }
            .nx-tab-pill.solid    { background: #0075bf; border: 1px solid #0075bf; }
            .nx-tab-pill.outlined { background: transparent; border: 1.5px solid #0075bf; }

            /* ── Ink bar (underlined) ── */
            .nx-tab-ink-bar {
              position: absolute; bottom: 0; height: 2px;
              background: #0075bf; border-radius: 1px;
              pointer-events: none;
              transition: left 0.3s cubic-bezier(0.645,0.045,0.355,1),
                          width 0.3s cubic-bezier(0.645,0.045,0.355,1);
            }

            /* ── Bottom border line for underlined tab bar ── */
            .nx-tab-bar-border {
              position: absolute; bottom: 0; left: 0; right: 0;
              height: 1px; background: #C8CDD4;
              pointer-events: none;
            }

            /* ── Content slide animations ── */
            @keyframes nx-slide-in-right {
              from { transform: translateX(24px); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
            @keyframes nx-slide-in-left {
              from { transform: translateX(-24px); opacity: 0; }
              to   { transform: translateX(0);     opacity: 1; }
            }
            .nx-slide-in-right { animation: nx-slide-in-right 0.25s ease-out; }
            .nx-slide-in-left  { animation: nx-slide-in-left  0.25s ease-out; }

            /* ── Badge positioning (scoped to tab bar) ── */
            .nx-tab-slider .ant-badge { display: inline-flex; }
            .nx-tab-slider .ant-badge .ant-badge-count { box-shadow: 0 0 0 1px #fff; }
          `}</style>
      {/* Tab Navigation */}
      <div className="nx-tab-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        {/* Left Arrow */}
        {scrollable && showLeftArrow && (
          <LeftCircleFilled
            style={{
              fontSize: 24,
              cursor: 'pointer',
              color: disabled ? '#d9d9d9' : '#1890ff',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
            onClick={disabled ? undefined : scrollLeft}
          />
        )}

        {/* Tab Buttons */}
        <div
          ref={sliderRef}
          className="nx-tab-slider py-1"
          onScroll={handleScroll}
          style={{
            display: 'flex',
            gap: 12,
            flex: 1,
            overflowX: scrollable ? 'auto' : 'visible',
            scrollBehavior: 'smooth',
            position: 'relative',
            ...tabBarStyle,
            // Hide scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Bottom border for underlined variant */}
          {resolvedVariant === 'underlined' && (
            <div className="nx-tab-bar-border" />
          )}

          {/* Sliding pill indicator for solid / outlined */}
          {(resolvedVariant === 'solid' || resolvedVariant === 'outlined') && indicatorStyle.width > 0 && (
            <div
              className={`nx-tab-pill ${resolvedVariant}`}
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          )}

          {/* Sliding ink bar for underlined */}
          {resolvedVariant === 'underlined' && indicatorStyle.width > 0 && (
            <div
              className="nx-tab-ink-bar"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          )}

          {tabs.map(tab => {
            const isActive = tab.key === activeKey;
            const isDisabled = disabled || tab.disabled;

            const button = (
              <button
                key={tab.key}
                ref={el => {
                  if (el) tabRefs.current[tab.key] = el;
                  else delete tabRefs.current[tab.key];
                }}
                onClick={() => handleTabChange(tab.key)}
                disabled={isDisabled}
                className={`nx-tab-button ${size} ${resolvedVariant} ${isActive ? 'active' : ''}`}
              >
                {tab.icon && <span className="nx-tab-icon">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );

            if (tab.errorBadge !== undefined) {
              return (
                <Badge key={tab.key} count={tab.errorBadge}>
                  {button}
                </Badge>
              );
            }

            return button;
          })}
        </div>

        {/* Right Arrow */}
        {scrollable && showRightArrow && (
          <RightCircleFilled
            style={{
              fontSize: 24,
              cursor: 'pointer',
              color: disabled ? '#d9d9d9' : '#1890ff',
              transition: 'all 0.3s',
            }}
            onClick={disabled ? undefined : scrollRight}
          />
        )}
      </div>

      {/* Tab Content */}
      <div
        className="nx-tab-content"
        style={{
          marginTop: 28,
          position: 'relative',
        }}
      >
        {tabs.map(tab => {
          const shouldRender = mountedTabs.has(tab.key);
          const isActive = tab.key === activeKey;

          if (!shouldRender) return null;

          return (
            <div
              key={tab.key}
              className={isActive && animated ? animationClass : ''}
              style={{ display: isActive ? 'block' : 'none' }}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NxTab;
