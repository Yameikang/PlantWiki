var express = require('express');
var router = express.Router();

var request = require('superagent');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  request.get('http://frps.eflora.cn/frps/Serratula%20suffruticosa')
      .end(function(error, response){
        if(error) console.error(error);
        else{
          var $ = cheerio.load(response.text);
          console.log($('p[style="text-indent:24px"]').text());


            /*var data = [];
            $('a').each(function(i, elem){
                data[i] = $(this).attr('href');
            });

            console.log(data.toString());*/


            /*request.get('http://frps.eflora.cn'+data.toString())
                .end(function(err, res){
                    if(err) console.error(err);
                    else{
                        var $$$ = cheerio.load(res.text);
                        //console.log($$$.html());
                    }
                })*/
        }
      });

  res.render('index', { title: 'Express' });
});



module.exports = router;
