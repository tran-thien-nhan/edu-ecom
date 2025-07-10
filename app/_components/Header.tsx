"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HomeIcon, ShoppingCart, Heart, Clock } from "lucide-react";
import clsx from "clsx";
import { useCart } from "../_context/CartContextType";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { cart } = useCart();
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const favoritesData = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(favoritesData);

        const handleStorageChange = () => {
            const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavorites(updatedFavorites);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-30 w-full">
            <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-y-2">
                {/* Logo */}
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        E
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 hidden xs:inline">
                        EduAI
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-4">
                    <button
                        onClick={() => router.push("/")}
                        className={clsx(
                            "p-2 rounded-full hover:bg-gray-100",
                            pathname === "/" ? "text-indigo-600" : "text-gray-600"
                        )}
                    >
                        <HomeIcon size={22} />
                    </button>
                    <button
                        onClick={() => router.push("/favorites")}
                        className={clsx(
                            "relative p-2 rounded-full hover:bg-gray-100",
                            pathname.startsWith("/favorites") ? "text-indigo-600" : "text-gray-600"
                        )}
                    >
                        <Heart size={22} />
                    </button>
                    <button
                        onClick={() => router.push("/cart")}
                        className={clsx(
                            "relative p-2 rounded-full hover:bg-gray-100",
                            pathname.startsWith("/cart") ? "text-indigo-600" : "text-gray-600"
                        )}
                    >
                        <ShoppingCart size={22} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => router.push("/history")}
                        className={clsx(
                            "p-2 rounded-full hover:bg-gray-100",
                            pathname.startsWith("/history") ? "text-indigo-600" : "text-gray-600"
                        )}
                    >
                        <Clock size={22} />
                    </button>
                </nav>
            </div>
        </header>

    );
}
