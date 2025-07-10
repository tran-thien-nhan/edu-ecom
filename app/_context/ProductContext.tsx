// "use client";
// import React, { createContext, useContext, useEffect, useCallback } from "react";
// import { Product, ProductContextProps } from "../_interface/interface";
// import { mockProducts } from "../_data/mockProducts";

// const ProductContext = createContext<ProductContextProps | undefined>(undefined);

// export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
//   const [favorites, setFavorites] = React.useState<number[]>([]);
//   const [cart, setCart] = React.useState<Product[]>([]);
//   const [recentlyViewed, setRecentlyViewed] = React.useState<number[]>([]);
//   const products = mockProducts;

//   // Load from localStorage on initial render
//   useEffect(() => {
//     const loadFromLocalStorage = () => {
//       try {
//         const fav = JSON.parse(localStorage.getItem('favorites') || '[]');
//         const crt = JSON.parse(localStorage.getItem('cart') || '[]');
//         const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        
//         if (Array.isArray(fav)) setFavorites(fav);
//         if (Array.isArray(crt)) setCart(crt);
//         if (Array.isArray(rv)) setRecentlyViewed(rv);
//       } catch (error) {
//         console.error("Failed to parse localStorage data:", error);
//       }
//     };

//     loadFromLocalStorage();
//   }, []);

//   // Save to localStorage when state changes
//   useEffect(() => {
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }, [favorites]);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
//   }, [recentlyViewed]);

//   const handleToggleFavorite = useCallback((id: number) => {
//     setFavorites(prev => 
//       prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
//     );
//   }, []);

//   const handleAddToCart = useCallback((product: Product) => {
//     setCart(prev => {
//       if (prev.some(item => item.id === product.id)) {
//         return prev;
//       }
//       return [...prev, product];
//     });
//   }, []);

//   const handleRemoveFromCart = useCallback((id: number) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   }, []);

//   const addToRecentlyViewed = useCallback((id: number) => {
//     setRecentlyViewed(prev => {
//       const newHistory = [id, ...prev.filter(itemId => itemId !== id)];
//       return newHistory.slice(0, 10);
//     });
//   }, []);

//   const contextValue = {
//     products,
//     favorites,
//     cart,
//     recentlyViewed,
//     handleToggleFavorite,
//     handleAddToCart,
//     handleRemoveFromCart,
//     addToRecentlyViewed
//   };

//   return (
//     <ProductContext.Provider value={contextValue}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProductContext = () => {
//   const context = useContext(ProductContext);
//   if (!context) throw new Error("useProductContext must be used within ProductProvider");
//   return context;
// };