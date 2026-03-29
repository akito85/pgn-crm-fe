import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import SVGIcon from "../../../../assets/Icon/index";
import CardContainer from "../../../../components/CardContainer";
import Toolbar from "../../../../components/Toolbar";
import TableRBI from "../../../../components/TableRBI";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getAccountingDetailList,
  downloadAccounting,
} from "../../../../redux/slices/rating_billing_invoice/accounting";
import {
  columnsAccounting,
  computeRowSpans,
  ACCOUNTING_MERGED_FIELDS,
} from "./Table/TableAccounting";

const AccountingPage = () => {
  // Selector
  const { data, loading } = useSelector(
    (state) => state.rbiAccounting
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: [],
    right: ["action"],
  }));

  const handleRefresh = useCallback(() => {
    dispatch(
      getAccountingDetailList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      })
    );
    setPage(1);
  }, [dispatch, search, sort]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

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

  const handleLoadMore = async () => {
    const totalElements = data?.page?.totalElements || 0;
    const currentDataLength = dataSource?.length || 0;

    if (currentDataLength >= totalElements) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    await dispatch(
      getAccountingDetailList({
        search: encodeURIComponent(JSON.stringify(search)),
        page: nextPage,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: true,
      })
    );
    setPage(nextPage);
  };

  const hasMore =
    (dataSource?.length || 0) < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Breadcrumbs
  const routes = [
    {
      path: RBI_ROUTES.ACCOUNTING_VIEW,
      breadcrumbName: "Accounting",
    },
  ];

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadAccounting({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
          type="submit"
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.ACCOUNTING_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
          >
            Create Accounting
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.ACCOUNTING_DETAIL}
            state={{ id: record.entryId, record: record }}
          >
            <Tooltip title="Detail">
              <div className="pt-0">
                <SVGIcon name="IconDetail" width={20} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view"],
    itemGrantAccess
  ).map((col) => ({
    ...col,
    width: 100,
    align: "center",
  }));

  const rowSpans = useMemo(
    () => computeRowSpans(dataSource || [], [...ACCOUNTING_MERGED_FIELDS, "entryId"]),
    [dataSource]
  );

  const entryGroupNumbers = useMemo(() => {
    if (!dataSource) return [];
    const numbers = [];
    let groupCounter = 0;
    dataSource.forEach((_row, index) => {
      const span = rowSpans?.entryId?.[index];
      if (span > 0) groupCounter++;
      numbers[index] = groupCounter;
    });
    return numbers;
  }, [dataSource, rowSpans]);

  const baseColumns = useMemo(() => {
    const cols = columnsAccounting(
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
      rowSpans
    );
    // Group rows by entryId: the NO column shows a sequential group number
    // and spans all rows that share the same entryId.
    const noCol = cols.find((c) => c.key === "no");
    if (noCol) {
      noCol.render = (_text, _record, index) => ({
        children: entryGroupNumbers[index],
        props: { rowSpan: rowSpans?.entryId?.[index] ?? 1 },
      });
    }

    // All merged columns also span by entryId group so their cells align with NO.
    const mergedFieldSet = new Set(ACCOUNTING_MERGED_FIELDS);
    cols.forEach((col) => {
      const fieldKey = col.dataIndex || col.key;
      if (mergedFieldSet.has(fieldKey)) {
        const originalRender = col.render;
        col.render = (text, record, index) => {
          const rendered = originalRender(text, record, index);
          const span = rowSpans?.entryId?.[index] ?? 1;
          if (rendered && typeof rendered === "object" && "props" in rendered) {
            return { ...rendered, props: { ...rendered.props, rowSpan: span } };
          }
          return { children: rendered, props: { rowSpan: span } };
        };
      }
    });

    // Patch each filterable column's dropdown to add a Reset button.
    cols.forEach((col) => {
      const dataIndex = col.dataIndex;
      if (!dataIndex || !col.filterDropdown) return;
      const origDropdown = col.filterDropdown;
      col.filterDropdown = (props) => (
        <div>
          {origDropdown(props)}
          {search[dataIndex] != null && search[dataIndex] !== "" && (
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 8px 8px" }}>
              <button
                onClick={() => {
                  props.clearFilters?.();
                  setSearch((prev) => {
                    const next = { ...prev };
                    delete next[dataIndex];
                    return next;
                  });
                }}
                style={{
                  cursor: "pointer",
                  padding: "2px 8px",
                  fontSize: 12,
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                  background: "#fff",
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      );
    });

    return cols;
  }, [searchInput, searchedColumn, searchText, search, rowSpans, entryGroupNumbers]);

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
      // filteredValue tells Ant Design the filter is active → icon turns blue
      // and the dropdown input is pre-populated when re-opened.
      filteredValue: col.dataIndex
        ? search[col.dataIndex] != null && search[col.dataIndex] !== ""
          ? [search[col.dataIndex]]
          : null
        : undefined,
    }));
  }, [baseColumns, actionCols, search]);

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
    return dataSource?.map((item) => ({
      ...item,
      key: item.id,
    }));
  }, [dataSource]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="w-full mt-[15px] text-primary">Accounting List</p>
            <Toolbar items={itemGrantAccess} />
          </div>
        }
      >
        <div className="w-full">
          <style>{`
            #accounting-table .ant-table-tbody .ant-table-row.row-group-odd > td,
            #accounting-table .ant-table-tbody .ant-table-row.row-group-odd > td.ant-table-cell-fix-left,
            #accounting-table .ant-table-tbody .ant-table-row.row-group-odd > td.ant-table-cell-fix-right {
              background-color: #e6f0f4 !important;
            }
            #accounting-table .ant-table-tbody .ant-table-row.row-group-even > td,
            #accounting-table .ant-table-tbody .ant-table-row.row-group-even > td.ant-table-cell-fix-left,
            #accounting-table .ant-table-tbody .ant-table-row.row-group-even > td.ant-table-cell-fix-right {
              background-color: #ffffff !important;
            }
          `}</style>
          <TableRBI
            idTable="accounting-table"
            showExport={false}
            rowClassName={(_record, index) =>
              entryGroupNumbers[index] % 2 !== 0 ? "row-group-odd" : "row-group-even"
            }
            dataSource={dataSourceWithKeys}
            columns={processedColumns}
            totalData={data?.page?.totalElements || 0}
            onSort={onSort}
            handleDownload={handleDownload}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            tableScrolled={{ y: 525, x: 6000 }}
            onRefresh={handleRefresh}
            showRefresh={true}
          />
        </div>
      </CardContainer>

    </LayoutMenu>
  );
};

export default AccountingPage;
