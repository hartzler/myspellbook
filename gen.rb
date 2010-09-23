#!/usr/bin/env ruby
require 'rubygems'
require 'fastercsv'
require 'haml'
require 'ostruct'

headers = nil
# headers = ["name", "school", "subschool", "descriptor", "spell_level", "casting_time", "components", "costly_components", "range", "area", "effect", "targets", "duration", "dismissible", "shapeable", "saving_throw", "spell_resistence", "description", "description_formated", "source", "full_text", "verbal", "somatic", "material", "focus", "divine_focus", "sor", "wiz", "cleric", "druid", "ranger", "bard", "paladin", "deity"]

cols = {}
# cols = {:paladin=>32, :verbal=>21, :range=>8, :wiz=>27, :shapeable=>14, :descriptor=>3, :deity=>33, :somatic=>22, :area=>9, :cleric=>28, :saving_throw=>15, :spell_level=>4, :material=>23, :effect=>10, :druid=>29, :source=>19, :spell_resistence=>16, :casting_time=>5, :focus=>24, :description=>17, :targets=>11, :ranger=>30, :description_formated=>18, :components=>6, :divine_focus=>25, :duration=>12, :school=>1, :name=>0, :bard=>31, :full_text=>20, :costly_components=>7, :sor=>26, :dismissible=>13, :subschool=>2}

def h(s)
  s.to_s.gsub("<","&lt;").gsub(">","&gt;").gsub("&","&amp;")
end

haml=Haml::Engine.new(open("spell.haml"){|f| f.read})

spells = []
FasterCSV.foreach("data.csv") do |row|
  case headers
	when nil
    headers = row.map(&:to_sym)
		row.inject(cols){|h,f| h[f.to_sym] = row.index(f); h}
	else
		data = {}
		row.size.times{|i| data[headers[i]] = row[i] }

    next unless data[:wiz] =~ /[0-9]/
    next unless data[:source] =~ /Core/


    scope=OpenStruct.new(data)
    scope.spell_id = 'spell-' + data[:name].downcase.gsub(" ",'-')
		scope.description = h(scope.description).gsub("\n","<br>")
		sources = []
		sources << 'core' if scope.source =~ /Core/
		sources << 'apg' if scope.source =~ /APG/
		scope.classes = ([scope.school, :wiz,'wiz-%d'%scope.wiz,  ]+sources).compact.join(" ")
		 
		spells << scope

	end
end

bylevel = spells.inject({}){|h,f|(h[f.wiz]||=[])<<f; h}
bylevel.keys.sort.each do |level|
  puts "<a id=\"a-#{level}\"><h3>Level #{level}</h3></a>"
  puts "<div id=\"level-#{level}\" class=\"level\">"
  bylevel[level].each do |scope|
    puts haml.render(scope)
  end
	puts "<div class=\"endlevel\"></div></div>"
end


