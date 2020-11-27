import styled from "styled-components";

export default styled.div`
  position: relative;

  .slick-slide {
    padding: 16px;
  }

  .prev-button-slider,
  .right-button-slider {
    position: absolute;
    top: 40%;
    z-index: 2;
    cursor: pointer;
  }

  .prev-button-slider {
    left: -8px;
  }

  .right-button-slider {
    right: -8px;
  }

  .ant-card-meta-description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
`;
