import React from 'react';
import DetailText from '../../../../components/DetailText';
import moment from 'moment';
import CardComponent from '../../../../components/Card/CardComponent';
import { dateFormatting, toTitleCase } from '../../../../utils';
import { intToNPWP } from '../../../../utils/npwp';

const TaxIdentifierDetail = ({ data }) => {
    return (
        <>
            <CardComponent header={"TAX IDENTIFIER INFORMATION"} cols={3}>
                <DetailText label={"Tax Identifier"}>{intToNPWP(data?.data?.taxNumber)}</DetailText>
                <DetailText label={"Status"}>{toTitleCase(data?.data?.status)}</DetailText>
                <DetailText label={"Primary Flag"}>
                    {data?.data?.isMain === true ? "Priamry" : "Non Primary"}
                </DetailText>
                <DetailText label={"Start Date"}>{data?.data?.startDate && moment(data?.data?.startDate).format(dateFormatting.dateCapital)}</DetailText>
                <DetailText label={"End Date"}>{data?.data?.endDate && moment(data?.data?.endDate).format(dateFormatting.dateCapital)}</DetailText>
                <DetailText label={"Description"}>
                    {data?.data?.remark}
                </DetailText>
            </CardComponent>
            <CardComponent header={"HIstory log information"} cols={5}>
                <DetailText label={"Record Id"}>
                    {data?.data?.taxId}
                </DetailText>
                <DetailText label={"Created Date"}>
                    {data?.data?.createdDate && moment(data?.data?.createdDate).format(dateFormatting.dateTime)}
                </DetailText>
                <DetailText label={"Created By"}>
                    {data?.data?.createdBy}
                </DetailText>
                <DetailText label={"Updated Date"}>
                    {data?.data?.updatedDate && moment(data?.data?.updatedDate).format(dateFormatting.dateTime)}
                </DetailText>
                <DetailText label={"Updated By"}>
                    {data?.data?.updatedBy}
                </DetailText>
            </CardComponent>
        </>

    );
}

export default TaxIdentifierDetail;
