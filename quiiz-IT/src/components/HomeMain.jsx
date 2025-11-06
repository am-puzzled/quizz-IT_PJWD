import React from "react";

//icons
import { useNavigate } from "react-router-dom";
import { GiWorld, GiSoccerKick } from "react-icons/gi";

export default function HomeMain (){

    const navigate = useNavigate();

    return(

             <>
                        {/* card */}
                        <div className=" w-[90%] h-[90%] rounded-xl flex flex-col justify-between  lg:flex-row lg:justify-between lg:items-center"
                          style={{backgroundColor:" rgba(255, 255, 255, 0.14)"}}
                        >
        
                            {/* Title and P */}
                            <div className="flex flex-col items-center justify-between  w-full p-2 h-[30%] md:h-[22%] lg:w-2/3 lg:h-[100%] lg:items-center flex-wrap  ">
                                 {/* welcome message */}
                                <h2 className="text-white font-play text-[clamp(1.5rem,2rem,3rem)] lg:text-[clamp(1.5rem,3rem,5rem)] shadow" >Quizz-IT </h2>
        
                            
                                {/* welcome message */}
                                <div className="p-2 md:p-1 flex flex-col items-center justify-center  ">
                                    <p className="text-white font-play text-center text-[clamp(0.7rem,1.5rem,2.1rem)] sm:text-[clamp(1.2rem,2rem,2.1rem)] md:hidden ] "
                                        // style={{fontSize:"2rem"}}
                                    >Unleash your Inner </p>
        
                                    <p className="text-white font-play text-center text-[clamp(0.7rem,1.5rem,2.1rem)] sm:text-[clamp(1.2rem,1.9rem,2.1rem)] md:hidden mb-2"
                                        // style={{fontSize:"2rem"}}
                                    >Wisdom </p>
        
                                    <p className="hidden lg:hidden md:block md:text-white  lg:font-play lg:text-center"
                                        style={{fontSize:"2rem"}}
                                    > Unleash your Inner Wisdom </p>
        
                                </div>
        
                                 {/* Welcome message for large screens */}
                                        <div className=" p-6 m-2 flex flex-col hidden lg:block items-center justify-left  w-full h-[65%] ">
                                            <p className=" m-1 text-white font-play  lg:text-[clamp(1.5rem,2rem,3rem)]">  Unleash your </p>
                                             {/* <p className="m-1 text-white font-play  lg:text-[clamp(1.5rem,2rem,3rem)]">  your </p> */}
                                              <p className=" pl-10 m-1 text-white font-playball  lg:text-[clamp(1.5rem,2rem,3rem)]">  Inner </p>
                                               <p className="pl-3 m-1 text-white font-play lg:text-[clamp(1.5rem,2rem,3rem)]">  Wisdom </p>
        
                                         </div>
                            </div>
                           
        
                             {/*Container-Categories  */}
                            <div className="flex justify-around items-center w-full p-2 h-[35%]  lg:w-1/3 lg:h-[60%] lg:flex-col ">
        
                                {/* Category box1--countries */}
                                <button className=" w-[40%] h-[60%] rounded-xl flex justify-around items-center flex-col  m-2 p-2  lg:h-[40%] lg:w-[50%] flex-wrap shadow:md bg-white/15 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out "
                                    // style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                       onClick={()=> navigate("/countries")}
                                >  
        
                                    {/* World/globe icon*/}
                                     <GiWorld className=" animate-spin text-white p-1  text-[clamp(1.8rem,2.1rem,4.1rem)] sm:text-[clamp(3rem,4rem,4.1rem)] " 
                                        // style={{fontSize:"4rem"}}
                                        style={{animationDuration:"20s"}}
                                    /> 
        
                                   {/* countries button */}
                                    <p className="rounded-xl p-2 font-play sm:text-[clamp(0.7rem,1.1rem,2rem)] md:text-xl  "
                                        style={{
                                            color:"White"
                                        }}
                                     
                                    >
                                        Countries
                                    </p>
                                </button>
        
        
                                 {/* Category box2--Football */}
                                <button className=" w-[40%] h-[60%] rounded-xl flex justify-around items-center flex-col m-2 p-2 lg:h-[40%] lg:w-[50%] flex-wrap shadow:md bg-white/15 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-colors duration-300 ease-in-out "
                                    style={{backgroundColor:" rgba(255, 255, 255, 0.15)"}}
                                    onClick={()=> navigate("/football")}
                                >  
        
                                    {/* soccer icon*/}
                                     <GiSoccerKick className="animate-bounce text-white p-1  text-[clamp(1.8rem,2.1rem,4.1rem)] sm:text-[clamp(3rem,4rem,4.1rem)] " 
                                        // style={{fontSize:"4rem"}}
                                        style={{ animationDuration: '4s' }}
                                    /> 
        
                                   {/* Football button */}
                                    <p className="rounded-xl p-2 font-play sm:text-[clamp(0.7rem,1.1rem,2rem)] md:text-xl "
                                        style={{
                                            color:"White"
                                        }}
                                        
                                    >
                                        Football
                                    </p>
                                </button>
                            </div>
                                       
        
                            
                        </div>

        </>
    );
}