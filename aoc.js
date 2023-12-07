const assert = require('assert');
const axios = require('axios');
const env = require('dotenv');
const path = require('path')

env.config({ path: path.resolve(__dirname, './.env') })

const isTesting = process.argv[2] === 'test';

function engine({
    day,
    parts
}) {
    this.run = () => {
        this.getInput()
            .then(() => {
                this.out()
            });
    }

    this.input = {
        url: `https://adventofcode.com/${process.env.EVENT_YEAR}/day/${day}/input`,
        data: {}
    }

    this.getInput = () => {
        if (isTesting) {
            return Promise.resolve();
        }

        return axios
            .get(this.input.url, {
                headers: {
                    Cookie: `session=${process.env.SESSION}`
                }
            })
            .then(this.handleInput)
            .catch(this.handleError)
    }

    this.handleInput = (res) => {
        console.log('Success: data fetching')
        this.input.data = res.data;
    }

    this.handleError = (err) => {
        console.error('Error: ', err);
    }

    this.out = () => {
        console.log(`Configuration: ${ isTesting ? 'test' : 'production' }`);

        if (parts.length === 0) {
            console.error("Error: no parts provided.");
        }
        parts.forEach(x => this.outInternal(x));
    }

    this.outInternal = (part) => {
        if (!part.resolve) {
            console.error("Error: missing part resolver.");
            return;
        }

        let input = isTesting && part.test && part.test.in
            ? part.test.in
            : this.input.data
        
        if (part.parse) {
            input = part.parse(input)
        }

        let result = part.resolve(input);
        
        if (isTesting) {
            assert.strictEqual(result, part.test.out, "Error: test data failed")
            console.log(`Expected: ${part.test.out}, Actual: ${result}`);
        } else {
            console.log(`Part: ${part.name}, Answer: ${result}`);
        }
    }
}

function aoc (args) {
    new engine(args).run();
}

module.exports = aoc;
