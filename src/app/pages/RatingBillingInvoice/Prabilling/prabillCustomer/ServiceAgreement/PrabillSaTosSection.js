// File: PrabillSaTosSection.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrabillSaTos,
  getPrabillSaTosDetail,
} from "../../../../../../redux/slices/rating_billing_invoice/praBilling";
import TableRBI from "../../../../../../components/TableRBI";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";

// Columns untuk TOS utama
export const columnsPrabillTos = (page = 1, pageSize = 10) => [
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
    align: "center",
    width: 200,
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    sorter: true,
    align: "center",
    width: 150,
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    sorter: true,
    align: "center",
    width: 150,
  },
  {
    title: "REMARK",
    dataIndex: "remark",
    key: "remark",
    align: "center",
    width: 250,
  },
];

// Columns untuk TOS Detail (expandable)
export const columnsPrabillTosDetail = () => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    align: "center",
    width: 60,
    render: (text, object, index) => index + 1,
  },
  {
    title: "ATTRIBUTE NAME",
    dataIndex: "attributeName",
    key: "attributeName",
    align: "center",
    width: 200,
  },
  {
    title: "UNIT",
    dataIndex: "unit",
    key: "unit",
    align: "center",
    width: 100,
  },
  {
    title: "VALUE",
    dataIndex: "value",
    key: "value",
    align: "center",
    width: 150,
  },
  {
    title: "FROM ITEM",
    dataIndex: "fromItem",
    key: "fromItem",
    align: "center",
    width: 150,
  },
];

const PrabillSaTosSection = ({ prabillSaId }) => {
  // Selector
  const { prabill_sa_detail, loading_prabill_sa } = useSelector(
    (state) => state.rbi_prabilling
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Use Effect untuk fetch TOS
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
    }
  }, [prabillSaId, search, page, pageSize, sort, dispatch]);

  // Use Effect untuk fetch TOS Detail (untuk expandable rows)
  useEffect(() => {
    if (prabillSaId) {
      dispatch(
        getPrabillSaTosDetail({
          prabillSaId,
          page: 0,
          size: 1000, // Fetch all untuk detail
        })
      );
    }
  }, [prabillSaId, dispatch]);

  // Combine TOS dengan TOS Detail
  useEffect(() => {
    const tosData = prabill_sa_detail?.saTos?.result || [];
    const tosDetailData = prabill_sa_detail?.saTosDetail?.result || [];

    if (tosData.length > 0) {
      // Group tosDetail by tosName
      const detailGrouped = tosDetailData.reduce((acc, detail) => {
        const key = detail.tosName;
        if (!acc[key]) acc[key] = [];
        acc[key].push(detail);
        return acc;
      }, {});

      // Merge with TOS data
      const data = tosData.map((tos, index) => ({
        ...tos,
        key: tos.tosId || index + 1,
        tosDetail: detailGrouped[tos.tosName] || [],
      }));
      setDataTable(data);
    } else {
      setDataTable([]);
    }
  }, [prabill_sa_detail?.saTos, prabill_sa_detail?.saTosDetail]);

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
    () => columnsPrabillTos(page, pageSize),
    [page, pageSize]
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
          tableScrolled={{ y: 525, x: 800 }}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_prabill_sa?.saTos}
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
                  columns={columnsPrabillTosDetail()}
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

export default PrabillSaTosSection;