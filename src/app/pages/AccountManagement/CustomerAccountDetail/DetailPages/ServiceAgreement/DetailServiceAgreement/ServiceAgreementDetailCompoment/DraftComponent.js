import React from 'react'
import moment from 'moment'

import DetailText from '../../../../../../../../components/DetailText'
import { dateFormatting } from '../../../../../../../../utils'
import Attachment from '../Attachment'

const DraftComponent = ({dataDetailDraft}) => {
  const dataAttachment = (dataDetailDraft?.attachment || []).map(
    (item) => {
      return {
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.type,
        category: item.fileCategoryName,
        categoryName: item.categoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        uploadBy: item.createdBy,
        uploadDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "",
        dataType: "exist",
      };
    }
  );
  return (
    <div>
      <div>
        <div className="py-4 text-primary text-xs font-bold uppercase">
          SERVICE AGREEMENT INFORMATION DRAFT
        </div>
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label={"End Date"}>{moment(dataDetailDraft?.saInfo?.endDate).format(dateFormatting.date)}</DetailText>
          <DetailText label={"Description"}>{dataDetailDraft?.saInfo?.description}</DetailText>
        </div>
      </div>

      <Attachment dataSource={dataAttachment}/>
    </div>
  )
}

export default DraftComponent