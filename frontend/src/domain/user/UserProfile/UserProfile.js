import {
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  notification,
  Divider,
  Upload,
  Radio,
  DatePicker,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMemo, useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";

import AuthContext from "contexts/auth";
import getBase64 from "utils/getBase64";
import useRequest from "hooks/useRequest";
import Wrapper from "./UserProfile.styles";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { get, patch, loading, response = {} } = useRequest({});

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const getUserInfo = async () => {
      const getResponse = await get(`/users/${user._id}`);

      getResponse.avatar &&
        setAvatarUrl(`${process.env.REACT_APP_API_URL}${getResponse.avatar}`);

      form.setFieldsValue({
        username: getResponse.username,
        avatar: getResponse.avatar,
        phone: getResponse.phone || "",
        dob: getResponse.dob ? moment(getResponse.dob, "DD/MM/YYYY") : "",
        gender:
          getResponse.gender !== "null" || getResponse.gender !== "undefined"
            ? getResponse.gender
            : "",
      });
    };

    getUserInfo();
  }, [form, get, user._id]);

  const onFinish = useCallback(
    async (data) => {
      let formData = { ...data, dob: data.dob.format("DD/MM/YYYY") };

      if (typeof data.avatar !== "string") {
        formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("gender", data.gender);
        formData.append("dob", data.dob.format("DD/MM/YYYY"));
        formData.append("avatar", data.avatar.file);
        formData.append("oldAvatar", response.avatar);
      }

      const patchResponse = await patch(`/users/${user._id}`, formData);

      if (patchResponse._id) {
        notification.success({
          message: "Update user profile successfully",
          placement: "topRight",
        });
      }
    },
    [patch, response.avatar, user._id]
  );

  const handleChange = useCallback((info) => {
    getBase64(info.file, (imageUrl) => setAvatarUrl(imageUrl));
  }, []);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        <Row>
          <Col span={14} offset={5}>
            {useMemo(
              () => (
                <Divider orientation="center">USER PROFILE</Divider>
              ),
              []
            )}

            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Row gutter={16}>
                <Col span={12}>
                  <Row>
                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="Avatar" name="avatar">
                            <Upload
                              className="upload-wrapper"
                              beforeUpload={() => false}
                              accept="image/png, image/jpg, image/jpeg"
                              listType="picture-card"
                              showUploadList={false}
                              onChange={handleChange}
                            >
                              {avatarUrl ? (
                                <img alt="avatar" src={avatarUrl} />
                              ) : (
                                <div>
                                  <p>
                                    <PlusCircleOutlined
                                      style={{ fontSize: 30 }}
                                    />
                                  </p>
                                  <p>Upload avatar</p>
                                </div>
                              )}
                            </Upload>
                          </Form.Item>
                        </Col>
                      ),
                      [avatarUrl, handleChange]
                    )}

                    {useMemo(
                      () => (
                        <Form.Item style={{ width: "100%" }}>
                          <Button block type="primary" htmlType="submit">
                            Update
                          </Button>
                        </Form.Item>
                      ),
                      []
                    )}
                  </Row>
                </Col>

                <Col span={12}>
                  <Row>
                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="User name" name="username">
                            <Input autoFocus />
                          </Form.Item>
                        </Col>
                      ),
                      []
                    )}

                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="Password" name="password">
                            <Input.Password />
                          </Form.Item>
                        </Col>
                      ),
                      []
                    )}

                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="Gender" name="gender">
                            <Radio.Group>
                              <Radio value={0}>Male</Radio>
                              <Radio value={1}>Female</Radio>
                              <Radio value={2}>Other</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                      ),
                      []
                    )}

                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="Birthday" name="dob">
                            <DatePicker
                              placeholder=""
                              style={{ width: "100%" }}
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>
                      ),
                      []
                    )}

                    {useMemo(
                      () => (
                        <Col span={24}>
                          <Form.Item label="Phone" name="phone">
                            <Input />
                          </Form.Item>
                        </Col>
                      ),
                      []
                    )}
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Wrapper>
    </Spin>
  );
};

export default UserProfile;
