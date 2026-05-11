import React from "react";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";

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
            const currentSum = items.reduce(
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
              { title: "BILLING TYPE", dataIndex: "allocation" }, // Using allocation as billing type for mock
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
                <div className="text-[14px] font-semibold text-[#0075BF] mb-2 uppercase">
                  CURRENCY {currency}
                </div>
                <TableRBI
                  idTable={`er-open-item-${currency}`}
                  dataSource={items}
                  columns={columns}
                  usePagination={false}
                  showAdvanceSearch={true}
                  showSearchBar={true}
                />
                <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                  <div className="flex-[4] text-center">Total</div>
                  <div className="flex-1 text-right pr-[15px]">
                    {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </SubSectionCard>
    </CardContainerNoBorder>
  );
};

export default EROpenItemInfoSection;
