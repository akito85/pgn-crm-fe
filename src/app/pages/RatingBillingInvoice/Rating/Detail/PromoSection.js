import React from "react";
import TablePagination from "../../../../../components/TablePagination";

const PromoSection = () => {
  return (
    <div className={"my-5"}>
      <TablePagination
        usePagination={false}
        // columns={columnPromo}
        tableScrolled={{ x: 3500, y: 500 }}
      />
    </div>
  );
};

export default PromoSection;
