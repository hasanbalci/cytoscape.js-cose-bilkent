var LGraphManager = require('./LGraphManager');
var CoarseningGraph = require('./CoarseningGraph');
var CoarseningNode = require('./CoarseningNode');
var CoarseningEdge = require('./CoarseningEdge');
var CoSEEdge = require('./CoSEEdge');
var HashMap = require('./HashMap');

function CoSEGraphManager(layout) {
  LGraphManager.call(this, layout);
}

CoSEGraphManager.prototype = Object.create(LGraphManager.prototype);
for (var prop in LGraphManager) {
  CoSEGraphManager[prop] = LGraphManager[prop];
}

// -----------------------------------------------------------------------------
// Section: Coarsening
// -----------------------------------------------------------------------------

/**
 * This method returns a list of CoSEGraphManager. 
 * Returned list holds graphs finer to coarser (M0 to Mk)
 * Additionally, this method is only called by M0.
 */

CoSEGraphManager.prototype.coarsenGraph = function() 
{
  var MList = [];
  var prevNodeCount;
  var currNodeCount;
  
  // "this" graph manager holds the finest (input) graph
  MList.push(this);
  
  // coarsening graph G holds only the leaf nodes and the edges between them 
  // which are considered for coarsening process
  var G = new CoarseningGraph(this.getLayout());
  
  // construct G0
  this.convertToCoarseningGraph(this.getRoot(), G);
  currNodeCount = G.getNodes().length;
  
  var lastM, newM;
  
  // if two graphs Gi and Gi+1 have the same order, 
  // then Gi = Gi+1 is the coarsest graph (Gk), so stop coarsening process
  do {
    prevNodeCount = currNodeCount;

    // coarsen Gi
    G.coarsen();

    // get current coarsest graph lastM = Mi and construct newM = Mi+1
    lastM = MList[MList.length-1];
    newM = this.coarsen(lastM);

    MList.push(newM);
    currNodeCount = G.getNodes().length;

  } while ((prevNodeCount != currNodeCount) && (currNodeCount > 1));  
  
  // change currently being used graph manager
  this.getLayout().setGraphManager(this);

  MList.pop();
  return MList;
};

/**
 * This method converts given CoSEGraph to CoarseningGraph G0
 * G0 consists of leaf nodes of CoSEGraph and edges between them
 */
CoSEGraphManager.prototype.convertToCoarseningGraph = function(coseG, G)
{
  // we need a mapping between nodes in M0 and G0, for constructing the edges of G0
  var map = new HashMap();
  
  // construct nodes of G0
  var nodes = coseG.getNodes();
  for (var i = 0; i < nodes.length; i++) {
    var v = nodes[i];

    // if current node is compound, 
    // then make a recursive call with child graph of current compound node 
    if (v.getChild() != null)
    {
      this.convertToCoarseningGraph(v.getChild(), G);
    }   
    else // otherwise current node is a leaf, and should be in the G0
    {
      // v is a leaf node in CoSE graph, and is referenced by u in G0
      var u = new CoarseningNode();
      u.setReference(v);

      // construct a mapping between v (from CoSE graph) and u (from coarsening graph)
      map.put(v, u);

      G.add( u );
    }  
  }
  
  // construct edges of G0
  var edges = coseG.getEdges();
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
      // if neither source nor target of e is a compound node
      // then, e is an edge between two leaf nodes
      if ((e.getSource().getChild() == null) && (e.getTarget().getChild() == null))
      {
        G.add(new CoarseningEdge(), map.get(e.getSource()), map.get(e.getTarget()));
      }
  }
};

/**
 * This method gets Mi (lastM) and coarsens to Mi+1
 * Mi+1 is returned.
 */
CoSEGraphManager.prototype.coarsen = function(lastM){

  // create Mi+1 and root graph of it
  var newM = new CoSEGraphManager(lastM.getLayout());
  
  // change currently being used graph manager
  newM.getLayout().setGraphManager(newM);
  newM.addRoot();
  
  newM.getRoot().vGraphObject = lastM.getRoot().vGraphObject;
  
  // construct nodes of the coarser graph Mi+1
  this.coarsenNodes(lastM.getRoot(), newM.getRoot());
  
  // change currently being used graph manager
  lastM.getLayout().setGraphManager(lastM);

  // add edges to the coarser graph Mi+1
  this.addEdges(lastM, newM);
  
  return newM;
};

/**
 * This method coarsens nodes of Mi and creates nodes of the coarser graph Mi+1
 * g: Mi, coarserG: Mi+1
 */
CoSEGraphManager.prototype.coarsenNodes = function(g, coarserG){
  var nodes = g.getNodes();
  for (var i = 0; i < nodes.length; i++) {
    var v = nodes[i];
    // if v is compound
    // then, create the compound node v.next with an empty child graph
    // and, make a recursive call with v.child (Mi) and v.next.child (Mi+1)
    if (v.getChild() != null)
    {
      v.setNext(coarserG.getGraphManager().getLayout().newNode(null));
      coarserG.getGraphManager().add(coarserG.getGraphManager().getLayout().newGraph(null), v.getNext());
      v.getNext().setPred1(v);
      coarserG.add(v.getNext());

      //v.getNext().getChild().vGraphObject = v.getChild().vGraphObject;

      this.coarsenNodes(v.getChild(), v.getNext().getChild());
    }
    else
    {
      // v.next can be referenced by two nodes, so first check if it is processed before
      if (!v.getNext().isProcessed())
      {
        coarserG.add( v.getNext() );
        v.getNext().setProcessed(true);
      }
    }
    //v.getNext().vGraphObject = v.vGraphObject;

    // set location
    v.getNext().setLocation(v.getLocation().x, v.getLocation().y);
    v.getNext().setHeight(v.getHeight());
    v.getNext().setWidth(v.getWidth());
  }
};

/**
 * This method adds edges to the coarser graph.
 * It should be called after coarsenNodes method is executed
 * lastM: Mi, newM: Mi+1
 */
CoSEGraphManager.prototype.addEdges = function(lastM, newM){

  var allEdges = lastM.getAllEdges();
  for (var i = 0; i < allEdges.length; i++) {
    var e = allEdges[i];

    // if e is an inter-graph edge or source or target of e is compound 
    // then, e has not contracted during coarsening process. Add e to the coarser graph.
    if ( e.isInterGraph || (e.getSource().getChild() != null) || (e.getTarget().getChild() != null) )
    {
      // check if e is not added before
      if ( ! e.getSource().getNext().getNeighborsList().contains((e.getTarget()).getNext()) )
      {
        newM.add(newM.getLayout().newEdge(null), e.getSource().getNext(), e.getTarget().getNext());
      }
    }
    // otherwise, if e is not contracted during coarsening process
    // then, add it to the  coarser graph
    else
    {
      if (e.getSource().getNext() != e.getTarget().getNext())
      {
        // check if e is not added before
        if (!e.getSource().getNext().getNeighborsList().contains(e.getTarget().getNext()))
        {
          newM.add(newM.getLayout().newEdge(null), e.getSource().getNext(), e.getTarget().getNext());
        }
      }
    }
  }
};

module.exports = CoSEGraphManager;
