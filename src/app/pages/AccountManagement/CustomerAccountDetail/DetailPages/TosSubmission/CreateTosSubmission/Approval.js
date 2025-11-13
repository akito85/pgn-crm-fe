import React,{useState} from 'react'
import { useDispatch } from "react-redux";

import BaseContainer from '../../../../../../../components/BaseContainer'
import TablePagination from '../../../../../../../components/TablePagination'
import { Form, Select } from 'antd';
import SelectComponent from '../../../../../../../components/SelectComponent';

const expandedRowRender = (record) => {
  const dataExpand = record?.dataDetail
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'EMPLOYEE',
      dataIndex: 'employee',
    }
  ];
  return (
    <div>
      <TablePagination
        useSelect={false}
        usePagination={false}
        className="table-expand-custom"
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  )
};

const Approval = ({type}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [boolean, setBoolean] = useState(false);

  //Declaration
  const dispatch = useDispatch();

  // useEffect(() => {
  //    dispatch(getListApprovalById(idUpdate));
  // }, [type]);

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: 'HIERARCHY',
      dataIndex: 'hierarchy',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
    }
  ];
  const dataSource = []
  for (let i = 0; i < 10; ++i) {
    dataSource.push({
      key: i+1,
      hierarchy: "Submiter",
      position: "CM Bogor 1",
      dataDetail: [
        {
          employee: `Karyawan ${i+1}`
        },
        {
          employee: `Karyawan ${i+2}`
        },
        {
          employee: `Karyawan ${i+3}`
        }
      ]
    });
  }

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    // dispatch(getListApprovalById(e));
    console.log(e)
    setBoolean(true);
  };
  return (
    <div>
      <BaseContainer>
        <div className="w-full grid grid-cols-1 gap-2">
          <div className="w-1/3">
            <Form.Item
              label="Approval Hierarchy"
              name="apphierId"
              rules={[
                {
                  required: true,
                  message: "Please input your Approval Hierarchy!",
                },
              ]}
            >
              <SelectComponent onChange={(e) => handleSelect(e)}>
                {/* {apiApproval &&
                  apiApproval?.map((data, index) => (
                    <Select.Option value={data.appHierId} key={index}>
                      {data.approvalName}
                    </Select.Option>
                  ))} */}
                <Select.Option value={1} key={1}>
                  tets 1
                </Select.Option>
                <Select.Option value={2} key={2}>
                  tets 2
                </Select.Option>
              </SelectComponent>
            </Form.Item>
          </div>
        </div>
        <TablePagination 
          dataSource={dataSource}
          columns={columns}
          expandable={{expandedRowRender}}
          useSelect={false}
          usePagination={false}
        />
      </BaseContainer>
    </div>
  )
}

export default Approval