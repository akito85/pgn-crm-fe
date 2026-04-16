import { useMemo, useRef, useState } from "react";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import { getRelatedDetailColumns } from "../../../getRelatedDetailColumns";

/**
 * Displays the related-detail rows for a newly selected relationship in a table.
 *
 * @param {object}   props
 * @param {object[]} [props.relatedDetails=[]] - Related detail records to display.
 */
const RelatedDetailCard = ({
  relatedDetails = [],
}) => {
  // --- Refs ---
 	const searchInput = useRef(null);

	// --- State ---
	const [searchedColumn, setSearchedColumn] = useState("");
	const [searchText, setSearchText] = useState("");
	const [search, setSearch] = useState({});

	// --- Handlers ---
	/**
	 * Applies column search filter and updates search state.
	 * @param {string[]} selectedKeys - Active filter values
	 * @param {Function} confirm      - Antd confirm callback
	 * @param {string}   dataIndex    - Column key being searched
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
	
	// --- Columns ---
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
