import React, { lazy, Suspense, useMemo } from 'react';
import useCustomerAssetHooks from './hooks/useCustomerAssetHooks';
import { Spin } from 'antd';
import BreadCrumb from '../../../../components/BreadCrumb';
import Toolbar from '../../../../components/Toolbar';
import BaseContainer from '../../../../components/BaseContainer';
import TablePagination from '../../../../components/TablePagination';
import REPORT_ROUTES from '../../../../routes/report/report_routes';
const LayoutMenu = lazy(() => import("../../../../components/SidebarMenu/LayoutMenu"))
const CustomerAssetReport = () => {
    const {
        page,
        pageSize,
        itemActions,
        handleSort,
        handleChange,
        columns

    } = useCustomerAssetHooks();

    const routes = useMemo(() => {
        return [
            {
                path: "",
                breadcrumbName: 'Report'
            },
            {
                path: REPORT_ROUTES.VIEW_CUSTOMER_ASSET_REPORT,
                breadcrumbName: 'Report Customer Asset'
            }
        ]
    }, []);

    return (
        <Suspense fallback={<Spin />}>

            <LayoutMenu>
                <BreadCrumb routes={routes} />
                <Toolbar items={itemActions} />
                <Spin spinning={false}>
                    <BaseContainer header={'Report Customer Asset '}>
                        <TablePagination
                            dataSource={[]}
                            columns={columns}
                            current={page}
                            pageSize={pageSize}
                            totalData={[]}
                            onChange={handleChange}
                            onSizeChanger={handleChange}
                            onSort={handleSort}
                        />

                    </BaseContainer>
                </Spin>
            </LayoutMenu>
        </Suspense>
    );
}

export default CustomerAssetReport;
