import { Input } from "antd";
import { useMemo } from "react";

import DeleteButton from "components/DeleteButton";
import NewButton from "components/NewButton";
import Wrapper from "./HeaderArea.styles";

const { Search } = Input;

const HeaderArea = ({
  selectedIds,
  onDelete,
  onSearch,
  newPath,
  searchPlaceHolder,
  customButtonArea,
}) => {
  return (
    <Wrapper>
      {!!customButtonArea && customButtonArea}

      {!customButtonArea && (
        <div className="button-area">
          <NewButton path={newPath} />

          <DeleteButton disabled={!selectedIds.length} onClick={onDelete} />
        </div>
      )}

      <div className="search-area">
        {useMemo(
          () => (
            <Search
              onSearch={onSearch}
              placeholder={searchPlaceHolder}
              enterButton="Search"
              allowClear
            />
          ),
          [onSearch, searchPlaceHolder]
        )}
      </div>
    </Wrapper>
  );
};

export default HeaderArea;
