import React, { useEffect } from "react";
import { Spin, Tabs, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import HeaderDetail from "../../../HeaderDetail";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxTable from "../../../../../../../components/Nx/NxTable";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { getDetailWarrantyTerm } from "../../../../../../../redux/slices/account_management/detailAccount/warrantySlice";
import { dateFormatting } from "../../../../../../../utils";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";

const breadcrumbRoutes = (item) => [
  { path: "", breadcrumbName: "Account Management" },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
    breadcrumbName: "Account - Standard",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
    breadcrumbName: "Detail Account",
    state: { idAccount: item.idAccount },
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
    breadcrumbName: "Detail Service Agreement",
    state: {
      idSA: item.idSA,
      idAccount: item.idAccount,
      idCustomer: item.idCustomer,
      type: item.type,
    },
  },
  { path: "", breadcrumbName: "Detail Warranty Term" },
];

// ─── Attachment table columns (read-only) ────────────────────────────────────
const attachmentColumns = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  { title: "CATEGORY", dataIndex: "category", width: 160 },
  {
    title: "FILE NAME",
    dataIndex: "fileName",
    ellipsis: { showTitle: false },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  { title: "UPLOAD BY", dataIndex: "uploadBy", width: 160 },
  { title: "UPLOADED DATE", dataIndex: "uploadDate", width: 200 },
  {
    title: "FILE SIZE",
    dataIndex: "fileSize",
    align: "center",
    width: 120,
    render: (val) => bytesConverter(val || 0),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const DetailWarrantyTerm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id, idSA, idAccount, idCustomer, type } = location?.state || {};

  const { dataDetail, loading } = useSelector((state) => state.saWarranty);

  useEffect(() => {
    if (id) dispatch(getDetailWarrantyTerm(id));
  }, [dispatch, id]);

  // Normalise attachment data
  const attachmentData = (dataDetail?.mattachments || []).map((item, i) => ({
    key: i + 1,
    category: item.fileCategoryName || item.categoryName || "-",
    fileName: item.fileName || "-",
    uploadBy: item.createdBy || "-",
    uploadDate: item.createdDate
      ? moment(item.createdDate).format("DD MMM YYYY HH:mm:ss")
      : "-",
    fileSize: item.fileSize || 0,
  }));

  const tabItems = [
    {
      key: "warrantyInformation",
      label: "Warranty Information",
      children: (
        <NxBaseContainer border header="WARRANTY TERM INFORMATION">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Document Number">
              {dataDetail?.docNumber || "-"}
            </NxDetailText>
            <NxDetailText label="Document Date">
              {dataDetail?.docDate
                ? moment(dataDetail.docDate).format(dateFormatting.date)
                : "-"}
            </NxDetailText>
            <NxDetailText label="Start Date">
              {dataDetail?.startDate
                ? moment(dataDetail.startDate).format(dateFormatting.date)
                : "-"}
            </NxDetailText>
            <NxDetailText label="End Date">
              {dataDetail?.endDate
                ? moment(dataDetail.endDate).format(dateFormatting.date)
                : "-"}
            </NxDetailText>
            <NxDetailText label="Currency">
              {dataDetail?.currency || "-"}
            </NxDetailText>
            <NxDetailText label="Amount">
              {dataDetail?.amount !== undefined && dataDetail?.amount !== null
                ? dataDetail.amount.toLocaleString()
                : "-"}
            </NxDetailText>
            <NxDetailText label="Description" className="col-span-3">
              {dataDetail?.description || "-"}
            </NxDetailText>
            <NxDetailText label="Status">
              {dataDetail?.status || "-"}
            </NxDetailText>
            <NxDetailText label="Status Approval">
              {dataDetail?.statusApproval || "-"}
            </NxDetailText>
          </div>
        </NxBaseContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <NxBaseContainer border header="ATTACHMENT INFORMATION">
          <NxTable
            idTable="warranty-detail-attachment-table"
            dataSource={attachmentData}
            totalData={attachmentData.length}
            loading={loading}
            tableScrolled={{ x: "max-content" }}
            columns={attachmentColumns}
            columnDefinitions={attachmentColumns.map((c) => ({
              key: c.dataIndex || c.title,
              title: c.title,
            }))}
            fixedColumns={{ right: [], left: [] }}
            setFixedColumns={() => {}}
            usePagination={false}
            useInfiniteScroll={false}
          />
        </NxBaseContainer>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced
          routes={breadcrumbRoutes({ idAccount, idCustomer, type, idSA })}
        />
        <div className="flex flex-col w-full gap-4">
          <HeaderDetail
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          />
        </div>

        <NxCardContainer header="DETAIL INFORMATION" className="mt-4">
          <Tabs items={tabItems} />
        </NxCardContainer>

        {/* Action button */}
        <NxBaseContainer border className="mt-4">
          <ButtonComponent type="menu" onClick={() => navigate(-1)}>
            Back
          </ButtonComponent>
        </NxBaseContainer>
      </Spin>
    </div>
  );
};

export default DetailWarrantyTerm;
