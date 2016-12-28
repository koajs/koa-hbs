test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		-R spec \
		--harmony-async-await \
		test/render \
		test/unit

.PHONY: test
