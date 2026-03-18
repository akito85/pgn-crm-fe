import { Spin } from 'antd';
import React, { lazy, Suspense, useMemo } from 'react';
import BreadCrumb from '../../../../components/BreadCrumb';
import BaseContainer from '../../../../components/BaseContainer';
import REPORT_ROUTES from '../../../../routes/report/report_routes';
import TablePagination from '../../../../components/TablePagination';
import Toolbar from '../../../../components/Toolbar';
import useReportCustomerAgreement from './hooks/useReportCustomerAgreement';
const CustomerAgreementReport = () => {

    const {
        column,
        handleChange,
        itemActions,
        page,
        pageSize,
        onSort,
        loadings,
        data,
        renderModal
    } = useReportCustomerAgreement();


    const routes = useMemo(() => {
        return [
            {
                path: "",
                breadcrumbName: 'Report'
            },
            {
                path: REPORT_ROUTES.VIEW_CUSTOMER_AGREEMENT_REPORT,
                breadcrumbName: 'Customer Agreement Summary'
            }
        ]
    }, []);


    return (
        <Suspense fallback={<Spin />}>
            <>
                <Spin spinning={loadings}>
                    <BreadCrumb routes={routes} />

                    <Toolbar items={itemActions} />
                    <BaseContainer header={'Customer Agreement Summary'}>
                        <TablePagination
                            dataSource={data?.result}
                            totalData={data?.page?.totalElements}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChange}
                            onSizeChanger={handleChange}
                            tableScrolled={{
                                // x: 5500,
                                y: 500
                            }}
                            onSort={onSort}
                            columns={column}
                        />
                    </BaseContainer>
                </Spin>
                {renderModal()}
            </>
        </Suspense>
    );
}

export default CustomerAgreementReport;
