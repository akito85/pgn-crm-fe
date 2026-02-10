import DetailPopupLayout from "../components/DetailPopupLayout";
import moment from "moment";
import HistoryLogInformation from "../HistoryLogInformation";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

const PopupDetailCondition = ({ open, onClose, data }) => {
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
            DETAIL CONDITION
          </span>
        </div>
      }
      mainTitle="CONDITION INFORMATION"
      mainInfo={[
        { label: "Name", value: data?.name || "-" },
        { label: "Operator", value: data?.operator || "-" },
        { label: "Data Type", value: data?.dataType || "-" },
        { label: "Value", value: data?.value || "-" },
        { label: "Start Date", value: formatDate(data?.startDate) },
        { label: "End Date", value: formatDate(data?.endDate) },
        { label: "Description", value: data?.description || "-" },
      ]}
    >
      {/* HISTORY LOG */}
      <HistoryLogInformation data={data} />
    </DetailPopupLayout>
  );
};

export default PopupDetailCondition;
