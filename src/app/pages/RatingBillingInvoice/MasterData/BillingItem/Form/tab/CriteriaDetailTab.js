import React, { useState } from "react";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";

const CriteriaDetailTab = ({
  criteriaType = null,           // id dari form Select (bisa berupa number atau string angka)
  dataTable = [],
  onDataChange = () => {},
  data_specialGLList = [],
  data_glAccountList = [],
  data_classificationTypeList = [],
  data_accountTypeList = [],
  data_criteriaOptions = [],     // [{ id, name, code }]
  type = "create",
  isEditabled = false,
  setIsEditabled = () => {},
  startDateLock = null,
  endDateLock = null,
  setModalRequired = () => {},
  onCancelEdit = null,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleChangePage = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // ✅ Resolve criteriaType (id atau code) → criteriaCode (string)
  // criteriaType bisa berupa:
  //   - number/string angka  → id dari form Select, perlu di-resolve ke code
  //   - string non-angka     → sudah berupa code langsung (misal saat dari response)
  const resolveCriteriaCode = () => {
    if (criteriaType === null || criteriaType === undefined) return null;

    const isNumericId =
      typeof criteriaType === "number" ||
      (typeof criteriaType === "string" && !isNaN(Number(criteriaType)));

    if (isNumericId) {
      // Cari berdasarkan id
      return (
        data_criteriaOptions?.find(
          (item) => item.id === criteriaType || item.id === Number(criteriaType),
        )?.code || null
      );
    }

    // Sudah berupa code string
    return criteriaType;
  };

  const criteriaCode = resolveCriteriaCode();

  // ✅ Tentukan konfigurasi kolom berdasarkan criteriaCode
  // - "CLASSIFICATION_TYPE" → tampilkan kolom Classification Type
  // - "ACCOUNT_TYPE"        → tampilkan kolom Account Type
  // - "ALL" / null / lainnya → tidak ada kolom criteria khusus
  const getCriteriaColumnConfig = () => {
    switch (criteriaCode) {
      case "CLASSIFICATION_TYPE":
        return {
          label: "CLASSIFICATION TYPE",
          dataIndex: "criteriaValue",
          options: data_classificationTypeList.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        };
      case "ACCOUNT_TYPE":
        return {
          label: "ACCOUNT TYPE",
          dataIndex: "criteriaValue",
          options: data_accountTypeList.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        };
      default:
        // "ALL" atau belum dipilih → tidak ada kolom criteria khusus
        return null;
    }
  };

  const criteriaColConfig = getCriteriaColumnConfig();

  // Support dua kemungkinan struktur field dari API:
  // Lama: { id, account, name } | Baru: { glAccountId, glAccount, glAccountDesc }
  const glAccountOptions = data_glAccountList.map((item) => ({
    value: item.glAccountId ?? item.id,
    label: `${item.glAccount ?? item.account} - ${item.glAccountDesc ?? item.name}`,
  }));

  const specialGlOptions = data_specialGLList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Helper render nilai select: cari label dari options, fallback ke value itu sendiri
  const renderSelectValue = (value, options) => {
    if (!value && value !== 0) return "-";
    const found = options.find((o) => o.label === value || o.value === value);
    return found ? found.label : value || "-";
  };

  const columns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    // ✅ Kolom criteria hanya muncul jika criteriaCode bukan "ALL"
    ...(criteriaColConfig
      ? [
          {
            title: criteriaColConfig.label,
            dataIndex: "criteriaValue",
            inputType: "select",
            options: criteriaColConfig.options,
            required: true,
            width: 200,
            render: (value) => renderSelectValue(value, criteriaColConfig.options),
          },
        ]
      : []),
    {
      title: "GL ACCOUNT",
      dataIndex: "glAccountId",
      inputType: "select",
      required: true,
      width: 250,
      options: glAccountOptions,
      render: (value) => renderSelectValue(value, glAccountOptions),
      // ✅ Auto-fill descriptionAccount dari glAccountDesc saat GL Account dipilih
      onClick: (selectedLabel, form) => {
        if (!form) return;
        const found = data_glAccountList?.find((g) => {
          const label = `${g.glAccount ?? g.account} - ${g.glAccountDesc ?? g.name}`;
          return label === selectedLabel;
        });
        form.setFieldsValue({
          descriptionAccount: found ? (found.glAccountDesc ?? found.name ?? "") : "",
        });
      },
    },
    {
      title: "DESCRIPTION ACCOUNT",
      dataIndex: "descriptionAccount",
      inputType: "description_readonly",
      width: 220,
      render: (value) => value || "-",
    },
    {
      title: "SPECIAL GL",
      dataIndex: "specialGlId",
      inputType: "select",
      width: 180,
      options: specialGlOptions,
      render: (value) => renderSelectValue(value, specialGlOptions),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      inputType: "date",
      required: true,
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      inputType: "date",
      width: 180,
      render: (value) => value || "-",
    },
  ];

  const totalColWidth =
    60 +
    (criteriaColConfig ? 200 : 0) +
    250 +
    220 +
    180 +
    180 +
    180 +
    120; // kolom ACTIONS

  return (
    <DynamicTableInlineBilling
      header={"CRITERIA INFO"}
      tableData={dataTable}
      totalData={dataTable.length || 0}
      onDataChange={onDataChange}
      cols={columns}
      scrollTable={{ x: totalColWidth, y: 500 }}
      usePagination={true}
      useSelect={true}
      pageSize={pageSize}
      current={page}
      onChangePage={handleChangePage}
      onSizeChanger={handleChangePage}
      actionButton={["delete", "update"]}
      actionFix={true}
      isDynamicEditable={isEditabled}
      setInserted={setIsEditabled}
      handleValidateUpdate={() => true}
      startDateLock={startDateLock || "bypass"}
      endDateLock={endDateLock}
      setModalRequired={setModalRequired}
      onCancelEdit={onCancelEdit}
    />
  );
};

export default CriteriaDetailTab;