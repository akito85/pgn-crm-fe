import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Modal, Collapse } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import SVGIcon from "../../assets/Icon/index";
import { dateFormatting } from "../../utils";
import moment from "moment";
import ButtonComponent from "../ButtonComponent";
import RadioTabs from "../RadioTabs";

const { Panel } = Collapse;

const defaultValueHistory = [
  {
    type: "SUBMIT",
    icon: <SVGIcon name="IconSubmitApprover" width={20} />,
    textColor: "#0063A2",
    bgColor: "#E3F2FD",
    borderColor: "#0063A230",
    label: "SUBMITTER DATA",
  },
  {
    type: "APPROVE",
    icon: <CheckCircleFilled style={{ color: "#52C41A", fontSize: 20 }} />,
    textColor: "#52C41A",
    bgColor: "#F6FFED",
    borderColor: "#52C41A30",
    label: "APPROVER",
  },
  {
    type: "REJECT",
    icon: <CloseCircleFilled style={{ color: "#FF4D4F", fontSize: 20 }} />,
    textColor: "#FF4D4F",
    bgColor: "#FFF1F0",
    borderColor: "#FF4D4F30",
    label: "APPROVER",
  },
  {
    type: "Released",
    icon: <SVGIcon name="IconReleaseApprover" width={20} />,
    textColor: "#118B76",
    bgColor: "rgba(17, 139, 118, 0.15)",
    borderColor: "#118B7630",
    label: "RELEASED",
  },
  {
    type: "WAITING",
    icon: <ClockCircleOutlined style={{ color: "#FAAD14", fontSize: 20 }} />,
    textColor: "#FAAD14",
    bgColor: "#FFFBE6",
    borderColor: "#FAAD1430",
    label: "APPROVER",
  },
];

const getStatusConfig = (status) => {
  const statusUpper = status?.toUpperCase() || "";
  
  if (statusUpper.includes("SUBMIT")) {
    return defaultValueHistory.find((v) => v.type === "SUBMIT");
  }
  if (statusUpper.includes("APPROVE")) {
    return defaultValueHistory.find((v) => v.type === "APPROVE");
  }
  if (statusUpper.includes("REJECT")) {
    return defaultValueHistory.find((v) => v.type === "REJECT");
  }
  if (statusUpper.includes("RELEASE")) {
    return defaultValueHistory.find((v) => v.type === "Released");
  }
  if (statusUpper.includes("WAITING")) {
    return defaultValueHistory.find((v) => v.type === "WAITING");
  }
  
  return defaultValueHistory[0]; // default to SUBMIT
};

