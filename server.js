const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const apiClient = require("./api/apiClient");

// Import Router
const heroRoutes = require("./routes/heroRoutes")

// MIDDLEWARE
let previousPage = "None";
app.use((req, res, next)=>{
    console.log("I - your middleware. Run on all routes!");
    console.log(
        `you just left ${previousPage}, you are now on ${req.path}`
    );
    previousPage = req.path;
    next(); 
});

const movies = [
    "Training Day",
    "Sound of Music",
    "The Fast and the Furious",
    "Rush Hour 2",
    "The Matrix",
    "Dirty Dancing",
    "Spider-Man",
    "Dark Knight",
    "Chicago",
    "Dancing in the Rain",
    "Top Gun",
    "Norbit",
    "Pitch Perfect",
    "Taladega Nights",
];

const books = [
    "The Alechemist",
    "Falling Up",
    "The Last Ronin"
];

app.get("/test", (req, res) => {
    res.send("Testing testing...")
});

app.get("/movies", (req, res) => {
    res.send(movies)
});

app.get("/movies/:id", (req, res) => {
    res.send(movies[req.params.id])
    console.log(req.params)
});

app.get("/books", (req, res) => {
    res.send(books)
});

app.get("/books/:id", (req, res) => {
    res.send(books[req.params.id])
    console.log(req.params)
});

app.get('/users', async (req, res) => {
    try {
        const response = await apiClient.get("/users");

        const transformedUserData = response.data.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
        }));

        res.json(transformedUserData)

    } catch (error) {

        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            res.status(error.response.status).json({ message: 'Error fetching data from external API.' });
        } else {
            console.error('Network Error:', error.message);
            res.status(500).json({ message: 'A network error occurred.' });
        }
    }

});

app.get("/api/pokemon", async (req, res) => {

    try {
        const apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

        if (!apiResponse.ok) {
            throw new Error(`HTTP request ERROR! Status: ${apiResponse.status}`)
        }

        const data = await apiResponse.json();

        const transformedPokeData = data.results.map((pokemon, index) => ({
            id: index + 1,
            name: pokemon.name,
        }));

        res.json(transformedPokeData)


    } catch (error) {
        console.error("Issue Fetching pokemon: ", error)

        res.status(500).json({
            message: "You failed to fetch the pokemon!"
        });
    }

});

app.get("/api/pokemon/:name", async (req, res) => {
    try {

        const pokemonName = req.params.name;

        const pokeApiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

        if (!pokeApiResponse.ok) {
            throw new Error(`HTTP request ERROR! Status: ${pokeApiResponse.status}`)
        }

        const pokemon = await pokeApiResponse.json();

        const transformedPokemonData = {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            abilities: pokemon.abilities.map(ability => ability.ability.name),
            image: pokemon.sprites.front_default
        }

        res.json(transformedPokemonData);

    } catch (error) {
        console.error("Issue Fetching Individual Pokemon: ", error)

        res.status(500).json({
            message: "You failed to fetch the pokemon!"
        });
    }

});

// //////////////////////
// HERO ROUTE CONTENT
// //////////////////////

app.use("/", heroRoutes)

// //////////////////////
// HERO ROUTE CONTENT ENDS
// //////////////////////

app.get("/api/dragonball/characters", async (req, res) => {

    try {

        const apiResponse = await fetch(
            "https://dragonball-api.com/api/characters"
        );

        if (!apiResponse.ok) {
            throw new Error(
                `HTTP request ERROR! Status: ${apiResponse.status}`
            );
        }

        const data = await apiResponse.json();

        const transformedCharacters = data.items.map(character => ({
            id: character.id,
            name: character.name,
            race: character.race,
            gender: character.gender,
            ki: character.ki,
            maxKi: character.maxKi,
            affiliation: character.affiliation,
            image: character.image
        }));

        res.json(transformedCharacters);

    } catch (error) {

        console.error("Issue Fetching Characters:", error);

        res.status(500).json({
            message: "Failed to fetch Dragon Ball characters!"
        });
    }
});

app.get("/api/dragonball/characters/:name", async (req, res) => {

    try {

        const characterName = req.params.name.toLowerCase();

        const apiResponse = await fetch(
            "https://dragonball-api.com/api/characters"
        );

        if (!apiResponse.ok) {
            throw new Error(
                `HTTP request ERROR! Status: ${apiResponse.status}`
            );
        }

        const data = await apiResponse.json();

        const character = data.items.find(
            character =>
                character.name.toLowerCase() === characterName
        );

        if (!character) {
            return res.status(404).json({
                message: "Character not found!"
            });
        }

        const transformedCharacter = {
            id: character.id,
            name: character.name,
            race: character.race,
            gender: character.gender,
            ki: character.ki,
            maxKi: character.maxKi,
            affiliation: character.affiliation,
            image: character.image
        };

        res.json(transformedCharacter);

    } catch (error) {

        console.error("Issue Fetching Character:", error);

        res.status(500).json({
            message: "Failed to fetch Dragon Ball character!"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`)
})