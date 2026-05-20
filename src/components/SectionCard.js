import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;


const SectionCard = ({ title, children, defaultActiveKey = ['1'] }) => {
  return (
    <div className="bg-white rounded-md border-[#d9d9d9] border-[1px] mb-4">
      <style>
        {`
          .section-card-ghost .ant-collapse-header {
            padding-bottom: 8px !important;
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
          .section-card-ghost .ant-collapse-content-box {
            padding: 0 !important;
            border: none !important;
          }
          .section-card-ghost.ant-collapse {
            border: none !important;
          }
          .section-card-ghost .ant-collapse-header .ant-collapse-header-text {
            color: #0075bf !important;
            font-size: 16px !important;
            font-weight: 400 !important;
            text-transform: uppercase !important;
          }
        `}
      </style>
      <Collapse 
        defaultActiveKey={defaultActiveKey}
        expandIconPosition="end" 
        ghost
        className="section-card-ghost"
      >
        <Panel 
          header={title} 
          key="1" 
        >
          <div className="bg-white p-4 pt-4">
            {children}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default SectionCard;
