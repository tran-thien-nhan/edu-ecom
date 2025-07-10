"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { HomeIcon, ShoppingCart, Heart, Clock } from "lucide-react";
import clsx from "clsx";

export default function AppLayout({
    children,
    cartCount,
    favoriteCount,
}: {
    children: React.ReactNode;
    cartCount: number;
    favoriteCount: number;
}) {
    const router = useRouter();

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-md sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">E</div>
                        <span className="text-2xl font-bold text-gray-800">EduAI</span>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <button onClick={() => router.push("/")} className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><HomeIcon size={22} /></button>
                        <button onClick={() => router.push("/favorites")} className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <Heart size={22} />
                            {favoriteCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{favoriteCount}</span>}
                        </button>
                        <button onClick={() => router.push("/cart")} className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
                        </button>
                        <button onClick={() => router.push("/history")} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <Clock size={22} />
                        </button>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">{children}</main>
        </div>
    );
}
