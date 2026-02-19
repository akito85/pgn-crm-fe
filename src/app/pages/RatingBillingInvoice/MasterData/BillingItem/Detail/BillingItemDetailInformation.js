import { Fragment, useRef, useState } from "react";
import DetailText from "../../../../../../components/DetailText";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import columnsDetail from "../Table/TableDetailMappingInformation";
import columnsMapping from "../Table/TableMappingInformation";
import { renderDateTime } from "../../GeneralTemplate/Utils/Utils";
import moment from "moment";
import { dateFormatting, hasValue } from "../../../../../../utils";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardContainer from "../../../../../../components/CardContainer";
import StatusComponent from "../../../../../../components/StatusComponent";

const BillingItemDetailInformation = ({
  dataBillingItem,
  dataMapping = [],
  // dataDetailMapping = [],
  type = "detail",
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});

  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const [searchedColumnDetail, setSearchedColumnDetail] = useState("");
  const [searchTextDetail, setSearchTextDetail] = useState("");
  const searchInputDetail = useRef(null);
  const [searchDetail, setSearchDetail] = useState({});

  const [category, setCategory] = useState("");
  const [dataHistory, setDataHistory] = useState({});
  const [dataDetailTable, setDataDetailTable] = useState([]);

  const [subHeader, setSubHeader] = useState("");
  const [modalHistory, setModalHistory] = useState(false);
  const [isDetailMapShown, setIsDetailMapShown] = useState(false);

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);

    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(dataIndex);
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

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    setPageDetail(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSizeDetail(pageSizeChange);
  };

  const handleSearchDetail = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextDetail(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumnDetail !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumnDetail(dataIndex);
    setSearchDetail((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleDetail = (e) => {
    if (e.categoryId === category) {
      setIsDetailMapShown(false);
      setCategory("");
    } else {
      setSubHeader(
        dataBillingItem.mappingInformation.filter(
          (item) => item.categoryId === e.categoryId,
        )[0]?.category,
      );
      setCategory(e.categoryId);
      if (dataBillingItem) {
        const detailMappingInfo = dataBillingItem?.mappingInformation?.filter(
          (item) => item.categoryId === e.categoryId,
        )[0]?.detailMappingInfo;
        setDataDetailTable(detailMappingInfo);
        setIsDetailMapShown(true);
      }
    }
  };

  const onFilter = (dataIndex, value, record) => {
    const search =
      // moment(value, dateFormatting.dateFormal, true).isValid() //adjust for date
      //   ? moment(value).format(dateFormatting.date).toLowerCase()
      //   :
      value.toLowerCase();
    switch (dataIndex) {
      case "startDate":
      case "endDate":
        const date = record[dataIndex]
          ? moment(record[dataIndex]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase().includes(search);
      case "fileSize":
        return record.size.includes(search);
      default:
        return record[dataIndex]?.toLowerCase().includes(search);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          return obj[fieldSort] ? moment(obj[fieldSort]) : null;
        // return date.toLowerCase();
        default:
          return `${obj[fieldSort]}`.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    const handleCompare = (a, b) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          if (a === null && b === null) return 0; // Both are null, consider equal
          if (a === null) return 1; // `a` is null, place it as greater (bottom)
          if (b === null) return -1; // `b` is null, place it as greater (bottom)
          if (hasValue(a) && hasValue(b)) {
            if (a.isBefore(b)) return -1;
            if (a.isAfter(b)) return 1;
            return 0;
          }
          return 0; // Handle null cases if necessary
        default:
          return a.localeCompare(b);
      }
    };
    return handleCompare(fa, fb);
  };

  const sorterDetail = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          return obj[fieldSort] ? moment(obj[fieldSort]) : null;
        // return date.toLowerCase();
        default:
          return `${obj[fieldSort]}`.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    const handleCompare = (a, b) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          if (a === null && b === null) return 0; // Both are null, consider equal
          if (a === null) return 1; // `a` is null, place it as greater (bottom)
          if (b === null) return -1; // `b` is null, place it as greater (bottom)
          if (hasValue(a) && hasValue(b)) {
            if (a.isBefore(b)) return -1;
            if (a.isAfter(b)) return 1;
            return 0;
          }
          return 0; // Handle null cases if necessary
        default:
          return a.localeCompare(b);
      }
    };
    return handleCompare(fa, fb);
  };

  const handleStatusCase = (index) => {
    let text;
    switch (index) {
      case "WAITING APPROVAL":
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };

  const handleDetailHistory = (r) => {
    // console.log(r);
    setModalHistory(true);
    setDataHistory({
      recordId: r?.rMappingId,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const closeModalHistory = () => {
    setModalHistory(false);
  };

  return (
    <Fragment>
      <CardContainer header="BILLING ITEM INFORMATION">
        <div className="w-full grid grid-cols-6 gap-3">
          <DetailText label="Billing Item Code">
            {dataBillingItem?.billingItemCode || ""}
          </DetailText>
          <DetailText label="Billing Item Category">
            {dataBillingItem?.billingItemCategory || ""}
          </DetailText>
          <DetailText label="Name">
            {dataBillingItem?.billingItemName}
          </DetailText>
          <DetailText label="Bill Type">
            {dataBillingItem?.billingType}
          </DetailText>
          <DetailText label="Start Date">
            {moment(dataBillingItem?.startDate).format(dateFormatting.date)}
          </DetailText>
          <DetailText label="End Date">
            {dataBillingItem.endDate
              ? moment(dataBillingItem?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Late Charge">
            {dataBillingItem?.lateCharge ? "Yes" : "No"}
          </DetailText>
          <DetailText label="Payment Warranty">
            {dataBillingItem?.paymentWarranty ? "Yes" : "No"}
          </DetailText>
          <DetailText label="GL account">
            {dataBillingItem?.glAccount || ""}
          </DetailText>
          <DetailText label="Status">
            {dataBillingItem?.status && (
              <StatusComponent colour={dataBillingItem.status}>
                {dataBillingItem.status}
              </StatusComponent>
            )}
          </DetailText>
          <DetailText label="Status Approval">
            {dataBillingItem?.statusApproval && (
              <StatusComponent colour={dataBillingItem.statusApproval}>
                {handleStatusCase(dataBillingItem.statusApproval)}
              </StatusComponent>
            )}
          </DetailText>
          <div className="col-span-4">
            <DetailText label="Description">
              {dataBillingItem?.description || ""}
            </DetailText>
          </div>
        </div>
      </CardContainer>

      <CardContainer header="MAPPING INFORMATION">
        <TablePaginationNew
          dataSource={dataMapping}
          type="FE"
          totalData={dataMapping.length || 0}
          columns={columnsMapping(
            search,
            false,
            type,
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            handleDetail,
            onFilter,
            sorter,
          )}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          tableScrolled={{ y: 525, x: 2000 }}
        />
      </CardContainer>

      {isDetailMapShown && (
        <CardContainer header="DETAIL MAPPING INFORMATION">
          {subHeader && (
            <div className="mb-4 text-sm font-medium">
              Category: <span className="text-primary">{subHeader}</span>
            </div>
          )}
          <TablePaginationNew
            dataSource={dataDetailTable || []}
            type="FE"
            totalData={dataDetailTable?.length || 0}
            columns={columnsDetail(
              searchDetail,
              false,
              type,
              pageDetail,
              pageSizeDetail,
              searchInputDetail,
              searchedColumnDetail,
              searchTextDetail,
              handleSearchDetail,
              onFilter,
              sorterDetail,
              [],
              handleDetailHistory,
            )}
            current={pageDetail}
            pageSize={pageSizeDetail}
            onChange={handleChangeDetail}
            tableScrolled={{ y: 525, x: 2000 }}
          />
        </CardContainer>
      )}

      <CardContainer header="HISTORY LOG INFORMATION">
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{dataBillingItem?.id}</DetailText>
          <DetailText label="Created Date">
            {renderDateTime(dataBillingItem?.createdDate)}
          </DetailText>
          <DetailText label="Created By">
            {dataBillingItem?.createdBy}
          </DetailText>
          <DetailText label="Update Date">
            {renderDateTime(dataBillingItem?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">
            {dataBillingItem?.updatedBy}
          </DetailText>
        </div>
      </CardContainer>

      {/* Modal History Log */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={closeModalHistory}
        type="detail"
        header="DETAIL INFORMATION"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={closeModalHistory}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataHistory.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </CardComponent>
      </ModalCustom>
    </Fragment>
  );
};
export default BillingItemDetailInformation;
