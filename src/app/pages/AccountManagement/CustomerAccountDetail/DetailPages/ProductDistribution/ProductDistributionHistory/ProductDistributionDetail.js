import React, { useMemo, useRef, useState } from "react";
import moment from "moment";
import { dateFormatting, renderColumn } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../../components/Nx/NxModal";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import { sorterFunction } from "../../../../../../../utils/sorterFunction";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";

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
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "country",
      title: "COUNTRY",
      dataIndex: "country",
      width: 150,
      sorter: (a, b) => sorterFunction("country", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "country",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        return renderColumn("country", searchedColumn, searchText, text, false, "input", search)
      }
    },
    {
      key: "percentage",
      title: "PERCENTAGE (%)",
      dataIndex: "percentage",
      align: "right",
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
    },
  ];
};

const ProductDistributionDetail = ({data_detail, openModal, closeModal}) => {
  const listDataDetail = data_detail?.srcDistDtl || [];

  const dataSoueceWithKeys =  useMemo(() => {
    if (!listDataDetail?.length) return [];

    return listDataDetail.map((item, index) => ({
      ...item,
      key: `product-distribution-detail-${item.id || index}`,
    }));
  }, [listDataDetail])
  
  // Declaration
  const searchInput = useRef(null);

  // State
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    searchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      }
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
    <NxModal
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      title="DETAIL PRODUCT DISTRIBUTION SOURCE"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <div className="flex flex-col p-4 gap-4">

        <NxBaseContainer border header={"PRODUCT DISTRIBUTION INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Effective Date"}>
              {data_detail?.effectiveDate
                ? moment(data_detail.effectiveDate).format(dateFormatting.date)
                : ""}
            </NxDetailText>
            <NxDetailText label={"Local (%)"}>{data_detail?.value1}</NxDetailText>
            <NxDetailText label={"Export (%)"}>{data_detail?.value2}</NxDetailText>
            <NxDetailText label={"Description"}>
              {data_detail?.description}
            </NxDetailText>
          </div>
        </NxBaseContainer>

        <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-4">
            <NxDetailText label="Record ID">{data_detail?.id}</NxDetailText>
            <NxDetailText label="Created Date">
              {data_detail?.createdDate
                ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
                : ""}
            </NxDetailText>
            <NxDetailText label="Created By">{data_detail?.createdBy}</NxDetailText>
            <NxDetailText label="Updated Date">
              {data_detail?.updatedDate
                ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
                : ""}
            </NxDetailText>
            <NxDetailText label="Updated By">{data_detail?.updatedBy}</NxDetailText>
          </div>
        </NxBaseContainer>

        <NxBaseContainer border header={"PRODUCT DISTRIBUTION DETAIL"}>
          <NxTable
            idTable="detail-product-distribution"
            dataSource={dataSoueceWithKeys}
            tableScrolled={{ y: 525, x: dataSoueceWithKeys?.length ? "max-content" : "100%" }}
            columns={processedColumns}
            usePagination={false}
            useInfiniteScroll={false}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            columnDefinitions={columnDefinitions}
            showAdvanceSearch={false}
          />
        </NxBaseContainer>
      </div>
    </NxModal>
  )
}

export default ProductDistributionDetail