const Person = ({person}) => {
    return (
      <p>{person.name} {person.number}</p>
    )
  }

const Persons = ({persons}) => {
  return(
    <p>{persons.map(person => 
      <Person key={person.name} person={person}/>
    )}</p>
  )
}
  
export default Persons