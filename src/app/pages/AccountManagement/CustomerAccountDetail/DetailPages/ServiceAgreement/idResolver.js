const normalizeSemantic = (value) => String(value ?? "").trim().toUpperCase();

export const SERVICE_TYPE_VALUE = {
  GAS: "GAS",
};

export const SERVICE_AGREEMENT_TYPE_VALUE = {
  MAIN: "MAIN",
  ADDON: "ADDON",
  AMENDMENT: "AMENDMENT",
  PJBG: "PJBG",
};

const isSemanticMatch = (option, semanticValue) => {
  const target = normalizeSemantic(semanticValue);

  if (!target) {
    return false;
  }

  return (
    normalizeSemantic(option?.value) === target ||
    normalizeSemantic(option?.name) === target
  );
};

export const findOptionBySemantic = (options = [], semanticValue) => {
  return (options || []).find((option) =>
    isSemanticMatch(option, semanticValue)
  );
};

export const resolveOptionIdBySemantic = (options = [], semanticValue) => {
  const selectedOption = findOptionBySemantic(options, semanticValue);
  return selectedOption?.id ?? null;
};

export const resolveOptionValueBySemantic = (options = [], semanticValue) => {
  const selectedOption = findOptionBySemantic(options, semanticValue);
  return selectedOption?.value ?? selectedOption?.name ?? null;
};

export const isSelectedOptionSemantic = (
  options = [],
  selectedId,
  semanticValue
) => {
  if (selectedId === null || selectedId === undefined) {
    return false;
  }

  const selectedOption = (options || []).find((option) => option?.id === selectedId);
  return isSemanticMatch(selectedOption, semanticValue);
};

export const getDefaultServiceAgreementTypeSemantic = (typeSa) => {
  const normalizedType = normalizeSemantic(typeSa);

  if (normalizedType === SERVICE_AGREEMENT_TYPE_VALUE.ADDON) {
    return SERVICE_AGREEMENT_TYPE_VALUE.ADDON;
  }

  return SERVICE_AGREEMENT_TYPE_VALUE.MAIN;
};
