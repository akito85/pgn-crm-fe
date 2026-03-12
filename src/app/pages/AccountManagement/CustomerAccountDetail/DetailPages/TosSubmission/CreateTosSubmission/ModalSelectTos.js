import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { getColumnSearchProps } from "../../../../../../../utils/getColumnSearchProps";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { Table, Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { getListSelectTosSubmissionPaging } from "../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";

const expandedRowRender = (record) => {
  const dataExpand = record?.saTosDetail || [];
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ATTRIBUTE",
      dataIndex: "attributeName",
    },
    {
      title: "VALUE",
      dataIndex: "value",
    },
    {
      title: "UNIT",
      dataIndex: "unitName",
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItemName",
    },
  ];
  return (
    <div className="flex flex-col py-4 px-4 mx-[-16px]">
      <Table
        dataSource={dataExpand}
        columns={columns}
        pagination={false}
        rowKey={(_, index) => index}
      />
    </div>
  );
};

const ModalSelectTos = ({
  idSA,
  modalDetail = false,
  handleCancel = () => { },
  dataObj = {},
  updateObj = () => { },
  updateTable = () => { },
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // NxTable FE state
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const { dataSelect } = useSelector((state) => state.tosSubmission);

  // Fetch all data at once when modal opens
  useEffect(() => {
    if (modalDetail && idSA) {
      setIsLoading(true);
      dispatch(
        getListSelectTosSubmissionPaging({
          id: idSA,
          page: 1,
          pageSize: 9999,
          search: "",
          sort: "",
        })
      ).finally(() => setIsLoading(false));
    }
  }, [modalDetail, idSA, dispatch]);

  // Normalise raw data from redux
  const rawData = useMemo(() => {
    return (dataSelect?.result || []).map((item) => ({
      ...item,
      key: item?.saTosId,
      saTosDetail: (item?.saTosDetail || []).map((detail, index) => ({
        ...detail,
        key: index + 1,
      })),
    }));
  }, [dataSelect]);

  // FE-side filter + sort
  const processedData = useMemo(() => {
    let result = [...rawData];

    if (searchedColumn && searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter((item) =>
        item[searchedColumn]?.toString().toLowerCase().includes(lower)
      );
    }

    if (fieldSort) {
      result.sort((a, b) => {
        const fa = a[fieldSort]?.toString().toLowerCase() || "";
        const fb = b[fieldSort]?.toString().toLowerCase() || "";
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rawData, searchedColumn, searchText, fieldSort, orderSort]);

  // Infinite scroll slice
  useEffect(() => {
    setDisplayData(processedData.slice(0, loadedCount));
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setLoadedCount(20);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
    setLoadedCount(20);
  };

  const handleSelectRow = (record) => {
    updateObj((prevState) => ({
      ...prevState,
      tosId: record?.saTosId,
      tosName: record?.saTosName,
    }));
    updateTable(
      (record?.saTosDetail || []).map((item, index) => ({
        key: index + 1,
        attribute:
          item?.attributeName && item?.attributeId
            ? { label: item?.attributeName, value: item?.attributeId }
            : null,
        value:
          typeof item?.value === "string" ? parseInt(item?.value) : item?.value,
        unit:
          item?.unitName && item?.unitId
            ? { label: item?.unitName, value: item?.unitId }
            : null,
        fromItem:
          item?.fromItemName && item?.fromItemId
            ? { label: item?.fromItemName, value: item?.fromItemId }
            : null,
      }))
    );
    handleCancel();
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "TERM OF SERVICE",
      dataIndex: "saTosName",
      width: 240,
      sorter: true,
      ...getColumnSearchProps(
        "saTosName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "REMARK",
      dataIndex: "saTosDescription",
      width: 240,
      sorter: true,
      ellipsis: { showTitle: false },
      ...getColumnSearchProps(
        "saTosDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (text) {
          return (
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          );
        }
        return "";
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r) => {
        const isSelected = dataObj?.tosId === r?.saTosId;
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Add">
              <span
                className={`flex justify-center${isSelected ? " cursor-not-allowed" : ""}`}
                onClick={!isSelected ? () => handleSelectRow(r) : undefined}
              >
                <SVGIcon
                  name="IconActionCreate"
                  color={!isSelected ? "#0075bf" : "#8D91A0"}
                  width={24}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columnDefinitions = columns.map((col) => ({
    key: col.key || col.dataIndex || col.title,
    title: col.title,
  }));

  return (
    <ModalCustom
      isOpen={modalDetail}
      handleCancel={handleCancel}
      type="detail"
      header="CHOOSE TERM OF SERVICE"
      width={1000}
      footer={
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Back
        </ButtonComponent>
      }
    >
      <NxTable
        idTable="modal-select-tos-table"
        dataSource={displayData}
        columns={columns}
        totalData={processedData.length}
        tableScrolled={{ y: 300, x: "max-content" }}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={2}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        onChange={onSort}
        loading={isLoading}
        showAdvanceSearch={false}
        showSearchBar={false}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) =>
            record?.saTosDetail && record.saTosDetail.length > 0,
        }}
      />
    </ModalCustom>
  );
};

export default ModalSelectTos;
