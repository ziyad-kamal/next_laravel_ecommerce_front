import ModalProps from "@/interfaces/props/ModalProps";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ModalState from "@/interfaces/states/ModalState";
import { hide } from "@/redux/DisplayModal";

const Modal = ({ title, children, handleClick }: ModalProps) => {
    const modalState = useAppSelector(
        (state: { displayModal: ModalState }) => state.displayModal
    );
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(hide());
    };
    console.log(5);
    const getBtnStyles = () => {
        switch (modalState.type) {
            case "update":
                return `bg-green-700  hover:bg-green-800 text-white`;
            case "confirm":
                return `bg-red-700  hover:bg-red-800 text-white`;
        }
    };

    return (
        <div
            onClick={handleClose}
            id="modalOverlay"
            className={`${
                modalState.isVisible ? "flex" : "hidden"
            } modal-overlay fixed inset-0 bg-semi-trans  items-center justify-center p-4 z-3000`}
        >
            <div
                id="modalContent"
                className="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={handleClose}
                        id="closeModal"
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <Button
                        text={"cancel"}
                        type="button"
                        classes="bg-gray-400 hover:bg-gray-500"
                        handleClick={handleClose}
                    />
                    <Button
                        text={
                            modalState.type === "confirm" ? "confirm" : "update"
                        }
                        type={
                            modalState.type === "confirm" ? "button" : "submit"
                        }
                        classes={getBtnStyles()}
                        handleClick={handleClick}
                        isLoading={modalState.disable}
                    />
                </div>
            </div>
        </div>
    );
};

export default Modal;
