import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import { formMessageRequired, hasValue } from "../../../../utils";
import SelectComponent from "../../../../components/SelectComponent";
import TablePagination from "../../../../components/TablePagination";
import BaseContainer from "../../../../components/BaseContainer";
import {
  getApprovalHierarchy,
  getListApprovalById,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { useDispatch, useSelector } from "react-redux";
import DetailText from "../../../../components/DetailText";

const ApprovalLayout = ({
  type,
  onApprovalChange = () => {},
  selectedAppHierId,
  status,
  form,
}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [approvalOptions, setApprovalOptions] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [savedApproval, setSavedApproval] = useState(null);
  const { list_approval_by_id } = useSelector(
    (state) => state.monitoring_usage,
  );
  const dataHierarchy = list_approval_by_id?.map((item, index) => ({
    ...item,
    key: index,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getApprovalHierarchy({ page, pageSize }),
        );
        setApprovalOptions(response.payload);
      } catch (error) {
        // Handle error if necessary
      }
    };
    if (selectedAppHierId) {
      dispatch(getListApprovalById(selectedAppHierId));
    }
    fetchData();
  }, [dispatch, page, pageSize, selectedAppHierId]);

  const handleApprovalChange = (e) => {
    dispatch(getListApprovalById(e));
    onApprovalChange(e);
    setSelectedApproval(e);
    setSavedApproval(e);
    // return e
  };
  console.log(selectedApproval, " selected");

  const column = [
    {
      title: "NO",
      width: 60,
      align: "center",
      // render: (text, object, index) => (page - 1) * pageSize + index + 1,
      render: (text, object, index) => index + 1,
    },
    {
      title: "HIERARCHY",
      dataIndex: "approvalLevel",
      sorter: true,
      // ...getColumnSearchProps("entityName"),
    },
    {
      title: "POSITION",
      dataIndex: "position",
      sorter: true,
      // ...getColumnSearchProps("entityName"),
    },
  ];
  const columnExpand = [
    {
      title: "NO",
      width: 60,
      align: "center",
      // render: (text, object, index) => (page - 1) * pageSize + index + 1,
      render: (text, object, index) => index + 1,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
      sorter: true,
      // ...getColumnSearchProps("entityName"),
    },
  ];
  const expandedRowRender = (record) => {
    const dataExpands = record?.employeeDetail || [];
    const columns = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "EMPLOYEE",
        dataIndex: "employeeName",
      },
    ];
    return (
      <div className="flex flex-col py-4 pr-4 pl-[48px]">
        <p className="text-primary text-xs font-bold uppercase">
          {"EMPLOYEE INFORMATION"}
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={dataExpands}
          columns={columns}
        />
      </div>
    );
  };

  // render layout
  const renderLayout = (type) => {
    if (type === "detail-approval") {
      return (
        <BaseContainer header={"approval information"}>
          {/* <Form layout='vertical' className='w-full'> */}
          <Form.Item
            label="Approval Hierarchy"
            name="approval"
            className=" w-1/3"
            // rules={formMessageRequired('Approval Hierarchy')}
            getValueFromEvent={handleApprovalChange}
          >
            <SelectComponent
              onChange={onApprovalChange}
              disabled={status === "COMPLETE"}
            >
              {approvalOptions?.map((data) => (
                <Select.Option value={data.approvalId} key={data.apphierId}>
                  {data.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          {/* </Form> */}
          {hasValue(selectedAppHierId) ? (
            <TablePagination
              idTable="table-expand"
              usePagination={false}
              useSelect={false}
              dataSource={dataHierarchy}
              columns={column}
              expandable={{ expandedRowRender }}
            />
          ) : null}
        </BaseContainer>
      );
    } else if (type === "approval-confirmation") {
      return (
        <>
          <div className="text-primary text-xs font-bold uppercase my-5">
            Approval Inforamtion
          </div>
          <div className={"w-full grid grid-cols-4 mb-5"}>
            <DetailText label={"Approval Hierarchy"}>
              {approvalOptions?.map((item) => item?.approvalName)[0]}
            </DetailText>
          </div>
          <div>
            {hasValue(selectedAppHierId) ? (
              <TablePagination
                idTable="table-expand"
                usePagination={false}
                useSelect={false}
                dataSource={dataHierarchy}
                columns={column}
                expandable={{ expandedRowRender }}
              />
            ) : null}
          </div>
        </>
      );
    } else {
      return (
        <div className="flex-row">
          <Form.Item
            label="Approval Hierarchy"
            name="approval"
            rules={formMessageRequired("Approval Hierarchy")}
          >
            <SelectComponent
              onChange={handleApprovalChange}
              defaultValue={selectedAppHierId}
            >
              {approvalOptions?.map((data) => (
                <Select.Option value={data.approvalId} key={data.apphierId}>
                  {data.approvalName}
                </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          {hasValue(selectedAppHierId) ? (
            <TablePagination
              idTable="table-expand"
              usePagination={false}
              useSelect={false}
              dataSource={dataHierarchy}
              columns={column}
              expandable={{ expandedRowRender }}
            />
          ) : null}
        </div>
      );
    }
  };
  return <>{renderLayout(type)}</>;
};

export default ApprovalLayout;
