test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony-generators \
		-R spec \
		test/render \
		--bail

.PHONY: test
