import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { InputNumber, Table, DatePicker } from "antd";
import moment from "moment";
import CardContainerNoBorder from "../../../../../../components/CardContainerNoBorder";
import TableRBI from "../../../../../../components/TableRBI";
import SubSectionCard from "../../../../../../components/SubSectionCard";
import { PAYMENT_PLAN_TYPES } from "../../../../../../constants/restructure";

const formatMonth = (dayjsObj, offset) => {
  if (typeof dayjsObj.clone === "function") {
    return dayjsObj.clone().add(offset, "month").format("MMM YYYY");
  }
  return dayjsObj.add(offset, "month").format("MMM YYYY");
};

const formatDueDate = (dayjsObj, offset) => {
  if (typeof dayjsObj.clone === "function") {
    return dayjsObj.clone().add(offset, "month").endOf("month").format("DD/MM/YYYY");
  }
  return dayjsObj.add(offset, "month").endOf("month").format("DD/MM/YYYY");
};

const RePlanDetailSection = ({ planInfo = {}, openItems = [], onValidationChange, onInstallmentsChange }) => {
  const { data_detail } = useSelector((state) => state.restructure);
  const { type, tenor, startPeriod } = planInfo;
  const isAutomatic = type && (String(type).toUpperCase() === PAYMENT_PLAN_TYPES.AUTOMATIC_KEY || String(type) === PAYMENT_PLAN_TYPES.AUTOMATIC);

  // Derive unique currencies from open items
  const currencies = [...new Set(openItems.map((i) => i.currency || "IDR"))];

  // Group items by currency to get total per currency
  const openItemTotals = openItems.reduce((acc, item) => {
    const cur = item.currency || "IDR";
    const amount = parseFloat(String(item.amount).replace(/,/g, "")) || 0;
    acc[cur] = (acc[cur] || 0) + amount;
    return acc;
  }, {});

  // installmentsByCurrency: { IDR: [...rows], USD: [...rows] }
  const [installmentsByCurrency, setInstallmentsByCurrency] = useState({});

  useEffect(() => {
    if (onInstallmentsChange) {
      onInstallmentsChange(installmentsByCurrency);
    }
  }, [installmentsByCurrency, onInstallmentsChange]);

  // Validation reporting
  useEffect(() => {
    if (isAutomatic) {
      if (onValidationChange) onValidationChange(true);
      return;
    }

    const hasError = currencies.some((currency) => {
      const rows = installmentsByCurrency[currency] || [];
      const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
      const targetTotal = openItemTotals[currency] || 0;
      return Math.abs(currentSum - targetTotal) > 0.01;
    });

    if (onValidationChange) onValidationChange(!hasError);
  }, [installmentsByCurrency, isAutomatic, currencies, openItemTotals, onValidationChange]);

  // Regenerate rows for all currencies when tenor, startPeriod, or type changes
  useEffect(() => {
    if (!tenor || !startPeriod || currencies.length === 0) {
      setInstallmentsByCurrency({});
      return;
    }

    const savedRest = data_detail?.data?.restructure || data_detail?.restructure;
    const savedTenor = savedRest?.tenor;
    const savedStartPeriod = savedRest?.startPeriod;
    const formStartFormatted = startPeriod && typeof startPeriod.format === "function" ? startPeriod.format("YYYY-MM") : "";
    const savedStartFormatted = savedStartPeriod ? (savedStartPeriod.includes("-") ? savedStartPeriod.substring(0, 7) : savedStartPeriod) : "";

    const isUnchanged = (!savedTenor || Number(tenor) === Number(savedTenor)) &&
                        (!savedStartPeriod || formStartFormatted === savedStartFormatted);

    const calculationList = data_detail?.data?.calculationList || data_detail?.calculationList;
    if (calculationList && calculationList.length > 0 && isUnchanged) {
      const generated = {};
      calculationList.forEach((c) => {
        const cur = c.currency || "IDR";
        if (!generated[cur]) generated[cur] = [];
        generated[cur].push({
          key: generated[cur].length + 1,
          periode: c.periode || c.period,
          amount: String(c.amount || 0),
          dueDate: c.dueDate || c.due_date || "",
          currency: cur,
        });
      });
      setInstallmentsByCurrency(generated);
      return;
    }

    const generated = {};
    currencies.forEach((currency) => {
      const totalForCurrency = openItemTotals[currency] || 0;
      const isIdr = currency === "IDR";
      
      // Calculate exact division
      const exactBase = totalForCurrency / tenor;

      // Helper to round down to the highest magnitude (e.g., 333,333 -> 300,000, 1,200,000 -> 1,000,000)
      const getCleanBaseAmount = (amount) => {
        if (amount <= 0) return 0;
        const intPart = Math.floor(amount);
        if (intPart === 0) return 0;
        const mag = Math.pow(10, intPart.toString().length - 1);
        return Math.floor(amount / mag) * mag;
      };

      const baseAmount = getCleanBaseAmount(exactBase);
      
      const rows = Array.from({ length: tenor }, (_, i) => {
        let amount = baseAmount;
        
        // Put all the remainder/difference in the FIRST row
        if (i === 0) {
          const distributedLater = baseAmount * (tenor - 1);
          amount = totalForCurrency - distributedLater;
        }

        return {
          key: i + 1,
          periode: formatMonth(startPeriod, i),
          amount: isIdr ? amount.toString() : amount.toFixed(2),
          dueDate: formatDueDate(startPeriod, i),
          currency,
        };
      });

      generated[currency] = rows;
    });
    setInstallmentsByCurrency(generated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenor, startPeriod, type, openItems.length, data_detail]);

  const handleAmountChange = (currency, key, value) => {
    const strValue = value !== null && value !== undefined ? String(value) : "0";
    setInstallmentsByCurrency((prev) => ({
      ...prev,
      [currency]: prev[currency].map((row) =>
        row.key === key ? { ...row, amount: strValue } : row
      ),
    }));
  };

  const handleDueDateChange = (currency, key, date) => {
    const formattedDate = date ? date.format("DD/MM/YYYY") : "";
    setInstallmentsByCurrency((prev) => ({
      ...prev,
      [currency]: prev[currency].map((row) =>
        row.key === key ? { ...row, dueDate: formattedDate } : row
      ),
    }));
  };

  const buildColumns = (currency) => [
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
      render: (_, record) => {
        const isIdr = currency === "IDR";
        if (isAutomatic) {
          return (
            <span className="font-medium">
              {parseFloat(record.amount).toLocaleString(isIdr ? "id-ID" : "en-US", {
                maximumFractionDigits: 2,
              })}
            </span>
          );
        }
        return (
          <InputNumber
            value={record.amount}
            placeholder="0"
            style={{ width: "100%" }}
            className="text-right"
            controls={false}
            formatter={(value) => {
              if (value === undefined || value === null || value === "") return "";
              const strVal = String(value);
              const isNegative = strVal.startsWith("-");
              let absVal = isNegative ? strVal.slice(1) : strVal;
              
              if (isIdr) {
                const parts = absVal.split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                return (isNegative ? "-" : "") + parts.join(",");
              } else {
                const parts = absVal.split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return (isNegative ? "-" : "") + parts.join(".");
              }
            }}
            parser={(value) => {
              if (value === undefined || value === null || value === "") return "";
              if (isIdr) {
                return value.replace(/\./g, "").replace(/,/g, ".");
              } else {
                return value.replace(/,/g, "");
              }
            }}
            onChange={(val) => handleAmountChange(currency, record.key, val)}
          />
        );
      },
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      render: (text, record) => {
        if (isAutomatic) {
          return <span>{text}</span>;
        }
        const momentVal = record.dueDate ? moment(record.dueDate, "DD/MM/YYYY") : null;
        return (
          <DatePicker
            value={momentVal}
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            allowClear={false}
            disabledDate={(current) => {
              if (!startPeriod) return false;
              return current && current < startPeriod.clone().startOf("month");
            }}
            onChange={(date) => handleDueDateChange(currency, record.key, date)}
          />
        );
      }
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      align: "right",
      render: (_, record, index) => {
        const isIdr = currency === "IDR";
        const targetTotal = openItemTotals[currency] || 0;
        // Calculate running sum up to this row from the CURRENT state of rows
        const rows = installmentsByCurrency[currency] || [];
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
  ];

  if (!tenor || !startPeriod) {
    return (
      <CardContainerNoBorder header="RE-PLAN DETAIL" collapsible={true}>
        <SubSectionCard>
          <p className="text-gray-400 text-sm text-center py-4">
            Silakan isi Type, Tenor, dan Start Period pada Re-Plan Information.
          </p>
        </SubSectionCard>
      </CardContainerNoBorder>
    );
  }

  return (
    <CardContainerNoBorder header="RE-PLAN DETAIL" collapsible={true}>
      {currencies.map((currency) => {
        const rows = installmentsByCurrency[currency] || [];
        const currentSum = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        const targetTotal = openItemTotals[currency] || 0;
        const isIdr = currency === "IDR";
        
        // Difference to validate
        const diff = Math.abs(currentSum - targetTotal);
        const isError = !isAutomatic && diff > 0.01; // Allow small rounding diff for non-IDR

        return (
          <SubSectionCard key={currency} title={`CURRENCY ${currency}`} className="mb-4">
            <TableRBI
              idTable={`replan-detail-${currency}`}
              columns={buildColumns(currency)}
              dataSource={rows}
              usePagination={false}
              showAdvanceSearch={false}
              showSearchBar={false}
              showColumnSettings={false}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row className={`font-bold text-[12px] ${isError ? "bg-red-50 text-red-500" : "bg-[#F5F5F5]"}`}>
                    <Table.Summary.Cell index={0} colSpan={2} className="text-center font-bold">
                      TOTAL
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="text-right font-bold pr-4">
                      {currentSum.toLocaleString(isIdr ? "id-ID" : "en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3} className="text-right font-bold pr-4 text-gray-500">
                      {targetTotal.toLocaleString(isIdr ? "id-ID" : "en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
            {isError && (
              <p className="text-red-500 text-[11px] mt-1 text-right italic font-normal">
                * Total must be equal to {targetTotal.toLocaleString(isIdr ? "id-ID" : "en-US", { maximumFractionDigits: 2 })}
              </p>
            )}
          </SubSectionCard>
        );
      })}
    </CardContainerNoBorder>
  );
};

export default RePlanDetailSection;
