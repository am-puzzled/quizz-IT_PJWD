    //require variables
    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const dotenv = require("dotenv");


    //Load .env variables
    dotenv.config();


    // initialize express app
    const app = express();
    app.use(express.json());


    //fix cors issue
    const allowedOrigins = [
        'https://quizz-it-lan.netlify.app', // your frontend
        'http://localhost:5173' // optional: local frontend during dev
    ];

    app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin like mobile apps or curl
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
    }));


                            /////// // MONGODB SECTION // /////////

    //connect to mongoDB
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log('connection to mongoDB ATLAS was successful')
        console.log("   Database name:", mongoose.connection.name);
        console.log("   Collections available:", Object.keys(mongoose.connection.collections));

    })
    .catch((err)=> console.log('connection to mongoDB ATLAS Failed', err) );


    //create a schema
            // questions schema --will be used by the next schema
            const QuestionGroupSchema = new mongoose.Schema({
                    Q1: String,
                    Q1_correctAns: String,
                    Q1_yourAns: String,
                    Q2: String,
                    Q2_correctAns: String,
                    Q2_yourAns: String,
            }, {_id:false});
        //combine all results into one schema
        const assembledQuizzData_Schema = new mongoose.Schema({
            Category: String,
            Score: Number,
            Total: Number,
            uniqueId: String,
            questions: [QuestionGroupSchema],
            // createdAt: { type: Date, default: Date.now }, //time stamp
        }); 

    //  User Schema (final) --everything into one final schema
    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        history: [assembledQuizzData_Schema], // use same schema for both
        favourites: [assembledQuizzData_Schema] // use same schema for both
    });


    //create a model    ( like telling a builder, hey--use this blue print to build me a user called user using ..)
    const User = mongoose.model('User',UserSchema);


    //save history on mongo
    app.post("/save_history", async (req, res) => {
        const { username, Category, questions, Score, Total, uniqueId } = req.body;
        console.log("Received from frontend:", req.body);

        try {
            const user = await User.findOneAndUpdate(
            { username },
            { $push: { history: { $each:[{Category, questions, Score, Total, uniqueId }], $position:0 } } }, //position 0..works like unshift..places at the beginning
            { new: true, upsert: true } //upsert creates one if none existed
            );

            res.status(200).json({ message: "History saved!", user });
        } catch (err) {
            console.error("❌ Mongo error:", err);
            res.status(500).json({ error: "Failed to save history", details: err });
        }
    });


    //adding a favourite to mongo
    app.post("/add_favourite", async (req, res) => {
        const { username, favouriteItem } = req.body;

        try {
            const user = await User.findOneAndUpdate(
            { username },
            { $addToSet: { favourites: favouriteItem } }, // prevents duplicates
            { new: true, upsert: true }
            );

            res.status(200).json({ message: "Favourite added", user });
        } catch (err) {
            console.error("❌ Mongo error (add_favourite):", err);
            res.status(500).json({ error: "Failed to add favourite" });
        }
    });


    //removing a favourite from momgo
    app.post("/remove_favourite", async (req, res) => {
        const { username, favId } = req.body;

        try {
            const user = await User.findOneAndUpdate(
            { username },
            { $pull: { favourites: { uniqueId: favId } } },
            { new: true }
            );

            res.status(200).json({ message: "Favourite removed", user });
        } catch (err) {
            console.error("❌ Mongo error (remove_favourite):", err);
            res.status(500).json({ error: "Failed to remove favourite" });
        }
    });


    // Fetch user by username
    app.get("/get_user/:username", async (req, res) => {
        const { username } = req.params;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({ user });
        } catch (err) {
            console.error("❌ Mongo error (get_user):", err);
            res.status(500).json({ error: "Failed to fetch user data" });
        }
    });

    

                                    //////// // API SECTION // /////////


     //API KEY
    const apiKey = process.env.x_apisports_key;
    const apiKeyPexels = process.env.PEXELS_API_KEY ;

    //fetch bundesligateams data from the openligadb--API
    app.get('/api/bundesligateams', async (req,res)=>{
        try {
            const response = await fetch('https://www.openligadb.de/api/getavailableteams/bl1/2025');
            const data = await response.json();

            // send the data to frontend
        res.json(data);
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    });

       //fetch  bundesligaTeams from apisports--API
    app.get('/api/bundesligaTeamsApisports', async (req,res)=>{
        try {
            const response = await fetch("https://v3.football.api-sports.io/teams?league=78&season=2023", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apisports-key":  apiKey,
                }
             });

        const data = await response.json();
            // send the data to frontend
        res.json(data);
        } catch (error) {
            console.error('Error fetching teams/data from api--sport :', error);
            res.status(500).json({ error: 'Failed to fetch teams' });
        }
    });


    //fetch eufa teams from the openligadb-API
    app.get('/api/allteams', async (req,res)=>{
        try {
            const response = await fetch('https://www.openligadb.de/api/getavailableteams/PL/2010');
            const data = await response.json();

            // send the data to frontend
        res.json(data);
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    });


      //fetch  englishteams from apisports--API
    app.get('/api/englishTeams', async (req,res)=>{
        try {
            const response = await fetch("https://v3.football.api-sports.io/teams?league=39&season=2023", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-apisports-key":  apiKey,
                }
             });

        const data = await response.json();
            // send the data to frontend
        res.json(data);
        } catch (error) {
            console.error('Error fetching teams/data from api--sport :', error);
            res.status(500).json({ error: 'Failed to fetch teams' });
        }
    });


     //fetch countries data from  restcountries--API
    app.get('/api/countries', async (req,res)=>{
        try {
            const response = await fetch('https://restcountries.com/v3.1/region/europe');
            const data = await response.json();

            // send the data to frontend
        res.json(data);
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    });


    //fetch counryimages from pexels
   app.get('/api/countryImage/:name', async (req, res) => {
        const name = req.params.name;

        try {
            // descriptive, visually appealing keywords
            const keywordsArray = ["nature", "scenery", "mountains", "beach", "coastline", "valley", "forest"];
            const randomExtras = keywordsArray.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ");


            const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(name + " " + randomExtras)})}&orientation=landscape&per_page=1`,
            {
                headers: {
                Authorization: apiKeyPexels,
                },
            }
            );

            const data = await response.json();
            const imageUrl = data.photos?.[0]?.src?.large || null;

            res.json({ image: imageUrl });
        } catch (error) {
            console.error("Error fetching image:", error);
            res.status(500).json({ error: "Failed to fetch image" });
        }
    });


    //fetch teamimages from pexels
   app.get('/api/teamImage/:name', async (req, res) => {
        const name = req.params.name;

        try {
            // descriptive, visually appealing keywords
            const keywordsArray = ["FC", "FootballClub"];
            const randomExtras = keywordsArray.sort(() => 0.5 - Math.random()).slice(0, 3).join(" ");


            const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(name + " " + randomExtras)}&orientation=landscape&per_page=1`,

            {
                headers: {
                Authorization: apiKeyPexels,
                },
            }
            );

            const data = await response.json();
            const imageUrl = data.photos?.[0]?.src?.large || null;

            res.json({ image: imageUrl });
        } catch (error) {
            console.error("Error fetching image:", error);
            res.status(500).json({ error: "Failed to fetch image" });
        }
    });



    // --- Start server ---
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
