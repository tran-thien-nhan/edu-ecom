"use client";
const PurchaseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-gray-800">Thông báo</h3>
                <p className="text-gray-600 mt-4">Bạn cần thêm khóa học này vào giỏ hàng thì mới học được.</p>
                <button
                    onClick={onClose}
                    className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Đã hiểu
                </button>
            </div>
        </div>
    );
};
export default PurchaseModal;