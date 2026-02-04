import React, { Fragment, useEffect, useRef, useState } from "react";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import { useDispatch, useSelector } from "react-redux";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import { dateFormatting } from "../../../../../../../utils";
import { getCurrentPB } from "../../../../../../../redux/slices/account_management/detailAccount/ProductDistributionSlice";
import NxTable from "../../../../../../../components/Nx/NxTable";
import Toolbar from "../../../../../../../components/Toolbar";
import { NavLink } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  onFilter = () => {},
  sorter = () => {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      sorter: true,
      width: 150,
      onFilter: (value, record) => onFilter("country", value, record),
      sorter: (a, b) => sorter("country", a, b),
      ...getColumnSearchPropsPaging(
        "country",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PERCENTAGE (%)",
      dataIndex: "percentage",
      align: "right",
      sorter: true,
      width: 150,
      onFilter: (value, record) => onFilter("percentage", value, record),
      sorter: (a, b) => sorter("percentage", a, b),
      ...getColumnSearchPropsPaging(
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
  ];
};

const CurrentProductDistribution = ({ id, idCustomer }) => {
  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_PRODUCT_DISTRIBUTION}
          state={{
            accountId: id,
            idCustomer: idCustomer,
          }}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];

  // Selector
  const { data_current } = useSelector((state) => state.productDistribution);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_current?.srcDistDtl;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getCurrentPB(id));
  }, [dispatch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  // Handle Change Table
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value.toLowerCase();
    const recordValue = record[dataIndex];

    if (recordValue != null) {
      return recordValue.toString().toLowerCase().includes(fixSearchText);
    }

    return false;
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      const value = obj[fieldSort];
      return value != null ? value.toString().toLowerCase() : "";
    };

    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    return fa.localeCompare(fb);
  };
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase">
        Product Distribution Information
      </div>

      <div className="w-full grid grid-cols-3 gap-4 pt-4">
        <DetailText label={"Effective Date"}>
          {data_current?.effectiveDate
            ? moment(data_current.effectiveDate).format(dateFormatting.date)
            : ""}
        </DetailText>
        <DetailText label={"Local (%)"}>{data_current?.value1}</DetailText>
        <DetailText label={"Export (%)"}>{data_current?.value2}</DetailText>
        <div className="col-span-3">
          <DetailText label={"Description"}>
            {data_current?.description}
          </DetailText>
        </div>
      </div>

      <div className="text-primary text-xs font-bold uppercase pt-4">
        Product Distribution Detail
      </div>

      <div className="flex flex-col gap-y-4">
        <Toolbar items={itemGrantAccess} type="detail" />
        <NxTable
          idTable="current-product-distribution"
          dataSource={dataSource}
          totalData={dataSource?.srcDistDtl?.length}
          current={page}
          tableScrolled={{ y: 400, x: dataSource?.srcDistDtl?.length ? "max-content" : "100%" }}
          onSort={sorter}
          columns={columns(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            onFilter,
          )}
          usePagination={false}
          useInfiniteScroll={true}
        />
      </div>

    </Fragment>
  );
};

export default CurrentProductDistribution;
