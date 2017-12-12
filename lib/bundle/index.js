const question = require('./query');
const generate = require('./generate');

module.exports = function *() {
  const answer = yield question();
  yield generate(answer);
};
