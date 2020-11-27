import { Form, Input, Button, Spin, Row, Col, notification } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import PageHeaderComponent from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./NewPage.styles";

const NewPage = () => {
  const history = useHistory();
  const { post, loading, response = {} } = useRequest({});

  const onFinish = useCallback(
    (data) => {
      post("/categories", data);
    },
    [post]
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (response._id) {
      notification.success({
        message: "Create category successfully",
        placement: "topRight",
      });
      history.replace("/admin/categories");
    }
  }, [history, response]);

  return (
    <Spin spinning={loading}>
      <Wrapper>
        {useMemo(
          () => (
            <PageHeaderComponent title="New category" />
          ),
          []
        )}

        {useMemo(
          () => (
            <Row>
              <Col span={10} offset={7}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item
                    label="Category name"
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
