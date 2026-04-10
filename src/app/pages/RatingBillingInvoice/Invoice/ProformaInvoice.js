// ProformaInvoice.js
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Form, Tooltip } from "antd";
import axios from "axios";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsProformaInvoice } from "./TableViewProformaInvoice";
import DetailProformaInvoice from "./DetailProformaInvoice";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProformaInvoicePaginate,
  getDetailProformaInvoice,
  getLogProformaInvoicePaginate,
} from "../../../../redux/slices/rating_billing_invoice/proformaInvoice";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";

const ProformaInvoice = () => {
  const dispatch = useDispatch();
  const { data, loading, data_detail, loading_detail, logs, logs_page, loading_logs } = useSelector(
    (state) => state.proformaInvoice,
  );

  // Declaration
  const searchInput = useRef(null);
  const dataSource = data?.result || [];

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [bodyError, setBodyError] = useState({});

  const [modalDetail, setModalDetail] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalReGenerate, setModalReGenerate] = useState(false);
  const [logsPage, setLogsPage] = useState(1);

  // ✅ State untuk fix column dengan format baru { left: [], right: [] }
  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("proformaFixedColumns");
      return saved
        ? JSON.parse(saved)
        : {
            left: ["no"], // default left fixed column keys if any
            right: ["actions"], // default right fixed column keys - actions column
          };
    } catch (e) {
      return { left: ["no"], right: ["actions"] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("proformaFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  useEffect(() => {
    let searchParam = undefined;
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    if (tempSearch) {
      searchParam = encodeURIComponent(JSON.stringify(search));
    }

    dispatch(
      getAllProformaInvoicePaginate({
        search: searchParam,
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [search, sort, dispatch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.PROFORMA_INVOICE_VIEW,
      breadcrumbName: "Proforma Invoice",
    },
  ];

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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      let searchParam = undefined;
      let tempSearch = "";
      for (const dataIndex in search) {
        if (Object.hasOwnProperty.call(search, dataIndex)) {
          const tempSearchText = search[dataIndex];
          if (tempSearchText) {
            tempSearch += `${dataIndex}~${tempSearchText},`;
          }
        }
      }
      if (tempSearch) {
        searchParam = encodeURIComponent(JSON.stringify(search));
      }

      await dispatch(
        getAllProformaInvoicePaginate({
          search: searchParam,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    (data?.result?.length || 0) < (data?.page?.totalElements || 0);

  // Sort Table
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = () => {
    const searchParam =
      Object.keys(search || {}).length > 0
        ? encodeURIComponent(JSON.stringify(search))
        : "";
    const sortParams = sort === undefined || sort === "" ? "createdDate~desc" : sort;
    const url = `/v1/dbs/api/rbi/proforma-invoice/download-filter?page=1&size=${Math.max(
      data?.page?.totalElements || 0,
      100,
    )}&sort=${sortParams}&searchs=${searchParam}`;
    ratingBillingHttpService.downloadXlsx(url, "proforma_invoice_list");
  };

  // Handle Detail
  const handleDetail = (record) => {
    dispatch(getDetailProformaInvoice(record?.invoiceNumber));
    dispatch(
      getLogProformaInvoicePaginate({
        invoiceNumber: record?.invoiceNumber,
        page: 1,
        pageSize: 20,
        isLoadMore: false,
      }),
    );
    setInvoiceNumber(record?.invoiceNumber);
    setLogsPage(1);
    setModalDetail(true);
  };

  const handleLoadMoreLogs = async () => {
    const nextPage = logsPage + 1;
    const totalPages = logs_page?.totalPages || 0;

    if (nextPage <= totalPages && invoiceNumber) {
      await dispatch(
        getLogProformaInvoicePaginate({
          invoiceNumber,
          page: nextPage,
          pageSize: 20,
          isLoadMore: true,
        }),
      );
      setLogsPage(nextPage);
    }
  };

  // Handle Re Generate
  const handleReGenerate = (record) => {
    setInvoiceNumber(record?.invoiceNumber);
    setModalReGenerate(true);
  };

  // Handle Preview File
  const handlePreviewFile = async (record) => {
    const latestStatus = record?.latestLogStatus?.toLowerCase();
    if (latestStatus !== "completed" && latestStatus !== "success") {
      return;
    }
    const relativePath = `v1/dbs/api/rbi/proforma-invoice/download/latest/${record?.invoiceNumber}`;
    const previewUrl = `${window.location.origin}${configApp.RATING_BILLING_SERVICE}/${relativePath}`;
    const res = await axios.get(previewUrl, {
      headers: tokenHeader(),
      responseType: "arraybuffer",
    });
    const blob = new Blob([res.data], {
      type: "application/pdf",
    });
    window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
  };

  // Handle Cancel Modal ReGenerate
  const handleCancelReGenerate = () => {
    setModalReGenerate(false);
  };

  const handleRetry = () => {
    handleConfirmReGenerate();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  // Handle Confirm ReGenerate
  const handleConfirmReGenerate = async (res, handleClear) => {
    try {
      setModalReGenerate(false);
      if (handleClear) await handleClear();

      await dispatch(getAllProformaInvoicePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }));
      setPage(1);
    } catch (error) {
      setBodyError({ message: error?.message || "Error" });
      setModalError(true);
    }
  };

  const refreshTable = () => {
    let searchParam = undefined;
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    if (tempSearch) {
      searchParam = encodeURIComponent(JSON.stringify(search));
    }
    dispatch(
      getAllProformaInvoicePaginate({
        search: searchParam,
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      }),
    );
    setPage(1);
  };

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const invoiceCols = columnsProformaInvoice(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    );

    return invoiceCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchedColumn, searchText]);

  const itemGrantAccess = [
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
              <ButtonComponent
                icon={<SVGIcon name="IconDetail" width={20} />}
                border={false}
                onClick={() => {
                  handleDetail(record);
                }}
              >
                <span className="text-black ml-3">Detail</span>
              </ButtonComponent>
          ) : (
            <Tooltip title="Detail" placement="left">
              <div
                onClick={() => {
                  handleDetail(record);
                }}
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  lineHeight: 0,
                }}
              >
                <SVGIcon name="IconDetail" width={20} />
              </div>
            </Tooltip>
          );
        return Content;
      },
    },
    {
      action: "Regenerate",
      type: "table",
      render: (record, data) => {
        const isFailed = record?.latestLogStatus?.toLowerCase() === "failed";
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconReGenerate"
                  width={20}
                  color={isFailed ? undefined : "#8D91A0"}
                />
              }
              border={false}
              disabled={!isFailed}
              onClick={isFailed ? () => handleReGenerate(record) : undefined}
            >
              <span
                className={isFailed ? "text-black ml-3" : "text-gray-400 ml-3"}
              >
                Re-Generate
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={
                isFailed
                  ? "Re-Generate"
                  : "Re-Generate (only available when status is Failed)"
              }
              placement="left"
            >
              <div
                onClick={() => isFailed && handleReGenerate(record)}
                style={{
                  display: "inline-block",
                  lineHeight: 0,
                  cursor: isFailed ? "pointer" : "not-allowed",
                  opacity: isFailed ? 1 : 0.4,
                }}
              >
                <SVGIcon name="IconReGenerate" width={20} />
              </div>
            </Tooltip>
          );
        return Content;
      },
    },
    {
      action: "Download",
      type: "table",
      render: (record, data) => {
        const status = record?.latestLogStatus?.toLowerCase();
        const isCompleted = status === "completed" || status === "success";
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconDownload"
                  width={20}
                  color={isCompleted ? undefined : "#8D91A0"}
                />
              }
              border={false}
              disabled={!isCompleted}
              onClick={
                isCompleted ? () => handlePreviewFile(record) : undefined
              }
            >
              <span
                className={
                  isCompleted ? "text-black ml-3" : "text-gray-400 ml-3"
                }
              >
                Preview/Download
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={
                isCompleted
                  ? "Preview/Download"
                  : "Preview/Download (only available when status is Completed)"
              }
              placement="left"
            >
              <div
                onClick={() => isCompleted && handlePreviewFile(record)}
                style={{
                  display: "inline-block",
                  lineHeight: 0,
                  cursor: isCompleted ? "pointer" : "not-allowed",
                  opacity: isCompleted ? 1 : 0.4,
                }}
              >
                <SVGIcon name="IconEye" width={20} />
              </div>
            </Tooltip>
          );
        return Content;
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view", "regenerate", "download"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    key: col.key || col.title,
    width: 120,
    align: "center",
  }));

  const allColumns = useMemo(() => {
    return [...baseColumns, ...actionCols];
  }, [baseColumns, actionCols]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const columns = useMemo(() => {
    // Separate columns into categories
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    allColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;

      if (fixedColumns.left.includes(colKey)) {
        leftFixed.push(col);
      } else if (fixedColumns.right.includes(colKey)) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    // Reorder: left fixed → normal → right fixed
    const reorderedColumns = [...leftFixed, ...normal, ...rightFixed];

    // Apply fixed property
    return reorderedColumns.map((col) => {
      const newCol = { ...col };
      const colKey = col.key || col.dataIndex || col.title;

      if (fixedColumns.left.includes(colKey)) {
        newCol.fixed = "left";
      } else if (fixedColumns.right.includes(colKey)) {
        newCol.fixed = "right";
      } else {
        delete newCol.fixed;
      }

      return newCol;
    });
  }, [allColumns, fixedColumns]);

  return (
    <>
      <BreadCrumb routes={routes} />

      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">Proforma Invoice List</p>
            <div className="flex gap-2">
              <ButtonComponent
                type={"submit"}
                border={false}
                icon={<SVGIcon name="IconButtonDownload" width={20} />}
                onClick={() => {
                  handleDownload();
                }}
              >
                Download List
              </ButtonComponent>
            </div>
          </div>
        }
      >
        <div className="w-full">
          <TableRBI
            idTable="proforma-invoice-table"
            dataSource={dataSource}
            columns={columns}
            totalData={data?.page?.totalElements}
            tableScrolled={{ y: 525, x: "max-content" }}
            onSort={onSortApi}
            handleDownload={handleDownload}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
            showExport={false}
            showRefresh={true}
            onRefresh={refreshTable}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
          />
        </div>
      </CardContainer>

      <DetailProformaInvoice
        isOpen={modalDetail}
        onClose={() => setModalDetail(false)}
        detail={data_detail || { invoiceNumber }}
        logs={logs}
        logsPage={logs_page}
        onLoadMoreLogs={handleLoadMoreLogs}
        loadingLogs={loading_logs}
        loading={loading_detail}
      />

      {/* Modal Re-Generate */}
      <ModalApproveOrReject
        isOpen={modalReGenerate}
        handleCloseModal={handleCancelReGenerate}
        onFinish={handleConfirmReGenerate}
        header={"REGENERATE"}
        approveOrReject={"regenerate"}
        menu={"Invoice"}
        named={invoiceNumber}
        children={
          <Form.Item label={"Format Option"}>
            <span
              className="ant-input"
              style={{
                display: "inline-block",
                padding: "4px 11px",
                background: "#f5f5f5",
                borderRadius: 4,
                minWidth: 100,
              }}
            >
              PDF
            </span>
          </Form.Item>
        }
      />

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not regenerate. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default ProformaInvoice;
