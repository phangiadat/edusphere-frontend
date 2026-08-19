import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  instructorName: string;
  rating: number;
  ratingsCount: number;
  totalHours: string;
  lecturesCount: number;
  level: string;
  price: number;
  thumbnail: string;
  badge?: string;
  isUpdatedRecently?: boolean;
  isPremium?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  savedItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  moveToSaveForLater: (id: string) => void;
  moveToCartFromSaved: (id: string) => void;
  removeFromSaved: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalPrice: number;
  toastMessage: string | null;
}

// Initial demo items for realistic preview
const DEMO_CART_ITEMS: CartItem[] = [
  {
    id: 'demo-cart-1',
    title: 'Learn Content Writing using AI & Start Freelancing',
    instructorName: 'Khadin Akbar and 1 other',
    rating: 4.2,
    ratingsCount: 681,
    totalHours: '2 total hours',
    lecturesCount: 24,
    level: 'All Levels',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'demo-cart-2',
    title: 'Learn Content Writing using AI & Make Money Online',
    instructorName: 'Khadin Akbar and 1 other',
    rating: 4.2,
    ratingsCount: 477,
    totalHours: '3 total hours',
    lecturesCount: 40,
    level: 'All Levels',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'demo-cart-3',
    title: 'Mastering AI in 2026: ChatGPT 5, Claude, Agents & Automation',
    instructorName: 'Sawan Kumar',
    rating: 4.1,
    ratingsCount: 1327,
    totalHours: '15 total hours',
    lecturesCount: 138,
    level: 'All Levels',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80',
    isUpdatedRecently: true,
    isPremium: true,
  },
  {
    id: 'demo-cart-4',
    title: 'Claude, ChatGPT, Projects, AI Agents from Beginner to Expert',
    instructorName: 'Todd McLeod',
    rating: 4.6,
    ratingsCount: 3248,
    totalHours: '27.5 total hours',
    lecturesCount: 214,
    level: 'Beginner',
    price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
    isUpdatedRecently: true,
    isPremium: true,
  },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('edusphere_cart');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return DEMO_CART_ITEMS;
      }
    }
    return DEMO_CART_ITEMS;
  });

  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('edusphere_saved_items');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('edusphere_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('edusphere_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (item: CartItem) => {
    if (cartItems.some((i) => i.id === item.id)) {
      showToast('Khóa học này đã có trong giỏ hàng!');
      return;
    }
    setCartItems((prev) => [...prev, item]);
    showToast(`Đã thêm "${item.title.substring(0, 30)}..." vào giỏ hàng!`);
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(`Đã xóa "${item.title.substring(0, 25)}..." khỏi giỏ hàng.`);
    }
  };

  const moveToSaveForLater = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    setCartItems((prev) => prev.filter((i) => i.id !== id));
    if (!savedItems.some((i) => i.id === id)) {
      setSavedItems((prev) => [...prev, item]);
    }
    showToast(`Đã lưu "${item.title.substring(0, 25)}..." để mua sau.`);
  };

  const moveToCartFromSaved = (id: string) => {
    const item = savedItems.find((i) => i.id === id);
    if (!item) return;

    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    if (!cartItems.some((i) => i.id === id)) {
      setCartItems((prev) => [...prev, item]);
    }
    showToast(`Đã chuyển "${item.title.substring(0, 25)}..." trở lại giỏ hàng.`);
  };

  const removeFromSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Đã xóa khỏi danh sách mua sau.');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (id: string) => {
    return cartItems.some((i) => i.id === id);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        moveToSaveForLater,
        moveToCartFromSaved,
        removeFromSaved,
        clearCart,
        isInCart,
        totalPrice,
        toastMessage,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-p2-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></div>
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
