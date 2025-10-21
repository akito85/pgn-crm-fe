import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Button, Dropdown, Checkbox, Radio, Divider } from "antd";
import { Link, NavLink } from "react-router-dom";
import { SettingOutlined, PushpinOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { getListPrabillingInitPopulate } from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { hasValue, renderColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import moment from "moment";

const PrabillingPage = () => {
  const { loading, list_prabilling_init, prabilling_pagination } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  
  // Column fixing state
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    initCode: "left",
    status: "right"
  });
  const [columnFixDropdownVisible, setColumnFixDropdownVisible] = useState(false);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchs, setSearchs] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("createdDtm~desc");

  useEffect(() => {
    const backendPage = page - 1;

    const filteredSearchs = Object.entries(searchs)
      .filter(([_, value]) => value && value.trim() !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const searchString =
      Object.keys(filteredSearchs).length > 0
        ? JSON.stringify(filteredSearchs)
        : "";

    console.log("Dispatching with params:", {
      search: searchString,
      page: backendPage,
      pageSize,
      sort,
    });

    dispatch(
      getListPrabillingInitPopulate({
        search: searchString,
        page: backendPage,
        pageSize: pageSize,
        sort: sort,
      })
    );
  }, [dispatch, page, pageSize, searchs, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);
    setSearchs((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearchs((prevState) => {
      const newSearch = { ...prevState };
      delete newSearch[dataIndex];
      return newSearch;
    });
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
        filteredValue: [searchs?.initCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["initCode"]),
            searchText,
            text,
            false,
            "input",
            searchs
          ),
      },
      {
        key: "sor",
        title: "SOR",
        dataIndex: "sor",
        align: "left",
        sorter: true,
        width: 300,
        filteredValue: [searchs?.sor] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["sor"]),
            searchText,
            text,
            true,
            "input",
            searchs
          ),
      },
      {
        key: "billingCycle",
        title: "BILLING CYCLE",
        dataIndex: "billingCycle",
        align: "center",
        sorter: true,
        filteredValue: [searchs?.billingCycle] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["billingCycle"]),
            searchText,
            text,
            false,
            "input",
            searchs
          ),
      },
      {
        key: "billPeriod",
        title: "BILLING PERIOD",
        dataIndex: "billPeriod",
        align: "center",
        sorter: true,
        filteredValue: [searchs?.billPeriod] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
          "billPeriod",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "billPeriod",
            hasValue(searchs["billPeriod"]),
            searchText,
            text,
            false,
            "input",
            searchs
          ),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        align: "left",
        sorter: true,
        filteredValue: [searchs?.processName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["processName"]),
            searchText,
            text,
            false,
            "input",
            searchs
          ),
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        align: "center",
        sorter: true,
        filteredValue: [searchs?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["createdBy"]),
            searchText,
            text,
            false,
            "input",
            searchs
          ),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        align: "center",
        sorter: true,
        filteredValue: [searchs?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
          "createdDtm",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY HH:mm:ss")
            : "-";
          return renderColumn(
            "createdDtm",
            hasValue(searchs["createdDtm"]),
            searchText,
            formattedDate,
            false,
            "input",
            searchs
          );
        },
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        align: "left",
        sorter: true,
        filteredValue: [searchs?.message] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["message"]),
            searchText,
            text,
            true,
            "input",
            searchs
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
        filteredValue: [searchs?.remark] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          searchs,
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
            hasValue(searchs["remark"]),
            searchText,
            text,
            true,
            "input",
            searchs
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
    [page, pageSize, searchs, searchText, searchedColumn]
  );

  const handleColumnFixChange = (columnKey, checked) => {
    if (checked) {
      const columnIndex = allColumnDefinitions.findIndex(
        (col) => col.key === columnKey
      );
      const isLastColumn = columnIndex === allColumnDefinitions.length - 1;

      let defaultPosition = "left";
      if (isLastColumn) {
        defaultPosition = "right";
      }

      setFixedColumns((prev) => ({ ...prev, [columnKey]: defaultPosition }));
    } else {
      const newFixed = { ...fixedColumns };
      delete newFixed[columnKey];
      setFixedColumns(newFixed);
    }
  };

  const handleColumnPositionChange = (columnKey, position) => {
    setFixedColumns((prev) => ({ ...prev, [columnKey]: position }));
  };

  const canFixLeft = (columnIndex) => {
    return columnIndex !== allColumnDefinitions.length - 1;
  };

  const canFixRight = (columnIndex) => {
    return columnIndex !== 0;
  };

  const columnPrabillingInit = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    allColumnDefinitions.forEach((col) => {
      const fixedPos = fixedColumns[col.key];
      const colWithFixed = { ...col, fixed: fixedPos || undefined };

      if (fixedPos === "left") {
        leftFixed.push(colWithFixed);
      } else if (fixedPos === "right") {
        rightFixed.push(colWithFixed);
      } else {
        normal.push(colWithFixed);
      }
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }, [allColumnDefinitions, fixedColumns]);

  const columnFixMenu = (
    <div
      style={{
        padding: "12px",
        minWidth: "320px",
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#262626",
        }}
      >
        <PushpinOutlined />
        Fix Columns Position
      </div>
      <Divider style={{ margin: "8px 0" }} />

      {allColumnDefinitions.map((col, index) => {
        const isFixed = !!fixedColumns[col.key];
        const position = fixedColumns[col.key] || "left";
        const isFirstColumn = index === 0;
        const isLastColumn = index === allColumnDefinitions.length - 1;

        return (
          <div
            key={col.key}
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: isFixed ? "#f0f5ff" : "#fafafa",
              borderRadius: "6px",
              border: isFixed ? "1px solid #d6e4ff" : "1px solid #f0f0f0",
              transition: "all 0.3s",
            }}
          >
            <div style={{ marginBottom: isFixed ? "8px" : "0" }}>
              <Checkbox
                checked={isFixed}
                onChange={(e) =>
                  handleColumnFixChange(col.key, e.target.checked)
                }
                style={{ fontWeight: "500" }}
              >
                {col.title}
              </Checkbox>
            </div>

            {isFixed && (
              <div
                style={{
                  marginLeft: "24px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#595959",
                      fontWeight: "500",
                    }}
                  >
                    Position:
                  </span>
                  <Radio.Group
                    value={position}
                    onChange={(e) =>
                      handleColumnPositionChange(col.key, e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                    style={{ display: "flex", gap: "6px" }}
                  >
                    <Radio.Button value="left" disabled={!canFixLeft(index)}>
                      Left
                    </Radio.Button>
                    <Radio.Button value="right" disabled={!canFixRight(index)}>
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>
                {(isFirstColumn || isLastColumn) && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#8c8c8c",
                      marginTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {isFirstColumn && "* First column can only be fixed left"}
                    {isLastColumn && "* Last column can only be fixed right"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Divider style={{ margin: "12px 0" }} />

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <Button
          size="small"
          onClick={() => setFixedColumns({})}
          style={{ flex: 1 }}
        >
          Clear All
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => setColumnFixDropdownVisible(false)}
          style={{ flex: 1 }}
        >
          Done
        </Button>
      </div>
    </div>
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
    console.log("Page change:", { pageChange, pageSizeChange });

    if (pageSize !== pageSizeChange) {
      setPage(1);
      setPageSize(pageSizeChange);
    } else {
      setPage(pageChange);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log("Table change:", { pagination, filters, sorter });

    if (sorter.field && sorter.order) {
      const sortDirection = sorter.order === "ascend" ? "asc" : "desc";
      setSort(`${sorter.field}~${sortDirection}`);
      console.log("Sort changed to:", `${sorter.field}~${sortDirection}`);
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
    return [...columnPrabillingInit, ...columnActionPermission];
  }, [columnPrabillingInit, columnActionPermission]);

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full justify-end flex gap-2">
          <Dropdown
            overlay={columnFixMenu}
            trigger={["click"]}
            visible={columnFixDropdownVisible}
            onVisibleChange={setColumnFixDropdownVisible}
            placement="bottomRight"
          >
            <Button icon={<SettingOutlined />}>
              Fix Columns ({Object.keys(fixedColumns).length})
            </Button>
          </Dropdown>
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"PRABILLING JOB LIST"}>
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
            />
          </div>
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default PrabillingPage;