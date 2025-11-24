interface ModalState {
    isVisible?: boolean;
    type?: "update" | "confirm";
    disable?: boolean;
}

export default ModalState;
