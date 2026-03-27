import { Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { tokenHeader } from "../../../../../../../utils/tokenHeader";
import { getBase64 } from "../../../../../../../utils/getBase64";
import { previewFileAttachment } from "../../../../../../../utils/previewFileAttachment";
import { configApp } from "../../../../../../../constants/configApp";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getAttachmentList } from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { getDetailAttachmentColumns } from "./getDetailAttachmentColumns";

const RelationshipDetailAttch = ({
  idAccount = 0,
  idRelationship = 0,
  dispatch = () => {},
}) => {
  const { data_attachmentList, loading } = useSelector(
    (state) => state.relationship
  );

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const searchInput = useRef(null);

  const currentData = useMemo(() => data_attachmentList || [], [data_attachmentList]);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id || item.fileId}-${index}`,
    }));
  }, [currentData]);

  const handleShow = async (r) => {
    const fileType = r.fileType || r.type || "";
    if (fileType.includes("application/vnd")) {
      accountManagementService.downloadData(r.urlFile1);
    } else {
      setLoadingDownload(true);
      try {
        const response = await axios.get(configApp.ACCOUNT_SERVICE + r.urlFile1, {
          headers: tokenHeader(),
          responseType: "blob",
        });
        const base64 = await getBase64(response.data);
        previewFileAttachment(base64);
      } catch (error) {
        console.error("Failed to download file", error);
      } finally {
        setLoadingDownload(false);
      }
    }
  };

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
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

  const baseColumns = useMemo(
    () =>
      getDetailAttachmentColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleShow
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  /**
   * @param {*} _
   * @param {*} __
   * @param {import("antd/lib/table/interface").SorterResult} sort
   */
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  useEffect(() => {
    if (idAccount && idRelationship) {
      dispatch(
        getAttachmentList({
          idAccount,
          idRelationship,
        })
      );
    }
  }, [idAccount, idRelationship, sort, search]);

  return (
    <Spin spinning={loadingDownload}>
      <NxTable
        idTable="relationship-detail-attachment-table"
        dataSource={dataSourceWithKeys}
        totalData={currentData.length}
        current={page}
        tableScrolled={{ x: "max-content" }}
        onSort={onSort}
        columns={processedColumns}
        usePagination={false}
        useInfiniteScroll={false}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
        showAdvanceSearch={false}
      />
    </Spin>
  );
};

export default RelationshipDetailAttch;
