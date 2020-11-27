import { Form, Input, Button, DatePicker, Spin, Alert, Radio } from "antd";
import { Link } from "react-router-dom";
import { useCallback, useMemo } from "react";

// import AuthContext from "contexts/auth";
import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./SignUp.styles";

const SignUp = () => {
  // const { dispatch } = useContext(AuthContext);
  const { post, loading } = useRequest({});

  const [form] = Form.useForm();

  const onFinish = useCallback(
    async (values) => {
      const responseCreateUser = await post("/users", {
        ...values,
        dob: values.dob ? values.dob.format("DD/MM/YYYY") : "",
      });

      if (responseCreateUser.code) {
        form.setFieldsValue({ errorMessage: responseCreateUser.message });
        return;
      }

      // const responseLogin = await post("/authentication", {
      //   username: values.username,
      //   password: values.password,
      //   strategy: "local",
      // });

      // if (responseLogin.code) {
      //   form.setFieldsValue({ errorMessage: responseLogin.message });
      //   return;
      // }

      // const { accessToken, user } = responseLogin;

      form.resetFields();
      form.setFieldsValue({
        successMessage:
          "Sign up successfully. An active email was sent to your email. Please check and active your account.",
      });
      // sessionStorage.setItem("accessToken", accessToken);
      // sessionStorage.setItem("user", JSON.stringify(user));
      // sessionStorage.setItem("isAuth", true);

      // setTimeout(() => {
      //   dispatch({
      //     type: "login",
      //     payload: { user, accessToken },
      //   });
      // }, 300);
    },
    [form, post]
  );

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <div>
          {useMemo(
            () => (
              <PageHeaderComponent
                className="sign-in-title"
                title="SIGN UP"
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
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please input a valid email!",
                    },
                  ]}
                >
                  <Input autoFocus />
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
                  <Input />
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

                <Form.Item label="Gender" name="gender">
                  <Radio.Group>
                    <Radio value={0}>Male</Radio>
                    <Radio value={1}>Female</Radio>
                    <Radio value={2}>Other</Radio>
                  </Radio.Group>
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

                <Form.Item className="button-area">
                  <Link to="/sign_in">
                    <Button type="link" htmlType="button">
                      Go to sign in
                    </Button>
                  </Link>

                  <Button type="primary" htmlType="submit">
                    Sign me up
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

export default SignUp;
