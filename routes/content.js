var express = require('express');
var router = express.Router();

var request = require('superagent');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
    request.get('http://www.eflora.cn/sp/Ophioglossaceae')
        .end(function(error, response){
            if(error) console.error(error);
            else{
                var $ = cheerio.load(response.text);
                console.log($.html());

                var description = $('div#divdesc p');
                console.log(description.html());

            }
        });

    res.render('index', { title: 'Express' });
});

module.exports = router;