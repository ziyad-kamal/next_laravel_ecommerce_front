interface NavbarLink {
    href?: string;
    name: string;
    submenu?: NavbarLink[];
}

const navbarLinks = (): NavbarLink[] => {
    return [
        { href: "/admins/protected/dashboard", name: "home" },
        { href: "/admins/protected/items", name: "items" },
        { href: "/admins/protected/orders", name: "orders" },
        {
            name: "management",
            submenu: [
                { href: "/admins/protected/users", name: "users_list" },
                { href: "/admins/protected/admins", name: "admins_list" },
                {
                    href: "/admins/protected/categories",
                    name: "categories_list",
                },
                { href: "/admins/protected/brands", name: "brands_list" },
            ],
        },
    ];
};

export default navbarLinks;
