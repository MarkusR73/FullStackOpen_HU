const FilterError = ({message}) => {
    if (message === null) {
        return null
    }
    return (
        <div className='tooMany'>
            {message}
        </div>
    )
}

export default FilterError