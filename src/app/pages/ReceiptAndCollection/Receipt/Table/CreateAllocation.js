import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";
import { updatePagination } from "../../../../../utils/updatePagination";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { Spin } from "antd";
import TablePagination from "../../../../../components/TablePagination";
import { columnRecommendation } from "./ColumnRecomendation";
import { columnsAllocation } from "./ColumnAllocation";
import { getRecommendationDetailAllocation, getAllocation } from "../../../../../redux/slices/receipt_collection/receipt";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../utils";
import ModalReverseAllocation from "./ModalReverseAllocation";

const CreateAllocation = ({
  unApliedAmount = 0,
  isInsert = false,
  setIsInsert = () => { },
  dataTable,
  setDataTable = () => { },
  totalUnapliedAmount,
  setTotalUnapliedAmount = () => { },
  dataDetail,
}) => {
  const {
    loading,
    data_recomendation_allocation,
  } = useSelector((state) => state?.receipt);
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // state
  const [page, setPage] = useState(1);
  const [pageChoose, setPageChoose] = useState(1);
  const [pageSize] = useState(10);
  const [pageSizeChoose, setPageSizeChoose] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openModalAllocation, setOpenModalAllocation] = useState(false);
  const [selectDataTable, setSelectDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataRecomendation, setDataRecomendation] = useState([]);
  const [sort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("");
  const [openModalReverse, setOpenModalReverse] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
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
            (item) => !dataTable.some((obj) => obj.key === item.key)
          )
        );
      } else {
        setDataRecomendation(
          data_recomendation_allocation
            ?.filter(
              (item) =>
                item?.billingItemAmount !== 0 &&
                (item?.allocationStatus === "Unpaid" ||
                  item?.allocationStatus === "Partially Paid")
            )
            ?.map((item) => ({
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

  useEffect(() => {
    if (openModalAllocation) {
      setSelectDataTable(
        dataRecomendation?.filter((item) =>
          selectedRowKeys?.includes(item?.key)
        )
      );
    }
  }, [selectedRowKeys, openModalAllocation, dataRecomendation]);

  // selected row keys
  useEffect(() => {
    if (dataRecomendation) {
      setSelectedRowKeys(
        dataRecomendation
          ?.map((item) => item?.key)
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
  const onSelectChange = (newSelectedRowKeys, _newSelectedRows) => {
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
  // handle reverse allocation
  const handleOpenModalReverse = (record) => {
    setSelectedRecord(record);
    setOpenModalReverse(true);
  };

  const handleSuccessReverse = () => {
    dispatch(
      getAllocation({
        id: dataDetail?.id,
        page: page,
        pageSize: pageSize,
        sort: sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  };

  const [editingKey, setEditingKey] = useState("");
  const [tempRow, setTempRow] = useState({});

  useEffect(() => {
    // Calculate total amount whenever dataTable changes
    const total = dataTable.reduce((acc, curr) => acc + (Number(curr.allocationAmount) || 0), 0);
    setTotalUnapliedAmount(total);
  }, [dataTable, setTotalUnapliedAmount]);

  const handleEdit = (record) => {
    setEditingKey(record.key);
    setTempRow({ ...record });
    setIsInsert(true); // Disable create/submit while editing
  };

  const handleCancelEdit = () => {
    setEditingKey("");
    setTempRow({});
    setIsInsert(false);
  };

  const handleInputChange = (key, field, value) => {
    setTempRow((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleSave = (key) => {
    const newData = [...dataTable];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      const updatedRow = {
        ...item,
        ...tempRow,
        billingItemBalance: item.billingItemAmount - tempRow.allocationAmount,
        allocationStatus:
          item.billingItemAmount - tempRow.allocationAmount === 0
            ? "Paid"
            : "Partially Paid",
        equivalentAmount:
          item.convertedCurrency === "USD"
            ? tempRow.allocationAmount / (dataDetail?.rateAmount || 1)
            : tempRow.allocationAmount * (dataDetail?.rateAmount || 1),
      };

      if (updatedRow.billingItemBalance < 0) {
        // Show error? For now just clamp or let user see balance < 0
      }

      newData.splice(index, 1, updatedRow);
      setDataTable(newData);
      setEditingKey("");
      setTempRow({});
      setIsInsert(false);
    }
  };

  const handleDelete = (key) => {
    const newData = dataTable.filter((item) => item.key !== key);
    setDataTable(newData);
    // Also update selection if needed
    setSelectedRowKeys(newData.map(item => item.key));
  };

  return (
    <div className="w-full items-end flex flex-col gap-5">
      {dataDetail?.approvalDto?.isApprover !== true && (
        <>
          <ButtonComponent
            type={"submit"}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            onClick={handleOpenModalAllocation}
            disabled={
              isInsert ||
              unApliedAmount === 0 ||
              dataDetail?.statusApproval !== "Approved" ||
              !dataRecomendation ||
              dataRecomendation?.length === 0
            }
          >
            Create
          </ButtonComponent>
          {dataDetail?.statusApproval === "Approved" &&
            unApliedAmount > 0 &&
            (!dataRecomendation || dataRecomendation?.length === 0) && (
              <div className="text-sm text-gray-500 italic">
                No outstanding invoices available for allocation
              </div>
            )}
        </>
      )}
      <div className="w-full">
        <TableRBI
          idTable="table-allocation-detail"
          columns={columnsAllocation(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            null,
            handleEdit,
            handleDelete,
            null,
            editingKey,
            handleSave,
            handleCancelEdit,
            handleOpenModalReverse,
            handleInputChange
          )}
          dataSource={updatePagination(
            dataTable,
            "data",
            searchedColumn,
            searchText,
            page,
            pageSize,
            typeColumn
          )}
          current={page}
          pageSize={pageSize}
          totalData={updatePagination(
            dataTable,
            "length",
            searchedColumn,
            searchText,
            page,
            pageSize,
            typeColumn
          )}
          onChange={(p, ps) => {
            setPage(p);
          }}
          onSizeChanger={(p, ps) => {
             setPage(1);
          }}
          loading={loading}
          tableScrolled={{
            x: 3000,
            y: 300,
          }}
          useSelect={false}
          showSearchBar={false}
          showAdvanceSearch={false}
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
          {/* Empty state message */}
          {(!dataRecomendation || dataRecomendation?.length === 0) && !loading && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <SVGIcon name="IconEmpty" width={80} />
              <p className="text-lg font-semibold text-gray-700 mt-4">No Outstanding Invoices</p>
              <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
                This account number does not have any unpaid or partially paid invoices available for allocation.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Allocation can only be created for invoices with status "Unpaid" or "Partially Paid"
              </p>
            </div>
          )}

          {/* Table - only show if there's data */}
          {dataRecomendation && dataRecomendation?.length > 0 && (
            <TablePagination
              columns={columnRecommendation(
                pageChoose,
                pageSizeChoose,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
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
                typeColumn
              )}
              totalData={updatePagination(
                dataRecomendation,
                "length",
                searchedColumn,
                searchText,
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
          )}
        </Spin>
        {totalUnapliedAmount > unApliedAmount && (
          <span className="text-red-800">
            Total amount of selected item has been exceeded Total available
            amount. Please select other item.
          </span>
        )}
      </ModalCustom>
      <ModalReverseAllocation
        isOpen={openModalReverse}
        handleCancel={() => setOpenModalReverse(false)}
        record={selectedRecord}
        receiptId={dataDetail?.id}
        onSuccess={handleSuccessReverse}
      />
    </div>
  );
};

export default CreateAllocation;
