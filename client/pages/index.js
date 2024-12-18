import {useState, useEffect} from 'react';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';


const Index = ({courses}) => {
    // const [courses, setCourses] = useState([])

    // useEffect(()=>{
    //     const fetchCourses = async () => {
    //         const {data} = await axios.get('/api/courses')
    //         setCourses(data)
    //     };
    //     fetchCourses();
    // },[])
   

    return (
        <>
            <h1 className="bg-light p-5 rounded-lg m-3 text-center bg-primary square">Online Education Market</h1>
            <div className='cotainer-fluid overflow-hidden'>
                    <div className='row'>
                        {courses.map((course) => ( 
                        <div key={course._id} className='col-md-4 p-5'>
                        <CourseCard course={course}/>
                        
                        </div>
                        ))}

                    </div>

            </div>

        </>
    );
};

export async function getServerSideProps() {
    const {data} = await axios.get(`${process.env.API}/courses`);
    return {
        props:{
            courses:data,
        }
    }
}

export default Index;