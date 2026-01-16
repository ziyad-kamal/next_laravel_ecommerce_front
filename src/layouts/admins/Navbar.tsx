import sendRequest from "@/functions/sendRequest";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCookie, setCookie } from "@/functions/cookies";
import { display } from "@/redux/DisplayToast";
import {
    Menu,
    Bell,
    Search,
    User,
    X,
    Check,
    Settings,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { userTokenRemove, userTokenSet } from "@/redux/SetToken";
import { useTranslations } from "next-intl";
import { setLocale } from "@/redux/setLocale";
import LocaleState from "@/interfaces/states/LocaleState";
import { navbarLinks, languages } from "@/constants";
import { getEcho } from "@/lib/echo";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showUserLang, setShowUserLang] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const localeState = useAppSelector(
        (state: { setLocale: LocaleState }) => state.setLocale
    );

    // Notifications state
    const [notifications, setNotifications] = useState<
        Array<{
            id: number;
            title: string;
            message: string;
            created_at: string;
            is_read: boolean;
            type: string;
        }>
    >([]);

    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const userLangRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("navbar");
    const tLanguage = useTranslations("language");

    // Calculate counts
    const notificationCount = notifications.filter((n) => !n.is_read).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }

            if (
                userLangRef.current &&
                !userLangRef.current.contains(event.target as Node)
            ) {
                setShowUserLang(false);
            }
        };

        const storedToken = localStorage.getItem("adminToken");
        if (storedToken) {
            dispatch(userTokenSet());
        }

        const defaultLang = getCookie("defaultLang");

        if (defaultLang) {
            dispatch(setLocale({ locale: defaultLang }));
        } else {
            const browserLocale = navigator.language.slice(0, 2);
            dispatch(setLocale({ locale: browserLocale }));
            setCookie("defaultLang", browserLocale);
            router.refresh();
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [dispatch, router]);

    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        const echo = getEcho(storedToken);

        const channel = echo.private(`App.Models.Admin.${1}`);
        channel.notification((notification: unknown) => {
            setNotifications((prevNotification) => [
                ...prevNotification,
                notification as {
                    id: number;
                    title: string;
                    message: string;
                    created_at: string;
                    is_read: boolean;
                    type: string;
                },
            ]);
        });

        return () => {
            channel.stopListening(".notification");
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // const handleSearch = () => {
    //     console.log("Searching for:", searchQuery);
    //     // Add your search logic here
    // };

    // Notification functions
    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, isRead: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    };

    // User menu functions
    let abortControllerForSubmit: AbortController | null = null;
    const handleLogout = () => {
        setShowUserMenu(false);
        setShowUserLang(false);

        const url = `/logout`;
        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();
        const token = localStorage.getItem("adminToken");

        const logout = async () => {
            const response = await sendRequest(
                "post",
                url,
                null,
                abortControllerForSubmit,
                token
            );

            if (response && response.success) {
                dispatch(
                    display({ type: "success", message: response.msg.text })
                );
                localStorage.removeItem("token");
                dispatch(userTokenRemove());

                router.push("/users/public/login");
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        logout();
    };

    const handleSettings = () => {
        setShowUserMenu(false);
        setShowUserLang(false);
        // Add your settings navigation logic here
        console.log("Navigate to settings");
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return "✅";
            case "promotion":
                return "🎉";
            case "security":
                return "🔒";
            default:
                return "📢";
        }
    };

    let abortControllerForLang: AbortController | null = null;

    const handleLang = (lang: string) => {
        const url = `/admin-panel/lang`;
        const token = localStorage.getItem("adminToken");

        if (abortControllerForLang) {
            abortControllerForLang.abort();
        }
        abortControllerForLang = new AbortController();

        const changeLang = async () => {
            const response = await sendRequest(
                "post",
                url,
                { defaultLang: lang },
                abortControllerForLang,
                token,
                router
            );

            if (response && response.success) {
                dispatch(setLocale({ locale: lang }));
                setCookie("defaultLang", lang);
                router.refresh();
            } else if (response) {
                dispatch(
                    display({ type: "error", message: response.msg.text })
                );
            }
        };

        changeLang();
    };

    return (
        <nav className="bg-primary-color text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg mx-3">
                                E
                            </div>
                            <span className="text-xl font-bold">ECOMMERCE</span>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden clg:block">
                        <div className="ml-5 flex items-baseline space-x-8">
                            {navbarLinks().map((navbarLink, i) => (
                                <div
                                    key={i}
                                    className="relative group"
                                >
                                    {navbarLink.submenu ? (
                                        <>
                                            <button
                                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-bold transition-colors flex items-center space-x-1"
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown ===
                                                            navbarLink.name
                                                            ? null
                                                            : navbarLink.name
                                                    )
                                                }
                                            >
                                                <span>
                                                    {t(navbarLink.name)}
                                                </span>
                                                <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="py-2">
                                                    {navbarLink.submenu.map(
                                                        (subItem, j) => (
                                                            <a
                                                                key={j}
                                                                href={
                                                                    subItem.href
                                                                }
                                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                                                            >
                                                                {t(
                                                                    subItem.name
                                                                )}
                                                            </a>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <a
                                            className="text-gray-300 hover:text-white px-3 py-2 text-sm font-bold transition-colors"
                                            href={navbarLink.href}
                                        >
                                            {t(navbarLink.name)}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="hidden clg:flex flex-1 max-w-lg mx-8">
                        <div className="w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder={t("search")}
                                    className="w-full bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Right side icons */}
                    <div className="hidden clg:flex items-center space-x-4">
                        {/* Notifications */}
                        <div
                            className="relative"
                            ref={notificationRef}
                        >
                            <button
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {t("notifications")}
                                            </h3>
                                            {notificationCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-gray-500 text-center">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.map(
                                                (notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 border-b cursor-pointer border-gray-100 hover:bg-gray-200 `}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-lg">
                                                                        {getNotificationIcon(
                                                                            notification.type
                                                                        )}
                                                                    </span>
                                                                    <h4 className="font-medium text-gray-800">
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h4>
                                                                    {!notification.is_read && (
                                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {
                                                                        notification.created_at
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-1 ml-2">
                                                                {!notification.is_read && (
                                                                    <button
                                                                        onClick={() =>
                                                                            markAsRead(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                        className="text-green-600 hover:text-green-800 p-1"
                                                                        title="Mark as read"
                                                                    >
                                                                        <Check className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() =>
                                                                        deleteNotification(
                                                                            notification.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                    title="Delete"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Account */}
                        <div
                            className="relative"
                            ref={userMenuRef}
                        >
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-1 p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <User className="w-5 h-5" />
                                <ChevronDown className="w-3 h-3" />
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-2">
                                        <button
                                            onClick={handleSettings}
                                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center space-x-3 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-gray-500" />
                                            <span>{t("profile")}</span>
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center space-x-3 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            <span>{t("logout")}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User lang */}
                        <div
                            className="relative"
                            ref={userLangRef}
                        >
                            <button
                                onClick={() => setShowUserLang(!showUserLang)}
                                className="flex items-center space-x-1 p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                {t("language")}
                                <ChevronDown className="w-3 h-3 mx-1" />
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserLang && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-2">
                                        {languages().map((lang, i) => (
                                            <button
                                                key={i}
                                                onClick={() =>
                                                    handleLang(lang.abbre)
                                                }
                                                className={`w-full text-left px-4 py-2 text-gray-700 ${
                                                    localeState.locale ==
                                                    lang.abbre
                                                        ? "bg-gray-200"
                                                        : ""
                                                } hover:bg-gray-200 flex items-center space-x-3 transition-colors `}
                                            >
                                                {tLanguage(lang.name)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="clg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-300 hover:text-white p-2 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="clg:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Mobile Search */}
                        <div className="px-3 py-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="w-full bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Mobile Navigation Links */}
                        {navbarLinks().map((navbarLink, i) => (
                            <div key={i}>
                                {navbarLink.submenu ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(
                                                    openDropdown ===
                                                        navbarLink.name
                                                        ? null
                                                        : navbarLink.name
                                                )
                                            }
                                            className="text-gray-300 hover:text-white w-full text-left px-3 py-2 text-base font-medium transition-colors flex items-center justify-between"
                                        >
                                            <span>{t(navbarLink.name)}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transform transition-transform ${
                                                    openDropdown ===
                                                    navbarLink.name
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                        {openDropdown === navbarLink.name && (
                                            <div className="pl-4 bg-gray-800">
                                                {navbarLink.submenu.map(
                                                    (subItem, j) => (
                                                        <a
                                                            key={j}
                                                            href={subItem.href}
                                                            className="text-gray-400 hover:text-white block px-3 py-2 text-sm font-medium transition-colors"
                                                        >
                                                            {t(subItem.name)}
                                                        </a>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <a
                                        href={navbarLink.href}
                                        className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                                    >
                                        {t(navbarLink.name)}
                                    </a>
                                )}
                            </div>
                        ))}

                        {/* Mobile User Menu */}

                        <div className="border-t border-gray-800 mt-2 pt-2">
                            <button
                                onClick={handleSettings}
                                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                            >
                                <Settings className="w-4 h-4 mr-3 inline" />
                                {t("profile")}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-red-400 hover:text-red-300 block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                            >
                                <LogOut className="w-4 h-4 mr-3 inline" />
                                {t("logout")}
                            </button>
                        </div>

                        {/* Mobile Icons */}
                        <div className="flex items-center space-x-4 px-3 py-2 border-t border-gray-800 mt-2">
                            <button className="relative p-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                            <a
                                href="#"
                                className="text-gray-300 cursor-pointer hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                            >
                                {t("language")}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
