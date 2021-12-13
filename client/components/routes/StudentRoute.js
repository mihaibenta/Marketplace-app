import {useEffect, useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import { SyncOutlined } from '@ant-design/icons'

const StudentRoute = ({children, showNav= true}) => {

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
            {children}
        </div>
       
        </> } 
            
        </>
    )
}

export default StudentRoute;