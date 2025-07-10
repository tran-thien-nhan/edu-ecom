"use client";
import { useParams } from "next/navigation";
import { mockProducts } from "@/app/_data/mockProducts";
import CourseDetailPage from "@/app/_components/CourseDetailPage";
import { useState, useEffect } from "react";
import { Product } from "@/app/_interface/interface";
import { useRouter } from "next/navigation";
import { Fireworks } from "@/app/_components/Fireworks";
import Toast from "@/app/_components/Toast";

export default function CourseDetailRoute() {
    const { slug } = useParams();
    const router = useRouter();
    const product = mockProducts.find((p) => p.slug === slug);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showFireworks, setShowFireworks] = useState(false);
    const [cart, setCart] = useState<Product[]>([]);

    // Load cart từ localStorage khi mở trang
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            } catch (e) {
                console.error("Lỗi khi parse giỏ hàng:", e);
                localStorage.removeItem("cart");
            }
        }
    }, []);

    const handleAddToCart = (product: Product) => {
        const cartFromStorage = localStorage.getItem("cart");
        const currentCart = cartFromStorage ? JSON.parse(cartFromStorage) : [];

        const isProductInCart = currentCart.some((item: Product) => item.id === product.id);

        if (isProductInCart) {
            setToastMessage("Sản phẩm đã có trong giỏ hàng");
            return;
        }

        const updatedCart = [...currentCart, product];

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        setToastMessage(`🎉 Đã thêm "${product.name}" vào giỏ hàng`);
        triggerFireworks();
    };

    const triggerFireworks = () => {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 4000);
    };

    if (!product) return <div>Không tìm thấy khóa học.</div>;

    return (
        <>
            <Fireworks isVisible={showFireworks} onAnimationEnd={() => setShowFireworks(false)} />
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <CourseDetailPage
                product={product}
                onBack={() => router.back()}
                onLessonClick={() => setIsPurchaseModalOpen(true)}
                onAddToCart={handleAddToCart}
                triggerFireworks={triggerFireworks}
                setToastMessage={setToastMessage}
            />

        </>
    );
}