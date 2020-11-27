import styled from "styled-components";

export default styled.div`
  min-height: 100vh;

  .ant-layout {
    min-height: 100vh;
  }

  .ant-layout-sider-collapsed {
    .logo {
      font-size: 12px !important;
    }
  }

  .ant-layout-header {
    height: 60px;
  }

  .logo {
    min-height: 32px;
    margin: 16px;
    color: #fff;
    font-size: 23px;
    text-align: center;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }

  header.site-layout-background {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 24px 0 0;
  }

  main.site-layout-background {
    margin: 16px 16px;
    /* padding: 24px; */
  }
`;
