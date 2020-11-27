import { useContext } from "react";
import useFetch from "use-http";

import AuthContext from "contexts/auth";

const useRequest = ({ optionParams = {} }) => {
  const { accessToken, dispatch } = useContext(AuthContext);

  const { get, post, patch, del, loading, error, data } = useFetch(
    process.env.REACT_APP_API_URL,
    {
      ...optionParams,
      cachePolicy: "no-cache",
      interceptors: {
        request: ({ options }) => ({
          ...options,
          headers: accessToken
            ? {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "OPTIONS,GET,PUT,POST,PATCH,DELETE",
              }
            : {
                ...options.headers,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "OPTIONS,GET,PUT,POST,PATCH,DELETE",
              },
        }),
        response: ({ response }) => {
          if (!!accessToken && response.status === 401) {
            dispatch({ type: "logout" });
            return;
          }
          return response;
        },
      },
    }
  );

  return { get, post, patch, delete: del, loading, error, response: data };
};

export default useRequest;
