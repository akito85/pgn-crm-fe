import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { getListPrabillingInitPopulate } from "../../../../redux/slices/rating_billing_invoice/praBilling";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import moment from "moment";
import CardContainer from "../../../../components/CardContainer";
import { EyeOutlined } from "@ant-design/icons";

const PrabillingPage = () => {
  const { loading, list_prabilling_init, prabilling_pagination } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));

  useEffect(() => {
    dispatch(
      getListPrabillingInitPopulate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, page, pageSize, sort]);

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
        key: "initCode",
        title: "INIT CODE",
        dataIndex: "initCode",
        sorter: true,
        isClassification:true,
        width: 150,
        filteredValue: [search?.initCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "initCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "initCode",
            hasValue(search["initCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        isClassification:true,
        sorter: true,
        width: 200,
        filteredValue: [search?.sor] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "sor",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "sor",
            hasValue(search["sor"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.billingCycle] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billingCycle",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billingCycle",
            hasValue(search["billingCycle"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "billPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billPeriod",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.billPeriod] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "billPeriod",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datePeriod"
        ),
        render: (text) =>
          renderDateColumn(
            "billPeriod",
            hasValue(search["billPeriod"]),
            searchText,
            text,
            "datePeriod",
            search
          ),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        align: "left",
        width: 200,
        sorter: true,
        filteredValue: [search?.processName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "processName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "processName",
            hasValue(search["processName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        isClassification:true,
        width: 130,
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "createdBy",
            hasValue(search["createdBy"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        isClassification:true,
        sorter: true,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY HH:mm:ss")
            : "";
          return renderDateColumn(
            "createdDtm",
            hasValue(search["createdDtm"]),
            searchText,
            formattedDate,
            "datetime",
            search
          );
        },
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        align: "left",
        sorter: true,
        filteredValue: [search?.message] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "message",
            hasValue(search["message"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "totalCustomer",
        title: "TOTAL CUSTOMER",
        dataIndex: "totalCustomer",
        isNumber: true,
        sorter: true,
        filteredValue: [search?.totalCustomer] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalCustomer",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => {
          const displayText = text?.toLocaleString() || "";
          return renderColumn(
            "totalCustomer",
            hasValue(search["totalCustomer"]),
            searchText,
            displayText,
            false,
            "input",
            search
          );
        },
      },
      {
        key: "remark",
        title: "REMARK",
        dataIndex: "remark",
        align: "left",
        sorter: true,
        filteredValue: [search?.remark] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "remark",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "remark",
            hasValue(search["remark"]),
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
        align: "center",
        sorter: true,
        width: 150,
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
          const displayText = config.text;
          return renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            displayText,
            false,
            "status",
            search
          );
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  const routes = [
    { path: "", breadcrumbName: "Rating Billing" },
    { path: "", breadcrumbName: "Prabilling" },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
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
      render: (record) => (
        <Link
          to={RBI_ROUTES.PRABILLING_DETAIL}
          state={{ id: record?.initCode }}
          style={{ lineHeight: 0 }}
        >
          <Tooltip title="Detail">
            <EyeOutlined style={{ fontSize: "20px" }} />
          </Tooltip>
        </Link>
      ),
    },
  ];

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess).map(
    (col) => ({
      ...col,
      width: 80,
      align: "center",
    })
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
              <p className="w-full mt-[15px] font-bold text-primary">
                PRABILLING LIST
              </p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div>
            <TableRBI
              dataSource={list_prabilling_init}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={prabilling_pagination?.totalElements || 0}
              tableScrolled={{ x: 2500, y: 525 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default PrabillingPage;
