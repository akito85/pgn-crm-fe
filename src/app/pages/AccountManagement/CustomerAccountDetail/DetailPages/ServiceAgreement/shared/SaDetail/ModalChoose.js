import {useState, useEffect, useRef, useMemo, useCallback} from 'react'
import { FilterOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { DatePicker, Input, Spin, Tooltip } from 'antd'
import moment from 'moment'
import ModalCustom from '../../../../../../../../components/Modal/ModalCustom'
import ButtonComponent from '../../../../../../../../components/ButtonComponent'
import NxTable from '../../../../../../../../components/Nx/NxTable'
import { dateFormatting } from '../../../../../../../../utils'

const ModalChooseProduct = ({
  modalChooseProduct,
  setModalChooseProduct,
  loadingChooseProduct = false,
  dataProduct=[],
  getProductDetailById,
  getListProduct,
  idAccount,
  serviceType,
  dispatch,
  isMain,
  saRecordData
}) => {

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [orderSort, setOrderSort] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  // USE EFFECT
  useEffect(() => {
    setIsLoading(true);
    const body = {
      idAccount: idAccount,
      serviceTypeId: serviceType,
      idProductType: isMain ? 245 : 287
    }
    if(saRecordData.typeSa != "amandemen"){
      dispatch(getListProduct({body:body})).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [serviceType])

  // Process all data (filter, sort)
  const processedData = useMemo(() => {
    let result = [...dataProduct];
    if (searchedColumn) {
      result = result.filter((item) =>
        item[searchedColumn]?.toString()?.toLowerCase().includes(searchText?.toLowerCase())
      );
    }
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = a[fieldSort]?.toString()?.toLowerCase() || "";
        let fb = b[fieldSort]?.toString()?.toLowerCase() || "";
        if (fa < fb) return orderSort === "asc" ? -1 : 1;
        if (fa > fb) return orderSort === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [dataProduct, searchedColumn, searchText, fieldSort, orderSort]);

  // Infinite scroll: slice processedData
  useEffect(() => {
    const sliced = processedData.slice(0, loadedCount);
    setDisplayData(sliced);
    setHasMore(loadedCount < processedData.length);
  }, [processedData, loadedCount]);

  // Handle infinite scroll load more
  const handleLoadMore = useCallback(() => {
    return new Promise((resolve) => {
      setLoadedCount((prev) => prev + 20);
      resolve();
    });
  }, [])

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (_, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setLoadedCount(20);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productName',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRODUCT TYPE",
      dataIndex: "productType",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productType',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'serviceType',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "PRODUCT CLASS",
      dataIndex: "productClass",
      width: 150,
      sorter: true,
      ...getColumnSearchProps(
        'productClass',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, r) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined onClick={() => {
                if (loadingChooseProduct) return;
                getProductDetailById(r?.id)
              }} style={{color: "#0075BF", cursor: "pointer"}}/>
            </Tooltip>
          </div>
        );
      },
    },
  ]


  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };



  return (
    <div>
      {/* Modal Choose Product */}
      <ModalCustom
        isOpen={modalChooseProduct}
        loading={loadingChooseProduct}
        type="confirmation"
        header={"CHOOSE PRODUCT"}
        width={1200}
        handleCancel={() => setModalChooseProduct(false)}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              disabled={loadingChooseProduct}
              onClick={() => setModalChooseProduct(false)}
            >
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <Spin spinning={loadingChooseProduct}>
          <span className="text-primary uppercase font-bold pb-4">
            PRODUCT INFORMATION
          </span>

          <div className="w-full py-4">
            <NxTable
              idTable="modal-choose-product-table"
              dataSource={displayData}
              columns={columns}
              totalData={processedData.length}
              tableScrolled={{
                x: "max-content",
                y: 400,
              }}
              usePagination={false}
              useInfiniteScroll={true}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              loadMoreThreshold={2}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              columnDefinitions={columns.map((col) => ({
                key: col.key || col.dataIndex || col.title,
                title: col.title,
              }))}
              onChange={onSort}
              loading={isLoading}
              showAdvanceSearch={false}
              showSearchBar={false}
            />
          </div>
        </Spin>
      </ModalCustom>
    </div>
  )
}

export default ModalChooseProduct
