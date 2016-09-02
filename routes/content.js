var express = require('express');
var router = express.Router();

var request = require('superagent');
var cheerio = require('cheerio');

var mongoose = require('mongoose');
var Plant = mongoose.model('Plant');
var Hierarchy = mongoose.model('Hierarchy');

var url = 'http://frps.eflora.cn/name/a';
var links = [], wiki = [];


//test
router.get('/test', function(req, res, next){
    var plant = new Plant({
        fullname: "test",
        appearanceDesp: "test",
        description: "test",
        link:"test"
    });

    plant.save(function(err){
        if(err){
            res.end("Error 1");
            //return;
        }else {

            Plant.find({}, function (err, docs) {
                if (err) {
                    res.end("Error 2");
                    //return;
                }else{}
                //res.json(docs);
            });
        }
    });
});

router.get('/', function(req, res, next) {
    request.get(url)
        .end(function(err, res){
            if(err) {console.error(err);}
            else{
                var $ = cheerio.load(res.text);
                //console.log($.html());

                var linkList = $('div[style="text-align:center;margin-top:10px"] a');
                linkList.map(function(i, link){
                    if($(link).attr('href').substring(6)!= "" && $(link).attr('href').substring(6)!="×") {
                        links.push('http://frps.eflora.cn/getname.ashx?t=' + $(link).attr('href').substring(6));
                        request.get('http://frps.eflora.cn/getname.ashx?t=' + $(link).attr('href').substring(6))
                            .end(function(error, response){
                                if(error){console.error(error);}
                                else {
                                    var $$ = cheerio.load(response.text);


                                    var data = [];
                                    $$('a').each(function (i, elem) {
                                        data[i] = $$(this).attr('href');
                                        //console.log(data[i].substring(6));
                                        wiki.push(data[i].substring(6));

                                        var plant = new Plant({
                                            fullname: data[i].substring(6),
                                            appearanceDesp: "Undefined",
                                            description: "Undefined",
                                            link: "http://frps.eflora.cn" + data[i]
                                        });

                                        //console.log(plant.toString());
                                        Plant.findOne({fullname:plant.fullname},function(err, doc) {
                                            if (err) {
                                                console.log('findOne err:' + err);
                                                return;
                                            }
                                            if (!doc) {
                                                plant.save(function (err) {
                                                    if (err) {
                                                        return next();
                                                    }
                                                });
                                            } else {
                                                plant.update(function (err) {
                                                    if (err) {
                                                        //res.end("Error");
                                                        return next();
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    //console.log(wiki);
                                }

                            });
                    }
                });

                console.log("已成功抓取"+links.length+ "链接");
                //console.log(wiki);

            }
        });

    //res.render('index', { title: 'Express' });
    Plant.find({}, function(err, docs){
        if(err){
            //res.end("Error");
            console.error(err);
            return next();
        }
        res.json(docs);

    });
});

module.exports = router;