/**
 * @description			Battleforge  functionality
 * @required				 jquery
 * @author					Filipe Araujo * 
 * @version				1.1
 * 
 * 
 */
Battleforge = {}
Battleforge.collection = {}
/**
	 * Battleforge Management Object
	* @classDescription	Instantiates the manager
	* @constructor
	*/
Battleforge.app = (function() {
	/**
		 * 
		 * load icon complete event handler
		 * @memberOf Battleforge.app
		* @param {event} event load event passed
		 */
	iconLoadComplete = function(event){ 
        air.NativeApplication.nativeApplication.icon.bitmaps = [event.target.content.bitmapData]; 
    },	
	/**
		 * 
		 * Call updater, window, tray functions
		 * @memberOf Battleforge.app
		 */
	createApp = function(){
		createUpdater();
		createWin();
		createTray();
		Battleforge.db.init();
	},	
		/**
		 * 
		 * Create updater
		 * @memberOf Battleforge.app
		 */
	createUpdater = function(){
		this.appUpdater = new runtime.air.update.ApplicationUpdaterUI();	
		appUpdater.configurationFile = new runtime.flash.filesystem.File("app:/config/update.xml");
	    appUpdater.addEventListener(runtime.air.update.events.UpdateEvent.INITIALIZED, update);
		appUpdater.initialize();
	},
	/**
		 * 
		 * Create naigation tray
		 * @memberOf Battleforge.app
		 */
	createTray= function(){
		var iconLoad = new air.Loader();
	    var iconMenu = new air.NativeMenu(); 
		
		var open = iconMenu.addItem(new air.NativeMenuItem("Open"));
	    var exit = iconMenu.addItem(new air.NativeMenuItem("Exit"));		
		
	    exit.addEventListener(air.Event.SELECT, function(event){
	            air.NativeApplication.nativeApplication.icon.bitmaps = []; 
	            air.NativeApplication.nativeApplication.exit();
	    });		
		open.addEventListener(air.Event.SELECT,function(event){ 
	            air.NativeApplication.nativeApplication.activate();
				air.NativeApplication.nativeApplication.activeWindow.restore()
	    }); 
		
	    air.NativeApplication.nativeApplication.autoExit = false; 
		air.NativeApplication.nativeApplication.icon.tooltip = "Battleforge"; 
	    air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
		
	    iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		
	    if (air.NativeApplication.supportsSystemTrayIcon) { iconLoad.load(new air.URLRequest("images/icons/AIRApp_16.png")) } 
	    if (air.NativeApplication.supportsDockIcon) { iconLoad.load(new air.URLRequest("images/icons/AIRApp_128.png")) } 	   
	},
	/**
		 * 
		 * Create window functionality
		 * @memberOf Battleforge.app
		 */
	createWin = function(){		
		jQuery("#header").bind("mousedown", function(){ window.nativeWindow.startMove() })
		jQuery("a.min").bind("click", function(){ window.nativeWindow.minimize() })
		jQuery("a.close").bind("click", function(){ air.NativeApplication.nativeApplication.exit() })		
		jQuery("#version").html("v "+window.appUpdater.currentVersion);
	},
	/**
		 * 
		 * Update appilication
		 * @memberOf Battleforge.app
		 */
	update = function(){
		 this.appUpdater.checkNow();
	}

    return {
		/**
			*	Method to invoke application initiation
			* @memberOf Battleforge.manager
			* @param {string} feed URL of feed
			*/
		init : function(feed){
			createApp();
		},
    }
})()



/**
	 * Battleforge Management Object
	* @classDescription	Instantiates the manager
	* @constructor
	*/
