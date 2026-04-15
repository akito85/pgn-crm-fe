import { useMemo, useRef, useState } from "react";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { getRelatedDetailColumns } from "../../../getRelatedDetailColumns";

const RelatedDetailCard = ({
  relatedDetails = [],
}) => {
 	const searchInput = useRef(null);

	// Related Detail table state
	const [searchedColumn, setSearchedColumn] = useState("");
	const [searchText, setSearchText] = useState("");
	const [search, setSearch] = useState({});

	/**
	 * @param {string[]} selectedKeys
	 * @param {() => {}} confirm
	 * @param {string} dataIndex
	 */
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
		setSearch((prevState) => {
			return {
				...prevState,
				[dataIndex]: selectedKeys[0],
			};
		});
	};
	
	const baseColumns = useMemo(
		() =>
			getRelatedDetailColumns({
				search,
				searchInput,
				searchedColumn,
				searchText,
				handleSearch
			}),
		[search, searchText, searchedColumn]
	);
 
	const columns = useMemo(() => {
		const columnsWithKeys = baseColumns.map((col) => ({
			...col,
			key: col.key || col.dataIndex || col.title,
		}));
		return columnsWithKeys;
	}, [baseColumns]);

	return (
		<NxTable
			idTable="create-update-relationship-related-detail-table"
			dataSource={relatedDetails}
			usePagination={false}
			columns={columns}
			tableScrolled={{ x: 3500 }}
			useInfiniteScroll={false}
		/>
	)
};

export default RelatedDetailCard;
