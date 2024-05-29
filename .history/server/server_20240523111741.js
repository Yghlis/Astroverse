const express = require ('express');
require("./models/db");

const app = express();

app.get(
    '/',
    /*checkAuth,*/
    (request, response, next) => {
      response.send("Healthy");
});


app.listen(process.env.PORT, () => 
    console.log("YAHOUUUUU" + process.env.PORT)
);