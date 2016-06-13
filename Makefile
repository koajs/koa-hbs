test:
	@NODE_ENV=test node ./node_modules/mocha/bin/mocha \
		-R spec \
		test/render \
		test/unit

.PHONY: test
