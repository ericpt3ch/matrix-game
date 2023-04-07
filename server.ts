import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Game from "./game";

let game: Game | null = null;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/initialize", (req, res) => {
    game = new Game();
    return res.json(game.status);
});

app.post("/node-clicked", (req, res) => {
    game?.clickPoint({ x: req.body.x, y: req.body.y });
    return res.json(game?.status);
});

app.listen(3000, () => {
    console.log("listening to 3000");
});
