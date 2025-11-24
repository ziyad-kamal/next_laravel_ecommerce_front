import sendRequest from "@/functions/sendRequest";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { display } from "@/redux/DisplayToast";
import {
    faBars,
    faBell,
    faCartShopping,
    faMagnifyingGlass,
    faShoppingCart,
    faUser,
    faXmark,
    faTrash,
    faPlus,
    faMinus,
    faCheck,
    faTimes,
    faCog,
    faSignOutAlt,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import TokenState from "../../interfaces/states/TokenState";
import { userTokenRemove, userTokenSet } from "@/redux/SetToken";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const tokenState = useAppSelector(
        (state: { setToken: TokenState }) => state.setToken
    );

    // Notifications state
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Order Shipped",
            message: "Your order #12345 has been shipped and is on its way!",
            time: "2 minutes ago",
            isRead: false,
            type: "success",
        },
        {
            id: 2,
            title: "New Promotion",
            message: "Get 20% off on all electronics. Limited time offer!",
            time: "1 hour ago",
            isRead: false,
            type: "promotion",
        },
        {
            id: 3,
            title: "Account Security",
            message: "Your password was changed successfully.",
            time: "3 hours ago",
            isRead: true,
            type: "security",
        },
    ]);

    // Cart state
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            price: 79.99,
            quantity: 1,
            image: "https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=HP",
        },
        {
            id: 2,
            name: "Smart Watch Series 5",
            price: 199.99,
            quantity: 2,
            image: "https://via.placeholder.com/60x60/059669/FFFFFF?text=SW",
        },
        {
            id: 3,
            name: "USB-C Cable",
            price: 12.99,
            quantity: 1,
            image: "https://via.placeholder.com/60x60/DC2626/FFFFFF?text=CB",
        },
    ]);

    const notificationRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Calculate counts
    const notificationCount = notifications.filter((n) => !n.isRead).length;
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

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
                cartRef.current &&
                !cartRef.current.contains(event.target as Node)
            ) {
                setShowCart(false);
            }
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };

        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            dispatch(userTokenSet());
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [dispatch]);

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

    // Cart functions
    const updateQuantity = (id: number, change: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const removeFromCart = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // User menu functions
    let abortControllerForSubmit: AbortController | null = null;
    const handleLogout = () => {
        setShowUserMenu(false);

        const url = `/logout`;
        if (abortControllerForSubmit) {
            abortControllerForSubmit.abort();
        }
        abortControllerForSubmit = new AbortController();

        const logout = async () => {
            const response = await sendRequest(
                "post",
                url,
                null,
                abortControllerForSubmit
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

    return (
        <nav className="bg-primary-color text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg mr-3">
                                E
                            </div>
                            <span className="text-xl font-bold">ECOMMERCE</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a
                                href="#"
                                className="text-gray-300  hover:text-white px-3 py-2 text-sm font-bold transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-bold transition-colors"
                            >
                                Products
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-bold transition-colors"
                            >
                                Categories
                            </a>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                        <div className="w-full">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search"
                                    className="w-full bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right side icons */}

                    {tokenState.isUserToken ? (
                        <div className="hidden lg:flex items-center space-x-4">
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
                                    <FontAwesomeIcon
                                        icon={faBell}
                                        className="w-5 h-5"
                                    />
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
                                                    Notifications
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
                                                            key={
                                                                notification.id
                                                            }
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
                                                                        {!notification.isRead && (
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
                                                                            notification.time
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center space-x-1 ml-2">
                                                                    {!notification.isRead && (
                                                                        <button
                                                                            onClick={() =>
                                                                                markAsRead(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                            className="text-green-600 hover:text-green-800 p-1"
                                                                            title="Mark as read"
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faCheck
                                                                                }
                                                                                className="w-3 h-3"
                                                                            />
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
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faTimes
                                                                            }
                                                                            className="w-3 h-3"
                                                                        />
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

                            {/* Shopping Cart */}
                            <div
                                className="relative"
                                ref={cartRef}
                            >
                                <button
                                    onClick={() => setShowCart(!showCart)}
                                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <FontAwesomeIcon
                                        icon={faShoppingCart}
                                        className="w-5 h-5"
                                    />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                {/* Cart Dropdown */}
                                {showCart && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="p-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Shopping Cart
                                                </h3>
                                                {cartItems.length > 0 && (
                                                    <button
                                                        onClick={clearCart}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {cartItems.length === 0 ? (
                                                <div className="p-4 text-gray-500 text-center">
                                                    Your cart is empty
                                                </div>
                                            ) : (
                                                cartItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 border-b border-gray-100 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {/* <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        /> */}
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-800 text-sm">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-blue-600 font-semibold">
                                                                    $
                                                                    {item.price}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            -1
                                                                        )
                                                                    }
                                                                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faMinus
                                                                        }
                                                                        className="w-2 h-2 text-gray-600"
                                                                    />
                                                                </button>
                                                                <span className="w-8 text-center font-medium text-gray-800">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            1
                                                                        )
                                                                    }
                                                                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faPlus
                                                                        }
                                                                        className="w-2 h-2 text-gray-600"
                                                                    />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        removeFromCart(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrash
                                                                        }
                                                                        className="w-3 h-3"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {cartItems.length > 0 && (
                                            <div className="p-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-semibold text-gray-800">
                                                        Total:
                                                    </span>
                                                    <span className="font-bold text-lg text-blue-600">
                                                        ${cartTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                                    Checkout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* User Account */}
                            <div
                                className="relative"
                                ref={userMenuRef}
                            >
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="flex items-center space-x-1 p-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="w-5 h-5"
                                    />
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="w-3 h-3"
                                    />
                                </button>

                                {/* User Menu Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="py-2">
                                            <button
                                                onClick={handleSettings}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center space-x-3 transition-colors"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCog}
                                                    className="w-4 h-4 text-gray-500"
                                                />
                                                <span>Settings</span>
                                            </button>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center space-x-3 transition-colors"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSignOutAlt}
                                                    className="w-4 h-4 text-red-500"
                                                />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <a
                                href="#"
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                            >
                                language
                            </a>
                        </div>
                    ) : (
                        <Link
                            href="/users/public/login"
                            className="text-gray-300 hover:text-white px-3 py-2 text-sm font-bold transition-colors"
                        >
                            login
                        </Link>
                    )}

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-300 hover:text-white p-2 transition-colors"
                        >
                            {isMenuOpen ? (
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="w-6 h-6"
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faBars}
                                    className="w-6 h-6"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Mobile Search */}
                        <div className="px-3 py-2">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                />
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
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                        >
                            Products
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                        >
                            Categories
                        </a>

                        {/* Mobile User Menu */}
                        {tokenState.isUserToken && (
                            <div className="border-t border-gray-800 mt-2 pt-2">
                                <button
                                    onClick={handleSettings}
                                    className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                                >
                                    <FontAwesomeIcon
                                        icon={faCog}
                                        className="w-4 h-4 mr-3"
                                    />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-400 hover:text-red-300 block px-3 py-2 text-base font-medium transition-colors w-full text-left"
                                >
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        className="w-4 h-4 mr-3"
                                    />
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile Icons */}
                        <div className="flex items-center space-x-4 px-3 py-2 border-t border-gray-800 mt-2">
                            <button className="relative p-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                <FontAwesomeIcon
                                    icon={faBell}
                                    className="w-5 h-5"
                                />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            <button className="relative cursor-pointer p-2 text-gray-300 hover:text-white transition-colors">
                                <FontAwesomeIcon
                                    icon={faCartShopping}
                                    className="w-5 h-5"
                                />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <a
                                href="#"
                                className="text-gray-300 cursor-pointer hover:text-white block px-3 py-2 text-base font-medium transition-colors"
                            >
                                language
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
