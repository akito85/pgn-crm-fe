import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select, Checkbox } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import InputComponent from "../../../../components/InputComponent";
import { columnsRequestBilling } from "./Table/TableRequestBilling";
import {
  getAllApprovalList,
  getAllBillingRequestPaginate,
  getListApprovalById,
  requestedBilling,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import {
  columnsApproval,
  columnsExpandApproval,
} from "./Detail/Table/TableApproval";
import DetailText from "../../../../components/DetailText";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";
import TableRBI from "../../../../components/TableRBI";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const ModalRequestApproval = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Selector
  const {
    data_approval,
    data_approval_list,
    data_list_billing_request_approval,
    loading,
  } = useSelector((state) => state.billing);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = data_list_billing_request_approval;

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [remark, setRemark] = useState("");

  const [boolean, setBoolean] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
  });

  // Use Effect
  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getAllBillingRequestPaginate());
  }, [dispatch]);

  useEffect(() => {
    if (boolean === true) {
      if (data_approval_list && data_approval_list.length > 0) {
        const data = data_approval_list?.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: a.employeeDetail.map((b, index) => ({
            ...b,
            key: index + 1,
          })),
        }));
        setDataTable(data);
      }
    }
  }, [data_approval_list, boolean]);

  // Function Search API
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
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
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

  // Step - 3 steps
  const steps = [
    {
      title: "BILLING INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue().remark,
    },
    {
      title: "APPROVAL INFORMATION",
      disabled: !form.getFieldValue().apphierId,
    },
    {
      title: "CONFIRMATION",
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

  // Scroll Left Handler
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  // Scroll Right Handler
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  // Scroll Handler
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  // Handle Next
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setDataTable([]);
    setBoolean(false);
    setRemark("");
    setCurrent(0);
    form.resetFields();
  };

  const handleCloseModalError = () => {
    setModalError(false);
    handleOpenModal();
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  // Handle Save for Modal Confirmation
  const handleSave = (formValue) => {
    handleCancel();

    const body = {
      ...formValue,
      billingCodes: dataTableSelect.map((a) => a.billingCode),
      generateInvoice: generateInvoice,
    };

    dispatch(requestedBilling({ body: body }))
      .unwrap()
      .then(() => {
        handleRefresh();
        handleCancel();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
        setDataTable([]);
        setBoolean(false);
        setRemark("");
        setCurrent(0);
        form.resetFields();
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message, type: "requested" });
          setModalError(true);
        }
      });
  };

  const filterDataByPage = (type = "data") => {
    let result = [...dataSource].map((a, index) => ({
      ...a,
      key: index + 1,
    }));
    return type === "data" ? result : result.length;
  };

  const baseColumns = useMemo(
    () =>
      columnsRequestBilling(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [page, pageSize, searchedColumn, searchText],
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Request Approval"
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-x-5">
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
                onClick={() => {
                  handleButtonNext();
                }}
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
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                form={"formRequest"}
              >
                Confirm
              </ButtonComponent>
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

        <Form
          layout="vertical"
          form={form}
          id={"formRequest"}
          onFinish={handleSave}
        >
          {/* STEP 1: BILLING INFORMATION */}
          <div
            className={`steps-content my-[30px] ${
              current !== 0 ? "hidden" : ""
            }`}
          >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                Billing List
              </p>
              <TableRBI
                dataSource={filterDataByPage("data")}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={filterDataByPage("length")}
                tableScrolled={{ y: 525, x: 15000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                rowSelection={rowSelection}
              />
              <div className="pt-[30px]">
                <Form.Item name={"generateInvoice"}>
                  <Checkbox
                    onChange={(e) => setGenerateInvoice(e.target.checked)}
                  >
                    Generate Invoice
                  </Checkbox>
                  <p className="text-[#4B465C] text-[8px]">
                    Click or tap this checkbox to automatically generate invoice
                  </p>
                </Form.Item>
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={[
                    { required: true, message: "Please input your Remark!" },
                  ]}
                >
                  <InputComponent
                    rows={1}
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP 2: APPROVAL INFORMATION */}
          <div
            className={`steps-content my-[30px] ${
              current !== 1 ? "hidden" : ""
            }`}
          >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                Approval Information
              </p>

              {/* Hidden Form.Item untuk validasi */}
              <Form.Item
                name="apphierId"
                hidden
                rules={[
                  {
                    required: true,
                    message: "Please input your Approval Hierarchy!",
                  },
                ]}
              >
                <input type="hidden" />
              </Form.Item>

              {/* Tabel dengan Dropdown di Header */}
              <TableRBI
                dataSource={dataTable}
                columns={columnsApproval(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                )}
                expandable={{
                  expandedRowRender: (record) => (
                    <div>
                      <p className="text-primary text-xs font-bold uppercase pt-4">
                        EMPLOYEE INFORMATION
                      </p>
                      <TableRBI
                        dataSource={record?.employeeDetail || []}
                        columns={columnsExpandApproval(
                          page,
                          pageSize,
                          searchInput,
                          searchedColumn,
                          searchText,
                          handleSearch,
                        )}
                        className={"mb-4"}
                        useSelect={false}
                        usePagination={false}
                      />
                    </div>
                  ),
                }}
                usePagination={false}
                loading={loading}
                // Custom Header Left - Select dengan inline styles
                customHeaderLeft={
                  <div style={{ position: "relative" }}>
                    <style>{`
            .approval-hierarchy-select .ant-select-selector {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              border: 1px solid #BDBDBD !important;
              height: 40px !important;
              color: black !important;
              border-radius: 6px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              padding: 0 11px !important;
              background: white !important;
            }
            .approval-hierarchy-select .ant-select-selection-placeholder {
              color: rgba(0, 0, 0, 0.25) !important;
              line-height: 40px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
            }
            .approval-hierarchy-select .ant-select-selection-item {
              line-height: 40px !important;
              font-size: 14px !important;
              font-weight: 500 !important;
              color: black !important;
            }
            .approval-hierarchy-select .ant-select-arrow {
              color: black !important;
              font-size: 12px !important;
            }
            .approval-hierarchy-select:not(.ant-select-disabled):hover .ant-select-selector {
              border-color: #BDBDBD !important;
            }
            .approval-hierarchy-select.ant-select-focused .ant-select-selector {
              border-color: #40a9ff !important;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
            }
          `}</style>
                    <Select
                      value={form.getFieldValue("apphierId")}
                      onChange={(value) => {
                        form.setFieldsValue({ apphierId: value });
                        handleSelect(value);
                      }}
                      placeholder="Approval Hierarchy"
                      suffixIcon={<DownOutlined style={{ fontSize: "12px" }} />}
                      style={{ minWidth: 200 }}
                      className="approval-hierarchy-select"
                    >
                      {data_approval?.map((data, index) => (
                        <Select.Option value={data.appHierId} key={index}>
                          {data.approvalName}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                }
              />
            </div>
          </div>
          {/* STEP 3: CONFIRMATION */}
          <div
            className={`steps-content my-[30px] ${
              current !== 2 ? "hidden" : ""
            }`}
          >
            {/* Billing Information Review */}
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                Billing List
              </p>
              <TableRBI
                dataSource={dataTableSelect}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={dataTableSelect.length || 0}
                tableScrolled={{ y: 525, x: 15000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={false}
              />
              <div className="pt-[30px]">
                <DetailText label={"Generate Invoice"}>
                  {generateInvoice === false ? "No" : "Yes"}
                </DetailText>
                <DetailText label={"Remark"}>
                  {form.getFieldValue().remark}
                </DetailText>
              </div>
            </div>

            {/* Approval Information Review */}
            <div className="w-full grid grid-cols-1 gap-x-4 border-t pt-8">
              <p className="text-primary uppercase font-bold">
                Approval Information
              </p>

              <div className="w-full grid grid-cols-1 gap-2">
                <div className="w-1/3">
                  <DetailText label={"Approval Hierarchy"}>
                    {
                      data_approval
                        ?.filter(
                          (a) => a.appHierId === form.getFieldValue().apphierId,
                        )
                        ?.find((b) => b.approvalName)?.approvalName
                    }
                  </DetailText>
                </div>
              </div>

              <div className="w-full">
                {boolean === true ? (
                  <TablePaginationNew
                    type="FE"
                    dataSource={
                      data_approval_list && data_approval_list.length === 0
                        ? null
                        : dataTable
                    }
                    columns={columnsApproval(
                      page,
                      pageSize,
                      searchInput,
                      searchedColumn,
                      searchText,
                      handleSearch,
                    )}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div>
                          <p className="text-primary text-xs font-bold uppercase pt-4">
                            EMPLOYEE INFORMATION
                          </p>
                          <TablePaginationNew
                            type="FE"
                            useSelect={false}
                            usePagination={false}
                            dataSource={record?.employeeDetail}
                            columns={columnsExpandApproval(
                              page,
                              pageSize,
                              searchInput,
                              searchedColumn,
                              searchText,
                              handleSearch,
                            )}
                            className={"mb-4"}
                          />
                        </div>
                      ),
                    }}
                    useSelect={false}
                    usePagination={false}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {bodyError.type === "inactivate"
              ? IconModal["icon_error_inactivate"]
              : IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${bodyError.type}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalRequestApproval;
