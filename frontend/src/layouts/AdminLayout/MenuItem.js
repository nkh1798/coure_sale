import { Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  AlertOutlined,
  BookOutlined,
  FileOutlined,
  QuestionCircleOutlined,
  BarsOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuItem = () => {
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[]}>
      <Menu.Item key="category" icon={<BarsOutlined />}>
        <Link to="/admin/categories">Categories</Link>
      </Menu.Item>

      <Menu.Item key="request" icon={<AlertOutlined />}>
        <Link to="/admin/requests">Requests</Link>
      </Menu.Item>

      <Menu.Item key="course" icon={<BookOutlined />}>
        <Link to="/admin/courses">Courses</Link>
      </Menu.Item>

      <Menu.Item key="user" icon={<UserOutlined />}>
        <Link to="/admin/users">Users</Link>
      </Menu.Item>

      <Menu.Item key="lesson" icon={<VideoCameraOutlined />}>
        <Link to="/admin/lessons">Lessons</Link>
      </Menu.Item>

      <Menu.Item key="exam" icon={<FileOutlined />}>
        <Link to="/admin/exams">Exams</Link>
      </Menu.Item>

      <Menu.Item key="question" icon={<QuestionCircleOutlined />}>
        <Link to="/admin/questions">Questions</Link>
      </Menu.Item>

      <Menu.Item key="reviews" icon={<FormOutlined />}>
        <Link to="/admin/reviews">Reviews</Link>
      </Menu.Item>
    </Menu>
  );
};

export default MenuItem;
