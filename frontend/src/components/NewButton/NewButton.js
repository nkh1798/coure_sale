import { Button } from "antd";
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";

const NewButton = ({ path }) => {
  return (
    <Link to={path}>
      <Button type="primary" icon={<PlusCircleOutlined />}>
        New
      </Button>
    </Link>
  );
};

export default NewButton;
