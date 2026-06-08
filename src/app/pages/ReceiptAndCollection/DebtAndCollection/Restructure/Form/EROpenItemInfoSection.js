import React from "react";
import { Table } from "antd";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import SectionCard from "../../../../../../components/SectionCard";

const EROpenItemInfoSection = ({ openItems = [] }) => {
  // Derive unique currencies from open items
  const currencies = [...new Set(openItems.map((i) => i.currency || "IDR"))];

  return (
    <CardContainerNoBorder header="OPEN ITEM INFORMATION" collapsible={true}>
      <SubSectionCard>
        {currencies.length === 0 ? (
          <p className="text-gray-500">No open items available.</p>
        ) : (
          currencies.map((currency) => {
            const items = openItems.filter((i) => (i.currency || "IDR") === currency);
            const isIdr = currency === "IDR";
            const totalAmount = items.reduce(
              (sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0),
              0
            );

            const columns = [
              {
                title: "NO",
                dataIndex: "key",
                width: 50,
                align: "center",
                render: (_, __, i) => i + 1,
              },
              { title: "INVOICE NO", dataIndex: "invoiceNo" },
              { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
              { title: "BILLING ITEM", dataIndex: "billingItem" },
              {
                title: "AMOUNT",
                dataIndex: "amount",
                align: "right",
                render: (val) => {
                  const num = parseFloat(String(val).replace(/,/g, "")) || 0;
                  return num.toLocaleString(isIdr ? "id-ID" : "en-US", {
                    maximumFractionDigits: 2,
                  });
                },
              },
            ];

            return (
              <div key={currency} className="mb-4">
                <SectionCard title={`CURRENCY ${currency}`}>
                  <TableRBI
                    idTable={`er-open-item-${currency}`}
                    dataSource={items}
                    columns={columns}
                    usePagination={false}
                    showAdvanceSearch={true}
                    showSearchBar={true}
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                          <Table.Summary.Cell index={0} colSpan={4} className="text-center font-bold">
                            Total
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                            {totalAmount.toLocaleString(isIdr ? "id-ID" : "en-US", {
                              maximumFractionDigits: 2,
                            })}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </SectionCard>
              </div>
            );
          })
        )}
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default EROpenItemInfoSection;
