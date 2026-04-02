// ProformaInvoice.js
import React, { useRef, useState, useMemo } from "react";
import { Spin, Form, Select, Tooltip } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsInvoice } from "./TableViewInvoice";
import DetailInvoice from "./DetailInvoice";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";

const ProformaInvoice = () => {
  // No API yet — placeholder state
  const data_detail = null;
  const data_format = [];
  const loading = false;
  const dataSource = [];

  // Declaration
  const searchInput = useRef(null);

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
            right: ["actions"], // default right fixed column keys - actions column
          };
    } catch (e) {
      return { left: ["no"], right: ["actions"] };
    }
  });

  // ✅ Save to localStorage when fixedColumns change
  // (no API to fetch yet for Proforma Invoice)

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
    // TODO: implement when proforma invoice API is available
  };

  // Handle Detail
  const handleDetail = (record) => {
    setPageDetail(true);
    setInvoiceNumber(record?.invoiceNumber);
  };

  // Handle Re Generate
  const handleReGenerate = (record) => {
    setInvoiceNumber(record?.invoiceNumber);
    setModalReGenerate(true);
  };

  // Handle Preview File
  const handlePreviewFile = async (record) => {
    // TODO: implement when proforma invoice API is available
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
      // TODO: implement when proforma invoice API is available
    } catch (error) {
      setBodyError({ message: error?.message || "Error" });
      setModalError(true);
    }
  };

  const refreshTable = () => {
    // TODO: implement when proforma invoice API is available
  };

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const invoiceCols = columnsInvoice(
      search,
      page,
      pageSize,
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
  }, [search, page, pageSize, searchedColumn, searchText]);

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
                setTimeout(
                  () =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    }),
                  100,
                );
              }}
            >
              <span className="text-black ml-3">Detail</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail" placement="left">
              <div
                onClick={() => {
                  handleDetail(record);
                  setTimeout(
                    () =>
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      }),
                    100,
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
          );
        return Content;
      },
    },
    {
      action: "Regenerate",
      type: "table",
      render: (record, data) => {
        const isFailed = record?.status?.toLowerCase() === "failed";
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
        const isCompleted = record?.status?.toLowerCase() === "completed";
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
      <Spin spinning={loading}>
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
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonCreate" width={20} />}
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
              totalData={0}
              tableScrolled={{ y: 525, x: 7000 }}
              onSort={onSortApi}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              useInfiniteScroll
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
    </>
  );
};

export default ProformaInvoice;
