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
import { useHistory, useParams } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const EditPage = () => {
  const [courses, setCourses] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [questionList, setQuestionList] = useState([]);

  const { get, patch, loading, response = {} } = useRequest({});
  const { examId } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();

  const onSearch = useCallback(
    (searchValue) => {
      if (!searchValue) {
        return;
      }

      const newOptions = questionData
        .filter(
          (question) =>
            question.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        )
        .map((question) => ({ value: question.title, id: question._id }));
      setQuestionOptions(newOptions);
    },
    [questionData]
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
      const patchResponse = await patch(`/exams/${examId}`, {
        ...data,
        questions: questionList.map((question) => question.id),
      });

      if (patchResponse._id) {
        notification.success({
          message: "Update exam successfully",
          placement: "topRight",
        });
        history.push("/admin/exams");
      }
    },
    [examId, history, patch, questionList]
  );

  useEffect(() => {
    const getData = async () => {
      const courseResponse = await get("/courses");
      setCourses(courseResponse.data);

      const questionResponse = await get("/questions?limit=1000&skip=0");
      setQuestionData(questionResponse.data);

      if (!examId) {
        return;
      }

      const getResponse = await get(`/exams/${examId}`);

      if (!getResponse._id) {
        return;
      }

      form.setFieldsValue({
        name: getResponse.name,
        course: getResponse.course,
      });

      setQuestionList(
        getResponse.questions.map((question) => ({
          value: question.title,
          id: question._id,
        }))
      );
    };

    getData();
  }, [examId, form, get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="Edit exam" />
          ),
          []
        )}

        <Row>
          <Col span={10} offset={7}>
            <Form layout="vertical" form={form} onFinish={onFinish}>
              {response.code && <p>Exam not found</p>}

              {useMemo(
                () => (
                  <>
                    {response._id && (
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
                    )}
                  </>
                ),
                [response._id]
              )}

              {useMemo(
                () => (
                  <>
                    {response._id && (
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
                    )}
                  </>
                ),
                [courses, response._id]
              )}

              {useMemo(
                () => (
                  <>
                    {response._id && (
                      <Form.Item label="Questions">
                        <AutoComplete
                          options={questionOptions}
                          style={{
                            width: "100%",
                          }}
                          onSelect={onSelectQuestion}
                          onSearch={onSearch}
                          placeholder="Autocomplete search question to add"
                          onClear={() => setQuestionOptions([])}
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
                    )}
                  </>
                ),
                [
                  onRemoveQuestion,
                  onSearch,
                  onSelectQuestion,
                  questionList,
                  questionOptions,
                  response._id,
                ]
              )}

              {useMemo(
                () => (
                  <>
                    {response._id && (
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      </Form.Item>
                    )}
                  </>
                ),
                [response._id]
              )}
            </Form>
          </Col>
        </Row>
      </Wrapper>
    </Spin>
  );
};

export default EditPage;
