import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  columnsDetailTermOfService,
  columnsTermOfService,
} from "../Table/TableTermsOfService";
import { getAllTOSServiceAgreementPaginate } from "../../../../../../redux/slices/rating_billing_invoice/rating";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

const TosSection = ({ SAId }) => {
  // Selector
  const { data_termOfServiceSA, loadingSA } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllTOSServiceAgreementPaginate({
        id: SAId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [SAId, search, page, pageSize, sort, dispatch]);

  useEffect(() => {
    if (data_termOfServiceSA && data_termOfServiceSA?.result?.length > 0) {
      const data = data_termOfServiceSA?.result?.map((a, index) => ({
        ...a,
        key: a.tosId || index + 1,
        tosDetail: a.tosDetail?.map((b, idx) => ({
          ...b,
          key: b.tosDetailId || idx + 1,
        })),
      }));
      setDataTable(data);
    } else {
      setDataTable([]);
    }
  }, [data_termOfServiceSA]);

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
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () =>
      columnsTermOfService(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [page, pageSize, searchedColumn, searchText]
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
          totalData={data_termOfServiceSA?.page?.totalElements || 0}
          onSort={onSortApi}
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingSA}
          expandable={{
            expandedRowRender: (record) => (
              <div>
                <p className="text-primary text-xs font-bold uppercase pt-4">
                  DETAIL TERM OF SERVICE INFORMATION
                </p>
                <TablePaginationNew
                  useSelect={false}
                  usePagination={false}
                  dataSource={record?.tosDetail}
                  columns={columnsDetailTermOfService(
                    page,
                    pageSize,
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
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

export default TosSection;