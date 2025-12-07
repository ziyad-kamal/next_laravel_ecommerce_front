interface OrderState {
    id: number;
    user: {
        name: string;
    };
    total_amount: number;
    state: string;
    date_of_delivery: string;
    created_at: string;
}

export default OrderState;
