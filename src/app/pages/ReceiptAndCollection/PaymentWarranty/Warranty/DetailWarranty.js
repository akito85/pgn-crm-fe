import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import { columnMutation } from "./ColumnConfig/MutationColumns";
import SectionCard from "../../../../../components/SectionCard";
import StatusComponent from "../../../../../components/StatusComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { getDetailWarrantyMutation } from "../../../../../redux/slices/receipt_collection/warranty";
import ModalMutation from "./Modal/ModalMutation";

const DetailWarranty = ({ data_detail }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { dataMutationInfo, loadingMutation } = useSelector((state) => state.warranty);
  
  const [isModalMutationOpen, setIsModalMutationOpen] = useState(false);

  useEffect(() => {
    if (data_detail?.id) {
      dispatch(getDetailWarrantyMutation({ id: data_detail.id, page, pageSize }));
    }
  }, [dispatch, data_detail?.id, page, pageSize]);

  const fetchMutation = () => {
    if (data_detail?.id) {
      dispatch(getDetailWarrantyMutation({ id: data_detail.id, page, pageSize }));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 px-4 pt-4">
      <SectionCard title="ACCOUNT INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Account Number">{data_detail?.accountNumber || "-"}</DetailText>
            <DetailText label="Account Name">{data_detail?.accountName || "-"}</DetailText>
            <DetailText label="Customer Number">{data_detail?.customerNumber || "-"}</DetailText>
            <DetailText label="Customer Name">{data_detail?.customerName || "-"}</DetailText>
            <DetailText label="Cost Center">{data_detail?.costCenterName || data_detail?.costCenter || "-"}</DetailText>
            <DetailText label="Customer Segment">{data_detail?.customerSegment || data_detail?.accountSegment || "-"}</DetailText>
            <DetailText label="Customer Group">{data_detail?.customerGroup || "-"}</DetailText>
            <DetailText label="Account Type">{data_detail?.accountType || "-"}</DetailText>
            <DetailText label="Clasification Type">{data_detail?.classificationType || "-"}</DetailText>
        </div>
      </SectionCard>

      <SectionCard title="SERVICE AGREEMENT DETAIL">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Service Agreement Number">{data_detail?.serviceAgreementNumber || data_detail?.saNumber || "-"}</DetailText>
            <DetailText label="Service Agreement Reference">{data_detail?.serviceAgreementReference || data_detail?.saReference || "-"}</DetailText>
            <DetailText label="Service Type">{data_detail?.serviceType || "-"}</DetailText>
            <DetailText label="Type">{data_detail?.saType || data_detail?.type || "-"}</DetailText>
            <DetailText label="PBG Type">{data_detail?.pbgType || "-"}</DetailText>
            <DetailText label="Service Agreement Date">{data_detail?.saDate ? moment(data_detail?.saDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Start Date">{data_detail?.saStartDate ? moment(data_detail?.saStartDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="End Date">{data_detail?.saEndDate ? moment(data_detail?.saEndDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Commitment Date">{data_detail?.commitmentDate ? moment(data_detail?.commitmentDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Status Approval">
                {data_detail?.saStatusApproval ? <StatusComponent status={data_detail?.saStatusApproval} /> : "-"}
            </DetailText>
            <DetailText label="Status">
                {data_detail?.saStatus ? <StatusComponent status={data_detail?.saStatus} /> : "-"}
            </DetailText>
            <div className="col-span-4">
              <DetailText label="Description">{data_detail?.saDescription || "-"}</DetailText>
            </div>
        </div>
      </SectionCard>

      <SectionCard title="PAYMENT GUARANTEE INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Type">{data_detail?.warrantyType || "-"}</DetailText>
            <DetailText label="Document Number">{data_detail?.documentNumber || "-"}</DetailText>
            <DetailText label="Document Date">{data_detail?.documentDate ? moment(data_detail?.documentDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Issuer">{data_detail?.issuerBankName || data_detail?.issuerBank || data_detail?.partnerName || "-"}</DetailText>
            <DetailText label="Issuer Branch">{data_detail?.issuerBranchName || data_detail?.issuerBranch || "-"}</DetailText>
            <DetailText label="Currency">{data_detail?.currency || "-"}</DetailText>
            <DetailText label="Rate Type">{data_detail?.rateType || "-"}</DetailText>
            <DetailText label="Rate Date">{data_detail?.rateDate ? moment(data_detail?.rateDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Rate">{data_detail?.rateAmount?.toLocaleString() || data_detail?.rate?.toLocaleString() || "-"}</DetailText>
            <DetailText label="EFF Start Date">{data_detail?.effectiveStartDate ? moment(data_detail?.effectiveStartDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="EFF End Date">{data_detail?.effectiveEndDate ? moment(data_detail?.effectiveEndDate).format("DD MMM YYYY") : "-"}</DetailText>
            <DetailText label="Term Of Claim Period">{data_detail?.claimPeriodTermValue ? `${data_detail?.claimPeriodTermValue} ${data_detail?.claimPeriodTermType || ''}` : "-"}</DetailText>
            <div className="col-span-3">
              <DetailText label="Description">{data_detail?.description || "-"}</DetailText>
            </div>
        </div>
      </SectionCard>

      <SectionCard title="MUTATION DATA INFORMATION">
        <div className="flex justify-end mb-4">
          <ButtonComponent type="submit" icon={<PlusOutlined />} onClick={() => setIsModalMutationOpen(true)}>
            Create
          </ButtonComponent>
        </div>
        <Spin spinning={loadingMutation}>
          <TableRBI
              dataSource={dataMutationInfo?.content || []}
              columns={columnMutation(page, pageSize)}
              current={page}
              pageSize={pageSize}
              totalData={dataMutationInfo?.page?.totalElements || 0}
              onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
              showExport={false}
              showAdvanceSearch={true}
              showSearchBar={true}
          />
        </Spin>
      </SectionCard>

      <ModalMutation
        isOpen={isModalMutationOpen}
        handleCancel={() => setIsModalMutationOpen(false)}
        modalType="create"
        warrantyId={data_detail?.id}
        fetchMutation={fetchMutation}
      />
    </div>
  );
};

export default DetailWarranty;
