import {
  CheckCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, List, Modal, Spin, Tooltip } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import SVGIcon from "../../assets/Icon/index";
import { dateFormatting } from "../../utils";
import moment from "moment";
import ButtonComponent from "../ButtonComponent";
import RadioTabs from "../RadioTabs";

const defaultValueHistory = [
  {
    type: "SUBMIT",
    icon: <SVGIcon name="IconSubmitApprover" width={24} />,
    textColor: "#0063A2",
    style: {
      backgroundColor: "#C2DEF0",
      lineHeight: "50px",
    },
  },
  {
    type: "APPROVE",
    icon: <CheckCircleFilled width={24} style={{ color: "#ACC424" }} />,
    textColor: "#92A71F",
    style: {
      backgroundColor: "#EBF1CA",
    },
  },
  {
    type: "REJECT",
    icon: <SVGIcon name="IconCross" width={24} style={{ color: "#FF0000" }} />,
    textColor: "#D90000",
    style: {
      backgroundColor: "#FFC2C2",
      lineHeight: "50px",
    },
  },
  {
    type: "Released",
    icon: <SVGIcon name="IconReleaseApprover" width={24} />,
    textColor: "#118B76",
    style: {
      backgroundColor: "rgba(17, 139, 118, 0.25)",
      lineHeight: "50px",
    },
  },
];

const styleBackgroundAvatar = (dataApprover) => {
  const match = defaultValueHistory.find((v) => dataApprover?.status?.includes(v.type));
  return match ? match.style : { backgroundColor: "#E0E0E0" };
};

const handleIconAvatar = (dataApprover) => {
  const match = defaultValueHistory.find((v) => dataApprover?.status?.includes(v.type));
  return match ? match.icon : undefined;
};

const handleTextColor = (dataHistory) => {
  const match = defaultValueHistory.find((v) => dataHistory?.status?.includes(v.type));
  return match ? match.textColor : "#4B465C";
};

// const tabOptions = ["Create", "Inactive"];

