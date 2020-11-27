import { Statistic, Card, Row, Col, Spin } from "antd";
import { useEffect } from "react";

import useRequest from "hooks/useRequest";
import Wrapper from "./HomePage.styles";

const HomePage = () => {
  const { get, loading, response = {} } = useRequest({});

  useEffect(() => {
    get("/admin-homes");
  }, [get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total request"
                value={response.totalRequest}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total course"
                value={response.totalCourse}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total user"
                value={response.totalUser}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total category"
                value={response.totalCategory}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Total review"
                value={response.totalReview}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>
      </Wrapper>
    </Spin>
  );
};

export default HomePage;
