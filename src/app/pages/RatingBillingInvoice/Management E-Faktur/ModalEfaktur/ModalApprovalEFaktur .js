import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import {
  approvedEfaktur,
  getAllEFakturApprovePaginate,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ModalApprovalEFaktur = ({
   isOpen,
  handleClose,           
  onSuccess,      
  billingData,  
}) => {
  // Selector
  const { list_efaktur_approval, loading_modal } = useSelector((state) => state.efaktur);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = list_efaktur_approval;

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Use Effect
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllEFakturApprovePaginate());
    }
  }, [dispatch, isOpen]);

  // Function Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sort) => {
    // Implement if needed
  };

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
    },
  ];

  // Navigation
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  // Scroll Handlers
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

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Cancel Form
  const handleCancelForm = () => {
  handleClose();  // Dulu: handleCancel()
  setSelectedRowKeys([]);
  setDataTableSelect([]);
  setRemark("");
  setAction("");
  setCurrent(0);
  form.resetFields();
};

  // Handle Save
  // Handle Save
  const handleSave = (formValue) => {
    // Pastikan data yang dipilih valid
    if (!dataTableSelect || dataTableSelect.length === 0) {
      setBodyError({ message: "Tidak ada E-Faktur yang dipilih" });
      setModalError(true);
      return;
    }

    // Validasi setiap item memiliki tappId dan efakturId
    const invalidItems = dataTableSelect.filter(
      (item) => !item.tappId || !item.efakturId
    );

    if (invalidItems.length > 0) {
      setBodyError({
        message: "Beberapa E-Faktur tidak memiliki data approval yang lengkap",
      });
      setModalError(true);
      return;
    }

    const detailApproves = dataTableSelect.map((item) => ({
      approvalId: Number(item.tappId), // Pastikan berupa number
      efakturId: Number(item.efakturId), // Pastikan berupa number
    }));

    const body = {
      detailApproves: detailApproves,
      action: action,
      description: remark,
    };

    dispatch(
      approvedEfaktur({
        body: { ...body, billingCode: "" },
        action: action === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        onSuccess();
        setCurrent(0);
        form.resetFields();
        setRemark("");
        setAction("");
        handleClose();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
      })
      .catch((error) => {
        const message =
          error?.message ||
          error?.toString() ||
          "Terjadi kesalahan saat memproses approval";
        setBodyError({ message });
        setModalError(true);
      });
  };

  const handleCloseModalError = () => {
  setModalError(false);
  handleClose(); 
  setBodyError({});
};

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  const filterDataByPage = (type = "data") => {
    let result = [...dataSource].map((a, index) => ({
      ...a,
      key: index + 1,
    }));
    return type === "data" ? result : result.length;
  };

  // Columns Definition
  const columnsApprovalEFaktur = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  ) => {
    return [
      {
        title: "NO",
        dataIndex: "no",
        key: "no",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NO. E-FAKTUR",
        dataIndex: "efakturNo",
        key: "efakturNo",
        width: 180,
        render: (text) => text || "-",
      },
      {
        title: "INVOICE NUMBER",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 180,
      },
      {
        title: "BILLING CODE",
        dataIndex: "billingCode",
        key: "billingCode",
        width: 180,
      },
      {
        title: "CUSTOMER",
        dataIndex: "customerName",
        key: "customerName",
        width: 250,
      },
      {
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        key: "accountNumber",
        width: 150,
      },
      {
        title: "BILLING PERIOD",
        dataIndex: "billingPeriod",
        key: "billingPeriod",
        width: 120,
      },
      {
        title: "INVOICE DATE",
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        width: 120,
        render: (text) => {
          if (!text) return "-";
          const date = new Date(text);
          return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        title: "TOTAL AMOUNT (IDR)",
        dataIndex: "totalAmountEqvIdr",
        key: "totalAmountEqvIdr",
        width: 180,
        align: "right",
        render: (value) => `Rp ${value?.toLocaleString("id-ID") || 0}`,
      },
      {
        title: "STATUS E-FAKTUR",
        dataIndex: "efakturStatus",
        key: "efakturStatus",
        width: 180,
        align: "center",
        render: (status) => {
          const statusColors = {
            APPROVED: "bg-green-100 text-green-800 border-green-300",
            SUCCESS: "bg-green-100 text-green-800 border-green-300",
            PROCESSING: "bg-blue-100 text-blue-800 border-blue-300",
            AWAITING_APPROVAL: "bg-orange-100 text-orange-800 border-orange-300",
            FAILED: "bg-red-100 text-red-800 border-red-300",
            REJECTED: "bg-red-100 text-red-800 border-red-300",
          };

          return (
            <div className="flex justify-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  statusColors[status] ||
                  "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {status?.replace(/_/g, " ")}
              </span>
            </div>
          );
        },
      },
      {
        title: "REMARK",
        dataIndex: "remark",
        key: "remark",
        width: 200,
        render: (text) => text || "-",
      },
    ];
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="Approval E-Faktur"
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
                  form={"formApproveEFaktur"}
                  onClick={() => setAction("REJECT")}
                  loading={loading_modal}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type={"approve"}
                  htmlType={"submit"}
                  form={"formApproveEFaktur"}
                  onClick={() => setAction("APPROVE")}
                  loading={loading_modal}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <div className="flex flex-row justify-center">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
        </div>

        {/* STEP 1: E-FAKTUR INFORMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
        >
          <Form
            layout="vertical"
            form={form}
            id={"formApproveEFaktur"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <p className="text-primary uppercase font-bold">
                E-Faktur List - Ready to Approve
              </p>
              <TablePaginationNew
                type="FE"
                dataSource={filterDataByPage("data")}
                columns={columnsApprovalEFaktur(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                )}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={filterDataByPage("length")}
                onSort={onSort}
                tableScrolled={{ y: 525, x: 2000 }}
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
                    placeholder={"Type your remark for approval/rejection"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        {/* STEP 2: CONFIRMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <p className="text-primary uppercase font-bold">
              Review - E-Faktur yang Akan Di-
              {action === "APPROVE" ? "Approve" : "Reject"}
            </p>
            <TablePaginationNew
              type="FE"
              dataSource={dataTableSelect}
              columns={columnsApprovalEFaktur(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={dataTableSelect.length || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 2000 }}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            action === "APPROVE" ? "approved" : "rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalApprovalEFaktur;