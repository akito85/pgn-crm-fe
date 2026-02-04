import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ChevronIcon = ({ color = 'currentColor', isOpen = false }) => (
  <svg 
    width="12" 
    height="12"
    fill="none" 
    viewBox="0 0 12 12"
    style={{ 
      display: 'block',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s'
    }}
  >
    <path 
      d="M2 4l4 4 4-4" 
      stroke={color}
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const CustomSelect = ({ 
  placeholder = 'Select option',
  options = [],
  value,
  onChange,
  disabled = false,
  allowClear = false,
  showSearch = false,
  style = {},
  dropdownStyle = {},
  className = '',
  borderRadius = '0',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Find the selected option
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || '';

  const filteredOptions = showSearch && searchValue
    ? options.filter(opt => 
        opt.label?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  // Debug logging
  useEffect(() => {
    console.log('CustomSelect render:', { value, selectedOption, displayText, options });
  }, [value, selectedOption, displayText, options]);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchValue('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      // console.log('Toggle clicked, current isOpen:', isOpen);
      // console.log('Options:', options);
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchValue('');
      }
    }
  };

  const handleOptionClick = (optionValue) => {
    // console.log('Option clicked:', optionValue);
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchValue('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange(undefined);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div 
      ref={selectRef}
      className={`custom-select ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {/* Select Input */}
      <div
        onClick={handleToggle}
        style={{
          height: '100%',
          padding: '4px 11px',
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
          borderRadius: borderRadius,
          userSelect: 'none',
        }}
      >
        {showSearch && isOpen ? (
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontFamily: "'Public Sans', sans-serif",
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.85)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            style={{
              flex: 1,
              fontSize: '14px',
              fontFamily: "'Public Sans', sans-serif",
              color: displayText ? 'rgba(0, 0, 0, 0.85)' : '#bfbfbf',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayText || placeholder}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
          {allowClear && value && !disabled && (
            <span
              onClick={handleClear}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#8c8c8c',
              }}
            >
              ✕
            </span>
          )}
          <ChevronIcon color="#8c8c8c" isOpen={isOpen} />
        </div>
      </div>

      {/* Dropdown - Rendered via Portal */}
      {isOpen && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
            zIndex: 2,
            maxHeight: '256px',
            overflowY: 'auto',
            padding: '4px 0',
            fontFamily: "'Public Sans', sans-serif",
            animation: 'slideUpIn 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            transformOrigin: 'top',
            ...dropdownStyle,
          }}
        >
          <style>
            {`
              @keyframes slideUpIn {
                0% {
                  opacity: 0;
                  transform: translateY(-12px) scaleY(0.8);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scaleY(1);
                }
              }
            `}
          </style>
          {filteredOptions.length === 0 ? (
            <div
              style={{
                padding: '5px 12px',
                fontSize: '14px',
                color: '#bfbfbf',
              }}
            >
              No data
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
                style={{
                  padding: '5px 12px',
                  fontSize: '14px',
                  lineHeight: '22px',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  color: option.disabled ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.85)',
                  backgroundColor: 
                    option.value === value 
                      ? '#e6f7ff' 
                      : 'transparent',
                  fontWeight: option.value === value ? 600 : 400,
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!option.disabled && option.value !== value) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!option.disabled && option.value !== value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

const NxDualSelect = ({ 
  leftProps = {}, 
  rightProps = {},
  className = '',
  leftWidth = '60%',
  rightWidth = '40%',
  height = '32px',
  borderRadius = '6px',
  value, // From Ant Design Form.Item
  onChange, // From Ant Design Form.Item
}) => {
  // Calculate the right border radius for the right select
  const rightBorderRadius = `0 ${borderRadius} ${borderRadius} 0`;
  
  // Parse the combined value from Form.Item
  // Expected format: { left: 'value1', right: 'value2' }
  const leftValue = value?.left;
  const rightValue = value?.right;

  // Handle left select change
  const handleLeftChange = (newLeftValue) => {
    const newValue = {
      left: newLeftValue,
      right: rightValue,
    };
    console.log('Left changed, new combined value:', newValue);
    if (onChange) {
      onChange(newValue);
    }
    // Also call the original leftProps.onChange if provided
    if (leftProps.onChange) {
      leftProps.onChange(newLeftValue);
    }
  };

  // Handle right select change
  const handleRightChange = (newRightValue) => {
    const newValue = {
      left: leftValue,
      right: newRightValue,
    };
    console.log('Right changed, new combined value:', newValue);
    if (onChange) {
      onChange(newValue);
    }
    // Also call the original rightProps.onChange if provided
    if (rightProps.onChange) {
      rightProps.onChange(newRightValue);
    }
  };
  
  return (
    <div 
      className={`dual-select-container ${className}`}
      style={{
        display: 'flex',
        height: height,
        border: '1px solid #d9d9d9',
        borderRadius: borderRadius,
        backgroundColor: '#ffffff',
        transition: 'border-color 0.3s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#40a9ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#d9d9d9';
      }}
    >
      {/* Left Select */}
      <div 
        style={{ 
          width: leftWidth,
          minWidth: 0,
          borderRight: '1px solid #d9d9d9',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          borderTopLeftRadius: borderRadius,
          borderBottomLeftRadius: borderRadius,
        }}
      >
        <CustomSelect
          borderRadius="0"
          style={{ height: '100%' }}
          {...leftProps}
          value={leftValue}
          onChange={handleLeftChange}
        />
      </div>

      {/* Right Select */}
      <div 
        style={{ 
          width: rightWidth,
          minWidth: 0,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          borderTopRightRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
      >
        <CustomSelect
          borderRadius={rightBorderRadius}
          style={{ height: '100%' }}
          {...rightProps}
          value={rightValue}
          onChange={handleRightChange}
        />
      </div>
    </div>
  );
};

export default NxDualSelect;
