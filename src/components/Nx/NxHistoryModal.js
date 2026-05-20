import {
  CheckCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, List, Tooltip } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import SVGIcon from "../../assets/Icon/index";
import { dateFormatting } from "../../utils";
import moment from "moment";
import ButtonComponent from "../ButtonComponent";
import NxModal from "./NxModal";
import NxTabs from "./NxTabs";
import NxBaseContainer from "./NxBaseContainer";

const defaultValueHistory = [
  {
    type: "SUBMIT",
    icon: <SVGIcon name="IconSubmitApprover" width={18} />,
    textColor: "#0075BF",
    style: {
      backgroundColor: "#E6F0F4",
      lineHeight: "50px",
    },
  },
  {
    type: "APPROVE",
    icon: <SVGIcon name="IconSquareCheck" width={18} color="#388E3C" />,
    textColor: "#388E3C",
    style: {
      backgroundColor: "#E8F5E9",
    },
  },
  {
    type: "REJECT",
    icon: <SVGIcon name="IconSquareX" width={18} color="#D32F2F" />,
    textColor: "#D32F2F",
    style: {
      backgroundColor: "#FFEBEE",
      lineHeight: "50px",
    },
  },
  {
    type: "Released",
    icon: <SVGIcon name="IconReleaseApprover" width={18} />,
    textColor: "#118B76",
    style: {
      backgroundColor: "rgba(17, 139, 118, 0.25)",
      lineHeight: "50px",
    },
  },
];

const getHistoryConfig = (status) =>
  defaultValueHistory.find((h) => status?.includes(h.type)) ?? {};

const NxHistoryModal = ({
  isOpen,
  handleClose = () => {},
  header,
  dataApprover,
  dataHistory,
}) => {
  const [tabActiveOverride, setTabActiveOverride] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setTabActiveOverride(null);
      setExpandedDescriptions({});
    }
  }, [isOpen]);

  const { tabOptions, tabActive, dataApproverFinal, dataHistoryFinal } =
    useMemo(() => {
      const empty = {
        tabOptions: [],
        tabActive: "",
        dataApproverFinal: [],
        dataHistoryFinal: [],
      };

      if (
        !isOpen ||
        !dataApprover ||
        typeof dataApprover !== "object" ||
        Array.isArray(dataApprover)
      ) {
        return empty;
      }

      const keys = Object.keys(dataApprover);
      if (keys.length === 0) return empty;

      const options = keys.map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      }));

      const effectiveKey =
        tabActiveOverride && dataApprover[tabActiveOverride] !== undefined
          ? tabActiveOverride
          : keys[0];

      return {
        tabOptions: options,
        tabActive: effectiveKey,
        dataApproverFinal: dataApprover[effectiveKey] ?? [],
        dataHistoryFinal: dataHistory?.[effectiveKey] ?? [],
      };
    }, [isOpen, dataApprover, dataHistory, tabActiveOverride]);

  const handleTabs = (key) => setTabActiveOverride(key);

  const sliderLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollLeft -= 250;
  };

  const sliderRight = () => {
    if (sliderRef.current) sliderRef.current.scrollLeft += 250;
  };

  const toggleDescription = (itemId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <NxModal
      isOpen={isOpen}
      centered={true}
      width={900}
      closable={false}
      title={header}
      footer={
        <div className="flex justify-end">
          <Button onClick={handleClose} type="menu">
            Back
          </Button>
        </div>
      }
    >
      <>
        {/* content section */}
        <NxTabs
          items={tabOptions}
          activeKey={tabActive}
          onChange={handleTabs}
        />
        <div className={"flex flex-col w-full gap-4 p-4"}>
          <div className="relative flex justify-center items-center gap-2">
            {dataApproverFinal.length > 0 ? (
              <LeftCircleFilled width={32} onClick={sliderLeft} />
            ) : null}
            <div
              ref={sliderRef}
              className={`flex items-center gap-x-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar`}
            >
              {dataApproverFinal.map((approver, index) => (
                <>
                  <div
                    className="flex items-center gap-x-2 p-2 border border-solid border-[#C8CDD4] rounded-lg"
                    key={`Approver ${index + 1}`}
                  >
                    <div className="flex justify-center items-center w-10 h-10 rounded-sm" style={getHistoryConfig(approver?.status).style}>
                      {getHistoryConfig(approver?.status).icon}
                    </div>
                    <div className="flex flex-col gap-0.5 max-w-[180px]">
                      <p className="text-xs m-0 truncate">
                        {approver?.name || "-"}
                      </p>
                      <Tooltip title={approver?.role} className="cursor-pointer">
                        <p className="text-[10px] font-thin m-0 truncate">
                          {approver?.role}
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                  {index !== dataApproverFinal.length - 1 ? (
                      <div className="flex justify-center items-center w-6 h-4">
                        <RightOutlined className="text-xs" />
                      </div>
                    ) : null}
                </>
              ))}
            </div>

            {dataApproverFinal.length > 0 ? (
              <RightCircleFilled width={32} onClick={sliderRight} />
            ) : null}
          </div>
          <Divider style={{ margin: 0 }} />
          <NxBaseContainer border padding={false}>
            <List
              dataSource={dataHistoryFinal}
              renderItem={(item) => (
                <List.Item key={item.id} style={{ padding: "0" }}>
                  <div className="flex flex-col w-full p-4 gap-y-2 justify-between">
                    <div className="flex justify-between">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getHistoryConfig(item?.status).textColor ?? "white" }}
                      >
                        {item.status}
                      </span>
                      <div className="flex gap-x-10">
                        <span className="text-xs">
                          {`Task: ${
                            item.taskDate
                              ? moment(item.taskDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </span>
                        <span className="text-xs">
                          {`Action: ${
                            item.actionDate
                              ? moment(item.actionDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-10">
                      <div className="text-xs">
                        <div className="flex gap-x-2">
                          <span className="min-w-[95px] text-[#9E9E9E]">Hierarchy:</span>
                          <span>{item.hierarchy}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <span className="min-w-[95px] text-[#9E9E9E]">Action by:</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <span className="min-w-[95px] text-[#9E9E9E]">Position:</span>
                          <span>{item.role}</span>
                        </div>
                      </div>
                      {item.description && (
                        <p
                          className={`m-0 text-xs font-semibold cursor-pointer break-words text-right ${
                            expandedDescriptions[item.id]
                              ? ""
                              : "overflow-hidden whitespace-nowrap text-ellipsis"
                          }`}
                          onClick={() => toggleDescription(item.id)}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </NxBaseContainer>
        </div>
      </>
    </NxModal>
  );
};

export default NxHistoryModal;
