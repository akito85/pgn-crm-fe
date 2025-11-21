import { Fragment, useState } from "react"

import { Space, Button, Popconfirm, Form } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxPanel from "../../../../../../../../../components/Nx/NxPanel"

import ModalInformationContactDetail from "./ModalInformationContactDetail"
import ModalListContact from "./ModalListContact"
import ModalConfirmationContactDetail from "./ModalConfirmationContactDetail"

// ============================================================================
// STATIC DATA - Mock data for demonstration
// ============================================================================

// Main contact list data
const MOCK_CONTACT_LIST = []

// Contact secondary details (phone, email, etc.)
const MOCK_CONTACT_SECONDARY = []

// Expanded table data for ModalListContact
const EXPAND_DATA_MAIN = [
  {
    "key": "1",
    "no": "1",
    "name": "Daniel Irza Kurniawan",
    "job": "Engineer",
    "position": "Staff Engineer",
    "source": "PGN Directory"
  },
  {
    "key": "2",
    "no": "2",
    "name": "Supratman",
    "job": "Engineer",
    "position": "Staff Engineer",
    "source": "Customer Database"
  },
  {
    "key": "3",
    "no": "3",
    "name": "Donny Malaka",
    "job": "Engineer",
    "position": "Staff Engineer",
    "source": "PGN Directory"
  }
]

