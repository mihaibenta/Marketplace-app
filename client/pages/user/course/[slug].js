import {useEffect, useState, createElement} from 'react';
import { useRouter } from "next/router"
import axios from 'axios'
import StudentRoute from '../../../components/routes/StudentRoute'
import {Button, Menu, Avatar} from 'antd'
import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import {PlayCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined, CheckCircleFilled, MinusCircleFilled} from '@ant-design/icons'


const SingleCourse = () => {
const [loading, setLoading] = useState(false)
const [course, setCourse] = useState( {lessons:[]}); // course.lessons
const [clicked, setClicked] = useState(-1)
const [collapsed, setCollapsed] = useState(false)
const [completedLessons, setCompletedLessons] = useState([])
// force state update
const [updateState, setUpdateState] = useState(false)

// router 
const router = useRouter()
const {slug} = router.query

const {Item} = Menu
useEffect(()=> {
    if (slug) loadCourse()
},[slug])

useEffect(()=> {
    if(course) loadCompletedLessons()
},[course])

const loadCourse = async () => {
    const {data} = await axios.get(`/api/user/course/${slug}`)
    setCourse(data)
}

const loadCompletedLessons = async () => {
    const {data} = await axios.post(`/api/list-completed` , {courseId: course._id})
    console.log('COMPLETED LESSONS =>' , data);
    setCompletedLessons(data)
}

const markCompleted =  async () => {
    const {data} = await axios.post(`/api/mark-completed`, {
        courseId:course._id, 
        lessonId:course.lessons[clicked]._id
    })
    setCompletedLessons([...completedLessons,course.lessons[clicked]._id] )
    console.log(data)
}


const markIncompleted = async () => {
    try {
        const {data} = await axios.post(`/api/mark-incomplete`, {
            courseId:course._id, lessonId:course.lessons[clicked]._id  
        });
        console.log(data)
        const all = completedLessons;
        const index = all.indexOf(course.lessons[clicked]._id) 
        if(index > -1) {
            all.splice(index, 1)
            setCompletedLessons(all)
            setUpdateState(!updateState)
        }
    } catch (err) {
        console.log(err) 
    }   
}
    
    return (
        <StudentRoute>
            <div className='row'>
                <div style={{maxWidth: 480}}> 
                    <Button onClick={()=>setCollapsed(!collapsed)} className='text-primary mt-1 btn-block mb-2'> 
                    {createElement(collapsed ? MenuUnfoldOutlined: MenuFoldOutlined)} 
                    {!collapsed && 'Lessons'}
                    
                    </Button>
                    <Menu
                    mode="inline"
                    defaultSelectedKeys={[clicked]}
                    inlineCollapsed={collapsed} 
                    
                    style={{height: '80vh', overflow:'inherit'}}
                    >
                        {course.lessons.map((lesson, index)=>(
                        <Item onClick={()=> setClicked(index)} key={index} 
                        icon={<Avatar>{index + 1}</Avatar>

                        }>{lesson.title.substring(0, 30)}
                        {completedLessons.includes(lesson._id) ? (
                        <CheckCircleFilled className='float-right text-primary' 
                        style={{marginTop:'5px', marginLeft:'5px'}}
                        />
                        ) : (
                        <MinusCircleFilled className='float-right text-danger' 
                        style={{marginTop:'5px', marginLeft:'5px'}}
                        />
                        )}
                        
                        </Item>
                        ))}
                       
                    </Menu>
                
                </div>

                <div className='col'>  
                        {clicked !== -1 ? (
                        <>

                        <div className='col alert alert-primary square'>
                            <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                            {completedLessons.includes(course.lessons[clicked]._id) ? 
                            <span className='float-right pointer' onClick={markIncompleted}>
                            Mark as incompleted</span> :
                            <span className='float-right pointer' onClick={markCompleted}>
                            Mark as completed
                            </span> 
                            } 
                        </div>

                        {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                            <>
                            <div className='wrapper'>
                                <ReactPlayer 
                                className='player' 
                                url={course.lessons[clicked].video.Location} 
                                width='100%' 
                                height='100%' 
                                controls 
                                onEnded={()=> markCompleted()}
                                />
                              </div>
                             
                             </>
                        )}
                            <ReactMarkdown children={course.lessons[clicked].content} 
                              className='single-post'/>
                        </>
                        ): 
                        (<div className='d-flex justify-content-center p-5'>  
                            <div className='text-center p-5'>  
                            <PlayCircleOutlined className='text-primary display-1 p-5'/>
                            <p className='lead'> Click on the lesson to start learning</p>
                            </div>
                        </div>
                        )}
                 </div>
            </div>
        </StudentRoute>
    )
}

export default SingleCourse