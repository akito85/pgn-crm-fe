import { useRef, useState, useEffect, useMemo, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import DetailText from "../../../../../../../components/DetailText";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { approveOrRejectAllInvoiceRelation, getInvoiceRelationApproval } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getInvoiceRelationColumns } from "./getInvoiceRelationColumns";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../components/Nx/NxModal";

const InvoiceRelationApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  // Selector
  const { list_invoiceRelationApproval: invoiceRelationApprovals, pagination_invoiceRelationApproval: pagination, loading_listIrApproval, loading_approveRejectIr } = useSelector(
    (state) => state.financialInformation
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [tempFilters, setTempFilters] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filterRules, setFilterRules] = useState([]);

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: []
  });

  // Initial fetch - Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      const body = {
        page: 0,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      }

      dispatch(
        getInvoiceRelationApproval({
          id,
          body,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort]);

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
    const totalPage = pagination.totalPage || 0;

    // Check if there's more data to load
    if (nextPage <= totalPage) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      }

      dispatch(
        getInvoiceRelationApproval({
          id,
          body,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const totalElement = pagination.totalElement;
  const hasMore = invoiceRelationApprovals.length < totalElement;

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
      setSelectedRows(newSelectedRows.map(newSelectedRow => ({...newSelectedRow})));
    },
    preserveSelectedRowKeys: true,
  };

  // Step
  const steps = [
    {
      title: "INVOICE RELATION",
    },
    {
      title: "CONFIRMATION",
    },
  ];

  const formFields = [
    [
      "remark",
    ],
  ];

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
          setCurrent(prev => prev + 1);
        }
      } else {
        form.validateFields([formFields[current]])
      }
    } catch {

    }
  };

  // Button Previous
  const prev = () => {
    setCurrent(prev => prev - 1);
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
      
      const body = selectedRows.filter(row => row.approvalType === "INVOICE_RELATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }));
  
      const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_INVOICE_RELATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }))

      dispatch(
        approveOrRejectAllInvoiceRelation({
          body,
          inactiveBody,
          action: action === "APPROVE" ? "approved" : "rejected",
        })
      )
      .unwrap()
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
      .catch((error) => {})
    } catch {

    }
  };

  const columnDefinitions = useMemo(
    () =>
      getInvoiceRelationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
    [page, loadMoreSize, searchedColumn, searchText]
  );

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <Fragment>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL INVOICE RELATTION INFORMATION"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        footer={
          <div className="flex justify-between">
            <Button type={"default"} onClick={handleCancelForm}>
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

              { current < steps.length - 1 && (
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
                    loading={loading_approveRejectIr}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    loading={loading_approveRejectIr}
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
          {/* STEP 1: INVOICE RELATION INFORMATION */}
          <div
            className={`steps-content ${current !== 0 ? "hidden" : ""}`}
          >
            <Form
              layout="vertical"
              form={form}
              id={"formApprove"}
            >
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer
                  border
                  header={"Invoice Relation List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={invoiceRelationApprovals}
                    columns={columns}
                    totalData={totalElement}
                    tableScrolled={{ x: "max-content" }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_listIrApproval}
                    showExport={false}
                    rowSelection={rowSelection}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadMoreThreshold={20}
                  />
                  <Form.Item
                    key="remark"
                    label={"Remark"}
                    name={"remark"}
                    rules={[
                      { required: true, message: "Please input your Remark!" },
                    ]}
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
          <div
            className={`steps-content ${current !== 1 ? "hidden" : ""}`}
          >
            <NxBaseContainer
              border
              header={"Confirmation"}
            >
              <div className="flex flex-col gap-y-4">

                <NxTable
                  dataSource={selectedRows}
                  columns={columns}
                  totalData={totalElement}
                  tableScrolled={{ x: "max-content" }}
                  onSort={onSort}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  loading={false}
                  usePagination={false}
                  useInfiniteScroll={false}
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

export default InvoiceRelationApprovalModal;
