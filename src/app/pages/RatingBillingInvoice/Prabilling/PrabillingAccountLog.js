import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "antd";
import CollapsibleContainer from "../../../../components/CollapsibleContainer";
import TableRBI from "../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import {
  getPrabillingAccountLog,
  downloadAccountLogPrabilling,
} from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";

const PrabillingAccountLog = ({ data, tabHeader }) => {
  const { account_log_data, loading_account_log } = useSelector(
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
      downloadAccountLogPrabilling({
        initCode: prabillData.initCode,
        search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
        sort: sort || "createdDate~desc",
      })
    );
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status"],
  }));

  // Initial fetch
  useEffect(() => {
    if (tabHeader === "Prabilling Account Log" && prabillData?.initCode) {
      dispatch(
        getPrabillingAccountLog({
          initCode: prabillData.initCode,
          page: 1,
          size: 100,
          sort: sort || "createdDate~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: false,
        })
      );
      lastLoadedPageRef.current = 5; // Page 1 s/d 5 (100 data) sudah termuat
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

  // Load more handler
  const handleLoadMore = async () => {
    const totalElements = account_log_data?.listAccountResult?.page?.totalElements || 0;
    const currentDataLength = logData.length;

    if (currentDataLength >= totalElements) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const nextPage = Math.floor(currentDataLength / loadMoreSize) + 1;

    // Mencegah pemanggilan halaman yang sudah di-load/sedang di-load
    if (nextPage <= lastLoadedPageRef.current) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadedPageRef.current = nextPage;

    try {
      await dispatch(
        getPrabillingAccountLog({
          initCode: prabillData.initCode,
          page: nextPage,
          size: loadMoreSize,
          sort: sort || "createdDate~desc",
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
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 120,
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
      {
        key: "createdDate",
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "createdDate", searchInput, searchedColumn,
          searchText, handleSearch, true, "datetime"
        ),
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY HH:mm:ss")
            : "";
          return renderDateColumn(
            "createdDate", hasValue(search["createdDate"]),
            searchText, formattedDate, "datetime", search
          );
        },
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        sorter: true,
        filteredValue: [search?.accountNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "accountNumber", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("accountNumber", hasValue(search["accountNumber"]),
            searchText, text || "", false, "input", search),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "status", searchInput, searchedColumn,
          searchText, handleSearch, true
        ),
        render: (status) => {
          const statusUpper = status ? status.toUpperCase() : "INFO";
          const statusConfig = {
            SUCCESS: { text: "Success", type: "status" },
            ERROR: { text: "Failed", type: "status" },
            FAILED: { text: "Failed", type: "status" },
            WARNING: { text: "In Progress", type: "status" },
            PROCESSING: { text: "In Progress", type: "status" },
            IN_PROGRESS: { text: "In Progress", type: "status" },
            "IN PROGRESS": { text: "In Progress", type: "status" },
            INFO: { text: "Open", type: "status" },
          };
          const config = statusConfig[statusUpper] || { text: "Unknown", type: "status" };
          return renderColumn(
            "status", hasValue(search["status"]),
            searchText, config.text, false, "status", search
          );
        },
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

  const logData = Array.isArray(account_log_data?.listAccountResult?.result)
    ? account_log_data.listAccountResult.result
    : [];
  const totalElements = account_log_data?.listAccountResult?.page?.totalElements || 0;
  const summary = account_log_data?.summary || {};
  const hasMore = logData.length < totalElements;

  return (
    <div className="flex flex-col gap-1 mt-4">
      <CollapsibleContainer header={"Prabilling Account Log"} border>

        {/* Summary Box */}
        <div
          className="rounded-lg"
          style={{ border: "1px solid #BDBDBD", marginBottom: "20px", marginTop: "10px" }}
        >
          {/* Summary Header */}
          <div
            className="px-3 py-2 bg-[#F9F9F9] rounded-t-lg"
            style={{ borderBottom: "1px solid #BDBDBD" }}
          >
            <span className="text-primary text-sm uppercase">
              Summary
            </span>
          </div>
          {/* Summary Content */}
          <Row style={{ margin: 0 }}>
            <Col
              span={8}
              style={{ padding: "20px 24px", borderRight: "1px solid #BDBDBD" }}
            >
              <div style={{ color: "#8c8c8c", fontSize: "14px", marginBottom: "8px" }}>
                Total
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#262626" }}>
                {totalElements || 0}
              </div>
            </Col>
            <Col
              span={8}
              style={{ padding: "20px 24px", borderRight: "1px solid #BDBDBD" }}
            >
              <div style={{ color: "#8c8c8c", fontSize: "14px", marginBottom: "8px" }}>
                Success
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#262626" }}>
                {summary.success || 0}
              </div>
            </Col>
            <Col span={8} style={{ padding: "20px 24px" }}>
              <div style={{ color: "#8c8c8c", fontSize: "14px", marginBottom: "8px" }}>
                Failed
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#262626" }}>
                {summary.failed || 0}
              </div>
            </Col>
          </Row>
        </div>
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

        {/* Tabel */}
        <TableRBI
          idTable="prabilling-account-log-table"
          dataSource={logData}
          columns={processedColumns}
          totalData={totalElements}
          tableScrolled={{ x: 700, y: 412 }}
          onSort={onSort}
          showExport={false}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading_account_log}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadMoreThreshold={20}
          rowKey={(record) => record.id}
        />

      </CollapsibleContainer>
    </div>
  );
};

export default PrabillingAccountLog;