import { useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";

import { Space, Button, Popconfirm, Form } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxPanel from "../../../../../../../../../components/Nx/NxPanel";

import ModalPreRequisiteDetail from "./ModalPreRequisiteDetail";

export default function PreRequisiteForm() {
  const [form] = Form.useForm(); // Form instance for contact information
  const [isOpen, setIsOpen] = useState(false); // ModalInformationContactDetail

  const navigate = useNavigate();

  const PREREQUISITE = [
    {
      no: 1,
      type: "Administrative",
      name: "Menerbitkan BBG",
      description: "Desc",
      status: "status",
    },
    {
      no: 2,
      type: "Administrative",
      name: "Menerbitkan BBG",
      description: "Desc",
      status: "status",
    },
    {
      no: 3,
      type: "Administrative",
      name: "Menerbitkan BBG",
      description: "Desc",
      status: "status",
    },
  ];
  const columnMain = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      filter: true,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "PREREQUISITE NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => setIsOpen(true)}>
            Detail
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => console.log("edit")}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => console.log("delete")}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <NxPanel title={"PREREQUSITE LIST"}>
        {/* Create Contact Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"submit"}
            onClick={() =>
              navigate(
                "/account-management/account-standard/service-requests/prerequisite/create",
              )
            }
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
            }}
          >
            Create
          </ButtonComponent>
        </div>

        {/* Main Contact Table */}
        <NxTable
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={true}
          useSelect={true}
          dataMain={PREREQUISITE}
          columnMain={columnMain}
          fontSize={"medium"}
          dataExpand={null}
          columnExpand={null}
          useCheckbox={true}
          rowKey={(PREREQUISITE) => PREREQUISITE.no}
          onSelectionChange={(keys, rows) => {
            console.log("Selected keys:", keys);
            console.log("Full row data:", rows); // All props of selected rows
          }}
          getCheckboxProps={(record) => ({
            disabled: record.status === "Inactive",
          })}
        />
      </NxPanel>

      <ModalPreRequisiteDetail
        isOpen={isOpen}
        footer={null}
        handleCancel={() => {
          setIsOpen(false);
        }}
        handleOk={() => {
          setIsOpen(false);
        }}
      />
    </Fragment>
  );
}
