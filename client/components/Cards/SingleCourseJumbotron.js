import SingleCourse from "../../pages/course/[slug]"
import { currencyFormatter } from "../../utils/helpers"
import { Badge, Modal, Button} from 'antd'
import ReactPlayer from "react-player"
import ReactMarkdown from 'react-markdown'
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons"


const SingleCourseJumbotron = ({
    course,
    showModal, 
    setShowModal, 
    setPreview,
    preview, 
    loading, 
    user, 
    handlePaidEnrollment, 
    handleFreeEnrollment,
    enrolled,
    setEnrolled,
}) => {
    
    const {name, description, instructor, updatedAt, lessons, image, price, paid, category} = course

    
    return (
        
        <div className='bg-light p-5 rounded-lg m-3 bg-primary square'>
            {/* <pre> {JSON.stringify(course, null, 4)}</pre> */}
            <div className='row d-flex align-items-center'>
                
                    <div className='col-md-8'>
                        
                        <h1 className='text-dark font-weight-bold'>{name}</h1>
                        
                        <div className='col'> 
                        <ReactMarkdown children={`${description && description.substring(0,150)}...`} />
                        </div>

                        <Badge count={category} style={{backgroundColor:'#03a9f4'}} className='pb-4 mr-2'/>
                        <p>Created by {instructor.name}</p>
                        <p>Last updated on: <span className='font-weight-bold'>{new Date(updatedAt).toLocaleDateString('RO')}</span></p>
                        <h4 className='text-dark'> {
                            paid ? currencyFormatter({
                                amount:price,
                                currency: 'usd'
                            }) : 'Free' }
                        </h4>
                        
                    </div>
                    <div className='col-md-4'>
                
                        {lessons[0].video && lessons[0].video.Location ? 
                        <div onClick={()=>{
                            setPreview(lessons[0].video.Location)
                            setShowModal(!showModal)
                        }}>  
                            <ReactPlayer 
                            className='react-player-div' 
                            url={lessons[0].video.Location}
                            light={course.image ? course.image.Location : '/course.png'}
                            src={course.image ? course.image.Location : '/course.png'}
                            width='100%'
                            height='225px'
                            />
                        </div> :(
                            <img 
                            src={course.image ? course.image.Location : '/course.png'} 
                            alt={name} 
                            className='img img-fluid'/>
                        )}
                        
                        {loading ? (
                            <div className='d-flex justify-content-center'>
                                <LoadingOutlined className='h1 text-danger'/>
                                 </div>
                        ): (
                        <Button className='mb-3 mt-3' 
                                type='danger'
                                shape='round'
                                icon={<SafetyOutlined/>}
                                size='large'
                                disabled={loading}
                                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                            >
                            {user ? enrolled.status 
                                    ? 'Go to course' 
                                    : 'Enroll'
                                    : 'Login to enroll'}
                        </Button> 
                        )}
                    </div>
                </div>
                
            
        </div>

    
    )
}

export default SingleCourseJumbotron