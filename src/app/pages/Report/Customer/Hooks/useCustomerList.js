import { useCallback, useMemo, useRef, useState } from "react";
import {
  useGetCustomerAccountPaginationQuery,
  useGetCustomerDownloadMutation,
} from "../../../../../redux/slices/report/report_customer_slice";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";
import columns from "../Columns/CustomerColumn";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useSelector } from "react-redux";

const useCustomerList = () => {
  const [downloadCustomer, { isLoading: loadingCustomer }] =
    useGetCustomerDownloadMutation();
  const { bodyError } = useSelector((state) => state?.general);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { isLoading, data, refetch, isFetching } = useGetCustomerAccountPaginationQuery({
    page,
    pageSize,
    sort,
    search: encodeURIComponent(JSON.stringify(search)),
  });
  const loading = useMemo(() => {
    return isLoading || loadingCustomer || isFetching;
  }, [isFetching, isLoading, loadingCustomer]);

  const handleChange = useCallback(
    (pageChange, pageSizeChange) => {
      setPage(pageSize !== pageSizeChange ? 1 : pageChange);
      setPageSize(pageSizeChange);
    },
    [pageSize]
  );

  const handleDownload = useCallback(async () => {
    // Implement download logic here
    const searchEncoded = encodeURIComponent(JSON.stringify(search));
    await downloadCustomer({
      search: searchEncoded,
      page,
      pageSize,
      sort,
    });
  }, [downloadCustomer, page, pageSize, search, sort]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
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
  }, []);

  const columnsCustomer = useMemo(
    () =>
      columns(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, handleSearch, search]
  );

  const handleSort = useCallback((_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  }, []);

  const handleRetry = async () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "getCustomerDownload") {
        await handleDownload();
        refetch();
      } else {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  const itemActions = useMemo(() => {
    return [
      {
        action: "Download",
        render: (
          <ButtonComponent
            icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
            type={"submit"}
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>
        ),
      },
    ];
  }, [handleDownload]);
  return {
    loading,
    data,
    handleChange,
    page,
    pageSize,
    handleDownload,
    handleSearch,
    itemActions,
    handleSort,
    columnsCustomer,
    renderModal,
  };
};

export default useCustomerList;
