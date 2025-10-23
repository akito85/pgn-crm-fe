import React, { useState } from 'react';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import BreadCrumb from '../../../../../components/BreadCrumb';
import BaseContainer from '../../../../../components/BaseContainer';
import { RBI_ROUTES } from '../../../../../routes/rating_billing/rbi_routes';
import RadioTabs from '../../../../../components/RadioTabs';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import SVGIcon from "../../../../../assets/Icon/index";
import UploadLayout from '../UploadLayout';
import ApprovalLayout from '../ApprovalLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Form, Spin } from 'antd';
import { getDownloadTemplate } from '../../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import { useMonitoringList } from '../useMonirotingList';


const UploadPage = () => {
    const { loading } = useMonitoringList();
    const [tabHeader, setTabHeader] = useState('Upload');
    const [uploadedDocument, setUploadedDocument] = useState(null);
    const [apphierId, setApphierId] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dataTabs] = useState([
        {
            key: "upload",
            value: "Upload",
        },
        {
            key: "approval",
            value: "Approval",
        },
    ]);
    // onFinish action
    const onFinish = (formValue) => {
        // console.log(formValue, ' formValue');
    };
    // clear form
    const onClear = () => {
        form.resetFields();
    }
    // change tabs 
    const changeTabHeader = (e) => {
        setTabHeader(e.target.value);
    }

    const handleApprovalChangeFromLayout = (newApphierId) => {
        setApphierId(newApphierId);
    };

    const handleSave = () => {
        // console.log("handleSave")
    }

    const routes = [
        {
            path: "",
            breadcrumbName: "Rating Billing",
        },
        {
            path: RBI_ROUTES.MONITORING_USAGE_VIEW,
            breadcrumbName: "Monitoring Usage",
        },
        {
            path: "",
            breadcrumbName: "Upload",
        },
    ]

    const handleDownloadTemplate = async () => {
        await dispatch(getDownloadTemplate()).unwrap();
        // .then((response) => {
        //     // openNotification("success","Success", "Template successfully dowloaded");
        //     console.log('Download successful', response);
        // })
        // .catch((error) => {
        //     // openNotification("error","Error", error.message);
        //     console.error('Download failed', error);
        // });
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>

                <div className={'w-full flex flex-col'}>
                    {/* <div className={'w-full flex justify-start'}>
                    <RadioTabs data={dataTabs} onChange={changeTabHeader} />
                </div> */}
                    <div className={'w-full flex justify-end'}>
                        {tabHeader === 'Upload' &&
                            <ButtonComponent
                                type={'submit'}
                                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                                onClick={handleDownloadTemplate}
                            >
                                Download Template
                            </ButtonComponent>

                        }
                    </div>
                </div>
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <BaseContainer header={tabHeader === 'Upload' ? '' : 'Approval information'}>
                        {tabHeader === 'Upload' ? (
                            <UploadLayout type={'file-upload'} onDocumentUpload={(document) => setUploadedDocument(document)} />
                        ) : (
                            <ApprovalLayout type={'approval-upload'} uploadedDocument={uploadedDocument} onApprovalChange={handleApprovalChangeFromLayout} />
                        )}
                    </BaseContainer>
                    <div className={'w-full flex mt-5'}>
                        <div className={'w-full justify-start'}>
                            <Form.Item>
                                <ButtonComponent
                                    type={'submit'}
                                    icon={
                                        <LeftOutlined
                                            style={{
                                                color: "#fff",
                                                fontSize: 16,
                                                justifyItems: "left",
                                            }}
                                        />}
                                    // onClick={handleBackPage}
                                    onClick={() => navigate(-1)}>
                                    Back
                                </ButtonComponent>
                            </Form.Item>
                        </div>
                        {/* <div className={'w-full justify-end flex gap-2'}>
                            <Form.Item>
                                <ButtonComponent
                                    type={'submit'}
                                    icon={
                                        <SVGIcon
                                            name={
                                                `IconButtonClear`
                                            }
                                            width={24}
                                        />
                                    }
                                    onClick={onClear}
                                >
                                    Clear
                                </ButtonComponent>
                            </Form.Item>
                            <Form.Item>
                                <ButtonComponent
                                    type={'submit'}
                                    htmlType={'submit'}
                                    onClick={() => {
                                        handleSave()
                                        setIsSubmit(false)
                                    }}
                                >
                                    Submit as Draft
                                </ButtonComponent>
                            </Form.Item>
                            <Form.Item>
                                <ButtonComponent
                                    type={'submit'}
                                    htmlType={'submit'}
                                    onClick={() => {
                                        handleSave()
                                        setIsSubmit(true)
                                    }}
                                >
                                    Save & Submit
                                </ButtonComponent>
                            </Form.Item>
                        </div> */}
                    </div>
                </Form>
            </Spin>
        </LayoutMenu>
    );
}

export default UploadPage;
