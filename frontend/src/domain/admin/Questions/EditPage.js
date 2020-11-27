import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  notification,
  Select,
  Radio,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const EditPage = () => {
  const { questionId } = useParams();
  const { get, patch, loading, response = {} } = useRequest({});
  const history = useHistory();
  const [form] = Form.useForm();

  const [courses, setCourses] = useState([]);

  const onFinish = useCallback(
    async (data) => {
      const patchResponse = await patch(`/questions/${questionId}`, data);

      if (patchResponse._id) {
        notification.success({
          message: "Update question successfully",
          placement: "topRight",
        });
        history.replace("/admin/questions");
      }
    },
    [history, questionId, patch]
  );

  const handleSetAnswer = useCallback(
    (field) => {
      const oldAnswerList = form.getFieldValue("answers");
      const newAnswerList = oldAnswerList.map((answer, index) => {
        if (index === field.key) {
          return answer;
        }

        return { ...answer, isTrue: false };
      });

      form.setFieldsValue({ answers: newAnswerList });
    },
    [form]
  );

  useEffect(() => {
    const getCourseInfo = async () => {
      const coursesResponse = await get("/courses");
      setCourses(coursesResponse.data);

      if (questionId) {
        const getResponse = await get(`/questions/${questionId}`);
        form.setFieldsValue({
          title: getResponse.title,
          course: getResponse.course,
          answers: getResponse.answers,
        });
      }
    };

    getCourseInfo();
  }, [questionId, form, get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="Edit question" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  {response.code && <p>Question not found</p>}

                  {response._id && (
                    <>
                      <Form.Item
                        label="Title"
                        name="title"
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

                      <Form.Item
                        name="course"
                        label="Course"
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

                      <Form.List name="answers">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field) => (
                              <Space key={field.key} align="baseline">
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, curValues) =>
                                    prevValues.answers !== curValues.answers
                                  }
                                >
                                  {() => (
                                    <Form.Item
                                      {...field}
                                      label="Content"
                                      name={[field.name, "content"]}
                                      fieldKey={[field.fieldKey, "content"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing content",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="For Ex: A. or 1." />
                                    </Form.Item>
                                  )}
                                </Form.Item>

                                <Form.Item
                                  {...field}
                                  label="Value"
                                  name={[field.name, "value"]}
                                  fieldKey={[field.fieldKey, "value"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing value",
                                    },
                                  ]}
                                >
                                  <Input />
                                </Form.Item>

                                <Form.Item
                                  {...field}
                                  label="Is True"
                                  name={[field.name, "isTrue"]}
                                  fieldKey={[field.fieldKey, "isTrue"]}
                                >
                                  <Radio.Group
                                    onChange={() => handleSetAnswer(field)}
                                  >
                                    <Radio value={true}>Yes</Radio>
                                  </Radio.Group>
                                </Form.Item>

                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </Space>
                            ))}

                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add answers
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>

                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form>
              </Col>
            </Row>
          ),
          [
            courses,
            form,
            handleSetAnswer,
            onFinish,
            response._id,
            response.code,
          ]
        )}
      </Wrapper>
    </Spin>
  );
};

export default EditPage;
