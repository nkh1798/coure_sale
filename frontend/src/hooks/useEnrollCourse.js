import { Modal, notification } from "antd";
import { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "contexts/auth";
import CartContext from "contexts/cart";
import CheckOutModal from "domain/user/CheckOutModal";
import useRequest from "hooks/useRequest";

const useEnrollCourse = () => {
  const history = useHistory();
  const { isAuth, user } = useContext(AuthContext);
  const { cart, dispatch } = useContext(CartContext);

  const { post, loading } = useRequest({});

  const [showModalCheckout, setShowModalCheckout] = useState(false);

  const onEnrollCourse = useCallback(() => {
    if (!isAuth) {
      Modal.confirm({
        title: "Please sign in to enroll this course",
        onOk: () => {
          localStorage.setItem("redirectURL", window.location.pathname);
          history.push("/sign_in");
        },
      });
      return;
    }

    setShowModalCheckout(true);
  }, [history, isAuth]);

  const onCheckout = useCallback(async () => {
    const response = await post("/checkout", {
      courses: cart.map((cartItem) => cartItem.id),
      user: user._id,
      note: document.getElementById("checkout-note").value,
    });

    if (response.code) {
      notification.error({ message: response.message, placement: "topRight" });
      return;
    }

    dispatch({ type: "clearCart" });
    notification.success({
      message: "Buy course successfully",
      placement: "topRight",
    });
    setShowModalCheckout(false);
  }, [cart, dispatch, post, user]);

  return {
    onEnrollCourse,
    renderCheckoutModal: () => (
      <CheckOutModal
        confirmLoading={loading}
        visible={showModalCheckout}
        onOk={onCheckout}
        onCancel={() => setShowModalCheckout(false)}
      />
    ),
  };
};

export default useEnrollCourse;
