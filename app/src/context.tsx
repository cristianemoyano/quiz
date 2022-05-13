import axios from "axios";
import { useState, useContext, createContext } from "react";

const table:any = {
  sports: 21,
  history: 23,
  politics: 24,
  science: 18,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

interface AppContextInterface {
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

  }
  

export const AppContext = createContext<AppContextInterface | any>(null);

interface Props {
    // any props that come into the component
    children: any
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
    type: "boolean",
  });

  const fetchApi = async (url: any) => {
    setWaiting(false);
    setLoading(true);
    try {
      const response = await axios.get(url);
      if (response) {
        const data = response.data.results;
        if (data.length > 0) {
          setQuestions(data);
          setLoading(false);
          setWaiting(false);
          setError(false);
        } else {
          setWaiting(true);
          setError(true);
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

  const checkAnswer = (value: any) => {
    if (value) {
      setCorrect((prev) => prev + 1);
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
  };

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { amount, category, difficulty, type } = quiz;
    let url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=${type}`;
    fetchApi(url);
  };

  const sampleAppContext: AppContextInterface = {
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