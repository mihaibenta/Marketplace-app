import {useEffect, useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import { SyncOutlined } from '@ant-design/icons'
import UserNav from '../nav/UserNav'
const UserRoute = ({children, showNav= true}) => {

    // state
    const [ok,setOk] = useState(false);
    
    // router

    const router = useRouter();
    
    
    useEffect(()=>{
        
        fetchUser();
    },[]);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/current-user')
            console.log(data)
           if(data.ok) setOk(true);
           
        } catch (err) {
            console.log(err);
            setOk(false);
            router.push('/login')
        }
        
    };
    
   
    return (
        
        <>
        {!ok ?  <div className='spin'>
        <SyncOutlined spin className='d-inline-block justify-content-center display-1 text-danger p-5 overflow-hidden ml-50% mr-50%'/>
        </div> : <> 
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    {showNav &&<UserNav />}
                    </div>
                    <div className='col-md-10'>
                        {children}
                    </div>

                

            </div>
        </div>
       
        </> } 
            
        </>
    )
}

export default UserRoute;