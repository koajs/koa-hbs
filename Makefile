test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony-generators \
		--recursive \
		-R spec \
		test/ \
		--bail

.PHONY: test
