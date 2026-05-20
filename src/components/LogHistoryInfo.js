import React from 'react';
import CardContainer from './CardContainer';


const LogHistoryInfo = ({ data }) => {
  const fields = [
    { label: 'Record ID', value: data?.recordId || '-' },
    { label: 'Created Date', value: data?.createdDate || '-' },
    { label: 'Created By', value: data?.createdBy || '-' },
    { label: 'Updated Date', value: data?.updatedDate || '-' },
    { label: 'Updated By', value: data?.updatedBy || '-' },
  ];

  return (
    <CardContainer
      header={
        <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">
            LOG HISTORY INFORMATION
            </p>
        </div>
      }
    >
      <div className="grid grid-cols-5 gap-4 p-4 bg-white border-[#d9d9d9] border-[1px] rounded-md mx-2 mb-2">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[14px] font-[600] text-[#000]">{field.label}</span>
            <span className="text-[14px] text-black font-[500]">{field.value}</span>
          </div>
        ))}
      </div>
    </CardContainer>
  );
};

export default LogHistoryInfo;
