import { UnorderedListOutlined } from "@ant-design/icons";
import { Col, Tooltip } from "antd";
import moment from "moment";
import promoRepository from "./promoRepository";
import * as XLSX from "xlsx";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");

export const transformPromoConditionList = (responseData) => {
  if (!responseData?.data) return [];

  return responseData.data.map((item, index) => ({
    key: item.id || item.conditionId || `condition-${index}`,
    no: index + 1,
    id: item.id || item.conditionId,
    conditionId: item.conditionId || item.id,
    name: item.name || item.conditionName || "-",
    operator: item.operator || "-",
    dataType: item.dataType || "-",
    value: item.value || item.conditionValue || "-",
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status || "-",
    description: item.description || "-",
    createdBy: item.createdBy,
    createdDate: item.createdDate,
    updatedBy: item.updatedBy,
    updatedDate: item.updatedDate,
    _original: item,
  }));
};

export const transformPromoConditionDetail = (responseData) => {
  if (!responseData?.data) return null;

  const data = responseData.data;
  return {
    key: data.id || data.conditionId,
    id: data.id || data.conditionId,
    conditionId: data.conditionId || data.id,
    name: data.name || data.conditionName,
    operator: data.operator,
    dataType: data.dataType,
    value: data.value || data.conditionValue,
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description,
    createdBy: data.createdBy,
    createdDate: data.createdDate,
    updatedBy: data.updatedBy,
    updatedDate: data.updatedDate,
  };
};

const promoConditionRepository = {
  downloadMockExcel: (dataSource = []) => {
    if (!dataSource.length) {
      console.warn("No mock condition data to download");
      return;
    }
    const excelData = dataSource.map((item, index) => ({
      NO: index + 1,
      NAME: item.name || "-",
      OPERATOR: item.operator || "-",
      "DATA TYPE": item.dataType || "-",
      "ADJUSTMENT VALUE": item.value || "-",
      "START DATE": formatDate(item.startDate),
      "END DATE": formatDate(item.endDate),
      STATUS: item.status || "-",
      DESCRIPTION: item.description || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Promo Condition");

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const fileName = `PROMO_CONDITION_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  },
  /* =======================
   * API Operations
   * ======================= */

  getPromoConditionList: async (params, advancedSearch = {}) => {
    return await promoRepository.getListValidPromoConditionByPromoId(
      params,
      advancedSearch,
    );
  },

  getPromoConditionDetail: async (conditionId) => {
    return await promoRepository.getDetailValidPromoCondition(conditionId);
  },

  downloadPromoCondition: async (params, advancedSearch = {}) => {
    return await promoRepository.downloadListValidPromoCondition(
      params,
      advancedSearch,
    );
  },

  transformPromoConditionList,
  transformPromoConditionDetail,

  getColumns: (handleClickDetail) => [
    {
      title: "NO",
      dataIndex: "no",
      key: "no", // Pastikan key unik
      width: 60,
      align: "center",
      render: (text, record, index) => index + 1,
      order: 1,
      fixed: "left", // Tetapkan sebagai fixed column jika perlu
    },
    {
      title: "CONDITION NAME",
      dataIndex: "name",
      key: "name", // Pastikan key unik
      width: 180,
      order: 2,
    },
    {
      title: "OPERATOR",
      dataIndex: "operator",
      key: "operator", // Pastikan key unik
      width: 100,
      align: "center",
      order: 3,
    },
    {
      title: "DATA TYPE",
      dataIndex: "dataType",
      key: "dataType", // Pastikan key unik
      width: 120,
      order: 4,
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value", // Pastikan key unik
      width: 150,
      order: 5,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status", // Pastikan key unik
      width: 120,
      align: "center",
      order: 6,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate", // Pastikan key unik
      width: 120,
      render: formatDate,
      order: 7,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate", // Pastikan key unik
      width: 120,
      render: formatDate,
      order: 8,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description", // Pastikan key unik
      width: 260,
      order: 9,
    },
    {
      title: "ACTION",
      key: "action",
      width: 90,
      align: "center",
      order: 10,
      fixed: "right", // Tetapkan sebagai fixed column
      render: (_, record) => (
        <UnorderedListOutlined
          style={{ fontSize: 16, color: "#1570EF", cursor: "pointer" }}
          onClick={() => handleClickDetail(record)}
        />
      ),
    },
  ],

  getMockConditionData: () => {
    return Array.from({ length: 10 }).map((_, index) => ({
      key: `mock-condition-${index + 1}`,
      no: index + 1,
      id: index + 100,
      conditionId: index + 100,
      name: `Condition ${index + 1}`,
      operator: index % 2 === 0 ? ">" : "<=",
      dataType: ["NUMBER", "STRING", "DATE", "BOOLEAN"][index % 4],
      value: ["10", "20", "50", "100"][index % 4],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: index % 2 === 0 ? "ACTIVE" : "INACTIVE",
      description: `This is condition ${index + 1} description`,
      createdBy: "Admin",
      createdDate: "2023-12-01 10:00:00",
      updatedBy: "System",
      updatedDate: "2024-01-15 14:30:00",
    }));
  },
};

export default promoConditionRepository;
