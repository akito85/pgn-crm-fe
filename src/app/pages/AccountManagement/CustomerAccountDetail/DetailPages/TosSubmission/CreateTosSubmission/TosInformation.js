import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import InputComponent from "../../../../../../../components/InputComponent";
import DateComponent from "../../../../../../../components/DateComponent";
import { requiredMessage } from "../../../../../../../utils";
import TableDetailTos from "../../../../../ProductAndPromo/Product/ProductForm/TermOfService/TableDetailTos";
import moment from "moment";
import ModalSelectTos from "./ModalSelectTos";

const TosInformation = ({
  idSA,
  editDetail = true,
  type,
  tosSubmissionObj = {},
  setTosSubmissionObj = () => {},
  updateTosSubmission = (e, type) => {
    return e;
  },
  dataDetail = [],
  updateDataDetail = () => {},
  saMainStartDate,
  saMainEndDate,
  form
}) => {
  const [modalSelectTos, setModalSelectTos] = useState(false);
  const handleDisableEndDate = (current) => {
    // if (tosSubmissionObj.startDate !== null) {
    //   return type === "create"
    //     ? moment(tosSubmissionObj.startDate) >= current
    //     : moment(tosSubmissionObj.startDate) > current;
    // }
    // return moment().add(-1, "days") >= current;
    if(type === "create"){
      return current && (moment(tosSubmissionObj.startDate) >= current || current > moment(saMainEndDate).add(1, "days"));
    }else{
      return current && (moment(tosSubmissionObj.startDate) >= current || current > moment(saMainEndDate));
    }
  };

  const disabledDate = (current) => {
    // return false;
    if(moment(saMainStartDate).diff(moment(), 'days') < 30){
      return current && (current < moment(saMainStartDate) || current > moment(saMainEndDate).add(1, "days"));
    }else{
      return current && (current <= moment().subtract(1, "months") || current > moment(saMainEndDate).add(1, "days"))    
    }
  };

  const handleStartDateChange = (value) => {
    form.resetFields(["endDate"]);
    form.setFieldsValue({ appliedDate: value });
    updateTosSubmission(value, "appliedDate");
    return updateTosSubmission(value, "startDate");
  };

  return (
    <NxCardContainer
      type="profile"
      hideChildren
      className="mt-[30px]"
      element={(
        <div className="flex flex-col gap-4">
          <NxBaseContainer header="TERM OF SERVICE SUBMISSION INFORMATION" border>
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-3 w-full gap-4">
                <Form.Item
                  label={"Term of Service Name"}
                  name={"tosName"}
                  rules={[
                    {
                      message: requiredMessage("Term of Service Name"),
                      required: true,
                    },
                  ]}
                  valuePropName={tosSubmissionObj?.tosName}
                >
                  <Input.Group compact>
                    <InputComponent disabled={true} value={tosSubmissionObj?.tosName} />
                    <Button type="primary" onClick={() => setModalSelectTos(true)}>
                      Choose
                    </Button>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name={"startDate"}
                  rules={[{ message: requiredMessage("Start Date"), required: true }]}
                  className="no-margin-form"
                  getValueFromEvent={handleStartDateChange}
                  label="Start Date"
                  required
                >
                  <DateComponent dateDisable={disabledDate} />
                </Form.Item>

                <Form.Item
                  name={"endDate"}
                  className="no-margin-form"
                  rules={[
                    {
                      validator: (_, value) =>
                        (value &&
                          ((type === "create" &&
                            moment(tosSubmissionObj.startDate) < moment(value)) ||
                            (type === "update" &&
                              moment(tosSubmissionObj.startDate) <= moment(value)))) ||
                        !value
                          ? Promise.resolve()
                          : Promise.reject(new Error("End date must before Start date")),
                    },
                    { message: requiredMessage("End Date"), required: true },
                  ]}
                  getValueFromEvent={(e) => updateTosSubmission(e, "endDate")}
                  label="End Date"
                  required
                >
                  <DateComponent
                    dateDisable={handleDisableEndDate}
                    disabled={!tosSubmissionObj.startDate}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 w-full gap-4">
                <Form.Item name={"appliedDate"} className="no-margin-form" label="Applied Date">
                  <DateComponent disabled={true} />
                </Form.Item>
              </div>

              <div className={"grid grid-cols-1 w-full gap-x-6"}>
                <Form.Item
                  name={"remark"}
                  className="w-full"
                  getValueFromEvent={(e) => updateTosSubmission(e, "remark")}
                  label={"Remark"}
                >
                  <InputComponent type="textarea" value={tosSubmissionObj.remark} />
                </Form.Item>
              </div>
            </div>
          </NxBaseContainer>

          <NxBaseContainer header="TERM OF SERVICE DETAIL" border>
            <TableDetailTos
              type={"form"}
              editDetail={editDetail}
              dataTable={
                editDetail
                  ? dataDetail
                  : dataDetail.filter((item) => item?.attribute?.value !== 112)
              }
              updateTable={updateDataDetail}
            />
          </NxBaseContainer>

          {modalSelectTos ? (
            <ModalSelectTos
              idSA={idSA}
              dataObj={tosSubmissionObj}
              handleCancel={() => setModalSelectTos(false)}
              modalDetail={modalSelectTos}
              updateObj={setTosSubmissionObj}
              updateTable={updateDataDetail}
            />
          ) : null}
        </div>
      )}
    >
    </NxCardContainer>
  );
};

export default TosInformation;
