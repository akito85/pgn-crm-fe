import { Col, Form, Row } from "antd";
import React from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerListColumns } from "./CustomerColumns";

const OffsetForm = ({
    onChooseCustomer,
    showCustomerInfo = true,
    showOffsetInfo = true,
    disabled = false,
    selectedCustomers = []
}) => {
    const columns = getCustomerListColumns({
        page: 1,
        pageSize: 10,
    });

    return (
        <div className="flex flex-col gap-5">
            {showCustomerInfo && (
                <BaseContainer header={
                    <div className="flex justify-between items-center w-full -my-2.5">
                        <span>CUSTOMER INFORMATION</span>
                        {!disabled && (
                            <ButtonComponent
                                type="primary"
                                onClick={onChooseCustomer}
                            >
                                Choose Customer
                            </ButtonComponent>
                        )}
                    </div>
                }>
                    <div className="p-4">
                        <TableRBI
                            columns={columns}
                            dataSource={selectedCustomers}
                            usePagination={false}
                            showSearchBar={false}
                            showAdvanceSearch={false}
                        />
                    </div>
                </BaseContainer>
            )}

            {showOffsetInfo && (
                <BaseContainer header={"OFFSET INFORMATION"}>
                    <div className="p-4">
                        <p className="text-gray-400 italic">Offset entries will be managed here...</p>
                    </div>
                </BaseContainer>
            )}
        </div>
    );
};

export default OffsetForm;
