test:
	@NODE_ENV=test node --node-harmony ./node_modules/.bin/mocha \
		-R spec \
		test/render \
		test/unit

.PHONY: test
