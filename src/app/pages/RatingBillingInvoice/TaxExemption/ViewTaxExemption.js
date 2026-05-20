import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import axios from "axios";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsTaxExemption } from "./TableViewTaxExemption";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import ModalCreateTaxExemption from "./ModalCreateTaxExemption";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  getTaxExemptionPaginate,
  downloadTaxExemption,
  getApprovalHistoryTaxExemption,
} from "../../../../redux/slices/rating_billing_invoice/taxExemption";

const ViewTaxExemption = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.taxExemption || {});

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const dataSource = data?.result || [];

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Modal state
  const [modalCreate, setModalCreate] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // Fixed columns state with localStorage persistence
  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("taxExemptionFixedColumns");
      return saved
        ? JSON.parse(saved)
        : {
            left: ["no"],
            right: ["statusBilling", "statusExemption", "action"],
          };
    } catch (e) {
      return { left: ["no"], right: ["action"] };
    }
  });

  // Save fixedColumns to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(
        "taxExemptionFixedColumns",
        JSON.stringify(fixedColumns),
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // Initial fetch
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
    setPage(1);
    dispatch(
      getTaxExemptionPaginate({
        search: searchParam,
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, dispatch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: INVOICE_ROUTES.TAX_EXMPTION_VIEW,
      breadcrumbName: "Tax Exemption",
    },
  ];

  // Handle Search
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

  // Load more handler
  const handleLoadMore = () => {
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

      dispatch(
        getTaxExemptionPaginate({
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

  // Calculate if there's more data
  const hasMore =
    (data?.result?.length || 0) < (data?.page?.totalElements || 0);

  // Sort handler
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Preview proforma invoice handler
  const handlePreview = async (record) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE +
          `/v1/dbs/api/rbi/proforma-invoice/download/latest/${record?.proformaInvoiceNumber}`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        },
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error previewing proforma invoice:", error);
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    const searchParam = Object.keys(search).some((k) => search[k])
      ? encodeURIComponent(JSON.stringify(search))
      : undefined;
    setPage(1);
    dispatch(
      getTaxExemptionPaginate({
        search: searchParam,
        page: 1,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      }),
    );
  };

  // Approval history handler
  const handleApprovalHistory = async (id) => {
    const result = await dispatch(getApprovalHistoryTaxExemption(id));
    if (result.payload) {
      const dataHistory = result.payload.dataHistory?.TAX_EXEMPTION || [];
      const dataApprover = result.payload.dataApprover?.TAX_EXEMPTION || [];
      setDataApprovalHistory({ dataHistory, dataApprover });
      setModalApprovalHistory(true);
    }
  };

  // Download handler
  const handleDownload = () => {
    const searchParam = Object.keys(search).some((k) => search[k])
      ? encodeURIComponent(JSON.stringify(search))
      : undefined;
    dispatch(
      downloadTaxExemption({
        page,
        pageSize: loadMoreSize,
        sort,
        search: searchParam,
      }),
    );
  };

  // itemGrantAccess definition
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      type: "table",
      render: (record) => {
        const isDraft = record?.statusApproval === "DRAFT";
        return (
          <Tooltip
            title={
              isDraft
                ? "Create Tax Exemption"
                : "Only available for DRAFT status"
            }
          >
            <div
              // disabled={!isDraft}
              onClick={() => {
                if (!isDraft) return;
                setSelectedRecord(record);
                setModalCreate(true);
              }}
              style={{
                display: "inline-block",
                lineHeight: 0,
                cursor: isDraft ? "pointer" : "not-allowed",
                opacity: isDraft ? 1 : 0.4,
              }}
            >
              <SVGIcon
                name="IconButtonCreate"
                width={20}
                style={{ filter: isDraft ? "invert(1)" : "invert(0.5)" }}
              />
            </div>
          </Tooltip>
        );
      },
    },

    {
      action: "History",
      type: "table",
      render: (record) => (
        <Tooltip title="Approval History">
          <div
            onClick={() => handleApprovalHistory(record?.taxExemptionId)}
            style={{
              cursor: "pointer",
              display: "inline-block",
              lineHeight: 0,
            }}
          >
            <SVGIcon name="IconLogHistory" width={20} />
          </div>
        </Tooltip>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail Tax Exemption">
          <Link
            to={INVOICE_ROUTES.TAX_EXMPTION_DETAIL}
            state={{ id: record?.taxExemptionId }}
          >
            <div
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
                marginTop: "3px",
              }}
            >
              <SVGIcon name="IconDetail" width={20} />
            </div>
          </Link>
        </Tooltip>
      ),
    },
  ];

  // Action columns with permission check
  const actionCols = useColumnActionPermission(
    ["create", "view", "history"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 60,
    align: "center",
  }));

  // Base columns from table definition
  const baseColumns = useMemo(() => {
    const taxExemptionCols = columnsTaxExemption(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handlePreview,
    );

    const allCols = [...taxExemptionCols, ...actionCols];

    return allCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchedColumn, searchText, actionCols]);

  // Column definitions for show/hide
  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  // Apply fixed columns
  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;

      if (fixedColumns.left.includes(colKey)) {
        leftFixed.push(col);
      } else if (fixedColumns.right.includes(colKey)) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    const reorderedColumns = [...leftFixed, ...normal, ...rightFixed];

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
  }, [baseColumns, fixedColumns]);

  return (
    <>
      <>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] w-full">Tax Exemption List</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className="w-full -pt-3">
            <TableRBI
              idTable="tax-exemption-table"
              dataSource={dataSource}
              columns={columns}
              totalData={data?.page?.totalElements}
              tableScrolled={{ y: 525, x: "max-content" }}
              onSort={onSortApi}
              onRefresh={handleRefresh}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              showRefresh={true}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

        {/* Modal Create Tax Exemption */}
        <ModalCreateTaxExemption
          isOpen={modalCreate}
          onClose={() => {
            setModalCreate(false);
            setSelectedRecord(null);
            setListDataAttachment([]);
          }}
          record={selectedRecord}
          listDataAttachment={listDataAttachment}
          setListDataAttachment={setListDataAttachment}
          dispatch={dispatch}
          onSubmit={() => {
            setModalCreate(false);
            setSelectedRecord(null);
            setListDataAttachment([]);
            handleRefresh();
          }}
        />

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && !!dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header="Approval History"
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
      </>
    </>
  );
};

export default ViewTaxExemption;
