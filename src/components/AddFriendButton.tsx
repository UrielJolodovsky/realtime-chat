"use client"

import {FC, useState} from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import toast, { Toaster } from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import {z} from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = () => {

    type FormData = z.infer<typeof addFriendValidator>
    const router = useRouter()
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")

    const { register, handleSubmit, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(addFriendValidator)
    })

    const addFriend = async(email: string) => {
        try {
            const validatedEmail = addFriendValidator.parse({email})

            await axios.post('/api/friends/add', {email: validatedEmail})
                //.then((res) => console.log(res.data))
                //.catch((err) => console.log(err))
            setShowSuccessState(true)
            router.push('/dahsboard')
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                setError('email', {message: error.message})
        }
            if (error instanceof AxiosError){
                setError('email', {message: error.response?.data})
            }
            setError('email', {message: 'Something went wrong'})
    }
}

    const emailcargado = (data: FormData) => {
        addFriend(data.email)
    }

    return (
    <form onSubmit={handleSubmit(emailcargado)} className='max-w-sm'>
        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
            Add friend by E-mail
        </label>

        <div className='mt-2 flex gap-4'>
            <input {...register('email')} type='text' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' 
            placeholder='you@example.com'/>
            <Button>Add</Button>
        </div>
        
        {showSuccessState ? (
            <p className='mt-1 text-sm text-green-600'>Friend request sent</p>
        ) : toast.error(`${errors.email?.message}`)}
    </form>
  )
}

export default AddFriendButton