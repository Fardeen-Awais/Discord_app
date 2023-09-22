// * This model is almost exact copy of initialModel.tsx
// Import necessary dependencies
import axios from 'axios';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '../ui/dialog';
import { useModalStore } from "@/hook/use-modal-store";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hook/use-origin';

/**
 * InviteModal component
 */
const InviteModal = () => {
  // Use the useModalStore hook to manage modal state
  const { onOpen, isOpen, onClose, type, data } = useModalStore();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin(); // This gives me the url of the origin such as in local it gives me localhost:3000

  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`; // We extract the data of the server. This is the invite code we get is from database.

  /**
   * Handle copy button click
   */
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl); // This copies the invite url from above variable
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /**
   * Handle generate new link button click
   */
  const onNew = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      {/* Dialog content */}
      <DialogContent className='flex flex-col justify-center items-center bg-white text-black p-1 overflow-hidden w-80'>
        <DialogHeader className='pt-8 px-6 p-5 '>
          {/* Dialog title */}
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Invite Model</Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input disabled={loading} className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 px-3 w-64' value={inviteUrl} />
            <Button disabled={loading} onClick={onCopy}>
              {!copied ? <Copy className='w-4 h-4' />
                : <Check />}
            </Button>
          </div>
          <Button onClick={onNew} disabled={loading} variant="link" size={"sm"} className='text-xs text-zinc-500 mt-3'>
            Generate a new link
            <RefreshCcw className='w-4 h-4 ml-3' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;