"use client";
import { useCallback, useEffect, useState } from 'react';
import ProductCard from "@/app/_components/ProductCard";
import { mockProducts } from "@/app/_data/mockProducts";
import { Product } from "@/app/_interface/interface";
import ProductModal from '../_components/ProductModal';
import { useRouter } from 'next/navigation';
import { useCart } from '../_context/CartContextType';

export default function HistoryPage() {
    const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [products] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);
    const router = useRouter();
    const { addToCart, removeFromCart, clearCart } = useCart();

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

    const handleViewDetails = useCallback((product: Product) => {
        setSelectedProduct(product);
        setRecentlyViewed(prev => {
            const newHistory = [product.id, ...prev.filter(id => id !== product.id)];
            localStorage.setItem('recentlyViewed', JSON.stringify(newHistory.slice(0, 10)));
            return newHistory.slice(0, 10);
        });
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
            <h2 className="text-3xl font-bold mb-6">Sản phẩm đã xem</h2>
            {recentlyViewedProducts.length > 0 && (
                <button
                    onClick={handleClearHistory}
                    className="text-red-500 hover:underline text-sm"
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
                            onViewDetails={handleViewDetails}
                            onToggleFavorite={() => { }}
                            isFavorite={favorites.includes(p.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-10">Bạn chưa xem sản phẩm nào gần đây.</p>
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