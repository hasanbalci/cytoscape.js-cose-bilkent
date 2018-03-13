var LGraph = require('./LGraph');
var CoarseningNode = require('./CoarseningNode');
var CoarseningEdge = require('./CoarseningEdge');

function CoarseningGraph(parent, layout, vGraph) {
  
  if(layout == null && vGraph == null)
  {
    layout = parent;
    LGraph.call(this, null, layout, null);
    this.layout = layout;
  }
  else
  {
    LGraph.call(this, parent, layout, vGraph);
  }
}

CoarseningGraph.prototype = Object.create(LGraph.prototype);
for (var prop in LGraph) {
  CoarseningGraph[prop] = LGraph[prop];
}

/**
 * This method coarsens Gi to Gi+1
 */
CoarseningGraph.prototype.coarsen = function()
{
  this.unmatchAll();
  var v, u;
  
  if(this.getNodes().length > 0)
  {  
    // match each node with the one of the unmatched neighbors has minimum weight
    // if there is no unmatched neighbor, then match current node with itself    
    while(!((this.getNodes()[0].isMatched())))
    {
      // get an unmatched node (v) and (if exists) matching of it (u).
      v = this.getNodes()[0];  //Optimize
      u = v.getMatching();
      
      // node t is constructed by contracting u and v
      this.contract( v, u );
    }
    
    var nodes = this.getNodes();
    
    for(var i = 0; i < nodes.length; i++)
    {
      var y = nodes[i];
      
      // new CoSE node will be in Mi+1
      var z = this.layout.newNode(null);
      
      z.setPred1(y.getNode1().getReference());
      y.getNode1().getReference().setNext(z);
      
      // if current node is not matched with itself
      if(y.getNode2() != null)
      {
        z.setPred2(y.getNode2().getReference());
        y.getNode2().getReference().setNext(z);        
      }
      
      y.setReference(z);
    }
  }
};

/**
 * This method unflags all nodes as unmatched
 * it should be called before each coarsening process
 */
CoarseningGraph.prototype.unmatchAll = function()
{
  var node;
  var nodes = this.getNodes();
  
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.setMatched(false);
  }
};

/**
* This method contracts v and u
*/
CoarseningGraph.prototype.contract = function(v, u)
{
  // t will be constructed by contracting v and u	
  var t = new CoarseningNode();
  this.add(t); //Check this
  
  t.setNode1( v );
  
  var neighborsList = v.getNeighborsList();
//  Object.keys(neighborsList.set).forEach(function(nodeId){
//    var x = neighborsList.set[nodeId];
//    if(x != t)
//    {
//      this.add( new CoarseningEdge(), t, x );
//    }
//  });
  var keys = Object.keys(neighborsList.set);
  var length = keys.length;
  for (var i = 0; i < length; i++) {
    var x = neighborsList.set[keys[i]];
    if(x != t)
    {
      this.add( new CoarseningEdge(), t, x );
    }
  }
  
  t.setWeight(v.getWeight());
  
  //remove contracted node from the graph
  this.remove(v);

  // if v has an unmatched neighbor, then u is not null and t.node2 = u
  // otherwise, leave t.node2 as null
  if(u != null)
  {
    t.setNode2(u);
//    var neighborsList2 = u.getNeighborsList();
//    Object.keys(neighborsList2.set).forEach(function(nodeId){
//      var x = neighborsList2.set[nodeId];
//      if(x != t)
//      {
//        this.add(new CoarseningEdge(), t, x);
//      }
//    });
    var neighborsList = u.getNeighborsList();
    var keys = Object.keys(neighborsList.set);
    var length = keys.length;
    for (var i = 0; i < length; i++) {
      var x = neighborsList.set[keys[i]];
      if(x != t)
      {
        this.add( new CoarseningEdge(), t, x );
      }
    }
    t.setWeight(t.getWeight() + u.getWeight());
    
    //remove contracted node from the graph
    this.remove(u);
  }
  
  // t should be flagged as matched
  t.setMatched( true );
};

module.exports = CoarseningGraph;

