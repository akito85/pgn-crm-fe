import React, { useCallback, useEffect, useState } from 'react';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import { Form, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import SVGIcon from '../../../../../assets/Icon/index';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import BreadCrumb from '../../../../../components/BreadCrumb';
import BaseContainer from '../../../../../components/BaseContainer';
import InputComponent from '../../../../../components/InputComponent';
import { formMessageRequired } from '../../../../../utils';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import DetailText from '../../../../../components/DetailText';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAccountingRules, getDetailAccountingRules, updateAccountingRules } from '../../../../../redux/slices/account_management/MasterData/accounting_rules';
import ModalBack from '../../../../../components/Modal/ModalBack';
import accountManagementService from '../../../../../redux/services/account_management/accountManagementService';
import { validateCreateUpdate } from '../../../../../redux/slices/general_slice';
import { useTryAgainHooks } from '../../../../../utils/useTryAgainHooks';

const FormAccountingRules = ({ type }) => {
    const { loading, data_detail } = useSelector(state => state?.accounting_rules);
    const { bodyError, isLoading } = useSelector(state => state?.general);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // use state
    const [modalBack, setModalBack] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [body, setBody] = useState({});
    const [form] = Form.useForm();


    // assert data
    const assert = useCallback((data) => {
        if (data) {
            form.setFieldsValue({
                classificationTypeName: data?.classificationTypeName,
                code: data?.code,
                receivableAccount: data?.receivableAccount,
                revenueAccount: data?.revenueAccount,
                description: data?.description
            })
        }
    }, [form])

    // use effect
    useEffect(() => {
        if (location?.state?.id && type === 'update') {
            dispatch(getDetailAccountingRules(location?.state?.id));
        }
    }, [dispatch, location?.state?.id, type]);

    useEffect(() => {
        if (data_detail && type === "update") {
            assert(data_detail);
        }
    }, [assert, data_detail, type]);


    // handle cancel 
    const handleCancel = () => {
        setOpenConfirmation(false)
        setModalBack(false)
    };

    // handle confirmation
    const handleFinish = async (formValue) => {
        try {
            let validateValueObj;
            let body;

            if (type === 'update') {
                body = {
                    ...formValue,
                    masterAccountingRuleId: location?.state?.id
                }
                validateValueObj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: `/v1/dbs/api/accounting-rules/validate-update`,
                    type
                }
            } else {
                body = formValue
                validateValueObj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: `/v1/dbs/api/accounting-rules/validate-create`,
                    type
                }
            }
            setBody({ body: body, validateValue: validateValueObj });
            await dispatch(validateCreateUpdate(validateValueObj))?.unwrap()
            setOpenConfirmation(true);
        } catch (error) {
            setOpenConfirmation(false);
        }
    };

    // handle save
    const handleSave = async () => {
        if (type === 'create') {
            await dispatch(createAccountingRules(body?.body))?.unwrap();
        } else {
            await dispatch(updateAccountingRules(body?.body))?.unwrap();
        }
        setOpenConfirmation(false);
        form.resetFields();
    }
    // handle reset 
    const handleReset = () => {
        if (type === 'create') {
            form.resetFields();
        } else {
            assert(data_detail);
        }
    };

    // handle retry
    const handleRetry = () => {
        handleCancelTryAgain()
        if (bodyError?.action ==='GET_DETAIL_ACCOUNTING_RULES') {
            dispatch(getDetailAccountingRules(location?.state?.id));
        } else if (bodyError?.action === 'CREATE_ACCOUNTING_RULES') {
            dispatch(createAccountingRules(body?.body))
        } else if (bodyError?.action === 'UPDATE_ACCOUNTING_RULES') {
            dispatch(updateAccountingRules(body?.body))
        } else {
            dispatch(validateCreateUpdate(body?.validateValue))
        }
    }

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "System Setup",
        },
        {
            path: "",
            breadcrumbName: "Master Data",
        },
        {
            path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNTING_RULES,
            breadcrumbName: "Meter Reading Codes",
        },
        {
            path: "",
            breadcrumbName: type === 'update' ? 'Update Accounting Rules' : 'Create Accounting Rules',
        },
    ];

    return (
        <LayoutMenu>
            <Spin spinning={loading || isLoading}>
                <BreadCrumb routes={routes} />
                <Form form={form} layout={'vertical'} onFinish={handleFinish}>
                    <BaseContainer header={'accounting rules information'}>
                        <div className='w-full grid grid-cols-4 gap-5'>
                            <Form.Item
                                label={'Classification Type'}
                                name={'classificationTypeName'}
                                rules={formMessageRequired('Classification Type')}
                            >
                                <InputComponent />
                            </Form.Item>
                            <Form.Item
                                label={'Code'}
                                name={'code'}
                                rules={formMessageRequired('Code')}
                            >
                                <InputComponent />
                            </Form.Item>
                            <Form.Item
                                label={'Receivable Account'}
                                name={'receivableAccount'}
                                rules={formMessageRequired('Receivable Account')}
                            >
                                {/* <SelectComponent>

                                </SelectComponent> */}
                                <InputComponent />
                            </Form.Item>
                            <Form.Item
                                label={'Revenue Account'}
                                name={'revenueAccount'}
                                rules={formMessageRequired('Revenue Account')}
                            >
                                <InputComponent />
                            </Form.Item>
                        </div>
                        <div className='w-full'>
                            <Form.Item
                                label={'Description'}
                                name={'description'}
                            >
                                <InputComponent type={'textarea'} />
                            </Form.Item>
                        </div>
                    </BaseContainer>
                    <div className='w-full my-5 flex gap-5'>
                        <ButtonComponent
                            icon={
                                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
                            }
                            type="submit"
                            onClick={() => setModalBack(true)}
                        >
                            Back
                        </ButtonComponent>
                        <div className={"w-full flex justify-end gap-2"}>
                            <ButtonComponent
                                icon={
                                    <SVGIcon
                                        name={
                                            type === "update" ? `IconButtonReset` : `IconButtonClear`
                                        }
                                        width={24}
                                    />
                                }
                                type="submit"
                                onClick={handleReset}
                            >
                                {type === "update" ? "Reset" : "Clear"}
                            </ButtonComponent>
                            <Form.Item>
                                <ButtonComponent type="submit" htmlType={"submit"}>
                                    Save
                                </ButtonComponent>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Spin>
            <ModalCustom
                isOpen={openConfirmation}
                handleCancel={handleCancel}
                type={'confirmation'}
                width={900}
                header={'confirmation'}
                footer={[
                    <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                        <ButtonComponent
                            onClick={handleCancel}
                            type="default"
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            onClick={handleSave}
                            type={'submit'}
                        >
                            Confirm
                        </ButtonComponent>
                    </div>
                ]}
            >
                <div>
                    <div className="text-primary text-xs font-bold uppercase py-4">
                        Accounting Rules Information
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'Classification Type'}>{body?.body?.classificationTypeName}</DetailText>
                        <DetailText label={'Code'}>{body?.body?.code}</DetailText>
                        <DetailText label={'Receivable Account'}>{body?.body?.receivableAccount}</DetailText>
                        <DetailText label={'Revenue Account'}>{body?.body?.revenueAccount}</DetailText>
                    </div>
                    <div className='w-full'>
                        <DetailText label={'Description'}>{body?.body?.description}</DetailText>
                    </div>
                </div>
            </ModalCustom>

            {/* modal try again */}
            {renderModal()}


            {/* Modal Back */}
            <ModalBack
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
            />
        </LayoutMenu>
    );
}

export default FormAccountingRules;
