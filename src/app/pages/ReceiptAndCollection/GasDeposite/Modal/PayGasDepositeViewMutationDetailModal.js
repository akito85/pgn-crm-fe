import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (value) => {
  if (!value) return "-";
  const m = moment(value);
  return m.isValid() ? m.format("D-MMM-YY") : String(value);
};

const PayGasDepositeViewMutationDetailModal = ({
  isOpen,
  handleCancel = () => {},
  record = {},
}) => {
  const mutationItems = [
    { label: "Document Number", value: record.documentNumber },
    { label: "Type", value: record.type },
    { label: "Category", value: record.category },
    { label: "Bank", value: record.bank },
    { label: "Mutation Date", value: formatDate(record.mutationDate) },
    { label: "Source", value: record.source },
    { label: "Billing Period", value: record.billingPeriod },
    { label: "Rate Type", value: record.rateType },
    { label: "Rate Date", value: formatDate(record.rateDate) },
    { label: "Rate", value: record.rate },
    { label: "Amount", value: formatAmount(record.amount) },
    { label: "EQV Balance", value: formatAmount(record.eqvAmount || record.eqvBalance) },
    { label: "Status", value: record.status },
    { label: "Status Approval", value: record.statusApproval },
    { label: "Description", value: record.description, fullWidth: true },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      type="confirmation"
      header="View Mutation Detail"
      width={800}
      footer={[
        <ButtonComponent key="close" onClick={handleCancel}>
          Close
        </ButtonComponent>,
      ]}
    >
      <CollapsibleContainer header="Mutation Detail Information" border>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
          {mutationItems.map((item) => (
            <DetailText
              key={item.label}
              label={item.label}
              className={item.fullWidth ? "sm:col-span-2 lg:col-span-4" : ""}
            >
              {item.value ?? "-"}
            </DetailText>
          ))}
        </div>
      </CollapsibleContainer>
    </ModalCustom>
  );
};

PayGasDepositeViewMutationDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  record: PropTypes.shape({
    documentNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    category: PropTypes.string,
    bank: PropTypes.string,
    mutationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    source: PropTypes.string,
    billingPeriod: PropTypes.string,
    rateType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rateDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    eqvAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    eqvBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    statusApproval: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default PayGasDepositeViewMutationDetailModal;
