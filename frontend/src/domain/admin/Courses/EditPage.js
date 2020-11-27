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
  Image,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageHeader from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

import DefaultCourseImage from "assets/images/default-course.png";

const { Option } = Select;
const { TextArea } = Input;

const EditPage = () => {
  const { courseId } = useParams();
  const { get, patch, loading, response = {} } = useRequest({});
  const history = useHistory();

  const [categories, setCategories] = useState([]);

  const onFinish = useCallback(
    async (data) => {
      let formData = {
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
      };

      if (typeof data.cover !== "string") {
        formData = new FormData();
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("description", data.description);
        formData.append("cover", data.cover.file);
        formData.append("oldCover", response.cover);
      }

      const patchResponse = await patch(`/courses/${courseId}`, formData);

      if (patchResponse._id) {
        notification.success({
          message: "Update course successfully",
          placement: "topRight",
        });
        history.push("/admin/courses");
      }
    },
    [courseId, history, patch, response.cover]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    const getCourseInfo = async () => {
      const categoriesResponse = await get("/categories");
      setCategories(categoriesResponse.data);

      if (courseId) {
        const getResponse = await get(`/courses/${courseId}`);
        form.setFieldsValue({
          name: getResponse.name,
          category: getResponse.category,
          description: getResponse.description,
          price: getResponse.price,
          cover: getResponse.cover,
        });
      }
    };

    getCourseInfo();
  }, [courseId, form, get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeader title="Edit course" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  {response.code && <p>Course not found</p>}

                  {response._id && (
                    <>
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
                          {categories.map((category) => (
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
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>
                            Upload cover photo
                          </Button>
                        </Upload>
                      </Form.Item>

                      <Form.Item noStyle shouldUpdate={false}>
                        <Image
                          width="100%"
                          height={300}
                          src={
                            response.cover
                              ? `${process.env.REACT_APP_API_URL}${response.cover}`
                              : DefaultCourseImage
                          }
                        />
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
            categories,
            form,
            onFinish,
            response._id,
            response.code,
            response.cover,
          ]
        )}
      </Wrapper>
    </Spin>
  );
};

export default EditPage;
