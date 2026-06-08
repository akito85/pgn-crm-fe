import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

export const getRefundDetailColumns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  search = {}
) => {
  return [
    { 
      title: "NO", 
      width: 60, 
      render: (text, object, index) => (page - 1) * pageSize + index + 1 
    },
    { 
      title: "RECEIPT CODE", 
      dataIndex: "receiptCode", 
      width: 220,
      sorter: true,
      ...getColumnSearchPropsPaging("receiptCode", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => record.receiptCode || record.warrantyCode || "" 
    },
    { 
      title: "ACCOUNT", 
      dataIndex: "accountNumber", 
      width: 200,
      sorter: true,
      ...getColumnSearchPropsPaging("accountNumber", searchInput, searchedColumn, searchText, handleSearch),
      render: (text, record) => record.accountNumber || "" 
    },
    { 
      title: "BALANCE", 
      dataIndex: "currencyBalance", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => (text || 0).toLocaleString() 
    },
    { 
      title: "AMOUNT", 
      dataIndex: "amount", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => (text || 0).toLocaleString() 
    },
    { 
      title: "REFUND AMOUNT", 
      dataIndex: "refundAmount", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => (text || 0).toLocaleString() 
    },
    { 
      title: "UOM", 
      dataIndex: "currency", 
      width: 100,
      sorter: true,
      ...getColumnSearchPropsPaging("currency", searchInput, searchedColumn, searchText, handleSearch),
    },
    { 
      title: "AMOUNT IDR", 
      dataIndex: "amountIdr", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "AMOUNT EQV USD", 
      dataIndex: "amountEqvUsd", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "AMOUNT IDR(TAX PURPOSE)", 
      dataIndex: "amountIdrTax", 
      width: 200, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "DISCOUNT", 
      dataIndex: "discount", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "TOTAL", 
      dataIndex: "total", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "TOTAL EQV IDR", 
      dataIndex: "totalEqvIdr", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    },
    { 
      title: "TOTAL EQV USD", 
      dataIndex: "totalEqvUsd", 
      width: 150, 
      align: "right", 
      sorter: true,
      render: (text) => text ? "(value)" : "-"
    }
  ];
};
