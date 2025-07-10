"use client";
import React from "react";
import { Product } from "../_interface/interface";
import { ChevronLeft, Lock, PlayCircle } from "lucide-react";
import { formatCurrency } from "../_utils/util";
import { useCart } from "../_context/CartContextType";

const CourseDetailPage: React.FC<{
    product: Product;
    onBack: () => void;
    onLessonClick: () => void;
    onAddToCart: (product: Product) => void;
    triggerFireworks: () => void;
    setToastMessage: (msg: string) => void;
}> = ({ product, onBack, onLessonClick, onAddToCart, triggerFireworks, setToastMessage }) => {
    const { addToCart } = useCart();

    const handleAddToCartClick = () => {
        onAddToCart(product);
        addToCart(product);
        setToastMessage(`🎉 Đã thêm "${product.name}" vào giỏ hàng`);
        triggerFireworks();
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans animate-fade-in-up">
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={onBack} className="flex items-center text-gray-600 hover:text-indigo-600 font-semibold">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Trở lại
                    </button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-lg text-gray-600 mt-2">{product.shortDescription}</p>
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chương trình học</h2>
                            <div className="space-y-3">
                                {product.curriculum.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        onClick={onLessonClick}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center cursor-pointer hover:shadow-md hover:border-indigo-400 transition-all"
                                    >
                                        <div className="flex items-center">
                                            <PlayCircle className="w-6 h-6 text-indigo-500 mr-4" />
                                            <div>
                                                <p className="font-semibold text-gray-800">Bài {index + 1}: {lesson.title}</p>
                                                <p className="text-sm text-gray-500">{lesson.duration}</p>
                                            </div>
                                        </div>
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                            <span className="block text-3xl font-bold text-indigo-600 mt-4">{formatCurrency(product.price)}</span>
                            <button
                                onClick={handleAddToCartClick}
                                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <div className="mt-4 text-sm text-gray-500">
                                <p><strong>Đánh giá:</strong> {product.rating} / 5.0</p>
                                <p><strong>Số bài học:</strong> {product.curriculum.length}</p>
                                <p><strong>Lĩnh vực:</strong> {product.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default CourseDetailPage;