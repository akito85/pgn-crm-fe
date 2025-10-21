import { useCallback, useMemo, useState } from "react";
import { constantKeys } from "./constantCriteriaKey";

export const useCriteriaHooks = () => {
  const [stored, setStored] = useState(false);

  const [editDataRecord, setEditDataRecord] = useState({});
  const storedMemoEditedRecord = useMemo(
    () => editDataRecord,
    [editDataRecord],
  );
  const updateStoredData = (initVal) => {
    setStored(initVal);
  };

  const codeToPropMap = useMemo(
    () => ({
      SA_TYPE: "saType",
      WAPU_FLAG: "wapuFlag",
      ACCOUNT_NUMBER: "accountNumber",
      COST_CENTER: "costCenter",
      PREMISE_PROVINCE: "premiseProvince",
      ACCOUNT_SEGMENT: "accountSegment",
      PREMISE_CITY: "premiseCity",
      PREMISE_COUNTRY: "premiseCountry",
      CORPORATE_FLAG: "corporateFlag",
      ACCOUNT_TYPE: "accountType",
      ACCOUNT_GROUP_TYPE: "accountGroupType",
      PREMISE_SUBDISTRICT: "premiseSubdistrict",
      IS_ALL: "isAll",
      PREMISE_DISTRICT: "premiseDistrict",
      SOR: "sor",
      ACCOUNT_CATEGORY: "accountCategory",
      CLASSIFICATION_TYPE: "classificationType",
      produtName: "productName",
    }),
    [],
  );

  const setDataIndex = useCallback((itemDataIndex) => {
    return constantKeys[itemDataIndex];
  }, []);

  return {
    stored,
    editDataRecord,
    setEditDataRecord,
    storedMemoEditedRecord,
    updateStoredData,
    setDataIndex,
  };
};
