import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ placeholder = "Search content here ....", ...props }) => {
  return (
    <div className="relative">
      <SearchOutlined
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-30"
        style={{ fontSize: "14px" }}
      />

      <Input
        placeholder={placeholder}
        className="h-[32px]"
        style={{
          paddingLeft: "35px",
          border: "1px solid #BDBDBD",
          borderRadius: "8px",
          fontSize: "12px",
        }}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
