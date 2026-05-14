// DEPENDANCIES
const express = require("express"); // Express needs to be present where routes exist!
const router = express.Router();

// ROUTES
router.get("/api/heroes", async (req, res)=>{

    try{
        const heroApiResponse = await fetch("https://akabab.github.io/superhero-api/api/all.json");
        
        if (!heroApiResponse.ok){
            throw new Error(`HTTP request ERROR! Status: ${heroApiResponse.status}`) 
        }

        const heroes = await heroApiResponse.json();

        const transformedHeroData = heroes.slice(0, 9).map(hero=>({
            id: hero.id,
            name: hero.name,
            fullName: hero.biography.fullName,
            publisher: hero.biography.publisher,
            intelligence: hero.powerstats.intelligence,
            image: hero.images.sm,
        }));

        res.json(transformedHeroData);

    } catch(error){
        console.error("Issue Fetching Heroes: ", error)

        res.status(500).json({
            message: "You failed to fetch hero data!"
        });
    }
});

router.get("/api/heroes/:id", async (req, res) => {

    try {

        const heroId = parseInt(req.params.id);

        const heroApiResponse = await fetch(
            "https://akabab.github.io/superhero-api/api/all.json"
        );

        if (!heroApiResponse.ok) {
            throw new Error(
                `HTTP request ERROR! Status: ${heroApiResponse.status}`
            );
        }

        const heroes = await heroApiResponse.json();

        const hero = heroes.find(hero => hero.id === heroId);

        if (!hero) {
            return res.status(404).json({
                message: "Hero not found!"
            });
        }

        const transformedHero = {
            id: hero.id,
            name: hero.name,
            fullName: hero.biography.fullName,
            publisher: hero.biography.publisher,
            intelligence: hero.powerstats.intelligence,
            image: hero.images.sm,
        };

        res.json(transformedHero);

    } catch (error) {

        console.error("Issue Fetching Hero:", error);

        res.status(500).json({
            message: "Failed to fetch hero data!"
        });
    }
});

router.get("/api/heroes/name/:name", async (req, res) => {

    try {

        const heroName = req.params.name.toLowerCase();

        const heroApiResponse = await fetch(
            "https://akabab.github.io/superhero-api/api/all.json"
        );

        if (!heroApiResponse.ok) {
            throw new Error(
                `HTTP request ERROR! Status: ${heroApiResponse.status}`
            );
        }

        const heroes = await heroApiResponse.json();

        const hero = heroes.find(
            hero => hero.name.toLowerCase() === heroName
        );

        if (!hero) {
            return res.status(404).json({
                message: "Hero not found!"
            });
        }

        const transformedHero = {
            id: hero.id,
            name: hero.name,
            fullName: hero.biography.fullName,
            publisher: hero.biography.publisher,
            intelligence: hero.powerstats.intelligence,
            image: hero.images.sm,
        };

        res.json(transformedHero);

    } catch (error) {

        console.error("Issue Fetching Hero:", error);

        res.status(500).json({
            message: "Failed to fetch hero data!"
        });
    }
});

module.exports = router;