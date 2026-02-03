import React,{ useEffect, useState, useRef, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCurrentGasUtilization } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import DetailText from '../../../../../../components/DetailText'
import NxTable from '../../../../../../components/Nx/NxTable'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'
import { nxGetAccountActions } from '../../../../../../components/Nx/NxGetAccountActions'
import { getColumnSearchPropsUseFilteredValue } from '../../../../../../utils/getColumnSearchProps'
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import Toolbar from '../../../../../../components/Toolbar'

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  return [
    {
      key: "no",
      title: "NO",
      align: "center",  
      dataIndex: "no",
      width: 20,
      render: (_, __, index) => index + 1,
    },
    {
      key: "utilizationName",
      title: "UTLIZATION NAME",
      dataIndex: "name",
      width: 150,
      sorter: true,
      filteredValue: [search?.name] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "percentage",
      title: "PERCENTAGE",
      dataIndex: "percentage",
      width: 150,
      sorter: true,
      filteredValue: [search?.percentage] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    }
  ]
}

const TableGasUtilCurrent = ({idAccount}) => {
  const dispatch = useDispatch();
  const {
    data_current,
    loading,
  } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const itemActions = nxGetAccountActions({
    idAccount,
    createRoute: ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_UTILIZATION,
  });
  
  // TODO: sort dan page size belum dipakai
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getCurrentGasUtilization({id: idAccount}))
  }, [dispatch, idAccount])
  
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field},${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  }

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
    columns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ), [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);
 
  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns);
  }, [allColumns]);

  return (
    <>
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION</div>
      <div className="grid grid-cols-4 w-full">
        {/* TODO: update detail text dengan format baru */}
        <DetailText label={"Effective Date"}>{data_current?.effectiveDate}</DetailText>
        <DetailText label={"Description"}>{data_current?.description}</DetailText>
      </div>
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION DETAIL LIST</div>
      <div className="flex flex-col gap-y-4">
        <Toolbar items={itemActions} type="detail" />
        <NxTable
          idTable="gas-util-current-table"
          dataSource={data_current?.gasUtilsDtl}
          totalData={data_current?.gasUtilsDtl?.length}
          current={page}
          tableScrolled={{ y: 525, x: 800 }}
          onSort={onSort}
          columns={processedColumns}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={false}
        />
      </div>
    </>
  )
}

export default TableGasUtilCurrent