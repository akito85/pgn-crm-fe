import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadServiceAgreement,
  getListServiceAgreement,
} from "../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";

const defaultListConfig = {
  enabled: ({ scope }) => Boolean(scope.idAccount),
  fetchListActionCreator: getListServiceAgreement,
  buildListActionPayload: ({
    scope,
    search,
    inputFields,
    sort,
    page,
    pageSize,
    isLoadMore,
  }) => ({
    id: scope.idAccount,
    body: {
      page,
      size: pageSize,
      sort,
      inputFields,
      searchs: search,
    },
    isLoadMore,
  }),
  downloadActionCreator: downloadServiceAgreement,
  buildDownloadActionPayload: ({
    scope,
    page,
    pageSize,
    sort,
    search,
    inputFields,
  }) => ({
    body: {
      page,
      size: pageSize,
      sort,
      inputFields,
      searchs: search,
      idAccount: scope.idAccount,
      idCustomer: scope.idCustomer,
      type: scope.type,
    },
  }),
  mapRows: (items = []) =>
    items.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
      saServiceType: item?.serviceType,
      termsOfPaymentName: item?.termOfPayment,
    })),
};

export const useServiceAgreementListController = ({
  scope,
  listConfig = {},
}) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.accountServiceAgreement);
  const config = useMemo(() => ({ ...defaultListConfig, ...listConfig }), [listConfig]);

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [inputFields, setInputFields] = useState([]);

  const dataSourceWithKeys = useMemo(
    () => config.mapRows(data?.result || []),
    [config, data?.result]
  );

  const totalElements = data?.page?.totalElements || 0;
  const hasMore = dataSourceWithKeys.length < totalElements;

  const isExistMain = data?.isExistMain || false;

  const isEnabled = useMemo(() => {
    if (typeof config.enabled === "function") {
      return config.enabled({ scope });
    }

    return Boolean(config.enabled);
  }, [config, scope]);

  const fetchPage = useCallback(
    async ({ nextPage, isLoadMore = false }) => {
      if (!isEnabled) return undefined;

      const payload = config.buildListActionPayload({
        scope,
        search,
        inputFields,
        sort,
        page: nextPage,
        pageSize: loadMoreSize,
        isLoadMore,
      });

      if (!payload) return undefined;

      return dispatch(config.fetchListActionCreator(payload));
    },
    [
      config,
      dispatch,
      isEnabled,
      loadMoreSize,
      scope,
      inputFields,
      search,
      sort,
    ]
  );

  useEffect(() => {
    if (!isEnabled) return;

    fetchPage({ nextPage: 1, isLoadMore: false });
    setPage(1);
  }, [fetchPage, isEnabled]);

  const refresh = useCallback(() => {
    setPage(1);
    return fetchPage({ nextPage: 1, isLoadMore: false });
  }, [fetchPage]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  }, []);

  const handleLoadMore = useCallback(async () => {
    const totalPages = data?.page?.totalPages || 0;
    const nextPage = page + 1;

    if (nextPage <= totalPages) {
      await fetchPage({ nextPage, isLoadMore: true });
      setPage(nextPage);
    }
  }, [data?.page?.totalPages, fetchPage, page]);

  const onSort = useCallback((_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";

    setSort(dataSort);
  }, []);

  const handleDownload = useCallback(() => {
    const payload = config.buildDownloadActionPayload({
      scope,
      page,
      pageSize: loadMoreSize,
      sort,
      search,
      inputFields,
    });

    if (!payload) return Promise.resolve();

    return dispatch(config.downloadActionCreator(payload));
  }, [config, dispatch, inputFields, loadMoreSize, page, scope, search, sort]);

  return {
    dataSourceWithKeys,
    handleDownload,
    handleLoadMore,
    handleSearch,
    hasMore,
    isExistMain,
    inputFields,
    loading,
    onSort,
    page,
    refresh,
    search,
    searchedColumn,
    searchInput,
    searchText,
    setInputFields,
    totalElements,
  };
};
