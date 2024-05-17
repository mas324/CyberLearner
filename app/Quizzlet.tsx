import { addQAS, getQuestions } from "@/utils/Firestore";
import { getItem, setItem } from "@/utils/LocalStore";
import { Question } from "@/utils/Types";
import { updateNIST } from "@/utils/Vuln";
import { createQuestion } from "@/utils/textAI";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Cards will be a simple 1 question 4 answer multiple choice
 * Storage should be on a remote location, possibly Firebase.
 */

type Problem = {
    question: string;
    selection_one: string;
    selection_two: string;
    selection_three: string;
    selection_four: string;
    correct: number;
};

/**
 * Quiz section. Should contain all possible QA problems that
 * pertain to each vulnerability. Calculated using machine learning
 * grammar.
 */

const Quizzer = () => {
    const [correct, setCorrect] = React.useState(0);
    const [exam, setExam] = React.useState(Array<Question>());
    const [start, setStart] = useState(false);

    React.useEffect(() => {
        // updateNIST().then((value) => {
        //     value.forEach((item) => {
        //         createQuestion(item.cve.descriptions[0].value).then((quiz) => {
        //             if (quiz === null) {
        //                 return;
        //             }
        //             const parse: Question = {
        //                 question: quiz.question,
        //                 correctAnswer: quiz.answers,
        //                 wrongAnswer: quiz.false_answers,
        //             };
        //             addQAS(parse);
        //             const temp = exam.slice();
        //             temp.push(parse);
        //             setExam(temp);
        //             setItem('exam', temp);
        //         });
        //     });
        // });

        getItem("exam").then((item) => {
            if (item === null) {
                getQuestions().then((value) => {
                    if (value === null) {
                        return;
                    }
                    setExam(value);
                    setItem("exam", value);
                });
            } else {
                setExam(item);
            }
        });
    }, []);

    const [oncer, setOncer] = useState(true);
    const [display, assemble] = React.useState<Problem>({
        correct: 0,
        question: "",
        selection_one: "",
        selection_two: "",
        selection_three: "",
        selection_four: "",
    });
    const [wait, setWait] = useState(false);

    function update() {
        const random = Math.floor(Math.random() * exam.length);
        const selection = exam[random];

        const answer = selection.correctAnswer[Math.floor(Math.random() * 2)];
        const randAnswers = [answer];

        for (let i = 0; i < 3; i++) {
            const index = Math.floor(
                Math.random() * selection.wrongAnswer.length
            );
            randAnswers.push(selection.wrongAnswer[index]);
            selection.wrongAnswer.splice(index, 1);
        }

        for (let cIndex = randAnswers.length; cIndex != 0; ) {
            const rIndex = Math.floor(Math.random() * cIndex);
            cIndex--;
            [randAnswers[cIndex], randAnswers[rIndex]] = [
                randAnswers[rIndex],
                randAnswers[cIndex],
            ];
        }

        assemble({
            question: selection.question,
            selection_one: randAnswers[0],
            selection_two: randAnswers[1],
            selection_three: randAnswers[2],
            selection_four: randAnswers[3],
            correct: randAnswers.indexOf(answer),
        });
        setWait(false);
        setMarker([
            [style.container, style.select],
            [style.container, style.select],
            [style.container, style.select],
            [style.container, style.select],
        ]);
    }

    const style = StyleSheet.create({
        container: {
            alignSelf: "center",
            paddingVertical: 4,
            paddingHorizontal: 8,
            margin: 4,
        },
        wrong: {
            backgroundColor: "#C40C0C60",
        },
        correct: {
            backgroundColor: "#7ABA78",
        },
        select: {
            backgroundColor: "#756AB6A0",
        },
        text: {
            fontSize: 18,
        },
    });

    const [marker, setMarker] = useState([
        [style.container, style.select],
        [style.container, style.select],
        [style.container, style.select],
        [style.container, style.select],
    ]);

    function Card() {
        function checkAnswer(select: number) {
            if (wait) {
                return;
            }
            if (select === display.correct) {
                setCorrect(correct + 1);
            }
            const toSet = marker.slice();
            for (let i = 0; i < marker.length; i++) {
                if (i === display.correct) {
                    toSet[i][1] = style.correct;
                } else {
                    toSet[i][1] = style.wrong;
                }
            }
            setMarker(toSet);
            setWait(true);
        }

        return (
            <View
                style={{
                    flex: 6,
                }}
            >
                <Text
                    style={{
                        fontSize: 26,
                        alignSelf: "center",
                        backgroundColor: "transparent",
                    }}
                >
                    {display.question}
                </Text>
                <Pressable
                    style={marker[0]}
                    onPress={() => checkAnswer(0)}
                >
                    <Text style={style.text}>{display.selection_one}</Text>
                </Pressable>
                <Pressable
                    style={marker[1]}
                    onPress={() => checkAnswer(1)}
                >
                    <Text style={style.text}>{display.selection_two}</Text>
                </Pressable>
                <Pressable
                    style={marker[2]}
                    onPress={() => checkAnswer(2)}
                >
                    <Text style={style.text}>{display.selection_three}</Text>
                </Pressable>
                <Pressable
                    style={marker[3]}
                    onPress={() => checkAnswer(3)}
                >
                    <Text style={style.text}>{display.selection_four}</Text>
                </Pressable>
                <Pressable
                    style={{ alignSelf: "flex-end", marginRight: "25%" }}
                    onPress={() => update()}
                >
                    <Text>Next</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#00000020" }}>
            <Text style={{ fontWeight: "bold", fontSize: 26, flex: 1 }}>
                Welcome to the quiz page, where you can test your knowlege in
                multiple vulnerabilities
            </Text>
            <Text style={{ flex: 1 }}>
                So far you have{" "}
                <Text style={{ fontWeight: "bold" }}>{correct} </Text>
                correct answers
            </Text>
            {exam.length && start ? (
                <Card />
            ) : (
                <View style={{ flex: 6, flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>
                        When ready press the button to start the test
                    </Text>
                    <Pressable
                        style={{ marginHorizontal: 20 }}
                        onPress={() => {
                            setStart(true);
                            update();
                        }}
                    >
                        <Text
                            style={{
                                alignSelf: "center",
                                paddingHorizontal: 15,
                                paddingVertical: 6,
                                backgroundColor: "#453F78",
                                borderRadius: 10,
                                color: "white",
                                fontSize: 20,
                            }}
                        >
                            Start
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default Quizzer;
