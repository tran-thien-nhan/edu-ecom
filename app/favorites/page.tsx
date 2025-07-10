"use client";
import { useCallback, useEffect, useState } from 'react';
import ProductCard from "@/app/_components/ProductCard";
import { mockProducts } from "@/app/_data/mockProducts";
import { Product } from "@/app/_interface/interface";
import { useCart } from '../_context/CartContextType';
import { useRouter } from 'next/navigation';
import ProductModal from '../_components/ProductModal';

export default function FavoritePage() {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [products] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);
    const router = useRouter();
    const { addToCart, removeFromCart, clearCart } = useCart();

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
    const handleViewDetails = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    const handleViewCurriculum = (product: Product) => {
        router.push(`/course-detail/${product.slug}`);
    };

    const handleAddToCart = (product: Product) => {
        const updatedCart = [...cart, product];
        setCart(updatedCart);
        setToastMessage(`🎉 Đã thêm "${product.name}" vào giỏ hàng`)
        setShowFireworks(true);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        addToCart(product);
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
                            onViewDetails={handleViewDetails}
                            onToggleFavorite={() => handleToggleFavorite(p.id)}
                            isFavorite={true}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-10">Bạn chưa có sản phẩm yêu thích nào.</p>
            )}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onViewCurriculum={() => handleViewCurriculum(selectedProduct)}
                    onAddToCart={() => handleAddToCart(selectedProduct)}
                />
            )}
        </div>
    );
}