const ModalHistory = (props) => {
  const {
    isOpen,
    handleClose = () => { },
    header,
    cancelText = "Back",
    width = 900,
    tabOptions,
    dataApprover,
    dataHistory,
    loading = false,
  } = props;

  const [tabActive, setTabActive] = useState("");
  const [dataApproverFinal, setDataApproverFinal] = useState([]);
  const [dataHistoryFinal, setDataHistoryFinal] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    if (isOpen && dataApprover && dataHistory) {
      const useTabs = tabOptions && (tabOptions?.length > 0 || false);
      if (useTabs) {
        const tempTab = tabOptions[0].value.toLowerCase();
        setTabActive(tabOptions[0].value);
        setDataApproverFinal(dataApprover[tempTab]);
        setDataHistoryFinal(dataHistory[tempTab]);
      } else {
        setDataApproverFinal(dataApprover || []);
        setDataHistoryFinal(dataHistory || []);
      }
    } else {
      setDataApproverFinal([]);
      setDataHistoryFinal([]);
    }
  }, [isOpen, tabOptions, dataApprover, dataHistory]);

  const handleTabs = (e) => {
    const value = e.target.value;
    const tempTab = value.toLowerCase();
    setTabActive(value);
    setDataApproverFinal(dataApprover?.[tempTab] || []);
    setDataHistoryFinal(dataHistory?.[tempTab] || []);
  };

  const sliderLeft = () => {
    const slider = document.getElementById("sliderModalHistory");
    slider.scrollLeft = slider.scrollLeft - 250;
  };

  const sliderRight = () => {
    const slider = document.getElementById("sliderModalHistory");
    slider.scrollLeft = slider.scrollLeft + 250;
  };

  const toggleDescription = (itemId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      className={"modal-custom"}
      centered={true}
      width={width || 550}
      closable={false}
      footer={
        <div className="w-full flex justify-start">
          <ButtonComponent onClick={handleClose} type="default">
            {cancelText}
          </ButtonComponent>
        </div>
      }
    >
      <Fragment>
        {/* header section */}
        <div
          style={{ background: "#E6F1F9" }}
          className={"rounded-tl-[5px] rounded-tr-[5px] px-3 py-2"}
        >
          <div className={"flex gap-x-1 items-center"}>
            <span
              style={{
                color: "#4B465C",
                fontWeight: "600",
                fontSize: "14px",
                textTransform: "uppercase",
              }}
            >
              {header}
            </span>
          </div>
        </div>

        {/* content section */}
        <Spin spinning={loading}>
          <div className={"flex flex-col w-full gap-3 p-3"}>
            {tabOptions && tabOptions.length > 0 ? (
              <RadioTabs data={tabOptions} onChange={handleTabs} currentPosition={tabActive} />
            ) : null}
            <div className="relative flex justify-center items-center gap-2">
              {dataApproverFinal.length > 0 ? (
                <LeftCircleFilled width={32} onClick={sliderLeft} />
              ) : null}
              <div
                id="sliderModalHistory"
                className={`flex gap-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar`}
              >
                {dataApproverFinal.map((approver, index) => (
                  <div
                    className="flex flex-row items-center gap-1.5 flex-shrink-0"
                    key={`Approver ${index + 1}`}
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-md"
                      style={{ border: "1px solid #d1d5db", minWidth: 150, maxWidth: 180 }}
                    >
                      <Avatar
                        shape="square"
                        size={36}
                        className="flex-shrink-0"
                        icon={handleIconAvatar(approver)}
                        style={styleBackgroundAvatar(approver)}
                      />
                      <div className="flex flex-col min-w-0">
                        <Tooltip title={approver?.name}>
                          <p className="text-xs font-medium m-0 truncate">
                            {approver?.name || "-"}
                          </p>
                        </Tooltip>
                        <p className="text-[10px] text-gray-400 m-0 truncate">{approver?.role}</p>
                      </div>
                    </div>
                    {index !== dataApproverFinal.length - 1 ? (
                      <RightOutlined className="text-gray-400 text-xs flex-shrink-0" />
                    ) : null}
                  </div>
                ))}
              </div>

              {dataApproverFinal.length > 0 ? (
                <RightCircleFilled width={32} onClick={sliderRight} />
              ) : null}
            </div>
            <Divider style={{ margin: 0 }} />
            <div className="flex flex-col mb-2">
              <List
                dataSource={dataHistoryFinal}
                renderItem={(item, idx) => (
                  <List.Item
                    key={item.id}
                    style={{ padding: 0, borderBottom: idx < dataHistoryFinal.length - 1 ? "1px solid #f0f0f0" : "none" }}
                  >
                    <div className="w-full px-2 py-4">
                      {/* Top row: status | task date | action date */}
                      <div className="flex items-start justify-between mb-2">
                        <p
                          className="text-xs font-bold m-0"
                          style={{ color: handleTextColor(item) }}
                        >
                          {item.status}
                        </p>
                        <div className="flex items-center gap-8">
                          <p className="text-[11px] text-gray-500 m-0">
                            {`Task : ${item.taskDate ? moment(item.taskDate).format(dateFormatting.dateTime) : "-"}`}
                          </p>
                          <p className="text-[11px] text-gray-500 m-0">
                            {`Action : ${item.actionDate ? moment(item.actionDate).format(dateFormatting.dateTime) : "-"}`}
                          </p>
                        </div>
                      </div>
                      {/* Bottom row: hierarchy/action by/position | description */}
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] text-gray-500 m-0">{`Hierarchy : ${item.hierarchy || "-"}`}</p>
                          <p className="text-[11px] text-gray-500 m-0">{`Action by : ${item.name || "-"}`}</p>
                          <p className="text-[11px] text-gray-500 m-0">{`Position : ${item.role || "-"}`}</p>
                        </div>
                        {item.description ? (
                          <p
                            className={`text-[11px] m-0 font-semibold cursor-pointer text-right max-w-[220px] break-words ${expandedDescriptions[item.id]
                              ? ""
                              : "overflow-hidden whitespace-nowrap text-ellipsis"
                            }`}
                            onClick={() => toggleDescription(item.id)}
                          >
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Spin>
      </Fragment>
    </Modal>
  );
};

export default ModalHistory;
