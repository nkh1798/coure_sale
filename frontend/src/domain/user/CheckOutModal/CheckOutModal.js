import { Modal, Descriptions, Tag, Typography } from "antd";
import { useContext } from "react";
import TextArea from "antd/lib/input/TextArea";

import formatNumber from "utils/formatNumber";
import CartContext from "contexts/cart";
import Wrapper from "./CheckOutModal.styles";

const CheckOutModal = (props) => {
  const { cart } = useContext(CartContext);

  return (
    <Wrapper>
      <Modal title="CHECKOUT" centered {...props} width={1000}>
        {cart.map((cartItem, index) => (
          <Descriptions
            title={index === 0 ? "Summary" : ""}
            bordered
            key={cartItem.id}
            style={{ marginBottom: 4 }}
          >
            <Descriptions.Item label="Course name">
              {cartItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {formatNumber(cartItem.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {cartItem.quantity}
            </Descriptions.Item>
          </Descriptions>
        ))}

        <p style={{ marginTop: 16, marginLeft: 2 }}>
          Total:{" "}
          <Tag color="volcano">
            {formatNumber(
              cart.reduce(
                (total, cartItem) =>
                  total + Number(cartItem.price) * cartItem.quantity,
                0
              )
            )}
          </Tag>
        </p>

        <Descriptions
          title="Bank account info"
          bordered
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="STK">01234234234</Descriptions.Item>
          <Descriptions.Item label="Bank">Tehcombank</Descriptions.Item>
          <Descriptions.Item label="Account name">
            NGUYEN KHANH HUONG
          </Descriptions.Item>
          <Descriptions.Item label="Content">
            For example: [your username] transfers money to buy course
          </Descriptions.Item>
        </Descriptions>

        <TextArea
          style={{ marginTop: 16 }}
          placeholder="Note for admin"
          rows={4}
          showCount
          maxLength={1000}
          id="checkout-note"
          autoSize={{ minRows: 4, maxRows: 8 }}
        />

        <p style={{ margin: "16px 0 0 2px", fontSize: 16 }}>
          <Typography.Text type="warning">
            After transfer money, please wait for admin to check and add course
            to your MY COURSES.
          </Typography.Text>
        </p>
      </Modal>
    </Wrapper>
  );
};

export default CheckOutModal;
