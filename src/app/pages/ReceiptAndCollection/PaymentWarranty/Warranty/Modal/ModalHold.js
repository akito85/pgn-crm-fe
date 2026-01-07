import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select, Checkbox } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import { columnsCustomerInfo } from "./Table/TableCustomerInfo";
import {
  getAllApprovalList,
  getAllBillingRequestPaginate,
  getListApprovalById,
  requestedBilling,
} from "../../../../../../redux/slices/receipt_collection/warranty";
import {
  columnsApproval,
  columnsExpandApproval,
} from "../Detail/Table/TableApproval";
import DetailText from "../../../../../../components/DetailText";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const ModalHold = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Selector
  const {
    data_customer,
    data_refund,
    data_attachment,

    data_approval,
    data_approval_list,
    data_list_billing_request_approval,
    loading,
  } = useSelector((state) => state.warranty);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSource = data_list_billing_request_approval?.result || [];

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [remark, setRemark] = useState("");

  const [boolean, setBoolean] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataCustomerSelect, setDataCustomerSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [] 
  });

  // Use Effect - Fetch approval list sekali saja
  // useEffect(() => {
  //   dispatch(getAllApprovalList());
  // }, [dispatch]);

  // Use Effect - Fetch data dengan pagination setiap ada perubahan
  // useEffect(() => {
  //   if (isOpen) {
  //     dispatch(
  //       getAllBillingRequestPaginate({
  //         search: encodeURIComponent(JSON.stringify(search)),
  //         page,
  //         pageSize,
  //         sort,
  //       })
  //     );
  //   }
  // }, [dispatch, isOpen, search, page, pageSize, sort]);

  useEffect(() => {
    if (boolean === true) {
      if (data_approval_list && data_approval_list.length > 0) {
        const data = data_approval_list?.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: a.employeeDetail.map((b, index) => ({
            ...b,
            key: index + 1,
          })),
        }));
        setDataTable(data);
      }
    }
  }, [data_approval_list, boolean]);

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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataCustomerSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Step - 3 steps
  const steps = [
    {
      title: "Customer Information",
    },
    {
      title: "Warranty Information",
    },
    {
      title: "Refund Information",
    },
    {
      title: "Attachment Information",
    },
    {
      title: "Confirmation",
    },
  ];

  // Button Next
  const next = () => {
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setCurrent(current - 1);
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

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataCustomerSelect([]);
    setDataTable([]);
    setBoolean(false);
    setRemark("");
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
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

  // Handle Save for Modal Confirmation
  const handleSave = (formValue) => {
    handleCancel();

    const body = {
      ...formValue,
      billingCodes: dataCustomerSelect.map((a) => a.billingCode)
    };

    // dispatch(requestedBilling({ body: body }))
    //   .unwrap()
    //   .then(() => {
    //     handleRefresh();
    //     handleCancel();
    //     setSelectedRowKeys([]);
    //     setDataCustomerSelect([]);
    //     setDataTable([]);
    //     setBoolean(false);
    //     setRemark("");
    //     setCurrent(0);
    //     setSearch({});
    //     setPage(1);
    //     setSort("");
    //     setSearchText("");
    //     setSearchedColumn("");
    //     form.resetFields();
    //   })
    //   .catch((error) => {
    //     if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
    //       const message =
    //         error?.response?.data?.message ||
    //         error?.message ||
    //         error?.toString();
    //       setBodyError({ message, type: "requested" });
    //       setModalError(true);
    //     }
    //   });
  };

  const baseColumns = useMemo(
    () =>
      columnsCustomerInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
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

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSource]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Hold"
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-x-5">
            {current < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}

            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={() => {
                  handleButtonNext();
                }}
                type={"submit"}
                className="ant-btn ant-btn-submit flex w-full justify-center"
                disabled={steps[current].disabled}
              >
                <span className="p-1 text-[18px] text-center">Next</span>
                <RightOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                form={"formRequest"}
              >
                Confirm
              </ButtonComponent>
            )}
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

        <Form
          layout="vertical"
          form={form}
          id={"formRequest"}
          onFinish={handleSave}
        >
          {/* STEP 1: CUSTOMER INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 0 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                CUSTOMER INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_list_billing_request_approval?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelection}
              />
            </div>
          </div>

          {/* STEP 2: WARRANTY INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 1 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                WARRANTY INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_list_billing_request_approval?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelection}
              />
            </div>
          </div>
          {/* STEP 3: REFUND INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 2 ? "hidden" : "" }`} >
            {/* Billing Information Review */}
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                REFUND INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_list_billing_request_approval?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelection}
              />
            </div>
          </div>

          {/* STEP 4: ATTACHMENT INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 3 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                ATTACHMENT INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceWithKeys}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_list_billing_request_approval?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelection}
              />
            </div>
          </div>

          {/* STEP 5: CONFIRMATION */}
          <div className={`steps-content my-[30px] ${ current !== 4 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                CONFIRMATION
              </p>

              <TableRBI
                dataSource={dataCustomerSelect}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={dataCustomerSelect.length || 0}
                tableScrolled={{ y: 525, x: 15000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={false}
              />
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {bodyError.type === "inactivate"
              ? IconModal["icon_error_inactivate"]
              : IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${bodyError.type}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalHold;