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

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      className={"modal-custom"}
      centered={true}
      width={1000}
      maskClosable={false}
      footer={
        <div className="w-full flex justify-end gap-5">
          <ButtonComponent onClick={handleClose} type="default">
            Back
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
        <div className={"flex flex-col w-full gap-4 p-5"}>
          {tabOptions && tabOptions.length > 0 ? (
            <RadioTabs data={tabOptions} onChange={handleTabs} />
          ) : null}
          <div className="relative flex justify-center items-center gap-4">
            {dataApproverFinal.length > 0 ? (
              <LeftCircleFilled width={40} onClick={sliderLeft} />
            ) : null}
            <div
              id="sliderModalHistory"
              className={`flex gap-4 w-full h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar`}
            >
              {dataApproverFinal.map((approver, index) => (
                <div
                  className="flex flex-row items-center gap-2"
                  key={`Approver ${index + 1}`}
                >
                  <Avatar
                    shape="square"
                    size={40}
                    icon={handleIconAvatar(approver)}
                    style={styleBackgroundAvatar(approver)}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs m-0">{approver.name || "-"}</p>
                    <p className="text-xs font-thin m-0">{approver.role}</p>
                  </div>
                  {index !== dataApproverFinal.length - 1 ? (
                    <RightOutlined />
                  ) : null}
                </div>
              ))}
            </div>

            {dataApproverFinal.length > 0 ? (
              <RightCircleFilled width={40} onClick={sliderRight} />
            ) : null}
          </div>
          <Divider style={{ margin: 0 }} />
          <div className="shadow-lg h-80 overflow-auto mb-3 p-2 rounded-md">
            <List
              dataSource={dataHistoryFinal}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <div className="flex flex-row w-full p-2 justify-between">
                    <div className="flex flex-col gap-2">
                      <p
                        className="text-xs m-0"
                        style={{ color: handleTextColor(item) }}
                      >
                        {item.status}
                      </p>
                      <p className="text-xs m-0">{`Hierachy: ${item.hierarchy}`}</p>
                      <p className="text-xs m-0">{`Action by: ${item.name}`}</p>
                      <p className="text-xs m-0">{`Position: ${item.role}`}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex flex-row gap-4">
                        <p className="text-xs m-0 font-light">
                          {`Task : ${
                            item.taskDate
                              ? moment(item.taskDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </p>
                        <p className="text-xs m-0 font-light">
                          {`Action : ${
                            item.actionDate
                              ? moment(item.actionDate).format(
                                  dateFormatting.dateTime
                                )
                              : "-"
                          }`}
                        </p>
                      </div>
                      <Tooltip title={item.description}>
                        <p className="text-xs m-0 w-36 text-end font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                          {item.status !== "SUBMIT" ? item.description : null}
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </Fragment>
    </Modal>
  );
};

export default ModalHistory;
