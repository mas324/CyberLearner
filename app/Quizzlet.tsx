import React from "react";

/**
 * Cards will be a simple 1 question 4 answer multiple choice
 * Storage should be on a remote location, possibly Firebase.
 */

type Problem = {
    question : string;
    selection_one: string;
    selection_two: string;
    selection_three: string;
    selection_four: string;
    correct: number;
}

function Card() {
    return (
        <div>
            <p>
                Card test
            </p>
        </div>
    )
}

/**
 * Quiz section. Should contain all possible QA problems that
 * pertain to each vulnerability. Calculated using machine learning
 * grammar.
 */

const Quizzer = () => {
    return (
        <div>
            <h1>Page containing different quizzes</h1>
            <p>
                Research more on how they were to adapt that
                Java program to create a QA section from a given input.
            </p>
            <Card />
        </div>
    );
}

export default Quizzer;
