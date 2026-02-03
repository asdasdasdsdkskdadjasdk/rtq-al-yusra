import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function NotificationDropdown({ notifications, count }) {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage().props;
    const isWali = auth.user.role === 'wali_santri';

    const handleRead = () => {
        // SEMUA User (Wali, Admin, PSB) perlu mark as read jika ada notifikasi DB
        if (count > 0) {
            router.post(route('notifications.read'), {}, {
                preserveScroll: true,
            });
        }
    };

    const toggleDropdown = () => {
        if (isOpen) {
            // Jika sedang terbuka dan mau ditutup -> Mark as Read
            handleRead();
        }
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        if (isOpen) {
            handleRead();
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            {/* --- ICON LONCENG --- */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none transition"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {count > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                            {count}
                        </span>
                    </span>
                )}
            </button>

            {/* --- DROPDOWN CONTENT --- */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={closeDropdown}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">Notifikasi</span>
                            {!isWali && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">To-Do List</span>}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    {isWali ? "Tidak ada notifikasi baru." : "Semua pekerjaan selesai! 🎉"}
                                </div>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <Link
                                        key={idx}
                                        href={notif.data.url}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 group
                                            ${notif.read_at === null && isWali ? 'bg-blue-50/50' : ''}
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Icon Indicator based on Type */}
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 
                                                ${notif.data.type === 'success' ? 'bg-green-500' : ''}
                                                ${notif.data.type === 'error' ? 'bg-red-500' : ''}
                                                ${notif.data.type === 'warning' ? 'bg-yellow-500' : ''}
                                                ${notif.data.type === 'info' ? 'bg-blue-500' : ''}
                                            `}></div>

                                            <div>
                                                <p className={`text-sm ${notif.read_at === null ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                    {notif.data.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(notif.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}