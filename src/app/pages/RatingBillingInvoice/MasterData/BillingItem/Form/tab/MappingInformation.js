import React, { useEffect, Fragment, useState, useRef } from "react";
import { Tabs } from "antd";
import columnsMapping from "../../Table/TableMappingInformation";
import moment from "moment";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";
import { hasValue } from "../../../../../../../utils";
import CriteriaDetailTab from "./CriteriaDetailTab";

const { TabPane } = Tabs;

const MappingInformation = ({
  dataTable = [],
  handleDataMapChanges = () => {},
  dataCategoryMapList = [],
  handleCreate = () => {},
  isEditabled = false,
  setIsEditabled = () => {},
  type = "Create",
  startDate = null,
  endDate = null,
  setModalRequired = () => {},
  handleValidateUpdate = () => {},
  // Props untuk Criteria Detail tab
  criteriaType = null,
  dataCriteriaTable = [],
  handleChangesCriteriaTable = () => {},
  data_specialGLList = [],
  data_glAccountList = [],
  data_classificationTypeList = [],
  data_accountTypeList = [],
  data_criteriaOptions = [],
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [dataCategoryMap, setDataCategoryMap] = useState([]);

  useEffect(() => {
    setDataCategoryMap(
      dataCategoryMapList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) => dataTableItem.category === dataCategoryItem.id
            )
        )
        ?.map((item) => ({ value: item?.id, label: item?.name }))
    );
  }, [dataTable, dataCategoryMapList]);

  const handleChangePage = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) setPage(1);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const onFilter = (dataIndex, value, record) => {
    const searchVal = value.toLowerCase();
    switch (dataIndex) {
      case "startDate":
      case "endDate":
        const date = record[dataIndex]
          ? moment(record[dataIndex]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase().includes(searchVal);
      case "fileSize":
        return record.size.includes(searchVal);
      default:
        return record[dataIndex]?.toLowerCase().includes(searchVal);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          return obj[fieldSort] ? moment(obj[fieldSort]) : null;
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
          if (a === null && b === null) return 0;
          if (a === null) return 1;
          if (b === null) return -1;
          if (hasValue(a) && hasValue(b)) {
            if (a.isBefore(b)) return -1;
            if (a.isAfter(b)) return 1;
            return 0;
          }
          return 0;
        default:
          return a.localeCompare(b);
      }
    };
    return handleCompare(fa, fb);
  };

  const handleUnFilterList = (e) => {
    setDataCategoryMap(
      dataCategoryMapList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) =>
                dataTableItem.category === dataCategoryItem.id &&
                e.category !== dataCategoryItem.id
            )
        )
        ?.map((item) => ({ value: item?.id, label: item?.name }))
    );
  };

  return (
    <Fragment>
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          marginBottom: "16px",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        <Tabs
          defaultActiveKey="mapping"
          style={{ padding: "0 16px" }}
          tabBarStyle={{ marginBottom: 0 }}
        >
          <TabPane tab="Mapping Detail" key="mapping">
            <DynamicTableInlineBilling
              header={"MAPPING INFORMATION"}
              tableData={dataTable}
              totalData={dataTable.length || 0}
              onDataChange={handleDataMapChanges}
              cols={columnsMapping(
                search,
                isEditabled,
                type,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                () => {},
                onFilter,
                sorter,
                dataCategoryMap
              )}
              scrollTable={{ x: 1500, y: 500 }}
              usePagination={true}
              useSelect={true}
              pageSize={pageSize}
              current={page}
              onCreate={handleCreate}
              onChangePage={handleChangePage}
              onSizeChanger={handleChangePage}
              actionButton={["delete", "update", "create"]}
              actionFix={true}
              isDynamicEditable={isEditabled}
              setInserted={setIsEditabled}
              unFilterUpdatedlist={handleUnFilterList}
              startDateLock={startDate}
              endDateLock={endDate}
              setModalRequired={setModalRequired}
              handleValidateUpdate={handleValidateUpdate}
            />
          </TabPane>

          <TabPane tab="Criteria Detail" key="criteria">
            <CriteriaDetailTab
              criteriaType={criteriaType}
              dataTable={dataCriteriaTable}
              onDataChange={handleChangesCriteriaTable}
              data_specialGLList={data_specialGLList}
              data_glAccountList={data_glAccountList}
              data_classificationTypeList={data_classificationTypeList}
              data_accountTypeList={data_accountTypeList}
              data_criteriaOptions={data_criteriaOptions}
              type={type}
              isEditabled={isEditabled}
              setIsEditabled={setIsEditabled}
              startDateLock={startDate}
              endDateLock={endDate}
              setModalRequired={setModalRequired}
            />
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default MappingInformation;