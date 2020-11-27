import { Card, Carousel, Button, Avatar, Rate } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef, memo } from "react";

import Wrapper from "./ReviewCarousel.styles";

import DefaultAvatar from "assets/images/default-avatar.png";

const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 5000,
  lazyLoad: true,
};

const ReviewCarousel = ({ reviews = [] }) => {
  const sliderRef = useRef(null);

  return (
    <Wrapper>
      {reviews.length > 5 && (
        <Button
          onClick={() => sliderRef.current && sliderRef.current.prev()}
          shape="circle"
          className="prev-button-slider"
          size="large"
          icon={<LeftOutlined />}
        />
      )}
      <Carousel {...settings} ref={sliderRef}>
        {reviews.map((review) => (
          <Card className="review-item" hoverable key={review._id}>
            <Card.Meta
              avatar={<Avatar src={DefaultAvatar} />}
              title={review.user.username}
              description={review.content}
            />

            <Rate disabled allowHalf value={review.rate} />
          </Card>
        ))}
      </Carousel>
      {reviews.length > 5 && (
        <Button
          onClick={() => sliderRef.current && sliderRef.current.next()}
          shape="circle"
          size="large"
          className="right-button-slider"
          icon={<RightOutlined />}
        />
      )}
    </Wrapper>
  );
};

export default memo(ReviewCarousel);
