import styled from "styled-components";

export default styled.div`
  padding: 16px 16px 24px 16px;

  .category-content {
    width: 100%;
  }

  .ant-divider {
    color: #001529;
    font-size: 24px;
  }

  .nkh {
    margin-top: 40px !important;
  }

  .introduce {
    background-color: #eee;
    color: #001529;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 150px;
    padding: 24px 0;

    h1 {
      color: #001529;
    }

    h1,
    p {
      margin-bottom: 0;
    }

    .statistic {
      display: flex;
      width: 60%;
      align-items: center;
      justify-content: space-between;
    }
  }
`;
