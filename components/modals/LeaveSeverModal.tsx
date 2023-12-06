import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '../ui/dialog';
import { useModalStore } from "@/hook/use-modal-store";
import { Button } from '@/components/ui/button';

const LeaveServerModal = () => {
  // Use the useModalStore hook to manage modal state
  const { onOpen, isOpen, onClose, type, data } = useModalStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const onClick = async () => {
    try {
      setLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()      
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error(`Error leaving server: ${error}`);
    }finally{
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      {/* Dialog content */}
      <DialogContent className='flex flex-col justify-center items-center bg-white text-black p-1 overflow-hidden w-full'>
        <DialogHeader className='pt-8 px-6 p-5 '>
          {/* Dialog title */}
          <DialogTitle className='text-2xl text-center font-bold'>
            Leave Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to leave? <span className='font-semibold text-indigo-500'>{server?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-40 py-4 w-full'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={loading} onClick={onClose} variant={'ghost'}>Cancel</Button>
            <Button disabled={loading} onClick={onClick} variant={'primary'}>Confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;