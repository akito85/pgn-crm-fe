import React from "react";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import StatusComponent from "../../../../../../components/StatusComponent";

const ERInstallmentCalculationDetailSection = ({ installmentsByCurrency = {} }) => {
  const currencies = Object.keys(installmentsByCurrency);

  return (
    <CardContainerNoBorder header="INSTALLMENT CALCULATION DETAIL" collapsible={true}>
      <SubSectionCard>
        {currencies.length === 0 ? (
          <p className="text-gray-500">No calculation details available.</p>
        ) : (
          currencies.map((currency) => {
            const rows = installmentsByCurrency[currency] || [];
            // Filter to only Open or partially paid? For mockup, just show rows
            const isIdr = currency === "IDR";
            const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

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
                title: "STATUS",
                dataIndex: "status",
                align: "center",
                render: () => {
                  return (
                    <div className="flex justify-center">
                      <StatusComponent colour="success">Open</StatusComponent>
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
                  idTable={`er-calc-detail-${currency}`}
                  dataSource={rows}
                  columns={columns}
                  usePagination={false}
                  showAdvanceSearch={true}
                  showSearchBar={true}
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

export default ERInstallmentCalculationDetailSection;
