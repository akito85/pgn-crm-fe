import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import ServiceRequestTable from "./ServiceRequestTable";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { getFilteredServiceRequests } from "../../../../../../redux/slices/account_management/detailAccount/ServiceRequest";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NotFound from "../../../../../NotFound";

const ServiceRequest = ({ idAccount, idCustomer, type }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchInput = useRef(null);

  const { serviceRequests, pagination, loading } = useSelector(
    (state) => state.serviceRequest
  );
  const { access_account } = useSelector((state) => state.accountManagement);

  // Access check state
  const [isAccessChecked, setIsAccessChecked] = useState(false);

  // Table states
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [tempFilters, setTempFilters] = useState([]);

  // Derived states
  const currentData = useMemo(() => serviceRequests || [], [serviceRequests]);
  const currentPagination = pagination;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  const isAccessGranted = access_account?.isGranted === true;

  // Check granted access when component mounts
  useEffect(() => {
    setIsAccessChecked(false);
    const path = location?.pathname.includes("account-standard")
      ? "/account-management/account-standard/service-request"
      : "/account-management/account-onetime/service-request";

    dispatch(getGrantedAccessAccount(path))
      .unwrap()
      .then(() => setIsAccessChecked(true))
      .catch(() => setIsAccessChecked(true));
  }, [dispatch, location?.pathname]);

  // Fetch data when filters change
  useEffect(() => {
    if (isAccessGranted) {
      const body = {
        page,
        size: loadMoreSize,
        sort,
        searchs: search,
        inputFields: tempFilters,
      };

      dispatch(
        getFilteredServiceRequests({
          idAccount,
          body,
          isLoadMore: false,
        })
      );
    }
  }, [sort, search, tempFilters, isAccessGranted]);

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

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download service requests");
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = currentPagination?.totalPages || 0;

    if (nextPage <= totalPages) {
      const body = {
        page: nextPage,
        size: loadMoreSize,
        sort,
        searchs: JSON.stringify(search),
        inputFields: tempFilters,
      };

      await dispatch(
        getFilteredServiceRequests({
          idAccount,
          body,
          isLoadMore: true,
        })
      );
    }
    setPage(nextPage);
  };

  return (
    <Fragment>
      {!isAccessChecked ? (
        <div className="w-full flex justify-center py-10">
          <Spin tip="Checking access..." />
        </div>
      ) : !isAccessGranted ? (
        <NotFound type={"unauthorized"} />
      ) : (
        <NxCardContainer header={"SERVICE REQUEST"}>
          <NxBaseContainer border>
            <ServiceRequestTable
              data={dataSourceWithKeys}
              idAccount={idAccount}
              idCustomer={idCustomer}
              totalElement={currentPagination?.totalElements || 0}
              page={page}
              onSort={onSort}
              handleApproval={setShowApprovalModal}
              handleDownload={handleDownload}
              handleLoadMore={handleLoadMore}
              hasMore={hasMore}
              searchText={searchText}
              search={search}
              searchedColumn={searchedColumn}
              searchInput={searchInput}
              handleSearch={handleSearch}
              loading={loading}
            />
          </NxBaseContainer>
        </NxCardContainer>
      )}
    </Fragment>
  );
};

export default ServiceRequest;
