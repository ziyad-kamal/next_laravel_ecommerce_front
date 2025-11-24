interface OrderDetailsState {
    id: number;
    total_amount: number;
    user_name: string;
    created_at: string;
    items: {
        id: number;
        name: string;
        admin_name: string;
        category_name: string;
        category_id: number;
        brand_name: string;
        brand_id: number;
        description: string;
        price: number;
        condition: string;
        approval: string;
        trans_lang: string;
        created_at: string;
        updated_at: string;
    }[];
}

export default OrderDetailsState;
