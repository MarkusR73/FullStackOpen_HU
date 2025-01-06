const Header_1 = ({text}) => {
    console.log(text)
    return(
        <h1>{text}</h1>
    )
}

const Header_2 = ({ course }) => {
    console.log(course)
    return(
        <h2>{course}</h2>
    )
}

export {Header_1, Header_2}