// run a controller and send a 500 JSON error if it throws

const json = require('../views/jsonView');

function wrap(fn) {
  return async function (req, res) {
    try {
      await fn(req, res);
    } catch (err) {
      return json.fail(res, err.status || 500, err.message);
    }
  };
}

module.exports = wrap;
