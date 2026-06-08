import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicTableInlineBilling from "../../Table/DynamicTableInlineBilling";
import {
  getMappingItemTypeList,
  getMappingItemTransactionMappingCode,
} from "../../../../../../../redux/slices/rating_billing_invoice/billingItem";

const normalizeValue = (value) =>
  value === null || typeof value === "undefined"
    ? ""
    : String(value).trim().toLowerCase();

const MappingItemTab = ({
  dataTable = [],
  onDataChange = () => {},
  type = "create",
  isEditabled = false,
  setIsEditabled = () => {},
  startDateLock = null,
  endDateLock = null,
  setModalRequired = () => {},
  onCancelEdit = null,
}) => {
  const dispatch = useDispatch();
  const { data_mappingItemTypeList, data_mappingItemTransactionMappingCode } =
    useSelector((state) => state.billing_item);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentTypeParam, setCurrentTypeParam] = useState("");
  const [mappingCodeOptionsByType, setMappingCodeOptionsByType] = useState({});
  const [dropdownLoading, setDropdownLoading] = useState({
    type: false,
    transactionMappingCode: false,
  });
  const fetchedRef = useRef({
    type: false,
    transactionMappingCodeByType: {},
  });

  const handleChangePage = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const resolveTypeParam = (typeLabelOrCode) => {
    const normalized = normalizeValue(typeLabelOrCode);
    if (!normalized) {
      return "";
    }

    if (normalized.includes("billing item") || normalized === "billing_item") {
      return "BILLING_ITEM";
    }

    if (normalized.includes("payment item") || normalized === "payment_item") {
      return "PAYMENT_ITEM";
    }

    const found = (data_mappingItemTypeList || []).find((item) => {
      const candidates = [item?.name, item?.code, item?.id]
        .filter((candidate) => candidate !== null && candidate !== undefined)
        .map(normalizeValue);
      return candidates.includes(normalized);
    });

    if (!found) {
      return String(typeLabelOrCode).toUpperCase();
    }

    const foundNormalizedCode = normalizeValue(found?.code);
    if (foundNormalizedCode.includes("billing item")) {
      return "BILLING_ITEM";
    }

    if (foundNormalizedCode.includes("payment item")) {
      return "PAYMENT_ITEM";
    }

    return found?.code || found?.name || found?.id;
  };

  const mapTypeToDisplay = (value) => {
    const normalized = normalizeValue(value);
    const found = (data_mappingItemTypeList || []).find((item) => {
      const candidates = [item?.name, item?.code, item?.id]
        .filter((candidate) => candidate !== null && candidate !== undefined)
        .map(normalizeValue);
      return candidates.includes(normalized);
    });

    return found?.name || value;
  };

  const handleFetchTransactionMappingCode = async (selectedType) => {
    const typeParam = resolveTypeParam(selectedType);

    if (!typeParam) {
      setCurrentTypeParam("");
      return;
    }

    if (
      fetchedRef.current.transactionMappingCodeByType[typeParam] ||
      mappingCodeOptionsByType[typeParam]
    ) {
      setCurrentTypeParam(typeParam);
      return;
    }

    setCurrentTypeParam(typeParam);
    setDropdownLoading((prev) => ({ ...prev, transactionMappingCode: true }));

    try {
      const result = await dispatch(
        getMappingItemTransactionMappingCode({ type: typeParam }),
      ).unwrap();

      setMappingCodeOptionsByType((prev) => ({
        ...prev,
        [typeParam]: result || [],
      }));
      fetchedRef.current.transactionMappingCodeByType[typeParam] = true;
    } catch (_error) {
      setMappingCodeOptionsByType((prev) => ({
        ...prev,
        [typeParam]: [],
      }));
    } finally {
      setDropdownLoading((prev) => ({
        ...prev,
        transactionMappingCode: false,
      }));
    }
  };

  const handleTypeDropdownOpen = async (open) => {
    if (!open) {
      return;
    }

    if (
      fetchedRef.current.type ||
      (data_mappingItemTypeList || []).length > 0
    ) {
      fetchedRef.current.type = true;
      return;
    }

    setDropdownLoading((prev) => ({ ...prev, type: true }));
    try {
      await dispatch(getMappingItemTypeList()).unwrap();
      fetchedRef.current.type = true;
    } catch (_error) {
      // Keep retryable on next open.
    } finally {
      setDropdownLoading((prev) => ({ ...prev, type: false }));
    }
  };

  const handleTransactionMappingCodeDropdownOpen = async (open, form) => {
    if (!open) {
      return;
    }

    // Read from form field first, fallback to currentTypeParam (already resolved code)
    const selectedType = form?.getFieldValue("type") || currentTypeParam;
    if (!selectedType) {
      return;
    }

    await handleFetchTransactionMappingCode(selectedType);
  };

  useEffect(() => {
    if (
      !currentTypeParam ||
      !Array.isArray(data_mappingItemTransactionMappingCode)
    ) {
      return;
    }

    setMappingCodeOptionsByType((prev) => ({
      ...prev,
      [currentTypeParam]: data_mappingItemTransactionMappingCode,
    }));
  }, [currentTypeParam, data_mappingItemTransactionMappingCode]);

  const handleTypeChanged = (selectedType, form) => {
    form.setFieldsValue({
      transactionMappingCode: undefined,
      name: undefined,
      description: undefined,
    });

    const nextTypeParam = resolveTypeParam(selectedType);
    setCurrentTypeParam(nextTypeParam || "");

    // Pre-fetch TMC codes immediately so data is ready when user opens the dropdown
    if (selectedType) {
      handleFetchTransactionMappingCode(selectedType);
    }
  };

  const findSelectedMappingItem = (typeValue, transactionMappingCode) => {
    const typeParam = resolveTypeParam(typeValue);
    const options = mappingCodeOptionsByType[typeParam] || [];

    return options.find((item) => {
      const selectedCodeNormalized = normalizeValue(transactionMappingCode);
      const candidates = [item?.transactionMappingCode, item?.name, item?.id]
        .filter((candidate) => candidate !== null && candidate !== undefined)
        .map(normalizeValue);
      return candidates.includes(selectedCodeNormalized);
    });
  };

  const handleTransactionMappingCodeChanged = async (selectedCode, form) => {
    const selectedType = form.getFieldValue("type");
    const typeParam = resolveTypeParam(selectedType);

    if (typeParam && !mappingCodeOptionsByType[typeParam]) {
      await handleFetchTransactionMappingCode(selectedType);
    }

    const selectedItem = findSelectedMappingItem(selectedType, selectedCode);

    form.setFieldsValue({
      name: selectedItem?.name || undefined,
      description: selectedItem?.description || undefined,
    });
  };

  const typeOptions = useMemo(
    () =>
      (data_mappingItemTypeList || []).map((item) => ({
        value: item?.name,
        label: item?.name,
      })),
    [data_mappingItemTypeList],
  );

  const transactionMappingCodeOptions = useMemo(() => {
    const options = currentTypeParam
      ? mappingCodeOptionsByType[currentTypeParam] || []
      : [];
    return options
      .filter((item) => item?.transactionMappingCode)
      .map((item) => ({
        value: item.transactionMappingCode,
        label: item.transactionMappingCode,
      }));
  }, [currentTypeParam, mappingCodeOptionsByType]);

  const columns = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      inputType: "select",
      required: true,
      width: 190,
      options: typeOptions,
      loading: dropdownLoading.type,
      render: (value) => mapTypeToDisplay(value) || "-",
      onClick: handleTypeChanged,
      onDropdownVisibleChange: handleTypeDropdownOpen,
    },
    {
      title: "TRANSACTION MAPPING CODE",
      dataIndex: "transactionMappingCode",
      inputType: "select",
      required: true,
      width: 260,
      options: transactionMappingCodeOptions,
      loading: dropdownLoading.transactionMappingCode,
      render: (value) => value || "-",
      onClick: handleTransactionMappingCodeChanged,
      onDropdownVisibleChange: handleTransactionMappingCodeDropdownOpen,
    },
    {
      title: "NAME",
      dataIndex: "name",
      inputType: "description_readonly",
      width: 220,
      render: (value) => value || "-",
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
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      inputType: "description_readonly",
      width: 260,
      render: (value) => value || "-",
    },
  ];

  const totalColWidth = 60 + 190 + 260 + 220 + 180 + 180 + 260 + 120;

  return (
    <DynamicTableInlineBilling
      header={"MAPPING ITEM"}
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
      allowDeleteExisting={true}
    />
  );
};

export default MappingItemTab;
