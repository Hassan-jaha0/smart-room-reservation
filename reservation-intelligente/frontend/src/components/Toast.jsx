import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 10);
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onCloseRef.current(), 300);
        }, 4000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const styles = {
        success: {
            bg: 'bg-emerald-50 border-emerald-200',
            icon: <CheckCircle2 size={20} className="text-emerald-500" />,
            text: 'text-emerald-800',
        },
        error: {
            bg: 'bg-rose-50 border-rose-200',
            icon: <XCircle size={20} className="text-rose-500" />,
            text: 'text-rose-800',
        },
        info: {
            bg: 'bg-indigo-50 border-indigo-200',
            icon: <Info size={20} className="text-indigo-500" />,
            text: 'text-indigo-800',
        },
    };

    const s = styles[type] || styles.info;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onCloseRef.current(), 300);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: `1.5rem`,
                right: '1.5rem',
                zIndex: 99999,
                maxWidth: '24rem',
                width: '100%',
                transition: 'all 0.3s ease',
                transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: 'auto',
            }}
        >
            <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${s.bg}`}>
                <div className="mt-0.5 shrink-0">{s.icon}</div>
                <p className={`text-sm font-semibold flex-1 ${s.text}`}>{message}</p>
                <button onClick={handleClose} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

// Hook — renders via Portal so toasts always float above everything
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Render toasts via Portal into document.body — always on top
    const ToastContainer = useCallback(() => {
        if (toasts.length === 0) return null;
        return createPortal(
            <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 99999, pointerEvents: 'none' }}>
                {toasts.map((toast, index) => (
                    <div key={toast.id} style={{ marginTop: index > 0 ? '0.5rem' : 0 }}>
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>,
            document.body
        );
    }, [toasts, removeToast]);

    return { showToast, ToastContainer };
};

export default Toast;
