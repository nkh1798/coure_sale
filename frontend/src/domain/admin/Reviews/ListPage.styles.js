import styled from "styled-components";

export default styled.div`
  table {
    th,
    td {
      text-align: center;
    }

    .content-column {
      max-width: 460px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-bottom: 0;
    }
  }
`;
