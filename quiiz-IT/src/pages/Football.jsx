import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React,{useEffect} from 'react';

//components
import ProgressBar from '../components/ProgressBar.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Skeleton2 from '../components/Skeleton2.jsx';

//random id generator
import {v4 as uuidv4} from 'uuid';

export default function Football() {

  //handle navigation
  const navigate = useNavigate();


  //Pages 
  const pages = [
    { id:"page1", component: Skeleton},
    { id:"page2", component: Skeleton2},
  ];

  //Constants
  const total = pages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  //handle score
  const [score,setScore] = useState(0);

  //end of game
  const [quizEnded, setQuizEnded] = useState(false);

  //for history purporses
  const [historyData, setData] = useState([]);


  //update score
  const updateScore = ()=>{
    setScore(prev =>{
                        const newScore = prev + 1;
                        console.log(`score is:`,newScore);
                        return newScore;
                    });
  };

        //Go next page
        const goNext = () => {
                // update progress
                setProgress(prev => {
                // const step = 100 / total;
                return Math.min(prev + 1, total);
                });

                const next = currentIndex + 1;
                    if (next >= total) {
                        // reached the end → go to last page
                        setTimeout(()=>{
                            setTimeout(() => setQuizEnded(true), 2000);
                        },2000);
                    } else {
                        // move to the next step and reset answered flag
                        setTimeout(()=>{
                            setCurrentIndex(prev => Math.min(prev + 1, total - 1));
                        // setIsAnswered(false);
                        },2000);
                        
                    }

                // advance to next page if any
            };


    // compute fill percent (you can change formula as desired)
    const fill = Math.round((progress / total) * 100);
     console.log(total);
     console.log(progress);
     console.log(fill);



  // like a variable to represent chosen page
  const CurrentPage = pages[currentIndex].component;

    // quizzended state has changeed to true
    //hence end game
    useEffect(() => {
        if (quizEnded) {

            //assign a unique ID 
            const uniqueId = uuidv4();

            //join up the data for history
              //download what you don't have from sessionStorage 
              const q1_yourAns =sessionStorage.getItem('yourAns1');
              const q1_correctAns =sessionStorage.getItem('rightTeam');
              const q2_yourAns =sessionStorage.getItem('yourAns2');
              const q2_correctAns =sessionStorage.getItem('rightLogo');
              const logoFor =sessionStorage.getItem('logoFor');
              const Username_InLocalStorage = localStorage.getItem('username') || '';
              //then combine with what i have to
               //create json of what i need
                const assembledData= {
                    username: Username_InLocalStorage,
                    Category: 'Football',
                    questions:[
                        {
                        Q1:'Choose the Bundesliga Team',
                            Q1_correctAns:q1_correctAns,
                            Q1_yourAns:q1_yourAns
                        },
                        {
                        Q2:'Choose the correct Logo for '+logoFor,
                            Q2_correctAns:q2_correctAns,
                            Q2_yourAns:q2_yourAns
                        }
                    ],
                    Score:score,
                    Total:total,
                    uniqueId:uniqueId
                };

            //save to state
            setData(assembledData);

            //then save this data to local storage
            //check if existing or start afresh 
            const historyData = JSON.parse(localStorage.getItem('historyData')) || [];
            //Add new game result(latest at the top)
            historyData.unshift(assembledData);
            //save updated history back
            //stringify..local storage only stores strings
            localStorage.setItem('historyData',JSON.stringify(historyData));

            //clear session storage in prep for next round
            sessionStorage.clear();

             //dont save to mongo if tey are just a guest
            if(Username_InLocalStorage !== 'Guest'){

                //save to mongoDB
                const saveToMongo = async () => {
                    try{
                        const response = await fetch('http://localhost:5000/save_history', {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(assembledData)
                        });

                        if (!response.ok) {
                            console.error('Failed to save history:', response.statusText);
                        } else {
                            console.log('frontEndSays :Saved to MongoDB successfully');
                        }
                    }catch(err){
                        console.log('error sending data to backend',err);
                    }
                };

                //initialise
                saveToMongo(assembledData);
            }
            else{
                    console.log("We won't save history for a guest");
                }

            //navigate to last page
            navigate("/tamati", { state: { score, total} });
        }
    }, [quizEnded, score]);


        return (
                <>
                
                    {/* everything-container */}
                    <div className="bg-bgMobile sm:bg-bgSm md:bg-bgMd lg:bg-bgLg  bg-cover bg-center w-full flex flex-col justify-end items-center flex-wrap pt-4">

                        {/* //Progress bar */}
                        <ProgressBar fill={fill} className />

                        {/* quiz-container */}
                        <div className=" w-[90%] h-[90%] rounded-xl flex flex-col bg-white/15 justify-center items-center p-2">
                                {/* //Represent your current page
                                //Which will be chosen according to index */}
                                <CurrentPage onNext={goNext} onScoreChange={updateScore} />

                        </div>
      
                    </div>
                </>
            
        );
}