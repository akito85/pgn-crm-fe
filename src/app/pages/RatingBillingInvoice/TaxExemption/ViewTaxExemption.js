import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { INVOICE_ROUTES } from "../../../../routes/invoice/invoice_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { columnsTaxExemption } from "./TableViewTaxExemption";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import ModalCreateTaxExemption from "./ModalCreateTaxExemption";

const ViewTaxExemption = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.taxExemption || {});

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // Dummy data for testing
  const dummyData = [
    {
      proformaInvoiceNumber: "PI-2026-0001",
      billingPeriod: "Jan 2026",
      billingCode: "BC-001",
      customerNumber: "CST000000194",
      customerName: "PT Keramik Inti",
      accountNumber: "002",
      accountName: "Keramik Inti Tj Barat",
      sor: "SOR II",
      costCenter: "122",
      accountSegment: "PK",
      accountGroupType: "Gas",
      meterReadingCode: "8k2979",
      accountType: "Industri",
      accountStatus: "Active",
      customerManagement: "KAM Jakarta",
      corporateCustomer: "PT Keramik Group",
      classificationType: "Large",
      serviceType: "Gas",
      billingAddress: "Jl. Industri Raya No. 12, Jakarta Timur",
      transactionDate: "2026-01-15",
      remark: "Pembayaran bulan Januari 2026",
      proformaInvoice: "proforma-invoice-keramik-inti-2026.pdf",
      statusBilling: "Verified",
      statusExemption: "Waiting Approval",
    },
    {
      proformaInvoiceNumber: "PI-2026-0002",
      billingPeriod: "Jan 2026",
      billingCode: "BC-002",
      customerNumber: "CST000000195",
      customerName: "PT Baja Nusantara",
      accountNumber: "005",
      accountName: "Baja Nusantara Pusat",
      sor: "SOR III",
      costCenter: "210",
      accountSegment: "RT",
      accountGroupType: "Gas",
      meterReadingCode: "9x1234",
      accountType: "Industri",
      accountStatus: "Active",
      customerManagement: "KAM Surabaya",
      corporateCustomer: "PT Baja Group",
      classificationType: "Medium",
      serviceType: "Gas",
      billingAddress: "Jl. Rungkut Industri No. 5, Surabaya",
      transactionDate: "2026-01-20",
      remark: "Pembayaran bulan Januari 2026",
      proformaInvoice: "proforma-invoice-baja-nusantara-2026.pdf",
      statusBilling: "Verified",
      statusExemption: "Approved",
    },
    {
      proformaInvoiceNumber: "PI-2026-0003",
      billingPeriod: "Jan 2026",
      billingCode: "BC-003",
      customerNumber: "CST000000196",
      customerName: "PT Semen Makmur",
      accountNumber: "007",
      accountName: "Semen Makmur Gresik",
      sor: "SOR I",
      costCenter: "305",
      accountSegment: "PK",
      accountGroupType: "Gas",
      meterReadingCode: "5z7890",
      accountType: "Industri",
      accountStatus: "Active",
      customerManagement: "KAM Jawa Timur",
      corporateCustomer: "PT Semen Group",
      classificationType: "Large",
      serviceType: "Gas",
      billingAddress: "Jl. Veteran No. 88, Gresik",
      transactionDate: "2026-01-18",
      remark: "Pembayaran bulan Januari 2026",
      proformaInvoice: "proforma-invoice-semen-makmur-2026.pdf",
      statusBilling: "Verified",
      statusExemption: "Rejected",
    },
    {
      proformaInvoiceNumber: "PI-2026-0004",
      billingPeriod: "Jan 2026",
      billingCode: "BC-004",
      customerNumber: "CST000000197",
      customerName: "PT Kimia Farma",
      accountNumber: "010",
      accountName: "Kimia Farma Bekasi",
      sor: "SOR II",
      costCenter: "401",
      accountSegment: "RT",
      accountGroupType: "Gas",
      meterReadingCode: "3m4567",
      accountType: "Komersil",
      accountStatus: "Active",
      customerManagement: "KAM Bekasi",
      corporateCustomer: "PT Kimia Group",
      classificationType: "Small",
      serviceType: "Gas",
      billingAddress: "Jl. Raya Industri No. 20, Bekasi",
      transactionDate: "2026-01-22",
      remark: "Pembayaran bulan Januari 2026",
      proformaInvoice: "proforma-invoice-kimia-farma-2026.pdf",
      statusBilling: "Verified",
      statusExemption: "Waiting Approval",
    },
    {
      proformaInvoiceNumber: "PI-2026-0005",
      billingPeriod: "Jan 2026",
      billingCode: "BC-005",
      customerNumber: "CST000000198",
      customerName: "PT Tekstil Indah",
      accountNumber: "013",
      accountName: "Tekstil Indah Bandung",
      sor: "SOR IV",
      costCenter: "512",
      accountSegment: "PK",
      accountGroupType: "Gas",
      meterReadingCode: "7p2345",
      accountType: "Industri",
      accountStatus: "Active",
      customerManagement: "KAM Bandung",
      corporateCustomer: "PT Tekstil Group",
      classificationType: "Medium",
      serviceType: "Gas",
      billingAddress: "Jl. Leuwipanjang No. 33, Bandung",
      transactionDate: "2026-01-25",
      remark: "Pembayaran bulan Januari 2026",
      proformaInvoice: "proforma-invoice-tekstil-indah-2026.pdf",
      statusBilling: "Verified",
      statusExemption: "Waiting Approval",
    },
  ];

  const dataSource = data?.result || dummyData;

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
  const [appHierOptions] = useState([]);
  const [appHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);

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

      // TODO: replace with actual dispatch action when redux slice is ready
      // await dispatch(
      //   getAllTaxExemptionPaginate({
      //     search: searchParam,
      //     page: nextPage,
      //     pageSize: loadMoreSize,
      //     sort,
      //     isLoadMore: true,
      //   })
      // );
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

  // Download handler
  const handleDownload = () => {
    // TODO: replace with actual dispatch action when redux slice is ready
    // dispatch(
    //   getDownloadTaxExemptionList({
    //     page,
    //     pageSize: loadMoreSize,
    //     sort,
    //     search: encodeURIComponent(JSON.stringify(search)),
    //   })
    // );
  };

  // itemGrantAccess definition
  const itemGrantAccess = useMemo(
    () => [
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
        render: (record) => (
          <Tooltip title="Create Tax Exemption">
            <div
              onClick={() => {
                setSelectedRecord(record);
                setModalCreate(true);
              }}
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
              }}
            >
              <SVGIcon name="IconButtonCreate" width={20} />
            </div>
          </Tooltip>
        ),
      },
      {
        action: "History",
        type: "table",
        render: (record) => (
          <Tooltip title="Approval History">
            <div
              style={{
                cursor: "pointer",
                display: "inline-block",
                lineHeight: 0,
              }}
            >
              <SVGIcon name="IconHistory" width={20} />
            </div>
          </Tooltip>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Action columns with permission check
  const actionCols = useColumnActionPermission(
    ["create", "history"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 100,
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
    <LayoutMenu>
      <Spin spinning={loading || false}>
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

        {/* Modal Create Tax Exemption */}
        <ModalCreateTaxExemption
          isOpen={modalCreate}
          onClose={() => {
            setModalCreate(false);
            setSelectedRecord(null);
            setListDataAttachment([]);
            setSelectedHierarchy(undefined);
          }}
          record={selectedRecord}
          appHierOptions={appHierOptions}
          appHierDataDetail={appHierDataDetail}
          selectedHierarchy={selectedHierarchy}
          setSelectedHierarchy={setSelectedHierarchy}
          listDataAttachment={listDataAttachment}
          setListDataAttachment={setListDataAttachment}
          dispatch={dispatch}
          onSubmit={(values) => {
            // TODO: dispatch create tax exemption action
            console.log("Submit tax exemption:", values);
            setModalCreate(false);
            setSelectedRecord(null);
            setListDataAttachment([]);
            setSelectedHierarchy(undefined);
          }}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default ViewTaxExemption;
