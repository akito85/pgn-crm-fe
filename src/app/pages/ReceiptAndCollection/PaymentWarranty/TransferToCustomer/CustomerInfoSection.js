import React from "react";
import { Table, Form, Col } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import SVGIcon from "../../../../../assets/Icon";
import TableRBI from "../../../../../components/TableRBI";
import EditableCell from "./EditableCell";

import SubSectionCard from "../../../../../components/SubSectionCard";

const CustomerInfoSection = ({ 
    customerList, 
    columnsCustomer, 
    handleAddCustomer, 
    page, 
    pageSize, 
    handlePageChange, 
    handleSizeChange,
    handleGlobalSearch
}) => {
    return (
        <CardContainerNoBorder 
            header={"CUSTOMER INFORMATION"}
            collapsible={true}
        >
            <div className="flex flex-col gap-4">
                <div className="mx-2 mb-4">
                    <SubSectionCard>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-end">
                                <ButtonComponent
                                    type="primary"
                                    onClick={handleAddCustomer}
                                    icon={<SVGIcon name="IconButtonCreate" width={20} />}
                                >
                                    Create
                                </ButtonComponent>
                            </div>
                            
                            <TableRBI
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                columns={columnsCustomer}
                                dataSource={customerList}
                                pagination={false}
                                tableScrolled={{ x: 1000 }}
                                totalData={customerList?.length || 0}
                                current={page}
                                pageSize={pageSize}
                                showSearchBar={true}
                                showAdvanceSearch={true}
                                useSelect={true}
                                onSearch={handleGlobalSearch}
                                onChange={handlePageChange}
                                onSizeChanger={handleSizeChange}
                            />
                        </div>
                    </SubSectionCard>
                </div>
            </div>
        </CardContainerNoBorder>
    );
};

export default CustomerInfoSection;
