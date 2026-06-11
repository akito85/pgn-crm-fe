import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Alert, Form, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  activationAccountingRules,
  downloadAccountingRules,
  getAccountingRulesPaginate,
  getDetailAccountingRules,
} from "../../../../../redux/slices/account_management/MasterData/accounting_rules";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../assets/icons/nx/IconInactive";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
  toTitleCase,
} from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";

const ViewAccountingRules = () => {
  const { data_detail, loading, data_list, data_pagination } = useSelector(
    (state) => state.accounting_rules,
  );
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  // Use State
  const loadMoreSize = 20;
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModalActivation, setOpenModalActivation] = useState(false);
  const [typeStatus, setTypeStatus] = useState("");
  const [accountingRuleId, setAccountingRuleId] = useState(null);
  const [accountingName, setAccountingName] = useState("");
  const [modalError, setModalError] = useState(false);
  const hasMore = data_list.length < (data_pagination?.totalElements || 0);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const { remark } = form.getFieldsValue();

  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAccountingRulesPaginate({
        search: reqSearch,
        sort,
        page: 1,
        pageSize: loadMoreSize,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // handle activation
  const handleActiveOrInactive = (record) => {
    setOpenModalActivation(true);
    setTypeStatus(record?.status);
    setAccountingRuleId(record?.masterAccountingRuleId);
    setAccountingName(record?.classificationTypeName);
  };

  // handle detail
  const handleDetail = async (id) => {
    setOpenModal(true);
    await dispatch(getDetailAccountingRules(id)).unwrap();
  };

  // handle cancel modal
  const handleCancel = () => {
    setOpenModal(false);
    setOpenModalActivation(false);
    form.resetFields();
  };

  // handle save activation
  const handleSaveActivation = async (formValue) => {
    const body = {
      ...formValue,
      masterAccountingRuleId: accountingRuleId,
    };
    await dispatch(activationAccountingRules(body)).unwrap();
    setOpenModalActivation(false);
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    await dispatch(
      getAccountingRulesPaginate({
        page: 1,
        pageSize: loadMoreSize,
        sort,
        search: reqSearch,
        isLoadMore: false,
      }),
    ).unwrap();
    form.resetFields();
  };

  // base columns with useMemo
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 90,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "classificationTypeName",
        title: "CLASSIFICATION TYPE",
        dataIndex: "classificationTypeName",
        sorter: true,
        width: 400,
        filteredValue: [search?.classificationTypeName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "classificationTypeName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "classificationTypeName",
            hasValue(search["classificationTypeName"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "code",
        title: "CODE",
        dataIndex: "code",
        sorter: true,
        width: 200,
        filteredValue: [search?.code] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "code",
            hasValue(search["code"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "receivableAccount",
        title: "RECEIVABLE ACCOUNT",
        dataIndex: "receivableAccount",
        sorter: true,
        width: 300,
        filteredValue: [search?.receivableAccount] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "receivableAccount",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "receivableAccount",
            hasValue(search["receivableAccount"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "revenueAccount",
        title: "REVENUE ACCOUNT",
        dataIndex: "revenueAccount",
        sorter: true,
        width: 300,
        filteredValue: [search?.revenueAccount] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "revenueAccount",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "revenueAccount",
            hasValue(search["revenueAccount"]),
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        width: 450,
        ellipsis: {
          showTitle: false,
        },
        filteredValue: [search?.description] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        width: 120,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search,
          ),
      },
    ],
    [search, searchText, searchedColumn],
  );

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: "",
      breadcrumbName: "Accounting Rules",
    },
  ];

  // onsort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Load More (infinite scroll)
  const handleLoadMore = useCallback(async () => {
    if (data_list.length >= (data_pagination?.totalElements || 0)) return;
    const nextPage = Math.floor(data_list.length / loadMoreSize) + 1;
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    await dispatch(
      getAccountingRulesPaginate({
        page: nextPage,
        pageSize: loadMoreSize,
        search: reqSearch,
        sort,
        isLoadMore: true,
      }),
    );
  }, [dispatch, data_list.length, data_pagination, search, sort]);

  // Handle Refresh
  const handleRefresh = useCallback(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAccountingRulesPaginate({
        search: reqSearch,
        sort,
        page: 1,
        pageSize: loadMoreSize,
        isLoadMore: false,
      }),
    );
  }, [dispatch, search, sort]);

  // handle download
  const handleDownload = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      downloadAccountingRules({
        search: reqSearch,
        sort,
        page: 1,
        pageSize: loadMoreSize,
      }),
    );
  };

  // handle confirm retry
  const handleConfirm = () => {
    if (bodyError?.action === "GET_ACCOUNTING_RULES_PAGINATE") {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getAccountingRulesPaginate({
          search: reqSearch,
          sort,
          page: 1,
          pageSize: loadMoreSize,
          isLoadMore: false,
        }),
      );
    } else if (bodyError?.action === "DOWNLOAD_ACCOUNTING_RULES") {
      handleDownload();
    } else if (bodyError?.action === "GET_DETAIL_ACCOUNTING_RULES") {
      const getPathRequest = bodyError?.request?.responseURL?.split("/");
      const getParamsId = getPathRequest[getPathRequest?.length - 1];
      dispatch(getDetailAccountingRules(getParamsId));
    } else {
      handleSaveActivation();
    }
    dispatch(clearBodyMessage());
  };

  // handle retry
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  const itemActions = [
    //action toolbar
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_ACCOUNTING_RULES}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNTING_RULES}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "20px" }} />}
            type="submit"
          >
            Create Accounting Rules
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <span className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer" onClick={() => handleDetail(record?.masterAccountingRuleId)}>
              <IconViewList width={20} />
            </span>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const disabled = record?.status === "INACTIVE";
        return (
          <Tooltip title="Update">
            <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
              <Link
                to={!disabled ? ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNTING_RULES : undefined}
                state={!disabled ? { id: record?.masterAccountingRuleId } : undefined}
                className={`inline-flex items-center transition-colors duration-200 ${disabled ? "text-gray-300 pointer-events-none" : "text-[#1976D2] hover:text-[#1976D2]"}`}
              >
                <IconEditNx width={20} />
              </Link>
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActive = record?.status?.toUpperCase() === "ACTIVE";
        const handleToggle = () => { handleActiveOrInactive(record); };
        return (
          <Tooltip title={isActive ? "Inactivate" : "Activate"}>
            {isActive
              ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconInactive width={20} />
                </span>
              : <span className="inline-flex items-center text-green-600 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                  <IconActive width={20} />
                </span>
            }
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["Activate", "View", "Update"],
    itemActions,
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <Spin spinning={loading}>
      <>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">ACCOUNTING RULES LIST</p>
              <div className="flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              idTable="accountingRulesTable"
              dataSource={data_list}
              columns={processedColumns}
              totalData={data_pagination?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              useInfiniteScroll={true}
              usePagination={false}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              showRefresh={true}
              onRefresh={handleRefresh}
              refreshLabel="Refresh"
            />
          </div>
        </CardContainer>

        <ModalCustom
          isOpen={openModal}
          type={"detail"}
          header={"accounting rules detail"}
          width={850}
          handleCancel={handleCancel}
          footer={
            <ButtonComponent onClick={handleCancel}>Cancel</ButtonComponent>
          }
        >
          <CardComponent header={"Accounting rules information"}>
            <div className="w-full grid grid-cols-4">
              <DetailText label={"Classification Type"}>
                {data_detail?.classificationTypeName}
              </DetailText>
              <DetailText label={"Code"}>{data_detail?.code}</DetailText>
              <DetailText label={"Receivable Account"}>
                {data_detail?.receivableAccount}
              </DetailText>
              <DetailText label={"Revenue Account"}>
                {data_detail?.revenueAccount}
              </DetailText>
            </div>
            <DetailText label={"Status"}>
              {toTitleCase(data_detail?.status)}
            </DetailText>
            <div className="w-full">
              <DetailText label={"Description"}>
                {data_detail?.description}
              </DetailText>
            </div>
          </CardComponent>
          <CardComponent header={"history log information"} cols={5}>
            <DetailText label={"Record ID"}>
              {data_detail?.masterAccountingRuleId}
            </DetailText>
            <DetailText label={"Created Date"}>
              {hasValue(data_detail?.createdDate) &&
                moment(data_detail?.createdDate)?.format(
                  dateFormatting?.dateTime,
                )}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {hasValue(data_detail?.updatedDate) &&
                moment(data_detail?.updatedDate).format(
                  dateFormatting?.dateTime,
                )}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </CardComponent>
        </ModalCustom>

        <ModalCustom
          isOpen={openModalActivation}
          header={`${
            typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"
          } INFORMATION`}
          width={700}
          type={"confirmation"}
          handleCancel={handleCancel}
          footer={
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
              <ButtonComponent onClick={handleCancel} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form="inactivateForm"
                type="submit"
                htmlType="submit"
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id="inactivateForm"
            form={form}
            onFinish={handleSaveActivation}
            layout="vertical"
          >
            <div className="flex flex-col gap-6">
              <Alert
                message={`Are you sure want to ${
                  typeStatus === "ACTIVE" ? "inactivate" : "activate"
                } accounting rule named ${accountingName}?`}
                icon={<InfoCircleOutlined />}
                type={"warning"}
                showIcon
                className="inactivate-alert"
              />
              <Form.Item
                name={"remark"}
                label={"Remark"}
                rules={formMessageRequired("remark")}
                className="w-full"
              >
                <InputComponent
                  group
                  rows={1}
                  type="textarea"
                  placeholder={"Type your remark"}
                />
              </Form.Item>
            </div>
          </Form>
        </ModalCustom>

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">
              {bodyError?.response?.data?.message?.toString()}
            </p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </>
    </Spin>
  );
};

export default ViewAccountingRules;
