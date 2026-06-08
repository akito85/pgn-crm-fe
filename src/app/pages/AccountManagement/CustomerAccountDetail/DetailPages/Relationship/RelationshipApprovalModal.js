import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import NxTable from "../../../../../../components/Nx/NxTable";
import {
  getRelationshipApprovals,
  approveOrRejectAllRelationship,
} from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import {
  getStandaloneRelationshipApprovals,
  approveOrRejectAllStandaloneRelationship,
} from "../../../../../../redux/slices/relationship/standaloneRelationshipSlice";
import { getRelationshipColumns } from "./getRelationshipColumns";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../../../components/Nx/NxFormStepNavigation";
import SVGIcon from "../../../../../../assets/Icon/index";
import RelationshipDetailTable from "./RelationshipDetailTable";

const RelationshipApprovalModal = ({
  accountId = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
  isStandalone = false,
}) => {
  // Selector
  const sliceKey = isStandalone ? "standaloneRelationship" : "relationship";
  const {
    list_relationshipApproval,
    pagination_listRelationshipApproval,
    loading_listRelationshipApproval,
    loading_approveRelationship,
    loading_rejectRelationship,
  } = useSelector((state) => state[sliceKey]);

  const loadingApproval = loading_approveRelationship || loading_rejectRelationship;

  // Declaration
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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
      };

      const fetchThunk = isStandalone ? getStandaloneRelationshipApprovals : getRelationshipApprovals;
      const fetchArgs = isStandalone
        ? { page, pageSize: loadMoreSize, sort, body, isLoadMore: false }
        : { accountId, page, pageSize: loadMoreSize, sort, body, isLoadMore: false };
      dispatch(fetchThunk(fetchArgs));
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
    const totalPages = pagination_listRelationshipApproval?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules,
      };

      const loadMoreThunk = isStandalone ? getStandaloneRelationshipApprovals : getRelationshipApprovals;
      const loadMoreArgs = isStandalone
        ? { page: nextPage, pageSize: loadMoreSize, sort, body, isLoadMore: true }
        : { accountId, page: nextPage, pageSize: loadMoreSize, sort, body, isLoadMore: true };
      dispatch(loadMoreThunk(loadMoreArgs));
      setPage(nextPage);
    }
  };

  const hasMore = list_relationshipApproval.length < (pagination_listRelationshipApproval?.totalElements || 0);

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
    { key: "relationship", title: "RELATIONSHIP" },
    { key: "confirmation", title: "CONFIRMATION" },
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

      const body = selectedRows
        .filter((row) => row.approvalType === "ACCOUNT_RELATIONSHIP")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId || row.approvalId,
          action,
          description: values.remark,
        }));

      const inactiveBody = selectedRows
        .filter((row) => row.approvalType === "INACTIVE_ACCOUNT_RELATIONSHIP")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId || row.approvalId,
          action,
          description: values.remark,
        }));

      if (isStandalone) {
        dispatch(approveOrRejectAllStandaloneRelationship({ body, inactiveBody, onSuccess: resetForm }));
      } else {
        dispatch(approveOrRejectAllRelationship({ accountId, body, inactiveBody, action }))
          .unwrap()
          .then(() => { resetForm(); })
          .catch(() => {});
      }
    } catch {}
  };

  const columns = useMemo(
    () =>
      getRelationshipColumns({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        isApproval: true
    }),
    [page, loadMoreSize, searchedColumn, searchText]
  );

  const expandedRowRender = (record) => <RelationshipDetailTable relatedDetail={record?.relatedDetail} />;

  return (
    <>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL RELATIONSHIP INFORMATION"
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
                onClick={prev}
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
                    disabled={!loading_rejectRelationship && loadingApproval}
                    loading={loading_rejectRelationship}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                    className="flex-row-reverse"
                    disabled={!loading_approveRelationship && loadingApproval}
                    loading={loading_approveRelationship}
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
          {/* STEP 1: RELATIONSHIP INFORMATION */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer border header={"Relationship List - Ready to Approve"}>
                  <NxTable
                    idTable="relationship-approval-table"
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={list_relationshipApproval}
                    columns={columns}
                    totalData={pagination_listRelationshipApproval.totalElements || 0}
                    tableScrolled={{
                      x: pagination_listRelationshipApproval.totalElements ? "max-content" : 1486,
                    }}
                    onSort={onSort}
                    loading={loading_listRelationshipApproval}
                    showExport={false}
                    rowSelection={rowSelection}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadMoreThreshold={20}
                    expandable={{ expandedRowRender }}
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
                  columns={columns}
                  totalData={selectedRows.length}
                  tableScrolled={{
                    x: selectedRows.length ? "max-content" : 1438,
                  }}
                  onSort={onSort}
                  loading={false}
                  usePagination={false}
                  useInfiniteScroll={false}
                  expandable={{
                    expandedRowRender,
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
    </>
  );
};

export default RelationshipApprovalModal;
