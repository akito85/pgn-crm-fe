import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { FormStepper } from "../../../../../../components/FormStepNavigation";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import InputComponent from "../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import TableRBI from "../../../../../../components/TableRBI";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import { IconModal } from "../../../../../../utils/Icon";
import {
  bulkApproveCollectionActivities,
  getAllCollectionActivitiesApprovalList,
} from "../../../../../../redux/slices/debt_and_collection/collectionActivities";

const formatDate = (value, format = "DD MMM YYYY") => {
  if (!value) return "-";

  const parsed = moment(value);
  return parsed.isValid() ? parsed.format(format) : value;
};

const formatLabel = (value) => {
  if (!value) return "-";

  return value
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ModalApprovalCollectionActivities = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
}) => {
  const { data_approval_list, loadingApproval } = useSelector(
    (state) => state.collectionActivities
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [fixedColumns, setFixedColumns] = useState({
    left: ["no"],
    right: [],
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCollectionActivitiesApprovalList());
    }
  }, [dispatch, isOpen]);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  }, []);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setDataTableSelect(newSelectedRows);
  };

  const rowSelection = {
    fixed: true,
    preserveSelectedRowKeys: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const steps = [
    {
      title: "ACTIVITIES",
      disabled: dataTableSelect.length === 0 || !remark.trim(),
    },
    {
      title: "CONFIRMATION",
    },
  ];

  const approvalList = useMemo(
    () =>
      (data_approval_list || []).map((item, index) => ({
        ...item,
        key:
          item?.tAppId ??
          item?.tappId ??
          item?.collectionActivityId ??
          item?.activityCode ??
          index + 1,
        category2:
          item?.category2 ??
          item?.requestCategory ??
          item?.approvalCategory ??
          "COLLECTION_ACTIVITY",
      })),
    [data_approval_list]
  );

  const handleCancelForm = () => {
    handleCancel();
    setCurrent(0);
    setSearchedColumn("");
    setSearchText("");
    setRemark("");
    setAction("");
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setBodyError({});
    form.resetFields();
  };

  const handleSave = () => {
    const body = {
      action,
      remark: remark.trim(),
      items: dataTableSelect.map((item) => ({
        collectionActivityId: item.collectionActivityId,
        tAppId: item.tAppId ?? item.tappId,
        category: item.category2,
      })),
    };

    dispatch(
      bulkApproveCollectionActivities({
        body,
        action: action === "APPROVE" ? "approved" : "rejected",
      })
    )
      .unwrap()
      .then(() => {
        handleRefresh();
        handleCancelForm();
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const baseColumns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        dataIndex: "no",
        width: 60,
        render: (text, record, index) => index + 1,
      },
      {
        title: "ACTIVITIES CODE",
        key: "activityCode",
        dataIndex: "activityCode",
        width: 180,
        sorter: true,
        ...getColumnSearchProps(
          "activityCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "ACTIVITIES NAME",
        key: "activityName",
        dataIndex: "activityName",
        width: 220,
        sorter: true,
        ...getColumnSearchProps(
          "activityName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "CATEGORY",
        key: "category",
        dataIndex: "category",
        width: 150,
        sorter: true,
        ...getColumnSearchProps(
          "category",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "MEDIA",
        key: "media",
        dataIndex: "media",
        width: 140,
        sorter: true,
        ...getColumnSearchProps(
          "media",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "STATUS",
        key: "status",
        dataIndex: "status",
        width: 140,
        sorter: true,
        render: (text) => formatLabel(text),
      },
      {
        title: "APPROVAL STATUS",
        key: "statusApproval",
        dataIndex: "statusApproval",
        width: 170,
        sorter: true,
        render: (text) => formatLabel(text),
      },
      {
        title: "START DATE",
        key: "startDate",
        dataIndex: "startDate",
        width: 160,
        sorter: true,
        render: (text) => formatDate(text),
      },
      {
        title: "END DATE",
        key: "endDate",
        dataIndex: "endDate",
        width: 160,
        sorter: true,
        render: (text) => formatDate(text),
      },
      {
        title: "CREATED BY",
        key: "createdBy",
        dataIndex: "createdBy",
        width: 160,
        sorter: true,
        ...getColumnSearchProps(
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "CREATED DATE",
        key: "createdDate",
        dataIndex: "createdDate",
        width: 190,
        sorter: true,
        render: (text) => formatDate(text, "DD MMM YYYY HH:mm:ss"),
      },
    ],
    [handleSearch, searchedColumn, searchText]
  );

  const columnDefinitions = useMemo(
    () =>
      baseColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [baseColumns]
  );

  const columns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) leftFixed.push(col);
      else if (fixedColumns.right.includes(colKey)) rightFixed.push(col);
      else normal.push(col);
    });

    return [...leftFixed, ...normal, ...rightFixed].map((col) => {
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) {
        return { ...col, fixed: "left" };
      }
      if (fixedColumns.right.includes(colKey)) {
        return { ...col, fixed: "right" };
      }
      return { ...col, fixed: undefined };
    });
  }, [baseColumns, fixedColumns]);

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Approval Activities"
        handleCancel={handleCancelForm}
        onFinish={handleSave}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent type="default" onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => setCurrent((prev) => prev - 1)}
                type="submit"
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}
            {current < steps.length - 1 && (
              <ButtonComponent
                onClick={() => setCurrent((prev) => prev + 1)}
                type="submit"
                className="ant-btn ant-btn-submit flex w-full justify-center"
                disabled={steps[current].disabled}
              >
                <span className="p-1 text-[18px] text-center">Next</span>
                <RightOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <>
                <ButtonComponent
                  type="reject"
                  htmlType="submit"
                  form="formApproveCollectionActivities"
                  onClick={() => setAction("REJECT")}
                  loading={loadingApproval}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  htmlType="submit"
                  form="formApproveCollectionActivities"
                  onClick={() => setAction("APPROVE")}
                  loading={loadingApproval}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <FormStepper
          steps={steps}
          current={current}
          onPrev={() => current > 0 && setCurrent((prev) => prev - 1)}
          onNext={() => current < steps.length - 1 && !steps[current].disabled && setCurrent((prev) => prev + 1)}
        />

        <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
          <Form
            layout="vertical"
            form={form}
            id="formApproveCollectionActivities"
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <p className="text-primary uppercase font-bold mb-4">
                Activities Information
              </p>
              <TableRBI
                idTable="collection-activities-approval-table"
                dataSource={approvalList}
                columns={columns}
                totalData={approvalList.length}
                tableScrolled={{ y: 420, x: 1800 }}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loadingApproval}
                rowSelection={rowSelection}
                usePagination={false}
                useInfiniteScroll={true}
                hasMore={false}
              />
              <div className="pt-[30px]">
                <Form.Item
                  label="Remark"
                  name="remark"
                  rules={[
                    { required: true, message: "Please input your Remark!" },
                  ]}
                >
                  <InputComponent
                    rows={1}
                    type="textarea"
                    value={remark}
                    onChange={(event) => setRemark(event.target.value)}
                    placeholder="Type your remark for approval/rejection"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <TableRBI
              idTable="collection-activities-approval-confirmation-table"
              dataSource={dataTableSelect}
              columns={columns}
              totalData={dataTableSelect.length}
              tableScrolled={{ y: 420, x: 1800 }}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={false}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={false}
            />
            <div className="pt-[30px]">
              <DetailText label="Remark">{remark || "-"}</DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText="Try Again"
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">
            {`Your data was not ${
              action === "APPROVE" ? "approved" : "rejected"
            }. ${bodyError.message}.`}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalApprovalCollectionActivities;
