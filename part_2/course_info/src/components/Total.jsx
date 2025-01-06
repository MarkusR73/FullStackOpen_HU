const Total = ({parts}) => {
    const total = parts.reduce((sum, part) => {
        console.log('What is happening', sum, part)
        return sum + part.exercises
    }, 0)
    return(
        <strong>Total of {total} exercises</strong>
    )
}

export default Total