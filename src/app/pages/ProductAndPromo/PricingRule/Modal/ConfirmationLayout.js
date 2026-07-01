import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import moment from "moment";
import TablePagination from "../../../../../components/TablePagination";
import { columnsApproval, columnsExpandApproval } from "../Table/TableApproval";
import { columnAttachmentData } from "../Table/TableAttachment";
import { columnsDetail } from "../Table/TableDetail";
import { columnsTableCriteriaAll } from "../../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from "../../UtilsProduct/FunctionalCriteriaProduct";

// Column Approval Expand
const expandedRowRender = (record) => {
  const columns = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => {
    return [
      ...columnsExpandApproval(
        {},
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    ];
  };
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">
        EMPLOYEE INFORMATION
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        className="table-expand-custom"
        dataSource={record?.employeeDetail}
        columns={columns()}
      />
    </div>
  );
};

const ConfirmationLayout = ({
  data,
  openModal,
  closeModal = () => {},
  handleConfirm = () => {},
  tabsPricingRule,
  listDataCriteria = [],
  criteriaValues = [],
  dataAttachment,
  apiCriteria,
  apiApproval,
  apiApprovalList,
  loading = false,
}) => {
  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const tabsPricingDetail = [{ value: "Detail" }, { value: "Criteria" }];
  const minimums = new Set();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [valuePage, setValuePage] = useState("Pricing Rule");
  const [valuePageDetail, setValuePageDetail] = useState("Detail");
  const [dataTable, setDataTable] = useState([]);
  const [currentAttachment, setCurrentAttachment] = useState(1);
  const [sizeAttachment, setSizeAttachment] = useState(10);

  // Use Effect
  useEffect(() => {
    if (apiApprovalList && apiApprovalList.length > 0) {
      const data = apiApprovalList?.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [apiApprovalList]);

  // find data criteria
  const matchedObjects = apiCriteria?.filter((obj) =>
    data?.rPricingRuleCriterias?.map((a) => a.criteria)?.includes(obj.id)
  );
  const matchedNames = matchedObjects
    ?.map((obj) => obj.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  // find data approval hierarchy
  const approvalDetail =
    apiApproval?.filter(
      (a) => a.appHierId === data?.apphierId || a.appHierId === data?.appHierId
    )?.[0]?.approvalName || "";

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Pagination
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleChangeAttachment = (currentAttachment, sizeAttachment) => {
    setCurrentAttachment(currentAttachment);
    setSizeAttachment(sizeAttachment);
  };

  const updatePaginationAttachment = (page, pageSize) => {
    return dataAttachment?.slice((page - 1) * pageSize, page * pageSize);
  };

  // Function merge table
  const mergedTable = (rowsData = []) => {
    const uniquePriceCode = new Set();
    let pageNo = 0;
    let pageNumber = 0;
    const mergedData = rowsData.map((rowData, index) => {
      const updatedRowsData = { ...rowData };
      if (index !== 0 && index % pageSize === 0) {
        uniquePriceCode.clear();
        pageNo += 1;
      }
      if (uniquePriceCode.has(`${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`)) {
        updatedRowsData.rowSpan = 0;
      } else {
        // const occurCount = rowsData
        //   .slice(pageNo * pageSize, (pageNo + 1) * pageSize)
        //   .filter((data) => data.priceCode === rowData.priceCode).length;
        const occurCount = rowsData.filter(
          (data) =>
            data.priceCode === rowData.priceCode &&
            data.min === rowData.min &&
            data.maximumName === rowData.maximumName
        ).length;
        updatedRowsData.rowSpan = Math.min(pageSize, occurCount);
        updatedRowsData.number = pageNumber;
        uniquePriceCode.add(`${rowData.priceCode}~${rowData.min}~${rowData.maximumName}`);
        pageNumber++;
      }
      return updatedRowsData;
    });
    return mergedData;
  };

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="confirmation"
      header="CONFIRMATION"
      width={1000}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} disabled={loading} onClick={closeModal}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            loading={loading}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <RadioTabs
        data={tabsPricingRule}
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />

      <div className={`${valuePage !== "Pricing Rule" ? "hidden" : ""}`}>
        <div className="w-full p-5">
          <div>
            <span className="text-primary uppercase font-bold">
              pricing rule information
            </span>
          </div>

          <div className="grid grid-cols-3 gap-5 pt-[30px]">
            <DetailText label="Name">{data?.name}</DetailText>
            <DetailText label="Start Date">
              {data?.startDate
                ? moment(data.startDate).format("DD MMM YYYY")
                : ""}
            </DetailText>
            <DetailText label="End Date">
              {data?.endDate ? moment(data.endDate).format("DD MMM YYYY") : ""}
            </DetailText>

            <div className="w-full col-span-3">
              <DetailText label="Criteria">{matchedNames?.slice(2)}</DetailText>
            </div>

            <div className="w-full col-span-3">
              <DetailText label="Description">{data?.description}</DetailText>
            </div>
          </div>
        </div>

        <RadioTabs
          data={tabsPricingDetail}
          onChange={(e) => setValuePageDetail(e.target.value)}
          currentPosition={valuePageDetail}
        />
        <div className={`${valuePageDetail !== "Detail" ? "hidden" : ""}`}>
          <div className="w-full p-5">
            <TablePagination
              columns={columnsDetail(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                data,
                minimums
              ).filter((a) => {
                return a?.dataIndex !== "key";
              })}
              current={page}
              pageSize={pageSize}
              dataSource={mergedTable(data?.mPricingRuleDetails)}
              onChange={handleChangePage}
              onShowSizeChange={handleChangePage}
              totalData={data?.mPricingRuleDetails?.length}
              tableScrolled={{ y: 300, x: 1500 }}
            />
          </div>
        </div>

        <div className={`${valuePageDetail !== "Criteria" ? "hidden" : ""}`}>
          <div className="w-full p-5">
            {/* <FunctionalTableCriteria
              type={"detail"}
              data={listDataCriteria}
              dataCriteria={criteriaValues}
            /> */}
            <FunctionalCriteriaProduct
              type={"preview"}
              data={listDataCriteria || []} //data
              dataCriteria={criteriaValues || []} //ddl
              columnsTable={columnsTableCriteriaAll}
            />
          </div>
        </div>
      </div>

      <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
        <div className="w-full p-5">
          <div>
            <span className="text-primary uppercase font-bold">
              Approval Information
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5 pt-[30px]">
            <DetailText label="Approval Hierarchy:">
              {approvalDetail}
            </DetailText>
            <div className="w-full col-span-2">
              <TablePagination
                useSelect={false}
                usePagination={false}
                columns={columnsApproval(
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                )}
                dataSource={
                  apiApprovalList && apiApprovalList.length === 0
                    ? null
                    : dataTable
                }
                expandable={{
                  expandedRowRender,
                }}
                className="table-expand-custom"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
        <div className="w-full p-5">
          <div>
            <span className="text-primary uppercase font-bold">
              Attachment Information
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-[30px]">
            <TablePagination
              dataSource={updatePaginationAttachment(
                currentAttachment,
                sizeAttachment
              )}
              totalData={dataAttachment?.length}
              current={currentAttachment}
              pageSize={sizeAttachment}
              onChange={handleChangeAttachment}
              onSizeChanger={handleChangeAttachment}
              columns={columnAttachmentData(
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              ).filter((a) => {
                return (
                  a.dataIndex !== "action" &&
                  a.dataIndex !== "uploadBy" &&
                  a.dataIndex !== "uploadDate"
                );
              })}
              tableScrolled={{ y: 300, x: 1500 }}
            />
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ConfirmationLayout;
