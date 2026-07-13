import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import TableRBI from "../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import {
  getDetailPrabillingLog,
  downloadLogPrabilling,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";

const PrabillingDetailLog = ({ data, tabHeader }) => {
  const { detail_prabilling_log, loading_log } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const isLoadingRef = useRef(false);
  const lastLoadedPageRef = useRef(-1);

  const prabillData = data?.prabillInitPopulate || {};

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const { loading } = useSelector((state) => state.rbi_prabilling);

  const handleDownload = () => {
    if (!prabillData?.initCode) return;
    dispatch(
      downloadLogPrabilling({
        initCode: prabillData.initCode,
        search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
        sort: sort || "createdDtm~desc",
      })
    );
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Initial fetch
  useEffect(() => {
    if (tabHeader === "Prabilling Log" && prabillData?.initCode) {
      dispatch(
        getDetailPrabillingLog({
          initCode: prabillData.initCode,
          page: 1,
          size: 100,
          sort: sort || "createdDtm~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: false,
        })
      );
      lastLoadedPageRef.current = 5; 
      setPage(1);
    }
  }, [tabHeader, dispatch, prabillData?.initCode, sort, search]);

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

  const handleLoadMore = async () => {
    const totalElements = detail_prabilling_log?.totalElements || 0;
    const currentDataLength = logData.length;

    if (currentDataLength >= totalElements) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    if (nextPage <= lastLoadedPageRef.current) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadedPageRef.current = nextPage;

    try {
      await dispatch(
        getDetailPrabillingLog({
          initCode: prabillData.initCode,
          page: nextPage,
          size: loadMoreSize,
          sort: sort || "createdDtm~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: true,
        })
      );
    } finally {
      isLoadingRef.current = false;
    }
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "seq",
        title: "SEQUENCE",
        dataIndex: "seq",
        width: 110,
        sorter: true,
        filteredValue: [search?.seq] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "seq", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("seq", hasValue(search["seq"]),
            searchText, text != null ? text : "", false, "input", search),
      },
      {
        key: "processName",
        title: "PROCESS NAME",
        dataIndex: "processName",
        width: 170,
        sorter: true,
        filteredValue: [search?.processName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "processName", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("processName", hasValue(search["processName"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "activityName",
        title: "ACTIVITY NAME",
        dataIndex: "activityName",
        width: 170,
        sorter: true,
        filteredValue: [search?.activityName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "activityName", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("activityName", hasValue(search["activityName"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 280,
        sorter: true,
        filteredValue: [search?.message] || null,
        ellipsis: { showTitle: false },
        ...getColumnSearchPropsUseFilteredValue(
          search, "message", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("message", hasValue(search["message"]),
            searchText, text || "", true, "input", search),
      },
      {
        key: "createdDtm",
        title: "CREATED DATE",
        dataIndex: "createdDtm",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdDtm] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "createdDtm", searchInput, searchedColumn,
          searchText, handleSearch, true, "datetime"
        ),
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY HH:mm:ss")
            : "";
          return renderDateColumn(
            "createdDtm", hasValue(search["createdDtm"]),
            searchText, formattedDate, "datetime", search
          );
        },
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 100,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "createdBy", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("createdBy", hasValue(search["createdBy"]),
            searchText, text || "", false, "input", search),
      },
    ],
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
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

  const logData = Array.isArray(detail_prabilling_log?.content)
    ? detail_prabilling_log.content
    : [];
  const totalElements = detail_prabilling_log?.totalElements || 0;
  const hasMore = logData.length < totalElements;

  return (
    <div className="flex flex-col gap-1 mt-4">
      <CollapsibleContainer header={"Prabilling Process Log"} border>
        <div className="my-5">
          <div className="flex justify-end mb-4">
            <ButtonComponent
              type="submit"
              border={false}
              icon={<SVGIcon name="IconButtonDownload" width={20} />}
              onClick={handleDownload}
              loading={loading}
            >
              Download List
            </ButtonComponent>
          </div>
          <TableRBI
            idTable="prabilling-log-table"
            dataSource={logData}
            columns={processedColumns}
            totalData={totalElements}
            tableScrolled={{ x: 700, y: 412 }}
            onSort={onSort}
            showExport={false}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading_log}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            rowKey={(record) => record.id}
          />
        </div>
      </CollapsibleContainer>
    </div>
  );
};

export default PrabillingDetailLog;