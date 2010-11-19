function console_log(s) {
  if(console!=undefined) {
    console.log(s);
  } 
}
var spell_table = 'spells';
var SB = {
  init: function() {
    SB.db = google.gears.factory.create('beta.database');
	  $('#spells input:checkbox.known').live('change',SB.known);
	  $('#spells input.ready').live('change',SB.ready);
		$('#view').bind('change',SB.refresh_view);
		$('#book').bind('change',SB.load_state);
		$('#controls input').live('change',SB.filter_school);
		SB.db.open("spells");
		SB.db.execute("create table if not exists " + spell_table + " (book text, name text, known int, memorized int, ready int, PRIMARY KEY(book,name))");

		$('#view').val('all');
    SB.load_state();		
  },
	load_state: function() {
		// init states
		var book = $("#book").val();
		$(".level .known_count").val(0);
		$(".spell .known").attr('checked',false);
		$(".level .ready_count").val(0);
		$(".spell .ready").val(null);
		$(".spell").removeClass("known");
		$(".spell").removeClass("memorized");
	  var rs = SB.db.execute("select name,known,memorized,ready from spells where book = ?",[book]);
		var count = 0;
		while(rs.isValidRow()) {
		  var name = rs.field(0);
			var known = rs.field(1)==1;
			var ready = parseInt(rs.field(3) || 0);
      var memorized = !isNaN(ready)&&ready>0;
			console_log("book: " + book + " name: " + name + " known " + known + " memorized " + memorized + ' ready ' + ready);
			var spell = $('#'+name);
			if(known) 
				spell.addClass("known");			
			else 
				spell.removeClass("known");			
		  spell.find(".known").attr('checked',known);
			if(memorized) 
				spell.addClass("memorized");
			else
				spell.removeClass("memorized");			
		  spell.find(".ready").val(ready);
   		rs.next();
		}
		rs.close();
		SB.refresh_view();
	},
	update: function(name) {
		var book = $("#book").val();
		var p = $("#" + name)
		var known = p.find(".known").is(":checked") ? 1 : 0;
		var ready = p.find(".ready").val();
    var memorized = 0;
		console_log("update: " + " book " + book + " name " + name + " known " + known + " memorized " + memorized + " ready " + ready);
		SB.db.execute("replace into spells (book,name,known,memorized,ready) values (?,?,?,?,?)",[book,name,known,memorized,ready]);
  },	
	filter_school: function(e) {
	  var cb = $(e.target);
		var school = cb.val();
		if(cb.is(":checked"))
  		$('#spells .spell.' + school).show();
		else 
  		$('#spells .spell.' + school).hide();
	},
	memorized: function(e) {
	  SB.update_spell_state(e,'memorized');
	},
	known: function(e) {
	  SB.update_spell_state(e,'known');
    SB.update_known_counter($(e.target).closest(".level"));
	},
	ready: function(e) {
    var ready = $(e.target);
	  SB.update(ready.closest(".spell").attr('id'));
    SB.update_ready_counter(ready.closest(".level"));
	},
  update_known_counter: function(lvl) {
    lvl.find('.known_count').html( lvl.find('.known:checked').size() );
  },
  update_ready_counter: function(lvl) {
    var count=0;
    lvl.find('.ready').each(function(){ 
      var val = parseInt($(this).val());
      count += isNaN(val) ? 0 : val;
    });
    lvl.find('.ready_count').html(count);
  },
	update_spell_state: function(e,class) {
		var cb = $(e.target);
		var sp = cb.closest(".spell");
		sp.toggleClass(class,cb.is(":checked"));
		SB.update(sp.attr('id'));
	},
	refresh_view: function(e) {
	  var view = $('#view').val();
    if(view == 'known') {
		  $('#spells .spell').not('known').hide();
		  $('#spells .spell.known').show();
		}
		else if(view == 'memorized') {
		  $('#spells .spell').not('momorized').hide();
		  $('#spells .spell.memorized').show();
		}
		else {
		  $('#spells .spell').show();
		}
    $('.level').each(function(){ 
      SB.update_known_counter($(this));
      SB.update_ready_counter($(this));
    });
	}
};

jQuery(document).ready(function() {
  SB.init();
});

