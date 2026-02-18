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
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";

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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      name: "Menerbitkan BBG yang telah disetujui oleh pimpinan sales and operation regional I",
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
    {
      no: 4,
      type: "Technical",
      name: "Verifikasi Dokumen Pelanggan",
      description: "Desc",
      status: "status",
    },
    {
      no: 5,
      type: "Technical",
      name: "Pemeriksaan Kelengkapan Formulir",
      description: "Desc",
      status: "status",
    },
    {
      no: 6,
      type: "Administrative",
      name: "Validasi Data di Sistem",
      description: "Desc",
      status: "status",
    },
    {
      no: 7,
      type: "Financial",
      name: "Verifikasi Pembayaran Awal",
      description: "Desc",
      status: "status",
    },
    {
      no: 8,
      type: "Administrative",
      name: "Persetujuan dari Departemen Legal",
      description: "Desc",
      status: "status",
    },
    {
      no: 9,
      type: "Technical",
      name: "Inspeksi Lokasi Pemasangan",
      description: "Desc",
      status: "status",
    },
    {
      no: 10,
      type: "Technical",
      name: "Pemeriksaan Kesiapan Peralatan",
      description: "Desc",
      status: "status",
    },
    {
      no: 11,
      type: "Administrative",
      name: "Penerbitan Surat Izin Operasi",
      description: "Desc",
      status: "status",
    },
    {
      no: 12,
      type: "Financial",
      name: "Konfirmasi Asuransi",
      description: "Desc",
      status: "status",
    },
    {
      no: 13,
      type: "Administrative",
      name: "Penyelesaian Kontrak Kerja",
      description: "Desc",
      status: "status",
    },
    {
      no: 14,
      type: "Technical",
      name: "Kalibrasi Perangkat",
      description: "Desc",
      status: "status",
    },
    {
      no: 15,
      type: "Safety",
      name: "Pemeriksaan Keselamatan",
      description: "Desc",
      status: "status",
    },
    {
      no: 16,
      type: "Administrative",
      name: "Arsip Digital Dokumen",
      description: "Desc",
      status: "status",
    },
    {
      no: 17,
      type: "Financial",
      name: "Pembayaran Administrasi Akhir",
      description: "Desc",
      status: "status",
    },
    {
      no: 18,
      type: "Technical",
      name: "Testing Sistem Integrasi",
      description: "Desc",
      status: "status",
    },
    {
      no: 19,
      type: "Administrative",
      name: "Penandatanganan Berita Acara",
      description: "Desc",
      status: "status",
    },
    {
      no: 20,
      type: "Safety",
      name: "Sertifikasi K3",
      description: "Desc",
      status: "status",
    },
    {
      no: 21,
      type: "Administrative",
      name: "Penyerahan Dokumen ke Pelanggan",
      description: "Desc",
      status: "status",
    },
  ];


  const paginatedData = PREREQUISITE.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const columnMain = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      filter: true,
      render: (text, record, index) => {
        // If you want to show numbers considering pagination:
        // current and pageSize should be available in your component scope
        const current = 1; // Replace with actual current page from state
        const pageSize = 10; // Replace with actual pageSize
        
        // With pagination:
        // return (current - 1) * pageSize + index + 1;
        
        // Without pagination (just sequential):
        return index + 1;
      },
      fixed: "left"
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      fixed: "left"
    },
    {
      title: "PREREQUISITE NAME",
      dataIndex: "name",
      key: "name",
      filter: true,
      align: 'left',
      ellipsis: { maxChars: 50 },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "STATUS0",
      dataIndex: "status0",
      key: "status",
    },
    {
      title: "STATUS1",
      dataIndex: "status1",
      key: "status",
    },    {
      title: "STATUS2",
      dataIndex: "status2",
      key: "status",
    },    {
      title: "STATUS3",
      dataIndex: "status3",
      key: "status",
    },    {
      title: "STATUS4",
      dataIndex: "status4",
      key: "status",
    },    {
      title: "STATUS5",
      dataIndex: "status5",
      key: "status",
    },    {
      title: "STATUS6",
      dataIndex: "status6",
      key: "status",
      fixed: "right"
    },    {
      title: "ACTIONS",
      key: "actions",
      width: 150,
      fixed: "right",
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

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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
      <NxCardContainer header={"PREREQUISITE LIST"}>
        <NxBaseContainer border>
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
          dataMain={paginatedData}
          totalData={PREREQUISITE.length}
          current={page}
          pageSize={pageSize}
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
          onChange={handleChange}
          getCheckboxProps={(record) => ({
            disabled: record.status === "Inactive",
          })}
          border="true"
        />
        </NxBaseContainer>
      </NxCardContainer>

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