const ModalHistory = (props) => {
  const {
    isOpen,
    handleClose = () => {},
    header,
    width,
    tabOptions,
    dataApprover,
    dataHistory,
  } = props;

  const [tabActive, setTabActive] = useState("");
  const [dataApproverFinal, setDataApproverFinal] = useState([]);
  const [dataHistoryFinal, setDataHistoryFinal] = useState([]);
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    if (isOpen && dataApprover && dataHistory) {
      const useTabs = tabOptions && (tabOptions?.length > 0 || false);
      let historyData = [];
      
      if (useTabs) {
        const tempTab = tabOptions[0].value.toLowerCase();
        setTabActive(tabOptions[0].value);
        setDataApproverFinal(dataApprover[tempTab] || []);
        historyData = dataHistory[tempTab] || [];
      } else {
        setDataApproverFinal(dataApprover || []);
        historyData = dataHistory || [];
      }
      
      // Reverse the order - newest first
      setDataHistoryFinal([...historyData].reverse());
      
      // Auto expand first item (which is now the newest)
      if (historyData.length > 0) {
        setActiveKeys(['0']);
      }
    } else {
      setDataApproverFinal([]);
      setDataHistoryFinal([]);
      setActiveKeys([]);
    }
  }, [isOpen, tabOptions, dataApprover, dataHistory]);

  const handleTabs = (e) => {
    const value = e.target.value;
    const tempTab = value.toLowerCase();
    setTabActive(value);
    setDataApproverFinal(dataApprover[tempTab] || []);
    
    // Reverse the order when changing tabs
    const historyData = dataHistory[tempTab] || [];
    setDataHistoryFinal([...historyData].reverse());
    setActiveKeys(['0']); // Reset to first item when changing tabs
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return moment(date).format(dateFormatting.dateTime);
  };

  const formatStatusText = (status) => {
    if (!status) return "";
    
    // Mapping status text untuk display
    const statusMap = {
      "APPROVE": "APPROVED",
      "REJECT": "REJECTED",
      "SUBMIT": "SUBMITTED",
      "WAITING": "WAITING FOR APPROVAL",
      "Released": "RELEASED"
    };
    
    // Cek apakah status exact match dengan key
    if (statusMap[status]) {
      return statusMap[status];
    }
    
    // Cek apakah status mengandung key
    for (const key in statusMap) {
      if (status.toUpperCase().includes(key)) {
        return statusMap[key];
      }
    }
    
    return status; // Return original jika tidak ada mapping
  };

  const renderPanelHeader = (item) => {
    const config = getStatusConfig(item.status);

    return (
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex items-center gap-3">
          <span>{config.icon}</span>
          <span 
            className="font-semibold text-sm"
            style={{ color: config.textColor }}
          >
            {config.label}
          </span>
        </div>
        <span 
          className="text-xs font-medium"
          style={{ color: config.textColor }}
        >
          {formatStatusText(item.status)}
        </span>
      </div>
    );
  };

  const renderPanelContent = (item) => {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Task Submitted Date</p>
          <p className="text-sm font-medium">{formatDate(item.taskDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Action Date</p>
          <p className="text-sm font-medium">{formatDate(item.actionDate)}</p>
        </div>
        
        <div className="col-span-2">
          <p className="text-xs font-semibold text-gray-700 mb-2">DETAIL</p>
          
          <div className="space-y-2">
            {item.hierarchy && (
              <div className="flex">
                <span className="text-xs text-gray-600 w-32">Hierarchy</span>
                <span className="text-xs font-medium">{item.hierarchy}</span>
              </div>
            )}
            
            {item.name && (
              <div className="flex">
                <span className="text-xs text-gray-600 w-32">Action By</span>
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            )}
            
            {item.role && (
              <div className="flex">
                <span className="text-xs text-gray-600 w-32">Position</span>
                <span className="text-xs font-medium">{item.role}</span>
              </div>
            )}
          </div>
        </div>

        {item.description && item.status !== "SUBMIT" && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-gray-700 mb-1">MESSAGE</p>
            <p className="text-xs p-2">{item.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      className={"modal-custom"}
      centered={true}
      width={width || 700}
      maskClosable={false}
      footer={
        <div className="w-full flex justify-end gap-5">
          <ButtonComponent onClick={handleClose} type="default">
            Cancel
          </ButtonComponent>
        </div>
      }
    >
      <Fragment>
        {/* header section */}
        <div
          style={{ background: "#E6F1F9" }}
          className={"rounded-tl-[5px] rounded-tr-[5px] p-4"}
        >
          <div className={"flex gap-x-1.5 items-center"}>
            <span className="text-blue-500 font-semibold text-sm uppercase">
              {header}
            </span>
          </div>
        </div>

        {/* content section */}
        <div className={"flex flex-col w-full gap-4 p-5"}>
          {tabOptions && tabOptions.length > 0 ? (
            <RadioTabs data={tabOptions} onChange={handleTabs} />
          ) : null}
          
          {/* Collapse Accordion */}
          <div className="space-y-3">
            <Collapse
              activeKey={activeKeys}
              onChange={setActiveKeys}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <DownOutlined 
                  rotate={isActive ? 180 : 0} 
                  style={{ fontSize: 12 }}
                />
              )}
              style={{
                backgroundColor: 'transparent',
                border: 'none'
              }}
            >
              {dataHistoryFinal.map((item, index) => (
                <Panel 
                  header={renderPanelHeader(item)} 
                  key={index.toString()}
                  style={{
                    marginBottom: 12,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    overflow: 'hidden',
                    backgroundColor: '#ffffff'
                  }}
                  className="approval-history-panel"
                >
                  {renderPanelContent(item)}
                </Panel>
              ))}
            </Collapse>

            {dataHistoryFinal.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No approval history available</p>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .approval-history-panel .ant-collapse-header {
            padding: 14px 16px !important;
            background-color: #ffffff !important;
          }
          
          .approval-history-panel .ant-collapse-content-box {
            padding: 0 !important;
          }

          .approval-history-panel .ant-collapse-content {
            border-top: 1px solid #d9d9d9;
            background-color: #ffffff !important;
          }
          
          .approval-history-panel.ant-collapse-item {
            background-color: #ffffff !important;
          }
        `}</style>
      </Fragment>
    </Modal>
  );
};

export default ModalHistory;