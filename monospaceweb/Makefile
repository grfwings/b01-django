all: templates/monospaceweb/index.html

clean:
	rm -f templates/monospaceweb/index.html

templates/monospaceweb/index.html: static/markdown/index.md templates/monospaceweb/template.html Makefile
	pandoc -s \
	       --css reset.css \
	       --css index.css \
	       -i $< -o $@ \
	       --template=templates/monospaceweb/template.html

.PHONY: all clean
