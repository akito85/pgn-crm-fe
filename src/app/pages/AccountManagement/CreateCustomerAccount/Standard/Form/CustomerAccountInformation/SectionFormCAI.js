import { Spin } from "antd";
import React, { useState } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import AttachmentForm from "./AttachmentForm";
import CustomerAccountInformation from "./CustomerAccountInformationForm";

const SectionFormCAI = ({
  dataCustomer,
  dataCheck,
  dispatch = () => {},
  handleCAIObj = () => {},
  CAIObj = {},
  CIObj = {},
  data = [],
  updateData = () => {},
  form,
  valuePage,
  setValuePage,
  tabPages,
}) => {
  // State
  // const [valuePage, setValuePage] = useState("");

  // const tabPages = [
  //   {
  //     value: "Customer/Account Information",
  //     paramValue: [
  //       "customerName",
  //       "meterReadingCode",
  //       "accountName",
  //       "category",
  //       "accountSegment",
  //       "accountGroupType",
  //       "accountType",
  //       "classificationType",
  //     ],
  //   },
  //   { value: "Attachment" },
  // ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Customer/Account Information":
        return (
          <CustomerAccountInformation
            dataCustomer={dataCustomer}
            dataCheck={dataCheck}
            dispatch={dispatch}
            handleCAIObj={handleCAIObj}
            CAIObj={CAIObj}
            CIObj={CIObj}
            form={form}
          />
        );
      case "Attachment":
        return (
          <AttachmentForm
            data={data}
            updateData={updateData}
            dispatch={dispatch}
          />
        );
      default:
        return (
          <CustomerAccountInformation
            dataCustomer={dataCustomer}
            dataCheck={dataCheck}
            dispatch={dispatch}
            handleCAIObj={handleCAIObj}
            CAIObj={CAIObj}
            CIObj={CIObj}
            form={form}
          />
        );
    }
  };
  return (
    <div>
      {dataCheck !== true ? (
        <RadioTabs
          data={tabPages}
          // data={tabPages}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
      ) : null}
      {/* <div className="mt-[30px]">{layout(valuePage)}</div> */}
      <div
        className="mt-8"
        style={{
          display: valuePage !== tabPages[0].value ? "none" : undefined,
        }}
      >
        <CustomerAccountInformation
          dataCustomer={dataCustomer}
          dataCheck={dataCheck}
          dispatch={dispatch}
          handleCAIObj={handleCAIObj}
          CAIObj={CAIObj}
          CIObj={CIObj}
          form={form}
        />
      </div>
      <div
        className="mt-8"
        style={{
          display: valuePage !== tabPages[1].value ? "none" : undefined,
        }}
      >
        <AttachmentForm
          data={data}
          updateData={updateData}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};

export default SectionFormCAI;
