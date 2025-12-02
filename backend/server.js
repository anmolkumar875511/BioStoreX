import express from "express";
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/team", (req, res) => {
    const team = {
        name: "defaulted_losers",
        members: ["Anmol Kumar", "Ashwini Kumar", "Honey Tiwari"]
    }
    res.json(team);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
