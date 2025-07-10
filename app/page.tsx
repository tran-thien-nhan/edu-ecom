"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Product } from "./_interface/interface";
import { mockProducts } from "./_data/mockProducts";
import { fetchAISuggestions, formatCurrency } from "./_utils/util";
import { Search, Star, Heart, Bot, Send, Loader, Sparkles } from 'lucide-react';
import ProductCard from "./_components/ProductCard";
import CourseDetailPage from "./_components/CourseDetailPage";
import { Fireworks } from "./_components/Fireworks";
import SkeletonCard from "./_components/SkeletonCard";
import ProductModal from "./_components/ProductModal";
import PurchaseModal from "./_components/PurchaseModal";
import Toast from "./_components/Toast";
import Chatbot from "./_components/Chatbot";
import { useLocalStorageState } from "./_hooks/useLocalStorageState";
import { useRouter } from "next/navigation";
import { useCart } from "./_context/CartContextType";

export default function Home() {
  const [products] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [favorites, setFavorites] = useLocalStorageState<number[]>('favorites', []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorageState<number[]>('recentlyViewed', []);
  const [cart, setCart] = useLocalStorageState<Product[]>('cart', []);

  const [courseDetail, setCourseDetail] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    let tempProducts = [...products];
    if (searchTerm) {
      tempProducts = tempProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (priceFilter !== 'all') {
      tempProducts = tempProducts.filter(p => {
        if (priceFilter === '<500') return p.price < 500000;
        if (priceFilter === '500-1m') return p.price >= 500000 && p.price <= 1000000;
        if (priceFilter === '>1m') return p.price > 1000000;
        return true;
      });
    }
    if (categoryFilter !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === categoryFilter);
    }
    setFilteredProducts(tempProducts);
  }, [searchTerm, priceFilter, categoryFilter, products]);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        setToastMessage('Đã xóa khỏi yêu thích');
        return prev.filter(favId => favId !== id);
      } else {
        setToastMessage('Đã thêm vào yêu thích!');
        return [...prev, id];
      }
    });
  }, []);

  const triggerFireworks = () => {
    setShowFireworks(true);
    setTimeout(() => {
      setShowFireworks(false);
    }, 4500);
  };

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const isProductInCart = prevCart.some(item => item.id === product.id);
      if (isProductInCart) {
        setToastMessage('Sản phẩm đã có trong giỏ hàng');
        return prevCart;
      }
      return [...prevCart, product];
    });
    addToCart(product);
    setToastMessage(`🎉 Đã thêm "${product.name}" vào giỏ hàng`);
    triggerFireworks();
  }, []);

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => {
      const newHistory = [product.id, ...prev.filter(id => id !== product.id)];
      return newHistory.slice(0, 10);
    });
  }, []);

  const handleViewCurriculum = (product: Product) => {
    router.push(`/course-detail/${product.slug}`);
  };

  const handleGetSuggestions = useCallback(async () => {
    setIsSuggestionLoading(true);
    setSuggestionError(null);
    setAiSuggestions([]);

    try {
      const suggestions = await fetchAISuggestions(
        'user-123',
        products,
        cart,
        favorites,
        recentlyViewed
      );
      setAiSuggestions(suggestions);
    } catch (error: any) {
      console.error("Lỗi khi lấy gợi ý:", error);
      setSuggestionError(error.message || 'Lỗi không xác định');
    } finally {
      setIsSuggestionLoading(false);
    }
  }, [products, cart, favorites, recentlyViewed]);

  if (courseDetail) {
    return (
      <>
        <Fireworks isVisible={showFireworks} onAnimationEnd={() => setShowFireworks(false)} />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        <CourseDetailPage
          product={courseDetail}
          onBack={() => setCourseDetail(null)}
          onLessonClick={() => setIsPurchaseModalOpen(true)}
          onAddToCart={handleAddToCart}
          triggerFireworks={triggerFireworks}
          setToastMessage={setToastMessage}
        />
      </>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Fireworks isVisible={showFireworks} onAnimationEnd={() => setShowFireworks(false)} />
      <main className="container mx-auto p-4 md:p-8">
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  Gợi ý thông minh <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
                </h2>
              </div>
              <button
                onClick={handleGetSuggestions}
                disabled={isSuggestionLoading}
                className="mt-4 md:mt-0 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSuggestionLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <span>Lấy gợi ý mới</span>
                )}
              </button>
            </div>
            {suggestionError && (
              <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
                {suggestionError}
              </div>
            )}
            {(isSuggestionLoading || aiSuggestions.length > 0) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isSuggestionLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : (
                  aiSuggestions.map(p => (
                    <ProductCard
                      key={`suggestion-${p.id}`}
                      product={p}
                      onViewDetails={handleViewDetails}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(p.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tất cả khóa học</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={handleViewDetails}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(p.id)}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-gray-500 text-center col-span-full py-10">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )}
        </>
      </main>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewCurriculum={handleViewCurriculum}
        onAddToCart={handleAddToCart}
      />
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
      <Chatbot
        allProducts={products}
        handleAddToCart={handleAddToCart}
        handleViewCurriculum={handleViewCurriculum}
      />
    </div>
  );
}