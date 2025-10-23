import React, { Fragment, useEffect, useRef, useState } from "react";
import DetailText from "../../../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import { getCurrentRaw } from "../../../../../../../redux/slices/account_management/detailAccount/RawMaterialDistributionSlice";
import { dateFormatting, hasValue, renderColumn } from "../../../../../../../utils";
import moment from "moment";

const columns = (
  search,
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
      render: (text) => renderColumn('country', hasValue(search['country']), searchText, text, false, 'input', search)
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
      render: (text) => renderColumn('percentage', hasValue(search['percentage']), searchText, text, false, 'input', search)
    },
  ];
};

const CurrentRawMaterialSource = ({ id, idCustomer }) => {
  // Selector
  const { data_current } = useSelector((state) => state.rawMaterialSource);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_current?.srcDistDtl;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getCurrentRaw(id));
  }, [dispatch]);

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
        Raw Material Source Information
      </div>

      <div className="w-full grid grid-cols-3 gap-4 pt-4">
        <DetailText label={"Effective Date"}>
          {data_current?.effectiveDate
            ? moment(data_current.effectiveDate).format(dateFormatting.date)
            : ""}
        </DetailText>
        <DetailText label={"Local (%)"}>{data_current?.value1}</DetailText>
        <DetailText label={"Import (%)"}>{data_current?.value2}</DetailText>
        <div className="col-span-3">
          <DetailText label={"Description"}>
            {data_current?.description}
          </DetailText>
        </div>
      </div>

      <div className="text-primary text-xs font-bold uppercase pt-4">
        Raw Material Source Detail
      </div>

      <TablePaginationNew
        type="FE"
        dataSource={dataSource}
        totalData={dataSource?.srcDistDtl?.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: "auto" }}
        onChange={handleChange}
        columns={columns(
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          onFilter,
          sorter
        )}
      />
    </Fragment>
  );
};

export default CurrentRawMaterialSource;
