import {useContext,useEffect} from 'react' 
import {Context} from '../../context'
import { SyncOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useRouter } from 'next/router'
const StripeCallback = () => {
    const {state: {user}, dispatch, } = useContext(Context);

// router
const router = useRouter()
// console.log('STATE', state)

    useEffect(()=>{
        if(user === null) router.push('/')
    },[user])  

    useEffect(()=>{
        if(user) {
            axios.post('/api/get-account-status').then ((res) => {
                
                // console.log(res);
                dispatch({
                    type:'LOGIN',
                    payload: res.data,
                });
                window.localStorage.setItem('user', JSON.stringify(res.data))
                window.location.href = '/instructor' ;
            });
        }
    },[user]);

    return (
        <div className='spin'>
        <SyncOutlined spin className='d-inline-block justify-content-center display-1 text-danger p-5 overflow-hidden ml-50% mr-50%'/>
        </div>
    )
}

export default StripeCallback;