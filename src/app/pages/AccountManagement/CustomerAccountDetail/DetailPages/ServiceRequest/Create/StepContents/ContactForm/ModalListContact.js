import { useState } from "react"
import { ArrowLeftOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Space } from "antd"

import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

// ============================================================================
// STATIC DATA
// ============================================================================
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
// MODAL: ModalListContact (Choose Contact from Existing)
// ============================================================================

export default function ModalListContact({
  isOpen,
  onBack,
  onSelectContact,
}) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  // --------------------------------------------------------------------------
  // COLUMN DEFINITIONS
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
            onClick={(e) => {
              e.stopPropagation()
              if (onSelectContact) {
                onSelectContact(record)
              }
            }}
          >
          </Button>
        </Space>
      ),
    },
  ]

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
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter(k => k !== record.key)
    setExpandedRowKeys(keys)
  }

  const handleBack = () => {
    setExpandedRowKeys([])
    onBack()
  }

  return (
    <NxModal
      id="ModalListContact"
      isOpen={isOpen}
      handleCancel={handleBack}
      handleOk={handleBack}
      header={"CHOOSE CONTACT"}
      width={1200}
      title={"CHOOSE CONTACT"}
      footer={
        <div className="flex flex-row items-end justify-end">
          <ButtonComponent
            type={"button"}
            onClick={handleBack}
            style={{
              backgroundColor: "#ffffff",
              color: "#0075bf",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px"
            }}
          >
            Back
          </ButtonComponent>
        </div>
      }
    >
      <NxTable
        id="TableListContact"
        className="border-[0.5px] border-[#c8cdd4] border-solid "
        usePagination={true}
        useSelect={true}
        dataMain={EXPAND_DATA_MAIN}
        columnMain={expandColumnMain}
        columnExpand={columnExpand}
        dataExpand={DATA_EXPAND}
        childTitle="CONTACT DETAILS"
        tablePadding="small"
        fontSize="medium"
        expandRowByClick={true}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpand}
      />
    </NxModal>
  )
}
