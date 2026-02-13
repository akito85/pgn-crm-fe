import React,{useRef, useState, useCallback, useMemo} from 'react'
import ButtonComponent from '../../../../../../components/ButtonComponent'
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../../utils/getColumnSearchProps'
import { sorterFunction } from '../../../../../../utils/sorterFunction'
import moment from 'moment'
import { dateFormatting, renderColumn } from '../../../../../../utils'
import NxTable from '../../../../../../components/Nx/NxTable'
import NxBaseContainer from '../../../../../../components/Nx/NxBaseContainer'
import NxModal from '../../../../../../components/Nx/NxModal'
import NxDetailText from '../../../../../../components/Nx/NxDetailText'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
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
      title: "UTIIZATION NAME",
      dataIndex: "name",
      width: 150,
      sorter: (a, b) => sorterFunction('name', a, b),
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
      align: 'right',
      sorter: (a, b) => sorterFunction('percentage', a, b),
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
    },
  ];
}

const DetailGasUtilHistory = ({isOpen, setIsOpen, dataDetail}) => {
  
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const listData = dataDetail?.gasUtilsDtl || [];

  const dataSourceWithKeys = useMemo(() => {
    if (!listData?.length) return [];

    return listData.map((item, index) => ({
      ...item,
      key: `gas-util-detail-${item.id || index}`,
    }));
  }, [listData]);

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
      <NxModal
        header={"DETAIL GAS UTILIZATION HISTORY"}
        isOpen={isOpen}
        handleCancel={() => {
          setIsOpen(false)
        }}
        type={"detail"}
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <div className="flex flex-col p-4 gap-y-4">

          {/* GAS UTILIZATION INFORMATION */}
          <NxBaseContainer border header={"GAS UTILIZATION INFORMATION"}>
            <div className="w-full grid grid-cols-2 gap-4">
              <NxDetailText label="Effective Date">{dataDetail?.effectiveDate}</NxDetailText>
              <NxDetailText label="Description">{dataDetail?.description}</NxDetailText>
            </div>
          </NxBaseContainer>

          {/* HISTORY LOG INFORMATION */}
          <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5 gap-4">
              <NxDetailText label="Record ID">{dataDetail?.id}</NxDetailText>
              <NxDetailText label="Created Date">{dataDetail?.createdDate ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime) : ''}</NxDetailText>
              <NxDetailText label="Created By">{dataDetail?.createdBy}</NxDetailText>
              <NxDetailText label="Updated Date">{dataDetail?.updatedDate ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime) : ''}</NxDetailText>
              <NxDetailText label="Updated By">{dataDetail?.updatedBy}</NxDetailText>
            </div>
          </NxBaseContainer>

          {/* Table */}
          <NxBaseContainer border header={"GAS UTILIZATION DETAIL LIST"}>
            <NxTable
              idTable="table-detail-gas-util-history"
              dataSource={dataSourceWithKeys}
              tableScrolled={{ y: 400, x: dataSourceWithKeys.length ? "max-content" : "100%" }}
              usePagination={false}
              useInfiniteScroll={false}
              showAdvanceSearch={false}
              columns={processedColumns}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              columnDefinitions={columnDefinitions}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  )
}

export default DetailGasUtilHistory