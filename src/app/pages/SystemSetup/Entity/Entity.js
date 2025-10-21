import React, { useCallback, useEffect, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import {
  downloadExcel,
  getAllEntityPaginate,
  inactiveEntity,
} from "../../../../redux/slices/system_setup/entity";
import { Spin, Checkbox, Alert, Form, Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import TablePagination from "../../../../components/TablePagination";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { useRef } from "react";
import InputComponent from "../../../../components/InputComponent";
import { intToNPWP } from "../../../../utils/npwp";
import { formMessageRequired, renderColumn } from "../../../../utils";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const EntityPage = () => {
  const { data: listEntity, loading } = useSelector((state) => state.entity);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [entityId, setEntityId] = useState("");
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dataSource = listEntity?.result;
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [record, setRecord] = useState({});

  // handle fetch
  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllEntityPaginate({
        search: encodeURIComponent(JSON?.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

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

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "entityName",
      sorter: true,
      width: 300,
      ...getColumnSearchPropsPaging(
        "entityName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "entityName",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ENTITY CODE",
      dataIndex: "entityCode",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "entityCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "entityCode",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "email",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "email",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "address",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "address",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "TAX IDENTIFIER",
      dataIndex: "taxIdentifier",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "taxIdentifier",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "taxIdentifier",
          searchedColumn,
          searchText,
          intToNPWP(text),
          false,
          "input",
          search,
        ),
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      align: "left",
      sorter: true,
      width: 200,
      ...getColumnSearchPropsPaging(
        "phone",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "phone",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "FAX NUMBER",
      dataIndex: "fax",
      align: "left",
      sorter: true,
      width: 200,
      ...getColumnSearchPropsPaging(
        "fax",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "fax",
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
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
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
      width: 120,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
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
          searchedColumn,
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ENTITY,
      breadcrumbName: "Entity",
    },
  ];
  const handleClear = () => {
    setRemark("");
    form.resetFields();
    setOpenModalConfirm(false);
  };
  const handleSaveModalInactivateFinal = async (formValue) => {
    const body = { ...formValue, id: entityId, status };
    await dispatch(inactiveEntity(body))
      .unwrap()
      .then(() => {
        handleFetch();
        handleClear();
      });
  };
  const handleDownload = (params) => {
    dispatch(downloadExcel(params));
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // item actions
  const itemActions = [
    // toolbar
    {
      action: "download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
            handleDownload({
              page,
              pageSize,
              search: encodeURIComponent(JSON.stringify(search)),
              sort,
            });
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_ENTITY}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Entity
          </ButtonComponent>
        </NavLink>
      ),
    },

    // table
    {
      action: "view",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={SYSTEM_SETUP_ROUTES.DETAIL_ENTITY}
              state={{ id: record?.entityId }}
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
      action: "update",
      type: "table",
      render: (record, data_length) => (
        <Tooltip title="Update">
          <div
            className={`${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
          >
            <Link
              to={
                record?.status?.toLowerCase() !== "inactive" &&
                SYSTEM_SETUP_ROUTES.UPDATE_ENTITY
              }
              state={
                record?.status?.toLowerCase() !== "inactive" && {
                  id: record?.entityId,
                }
              }
            >
              <div>
                <SVGIcon
                  className={`${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
                  color={
                    record?.status?.toLowerCase() === "inactive"
                      ? "#8D91A0"
                      : "#ACC424"
                  }
                  name="IconEdit"
                  width={24}
                />
              </div>
            </Link>
          </div>
        </Tooltip>
      ),
    },
    {
      action: "activate",
      type: "table",
      render: (record, data_length) => (
        <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
          <div>
            <Checkbox
              onClick={() => {
                setEntityId(record?.entityId);
                setStatus(record?.status);
                setOpenModalConfirm(true);
                setRecord(record);
                setTypeModal(
                  record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                );
              }}
              checked={record?.status !== "ACTIVE"}
            />
          </div>
        </Tooltip>
      ),
    },
  ];

  const columnActions = useColumnActionPermission(
    ["view", "activate", "update"],
    itemActions,
  );
  const handleRetry = () => {
    handleCancelTryAgain();
    handleFetch();
  };

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"ENTITY LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={dataSource}
              totalData={listEntity?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 525, x: 2300 }}
              onChange={handleChange}
              columns={[...columns, ...columnActions]}
              onSort={onSort}
            />
          </div>
        </BaseContainer>
      </Spin>
      <ModalCustom
        isOpen={openModalConfirm}
        header={`${
          typeModal === "ACTIVE" ? "ACTIVATE" : "INACTIVATE"
        } INFORMATION`}
        width={1000}
        type={"confirmation"}
        handleCancel={handleClear}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleClear} type="default">
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
          onFinish={handleSaveModalInactivateFinal}
        >
          <div className="flex flex-col gap-6">
            <Alert
              message={`Are you sure want to ${
                typeModal === "ACTIVE" ? "activate" : "inactivate"
              } entity named ${record?.entityName}?`}
              icon={<InfoCircleOutlined />}
              type={"warning"}
              showIcon
              className="inactivate-alert"
            />
            <Form.Item
              name={"remark"}
              rules={formMessageRequired("remark")}
              className="w-full"
            >
              <InputComponent
                group
                rows={1}
                type="textarea"
                value={remark}
                placeholder={"Type your remark"}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>
      {renderModal}
    </LayoutMenu>
  );
};

export default EntityPage;
