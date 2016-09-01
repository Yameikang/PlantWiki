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
              //console.log($(link).attr('href'));
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
                              Hierarchy.findOne({name: hierarchy.name},function(err,doc){
                                  if(err){
                                      console.log('findOne err: ' + err);
                                      return;
                                  }
                                  if(!doc){
                                      hierarchy.save(function(err){
                                          if(err){
                                              //res.end("Error");
                                              return next();
                                          }
                                      });
                                  }
                              });

                              /*request.get('frps.eflora.cn/frps/'+ hierarchy.name)
                                  .end(function(err, response){
                                      if(err)console.error(err);
                                      else{
                                          var $$$ = cheerio.load(response);
                                          console.log($$$.html());
                                          if($$$('div#divphoto').length > 0 ){
                                              console.log($$$('p[style="text-indent:24px"]').text());
                                          }else{
                                              if($$$('div#listlower').length > 0){
                                                  $$$('div#listlower span a').each(function(i,elem){
                                                      console.log($$$(this).attr('href') + $$$(this).text());
                                                  })
                                              }
                                          }
                                      }
                                  });*/
                          }
                          else if($$(this).text().substr(($$(this).text()).length -1, 1) == '科'){


                              /*
                               创建新的Hierarchy条目，并写入数据库
                               */
                              var hierarchy  = new Hierarchy({
                                  name: data[i].substring(6),
                                  parentName: "Unknown",
                                  childrenName: "Unknown",
                                  type:"科"
                              });

                              /*
                               保存新添加的Hierarchy条目，并返回显示
                               */
                              Hierarchy.findOne({name: hierarchy.name},function(err,doc){
                                  if(err){
                                      console.log('findOne err: ' + err);
                                      return;
                                  }
                                  if(!doc){
                                      hierarchy.save(function(err){
                                          if(err){
                                              //res.end("Error");
                                              return next();
                                          }

                                      });
                                  }
                              });

                          }

                      });
                      //console.log(data.toString());
                  }
                });
          });
          console.log("已抓取成功"+links.length+"链接");
          console.log(links);

          //getInfoFromLinks(links);
        }
      });

  //res.send('New resources');
    Hierarchy.find({}, function(err, docs){
        if(err){
            //res.end("Error");
            console.error(err);
            return next();
        }
        res.json(docs);
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

