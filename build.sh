#!/bin/sh
ruby gen.rb wiz > spells.partial
haml spellbook.haml engine/content/spellbook.html
ruby gen.rb druid > spells.partial
haml spellbook.haml engine/content/druid.html
haml index.haml engine/content/index.html
~/.gem/bin/lessc spellbook.less engine/content/spellbook.css
~/.gem/bin/lessc main.less engine/content/main.css

