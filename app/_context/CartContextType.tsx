// app/_context/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartContextType, Product } from "../_interface/interface";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        if (!cart.some((p) => p.id === product.id)) {
            setCart([...cart, product]);
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((p) => p.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
};
