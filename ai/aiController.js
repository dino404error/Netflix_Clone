const axios = require("axios");
const Movie = require("../../models/Movie");
const Favorite = require("../../models/Favorite");

const netflixAI = async (req, res) => {

    try {

        const { message, conversation = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a message."
            });
        }

        console.log("🎬 Netflix AI Request:", message);
        // ==========================================
// GET USER FAVORITES
// ==========================================

const userId = req.body.userId;

let favoriteMovies = [];

if (userId) {

    const favorites = await Favorite.find({
        userId: userId
    })
    .populate("movieId")
    .lean();

    favoriteMovies = favorites
        .map(favorite => favorite.movieId)
        .filter(Boolean);

    console.log(
        "❤️ User favorite movies:",
        favoriteMovies.map(movie => movie.title)
    );
}

        // ==========================================
        // GET MOVIES
        // ==========================================

        const movies = await Movie.find({})
            .select(
                "title description year duration rating category genre language image"
            )
            .lean();

        console.log(
            `🎬 Movies available for AI: ${movies.length}`
        );

        // ==========================================
        // MOVIE CATALOG
        // ==========================================

        const movieContext = movies.map(movie => ({
            id: movie._id.toString(),
            title: movie.title,
            description: movie.description,
            year: movie.year,
            duration: movie.duration,
            rating: movie.rating,
            category: movie.category,
            genre: movie.genre,
            language: movie.language,
            image: movie.image
        }));

        // ==========================================
        // CONVERSATION HISTORY
        // ==========================================

        const conversationText = conversation
            .map(item => {
                return `${item.role}: ${item.content}`;
            })
            .join("\n");

        // ==========================================
        // AI PROMPT
        // ==========================================

        const fullPrompt = `
You are Netflix AI, the intelligent movie assistant inside a Netflix clone.

Your job is to understand the user's natural-language request and recommend movies ONLY from the provided movie catalog.

USER REQUEST:
${message}

MOVIE CATALOG:
${JSON.stringify(movieContext, null, 2)}

USER'S MY LIST:
${JSON.stringify(
    favoriteMovies.map(movie => ({
        title: movie.title,
        description: movie.description,
        genre: movie.genre,
        category: movie.category,
        rating: movie.rating,
        language: movie.language
    })),
    null,
    2
)}

CONVERSATION HISTORY:
${conversationText}

IMPORTANT RULES:

1. Recommend ONLY movies that exist in the MOVIE CATALOG.
2. NEVER invent movie titles.
3. Always use the EXACT movie title from the catalog.
4. Understand natural language such as:
   - "funny movie"
   - "action movie"
   - "something like Avatar"
   - "something relaxing"
   - "highly rated movie"
   - "short movie"
   - "movie in Hindi"
   - "what should I watch?"
5. Use genre, category, description, rating, duration, language and year when relevant.
6. If the user asks for movies similar to another movie, compare its genre, description, mood and other available information.
7. Recommend between 1 and 4 movies.
8. If the user asks about their My List, use USER'S MY LIST.
9. If the user asks what is in their My List, discuss ONLY movies inside USER'S MY LIST.
10. If the user asks for recommendations from their My List, recommend ONLY movies from USER'S MY LIST.
11. If USER'S MY LIST is empty, clearly tell the user that their My List is empty.
12. Do not claim a movie is in the user's My List unless it actually appears there.
13. Keep the answer short and friendly.
14. Your ENTIRE response MUST be valid JSON.
15. Do NOT use markdown.
16. Do NOT use code fences.
17. Do NOT write anything before or after the JSON.

RETURN EXACTLY:

{
    "answer": "Short friendly explanation",
    "recommendedTitles": [
        "Exact Movie Title"
    ]
}

If nothing matches:

{
    "answer": "I couldn't find a suitable movie in the current catalog.",
    "recommendedTitles": []
}
`;
      const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
        model: "qwen2.5:1.5b",
        prompt: fullPrompt,
        stream: false,
        format: "json"
    }
);

        // ==========================================
        // PARSE JSON
        // ==========================================

       let aiData;

try {

    aiData = JSON.parse(rawResponse);

} catch (parseError) {

    console.log("⚠️ AI did not return JSON.");
    console.log("🔧 Using fallback movie matching...");

    // ==========================================
    // FALLBACK MATCHING
    // ==========================================

   // ==========================================
// MY LIST FALLBACK
// ==========================================

const userText = message.toLowerCase();

const isMyListRequest =
    userText.includes("my list") ||
    userText.includes("mylist") ||
    userText.includes("from my list") ||
    userText.includes("in my list");

if (isMyListRequest) {

    console.log("❤️ My List request detected");

    if (favoriteMovies.length === 0) {

        return res.json({
            success: true,
            answer: "Your My List is currently empty. Add some movies and I'll help you choose what to watch!",
            movies: []
        });

    }

    // Return movies actually present in user's My List
    const myListMovies = favoriteMovies.slice(0, 4);

    return res.json({
        success: true,
        answer: "Here are some movies from your My List that you might enjoy:",
        movies: myListMovies
    });

}

    let fallbackMovies = movies.filter(movie => {

        const searchableText = `
            ${movie.title || ""}
            ${movie.description || ""}
            ${movie.genre || ""}
            ${movie.category || ""}
            ${movie.language || ""}
        `.toLowerCase();

        return userText
            .split(" ")
            .some(word =>
                word.length > 3 &&
                searchableText.includes(word)
            );

    });

    // If AI didn't understand "funny", use
    // movies whose description/genre contains comedy/funny

    if (
        userText.includes("funny") ||
        userText.includes("comedy") ||
        userText.includes("comedic")
    ) {

        fallbackMovies = movies.filter(movie => {

            const text = `
                ${movie.title || ""}
                ${movie.description || ""}
                ${movie.genre || ""}
                ${movie.category || ""}
            `.toLowerCase();

            return (
                text.includes("comedy") ||
                text.includes("funny") ||
                text.includes("comedic")
            );

        });

    }

    // ==========================================
    // LIMIT RESULTS
    // ==========================================

    fallbackMovies = fallbackMovies.slice(0, 4);

    console.log(
        "🎬 Fallback recommendations:",
        fallbackMovies.map(movie => movie.title)
    );

    return res.json({

        success: true,

        answer:
            fallbackMovies.length > 0
                ? "Here are some movies from our catalog that you might enjoy:"
                : "I couldn't find a suitable movie in the current catalog.",

        movies: fallbackMovies

    });
}

        // ==========================================
        // RECOMMENDED TITLES
        // ==========================================

        const recommendedTitles =
            Array.isArray(aiData.recommendedTitles)
                ? aiData.recommendedTitles
                : [];

        // ==========================================
        // FIND MOVIES IN DATABASE
        // ==========================================

        const recommendedMovies = movies.filter(movie => {

            return recommendedTitles.some(title => {

                return (
                    String(title)
                        .toLowerCase()
                        .trim() ===
                    String(movie.title)
                        .toLowerCase()
                        .trim()
                );

            });

        });

        console.log(
            "🎬 AI recommended:",
            recommendedMovies.map(
                movie => movie.title
            )
        );

        // ==========================================
        // SEND TO FRONTEND
        // ==========================================

        res.json({

            success: true,

            answer:
                aiData.answer ||
                "Here are some movies you might enjoy.",

            movies: recommendedMovies

        });

    } catch (error) {

        console.error(
            "❌ NETFLIX AI ERROR:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Netflix AI is temporarily unavailable.",

            error: error.message

        });

    }

};

module.exports = {
    netflixAI
};