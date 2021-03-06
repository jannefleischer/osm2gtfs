//Make a tags objects. Each key value pair in XML is turned into an Object with the same key/value pair
	 var nodes = {};
	 var ways = {};
	 var relations = {};
	 
  //take XML data returned by overpass API and make objects
	 var parseOverpassXML = function(overpassXML) { 
	 //console.log("entering parse function");
	 
	 //helper functions to get the parsing done
		var tagToObj = function($node) {
			//console.log("in tag to obj");
			var tags = {};
			$node.find('tag').each(function() {
				var $t = $(this);
				tags[$t.attr('k')] = $t.attr('v');
				//console.log($t.attr('k') + " " + $t.attr('v'));
			});
			return tags;
		}
			

		var ndToObj = function($way) {
			//console.log("in ref to obj");
			var nd = new Array();
			$way.find('nd').each(function() {
				var $w = $(this);
				nd.push($w.attr('ref'));
			});
			return nd;
		}

		var memToObj = function($relation){
			//console.log("in member to obj");
			var members = {};
			$relation.find('member').each(function() {
				var $r = $(this);
				members[$r.attr('ref')] = {	ref: $r.attr('ref'),
											type: $r.attr('type'),
											role: $r.attr('role')
											};
			});
			console.log(members);
			return members;
		}


	 //Make a nodes object. 
		$(overpassXML).find('node').each( function() {
				//console.log("in node find loop");
				var $node = $(this);
				var tagObj = tagToObj($node);
				nodes[$node.attr('id')] = {	id: $node.attr('id'),
											lat: $node.attr('lat'),
											lon: $node.attr('lon'),
											tag: tagObj,
											isStop: tagObj.public_transport === 'stop_position'
				};
				//console.log(nodes[$node.attr('id')].isStop);
		});

		//Making a way object
		$(overpassXML).find('way').each( function() {
			//console.log("in way find loop");
			var $way = $(this);
			ways[$way.attr('id')] = { 	id: $way.attr('id'),
										nd: ndToObj($way),
										tag: tagToObj($way)
									};
		});

		//Make a relation object
		$(overpassXML).find('relation').each( function() {
			//console.log("in realtion find loop");
			var $relation = $(this);
			var tagObj = tagToObj($relation);
			relations[$relation.attr('id')] = {	id: $relation.attr('id'),
												members: memToObj($relation),
												//memberWay: memToObj($relation, 'way'),
												//memberRelation: memToObj($relation, 'relation'),
												tag: tagObj,
												isRoute: tagObj.type === "route"
												};
			});

		//send back object of objects
		return [nodes, ways, relations];

		
	};