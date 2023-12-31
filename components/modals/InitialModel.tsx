// TODO: Tommorow we will start from making the server api which send data of the user to the discord as well!.
'use client'

import * as zod from "zod";
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from '../ui/dialog'
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from '../ui/form';
import FileUpload from "../ui/fileUpload";
import { useRouter } from "next/navigation";


export const formSchema = zod.object({
  name: zod.string().min(1, {
    message: "Server Name is required"
  }),
  imageUrl: zod.string().min(1, {
    message: "Server Image is required"
  })
})

const InitialModel = () => {
  const [isMounted, setIsMounted] = useState(false) // By setting isMounted to false initially and then setting it to true in the useEffect hook, the component returns null if it hasn't been mounted yet. This ensures that the component is not rendered on the server and avoids the hydration error. Once the component is mounted on the client, it will be rendered as usual.
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema), //* We add schmas here
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  })

  const isLoading = form.formState.isSubmitting // It is likely used to track whether a form is currently being submitted or not.

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try{
      await axios.post("/api/servers", values)
      form.reset()
      router.refresh()
      window.location.reload() 
    }catch(err){
      console.log(err)
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      {/* Dialog content */}
      <DialogContent className='flex flex-col justify-center items-center bg-white text-black p-1 overflow-hidden w-full'>
        <DialogHeader className='pt-8 px-6 p-5 '>
          {/* Dialog title */}
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your Sever
          </DialogTitle>
          {/* Dialog description */}
          <DialogDescription className='text-center text-stone-500 max-w-sm '>
            Give your server your Power with name and image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <div className='space-y-10 px-6'>
              {/* Image upload */}
              <div className='flex items-center text-center justify-center'>
                <FormField control={form.control} name='imageUrl' render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />


              </div>
              {/* Server name field */}
              <FormField control={form.control} name='name' render={({field}) => ( //! The bug was fixed this should be an object
                <FormItem>
                  <FormLabel className='uppercase text-sm font-bold text-stone-500 '>Server Name</FormLabel>
                  <FormControl>
                    {/* Input field for server name */}
                    <Input disabled={isLoading} className='bg-stone-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ringout-0 ' placeholder='Enter Server Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>)} />
            </div>
            {/* Dialog footer */}
            <DialogFooter className='flex justify-center items-center px-20 py-5 '>
              {/* Create button */}
              <Button className='px-24 py-5' variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InitialModel