import {
  Spin,
  Row,
  Col,
  Divider,
  Card,
  Image,
  List,
  Select,
  Input,
} from "antd";
import { useMemo, useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import _debounce from "lodash/debounce";

import AuthContext from "contexts/auth";
import useRequest from "hooks/useRequest";
import Wrapper from "./MyCourses.styles";

import DefaultCourseImage from "assets/images/default-course.png";

const MyCourses = () => {
  const { user } = useContext(AuthContext);
  const {
    get,
    loading,
    response = { courses: [], categories: [] },
  } = useRequest({});
  const history = useHistory();

  const [categoryQuery, setCategoryQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchQuery = useCallback(
    _debounce((value) => setSearchQuery(value), 500),
    []
  );

  useEffect(() => {
    const categoryParams = categoryQuery ? `&categoryId=${categoryQuery}` : "";

    const searchParams = searchQuery ? `&search=${searchQuery}` : "";

    get(`/my-courses?userId=${user._id}${categoryParams}${searchParams}`);
  }, [categoryQuery, get, searchQuery, user._id]);

  return (
    <Wrapper>
      <Row>
        <Col span={14} offset={5}>
          {useMemo(
            () => (
              <Divider orientation="center">MY COURSES</Divider>
            ),
            []
          )}

          {!loading && !!response.code && <p>Cannot get user profile</p>}

          <Row className="filter-wrapper">
            <Col span={8} className="my-course-select-filter">
              <Select
                value={categoryQuery}
                onChange={(value) => setCategoryQuery(value)}
              >
                <Select.Option value="">Select category</Select.Option>
                {response.categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col span={8}></Col>
            <Col span={8}>
              <Input.Search
                placeholder="Search course by name"
                value={searchQuery}
                onChange={(event) => handleSearchQuery(event.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Spin spinning={loading} style={{ width: "100%" }}>
            {!loading && !!!response.code && (
              <Row>
                <List
                  style={{ width: "100%" }}
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 3,
                    xxl: 4,
                  }}
                  dataSource={response.courses}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        onClick={() =>
                          history.push(`/my-course-detail/${item._id}`)
                        }
                        className="course-item"
                        hoverable
                        key={item._id}
                        cover={
                          <Image
                            width="100%"
                            height="200px"
                            src={
                              item.cover
                                ? `${process.env.REACT_APP_API_URL}${item.cover}`
                                : DefaultCourseImage
                            }
                          />
                        }
                        actions={[<span>Start learn</span>]}
                      >
                        <Card.Meta title={item.name} />
                      </Card>
                    </List.Item>
                  )}
                />
              </Row>
            )}
          </Spin>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default MyCourses;
