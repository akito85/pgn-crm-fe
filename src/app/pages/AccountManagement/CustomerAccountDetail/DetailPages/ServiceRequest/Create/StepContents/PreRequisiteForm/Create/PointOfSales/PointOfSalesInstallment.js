import { useState } from "react";

import { PlusOutlined, DatabaseOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../../../components/ButtonComponent";

import NxTable from "../../../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../../../components/Nx/NxModal";


const PointOfSalesInstallment = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const CheckboxField = ({ 
    id,
    label, 
    description, 
    checked = false, 
    onChange,
    disabled = false 
  }) => {
    return (
      <div className="flex flex-col gap-1">
        <label 
          htmlFor={id}
          className="inline-flex items-center gap-1.5 cursor-pointer"
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="size-4 rounded-sm border border-white/80 bg-transparent checked:bg-blue-500 checked:border-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="text-gray text-sm font-normal">
            {label}
          </span>
        </label>
        
        {description && (
          <p className="text-neutral-400 text-[10px] font-normal pl-5.5">
            {description}
          </p>
        )}
      </div>
    );
  };

  const columnMain = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "PROMOTION TYPE",
      dataIndex: "promotionType",
      width: 120,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "CRITERIA",
      dataIndex: "criteria",
      width: 200,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 120,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 120,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "ACTION",
      dataIndex: "action",
      width: 100,
    }
  ];

  const ModalGenerateInstallmentPeriod = () => {
    setIsOpen(true)
  }

  const ModalHandleCancel = () => {
    setIsOpen(false)
  }

  const ModalHandleOk = () => {
    setIsOpen(false)
  }
  
  return (
    <>
      <CheckboxField
        className="my-5"
        id="installment"
        label="Have Installment"
        description="Check if point of sales pre-requisite have installment"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />

      { isChecked && (
        <>
          <div className="w-full flex justify-end items-center gap-2.5 mb-5">
            <ButtonComponent
              type={"submit"}
              onClick={ModalGenerateInstallmentPeriod}
              icon={
                <DatabaseOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px",
              }}
            >
              Generate Installment Period
            </ButtonComponent>
          </div>

          <NxTable
            columnMain={columnMain}
            dataMain={null}
          />

          <div className="flex flex-col my-5">
            <p className="text-sm mb-0">Undistributed Installment Bill Amount</p>
            <p className="text-sm mb-0">IDR 1,000,000</p>
          </div>
        </>
      )}

      <NxModal
        isOpen={isOpen}
        width={1300}
        title={"GENERATE INSTALLMENT PERIOD"}
        footer={
          <div className="self-stretch flex flex-row justify-end">
            {/* Clear and Save Buttons - Right */}
            <div className="flex flex-row items-center gap-3">
              <ButtonComponent
                type={"button"}
                // onClick={handleClear}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0075bf",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px",
                  width: "135px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "9px",
                  paddingBottom: "9px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "30px"
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"button"}
                // onClick={handleConfirm}
                style={{
                  backgroundColor: "#0075bf",
                  color: "#fff",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px",
                  width: "135px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "9px",
                  paddingBottom: "9px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "30px"
                }}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        }
        className={"head-no-bg-modal"}
        handleCancel={ModalHandleCancel}
        handleOk={ModalHandleOk}
      />
    </>
  )
}

export { PointOfSalesInstallment }


