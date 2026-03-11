import {
  CheckCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, List, Modal, Tooltip } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import SVGIcon from "../../assets/Icon/index";
import { dateFormatting } from "../../utils";
import moment from "moment";
import ButtonComponent from "../ButtonComponent";
import RadioTabs from "../RadioTabs";
import NxModal from "./NxModal";
import NxTabs from "./NxTabs";

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
  const dataBackground = defaultValueHistory.filter((valueHistory) =>
    dataApprover?.status?.includes(valueHistory.type)
  );
  return dataBackground.length > 0 ? dataBackground[0].style : undefined;
};

const handleIconAvatar = (dataApprover) => {
  const dataIcon = defaultValueHistory.filter((valueHistory) =>
    dataApprover?.status?.includes(valueHistory.type)
  );
  return dataIcon.length > 0 ? dataIcon[0].icon : undefined;
};

const handleTextColor = (dataHistory) => {
  const dataIcon = defaultValueHistory.filter((valueHistory) =>
    dataHistory?.status?.includes(valueHistory.type)
  );
  return dataIcon.length > 0 ? dataIcon[0].textColor : "white";
};

// const tabOptions = ["Create", "Inactive"];

const NxHistoryModal = ({
  isOpen,
  handleClose = () => {},
  header,
  tabOptions = [],
  dataApprover,
  dataHistory,
}) => {
  const [tabActive, setTabActive] = useState("");
  const [dataApproverFinal, setDataApproverFinal] = useState([]);
  const [dataHistoryFinal, setDataHistoryFinal] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    if (isOpen && dataApprover && dataHistory) {
      const useTabs = tabOptions && (tabOptions?.length > 0 || false);
      if (useTabs) {
        const tempTab = tabOptions[0].value.toLowerCase();
        setTabActive(tempTab);
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

  const handleTabs = (value) => {
    const tempTab = value.toLowerCase();
    setTabActive(value);
    setDataApproverFinal(tabActive ? dataApprover[tempTab] : dataApprover);
    setDataHistoryFinal(tabActive ? dataHistory[tempTab] : dataHistory);
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
    <NxModal
      isOpen={isOpen}
      centered={true}
      width={900}
      closable={false}
      title={header}
      footer={
        <div className="flex justify-end">
          <ButtonComponent onClick={handleClose} type="default">
            Back
          </ButtonComponent>
        </div>
      }
    >
      <Fragment>
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
              id="sliderModalHistory"
              className={`flex gap-2 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar`}
            >
              {dataApproverFinal.map((approver, index) => (
                <div
                  className="flex flex-row items-center gap-1.5"
                  key={`Approver ${index + 1}`}
                >
                  <Avatar
                    shape="square"
                    size={36}
                    icon={handleIconAvatar(approver)}
                    style={styleBackgroundAvatar(approver)}
                  />
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
                  {index !== dataApproverFinal.length - 1 ? (
                    <RightOutlined className="text-xs" />
                  ) : null}
                </div>
              ))}
            </div>

            {dataApproverFinal.length > 0 ? (
              <RightCircleFilled width={32} onClick={sliderRight} />
            ) : null}
          </div>
          <Divider style={{ margin: 0 }} />
          <div
            className="shadow-lg h-72 overflow-auto p-1.5 rounded-md"
            style={{ border: "1px solid #DBDADE" }}
          >
            <List
              dataSource={dataHistoryFinal}
              renderItem={(item) => (
                <List.Item key={item.id} style={{ padding: "8px 0" }}>
                  <div className="flex flex-row w-full px-2 py-1 gap-3 justify-between">
                    <div className="flex flex-col gap-1 w-1/2">
                      <p
                        className="text-xs m-0 font-semibold"
                        style={{ color: handleTextColor(item) }}
                      >
                        {item.status}
                      </p>
                      <p className="text-[11px] m-0">{`Hierachy: ${item.hierarchy}`}</p>
                      <p className="text-[11px] m-0">{`Action by: ${item.name}`}</p>
                      <p className="text-[11px] m-0">{`Position: ${item.role}`}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-1 w-1/2">
                      <div className="flex gap-0.5 items-end">
                        <p className="text-[10px] m-0 font-light">
                          {`Task: ${
                            item.taskDate
                              ? moment(item.taskDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </p>
                        <p className="text-[10px] m-0 font-light">
                          {`Action: ${
                            item.actionDate
                              ? moment(item.actionDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </p>
                      </div>
                      {item.description ? (
                        <p
                          className={`text-[11px] m-0 w-full font-semibold cursor-pointer break-words ${
                            expandedDescriptions[item.id]
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
      </Fragment>
    </NxModal>
  );
};

export default NxHistoryModal;
