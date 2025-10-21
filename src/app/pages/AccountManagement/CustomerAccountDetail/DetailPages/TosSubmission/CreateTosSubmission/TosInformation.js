import React, { useState } from "react";
import BaseContainer from "../../../../../../../components/BaseContainer";
import { Button, Form, Input } from "antd";
import SelectComponent from "../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import DateComponent from "../../../../../../../components/DateComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import { requiredMessage } from "../../../../../../../utils";
import TableDetailTos from "./TableDetailTos";
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
  form,
}) => {
  const [modalSelectTos, setModalSelectTos] = useState(false);
  const handleDisableEndDate = (current) => {
    // if (tosSubmissionObj.startDate !== null) {
    //   return type === "create"
    //     ? moment(tosSubmissionObj.startDate) >= current
    //     : moment(tosSubmissionObj.startDate) > current;
    // }
    // return moment().add(-1, "days") >= current;
    if (type === "create") {
      return (
        current &&
        (moment(tosSubmissionObj.startDate) >= current ||
          current > moment(saMainEndDate).add(1, "days"))
      );
    } else {
      return (
        current &&
        (moment(tosSubmissionObj.startDate) >= current ||
          current > moment(saMainEndDate))
      );
    }
  };

  const disabledDate = (current) => {
    // return false;
    if (moment(saMainStartDate).diff(moment(), "days") < 30) {
      return (
        current &&
        (current < moment(saMainStartDate) ||
          current > moment(saMainEndDate).add(1, "days"))
      );
    } else {
      return (
        current &&
        (current <= moment().subtract(1, "months") ||
          current > moment(saMainEndDate).add(1, "days"))
      );
    }
  };

  const resetEndDate = () => {
    form.resetFields(["endDate"]);
  };
  return (
    <div className="drop-shadow-lg bg-white rounded-lg w-full mt-[30px] p-[20px]">
      {/* SECTION CHOOSE TERM OF SERVICE */}
      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            CHOOSE TERM OF SERVICE
          </h3>
        </div>
        <div className={"grid grid-cols-3 w-full gap-x-6"}>
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
            <div className="flex flex-row">
              <Input.Group compact>
                <InputComponent
                  disabled={true}
                  value={tosSubmissionObj?.tosName}
                  // value={addressTable?.map((a) => a.fullAddress)[0]}
                />
                <Button type="primary" onClick={() => setModalSelectTos(true)}>
                  Choose
                </Button>
              </Input.Group>
            </div>
          </Form.Item>
        </div>
      </div>

      {/* SECTION TERM OF SERVICE DETAIL - TABLE */}
      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            TERM OF SERVICE DETAIL
          </h3>
        </div>
        <div className="w-ful">
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
        </div>
      </div>

      {/* SECTION TERM OF SERVICE SUBMISSION INFORMATION */}
      <div className="pt-8 pb-4">
        <h3 className="text-primary text-xs font-bold uppercase">
          TERM OF SERVICE SUBMISSION INFORMATION
        </h3>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className={"grid grid-cols-3 w-full gap-4"}>
          <Form.Item
            name={"startDate"}
            rules={[{ message: requiredMessage("Start Date"), required: true }]}
            className="no-margin-form"
            getValueFromEvent={(e) => updateTosSubmission(e, "startDate")}
            label="Start Date"
            required
          >
            <DateComponent dateDisable={disabledDate} onChange={resetEndDate} />
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
                        moment(tosSubmissionObj.startDate) <=
                          moment(value)))) ||
                  !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("End date must before Start date"),
                      ),
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
  );
};

export default TosInformation;
