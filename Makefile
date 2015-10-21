test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		-R spec \
		test/render \
		test/unit

.PHONY: test
