import {Card, Badge} from 'antd'
import Link from 'next/link'
import { currencyFormatter } from '../../utils/helpers'
const {Meta} = Card

const CourseCard = ({course}) => {

    const {name, instructor, price, image, slug, paid, category} = course;
    return (
        <Link href={`/course/${slug}`}>
              <a>
                    <Card
                        className='div'
                        cover={
                            <img
                            src={course.image ? course.image.Location : '/course.png'} 
                            alt={name} 
                            style={{height:'300px', objectFit:'cover',}}
                            className='p-1'
                            />
                        }
                    >
                        
                        <h2 
                        className='font-weight-bold'>
                        {name}</h2>
                        <p>by {instructor.name}</p>
                        <Badge count={category} style={{backgroundColor: '#03a9f4'}} 
                        className='pb-2 mr-2'
                        />
                        <h4 className='pt-2'>{paid ? currencyFormatter({
                            amount: price,
                            currency: 'usd',
                        }) : 'Free'}</h4>
                        
                    </Card>
            </a>  
        
        </Link>

    )

} 

export default CourseCard