import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "contexts/auth";

const AuthenticatedRoute = ({ component: Component, ...restProps }) => {
  const { isAuth } = useContext(AuthContext);

  return (
    <Route
      {...restProps}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/sign_in" }} />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
