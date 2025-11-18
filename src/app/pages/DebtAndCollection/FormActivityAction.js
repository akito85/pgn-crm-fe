import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Spin, notification, Space } from 'antd'; // Added Space here
import {
  createResultOption,
  updateResultOption,
  fetchResultOptionById,
} from '../../../redux/collectionActivityResultOptionSlice';
import LayoutMenu from '../../../components/SidebarMenu/LayoutMenu';
import BreadCrumb from '../../../components/BreadCrumb';
import BaseContainer from '../../../components/BaseContainer';
import ButtonComponent from '../../../components/ButtonComponent';
import { DEBT_AND_COLLECTION_ROUTES } from '../../../routes/DebtAndCollection/rc_routes';

const FormActivityAction = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { state } = location;
  const { loading, selected, error } = useSelector(
    (state) => state.collectionActivityResultOption
  );

  const isUpdate = type === 'update';

  // Breadcrumbs
  const routes = [
    { path: '', breadcrumbName: 'Debt & Collection' },
    { path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION, breadcrumbName: 'Activity Action' },
    { path: '', breadcrumbName: isUpdate ? 'Update' : 'Create' },
  ];

  // Fetch data for update mode
  useEffect(() => {
    if (isUpdate && state?.id) {
      dispatch(fetchResultOptionById(state.id));
    }
  }, [dispatch, isUpdate, state?.id]);

  // Set form fields when data is available for update
  useEffect(() => {
    if (isUpdate && selected) {
      form.setFieldsValue(selected);
    }
  }, [selected, isUpdate, form]);
  
  // Show error notifications
  useEffect(() => {
    if (error) {
      notification.error({ message: 'Error', description: error });
    }
  }, [error]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isUpdate) {
        await dispatch(updateResultOption({ id: state.id, data: values })).unwrap();
        notification.success({ message: 'Successfully Updated' });
      } else {
        await dispatch(createResultOption(values)).unwrap();
        notification.success({ message: 'Successfully Created' });
      }
      // Redirect to the main list page
      navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION);
    } catch (err) {
      // Errors are handled by the slice
    }
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading} tip="Loading...">
        <BreadCrumb routes={routes} />
        <BaseContainer header={isUpdate ? 'Update Activity Action' : 'Create Activity Action'}>
          <Form form={form} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form.Item
              name="mpMActivityId"
              label="Activity ID"
              rules={[{ required: true, message: 'Please input the activity ID!' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="resultCode"
              label="Result Code"
              rules={[{ required: true, message: 'Please input the result code!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Space>
                <ButtonComponent
                  type="default"
                  onClick={() => navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION)}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent type="primary" onClick={handleSubmit} loading={loading}>
                  Submit
                </ButtonComponent>
              </Space>
            </Form.Item>
          </Form>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default FormActivityAction;
