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
  Radio,
} from "antd";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const EditPage = () => {
  const { lessonId } = useParams();
  const { get, patch, loading, response = {} } = useRequest({});
  const history = useHistory();
  const [form] = Form.useForm();

  const [courses, setCourses] = useState([]);

  const onFinish = useCallback(
    async (data) => {
      let formData = {
        name: data.name,
        course: data.course,
        isFinish: data.isFinish,
      };

      if (typeof data.video !== "string") {
        formData = new FormData();
        formData.append("name", data.name);
        formData.append("course", data.course);
        formData.append("video", data.video.file);
        formData.append("oldVideo", response.video);
        formData.append("isFinish", data.isFinish);
      }

      const patchResponse = await patch(`/lessons/${lessonId}`, formData);

      if (patchResponse._id) {
        notification.success({
          message: "Update lesson successfully",
          placement: "topRight",
        });
        history.replace("/admin/lessons");
      }
    },
    [history, lessonId, patch, response.video]
  );

  useEffect(() => {
    const getCourseInfo = async () => {
      const coursesResponse = await get("/courses");
      setCourses(coursesResponse.data);

      if (lessonId) {
        const getResponse = await get(`/lessons/${lessonId}`);
        form.setFieldsValue({
          name: getResponse.name,
          course: getResponse.course,
          video: getResponse.video,
          isFinish: getResponse.isFinish,
        });
      }
    };

    getCourseInfo();
  }, [lessonId, form, get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="Edit lesson" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  {response.code && <p>Lesson not found</p>}

                  {response._id && (
                    <>
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
                          {courses.map((course) => (
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
                        >
                          <Button icon={<UploadOutlined />}>
                            Upload video
                          </Button>
                        </Upload>
                      </Form.Item>

                      {response.video && (
                        <Form.Item noStyle shouldUpdate={false}>
                          <video controls width="100%" height="300">
                            <source
                              src={`${process.env.REACT_APP_API_URL}${response.video}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </Form.Item>
                      )}

                      <Form.Item
                        name="isFinish"
                        label="Is lesson finish"
                        tooltip={{
                          title: "This is a required field",
                          icon: <InfoCircleOutlined />,
                        }}
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Radio.Group>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>Not Yet</Radio>
                        </Radio.Group>
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
          [courses, form, onFinish, response._id, response.code, response.video]
        )}
      </Wrapper>
    </Spin>
  );
};

export default EditPage;
