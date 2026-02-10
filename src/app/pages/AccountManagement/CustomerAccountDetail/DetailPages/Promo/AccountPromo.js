import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Space } from "antd";
import moment from "moment";

import CardContainer from "../../../../../../components/CardContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";

import PromoViewData from "./components/PromoViewData";
import PromoHistoryViewData from "./components/PromoHistoryViewData";
import ModalCustomPromo from "./components/ModalCustomPromo";
import CriteriaAndCondition from "./CriteriaAndCondition";
import HistoryLogInformation from "./HistoryLogInformation";

const RenderLabelValue = ({ label, value }) => (
  <Space direction="vertical" size="small">
    <strong style={{ color: "#000", fontSize: "14px" }}>{label}</strong>
    <span style={{ color: "#000", fontSize: "14px" }}>{value || "-"}</span>
  </Space>
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).format("DD MMM YYYY");
};

// Header Component
const HeaderWithDownload = ({ selectedTab, onDownload }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    }}
  >
    <span
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "#1570EF",
      }}
    >
      {selectedTab === "promo" ? "PROMO LIST" : "PROMO HISTORY"}
    </span>

    <ButtonComponent
      icon={<SVGIcon name="IconButtonDownload" width={20} />}
      type="submit"
      onClick={onDownload}
    >
      Download List
    </ButtonComponent>
  </div>
);

// Tabs Component
const PromoTabs = ({ selectedTab, onChangeTab }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #EAECF0",
    }}
  >
    <div style={{ display: "flex", gap: 24 }}>
      <div
        onClick={() => onChangeTab("promo")}
        style={{
          paddingBottom: 8,
          fontWeight: 600,
          cursor: "pointer",
          color: selectedTab === "promo" ? "#1570EF" : "#667085",
          borderBottom:
            selectedTab === "promo"
              ? "2px solid #1570EF"
              : "2px solid transparent",
        }}
      >
        Promo
      </div>

      <div
        onClick={() => onChangeTab("promoHistory")}
        style={{
          paddingBottom: 8,
          fontWeight: 600,
          cursor: "pointer",
          color: selectedTab === "promoHistory" ? "#1570EF" : "#667085",
          borderBottom:
            selectedTab === "promoHistory"
              ? "2px solid #1570EF"
              : "2px solid transparent",
        }}
      >
        Promo History
      </div>
    </div>
  </div>
);

