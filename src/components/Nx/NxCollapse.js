import { useState } from "react";

const NxCollapse = ({
  title,
  defaultOpen,
  children
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full rounded-lg border border-neutral-300 overflow-hidden">
      {/* Header */}
      <div 
        className="w-full border-solid rounded-tl-lg rounded-tr-lg p-5 bg-sky-100 border-neutral-300 flex justify-between items-center cursor-pointer hover:bg-sky-200 transition-colors"
        onClick={toggleCollapse}
      >
        <span className="text-neutral-800 text-base font-thin leading-7">
          {title}
        </span>
        <div className="size-6 flex items-center justify-center">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`}
          >
            <path 
              d="M6 15L12 9L18 15" 
              stroke="#232323" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-5 border-solid rounded-bl-lg rounded-br-lg border-neutral-300 mt-[-1px]">
          {children}
        </div>
      )}
    </div>
  )
}

export default NxCollapse;
