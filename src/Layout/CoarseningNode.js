var LNode = require('./LNode');
var Integer = require('./Integer');

function CoarseningNode(gm, vNode) {
  if(gm == null && vNode == null){
    LNode.call(this, null, null);
  }
  else {
    LNode.call(this, gm, vNode);
  }
  this.weight = 1;
}

CoarseningNode.prototype = Object.create(LNode.prototype);
for (var prop in LNode) {
  CoarseningNode[prop] = LNode[prop];
}

CoarseningNode.prototype.setMatched = function(matched)
{
  this.matched = matched;
};

CoarseningNode.prototype.isMatched = function()
{
  return this.matched;
};

CoarseningNode.prototype.getWeight = function()
{
  return this.weight;
};

CoarseningNode.prototype.setWeight = function(weight)
{
  this.weight = weight;
};

CoarseningNode.prototype.getNode1 = function()
{
  return this.node1;
};

CoarseningNode.prototype.setNode1 = function(node1)
{
  this.node1 = node1;
};

CoarseningNode.prototype.getNode2 = function()
{
  return this.node2;
};

CoarseningNode.prototype.setNode2 = function(node2)
{
  this.node2 = node2;
};

CoarseningNode.prototype.getReference = function()
{
  return this.reference;
};

CoarseningNode.prototype.setReference = function(reference)
{
  this.reference = reference;
};

/**
 * This method returns the matching of this node
 * if this node does not have any unmacthed neighbor then returns null
 */
CoarseningNode.prototype.getMatching = function()
{
  var minWeighted = null;
  var minWeight = Integer.MAX_VALUE;
  
  var neighborsList = this.getNeighborsList(); 
  
  var keys = Object.keys(neighborsList.set);
  var length = keys.length;
  for (var i = 0; i < length; i++) { 
//  Object.keys(neighborsList.set).forEach(function(nodeId){
    var v = neighborsList.set[keys[i]]; 
    
    if((!v.isMatched()) && (v != this) && (v.getWeight() < minWeight))
    {
      minWeighted = v;
      minWeight = v.getWeight();
    }
  }
  return minWeighted;
};

module.exports = CoarseningNode;
