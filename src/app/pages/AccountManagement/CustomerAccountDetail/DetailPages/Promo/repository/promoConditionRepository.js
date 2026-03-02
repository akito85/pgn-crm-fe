import { UnorderedListOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import moment from "moment";
import promoRepository from "./promoRepository";
import * as XLSX from "xlsx";

const formatDate = (date) => (date ? moment(date).format("DD MMM YYYY") : "-");
const formatDateTime = (date) =>
  date ? moment(date).format("DD MMM YYYY HH:mm") : "-";

export const transformPromoConditionList = (responseData) => {
  if (!responseData?.data?.content) return [];

  return responseData.data.content.map((item, index) => ({
    key: item.id || item.conditionId || `condition-${index}`,
    no: index + 1,
    id: item.id || item.conditionId,
    conditionId: item.conditionId || item.id,
    name: item.name || item.conditionName || "-",
    operator: item.operator || "-",
    dataType: item.dataType || "-",
    value: item.value || item.conditionValue || "-",
    startDate: item.startDate || item.startDateTime,
    endDate: item.endDate || item.endDateTime,
    status: item.status || "-",
    description: item.description || "-",
    createdBy: item.createdBy,
    createdDate: item.createdDate || item.createdAt,
    updatedBy: item.updatedBy,
    updatedDate: item.updatedDate || item.updatedAt,
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
    startDate: data.startDate || data.startDateTime,
    endDate: data.endDate || data.endDateTime,
    status: data.status,
    description: data.description,
    createdBy: data.createdBy,
    createdDate: data.createdDate || data.createdAt,
    updatedBy: data.updatedBy,
    updatedDate: data.updatedDate || data.updatedAt,
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
      "CONDITION NAME": item.name || "-",
      OPERATOR: item.operator || "-",
      "DATA TYPE": item.dataType || "-",
      VALUE: item.value || "-",
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
    try {
      const response =
        await promoRepository.getListValidPromoConditionByPromoId(
          params,
          advancedSearch,
        );

      // Transform data untuk konsistensi
      const transformedData = transformPromoConditionList(response);

      // Return dalam format yang diharapkan oleh komponen
      return {
        data: transformedData,
        total: response?.data?.totalElements || transformedData.length,
        page: response?.data?.number || 1,
        size: response?.data?.size || transformedData.length,
      };
    } catch (error) {
      console.error("Error fetching promo condition list:", error);
      throw error;
    }
  },

  getPromoConditionDetail: async (conditionId) => {
    try {
      const response =
        await promoRepository.getDetailValidPromoCondition(conditionId);
      const transformedData = transformPromoConditionDetail(response);

      return {
        data: transformedData,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching promo condition detail:", error);
      throw error;
    }
  },

  downloadPromoCondition: async (promoId, advancedSearch = {}) => {
    try {
      const params = {
        promoId,
        page: 1,
        size: 10000, // Untuk download ambil semua data
      };

      const response = await promoRepository.downloadListValidPromoCondition(
        params,
        advancedSearch,
      );

      // Jika response adalah blob (file Excel), return langsung
      if (response instanceof Blob) {
        return response;
      }

      // Jika response adalah data JSON, buat Excel secara manual
      const data = transformPromoConditionList(response);

      const excelData = data.map((item, index) => ({
        NO: index + 1,
        "CONDITION NAME": item.name || "-",
        OPERATOR: item.operator || "-",
        "DATA TYPE": item.dataType || "-",
        VALUE: item.value || "-",
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

      return { success: true };
    } catch (error) {
      console.error("Error downloading promo condition:", error);
      throw error;
    }
  },

  transformPromoConditionList,
  transformPromoConditionDetail,

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
      title: "CONDITION NAME",
      dataIndex: "name",
      key: "name",
      width: 180,
      order: 2,
    },
    {
      title: "OPERATOR",
      dataIndex: "operator",
      key: "operator",
      width: 100,
      align: "center",
      order: 3,
    },
    {
      title: "DATA TYPE",
      dataIndex: "dataType",
      key: "dataType",
      width: 120,
      order: 4,
    },
    {
      title: "VALUE",
      dataIndex: "value",
      key: "value",
      width: 150,
      order: 5,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      order: 6,
      render: (status) => (
        <span
          style={{
            color:
              status === "ACTIVE"
                ? "#52C41A"
                : status === "INACTIVE"
                  ? "#FF4D4F"
                  : "#666666",
            fontWeight: "500",
          }}
        >
          {status || "-"}
        </span>
      ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: formatDate,
      order: 7,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: formatDate,
      order: 8,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      width: 260,
      order: 9,
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
      width: 90,
      align: "center",
      order: 10,
      fixed: "right",
      render: (_, record) => (
        <UnorderedListOutlined
          style={{ fontSize: 16, color: "#1570EF", cursor: "pointer" }}
          onClick={() => handleClickDetail(record)}
          title="View Detail"
        />
      ),
    },
  ],

  getMockConditionData: () => {
    return Array.from({ length: 30 }).map((_, index) => ({
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
