"use client"

import { type } from 'os'
import React from 'react'
import { UploadDropzone } from '@/lib/uploadingthing'
import "@uploadthing/react/styles.css"
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import { split } from 'postcss/lib/list'
import { Button } from './button'

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const fileType = value?.split(".").pop()
    if (value && fileType !== "pdf") {
        return (
            <div className='h-20 w-20 relative'>
                <Image fill src={value} alt='Upload Image' className='rounded-3xl' />
                <Button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button"><X className='h-4 w-4 rounded-full' /></Button>
            </div>
        )
    }

    if(value && fileType === 'pdf'){
        return (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10 '>
                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
                <a href={value} target='_blank' rel='noopner noreferrer' className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                    {value}
                </a>
                <Button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm" type="button"><X className='h-4 w-4 rounded-full' /></Button>
            </div>
        )
    }

    return (
        <UploadDropzone endpoint={endpoint} onUploadError={(error: Error) => { console.log(error) }} onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }} />
    )
}

export default FileUpload