Battleforge.manager = (function() {	

	var url = {
		/* browser calls */
		issue: 'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=postIssue&format=jsonp&jsoncallback=?',
		alphabetic: 'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=name&output=json&format=jsonp&jsoncallback=?',
		color:'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=color&output=json&format=jsonp&jsoncallback=?',
		type: 'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=type&output=json&format=jsonp&jsoncallback=?',
		/* app calls */
		issue: 'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=postIssue&format=jsonp',
		alphabetic:'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=name&output=json',
		color:'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=color&output=json',
		type:'http://www.filipearaujo.com/battleforge/libs/controllers.php?method=getCardList&orderby=type&output=json'
	},	
	
	/**
		 * 
		 * Makes ajax call to feed and request for JSONP data and
		 * converts JSON object into Battleforge.cards object
		 * @memberOf Battleforge.manager
		 */
	loadCards = function(method){
		Battleforge.ui.loader();
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			cache: false,
			url: url[method],
			success: function(data){
				
				Battleforge.cards = {}
				jQuery.each(data, function(key, val){
					Battleforge.cards[val.id] = val;
				})
				Battleforge.renderer.init();
				Battleforge.ui.loader();
			},
		});
	},	
	/**
		 * 
		 * Search through cards and match any items that contain the keyword
		 * and add clones to searchStage
		 * @memberOf Battleforge.manager
		 */
	searchCards = function(keyword){
		jQuery.each(Battleforge.cards, function(i,val){	
			if(val.name.toLowerCase().search(keyword) > -1){
				jQuery("#"+val.id).clone(true).show().appendTo("#searchStage");
			};
		})
	},
	/**
		 * 
		 * Submit issues
		 * @memberOf Battleforge.manager
		 */
	submitIssue = function(){
		Battleforge.ui.loader();
		
		var issue = new Object();		
		jQuery.each(jQuery(".required"), function(i,val){
			issue[jQuery(val).attr('name')] = jQuery(val).val();
		})
		
		jQuery.ajax({
			type: 'GET',
			data: { name: issue['name'] , email: issue['email'], message: issue['message'],  type: issue['i_type'] },
			dataType: 'json',
			cache: false,
			url: url.issue,
			success: function(data){				
				jQuery(".issues_feedback").html("Message Sent");
				jQuery(".required").val("");	
				Battleforge.ui.loader();
			},
		});
		
		return false; 
		
	}

    return {
		/**
			*	Method to invoke application initiation
			* @memberOf Battleforge.manager
			*/
		init : function(){
			Battleforge.app.init();
			Battleforge.ui.init();
			loadCards('color');
		},
		/**
			*	Method to invoke search 
			* @memberOf Battleforge.manager
			* @param {string} keyword Keyword used for searching through cards
			*/
		search: function(keyword){
			searchCards(keyword);
		},
		/**
			*	Method to invoke order initiation
			* @memberOf Battleforge.manager
			*/
		order : function(method){
			loadCards(method);
		}, 
		/**
			*	Method to invoke order initiation
			* @memberOf Battleforge.manager
			*/
		issue : function(){
			submitIssue();
		}
    }
})()


/**
	 * Battleforge Card Sorting Object
	* @classDescription	Instantiates the sorter
	* @constructor
	*/
Battleforge.sorter = (function(){
	
	var	registeredFilters = new Array(),
	
	/**
		*	apply  filters handles the how the application display card
		*	when filtered ( on, off )
		* @memberOf Battleforge.sorter
		 * @param {string} filter name of filter that is registered
		*/
	applyFilters = function(event){
		var filter = event.target.id;
		jQuery("#listingStage, #collectionStage").toggleClass(filter+'_filter');
		jQuery(event.target).toggleClass("off");
	},
	/**
		*	Reset the filters to show as displaying all
		* @memberOf Battleforge.sorter
		*/
	resetFilters = function(){
		jQuery(".filter").removeClass("off");
	}	
	return{
		/**
		*	Handles filter sorting
		* @memberOf Battleforge.sorter
		 * @param {string} element name of filter that is to be registered
		*/
		filter:function(event){
			applyFilters(event);
			return false;
		},
		/**
		*	Handles resetting
		* @memberOf Battleforge.sorter
		*/
		reset:function(){
			resetFilters();
		}
	}
})()


/**
	* jQuery Extension
	*/	
jQuery.extend(jQuery.expr[':'], {
	contains: function(a,i,m){
		return jQuery(a).text().toLowerCase().indexOf(m[3].toLowerCase())>=0;
	}
})
