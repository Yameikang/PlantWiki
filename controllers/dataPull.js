var assert  = require('assert'),
    mongoose = require('mongoose'),
    cheerio = require('cheerio'),
    request = require('request');

var Plant = mongoose.model('Plant');
var Hierarchy = mongoose.model('Hierarchy');

var dbops = require('./dbOperations.js');

var urlByName = 'http://frps.eflora.cn/name/a';
var urlByFamily = 'http://frps.eflora.cn/v/1';

/*
 Pull data by name to the database
 according to the schema of 'Plant'
 */
exports.pullDataByName = function(){
    request.get(urlByName)
        .end(function(error, response){
            if(error)console.error(error);
            else{
                var $ = cheerio.load(response.text);

                var linkList = $('div[style="text-align:center;margin-top:10px"] a');
                linkList.map(function(i, link){
                    // Get all the links by chinese name
                    if($(link).attr('href').substring(6)!= "" && $(link).attr('href').substring(6)!="×"){
                        request.get('http://frps.eflora.cn/getname.ashx?t=' + $(link).attr('href').substring(6))
                            .end(function(error, response){
                                if(error)console.error(error);
                                else{
                                    var $$ = cheerio.load(response.text);

                                    var data = [];
                                    $$('a').each(function (i, elem){
                                        data[i] = $$(this).attr('href');

                                        var plant = new Plant({
                                            fullname: data[i].substring(6),
                                            appearanceDesp: "Undefined",
                                            description: "Undefined",
                                            link: "http://frps.eflora.cn" + data[i]
                                        });

                                        // Insert each plant into collection Plant in the database
                                        dbops.findDocumentsByCondition({fullname:plant.fullname},Plant,function(doc){
                                            console.log(doc);
                                            if(!doc){
                                                dbops.insertDocument(plant,Plant,function(result){
                                                    console.log(result.ops);
                                                });
                                            }
                                        });

                                    });
                                }
                            });
                    }
                });
            }
        });
};

/*
 Pull data by family and store in the database
 according to the schema of 'Hierarchy';
 */
exports.pullDataByFamily = function(){
    request.get(urlByFamily)
        .end(function(error, response){
           if(error){console.error(error);}
           else{
               var $ = cheerio.load(response.text);

               var linkList = $('div[style="float:left;margin-right:5px;"] a');
               linkList.map(function(i, link){
                   request.get('http://frps.eflora.cn/getfam.ashx?t='+$(link).attr('href').substring(3))
                       .end(function(error, response){
                           if(error)console.error(error);
                           else{
                               var $$ = cheerio.load(response.text);
                               var data = [];

                               $$('a').each(function(i,elem){
                                   data[i] = $$(this).attr('href');

                                   /*
                                    Insert data into database by family
                                    */
                                   if($$(this).text().substr(($$(this).text()).length -1, 1) == '属'){
                                       var hierarchy  = new Hierarchy({
                                           name: data[i].substring(6),
                                           parentName: "Unknown",
                                           childrenName: [],
                                           type:"属"
                                       });
                                       dbops.findDocumentsByCondition({name: hierarchy.name},Hierarchy,function(doc){

                                           console.log(doc);
                                           if(!doc) {
                                               dbops.insertDocument(hierarchy,Hierarchy, function(result){
                                                   console.log(result.ops);
                                               });
                                           }
                                       });

                                   }else if($$(this).text().substr(($$(this).text()).length -1, 1) == '科'){
                                       var hierarchy  = new Hierarchy({
                                           name: data[i].substring(6),
                                           parentName: "Unknown",
                                           childrenName: [],
                                           type:"科"
                                       });

                                       dbops.findDocumentsByCondition({name: hierarchy.name},Hierarchy,function(doc){

                                           console.log(doc);
                                           if(!doc) {
                                               dbops.insertDocument(hierarchy,Hierarchy, function(result){
                                                   console.log(result.ops);
                                               });
                                           }
                                       });
                                   }
                               });
                           }
                       });
               });
           }
        });
};

