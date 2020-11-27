import { Form, Input, Button, Checkbox, Spin, Alert } from "antd";
import { Link } from "react-router-dom";
import { useCallback, useMemo, useContext } from "react";

import AuthContext from "contexts/auth";
import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./ActiveAccount.styles";

const ActiveAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const { get, loading } = useRequest({});

  const [form] = Form.useForm();

  const onFinish = useCallback(
    async (values) => {
      const response = await get(`/active-account?activationToken=${}`);

      if (response.code) {
        form.setFieldsValue({ errorMessage: response.message });
        return;
      }

      const storage = values.remember ? localStorage : sessionStorage;

      const { accessToken, user } = response;

      form.setFieldsValue({ successMessage: "Login successfully" });
      storage.setItem("accessToken", accessToken);
      storage.setItem("user", JSON.stringify(user));
      storage.setItem("isAuth", true);

      setTimeout(() => {
        dispatch({
          type: "login",
          payload: { user, accessToken },
        });
      }, 300);
    },
    [dispatch, form, post]
  );

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <div>
          {useMemo(
            () => (
              <PageHeaderComponent
                className="sign-in-title"
                title="SIGN IN"
                onBack={null}
              />
            ),
            []
          )}

          {useMemo(
            () => (
              <Form
                form={form}
                name="basic"
                layout="vertical"
                initialValues={{ errorMessage: null }}
                onFinish={onFinish}
                onChange={() => form.setFieldsValue({ errorMessage: null })}
              >
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.errorMessage !== curValues.errorMessage
                  }
                >
                  {({ getFieldValue }) => {
                    return !!getFieldValue("errorMessage") ? (
                      <Alert
                        message={getFieldValue("errorMessage")}
                        type="error"
                        showIcon
                      />
                    ) : null;
                  }}
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.successMessage !== curValues.successMessage
                  }
                >
                  {({ getFieldValue }) => {
                    return !!getFieldValue("successMessage") ? (
                      <Alert
                        message={getFieldValue("successMessage")}
                        type="success"
                        showIcon
                      />
                    ) : null;
                  }}
                </Form.Item>

                <Form.Item
                  label="User name"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input autoFocus />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item className="button-area">
                  <Link to="/sign_up">
                    <Button type="link" htmlType="button">
                      Go to sign up
                    </Button>
                  </Link>

                  <Button type="primary" htmlType="submit">
                    Sign me in
                  </Button>
                </Form.Item>
              </Form>
            ),
            [form, onFinish]
          )}
        </div>
      </Wrapper>
    </Spin>
  );
};

export default ActiveAccount;
