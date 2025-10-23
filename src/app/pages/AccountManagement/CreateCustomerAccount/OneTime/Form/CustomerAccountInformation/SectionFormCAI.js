import { Spin } from "antd";
import React, { useState } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import AttachmentForm from "./AttachmentForm";
import CustomerAccountInformation from "./CustomerAccountInformationForm";

const SectionFormCAI = ({
  dataCustomer,
  dataCheck,
  dataAttachment = [],
  updatedDataAttachment = () => {},
  dispatch = () => {},
  handleCAIObj = () => {},
  CAIObj = {},
  form,
  valuePage,
  setValuePage,
  tabPages,
}) => {
  // Selector

  // Declaration

  // State
  // const [valuePage, setValuePage] = useState("");

  // // Use Effect

  // const tabPages = [
  //   { value: "Customer/Account Information" },
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
            form={form}
          />
        );
      case "Attachment":
        return (
          <AttachmentForm
            data={dataAttachment}
            updateData={updatedDataAttachment}
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
            form={form}
          />
        );
    }
  };
  return (
    <div>
      {dataCheck !== "choose" ? (
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
          data={dataAttachment}
          updateData={updatedDataAttachment}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
};

export default SectionFormCAI;
