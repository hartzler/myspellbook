#!/bin/sh
ruby gen.rb > spells.partial
haml spellbook.haml engine/content/spellbook.html
haml index.haml engine/content/index.html
~/.gem/bin/lessc spellbook.less engine/content/spellbook.css
~/.gem/bin/lessc main.less engine/content/main.css

