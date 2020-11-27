import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "contexts/auth";

const PublicRoute = ({ component: Component, ...restProps }) => {
  const { isAuth, user } = useContext(AuthContext);

  return (
    <Route
      {...restProps}
      render={(props) =>
        !isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: (() => {
                const redirectURL = localStorage.getItem("redirectURL");
                redirectURL && localStorage.removeItem("redirectURL");

                return redirectURL
                  ? redirectURL
                  : user.role === 0
                  ? "/admin"
                  : "/";
              })(),
            }}
          />
        )
      }
    />
  );
};

export default PublicRoute;
