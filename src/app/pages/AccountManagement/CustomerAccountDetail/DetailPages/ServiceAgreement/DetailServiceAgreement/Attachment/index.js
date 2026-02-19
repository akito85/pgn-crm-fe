import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Spin, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import FileSaver from "file-saver";
import axios from "axios";
import { useDispatch } from "react-redux";

import NxTable from '../../../../../../../../components/Nx/NxTable';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../../../utils/getColumnSearchProps';
import { hasValue, renderColumn } from '../../../../../../../../utils';
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { bytesConverter } from "../../../../../../../../utils/bytesConverter";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import { configApp } from "../../../../../../../../constants/configApp";
import accountManagementService from '../../../../../../../../redux/services/account_management/accountManagementService';

const Attachment = ({ dataSource }) => {
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loadingDownload, setLoadingDownload] = useState(false);

  const service = accountManagementService;
  const configApplication = configApp.ACCOUNT_SERVICE;

  const dataAttachment = useMemo(() => {
    if (!dataSource) return [];
    const urlLink = (id) => `/v1/dbs/api/sa/download/${id}`;
    return dataSource.map((item) => ({
      ...item,
      createdDate: item.uploadDate,
      fileSize: bytesConverter(item.fileSize || 0),
      urlFile1: urlLink(item?.id),
      dataType: "exist",
    }));
  }, [dataSource]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      let tempData = { ...prevState };
      if (selectedKeys[0]) {
        tempData[dataIndex] = selectedKeys[0];
      } else {
        delete tempData[dataIndex];
      }
      return tempData;
    });
    setLoadedCount(20);
  };

  const processedData = useMemo(() => {
    let result = [...dataAttachment];

    // Apply FE search filters
    if (Object.keys(search).length > 0) {
      result = result.filter(item =>
        Object.entries(search).every(([key, val]) =>
          !val || item[key]?.toString()?.toLowerCase()?.includes(val.toLowerCase())
        )
      );
    }

    if (!fieldSort) return result;
    return [...result].sort((a, b) => {
      const fa = a[fieldSort]?.toString()?.toLowerCase() || "";
      const fb = b[fieldSort]?.toString()?.toLowerCase() || "";
      if (fa < fb) return orderSort === "asc" ? -1 : 1;
      if (fa > fb) return orderSort === "asc" ? 1 : -1;
      return 0;
    });
  }, [dataAttachment, fieldSort, orderSort, search]);

  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

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

  const handleShow = async (r) => {
    if (r.dataType !== "exist") {
      if (r.fileType.includes("application/vnd")) {
        FileSaver.saveAs(r.base64, r.fileName);
      } else {
        previewFileAttachment(r.base64);
      }
    } else {
      if ((r.fileType || r.type).includes("application/vnd")) {
        dispatch(service.downloadData(r.urlFile1));
      } else {
        setLoadingDownload(true);
        const response = await axios.get(configApplication + r.urlFile1, {
          headers: tokenHeader(),
          responseType: "blob",
        });
        const base64 = await getBase64(response.data);
        setLoadingDownload(false);
        previewFileAttachment(base64);
      }
    }
  };

  const columns = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "CATEGORY",
      key: "category",
      dataIndex: "category",
      sorter: true,
      filteredValue: search?.["category"] ? [search?.["category"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "category", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("category", hasValue(search["category"]), searchText, text, false, "input", search),
    },
    {
      title: "FILE NAME",
      key: "fileName",
      dataIndex: "fileName",
      sorter: true,
      filteredValue: search?.["fileName"] ? [search?.["fileName"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "fileName", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("fileName", hasValue(search["fileName"]), searchText, text, false, "input", search),
    },
    {
      title: "UPLOAD BY",
      key: "uploadBy",
      dataIndex: "uploadBy",
      sorter: true,
      filteredValue: search?.["uploadBy"] ? [search?.["uploadBy"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "uploadBy", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("uploadBy", hasValue(search["uploadBy"]), searchText, text, false, "input", search),
    },
    {
      title: "UPLOADED DATE",
      key: "uploadDate",
      dataIndex: "uploadDate",
      sorter: true,
      filteredValue: search?.["uploadDate"] ? [search?.["uploadDate"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "uploadDate", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("uploadDate", hasValue(search["uploadDate"]), searchText, text, false, "input", search),
    },
    {
      title: "FILE SIZE",
      key: "fileSize",
      dataIndex: "fileSize",
      sorter: true,
      filteredValue: search?.["fileSize"] ? [search?.["fileSize"]] : null,
      ...getColumnSearchPropsUseFilteredValueFE(search, "fileSize", searchInput, searchedColumn, searchText, handleSearch, true, "input"),
      render: (text) => renderColumn("fileSize", hasValue(search["fileSize"]), searchText, text, false, "input", search),
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r) => (
        <div className="flex justify-center align-middle gap-2">
          <Tooltip title="Preview">
            <span className="flex justify-center">
              <EyeOutlined
                style={{ fontSize: "24px", color: "#0075bf" }}
                onClick={() => handleShow(r)}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loadingDownload}>
      <div className="w-full py-6">
        <NxTable
          idTable="sa-detail-attachment-table"
          dataSource={displayData}
          columns={columns}
          totalData={processedData.length}
          tableScrolled={{ x: "max-content", y: 525 }}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={2}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
          }))}
          onChange={onSort}
          loading={false}
          showAdvanceSearch={false}
          showSearchBar={false}
        />
      </div>
    </Spin>
  );
};

export default Attachment;