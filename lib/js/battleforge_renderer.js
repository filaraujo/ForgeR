/**
 * @description				Battleforge  Renderer functionality
*	 @classDescription		Instantiates the renderer
 * @author							Filipe Araujo * 
 * @version						1.0
* 	@constructor
 */
Battleforge.renderer = (function(){
	/**
		 * @memberOf Battleforge.renderer
		 * @private
		 * @type {Object} rarity
		 */
	var rarity = {
		C: { name: 'common' },
		U: { name: 'uncommon' },
		R: { name: 'rare' },
	    UR: { name: 'ultrarare' }
	},
	/**
		 * @memberOf Battleforge.renderer
		 * @private
		 * @type {Object} orb
		 */
	era = new Array("era1","era2","era3","era4"),
	
	/**
		*	Compiles cards HTML from cards object and appends to stage
		*	@memberOf Battleforge.renderer
		*/
	populateStage = function(stage){
		var cardlist = '',
				upgrade = (stage == 'collection') ? 3 : 0; 
				
		jQuery.each(Battleforge.cards, function(i,val){
			cardlist += prepData(val, upgrade);
		})
		
		document.getElementById(stage+"Stage").innerHTML = cardlist;
	},
	/**
		*	Prepare data object 
		*	@memberOf Battleforge.renderer
		* @param {Object} card Card Object
		* @param {number} upgrade max upgrade level
		* @return {String} output cardlist html output
		*/
	prepData = function(card, upgrade){
		
		var 	data = {},
				count = 0,
				output ='';
		
		for(count; count <= upgrade; count++){
					
			data = {
				attack: card.attack,
				category: card.category,
				color: card.color,
				cost: card.cost,
				defense: card.defense,
				era: era[card.era -1],
				health: card.size,
				id: card.id,
				level: {
					level0: card.level0,
					level1: card.level1,
					level2: card.level2,
					level3: card.level3
				},
				name: card.name,
				portrait: card.name.toLowerCase().replace(/(')|(\s)/g,""),
				orb: card.orb.split("").reverse(),
				quantity: card.quantity,
				rarity: rarity[card.rarity].name,
				status: collection = Battleforge.collection[card.id]["upgrade"+count] ? "own" : "want",
				type: card.type,
				upgrade: count,
				weapon: card.weapon
			}
				output += cardTemplate(data);
			
		}
		
		output = (upgrade == 3) ? groupTemplate(data, output) : output;
		
		return output;				
	}
	/**
		*	Create individual cards
		*	@memberOf Battleforge.renderer
		* @param {Object} card Card Object
		* @return {String} new_card card html returned
		*/
	cardTemplate = function(card){
		var new_card;
		
		new_card =	'<div id="'+card.id+'" class="layout '+card.color+' '+card.rarity+' '+card.era+' '+card.type+' '+' upgrade'+card.upgrade+' '+card.status+'">'+
								'<div class="card"></div>'+
								'<div class="portrait '+card.portrait+'"></div>'+
								'<div class="name">'+card.name+'</div>'+
								'<div class="cost">'+card.cost+'</div>'+
								'<ul class="orb">'+
									'<li class="one '+card.orb[0]+'"></li>'+
									'<li class="two '+card.orb[1]+'"></li>'+
									'<li class="three '+card.orb[2]+'"></li>'+
									'<li class="four '+card.orb[3]+'"></li>'+
								'</ul>'+
								'<div class="info">'+
									'<ul class="upgrades0">'+createUpgrades(card.level.level0)+'</ul>'+
									'<ul class="upgrades1">'+createUpgrades(card.level.level1)+'</ul>'+
									'<ul class="upgrades2">'+createUpgrades(card.level.level2)+'</ul>'+									
									'<ul class="upgrades3">'+createUpgrades(card.level.level3)+'</ul>'+
								'</div>'+								
								'<div class="category">'+card.category+'</div>';
														
		if(card.type == 'creature' || card.type == 'building'){
			new_card += 	'<div class="footer"></div>'+
										'<div class="attack">'+card.attack+'</div>'+
										'<div class="defense">'+card.defense+'</div>';
		}
		
		if(card.type ==	'creature'){
			new_card +=	'<div class="health '+card.health+'"></div>' +
										'<div class="weapontype '+card.weapon+'"></div>';
		}
		
		new_card += 	'<div class="status"></div>'+
									'<div class="rarity '+card.rarity+'"></div>'+
									'</div>';
								
		return new_card;
	}
	/**
		*	Create card grouping for collections
		*	@memberOf Battleforge.renderer
		* @param {Object} card Card Object
		* @return {String} group group html returned
		*/
	groupTemplate = function(card, card_group){	 
											
		var  group = 	'<div class="card_group'+card.id+' '+card.color+' '+card.rarity+' '+card.era+' '+card.type+'">'+
									'<h1>'+card.name+'</h1>'+	card_group+
									'</div>';
		return group;
	}
	
	/**
		*	Creates claim  list
		* @memberOf Battleforge.renderer
		 * @param {Object} event event executed
		*/
	createClaim = function(id){	
		var 	honor = { 
			C: { upgrade1: '0', upgrade2: '0', upgrade3: '1'},
			U: { upgrade1: '0', upgrade2: '0', upgrade3: '5'}, 
			R: { upgrade1: '0', upgrade2: '0', upgrade3: '10'},
			UR: { upgrade1: '0', upgrade2: '0', upgrade3: '20'}
			},
			victory = { 
				C: { upgrade1: '0', upgrade2: '6', upgrade3: '18'},
				U: { upgrade1: '1', upgrade2: '12', upgrade3: '25'}, 
				R: { upgrade1: '2', upgrade2: '20', upgrade3: '50'},
				UR: { upgrade1: '4', upgrade2: '30', upgrade3: '70'}
			},
			battle = { 
				C: { upgrade1: '10', upgrade2: '35', upgrade3: '70'},
				U: { upgrade1: '15', upgrade2: '40', upgrade3: '80'}, 
				R: { upgrade1: '20', upgrade2: '50', upgrade3: '100'},
				UR: { upgrade1: '30', upgrade2: '60', upgrade3: '120'}
			},
			pvp = { 
				C: { upgrade1: '1', upgrade2: '6', upgrade3: '10', uname1:'one', uname2:'six', uname3:'ten'},
				U: { upgrade1: '3', upgrade2: '9', upgrade3: '12', uname1:'three', uname2:'nine', uname3:'twelve'}, 
				R: { upgrade1: '8', upgrade2: '13', upgrade3: '14', uname1:'eight', uname2:'thirteen', uname3:'fourteen'},
				UR: { upgrade1: '11', upgrade2: '16', upgrade3: '17', uname1:'eleven', uname2:'sixteen', uname3:'seventeen'}
			},
			rarity = Battleforge.cards[id].rarity,
			count = 1,
			upgrade,
			output = '';
		
		for(count; count<4; count++){
			output+= 	'<li class="u'+count+'">'+
									'<div class="honor">'+
										honor[rarity]["upgrade"+count]+' Tokens'+
									'</div>'+
									'<div class="victory">'+
										victory[rarity]["upgrade"+count]+' Tokens'+
									'</div>'+
									'<div class="battle">'+
										battle[rarity]["upgrade"+count] +' Tokens'+
									'</div>'+
									'<div class="pvp rank_'+pvp[rarity]['uname'+count]+' ">'+
										'Rank '+pvp[rarity][upgrade]+
									'</div>'+
								'</li>';
		}
		
		return output;
	},
	/**
		*	Creates card info
		* @memberOf Battleforge.renderer
		*/
	createInfo = function(){
		var output;
		switch (Battleforge.selected.tab.name){			
			case 'upgrade0':
			case 'upgrade1':
			case 'upgrade2':
			case 'upgrade3':
				output = Battleforge.selected.model.find(".upgrades"+Battleforge.selected.tab.level).html();
				break;
			case 'loot':
				output = createLoot(Battleforge.selected.id);
				break;
			case 'claim':
				output = createClaim(Battleforge.selected.id);
				break;
			default:
				break;			
		}
		jQuery("#"+Battleforge.selected.tab.name).html(output);		
	}
	
	/**
		*	Creates loot list
		* @memberOf Battleforge.renderer
		 * @param {Object} event event executed
		*/
	createLoot = function(id){		
		var loot,
			count = 1,
			output = '';
		for(count; count<4; count++){
			loot = Battleforge.cards[id]['loot'+count];
			if(loot.length == 0) break;
			output+='<li class="u'+count+'">';
						
			jQuery.each(loot, function(i,val){
				output+='<b>'+val.map+'</b><p>'+val.difficulty+' ('+val.players+' player map)</p>';
			})
			output+='</li>'
		}
		return output;
	},
	/**
		*	Creates upgrade listings
		* @memberOf Battleforge.renderer
		 * @param {Object} upgrade Card level passed
		* @return {String} listing upgrade listing string returned
		*/
	createUpgrades = function(upgrade){
		var listing ='';
		
		if(upgrade == '') return '<li>Not updated yet</li>';
		
		jQuery.each(upgrade, function(i,val){
			var uera  = (val.rank) ? val.rank : '0';
			listing +=	'<li class="'+val.type +'">'+
									'<span class="uera'+uera+'">'+val.name+'</span>'+
								'</li>'+
								'<li>'+val.description+'</li>' ;
		});
		return listing;
	},
	/**
		*	Scale the Card stage
		* @memberOf Battleforge.renderer
		 * @param {string} value Scale size
		*/
	scaleStage = function(value){
		var size;
		switch(value){
			case 50:
				size = "default";
				break
			case 100:			
				size = "hd";
				break;
			default:
				size = "thumb";
				break;
		}
		 jQuery('#body').attr("class",size);
	}
		 
	 return {
	 /**
		*	Renders card
		* @memberOf Battleforge.renderer
		 * @param {Object} card Card Object
		*/
	 	init: function(stage){
			populateStage('listing');
			populateStage('collection');
		},
		/**
		*	Scale card
		* @memberOf Battleforge.renderer
		 * @param {string} value Scale size
		*/
		scale:function(value){
			scaleStage(value);
		},
		/**
		*	create card info
		* @memberOf Battleforge.renderer
		*/
		info:function(){
			createInfo();
		}
	 }	 
})()