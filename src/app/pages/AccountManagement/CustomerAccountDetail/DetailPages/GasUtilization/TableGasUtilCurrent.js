import React,{ useEffect, useState, useRef, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getCurrentGasUtilization } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import NxTable from '../../../../../../components/Nx/NxTable'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'
import { nxGetAccountActions } from '../../../../../../components/Nx/NxGetAccountActions'
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../utils/getColumnSearchProps'
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import Toolbar from '../../../../../../components/Toolbar'
import NxBaseContainer from '../../../../../../components/Nx/NxBaseContainer'
import NxDetailText from '../../../../../../components/Nx/NxDetailText'
import { useNavigate } from 'react-router-dom'
import { sorterFunction } from '../../../../../../utils/sorterFunction'
import { renderColumn } from '../../../../../../utils'

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
      width: 20,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "name",
      title: "UTILIZATION NAME",
      dataIndex: "name",
      width: 150,
      sorter: (a, b) => sorterFunction("name", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn("name", searchedColumn, searchText, text, false, "input", search)
      }
    },
    {
      key: "percentage",
      title: "PERCENTAGE",
      dataIndex: "percentage",
      width: 150,
      sorter: (a, b) => sorterFunction("percentage", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn("percentage", searchedColumn, searchText, text, false, "input", search)
      }
    }
  ]
}

const TableGasUtilCurrent = ({idAccount}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data_current,
  } = useSelector(
    (state) =>  state.accountGasUtilization
  );

  const listData = data_current?.gasUtilsDtl || [];

  const itemActions = nxGetAccountActions({
    handleCreate: () => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_UTILIZATION,
      {
        state: {
          idAccount,
        }
      }
    )
  });
  
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const dataSourceWithKeys = useMemo(() => {
    if (!listData?.length) return [];

    return listData.map((item, index) => ({
      ...item,
      key: `gas-util-current-${item.id || index}`,
    }));
  }, [listData])

  useEffect(() => {
    dispatch(getCurrentGasUtilization({id: idAccount}))
  }, [dispatch, idAccount])
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

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
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns, fixedColumns]);

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
              dataSource={dataSourceWithKeys}
              tableScrolled={{ y: 525, x: dataSourceWithKeys?.length ? "max-content" : "100%" }}
              columns={processedColumns}
              usePagination={false}
              useInfiniteScroll={false}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              columnDefinitions={columnDefinitions}
              showAdvanceSearch={false}
            />
          </div>
        </NxBaseContainer>
      </div>
    </>
  )
}

export default TableGasUtilCurrent