// Expanded table details (phone, email, etc. for each contact)
const DATA_EXPAND = [
  {
    "key": "expand-1-1",
    "parentKey": "1",
    "no": "1",
    "type": "Phone",
    "inputType": "Phone",
    "value": "(62)(21)-81365479889"
  },
  {
    "key": "expand-1-2",
    "parentKey": "1",
    "no": "2",
    "type": "Email",
    "inputType": "Email",
    "value": "daniel.kurniawan@pgn.co.id"
  },
  {
    "key": "expand-1-3",
    "parentKey": "1",
    "no": "3",
    "type": "Mobile Phone",
    "inputType": "Mobile Phone",
    "value": "(62)-81365479889"
  },
  {
    "key": "expand-2-1",
    "parentKey": "2",
    "no": "1",
    "type": "Phone",
    "inputType": "Phone",
    "value": "(62)(21)-81365470000"
  },
  {
    "key": "expand-2-2",
    "parentKey": "2",
    "no": "2",
    "type": "Email",
    "inputType": "Email",
    "value": "supratman@pgn.co.id"
  },
  {
    "key": "expand-3-1",
    "parentKey": "3",
    "no": "1",
    "type": "Phone",
    "inputType": "Phone",
    "value": "(62)(21)-81365471111"
  },
  {
    "key": "expand-3-2",
    "parentKey": "3",
    "no": "2",
    "type": "Email",
    "inputType": "Email",
    "value": "donny.malaka@pgn.co.id"
  },
  {
    "key": "expand-3-3",
    "parentKey": "3",
    "no": "3",
    "type": "Whatsapp",
    "inputType": "Whatsapp",
    "value": "6287778786767"
  }
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactForm() {

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  const [form] = Form.useForm() // Form instance for contact information
  const [isOpen, setIsOpen] = useState(false) // ModalInformationContactDetail
  const [isSelectContactModal, setIsSelectContactModal] = useState(false) // ModalListContact
  const [isConfirmationContactModal, setIsConfirmationContactModal] = useState(false) // ModalConfirmationContactDetail
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [contactList, setContactList] = useState(MOCK_CONTACT_LIST)
  const [contactSecondary, setContactSecondary] = useState(MOCK_CONTACT_SECONDARY)

  // --------------------------------------------------------------------------
  // EVENT HANDLERS - Main Contact Table
  // --------------------------------------------------------------------------

  const handleEdit = (record) => {
    console.log("edit", record)
  }

  const handleDelete = (record) => {
    console.log("delete", record)
  }

  // --------------------------------------------------------------------------
  // EVENT HANDLERS - ModalInformationContactDetail
  // --------------------------------------------------------------------------

  const handleClearForm = () => {
    // Clear all form fields
    form.resetFields()
    console.log("Form cleared")
  }

  const handleSaveContact = () => {
    form.validateFields()
      .then((values) => {
        console.log("Contact saved:", values)
        // Here you would save the contact data
        setIsOpen(false)
      })
      .catch((error) => {
        console.log("Validation failed:", error)
      })
  }

  const handleBackFromContactModal = () => {
    setIsOpen(false)
  }

  // --------------------------------------------------------------------------
  // EVENT HANDLERS - ModalListContact (Choose Contact)
  // --------------------------------------------------------------------------

  const handleOkSelectContactModal = () => {
    setIsSelectContactModal(false)
    setExpandedRowKeys([])
  }

  const handleCancelSelectContactModal = () => {
    setIsSelectContactModal(false)
    setExpandedRowKeys([])
  }

  const handleBackFromSelectContactModal = () => {
    setIsSelectContactModal(false)
    setExpandedRowKeys([])
  }

  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter(k => k !== record.key)
    setExpandedRowKeys(keys)
  }

  // --------------------------------------------------------------------------
  // EVENT HANDLERS - ModalConfirmationContactDetail
  // --------------------------------------------------------------------------

  const handleOkConfirmationContactModal = () => {
    setIsConfirmationContactModal(false)
    setExpandedRowKeys([])
  }

  const handleCancelConfirmationContactModal = () => {
    setIsConfirmationContactModal(false)
    setExpandedRowKeys([])
  }

  const handleConfirmContact = () => {
    console.log("Contact confirmed")
    setIsConfirmationContactModal(false)
    // Add selected contact to the main table
  }

  const handleBackFromConfirmationModal = () => {
    setIsConfirmationContactModal(false)
  }

  const handleClearConfirmationForm = () => {
    console.log("Clear confirmation form")
    // Clear any temporary data
  }

  const handleSaveFromConfirmationModal = () => {
    console.log("Save from confirmation")
    setIsConfirmationContactModal(false)
    // Save the confirmed contact
  }

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS - Main Contact Table
  // --------------------------------------------------------------------------

  const columnMain = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,
    },
    {
      title: 'PRIMARY',
      dataIndex: 'primary',
      key: 'primary',
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'JOB',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'CONTACT ADDRESS',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'CONTACT ADDRESS ADDITIONAL NOTE',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS - Contact Secondary Table (Phone, Email, etc.)
  // --------------------------------------------------------------------------

  const columnSecondary = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      filter: true,
    },
    {
      title: 'INPUT TYPE',
      dataIndex: 'inputtype',
      key: 'inputtype',
    },
    {
      title: 'INPUT VALUE',
      dataIndex: 'inputvalue',
      key: 'inputvalue',
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS - Expanded Main Table (for ModalListContact)
  // --------------------------------------------------------------------------

  const expandColumnMain = [
    {
      "title": "NO",
      "dataIndex": "no",
      "key": "no",
      "width": 80
    },
    {
      "title": "NAME",
      "dataIndex": "name",
      "key": "name",
      "width": 200
    },
    {
      "title": "JOB",
      "dataIndex": "job",
      "key": "job",
      "width": 150
    },
    {
      "title": "POSITION",
      "dataIndex": "position",
      "key": "position",
      "width": 180
    },
    {
      "title": "SOURCE",
      "dataIndex": "source",
      "key": "source",
      "width": 180
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 150,
      onCell: () => ({
        onClick: (e) => {
          e.stopPropagation()
        },
      }),
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsConfirmationContactModal(true)}
          >
          </Button>
        </Space>
      ),
    },
  ]

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS - Expanded Detail Table (for ModalListContact)
  // --------------------------------------------------------------------------

  const columnExpand = [
    {
      "title": "NO",
      "dataIndex": "no",
      "key": "no",
      "width": 80
    },
    {
      "title": "TYPE",
      "dataIndex": "type",
      "key": "type",
      "width": 150
    },
    {
      "title": "INPUT TYPE",
      "dataIndex": "inputType",
      "key": "inputType",
      "width": 150
    },
    {
      "title": "VALUE",
      "dataIndex": "value",
      "key": "value",
      "width": 250
    }
  ]

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <Fragment>
      <NxPanel title={"CONTACT LIST"}>

        {/* Create Contact Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => setIsOpen(true)}
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
              height: "48px"
            }}
          >
            Create Contact
          </ButtonComponent>
        </div>

        {/* Main Contact Table */}
        <NxTable
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={contactList}
          columnMain={columnMain}
        />

        {/* ====================================================================
            MODAL 1: ModalInformationContactDetail (Create/Edit Contact)
            ==================================================================== */}
        <ModalInformationContactDetail
          isOpen={isOpen}
          form={form}
          contactSecondary={contactSecondary}
          columnSecondary={columnSecondary}
          onBack={handleBackFromContactModal}
          onClear={handleClearForm}
          onSave={handleSaveContact}
          onOpenSelectContact={() => setIsSelectContactModal(true)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* ====================================================================
            MODAL 2: ModalListContact (Choose Contact from Existing)
            ==================================================================== */}
        <ModalListContact
          isOpen={isSelectContactModal}
          expandDataMain={EXPAND_DATA_MAIN}
          expandColumnMain={expandColumnMain}
          columnExpand={columnExpand}
          dataExpand={DATA_EXPAND}
          expandedRowKeys={expandedRowKeys}
          onExpand={handleExpand}
          onBack={handleBackFromSelectContactModal}
          onCancel={handleCancelSelectContactModal}
          onOk={handleOkSelectContactModal}
        />

        {/* ====================================================================
            MODAL 3: ModalConfirmationContactDetail (Confirm Selected Contact)
            ==================================================================== */}
        <ModalConfirmationContactDetail
          isOpen={isConfirmationContactModal}
          contactSecondary={contactSecondary}
          columnSecondary={columnSecondary}
          onBack={handleBackFromConfirmationModal}
          onClear={handleClearConfirmationForm}
          onSave={handleSaveFromConfirmationModal}
          onCancel={handleCancelConfirmationContactModal}
          onOk={handleOkConfirmationContactModal}
        />

      </NxPanel>
    </Fragment>
  )
}

// ============================================================================
// HELPER FUNCTIONS (if needed)
// ============================================================================

// Export form values getter for wizard step retrieval
export const getContactFormValues = (form) => {
  if (!form) return null
  return form.getFieldsValue()
}
