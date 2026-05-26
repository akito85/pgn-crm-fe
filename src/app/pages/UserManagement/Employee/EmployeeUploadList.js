import moment from "moment";
import { useCallback, useMemo } from "react";
import StatusComponent from "../../../../components/StatusComponent";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";

const EmployeeUploadList = ({
  dataEmp,
  dataEmployeeType,
  onChangeData = () => {},
}) => {
  const columns = useMemo(
    () => [
      {
        title: "NO",
        dataIndex: "no",
        width: 60,
        isClassification: true,
        render: (_, __, index) => index + 1,
      },
      {
        title: "EMPLOYEE NUMBER",
        dataIndex: "empNumber",
        editable: true,
        inputType: "text",
        width: 170,
        placeholder: "Employee number",
      },
      {
        title: "FIRST NAME",
        dataIndex: "firstName",
        editable: true,
        inputType: "text",
        width: 140,
        placeholder: "First name",
      },
      {
        title: "LAST NAME",
        dataIndex: "lastName",
        editable: true,
        inputType: "text",
        width: 140,
        placeholder: "Last name",
      },
      {
        title: "EMAIL",
        dataIndex: "email",
        editable: true,
        inputType: "text",
        width: 200,
        placeholder: "Email",
      },
      {
        title: "PHONE NUMBER",
        dataIndex: "phone",
        editable: true,
        inputType: "text",
        width: 160,
        placeholder: "Phone number",
      },
      {
        title: "EMPLOYEE TYPE",
        dataIndex: "empType",
        editable: true,
        inputType: "select",
        width: 160,
        selectOptions: dataEmployeeType ?? [],
        render: (value) => {
          const match = (dataEmployeeType ?? []).find((a) => a?.value === value);
          return match ? match.label : (value ?? "—");
        },
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        editable: true,
        inputType: "text",
        width: 130,
        placeholder: "DD MMM YYYY",
        render: (value) =>
          value ? moment(value, "DD MMM YYYY").format("YYYY-MM-DD") : "—",
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        editable: true,
        inputType: "text",
        width: 130,
        placeholder: "DD MMM YYYY",
        render: (value) =>
          value ? moment(value, "DD MMM YYYY").format("YYYY-MM-DD") : "—",
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        editable: true,
        inputType: "text",
      },
      {
        title: "STATUS",
        dataIndex: "status",
        editable: false,
        width: 110,
        isClassification: true,
        render: (text) =>
          text ? (
            <div className="flex justify-center">
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : null,
      },
    ],
    [dataEmployeeType]
  );

  // Clear the parse-time validation status when a row is edited by the user,
  // since the status is stale after inline edits and only reflects the initial
  // Excel parse result — actual re-validation happens on final save.
  const handleDataChange = useCallback(
    (newData) => {
      const updated = newData.map((newRow) => {
        const oldRow = dataEmp?.find((r) => r.key === newRow.key);
        if (!oldRow) return newRow;
        const rowEdited = Object.keys(newRow).some(
          (k) => k !== "status" && newRow[k] !== oldRow[k]
        );
        return rowEdited ? { ...newRow, status: null } : newRow;
      });
      onChangeData(updated);
    },
    [dataEmp, onChangeData]
  );

  return (
    <NxTableInlineEdit
      idTable="employee-upload-table"
      dataSource={dataEmp ?? []}
      onDataChange={handleDataChange}
      columns={columns}
      rowKey="key"
      showDelete
      emptyText="No employee data uploaded yet."
      autoEditOnAppend={false}
    />
  );
};

export default EmployeeUploadList;
