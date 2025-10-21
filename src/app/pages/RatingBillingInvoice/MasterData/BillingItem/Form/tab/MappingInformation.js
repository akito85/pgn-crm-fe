import React, { useEffect, Fragment, useState, useRef } from "react";
import columnsMapping from "../../Table/TableMappingInformation";
import moment, { isMoment } from "moment";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";
import { hasValue } from "../../../../../../../utils";

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
}) => {
  // declare
  // console.log("isEdit", isEditabled);
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [dataCategoryMap, setDataCategoryMap] = useState([]);
  useEffect(() => {
    //filter data ddl for mapping info
    setDataCategoryMap(
      dataCategoryMapList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) => dataTableItem.category === dataCategoryItem.id,
            ),
        )
        ?.map((item) => {
          return { value: item?.id, label: item?.name };
        }),
    );
  }, [dataTable, dataCategoryMapList]);

  //handle change page and page size and table
  const handleChangePage = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

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

  const onFilter = (dataIndex, value, record) => {
    const search =
      // moment(value, dateFormatting.dateFormal, true).isValid() //adjust for date
      //   ? moment(value).format(dateFormatting.date).toLowerCase()
      //   :
      value.toLowerCase();
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

  const handleUnFilterList = (e) => {
    setDataCategoryMap(
      dataCategoryMapList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) =>
                dataTableItem.category === dataCategoryItem.id &&
                e.category !== dataCategoryItem.id,
            ),
        )
        ?.map((item) => {
          return { value: item?.id, label: item?.name };
        }),
    );
  };

  return (
    <Fragment>
      <DynamicTableInlineBilling
        header={"MAPPING INFORMATION"}
        tableData={dataTable}
        totalData={dataTable.length || 0}
        onDataChange={handleDataMapChanges}
        cols={columnsMapping(
          search,
          isEditabled,
          type, // for fitler detail action
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          () => {}, // no handleDetail
          onFilter,
          sorter,
          dataCategoryMap, //for ddl
        )}
        scrollTable={{ x: 1500, y: 500 }}
        usePagination={true}
        useSelect={true}
        pageSize={pageSize}
        current={page}
        // onSort={onSort}
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
    </Fragment>
  );
};

export default MappingInformation;
