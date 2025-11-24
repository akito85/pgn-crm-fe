import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, CheckOutlined, FilterOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Popconfirm, Button, Space } from "antd";  

import NxPanel from "../../../../../../../../../../components/Nx/NxPanel";
import NxTable from "../../../../../../../../../../components/Nx/NxTable";
import ButtonComponent from "../../../../../../../../../../components/ButtonComponent";

export default function InfoDataRequirement() {
  const [dataRequirement, setDataRequirement] = useState([]);
  const navigate = useNavigate();
  const columnMain = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filter: true,  // NxTable's built-in search
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Actions',
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

  const handleEdit = (record) => {
    console.log("edit");
  }

  const handleDelete = (record) => {
    console.log("delete");
  }

  return(
    <NxPanel title={"DATA REQUIREMENT"}>
      <div className="w-full flex justify-between items-center gap-5 mb-5">
        {/* Filter Button - Left side */}
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(-1)}
          icon={
            <FilterOutlined
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
            width: "128px",
            height: "48px",
            borderRadius: "5px"
          }}
        >
          Filters
        </ButtonComponent>
        <div className="flex justify-end items-center gap-2.5">
          {/* Download List Button */}
          <ButtonComponent
            type={"submit"}
            onClick={() => {}}
            icon={
              <DownloadOutlined
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
            Download List
          </ButtonComponent>

          {/* Approval Button */}
          <ButtonComponent
            type={"submit"}
            onClick={() => {}}
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
      </div>

      <NxTable
        className="border-[0.5px] border-[#c8cdd4] border-solid "
        usePagination={true}
        useSelect={true}
        dataMain={dataRequirement}
        columnMain={columnMain}
      />
    </NxPanel>
  )
}
