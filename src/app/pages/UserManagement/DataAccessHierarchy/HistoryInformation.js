import React from 'react';
import BaseContainer from '../../../../components/BaseContainer';
import DetailText from '../../../../components/DetailText';
import moment from 'moment';
import { dateFormatting } from '../../../../utils';

const HistoryInformation = ({data}) => {
    return (
        <BaseContainer header={'HISTORY LOG INFORMATION'}>
            <div className={'w-full flex flex-row justify-between'}>
                <div className={'w-full'}>
                    <DetailText label={"Record Id"}>{data?.dahId}</DetailText>
                </div>
                <div className={'w-full'}>
                    <DetailText label={"Created Date"}>{moment(data?.createdDate).format(dateFormatting.dateTime)}</DetailText>
                </div>
                <div className={'w-full'}>
                    <DetailText label={"Created By"}>{data?.createdBy}</DetailText>
                </div>
                <div className={'w-full'}>
                    <DetailText label={"Updated Date"}>{data?.updatedDate !== null && moment(data?.updatedDate).format(dateFormatting.dateTime)}</DetailText>
                </div>
                <div className={'w-full'}>
                    <DetailText label={"Updated By"}>{data?.updatedBy}</DetailText>
                </div>
            </div>
        </BaseContainer>
    );
}

export default HistoryInformation;
