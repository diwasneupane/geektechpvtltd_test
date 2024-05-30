import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function Confirmation({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-lg font-semibold mb-4">{message}</div>
                <div className="flex justify-end">
                    <button
                        className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-md mr-2 hover:bg-green-600 transition duration-300 ease-in-out"
                        onClick={onConfirm}
                    >
                        <FaCheckCircle className="mr-1" /> Confirm
                    </button>
                    <button
                        className="flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                        onClick={onCancel}
                    >
                        <FaTimesCircle className="mr-1" /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
