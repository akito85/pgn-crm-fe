import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { columnsRequestBilling } from "./Table/TableRequestBilling";
import DetailText from "../../../../components/DetailText";
import {
  approvedBilling,
  getAllBillingApprovePaginate,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";
import TableRBI from "../../../../components/TableRBI";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const ModalApprovalBilling = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Selector
  const { data_list_billing_approval, loading } = useSelector(
    (state) => state.billing
  );

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = data_list_billing_approval?.result || [];

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
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [action, setAction] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [],
  });

  // Initial fetch - Load 100 data pertama
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllBillingApprovePaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
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
    const totalPages = data_list_billing_approval?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getAllBillingApprovePaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataSource.length < (data_list_billing_approval?.page?.totalElements || 0);

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

  // Step
  const steps = [
    {
      title: "BILLING INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue().remark,
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

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setGenerateInvoice(false);
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
    handleCancel();

    const dataBillingCodes = dataTableSelect.map((a) => ({
      billCode: a.billCode,
      approvalId: a.tappId,
      isGenerate: a.isGenerate,
    }));

    const body = {
      billingCodes: dataBillingCodes,
      action: action,
      description: formValue.remark,
    };

    dispatch(
      approvedBilling({
        body: body,
        action: action === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        handleRefresh();
        setCurrent(0);
        form.resetFields();
        setRemark("");
        setGenerateInvoice(false);
        setAction("");
        handleCancel();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
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
      columnsRequestBilling(
        page,
        loadMoreSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, loadMoreSize, searchedColumn, searchText, search]
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

  // PERUBAHAN: Gunakan billCode sebagai row key, fallback ke billHeaderId jika null
  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.billCode ?? item.billHeaderId,
    }));
  }, [dataSource]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type={"confirmation"}
        header="Approval Billing Information"
        handleCancel={handleCancelForm}
        onFinish={handleSave}
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

            {/* Kanan: Tombol Previous, Next, Reject, Approve */}
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
        <div className="flex flex-row justify-center">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
        </div>

        {/* STEP 1: BILLING INFORMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
        >
          <Form
            layout="vertical"
            form={form}
            id={"formApprove"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <div className="flex justify-between items-center mb-4">
                <p className="text-primary uppercase font-bold">
                  Billing List - Ready to Approve
                </p>
                {selectedRowKeys.length > 0 && (
                  <p className="text-sm font-semibold text-blue-600">
                    {selectedRowKeys.length}{" "}
                    {selectedRowKeys.length === 1 ? "row" : "rows"} selected
                  </p>
                )}
              </div>
              <TableRBI
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                totalData={data_list_billing_approval?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 2000 }}
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
              <div className="pt-[30px]">
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
                    placeholder={"Type your remark for approval/rejection"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        {/* STEP 2: CONFIRMATION */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <div className="flex justify-between items-center mb-4">
              <p className="text-primary uppercase font-bold">Confirmation</p>
              <p className="text-sm font-semibold text-blue-600">
                {dataTableSelect.length}{" "}
                {dataTableSelect.length === 1 ? "row" : "rows"} will be{" "}
                {action === "APPROVE"
                  ? "approved"
                  : action === "REJECT"
                  ? "rejected"
                  : "processed"}
              </p>
            </div>
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
              useInfiniteScroll={false}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

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
    </div>
  );
};

export default ModalApprovalBilling;