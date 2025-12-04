interface OrderDetailsState {
    id: number;
    total_amount: number;
    quantity: number;
    method: string;
    user: {
        name: string;
        email: string;
        user_infos: {
            address: string;
            card_type: string;
            card_num: string;
            phone: number | null;
        };
    };

    state: string;
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
        images: { path: string }[];
    }[];
}

export default OrderDetailsState;
