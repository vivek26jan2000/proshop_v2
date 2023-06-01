export const addDecimal = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const cartUpdate = (state) => {
  // calculate price
  state.itemsPrice = addDecimal(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // calculate shippingprice(if order is over $100 free,else $10 charge)
  state.shippingPrice = addDecimal(Number(state.itemsPrice > 100 ? 0 : 100));
  // calculate taxprice(15% tax)
  state.taxPrice = addDecimal(Number(state.itemsPrice * 0.15));

  // calculate totalprice
  state.totalPrice = (
    Number(state.taxPrice) +
    Number(state.itemsPrice) +
    Number(state.shippingPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
