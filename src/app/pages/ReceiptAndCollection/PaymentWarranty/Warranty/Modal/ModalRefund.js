import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select, Checkbox } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";

// Utils
import { IconModal } from "../../../../../../utils/Icon";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

// Global Custom Components
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";

// Column Configuration
import { columnsCustomerInfo } from "./Table/TableCustomerInfo";
import { columnsWarrantyInfo } from "./Table/TableWarrantyInfo";
import { columnsRefundInfo } from "./Table/TableRefundInfo";
import { columnsAttachmentInfo } from "./Table/TableAttachmentInfo";

// Redux / Service
import {
  getAllCustomerInfoPaginate,
  getAllWarrantyInfoPaginate,
  getAllRefundInfoPaginate,
  getAllAttachmentInfoPaginate,
  requestedRefund,
} from "../../../../../../redux/slices/receipt_collection/warranty";

const ModalRefund = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Selector
  const {
    data_customer_info,
    data_warranty_info,
    data_refund_info,
    data_attachment_info,
    loading,
  } = useSelector((state) => state.warranty);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dataSourceCustomerInfo = data_customer_info?.result || [];
  const dataSourceWarrantyInfo = data_warranty_info?.result || [];
  const dataSourceRefundInfo = data_refund_info?.result || [];
  const dataSourceAttachmentInfo = data_attachment_info?.result || [];

  // Global State
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
  const [selectedCustomerInfoRowKeys, setSelectedCustomerInfoRowKeys] = useState([]);
  const [dataCustomerInfoSelect, setDataCustomerInfoSelect] = useState([]);
  const [selectedWarrantyInfoRowKeys, setSelectedWarrantyInfoRowKeys] = useState([]);
  const [dataWarrantyInfoSelect, setDataWarrantyInfoSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [] 
  });

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

  // Define Wizard Step
  const steps = [
    {
      title: "Customer Information",
      disabled: false
    },
    {
      title: "Warranty Information",
      disabled: false
    },
    {
      title: "Refund Information",
      disabled: false
    },
    {
      title: "Attachment Information",
      disabled: false
    },
    {
      title: "Confirmation",
      disabled: false
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
    setBoolean(true);
  };

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedCustomerInfoRowKeys([]);
    setDataCustomerInfoSelect([]);
    setDataWarrantyInfoSelect([]);
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
      billingCodes: dataCustomerInfoSelect.map((a) => a.billingCode)
    };

    dispatch(requestedRefund({ body: body }))
      .unwrap()
      .then(() => {
        handleRefresh();
        handleCancel();
        setSelectedCustomerInfoRowKeys([]);
        setDataCustomerInfoSelect([]);
        setDataWarrantyInfoSelect([]);
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
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message, type: "requested" });
          setModalError(true);
        }
      });
  };

  // Customer Info Data
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllCustomerInfoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort]);

  const dataSourceCustomerInfoWithKeys = useMemo(() => {
    return dataSourceCustomerInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceCustomerInfo]);
  
  const baseColumnsCustomerInfo = useMemo(
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

  const allColumnsCustomerInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsCustomerInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsCustomerInfo]);

  const processedColumnsCustomerInfo = useMemo(() => {
    return applyFixedColumns(allColumnsCustomerInfo, fixedColumns);
  }, [allColumnsCustomerInfo, fixedColumns]);

  const columnDefinitionsCustomerInfo = useMemo(() => {
    return allColumnsCustomerInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsCustomerInfo]);
  
  const onSelectChangeCustomerInfo = (newSelectedCustomerInfoRowKeys, newSelectedRow) => {
    setDataCustomerInfoSelect(newSelectedRow);
    setSelectedCustomerInfoRowKeys(newSelectedCustomerInfoRowKeys);
  };

  const rowSelectionCustomerInfo = {
    fixed: true,
    selectedCustomerInfoRowKeys,
    onChange: onSelectChangeCustomerInfo,
  };

  // Customer Info Data
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllWarrantyInfoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort]);

  const dataSourceWarrantyInfoWithKeys = useMemo(() => {
    return dataSourceWarrantyInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceWarrantyInfo]);
  
  const baseColumnsWarrantyInfo = useMemo(
    () =>
      columnsWarrantyInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsWarrantyInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsWarrantyInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsWarrantyInfo]);

  const processedColumnsWarrantyInfo = useMemo(() => {
    return applyFixedColumns(allColumnsWarrantyInfo, fixedColumns);
  }, [allColumnsWarrantyInfo, fixedColumns]);

  const columnDefinitionsWarrantyInfo = useMemo(() => {
    return allColumnsWarrantyInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsWarrantyInfo]);

  const onSelectChangeWarrantyInfo = (newSelectedWarrantyInfoRowKeys, newSelectedRow) => {
    setDataWarrantyInfoSelect(newSelectedRow);
    setSelectedWarrantyInfoRowKeys(newSelectedWarrantyInfoRowKeys);
  };

  const rowSelectionWarrantyInfo = {
    fixed: true,
    selectedWarrantyInfoRowKeys,
    onChange: onSelectChangeWarrantyInfo,
  };

  // Customer Info Data
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllRefundInfoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort]);

  const dataSourceRefundInfoWithKeys = useMemo(() => {
    return dataSourceRefundInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceRefundInfo]);
  
  const baseColumnsRefundInfo = useMemo(
    () =>
      columnsRefundInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsRefundInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsRefundInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsRefundInfo]);

  const processedColumnsRefundInfo = useMemo(() => {
    return applyFixedColumns(allColumnsRefundInfo, fixedColumns);
  }, [allColumnsRefundInfo, fixedColumns]);

  const columnDefinitionsRefundInfo = useMemo(() => {
    return allColumnsRefundInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsRefundInfo]);

  // Customer Info Data
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllAttachmentInfoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort]);

  const dataSourceAttachmentInfoWithKeys = useMemo(() => {
    return dataSourceAttachmentInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceAttachmentInfo]);
  
  const baseColumnsAttachmentInfo = useMemo(
    () =>
      columnsAttachmentInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsAttachmentInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsAttachmentInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsAttachmentInfo]);

  const processedColumnsAttachmentInfo = useMemo(() => {
    return applyFixedColumns(allColumnsAttachmentInfo, fixedColumns);
  }, [allColumnsAttachmentInfo, fixedColumns]);

  const columnDefinitionsAttachmentInfo = useMemo(() => {
    return allColumnsAttachmentInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsAttachmentInfo]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Refund"
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
                dataSource={dataSourceCustomerInfoWithKeys}
                columns={processedColumnsCustomerInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_customer_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsCustomerInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelectionCustomerInfo}
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
                dataSource={dataSourceWarrantyInfoWithKeys}
                columns={processedColumnsWarrantyInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_customer_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsWarrantyInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
                showExport={false}
                rowSelection={rowSelectionWarrantyInfo}
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
                dataSource={dataSourceRefundInfoWithKeys}
                columns={processedColumnsRefundInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_customer_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsRefundInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
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
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP 4: ATTACHMENT INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 3 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                ATTACHMENT INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceAttachmentInfoWithKeys}
                columns={processedColumnsAttachmentInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_customer_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsAttachmentInfo}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
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
                dataSource={dataCustomerInfoSelect}
                columns={processedColumnsCustomerInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={dataCustomerInfoSelect.length || 0}
                tableScrolled={{ y: 525, x: 15000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsCustomerInfo}
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

export default ModalRefund;