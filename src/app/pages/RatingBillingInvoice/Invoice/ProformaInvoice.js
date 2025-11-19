// ProformaInvoice.js
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
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import {
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";

const ProformaInvoice = () => {
  // Selector
  const { data, loading, data_detail, data_format } = useSelector(
    (state) => state.invoice
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      const saved = localStorage.getItem("proformaFixedColumns");
      return saved
        ? JSON.parse(saved)
        : {
            left: ["no"], // default left fixed column keys if any
            right: ["action", "status"], // default right fixed column keys if any
          };
    } catch (e) {
      return { left: ["no"], right: ["action", "status"] };
    }
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    try {
      localStorage.setItem(
        "proformaFixedColumns",
        JSON.stringify(fixedColumns)
      );
    } catch (e) {
      // ignore storage errors
    }
  }, [fixedColumns]);

  // Use Effect - fetch page
  useEffect(() => {
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

    let searchParam = undefined;
    if (tempSearch) {
      searchParam = encodeURIComponent(JSON.stringify(search));
    }
    dispatch(
      getAllInvoicePaginate({
        search: searchParam,
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

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
        pageSize,
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
          page,
          pageSize,
          sort,
        })
      )?.unwrap();
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
        page,
        pageSize,
        sort,
      })
    );
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={handleDownload}
        >
          Export Data
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          onClick={() => {
            // Open new page instead of modal
            window.location.href =
              INVOICE_ROUTES.GENERATE_PROFORMA_INVOICE_FORM;
          }}
        >
          Generate Proforma Invoice
        </ButtonComponent>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail Invoice Log">
            <div
              className="pt-1 cursor-pointer"
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
            >
              <EyeOutlined style={{ fontSize: "20px" }} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Regenerate",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Re-Generate">
            <div
              className="pt-1 cursor-pointer"
              onClick={() => handleReGenerate(record)}
            >
              <ReloadOutlined style={{ fontSize: "20px" }} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Preview",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Download">
            <div
              className="pt-1 cursor-pointer"
              onClick={() => handlePreviewFile(record)}
            >
              <DownloadOutlined style={{ fontSize: "25px" }} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  // ✅ Call hook at component level (not inside useMemo)
  const actionCols = useColumnActionPermission(
    ["view", "preview", "regenerate"],
    itemGrantAccess
  );

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const invoiceCols = columnsInvoice(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = [...invoiceCols, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title, // Fallback to dataIndex or title if no key
    }));

    return columnsWithKeys;
  }, [search, page, pageSize, searchedColumn, searchText, actionCols]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const columns = useMemo(() => {
    // Separate columns into categories
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
  }, [baseColumns, fixedColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">Proforma Invoice List</p>
              <div className="flex gap-2">
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonCreate" width={24} />}
                  type="submit"
                  onClick={() => {
                    // Open new page instead of modal
                    window.location.href =
                      INVOICE_ROUTES.GENERATE_PROFORMA_INVOICE_FORM;
                  }}
                >
                  Generate Proforma Invoice
                </ButtonComponent>
              </div>
            </div>
          }
        >
          <div className="w-full">
            <TableRBI
              dataSource={dataSource}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements}
              tableScrolled={{ y: 525, x: 7000 }}
              onSort={onSortApi}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
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

export default ProformaInvoice;
