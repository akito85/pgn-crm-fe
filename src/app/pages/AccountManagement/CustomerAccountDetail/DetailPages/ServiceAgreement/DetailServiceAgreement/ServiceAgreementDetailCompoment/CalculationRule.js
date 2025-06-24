import React, {useState, useEffect, useRef} from 'react'
import TablePagination from '../../../../../../../../components/TablePagination'
import { getColumnSearchProps } from "../../../../../../../../utils/getColumnSearchProps";
import DetailText from '../../../../../../../../components/DetailText';
import GridLayout from '../../../../../../../../components/GridLayout';

const CalculationRule = ({data}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    if(data?.saCalcRule){
      setTotalElement(data?.saCalcRule?.length)
      let modifyData = data?.saCalcRule.map(item=> {
        return {
          ...item,
          value: item.value !== null ? item.value.toString() : ''
        }
      })
      setDataTable(modifyData)
    }
  }, [data?.saCalcRule])
  
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const filterDataByPage = () => {
  const tempCalcRuleWithoutCalcType = dataTable.filter(item => ![687].includes(item.nameId))
    let result = [...tempCalcRuleWithoutCalcType];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const columns = ({
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NAME",
        dataIndex: "name",
        width: 150,
        sorter: true,
        ...getColumnSearchProps(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "VALUE",
        dataIndex: "value",
        width: 150,
        sorter: true,
        align: 'right',
        // render: (value) => (
        //   // <span>{value.toString()}</span>
        // ),
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "UNIT",
        dataIndex: "unit",
        width: 150,
        sorter: true,
        ...getColumnSearchProps(
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 150,
        sorter: true,
        ...getColumnSearchProps(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
    ];
    return result
  }

  // Start Ddl Calc Rule - Calc Type
  const calculationTypeId = 687;
  const hasIdCalcTypeId = dataTable?.filter(item => item?.nameId === calculationTypeId);
  // End Ddl Calc Rule - Calc Type

  return (
    <div>
      <div className={"w-full py-6"}>
        <GridLayout cols={2}>
          <div>
            <div className='text-primary text-xs font-bold uppercase pb-6'>
              Calculation Type
            </div>
            <DetailText label={"Calculation Type"}>{hasIdCalcTypeId[0]?.unit}</DetailText>
          </div>
        </GridLayout>
        <TablePagination
          pageSize={pageSize}
          current={page}
          dataSource={filterDataByPage()}
          tableScrolled={{y: 525, x: 1500 }}
          totalData={totalElement}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={columns({
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          })}
        />
      </div>
    </div>
  )
}

export default CalculationRule