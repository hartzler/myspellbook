#!/bin/sh
ruby gen.rb > spells.partial
haml spellbook.haml engine/content/spellbook.html
~/.gem/bin/lessc spellbook.less engine/content/spellbook.css

