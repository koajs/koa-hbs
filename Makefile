test:
	@NODE_ENV=test node --harmony ./node_modules/.bin/mocha \
		-R spec \
		test/render \
		test/unit

.PHONY: test
