import styled from "styled-components";

export default styled.div`
  position: relative;

  .slick-slide {
    padding: 16px;
    max-height: 400px;
    min-height: 400px;

    .course-item {
      max-height: 368px;
      min-height: 368px;

      .ant-card-body {
        padding: 16px 24px;
        overflow-y: auto;
        max-height: 113px;
        min-height: 113px;

        .ant-card-meta-description {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .ant-card-actions {
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }

  .prev-button-slider,
  .right-button-slider {
    position: absolute;
    top: 50%;
    z-index: 2;
    cursor: pointer;
  }

  .prev-button-slider {
    left: -8px;
  }

  .right-button-slider {
    right: -8px;
  }
`;
