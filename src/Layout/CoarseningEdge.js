var CoSEEdge = require('./CoSEEdge');

function CoarseningEdge(source, target, vEdge) {
  CoSEEdge.call(this, source, target, vEdge);
}

CoarseningEdge.prototype = Object.create(CoSEEdge.prototype);
for (var prop in CoSEEdge) {
  CoarseningEdge[prop] = CoSEEdge[prop];
}

module.exports = CoarseningEdge;