// Main Component
const AccountPromo = ({ id }) => {
  const location = useLocation();
  const { idCustomer } = location.state || {};

  // State untuk tab utama
  const [selectedTab, setSelectedTab] = useState("promo");

  // State untuk Promo (tab pertama)
  const [isModalPromoVisible, setIsModalPromoVisible] = useState(false);
  const [detailPromoData, setDetailPromoData] = useState({});
  const [selectedTabCriteriaAndCondition, setSelectedTabCriteriaAndCondition] =
    useState("criteria");

  // State untuk Promo History (tab kedua)
  const [isModalHistoryVisible, setIsModalHistoryVisible] = useState(false);
  const [isModalHistoryDetailVisible, setIsModalHistoryDetailVisible] =
    useState(false);
  const [detailHistoryData, setDetailHistoryData] = useState({});
  const [detailDetailHistoryData, setDetailDetailHistoryData] = useState({});
  const [popupDetailHistoryVisible, setPopupDetailHistoryVisible] =
    useState(false);
  const [popupDetailHistoryDetailVisible, setPopupDetailHistoryDetailVisible] =
    useState(false);
  const [selectedHistoryData, setSelectedHistoryData] = useState({});
  const [selectedHistoryDetailData, setSelectedHistoryDetailData] = useState(
    {},
  );

  // Handler untuk tab switching
  const onChangeTab = (tab) => {
    setSelectedTab(tab);
  };

  // Handler untuk download
  const downloadRef = useRef(null);
  const handleDownload = () => {
    if (!downloadRef.current) {
      console.warn("Download handler not registered yet");
      return;
    }
    downloadRef.current();
  };

  return (
    <CardContainer
      header={
        <HeaderWithDownload
          selectedTab={selectedTab}
          onDownload={handleDownload}
        />
      }
      type="tabs"
      element={
        <PromoTabs selectedTab={selectedTab} onChangeTab={onChangeTab} />
      }
    >
      <div style={{ marginTop: -16, paddingTop: 0 }}>
        {selectedTab === "promo" ? (
          <PromoViewData
            isModalPromoVisible={isModalPromoVisible}
            setIsModalPromoVisible={setIsModalPromoVisible}
            setDetailPromoData={setDetailPromoData}
            customerId={idCustomer}
            accountId={id}
            onRegisterDownload={(handler) => (downloadRef.current = handler)}
          />
        ) : (
          <PromoHistoryViewData
            isModalHistoryVisible={isModalHistoryVisible}
            isModalHistoryDetailVisible={isModalHistoryDetailVisible}
            setIsModalHistoryVisible={setIsModalHistoryVisible}
            setIsModalHistoryDetailVisible={setIsModalHistoryDetailVisible}
            setDetailHistoryData={setDetailHistoryData}
            setDetailDetailHistoryData={setDetailDetailHistoryData}
            customerId={idCustomer}
            accountId={id}
            onRegisterDownload={(handler) => (downloadRef.current = handler)}
            popupDetailHistoryVisible={popupDetailHistoryVisible}
            setPopupDetailHistoryVisible={setPopupDetailHistoryVisible}
            popupDetailHistoryDetailVisible={popupDetailHistoryDetailVisible}
            setPopupDetailHistoryDetailVisible={
              setPopupDetailHistoryDetailVisible
            }
            selectedHistoryData={selectedHistoryData}
            setSelectedHistoryData={setSelectedHistoryData}
            selectedHistoryDetailData={selectedHistoryDetailData}
            setSelectedHistoryDetailData={setSelectedHistoryDetailData}
          />
        )}
      </div>

      {/* Modal untuk Detail Promo (hanya muncul di tab Promo) */}
      {selectedTab === "promo" && isModalPromoVisible && (
        <ModalCustomPromo
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
                DETAIL PROMO
              </span>
            </div>
          }
          isOpen={isModalPromoVisible}
          setIsOpen={setIsModalPromoVisible}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {/* PROMO INFORMATION */}
            <div
              style={{
                borderRadius: "8px",
                backgroundColor: "#F9FAFB",
                border: "1px solid #EAECF0",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #EAECF0",
                  color: "#0075bf",
                  fontWeight: 700,
                }}
              >
                PROMO INFORMATION
              </div>
              <div
                style={{
                  border: "1px solid #E4E7EC",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  margin: "16px",
                }}
              >
                <Row gutter={[24, 16]}>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Name"
                      value={detailPromoData?.name}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Promotion Type"
                      value={detailPromoData?.promotionTypeName}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Type"
                      value={detailPromoData?.typeName}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Category"
                      value={detailPromoData?.categoryName}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Criteria"
                      value={detailPromoData?.criterias}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="Start Date"
                      value={formatDate(detailPromoData?.startDate)}
                    />
                  </Col>
                  <Col span={8}>
                    <RenderLabelValue
                      label="End Date"
                      value={formatDate(detailPromoData?.endDate)}
                    />
                  </Col>
                  <Col span={24}>
                    <RenderLabelValue
                      label="Description"
                      value={detailPromoData?.description}
                    />
                  </Col>
                </Row>
              </div>
            </div>

            {/* CRITERIA & CONDITION INFORMATION */}
            <div
              style={{
                borderRadius: "8px",
                backgroundColor: "#F9FAFB",
                border: "1px solid #EAECF0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #EAECF0",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1570EF",
                    textTransform: "uppercase",
                  }}
                >
                  CRITERIA & CONDITION INFORMATION
                </span>

                <ButtonComponent
                  icon={<SVGIcon name="IconButtonDownload" width={18} />}
                  type="submit"
                  onClick={handleDownload}
                >
                  Download List
                </ButtonComponent>
              </div>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <CriteriaAndCondition
                  isVisible={isModalPromoVisible}
                  setIsVisible={setIsModalPromoVisible}
                  selectedTab={selectedTabCriteriaAndCondition}
                  setSelectedTab={setSelectedTabCriteriaAndCondition}
                  promoId={detailPromoData?.id}
                  onRegisterDownload={(handler) =>
                    (downloadRef.current = handler)
                  }
                />
              </div>
            </div>

            <HistoryLogInformation data={detailPromoData} />
          </Space>
        </ModalCustomPromo>
      )}
    </CardContainer>
  );
};

export default AccountPromo;
