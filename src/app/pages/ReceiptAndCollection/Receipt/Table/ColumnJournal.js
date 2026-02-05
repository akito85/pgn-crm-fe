import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

/**
 * Column definitions for Journal Information tables (Journal 1 & Journal 2)
 * Based on procedure: pack_accounting.f_get_accounting_aloc
 */
export const columnJournal = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
) => {
    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <input
                    ref={searchInput}
                    placeholder={`Search ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 90 }}
                    >
                        Search
                    </button>
                    <button onClick={() => clearFilters()} style={{ width: 90 }}>
                        Reset
                    </button>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
    });

    return [
        {
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: 'JOIN ORGANIZATION CODE IN SAP',
            dataIndex: 'bukrs', // Backend field name
            key: 'bukrs',
            width: 250,
            ellipsis: true,
            ...getColumnSearchProps('bukrs', 'Join Organization Code'),
        },
        {
            title: 'YEAR',
            dataIndex: 'ryear', // Backend field name
            key: 'ryear',
            width: 100,
            align: 'center',
            sorter: (a, b) => (a.ryear || '').localeCompare(b.ryear || ''),
            ...getColumnSearchProps('ryear', 'Year'),
        },
        {
            title: 'MONTH',
            dataIndex: 'monat', // Backend field name
            key: 'monat',
            width: 100,
            align: 'center',
            sorter: (a, b) => (a.monat || '').localeCompare(b.monat || ''),
            ...getColumnSearchProps('monat', 'Month'),
        },
        {
            title: 'POST BATCH NUMBER',
            dataIndex: 'zbatch', // Backend field name
            key: 'zbatch',
            width: 200,
            ellipsis: true,
            ...getColumnSearchProps('zbatch', 'Post Batch Number'),
        },
        {
            title: 'TRANSACTION NUMBER',
            dataIndex: 'zno_pembayaran', // Backend field name
            key: 'zno_pembayaran',
            width: 200,
            ellipsis: true,
            ...getColumnSearchProps('zno_pembayaran', 'Transaction Number'),
        },
    ];
};

export default columnJournal;
