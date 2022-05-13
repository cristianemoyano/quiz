import axios from "axios";
import React from "react";
import { useState, useEffect, useContext, createContext } from "react";
import { generateName } from "./utils";
import correctAnswerAudio from './assets/sounds/correct_answer.mp3'
import wrongAnswerAudio from './assets/sounds/wrong_answer.mp3'
import backgroundAudio from './assets/sounds/background.mp3'



const API_ENDPOINT = "https://opentdb.com/api.php?";

// TODO:
// Scrap this api: https://opentdb.com/api.php?amount=100
// Extract questions and answers
// Translate it
// Create a local db
// Put that db.

interface AppContextInterface {
    trivia_categories: any;
    difficulty_list: any;
    quiz_type: any;
    waiting: boolean;
    loading: boolean;
    index: Number;
    questions: Array<any>;
    nextQuestion: Function;
    checkAnswer: Function;
    error: boolean;
    correct: Number;
    isModalOpen: boolean;
    closeModal: Function;
    quiz: any;
    handleChange: Function;
    handleSubmit: Function;
    ruletaGrados: number;
    isRuletaAnimated: boolean;
    girarRuleta: Function;
    ruletaClass: boolean;
    stopRuleta: Function;
    categorySelected: number;
    setRandomUsername: Function;
    playingBackground: any;
    toggleBackground: any;
}


export const AppContext = createContext<AppContextInterface | any>(null);
interface Props {
    // any props that come into the component
    children: any
}


export const calculateScore = (correct: number, questions: Array<any>) => {
    return Number(((correct / questions.length) * 100).toFixed(0));
}


const translateQuestions = async (questions: any) => {

    const encodedParams = new URLSearchParams();

    encodedParams.append("target", "es");
    encodedParams.append("source", "en");
    questions.forEach((item: any) => {
        encodedParams.append("q", item.question);
    });
    // https://rapidapi.com/developer/billing/subscriptions-and-usage
    const apiKey: string = String(process.env.REACT_APP_RAPID_API_KEY);
    debugger
    const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
            'X-RapidAPI-Key': apiKey,
        },
        data: encodedParams
    };
    return axios.request(options)
}


export const useAudio = (url:string) => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle:Function = () => {
        setPlaying(!playing)
        audio.loop = true;
    };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [audio, playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => {
            // setPlaying(false);
            // Loop
            audio.loop=true;
            audio.currentTime=0;
        });
        return () => {
            audio.removeEventListener('ended', () => {
                // setPlaying(false);
            });
        };
    }, [audio]);

    return [playing, toggle];
};




