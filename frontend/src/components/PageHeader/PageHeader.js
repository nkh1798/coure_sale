import { PageHeader } from "antd";
import { useHistory } from "react-router-dom";

const PageHeaderComponent = (props) => {
  const history = useHistory();

  return <PageHeader onBack={() => history.goBack()} {...props} />;
};

export default PageHeaderComponent;
