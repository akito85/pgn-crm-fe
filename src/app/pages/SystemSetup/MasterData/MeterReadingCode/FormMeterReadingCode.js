import React, { useCallback, useEffect, useState } from 'react';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Select, Spin } from 'antd';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import BreadCrumb from '../../../../../components/BreadCrumb';
import BaseContainer from '../../../../../components/BaseContainer';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import SVGIcon from "../../../../../assets/Icon/index";
import DetailText from '../../../../../components/DetailText';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import { createMeterReadingCode, getDetailMeterReadingCode, getListCostCenterMeterReading, updateMeterReadingCode } from '../../../../../redux/slices/account_management/MasterData/meter_reading_code_slice';
import { formMessageRequired } from '../../../../../utils';
import InputComponent from '../../../../../components/InputComponent';
import SelectComponent from '../../../../../components/SelectComponent';
import { validateCreateUpdate } from '../../../../../redux/slices/general_slice';
import ModalBack from '../../../../../components/Modal/ModalBack';
import accountManagementService from '../../../../../redux/services/account_management/accountManagementService';
import { useTryAgainHooks } from '../../../../../utils/useTryAgainHooks';

const FormMeterReadingCode = ({ type }) => {
    const { data_cost_center, loading, data_detail } = useSelector(state => state?.meter_reading_code);
    const { bodyError, isLoading } = useSelector((state) => state?.general);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const tokenJSON = localStorage.getItem('token') || window.sessionStorage.getItem('token');
    const tokenParsed = JSON.parse(tokenJSON);
    const location = useLocation();

    // use state
    const [modalBack, setModalBack] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [body, setBody] = useState({});

    // assert data
    const assert = useCallback((data) => {
        if (data) {
            form.setFieldsValue({
                costCenterId: data?.costCenterId,
                code: data?.code,
                description: data?.description
            });
        }
    }, [form])

    // use effect
    useEffect(() => {
        dispatch(getListCostCenterMeterReading());
        if (location?.state?.id && type === 'update') {
            dispatch(getDetailMeterReadingCode(location?.state?.id));
        }
    }, [dispatch, location, type]);
    
    useEffect(() => {
        if (data_cost_center && (tokenParsed?.userLevel !== 'Super User')) {
            form.setFieldsValue({
                costCenterId: data_cost_center?.map(item => item?.value)[0]
            })
        }
    }, [data_cost_center, form, tokenParsed]);

    useEffect(() => {
        if (data_detail && type === "update") {
            assert(data_detail)
        }
    }, [assert, data_detail, type])


    // handle cancel 
    const handleCancel = () => {
        setOpenConfirmation(false)
        setModalBack(false)
    };


    // handle confirmation
    const handleFinish = async (formValue) => {
        try {
            let body;
            let validateValueOBj;
            if (type === 'update') {
                body = { ...formValue, meterReadingCodeId: location?.state?.id }
                validateValueOBj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: '/v1/dbs/api/meter-reading-codes/validate-update',
                    type
                }
            } else {
                body = formValue;
                validateValueOBj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: '/v1/dbs/api/meter-reading-codes/validate-create',
                    type
                }
            }
            setBody({
                body: body,
                validateValue: validateValueOBj
            });
            await dispatch(validateCreateUpdate(validateValueOBj))?.unwrap()
            setOpenConfirmation(true);
        } catch (error) {
            setOpenConfirmation(false);
        }
    };

    // handle save
    const handleSave = async () => {
        setOpenConfirmation(false);
        if (type === 'create') {
            await dispatch(createMeterReadingCode(body?.body))?.unwrap();
        } else {
            await dispatch(updateMeterReadingCode(body?.body))?.unwrap();
        }
    }

    // handle reset 
    const handleReset = () => {
        if (type === 'create') {
            form.resetFields(['code', 'description']);
        } else {
            assert(data_detail);
        }
    };

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
            path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_METER_READING_CODES,
            breadcrumbName: "Meter Reading Code",
        },
        {
            path: "",
            breadcrumbName: type === 'update' ? "Update Meter Reading Code" : 'Create Meter Reading Code',
        },
    ];

    // handle retry
    const handleRetry = () => {
        handleCancelTryAgain()
        if (bodyError?.action === "GET_DETAIL_METER_READING_CODE") {
            dispatch(getDetailMeterReadingCode(location?.state?.id));
        } else if (bodyError?.action ==="CREATE_METER_READING_CODE") {
            dispatch(createMeterReadingCode(body?.body))
        } else if (bodyError?.action ==="UPDATE_METER_READING_CODE") {
            dispatch(updateMeterReadingCode(body?.body))
        } else if (bodyError?.action ==="VALIDATE_CREATE_UPDATE") {
            dispatch(validateCreateUpdate(body?.validateValue))
        }else{
            dispatch(getListCostCenterMeterReading());
        }
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
    return (
        <LayoutMenu>
            <Spin spinning={loading || isLoading}>
                <BreadCrumb routes={routes} />
                <Form form={form} layout={'vertical'} onFinish={handleFinish}>
                    <BaseContainer header={'meter reading codes information'}>
                        <div className='grid grid-cols-2 gap-3'>
                            <Form.Item label={'Cost Center'} name={'costCenterId'} rules={formMessageRequired('Cost Center')}>
                                <SelectComponent disabled={tokenParsed?.userLevel !== 'Super User' && tokenParsed?.userLevel !== 'Admin Entity'}>
                                    {data_cost_center?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item label={'Code'} name={'code'} rules={formMessageRequired('Code')}>
                                <InputComponent />
                            </Form.Item>
                        </div>
                        <Form.Item label={'Description'} name={'description'}>
                            <InputComponent type={'textarea'} />
                        </Form.Item>
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
                        meter reading codes information
                    </div>
                    <div className='w-full grid grid-cols-2'>
                        <DetailText label={'Cost Center'}>
                            {
                                data_cost_center?.filter(item => item?.value === body?.body?.costCenterId)[0]?.name
                            }
                        </DetailText>
                        <DetailText label={'Meter Reading Code'}>{body?.body?.code}</DetailText>
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

export default FormMeterReadingCode;
