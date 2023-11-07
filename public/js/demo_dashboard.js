
    
    var u2ext = "";
    var u2int = "";
    var u2int_in = "";
    var f1qext = "";
    var f1qint = "";
    var f1qint_in = "";
    var tubext = "";
    var tubint = "";
    var tubint_in = "";
    var cbext = "";
    var cbint = "";
    var u2ext_count = 0;
    var u2int_count = 0;
    var u2int_in_count = 0;
    var f1qext_count = 0;
    var f1qint_count = 0;
    var f1qint_in_count = 0;
    var tubext_count = 0;
    var tubint_count = 0;
    var tubint_in_count = 0;
    var cbext_count = 0;
    var cbint_count = 0;
$(function(){
    
    // $.ajax({
    //     type:"post",
    //     url:"http://seointec.com/dev_ventures/index.php/site/get_donut_chart_data",
    //     data:"",
    //     success:function(donut_data)
    //     {
    //         // console.log(donut_data);
    //         var obj_donut = JSON.parse(donut_data);
    //         $.each(obj_donut, function(i, item) {
    //             if(item.bag_type_id == 2)
    //             {
    //                 u2ext = item.bag_type_name;
    //                 u2ext_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 8)
    //             {
    //                 u2int = item.bag_type_name;
    //                 u2int_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 18)
    //             {
    //                 u2int_in = item.bag_type_name;
    //                 u2int_in_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 3)
    //             {
    //                 f1qext = item.bag_type_name;
    //                 f1qext_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 9)
    //             {
    //                 f1qint = item.bag_type_name;
    //                 f1qint_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 19)
    //             {
    //                 f1qint_in = item.bag_type_name;
    //                 f1qint_in_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 7)
    //             {
    //                 tubext = item.bag_type_name;
    //                 tubext_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 20)
    //             {
    //                 tubint = item.bag_type_name;
    //                 tubint_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 10)
    //             {
    //                 tubint_in_count = item.bag_type_count;
    //                 tubint_in_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 11)
    //             {
    //                 cbint = item.bag_type_name;
    //                 cbint_count = item.bag_type_count;
    //             }
    //             if(item.bag_type_id == 12)
    //             {
    //                 cbext = item.bag_type_name;
    //                 cbext_count = item.bag_type_count;
    //             }
    //         });
    //     }
    // });
    
    /* reportrange */
    if($("#reportrange").length > 0){   
        $("#reportrange").daterangepicker({                    
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            buttonClasses: ['btn btn-default'],
            applyClass: 'btn-small btn-primary',
            cancelClass: 'btn-small',
            format: 'MM.DD.YYYY',
            separator: ' to ',
            startDate: moment().subtract('days', 29),
            endDate: moment()            
          },function(start, end) {
              $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        });
        
        $("#reportrange span").html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    }
    /* end reportrange */
    
    /* Rickshaw dashboard chart */
    // var seriesData = [ [], [] ];
    // var random = new Rickshaw.Fixtures.RandomData(1000);

    // for(var i = 0; i < 100; i++) {
        // random.addData(seriesData);
    // }

    // var rdc = new Rickshaw.Graph( {
            // element: document.getElementById("dashboard-chart"),
            // renderer: 'area',
            // width: $("#dashboard-chart").width(),
            // height: 250,
            // series: [{color: "#33414E",data: seriesData[0],name: 'New'}, 
                     // {color: "#1caf9a",data: seriesData[1],name: 'Returned'}]
    // } );

    // rdc.render();

    // var legend = new Rickshaw.Graph.Legend({graph: rdc, element: document.getElementById('dashboard-legend')});
    // var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({graph: rdc,legend: legend});
    // var order = new Rickshaw.Graph.Behavior.Series.Order({graph: rdc,legend: legend});
    // var highlight = new Rickshaw.Graph.Behavior.Series.Highlight( {graph: rdc,legend: legend} );        

    // var rdc_resize = function() {                
            // rdc.configure({
                    // width: $("#dashboard-area-1").width(),
                    // height: $("#dashboard-area-1").height()
            // });
            // rdc.render();
    // }

    // var hoverDetail = new Rickshaw.Graph.HoverDetail({graph: rdc});

    // window.addEventListener('resize', rdc_resize);        

    // rdc_resize();
    /* END Rickshaw dashboard chart */
    
    /* Donut dashboard chart */
    
    
    // Morris.Donut({
    //     element: 'dashboard-donut-1',
    //     data: [
    //         // {label: "u2ext", value: u2ext_count},
    //         // {label: "u2int", value: u2int_count},
    //         // {label: "u2int_in", value: u2int_in_count},
    //         // {label: "f1qext", value: f1qext_count},
    //         // {label: "f1qint", value: f1qint_count},
    //         // {label: "f1qint_in", value: f1qint_in_count},
    //         // {label: "tubext", value: tubext_count},
    //         // {label: "tubint", value: tubint_count},
    //         // {label: "tubint_in", value: tubint_in_count},
    //         {label: "cbint", value: cbint_count},
    //         {label: "cbext" , value: cbext_count}
    //     ],
    //     colors: ['#78281f', '#e74c3c'], // '#f5b7b1', '#512e5f', '#884ea0', '#d7bde2', '#7e5109', '#d68910', '#f8c471', '#1b2631', '#566573'],
    //     resize: true
    // });
    
    //  setTimeout(function(){
    //     Morris.Donut({
    //         element: 'dashboard-donut-1',
    //         data: [
    //             {label: "U+2 External", value: u2ext_count},
    //             {label: "U+2 Internal", value: u2int_count},
    //             {label: "U+2 Internal Inch", value: u2int_in_count},
    //             {label: "4+1Q External", value: f1qext_count},
    //             {label: "4+1Q Internal", value: f1qint_count},
    //             {label: "4+1Q Internal Inch", value: f1qint_in_count},
    //             {label: "TUBE BAG External", value: tubext_count},
    //             {label: "TUBE BAG Internal", value: tubint_count},
    //             {label: "TUBE BAG Internal Inch", value: tubint_in_count},
    //             {label: "CBAFFLE External", value: cbint_count},
    //             {label: "CBAFFLE Internal", value: cbext_count}
    //             // {label: "Expired", value: 10}
    //         ],
    //         colors: ['#33414E', '#1caf9a', '#FEA223', '#E04B4A', '#f5b7b1', '#512e5f', '#884ea0', '#d7bde2', '#7e5109', '#d68910', '#f8c471'],
    //         resize: true
    //     }); 
    //  }, 1000);
    
        
    /* END Donut dashboard chart */
// 	alert(u2ext_count);
	
    /* Bar dashboard chart */
    Morris.Bar({
        element: 'dashboard-bar-1',
        data: [
            { y: 'Oct 10', a: 75, b: 35 },
            { y: 'Oct 11', a: 64, b: 26 },
            { y: 'Oct 12', a: 78, b: 39 },
            { y: 'Oct 13', a: 82, b: 34 },
            { y: 'Oct 14', a: 86, b: 39 },
            { y: 'Oct 15', a: 94, b: 40 },
            { y: 'Oct 16', a: 96, b: 41 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['New Users', 'Returned'],
        barColors: ['#33414E', '#1caf9a'],
        gridTextSize: '10px',
        hideHover: true,
        resize: true,
        gridLineColor: '#E5E5E5'
    });
    /* END Bar dashboard chart */
    
    /* Line dashboard chart */
    Morris.Line({
      element: 'dashboard-line-1',
      data: [
        { y: '2014-10-10', a: 2,b: 4},
        { y: '2014-10-11', a: 4,b: 6},
        { y: '2014-10-12', a: 7,b: 10},
        { y: '2014-10-13', a: 5,b: 7},
        { y: '2014-10-14', a: 6,b: 9},
        { y: '2014-10-15', a: 9,b: 12},
        { y: '2014-10-16', a: 18,b: 20}
      ],
      xkey: 'y',
      ykeys: ['a','b'],
      labels: ['Sales','Event'],
      resize: true,
      hideHover: true,
      xLabels: 'day',
      gridTextSize: '10px',
      lineColors: ['#1caf9a','#33414E'],
      gridLineColor: '#E5E5E5'
    });   
    /* EMD Line dashboard chart */
    /* Moris Area Chart */
      Morris.Area({
      element: 'dashboard-area-1',
      data: [
        { y: '2014-10-10', a: 17,b: 19},
        { y: '2014-10-11', a: 19,b: 21},
        { y: '2014-10-12', a: 22,b: 25},
        { y: '2014-10-13', a: 20,b: 22},
        { y: '2014-10-14', a: 21,b: 24},
        { y: '2014-10-15', a: 34,b: 37},
        { y: '2014-10-16', a: 43,b: 45}
      ],
      xkey: 'y',
      ykeys: ['a','b'],
      labels: ['Sales','Event'],
      resize: true,
      hideHover: true,
      xLabels: 'day',
      gridTextSize: '10px',
      lineColors: ['#1caf9a','#33414E'],
      gridLineColor: '#E5E5E5'
    });
    /* End Moris Area Chart */
    /* Vector Map */
    var jvm_wm = new jvm.WorldMap({container: $('#dashboard-map-seles'),
                                    map: 'world_mill_en', 
                                    backgroundColor: '#FFFFFF',                                      
                                    regionsSelectable: true,
                                    regionStyle: {selected: {fill: '#B64645'},
                                                    initial: {fill: '#33414E'}},
                                    markerStyle: {initial: {fill: '#1caf9a',
                                                   stroke: '#1caf9a'}},
                                    markers: [{latLng: [22.7196, 75.8577], name: 'Indore'},
                                              {latLng: [50.27, 30.31], name: 'Kyiv - 1'},
                                              {latLng: [52.52, 13.40], name: 'Berlin - 2'},
                                              {latLng: [48.85, 2.35], name: 'Paris - 1'},                                            
                                              {latLng: [51.51, -0.13], name: 'London - 3'},                                                                                                      
                                              {latLng: [40.71, -74.00], name: 'New York - 5'},
                                              {latLng: [35.38, 139.69], name: 'Tokyo - 12'},
                                              {latLng: [37.78, -122.41], name: 'San Francisco - 8'},
                                              {latLng: [28.61, 77.20], name: 'New Delhi - 4'},
                                              {latLng: [39.91, 116.39], name: 'Beijing - 3'}]
                                });    
    /* END Vector Map */

    
    $(".x-navigation-minimize").on("click",function(){
        setTimeout(function(){
            // rdc_resize();
        },200);    
    });
    
    
});

