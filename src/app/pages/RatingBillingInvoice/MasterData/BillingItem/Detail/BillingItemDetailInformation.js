import { Fragment, useRef, useState } from "react";
import { Tabs } from "antd";
import DetailText from "../../../../../../components/DetailText";
import TableRBI from "../../../../../../components/TableRBI";
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

const { TabPane } = Tabs;

const buildCriteriaColumns = () => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    width: 60,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "CRITERIA VALUE",
    dataIndex: "criteriaValue",
    key: "criteriaValue",
    width: 180,
    render: (val) => val || "-",
  },
  {
    title: "GL ACCOUNT",
    dataIndex: "glAccount",
    key: "glAccount",
    width: 280,
    render: (val) => val || "-",
  },
  {
    title: "DESCRIPTION ACCOUNT",
    dataIndex: "descriptionAccount",
    key: "descriptionAccount",
    width: 220,
    render: (val) => val || "-",
  },
  {
    title: "SPECIAL GL",
    dataIndex: "specialGl",
    key: "specialGl",
    width: 140,
    render: (val) => val || "-",
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    key: "startDate",
    width: 150,
    render: (val) => (val ? moment(val).format(dateFormatting.date) : "-"),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    key: "endDate",
    width: 150,
    render: (val) => (val ? moment(val).format(dateFormatting.date) : "-"),
  },
];

const resolveTypeName = (transMappingType, data_typeList = []) => {
  if (!transMappingType) return "-";
  const found = data_typeList?.find(
    (t) => t.code === transMappingType || t.id === transMappingType,
  );
  return found ? found.name : transMappingType;
};

const resolveCriteriaName = (criteriaList, data_criteriaList = []) => {
  if (!criteriaList || criteriaList.length === 0) return "-";
  const firstCode = criteriaList[0]?.criteriaCode;
  if (!firstCode) return "-";
  const found = data_criteriaList?.find(
    (c) => c.code === firstCode || c.id === firstCode,
  );
  return found ? found.name : firstCode;
};

const handleStatusCase = (index) => {
  switch (index) {
    case "WAITING APPROVAL":
    case "WAITING_APPROVAL":
      return "Waiting Approval";
    default:
      return index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
  }
};

