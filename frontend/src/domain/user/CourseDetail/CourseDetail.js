import {
  Spin,
  Row,
  Col,
  Card,
  Rate,
  Button,
  Divider,
  Statistic,
  Tag,
} from "antd";
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import CartContext from "contexts/cart";
import formatNumber from "utils/formatNumber";
import ReviewCarousel from "components/ReviewCarousel";
import useEnrollCourse from "hooks/useEnrollCourse";
import useRequest from "hooks/useRequest";
import Wrapper from "./CourseDetail.styles";

import DefaultCourseImage from "assets/images/default-course.png";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { dispatch } = useContext(CartContext);

  const { get, loading, response = { course: {}, reviews: [] } } = useRequest(
    {}
  );
  const { onEnrollCourse, renderCheckoutModal } = useEnrollCourse();

  useEffect(() => {
    get(`/course-detail?courseId=${courseId}`);
  }, [courseId, get]);

  return (
    <Wrapper>
      <Spin
        style={{ maxHeight: "100vh", minHeight: "100vh" }}
        spinning={loading}
      >
        {!loading && response.code && <p>Course not found</p>}

        {!loading && !response.code && (
          <>
            <Row>
              <Col span={16} offset={4}>
                <Row
                  style={{
                    height: 400,
                  }}
                >
                  <Col span={8}>
                    <div height={400} style={{ textAlign: "center" }}>
                      <img
                        style={{ maxWidth: "100%" }}
                        alt={response.course.name}
                        height={400}
                        src={
                          response.course.cover
                            ? `${process.env.REACT_APP_API_URL}${response.course.cover}`
                            : DefaultCourseImage
                        }
                      />
                    </div>
                  </Col>

                  <Col span={1} />

                  <Col span={15}>
                    <Card
                      hoverable
                      style={{ height: 400 }}
                      title={response.course.name}
                    >
                      <p className="course-description">
                        {response.course.description}
                      </p>

                      <p>
                        <Tag color="volcano">
                          {formatNumber(response.course.price)}
                        </Tag>
                      </p>

                      <div style={{ marginBottom: 16 }}>
                        4.5 <Rate disabled allowHalf value={4.5} /> (100,000
                        ratings)
                      </div>

                      <p>
                        <Button
                          size="large"
                          type="primary"
                          onClick={() => {
                            dispatch({
                              type: "addItem",
                              payload: response.course,
                            });

                            setTimeout(() => {
                              onEnrollCourse();
                            }, 300);
                          }}
                        >
                          ENROLL NOW
                        </Button>

                        <Button
                          style={{ marginLeft: 16 }}
                          type="default"
                          onClick={() => {
                            dispatch({
                              type: "addItem",
                              payload: response.course,
                            });
                          }}
                        >
                          ADD TO CART
                        </Button>
                      </p>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Divider className="margin-top-divider" orientation="center">
              You Also Get Access To These Bonuses
            </Divider>

            <Row gutter={16} className="bonus-area">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="60 Day Consultation"
                    value={1200000}
                    suffix="VND"
                  />
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Free Lifetime Updates"
                    value={800000}
                    suffix="VND"
                  />
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Access on mobile and TV"
                    value={600000}
                    suffix="VND"
                  />
                </Card>
              </Col>

              <Col span={6}>
                <Card>
                  <Statistic
                    title="Access to a computer."
                    value={400000}
                    suffix="VND"
                  />
                </Card>
              </Col>
            </Row>

            <Divider className="margin-top-divider" orientation="center">
              WHAT STUDENTS SAY ?
            </Divider>

            <ReviewCarousel reviews={response.reviews} />

            {renderCheckoutModal()}
          </>
        )}
      </Spin>
    </Wrapper>
  );
};

export default CourseDetail;
