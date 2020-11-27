import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Select,
  DatePicker,
  notification,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const { Option } = Select;

const NewPage = () => {
  const history = useHistory();
  const { post, loading } = useRequest({});

  const onFinish = useCallback(
    async (data) => {
      const formData = { ...data, dob: data.dob.format("DD/MM/YYYY") };
      const response = await post("/users", formData);

      if (response._id) {
        notification.success({
          message: "Create user successfully",
          placement: "topRight",
        });
        history.replace("/admin/users");
      }
    },
    [history, post]
  );

  const [form] = Form.useForm();

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="New user" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
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

                  <Form.Item
                    label="Password"
                    name="password"
                    tooltip={{
                      title: "This is a required field",
                      icon: <InfoCircleOutlined />,
                    }}
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                  >
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
                      Create
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          ),
          [form, onFinish]
        )}
      </Wrapper>
    </Spin>
  );
};

export default NewPage;
