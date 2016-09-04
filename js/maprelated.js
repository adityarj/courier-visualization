/**
 * Created by HP-PC on 29-08-2016.
 */

 var linesFin = '';
 var previous = 0;
 var timer = null;
 var packageCount = 0;
 var lateCount = 0;
 var punishment = 0;
 var count = 0;
 var GlobalIdTracker = null;
 var LineGraphData = [];
 var lineChart_1 = null;
 var lineChart_2 = null;
 var Normal_C_List = [];
 var O2O_C_List = [];
 var x,y,xAxis,yAxis = null;
 var xub,yub,xAxisub,yAxisub = null;
 var countLateNum = 0;

 var lineChart = d3.svg.line()
                    .x(function(d) {
                        return x(d.time);
                    })
                    .y(function(d) {
                        return y(d.num);
                    })
                    .interpolate('linear');

 var lineChartO2O = d3.svg.line()
                    .x(function(d) {
                        return xub(d.time);
                    })
                    .y(function(d) {
                        return yub(d.num);
                    })

 function LateHandle(record,late = 0,lateCount) {

    var row = d3.select('#AppendLate')
        .append('tr')
        .on('click',function() {

            d3.select(this).style('background-color','#FFFF99');

            d3.selectAll('.sample_lines').style('stroke-opacity',0.3);
            var id = d3.select(this).select('#idThing').text();
            console.log(id);
            GlobalIdTracker = id;

            d3.select('#CloseButton')
                .append('button')
                .attr('class','button--collapse button--xsm button--warning')
                .text('X')
                .on('click',function() {
                    d3.selectAll('.sample_lines').style('stroke-opacity',1).attr('stroke-width','1px');
                    GlobalIdTracker = null;
                    d3.select('#CloseButton').remove();
                })
        })

    row.append('td')
        .text(lateCount)
    row.append('td')
        .attr('id','idThing')
        .text(record.cid);
    row.append('td')
        .text(record.order);
    row.append('td')
        .text(record.placeid);
    row.append('td')
        .text(Math.abs(record.num));
    row.append('td')    
        .text(late);

 }  

