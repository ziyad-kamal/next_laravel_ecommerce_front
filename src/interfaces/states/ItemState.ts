interface ItemState {
    id: number;
    name: string;
    condition: string;
    price: number | null;
    approval: string;
    trans_lang: string;
    created_at: string;
}

export default ItemState;