const BillingItemDetailInformation = ({
  dataBillingItem,
  dataMapping = [],
  type = "detail",
  data_typeList = [],
  data_criteriaList = [],
}) => {
  // Mapping Detail state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});

  // Detail Mapping state
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

  const [fixedMapping, setFixedMapping] = useState({ left: [], right: [] });
  const [fixedDetail, setFixedDetail] = useState({ left: [], right: [] });
  const [fixedCriteria, setFixedCriteria] = useState({ left: [], right: [] });

  const [mappingTab, setMappingTab] = useState("mapping");
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) setPage(1);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
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
    if (searchedColumnDetail !== tempSearchColumn) setPage(1);
    setSearchedColumnDetail(dataIndex);
    setSearchDetail((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleDetail = (e) => {
    if (e.categoryId === category) {
      setIsDetailMapShown(false);
      setCategory("");
    } else {
      setSubHeader(
        dataBillingItem?.mappingInformation?.find(
          (item) => item.categoryId === e.categoryId,
        )?.category,
      );
      setCategory(e.categoryId);
      const detailMappingInfo = dataBillingItem?.mappingInformation?.find(
        (item) => item.categoryId === e.categoryId,
      )?.detailMappingInfo;
      setDataDetailTable(detailMappingInfo || []);
      setIsDetailMapShown(true);
    }
  };

  const onFilter = (dataIndex, value, record) => {
    const searchVal = value.toLowerCase();
    switch (dataIndex) {
      case "startDate":
      case "endDate":
        const date = record[dataIndex]
          ? moment(record[dataIndex]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase().includes(searchVal);
      case "fileSize":
        return record.size.includes(searchVal);
      default:
        return record[dataIndex]?.toLowerCase().includes(searchVal);
    }
  };

  const sorter = (fieldSort, a, b) => {
    const getData = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          return obj[fieldSort] ? moment(obj[fieldSort]) : null;
        default:
          return `${obj[fieldSort]}`.toLowerCase();
      }
    };
    const fa = getData(a);
    const fb = getData(b);
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (fa === null && fb === null) return 0;
        if (fa === null) return 1;
        if (fb === null) return -1;
        if (hasValue(fa) && hasValue(fb)) {
          if (fa.isBefore(fb)) return -1;
          if (fa.isAfter(fb)) return 1;
          return 0;
        }
        return 0;
      default:
        return fa.localeCompare(fb);
    }
  };

  const handleDetailHistory = (r) => {
    setModalHistory(true);
    setDataHistory({
      recordId: r?.rMappingId,
      createdDate: r?.createdDate,
      createdBy: r?.createdBy,
      updatedDate: r?.updatedDate,
      updatedBy: r?.updatedBy,
    });
  };

  const criteriaTableData = (dataBillingItem?.criteria || []).map(
    (item, idx) => ({ ...item, key: idx }),
  );

  return (
    <Fragment>
      <CardContainer header="TRANSACTION MAPPING INFORMATION">
        <div className="w-full grid grid-cols-4 gap-x-8 gap-y-5">

          <DetailText label="Type">
            {resolveTypeName(dataBillingItem?.transMappingType, data_typeList)}
          </DetailText>
          <DetailText label="Transaction Mapping Code">
            {dataBillingItem?.billingItemCode || "-"}
          </DetailText>
          <DetailText label="Transaction Mapping Category">
            {dataBillingItem?.billingItemCategory || "-"}
          </DetailText>
          <DetailText label="Name">
            {dataBillingItem?.billingItemName || "-"}
          </DetailText>

          <DetailText label="Bill Type">
            {dataBillingItem?.billingType || "-"}
          </DetailText>
          <DetailText label="Start Date">
            {dataBillingItem?.startDate
              ? moment(dataBillingItem.startDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="End Date">
            {dataBillingItem?.endDate
              ? moment(dataBillingItem.endDate).format(dateFormatting.date)
              : "-"}
          </DetailText>
          <DetailText label="Late Charge">
            {dataBillingItem?.lateCharge ? "Yes" : "No"}
          </DetailText>

          <DetailText label="Payment Warranty">
            {dataBillingItem?.paymentWarranty ? "Yes" : "No"}
          </DetailText>
          <DetailText label="Installment / Restructure">
            {dataBillingItem?.installment ? "Yes" : "No"}
          </DetailText>
          <DetailText label="Criteria">
            {resolveCriteriaName(dataBillingItem?.criteria, data_criteriaList)}
          </DetailText>
          <DetailText label="Description">
            {dataBillingItem?.description || "-"}
          </DetailText>

          <DetailText label="Status">
            {dataBillingItem?.status ? (
              <StatusComponent colour={dataBillingItem.status}>
                {dataBillingItem.status}
              </StatusComponent>
            ) : "-"}
          </DetailText>
          <DetailText label="Status Approval">
            {dataBillingItem?.statusApproval ? (
              <StatusComponent colour={dataBillingItem.statusApproval}>
                {handleStatusCase(dataBillingItem.statusApproval)}
              </StatusComponent>
            ) : "-"}
          </DetailText>
        </div>
      </CardContainer>

      <CardContainer
        type="tabs"
        header="MAPPING INFORMATION"
        element={
          <Tabs
            activeKey={mappingTab}
            onChange={(key) => {
              setMappingTab(key);
              if (key !== "mapping") {
                setIsDetailMapShown(false);
                setCategory("");
              }
            }}
            tabBarStyle={{ marginBottom: 0 }}
          >
            <TabPane tab="Mapping Detail" key="mapping" />
            <TabPane tab="Criteria Detail" key="criteria" />
          </Tabs>
        }
      >
        {mappingTab === "mapping" && (
          <>
            <TableRBI
              fixedColumns={fixedMapping}
              setFixedColumns={setFixedMapping}
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

            {isDetailMapShown && (
              <div className="mt-4">
                <CardContainer header="DETAIL MAPPING INFORMATION">
                  {subHeader && (
                    <div className="mb-4 text-sm font-medium">
                      Category:{" "}
                      <span className="text-primary">{subHeader}</span>
                    </div>
                  )}
                  <TableRBI
                    fixedColumns={fixedDetail}
                    setFixedColumns={setFixedDetail}
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
                      sorter,
                      [],
                      handleDetailHistory,
                    )}
                    current={pageDetail}
                    pageSize={pageSizeDetail}
                    onChange={handleChangeDetail}
                    tableScrolled={{ y: 525, x: 2000 }}
                  />
                </CardContainer>
              </div>
            )}
          </>
        )}

        {/* ── Tab: Criteria Detail ── */}
        {mappingTab === "criteria" && (
          <TableRBI
            fixedColumns={fixedCriteria}
            setFixedColumns={setFixedCriteria}
            dataSource={criteriaTableData}
            type="FE"
            totalData={criteriaTableData.length || 0}
            columns={buildCriteriaColumns()}
            current={1}
            pageSize={10}
            onChange={() => {}}
            tableScrolled={{ y: 525, x: 1300 }}
          />
        )}
      </CardContainer>

      <CardContainer header="HISTORY LOG INFORMATION">
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">{dataBillingItem?.id || "-"}</DetailText>
          <DetailText label="Created Date">
            {renderDateTime(dataBillingItem?.createdDate)}
          </DetailText>
          <DetailText label="Created By">
            {dataBillingItem?.createdBy || "-"}
          </DetailText>
          <DetailText label="Update Date">
            {renderDateTime(dataBillingItem?.updatedDate)}
          </DetailText>
          <DetailText label="Updated By">
            {dataBillingItem?.updatedBy || "-"}
          </DetailText>
        </div>
      </CardContainer>

      {/* Modal History Log detail mapping */}
      <ModalCustom
        isOpen={modalHistory}
        handleCancel={() => setModalHistory(false)}
        type="detail"
        header="DETAIL INFORMATION"
        width={800}
        footer={
          <ButtonComponent
            type="default"
            onClick={() => setModalHistory(false)}
          >
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header="HISTORY LOG INFORMATION" cols={5}>
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