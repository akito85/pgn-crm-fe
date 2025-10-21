import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import StatusComponent from "../../../../components/StatusComponent";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import ModalCustom from "../../../../components/Modal/ModalCustom";

const ModalApprovalEFaktur = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Data Dummy untuk E-Faktur yang menunggu approval
  const dummyEFakturApprovalList = [
    {
      key: 1,
      noFaktur: "INV/DRAFT/102",
      namaPelanggan: "CV Rumah Tangga Sejahtera",
      tanggalFaktur: "28 Sep 2025",
      totalTagihan: 750000,
      status: "AWAITING APPROVAL",
      calculationCode: "CLC250800000004",
      ratingCode: "RC250800009001",
      billingCode: "BC250800009003",
      saNumber: "SA/BULOG/218939812",
      alasanDitolak: "",
      items: [
        {
          key: 1,
          produkJasa: "Pemakaian Gas LPG",
          kuantitas: 50,
          hargaSatuan: 12000,
          total: 600000,
        },
        {
          key: 2,
          produkJasa: "Biaya Admin",
          kuantitas: 1,
          hargaSatuan: 150000,
          total: 150000,
        },
      ],
    },
    {
      key: 2,
      noFaktur: "INV/DRAFT/103",
      namaPelanggan: "PT Industri Sejahtera",
      tanggalFaktur: "29 Sep 2025",
      totalTagihan: 1250000,
      status: "AWAITING APPROVAL",
      calculationCode: "CLC250800000005",
      ratingCode: "RC250800009002",
      billingCode: "BC250800009004",
      saNumber: "SA/N2N/000005",
      alasanDitolak: "",
      items: [
        {
          key: 1,
          produkJasa: "Pemakaian Gas Industri",
          kuantitas: 100,
          hargaSatuan: 11000,
          total: 1100000,
        },
        {
          key: 2,
          produkJasa: "Biaya Maintenance",
          kuantitas: 1,
          hargaSatuan: 150000,
          total: 150000,
        },
      ],
    },
  ];

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [action, setAction] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Columns untuk list E-Faktur yang menunggu approval (TANPA kolom Alasan Ditolak)
  const columnsEFakturList = [
    {
      title: "NO",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CALCULATION CODE",
      dataIndex: "calculationCode",
      key: "calculationCode",
      width: 200,
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      key: "ratingCode",
      width: 200,
    },
    {
      title: "BILLING CODE",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 200,
    },
    {
      title: "SA NUMBER",
      dataIndex: "saNumber",
      key: "saNumber",
      width: 200,
    },
    {
      title: "NO FAKTUR",
      dataIndex: "noFaktur",
      key: "noFaktur",
      width: 180,
    },
    {
      title: "NAMA PELANGGAN",
      dataIndex: "namaPelanggan",
      key: "namaPelanggan",
      width: 250,
    },
    {
      title: "TANGGAL FAKTUR",
      dataIndex: "tanggalFaktur",
      key: "tanggalFaktur",
      width: 150,
    },
    {
      title: "TOTAL TAGIHAN",
      dataIndex: "totalTagihan",
      key: "totalTagihan",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 200,
      align: "center",
      render: (status) => (
        <div className="flex justify-center">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            {status}
          </span>
        </div>
      ),
    },
  ];

  // Columns untuk rincian faktur
  const columnsRincianFaktur = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Produk/Jasa",
      dataIndex: "produkJasa",
      key: "produkJasa",
      width: 300,
    },
    {
      title: "Kuantitas",
      dataIndex: "kuantitas",
      key: "kuantitas",
      width: 120,
      align: "right",
    },
    {
      title: "Harga Satuan",
      dataIndex: "hargaSatuan",
      key: "hargaSatuan",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 150,
      align: "right",
      render: (value) => `Rp ${value?.toLocaleString("id-ID")}`,
    },
  ];

  // Function Search API
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Row Selection
  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Steps
  const steps = [
    {
      title: "E-FAKTUR INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue().remark,
    },
    {
      title: "CONFIRMATION",
      disabled: false,
    },
  ];

  // Button Next
  const next = () => {
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setCurrent(current - 1);
  };

  // Scroll handlers
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    setAlasanDitolak("");
    setAction("");
    setCurrent(0);
    form.resetFields();
  };

  // Handle Save dengan validasi
  const handleSave = (formValue) => {
    // Validasi jika action REJECT tapi alasan ditolak kosong
    if (action === "REJECT" && !alasanDitolak.trim()) {
      alert("Alasan penolakan wajib diisi!");
      return;
    }

    const body = {
      eFakturCodes: dataTableSelect.map((item) => ({
        noFaktur: item.noFaktur,
        billingCode: item.billingCode,
      })),
      action: action,
      remark: formValue.remark,
      alasanDitolak: action === "REJECT" ? alasanDitolak : "",
    };

    console.log("Approval E-Faktur:", body);

    // Simulasi API call
    // dispatch(approvalEFaktur({ body: body }))
    //   .unwrap()
    //   .then(() => {
    //     handleRefresh();
    //     handleCancelForm();
    //   })
    //   .catch((error) => {
    //     if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
    //       const message =
    //         error?.response?.data?.message ||
    //         error?.message ||
    //         error?.toString();
    //       setBodyError({ message });
    //       setModalError(true);
    //     }
    //   });

    // Simulasi sukses
    setTimeout(() => {
      handleRefresh();
      handleCancelForm();
      alert(
        `${dataTableSelect.length} E-Faktur ${
          action === "APPROVE" ? "disetujui" : "ditolak"
        } berhasil!`
      );
    }, 500);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    handleOpenModal();
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave(form.getFieldsValue());
    setModalError(false);
    setBodyError({});
  };

  // Calculate totals untuk confirmation
  const calculateTotals = () => {
    let totalDpp = 0;
    dataTableSelect.forEach((efaktur) => {
      const subtotal = efaktur.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
      totalDpp += subtotal;
    });
    const ppn = totalDpp * 0.11;
    const total = totalDpp + ppn;
    return { totalDpp, ppn, total };
  };

  const totals = calculateTotals();

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="APPROVAL E-FAKTUR INFORMATION"
        handleCancel={handleCancelForm}
        width={1200}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}

            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={handleButtonNext}
                type={"submit"}
                className="ant-btn ant-btn-submit flex w-full justify-center"
                disabled={steps[current].disabled}
              >
                <span className="p-1 text-[18px] text-center">Next</span>
                <RightOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <>
                <ButtonComponent
                  type={"reject"}
                  htmlType={"submit"}
                  form={"formApprovalEFaktur"}
                  onClick={() => setAction("REJECT")}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type={"approve"}
                  htmlType={"submit"}
                  form={"formApprovalEFaktur"}
                  onClick={() => setAction("APPROVE")}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        {/* Steps */}
        <div className="flex flex-row justify-center">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
        </div>

        {/* Step 1: Billing Information */}
        <div
          className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
        >
          <Form
            layout="vertical"
            form={form}
            id={"formApprovalEFaktur"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <p className="text-primary uppercase font-bold">E-FAKTUR LIST</p>
              <TablePaginationNew
                type="FE"
                dataSource={dummyEFakturApprovalList}
                columns={columnsEFakturList}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={dummyEFakturApprovalList.length}
                tableScrolled={{ y: 525, x: 1500 }}
                rowSelection={rowSelection}
              />
              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={[
                    { required: true, message: "Please input your Remark!" },
                  ]}
                >
                  <InputComponent
                    rows={3}
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        {/* Step 2: Confirmation */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <p className="text-primary uppercase font-bold">
              SELECTED E-FAKTUR FOR APPROVAL
            </p>

            {dataTableSelect.map((efaktur, index) => (
              <div key={index} className="mb-6 p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <DetailText label="No. Faktur">{efaktur.noFaktur}</DetailText>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    <span className="inline-block px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
                      {efaktur.status}
                    </span>
                  </div>
                  <DetailText label="Nama Pelanggan">
                    {efaktur.namaPelanggan}
                  </DetailText>
                  <DetailText label="Tanggal Faktur">
                    {efaktur.tanggalFaktur}
                  </DetailText>
                  <DetailText label="Billing Code">
                    {efaktur.billingCode}
                  </DetailText>
                  <DetailText label="SA Number">
                    {efaktur.saNumber}
                  </DetailText>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Rincian Item:</p>
                  <Table
                    dataSource={efaktur.items}
                    columns={columnsRincianFaktur}
                    pagination={false}
                    size="small"
                    scroll={{ x: 700 }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 bg-white p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>
                      Rp{" "}
                      {efaktur.items
                        .reduce((sum, item) => sum + item.total, 0)
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="font-bold text-lg mb-3">Total Keseluruhan:</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total DPP:</span>
                  <span>Rp {totals.totalDpp.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">PPN (11%):</span>
                  <span>Rp {totals.ppn.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-lg">Total Tagihan:</span>
                  <span className="font-bold text-lg">
                    Rp {totals.total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-[30px]">
              <DetailText label="Remark">{form.getFieldValue().remark}</DetailText>
            </div>

            {/* Input Alasan Ditolak - selalu tampil di step konfirmasi */}
            <div className="pt-[30px] p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Alasan Penolakan (Opsional):
              </p>
              <p className="text-xs text-gray-500 mb-3">
                * Wajib diisi jika Anda memilih untuk <strong>Reject</strong> E-Faktur
              </p>
              <InputComponent
                rows={3}
                type="textarea"
                value={alasanDitolak}
                onChange={(e) => setAlasanDitolak(e.target.value)}
                placeholder="Masukkan alasan penolakan jika akan ditolak"
              />
            </div>
          </div>
        </div>
      </ModalCustom>

      {/** Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={() => handleRetry()}
        handleCancel={() => handleCloseModalError()}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">
            {`Your data was not ${
              action === "APPROVE" ? "approved" : "rejected"
            }. ${bodyError.message}.`}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalApprovalEFaktur;