// * This model is almost exact copy of initialModel.tsx
'use client'

import * as zod from "zod";
import qs from "query-string"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle,  DialogHeader } from '../ui/dialog'
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from '../ui/form';
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useModalStore } from "@/hook/use-modal-store";
import { Select, SelectContent,SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select";
import { ChannelType } from "@prisma/client";

export const formSchema = zod.object({
  name: zod.string().min(1, {
    message: "Channel Name is required"
  }).refine(
    name => name !== "general" && name !== "General",
    {
      message: "Name Cannot Be 'General'",
    }
  ),
  type: zod.nativeEnum(ChannelType)
}) // Revalidation

const EditChannelModal = () => {
  const {isOpen , onClose , type, data} = useModalStore()

  const isModalOpen = isOpen && type === "editChannel"

  const router = useRouter()
  const {channel,server} = data;

  const form = useForm({
    resolver: zodResolver(formSchema), //* We add schmas here
    defaultValues: {
      name: "",
      type: channel?.type ||ChannelType.TEXT,
    }
  })
  
  useEffect(() => {
    if(channel){
      form.setValue("name",channel.name)
      form.setValue("type",channel.type)
    }
  },[form,channel]) // Useeffect dependencies has value props and state. ChannelType is props and channelType is state. This useeffect will work when these two will change
  const isLoading = form.formState.isSubmitting // It is likely used to track whether a form is currently being submitted or not.

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      }) // Getting the url
      await axios.patch(url, values)
      form.reset()
      router.refresh()
      window.location.reload() 
      onClose()
    }catch(err){
      console.log(err)
    }
  }

  const handleClose = () => {
    form.reset();
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      {/* Dialog content */}
      <DialogContent className='flex flex-col justify-center items-center bg-white text-black p-1 overflow-hidden w-80'>
        <DialogHeader className='pt-8 px-6 p-5 '>
          {/* Dialog title */}
          <DialogTitle className='text-2xl text-center font-bold'>
            Edit Channel
          </DialogTitle>
          {/* Dialog description */}
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <div className='space-y-10 px-6'>
      
              {/* Server name field */}
              <FormField control={form.control} name='name' render={({field}) => ( //! The bug was fixed this should be an object
                <FormItem>
                  <FormLabel className='uppercase text-sm font-bold text-stone-500 '>Channel Name</FormLabel>
                  <FormControl>
                    {/* Input field for server name */}
                    <Input disabled={isLoading} className='bg-stone-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ringout-0 ' placeholder='Enter Channel Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-sm font-bold text-stone-500 '>Channel Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ringout-0 ">
                          <SelectValue placeholder="Select Channel Type"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem className="capitalize" value={type} key={type}>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
                />
            </div>
            {/* Dialog footer */}
            <DialogFooter className='flex justify-center items-center px-20 py-5 '>
              {/* Create button */}
              <Button className='px-24 py-5' variant="primary" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal