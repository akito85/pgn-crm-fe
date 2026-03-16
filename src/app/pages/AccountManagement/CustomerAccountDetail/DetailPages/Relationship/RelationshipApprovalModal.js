import { useRef, useState, useEffect, useMemo, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import NxTable from "../../../../../../components/Nx/NxTable";
import {
  getRelationshipApprovalList,
  approveOrRejectRelationship,
  approveOrRejectInactiveRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";
import TablePagination from "../../../../../../components/TablePagination";

// Nested columns configuration for expandable rows
const NESTED_COLUMNS = [
  {
    title: "NO",
    align: "center",
    width: 60,
    render: (text, object, index) => (
      <div style={{ padding: "8px 0" }}>{index + 1}</div>
    ),
  },
  {
    title: "ACCOUNT NUMBER",
    dataIndex: "accountNumber",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT NAME",
    dataIndex: "accountName",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "ACCOUNT CATEGORY",
    dataIndex: "accountCategory",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
  {
    title: "METER READING CODE",
    dataIndex: "meterReadingCode",
    align: "left",
    render: (text) => <div style={{ padding: "8px 16px" }}>{text || "-"}</div>,
  },
];

// Expandable row renderer
const expandedRowRender = (record) => {
  const relatedDetailData = record?.relatedDetail || [];

  return (
    <div className="bg-blue-50 -mx-2 pl-6 py-2">
      <h4 className="text-[#0075bf] font-semibold text-sm my-2">RELATED DETAIL</h4>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={relatedDetailData}
        columns={NESTED_COLUMNS}
        className="related-detail-nested-table"
      />
    </div>
  );
};

const RelationshipApprovalModal = ({
  idAccount = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  // Selector
  const { list_relationship, pagination_relationship, loading_listRelationshipApproval, loading_approveRejectRelationship } = useSelector(
    (state) => state.relationship
  );

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [approvalData, setApprovalData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [tempFilters, setTempFilters] = useState([]);

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [],
  });

  // Initial fetch - Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      const body = {
        inputFields: tempFilters,
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
      };

      dispatch(
        getRelationshipApprovalList({
          idAccount,
          page,
          pageSize: loadMoreSize,
          sort,
          body,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort]);

  // Update approval data when list changes
  useEffect(() => {
    if (isOpen) {
      setApprovalData(list_relationship);
    }
  }, [list_relationship, isOpen]);

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

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_relationship?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        inputFields: tempFilters,
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
      };

      dispatch(
        getRelationshipApprovalList({
          idAccount,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          body,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore = approvalData.length < (pagination_relationship?.totalElements || 0);

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setSelectedRowKeys([...newSelectedRowKeys]);
      setSelectedRows(newSelectedRows.map((newSelectedRow) => ({ ...newSelectedRow })));
    },
    preserveSelectedRowKeys: true,
  };

  // Step
  const steps = [
    {
      title: "RELATIONSHIP",
    },
    {
      title: "CONFIRMATION",
    },
  ];

  const formFields = [["remark"]];

  // Button Next
  const next = async () => {
    try {
      if (current === 0) {
        if (!selectedRowKeys.length) {
          const errorBody = {
            title: "Failed",
            description: `Please select at least one record`,
          };
          dispatch(showModalError(errorBody));

          throw new Error("No record was selected");
        } else {
          await form.validateFields([formFields[current]]);
          setCurrent((prev) => prev + 1);
        }
      } else {
        form.validateFields([formFields[current]]);
      }
    } catch {}
  };

  // Button Previous
  const prev = () => {
    setCurrent((prev) => prev - 1);
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

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
  };

  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();

      const regularBody = selectedRows
        .filter((row) => row.approvalType === "RELATIONSHIP")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId || row.approvalId,
          action,
          description: values.remark,
        }));

      const inactiveBody = selectedRows
        .filter((row) => row.approvalType === "INACTIVE_RELATIONSHIP")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId || row.approvalId,
          action,
          description: values.remark,
        }));

      const promises = [];

      if (regularBody.length > 0) {
        promises.push(
          dispatch(
            approveOrRejectRelationship({
              idAccount,
              body: regularBody,
              action,
            })
          ).unwrap()
        );
      }

      if (inactiveBody.length > 0) {
        promises.push(
          dispatch(
            approveOrRejectInactiveRelationship({
              idAccount,
              body: inactiveBody,
              action,
            })
          ).unwrap()
        );
      }

      Promise.all(promises)
        .then(() => {
          afterFinish();
          setCurrent(0);
          form.resetFields();
          handleCancel();
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setSearch({});
          setPage(1);
          setSort("");
          setSearchText("");
          setSearchedColumn("");
        })
        .catch(() => {});
    } catch {}
  };

  const baseColumns = useMemo(
    () =>
      getRelationshipColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
    [page, loadMoreSize, searchedColumn, searchText]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const dataSourceWithKeys = useMemo(() => {
    return approvalData?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [approvalData]);

  return (
    <Fragment>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL RELATIONSHIP INFORMATION"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        footer={
          <div className="flex justify-between">
            <Button type={"menu"} onClick={handleCancelForm}>
              Cancel
            </Button>

            <div className="flex">
              <Button
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"default"}
                disabled={current < 1}
              >
                Previous
              </Button>

              {current < steps.length - 1 && (
                <Button
                  onClick={() => handleButtonNext()}
                  type={"submit"}
                  disabled={current > steps.length - 1 || steps[current].disabled}
                >
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <>
                  <Button
                    type={"reject"}
                    onClick={() => handleSave("REJECT")}
                    loading={loading_approveRejectRelationship}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    loading={loading_approveRejectRelationship}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <NxBaseContainer
          border={{
            top: false,
            right: false,
            left: false,
          }}
          rounded={false}
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
        </NxBaseContainer>

        <div className="p-4">
          {/* STEP 1: RELATIONSHIP INFORMATION */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer border header={"Relationship List - Ready to Approve"}>
                  <NxTable
                    idTable="relationship-approval-table"
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    totalData={pagination_relationship?.totalElements || 0}
                    tableScrolled={{
                      x: dataSourceWithKeys.length ? "max-content" : 2000,
                    }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_listRelationshipApproval}
                    showExport={false}
                    rowSelection={rowSelection}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadMoreThreshold={20}
                    expandable={{
                      expandedRowRender,
                      rowExpandable: (record) =>
                        record?.relatedDetail && record.relatedDetail.length > 0,
                    }}
                  />
                  <Form.Item
                    key="remark"
                    label={"Remark"}
                    name={"remark"}
                    rules={[{ required: true, message: "Please input your Remark!" }]}
                    className="no-margin-form"
                  >
                    <InputComponent
                      rows={1}
                      type="textarea"
                      placeholder={"Type your remark for approval/rejection"}
                    />
                  </Form.Item>
                </NxBaseContainer>
              </div>
            </Form>
          </div>

          {/* STEP 2: CONFIRMATION */}
          <div className={`steps-content ${current !== 1 ? "hidden" : ""}`}>
            <NxBaseContainer border header={"Confirmation"}>
              <div className="flex flex-col gap-y-4">
                <NxTable
                  idTable="relationship-approval-confirm-table"
                  dataSource={selectedRows}
                  columns={processedColumns}
                  totalData={selectedRows.length}
                  tableScrolled={{
                    x: selectedRows.length ? "max-content" : 2000,
                  }}
                  onSort={onSort}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  loading={false}
                  usePagination={false}
                  useInfiniteScroll={false}
                  expandable={{
                    expandedRowRender,
                    rowExpandable: (record) =>
                      record?.relatedDetail && record.relatedDetail.length > 0,
                  }}
                />
                <DetailText label={"Remark"} className="flex flex-col gap-y-2">
                  {form.getFieldValue().remark}
                </DetailText>
              </div>
            </NxBaseContainer>
          </div>
        </div>
      </NxModal>
    </Fragment>
  );
};

export default RelationshipApprovalModal;
