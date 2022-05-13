import { useGlobalContext } from "../context";
import Ruleta from "./Ruleta";

const Form = () => {
  const { trivia_categories, difficulty_list, quiz_type, quiz, handleSubmit, handleChange, error, setRandomUsername } = useGlobalContext();

  let categories = trivia_categories.map((item: { id: number; name: string; }, index: any) => (
    <option value={item.id} key={index}>{item.name}</option>
  ));
  let difficulty = difficulty_list.map((item: { id: number; name: string; }, index: any) => (
    <option value={item.id} key={index}>{item.name}</option>
  ));
  let quiz_type_list = quiz_type.map((item: { id: number; name: string; }, index: any) => (
    <option value={item.id} key={index}>{item.name}</option>
  ));
  return (
    <div className="justify-center flex items-center min-h-screen ">
      <Ruleta />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 md:p-8 max-w-[500px] space-y-8 shadow rounded-lg w-11/12 "
      >
        <h2 className="text-3xl font-medium">Iniciar Quiz</h2>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium" htmlFor="username">
            Nombre:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Tu nombre o el nombre de tu equipo.."
            className="bg-gray-200 p-2 rounded-md outline-0 focus:bg-gray-300"
            onChange={handleChange}
            value={quiz.username}
            required={true}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            setRandomUsername()
          }}
          className="bg-blue-500 rounde-md p-2 text-white hover:bg-cian-500"
        >
          Generar
        </button>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium" htmlFor="amount">
            Cantidad de Preguntas
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="bg-gray-200 p-2 rounded-md outline-0 focus:bg-gray-300"
            value={quiz.amount}
            onChange={handleChange}
            min={5}
            max={50}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium" htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            className="bg-gray-200 p-2 rounded-md outline-0 focus:bg-gray-300"
            value={quiz.category}
            onChange={handleChange}

          >
            {categories}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium" htmlFor="difficulty">
            Dificultad
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="bg-gray-200 p-2 rounded-md outline-0 focus:bg-gray-300"
            value={quiz.difficulty}
            onChange={handleChange}

          >
            {difficulty}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium" htmlFor="type">
            Tipo de Preguntas
          </label>
          <select
            id="type"
            name="type"
            className="bg-gray-200 p-2 rounded-md outline-0 focus:bg-gray-300"
            value={quiz.type}
            onChange={handleChange}

          >
            {quiz_type_list}

          </select>
        </div>
        {error && (
          <p className="text-red-600">
            Lo sentimos, no pudimos generar las preguntas. Intente nuevamente con otras opciones.
          </p>
        )}
        <button
          type="submit"
          className="bg-yellow-600 rounde-md w-full p-2 text-white hover:bg-yellow-500"
        >
          Iniciar
        </button>
      </form>
    </div>
  );
};

export default Form;