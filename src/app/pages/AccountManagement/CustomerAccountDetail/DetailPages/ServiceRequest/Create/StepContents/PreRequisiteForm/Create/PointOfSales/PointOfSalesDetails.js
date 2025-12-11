import { PlusOutlined } from "@ant-design/icons"

import ButtonComponent from "../../../../../../../../../../../components/ButtonComponent";

import NxTable from "../../../../../../../../../../../components/Nx/NxTable";

const PointOfSalesDetails = () => {

  const columnMain = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeName",
      width: 250,
      // editable: true,
      // sorter: true,
      // inputType: "select",
      // options: dataInputType,
    },
    {
      title: "ITEM",
      dataIndex: "itemName",
    },
    {
      title: "PRICE",
      dataIndex: "price",
    },
    {
      title: "REFERENCE",
      dataIndex: "reference"
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity"
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage"
    },
    {
      title: "AMOUNT",
      dataIndex: "amount"
    },
    {
      title: "IDR",
      dataIndex: "idr"
    },
    {
      title: "EQUIVALENT USD",
      dataIndex: "equivalentUSD"
    }
  ];
  return (
    <>
      <div className="w-full flex justify-end items-center gap-2.5 mb-5">
        <ButtonComponent
          type={"submit"}
          // onClick={handleCreateClick}
          icon={
            <PlusOutlined
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            />
          }
          style={{
            backgroundColor: "#0075bf",
            color: "#fff",
            borderColor: "#0075bf",
            border: "1px solid #0075bf",
            borderRadius: "5px",
            height: "48px",
          }}
        >
          Create
        </ButtonComponent>
      </div>

      <NxTable
        columnMain={columnMain}
        dataMain={null}
      />
    </>
  )
}

export { PointOfSalesDetails }


