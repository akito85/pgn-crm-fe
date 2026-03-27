import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import ModalCustom from '../../../../../../../../../components/Modal/ModalCustom'
import NxTable from '../../../../../../../../../components/Nx/NxTable'
import { Table, Tooltip, Space } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import ButtonComponent from '../../../../../../../../../components/ButtonComponent';
import { getColumnSearchProps } from '../../../../../../../../../utils/getColumnSearchProps';

const expandedRowRender = (record) => {
  const contactDetail = record?.rtosAttributes || [];
  const getAttributeRowKey = (item, index) => {
    if (item?.key !== undefined && item?.key !== null && item?.key !== "") {
      return String(item.key);
    }

    if (item?.id !== undefined && item?.id !== null && item?.id !== "") {
      return String(item.id);
    }

    if (item?.attributeId !== undefined && item?.attributeId !== null && item?.attributeId !== "") {
      return String(item.attributeId);
    }

    const attributeName = item?.attributeName || "attribute";
    const value = item?.value || "value";
    return `${attributeName}-${value}-${index}`;
  };

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'ATTRIBUTE',
      dataIndex: 'attributeName',
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
    },
    {
      title: 'UNIT',
      dataIndex: 'unit',
    },
    {
      title: 'FROM ITEM',
      dataIndex: 'fromItem',
    }
  ];

  return (
    <div>
      <Table
        dataSource={contactDetail}
        columns={columns}
        pagination={false}
        rowKey={getAttributeRowKey}
      />
    </div>
  );
};

const ModalChooseTos = ({
  isOpen,
  setModalChooseTos,
  getListChooseTos,
  dispatch,
  idAccount,
  dataListChooseTos,
  handleSelectTos = () => { },
  isIdChoose = []
}) => {
  const searchInput = useRef(null);
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const [fieldSort, setFieldSort] = useState('');
  const [orderSort, setOrderSort] = useState('');
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ['action'],
    left: [],
  }));

  // Fetch all data once (no BE pagination)
  useEffect(() => {
    if (isOpen && idAccount) {
      setIsLoading(true);
      dispatch(getListChooseTos({ id: idAccount, page: 1, pageSize: 20, sort: '', search: '' }))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, getListChooseTos, isOpen, idAccount]);

  // Raw data flattened from BE response
  const rawData = useMemo(() => {
    const result = dataListChooseTos?.result || [];
    return result.map((a, index) => ({
      ...a,
      key: a.id ?? index + 1,
      saTosDetail: (a.saTosDetail || []).map((b, i) => ({ ...b, key: i + 1 })),
    }));
  }, [dataListChooseTos]);

  // FE-side filter + sort
  const processedData = useMemo(() => {
    let result = [...rawData];

    if (searchedColumn && searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter((item) =>
        item[searchedColumn]?.toString().toLowerCase().includes(lower)
      );
    }

    if (fieldSort) {
      result.sort((a, b) => {
        const fa = a[fieldSort]?.toString().toLowerCase() || '';
        const fb = b[fieldSort]?.toString().toLowerCase() || '';
        if (fa < fb) return orderSort === 'asc' ? -1 : 1;
        if (fa > fb) return orderSort === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rawData, searchedColumn, searchText, fieldSort, orderSort]);

  // Infinite scroll slice
  useEffect(() => {
    setDisplayData(processedData.slice(0, loadedCount));
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || '');
    setSearchedColumn(selectedKeys[0] ? dataIndex : '');
    setLoadedCount(20);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === 'ascend' ? 'asc' : 'desc');
    } else {
      setFieldSort('');
      setOrderSort('');
    }
    setLoadedCount(20);
  };

  const columns = [
    {
      title: 'NO',
      width: 60,
      align: 'center',
      render: (text, object, index) => index + 1,
    },
    {
      title: 'TERM OF SERVICE',
      dataIndex: 'name',
      sorter: true,
      ...getColumnSearchProps('name', searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      sorter: true,
      ...getColumnSearchProps('description', searchInput, searchedColumn, searchText, handleSearch),
    },
    {
      title: 'ACTION',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (v, r) => (
        <Space>
          <Tooltip title="Choose">
            <PlusCircleOutlined
              onClick={!isIdChoose.includes(r.id) ? () => handleSelectTos(r) : undefined}
              style={{
                color: '#0075BF',
                cursor: isIdChoose.includes(r.id) ? 'not-allowed' : 'pointer',
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnDefinitions = columns.map((col) => ({
    key: col.key || col.dataIndex || col.title,
    title: col.title,
  }));

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        header={'CHOOSE TERM OF SERVICE'}
        type={'confirmation'}
        handleCancel={() => setModalChooseTos(false)}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={() => setModalChooseTos(false)} type="default">
              Back
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full">
          <NxTable
            idTable="modal-choose-tos-table"
            rowKey="key"
            dataSource={displayData}
            columns={columns}
            totalData={processedData.length}
            tableScrolled={{ x: 'max-content', y: 300 }}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadMoreThreshold={2}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            columnDefinitions={columnDefinitions}
            onChange={onSort}
            loading={isLoading}
            showAdvanceSearch={false}
            showSearchBar={false}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) =>
                record?.rtosAttributes && record.rtosAttributes.length > 0,
            }}
          />
        </div>
      </ModalCustom>
    </div>
  );
};

export default ModalChooseTos;
