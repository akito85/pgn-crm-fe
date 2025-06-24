import { Button, Form, Input, Upload } from 'antd';
import React, { useCallback, useState } from 'react';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import SVGIcon from "../../../../../assets/Icon/index";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile, updateProfile } from '../../../../../redux/slices/user_management/profile';
import { formMessageRequired } from '../../../../../utils';

const ChangeProfileLayout = (props) => {
    const { data, header } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [disabledButton, setDisabled] = useState(true);
    // reset 
    const onReset = () => {
        form.setFieldsValue({
            file: data?.data?.urlImage1,
            name: data?.data?.employeeName,
            username: data?.data?.username,
            email: data?.data?.email,
            phone: data?.data?.phoneNumber?.substring(2)
        })
    };
    useEffect(() => {
        onReset();
    }, [data, form])

    const onFinish = async (formValue) => {
        const body = {
            ...formValue,
            phone: "62" + formValue?.phone
        }
        await dispatch(updateProfile(body)).unwrap();
        await dispatch(getProfile()).unwrap();
    }

    const handleChangeValue = useCallback((e) => {
        if ((Object.keys(e)[0] === 'email' && e?.email !== data?.data?.email)) {
            setDisabled(false)
        } else if ((Object.keys(e)[0] === 'phone' && e?.phone !== data?.data?.phoneNumber?.substring(2))) { 
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [data?.data?.email, data?.data?.phoneNumber]);


    return (
        <div>
            <Form layout={'vertical'} form={form} onFinish={onFinish} onValuesChange={e => handleChangeValue(e)}>
                <span className={'text-primary text-xs font-bold my-3'}> {header}</span>
                <div className={'mt-2'}>
                    <Form.Item label={'Name'} name={'name'}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label={'Username'} name={'username'}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label={'Email'} name={'email'} rules={formMessageRequired('email')}>
                        <Input maxLength={50} />
                    </Form.Item>
                    <Form.Item label={`Mobile Phone (use 62)`} name={'phone'} rules={formMessageRequired('mobile phone')}>
                        <Input addonBefore={'62'} onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]|^0+/g, ''))} maxLength={11} />
                    </Form.Item>
                </div>
                <div className={'flex w-full justify-end gap-2'}>
                    <ButtonComponent type={'submit'} icon={<SVGIcon name="IconButtonClear" width={24} />} onClick={onReset}>Clear</ButtonComponent>
                    <ButtonComponent type={'submit'} htmlType={'submit'} disabled={disabledButton}>Save</ButtonComponent>
                </div>
            </Form>
        </div>
    );
}

export default ChangeProfileLayout;
