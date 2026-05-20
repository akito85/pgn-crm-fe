import { UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import moment from "moment";
import promoRepository from "./promoRepository";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

/* =======================
 * API Operations
 * ======================= */

const promoHistoryRepository = {
  getPromoHistoryList: async (params, advancedSearch = {}) => {
    return await promoRepository.getListPromoHistory(params, advancedSearch);
  },

  getPromoHistoryDetail: async (billingCode, accountId) => {
    return await promoRepository.getDetailPromoHistoryById(
      billingCode,
      accountId,
    );
  },

  getPromoHistoryDetailDetail: async (billingCode, detailId, accountId) => {
    return await promoRepository.getDetailDetailPromoHistoryById(
      billingCode,
      detailId,
      accountId,
    );
  },

  downloadPromoHistory: async (params, advancedSearch = {}) => {
    return await promoRepository.downloadListPromoHistory(
      params,
      advancedSearch,
    );
  },

  getParentColumns: (onOpenParentDetail) => [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "BILLING NO",
      dataIndex: "billingCode",
      key: "billingCode",
      width: 180,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 150,
    },
    {
      title: "BILLING CYCLE",
      dataIndex: "billingCycle",
      key: "billingCycle",
      width: 150,
    },
    {
      title: "PROMO APPLIED",
      dataIndex: "promoApplied",
      key: "promoApplied",
      width: 140,
      align: "center",
    },
    {
      title: "ACTION",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => {
        const hasDetails =
          Array.isArray(record.details) && record.details.length > 0;

        return hasDetails ? (
          <UnorderedListOutlined
            style={{
              fontSize: 16,
              color: "#1570EF",
              cursor: "pointer",
            }}
            onClick={() => onOpenParentDetail(record)}
            title="View Details"
          />
        ) : (
          <span style={{ color: "#98A2B3", fontSize: 12 }}>No Details</span>
        );
      },
    },
  ],

  getChildColumns: (onOpenChildDetail) => [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "BILLING DATE",
      dataIndex: "billingDate",
      key: "billingDate",
      width: 130,
      render: formatDate,
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 140,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "PROMOTION TYPE",
      dataIndex: "promotionType",
      key: "promotionType",
      width: 160,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 160,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      width: 140,
    },
    {
      title: "CRITERIA",
      dataIndex: "criteria",
      key: "criteria",
      width: 200,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 260,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <UnorderedListOutlined
          style={{
            fontSize: 16,
            color: "#1570EF",
            cursor: "pointer",
          }}
          onClick={() => onOpenChildDetail(record)}
          title="View Detail"
        />
      ),
    },
  ],

  prepareDownloadParams: (params, activeFilters = []) => {
    const downloadParams = {
      ...params,
      page: 1,
      size: 10000,
    };

    if (activeFilters.length > 0) {
      downloadParams.advancedSearch = {
        inputFields: activeFilters.map((filter) => ({
          condition: filter.condition || "",
          column: filter.column || "",
          operator: filter.operator || "",
          value: filter.value || "",
        })),
      };
    }

    return downloadParams;
  },

  getMockPromoHistoryList: () => {
    return Array.from({ length: 25 }).map((_, index) => {
      const createdDate = new Date(2026, 0, 30, 8, 55 + index).toISOString();
      const updatedDate = new Date(2026, 0, 30, 9, 10 + index).toISOString();

      const initialDetails = Array.from({ length: 5 }).map((_, i) => ({
        key: `mock-${index + 1}-${i + 1}`,
        billingDate: "2025-10-01",
        name: `PRM${(1000 + i).toString().padStart(4, "0")}`,
        promotionType: i % 2 === 0 ? "Promo" : "Discount",
        type:
          i % 3 === 0 ? "RATING" : i % 3 === 1 ? "BILLING" : "RATING & BILLING",
        category: i > 4 ? "BLAST" : "SPECIFIED",
        criteria: i === 4 ? "All" : "Account Group Type, Customer Segment",
        description: "Initial loaded detail",
        detailId: `detail-${i}`,
        promoId: `promo-${i}`,
        createdDate,
        createdBy: "System",
        updatedDate,
        updatedBy: "System",
      }));

      return {
        key: `mock-${index + 1}`,
        billingCode: `INV-2025-${(10000 + index).toString().padStart(5, "0")}`,
        billingPeriod: "Okt 2025",
        billingCycle: "25-25",
        promoApplied: 25,
        createdDate,
        createdBy: "System",
        updatedDate,
        updatedBy: "System",
        details: initialDetails,
        no: index + 1,
      };
    });
  },
};

export default promoHistoryRepository;
