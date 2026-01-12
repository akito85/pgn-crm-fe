import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Select, Checkbox, Tooltip } from "antd";
import { DownOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
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
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import RadioTabs from "../../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";

// Column Configuration
import { columnsCustomerInfo } from "./Table/TableCustomerInfo";
import { columnsWarrantyInfo } from "./Table/TableWarrantyInfo";
import { columnsReleaseInfo } from "./Table/TableReleaseInfo";
import { columnsAttachmentInfo } from "./Table/TableAttachmentInfo";

// Redux / Service
import { configApp } from "../../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import {
  getAllWarrantyInfoPaginate,
  getAllReleaseInfoPaginate,
  getAllAttachmentInfoPaginate,
  getListCategory,
  requestedRelease,
} from "../../../../../../redux/slices/receipt_collection/warranty";

const ModalRelease = ({
  isOpen,
  handleBack = () => {},
  handleRefresh = () => {},
  handleOpenModal = () => {},
}) => {
  // Selector
  const {
    data_customer_info,
    data_warranty_info,
    data_release_info,
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
  const dataSourceReleaseInfo = data_release_info?.result || [];
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
      title: "Warranty Information",
      disabled: false
    },
    {
      title: "Release Information",
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

  // Handle Back Form
  const handleBackForm = () => {
    handleBack();
    setSelectedCustomerInfoRowKeys([]);
    setDataCustomerInfoSelect([]);
    setDataWarrantyInfoSelect([]);
    setDataTable([]);
    setBoolean(false);
    setRemarkReleaseInformation("");
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
  };

  const [tabData, setTabData] = useState([
    { value: "Release"},
    { value: "Attachment" },
  ]);
  
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const onChange = (e) => {
    setValuePage(e.target.value);
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
    handleBack();

    const body = {
    };
    
    dispatch(requestedRelease({ body: body }))
      .unwrap()
      .then(() => {
        handleRefresh();
        handleBack();
        setSelectedCustomerInfoRowKeys([]);
        setDataCustomerInfoSelect([]);
        setDataWarrantyInfoSelect([]);
        setDataTable([]);
        setBoolean(false);
        setRemarkReleaseInformation("");
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

  // Warranti Information Step
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

  // Release Information Step
  const [releaseAmountData, setReleaseAmountData] = useState({});
  const handleReleaseAmountChange = (value, recordKey) => {
    setReleaseAmountData(prev => ({ ...prev, [recordKey]: value }));
  };

  const [releaseDateData, setReleaseDateData] = useState({});
  const handleReleaseDateChange = (value, recordKey) => {
    setReleaseDateData(prev => ({ ...prev, [recordKey]: value }));
  }; 

  const [remarkReleaseInformation, setRemarkReleaseInformation] = useState("");

  const [fixedReleaseColumns, setFixedReleaseColumns] = useState({
    left: ["no"],
    right: ["date", "releaseAmount"] 
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(
        getAllReleaseInfoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
    }
  }, [dispatch, isOpen, search, page, pageSize, sort]);

  const dataSourceReleaseInfoWithKeys = useMemo(() => {
    return dataSourceReleaseInfo?.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  }, [dataSourceReleaseInfo]);
  
  const baseColumnsReleaseInfo = useMemo(
    () =>
      columnsReleaseInfo(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        releaseAmountData,
        handleReleaseAmountChange,
        releaseDateData,
        handleReleaseDateChange
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumnsReleaseInfo = useMemo(() => {
    const columnsWithKeys = baseColumnsReleaseInfo.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsReleaseInfo]);

  const processedColumnsReleaseInfo = useMemo(() => {
    return applyFixedColumns(allColumnsReleaseInfo, fixedReleaseColumns);
  }, [allColumnsReleaseInfo, fixedReleaseColumns]);

  const columnDefinitionsReleaseInfo = useMemo(() => {
    return allColumnsReleaseInfo.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsReleaseInfo]);

  // Attachment Information Step
  const [listDataAttachment, setListDataAttachment] = useState([]);
  
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
  
  const itemGrantAccess = [
    {
      action: "Hapus",
      type: "table",
      render: (record) => {
        const status = record.approvalStatus?.toUpperCase(); // Menggunakan 's' dan optional chaining
        const isDelete = status === "DRAFT" || status === "REJECTED";
        return (
          <Tooltip title="Delete">
            <SVGIcon
              name="IconDelete"
              width={24}
              color={isDelete ? "#D90000" : "#8D91A0"}
              className={isDelete ? undefined : "disabled cursor-not-allowed"}
              onClick={isDelete ? () => undefined : undefined}
            />
          </Tooltip>
        );
      },
    },
  ];
  
  
  const actionColsAttachmentInfo = useColumnActionPermission(
    ["view", "history", "hapus"],
    itemGrantAccess
  ).map((col) => ({
    ...col,
    width: 80,
    align: "center",
  }));

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
    const columnsWithKeys = [...baseColumnsAttachmentInfo, ...actionColsAttachmentInfo].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumnsAttachmentInfo, actionColsAttachmentInfo]);

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
        header="Warranty Release"
        handleBack={handleBackForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-x-5">
            {current < steps.length - 0 && (
              <ButtonComponent type={"default"} onClick={handleBackForm}>
                <span className="p-1 text-[18px] text-center">Back</span>
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
              >
                <LeftOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
                <span className="p-1 text-[18px] text-center">Previous</span>
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
                <span className="p-1 text-[18px] text-center">Confirm</span>
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
          {/* STEP : WARRANTY INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 0 ? "hidden" : "" }`} >
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
                totalData={data_warranty_info?.page?.totalElements || 0}
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
          {/* STEP : RELEASE INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 1 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4 mb-8">
              <p className="text-primary uppercase font-bold mb-4">
                RELEASE INFORMATION
              </p>

              <TableRBI
                dataSource={dataSourceReleaseInfoWithKeys}
                columns={processedColumnsReleaseInfo}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={data_release_info?.page?.totalElements || 0}
                tableScrolled={{ y: 525, x: 1000 }}
                onSort={onSort}
                columnDefinitions={columnDefinitionsReleaseInfo}
                fixedColumns={fixedReleaseColumns}
                setFixedColumns={setFixedReleaseColumns}
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
                    rows={6}
                    type="textarea"
                    value={remarkReleaseInformation}
                    onChange={(e) => setRemarkReleaseInformation(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* STEP : ATTACHMENT INFORMATION */}
          <div className={`steps-content my-[30px] ${ current !== 2 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <p className="text-primary uppercase font-bold mb-4">
                ATTACHMENT INFORMATION
              </p>
              <AttachmentComponent
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="warranty"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </div>
          </div>

          {/* STEP : CONFIRMATION */}
          <div className={`steps-content my-[30px] ${ current !== 3 ? "hidden" : "" }`} >
            <div className="w-full grid grid-cols-1 gap-x-4">
              <RadioTabs data={tabData} onChange={onChange} currentPosition={valuePage}/>
              <div style={{ display: valuePage !== tabData[0].value ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    RELEASE INFORMATION
                  </p>
                  <TableRBI
                    dataSource={dataSourceReleaseInfoWithKeys}
                    columns={processedColumnsReleaseInfo}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChange}
                    onSizeChanger={handleChange}
                    totalData={dataSourceReleaseInfoWithKeys.length || 0}
                    tableScrolled={{ y: 525, x: 1000 }}
                    onSort={onSort}
                    columnDefinitions={columnDefinitionsReleaseInfo}
                    fixedColumns={fixedColumns}
                    setFixedColumns={setFixedColumns}
                    loading={false}
                  />
                  <div>
                    <DetailText label={"Remark"}>
                      {form.getFieldValue("remark")}
                    </DetailText>
                  </div>
                </div>
              </div>

              <div style={{ display: valuePage !== tabData[1].value ? "none" : undefined }}>
                <div className="w-full grid grid-cols-1 gap-[30px]">
                  <p className="text-primary uppercase font-bold my-4">
                    ATTACHMENT INFORMATION
                  </p>
                  <AttachmentComponent
                    type={"preview"}
                    data={listDataAttachment}
                    updateData={setListDataAttachment}
                    typeSelector="partner"
                    dispatch={dispatch}
                    getAPICategory={getListCategory}
                    service={receiptCollectionHttpService}
                    configApplication={configApp.PAYMENT_SERVICE}
                    typeRBI={"data"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Form>
      </ModalCustom>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleBack={handleCloseModalError}
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

export default ModalRelease;