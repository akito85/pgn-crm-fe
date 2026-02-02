import { useRef, useState, useEffect, useMemo, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../../utils/Icon";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { approveOrRejectAllPaymentRelation, getPaymentRelationApproval } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getPaymentRelationColumns } from "./getPaymentRelationColumns";
import { showModalError } from "../../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../components/Nx/NxModal";

const PaymentRelationApprovalModal = ({
  id = 0,
  isOpen,
  handleCancel = () => {},
  handleOpenModal = () => {},
  afterFinish = () => {},
}) => {
  // Selector
  const { list_paymentRelationApproval, pagination_paymentRelationApproval, loading } = useSelector(
    (state) => state.financialInformation
  );

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = list_paymentRelationApproval;

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
  const [action, setAction] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [] 
  });

  // Initial fetch - Load 100 data pertama
  useEffect(() => {
    if (isOpen) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
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
    const totalPages = pagination_paymentRelationApproval?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage <= totalPages) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
      }

      dispatch(
        getPaymentRelationApproval({
          id,
          body,
          isLoadMore: false,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataSource.length < (pagination_paymentRelationApproval?.totalElements || 0);

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
      title: "PAYMENT RELATION",
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
    setRemark("");
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
  };

  // Handle Save for Modal Confirmation
  const handleSave = (formValue) => {
    const body = selectedRows.filter(row => row.approvalType === "PAYMENT_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description: formValue.remark,
    }));

    const inactiveBody = selectedRows.filter(row => row.approvalType === "INACTIVE_PAYMENT_RELATION").map((row) => ({
      id: row.id,
      approvalId: row.tappId,
      action,
      description: formValue.remark,
    }))

    dispatch(
      approveOrRejectAllPaymentRelation({
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
        setRemark("");
        setAction("");
        handleCancel();
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setSearch({});
        setPage(1);
        setSort("");
        setSearchText("");
        setSearchedColumn("");
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
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

  const baseColumns = useMemo(
    () =>
      getPaymentRelationColumns(
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
  
  useEffect(() => {
    console.log("processedColumns", processedColumns);
  }, [processedColumns]);

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
        header="Approval Payment Relation Information"
        handleCancel={handleCancelForm}
        onFinish={handleSave}
        width={1000}
        hidePadding={true}
        footer={
          <div className="flex justify-between">
            <ButtonComponent type={"default"} onClick={handleCancelForm}>
              Cancel
            </ButtonComponent>

            <div className="flex gap-x-4">
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"default"}
                disabled={current < 1}
              >
                Previous
              </ButtonComponent>
              
              { current < steps.length - 1 && (
                <ButtonComponent
                  onClick={() => handleButtonNext()}
                  type={"submit"}
                  disabled={current > steps.length - 1 || steps[current].disabled}
                >
                  Next
                </ButtonComponent>
              )}
              {current === steps.length - 1 && (
                <>
                  <ButtonComponent
                    type={"reject"}
                    htmlType={"submit"}
                    form={"formApprove"}
                    onClick={() => setAction("REJECT")}
                    loading={loading}
                  >
                    Reject
                  </ButtonComponent>
                  <ButtonComponent
                    type={"approve"}
                    htmlType={"submit"}
                    form={"formApprove"}
                    onClick={() => setAction("APPROVE")}
                    loading={loading}
                  >
                    Approve
                  </ButtonComponent>
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
          {/* STEP 1: PAYMENT RELATION INFORMATION */}
          <div
            className={`steps-content ${current !== 0 ? "hidden" : ""}`}
          >
            <Form
              layout="vertical"
              form={form}
              id={"formApprove"}
              onFinish={handleSave}
            >
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer
                  border
                  header={"Payment Relation List - Ready to Approve"}
                >
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={dataSourceWithKeys}
                    columns={processedColumns}
                    totalData={pagination_paymentRelationApproval?.totalElements || 0}
                    tableScrolled={{ y: 400, x: "max-content" }}
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
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
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
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <div className="flex justify-between items-center mb-4">
                <p className="text-primary uppercase font-bold">
                  Confirmation
                </p>
                <p className="text-sm font-semibold text-blue-600">
                  {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'} will be {action === 'APPROVE' ? 'approved' : action === 'REJECT' ? 'rejected' : 'processed'}
                </p>
              </div>
              <NxTable
                dataSource={selectedRows}
                columns={processedColumns}
                totalData={pagination_paymentRelationApproval?.totalElements || 0}
                tableScrolled={{ y: 400, x: "max-content" }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={false}
                usePagination={false}
                useInfiniteScroll={false}
              />
              <div className="pt-[30px]">
                <DetailText label={"Remark"}>
                  {form.getFieldValue().remark}
                </DetailText>
              </div>
            </div>
          </div>
        </div>
      </NxModal>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={() => handleRetry()}
        handleCancel={() => handleCloseModalError()}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {bodyError.type === "inactivate"
              ? IconModal["icon_error_inactivate"]
              : IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            action === "APPROVE" ? "approved" : "rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default PaymentRelationApprovalModal;