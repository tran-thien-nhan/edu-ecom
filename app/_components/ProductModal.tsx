"use client";
import { Star, X } from "lucide-react";
import { formatCurrency } from "../_utils/util";
import { Product } from "../_interface/interface";

const ProductModal: React.FC<{
    product: Product | null;
    onClose: () => void;
    onViewCurriculum: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}> = ({ product, onClose, onViewCurriculum, onAddToCart }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <img
                        src={product.image.replace('600x400', '800x400')}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-t-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/cccccc/ffffff?text=Image+Error'; }}
                    />
                    <button onClick={onClose} className="absolute top-3 right-3 bg-gray-800/50 text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                    <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center">
                            <Star className="w-6 h-6 text-yellow-400 fill-current" />
                            <span className="text-gray-700 ml-1 text-lg font-bold">{product.rating}</span>
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Mô tả chi tiết</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={() => onViewCurriculum(product)}
                            className="bg-gray-100 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Xem chương trình học
                        </button>
                        <button
                            onClick={() => onAddToCart(product)}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105"
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductModal;