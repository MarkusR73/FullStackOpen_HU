import { Header_2 } from "./Header"
import { Content, Total } from "./Subcomponents"

const Course = ({course}) => {
    console.log(course)
    return(
        <div>
            <Header_2 course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
        </div>
    )
}

export default Course