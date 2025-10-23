import React,{ useEffect, useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TablePaginationNew from '../../../../../../components/TablePaginationNew'
import { getColumnSearchPropsPaging } from '../../../../../../utils/getColumnSearchProps'
import { getCurrentGasUtilization } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import DetailText from '../../../../../../components/DetailText'

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
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "UTILIZATION NAME",
      dataIndex: "name",
      width: 150,
      onFilter: (value, record) => onFilter("name", value, record),
      sorter: (a, b) => sorter("name", a, b),
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage",
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
    }
  ]
}

const TableGasUtilCurrent = ({idAccount}) => {
  const dispatch = useDispatch();
  const { data_current } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getCurrentGasUtilization({id: idAccount}))
  }, [dispatch, idAccount])
  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

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
    <>
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION</div>
      <div className="grid grid-cols-4 w-full">
        <DetailText label={"Effective Date"}>{data_current?.effectiveDate}</DetailText>
        <DetailText label={"Description"}>{data_current?.description}</DetailText>
      </div>
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION DETAIL LIST</div>
      <TablePaginationNew
        dataSource={data_current?.gasUtilsDtl}
        totalData={data_current?.gasUtilsDtl?.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 800 }}
        onChange={handleChange}
        // onSort={onSort}
        columns={columns(
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
    </>
  )
}

export default TableGasUtilCurrent