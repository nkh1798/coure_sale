import styled from "styled-components";

export default styled.div`
  video {
    object-fit: fill;
    margin-bottom: 24px;
  }

  .lesson-item {
    cursor: pointer;
  }

  .selected-item {
    background-color: #eee;
  }

  .back-button {
    &:hover {
      color: #001529;
      border: 1px solid #d9d9d9;
    }

    a {
      color: #001529 !important;
    }
  }
`;
