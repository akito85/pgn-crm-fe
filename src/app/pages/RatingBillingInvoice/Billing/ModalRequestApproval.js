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
  resetBillingRequestData,
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
    loadingRequest,
  } = useSelector((state) => state.billing);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = data_list_billing_request_approval?.result || [];

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [remark, setRemark] = useState("");

  const [boolean, setBoolean] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: [],
    right: [],
  });

  // Use Effect - Fetch approval list sekali saja
  useEffect(() => {
    dispatch(getAllApprovalList());
  }, [dispatch]);

  // Use Effect - Fetch billing request setiap ada perubahan search/sort
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllBillingRequestPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        }),
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort]);

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
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const initialPageSize = 100;

  const handleLoadMore = async () => {
    const totalElements = data_list_billing_request_approval?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) return;

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAllBillingRequestPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      }),
    );
    setPage(nextPage);
  };

  const hasMore =
    (dataSource?.length || 0) <
    (data_list_billing_request_approval?.page?.totalElements || 0);

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const scrollLeftHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 250;
  };

  const scrollRightHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 250;
  };

  const handleScroll = () => {
    if (containerRef.current) setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  const handleCancelForm = () => {
    handleCancel();
    dispatch(resetBillingRequestData());
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setDataTable([]);
    setBoolean(false);
    setRemark("");
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
    // Reset data request approval di Redux agar modal selanjutnya mulai fresh
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
      apphierId: formValue.apphierId,
      billCode: dataTableSelect.map((a) => a.billCode),
      remark: formValue.remark,
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
        setSearch({});
        setPage(1);
        setSort("");
        setSearchText("");
        setSearchedColumn("");
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

  const baseColumns = useMemo(
    () =>
      columnsRequestBilling(
        0,
        0,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
      ),
    [searchedColumn, searchText, handleSearch, search],
  );

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
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

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      // PERUBAHAN: Gunakan billCode sebagai row key
      // billCode bisa null pada data Adjustment, fallback ke billHeaderId
      key: item.billCode ?? item.billHeaderId,
    }));
  }, [dataSource]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Request Approval"
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-between items-center">
            {/* Kiri: Tombol Cancel */}
            <div>
              {current < steps.length - 1 && (
                <ButtonComponent type={"default"} onClick={handleCancelForm}>
                  Cancel
                </ButtonComponent>
              )}
            </div>

            {/* Kanan: Tombol Previous, Next, Confirm */}
            <div className="flex gap-x-3">
              {current > 0 && (
                <ButtonComponent
                  onClick={() => {
                    prev();
                    scrollLeftHandler();
                  }}
                  type={"default"}
                >
                  Previous
                </ButtonComponent>
              )}
              {current < steps.length - 1 && (
                <ButtonComponent
                  onClick={handleButtonNext}
                  type={"submit"}
                  disabled={steps[current].disabled}
                >
                  Next
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
            className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
          >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <div className="flex gap-2 justify-between">
                <p className="text-primary uppercase font-bold mb-4">
                  Billing List
                </p>
                {selectedRowKeys.length > 0 && (
                  <p className="text-sm font-semibold text-blue-600">
                    {selectedRowKeys.length}{" "}
                    {selectedRowKeys.length === 1 ? "row" : "rows"} selected
                  </p>
                )}
              </div>
              <TableRBI
                idTable="billing-request-table"
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                totalData={
                  data_list_billing_request_approval?.page?.totalElements || 0
                }
                tableScrolled={{ y: 525, x: 2000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loadingRequest}
                showExport={false}
                rowSelection={rowSelection}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
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
            className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
          >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                Approval Information
              </p>

              {/* Dropdown Approval Hierarchy sebagai Form.Item */}
              <div className="w-1/3 mb-6">
                <Form.Item
                  label="Approval Hierarchy"
                  name="apphierId"
                  rules={[
                    {
                      required: true,
                      message: "Please select Approval Hierarchy!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      handleSelect(value);
                    }}
                    placeholder="Select approval hierarchy"
                    loading={loadingRequest}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {data_approval?.map((data) => (
                      <Select.Option
                        value={data.appHierId}
                        key={data.appHierId}
                      >
                        {data.approvalName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Tabel Approval muncul setelah hierarchy dipilih */}
              {boolean && dataTable.length > 0 && (
                <TableRBI
                  dataSource={dataTable}
                  columns={columnsApproval(
                    1,
                    dataTable.length,
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
                            1,
                            record?.employeeDetail?.length || 0,
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
                  useSelect={false}
                  usePagination={false}
                  loading={loadingRequest}
                />
              )}
            </div>
          </div>
          {/* STEP 3: CONFIRMATION */}
          <div
            className={`steps-content my-[30px] ${current !== 2 ? "hidden" : ""}`}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                Billing List
              </p>
              <TableRBI
                dataSource={dataTableSelect}
                columns={processedColumns}
                totalData={dataTableSelect.length || 0}
                tableScrolled={{ y: 525, x: 15000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={false}
                usePagination={false}
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
                      1,
                      dataTable.length,
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
                              1,
                              record?.employeeDetail?.length || 0,
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
