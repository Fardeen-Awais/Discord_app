import { Server } from '@prisma/client';
import { create } from 'zustand';

// Define the possible types of modals
export type ModalType = "createServer" | 'invite' | "editServer"| "members"; // Checking the model type

// Define the structure of the modal data
interface ModalData {
    server?: Server; // Yay mujhay server k data ka access day ga
}

// Define the structure of the modal store
interface ModalStore {
    type: ModalType | null; // The current type of the modal
    data: ModalData; // The data associated with the modal
    isOpen: boolean; // Flag to indicate if the modal is open or not
    onOpen: (type: ModalType, data?: ModalData) => void; // Function to open the modal
    onClose: () => void; // Function to close the modal
}

// Create the modal store using Zustand
export const useModalStore = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type: ModalType, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));