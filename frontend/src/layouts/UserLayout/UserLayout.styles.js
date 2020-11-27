import styled from "styled-components";

export default styled.div`
  .site-layout-background {
    background-color: #fff;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;

      .shopping-cart-item {
        color: #fff;
        font-size: 30px;
        margin-right: 32px;
        cursor: pointer;
      }

      .ant-scroll-number {
        right: 28px !important;
      }
    }

    .logo {
      font-size: 30px;
      color: #fff;
      margin-right: 32px;
      cursor: pointer;

      a {
        color: #fff;

        &:hover {
          color: #fff;
        }
      }
    }

    .ant-select-auto-complete {
      width: 60%;

      .ant-select-clear {
        right: 50px !important;
      }

      .ant-input-search {
        width: 100%;

        .ant-input-group-addon {
          padding: 0;

          button {
            background-color: #1890ff;
            border-color: #40a9ff;
          }

          svg {
            color: #fff;
          }
        }
      }
    }

    .signin-button {
      margin-right: 16px;
      color: #fff;
    }
  }
`;