function UpdateLines () {

    var start = moment('08:00','HH:mm');
    var boxCount_Normal = 0;
    var boxCount_O2O = 0;
    var activeCourier = 0;

    d3.select('#AppendLate').remove();
    d3.select('#TableLateList').append('tbody')
            .attr('id','AppendLate');

    count+=1;

    var time = start.add(count,'minutes');
    d3.select('#count_digit_1').text(time.format('HH:mm').charAt(0));
    d3.select('#count_digit_2').text(time.format('HH:mm').charAt(1));
    d3.select('#count_digit_3').text(time.format('HH:mm').charAt(3));
    d3.select('#count_digit_4').text(time.format('HH:mm').charAt(4));
    lateCount = 0;

    linesFin
        .transition()
        .duration(10)
        .attr('stroke',function(d,i) {
            var color = '#FFFF48';
            if (i==0) {

            } else {

                if (previous<=count && count<=d[0].timea ) {

                    // console.log(previous);
                    // console.log(d[0].timea);

                    previous = d[0].timed;
                    activeCourier++;

                    d.forEach(function(indi) {
                        if(indi.num < 0) {
                            packageCount+=Math.abs(indi.num);
                            if (indi.order.charAt(0) == 'E') {
                                boxCount_O2O+=Math.abs(indi.num);
                            } else {
                                boxCount_Normal+=Math.abs(indi.num);
                            }

                        } if (indi.deliv && indi.deliv < count && indi.num<0) {
                            lateCount++;
                            punishment+=10;
                            var latenum = count - indi.deliv;
                            LateHandle(indi,latenum,lateCount);
                            color = '#f42929';
                        }
                    });

                    if (d[0].cid == GlobalIdTracker) {
                        d3.select(this).style('stroke-opacity',1).attr('stroke-width','3px');
                        d3.select('#Cname').text(d[0].cid);
                        d3.select('#Cdest').text(d[0].placeid);

                        var pack_count_sub = 0;
                        var orders = '';

                        d.forEach(function(data) {
                            
                            pack_count_sub+=Math.abs(data.num);
                            orders+= ' '+data.order;
                            
                        });

                        d3.select('#CNum').text(pack_count_sub);
                        d3.select('#COrder').text(orders);

                        if (color != '#f42929') {
                            color = 'white';
                        }
                        
                    }
                    
                    return color;
                } else {
                    previous = d[0].timed;
                    if (GlobalIdTracker && d3.select(this).style('stroke-opacity') == '1') {
                        return color;
                    } else {
                        return 'none';
                    }
                    
                }
            }
        });

    var InstanceNormal = {
        time: count,
        num: boxCount_Normal
    };


    var InstanceO2O = {
        time: count,
        num: boxCount_O2O
    };

    Normal_C_List.push(InstanceNormal);
    O2O_C_List.push(InstanceO2O);

    updateLineGraph();

    //Calculations
    countLateNum+=lateCount;

    console.log((punishment + time.hour() - 8)/60);

    var timePunish = parseInt(punishment/ 60) + time.hour() - 8;
    console.log(timePunish);
    var minutes = (punishment  - timePunish * 60) + (time.hour() - 8)*60 + time.minutes();

    if (minutes.toString().length == 1) {
        minutes = '0'+minutes.toString();
    } else {
        minutes = minutes.toString();
    }

    if (timePunish.toString().length == 1) {
        timePunish = '0'+timePunish.toString();
    } else {
        timePunish = timePunish.toString();
    }


    d3.select('#total_digit_1').text(timePunish.charAt(0));
    d3.select('#total_digit_2').text(timePunish.charAt(1));
    d3.select('#total_digit_3').text(minutes.charAt(0));
    d3.select('#total_digit_4').text(minutes.charAt(1));

    d3.select('#ActiveCouriers').text(activeCourier);
    d3.select('#PackageCount').text(packageCount);
    d3.select('#LateCount').text(countLateNum);
    d3.select('#PunishmentCount').text(punishment);

    //Late count calculations
    var onTime = activeCourier - lateCount;
    var lateWidth = lateCount / activeCourier * 125;
    var onTimeWidth = 125 - lateWidth;

    d3.select('#correctBar')
        .style('width',onTimeWidth+'px');
    d3.select('#lateBar')
        .style('width',lateWidth+'px');
} 

function PlayPause (Text) {
    var Text = d3.select('#PlayButton').text();
    if (Text == 'Play') {
        timer = setInterval(UpdateLines,100);
        d3.select('#PlayButton').text('Pause');
    } else {
        clearInterval(timer);
        d3.select('#PlayButton').text('Play');
    }
}

