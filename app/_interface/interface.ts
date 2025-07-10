export interface Lesson {
    id: string;
    title: string;
    duration: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    shortDescription: string;
    description: string;
    image: string;
    rating: number;
    category: string;
    curriculum: Lesson[];
}

export interface ChatMessage {
    id: string;
    text: string;
    from: 'user' | 'bot';
    productSuggestions?: Product[];
}

export interface ProductContextProps {
    products: Product[];
    favorites: number[];
    cart: Product[];
    recentlyViewed: number[];
    handleToggleFavorite: (id: number) => void;
    handleAddToCart: (product: Product) => void;
    handleRemoveFromCart: (id: number) => void;
    addToRecentlyViewed: (id: number) => void;
}

export interface ProductCardProps {
    product: Product;
    onViewDetails: (product: Product) => void;
    onToggleFavorite: (id: number) => void;
    isFavorite: boolean;
    onAddToCart?: () => void;
}

export interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}