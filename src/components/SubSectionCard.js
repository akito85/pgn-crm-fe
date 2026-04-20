import React from 'react';

const SubSectionCard = ({ title, children, className = "" }) => {
    return (
        <div 
            style={{
                border: "1px solid #C8CDD4",
                borderRadius: "8px",
                padding: "16px",
            }}
            className={className}
        >
            {title && (
                <div className="text-[#0075bf] text-base mb-4">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default SubSectionCard;
