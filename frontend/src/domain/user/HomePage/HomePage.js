import { Tabs, Spin, Divider } from "antd";
import { useEffect, useState } from "react";

import CourseCarousel from "components/CourseCarousel";
import useRequest from "hooks/useRequest";
import Wrapper from "./HomePage.styles";

const { TabPane } = Tabs;

const HomePage = () => {
  const {
    get,
    loading,
    response = { categories: [], courses: [], hotCourses: [] },
  } = useRequest({});

  const [tabKey, setTabKey] = useState("");

  useEffect(() => {
    const queryByCategory = tabKey ? `?categoryId=${tabKey}` : "";
    get(`/user-homes${queryByCategory}`);
  }, [get, tabKey]);

  return (
    <Wrapper>
      <Spin
        style={{ maxHeight: "100vh", minHeight: "100vh" }}
        spinning={loading}
      >
        <Divider orientation="center">HOT COURSES</Divider>
        {response.code ? null : (
          <CourseCarousel courses={response.hotCourses} />
        )}

        <Divider className="nkh" orientation="center">
          COURSES BY CATEGORY
        </Divider>
        <Tabs className="category-content" onChange={(key) => setTabKey(key)}>
          {response.code
            ? null
            : response.categories.map((category) => (
                <TabPane tab={category.name} key={category._id}>
                  <CourseCarousel courses={response.courses} />
                </TabPane>
              ))}
        </Tabs>

        <Divider className="nkh" orientation="center">
          WHO WE ARE ?
        </Divider>
        <div className="introduce">
          <h3>
            NKH is the leading global marketplace for teaching and learning,
            connecting millions of students to the skills they need to succeed.
          </h3>

          <div className="statistic">
            <div>
              <h1>35M</h1>
              <p>Learners</p>
            </div>

            <div>
              <h1>120k</h1>
              <p>Courses</p>
            </div>

            <div>
              <h1>400M</h1>
              <p>Course enrollments</p>
            </div>

            <div>
              <h1>110M</h1>
              <p>Minutes of video</p>
            </div>
          </div>
        </div>
      </Spin>
    </Wrapper>
  );
};

export default HomePage;
