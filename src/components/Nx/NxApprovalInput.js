import { Form, Select } from "antd";
import { useMemo } from "react";
import NxDetailText from "../../components/Nx/NxDetailText";
import SelectComponent from "../../components/SelectComponent";
import { requiredMessage } from "../../utils";
import NxTableNested from "./NxTableNested";

const NxApprovalInput = ({
  form,
  options = [],
  hierarchyDetails = [],
  formView = true,
  handleSelectHierarchy = () => {},
  loading = false,
  tableLoading = false,
}) => {
  const appHierId = Form.useWatch("appHierId", { form });
  const appHierName = Form.useWatch("appHierName", { form, preserve: true });

  const parentColumns = [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "approvalLevel",
      title: "HIERARCHY",
      dataIndex: "approvalLevel",
      sorter: (a, b) => a?.approvalLevel?.localeCompare(b?.approvalLevel),
      fill: true,
    },
    {
      key: "position",
      title: "POSITION",
      dataIndex: "position",
      sorter: (a, b) => a?.position?.localeCompare(b?.position),
      fill: true,
    },
  ];

  const childColumns = [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "employeeName",
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      sorter: (a, b) => a?.employeeName?.localeCompare(b?.employeeName),
      fill: true,
    },
  ];

  const nestedData = useMemo(
    () =>
      hierarchyDetails.map((h, i) => ({
        ...h,
        id: h.id ?? i,
        children: h.employeeDetail || [],
      })),
    [hierarchyDetails]
  );

  return (
    <div className="flex flex-col gap-y-4">
      {formView ? (
        <>
          <Form.Item
            name={"appHierId"}
            label="Approval Hierarchy"
            rules={[{ message: requiredMessage("Approval Hierarchy"), required: true }]}
            className="no-margin-form w-1/3"
          >
            <SelectComponent
              onChange={(value, option) => handleSelectHierarchy(value, option.children)}
              disabled={loading}
            >
              {options.map((data, index) => (
                <Select.Option key={index} value={data.appHierId}>
                  {data.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
        </>
      ) : (
        <NxDetailText label={"Approval Hierarchy"}>{appHierName}</NxDetailText>
      )}

      {(appHierId || (!formView && hierarchyDetails.length > 0)) && (
        <NxTableNested
          idTable="hierarchy-table"
          dataSource={nestedData}
          parentColumns={parentColumns}
          childColumns={childColumns}
          useSelect={false}
          usePagination={false}
          useInfiniteScroll={false}
          showAdvanceSearch={false}
          loading={tableLoading}
        />
      )}
    </div>
  );
};

export default NxApprovalInput;
