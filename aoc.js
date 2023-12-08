const assert = require('assert');
const axios = require('axios');
const env = require('dotenv');
const fs = require('fs');
const path = require('path')

const args = (() => {
    let result = {
        isTesting: false,
    };
    let args = process.argv.slice(2);

    args.forEach(arg => {
        if (arg === 'test') {
          result.isTesting = true;
        }
      
        if (arg.startsWith('cache=')) {
          result.cache = arg.split('=')[1];
        }
      });

    return result;
})();

const OP_MESSAGES = {
    READ_CONF: 'reading config',
    FETCH_INPUT: 'fetching input',
    CACHE_INPUT: 'writing input to local cache',
    CACHE_READ: 'reading input from local cache'
}

try {
    const confPath = path.resolve(__dirname, './.env');
    env.config({ path: confPath });
    
    console.log(`Success: ${OP_MESSAGES.READ_CONF}: from ${confPath}`);
} catch (err) {
    console.log(`Error: ${OP_MESSAGES.READ_CONF}: ${err}`);
}

function engine({
    day,
    parts
}) {
    this.props = {
        year: process.env.EVENT_YEAR,
        links: {
            fetchInput: `https://adventofcode.com/${process.env.EVENT_YEAR}/day/${day}/input`
        },
        input: undefined
    }

    this.run = () => {
        console.log(`Running: AOC ${this.props.year}: day ${day}`);
        console.log(`Configuration: ${ args.isTesting ? 'test' : 'production' }`);

        this.getInput()
            .then(() => {
                this.out()
            });
    }

    this.getInput = () => {
        if (args.isTesting) {
            return Promise.resolve();
        }

        if (args.cache !== 'ignore') {
            try {
                const cacheFilePath = path.join(module.parent.path, "input.txt");
                if (fs.existsSync(cacheFilePath)) {
                    const cacheContent = fs.readFileSync(cacheFilePath, 'utf-8');
                    this.props.input = cacheContent;
                    console.log(`Success: ${OP_MESSAGES.CACHE_READ}`);
                    return Promise.resolve();
                }
            } catch (err) {
                console.error(`Error: ${OP_MESSAGES.CACHE_READ}: ${err}`)
            }
        }

        return axios
            .get(this.props.links.fetchInput, {
                headers: {
                    Cookie: `session=${process.env.SESSION}`
                }
            })
            .then(this.handleInput)
            .catch(this.handleError)
    }

    this.handleInput = (res) => {
        console.log(`Success: ${OP_MESSAGES.FETCH_INPUT}`)
        if (Boolean(process.env.CACHE_INPUT)) {
            this.cacheInput(res.data);
        }
        this.props.input = res.data;
    }

    this.handleError = (err) => {
        console.error(`Error: ${OP_MESSAGES.FETCH_INPUT}: HTTP - ${err.response.status}`);
    }

    this.cacheInput = (input) => {
        let filePath = path.join(module.parent.path, "input.txt");
        return fs.writeFileSync(filePath, input, (err) => {
            if (err) {
                console.error(`Error: ${OP_MESSAGES.CACHE_INPUT}`)
            } else {
                console.log(`Success: ${OP_MESSAGES.CACHE_INPUT}`);
            }
        })
    }

    this.out = () => {
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

        let input = args.isTesting && part.test && part.test.in
            ? part.test.in
            : this.props.input
        
        if (part.parse) {
            input = part.parse(input)
        }

        let result = part.resolve(input);
        
        if (args.isTesting) {
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
