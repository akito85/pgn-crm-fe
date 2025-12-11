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
  const [submitterData, setSubmitterData] = useState(null);
  const [approverStatus, setApproverStatus] = useState("WAITING");
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    // ✅ Check if modal is open and data exists (not empty object)
    const hasValidData = dataApprover && 
                        dataHistory && 
                        Object.keys(dataApprover).length > 0 && 
                        Object.keys(dataHistory).length > 0;
    
    if (isOpen && hasValidData) {
      const useTabs = tabOptions && (tabOptions?.length > 0 || false);
      let historyData = [];
      let approverData = [];

      if (useTabs) {
        const tempTab = tabOptions[0].value.toLowerCase();
        setTabActive(tabOptions[0].value);
        
        // ✅ Enhanced validation
        if (Array.isArray(dataApprover)) {
          approverData = dataApprover;
        } else if (dataApprover && typeof dataApprover === 'object') {
          const tabData = dataApprover[tempTab];
          approverData = Array.isArray(tabData) ? tabData : [];
        } else {
          approverData = [];
        }
        
        if (Array.isArray(dataHistory)) {
          historyData = dataHistory;
        } else if (dataHistory && typeof dataHistory === 'object') {
          const tabData = dataHistory[tempTab];
          historyData = Array.isArray(tabData) ? tabData : [];
        } else {
          historyData = [];
        }
      } else {
        approverData = Array.isArray(dataApprover) ? dataApprover : [];
        historyData = Array.isArray(dataHistory) ? dataHistory : [];
      }
      
      const submitData = Array.isArray(historyData) 
        ? historyData.find(h => h && h.status === "SUBMIT")
        : null;
      setSubmitterData(submitData);

      setDataApproverFinal(approverData);
      
      const hasWaiting = Array.isArray(approverData) && approverData.some(a => a && (a.status === null || a.status === undefined));
      const hasReject = Array.isArray(approverData) && approverData.some(a => a && a.status === "REJECT");
      
      if (hasReject) {
        setApproverStatus("REJECTED");
      } else if (hasWaiting) {
        setApproverStatus("WAITING");
      } else {
        setApproverStatus("APPROVED");
      }

      setActiveKeys(["0"]);
    } else {
      // ✅ Reset all states when no data
      setDataApproverFinal([]);
      setSubmitterData(null);
      setApproverStatus("WAITING");
      setActiveKeys([]);
      setTabActive("");
    }
  }, [isOpen, tabOptions, dataApprover, dataHistory]);

  const handleTabs = (e) => {
    const value = e.target.value;
    const tempTab = value.toLowerCase();
    setTabActive(value);
    
    // ✅ Enhanced validation
    let approverData = [];
    let historyData = [];
    
    if (Array.isArray(dataApprover)) {
      approverData = dataApprover;
    } else if (dataApprover && typeof dataApprover === 'object') {
      const tabData = dataApprover[tempTab];
      approverData = Array.isArray(tabData) ? tabData : [];
    }
    
    if (Array.isArray(dataHistory)) {
      historyData = dataHistory;
    } else if (dataHistory && typeof dataHistory === 'object') {
      const tabData = dataHistory[tempTab];
      historyData = Array.isArray(tabData) ? tabData : [];
    }
    
    const submitData = Array.isArray(historyData)
      ? historyData.find(h => h && h.status === "SUBMIT")
      : null;
    setSubmitterData(submitData);

    setDataApproverFinal(approverData);
    
    const hasWaiting = Array.isArray(approverData) && approverData.some(a => a && (a.status === null || a.status === undefined));
    const hasReject = Array.isArray(approverData) && approverData.some(a => a && a.status === "REJECT");
    
    if (hasReject) {
      setApproverStatus("REJECTED");
    } else if (hasWaiting) {
      setApproverStatus("WAITING");
    } else {
      setApproverStatus("APPROVED");
    }

    setActiveKeys(["0"]);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return moment(date).format(dateFormatting.dateTime);
  };

  const renderApproverTable = () => {
    // ✅ Stricter validation
    if (!dataApproverFinal || !Array.isArray(dataApproverFinal) || dataApproverFinal.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No approver data available
        </div>
      );
    }

    // ✅ Filter out SUBMIT status (already shown in submitter card)
    const approversWithoutSubmit = dataApproverFinal.filter(
      approver => approver.status !== "SUBMIT"
    );

    // ✅ Check if there are any approvers after filtering
    if (approversWithoutSubmit.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No approver data available
        </div>
      );
    }

    const getStatusBadge = (status) => {
      if (status === "APPROVE") {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircleFilled style={{ fontSize: 12 }} />
            Approved
          </span>
        );
      }
      if (status === "REJECT") {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <CloseCircleFilled style={{ fontSize: 12 }} />
            Rejected
          </span>
        );
      }
      if (status === "SUBMIT") {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircleFilled style={{ fontSize: 12 }} />
            Submitted
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
          <ClockCircleOutlined style={{ fontSize: 12 }} />
          Waiting
        </span>
      );
    };

    // ✅ Add safety check and ensure we're working with arrays
    // Filter out SUBMIT status from enrichment
    const enrichedApprovers = approversWithoutSubmit.map((approver, idx) => {
      let historyMatch = null;
      
      // ✅ Fix: Get correct history data based on tab with strict validation
      let historyData = [];
      
      if (tabActive && dataHistory && typeof dataHistory === 'object') {
        const tempTab = tabActive.toLowerCase();
        const tabData = dataHistory[tempTab];
        historyData = Array.isArray(tabData) ? tabData : [];
      } else if (Array.isArray(dataHistory)) {
        historyData = dataHistory;
      }
      
      // Find matching history only if we have valid history data
      if (Array.isArray(historyData) && historyData.length > 0) {
        historyMatch = historyData.find(
          h => h && h.name === approver.name && h.status === approver.status
        );
      }

      return {
        ...approver,
        taskDate: historyMatch?.taskDate || submitterData?.taskDate || null,
        actionDate: historyMatch?.actionDate || null,
        hierarchy: historyMatch?.hierarchy || "-",
      };
    });

    return (
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  NO
                </th>
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  TASK SUBMITTED DATE
                </th>
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  ACTION DATE
                </th>
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  HIERARCHY
                </th>
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  ACTION BY
                </th>
                <th className="py-2 px-3 text-left font-semibold border-r border-blue-500">
                  POSITION
                </th>
                <th className="py-2 px-3 text-center font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {enrichedApprovers.map((approver, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-3 border-b border-r border-gray-200">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 border-b border-r border-gray-200">
                    {formatDate(approver.taskDate)}
                  </td>
                  <td className="py-2 px-3 border-b border-r border-gray-200">
                    {formatDate(approver.actionDate)}
                  </td>
                  <td className="py-2 px-3 border-b border-r border-gray-200">
                    {approver.hierarchy}
                  </td>
                  <td className="py-2 px-3 border-b border-r border-gray-200 font-medium">
                    {approver.name || "-"}
                  </td>
                  <td className="py-2 px-3 border-b border-r border-gray-200">
                    {approver.role || "-"}
                  </td>
                  <td className="py-2 px-3 border-b text-center">
                    {getStatusBadge(approver.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSubmitterPanel = () => {
    if (!submitterData) return null;

    return (
      <Panel
        header={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              <SVGIcon name="IconSubmitApprover" width={20} />
              <span
                className="font-semibold text-sm"
                style={{ color: "#0063A2" }}
              >
                SUBMITTER DATA
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: "#0063A2" }}>
              SUBMITTED
            </span>
          </div>
        }
        key="0"
        style={{
          marginBottom: 12,
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
        className="approval-history-panel"
      >
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Task Submitted Date</p>
              <p className="text-sm font-medium">
                {formatDate(submitterData.taskDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Action Date</p>
              <p className="text-sm font-medium">
                {formatDate(submitterData.actionDate)}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">DETAIL</p>

              <div className="space-y-2">
                <div className="flex">
                  <span className="text-xs text-gray-600 w-32">Hierarchy</span>
                  <span className="text-xs font-medium">
                    {submitterData.hierarchy || "-"}
                  </span>
                </div>

                <div className="flex">
                  <span className="text-xs text-gray-600 w-32">Action By</span>
                  <span className="text-xs font-medium">
                    {submitterData.name || "-"}
                  </span>
                </div>

                <div className="flex">
                  <span className="text-xs text-gray-600 w-32">Position</span>
                  <span className="text-xs font-medium">
                    {submitterData.role || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  };

  const renderApproverPanel = () => {
    // ✅ Check if there are approvers excluding SUBMIT status
    const approversWithoutSubmit = Array.isArray(dataApproverFinal) 
      ? dataApproverFinal.filter(a => a.status !== "SUBMIT")
      : [];

    // ✅ Don't render panel if no valid approvers
    if (approversWithoutSubmit.length === 0) {
      return null;
    }

    const getApproverIcon = () => {
      if (approverStatus === "APPROVED") {
        return <CheckCircleFilled style={{ color: "#52C41A", fontSize: 20 }} />;
      }
      if (approverStatus === "REJECTED") {
        return <CloseCircleFilled style={{ color: "#FF4D4F", fontSize: 20 }} />;
      }
      return <ClockCircleOutlined style={{ color: "#FAAD14", fontSize: 20 }} />;
    };

    const getApproverColor = () => {
      if (approverStatus === "APPROVED") return "#52C41A";
      if (approverStatus === "REJECTED") return "#FF4D4F";
      return "#FAAD14";
    };

    const getApproverText = () => {
      if (approverStatus === "APPROVED") return "APPROVED";
      if (approverStatus === "REJECTED") return "REJECTED";
      return "WAITING FOR APPROVAL";
    };

    return (
      <Panel
        header={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              {getApproverIcon()}
              <span
                className="font-semibold text-sm"
                style={{ color: getApproverColor() }}
              >
                APPROVER
              </span>
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: getApproverColor() }}
            >
              {getApproverText()}
            </span>
          </div>
        }
        key="1"
        style={{
          marginBottom: 12,
          border: "1px solid #d9d9d9",
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
        className="approval-history-panel"
      >
        {renderApproverTable()}
      </Panel>
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
          
          {/* Collapse Accordion - HANYA TAMPIL JIKA ADA DATA */}
          {submitterData || (dataApproverFinal && dataApproverFinal.filter(a => a.status !== "SUBMIT").length > 0) ? (
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
                {/* ACCORDION 1: SUBMITTER DATA - Only if exists */}
                {submitterData && renderSubmitterPanel()}
                
                {/* ACCORDION 2: APPROVER - Only if exists and has non-SUBMIT data */}
                {renderApproverPanel()}
              </Collapse>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-base">No approval history available</p>
            </div>
          )}
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
