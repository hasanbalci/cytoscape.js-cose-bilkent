var Organization = require('./Organization');

function MemberPack(childG) {
  this.members = [].concat(childG.getNodes());
  this.org = new Organization();
  this.layout();
  var nodes = [];

  for (var i = 0; i < childG.getNodes().length; i++)
  {
    nodes.push(childG.getNodes()[i]);
  }
};

MemberPack.prototype.layout = function() {
  var self = this;
  
  this.members.sort(function(a, b) {
    return a.getWidth() * a.getHeight() - b.getWidth() * b.getHeight();
  });
  
  this.members.forEach(function(node) {
    self.org.insertNode(node);
  });
};

MemberPack.prototype.getWidth = function() {
  return this.org.getWidth();
};

MemberPack.prototype.getHeight = function() {
  return this.org.getHeight();
};

MemberPack.prototype.adjustLocations = function(x, y) {
  this.org.adjustLocations(x, y);
};

MemberPack.prototype.getMembers = function() {
  return this.members;
};

module.exports = MemberPack;