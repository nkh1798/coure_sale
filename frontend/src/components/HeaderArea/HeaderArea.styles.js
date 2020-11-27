import styled from "styled-components";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 16px;

  .search-area {
    width: 35%;
  }

  .button-area {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
      margin-left: 8px;
    }
  }
`;
