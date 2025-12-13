import React, { useEffect, useRef, useState } from "react";
import TableInlineAllocation from "./TableInlineAllocation";
import { columnAllocation } from "./ColumnAllocation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../utils";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../components/TablePagination";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllocationRecomendationList,
} from "../../../../../redux/slices/receipt_collection/receipt";
import {
  showModalError,
} from "../../../../../redux/slices/general_slice";
import { columnRecommendation } from "./ColumnRecomendation";
import { updatePagination } from "../../../../../utils/updatePagination";

const AllocationSection = ({
  dataTable,
  setDataTable = () => { },
  setIsInsert = () => { },
  isInsert,
  amount,
  totalAllocationAmount,
  setTotalAllocationAmount = () => { },
  accountNumberSelected,
  rateAmountValue,
  formValues,
  form,
  currencyId,
}) => {
  console.log("🚀 ~ formValues:", formValues);
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
  const [searchedColumnChoose, setSearchedColumnChoose] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchTextChoose, setSearchTextChoose] = useState("");

  const [openModalAllocation, setOpenModalAllocation] = useState(false);
  const [selectDataTable, setSelectDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("");
  // helper to parse formatted amount
  const parseAmount = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // Remove dots (thousand separators) and replace comma with dot (decimal)
    const normalized = val.toString().replace(/\./g, "").replace(/,/g, ".");
    return parseFloat(normalized);
  };

  const parsedAmount = parseAmount(amount);
  const balance = parsedAmount - totalAllocationAmount;
  // use effec


  useEffect(() => {
    if (data_recomendation_allocation) {
      if (dataTable?.length > 0) {
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
            (item) => !dataTable.some((obj) => obj.key === item.key)
          )
        );
      } else {
        setDataRecomendation(
          data_recomendation_allocation?.map((item) => ({
            ...item,
            key: item?.id,
            billingPeriod: moment(item?.billingPeriod)?.format(
              dateFormatting?.datePeriod
            ),
            createdDate: moment(item.createdDate).format(
              dateFormatting?.dateTime
            ),
          }))
        );
      }
    }
  }, [data_recomendation_allocation, dataTable]);

  // set selected row by balance
  useEffect(() => {
    if (dataRecomendation && dataTable?.length === 0) {
      setSelectedRowKeys(
        dataRecomendation
          ?.filter((item) => item?.allocationAmount !== 0)
          ?.map((item) => item?.key)
      );
    }
  }, [dataRecomendation]);

  // count total amount
  // useEffect(() => {
  //     if (selectDataTable?.length > 0) {
  //         setTotalAllocationAmount(selectDataTable?.reduce((total, row) => total + row.allocationAmount, 0))
  //     }
  // }, [selectDataTable]);

  // update table selected data
  useEffect(() => {
    if (openModalAllocation) {
      setSelectDataTable(
        dataRecomendation?.filter((item) =>
          selectedRowKeys?.includes(item?.key)
        )
      );
    }
  }, [selectedRowKeys, openModalAllocation, dataRecomendation]);

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
          moment(selectedKeys[0])?.format(dateFormatting?.dateTime)
        );
        break;
      case "billingPeriod":
        setTypeColumn("datePeriod");
        setSearchText(
          moment(selectedKeys[0])?.format(dateFormatting?.datePeriod)
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

  // handle search
  const handleSearchModal = (selectedKeys, confirm, dataIndex) => {
    switch (dataIndex) {
      case "billingItemAmount":
      case "allocationAmount":
      case "billingItemBalance":
      case "equivalentAmount":
        setTypeColumn("number");
        setSearchTextChoose(selectedKeys[0]);
        break;
      case "createdDate":
        setTypeColumn("datetime");
        setSearchTextChoose(
          moment(selectedKeys[0])?.format(dateFormatting?.dateTime)
        );
        break;
      case "billingPeriod":
        setTypeColumn("datePeriod");
        setSearchTextChoose(
          moment(selectedKeys[0])?.format(dateFormatting?.datePeriod)
        );
        break;
      default:
        setTypeColumn("string");
        setSearchTextChoose(selectedKeys[0]);
        break;
    }
    confirm();
    setSearchedColumnChoose(selectedKeys[0] ? dataIndex : "");
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

  // filtered column
  const filteredColumns = columnAllocation(
    pageChoose,
    pageSizeChoose,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch
  )?.filter(
    (item) =>
      item?.dataIndex !== "allocationCode" &&
      item?.dataIndex !== "allocationNumber" &&
      item?.dataIndex !== "allocationDate"
  );

  // handle open modal allocation
  const handleOpen = () => { };

  // handle close modal allocation
  const handleCancel = () => {
    if (totalAllocationAmount > parsedAmount) {
      setSelectedRowKeys([]);
      setSelectDataTable([]);
      setTotalAllocationAmount(0);
    }
    setOpenModalAllocation(false);
    setPageChoose(1);
    setPageSizeChoose(10);
    setSearchTextChoose("");
    setSearchedColumnChoose("");
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
  // const updatedSelectedRows = [...selectDataTable, ...newSelectedRows];
  // console.log(updatedSelectedRows, ' update');
  // const uniqueSelectedRows = Array.from(new Set(updatedSelectedRows.map(row => row.key)))
  //     .map(key => updatedSelectedRows.find(row => row.key === key));
  // setSelectDataTable(uniqueSelectedRows);
  // const totalAmount = uniqueSelectedRows.reduce((total, row) => total + row.allocationAmount, 0);
  // setTotalAllocationAmount(totalAmount);
  // setSelectedRowKeys(updatedSelectedRows?.map(item => item?.key));
  // console.log(selectedRowKeys, ' selected');
  // console.log(newSelectedRowKeys, ' new selected');
  // setSelectedRowKeys(prevState => [...prevState, ...newSelectedRowKeys]);
  // setSelectDataTable(dataRecomendation?.filter(item => selectedRowKeys?.includes(item?.key)))
  // };

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

  // handle change choose pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPageChoose(pageSizeChoose !== pageSizeChange ? 1 : pageChange);
    setPageSizeChoose(pageSizeChange);
    // setSelectedRowKeys([]);
    // setSelectDataTable([]);
  };

  // handle save data table
  const handleSaveDataTable = () => {
    if (totalAllocationAmount > parsedAmount) {
    } else {
      // dispatch(setDataAllocation(selectDataTable));
      setDataTable(selectDataTable);
      // handleCancel();
      setOpenModalAllocation(false);
      setPageChoose(1);
      setPageSizeChoose(10);
    }
  };

  const handleOpenModalAllocation = async () => {
    try {
      const { apphierId, receiptCode, refrence, isMisc, ...keys } =
        form?.getFieldsValue();

      const checkValues = Object.values(keys).every((value) => {
        return value !== undefined && value !== null && value !== "";
      });
      // setSelectedRowKeys([]);
      // setSelectDataTable([]);
      console.log(checkValues);
      if (checkValues === false) {
        const errorBody = {
          title: "Failed",
          description: `Please input values!`,
        };
        dispatch(showModalError(errorBody));
      } else if (hasValue(amount) === false || parsedAmount === 0) {
        const errorBody = {
          title: "Failed",
          description: `Please input amount!`,
        };
        dispatch(showModalError(errorBody));
      } else {
        await dispatch(
          getAllocationRecomendationList({
            search: encodeURIComponent(JSON?.stringify(search)),
            pageChoose,
            pageSizeChoose,
            sort: sort,
            accountNumberSelected,
            balance: balance,
            currencyId: formValues?.currency,
            rateAmount: rateAmountValue,
          })
        )?.unwrap();
        setOpenModalAllocation(true);
      }
    } catch (error) {
      setOpenModalAllocation(false);

    }
  };

  // handle sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div className="w-full items-end flex flex-col gap-5">
      <ButtonComponent
        type={"submit"}
        icon={<SVGIcon name="IconButtonCreate" width={24} />}
        onClick={handleOpenModalAllocation}
        disabled={isInsert || rateAmountValue === 0}
      >
        Create
      </ButtonComponent>
      <div className="w-full">
        <TableInlineAllocation
          cols={columnAllocation(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          current={page}
          pageSize={pageSize}
          scrollTable={{ x: 3500, y: 500 }}
          actionFix={true}
          tableData={updatePagination(
            dataTable,
            "data",
            searchedColumn,
            searchText,
            pageChoose,
            pageSizeChoose,
            typeColumn
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
            typeColumn
          )}
          setUpdateSelectDataTable={setSelectDataTable}
          setUpdateSelectRowKeys={setSelectedRowKeys}
          setUpdateTotalAmount={setTotalAllocationAmount}
          rateAmount={rateAmountValue}
          currency={currencyId}
        // onSort={onSort}
        // dispatcher={dispatch}
        />
      </div>
      <div className="w-full flex flex-col">
        {totalAllocationAmount > parsedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
        <span>
          {" "}
          Total Amount :{" "}
          {totalAllocationAmount?.toLocaleString("en-US", {
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
              searchedColumnChoose,
              searchTextChoose,
              handleSearchModal
            )}
            current={pageChoose}
            pageSize={pageSizeChoose}
            dataSource={updatePagination(
              dataRecomendation,
              "data",
              searchedColumnChoose,
              searchTextChoose,
              pageChoose,
              pageSizeChoose,
              typeColumn
            )}
            totalData={updatePagination(
              dataRecomendation,
              "length",
              searchedColumnChoose,
              searchTextChoose,
              pageChoose,
              pageSizeChoose,
              typeColumn
            )}
            tableScrolled={{ x: 3500, y: 500 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            onSizeChanger={handleChange}
          // onSort={onSort}
          />
        </Spin>
        {totalAllocationAmount > parsedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
      </ModalCustom>
    </div>
  );
};

export default AllocationSection;
