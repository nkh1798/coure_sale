import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

import Wrapper from "./Breadcrumb.styles";

const BreadcrumbCustom = ({ data = [] }) => {
  return (
    <Wrapper>
      <Breadcrumb>
        {data.map(({ title, url }, index) => (
          <Breadcrumb.Item key={index}>
            <Link to={url}>{title}</Link>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </Wrapper>
  );
};

export default BreadcrumbCustom;
