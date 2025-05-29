import React from "react";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
};

interface CoursePartDescription extends CoursePartBase {
  description: string;
};

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

type HeaderProps = {
  name: string;
};

const Header: React.FC<HeaderProps> = ({ name }) => (
  <h1>{name}</h1>
);

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div style={{ marginBottom: "1em" }}>
          <span>
            <b>{part.name} {part.exerciseCount}</b>
          </span>
          <br />
          <span>
            <i>{part.description}</i>
          </span>
        </div>
      );
    case "group":
      return (
        <div style={{ marginBottom: "1em" }}>
          <span>
            <b>{part.name} {part.exerciseCount}</b>
          </span>
          <br />
          <span>
            Group project count: {part.groupProjectCount}
          </span>
        </div>
      );
    case "background":
      return (
        <div style={{ marginBottom: "1em" }}>
          <span>
            <b>{part.name} {part.exerciseCount}</b>
          </span>
          <br />
          <span>
            <i>{part.description}</i>
          </span>
          <br />
          <span>
            Background material: {part.backgroundMaterial}
          </span>
        </div>
      );
    case "special":
      return (
        <div style={{ marginBottom: "1em" }}>
          <span>
            <b>{part.name} {part.exerciseCount}</b>
          </span>
          <br />
          <span>
            <i>{part.description}</i>
          </span>
          <br />
          <span>
            Required skills: {part.requirements.join(", ")}
          </span>
        </div>
      );
    // Exhaustive check for unhandled cases
    default:
      return assertNever(part);
  }
}

// Helper function for exhaustive type checking
function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

type ContentProps = {
  parts: CoursePart[];
};

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((part, index) => (
      <Part key={index} part={part} />
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
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
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