function initGraph() {
    var width = 960,
    height = 350,
    margin = {
        top: 20,
        bottom: 20,
        left: 50,
        right: 20
    };

    x = d3.scale.linear().range([margin.left,width]).domain([0,1000]);
    y = d3.scale.linear().range([height - 45,margin.top]);

    xub = d3.scale.linear().range([margin.left,width]).domain([0,1000]);
    yub = d3.scale.linear().range([height - 45,margin.top]).domain([0,150]);

    xAxis = d3.svg.axis()
                    .scale(x);

    yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

    xAxisub = d3.svg.axis()
                    .scale(xub);

    yAxisub = d3.svg.axis()
                    .scale(yub)
                    .orient('left');

    var svg = d3.select('#GraphData')
                .append('svg')
                .attr('height',height - margin.top)
                .attr('width',width - margin.right);

    var svg2 = d3.select('#GraphData')
                .append('svg')
                .attr('height',height - margin.top)
                .attr('width',width - margin.right);

    svg.append('g') 
        .attr('class','xaxis')
        .attr('transform','translate(0,'+(height - 45)+')')
        .call(xAxis);

    svg.append('g')
        .attr('class','yaxis')
        .attr('transform','translate('+margin.left+',0)')
        .call(yAxis);

    svg.append('text')
        .attr('x',-55)
        .attr('y',65)
        .attr('class','textLabel')
        .attr('transform','rotate(-90)')
        .attr('text-anchor','middle')
        .text('Package count');

    svg.append('text')
        .attr('x',900)
        .attr('y',300)
        .attr('class','textLabel')
        .attr('text-anchor','middle')
        .text('Minutes past');

    svg.append('text')
        .attr('x',170)
        .attr('y',50)
        .attr('class','headerLabel')
        .attr('text-anchor','middle')
        .text('Normal Couriers')


    svg2.append('text')
        .attr('x',-55)
        .attr('y',65)
        .attr('class','textLabel')
        .attr('transform','rotate(-90)')
        .attr('text-anchor','middle')
        .text('Package count');

    svg2.append('text')
        .attr('x',900)
        .attr('y',300)
        .attr('class','textLabel')
        .attr('text-anchor','middle')
        .text('Minutes past');

    svg2.append('text')
        .attr('x',170)
        .attr('y',50)
        .attr('class','headerLabel')
        .attr('text-anchor','middle')
        .text('O2O Couriers')

    svg2.append('g') 
        .attr('class','xaxis2')
        .attr('transform','translate(0,'+(height - 45)+')')
        .call(xAxisub);

    svg2.append('g')
        .attr('class','yaxis2')
        .attr('transform','translate('+margin.left+',0)')
        .call(yAxisub);


    lineChart_1 = svg.append('path')
                        .attr('class','lineChart')
                        .attr('stroke','#2A4F6D')
                        .attr('stroke-width','2px');

    lineChart_2 = svg2.append('path')
                        .attr('class','lineChart')
                        .attr('stroke','#6D2A4F')
                        .attr('stroke-width','2px');
}     

function updateLineGraph(normalCount,O2OCount) {

    y.domain(d3.extent(Normal_C_List,function(d) {
        return d.num;
    }));

    lineChart_1.attr('d',lineChart(Normal_C_List));
    lineChart_2.attr('d',lineChartO2O(O2O_C_List));

    d3.select('.xaxis')
        .call(xAxis);
    d3.select('.yaxis')
        .call(yAxis);
    d3.select('.xaxis2')
        .call(xAxisub);
    d3.select('yaxis2')
        .call(yAxisub);    

}                  

