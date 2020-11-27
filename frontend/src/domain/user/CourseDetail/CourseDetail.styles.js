import styled from "styled-components";

export default styled.div`
  padding: 16px 16px 24px 16px;

  .ant-divider {
    color: #001529;
    font-size: 24px;
    margin: 0 0 20px 0;
  }

  .course-description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 9;
    -webkit-box-orient: vertical;
  }

  .margin-top-divider {
    margin-top: 32px;
  }

  .bonus-area {
    .ant-card {
      background-color: #001529;

      .ant-statistic-title,
      .ant-statistic-content {
        color: #fff;
      }
    }
  }
`;
