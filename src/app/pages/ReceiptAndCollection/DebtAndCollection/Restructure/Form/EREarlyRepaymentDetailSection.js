import React from "react";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import StatusComponent from "../../../../../../components/StatusComponent";

const EREarlyRepaymentDetailSection = ({ installmentsByCurrency = {}, onInstallmentDetailIdsChange, openItems = [] }) => {
  const currencies = Object.keys(installmentsByCurrency);

  return (
    <CardContainerNoBorder header="EARLY REPAYMENT DETAIL" collapsible={true}>
      <SubSectionCard>
        {currencies.length === 0 ? (
          <p className="text-gray-500">No installments available.</p>
        ) : (
          currencies.map((currency) => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
            
            // Group items by currency to get total per currency
            const openItemTotals = openItems.reduce((acc, item) => {
              const cur = item.currency || "IDR";
              const amount = parseFloat(String(item.amount).replace(/,/g, "")) || 0;
              acc[cur] = (acc[cur] || 0) + amount;
              return acc;
            }, {});
            const targetTotal = openItemTotals[currency] || 0;

            const columns = [
              {
                title: "NO",
                dataIndex: "key",
                width: 50,
                align: "center",
                render: (_, __, i) => i + 1,
              },
              { title: "PERIODE", dataIndex: "periode" },
              {
                title: "TOTAL AMOUNT",
                dataIndex: "amount",
                align: "right",
                render: (_, record) => {
                  return (
                    <span className="font-medium">
                      {parseFloat(record.amount).toLocaleString(isIdr ? "id-ID" : "en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  );
                },
              },
              {
                title: "BALANCE",
                dataIndex: "balance",
                align: "right",
                render: (_, __, index) => {
                  const sumPaidUpToThisRow = rows
                    .slice(0, index + 1)
                    .reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);
                  const balance = Math.max(0, targetTotal - sumPaidUpToThisRow);
                  return (
                    <span className="font-medium text-gray-500">
                      {balance.toLocaleString(isIdr ? "id-ID" : "en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  );
                },
              },
              {
                title: "STATUS",
                dataIndex: "status",
                align: "center",
                render: (status) => {
                  const finalStatus = status || "Open";
                  let color = "primary";
                  if (finalStatus === "Partially Paid") color = "warning";
                  if (finalStatus === "Broken") color = "danger";
                  if (finalStatus === "Paid") color = "success";
                  if (finalStatus === "Open") color = "success";
                  return (
                    <div className="flex justify-center">
                      <StatusComponent colour={color}>{finalStatus}</StatusComponent>
                    </div>
                  );
                }
              }
            ];

            return (
              <div key={currency} className="mb-4">
                <div className="text-[14px] font-semibold text-[#0075BF] mb-2 uppercase">
                  CURRENCY {currency}
                </div>
                <TableRBI
                  idTable={`early-repay-detail-${currency}`}
                  dataSource={rows}
                  columns={columns}
                  usePagination={false}
                  showAdvanceSearch={false}
                  showSearchBar={false}
                />
                <div className="flex bg-[#F5F5F5] border border-t-0 p-2 font-bold text-[12px]">
                  <div className="flex-[3] text-center">Total</div>
                  <div className="flex-1 text-right pr-[150px]">
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

export default EREarlyRepaymentDetailSection;
