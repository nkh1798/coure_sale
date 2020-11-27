import styled from "styled-components";

export default styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #777;
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-page-header {
    padding-top: 0;
  }

  & > div {
    width: 400px;
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;

    .sign-in-title {
      .ant-page-header-heading {
        justify-content: center;
      }
    }

    .ant-alert {
      margin-bottom: 16px;
    }

    .ant-form-item:last-child {
      margin-bottom: 0 !important;
      text-align: center;
    }
  }

  .button-area {
    .ant-form-item-control-input-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
`;
