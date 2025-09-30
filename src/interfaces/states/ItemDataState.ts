interface ItemDataState {
    name: string;
    trans_lang: string;
    condition: number | null | string;
    price: number | null;
    description: string;
    categoryId: number | null;
    categoryName: string;
    brandId: number | null;
    brandName: string;
}

export default ItemDataState;
