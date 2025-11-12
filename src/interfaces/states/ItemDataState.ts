interface ItemDataState {
    name: string;
    trans_lang: string;
    condition: number | undefined | string;
    price: number | null;
    description: string;
    category_id: number | null;
    category_name: string;
    brand_id: number | null;
    brand_name: string;
}

export default ItemDataState;
