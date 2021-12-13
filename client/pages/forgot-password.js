import {useState, useContext, useEffect} from 'react'
import axios from 'axios';
import {toast} from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link'
import {Context} from '../context'
import {useRouter} from 'next/router'

const ForgotPassword = () => {
    //state

    const [email,setEmail] =useState('')
    const [success,setSuccess] =useState(false)
    const [code,setCode] =useState('')
    const [newPassword,setNewPassword] =useState('')
    const [loading,setLoading] =useState(false)

    // context
    const {state: {user},
    } =useContext(Context)
    // router
    const router = useRouter();

    // redirect if user is logged in

    useEffect(() => {
        if (user !== null) router.push('/');
    },[user]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            
            const {data} = await axios.post('/api/forgot-password', {email});
            setSuccess(true);
            console.log(data)
            toast.success('Check your email for the secret code')
            setLoading(false);
        }   catch (err){
            setLoading(false)
            toast(err.response.data)
        }
    };

        const handleResetPassword = async (e) => {
            e.preventDefault();
            console.log(email, code, newPassword);
            // return;
                try {
                    setLoading(true)
                    const {data} = await axios.post('/api/reset-password',{
                        email, 
                        code, 
                        newPassword,    
                    })
                    setEmail('')
                    setCode('')
                    setNewPassword('')
                    setLoading(false);
                    toast.success('Great! Now you can log with the new password')
                    router.push("/login"); 
                } catch (err) {
                    setLoading(false)
                    toast.info(err.response.data) 
                }
                  
        };

    
    return (
        <>
            <h1 className='bg-light p-5 rounded-lg m-3 text-center bg-primary square'>
            Forgot password
            </h1>

            <div className='container col-md-4 offset-md-4 pb-5'>
                    <form onSubmit={success ? handleResetPassword : handleSubmit}>
                        <input 
                            type='email' 
                            className='form-control mb-4 p-4' 
                            value={email}
                            onChange={e =>setEmail(e.target.value)} 
                            placeholder='enter email'
                            required
                        />
                        {success && (
                            <>

                            <input 
                            type='text' 
                            className='form-control mb-4 p-4' 
                            value={code}
                            onChange={e =>setCode(e.target.value)} 
                            placeholder='enter code'
                            required
                        />    

                       <input 
                            type='password' 
                            className='form-control mb-4 p-4' 
                            value={newPassword}
                            onChange={e =>setNewPassword(e.target.value)} 
                            placeholder='enter new password'
                            required
                        />



                        </>
                        )}
                       
                        <button type='submit' 
                                className='btn btn-block btn-primary w-100' 
                                disabled={loading || !email}>
                                {loading ? <SyncOutlined spin/> : "Submit"}
                        </button>
                        
                    </form>

            </div>

        </>
    )
};



export default ForgotPassword