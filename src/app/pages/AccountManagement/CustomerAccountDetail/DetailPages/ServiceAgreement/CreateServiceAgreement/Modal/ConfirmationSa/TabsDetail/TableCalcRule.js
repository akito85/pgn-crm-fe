import React, {useState, useEffect, useRef} from 'react'
import { useSelector } from "react-redux";

import TablePagination from '../../../../../../../../../../components/TablePagination'
import DetailText from '../../../../../../../../../../components/DetailText'
import { render } from '@testing-library/react';
import { Tooltip } from 'antd';


const TableCalcRule = ({
  dataTableCalcRule,
  saDetailObj
}) => {
  
  const {
		dataListCalculationType,
	} = useSelector((state) => state.product);

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setTotalElement(dataTableCalcRule?.length)
  }, [])
  

  const getCalculationTypeName = (val) => {
    const CalculationTypeName = dataListCalculationType && dataListCalculationType?.filter((item) => item?.value === val)
    if(CalculationTypeName === undefined){
      return ''
    }
    if(CalculationTypeName.length !== 0){
      return CalculationTypeName[0].label 
    }  
  }
  
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
    let result = [...dataTableCalcRule];
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
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        title: 'NAME',
        dataIndex: 'name',
        sorter: true,
        render: (name)=>{
          return (
            <span>{name !== undefined ? name.label : ""}</span>
          )
        }
      },
      {
        title: 'VALUE',
        dataIndex: 'value',
        sorter: true,
      },
      {
        title: 'UNIT',
        dataIndex: 'unit',
        sorter: true,
        render: (unit)=>{
          return (
            <span>{unit !== undefined ? unit.label : ""}</span>
          )
        }
      },
      {
        title: 'DESCRIPTION',
        dataIndex: 'description',
        sorter: true,
        ellipsis: {
          showTitle:false
        },
        render: (description) => (
          <Tooltip placement="topLeft" title={description}>
            {description}
          </Tooltip>
        ),
      },
    ];
    return result
  }

  return (
    <div>
      <DetailText label="Calculation Type">{getCalculationTypeName(saDetailObj?.calculationType)}</DetailText>
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
  )
}

export default TableCalcRule