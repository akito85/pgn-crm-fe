import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import TableInlineAllocation from "./TableInlineAllocation";
import { updatePagination } from "../../../../../utils/updatePagination";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { Spin } from "antd";
import TablePagination from "../../../../../components/TablePagination";
import { columnRecommendation } from "./ColumnRecomendation";
import { columnsAllocation } from "../DetailReceipt";
import { getRecommendationDetailAllocation } from "../../../../../redux/slices/receipt_collection/receipt";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../utils";

const CreateAllocation = ({
  unApliedAmount = 0,
  isInsert = false,
  setIsInsert = () => {},
  dataTable,
  setDataTable = () => {},
  totalUnapliedAmount,
  setTotalUnapliedAmount = () => {},
  dataDetail,
}) => {
  const {
    loading,
    data_table_allocation,
    data_selected_allocation,
    data_recomendation_allocation,
  } = useSelector((state) => state?.receipt);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // state
  const [page, setPage] = useState(1);
  const [pageChoose, setPageChoose] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeChoose, setPageSizeChoose] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalAllocation, setOpenModalAllocation] = useState(false);
  const [selectDataTable, setSelectDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("");
  const balance = unApliedAmount - totalUnapliedAmount;

  // use effect
  useEffect(() => {
    if (data_recomendation_allocation?.length > 0) {
      if (
        dataTable?.filter((item) => hasValue(item?.allocationNumber) === false)
          ?.length > 0
      ) {
        // const updatedDataRecomendation = dataRecomendation.map(recommendation => {
        //     const matchingDataRow = dataTable.find(dataRow => dataRow.key === recommendation.key);
        //     if (matchingDataRow) {
        //         return {
        //             ...recommendation,
        //             allocationAmount: matchingDataRow.allocationAmount,
        //             allocationStatus: matchingDataRow?.allocationStatus
        //         };
        //     }
        //     return recommendation;
        // });
        // setDataRecomendation(updatedDataRecomendation);
        setDataRecomendation(
          dataRecomendation.filter(
            (item) => !dataTable.some((obj) => obj.key === item.key),
          ),
        );
      } else {
        setDataRecomendation(
          data_recomendation_allocation?.map((item) => ({
            ...item,
            key: item?.id,
            billingPeriod: moment(item?.billingPeriod)?.format(
              dateFormatting?.datePeriod,
            ),
            createdDate: moment(item.createdDate).format(
              dateFormatting?.dateTime,
            ),
          })),
        );
      }
    }
  }, [data_recomendation_allocation, dataTable]);

  useEffect(() => {
    if (openModalAllocation) {
      setSelectDataTable(
        dataRecomendation?.filter((item) =>
          selectedRowKeys?.includes(item?.key),
        ),
      );
    }
  }, [selectedRowKeys, openModalAllocation, dataRecomendation]);

  // selected row keys
  useEffect(() => {
    if (dataRecomendation) {
      setSelectedRowKeys(
        dataRecomendation
          ?.filter((item) => item?.allocationAmount !== 0)
          ?.map((item) => item?.key),
      );
    }
  }, [dataRecomendation]);

  // handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    switch (dataIndex) {
      case "billingItemAmount":
      case "allocationAmount":
      case "billingItemBalance":
      case "equivalentAmount":
        setTypeColumn("number");
        setSearchText(selectedKeys[0]);
        break;
      case "createdDate":
        setTypeColumn("datetime");
        setSearchText(
          moment(selectedKeys[0])?.format(dateFormatting?.dateTime),
        );
        break;
      case "billingPeriod":
        setTypeColumn("datePeriod");
        setSearchText(
          moment(selectedKeys[0])?.format(dateFormatting?.datePeriod),
        );
        break;
      default:
        setTypeColumn("string");
        setSearchText(selectedKeys[0]);
        break;
    }
    confirm();
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

  // handle modal open allocation
  const handleOpenModalAllocation = () => {
    setOpenModalAllocation(true);
    dispatch(getRecommendationDetailAllocation(dataDetail?.id));
  };

  // handle cancel modal allocation
  const handleCancel = () => {
    setOpenModalAllocation(false);
  };

  // handle save select data
  const handleSaveDataTable = () => {
    setDataTable((prev) => [...prev, ...selectDataTable]);
    // handleCancel();
    setOpenModalAllocation(false);
    setPageChoose(1);
    setPageSizeChoose(10);
  };

  // on change select
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // row selections
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [
    //     Table.SELECTION_ALL,
    //     Table.SELECTION_INVERT,
    //     Table.SELECTION_NONE
    // ]
  };

  // handle change pagination recommendation
  const handleChange = (pageChange, pageSizeChange) => {
    setPageChoose(pageSizeChoose !== pageSizeChange ? 1 : pageChange);
    setPageSizeChoose(pageSizeChange);
    // setSelectedRowKeys([]);
    // setSelectDataTable([]);
  };
  return (
    <div className="w-full items-end flex flex-col gap-5">
      {dataDetail?.approvalDto?.isApprover === false && (
        <ButtonComponent
          type={"submit"}
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          onClick={handleOpenModalAllocation}
          disabled={
            isInsert ||
            unApliedAmount === 0 ||
            dataDetail?.statusApproval !== "Approved"
          }
        >
          Create
        </ButtonComponent>
      )}
      <div className="w-full">
        <TableInlineAllocation
          cols={columnsAllocation(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          )}
          current={page}
          pageSize={pageSize}
          scrollTable={{
            x: 4400,
            y: 300,
          }}
          actionFix={true}
          tableData={updatePagination(
            dataTable,
            "data",
            searchedColumn,
            searchText,
            pageChoose,
            pageSizeChoose,
            typeColumn,
          )}
          setInserted={setIsInsert}
          onDataChange={setDataTable}
          totalData={updatePagination(
            dataTable,
            "length",
            searchedColumn,
            searchText,
            pageChoose,
            pageSizeChoose,
            typeColumn,
          )}
          setUpdateSelectDataTable={setSelectDataTable}
          setUpdateSelectRowKeys={setSelectedRowKeys}
          setUpdateTotalAmount={setTotalUnapliedAmount}
          rateAmount={unApliedAmount}
          type="detail"
          // onSort={onSort}
          // dispatcher={dispatch}
        />
        <div className="w-full flex flex-col">
          {totalUnapliedAmount > unApliedAmount && (
            <span className="text-red-800">
              Total amount of selected item has been exceeded Total available
              amount. Please select other item.
            </span>
          )}
          <span>
            {" "}
            Total Amount :{" "}
            {totalUnapliedAmount?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span>
            {" "}
            Balance :{" "}
            {balance === 0
              ? 0
              : balance?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
          </span>
        </div>
      </div>
      <ModalCustom
        isOpen={openModalAllocation}
        handleCancel={handleCancel}
        type={"confirmation"}
        header={"Choose Allocation"}
        width={1200}
        footer={[
          <div className="flex gap-5 justify-end w-full">
            <ButtonComponent
              // type={"reject"}
              htmlType={"submit"}
              // form={"formApprove"}
              onClick={handleCancel}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              htmlType={"submit"}
              // form={"formApprove"}
              onClick={handleSaveDataTable}
            >
              Confirm
            </ButtonComponent>
          </div>,
        ]}
      >
        <Spin spinning={loading}>
          <TablePagination
            columns={columnRecommendation(
              pageChoose,
              pageSizeChoose,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
            current={pageChoose}
            pageSize={pageSizeChoose}
            dataSource={updatePagination(
              dataRecomendation,
              "data",
              searchedColumn,
              searchText,
              pageChoose,
              pageSizeChoose,
              typeColumn,
            )}
            totalData={updatePagination(
              dataRecomendation,
              "length",
              searchedColumn,
              searchText,
              pageChoose,
              pageSizeChoose,
              typeColumn,
            )}
            tableScrolled={{ x: 3500, y: 500 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            onSizeChanger={handleChange}
            // onSort={onSort}
          />
        </Spin>
        {totalUnapliedAmount > unApliedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
      </ModalCustom>
    </div>
  );
};

export default CreateAllocation;
