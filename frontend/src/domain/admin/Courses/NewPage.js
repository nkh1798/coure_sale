import {
  Form,
  Input,
  Button,
  Spin,
  Select,
  Row,
  Col,
  notification,
  Upload,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;
const { TextArea } = Input;

const NewPage = () => {
  const history = useHistory();
  const { get, post, loading, response = {} } = useRequest({});

  const onFinish = useCallback(
    async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("cover", data.cover.file);
      const responseCourse = await post("/courses", formData);

      if (responseCourse._id) {
        notification.success({
          message: "Create course successfully",
          placement: "topRight",
        });
        history.replace("/admin/courses");
      }
    },
    [history, post]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    get("/categories");
  }, [get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="New course" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item
                    name="category"
                    label="Category"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Select placeholder="Select a category" allowClear>
                      {response.data &&
                        response.data.map((category) => (
                          <Option key={category._id} value={category._id}>
                            {category.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

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
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Price"
                    name="price"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Cover photo"
                    name="cover"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    valuePropName="cover"
                  >
                    <Upload
                      className="upload-wrapper"
                      beforeUpload={() => false}
                      accept="image/png, image/jpg, image/jpeg"
                      multiple={false}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>
                        Upload cover photo
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    name="description"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <TextArea rows={6} />
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
