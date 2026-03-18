import React, { useState, useEffect, useRef, useMemo } from "react";
import { Alert, Checkbox, Form, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  activeInactiveLateCharge,
  downloadLateCharge,
  getLateChargePaginate,
} from "../../../../../redux/slices/account_management/MasterData/late_charges";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import {
  formMessageRequired,
  hasValue,
  renderColumn,
} from "../../../../../utils";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";

const ViewLateCharges = () => {
  const { data, loading } = useSelector((state) => state.late_charge);
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [openModalActivation, setOpenModalActivation] = useState(false);
  const [typeStatus, setTypeStatus] = useState("");
  const [lateChargeId, setLateChargeId] = useState(null);
  const [lateChargeName, setLateChargeName] = useState("");
  const [modalError, setModalError] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getLateChargePaginate({ search: reqSearch, sort, page, pageSize })
    );
  }, [dispatch, page, pageSize, search, sort]);

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

  // handle activation
  const handleActiveOrInactive = (record) => {
    setOpenModalActivation(true);
    setTypeStatus(record?.status);
    setLateChargeId(record?.lateChargeId);
    setLateChargeName(record?.name);
  };

  // handle cancel modal
  const handleCancel = () => {
    setOpenModalActivation(false);
    form.resetFields();
  };

  // handle save activation
  const handleSaveActivation = async (formValue) => {
    const body = {
      ...formValue,
      lateChargeId: lateChargeId,
    };
    const activeOrInactive =
      typeStatus === "ACTIVE" ? "inactivate" : "activate";
    await dispatch(
      activeInactiveLateCharge({ body, activeOrInactive })
    ).unwrap();
    setOpenModalActivation(false);
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    await dispatch(
      getLateChargePaginate({ page, pageSize, sort, search: reqSearch })
    ).unwrap();
    form.resetFields();
  };

  // base columns with useMemo
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "name",
        title: "LATE CHARGE NAME",
        dataIndex: "name",
        sorter: true,
        width: 240,
        ellipsis: {
          showTitle: false,
        },
        filteredValue: [search?.name] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "name",
            hasValue(search["name"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "currency",
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
        sorter: true,
        width: 140,
        filteredValue: [search?.currency] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "currency",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "currency",
            hasValue(search["currency"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "criteria",
        title: "CRITERIA",
        dataIndex: "criteria",
        align: "left",
        sorter: true,
        width: 240,
        ellipsis: {
          showTitle: false,
        },
        filteredValue: [search?.criteria] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "criteria",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "criteria",
            hasValue(search["criteria"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "maxAmount",
        title: "LATE CHARGE MAXIMUM AMOUNT",
        dataIndex: "maxAmount",
        align: "right",
        sorter: true,
        width: 320,
        filteredValue: [search?.maxAmountReal] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "maxAmountReal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "maxAmount",
            hasValue(search["maxAmountReal"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "formula",
        title: "LATE CHARGE RULE FORMULA",
        dataIndex: "formula",
        sorter: true,
        width: 320,
        ellipsis: {
          showTitle: false,
        },
        filteredValue: [search?.formula] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "formula",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "formula",
            hasValue(search["formula"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        width: 240,
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
          true
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            true,
            "input",
            search
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
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
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
      breadcrumbName: "Late Charge",
    },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // onsort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field === "maxAmount" ? "maxAmountReal" : sorter.field}~${
            sorter.order === "ascend" ? "asc" : "desc"
          }`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownload = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(downloadLateCharge({ search: reqSearch, sort, page, pageSize }));
  };

  // handle confirm retry
  const handleConfirm = () => {
    if (bodyError?.action === "GET_LATE_CHARGE_PAGINATE") {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getLateChargePaginate({ search: reqSearch, sort, page, pageSize })
      );
    } else if (bodyError?.action === "DOWNLOAD_LATE_CHARGE") {
      handleDownload();
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
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
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
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_LATE_CHARGES}>
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
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_LATE_CHARGES}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Late Charge
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
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES}
              state={{ id: record?.lateChargeId }}
            >
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            {record?.status === "INACTIVE" ? (
              <div className={"cursor-not-allowed"}>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              </div>
            ) : (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LATE_CHARGES}
                state={{ id: record?.lateChargeId }}
              >
                <div>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            )}
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  handleActiveOrInactive(record);
                }}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["Activate", "View", "Update"],
    itemActions
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
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">LATE CHARGE LIST</p>
              <div className="flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              dataSource={data?.result}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

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
                } late charge named ${lateChargeName}?`}
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
      </LayoutMenu>
    </Spin>
  );
};

export default ViewLateCharges;
