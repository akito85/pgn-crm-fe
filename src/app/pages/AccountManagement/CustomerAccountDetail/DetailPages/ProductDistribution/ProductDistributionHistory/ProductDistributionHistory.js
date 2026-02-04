import React, { Fragment, useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import { dateFormatting } from "../../../../../../../utils";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";
import { Link, useLocation } from "react-router-dom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../../components/Modal/ModalPopUp";
import { useColumnActionPermissionAccount } from "../../../../ComponentAccount/ColumnActionPermissionAccount";
import ProductDistributionDetail from "./ProductDistributionDetail";
import { deletePD, getAllPDHistoryPaginate, getDetailPDHistory } from "../../../../../../../redux/slices/account_management/detailAccount/ProductDistributionSlice";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "EFFECTIVE DATE",
      sorter: true,
      align: "center",
      dataIndex: "effectiveDate",
      ...getColumnSearchPropsPaging(
        "effectiveDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => {
        const tempValue = text ? moment(text).format(dateFormatting.date) : "";
        if (searchedColumn === "effectiveDate") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempValue || ""}
            />
          );
          if (tempValue) {
            return highlight;
          }
          return highlight;
        } else {
          if (tempValue) {
            return tempValue;
          }
          return "";
        }
      },
    },
    {
      title: "LOCAL (%)",
      dataIndex: "value1",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "value1",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "EXPORT (%)",
      dataIndex: "value2",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "value2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
  ];
};

const ProductDistributionHistory = ({ id, idCustomer }) => {
  // Selector
  const { access_account } = useSelector((state) => state.accountManagement);
  const { data, data_detail_history } = useSelector(
    (state) => state.productDistribution
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [effectiveData, setEffectiveData] = useState();
  const [modalDetail, setModalDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [idData, setIdData] = useState();
  const location = useLocation();

  // Use Effect

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/product-distribution'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/product-distribution'))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getAllPDHistoryPaginate({
        id: id,
        search: encodeURIComponent(JSON?.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, id, search, page, pageSize, sort]);

  // Function Search Column
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

  // Function Change Pagination
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Function Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemGrantAccess = [
    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={20}
                onClick={() => handleDetail(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PRODUCT_DISTRIBUTION}
            state={{ idPD: record.id, accountId: id, idCustomer: idCustomer }}
          >
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon name="IconEdit" width={20} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Delete">
            <div className="pt-1">
              <SVGIcon
                name="IconDelete"
                width={20}
                onClick={() => handleDelete(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  // Handle Detail
  const handleDetail = (record) => {
    setModalDetail(true);
    dispatch(getDetailPDHistory(record.id));
  };

  // Handle Delete
  const handleDelete = (record) => {
    setModalDelete(true);
    setIdData(record?.id);
    setEffectiveData(record?.effectiveDate);
  };

  const handleDeleteOk = () => {
    setModalDelete(false);

    dispatch(deletePD(idData))
      .unwrap()
      .then(() => {
        setModalDetail(false);
        setIdData();
        setEffectiveData();
        dispatch(
          getAllPDHistoryPaginate({
            id: id,
            search: encodeURIComponent(JSON?.stringify(search)),
            page,
            pageSize,
            sort,
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setIdData();
    setEffectiveData();
  };

  const handleRetry = () => {
    handleDeleteOk();
    setModalError(false);
    setIdData();
    setEffectiveData();
  };
  return (
    <Fragment>
      <NxBaseContainer border header={"PRODUCT DISTRIBUTION HISTORY LIST"}>
        <NxTable
          idTable="table-product-distribution-history"
          dataSource={dataSource}
          totalData={data?.page?.totalElements}
          current={page}
          tableScrolled={{ y: 525, x: dataSource?.length ? "max-content" : "100%" }}
          onSort={onSort}
            columns={[
            ...columns(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleDetail,
              handleDelete
            ),
            ...useColumnActionPermissionAccount(
              ["View", "Update", "Delete"],
              itemGrantAccess,
              access_account
            ),
          ]}
          usePagination={false}
          useInfiniteScroll={true}
        />
      </NxBaseContainer>

      {/* Modal Detail */}
      <ProductDistributionDetail
        openModal={modalDetail}
        closeModal={() => setModalDetail(false)}
        data_detail={data_detail_history}
      />

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        width={550}
        useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <SVGIcon name="IconAlertTriangle" width={48} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure you want to delete Raw Material Source with effective date ${moment(
              effectiveData
            ).format(dateFormatting.date)}?`}
          </p>
        </div>
      </ModalConfirm>

      {/* Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not deleted.
            ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default ProductDistributionHistory;
