import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import {
  getPrabillSaTos,
  getPrabillSaTosDetail,
} from "../../../../../../redux/slices/rating_billing_invoice/praBilling";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import moment from "moment";

export const columnsSaTos = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "TOS NAME",
    dataIndex: "tosName",
    key: "tosName",
    sorter: true,
    width: 200,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "tosName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "tosName",
        hasValue(search["tosName"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    key: "remark",
    sorter: true,
    width: 200,
    ellipsis: { showTitle: false },
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "remark",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
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
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => {
      const formattedDate = text ? moment(text).format("DD MMM YYYY") : "";
      return renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    width: 150,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date"
    ),
    render: (text) => {
      const formattedDate = text ? moment(text).format("DD MMM YYYY") : "";
      return renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        formattedDate,
        "date",
        search
      );
    },
  },
];

export const columnsSaTosDetail = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search
) => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "ATTRIBUTE NAME",
    dataIndex: "attributeName",
    key: "attributeName",
    width: 200,
  },
  {
    title: "UNIT",
    dataIndex: "unit",
    key: "unit",
    width: 150,
    align: "center",
  },
  {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    width: 150,
    align: "right",
  },
  {
    title: "FROM ITEM",
    dataIndex: "fromItem",
    key: "fromItem",
    width: 150,
    ellipsis: { showTitle: false },
  },
];

const SaTosSection = ({ prabillSaId }) => {
  const { prabill_sa_detail, loading_prabill_sa } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [tosDetailData, setTosDetailData] = useState([]);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    if (prabillSaId) {
      dispatch(
        getPrabillSaTos({
          prabillSaId,
          search: JSON.stringify(search),
          page: page - 1,
          size: pageSize,
          sort,
        })
      );
      dispatch(
        getPrabillSaTosDetail({
          prabillSaId,
          page: 0,
          size: 1000,
        })
      );
    }
  }, [prabillSaId, search, page, pageSize, sort, dispatch]);

  useEffect(() => {
    const tosData = prabill_sa_detail?.saTos?.result || [];
    const tosDetailAllData = prabill_sa_detail?.saTosDetail?.result || [];

    if (tosData.length > 0) {
      const mappedData = tosData.map((item, index) => {
        const relatedDetails = tosDetailAllData.filter(
          (detail) => detail.prabillTossubId === item.prabillTossubId
        );

        return {
          ...item,
          key: item.prabillTossubId || index,
          tosDetail: relatedDetails.map((detail, idx) => ({
            ...detail,
            key: detail.prabillTossubdetId || idx,
          })),
        };
      });

      setDataTable(mappedData);
    } else {
      setDataTable([]);
    }
  }, [prabill_sa_detail?.saTos, prabill_sa_detail?.saTosDetail]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsSaTos(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, search]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

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
    <>
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary uppercase">
          TERM OF SERVICE INFORMATION
        </p>
      </div>
      <div className="w-full">
        <TableRBI
          dataSource={dataTable.length === 0 ? null : dataTable}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onSizeChanger={handleChange}
          totalData={prabill_sa_detail?.saTos?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 900 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_prabill_sa.saTos}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p className="text-primary text-xs font-bold uppercase pt-4 pb-2">
                  DETAIL TERM OF SERVICE INFORMATION
                </p>
                <TablePaginationNew
                  useSelect={false}
                  usePagination={false}
                  dataSource={record?.tosDetail}
                  columns={columnsSaTosDetail(
                    page,
                    pageSize,
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    search
                  )}
                  className="mb-4"
                />
              </div>
            ),
          }}
        />
      </div>
    </>
  );
};

export default SaTosSection;