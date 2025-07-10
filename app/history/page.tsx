"use client";
import { useEffect, useState } from 'react';
import ProductCard from "@/app/_components/ProductCard";
import { mockProducts } from "@/app/_data/mockProducts";
import { Product } from "@/app/_interface/interface";

export default function HistoryPage() {
    const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [products] = useState<Product[]>(mockProducts);

    useEffect(() => {
        const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const fav = JSON.parse(localStorage.getItem('favorites') || '[]');
        setRecentlyViewed(rv);
        setFavorites(fav);
    }, []);

    const recentlyViewedProducts = products.filter(p =>
        recentlyViewed.includes(p.id)
    );

    const handleClearHistory = () => {
        localStorage.removeItem('recentlyViewed');
        setRecentlyViewed([]); // cập nhật lại UI
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6">Sản phẩm đã xem</h2>
            {recentlyViewedProducts.length > 0 && (
                <button
                    onClick={handleClearHistory}
                    className="text-red-500 hover:underline text-sm my-2"
                >
                    Xóa lịch sử xem
                </button>
            )}
            {recentlyViewedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recentlyViewedProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onViewDetails={() => { }}
                            onToggleFavorite={() => { }}
                            isFavorite={favorites.includes(p.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-10">Bạn chưa xem sản phẩm nào gần đây.</p>
            )}
        </div>
    );
}