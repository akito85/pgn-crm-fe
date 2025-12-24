// ViewInvoice.js
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Form, Select, Tooltip } from "antd";
import axios from "axios";
import DocViewer from "react-doc-viewer";
import SelectComponent from "../../../../components/SelectComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsInvoice } from "./TableViewInvoice";
import DetailInvoice from "./DetailInvoice";
import {
  createRegenerate,
  getAllInvoicePaginate,
  getBillingApproval,
  getDetailInvoice,
  getDownloadList,
  getFormatType,
} from "../../../../redux/slices/rating_billing_invoice/invoice";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import { NavLink } from "react-router-dom";

const ViewInvoice = () => {
  // Selector
  const { data, loading, data_detail, data_format } = useSelector(
    (state) => state.invoice
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result || [];

  // State - PERUBAHAN: State untuk infinite scroll
  const [page, setPage] = useState(1); // Start from 1
  const [loadMoreSize] = useState(20); // Load 20 data each time
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [bodyError, setBodyError] = useState({});

  const [pageDetail, setPageDetail] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalReGenerate, setModalReGenerate] = useState(false);
  const [modalGenerate, setModalGenerate] = useState(false);

  // ✅ State untuk fix column dengan format baru { left: [], right: [] }
  const [fixedColumns, setFixedColumns] = useState(() => {
    try {
      const saved = localStorage.getItem("invoiceFixedColumns");
      return saved
        ? JSON.parse(saved)
        : {
            left: ["no"], // default left fixed column keys if any
            right: ["status", "statusPaymentGw", "action"], // default right fixed column keys - actions column
          };
    } catch (e) {
      return { left: ["no"], right: ["action"] };
    }
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    try {
      localStorage.setItem("invoiceFixedColumns", JSON.stringify(fixedColumns));
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // PERUBAHAN: Initial fetch dengan 100 data
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
      getAllInvoicePaginate({
        search: searchParam,
        page: 1,
        pageSize: 100, // Initial load 100 data
        sort,
        isLoadMore: false, // Flag untuk initial load
      })
    );
    setPage(1);
  }, [search, sort, dispatch]);

  useEffect(() => {
    if (modalReGenerate) {
      dispatch(getFormatType());
    } else if (modalGenerate) {
      dispatch(getBillingApproval());
    }
  }, [modalReGenerate, modalGenerate, dispatch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.GENERATE_INVOICE_VIEW,
      breadcrumbName: "Invoice",
    },
  ];

  // PERUBAHAN: Reset page ke 1 saat search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1); // Reset to 1
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // TAMBAHAN: Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data?.page?.totalPages || 0;

    // Check if there's more data to load
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
        getAllInvoicePaginate({
          search: searchParam,
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          sort,
          isLoadMore: true, // Flag untuk load more
        })
      );
      setPage(nextPage);
    }
  };

  // TAMBAHAN: Calculate if there's more data
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
    dispatch(
      getDownloadList({
        page,
        pageSize: loadMoreSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  };

  // Handle Detail
  const handleDetail = (record) => {
    setPageDetail(true);
    dispatch(getDetailInvoice(record?.invoiceNumber));
    setInvoiceNumber(record?.invoiceNumber);
  };

  // Handle Re Generate
  const handleReGenerate = (record) => {
    setInvoiceNumber(record?.invoiceNumber);
    setModalReGenerate(true);
  };

  // Handle Preview File
  const handlePreviewFile = async (record) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE +
          `/v1/dbs/api/rbi/invoice/${record?.invoiceNumber}/preview`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        }
      );
      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];
      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });
      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = "PDF Preview";
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);
        // eslint-disable-next-line no-undef
        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer
        );
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
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

      const body = {
        formatOption: res.formatOption,
        action: "REGENERATE",
        remark: res.remark,
      };
      await dispatch(
        createRegenerate({ id: invoiceNumber, body: body })
      )?.unwrap();
      await handleClear();
      await dispatch(
        getAllInvoicePaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: 1,
          pageSize: 100,
          sort,
          isLoadMore: false,
        })
      )?.unwrap();
      setPage(1);
    } catch (error) {
      if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setBodyError({ message });
        setModalError(true);
      } else {
        setBodyError({ message: error?.message || "Error" });
        setModalError(true);
      }
    }
  };

  const refreshTable = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllInvoicePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize: 100,
        sort,
        isLoadMore: false,
      })
    );
    setPage(1);
  };

  // ✅ Get base columns with key property including action column
  const baseColumns = useMemo(() => {
    const invoiceCols = columnsInvoice(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );

    // ✅ Single action column with multiple icons
    const actionColumn = {
      key: "action",
      title: "ACTION",
      width: 120,
      align: "center",
      isClassification: true,
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record);
                setTimeout(
                  () =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    }),
                  100
                );
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
          <Tooltip title="Re-Generate">
            <div
              onClick={() => handleReGenerate(record)}
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
              }}
            >
              <SVGIcon name="IconReGenerate" width={20} />
            </div>
          </Tooltip>
          <Tooltip title="Download">
            <div
              onClick={() => handlePreviewFile(record)}
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
              }}
            >
              <SVGIcon name="IconDownload" width={20} />
            </div>
          </Tooltip>
        </div>
      ),
    };

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = [...invoiceCols, actionColumn].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title, // Fallback to dataIndex or title if no key
    }));

    return columnsWithKeys;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchedColumn, searchText]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

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
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px]">Invoice List</p>
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
                <NavLink to={INVOICE_ROUTES.GENERATE_INVOICE_FORM}>
                  <ButtonComponent
                    icon={<SVGIcon name="IconButtonCreate" width={20} />}
                    type="submit"
                  >
                    Generate Invoice
                  </ButtonComponent>
                </NavLink>
              </div>
            </div>
          }
        >
          <div className="w-full pt-3">
            <TableRBI
              idTable="invoice-table"
              dataSource={dataSource}
              columns={columns}
              totalData={data?.page?.totalElements}
              tableScrolled={{ y: 525, x: "max-content" }}
              onSort={onSortApi}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              showExport={false}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

        {/* Invoice Log */}
        {pageDetail === true && data_detail ? (
          <DetailInvoice
            detail={data_detail?.logs}
            invoiceNumber={invoiceNumber}
          />
        ) : null}

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
            <Form.Item
              label={"Format Option"}
              name={"formatOption"}
              rules={[
                { required: true, message: "Please input your Format Option!" },
              ]}
            >
              <SelectComponent>
                {data_format &&
                  data_format?.map((data, index) => (
                    <Select.Option value={data.glbTypeValId} key={index}>
                      {data.name}
                    </Select.Option>
                  ))}
              </SelectComponent>
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
      </Spin>
    </LayoutMenu>
  );
};

export default ViewInvoice;
