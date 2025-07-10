"use client";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { formatCurrency } from "../_utils/util";
import { Product, ProductCardProps } from "../_interface/interface";
import Image from "next/image";

const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    onViewDetails, 
    onToggleFavorite, 
    isFavorite 
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite(product.id);
    };

    const handleViewDetails = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        onViewDetails(product);
    };

    if (!mounted) return null; // 💥 tránh render lệch giữa SSR & CSR

    return (
        <article 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer"
            onClick={handleViewDetails}
        >
            <div className="relative h-48">
                <img
                    src={product.image.replace('600x400', '600x400')}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';
                    }}
                />
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm p-2 rounded-full transition-colors duration-300 hover:bg-white"
                    aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                >
                    <Heart 
                        className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                </button>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 
                        className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem] hover:text-indigo-600 transition-colors"
                        onClick={handleViewDetails}
                    >
                        {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">
                        {product.shortDescription}
                    </p>
                </div>
                <div className="mt-auto">
                    <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-gray-700 ml-1 font-bold">
                            {product.rating}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-indigo-600">
                            {formatCurrency(product.price)}
                        </span>
                        <button
                            onClick={handleViewDetails}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300 text-sm font-semibold"
                            aria-label={`Xem chi tiết ${product.name}`}
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
