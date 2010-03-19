/**
 * @description				Battleforge UI functionality
*	 @classDescription		Instantiates ui
 * @author							Filipe Araujo * 
 * @version						1.0
* 	@constructor
 */
Battleforge.ui = (function(){	
	/**
		 * 
		 * Create App ui functionality
		 * @memberOf Battleforge.ui
		 */
	createUI = function(){
			
		jQuery(".filter").click(Battleforge.sorter.filter);
		jQuery("#stage_holder a").click(switchStage);
		jQuery("#card_menu a").click(switchTabs);
		jQuery(".order").click(orderStage);
		jQuery("#feedback").click(toggleFeedback);
		
		jQuery("#query").keyup(function(){
			jQuery("#searchStage").empty();
			if (jQuery(this).val().length > 2) 
				Battleforge.manager.search(jQuery(this).val());
		})
		
		jQuery("#slider").slider({
			value: 0,
			min: 0,
			max: 100,
			step: 50,
			slide: function(event, ui){
				Battleforge.renderer.scale(ui.value);
			}
		});
				
		jQuery("#issues").validate({
			errorElement: "em",
			messages: {
				name: "*",
				email: { required: "*", email: "*" },
				message:"*"
			},
			submitHandler: function(){
				Battleforge.manager.issue();
			},
		});
		
		jQuery(".card").live("click", selectCard);		
	},	
	/**
	*	Prepare card info
	* @memberOf Battleforge.ui
	 * @param {Object} event event executed
	*/
	selectCard = function(event){
		var card = jQuery(this).parent().clone(),
				id = card.attr('id'),
				classes = card.attr('class'),
				upgrade = card.attr('class').split("upgrade")[1].split(" ")[0]
		 		 
		jQuery("#card_holder").html(card);
		
		Battleforge.selected = {
			model : card,
			id : id,
			classes : classes
		}
		jQuery("#card_menu #tab_upgrade"+upgrade).trigger("click");				
		return false;
	},
	/**
		*	Switch between stages
		* @memberOf Battleforge.ui
		* @param {Object} event event executed
		*/
	switchStage = function(event){
		var  stage = this.id.split('_')[1].split("Stage")[0];		
		
		if(this.nodeName == "INPUT") return false;
		
		jQuery(this).addClass("active").siblings().removeClass('active');
		jQuery("#forge").attr('class', stage);
		return false;
	},
	/**
		*	Switch between menu tabs
		* @memberOf Battleforge.ui
		* @param {Object} event event executed
		*/
	switchTabs = function(event){
		
		var 	tab = this.id.split('_')[1],
				level = tab.split("upgrade")[1] || null,
				own;
			
		Battleforge.selected.tab = { name : tab, level : level };
		own = Battleforge.collection[Battleforge.selected.id][Battleforge.selected.tab.name];
		Battleforge.selected.collection = {
			value: own,
			action: (own == 0) ? 'add': 'remove',
			status: (own == 0) ? 'want': 'own',
		};
			
		if(event.target.nodeName == "SPAN") {
			Battleforge.db.manage();
			updateCardCollection();
			return false;
		}
		
		if(Battleforge.selected == undefined){ return false }
				
		jQuery("#info_holder").attr('class', tab);		
		if(level != null){
			Battleforge.selected.model.removeClass("upgrade0 upgrade1 upgrade2 upgrade3").addClass("upgrade"+level).find(".upgrades"+level).show().siblings().hide();			
		}
				
		Battleforge.renderer.info();
		updateTab();
		
		return false;
	},
	/**
		*	Toggle form
		* @memberOf Battleforge.ui
		* @param {Object} event event executed
		*/
	toggleFeedback = function(){
			jQuery("#feedback").toggleClass('active');	
			jQuery("#feedbackStage").toggle('blind');	
			return false;
	},
	/**
		*	Order cards on stage
		* @memberOf Battleforge.ui
		 * @param {Object} event event executed
		*/
	orderStage = function(event){
		jQuery(".menu .order").removeClass("active").filter("#"+event.target.id).addClass("active");
		Battleforge.manager.order(event.target.id);
		return false;
	},
	updateCardCollection = function(){
		jQuery(".card_group"+Battleforge.selected.id+" ."+Battleforge.selected.tab.name).removeClass('own, want').addClass(Battleforge.selected.collection.status);
		updateTab();
	},
	updateTab = function(event){
		jQuery("#tab_"+Battleforge.selected.tab.name).attr('class','active ' + Battleforge.selected.collection.action).siblings().attr('class', '');
	}
	
	return{
		/**
			*	Initializes App UI
			* @memberOf Battleforge.ui
			*/
		init:function(){
			createUI();
		},
		/**
			*	Method to invoke loader 
			* @memberOf Battleforge.ui
			* @param {string} status Toggle value
			*/
		loader: function(){
			jQuery("#loader").toggleClass("on");
		},
	}	
})()
