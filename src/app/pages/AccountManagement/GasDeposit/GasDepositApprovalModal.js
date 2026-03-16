import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button } from "antd";
import InputComponent from "../../../../components/InputComponent";
import DetailText from "../../../../components/DetailText";
import NxTable from "../../../../components/Nx/NxTable";
import {
  getGasDepositApproval,
  approveOrRejectAllGasDeposit
} from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositColumns } from "./getGasDepositColumns";
import { showModalError } from "../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../components/Nx/NxModal";

/**
 * Modal for approving or rejecting pending gas deposit records.
 * Displays a two-step wizard: select records + enter remark, then confirm.
 * @param {{ id?: number; isOpen: boolean; handleCancel?: () => void; afterFinish?: () => void }} props
 * @returns
 */
const GasDepositApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {}
}) => {
  // --- Hooks ---
  const {
    list_gasDepositApproval: gasDepositApprovals,
    pagination_gasDepositApproval: pagination,
    loading_listGdApproval,
    loading_approveRejectGd
  } = useSelector((state) => state.gasDeposit);

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

  // --- Derived values ---
  const totalElement = pagination.totalElement;
  const hasMore = gasDepositApprovals.length < totalElement;

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
    {
      key: "gd",
      title: "GAS DEPOSIT"
    },
    {
      key: "gdc",
      title: "CONFIRMATION"
    }
  ];

  const formFields = [["remark"]];

  // --- Functions / handlers ---

  /**
   * Confirms a column search, updates searchText/searchedColumn, and merges
   * the new search term into the search state map.
   * @param {string[]} selectedKeys - The search input value(s)
   * @param {() => void} confirm - Ant Design's confirm callback to close the filter dropdown
   * @param {string} dataIndex - The column key being searched
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
   * Fetches the next page of gas deposit approvals and appends it to the
   * existing list. Does nothing if all pages have already been loaded.
   */
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination.totalPage || 0;

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
        getGasDepositApproval({
          id,
          body,
          isLoadMore: true
        })
      );
      setPage(nextPage);
    }
  };

  /**
   * Updates the sort state based on the Ant Design table sorter object.
   * Clears the sort when the sorter order is removed.
   * @param {*} _ - Unused pagination param
   * @param {*} __ - Unused filters param
   * @param {{ field: string; order: "ascend" | "descend" | undefined }} sorter
   */
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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
   * Advances the wizard to the next step after validating the current step.
   * On step 0, requires at least one row to be selected before proceeding.
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
   * Returns the wizard to the previous step.
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
   * Delegates to `handleCancel()` to close the modal without saving.
   */
  const handleCancelForm = () => {
    handleCancel();
  };

  /**
   * Validates the form, builds approve/reject payloads from the selected rows,
   * and dispatches the approval/rejection action.
   * @param {"APPROVE" | "REJECT"} action - The action to perform on selected records
   */
  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();

      const body = selectedRows
        .filter((row) => row.approvalType === "GAS_DEPOSIT")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      const inactiveBody = selectedRows
        .filter((row) => row.approvalType === "INACTIVE_GAS_DEPOSIT")
        .map((row) => ({
          id: row.id,
          approvalId: row.tappId,
          action,
          description: values.remark
        }));

      dispatch(
        approveOrRejectAllGasDeposit({
          body,
          inactiveBody,
          action: action === "APPROVE" ? "approved" : "rejected"
        })
      )
        .unwrap()
        .then(resetForm)
        .catch((error) => {});
    } catch {}
  };

  const columnDefinitions = useMemo(
    () =>
      getGasDepositColumns(
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
        getGasDepositApproval({
          id,
          body,
          isLoadMore: false
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort, filters, filterRules]);

  return (
    <>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL GAS DEPOSIT INFORMATION"
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
                onClick={prev}
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
                    loading={loading_approveRejectGd}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    loading={loading_approveRejectGd}
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
          {/* STEP 1: GAS DEPOSIT INFORMATION */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer
                  border
                  header={"Gas Deposit List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={gasDepositApprovals}
                    columns={columns}
                    totalData={totalElement}
                    tableScrolled={{
                      x: gasDepositApprovals.length ? "max-content" : 5000
                    }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading_listGdApproval}
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

export default GasDepositApprovalModal;