const AppProvider: React.FC<Props> = ({ children }) => {
    const [isRuletaAnimated, setIsRuletaAnimated] = useState(false);
    const [ruletaGrados, setRuletaGrados] = useState(0);
    const [ruletsData, setRuletsData] = useState(0);
    const [ruletaClass, setRuletaClass] = useState(false);
    const [categorySelected, setCategory] = useState(0);

    const [waiting, setWaiting] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(false);
    const [index, setIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState({
        amount: 10,
        category: 9,
        difficulty: "easy",
        type: "any",
        username: "",
    });
    const [playingBackground, toggleBackground] = useAudio(backgroundAudio);


    const setRandomUsername = () => {
        let name = 'username';
        let randomeName = generateName();
        setQuiz({ ...quiz, [name]: randomeName });
    }


    const fetchApi = async (url: any) => {
        setWaiting(false);
        setLoading(true);
        try {
            const response = await axios.get(url);
            /**
                Code 0: Success Returned results successfully.
                Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
                Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
                Code 3: Token Not Found Session Token does not exist.
                Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
             */
            if (response) {
                const data = response.data.results;
                const googleAPIEnabled: boolean = false;
                if (googleAPIEnabled) {
                    let translatedQuestions: any = [];
                    translateQuestions(data).then(function (response) {
                        let translations = response.data.data.translations;
                        translatedQuestions = data.map((item: any, index: any) => {
                            item.question = translations[index].translatedText;
                            return item;
                        });

                        if (translatedQuestions.length > 0) {
                            setQuestions(translatedQuestions);
                            setLoading(false);
                            setWaiting(false);
                            setError(false);
                        } else {
                            setWaiting(true);
                            setError(true);
                        }
                    }).catch(function (error) {
                        console.error(error);
                        if (data.length > 0) {
                            setQuestions(data);
                            setLoading(false);
                            setWaiting(false);
                            setError(false);
                        } else {
                            setWaiting(true);
                            setError(true);
                        }
                    });
                } else {
                    console.log("Google API disabled.")
                    if (data.length > 0) {
                        setQuestions(data);
                        setLoading(false);
                        setWaiting(false);
                        setError(false);
                    } else {
                        setWaiting(true);
                        setError(true);
                    }
                }

            } else {
                setWaiting(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const nextQuestion = () => {
        setIndex((prevIndex) => {
            if (prevIndex === questions.length - 1) {
                openModal();
                return questions.length - 1;
            } else {
                return prevIndex + 1;
            }
        });
    };

    const playCorrectAnswer = () => {
        let audio = new Audio(correctAnswerAudio);
        audio.play();
    }
    const playWrongAnswer = () => {
        let audio = new Audio(wrongAnswerAudio);
        audio.play();
    }

    const checkAnswer = (value: any) => {
        if (value) {

            setCorrect((prev) => prev + 1);
            playCorrectAnswer();
        } else {
            playWrongAnswer();
        }
        nextQuestion();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIndex(0);
        setCorrect(0);
        setWaiting(true);
        setCategory(0);
    };

    const trivia_categories = [
        { "id": 9, "name": "Conocimiento General" },
        { "id": 10, "name": "Entretenimiento: Libros" },
        { "id": 11, "name": "Entretenimiento: Películas" },
        { "id": 12, "name": "Entretenimiento: Música" },
        { "id": 13, "name": "Entretenimiento: Musicales y Teatros" },
        { "id": 14, "name": "Entretenimiento: Televisión" },
        { "id": 15, "name": "Entretenimiento: Video Juegos" },
        { "id": 16, "name": "Entretenimiento: Juego de Mesas" },
        { "id": 17, "name": "Ciencia & Naturaleza" },
        { "id": 18, "name": "Ciencia: Computadoras" },
        { "id": 19, "name": "Ciencia: Matemática" },
        { "id": 20, "name": "Mitología" },
        { "id": 21, "name": "Deportes" },
        { "id": 22, "name": "Geografía" },
        { "id": 23, "name": "Historia" },
        { "id": 24, "name": "Política" },
        { "id": 25, "name": "Arte" },
        { "id": 26, "name": "Celebridades" },
        { "id": 27, "name": "Animales" },
        { "id": 28, "name": "Vehículos" },
        { "id": 29, "name": "Entretenimiento: Comics" },
        { "id": 30, "name": "Ciencia: Gadgets" },
        { "id": 31, "name": "Entretenimiento: Anime & Manga Japonés" },
        { "id": 32, "name": "Entretenimiento: Dibujos Animados" }
    ];
    const difficulty_list = [
        { "id": "any", "name": "Aleatoria" },
        { "id": "easy", "name": "Fácil" },
        { "id": "medium", "name": "Medio" },
        { "id": "hard", "name": "Difícil" },
    ]
    const quiz_type = [
        { "id": "any", "name": "Aleatoria" },
        { "id": "boolean", "name": "Verdadero/Falso" },
        { "id": "multiple", "name": "Multiple Opción" },
    ]

    // ---- RULETA ----
    const girarRuleta = () => {

        let categoryList = trivia_categories.map((item: any, index: any) => {
            return item.id;
        });

        let ruleta_temp = ruletsData;

        let grados_circulo = 360;
        let cantCategory = categoryList.length;
        let premio = grados_circulo / cantCategory;

        let valor_aleatorio = Math.floor(Math.random() * cantCategory);
        let ruleta_result = premio * valor_aleatorio;
        let valor_premio = (grados_circulo * 4) + ruleta_result;

        setRuletsData(valor_aleatorio)

        setCategory(categoryList[valor_aleatorio])


        setIsRuletaAnimated(true);
        setRuletaGrados(ruleta_temp * premio)

        setTimeout(() => {
            setRuletaClass(true);
            setRuletaGrados(valor_premio);
        }, 200);

    }
    const stopRuleta = () => {
        setRuletaClass(false);
        setIsRuletaAnimated(false);
        let name = 'category';
        setQuiz({ ...quiz, [name]: categorySelected });
    }

    // ---- RULETA ----


    const handleChange = (e: any) => {
        const { value, name } = e.target;
        setQuiz({ ...quiz, [name]: value });
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const { amount, category, difficulty, type } = quiz;
        let url = `${API_ENDPOINT}amount=${amount}&category=${category}`;
        if (difficulty !== "any") {
            url += `&difficulty=${difficulty}`;
        }
        if (type !== "any") {
            url += `&type=${type}`;
        }
        fetchApi(url);
    };

    const sampleAppContext: AppContextInterface = {
        trivia_categories,
        difficulty_list,
        quiz_type,
        waiting,
        loading,
        index,
        questions,
        error,
        correct,
        nextQuestion,
        checkAnswer,
        isModalOpen,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
        setRandomUsername,
        playingBackground,
        toggleBackground,
        //Ruleta
        ruletaGrados,
        isRuletaAnimated,
        girarRuleta,
        ruletaClass,
        stopRuleta,
        categorySelected,
    };

    return (
        <AppContext.Provider
            value={sampleAppContext}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;

export const useGlobalContext = () => {
    return useContext(AppContext);
};