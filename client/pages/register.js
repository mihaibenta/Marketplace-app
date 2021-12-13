import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {Context} from '../context';
import {toast} from 'react-toastify';
import { SyncOutlined, UserSwitchOutlined, UserAddOutlined} from '@ant-design/icons';
import Link from 'next/link'
import router from 'next/router';
const Register = () => {
    const [name,setName] =useState('');
    const [email,setEmail] =useState('');
    const [password,setPassword] =useState('');
    const [loading, setLoading] = useState(false)
    
    const {state,dispatch}=useContext(Context)
    const {user} = state

    useEffect(()=>
    {
        if(user != null) router.push('/')
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/register` , {
            name,
            email,
            password,
        });
        // console.log('REGISTER RESPONSE', data);
        toast.success('Registration succesful.Please login.');
        setName('');
        setEmail('');
        setPassword('');
        setLoading(false);
        router.push('/login')
        } catch (err) {
            toast.error(err.response.data);
            setLoading(false)
        }
        
    };
    return (
        <>
            <h1 className="bg-light p-5 rounded-lg m-3 text-center bg-primary square">Register</h1>
            
            <div className="container col-md-4 offset-md-4 pb-5 text-center">
                <UserAddOutlined className='display-1 pb-3 pt-4'/>
                <form onSubmit={handleSubmit}>
                    <input 
                    type ="text"
                    className="form-control mb-4 p-4" 
                    value={name} 
                    onChange={(e)=> setName(e.target.value)}
                    placeholder="Enter name"
                    required
                    />
                    <input 
                    type ="email"
                    className="form-control mb-4 p-4" 
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    />
                    <input 
                    type ="password"
                    className="form-control mb-4 p-4" 
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    />
                    <div className='password-requiremests d-flex text-start'>
                    <ul className='password-requiremests'> 
                        <li>One uppercase/lowercase letter</li>
                        <li>Must be at least 6 characters log</li>
                        
                    </ul>
                    <ul className='password-requiremests'> 
                       
                        <li>One special character</li>
                        
                        <li>One number</li>
                    </ul>
                    </div>
                    
                    <button type='submit' className='btn btn-block btn-primary w-100'
                    disabled={!name || !email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                        
                    </button>
                </form>

                <p className="text-center p-3">
                    Already registered?{' '}
                    <Link href='/login'>
                        <a>Login</a>
                    </Link>
                </p>

            </div>

        </>
    )
}
export default Register;