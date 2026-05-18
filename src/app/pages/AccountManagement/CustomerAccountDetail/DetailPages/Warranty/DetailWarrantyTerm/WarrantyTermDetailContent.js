import { useEffect, useState } from "react";
import { Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import HeaderDetail from "../../../HeaderDetail";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxTable from "../../../../../../../components/Nx/NxTable";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

import { getDetailWarrantyTerm } from "../../../../../../../redux/slices/account_management/detailAccount/warrantySlice";
import { dateFormatting } from "../../../../../../../utils";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import NxTabs from "../../../../../../../components/Nx/NxTabs";

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

const WarrantyTermDetailContent = ({
  id,
  idSA,
  idAccount,
  idCustomer,
  type,
  showHeaderDetail = false,
  showBackButton = false,
  onBack = () => {},
}) => {
  const dispatch = useDispatch();
  const [activeTabKey, setActiveTabKey] = useState("warrantyInformation");

  const { dataDetail, loading } = useSelector((state) => state.saWarranty);

  useEffect(() => {
    if (id) dispatch(getDetailWarrantyTerm(id));
  }, [dispatch, id]);

  const attachmentData = (dataDetail?.mattachments || []).map((item, index) => ({
    key: index + 1,
    category: item.fileCategoryName || item.categoryName || "-",
    fileName: item.fileName || "-",
    uploadBy: item.createdBy || "-",
    uploadDate: item.createdDate
      ? moment(item.createdDate).format("DD MMM YYYY HH:mm:ss")
      : "-",
    fileSize: item.fileSize || 0,
  }));

  const detailContainerKey = `${idSA || ""}-${id || ""}`;

  const tabItems = [
    {
      key: "warrantyInformation",
      label: "Warranty Information",
      children: (
        <NxBaseContainer border header="WARRANTY TERM INFORMATION">
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label="Document Number">
              {dataDetail?.documentNumber || "-"}
            </NxDetailText>
            <NxDetailText label="Document Date">
              {dataDetail?.documentDate
                ? moment(dataDetail.documentDate).format(dateFormatting.date)
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
          </div>
          <div className="w-full grid grid-cols-1 gap-4">
            <NxDetailText label="Description" className="col-span-3">
              {dataDetail?.description || "-"}
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
            columnDefinitions={attachmentColumns.map((column) => ({
              key: column.dataIndex || column.title,
              title: column.title,
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
    <Spin spinning={loading}>
      <div key={detailContainerKey} className="flex flex-col w-full gap-4">
        {showHeaderDetail && (
          <HeaderDetail
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          />
        )}

        <NxTabs
          key={detailContainerKey}
          items={tabItems}
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
        />

        {showBackButton && (
          <NxBaseContainer border>
            <div className="flex justify-between">
              <ButtonComponent type="menu" onClick={onBack}>
                Back
              </ButtonComponent>
            </div>
          </NxBaseContainer>
        )}
      </div>
    </Spin>
  );
};

export default WarrantyTermDetailContent;
