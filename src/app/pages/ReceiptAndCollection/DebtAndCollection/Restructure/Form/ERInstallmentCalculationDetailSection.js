import React from "react";
import { Table } from "antd";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import SectionCard from "../../../../../../components/SectionCard";
import StatusComponent from "../../../../../../components/StatusComponent";

const ERInstallmentCalculationDetailSection = ({ installmentsByCurrency = {} }) => {
  const currencies = Object.keys(installmentsByCurrency);

  const getStatusColour = (status) => {
    const s = (status || "Open").toLowerCase();
    if (s === "partially paid") return "warning";
    if (s === "broken") return "danger";
    if (s === "release") return "info";
    if (s === "paid" || s === "open") return "success";
    return "success";
  };

  return (
    <CardContainerNoBorder header="PAYMENT PLAN DETAIL" collapsible={true}>
      <SubSectionCard>
        {currencies.length === 0 ? (
          <p className="text-gray-500">No calculation details available.</p>
        ) : (
          currencies.map((currency) => {
            const rows = installmentsByCurrency[currency] || [];
            const isIdr = currency === "IDR";
            const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(String(r.amount).replace(/,/g, "")) || 0), 0);

            const columns = [
              {
                title: "NO",
                dataIndex: "key",
                width: 50,
                align: "center",
                render: (_, __, i) => i + 1,
              },
              { title: "PERIOD", dataIndex: "periode" },
              {
                title: "TOTAL AMOUNT",
                dataIndex: "amount",
                align: "right",
                render: (val) => {
                  const num = parseFloat(String(val).replace(/,/g, "")) || 0;
                  return (
                    <span className="font-medium">
                      {num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                    </span>
                  );
                },
              },
              {
                title: "DUE DATE",
                dataIndex: "dueDate",
                render: (val) => val || "-",
              },
              {
                title: "BALANCE",
                dataIndex: "balance",
                align: "right",
                render: (balance) => {
                  const num = balance != null ? parseFloat(balance) : 0;
                  return (
                    <span className="font-medium text-gray-500">
                      {num.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
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
                  return (
                    <div className="flex justify-center">
                      <StatusComponent colour={getStatusColour(finalStatus)}>{finalStatus}</StatusComponent>
                    </div>
                  );
                },
              },
            ];

            // Last balance = balance of last row from backend
            const lastBalance = rows.length > 0 && rows[rows.length - 1].balance != null
              ? parseFloat(rows[rows.length - 1].balance)
              : 0;

            return (
              <div key={currency} className="mb-4">
                <SectionCard title={`CURRENCY ${currency}`}>
                  <TableRBI
                    idTable={`er-calc-detail-${currency}`}
                    dataSource={rows}
                    columns={columns}
                    usePagination={false}
                    showAdvanceSearch={true}
                    showSearchBar={true}
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row className="font-bold text-[12px] bg-[#F5F5F5]">
                          <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                            Total
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                            {totalAmount.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} />
                          <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                            {lastBalance.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} />
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

export default ERInstallmentCalculationDetailSection;
