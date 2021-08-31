const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const fs = require("fs");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(ejsLayouts); //USE = indicating middlewear

app.use(express.urlencoded({ extended: false }));

// lists all dinosaurs
app.get("/dinosaurs", function (req, res) {
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);
  res.render("dinosaurs/index", { myDinos: dinoData });
});

//express show route for dinosaurs (lists one dinosaur)
app.get("/dinosaurs/:idx", function (req, res) {
  // get dinosaurs
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);

  //get array index from url parameter
  const dinoIndex = parseInt(req.params.idx);

  //render page with data of the specified animal
  res.render("dinosaurs/show", { myDino: dinoData[dinoIndex] });
});

app.get("/dinosaurs/new", function (req, res) {
  res.render("dinosaurs/new");
});

app.post("/dinosaurs", function (req, res) {
  console.log(req.body);
});

app.post("/dinosaurs", function (req, res) {
  // read dinosaurs file
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  dinosaurs = JSON.parse(dinosaurs);

  // add item to dinosaurs array
  dinosaurs.push(req.body);

  // save dinosaurs to the data.json file
  fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinosaurs));

  //redirect to the GET /dinosaurs route (index)
  res.redirect("/dinosaurs");
});
app.get("/dinosaurs", function (req, res) {
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);

  const nameFilter = req.query.nameFilter;

  if (nameFilter) {
    dinoData = dinoData.filter(function (dino) {
      return dino.name.toLowerCase() === nameFilter.toLowerCase();
    });
  }

  res.render("dinosaurs/index", { myDinos: dinoData });
});

//----------------------------------------------------------------

app.delete("/dinosaurs/:idx", function (req, res) {
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);

  // remove the deleted dinosaur from the dinosaurs array
  dinoData.splice(req.params.idx, 1);

  // save the new dinosaurs to the data.json file
  fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinoData));

  //redirect to the GET /dinosaurs route (index)
  res.redirect("/dinosaurs");
});

//get rout to view form
app.get("/dinosaurs/edit/:idx", function (req, res) {
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);
  res.render("dinosaurs/edit", {
    dino: dinoData[req.params.idx],
    dinoId: req.params.idx,
  });
});

//put rout
app.put("/dinosaurs/:idx", function (req, res) {
  const dinosaurs = fs.readFileSync("./dinosaurs.json");
  const dinoData = JSON.parse(dinosaurs);

  //re-assign the name and type fields of the dinosaur to be editted
  dinoData[req.params.idx].name = req.body.name;
  dinoData[req.params.idx].type = req.body.type;

  // save the editted dinosaurs to the data.json file
  fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinoData));
  res.redirect("/dinosaurs");
});

//ALWAYS LAST
app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
