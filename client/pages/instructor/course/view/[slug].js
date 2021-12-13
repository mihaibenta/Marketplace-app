import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import axios from 'axios'
import {Avatar, Tooltip, Button, Modal, List} from 'antd'
import {EditOutlined, CheckOutlined, UploadOutlined,UserSwitchOutlined, QuestionCircleFilled,QuestionCircleOutlined, CloseOutlined,} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import AddLessonForm from '../../../../components/forms/AddLessonForm'
import { toast } from 'react-toastify'
import Item from 'antd/lib/list/Item'

const CourseView = () => {
    const [course, setCourse] = useState({})
    const [visible,setVisible] = useState(false)
    const [values, setValues] = useState({
        title: '',
        content:'',
        video:{},
    })
    const [uploading, setUploading] =useState(false)
    const [uploadButtonText, setUploadButtonText] = useState('Upload video');
    const [progress, setProgress] = useState(0)

    // student count
    const [students, setStudents] = useState(0)
    

    const router = useRouter()
    const {slug} = router.query;

    //router 

    
    useEffect(() => {
        loadCourse()        
    }, [slug]);

    useEffect(()=>{
        course && studentCount()
    },[course])

    const loadCourse = async () => {
        const {data} =await axios.get(`/api/course/${slug}`)
        setCourse(data);
    }

    const studentCount = async () => {
        const  {data} = await axios.post(`/api/instructor/student-count`,{
            courseId: course._id
        });
        console.log('SUTDENT COUNT =>', data )
        setStudents(data.length)
    }

    // FUNCTIONS FOR ADD LESSON
    const handleAddLesson = async (e) => {
        e.preventDefault()
        try {
            // console.log(values);
            const {data} = await axios.post(
                `/api/course/lesson/${slug}/${course.instructor._id}`,
            values
            );
            // console.log(data)
            setValues({...values, title: '', content:'', video: {}});
            setProgress(0)
            setUploadButtonText('Upload video')
            setVisible(false)
            setCourse(data);
            toast.success('Lesson added')
        } catch (err) {
            console.log(err)
            toast('Lesson add failed')
        }
    }

    const handleVideo = async (e) => {
        console.log(course);
       
      try { const file = e.target.files[0] //grab first file(video)
        setUploadButtonText(file.name)
        setUploading(true);
        
        const videoData = new FormData();
        videoData.append('video', file);

        const {data} = await axios.post(
            `/api/course/video-upload/${course.instructor._id}`, 
            videoData, {
            onUploadProgress: (e) => {
                setProgress(Math.round((100 * e.loaded)/ e.total));
            }
        })
        console.log(data);
        setValues({ ...values, video: data});
        setUploading(false);
        } catch (err) {
            console.log(err);
            setUploading(false);
            toast('video upload failed')
        }

    }

    const handleVideoRemove = async () => {
        try {
            setUploading(true);
            const {data} = await axios.post(
                `/api/course/video-remove/${course.instructor._id}`, 
                values.video
                );
                console.log(data)
                setValues({...values, video: {}  });
                setUploadButtonText('Upload another video')
                setUploading(false)
        } catch (err) {
            console.log(err);
            setUploading(false);
            toast('video remove failed')
        }

    }

    const handlePublish = async (e, courseId) => {
      try {
        let answer = window.confirm('Once your publish your course, it will be live in the marketplace for users to enroll') //
        if (!answer)  return
        const {data} = await axios.put(`/api/course/publish/${courseId}`)
        setCourse(data)
        toast.success('Congrats! your course is now live') 
      } catch (err) {
        console.log(err)
        toast('Course publish failed. Try again')
      }
    }

    const handleUnpublish =  async (e,courseId) =>{
      try {
        let  answer = window.confirm('Once you unpublish your course, it will not be availabele for users to enroll')
        if (!answer)  return
        const {data} = await axios.put(`/api/course/unpublish/${courseId}`)
        setCourse(data)
        toast.warning('Your course is now unpublished')
        
      } catch (err) {
        toast('Course publish failed. Try again')
          
      }
    }





    
    const handleDeleteCourse =  async (e,courseId) =>{
        try {
          let  answer = window.confirm('This process is irreversible! Once you delete the course you will not be able to revert your decision')
          if (!answer)  return
          const {data} = await axios.delete(`/api/course/${courseId}`)
          
          toast.success('Your course is now deleted')
          router.push("/instructor");
        } catch (err) {
          toast('Course publish deleted. Try again')
            
        }
      }

      

    return (
        <InstructorRoute>
            
            <div className='container-fluid pt-3'>
                {course && <div className='container-fluid pt-1'> 
                <div className='media pt-2'> 
                    <Avatar  size={80} 
                    src={course.image ? course.image.Location : '/course.png'}/>
                    <div className='media-body pl-2'>
                        <div className='col'>
                                <h5 className='mt-2 text-primary'>{course.name}</h5>
                                <p style={{marginTop:'-10px'}}>
                                    {course.lessons && course.lessons.lenght} Lessons
                                    </p>
                                    <p style={{marginTop:'-15px', fontSize: '10px'}}>{course.category}
                                    </p>
                              </div>
                         </div>
                
                </div>
               
                <div className='d-flex'> 
                    <Tooltip title={`${students} enrolled`}>
                    <UserSwitchOutlined onClick={()=> router.push(`/instructor/course/edit/${slug}`)} className='h5 pointer text-info mr-4'/>
                    </Tooltip>
                    

                    <Tooltip title='Edit'>
                    <EditOutlined onClick={()=> router.push(`/instructor/course/edit/${slug}`)} className='h5 pointer text-warning mr-4'/>
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? ( 
                    
                        <Tooltip title='Min 5 lessons required to publish'> 
                            <QuestionCircleOutlined className='h5 pointer text-danger'/>
                        </Tooltip> 
                        
                    ) : course.published ?  ( <Tooltip title='Unpublish Course'>
                        <CloseOutlined 
                        onClick = {(e) => handleUnpublish(e, course._id)}
                        className='h5 pointer text-danger'/> 
                        </Tooltip>
                    ) : ( 
                        <Tooltip title='Publish Course'>
                        <CheckOutlined 
                        onClick = {(e) => handlePublish(e, course._id)} 
                         className='h5 pointer text-success'/> 
                        </Tooltip>

                        
                    )}
                    
                    
                
                </div>
                    <div className='row'>
                        <div className='col'> 
                        <ReactMarkdown children={course.description} />
                        </div>
                    </div>
                    <div className='row'> 
                    
                        <Button 
                        onClick ={()=>setVisible(true)}
                        className='col-md-6 offset-md-3 text-center'
                        type='primary'
                        shape='round'
                        icon={<UploadOutlined/>}
                        size='large'

                        >
                            Add Lesson
                        </Button>
                    </div>
                    <Modal title='+ Add Lesson' 
                    centered
                    visible={visible}
                    onCancel={()=> setVisible(false)}
                    footer={null}
                    >
                        <AddLessonForm 
                        values={values} 
                        setValues={setValues} 
                        handleAddLesson={handleAddLesson} 
                        uploading={uploading}
                        uploadButtonText={uploadButtonText}
                        handleVideo={handleVideo}
                        progress={progress}
                        handleVideoRemove={handleVideoRemove}
                        
                        
                        />
                    
                    
                    </Modal>

                    <div className='row pb-5'>  
                            <div className='col lesson-list'> 
                            
                            <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                            <List itemLayout='horizontal' dataSource={course && course.lessons} 
                            renderItem={(item,index) =>   
                                <Item>
                                    <Item.Meta avatar={<Avatar>{index + 1}</Avatar>}
                                    title={item.title}
                                    ></Item.Meta>
                                </Item>
                            
                            } ></List>
                            
                            </div>
                    
                    </div>
                    <Button
                        type='danger'
                        onClick = {(e) => handleDeleteCourse(e, course._id)}
                        className='h5 pointer'>
                            Delete Course 
                        </Button> 
                </div>
                }
                
            </div>
            

        </InstructorRoute>
    )

}

export default CourseView