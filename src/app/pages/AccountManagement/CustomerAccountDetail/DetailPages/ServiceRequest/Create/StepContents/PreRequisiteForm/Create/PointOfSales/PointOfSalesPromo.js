import { PlusOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../../../components/ButtonComponent";

import NxTable from "../../../../../../../../../../../components/Nx/NxTable";

const PointOfSalesPromo = () => {



  const columnMain = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "PROMOTION TYPE",
      dataIndex: "promotionType",
      width: 120,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "CRITERIA",
      dataIndex: "criteria",
      width: 200,
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 120,
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 120,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "ACTION",
      dataIndex: "action",
      width: 100,
    }
  ];
  
  return (
    <>
      <NxTable
        columnMain={columnMain}
        dataMain={null}
      />
    </>
  )
}

export { PointOfSalesPromo }


