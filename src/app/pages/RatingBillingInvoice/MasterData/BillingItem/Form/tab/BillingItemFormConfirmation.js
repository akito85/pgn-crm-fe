import { Fragment } from "react";
import React, { useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../../../components/DetailText";
import { useState, useMemo } from "react";
import { dateFormatting, hasValue } from "../../../../../../../utils";
import TableRBI from "../../../../../../../components/TableRBI";
import columnsMapping from "../../Table/TableMappingInformation";
import columnsDetail from "../../Table/TableDetailMappingInformation";
import { useSelector } from "react-redux";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const onFilter = (dataIndex, value, record) => {
  const search = moment(value, dateFormatting.dateFormal, true).isValid()
    ? moment(value).format(dateFormatting.date).toLowerCase()
    : value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date.toString().toLowerCase().includes(search);
    case "fileSize":
      return record.size.includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return `${obj[fieldSort]}`.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a === null && b === null) return 0; // Both are null, consider equal
        if (a === null) return 1; // `a` is null, place it as greater (bottom)
        if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (hasValue(a) && hasValue(b)) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const sorterDetail = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return `${obj[fieldSort]}`.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a === null && b === null) return 0; // Both are null, consider equal
        if (a === null) return 1; // `a` is null, place it as greater (bottom)
        if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (hasValue(a) && hasValue(b)) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      default:
        return a.localeCompare(b);
    }
  };
  return handleCompare(fa, fb);
};

