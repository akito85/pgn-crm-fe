import React, { useEffect, Fragment, useState, useRef } from "react";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../../../utils";
import columnsDetail from "../../Table/TableDetailMappingInformation";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";

const DetailMappingInformation = ({
  dataTable = [],
  subHeader = "",
  handleDataMapChanges = () => {},
  dataMapDetailItemList = [],
  setIsEditabled = () => {},
  type = "create",
  isEditabled = false,
  startDateMappping = null,
  endDateMapping = null,
  handleValidateUpdate = () => {}
}) => {
  // declare
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [dataMappingItem, setDataMappingItem] = useState([]);

  useEffect(() => {
    //filter data ddl for mapping info
    setDataMappingItem(
      dataMapDetailItemList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) => dataTableItem.item === dataCategoryItem.id
            )
        )
        ?.map((item) => {
          return { value: item?.id, label: item?.name };
        })
    );
  }, [dataTable, dataMapDetailItemList]);

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

  const handleUnFilterList = (e) => {
    setDataMappingItem(
      dataMapDetailItemList
        .filter(
          (dataCategoryItem) =>
            !dataTable.some(
              (dataTableItem) =>
                dataTableItem.item === dataCategoryItem.id &&
                e.item !== dataCategoryItem.id
            )
        )
        ?.map((item) => {
          return { value: item?.id, label: item?.name };
        })
    );
  };

  return (
    <Fragment>
      <DynamicTableInlineBilling
        header={"DETAIL MAPPING INFORMATION"}
        subHeader={`Category: ${subHeader}`}
        tableData={dataTable}
        totalData={dataTable.length || 0}
        onDataChange={handleDataMapChanges}
        cols={columnsDetail(
          search,
          isEditabled,
          type,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          onFilter,
          sorterDetail,
          dataMappingItem //list ddl
        )?.filter((item) => !(item.title === "ACTION"))}
        scrollTable={{ x: 1500, y: 500 }}
        usePagination={true}
        useSelect={true}
        pageSize={pageSize}
        current={page}
        // onSort={onSort}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        actionButton={["delete", "update"]}
        actionFix={true}
        setInserted={setIsEditabled}
        unFilterUpdatedlist={handleUnFilterList}
        isDynamicEditable={isEditabled}
        startDateLock={startDateMappping}
        endDateLock={endDateMapping}
        handleValidateUpdate={handleValidateUpdate}
      />
    </Fragment>
  );
};

export default DetailMappingInformation;