$(function () {
    //Declaring objects for manipulation

    initGraph();

    var counter = d3.select('#counter').text(0);
    var playButton = d3.select('#PlayButton')
                        .on('click',function() {
                            PlayPause(d3.select(this).text);
                        });

    var nextbutton = d3.select('#NextButton')
                        .on('click',UpdateLines);

    var MyMap = L.map('MapImage').setView([31.267401,121.522179],12);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'adityarj.0mbl5ab1',
        accessToken: 'pk.eyJ1IjoiYWRpdHlhcmoiLCJhIjoiY2lwczQ0dzFmMDJqcWZsbTI3bDJld2JoNSJ9.mpkJWXaUYoE1jtAn6a9Mvw'
    }).addTo(MyMap);

    var svg  =   d3.select(MyMap.getPanes().overlayPane).append('svg')
        .attr('id','d3overlay');

    var g = svg.append('g').attr('class','leaflet-zoom-hide');

    
    
    d3.json('csv/points.geo.json',function (collection) {

        var transform = d3.geo.transform({
            point: projectPoint
        });
        var d3path = d3.geo.path().projection(transform);

        var new_3 = g.selectAll('.points')
            .data(collection.features)
            .enter()
            .append("g", '.points')
            .attr('id',function(d) {
                return d.properties.id;
            });

        var markers = new_3.append('circle') 
            .attr('r',2)
            .attr('fill',function(d,i) {
                if (i<126)
                    return '#f0027f';
                else if(i<9340)
                    return '#fc8d59';
                else 
                    return '#4575b4';
            });

        MyMap.on('viewreset',reset);
        reset();
        
        function reset() {
            var bounds = d3path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            markers.attr('transform',function (d) {
                return "translate("+
                    applyLatLngToLayer(d).x+","+
                    applyLatLngToLayer(d).y+")";

            });

            svg.attr('width',bottomRight[0]-topLeft[0]+120)
                .attr('height',bottomRight[1] - topLeft[1]+ 120)
                .style('left',topLeft[0] - 50+'px')
                .style('top',topLeft[1] - 50+'px');

            g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");
        }

        d3.csv('csv/new_5.csv',function(data) {

            var g1 = g.append('g');
            var g2 = g.append('g');
            var g3 = g.append('g');

            var O2O_list = [];
            var time = moment('08:00','hh:mm');
            data.forEach(function(d,i) {
                var deliveryTime = moment(d.delivery,'hh:mm');
                var difference = deliveryTime.diff(time,'minutes');
                var subObject = {
                    order: d.order,
                    delivery: difference
                };
                O2O_list.push(subObject);
            })

            // var new_5 = g1.selectAll('.o2olines').data(data)
            //     .enter()
            //     .append('g','.o2olines');

            // var lines = new_5.append('line')
            //                 .attr('id',function(d) {
            //                     return d.shop+d.poi;
            //                 })
            //                 .attr('stroke','white')
            //                 .attr('x1',function(d) {
            //                     var id1 = '#'+d.shop;
            //                     var x = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[0];
            //                     return x;
            //                 })
            //                 .attr('y1',function(d) {
            //                     var id1 = '#'+d.shop;
            //                     var y = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[1];
            //                     return y;

            //                 })
            //                 .attr('x2',function(d) {
            //                     var id2 = '#'+d.poi;
            //                     var x = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[0];
            //                     return x;

            //                 })
            //                 .attr('y2',function(d) {
            //                     var id2 = '#'+d.poi;
            //                     var y = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[1];
            //                     return y;
            //                 });    

            // MyMap.on('viewreset',reset);
            // reset();

            // function reset()  {
            //     lines.attr('x1',function(d) {
            //             var id1 = '#'+d.shop;
            //             var x = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[0];
            //             return x;
            //         })
            //         .attr('y1',function(d) {
            //             var id1 = '#'+d.shop;
            //             var y = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[1];
            //             return y;

            //         })
            //         .attr('x2',function(d) {
            //             var id2 = '#'+d.poi;
            //             var x = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[0];
            //             return x;

            //         })
            //         .attr('y2',function(d) {
            //             var id2 = '#'+d.poi;
            //             var y = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[1];
            //             return y;
            //         });    
            // }          

            d3.csv('csv/new_4.csv',function(data) {

                // var new_4 = g2.selectAll('.site').data(data)
                //                 .enter()
                //                 .append('g','.site');

                // var linesSite = new_4.append('line')
                //                     .attr('id',function(d) {
                //                         return d.poi+d.site;
                //                     })
                //                     .attr('stroke','#FFFF7B')
                //                     .attr('x1',function(d) {
                //                         var id1 = '#'+d.poi;
                //                         var x = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[0];
                //                         return x;
                //                     })
                //                     .attr('y1',function(d) {
                //                         var id1 = '#'+d.poi;
                //                         var y = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[1];
                //                         return y;

                //                     })
                //                     .attr('x2',function(d) {
                //                         var id2 = '#'+d.site;
                //                         var x = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[0];
                //                         return x;

                //                     })
                //                     .attr('y2',function(d) {
                //                         var id2 = '#'+d.site;
                //                         var y = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[1];
                //                         return y;
                //                     });    

                // MyMap.on('viewreset',reset);
                // reset();

                // function reset() {
                //     linesSite.attr('x1',function(d) {
                //             var id1 = '#'+d.poi;
                //             var x = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[0];
                //             return x;
                //         })
                //         .attr('y1',function(d) {
                //             var id1 = '#'+d.poi;
                //             var y = d3.transform(d3.select(id1).select('circle').attr('transform')).translate[1];
                //             return y;

                //         })
                //         .attr('x2',function(d) {
                //             var id2 = '#'+d.site;
                //             var x = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[0];
                //             return x;

                //         })
                //         .attr('y2',function(d) {
                //             var id2 = '#'+d.site;
                //             var y = d3.transform(d3.select(id2).select('circle').attr('transform')).translate[1];
                //             return y;
                //         });
                // }

                d3.csv('csv/sample.csv',function(data) {

                    //All this does is preprocess the data
                    var previous_time = data[0].timea;
                    var previous_cid = data[0].cid;
                    var EachCourier = [];
                    var EachPickUp = [];
                    var TotalC = [];
                    var count = 0;

                    data.forEach(function(d) {
                        if (d.cid!=previous_cid) {
                            EachCourier.push(EachPickUp);
                            EachPickUp = [];
                            previous_time = d.timea;
                            TotalC.push(EachCourier);
                            EachCourier = [];
                            count = 0;
                            previous_cid = d.cid;
                        } else {
                            if (d.timea!=previous_time) {
                                EachCourier.push(EachPickUp);
                                EachPickUp = [];
                                previous_time = d.timea;
                            }

                            if (d.order.charAt(0) == 'E') {
                                var DTime = null;
                                O2O_list.forEach(function(data) {
                                    if (data.order == d.order) {
                                         DTime = data.delivery;
                                    }
                                    
                                });

                            } else {
                                var DTime = null;
                            }


                            var OrderInstance = {
                                cid: d.cid,
                                placeid: d.placeid,
                                timea: d.timea,
                                timed: d.timed,
                                num: d.num,
                                order: d.order,
                                deliv: DTime
                            };
                            EachPickUp.push(OrderInstance);

                        }
                    });


                    var sample = g3.selectAll('.sample')
                        .data(TotalC)
                        .enter()
                        .append('g','.sample');

                    var line = d3.svg.line()
                                    .x(function(d) {
                                        if (d[0]) {
                                            var id = '#'+d[0].placeid;
                                            var select = d3.select(id).select('circle');
                                            if (select[0][0]) {
                                                var x = d3.transform(select.attr('transform')).translate[0];
                                                return x;
                                            }
                                        }
                                    })
                                    .y(function(d) {
                                        if (d[0]) {
                                            var id = '#'+d[0].placeid;
                                            var select = d3.select(id).select('circle');
                                            if (select[0][0]) {
                                                var y = d3.transform(select.attr('transform')).translate[1];
                                                return y;
                                            }
                                                //var select = d3.select(id).select('circle').attr('transform')
                                        }
                                    })

                    var pre_id = null;                

                    var lines_sample = sample.selectAll('.sample')
                                            .data(function(d){
                                                return d;
                                            })
                                            .enter()
                                            .append('line','.sample');
                    linesFin = lines_sample    
                                            .attr('class',function(d) {
                                                if (d[0]) {
                                                    if (pre_id) {
                                                        return d[0].placeid+pre_id;
                                                    }
                                                }
                                            })
                                            .attr('class','sample_lines')
                                            .attr('x1',function(d,i) {
                                                if(pre_id) {

                                                    var select = d3.select(pre_id).select('circle');
                                                    if (d[0])
                                                        var id = '#'+d[0].placeid;
                                                    else 
                                                        var id = null;

                                                    var prev_select = d3.select(id).select('circle');

                                                    if (prev_select[0][0]) {
                                                        var x2 = d3.transform(prev_select.attr('transform')).translate[0];
                                                        var y2 = d3.transform(prev_select.attr('transform')).translate[1];
                                                        d3.select(this).attr('x2',x2).attr('y2',y2);
                                                    } else {
                                                        return null;
                                                    }

                                                    if (select[0][0]) {
                                                        var x = d3.transform(select.attr('transform')).translate[0];
                                                        var y = d3.transform(select.attr('transform')).translate[1];
                                                        d3.select(this).attr('y1',y);
                                                        if (d[0])
                                                            pre_id = '#'+d[0].placeid;
                                                        else
                                                            pre_id = null;
                                                        return x;
                                                    } else {
                                                        return null;
                                                    }
                                                }

                                                pre_id = '#'+d[0].placeid;
                                            })
                                            .attr('stroke',function(d,i) {
                                               return 'none';
                                            })
                                            .on('mouseover',function(d,i) {
                                                d3.select(this).attr('stroke-width','3px');
                                                if (GlobalIdTracker == null) {
                                                    if (d[0]) {

                                                        d3.select('#Cname').text(d[0].cid);
                                                        d3.select('#Cdest').text(d[0].placeid);
                                                        var pack_count_sub = 0;
                                                        var orders = '';

                                                        d.forEach(function(data) {
                                                            
                                                            pack_count_sub+=Math.abs(data.num);
                                                            orders+= ' '+data.order;
                                                            
                                                        });
                                                        d3.select('#CNum').text(pack_count_sub);
                                                        d3.select('#COrder').text(orders);
                                                    }
                                                }
                                                
                                            })
                                            .on('mouseout',function() {
                                                if (d3.select(this).attr('stroke-opacity') == 1) {

                                                } else {
                                                    d3.select(this).attr('stroke-width','1px');     
                                                }
                                                                                           
                                            })
                                            .on('click',function(d) {
                                                d3.selectAll('.sample_lines').style('stroke-opacity',0.3);
                                                d3.select(this).style('stroke-opacity',1).attr('stroke-width','3px');
                                                GlobalIdTracker = d[0].cid;

                                                d3.select('#Cname').text(d[0].cid);
                                                d3.select('#Cdest').text(d[0].placeid);
                                                var pack_count_sub = 0;
                                                var orders = '';

                                                d.forEach(function(data) {
                                                    
                                                    pack_count_sub+=Math.abs(data.num);
                                                    orders+= ' '+data.order;
                                                    
                                                });
                                                d3.select('#CNum').text(pack_count_sub);
                                                d3.select('#COrder').text(orders);

                                                d3.select('#CloseButton')
                                                    .append('button')
                                                    .attr('class','button--collapse button--xsm button--warning')
                                                    .text('X')
                                                    .on('click',function() {
                                                        d3.selectAll('.sample_lines').style('stroke-opacity',1).attr('stroke-width','1px');
                                                        GlobalIdTracker = null;
                                                        d3.select('#CloseButton').remove();
                                                    })
                                            })
                                            

                    MyMap.on('viewreset',reset);
                    reset();


                    function reset() {
                        pre_id = null;
                        linesFin.attr('x1',function(d,i) {
                                        if(pre_id) {

                                            var select = d3.select(pre_id).select('circle');
                                            if (d[0])
                                                var id = '#'+d[0].placeid;
                                            else 
                                                var id = null;

                                            var prev_select = d3.select(id).select('circle');

                                            if (prev_select[0][0]) {
                                                var x2 = d3.transform(prev_select.attr('transform')).translate[0];
                                                var y2 = d3.transform(prev_select.attr('transform')).translate[1];
                                                d3.select(this).attr('x2',x2).attr('y2',y2);
                                            } else {
                                                return null;
                                            }

                                            if (select[0][0]) {
                                                var x = d3.transform(select.attr('transform')).translate[0];
                                                var y = d3.transform(select.attr('transform')).translate[1];
                                                d3.select(this).attr('y1',y);
                                                if (d[0])
                                                    pre_id = '#'+d[0].placeid;
                                                else
                                                    pre_id = null;
                                                return x;
                                            } else {
                                                return null;
                                            }
                                        }

                                        pre_id = '#'+d[0].placeid;
                                    });
                    }

                    timer = setInterval(UpdateLines,100);                

                });

            });
        });


    });

    //Generate points related to D3 overlay
    function projectPoint(x,y) {
        var point = MyMap.latLngToLayerPoint(new L.LatLng(y,x));
        this.stream.point(point.x,point.y);

    }

    //Generate points related to D3 overlay
    function applyLatLngToLayer(d) {
        var y = d.geometry.coordinates[1];
        var x = d.geometry.coordinates[0];
        return MyMap.latLngToLayerPoint(new L.LatLng(y,x));
    }
});