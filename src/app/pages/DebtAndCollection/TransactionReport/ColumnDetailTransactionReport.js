
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import { message } from "antd";


export const columnsDetail = (navigate) => [
  { title: "Account Num", dataIndex: "accountNum", key: "accountNum" },
  { title: "Account Name", dataIndex: "accountName", key: "accountName" },
  { title: "Segment", dataIndex: "segment", key: "segment" },
  { title: "Area (SOR)", dataIndex: "sor", key: "sor" },
  { title: "Invoice Num", dataIndex: "invoiceNum", key: "invoiceNum" },
  { title: "Bill Period", dataIndex: "billPeriod", key: "billPeriod" },
  {
    title: "Total Bill",
    dataIndex: "totalBill",
    key: "totalBill",
    render: (value) => value?.toLocaleString("id-ID"),
  },
  { title: "AR Age (v46M)", dataIndex: "v46M", key: "v46M" },
  {
    title: "Total Activity",
    dataIndex: "totActivity",
    key: "totActivity",
    render: (value, record) => (
      <ButtonComponent
        type="submit"
        size="small"
        fontSizeClassname="text-[12px]"
        onClick={() => {
          if (!value || value === 0) {
            message.warning("Maaf, data tidak ada");
            return;
          }

          navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES, {
            state: { accountNum: record.accountNum },
          });
        }}
      >
        {value}
      </ButtonComponent>
    ),
  }
];