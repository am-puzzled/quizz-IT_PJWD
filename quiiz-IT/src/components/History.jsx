
import { data, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

//css
import  '../index.css';

//chevrons
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

function History(){

    // navigate
    const navigate = useNavigate();

    //consts
    const [historyData,setHistoryData] = useState([]);
    const [heartClickedStates, setHeartClickedStates] = useState({}); //create json object with key values like {0:true 1:false 2:false}
    const [clickedChevron, setClickedChevron] = useState(null); //null= none is clicked yet



    //get history data
    useEffect(()=>{
        const historyData = JSON.parse(localStorage.getItem('historyData'));

        
         //console.log('history data is ',historyData);   //for debug

        setHistoryData(historyData);
    },[]);



    //get favourites data
    useEffect(()=>{
        const storedFavs = JSON.parse(localStorage.getItem('storedFavs')) || [];
            //debug  // console.log('my stored favs after reloading',storedFavs);  
        
        //track initial heart states
        const initialHeartStates = {};

        //set heart states based on whether each history item is in favourites
        historyData.forEach((item,index)=>{
            const existsInFavs = storedFavs.some(
                favItem => favItem.uniqueId === item.uniqueId // the one we created
            );
            initialHeartStates[index] = existsInFavs; //either true/false, exists/not

            console.log('exists',existsInFavs);
             console.log('item.uniqueId',item.uniqueId);
        });

        setHeartClickedStates(initialHeartStates);

        
    },[historyData]);



    const toggleFavs = async (index)=>{

        //download favs we have from local storage
        const storedFavs = JSON.parse(localStorage.getItem('storedFavs')) || [];

        //selected item
        const selectedItem = historyData[index];
        console.log('selected item is',selectedItem);

        //Check if this exact item already exists (by value)
        const alreadyExists = storedFavs.some(item => item.uniqueId === selectedItem.uniqueId);
        
        if(!alreadyExists){
            //add
            // setSavedFavs([...savedFavs,selectedItem]);
             const newStoredFavs = [...storedFavs,selectedItem];
            //save new array
             localStorage.setItem('storedFavs',JSON.stringify(newStoredFavs));

            // send to backend
            await fetch('http://localhost:5000/add_favourite', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    favouriteItem: selectedItem
                })
            });
             
        }
        else{
            //remove
            // setSavedFavs(savedFavs.filter(item=> item !== selectedItem)); //filter out the item
             const updatedStoredFavs = storedFavs.filter(item => item.uniqueId !== selectedItem.uniqueId);
            //save new array
             localStorage.setItem('storedFavs',JSON.stringify(updatedStoredFavs));

            // remove from backend
            await fetch('http://localhost:5000/remove_favourite', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    favId: selectedItem.uniqueId
                })
            });
         
        }


         //change heart colour
                setHeartClickedStates(
                    prev=>({
                        ...prev, //keep previous states the way they were
                        [index]:!prev[index] // if index was 0: false, !prev[0]=true
                    })
                )
    };
       


    //handle chevron
    const handleChevronDown = (index) => {
        setClickedChevron(
            prev=> prev===index? null: index 
            //when a no chevron is clicked state is null
            //check prev state, if it's equals to index it means nothing changed; No chevron was clicked
            //let it remain null
            //however if state differs from index,then a button was definately clicked
            //set the state to be that button
        );
    };

   

  
    return(
        <>
            {/* card and back button container */}
            <div className="bg-bgMobile sm:bg-bgSm md:bg-bgMd lg:bg-bgLg  bg-cover bg-center w-full min-h-screen flex flex-col justify-between items-center flex-wrap pt-4" >
                {/* Back Button Container */}
                <div className="w-full h-[6vh] flex justify-end items-center px-3 sm:px-6 shadow-sm">
                
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2
                                h-[90%] px-4 sm:px-5 rounded-xl
                                bg-gradient-to-r from-broRed/35 to-broRed/60
                                hover:from-broRed hover:to-broRed/95
                                text-white font-medium
                                shadow-md hover:shadow-xl
                                hover:scale-105 active:scale-95
                                transition-all duration-300 ease-in-out"
                    >
                        
                        <IoChevronBack className="text-white text-xl sm:text-2xl" />
                        <span className="hidden sm:inline text-sm sm:text-base">Back</span>
                    </button>
                </div>


                {/* card */}
                <div  className=" w-[90%] min-h-[90vh] rounded-xl flex flex-col bg-white/15 justify-start items-center p-2 shadow" >
                 
                   {/* history container */}
                    <div className="bg-white p-2 m-2 w-full rounded shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-around items-center">
                        <h1 className=" font-play text-md sm:text-lg md:text-xl lg:text-2xl">Last {historyData.length} scores </h1>

                        {/* card for scores display */}
                        <div className="max-w-xl w-full mx-auto mt-10 mb-10  p-4 bg-gray-100 rounded-lg shadow-md">
                                
                                
                                    { //get values
                                        historyData.length ===0? 
                                          <p className="text-gray-600 font-semibold bg flex justify-center items-center "> No History currently </p> 
                                                        :
                                            historyData.map(
                                                (data,index)=>(
                                                    //return a card
                                                    <div
                                                        className="
                                                        p-4 m-2 bg-white rounded-lg 
                                                        shadow-black hover:shadow-lg 
                                                        border-gray-200 hover:scale-105
                                                        transition-transform duration-300 ease-in-out
                                                        flex flex-col justify-center items-center"
                                                       
                                                        key={index}
                                                    >
                                                        {/* button,chevron and heart container */}
                                                        <div className="
                                                          bg-red-100 flex justify-center items-center
                                                          w-full
                                                        ">
                                                            {/* score p */}
                                                            <p className="text-gray-800 font-medium w-[60%]">
                                                                    Score: <span className="text-blue-600"> {data.Score}</span> of <span className="text-green-600">{data.Total}</span>
                                                            </p>

                                                            {/* Category box3--Favourites */}
                                                            <button className=" 
                                                            rounded-xl shadow:md flex
                                                            justify-around items-center 
                                                            flex-col p-2 hover:shadow-xl 
                                                            hover:scale-105 transition-shadow 
                                                            duration-300 ease-in-out 
                                                            w-[15%] sm-w-[10%] bg-orange-200"
                                                                    onClick={()=> toggleFavs(index)}
                                                            >  
                                                                {/* Heart icon*/}
                                                                    <FaHeart className={` 
                                                                    p-1 ${heartClickedStates[index] ? "text-red-500": "text-white"}
                                                                    text-[clamp(0.2rem,1.3rem,2.1rem)] 
                                                                    sm:text-[clamp(1rem,2rem,3.1rem)] `}
                                                                
                                                                /> 
                                                            </button>

                                                            {/* chevron box */}
                                                            <button
                                                                className={`chevronBox flex justify-center items-center p-2 m-2 rounded  w-[15%] sm-w-[10%]
                                                                ${clickedChevron === index ? "bg-yellow-500 " : "bg-yellow-300"}
                                                                `}
                                                                onClick={()=>handleChevronDown(index)}
                                                            >
                                                                {clickedChevron === index ? <FaChevronUp /> : <FaChevronDown />}
                                                            </button>
                                                        </div>

                                                        {/* show more */}
                                                        {clickedChevron === index && (
                                                            <div
                                                                className="
                                                                mt-4 w-[90%] p-6 rounded-xl
                                                                bg-gray-100 border border-gray-100
                                                                shadow-sm hover:shadow-md
                                                                transition-all duration-300 ease-in-out
                                                                flex flex-col gap-5
                                                                "
                                                            >
                                                                {/* Category */}
                                                                <div className="flex items-center gap-2 text-gray-800">
                                                                <span className="text-sm uppercase tracking-wide text-blue-500 font-bold">Category</span>
                                                                <span className="text-base font-semibold text-gray-700">
                                                                    {historyData[index].Category}
                                                                </span>
                                                                </div>

                                                                {/* Question 1 */}
                                                                <div className="space-y-2">
                                                                <p className="text-gray-800 text-sm sm:text-base">
                                                                    <span className="font-semibold text-gray-600">Question:</span> {historyData[index].questions[0].Q1}
                                                                </p>
                                                                <p className="text-sm sm:text-base">
                                                                    <span className="font-semibold text-gray-600">Correct:</span>{" "}
                                                                    <span className="text-emerald-600">{historyData[index].questions[0].Q1_correctAns}</span>
                                                                </p>
                                                                <p className="text-sm sm:text-base">
                                                                    <span className="font-semibold text-gray-600">Your Answer:</span>{" "}
                                                                    <span className={
                                                                        `${historyData[index].questions[0].Q1_correctAns === historyData[index].questions[0].Q1_yourAns ?
                                                                         "text-emerald-600" : "text-rose-500"}`}>
                                                                            {historyData[index].questions[0].Q1_yourAns}
                                                                    </span>
                                                                </p>
                                                                </div>

                                                                <div className="border-t border-gray-200"></div>

                                                                {/* Question 2 */}
                                                                <div className="space-y-3">
                                                                <p className="text-gray-800 text-sm sm:text-base">
                                                                    <span className="font-semibold text-gray-600">Question:</span> {historyData[index].questions[1].Q2}
                                                                </p>

                                                                {/* Correct answer image */}
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-2 font-medium">Correct Answer</p>
                                                                    <div className="
                                                                    bg-broGreen border border-gray-200 rounded-lg
                                                                    p-3 flex justify-center items-center
                                                                    hover:bg-gray-100 transition-colors
                                                                    max-w-[40%] sm:max-w-[25%]
                                                                    ">
                                                                    <img
                                                                        src={historyData[index].questions[1].Q2_correctAns}
                                                                        alt="Correct Answer"
                                                                        className="rounded-md object-contain max-h-24"
                                                                    />
                                                                    </div>
                                                                </div>

                                                                {/* Your answer image */}
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-2 font-medium">Your Answer</p>
                                                                    <div className={`
                                                                        border border-gray-200 rounded-lg
                                                                        p-3 flex justify-center items-center
                                                                        hover:bg-gray-100 transition-colors
                                                                        max-w-[40%] sm:max-w-[25%]
                                                                        ${historyData[index].questions[1].Q2_correctAns === historyData[index].questions[1].Q2_yourAns ? 
                                                                            'bg-broGreen' : 'bg-broRed'}
                                                                    `}>
                                                                    <img
                                                                        src={historyData[index].questions[1].Q2_yourAns}
                                                                        alt="Your Answer"
                                                                        className="rounded-md object-contain max-h-24"
                                                                    />
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            )}

                                                        </div>
                                                )
                                                )
                                            
                                        }

                                
                        </div>



                    </div>

                </div>

            </div>
        
        </>
    );

}

export default History;