import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  activeKey: controlledActiveKey, // Add controlled prop
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
  buttonStyle = 'solid', // 'solid' | 'outline'
  size = 'middle', // 'small' | 'middle' | 'large'
  
  // Styling
  tabBarStyle = {},
  disabled = false,
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || tabs[0]?.key);
  const [mountedTabs, setMountedTabs] = useState(new Set([defaultActiveKey || tabs[0]?.key]));
  const [tabAccessOrder, setTabAccessOrder] = useState([defaultActiveKey || tabs[0]?.key]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  const sliderRef = useRef(null);
  const unmountTimersRef = useRef({});

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
    if (!scrollable || !sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  }, [scrollable]);

  useEffect(() => {
    checkOverflow();
    
    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [checkOverflow, tabs]);

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
    activeKey,
    controlledActiveKey,
    disabled,
    tabs,
    onChange,
    mountedTabs,
    priorityTabs,
    strategy,
    config.useDelay,
    clearUnmountTimer,
    scheduleUnmount,
    enforceMountLimit,
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
            ...tabBarStyle,
            // Hide scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <style>
            {`
              .nx-tab-container {
                width: 100%;
              }
              
              .nx-tab-slider::-webkit-scrollbar {
                display: none;
              }
              
              .nx-tab-button {
                position: relative;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                background: #fff;
                color: rgba(0, 0, 0, 0.88);
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-weight: 400;
                box-shadow: 0 2px 0 rgba(0, 0, 0, 0.016);
                min-width: 185px;
              }
              
              /* Size variants */
              .nx-tab-button.small {
                padding: 0px 7px;
                height: 24px;
                font-size: 14px;
                line-height: 22px;
              }
              
              .nx-tab-button.middle {
                padding: 4px 15px;
                height: 32px;
                font-size: 14px;
                line-height: 30px;
              }
              
              .nx-tab-button.large {
                padding: 6px 15px;
                height: 40px;
                font-size: 16px;
                line-height: 38px;
              }
              
              .nx-tab-button:hover:not(:disabled):not(.active) {
                color: #0075bf;
                border-color: #0075bf;
              }
              
              /* Solid style active state */
              .nx-tab-button.solid.active {
                background: #0075bf;
                border-color: #0075bf;
                color: #fff;
                box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
              }
              
              /* Outline style active state */
              .nx-tab-button.outline.active {
                background: #fff;
                border-color: #0075bf;
                color: #0075bf;
              }
              
              .nx-tab-button:disabled {
                cursor: not-allowed;
                opacity: 0.4;
                background: #f5f5f5;
                border-color: #d9d9d9;
                color: rgba(0, 0, 0, 0.25);
                box-shadow: none;
              }
              
              .nx-tab-button:active:not(:disabled) {
                transform: translateY(1px);
              }
              
              .nx-tab-button .nx-tab-icon {
                display: inline-flex;
                align-items: center;
              }
              
              /* Icon size adjustments per button size */
              .nx-tab-button.small .nx-tab-icon {
                font-size: 12px;
              }
              
              .nx-tab-button.middle .nx-tab-icon {
                font-size: 14px;
              }
              
              .nx-tab-button.large .nx-tab-icon {
                font-size: 16px;
              }
              
              /* Badge positioning for NxTab */
              .ant-badge {
                display: inline-flex;
              }
              
              .ant-badge .ant-badge-count {
                box-shadow: 0 0 0 1px #fff;
              }
            `}
          </style>
          
          {tabs.map(tab => {
            const isActive = tab.key === activeKey;
            const isDisabled = disabled || tab.disabled;
            
            const button = (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                disabled={isDisabled}
                className={`nx-tab-button ${size} ${buttonStyle} ${isActive ? 'active' : ''}`}
              >
                {tab.icon && <span className="nx-tab-icon">{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
            
            // Wrap with Badge if errorBadge is defined
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
              className={animated ? 'nx-tab-pane' : ''}
              style={{
                display: isActive ? 'block' : 'none',
                opacity: isActive ? 1 : 0,
                transition: animated ? 'opacity 0.2s ease-in-out' : 'none',
              }}
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
