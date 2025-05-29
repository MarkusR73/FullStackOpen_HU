import React from "react";

type CoursePart = {
  name: string;
  exerciseCount: number;
};

type HeaderProps = {
  name: string;
};

const Header: React.FC<HeaderProps> = ({ name }) => (
  <h1>{name}</h1>
);

type ContentProps = {
  parts: CoursePart[];
};

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((part, index) => (
      <p key={index}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </div>
);
 type TotalProps = {
  total: number;
};
const Total: React.FC<TotalProps> = ({ total }) => (
  <p>
    Number of exercises {total}
  </p>
);


const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;