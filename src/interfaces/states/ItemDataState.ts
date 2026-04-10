interface ItemDataState {
    name: string;
    trans_lang: string;
    condition: number | undefined | string;
    price: number | null;
    description: string;
    category_id: number | null;
    category: string;
    brand_id: number | null;
    brand: string;
}

export default ItemDataState;
