    //imports
    import './QuizzPage.css';
    import {Link} from 'react-router-dom';
    import {useNavigate} from 'react-router-dom';
    import {useState,useEffect} from 'react';

    export default function Skeleton2({ onNext,onScoreChange}){

        // Create a navigation const
        const navigate = useNavigate();


        // Declare constants
        const [teams, setTeams] = useState([]); //bundesliga teams
        const [openingStatement, setOpeningStatement] = useState('The following are infos about a certain team');
        const [mainQuestion, setMainQuestion] = useState('Which one among the following is the team logo');

        //handle clicking(colour change)
        const [clickedLogo, setClickedLogo] = useState({}); // track clicked flags
        const [isAnswered, setIsAnswered] = useState(false); 


        //for pexels images
        const [imageUrl_PEXELS, setImageUrl_PEXELS] = useState("");//from internet
        const [imageUrl_API, setImageUrl_API] = useState("");//from API
        const [mixedImages, setMixedImages] = useState([]); //mix the above two
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        //for selected team
        const [selectedTeam,setSelectedTeam]= useState({});
        const [selectedTeamName,setSelectedTeamName] = useState("");
        const [selectedTeamLogo, setSelectedTeamLogo] = useState({});

        //for other flags
        const [otherLogos, setOtherLogos] = useState([]);

        //combined flags
        const [wrongAndCorrectLogos, setWrongAndCorrectLogos] = useState([]);


         useEffect(() => {
            const fetchTeams = async () => {
            try {
                // 1️⃣ Check cache
                const cached = localStorage.getItem("englishTeams");
                const cachedTime = localStorage.getItem("englishTeamsTime");
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                let extractedTeams = [];

                if (cached && cachedTime && now - cachedTime < oneDay) {
                console.log("🟢 Using cached English teams data");
                extractedTeams = JSON.parse(cached);
                } else {
                console.log("🔵 Fetching new data from API...");
                const res = await fetch("http://localhost:5000/api/englishTeams");
                const data = await res.json();

                extractedTeams = data.response
                    .filter(
                    (item) =>
                        item.team.id !== 47 && item.team.id !== 39 && item.team.id !== 55
                    )
                    .sort(() => Math.random() - 0.5)
                    .map((item) => ({
                    id: item.team.id,
                    name: item.team.name,
                    country: item.team.country,
                    city: item.venue.city,
                    venue: item.venue.name,
                    capacity: item.venue.capacity,
                    founded: item.team.founded,
                    logo: item.team.logo,
                    image: item.venue.image,
                    }));

                // Cache the result
                localStorage.setItem("englishTeams", JSON.stringify(extractedTeams));
                localStorage.setItem("englishTeamsTime", Date.now().toString());
                }

                setTeams(extractedTeams);

                // Pick a random team
                pickRandomTeam(extractedTeams);
            } catch (err) {
                console.error("Error fetching English teams:", err);
            }
            };

            fetchTeams();
        }, []);

        const pickRandomTeam = (teamsArray) => {
            if (!teamsArray || teamsArray.length === 0) return;

            const randomIndex = Math.floor(Math.random() * teamsArray.length);
            const randomTeam = teamsArray[randomIndex];

            setSelectedTeam(randomTeam);
            setSelectedTeamName(randomTeam.name);
            setSelectedTeamLogo(randomTeam.logo);
            //for histtory
              sessionStorage.setItem("rightLogo", randomTeam.logo);
              sessionStorage.setItem("logoFor", randomTeam.name);

            // Pick 3 wrong logos
            const otherLgs = teamsArray
            .filter((item) => item.logo !== randomTeam.logo)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((item) => item.logo);

            setOtherLogos(otherLgs);

            // Combine correct + wrong logos and shuffle
            setWrongAndCorrectLogos([...otherLgs, randomTeam.logo].sort(() => Math.random() - 0.5));

            //STADIUM IMAGE FROM API
            setImageUrl_API(randomTeam.image);
        };


        useEffect(() => {
            if (!selectedTeamName) return; // wait until countryName exists
             console.log(`team name is:`,selectedTeamName);// see its name
             console.log(`team info is:`,selectedTeam);// see its name

             console.log(`team logo Link is:`,selectedTeamLogo);
             console.log(`other logo links are:`,otherLogos);
             console.log(`combined logos are:`,wrongAndCorrectLogos);

            setLoading(true);
            fetch(`http://localhost:5000/api/teamImage/${encodeURIComponent(selectedTeamName)}`)
                .then(res => res.json())
                .then(data => {
                if (data.image) {
                    setImageUrl_PEXELS(data.image);
                } else {
                    setError("No image found");
                }
                })
                .catch(err => {
                console.error("Error fetching team image:", err);
                setError("Failed to load image");
                })
                .finally(() => setLoading(false));
        }, [selectedTeamName]);


         //i want to mix imge urls
            useEffect(() => {
                  // Only run when both sources are ready
                    if (!imageUrl_PEXELS || !imageUrl_API) return;

                    const combined = [
                        imageUrl_PEXELS, // from pexels
                        imageUrl_API, // from backend API
                    ];

                // Shuffle the array
                const randomized = combined.sort(() => Math.random() - 0.5);

                setMixedImages(randomized);

            }, [imageUrl_API,imageUrl_PEXELS]);


            
            //Evaluating answer
            const evaluateAnswer = (logo,index)=>{
               
                if (logo.includes(selectedTeamLogo)) {
                    // correct flag
                    setClickedLogo(prev => ({ ...prev, [index]: "correct" }));
                    //sessionStorage for history
                     sessionStorage.setItem('yourAns2',logo);

                    //update score
                    onScoreChange();
                
                } 
                else {
                    // wrong team
                    setClickedLogo(prev => ({ ...prev, [index]: "wrong" }));
                    //sessionStorage for history
                     sessionStorage.setItem('yourAns2',logo);
                }
               
                //disable buttons
                setIsAnswered(true);
                 onNext();
               
            };




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
                        {/* Create a card */}
                        <div className="transition-opacity duration-700 ease-in-out opacity-100 bg-white p-2 m-2 w-full rounded shadow-lg hover:shadow-xl h-full transition-shadow duration-300 flex flex-col justify-around items-center">


                            {/* page heading */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex justify-center '>
                                    <p tabIndex={0} className='openingStatement font-play text-md sm:text-lg md:text-xl lg:text-2xl'>{openingStatement}</p>
                                </div>


                            {/*  Questions n pic container */}
                                <div className='leadingQuestions bg-gray-100 p-2 m-2  w-[90%] flex flex-col lg:flex-row  '>
                                  

                                        {/* image box */}
                                                <div className='flex flex-col items-center lg:items-start  '>
                                                    {/* image */}
                                                    <div className='flex justify-center items-center p-2 m-2 w-full lg:w-[70%]   '>
                                                         {mixedImages
                                                            .slice(0,1) //choose only one
                                                            .map((img,index)=>(
                                                                    <img
                                                                        src={img}
                                                                        key={index}
                                                                        alt={`Beautiful view of ${selectedTeam.name} stadium`} 
                                                                        className="object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
                                                                    />
                                                         ))}
                                                    </div>
                                                </div> 

                                                <div 
                                                        className='flex justify-start items-center p-2  m-2  w-full lg:w-1/3 '
                                                        style={{flexWrap:"wrap"}}
                                                    >
                                                        <li tabIndex={0} className='font-play text-md sm:text-lg md:text-xl lg:text-xl'>
                                               
                                                            <p><strong>{selectedTeam.name}</strong></p>
                                                            <p>country: {selectedTeam.country}</p>
                                                            {/* <p>Capital city: {selectedCountry.city}</p> */}
                                                            {/* <p>borders: {selectedCountry.bordering_countries}</p> */}
                                                            <p>city: {selectedTeam.city}</p>
                                                            <p>venue: {selectedTeam.venue}</p>
                                                            <p>capacity: {selectedTeam.capacity} </p>
                                                            <p>founded: {selectedTeam.founded}</p>
                                                            {/* <img className='p-2 m-2 bg-white w-[30%] h-[30%]'>Flag: {selectedCountry.flag}</img> */}
                                                               
                                                         </li>
    
                                                </div>         
                                            
                                </div>


                            {/* Box with Main Question and choices */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex flex-col justify-around'>
                                    {/*Main Question */}
                                        <p tabIndex={0} className='TheMainQuestion p-2 m-2 font-play text-md sm:text-lg md:text-xl lg:text-2xl'>{mainQuestion}</p> 

                                    {/* Multiple choices */}
                                        <div className="buttonContainer bg-gray-100 flex p-3 ">
                                            {/* buttons--choices */}
                                                {/* Wrong & right choices-3&1*/}
                                                    {wrongAndCorrectLogos.map((logo,index)=>(
                                                        <button 
                                                            key={index}
                                                            onClick={()=> evaluateAnswer(logo,index)}
                                                            disabled={isAnswered}

                                                            //check if button is clicked & change colour respectively
                                                            className={ 
                                                                `p-3 m-2 rounded-lg border-gray-300 shadow-lg hover:shadow-2xl   w-[30%]  flex items-center justify-center
                                                                ${clickedLogo[index] === 'correct' ? 'bg-broGreen' :  
                                                                clickedLogo[index] === 'wrong' ? 'bg-broRed' : 
                                                                'bg-white'}`}
                                                        >
                                                         
                                                               {<img
                                                                src={logo}
                                                                // alt={`Beautiful view of ${country.name}`} 
                                                                className="object-cover  shadow-md hover:scale-105 transition-transform duration-300"
                                                            />}

                                                        </button>
                                                    ))}
                                                    
                                        </div>

                            </div>

                        </div>
                  
                </>
            );
    }