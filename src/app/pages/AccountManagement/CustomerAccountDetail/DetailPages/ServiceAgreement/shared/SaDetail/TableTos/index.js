import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import NxTable from '../../../../../../../../../components/Nx/NxTable';
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import ButtonComponent from '../../../../../../../../../components/ButtonComponent';
import { getTosColumns, getTosDetailColumns } from '../columns/getTosColumns';

const TableTos = ({
  isProduct,
  dataTermOfService = [],
  setDataTermOfService,
  openModalFormTos,
  setModalChooseTos,
  dataTosFromProductVersion,
}) => {
  const searchInput = useRef(null);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [, setdataUpdate] = useState([]);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const deleteRow = useCallback((record) => {
    setDataTermOfService((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
  }, [setDataTermOfService]);

  // Process and filter data
  const processedData = useMemo(() => {
    let result = [...dataTermOfService];

    // Apply search filter
    if (searchedColumn && searchText) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }

    // Apply sorting
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = a[fieldSort];
        let fb = b[fieldSort];
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [dataTermOfService, searchedColumn, searchText, fieldSort, orderSort]);

  // Initialize display data
  useEffect(() => {
    const initialData = processedData.slice(0, loadedCount);
    setDisplayData(initialData);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      const nextCount = loadedCount + 20;
      const nextData = processedData.slice(0, nextCount);
      setDisplayData(nextData);
      setLoadedCount(nextCount);
      setHasMore(nextCount < processedData.length);
      resolve();
    });
  }, [processedData, loadedCount]);

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    // Reset to first page when sorting
    setLoadedCount(20);
  };

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
    // Reset to first page when searching
    setLoadedCount(20);
  }, []);

  const columns = useMemo(() => {
    return getTosColumns({
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      isProduct,
      openModalFormTos,
      setdataUpdate,
      deleteRow,
    });
  }, [
    search,
    searchedColumn,
    searchText,
    isProduct,
    openModalFormTos,
    handleSearch,
    deleteRow,
  ]);

  const columnDefinitions = useMemo(() => {
    return columns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [columns]);

  // Expandable row render for TOS Detail
  const expandedRowRender = (record) => {
    const dataExpand = record?.tosDetail || [];
    const detailColumns = getTosDetailColumns();

    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          TOS DETAIL
        </p>
        <Table
          dataSource={dataExpand}
          columns={detailColumns}
          pagination={false}
          className="mb-4"
          rowKey={(record, index) => index}
        />
      </div>
    );
  };

  return (
    <div>
      {isProduct === 2 && (
        <div className="flex w-full justify-end pb-4">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={() => setModalChooseTos(true)}
          >
            Choose
          </ButtonComponent>
        </div>
      )}

      <NxTable
        idTable="tos-table"
        dataSource={displayData}
        columns={columns}
        totalData={processedData.length}
        tableScrolled={{ y: 400, x: "max-content" }}
        onSort={onSort}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={false}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.tosDetail && record.tosDetail.length > 0,
        }}
        showAdvanceSearch={false}
        showSearchBar={false}
      />
    </div>
  );
};

export default TableTos;
