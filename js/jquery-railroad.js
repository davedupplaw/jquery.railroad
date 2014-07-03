/* global document, jQuery */

(function($){

var RailRoadWidget = {

	_init : function() {
	
		this.stations = [];		
		this.railroadDiv = $('<div class="railroad"/>');
		this.railroadDiv.attr( "id", this.element.attr("id")+"_railroad");
		
		this.element.empty();
		this.element.append( this.railroadDiv );
		
		if( this.element.attr( "data-railroad-colour" ) ) {
			this.options.colour = this.options.stationColour = this.element.attr( "data-railroad-colour" );
		}
	},
	
	addIntersectionStation: function( stationName, stationDescription, id )
	{
		var div = $("<div id='"+id+"' class='railroad_intersection'/>").css( 'min-height', this.options.intersectionSize+"px" );

		var svg = this._svg( this.options.intersectionSize, this.options.expandedTrack );
		svg.append( this._svgLine( this.options.railroadElementWidth/2, 0, 
			this.options.railroadElementWidth/2, this.options.expandedTrack, 
			this.options.colour, this.options.width ) );
		svg.append( this._svgCircle( this.options.railroadElementWidth/2, this.options.intersectionSize/2, 
			this.options.intersectionSize/2, this.options.intersectionColour, this.options.width, 'white' ) );
		
		var wrapperDiv = $("<div class='railroad_display'/>");
		wrapperDiv.append( svg ).height( this.options.intersectionSize );
		div.append( wrapperDiv );
		
		div.append( "<div class='railroad_intersection_name'>"+stationName+"</div>");
		
		if( typeof stationDescription === 'object' && 'jquery' in stationDescription ) {
			div.append( stationDescription );
		} else {
			div.append( "<div class='railroad_intersection_description'>"+stationDescription+"</div>" );
		}
	
		if( !this.options.newestAtTop ) {
				this.railroadDiv.append( div );
		}
		else {
			this.railroadDiv.prepend( div );
		}
	},

	addIntersectingLine: function( lineName, lineDescription, lineId, lineColour, intersectionDirection ) 
	{
		var div = $("<div id='"+lineId+"' class='railroad_lineIntersection'></div>" ).css( 'min-height', this.options.stationSize+"px" );

		// We add two rows for the intersection. 
		//    * The first row has the information about the line.
		//    * The second row has the line

		// First row is here
		var row1 = $("<div id='"+lineId+"_info' class='railroad_lineIntersection_info_line'></div>" );

		var svg = this._svg( this.options.railroadElementWidth, this.options.stationSize );
		svg.append( this._svgLine( this.options.railroadElementWidth/2, 0, 
			    this.options.railroadElementWidth/2, this.options.stationSize, 
			    this.options.colour, this.options.width ) );
		var wrapperDiv = $("<div class='railroad_display'/>");
		wrapperDiv.append( svg ).height( this.options.stationSize );
		row1.append( wrapperDiv );

		row1.append( "<div class='railroad_line_name'><span>"+lineName+"</span></div>" );
		if( typeof lineDescription === 'object' && 'jquery' in lineDescription ) {
			row1.append( lineDescription );
		} else {
			row1.append( "<div class='railroad_line_description'>"+lineDescription+"</div>" );
		}

		// Second row is here.
		var row2 = $("<div id='"+lineId+"_line' class='railroad_lineIntersection_line'></div>" ).css( 'min-height', this.options.stationSize+"px" );
		svg = this._svg( "100%", this.options.expandedTrack );
		wrapperDiv = $("<div class='railroad_display'/>");
		wrapperDiv.append( svg ).height( this.options.stationSize );
		row2.append( wrapperDiv );
		if( intersectionDirection === "up" ) {
			div.append( row2 );
			div.append( row1 );
		} else {
			div.append( row1 );
			div.append( row2 );
		}

		// Add both rows here
		if( !this.options.newestAtTop ) {
			this.railroadDiv.append( div );
		}
		else {
			this.railroadDiv.prepend( div );
		}

		var svgWidth = svg.width();
		var dottedWidth = 40;

		var line;
		if( intersectionDirection === "up" ) {
			svg.append( this._svgCurve( this.options.railroadElementWidth/2, 0,
						    this.options.railroadElementWidth/5*3, this.options.intersectionSize-this.options.width,
						    this.options.railroadElementWidth, this.options.intersectionSize-this.options.width,
						    lineColour, this.options.width ) );
			svg.append( this._svgLine( this.options.railroadElementWidth, this.options.intersectionSize-this.options.width,
					           svgWidth-dottedWidth, this.options.intersectionSize-this.options.width, lineColour, this.options.width ) );
			line = this._svgLine( svgWidth-dottedWidth, this.options.intersectionSize-this.options.width,
					          svgWidth, this.options.intersectionSize-this.options.width, lineColour, this.options.width );
			line.setAttribute( 'stroke-dasharray', this.options.width+","+this.options.width );
			svg.append( line );
		} else {
			svg.append( this._svgCurve( this.options.railroadElementWidth/2, this.options.intersectionSize,
						    this.options.railroadElementWidth/5*3, this.options.width,
						    this.options.railroadElementWidth, this.options.width,
						    lineColour, this.options.width ) );
			svg.append( this._svgLine( this.options.railroadElementWidth, this.options.width,
					           svgWidth-dottedWidth, this.options.width, lineColour, this.options.width ) );
			line = this._svgLine( svgWidth-dottedWidth, this.options.width,
					          svgWidth, this.options.width, lineColour, this.options.width );
			line.setAttribute( 'stroke-dasharray', this.options.width+","+this.options.width );
			svg.append( line );
		}

		svg.append( this._svgLine( 
			this.options.railroadElementWidth/2, 0, 
			this.options.railroadElementWidth/2, this.options.expandedTrack, 
			this.options.colour, this.options.width ) );


		row1.height( Math.max( row1.find('.railroad_line_name').height(), row1.find('.railroad_line_description').height() ) );
	},
	
	addStation: function( stationName, stationDescription, id )
	{
		var div = $("<div id='"+id+"' class='railroad_station'></div>" ).css( 'min-height', this.options.stationSize+"px" );
		
		var svg = this._svg( this.options.railroadElementWidth, this.options.expandedTrack );
		svg.append( this._svgLine( 
			this.options.railroadElementWidth/2, this.options.stationSize/2, 
			this.options.railroadElementWidth/2+this.options.stationStubLength, this.options.stationSize/2, 
			this.options.stationColour, this.options.width ) );
		svg.append( this._svgLine( 
			this.options.railroadElementWidth/2, 0, 
			this.options.railroadElementWidth/2, this.options.expandedTrack, 
			this.options.colour, this.options.width ) );
		
		var wrapperDiv = $("<div class='railroad_display'/>");
		wrapperDiv.append( svg ).height( this.options.stationSize );
		div.append( wrapperDiv );

		div.append( "<div class='railroad_station_name'><span>"+stationName+"</span></div>" );
		if( typeof stationDescription === 'object' && 'jquery' in stationDescription ) {
			div.append( stationDescription );
		} else {
			div.append( "<div class='railroad_intersection_description'>"+stationDescription+"</div>" );
		}
	
		
		if( !this.options.newestAtTop ) {
				this.railroadDiv.append( div );
		}
		else {
			this.railroadDiv.prepend( div );
		}
	},
	
	addEndStop: function( stationName, stationDescription, id, direction )
	{
		var div = $("<div id='"+id+"' class='railroad_station'></div>" ).css( 'min-height', this.options.stationSize+"px" );
		
		var svg = this._svg( this.options.railroadElementWidth, this.options.expandedTrack );
		svg.append( this._svgLine( 
			this.options.railroadElementWidth/2-this.options.stationStubLength, this.options.stationSize/2, 
			this.options.railroadElementWidth/2+this.options.stationStubLength, this.options.stationSize/2, 
			this.options.stationColour, this.options.width ) );


		if( direction === "up" ) {
			svg.append( this._svgLine( 
				this.options.railroadElementWidth/2, this.options.stationSize/2, 
				this.options.railroadElementWidth/2, this.options.expandedTrack, 
				this.options.colour, this.options.width ) );
		} else {
			svg.append( this._svgLine( 
				this.options.railroadElementWidth/2, 0, 
				this.options.railroadElementWidth/2, this.options.stationSize/2, 
				this.options.colour, this.options.width ) );
		}
		
		var wrapperDiv = $("<div class='railroad_display'/>");
		wrapperDiv.append( svg ).height( this.options.stationSize );
		div.append( wrapperDiv );

		div.append( "<div class='railroad_station_name'><span>"+stationName+"</span></div>" );
		if( typeof stationDescription === 'object' && 'jquery' in stationDescription ) {
			div.append( stationDescription );
		} else {
			div.append( "<div class='railroad_intersection_description'>"+stationDescription+"</div>" );
		}
	
		
		if( !this.options.newestAtTop ) {
			this.railroadDiv.append( div );
		}
		else {
			this.railroadDiv.prepend( div );
		}
	},

	addPredictedLine: function( length )
	{
		var l = this.options.intersectionSize;
		if( length ) { 
			l = length;
		}
		var svg = this._svg( this.options.railroadElementWidth, l );
		var line = this._svgLine( this.options.railroadElementWidth/2, 0, 
			this.options.railroadElementWidth/2, l,
			this.options.colour, this.options.width );
		line.setAttribute( 'stroke-dasharray', this.options.width+","+this.options.width );
		svg.append( line );
	
		if( !this.options.newestAtTop ) {
				this.railroadDiv.append( svg );
		}
		else {
			this.railroadDiv.prepend( svg );
		}
	},
	
	_svgLine: function( x1, y1, x2, y2, stroke, strokeWidth )
	{
	    var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
	    newLine.setAttribute( 'x1',x1 );
	    newLine.setAttribute( 'y1',y1 );
	    newLine.setAttribute( 'x2',x2 );
	    newLine.setAttribute( 'y2',y2 );
	    newLine.setAttribute( 'stroke', stroke );
	    newLine.setAttribute( 'stroke-width', strokeWidth );
	    return newLine;
	},

	_svgCurve: function( x1, y1, c1, c2, x2, y2, stroke, strokeWidth )
	{
		var newCurve = document.createElementNS('http://www.w3.org/2000/svg','path');
		var cc1 = c1 - x1;
		var cc2 = c2 - y1;
		var xx2 = x2 - x1;
		var yy2 = y2 - y1;
		newCurve.setAttribute("d", "M "+x1+" "+y1+" q "+cc1+" "+cc2+" "+xx2+" "+yy2 );
		newCurve.setAttribute( 'stroke', stroke );
		newCurve.setAttribute( 'stroke-width', strokeWidth );
		newCurve.setAttribute( 'fill', 'none' );
		return newCurve;
	},
	
	_svgCircle: function( x, y, radius, stroke, strokeWidth, fillColour )
	{
	    var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
	    circle.setAttribute( 'cx',x );
	    circle.setAttribute( 'cy',y );
	    circle.setAttribute( 'r', radius-strokeWidth/2 );
	    circle.setAttribute( 'stroke', stroke );
	    circle.setAttribute( 'stroke-width', strokeWidth );
	    circle.setAttribute( 'fill', fillColour );
	    return circle;
	},
	
	_svg: function( width, height )
	{
		var svg = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"/>');
		svg.width( width );
		svg.height( height );
		return svg;
	},

	setColour: function( colour ) {
		this.options.colour = colour;
		this.options.stationColour = colour;
	},

	options: {
		colour: 'red',
		width: 8,
		railroadElementWidth: 50,
		intersectionSize: 50,
		intersectionColour: 'black',
		stationSize: 45,
		stationColour: 'red',
		newestAtTop: false,
		stationStubLength: 15,
		expandedTrack: 400
	}
};

$.widget( "dd.railroad", RailRoadWidget );

}(jQuery));
