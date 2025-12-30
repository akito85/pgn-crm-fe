'use client';

import { useState } from 'react';

export default function NxSwitch({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  activeColor,
  inactiveColor,
  label,
  labelPosition = 'right',
  className = '',
  id,
  name,
  ...props
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  
  // Determine if controlled or uncontrolled
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    
    onChange?.(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      track: 'h-4 w-7',
      thumb: 'size-3',
      thumbTranslate: 'translate-x-[12px]',
      padding: 'p-0.5',
    },
    md: {
      track: 'h-5 w-9',
      thumb: 'size-4',
      thumbTranslate: 'translate-x-[16px]',
      padding: 'p-0.5',
    },
    lg: {
      track: 'h-6 w-11',
      thumb: 'size-5',
      thumbTranslate: 'translate-x-[20px]',
      padding: 'p-0.5',
    },
  };

  const config = sizeConfig[size];

  // Dynamic background color
  const getBackgroundStyle = () => {
    if (isChecked) {
      if (activeColor) {
        // Check if it's a hex color or Tailwind class
        if (activeColor.startsWith('#') || activeColor.startsWith('rgb')) {
          return { backgroundColor: activeColor };
        }
        return {};
      }
      return {};
    } else {
      if (inactiveColor) {
        if (inactiveColor.startsWith('#') || inactiveColor.startsWith('rgb')) {
          return { backgroundColor: inactiveColor };
        }
        return {};
      }
      return {};
    }
  };

  const getBackgroundClass = () => {
    if (disabled) {
      return isChecked ? 'bg-[#0075bf]/50' : 'bg-[#4b465c]/20';
    }
    
    if (isChecked) {
      if (activeColor && !activeColor.startsWith('#') && !activeColor.startsWith('rgb')) {
        return activeColor;
      }
      return 'bg-[#0075bf]';
    } else {
      if (inactiveColor && !inactiveColor.startsWith('#') && !inactiveColor.startsWith('rgb')) {
        return inactiveColor;
      }
      return 'bg-[#4b465c]/30';
    }
  };

  const switchElement = (
    <div
      role="switch"
      aria-checked={isChecked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`
        ${config.track}
        ${config.padding}
        ${getBackgroundClass()}
        rounded-full
        inline-flex
        items-center
        overflow-hidden
        transition-colors
        duration-200
        ease-in-out
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#0075bf]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#2f3349]
      `}
      style={getBackgroundStyle()}
      {...props}
    >
      {/* Thumb */}
      <div
        className={`
          ${config.thumb}
          bg-white
          rounded-full
          shadow-sm
          transform
          transition-transform
          duration-200
          ease-in-out
          ${isChecked ? config.thumbTranslate : 'translate-x-0'}
        `}
      />
      
      {/* Hidden input for form compatibility */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={handleToggle}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );

  // If no label, return just the switch
  if (!label) {
    return (
      <div className={className}>
        {switchElement}
      </div>
    );
  }

  // With label
  return (
    <label
      className={`
        inline-flex
        items-center
        gap-2
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {labelPosition === 'left' && (
        <span className={`text-sm font-['Public_Sans'] ${disabled ? 'text-white/30' : 'text-white/70'}`}>
          {label}
        </span>
      )}
      
      {switchElement}
      
      {labelPosition === 'right' && (
        <span className={`text-sm font-['Public_Sans'] ${disabled ? 'text-white/30' : 'text-white/70'}`}>
          {label}
        </span>
      )}
    </label>
  );
}

/**
 * NxSwitchGroup - A group of switches with a common label
 */
export function NxSwitchGroup({ label, children, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="text-sm font-medium font-['Public_Sans'] text-white/70">
          {label}
        </div>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
