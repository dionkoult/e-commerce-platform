export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function removeFromOrders(orderId) {
  const newOrders = [];

  orders.forEach((order) => {
    if (order.id !== orderId) {
      newOrders.push(order);
    }
  });

  orders = newOrders;
}