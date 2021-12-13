import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { SyncOutlined, LoginOutlined} from '@ant-design/icons';
import Link from 'next/link'
import {Context} from '../context';
import {useRouter} from 'next/router'

const Login = () => {
    const [email,setEmail] =useState('');
    const [password,setPassword] =useState('');
    const [loading, setLoading] = useState(false)


    // state 

    const{state, dispatch} = useContext(Context);
    const {user} = state


    // router
    const router = useRouter()
    // console.log('STATE', state)

    useEffect(()=>{
        if(user != null) router.push('/')
    },[user])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/login` , {
            email,
            password,
            
            
        });
        console.log('LOGIN RESPONSE', data);
        
        dispatch({
            type: "LOGIN",
            payload:data,
        })
        // setLoading(false);

        //save in local storage
        window.localStorage.setItem('user', JSON.stringify(data));
        const {name} = data
        router.push("/user");
        toast(`Successfully logged in. Welcome ${name}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'bg-light p-5 rounded-lg m-3 text-center bg-primary square'
            
          });
        


        // redirect
        
        
        

        } catch (err) {
            toast.error(err.response.data);
            setLoading(false)
        }
    };
    return (
        <>
            <h1 className="bg-light p-5 rounded-lg m-3 text-center bg-primary square">Login</h1>
            
            <div className="container col-md-4 offset-md-4 pb-5 text-center">
                <LoginOutlined className='display-1 pb-3 pt-4'/>
                <form onSubmit={handleSubmit}>
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

                    
                    <button type='submit' className='btn btn-block btn-primary w-100'
                    disabled={!email || !password || loading}
                    >
                        {loading ? <SyncOutlined spin /> : "Submit"}
                        
                    </button>
                </form>

                <p className="text-center pt-3">
                    Not yet registed?{' '}
                    <Link href='/register'>
                        <a>Register</a>
                    </Link>
                </p>

                <p className="text-center"> 
                    
                    <Link href='/forgot-password'>
                        <a className='text-danger'>Forgot password</a>
                    </Link>
                </p>

            </div>


        </>
    )
}
export default Login;