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