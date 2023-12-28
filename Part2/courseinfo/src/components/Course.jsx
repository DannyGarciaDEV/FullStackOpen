import React from 'react'

const Header = ({ name }) => {
    return(
        <h2>
            { name }
        </h2>
    )
}

const Content = ({ parts }) => {
    const partElements = parts.map(e =>
        <Part
            key={ e.id }
            part = { e }
        />
    );

    return(
        <p>
            { partElements }
            </p>
    )
}

const Part = ({ part }) => {
    return(
        <p>
            { part.name } { part.exercises }
        </p>
    )
}

const Total = ({ parts }) => {
    const total =  parts.reduce((a, b) => {
        return { exercises: a.exercises + b.exercises }
    });

    return(
        <strong> 
            total of  { total.exercises } exercises
            </strong>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header
                name = { course.name }
            />
            <Content
                parts = { course.parts }
            />
            <Total
                parts = { course.parts }
            />
        </div>
    )
}

export default Course