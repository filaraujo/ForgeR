/**
 * @description		Battleforge DB functionality
 * @required				 jquery
 * @author					Filipe Araujo * 
 * @version				1.1
 */
Battleforge.db = (function() {	
	/**
		* Init the DB
		* @memberOf Battleforge.db
		*/
	initDB = function(){		
		var 	storage_file = air.File.applicationStorageDirectory.resolvePath( 'collection.db' ),
				old_storage_file = air.File.applicationDirectory.resolvePath("collection/collection.db");
				file =  air.File.applicationDirectory.resolvePath("collection/collectionBackup.db");
		
		if (!storage_file.exists && old_storage_file.exists) { old_storage_file.copyTo(storage_file, true)	}  
		else if(!storage_file.exists){ file.copyTo(storage_file, true) }
		else{}
		
		Battleforge.db.conn = new air.SQLConnection();
		Battleforge.db.conn.addEventListener( air.SQLEvent.OPEN, getCollection);
		Battleforge.db.conn.open( storage_file );
	}
	/**
		* Converts db into an Object
		* @memberOf Battleforge.db
		*/
	getCollection = function(event){
		this.sql = new air.SQLStatement();
		this.sql.sqlConnection = Battleforge.db.conn;
		
		this.sql.text = 'SELECT * FROM cards';
		this.sql.execute();
		
		result = this.sql.getResult();
		
		jQuery.each(result.data, function(i,val){
			Battleforge.collection[i+1] = {
				upgrade0: val.upgrade0,
				upgrade1: val.upgrade1,
				upgrade2: val.upgrade2,
				upgrade3: val.upgrade3,
			};
		})
	},
	/**
		* update db object
		* @memberOf Battleforge.db
		*/
	updateCollection = function(){
		Battleforge.updated = { 
			add: { action:'remove', value: 1, status: 'own'}, 
			remove: { action:'add', value: 0, status: 'want'},
		}
		this.sql.addEventListener( air.SQLErrorEvent.ERROR, updateCollectionError );
		this.sql.addEventListener( air.SQLEvent.RESULT, updateCollectionSuccess);
		sql.text = 'UPDATE cards  SET '+Battleforge.selected.tab.name+' = ' + Battleforge.updated[Battleforge.selected.collection.action].value+' WHERE c_id =' + Battleforge.selected.id;
		
		sql.execute();
		
	},
	/**
		* update db success handler
		* @memberOf Battleforge.db
		*/
	updateCollectionSuccess = function(event){
		
		Battleforge.selected.collection = Battleforge.updated[Battleforge.selected.collection.action];		
		Battleforge.collection[Battleforge.selected.id][Battleforge.selected.tab.name] = Battleforge.selected.collection.value;		
	},
	/**
		* update db error handler
		* @memberOf Battleforge.db
		*/
	updateCollectionError = function(){  air.trace(event) },
	/**
		* get db error handler
		* @memberOf Battleforge.db
		*/
	getCollectionError = function(){ air.trace(event) } 
	

    return {
		/**
			*	Method to invoke application initiation
			* @memberOf Battleforge.db
			*/
		init : function(){
			initDB();
		},
		/**
			*	Method to invoke db manager
			* @memberOf Battleforge.db
			* @param {event} event click event
			*/
		manage: function(){
			updateCollection();
		},
    }
})()