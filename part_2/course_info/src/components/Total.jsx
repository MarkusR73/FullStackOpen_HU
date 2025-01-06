const Total = ({parts}) => {
    const sum = parts.reduce((total, part) => total + part.exercises, 0)
    console.log(parts, sum)
    return(
        <strong>Total of {sum} exercises</strong>
    )
}

export default Total