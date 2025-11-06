 import './QuizzPage.css';
    import {Link} from 'react-router-dom';
    import {useNavigate} from 'react-router-dom';
    import {useState,useEffect} from 'react';

   export default function Skeleton4({ onNext,onScoreChange}){

        // Create a navigation const
        const navigate = useNavigate();


        // Declare constants
        const [countries, setCountries] = useState([]); //bundesliga teams
        const [openingStatement, setOpeningStatement] = useState('The following are infos about a certain country');
        const [mainQuestion, setMainQuestion] = useState('Which City among the following is the countries Capital');

        //handle clicking
        const [clickedCity, setClickedCity] = useState({}); // track clicked flags
        const [isAnswered, setIsAnswered] = useState(false); 
        
        //for pexels images
        const [imageUrl, setImageUrl] = useState("");
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        //for selected country
        const [selectedCountry,setSelectedCountry]= useState({});
        const [selectedCountryName,setSelectedCountryName] = useState("");
        const [selectedCountryCity, setSelectedCountryCity] = useState({});

        //for other flags
        const [otherCities, setOtherCities] = useState([]);

        //combined flags
        const [wrongAndCorrectCities, setWrongAndCorrectCities] = useState([]);

            
        //for fetching
        const apiUrl = import.meta.env.VITE_API_URL;



        useEffect(() => {
            const fetchCountries = async () => {
                try {
                // 1️⃣ Check cache
                const cached = localStorage.getItem("countriesData");
                const cachedTime = localStorage.getItem("countriesDataTime");
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;

                let extractedCountries = [];

                // Helper function to initialize game logic
                const setupGame = (countries) => {
                    setCountries(countries);

                    // Pick random country
                    const randomIndex = Math.floor(Math.random() * countries.length);
                    const randomCountry = countries[randomIndex];
                    setSelectedCountry(randomCountry);
                    setSelectedCountryName(randomCountry.name);

                    // Set the right city
                    const rightCity = randomCountry.city;
                    setSelectedCountryCity(rightCity);
                    //for hisory
                      sessionStorage.setItem("rightCapital", rightCity);

                    // Pick 3 random wrong cities
                    const otherCts = countries
                    .filter((item) => item.city !== randomCountry.city)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((item) => item.city);

                    setOtherCities(otherCts);
                    setWrongAndCorrectCities([...otherCts, rightCity].sort(() => Math.random() - 0.5));
                };

                // 2️⃣ Use cache if still fresh
                if (cached && cachedTime && now - cachedTime < oneDay) {
                    console.log("🟢 Using cached countries data");
                    extractedCountries = JSON.parse(cached);
                    setupGame(extractedCountries);
                } else {
                    console.log("🔵 Fetching new data from API...");
                    const res = await fetch(`${apiUrl}/api/countries`);
                    const data = await res.json();

                    // 4️⃣ Process and clean data
                    extractedCountries = data
                    .sort(() => Math.random() - 0.5)
                    .map((item) => ({
                        name: item.name?.official || "Unknown",
                        currency: item.currencies
                        ? Object.values(item.currencies)
                            .map((c) => c.name)
                            .join(", ")
                        : "N/A",
                        city: item.capital?.[0] || "N/A",
                        region: item.region || "N/A",
                        area: item.area || "N/A",
                        languages: item.languages
                        ? Object.values(item.languages).join(", ")
                        : "N/A",
                        landlocked: item.landlocked || false,
                        bordering_countries: item.borders || [],
                        population: item.population || "N/A",
                        flag: item.flags?.png || item.flags?.svg || "",
                        maps: item.maps || {},
                    }));

                    // 5️⃣ Cache it
                    localStorage.setItem("countriesData", JSON.stringify(extractedCountries));
                    localStorage.setItem("countriesDataTime", Date.now().toString());

                    // 6️⃣ Setup game logic
                    setupGame(extractedCountries);
                }
                } catch (err) {
                console.error("Error fetching countriesData:", err);
                }
            };

            fetchCountries();
            }, []);



        //where i set a selected country to work with
           



        useEffect(() => {
            if (!selectedCountryName) return; // wait until countryName exists
             console.log(`country name is:`,selectedCountryName);// see its name
             console.log(`country name is:`,selectedCountry);// see its name

             console.log(`country capital Link is:`,selectedCountryCity);
             console.log(`other capitals are:`,otherCities);
             console.log(`combined cities are:`,wrongAndCorrectCities);

            setLoading(true);
            fetch(`${apiUrl}/api/countryImage/${encodeURIComponent(selectedCountryName)}`)
                .then(res => res.json())
                .then(data => {
                if (data.image) {
                    setImageUrl(data.image);
                } else {
                    setError("No image found");
                }
                })
                .catch(err => {
                console.error("Error fetching country image:", err);
                setError("Failed to load image");
                })
                .finally(() => setLoading(false));
        }, [selectedCountryName]);




        // if (loading) return <p>🌀 Loading image...</p>;
        // if (error) return <p className="text-red-500">{error}</p>;



            //Evaluating answer
            const evaluateAnswer = (city,index)=>{
               
                if (city.includes(selectedCountryCity)) {
                    // correct flag
                    setClickedCity(prev => ({ ...prev, [index]: "correct" }));
                    //sessionStorage for history
                     sessionStorage.setItem('yourAns2',city);

                    //update score
                    onScoreChange();
                
                } 
                else {
                    // wrong team
                    setClickedCity(prev => ({ ...prev, [index]: "wrong" }));
                    //sessionStorage for history
                     sessionStorage.setItem('yourAns2',city);
                     sessionStorage.setItem('capitalFor',selectedCountryName);

                }
               
                //disable buttons
                setIsAnswered(true);
                 onNext();
               
            };

            //i want to see click state on console
             useEffect(() => {
                  console.log("Clicked teams state:", clickedCity);
            }, [clickedCity]);


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
                        <div className=" transition-opacity duration-700 ease-in-out opacity-100 bg-white p-2 m-2 w-full rounded shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-around items-center">


                            {/* page heading */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex justify-center '>
                                    <p tabIndex={0} className='openingStatement font-play text-md sm:text-lg md:text-xl lg:text-2xl '>{openingStatement}</p>
                                </div>


                            {/*  Questions n pic container */}
                                <div className='leadingQuestionsNimage bg-gray-100 p-2 m-2  w-[90%] flex flex-col lg:flex-row  '>
                                   
                                        {/* image box */}
                                                <div className='flex flex-col items-center lg:items-start  '>
                                                    {/* image */}
                                                    <div className='flex justify-center items-center p-2 m-2 w-full lg:w-[70%]   '>
                                                         <img
                                                            src={imageUrl }
                                                            alt={`Beautiful view of ${selectedCountry.name}`} 
                                                            className="object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                </div> 

                                                {/* leaading info */}
                                        
                                                <div 
                                                    className='flex justify-start items-center p-2  m-2  w-full lg:w-1/3 '
                                                    style={{flexWrap:"wrap"}}
                                                >
                                                        <li tabIndex={0} className='font-play text-md sm:text-lg md:text-xl lg:text-xl'>
                                            
                                                           <p><strong>{selectedCountry.name}</strong></p>
                                                            <p>region: {selectedCountry.region}</p>
                                                            {/* <p>Capital city: {selectedCountry.city}</p> */}
                                                            {/* <p>borders: {selectedCountry.bordering_countries}</p> */}
                                                            <p>languages: {selectedCountry.languages}</p>
                                                            <p>population: {selectedCountry.population}</p>
                                                            <p>area: {selectedCountry.area} </p>
                                                            <p>currency: {selectedCountry.currency}</p>
                                                            
                                                        </li>
                                                </div>
                                                        
                                                           
                                            
                                </div>


                            {/* Box with Main Question and choices */}
                                <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex flex-col justify-around'>
                                    {/*Main Question */}
                                        <p tabIndex={0} className='TheMainQuestion p-2 m-2 p-2 m-2 font-play text-md sm:text-lg md:text-xl lg:text-2xl '>{mainQuestion}</p> 

                                    {/* Multiple choices */}
                                        <div className="buttonContainer bg-gray-100 flex p-3 ">
                                            {/* buttons--choices */}
                                                {/* Wrong & right choices-3&1*/}
                                                    {/* Wrong & right choices-3&1*/}
                                                    {wrongAndCorrectCities.map((city,index)=>(
                                                        <button 
                                                            key={index}
                                                            onClick={()=> evaluateAnswer(city,index)}
                                                            disabled={isAnswered}

                                                            //check if button is clicked & change colour respectively
                                                            className={ 
                                                                `flex items-center justify-center text-center break-words whitespace-normal
                                                                p-3 m-2 rounded-lg text-black border border-gray-300 shadow-lg hover:shadow-2xl
                                                                transition-all duration-300 ease-in-out
                                                                w-[45%] sm:w-[40%] md:w-[30%] lg:w-[25%]
                                                                text-[0.7rem] sm:text-[0.9rem] md:text-[1.1rem] lg:text-[1.3rem]
                                                                font-play 
                                                                ${clickedCity[index] === 'correct' ? 'bg-broGreen' :  
                                                                clickedCity[index] === 'wrong' ? 'bg-broRed' : 
                                                                'bg-white'}`}
                                                        >
                                                         
                                                                {city}

                                                        </button>
                                                    ))}
                                                    
                                        </div>

                            </div>



                            {/* page number */}
                            <div className='bg-white p-2 m-2 w-[90%] rounded-lg shadow-lg hover:shadow-xl rounded-lg transition-shadow duration-300 flex justify-center'>
                                <p>Question 2 of 2</p>
                            </div>


                        </div>
                  
                </>
            );
    }


            
               
                        


                           
                                                           
                                                        
                                                 