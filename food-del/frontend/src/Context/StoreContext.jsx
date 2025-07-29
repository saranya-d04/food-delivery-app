import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "http://localhost:4000";
  const currency = "₹";
  const deliveryCharge = 50;

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId]--;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = food_list.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // Fetch food list from API
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data from API
  const loadCartData = async (tokenObj) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: tokenObj });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
        await loadCartData({ token: localToken });
      }
    };
    loadData();
  }, []);

  // Final context value
  const contextValue = {
    url,
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
