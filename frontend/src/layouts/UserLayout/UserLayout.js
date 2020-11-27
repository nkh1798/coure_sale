import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Input,
  Button,
  AutoComplete,
  Badge,
  Tag,
  List,
} from "antd";
import { Link } from "react-router-dom";
import { useCallback, useContext, useMemo, useState } from "react";
import {
  SelectOutlined,
  LogoutOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  ShoppingFilled,
  CloseCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import _debounce from "lodash/debounce";

import AuthContext from "contexts/auth";
import CartContext from "contexts/cart";
import useEnrollCourse from "hooks/useEnrollCourse";
import useRequest from "hooks/useRequest";
import Wrapper from "./UserLayout.styles";

const { Header, Content, Footer } = Layout;

const UserLayout = ({ children }) => {
  const { dispatch: dispatchAuth, isAuth, user } = useContext(AuthContext);
  const { cart, dispatch: dispatchCart } = useContext(CartContext);
  const history = useHistory();

  const { get, loading } = useRequest({});
  const { onEnrollCourse, renderCheckoutModal } = useEnrollCourse();

  const [courseOptions, setCourseOptions] = useState([]);

  const handleSearchCourse = useCallback(
    async (value) => {
      if (!value) {
        setCourseOptions([]);
        return;
      }

      const result = await get(`/search-courses?q=${value}`);

      if (result.courses) {
        setCourseOptions(
          result.courses.map((course) => ({
            value: course.name,
            id: course._id,
          }))
        );
      }
    },
    [get]
  );

  const cartContent = useMemo(
    () => (
      <div style={{ width: 300, backgroundColor: "#fff" }}>
        <List
          bordered
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <CloseCircleOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatchCart({ type: "removeItem", payload: item.id })
                  }
                />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={(() => (
                  <>
                    Quantity: <Tag color="volcano">{item.quantity}</Tag>
                  </>
                ))()}
              />
            </List.Item>
          )}
        />

        {!!cart.length && (
          <Button type="primary" block onClick={onEnrollCourse}>
            Enroll now
          </Button>
        )}
      </div>
    ),
    [cart, dispatchCart, onEnrollCourse]
  );

  const userAuthArea = useMemo(
    () => (
      <>
        {isAuth ? (
          <div className="user-info">
            <Dropdown overlay={cartContent}>
              <Badge count={cart.length}>
                <ShoppingFilled className="shopping-cart-item" />
              </Badge>
            </Dropdown>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="my-courses" icon={<BookOutlined />}>
                    <Link to="/my-courses">My courses</Link>
                  </Menu.Item>
                  <Menu.Item key="user-profile" icon={<SelectOutlined />}>
                    <Link to="/user-profile">User profile</Link>
                  </Menu.Item>
                  {user.role === 0 && (
                    <Menu.Item key="admin-site" icon={<SelectOutlined />}>
                      <Link to="/admin">Admin site</Link>
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    onClick={() => dispatchAuth({ type: "logout" })}
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        ) : (
          <div>
            <Link to="/sign_in">
              <Button
                icon={<LoginOutlined />}
                type="ghost"
                className="signin-button"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/sign_up">
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                className="signup-button"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </>
    ),
    [cart.length, cartContent, dispatchAuth, isAuth]
  );

  return (
    <Wrapper>
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          {useMemo(
            () => (
              <div className="logo">
                <Link to="/">NKH</Link>
              </div>
            ),
            []
          )}

          {useMemo(
            () => (
              <AutoComplete
                options={courseOptions}
                onSelect={(_, { id }) => history.push(`/courses/${id}`)}
                onSearch={_debounce(handleSearchCourse, 500)}
                onClear={() => setCourseOptions([])}
                allowClear
              >
                <Input.Search
                  size="large"
                  placeholder="Autocomplete search course here..."
                  loading={loading}
                />
              </AutoComplete>
            ),
            [courseOptions, handleSearchCourse, history, loading]
          )}

          {userAuthArea}
        </Header>

        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <div
            className="site-layout-background"
            style={{ minHeight: "calc(100vh - 134px)" }}
          >
            {children}
          </div>
        </Content>

        {useMemo(
          () => (
            <Footer style={{ textAlign: "center" }}>
              Course Sale Online @2020 Created by NKH
            </Footer>
          ),
          []
        )}

        {renderCheckoutModal()}
      </Layout>
    </Wrapper>
  );
};

export default UserLayout;
