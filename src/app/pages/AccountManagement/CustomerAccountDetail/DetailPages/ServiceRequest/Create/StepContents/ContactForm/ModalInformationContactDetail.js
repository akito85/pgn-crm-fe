import { Form, Select, Input } from "antd"
import { useState, useEffect } from "react"
import { PlusOutlined, ClearOutlined, ArrowLeftOutlined, LeftOutlined } from "@ant-design/icons"

import InputComponent from "../../../../../../../../../components/InputComponent"
import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

// ============================================================================
// STATIC DATA
// ============================================================================
const MOCK_CONTACT_SECONDARY = []

// ============================================================================
// MODAL: ModalInformationContactDetail (Create/Edit Contact)
// ============================================================================

export default function ModalInformationContactDetail({
  isOpen,
  onBack,
  onClear,
  onSave,
  onOpenSelectContact,
}) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [form] = Form.useForm()
  const [contactDetailForm] = Form.useForm()
  const [contactSecondary, setContactSecondary] = useState(MOCK_CONTACT_SECONDARY)
  const [editingKey, setEditingKey] = useState('')

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS
  // --------------------------------------------------------------------------
  const columnSecondary = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,
      editable: false,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      filter: true,
      editable: true,
      inputType: 'select',
    },
    {
      title: 'INPUT TYPE',
      dataIndex: 'inputtype',
      key: 'inputtype',
      editable: true,
      inputType: 'text',
    },
    {
      title: 'INPUT VALUE',
      dataIndex: 'inputvalue',
      key: 'inputvalue',
      editable: true,
      inputType: 'text',
    },
  ]

  // --------------------------------------------------------------------------
  // EFFECT: Initialize form when editing starts
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (editingKey) {
      console.log('useEffect: editingKey changed to:', editingKey)
      const rowToEdit = contactSecondary.find((item) => item.key === editingKey)

      if (rowToEdit) {
        console.log('useEffect: Found row to edit:', rowToEdit)
        const formValues = {
          type: rowToEdit.type || '',
          inputtype: rowToEdit.inputtype || '',
          inputvalue: rowToEdit.inputvalue || '',
        }
        console.log('useEffect: Setting form values:', formValues)
        contactDetailForm.setFieldsValue(formValues)
      } else {
        console.log('useEffect: Row not found for key:', editingKey)
      }
    } else {
      console.log('useEffect: editingKey is empty, skipping form initialization')
    }
  }, [editingKey, contactSecondary, contactDetailForm])

  // --------------------------------------------------------------------------
  // EVENT HANDLERS - Contact Detail Inline Editing
  // --------------------------------------------------------------------------
  const handleAddContactDetail = () => {
    const newKey = `temp-${Date.now()}`
    const newRow = {
      key: newKey,
      no: contactSecondary.length + 1,
      type: '',
      inputtype: '',
      inputvalue: '',
    }

    setContactSecondary([...contactSecondary, newRow])
    setEditingKey(newKey)
  }

  const handleSaveContactDetail = async (key, row) => {
    try {
      console.log('Save called with key:', key)
      console.log('Form data received:', row)

      const newData = [...contactSecondary]
      const index = newData.findIndex((item) => key === item.key)

      if (index > -1) {
        const item = newData[index]
        console.log('Current item before save:', item)

        const permanentKey = key.startsWith('temp-')
          ? `contact-${Date.now()}-${index}`
          : key

        const updatedItem = {
          ...item,
          ...row,
          key: permanentKey,
        }

        console.log('Updated item after merge:', updatedItem)

        newData.splice(index, 1, updatedItem)
        setContactSecondary(newData)
        setEditingKey('')
        contactDetailForm.resetFields()

        console.log('Contact detail saved successfully')
      } else {
        console.error('Row not found for key:', key)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const handleCancelContactDetail = () => {
    if (editingKey.startsWith('temp-')) {
      const newData = contactSecondary.filter((item) => item.key !== editingKey)
      setContactSecondary(newData)
    }
    setEditingKey('')
    contactDetailForm.resetFields()
  }

  const handleEditContactDetail = (record) => {
    console.log('Edit contact detail:', record)
  }

  const handleDeleteContactDetail = (record) => {
    console.log('Delete contact detail:', record)
    const newData = contactSecondary.filter((item) => item.key !== record.key)
    setContactSecondary(newData)
    console.log('Contact detail deleted successfully')
  }

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
            onClick={handleAddContactDetail}
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
          useInlineEdit={true}
          editingKey={editingKey}
          setEditingKey={setEditingKey}
          formInstance={contactDetailForm}
          onSaveRow={handleSaveContactDetail}
          onCancelEdit={handleCancelContactDetail}
          onEditRow={handleEditContactDetail}
          onDeleteRow={handleDeleteContactDetail}
          showEditAction={true}
          showDeleteAction={true}
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
