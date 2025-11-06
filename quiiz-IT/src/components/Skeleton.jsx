
    import './QuizzPage.css';
    // import ProgressBar from './progressBar.jsx';
    import {Link} from 'react-router-dom';
    import {useNavigate} from 'react-router-dom';
    import {useState,useRef,useEffect} from 'react';

   export default function Skeleton({ onNext,onScoreChange}){

        // Create a navigation const
        const navigate = useNavigate();


        // Declare constants
        const [teams, setTeams] = useState([]); //bundesliga teams
        const [wrongTeams, setWrongTeams] = useState([]); //other teams
        const [wrongAndCorrectTeams, setWrongAndCorrectTeams] = useState([]);
        const  [openingStatement, setOpeningStatement] = useState('The following are common bundesliga teams');
        const  [mainQuestion, setMainQuestion] = useState('Which one among the following is a part of the list');

        const [clickedTeams, setClickedTeams] = useState({}); // track clicked buttons
        const [isAnswered, setIsAnswered] = useState(false); 

        const [loading, setLoading] = useState(true);

            
        //for fetching
        const apiUrl = import.meta.env.VITE_API_URL;

        

        useEffect(()=>{
            
            // Fetch team data from backend
            fetch(`${apiUrl}/api/bundesligateams`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend:", data);
                setTeams(data
                    .sort(()=> Math.random() - 0.5) //so we dont have to pick the same teams everytime
                    .map(item => item.teamName)); // extract team names
            })
            .catch(err => console.error("Error:", err));
            

            // Fetch team wrong teams
            fetch(`${apiUrl}/api/allteams`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend:", data);
                setWrongTeams(data.map(item => item.teamName)); // extract city names
            })
            .catch(err => console.error("Error:", err));

        },[]);


        //when teams and wrongTeams are set
        useEffect(()=>{
            //check if arrays are not empty
                if(teams.length && wrongTeams.length){

                    const rightTeam = teams.sort(()=> Math.random() - 0.5)[5];

                    const combined = [
                        ...wrongTeams.sort(()=> Math.random() - 0.5).slice(5, 8),//sort randomly(so we dont have to pick the same teams everytime)
                        rightTeam
                    ];

                    //for histtory
                      sessionStorage.setItem("rightTeam", rightTeam);

                    //shuffle the combined teams(so that they don't appear in the same order everytime)
                    const combinedShuffled = combined.sort(()=> Math.random() - 0.5);
                    
                    console.log(`These are combined: ${combinedShuffled}`);
                    setWrongAndCorrectTeams(combinedShuffled);

                    //then display real content
                    setLoading(false);
                }
        },[teams,wrongTeams]);
       

        //Evaluating answer
        const evaluateAnswer = (team,index)=>{
            //when button is clicked, check if
            //the team contained in it is in bundes tems
            // In js i'd add an eventlistener to each button when clicked, check its contents,
            //if not button colour = brored
            //else green 

            if (teams.includes(team)) {
              // correct team
              setClickedTeams(prev => ({ ...prev, [index]: "correct" }));
              //sessionStorage for history
                sessionStorage.setItem('yourAns1',team);


            //update score
            onScoreChange();
           
          
            } 
            else {
            // wrong team
            setClickedTeams(prev => ({ ...prev, [index]: "wrong" }));
            //sessionStorage for history
              sessionStorage.setItem('yourAns1',team);
            }
            

            // the button cannot be clicked again
            //progress bar =1
    
            setIsAnswered(true);
             onNext();

        };

        useEffect(() => {
  console.log("Clicked teams state:", clickedTeams);
}, [clickedTeams]);

    //loading
         if (loading) {
                return (
                <div className="w-full max-w-[700px] h-screen flex flex-col space-y-4 animate-pulse p-6 m-4 bg-white/10 rounded-xl">
                    <div className="h-6 bg-gray-300/40 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300/40 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300/40 rounded w-4/5"></div>
                    <div className="h-32 bg-gray-300/40 rounded"></div>
                </div>
                );
         }

            return(
                <>
                    {/* progressbar */}
                    {/* < ProgressBar /> */}

                        {/* Create a card */}
                        <div className="transition-opacity duration-700 ease-in-out opacity-100 bg-white p-2 m-2 w-full rounded shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-around items-center">


                            {/* page heading */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex justify-center '>
                                    <p tabIndex={0} className='openingStatement font-play text-md sm:text-lg md:text-xl lg:text-2xl'>{openingStatement}</p>
                                </div>


                            {/* Leading Questions */}
                                <div className='leadingQuestions bg-gray-100 p-2 m-2  w-[90%] flex flex-col  '>
                                    <ul tabIndex={0} className='flex flex-col p-4'>

                                        {/* create a list for the teams */}
                                            {teams
                                            .slice(6,11)                    //choose only five teams
                                            .map((team,index) =>(           //return an array
                                            <li key={index} className='font-play text-md sm:text-lg md:text-xl lg:text-xl'>{team}</li>
                                        ))}
                                    </ul>
                                </div>


                            {/* Box with Main Question and choices */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex flex-col justify-around'>
                                    {/*Main Question */}
                                        <p tabIndex={0} className='TheMainQuestion p-2 m-2 font-play text-md sm:text-lg md:text-xl lg:text-2xl'>{mainQuestion}</p> 

                                    {/* Multiple choices */}
                                        <div className="buttonContainer bg-gray-100 flex p-3 ">
                                            {/* buttons--choices */}
                                                {/* Wrong & right choices-3&1*/}
                                                    {wrongAndCorrectTeams.map((team,index)=>(
                                                        <button 
                                                            key={index}
                                                            onClick={()=> evaluateAnswer(team,index)}
                                                            disabled={isAnswered}

                                                            //check if button is clicked & change colour respectively
                                                            className={ 
                                                                `flex items-center justify-center text-center break-words whitespace-normal
                                                                p-3 m-2 rounded-lg text-black border border-gray-300 shadow-lg hover:shadow-2xl
                                                                transition-all duration-300 ease-in-out
                                                                w-[45%] sm:w-[40%] md:w-[30%] lg:w-[25%]
                                                                text-[0.7rem] sm:text-[0.9rem] md:text-[1.1rem] lg:text-[1.3rem]
                                                                font-play
                                                                ${clickedTeams[index] === 'correct' ? 'bg-broGreen' :  
                                                                clickedTeams[index] === 'wrong' ? 'bg-broRed' : 
                                                                'bg-white'}`}
                                                        >
                                                            {team}

                                                              {/* Hidden live feedback for screen readers */}
                                                                {/* <span className="sr-only" aria-live="assertive">
                                                                    {clickedTeams[index] === 'correct'
                                                                    ? 'Correct! Very Good'
                                                                    : clickedTeams[index] === 'wrong Answer'
                                                                    ? 'Wrong!'
                                                                    : ''}
                                                                </span> */}
                                                        </button>
                                                    ))}
                                                    
                                        </div>

                            </div>

                        </div>
                </>
            );
    }