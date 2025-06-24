import React,{useState, useEffect, useRef} from 'react'
import TablePagination from '../../../../../../../../../components/TablePagination'
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { Tooltip } from 'antd';
import ModalCustom from '../../../../../../../../../components/Modal/ModalCustom';
import ButtonComponent from '../../../../../../../../../components/ButtonComponent';

const TableTos = ({
  isProduct, 
  dataTermOfService, 
  setDataTermOfService, 
  openModalFormTos,
  setModalChooseTos,
  dataTosFromProductVersion,
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [modalUpdateTos, setModalUpdateTos] = useState(false)
  const [dataUpdate, setdataUpdate] = useState([])

// useEffect(() => {
//   if (dataTermOfService?.length > 0) {
//     const dataModif = dataTermOfService.map((a, index) => ({
//       ...a,
//       key: index + 1,
//       tosDetail: a.tosDetail?.map((b, index) => ({
//         ...b,
//         key: index + 1,
//       })),
//     }));
//     setDataTermOfService(dataModif);
//   }else{
//     setDataTermOfService(dataTermOfService || [])
//   }
// }, [dataTosFromProductVersion])

  // console.log(dataTermOfService, ' data tos');
  

useEffect(() => {
  setTotalElement(dataTermOfService?.length);
}, [])

  const deleteRow = (record) => {
    setDataTermOfService((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const filterDataByPage = () => {
    let result = [...dataTermOfService];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  // const columns = [
  //   {
  //     title: "NO",
  //     width: 60,
  //     align: "center",
  //     render: (text, object, index) => (page - 1) * pageSize + index + 1,
  //   },
  //   {
  //     title: "TERM OF SERVICE",
  //     dataIndex: "tosName",
  //     sorter: true,
  //     // ...getColumnSearchProps(
  //     //   "houseName",
  //     //   searchInput,
  //     //   searchedColumn,
  //     //   searchText,
  //     //   handleSearch
  //     // ),
  //   },
  //   {
  //     title: "DESCRIPTION",
  //     dataIndex: "description",
  //     sorter: true,
  //     // ...getColumnSearchProps(
  //     //   "houseName",
  //     //   searchInput,
  //     //   searchedColumn,
  //     //   searchText,
  //     //   handleSearch
  //     // ),
  //   },
  //   {
  //     title: "ACTION",
  //     align: "center",
  //     width: 100,
  //     fixed: "right",
  //     render: (_, record) => {
  //       return (
  //         <div className="flex justify-center align-middle gap-2">
  //           <Tooltip title="Edit">
  //             <span className="flex justify-center">
  //               <SVGIcon 
  //                 name="IconEdit" 
  //                 width={24} 
  //                 onClick={()=>{
  //                   setdataUpdate(record)
  //                   openModalFormTos(record)
  //                 }}
  //               />
  //             </span>
  //           </Tooltip>
  //          {isProduct === 2 && (
  //             <Tooltip title="Delete">
  //               <SVGIcon
  //                 name="IconDelete"
  //                 color={"#be3036"}
  //                 width={24}
  //                 onClick={() => {
  //                   deleteRow(record)
  //                 }}
  //               />
  //             </Tooltip>
  //          )}
  //         </div>
  //       );
  //     },
  //   },
  // ];

  
  const columns = ({
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "TERM OF SERVICE",
        dataIndex: "tosName",
        sorter: true,
        // ...getColumnSearchProps(
        //   "houseName",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        // ...getColumnSearchProps(
        //   "houseName",
        //   searchInput,
        //   searchedColumn,
        //   searchText,
        //   handleSearch
        // ),
      },
      {
        title: "ACTION",
        align: "center",
        width: 100,
        fixed: "right",
        render: (_, record) => {
          return (
            <div className="flex justify-center align-middle gap-2">
              <Tooltip title="Edit">
                <span className="flex justify-center">
                  <SVGIcon 
                    name="IconEdit" 
                    width={24} 
                    onClick={()=>{
                      setdataUpdate(record)
                      openModalFormTos(record)
                    }}
                  />
                </span>
              </Tooltip>
             {isProduct === 2 && (
                <Tooltip title="Delete">
                  <SVGIcon
                    name="IconDelete"
                    color={"#be3036"}
                    width={24}
                    onClick={() => {
                      deleteRow(record)
                    }}
                  />
                </Tooltip>
             )}
            </div>
          );
        },
      },
    ];
    return result
  }

  const expandedRowRender = (record) => {
    const dataExpand = record?.tosDetail
  
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
      }
    ];
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          TOS DETAIL
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={dataExpand}
          columns={columns}
          className={"mb-4"}
        />
      </div>
    )
  };
  
  return (
    <div>
      {isProduct === 2 && (
        <div className="flex w-full justify-end pb-6">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={()=>setModalChooseTos(true)}
          >
            Choose Term of Service
          </ButtonComponent>
        </div>
      )}
      <TablePagination
        pageSize={pageSize}
        current={page}
        dataSource={filterDataByPage()}
        tableScrolled={{y: 525, x: 1000 }}
        totalData={totalElement}
        onChange={handleChangeSize}
        onSort={onSort}
        columns={columns({
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        })}
        expandable={{expandedRowRender}}
      />

      <ModalCustom
        isOpen={modalUpdateTos}
        handleCancel={()=>setModalUpdateTos(false)}
        handleOk
      >

      </ModalCustom>
    </div>
  )
}

export default TableTos