import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../../utils";
import TaxCodeInfo from "./TaxCodeInfo";
import DetailText from "../../../../../../components/DetailText";
import ConditionForm from "../Form/ConditionForm";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import RadioTabs from "../../../../../../components/RadioTabs";
import FunctionalCriteriaInvoiceTemplate from "../../InvoiceTemplate/Form/FunctionalCriteriaInvoiceTemplate";
import FunctionalCriteriaTaxCode from "../Form/FunctionalCriteriaTaxCode";

const DetailSectionTaxCode = ({
  dataHistory = {},
  dataInvoice,
  dataCondition,
  dataCategory,
  criteriaValues = [],
  dataCriteria = [],
  storedData = false,
}) => {
  const dispatch = useDispatch();
  const [valuePage, setValuePage] = useState("Criteria");

  const [tabDetailTaxCode, setTabDetailTaxCode] = useState([
    { value: "Criteria" },
    { value: "Condition", paramValue: ["name", "operator", "dataType"] },
  ]);
  const onChange = (e) => {
    if (!storedData) {
      setValuePage(e.target.value);
    } else {
      const errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    }
  };

  return (
    <div>
      <BaseContainer header={"tax information"}>
        <TaxCodeInfo
          preview="detail"
          data={dataInvoice}
          dataCategory={dataCategory}
        />
      </BaseContainer>

      <BaseContainer
        header={"Criteria Information"}
        type={"tabs"}
        element={
          <RadioTabs
            data={tabDetailTaxCode}
            onChange={onChange}
            currentPosition={valuePage}
          />
        }
      >
        {valuePage === "Criteria" ? (
          <FunctionalCriteriaTaxCode
            data={dataCriteria}
            dataCriteria={criteriaValues}
            type={"show"}
            showAction={"show"}
          />
        ) : (
          <ConditionForm
            data={dataCondition}
            type={"show"}
            showAction={"show"}
          />
        )}
      </BaseContainer>

      <BaseContainer header={"history log information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label="Record ID">{dataHistory?.recordId}</DetailText>
          <DetailText label="Created Date">
            {dataHistory?.createdDate}
          </DetailText>
          <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataHistory?.updatedDate}
          </DetailText>
          <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
        </div>
      </BaseContainer>
    </div>
  );
};
export default DetailSectionTaxCode;
