import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import NxTable from "../../../../../../components/Nx/NxTable";
import {
  getMultiDestinationApproval,
  approveOrRejectAllMultiDestination
} from "../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getMultiDestinationColumns } from "./getMultiDestinationColumns";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../../../components/Nx/NxFormStepNavigation";
import SVGIcon from "../../../../../../assets/Icon/index";

/**
 * Modal for approving or rejecting pending multi-destination records.
 * Displays a two-step wizard: select records + enter remark, then confirm.
 * @param {{ accountId: number; isOpen: boolean; handleCancel?: () => void; afterFinish?: () => void }} props
 * @returns
 */
const MultiDestinationApprovalModal = ({
  accountId,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {}
}) => {
  // --- Hooks ---
  const {
    list_multiDestinationApproval,
    pagination_multiDestinationApproval,
    loading_listMdApproval,
    loading_approveRejectMd
  } = useSelector((state) => state.multiDestination);

  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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

  // --- Effects ---
  // Fetches the first page of pending approvals whenever the modal opens or
  // any filter/search/sort parameter changes. Resets the page counter to 1.
  useEffect(() => {
    if (isOpen) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules
      };

      dispatch(
        getMultiDestinationApproval({
          id: accountId,
          body,
          isLoadMore: false
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort, filters, filterRules]);

  // --- Functions / handlers ---
  /**
   * Handles column search: confirms the search, updates search text/column state,
   * and resets the page if the filter value has changed.
   * @param {string[]} selectedKeys - The selected filter values.
   * @param {Function} confirm - Ant Design confirm callback to apply the filter.
   * @param {string} dataIndex - The column key being searched.
   */
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
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  /**
   * Fetches the next page of multi-destination approvals and appends it to the
   * existing list. Does nothing if all pages have already been loaded.
   * @returns {Promise<void>}
   */
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination_multiDestinationApproval?.totalPage || 0;

    if (nextPage <= totalPage) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
        filters,
        filterRules
      };

      dispatch(
        getMultiDestinationApproval({
          id: accountId,
          body,
          isLoadMore: true
        })
      );
      setPage(nextPage);
    }
  };

  // --- Derived values ---
  const hasMore =
    list_multiDestinationApproval.length <
    (pagination_multiDestinationApproval?.totalElement || 0);

  /**
   * Handles table sort changes and updates the sort query string.
   * @param {object} _ - Pagination (unused).
   * @param {object} __ - Filters (unused).
   * @param {{ field: string; order: "ascend" | "descend" | undefined }} sorter
   */
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
      setSelectedRows(
        newSelectedRows.map((newSelectedRow) => ({ ...newSelectedRow }))
      );
    },
    preserveSelectedRowKeys: true
  };

  const steps = [
    { key: "md", title: "MULTI DESTINATION" },
    { key: "mdc", title: "CONFIRMATION" }
  ];

  const formFields = [["remark"]];

  /**
   * Advances the wizard to the next step after validating the current step.
   * On step 0, requires at least one row to be selected before proceeding.
   * @returns {Promise<void>}
   */
  const next = async () => {
    try {
      if (current === 0) {
        if (!selectedRowKeys.length) {
          const errorBody = {
            title: "Failed",
            description: `Please select at least one record`
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

  /**
   * Returns to the previous step.
   */
  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  /**
   * Delegates to `next()` to advance the wizard step.
   */
  const handleButtonNext = () => {
    next();
  };

  /**
   * Resets the entire wizard to its initial state: clears selection, search,
   * pagination, form fields, and closes the modal. Also triggers `afterFinish`.
   */
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

  /**
   * Cancels the modal without triggering `afterFinish`: closes the modal and
   * resets all local state.
   */
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

  /**
   * Validates the form, dispatches the approve/reject action for the selected
   * rows, and resets the modal on success.
   * @param {"APPROVE" | "REJECT"} action - The action to perform on selected records.
   * @returns {Promise<void>}
   */
  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();

      const body = selectedRows
        .filter((row) => row.approvalType === "MULTI_DESTINATION")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      const inactiveBody = selectedRows
        .filter((row) => row.approvalType === "INACTIVE_MULTI_DESTINATION")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      dispatch(
        approveOrRejectAllMultiDestination({
          body,
          inactiveBody,
          action: action === "APPROVE" ? "approved" : "rejected"
        })
      )
        .unwrap()
        .then(() => {
          resetForm();
        })
        .catch((error) => {});
    } catch {}
  };

  const columnDefinitions = useMemo(
    () =>
      getMultiDestinationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
    [search, searchInput, searchedColumn, searchText]
  );

  const columns = useMemo(
    () => nxApplyFixedColumns(columnDefinitions, fixedColumns),
    [columnDefinitions, fixedColumns]
  );

  const dataSourceWithKeys = useMemo(() => {
    return list_multiDestinationApproval?.map((item, index) => ({
      ...item,
      key: index + 1
    }));
  }, [list_multiDestinationApproval]);

  return (
    <>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL MULTI DESTINATION INFORMATION"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        loading={loading_approveRejectMd}
        footer={
          <div className="flex justify-between">
            <Button
              type={"menu"}
              onClick={handleCancelForm}
              disabled={loading_approveRejectMd}
            >
              Cancel
            </Button>
            <div className="flex">
              <Button
                onClick={() => {
                  prev();
                }}
                type={"menu"}
                disabled={current < 1 || loading_approveRejectMd}
              >
                Previous
              </Button>

              {current < steps.length - 1 && (
                <Button
                  onClick={() => handleButtonNext()}
                  type={"submit"}
                  disabled={
                    current > steps.length - 1 ||
                    steps[current].disabled ||
                    loading_approveRejectMd
                  }
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
                    disabled={loading_approveRejectMd}
                    loading={loading_approveRejectMd}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    icon={
                      <SVGIcon width={14} height={14} name="IconSquareCheck" />
                    }
                    className="flex-row-reverse"
                    disabled={loading_approveRejectMd}
                    loading={loading_approveRejectMd}
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
          {/* STEP 1: MULTI DESTINATION INFORMATION */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer
                  border
                  header={"Multi Destination List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={dataSourceWithKeys}
                    columns={columns}
                    totalData={
                      pagination_multiDestinationApproval?.totalElement || 0
                    }
                    tableScrolled={{
                      x: dataSourceWithKeys.length ? "max-content" : 5000
                    }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_listMdApproval}
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
                      { required: true, message: "Please input your Remark!" }
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
          <div className={`steps-content ${current !== 1 ? "hidden" : ""}`}>
            <NxBaseContainer border header={"Confirmation"}>
              <div className="flex flex-col gap-y-4">
                <NxTable
                  dataSource={selectedRows}
                  columns={columns}
                  totalData={
                    pagination_multiDestinationApproval?.totalElement || 0
                  }
                  tableScrolled={{
                    x: selectedRows.length ? "max-content" : 5000
                  }}
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

export default MultiDestinationApprovalModal;
