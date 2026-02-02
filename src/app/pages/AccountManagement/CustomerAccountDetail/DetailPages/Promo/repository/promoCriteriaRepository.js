import { UnorderedListOutlined } from "@ant-design/icons";
import { Col, Tooltip } from "antd";
import moment from "moment";
import promoRepository from "./promoRepository";
import * as XLSX from "xlsx";
const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

/* =======================
 * Repository
 * ======================= */
const promoCriteriaRepository = {
  downloadMockExcel: (dataSource = []) => {
    if (!dataSource.length) {
      console.warn("No mock criteria data to download");
      return;
    }

    const excelData = dataSource.map((item, index) => ({
      NO: index + 1,
      UOM: item.uom || "-",
      "ADJUSTMENT TYPE": item.adjustmentType || "-",
      "ADJUSTMENT VALUE": item.adjustmentValue || "-",
      "MAX VALUE UOM": item.maxValueUom || "-",
      "SERVICE TYPE": item.serviceType || "-",
      "CUSTOMER SEGMENT": item.customerSegment || "-",
      "ACCOUNT GROUP": item.accountGroup || "-",
      TIERING: item.tiering ? "Yes" : "No",
      "FROM ITEM": item.fromItem || "-",
      "START DATE": formatDate(item.startDate),
      "END DATE": formatDate(item.endDate),
      DESCRIPTION: item.description || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Promo Criteria");

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const fileName = `PROMO_CRITERIA_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  },
  /* =======================
   * API Operations
   * ======================= */
  getPromoCriteriaList: async (params, advancedSearch = {}) => {
    return await promoRepository.getListValidPromoCriteriaByPromoId(
      params,
      advancedSearch,
    );
  },

  getPromoCriteriaDetail: async (criteriaId) => {
    return await promoRepository.getDetailValidPromoCriteria(criteriaId);
  },

  downloadPromoCriteria: async (params, advancedSearch = {}) => {
    return await promoRepository.downloadListValidPromoCriteria(
      params,
      advancedSearch,
    );
  },

  /* =======================
   * Columns Definition
   * ======================= */
  getColumns: (handleClickDetail) => [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 120,
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      key: "customerSegment",
      width: 150,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "ADJUSTMENT TYPE",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
      width: 150,
    },
    {
      title: "ADJUSTMENT VALUE",
      dataIndex: "adjustmentValue",
      key: "adjustmentValue",
      width: 120,
      align: "right",
      render: (value, record) => (
        <span>
          {value} {record.uom ? `(${record.uom})` : ""}
        </span>
      ),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
      width: 80,
      align: "center",
    },
    {
      title: "MAX VALUE UOM",
      dataIndex: "maxValueUom",
      key: "maxValueUom",
      width: 120,
      align: "center",
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItem",
      key: "fromItem",
      width: 120,
    },
    {
      title: "TIERING",
      dataIndex: "tiering",
      key: "tiering",
      width: 100,
      render: (value) => {
        if (
          value === true ||
          value === "true" ||
          value === 1 ||
          value === "1"
        ) {
          return <span style={{ color: "#52C41A" }}>Yes</span>;
        }
        return <span style={{ color: "#FF4D4F" }}>No</span>;
      },
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: formatDate,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: formatDate,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Col span={24} className="text-center">
          <UnorderedListOutlined
            style={{
              cursor: "pointer",
              color: "#1570EF",
              fontSize: 16,
            }}
            onClick={() => handleClickDetail(record, "criteria")}
            title="View Detail"
          />
        </Col>
      ),
    },
  ],

  /* =======================
   * Mock Data
   * ======================= */
  getMockCriteriaData: () => {
    return Array.from({ length: 10 }).map((_, index) => ({
      key: `mock-criteria-${index + 1}`,
      no: index + 1,
      id: index + 200,
      criteriaId: index + 200,
      serviceType: ["Internet", "SMS", "Voice", "Data"][index % 4],
      customerSegment: ["Retail", "Corporate", "Premium", "VIP"][index % 4],
      adjustmentType: ["Discount", "Bonus", "Cashback", "Free"][index % 4],
      adjustmentValue: ["50", "100", "25", "10"][index % 4],
      uom: ["%", "SMS", "Minutes", "GB"][index % 4],
      maxValueUom: "100",
      fromItem: "Service Item " + (index + 1),
      tiering: index % 3 === 0,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      description: `This is criteria ${index + 1} description`,
      accountGroup: "Group " + (index + 1),
      createdBy: "Admin",
      createdDate: "2023-12-01 10:00:00",
      updatedBy: "System",
      updatedDate: "2024-01-15 14:30:00",
    }));
  },
};

export default promoCriteriaRepository;
