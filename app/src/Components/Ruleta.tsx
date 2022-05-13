import ruletaImg from '../assets/img/wheel.png'
import { useGlobalContext } from "../context";
import './Ruleta.css';


const Ruleta = () => {
    const { ruletaGrados, ruletaClass, isRuletaAnimated, girarRuleta, stopRuleta, categorySelected, trivia_categories } = useGlobalContext();
    const btnColor = isRuletaAnimated ? 'gray' : 'yellow';
    const btnTextColor = isRuletaAnimated ? 'black' : 'white';
    const category = categorySelected && !isRuletaAnimated ? trivia_categories.find((element: any) => element.id === categorySelected).name : "Buscar...";
    return (
        <div className='p-3 text-center '>
             <h2 className={`text-2xl font-medium p-3 ${!isRuletaAnimated ? "" : "blurry-text"}`}> {category}</h2>
           
            <p>
                <img
                    id="img-ruleta"
                    src={ruletaImg}
                    style={{ transform: 'rotate(' + ruletaGrados + 'deg)', WebkitTransform: 'rotate(' + ruletaGrados + 'deg)' }}
                    alt="Ruleta"
                    onTransitionEnd={(e)=>{
                        stopRuleta()
                    }}
                    className={`img-responsive ${ruletaClass ? " img-ruleta" : ""}`}
                />
            </p>
            <p className='p-3'>
                <button
                    id="btnAnimar"
                    disabled={isRuletaAnimated}
                    onClick={girarRuleta}
                    className={`bg-${btnColor}-600 rounde-md w-full shadow p-2 text--${btnTextColor}`}>
                        GIRA LA RULETA
                </button>
            </p>
        </div>

    )
}

export default Ruleta