import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  notification,
  Select,
  Upload,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("course", data.course);
      formData.append("video", data.video.file);
      const postResponse = await post("/lessons", formData);

      if (postResponse._id) {
        notification.success({
          message: "Create lesson successfully",
          placement: "topRight",
        });
        history.replace("/admin/lessons");
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
            <PageHeaderComponent title="New lesson" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item
                    label="Lesson name"
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

                  <Form.Item
                    label="Video"
                    name="video"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    valuePropName="video"
                  >
                    <Upload
                      className="upload-wrapper"
                      beforeUpload={() => false}
                      accept="video/mp4"
                      multiple={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload video</Button>
                    </Upload>
                  </Form.Item>

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
