import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import DetailText from "../../../../../../../components/DetailText";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { approveOrRejectAllPaymentRelation, getPaymentRelationApproval } from "../../../../../../../redux/slices/account_management/detailAccount/PaymentRelationSlice";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getPaymentRelationColumns } from "./getPaymentRelationColumns";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../../../../components/Nx/NxFormStepNavigation";
import SVGIcon from "../../../../../../../assets/Icon/index";

const PaymentRelationApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  // Selector
  const { list_paymentRelationApproval, pagination_paymentRelationApproval, loading_listPrApproval, loading_approvePr, loading_rejectPr } = useSelector(
    (state) => state.paymentRelation
  );

  const loadingApproval = loading_approvePr || loading_rejectPr;

  // Declaration
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = list_paymentRelationApproval;

  // State
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20); 
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      }

      dispatch(
        getPaymentRelationApproval({
          id,
          body,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort, filters, filterRules]);

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
    const totalPages = pagination_paymentRelationApproval?.totalPage || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      }

      dispatch(
        getPaymentRelationApproval({
          id,
          body,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataSource.length < (pagination_paymentRelationApproval?.totalElement || 0);

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
    { key: "pr", title: "PAYMENT RELATION" },
    { key: "prc", title: "CONFIRMATION" },
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

  // Handle Next
  const handleButtonNext = () => {
    next();
  };

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

  const resetForm = () => {
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
  };

  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();

      const body = selectedRows.filter(row => row.approvalType === "PAYMENT_RELATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }));

      const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_PAYMENT_RELATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }));

      dispatch(
        approveOrRejectAllPaymentRelation({
          body,
          inactiveBody,
          action: action === "APPROVE" ? "approved" : "rejected",
        })
      )
      .unwrap()
      .then(() => {
        resetForm();
      })
      .catch((error) => {});
    } catch {

    }
  };

  const columnDefinitions = useMemo(
    () =>
      getPaymentRelationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
    [search, searchInput, searchedColumn, searchText]
  );

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL PAYMENT RELATION INFORMATION"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        loading={loadingApproval}
        footer={
          <div className="flex justify-between">
            <Button type={"menu"} onClick={handleCancelForm} disabled={loadingApproval}>
              Cancel
            </Button>

            <div className="flex">
              <Button
                onClick={() => {
                  prev();
                }}
                type={"menu"}
                disabled={current < 1 || loadingApproval}
              >
                Previous
              </Button>

              {current < steps.length - 1 && (
                <Button
                  onClick={() => handleButtonNext()}
                  type={"submit"}
                  disabled={current > steps.length - 1 || steps[current].disabled || loadingApproval}
                >
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <>
                  <Button
                    type={"reject"}
                    onClick={() => handleSave("REJECT")}
                    icon={<SVGIcon width={14} height={14} name="IconSquareX" />}
                    className="flex-row-reverse"
                    disabled={!loading_rejectPr && loadingApproval}
                    loading={loading_rejectPr}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                    className="flex-row-reverse"
                    disabled={!loading_approvePr && loadingApproval}
                    loading={loading_approvePr}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <NxFormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={handleButtonNext}
          inModal
        />

        <div className="p-4">
          {/* STEP 1: PAYMENT RELATION INFORMATION */}
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
                  header={"Payment Relation List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={dataSource}
                    columns={columns}
                    totalData={pagination_paymentRelationApproval?.totalElement || 0}
                    tableScrolled={{ x: dataSource.length ? "max-content" : 1200 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_listPrApproval}
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
    </>
  );
};

export default PaymentRelationApprovalModal;