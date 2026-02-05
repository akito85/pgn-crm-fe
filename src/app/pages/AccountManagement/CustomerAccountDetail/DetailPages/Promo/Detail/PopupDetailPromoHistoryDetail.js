import DetailPopupLayout from "../components/DetailPopupLayout";
import moment from "moment";
import HistoryLogInformation from "../HistoryLogInformation";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

const PopupDetailPromoHistoryDetail = ({ open, onClose, data }) => {
  const getDetailInfo = () => [
    { label: "Billing Date", value: formatDate(data?.billingDate) },
    { label: "Name", value: data?.name || "-" },
    { label: "Promotion Type", value: data?.promotionType || "-" },
    { label: "Type", value: data?.type || "-" },
    { label: "Category", value: data?.category || "-" },
    { label: "Criteria", value: data?.criteria || "-" },
    { label: "Description", value: data?.description || "-" },
  ];

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
      showMainHeader={false}
      mainInfo={getDetailInfo()}
    >
      <HistoryLogInformation data={data} />
    </DetailPopupLayout>
  );
};

export default PopupDetailPromoHistoryDetail;
