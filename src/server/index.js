import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import * as url from "url";
import {data} from "./data.js";
import cors from 'cors';

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const corsOptions = {
  origin: 'chrome-extension://nilpdcefgmfkiljgkmofmnfbofmlipal',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // This allows session cookies to be sent back and forth
  allowedHeaders: "Content-Type, Authorization, X-Requested-With"
};

const port = process.env.PORT ? process.env.PORT : 3000;

let app = express();
app.use(express.static(path.join(__dirname, "../../dist"))); // Serve static assets
app.options('*', cors(corsOptions));
app.set("views", __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve templates for other routes
app.get("/", (req, res) => {
  const indexPath = path.resolve(__dirname, "../../dist/index.html");
  res.sendFile(indexPath);
});

app.get("/recommend/random", (req, res) => {
  res.json(data);
});


// Add CORS middleware
app.use(cors(corsOptions));

// Manually handle the OPTIONS request
app.options('*', cors(corsOptions));
app.set("views", __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/storeBookmarkDetails', (req, res) => {
    const { title, url, icon } = req.body;
    console.log('Received details:', title, url, icon);
    // Store or process the data as needed
    res.sendStatus(200);

});

// Run the server itself
const server = app.listen(port, () => {
  console.log("Neon listening on " + server.address().port);
});