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

const ModalInactivateWithHierarchy = ({
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
  loading = false,
}) => {
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedHierarchy, setSelectedHierarchy] = useState("");
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const { dataListAppHierId = [], dataListAppHierDetail = [] } = useSelector(
    (state) => state[selector],
  );

  const getStartDate = () => {
    let date = moment();
    if (addEndDate) {
      if (dataStartDate !== null) {
        let tempStartDate = moment(dataStartDate, dateFormatting.date);
        date = tempStartDate > moment() ? tempStartDate : moment();
      }
    }
    return date;
  };

  useEffect(() => {
    if (openModalInactivate) {
      dispatch(getAPIOption());
    }
  }, [dispatch, getAPIOption, openModalInactivate]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (openModalInactivate && selectedHierarchy && selectedHierarchy !== 0) {
      console.log("Fetching detail for hierarchy ID:", selectedHierarchy);
      dispatch(getAPIDetail({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy, openModalInactivate, getAPIDetail]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const handleClear = () => {
    setRemark("");
    form.resetFields();
    setAppHierDataDetail([]);
    setSelectedHierarchy("");
  };
  const handleCancelModalInactivateFinal = () => {
    handleClear();
    handleCloseModalInactivate();
  };
  const handleSaveModalInactivateFinal = (data) => {
    onFinish(data, handleClear);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleUpdateSelectHierarchy = (val) => {
    setSelectedHierarchy(val);
  };

  const handleDisableEndDate = (current) => {
    if (dataStartDate !== null) {
      return getStartDate().add(-1, "days") >= current;
    }
    return moment().add(-1, "days") >= current;
  };
  return (
    <ModalCustom
      isOpen={openModalInactivate}
      handleCancel={handleCancelModalInactivateFinal}
      header={header}
      width={850}
      type={"confirmation"}
      loading={loading}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent
            onClick={handleCancelModalInactivateFinal}
            type="default"
            disabled={loading}
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="inactivateForm"
            type="submit"
            htmlType="submit"
            loading={loading}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form
        id="inactivateForm"
        layout="vertical"
        form={form}
        onFinish={handleSaveModalInactivateFinal}
      >
        <div className="flex flex-col gap-6">
          <Alert
            message={<span className="break-all">{alertMessage}</span>}
            icon={<InfoCircleOutlined />}
            type={"warning"}
            showIcon
            className="inactivate-alert"
          />
          <ApprovalHierarchyComponent
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            updateSelectHierarchy={handleUpdateSelectHierarchy}
            selectedHierarchy={selectedHierarchy}
            searchInput={searchInput}
            searchedColumn={searchedColumn}
            searchText={searchText}
            handleSearch={handleSearch}
          />
          {addEndDate ? (
            <Form.Item
              name={"endDate"}
              className="no-margin-form"
              rules={[
                {
                  validator: (_, value) =>
                    (value && getStartDate().add(-1, "days") < moment(value)) ||
                    !value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("End date must before Start date"),
                        ),
                },
                { message: requiredMessage("End Date"), required: true },
              ]}
              label="End Date"
              required
            >
              <DateComponent
                dateDisable={handleDisableEndDate}
                disabled={getStartDate() === null}
              />
            </Form.Item>
          ) : null}
          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
            className="w-full"
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              value={remark}
              placeholder={"Type your remark"}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </div>
      </Form>
    </ModalCustom>
  );
};

export default ModalInactivateWithHierarchy;
