import React, { useState } from "react";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import { columnMutation } from "./ColumnConfig/MutationColumns";
import DetailSection from "../../../../../components/DetailSection";

const DetailWarranty = ({ data_detail }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <>
      <DetailSection header="CUSTOMER INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4 mb-2">
            <DetailText label="Customer Number">
              {data_detail?.customerNumber || "-"}
            </DetailText>
            <DetailText label="Customer Name">
              {data_detail?.customerName || "-"}
            </DetailText>
            <DetailText label="Account Number">
              {data_detail?.accountNumber || "-"}
            </DetailText>
            <DetailText label="Account Name">
              {data_detail?.accountName || "-"}
            </DetailText>
            <DetailText label="Account Segment">
              {data_detail?.customerSegment || data_detail?.accountSegment || "-"}
            </DetailText>
            <DetailText label="Account Group Type">
              {data_detail?.customerGroup || "-"}
            </DetailText>
            <DetailText label="SOR">
              {data_detail?.costCenter || "-"}
            </DetailText>
            <DetailText label="Cost Center Code">
              {data_detail?.costCenterCode || "-"}
            </DetailText>
            <DetailText label="Cost Center Name">
              {data_detail?.costCenterName || "-"}
            </DetailText>
        </div>
      </DetailSection>

      <DetailSection header="MUTATION DATA INFORMATION">
        <TableRBI
            dataSource={data_detail?.mutations || []}
            columns={columnMutation(page, pageSize)}
            current={page}
            pageSize={pageSize}
            totalData={data_detail?.mutations?.length || 0}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
            showExport={false}
            showAdvanceSearch={true}
            showSearchBar={true}
          />
      </DetailSection>

      <DetailSection header="HISTORY LOG INFORMATION">
        <div className="w-full grid grid-cols-5 gap-3">
            <DetailText label="Record ID">
              {data_detail?.recordId || data_detail?.id || "-"}
            </DetailText>
            <DetailText label="Created Date">
              {data_detail?.createdDate ? moment(data_detail?.createdDate).format(dateFormatting.dateCapital) : "-"}
            </DetailText>
            <DetailText label="Created By">
              {data_detail?.createdBy || "-"}
            </DetailText>
            <DetailText label="Updated Date">
              {data_detail?.updatedDate ? moment(data_detail?.updatedDate).format(dateFormatting.dateCapital) : "-"}
            </DetailText>
            <DetailText label="Updated By">
              {data_detail?.updatedBy || "-"}
            </DetailText>
        </div>
      </DetailSection>
    </>
  );
};

export default DetailWarranty;
