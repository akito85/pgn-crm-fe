import React, { useState } from "react";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";

const CriteriaDetailTab = ({
  criteriaType = null,   
  dataTable = [],
  onDataChange = () => {},
  data_specialGLList = [],
  data_glAccountList = [],
  data_classificationTypeList = [],
  data_accountTypeList = [],
  data_criteriaOptions = [], 
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

  const resolveCriteriaCode = () => {
    if (criteriaType === null || criteriaType === undefined) return null;

    const isNumericId =
      typeof criteriaType === "number" ||
      (typeof criteriaType === "string" && !isNaN(Number(criteriaType)));

    if (isNumericId) {
      return (
        data_criteriaOptions?.find(
          (item) => item.id === criteriaType || item.id === Number(criteriaType),
        )?.code || null
      );
    }
    return criteriaType;
  };

  const criteriaCode = resolveCriteriaCode();

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
        return null;
    }
  };

  const criteriaColConfig = getCriteriaColumnConfig();

  const glAccountOptions = data_glAccountList.map((item) => ({
    value: item.glAccountId ?? item.id,
    label: `${item.glAccount ?? item.account} - ${item.glAccountDesc ?? item.name}`,
  }));

  const specialGlOptions = data_specialGLList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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
      startDateLock={startDateLock}
      endDateLock={endDateLock}
      setModalRequired={setModalRequired}
      onCancelEdit={onCancelEdit}
    />
  );
};

export default CriteriaDetailTab;