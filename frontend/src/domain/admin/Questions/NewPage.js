import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  notification,
  Select,
  Space,
  Radio,
} from "antd";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const NewPage = () => {
  const history = useHistory();
  const { get, post, loading, response = {} } = useRequest({});

  const onFinish = useCallback(
    async (data) => {
      const postResponse = await post("/questions", data);

      if (postResponse._id) {
        notification.success({
          message: "Create question successfully",
          placement: "topRight",
        });
        history.replace("/admin/questions");
      }
    },
    [history, post]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    get("/courses");
  }, [get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="New question" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
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
                      {response.data &&
                        response.data.map((course) => (
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
                                prevValues.area !== curValues.area ||
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
                                { required: true, message: "Missing value" },
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
                              <Radio.Group>
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
                      Create
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          ),
          [form, onFinish, response.data]
        )}
      </Wrapper>
    </Spin>
  );
};

export default NewPage;
