var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('superagent');

//mongodb model for storing plant information
var mongoose = require('mongoose');
var Plant = mongoose.model('Plant');
var Hierarchy = mongoose.model('Hierarchy');



var url = 'http://frps.eflora.cn/v/1';
//url = 'http://frps.eflora.cn/name/a';

var links = [], wiki = [];

//test
router.get('/test', function(req, res, next){
    var plant = new Plant({
        fullname: "test",
        appearanceDesp: "test",
        description: "test"
    });

    plant.save(function(err){
        if(err){
            res.end("Error");
            return next();
        }

        Plant.find({}, function(err, docs){
            if(err){
                res.end("Error");
                return next();
            }
            res.json(docs);
        });
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  request.get(url)
      .end(function(err,res){
        if(err){
          console.log(err);
        }else{
          var $=cheerio.load(res.text);



          var linkList = $('div[style="float:left;margin-right:5px;"] a');
           // var linkList = [];
          linkList.map(function(i, link){
              console.log($(link).attr('href'));
            links.push('http://frps.eflora.cn/getfam.ashx?t='+$(link).attr('href').substring(3));

            request.get('http://frps.eflora.cn/getfam.ashx?t='+$(link).attr('href').substring(3))
                .end(function(error, response){
                  if(error) console.error(error);
                  else{
                      //console.log(link);
                    var $$ = cheerio.load(response.text);
                      var data = [];
                      $$('a').each(function(i,elem){
                          data[i] = $$(this).attr('href');
                          //console.log(data[i] + $$(this).text().substr(($$(this).text()).length -1, 1));
                          if($$(this).text().substr(($$(this).text()).length -1, 1) == '属'){
                              //console.log(data[i] + "属");

                              /*
                              创建新的Hierarchy条目，并写入数据库
                               */
                              var hierarchy  = new Hierarchy({
                                  name: data[i].substring(6),
                                  parentName: "Unknown",
                                  childrenName: "Unknown",
                                  type:"属"
                              });

                              /*
                              保存新添加的Hierarchy条目，并返回显示
                               */
                              hierarchy.save(function(err){
                                  if(err){
                                      res.render("Error");
                                      return next();
                                  }

                                  Hierarchy.find({}, function(err, docs){
                                      if(err){
                                          res.render("Error");
                                          return next();
                                      }
                                      res.json(docs);
                                  });
                              });
                          }

                      });
                      console.log(data.toString());
                  }
                });
          });
          console.log("已抓取成功"+links.length+"链接");
          console.log(links);

           //getIAjaxUrlList(20);
          //getInfoFromLinks(links);
        }
      });

  //res.send('New resources');
    Hierarchy.find({}, function(err, docs){
        if(err){
            res.end("Error");
            return next();
        }
        res.json(docs);
    });

});

router.get('/restart',function(req, res, next){
    Hierarchy.find({}, function(err, hierarchies){
        if(err) throw err;
        res.json(hierarchies);

        //Hierarchy.removeAll({});
    });
});

var getInfoFromLinks = function(links){
  console.log(links.length);
  var tmp = 0;
  for(tmp; tmp < links.length; tmp++) {
    //console.log(links[tmp]);
    (function(e) {
        //console.log(e);
      request.get(links[e])
          .end(function (error, response) {
            if (error) ;//console.error(error);
            else {
              //console.log(links[e]);
              var $ = cheerio.load(response.text);
               // console.log($.html()+'\n');
              var b = $('a[style="color:#000000"]').attr('href');
                var p = $('a[style="color:#000000"]').html();
              console.log(b + p);


              //var t = $('a').attr('href');
              //console.log(t.toString());
              /*request.get('http://frps.eflora.cn' + t.toString())
               .end(function (err, res) {
               if (err) console.error(err);
               else {
               var $$$ = cheerio.load(res.text);
               //console.log($$$.html());
               //console.log(data.toString());
               }
               })*/
            }
          });
    })(tmp);
  }
};

module.exports = router;

