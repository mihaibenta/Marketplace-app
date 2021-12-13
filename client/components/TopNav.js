import {useState, useEffect, useContext} from 'react';
import {Menu} from 'antd';
import Link from 'next/link';
import {AppstoreOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, CarryOutOutlined,TeamOutlined, DashboardOutlined,} from '@ant-design/icons';
import {Avatar} from 'antd';
import {Context} from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useRouter} from 'next/router';


const {Item,SubMenu, ItemGroup} = Menu; // Menu.Item


const TopNav = () => {
    const [current, setCurrent] =useState('');
    
    const {state, dispatch} =useContext(Context);
    const { user } = state;

    const router = useRouter();

    useEffect(()=> {
        process.browser && setCurrent(window.location.pathname)
    },[process.browser && window.location.pathname])

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem('user');
        const {data} = await axios.get('/api/logout');
        router.push('/');
        toast.success(data.message);

    }

    
    return (
        <Menu theme='dark' mode="horizontal" selectedKeys ={[current]} className='active-classname mb-2'>
            <Item key='/' 
            onClick={e => setCurrent(e.key)}
            icon={<AppstoreOutlined style={{ fontSize: '125%'}}/>}>
                <Link href="/" >
                    <a className="typewritter">App</a>
                </Link>
            </Item>

           

               

            {user === null && (
                <>
                <Item key='/login' 
            onClick={e => setCurrent(e.key)}
            icon={<LoginOutlined style={{ fontSize: '125%'}}/>}>
                <Link href="/login">
                    <a className="typewritter">Login</a>
      
                </Link>

            </Item>

            <Item key='/register' 
            onClick={e => setCurrent(e.key)}
            icon={<UserAddOutlined style={{ fontSize: '125%'}}/>}>
                <Link href="/register">
                    <a className="typewritter">Register</a>
                </Link>
            </Item>
                </>
            )}
            
            
          
                 {user && user.role && user.role.includes('Instructor') ? (
                  <Item key='/instructor' 
                  onClick={e => setCurrent(e.key)}
                  icon={<DashboardOutlined style={{ fontSize: '125%'}}/>}>
                      <Link href="/instructor">
                          <a className="typewritter">Instructor</a>
            
                      </Link>
                  </Item>
            ): (
                <Item key='/user/become-instructor' 
                onClick={e => setCurrent(e.key)}
                icon={<TeamOutlined style={{ fontSize: '125%'}}/>}>
                    <Link href="/user/become-instructor">
                        <a className="typewritter">Become instructor</a>
          
                    </Link>
                </Item>
            )}
            {user !== null && (
                
               <SubMenu icon={<Avatar size='medium' style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{user.name.charAt(0)}</Avatar>} title={user && user.name} 
                              
                        key='submenu'
                        className='justify-content-end ms-auto' >
                        <ItemGroup>
                        <Item key="/user"> 
                        <Link href ='/user'>
                            <a>Dashboard</a>
                        </Link>

                        </Item>
                        
                        <Item key='/Logout' 
                        onClick={logout}
                        icon={<LogoutOutlined/>} 
                        className='justify-content-end ms-auto'>
                        Logout
                        </Item>
                        </ItemGroup>
                        
               </SubMenu>
            )}
            
                

        </Menu>
    );
};

export default TopNav;