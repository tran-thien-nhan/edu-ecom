"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage, Product } from "../_interface/interface";
import { Bot, Send, X } from "lucide-react";
import { formatCurrency, getGeminiSuggestedProducts } from "../_utils/util";

const Chatbot: React.FC<{
    allProducts: Product[];
    handleAddToCart: (product: Product) => void;
    handleViewCurriculum: (product: Product) => void;
}> = ({ allProducts, handleAddToCart, handleViewCurriculum }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: crypto.randomUUID(), text: 'Chào bạn, tôi là trợ lý AI. Bạn cần tìm khóa học về chủ đề gì?', from: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = { id: crypto.randomUUID(), text: inputValue, from: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        try {
            const matchedProducts = await getGeminiSuggestedProducts(inputValue, allProducts);

            let botResponse: ChatMessage;

            if (matchedProducts.length > 0) {
                botResponse = {
                    id: crypto.randomUUID(),
                    text: `Tôi tìm thấy một vài khóa học phù hợp. Bạn muốn xem chi tiết hoặc thêm vào giỏ hàng không?`,
                    from: 'bot',
                    productSuggestions: matchedProducts
                };
            } else {
                botResponse = {
                    id: crypto.randomUUID(),
                    text: 'Xin lỗi, tôi không tìm thấy khóa học phù hợp. Bạn có thể thử lại với từ khóa khác như "React", "Tiếng Anh", "Thiết kế"...',
                    from: 'bot'
                };
            }

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Gemini error:', error);
            setMessages(prev => [
                ...prev,
                { id: crypto.randomUUID(), text: 'Xin lỗi, tôi đang gặp sự cố. Bạn hãy thử lại sau nhé.', from: 'bot' }
            ]);
        }
    };


    const onChatAction = (action: 'add' | 'view', product: Product) => {
        if (action === 'add') {
            handleAddToCart(product);
            const botResponse: ChatMessage = {
                id: crypto.randomUUID(),
                text: `Đã thêm "${product.name}" vào giỏ hàng của bạn!`,
                from: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        } else if (action === 'view') {
            handleViewCurriculum(product);
            setIsOpen(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:scale-110 z-40"
            >
                {isOpen ? <X size={32} /> : <Bot size={32} />}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-5 w-full max-w-sm h-[500px] bg-white rounded-lg shadow-xl flex flex-col animate-fade-in-up z-40">
                    <div className="p-3 bg-indigo-600 text-white rounded-t-lg">
                        <h3 className="font-semibold text-center">Trợ lý AI</h3>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <div className={`flex mb-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg py-2 px-3 max-w-[85%] ${msg.from === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                                {msg.from === 'bot' && msg.productSuggestions && (
                                    <div className="space-y-2">
                                        {msg.productSuggestions.map(p => (
                                            <div key={p.id} className="bg-white border rounded-lg p-2 flex flex-col text-sm">
                                                <div className="flex items-start space-x-2">
                                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">{p.name}</p>
                                                        <p className="font-bold text-indigo-600">{formatCurrency(p.price)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <button onClick={() => onChatAction('view', p)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded">Xem chi tiết</button>
                                                    <button onClick={() => onChatAction('add', p)} className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded">Thêm vào giỏ</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-2 border-t flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Nhập câu hỏi..."
                            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 rounded-r-md hover:bg-indigo-600">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
export default Chatbot;