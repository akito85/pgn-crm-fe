import { UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import moment from "moment";
import promoRepository from "./promoRepository";
import * as XLSX from "xlsx";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");
const formatDateTime = (date) => (date ? moment(date).format("DD MMM YYYY HH:mm") : "-");

export const transformPromoCriteriaList = (responseData) => {
  if (!responseData?.data?.result) return [];

  return responseData.data.result.map((item, index) => ({
    key: item.id || item.criteriaId || `criteria-${index}`,
    no: index + 1,
    id: item.id || item.criteriaId,
    criteriaId: item.criteriaId || item.id,
    uom: item.uom || item.unitOfMeasure || "-",
    adjustmentType: item.adjustmentType || "-",
    adjustmentValue: item.adjustmentValue || "-",
    maxValueUom: item.maxValueUom || item.maxValueUnit || "-",
    serviceType: item.serviceType || "-",
    customerSegment: item.customerSegment || "-",
    accountGroup: item.accountGroup || "-",
    tiering: item.tiering || false,
    fromItem: item.fromItem || "-",
    startDate: item.startDate || item.startDateTime,
    endDate: item.endDate || item.endDateTime,
    description: item.description || "-",
    createdBy: item.createdBy,
    createdDate: item.createdDate || item.createdAt,
    updatedBy: item.updatedBy,
    updatedDate: item.updatedDate || item.updatedAt,
    _original: item,
  }));
};

export const transformPromoCriteriaDetail = (responseData) => {
  if (!responseData?.data) return null;

  const data = responseData.data;
  return {
    key: data.id || data.criteriaId,
    id: data.id || data.criteriaId,
    criteriaId: data.criteriaId || data.id,
    uom: data.uom || data.unitOfMeasure,
    adjustmentType: data.adjustmentType,
    adjustmentValue: data.adjustmentValue,
    maxValueUom: data.maxValueUom || data.maxValueUnit,
    serviceType: data.serviceType,
    customerSegment: data.customerSegment,
    accountGroup: data.accountGroup,
    tiering: data.tiering || false,
    fromItem: data.fromItem,
    startDate: data.startDate || data.startDateTime,
    endDate: data.endDate || data.endDateTime,
    description: data.description,
    createdBy: data.createdBy,
    createdDate: data.createdDate || data.createdAt,
    updatedBy: data.updatedBy,
    updatedDate: data.updatedDate || data.updatedAt,
  };
};

const promoCriteriaRepository = {
  downloadMockExcel: (dataSource = []) => {
    if (!dataSource.length) {
      console.warn("No mock criteria data to download");
      return;
    }

    const excelData = dataSource.map((item, index) => ({
      NO: index + 1,
      "SERVICE TYPE": item.serviceType || "-",
      "CUSTOMER SEGMENT": item.customerSegment || "-",
      "ADJUSTMENT TYPE": item.adjustmentType || "-",
      "ADJUSTMENT VALUE": item.adjustmentValue || "-",
      UOM: item.uom || "-",
      "MAX VALUE UOM": item.maxValueUom || "-",
      "FROM ITEM": item.fromItem || "-",
      TIERING: item.tiering ? "Yes" : "No",
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
    try {
      const response = await promoRepository.getListValidPromoCriteriaByPromoId(
        params,
        advancedSearch,
      );
      
      // Transform data untuk konsistensi
      const transformedData = transformPromoCriteriaList(response);
      
      // Return dalam format yang diharapkan oleh komponen
      return {
        data: transformedData,
        total: response?.data?.page?.totalElements || transformedData.length,
        page: response?.data?.page?.number || 1,
        size: response?.data?.page?.size || transformedData.length,
      };
    } catch (error) {
      console.error("Error fetching promo criteria list:", error);
      throw error;
    }
  },

  getPromoCriteriaDetail: async (criteriaId) => {
    try {
      const response = await promoRepository.getDetailValidPromoCriteria(criteriaId);
      const transformedData = transformPromoCriteriaDetail(response);
      
      return {
        data: transformedData,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching promo criteria detail:", error);
      throw error;
    }
  },

  downloadPromoCriteria: async (promoId, advancedSearch = {}) => {
    try {
      const params = {
        promoId,
        page: 1,
        size: 10000, // Untuk download ambil semua data
      };

      const response = await promoRepository.downloadListValidPromoCriteria(
        params,
        advancedSearch,
      );
      
      // Jika response adalah blob (file Excel), return langsung
      if (response instanceof Blob) {
        return response;
      }
      
      // Jika response adalah data JSON, buat Excel secara manual
      const data = transformPromoCriteriaList(response);
      
      const excelData = data.map((item, index) => ({
        NO: index + 1,
        "SERVICE TYPE": item.serviceType || "-",
        "CUSTOMER SEGMENT": item.customerSegment || "-",
        "ADJUSTMENT TYPE": item.adjustmentType || "-",
        "ADJUSTMENT VALUE": item.adjustmentValue || "-",
        UOM: item.uom || "-",
        "MAX VALUE UOM": item.maxValueUom || "-",
        "FROM ITEM": item.fromItem || "-",
        TIERING: item.tiering ? "Yes" : "No",
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
      
      return { success: true };
    } catch (error) {
      console.error("Error downloading promo criteria:", error);
      throw error;
    }
  },

  transformPromoCriteriaList,
  transformPromoCriteriaDetail,

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
      order: 1,
      fixed: "left",
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 120,
      order: 2,
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
      order: 3,
    },
    {
      title: "ADJUSTMENT TYPE",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
      width: 150,
      order: 4,
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
      order: 5,
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
      width: 80,
      align: "center",
      order: 6,
    },
    {
      title: "MAX VALUE UOM",
      dataIndex: "maxValueUom",
      key: "maxValueUom",
      width: 120,
      align: "center",
      order: 7,
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItem",
      key: "fromItem",
      width: 120,
      order: 8,
    },
    {
      title: "TIERING",
      dataIndex: "tiering",
      key: "tiering",
      width: 100,
      render: (value) => {
        if (value === true || value === "true" || value === 1 || value === "1") {
          return <span style={{ color: "#52C41A" }}>Yes</span>;
        }
        return <span style={{ color: "#FF4D4F" }}>No</span>;
      },
      order: 9,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: formatDate,
      order: 10,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: formatDate,
      order: 11,
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
      order: 12,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      order: 13,
      fixed: "right",
      render: (_, record) => (
        <UnorderedListOutlined
          style={{
            cursor: "pointer",
            color: "#1570EF",
            fontSize: 16,
          }}
          onClick={() => handleClickDetail(record)}
          title="View Detail"
        />
      ),
    },
  ],

  /* =======================
   * Mock Data
   * ======================= */
  getMockCriteriaData: () => {
    return Array.from({ length: 30 }).map((_, index) => ({
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