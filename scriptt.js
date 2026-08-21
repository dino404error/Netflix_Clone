// Connect to Backend

async function connectBackend() {
    try {

        const response = await fetch("http://localhost:5000/api/message");

        const data = await response.json();

        console.log(data);

        alert(data.message);

    } catch (error) {

        console.log(error);

    }
}

connectBackend();

// ======================================
// NETFLIX AI
// ======================================

console.log("Netflix AI script loaded");

const aiButton = document.getElementById("aiButton");
const aiInput = document.getElementById("aiInput");
const aiLoading = document.getElementById("aiLoading");
const aiResult = document.getElementById("aiResult");
const aiMovies = document.getElementById("aiMovies");

console.log("AI Button:", aiButton);
console.log("AI Input:", aiInput);

if (aiButton) {

    aiButton.addEventListener("click", async function () {

        console.log("AI BUTTON CLICKED");

        const message = aiInput.value.trim();

        if (!message) {
            alert("Tell me what you want to watch.");
            return;
        }

        aiButton.disabled = true;

        if (aiLoading) {
            aiLoading.classList.remove("hidden");
        }

        if (aiResult) {
            aiResult.classList.add("hidden");
        }

        try {

            console.log("Sending request to AI...");

            const response = await fetch(
                "http://localhost:5000/api/ai/recommend",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            console.log("Server response:", response);

            const data = await response.json();

            console.log("AI DATA:", data);

            if (!data.success) {
                throw new Error(data.message || "AI request failed");
            }

            if (aiResult) {
                aiResult.classList.remove("hidden");
            }

            if (aiMovies) {
                aiMovies.innerHTML = `
                    <div style="
                        background:#222;
                        padding:20px;
                        border-radius:8px;
                        color:white;
                    ">
                        <h3>✨ AI understood you</h3>

                        <pre style="
                            color:#aaa;
                            white-space:pre-wrap;
                            margin-top:10px;
                        ">${JSON.stringify(
                            data.preferences,
                            null,
                            2
                        )}</pre>
                    </div>
                `;
            }

        } catch (error) {

            console.error("NETFLIX AI ERROR:", error);

            alert(
                "Netflix AI connection failed.\n\n" +
                error.message
            );

        } finally {

            aiButton.disabled = false;

            if (aiLoading) {
                aiLoading.classList.add("hidden");
            }

        }

    });

} else {

    console.error("Netflix AI: aiButton was not found!");

}