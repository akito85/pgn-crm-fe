import { Form, Select, Input } from "antd"
import { PlusOutlined, ClearOutlined, ArrowLeftOutlined, LeftOutlined } from "@ant-design/icons"

import InputComponent from "../../../../../../../../../components/InputComponent"
import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

// ============================================================================
// MODAL: ModalInformationContactDetail (Create/Edit Contact)
// ============================================================================

export default function ModalInformationContactDetail({
  isOpen,
  form,
  contactSecondary,
  columnSecondary,
  onBack,
  onClear,
  onSave,
  onOpenSelectContact,
  onEdit,
  onDelete
}) {

  return (
    <NxModal
      id="ModalInformationContactDetail"
      isOpen={isOpen}
      handleCancel={onBack}
      handleOk={onSave}
      header={"CONTACT INFORMATION"}
      width={1200}
      title={"CONTACT INFORMATION"}
      footer={[
        <div key="footer" className="self-stretch flex flex-row justify-between items-center">
          {/* Back Button - Left */}
          <ButtonComponent
            type={"button"}
            onClick={onBack}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
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
            Back
          </ButtonComponent>

          {/* Clear and Save Buttons - Right */}
          <div className="flex flex-row items-center gap-3">
            <ButtonComponent
              type={"button"}
              onClick={onClear}
              icon={
                <ClearOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
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
              Clear
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              onClick={onSave}
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
      ]}
    >
      <Form form={form} layout="vertical">
        <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
          CONTACT INFORMATION
        </div>

        <div className="self-stretch flex flex-col justify-end items-end">
          <ButtonComponent
            type={"button"}
            onClick={onOpenSelectContact}
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px"
            }}
          >
            Choose Contact
          </ButtonComponent>
        </div>

        <br/>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">First Name</label>
            <Form.Item
              key="FirstName"
              name={"FirstName"}
              className="no-margin-form"
            >
              <InputComponent className="flex-1" />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Middle Name</label>
            <Form.Item
              key="MiddleName"
              name={"MiddleName"}
              className="no-margin-form"
            >
              <InputComponent className="flex-1" />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Last Name</label>
            <Form.Item
              key="LastName"
              name={"LastName"}
              className="no-margin-form"
            >
              <InputComponent className="flex-1" />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Job</label>
            <Form.Item
              key="Job"
              name={"Job"}
              className="no-margin-form"
            >
              <Select></Select>
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Position</label>
            <Form.Item
              key="Position"
              name={"Position"}
              className="no-margin-form"
            >
              <Select></Select>
            </Form.Item>
          </div>
        </div>

        <br/>

        <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
          CONTACT DETAIL
        </div>

        <div className="self-stretch flex flex-col justify-end items-end">
          <ButtonComponent
            type={"button"}
            onClick={() => console.log("Create contact detail")}
            icon={
              <PlusOutlined
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
            Create
          </ButtonComponent>
        </div>

        <br/>

        <NxTable
          id="TableInformationContactDetail"
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={contactSecondary}
          columnMain={columnSecondary}
        />

        <br/>

        <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
          CONTACT PURPOSE INFORMATION
        </div>

        <br/>

        <div className="grid grid-cols-3 gap-5">
          <label className="flex flex-col gap-2.5 cursor-pointer">
            <div className="flex items-center gap-1.5">
              <Form.Item
                name="PrimaryContact"
                valuePropName="checked"
                className="no-margin-form"
              >
                <input type="checkbox" className="size-4 rounded-sm border border-white/80 bg-transparent" />
              </Form.Item>
              <span className="font-medium leading-5">
                Primary Contact
              </span>
            </div>
            <p className="text-neutral-400 text-[10px]">
              Click or tap this checkbox if this is primary contact.
            </p>
          </label>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Contact Address</label>
            <Form.Item
              key="ContactAddress"
              name={"ContactAddress"}
              className="no-margin-form"
            >
              <InputComponent className="flex-1" />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Contact Address Additional Note</label>
            <Form.Item
              key="ContactAddressAdditionalNote"
              name={"ContactAddressAdditionalNote"}
              className="no-margin-form"
            >
              <InputComponent className="flex-1" />
            </Form.Item>
          </div>
        </div>

        <br/>
        <div className="w-full">
          <label className="mb-2 font-medium">Description</label>
          <Form.Item
            key="Description"
            name={"Description"}
            className="no-margin-form"
          >
            <Input.TextArea rows={5} maxLength={255} />
          </Form.Item>
        </div>
      </Form>
    </NxModal>
  )
}
