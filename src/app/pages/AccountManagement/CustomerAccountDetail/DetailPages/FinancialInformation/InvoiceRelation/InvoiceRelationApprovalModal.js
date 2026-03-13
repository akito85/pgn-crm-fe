import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import DetailText from "../../../../../../../components/DetailText";
import NxTable from "../../../../../../../components/Nx/NxTable";
import {
  approveOrRejectAllInvoiceRelation,
  getInvoiceRelationApproval
} from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getInvoiceRelationColumns } from "./getInvoiceRelationColumns";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../components/Nx/NxModal";

const InvoiceRelationApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {}
}) => {
  // Selector
  const {
    list_invoiceRelationApproval: invoiceRelationApprovals,
    pagination_invoiceRelationApproval: pagination,
    loading_listIrApproval,
    loading_approveRejectIr
  } = useSelector((state) => state.financialInformation);

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
        filterRules
      };

      dispatch(
        getInvoiceRelationApproval({
          id,
          body,
          isLoadMore: false
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort, filters, filterRules]);

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
   * Loads the next page of invoice relation approvals when the user scrolls
   * to the bottom of the infinite-scroll table.
   * @returns {Promise<void>}
   */
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination.totalPage || 0;

    // Check if there's more data to load
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
        getInvoiceRelationApproval({
          id,
          body,
          isLoadMore: true
        })
      );
      setPage(nextPage);
    }
  };

  const totalElement = pagination.totalElement;
  const hasMore = invoiceRelationApprovals.length < totalElement;

  /**
   * Handles table sort changes and updates the sort query string.
   * @param {object} _ - Pagination (unused).
   * @param {object} __ - Filters (unused).
   * @param {object} sorter - Ant Design sorter object containing field and order.
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

  // Step
  const steps = [
    { key: "ir", title: "INVOICE RELATION" },
    { key: "irc", title: "CONFIRMATION" }
  ];

  const formFields = [["remark"]];

  /**
   * Advances to the next step after validating form fields and ensuring at
   * least one row is selected.
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
   * Advances to the next step and scrolls the Steps header to the right.
   */
  const handleButtonNext = () => {
    next();
  };

  /**
   * Resets all modal state and calls `afterFinish` (used after a successful save).
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
   * @param {"APPROVE"|"REJECT"} action - The action to perform.
   * @returns {Promise<void>}
   */
  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();

      const body = selectedRows
        .filter((row) => row.approvalType === "INVOICE_RELATION")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      const inactiveBody = selectedRows
        .filter((row) => row.approvalType === "INACTIVE_INVOICE_RELATION")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      dispatch(
        approveOrRejectAllInvoiceRelation({
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
      getInvoiceRelationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
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
        title="APPROVAL INVOICE RELATION INFORMATION"
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
                }}
                type={"menu"}
                disabled={current < 1}
              >
                Previous
              </Button>

              {current < steps.length - 1 && (
                <Button
                  onClick={() => handleButtonNext()}
                  type={"submit"}
                  disabled={
                    current > steps.length - 1 || steps[current].disabled
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
            left: false
          }}
          rounded={false}
        >
          <div className="flex flex-row justify-center">
            <Steps
              current={current}
              items={steps}
              labelPlacement="vertical"
            />
          </div>
        </NxBaseContainer>

        <div className="p-4">
          {/* STEP 1: INVOICE RELATION INFORMATION */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
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
                    tableScrolled={{ x: invoiceRelationApprovals.length ? "max-content" : 5000 }}
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

export default InvoiceRelationApprovalModal;
