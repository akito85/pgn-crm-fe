import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../components/CardContainer";
import TableRBI from "../../../../../components/TableRBI";
import { getAllCalculationUsagePaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsCalculationUsage } from "./Table/TableCalculationUsage";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { hasValue, renderDateConverter } from "../../../../../utils";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const CalculationUsageSection = ({ ratingCodeId, calculationCode }) => {
  const { data_calculationUsage, loading } = useSelector((state) => state.rating);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_calculationUsage?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [detailCalculationItem, setDetailCalculationItem] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAllCalculationUsagePaginate({
        id: ratingCodeId,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [ratingCodeId, search, page, pageSize, sort, dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDetail = (record) => {
    setDetailCalculationItem(record);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setDetailCalculationItem({});
    setIsOpen(false);
  };

  const baseColumns = useMemo(
    () =>
      columnsCalculationUsage(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleDetail
      ),
    [page, pageSize, searchedColumn, searchText]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">CALCULATION USAGE INFORMATION</p>
          </div>
        }
      >
        <div className="flex flex-row align-middle gap-2 mb-4">
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Calculation Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {calculationCode}
          </p>
          <p className="text-[15px] font-semibold text-text-color-semibold">
            Rating Code:
          </p>
          <p className="text-[15px] font-semibold text-primary">
            {ratingCodeId}
          </p>
        </div>
        <div className="w-full">
          <TableRBI
            dataSource={dataSource}
            columns={processedColumns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_calculationUsage?.page?.totalElements || 0}
            tableScrolled={{ y: 525, x: 8000 }}
            onSort={onSortApi}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading}
          />
        </div>
      </CardContainer>

      <ModalCustom
        header={"Calculation Usage Detail"}
        isOpen={isOpen}
        handleCancel={handleCloseModal}
        type={"detail"}
        width={1000}
        footer={
          <ButtonComponent type={"default"} onClick={handleCloseModal}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"CALCULATION USAGE INFORMATION"} cols={1}>
          <div className="w-full grid grid-cols-4">
            <DetailText label={"Type"}>{detailCalculationItem?.type}</DetailText>
            <DetailText label={"UOM"}>{detailCalculationItem?.uom}</DetailText>
            <DetailText label={"Usage"}>{detailCalculationItem?.usage}</DetailText>
            <DetailText label={"Converted Usage M3"}>
              {detailCalculationItem?.convUsageM3}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-4">
            <DetailText label={"Converted Usage MMBTU"}>
              {detailCalculationItem?.convUsageMmbtu}
            </DetailText>
            <DetailText label={"Discount Usage"}>
              {detailCalculationItem?.discountUsage}
            </DetailText>
            <DetailText label={"Discount Usage M3"}>
              {detailCalculationItem?.discountUsageM3}
            </DetailText>
            <DetailText label={"Discount Usage MMBTU"}>
              {detailCalculationItem?.discountUsageMmbtu}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-4">
            <DetailText label={"Total Usage"}>
              {detailCalculationItem?.totalUsage}
            </DetailText>
            <DetailText label={"Converted Total Usage M3"}>
              {detailCalculationItem?.convTotalUsageM3}
            </DetailText>
            <DetailText label={"Converted Total Usage MMBTU"}>
              {detailCalculationItem?.convTotalUsageMmbtu}
            </DetailText>
            <DetailText label={"Price Code"}>
              {detailCalculationItem?.priceCode}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-4">
            <DetailText label={"Currency"}>
              {detailCalculationItem?.currency}
            </DetailText>
            <DetailText label={"Price"}>{detailCalculationItem?.price}</DetailText>
            <DetailText label={"Amount"}>{detailCalculationItem?.amount}</DetailText>
            <DetailText label={"Amount EQV IDR"}>
              {detailCalculationItem?.amountEqvIdr}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-4">
            <DetailText label={"Amount EQV USD"}>
              {detailCalculationItem?.amountEqvUsd}
            </DetailText>
            <DetailText label={"Discount Amount"}>
              {detailCalculationItem?.discountAmount}
            </DetailText>
            <DetailText label={"Discount Amount EQV IDR"}>
              {detailCalculationItem?.discountAmountEqvIdr}
            </DetailText>
            <DetailText label={"Discount Amount EQV USD"}>
              {detailCalculationItem?.discountAmountEqvUsd}
            </DetailText>
          </div>
          <div className="w-full">
            <DetailText label={"Remark"}>{detailCalculationItem?.remark}</DetailText>
          </div>
        </CardComponent>
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">
            {detailCalculationItem?.idCalcUsage}
          </DetailText>
          <DetailText label="Created Date">
            {hasValue(detailCalculationItem?.createdDate) &&
              renderDateConverter(detailCalculationItem?.createdDate, "datetime")}
          </DetailText>
          <DetailText label="Created By">
            {detailCalculationItem?.createdBy}
          </DetailText>
          <DetailText label="Updated Date">
            {hasValue(detailCalculationItem?.updatedDate) &&
              renderDateConverter(detailCalculationItem?.updatedDate, "datetime")}
          </DetailText>
          <DetailText label="Updated By">
            {detailCalculationItem?.updatedBy}
          </DetailText>
        </CardComponent>
      </ModalCustom>
    </>
  );
};

export default CalculationUsageSection;