import React, { useRef,useState,useEffect,Suspense } from "react";
import {useNavigate} from 'react-router-dom';
import '../components/QuizzPage.css';

//lazy load main page
const HomeMain = React.lazy(() => import("../components/HomeMain.jsx"));


//for caroussel
import { Navigation, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";


//icons
import {FaRegLightbulb} from 'react-icons/fa6';

export default function Karibuni(){

    //navigation
    const navigate = useNavigate();

    //username
    const [username, setUsername] = useState('');
    const [showInstructions, setShowInstructions] = useState(true);
    const swiperRef = useRef(null);



    useEffect(() => {
        // check if user has seen instructions before
        const seen = localStorage.getItem("seenInstructions");
        if (!seen) {
        setShowInstructions(true);
        localStorage.setItem("seenInstructions", "true");
        }
        else{
             setShowInstructions(false);
        }
    }, []);


    //then they continue the game normally
    const handleClose = () => {

        //clear out previous data from local storage
        localStorage.removeItem('historyData');
        localStorage.removeItem('storedFavs');

        //set username as guest on local storage
        localStorage.setItem('username','Guest');

        //disale instructions
        setShowInstructions(false);
    };


    //prompt them to enter a username
    const handleYes = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext(); // move to name input slide
        }
    };


    //set a username according to the user
    const handleName = (e)=>{
        //prevent default reload
        e.preventDefault();

        //set to localstorage
        localStorage.setItem("username", username);
        console.log("Username saved:", username);

        // Reset the form input
        setUsername("");

        //disale instructions
        setShowInstructions(false);
    };
    

    return(
        <>
            {/* container */}
            <div className="bg-bgMobile sm:bg-bgSm md:bg-bgMd lg:bg-bgLg  bg-cover bg-center animate-breathe-glow w-full h-screen flex justify-center items-end flex-wrap">

                 {/* tips Button Container */}
                    <div className="w-full h-[6vh] flex justify-end items-center px-3 sm:px-6 shadow-sm">
                    
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center justify-center 
                                    h-[90%] px-4 sm:px-5 rounded-xl
                                    bg-purple-400 sm:bg-white/10
                                    hover:bg-purple-500 sm:hover:bg-white/20
                                    text-white font-medium
                                    shadow-md hover:shadow-xl
                                    hover:scale-105 active:scale-95
                                    transition-all duration-300 ease-in-out "
                        >
                            
                            <FaRegLightbulb className="text-white text-xl sm:text-2xl" />
                        </button>
                    </div>


                {/* Lazy-loaded main content */}
                <Suspense fallback={<div className="text-white text-center mt-10">Loading game...</div>}>
                 {!showInstructions && <HomeMain />}
                </Suspense>
               


                {/* overlay for instructions*/}
                {showInstructions && (
                    <div
                        className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm animate-fadeIn"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="instructions-title"
                    >
                        <div className="bg-white/10 w-full h-full sm:w-[90%] sm:h-[90%] rounded-xl flex flex-col items-center justify-center p-2 overflow-y-auto">
                        <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            onSwiper={(swiper) => (swiperRef.current = swiper)} // capture swiper instance
                            modules={[Navigation, Keyboard]}
                            navigation
                            keyboard={{ enabled: true, onlyInViewport: true }}
                            className="w-full h-full"
                        >
                            {/* --- Slide 1: Welcome --- */}
                            <SwiperSlide>
                            <div className="flex flex-col justify-center items-center text-center p-6">
                                <h1 id="instructions-title" className="text-white/90 font-play text-2xl mb-4">
                                Welcome to Quizz-IT
                                </h1>
                                <ul className="space-y-2 mt-2 p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex flex-col justify-center items-center gap-3">
                                <li className="font-play text-sm sm:text-base">
                                    You have 2 Categories:{" "}
                                    <span className="text-blue-600 font-bold">Football</span> and{" "}
                                    <span className="font-bold text-blue-600">Countries</span>.
                                </li>
                                <li className="font-play text-sm sm:text-base">
                                    Each category has 2 questions.
                                </li>
                                <li className="font-play text-sm sm:text-base">
                                    Choose one to{" "}
                                    <span className="font-bold uppercase tracking-wide text-blue-800">
                                    PLAY
                                    </span>
                                </li>
                                </ul>
                            </div>
                            </SwiperSlide>

                            {/* --- Slide 2: History Choice --- */}
                            <SwiperSlide>
                            <div className="flex flex-col justify-center items-center text-center p-6">
                                <p className="font-play text-white/90 text-lg sm:text-xl mb-4">
                                Do you want to track personalised history?
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center items-center">
                                <button
                                    onClick={handleYes} // go to next slide 
                                    className="text-white text-base sm:text-sm md:text-lg font-play p-3 m-2 border border-white shadow-sm sm:w-[clamp(40%,45%,50%)] rounded-full bg-broGreen hover:shadow-md hover:bg-broGreen/90 hover:scale-105 transition"
                                >
                                    Yes
                                </button>

                                <button
                                    onClick={handleClose} // existing behavior
                                    className="text-white text-base sm:text-sm md:text-lg font-play p-3 m-2 border border-white shadow-sm sm:w-[clamp(40%,45%,50%)] rounded-full bg-broRed hover:shadow-md hover:bg-broRed/90 hover:scale-105 transition"
                                >
                                    No
                                </button>
                                </div>
                            </div>
                            </SwiperSlide>

                            {/* --- Slide 3: Name Entry --- */}
                            <SwiperSlide>
                            <form
                                onSubmit={handleName}
                                className="flex flex-col justify-center items-center text-center p-6"
                            >
                                <p className="font-play text-white/90 text-lg sm:text-xl mb-4">
                                Please enter a player name:
                                </p>
                                <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-black rounded-lg p-2 m-2 w-3/4 max-w-sm"
                                />
                                <button
                                type="submit"
                                className="text-white text-base sm:text-sm md:text-lg font-play p-3 m-2 border border-white shadow-sm w-[clamp(40%,45%,50%)] rounded-full bg-broGreen hover:shadow-md hover:bg-broGreen/90 hover:scale-105 transition"
                                >
                                Start
                                </button>
                            </form>
                            </SwiperSlide>
                        </Swiper>
                        </div>
                    </div>
                    )}

        </div>
        </>
    );
}