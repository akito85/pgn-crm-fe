import ApprovalMultiDestination from "./ApprovalMultiDestination";

export default function ApprovalForm({ form, dataTable, dataOption, handleSelectHiararchy }) {
  return (
    <ApprovalMultiDestination
      form={form}
      dataTable={dataTable}
      dataOption={dataOption}
      handleSelectHiararchy={handleSelectHiararchy}
    />
  );
}
