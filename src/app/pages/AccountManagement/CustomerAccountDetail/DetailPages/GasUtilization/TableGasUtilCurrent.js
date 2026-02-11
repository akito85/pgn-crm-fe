import React,{ useEffect, useState, useRef, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCurrentGasUtilization } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import DetailText from '../../../../../../components/DetailText'
import NxTable from '../../../../../../components/Nx/NxTable'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'
import { nxGetAccountActions } from '../../../../../../components/Nx/NxGetAccountActions'
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValue } from '../../../../../../utils/getColumnSearchProps'
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import Toolbar from '../../../../../../components/Toolbar'
import NxBaseContainer from '../../../../../../components/Nx/NxBaseContainer'
import NxDetailText from '../../../../../../components/Nx/NxDetailText'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data_current,
    loading,
  } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const itemActions = nxGetAccountActions({
    idAccount,
    handleCreate: () => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_UTILIZATION,
      {
        state: {
          idAccount,
        }
      }
    )
  });
  
  // TODO: sort dan page size belum dipakai
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);

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
      <div className="flex flex-col gap-4">
        <NxBaseContainer border header={"GAS UTILIZATION"}>
          <div className="w-full grid grid-cols-2 gap-4">
            <NxDetailText label={"Effective Date"}>{data_current?.effectiveDate}</NxDetailText>
            <NxDetailText label={"Description"}>{data_current?.description}</NxDetailText>
          </div>
        </NxBaseContainer>
        <NxBaseContainer border header={"GAS UTILIZATION DETAIL LIST"}>
          <div className="flex flex-col gap-y-4">
            <Toolbar items={itemActions} type="detail" />
            <NxTable
              id={"table-gas-util-current"}
              dataSource={data_current?.gasUtilsDtl}
              totalData={data_current?.gasUtilsDtl?.length}
              current={page}
              tableScrolled={{ y: 525, x: data_current?.length ? "max-content" : "100%" }}
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
              usePagination={false}
              useInfiniteScroll={false}
            />
          </div>
        </NxBaseContainer>
      </div>
    </>
  )
}

export default TableGasUtilCurrent