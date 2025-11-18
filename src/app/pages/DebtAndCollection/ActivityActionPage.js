import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space, Popconfirm, notification, Spin, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import {
  fetchResultOptions,
  deleteResultOption,
} from '../../../redux/collectionActivityResultOptionSlice';
import LayoutMenu from '../../../components/SidebarMenu/LayoutMenu';
import BreadCrumb from '../../../components/BreadCrumb';
import Toolbar from '../../../components/Toolbar';
import BaseContainer from '../../../components/BaseContainer';
import TablePaginationNew from '../../../components/TablePaginationNew';
import ButtonComponent from '../../../components/ButtonComponent';
import SVGIcon from '../../../assets/Icon';
import { DEBT_AND_COLLECTION_ROUTES } from '../../../routes/DebtAndCollection/rc_routes';

// Breadcrumbs configuration
const routes = [
  { path: "", breadcrumbName: "Debt & Collection" },
  { path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_ACTION, breadcrumbName: "Activity Action" },
];

const ActivityActionPage = () => {
  const dispatch = useDispatch();
  const { data, pagination, loading, error } = useSelector(
    (state) => state.collectionActivityResultOption
  );

  useEffect(() => {
    dispatch(
      fetchResultOptions({
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      notification.error({ message: 'Error', description: error });
    }
  }, [error]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchResultOptions({ page: page - 1, size: pageSize }));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteResultOption(id)).unwrap();
      notification.success({ message: 'Successfully Deleted' });
      handleTableChange(1, pagination.pageSize);
    } catch (err) {
      // Error is handled by slice
    }
  };

  const columns = [
    { title: 'Activity ID', dataIndex: 'mpMActivityId', key: 'mpMActivityId' },
    { title: 'Result Code', dataIndex: 'resultCode', key: 'resultCode' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Update">
            <Link to={DEBT_AND_COLLECTION_ROUTES.UPDATE_ACTIVITY_ACTION} state={{ id: record.mpMActivityResultOptId }}>
              <SVGIcon name="IconEdit" width={24} />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => handleDelete(record.mpMActivityResultOptId)}
              okText="Yes"
              cancelText="No"
            >
              <div className="cursor-pointer">
                <SVGIcon name="IconDelete" width={24} />
              </div>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const toolbarItems = [
    {
      action: "Create",
      render: (
        <Link to={DEBT_AND_COLLECTION_ROUTES.CREATE_ACTIVITY_ACTION}>
          <ButtonComponent icon={<SVGIcon name="IconButtonCreate" width={24} />}>
            Create
          </ButtonComponent>
        </Link>
      ),
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading} tip="Loading...">
        <BreadCrumb routes={routes} />
        <div className="flex flex-col w-full">
          <Toolbar items={toolbarItems} />
          <BaseContainer header="Activity Action List">
            <TablePaginationNew
              columns={columns}
              dataSource={data}
              totalData={pagination.total}
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              onChange={handleTableChange}
              tableScrolled={{ y: 525, x: 'auto' }}
              rowKey="mpMActivityResultOptId"
            />
          </BaseContainer>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ActivityActionPage;