const BillingItemFormConfirmation = ({ dataConfirm = {}, dataCriteriaTable = [], dataMappingItemTable = [] }) => {
  const { 
    data_billingItemCategoryDdl, 
    data_billType, 
    data_typeList, 
    data_criteriaList, 
    data_categoryList,
    data_specialGLList,
    data_glAccountList,
    data_classificationTypeList,
    data_accountTypeList,
    data_glAccountBankList,
    data_mappingItemTypeList
  } = useSelector(
    (state) => state.billing_item
  );

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [detailMapping, setDetailMapping] = useState(false);
  const [category, setCategory] = useState("");
  const [dataDetailTable, setDataDetailTable] = useState([]);
  const [subHeader, setSubHeader] = useState("");
  const [activeTab, setActiveTab] = useState("mapping");
  
  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const [searchedColumnDetail, setSearchedColumnDetail] = useState("");
  const [searchTextDetail, setSearchTextDetail] = useState("");
  const searchInputDetail = useRef(null);
  const [searchDetail, setSearchDetail] = useState({});
  const [sort, setSort] = useState("");
  const [sortDetail, setSortDetail] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    setPageDetail(pageSizeDetail !== pageSizeChange ? 1 : pageChange);
    setPageSizeDetail(pageSizeChange);
  };

  const onSortMapping = (_, __, sorter) => {
    setSort(
      sorter.order
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
    setPage(1);
  };

  const onSortDetail = (_, __, sorter) => {
    setSortDetail(
      sorter.order
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
    setPageDetail(1);
  };

  const handleSearchDetail = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextDetail(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumnDetail !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumnDetail(dataIndex);
    setSearchDetail((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleDetail = (e) => {
    if (e.category === category) {
      setDetailMapping(false);
      setCategory("");
    } else {
      setCategory(e.category);
      setSubHeader(
        dataConfirm.mappingInfo.filter(
          (item) => item.category === e.category
        )[0]?.categoryName
      )
      setDataDetailTable(
        dataConfirm?.mappingInfo?.filter(
          (item) => item.category === e.category
        )[0]?.detail
      );
      setDetailMapping(true);
    }
  };

  const [fixedColumns, setFixedColumns] = useState({ left: ["NO"], right: ["ACTION"] });
  const [fixedColumnsDetail, setFixedColumnsDetail] = useState({ left: ["NO"], right: [] });

  const mappingColumns = useMemo(() => columnsMapping(
    search,
    false,
    "detail",
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    handleDetail,
    onFilter,
    sorter
  ), [search, page, pageSize, searchedColumn, searchText]);

  const detailCols = useMemo(() => columnsDetail(
    searchDetail,
    false,
    "detail",
    pageDetail,
    pageSizeDetail,
    searchInputDetail,
    searchedColumnDetail,
    searchTextDetail,
    handleSearchDetail,
    onFilter,
    sorterDetail
  )?.filter((item) => !(item.title === "ACTION")), [searchDetail, pageDetail, pageSizeDetail, searchedColumnDetail, searchTextDetail]);

  const columnDefinitionsMapping = useMemo(() => mappingColumns.map(col => ({
    key: col.key || col.dataIndex || col.title,
    title: col.title
  })), [mappingColumns]);

  const columnDefinitionsDetail = useMemo(() => detailCols.map(col => ({
    key: col.key || col.dataIndex || col.title,
    title: col.title
  })), [detailCols]);

  const criteriaCols = useMemo(() => {
    const isBank = dataConfirm?.bank || !!dataConfirm?.bankValue;
    const criteriaCode = data_criteriaList?.find(
      (c) => c.id === dataConfirm?.criteria?.[0]?.criteriaCode || c.code === dataConfirm?.criteria?.[0]?.criteriaCode
    )?.code;

    const renderSelectValue = (value, options) => {
      if (!value && value !== 0) return "-";
      const found = options.find((o) => o.value === value || o.label === value);
      return found ? found.label : value || "-";
    };

    let dynamicCriteriaCol = [];
    if (criteriaCode === "CLASSIFICATION_TYPE") {
      const opts = (data_classificationTypeList || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));
      dynamicCriteriaCol.push({
        title: "CLASSIFICATION TYPE",
        dataIndex: "criteriaValue",
        render: (value) => renderSelectValue(value, opts),
      });
    } else if (criteriaCode === "ACCOUNT_TYPE") {
      const opts = (data_accountTypeList || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));
      dynamicCriteriaCol.push({
        title: "ACCOUNT TYPE",
        dataIndex: "criteriaValue",
        render: (value) => renderSelectValue(value, opts),
      });
    }

    const glAccountOpts = (isBank && data_glAccountBankList?.length > 0)
      ? (data_glAccountBankList || []).map((item) => ({
          value: item.glNumber,
          label: `${item.glNumber} - ${item.glDescription}`,
        }))
      : (data_glAccountList || []).map((item) => ({
          value: item.glAccountId ?? item.id,
          label: `${item.glAccount ?? item.account} - ${item.glAccountDesc ?? item.name}`,
        }));

    const specialGlOpts = (data_specialGLList || []).map((item) => ({
      value: item.id,
      label: item.name,
    }));

    return [
      {
        title: "NO",
        dataIndex: "no",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      ...dynamicCriteriaCol,
      {
        title: "GL ACCOUNT",
        dataIndex: "glAccountId",
        render: (value) => renderSelectValue(value, glAccountOpts),
      },
      {
        title: "DESCRIPTION ACCOUNT",
        dataIndex: "descriptionAccount",
        render: (value) => value || "-",
      },
      {
        title: "SPECIAL GL",
        dataIndex: "specialGlId",
        render: (value) => renderSelectValue(value, specialGlOpts),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        render: (value) => value || "-",
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        render: (value) => value || "-",
      },
    ];
  }, [
    dataConfirm, data_criteriaList, data_classificationTypeList, data_accountTypeList,
    data_glAccountBankList, data_glAccountList, data_specialGLList
  ]);

  const columnDefinitionsCriteria = useMemo(() => criteriaCols.map(col => ({
    key: col.key || col.dataIndex || col.title,
    title: col.title
  })), [criteriaCols]);

  // Sliced data for FE pagination in TableRBI
  const processedMappingData = useMemo(() => {
    let filtered = (dataConfirm?.mappingInfo || []);
    
    // Filter
    Object.keys(search).forEach(key => {
      if (search[key]) {
        filtered = filtered.filter(item => onFilter(key, search[key], item));
      }
    });

    // Sort
    if (sort) {
      const [field, order] = sort.split("~");
      filtered = [...filtered].sort((a, b) => {
        const result = sorter(field, a, b);
        return order === "asc" ? result : -result;
      });
    }

    return filtered;
  }, [dataConfirm?.mappingInfo, search, sort]);

  const processedDetailData = useMemo(() => {
    let filtered = (dataDetailTable || []);
    
    // Filter
    Object.keys(searchDetail).forEach(key => {
      if (searchDetail[key]) {
        filtered = filtered.filter(item => onFilter(key, searchDetail[key], item));
      }
    });

    // Sort
    if (sortDetail) {
      const [field, order] = sortDetail.split("~");
      filtered = [...filtered].sort((a, b) => {
        const result = sorterDetail(field, a, b);
        return order === "asc" ? result : -result;
      });
    }

    return filtered;
  }, [dataDetailTable, searchDetail, sortDetail]);

  const slicedMappingData = useMemo(() => {
    return processedMappingData.slice((page - 1) * pageSize, page * pageSize);
  }, [processedMappingData, page, pageSize]);

  const slicedDetailData = useMemo(() => {
    return processedDetailData.slice((pageDetail - 1) * pageSizeDetail, pageDetail * pageSizeDetail);
  }, [processedDetailData, pageDetail, pageSizeDetail]);

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"BILLING ITEM INFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Category">
           {
             (data_categoryList || data_billingItemCategoryDdl || [])?.find(
               (item) => item.categoryId === dataConfirm?.billingItemCategory || item.id === dataConfirm?.billingItemCategory
             )?.name || "-"
           }
        </DetailText>
        <DetailText label="Type">
           {
             (data_typeList || [])?.find(
               (item) => item.code === dataConfirm?.transMappingType || item.id === dataConfirm?.transMappingType
             )?.name || "-"
           }
        </DetailText>
        <DetailText label="Transaction Mapping Code">
           {dataConfirm?.billingItemCode || "-"}
        </DetailText>

        <DetailText label="Name">{dataConfirm?.name || "-"}</DetailText>
        <DetailText label="Bill Type">
          {
            (data_billType || [])?.find(
              (item) => item.id === dataConfirm?.billType
            )?.name || "-"
          }
        </DetailText>
        <DetailText label="Criteria">
          {
            (data_criteriaList || [])?.find(
              (item) => item.code === (dataConfirm?.criteria?.[0]?.criteriaCode) || item.id === (dataConfirm?.criteria?.[0]?.criteriaCode)
            )?.name || "-"
          }
        </DetailText>

        <DetailText label="Start Date">{dataConfirm?.startDate || "-"}</DetailText>
        <DetailText label="End Date">
          {dataConfirm?.endDate ? dataConfirm?.endDate : "-"}
        </DetailText>
        <div />

        {(dataConfirm?.bank || !!dataConfirm?.bankValue) && (
          <>
            <DetailText label="Bank">
              {dataConfirm?.bankValue || "-"}
            </DetailText>
            <DetailText label="Bank Account Number">
              {dataConfirm?.bankAccountNumber || "-"}
            </DetailText>
            <div />
          </>
        )}

        <div className="col-span-3">
          <DetailText label="Description">
            {dataConfirm?.description || "-"}
          </DetailText>
        </div>

        <DetailText label="Late Charge Object">
          {dataConfirm?.lateCharge ? "Yes" : "No"}
        </DetailText>
        <DetailText label="Payment Warranty Deduction Object">
          {dataConfirm?.paymentWarranty ? "Yes" : "No"}
        </DetailText>
        <DetailText label="Installment / Restructure">
          {dataConfirm?.installment ? "Yes" : "No"}
        </DetailText>
        <DetailText label="Bank">
          {(dataConfirm?.bank || !!dataConfirm?.bankValue) ? "Yes" : "No"}
        </DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"MAPPING INFORMATION"}
      </div>

      <Tabs
        defaultActiveKey="mapping"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        type="card"
        className="mb-4"
      >
        <TabPane tab="Mapping Detail" key="mapping" />
        <TabPane tab="Criteria Detail" key="criteria" />
      </Tabs>

      {activeTab === "mapping" && (
        <div className="w-full">
          <TableRBI
            idTable="mappingInfoTable"
            dataSource={slicedMappingData}
            columns={mappingColumns}
            totalData={processedMappingData?.length || 0}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSortMapping}
            tableScrolled={{ y: 525, x: 2000 }}
            columnDefinitions={columnDefinitionsMapping}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            showAdvanceSearch={false}
            showSearchBar={false}
            showExport={false}
          />
          {detailMapping ? (
            <div className="mt-5">
              <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
                {"DETAIL MAPPING INFORMATION"}
              </div>
              <div className="text-primary text-xs font-bold mt-3">
                {`Category: ${subHeader || ""}`}
              </div>
              <TableRBI
                idTable="detailMappingInfoTable"
                dataSource={slicedDetailData}
                columns={detailCols}
                totalData={processedDetailData?.length || 0}
                current={pageDetail}
                pageSize={pageSizeDetail}
                onChange={handleChangeDetail}
                onSizeChanger={handleChangeDetail}
                onSort={onSortDetail}
                tableScrolled={{ y: 525, x: 2000 }}
                columnDefinitions={columnDefinitionsDetail}
                fixedColumns={fixedColumnsDetail}
                setFixedColumns={setFixedColumnsDetail}
                showAdvanceSearch={false}
                showSearchBar={false}
                showExport={false}
              />
            </div>
          ) : null}
        </div>
      )}

      {activeTab === "criteria" && (
        <div className="w-full">
          <TableRBI
            idTable="criteriaDetailInfoTable"
            dataSource={dataCriteriaTable}
            columns={criteriaCols}
            totalData={dataCriteriaTable?.length || 0}
            tableScrolled={{ y: 525, x: 1200 }}
            columnDefinitions={columnDefinitionsCriteria}
            fixedColumns={{ left: ["NO"], right: [] }}
            showAdvanceSearch={false}
            showSearchBar={false}
            showExport={false}
            usePagination={false}
          />
        </div>
      )}
    </Fragment>
  );
};

export default BillingItemFormConfirmation;
