const express = require('express')
const axios = require('axios');
const cheerio = require('cheerio');
const app = express()
const port = 3040

async function getTotal(result){
    var $ = cheerio.load(result.data)
    return {
        sick: $("#maincounter-wrap > div > span").eq(0).text().replace("        ", ""),
        death: $("#maincounter-wrap > div > span").eq(1).text(),
        recover: $("#maincounter-wrap > div > span").eq(2).text(),
    };
}
async function getCountryInfo(countryName, result){
    var $ = cheerio.load(result.data)
    let info;
    $("#main_table_countries_today > tbody:nth-child(2) > tr > td:nth-child(2) > a").each((i, elm) =>{
        if($(elm).text().toLowerCase() === countryName.toLowerCase()){
            info = $(elm).parent().parent();
        }
        
    })
    
    let response = {
        totali: $(info).find("td").eq(2).text().replace(/ +/, ""),
        newi: $(info).find("td").eq(3).text().replace(/ +/, ""),
        totald: $(info).find("td").eq(4).text().replace(/ +/, ""),
        newd: $(info).find("td").eq(5).text().replace(/ +/, ""),
        recover: $(info).find("td").eq(6).text().replace(/ +/, ""),
        active: $(info).find("td").eq(7).text().replace(/ +/, ""),
        critical: $(info).find("td").eq(8).text().replace(/ +/, "")
    };
    return response;
}
async function getAll(result){
    var $ = cheerio.load(result.data)
    let arr = [];
    $("#main_table_countries_today > tbody:nth-child(2) > tr > td:nth-child(2) > a").each((i, elm) =>{
        let info = $(elm).parent().parent();
        let response = {
            name: $(info).find("td").eq(1).find("a").text().replace(/ +/, ""),
            totali: $(info).find("td").eq(2).text().replace(/ +/, ""),
            newi: $(info).find("td").eq(3).text().replace(/ +/, ""),
            totald: $(info).find("td").eq(4).text().replace(/ +/, ""),
            newd: $(info).find("td").eq(5).text().replace(/ +/, ""),
            recover: $(info).find("td").eq(6).text().replace(/ +/, ""),
            active: $(info).find("td").eq(7).text().replace(/ +/, ""),
            critical: $(info).find("td").eq(8).text().replace(/ +/, "")
        };
        arr.push(response);
    })
    
    
    return {countries: arr};
}


app.get('/:country', async function(req, res){
    var result = await axios.get("https://www.worldometers.info/coronavirus/");
    var countryName = req.params['country'].toLowerCase().replace(/-/g, " ");
    if(countryName === "total"){
        res.send(await getTotal(result));
    }else if(countryName === "all"){
        res.send(await getAll(result));
    }else{
        res.send(await getCountryInfo(countryName, result));
    }
    
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
