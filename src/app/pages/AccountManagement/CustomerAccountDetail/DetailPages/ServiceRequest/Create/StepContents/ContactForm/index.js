import { Fragment, useState } from "react"

import { Space, Button, Popconfirm, Form, Select, Input } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"

import InputComponent from "../../../../../../../../../components/InputComponent" 
import ButtonComponent from "../../../../../../../../../components/ButtonComponent"
import TabPane from "antd/lib/tabs/TabPane"
import NxTable from "../../../../../../../../../components/Nx/NxTable"
import NxPanel from "../../../../../../../../../components/Nx/NxPanel"
import NxModal from "../../../../../../../../../components/Nx/NxModal"

export default function ContactForm(){

  const [isOpen, setIsOpen] = useState(false)
  const [isSelectContactModal, setIsSelectContactModal] = useState(false)
  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const contact = []
  const columnMain = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,  // NxTable's built-in search
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
            onClick={() =>  handleEdit(record)}
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

  const handleEdit = () => {
    console.log("edit") 
  }

  const handleDelete = () => {
    console.log("delete")
  }

  const handleOk = () => {
    console.log("ok")
    setIsOpen(false) // Close modal after OK
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const columnSecondary = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      filter: true,  // NxTable's built-in search
    },    
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      filter: true,  // NxTable's built-in search
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
            onClick={() =>  handleEdit(record)}
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

  const handleEditInline = () => {
    console.log("edit");
  }

  const handleDeleteInline = () => {
    console.log("delete");
  }

  const handleOkSelectContactModal = () => {
    setIsSelectContactModal(false) // Fixed: should close modal, not open
    setExpandedRowKeys([]) // Reset expanded rows
  }

  const handleCancelSelectContactModal = () => {
    setIsSelectContactModal(false)
    setExpandedRowKeys([]) // Reset expanded rows
  }

  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter(k => k !== record.key)
    setExpandedRowKeys(keys)
  }

  const contactSecondary = []
  const expandDataMain = [
    {
      "key": "1",
      "no": "1",
      "type": "Phone",
      "inputType": "Phone",
      "value": "(62)(21)-81365479889"
    },
    {
      "key": "2", 
      "no": "2",
      "type": "Email",
      "inputType": "Email", 
      "value": "ijlalsetiawan@gmail.co.id"
    },
    {
      "key": "3",
      "no": "3", 
      "type": "PGN Mobile (Phone)",
      "inputType": "Mobile Phone",
      "value": "(62)-81365479889"
    },
    {
      "key": "4",
      "no": "4",
      "type": "Whatsapp", 
      "inputType": "Whatsapp",
      "value": "6287778786767"
    }
  ]

  const expandColumnMain = [
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
      "width": 200
    }
  ]

  const dataExpand = [
    {
      "key": "expand-1-1",
      "parentKey": "1",
      "name": "2 Daniel Irza Kurniawan",
      "position": "Staff Engineer", 
      "department": "IT Master"
    },
    {
      "key": "expand-1-2",
      "parentKey": "1", 
      "name": "3 Supratman",
      "position": "Staff Engineer",
      "department": "IT Master"
    },
    {
      "key": "expand-1-3",
      "parentKey": "1",
      "name": "4 Donny Malaka", 
      "position": "Staff Engineer",
      "department": "IT Master"
    },
    {
      "key": "expand-2-1",
      "parentKey": "2",
      "name": "2 Daniel Irza Kurniawan",
      "position": "Staff Engineer",
      "department": "IT Master" 
    },
    {
      "key": "expand-3-1",
      "parentKey": "3",
      "name": "2 Daniel Irza Kurniawan",
      "position": "Staff Engineer",
      "department": "IT Master"
    },
    {
      "key": "expand-4-1", 
      "parentKey": "4",
      "name": "2 Daniel Irza Kurniawan",
      "position": "Staff Engineer",
      "department": "IT Master"
    }
  ]
  
  const columnExpand = [
    {
      "title": "Name",
      "dataIndex": "name", 
      "key": "name",
      "width": 200
    },
    {
      "title": "Position",
      "dataIndex": "position",
      "key": "position", 
      "width": 150
    },
    {
      "title": "Department",
      "dataIndex": "department",
      "key": "department",
      "width": 150
    }
  ]

  return(
    <Fragment>
      <NxPanel title={"CONTACT LIST"}>

        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          {/* Approval Button */}
          <ButtonComponent
            type={"submit"}
            onClick={() => { setIsOpen(true) }}
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

        <NxTable
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={contact}
          columnMain={columnMain}
          
        />

        <NxModal
          isOpen={isOpen}
          handleCancel={handleCancel}
          handleOk={handleOk}
          header={"CONTACT INFORMATION"}
          width={1200}
          title={"CONTACT INFORMATION"}
          footer={[
            <div className="self-stretch flex flex-row items-end justify-end">
              <ButtonComponent
                type={"submit"}
                onClick={() => { setIsOpen(true) }}
                icon={
                  <DeleteOutlined
                    style={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  />
                }
                className="mr-4"
                style={{
                  backgroundColor: "#0075bf",
                  color: "#fff",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px"
                }}
              >
                Clear
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={() => { setIsOpen(true) }}
                style={{
                  backgroundColor: "#0075bf",
                  color: "#fff",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px"
                }}
              >
                Save
              </ButtonComponent>
            </div>
          ]}
        >
          <div className="flex-1 justify-start text-sky-600 text-sm font-bold">
            CONTACT INFORMATION
          </div>

          <div class="self-stertch flex flex-col justify-end items-end">
            <ButtonComponent
              type={"submit"}
              onClick={() => { setIsSelectContactModal(true) }}
              className=""
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

          <div class="self-stertch flex flex-col justify-end items-end">
            <ButtonComponent
              type={"submit"}
              onClick={() => { setIsOpen(true) }}
              className=""
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
              Create
            </ButtonComponent>
          </div>

          <br/>

          <NxTable
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
                <input type="checkbox" className="size-4 rounded-sm border border-white/80 bg-transparent" />
                <span className="font-medium leading-5">
                  Primary Contact
                </span>
              </div>
              <p className="text-neutral-400 text-[10px]">
                Click or tap this checkbox if data is branch.
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
          <div class="w-full">
            <label className="mb-2 font-medium">Description</label>
            <Input.TextArea rows={5} maxLength={255} />
          </div>
        </NxModal>

        <NxModal
          isOpen={isSelectContactModal}
          handleCancel={handleCancelSelectContactModal}
          handleOk={handleOkSelectContactModal}
          header={"CHOOSE CONTACT"}
          width={1200}
          title={"CHOOSE CONTACT"}
          footer={
            <div className="self-stretch flex flex-row items-end justify-end">
              <ButtonComponent
                type={"submit"}
                onClick={() => { setIsOpen(true) }}
                style={{
                  // backgroundColor: "#0075bf",
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
            className="border-[0.5px] border-[#c8cdd4] border-solid "
            usePagination={true}
            useSelect={true}
            dataMain={expandDataMain}
            columnMain={expandColumnMain}
            columnExpand={columnExpand}
            dataExpand={dataExpand}
            childTitle="EMPLOYEE DETAILS"
            tablePadding="small"
            fontSize="medium"
            expandRowByClick={true}
            expandedRowKeys={expandedRowKeys}
            onExpand={handleExpand}
          />
        </NxModal>
      </NxPanel>
    </Fragment>
  )
}
