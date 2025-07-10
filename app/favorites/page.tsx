"use client";
import { useEffect, useState } from 'react';
import ProductCard from "@/app/_components/ProductCard";
import { mockProducts } from "@/app/_data/mockProducts";
import { Product } from "@/app/_interface/interface";

export default function FavoritePage() {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [products] = useState<Product[]>(mockProducts);

    useEffect(() => {
        const fav = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(fav);
    }, []);

    const favoriteProducts = products.filter(p => favorites.includes(p.id));

    const handleToggleFavorite = (id: number) => {
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter(fid => fid !== id)
            : [...favorites, id];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h2>
            {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onViewDetails={() => {}}
                            onToggleFavorite={() => handleToggleFavorite(p.id)}
                            isFavorite={true}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-10">Bạn chưa có sản phẩm yêu thích nào.</p>
            )}
        </div>
    );
}