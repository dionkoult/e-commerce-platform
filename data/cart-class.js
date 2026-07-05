class Cart {
  cartItems;
  #localStorageKey;
  date;
  

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
    this.loadDate();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [];
    }
  }

  clear() {
    this.cartItems = [];
    this.date = [];
    this.saveToStorage();
  }

  saveDate(orderId, date) {
    const orders = JSON.parse(localStorage.getItem('order-dates')) || [];

    orders.unshift({
      orderId,
      date
    });

    localStorage.setItem('order-dates', JSON.stringify(orders));
  }

  loadDate() {
    this.date = JSON.parse(localStorage.getItem('order-dates')) || [];
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
      productId,
      quantity,
      deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;

    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    this.cartItems.forEach((link) => {
      if (link.productId === productId) {
        link.quantity = newQuantity;
      }
    });

    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (!matchingItem) {
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId;

    this.saveToStorage();
  }


  updateCartQuantity() {
    const cartQuantity = cart.calculateCartQuantity();

    if (cartQuantity >= 1000) {
      document.querySelector('.js-cart-quantity').classList.add('cart-quantity-after-1000');
      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    } else if (cartQuantity >= 100) {
      document.querySelector('.js-cart-quantity').classList.add('cart-quantity-after-100');
      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    } else if (cartQuantity === 0) {
      document.querySelector('.js-cart-quantity')
      .innerHTML = '';
    } else {
      document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
    }
  }
};

export const cart = new Cart('cart-oop');