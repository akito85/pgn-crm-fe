import DetailPopupLayout from "../components/DetailPopupLayout";
import HistoryLogInformation from "../HistoryLogInformation";

const PopupDetailPromoHistory = ({
  open,
  onClose,
  data,
  onOpenChildDetail,
}) => {
  const getParentInfo = () => [
    { label: "Billing No", value: data?.billingCode || "-" },
    { label: "Billing Period", value: data?.billingPeriod || "-" },
    { label: "Billing Cycle", value: data?.billingCycle || "-" },
    { label: "Promo Applied", value: data?.promoApplied || 0 },
  ];

  const childTableData = data?.details || [];

  return (
    <DetailPopupLayout
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#12B76A",
              borderRadius: 4,
              display: "inline-block",
            }}
          />
          <span style={{ color: "#1570EF", fontWeight: 700, fontSize: 16 }}>
            DETAIL PROMO HISTORY
          </span>
        </div>
      }
      onClose={onClose}
      mainInfo={getParentInfo()}
      showMainHeader={false}
      tableTitle="Promo Details"
      tableData={childTableData}
      tableHeight={300}
    >
      <HistoryLogInformation data={data} />
    </DetailPopupLayout>
  );
};

export default PopupDetailPromoHistory;
