import path from "node:path";
import express from "express";
import pug from "pug";
import bodyParser from "body-parser";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const port = process.env.PORT ? process.env.PORT : 3000;

let app = express();
app.use(express.static(path.join(__dirname, "../../dist"))); // Serve static assets

app.set("views", __dirname);
app.engine("pug", pug.__express);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve templates for other routes
app.get("/", (req, res) => {
  // res.render("base.pug", {});
  const indexPath = path.resolve(__dirname, "../../dist/index.html");
  res.sendFile(indexPath);
});

// Run the server itself
const server = app.listen(port, () => {
  console.log("Neon listening on " + server.address().port);
});