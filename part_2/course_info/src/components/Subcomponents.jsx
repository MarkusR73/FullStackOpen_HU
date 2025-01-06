const Content = ({parts}) => {
    console.log(parts)
    return(
        <div>
            {parts.map(part => <Part key={part.id} part={part} />)}     
        </div>
    )
}

const Part = ({part}) => {
    console.log(part)
    return(
        <p>{part.name} {part.exercises}</p>
    )
}

const Total = ({parts}) => {
    const total = parts.reduce((sum, part) => {
        console.log('What is happening', sum, part)
        return sum + part.exercises
    }, 0)
    return(
        <strong>Total of {total} exercises</strong>
    )
}

export {Content, Total}