const sheets = new Sheets({
    key: '1J-UuARS1ZgsRa1w6KXsnk5G_aDJf6zmYsI0-T0PORlc' //,
    //query: "select * where D = 'C'"
})

//let variable shifts in value
let bardata = []

const  margin = {top: 30, right: 30, bottom: 40, left: 30 }
const  height = 900 - margin.top - margin.bottom,
    width = 1000 - margin.left- margin.right,
    barWidth = 10,
    barOffset = 5

//Linear scale for numbers in order.
const yScale = d3.scale.linear()
    // Y axis from number zero through the max barData value. Domain represents the
    // boundaries within your data.
    .domain([0, 100])
    //Y axis from 0 to the height noted above.
    .range([0, height])

    sheets.getData(data => {
        //loop through records and output to the screen:
        bardata = data
        console.log(data)
        buildChart()

    })


const buildChart = () => {

//------------------- X Horizontal Axis ------------------- //

//Ordinal Scale are numbers in no particlar order.
const  xScale= d3.scale.ordinal()
//X axis from number zero to the length of barData.
    .domain(d3.range(0,bardata.length))
    .rangeBands([0, width])

// Various colors for the vertical bars. "Domain" manipulates colors along the X axis.
// Range manipulates, the entire bar color along the Y axis.
const  colors = d3.scale.linear()
     .domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
     .range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

//var  tempColor;

//Creating and styling the tool tip
const  tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('padding','0 10px')
    .style('background', 'white')
    .style('opacity', 0)


//------------------------Labeling the X Axis  ---------------------------- //

/* Some starting text to begin label the X axis. Need to define svg or d3.select
//the element before using it.
svg.append('text')
    .attr('class', 'x label')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height - 6)
    .text('income per capita, inflation-adjusted (dollars)')*/


//------------------------The Chart Area ------------------------------- //


// Select id chart and appending an svg to it.
const  myChart = d3.select('#chart').append('svg')
  // Add background color of the box that the chart area sits in.
  .style('background', '#E7E0CB')
  // Adding width and height to the chart box. Adding L, R, T, B margin noted by const above
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left+','+margin.top + ')')
// 'Rect' represents each vertical bar on the bar chart.
    .selectAll('rect').data(bardata)
    .enter().append('rect')
        .style('fill', function(d, i) {
            return colors(i)
        })
        .attr('width', xScale.rangeBand())
        .attr('height', 0)

        //'d' passing along data and 'i' index of the data array. Creating space
        // between each vertical bar.
        .attr('x', function(d,i){
          return i * (barWidth + barOffset + .5)
        })


//-----------------The Mouse Over Interaction with Tool Tip ---------------//

.on('mouseover', function(d) {
    console.log(d)
      tooltip.transition()
        .style('opacity', .9)
        // Adjusting the position of the tool tip
        .style('left', (d3.event.pageX -30 ) + 'px')
        .style('top', (d3.event.pageY- 35) + 'px')
        // Placing Year and Event from Sheets (Column A and B) into the tooltip box
        tooltip.html(
            '<span style="color:red"><h1>' + d.year + '</h1>' +
            '<p>' + d.category + '</p>' +
            '<p>' + d.event + '</p>' +
            '<p> Location: ' + d.location + '</p>'

        )

//-----------Writing a conditional to render images in the tooltip----------//
          /*if (d.link exists) {
          return the d.link img src link in the tool tip
        }*/
//---------------------Ternery Operators-----------------------------------//
          //condition ? expr1 : expr2
          //This means if condition is true then return expr 1 value. Otherwise, return value expr2.


//If want to include picture and description in tool tip box
//tooltip.html("<span style='color:red'><h1>Tombouctou Region</h1><br><ahref='http://en.wikipedia.org/wiki/Tombouctou_Region'><img src='http://upload.wikimedia.org/wikipedia/commons/b/b3/Mali_Tombouctou.png'></ahref></span> <span style='color:blue'><h2>Mali !!!!!!! </h2></span>")

        tempColor = this.style.fill
            d3.select(this)
              .style('opacity', .5)
              .style('fill', 'yellow')
        })

        .on('mouseout', function(d) {
            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor)
        })

//Animation of the chart. Bringing the chart contents up once page is refreshed.
 myChart.transition()
   .attr('height', getHeight)
   .attr('y', getY)
   .delay(function(d, i) {
       return i * 50
   })
   .duration(1000)
   .ease('elastic')

//---------------------- Y Axis Guide ----------------------------//

var vGuideScale = d3.scale.linear ()
	.domain([0, d3.max(bardata)])
	.range([height, 0])

/*var vAxis = d3.svg.axis()
	.scale(vGuideScale)
	.orient('left')
	.ticks(10)*/

 var vGuide = d3.select('svg').append('g')
	vAxis(vGuide)

	vGuide.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
	vGuide.selectAll('path')
		  .style({ fill: 'none', stroke: '#000'})
	vGuide.selectAll('line')
		.style({stroke: '#000'})
}

// Assigning height values to code P, US and all else to 50.
const getHeight = function (d) {
    let y = 50
    if (d.code === 'P') {
        y = 100
    } else if (d.code === 'US') {
        y = 80
    }

    const h =  yScale(y)
    console.log('Height:', h, y, d.code)
    return h
}

const getY = function (d) {
    const y = height - getHeight(d)
    console.log('y:', y)
    return y
}
