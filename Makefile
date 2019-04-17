.default: all
all:
.PHONY: all

component: check-name
	@sed -e 's/COMPONENT/$(NAME)/g' templates/component.tsx.tpl
.PHONY: component

check-name:
ifndef NAME
	$(error NAME is undefined)
endif
.PHONY: check-name


