import DetailPopupLayout from "../components/DetailPopupLayout";
import moment from "moment";
import HistoryLogInformation from "../HistoryLogInformation";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

const PopupDetailCriteria = ({ open, onClose, data }) => {
  return (
    <DetailPopupLayout
      open={open}
      onClose={onClose}
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
            DETAIL CRITERIA
          </span>
        </div>
      }
      /* ================= MAIN INFO ================= */
      mainTitle="CRITERIA INFORMATION"
      mainInfo={[
        { label: "Service Type", value: data?.serviceType || "-" },
        { label: "Customer Segment", value: data?.customerSegment || "-" },
        { label: "Account Group", value: data?.accountGroup || "-" },
        { label: "Adjustment Type", value: data?.adjustmentType || "-" },
        {
          label: "Adjustment Value",
          value: `${data?.adjustmentValue || "-"} ${
            data?.uom ? `(${data.uom})` : ""
          }`,
        },
        { label: "UOM", value: data?.uom || "-" },
        { label: "Max Value UOM", value: data?.maxValueUom || "-" },
        { label: "From Item", value: data?.fromItem || "-" },
        { label: "Tiering", value: data?.tiering ? "Yes" : "No" },
        { label: "Start Date", value: formatDate(data?.startDate) },
        { label: "End Date", value: formatDate(data?.endDate) },
        { label: "Description", value: data?.description || "-" },
      ]}

      /* ================= HISTORY ================= */
    >
      <HistoryLogInformation data={data} />
    </DetailPopupLayout>
  );
};

export default PopupDetailCriteria;
