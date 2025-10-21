import React, { useRef } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Alert, Checkbox, Form, Spin, Tooltip } from "antd";
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
import BaseContainer from "../../../../../components/BaseContainer";
import TablePagination from "../../../../../components/TablePagination";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activationAddress,
  downloadAddress,
  getAddressesPaginate,
} from "../../../../../redux/slices/account_management/MasterData/addresses_slice";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { formMessageRequired, renderColumn } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";

const ViewAddresses = () => {
  const { data, loading } = useSelector((state) => state.address);
  const { bodyError } = useSelector((state) => state?.general);

  const dispatch = useDispatch();
  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [typeStatus, setTypeStatus] = useState("");
  const [addressId, setAddressId] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [form] = Form.useForm();

  const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
    handleActiveOrInactive = () => {},
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ADDRESS",
        dataIndex: "fullAddress",
        sorter: true,
        width: 500,
        ...getColumnSearchPropsPaging(
          "fullAddress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        ellipsis: {
          showTitle: false,
        },
        render: (text) =>
          renderColumn(
            "fullAddress",
            searchedColumn,
            searchText,
            text?.toUpperCase(),
            true,
            "input",
            search,
          ),
      },
      {
        title: "TYPE",
        dataIndex: "type",
        sorter: true,
        width: 200,
        ...getColumnSearchPropsPaging(
          "type",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "type",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "BUILDING",
        dataIndex: "building",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "building",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "building",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "FLOOR",
        dataIndex: "floor",
        sorter: true,
        width: 130,
        align: "center",
        ...getColumnSearchPropsPaging(
          "floor",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "floor",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "HOUSE NAME",
        dataIndex: "houseName",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "houseName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "houseName",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "STREET NAME",
        dataIndex: "streetName",
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "streetName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "streetName",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "BLOCK",
        dataIndex: "block",
        sorter: true,
        width: 180,
        ...getColumnSearchPropsPaging(
          "block",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "block",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "HOUSE NUMBER",
        dataIndex: "houseNumber",
        sorter: true,
        width: 180,
        align: "center",
        ...getColumnSearchPropsPaging(
          "houseNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "houseNumber",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "RT",
        dataIndex: "neighborhood1",
        sorter: true,
        width: 130,
        align: "center",
        ...getColumnSearchPropsPaging(
          "neighborhood1",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "neighborhood1",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "RW",
        dataIndex: "neighborhood2",
        sorter: true,
        width: 130,
        align: "center",
        ...getColumnSearchPropsPaging(
          "neighborhood2",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "neighborhood2",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "ADDITIONAL NOTE",
        dataIndex: "additionalInfo",
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "additionalInfo",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "additionalInfo",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "SUB DISTRICT",
        dataIndex: "subDistrict",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "subDistrict",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "subDistrict",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "DISTRICT",
        dataIndex: "district",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "district",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "district",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "CITY",
        dataIndex: "city",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "city",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "city",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "PROVINCE",
        dataIndex: "province",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "province",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "province",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "COUNTRY",
        dataIndex: "country",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "country",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "POSTAL CODE",
        dataIndex: "postalCode",
        sorter: true,
        align: "center",
        ...getColumnSearchPropsPaging(
          "postalCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "postalCode",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        width: 320,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "description",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        width: 120,
        fixed: "right",
        ...getColumnSearchPropsPaging(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "status",
            searchedColumn,
            searchText,
            text,
            false,
            "status",
            search,
          ),
      },
    ];
  };
  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getAddressesPaginate({ search: reqSearch, sort, page, pageSize }));
  }, [dispatch, page, pageSize, search, sort]);

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

  const handleActiveOrInactive = (record) => {
    setOpenModal(true);
    setTypeStatus(record?.status);
    setAddressId(record?.addressId);
    setFullAddress(record?.fullAddress);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const handleSaveActivation = async (formValue) => {
    try {
      setOpenModal(false);
      const body = {
        ...formValue,
        id: addressId,
      };
      await dispatch(activationAddress(body))?.unwrap();

      const reqSearch = encodeURIComponent(JSON.stringify(search));
      await dispatch(
        getAddressesPaginate({ page, pageSize, sort, search: reqSearch }),
      )?.unwrap();
      form.resetFields();
    } catch (error) {
      form.resetFields();
      setOpenModal(false);
    }
  };

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
      breadcrumbName: "Address",
    },
  ];
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // on sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownload = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(downloadAddress({ search: reqSearch, sort, page, pageSize }));
  };

  // handle confirm retry
  const handleConfirm = () => {
    if (bodyError?.action === "GET_ADDRESS_PAGINATE") {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getAddressesPaginate({ page, pageSize, sort, search: reqSearch }),
      ).unwrap();
    } else if (bodyError?.action === "DOWNLOAD_ADDRESS") {
      handleDownload();
    } else {
      handleSaveActivation();
    }
  };

  // handle retry
  const handleRetry = () => {
    handleCancelTryAgain();
    handleConfirm();
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  const itemActions = [
    //action toolbar
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_GAS_SOURCE}>
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
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ADDRESSES}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Addresses
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
            <div className="pt-1">
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_ADDRESSES}
                state={{ id: record.addressId }}
              >
                <SVGIcon name="IconDetail" width={24} />
              </Link>
            </div>
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
            <div
              className={`pt-1 ${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
            >
              <Link
                to={
                  record?.status?.toLowerCase() !== "inactive" &&
                  ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ADDRESSES
                }
                state={
                  record?.status?.toLowerCase() !== "inactive" && {
                    id: record.addressId,
                  }
                }
              >
                <SVGIcon
                  name="IconEdit"
                  className={`${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
                  color={
                    record?.status?.toLowerCase() === "inactive"
                      ? "#8D91A0"
                      : "#ACC424"
                  }
                  width={24}
                />
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
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleActiveOrInactive(record);
                }}
                checked={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Toolbar items={itemActions} />

        <BaseContainer header={"Addresses List"}>
          <div className="w-full">
            <TablePagination
              dataSource={data?.result}
              columns={[
                ...columns(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  // handleActiveOrInactive
                ),
                ...useColumnActionPermission(
                  ["Activate", "View", "Update"],
                  itemActions,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSort}
              totalData={data?.page?.totalElements}
              tableScrolled={{
                x: 5000,
                y: 500,
              }}
            />
          </div>
        </BaseContainer>
        {openModal && (
          <ModalCustom
            isOpen={openModal}
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
                  } address ${fullAddress}?`}
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
        )}
      </Spin>

      {/* modal retry */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewAddresses;
