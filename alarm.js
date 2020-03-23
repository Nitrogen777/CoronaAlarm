const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const app = express()
const port = 3040

app.get('/corona', async function(req, res){
    var result = await axios.get("https://www.worldometers.info/coronavirus/");
    var $ = cheerio.load(result.data)
    let israel;
    $("#main_table_countries_today > tbody > tr > td:nth-child(1)").each((i, elm) =>{
        if($(elm).text() === "Israel"){
            israel = $(elm).parent();
            
        }
    })
    resjs = {sick: $("#maincounter-wrap > div > span").eq(0).text().replace("        ", ""),
            recover: $("#maincounter-wrap > div > span").eq(2).text(),
            isick: $(israel).find("td").eq(1).text(),
            ireco: $(israel).find("td").eq(5).text()}
    res.send(resjs);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
