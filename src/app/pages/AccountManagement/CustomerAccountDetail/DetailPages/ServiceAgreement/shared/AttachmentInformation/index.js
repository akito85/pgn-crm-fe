import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../../../../utils";
import { bytesConverter } from "../../../../../../../../utils/bytesConverter";

const ServiceAgreementAttachmentInformation = ({
  dataSource = [],
  header = "ATTACHMENT INFORMATION",
  tableId = "service-agreement-attachment-table",
}) => {
  const searchInput = useRef(null);

  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [loadedCount, setLoadedCount] = useState(20);
  const [displayData, setDisplayData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [fixedColumns, setFixedColumns] = useState({ right: [], left: [] });

  const normalizedData = useMemo(
    () =>
      (dataSource || []).map((item, index) => {
        const rawSize = item?.fileSize;
        const fileSizeText =
          typeof rawSize === "string" && /[a-zA-Z]/.test(rawSize)
            ? rawSize
            : bytesConverter(Number(rawSize || 0));

        return {
          key: item?.key || item?.id || index + 1,
          category: item?.category || item?.categoryName || item?.documentCategory || "-",
          fileName: item?.fileName || item?.name || "-",
          fileSize: fileSizeText,
          uploadBy: item?.uploadBy || item?.createdBy || "-",
          uploadDate: item?.uploadDate || item?.createdDate || "-",
        };
      }),
    [dataSource]
  );

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();

    const selectedValue = selectedKeys[0];
    setSearchText(selectedValue);
    setSearchedColumn(selectedValue ? dataIndex : "");
    setSearch((prevState) => {
      const nextSearch = { ...prevState };
      if (selectedValue) {
        nextSearch[dataIndex] = selectedValue;
      } else {
        delete nextSearch[dataIndex];
      }
      return nextSearch;
    });
    setLoadedCount(20);
  }, []);

  const handleSort = useCallback((_, __, sorter) => {
    if (!sorter?.order) {
      setFieldSort("");
      setOrderSort("");
      setLoadedCount(20);
      return;
    }

    setFieldSort(sorter.field);
    setOrderSort(sorter.order === "ascend" ? "asc" : "desc");
    setLoadedCount(20);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!hasMore) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setLoadedCount((prevValue) => prevValue + 20);
      resolve();
    });
  }, [hasMore]);

  const processedData = useMemo(() => {
    let tempData = [...normalizedData];

    Object.entries(search).forEach(([searchKey, searchValue]) => {
      if (!searchValue) {
        return;
      }

      const normalizedValue = searchValue.toString().toLowerCase();
      tempData = tempData.filter((item) =>
        (item[searchKey] || "").toString().toLowerCase().includes(normalizedValue)
      );
    });

    if (fieldSort && orderSort) {
      tempData.sort((a, b) => {
        const valueA = (a[fieldSort] || "").toString().toLowerCase();
        const valueB = (b[fieldSort] || "").toString().toLowerCase();

        if (orderSort === "asc") {
          return valueA.localeCompare(valueB, undefined, { numeric: true });
        }

        return valueB.localeCompare(valueA, undefined, { numeric: true });
      });
    }

    return tempData;
  }, [fieldSort, normalizedData, orderSort, search]);

  useEffect(() => {
    setDisplayData(processedData.slice(0, loadedCount));
    setHasMore(loadedCount < processedData.length);
  }, [loadedCount, processedData]);

  const columns = [
    {
      title: "NO",
      width: 60,
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      width: 220,
      dataIndex: "category",
      key: "category",
      sorter: true,
      filteredValue: search?.category ? [search?.category] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "category",
          hasValue(search.category),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "FILE NAME",
      width: 280,
      dataIndex: "fileName",
      key: "fileName",
      sorter: true,
      filteredValue: search?.fileName ? [search?.fileName] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "fileName",
          hasValue(search.fileName),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "FILE SIZE",
      width: 180,
      dataIndex: "fileSize",
      key: "fileSize",
      sorter: true,
      filteredValue: search?.fileSize ? [search?.fileSize] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "fileSize",
          hasValue(search.fileSize),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "UPLOAD BY",
      width: 220,
      dataIndex: "uploadBy",
      key: "uploadBy",
      sorter: true,
      filteredValue: search?.uploadBy ? [search?.uploadBy] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uploadBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "uploadBy",
          hasValue(search.uploadBy),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "UPLOADED DATE",
      width: 220,
      dataIndex: "uploadDate",
      key: "uploadDate",
      sorter: true,
      filteredValue: search?.uploadDate ? [search?.uploadDate] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "uploadDate",
          hasValue(search.uploadDate),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
  ];

  return (
    <NxBaseContainer header={header} border>
      <NxTable
        idTable={tableId}
        rowKey="key"
        dataSource={displayData}
        totalData={processedData.length}
        columns={columns}
        columnDefinitions={columns.map((column) => ({
          key: column.key || column.dataIndex || column.title,
          title: column.title,
        }))}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        onSort={handleSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        tableScrolled={{ x: "max-content", y: 320 }}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </NxBaseContainer>
  );
};

export default ServiceAgreementAttachmentInformation;
