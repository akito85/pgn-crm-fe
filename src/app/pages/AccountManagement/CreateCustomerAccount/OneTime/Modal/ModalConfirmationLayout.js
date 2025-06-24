import React, { useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import AccountInformation from "./ConfirmationLayoutData/AccountInformation";
import Address from "./ConfirmationLayoutData/Address";
import Contact from "./ConfirmationLayoutData/Contact";
import DistributionMedia from "./ConfirmationLayoutData/DistributionMedia";
import FinancialInformation from "./ConfirmationLayoutData/FinancialInformation";
import RadioTabs from "../../../../../../components/RadioTabs";

const ModalConfirmationLayout = ({
  data,
  isOpen,
  handleCancel = () => {},
  dispatch = () => {},
  handleConfirm,
  dataCheck,
  dataCustomer,
  dataFinancialInfo = [],
  listAttachment = [],
  addressTable = [],
  contactTable = [],
  prefix1,
  prefix2,
  suffix,
  keyModal,
  dataDM = [],
}) => {
  // State
  const [valuePage, setValuePage] = useState("");

  const tabPages = [
    { value: "Account Information" },
    { value: "Address" },
    { value: "Contact" },
    { value: "Distribution Media" },
    { value: "Financial Information" },
  ];

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Account Information":
        return (
          <AccountInformation
            dataCustomer={dataCustomer}
            dataCheck={dataCheck}
            dataCI={data?.customerInformation}
            dataAI={data?.accountInformation}
            listAttachment={listAttachment}
          />
        );
      case "Address":
        return <Address data={addressTable} />;
      case "Contact":
        return (
          <Contact
            data={contactTable}
            prefix1={prefix1}
            prefix2={prefix2}
            suffix={suffix}
            keyModal={keyModal}
            dataAddress={addressTable}
          />
        );
      case "Distribution Media":
        return <DistributionMedia dataDM={dataDM} />;
      case "Financial Information":
        return (
          <FinancialInformation
            dataPC={data?.financialInformation?.paymentChannel}
            dataTI={data?.financialInformation?.taxIdentifier}
            dataTR={data?.financialInformation?.taxRelation}
            dataWT={data?.financialInformation?.wapu}
            dataFinancialInfo={dataFinancialInfo}
            dispatch={dispatch}
            addressTable={addressTable}
            dataForm={data?.tempForm}
          />
        );
      default:
        return (
          <AccountInformation
            dataCustomer={dataCustomer}
            dataCheck={dataCheck}
            dataCI={data?.customerInformation}
            dataAI={data?.accountInformation}
            listAttachment={listAttachment}
          />
        );
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type={"confirmation"}
      header={"confirmation"}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={tabPages}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      <div className="mt-[30px]">{layout(valuePage)}</div>
    </ModalCustom>
  );
};

export default ModalConfirmationLayout;
