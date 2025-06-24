import React, { useEffect, useRef } from "react";
import {
  DownloadOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  EditOutlined,
  WarningOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  CheckSquareFilled,
} from "@ant-design/icons";
import { Collapse, Form, Space, Spin, Switch } from "antd";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Fragment } from "react";
import { requiredMessage } from "../../../../../../../utils";
import InputComponent from "../../../../../../../components/InputComponent";
import DetailText from "../../../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import { getAccountingRule } from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";

const AccountingRule = ({ id = 0 }) => {
  const dispatch = useDispatch();
  const { data_accountingRule, loading } = useSelector(
    (state) => state.financialInformation
  );

  //declare
  const [form] = Form.useForm();

  //useEffect
  useEffect(() => {
    if (id) {
      dispatch(getAccountingRule(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_accountingRule) {
      form.setFieldsValue(data_accountingRule);
    }
  }, [id, data_accountingRule]);

  return (
    <Spin spinning={loading}>
      <Fragment>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"Accounting Rule Information"}
        </div>

        <Form form={form}>
          <div className="w-full grid grid-cols-2 gap-2">
            <Form.Item
              name={"receivableAccount"}
              rules={[
                {
                  message: requiredMessage("Receivable Account"),
                  required: true,
                },
              ]}
            >
              <InputComponent
                label={"Receivable Account"}
                mandatory
                disabled
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name={"revenueAccount"}
              rules={[
                {
                  message: requiredMessage("Revenue Account"),
                  required: true,
                },
              ]}
            >
              <InputComponent
                label={"Revenue Account"}
                mandatory
                disabled
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>

        <div className="w-full">
          <DetailText>
            <span className="font-bold text-red-600">*</span> Accounting Rule GL
            Account taken from filled Classification Type in Account Information
          </DetailText>
        </div>
        {/* </Spin> */}
      </Fragment>
    </Spin>
  );
};

export default AccountingRule;
