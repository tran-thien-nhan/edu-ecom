"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatCurrency } from "@/app/_utils/util";
import { ShoppingCart, X } from "lucide-react";
import { Product } from "@/app/_interface/interface";
import ProductCard from "@/app/_components/ProductCard";
import { mockProducts } from "@/app/_data/mockProducts";
import ProductModal from "@/app/_components/ProductModal";
import { useRouter } from "next/navigation";
import { useCart } from '../_context/CartContextType';
import { Fireworks } from '../_components/Fireworks';
import Toast from '../_components/Toast';

export default function CartPage() {
    const [cart, setCart] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [products] = useState<Product[]>(mockProducts);
    const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);
    const router = useRouter();
    const { addToCart, removeFromCart, clearCart} = useCart();

    useEffect(() => {
        const crt = JSON.parse(localStorage.getItem('cart') || '[]');
        const fav = JSON.parse(localStorage.getItem('favorites') || '[]');
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(viewed);
        setCart(crt);
        setFavorites(fav);
    }, []);

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

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

    const handleRemoveFromCart = (id: number) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        removeFromCart(id);
        setToastMessage("Sản phẩm đã được xóa khỏi giỏ hàng.");
    };

    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
        clearCart();
        setToastMessage("Giỏ hàng đã được xóa.");
    };

    const handleToggleFavorite = (id: number) => {
        const updatedFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Get cross-sell products (products not in cart)
    const crossSellProducts = useMemo(() => {
        const cartIds = new Set(cart.map(item => item.id));
        return products
            .filter(product => !cartIds.has(product.id))
            .sort(() => 0.5 - Math.random()) // Randomize
            .slice(0, 4); // Get 4 products
    }, [cart, products]);

    // Handle add to cart from cross-sell
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
            <Fireworks isVisible={showFireworks} onAnimationEnd={() => setShowFireworks(false)} />
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <h2 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h2>
            {cart.length > 0 && (
                <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:underline text-sm my-2"
                >
                    Xóa toàn bộ
                </button>
            )}
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <ShoppingCart size={64} className="mx-auto text-gray-300" />
                    <p className="text-gray-500 mt-4">Giỏ hàng của bạn đang trống.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <p className="font-semibold text-lg">{formatCurrency(item.price)}</p>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.id)}
                                            className="text-red-500"
                                        >
                                            <X />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                                <h3 className="text-xl font-bold border-b pb-3">Tổng cộng</h3>
                                <div className="flex justify-between items-center my-4">
                                    <span className="text-gray-600">Tổng tiền ({cart.length} sản phẩm)</span>
                                    <span className="font-bold text-xl">{formatCurrency(cartTotal)}</span>
                                </div>
                                <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                    Tiến hành thanh toán
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cross-sell products section */}
                    {crossSellProducts.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-6">Có thể bạn sẽ quan tâm</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {crossSellProducts.map((product: Product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onViewDetails={handleViewDetails}
                                        onToggleFavorite={() => handleToggleFavorite(product.id)}
                                        isFavorite={favorites.includes(product.id)}
                                        onAddToCart={() => handleAddToCart(product)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Product Modal */}
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