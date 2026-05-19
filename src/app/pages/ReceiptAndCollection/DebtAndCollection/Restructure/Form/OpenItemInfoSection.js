import React from "react";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";

const OpenItemInfoSection = ({ openItems = [] }) => {
  const columns = [
    { title: "NO", dataIndex: "key", width: 50, render: (_, __, i) => i + 1 },
    { title: "INVOICE NO", dataIndex: "invoiceNo" },
    { title: "INVOICE PERIOD", dataIndex: "invoicePeriod" },
    { title: "BILLING ITEM", dataIndex: "billingItem" },
    { 
      title: "AMOUNT", 
      dataIndex: "amount", 
      align: "right",
      render: (amount, record) => {
        const num = parseFloat(String(amount).replace(/,/g, "")) || 0;
        return num.toLocaleString(record.currency === "IDR" ? "id-ID" : "en-US", { maximumFractionDigits: 2 });
      }
    },
  ];

  // Group items by currency
  const grouped = openItems.reduce((acc, item) => {
    const cur = item.currency || "IDR";
    if (!acc[cur]) acc[cur] = [];
    acc[cur].push(item);
    return acc;
  }, {});

  const currencies = Object.keys(grouped);

  if (currencies.length === 0) {
    return (
      <CardContainerNoBorder header="OPEN ITEM INFORMATION" collapsible={true}>
        <SubSectionCard>
          <p className="text-gray-400 text-sm text-center py-4">Tidak ada data open item.</p>
        </SubSectionCard>
      </CardContainerNoBorder>
    );
  }

  return (
    <CardContainerNoBorder header="OPEN ITEM INFORMATION" collapsible={true}>
      {currencies.map((currency) => {
        const rows = grouped[currency];
        const total = rows.reduce((sum, r) => {
          const num = parseFloat(String(r.amount).replace(/,/g, "")) || 0;
          return sum + num;
        }, 0);

        return (
          <SubSectionCard key={currency} title={`CURRENCY ${currency}`} className="mb-4">
            <TableRBI
              idTable={`open-item-${currency}`}
              columns={columns}
              dataSource={rows}
              usePagination={false}
              showAdvanceSearch={false}
              showSearchBar={false}
            />
            <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
              <div className="flex-[4] text-center">TOTAL</div>
              <div className="flex-1 text-right pr-4">
                {total.toLocaleString(currency === "IDR" ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>
          </SubSectionCard>
        );
      })}
    </CardContainerNoBorder>
  );
};

export default OpenItemInfoSection;
