import React from "react";
import {useNavigate,useLocation} from 'react-router-dom';
import { useEffect } from "react";

//icons
import { MdOutlineRestartAlt } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";



export default function Tamati (){

     //navigation
    const navigate = useNavigate();

    //retrieve score from previous session
    const location = useLocation();
    const { score, total } = location.state || {};

    //handle restart
    const handleRestart = ()=>{
        //avoid showing game play instructions again
        localStorage.setItem("seenInstructions", "true");
        //navigate to homepage
        navigate("/");
    };
    
    //handle Quit
    const handleQuit = ()=>{
        //show game play instructions again
        localStorage.removeItem("seenInstructions", "false");
        //navigate to homepage
        navigate("/");
    };

    //fetch and sync history and favs data from mongo
    // only do so when a user has been successfully created
    useEffect(() => {
            const username = localStorage.getItem('username');

             //dont fetch from mongo if they are just a guest
            if(username === 'Guest'){
                console.log("Didn't fetch history for a guest");
                return;
            }

            const interval = setInterval( async()=>{
                try{
                     const response = await fetch(`${apiUrl}/get_user/${username}`);
                     if(!response.ok) return; // user not yet found

                     const data = await response.json();
                     //if user was found
                       if(data.user){
                            localStorage.setItem('historyData', JSON.stringify(data.user.history));
                            localStorage.setItem('storedFavs', JSON.stringify(data.user.favourites));

                            //debugging to confirm we really are setting data according to username
                            console.log('loaded data for user',username);
                            console.log('History',data.user.history);
                            console.log('Favs',data.user.favourites);

                            //clear interval once data is found
                            clearInterval(interval);
                       }

                }
                catch(err){
                    console.log('polling error',err);
                }
            },500);

            //clean up when component unmounts
            return ()=> clearInterval(interval);
            
    }, []);



    
     return(
        <>

                    {/* container */}
                    <div className="bg-bgMobile sm:bg-bgSm md:bg-bgMd lg:bg-bgLg  bg-cover bg-center w-full h-screen flex justify-center items-end flex-wrap animate-breathe-glow">

                         {/* quit Button Container */}
                            <div className="w-full h-[6vh] flex justify-end items-center px-3 sm:px-6 shadow-sm">
                            
                                <button
                                    onClick={() => handleQuit()}
                                    className="flex items-center justify-center gap-2
                                            h-[90%] px-4 sm:px-5 rounded-xl
                                            bg-gradient-to-r from-broRed/25 to-broRed/60
                                            hover:from-broRed hover:to-broRed/95
                                            text-white font-medium
                                            shadow-md hover:shadow-xl
                                            hover:scale-105 active:scale-95
                                            transition-all duration-300 ease-in-out"
                                >
                                    
                                    <IoMdExit className="text-white text-xl sm:text-2xl" />
                                    <span className="hidden sm:inline text-sm sm:text-base">Quit</span>
                                </button>
                            </div>

                        {/* card */}
                        <div className=" w-[90%] h-[90%] rounded-xl flex flex-col justify-between  lg:flex-row lg:justify-between lg:items-center"
                          style={{backgroundColor:" rgba(255, 255, 255, 0.14)"}}
                        >
        
                            {/* Title and P container */}
                            <div className="flex flex-col items-center justify-between  w-full p-2 h-[35%] sm:h-[33%] md:h-[22%] lg:w-2/3 lg:h-[100%] lg:items-center flex-wrap  ">
                                 {/* score message */}
                                <h2 className=" animate-pulse text-white font-play text-[clamp(1.5rem,1.5rem,3rem)] lg:text-[clamp(1.5rem,3rem,5rem)] shadow"
                                    style={{animationDuration:"3s"}}
                                >
                                    GAME OVER 
                                </h2>
        
                            
                                {/* score message */}
                                 {/* score container */}
                                  <div className="p-2 md:p-1 flex flex-col items-center justify-center mb-5 md:mb-0 ">
                                      <div className=" w-full h-[100%] rounded-xl flex flex-col justify-center items-center flex-col  m-2 p-2  shadow:md bg-white/15 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out flex-wrap "
                                    //  style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                    >  
                                        <p className="text-white font-play text-center text-[clamp(0.7rem,1.5rem,2.1rem)] sm:text-[clamp(1.2rem,1.9rem,2.1rem)] md:hidden ] "
                                            // style={{fontSize:"2rem"}}
                                        >Your score is </p>
            
                                        <p className="text-white font-play text-center text-[clamp(0.7rem,1.5rem,2.1rem)] sm:text-[clamp(1.2rem,1.9rem,2.1rem)] md:hidden "
                                            // style={{fontSize:"2rem"}}
                                        > {score} of {total}</p>
            
                                        <p className="hidden lg:hidden md:block md:text-white  lg:font-play lg:text-center  text-[clamp(1.2rem,1.9rem,2.1rem)]"
                                            // style={{fontSize:"2rem"}}
                                        > Your score is {score} of {total} </p>
            
                                    </div>
                                  </div>
        
                                 {/* score message for large screens */}
                                    {/* score container */}
                                    <div className=" p-6 m-2 mb-7  hidden lg:block items-center justify-left  w-full h-[65%] ">
                                        <div className="w-[50%] h-40%] rounded-xl flex flex-col justify-center items-center flex-col  m-2 p-2 flex-wrap shadow:md hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out transition-colors duration-300 ease-in-out "
                                          style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                        >  
                                            <p className=" m-1 text-white font-play  lg:text-[clamp(1.5rem,2rem,3rem)]"> Your score </p>
                                             {/* <p className="m-1 text-white font-play  lg:text-[clamp(1.5rem,2rem,3rem)]">  your </p> */}
                                              <p className=" pl-10 m-1 text-white font-playball  lg:text-[clamp(1.5rem,2rem,3rem)]">  is </p>
                                               <p className="pl-3 m-1 text-white font-play lg:text-[clamp(1.5rem,2rem,3rem)]">  {score} of {total}</p>
        
                                         </div>
                                     </div>
                            </div>
                           
        
                             {/*Container-Categories  */}
                            <div className="flex justify-around items-center w-full p-2 h-[35%]  lg:w-1/3 lg:h-[60%] lg:flex-col flex-wrap ">
        
                                {/* Category box1--restart */}
                                <button className=" w-[38%] sm:w-[30%] h-[40%] rounded-xl flex justify-around items-center flex-col  m-2 p-2  lg:h-[25%] lg:w-[50%] flex-wrap shadow:md hover:bg-white/20 hover:shadow-xl hover:scale-105"
                                    style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                    onClick={()=> handleRestart()}
                                >  
        
                                    {/* Restart icon*/}
                                     <MdOutlineRestartAlt className="text-white p-1 text-[clamp(1.8rem,2.5rem,4.1rem)] sm:text-[clamp(3rem,4rem,4.1rem)] " 
                                        // style={{fontSize:"4rem"}}
                                    /> 
        
                                   {/* Restart p */}
                                    <p className="rounded-xl p-1 sm:p-2 font-play text-[clamp(0.5rem,0.9rem,2rem)] md:text-xl "
                                        style={{
                                            color:"White"
                                        }}
                                        
                                    >
                                        Restart
                                    </p>
                                </button>
        
        
                                 {/* Category box2--History */}
                                <button className=" w-[38%] sm:w-[30%] h-[40%] rounded-xl flex justify-around items-center flex-col m-2 p-2 lg:h-[25%] lg:w-[50%] flex-wrap  bg-white/15 shadow:md hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out transition-colors duration-300 ease-in-out"
                                    style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                    onClick={()=> navigate("/history")}
                                >  
        
                                    {/* History icon*/}
                                     <BsClockHistory className=" p-1 text-[clamp(1.2rem,2.5rem,4.1rem)] sm:text-[clamp(3rem,4rem,4.1rem)]" 
                                        style={{color:"lightgreen"}}
                                    /> 
        
                                   {/* History p */}
                                    <p className="rounded-xl p-1 sm:p-2 font-play text-[clamp(0.5rem,0.9rem,2rem)] md:text-xl "
                                        style={{
                                            color:"White"
                                        }}
                                        
                                    >
                                        History
                                    </p>
                                </button>


                                 {/* Category box3--Favourites */}
                                <button className="w-[45%] sm:w-[30%] h-[40%] rounded-xl shadow:md flex justify-around items-center flex-col m-2 p-2 lg:h-[25%] lg:w-[50%]  flex-wrap bg-white/15 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out"
                                     onClick={()=> navigate("/favs")}
                                >  
        
                                    {/* Heart icon*/}
                                     <FaHeart className="animate-breathe-glow text-red-500 p-1 text-[clamp(1.2rem,2.5rem,4.1rem)] sm:text-[clamp(3rem,4rem,4.1rem)] " 
                                        // style={{fontSize:"4rem"}}
                                    /> 
        
                                   {/* favourites p */}
                                    <p className="rounded-xl p-2 font-play text-[clamp(0.5rem,0.9rem,2rem)] md:text-xl"
                                        style={{
                                            color:"White"
                                        }}
                                       
                                    >
                                        favourites
                                    </p>
                                </button>
                            </div>
                                       
        
                            
                        </div>
        
                </div>

       
        </>
     );
}