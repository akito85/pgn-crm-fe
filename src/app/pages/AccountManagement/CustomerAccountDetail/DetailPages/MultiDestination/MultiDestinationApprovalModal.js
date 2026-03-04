import { useRef, useState, useEffect, useMemo, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import NxTable from "../../../../../../components/Nx/NxTable";
import { getMultiDestinationApproval, approveOrRejectAllMultiDestination } from "../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { nxApplyFixedColumns } from "../../../../../../utils/Nx/nxApplyFixedColumns";
import { getMultiDestinationColumns } from "./getMultiDestinationColumns";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";

const MultiDestinationApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  // Selector
  const { list_multiDestinationApproval, pagination_multiDestinationApproval, loading } = useSelector(
    (state) => state.multiDestination
  );

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = list_multiDestinationApproval;

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

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: []
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
      }

      dispatch(
        getMultiDestinationApproval({
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
    const totalPages = pagination_multiDestinationApproval?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      const body = {
        inputFields: tempFilters,
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: search,
      }

      dispatch(
        getMultiDestinationApproval({
          id,
          body,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataSource.length < (pagination_multiDestinationApproval?.totalElements || 0);

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
      title: "MULTI DESTINATION",
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

      const body = selectedRows.filter(row => row.approvalType === "MULTI_DESTINATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }));

      const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_MULTI_DESTINATION").map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }))

      dispatch(
        approveOrRejectAllMultiDestination({
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

  const baseColumns = useMemo(
    () =>
      getMultiDestinationColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
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
    return dataSource?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSource]);

  return (
    <Fragment>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        header="Approval Multi Destination Information"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        footer={
          <div className="flex justify-between">
            <Button type={"menu"} onClick={handleCancelForm}>
              Cancel
            </Button>

            <div className="flex gap-x-4">
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
                    loading={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    loading={loading}
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
          {/* STEP 1: MULTI DESTINATION INFORMATION */}
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
                  header={"Multi Destination List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    totalData={pagination_multiDestinationApproval?.totalElements || 0}
                    tableScrolled={{ y: 400, x: dataSourceWithKeys.length ? "max-content" : 5000 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitions}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={loading}
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
                  columns={processedColumns}
                  totalData={pagination_multiDestinationApproval?.totalElements || 0}
                  tableScrolled={{ y: 400, x: selectedRows.length ? "max-content" : 5000 }}
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

export default MultiDestinationApprovalModal;
