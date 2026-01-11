export default function formatDate(dateString: string, locale: string) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}
