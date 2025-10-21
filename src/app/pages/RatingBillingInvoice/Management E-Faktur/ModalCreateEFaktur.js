import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Table, Alert } from "antd";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import DetailText from "../../../../components/DetailText";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";

const ModalCreateEFaktur = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Data Dummy untuk Billing List
  const dummyBillingList = [
    {
      id: 1,
      billingCode: "BILL-XYZ-123",
      customerName: "PT Industri Maju",
      billingDate: "2025-09-30",
      totalAmount: 5000000,
      status: "Approved",
      items: [
        {
          productName: "Pemakaian Gas Industri",
          quantity: 500,
          unitPrice: 10000,
          total: 5000000,
        },
      ],
    },
    {
      id: 2,
      billingCode: "BILL-ABC-456",
      customerName: "PT Sejahtera Jaya",
      billingDate: "2025-09-28",
      totalAmount: 3500000,
      status: "Approved",
      items: [
        {
          productName: "Pemakaian Gas Komersial",
          quantity: 300,
          unitPrice: 11000,
          total: 3300000,
        },
        {
          productName: "Biaya Admin",
          quantity: 1,
          unitPrice: 200000,
          total: 200000,
        },
      ],
    },
    {
      id: 3,
      billingCode: "BILL-DEF-789",
      customerName: "CV Maju Bersama",
      billingDate: "2025-09-25",
      totalAmount: 2800000,
      status: "Approved",
      items: [
        {
          productName: "Pemakaian Gas LPG",
          quantity: 200,
          unitPrice: 12500,
          total: 2500000,
        },
        {
          productName: "Biaya Pengiriman",
          quantity: 1,
          unitPrice: 300000,
          total: 300000,
        },
      ],
    },
  ];

  // Declaration
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State untuk form e-Faktur (consolidated)
  const [formData, setFormData] = useState({
    idBilling: "",
    pelanggan: "",
    tanggalFaktur: "",
    tanggalJatuhTempo: "",
    items: [],
    dpp: 0,
    ppn: 0,
    totalTagihan: 0,
    catatan: "",
  });

  // Columns untuk tabel billing list
  const columnsBillingList = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Billing ID",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 150,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "Billing Date",
      dataIndex: "billingDate",
      key: "billingDate",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <ButtonComponent
          type="primary"
          size="small"
          onClick={() => handleSelectBilling(record)}
        >
          Pilih
        </ButtonComponent>
      ),
    },
  ];

  // Columns untuk tabel items faktur (READ-ONLY)
  const columnsItemsFaktur = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Produk/Jasa",
      dataIndex: "productName",
      key: "productName",
      width: 300,
    },
    {
      title: "Kuantitas",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (value) => value?.toLocaleString("id-ID"),
    },
    {
      title: "Harga Satuan",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 180,
      align: "right",
      render: (value) => (
        <span className="font-semibold text-gray-900">
          Rp {value?.toLocaleString("id-ID")}
        </span>
      ),
    },
  ];

  // Calculate totals dari items
  const calculateTotals = (items) => {
    const totalDpp = items.reduce((sum, item) => sum + item.total, 0);
    const calculatedPpn = totalDpp * 0.11; // PPN 11%
    const total = totalDpp + calculatedPpn;
    
    return { dpp: totalDpp, ppn: calculatedPpn, totalTagihan: total };
  };

  // Handle select billing
  const handleSelectBilling = (billing) => {
    setSelectedBilling(billing);
    
    // Calculate due date (30 days after billing date)
    const billingDate = new Date(billing.billingDate);
    const dueDate = new Date(billingDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const formattedDueDate = dueDate.toISOString().split('T')[0];
    
    // Prepare items dengan key
    const itemsWithKey = billing.items.map((item, index) => ({
      ...item,
      key: index,
    }));
    
    // Calculate totals
    const totals = calculateTotals(itemsWithKey);
    
    // Update form data
    setFormData({
      idBilling: billing.billingCode,
      pelanggan: billing.customerName,
      tanggalFaktur: billing.billingDate,
      tanggalJatuhTempo: formattedDueDate,
      items: itemsWithKey,
      ...totals,
      catatan: "",
    });
  };

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    form.resetFields();
    setSelectedBilling(null);
    setFormData({
      idBilling: "",
      pelanggan: "",
      tanggalFaktur: "",
      tanggalJatuhTempo: "",
      items: [],
      dpp: 0,
      ppn: 0,
      totalTagihan: 0,
      catatan: "",
    });
  };

  // Handle Save as Draft
  const handleSaveDraft = () => {
    const body = {
      billingId: selectedBilling?.id,
      ...formData,
      status: "draft",
    };
    
    console.log("Save as draft:", body);
    
    // TODO: Dispatch action
    // dispatch(saveEFakturDraft(body))
    //   .unwrap()
    //   .then(() => {
    //     handleRefresh();
    //     handleCancelForm();
    //   })
    //   .catch((error) => {
    //     setBodyError({ message: error.message, type: "saved" });
    //     setModalError(true);
    //   });
    
    alert("E-Faktur berhasil disimpan sebagai Draft!");
    handleRefresh();
    handleCancelForm();
  };

  // Handle Submit
  const handleSubmit = () => {
    // Validasi
    if (!formData.items || formData.items.length === 0) {
      setBodyError({ message: "Items faktur tidak boleh kosong", type: "created" });
      setModalError(true);
      return;
    }
    
    const body = {
      billingId: selectedBilling?.id,
      ...formData,
      status: "submitted",
    };
    
    console.log("Submit e-Faktur:", body);
    
    // TODO: Dispatch action
    // dispatch(createEFaktur(body))
    //   .unwrap()
    //   .then(() => {
    //     handleRefresh();
    //     handleCancelForm();
    //   })
    //   .catch((error) => {
    //     setBodyError({ message: error.message, type: "created" });
    //     setModalError(true);
    //   });
    
    alert("E-Faktur berhasil disimpan!");
    handleRefresh();
    handleCancelForm();
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSubmit();
    setModalError(false);
    setBodyError({});
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Buat E-Faktur Baru"
        handleCancel={handleCancelForm}
        width={1200}
        footer={
          !selectedBilling ? (
            // Footer untuk Step 1: Pilih Billing
            <div className="flex w-full justify-end">
              <ButtonComponent type="default" onClick={handleCancelForm}>
                Batal
              </ButtonComponent>
            </div>
          ) : (
            // Footer untuk Step 2: Form E-Faktur
            <div className="flex w-full justify-end gap-x-3">
              <ButtonComponent type="default" onClick={handleSaveDraft}>
                Simpan sebagai Draft
              </ButtonComponent>
              <ButtonComponent type="default" onClick={handleCancelForm}>
                Batal
              </ButtonComponent>
            </div>
          )
        }
      >
        {!selectedBilling ? (
          // Step 1: Pilih Billing
          <div className="my-[30px]">
            <Alert
              message="Pilih Billing untuk E-Faktur"
              description="Silakan pilih billing yang sudah disetujui untuk dibuat E-Faktur. Data dari billing akan otomatis terisi dan tidak dapat diedit."
              type="info"
              showIcon
              className="mb-4"
            />
            <p className="text-primary uppercase font-bold mb-4">
              Daftar Billing yang Tersedia
            </p>
            <TablePaginationNew
              type="FE"
              dataSource={dummyBillingList}
              columns={columnsBillingList}
              current={page}
              pageSize={pageSize}
              onChange={(pageChange, pageSizeChange) => {
                setPage(pageChange);
                setPageSize(pageSizeChange);
              }}
              totalData={dummyBillingList.length}
              tableScrolled={{ y: 400, x: 1000 }}
            />
          </div>
        ) : (
          // Step 2: Form E-Faktur (READ-ONLY DATA)
          <div className="my-[20px]">
            <Alert
              message="Data E-Faktur dari Billing"
              description="Data di bawah ini diambil dari billing yang dipilih dan tidak dapat diedit. Anda hanya dapat menambahkan catatan."
              type="warning"
              showIcon
              className="mb-6"
            />

            {/* Informasi Dasar Section */}
            <div className="mb-6 p-5 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ID Billing: <span className="text-gray-500 font-normal text-xs">(Read-only)</span>
                  </label>
                  <Input 
                    value={formData.idBilling} 
                    disabled 
                    className="bg-gray-100 cursor-not-allowed" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Pelanggan: <span className="text-gray-500 font-normal text-xs">(Read-only)</span>
                  </label>
                  <Input 
                    value={formData.pelanggan} 
                    disabled 
                    className="bg-gray-100 cursor-not-allowed" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Faktur: <span className="text-gray-500 font-normal text-xs">(Read-only)</span>
                  </label>
                  <Input 
                    value={formData.tanggalFaktur} 
                    disabled 
                    className="bg-gray-100 cursor-not-allowed" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal Jatuh Tempo: <span className="text-gray-500 font-normal text-xs">(Read-only)</span>
                  </label>
                  <Input 
                    value={formData.tanggalJatuhTempo} 
                    disabled 
                    className="bg-gray-100 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            {/* Rincian Item Faktur Section */}
            <div className="mb-6 p-5 bg-white border-2 border-gray-300 rounded-lg">
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
                <h3 className="text-base font-bold text-gray-800">
                  Rincian Item Faktur <span className="text-gray-500 font-normal text-sm">(Data dari Billing)</span>
                </h3>
              </div>
              
              <Table
                dataSource={formData.items}
                columns={columnsItemsFaktur}
                pagination={false}
                size="small"
                bordered
                scroll={{ x: 800 }}
                locale={{
                  emptyText: 'Tidak ada data'
                }}
              />
            </div>

            {/* Ringkasan Section */}
            <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b-2 border-blue-200">
                Ringkasan <span className="text-blue-600 font-normal text-sm">(Otomatis dari Billing)</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-white rounded">
                  <span className="text-sm font-semibold text-gray-700">
                    DPP (Dasar Pengenaan Pajak):
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Rp {formData.dpp.toLocaleString("id-ID")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 px-3 bg-white rounded">
                  <span className="text-sm font-semibold text-gray-700">
                    PPN (11%):
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Rp {formData.ppn.toLocaleString("id-ID")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-3 pb-2 px-3 border-t-2 border-blue-300 bg-blue-100 rounded">
                  <span className="text-base font-bold text-blue-900">
                    Total Tagihan:
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    Rp {formData.totalTagihan.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Catatan Section - EDITABLE */}
            <div className="mb-4 p-5 bg-white border-2 border-gray-300 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan: <span className="text-green-600 font-normal text-xs">(Dapat diedit)</span>
              </label>
              <Input.TextArea
                rows={3}
                value={formData.catatan}
                onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value }))}
                placeholder="Masukkan catatan tambahan untuk E-Faktur ini (opsional)"
                className="border-gray-300"
              />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="flex gap-3">
                <div className="text-yellow-600 text-xl">ℹ️</div>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Informasi:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Semua data diambil dari billing yang dipilih</li>
                    <li>Data tidak dapat diedit untuk menjaga integritas dengan billing</li>
                    <li>Anda hanya dapat menambahkan catatan tambahan</li>
                    <li>E-Faktur dapat disimpan sebagai Draft atau langsung Submit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalCustom>

      {/** Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText="Try Again"
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">
            Your data was not {bodyError.type}. {bodyError.message}.
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalCreateEFaktur;