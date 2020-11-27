import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";

const EditButton = (props) => {
  return (
    <Button
      icon={<EditOutlined />}
      type="ghost"
      style={{
        backgroundColor: "#fff3cd",
        color: "#856404",
        borderColor: "#ffeeba",
      }}
      {...props}
    >
      Edit
    </Button>
  );
};

export default EditButton;
