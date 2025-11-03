import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Input } from "antd";
import { Link, NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { getListPrabillingInitPopulate } from "../../../../redux/slices/rating_billing_invoice/praBilling";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import moment from "moment";

const { Search } = Input;

const PrabillingPage = () => {
  const { loading, list_prabilling_init, prabilling_pagination } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState("createdDtm~desc");

  useEffect(() => {
    const backendPage = page - 1;

    console.log("🔍 Fetching data with:", {
      page: backendPage,
      size: pageSize,
      sort,
      search: searchKeyword,
    });

    dispatch(
      getListPrabillingInitPopulate({
        search: searchKeyword,
        page: backendPage,
        size: pageSize,
        sort: sort,
      })
    );
  }, [dispatch, page, pageSize, searchKeyword, sort]);

  const handleGlobalSearch = (value) => {
    setSearchKeyword(value);
    setPage(1);
  };

  const allColumnDefinitions = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "initCode",
        title: "INIT CODE",
        dataIndex: "initCode",
        sorter: true,
        align: "left",
        width: 250,
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        align: "left",
        sorter: true,
        width: 300,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        align: "center",
        sorter: true,
      },
      {
        key: "billPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billPeriod",
        align: "center",
        sorter: true,
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        align: "left",
        sorter: true,
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        align: "center",
        sorter: true,
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        align: "center",
        sorter: true,
        render: (text) =>
          text ? moment(text).format("DD MMM YYYY HH:mm:ss") : "-",
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        align: "left",
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "totalCustomer",
        title: "TOTAL CUSTOMER",
        dataIndex: "totalCustomer",
        align: "right",
        sorter: true,
        render: (text) => text?.toLocaleString() || "-",
      },
      {
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        align: "left",
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text || "-"}
          </Tooltip>
        ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        align: "center",
        sorter: true,
        width: 150,
        render: (status) => {
          const statusConfig = {
            0: { text: "Open", color: "#1890ff" },
            1: { text: "In Progress", color: "#faad14" },
            2: { text: "Success", color: "#52c41a" },
            3: { text: "Failed", color: "#f5222d" },
            5: { text: "Open", color: "#1890ff" },
          };

          const config = statusConfig[status] || {
            text: "Unknown",
            color: "#d9d9d9",
          };

          return (
            <span style={{ color: config.color, fontWeight: 500 }}>
              {config.text}
            </span>
          );
        },
      },
    ],
    [page, pageSize]
  );

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: "",
      breadcrumbName: "Prabilling",
    },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    if (pageSize !== pageSizeChange) {
      setPage(1);
      setPageSize(pageSizeChange);
    } else {
      setPage(pageChange);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field && sorter.order) {
      const sortDirection = sorter.order === "ascend" ? "asc" : "desc";
      setSort(`${sorter.field}~${sortDirection}`);
    } else {
      setSort("createdDtm~desc");
    }
  };

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.PRABILLING_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create Prabilling
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.PRABILLING_DETAIL}
            state={{ id: record?.initCode }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const columnActionPermission = useColumnActionPermission(
    ["view"],
    itemGrantAccess
  );

  const columns = useMemo(() => {
    return [...allColumnDefinitions, ...columnActionPermission];
  }, [allColumnDefinitions, columnActionPermission]);

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full justify-end flex gap-2">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"PRABILLING LIST"}>
          {/* Search bar di dalam container, di atas tabel */}
          <div className="mb-3 flex justify-end">
            <Input
              placeholder="Search..."
              allowClear
              size="middle"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (e.target.value === "") handleGlobalSearch("");
              }}
              onPressEnter={(e) => handleGlobalSearch(e.target.value)}
              prefix={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#999"
                  style={{ width: 18, height: 18 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
                  />
                </svg>
              }
              style={{
                width: 280,
                borderRadius: "9999px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                padding: "6px 12px",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
              }}
            />
          </div>

          <div className="my-5">
            <TablePaginationNew
              columns={columns}
              dataSource={list_prabilling_init}
              totalData={prabilling_pagination.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onTableChange={handleTableChange}
              tableScrolled={{ x: 2500, y: 600 }}
              rowKey={(record) => record.initId}
              useFixColumn={true}
              defaultFixedColumns={{
                no: "left",
                status: "right",
                action: "right",
              }}
            />
          </div>
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default PrabillingPage;
