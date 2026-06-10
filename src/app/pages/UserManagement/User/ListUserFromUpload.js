import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAuthType,
  getAllUserLevel,
  getAllUserType,
} from "../../../../redux/slices/user_management/user";
import userHttpService from "../../../../redux/services/userHttpService";
import StatusComponent from "../../../../components/StatusComponent";
import NxTableInlineEdit from "../../../../components/Nx/NxTableInlineEdit";
import BaseContainer from "../../../../components/BaseContainer";

// Strip "at row N" suffix from BE validation messages.
const normalizeMessage = (msg) =>
  msg.replace(/\s+at row \d+\.?$/i, "");

const ListUserFromUpload = ({ data, onChangeData = () => {} }) => {
  const dispatch = useDispatch();
  const {
    data_user_level,
    data_user_type,
    data_auth_type,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUserLevel());
    dispatch(getAllUserType());
    dispatch(getAllAuthType());
  }, [dispatch]);

  const { data: dataEmployee = [] } = useQuery({
    queryKey: ["employees", 0],
    queryFn: () => userHttpService.getAll("/v1/dbs/api/mu/get-all-employee/0"),
    select: (res) => res?.data?.map((item) => ({ value: item?.id, label: item?.name })) ?? [],
  });
  const dataUserLevel = useMemo(
    () => data_user_level?.data?.map((item) => ({ value: item.value, label: item.name })) ?? [],
    [data_user_level]
  );
  const dataAuthType = useMemo(
    () => data_auth_type?.data?.map((item) => ({ value: item.value, label: item.name })) ?? [],
    [data_auth_type]
  );
  const dataUserType = useMemo(
    () => data_user_type?.data?.map((item) => ({ value: item.value, label: item.type })) ?? [],
    [data_user_type]
  );

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
        title: "USERNAME",
        dataIndex: "userName",
        editable: true,
        inputType: "text",
        width: 150,
        placeholder: "Username",
      },
      {
        title: "AUTH TYPE",
        dataIndex: "authTypeId",
        editable: true,
        inputType: "select",
        width: 140,
        selectOptions: dataAuthType,
        render: (value, record) => {
          const match = dataAuthType.find((a) => a.value === value);
          return match ? match.label : (record?.authType ?? value ?? "—");
        },
      },
      {
        title: "EMPLOYEE",
        dataIndex: "employee",
        editable: true,
        inputType: "select",
        searchable: true,
        width: 180,
        selectOptions: dataEmployee,
        render: (value) => {
          if (value == null) return "—";
          const match = dataEmployee.find((a) => a.value === value);
          // Show the raw ID when it's a valid integer but not in the loaded list
          // so the user can see what was uploaded and correct it via the Select.
          return match ? match.label : String(value);
        },
      },
      {
        title: "USER TYPE",
        dataIndex: "userTypeId",
        editable: true,
        inputType: "select",
        width: 130,
        selectOptions: dataUserType,
        render: (value, record) => {
          const match = dataUserType.find((a) => a.value === value);
          return match ? match.label : (record?.userType ?? value ?? "—");
        },
      },
      {
        title: "USER LEVEL",
        dataIndex: "userLevelId",
        editable: true,
        inputType: "select",
        width: 130,
        selectOptions: dataUserLevel,
        render: (value, record) => {
          const match = dataUserLevel.find((a) => a.value === value);
          return match ? match.label : (record?.userLevel ?? value ?? "—");
        },
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
        width: 150,
        placeholder: "Phone number",
      },
      {
        title: "GROUP ACCESS",
        dataIndex: "groupAccess",
        editable: false,
        width: 160,
        render: (value) => value ?? "—",
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        editable: true,
        inputType: "date",
        width: 130,
        placeholder: "DD MMM YYYY",
        render: (value) => value ?? "—",
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        editable: true,
        inputType: "date",
        width: 130,
        placeholder: "DD MMM YYYY",
        render: (value) => value ?? "—",
      },
      {
        title: "START DATE GA",
        dataIndex: "startDateGa",
        editable: true,
        inputType: "date",
        width: 140,
        placeholder: "DD MMM YYYY",
        render: (value) => value ?? "—",
      },
      {
        title: "END DATE GA",
        dataIndex: "endDateGa",
        editable: true,
        inputType: "date",
        width: 130,
        placeholder: "DD MMM YYYY",
        render: (value) => value ?? "—",
      },
      {
        title: "STATUS",
        dataIndex: "status",
        editable: false,
        width: 220,
        render: (text, record) => {
          if (!text) return null;
          const errors = Array.isArray(record?.message) ? record.message : [];
          return (
            <div>
              <div style={{ textAlign: "center" }}>
                <StatusComponent colour={text}>{text}</StatusComponent>
              </div>
              {text === "FAILED" && errors.length > 0 && (
                <ul
                  style={{
                    margin: "4px 0 0",
                    paddingLeft: 14,
                    fontSize: 11,
                    color: "#BE3036",
                    lineHeight: "1.5",
                  }}
                >
                  {errors.map((msg, i) => (
                    <li key={i}>{normalizeMessage(msg)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        },
      },
    ],
    [dataAuthType, dataEmployee, dataUserType, dataUserLevel]
  );

  // Clear the parse-time validation status when a row is edited by the user,
  // since the status is stale after inline edits and only reflects the initial
  // Excel parse result — actual re-validation happens on final save.
  const handleDataChange = useCallback(
    (newData) => {
      const updated = newData.map((newRow) => {
        const oldRow = data?.find((r) => r.key === newRow.key);
        if (!oldRow) return newRow;
        const rowEdited = Object.keys(newRow).some(
          (k) => k !== "status" && newRow[k] !== oldRow[k]
        );
        return rowEdited ? { ...newRow, status: null, message: [] } : newRow;
      });
      onChangeData(updated);
    },
    [data, onChangeData]
  );

  return (
    <BaseContainer header={"USER LIST"}>
      <NxTableInlineEdit
        idTable="user-upload-table"
        dataSource={data ?? []}
        onDataChange={handleDataChange}
        columns={columns}
        rowKey="key"
        showDelete
        emptyText="No user data uploaded yet."
        autoEditOnAppend={false}
      />
    </BaseContainer>
  );
};

export default ListUserFromUpload;
