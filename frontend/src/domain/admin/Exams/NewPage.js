import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  notification,
  Select,
  AutoComplete,
  List,
} from "antd";
import { InfoCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const NewPage = () => {
  const [courses, setCourses] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [questionList, setQuestionList] = useState([]);

  const history = useHistory();
  const { get, post, loading, response = { data: [] } } = useRequest({});

  const onSearch = useCallback(
    (searchValue) => {
      if (!searchValue) {
        setQuestionOptions([]);
        return;
      }

      const newOptions = response.data
        .filter(
          (question) =>
            question.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        )
        .map((question) => ({ value: question.title, id: question._id }));
      setQuestionOptions(newOptions);
    },
    [response.data]
  );

  const onSelectQuestion = useCallback(
    (_, option) => {
      const newQuestionList = [
        ...questionList.filter((question) => question.id !== option.id),
        option,
      ];
      setQuestionList(newQuestionList);
    },
    [questionList]
  );

  const onRemoveQuestion = useCallback(
    (questionId) => {
      const newQuestionList = [
        ...questionList.filter((question) => question.id !== questionId),
      ];
      setQuestionList(newQuestionList);
    },
    [questionList]
  );

  const onFinish = useCallback(
    async (data) => {
      const postResponse = await post("/exams", {
        ...data,
        questions: questionList.map((question) => question.id),
      });

      if (postResponse._id) {
        notification.success({
          message: "Create exam successfully",
          placement: "topRight",
        });
        history.replace("/admin/exams");
      }
    },
    [history, post, questionList]
  );

  useEffect(() => {
    const getData = async () => {
      const courseResponse = await get("/courses");
      setCourses(courseResponse.data);

      get("/questions?limit=1000&skip=0");
    };

    getData();
  }, [get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="New exam" />
          ),
          []
        )}

        <Row>
          <Col span={10} offset={7}>
            <Form layout="vertical" onFinish={onFinish}>
              {useMemo(
                () => (
                  <Form.Item
                    label="Name"
                    name="name"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input autoFocus />
                  </Form.Item>
                ),
                []
              )}

              {useMemo(
                () => (
                  <Form.Item
                    label="Course"
                    name="course"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Select placeholder="Select a course" allowClear>
                      {courses.map((course) => (
                        <Option key={course._id} value={course._id}>
                          {course.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ),
                [courses]
              )}

              {useMemo(
                () => (
                  <Form.Item label="Questions">
                    <AutoComplete
                      options={questionOptions}
                      style={{
                        width: "100%",
                      }}
                      onSelect={onSelectQuestion}
                      onSearch={onSearch}
                      placeholder="Autocomplete search question to add"
                      allowClear
                    />

                    <List
                      bordered
                      dataSource={questionList}
                      renderItem={(item) => (
                        <List.Item
                          actions={[
                            <MinusCircleOutlined
                              style={{ color: "#856404" }}
                              onClick={() => onRemoveQuestion(item.id)}
                            />,
                          ]}
                        >
                          {item.value}
                        </List.Item>
                      )}
                    />
                  </Form.Item>
                ),
                [
                  onRemoveQuestion,
                  onSearch,
                  onSelectQuestion,
                  questionList,
                  questionOptions,
                ]
              )}

              {useMemo(
                () => (
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Create
                    </Button>
                  </Form.Item>
                ),
                []
              )}
            </Form>
          </Col>
        </Row>
      </Wrapper>
    </Spin>
  );
};

export default NewPage;
