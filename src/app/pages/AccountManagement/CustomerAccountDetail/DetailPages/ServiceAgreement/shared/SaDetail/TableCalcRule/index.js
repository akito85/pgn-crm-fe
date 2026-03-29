import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getColumnSearchProps } from "../../../../../../../../../utils/getColumnSearchProps";
import {
	Form,
	Input,
	InputNumber,
	Select,
	Tooltip,
} from "antd";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import Highlighter from "react-highlight-words";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import {
	getListCalculationType,
	getListNameCalculationRule,
	getListUnit,
	getListUnitVAT,
	getListUnitWithHoldTax,
} from "../../../../../../../../../redux/slices/product_promo/product";
import { getColumnSearchPropsCriteria } from "../TableCalcRule/columnTableCriteria";
import { hasValue } from "../../../../../../../../../utils";
import InputComponent from "../../../../../../../../../components/InputComponent";
import { getCalcRuleColumns } from "../columns/getCalcRuleColumns";

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	options = [],
	required,
	dependDataIndex,
	dataEditRecord,
	urlIndex,
	isProduct,
	handleEditDataRecord = () => { },
	...restProps
}) => {
	const key = record?.key || 0;
	const dataDepend = dependDataIndex
		? dataEditRecord[key + dependDataIndex]
		: "";

	const rules = () => {
		let rule = [];
		if (required) {
			rule.push({
				...required,
				message: `${required.message} ${title}!`,
			});
		}
		return rule.length !== 0 ? rule : undefined;
	};

	const filterOption = (input, option) =>
		option.props.children.toLowerCase().includes(input.toLowerCase());

	const dependentData = () => {
		if (options.length === 0) {
			return true;
		}
		return !dataDepend;
	};

	const getInputNode = (inputType) => {
		switch (inputType) {
			case "select":
				return (
					<Select
						showSearch
						optionFilterProp="children"
						filterOption={filterOption}
						labelInValue
						disabled={
							(dataIndex === "name" && isProduct !== 2) || hasValue(dependDataIndex)
								? dependentData()
								: false
						}
					// disabled={dependDataIndex ? !dataDepend : false}
					>
						{options.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				);
			case "number":
				return (
					<InputNumber
						type={"number"}
						controls={false}
						style={{
							width: "100%",
						}}
					/>
				);
			case "description":
				return <Input.TextArea rows={1} maxLength={255} />;
			default:
				return <InputComponent />;
		}
	};
	const inputNode = getInputNode(inputType);

	if (
		dataIndex === "operation" ||
		dataIndex === "no" ||
		dataIndex === "status"
	) {
		return (
			<td {...restProps}>
				<div>{children}</div>
			</td>
		);
	}

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					valuePropName={"value"}
					rules={rules()}
					getValueFromEvent={(value) =>
						handleEditDataRecord(value, key, dataIndex)
					}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const excludeOptionName = [687];
const TableCalcRule = ({
	type,
	dispatch = () => { },
	dataTable = [],
	updateTable = () => { },
	isProduct,
	data = [],
	handleSaDetailObj = () => { },
	setSaDetailObj,
	saDetailObj
}) => {
	const searchInput = useRef(null);
	const [formTable] = Form.useForm();
	const [displayData, setDisplayData] = useState([]);
	const [loadedCount, setLoadedCount] = useState(10);
	const [hasMore, setHasMore] = useState(true);
	const [pageSize] = useState(10); // Keep for NO column calculation
	const [totalElements, setTotalElement] = useState(0);
	const [editingKey, setEditingKey] = useState("");
	const [storedDate, setStoredData] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const [searchText, setSearchText] = useState("");
	const [fieldSort, setFieldSort] = useState("");
	const [orderSort, setOrderSort] = useState("");
	const [editDataRecord, setEditDataRecord] = useState({});
	const [statusAction, setStatusAction] = useState("");
	const [fixedColumns, setFixedColumns] = useState(() => ({
		right: ["operation"],
		left: [],
	}));
	const isEditing = (record) => record.key === editingKey;
	const {
		dataListCalculationType,
		dataListNameCalculationRule = [],
		dataListUnit = [],
	} = useSelector((state) => state.product);
	const exludeExisting =
		dataTable.length > 0 ? dataTable.map((item) => item?.name?.value) : [];
	const listName = dataListNameCalculationRule.filter(
		(item) => ![...excludeOptionName, ...exludeExisting].includes(item.value)
	);

	useEffect(() => {
		if (isProduct === 2 && saDetailObj?.calculationType) {
			const selectedCalculationType = dataListCalculationType?.filter(item => item?.value === saDetailObj?.calculationType)[0]
			setSaDetailObj((prevState) => ({
				...prevState,
				objCaclucationType: {
					name: 687,
					unit: `${selectedCalculationType?.value}`,
					value: null,
				},
			}))
		}

	}, [saDetailObj?.calculationType])

	// useEffect(() => {
	//   if(data?.length){
	//     updateTable(data)
	//   }
	// }, [])

	// useEffect(() => {
	//   if (dataTable.length > 0) {
	//     setTotalElement(dataTable.length);
	//   }
	// }, [dataTable]);

	useEffect(() => {
		dispatch(getListCalculationType());
		dispatch(getListNameCalculationRule());
	}, [dispatch]);

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
		if (searchedColumn !== tempSearchColumn) {
			setLoadedCount(10);
		}
		setSearchedColumn(tempSearchColumn);
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
	// Process all data (filter, sort)
	const processedData = useMemo(() => {
		let result = [...dataTable];
		if (searchedColumn) {
			const tempSearchText = searchText.toLowerCase();
			result = result.filter((item) => {
				switch (searchedColumn) {
					case "name":
					case "unit":
						return item[searchedColumn]?.label
							.toLowerCase()
							.includes(tempSearchText);
					default:
						return item[searchedColumn]?.toLowerCase().includes(tempSearchText);
				}
			});
		}
		const handleSort = (obj) => {
			switch (fieldSort) {
				case "name":
				case "unit":
					return obj[fieldSort]?.label.toString().toLowerCase();
				default:
					return obj[fieldSort].toString().toLowerCase();
			}
		};
		if (fieldSort) {
			result.sort((a, b) => {
				let fa = handleSort(a);
				let fb = handleSort(b);

				if (fa < fb) {
					return orderSort === "asc" ? -1 : 1;
				}
				if (fa > fb) {
					return orderSort === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return result;
	}, [dataTable, searchedColumn, searchText, fieldSort, orderSort]);

	// Infinite scroll: slice processedData based on loadedCount
	useEffect(() => {
		const sliced = processedData.slice(0, loadedCount);
		setDisplayData(sliced);
		setHasMore(loadedCount < processedData.length);
		setTotalElement(processedData.length);
	}, [processedData, loadedCount]);

	// Handle infinite scroll load more
	const handleLoadMore = useCallback(() => {
		return new Promise((resolve) => {
			const nextCount = loadedCount + 10;
			setLoadedCount(nextCount);
			resolve();
		});
	}, [loadedCount]);

	const handleEditDataRecord = (data, key, index) => {
		const keyName = key + index;
		const value = index === "description" ? data.target.value : data;
		setEditDataRecord((prevState) => {
			return {
				...prevState,
				[keyName]: value,
			};
		});
		if (index === `name`) {
			// const temp = listName.filter((item) => item.value === data?.value);
			// if (temp.length > 0) {
			//   dispatch(getListUnit({ id: temp[0].code }));
			//   formTable.resetFields(["unit"]);
			// }
			const temp = dataListNameCalculationRule.filter((item) => item.id === data?.value);
			if (data?.value === 212) {
				dispatch(getListUnitVAT());
				formTable.resetFields(["unit"]);
			} else if (data?.value === 213) {
				dispatch(getListUnitWithHoldTax());
				formTable.resetFields(["unit"]);
			} else if (temp.length > 0) {
				dispatch(getListUnit({ id: temp[0].id }));
				formTable.resetFields(["unit"]);
			}
		}
		return value;
	};
	const edit = (record, field) => {
		setStatusAction("edit");
		formTable.setFieldsValue(record);
		setEditingKey(record.key);
		const { key, ...extraProps } = record || {};
		const tempValue = { ...extraProps };
		for (const attribute in tempValue) {
			if (Object.hasOwnProperty.call(tempValue, attribute)) {
				const tempData = tempValue[attribute];
				setEditDataRecord((prevState) => {
					return {
						...prevState,
						[`${key}${attribute}`]: tempData,
					};
				});
			}
		}
		if (record?.name && record?.name?.value) {
			// const temp = listName.filter(
			//   (item) => item.value === record?.name?.value
			// );
			// if (temp.length > 0) {
			//   dispatch(getListUnit({ id: temp[0].code }));
			// }
			const temp = dataListNameCalculationRule.filter(
				(item) => item.value === record?.name?.value
			);
			if (record?.name?.value === 212) {
				dispatch(getListUnitVAT());
			} else if (record?.name?.value === 213) {
				dispatch(getListUnitWithHoldTax());
			} else if (temp.length > 0) {
				dispatch(getListUnit({ id: temp[0].id }));
			}
		}
	};
	const cancel = (record) => {
		setStoredData(false);
		setEditingKey("");
		if (statusAction === "add") {
			deleteRow(record);
		}
		setStatusAction("");
	};

	const save = async (key) => {
		try {
			const row = await formTable.validateFields();
			const newData = [...dataTable];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				const updatedRow = {
					...item,
					...row,
				};
				newData.splice(index, 1, updatedRow);
				updateTable(newData);
				setEditingKey("");
			}
			setStoredData(false);
			setStatusAction("");
			formTable.resetFields();
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const addRow = () => {
		formTable.resetFields();
		setStoredData(true);
		setStatusAction("add");
		const newRow = {
			key: dataTable
				.reduce((current, next) => {
					const nextKey = next.key || 0;
					return current > nextKey
						? parseInt(current) + 1
						: parseInt(nextKey) + 1;
				}, 1)
				.toString(),
		};
		updateTable((prevData) => {
			return [...prevData, newRow];
		});
		setEditingKey(newRow.key);
	};

	const deleteRow = (record) => {
		updateTable((prevState) =>
			prevState.filter((item) => item.key !== record.key)
		);
		setStoredData(false);
	};

	// Get columns with all handlers
	const columns = useMemo(() => {
		return getCalcRuleColumns({
			page: 1, // Always 1 for infinite scroll
			pageSize,
			searchInput,
			searchedColumn,
			searchText,
			handleSearch,
			listName,
			dataListUnit,
			editingKey,
			edit,
			save,
			cancel,
			deleteRow,
			isProduct,
		});
	}, [searchedColumn, searchText, listName, dataListUnit, editingKey, isProduct]);


	const [optionSelectedCol, setOptionSelectedCol] = useState([]);

	const handleDisplayColumn = (value) => {
		setOptionSelectedCol(value);
	};

	const filterColumn = (dataColumn) => {
		return dataColumn.filter((col) => {
			return !optionSelectedCol.includes(col.title);
		});
	};

	return (
		<div className="flex flex-col w-full gap-4">

			<div className="grid gap-4 w-full">
				<Form.Item
					name={"calculationType"}
					rules={[{ message: "This field is required", required: true }]}
					className="no-margin-form w-full"
					getValueFromEvent={(e) => handleSaDetailObj(e, "calculationType")}
					label={"Calculation Type"}
					required
				>
					<SelectComponent>
						{(dataListCalculationType || []).map((data, index) => (
							<Select.Option key={index} value={data.value}>
								{data.label}
							</Select.Option>
						))}
					</SelectComponent>
				</Form.Item>
			</div>

			{isProduct === 2 && (
				<div className="flex w-full justify-end">
					<ButtonComponent
						icon={<SVGIcon name="IconButtonCreate" width={24} />}
						type="submit"
						onClick={!storedDate ? addRow : undefined}
					>
						Create
					</ButtonComponent>
				</div>
			)}

			<Form form={formTable} component={false}>
				<NxTable
					idTable="calc-rule-table"
					rowKey="key"
					dataSource={displayData}
					columns={filterColumn(
						columns.map((col) => ({
							...col,
							onCell: (record) => ({
								record,
								inputType: col.inputType,
								dataIndex: col.dataIndex,
								title: col.title,
								editing: isEditing(record),
								indexValue: col.indexValue,
								dependDataIndex: col.dependDataIndex,
								urlIndex: col.url,
								options: col.options,
								required: col.required,
								dataEditRecord: editDataRecord,
								isProduct: isProduct,
								handleEditDataRecord: handleEditDataRecord,
							}),
						}))
					)}
					totalData={processedData.length}
					rowClassName={(record) => (isEditing(record) ? "editable-row" : "")}
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
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					onChange={onSort}
					loading={false}
					showAdvanceSearch={false}
					showSearchBar={false}
				/>
			</Form>
		</div>
	);
};

export default TableCalcRule;
