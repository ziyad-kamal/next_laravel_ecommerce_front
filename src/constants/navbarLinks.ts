const navbarLinks = (): { href: string; name: string }[] => {
    return [
        { href: "/admins/protected/categories", name: "categories" },
        { href: "/admins/protected/brands", name: "brands" },
        { href: "/admins/protected/items", name: "items" },
        { href: "/admins/protected/users", name: "users" },
        { href: "/admins/protected/home", name: "home" },
    ];
};

export default navbarLinks;
