interface NotificationState {
    id: number;
    title: string;
    notification_id: number;
    message: string;
    created_at: string;
    is_read: boolean;
    type: string;
}

export default NotificationState;
