import { MinusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const DeleteButton = (props) => {
  return (
    <Button type="primary" danger icon={<MinusCircleOutlined />} {...props}>
      Delete
    </Button>
  );
};

export default DeleteButton;
