import { LeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  getElectronicDetail,
  getTableParsing,
  getTableReverse,
  getTableSundry,
} from "../../../../../redux/slices/receipt_collection/electrionicBank";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting, toTitleCase } from "../../../../../utils";
import DetailForce from "./DataDetailTabs/DetailForce";
import DetailMatch from "./DataDetailTabs/DetailMatch";
import DetailParsingResulte from "./DataDetailTabs/DetailParsingResulte";
import DetailRevers from "./DataDetailTabs/DetailRevers";
import DetailSundry from "./DataDetailTabs/DetailSundry";

const DetailMaintainElectronicBankStatement = (props) => {
  const {
    loading,
    data_match,
    data_force,
    data_parsing,
    data_reverse,
    data_sundry,
    data_detail,
    data_cus,
    loadingApprove,
  } = useSelector((state) => state.electronic);

  // Declaration

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const tabData = [
    { value: "Match Reconcile" },
    { value: "Recommendation Force" },
    { value: "Recommendation Reverse" },
    { value: "Sundry Transaction" },
    { value: "Parsing Result" },
  ];
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTextMatch, setSearchTextMatch] = useState("");
  const [searchedColumnMatch, setSearchedColumnMatch] = useState("");
  const [searchMatch, setSearchMatch] = useState("");
  const [sortMatch, setSortMatch] = useState("");
  const [search, setSearch] = "";
  const [sort, setSort] = "";

  //dispatch
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
    // dispatch(getTableMatch({ id, page, pageSize, sort, search }));
    dispatch(getTableReverse({ id, page, pageSize, sort, search }));
    dispatch(getTableSundry({ id, page, pageSize, sort, search }));
    dispatch(getTableParsing({ id, page, pageSize, sort, search }));
  }, [search, page, pageSize, sort, dispatch, sortMatch, searchMatch]);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };
  const dataTabs = {
    match: "Match Reconcile",
    force: "Recommendation Force",
    reverse: "Recommendation Reverse",
    sundry: "Sundry Transaction",
    parsingResult: "Parsing Result",
  };
  const renderSection = () => {
    switch (segmentedPage) {
      case dataTabs.match:
        return (
          <>
            <DetailMatch
              data_match={data_match}
              loading={loading}
              searchTextMatch={searchTextMatch}
              setSearchTextMatch={setSearchTextMatch}
              searchedColumnMatch={searchedColumnMatch}
              setSearchedColumnMatch={setSearchedColumnMatch}
              searchMatch={searchMatch}
              setSearchMatch={setSearchMatch}
              sortMatch={sortMatch}
              setSortMatch={setSortMatch}
              id={id}
            />
          </>
        );
      case dataTabs.force:
        return (
          <>
            <div className="my-5 grid grid-cols-3 gap-10">
              <DetailText label={"Total Transaction"}>
                {data_force?.page?.totalElements}
              </DetailText>
              <DetailText label={"Total Amount"}>
                {data_force?.totalAmount}
              </DetailText>
            </div>
            <DetailForce
              id={id}
              loading={loading}
              data={data_force}
              isApprover={data_detail?.isApprover}
              loadingApprove={loadingApprove}
            />
          </>
        );
      case dataTabs.reverse:
        return (
          <>
            <div className="my-5 grid grid-cols-3 gap-10">
              <DetailText label={"Total Transaction"}>
                {data_reverse?.page?.totalElements}
              </DetailText>
              <DetailText label={"Total Amount"}>
                {data_reverse?.totalAmount}
              </DetailText>
            </div>
            <DetailRevers
              data={data_reverse}
              id={id}
              isApprover={data_detail?.isApprover}
            />
          </>
        );
      case dataTabs.sundry:
        return (
          <>
            <div className="my-5 grid grid-cols-3 gap-10">
              <DetailText label={"Total Transaction"}>
                {data_sundry?.page?.totalElements}
              </DetailText>
              <DetailText label={"Total Amount"}>
                {data_sundry?.totalAmount}
              </DetailText>
            </div>
            <DetailSundry
              data={data_sundry}
              id={id}
              data_cus={data_cus}
              isApprover={data_detail?.isApprover}
            />
          </>
        );
      case dataTabs.parsingResult:
        return <DetailParsingResulte data={data_parsing} id={id} />;
      default:
    }
  };

  // Use Effect
  useEffect(() => {
    dispatch(getElectronicDetail(id));
  }, [id]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Receipt Reconciliation",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MAINTAIN_ELECTRONIC_BANK_STATEMENT,
      breadcrumbName: "Maintain Electronic Bank Statement",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MAINTAIN_ELECTRONIC_BANK_STATEMENT,
      breadcrumbName: "Detail Maintain Electronic Bank Statement",
    },
  ];
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"BANK STATEMENT INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label={"Bank Name"}>{data_detail?.bankName}</DetailText>
            <DetailText label={"Bank Account Number"}>
              {data_detail?.bankAccountNumber}
            </DetailText>
            <DetailText label={"Collecting Agent"}>
              {data_detail?.collectingAgent}
            </DetailText>
            <DetailText label={"Source File"}>
              {data_detail?.sourceFile}
            </DetailText>
            <DetailText label={"Type"}>{data_detail?.paymentType}</DetailText>
            <DetailText label={"Bank Statement Date"}>
              {data_detail?.bankStatementDate
                ? moment(data_detail?.bankStatementDate).format("DD MMM YYYY")
                : ""}
            </DetailText>
            <DetailText label={"Status"}>
              {toTitleCase(data_detail?.statusBankStatement)}
            </DetailText>
            <DetailText label="Status Approval">
              {data_detail?.statusApproval}
            </DetailText>
            <DetailText label={"Total Transaction"}>
              {data_detail?.totalTransaction}
            </DetailText>
            <DetailText label={"Total Match Transaction"}>
              {data_detail?.totalMatch}
            </DetailText>
            <DetailText label={"Total Force Transaction"}>
              {data_detail?.totalForce}
            </DetailText>
            <DetailText label={"Total Reverse Transaction"}>
              {data_detail?.totalReverse}
            </DetailText>
            <DetailText label={"Total Sundry Transaction"}>
              {data_detail?.totalSundry}
            </DetailText>
            <DetailText label={"Currency"}>{data_detail?.currency}</DetailText>
            <DetailText label={"Total Amount"}>
              {data_detail?.totalMatchAmount}
            </DetailText>
            <DetailText label={"Error Message"}>
              {data_detail?.errorMessage}
            </DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"RECEIPT ON BANK STATEMENT INFORMATION"}>
          <div className="w-full gap-5">
            <RadioTabs
              currentPosition={segmentedPage}
              data={tabData}
              onChange={handleSegmentedPage}
            />

            {renderSection()}
          </div>
        </BaseContainer>
        <BaseContainer header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5">
            <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
            <DetailText label={"Created Date"}>
              {moment(data_detail?.createdDate).format(dateFormatting.dateTime)}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {data_detail?.updatedDate
                ? moment(data_detail?.updatedDate).format(
                    dateFormatting.dateTime,
                  )
                : null}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>

        <div className="flex mt-[30px] justify-between py-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailMaintainElectronicBankStatement;
