import {
  Form,
  Input,
  Button,
  Spin,
  Select,
  DatePicker,
  Row,
  Col,
  notification,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

import PageHeader from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const EditPage = () => {
  const history = useHistory();
  const { userId } = useParams();
  const { get, patch, loading, response = {} } = useRequest({});

  const onFinish = useCallback(
    async (data) => {
      const formData = { ...data, dob: data.dob.format("DD/MM/YYYY") };
      const patchResponse = await patch(`/users/${userId}`, formData);

      if (patchResponse._id) {
        notification.success({
          message: "Update user successfully",
          placement: "topRight",
        });
        history.push("/admin/users");
      }
    },
    [userId, history, patch]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    const getUserInfo = async () => {
      if (userId) {
        const getResponse = await get(`/users/${userId}`);
        form.setFieldsValue({
          username: getResponse.username,
          role: getResponse.role,
          password: getResponse.password,
          phone: getResponse.phone || "",
          dob: getResponse.dob ? moment(getResponse.dob, "DD/MM/YYYY") : "",
          gender:
            getResponse.gender !== "null" || getResponse.gender !== "undefined"
              ? getResponse.gender
              : "",
        });
      }
    };

    getUserInfo();
  }, [userId, form, get]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeader title="Edit user" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  {response.code && <p>User not found</p>}

                  {response._id && (
                    <>
                      <Form.Item
                        label="Name"
                        name="username"
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

                      <Form.Item label="Password" name="password">
                        <Input.Password />
                      </Form.Item>

                      <Form.Item label="Role" name="role">
                        <Select defaultValue={1}>
                          <Option key="0" value={0}>
                            Admin
                          </Option>
                          <Option key="1" value={1}>
                            User
                          </Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label="Gender" name="gender">
                        <Select>
                          <Option key="0" value={0}>
                            Male
                          </Option>
                          <Option key="1" value={1}>
                            Female
                          </Option>
                          <Option key="2" value={2}>
                            Other
                          </Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label="Birthday" name="dob">
                        <DatePicker
                          placeholder=""
                          style={{ width: "100%" }}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>

                      <Form.Item label="Phone" name="phone">
                        <Input />
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
          [form, onFinish, response._id, response.code]
        )}
      </Wrapper>
    </Spin>
  );
};

export default EditPage;
