import React, { useEffect, useRef, useState } from "react";
import ModalCustom from "./ModalCustom";
import ButtonComponent from "../ButtonComponent";
import { Alert, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent";
import ApprovalHierarchyComponent from "../../app/pages/ProductAndPromo/Pricing/Form/ApprovalHierarchyComponent";
import { useSelector } from "react-redux";
import { dateFormatting, requiredMessage } from "../../utils";
import moment from "moment";
import DateComponent from "../DateComponent";

const ModalActiveInactive = ({
  dispatch = () => {},
  getAPIOption = () => {},
  getAPIDetail = () => {},
  header = "Inactive Information",
  alertMessage = "",
  openModalInactivate = false,
  handleCloseModalInactivate = () => {},
  selector = "pricing",
  onFinish = () => {},
  addEndDate = false,
  dataStartDate = null,
}) => {
  const [form] = Form.useForm();

  const searchInput = useRef(null);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [remark, setRemark] = useState("");

  const [selectedHierarchy, setSelectedHierarchy] = useState(null);

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  const { dataListAppHierId = [], dataListAppHierDetail = [] } = useSelector(
    (state) => state[selector]
  );

  const getStartDate = () => {
    let date = moment();
    if (addEndDate && dataStartDate) {
      const tempStartDate = moment(dataStartDate, dateFormatting.date);
      date = tempStartDate > moment() ? tempStartDate : moment();
    }
    return date;
  };

  // Load dropdown option hierarchy
  useEffect(() => {
    dispatch(getAPIOption());
  }, [dispatch, getAPIOption]);

  // Set dropdown options
  useEffect(() => {
    if (dataListAppHierId.length > 0) {
      setAppHierOptions(
        dataListAppHierId.map((item) => ({
          name: item.approvalName,
          value: item.appHierId,
        }))
      );
    }
  }, [dataListAppHierId]);

  // Load hierarchy detail when selected
  useEffect(() => {
    if (openModalInactivate && selectedHierarchy !== null && selectedHierarchy !== undefined) {
      dispatch(getAPIDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy, openModalInactivate, getAPIDetail]);

  // Set table detail hierarchy
  useEffect(() => {
    if (dataListAppHierDetail.length > 0) {
      setAppHierDataDetail(
        dataListAppHierDetail.map((row, i) => ({
          ...row,
          key: i + 1,
          employeeDetail: row.employeeDetail.map((e, j) => ({
            ...e,
            key: j + 1,
          })),
        }))
      );
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const handleClear = () => {
    setRemark("");
    setSelectedHierarchy(null);
    setAppHierDataDetail([]);
    form.resetFields();
  };

  const handleCancelModal = () => {
    handleClear();
    handleCloseModalInactivate();
  };

  const handleSave = (data) => {
    onFinish(data, handleClear);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleUpdateHierarchy = (value) => {
    setSelectedHierarchy(value);
  };

  const handleDisableEndDate = (current) => {
    if (dataStartDate) {
      return getStartDate().add(-1, "days") >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  return (
    <ModalCustom
      isOpen={openModalInactivate}
      handleCancel={handleCancelModal}
      header={header}
      width={850}
      type="confirmation"
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent onClick={handleCancelModal} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent form="inactivateForm" type="submit" htmlType="submit">
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form
        id="inactivateForm"
        layout="vertical"
        form={form}
        onFinish={handleSave}
      >
        <div className="flex flex-col gap-6">
          {/* Warning Alert */}
          <Alert
            message={alertMessage}
            icon={<InfoCircleOutlined />}
            type="warning"
            showIcon
            className="inactivate-alert"
          />

          {/* APPROVAL HIERARCHY COMPONENT */}
          <ApprovalHierarchyComponent
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            updateSelectHierarchy={handleUpdateHierarchy}
            selectedHierarchy={selectedHierarchy}
            searchInput={searchInput}
            searchedColumn={searchedColumn}
            searchText={searchText}
            handleSearch={handleSearch}
          />

          {/* Optional End Date */}
          {addEndDate && (
            <Form.Item
              name="endDate"
              label="End Date"
              required
              rules={[
                {
                  validator: (_, val) =>
                    (val && getStartDate().add(-1, "days") < moment(val)) ||
                    !val
                      ? Promise.resolve()
                      : Promise.reject(new Error("End date must after Start")),
                },
                { required: true, message: requiredMessage("End Date") },
              ]}
            >
              <DateComponent
                dateDisable={handleDisableEndDate}
                disabled={!getStartDate()}
              />
            </Form.Item>
          )}

          {/* Remark */}
          <Form.Item
            name="remark"
            label="Remark"
            className="w-full"
            rules={[{ required: true, message: requiredMessage("Remark") }]}
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              placeholder="Type your remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </div>
      </Form>
    </ModalCustom>
  );
};

export default ModalActiveInactive;
