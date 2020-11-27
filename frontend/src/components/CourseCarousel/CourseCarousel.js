import { Card, Carousel, Button, Image, Tag } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useRef, memo, useContext } from "react";
import { useHistory } from "react-router-dom";

import CartContext from "contexts/cart";
import useEnrollCourse from "hooks/useEnrollCourse";
import Wrapper from "./CourseCarousel.styles";

import DefaultCourseImage from "assets/images/default-course.png";
import formatNumber from "utils/formatNumber";

const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  lazyLoad: true,
};

const CourseCarousel = ({ courses = [], isBuyed = false }) => {
  const { dispatch } = useContext(CartContext);
  const history = useHistory();

  const { onEnrollCourse, renderCheckoutModal } = useEnrollCourse();

  const sliderRef = useRef(null);

  return (
    <Wrapper>
      {!!!courses.length && <p>Have no course in this category</p>}

      {!!courses.length && (
        <>
          {courses.length > 4 && (
            <Button
              onClick={() => sliderRef.current && sliderRef.current.prev()}
              shape="circle"
              className="prev-button-slider"
              size="large"
              icon={<LeftOutlined />}
            />
          )}
          <Carousel {...settings} ref={sliderRef}>
            {courses.map((course) => (
              <Card
                onClick={() => history.push(`/courses/${course._id}`)}
                className="course-item"
                hoverable
                key={course._id}
                cover={
                  <Image
                    width="100%"
                    height="200px"
                    src={
                      course.cover
                        ? `${process.env.REACT_APP_API_URL}${course.cover}`
                        : DefaultCourseImage
                    }
                  />
                }
                actions={
                  isBuyed
                    ? [<span>Start learn</span>]
                    : [
                        <ShoppingCartOutlined
                          key="cart"
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch({ type: "addItem", payload: course });
                          }}
                        />,
                        <DollarOutlined
                          key="dollar"
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch({ type: "addItem", payload: course });
                            setTimeout(() => {
                              onEnrollCourse();
                            }, 300);
                          }}
                        />,
                      ]
                }
              >
                <Card.Meta
                  title={course.name}
                  description={(() => (
                    <>
                      {isBuyed ? null : (
                        <p style={{ marginBottom: 8 }}>
                          <Tag color="#001529">
                            {formatNumber(course.price)}
                          </Tag>
                        </p>
                      )}
                      <p>{course.description}</p>
                    </>
                  ))()}
                />
              </Card>
            ))}
          </Carousel>
          {courses.length > 4 && (
            <Button
              onClick={() => sliderRef.current && sliderRef.current.next()}
              shape="circle"
              size="large"
              className="right-button-slider"
              icon={<RightOutlined />}
            />
          )}
        </>
      )}

      {renderCheckoutModal()}
    </Wrapper>
  );
};

export default memo(CourseCarousel);
