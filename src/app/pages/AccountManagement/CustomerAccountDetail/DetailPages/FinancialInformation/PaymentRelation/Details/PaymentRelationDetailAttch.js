import { Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import axios from "axios";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { configApp } from "../../../../../../../../constants/configApp";
import CardContainer from "../../../../../../../../components/CardContainer";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import { getDetailAttachmentColumns } from "./getDetailAttachmentColumns";
import { getPaymentRelationAttachment } from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { useSelector } from "react-redux";
import { applyFixedColumns } from "../../../../../../../../utils/applyFixedColumns";

const PaymentRelationDetailAttch = ({
  idPr = 0,
  dispatch = () => {},
}) => {
  const financialInformationState = useSelector(
    (state) => state.financialInformation
  );

  const {
    list_prDetailAttachment,
    pagination_prDetailAttachment,
    loading,
  } = financialInformationState;

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    statusApproval: "right",
    status: "right",
    action: "right",
  }));

  const searchInput = useRef(null);

  const currentData = useMemo(() => list_prDetailAttachment, [list_prDetailAttachment]);
  
  const currentPagination = pagination_prDetailAttachment;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  const handleShow = async (r) => {
    if ((r.fileType || r.type).includes("application/vnd")) {
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

  const baseColumns = useMemo(() =>
    getDetailAttachmentColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handleShow,
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
    return applyFixedColumns(allColumns, fixedColumns);
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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_prDetailAttachment?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getPaymentRelationAttachment({
          search: JSON.stringify(search),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  useEffect(() => {
    if (idPr)
      dispatch(getPaymentRelationAttachment({ id: idPr, page, size: loadMoreSize, sort, searchs: JSON.stringify(search) }));
  }, [page, loadMoreSize, sort, search, tempFilters]);

  return (
    <Spin spinning={loadingDownload}>
      <CardContainer header={"ATTACHMENTS"}>
        <NxTable
          idTable="payment-relation-detail-attachment-table"
          dataSource={dataSourceWithKeys}
          totalData={pagination_prDetailAttachment.totalElements}
          current={page}
          tableScrolled={{ y: 400, x: "max-content" }}
          onSort={onSort}
          columns={processedColumns}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnDefinitions}
          loading={loading}
          showAdvanceSearch={false}
        />
      </CardContainer>
    </Spin>
  );
};

export default PaymentRelationDetailAttch;
