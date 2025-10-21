import React, { useEffect, useState } from "react";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import moment from "moment";
import { Form } from "antd";
import RadioTabs from "../../../../../components/RadioTabs";
import { requiredMessage } from "../../../../../utils";
import DateComponent from "../../../../../components/DateComponent";
import InputComponent from "../../../../../components/InputComponent";
import ApprovalSectionForm from "../../Pricing/Form/ApprovalSectionForm";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import {
  getListAppHier,
  getListAppHierDetail,
} from "../../../../../redux/slices/product_promo/product";

const ModalExtendTerminate = ({
  selectedProduct = {},
  objProductVersion = {},
  openModalExtendTerminate = false,
  header = "",
  type = "",
  handleCloseModal = () => {},
  handleSubmit = () => {},
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Product",
      paramValue: ["startDate", "endDate"],
    },
    { value: "Approval", paramValue: ["approvalHierarchy"] },
  ]);
  const [typeProductInfo, setTypeProductInfo] = useState(
    listSectionInfo[0].value,
  );
  const [remark, setRemark] = useState("");
  const [selectedHierarchy, setSelectedHierarchy] = useState("");
  const [startDate, setStartDate] = useState();
  const { dataListAppHierIdForm = [], dataListAppHierDetailForm = [] } =
    useSelector((state) => state.product);

  useEffect(() => {
    if (openModalExtendTerminate && selectedProduct.startDate) {
      setStartDate(moment(selectedProduct.startDate, "DD MMM YYYY"));
      form.resetFields();
      form.setFieldsValue({
        startDate: moment(selectedProduct.startDate, "DD MMM YYYY"),
        endDate: selectedProduct.endDate
          ? moment(selectedProduct.endDate, "DD MMM YYYY")
          : undefined,
      });
    }
  }, [openModalExtendTerminate, selectedProduct]);
  useEffect(() => {
    dispatch(getListAppHier());
  }, [dispatch]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetail({ id: selectedHierarchy }));
    }
  }, [selectedHierarchy]);
  const handleClear = () => {
    setRemark("");
    form.resetFields();
    setSelectedHierarchy("");
    setStartDate(undefined);
    setListSectionInfo([
      {
        value: "Product",
        paramValue: ["startDate", "endDate"],
      },
      { value: "Approval", paramValue: ["approvalHierarchy"] },
    ]);
  };
  const handleProductInfo = (e) => {
    setTypeProductInfo(e.target.value);
  };
  const handleCancelModalInactivateFinal = () => {
    handleCloseModal(handleClear);
  };
  const handleSaveModalExtendTerminateFinal = (formValue) => {
    handleSubmit(formValue, handleClear);
  };
  const handleDisableEndDate = (current) => {
    if (selectedProduct.startDate !== null) {
      if (type === "extend") {
        return selectedProduct.endDate
          ? current < moment(selectedProduct.endDate, "DD MMM YYYY")
          : startDate > current;
      }
      if (type === "terminate") {
        return selectedProduct.endDate
          ? current > moment(selectedProduct.endDate, "DD MMM YYYY")
          : startDate > current;
      }
    }
    return moment().add(-1, "days") >= current;
  };

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0,
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  return (
    <ModalCustom
      isOpen={openModalExtendTerminate}
      handleCancel={handleCancelModalInactivateFinal}
      header={header}
      width={850}
      type={"confirmation"}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent
            onClick={handleCancelModalInactivateFinal}
            type="default"
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="modalExtendTerminate"
            type="submit"
            htmlType="submit"
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full">
        <RadioTabs
          data={listSectionInfo}
          onChange={handleProductInfo}
          currentPosition={typeProductInfo}
        />
        <Form
          id="modalExtendTerminate"
          form={form}
          layout="vertical"
          onFinish={handleSaveModalExtendTerminateFinal}
          onFinishFailed={handleErrorSubmit}
        >
          <div
            className="flex flex-col w-full gap-4"
            style={{
              display:
                typeProductInfo !== listSectionInfo[0].value
                  ? "none"
                  : undefined,
            }}
          >
            <CardComponent header={"Product Version Information"} cols={3}>
              <DetailText label={"Product Name"}>
                {objProductVersion.productName}
              </DetailText>
              <DetailText label={"Service Type"}>
                {objProductVersion.serviceType}
              </DetailText>
              <DetailText label={"Product Type"}>
                {objProductVersion.productType}
              </DetailText>
              <DetailText label={"Product Class"}>
                {objProductVersion.productClass}
              </DetailText>
              <DetailText label={"Version"}>
                {selectedProduct.version}
              </DetailText>
              <DetailText label={"Description"}>
                {selectedProduct.description}
              </DetailText>
            </CardComponent>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name={"startDate"}
                rules={[
                  { message: requiredMessage("Start Date"), required: true },
                ]}
                className="no-margin-form"
              >
                <DateComponent label="Start Date" mandatory disabled={true} />
              </Form.Item>
              <Form.Item
                name={"endDate"}
                className="no-margin-form"
                rules={[
                  {
                    validator: (_, value) =>
                      (value &&
                        ((type === "extend" &&
                          (selectedProduct.endDate
                            ? moment(value) >=
                              moment(selectedProduct.endDate, "DD MMM YYYY")
                            : startDate <= moment(value))) ||
                          (type === "terminate" &&
                            (selectedProduct.endDate
                              ? moment(value) <=
                                moment(selectedProduct.endDate, "DD MMM YYYY")
                              : startDate <= moment(value))))) ||
                      !value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("End date must before Start date"),
                          ),
                  },
                  { message: requiredMessage("End Date"), required: true },
                ]}
              >
                <DateComponent
                  mandatory
                  label="End Date"
                  dateDisable={handleDisableEndDate}
                  disabled={selectedProduct.startDate === null}
                />
              </Form.Item>
              <div className="col-span-2">
                <Form.Item name={"remark"} className="w-full">
                  <InputComponent
                    label={"Remark"}
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div
            style={{
              display:
                typeProductInfo !== listSectionInfo[1].value
                  ? "none"
                  : undefined,
            }}
          >
            <ApprovalSectionForm
              dataTable={dataListAppHierDetailForm}
              dataOption={dataListAppHierIdForm}
              selectedHierarchy={selectedHierarchy}
              updateSelectedHierarchy={setSelectedHierarchy}
            />
          </div>
        </Form>
      </div>
    </ModalCustom>
  );
};

export default ModalExtendTerminate;
