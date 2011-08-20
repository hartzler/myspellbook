function console_log(s) {
  try {
    console.log(s);
  }
  catch(err) { }
}
var spell_table = 'spells';
var SB = {
  init: function() {
	  $('.export').live('click',SB.export_state);
	  $('.import').live('click',SB.import_state);
	  $('#spells .learn').live('click',SB.learn);
	  $('#spells .memorize').live('click',SB.memorize);
	  $('#spells .forget').live('click',SB.forget);
	  $('.level h4 span.toggle').live('click',SB.toggle_header_click);
		$('#view').bind('change',SB.refresh_view);
		$('#book').bind('change',SB.load_state);
		$('#controls input').live('change',SB.filter_school);
 /*
    SB.db = google.gears.factory.create('beta.database');
		SB.db.open("spells");
		SB.db.execute("create table if not exists " + spell_table + " (book text, name text, known int, memorized int, ready int, PRIMARY KEY(book,name))");
*/

		$('#view').val('all');
    SB.load_state();		
  },
	load_state: function() {
		// init states
		var book = $("#book").val();
		$(".level .known_count").val(0);
		$(".spell .known").attr('checked',false);
		$(".level .memorized_count").val(0);
		$(".spell").removeClass("known");
		$(".spell").removeClass("memorized");

    /*
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
    */
		SB.refresh_view();
	},
	update: function(name) {
    /*
		var book = $("#book").val();
		var p = $("#" + name)
		var known = p.find(".known").is(":checked") ? 1 : 0;
		var ready = p.find(".ready").val();
    var memorized = 0;
		console_log("update: " + " book " + book + " name " + name + " known " + known + " memorized " + memorized + " ready " + ready);
		SB.db.execute("replace into spells (book,name,known,memorized,ready) values (?,?,?,?,?)",[book,name,known,memorized,ready]);
    */
  },	
	filter_school: function(e) {
	  var cb = $(e.target);
		var school = cb.val();
		if(cb.is(":checked"))
  		$('#spells .spell.' + school).show();
		else 
  		$('#spells .spell.' + school).hide();
	},
	memorize: function(e) {
    //SB.update_counter($(e.target).closest(".level"),'memorized');
    var a = $(e.target)
    var spell = a.closest('.spell').clone();
    spell.attr('rel',spell.attr('id'));
    spell.removeAttr('id');
    a.closest('.level').find('.memorized_spells').append(spell);
    return false;
	},
	learn: function(e) {
	  SB.update_spell_state(e,'known');
    SB.update_counter($(e.target).closest(".level"),'known');
    return false;
	},
  forget: function(e) {
    $(e.target).closest(".spell").remove();   
    return false;
  },
  update_counter: function(lvl,class) {
    lvl.find('.'+class+'_count').html( lvl.find('.'+class+':checked').size() );
  },
	update_spell_state: function(e,class) {
		var a = $(e.target);
		var sp = a.closest(".spell");
		sp.addClass(class);
    sp.appendTo(sp.closest(".level").find("."+class+"_spells"))
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
      SB.update_counter($(this),'known');
    });
	},
  toggle_header_click: function(e) {
    SB.toggle_header( $(e.target) );
  },
  toggle_header: function(s) {
		var d = s.closest('h4').next();
    var n = d.is(':visible') ? '+' : '-';
    d.slideToggle();
		s.html(n);
  },
  export_state: function() {
    var state = {};
    $('.level').each(function(i) {
      var level = $(this);
      var level_state = {};
      level_state["memorized_spells"] = $.map(level.find(".memorized_spells .spell"), function(s){ return $(s).attr('rel');});
      level_state["known_spells"] = $.map(level.find(".known_spells .spell"), function(s){ return $(s).attr('id');});
      state[level.attr('id')] = level_state;
    });
    $('#state').val(JSON.stringify(state));
    return false;
  },
  import_state: function() {
    //var state = JSON.parse(prompt("state"));
    var state = JSON.parse($("#state").val());
    var l,s;
    for(l in state) {
      var level = $('#'+l);
      var known = level.find('.known_spells');
      for(s in state[l]["known_spells"]) {
        $('#'+state[l]["known_spells"][s]).addClass('known').appendTo(known);
      }
      var memorized = level.find('.memorized_spells');
      for(s in state[l]["memorized_spells"]) {
        var spell = $('#'+state[l]["memorized_spells"][s]).clone();
        spell.attr('rel', spell.attr('id'));
        spell.removeAttr('id');
        spell.addClass('memorized');
        spell.appendTo(memorized); 
      }
      SB.update_counter(level,'known');
      SB.update_counter(level,'memorized');
    }
    return false;
  }
};

jQuery(document).ready(function() {
  SB.init();
});

