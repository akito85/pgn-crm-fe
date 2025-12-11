import { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

export default function PreRequisiteForm({
  form,
  account,
  customer,
  currentStep,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleCreateClick = () => {
    // Use getFieldsValue(true) to get ALL fields, not just touched ones
    const currentFormData = form?.getFieldsValue(true);
    // Check if required service request fields are filled
    const requiredFields = [
      "type",
      "category",
      "subCategory",
      "channel",
      "priority",
      "requestSource",
      "requestDate",
    ];
    const missingFields = requiredFields.filter(
      (field) => !currentFormData?.[field],
    );

    const serializedData = {
      ...currentFormData,
      // Moment objects have toISOString() method, use it to convert to string
      requestDate:
        currentFormData?.requestDate &&
        currentFormData.requestDate._isAMomentObject
          ? currentFormData.requestDate.toISOString()
          : currentFormData?.requestDate,
    };

    navigate(
      "/account-management/account-standard/service-requests/pre-requisites/create",
      {
        state: {
          account,
          customer,
          serviceRequestData: serializedData,
          fromWizard: true,
          returnPath: window.location.pathname,
          returnToStep: currentStep || 2, // Pass the current step index (PreRequisite is step 2)
          // Pass original wizard state so it can be restored
          id: location?.state?.id,
          idAccount: location?.state?.idAccount,
          idCustomer: location?.state?.idCustomer,
          type: location?.state?.type,
        },
      },
    );
  };

  return (
    <Fragment>
      <NxPanel title={"PREREQUSITE LIST"}>
        {/* Create Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"submit"}
            onClick={handleCreateClick}
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
