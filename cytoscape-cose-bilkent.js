(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cytoscapeCoseBilkent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ns = {
	List: require('./src/List'),
	Node: require('./src/Node'),
};

if (typeof module !== 'undefined') {
	module.exports = ns;
} else if (typeof define !== 'undefined') {
	define('LinkedListJS', function () {
		return ns;
	});
} else if (typeof window !== 'undefined') {
	window.LinkedListJS = ns;
}
},{"./src/List":2,"./src/Node":3}],2:[function(require,module,exports){
var Node = require('./Node');

var List = function () {
	this._count = 0;
	this._head = null;
	this._tail = null;
};

List.prototype.head = function () {
	return this._head;
};

List.prototype.tail = function () {
	return this._tail;
};

List.prototype.count = function () {
	return this._count;
};

List.prototype.get = function (index) {
	var node = this._head;

	for (var i = 0; i < index; i++) {
		node = node.next();
	}

	return node;
};

List.prototype.set = function (index, value) {
	var node = this.get(index);
	node.set(value);
};

List.prototype.push = function (value) {
	var node = new Node(value, this._tail, null);

	if (this._tail !== null) {
		this._tail.setNext(node);
	}

	if (this._head === null) {
		this._head = node;
	}

	this._tail = node;
	this._count++;

	return node;
};

List.prototype.pop = function () {
	var node = this._tail;

	var new_tail = null;
	if (this._tail.previous() !== null) {
		new_tail = this._tail.previous();
		new_tail.setNext(null);
	}
	
	this._tail = new_tail;

	this._count--;

	if (this._count === 0) {
		this._head = null;
	}

	return node;
};

List.prototype.unshift = function (value) {
	var node = new Node(value, null, this._head);

	if (this._head !== null) {
		this._head.setPrevious(node);
	}

	if (this._tail === null) {
		this._tail = node;
	}
	
	this._head = node;

	this._count++;

	return node;
};

List.prototype.shift = function () {
	var node = this._head;

	var new_head = null;
	if (this._head.next() !== null) {
		new_head = this._head.next();
		new_head.setPrevious(null);
	}

	this._head = new_head;

	this._count--;

	if (this._count === 0) {
		this._tail = null;
	}

	return node;
};

List.prototype.asArray = function () {
	var arr = [];
	var node = this._head;

	while (node) {
		arr.push(node.value());
		node = node.next();
	}

	return arr;
};

List.prototype.truncateTo = function (length) {
	this._count = length;

	if (length === 0) {
		this._head = null;
		this._tail = null;

		return;
	}

	var node = this.get(length-1);
	node.setNext(null);
	this._tail = node;
};

List.prototype.empty = function () {
	this.truncateTo(0);
};

List.prototype.isEmpty = function () {
	return this._head === null;
};

List.prototype.find = function (value) {
	var node = this._head;

	while (node !== null) {
		if (node.value() === value) {
			return node;
		}

		node = node.next();
	}

	return null;
};

List.prototype.each = function (callback) {
	var node = this._head;
	var i = 0;
	while (node !== null) {
		callback(i, node);
		node = node.next();
		i++;
	}
}

module.exports = List;
},{"./Node":3}],3:[function(require,module,exports){
var Node = function (value, previous, next) {
	this._value = value === undefined ? null : value;
	
	this._previous = previous === undefined ? null : previous;
	this._next = next === undefined ? null : next;
};

Node.prototype.value = function () {
	return this._value;
};

Node.prototype.previous = function () {
	return this._previous;
};

Node.prototype.next = function () {
	return this._next;
};

Node.prototype.set = function (value) {
	this._value = value;
};

Node.prototype.setPrevious = function (node) {
	this._previous = node;
};

Node.prototype.setNext = function (node) {
	this._next = node;
};

Node.prototype.isHead = function () {
	return this._previous === null;
};

Node.prototype.isTail = function () {
	return this._next === null;
};

module.exports = Node;
},{}],4:[function(require,module,exports){
'use strict';

var FDLayoutConstants = require('./FDLayoutConstants');

function CoSEConstants() {}

//CoSEConstants inherits static props in FDLayoutConstants
for (var prop in FDLayoutConstants) {
  CoSEConstants[prop] = FDLayoutConstants[prop];
}

CoSEConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = true;
CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
CoSEConstants.DEFAULT_COMPONENT_SEPERATION = 60;
CoSEConstants.TILE = true;
CoSEConstants.TILING_PADDING_VERTICAL = 10;
CoSEConstants.TILING_PADDING_HORIZONTAL = 10;

module.exports = CoSEConstants;

},{"./FDLayoutConstants":16}],5:[function(require,module,exports){
'use strict';

var FDLayoutEdge = require('./FDLayoutEdge');

function CoSEEdge(source, target, vEdge) {
  FDLayoutEdge.call(this, source, target, vEdge);
}

CoSEEdge.prototype = Object.create(FDLayoutEdge.prototype);
for (var prop in FDLayoutEdge) {
  CoSEEdge[prop] = FDLayoutEdge[prop];
}

module.exports = CoSEEdge;

},{"./FDLayoutEdge":17}],6:[function(require,module,exports){
'use strict';

var LGraph = require('./LGraph');

function CoSEGraph(parent, graphMgr, vGraph) {
  LGraph.call(this, parent, graphMgr, vGraph);
}

CoSEGraph.prototype = Object.create(LGraph.prototype);
for (var prop in LGraph) {
  CoSEGraph[prop] = LGraph[prop];
}

module.exports = CoSEGraph;

},{"./LGraph":25}],7:[function(require,module,exports){
'use strict';

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

CoSEGraphManager.prototype.coarsenGraph = function () {
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
    lastM = MList[MList.length - 1];
    newM = this.coarsen(lastM);

    MList.push(newM);
    currNodeCount = G.getNodes().length;
  } while (prevNodeCount != currNodeCount && currNodeCount > 1);

  // change currently being used graph manager
  this.getLayout().setGraphManager(this);

  MList.pop();
  return MList;
};

/**
 * This method converts given CoSEGraph to CoarseningGraph G0
 * G0 consists of leaf nodes of CoSEGraph and edges between them
 */
CoSEGraphManager.prototype.convertToCoarseningGraph = function (coseG, G) {
  // we need a mapping between nodes in M0 and G0, for constructing the edges of G0
  var map = new HashMap();

  // construct nodes of G0
  var nodes = coseG.getNodes();
  for (var i = 0; i < nodes.length; i++) {
    var v = nodes[i];

    // if current node is compound, 
    // then make a recursive call with child graph of current compound node 
    if (v.getChild() != null) {
      this.convertToCoarseningGraph(v.getChild(), G);
    } else // otherwise current node is a leaf, and should be in the G0
      {
        // v is a leaf node in CoSE graph, and is referenced by u in G0
        var u = new CoarseningNode();
        u.setReference(v);

        // construct a mapping between v (from CoSE graph) and u (from coarsening graph)
        map.put(v, u);

        G.add(u);
      }
  }

  // construct edges of G0
  var edges = coseG.getEdges();
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    // if neither source nor target of e is a compound node
    // then, e is an edge between two leaf nodes
    if (e.getSource().getChild() == null && e.getTarget().getChild() == null) {
      G.add(new CoarseningEdge(), map.get(e.getSource()), map.get(e.getTarget()));
    }
  }
};

/**
 * This method gets Mi (lastM) and coarsens to Mi+1
 * Mi+1 is returned.
 */
CoSEGraphManager.prototype.coarsen = function (lastM) {

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
CoSEGraphManager.prototype.coarsenNodes = function (g, coarserG) {
  var nodes = g.getNodes();
  for (var i = 0; i < nodes.length; i++) {
    var v = nodes[i];
    // if v is compound
    // then, create the compound node v.next with an empty child graph
    // and, make a recursive call with v.child (Mi) and v.next.child (Mi+1)
    if (v.getChild() != null) {
      v.setNext(coarserG.getGraphManager().getLayout().newNode(null));
      coarserG.getGraphManager().add(coarserG.getGraphManager().getLayout().newGraph(null), v.getNext());
      v.getNext().setPred1(v);
      coarserG.add(v.getNext());

      //v.getNext().getChild().vGraphObject = v.getChild().vGraphObject;

      this.coarsenNodes(v.getChild(), v.getNext().getChild());
    } else {
      // v.next can be referenced by two nodes, so first check if it is processed before
      if (!v.getNext().isProcessed()) {
        coarserG.add(v.getNext());
        v.getNext().setProcessed(true);
        // set location
        v.getNext().setLocation(v.getLocation().x, v.getLocation().y);
        v.getNext().setHeight(v.getHeight());
        v.getNext().setWidth(v.getWidth());
        v.getNext().id = v.id;
      }
    }
    //v.getNext().vGraphObject = v.vGraphObject;
  }
};

/**
 * This method adds edges to the coarser graph.
 * It should be called after coarsenNodes method is executed
 * lastM: Mi, newM: Mi+1
 */
CoSEGraphManager.prototype.addEdges = function (lastM, newM) {

  var allEdges = lastM.getAllEdges();
  for (var i = 0; i < allEdges.length; i++) {
    var e = allEdges[i];

    // if e is an inter-graph edge or source or target of e is compound 
    // then, e has not contracted during coarsening process. Add e to the coarser graph.
    if (e.isInterGraph || e.getSource().getChild() != null || e.getTarget().getChild() != null) {
      // check if e is not added before
      if (!e.getSource().getNext().getNeighborsList().contains(e.getTarget().getNext())) {
        newM.add(newM.getLayout().newEdge(null), e.getSource().getNext(), e.getTarget().getNext());
      }
    }
    // otherwise, if e is not contracted during coarsening process
    // then, add it to the  coarser graph
    else {
        if (e.getSource().getNext() != e.getTarget().getNext()) {
          // check if e is not added before
          if (!e.getSource().getNext().getNeighborsList().contains(e.getTarget().getNext())) {
            newM.add(newM.getLayout().newEdge(null), e.getSource().getNext(), e.getTarget().getNext());
          }
        }
      }
  }
};

module.exports = CoSEGraphManager;

},{"./CoSEEdge":5,"./CoarseningEdge":10,"./CoarseningGraph":11,"./CoarseningNode":12,"./HashMap":19,"./LGraphManager":26}],8:[function(require,module,exports){
'use strict';

var FDLayout = require('./FDLayout');
var CoSEGraphManager = require('./CoSEGraphManager');
var CoSEGraph = require('./CoSEGraph');
var CoSENode = require('./CoSENode');
var CoSEEdge = require('./CoSEEdge');
var CoSEConstants = require('./CoSEConstants');
var FDLayoutConstants = require('./FDLayoutConstants');
var LayoutConstants = require('./LayoutConstants');
var Point = require('./Point');
var PointD = require('./PointD');
var Layout = require('./Layout');
var Integer = require('./Integer');
var IGeometry = require('./IGeometry');
var LGraph = require('./LGraph');
var Transform = require('./Transform');

function CoSELayout() {
  FDLayout.call(this);

  this.toBeTiled = {}; // Memorize if a node is to be tiled or is tiled
}

CoSELayout.prototype = Object.create(FDLayout.prototype);

for (var prop in FDLayout) {
  CoSELayout[prop] = FDLayout[prop];
}

CoSELayout.prototype.newGraphManager = function () {
  var gm = new CoSEGraphManager(this);
  this.graphManager = gm;
  return gm;
};

CoSELayout.prototype.newGraph = function (vGraph) {
  return new CoSEGraph(null, this.graphManager, vGraph);
};

CoSELayout.prototype.newNode = function (vNode) {
  return new CoSENode(this.graphManager, vNode);
};

CoSELayout.prototype.newEdge = function (vEdge) {
  return new CoSEEdge(null, null, vEdge);
};

CoSELayout.prototype.initParameters = function () {
  FDLayout.prototype.initParameters.call(this, arguments);
  if (!this.isSubLayout) {
    if (CoSEConstants.DEFAULT_EDGE_LENGTH < 10) {
      this.idealEdgeLength = 10;
    } else {
      this.idealEdgeLength = CoSEConstants.DEFAULT_EDGE_LENGTH;
    }

    this.useSmartIdealEdgeLengthCalculation = CoSEConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION;
    this.useMultiLevelScaling = CoSEConstants.DEFAULT_USE_MULTI_LEVEL_SCALING;
    this.springConstant = FDLayoutConstants.DEFAULT_SPRING_STRENGTH;
    this.repulsionConstant = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH;
    this.gravityConstant = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH;
    this.compoundGravityConstant = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH;
    this.gravityRangeFactor = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR;
    this.compoundGravityRangeFactor = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR;
  }
};

CoSELayout.prototype.layout = function () {
  var createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
  if (createBendsAsNeeded) {
    this.createBendpoints();
    this.graphManager.resetAllEdges();
  }
  if (this.useMultiLevelScaling && !this.incremental) {
    console.log("Hello multilevel");
    return this.multiLevelScalingLayout();
  } else {
    this.level = 0;
    return this.classicLayout();
  }
};

CoSELayout.prototype.multiLevelScalingLayout = function () {
  var gm = this.graphManager;

  // Start coarsening process

  // save graph managers M0 to Mk in an array list
  this.MList = gm.coarsenGraph();

  this.noOfLevels = this.MList.length - 1;
  this.level = this.noOfLevels;

  while (this.level >= 0) {
    this.graphManager = gm = this.MList[this.level];

    console.log("@" + this.level + "th level, with " + gm.getAllNodes().length + " nodes. ");
    this.classicLayout();
    console.log("Layout is finished for this level");
    // after finishing layout of first (coarsest) level,
    this.incremental = true;

    if (this.level >= 1) {
      this.uncoarsen(); // also makes initial placement for Mi-1
    }

    // reset total iterations
    this.totalIterations = 0;

    this.level--;
  }

  this.incremental = false;
  return true;
};

CoSELayout.prototype.classicLayout = function () {
  this.nodesWithGravity = this.calculateNodesToApplyGravitationTo();
  this.graphManager.setAllNodesToApplyGravitation(this.nodesWithGravity);
  this.calcNoOfChildrenForAllNodes();
  this.graphManager.calcLowestCommonAncestors();
  this.graphManager.calcInclusionTreeDepths();
  this.graphManager.getRoot().calcEstimatedSize();
  this.calcIdealEdgeLengths();

  if (!this.incremental) {
    var forest = this.getFlatForest();

    // The graph associated with this layout is flat and a forest
    if (forest.length > 0) {
      this.positionNodesRadially(forest);
    }
    // The graph associated with this layout is not flat or a forest
    else {
        // Reduce the trees when incremental mode is not enabled and graph is not a forest 
        //      this.reduceTrees();
        // Update nodes that gravity will be applied
        this.graphManager.resetAllNodesToApplyGravitation();
        var allNodes = new Set(this.getAllNodes());
        var intersection = this.nodesWithGravity.filter(function (x) {
          return allNodes.has(x);
        });
        this.graphManager.setAllNodesToApplyGravitation(intersection);

        this.positionNodesRandomly();
      }
  }

  this.initSpringEmbedder();
  this.runSpringEmbedder();

  return true;
};

var nodesDetail;
var edgesDetail;

CoSELayout.prototype.tick = function () {
  this.totalIterations++;

  if (this.totalIterations === this.maxIterations && !this.isTreeGrowing && !this.isGrowthFinished) {
    if (this.prunedNodesAll.length > 0) {
      this.isTreeGrowing = true;
    } else {
      return true;
    }
  }

  if (this.totalIterations % FDLayoutConstants.CONVERGENCE_CHECK_PERIOD == 0 && !this.isTreeGrowing && !this.isGrowthFinished) {
    if (this.isConverged()) {
      if (this.prunedNodesAll.length > 0) {
        this.isTreeGrowing = true;
      } else {
        return true;
      }
    }

    this.coolingFactor = this.initialCoolingFactor * ((this.maxIterations - this.totalIterations) / this.maxIterations);
    this.animationPeriod = Math.ceil(this.initialAnimationPeriod * Math.sqrt(this.coolingFactor));
  }
  // Operations while tree is growing again 
  if (this.isTreeGrowing) {
    if (this.growTreeIterations % 10 == 0) {
      if (this.prunedNodesAll.length > 0) {
        this.graphManager.updateBounds();
        this.updateGrid();
        this.growTree(this.prunedNodesAll);
        // Update nodes that gravity will be applied
        this.graphManager.resetAllNodesToApplyGravitation();
        var allNodes = new Set(this.getAllNodes());
        var intersection = this.nodesWithGravity.filter(function (x) {
          return allNodes.has(x);
        });
        this.graphManager.setAllNodesToApplyGravitation(intersection);

        this.graphManager.updateBounds();
        this.updateGrid();
        this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
      } else {
        this.isTreeGrowing = false;
        this.isGrowthFinished = true;
      }
    }
    this.growTreeIterations++;
  }
  // Operations after growth is finished
  if (this.isGrowthFinished) {
    if (this.isConverged()) {
      return true;
    }
    if (this.afterGrowthIterations % 10 == 0) {
      this.graphManager.updateBounds();
      this.updateGrid();
    }
    this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL * ((100 - this.afterGrowthIterations) / 100);
    this.afterGrowthIterations++;
  }

  this.totalDisplacement = 0;
  this.graphManager.updateBounds();
  edgesDetail = this.calcSpringForces();
  this.calcRepulsionForces();
  this.calcGravitationalForces();
  nodesDetail = this.moveNodes();
  this.animate();

  var animationData = this.getPositionsData(); // Get positions of layout nodes note that all nodes may not be layout nodes because of tiling
  var edgeData = this.getEdgesData();
  var event = new CustomEvent('send', { 'detail': [animationData, edgeData] });
  window.dispatchEvent(event);

  return false; // Layout is not ended yet return false
};

CoSELayout.prototype.getPositionsData = function () {
  var allNodes = this.graphManager.getAllNodes();
  var pData = {};
  for (var i = 0; i < allNodes.length; i++) {
    var rect = allNodes[i].rect;
    var id = allNodes[i].id;
    pData[id] = {
      id: id,
      x: rect.getCenterX(),
      y: rect.getCenterY(),
      w: rect.width,
      h: rect.height,
      springForceX: nodesDetail[i].springForceX,
      springForceY: nodesDetail[i].springForceY,
      repulsionForceX: nodesDetail[i].repulsionForceX,
      repulsionForceY: nodesDetail[i].repulsionForceY,
      gravitationForceX: nodesDetail[i].gravitationForceX,
      gravitationForceY: nodesDetail[i].gravitationForceY,
      displacementX: nodesDetail[i].displacementX,
      displacementY: nodesDetail[i].displacementY
    };
  }
  return pData;
};

CoSELayout.prototype.getEdgesData = function () {
  var allEdges = this.graphManager.getAllEdges();
  var eData = {};
  for (var i = 0; i < allEdges.length; i++) {
    var id = allEdges[i].id;
    eData[id] = {
      id: id,
      source: edgesDetail[i] != null ? edgesDetail[i].source : "",
      target: edgesDetail[i] != null ? edgesDetail[i].target : "",
      length: edgesDetail[i] != null ? edgesDetail[i].length : "",
      xLength: edgesDetail[i] != null ? edgesDetail[i].xLength : "",
      yLength: edgesDetail[i] != null ? edgesDetail[i].yLength : ""
    };
  }
  return eData;
};

CoSELayout.prototype.runSpringEmbedder = function () {
  this.initialAnimationPeriod = 25;
  this.animationPeriod = this.initialAnimationPeriod;
  var layoutEnded = false;

  // If aminate option is 'during' signal that layout is supposed to start iterating
  if (FDLayoutConstants.ANIMATE === 'during') {
    this.emit('layoutstarted');
  } else {
    // If aminate option is 'during' tick() function will be called on index.js
    while (!layoutEnded) {
      layoutEnded = this.tick();
    }

    this.graphManager.updateBounds();
  }
};

CoSELayout.prototype.calculateNodesToApplyGravitationTo = function () {
  var nodeList = [];
  var graph;

  var graphs = this.graphManager.getGraphs();
  var size = graphs.length;
  var i;
  for (i = 0; i < size; i++) {
    graph = graphs[i];

    graph.updateConnected();

    if (!graph.isConnected) {
      nodeList = nodeList.concat(graph.getNodes());
    }
  }

  return nodeList;
};

CoSELayout.prototype.calcNoOfChildrenForAllNodes = function () {
  var node;
  var allNodes = this.graphManager.getAllNodes();

  for (var i = 0; i < allNodes.length; i++) {
    node = allNodes[i];
    node.noOfChildren = node.getNoOfChildren();
  }
};

CoSELayout.prototype.createBendpoints = function () {
  var edges = [];
  edges = edges.concat(this.graphManager.getAllEdges());
  var visited = new HashSet();
  var i;
  for (i = 0; i < edges.length; i++) {
    var edge = edges[i];

    if (!visited.contains(edge)) {
      var source = edge.getSource();
      var target = edge.getTarget();

      if (source == target) {
        edge.getBendpoints().push(new PointD());
        edge.getBendpoints().push(new PointD());
        this.createDummyNodesForBendpoints(edge);
        visited.add(edge);
      } else {
        var edgeList = [];

        edgeList = edgeList.concat(source.getEdgeListToNode(target));
        edgeList = edgeList.concat(target.getEdgeListToNode(source));

        if (!visited.contains(edgeList[0])) {
          if (edgeList.length > 1) {
            var k;
            for (k = 0; k < edgeList.length; k++) {
              var multiEdge = edgeList[k];
              multiEdge.getBendpoints().push(new PointD());
              this.createDummyNodesForBendpoints(multiEdge);
            }
          }
          visited.addAll(list);
        }
      }
    }

    if (visited.size() == edges.length) {
      break;
    }
  }
};

CoSELayout.prototype.positionNodesRadially = function (forest) {
  // We tile the trees to a grid row by row; first tree starts at (0,0)
  var currentStartingPoint = new Point(0, 0);
  var numberOfColumns = Math.ceil(Math.sqrt(forest.length));
  var height = 0;
  var currentY = 0;
  var currentX = 0;
  var point = new PointD(0, 0);

  for (var i = 0; i < forest.length; i++) {
    if (i % numberOfColumns == 0) {
      // Start of a new row, make the x coordinate 0, increment the
      // y coordinate with the max height of the previous row
      currentX = 0;
      currentY = height;

      if (i != 0) {
        currentY += CoSEConstants.DEFAULT_COMPONENT_SEPERATION;
      }

      height = 0;
    }

    var tree = forest[i];

    // Find the center of the tree
    var centerNode = Layout.findCenterOfTree(tree);

    // Set the staring point of the next tree
    currentStartingPoint.x = currentX;
    currentStartingPoint.y = currentY;

    // Do a radial layout starting with the center
    point = CoSELayout.radialLayout(tree, centerNode, currentStartingPoint);

    if (point.y > height) {
      height = Math.floor(point.y);
    }

    currentX = Math.floor(point.x + CoSEConstants.DEFAULT_COMPONENT_SEPERATION);
  }

  this.transform(new PointD(LayoutConstants.WORLD_CENTER_X - point.x / 2, LayoutConstants.WORLD_CENTER_Y - point.y / 2));
};

CoSELayout.radialLayout = function (tree, centerNode, startingPoint) {
  var radialSep = Math.max(this.maxDiagonalInTree(tree), CoSEConstants.DEFAULT_RADIAL_SEPARATION);
  CoSELayout.branchRadialLayout(centerNode, null, 0, 359, 0, radialSep);
  var bounds = LGraph.calculateBounds(tree);

  var transform = new Transform();
  transform.setDeviceOrgX(bounds.getMinX());
  transform.setDeviceOrgY(bounds.getMinY());
  transform.setWorldOrgX(startingPoint.x);
  transform.setWorldOrgY(startingPoint.y);

  for (var i = 0; i < tree.length; i++) {
    var node = tree[i];
    node.transform(transform);
  }

  var bottomRight = new PointD(bounds.getMaxX(), bounds.getMaxY());

  return transform.inverseTransformPoint(bottomRight);
};

CoSELayout.branchRadialLayout = function (node, parentOfNode, startAngle, endAngle, distance, radialSeparation) {
  // First, position this node by finding its angle.
  var halfInterval = (endAngle - startAngle + 1) / 2;

  if (halfInterval < 0) {
    halfInterval += 180;
  }

  var nodeAngle = (halfInterval + startAngle) % 360;
  var teta = nodeAngle * IGeometry.TWO_PI / 360;

  // Make polar to java cordinate conversion.
  var cos_teta = Math.cos(teta);
  var x_ = distance * Math.cos(teta);
  var y_ = distance * Math.sin(teta);

  node.setCenter(x_, y_);

  // Traverse all neighbors of this node and recursively call this
  // function.
  var neighborEdges = [];
  neighborEdges = neighborEdges.concat(node.getEdges());
  var childCount = neighborEdges.length;

  if (parentOfNode != null) {
    childCount--;
  }

  var branchCount = 0;

  var incEdgesCount = neighborEdges.length;
  var startIndex;

  var edges = node.getEdgesBetween(parentOfNode);

  // If there are multiple edges, prune them until there remains only one
  // edge.
  while (edges.length > 1) {
    //neighborEdges.remove(edges.remove(0));
    var temp = edges[0];
    edges.splice(0, 1);
    var index = neighborEdges.indexOf(temp);
    if (index >= 0) {
      neighborEdges.splice(index, 1);
    }
    incEdgesCount--;
    childCount--;
  }

  if (parentOfNode != null) {
    //assert edges.length == 1;
    startIndex = (neighborEdges.indexOf(edges[0]) + 1) % incEdgesCount;
  } else {
    startIndex = 0;
  }

  var stepAngle = Math.abs(endAngle - startAngle) / childCount;

  for (var i = startIndex; branchCount != childCount; i = ++i % incEdgesCount) {
    var currentNeighbor = neighborEdges[i].getOtherEnd(node);

    // Don't back traverse to root node in current tree.
    if (currentNeighbor == parentOfNode) {
      continue;
    }

    var childStartAngle = (startAngle + branchCount * stepAngle) % 360;
    var childEndAngle = (childStartAngle + stepAngle) % 360;

    CoSELayout.branchRadialLayout(currentNeighbor, node, childStartAngle, childEndAngle, distance + radialSeparation, radialSeparation);

    branchCount++;
  }
};

CoSELayout.maxDiagonalInTree = function (tree) {
  var maxDiagonal = Integer.MIN_VALUE;

  for (var i = 0; i < tree.length; i++) {
    var node = tree[i];
    var diagonal = node.getDiagonal();

    if (diagonal > maxDiagonal) {
      maxDiagonal = diagonal;
    }
  }

  return maxDiagonal;
};

CoSELayout.prototype.calcRepulsionRange = function () {
  // formula is 2 x (level + 1) x idealEdgeLength
  return 2 * (this.level + 1) * this.idealEdgeLength;
};

// Multi-level Scaling method

/**
 * This method un-coarsens Mi to Mi-1 and makes initial placement for Mi-1
 */
CoSELayout.prototype.uncoarsen = function () {
  var allNodes = this.graphManager.getAllNodes();

  for (var i = 0; i < allNodes.length; i++) {
    var v = allNodes[i];
    // set positions of v.pred1 and v.pred2
    v.getPred1().setCenter(v.getCenterX(), v.getCenterY());

    if (v.getPred2() != null) {
      // TODO: check 
      /*
      double w = v.getPred1().getRect().width;
      double l = this.idealEdgeLength;
      v.getPred2().setLocation((v.getPred1().getLeft()+w+l), (v.getPred1().getTop()+w+l));
      */
      //      var distance = (Math.max(v.getPred1().getWidth(), v.getPred1().getHeight()) + Math.max(v.getPred2().getWidth(), v.getPred2().getHeight())) / 2 + 5;
      //      console.log(distance);
      //      var xPos = Math.random() * 2 * distance - distance;
      //      console.log(xPos);
      //      var yPos = Math.random() < 0.5 ? (Math.sqrt(distance * distance - xPos * xPos)) : (-1 * Math.sqrt(distance * distance - xPos * xPos));
      //      console.log(yPos);
      //      
      //      v.getPred2().setCenter(v.getPred1().getCenterX + xPos, v.getPred1().getCenterY + yPos);

      v.getPred2().setLocation(v.getLeft() + this.idealEdgeLength, v.getTop() + this.idealEdgeLength);
    }
  }
};

// Tiling methods

// Group zero degree members whose parents are not to be tiled, create dummy parents where needed and fill memberGroups by their dummp parent id's
CoSELayout.prototype.groupZeroDegreeMembers = function () {
  var self = this;
  // array of [parent_id x oneDegreeNode_id]
  var tempMemberGroups = {}; // A temporary map of parent node and its zero degree members
  this.memberGroups = {}; // A map of dummy parent node and its zero degree members whose parents are not to be tiled
  this.idToDummyNode = {}; // A map of id to dummy node 

  var zeroDegree = []; // List of zero degree nodes whose parents are not to be tiled
  var allNodes = this.graphManager.getAllNodes();

  // Fill zero degree list
  for (var i = 0; i < allNodes.length; i++) {
    var node = allNodes[i];
    var parent = node.getParent();
    // If a node has zero degree and its parent is not to be tiled if exists add that node to zeroDegres list
    if (this.getNodeDegreeWithChildren(node) === 0 && (parent.id == undefined || !this.getToBeTiled(parent))) {
      zeroDegree.push(node);
    }
  }

  // Create a map of parent node and its zero degree members
  for (var i = 0; i < zeroDegree.length; i++) {
    var node = zeroDegree[i]; // Zero degree node itself
    var p_id = node.getParent().id; // Parent id

    if (typeof tempMemberGroups[p_id] === "undefined") tempMemberGroups[p_id] = [];

    tempMemberGroups[p_id] = tempMemberGroups[p_id].concat(node); // Push node to the list belongs to its parent in tempMemberGroups
  }

  // If there are at least two nodes at a level, create a dummy compound for them
  Object.keys(tempMemberGroups).forEach(function (p_id) {
    if (tempMemberGroups[p_id].length > 1) {
      var dummyCompoundId = "DummyCompound_" + p_id; // The id of dummy compound which will be created soon
      self.memberGroups[dummyCompoundId] = tempMemberGroups[p_id]; // Add dummy compound to memberGroups

      var parent = tempMemberGroups[p_id][0].getParent(); // The parent of zero degree nodes will be the parent of new dummy compound

      // Create a dummy compound with calculated id
      var dummyCompound = new CoSENode(self.graphManager);
      dummyCompound.id = dummyCompoundId;
      dummyCompound.paddingLeft = parent.paddingLeft || 0;
      dummyCompound.paddingRight = parent.paddingRight || 0;
      dummyCompound.paddingBottom = parent.paddingBottom || 0;
      dummyCompound.paddingTop = parent.paddingTop || 0;

      self.idToDummyNode[dummyCompoundId] = dummyCompound;

      var dummyParentGraph = self.getGraphManager().add(self.newGraph(), dummyCompound);
      var parentGraph = parent.getChild();

      // Add dummy compound to parent the graph
      parentGraph.add(dummyCompound);

      // For each zero degree node in this level remove it from its parent graph and add it to the graph of dummy parent
      for (var i = 0; i < tempMemberGroups[p_id].length; i++) {
        var node = tempMemberGroups[p_id][i];

        parentGraph.remove(node);
        dummyParentGraph.add(node);
      }
    }
  });
};

CoSELayout.prototype.clearCompounds = function () {
  var childGraphMap = {};
  var idToNode = {};

  // Get compound ordering by finding the inner one first
  this.performDFSOnCompounds();

  for (var i = 0; i < this.compoundOrder.length; i++) {

    idToNode[this.compoundOrder[i].id] = this.compoundOrder[i];
    childGraphMap[this.compoundOrder[i].id] = [].concat(this.compoundOrder[i].getChild().getNodes());

    // Remove children of compounds
    this.graphManager.remove(this.compoundOrder[i].getChild());
    this.compoundOrder[i].child = null;
  }

  this.graphManager.resetAllNodes();

  // Tile the removed children
  this.tileCompoundMembers(childGraphMap, idToNode);
};

CoSELayout.prototype.clearZeroDegreeMembers = function () {
  var self = this;
  var tiledZeroDegreePack = this.tiledZeroDegreePack = [];

  Object.keys(this.memberGroups).forEach(function (id) {
    var compoundNode = self.idToDummyNode[id]; // Get the dummy compound

    tiledZeroDegreePack[id] = self.tileNodes(self.memberGroups[id], compoundNode.paddingLeft + compoundNode.paddingRight);

    // Set the width and height of the dummy compound as calculated
    compoundNode.rect.width = tiledZeroDegreePack[id].width;
    compoundNode.rect.height = tiledZeroDegreePack[id].height;
  });
};

CoSELayout.prototype.repopulateCompounds = function () {
  for (var i = this.compoundOrder.length - 1; i >= 0; i--) {
    var lCompoundNode = this.compoundOrder[i];
    var id = lCompoundNode.id;
    var horizontalMargin = lCompoundNode.paddingLeft;
    var verticalMargin = lCompoundNode.paddingTop;

    this.adjustLocations(this.tiledMemberPack[id], lCompoundNode.rect.x, lCompoundNode.rect.y, horizontalMargin, verticalMargin);
  }
};

CoSELayout.prototype.repopulateZeroDegreeMembers = function () {
  var self = this;
  var tiledPack = this.tiledZeroDegreePack;

  Object.keys(tiledPack).forEach(function (id) {
    var compoundNode = self.idToDummyNode[id]; // Get the dummy compound by its id
    var horizontalMargin = compoundNode.paddingLeft;
    var verticalMargin = compoundNode.paddingTop;

    // Adjust the positions of nodes wrt its compound
    self.adjustLocations(tiledPack[id], compoundNode.rect.x, compoundNode.rect.y, horizontalMargin, verticalMargin);
  });
};

CoSELayout.prototype.getToBeTiled = function (node) {
  var id = node.id;
  //firstly check the previous results
  if (this.toBeTiled[id] != null) {
    return this.toBeTiled[id];
  }

  //only compound nodes are to be tiled
  var childGraph = node.getChild();
  if (childGraph == null) {
    this.toBeTiled[id] = false;
    return false;
  }

  var children = childGraph.getNodes(); // Get the children nodes

  //a compound node is not to be tiled if all of its compound children are not to be tiled
  for (var i = 0; i < children.length; i++) {
    var theChild = children[i];

    if (this.getNodeDegree(theChild) > 0) {
      this.toBeTiled[id] = false;
      return false;
    }

    //pass the children not having the compound structure
    if (theChild.getChild() == null) {
      this.toBeTiled[theChild.id] = false;
      continue;
    }

    if (!this.getToBeTiled(theChild)) {
      this.toBeTiled[id] = false;
      return false;
    }
  }
  this.toBeTiled[id] = true;
  return true;
};

// Get degree of a node depending of its edges and independent of its children
CoSELayout.prototype.getNodeDegree = function (node) {
  var id = node.id;
  var edges = node.getEdges();
  var degree = 0;

  // For the edges connected
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    if (edge.getSource().id != edge.getTarget().id) {
      degree = degree + 1;
    }
  }
  return degree;
};

// Get degree of a node with its children
CoSELayout.prototype.getNodeDegreeWithChildren = function (node) {
  var degree = this.getNodeDegree(node);
  if (node.getChild() == null) {
    return degree;
  }
  var children = node.getChild().getNodes();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    degree += this.getNodeDegreeWithChildren(child);
  }
  return degree;
};

CoSELayout.prototype.performDFSOnCompounds = function () {
  this.compoundOrder = [];
  this.fillCompexOrderByDFS(this.graphManager.getRoot().getNodes());
};

CoSELayout.prototype.fillCompexOrderByDFS = function (children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.getChild() != null) {
      this.fillCompexOrderByDFS(child.getChild().getNodes());
    }
    if (this.getToBeTiled(child)) {
      this.compoundOrder.push(child);
    }
  }
};

/**
* This method places each zero degree member wrt given (x,y) coordinates (top left).
*/
CoSELayout.prototype.adjustLocations = function (organization, x, y, compoundHorizontalMargin, compoundVerticalMargin) {
  x += compoundHorizontalMargin;
  y += compoundVerticalMargin;

  var left = x;

  for (var i = 0; i < organization.rows.length; i++) {
    var row = organization.rows[i];
    x = left;
    var maxHeight = 0;

    for (var j = 0; j < row.length; j++) {
      var lnode = row[j];

      lnode.rect.x = x; // + lnode.rect.width / 2;
      lnode.rect.y = y; // + lnode.rect.height / 2;

      x += lnode.rect.width + organization.horizontalPadding;

      if (lnode.rect.height > maxHeight) maxHeight = lnode.rect.height;
    }

    y += maxHeight + organization.verticalPadding;
  }
};

CoSELayout.prototype.tileCompoundMembers = function (childGraphMap, idToNode) {
  var self = this;
  this.tiledMemberPack = [];

  Object.keys(childGraphMap).forEach(function (id) {
    // Get the compound node
    var compoundNode = idToNode[id];

    self.tiledMemberPack[id] = self.tileNodes(childGraphMap[id], compoundNode.paddingLeft + compoundNode.paddingRight);

    compoundNode.rect.width = self.tiledMemberPack[id].width + 20;
    compoundNode.rect.height = self.tiledMemberPack[id].height + 20;
  });
};

CoSELayout.prototype.tileNodes = function (nodes, minWidth) {
  var verticalPadding = CoSEConstants.TILING_PADDING_VERTICAL;
  var horizontalPadding = CoSEConstants.TILING_PADDING_HORIZONTAL;
  var organization = {
    rows: [],
    rowWidth: [],
    rowHeight: [],
    width: 20,
    height: 20,
    verticalPadding: verticalPadding,
    horizontalPadding: horizontalPadding
  };

  // Sort the nodes in ascending order of their areas
  nodes.sort(function (n1, n2) {
    if (n1.rect.width * n1.rect.height > n2.rect.width * n2.rect.height) return -1;
    if (n1.rect.width * n1.rect.height < n2.rect.width * n2.rect.height) return 1;
    return 0;
  });

  // Create the organization -> tile members
  for (var i = 0; i < nodes.length; i++) {
    var lNode = nodes[i];

    if (organization.rows.length == 0) {
      this.insertNodeToRow(organization, lNode, 0, minWidth);
    } else if (this.canAddHorizontal(organization, lNode.rect.width, lNode.rect.height)) {
      this.insertNodeToRow(organization, lNode, this.getShortestRowIndex(organization), minWidth);
    } else {
      this.insertNodeToRow(organization, lNode, organization.rows.length, minWidth);
    }

    this.shiftToLastRow(organization);
  }

  return organization;
};

CoSELayout.prototype.insertNodeToRow = function (organization, node, rowIndex, minWidth) {
  var minCompoundSize = minWidth;

  // Add new row if needed
  if (rowIndex == organization.rows.length) {
    var secondDimension = [];

    organization.rows.push(secondDimension);
    organization.rowWidth.push(minCompoundSize);
    organization.rowHeight.push(0);
  }

  // Update row width
  var w = organization.rowWidth[rowIndex] + node.rect.width;

  if (organization.rows[rowIndex].length > 0) {
    w += organization.horizontalPadding;
  }

  organization.rowWidth[rowIndex] = w;
  // Update compound width
  if (organization.width < w) {
    organization.width = w;
  }

  // Update height
  var h = node.rect.height;
  if (rowIndex > 0) h += organization.verticalPadding;

  var extraHeight = 0;
  if (h > organization.rowHeight[rowIndex]) {
    extraHeight = organization.rowHeight[rowIndex];
    organization.rowHeight[rowIndex] = h;
    extraHeight = organization.rowHeight[rowIndex] - extraHeight;
  }

  organization.height += extraHeight;

  // Insert node
  organization.rows[rowIndex].push(node);
};

//Scans the rows of an organization and returns the one with the min width
CoSELayout.prototype.getShortestRowIndex = function (organization) {
  var r = -1;
  var min = Number.MAX_VALUE;

  for (var i = 0; i < organization.rows.length; i++) {
    if (organization.rowWidth[i] < min) {
      r = i;
      min = organization.rowWidth[i];
    }
  }
  return r;
};

//Scans the rows of an organization and returns the one with the max width
CoSELayout.prototype.getLongestRowIndex = function (organization) {
  var r = -1;
  var max = Number.MIN_VALUE;

  for (var i = 0; i < organization.rows.length; i++) {

    if (organization.rowWidth[i] > max) {
      r = i;
      max = organization.rowWidth[i];
    }
  }

  return r;
};

/**
* This method checks whether adding extra width to the organization violates
* the aspect ratio(1) or not.
*/
CoSELayout.prototype.canAddHorizontal = function (organization, extraWidth, extraHeight) {

  var sri = this.getShortestRowIndex(organization);

  if (sri < 0) {
    return true;
  }

  var min = organization.rowWidth[sri];

  if (min + organization.horizontalPadding + extraWidth <= organization.width) return true;

  var hDiff = 0;

  // Adding to an existing row
  if (organization.rowHeight[sri] < extraHeight) {
    if (sri > 0) hDiff = extraHeight + organization.verticalPadding - organization.rowHeight[sri];
  }

  var add_to_row_ratio;
  if (organization.width - min >= extraWidth + organization.horizontalPadding) {
    add_to_row_ratio = (organization.height + hDiff) / (min + extraWidth + organization.horizontalPadding);
  } else {
    add_to_row_ratio = (organization.height + hDiff) / organization.width;
  }

  // Adding a new row for this node
  hDiff = extraHeight + organization.verticalPadding;
  var add_new_row_ratio;
  if (organization.width < extraWidth) {
    add_new_row_ratio = (organization.height + hDiff) / extraWidth;
  } else {
    add_new_row_ratio = (organization.height + hDiff) / organization.width;
  }

  if (add_new_row_ratio < 1) add_new_row_ratio = 1 / add_new_row_ratio;

  if (add_to_row_ratio < 1) add_to_row_ratio = 1 / add_to_row_ratio;

  return add_to_row_ratio < add_new_row_ratio;
};

//If moving the last node from the longest row and adding it to the last
//row makes the bounding box smaller, do it.
CoSELayout.prototype.shiftToLastRow = function (organization) {
  var longest = this.getLongestRowIndex(organization);
  var last = organization.rowWidth.length - 1;
  var row = organization.rows[longest];
  var node = row[row.length - 1];

  var diff = node.width + organization.horizontalPadding;

  // Check if there is enough space on the last row
  if (organization.width - organization.rowWidth[last] > diff && longest != last) {
    // Remove the last element of the longest row
    row.splice(-1, 1);

    // Push it to the last row
    organization.rows[last].push(node);

    organization.rowWidth[longest] = organization.rowWidth[longest] - diff;
    organization.rowWidth[last] = organization.rowWidth[last] + diff;
    organization.width = organization.rowWidth[instance.getLongestRowIndex(organization)];

    // Update heights of the organization
    var maxHeight = Number.MIN_VALUE;
    for (var i = 0; i < row.length; i++) {
      if (row[i].height > maxHeight) maxHeight = row[i].height;
    }
    if (longest > 0) maxHeight += organization.verticalPadding;

    var prevTotal = organization.rowHeight[longest] + organization.rowHeight[last];

    organization.rowHeight[longest] = maxHeight;
    if (organization.rowHeight[last] < node.height + organization.verticalPadding) organization.rowHeight[last] = node.height + organization.verticalPadding;

    var finalTotal = organization.rowHeight[longest] + organization.rowHeight[last];
    organization.height += finalTotal - prevTotal;

    this.shiftToLastRow(organization);
  }
};

CoSELayout.prototype.tilingPreLayout = function () {
  if (CoSEConstants.TILE) {
    // Find zero degree nodes and create a compound for each level
    this.groupZeroDegreeMembers();
    // Tile and clear children of each compound
    this.clearCompounds();
    // Separately tile and clear zero degree nodes for each level
    this.clearZeroDegreeMembers();
  }
};

CoSELayout.prototype.tilingPostLayout = function () {
  if (CoSEConstants.TILE) {
    this.repopulateZeroDegreeMembers();
    this.repopulateCompounds();
  }
};

module.exports = CoSELayout;

},{"./CoSEConstants":4,"./CoSEEdge":5,"./CoSEGraph":6,"./CoSEGraphManager":7,"./CoSENode":9,"./FDLayout":15,"./FDLayoutConstants":16,"./IGeometry":21,"./Integer":23,"./LGraph":25,"./Layout":29,"./LayoutConstants":30,"./Point":31,"./PointD":32,"./Transform":35}],9:[function(require,module,exports){
'use strict';

var FDLayoutNode = require('./FDLayoutNode');
var IMath = require('./IMath');

function CoSENode(gm, loc, size, vNode) {
  FDLayoutNode.call(this, gm, loc, size, vNode);
}

CoSENode.prototype = Object.create(FDLayoutNode.prototype);
for (var prop in FDLayoutNode) {
  CoSENode[prop] = FDLayoutNode[prop];
}

CoSENode.prototype.move = function () {
  var layout = this.graphManager.getLayout();
  this.displacementX = layout.coolingFactor * (this.springForceX + this.repulsionForceX + this.gravitationForceX) / this.noOfChildren;
  this.displacementY = layout.coolingFactor * (this.springForceY + this.repulsionForceY + this.gravitationForceY) / this.noOfChildren;

  if (Math.abs(this.displacementX) > layout.coolingFactor * layout.maxNodeDisplacement) {
    this.displacementX = layout.coolingFactor * layout.maxNodeDisplacement * IMath.sign(this.displacementX);
  }

  if (Math.abs(this.displacementY) > layout.coolingFactor * layout.maxNodeDisplacement) {
    this.displacementY = layout.coolingFactor * layout.maxNodeDisplacement * IMath.sign(this.displacementY);
  }

  // a simple node, just move it
  if (this.child == null) {
    this.moveBy(this.displacementX, this.displacementY);
  }
  // an empty compound node, again just move it
  else if (this.child.getNodes().length == 0) {
      this.moveBy(this.displacementX, this.displacementY);
    }
    // non-empty compound node, propogate movement to children as well
    else {
        this.propogateDisplacementToChildren(this.displacementX, this.displacementY);
      }

  layout.totalDisplacement += Math.abs(this.displacementX) + Math.abs(this.displacementY);

  var nodeData = {
    springForceX: this.springForceX,
    springForceY: this.springForceY,
    repulsionForceX: this.repulsionForceX,
    repulsionForceY: this.repulsionForceY,
    gravitationForceX: this.gravitationForceX,
    gravitationForceY: this.gravitationForceY,
    displacementX: this.displacementX,
    displacementY: this.displacementY
  };

  this.springForceX = 0;
  this.springForceY = 0;
  this.repulsionForceX = 0;
  this.repulsionForceY = 0;
  this.gravitationForceX = 0;
  this.gravitationForceY = 0;
  this.displacementX = 0;
  this.displacementY = 0;

  return nodeData;
};

CoSENode.prototype.propogateDisplacementToChildren = function (dX, dY) {
  var nodes = this.getChild().getNodes();
  var node;
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (node.getChild() == null) {
      node.moveBy(dX, dY);
      node.displacementX += dX;
      node.displacementY += dY;
    } else {
      node.propogateDisplacementToChildren(dX, dY);
    }
  }
};

CoSENode.prototype.setPred1 = function (pred1) {
  this.pred1 = pred1;
};

CoSENode.prototype.getPred1 = function () {
  return this.pred1;
};

CoSENode.prototype.setPred2 = function (pred2) {
  this.pred2 = pred2;
};

CoSENode.prototype.getPred2 = function () {
  return this.pred2;
};

CoSENode.prototype.setNext = function (next) {
  this.next = next;
};

CoSENode.prototype.getNext = function () {
  return this.next;
};

CoSENode.prototype.setProcessed = function (processed) {
  this.processed = processed;
};

CoSENode.prototype.isProcessed = function () {
  return this.processed;
};

module.exports = CoSENode;

},{"./FDLayoutNode":18,"./IMath":22}],10:[function(require,module,exports){
'use strict';

var CoSEEdge = require('./CoSEEdge');

function CoarseningEdge(source, target, vEdge) {
  CoSEEdge.call(this, source, target, vEdge);
}

CoarseningEdge.prototype = Object.create(CoSEEdge.prototype);
for (var prop in CoSEEdge) {
  CoarseningEdge[prop] = CoSEEdge[prop];
}

module.exports = CoarseningEdge;

},{"./CoSEEdge":5}],11:[function(require,module,exports){
'use strict';

var LGraph = require('./LGraph');
var CoarseningNode = require('./CoarseningNode');
var CoarseningEdge = require('./CoarseningEdge');

function CoarseningGraph(parent, layout, vGraph) {

  if (layout == null && vGraph == null) {
    layout = parent;
    LGraph.call(this, null, layout, null);
    this.layout = layout;
  } else {
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
CoarseningGraph.prototype.coarsen = function () {
  this.unmatchAll();
  var v, u;

  if (this.getNodes().length > 0) {
    // match each node with the one of the unmatched neighbors has minimum weight
    // if there is no unmatched neighbor, then match current node with itself    
    while (!this.getNodes()[0].isMatched()) {
      // get an unmatched node (v) and (if exists) matching of it (u).
      v = this.getNodes()[0]; //Optimize
      u = v.getMatching();

      // node t is constructed by contracting u and v
      this.contract(v, u);
    }

    var nodes = this.getNodes();

    for (var i = 0; i < nodes.length; i++) {
      var y = nodes[i];

      // new CoSE node will be in Mi+1
      var z = this.layout.newNode(null);

      z.setPred1(y.getNode1().getReference());
      y.getNode1().getReference().setNext(z);

      // if current node is not matched with itself
      if (y.getNode2() != null) {
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
CoarseningGraph.prototype.unmatchAll = function () {
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
CoarseningGraph.prototype.contract = function (v, u) {
  // t will be constructed by contracting v and u	
  var t = new CoarseningNode();
  this.add(t); //Check this

  t.setNode1(v);

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
    if (x != t) {
      this.add(new CoarseningEdge(), t, x);
    }
  }

  t.setWeight(v.getWeight());

  //remove contracted node from the graph
  this.remove(v);

  // if v has an unmatched neighbor, then u is not null and t.node2 = u
  // otherwise, leave t.node2 as null
  if (u != null) {
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
      if (x != t) {
        this.add(new CoarseningEdge(), t, x);
      }
    }
    t.setWeight(t.getWeight() + u.getWeight());

    //remove contracted node from the graph
    this.remove(u);
  }

  // t should be flagged as matched
  t.setMatched(true);
};

module.exports = CoarseningGraph;

},{"./CoarseningEdge":10,"./CoarseningNode":12,"./LGraph":25}],12:[function(require,module,exports){
'use strict';

var LNode = require('./LNode');
var Integer = require('./Integer');

function CoarseningNode(gm, vNode) {
  if (gm == null && vNode == null) {
    LNode.call(this, null, null);
  } else {
    LNode.call(this, gm, vNode);
  }
  this.weight = 1;
}

CoarseningNode.prototype = Object.create(LNode.prototype);
for (var prop in LNode) {
  CoarseningNode[prop] = LNode[prop];
}

CoarseningNode.prototype.setMatched = function (matched) {
  this.matched = matched;
};

CoarseningNode.prototype.isMatched = function () {
  return this.matched;
};

CoarseningNode.prototype.getWeight = function () {
  return this.weight;
};

CoarseningNode.prototype.setWeight = function (weight) {
  this.weight = weight;
};

CoarseningNode.prototype.getNode1 = function () {
  return this.node1;
};

CoarseningNode.prototype.setNode1 = function (node1) {
  this.node1 = node1;
};

CoarseningNode.prototype.getNode2 = function () {
  return this.node2;
};

CoarseningNode.prototype.setNode2 = function (node2) {
  this.node2 = node2;
};

CoarseningNode.prototype.getReference = function () {
  return this.reference;
};

CoarseningNode.prototype.setReference = function (reference) {
  this.reference = reference;
};

/**
 * This method returns the matching of this node
 * if this node does not have any unmacthed neighbor then returns null
 */
CoarseningNode.prototype.getMatching = function () {
  var minWeighted = null;
  var minWeight = Integer.MAX_VALUE;

  var neighborsList = this.getNeighborsList();

  var keys = Object.keys(neighborsList.set);
  var length = keys.length;
  for (var i = 0; i < length; i++) {
    //  Object.keys(neighborsList.set).forEach(function(nodeId){
    var v = neighborsList.set[keys[i]];

    if (!v.isMatched() && v != this && v.getWeight() < minWeight) {
      minWeighted = v;
      minWeight = v.getWeight();
    }
  }
  return minWeighted;
};

module.exports = CoarseningNode;

},{"./Integer":23,"./LNode":28}],13:[function(require,module,exports){
"use strict";

function DimensionD(width, height) {
  this.width = 0;
  this.height = 0;
  if (width !== null && height !== null) {
    this.height = height;
    this.width = width;
  }
}

DimensionD.prototype.getWidth = function () {
  return this.width;
};

DimensionD.prototype.setWidth = function (width) {
  this.width = width;
};

DimensionD.prototype.getHeight = function () {
  return this.height;
};

DimensionD.prototype.setHeight = function (height) {
  this.height = height;
};

module.exports = DimensionD;

},{}],14:[function(require,module,exports){
"use strict";

function Emitter() {
  this.listeners = [];
}

var p = Emitter.prototype;

p.addListener = function (event, callback) {
  this.listeners.push({
    event: event,
    callback: callback
  });
};

p.removeListener = function (event, callback) {
  for (var i = this.listeners.length; i >= 0; i--) {
    var l = this.listeners[i];

    if (l.event === event && l.callback === callback) {
      this.listeners.splice(i, 1);
    }
  }
};

p.emit = function (event, data) {
  for (var i = 0; i < this.listeners.length; i++) {
    var l = this.listeners[i];

    if (event === l.event) {
      l.callback(data);
    }
  }
};

module.exports = Emitter;

},{}],15:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Layout = require('./Layout');
var FDLayoutConstants = require('./FDLayoutConstants');
var LayoutConstants = require('./LayoutConstants');
var IGeometry = require('./IGeometry');
var IMath = require('./IMath');
var Integer = require('./Integer');

function FDLayout() {
  Layout.call(this);

  this.useSmartIdealEdgeLengthCalculation = FDLayoutConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION;
  this.idealEdgeLength = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
  this.springConstant = FDLayoutConstants.DEFAULT_SPRING_STRENGTH;
  this.repulsionConstant = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH;
  this.gravityConstant = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH;
  this.compoundGravityConstant = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH;
  this.gravityRangeFactor = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR;
  this.compoundGravityRangeFactor = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR;
  this.displacementThresholdPerNode = 3.0 * FDLayoutConstants.DEFAULT_EDGE_LENGTH / 100;
  this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
  this.initialCoolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
  this.totalDisplacement = 0.0;
  this.oldTotalDisplacement = 0.0;
  this.maxIterations = FDLayoutConstants.MAX_ITERATIONS;
}

FDLayout.prototype = Object.create(Layout.prototype);

for (var prop in Layout) {
  FDLayout[prop] = Layout[prop];
}

FDLayout.prototype.initParameters = function () {
  Layout.prototype.initParameters.call(this, arguments);

  if (this.layoutQuality == LayoutConstants.DRAFT_QUALITY) {
    this.displacementThresholdPerNode += 0.30;
    this.maxIterations *= 0.8;
  } else if (this.layoutQuality == LayoutConstants.PROOF_QUALITY) {
    this.displacementThresholdPerNode -= 0.30;
    this.maxIterations *= 1.2;
  }

  this.totalIterations = 0;
  this.notAnimatedIterations = 0;

  this.useFRGridVariant = FDLayoutConstants.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION;

  this.grid = [];
  // variables for tree reduction support
  this.prunedNodesAll = [];
  this.growTreeIterations = 0;
  this.afterGrowthIterations = 0;
  this.isTreeGrowing = false;
  this.isGrowthFinished = false;
};

FDLayout.prototype.calcIdealEdgeLengths = function () {
  var edge;
  var lcaDepth;
  var source;
  var target;
  var sizeOfSourceInLca;
  var sizeOfTargetInLca;

  var allEdges = this.getGraphManager().getAllEdges();
  for (var i = 0; i < allEdges.length; i++) {
    edge = allEdges[i];

    edge.idealLength = this.idealEdgeLength;

    if (edge.isInterGraph) {
      source = edge.getSource();
      target = edge.getTarget();

      sizeOfSourceInLca = edge.getSourceInLca().getEstimatedSize();
      sizeOfTargetInLca = edge.getTargetInLca().getEstimatedSize();

      if (this.useSmartIdealEdgeLengthCalculation) {
        edge.idealLength += sizeOfSourceInLca + sizeOfTargetInLca - 2 * LayoutConstants.SIMPLE_NODE_SIZE;
      }

      lcaDepth = edge.getLca().getInclusionTreeDepth();

      edge.idealLength += FDLayoutConstants.DEFAULT_EDGE_LENGTH * FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR * (source.getInclusionTreeDepth() + target.getInclusionTreeDepth() - 2 * lcaDepth);
    }
  }
};

FDLayout.prototype.initSpringEmbedder = function () {

  if (this.incremental) {
    this.maxNodeDisplacement = FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL;
  } else {
    this.coolingFactor = 1.0;
    this.initialCoolingFactor = 1.0;
    this.maxNodeDisplacement = FDLayoutConstants.MAX_NODE_DISPLACEMENT;
  }

  this.maxIterations = Math.max(this.getAllNodes().length * 5, this.maxIterations);

  this.totalDisplacementThreshold = this.displacementThresholdPerNode * this.getAllNodes().length;

  this.repulsionRange = this.calcRepulsionRange();
};

FDLayout.prototype.calcSpringForces = function () {
  var lEdges = this.getAllEdges();
  var edge;
  var edgesData = [];

  for (var i = 0; i < lEdges.length; i++) {
    edge = lEdges[i];

    edgesData[i] = this.calcSpringForce(edge, edge.idealLength);
  }
  return edgesData;
};

FDLayout.prototype.calcRepulsionForces = function () {
  var i, j;
  var nodeA, nodeB;
  var lNodes = this.getAllNodes();
  var processedNodeSet;

  if (this.useFRGridVariant) {
    if (this.totalIterations % FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD == 1 && !this.isTreeGrowing && !this.isGrowthFinished) {
      this.updateGrid();
    }

    processedNodeSet = new Set();

    // calculate repulsion forces between each nodes and its surrounding
    for (i = 0; i < lNodes.length; i++) {
      nodeA = lNodes[i];
      this.calculateRepulsionForceOfANode(nodeA, processedNodeSet);
      processedNodeSet.add(nodeA);
    }
  } else {
    for (i = 0; i < lNodes.length; i++) {
      nodeA = lNodes[i];

      for (j = i + 1; j < lNodes.length; j++) {
        nodeB = lNodes[j];

        // If both nodes are not members of the same graph, skip.
        if (nodeA.getOwner() != nodeB.getOwner()) {
          continue;
        }

        this.calcRepulsionForce(nodeA, nodeB);
      }
    }
  }
};

FDLayout.prototype.calcGravitationalForces = function () {
  var node;
  var lNodes = this.getAllNodesToApplyGravitation();

  for (var i = 0; i < lNodes.length; i++) {
    node = lNodes[i];
    this.calcGravitationalForce(node);
  }
};

FDLayout.prototype.moveNodes = function () {
  var lNodes = this.getAllNodes();
  var node;
  var nodesData = [];
  for (var i = 0; i < lNodes.length; i++) {
    node = lNodes[i];
    nodesData[i] = node.move();
  }
  return nodesData;
};

FDLayout.prototype.calcSpringForce = function (edge, idealLength) {
  var sourceNode = edge.getSource();
  var targetNode = edge.getTarget();

  var length;
  var xLength;
  var yLength;
  var springForce;
  var springForceX;
  var springForceY;

  // Update edge length
  if (this.uniformLeafNodeSizes && sourceNode.getChild() == null && targetNode.getChild() == null) {
    edge.updateLengthSimple();
  } else {
    edge.updateLength();

    if (edge.isOverlapingSourceAndTarget) {
      return;
    }
  }

  length = edge.getLength();
  xLength = edge.lengthX;
  yLength = edge.lengthY;

  // Calculate spring forces
  springForce = this.springConstant * (length - idealLength);

  // Project force onto x and y axes
  springForceX = springForce * (edge.lengthX / length);
  springForceY = springForce * (edge.lengthY / length);

  // Apply forces on the end nodes
  sourceNode.springForceX += springForceX;
  sourceNode.springForceY += springForceY;
  targetNode.springForceX -= springForceX;
  targetNode.springForceY -= springForceY;

  var edgeData = {
    source: sourceNode,
    target: targetNode,
    length: length,
    xLength: xLength,
    yLength: yLength
  };

  return edgeData;
};

FDLayout.prototype.calcRepulsionForce = function (nodeA, nodeB) {
  var rectA = nodeA.getRect();
  var rectB = nodeB.getRect();
  var overlapAmount = new Array(2);
  var clipPoints = new Array(4);
  var distanceX;
  var distanceY;
  var distanceSquared;
  var distance;
  var repulsionForce;
  var repulsionForceX;
  var repulsionForceY;

  if (rectA.intersects(rectB)) // two nodes overlap
    {
      // calculate separation amount in x and y directions
      IGeometry.calcSeparationAmount(rectA, rectB, overlapAmount, FDLayoutConstants.DEFAULT_EDGE_LENGTH / 2.0);

      repulsionForceX = 2 * overlapAmount[0];
      repulsionForceY = 2 * overlapAmount[1];

      var childrenConstant = nodeA.noOfChildren * nodeB.noOfChildren / (nodeA.noOfChildren + nodeB.noOfChildren);

      // Apply forces on the two nodes
      nodeA.repulsionForceX -= childrenConstant * repulsionForceX;
      nodeA.repulsionForceY -= childrenConstant * repulsionForceY;
      nodeB.repulsionForceX += childrenConstant * repulsionForceX;
      nodeB.repulsionForceY += childrenConstant * repulsionForceY;
    } else // no overlap
    {
      // calculate distance

      if (this.uniformLeafNodeSizes && nodeA.getChild() == null && nodeB.getChild() == null) // simply base repulsion on distance of node centers
        {
          distanceX = rectB.getCenterX() - rectA.getCenterX();
          distanceY = rectB.getCenterY() - rectA.getCenterY();
        } else // use clipping points
        {
          IGeometry.getIntersection(rectA, rectB, clipPoints);

          distanceX = clipPoints[2] - clipPoints[0];
          distanceY = clipPoints[3] - clipPoints[1];
        }

      // No repulsion range. FR grid variant should take care of this.
      if (Math.abs(distanceX) < FDLayoutConstants.MIN_REPULSION_DIST) {
        distanceX = IMath.sign(distanceX) * FDLayoutConstants.MIN_REPULSION_DIST;
      }

      if (Math.abs(distanceY) < FDLayoutConstants.MIN_REPULSION_DIST) {
        distanceY = IMath.sign(distanceY) * FDLayoutConstants.MIN_REPULSION_DIST;
      }

      distanceSquared = distanceX * distanceX + distanceY * distanceY;
      distance = Math.sqrt(distanceSquared);

      repulsionForce = this.repulsionConstant * nodeA.noOfChildren * nodeB.noOfChildren / distanceSquared;

      // Project force onto x and y axes
      repulsionForceX = repulsionForce * distanceX / distance;
      repulsionForceY = repulsionForce * distanceY / distance;

      // Apply forces on the two nodes    
      nodeA.repulsionForceX -= repulsionForceX;
      nodeA.repulsionForceY -= repulsionForceY;
      nodeB.repulsionForceX += repulsionForceX;
      nodeB.repulsionForceY += repulsionForceY;
    }
};

FDLayout.prototype.calcGravitationalForce = function (node) {
  var ownerGraph;
  var ownerCenterX;
  var ownerCenterY;
  var distanceX;
  var distanceY;
  var absDistanceX;
  var absDistanceY;
  var estimatedSize;
  ownerGraph = node.getOwner();

  ownerCenterX = (ownerGraph.getRight() + ownerGraph.getLeft()) / 2;
  ownerCenterY = (ownerGraph.getTop() + ownerGraph.getBottom()) / 2;
  distanceX = node.getCenterX() - ownerCenterX;
  distanceY = node.getCenterY() - ownerCenterY;
  absDistanceX = Math.abs(distanceX) + node.getWidth() / 2;
  absDistanceY = Math.abs(distanceY) + node.getHeight() / 2;

  if (node.getOwner() == this.graphManager.getRoot()) // in the root graph
    {
      estimatedSize = ownerGraph.getEstimatedSize() * this.gravityRangeFactor;

      if (absDistanceX > estimatedSize || absDistanceY > estimatedSize) {
        node.gravitationForceX = -this.gravityConstant * distanceX;
        node.gravitationForceY = -this.gravityConstant * distanceY;
      }
    } else // inside a compound
    {
      estimatedSize = ownerGraph.getEstimatedSize() * this.compoundGravityRangeFactor;

      if (absDistanceX > estimatedSize || absDistanceY > estimatedSize) {
        node.gravitationForceX = -this.gravityConstant * distanceX * this.compoundGravityConstant;
        node.gravitationForceY = -this.gravityConstant * distanceY * this.compoundGravityConstant;
      }
    }
};

FDLayout.prototype.isConverged = function () {
  var converged;
  var oscilating = false;

  if (this.totalIterations > this.maxIterations / 3) {
    oscilating = Math.abs(this.totalDisplacement - this.oldTotalDisplacement) < 2;
  }

  converged = this.totalDisplacement < this.totalDisplacementThreshold;

  this.oldTotalDisplacement = this.totalDisplacement;

  return converged || oscilating;
};

FDLayout.prototype.animate = function () {
  if (this.animationDuringLayout && !this.isSubLayout) {
    if (this.notAnimatedIterations == this.animationPeriod) {
      this.update();
      this.notAnimatedIterations = 0;
    } else {
      this.notAnimatedIterations++;
    }
  }
};

// -----------------------------------------------------------------------------
// Section: FR-Grid Variant Repulsion Force Calculation
// -----------------------------------------------------------------------------

FDLayout.prototype.calcGrid = function (graph) {

  var sizeX = 0;
  var sizeY = 0;

  sizeX = parseInt(Math.ceil((graph.getRight() - graph.getLeft()) / this.repulsionRange));
  sizeY = parseInt(Math.ceil((graph.getBottom() - graph.getTop()) / this.repulsionRange));

  var grid = new Array(sizeX);

  for (var i = 0; i < sizeX; i++) {
    grid[i] = new Array(sizeY);
  }

  for (var i = 0; i < sizeX; i++) {
    for (var j = 0; j < sizeY; j++) {
      grid[i][j] = new Array();
    }
  }

  return grid;
};

FDLayout.prototype.addNodeToGrid = function (v, left, top) {

  var startX = 0;
  var finishX = 0;
  var startY = 0;
  var finishY = 0;

  startX = parseInt(Math.floor((v.getRect().x - left) / this.repulsionRange));
  finishX = parseInt(Math.floor((v.getRect().width + v.getRect().x - left) / this.repulsionRange));
  startY = parseInt(Math.floor((v.getRect().y - top) / this.repulsionRange));
  finishY = parseInt(Math.floor((v.getRect().height + v.getRect().y - top) / this.repulsionRange));

  for (var i = startX; i <= finishX; i++) {
    for (var j = startY; j <= finishY; j++) {
      this.grid[i][j].push(v);
      v.setGridCoordinates(startX, finishX, startY, finishY);
    }
  }
};

FDLayout.prototype.updateGrid = function () {
  var i;
  var nodeA;
  var lNodes = this.getAllNodes();

  this.grid = this.calcGrid(this.graphManager.getRoot());

  // put all nodes to proper grid cells
  for (i = 0; i < lNodes.length; i++) {
    nodeA = lNodes[i];
    this.addNodeToGrid(nodeA, this.graphManager.getRoot().getLeft(), this.graphManager.getRoot().getTop());
  }
};

FDLayout.prototype.calculateRepulsionForceOfANode = function (nodeA, processedNodeSet) {

  if (this.totalIterations % FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD == 1 && !this.isTreeGrowing && !this.isGrowthFinished || this.growTreeIterations % 10 == 1 && this.isTreeGrowing || this.afterGrowthIterations % 10 == 1 && this.isGrowthFinished) {
    var surrounding = new Set();
    nodeA.surrounding = new Array();
    var nodeB;
    var grid = this.grid;

    for (var i = nodeA.startX - 1; i < nodeA.finishX + 2; i++) {
      for (var j = nodeA.startY - 1; j < nodeA.finishY + 2; j++) {
        if (!(i < 0 || j < 0 || i >= grid.length || j >= grid[0].length)) {
          for (var k = 0; k < grid[i][j].length; k++) {
            nodeB = grid[i][j][k];

            // If both nodes are not members of the same graph, 
            // or both nodes are the same, skip.
            if (nodeA.getOwner() != nodeB.getOwner() || nodeA == nodeB) {
              continue;
            }

            // check if the repulsion force between
            // nodeA and nodeB has already been calculated
            if (!processedNodeSet.has(nodeB) && !surrounding.has(nodeB)) {
              var distanceX = Math.abs(nodeA.getCenterX() - nodeB.getCenterX()) - (nodeA.getWidth() / 2 + nodeB.getWidth() / 2);
              var distanceY = Math.abs(nodeA.getCenterY() - nodeB.getCenterY()) - (nodeA.getHeight() / 2 + nodeB.getHeight() / 2);

              // if the distance between nodeA and nodeB 
              // is less then calculation range
              if (distanceX <= this.repulsionRange && distanceY <= this.repulsionRange) {
                //then add nodeB to surrounding of nodeA
                surrounding.add(nodeB);
              }
            }
          }
        }
      }
    }

    nodeA.surrounding = [].concat(_toConsumableArray(surrounding));
  }
  for (i = 0; i < nodeA.surrounding.length; i++) {
    this.calcRepulsionForce(nodeA, nodeA.surrounding[i]);
  }
};

FDLayout.prototype.calcRepulsionRange = function () {
  return 0.0;
};

// -----------------------------------------------------------------------------
// Section: Tree Reduction methods
// -----------------------------------------------------------------------------
// Reduce trees 
FDLayout.prototype.reduceTrees = function () {
  var prunedNodesAll = [];
  var containsLeaf = true;
  var node;

  while (containsLeaf) {
    var allNodes = this.graphManager.getAllNodes();
    var prunedNodesInStepTemp = [];
    containsLeaf = false;

    for (var i = 0; i < allNodes.length; i++) {
      node = allNodes[i];
      if (node.getEdges().length == 1 && !node.getEdges()[0].isInterGraph && node.getChild() == null) {
        prunedNodesInStepTemp.push([node, node.getEdges()[0], node.getOwner()]);
        containsLeaf = true;
      }
    }
    if (containsLeaf == true) {
      var prunedNodesInStep = [];
      for (var j = 0; j < prunedNodesInStepTemp.length; j++) {
        if (prunedNodesInStepTemp[j][0].getEdges().length == 1) {
          prunedNodesInStep.push(prunedNodesInStepTemp[j]);
          prunedNodesInStepTemp[j][0].getOwner().remove(prunedNodesInStepTemp[j][0]);
        }
      }
      prunedNodesAll.push(prunedNodesInStep);
      this.graphManager.resetAllNodes();
      this.graphManager.resetAllEdges();
    }
  }
  this.prunedNodesAll = prunedNodesAll;
};

// Grow tree one step 
FDLayout.prototype.growTree = function (prunedNodesAll) {
  var lengthOfPrunedNodesInStep = prunedNodesAll.length;
  var prunedNodesInStep = prunedNodesAll[lengthOfPrunedNodesInStep - 1];

  var nodeData;
  for (var i = 0; i < prunedNodesInStep.length; i++) {
    nodeData = prunedNodesInStep[i];

    this.findPlaceforPrunedNode(nodeData);

    nodeData[2].add(nodeData[0]);
    nodeData[2].add(nodeData[1], nodeData[1].source, nodeData[1].target);
  }

  prunedNodesAll.splice(prunedNodesAll.length - 1, 1);
  this.graphManager.resetAllNodes();
  this.graphManager.resetAllEdges();
};

// Find an appropriate position to replace pruned node, this method can be improved
FDLayout.prototype.findPlaceforPrunedNode = function (nodeData) {

  var gridForPrunedNode;
  var nodeToConnect;
  var prunedNode = nodeData[0];
  if (prunedNode == nodeData[1].source) {
    nodeToConnect = nodeData[1].target;
  } else {
    nodeToConnect = nodeData[1].source;
  }
  var startGridX = nodeToConnect.startX;
  var finishGridX = nodeToConnect.finishX;
  var startGridY = nodeToConnect.startY;
  var finishGridY = nodeToConnect.finishY;

  var upNodeCount = 0;
  var downNodeCount = 0;
  var rightNodeCount = 0;
  var leftNodeCount = 0;
  var controlRegions = [upNodeCount, rightNodeCount, downNodeCount, leftNodeCount];

  if (startGridY > 0) {
    for (var i = startGridX; i <= finishGridX; i++) {
      controlRegions[0] += this.grid[i][startGridY - 1].length + this.grid[i][startGridY].length - 1;
    }
  }
  if (finishGridX < this.grid.length - 1) {
    for (var i = startGridY; i <= finishGridY; i++) {
      controlRegions[1] += this.grid[finishGridX + 1][i].length + this.grid[finishGridX][i].length - 1;
    }
  }
  if (finishGridY < this.grid[0].length - 1) {
    for (var i = startGridX; i <= finishGridX; i++) {
      controlRegions[2] += this.grid[i][finishGridY + 1].length + this.grid[i][finishGridY].length - 1;
    }
  }
  if (startGridX > 0) {
    for (var i = startGridY; i <= finishGridY; i++) {
      controlRegions[3] += this.grid[startGridX - 1][i].length + this.grid[startGridX][i].length - 1;
    }
  }
  var min = Integer.MAX_VALUE;
  var minCount;
  var minIndex;
  for (var j = 0; j < controlRegions.length; j++) {
    if (controlRegions[j] < min) {
      min = controlRegions[j];
      minCount = 1;
      minIndex = j;
    } else if (controlRegions[j] == min) {
      minCount++;
    }
  }

  if (minCount == 3 && min == 0) {
    if (controlRegions[0] == 0 && controlRegions[1] == 0 && controlRegions[2] == 0) {
      gridForPrunedNode = 1;
    } else if (controlRegions[0] == 0 && controlRegions[1] == 0 && controlRegions[3] == 0) {
      gridForPrunedNode = 0;
    } else if (controlRegions[0] == 0 && controlRegions[2] == 0 && controlRegions[3] == 0) {
      gridForPrunedNode = 3;
    } else if (controlRegions[1] == 0 && controlRegions[2] == 0 && controlRegions[3] == 0) {
      gridForPrunedNode = 2;
    }
  } else if (minCount == 2 && min == 0) {
    var random = Math.floor(Math.random() * 2);
    if (controlRegions[0] == 0 && controlRegions[1] == 0) {
      ;
      if (random == 0) {
        gridForPrunedNode = 0;
      } else {
        gridForPrunedNode = 1;
      }
    } else if (controlRegions[0] == 0 && controlRegions[2] == 0) {
      if (random == 0) {
        gridForPrunedNode = 0;
      } else {
        gridForPrunedNode = 2;
      }
    } else if (controlRegions[0] == 0 && controlRegions[3] == 0) {
      if (random == 0) {
        gridForPrunedNode = 0;
      } else {
        gridForPrunedNode = 3;
      }
    } else if (controlRegions[1] == 0 && controlRegions[2] == 0) {
      if (random == 0) {
        gridForPrunedNode = 1;
      } else {
        gridForPrunedNode = 2;
      }
    } else if (controlRegions[1] == 0 && controlRegions[3] == 0) {
      if (random == 0) {
        gridForPrunedNode = 1;
      } else {
        gridForPrunedNode = 3;
      }
    } else {
      if (random == 0) {
        gridForPrunedNode = 2;
      } else {
        gridForPrunedNode = 3;
      }
    }
  } else if (minCount == 4 && min == 0) {
    var random = Math.floor(Math.random() * 4);
    gridForPrunedNode = random;
  } else {
    gridForPrunedNode = minIndex;
  }

  if (gridForPrunedNode == 0) {
    prunedNode.setCenter(nodeToConnect.getCenterX(), nodeToConnect.getCenterY() - nodeToConnect.getHeight() / 2 - FDLayoutConstants.DEFAULT_EDGE_LENGTH - prunedNode.getHeight() / 2);
  } else if (gridForPrunedNode == 1) {
    prunedNode.setCenter(nodeToConnect.getCenterX() + nodeToConnect.getWidth() / 2 + FDLayoutConstants.DEFAULT_EDGE_LENGTH + prunedNode.getWidth() / 2, nodeToConnect.getCenterY());
  } else if (gridForPrunedNode == 2) {
    prunedNode.setCenter(nodeToConnect.getCenterX(), nodeToConnect.getCenterY() + nodeToConnect.getHeight() / 2 + FDLayoutConstants.DEFAULT_EDGE_LENGTH + prunedNode.getHeight() / 2);
  } else {
    prunedNode.setCenter(nodeToConnect.getCenterX() - nodeToConnect.getWidth() / 2 - FDLayoutConstants.DEFAULT_EDGE_LENGTH - prunedNode.getWidth() / 2, nodeToConnect.getCenterY());
  }
};

module.exports = FDLayout;

},{"./FDLayoutConstants":16,"./IGeometry":21,"./IMath":22,"./Integer":23,"./Layout":29,"./LayoutConstants":30}],16:[function(require,module,exports){
'use strict';

var LayoutConstants = require('./LayoutConstants');

function FDLayoutConstants() {}

//FDLayoutConstants inherits static props in LayoutConstants
for (var prop in LayoutConstants) {
  FDLayoutConstants[prop] = LayoutConstants[prop];
}

FDLayoutConstants.MAX_ITERATIONS = 2500;

FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
FDLayoutConstants.DEFAULT_SPRING_STRENGTH = 0.45;
FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = 4500.0;
FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = 0.4;
FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = 1.0;
FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = 3.8;
FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = 1.5;
FDLayoutConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION = true;
FDLayoutConstants.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION = true;
FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = 0.5;
FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL = 100.0;
FDLayoutConstants.MAX_NODE_DISPLACEMENT = FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL * 3;
FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
FDLayoutConstants.CONVERGENCE_CHECK_PERIOD = 100;
FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = 0.1;
FDLayoutConstants.MIN_EDGE_LENGTH = 1;
FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD = 10;

module.exports = FDLayoutConstants;

},{"./LayoutConstants":30}],17:[function(require,module,exports){
'use strict';

var LEdge = require('./LEdge');
var FDLayoutConstants = require('./FDLayoutConstants');

function FDLayoutEdge(source, target, vEdge) {
  LEdge.call(this, source, target, vEdge);
  this.idealLength = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
}

FDLayoutEdge.prototype = Object.create(LEdge.prototype);

for (var prop in LEdge) {
  FDLayoutEdge[prop] = LEdge[prop];
}

module.exports = FDLayoutEdge;

},{"./FDLayoutConstants":16,"./LEdge":24}],18:[function(require,module,exports){
'use strict';

var LNode = require('./LNode');

function FDLayoutNode(gm, loc, size, vNode) {
  // alternative constructor is handled inside LNode
  LNode.call(this, gm, loc, size, vNode);
  //Spring, repulsion and gravitational forces acting on this node
  this.springForceX = 0;
  this.springForceY = 0;
  this.repulsionForceX = 0;
  this.repulsionForceY = 0;
  this.gravitationForceX = 0;
  this.gravitationForceY = 0;
  //Amount by which this node is to be moved in this iteration
  this.displacementX = 0;
  this.displacementY = 0;

  //Start and finish grid coordinates that this node is fallen into
  this.startX = 0;
  this.finishX = 0;
  this.startY = 0;
  this.finishY = 0;

  //Geometric neighbors of this node
  this.surrounding = [];
}

FDLayoutNode.prototype = Object.create(LNode.prototype);

for (var prop in LNode) {
  FDLayoutNode[prop] = LNode[prop];
}

FDLayoutNode.prototype.setGridCoordinates = function (_startX, _finishX, _startY, _finishY) {
  this.startX = _startX;
  this.finishX = _finishX;
  this.startY = _startY;
  this.finishY = _finishY;
};

module.exports = FDLayoutNode;

},{"./LNode":28}],19:[function(require,module,exports){
'use strict';

var UniqueIDGeneretor = require('./UniqueIDGeneretor');

function HashMap() {
  this.map = {};
  this.keys = [];
}

HashMap.prototype.put = function (key, value) {
  var theId = UniqueIDGeneretor.createID(key);
  if (!this.contains(theId)) {
    this.map[theId] = value;
    this.keys.push(key);
  }
};

HashMap.prototype.contains = function (key) {
  var theId = UniqueIDGeneretor.createID(key);
  return this.map[key] != null;
};

HashMap.prototype.get = function (key) {
  var theId = UniqueIDGeneretor.createID(key);
  return this.map[theId];
};

HashMap.prototype.keySet = function () {
  return this.keys;
};

module.exports = HashMap;

},{"./UniqueIDGeneretor":36}],20:[function(require,module,exports){
'use strict';

var UniqueIDGeneretor = require('./UniqueIDGeneretor');

function HashSet() {
  this.set = {};
}
;

HashSet.prototype.add = function (obj) {
  var theId = UniqueIDGeneretor.createID(obj);
  if (!this.contains(theId)) this.set[theId] = obj;
};

HashSet.prototype.remove = function (obj) {
  delete this.set[UniqueIDGeneretor.createID(obj)];
};

HashSet.prototype.clear = function () {
  this.set = {};
};

HashSet.prototype.contains = function (obj) {
  return this.set[UniqueIDGeneretor.createID(obj)] == obj;
};

HashSet.prototype.isEmpty = function () {
  return this.size() === 0;
};

HashSet.prototype.size = function () {
  return Object.keys(this.set).length;
};

//concats this.set to the given list
HashSet.prototype.addAllTo = function (list) {
  var keys = Object.keys(this.set);
  var length = keys.length;
  for (var i = 0; i < length; i++) {
    list.push(this.set[keys[i]]);
  }
};

HashSet.prototype.size = function () {
  return Object.keys(this.set).length;
};

HashSet.prototype.addAll = function (list) {
  var s = list.length;
  for (var i = 0; i < s; i++) {
    var v = list[i];
    this.add(v);
  }
};

module.exports = HashSet;

},{"./UniqueIDGeneretor":36}],21:[function(require,module,exports){
"use strict";

function IGeometry() {}

IGeometry.calcSeparationAmount = function (rectA, rectB, overlapAmount, separationBuffer) {
  if (!rectA.intersects(rectB)) {
    throw "assert failed";
  }
  var directions = new Array(2);
  IGeometry.decideDirectionsForOverlappingNodes(rectA, rectB, directions);
  overlapAmount[0] = Math.min(rectA.getRight(), rectB.getRight()) - Math.max(rectA.x, rectB.x);
  overlapAmount[1] = Math.min(rectA.getBottom(), rectB.getBottom()) - Math.max(rectA.y, rectB.y);
  // update the overlapping amounts for the following cases:
  if (rectA.getX() <= rectB.getX() && rectA.getRight() >= rectB.getRight()) {
    overlapAmount[0] += Math.min(rectB.getX() - rectA.getX(), rectA.getRight() - rectB.getRight());
  } else if (rectB.getX() <= rectA.getX() && rectB.getRight() >= rectA.getRight()) {
    overlapAmount[0] += Math.min(rectA.getX() - rectB.getX(), rectB.getRight() - rectA.getRight());
  }
  if (rectA.getY() <= rectB.getY() && rectA.getBottom() >= rectB.getBottom()) {
    overlapAmount[1] += Math.min(rectB.getY() - rectA.getY(), rectA.getBottom() - rectB.getBottom());
  } else if (rectB.getY() <= rectA.getY() && rectB.getBottom() >= rectA.getBottom()) {
    overlapAmount[1] += Math.min(rectA.getY() - rectB.getY(), rectB.getBottom() - rectA.getBottom());
  }

  // find slope of the line passes two centers
  var slope = Math.abs((rectB.getCenterY() - rectA.getCenterY()) / (rectB.getCenterX() - rectA.getCenterX()));
  // if centers are overlapped
  if (rectB.getCenterY() == rectA.getCenterY() && rectB.getCenterX() == rectA.getCenterX()) {
    // assume the slope is 1 (45 degree)
    slope = 1.0;
  }

  var moveByY = slope * overlapAmount[0];
  var moveByX = overlapAmount[1] / slope;
  if (overlapAmount[0] < moveByX) {
    moveByX = overlapAmount[0];
  } else {
    moveByY = overlapAmount[1];
  }
  // return half the amount so that if each rectangle is moved by these
  // amounts in opposite directions, overlap will be resolved
  overlapAmount[0] = -1 * directions[0] * (moveByX / 2 + separationBuffer);
  overlapAmount[1] = -1 * directions[1] * (moveByY / 2 + separationBuffer);
};

IGeometry.decideDirectionsForOverlappingNodes = function (rectA, rectB, directions) {
  if (rectA.getCenterX() < rectB.getCenterX()) {
    directions[0] = -1;
  } else {
    directions[0] = 1;
  }

  if (rectA.getCenterY() < rectB.getCenterY()) {
    directions[1] = -1;
  } else {
    directions[1] = 1;
  }
};

IGeometry.getIntersection2 = function (rectA, rectB, result) {
  //result[0-1] will contain clipPoint of rectA, result[2-3] will contain clipPoint of rectB
  var p1x = rectA.getCenterX();
  var p1y = rectA.getCenterY();
  var p2x = rectB.getCenterX();
  var p2y = rectB.getCenterY();

  //if two rectangles intersect, then clipping points are centers
  if (rectA.intersects(rectB)) {
    result[0] = p1x;
    result[1] = p1y;
    result[2] = p2x;
    result[3] = p2y;
    return true;
  }
  //variables for rectA
  var topLeftAx = rectA.getX();
  var topLeftAy = rectA.getY();
  var topRightAx = rectA.getRight();
  var bottomLeftAx = rectA.getX();
  var bottomLeftAy = rectA.getBottom();
  var bottomRightAx = rectA.getRight();
  var halfWidthA = rectA.getWidthHalf();
  var halfHeightA = rectA.getHeightHalf();
  //variables for rectB
  var topLeftBx = rectB.getX();
  var topLeftBy = rectB.getY();
  var topRightBx = rectB.getRight();
  var bottomLeftBx = rectB.getX();
  var bottomLeftBy = rectB.getBottom();
  var bottomRightBx = rectB.getRight();
  var halfWidthB = rectB.getWidthHalf();
  var halfHeightB = rectB.getHeightHalf();
  //flag whether clipping points are found
  var clipPointAFound = false;
  var clipPointBFound = false;

  // line is vertical
  if (p1x == p2x) {
    if (p1y > p2y) {
      result[0] = p1x;
      result[1] = topLeftAy;
      result[2] = p2x;
      result[3] = bottomLeftBy;
      return false;
    } else if (p1y < p2y) {
      result[0] = p1x;
      result[1] = bottomLeftAy;
      result[2] = p2x;
      result[3] = topLeftBy;
      return false;
    } else {
      //not line, return null;
    }
  }
  // line is horizontal
  else if (p1y == p2y) {
      if (p1x > p2x) {
        result[0] = topLeftAx;
        result[1] = p1y;
        result[2] = topRightBx;
        result[3] = p2y;
        return false;
      } else if (p1x < p2x) {
        result[0] = topRightAx;
        result[1] = p1y;
        result[2] = topLeftBx;
        result[3] = p2y;
        return false;
      } else {
        //not valid line, return null;
      }
    } else {
      //slopes of rectA's and rectB's diagonals
      var slopeA = rectA.height / rectA.width;
      var slopeB = rectB.height / rectB.width;

      //slope of line between center of rectA and center of rectB
      var slopePrime = (p2y - p1y) / (p2x - p1x);
      var cardinalDirectionA;
      var cardinalDirectionB;
      var tempPointAx;
      var tempPointAy;
      var tempPointBx;
      var tempPointBy;

      //determine whether clipping point is the corner of nodeA
      if (-slopeA == slopePrime) {
        if (p1x > p2x) {
          result[0] = bottomLeftAx;
          result[1] = bottomLeftAy;
          clipPointAFound = true;
        } else {
          result[0] = topRightAx;
          result[1] = topLeftAy;
          clipPointAFound = true;
        }
      } else if (slopeA == slopePrime) {
        if (p1x > p2x) {
          result[0] = topLeftAx;
          result[1] = topLeftAy;
          clipPointAFound = true;
        } else {
          result[0] = bottomRightAx;
          result[1] = bottomLeftAy;
          clipPointAFound = true;
        }
      }

      //determine whether clipping point is the corner of nodeB
      if (-slopeB == slopePrime) {
        if (p2x > p1x) {
          result[2] = bottomLeftBx;
          result[3] = bottomLeftBy;
          clipPointBFound = true;
        } else {
          result[2] = topRightBx;
          result[3] = topLeftBy;
          clipPointBFound = true;
        }
      } else if (slopeB == slopePrime) {
        if (p2x > p1x) {
          result[2] = topLeftBx;
          result[3] = topLeftBy;
          clipPointBFound = true;
        } else {
          result[2] = bottomRightBx;
          result[3] = bottomLeftBy;
          clipPointBFound = true;
        }
      }

      //if both clipping points are corners
      if (clipPointAFound && clipPointBFound) {
        return false;
      }

      //determine Cardinal Direction of rectangles
      if (p1x > p2x) {
        if (p1y > p2y) {
          cardinalDirectionA = IGeometry.getCardinalDirection(slopeA, slopePrime, 4);
          cardinalDirectionB = IGeometry.getCardinalDirection(slopeB, slopePrime, 2);
        } else {
          cardinalDirectionA = IGeometry.getCardinalDirection(-slopeA, slopePrime, 3);
          cardinalDirectionB = IGeometry.getCardinalDirection(-slopeB, slopePrime, 1);
        }
      } else {
        if (p1y > p2y) {
          cardinalDirectionA = IGeometry.getCardinalDirection(-slopeA, slopePrime, 1);
          cardinalDirectionB = IGeometry.getCardinalDirection(-slopeB, slopePrime, 3);
        } else {
          cardinalDirectionA = IGeometry.getCardinalDirection(slopeA, slopePrime, 2);
          cardinalDirectionB = IGeometry.getCardinalDirection(slopeB, slopePrime, 4);
        }
      }
      //calculate clipping Point if it is not found before
      if (!clipPointAFound) {
        switch (cardinalDirectionA) {
          case 1:
            tempPointAy = topLeftAy;
            tempPointAx = p1x + -halfHeightA / slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 2:
            tempPointAx = bottomRightAx;
            tempPointAy = p1y + halfWidthA * slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 3:
            tempPointAy = bottomLeftAy;
            tempPointAx = p1x + halfHeightA / slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
          case 4:
            tempPointAx = bottomLeftAx;
            tempPointAy = p1y + -halfWidthA * slopePrime;
            result[0] = tempPointAx;
            result[1] = tempPointAy;
            break;
        }
      }
      if (!clipPointBFound) {
        switch (cardinalDirectionB) {
          case 1:
            tempPointBy = topLeftBy;
            tempPointBx = p2x + -halfHeightB / slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 2:
            tempPointBx = bottomRightBx;
            tempPointBy = p2y + halfWidthB * slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 3:
            tempPointBy = bottomLeftBy;
            tempPointBx = p2x + halfHeightB / slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
          case 4:
            tempPointBx = bottomLeftBx;
            tempPointBy = p2y + -halfWidthB * slopePrime;
            result[2] = tempPointBx;
            result[3] = tempPointBy;
            break;
        }
      }
    }
  return false;
};

IGeometry.getCardinalDirection = function (slope, slopePrime, line) {
  if (slope > slopePrime) {
    return line;
  } else {
    return 1 + line % 4;
  }
};

IGeometry.getIntersection = function (s1, s2, f1, f2) {
  if (f2 == null) {
    return IGeometry.getIntersection2(s1, s2, f1);
  }
  var x1 = s1.x;
  var y1 = s1.y;
  var x2 = s2.x;
  var y2 = s2.y;
  var x3 = f1.x;
  var y3 = f1.y;
  var x4 = f2.x;
  var y4 = f2.y;
  var x, y; // intersection point
  var a1, a2, b1, b2, c1, c2; // coefficients of line eqns.
  var denom;

  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2; // { a1*x + b1*y + c1 = 0 is line 1 }

  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4; // { a2*x + b2*y + c2 = 0 is line 2 }

  denom = a1 * b2 - a2 * b1;

  if (denom == 0) {
    return null;
  }

  x = (b1 * c2 - b2 * c1) / denom;
  y = (a2 * c1 - a1 * c2) / denom;

  return new Point(x, y);
};

// -----------------------------------------------------------------------------
// Section: Class Constants
// -----------------------------------------------------------------------------
/**
 * Some useful pre-calculated constants
 */
IGeometry.HALF_PI = 0.5 * Math.PI;
IGeometry.ONE_AND_HALF_PI = 1.5 * Math.PI;
IGeometry.TWO_PI = 2.0 * Math.PI;
IGeometry.THREE_PI = 3.0 * Math.PI;

module.exports = IGeometry;

},{}],22:[function(require,module,exports){
"use strict";

function IMath() {}

/**
 * This method returns the sign of the input value.
 */
IMath.sign = function (value) {
  if (value > 0) {
    return 1;
  } else if (value < 0) {
    return -1;
  } else {
    return 0;
  }
};

IMath.floor = function (value) {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
};

IMath.ceil = function (value) {
  return value < 0 ? Math.floor(value) : Math.ceil(value);
};

module.exports = IMath;

},{}],23:[function(require,module,exports){
"use strict";

function Integer() {}

Integer.MAX_VALUE = 2147483647;
Integer.MIN_VALUE = -2147483648;

module.exports = Integer;

},{}],24:[function(require,module,exports){
'use strict';

var LGraphObject = require('./LGraphObject');
var IGeometry = require('./IGeometry');
var IMath = require('./IMath');

function LEdge(source, target, vEdge) {
  LGraphObject.call(this, vEdge);

  this.isOverlapingSourceAndTarget = false;
  this.vGraphObject = vEdge;
  this.bendpoints = [];
  this.source = source;
  this.target = target;
}

LEdge.prototype = Object.create(LGraphObject.prototype);

for (var prop in LGraphObject) {
  LEdge[prop] = LGraphObject[prop];
}

LEdge.prototype.getSource = function () {
  return this.source;
};

LEdge.prototype.getTarget = function () {
  return this.target;
};

LEdge.prototype.isInterGraph = function () {
  return this.isInterGraph;
};

LEdge.prototype.getLength = function () {
  return this.length;
};

LEdge.prototype.isOverlapingSourceAndTarget = function () {
  return this.isOverlapingSourceAndTarget;
};

LEdge.prototype.getBendpoints = function () {
  return this.bendpoints;
};

LEdge.prototype.getLca = function () {
  return this.lca;
};

LEdge.prototype.getSourceInLca = function () {
  return this.sourceInLca;
};

LEdge.prototype.getTargetInLca = function () {
  return this.targetInLca;
};

LEdge.prototype.getOtherEnd = function (node) {
  if (this.source === node) {
    return this.target;
  } else if (this.target === node) {
    return this.source;
  } else {
    throw "Node is not incident with this edge";
  }
};

LEdge.prototype.getOtherEndInGraph = function (node, graph) {
  var otherEnd = this.getOtherEnd(node);
  var root = graph.getGraphManager().getRoot();

  while (true) {
    if (otherEnd.getOwner() == graph) {
      return otherEnd;
    }

    if (otherEnd.getOwner() == root) {
      break;
    }

    otherEnd = otherEnd.getOwner().getParent();
  }

  return null;
};

LEdge.prototype.updateLength = function () {
  var clipPointCoordinates = new Array(4);

  this.isOverlapingSourceAndTarget = IGeometry.getIntersection(this.target.getRect(), this.source.getRect(), clipPointCoordinates);

  if (!this.isOverlapingSourceAndTarget) {
    this.lengthX = clipPointCoordinates[0] - clipPointCoordinates[2];
    this.lengthY = clipPointCoordinates[1] - clipPointCoordinates[3];

    if (Math.abs(this.lengthX) < 1.0) {
      this.lengthX = IMath.sign(this.lengthX);
    }

    if (Math.abs(this.lengthY) < 1.0) {
      this.lengthY = IMath.sign(this.lengthY);
    }

    this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
  }
};

LEdge.prototype.updateLengthSimple = function () {
  this.lengthX = this.target.getCenterX() - this.source.getCenterX();
  this.lengthY = this.target.getCenterY() - this.source.getCenterY();

  if (Math.abs(this.lengthX) < 1.0) {
    this.lengthX = IMath.sign(this.lengthX);
  }

  if (Math.abs(this.lengthY) < 1.0) {
    this.lengthY = IMath.sign(this.lengthY);
  }

  this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY);
};

module.exports = LEdge;

},{"./IGeometry":21,"./IMath":22,"./LGraphObject":27}],25:[function(require,module,exports){
'use strict';

var LGraphObject = require('./LGraphObject');
var Integer = require('./Integer');
var LayoutConstants = require('./LayoutConstants');
var LGraphManager = require('./LGraphManager');
var LNode = require('./LNode');
var LEdge = require('./LEdge');
var HashSet = require('./HashSet');
var RectangleD = require('./RectangleD');
var Point = require('./Point');
var List = require('linkedlist-js').List;
var Layout;

function LGraph(parent, obj2, vGraph) {
  Layout = require('./Layout');
  LGraphObject.call(this, vGraph);
  this.estimatedSize = Integer.MIN_VALUE;
  this.margin = LayoutConstants.DEFAULT_GRAPH_MARGIN;
  this.edges = [];
  this.nodes = [];
  this.isConnected = false;
  this.parent = parent;

  if (obj2 != null && obj2 instanceof LGraphManager) {
    this.graphManager = obj2;
  } else if (obj2 != null && obj2 instanceof Layout) {
    this.graphManager = obj2.graphManager;
  }
}

LGraph.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LGraph[prop] = LGraphObject[prop];
}

LGraph.prototype.getNodes = function () {
  return this.nodes;
};

LGraph.prototype.getEdges = function () {
  return this.edges;
};

LGraph.prototype.getGraphManager = function () {
  return this.graphManager;
};

LGraph.prototype.getParent = function () {
  return this.parent;
};

LGraph.prototype.getLeft = function () {
  return this.left;
};

LGraph.prototype.getRight = function () {
  return this.right;
};

LGraph.prototype.getTop = function () {
  return this.top;
};

LGraph.prototype.getBottom = function () {
  return this.bottom;
};

LGraph.prototype.isConnected = function () {
  return this.isConnected;
};

LGraph.prototype.add = function (obj1, sourceNode, targetNode) {
  if (sourceNode == null && targetNode == null) {
    var newNode = obj1;
    if (this.graphManager == null) {
      throw "Graph has no graph mgr!";
    }
    if (this.getNodes().indexOf(newNode) > -1) {
      throw "Node already in graph!";
    }
    newNode.owner = this;
    this.getNodes().push(newNode);

    return newNode;
  } else {
    var newEdge = obj1;
    if (!(this.getNodes().indexOf(sourceNode) > -1 && this.getNodes().indexOf(targetNode) > -1)) {
      throw "Source or target not in graph!";
    }

    if (!(sourceNode.owner == targetNode.owner && sourceNode.owner == this)) {
      throw "Both owners must be this graph!";
    }

    if (sourceNode.owner != targetNode.owner) {
      return null;
    }

    // set source and target
    newEdge.source = sourceNode;
    newEdge.target = targetNode;

    // set as intra-graph edge
    newEdge.isInterGraph = false;

    // add to graph edge list
    this.getEdges().push(newEdge);

    // add to incidency lists
    sourceNode.edges.push(newEdge);

    if (targetNode != sourceNode) {
      targetNode.edges.push(newEdge);
    }

    return newEdge;
  }
};

LGraph.prototype.remove = function (obj) {
  var node = obj;
  if (obj instanceof LNode) {
    if (node == null) {
      throw "Node is null!";
    }
    if (!(node.owner != null && node.owner == this)) {
      throw "Owner graph is invalid!";
    }
    if (this.graphManager == null) {
      throw "Owner graph manager is invalid!";
    }
    // remove incident edges first (make a copy to do it safely)
    var edgesToBeRemoved = node.edges.slice();
    var edge;
    var s = edgesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      edge = edgesToBeRemoved[i];

      if (edge.isInterGraph) {
        this.graphManager.remove(edge);
      } else {
        edge.source.owner.remove(edge);
      }
    }

    // now the node itself
    var index = this.nodes.indexOf(node);
    if (index == -1) {
      throw "Node not in owner node list!";
    }

    this.nodes.splice(index, 1);
  } else if (obj instanceof LEdge) {
    var edge = obj;
    if (edge == null) {
      throw "Edge is null!";
    }
    if (!(edge.source != null && edge.target != null)) {
      throw "Source and/or target is null!";
    }
    if (!(edge.source.owner != null && edge.target.owner != null && edge.source.owner == this && edge.target.owner == this)) {
      throw "Source and/or target owner is invalid!";
    }

    var sourceIndex = edge.source.edges.indexOf(edge);
    var targetIndex = edge.target.edges.indexOf(edge);
    if (!(sourceIndex > -1 && targetIndex > -1)) {
      throw "Source and/or target doesn't know this edge!";
    }

    edge.source.edges.splice(sourceIndex, 1);

    if (edge.target != edge.source) {
      edge.target.edges.splice(targetIndex, 1);
    }

    var index = edge.source.owner.getEdges().indexOf(edge);
    if (index == -1) {
      throw "Not in owner's edge list!";
    }

    edge.source.owner.getEdges().splice(index, 1);
  }
};

LGraph.prototype.updateLeftTop = function () {
  var top = Integer.MAX_VALUE;
  var left = Integer.MAX_VALUE;
  var nodeTop;
  var nodeLeft;
  var margin;

  var nodes = this.getNodes();
  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    nodeTop = lNode.getTop();
    nodeLeft = lNode.getLeft();

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (left > nodeLeft) {
      left = nodeLeft;
    }
  }

  // Do we have any nodes in this graph?
  if (top == Integer.MAX_VALUE) {
    return null;
  }

  if (nodes[0].getParent().paddingLeft != undefined) {
    margin = nodes[0].getParent().paddingLeft;
  } else {
    margin = this.margin;
  }

  this.left = left - margin;
  this.top = top - margin;

  // Apply the margins and return the result
  return new Point(this.left, this.top);
};

LGraph.prototype.updateBounds = function (recursive) {
  // calculate bounds
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;
  var margin;

  var nodes = this.nodes;
  var s = nodes.length;
  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];

    if (recursive && lNode.child != null) {
      lNode.updateBounds();
    }
    nodeLeft = lNode.getLeft();
    nodeRight = lNode.getRight();
    nodeTop = lNode.getTop();
    nodeBottom = lNode.getBottom();

    if (left > nodeLeft) {
      left = nodeLeft;
    }

    if (right < nodeRight) {
      right = nodeRight;
    }

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (bottom < nodeBottom) {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);
  if (left == Integer.MAX_VALUE) {
    this.left = this.parent.getLeft();
    this.right = this.parent.getRight();
    this.top = this.parent.getTop();
    this.bottom = this.parent.getBottom();
  }

  if (nodes[0].getParent().paddingLeft != undefined) {
    margin = nodes[0].getParent().paddingLeft;
  } else {
    margin = this.margin;
  }

  this.left = boundingRect.x - margin;
  this.right = boundingRect.x + boundingRect.width + margin;
  this.top = boundingRect.y - margin;
  this.bottom = boundingRect.y + boundingRect.height + margin;
};

LGraph.calculateBounds = function (nodes) {
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;

  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    nodeLeft = lNode.getLeft();
    nodeRight = lNode.getRight();
    nodeTop = lNode.getTop();
    nodeBottom = lNode.getBottom();

    if (left > nodeLeft) {
      left = nodeLeft;
    }

    if (right < nodeRight) {
      right = nodeRight;
    }

    if (top > nodeTop) {
      top = nodeTop;
    }

    if (bottom < nodeBottom) {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);

  return boundingRect;
};

LGraph.prototype.getInclusionTreeDepth = function () {
  if (this == this.graphManager.getRoot()) {
    return 1;
  } else {
    return this.parent.getInclusionTreeDepth();
  }
};

LGraph.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LGraph.prototype.calcEstimatedSize = function () {
  var size = 0;
  var nodes = this.nodes;
  var s = nodes.length;

  for (var i = 0; i < s; i++) {
    var lNode = nodes[i];
    size += lNode.calcEstimatedSize();
  }

  if (size == 0) {
    this.estimatedSize = LayoutConstants.EMPTY_COMPOUND_NODE_SIZE;
  } else {
    this.estimatedSize = size / Math.sqrt(this.nodes.length);
  }

  return this.estimatedSize;
};

LGraph.prototype.updateConnected = function () {
  var self = this;
  if (this.nodes.length == 0) {
    this.isConnected = true;
    return;
  }

  var toBeVisited = new List();
  var visited = new HashSet();
  var currentNode = this.nodes[0];
  var neighborEdges;
  var currentNeighbor;
  var childrenOfNode = currentNode.withChildren();
  childrenOfNode.forEach(function (node) {
    toBeVisited.push(node);
  });

  while (!toBeVisited.isEmpty()) {
    currentNode = toBeVisited.shift().value();
    visited.add(currentNode);

    // Traverse all neighbors of this node
    neighborEdges = currentNode.getEdges();
    var s = neighborEdges.length;
    for (var i = 0; i < s; i++) {
      var neighborEdge = neighborEdges[i];
      currentNeighbor = neighborEdge.getOtherEndInGraph(currentNode, this);

      // Add unvisited neighbors to the list to visit
      if (currentNeighbor != null && !visited.contains(currentNeighbor)) {
        var childrenOfNeighbor = currentNeighbor.withChildren();

        childrenOfNeighbor.forEach(function (node) {
          toBeVisited.push(node);
        });
      }
    }
  }

  this.isConnected = false;

  if (visited.size() >= this.nodes.length) {
    var noOfVisitedInThisGraph = 0;

    var s = visited.size();
    Object.keys(visited.set).forEach(function (visitedId) {
      var visitedNode = visited.set[visitedId];
      if (visitedNode.owner == self) {
        noOfVisitedInThisGraph++;
      }
    });

    if (noOfVisitedInThisGraph == this.nodes.length) {
      this.isConnected = true;
    }
  }
};

module.exports = LGraph;

},{"./HashSet":20,"./Integer":23,"./LEdge":24,"./LGraphManager":26,"./LGraphObject":27,"./LNode":28,"./Layout":29,"./LayoutConstants":30,"./Point":31,"./RectangleD":34,"linkedlist-js":1}],26:[function(require,module,exports){
'use strict';

var LGraph;
var LEdge = require('./LEdge');

function LGraphManager(layout) {
  LGraph = require('./LGraph'); // It may be better to initilize this out of this function but it gives an error (Right-hand side of 'instanceof' is not callable) now.
  this.layout = layout;

  this.graphs = [];
  this.edges = [];
}

LGraphManager.prototype.addRoot = function () {
  var ngraph = this.layout.newGraph();
  var nnode = this.layout.newNode(null);
  var root = this.add(ngraph, nnode);
  this.setRootGraph(root);
  return this.rootGraph;
};

LGraphManager.prototype.add = function (newGraph, parentNode, newEdge, sourceNode, targetNode) {
  //there are just 2 parameters are passed then it adds an LGraph else it adds an LEdge
  if (newEdge == null && sourceNode == null && targetNode == null) {
    if (newGraph == null) {
      throw "Graph is null!";
    }
    if (parentNode == null) {
      throw "Parent node is null!";
    }
    if (this.graphs.indexOf(newGraph) > -1) {
      throw "Graph already in this graph mgr!";
    }

    this.graphs.push(newGraph);

    if (newGraph.parent != null) {
      throw "Already has a parent!";
    }
    if (parentNode.child != null) {
      throw "Already has a child!";
    }

    newGraph.parent = parentNode;
    parentNode.child = newGraph;

    return newGraph;
  } else {
    //change the order of the parameters
    targetNode = newEdge;
    sourceNode = parentNode;
    newEdge = newGraph;
    var sourceGraph = sourceNode.getOwner();
    var targetGraph = targetNode.getOwner();

    if (!(sourceGraph != null && sourceGraph.getGraphManager() == this)) {
      throw "Source not in this graph mgr!";
    }
    if (!(targetGraph != null && targetGraph.getGraphManager() == this)) {
      throw "Target not in this graph mgr!";
    }

    if (sourceGraph == targetGraph) {
      newEdge.isInterGraph = false;
      return sourceGraph.add(newEdge, sourceNode, targetNode);
    } else {
      newEdge.isInterGraph = true;

      // set source and target
      newEdge.source = sourceNode;
      newEdge.target = targetNode;

      // add edge to inter-graph edge list
      if (this.edges.indexOf(newEdge) > -1) {
        throw "Edge already in inter-graph edge list!";
      }

      this.edges.push(newEdge);

      // add edge to source and target incidency lists
      if (!(newEdge.source != null && newEdge.target != null)) {
        throw "Edge source and/or target is null!";
      }

      if (!(newEdge.source.edges.indexOf(newEdge) == -1 && newEdge.target.edges.indexOf(newEdge) == -1)) {
        throw "Edge already in source and/or target incidency list!";
      }

      newEdge.source.edges.push(newEdge);
      newEdge.target.edges.push(newEdge);

      return newEdge;
    }
  }
};

LGraphManager.prototype.remove = function (lObj) {
  if (lObj instanceof LGraph) {
    var graph = lObj;
    if (graph.getGraphManager() != this) {
      throw "Graph not in this graph mgr";
    }
    if (!(graph == this.rootGraph || graph.parent != null && graph.parent.graphManager == this)) {
      throw "Invalid parent node!";
    }

    // first the edges (make a copy to do it safely)
    var edgesToBeRemoved = [];

    edgesToBeRemoved = edgesToBeRemoved.concat(graph.getEdges());

    var edge;
    var s = edgesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      edge = edgesToBeRemoved[i];
      graph.remove(edge);
    }

    // then the nodes (make a copy to do it safely)
    var nodesToBeRemoved = [];

    nodesToBeRemoved = nodesToBeRemoved.concat(graph.getNodes());

    var node;
    s = nodesToBeRemoved.length;
    for (var i = 0; i < s; i++) {
      node = nodesToBeRemoved[i];
      graph.remove(node);
    }

    // check if graph is the root
    if (graph == this.rootGraph) {
      this.setRootGraph(null);
    }

    // now remove the graph itself
    var index = this.graphs.indexOf(graph);
    this.graphs.splice(index, 1);

    // also reset the parent of the graph
    graph.parent = null;
  } else if (lObj instanceof LEdge) {
    edge = lObj;
    if (edge == null) {
      throw "Edge is null!";
    }
    if (!edge.isInterGraph) {
      throw "Not an inter-graph edge!";
    }
    if (!(edge.source != null && edge.target != null)) {
      throw "Source and/or target is null!";
    }

    // remove edge from source and target nodes' incidency lists

    if (!(edge.source.edges.indexOf(edge) != -1 && edge.target.edges.indexOf(edge) != -1)) {
      throw "Source and/or target doesn't know this edge!";
    }

    var index = edge.source.edges.indexOf(edge);
    edge.source.edges.splice(index, 1);
    index = edge.target.edges.indexOf(edge);
    edge.target.edges.splice(index, 1);

    // remove edge from owner graph manager's inter-graph edge list

    if (!(edge.source.owner != null && edge.source.owner.getGraphManager() != null)) {
      throw "Edge owner graph or owner graph manager is null!";
    }
    if (edge.source.owner.getGraphManager().edges.indexOf(edge) == -1) {
      throw "Not in owner graph manager's edge list!";
    }

    var index = edge.source.owner.getGraphManager().edges.indexOf(edge);
    edge.source.owner.getGraphManager().edges.splice(index, 1);
  }
};

LGraphManager.prototype.updateBounds = function () {
  this.rootGraph.updateBounds(true);
};

LGraphManager.prototype.getGraphs = function () {
  return this.graphs;
};

LGraphManager.prototype.getAllNodes = function () {
  if (this.allNodes == null) {
    var nodeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < s; i++) {
      nodeList = nodeList.concat(graphs[i].getNodes());
    }
    this.allNodes = nodeList;
  }
  return this.allNodes;
};

LGraphManager.prototype.resetAllNodes = function () {
  this.allNodes = null;
};

LGraphManager.prototype.resetAllEdges = function () {
  this.allEdges = null;
};

LGraphManager.prototype.resetAllNodesToApplyGravitation = function () {
  this.allNodesToApplyGravitation = null;
};

LGraphManager.prototype.getAllEdges = function () {
  if (this.allEdges == null) {
    var edgeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < graphs.length; i++) {
      edgeList = edgeList.concat(graphs[i].getEdges());
    }

    edgeList = edgeList.concat(this.edges);

    this.allEdges = edgeList;
  }
  return this.allEdges;
};

LGraphManager.prototype.getAllNodesToApplyGravitation = function () {
  return this.allNodesToApplyGravitation;
};

LGraphManager.prototype.setAllNodesToApplyGravitation = function (nodeList) {
  if (this.allNodesToApplyGravitation != null) {
    throw "assert failed";
  }

  this.allNodesToApplyGravitation = nodeList;
};

LGraphManager.prototype.getRoot = function () {
  return this.rootGraph;
};

LGraphManager.prototype.setRootGraph = function (graph) {
  if (graph.getGraphManager() != this) {
    throw "Root not in this graph mgr!";
  }

  this.rootGraph = graph;
  // root graph must have a root node associated with it for convenience
  if (graph.parent == null) {
    graph.parent = this.layout.newNode("Root node");
  }
};

LGraphManager.prototype.getLayout = function () {
  return this.layout;
};

LGraphManager.prototype.isOneAncestorOfOther = function (firstNode, secondNode) {
  if (!(firstNode != null && secondNode != null)) {
    throw "assert failed";
  }

  if (firstNode == secondNode) {
    return true;
  }
  // Is second node an ancestor of the first one?
  var ownerGraph = firstNode.getOwner();
  var parentNode;

  do {
    parentNode = ownerGraph.getParent();

    if (parentNode == null) {
      break;
    }

    if (parentNode == secondNode) {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null) {
      break;
    }
  } while (true);
  // Is first node an ancestor of the second one?
  ownerGraph = secondNode.getOwner();

  do {
    parentNode = ownerGraph.getParent();

    if (parentNode == null) {
      break;
    }

    if (parentNode == firstNode) {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null) {
      break;
    }
  } while (true);

  return false;
};

LGraphManager.prototype.calcLowestCommonAncestors = function () {
  var edge;
  var sourceNode;
  var targetNode;
  var sourceAncestorGraph;
  var targetAncestorGraph;

  var edges = this.getAllEdges();
  var s = edges.length;
  for (var i = 0; i < s; i++) {
    edge = edges[i];

    sourceNode = edge.source;
    targetNode = edge.target;
    edge.lca = null;
    edge.sourceInLca = sourceNode;
    edge.targetInLca = targetNode;

    if (sourceNode == targetNode) {
      edge.lca = sourceNode.getOwner();
      continue;
    }

    sourceAncestorGraph = sourceNode.getOwner();

    while (edge.lca == null) {
      edge.targetInLca = targetNode;
      targetAncestorGraph = targetNode.getOwner();

      while (edge.lca == null) {
        if (targetAncestorGraph == sourceAncestorGraph) {
          edge.lca = targetAncestorGraph;
          break;
        }

        if (targetAncestorGraph == this.rootGraph) {
          break;
        }

        if (edge.lca != null) {
          throw "assert failed";
        }
        edge.targetInLca = targetAncestorGraph.getParent();
        targetAncestorGraph = edge.targetInLca.getOwner();
      }

      if (sourceAncestorGraph == this.rootGraph) {
        break;
      }

      if (edge.lca == null) {
        edge.sourceInLca = sourceAncestorGraph.getParent();
        sourceAncestorGraph = edge.sourceInLca.getOwner();
      }
    }

    if (edge.lca == null) {
      throw "assert failed";
    }
  }
};

LGraphManager.prototype.calcLowestCommonAncestor = function (firstNode, secondNode) {
  if (firstNode == secondNode) {
    return firstNode.getOwner();
  }
  var firstOwnerGraph = firstNode.getOwner();

  do {
    if (firstOwnerGraph == null) {
      break;
    }
    var secondOwnerGraph = secondNode.getOwner();

    do {
      if (secondOwnerGraph == null) {
        break;
      }

      if (secondOwnerGraph == firstOwnerGraph) {
        return secondOwnerGraph;
      }
      secondOwnerGraph = secondOwnerGraph.getParent().getOwner();
    } while (true);

    firstOwnerGraph = firstOwnerGraph.getParent().getOwner();
  } while (true);

  return firstOwnerGraph;
};

LGraphManager.prototype.calcInclusionTreeDepths = function (graph, depth) {
  if (graph == null && depth == null) {
    graph = this.rootGraph;
    depth = 1;
  }
  var node;

  var nodes = graph.getNodes();
  var s = nodes.length;
  for (var i = 0; i < s; i++) {
    node = nodes[i];
    node.inclusionTreeDepth = depth;

    if (node.child != null) {
      this.calcInclusionTreeDepths(node.child, depth + 1);
    }
  }
};

LGraphManager.prototype.includesInvalidEdge = function () {
  var edge;

  var s = this.edges.length;
  for (var i = 0; i < s; i++) {
    edge = this.edges[i];

    if (this.isOneAncestorOfOther(edge.source, edge.target)) {
      return true;
    }
  }
  return false;
};

module.exports = LGraphManager;

},{"./LEdge":24,"./LGraph":25}],27:[function(require,module,exports){
"use strict";

function LGraphObject(vGraphObject) {
  this.vGraphObject = vGraphObject;
}

module.exports = LGraphObject;

},{}],28:[function(require,module,exports){
'use strict';

var LGraphObject = require('./LGraphObject');
var Integer = require('./Integer');
var RectangleD = require('./RectangleD');
var LayoutConstants = require('./LayoutConstants');
var RandomSeed = require('./RandomSeed');
var PointD = require('./PointD');
var HashSet = require('./HashSet');
var Layout;

function LNode(gm, loc, size, vNode) {
  Layout = require('./Layout');
  //Alternative constructor 1 : LNode(LGraphManager gm, Point loc, Dimension size, Object vNode)
  if (size == null && vNode == null) {
    vNode = loc;
  }

  LGraphObject.call(this, vNode);

  //Alternative constructor 2 : LNode(Layout layout, Object vNode)
  if (gm instanceof Layout && gm.graphManager != null) gm = gm.graphManager;

  this.estimatedSize = Integer.MIN_VALUE;
  this.inclusionTreeDepth = Integer.MAX_VALUE;
  this.vGraphObject = vNode;
  this.edges = [];
  this.graphManager = gm;

  if (size != null && loc != null) this.rect = new RectangleD(loc.x, loc.y, size.width, size.height);else this.rect = new RectangleD();
}

LNode.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LNode[prop] = LGraphObject[prop];
}

LNode.prototype.getEdges = function () {
  return this.edges;
};

LNode.prototype.getChild = function () {
  return this.child;
};

LNode.prototype.getOwner = function () {
  //  if (this.owner != null) {
  //    if (!(this.owner == null || this.owner.getNodes().indexOf(this) > -1)) {
  //      throw "assert failed";
  //    }
  //  }

  return this.owner;
};

LNode.prototype.getWidth = function () {
  return this.rect.width;
};

LNode.prototype.setWidth = function (width) {
  this.rect.width = width;
};

LNode.prototype.getHeight = function () {
  return this.rect.height;
};

LNode.prototype.setHeight = function (height) {
  this.rect.height = height;
};

LNode.prototype.getCenterX = function () {
  return this.rect.x + this.rect.width / 2;
};

LNode.prototype.getCenterY = function () {
  return this.rect.y + this.rect.height / 2;
};

LNode.prototype.getCenter = function () {
  return new PointD(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
};

LNode.prototype.getLocation = function () {
  return new PointD(this.rect.x, this.rect.y);
};

LNode.prototype.getRect = function () {
  return this.rect;
};

LNode.prototype.getDiagonal = function () {
  return Math.sqrt(this.rect.width * this.rect.width + this.rect.height * this.rect.height);
};

LNode.prototype.setRect = function (upperLeft, dimension) {
  this.rect.x = upperLeft.x;
  this.rect.y = upperLeft.y;
  this.rect.width = dimension.width;
  this.rect.height = dimension.height;
};

LNode.prototype.setCenter = function (cx, cy) {
  this.rect.x = cx - this.rect.width / 2;
  this.rect.y = cy - this.rect.height / 2;
};

LNode.prototype.setLocation = function (x, y) {
  this.rect.x = x;
  this.rect.y = y;
};

LNode.prototype.moveBy = function (dx, dy) {
  this.rect.x += dx;
  this.rect.y += dy;
};

LNode.prototype.getEdgeListToNode = function (to) {
  var edgeList = [];
  var edge;
  var self = this;

  self.edges.forEach(function (edge) {

    if (edge.target == to) {
      if (edge.source != self) throw "Incorrect edge source!";

      edgeList.push(edge);
    }
  });

  return edgeList;
};

LNode.prototype.getEdgesBetween = function (other) {
  var edgeList = [];
  var edge;

  var self = this;
  self.edges.forEach(function (edge) {

    if (!(edge.source == self || edge.target == self)) throw "Incorrect edge source and/or target";

    if (edge.target == other || edge.source == other) {
      edgeList.push(edge);
    }
  });

  return edgeList;
};

LNode.prototype.getNeighborsList = function () {
  var neighbors = new HashSet();
  var edge;

  var self = this;
  self.edges.forEach(function (edge) {

    if (edge.source == self) {
      neighbors.add(edge.target);
    } else {
      if (edge.target != self) {
        throw "Incorrect incidency!";
      }

      neighbors.add(edge.source);
    }
  });

  return neighbors;
};

LNode.prototype.withChildren = function () {
  var withNeighborsList = new Set();
  var childNode;
  var children;

  withNeighborsList.add(this);

  if (this.child != null) {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      childNode = nodes[i];
      children = childNode.withChildren();
      children.forEach(function (node) {
        withNeighborsList.add(node);
      });
    }
  }

  return withNeighborsList;
};

LNode.prototype.getNoOfChildren = function () {
  var noOfChildren = 0;
  var childNode;

  if (this.child == null) {
    noOfChildren = 1;
  } else {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      childNode = nodes[i];

      noOfChildren += childNode.getNoOfChildren();
    }
  }

  if (noOfChildren == 0) {
    noOfChildren = 1;
  }
  return noOfChildren;
};

LNode.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LNode.prototype.calcEstimatedSize = function () {
  if (this.child == null) {
    return this.estimatedSize = (this.rect.width + this.rect.height) / 2;
  } else {
    this.estimatedSize = this.child.calcEstimatedSize();
    this.rect.width = this.estimatedSize;
    this.rect.height = this.estimatedSize;

    return this.estimatedSize;
  }
};

LNode.prototype.scatter = function () {
  var randomCenterX;
  var randomCenterY;

  var minX = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxX = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterX = LayoutConstants.WORLD_CENTER_X + RandomSeed.nextDouble() * (maxX - minX) + minX;

  var minY = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxY = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterY = LayoutConstants.WORLD_CENTER_Y + RandomSeed.nextDouble() * (maxY - minY) + minY;

  this.rect.x = randomCenterX;
  this.rect.y = randomCenterY;
};

LNode.prototype.updateBounds = function () {
  if (this.getChild() == null) {
    throw "assert failed";
  }
  if (this.getChild().getNodes().length != 0) {
    // wrap the children nodes by re-arranging the boundaries
    var childGraph = this.getChild();
    childGraph.updateBounds(true);

    this.rect.x = childGraph.getLeft();
    this.rect.y = childGraph.getTop();

    this.setWidth(childGraph.getRight() - childGraph.getLeft());
    this.setHeight(childGraph.getBottom() - childGraph.getTop());

    // Update compound bounds considering its label properties    
    if (LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS) {

      var width = childGraph.getRight() - childGraph.getLeft();
      var height = childGraph.getBottom() - childGraph.getTop();

      if (this.labelWidth > width) {
        this.rect.x -= (this.labelWidth - width) / 2;
        this.setWidth(this.labelWidth);
      }

      if (this.labelHeight > height) {
        if (this.labelPos == "center") {
          this.rect.y -= (this.labelHeight - height) / 2;
        } else if (this.labelPos == "top") {
          this.rect.y -= this.labelHeight - height;
        }
        this.setHeight(this.labelHeight);
      }
    }
  }
};

LNode.prototype.getInclusionTreeDepth = function () {
  if (this.inclusionTreeDepth == Integer.MAX_VALUE) {
    throw "assert failed";
  }
  return this.inclusionTreeDepth;
};

LNode.prototype.transform = function (trans) {
  var left = this.rect.x;

  if (left > LayoutConstants.WORLD_BOUNDARY) {
    left = LayoutConstants.WORLD_BOUNDARY;
  } else if (left < -LayoutConstants.WORLD_BOUNDARY) {
    left = -LayoutConstants.WORLD_BOUNDARY;
  }

  var top = this.rect.y;

  if (top > LayoutConstants.WORLD_BOUNDARY) {
    top = LayoutConstants.WORLD_BOUNDARY;
  } else if (top < -LayoutConstants.WORLD_BOUNDARY) {
    top = -LayoutConstants.WORLD_BOUNDARY;
  }

  var leftTop = new PointD(left, top);
  var vLeftTop = trans.inverseTransformPoint(leftTop);

  this.setLocation(vLeftTop.x, vLeftTop.y);
};

LNode.prototype.getLeft = function () {
  return this.rect.x;
};

LNode.prototype.getRight = function () {
  return this.rect.x + this.rect.width;
};

LNode.prototype.getTop = function () {
  return this.rect.y;
};

LNode.prototype.getBottom = function () {
  return this.rect.y + this.rect.height;
};

LNode.prototype.getParent = function () {
  if (this.owner == null) {
    return null;
  }

  return this.owner.getParent();
};

module.exports = LNode;

},{"./HashSet":20,"./Integer":23,"./LGraphObject":27,"./Layout":29,"./LayoutConstants":30,"./PointD":32,"./RandomSeed":33,"./RectangleD":34}],29:[function(require,module,exports){
'use strict';

var LayoutConstants = require('./LayoutConstants');
var HashMap = require('./HashMap');
var LGraphManager = require('./LGraphManager');
var LNode = require('./LNode');
var LEdge = require('./LEdge');
var LGraph = require('./LGraph');
var PointD = require('./PointD');
var Transform = require('./Transform');
var Emitter = require('./Emitter');
var HashSet = require('./HashSet');

function Layout(isRemoteUse) {
  Emitter.call(this);

  //Layout Quality: 0:proof, 1:default, 2:draft
  this.layoutQuality = LayoutConstants.DEFAULT_QUALITY;
  //Whether layout should create bendpoints as needed or not
  this.createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
  //Whether layout should be incremental or not
  this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
  //Whether we animate from before to after layout node positions
  this.animationOnLayout = LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
  //Whether we animate the layout process or not
  this.animationDuringLayout = LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT;
  //Number iterations that should be done between two successive animations
  this.animationPeriod = LayoutConstants.DEFAULT_ANIMATION_PERIOD;
  /**
   * Whether or not leaf nodes (non-compound nodes) are of uniform sizes. When
   * they are, both spring and repulsion forces between two leaf nodes can be
   * calculated without the expensive clipping point calculations, resulting
   * in major speed-up.
   */
  this.uniformLeafNodeSizes = LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
  /**
   * This is used for creation of bendpoints by using dummy nodes and edges.
   * Maps an LEdge to its dummy bendpoint path.
   */
  this.edgeToDummyNodes = new HashMap();
  this.graphManager = new LGraphManager(this);
  this.isLayoutFinished = false;
  this.isSubLayout = false;
  this.isRemoteUse = false;

  if (isRemoteUse != null) {
    this.isRemoteUse = isRemoteUse;
  }
}

Layout.RANDOM_SEED = 1;

Layout.prototype = Object.create(Emitter.prototype);

Layout.prototype.getGraphManager = function () {
  return this.graphManager;
};

Layout.prototype.getAllNodes = function () {
  return this.graphManager.getAllNodes();
};

Layout.prototype.getAllEdges = function () {
  return this.graphManager.getAllEdges();
};

Layout.prototype.getAllNodesToApplyGravitation = function () {
  return this.graphManager.getAllNodesToApplyGravitation();
};

Layout.prototype.newGraphManager = function () {
  var gm = new LGraphManager(this);
  this.graphManager = gm;
  return gm;
};

Layout.prototype.newGraph = function (vGraph) {
  return new LGraph(null, this.graphManager, vGraph);
};

Layout.prototype.newNode = function (vNode) {
  return new LNode(this.graphManager, vNode);
};

Layout.prototype.newEdge = function (vEdge) {
  return new LEdge(null, null, vEdge);
};

Layout.prototype.checkLayoutSuccess = function () {
  return this.graphManager.getRoot() == null || this.graphManager.getRoot().getNodes().length == 0 || this.graphManager.includesInvalidEdge();
};

Layout.prototype.runLayout = function () {
  this.isLayoutFinished = false;

  if (this.tilingPreLayout) {
    this.tilingPreLayout();
  }

  this.initParameters();
  var isLayoutSuccessfull;

  if (this.checkLayoutSuccess()) {
    isLayoutSuccessfull = false;
  } else {
    isLayoutSuccessfull = this.layout();
  }

  if (LayoutConstants.ANIMATE === 'during') {
    // If this is a 'during' layout animation. Layout is not finished yet. 
    // We need to perform these in index.js when layout is really finished.
    return false;
  }

  if (isLayoutSuccessfull) {
    if (!this.isSubLayout) {
      this.doPostLayout();
    }
  }

  if (this.tilingPostLayout) {
    this.tilingPostLayout();
  }

  this.isLayoutFinished = true;

  return isLayoutSuccessfull;
};

/**
 * This method performs the operations required after layout.
 */
Layout.prototype.doPostLayout = function () {
  //assert !isSubLayout : "Should not be called on sub-layout!";
  // Propagate geometric changes to v-level objects
  if (!this.incremental) {
    this.transform();
  }
  this.update();
};

/**
 * This method updates the geometry of the target graph according to
 * calculated layout.
 */
Layout.prototype.update2 = function () {
  // update bend points
  if (this.createBendsAsNeeded) {
    this.createBendpointsFromDummyNodes();

    // reset all edges, since the topology has changed
    this.graphManager.resetAllEdges();
  }

  // perform edge, node and root updates if layout is not called
  // remotely
  if (!this.isRemoteUse) {
    // update all edges
    var edge;
    var allEdges = this.graphManager.getAllEdges();
    for (var i = 0; i < allEdges.length; i++) {
      edge = allEdges[i];
      //      this.update(edge);
    }

    // recursively update nodes
    var node;
    var nodes = this.graphManager.getRoot().getNodes();
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      //      this.update(node);
    }

    // update root graph
    this.update(this.graphManager.getRoot());
  }
};

Layout.prototype.update = function (obj) {
  if (obj == null) {
    this.update2();
  } else if (obj instanceof LNode) {
    var node = obj;
    if (node.getChild() != null) {
      // since node is compound, recursively update child nodes
      var nodes = node.getChild().getNodes();
      for (var i = 0; i < nodes.length; i++) {
        update(nodes[i]);
      }
    }

    // if the l-level node is associated with a v-level graph object,
    // then it is assumed that the v-level node implements the
    // interface Updatable.
    if (node.vGraphObject != null) {
      // cast to Updatable without any type check
      var vNode = node.vGraphObject;

      // call the update method of the interface
      vNode.update(node);
    }
  } else if (obj instanceof LEdge) {
    var edge = obj;
    // if the l-level edge is associated with a v-level graph object,
    // then it is assumed that the v-level edge implements the
    // interface Updatable.

    if (edge.vGraphObject != null) {
      // cast to Updatable without any type check
      var vEdge = edge.vGraphObject;

      // call the update method of the interface
      vEdge.update(edge);
    }
  } else if (obj instanceof LGraph) {
    var graph = obj;
    // if the l-level graph is associated with a v-level graph object,
    // then it is assumed that the v-level object implements the
    // interface Updatable.

    if (graph.vGraphObject != null) {
      // cast to Updatable without any type check
      var vGraph = graph.vGraphObject;

      // call the update method of the interface
      vGraph.update(graph);
    }
  }
};

/**
 * This method is used to set all layout parameters to default values
 * determined at compile time.
 */
Layout.prototype.initParameters = function () {
  if (!this.isSubLayout) {
    this.layoutQuality = LayoutConstants.DEFAULT_QUALITY;
    this.animationDuringLayout = LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT;
    this.animationPeriod = LayoutConstants.DEFAULT_ANIMATION_PERIOD;
    this.animationOnLayout = LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
    this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
    this.createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
    this.uniformLeafNodeSizes = LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
  }

  if (this.animationDuringLayout) {
    this.animationOnLayout = false;
  }
};

Layout.prototype.transform = function (newLeftTop) {
  if (newLeftTop == undefined) {
    this.transform(new PointD(0, 0));
  } else {
    // create a transformation object (from Eclipse to layout). When an
    // inverse transform is applied, we get upper-left coordinate of the
    // drawing or the root graph at given input coordinate (some margins
    // already included in calculation of left-top).

    var trans = new Transform();
    var leftTop = this.graphManager.getRoot().updateLeftTop();

    if (leftTop != null) {
      trans.setWorldOrgX(newLeftTop.x);
      trans.setWorldOrgY(newLeftTop.y);

      trans.setDeviceOrgX(leftTop.x);
      trans.setDeviceOrgY(leftTop.y);

      var nodes = this.getAllNodes();
      var node;

      for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        node.transform(trans);
      }
    }
  }
};

Layout.prototype.positionNodesRandomly = function (graph) {

  if (graph == undefined) {
    //assert !this.incremental;
    this.positionNodesRandomly(this.getGraphManager().getRoot());
    this.getGraphManager().getRoot().updateBounds(true);
  } else {
    var lNode;
    var childGraph;

    var nodes = graph.getNodes();
    for (var i = 0; i < nodes.length; i++) {
      lNode = nodes[i];
      childGraph = lNode.getChild();

      if (childGraph == null) {
        lNode.scatter();
      } else if (childGraph.getNodes().length == 0) {
        lNode.scatter();
      } else {
        this.positionNodesRandomly(childGraph);
        lNode.updateBounds();
      }
    }
  }
};

/**
 * This method returns a list of trees where each tree is represented as a
 * list of l-nodes. The method returns a list of size 0 when:
 * - The graph is not flat or
 * - One of the component(s) of the graph is not a tree.
 */
Layout.prototype.getFlatForest = function () {
  var flatForest = [];
  var isForest = true;

  // Quick reference for all nodes in the graph manager associated with
  // this layout. The list should not be changed.
  var allNodes = this.graphManager.getRoot().getNodes();

  // First be sure that the graph is flat
  var isFlat = true;

  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].getChild() != null) {
      isFlat = false;
    }
  }

  // Return empty forest if the graph is not flat.
  if (!isFlat) {
    return flatForest;
  }

  // Run BFS for each component of the graph.

  var visited = new HashSet();
  var toBeVisited = [];
  var parents = new HashMap();
  var unProcessedNodes = [];

  unProcessedNodes = unProcessedNodes.concat(allNodes);

  // Each iteration of this loop finds a component of the graph and
  // decides whether it is a tree or not. If it is a tree, adds it to the
  // forest and continued with the next component.

  while (unProcessedNodes.length > 0 && isForest) {
    toBeVisited.push(unProcessedNodes[0]);

    // Start the BFS. Each iteration of this loop visits a node in a
    // BFS manner.
    while (toBeVisited.length > 0 && isForest) {
      //pool operation
      var currentNode = toBeVisited[0];
      toBeVisited.splice(0, 1);
      visited.add(currentNode);

      // Traverse all neighbors of this node
      var neighborEdges = currentNode.getEdges();

      for (var i = 0; i < neighborEdges.length; i++) {
        var currentNeighbor = neighborEdges[i].getOtherEnd(currentNode);

        // If BFS is not growing from this neighbor.
        if (parents.get(currentNode) != currentNeighbor) {
          // We haven't previously visited this neighbor.
          if (!visited.contains(currentNeighbor)) {
            toBeVisited.push(currentNeighbor);
            parents.put(currentNeighbor, currentNode);
          }
          // Since we have previously visited this neighbor and
          // this neighbor is not parent of currentNode, given
          // graph contains a component that is not tree, hence
          // it is not a forest.
          else {
              isForest = false;
              break;
            }
        }
      }
    }

    // The graph contains a component that is not a tree. Empty
    // previously found trees. The method will end.
    if (!isForest) {
      flatForest = [];
    }
    // Save currently visited nodes as a tree in our forest. Reset
    // visited and parents lists. Continue with the next component of
    // the graph, if any.
    else {
        var temp = [];
        visited.addAllTo(temp);
        flatForest.push(temp);
        //flatForest = flatForest.concat(temp);
        //unProcessedNodes.removeAll(visited);
        for (var i = 0; i < temp.length; i++) {
          var value = temp[i];
          var index = unProcessedNodes.indexOf(value);
          if (index > -1) {
            unProcessedNodes.splice(index, 1);
          }
        }
        visited = new HashSet();
        parents = new HashMap();
      }
  }

  return flatForest;
};

/**
 * This method creates dummy nodes (an l-level node with minimal dimensions)
 * for the given edge (one per bendpoint). The existing l-level structure
 * is updated accordingly.
 */
Layout.prototype.createDummyNodesForBendpoints = function (edge) {
  var dummyNodes = [];
  var prev = edge.source;

  var graph = this.graphManager.calcLowestCommonAncestor(edge.source, edge.target);

  for (var i = 0; i < edge.bendpoints.length; i++) {
    // create new dummy node
    var dummyNode = this.newNode(null);
    dummyNode.setRect(new Point(0, 0), new Dimension(1, 1));

    graph.add(dummyNode);

    // create new dummy edge between prev and dummy node
    var dummyEdge = this.newEdge(null);
    this.graphManager.add(dummyEdge, prev, dummyNode);

    dummyNodes.add(dummyNode);
    prev = dummyNode;
  }

  var dummyEdge = this.newEdge(null);
  this.graphManager.add(dummyEdge, prev, edge.target);

  this.edgeToDummyNodes.put(edge, dummyNodes);

  // remove real edge from graph manager if it is inter-graph
  if (edge.isInterGraph()) {
    this.graphManager.remove(edge);
  }
  // else, remove the edge from the current graph
  else {
      graph.remove(edge);
    }

  return dummyNodes;
};

/**
 * This method creates bendpoints for edges from the dummy nodes
 * at l-level.
 */
Layout.prototype.createBendpointsFromDummyNodes = function () {
  var edges = [];
  edges = edges.concat(this.graphManager.getAllEdges());
  edges = this.edgeToDummyNodes.keySet().concat(edges);

  for (var k = 0; k < edges.length; k++) {
    var lEdge = edges[k];

    if (lEdge.bendpoints.length > 0) {
      var path = this.edgeToDummyNodes.get(lEdge);

      for (var i = 0; i < path.length; i++) {
        var dummyNode = path[i];
        var p = new PointD(dummyNode.getCenterX(), dummyNode.getCenterY());

        // update bendpoint's location according to dummy node
        var ebp = lEdge.bendpoints.get(i);
        ebp.x = p.x;
        ebp.y = p.y;

        // remove the dummy node, dummy edges incident with this
        // dummy node is also removed (within the remove method)
        dummyNode.getOwner().remove(dummyNode);
      }

      // add the real edge to graph
      this.graphManager.add(lEdge, lEdge.source, lEdge.target);
    }
  }
};

Layout.transform = function (sliderValue, defaultValue, minDiv, maxMul) {
  if (minDiv != undefined && maxMul != undefined) {
    var value = defaultValue;

    if (sliderValue <= 50) {
      var minValue = defaultValue / minDiv;
      value -= (defaultValue - minValue) / 50 * (50 - sliderValue);
    } else {
      var maxValue = defaultValue * maxMul;
      value += (maxValue - defaultValue) / 50 * (sliderValue - 50);
    }

    return value;
  } else {
    var a, b;

    if (sliderValue <= 50) {
      a = 9.0 * defaultValue / 500.0;
      b = defaultValue / 10.0;
    } else {
      a = 9.0 * defaultValue / 50.0;
      b = -8 * defaultValue;
    }

    return a * sliderValue + b;
  }
};

/**
 * This method finds and returns the center of the given nodes, assuming
 * that the given nodes form a tree in themselves.
 */
Layout.findCenterOfTree = function (nodes) {
  var list = [];
  list = list.concat(nodes);

  var removedNodes = [];
  var remainingDegrees = new HashMap();
  var foundCenter = false;
  var centerNode = null;

  if (list.length == 1 || list.length == 2) {
    foundCenter = true;
    centerNode = list[0];
  }

  for (var i = 0; i < list.length; i++) {
    var node = list[i];
    var degree = node.getNeighborsList().size();
    remainingDegrees.put(node, node.getNeighborsList().size());

    if (degree == 1) {
      removedNodes.push(node);
    }
  }

  var tempList = [];
  tempList = tempList.concat(removedNodes);

  while (!foundCenter) {
    var tempList2 = [];
    tempList2 = tempList2.concat(tempList);
    tempList = [];

    for (var i = 0; i < list.length; i++) {
      var node = list[i];

      var index = list.indexOf(node);
      if (index >= 0) {
        list.splice(index, 1);
      }

      var neighbours = node.getNeighborsList();

      Object.keys(neighbours.set).forEach(function (j) {
        var neighbour = neighbours.set[j];
        if (removedNodes.indexOf(neighbour) < 0) {
          var otherDegree = remainingDegrees.get(neighbour);
          var newDegree = otherDegree - 1;

          if (newDegree == 1) {
            tempList.push(neighbour);
          }

          remainingDegrees.put(neighbour, newDegree);
        }
      });
    }

    removedNodes = removedNodes.concat(tempList);

    if (list.length == 1 || list.length == 2) {
      foundCenter = true;
      centerNode = list[0];
    }
  }

  return centerNode;
};

/**
 * During the coarsening process, this layout may be referenced by two graph managers
 * this setter function grants access to change the currently being used graph manager
 */
Layout.prototype.setGraphManager = function (gm) {
  this.graphManager = gm;
};

module.exports = Layout;

},{"./Emitter":14,"./HashMap":19,"./HashSet":20,"./LEdge":24,"./LGraph":25,"./LGraphManager":26,"./LNode":28,"./LayoutConstants":30,"./PointD":32,"./Transform":35}],30:[function(require,module,exports){
"use strict";

function LayoutConstants() {}

/**
 * Layout Quality
 */
LayoutConstants.PROOF_QUALITY = 0;
LayoutConstants.DEFAULT_QUALITY = 1;
LayoutConstants.DRAFT_QUALITY = 2;

/**
 * Default parameters
 */
LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED = false;
//LayoutConstants.DEFAULT_INCREMENTAL = true;
LayoutConstants.DEFAULT_INCREMENTAL = false;
LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT = true;
LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT = false;
LayoutConstants.DEFAULT_ANIMATION_PERIOD = 50;
LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = false;

// -----------------------------------------------------------------------------
// Section: General other constants
// -----------------------------------------------------------------------------
/*
 * Margins of a graph to be applied on bouding rectangle of its contents. We
 * assume margins on all four sides to be uniform.
 */
LayoutConstants.DEFAULT_GRAPH_MARGIN = 15;

/*
 * Whether to consider labels in node dimensions or not
 */
LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = false;

/*
 * Default dimension of a non-compound node.
 */
LayoutConstants.SIMPLE_NODE_SIZE = 40;

/*
 * Default dimension of a non-compound node.
 */
LayoutConstants.SIMPLE_NODE_HALF_SIZE = LayoutConstants.SIMPLE_NODE_SIZE / 2;

/*
 * Empty compound node size. When a compound node is empty, its both
 * dimensions should be of this value.
 */
LayoutConstants.EMPTY_COMPOUND_NODE_SIZE = 40;

/*
 * Minimum length that an edge should take during layout
 */
LayoutConstants.MIN_EDGE_LENGTH = 1;

/*
 * World boundaries that layout operates on
 */
LayoutConstants.WORLD_BOUNDARY = 1000000;

/*
 * World boundaries that random positioning can be performed with
 */
LayoutConstants.INITIAL_WORLD_BOUNDARY = LayoutConstants.WORLD_BOUNDARY / 1000;

/*
 * Coordinates of the world center
 */
LayoutConstants.WORLD_CENTER_X = 1200;
LayoutConstants.WORLD_CENTER_Y = 900;

module.exports = LayoutConstants;

},{}],31:[function(require,module,exports){
'use strict';

/*
 *This class is the javascript implementation of the Point.java class in jdk
 */
function Point(x, y, p) {
  this.x = null;
  this.y = null;
  if (x == null && y == null && p == null) {
    this.x = 0;
    this.y = 0;
  } else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    this.x = x;
    this.y = y;
  } else if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.x = p.x;
    this.y = p.y;
  }
}

Point.prototype.getX = function () {
  return this.x;
};

Point.prototype.getY = function () {
  return this.y;
};

Point.prototype.getLocation = function () {
  return new Point(this.x, this.y);
};

Point.prototype.setLocation = function (x, y, p) {
  if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.setLocation(p.x, p.y);
  } else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    //if both parameters are integer just move (x,y) location
    if (parseInt(x) == x && parseInt(y) == y) {
      this.move(x, y);
    } else {
      this.x = Math.floor(x + 0.5);
      this.y = Math.floor(y + 0.5);
    }
  }
};

Point.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype.translate = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};

Point.prototype.equals = function (obj) {
  if (obj.constructor.name == "Point") {
    var pt = obj;
    return this.x == pt.x && this.y == pt.y;
  }
  return this == obj;
};

Point.prototype.toString = function () {
  return new Point().constructor.name + "[x=" + this.x + ",y=" + this.y + "]";
};

module.exports = Point;

},{}],32:[function(require,module,exports){
"use strict";

function PointD(x, y) {
  if (x == null && y == null) {
    this.x = 0;
    this.y = 0;
  } else {
    this.x = x;
    this.y = y;
  }
}

PointD.prototype.getX = function () {
  return this.x;
};

PointD.prototype.getY = function () {
  return this.y;
};

PointD.prototype.setX = function (x) {
  this.x = x;
};

PointD.prototype.setY = function (y) {
  this.y = y;
};

PointD.prototype.getDifference = function (pt) {
  return new DimensionD(this.x - pt.x, this.y - pt.y);
};

PointD.prototype.getCopy = function () {
  return new PointD(this.x, this.y);
};

PointD.prototype.translate = function (dim) {
  this.x += dim.width;
  this.y += dim.height;
  return this;
};

module.exports = PointD;

},{}],33:[function(require,module,exports){
"use strict";

function RandomSeed() {}
RandomSeed.seed = 1;
RandomSeed.x = 0;

RandomSeed.nextDouble = function () {
  RandomSeed.x = Math.sin(RandomSeed.seed++) * 10000;
  return RandomSeed.x - Math.floor(RandomSeed.x);
};

module.exports = RandomSeed;

},{}],34:[function(require,module,exports){
"use strict";

function RectangleD(x, y, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;

  if (x != null && y != null && width != null && height != null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

RectangleD.prototype.getX = function () {
  return this.x;
};

RectangleD.prototype.setX = function (x) {
  this.x = x;
};

RectangleD.prototype.getY = function () {
  return this.y;
};

RectangleD.prototype.setY = function (y) {
  this.y = y;
};

RectangleD.prototype.getWidth = function () {
  return this.width;
};

RectangleD.prototype.setWidth = function (width) {
  this.width = width;
};

RectangleD.prototype.getHeight = function () {
  return this.height;
};

RectangleD.prototype.setHeight = function (height) {
  this.height = height;
};

RectangleD.prototype.getRight = function () {
  return this.x + this.width;
};

RectangleD.prototype.getBottom = function () {
  return this.y + this.height;
};

RectangleD.prototype.intersects = function (a) {
  if (this.getRight() < a.x) {
    return false;
  }

  if (this.getBottom() < a.y) {
    return false;
  }

  if (a.getRight() < this.x) {
    return false;
  }

  if (a.getBottom() < this.y) {
    return false;
  }

  return true;
};

RectangleD.prototype.getCenterX = function () {
  return this.x + this.width / 2;
};

RectangleD.prototype.getMinX = function () {
  return this.getX();
};

RectangleD.prototype.getMaxX = function () {
  return this.getX() + this.width;
};

RectangleD.prototype.getCenterY = function () {
  return this.y + this.height / 2;
};

RectangleD.prototype.getMinY = function () {
  return this.getY();
};

RectangleD.prototype.getMaxY = function () {
  return this.getY() + this.height;
};

RectangleD.prototype.getWidthHalf = function () {
  return this.width / 2;
};

RectangleD.prototype.getHeightHalf = function () {
  return this.height / 2;
};

module.exports = RectangleD;

},{}],35:[function(require,module,exports){
'use strict';

var PointD = require('./PointD');

function Transform(x, y) {
  this.lworldOrgX = 0.0;
  this.lworldOrgY = 0.0;
  this.ldeviceOrgX = 0.0;
  this.ldeviceOrgY = 0.0;
  this.lworldExtX = 1.0;
  this.lworldExtY = 1.0;
  this.ldeviceExtX = 1.0;
  this.ldeviceExtY = 1.0;
}

Transform.prototype.getWorldOrgX = function () {
  return this.lworldOrgX;
};

Transform.prototype.setWorldOrgX = function (wox) {
  this.lworldOrgX = wox;
};

Transform.prototype.getWorldOrgY = function () {
  return this.lworldOrgY;
};

Transform.prototype.setWorldOrgY = function (woy) {
  this.lworldOrgY = woy;
};

Transform.prototype.getWorldExtX = function () {
  return this.lworldExtX;
};

Transform.prototype.setWorldExtX = function (wex) {
  this.lworldExtX = wex;
};

Transform.prototype.getWorldExtY = function () {
  return this.lworldExtY;
};

Transform.prototype.setWorldExtY = function (wey) {
  this.lworldExtY = wey;
};

/* Device related */

Transform.prototype.getDeviceOrgX = function () {
  return this.ldeviceOrgX;
};

Transform.prototype.setDeviceOrgX = function (dox) {
  this.ldeviceOrgX = dox;
};

Transform.prototype.getDeviceOrgY = function () {
  return this.ldeviceOrgY;
};

Transform.prototype.setDeviceOrgY = function (doy) {
  this.ldeviceOrgY = doy;
};

Transform.prototype.getDeviceExtX = function () {
  return this.ldeviceExtX;
};

Transform.prototype.setDeviceExtX = function (dex) {
  this.ldeviceExtX = dex;
};

Transform.prototype.getDeviceExtY = function () {
  return this.ldeviceExtY;
};

Transform.prototype.setDeviceExtY = function (dey) {
  this.ldeviceExtY = dey;
};

Transform.prototype.transformX = function (x) {
  var xDevice = 0.0;
  var worldExtX = this.lworldExtX;
  if (worldExtX != 0.0) {
    xDevice = this.ldeviceOrgX + (x - this.lworldOrgX) * this.ldeviceExtX / worldExtX;
  }

  return xDevice;
};

Transform.prototype.transformY = function (y) {
  var yDevice = 0.0;
  var worldExtY = this.lworldExtY;
  if (worldExtY != 0.0) {
    yDevice = this.ldeviceOrgY + (y - this.lworldOrgY) * this.ldeviceExtY / worldExtY;
  }

  return yDevice;
};

Transform.prototype.inverseTransformX = function (x) {
  var xWorld = 0.0;
  var deviceExtX = this.ldeviceExtX;
  if (deviceExtX != 0.0) {
    xWorld = this.lworldOrgX + (x - this.ldeviceOrgX) * this.lworldExtX / deviceExtX;
  }

  return xWorld;
};

Transform.prototype.inverseTransformY = function (y) {
  var yWorld = 0.0;
  var deviceExtY = this.ldeviceExtY;
  if (deviceExtY != 0.0) {
    yWorld = this.lworldOrgY + (y - this.ldeviceOrgY) * this.lworldExtY / deviceExtY;
  }
  return yWorld;
};

Transform.prototype.inverseTransformPoint = function (inPoint) {
  var outPoint = new PointD(this.inverseTransformX(inPoint.x), this.inverseTransformY(inPoint.y));
  return outPoint;
};

module.exports = Transform;

},{"./PointD":32}],36:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function UniqueIDGeneretor() {}

UniqueIDGeneretor.lastID = 0;

UniqueIDGeneretor.createID = function (obj) {
  if (UniqueIDGeneretor.isPrimitive(obj)) {
    return obj;
  }
  if (obj.uniqueID != null) {
    return obj.uniqueID;
  }
  obj.uniqueID = UniqueIDGeneretor.getString();
  UniqueIDGeneretor.lastID++;
  return obj.uniqueID;
};

UniqueIDGeneretor.getString = function (id) {
  if (id == null) id = UniqueIDGeneretor.lastID;
  return "Object#" + id + "";
};

UniqueIDGeneretor.isPrimitive = function (arg) {
  var type = typeof arg === "undefined" ? "undefined" : _typeof(arg);
  return arg == null || type != "object" && type != "function";
};

module.exports = UniqueIDGeneretor;

},{}],37:[function(require,module,exports){
'use strict';

var DimensionD = require('./DimensionD');
var HashMap = require('./HashMap');
var HashSet = require('./HashSet');
var IGeometry = require('./IGeometry');
var IMath = require('./IMath');
var Integer = require('./Integer');
var Point = require('./Point');
var PointD = require('./PointD');
var RandomSeed = require('./RandomSeed');
var RectangleD = require('./RectangleD');
var Transform = require('./Transform');
var UniqueIDGeneretor = require('./UniqueIDGeneretor');
var LGraphObject = require('./LGraphObject');
var LGraph = require('./LGraph');
var LEdge = require('./LEdge');
var LGraphManager = require('./LGraphManager');
var LNode = require('./LNode');
var Layout = require('./Layout');
var LayoutConstants = require('./LayoutConstants');
var FDLayout = require('./FDLayout');
var FDLayoutConstants = require('./FDLayoutConstants');
var FDLayoutEdge = require('./FDLayoutEdge');
var FDLayoutNode = require('./FDLayoutNode');
var CoSEConstants = require('./CoSEConstants');
var CoSEEdge = require('./CoSEEdge');
var CoSEGraph = require('./CoSEGraph');
var CoSEGraphManager = require('./CoSEGraphManager');
var CoSELayout = require('./CoSELayout');
var CoSENode = require('./CoSENode');

var defaults = {
  // Called on `layoutready`
  ready: function ready() {},
  // Called on `layoutstop`
  stop: function stop() {},
  // include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 10,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 2500,
  // For enabling tiling
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: 'end',
  // Duration for animate:end
  animationDuration: 500,
  //whether to show iterations during animation
  showAnimation: false,
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5
};

function extend(defaults, options) {
  var obj = {};

  for (var i in defaults) {
    obj[i] = defaults[i];
  }

  for (var i in options) {
    obj[i] = options[i];
  }

  return obj;
};

function _CoSELayout(_options) {
  this.options = extend(defaults, _options);
  getUserOptions(this.options);
}

var getUserOptions = function getUserOptions(options) {
  if (options.nodeRepulsion != null) CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
  if (options.idealEdgeLength != null) CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
  if (options.edgeElasticity != null) CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
  if (options.nestingFactor != null) CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null) CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.numIter != null) CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.gravityRange != null) CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null) CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;

  CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !options.randomize;
  CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
  CoSEConstants.TILE = options.tile;
  CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;
};

_CoSELayout.prototype.run = function () {
  var ready;
  var frameId;
  var options = this.options;
  var idToLNode = this.idToLNode = {};
  var layout = this.layout = new CoSELayout();
  var self = this;

  self.stopped = false;

  this.cy = this.options.cy;

  this.cy.trigger({ type: 'layoutstart', layout: this });

  var gm = layout.newGraphManager();
  this.gm = gm;

  var nodes = this.options.eles.nodes();
  var edges = this.options.eles.edges();

  this.root = gm.addRoot();
  this.processChildrenList(this.root, this.getTopMostNodes(nodes), layout);

  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    var sourceNode = this.idToLNode[edge.data("source")];
    var targetNode = this.idToLNode[edge.data("target")];
    if (sourceNode.getEdgesBetween(targetNode).length == 0) {
      var e1 = gm.add(layout.newEdge(), sourceNode, targetNode);
      e1.id = edge.id();
    }
  }

  var getPositions = function getPositions(ele, i) {
    if (typeof ele === "number") {
      ele = i;
    }
    var theId = ele.data('id');
    var lNode = self.idToLNode[theId];

    return {
      x: lNode.getRect().getCenterX(),
      y: lNode.getRect().getCenterY()
    };
  };

  /*
   * Reposition nodes in iterations animatedly
   */
  var iterateAnimated = function iterateAnimated() {
    // Thigs to perform after nodes are repositioned on screen
    var afterReposition = function afterReposition() {
      if (options.fit) {
        options.cy.fit(options.eles.nodes(), options.padding);
      }

      if (!ready) {
        ready = true;
        self.cy.one('layoutready', options.ready);
        self.cy.trigger({ type: 'layoutready', layout: self });
      }
    };

    var ticksPerFrame = self.options.refresh;
    var isDone;

    for (var i = 0; i < ticksPerFrame && !isDone; i++) {
      isDone = self.stopped || self.layout.tick();
    }

    // If layout is done
    if (isDone) {
      // If the layout is not a sublayout and it is successful perform post layout.
      if (layout.checkLayoutSuccess() && !layout.isSubLayout) {
        layout.doPostLayout();
      }

      // If layout has a tilingPostLayout function property call it.
      if (layout.tilingPostLayout) {
        layout.tilingPostLayout();
      }

      layout.isLayoutFinished = true;

      self.options.eles.nodes().positions(getPositions);

      afterReposition();

      // trigger layoutstop when the layout stops (e.g. finishes)
      self.cy.one('layoutstop', self.options.stop);
      self.cy.trigger({ type: 'layoutstop', layout: self });

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      ready = false;
      return;
    }

    var animationData = self.layout.getPositionsData(); // Get positions of layout nodes note that all nodes may not be layout nodes because of tiling
    var edgeData = self.layout.getEdgesData();
    var event = new CustomEvent('send', { 'detail': [animationData, edgeData] });
    window.dispatchEvent(event);

    if (options.showAnimation) {
      // Position nodes, for the nodes whose id does not included in data (because they are removed from their parents and included in dummy compounds)
      // use position of their ancestors or dummy ancestors
      options.eles.nodes().positions(function (ele, i) {
        if (typeof ele === "number") {
          ele = i;
        }
        var theId = ele.id();
        var pNode = animationData[theId];
        var temp = ele;
        // If pNode is undefined search until finding position data of its first ancestor (It may be dummy as well)
        while (pNode == null) {
          pNode = animationData[temp.data('parent')] || animationData['DummyCompound_' + temp.data('parent')];
          animationData[theId] = pNode;
          temp = temp.parent()[0];
          if (temp == undefined) {
            break;
          }
        }
        if (pNode != null) {
          return {
            x: pNode.x,
            y: pNode.y
          };
        } else {
          return {
            x: ele.position("x"),
            y: ele.position("y")
          };
        }
      });
    }
    afterReposition();

    frameId = requestAnimationFrame(iterateAnimated);
  };

  /*
  * Listen 'layoutstarted' event and start animated iteration if animate option is 'during'
  */
  layout.addListener('layoutstarted', function () {
    if (self.options.animate === 'during') {
      frameId = requestAnimationFrame(iterateAnimated);
    }
  });

  layout.runLayout(); // Run cose layout

  /*
   * If animate option is not 'during' ('end' or false) perform these here (If it is 'during' similar things are already performed)
   */
  if (this.options.animate != "during") {
    self.options.eles.nodes().not(":parent").layoutPositions(self, self.options, getPositions); // Use layout positions to reposition the nodes it considers the options parameter
    ready = false;
  }

  return this; // chaining
};

//Get the top most ones of a list of nodes
_CoSELayout.prototype.getTopMostNodes = function (nodes) {
  var nodesMap = {};
  for (var i = 0; i < nodes.length; i++) {
    nodesMap[nodes[i].id()] = true;
  }
  var roots = nodes.filter(function (ele, i) {
    if (typeof ele === "number") {
      ele = i;
    }
    var parent = ele.parent()[0];
    while (parent != null) {
      if (nodesMap[parent.id()]) {
        return false;
      }
      parent = parent.parent()[0];
    }
    return true;
  });

  return roots;
};

_CoSELayout.prototype.processChildrenList = function (parent, children, layout) {
  var size = children.length;
  for (var i = 0; i < size; i++) {
    var theChild = children[i];
    var children_of_children = theChild.children();
    var theNode;

    //    var dimensions = theChild.layoutDimensions({
    //      nodeDimensionsIncludeLabels: this.options.nodeDimensionsIncludeLabels
    //    });

    if (theChild.outerWidth() != null && theChild.outerHeight() != null) {
      theNode = parent.add(new CoSENode(layout.graphManager, new PointD(theChild.position('x') - theChild.outerWidth() / 2, theChild.position('y') - theChild.outerHeight() / 2), new DimensionD(parseFloat(theChild.outerWidth()), parseFloat(theChild.outerHeight()))));
    } else {
      theNode = parent.add(new CoSENode(this.graphManager));
    }
    // Attach id to the layout node
    theNode.id = theChild.data("id");
    // Attach the paddings of cy node to layout node
    theNode.paddingLeft = parseInt(theChild.css('padding'));
    theNode.paddingTop = parseInt(theChild.css('padding'));
    theNode.paddingRight = parseInt(theChild.css('padding'));
    theNode.paddingBottom = parseInt(theChild.css('padding'));

    //Attach the label properties to compound if labels will be included in node dimensions  
    if (this.options.nodeDimensionsIncludeLabels) {
      if (theChild.isParent()) {
        var labelWidth = theChild.boundingBox({ includeLabels: true, includeNodes: false }).w;
        var labelHeight = theChild.boundingBox({ includeLabels: true, includeNodes: false }).h;
        var labelPos = theChild.css("text-halign");
        theNode.labelWidth = labelWidth;
        theNode.labelHeight = labelHeight;
        theNode.labelPos = labelPos;
      }
    }

    // Map the layout node
    this.idToLNode[theChild.data("id")] = theNode;

    if (isNaN(theNode.rect.x)) {
      theNode.rect.x = 0;
    }

    if (isNaN(theNode.rect.y)) {
      theNode.rect.y = 0;
    }

    if (children_of_children != null && children_of_children.length > 0) {
      var theNewGraph;
      theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
      this.processChildrenList(theNewGraph, children_of_children, layout);
    }
  }
};

/**
 * @brief : called on continuous layouts to stop them before they finish
 */
_CoSELayout.prototype.stop = function () {
  this.stopped = true;

  return this; // chaining
};

module.exports = function get(cytoscape) {
  return _CoSELayout;
};

},{"./CoSEConstants":4,"./CoSEEdge":5,"./CoSEGraph":6,"./CoSEGraphManager":7,"./CoSELayout":8,"./CoSENode":9,"./DimensionD":13,"./FDLayout":15,"./FDLayoutConstants":16,"./FDLayoutEdge":17,"./FDLayoutNode":18,"./HashMap":19,"./HashSet":20,"./IGeometry":21,"./IMath":22,"./Integer":23,"./LEdge":24,"./LGraph":25,"./LGraphManager":26,"./LGraphObject":27,"./LNode":28,"./Layout":29,"./LayoutConstants":30,"./Point":31,"./PointD":32,"./RandomSeed":33,"./RectangleD":34,"./Transform":35,"./UniqueIDGeneretor":36}],38:[function(require,module,exports){
'use strict';

// registers the extension on a cytoscape lib ref

var getLayout = require('./Layout');

var register = function register(cytoscape) {
  var Layout = getLayout(cytoscape);

  cytoscape('layout', 'cose-bilkent', Layout);
};

// auto reg for globals
if (typeof cytoscape !== 'undefined') {
  register(cytoscape);
}

module.exports = register;

},{"./Layout":37}]},{},[38])(38)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlua2VkbGlzdC1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9saW5rZWRsaXN0LWpzL3NyYy9MaXN0LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtlZGxpc3QtanMvc3JjL05vZGUuanMiLCJzcmMvTGF5b3V0L0NvU0VDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L0NvU0VFZGdlLmpzIiwic3JjL0xheW91dC9Db1NFR3JhcGguanMiLCJzcmMvTGF5b3V0L0NvU0VHcmFwaE1hbmFnZXIuanMiLCJzcmMvTGF5b3V0L0NvU0VMYXlvdXQuanMiLCJzcmMvTGF5b3V0L0NvU0VOb2RlLmpzIiwic3JjL0xheW91dC9Db2Fyc2VuaW5nRWRnZS5qcyIsInNyYy9MYXlvdXQvQ29hcnNlbmluZ0dyYXBoLmpzIiwic3JjL0xheW91dC9Db2Fyc2VuaW5nTm9kZS5qcyIsInNyYy9MYXlvdXQvRGltZW5zaW9uRC5qcyIsInNyYy9MYXlvdXQvRW1pdHRlci5qcyIsInNyYy9MYXlvdXQvRkRMYXlvdXQuanMiLCJzcmMvTGF5b3V0L0ZETGF5b3V0Q29uc3RhbnRzLmpzIiwic3JjL0xheW91dC9GRExheW91dEVkZ2UuanMiLCJzcmMvTGF5b3V0L0ZETGF5b3V0Tm9kZS5qcyIsInNyYy9MYXlvdXQvSGFzaE1hcC5qcyIsInNyYy9MYXlvdXQvSGFzaFNldC5qcyIsInNyYy9MYXlvdXQvSUdlb21ldHJ5LmpzIiwic3JjL0xheW91dC9JTWF0aC5qcyIsInNyYy9MYXlvdXQvSW50ZWdlci5qcyIsInNyYy9MYXlvdXQvTEVkZ2UuanMiLCJzcmMvTGF5b3V0L0xHcmFwaC5qcyIsInNyYy9MYXlvdXQvTEdyYXBoTWFuYWdlci5qcyIsInNyYy9MYXlvdXQvTEdyYXBoT2JqZWN0LmpzIiwic3JjL0xheW91dC9MTm9kZS5qcyIsInNyYy9MYXlvdXQvTGF5b3V0LmpzIiwic3JjL0xheW91dC9MYXlvdXRDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L1BvaW50LmpzIiwic3JjL0xheW91dC9Qb2ludEQuanMiLCJzcmMvTGF5b3V0L1JhbmRvbVNlZWQuanMiLCJzcmMvTGF5b3V0L1JlY3RhbmdsZUQuanMiLCJzcmMvTGF5b3V0L1RyYW5zZm9ybS5qcyIsInNyYy9MYXlvdXQvVW5pcXVlSURHZW5lcmV0b3IuanMiLCJzcmMvTGF5b3V0L2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LENBQWEsQ0FBbkIsQ0FBSixFQUEyQjtBQUN6QixjQUFRLElBQVIsQ0FBYSxDQUFiLEdBQWlCLENBQWpCO0FBQ0Q7O0FBRUQsUUFBSSx3QkFBd0IsSUFBeEIsSUFBZ0MscUJBQXFCLE1BQXJCLEdBQThCLENBQWxFLEVBQXFFO0FBQ25FLFVBQUksV0FBSjtBQUNBLG9CQUFjLE9BQU8sZUFBUCxHQUF5QixHQUF6QixDQUE2QixPQUFPLFFBQVAsRUFBN0IsRUFBZ0QsT0FBaEQsQ0FBZDtBQUNBLFdBQUssbUJBQUwsQ0FBeUIsV0FBekIsRUFBc0Msb0JBQXRDLEVBQTRELE1BQTVEO0FBQ0Q7QUFDRjtBQUNGLENBekREOztBQTJEQTs7O0FBR0EsWUFBWSxTQUFaLENBQXNCLElBQXRCLEdBQTZCLFlBQVk7QUFDdkMsT0FBSyxPQUFMLEdBQWUsSUFBZjs7QUFFQSxTQUFPLElBQVAsQ0FIdUMsQ0FHMUI7QUFDZCxDQUpEOztBQU1BLE9BQU8sT0FBUCxHQUFpQixTQUFTLEdBQVQsQ0FBYSxTQUFiLEVBQXdCO0FBQ3ZDLFNBQU8sV0FBUDtBQUNELENBRkQ7OztBQ3hZQTs7QUFFQTs7QUFDQSxJQUFJLFlBQVksUUFBUSxVQUFSLENBQWhCOztBQUVBLElBQUksV0FBVyxTQUFYLFFBQVcsQ0FBVSxTQUFWLEVBQXFCO0FBQ2xDLE1BQUksU0FBUyxVQUFXLFNBQVgsQ0FBYjs7QUFFQSxZQUFVLFFBQVYsRUFBb0IsY0FBcEIsRUFBb0MsTUFBcEM7QUFDRCxDQUpEOztBQU1BO0FBQ0EsSUFBSSxPQUFPLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFDcEMsV0FBVSxTQUFWO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBucyA9IHtcblx0TGlzdDogcmVxdWlyZSgnLi9zcmMvTGlzdCcpLFxuXHROb2RlOiByZXF1aXJlKCcuL3NyYy9Ob2RlJyksXG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBucztcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ZGVmaW5lKCdMaW5rZWRMaXN0SlMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5zO1xuXHR9KTtcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0d2luZG93LkxpbmtlZExpc3RKUyA9IG5zO1xufSIsInZhciBOb2RlID0gcmVxdWlyZSgnLi9Ob2RlJyk7XG5cbnZhciBMaXN0ID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLl9jb3VudCA9IDA7XG5cdHRoaXMuX2hlYWQgPSBudWxsO1xuXHR0aGlzLl90YWlsID0gbnVsbDtcbn07XG5cbkxpc3QucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9oZWFkO1xufTtcblxuTGlzdC5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX3RhaWw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX2NvdW50O1xufTtcblxuTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGluZGV4OyBpKyspIHtcblx0XHRub2RlID0gbm9kZS5uZXh0KCk7XG5cdH1cblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcblx0dmFyIG5vZGUgPSB0aGlzLmdldChpbmRleCk7XG5cdG5vZGUuc2V0KHZhbHVlKTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dmFyIG5vZGUgPSBuZXcgTm9kZSh2YWx1ZSwgdGhpcy5fdGFpbCwgbnVsbCk7XG5cblx0aWYgKHRoaXMuX3RhaWwgIT09IG51bGwpIHtcblx0XHR0aGlzLl90YWlsLnNldE5leHQobm9kZSk7XG5cdH1cblxuXHRpZiAodGhpcy5faGVhZCA9PT0gbnVsbCkge1xuXHRcdHRoaXMuX2hlYWQgPSBub2RlO1xuXHR9XG5cblx0dGhpcy5fdGFpbCA9IG5vZGU7XG5cdHRoaXMuX2NvdW50Kys7XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBub2RlID0gdGhpcy5fdGFpbDtcblxuXHR2YXIgbmV3X3RhaWwgPSBudWxsO1xuXHRpZiAodGhpcy5fdGFpbC5wcmV2aW91cygpICE9PSBudWxsKSB7XG5cdFx0bmV3X3RhaWwgPSB0aGlzLl90YWlsLnByZXZpb3VzKCk7XG5cdFx0bmV3X3RhaWwuc2V0TmV4dChudWxsKTtcblx0fVxuXHRcblx0dGhpcy5fdGFpbCA9IG5ld190YWlsO1xuXG5cdHRoaXMuX2NvdW50LS07XG5cblx0aWYgKHRoaXMuX2NvdW50ID09PSAwKSB7XG5cdFx0dGhpcy5faGVhZCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dmFyIG5vZGUgPSBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgdGhpcy5faGVhZCk7XG5cblx0aWYgKHRoaXMuX2hlYWQgIT09IG51bGwpIHtcblx0XHR0aGlzLl9oZWFkLnNldFByZXZpb3VzKG5vZGUpO1xuXHR9XG5cblx0aWYgKHRoaXMuX3RhaWwgPT09IG51bGwpIHtcblx0XHR0aGlzLl90YWlsID0gbm9kZTtcblx0fVxuXHRcblx0dGhpcy5faGVhZCA9IG5vZGU7XG5cblx0dGhpcy5fY291bnQrKztcblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cblx0dmFyIG5ld19oZWFkID0gbnVsbDtcblx0aWYgKHRoaXMuX2hlYWQubmV4dCgpICE9PSBudWxsKSB7XG5cdFx0bmV3X2hlYWQgPSB0aGlzLl9oZWFkLm5leHQoKTtcblx0XHRuZXdfaGVhZC5zZXRQcmV2aW91cyhudWxsKTtcblx0fVxuXG5cdHRoaXMuX2hlYWQgPSBuZXdfaGVhZDtcblxuXHR0aGlzLl9jb3VudC0tO1xuXG5cdGlmICh0aGlzLl9jb3VudCA9PT0gMCkge1xuXHRcdHRoaXMuX3RhaWwgPSBudWxsO1xuXHR9XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5hc0FycmF5ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXJyID0gW107XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHR3aGlsZSAobm9kZSkge1xuXHRcdGFyci5wdXNoKG5vZGUudmFsdWUoKSk7XG5cdFx0bm9kZSA9IG5vZGUubmV4dCgpO1xuXHR9XG5cblx0cmV0dXJuIGFycjtcbn07XG5cbkxpc3QucHJvdG90eXBlLnRydW5jYXRlVG8gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG5cdHRoaXMuX2NvdW50ID0gbGVuZ3RoO1xuXG5cdGlmIChsZW5ndGggPT09IDApIHtcblx0XHR0aGlzLl9oZWFkID0gbnVsbDtcblx0XHR0aGlzLl90YWlsID0gbnVsbDtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBub2RlID0gdGhpcy5nZXQobGVuZ3RoLTEpO1xuXHRub2RlLnNldE5leHQobnVsbCk7XG5cdHRoaXMuX3RhaWwgPSBub2RlO1xufTtcblxuTGlzdC5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMudHJ1bmNhdGVUbygwKTtcbn07XG5cbkxpc3QucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9oZWFkID09PSBudWxsO1xufTtcblxuTGlzdC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cblx0d2hpbGUgKG5vZGUgIT09IG51bGwpIHtcblx0XHRpZiAobm9kZS52YWx1ZSgpID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXG5cdFx0bm9kZSA9IG5vZGUubmV4dCgpO1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblx0dmFyIGkgPSAwO1xuXHR3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuXHRcdGNhbGxiYWNrKGksIG5vZGUpO1xuXHRcdG5vZGUgPSBub2RlLm5leHQoKTtcblx0XHRpKys7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0OyIsInZhciBOb2RlID0gZnVuY3Rpb24gKHZhbHVlLCBwcmV2aW91cywgbmV4dCkge1xuXHR0aGlzLl92YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogdmFsdWU7XG5cdFxuXHR0aGlzLl9wcmV2aW91cyA9IHByZXZpb3VzID09PSB1bmRlZmluZWQgPyBudWxsIDogcHJldmlvdXM7XG5cdHRoaXMuX25leHQgPSBuZXh0ID09PSB1bmRlZmluZWQgPyBudWxsIDogbmV4dDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fdmFsdWU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5wcmV2aW91cyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX3ByZXZpb3VzO1xufTtcblxuTm9kZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX25leHQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dGhpcy5fdmFsdWUgPSB2YWx1ZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldFByZXZpb3VzID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0dGhpcy5fcHJldmlvdXMgPSBub2RlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0TmV4dCA9IGZ1bmN0aW9uIChub2RlKSB7XG5cdHRoaXMuX25leHQgPSBub2RlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNIZWFkID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fcHJldmlvdXMgPT09IG51bGw7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc1RhaWwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9uZXh0ID09PSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlOyIsInZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcblxuZnVuY3Rpb24gQ29TRUNvbnN0YW50cygpIHtcbn1cblxuLy9Db1NFQ29uc3RhbnRzIGluaGVyaXRzIHN0YXRpYyBwcm9wcyBpbiBGRExheW91dENvbnN0YW50c1xuZm9yICh2YXIgcHJvcCBpbiBGRExheW91dENvbnN0YW50cykge1xuICBDb1NFQ29uc3RhbnRzW3Byb3BdID0gRkRMYXlvdXRDb25zdGFudHNbcHJvcF07XG59XG5cbkNvU0VDb25zdGFudHMuREVGQVVMVF9VU0VfTVVMVElfTEVWRUxfU0NBTElORyA9IHRydWU7XG5Db1NFQ29uc3RhbnRzLkRFRkFVTFRfUkFESUFMX1NFUEFSQVRJT04gPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIO1xuQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPTkVOVF9TRVBFUkFUSU9OID0gNjA7XG5Db1NFQ29uc3RhbnRzLlRJTEUgPSB0cnVlO1xuQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19WRVJUSUNBTCA9IDEwO1xuQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19IT1JJWk9OVEFMID0gMTA7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRUNvbnN0YW50cztcbiIsInZhciBGRExheW91dEVkZ2UgPSByZXF1aXJlKCcuL0ZETGF5b3V0RWRnZScpO1xuXG5mdW5jdGlvbiBDb1NFRWRnZShzb3VyY2UsIHRhcmdldCwgdkVkZ2UpIHtcbiAgRkRMYXlvdXRFZGdlLmNhbGwodGhpcywgc291cmNlLCB0YXJnZXQsIHZFZGdlKTtcbn1cblxuQ29TRUVkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGRExheW91dEVkZ2UucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXRFZGdlKSB7XG4gIENvU0VFZGdlW3Byb3BdID0gRkRMYXlvdXRFZGdlW3Byb3BdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VFZGdlXG4iLCJ2YXIgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTtcblxuZnVuY3Rpb24gQ29TRUdyYXBoKHBhcmVudCwgZ3JhcGhNZ3IsIHZHcmFwaCkge1xuICBMR3JhcGguY2FsbCh0aGlzLCBwYXJlbnQsIGdyYXBoTWdyLCB2R3JhcGgpO1xufVxuXG5Db1NFR3JhcGgucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGgucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoKSB7XG4gIENvU0VHcmFwaFtwcm9wXSA9IExHcmFwaFtwcm9wXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb1NFR3JhcGg7XG4iLCJ2YXIgTEdyYXBoTWFuYWdlciA9IHJlcXVpcmUoJy4vTEdyYXBoTWFuYWdlcicpO1xudmFyIENvYXJzZW5pbmdHcmFwaCA9IHJlcXVpcmUoJy4vQ29hcnNlbmluZ0dyYXBoJyk7XG52YXIgQ29hcnNlbmluZ05vZGUgPSByZXF1aXJlKCcuL0NvYXJzZW5pbmdOb2RlJyk7XG52YXIgQ29hcnNlbmluZ0VkZ2UgPSByZXF1aXJlKCcuL0NvYXJzZW5pbmdFZGdlJyk7XG52YXIgQ29TRUVkZ2UgPSByZXF1aXJlKCcuL0NvU0VFZGdlJyk7XG52YXIgSGFzaE1hcCA9IHJlcXVpcmUoJy4vSGFzaE1hcCcpO1xuXG5mdW5jdGlvbiBDb1NFR3JhcGhNYW5hZ2VyKGxheW91dCkge1xuICBMR3JhcGhNYW5hZ2VyLmNhbGwodGhpcywgbGF5b3V0KTtcbn1cblxuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE1hbmFnZXIucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoTWFuYWdlcikge1xuICBDb1NFR3JhcGhNYW5hZ2VyW3Byb3BdID0gTEdyYXBoTWFuYWdlcltwcm9wXTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNlY3Rpb246IENvYXJzZW5pbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIGxpc3Qgb2YgQ29TRUdyYXBoTWFuYWdlci4gXG4gKiBSZXR1cm5lZCBsaXN0IGhvbGRzIGdyYXBocyBmaW5lciB0byBjb2Fyc2VyIChNMCB0byBNaylcbiAqIEFkZGl0aW9uYWxseSwgdGhpcyBtZXRob2QgaXMgb25seSBjYWxsZWQgYnkgTTAuXG4gKi9cblxuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUuY29hcnNlbkdyYXBoID0gZnVuY3Rpb24oKSBcbntcbiAgdmFyIE1MaXN0ID0gW107XG4gIHZhciBwcmV2Tm9kZUNvdW50O1xuICB2YXIgY3Vyck5vZGVDb3VudDtcbiAgXG4gIC8vIFwidGhpc1wiIGdyYXBoIG1hbmFnZXIgaG9sZHMgdGhlIGZpbmVzdCAoaW5wdXQpIGdyYXBoXG4gIE1MaXN0LnB1c2godGhpcyk7XG4gIFxuICAvLyBjb2Fyc2VuaW5nIGdyYXBoIEcgaG9sZHMgb25seSB0aGUgbGVhZiBub2RlcyBhbmQgdGhlIGVkZ2VzIGJldHdlZW4gdGhlbSBcbiAgLy8gd2hpY2ggYXJlIGNvbnNpZGVyZWQgZm9yIGNvYXJzZW5pbmcgcHJvY2Vzc1xuICB2YXIgRyA9IG5ldyBDb2Fyc2VuaW5nR3JhcGgodGhpcy5nZXRMYXlvdXQoKSk7XG4gIFxuICAvLyBjb25zdHJ1Y3QgRzBcbiAgdGhpcy5jb252ZXJ0VG9Db2Fyc2VuaW5nR3JhcGgodGhpcy5nZXRSb290KCksIEcpO1xuICBjdXJyTm9kZUNvdW50ID0gRy5nZXROb2RlcygpLmxlbmd0aDtcbiAgXG4gIHZhciBsYXN0TSwgbmV3TTtcbiAgXG4gIC8vIGlmIHR3byBncmFwaHMgR2kgYW5kIEdpKzEgaGF2ZSB0aGUgc2FtZSBvcmRlciwgXG4gIC8vIHRoZW4gR2kgPSBHaSsxIGlzIHRoZSBjb2Fyc2VzdCBncmFwaCAoR2spLCBzbyBzdG9wIGNvYXJzZW5pbmcgcHJvY2Vzc1xuICBkbyB7XG4gICAgcHJldk5vZGVDb3VudCA9IGN1cnJOb2RlQ291bnQ7XG5cbiAgICAvLyBjb2Fyc2VuIEdpXG4gICAgRy5jb2Fyc2VuKCk7XG5cbiAgICAvLyBnZXQgY3VycmVudCBjb2Fyc2VzdCBncmFwaCBsYXN0TSA9IE1pIGFuZCBjb25zdHJ1Y3QgbmV3TSA9IE1pKzFcbiAgICBsYXN0TSA9IE1MaXN0W01MaXN0Lmxlbmd0aC0xXTtcbiAgICBuZXdNID0gdGhpcy5jb2Fyc2VuKGxhc3RNKTtcblxuICAgIE1MaXN0LnB1c2gobmV3TSk7XG4gICAgY3Vyck5vZGVDb3VudCA9IEcuZ2V0Tm9kZXMoKS5sZW5ndGg7XG5cbiAgfSB3aGlsZSAoKHByZXZOb2RlQ291bnQgIT0gY3Vyck5vZGVDb3VudCkgJiYgKGN1cnJOb2RlQ291bnQgPiAxKSk7ICBcbiAgXG4gIC8vIGNoYW5nZSBjdXJyZW50bHkgYmVpbmcgdXNlZCBncmFwaCBtYW5hZ2VyXG4gIHRoaXMuZ2V0TGF5b3V0KCkuc2V0R3JhcGhNYW5hZ2VyKHRoaXMpO1xuXG4gIE1MaXN0LnBvcCgpO1xuICByZXR1cm4gTUxpc3Q7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGNvbnZlcnRzIGdpdmVuIENvU0VHcmFwaCB0byBDb2Fyc2VuaW5nR3JhcGggRzBcbiAqIEcwIGNvbnNpc3RzIG9mIGxlYWYgbm9kZXMgb2YgQ29TRUdyYXBoIGFuZCBlZGdlcyBiZXR3ZWVuIHRoZW1cbiAqL1xuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUuY29udmVydFRvQ29hcnNlbmluZ0dyYXBoID0gZnVuY3Rpb24oY29zZUcsIEcpXG57XG4gIC8vIHdlIG5lZWQgYSBtYXBwaW5nIGJldHdlZW4gbm9kZXMgaW4gTTAgYW5kIEcwLCBmb3IgY29uc3RydWN0aW5nIHRoZSBlZGdlcyBvZiBHMFxuICB2YXIgbWFwID0gbmV3IEhhc2hNYXAoKTtcbiAgXG4gIC8vIGNvbnN0cnVjdCBub2RlcyBvZiBHMFxuICB2YXIgbm9kZXMgPSBjb3NlRy5nZXROb2RlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHYgPSBub2Rlc1tpXTtcblxuICAgIC8vIGlmIGN1cnJlbnQgbm9kZSBpcyBjb21wb3VuZCwgXG4gICAgLy8gdGhlbiBtYWtlIGEgcmVjdXJzaXZlIGNhbGwgd2l0aCBjaGlsZCBncmFwaCBvZiBjdXJyZW50IGNvbXBvdW5kIG5vZGUgXG4gICAgaWYgKHYuZ2V0Q2hpbGQoKSAhPSBudWxsKVxuICAgIHtcbiAgICAgIHRoaXMuY29udmVydFRvQ29hcnNlbmluZ0dyYXBoKHYuZ2V0Q2hpbGQoKSwgRyk7XG4gICAgfSAgIFxuICAgIGVsc2UgLy8gb3RoZXJ3aXNlIGN1cnJlbnQgbm9kZSBpcyBhIGxlYWYsIGFuZCBzaG91bGQgYmUgaW4gdGhlIEcwXG4gICAge1xuICAgICAgLy8gdiBpcyBhIGxlYWYgbm9kZSBpbiBDb1NFIGdyYXBoLCBhbmQgaXMgcmVmZXJlbmNlZCBieSB1IGluIEcwXG4gICAgICB2YXIgdSA9IG5ldyBDb2Fyc2VuaW5nTm9kZSgpO1xuICAgICAgdS5zZXRSZWZlcmVuY2Uodik7XG5cbiAgICAgIC8vIGNvbnN0cnVjdCBhIG1hcHBpbmcgYmV0d2VlbiB2IChmcm9tIENvU0UgZ3JhcGgpIGFuZCB1IChmcm9tIGNvYXJzZW5pbmcgZ3JhcGgpXG4gICAgICBtYXAucHV0KHYsIHUpO1xuXG4gICAgICBHLmFkZCggdSApO1xuICAgIH0gIFxuICB9XG4gIFxuICAvLyBjb25zdHJ1Y3QgZWRnZXMgb2YgRzBcbiAgdmFyIGVkZ2VzID0gY29zZUcuZ2V0RWRnZXMoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlID0gZWRnZXNbaV07XG4gICAgICAvLyBpZiBuZWl0aGVyIHNvdXJjZSBub3IgdGFyZ2V0IG9mIGUgaXMgYSBjb21wb3VuZCBub2RlXG4gICAgICAvLyB0aGVuLCBlIGlzIGFuIGVkZ2UgYmV0d2VlbiB0d28gbGVhZiBub2Rlc1xuICAgICAgaWYgKChlLmdldFNvdXJjZSgpLmdldENoaWxkKCkgPT0gbnVsbCkgJiYgKGUuZ2V0VGFyZ2V0KCkuZ2V0Q2hpbGQoKSA9PSBudWxsKSlcbiAgICAgIHtcbiAgICAgICAgRy5hZGQobmV3IENvYXJzZW5pbmdFZGdlKCksIG1hcC5nZXQoZS5nZXRTb3VyY2UoKSksIG1hcC5nZXQoZS5nZXRUYXJnZXQoKSkpO1xuICAgICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGdldHMgTWkgKGxhc3RNKSBhbmQgY29hcnNlbnMgdG8gTWkrMVxuICogTWkrMSBpcyByZXR1cm5lZC5cbiAqL1xuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUuY29hcnNlbiA9IGZ1bmN0aW9uKGxhc3RNKXtcblxuICAvLyBjcmVhdGUgTWkrMSBhbmQgcm9vdCBncmFwaCBvZiBpdFxuICB2YXIgbmV3TSA9IG5ldyBDb1NFR3JhcGhNYW5hZ2VyKGxhc3RNLmdldExheW91dCgpKTtcbiAgXG4gIC8vIGNoYW5nZSBjdXJyZW50bHkgYmVpbmcgdXNlZCBncmFwaCBtYW5hZ2VyXG4gIG5ld00uZ2V0TGF5b3V0KCkuc2V0R3JhcGhNYW5hZ2VyKG5ld00pO1xuICBuZXdNLmFkZFJvb3QoKTtcbiAgXG4gIG5ld00uZ2V0Um9vdCgpLnZHcmFwaE9iamVjdCA9IGxhc3RNLmdldFJvb3QoKS52R3JhcGhPYmplY3Q7XG4gIFxuICAvLyBjb25zdHJ1Y3Qgbm9kZXMgb2YgdGhlIGNvYXJzZXIgZ3JhcGggTWkrMVxuICB0aGlzLmNvYXJzZW5Ob2RlcyhsYXN0TS5nZXRSb290KCksIG5ld00uZ2V0Um9vdCgpKTtcbiAgXG4gIC8vIGNoYW5nZSBjdXJyZW50bHkgYmVpbmcgdXNlZCBncmFwaCBtYW5hZ2VyXG4gIGxhc3RNLmdldExheW91dCgpLnNldEdyYXBoTWFuYWdlcihsYXN0TSk7XG5cbiAgLy8gYWRkIGVkZ2VzIHRvIHRoZSBjb2Fyc2VyIGdyYXBoIE1pKzFcbiAgdGhpcy5hZGRFZGdlcyhsYXN0TSwgbmV3TSk7XG4gIFxuICByZXR1cm4gbmV3TTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY29hcnNlbnMgbm9kZXMgb2YgTWkgYW5kIGNyZWF0ZXMgbm9kZXMgb2YgdGhlIGNvYXJzZXIgZ3JhcGggTWkrMVxuICogZzogTWksIGNvYXJzZXJHOiBNaSsxXG4gKi9cbkNvU0VHcmFwaE1hbmFnZXIucHJvdG90eXBlLmNvYXJzZW5Ob2RlcyA9IGZ1bmN0aW9uKGcsIGNvYXJzZXJHKXtcbiAgdmFyIG5vZGVzID0gZy5nZXROb2RlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHYgPSBub2Rlc1tpXTtcbiAgICAvLyBpZiB2IGlzIGNvbXBvdW5kXG4gICAgLy8gdGhlbiwgY3JlYXRlIHRoZSBjb21wb3VuZCBub2RlIHYubmV4dCB3aXRoIGFuIGVtcHR5IGNoaWxkIGdyYXBoXG4gICAgLy8gYW5kLCBtYWtlIGEgcmVjdXJzaXZlIGNhbGwgd2l0aCB2LmNoaWxkIChNaSkgYW5kIHYubmV4dC5jaGlsZCAoTWkrMSlcbiAgICBpZiAodi5nZXRDaGlsZCgpICE9IG51bGwpXG4gICAge1xuICAgICAgdi5zZXROZXh0KGNvYXJzZXJHLmdldEdyYXBoTWFuYWdlcigpLmdldExheW91dCgpLm5ld05vZGUobnVsbCkpO1xuICAgICAgY29hcnNlckcuZ2V0R3JhcGhNYW5hZ2VyKCkuYWRkKGNvYXJzZXJHLmdldEdyYXBoTWFuYWdlcigpLmdldExheW91dCgpLm5ld0dyYXBoKG51bGwpLCB2LmdldE5leHQoKSk7XG4gICAgICB2LmdldE5leHQoKS5zZXRQcmVkMSh2KTtcbiAgICAgIGNvYXJzZXJHLmFkZCh2LmdldE5leHQoKSk7XG5cbiAgICAgIC8vdi5nZXROZXh0KCkuZ2V0Q2hpbGQoKS52R3JhcGhPYmplY3QgPSB2LmdldENoaWxkKCkudkdyYXBoT2JqZWN0O1xuXG4gICAgICB0aGlzLmNvYXJzZW5Ob2Rlcyh2LmdldENoaWxkKCksIHYuZ2V0TmV4dCgpLmdldENoaWxkKCkpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgLy8gdi5uZXh0IGNhbiBiZSByZWZlcmVuY2VkIGJ5IHR3byBub2Rlcywgc28gZmlyc3QgY2hlY2sgaWYgaXQgaXMgcHJvY2Vzc2VkIGJlZm9yZVxuICAgICAgaWYgKCF2LmdldE5leHQoKS5pc1Byb2Nlc3NlZCgpKVxuICAgICAge1xuICAgICAgICBjb2Fyc2VyRy5hZGQoIHYuZ2V0TmV4dCgpICk7XG4gICAgICAgIHYuZ2V0TmV4dCgpLnNldFByb2Nlc3NlZCh0cnVlKTtcbiAgICAgICAgLy8gc2V0IGxvY2F0aW9uXG4gICAgICAgIHYuZ2V0TmV4dCgpLnNldExvY2F0aW9uKHYuZ2V0TG9jYXRpb24oKS54LCB2LmdldExvY2F0aW9uKCkueSk7XG4gICAgICAgIHYuZ2V0TmV4dCgpLnNldEhlaWdodCh2LmdldEhlaWdodCgpKTtcbiAgICAgICAgdi5nZXROZXh0KCkuc2V0V2lkdGgodi5nZXRXaWR0aCgpKTtcbiAgICAgICAgdi5nZXROZXh0KCkuaWQgPSB2LmlkO1xuICAgICAgfVxuICAgIH1cbiAgICAvL3YuZ2V0TmV4dCgpLnZHcmFwaE9iamVjdCA9IHYudkdyYXBoT2JqZWN0O1xuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGFkZHMgZWRnZXMgdG8gdGhlIGNvYXJzZXIgZ3JhcGguXG4gKiBJdCBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIGNvYXJzZW5Ob2RlcyBtZXRob2QgaXMgZXhlY3V0ZWRcbiAqIGxhc3RNOiBNaSwgbmV3TTogTWkrMVxuICovXG5Db1NFR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5hZGRFZGdlcyA9IGZ1bmN0aW9uKGxhc3RNLCBuZXdNKXtcblxuICB2YXIgYWxsRWRnZXMgPSBsYXN0TS5nZXRBbGxFZGdlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGUgPSBhbGxFZGdlc1tpXTtcblxuICAgIC8vIGlmIGUgaXMgYW4gaW50ZXItZ3JhcGggZWRnZSBvciBzb3VyY2Ugb3IgdGFyZ2V0IG9mIGUgaXMgY29tcG91bmQgXG4gICAgLy8gdGhlbiwgZSBoYXMgbm90IGNvbnRyYWN0ZWQgZHVyaW5nIGNvYXJzZW5pbmcgcHJvY2Vzcy4gQWRkIGUgdG8gdGhlIGNvYXJzZXIgZ3JhcGguXG4gICAgaWYgKCBlLmlzSW50ZXJHcmFwaCB8fCAoZS5nZXRTb3VyY2UoKS5nZXRDaGlsZCgpICE9IG51bGwpIHx8IChlLmdldFRhcmdldCgpLmdldENoaWxkKCkgIT0gbnVsbCkgKVxuICAgIHtcbiAgICAgIC8vIGNoZWNrIGlmIGUgaXMgbm90IGFkZGVkIGJlZm9yZVxuICAgICAgaWYgKCAhIGUuZ2V0U291cmNlKCkuZ2V0TmV4dCgpLmdldE5laWdoYm9yc0xpc3QoKS5jb250YWlucygoZS5nZXRUYXJnZXQoKSkuZ2V0TmV4dCgpKSApXG4gICAgICB7XG4gICAgICAgIG5ld00uYWRkKG5ld00uZ2V0TGF5b3V0KCkubmV3RWRnZShudWxsKSwgZS5nZXRTb3VyY2UoKS5nZXROZXh0KCksIGUuZ2V0VGFyZ2V0KCkuZ2V0TmV4dCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gb3RoZXJ3aXNlLCBpZiBlIGlzIG5vdCBjb250cmFjdGVkIGR1cmluZyBjb2Fyc2VuaW5nIHByb2Nlc3NcbiAgICAvLyB0aGVuLCBhZGQgaXQgdG8gdGhlICBjb2Fyc2VyIGdyYXBoXG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGlmIChlLmdldFNvdXJjZSgpLmdldE5leHQoKSAhPSBlLmdldFRhcmdldCgpLmdldE5leHQoKSlcbiAgICAgIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgZSBpcyBub3QgYWRkZWQgYmVmb3JlXG4gICAgICAgIGlmICghZS5nZXRTb3VyY2UoKS5nZXROZXh0KCkuZ2V0TmVpZ2hib3JzTGlzdCgpLmNvbnRhaW5zKGUuZ2V0VGFyZ2V0KCkuZ2V0TmV4dCgpKSlcbiAgICAgICAge1xuICAgICAgICAgIG5ld00uYWRkKG5ld00uZ2V0TGF5b3V0KCkubmV3RWRnZShudWxsKSwgZS5nZXRTb3VyY2UoKS5nZXROZXh0KCksIGUuZ2V0VGFyZ2V0KCkuZ2V0TmV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb1NFR3JhcGhNYW5hZ2VyO1xuIiwidmFyIEZETGF5b3V0ID0gcmVxdWlyZSgnLi9GRExheW91dCcpO1xudmFyIENvU0VHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvU0VHcmFwaE1hbmFnZXInKTtcbnZhciBDb1NFR3JhcGggPSByZXF1aXJlKCcuL0NvU0VHcmFwaCcpO1xudmFyIENvU0VOb2RlID0gcmVxdWlyZSgnLi9Db1NFTm9kZScpO1xudmFyIENvU0VFZGdlID0gcmVxdWlyZSgnLi9Db1NFRWRnZScpO1xudmFyIENvU0VDb25zdGFudHMgPSByZXF1aXJlKCcuL0NvU0VDb25zdGFudHMnKTtcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9Qb2ludCcpO1xudmFyIFBvaW50RCA9IHJlcXVpcmUoJy4vUG9pbnREJyk7XG52YXIgTGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG5cbmZ1bmN0aW9uIENvU0VMYXlvdXQoKSB7XG4gIEZETGF5b3V0LmNhbGwodGhpcyk7XG4gIFxuICB0aGlzLnRvQmVUaWxlZCA9IHt9OyAvLyBNZW1vcml6ZSBpZiBhIG5vZGUgaXMgdG8gYmUgdGlsZWQgb3IgaXMgdGlsZWRcbn1cblxuQ29TRUxheW91dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZETGF5b3V0LnByb3RvdHlwZSk7XG5cbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXQpIHtcbiAgQ29TRUxheW91dFtwcm9wXSA9IEZETGF5b3V0W3Byb3BdO1xufVxuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5uZXdHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBnbSA9IG5ldyBDb1NFR3JhcGhNYW5hZ2VyKHRoaXMpO1xuICB0aGlzLmdyYXBoTWFuYWdlciA9IGdtO1xuICByZXR1cm4gZ207XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5uZXdHcmFwaCA9IGZ1bmN0aW9uICh2R3JhcGgpIHtcbiAgcmV0dXJuIG5ldyBDb1NFR3JhcGgobnVsbCwgdGhpcy5ncmFwaE1hbmFnZXIsIHZHcmFwaCk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5uZXdOb2RlID0gZnVuY3Rpb24gKHZOb2RlKSB7XG4gIHJldHVybiBuZXcgQ29TRU5vZGUodGhpcy5ncmFwaE1hbmFnZXIsIHZOb2RlKTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLm5ld0VkZ2UgPSBmdW5jdGlvbiAodkVkZ2UpIHtcbiAgcmV0dXJuIG5ldyBDb1NFRWRnZShudWxsLCBudWxsLCB2RWRnZSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgRkRMYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzLmNhbGwodGhpcywgYXJndW1lbnRzKTtcbiAgaWYgKCF0aGlzLmlzU3ViTGF5b3V0KSB7XG4gICAgaWYgKENvU0VDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA8IDEwKVxuICAgIHtcbiAgICAgIHRoaXMuaWRlYWxFZGdlTGVuZ3RoID0gMTA7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICB0aGlzLmlkZWFsRWRnZUxlbmd0aCA9IENvU0VDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSDtcbiAgICB9XG5cbiAgICB0aGlzLnVzZVNtYXJ0SWRlYWxFZGdlTGVuZ3RoQ2FsY3VsYXRpb24gPVxuICAgICAgICAgICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9JREVBTF9FREdFX0xFTkdUSF9DQUxDVUxBVElPTjtcbiAgICB0aGlzLnVzZU11bHRpTGV2ZWxTY2FsaW5nID1cbiAgICAgICAgICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9VU0VfTVVMVElfTEVWRUxfU0NBTElORztcbiAgICB0aGlzLnNwcmluZ0NvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIO1xuICAgIHRoaXMucmVwdWxzaW9uQ29uc3RhbnQgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEg7XG4gICAgdGhpcy5ncmF2aXR5Q29uc3RhbnQgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIO1xuICAgIHRoaXMuY29tcG91bmRHcmF2aXR5Q29uc3RhbnQgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1NUUkVOR1RIO1xuICAgIHRoaXMuZ3Jhdml0eVJhbmdlRmFjdG9yID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XG4gICAgdGhpcy5jb21wb3VuZEdyYXZpdHlSYW5nZUZhY3RvciA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfUkFOR0VfRkFDVE9SO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjcmVhdGVCZW5kc0FzTmVlZGVkID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRDtcbiAgaWYgKGNyZWF0ZUJlbmRzQXNOZWVkZWQpXG4gIHtcbiAgICB0aGlzLmNyZWF0ZUJlbmRwb2ludHMoKTtcbiAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbEVkZ2VzKCk7XG4gIH1cbiAgaWYodGhpcy51c2VNdWx0aUxldmVsU2NhbGluZyAmJiAhdGhpcy5pbmNyZW1lbnRhbClcbiAge1xuICAgIGNvbnNvbGUubG9nKFwiSGVsbG8gbXVsdGlsZXZlbFwiKTtcbiAgICByZXR1cm4gdGhpcy5tdWx0aUxldmVsU2NhbGluZ0xheW91dCgpO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMubGV2ZWwgPSAwO1xuICAgIHJldHVybiB0aGlzLmNsYXNzaWNMYXlvdXQoKTtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubXVsdGlMZXZlbFNjYWxpbmdMYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBnbSA9IHRoaXMuZ3JhcGhNYW5hZ2VyO1xuICBcbiAgLy8gU3RhcnQgY29hcnNlbmluZyBwcm9jZXNzXG5cbiAgLy8gc2F2ZSBncmFwaCBtYW5hZ2VycyBNMCB0byBNayBpbiBhbiBhcnJheSBsaXN0XG4gIHRoaXMuTUxpc3QgPSBnbS5jb2Fyc2VuR3JhcGgoKTtcbiAgXG4gIHRoaXMubm9PZkxldmVscyA9IHRoaXMuTUxpc3QubGVuZ3RoLTE7XG4gIHRoaXMubGV2ZWwgPSB0aGlzLm5vT2ZMZXZlbHM7XG4gIFxuICB3aGlsZSAodGhpcy5sZXZlbCA+PSAwKVxuICB7XG4gICAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbSA9IHRoaXMuTUxpc3RbdGhpcy5sZXZlbF07XG5cbiAgICBjb25zb2xlLmxvZyhcIkBcIiArIHRoaXMubGV2ZWwgKyBcInRoIGxldmVsLCB3aXRoIFwiICsgZ20uZ2V0QWxsTm9kZXMoKS5sZW5ndGggKyBcIiBub2Rlcy4gXCIpO1xuICAgIHRoaXMuY2xhc3NpY0xheW91dCgpO1xuICAgIGNvbnNvbGUubG9nKFwiTGF5b3V0IGlzIGZpbmlzaGVkIGZvciB0aGlzIGxldmVsXCIpO1xuICAgIC8vIGFmdGVyIGZpbmlzaGluZyBsYXlvdXQgb2YgZmlyc3QgKGNvYXJzZXN0KSBsZXZlbCxcbiAgICB0aGlzLmluY3JlbWVudGFsID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmxldmVsID49IDEpIFxuICAgIHtcdFxuICAgICAgdGhpcy51bmNvYXJzZW4oKTsgLy8gYWxzbyBtYWtlcyBpbml0aWFsIHBsYWNlbWVudCBmb3IgTWktMVxuICAgIH1cblxuICAgIC8vIHJlc2V0IHRvdGFsIGl0ZXJhdGlvbnNcbiAgICB0aGlzLnRvdGFsSXRlcmF0aW9ucyA9IDA7XG5cbiAgICB0aGlzLmxldmVsLS07XG4gIH1cbiAgXG4gIHRoaXMuaW5jcmVtZW50YWwgPSBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jbGFzc2ljTGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLm5vZGVzV2l0aEdyYXZpdHkgPSB0aGlzLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8oKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIuc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24odGhpcy5ub2Rlc1dpdGhHcmF2aXR5KTtcbiAgdGhpcy5jYWxjTm9PZkNoaWxkcmVuRm9yQWxsTm9kZXMoKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9ycygpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5jYWxjSW5jbHVzaW9uVHJlZURlcHRocygpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuY2FsY0VzdGltYXRlZFNpemUoKTtcbiAgdGhpcy5jYWxjSWRlYWxFZGdlTGVuZ3RocygpO1xuICBcbiAgaWYgKCF0aGlzLmluY3JlbWVudGFsKVxuICB7XG4gICAgdmFyIGZvcmVzdCA9IHRoaXMuZ2V0RmxhdEZvcmVzdCgpO1xuXG4gICAgLy8gVGhlIGdyYXBoIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGxheW91dCBpcyBmbGF0IGFuZCBhIGZvcmVzdFxuICAgIGlmIChmb3Jlc3QubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYWRpYWxseShmb3Jlc3QpO1xuICAgIH1cbiAgICAvLyBUaGUgZ3JhcGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgbGF5b3V0IGlzIG5vdCBmbGF0IG9yIGEgZm9yZXN0XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIC8vIFJlZHVjZSB0aGUgdHJlZXMgd2hlbiBpbmNyZW1lbnRhbCBtb2RlIGlzIG5vdCBlbmFibGVkIGFuZCBncmFwaCBpcyBub3QgYSBmb3Jlc3QgXG4vLyAgICAgIHRoaXMucmVkdWNlVHJlZXMoKTtcbiAgICAgIC8vIFVwZGF0ZSBub2RlcyB0aGF0IGdyYXZpdHkgd2lsbCBiZSBhcHBsaWVkXG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG4gICAgICB2YXIgYWxsTm9kZXMgPSBuZXcgU2V0KHRoaXMuZ2V0QWxsTm9kZXMoKSk7XG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gdGhpcy5ub2Rlc1dpdGhHcmF2aXR5LmZpbHRlcih4ID0+IGFsbE5vZGVzLmhhcyh4KSk7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgXG4gICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seSgpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuaW5pdFNwcmluZ0VtYmVkZGVyKCk7XG4gIHRoaXMucnVuU3ByaW5nRW1iZWRkZXIoKTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnZhciBub2Rlc0RldGFpbDtcbnZhciBlZGdlc0RldGFpbDtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRvdGFsSXRlcmF0aW9ucysrO1xuICBcbiAgaWYgKHRoaXMudG90YWxJdGVyYXRpb25zID09PSB0aGlzLm1heEl0ZXJhdGlvbnMgJiYgIXRoaXMuaXNUcmVlR3Jvd2luZyAmJiAhdGhpcy5pc0dyb3d0aEZpbmlzaGVkKSB7XG4gICAgaWYodGhpcy5wcnVuZWROb2Rlc0FsbC5sZW5ndGggPiAwKXtcbiAgICAgIHRoaXMuaXNUcmVlR3Jvd2luZyA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7ICBcbiAgICB9XG4gIH1cbiAgXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyAlIEZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9PSAwICAmJiAhdGhpcy5pc1RyZWVHcm93aW5nICYmICF0aGlzLmlzR3Jvd3RoRmluaXNoZWQpXG4gIHtcbiAgICBpZiAodGhpcy5pc0NvbnZlcmdlZCgpKVxuICAgIHtcbiAgICAgIGlmKHRoaXMucHJ1bmVkTm9kZXNBbGwubGVuZ3RoID4gMCl7XG4gICAgICAgIHRoaXMuaXNUcmVlR3Jvd2luZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7ICBcbiAgICAgIH0gXG4gICAgfVxuXG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gdGhpcy5pbml0aWFsQ29vbGluZ0ZhY3RvciAqXG4gICAgICAgICAgICAoKHRoaXMubWF4SXRlcmF0aW9ucyAtIHRoaXMudG90YWxJdGVyYXRpb25zKSAvIHRoaXMubWF4SXRlcmF0aW9ucyk7XG4gICAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBNYXRoLmNlaWwodGhpcy5pbml0aWFsQW5pbWF0aW9uUGVyaW9kICogTWF0aC5zcXJ0KHRoaXMuY29vbGluZ0ZhY3RvcikpO1xuICB9XG4gIC8vIE9wZXJhdGlvbnMgd2hpbGUgdHJlZSBpcyBncm93aW5nIGFnYWluIFxuICBpZih0aGlzLmlzVHJlZUdyb3dpbmcpe1xuICAgIGlmKHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zICUgMTAgPT0gMCl7XG4gICAgICBpZih0aGlzLnBydW5lZE5vZGVzQWxsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLmdyb3dUcmVlKHRoaXMucHJ1bmVkTm9kZXNBbGwpO1xuICAgICAgICAvLyBVcGRhdGUgbm9kZXMgdGhhdCBncmF2aXR5IHdpbGwgYmUgYXBwbGllZFxuICAgICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG4gICAgICAgIHZhciBhbGxOb2RlcyA9IG5ldyBTZXQodGhpcy5nZXRBbGxOb2RlcygpKTtcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbiA9IHRoaXMubm9kZXNXaXRoR3Jhdml0eS5maWx0ZXIoeCA9PiBhbGxOb2Rlcy5oYXMoeCkpO1xuICAgICAgICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlR3JpZCgpOyBcbiAgICAgICAgdGhpcy5jb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTDsgXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5pc1RyZWVHcm93aW5nID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5pc0dyb3d0aEZpbmlzaGVkID0gdHJ1ZTsgXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zKys7XG4gIH1cbiAgLy8gT3BlcmF0aW9ucyBhZnRlciBncm93dGggaXMgZmluaXNoZWRcbiAgaWYodGhpcy5pc0dyb3d0aEZpbmlzaGVkKXtcbiAgICBpZiAodGhpcy5pc0NvbnZlcmdlZCgpKVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlOyAgXG4gICAgfVxuICAgIGlmKHRoaXMuYWZ0ZXJHcm93dGhJdGVyYXRpb25zICUgMTAgPT0gMCl7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci51cGRhdGVCb3VuZHMoKTtcbiAgICAgIHRoaXMudXBkYXRlR3JpZCgpOyBcbiAgICB9XG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCAqICgoMTAwIC0gdGhpcy5hZnRlckdyb3d0aEl0ZXJhdGlvbnMpIC8gMTAwKTtcbiAgICB0aGlzLmFmdGVyR3Jvd3RoSXRlcmF0aW9ucysrO1xuICB9XG4gIFxuICB0aGlzLnRvdGFsRGlzcGxhY2VtZW50ID0gMDtcbiAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gIGVkZ2VzRGV0YWlsID0gdGhpcy5jYWxjU3ByaW5nRm9yY2VzKCk7XG4gIHRoaXMuY2FsY1JlcHVsc2lvbkZvcmNlcygpO1xuICB0aGlzLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2VzKCk7XG4gIG5vZGVzRGV0YWlsID0gdGhpcy5tb3ZlTm9kZXMoKTtcbiAgdGhpcy5hbmltYXRlKCk7XG4gIFxuICB2YXIgYW5pbWF0aW9uRGF0YSA9IHRoaXMuZ2V0UG9zaXRpb25zRGF0YSgpOyAvLyBHZXQgcG9zaXRpb25zIG9mIGxheW91dCBub2RlcyBub3RlIHRoYXQgYWxsIG5vZGVzIG1heSBub3QgYmUgbGF5b3V0IG5vZGVzIGJlY2F1c2Ugb2YgdGlsaW5nXG4gIHZhciBlZGdlRGF0YSA9IHRoaXMuZ2V0RWRnZXNEYXRhKCk7XG4gIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VuZCcsIHsgJ2RldGFpbCc6IFthbmltYXRpb25EYXRhLCBlZGdlRGF0YV0gfSk7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgXG4gIHJldHVybiBmYWxzZTsgLy8gTGF5b3V0IGlzIG5vdCBlbmRlZCB5ZXQgcmV0dXJuIGZhbHNlXG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRQb3NpdGlvbnNEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhbGxOb2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XG4gIHZhciBwRGF0YSA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHJlY3QgPSBhbGxOb2Rlc1tpXS5yZWN0O1xuICAgIHZhciBpZCA9IGFsbE5vZGVzW2ldLmlkO1xuICAgIHBEYXRhW2lkXSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHg6IHJlY3QuZ2V0Q2VudGVyWCgpLFxuICAgICAgeTogcmVjdC5nZXRDZW50ZXJZKCksXG4gICAgICB3OiByZWN0LndpZHRoLFxuICAgICAgaDogcmVjdC5oZWlnaHQsXG4gICAgICBzcHJpbmdGb3JjZVg6IG5vZGVzRGV0YWlsW2ldLnNwcmluZ0ZvcmNlWCxcbiAgICAgIHNwcmluZ0ZvcmNlWTogbm9kZXNEZXRhaWxbaV0uc3ByaW5nRm9yY2VZLFxuICAgICAgcmVwdWxzaW9uRm9yY2VYOiBub2Rlc0RldGFpbFtpXS5yZXB1bHNpb25Gb3JjZVgsXG4gICAgICByZXB1bHNpb25Gb3JjZVk6IG5vZGVzRGV0YWlsW2ldLnJlcHVsc2lvbkZvcmNlWSxcbiAgICAgIGdyYXZpdGF0aW9uRm9yY2VYOiBub2Rlc0RldGFpbFtpXS5ncmF2aXRhdGlvbkZvcmNlWCxcbiAgICAgIGdyYXZpdGF0aW9uRm9yY2VZOiBub2Rlc0RldGFpbFtpXS5ncmF2aXRhdGlvbkZvcmNlWSxcbiAgICAgIGRpc3BsYWNlbWVudFg6IG5vZGVzRGV0YWlsW2ldLmRpc3BsYWNlbWVudFgsXG4gICAgICBkaXNwbGFjZW1lbnRZOiBub2Rlc0RldGFpbFtpXS5kaXNwbGFjZW1lbnRZXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcERhdGE7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRFZGdlc0RhdGEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFsbEVkZ2VzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsRWRnZXMoKTtcbiAgdmFyIGVEYXRhID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBhbGxFZGdlc1tpXS5pZDtcbiAgICBlRGF0YVtpZF0gPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzb3VyY2U6IChlZGdlc0RldGFpbFtpXSAhPSBudWxsKSA/IGVkZ2VzRGV0YWlsW2ldLnNvdXJjZSA6IFwiXCIsXG4gICAgICB0YXJnZXQ6IChlZGdlc0RldGFpbFtpXSAhPSBudWxsKSA/IGVkZ2VzRGV0YWlsW2ldLnRhcmdldCA6IFwiXCIsXG4gICAgICBsZW5ndGg6IChlZGdlc0RldGFpbFtpXSAhPSBudWxsKSA/IGVkZ2VzRGV0YWlsW2ldLmxlbmd0aCA6IFwiXCIsXG4gICAgICB4TGVuZ3RoOiAoZWRnZXNEZXRhaWxbaV0gIT0gbnVsbCkgPyBlZGdlc0RldGFpbFtpXS54TGVuZ3RoIDogXCJcIixcbiAgICAgIHlMZW5ndGg6IChlZGdlc0RldGFpbFtpXSAhPSBudWxsKSA/IGVkZ2VzRGV0YWlsW2ldLnlMZW5ndGggOiBcIlwiXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZURhdGE7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5ydW5TcHJpbmdFbWJlZGRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pbml0aWFsQW5pbWF0aW9uUGVyaW9kID0gMjU7XG4gIHRoaXMuYW5pbWF0aW9uUGVyaW9kID0gdGhpcy5pbml0aWFsQW5pbWF0aW9uUGVyaW9kO1xuICB2YXIgbGF5b3V0RW5kZWQgPSBmYWxzZTtcbiAgXG4gIC8vIElmIGFtaW5hdGUgb3B0aW9uIGlzICdkdXJpbmcnIHNpZ25hbCB0aGF0IGxheW91dCBpcyBzdXBwb3NlZCB0byBzdGFydCBpdGVyYXRpbmdcbiAgaWYgKCBGRExheW91dENvbnN0YW50cy5BTklNQVRFID09PSAnZHVyaW5nJyApIHtcbiAgICB0aGlzLmVtaXQoJ2xheW91dHN0YXJ0ZWQnKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBJZiBhbWluYXRlIG9wdGlvbiBpcyAnZHVyaW5nJyB0aWNrKCkgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb24gaW5kZXguanNcbiAgICB3aGlsZSAoIWxheW91dEVuZGVkKSB7XG4gICAgICBsYXlvdXRFbmRlZCA9IHRoaXMudGljaygpO1xuICAgIH1cblxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jYWxjdWxhdGVOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvblRvID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZUxpc3QgPSBbXTtcbiAgdmFyIGdyYXBoO1xuXG4gIHZhciBncmFwaHMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRHcmFwaHMoKTtcbiAgdmFyIHNpemUgPSBncmFwaHMubGVuZ3RoO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IHNpemU7IGkrKylcbiAge1xuICAgIGdyYXBoID0gZ3JhcGhzW2ldO1xuXG4gICAgZ3JhcGgudXBkYXRlQ29ubmVjdGVkKCk7XG5cbiAgICBpZiAoIWdyYXBoLmlzQ29ubmVjdGVkKVxuICAgIHtcbiAgICAgIG5vZGVMaXN0ID0gbm9kZUxpc3QuY29uY2F0KGdyYXBoLmdldE5vZGVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub2RlTGlzdDtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGNOb09mQ2hpbGRyZW5Gb3JBbGxOb2RlcyA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBub2RlO1xuICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2RlcygpO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgICBub2RlID0gYWxsTm9kZXNbaV07XG4gICAgICBub2RlLm5vT2ZDaGlsZHJlbiA9IG5vZGUuZ2V0Tm9PZkNoaWxkcmVuKCk7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNyZWF0ZUJlbmRwb2ludHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZGdlcyA9IFtdO1xuICBlZGdlcyA9IGVkZ2VzLmNvbmNhdCh0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpKTtcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgSGFzaFNldCgpO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcblxuICAgIGlmICghdmlzaXRlZC5jb250YWlucyhlZGdlKSlcbiAgICB7XG4gICAgICB2YXIgc291cmNlID0gZWRnZS5nZXRTb3VyY2UoKTtcbiAgICAgIHZhciB0YXJnZXQgPSBlZGdlLmdldFRhcmdldCgpO1xuXG4gICAgICBpZiAoc291cmNlID09IHRhcmdldClcbiAgICAgIHtcbiAgICAgICAgZWRnZS5nZXRCZW5kcG9pbnRzKCkucHVzaChuZXcgUG9pbnREKCkpO1xuICAgICAgICBlZGdlLmdldEJlbmRwb2ludHMoKS5wdXNoKG5ldyBQb2ludEQoKSk7XG4gICAgICAgIHRoaXMuY3JlYXRlRHVtbXlOb2Rlc0ZvckJlbmRwb2ludHMoZWRnZSk7XG4gICAgICAgIHZpc2l0ZWQuYWRkKGVkZ2UpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICB2YXIgZWRnZUxpc3QgPSBbXTtcblxuICAgICAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdChzb3VyY2UuZ2V0RWRnZUxpc3RUb05vZGUodGFyZ2V0KSk7XG4gICAgICAgIGVkZ2VMaXN0ID0gZWRnZUxpc3QuY29uY2F0KHRhcmdldC5nZXRFZGdlTGlzdFRvTm9kZShzb3VyY2UpKTtcblxuICAgICAgICBpZiAoIXZpc2l0ZWQuY29udGFpbnMoZWRnZUxpc3RbMF0pKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKGVkZ2VMaXN0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFyIGs7XG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgZWRnZUxpc3QubGVuZ3RoOyBrKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBtdWx0aUVkZ2UgPSBlZGdlTGlzdFtrXTtcbiAgICAgICAgICAgICAgbXVsdGlFZGdlLmdldEJlbmRwb2ludHMoKS5wdXNoKG5ldyBQb2ludEQoKSk7XG4gICAgICAgICAgICAgIHRoaXMuY3JlYXRlRHVtbXlOb2Rlc0ZvckJlbmRwb2ludHMobXVsdGlFZGdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmlzaXRlZC5hZGRBbGwobGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodmlzaXRlZC5zaXplKCkgPT0gZWRnZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUucG9zaXRpb25Ob2Rlc1JhZGlhbGx5ID0gZnVuY3Rpb24gKGZvcmVzdCkge1xuICAvLyBXZSB0aWxlIHRoZSB0cmVlcyB0byBhIGdyaWQgcm93IGJ5IHJvdzsgZmlyc3QgdHJlZSBzdGFydHMgYXQgKDAsMClcbiAgdmFyIGN1cnJlbnRTdGFydGluZ1BvaW50ID0gbmV3IFBvaW50KDAsIDApO1xuICB2YXIgbnVtYmVyT2ZDb2x1bW5zID0gTWF0aC5jZWlsKE1hdGguc3FydChmb3Jlc3QubGVuZ3RoKSk7XG4gIHZhciBoZWlnaHQgPSAwO1xuICB2YXIgY3VycmVudFkgPSAwO1xuICB2YXIgY3VycmVudFggPSAwO1xuICB2YXIgcG9pbnQgPSBuZXcgUG9pbnREKDAsIDApO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm9yZXN0Lmxlbmd0aDsgaSsrKVxuICB7XG4gICAgaWYgKGkgJSBudW1iZXJPZkNvbHVtbnMgPT0gMClcbiAgICB7XG4gICAgICAvLyBTdGFydCBvZiBhIG5ldyByb3csIG1ha2UgdGhlIHggY29vcmRpbmF0ZSAwLCBpbmNyZW1lbnQgdGhlXG4gICAgICAvLyB5IGNvb3JkaW5hdGUgd2l0aCB0aGUgbWF4IGhlaWdodCBvZiB0aGUgcHJldmlvdXMgcm93XG4gICAgICBjdXJyZW50WCA9IDA7XG4gICAgICBjdXJyZW50WSA9IGhlaWdodDtcblxuICAgICAgaWYgKGkgIT0gMClcbiAgICAgIHtcbiAgICAgICAgY3VycmVudFkgKz0gQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPTkVOVF9TRVBFUkFUSU9OO1xuICAgICAgfVxuXG4gICAgICBoZWlnaHQgPSAwO1xuICAgIH1cblxuICAgIHZhciB0cmVlID0gZm9yZXN0W2ldO1xuXG4gICAgLy8gRmluZCB0aGUgY2VudGVyIG9mIHRoZSB0cmVlXG4gICAgdmFyIGNlbnRlck5vZGUgPSBMYXlvdXQuZmluZENlbnRlck9mVHJlZSh0cmVlKTtcblxuICAgIC8vIFNldCB0aGUgc3RhcmluZyBwb2ludCBvZiB0aGUgbmV4dCB0cmVlXG4gICAgY3VycmVudFN0YXJ0aW5nUG9pbnQueCA9IGN1cnJlbnRYO1xuICAgIGN1cnJlbnRTdGFydGluZ1BvaW50LnkgPSBjdXJyZW50WTtcblxuICAgIC8vIERvIGEgcmFkaWFsIGxheW91dCBzdGFydGluZyB3aXRoIHRoZSBjZW50ZXJcbiAgICBwb2ludCA9XG4gICAgICAgICAgICBDb1NFTGF5b3V0LnJhZGlhbExheW91dCh0cmVlLCBjZW50ZXJOb2RlLCBjdXJyZW50U3RhcnRpbmdQb2ludCk7XG5cbiAgICBpZiAocG9pbnQueSA+IGhlaWdodClcbiAgICB7XG4gICAgICBoZWlnaHQgPSBNYXRoLmZsb29yKHBvaW50LnkpO1xuICAgIH1cblxuICAgIGN1cnJlbnRYID0gTWF0aC5mbG9vcihwb2ludC54ICsgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPTkVOVF9TRVBFUkFUSU9OKTtcbiAgfVxuXG4gIHRoaXMudHJhbnNmb3JtKFxuICAgICAgICAgIG5ldyBQb2ludEQoTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9YIC0gcG9pbnQueCAvIDIsXG4gICAgICAgICAgICAgICAgICBMYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1kgLSBwb2ludC55IC8gMikpO1xufTtcblxuQ29TRUxheW91dC5yYWRpYWxMYXlvdXQgPSBmdW5jdGlvbiAodHJlZSwgY2VudGVyTm9kZSwgc3RhcnRpbmdQb2ludCkge1xuICB2YXIgcmFkaWFsU2VwID0gTWF0aC5tYXgodGhpcy5tYXhEaWFnb25hbEluVHJlZSh0cmVlKSxcbiAgICAgICAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfUkFESUFMX1NFUEFSQVRJT04pO1xuICBDb1NFTGF5b3V0LmJyYW5jaFJhZGlhbExheW91dChjZW50ZXJOb2RlLCBudWxsLCAwLCAzNTksIDAsIHJhZGlhbFNlcCk7XG4gIHZhciBib3VuZHMgPSBMR3JhcGguY2FsY3VsYXRlQm91bmRzKHRyZWUpO1xuXG4gIHZhciB0cmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtKCk7XG4gIHRyYW5zZm9ybS5zZXREZXZpY2VPcmdYKGJvdW5kcy5nZXRNaW5YKCkpO1xuICB0cmFuc2Zvcm0uc2V0RGV2aWNlT3JnWShib3VuZHMuZ2V0TWluWSgpKTtcbiAgdHJhbnNmb3JtLnNldFdvcmxkT3JnWChzdGFydGluZ1BvaW50LngpO1xuICB0cmFuc2Zvcm0uc2V0V29ybGRPcmdZKHN0YXJ0aW5nUG9pbnQueSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgdmFyIG5vZGUgPSB0cmVlW2ldO1xuICAgIG5vZGUudHJhbnNmb3JtKHRyYW5zZm9ybSk7XG4gIH1cblxuICB2YXIgYm90dG9tUmlnaHQgPVxuICAgICAgICAgIG5ldyBQb2ludEQoYm91bmRzLmdldE1heFgoKSwgYm91bmRzLmdldE1heFkoKSk7XG5cbiAgcmV0dXJuIHRyYW5zZm9ybS5pbnZlcnNlVHJhbnNmb3JtUG9pbnQoYm90dG9tUmlnaHQpO1xufTtcblxuQ29TRUxheW91dC5icmFuY2hSYWRpYWxMYXlvdXQgPSBmdW5jdGlvbiAobm9kZSwgcGFyZW50T2ZOb2RlLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgZGlzdGFuY2UsIHJhZGlhbFNlcGFyYXRpb24pIHtcbiAgLy8gRmlyc3QsIHBvc2l0aW9uIHRoaXMgbm9kZSBieSBmaW5kaW5nIGl0cyBhbmdsZS5cbiAgdmFyIGhhbGZJbnRlcnZhbCA9ICgoZW5kQW5nbGUgLSBzdGFydEFuZ2xlKSArIDEpIC8gMjtcblxuICBpZiAoaGFsZkludGVydmFsIDwgMClcbiAge1xuICAgIGhhbGZJbnRlcnZhbCArPSAxODA7XG4gIH1cblxuICB2YXIgbm9kZUFuZ2xlID0gKGhhbGZJbnRlcnZhbCArIHN0YXJ0QW5nbGUpICUgMzYwO1xuICB2YXIgdGV0YSA9IChub2RlQW5nbGUgKiBJR2VvbWV0cnkuVFdPX1BJKSAvIDM2MDtcblxuICAvLyBNYWtlIHBvbGFyIHRvIGphdmEgY29yZGluYXRlIGNvbnZlcnNpb24uXG4gIHZhciBjb3NfdGV0YSA9IE1hdGguY29zKHRldGEpO1xuICB2YXIgeF8gPSBkaXN0YW5jZSAqIE1hdGguY29zKHRldGEpO1xuICB2YXIgeV8gPSBkaXN0YW5jZSAqIE1hdGguc2luKHRldGEpO1xuXG4gIG5vZGUuc2V0Q2VudGVyKHhfLCB5Xyk7XG5cbiAgLy8gVHJhdmVyc2UgYWxsIG5laWdoYm9ycyBvZiB0aGlzIG5vZGUgYW5kIHJlY3Vyc2l2ZWx5IGNhbGwgdGhpc1xuICAvLyBmdW5jdGlvbi5cbiAgdmFyIG5laWdoYm9yRWRnZXMgPSBbXTtcbiAgbmVpZ2hib3JFZGdlcyA9IG5laWdoYm9yRWRnZXMuY29uY2F0KG5vZGUuZ2V0RWRnZXMoKSk7XG4gIHZhciBjaGlsZENvdW50ID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XG5cbiAgaWYgKHBhcmVudE9mTm9kZSAhPSBudWxsKVxuICB7XG4gICAgY2hpbGRDb3VudC0tO1xuICB9XG5cbiAgdmFyIGJyYW5jaENvdW50ID0gMDtcblxuICB2YXIgaW5jRWRnZXNDb3VudCA9IG5laWdoYm9yRWRnZXMubGVuZ3RoO1xuICB2YXIgc3RhcnRJbmRleDtcblxuICB2YXIgZWRnZXMgPSBub2RlLmdldEVkZ2VzQmV0d2VlbihwYXJlbnRPZk5vZGUpO1xuXG4gIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBlZGdlcywgcHJ1bmUgdGhlbSB1bnRpbCB0aGVyZSByZW1haW5zIG9ubHkgb25lXG4gIC8vIGVkZ2UuXG4gIHdoaWxlIChlZGdlcy5sZW5ndGggPiAxKVxuICB7XG4gICAgLy9uZWlnaGJvckVkZ2VzLnJlbW92ZShlZGdlcy5yZW1vdmUoMCkpO1xuICAgIHZhciB0ZW1wID0gZWRnZXNbMF07XG4gICAgZWRnZXMuc3BsaWNlKDAsIDEpO1xuICAgIHZhciBpbmRleCA9IG5laWdoYm9yRWRnZXMuaW5kZXhPZih0ZW1wKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgbmVpZ2hib3JFZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICBpbmNFZGdlc0NvdW50LS07XG4gICAgY2hpbGRDb3VudC0tO1xuICB9XG5cbiAgaWYgKHBhcmVudE9mTm9kZSAhPSBudWxsKVxuICB7XG4gICAgLy9hc3NlcnQgZWRnZXMubGVuZ3RoID09IDE7XG4gICAgc3RhcnRJbmRleCA9IChuZWlnaGJvckVkZ2VzLmluZGV4T2YoZWRnZXNbMF0pICsgMSkgJSBpbmNFZGdlc0NvdW50O1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHN0YXJ0SW5kZXggPSAwO1xuICB9XG5cbiAgdmFyIHN0ZXBBbmdsZSA9IE1hdGguYWJzKGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSkgLyBjaGlsZENvdW50O1xuXG4gIGZvciAodmFyIGkgPSBzdGFydEluZGV4O1xuICAgICAgICAgIGJyYW5jaENvdW50ICE9IGNoaWxkQ291bnQ7XG4gICAgICAgICAgaSA9ICgrK2kpICUgaW5jRWRnZXNDb3VudClcbiAge1xuICAgIHZhciBjdXJyZW50TmVpZ2hib3IgPVxuICAgICAgICAgICAgbmVpZ2hib3JFZGdlc1tpXS5nZXRPdGhlckVuZChub2RlKTtcblxuICAgIC8vIERvbid0IGJhY2sgdHJhdmVyc2UgdG8gcm9vdCBub2RlIGluIGN1cnJlbnQgdHJlZS5cbiAgICBpZiAoY3VycmVudE5laWdoYm9yID09IHBhcmVudE9mTm9kZSlcbiAgICB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTdGFydEFuZ2xlID1cbiAgICAgICAgICAgIChzdGFydEFuZ2xlICsgYnJhbmNoQ291bnQgKiBzdGVwQW5nbGUpICUgMzYwO1xuICAgIHZhciBjaGlsZEVuZEFuZ2xlID0gKGNoaWxkU3RhcnRBbmdsZSArIHN0ZXBBbmdsZSkgJSAzNjA7XG5cbiAgICBDb1NFTGF5b3V0LmJyYW5jaFJhZGlhbExheW91dChjdXJyZW50TmVpZ2hib3IsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgY2hpbGRTdGFydEFuZ2xlLCBjaGlsZEVuZEFuZ2xlLFxuICAgICAgICAgICAgZGlzdGFuY2UgKyByYWRpYWxTZXBhcmF0aW9uLCByYWRpYWxTZXBhcmF0aW9uKTtcblxuICAgIGJyYW5jaENvdW50Kys7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQubWF4RGlhZ29uYWxJblRyZWUgPSBmdW5jdGlvbiAodHJlZSkge1xuICB2YXIgbWF4RGlhZ29uYWwgPSBJbnRlZ2VyLk1JTl9WQUxVRTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgbm9kZSA9IHRyZWVbaV07XG4gICAgdmFyIGRpYWdvbmFsID0gbm9kZS5nZXREaWFnb25hbCgpO1xuXG4gICAgaWYgKGRpYWdvbmFsID4gbWF4RGlhZ29uYWwpXG4gICAge1xuICAgICAgbWF4RGlhZ29uYWwgPSBkaWFnb25hbDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWF4RGlhZ29uYWw7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jYWxjUmVwdWxzaW9uUmFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIGZvcm11bGEgaXMgMiB4IChsZXZlbCArIDEpIHggaWRlYWxFZGdlTGVuZ3RoXG4gIHJldHVybiAoMiAqICh0aGlzLmxldmVsICsgMSkgKiB0aGlzLmlkZWFsRWRnZUxlbmd0aCk7XG59O1xuXG4vLyBNdWx0aS1sZXZlbCBTY2FsaW5nIG1ldGhvZFxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHVuLWNvYXJzZW5zIE1pIHRvIE1pLTEgYW5kIG1ha2VzIGluaXRpYWwgcGxhY2VtZW50IGZvciBNaS0xXG4gKi9cbkNvU0VMYXlvdXQucHJvdG90eXBlLnVuY29hcnNlbiA9IGZ1bmN0aW9uKClcbntcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcbiAgXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgdiA9IGFsbE5vZGVzW2ldO1xuICAgIC8vIHNldCBwb3NpdGlvbnMgb2Ygdi5wcmVkMSBhbmQgdi5wcmVkMlxuICAgIHYuZ2V0UHJlZDEoKS5zZXRDZW50ZXIodi5nZXRDZW50ZXJYKCksIHYuZ2V0Q2VudGVyWSgpKTtcblxuICAgIGlmICh2LmdldFByZWQyKCkgIT0gbnVsbClcbiAgICB7XG4gICAgICAvLyBUT0RPOiBjaGVjayBcbiAgICAgIC8qXG4gICAgICBkb3VibGUgdyA9IHYuZ2V0UHJlZDEoKS5nZXRSZWN0KCkud2lkdGg7XG4gICAgICBkb3VibGUgbCA9IHRoaXMuaWRlYWxFZGdlTGVuZ3RoO1xuICAgICAgdi5nZXRQcmVkMigpLnNldExvY2F0aW9uKCh2LmdldFByZWQxKCkuZ2V0TGVmdCgpK3crbCksICh2LmdldFByZWQxKCkuZ2V0VG9wKCkrdytsKSk7XG4gICAgICAqL1xuLy8gICAgICB2YXIgZGlzdGFuY2UgPSAoTWF0aC5tYXgodi5nZXRQcmVkMSgpLmdldFdpZHRoKCksIHYuZ2V0UHJlZDEoKS5nZXRIZWlnaHQoKSkgKyBNYXRoLm1heCh2LmdldFByZWQyKCkuZ2V0V2lkdGgoKSwgdi5nZXRQcmVkMigpLmdldEhlaWdodCgpKSkgLyAyICsgNTtcbi8vICAgICAgY29uc29sZS5sb2coZGlzdGFuY2UpO1xuLy8gICAgICB2YXIgeFBvcyA9IE1hdGgucmFuZG9tKCkgKiAyICogZGlzdGFuY2UgLSBkaXN0YW5jZTtcbi8vICAgICAgY29uc29sZS5sb2coeFBvcyk7XG4vLyAgICAgIHZhciB5UG9zID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IChNYXRoLnNxcnQoZGlzdGFuY2UgKiBkaXN0YW5jZSAtIHhQb3MgKiB4UG9zKSkgOiAoLTEgKiBNYXRoLnNxcnQoZGlzdGFuY2UgKiBkaXN0YW5jZSAtIHhQb3MgKiB4UG9zKSk7XG4vLyAgICAgIGNvbnNvbGUubG9nKHlQb3MpO1xuLy8gICAgICBcbi8vICAgICAgdi5nZXRQcmVkMigpLnNldENlbnRlcih2LmdldFByZWQxKCkuZ2V0Q2VudGVyWCArIHhQb3MsIHYuZ2V0UHJlZDEoKS5nZXRDZW50ZXJZICsgeVBvcyk7XG4gICAgICBcbiAgICAgIHYuZ2V0UHJlZDIoKS5zZXRMb2NhdGlvbih2LmdldExlZnQoKSt0aGlzLmlkZWFsRWRnZUxlbmd0aCwgXG4gICAgICAgICAgICAgIHYuZ2V0VG9wKCkrdGhpcy5pZGVhbEVkZ2VMZW5ndGgpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gVGlsaW5nIG1ldGhvZHNcblxuLy8gR3JvdXAgemVybyBkZWdyZWUgbWVtYmVycyB3aG9zZSBwYXJlbnRzIGFyZSBub3QgdG8gYmUgdGlsZWQsIGNyZWF0ZSBkdW1teSBwYXJlbnRzIHdoZXJlIG5lZWRlZCBhbmQgZmlsbCBtZW1iZXJHcm91cHMgYnkgdGhlaXIgZHVtbXAgcGFyZW50IGlkJ3NcbkNvU0VMYXlvdXQucHJvdG90eXBlLmdyb3VwWmVyb0RlZ3JlZU1lbWJlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gYXJyYXkgb2YgW3BhcmVudF9pZCB4IG9uZURlZ3JlZU5vZGVfaWRdXG4gIHZhciB0ZW1wTWVtYmVyR3JvdXBzID0ge307IC8vIEEgdGVtcG9yYXJ5IG1hcCBvZiBwYXJlbnQgbm9kZSBhbmQgaXRzIHplcm8gZGVncmVlIG1lbWJlcnNcbiAgdGhpcy5tZW1iZXJHcm91cHMgPSB7fTsgLy8gQSBtYXAgb2YgZHVtbXkgcGFyZW50IG5vZGUgYW5kIGl0cyB6ZXJvIGRlZ3JlZSBtZW1iZXJzIHdob3NlIHBhcmVudHMgYXJlIG5vdCB0byBiZSB0aWxlZFxuICB0aGlzLmlkVG9EdW1teU5vZGUgPSB7fTsgLy8gQSBtYXAgb2YgaWQgdG8gZHVtbXkgbm9kZSBcbiAgXG4gIHZhciB6ZXJvRGVncmVlID0gW107IC8vIExpc3Qgb2YgemVybyBkZWdyZWUgbm9kZXMgd2hvc2UgcGFyZW50cyBhcmUgbm90IHRvIGJlIHRpbGVkXG4gIHZhciBhbGxOb2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XG5cbiAgLy8gRmlsbCB6ZXJvIGRlZ3JlZSBsaXN0XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IGFsbE5vZGVzW2ldO1xuICAgIHZhciBwYXJlbnQgPSBub2RlLmdldFBhcmVudCgpO1xuICAgIC8vIElmIGEgbm9kZSBoYXMgemVybyBkZWdyZWUgYW5kIGl0cyBwYXJlbnQgaXMgbm90IHRvIGJlIHRpbGVkIGlmIGV4aXN0cyBhZGQgdGhhdCBub2RlIHRvIHplcm9EZWdyZXMgbGlzdFxuICAgIGlmICh0aGlzLmdldE5vZGVEZWdyZWVXaXRoQ2hpbGRyZW4obm9kZSkgPT09IDAgJiYgKCBwYXJlbnQuaWQgPT0gdW5kZWZpbmVkIHx8ICF0aGlzLmdldFRvQmVUaWxlZChwYXJlbnQpICkgKSB7XG4gICAgICB6ZXJvRGVncmVlLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9mIHBhcmVudCBub2RlIGFuZCBpdHMgemVybyBkZWdyZWUgbWVtYmVyc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHplcm9EZWdyZWUubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgbm9kZSA9IHplcm9EZWdyZWVbaV07IC8vIFplcm8gZGVncmVlIG5vZGUgaXRzZWxmXG4gICAgdmFyIHBfaWQgPSBub2RlLmdldFBhcmVudCgpLmlkOyAvLyBQYXJlbnQgaWRcblxuICAgIGlmICh0eXBlb2YgdGVtcE1lbWJlckdyb3Vwc1twX2lkXSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHRlbXBNZW1iZXJHcm91cHNbcF9pZF0gPSBbXTtcblxuICAgIHRlbXBNZW1iZXJHcm91cHNbcF9pZF0gPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdLmNvbmNhdChub2RlKTsgLy8gUHVzaCBub2RlIHRvIHRoZSBsaXN0IGJlbG9uZ3MgdG8gaXRzIHBhcmVudCBpbiB0ZW1wTWVtYmVyR3JvdXBzXG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYXQgbGVhc3QgdHdvIG5vZGVzIGF0IGEgbGV2ZWwsIGNyZWF0ZSBhIGR1bW15IGNvbXBvdW5kIGZvciB0aGVtXG4gIE9iamVjdC5rZXlzKHRlbXBNZW1iZXJHcm91cHMpLmZvckVhY2goZnVuY3Rpb24ocF9pZCkge1xuICAgIGlmICh0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBkdW1teUNvbXBvdW5kSWQgPSBcIkR1bW15Q29tcG91bmRfXCIgKyBwX2lkOyAvLyBUaGUgaWQgb2YgZHVtbXkgY29tcG91bmQgd2hpY2ggd2lsbCBiZSBjcmVhdGVkIHNvb25cbiAgICAgIHNlbGYubWVtYmVyR3JvdXBzW2R1bW15Q29tcG91bmRJZF0gPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdOyAvLyBBZGQgZHVtbXkgY29tcG91bmQgdG8gbWVtYmVyR3JvdXBzXG5cbiAgICAgIHZhciBwYXJlbnQgPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdWzBdLmdldFBhcmVudCgpOyAvLyBUaGUgcGFyZW50IG9mIHplcm8gZGVncmVlIG5vZGVzIHdpbGwgYmUgdGhlIHBhcmVudCBvZiBuZXcgZHVtbXkgY29tcG91bmRcblxuICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgY29tcG91bmQgd2l0aCBjYWxjdWxhdGVkIGlkXG4gICAgICB2YXIgZHVtbXlDb21wb3VuZCA9IG5ldyBDb1NFTm9kZShzZWxmLmdyYXBoTWFuYWdlcik7XG4gICAgICBkdW1teUNvbXBvdW5kLmlkID0gZHVtbXlDb21wb3VuZElkO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nTGVmdCA9IHBhcmVudC5wYWRkaW5nTGVmdCB8fCAwO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nUmlnaHQgPSBwYXJlbnQucGFkZGluZ1JpZ2h0IHx8IDA7XG4gICAgICBkdW1teUNvbXBvdW5kLnBhZGRpbmdCb3R0b20gPSBwYXJlbnQucGFkZGluZ0JvdHRvbSB8fCAwO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nVG9wID0gcGFyZW50LnBhZGRpbmdUb3AgfHwgMDtcbiAgICAgIFxuICAgICAgc2VsZi5pZFRvRHVtbXlOb2RlW2R1bW15Q29tcG91bmRJZF0gPSBkdW1teUNvbXBvdW5kO1xuICAgICAgXG4gICAgICB2YXIgZHVtbXlQYXJlbnRHcmFwaCA9IHNlbGYuZ2V0R3JhcGhNYW5hZ2VyKCkuYWRkKHNlbGYubmV3R3JhcGgoKSwgZHVtbXlDb21wb3VuZCk7XG4gICAgICB2YXIgcGFyZW50R3JhcGggPSBwYXJlbnQuZ2V0Q2hpbGQoKTtcblxuICAgICAgLy8gQWRkIGR1bW15IGNvbXBvdW5kIHRvIHBhcmVudCB0aGUgZ3JhcGhcbiAgICAgIHBhcmVudEdyYXBoLmFkZChkdW1teUNvbXBvdW5kKTtcblxuICAgICAgLy8gRm9yIGVhY2ggemVybyBkZWdyZWUgbm9kZSBpbiB0aGlzIGxldmVsIHJlbW92ZSBpdCBmcm9tIGl0cyBwYXJlbnQgZ3JhcGggYW5kIGFkZCBpdCB0byB0aGUgZ3JhcGggb2YgZHVtbXkgcGFyZW50XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBNZW1iZXJHcm91cHNbcF9pZF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdW2ldO1xuICAgICAgICBcbiAgICAgICAgcGFyZW50R3JhcGgucmVtb3ZlKG5vZGUpO1xuICAgICAgICBkdW1teVBhcmVudEdyYXBoLmFkZChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xlYXJDb21wb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGlsZEdyYXBoTWFwID0ge307XG4gIHZhciBpZFRvTm9kZSA9IHt9O1xuXG4gIC8vIEdldCBjb21wb3VuZCBvcmRlcmluZyBieSBmaW5kaW5nIHRoZSBpbm5lciBvbmUgZmlyc3RcbiAgdGhpcy5wZXJmb3JtREZTT25Db21wb3VuZHMoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG91bmRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgIFxuICAgIGlkVG9Ob2RlW3RoaXMuY29tcG91bmRPcmRlcltpXS5pZF0gPSB0aGlzLmNvbXBvdW5kT3JkZXJbaV07XG4gICAgY2hpbGRHcmFwaE1hcFt0aGlzLmNvbXBvdW5kT3JkZXJbaV0uaWRdID0gW10uY29uY2F0KHRoaXMuY29tcG91bmRPcmRlcltpXS5nZXRDaGlsZCgpLmdldE5vZGVzKCkpO1xuXG4gICAgLy8gUmVtb3ZlIGNoaWxkcmVuIG9mIGNvbXBvdW5kc1xuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlbW92ZSh0aGlzLmNvbXBvdW5kT3JkZXJbaV0uZ2V0Q2hpbGQoKSk7XG4gICAgdGhpcy5jb21wb3VuZE9yZGVyW2ldLmNoaWxkID0gbnVsbDtcbiAgfVxuICBcbiAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2RlcygpO1xuICBcbiAgLy8gVGlsZSB0aGUgcmVtb3ZlZCBjaGlsZHJlblxuICB0aGlzLnRpbGVDb21wb3VuZE1lbWJlcnMoY2hpbGRHcmFwaE1hcCwgaWRUb05vZGUpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xlYXJaZXJvRGVncmVlTWVtYmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdGlsZWRaZXJvRGVncmVlUGFjayA9IHRoaXMudGlsZWRaZXJvRGVncmVlUGFjayA9IFtdO1xuXG4gIE9iamVjdC5rZXlzKHRoaXMubWVtYmVyR3JvdXBzKS5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNvbXBvdW5kTm9kZSA9IHNlbGYuaWRUb0R1bW15Tm9kZVtpZF07IC8vIEdldCB0aGUgZHVtbXkgY29tcG91bmRcblxuICAgIHRpbGVkWmVyb0RlZ3JlZVBhY2tbaWRdID0gc2VsZi50aWxlTm9kZXMoc2VsZi5tZW1iZXJHcm91cHNbaWRdLCBjb21wb3VuZE5vZGUucGFkZGluZ0xlZnQgKyBjb21wb3VuZE5vZGUucGFkZGluZ1JpZ2h0KTtcblxuICAgIC8vIFNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZHVtbXkgY29tcG91bmQgYXMgY2FsY3VsYXRlZFxuICAgIGNvbXBvdW5kTm9kZS5yZWN0LndpZHRoID0gdGlsZWRaZXJvRGVncmVlUGFja1tpZF0ud2lkdGg7XG4gICAgY29tcG91bmROb2RlLnJlY3QuaGVpZ2h0ID0gdGlsZWRaZXJvRGVncmVlUGFja1tpZF0uaGVpZ2h0O1xuICB9KTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnJlcG9wdWxhdGVDb21wb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSB0aGlzLmNvbXBvdW5kT3JkZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbENvbXBvdW5kTm9kZSA9IHRoaXMuY29tcG91bmRPcmRlcltpXTtcbiAgICB2YXIgaWQgPSBsQ29tcG91bmROb2RlLmlkO1xuICAgIHZhciBob3Jpem9udGFsTWFyZ2luID0gbENvbXBvdW5kTm9kZS5wYWRkaW5nTGVmdDtcbiAgICB2YXIgdmVydGljYWxNYXJnaW4gPSBsQ29tcG91bmROb2RlLnBhZGRpbmdUb3A7XG5cbiAgICB0aGlzLmFkanVzdExvY2F0aW9ucyh0aGlzLnRpbGVkTWVtYmVyUGFja1tpZF0sIGxDb21wb3VuZE5vZGUucmVjdC54LCBsQ29tcG91bmROb2RlLnJlY3QueSwgaG9yaXpvbnRhbE1hcmdpbiwgdmVydGljYWxNYXJnaW4pO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5yZXBvcHVsYXRlWmVyb0RlZ3JlZU1lbWJlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHRpbGVkUGFjayA9IHRoaXMudGlsZWRaZXJvRGVncmVlUGFjaztcbiAgXG4gIE9iamVjdC5rZXlzKHRpbGVkUGFjaykuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgIHZhciBjb21wb3VuZE5vZGUgPSBzZWxmLmlkVG9EdW1teU5vZGVbaWRdOyAvLyBHZXQgdGhlIGR1bW15IGNvbXBvdW5kIGJ5IGl0cyBpZFxuICAgIHZhciBob3Jpem9udGFsTWFyZ2luID0gY29tcG91bmROb2RlLnBhZGRpbmdMZWZ0O1xuICAgIHZhciB2ZXJ0aWNhbE1hcmdpbiA9IGNvbXBvdW5kTm9kZS5wYWRkaW5nVG9wO1xuXG4gICAgLy8gQWRqdXN0IHRoZSBwb3NpdGlvbnMgb2Ygbm9kZXMgd3J0IGl0cyBjb21wb3VuZFxuICAgIHNlbGYuYWRqdXN0TG9jYXRpb25zKHRpbGVkUGFja1tpZF0sIGNvbXBvdW5kTm9kZS5yZWN0LngsIGNvbXBvdW5kTm9kZS5yZWN0LnksIGhvcml6b250YWxNYXJnaW4sIHZlcnRpY2FsTWFyZ2luKTtcbiAgfSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRUb0JlVGlsZWQgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgaWQgPSBub2RlLmlkO1xuICAvL2ZpcnN0bHkgY2hlY2sgdGhlIHByZXZpb3VzIHJlc3VsdHNcbiAgaWYgKHRoaXMudG9CZVRpbGVkW2lkXSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMudG9CZVRpbGVkW2lkXTtcbiAgfVxuXG4gIC8vb25seSBjb21wb3VuZCBub2RlcyBhcmUgdG8gYmUgdGlsZWRcbiAgdmFyIGNoaWxkR3JhcGggPSBub2RlLmdldENoaWxkKCk7XG4gIGlmIChjaGlsZEdyYXBoID09IG51bGwpIHtcbiAgICB0aGlzLnRvQmVUaWxlZFtpZF0gPSBmYWxzZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY2hpbGRyZW4gPSBjaGlsZEdyYXBoLmdldE5vZGVzKCk7IC8vIEdldCB0aGUgY2hpbGRyZW4gbm9kZXNcblxuICAvL2EgY29tcG91bmQgbm9kZSBpcyBub3QgdG8gYmUgdGlsZWQgaWYgYWxsIG9mIGl0cyBjb21wb3VuZCBjaGlsZHJlbiBhcmUgbm90IHRvIGJlIHRpbGVkXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGhlQ2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICh0aGlzLmdldE5vZGVEZWdyZWUodGhlQ2hpbGQpID4gMCkge1xuICAgICAgdGhpcy50b0JlVGlsZWRbaWRdID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9wYXNzIHRoZSBjaGlsZHJlbiBub3QgaGF2aW5nIHRoZSBjb21wb3VuZCBzdHJ1Y3R1cmVcbiAgICBpZiAodGhlQ2hpbGQuZ2V0Q2hpbGQoKSA9PSBudWxsKSB7XG4gICAgICB0aGlzLnRvQmVUaWxlZFt0aGVDaGlsZC5pZF0gPSBmYWxzZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nZXRUb0JlVGlsZWQodGhlQ2hpbGQpKSB7XG4gICAgICB0aGlzLnRvQmVUaWxlZFtpZF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgdGhpcy50b0JlVGlsZWRbaWRdID0gdHJ1ZTtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBHZXQgZGVncmVlIG9mIGEgbm9kZSBkZXBlbmRpbmcgb2YgaXRzIGVkZ2VzIGFuZCBpbmRlcGVuZGVudCBvZiBpdHMgY2hpbGRyZW5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldE5vZGVEZWdyZWUgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgaWQgPSBub2RlLmlkO1xuICB2YXIgZWRnZXMgPSBub2RlLmdldEVkZ2VzKCk7XG4gIHZhciBkZWdyZWUgPSAwO1xuICBcbiAgLy8gRm9yIHRoZSBlZGdlcyBjb25uZWN0ZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgaWYgKGVkZ2UuZ2V0U291cmNlKCkuaWQgIT0gZWRnZS5nZXRUYXJnZXQoKS5pZCkge1xuICAgICAgZGVncmVlID0gZGVncmVlICsgMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlZ3JlZTtcbn07XG5cbi8vIEdldCBkZWdyZWUgb2YgYSBub2RlIHdpdGggaXRzIGNoaWxkcmVuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXROb2RlRGVncmVlV2l0aENoaWxkcmVuID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgdmFyIGRlZ3JlZSA9IHRoaXMuZ2V0Tm9kZURlZ3JlZShub2RlKTtcbiAgaWYgKG5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlZ3JlZTtcbiAgfVxuICB2YXIgY2hpbGRyZW4gPSBub2RlLmdldENoaWxkKCkuZ2V0Tm9kZXMoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgIGRlZ3JlZSArPSB0aGlzLmdldE5vZGVEZWdyZWVXaXRoQ2hpbGRyZW4oY2hpbGQpO1xuICB9XG4gIHJldHVybiBkZWdyZWU7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5wZXJmb3JtREZTT25Db21wb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY29tcG91bmRPcmRlciA9IFtdO1xuICB0aGlzLmZpbGxDb21wZXhPcmRlckJ5REZTKHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXROb2RlcygpKTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmZpbGxDb21wZXhPcmRlckJ5REZTID0gZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICBpZiAoY2hpbGQuZ2V0Q2hpbGQoKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZpbGxDb21wZXhPcmRlckJ5REZTKGNoaWxkLmdldENoaWxkKCkuZ2V0Tm9kZXMoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldFRvQmVUaWxlZChjaGlsZCkpIHtcbiAgICAgIHRoaXMuY29tcG91bmRPcmRlci5wdXNoKGNoaWxkKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuKiBUaGlzIG1ldGhvZCBwbGFjZXMgZWFjaCB6ZXJvIGRlZ3JlZSBtZW1iZXIgd3J0IGdpdmVuICh4LHkpIGNvb3JkaW5hdGVzICh0b3AgbGVmdCkuXG4qL1xuQ29TRUxheW91dC5wcm90b3R5cGUuYWRqdXN0TG9jYXRpb25zID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbiwgeCwgeSwgY29tcG91bmRIb3Jpem9udGFsTWFyZ2luLCBjb21wb3VuZFZlcnRpY2FsTWFyZ2luKSB7XG4gIHggKz0gY29tcG91bmRIb3Jpem9udGFsTWFyZ2luO1xuICB5ICs9IGNvbXBvdW5kVmVydGljYWxNYXJnaW47XG5cbiAgdmFyIGxlZnQgPSB4O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcm93ID0gb3JnYW5pemF0aW9uLnJvd3NbaV07XG4gICAgeCA9IGxlZnQ7XG4gICAgdmFyIG1heEhlaWdodCA9IDA7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGxub2RlID0gcm93W2pdO1xuXG4gICAgICBsbm9kZS5yZWN0LnggPSB4Oy8vICsgbG5vZGUucmVjdC53aWR0aCAvIDI7XG4gICAgICBsbm9kZS5yZWN0LnkgPSB5Oy8vICsgbG5vZGUucmVjdC5oZWlnaHQgLyAyO1xuXG4gICAgICB4ICs9IGxub2RlLnJlY3Qud2lkdGggKyBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmc7XG5cbiAgICAgIGlmIChsbm9kZS5yZWN0LmhlaWdodCA+IG1heEhlaWdodClcbiAgICAgICAgbWF4SGVpZ2h0ID0gbG5vZGUucmVjdC5oZWlnaHQ7XG4gICAgfVxuXG4gICAgeSArPSBtYXhIZWlnaHQgKyBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS50aWxlQ29tcG91bmRNZW1iZXJzID0gZnVuY3Rpb24gKGNoaWxkR3JhcGhNYXAsIGlkVG9Ob2RlKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy50aWxlZE1lbWJlclBhY2sgPSBbXTtcblxuICBPYmplY3Qua2V5cyhjaGlsZEdyYXBoTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgLy8gR2V0IHRoZSBjb21wb3VuZCBub2RlXG4gICAgdmFyIGNvbXBvdW5kTm9kZSA9IGlkVG9Ob2RlW2lkXTtcblxuICAgIHNlbGYudGlsZWRNZW1iZXJQYWNrW2lkXSA9IHNlbGYudGlsZU5vZGVzKGNoaWxkR3JhcGhNYXBbaWRdLCBjb21wb3VuZE5vZGUucGFkZGluZ0xlZnQgKyBjb21wb3VuZE5vZGUucGFkZGluZ1JpZ2h0KTtcblxuICAgIGNvbXBvdW5kTm9kZS5yZWN0LndpZHRoID0gc2VsZi50aWxlZE1lbWJlclBhY2tbaWRdLndpZHRoICsgMjA7XG4gICAgY29tcG91bmROb2RlLnJlY3QuaGVpZ2h0ID0gc2VsZi50aWxlZE1lbWJlclBhY2tbaWRdLmhlaWdodCArIDIwO1xuICB9KTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnRpbGVOb2RlcyA9IGZ1bmN0aW9uIChub2RlcywgbWluV2lkdGgpIHtcbiAgdmFyIHZlcnRpY2FsUGFkZGluZyA9IENvU0VDb25zdGFudHMuVElMSU5HX1BBRERJTkdfVkVSVElDQUw7XG4gIHZhciBob3Jpem9udGFsUGFkZGluZyA9IENvU0VDb25zdGFudHMuVElMSU5HX1BBRERJTkdfSE9SSVpPTlRBTDtcbiAgdmFyIG9yZ2FuaXphdGlvbiA9IHtcbiAgICByb3dzOiBbXSxcbiAgICByb3dXaWR0aDogW10sXG4gICAgcm93SGVpZ2h0OiBbXSxcbiAgICB3aWR0aDogMjAsXG4gICAgaGVpZ2h0OiAyMCxcbiAgICB2ZXJ0aWNhbFBhZGRpbmc6IHZlcnRpY2FsUGFkZGluZyxcbiAgICBob3Jpem9udGFsUGFkZGluZzogaG9yaXpvbnRhbFBhZGRpbmdcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBub2RlcyBpbiBhc2NlbmRpbmcgb3JkZXIgb2YgdGhlaXIgYXJlYXNcbiAgbm9kZXMuc29ydChmdW5jdGlvbiAobjEsIG4yKSB7XG4gICAgaWYgKG4xLnJlY3Qud2lkdGggKiBuMS5yZWN0LmhlaWdodCA+IG4yLnJlY3Qud2lkdGggKiBuMi5yZWN0LmhlaWdodClcbiAgICAgIHJldHVybiAtMTtcbiAgICBpZiAobjEucmVjdC53aWR0aCAqIG4xLnJlY3QuaGVpZ2h0IDwgbjIucmVjdC53aWR0aCAqIG4yLnJlY3QuaGVpZ2h0KVxuICAgICAgcmV0dXJuIDE7XG4gICAgcmV0dXJuIDA7XG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgb3JnYW5pemF0aW9uIC0+IHRpbGUgbWVtYmVyc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxOb2RlID0gbm9kZXNbaV07XG4gICAgXG4gICAgaWYgKG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLmluc2VydE5vZGVUb1Jvdyhvcmdhbml6YXRpb24sIGxOb2RlLCAwLCBtaW5XaWR0aCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuY2FuQWRkSG9yaXpvbnRhbChvcmdhbml6YXRpb24sIGxOb2RlLnJlY3Qud2lkdGgsIGxOb2RlLnJlY3QuaGVpZ2h0KSkge1xuICAgICAgdGhpcy5pbnNlcnROb2RlVG9Sb3cob3JnYW5pemF0aW9uLCBsTm9kZSwgdGhpcy5nZXRTaG9ydGVzdFJvd0luZGV4KG9yZ2FuaXphdGlvbiksIG1pbldpZHRoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmluc2VydE5vZGVUb1Jvdyhvcmdhbml6YXRpb24sIGxOb2RlLCBvcmdhbml6YXRpb24ucm93cy5sZW5ndGgsIG1pbldpZHRoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNoaWZ0VG9MYXN0Um93KG9yZ2FuaXphdGlvbik7XG4gIH1cblxuICByZXR1cm4gb3JnYW5pemF0aW9uO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuaW5zZXJ0Tm9kZVRvUm93ID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbiwgbm9kZSwgcm93SW5kZXgsIG1pbldpZHRoKSB7XG4gIHZhciBtaW5Db21wb3VuZFNpemUgPSBtaW5XaWR0aDtcblxuICAvLyBBZGQgbmV3IHJvdyBpZiBuZWVkZWRcbiAgaWYgKHJvd0luZGV4ID09IG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aCkge1xuICAgIHZhciBzZWNvbmREaW1lbnNpb24gPSBbXTtcblxuICAgIG9yZ2FuaXphdGlvbi5yb3dzLnB1c2goc2Vjb25kRGltZW5zaW9uKTtcbiAgICBvcmdhbml6YXRpb24ucm93V2lkdGgucHVzaChtaW5Db21wb3VuZFNpemUpO1xuICAgIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHQucHVzaCgwKTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSByb3cgd2lkdGhcbiAgdmFyIHcgPSBvcmdhbml6YXRpb24ucm93V2lkdGhbcm93SW5kZXhdICsgbm9kZS5yZWN0LndpZHRoO1xuXG4gIGlmIChvcmdhbml6YXRpb24ucm93c1tyb3dJbmRleF0ubGVuZ3RoID4gMCkge1xuICAgIHcgKz0gb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nO1xuICB9XG5cbiAgb3JnYW5pemF0aW9uLnJvd1dpZHRoW3Jvd0luZGV4XSA9IHc7XG4gIC8vIFVwZGF0ZSBjb21wb3VuZCB3aWR0aFxuICBpZiAob3JnYW5pemF0aW9uLndpZHRoIDwgdykge1xuICAgIG9yZ2FuaXphdGlvbi53aWR0aCA9IHc7XG4gIH1cblxuICAvLyBVcGRhdGUgaGVpZ2h0XG4gIHZhciBoID0gbm9kZS5yZWN0LmhlaWdodDtcbiAgaWYgKHJvd0luZGV4ID4gMClcbiAgICBoICs9IG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmc7XG5cbiAgdmFyIGV4dHJhSGVpZ2h0ID0gMDtcbiAgaWYgKGggPiBvcmdhbml6YXRpb24ucm93SGVpZ2h0W3Jvd0luZGV4XSkge1xuICAgIGV4dHJhSGVpZ2h0ID0gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtyb3dJbmRleF07XG4gICAgb3JnYW5pemF0aW9uLnJvd0hlaWdodFtyb3dJbmRleF0gPSBoO1xuICAgIGV4dHJhSGVpZ2h0ID0gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtyb3dJbmRleF0gLSBleHRyYUhlaWdodDtcbiAgfVxuXG4gIG9yZ2FuaXphdGlvbi5oZWlnaHQgKz0gZXh0cmFIZWlnaHQ7XG5cbiAgLy8gSW5zZXJ0IG5vZGVcbiAgb3JnYW5pemF0aW9uLnJvd3Nbcm93SW5kZXhdLnB1c2gobm9kZSk7XG59O1xuXG4vL1NjYW5zIHRoZSByb3dzIG9mIGFuIG9yZ2FuaXphdGlvbiBhbmQgcmV0dXJucyB0aGUgb25lIHdpdGggdGhlIG1pbiB3aWR0aFxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0U2hvcnRlc3RSb3dJbmRleCA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24pIHtcbiAgdmFyIHIgPSAtMTtcbiAgdmFyIG1pbiA9IE51bWJlci5NQVhfVkFMVUU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmdhbml6YXRpb24ucm93cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcmdhbml6YXRpb24ucm93V2lkdGhbaV0gPCBtaW4pIHtcbiAgICAgIHIgPSBpO1xuICAgICAgbWluID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cbi8vU2NhbnMgdGhlIHJvd3Mgb2YgYW4gb3JnYW5pemF0aW9uIGFuZCByZXR1cm5zIHRoZSBvbmUgd2l0aCB0aGUgbWF4IHdpZHRoXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRMb25nZXN0Um93SW5kZXggPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uKSB7XG4gIHZhciByID0gLTE7XG4gIHZhciBtYXggPSBOdW1iZXIuTUlOX1ZBTFVFO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoOyBpKyspIHtcblxuICAgIGlmIChvcmdhbml6YXRpb24ucm93V2lkdGhbaV0gPiBtYXgpIHtcbiAgICAgIHIgPSBpO1xuICAgICAgbWF4ID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2ldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByO1xufTtcblxuLyoqXG4qIFRoaXMgbWV0aG9kIGNoZWNrcyB3aGV0aGVyIGFkZGluZyBleHRyYSB3aWR0aCB0byB0aGUgb3JnYW5pemF0aW9uIHZpb2xhdGVzXG4qIHRoZSBhc3BlY3QgcmF0aW8oMSkgb3Igbm90LlxuKi9cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbkFkZEhvcml6b250YWwgPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uLCBleHRyYVdpZHRoLCBleHRyYUhlaWdodCkge1xuXG4gIHZhciBzcmkgPSB0aGlzLmdldFNob3J0ZXN0Um93SW5kZXgob3JnYW5pemF0aW9uKTtcblxuICBpZiAoc3JpIDwgMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG1pbiA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtzcmldO1xuXG4gIGlmIChtaW4gKyBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmcgKyBleHRyYVdpZHRoIDw9IG9yZ2FuaXphdGlvbi53aWR0aClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB2YXIgaERpZmYgPSAwO1xuXG4gIC8vIEFkZGluZyB0byBhbiBleGlzdGluZyByb3dcbiAgaWYgKG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbc3JpXSA8IGV4dHJhSGVpZ2h0KSB7XG4gICAgaWYgKHNyaSA+IDApXG4gICAgICBoRGlmZiA9IGV4dHJhSGVpZ2h0ICsgb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZyAtIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbc3JpXTtcbiAgfVxuXG4gIHZhciBhZGRfdG9fcm93X3JhdGlvO1xuICBpZiAob3JnYW5pemF0aW9uLndpZHRoIC0gbWluID49IGV4dHJhV2lkdGggKyBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmcpIHtcbiAgICBhZGRfdG9fcm93X3JhdGlvID0gKG9yZ2FuaXphdGlvbi5oZWlnaHQgKyBoRGlmZikgLyAobWluICsgZXh0cmFXaWR0aCArIG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZyk7XG4gIH0gZWxzZSB7XG4gICAgYWRkX3RvX3Jvd19yYXRpbyA9IChvcmdhbml6YXRpb24uaGVpZ2h0ICsgaERpZmYpIC8gb3JnYW5pemF0aW9uLndpZHRoO1xuICB9XG5cbiAgLy8gQWRkaW5nIGEgbmV3IHJvdyBmb3IgdGhpcyBub2RlXG4gIGhEaWZmID0gZXh0cmFIZWlnaHQgKyBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nO1xuICB2YXIgYWRkX25ld19yb3dfcmF0aW87XG4gIGlmIChvcmdhbml6YXRpb24ud2lkdGggPCBleHRyYVdpZHRoKSB7XG4gICAgYWRkX25ld19yb3dfcmF0aW8gPSAob3JnYW5pemF0aW9uLmhlaWdodCArIGhEaWZmKSAvIGV4dHJhV2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgYWRkX25ld19yb3dfcmF0aW8gPSAob3JnYW5pemF0aW9uLmhlaWdodCArIGhEaWZmKSAvIG9yZ2FuaXphdGlvbi53aWR0aDtcbiAgfVxuXG4gIGlmIChhZGRfbmV3X3Jvd19yYXRpbyA8IDEpXG4gICAgYWRkX25ld19yb3dfcmF0aW8gPSAxIC8gYWRkX25ld19yb3dfcmF0aW87XG5cbiAgaWYgKGFkZF90b19yb3dfcmF0aW8gPCAxKVxuICAgIGFkZF90b19yb3dfcmF0aW8gPSAxIC8gYWRkX3RvX3Jvd19yYXRpbztcblxuICByZXR1cm4gYWRkX3RvX3Jvd19yYXRpbyA8IGFkZF9uZXdfcm93X3JhdGlvO1xufTtcblxuLy9JZiBtb3ZpbmcgdGhlIGxhc3Qgbm9kZSBmcm9tIHRoZSBsb25nZXN0IHJvdyBhbmQgYWRkaW5nIGl0IHRvIHRoZSBsYXN0XG4vL3JvdyBtYWtlcyB0aGUgYm91bmRpbmcgYm94IHNtYWxsZXIsIGRvIGl0LlxuQ29TRUxheW91dC5wcm90b3R5cGUuc2hpZnRUb0xhc3RSb3cgPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uKSB7XG4gIHZhciBsb25nZXN0ID0gdGhpcy5nZXRMb25nZXN0Um93SW5kZXgob3JnYW5pemF0aW9uKTtcbiAgdmFyIGxhc3QgPSBvcmdhbml6YXRpb24ucm93V2lkdGgubGVuZ3RoIC0gMTtcbiAgdmFyIHJvdyA9IG9yZ2FuaXphdGlvbi5yb3dzW2xvbmdlc3RdO1xuICB2YXIgbm9kZSA9IHJvd1tyb3cubGVuZ3RoIC0gMV07XG5cbiAgdmFyIGRpZmYgPSBub2RlLndpZHRoICsgb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nO1xuXG4gIC8vIENoZWNrIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBvbiB0aGUgbGFzdCByb3dcbiAgaWYgKG9yZ2FuaXphdGlvbi53aWR0aCAtIG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtsYXN0XSA+IGRpZmYgJiYgbG9uZ2VzdCAhPSBsYXN0KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGxvbmdlc3Qgcm93XG4gICAgcm93LnNwbGljZSgtMSwgMSk7XG5cbiAgICAvLyBQdXNoIGl0IHRvIHRoZSBsYXN0IHJvd1xuICAgIG9yZ2FuaXphdGlvbi5yb3dzW2xhc3RdLnB1c2gobm9kZSk7XG5cbiAgICBvcmdhbml6YXRpb24ucm93V2lkdGhbbG9uZ2VzdF0gPSBvcmdhbml6YXRpb24ucm93V2lkdGhbbG9uZ2VzdF0gLSBkaWZmO1xuICAgIG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtsYXN0XSA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtsYXN0XSArIGRpZmY7XG4gICAgb3JnYW5pemF0aW9uLndpZHRoID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2luc3RhbmNlLmdldExvbmdlc3RSb3dJbmRleChvcmdhbml6YXRpb24pXTtcblxuICAgIC8vIFVwZGF0ZSBoZWlnaHRzIG9mIHRoZSBvcmdhbml6YXRpb25cbiAgICB2YXIgbWF4SGVpZ2h0ID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvdy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJvd1tpXS5oZWlnaHQgPiBtYXhIZWlnaHQpXG4gICAgICAgIG1heEhlaWdodCA9IHJvd1tpXS5oZWlnaHQ7XG4gICAgfVxuICAgIGlmIChsb25nZXN0ID4gMClcbiAgICAgIG1heEhlaWdodCArPSBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nO1xuXG4gICAgdmFyIHByZXZUb3RhbCA9IG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbG9uZ2VzdF0gKyBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xhc3RdO1xuXG4gICAgb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsb25nZXN0XSA9IG1heEhlaWdodDtcbiAgICBpZiAob3JnYW5pemF0aW9uLnJvd0hlaWdodFtsYXN0XSA8IG5vZGUuaGVpZ2h0ICsgb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZylcbiAgICAgIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbGFzdF0gPSBub2RlLmhlaWdodCArIG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmc7XG5cbiAgICB2YXIgZmluYWxUb3RhbCA9IG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbG9uZ2VzdF0gKyBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xhc3RdO1xuICAgIG9yZ2FuaXphdGlvbi5oZWlnaHQgKz0gKGZpbmFsVG90YWwgLSBwcmV2VG90YWwpO1xuXG4gICAgdGhpcy5zaGlmdFRvTGFzdFJvdyhvcmdhbml6YXRpb24pO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS50aWxpbmdQcmVMYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKENvU0VDb25zdGFudHMuVElMRSkge1xuICAgIC8vIEZpbmQgemVybyBkZWdyZWUgbm9kZXMgYW5kIGNyZWF0ZSBhIGNvbXBvdW5kIGZvciBlYWNoIGxldmVsXG4gICAgdGhpcy5ncm91cFplcm9EZWdyZWVNZW1iZXJzKCk7XG4gICAgLy8gVGlsZSBhbmQgY2xlYXIgY2hpbGRyZW4gb2YgZWFjaCBjb21wb3VuZFxuICAgIHRoaXMuY2xlYXJDb21wb3VuZHMoKTtcbiAgICAvLyBTZXBhcmF0ZWx5IHRpbGUgYW5kIGNsZWFyIHplcm8gZGVncmVlIG5vZGVzIGZvciBlYWNoIGxldmVsXG4gICAgdGhpcy5jbGVhclplcm9EZWdyZWVNZW1iZXJzKCk7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnRpbGluZ1Bvc3RMYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKENvU0VDb25zdGFudHMuVElMRSkge1xuICAgIHRoaXMucmVwb3B1bGF0ZVplcm9EZWdyZWVNZW1iZXJzKCk7XG4gICAgdGhpcy5yZXBvcHVsYXRlQ29tcG91bmRzKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRUxheW91dDtcbiIsInZhciBGRExheW91dE5vZGUgPSByZXF1aXJlKCcuL0ZETGF5b3V0Tm9kZScpO1xudmFyIElNYXRoID0gcmVxdWlyZSgnLi9JTWF0aCcpO1xuXG5mdW5jdGlvbiBDb1NFTm9kZShnbSwgbG9jLCBzaXplLCB2Tm9kZSkge1xuICBGRExheW91dE5vZGUuY2FsbCh0aGlzLCBnbSwgbG9jLCBzaXplLCB2Tm9kZSk7XG59XG5cblxuQ29TRU5vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGRExheW91dE5vZGUucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXROb2RlKSB7XG4gIENvU0VOb2RlW3Byb3BdID0gRkRMYXlvdXROb2RlW3Byb3BdO1xufVxuXG5Db1NFTm9kZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBsYXlvdXQgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRMYXlvdXQoKTtcbiAgdGhpcy5kaXNwbGFjZW1lbnRYID0gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKlxuICAgICAgICAgICh0aGlzLnNwcmluZ0ZvcmNlWCArIHRoaXMucmVwdWxzaW9uRm9yY2VYICsgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWCkgLyB0aGlzLm5vT2ZDaGlsZHJlbjtcbiAgdGhpcy5kaXNwbGFjZW1lbnRZID0gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKlxuICAgICAgICAgICh0aGlzLnNwcmluZ0ZvcmNlWSArIHRoaXMucmVwdWxzaW9uRm9yY2VZICsgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWSkgLyB0aGlzLm5vT2ZDaGlsZHJlbjtcblxuXG4gIGlmIChNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFgpID4gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudClcbiAge1xuICAgIHRoaXMuZGlzcGxhY2VtZW50WCA9IGxheW91dC5jb29saW5nRmFjdG9yICogbGF5b3V0Lm1heE5vZGVEaXNwbGFjZW1lbnQgKlxuICAgICAgICAgICAgSU1hdGguc2lnbih0aGlzLmRpc3BsYWNlbWVudFgpO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMuZGlzcGxhY2VtZW50WSkgPiBsYXlvdXQuY29vbGluZ0ZhY3RvciAqIGxheW91dC5tYXhOb2RlRGlzcGxhY2VtZW50KVxuICB7XG4gICAgdGhpcy5kaXNwbGFjZW1lbnRZID0gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudCAqXG4gICAgICAgICAgICBJTWF0aC5zaWduKHRoaXMuZGlzcGxhY2VtZW50WSk7XG4gIH1cblxuICAvLyBhIHNpbXBsZSBub2RlLCBqdXN0IG1vdmUgaXRcbiAgaWYgKHRoaXMuY2hpbGQgPT0gbnVsbClcbiAge1xuICAgIHRoaXMubW92ZUJ5KHRoaXMuZGlzcGxhY2VtZW50WCwgdGhpcy5kaXNwbGFjZW1lbnRZKTtcbiAgfVxuICAvLyBhbiBlbXB0eSBjb21wb3VuZCBub2RlLCBhZ2FpbiBqdXN0IG1vdmUgaXRcbiAgZWxzZSBpZiAodGhpcy5jaGlsZC5nZXROb2RlcygpLmxlbmd0aCA9PSAwKVxuICB7XG4gICAgdGhpcy5tb3ZlQnkodGhpcy5kaXNwbGFjZW1lbnRYLCB0aGlzLmRpc3BsYWNlbWVudFkpO1xuICB9XG4gIC8vIG5vbi1lbXB0eSBjb21wb3VuZCBub2RlLCBwcm9wb2dhdGUgbW92ZW1lbnQgdG8gY2hpbGRyZW4gYXMgd2VsbFxuICBlbHNlXG4gIHtcbiAgICB0aGlzLnByb3BvZ2F0ZURpc3BsYWNlbWVudFRvQ2hpbGRyZW4odGhpcy5kaXNwbGFjZW1lbnRYLFxuICAgICAgICAgICAgdGhpcy5kaXNwbGFjZW1lbnRZKTtcbiAgfVxuXG4gIGxheW91dC50b3RhbERpc3BsYWNlbWVudCArPVxuICAgICAgICAgIE1hdGguYWJzKHRoaXMuZGlzcGxhY2VtZW50WCkgKyBNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFkpO1xuICAgICAgXG4gIHZhciBub2RlRGF0YSA9IHtcbiAgICBzcHJpbmdGb3JjZVg6IHRoaXMuc3ByaW5nRm9yY2VYLFxuICAgIHNwcmluZ0ZvcmNlWTogdGhpcy5zcHJpbmdGb3JjZVksXG4gICAgcmVwdWxzaW9uRm9yY2VYOiB0aGlzLnJlcHVsc2lvbkZvcmNlWCxcbiAgICByZXB1bHNpb25Gb3JjZVk6IHRoaXMucmVwdWxzaW9uRm9yY2VZLFxuICAgIGdyYXZpdGF0aW9uRm9yY2VYOiB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYLFxuICAgIGdyYXZpdGF0aW9uRm9yY2VZOiB0aGlzLmdyYXZpdGF0aW9uRm9yY2VZLFxuICAgIGRpc3BsYWNlbWVudFg6IHRoaXMuZGlzcGxhY2VtZW50WCxcbiAgICBkaXNwbGFjZW1lbnRZOiB0aGlzLmRpc3BsYWNlbWVudFlcbiAgfTtcbiAgXG4gIHRoaXMuc3ByaW5nRm9yY2VYID0gMDtcbiAgdGhpcy5zcHJpbmdGb3JjZVkgPSAwO1xuICB0aGlzLnJlcHVsc2lvbkZvcmNlWCA9IDA7XG4gIHRoaXMucmVwdWxzaW9uRm9yY2VZID0gMDtcbiAgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWCA9IDA7XG4gIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVkgPSAwO1xuICB0aGlzLmRpc3BsYWNlbWVudFggPSAwO1xuICB0aGlzLmRpc3BsYWNlbWVudFkgPSAwO1xuICBcbiAgcmV0dXJuIG5vZGVEYXRhO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLnByb3BvZ2F0ZURpc3BsYWNlbWVudFRvQ2hpbGRyZW4gPSBmdW5jdGlvbiAoZFgsIGRZKVxue1xuICB2YXIgbm9kZXMgPSB0aGlzLmdldENoaWxkKCkuZ2V0Tm9kZXMoKTtcbiAgdmFyIG5vZGU7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKG5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKVxuICAgIHtcbiAgICAgIG5vZGUubW92ZUJ5KGRYLCBkWSk7XG4gICAgICBub2RlLmRpc3BsYWNlbWVudFggKz0gZFg7XG4gICAgICBub2RlLmRpc3BsYWNlbWVudFkgKz0gZFk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBub2RlLnByb3BvZ2F0ZURpc3BsYWNlbWVudFRvQ2hpbGRyZW4oZFgsIGRZKTtcbiAgICB9XG4gIH1cbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5zZXRQcmVkMSA9IGZ1bmN0aW9uIChwcmVkMSlcbntcbiAgdGhpcy5wcmVkMSA9IHByZWQxO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLmdldFByZWQxID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucHJlZDE7XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUuc2V0UHJlZDIgPSBmdW5jdGlvbiAocHJlZDIpXG57XG4gIHRoaXMucHJlZDIgPSBwcmVkMjtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5nZXRQcmVkMiA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnByZWQyO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLnNldE5leHQgPSBmdW5jdGlvbiAobmV4dClcbntcbiAgdGhpcy5uZXh0ID0gbmV4dDtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5nZXROZXh0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubmV4dDtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5zZXRQcm9jZXNzZWQgPSBmdW5jdGlvbiAocHJvY2Vzc2VkKVxue1xuICB0aGlzLnByb2Nlc3NlZCA9IHByb2Nlc3NlZDtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5pc1Byb2Nlc3NlZCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnByb2Nlc3NlZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRU5vZGU7XG4iLCJ2YXIgQ29TRUVkZ2UgPSByZXF1aXJlKCcuL0NvU0VFZGdlJyk7XG5cbmZ1bmN0aW9uIENvYXJzZW5pbmdFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xuICBDb1NFRWRnZS5jYWxsKHRoaXMsIHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSk7XG59XG5cbkNvYXJzZW5pbmdFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29TRUVkZ2UucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gQ29TRUVkZ2UpIHtcbiAgQ29hcnNlbmluZ0VkZ2VbcHJvcF0gPSBDb1NFRWRnZVtwcm9wXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2Fyc2VuaW5nRWRnZTsiLCJ2YXIgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTtcbnZhciBDb2Fyc2VuaW5nTm9kZSA9IHJlcXVpcmUoJy4vQ29hcnNlbmluZ05vZGUnKTtcbnZhciBDb2Fyc2VuaW5nRWRnZSA9IHJlcXVpcmUoJy4vQ29hcnNlbmluZ0VkZ2UnKTtcblxuZnVuY3Rpb24gQ29hcnNlbmluZ0dyYXBoKHBhcmVudCwgbGF5b3V0LCB2R3JhcGgpIHtcbiAgXG4gIGlmKGxheW91dCA9PSBudWxsICYmIHZHcmFwaCA9PSBudWxsKVxuICB7XG4gICAgbGF5b3V0ID0gcGFyZW50O1xuICAgIExHcmFwaC5jYWxsKHRoaXMsIG51bGwsIGxheW91dCwgbnVsbCk7XG4gICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgTEdyYXBoLmNhbGwodGhpcywgcGFyZW50LCBsYXlvdXQsIHZHcmFwaCk7XG4gIH1cbn1cblxuQ29hcnNlbmluZ0dyYXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoLnByb3RvdHlwZSk7XG5mb3IgKHZhciBwcm9wIGluIExHcmFwaCkge1xuICBDb2Fyc2VuaW5nR3JhcGhbcHJvcF0gPSBMR3JhcGhbcHJvcF07XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY29hcnNlbnMgR2kgdG8gR2krMVxuICovXG5Db2Fyc2VuaW5nR3JhcGgucHJvdG90eXBlLmNvYXJzZW4gPSBmdW5jdGlvbigpXG57XG4gIHRoaXMudW5tYXRjaEFsbCgpO1xuICB2YXIgdiwgdTtcbiAgXG4gIGlmKHRoaXMuZ2V0Tm9kZXMoKS5sZW5ndGggPiAwKVxuICB7ICBcbiAgICAvLyBtYXRjaCBlYWNoIG5vZGUgd2l0aCB0aGUgb25lIG9mIHRoZSB1bm1hdGNoZWQgbmVpZ2hib3JzIGhhcyBtaW5pbXVtIHdlaWdodFxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIHVubWF0Y2hlZCBuZWlnaGJvciwgdGhlbiBtYXRjaCBjdXJyZW50IG5vZGUgd2l0aCBpdHNlbGYgICAgXG4gICAgd2hpbGUoISgodGhpcy5nZXROb2RlcygpWzBdLmlzTWF0Y2hlZCgpKSkpXG4gICAge1xuICAgICAgLy8gZ2V0IGFuIHVubWF0Y2hlZCBub2RlICh2KSBhbmQgKGlmIGV4aXN0cykgbWF0Y2hpbmcgb2YgaXQgKHUpLlxuICAgICAgdiA9IHRoaXMuZ2V0Tm9kZXMoKVswXTsgIC8vT3B0aW1pemVcbiAgICAgIHUgPSB2LmdldE1hdGNoaW5nKCk7XG4gICAgICBcbiAgICAgIC8vIG5vZGUgdCBpcyBjb25zdHJ1Y3RlZCBieSBjb250cmFjdGluZyB1IGFuZCB2XG4gICAgICB0aGlzLmNvbnRyYWN0KCB2LCB1ICk7XG4gICAgfVxuICAgIFxuICAgIHZhciBub2RlcyA9IHRoaXMuZ2V0Tm9kZXMoKTtcbiAgICBcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgdmFyIHkgPSBub2Rlc1tpXTtcbiAgICAgIFxuICAgICAgLy8gbmV3IENvU0Ugbm9kZSB3aWxsIGJlIGluIE1pKzFcbiAgICAgIHZhciB6ID0gdGhpcy5sYXlvdXQubmV3Tm9kZShudWxsKTtcbiAgICAgIFxuICAgICAgei5zZXRQcmVkMSh5LmdldE5vZGUxKCkuZ2V0UmVmZXJlbmNlKCkpO1xuICAgICAgeS5nZXROb2RlMSgpLmdldFJlZmVyZW5jZSgpLnNldE5leHQoeik7XG4gICAgICBcbiAgICAgIC8vIGlmIGN1cnJlbnQgbm9kZSBpcyBub3QgbWF0Y2hlZCB3aXRoIGl0c2VsZlxuICAgICAgaWYoeS5nZXROb2RlMigpICE9IG51bGwpXG4gICAgICB7XG4gICAgICAgIHouc2V0UHJlZDIoeS5nZXROb2RlMigpLmdldFJlZmVyZW5jZSgpKTtcbiAgICAgICAgeS5nZXROb2RlMigpLmdldFJlZmVyZW5jZSgpLnNldE5leHQoeik7ICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICAgICAgeS5zZXRSZWZlcmVuY2Uoeik7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHVuZmxhZ3MgYWxsIG5vZGVzIGFzIHVubWF0Y2hlZFxuICogaXQgc2hvdWxkIGJlIGNhbGxlZCBiZWZvcmUgZWFjaCBjb2Fyc2VuaW5nIHByb2Nlc3NcbiAqL1xuQ29hcnNlbmluZ0dyYXBoLnByb3RvdHlwZS51bm1hdGNoQWxsID0gZnVuY3Rpb24oKVxue1xuICB2YXIgbm9kZTtcbiAgdmFyIG5vZGVzID0gdGhpcy5nZXROb2RlcygpO1xuICBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgbm9kZS5zZXRNYXRjaGVkKGZhbHNlKTtcbiAgfVxufTtcblxuLyoqXG4qIFRoaXMgbWV0aG9kIGNvbnRyYWN0cyB2IGFuZCB1XG4qL1xuQ29hcnNlbmluZ0dyYXBoLnByb3RvdHlwZS5jb250cmFjdCA9IGZ1bmN0aW9uKHYsIHUpXG57XG4gIC8vIHQgd2lsbCBiZSBjb25zdHJ1Y3RlZCBieSBjb250cmFjdGluZyB2IGFuZCB1XHRcbiAgdmFyIHQgPSBuZXcgQ29hcnNlbmluZ05vZGUoKTtcbiAgdGhpcy5hZGQodCk7IC8vQ2hlY2sgdGhpc1xuICBcbiAgdC5zZXROb2RlMSggdiApO1xuICBcbiAgdmFyIG5laWdoYm9yc0xpc3QgPSB2LmdldE5laWdoYm9yc0xpc3QoKTtcbi8vICBPYmplY3Qua2V5cyhuZWlnaGJvcnNMaXN0LnNldCkuZm9yRWFjaChmdW5jdGlvbihub2RlSWQpe1xuLy8gICAgdmFyIHggPSBuZWlnaGJvcnNMaXN0LnNldFtub2RlSWRdO1xuLy8gICAgaWYoeCAhPSB0KVxuLy8gICAge1xuLy8gICAgICB0aGlzLmFkZCggbmV3IENvYXJzZW5pbmdFZGdlKCksIHQsIHggKTtcbi8vICAgIH1cbi8vICB9KTtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhuZWlnaGJvcnNMaXN0LnNldCk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciB4ID0gbmVpZ2hib3JzTGlzdC5zZXRba2V5c1tpXV07XG4gICAgaWYoeCAhPSB0KVxuICAgIHtcbiAgICAgIHRoaXMuYWRkKCBuZXcgQ29hcnNlbmluZ0VkZ2UoKSwgdCwgeCApO1xuICAgIH1cbiAgfVxuICBcbiAgdC5zZXRXZWlnaHQodi5nZXRXZWlnaHQoKSk7XG4gIFxuICAvL3JlbW92ZSBjb250cmFjdGVkIG5vZGUgZnJvbSB0aGUgZ3JhcGhcbiAgdGhpcy5yZW1vdmUodik7XG5cbiAgLy8gaWYgdiBoYXMgYW4gdW5tYXRjaGVkIG5laWdoYm9yLCB0aGVuIHUgaXMgbm90IG51bGwgYW5kIHQubm9kZTIgPSB1XG4gIC8vIG90aGVyd2lzZSwgbGVhdmUgdC5ub2RlMiBhcyBudWxsXG4gIGlmKHUgIT0gbnVsbClcbiAge1xuICAgIHQuc2V0Tm9kZTIodSk7XG4vLyAgICB2YXIgbmVpZ2hib3JzTGlzdDIgPSB1LmdldE5laWdoYm9yc0xpc3QoKTtcbi8vICAgIE9iamVjdC5rZXlzKG5laWdoYm9yc0xpc3QyLnNldCkuZm9yRWFjaChmdW5jdGlvbihub2RlSWQpe1xuLy8gICAgICB2YXIgeCA9IG5laWdoYm9yc0xpc3QyLnNldFtub2RlSWRdO1xuLy8gICAgICBpZih4ICE9IHQpXG4vLyAgICAgIHtcbi8vICAgICAgICB0aGlzLmFkZChuZXcgQ29hcnNlbmluZ0VkZ2UoKSwgdCwgeCk7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuICAgIHZhciBuZWlnaGJvcnNMaXN0ID0gdS5nZXROZWlnaGJvcnNMaXN0KCk7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhuZWlnaGJvcnNMaXN0LnNldCk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB4ID0gbmVpZ2hib3JzTGlzdC5zZXRba2V5c1tpXV07XG4gICAgICBpZih4ICE9IHQpXG4gICAgICB7XG4gICAgICAgIHRoaXMuYWRkKCBuZXcgQ29hcnNlbmluZ0VkZ2UoKSwgdCwgeCApO1xuICAgICAgfVxuICAgIH1cbiAgICB0LnNldFdlaWdodCh0LmdldFdlaWdodCgpICsgdS5nZXRXZWlnaHQoKSk7XG4gICAgXG4gICAgLy9yZW1vdmUgY29udHJhY3RlZCBub2RlIGZyb20gdGhlIGdyYXBoXG4gICAgdGhpcy5yZW1vdmUodSk7XG4gIH1cbiAgXG4gIC8vIHQgc2hvdWxkIGJlIGZsYWdnZWQgYXMgbWF0Y2hlZFxuICB0LnNldE1hdGNoZWQoIHRydWUgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29hcnNlbmluZ0dyYXBoO1xuXG4iLCJ2YXIgTE5vZGUgPSByZXF1aXJlKCcuL0xOb2RlJyk7XG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xuXG5mdW5jdGlvbiBDb2Fyc2VuaW5nTm9kZShnbSwgdk5vZGUpIHtcbiAgaWYoZ20gPT0gbnVsbCAmJiB2Tm9kZSA9PSBudWxsKXtcbiAgICBMTm9kZS5jYWxsKHRoaXMsIG51bGwsIG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIExOb2RlLmNhbGwodGhpcywgZ20sIHZOb2RlKTtcbiAgfVxuICB0aGlzLndlaWdodCA9IDE7XG59XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTE5vZGUucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTE5vZGUpIHtcbiAgQ29hcnNlbmluZ05vZGVbcHJvcF0gPSBMTm9kZVtwcm9wXTtcbn1cblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLnNldE1hdGNoZWQgPSBmdW5jdGlvbihtYXRjaGVkKVxue1xuICB0aGlzLm1hdGNoZWQgPSBtYXRjaGVkO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLmlzTWF0Y2hlZCA9IGZ1bmN0aW9uKClcbntcbiAgcmV0dXJuIHRoaXMubWF0Y2hlZDtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5nZXRXZWlnaHQgPSBmdW5jdGlvbigpXG57XG4gIHJldHVybiB0aGlzLndlaWdodDtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5zZXRXZWlnaHQgPSBmdW5jdGlvbih3ZWlnaHQpXG57XG4gIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLmdldE5vZGUxID0gZnVuY3Rpb24oKVxue1xuICByZXR1cm4gdGhpcy5ub2RlMTtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5zZXROb2RlMSA9IGZ1bmN0aW9uKG5vZGUxKVxue1xuICB0aGlzLm5vZGUxID0gbm9kZTE7XG59O1xuXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuZ2V0Tm9kZTIgPSBmdW5jdGlvbigpXG57XG4gIHJldHVybiB0aGlzLm5vZGUyO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLnNldE5vZGUyID0gZnVuY3Rpb24obm9kZTIpXG57XG4gIHRoaXMubm9kZTIgPSBub2RlMjtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5nZXRSZWZlcmVuY2UgPSBmdW5jdGlvbigpXG57XG4gIHJldHVybiB0aGlzLnJlZmVyZW5jZTtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5zZXRSZWZlcmVuY2UgPSBmdW5jdGlvbihyZWZlcmVuY2UpXG57XG4gIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBtYXRjaGluZyBvZiB0aGlzIG5vZGVcbiAqIGlmIHRoaXMgbm9kZSBkb2VzIG5vdCBoYXZlIGFueSB1bm1hY3RoZWQgbmVpZ2hib3IgdGhlbiByZXR1cm5zIG51bGxcbiAqL1xuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLmdldE1hdGNoaW5nID0gZnVuY3Rpb24oKVxue1xuICB2YXIgbWluV2VpZ2h0ZWQgPSBudWxsO1xuICB2YXIgbWluV2VpZ2h0ID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIFxuICB2YXIgbmVpZ2hib3JzTGlzdCA9IHRoaXMuZ2V0TmVpZ2hib3JzTGlzdCgpOyBcbiAgXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMobmVpZ2hib3JzTGlzdC5zZXQpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHsgXG4vLyAgT2JqZWN0LmtleXMobmVpZ2hib3JzTGlzdC5zZXQpLmZvckVhY2goZnVuY3Rpb24obm9kZUlkKXtcbiAgICB2YXIgdiA9IG5laWdoYm9yc0xpc3Quc2V0W2tleXNbaV1dOyBcbiAgICBcbiAgICBpZigoIXYuaXNNYXRjaGVkKCkpICYmICh2ICE9IHRoaXMpICYmICh2LmdldFdlaWdodCgpIDwgbWluV2VpZ2h0KSlcbiAgICB7XG4gICAgICBtaW5XZWlnaHRlZCA9IHY7XG4gICAgICBtaW5XZWlnaHQgPSB2LmdldFdlaWdodCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbWluV2VpZ2h0ZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvYXJzZW5pbmdOb2RlO1xuIiwiZnVuY3Rpb24gRGltZW5zaW9uRCh3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMud2lkdGggPSAwO1xuICB0aGlzLmhlaWdodCA9IDA7XG4gIGlmICh3aWR0aCAhPT0gbnVsbCAmJiBoZWlnaHQgIT09IG51bGwpIHtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gIH1cbn1cblxuRGltZW5zaW9uRC5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy53aWR0aDtcbn07XG5cbkRpbWVuc2lvbkQucHJvdG90eXBlLnNldFdpZHRoID0gZnVuY3Rpb24gKHdpZHRoKVxue1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG59O1xuXG5EaW1lbnNpb25ELnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5oZWlnaHQ7XG59O1xuXG5EaW1lbnNpb25ELnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0KVxue1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGltZW5zaW9uRDtcbiIsImZ1bmN0aW9uIEVtaXR0ZXIoKXtcbiAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbn1cblxudmFyIHAgPSBFbWl0dGVyLnByb3RvdHlwZTtcblxucC5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudCwgY2FsbGJhY2sgKXtcbiAgdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9KTtcbn07XG5cbnAucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiggZXZlbnQsIGNhbGxiYWNrICl7XG4gIGZvciggdmFyIGkgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkgPj0gMDsgaS0tICl7XG4gICAgdmFyIGwgPSB0aGlzLmxpc3RlbmVyc1tpXTtcblxuICAgIGlmKCBsLmV2ZW50ID09PSBldmVudCAmJiBsLmNhbGxiYWNrID09PSBjYWxsYmFjayApe1xuICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKCBpLCAxICk7XG4gICAgfVxuICB9XG59O1xuXG5wLmVtaXQgPSBmdW5jdGlvbiggZXZlbnQsIGRhdGEgKXtcbiAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKyApe1xuICAgIHZhciBsID0gdGhpcy5saXN0ZW5lcnNbaV07XG5cbiAgICBpZiggZXZlbnQgPT09IGwuZXZlbnQgKXtcbiAgICAgIGwuY2FsbGJhY2soIGRhdGEgKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcbiIsInZhciBMYXlvdXQgPSByZXF1aXJlKCcuL0xheW91dCcpO1xudmFyIEZETGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9GRExheW91dENvbnN0YW50cycpO1xudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG5cbmZ1bmN0aW9uIEZETGF5b3V0KCkge1xuICBMYXlvdXQuY2FsbCh0aGlzKTtcblxuICB0aGlzLnVzZVNtYXJ0SWRlYWxFZGdlTGVuZ3RoQ2FsY3VsYXRpb24gPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9JREVBTF9FREdFX0xFTkdUSF9DQUxDVUxBVElPTjtcbiAgdGhpcy5pZGVhbEVkZ2VMZW5ndGggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIO1xuICB0aGlzLnNwcmluZ0NvbnN0YW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9TUFJJTkdfU1RSRU5HVEg7XG4gIHRoaXMucmVwdWxzaW9uQ29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1JFUFVMU0lPTl9TVFJFTkdUSDtcbiAgdGhpcy5ncmF2aXR5Q29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEg7XG4gIHRoaXMuY29tcG91bmRHcmF2aXR5Q29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEg7XG4gIHRoaXMuZ3Jhdml0eVJhbmdlRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUjtcbiAgdGhpcy5jb21wb3VuZEdyYXZpdHlSYW5nZUZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XG4gIHRoaXMuZGlzcGxhY2VtZW50VGhyZXNob2xkUGVyTm9kZSA9ICgzLjAgKiBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIKSAvIDEwMDtcbiAgdGhpcy5jb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTDtcbiAgdGhpcy5pbml0aWFsQ29vbGluZ0ZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUw7XG4gIHRoaXMudG90YWxEaXNwbGFjZW1lbnQgPSAwLjA7XG4gIHRoaXMub2xkVG90YWxEaXNwbGFjZW1lbnQgPSAwLjA7XG4gIHRoaXMubWF4SXRlcmF0aW9ucyA9IEZETGF5b3V0Q29uc3RhbnRzLk1BWF9JVEVSQVRJT05TO1xufVxuXG5GRExheW91dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExheW91dC5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIExheW91dCkge1xuICBGRExheW91dFtwcm9wXSA9IExheW91dFtwcm9wXTtcbn1cblxuRkRMYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xuICBMYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzLmNhbGwodGhpcywgYXJndW1lbnRzKTtcblxuICBpZiAodGhpcy5sYXlvdXRRdWFsaXR5ID09IExheW91dENvbnN0YW50cy5EUkFGVF9RVUFMSVRZKVxuICB7XG4gICAgdGhpcy5kaXNwbGFjZW1lbnRUaHJlc2hvbGRQZXJOb2RlICs9IDAuMzA7XG4gICAgdGhpcy5tYXhJdGVyYXRpb25zICo9IDAuODtcbiAgfVxuICBlbHNlIGlmICh0aGlzLmxheW91dFF1YWxpdHkgPT0gTGF5b3V0Q29uc3RhbnRzLlBST09GX1FVQUxJVFkpXG4gIHtcbiAgICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgLT0gMC4zMDtcbiAgICB0aGlzLm1heEl0ZXJhdGlvbnMgKj0gMS4yO1xuICB9XG5cbiAgdGhpcy50b3RhbEl0ZXJhdGlvbnMgPSAwO1xuICB0aGlzLm5vdEFuaW1hdGVkSXRlcmF0aW9ucyA9IDA7XG5cbiAgdGhpcy51c2VGUkdyaWRWYXJpYW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfUkVQVUxTSU9OX1JBTkdFX0NBTENVTEFUSU9OO1xuICBcbiAgdGhpcy5ncmlkID0gW107XG4gIC8vIHZhcmlhYmxlcyBmb3IgdHJlZSByZWR1Y3Rpb24gc3VwcG9ydFxuICB0aGlzLnBydW5lZE5vZGVzQWxsID0gW107XG4gIHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zID0gMDtcbiAgdGhpcy5hZnRlckdyb3d0aEl0ZXJhdGlvbnMgPSAwO1xuICB0aGlzLmlzVHJlZUdyb3dpbmcgPSBmYWxzZTtcbiAgdGhpcy5pc0dyb3d0aEZpbmlzaGVkID0gZmFsc2U7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0lkZWFsRWRnZUxlbmd0aHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlZGdlO1xuICB2YXIgbGNhRGVwdGg7XG4gIHZhciBzb3VyY2U7XG4gIHZhciB0YXJnZXQ7XG4gIHZhciBzaXplT2ZTb3VyY2VJbkxjYTtcbiAgdmFyIHNpemVPZlRhcmdldEluTGNhO1xuXG4gIHZhciBhbGxFZGdlcyA9IHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0QWxsRWRnZXMoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIGVkZ2UgPSBhbGxFZGdlc1tpXTtcblxuICAgIGVkZ2UuaWRlYWxMZW5ndGggPSB0aGlzLmlkZWFsRWRnZUxlbmd0aDtcblxuICAgIGlmIChlZGdlLmlzSW50ZXJHcmFwaClcbiAgICB7XG4gICAgICBzb3VyY2UgPSBlZGdlLmdldFNvdXJjZSgpO1xuICAgICAgdGFyZ2V0ID0gZWRnZS5nZXRUYXJnZXQoKTtcblxuICAgICAgc2l6ZU9mU291cmNlSW5MY2EgPSBlZGdlLmdldFNvdXJjZUluTGNhKCkuZ2V0RXN0aW1hdGVkU2l6ZSgpO1xuICAgICAgc2l6ZU9mVGFyZ2V0SW5MY2EgPSBlZGdlLmdldFRhcmdldEluTGNhKCkuZ2V0RXN0aW1hdGVkU2l6ZSgpO1xuXG4gICAgICBpZiAodGhpcy51c2VTbWFydElkZWFsRWRnZUxlbmd0aENhbGN1bGF0aW9uKVxuICAgICAge1xuICAgICAgICBlZGdlLmlkZWFsTGVuZ3RoICs9IHNpemVPZlNvdXJjZUluTGNhICsgc2l6ZU9mVGFyZ2V0SW5MY2EgLVxuICAgICAgICAgICAgICAgIDIgKiBMYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRTtcbiAgICAgIH1cblxuICAgICAgbGNhRGVwdGggPSBlZGdlLmdldExjYSgpLmdldEluY2x1c2lvblRyZWVEZXB0aCgpO1xuXG4gICAgICBlZGdlLmlkZWFsTGVuZ3RoICs9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggKlxuICAgICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5QRVJfTEVWRUxfSURFQUxfRURHRV9MRU5HVEhfRkFDVE9SICpcbiAgICAgICAgICAgICAgKHNvdXJjZS5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKSArXG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmdldEluY2x1c2lvblRyZWVEZXB0aCgpIC0gMiAqIGxjYURlcHRoKTtcbiAgICB9XG4gIH1cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5pbml0U3ByaW5nRW1iZWRkZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKHRoaXMuaW5jcmVtZW50YWwpXG4gIHtcbiAgICB0aGlzLm1heE5vZGVEaXNwbGFjZW1lbnQgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UX0lOQ1JFTUVOVEFMO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRoaXMuY29vbGluZ0ZhY3RvciA9IDEuMDtcbiAgICB0aGlzLmluaXRpYWxDb29saW5nRmFjdG9yID0gMS4wO1xuICAgIHRoaXMubWF4Tm9kZURpc3BsYWNlbWVudCA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlQ7XG4gIH1cblxuICB0aGlzLm1heEl0ZXJhdGlvbnMgPVxuICAgICAgICAgIE1hdGgubWF4KHRoaXMuZ2V0QWxsTm9kZXMoKS5sZW5ndGggKiA1LCB0aGlzLm1heEl0ZXJhdGlvbnMpO1xuXG4gIHRoaXMudG90YWxEaXNwbGFjZW1lbnRUaHJlc2hvbGQgPVxuICAgICAgICAgIHRoaXMuZGlzcGxhY2VtZW50VGhyZXNob2xkUGVyTm9kZSAqIHRoaXMuZ2V0QWxsTm9kZXMoKS5sZW5ndGg7XG5cbiAgdGhpcy5yZXB1bHNpb25SYW5nZSA9IHRoaXMuY2FsY1JlcHVsc2lvblJhbmdlKCk7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1NwcmluZ0ZvcmNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxFZGdlcyA9IHRoaXMuZ2V0QWxsRWRnZXMoKTtcbiAgdmFyIGVkZ2U7XG4gIHZhciBlZGdlc0RhdGEgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxFZGdlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIGVkZ2UgPSBsRWRnZXNbaV07XG5cbiAgICBlZGdlc0RhdGFbaV0gPSB0aGlzLmNhbGNTcHJpbmdGb3JjZShlZGdlLCBlZGdlLmlkZWFsTGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZWRnZXNEYXRhO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNSZXB1bHNpb25Gb3JjZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpLCBqO1xuICB2YXIgbm9kZUEsIG5vZGVCO1xuICB2YXIgbE5vZGVzID0gdGhpcy5nZXRBbGxOb2RlcygpO1xuICB2YXIgcHJvY2Vzc2VkTm9kZVNldDtcblxuICBpZiAodGhpcy51c2VGUkdyaWRWYXJpYW50KVxuICB7ICAgICAgIFxuICAgIGlmICgodGhpcy50b3RhbEl0ZXJhdGlvbnMgJSBGRExheW91dENvbnN0YW50cy5HUklEX0NBTENVTEFUSU9OX0NIRUNLX1BFUklPRCA9PSAxICYmICF0aGlzLmlzVHJlZUdyb3dpbmcgJiYgIXRoaXMuaXNHcm93dGhGaW5pc2hlZCkpXG4gICAgeyAgICAgICBcbiAgICAgIHRoaXMudXBkYXRlR3JpZCgpOyAgXG4gICAgfVxuXG4gICAgcHJvY2Vzc2VkTm9kZVNldCA9IG5ldyBTZXQoKTtcbiAgICBcbiAgICAvLyBjYWxjdWxhdGUgcmVwdWxzaW9uIGZvcmNlcyBiZXR3ZWVuIGVhY2ggbm9kZXMgYW5kIGl0cyBzdXJyb3VuZGluZ1xuICAgIGZvciAoaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgbm9kZUEgPSBsTm9kZXNbaV07XG4gICAgICB0aGlzLmNhbGN1bGF0ZVJlcHVsc2lvbkZvcmNlT2ZBTm9kZShub2RlQSwgcHJvY2Vzc2VkTm9kZVNldCk7XG4gICAgICBwcm9jZXNzZWROb2RlU2V0LmFkZChub2RlQSk7XG4gICAgfVxuICB9XG4gIGVsc2VcbiAge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgbm9kZUEgPSBsTm9kZXNbaV07XG5cbiAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgbE5vZGVzLmxlbmd0aDsgaisrKVxuICAgICAge1xuICAgICAgICBub2RlQiA9IGxOb2Rlc1tqXTtcblxuICAgICAgICAvLyBJZiBib3RoIG5vZGVzIGFyZSBub3QgbWVtYmVycyBvZiB0aGUgc2FtZSBncmFwaCwgc2tpcC5cbiAgICAgICAgaWYgKG5vZGVBLmdldE93bmVyKCkgIT0gbm9kZUIuZ2V0T3duZXIoKSlcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjUmVwdWxzaW9uRm9yY2Uobm9kZUEsIG5vZGVCKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjR3Jhdml0YXRpb25hbEZvcmNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGU7XG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBub2RlID0gbE5vZGVzW2ldO1xuICAgIHRoaXMuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZShub2RlKTtcbiAgfVxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLm1vdmVOb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxOb2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXMoKTtcbiAgdmFyIG5vZGU7XG4gIHZhciBub2Rlc0RhdGEgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBub2RlID0gbE5vZGVzW2ldO1xuICAgIG5vZGVzRGF0YVtpXSA9IG5vZGUubW92ZSgpO1xuICB9XG4gIHJldHVybiBub2Rlc0RhdGE7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1NwcmluZ0ZvcmNlID0gZnVuY3Rpb24gKGVkZ2UsIGlkZWFsTGVuZ3RoKSB7XG4gIHZhciBzb3VyY2VOb2RlID0gZWRnZS5nZXRTb3VyY2UoKTtcbiAgdmFyIHRhcmdldE5vZGUgPSBlZGdlLmdldFRhcmdldCgpO1xuXG4gIHZhciBsZW5ndGg7XG4gIHZhciB4TGVuZ3RoO1xuICB2YXIgeUxlbmd0aDtcbiAgdmFyIHNwcmluZ0ZvcmNlO1xuICB2YXIgc3ByaW5nRm9yY2VYO1xuICB2YXIgc3ByaW5nRm9yY2VZO1xuXG4gIC8vIFVwZGF0ZSBlZGdlIGxlbmd0aFxuICBpZiAodGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyAmJlxuICAgICAgICAgIHNvdXJjZU5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsICYmIHRhcmdldE5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKVxuICB7XG4gICAgZWRnZS51cGRhdGVMZW5ndGhTaW1wbGUoKTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBlZGdlLnVwZGF0ZUxlbmd0aCgpO1xuXG4gICAgaWYgKGVkZ2UuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0KVxuICAgIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBsZW5ndGggPSBlZGdlLmdldExlbmd0aCgpO1xuICB4TGVuZ3RoID0gZWRnZS5sZW5ndGhYO1xuICB5TGVuZ3RoID0gZWRnZS5sZW5ndGhZO1xuXG4gIC8vIENhbGN1bGF0ZSBzcHJpbmcgZm9yY2VzXG4gIHNwcmluZ0ZvcmNlID0gdGhpcy5zcHJpbmdDb25zdGFudCAqIChsZW5ndGggLSBpZGVhbExlbmd0aCk7XG5cbiAgLy8gUHJvamVjdCBmb3JjZSBvbnRvIHggYW5kIHkgYXhlc1xuICBzcHJpbmdGb3JjZVggPSBzcHJpbmdGb3JjZSAqIChlZGdlLmxlbmd0aFggLyBsZW5ndGgpO1xuICBzcHJpbmdGb3JjZVkgPSBzcHJpbmdGb3JjZSAqIChlZGdlLmxlbmd0aFkgLyBsZW5ndGgpO1xuICBcbiAgLy8gQXBwbHkgZm9yY2VzIG9uIHRoZSBlbmQgbm9kZXNcbiAgc291cmNlTm9kZS5zcHJpbmdGb3JjZVggKz0gc3ByaW5nRm9yY2VYO1xuICBzb3VyY2VOb2RlLnNwcmluZ0ZvcmNlWSArPSBzcHJpbmdGb3JjZVk7XG4gIHRhcmdldE5vZGUuc3ByaW5nRm9yY2VYIC09IHNwcmluZ0ZvcmNlWDtcbiAgdGFyZ2V0Tm9kZS5zcHJpbmdGb3JjZVkgLT0gc3ByaW5nRm9yY2VZO1xuICBcbiAgdmFyIGVkZ2VEYXRhID0ge1xuICAgIHNvdXJjZTogc291cmNlTm9kZSxcbiAgICB0YXJnZXQ6IHRhcmdldE5vZGUsXG4gICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgeExlbmd0aDogeExlbmd0aCxcbiAgICB5TGVuZ3RoOiB5TGVuZ3RoXG4gIH07XG4gIFxuICByZXR1cm4gZWRnZURhdGE7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvbkZvcmNlID0gZnVuY3Rpb24gKG5vZGVBLCBub2RlQikge1xuICB2YXIgcmVjdEEgPSBub2RlQS5nZXRSZWN0KCk7XG4gIHZhciByZWN0QiA9IG5vZGVCLmdldFJlY3QoKTtcbiAgdmFyIG92ZXJsYXBBbW91bnQgPSBuZXcgQXJyYXkoMik7XG4gIHZhciBjbGlwUG9pbnRzID0gbmV3IEFycmF5KDQpO1xuICB2YXIgZGlzdGFuY2VYO1xuICB2YXIgZGlzdGFuY2VZO1xuICB2YXIgZGlzdGFuY2VTcXVhcmVkO1xuICB2YXIgZGlzdGFuY2U7XG4gIHZhciByZXB1bHNpb25Gb3JjZTtcbiAgdmFyIHJlcHVsc2lvbkZvcmNlWDtcbiAgdmFyIHJlcHVsc2lvbkZvcmNlWTtcblxuICBpZiAocmVjdEEuaW50ZXJzZWN0cyhyZWN0QikpLy8gdHdvIG5vZGVzIG92ZXJsYXBcbiAge1xuICAgIC8vIGNhbGN1bGF0ZSBzZXBhcmF0aW9uIGFtb3VudCBpbiB4IGFuZCB5IGRpcmVjdGlvbnNcbiAgICBJR2VvbWV0cnkuY2FsY1NlcGFyYXRpb25BbW91bnQocmVjdEEsXG4gICAgICAgICAgICByZWN0QixcbiAgICAgICAgICAgIG92ZXJsYXBBbW91bnQsXG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIIC8gMi4wKTtcblxuICAgIHJlcHVsc2lvbkZvcmNlWCA9IDIgKiBvdmVybGFwQW1vdW50WzBdO1xuICAgIHJlcHVsc2lvbkZvcmNlWSA9IDIgKiBvdmVybGFwQW1vdW50WzFdO1xuICAgIFxuICAgIHZhciBjaGlsZHJlbkNvbnN0YW50ID0gbm9kZUEubm9PZkNoaWxkcmVuICogbm9kZUIubm9PZkNoaWxkcmVuIC8gKG5vZGVBLm5vT2ZDaGlsZHJlbiArIG5vZGVCLm5vT2ZDaGlsZHJlbik7XG4gICAgXG4gICAgLy8gQXBwbHkgZm9yY2VzIG9uIHRoZSB0d28gbm9kZXNcbiAgICBub2RlQS5yZXB1bHNpb25Gb3JjZVggLT0gY2hpbGRyZW5Db25zdGFudCAqIHJlcHVsc2lvbkZvcmNlWDtcbiAgICBub2RlQS5yZXB1bHNpb25Gb3JjZVkgLT0gY2hpbGRyZW5Db25zdGFudCAqIHJlcHVsc2lvbkZvcmNlWTtcbiAgICBub2RlQi5yZXB1bHNpb25Gb3JjZVggKz0gY2hpbGRyZW5Db25zdGFudCAqIHJlcHVsc2lvbkZvcmNlWDtcbiAgICBub2RlQi5yZXB1bHNpb25Gb3JjZVkgKz0gY2hpbGRyZW5Db25zdGFudCAqIHJlcHVsc2lvbkZvcmNlWTtcbiAgfVxuICBlbHNlLy8gbm8gb3ZlcmxhcFxuICB7XG4gICAgLy8gY2FsY3VsYXRlIGRpc3RhbmNlXG5cbiAgICBpZiAodGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyAmJlxuICAgICAgICAgICAgbm9kZUEuZ2V0Q2hpbGQoKSA9PSBudWxsICYmIG5vZGVCLmdldENoaWxkKCkgPT0gbnVsbCkvLyBzaW1wbHkgYmFzZSByZXB1bHNpb24gb24gZGlzdGFuY2Ugb2Ygbm9kZSBjZW50ZXJzXG4gICAge1xuICAgICAgZGlzdGFuY2VYID0gcmVjdEIuZ2V0Q2VudGVyWCgpIC0gcmVjdEEuZ2V0Q2VudGVyWCgpO1xuICAgICAgZGlzdGFuY2VZID0gcmVjdEIuZ2V0Q2VudGVyWSgpIC0gcmVjdEEuZ2V0Q2VudGVyWSgpO1xuICAgIH1cbiAgICBlbHNlLy8gdXNlIGNsaXBwaW5nIHBvaW50c1xuICAgIHtcbiAgICAgIElHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24ocmVjdEEsIHJlY3RCLCBjbGlwUG9pbnRzKTtcblxuICAgICAgZGlzdGFuY2VYID0gY2xpcFBvaW50c1syXSAtIGNsaXBQb2ludHNbMF07XG4gICAgICBkaXN0YW5jZVkgPSBjbGlwUG9pbnRzWzNdIC0gY2xpcFBvaW50c1sxXTtcbiAgICB9XG5cbiAgICAvLyBObyByZXB1bHNpb24gcmFuZ2UuIEZSIGdyaWQgdmFyaWFudCBzaG91bGQgdGFrZSBjYXJlIG9mIHRoaXMuXG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlWCkgPCBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1QpXG4gICAge1xuICAgICAgZGlzdGFuY2VYID0gSU1hdGguc2lnbihkaXN0YW5jZVgpICpcbiAgICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUO1xuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZVkpIDwgRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUKVxuICAgIHtcbiAgICAgIGRpc3RhbmNlWSA9IElNYXRoLnNpZ24oZGlzdGFuY2VZKSAqXG4gICAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVDtcbiAgICB9XG5cbiAgICBkaXN0YW5jZVNxdWFyZWQgPSBkaXN0YW5jZVggKiBkaXN0YW5jZVggKyBkaXN0YW5jZVkgKiBkaXN0YW5jZVk7XG4gICAgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZGlzdGFuY2VTcXVhcmVkKTtcblxuICAgIHJlcHVsc2lvbkZvcmNlID0gdGhpcy5yZXB1bHNpb25Db25zdGFudCAqIG5vZGVBLm5vT2ZDaGlsZHJlbiAqIG5vZGVCLm5vT2ZDaGlsZHJlbiAvIGRpc3RhbmNlU3F1YXJlZDtcblxuICAgIC8vIFByb2plY3QgZm9yY2Ugb250byB4IGFuZCB5IGF4ZXNcbiAgICByZXB1bHNpb25Gb3JjZVggPSByZXB1bHNpb25Gb3JjZSAqIGRpc3RhbmNlWCAvIGRpc3RhbmNlO1xuICAgIHJlcHVsc2lvbkZvcmNlWSA9IHJlcHVsc2lvbkZvcmNlICogZGlzdGFuY2VZIC8gZGlzdGFuY2U7XG4gICAgIFxuICAgIC8vIEFwcGx5IGZvcmNlcyBvbiB0aGUgdHdvIG5vZGVzICAgIFxuICAgIG5vZGVBLnJlcHVsc2lvbkZvcmNlWCAtPSByZXB1bHNpb25Gb3JjZVg7XG4gICAgbm9kZUEucmVwdWxzaW9uRm9yY2VZIC09IHJlcHVsc2lvbkZvcmNlWTtcbiAgICBub2RlQi5yZXB1bHNpb25Gb3JjZVggKz0gcmVwdWxzaW9uRm9yY2VYO1xuICAgIG5vZGVCLnJlcHVsc2lvbkZvcmNlWSArPSByZXB1bHNpb25Gb3JjZVk7XG4gIH1cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjR3Jhdml0YXRpb25hbEZvcmNlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgdmFyIG93bmVyR3JhcGg7XG4gIHZhciBvd25lckNlbnRlclg7XG4gIHZhciBvd25lckNlbnRlclk7XG4gIHZhciBkaXN0YW5jZVg7XG4gIHZhciBkaXN0YW5jZVk7XG4gIHZhciBhYnNEaXN0YW5jZVg7XG4gIHZhciBhYnNEaXN0YW5jZVk7XG4gIHZhciBlc3RpbWF0ZWRTaXplO1xuICBvd25lckdyYXBoID0gbm9kZS5nZXRPd25lcigpO1xuXG4gIG93bmVyQ2VudGVyWCA9IChvd25lckdyYXBoLmdldFJpZ2h0KCkgKyBvd25lckdyYXBoLmdldExlZnQoKSkgLyAyO1xuICBvd25lckNlbnRlclkgPSAob3duZXJHcmFwaC5nZXRUb3AoKSArIG93bmVyR3JhcGguZ2V0Qm90dG9tKCkpIC8gMjtcbiAgZGlzdGFuY2VYID0gbm9kZS5nZXRDZW50ZXJYKCkgLSBvd25lckNlbnRlclg7XG4gIGRpc3RhbmNlWSA9IG5vZGUuZ2V0Q2VudGVyWSgpIC0gb3duZXJDZW50ZXJZO1xuICBhYnNEaXN0YW5jZVggPSBNYXRoLmFicyhkaXN0YW5jZVgpICsgbm9kZS5nZXRXaWR0aCgpIC8gMjtcbiAgYWJzRGlzdGFuY2VZID0gTWF0aC5hYnMoZGlzdGFuY2VZKSArIG5vZGUuZ2V0SGVpZ2h0KCkgLyAyO1xuXG4gIGlmIChub2RlLmdldE93bmVyKCkgPT0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpKS8vIGluIHRoZSByb290IGdyYXBoXG4gIHtcbiAgICBlc3RpbWF0ZWRTaXplID0gb3duZXJHcmFwaC5nZXRFc3RpbWF0ZWRTaXplKCkgKiB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvcjtcblxuICAgIGlmIChhYnNEaXN0YW5jZVggPiBlc3RpbWF0ZWRTaXplIHx8IGFic0Rpc3RhbmNlWSA+IGVzdGltYXRlZFNpemUpXG4gICAge1xuICAgICAgbm9kZS5ncmF2aXRhdGlvbkZvcmNlWCA9IC10aGlzLmdyYXZpdHlDb25zdGFudCAqIGRpc3RhbmNlWDtcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVkgPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVk7XG4gICAgfVxuICB9XG4gIGVsc2UvLyBpbnNpZGUgYSBjb21wb3VuZFxuICB7XG4gICAgZXN0aW1hdGVkU2l6ZSA9IG93bmVyR3JhcGguZ2V0RXN0aW1hdGVkU2l6ZSgpICogdGhpcy5jb21wb3VuZEdyYXZpdHlSYW5nZUZhY3RvcjtcblxuICAgIGlmIChhYnNEaXN0YW5jZVggPiBlc3RpbWF0ZWRTaXplIHx8IGFic0Rpc3RhbmNlWSA+IGVzdGltYXRlZFNpemUpXG4gICAge1xuICAgICAgbm9kZS5ncmF2aXRhdGlvbkZvcmNlWCA9IC10aGlzLmdyYXZpdHlDb25zdGFudCAqIGRpc3RhbmNlWCAqXG4gICAgICAgICAgICAgIHRoaXMuY29tcG91bmRHcmF2aXR5Q29uc3RhbnQ7XG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VZID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VZICpcbiAgICAgICAgICAgICAgdGhpcy5jb21wb3VuZEdyYXZpdHlDb25zdGFudDtcbiAgICB9XG4gIH1cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5pc0NvbnZlcmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbnZlcmdlZDtcbiAgdmFyIG9zY2lsYXRpbmcgPSBmYWxzZTtcblxuICBpZiAodGhpcy50b3RhbEl0ZXJhdGlvbnMgPiB0aGlzLm1heEl0ZXJhdGlvbnMgLyAzKVxuICB7XG4gICAgb3NjaWxhdGluZyA9XG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnRvdGFsRGlzcGxhY2VtZW50IC0gdGhpcy5vbGRUb3RhbERpc3BsYWNlbWVudCkgPCAyO1xuICB9XG5cbiAgY29udmVyZ2VkID0gdGhpcy50b3RhbERpc3BsYWNlbWVudCA8IHRoaXMudG90YWxEaXNwbGFjZW1lbnRUaHJlc2hvbGQ7XG5cbiAgdGhpcy5vbGRUb3RhbERpc3BsYWNlbWVudCA9IHRoaXMudG90YWxEaXNwbGFjZW1lbnQ7XG5cbiAgcmV0dXJuIGNvbnZlcmdlZCB8fCBvc2NpbGF0aW5nO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dCAmJiAhdGhpcy5pc1N1YkxheW91dClcbiAge1xuICAgIGlmICh0aGlzLm5vdEFuaW1hdGVkSXRlcmF0aW9ucyA9PSB0aGlzLmFuaW1hdGlvblBlcmlvZClcbiAgICB7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgdGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMgPSAwO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgdGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMrKztcbiAgICB9XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTZWN0aW9uOiBGUi1HcmlkIFZhcmlhbnQgUmVwdWxzaW9uIEZvcmNlIENhbGN1bGF0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0dyaWQgPSBmdW5jdGlvbiAoZ3JhcGgpe1xuXG4gIHZhciBzaXplWCA9IDA7IFxuICB2YXIgc2l6ZVkgPSAwO1xuICBcbiAgc2l6ZVggPSBwYXJzZUludChNYXRoLmNlaWwoKGdyYXBoLmdldFJpZ2h0KCkgLSBncmFwaC5nZXRMZWZ0KCkpIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuICBzaXplWSA9IHBhcnNlSW50KE1hdGguY2VpbCgoZ3JhcGguZ2V0Qm90dG9tKCkgLSBncmFwaC5nZXRUb3AoKSkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG4gIFxuICB2YXIgZ3JpZCA9IG5ldyBBcnJheShzaXplWCk7XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZVg7IGkrKyl7XG4gICAgZ3JpZFtpXSA9IG5ldyBBcnJheShzaXplWSk7ICAgIFxuICB9XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZVg7IGkrKyl7XG4gICAgZm9yKHZhciBqID0gMDsgaiA8IHNpemVZOyBqKyspe1xuICAgICAgZ3JpZFtpXVtqXSA9IG5ldyBBcnJheSgpOyAgICBcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBncmlkO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmFkZE5vZGVUb0dyaWQgPSBmdW5jdGlvbiAodiwgbGVmdCwgdG9wKXtcbiAgICBcbiAgdmFyIHN0YXJ0WCA9IDA7XG4gIHZhciBmaW5pc2hYID0gMDtcbiAgdmFyIHN0YXJ0WSA9IDA7XG4gIHZhciBmaW5pc2hZID0gMDtcbiAgXG4gIHN0YXJ0WCA9IHBhcnNlSW50KE1hdGguZmxvb3IoKHYuZ2V0UmVjdCgpLnggLSBsZWZ0KSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcbiAgZmluaXNoWCA9IHBhcnNlSW50KE1hdGguZmxvb3IoKHYuZ2V0UmVjdCgpLndpZHRoICsgdi5nZXRSZWN0KCkueCAtIGxlZnQpIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuICBzdGFydFkgPSBwYXJzZUludChNYXRoLmZsb29yKCh2LmdldFJlY3QoKS55IC0gdG9wKSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcbiAgZmluaXNoWSA9IHBhcnNlSW50KE1hdGguZmxvb3IoKHYuZ2V0UmVjdCgpLmhlaWdodCArIHYuZ2V0UmVjdCgpLnkgLSB0b3ApIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuXG4gIGZvciAodmFyIGkgPSBzdGFydFg7IGkgPD0gZmluaXNoWDsgaSsrKVxuICB7XG4gICAgZm9yICh2YXIgaiA9IHN0YXJ0WTsgaiA8PSBmaW5pc2hZOyBqKyspXG4gICAge1xuICAgICAgdGhpcy5ncmlkW2ldW2pdLnB1c2godik7XG4gICAgICB2LnNldEdyaWRDb29yZGluYXRlcyhzdGFydFgsIGZpbmlzaFgsIHN0YXJ0WSwgZmluaXNoWSk7IFxuICAgIH1cbiAgfSAgXG5cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS51cGRhdGVHcmlkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpO1xuICB2YXIgbm9kZUE7XG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XG4gIFxuICB0aGlzLmdyaWQgPSB0aGlzLmNhbGNHcmlkKHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKSk7ICAgXG5cbiAgLy8gcHV0IGFsbCBub2RlcyB0byBwcm9wZXIgZ3JpZCBjZWxsc1xuICBmb3IgKGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgbm9kZUEgPSBsTm9kZXNbaV07XG4gICAgdGhpcy5hZGROb2RlVG9HcmlkKG5vZGVBLCB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0TGVmdCgpLCB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0VG9wKCkpO1xuICB9IFxuXG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY3VsYXRlUmVwdWxzaW9uRm9yY2VPZkFOb2RlID0gZnVuY3Rpb24gKG5vZGVBLCBwcm9jZXNzZWROb2RlU2V0KXtcbiAgXG4gIGlmICgodGhpcy50b3RhbEl0ZXJhdGlvbnMgJSBGRExheW91dENvbnN0YW50cy5HUklEX0NBTENVTEFUSU9OX0NIRUNLX1BFUklPRCA9PSAxICYmICF0aGlzLmlzVHJlZUdyb3dpbmcgJiYgIXRoaXMuaXNHcm93dGhGaW5pc2hlZCkgfHwgKHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zICUgMTAgPT0gMSAmJiB0aGlzLmlzVHJlZUdyb3dpbmcpIHx8ICh0aGlzLmFmdGVyR3Jvd3RoSXRlcmF0aW9ucyAlIDEwID09IDEgJiYgdGhpcy5pc0dyb3d0aEZpbmlzaGVkKSlcbiAge1xuICAgIHZhciBzdXJyb3VuZGluZyA9IG5ldyBTZXQoKTtcbiAgICBub2RlQS5zdXJyb3VuZGluZyA9IG5ldyBBcnJheSgpO1xuICAgIHZhciBub2RlQjtcbiAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICBcbiAgICBmb3IgKHZhciBpID0gKG5vZGVBLnN0YXJ0WCAtIDEpOyBpIDwgKG5vZGVBLmZpbmlzaFggKyAyKTsgaSsrKVxuICAgIHtcbiAgICAgIGZvciAodmFyIGogPSAobm9kZUEuc3RhcnRZIC0gMSk7IGogPCAobm9kZUEuZmluaXNoWSArIDIpOyBqKyspXG4gICAgICB7XG4gICAgICAgIGlmICghKChpIDwgMCkgfHwgKGogPCAwKSB8fCAoaSA+PSBncmlkLmxlbmd0aCkgfHwgKGogPj0gZ3JpZFswXS5sZW5ndGgpKSlcbiAgICAgICAgeyAgXG4gICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBncmlkW2ldW2pdLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBub2RlQiA9IGdyaWRbaV1bal1ba107XG5cbiAgICAgICAgICAgIC8vIElmIGJvdGggbm9kZXMgYXJlIG5vdCBtZW1iZXJzIG9mIHRoZSBzYW1lIGdyYXBoLCBcbiAgICAgICAgICAgIC8vIG9yIGJvdGggbm9kZXMgYXJlIHRoZSBzYW1lLCBza2lwLlxuICAgICAgICAgICAgaWYgKChub2RlQS5nZXRPd25lcigpICE9IG5vZGVCLmdldE93bmVyKCkpIHx8IChub2RlQSA9PSBub2RlQikpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgcmVwdWxzaW9uIGZvcmNlIGJldHdlZW5cbiAgICAgICAgICAgIC8vIG5vZGVBIGFuZCBub2RlQiBoYXMgYWxyZWFkeSBiZWVuIGNhbGN1bGF0ZWRcbiAgICAgICAgICAgIGlmICghcHJvY2Vzc2VkTm9kZVNldC5oYXMobm9kZUIpICYmICFzdXJyb3VuZGluZy5oYXMobm9kZUIpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMobm9kZUEuZ2V0Q2VudGVyWCgpLW5vZGVCLmdldENlbnRlclgoKSkgLSBcbiAgICAgICAgICAgICAgICAgICAgKChub2RlQS5nZXRXaWR0aCgpLzIpICsgKG5vZGVCLmdldFdpZHRoKCkvMikpO1xuICAgICAgICAgICAgICB2YXIgZGlzdGFuY2VZID0gTWF0aC5hYnMobm9kZUEuZ2V0Q2VudGVyWSgpLW5vZGVCLmdldENlbnRlclkoKSkgLSBcbiAgICAgICAgICAgICAgICAgICAgKChub2RlQS5nZXRIZWlnaHQoKS8yKSArIChub2RlQi5nZXRIZWlnaHQoKS8yKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy8gaWYgdGhlIGRpc3RhbmNlIGJldHdlZW4gbm9kZUEgYW5kIG5vZGVCIFxuICAgICAgICAgICAgICAvLyBpcyBsZXNzIHRoZW4gY2FsY3VsYXRpb24gcmFuZ2VcbiAgICAgICAgICAgICAgaWYgKChkaXN0YW5jZVggPD0gdGhpcy5yZXB1bHNpb25SYW5nZSkgJiYgKGRpc3RhbmNlWSA8PSB0aGlzLnJlcHVsc2lvblJhbmdlKSlcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vdGhlbiBhZGQgbm9kZUIgdG8gc3Vycm91bmRpbmcgb2Ygbm9kZUFcbiAgICAgICAgICAgICAgICBzdXJyb3VuZGluZy5hZGQobm9kZUIpO1xuICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgfVxuICAgICAgICB9ICAgICAgICAgIFxuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGVBLnN1cnJvdW5kaW5nID0gWy4uLnN1cnJvdW5kaW5nXTtcblx0XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IG5vZGVBLnN1cnJvdW5kaW5nLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgdGhpcy5jYWxjUmVwdWxzaW9uRm9yY2Uobm9kZUEsIG5vZGVBLnN1cnJvdW5kaW5nW2ldKTtcbiAgfVx0XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvblJhbmdlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gMC4wO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNlY3Rpb246IFRyZWUgUmVkdWN0aW9uIG1ldGhvZHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZWR1Y2UgdHJlZXMgXG5GRExheW91dC5wcm90b3R5cGUucmVkdWNlVHJlZXMgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgcHJ1bmVkTm9kZXNBbGwgPSBbXTtcbiAgdmFyIGNvbnRhaW5zTGVhZiA9IHRydWU7XG4gIHZhciBub2RlO1xuICBcbiAgd2hpbGUoY29udGFpbnNMZWFmKSB7XG4gICAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcbiAgICB2YXIgcHJ1bmVkTm9kZXNJblN0ZXBUZW1wID0gW107XG4gICAgY29udGFpbnNMZWFmID0gZmFsc2U7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZSA9IGFsbE5vZGVzW2ldO1xuICAgICAgaWYobm9kZS5nZXRFZGdlcygpLmxlbmd0aCA9PSAxICYmICFub2RlLmdldEVkZ2VzKClbMF0uaXNJbnRlckdyYXBoICYmIG5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKXtcbiAgICAgICAgcHJ1bmVkTm9kZXNJblN0ZXBUZW1wLnB1c2goW25vZGUsIG5vZGUuZ2V0RWRnZXMoKVswXSwgbm9kZS5nZXRPd25lcigpXSk7XG4gICAgICAgIGNvbnRhaW5zTGVhZiA9IHRydWU7XG4gICAgICB9ICBcbiAgICB9XG4gICAgaWYoY29udGFpbnNMZWFmID09IHRydWUpe1xuICAgICAgdmFyIHBydW5lZE5vZGVzSW5TdGVwID0gW107XG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgcHJ1bmVkTm9kZXNJblN0ZXBUZW1wLmxlbmd0aDsgaisrKXtcbiAgICAgICAgaWYocHJ1bmVkTm9kZXNJblN0ZXBUZW1wW2pdWzBdLmdldEVkZ2VzKCkubGVuZ3RoID09IDEpe1xuICAgICAgICAgIHBydW5lZE5vZGVzSW5TdGVwLnB1c2gocHJ1bmVkTm9kZXNJblN0ZXBUZW1wW2pdKTsgIFxuICAgICAgICAgIHBydW5lZE5vZGVzSW5TdGVwVGVtcFtqXVswXS5nZXRPd25lcigpLnJlbW92ZShwcnVuZWROb2Rlc0luU3RlcFRlbXBbal1bMF0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcnVuZWROb2Rlc0FsbC5wdXNoKHBydW5lZE5vZGVzSW5TdGVwKTtcbiAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsTm9kZXMoKTtcbiAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsRWRnZXMoKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5wcnVuZWROb2Rlc0FsbCA9IHBydW5lZE5vZGVzQWxsO1xufTtcblxuLy8gR3JvdyB0cmVlIG9uZSBzdGVwIFxuRkRMYXlvdXQucHJvdG90eXBlLmdyb3dUcmVlID0gZnVuY3Rpb24ocHJ1bmVkTm9kZXNBbGwpXG57XG4gIHZhciBsZW5ndGhPZlBydW5lZE5vZGVzSW5TdGVwID0gcHJ1bmVkTm9kZXNBbGwubGVuZ3RoOyBcbiAgdmFyIHBydW5lZE5vZGVzSW5TdGVwID0gcHJ1bmVkTm9kZXNBbGxbbGVuZ3RoT2ZQcnVuZWROb2Rlc0luU3RlcCAtIDFdOyAgXG5cbiAgdmFyIG5vZGVEYXRhOyAgXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBwcnVuZWROb2Rlc0luU3RlcC5sZW5ndGg7IGkrKyl7XG4gICAgbm9kZURhdGEgPSBwcnVuZWROb2Rlc0luU3RlcFtpXTtcblxuICAgIHRoaXMuZmluZFBsYWNlZm9yUHJ1bmVkTm9kZShub2RlRGF0YSk7XG4gICAgXG4gICAgbm9kZURhdGFbMl0uYWRkKG5vZGVEYXRhWzBdKTtcbiAgICBub2RlRGF0YVsyXS5hZGQobm9kZURhdGFbMV0sIG5vZGVEYXRhWzFdLnNvdXJjZSwgbm9kZURhdGFbMV0udGFyZ2V0KTtcbiAgfVxuXG4gIHBydW5lZE5vZGVzQWxsLnNwbGljZShwcnVuZWROb2Rlc0FsbC5sZW5ndGgtMSwgMSk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsTm9kZXMoKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xufTtcblxuLy8gRmluZCBhbiBhcHByb3ByaWF0ZSBwb3NpdGlvbiB0byByZXBsYWNlIHBydW5lZCBub2RlLCB0aGlzIG1ldGhvZCBjYW4gYmUgaW1wcm92ZWRcbkZETGF5b3V0LnByb3RvdHlwZS5maW5kUGxhY2Vmb3JQcnVuZWROb2RlID0gZnVuY3Rpb24obm9kZURhdGEpe1xuICBcbiAgdmFyIGdyaWRGb3JQcnVuZWROb2RlOyAgXG4gIHZhciBub2RlVG9Db25uZWN0O1xuICB2YXIgcHJ1bmVkTm9kZSA9IG5vZGVEYXRhWzBdO1xuICBpZihwcnVuZWROb2RlID09IG5vZGVEYXRhWzFdLnNvdXJjZSl7XG4gICAgbm9kZVRvQ29ubmVjdCA9IG5vZGVEYXRhWzFdLnRhcmdldDtcbiAgfVxuICBlbHNlIHtcbiAgICBub2RlVG9Db25uZWN0ID0gbm9kZURhdGFbMV0uc291cmNlOyAgXG4gIH1cbiAgdmFyIHN0YXJ0R3JpZFggPSBub2RlVG9Db25uZWN0LnN0YXJ0WDtcbiAgdmFyIGZpbmlzaEdyaWRYID0gbm9kZVRvQ29ubmVjdC5maW5pc2hYO1xuICB2YXIgc3RhcnRHcmlkWSA9IG5vZGVUb0Nvbm5lY3Quc3RhcnRZO1xuICB2YXIgZmluaXNoR3JpZFkgPSBub2RlVG9Db25uZWN0LmZpbmlzaFk7IFxuICBcbiAgdmFyIHVwTm9kZUNvdW50ID0gMDtcbiAgdmFyIGRvd25Ob2RlQ291bnQgPSAwO1xuICB2YXIgcmlnaHROb2RlQ291bnQgPSAwO1xuICB2YXIgbGVmdE5vZGVDb3VudCA9IDA7XG4gIHZhciBjb250cm9sUmVnaW9ucyA9IFt1cE5vZGVDb3VudCwgcmlnaHROb2RlQ291bnQsIGRvd25Ob2RlQ291bnQsIGxlZnROb2RlQ291bnRdXG4gIFxuICBpZihzdGFydEdyaWRZID4gMCl7XG4gICAgZm9yKHZhciBpID0gc3RhcnRHcmlkWDsgaSA8PSBmaW5pc2hHcmlkWDsgaSsrICl7XG4gICAgICBjb250cm9sUmVnaW9uc1swXSArPSAodGhpcy5ncmlkW2ldW3N0YXJ0R3JpZFkgLSAxXS5sZW5ndGggKyB0aGlzLmdyaWRbaV1bc3RhcnRHcmlkWV0ubGVuZ3RoIC0gMSk7ICAgXG4gICAgfVxuICB9XG4gIGlmKGZpbmlzaEdyaWRYIDwgdGhpcy5ncmlkLmxlbmd0aCAtIDEpe1xuICAgIGZvcih2YXIgaSA9IHN0YXJ0R3JpZFk7IGkgPD0gZmluaXNoR3JpZFk7IGkrKyApe1xuICAgICAgY29udHJvbFJlZ2lvbnNbMV0gKz0gKHRoaXMuZ3JpZFtmaW5pc2hHcmlkWCArIDFdW2ldLmxlbmd0aCArIHRoaXMuZ3JpZFtmaW5pc2hHcmlkWF1baV0ubGVuZ3RoIC0gMSk7ICAgXG4gICAgfVxuICB9XG4gIGlmKGZpbmlzaEdyaWRZIDwgdGhpcy5ncmlkWzBdLmxlbmd0aCAtIDEpe1xuICAgIGZvcih2YXIgaSA9IHN0YXJ0R3JpZFg7IGkgPD0gZmluaXNoR3JpZFg7IGkrKyApe1xuICAgICAgY29udHJvbFJlZ2lvbnNbMl0gKz0gKHRoaXMuZ3JpZFtpXVtmaW5pc2hHcmlkWSArIDFdLmxlbmd0aCArIHRoaXMuZ3JpZFtpXVtmaW5pc2hHcmlkWV0ubGVuZ3RoIC0gMSk7ICAgXG4gICAgfVxuICB9XG4gIGlmKHN0YXJ0R3JpZFggPiAwKXtcbiAgICBmb3IodmFyIGkgPSBzdGFydEdyaWRZOyBpIDw9IGZpbmlzaEdyaWRZOyBpKysgKXtcbiAgICAgIGNvbnRyb2xSZWdpb25zWzNdICs9ICh0aGlzLmdyaWRbc3RhcnRHcmlkWCAtIDFdW2ldLmxlbmd0aCArIHRoaXMuZ3JpZFtzdGFydEdyaWRYXVtpXS5sZW5ndGggLSAxKTsgICBcbiAgICB9XG4gIH1cbiAgdmFyIG1pbiA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgbWluQ291bnQ7XG4gIHZhciBtaW5JbmRleDtcbiAgZm9yKHZhciBqID0gMDsgaiA8IGNvbnRyb2xSZWdpb25zLmxlbmd0aDsgaisrKXtcbiAgICBpZihjb250cm9sUmVnaW9uc1tqXSA8IG1pbil7XG4gICAgICBtaW4gPSBjb250cm9sUmVnaW9uc1tqXTtcbiAgICAgIG1pbkNvdW50ID0gMTtcbiAgICAgIG1pbkluZGV4ID0gajtcbiAgICB9ICBcbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zW2pdID09IG1pbil7XG4gICAgICBtaW5Db3VudCsrOyAgXG4gICAgfVxuICB9XG4gIFxuICBpZihtaW5Db3VudCA9PSAzICYmIG1pbiA9PSAwKXtcbiAgICBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzFdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMl0gPT0gMCl7XG4gICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDE7ICAgIFxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMV0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1szXSA9PSAwKXtcbiAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMDsgIFxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMl0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1szXSA9PSAwKXtcbiAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMzsgIFxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzFdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMl0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1szXSA9PSAwKXtcbiAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMjsgIFxuICAgIH1cbiAgfVxuICBlbHNlIGlmKG1pbkNvdW50ID09IDIgJiYgbWluID09IDApe1xuICAgIHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzFdID09IDApeztcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAwO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMl0gPT0gMCl7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMDtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzNdID09IDApe1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDA7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMV0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1syXSA9PSAwKXtcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAxO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAyO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzFdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbM10gPT0gMCl7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMztcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMjtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZihtaW5Db3VudCA9PSA0ICYmIG1pbiA9PSAwKXtcbiAgICB2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgZ3JpZEZvclBydW5lZE5vZGUgPSByYW5kb207ICBcbiAgfVxuICBlbHNlIHtcbiAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IG1pbkluZGV4O1xuICB9XG4gIFxuICBpZihncmlkRm9yUHJ1bmVkTm9kZSA9PSAwKSB7XG4gICAgcHJ1bmVkTm9kZS5zZXRDZW50ZXIobm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJYKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJZKCkgLSBub2RlVG9Db25uZWN0LmdldEhlaWdodCgpLzIgLSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIIC0gcHJ1bmVkTm9kZS5nZXRIZWlnaHQoKS8yKTsgIFxuICB9XG4gIGVsc2UgaWYoZ3JpZEZvclBydW5lZE5vZGUgPT0gMSkge1xuICAgIHBydW5lZE5vZGUuc2V0Q2VudGVyKG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWCgpICsgbm9kZVRvQ29ubmVjdC5nZXRXaWR0aCgpLzIgKyBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIICsgcHJ1bmVkTm9kZS5nZXRXaWR0aCgpLzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJZKCkpOyAgXG4gIH1cbiAgZWxzZSBpZihncmlkRm9yUHJ1bmVkTm9kZSA9PSAyKSB7XG4gICAgcHJ1bmVkTm9kZS5zZXRDZW50ZXIobm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJYKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJZKCkgKyBub2RlVG9Db25uZWN0LmdldEhlaWdodCgpLzIgKyBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIICsgcHJ1bmVkTm9kZS5nZXRIZWlnaHQoKS8yKTsgIFxuICB9XG4gIGVsc2UgeyBcbiAgICBwcnVuZWROb2RlLnNldENlbnRlcihub2RlVG9Db25uZWN0LmdldENlbnRlclgoKSAtIG5vZGVUb0Nvbm5lY3QuZ2V0V2lkdGgoKS8yIC0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAtIHBydW5lZE5vZGUuZ2V0V2lkdGgoKS8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWSgpKTsgIFxuICB9XG4gIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dDtcbiIsInZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBGRExheW91dENvbnN0YW50cygpIHtcbn1cblxuLy9GRExheW91dENvbnN0YW50cyBpbmhlcml0cyBzdGF0aWMgcHJvcHMgaW4gTGF5b3V0Q29uc3RhbnRzXG5mb3IgKHZhciBwcm9wIGluIExheW91dENvbnN0YW50cykge1xuICBGRExheW91dENvbnN0YW50c1twcm9wXSA9IExheW91dENvbnN0YW50c1twcm9wXTtcbn1cblxuRkRMYXlvdXRDb25zdGFudHMuTUFYX0lURVJBVElPTlMgPSAyNTAwO1xuXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIID0gNTA7XG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSCA9IDAuNDU7XG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1JFUFVMU0lPTl9TVFJFTkdUSCA9IDQ1MDAuMDtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9TVFJFTkdUSCA9IDAuNDtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IDEuMDtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSAzLjg7XG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfUkFOR0VfRkFDVE9SID0gMS41O1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT04gPSB0cnVlO1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfUkVQVUxTSU9OX1JBTkdFX0NBTENVTEFUSU9OID0gdHJ1ZTtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUwgPSAwLjU7XG5GRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlRfSU5DUkVNRU5UQUwgPSAxMDAuMDtcbkZETGF5b3V0Q29uc3RhbnRzLk1BWF9OT0RFX0RJU1BMQUNFTUVOVCA9IEZETGF5b3V0Q29uc3RhbnRzLk1BWF9OT0RFX0RJU1BMQUNFTUVOVF9JTkNSRU1FTlRBTCAqIDM7XG5GRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1QgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIIC8gMTAuMDtcbkZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9IDEwMDtcbkZETGF5b3V0Q29uc3RhbnRzLlBFUl9MRVZFTF9JREVBTF9FREdFX0xFTkdUSF9GQUNUT1IgPSAwLjE7XG5GRExheW91dENvbnN0YW50cy5NSU5fRURHRV9MRU5HVEggPSAxO1xuRkRMYXlvdXRDb25zdGFudHMuR1JJRF9DQUxDVUxBVElPTl9DSEVDS19QRVJJT0QgPSAxMDtcblxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dENvbnN0YW50cztcbiIsInZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcblxuZnVuY3Rpb24gRkRMYXlvdXRFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xuICBMRWRnZS5jYWxsKHRoaXMsIHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSk7XG4gIHRoaXMuaWRlYWxMZW5ndGggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIO1xufVxuXG5GRExheW91dEVkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMRWRnZS5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIExFZGdlKSB7XG4gIEZETGF5b3V0RWRnZVtwcm9wXSA9IExFZGdlW3Byb3BdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZETGF5b3V0RWRnZTtcbiIsInZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcblxuZnVuY3Rpb24gRkRMYXlvdXROb2RlKGdtLCBsb2MsIHNpemUsIHZOb2RlKSB7XG4gIC8vIGFsdGVybmF0aXZlIGNvbnN0cnVjdG9yIGlzIGhhbmRsZWQgaW5zaWRlIExOb2RlXG4gIExOb2RlLmNhbGwodGhpcywgZ20sIGxvYywgc2l6ZSwgdk5vZGUpO1xuICAvL1NwcmluZywgcmVwdWxzaW9uIGFuZCBncmF2aXRhdGlvbmFsIGZvcmNlcyBhY3Rpbmcgb24gdGhpcyBub2RlXG4gIHRoaXMuc3ByaW5nRm9yY2VYID0gMDtcbiAgdGhpcy5zcHJpbmdGb3JjZVkgPSAwO1xuICB0aGlzLnJlcHVsc2lvbkZvcmNlWCA9IDA7XG4gIHRoaXMucmVwdWxzaW9uRm9yY2VZID0gMDtcbiAgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWCA9IDA7XG4gIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVkgPSAwO1xuICAvL0Ftb3VudCBieSB3aGljaCB0aGlzIG5vZGUgaXMgdG8gYmUgbW92ZWQgaW4gdGhpcyBpdGVyYXRpb25cbiAgdGhpcy5kaXNwbGFjZW1lbnRYID0gMDtcbiAgdGhpcy5kaXNwbGFjZW1lbnRZID0gMDtcblxuICAvL1N0YXJ0IGFuZCBmaW5pc2ggZ3JpZCBjb29yZGluYXRlcyB0aGF0IHRoaXMgbm9kZSBpcyBmYWxsZW4gaW50b1xuICB0aGlzLnN0YXJ0WCA9IDA7XG4gIHRoaXMuZmluaXNoWCA9IDA7XG4gIHRoaXMuc3RhcnRZID0gMDtcbiAgdGhpcy5maW5pc2hZID0gMDtcblxuICAvL0dlb21ldHJpYyBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXG4gIHRoaXMuc3Vycm91bmRpbmcgPSBbXTtcbn1cblxuRkRMYXlvdXROb2RlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTE5vZGUucHJvdG90eXBlKTtcblxuZm9yICh2YXIgcHJvcCBpbiBMTm9kZSkge1xuICBGRExheW91dE5vZGVbcHJvcF0gPSBMTm9kZVtwcm9wXTtcbn1cblxuRkRMYXlvdXROb2RlLnByb3RvdHlwZS5zZXRHcmlkQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAoX3N0YXJ0WCwgX2ZpbmlzaFgsIF9zdGFydFksIF9maW5pc2hZKVxue1xuICB0aGlzLnN0YXJ0WCA9IF9zdGFydFg7XG4gIHRoaXMuZmluaXNoWCA9IF9maW5pc2hYO1xuICB0aGlzLnN0YXJ0WSA9IF9zdGFydFk7XG4gIHRoaXMuZmluaXNoWSA9IF9maW5pc2hZO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZETGF5b3V0Tm9kZTtcbiIsInZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcblxuZnVuY3Rpb24gSGFzaE1hcCgpIHtcbiAgdGhpcy5tYXAgPSB7fTtcbiAgdGhpcy5rZXlzID0gW107XG59XG5cbkhhc2hNYXAucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciB0aGVJZCA9IFVuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKGtleSk7XG4gIGlmICghdGhpcy5jb250YWlucyh0aGVJZCkpIHtcbiAgICB0aGlzLm1hcFt0aGVJZF0gPSB2YWx1ZTtcbiAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICB9XG59O1xuXG5IYXNoTWFwLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQoa2V5KTtcbiAgcmV0dXJuIHRoaXMubWFwW2tleV0gIT0gbnVsbDtcbn07XG5cbkhhc2hNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQoa2V5KTtcbiAgcmV0dXJuIHRoaXMubWFwW3RoZUlkXTtcbn07XG5cbkhhc2hNYXAucHJvdG90eXBlLmtleVNldCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMua2V5cztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaE1hcDtcbiIsInZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcblxuZnVuY3Rpb24gSGFzaFNldCgpIHtcbiAgdGhpcy5zZXQgPSB7fTtcbn1cbjtcblxuSGFzaFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChvYmopO1xuICBpZiAoIXRoaXMuY29udGFpbnModGhlSWQpKVxuICAgIHRoaXMuc2V0W3RoZUlkXSA9IG9iajtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgZGVsZXRlIHRoaXMuc2V0W1VuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKG9iaildO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc2V0ID0ge307XG59O1xuXG5IYXNoU2V0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRoaXMuc2V0W1VuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKG9iaildID09IG9iajtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnNpemUoKSA9PT0gMDtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnNldCkubGVuZ3RoO1xufTtcblxuLy9jb25jYXRzIHRoaXMuc2V0IHRvIHRoZSBnaXZlbiBsaXN0XG5IYXNoU2V0LnByb3RvdHlwZS5hZGRBbGxUbyA9IGZ1bmN0aW9uIChsaXN0KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy5zZXQpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBsaXN0LnB1c2godGhpcy5zZXRba2V5c1tpXV0pO1xuICB9XG59O1xuXG5IYXNoU2V0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zZXQpLmxlbmd0aDtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uIChsaXN0KSB7XG4gIHZhciBzID0gbGlzdC5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKSB7XG4gICAgdmFyIHYgPSBsaXN0W2ldO1xuICAgIHRoaXMuYWRkKHYpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2hTZXQ7XG4iLCJmdW5jdGlvbiBJR2VvbWV0cnkoKSB7XG59XG5cbklHZW9tZXRyeS5jYWxjU2VwYXJhdGlvbkFtb3VudCA9IGZ1bmN0aW9uIChyZWN0QSwgcmVjdEIsIG92ZXJsYXBBbW91bnQsIHNlcGFyYXRpb25CdWZmZXIpXG57XG4gIGlmICghcmVjdEEuaW50ZXJzZWN0cyhyZWN0QikpIHtcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgfVxuICB2YXIgZGlyZWN0aW9ucyA9IG5ldyBBcnJheSgyKTtcbiAgSUdlb21ldHJ5LmRlY2lkZURpcmVjdGlvbnNGb3JPdmVybGFwcGluZ05vZGVzKHJlY3RBLCByZWN0QiwgZGlyZWN0aW9ucyk7XG4gIG92ZXJsYXBBbW91bnRbMF0gPSBNYXRoLm1pbihyZWN0QS5nZXRSaWdodCgpLCByZWN0Qi5nZXRSaWdodCgpKSAtXG4gICAgICAgICAgTWF0aC5tYXgocmVjdEEueCwgcmVjdEIueCk7XG4gIG92ZXJsYXBBbW91bnRbMV0gPSBNYXRoLm1pbihyZWN0QS5nZXRCb3R0b20oKSwgcmVjdEIuZ2V0Qm90dG9tKCkpIC1cbiAgICAgICAgICBNYXRoLm1heChyZWN0QS55LCByZWN0Qi55KTtcbiAgLy8gdXBkYXRlIHRoZSBvdmVybGFwcGluZyBhbW91bnRzIGZvciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuICBpZiAoKHJlY3RBLmdldFgoKSA8PSByZWN0Qi5nZXRYKCkpICYmIChyZWN0QS5nZXRSaWdodCgpID49IHJlY3RCLmdldFJpZ2h0KCkpKVxuICB7XG4gICAgb3ZlcmxhcEFtb3VudFswXSArPSBNYXRoLm1pbigocmVjdEIuZ2V0WCgpIC0gcmVjdEEuZ2V0WCgpKSxcbiAgICAgICAgICAgIChyZWN0QS5nZXRSaWdodCgpIC0gcmVjdEIuZ2V0UmlnaHQoKSkpO1xuICB9XG4gIGVsc2UgaWYgKChyZWN0Qi5nZXRYKCkgPD0gcmVjdEEuZ2V0WCgpKSAmJiAocmVjdEIuZ2V0UmlnaHQoKSA+PSByZWN0QS5nZXRSaWdodCgpKSlcbiAge1xuICAgIG92ZXJsYXBBbW91bnRbMF0gKz0gTWF0aC5taW4oKHJlY3RBLmdldFgoKSAtIHJlY3RCLmdldFgoKSksXG4gICAgICAgICAgICAocmVjdEIuZ2V0UmlnaHQoKSAtIHJlY3RBLmdldFJpZ2h0KCkpKTtcbiAgfVxuICBpZiAoKHJlY3RBLmdldFkoKSA8PSByZWN0Qi5nZXRZKCkpICYmIChyZWN0QS5nZXRCb3R0b20oKSA+PSByZWN0Qi5nZXRCb3R0b20oKSkpXG4gIHtcbiAgICBvdmVybGFwQW1vdW50WzFdICs9IE1hdGgubWluKChyZWN0Qi5nZXRZKCkgLSByZWN0QS5nZXRZKCkpLFxuICAgICAgICAgICAgKHJlY3RBLmdldEJvdHRvbSgpIC0gcmVjdEIuZ2V0Qm90dG9tKCkpKTtcbiAgfVxuICBlbHNlIGlmICgocmVjdEIuZ2V0WSgpIDw9IHJlY3RBLmdldFkoKSkgJiYgKHJlY3RCLmdldEJvdHRvbSgpID49IHJlY3RBLmdldEJvdHRvbSgpKSlcbiAge1xuICAgIG92ZXJsYXBBbW91bnRbMV0gKz0gTWF0aC5taW4oKHJlY3RBLmdldFkoKSAtIHJlY3RCLmdldFkoKSksXG4gICAgICAgICAgICAocmVjdEIuZ2V0Qm90dG9tKCkgLSByZWN0QS5nZXRCb3R0b20oKSkpO1xuICB9XG5cbiAgLy8gZmluZCBzbG9wZSBvZiB0aGUgbGluZSBwYXNzZXMgdHdvIGNlbnRlcnNcbiAgdmFyIHNsb3BlID0gTWF0aC5hYnMoKHJlY3RCLmdldENlbnRlclkoKSAtIHJlY3RBLmdldENlbnRlclkoKSkgL1xuICAgICAgICAgIChyZWN0Qi5nZXRDZW50ZXJYKCkgLSByZWN0QS5nZXRDZW50ZXJYKCkpKTtcbiAgLy8gaWYgY2VudGVycyBhcmUgb3ZlcmxhcHBlZFxuICBpZiAoKHJlY3RCLmdldENlbnRlclkoKSA9PSByZWN0QS5nZXRDZW50ZXJZKCkpICYmXG4gICAgICAgICAgKHJlY3RCLmdldENlbnRlclgoKSA9PSByZWN0QS5nZXRDZW50ZXJYKCkpKVxuICB7XG4gICAgLy8gYXNzdW1lIHRoZSBzbG9wZSBpcyAxICg0NSBkZWdyZWUpXG4gICAgc2xvcGUgPSAxLjA7XG4gIH1cblxuICB2YXIgbW92ZUJ5WSA9IHNsb3BlICogb3ZlcmxhcEFtb3VudFswXTtcbiAgdmFyIG1vdmVCeVggPSBvdmVybGFwQW1vdW50WzFdIC8gc2xvcGU7XG4gIGlmIChvdmVybGFwQW1vdW50WzBdIDwgbW92ZUJ5WClcbiAge1xuICAgIG1vdmVCeVggPSBvdmVybGFwQW1vdW50WzBdO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIG1vdmVCeVkgPSBvdmVybGFwQW1vdW50WzFdO1xuICB9XG4gIC8vIHJldHVybiBoYWxmIHRoZSBhbW91bnQgc28gdGhhdCBpZiBlYWNoIHJlY3RhbmdsZSBpcyBtb3ZlZCBieSB0aGVzZVxuICAvLyBhbW91bnRzIGluIG9wcG9zaXRlIGRpcmVjdGlvbnMsIG92ZXJsYXAgd2lsbCBiZSByZXNvbHZlZFxuICBvdmVybGFwQW1vdW50WzBdID0gLTEgKiBkaXJlY3Rpb25zWzBdICogKChtb3ZlQnlYIC8gMikgKyBzZXBhcmF0aW9uQnVmZmVyKTtcbiAgb3ZlcmxhcEFtb3VudFsxXSA9IC0xICogZGlyZWN0aW9uc1sxXSAqICgobW92ZUJ5WSAvIDIpICsgc2VwYXJhdGlvbkJ1ZmZlcik7XG59XG5cbklHZW9tZXRyeS5kZWNpZGVEaXJlY3Rpb25zRm9yT3ZlcmxhcHBpbmdOb2RlcyA9IGZ1bmN0aW9uIChyZWN0QSwgcmVjdEIsIGRpcmVjdGlvbnMpXG57XG4gIGlmIChyZWN0QS5nZXRDZW50ZXJYKCkgPCByZWN0Qi5nZXRDZW50ZXJYKCkpXG4gIHtcbiAgICBkaXJlY3Rpb25zWzBdID0gLTE7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgZGlyZWN0aW9uc1swXSA9IDE7XG4gIH1cblxuICBpZiAocmVjdEEuZ2V0Q2VudGVyWSgpIDwgcmVjdEIuZ2V0Q2VudGVyWSgpKVxuICB7XG4gICAgZGlyZWN0aW9uc1sxXSA9IC0xO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIGRpcmVjdGlvbnNbMV0gPSAxO1xuICB9XG59XG5cbklHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24yID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0QiwgcmVzdWx0KVxue1xuICAvL3Jlc3VsdFswLTFdIHdpbGwgY29udGFpbiBjbGlwUG9pbnQgb2YgcmVjdEEsIHJlc3VsdFsyLTNdIHdpbGwgY29udGFpbiBjbGlwUG9pbnQgb2YgcmVjdEJcbiAgdmFyIHAxeCA9IHJlY3RBLmdldENlbnRlclgoKTtcbiAgdmFyIHAxeSA9IHJlY3RBLmdldENlbnRlclkoKTtcbiAgdmFyIHAyeCA9IHJlY3RCLmdldENlbnRlclgoKTtcbiAgdmFyIHAyeSA9IHJlY3RCLmdldENlbnRlclkoKTtcblxuICAvL2lmIHR3byByZWN0YW5nbGVzIGludGVyc2VjdCwgdGhlbiBjbGlwcGluZyBwb2ludHMgYXJlIGNlbnRlcnNcbiAgaWYgKHJlY3RBLmludGVyc2VjdHMocmVjdEIpKVxuICB7XG4gICAgcmVzdWx0WzBdID0gcDF4O1xuICAgIHJlc3VsdFsxXSA9IHAxeTtcbiAgICByZXN1bHRbMl0gPSBwMng7XG4gICAgcmVzdWx0WzNdID0gcDJ5O1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vdmFyaWFibGVzIGZvciByZWN0QVxuICB2YXIgdG9wTGVmdEF4ID0gcmVjdEEuZ2V0WCgpO1xuICB2YXIgdG9wTGVmdEF5ID0gcmVjdEEuZ2V0WSgpO1xuICB2YXIgdG9wUmlnaHRBeCA9IHJlY3RBLmdldFJpZ2h0KCk7XG4gIHZhciBib3R0b21MZWZ0QXggPSByZWN0QS5nZXRYKCk7XG4gIHZhciBib3R0b21MZWZ0QXkgPSByZWN0QS5nZXRCb3R0b20oKTtcbiAgdmFyIGJvdHRvbVJpZ2h0QXggPSByZWN0QS5nZXRSaWdodCgpO1xuICB2YXIgaGFsZldpZHRoQSA9IHJlY3RBLmdldFdpZHRoSGFsZigpO1xuICB2YXIgaGFsZkhlaWdodEEgPSByZWN0QS5nZXRIZWlnaHRIYWxmKCk7XG4gIC8vdmFyaWFibGVzIGZvciByZWN0QlxuICB2YXIgdG9wTGVmdEJ4ID0gcmVjdEIuZ2V0WCgpO1xuICB2YXIgdG9wTGVmdEJ5ID0gcmVjdEIuZ2V0WSgpO1xuICB2YXIgdG9wUmlnaHRCeCA9IHJlY3RCLmdldFJpZ2h0KCk7XG4gIHZhciBib3R0b21MZWZ0QnggPSByZWN0Qi5nZXRYKCk7XG4gIHZhciBib3R0b21MZWZ0QnkgPSByZWN0Qi5nZXRCb3R0b20oKTtcbiAgdmFyIGJvdHRvbVJpZ2h0QnggPSByZWN0Qi5nZXRSaWdodCgpO1xuICB2YXIgaGFsZldpZHRoQiA9IHJlY3RCLmdldFdpZHRoSGFsZigpO1xuICB2YXIgaGFsZkhlaWdodEIgPSByZWN0Qi5nZXRIZWlnaHRIYWxmKCk7XG4gIC8vZmxhZyB3aGV0aGVyIGNsaXBwaW5nIHBvaW50cyBhcmUgZm91bmRcbiAgdmFyIGNsaXBQb2ludEFGb3VuZCA9IGZhbHNlO1xuICB2YXIgY2xpcFBvaW50QkZvdW5kID0gZmFsc2U7XG5cbiAgLy8gbGluZSBpcyB2ZXJ0aWNhbFxuICBpZiAocDF4ID09IHAyeClcbiAge1xuICAgIGlmIChwMXkgPiBwMnkpXG4gICAge1xuICAgICAgcmVzdWx0WzBdID0gcDF4O1xuICAgICAgcmVzdWx0WzFdID0gdG9wTGVmdEF5O1xuICAgICAgcmVzdWx0WzJdID0gcDJ4O1xuICAgICAgcmVzdWx0WzNdID0gYm90dG9tTGVmdEJ5O1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIGlmIChwMXkgPCBwMnkpXG4gICAge1xuICAgICAgcmVzdWx0WzBdID0gcDF4O1xuICAgICAgcmVzdWx0WzFdID0gYm90dG9tTGVmdEF5O1xuICAgICAgcmVzdWx0WzJdID0gcDJ4O1xuICAgICAgcmVzdWx0WzNdID0gdG9wTGVmdEJ5O1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgLy9ub3QgbGluZSwgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIC8vIGxpbmUgaXMgaG9yaXpvbnRhbFxuICBlbHNlIGlmIChwMXkgPT0gcDJ5KVxuICB7XG4gICAgaWYgKHAxeCA+IHAyeClcbiAgICB7XG4gICAgICByZXN1bHRbMF0gPSB0b3BMZWZ0QXg7XG4gICAgICByZXN1bHRbMV0gPSBwMXk7XG4gICAgICByZXN1bHRbMl0gPSB0b3BSaWdodEJ4O1xuICAgICAgcmVzdWx0WzNdID0gcDJ5O1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIGlmIChwMXggPCBwMngpXG4gICAge1xuICAgICAgcmVzdWx0WzBdID0gdG9wUmlnaHRBeDtcbiAgICAgIHJlc3VsdFsxXSA9IHAxeTtcbiAgICAgIHJlc3VsdFsyXSA9IHRvcExlZnRCeDtcbiAgICAgIHJlc3VsdFszXSA9IHAyeTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIC8vbm90IHZhbGlkIGxpbmUsIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBlbHNlXG4gIHtcbiAgICAvL3Nsb3BlcyBvZiByZWN0QSdzIGFuZCByZWN0QidzIGRpYWdvbmFsc1xuICAgIHZhciBzbG9wZUEgPSByZWN0QS5oZWlnaHQgLyByZWN0QS53aWR0aDtcbiAgICB2YXIgc2xvcGVCID0gcmVjdEIuaGVpZ2h0IC8gcmVjdEIud2lkdGg7XG5cbiAgICAvL3Nsb3BlIG9mIGxpbmUgYmV0d2VlbiBjZW50ZXIgb2YgcmVjdEEgYW5kIGNlbnRlciBvZiByZWN0QlxuICAgIHZhciBzbG9wZVByaW1lID0gKHAyeSAtIHAxeSkgLyAocDJ4IC0gcDF4KTtcbiAgICB2YXIgY2FyZGluYWxEaXJlY3Rpb25BO1xuICAgIHZhciBjYXJkaW5hbERpcmVjdGlvbkI7XG4gICAgdmFyIHRlbXBQb2ludEF4O1xuICAgIHZhciB0ZW1wUG9pbnRBeTtcbiAgICB2YXIgdGVtcFBvaW50Qng7XG4gICAgdmFyIHRlbXBQb2ludEJ5O1xuXG4gICAgLy9kZXRlcm1pbmUgd2hldGhlciBjbGlwcGluZyBwb2ludCBpcyB0aGUgY29ybmVyIG9mIG5vZGVBXG4gICAgaWYgKCgtc2xvcGVBKSA9PSBzbG9wZVByaW1lKVxuICAgIHtcbiAgICAgIGlmIChwMXggPiBwMngpXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFswXSA9IGJvdHRvbUxlZnRBeDtcbiAgICAgICAgcmVzdWx0WzFdID0gYm90dG9tTGVmdEF5O1xuICAgICAgICBjbGlwUG9pbnRBRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICByZXN1bHRbMF0gPSB0b3BSaWdodEF4O1xuICAgICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNsb3BlQSA9PSBzbG9wZVByaW1lKVxuICAgIHtcbiAgICAgIGlmIChwMXggPiBwMngpXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFswXSA9IHRvcExlZnRBeDtcbiAgICAgICAgcmVzdWx0WzFdID0gdG9wTGVmdEF5O1xuICAgICAgICBjbGlwUG9pbnRBRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICByZXN1bHRbMF0gPSBib3R0b21SaWdodEF4O1xuICAgICAgICByZXN1bHRbMV0gPSBib3R0b21MZWZ0QXk7XG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9kZXRlcm1pbmUgd2hldGhlciBjbGlwcGluZyBwb2ludCBpcyB0aGUgY29ybmVyIG9mIG5vZGVCXG4gICAgaWYgKCgtc2xvcGVCKSA9PSBzbG9wZVByaW1lKVxuICAgIHtcbiAgICAgIGlmIChwMnggPiBwMXgpXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFsyXSA9IGJvdHRvbUxlZnRCeDtcbiAgICAgICAgcmVzdWx0WzNdID0gYm90dG9tTGVmdEJ5O1xuICAgICAgICBjbGlwUG9pbnRCRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICByZXN1bHRbMl0gPSB0b3BSaWdodEJ4O1xuICAgICAgICByZXN1bHRbM10gPSB0b3BMZWZ0Qnk7XG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHNsb3BlQiA9PSBzbG9wZVByaW1lKVxuICAgIHtcbiAgICAgIGlmIChwMnggPiBwMXgpXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFsyXSA9IHRvcExlZnRCeDtcbiAgICAgICAgcmVzdWx0WzNdID0gdG9wTGVmdEJ5O1xuICAgICAgICBjbGlwUG9pbnRCRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICByZXN1bHRbMl0gPSBib3R0b21SaWdodEJ4O1xuICAgICAgICByZXN1bHRbM10gPSBib3R0b21MZWZ0Qnk7XG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9pZiBib3RoIGNsaXBwaW5nIHBvaW50cyBhcmUgY29ybmVyc1xuICAgIGlmIChjbGlwUG9pbnRBRm91bmQgJiYgY2xpcFBvaW50QkZvdW5kKVxuICAgIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL2RldGVybWluZSBDYXJkaW5hbCBEaXJlY3Rpb24gb2YgcmVjdGFuZ2xlc1xuICAgIGlmIChwMXggPiBwMngpXG4gICAge1xuICAgICAgaWYgKHAxeSA+IHAyeSlcbiAgICAgIHtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25BID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKHNsb3BlQSwgc2xvcGVQcmltZSwgNCk7XG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQiA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbihzbG9wZUIsIHNsb3BlUHJpbWUsIDIpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oLXNsb3BlQSwgc2xvcGVQcmltZSwgMyk7XG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQiA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbigtc2xvcGVCLCBzbG9wZVByaW1lLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGlmIChwMXkgPiBwMnkpXG4gICAgICB7XG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQSA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbigtc2xvcGVBLCBzbG9wZVByaW1lLCAxKTtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUIsIHNsb3BlUHJpbWUsIDMpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVBLCBzbG9wZVByaW1lLCAyKTtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKHNsb3BlQiwgc2xvcGVQcmltZSwgNCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vY2FsY3VsYXRlIGNsaXBwaW5nIFBvaW50IGlmIGl0IGlzIG5vdCBmb3VuZCBiZWZvcmVcbiAgICBpZiAoIWNsaXBQb2ludEFGb3VuZClcbiAgICB7XG4gICAgICBzd2l0Y2ggKGNhcmRpbmFsRGlyZWN0aW9uQSlcbiAgICAgIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHRlbXBQb2ludEF5ID0gdG9wTGVmdEF5O1xuICAgICAgICAgIHRlbXBQb2ludEF4ID0gcDF4ICsgKC1oYWxmSGVpZ2h0QSkgLyBzbG9wZVByaW1lO1xuICAgICAgICAgIHJlc3VsdFswXSA9IHRlbXBQb2ludEF4O1xuICAgICAgICAgIHJlc3VsdFsxXSA9IHRlbXBQb2ludEF5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGVtcFBvaW50QXggPSBib3R0b21SaWdodEF4O1xuICAgICAgICAgIHRlbXBQb2ludEF5ID0gcDF5ICsgaGFsZldpZHRoQSAqIHNsb3BlUHJpbWU7XG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XG4gICAgICAgICAgcmVzdWx0WzFdID0gdGVtcFBvaW50QXk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICB0ZW1wUG9pbnRBeSA9IGJvdHRvbUxlZnRBeTtcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IHAxeCArIGhhbGZIZWlnaHRBIC8gc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHRlbXBQb2ludEF4ID0gYm90dG9tTGVmdEF4O1xuICAgICAgICAgIHRlbXBQb2ludEF5ID0gcDF5ICsgKC1oYWxmV2lkdGhBKSAqIHNsb3BlUHJpbWU7XG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XG4gICAgICAgICAgcmVzdWx0WzFdID0gdGVtcFBvaW50QXk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghY2xpcFBvaW50QkZvdW5kKVxuICAgIHtcbiAgICAgIHN3aXRjaCAoY2FyZGluYWxEaXJlY3Rpb25CKVxuICAgICAge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGVtcFBvaW50QnkgPSB0b3BMZWZ0Qnk7XG4gICAgICAgICAgdGVtcFBvaW50QnggPSBwMnggKyAoLWhhbGZIZWlnaHRCKSAvIHNsb3BlUHJpbWU7XG4gICAgICAgICAgcmVzdWx0WzJdID0gdGVtcFBvaW50Qng7XG4gICAgICAgICAgcmVzdWx0WzNdID0gdGVtcFBvaW50Qnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0ZW1wUG9pbnRCeCA9IGJvdHRvbVJpZ2h0Qng7XG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBwMnkgKyBoYWxmV2lkdGhCICogc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcbiAgICAgICAgICByZXN1bHRbM10gPSB0ZW1wUG9pbnRCeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHRlbXBQb2ludEJ5ID0gYm90dG9tTGVmdEJ5O1xuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gcDJ4ICsgaGFsZkhlaWdodEIgLyBzbG9wZVByaW1lO1xuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGVtcFBvaW50QnggPSBib3R0b21MZWZ0Qng7XG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBwMnkgKyAoLWhhbGZXaWR0aEIpICogc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcbiAgICAgICAgICByZXN1bHRbM10gPSB0ZW1wUG9pbnRCeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5JR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24gPSBmdW5jdGlvbiAoc2xvcGUsIHNsb3BlUHJpbWUsIGxpbmUpXG57XG4gIGlmIChzbG9wZSA+IHNsb3BlUHJpbWUpXG4gIHtcbiAgICByZXR1cm4gbGluZTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICByZXR1cm4gMSArIGxpbmUgJSA0O1xuICB9XG59XG5cbklHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAoczEsIHMyLCBmMSwgZjIpXG57XG4gIGlmIChmMiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIElHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24yKHMxLCBzMiwgZjEpO1xuICB9XG4gIHZhciB4MSA9IHMxLng7XG4gIHZhciB5MSA9IHMxLnk7XG4gIHZhciB4MiA9IHMyLng7XG4gIHZhciB5MiA9IHMyLnk7XG4gIHZhciB4MyA9IGYxLng7XG4gIHZhciB5MyA9IGYxLnk7XG4gIHZhciB4NCA9IGYyLng7XG4gIHZhciB5NCA9IGYyLnk7XG4gIHZhciB4LCB5OyAvLyBpbnRlcnNlY3Rpb24gcG9pbnRcbiAgdmFyIGExLCBhMiwgYjEsIGIyLCBjMSwgYzI7IC8vIGNvZWZmaWNpZW50cyBvZiBsaW5lIGVxbnMuXG4gIHZhciBkZW5vbTtcblxuICBhMSA9IHkyIC0geTE7XG4gIGIxID0geDEgLSB4MjtcbiAgYzEgPSB4MiAqIHkxIC0geDEgKiB5MjsgIC8vIHsgYTEqeCArIGIxKnkgKyBjMSA9IDAgaXMgbGluZSAxIH1cblxuICBhMiA9IHk0IC0geTM7XG4gIGIyID0geDMgLSB4NDtcbiAgYzIgPSB4NCAqIHkzIC0geDMgKiB5NDsgIC8vIHsgYTIqeCArIGIyKnkgKyBjMiA9IDAgaXMgbGluZSAyIH1cblxuICBkZW5vbSA9IGExICogYjIgLSBhMiAqIGIxO1xuXG4gIGlmIChkZW5vbSA9PSAwKVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB4ID0gKGIxICogYzIgLSBiMiAqIGMxKSAvIGRlbm9tO1xuICB5ID0gKGEyICogYzEgLSBhMSAqIGMyKSAvIGRlbm9tO1xuXG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTZWN0aW9uOiBDbGFzcyBDb25zdGFudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIFNvbWUgdXNlZnVsIHByZS1jYWxjdWxhdGVkIGNvbnN0YW50c1xuICovXG5JR2VvbWV0cnkuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XG5JR2VvbWV0cnkuT05FX0FORF9IQUxGX1BJID0gMS41ICogTWF0aC5QSTtcbklHZW9tZXRyeS5UV09fUEkgPSAyLjAgKiBNYXRoLlBJO1xuSUdlb21ldHJ5LlRIUkVFX1BJID0gMy4wICogTWF0aC5QSTtcblxubW9kdWxlLmV4cG9ydHMgPSBJR2VvbWV0cnk7XG4iLCJmdW5jdGlvbiBJTWF0aCgpIHtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBzaWduIG9mIHRoZSBpbnB1dCB2YWx1ZS5cbiAqL1xuSU1hdGguc2lnbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodmFsdWUgPiAwKVxuICB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgZWxzZSBpZiAodmFsdWUgPCAwKVxuICB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHJldHVybiAwO1xuICB9XG59XG5cbklNYXRoLmZsb29yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLmNlaWwodmFsdWUpIDogTWF0aC5mbG9vcih2YWx1ZSk7XG59XG5cbklNYXRoLmNlaWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGguZmxvb3IodmFsdWUpIDogTWF0aC5jZWlsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJTWF0aDtcbiIsImZ1bmN0aW9uIEludGVnZXIoKSB7XG59XG5cbkludGVnZXIuTUFYX1ZBTFVFID0gMjE0NzQ4MzY0NztcbkludGVnZXIuTUlOX1ZBTFVFID0gLTIxNDc0ODM2NDg7XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZWdlcjtcbiIsInZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XG5cbmZ1bmN0aW9uIExFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xuICBMR3JhcGhPYmplY3QuY2FsbCh0aGlzLCB2RWRnZSk7XG5cbiAgdGhpcy5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQgPSBmYWxzZTtcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2RWRnZTtcbiAgdGhpcy5iZW5kcG9pbnRzID0gW107XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbn1cblxuTEVkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhPYmplY3QucHJvdG90eXBlKTtcblxuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGhPYmplY3QpIHtcbiAgTEVkZ2VbcHJvcF0gPSBMR3JhcGhPYmplY3RbcHJvcF07XG59XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5zb3VyY2U7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMudGFyZ2V0O1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmlzSW50ZXJHcmFwaCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmlzSW50ZXJHcmFwaDtcbn07XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRMZW5ndGggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sZW5ndGg7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0O1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmdldEJlbmRwb2ludHMgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5iZW5kcG9pbnRzO1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmdldExjYSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxjYTtcbn07XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRTb3VyY2VJbkxjYSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnNvdXJjZUluTGNhO1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmdldFRhcmdldEluTGNhID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMudGFyZ2V0SW5MY2E7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuZ2V0T3RoZXJFbmQgPSBmdW5jdGlvbiAobm9kZSlcbntcbiAgaWYgKHRoaXMuc291cmNlID09PSBub2RlKVxuICB7XG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0O1xuICB9XG4gIGVsc2UgaWYgKHRoaXMudGFyZ2V0ID09PSBub2RlKVxuICB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRocm93IFwiTm9kZSBpcyBub3QgaW5jaWRlbnQgd2l0aCB0aGlzIGVkZ2VcIjtcbiAgfVxufVxuXG5MRWRnZS5wcm90b3R5cGUuZ2V0T3RoZXJFbmRJbkdyYXBoID0gZnVuY3Rpb24gKG5vZGUsIGdyYXBoKVxue1xuICB2YXIgb3RoZXJFbmQgPSB0aGlzLmdldE90aGVyRW5kKG5vZGUpO1xuICB2YXIgcm9vdCA9IGdyYXBoLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKTtcblxuICB3aGlsZSAodHJ1ZSlcbiAge1xuICAgIGlmIChvdGhlckVuZC5nZXRPd25lcigpID09IGdyYXBoKVxuICAgIHtcbiAgICAgIHJldHVybiBvdGhlckVuZDtcbiAgICB9XG5cbiAgICBpZiAob3RoZXJFbmQuZ2V0T3duZXIoKSA9PSByb290KVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIG90aGVyRW5kID0gb3RoZXJFbmQuZ2V0T3duZXIoKS5nZXRQYXJlbnQoKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuTEVkZ2UucHJvdG90eXBlLnVwZGF0ZUxlbmd0aCA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBjbGlwUG9pbnRDb29yZGluYXRlcyA9IG5ldyBBcnJheSg0KTtcblxuICB0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldCA9XG4gICAgICAgICAgSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbih0aGlzLnRhcmdldC5nZXRSZWN0KCksXG4gICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5nZXRSZWN0KCksXG4gICAgICAgICAgICAgICAgICBjbGlwUG9pbnRDb29yZGluYXRlcyk7XG5cbiAgaWYgKCF0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldClcbiAge1xuICAgIHRoaXMubGVuZ3RoWCA9IGNsaXBQb2ludENvb3JkaW5hdGVzWzBdIC0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbMl07XG4gICAgdGhpcy5sZW5ndGhZID0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbMV0gLSBjbGlwUG9pbnRDb29yZGluYXRlc1szXTtcblxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxlbmd0aFgpIDwgMS4wKVxuICAgIHtcbiAgICAgIHRoaXMubGVuZ3RoWCA9IElNYXRoLnNpZ24odGhpcy5sZW5ndGhYKTtcbiAgICB9XG5cbiAgICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhZKSA8IDEuMClcbiAgICB7XG4gICAgICB0aGlzLmxlbmd0aFkgPSBJTWF0aC5zaWduKHRoaXMubGVuZ3RoWSk7XG4gICAgfVxuXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICB0aGlzLmxlbmd0aFggKiB0aGlzLmxlbmd0aFggKyB0aGlzLmxlbmd0aFkgKiB0aGlzLmxlbmd0aFkpO1xuICB9XG59O1xuXG5MRWRnZS5wcm90b3R5cGUudXBkYXRlTGVuZ3RoU2ltcGxlID0gZnVuY3Rpb24gKClcbntcbiAgdGhpcy5sZW5ndGhYID0gdGhpcy50YXJnZXQuZ2V0Q2VudGVyWCgpIC0gdGhpcy5zb3VyY2UuZ2V0Q2VudGVyWCgpO1xuICB0aGlzLmxlbmd0aFkgPSB0aGlzLnRhcmdldC5nZXRDZW50ZXJZKCkgLSB0aGlzLnNvdXJjZS5nZXRDZW50ZXJZKCk7XG5cbiAgaWYgKE1hdGguYWJzKHRoaXMubGVuZ3RoWCkgPCAxLjApXG4gIHtcbiAgICB0aGlzLmxlbmd0aFggPSBJTWF0aC5zaWduKHRoaXMubGVuZ3RoWCk7XG4gIH1cblxuICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhZKSA8IDEuMClcbiAge1xuICAgIHRoaXMubGVuZ3RoWSA9IElNYXRoLnNpZ24odGhpcy5sZW5ndGhZKTtcbiAgfVxuXG4gIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KFxuICAgICAgICAgIHRoaXMubGVuZ3RoWCAqIHRoaXMubGVuZ3RoWCArIHRoaXMubGVuZ3RoWSAqIHRoaXMubGVuZ3RoWSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTEVkZ2U7XG4iLCJ2YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcbnZhciBMR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9MR3JhcGhNYW5hZ2VyJyk7XG52YXIgTE5vZGUgPSByZXF1aXJlKCcuL0xOb2RlJyk7XG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XG52YXIgSGFzaFNldCA9IHJlcXVpcmUoJy4vSGFzaFNldCcpO1xudmFyIFJlY3RhbmdsZUQgPSByZXF1aXJlKCcuL1JlY3RhbmdsZUQnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcbnZhciBMaXN0ID0gcmVxdWlyZSgnbGlua2VkbGlzdC1qcycpLkxpc3Q7XG52YXIgTGF5b3V0O1xuXG5mdW5jdGlvbiBMR3JhcGgocGFyZW50LCBvYmoyLCB2R3JhcGgpIHtcbiAgTGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcbiAgTEdyYXBoT2JqZWN0LmNhbGwodGhpcywgdkdyYXBoKTtcbiAgdGhpcy5lc3RpbWF0ZWRTaXplID0gSW50ZWdlci5NSU5fVkFMVUU7XG4gIHRoaXMubWFyZ2luID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBUEhfTUFSR0lOO1xuICB0aGlzLmVkZ2VzID0gW107XG4gIHRoaXMubm9kZXMgPSBbXTtcbiAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICBpZiAob2JqMiAhPSBudWxsICYmIG9iajIgaW5zdGFuY2VvZiBMR3JhcGhNYW5hZ2VyKSB7XG4gICAgdGhpcy5ncmFwaE1hbmFnZXIgPSBvYmoyO1xuICB9XG4gIGVsc2UgaWYgKG9iajIgIT0gbnVsbCAmJiBvYmoyIGluc3RhbmNlb2YgTGF5b3V0KSB7XG4gICAgdGhpcy5ncmFwaE1hbmFnZXIgPSBvYmoyLmdyYXBoTWFuYWdlcjtcbiAgfVxufVxuXG5MR3JhcGgucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhPYmplY3QucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoT2JqZWN0KSB7XG4gIExHcmFwaFtwcm9wXSA9IExHcmFwaE9iamVjdFtwcm9wXTtcbn1cblxuTEdyYXBoLnByb3RvdHlwZS5nZXROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubm9kZXM7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldEVkZ2VzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5lZGdlcztcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuZ2V0R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5wYXJlbnQ7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sZWZ0O1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRSaWdodCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnJpZ2h0O1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy50b3A7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmJvdHRvbTtcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5pc0Nvbm5lY3RlZDtcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG9iajEsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpIHtcbiAgaWYgKHNvdXJjZU5vZGUgPT0gbnVsbCAmJiB0YXJnZXROb2RlID09IG51bGwpIHtcbiAgICB2YXIgbmV3Tm9kZSA9IG9iajE7XG4gICAgaWYgKHRoaXMuZ3JhcGhNYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiR3JhcGggaGFzIG5vIGdyYXBoIG1nciFcIjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKG5ld05vZGUpID4gLTEpIHtcbiAgICAgIHRocm93IFwiTm9kZSBhbHJlYWR5IGluIGdyYXBoIVwiO1xuICAgIH1cbiAgICBuZXdOb2RlLm93bmVyID0gdGhpcztcbiAgICB0aGlzLmdldE5vZGVzKCkucHVzaChuZXdOb2RlKTtcblxuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBuZXdFZGdlID0gb2JqMTtcbiAgICBpZiAoISh0aGlzLmdldE5vZGVzKCkuaW5kZXhPZihzb3VyY2VOb2RlKSA+IC0xICYmICh0aGlzLmdldE5vZGVzKCkuaW5kZXhPZih0YXJnZXROb2RlKSkgPiAtMSkpIHtcbiAgICAgIHRocm93IFwiU291cmNlIG9yIHRhcmdldCBub3QgaW4gZ3JhcGghXCI7XG4gICAgfVxuXG4gICAgaWYgKCEoc291cmNlTm9kZS5vd25lciA9PSB0YXJnZXROb2RlLm93bmVyICYmIHNvdXJjZU5vZGUub3duZXIgPT0gdGhpcykpIHtcbiAgICAgIHRocm93IFwiQm90aCBvd25lcnMgbXVzdCBiZSB0aGlzIGdyYXBoIVwiO1xuICAgIH1cblxuICAgIGlmIChzb3VyY2VOb2RlLm93bmVyICE9IHRhcmdldE5vZGUub3duZXIpXG4gICAge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gc2V0IHNvdXJjZSBhbmQgdGFyZ2V0XG4gICAgbmV3RWRnZS5zb3VyY2UgPSBzb3VyY2VOb2RlO1xuICAgIG5ld0VkZ2UudGFyZ2V0ID0gdGFyZ2V0Tm9kZTtcblxuICAgIC8vIHNldCBhcyBpbnRyYS1ncmFwaCBlZGdlXG4gICAgbmV3RWRnZS5pc0ludGVyR3JhcGggPSBmYWxzZTtcblxuICAgIC8vIGFkZCB0byBncmFwaCBlZGdlIGxpc3RcbiAgICB0aGlzLmdldEVkZ2VzKCkucHVzaChuZXdFZGdlKTtcblxuICAgIC8vIGFkZCB0byBpbmNpZGVuY3kgbGlzdHNcbiAgICBzb3VyY2VOb2RlLmVkZ2VzLnB1c2gobmV3RWRnZSk7XG5cbiAgICBpZiAodGFyZ2V0Tm9kZSAhPSBzb3VyY2VOb2RlKVxuICAgIHtcbiAgICAgIHRhcmdldE5vZGUuZWRnZXMucHVzaChuZXdFZGdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3RWRnZTtcbiAgfVxufTtcblxuTEdyYXBoLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBub2RlID0gb2JqO1xuICBpZiAob2JqIGluc3RhbmNlb2YgTE5vZGUpIHtcbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBcIk5vZGUgaXMgbnVsbCFcIjtcbiAgICB9XG4gICAgaWYgKCEobm9kZS5vd25lciAhPSBudWxsICYmIG5vZGUub3duZXIgPT0gdGhpcykpIHtcbiAgICAgIHRocm93IFwiT3duZXIgZ3JhcGggaXMgaW52YWxpZCFcIjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3JhcGhNYW5hZ2VyID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiT3duZXIgZ3JhcGggbWFuYWdlciBpcyBpbnZhbGlkIVwiO1xuICAgIH1cbiAgICAvLyByZW1vdmUgaW5jaWRlbnQgZWRnZXMgZmlyc3QgKG1ha2UgYSBjb3B5IHRvIGRvIGl0IHNhZmVseSlcbiAgICB2YXIgZWRnZXNUb0JlUmVtb3ZlZCA9IG5vZGUuZWRnZXMuc2xpY2UoKTtcbiAgICB2YXIgZWRnZTtcbiAgICB2YXIgcyA9IGVkZ2VzVG9CZVJlbW92ZWQubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICAgIHtcbiAgICAgIGVkZ2UgPSBlZGdlc1RvQmVSZW1vdmVkW2ldO1xuXG4gICAgICBpZiAoZWRnZS5pc0ludGVyR3JhcGgpXG4gICAgICB7XG4gICAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlbW92ZShlZGdlKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgZWRnZS5zb3VyY2Uub3duZXIucmVtb3ZlKGVkZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5vdyB0aGUgbm9kZSBpdHNlbGZcbiAgICB2YXIgaW5kZXggPSB0aGlzLm5vZGVzLmluZGV4T2Yobm9kZSk7XG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICB0aHJvdyBcIk5vZGUgbm90IGluIG93bmVyIG5vZGUgbGlzdCFcIjtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTEVkZ2UpIHtcbiAgICB2YXIgZWRnZSA9IG9iajtcbiAgICBpZiAoZWRnZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBcIkVkZ2UgaXMgbnVsbCFcIjtcbiAgICB9XG4gICAgaWYgKCEoZWRnZS5zb3VyY2UgIT0gbnVsbCAmJiBlZGdlLnRhcmdldCAhPSBudWxsKSkge1xuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAoIShlZGdlLnNvdXJjZS5vd25lciAhPSBudWxsICYmIGVkZ2UudGFyZ2V0Lm93bmVyICE9IG51bGwgJiZcbiAgICAgICAgICAgIGVkZ2Uuc291cmNlLm93bmVyID09IHRoaXMgJiYgZWRnZS50YXJnZXQub3duZXIgPT0gdGhpcykpIHtcbiAgICAgIHRocm93IFwiU291cmNlIGFuZC9vciB0YXJnZXQgb3duZXIgaXMgaW52YWxpZCFcIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5kZXggPSBlZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKGVkZ2UpO1xuICAgIHZhciB0YXJnZXRJbmRleCA9IGVkZ2UudGFyZ2V0LmVkZ2VzLmluZGV4T2YoZWRnZSk7XG4gICAgaWYgKCEoc291cmNlSW5kZXggPiAtMSAmJiB0YXJnZXRJbmRleCA+IC0xKSkge1xuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBkb2Vzbid0IGtub3cgdGhpcyBlZGdlIVwiO1xuICAgIH1cblxuICAgIGVkZ2Uuc291cmNlLmVkZ2VzLnNwbGljZShzb3VyY2VJbmRleCwgMSk7XG5cbiAgICBpZiAoZWRnZS50YXJnZXQgIT0gZWRnZS5zb3VyY2UpXG4gICAge1xuICAgICAgZWRnZS50YXJnZXQuZWRnZXMuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSBlZGdlLnNvdXJjZS5vd25lci5nZXRFZGdlcygpLmluZGV4T2YoZWRnZSk7XG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICB0aHJvdyBcIk5vdCBpbiBvd25lcidzIGVkZ2UgbGlzdCFcIjtcbiAgICB9XG5cbiAgICBlZGdlLnNvdXJjZS5vd25lci5nZXRFZGdlcygpLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbkxHcmFwaC5wcm90b3R5cGUudXBkYXRlTGVmdFRvcCA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciB0b3AgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIGxlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIG5vZGVUb3A7XG4gIHZhciBub2RlTGVmdDtcbiAgdmFyIG1hcmdpbjtcblxuICB2YXIgbm9kZXMgPSB0aGlzLmdldE5vZGVzKCk7XG4gIHZhciBzID0gbm9kZXMubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICB7XG4gICAgdmFyIGxOb2RlID0gbm9kZXNbaV07XG4gICAgbm9kZVRvcCA9IGxOb2RlLmdldFRvcCgpO1xuICAgIG5vZGVMZWZ0ID0gbE5vZGUuZ2V0TGVmdCgpO1xuXG4gICAgaWYgKHRvcCA+IG5vZGVUb3ApXG4gICAge1xuICAgICAgdG9wID0gbm9kZVRvcDtcbiAgICB9XG5cbiAgICBpZiAobGVmdCA+IG5vZGVMZWZ0KVxuICAgIHtcbiAgICAgIGxlZnQgPSBub2RlTGVmdDtcbiAgICB9XG4gIH1cblxuICAvLyBEbyB3ZSBoYXZlIGFueSBub2RlcyBpbiB0aGlzIGdyYXBoP1xuICBpZiAodG9wID09IEludGVnZXIuTUFYX1ZBTFVFKVxuICB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgXG4gIGlmKG5vZGVzWzBdLmdldFBhcmVudCgpLnBhZGRpbmdMZWZ0ICE9IHVuZGVmaW5lZCl7XG4gICAgbWFyZ2luID0gbm9kZXNbMF0uZ2V0UGFyZW50KCkucGFkZGluZ0xlZnQ7XG4gIH1cbiAgZWxzZXtcbiAgICBtYXJnaW4gPSB0aGlzLm1hcmdpbjtcbiAgfVxuXG4gIHRoaXMubGVmdCA9IGxlZnQgLSBtYXJnaW47XG4gIHRoaXMudG9wID0gdG9wIC0gbWFyZ2luO1xuXG4gIC8vIEFwcGx5IHRoZSBtYXJnaW5zIGFuZCByZXR1cm4gdGhlIHJlc3VsdFxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMubGVmdCwgdGhpcy50b3ApO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS51cGRhdGVCb3VuZHMgPSBmdW5jdGlvbiAocmVjdXJzaXZlKVxue1xuICAvLyBjYWxjdWxhdGUgYm91bmRzXG4gIHZhciBsZWZ0ID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciByaWdodCA9IC1JbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgYm90dG9tID0gLUludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgbm9kZUxlZnQ7XG4gIHZhciBub2RlUmlnaHQ7XG4gIHZhciBub2RlVG9wO1xuICB2YXIgbm9kZUJvdHRvbTtcbiAgdmFyIG1hcmdpbjtcblxuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICB2YXIgcyA9IG5vZGVzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gIHtcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcblxuICAgIGlmIChyZWN1cnNpdmUgJiYgbE5vZGUuY2hpbGQgIT0gbnVsbClcbiAgICB7XG4gICAgICBsTm9kZS51cGRhdGVCb3VuZHMoKTtcbiAgICB9XG4gICAgbm9kZUxlZnQgPSBsTm9kZS5nZXRMZWZ0KCk7XG4gICAgbm9kZVJpZ2h0ID0gbE5vZGUuZ2V0UmlnaHQoKTtcbiAgICBub2RlVG9wID0gbE5vZGUuZ2V0VG9wKCk7XG4gICAgbm9kZUJvdHRvbSA9IGxOb2RlLmdldEJvdHRvbSgpO1xuXG4gICAgaWYgKGxlZnQgPiBub2RlTGVmdClcbiAgICB7XG4gICAgICBsZWZ0ID0gbm9kZUxlZnQ7XG4gICAgfVxuXG4gICAgaWYgKHJpZ2h0IDwgbm9kZVJpZ2h0KVxuICAgIHtcbiAgICAgIHJpZ2h0ID0gbm9kZVJpZ2h0O1xuICAgIH1cblxuICAgIGlmICh0b3AgPiBub2RlVG9wKVxuICAgIHtcbiAgICAgIHRvcCA9IG5vZGVUb3A7XG4gICAgfVxuXG4gICAgaWYgKGJvdHRvbSA8IG5vZGVCb3R0b20pXG4gICAge1xuICAgICAgYm90dG9tID0gbm9kZUJvdHRvbTtcbiAgICB9XG4gIH1cblxuICB2YXIgYm91bmRpbmdSZWN0ID0gbmV3IFJlY3RhbmdsZUQobGVmdCwgdG9wLCByaWdodCAtIGxlZnQsIGJvdHRvbSAtIHRvcCk7XG4gIGlmIChsZWZ0ID09IEludGVnZXIuTUFYX1ZBTFVFKVxuICB7XG4gICAgdGhpcy5sZWZ0ID0gdGhpcy5wYXJlbnQuZ2V0TGVmdCgpO1xuICAgIHRoaXMucmlnaHQgPSB0aGlzLnBhcmVudC5nZXRSaWdodCgpO1xuICAgIHRoaXMudG9wID0gdGhpcy5wYXJlbnQuZ2V0VG9wKCk7XG4gICAgdGhpcy5ib3R0b20gPSB0aGlzLnBhcmVudC5nZXRCb3R0b20oKTtcbiAgfVxuICBcbiAgaWYobm9kZXNbMF0uZ2V0UGFyZW50KCkucGFkZGluZ0xlZnQgIT0gdW5kZWZpbmVkKXtcbiAgICBtYXJnaW4gPSBub2Rlc1swXS5nZXRQYXJlbnQoKS5wYWRkaW5nTGVmdDtcbiAgfVxuICBlbHNle1xuICAgIG1hcmdpbiA9IHRoaXMubWFyZ2luO1xuICB9XG5cbiAgdGhpcy5sZWZ0ID0gYm91bmRpbmdSZWN0LnggLSBtYXJnaW47XG4gIHRoaXMucmlnaHQgPSBib3VuZGluZ1JlY3QueCArIGJvdW5kaW5nUmVjdC53aWR0aCArIG1hcmdpbjtcbiAgdGhpcy50b3AgPSBib3VuZGluZ1JlY3QueSAtIG1hcmdpbjtcbiAgdGhpcy5ib3R0b20gPSBib3VuZGluZ1JlY3QueSArIGJvdW5kaW5nUmVjdC5oZWlnaHQgKyBtYXJnaW47XG59O1xuXG5MR3JhcGguY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKG5vZGVzKVxue1xuICB2YXIgbGVmdCA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgcmlnaHQgPSAtSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciB0b3AgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIGJvdHRvbSA9IC1JbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIG5vZGVMZWZ0O1xuICB2YXIgbm9kZVJpZ2h0O1xuICB2YXIgbm9kZVRvcDtcbiAgdmFyIG5vZGVCb3R0b207XG5cbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gIHtcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcbiAgICBub2RlTGVmdCA9IGxOb2RlLmdldExlZnQoKTtcbiAgICBub2RlUmlnaHQgPSBsTm9kZS5nZXRSaWdodCgpO1xuICAgIG5vZGVUb3AgPSBsTm9kZS5nZXRUb3AoKTtcbiAgICBub2RlQm90dG9tID0gbE5vZGUuZ2V0Qm90dG9tKCk7XG5cbiAgICBpZiAobGVmdCA+IG5vZGVMZWZ0KVxuICAgIHtcbiAgICAgIGxlZnQgPSBub2RlTGVmdDtcbiAgICB9XG5cbiAgICBpZiAocmlnaHQgPCBub2RlUmlnaHQpXG4gICAge1xuICAgICAgcmlnaHQgPSBub2RlUmlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKHRvcCA+IG5vZGVUb3ApXG4gICAge1xuICAgICAgdG9wID0gbm9kZVRvcDtcbiAgICB9XG5cbiAgICBpZiAoYm90dG9tIDwgbm9kZUJvdHRvbSlcbiAgICB7XG4gICAgICBib3R0b20gPSBub2RlQm90dG9tO1xuICAgIH1cbiAgfVxuXG4gIHZhciBib3VuZGluZ1JlY3QgPSBuZXcgUmVjdGFuZ2xlRChsZWZ0LCB0b3AsIHJpZ2h0IC0gbGVmdCwgYm90dG9tIC0gdG9wKTtcblxuICByZXR1cm4gYm91bmRpbmdSZWN0O1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRJbmNsdXNpb25UcmVlRGVwdGggPSBmdW5jdGlvbiAoKVxue1xuICBpZiAodGhpcyA9PSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkpXG4gIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0SW5jbHVzaW9uVHJlZURlcHRoKCk7XG4gIH1cbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuZ2V0RXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpXG57XG4gIGlmICh0aGlzLmVzdGltYXRlZFNpemUgPT0gSW50ZWdlci5NSU5fVkFMVUUpIHtcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgfVxuICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5jYWxjRXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBzaXplID0gMDtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gIHtcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcbiAgICBzaXplICs9IGxOb2RlLmNhbGNFc3RpbWF0ZWRTaXplKCk7XG4gIH1cblxuICBpZiAoc2l6ZSA9PSAwKVxuICB7XG4gICAgdGhpcy5lc3RpbWF0ZWRTaXplID0gTGF5b3V0Q29uc3RhbnRzLkVNUFRZX0NPTVBPVU5EX05PREVfU0laRTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICB0aGlzLmVzdGltYXRlZFNpemUgPSBzaXplIC8gTWF0aC5zcXJ0KHRoaXMubm9kZXMubGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemU7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLnVwZGF0ZUNvbm5lY3RlZCA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBzZWxmID0gdGhpcztcbiAgaWYgKHRoaXMubm9kZXMubGVuZ3RoID09IDApXG4gIHtcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdG9CZVZpc2l0ZWQgPSBuZXcgTGlzdCgpO1xuICB2YXIgdmlzaXRlZCA9IG5ldyBIYXNoU2V0KCk7XG4gIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMubm9kZXNbMF07XG4gIHZhciBuZWlnaGJvckVkZ2VzO1xuICB2YXIgY3VycmVudE5laWdoYm9yO1xuICB2YXIgY2hpbGRyZW5PZk5vZGUgPSBjdXJyZW50Tm9kZS53aXRoQ2hpbGRyZW4oKTtcbiAgY2hpbGRyZW5PZk5vZGUuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgdG9CZVZpc2l0ZWQucHVzaChub2RlKTtcbiAgfSk7XG5cbiAgd2hpbGUgKCF0b0JlVmlzaXRlZC5pc0VtcHR5KCkpXG4gIHtcbiAgICBjdXJyZW50Tm9kZSA9IHRvQmVWaXNpdGVkLnNoaWZ0KCkudmFsdWUoKTtcbiAgICB2aXNpdGVkLmFkZChjdXJyZW50Tm9kZSk7XG5cbiAgICAvLyBUcmF2ZXJzZSBhbGwgbmVpZ2hib3JzIG9mIHRoaXMgbm9kZVxuICAgIG5laWdoYm9yRWRnZXMgPSBjdXJyZW50Tm9kZS5nZXRFZGdlcygpO1xuICAgIHZhciBzID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gICAge1xuICAgICAgdmFyIG5laWdoYm9yRWRnZSA9IG5laWdoYm9yRWRnZXNbaV07XG4gICAgICBjdXJyZW50TmVpZ2hib3IgPVxuICAgICAgICAgICAgICBuZWlnaGJvckVkZ2UuZ2V0T3RoZXJFbmRJbkdyYXBoKGN1cnJlbnROb2RlLCB0aGlzKTtcblxuICAgICAgLy8gQWRkIHVudmlzaXRlZCBuZWlnaGJvcnMgdG8gdGhlIGxpc3QgdG8gdmlzaXRcbiAgICAgIGlmIChjdXJyZW50TmVpZ2hib3IgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAhdmlzaXRlZC5jb250YWlucyhjdXJyZW50TmVpZ2hib3IpKVxuICAgICAge1xuICAgICAgICB2YXIgY2hpbGRyZW5PZk5laWdoYm9yID0gY3VycmVudE5laWdoYm9yLndpdGhDaGlsZHJlbigpO1xuICAgICAgICBcbiAgICAgICAgY2hpbGRyZW5PZk5laWdoYm9yLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgIHRvQmVWaXNpdGVkLnB1c2gobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcblxuICBpZiAodmlzaXRlZC5zaXplKCkgPj0gdGhpcy5ub2Rlcy5sZW5ndGgpXG4gIHtcbiAgICB2YXIgbm9PZlZpc2l0ZWRJblRoaXNHcmFwaCA9IDA7XG4gICAgXG4gICAgdmFyIHMgPSB2aXNpdGVkLnNpemUoKTtcbiAgICAgT2JqZWN0LmtleXModmlzaXRlZC5zZXQpLmZvckVhY2goZnVuY3Rpb24odmlzaXRlZElkKSB7XG4gICAgICB2YXIgdmlzaXRlZE5vZGUgPSB2aXNpdGVkLnNldFt2aXNpdGVkSWRdO1xuICAgICAgaWYgKHZpc2l0ZWROb2RlLm93bmVyID09IHNlbGYpXG4gICAgICB7XG4gICAgICAgIG5vT2ZWaXNpdGVkSW5UaGlzR3JhcGgrKztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChub09mVmlzaXRlZEluVGhpc0dyYXBoID09IHRoaXMubm9kZXMubGVuZ3RoKVxuICAgIHtcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGg7XG4iLCJ2YXIgTEdyYXBoO1xudmFyIExFZGdlID0gcmVxdWlyZSgnLi9MRWRnZScpO1xuXG5mdW5jdGlvbiBMR3JhcGhNYW5hZ2VyKGxheW91dCkge1xuICBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpOyAvLyBJdCBtYXkgYmUgYmV0dGVyIHRvIGluaXRpbGl6ZSB0aGlzIG91dCBvZiB0aGlzIGZ1bmN0aW9uIGJ1dCBpdCBnaXZlcyBhbiBlcnJvciAoUmlnaHQtaGFuZCBzaWRlIG9mICdpbnN0YW5jZW9mJyBpcyBub3QgY2FsbGFibGUpIG5vdy5cbiAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG5cbiAgdGhpcy5ncmFwaHMgPSBbXTtcbiAgdGhpcy5lZGdlcyA9IFtdO1xufVxuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5hZGRSb290ID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIG5ncmFwaCA9IHRoaXMubGF5b3V0Lm5ld0dyYXBoKCk7XG4gIHZhciBubm9kZSA9IHRoaXMubGF5b3V0Lm5ld05vZGUobnVsbCk7XG4gIHZhciByb290ID0gdGhpcy5hZGQobmdyYXBoLCBubm9kZSk7XG4gIHRoaXMuc2V0Um9vdEdyYXBoKHJvb3QpO1xuICByZXR1cm4gdGhpcy5yb290R3JhcGg7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAobmV3R3JhcGgsIHBhcmVudE5vZGUsIG5ld0VkZ2UsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpXG57XG4gIC8vdGhlcmUgYXJlIGp1c3QgMiBwYXJhbWV0ZXJzIGFyZSBwYXNzZWQgdGhlbiBpdCBhZGRzIGFuIExHcmFwaCBlbHNlIGl0IGFkZHMgYW4gTEVkZ2VcbiAgaWYgKG5ld0VkZ2UgPT0gbnVsbCAmJiBzb3VyY2VOb2RlID09IG51bGwgJiYgdGFyZ2V0Tm9kZSA9PSBudWxsKSB7XG4gICAgaWYgKG5ld0dyYXBoID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiR3JhcGggaXMgbnVsbCFcIjtcbiAgICB9XG4gICAgaWYgKHBhcmVudE5vZGUgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJQYXJlbnQgbm9kZSBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmFwaHMuaW5kZXhPZihuZXdHcmFwaCkgPiAtMSkge1xuICAgICAgdGhyb3cgXCJHcmFwaCBhbHJlYWR5IGluIHRoaXMgZ3JhcGggbWdyIVwiO1xuICAgIH1cblxuICAgIHRoaXMuZ3JhcGhzLnB1c2gobmV3R3JhcGgpO1xuXG4gICAgaWYgKG5ld0dyYXBoLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICB0aHJvdyBcIkFscmVhZHkgaGFzIGEgcGFyZW50IVwiO1xuICAgIH1cbiAgICBpZiAocGFyZW50Tm9kZS5jaGlsZCAhPSBudWxsKSB7XG4gICAgICB0aHJvdyAgXCJBbHJlYWR5IGhhcyBhIGNoaWxkIVwiO1xuICAgIH1cblxuICAgIG5ld0dyYXBoLnBhcmVudCA9IHBhcmVudE5vZGU7XG4gICAgcGFyZW50Tm9kZS5jaGlsZCA9IG5ld0dyYXBoO1xuXG4gICAgcmV0dXJuIG5ld0dyYXBoO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY2hhbmdlIHRoZSBvcmRlciBvZiB0aGUgcGFyYW1ldGVyc1xuICAgIHRhcmdldE5vZGUgPSBuZXdFZGdlO1xuICAgIHNvdXJjZU5vZGUgPSBwYXJlbnROb2RlO1xuICAgIG5ld0VkZ2UgPSBuZXdHcmFwaDtcbiAgICB2YXIgc291cmNlR3JhcGggPSBzb3VyY2VOb2RlLmdldE93bmVyKCk7XG4gICAgdmFyIHRhcmdldEdyYXBoID0gdGFyZ2V0Tm9kZS5nZXRPd25lcigpO1xuXG4gICAgaWYgKCEoc291cmNlR3JhcGggIT0gbnVsbCAmJiBzb3VyY2VHcmFwaC5nZXRHcmFwaE1hbmFnZXIoKSA9PSB0aGlzKSkge1xuICAgICAgdGhyb3cgXCJTb3VyY2Ugbm90IGluIHRoaXMgZ3JhcGggbWdyIVwiO1xuICAgIH1cbiAgICBpZiAoISh0YXJnZXRHcmFwaCAhPSBudWxsICYmIHRhcmdldEdyYXBoLmdldEdyYXBoTWFuYWdlcigpID09IHRoaXMpKSB7XG4gICAgICB0aHJvdyBcIlRhcmdldCBub3QgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZUdyYXBoID09IHRhcmdldEdyYXBoKVxuICAgIHtcbiAgICAgIG5ld0VkZ2UuaXNJbnRlckdyYXBoID0gZmFsc2U7XG4gICAgICByZXR1cm4gc291cmNlR3JhcGguYWRkKG5ld0VkZ2UsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgbmV3RWRnZS5pc0ludGVyR3JhcGggPSB0cnVlO1xuXG4gICAgICAvLyBzZXQgc291cmNlIGFuZCB0YXJnZXRcbiAgICAgIG5ld0VkZ2Uuc291cmNlID0gc291cmNlTm9kZTtcbiAgICAgIG5ld0VkZ2UudGFyZ2V0ID0gdGFyZ2V0Tm9kZTtcblxuICAgICAgLy8gYWRkIGVkZ2UgdG8gaW50ZXItZ3JhcGggZWRnZSBsaXN0XG4gICAgICBpZiAodGhpcy5lZGdlcy5pbmRleE9mKG5ld0VkZ2UpID4gLTEpIHtcbiAgICAgICAgdGhyb3cgXCJFZGdlIGFscmVhZHkgaW4gaW50ZXItZ3JhcGggZWRnZSBsaXN0IVwiO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVkZ2VzLnB1c2gobmV3RWRnZSk7XG5cbiAgICAgIC8vIGFkZCBlZGdlIHRvIHNvdXJjZSBhbmQgdGFyZ2V0IGluY2lkZW5jeSBsaXN0c1xuICAgICAgaWYgKCEobmV3RWRnZS5zb3VyY2UgIT0gbnVsbCAmJiBuZXdFZGdlLnRhcmdldCAhPSBudWxsKSkge1xuICAgICAgICB0aHJvdyBcIkVkZ2Ugc291cmNlIGFuZC9vciB0YXJnZXQgaXMgbnVsbCFcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCEobmV3RWRnZS5zb3VyY2UuZWRnZXMuaW5kZXhPZihuZXdFZGdlKSA9PSAtMSAmJiBuZXdFZGdlLnRhcmdldC5lZGdlcy5pbmRleE9mKG5ld0VkZ2UpID09IC0xKSkge1xuICAgICAgICB0aHJvdyBcIkVkZ2UgYWxyZWFkeSBpbiBzb3VyY2UgYW5kL29yIHRhcmdldCBpbmNpZGVuY3kgbGlzdCFcIjtcbiAgICAgIH1cblxuICAgICAgbmV3RWRnZS5zb3VyY2UuZWRnZXMucHVzaChuZXdFZGdlKTtcbiAgICAgIG5ld0VkZ2UudGFyZ2V0LmVkZ2VzLnB1c2gobmV3RWRnZSk7XG5cbiAgICAgIHJldHVybiBuZXdFZGdlO1xuICAgIH1cbiAgfVxufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGxPYmopIHtcbiAgaWYgKGxPYmogaW5zdGFuY2VvZiBMR3JhcGgpIHtcbiAgICB2YXIgZ3JhcGggPSBsT2JqO1xuICAgIGlmIChncmFwaC5nZXRHcmFwaE1hbmFnZXIoKSAhPSB0aGlzKSB7XG4gICAgICB0aHJvdyBcIkdyYXBoIG5vdCBpbiB0aGlzIGdyYXBoIG1nclwiO1xuICAgIH1cbiAgICBpZiAoIShncmFwaCA9PSB0aGlzLnJvb3RHcmFwaCB8fCAoZ3JhcGgucGFyZW50ICE9IG51bGwgJiYgZ3JhcGgucGFyZW50LmdyYXBoTWFuYWdlciA9PSB0aGlzKSkpIHtcbiAgICAgIHRocm93IFwiSW52YWxpZCBwYXJlbnQgbm9kZSFcIjtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCB0aGUgZWRnZXMgKG1ha2UgYSBjb3B5IHRvIGRvIGl0IHNhZmVseSlcbiAgICB2YXIgZWRnZXNUb0JlUmVtb3ZlZCA9IFtdO1xuXG4gICAgZWRnZXNUb0JlUmVtb3ZlZCA9IGVkZ2VzVG9CZVJlbW92ZWQuY29uY2F0KGdyYXBoLmdldEVkZ2VzKCkpO1xuXG4gICAgdmFyIGVkZ2U7XG4gICAgdmFyIHMgPSBlZGdlc1RvQmVSZW1vdmVkLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAgICB7XG4gICAgICBlZGdlID0gZWRnZXNUb0JlUmVtb3ZlZFtpXTtcbiAgICAgIGdyYXBoLnJlbW92ZShlZGdlKTtcbiAgICB9XG5cbiAgICAvLyB0aGVuIHRoZSBub2RlcyAobWFrZSBhIGNvcHkgdG8gZG8gaXQgc2FmZWx5KVxuICAgIHZhciBub2Rlc1RvQmVSZW1vdmVkID0gW107XG5cbiAgICBub2Rlc1RvQmVSZW1vdmVkID0gbm9kZXNUb0JlUmVtb3ZlZC5jb25jYXQoZ3JhcGguZ2V0Tm9kZXMoKSk7XG5cbiAgICB2YXIgbm9kZTtcbiAgICBzID0gbm9kZXNUb0JlUmVtb3ZlZC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gICAge1xuICAgICAgbm9kZSA9IG5vZGVzVG9CZVJlbW92ZWRbaV07XG4gICAgICBncmFwaC5yZW1vdmUobm9kZSk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgZ3JhcGggaXMgdGhlIHJvb3RcbiAgICBpZiAoZ3JhcGggPT0gdGhpcy5yb290R3JhcGgpXG4gICAge1xuICAgICAgdGhpcy5zZXRSb290R3JhcGgobnVsbCk7XG4gICAgfVxuXG4gICAgLy8gbm93IHJlbW92ZSB0aGUgZ3JhcGggaXRzZWxmXG4gICAgdmFyIGluZGV4ID0gdGhpcy5ncmFwaHMuaW5kZXhPZihncmFwaCk7XG4gICAgdGhpcy5ncmFwaHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIC8vIGFsc28gcmVzZXQgdGhlIHBhcmVudCBvZiB0aGUgZ3JhcGhcbiAgICBncmFwaC5wYXJlbnQgPSBudWxsO1xuICB9XG4gIGVsc2UgaWYgKGxPYmogaW5zdGFuY2VvZiBMRWRnZSkge1xuICAgIGVkZ2UgPSBsT2JqO1xuICAgIGlmIChlZGdlID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiRWRnZSBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAoIWVkZ2UuaXNJbnRlckdyYXBoKSB7XG4gICAgICB0aHJvdyBcIk5vdCBhbiBpbnRlci1ncmFwaCBlZGdlIVwiO1xuICAgIH1cbiAgICBpZiAoIShlZGdlLnNvdXJjZSAhPSBudWxsICYmIGVkZ2UudGFyZ2V0ICE9IG51bGwpKSB7XG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGlzIG51bGwhXCI7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGVkZ2UgZnJvbSBzb3VyY2UgYW5kIHRhcmdldCBub2RlcycgaW5jaWRlbmN5IGxpc3RzXG5cbiAgICBpZiAoIShlZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKGVkZ2UpICE9IC0xICYmIGVkZ2UudGFyZ2V0LmVkZ2VzLmluZGV4T2YoZWRnZSkgIT0gLTEpKSB7XG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGRvZXNuJ3Qga25vdyB0aGlzIGVkZ2UhXCI7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gZWRnZS5zb3VyY2UuZWRnZXMuaW5kZXhPZihlZGdlKTtcbiAgICBlZGdlLnNvdXJjZS5lZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGluZGV4ID0gZWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihlZGdlKTtcbiAgICBlZGdlLnRhcmdldC5lZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gcmVtb3ZlIGVkZ2UgZnJvbSBvd25lciBncmFwaCBtYW5hZ2VyJ3MgaW50ZXItZ3JhcGggZWRnZSBsaXN0XG5cbiAgICBpZiAoIShlZGdlLnNvdXJjZS5vd25lciAhPSBudWxsICYmIGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpICE9IG51bGwpKSB7XG4gICAgICB0aHJvdyBcIkVkZ2Ugb3duZXIgZ3JhcGggb3Igb3duZXIgZ3JhcGggbWFuYWdlciBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAoZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkuZWRnZXMuaW5kZXhPZihlZGdlKSA9PSAtMSkge1xuICAgICAgdGhyb3cgXCJOb3QgaW4gb3duZXIgZ3JhcGggbWFuYWdlcidzIGVkZ2UgbGlzdCFcIjtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSBlZGdlLnNvdXJjZS5vd25lci5nZXRHcmFwaE1hbmFnZXIoKS5lZGdlcy5pbmRleE9mKGVkZ2UpO1xuICAgIGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpLmVkZ2VzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpXG57XG4gIHRoaXMucm9vdEdyYXBoLnVwZGF0ZUJvdW5kcyh0cnVlKTtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEdyYXBocyA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmdyYXBocztcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEFsbE5vZGVzID0gZnVuY3Rpb24gKClcbntcbiAgaWYgKHRoaXMuYWxsTm9kZXMgPT0gbnVsbClcbiAge1xuICAgIHZhciBub2RlTGlzdCA9IFtdO1xuICAgIHZhciBncmFwaHMgPSB0aGlzLmdldEdyYXBocygpO1xuICAgIHZhciBzID0gZ3JhcGhzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAgICB7XG4gICAgICBub2RlTGlzdCA9IG5vZGVMaXN0LmNvbmNhdChncmFwaHNbaV0uZ2V0Tm9kZXMoKSk7XG4gICAgfVxuICAgIHRoaXMuYWxsTm9kZXMgPSBub2RlTGlzdDtcbiAgfVxuICByZXR1cm4gdGhpcy5hbGxOb2Rlcztcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlc2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKVxue1xuICB0aGlzLmFsbE5vZGVzID0gbnVsbDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlc2V0QWxsRWRnZXMgPSBmdW5jdGlvbiAoKVxue1xuICB0aGlzLmFsbEVkZ2VzID0gbnVsbDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBmdW5jdGlvbiAoKVxue1xuICB0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gbnVsbDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEFsbEVkZ2VzID0gZnVuY3Rpb24gKClcbntcbiAgaWYgKHRoaXMuYWxsRWRnZXMgPT0gbnVsbClcbiAge1xuICAgIHZhciBlZGdlTGlzdCA9IFtdO1xuICAgIHZhciBncmFwaHMgPSB0aGlzLmdldEdyYXBocygpO1xuICAgIHZhciBzID0gZ3JhcGhzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyYXBocy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdChncmFwaHNbaV0uZ2V0RWRnZXMoKSk7XG4gICAgfVxuXG4gICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQodGhpcy5lZGdlcyk7XG5cbiAgICB0aGlzLmFsbEVkZ2VzID0gZWRnZUxpc3Q7XG4gIH1cbiAgcmV0dXJuIHRoaXMuYWxsRWRnZXM7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBmdW5jdGlvbiAobm9kZUxpc3QpXG57XG4gIGlmICh0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uICE9IG51bGwpIHtcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgfVxuXG4gIHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBub2RlTGlzdDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldFJvb3QgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yb290R3JhcGg7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5zZXRSb290R3JhcGggPSBmdW5jdGlvbiAoZ3JhcGgpXG57XG4gIGlmIChncmFwaC5nZXRHcmFwaE1hbmFnZXIoKSAhPSB0aGlzKSB7XG4gICAgdGhyb3cgXCJSb290IG5vdCBpbiB0aGlzIGdyYXBoIG1nciFcIjtcbiAgfVxuXG4gIHRoaXMucm9vdEdyYXBoID0gZ3JhcGg7XG4gIC8vIHJvb3QgZ3JhcGggbXVzdCBoYXZlIGEgcm9vdCBub2RlIGFzc29jaWF0ZWQgd2l0aCBpdCBmb3IgY29udmVuaWVuY2VcbiAgaWYgKGdyYXBoLnBhcmVudCA9PSBudWxsKVxuICB7XG4gICAgZ3JhcGgucGFyZW50ID0gdGhpcy5sYXlvdXQubmV3Tm9kZShcIlJvb3Qgbm9kZVwiKTtcbiAgfVxufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0TGF5b3V0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubGF5b3V0O1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuaXNPbmVBbmNlc3Rvck9mT3RoZXIgPSBmdW5jdGlvbiAoZmlyc3ROb2RlLCBzZWNvbmROb2RlKVxue1xuICBpZiAoIShmaXJzdE5vZGUgIT0gbnVsbCAmJiBzZWNvbmROb2RlICE9IG51bGwpKSB7XG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XG4gIH1cblxuICBpZiAoZmlyc3ROb2RlID09IHNlY29uZE5vZGUpXG4gIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICAvLyBJcyBzZWNvbmQgbm9kZSBhbiBhbmNlc3RvciBvZiB0aGUgZmlyc3Qgb25lP1xuICB2YXIgb3duZXJHcmFwaCA9IGZpcnN0Tm9kZS5nZXRPd25lcigpO1xuICB2YXIgcGFyZW50Tm9kZTtcblxuICBkb1xuICB7XG4gICAgcGFyZW50Tm9kZSA9IG93bmVyR3JhcGguZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnROb2RlID09IHNlY29uZE5vZGUpXG4gICAge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgb3duZXJHcmFwaCA9IHBhcmVudE5vZGUuZ2V0T3duZXIoKTtcbiAgICBpZiAob3duZXJHcmFwaCA9PSBudWxsKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7XG4gIC8vIElzIGZpcnN0IG5vZGUgYW4gYW5jZXN0b3Igb2YgdGhlIHNlY29uZCBvbmU/XG4gIG93bmVyR3JhcGggPSBzZWNvbmROb2RlLmdldE93bmVyKCk7XG5cbiAgZG9cbiAge1xuICAgIHBhcmVudE5vZGUgPSBvd25lckdyYXBoLmdldFBhcmVudCgpO1xuXG4gICAgaWYgKHBhcmVudE5vZGUgPT0gbnVsbClcbiAgICB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAocGFyZW50Tm9kZSA9PSBmaXJzdE5vZGUpXG4gICAge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgb3duZXJHcmFwaCA9IHBhcmVudE5vZGUuZ2V0T3duZXIoKTtcbiAgICBpZiAob3duZXJHcmFwaCA9PSBudWxsKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9ycyA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBlZGdlO1xuICB2YXIgc291cmNlTm9kZTtcbiAgdmFyIHRhcmdldE5vZGU7XG4gIHZhciBzb3VyY2VBbmNlc3RvckdyYXBoO1xuICB2YXIgdGFyZ2V0QW5jZXN0b3JHcmFwaDtcblxuICB2YXIgZWRnZXMgPSB0aGlzLmdldEFsbEVkZ2VzKCk7XG4gIHZhciBzID0gZWRnZXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIGVkZ2UgPSBlZGdlc1tpXTtcblxuICAgIHNvdXJjZU5vZGUgPSBlZGdlLnNvdXJjZTtcbiAgICB0YXJnZXROb2RlID0gZWRnZS50YXJnZXQ7XG4gICAgZWRnZS5sY2EgPSBudWxsO1xuICAgIGVkZ2Uuc291cmNlSW5MY2EgPSBzb3VyY2VOb2RlO1xuICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXROb2RlO1xuXG4gICAgaWYgKHNvdXJjZU5vZGUgPT0gdGFyZ2V0Tm9kZSlcbiAgICB7XG4gICAgICBlZGdlLmxjYSA9IHNvdXJjZU5vZGUuZ2V0T3duZXIoKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHNvdXJjZUFuY2VzdG9yR3JhcGggPSBzb3VyY2VOb2RlLmdldE93bmVyKCk7XG5cbiAgICB3aGlsZSAoZWRnZS5sY2EgPT0gbnVsbClcbiAgICB7XG4gICAgICBlZGdlLnRhcmdldEluTGNhID0gdGFyZ2V0Tm9kZTsgIFxuICAgICAgdGFyZ2V0QW5jZXN0b3JHcmFwaCA9IHRhcmdldE5vZGUuZ2V0T3duZXIoKTtcblxuICAgICAgd2hpbGUgKGVkZ2UubGNhID09IG51bGwpXG4gICAgICB7XG4gICAgICAgIGlmICh0YXJnZXRBbmNlc3RvckdyYXBoID09IHNvdXJjZUFuY2VzdG9yR3JhcGgpXG4gICAgICAgIHtcbiAgICAgICAgICBlZGdlLmxjYSA9IHRhcmdldEFuY2VzdG9yR3JhcGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0QW5jZXN0b3JHcmFwaCA9PSB0aGlzLnJvb3RHcmFwaClcbiAgICAgICAge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVkZ2UubGNhICE9IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBlZGdlLnRhcmdldEluTGNhID0gdGFyZ2V0QW5jZXN0b3JHcmFwaC5nZXRQYXJlbnQoKTtcbiAgICAgICAgdGFyZ2V0QW5jZXN0b3JHcmFwaCA9IGVkZ2UudGFyZ2V0SW5MY2EuZ2V0T3duZXIoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNvdXJjZUFuY2VzdG9yR3JhcGggPT0gdGhpcy5yb290R3JhcGgpXG4gICAgICB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWRnZS5sY2EgPT0gbnVsbClcbiAgICAgIHtcbiAgICAgICAgZWRnZS5zb3VyY2VJbkxjYSA9IHNvdXJjZUFuY2VzdG9yR3JhcGguZ2V0UGFyZW50KCk7XG4gICAgICAgIHNvdXJjZUFuY2VzdG9yR3JhcGggPSBlZGdlLnNvdXJjZUluTGNhLmdldE93bmVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVkZ2UubGNhID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICAgIH1cbiAgfVxufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9yID0gZnVuY3Rpb24gKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSlcbntcbiAgaWYgKGZpcnN0Tm9kZSA9PSBzZWNvbmROb2RlKVxuICB7XG4gICAgcmV0dXJuIGZpcnN0Tm9kZS5nZXRPd25lcigpO1xuICB9XG4gIHZhciBmaXJzdE93bmVyR3JhcGggPSBmaXJzdE5vZGUuZ2V0T3duZXIoKTtcblxuICBkb1xuICB7XG4gICAgaWYgKGZpcnN0T3duZXJHcmFwaCA9PSBudWxsKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgc2Vjb25kT3duZXJHcmFwaCA9IHNlY29uZE5vZGUuZ2V0T3duZXIoKTtcblxuICAgIGRvXG4gICAge1xuICAgICAgaWYgKHNlY29uZE93bmVyR3JhcGggPT0gbnVsbClcbiAgICAgIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWNvbmRPd25lckdyYXBoID09IGZpcnN0T3duZXJHcmFwaClcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHNlY29uZE93bmVyR3JhcGg7XG4gICAgICB9XG4gICAgICBzZWNvbmRPd25lckdyYXBoID0gc2Vjb25kT3duZXJHcmFwaC5nZXRQYXJlbnQoKS5nZXRPd25lcigpO1xuICAgIH0gd2hpbGUgKHRydWUpO1xuXG4gICAgZmlyc3RPd25lckdyYXBoID0gZmlyc3RPd25lckdyYXBoLmdldFBhcmVudCgpLmdldE93bmVyKCk7XG4gIH0gd2hpbGUgKHRydWUpO1xuXG4gIHJldHVybiBmaXJzdE93bmVyR3JhcGg7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jYWxjSW5jbHVzaW9uVHJlZURlcHRocyA9IGZ1bmN0aW9uIChncmFwaCwgZGVwdGgpIHtcbiAgaWYgKGdyYXBoID09IG51bGwgJiYgZGVwdGggPT0gbnVsbCkge1xuICAgIGdyYXBoID0gdGhpcy5yb290R3JhcGg7XG4gICAgZGVwdGggPSAxO1xuICB9XG4gIHZhciBub2RlO1xuXG4gIHZhciBub2RlcyA9IGdyYXBoLmdldE5vZGVzKCk7XG4gIHZhciBzID0gbm9kZXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBub2RlLmluY2x1c2lvblRyZWVEZXB0aCA9IGRlcHRoO1xuXG4gICAgaWYgKG5vZGUuY2hpbGQgIT0gbnVsbClcbiAgICB7XG4gICAgICB0aGlzLmNhbGNJbmNsdXNpb25UcmVlRGVwdGhzKG5vZGUuY2hpbGQsIGRlcHRoICsgMSk7XG4gICAgfVxuICB9XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5pbmNsdWRlc0ludmFsaWRFZGdlID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGVkZ2U7XG5cbiAgdmFyIHMgPSB0aGlzLmVkZ2VzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gIHtcbiAgICBlZGdlID0gdGhpcy5lZGdlc1tpXTtcblxuICAgIGlmICh0aGlzLmlzT25lQW5jZXN0b3JPZk90aGVyKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCkpXG4gICAge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTEdyYXBoTWFuYWdlcjtcbiIsImZ1bmN0aW9uIExHcmFwaE9iamVjdCh2R3JhcGhPYmplY3QpIHtcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2R3JhcGhPYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTEdyYXBoT2JqZWN0O1xuIiwidmFyIExHcmFwaE9iamVjdCA9IHJlcXVpcmUoJy4vTEdyYXBoT2JqZWN0Jyk7XG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xudmFyIFJlY3RhbmdsZUQgPSByZXF1aXJlKCcuL1JlY3RhbmdsZUQnKTtcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xudmFyIFJhbmRvbVNlZWQgPSByZXF1aXJlKCcuL1JhbmRvbVNlZWQnKTtcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcbnZhciBMYXlvdXQ7XG5cbmZ1bmN0aW9uIExOb2RlKGdtLCBsb2MsIHNpemUsIHZOb2RlKSB7XG4gIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG4gIC8vQWx0ZXJuYXRpdmUgY29uc3RydWN0b3IgMSA6IExOb2RlKExHcmFwaE1hbmFnZXIgZ20sIFBvaW50IGxvYywgRGltZW5zaW9uIHNpemUsIE9iamVjdCB2Tm9kZSlcbiAgaWYgKHNpemUgPT0gbnVsbCAmJiB2Tm9kZSA9PSBudWxsKSB7XG4gICAgdk5vZGUgPSBsb2M7XG4gIH1cblxuICBMR3JhcGhPYmplY3QuY2FsbCh0aGlzLCB2Tm9kZSk7XG5cbiAgLy9BbHRlcm5hdGl2ZSBjb25zdHJ1Y3RvciAyIDogTE5vZGUoTGF5b3V0IGxheW91dCwgT2JqZWN0IHZOb2RlKVxuICBpZiAoZ20gaW5zdGFuY2VvZiBMYXlvdXQgJiYgZ20uZ3JhcGhNYW5hZ2VyICE9IG51bGwpXG4gICAgZ20gPSBnbS5ncmFwaE1hbmFnZXI7XG5cbiAgdGhpcy5lc3RpbWF0ZWRTaXplID0gSW50ZWdlci5NSU5fVkFMVUU7XG4gIHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIHRoaXMudkdyYXBoT2JqZWN0ID0gdk5vZGU7XG4gIHRoaXMuZWRnZXMgPSBbXTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcblxuICBpZiAoc2l6ZSAhPSBudWxsICYmIGxvYyAhPSBudWxsKVxuICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0YW5nbGVEKGxvYy54LCBsb2MueSwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQpO1xuICBlbHNlXG4gICAgdGhpcy5yZWN0ID0gbmV3IFJlY3RhbmdsZUQoKTtcbn1cblxuTE5vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhPYmplY3QucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoT2JqZWN0KSB7XG4gIExOb2RlW3Byb3BdID0gTEdyYXBoT2JqZWN0W3Byb3BdO1xufVxuXG5MTm9kZS5wcm90b3R5cGUuZ2V0RWRnZXMgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5lZGdlcztcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRDaGlsZCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmNoaWxkO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldE93bmVyID0gZnVuY3Rpb24gKClcbntcbi8vICBpZiAodGhpcy5vd25lciAhPSBudWxsKSB7XG4vLyAgICBpZiAoISh0aGlzLm93bmVyID09IG51bGwgfHwgdGhpcy5vd25lci5nZXROb2RlcygpLmluZGV4T2YodGhpcykgPiAtMSkpIHtcbi8vICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XG4vLyAgICB9XG4vLyAgfVxuXG4gIHJldHVybiB0aGlzLm93bmVyO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC53aWR0aDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5zZXRXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aClcbntcbiAgdGhpcy5yZWN0LndpZHRoID0gd2lkdGg7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC5oZWlnaHQ7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodClcbntcbiAgdGhpcy5yZWN0LmhlaWdodCA9IGhlaWdodDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXJYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC54ICsgdGhpcy5yZWN0LndpZHRoIC8gMjtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXJZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC55ICsgdGhpcy5yZWN0LmhlaWdodCAvIDI7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIG5ldyBQb2ludEQodGhpcy5yZWN0LnggKyB0aGlzLnJlY3Qud2lkdGggLyAyLFxuICAgICAgICAgIHRoaXMucmVjdC55ICsgdGhpcy5yZWN0LmhlaWdodCAvIDIpO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldExvY2F0aW9uID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIG5ldyBQb2ludEQodGhpcy5yZWN0LngsIHRoaXMucmVjdC55KTtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRSZWN0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXREaWFnb25hbCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiBNYXRoLnNxcnQodGhpcy5yZWN0LndpZHRoICogdGhpcy5yZWN0LndpZHRoICtcbiAgICAgICAgICB0aGlzLnJlY3QuaGVpZ2h0ICogdGhpcy5yZWN0LmhlaWdodCk7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuc2V0UmVjdCA9IGZ1bmN0aW9uICh1cHBlckxlZnQsIGRpbWVuc2lvbilcbntcbiAgdGhpcy5yZWN0LnggPSB1cHBlckxlZnQueDtcbiAgdGhpcy5yZWN0LnkgPSB1cHBlckxlZnQueTtcbiAgdGhpcy5yZWN0LndpZHRoID0gZGltZW5zaW9uLndpZHRoO1xuICB0aGlzLnJlY3QuaGVpZ2h0ID0gZGltZW5zaW9uLmhlaWdodDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5zZXRDZW50ZXIgPSBmdW5jdGlvbiAoY3gsIGN5KVxue1xuICB0aGlzLnJlY3QueCA9IGN4IC0gdGhpcy5yZWN0LndpZHRoIC8gMjtcbiAgdGhpcy5yZWN0LnkgPSBjeSAtIHRoaXMucmVjdC5oZWlnaHQgLyAyO1xufTtcblxuTE5vZGUucHJvdG90eXBlLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKHgsIHkpXG57XG4gIHRoaXMucmVjdC54ID0geDtcbiAgdGhpcy5yZWN0LnkgPSB5O1xufTtcblxuTE5vZGUucHJvdG90eXBlLm1vdmVCeSA9IGZ1bmN0aW9uIChkeCwgZHkpXG57XG4gIHRoaXMucmVjdC54ICs9IGR4O1xuICB0aGlzLnJlY3QueSArPSBkeTtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRFZGdlTGlzdFRvTm9kZSA9IGZ1bmN0aW9uICh0bylcbntcbiAgdmFyIGVkZ2VMaXN0ID0gW107XG4gIHZhciBlZGdlO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICBcbiAgICBpZiAoZWRnZS50YXJnZXQgPT0gdG8pXG4gICAge1xuICAgICAgaWYgKGVkZ2Uuc291cmNlICE9IHNlbGYpXG4gICAgICAgIHRocm93IFwiSW5jb3JyZWN0IGVkZ2Ugc291cmNlIVwiO1xuXG4gICAgICBlZGdlTGlzdC5wdXNoKGVkZ2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVkZ2VMaXN0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldEVkZ2VzQmV0d2VlbiA9IGZ1bmN0aW9uIChvdGhlcilcbntcbiAgdmFyIGVkZ2VMaXN0ID0gW107XG4gIHZhciBlZGdlO1xuICBcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuXG4gICAgaWYgKCEoZWRnZS5zb3VyY2UgPT0gc2VsZiB8fCBlZGdlLnRhcmdldCA9PSBzZWxmKSlcbiAgICAgIHRocm93IFwiSW5jb3JyZWN0IGVkZ2Ugc291cmNlIGFuZC9vciB0YXJnZXRcIjtcblxuICAgIGlmICgoZWRnZS50YXJnZXQgPT0gb3RoZXIpIHx8IChlZGdlLnNvdXJjZSA9PSBvdGhlcikpXG4gICAge1xuICAgICAgZWRnZUxpc3QucHVzaChlZGdlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlZGdlTGlzdDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXROZWlnaGJvcnNMaXN0ID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIG5laWdoYm9ycyA9IG5ldyBIYXNoU2V0KCk7XG4gIHZhciBlZGdlO1xuICBcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuXG4gICAgaWYgKGVkZ2Uuc291cmNlID09IHNlbGYpXG4gICAge1xuICAgICAgbmVpZ2hib3JzLmFkZChlZGdlLnRhcmdldCk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBpZiAoZWRnZS50YXJnZXQgIT0gc2VsZikge1xuICAgICAgICB0aHJvdyBcIkluY29ycmVjdCBpbmNpZGVuY3khXCI7XG4gICAgICB9XG4gICAgXG4gICAgICBuZWlnaGJvcnMuYWRkKGVkZ2Uuc291cmNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBuZWlnaGJvcnM7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUud2l0aENoaWxkcmVuID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIHdpdGhOZWlnaGJvcnNMaXN0ID0gbmV3IFNldCgpO1xuICB2YXIgY2hpbGROb2RlO1xuICB2YXIgY2hpbGRyZW47XG5cbiAgd2l0aE5laWdoYm9yc0xpc3QuYWRkKHRoaXMpO1xuXG4gIGlmICh0aGlzLmNoaWxkICE9IG51bGwpXG4gIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmNoaWxkLmdldE5vZGVzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBjaGlsZE5vZGUgPSBub2Rlc1tpXTtcbiAgICAgIGNoaWxkcmVuID0gY2hpbGROb2RlLndpdGhDaGlsZHJlbigpO1xuICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHdpdGhOZWlnaGJvcnNMaXN0LmFkZChub2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3aXRoTmVpZ2hib3JzTGlzdDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXROb09mQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgbm9PZkNoaWxkcmVuID0gMDtcbiAgdmFyIGNoaWxkTm9kZTtcblxuICBpZih0aGlzLmNoaWxkID09IG51bGwpe1xuICAgIG5vT2ZDaGlsZHJlbiA9IDE7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5jaGlsZC5nZXROb2RlcygpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgY2hpbGROb2RlID0gbm9kZXNbaV07XG5cbiAgICAgIG5vT2ZDaGlsZHJlbiArPSBjaGlsZE5vZGUuZ2V0Tm9PZkNoaWxkcmVuKCk7XG4gICAgfVxuICB9XG4gIFxuICBpZihub09mQ2hpbGRyZW4gPT0gMCl7XG4gICAgbm9PZkNoaWxkcmVuID0gMTtcbiAgfVxuICByZXR1cm4gbm9PZkNoaWxkcmVuO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldEVzdGltYXRlZFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmVzdGltYXRlZFNpemUgPT0gSW50ZWdlci5NSU5fVkFMVUUpIHtcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgfVxuICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmNhbGNFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5jaGlsZCA9PSBudWxsKVxuICB7XG4gICAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZSA9ICh0aGlzLnJlY3Qud2lkdGggKyB0aGlzLnJlY3QuaGVpZ2h0KSAvIDI7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdGhpcy5lc3RpbWF0ZWRTaXplID0gdGhpcy5jaGlsZC5jYWxjRXN0aW1hdGVkU2l6ZSgpO1xuICAgIHRoaXMucmVjdC53aWR0aCA9IHRoaXMuZXN0aW1hdGVkU2l6ZTtcbiAgICB0aGlzLnJlY3QuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRTaXplO1xuXG4gICAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZTtcbiAgfVxufTtcblxuTE5vZGUucHJvdG90eXBlLnNjYXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByYW5kb21DZW50ZXJYO1xuICB2YXIgcmFuZG9tQ2VudGVyWTtcblxuICB2YXIgbWluWCA9IC1MYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWTtcbiAgdmFyIG1heFggPSBMYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWTtcbiAgcmFuZG9tQ2VudGVyWCA9IExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWCArXG4gICAgICAgICAgKFJhbmRvbVNlZWQubmV4dERvdWJsZSgpICogKG1heFggLSBtaW5YKSkgKyBtaW5YO1xuXG4gIHZhciBtaW5ZID0gLUxheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xuICB2YXIgbWF4WSA9IExheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xuICByYW5kb21DZW50ZXJZID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9ZICtcbiAgICAgICAgICAoUmFuZG9tU2VlZC5uZXh0RG91YmxlKCkgKiAobWF4WSAtIG1pblkpKSArIG1pblk7XG5cbiAgdGhpcy5yZWN0LnggPSByYW5kb21DZW50ZXJYO1xuICB0aGlzLnJlY3QueSA9IHJhbmRvbUNlbnRlcllcbn07XG5cbkxOb2RlLnByb3RvdHlwZS51cGRhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmdldENoaWxkKCkgPT0gbnVsbCkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG4gIGlmICh0aGlzLmdldENoaWxkKCkuZ2V0Tm9kZXMoKS5sZW5ndGggIT0gMClcbiAge1xuICAgIC8vIHdyYXAgdGhlIGNoaWxkcmVuIG5vZGVzIGJ5IHJlLWFycmFuZ2luZyB0aGUgYm91bmRhcmllc1xuICAgIHZhciBjaGlsZEdyYXBoID0gdGhpcy5nZXRDaGlsZCgpO1xuICAgIGNoaWxkR3JhcGgudXBkYXRlQm91bmRzKHRydWUpO1xuXG4gICAgdGhpcy5yZWN0LnggPSBjaGlsZEdyYXBoLmdldExlZnQoKTtcbiAgICB0aGlzLnJlY3QueSA9IGNoaWxkR3JhcGguZ2V0VG9wKCk7XG5cbiAgICB0aGlzLnNldFdpZHRoKGNoaWxkR3JhcGguZ2V0UmlnaHQoKSAtIGNoaWxkR3JhcGguZ2V0TGVmdCgpKTtcbiAgICB0aGlzLnNldEhlaWdodChjaGlsZEdyYXBoLmdldEJvdHRvbSgpIC0gY2hpbGRHcmFwaC5nZXRUb3AoKSk7XG4gICAgXG4gICAgLy8gVXBkYXRlIGNvbXBvdW5kIGJvdW5kcyBjb25zaWRlcmluZyBpdHMgbGFiZWwgcHJvcGVydGllcyAgICBcbiAgICBpZihMYXlvdXRDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTKXtcbiAgICAgICAgXG4gICAgICB2YXIgd2lkdGggPSBjaGlsZEdyYXBoLmdldFJpZ2h0KCkgLSBjaGlsZEdyYXBoLmdldExlZnQoKTtcbiAgICAgIHZhciBoZWlnaHQgPSBjaGlsZEdyYXBoLmdldEJvdHRvbSgpIC0gY2hpbGRHcmFwaC5nZXRUb3AoKTtcblxuICAgICAgaWYodGhpcy5sYWJlbFdpZHRoID4gd2lkdGgpe1xuICAgICAgICB0aGlzLnJlY3QueCAtPSAodGhpcy5sYWJlbFdpZHRoIC0gd2lkdGgpIC8gMjtcbiAgICAgICAgdGhpcy5zZXRXaWR0aCh0aGlzLmxhYmVsV2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmxhYmVsSGVpZ2h0ID4gaGVpZ2h0KXtcbiAgICAgICAgaWYodGhpcy5sYWJlbFBvcyA9PSBcImNlbnRlclwiKXtcbiAgICAgICAgICB0aGlzLnJlY3QueSAtPSAodGhpcy5sYWJlbEhlaWdodCAtIGhlaWdodCkgLyAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5sYWJlbFBvcyA9PSBcInRvcFwiKXtcbiAgICAgICAgICB0aGlzLnJlY3QueSAtPSAodGhpcy5sYWJlbEhlaWdodCAtIGhlaWdodCk7IFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVpZ2h0KHRoaXMubGFiZWxIZWlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuTE5vZGUucHJvdG90eXBlLmdldEluY2x1c2lvblRyZWVEZXB0aCA9IGZ1bmN0aW9uICgpXG57XG4gIGlmICh0aGlzLmluY2x1c2lvblRyZWVEZXB0aCA9PSBJbnRlZ2VyLk1BWF9WQUxVRSkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG4gIHJldHVybiB0aGlzLmluY2x1c2lvblRyZWVEZXB0aDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAodHJhbnMpXG57XG4gIHZhciBsZWZ0ID0gdGhpcy5yZWN0Lng7XG5cbiAgaWYgKGxlZnQgPiBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXG4gIHtcbiAgICBsZWZ0ID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xuICB9XG4gIGVsc2UgaWYgKGxlZnQgPCAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxuICB7XG4gICAgbGVmdCA9IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlk7XG4gIH1cblxuICB2YXIgdG9wID0gdGhpcy5yZWN0Lnk7XG5cbiAgaWYgKHRvcCA+IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWSlcbiAge1xuICAgIHRvcCA9IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWTtcbiAgfVxuICBlbHNlIGlmICh0b3AgPCAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxuICB7XG4gICAgdG9wID0gLUxheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWTtcbiAgfVxuXG4gIHZhciBsZWZ0VG9wID0gbmV3IFBvaW50RChsZWZ0LCB0b3ApO1xuICB2YXIgdkxlZnRUb3AgPSB0cmFucy5pbnZlcnNlVHJhbnNmb3JtUG9pbnQobGVmdFRvcCk7XG5cbiAgdGhpcy5zZXRMb2NhdGlvbih2TGVmdFRvcC54LCB2TGVmdFRvcC55KTtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC54O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC54ICsgdGhpcy5yZWN0LndpZHRoO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnJlY3QueTtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpXG57XG4gIGlmICh0aGlzLm93bmVyID09IG51bGwpXG4gIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB0aGlzLm93bmVyLmdldFBhcmVudCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMTm9kZTtcbiIsInZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcbnZhciBMR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9MR3JhcGhNYW5hZ2VyJyk7XG52YXIgTE5vZGUgPSByZXF1aXJlKCcuL0xOb2RlJyk7XG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XG52YXIgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTtcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJy4vRW1pdHRlcicpO1xudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcblxuZnVuY3Rpb24gTGF5b3V0KGlzUmVtb3RlVXNlKSB7XG4gIEVtaXR0ZXIuY2FsbCggdGhpcyApO1xuXG4gIC8vTGF5b3V0IFF1YWxpdHk6IDA6cHJvb2YsIDE6ZGVmYXVsdCwgMjpkcmFmdFxuICB0aGlzLmxheW91dFF1YWxpdHkgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9RVUFMSVRZO1xuICAvL1doZXRoZXIgbGF5b3V0IHNob3VsZCBjcmVhdGUgYmVuZHBvaW50cyBhcyBuZWVkZWQgb3Igbm90XG4gIHRoaXMuY3JlYXRlQmVuZHNBc05lZWRlZCA9XG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRDtcbiAgLy9XaGV0aGVyIGxheW91dCBzaG91bGQgYmUgaW5jcmVtZW50YWwgb3Igbm90XG4gIHRoaXMuaW5jcmVtZW50YWwgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTDtcbiAgLy9XaGV0aGVyIHdlIGFuaW1hdGUgZnJvbSBiZWZvcmUgdG8gYWZ0ZXIgbGF5b3V0IG5vZGUgcG9zaXRpb25zXG4gIHRoaXMuYW5pbWF0aW9uT25MYXlvdXQgPVxuICAgICAgICAgIExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9PTl9MQVlPVVQ7XG4gIC8vV2hldGhlciB3ZSBhbmltYXRlIHRoZSBsYXlvdXQgcHJvY2VzcyBvciBub3RcbiAgdGhpcy5hbmltYXRpb25EdXJpbmdMYXlvdXQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVDtcbiAgLy9OdW1iZXIgaXRlcmF0aW9ucyB0aGF0IHNob3VsZCBiZSBkb25lIGJldHdlZW4gdHdvIHN1Y2Nlc3NpdmUgYW5pbWF0aW9uc1xuICB0aGlzLmFuaW1hdGlvblBlcmlvZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9QRVJJT0Q7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCBsZWFmIG5vZGVzIChub24tY29tcG91bmQgbm9kZXMpIGFyZSBvZiB1bmlmb3JtIHNpemVzLiBXaGVuXG4gICAqIHRoZXkgYXJlLCBib3RoIHNwcmluZyBhbmQgcmVwdWxzaW9uIGZvcmNlcyBiZXR3ZWVuIHR3byBsZWFmIG5vZGVzIGNhbiBiZVxuICAgKiBjYWxjdWxhdGVkIHdpdGhvdXQgdGhlIGV4cGVuc2l2ZSBjbGlwcGluZyBwb2ludCBjYWxjdWxhdGlvbnMsIHJlc3VsdGluZ1xuICAgKiBpbiBtYWpvciBzcGVlZC11cC5cbiAgICovXG4gIHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgPVxuICAgICAgICAgIExheW91dENvbnN0YW50cy5ERUZBVUxUX1VOSUZPUk1fTEVBRl9OT0RFX1NJWkVTO1xuICAvKipcbiAgICogVGhpcyBpcyB1c2VkIGZvciBjcmVhdGlvbiBvZiBiZW5kcG9pbnRzIGJ5IHVzaW5nIGR1bW15IG5vZGVzIGFuZCBlZGdlcy5cbiAgICogTWFwcyBhbiBMRWRnZSB0byBpdHMgZHVtbXkgYmVuZHBvaW50IHBhdGguXG4gICAqL1xuICB0aGlzLmVkZ2VUb0R1bW15Tm9kZXMgPSBuZXcgSGFzaE1hcCgpO1xuICB0aGlzLmdyYXBoTWFuYWdlciA9IG5ldyBMR3JhcGhNYW5hZ2VyKHRoaXMpO1xuICB0aGlzLmlzTGF5b3V0RmluaXNoZWQgPSBmYWxzZTtcbiAgdGhpcy5pc1N1YkxheW91dCA9IGZhbHNlO1xuICB0aGlzLmlzUmVtb3RlVXNlID0gZmFsc2U7XG5cbiAgaWYgKGlzUmVtb3RlVXNlICE9IG51bGwpIHtcbiAgICB0aGlzLmlzUmVtb3RlVXNlID0gaXNSZW1vdGVVc2U7XG4gIH1cbn1cblxuTGF5b3V0LlJBTkRPTV9TRUVEID0gMTtcblxuTGF5b3V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEVtaXR0ZXIucHJvdG90eXBlICk7XG5cbkxheW91dC5wcm90b3R5cGUuZ2V0R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXI7XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLmdldEFsbE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUuZ2V0QWxsRWRnZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLm5ld0dyYXBoTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGdtID0gbmV3IExHcmFwaE1hbmFnZXIodGhpcyk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XG4gIHJldHVybiBnbTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUubmV3R3JhcGggPSBmdW5jdGlvbiAodkdyYXBoKVxue1xuICByZXR1cm4gbmV3IExHcmFwaChudWxsLCB0aGlzLmdyYXBoTWFuYWdlciwgdkdyYXBoKTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUubmV3Tm9kZSA9IGZ1bmN0aW9uICh2Tm9kZSlcbntcbiAgcmV0dXJuIG5ldyBMTm9kZSh0aGlzLmdyYXBoTWFuYWdlciwgdk5vZGUpO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5uZXdFZGdlID0gZnVuY3Rpb24gKHZFZGdlKVxue1xuICByZXR1cm4gbmV3IExFZGdlKG51bGwsIG51bGwsIHZFZGdlKTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUuY2hlY2tMYXlvdXRTdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAodGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpID09IG51bGwpXG4gICAgICAgICAgfHwgdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldE5vZGVzKCkubGVuZ3RoID09IDBcbiAgICAgICAgICB8fCB0aGlzLmdyYXBoTWFuYWdlci5pbmNsdWRlc0ludmFsaWRFZGdlKCk7XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLnJ1bkxheW91dCA9IGZ1bmN0aW9uICgpXG57XG4gIHRoaXMuaXNMYXlvdXRGaW5pc2hlZCA9IGZhbHNlO1xuICBcbiAgaWYgKHRoaXMudGlsaW5nUHJlTGF5b3V0KSB7XG4gICAgdGhpcy50aWxpbmdQcmVMYXlvdXQoKTtcbiAgfVxuXG4gIHRoaXMuaW5pdFBhcmFtZXRlcnMoKTtcbiAgdmFyIGlzTGF5b3V0U3VjY2Vzc2Z1bGw7XG5cbiAgaWYgKHRoaXMuY2hlY2tMYXlvdXRTdWNjZXNzKCkpXG4gIHtcbiAgICBpc0xheW91dFN1Y2Nlc3NmdWxsID0gZmFsc2U7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgaXNMYXlvdXRTdWNjZXNzZnVsbCA9IHRoaXMubGF5b3V0KCk7XG4gIH1cbiAgXG4gIGlmIChMYXlvdXRDb25zdGFudHMuQU5JTUFURSA9PT0gJ2R1cmluZycpIHtcbiAgICAvLyBJZiB0aGlzIGlzIGEgJ2R1cmluZycgbGF5b3V0IGFuaW1hdGlvbi4gTGF5b3V0IGlzIG5vdCBmaW5pc2hlZCB5ZXQuIFxuICAgIC8vIFdlIG5lZWQgdG8gcGVyZm9ybSB0aGVzZSBpbiBpbmRleC5qcyB3aGVuIGxheW91dCBpcyByZWFsbHkgZmluaXNoZWQuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIFxuICBpZiAoaXNMYXlvdXRTdWNjZXNzZnVsbClcbiAge1xuICAgIGlmICghdGhpcy5pc1N1YkxheW91dClcbiAgICB7XG4gICAgICB0aGlzLmRvUG9zdExheW91dCgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLnRpbGluZ1Bvc3RMYXlvdXQpIHtcbiAgICB0aGlzLnRpbGluZ1Bvc3RMYXlvdXQoKTtcbiAgfVxuXG4gIHRoaXMuaXNMYXlvdXRGaW5pc2hlZCA9IHRydWU7XG5cbiAgcmV0dXJuIGlzTGF5b3V0U3VjY2Vzc2Z1bGw7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHRoZSBvcGVyYXRpb25zIHJlcXVpcmVkIGFmdGVyIGxheW91dC5cbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5kb1Bvc3RMYXlvdXQgPSBmdW5jdGlvbiAoKVxue1xuICAvL2Fzc2VydCAhaXNTdWJMYXlvdXQgOiBcIlNob3VsZCBub3QgYmUgY2FsbGVkIG9uIHN1Yi1sYXlvdXQhXCI7XG4gIC8vIFByb3BhZ2F0ZSBnZW9tZXRyaWMgY2hhbmdlcyB0byB2LWxldmVsIG9iamVjdHNcbiAgaWYoIXRoaXMuaW5jcmVtZW50YWwpe1xuICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gIH1cbiAgdGhpcy51cGRhdGUoKTtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgdXBkYXRlcyB0aGUgZ2VvbWV0cnkgb2YgdGhlIHRhcmdldCBncmFwaCBhY2NvcmRpbmcgdG9cbiAqIGNhbGN1bGF0ZWQgbGF5b3V0LlxuICovXG5MYXlvdXQucHJvdG90eXBlLnVwZGF0ZTIgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHVwZGF0ZSBiZW5kIHBvaW50c1xuICBpZiAodGhpcy5jcmVhdGVCZW5kc0FzTmVlZGVkKVxuICB7XG4gICAgdGhpcy5jcmVhdGVCZW5kcG9pbnRzRnJvbUR1bW15Tm9kZXMoKTtcblxuICAgIC8vIHJlc2V0IGFsbCBlZGdlcywgc2luY2UgdGhlIHRvcG9sb2d5IGhhcyBjaGFuZ2VkXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xuICB9XG5cbiAgLy8gcGVyZm9ybSBlZGdlLCBub2RlIGFuZCByb290IHVwZGF0ZXMgaWYgbGF5b3V0IGlzIG5vdCBjYWxsZWRcbiAgLy8gcmVtb3RlbHlcbiAgaWYgKCF0aGlzLmlzUmVtb3RlVXNlKVxuICB7XG4gICAgLy8gdXBkYXRlIGFsbCBlZGdlc1xuICAgIHZhciBlZGdlO1xuICAgIHZhciBhbGxFZGdlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBlZGdlID0gYWxsRWRnZXNbaV07XG4vLyAgICAgIHRoaXMudXBkYXRlKGVkZ2UpO1xuICAgIH1cblxuICAgIC8vIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBub2Rlc1xuICAgIHZhciBub2RlO1xuICAgIHZhciBub2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXROb2RlcygpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuLy8gICAgICB0aGlzLnVwZGF0ZShub2RlKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgcm9vdCBncmFwaFxuICAgIHRoaXMudXBkYXRlKHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKSk7XG4gIH1cbn07XG5cbkxheW91dC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZTIoKTtcbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMTm9kZSkge1xuICAgIHZhciBub2RlID0gb2JqO1xuICAgIGlmIChub2RlLmdldENoaWxkKCkgIT0gbnVsbClcbiAgICB7XG4gICAgICAvLyBzaW5jZSBub2RlIGlzIGNvbXBvdW5kLCByZWN1cnNpdmVseSB1cGRhdGUgY2hpbGQgbm9kZXNcbiAgICAgIHZhciBub2RlcyA9IG5vZGUuZ2V0Q2hpbGQoKS5nZXROb2RlcygpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICAgIHtcbiAgICAgICAgdXBkYXRlKG5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgbC1sZXZlbCBub2RlIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHYtbGV2ZWwgZ3JhcGggb2JqZWN0LFxuICAgIC8vIHRoZW4gaXQgaXMgYXNzdW1lZCB0aGF0IHRoZSB2LWxldmVsIG5vZGUgaW1wbGVtZW50cyB0aGVcbiAgICAvLyBpbnRlcmZhY2UgVXBkYXRhYmxlLlxuICAgIGlmIChub2RlLnZHcmFwaE9iamVjdCAhPSBudWxsKVxuICAgIHtcbiAgICAgIC8vIGNhc3QgdG8gVXBkYXRhYmxlIHdpdGhvdXQgYW55IHR5cGUgY2hlY2tcbiAgICAgIHZhciB2Tm9kZSA9IG5vZGUudkdyYXBoT2JqZWN0O1xuXG4gICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIG9mIHRoZSBpbnRlcmZhY2VcbiAgICAgIHZOb2RlLnVwZGF0ZShub2RlKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTEVkZ2UpIHtcbiAgICB2YXIgZWRnZSA9IG9iajtcbiAgICAvLyBpZiB0aGUgbC1sZXZlbCBlZGdlIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHYtbGV2ZWwgZ3JhcGggb2JqZWN0LFxuICAgIC8vIHRoZW4gaXQgaXMgYXNzdW1lZCB0aGF0IHRoZSB2LWxldmVsIGVkZ2UgaW1wbGVtZW50cyB0aGVcbiAgICAvLyBpbnRlcmZhY2UgVXBkYXRhYmxlLlxuXG4gICAgaWYgKGVkZ2UudkdyYXBoT2JqZWN0ICE9IG51bGwpXG4gICAge1xuICAgICAgLy8gY2FzdCB0byBVcGRhdGFibGUgd2l0aG91dCBhbnkgdHlwZSBjaGVja1xuICAgICAgdmFyIHZFZGdlID0gZWRnZS52R3JhcGhPYmplY3Q7XG5cbiAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBtZXRob2Qgb2YgdGhlIGludGVyZmFjZVxuICAgICAgdkVkZ2UudXBkYXRlKGVkZ2UpO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMR3JhcGgpIHtcbiAgICB2YXIgZ3JhcGggPSBvYmo7XG4gICAgLy8gaWYgdGhlIGwtbGV2ZWwgZ3JhcGggaXMgYXNzb2NpYXRlZCB3aXRoIGEgdi1sZXZlbCBncmFwaCBvYmplY3QsXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgb2JqZWN0IGltcGxlbWVudHMgdGhlXG4gICAgLy8gaW50ZXJmYWNlIFVwZGF0YWJsZS5cblxuICAgIGlmIChncmFwaC52R3JhcGhPYmplY3QgIT0gbnVsbClcbiAgICB7XG4gICAgICAvLyBjYXN0IHRvIFVwZGF0YWJsZSB3aXRob3V0IGFueSB0eXBlIGNoZWNrXG4gICAgICB2YXIgdkdyYXBoID0gZ3JhcGgudkdyYXBoT2JqZWN0O1xuXG4gICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIG9mIHRoZSBpbnRlcmZhY2VcbiAgICAgIHZHcmFwaC51cGRhdGUoZ3JhcGgpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHNldCBhbGwgbGF5b3V0IHBhcmFtZXRlcnMgdG8gZGVmYXVsdCB2YWx1ZXNcbiAqIGRldGVybWluZWQgYXQgY29tcGlsZSB0aW1lLlxuICovXG5MYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuaXNTdWJMYXlvdXQpXG4gIHtcbiAgICB0aGlzLmxheW91dFF1YWxpdHkgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9RVUFMSVRZO1xuICAgIHRoaXMuYW5pbWF0aW9uRHVyaW5nTGF5b3V0ID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX0RVUklOR19MQVlPVVQ7XG4gICAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EO1xuICAgIHRoaXMuYW5pbWF0aW9uT25MYXlvdXQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fT05fTEFZT1VUO1xuICAgIHRoaXMuaW5jcmVtZW50YWwgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTDtcbiAgICB0aGlzLmNyZWF0ZUJlbmRzQXNOZWVkZWQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DUkVBVEVfQkVORFNfQVNfTkVFREVEO1xuICAgIHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VTklGT1JNX0xFQUZfTk9ERV9TSVpFUztcbiAgfVxuXG4gIGlmICh0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dClcbiAge1xuICAgIHRoaXMuYW5pbWF0aW9uT25MYXlvdXQgPSBmYWxzZTtcbiAgfVxufTtcblxuTGF5b3V0LnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAobmV3TGVmdFRvcCkge1xuICBpZiAobmV3TGVmdFRvcCA9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnRyYW5zZm9ybShuZXcgUG9pbnREKDAsIDApKTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBjcmVhdGUgYSB0cmFuc2Zvcm1hdGlvbiBvYmplY3QgKGZyb20gRWNsaXBzZSB0byBsYXlvdXQpLiBXaGVuIGFuXG4gICAgLy8gaW52ZXJzZSB0cmFuc2Zvcm0gaXMgYXBwbGllZCwgd2UgZ2V0IHVwcGVyLWxlZnQgY29vcmRpbmF0ZSBvZiB0aGVcbiAgICAvLyBkcmF3aW5nIG9yIHRoZSByb290IGdyYXBoIGF0IGdpdmVuIGlucHV0IGNvb3JkaW5hdGUgKHNvbWUgbWFyZ2luc1xuICAgIC8vIGFscmVhZHkgaW5jbHVkZWQgaW4gY2FsY3VsYXRpb24gb2YgbGVmdC10b3ApLlxuXG4gICAgdmFyIHRyYW5zID0gbmV3IFRyYW5zZm9ybSgpO1xuICAgIHZhciBsZWZ0VG9wID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLnVwZGF0ZUxlZnRUb3AoKTtcblxuICAgIGlmIChsZWZ0VG9wICE9IG51bGwpXG4gICAge1xuICAgICAgdHJhbnMuc2V0V29ybGRPcmdYKG5ld0xlZnRUb3AueCk7XG4gICAgICB0cmFucy5zZXRXb3JsZE9yZ1kobmV3TGVmdFRvcC55KTtcblxuICAgICAgdHJhbnMuc2V0RGV2aWNlT3JnWChsZWZ0VG9wLngpO1xuICAgICAgdHJhbnMuc2V0RGV2aWNlT3JnWShsZWZ0VG9wLnkpO1xuXG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XG4gICAgICB2YXIgbm9kZTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICAgIHtcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBub2RlLnRyYW5zZm9ybSh0cmFucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLnBvc2l0aW9uTm9kZXNSYW5kb21seSA9IGZ1bmN0aW9uIChncmFwaCkge1xuXG4gIGlmIChncmFwaCA9PSB1bmRlZmluZWQpIHtcbiAgICAvL2Fzc2VydCAhdGhpcy5pbmNyZW1lbnRhbDtcbiAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seSh0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKSk7XG4gICAgdGhpcy5nZXRHcmFwaE1hbmFnZXIoKS5nZXRSb290KCkudXBkYXRlQm91bmRzKHRydWUpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBsTm9kZTtcbiAgICB2YXIgY2hpbGRHcmFwaDtcblxuICAgIHZhciBub2RlcyA9IGdyYXBoLmdldE5vZGVzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBsTm9kZSA9IG5vZGVzW2ldO1xuICAgICAgY2hpbGRHcmFwaCA9IGxOb2RlLmdldENoaWxkKCk7XG5cbiAgICAgIGlmIChjaGlsZEdyYXBoID09IG51bGwpXG4gICAgICB7XG4gICAgICAgIGxOb2RlLnNjYXR0ZXIoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNoaWxkR3JhcGguZ2V0Tm9kZXMoKS5sZW5ndGggPT0gMClcbiAgICAgIHtcbiAgICAgICAgbE5vZGUuc2NhdHRlcigpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seShjaGlsZEdyYXBoKTtcbiAgICAgICAgbE5vZGUudXBkYXRlQm91bmRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBsaXN0IG9mIHRyZWVzIHdoZXJlIGVhY2ggdHJlZSBpcyByZXByZXNlbnRlZCBhcyBhXG4gKiBsaXN0IG9mIGwtbm9kZXMuIFRoZSBtZXRob2QgcmV0dXJucyBhIGxpc3Qgb2Ygc2l6ZSAwIHdoZW46XG4gKiAtIFRoZSBncmFwaCBpcyBub3QgZmxhdCBvclxuICogLSBPbmUgb2YgdGhlIGNvbXBvbmVudChzKSBvZiB0aGUgZ3JhcGggaXMgbm90IGEgdHJlZS5cbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5nZXRGbGF0Rm9yZXN0ID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGZsYXRGb3Jlc3QgPSBbXTtcbiAgdmFyIGlzRm9yZXN0ID0gdHJ1ZTtcblxuICAvLyBRdWljayByZWZlcmVuY2UgZm9yIGFsbCBub2RlcyBpbiB0aGUgZ3JhcGggbWFuYWdlciBhc3NvY2lhdGVkIHdpdGhcbiAgLy8gdGhpcyBsYXlvdXQuIFRoZSBsaXN0IHNob3VsZCBub3QgYmUgY2hhbmdlZC5cbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldE5vZGVzKCk7XG5cbiAgLy8gRmlyc3QgYmUgc3VyZSB0aGF0IHRoZSBncmFwaCBpcyBmbGF0XG4gIHZhciBpc0ZsYXQgPSB0cnVlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBpZiAoYWxsTm9kZXNbaV0uZ2V0Q2hpbGQoKSAhPSBudWxsKVxuICAgIHtcbiAgICAgIGlzRmxhdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiBlbXB0eSBmb3Jlc3QgaWYgdGhlIGdyYXBoIGlzIG5vdCBmbGF0LlxuICBpZiAoIWlzRmxhdClcbiAge1xuICAgIHJldHVybiBmbGF0Rm9yZXN0O1xuICB9XG5cbiAgLy8gUnVuIEJGUyBmb3IgZWFjaCBjb21wb25lbnQgb2YgdGhlIGdyYXBoLlxuXG4gIHZhciB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcbiAgdmFyIHRvQmVWaXNpdGVkID0gW107XG4gIHZhciBwYXJlbnRzID0gbmV3IEhhc2hNYXAoKTtcbiAgdmFyIHVuUHJvY2Vzc2VkTm9kZXMgPSBbXTtcblxuICB1blByb2Nlc3NlZE5vZGVzID0gdW5Qcm9jZXNzZWROb2Rlcy5jb25jYXQoYWxsTm9kZXMpO1xuXG4gIC8vIEVhY2ggaXRlcmF0aW9uIG9mIHRoaXMgbG9vcCBmaW5kcyBhIGNvbXBvbmVudCBvZiB0aGUgZ3JhcGggYW5kXG4gIC8vIGRlY2lkZXMgd2hldGhlciBpdCBpcyBhIHRyZWUgb3Igbm90LiBJZiBpdCBpcyBhIHRyZWUsIGFkZHMgaXQgdG8gdGhlXG4gIC8vIGZvcmVzdCBhbmQgY29udGludWVkIHdpdGggdGhlIG5leHQgY29tcG9uZW50LlxuXG4gIHdoaWxlICh1blByb2Nlc3NlZE5vZGVzLmxlbmd0aCA+IDAgJiYgaXNGb3Jlc3QpXG4gIHtcbiAgICB0b0JlVmlzaXRlZC5wdXNoKHVuUHJvY2Vzc2VkTm9kZXNbMF0pO1xuXG4gICAgLy8gU3RhcnQgdGhlIEJGUy4gRWFjaCBpdGVyYXRpb24gb2YgdGhpcyBsb29wIHZpc2l0cyBhIG5vZGUgaW4gYVxuICAgIC8vIEJGUyBtYW5uZXIuXG4gICAgd2hpbGUgKHRvQmVWaXNpdGVkLmxlbmd0aCA+IDAgJiYgaXNGb3Jlc3QpXG4gICAge1xuICAgICAgLy9wb29sIG9wZXJhdGlvblxuICAgICAgdmFyIGN1cnJlbnROb2RlID0gdG9CZVZpc2l0ZWRbMF07XG4gICAgICB0b0JlVmlzaXRlZC5zcGxpY2UoMCwgMSk7XG4gICAgICB2aXNpdGVkLmFkZChjdXJyZW50Tm9kZSk7XG5cbiAgICAgIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXG4gICAgICB2YXIgbmVpZ2hib3JFZGdlcyA9IGN1cnJlbnROb2RlLmdldEVkZ2VzKCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmVpZ2hib3JFZGdlcy5sZW5ndGg7IGkrKylcbiAgICAgIHtcbiAgICAgICAgdmFyIGN1cnJlbnROZWlnaGJvciA9XG4gICAgICAgICAgICAgICAgbmVpZ2hib3JFZGdlc1tpXS5nZXRPdGhlckVuZChjdXJyZW50Tm9kZSk7XG5cbiAgICAgICAgLy8gSWYgQkZTIGlzIG5vdCBncm93aW5nIGZyb20gdGhpcyBuZWlnaGJvci5cbiAgICAgICAgaWYgKHBhcmVudHMuZ2V0KGN1cnJlbnROb2RlKSAhPSBjdXJyZW50TmVpZ2hib3IpXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBXZSBoYXZlbid0IHByZXZpb3VzbHkgdmlzaXRlZCB0aGlzIG5laWdoYm9yLlxuICAgICAgICAgIGlmICghdmlzaXRlZC5jb250YWlucyhjdXJyZW50TmVpZ2hib3IpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRvQmVWaXNpdGVkLnB1c2goY3VycmVudE5laWdoYm9yKTtcbiAgICAgICAgICAgIHBhcmVudHMucHV0KGN1cnJlbnROZWlnaGJvciwgY3VycmVudE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHByZXZpb3VzbHkgdmlzaXRlZCB0aGlzIG5laWdoYm9yIGFuZFxuICAgICAgICAgIC8vIHRoaXMgbmVpZ2hib3IgaXMgbm90IHBhcmVudCBvZiBjdXJyZW50Tm9kZSwgZ2l2ZW5cbiAgICAgICAgICAvLyBncmFwaCBjb250YWlucyBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB0cmVlLCBoZW5jZVxuICAgICAgICAgIC8vIGl0IGlzIG5vdCBhIGZvcmVzdC5cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAge1xuICAgICAgICAgICAgaXNGb3Jlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoZSBncmFwaCBjb250YWlucyBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCBhIHRyZWUuIEVtcHR5XG4gICAgLy8gcHJldmlvdXNseSBmb3VuZCB0cmVlcy4gVGhlIG1ldGhvZCB3aWxsIGVuZC5cbiAgICBpZiAoIWlzRm9yZXN0KVxuICAgIHtcbiAgICAgIGZsYXRGb3Jlc3QgPSBbXTtcbiAgICB9XG4gICAgLy8gU2F2ZSBjdXJyZW50bHkgdmlzaXRlZCBub2RlcyBhcyBhIHRyZWUgaW4gb3VyIGZvcmVzdC4gUmVzZXRcbiAgICAvLyB2aXNpdGVkIGFuZCBwYXJlbnRzIGxpc3RzLiBDb250aW51ZSB3aXRoIHRoZSBuZXh0IGNvbXBvbmVudCBvZlxuICAgIC8vIHRoZSBncmFwaCwgaWYgYW55LlxuICAgIGVsc2VcbiAgICB7XG4gICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgdmlzaXRlZC5hZGRBbGxUbyh0ZW1wKTtcbiAgICAgIGZsYXRGb3Jlc3QucHVzaCh0ZW1wKTtcbiAgICAgIC8vZmxhdEZvcmVzdCA9IGZsYXRGb3Jlc3QuY29uY2F0KHRlbXApO1xuICAgICAgLy91blByb2Nlc3NlZE5vZGVzLnJlbW92ZUFsbCh2aXNpdGVkKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSB0ZW1wW2ldO1xuICAgICAgICB2YXIgaW5kZXggPSB1blByb2Nlc3NlZE5vZGVzLmluZGV4T2YodmFsdWUpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgIHVuUHJvY2Vzc2VkTm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXRlZCA9IG5ldyBIYXNoU2V0KCk7XG4gICAgICBwYXJlbnRzID0gbmV3IEhhc2hNYXAoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmxhdEZvcmVzdDtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBkdW1teSBub2RlcyAoYW4gbC1sZXZlbCBub2RlIHdpdGggbWluaW1hbCBkaW1lbnNpb25zKVxuICogZm9yIHRoZSBnaXZlbiBlZGdlIChvbmUgcGVyIGJlbmRwb2ludCkuIFRoZSBleGlzdGluZyBsLWxldmVsIHN0cnVjdHVyZVxuICogaXMgdXBkYXRlZCBhY2NvcmRpbmdseS5cbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVEdW1teU5vZGVzRm9yQmVuZHBvaW50cyA9IGZ1bmN0aW9uIChlZGdlKVxue1xuICB2YXIgZHVtbXlOb2RlcyA9IFtdO1xuICB2YXIgcHJldiA9IGVkZ2Uuc291cmNlO1xuXG4gIHZhciBncmFwaCA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmNhbGNMb3dlc3RDb21tb25BbmNlc3RvcihlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZS5iZW5kcG9pbnRzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgLy8gY3JlYXRlIG5ldyBkdW1teSBub2RlXG4gICAgdmFyIGR1bW15Tm9kZSA9IHRoaXMubmV3Tm9kZShudWxsKTtcbiAgICBkdW1teU5vZGUuc2V0UmVjdChuZXcgUG9pbnQoMCwgMCksIG5ldyBEaW1lbnNpb24oMSwgMSkpO1xuXG4gICAgZ3JhcGguYWRkKGR1bW15Tm9kZSk7XG5cbiAgICAvLyBjcmVhdGUgbmV3IGR1bW15IGVkZ2UgYmV0d2VlbiBwcmV2IGFuZCBkdW1teSBub2RlXG4gICAgdmFyIGR1bW15RWRnZSA9IHRoaXMubmV3RWRnZShudWxsKTtcbiAgICB0aGlzLmdyYXBoTWFuYWdlci5hZGQoZHVtbXlFZGdlLCBwcmV2LCBkdW1teU5vZGUpO1xuXG4gICAgZHVtbXlOb2Rlcy5hZGQoZHVtbXlOb2RlKTtcbiAgICBwcmV2ID0gZHVtbXlOb2RlO1xuICB9XG5cbiAgdmFyIGR1bW15RWRnZSA9IHRoaXMubmV3RWRnZShudWxsKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIuYWRkKGR1bW15RWRnZSwgcHJldiwgZWRnZS50YXJnZXQpO1xuXG4gIHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5wdXQoZWRnZSwgZHVtbXlOb2Rlcyk7XG5cbiAgLy8gcmVtb3ZlIHJlYWwgZWRnZSBmcm9tIGdyYXBoIG1hbmFnZXIgaWYgaXQgaXMgaW50ZXItZ3JhcGhcbiAgaWYgKGVkZ2UuaXNJbnRlckdyYXBoKCkpXG4gIHtcbiAgICB0aGlzLmdyYXBoTWFuYWdlci5yZW1vdmUoZWRnZSk7XG4gIH1cbiAgLy8gZWxzZSwgcmVtb3ZlIHRoZSBlZGdlIGZyb20gdGhlIGN1cnJlbnQgZ3JhcGhcbiAgZWxzZVxuICB7XG4gICAgZ3JhcGgucmVtb3ZlKGVkZ2UpO1xuICB9XG5cbiAgcmV0dXJuIGR1bW15Tm9kZXM7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYmVuZHBvaW50cyBmb3IgZWRnZXMgZnJvbSB0aGUgZHVtbXkgbm9kZXNcbiAqIGF0IGwtbGV2ZWwuXG4gKi9cbkxheW91dC5wcm90b3R5cGUuY3JlYXRlQmVuZHBvaW50c0Zyb21EdW1teU5vZGVzID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGVkZ2VzID0gW107XG4gIGVkZ2VzID0gZWRnZXMuY29uY2F0KHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCkpO1xuICBlZGdlcyA9IHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5rZXlTZXQoKS5jb25jYXQoZWRnZXMpO1xuXG4gIGZvciAodmFyIGsgPSAwOyBrIDwgZWRnZXMubGVuZ3RoOyBrKyspXG4gIHtcbiAgICB2YXIgbEVkZ2UgPSBlZGdlc1trXTtcblxuICAgIGlmIChsRWRnZS5iZW5kcG9pbnRzLmxlbmd0aCA+IDApXG4gICAge1xuICAgICAgdmFyIHBhdGggPSB0aGlzLmVkZ2VUb0R1bW15Tm9kZXMuZ2V0KGxFZGdlKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKVxuICAgICAge1xuICAgICAgICB2YXIgZHVtbXlOb2RlID0gcGF0aFtpXTtcbiAgICAgICAgdmFyIHAgPSBuZXcgUG9pbnREKGR1bW15Tm9kZS5nZXRDZW50ZXJYKCksXG4gICAgICAgICAgICAgICAgZHVtbXlOb2RlLmdldENlbnRlclkoKSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGJlbmRwb2ludCdzIGxvY2F0aW9uIGFjY29yZGluZyB0byBkdW1teSBub2RlXG4gICAgICAgIHZhciBlYnAgPSBsRWRnZS5iZW5kcG9pbnRzLmdldChpKTtcbiAgICAgICAgZWJwLnggPSBwLng7XG4gICAgICAgIGVicC55ID0gcC55O1xuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgZHVtbXkgbm9kZSwgZHVtbXkgZWRnZXMgaW5jaWRlbnQgd2l0aCB0aGlzXG4gICAgICAgIC8vIGR1bW15IG5vZGUgaXMgYWxzbyByZW1vdmVkICh3aXRoaW4gdGhlIHJlbW92ZSBtZXRob2QpXG4gICAgICAgIGR1bW15Tm9kZS5nZXRPd25lcigpLnJlbW92ZShkdW1teU5vZGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgdGhlIHJlYWwgZWRnZSB0byBncmFwaFxuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIuYWRkKGxFZGdlLCBsRWRnZS5zb3VyY2UsIGxFZGdlLnRhcmdldCk7XG4gICAgfVxuICB9XG59O1xuXG5MYXlvdXQudHJhbnNmb3JtID0gZnVuY3Rpb24gKHNsaWRlclZhbHVlLCBkZWZhdWx0VmFsdWUsIG1pbkRpdiwgbWF4TXVsKSB7XG4gIGlmIChtaW5EaXYgIT0gdW5kZWZpbmVkICYmIG1heE11bCAhPSB1bmRlZmluZWQpIHtcbiAgICB2YXIgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XG5cbiAgICBpZiAoc2xpZGVyVmFsdWUgPD0gNTApXG4gICAge1xuICAgICAgdmFyIG1pblZhbHVlID0gZGVmYXVsdFZhbHVlIC8gbWluRGl2O1xuICAgICAgdmFsdWUgLT0gKChkZWZhdWx0VmFsdWUgLSBtaW5WYWx1ZSkgLyA1MCkgKiAoNTAgLSBzbGlkZXJWYWx1ZSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICB2YXIgbWF4VmFsdWUgPSBkZWZhdWx0VmFsdWUgKiBtYXhNdWw7XG4gICAgICB2YWx1ZSArPSAoKG1heFZhbHVlIC0gZGVmYXVsdFZhbHVlKSAvIDUwKSAqIChzbGlkZXJWYWx1ZSAtIDUwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIGEsIGI7XG5cbiAgICBpZiAoc2xpZGVyVmFsdWUgPD0gNTApXG4gICAge1xuICAgICAgYSA9IDkuMCAqIGRlZmF1bHRWYWx1ZSAvIDUwMC4wO1xuICAgICAgYiA9IGRlZmF1bHRWYWx1ZSAvIDEwLjA7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBhID0gOS4wICogZGVmYXVsdFZhbHVlIC8gNTAuMDtcbiAgICAgIGIgPSAtOCAqIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKGEgKiBzbGlkZXJWYWx1ZSArIGIpO1xuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGZpbmRzIGFuZCByZXR1cm5zIHRoZSBjZW50ZXIgb2YgdGhlIGdpdmVuIG5vZGVzLCBhc3N1bWluZ1xuICogdGhhdCB0aGUgZ2l2ZW4gbm9kZXMgZm9ybSBhIHRyZWUgaW4gdGhlbXNlbHZlcy5cbiAqL1xuTGF5b3V0LmZpbmRDZW50ZXJPZlRyZWUgPSBmdW5jdGlvbiAobm9kZXMpXG57XG4gIHZhciBsaXN0ID0gW107XG4gIGxpc3QgPSBsaXN0LmNvbmNhdChub2Rlcyk7XG5cbiAgdmFyIHJlbW92ZWROb2RlcyA9IFtdO1xuICB2YXIgcmVtYWluaW5nRGVncmVlcyA9IG5ldyBIYXNoTWFwKCk7XG4gIHZhciBmb3VuZENlbnRlciA9IGZhbHNlO1xuICB2YXIgY2VudGVyTm9kZSA9IG51bGw7XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09IDEgfHwgbGlzdC5sZW5ndGggPT0gMilcbiAge1xuICAgIGZvdW5kQ2VudGVyID0gdHJ1ZTtcbiAgICBjZW50ZXJOb2RlID0gbGlzdFswXTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciBub2RlID0gbGlzdFtpXTtcbiAgICB2YXIgZGVncmVlID0gbm9kZS5nZXROZWlnaGJvcnNMaXN0KCkuc2l6ZSgpO1xuICAgIHJlbWFpbmluZ0RlZ3JlZXMucHV0KG5vZGUsIG5vZGUuZ2V0TmVpZ2hib3JzTGlzdCgpLnNpemUoKSk7XG5cbiAgICBpZiAoZGVncmVlID09IDEpXG4gICAge1xuICAgICAgcmVtb3ZlZE5vZGVzLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHRlbXBMaXN0ID0gW107XG4gIHRlbXBMaXN0ID0gdGVtcExpc3QuY29uY2F0KHJlbW92ZWROb2Rlcyk7XG5cbiAgd2hpbGUgKCFmb3VuZENlbnRlcilcbiAge1xuICAgIHZhciB0ZW1wTGlzdDIgPSBbXTtcbiAgICB0ZW1wTGlzdDIgPSB0ZW1wTGlzdDIuY29uY2F0KHRlbXBMaXN0KTtcbiAgICB0ZW1wTGlzdCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIHZhciBub2RlID0gbGlzdFtpXTtcblxuICAgICAgdmFyIGluZGV4ID0gbGlzdC5pbmRleE9mKG5vZGUpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmVpZ2hib3VycyA9IG5vZGUuZ2V0TmVpZ2hib3JzTGlzdCgpO1xuXG4gICAgICBPYmplY3Qua2V5cyhuZWlnaGJvdXJzLnNldCkuZm9yRWFjaChmdW5jdGlvbihqKSB7XG4gICAgICAgIHZhciBuZWlnaGJvdXIgPSBuZWlnaGJvdXJzLnNldFtqXTtcbiAgICAgICAgaWYgKHJlbW92ZWROb2Rlcy5pbmRleE9mKG5laWdoYm91cikgPCAwKVxuICAgICAgICB7XG4gICAgICAgICAgdmFyIG90aGVyRGVncmVlID0gcmVtYWluaW5nRGVncmVlcy5nZXQobmVpZ2hib3VyKTtcbiAgICAgICAgICB2YXIgbmV3RGVncmVlID0gb3RoZXJEZWdyZWUgLSAxO1xuXG4gICAgICAgICAgaWYgKG5ld0RlZ3JlZSA9PSAxKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRlbXBMaXN0LnB1c2gobmVpZ2hib3VyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZW1haW5pbmdEZWdyZWVzLnB1dChuZWlnaGJvdXIsIG5ld0RlZ3JlZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbW92ZWROb2RlcyA9IHJlbW92ZWROb2Rlcy5jb25jYXQodGVtcExpc3QpO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDEgfHwgbGlzdC5sZW5ndGggPT0gMilcbiAgICB7XG4gICAgICBmb3VuZENlbnRlciA9IHRydWU7XG4gICAgICBjZW50ZXJOb2RlID0gbGlzdFswXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2VudGVyTm9kZTtcbn07XG5cbi8qKlxuICogRHVyaW5nIHRoZSBjb2Fyc2VuaW5nIHByb2Nlc3MsIHRoaXMgbGF5b3V0IG1heSBiZSByZWZlcmVuY2VkIGJ5IHR3byBncmFwaCBtYW5hZ2Vyc1xuICogdGhpcyBzZXR0ZXIgZnVuY3Rpb24gZ3JhbnRzIGFjY2VzcyB0byBjaGFuZ2UgdGhlIGN1cnJlbnRseSBiZWluZyB1c2VkIGdyYXBoIG1hbmFnZXJcbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5zZXRHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoZ20pXG57XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDtcbiIsImZ1bmN0aW9uIExheW91dENvbnN0YW50cygpIHtcbn1cblxuLyoqXG4gKiBMYXlvdXQgUXVhbGl0eVxuICovXG5MYXlvdXRDb25zdGFudHMuUFJPT0ZfUVVBTElUWSA9IDA7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9RVUFMSVRZID0gMTtcbkxheW91dENvbnN0YW50cy5EUkFGVF9RVUFMSVRZID0gMjtcblxuLyoqXG4gKiBEZWZhdWx0IHBhcmFtZXRlcnNcbiAqL1xuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRCA9IGZhbHNlO1xuLy9MYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9IHRydWU7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9IGZhbHNlO1xuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX09OX0xBWU9VVCA9IHRydWU7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVCA9IGZhbHNlO1xuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX1BFUklPRCA9IDUwO1xuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfVU5JRk9STV9MRUFGX05PREVfU0laRVMgPSBmYWxzZTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNlY3Rpb246IEdlbmVyYWwgb3RoZXIgY29uc3RhbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAqIE1hcmdpbnMgb2YgYSBncmFwaCB0byBiZSBhcHBsaWVkIG9uIGJvdWRpbmcgcmVjdGFuZ2xlIG9mIGl0cyBjb250ZW50cy4gV2VcbiAqIGFzc3VtZSBtYXJnaW5zIG9uIGFsbCBmb3VyIHNpZGVzIHRvIGJlIHVuaWZvcm0uXG4gKi9cbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVBIX01BUkdJTiA9IDE1O1xuXG4vKlxuICogV2hldGhlciB0byBjb25zaWRlciBsYWJlbHMgaW4gbm9kZSBkaW1lbnNpb25zIG9yIG5vdFxuICovXG5MYXlvdXRDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gZmFsc2U7XG5cbi8qXG4gKiBEZWZhdWx0IGRpbWVuc2lvbiBvZiBhIG5vbi1jb21wb3VuZCBub2RlLlxuICovXG5MYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRSA9IDQwO1xuXG4vKlxuICogRGVmYXVsdCBkaW1lbnNpb24gb2YgYSBub24tY29tcG91bmQgbm9kZS5cbiAqL1xuTGF5b3V0Q29uc3RhbnRzLlNJTVBMRV9OT0RFX0hBTEZfU0laRSA9IExheW91dENvbnN0YW50cy5TSU1QTEVfTk9ERV9TSVpFIC8gMjtcblxuLypcbiAqIEVtcHR5IGNvbXBvdW5kIG5vZGUgc2l6ZS4gV2hlbiBhIGNvbXBvdW5kIG5vZGUgaXMgZW1wdHksIGl0cyBib3RoXG4gKiBkaW1lbnNpb25zIHNob3VsZCBiZSBvZiB0aGlzIHZhbHVlLlxuICovXG5MYXlvdXRDb25zdGFudHMuRU1QVFlfQ09NUE9VTkRfTk9ERV9TSVpFID0gNDA7XG5cbi8qXG4gKiBNaW5pbXVtIGxlbmd0aCB0aGF0IGFuIGVkZ2Ugc2hvdWxkIHRha2UgZHVyaW5nIGxheW91dFxuICovXG5MYXlvdXRDb25zdGFudHMuTUlOX0VER0VfTEVOR1RIID0gMTtcblxuLypcbiAqIFdvcmxkIGJvdW5kYXJpZXMgdGhhdCBsYXlvdXQgb3BlcmF0ZXMgb25cbiAqL1xuTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZID0gMTAwMDAwMDtcblxuLypcbiAqIFdvcmxkIGJvdW5kYXJpZXMgdGhhdCByYW5kb20gcG9zaXRpb25pbmcgY2FuIGJlIHBlcmZvcm1lZCB3aXRoXG4gKi9cbkxheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZIC8gMTAwMDtcblxuLypcbiAqIENvb3JkaW5hdGVzIG9mIHRoZSB3b3JsZCBjZW50ZXJcbiAqL1xuTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9YID0gMTIwMDtcbkxheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWSA9IDkwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXRDb25zdGFudHM7XG4iLCIvKlxuICpUaGlzIGNsYXNzIGlzIHRoZSBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBQb2ludC5qYXZhIGNsYXNzIGluIGpka1xuICovXG5mdW5jdGlvbiBQb2ludCh4LCB5LCBwKSB7XG4gIHRoaXMueCA9IG51bGw7XG4gIHRoaXMueSA9IG51bGw7XG4gIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsICYmIHAgPT0gbnVsbCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgeCA9PSAnbnVtYmVyJyAmJiB0eXBlb2YgeSA9PSAnbnVtYmVyJyAmJiBwID09IG51bGwpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cbiAgZWxzZSBpZiAoeC5jb25zdHJ1Y3Rvci5uYW1lID09ICdQb2ludCcgJiYgeSA9PSBudWxsICYmIHAgPT0gbnVsbCkge1xuICAgIHAgPSB4O1xuICAgIHRoaXMueCA9IHAueDtcbiAgICB0aGlzLnkgPSBwLnk7XG4gIH1cbn1cblxuUG9pbnQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLng7XG59XG5cblBvaW50LnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy55O1xufVxuXG5Qb2ludC5wcm90b3R5cGUuZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xufVxuXG5Qb2ludC5wcm90b3R5cGUuc2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoeCwgeSwgcCkge1xuICBpZiAoeC5jb25zdHJ1Y3Rvci5uYW1lID09ICdQb2ludCcgJiYgeSA9PSBudWxsICYmIHAgPT0gbnVsbCkge1xuICAgIHAgPSB4O1xuICAgIHRoaXMuc2V0TG9jYXRpb24ocC54LCBwLnkpO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiB4ID09ICdudW1iZXInICYmIHR5cGVvZiB5ID09ICdudW1iZXInICYmIHAgPT0gbnVsbCkge1xuICAgIC8vaWYgYm90aCBwYXJhbWV0ZXJzIGFyZSBpbnRlZ2VyIGp1c3QgbW92ZSAoeCx5KSBsb2NhdGlvblxuICAgIGlmIChwYXJzZUludCh4KSA9PSB4ICYmIHBhcnNlSW50KHkpID09IHkpIHtcbiAgICAgIHRoaXMubW92ZSh4LCB5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnggPSBNYXRoLmZsb29yKHggKyAwLjUpO1xuICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcih5ICsgMC41KTtcbiAgICB9XG4gIH1cbn1cblxuUG9pbnQucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xufVxuXG5Qb2ludC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGR4LCBkeSkge1xuICB0aGlzLnggKz0gZHg7XG4gIHRoaXMueSArPSBkeTtcbn1cblxuUG9pbnQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKG9iai5jb25zdHJ1Y3Rvci5uYW1lID09IFwiUG9pbnRcIikge1xuICAgIHZhciBwdCA9IG9iajtcbiAgICByZXR1cm4gKHRoaXMueCA9PSBwdC54KSAmJiAodGhpcy55ID09IHB0LnkpO1xuICB9XG4gIHJldHVybiB0aGlzID09IG9iajtcbn1cblxuUG9pbnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IFBvaW50KCkuY29uc3RydWN0b3IubmFtZSArIFwiW3g9XCIgKyB0aGlzLnggKyBcIix5PVwiICsgdGhpcy55ICsgXCJdXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCJmdW5jdGlvbiBQb2ludEQoeCwgeSkge1xuICBpZiAoeCA9PSBudWxsICYmIHkgPT0gbnVsbCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cbn1cblxuUG9pbnRELnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueDtcbn07XG5cblBvaW50RC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnk7XG59O1xuXG5Qb2ludEQucHJvdG90eXBlLnNldFggPSBmdW5jdGlvbiAoeClcbntcbiAgdGhpcy54ID0geDtcbn07XG5cblBvaW50RC5wcm90b3R5cGUuc2V0WSA9IGZ1bmN0aW9uICh5KVxue1xuICB0aGlzLnkgPSB5O1xufTtcblxuUG9pbnRELnByb3RvdHlwZS5nZXREaWZmZXJlbmNlID0gZnVuY3Rpb24gKHB0KVxue1xuICByZXR1cm4gbmV3IERpbWVuc2lvbkQodGhpcy54IC0gcHQueCwgdGhpcy55IC0gcHQueSk7XG59O1xuXG5Qb2ludEQucHJvdG90eXBlLmdldENvcHkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gbmV3IFBvaW50RCh0aGlzLngsIHRoaXMueSk7XG59O1xuXG5Qb2ludEQucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChkaW0pXG57XG4gIHRoaXMueCArPSBkaW0ud2lkdGg7XG4gIHRoaXMueSArPSBkaW0uaGVpZ2h0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnREO1xuIiwiZnVuY3Rpb24gUmFuZG9tU2VlZCgpIHtcbn1cblJhbmRvbVNlZWQuc2VlZCA9IDE7XG5SYW5kb21TZWVkLnggPSAwO1xuXG5SYW5kb21TZWVkLm5leHREb3VibGUgPSBmdW5jdGlvbiAoKSB7XG4gIFJhbmRvbVNlZWQueCA9IE1hdGguc2luKFJhbmRvbVNlZWQuc2VlZCsrKSAqIDEwMDAwO1xuICByZXR1cm4gUmFuZG9tU2VlZC54IC0gTWF0aC5mbG9vcihSYW5kb21TZWVkLngpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21TZWVkO1xuIiwiZnVuY3Rpb24gUmVjdGFuZ2xlRCh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHRoaXMueCA9IDA7XG4gIHRoaXMueSA9IDA7XG4gIHRoaXMud2lkdGggPSAwO1xuICB0aGlzLmhlaWdodCA9IDA7XG5cbiAgaWYgKHggIT0gbnVsbCAmJiB5ICE9IG51bGwgJiYgd2lkdGggIT0gbnVsbCAmJiBoZWlnaHQgIT0gbnVsbCkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cbn1cblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLng7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpXG57XG4gIHRoaXMueCA9IHg7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueTtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLnNldFkgPSBmdW5jdGlvbiAoeSlcbntcbiAgdGhpcy55ID0geTtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMud2lkdGg7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5zZXRXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aClcbntcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodClcbntcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRSaWdodCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoO1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0Qm90dG9tID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChhKVxue1xuICBpZiAodGhpcy5nZXRSaWdodCgpIDwgYS54KVxuICB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHRoaXMuZ2V0Qm90dG9tKCkgPCBhLnkpXG4gIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYS5nZXRSaWdodCgpIDwgdGhpcy54KVxuICB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGEuZ2V0Qm90dG9tKCkgPCB0aGlzLnkpXG4gIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldENlbnRlclggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCAvIDI7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRNaW5YID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuZ2V0WCgpO1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0TWF4WCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmdldFgoKSArIHRoaXMud2lkdGg7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRDZW50ZXJZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1pblkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5nZXRZKCk7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRNYXhZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuZ2V0WSgpICsgdGhpcy5oZWlnaHQ7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRXaWR0aEhhbGYgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHRIYWxmID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuaGVpZ2h0IC8gMjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVjdGFuZ2xlRDtcbiIsInZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xuXG5mdW5jdGlvbiBUcmFuc2Zvcm0oeCwgeSkge1xuICB0aGlzLmx3b3JsZE9yZ1ggPSAwLjA7XG4gIHRoaXMubHdvcmxkT3JnWSA9IDAuMDtcbiAgdGhpcy5sZGV2aWNlT3JnWCA9IDAuMDtcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IDAuMDtcbiAgdGhpcy5sd29ybGRFeHRYID0gMS4wO1xuICB0aGlzLmx3b3JsZEV4dFkgPSAxLjA7XG4gIHRoaXMubGRldmljZUV4dFggPSAxLjA7XG4gIHRoaXMubGRldmljZUV4dFkgPSAxLjA7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRPcmdYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubHdvcmxkT3JnWDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAod294KVxue1xuICB0aGlzLmx3b3JsZE9yZ1ggPSB3b3g7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRPcmdZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubHdvcmxkT3JnWTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZE9yZ1kgPSBmdW5jdGlvbiAod295KVxue1xuICB0aGlzLmx3b3JsZE9yZ1kgPSB3b3k7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRFeHRYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubHdvcmxkRXh0WDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZEV4dFggPSBmdW5jdGlvbiAod2V4KVxue1xuICB0aGlzLmx3b3JsZEV4dFggPSB3ZXg7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRFeHRZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubHdvcmxkRXh0WTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAod2V5KVxue1xuICB0aGlzLmx3b3JsZEV4dFkgPSB3ZXk7XG59XG5cbi8qIERldmljZSByZWxhdGVkICovXG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0RGV2aWNlT3JnWCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdYO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1ggPSBmdW5jdGlvbiAoZG94KVxue1xuICB0aGlzLmxkZXZpY2VPcmdYID0gZG94O1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmdldERldmljZU9yZ1kgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sZGV2aWNlT3JnWTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXREZXZpY2VPcmdZID0gZnVuY3Rpb24gKGRveSlcbntcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IGRveTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubGRldmljZUV4dFg7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuc2V0RGV2aWNlRXh0WCA9IGZ1bmN0aW9uIChkZXgpXG57XG4gIHRoaXMubGRldmljZUV4dFggPSBkZXg7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0RGV2aWNlRXh0WSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxkZXZpY2VFeHRZO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZUV4dFkgPSBmdW5jdGlvbiAoZGV5KVxue1xuICB0aGlzLmxkZXZpY2VFeHRZID0gZGV5O1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnRyYW5zZm9ybVggPSBmdW5jdGlvbiAoeClcbntcbiAgdmFyIHhEZXZpY2UgPSAwLjA7XG4gIHZhciB3b3JsZEV4dFggPSB0aGlzLmx3b3JsZEV4dFg7XG4gIGlmICh3b3JsZEV4dFggIT0gMC4wKVxuICB7XG4gICAgeERldmljZSA9IHRoaXMubGRldmljZU9yZ1ggK1xuICAgICAgICAgICAgKCh4IC0gdGhpcy5sd29ybGRPcmdYKSAqIHRoaXMubGRldmljZUV4dFggLyB3b3JsZEV4dFgpO1xuICB9XG5cbiAgcmV0dXJuIHhEZXZpY2U7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUudHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxue1xuICB2YXIgeURldmljZSA9IDAuMDtcbiAgdmFyIHdvcmxkRXh0WSA9IHRoaXMubHdvcmxkRXh0WTtcbiAgaWYgKHdvcmxkRXh0WSAhPSAwLjApXG4gIHtcbiAgICB5RGV2aWNlID0gdGhpcy5sZGV2aWNlT3JnWSArXG4gICAgICAgICAgICAoKHkgLSB0aGlzLmx3b3JsZE9yZ1kpICogdGhpcy5sZGV2aWNlRXh0WSAvIHdvcmxkRXh0WSk7XG4gIH1cblxuXG4gIHJldHVybiB5RGV2aWNlO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmludmVyc2VUcmFuc2Zvcm1YID0gZnVuY3Rpb24gKHgpXG57XG4gIHZhciB4V29ybGQgPSAwLjA7XG4gIHZhciBkZXZpY2VFeHRYID0gdGhpcy5sZGV2aWNlRXh0WDtcbiAgaWYgKGRldmljZUV4dFggIT0gMC4wKVxuICB7XG4gICAgeFdvcmxkID0gdGhpcy5sd29ybGRPcmdYICtcbiAgICAgICAgICAgICgoeCAtIHRoaXMubGRldmljZU9yZ1gpICogdGhpcy5sd29ybGRFeHRYIC8gZGV2aWNlRXh0WCk7XG4gIH1cblxuXG4gIHJldHVybiB4V29ybGQ7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVkgPSBmdW5jdGlvbiAoeSlcbntcbiAgdmFyIHlXb3JsZCA9IDAuMDtcbiAgdmFyIGRldmljZUV4dFkgPSB0aGlzLmxkZXZpY2VFeHRZO1xuICBpZiAoZGV2aWNlRXh0WSAhPSAwLjApXG4gIHtcbiAgICB5V29ybGQgPSB0aGlzLmx3b3JsZE9yZ1kgK1xuICAgICAgICAgICAgKCh5IC0gdGhpcy5sZGV2aWNlT3JnWSkgKiB0aGlzLmx3b3JsZEV4dFkgLyBkZXZpY2VFeHRZKTtcbiAgfVxuICByZXR1cm4geVdvcmxkO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmludmVyc2VUcmFuc2Zvcm1Qb2ludCA9IGZ1bmN0aW9uIChpblBvaW50KVxue1xuICB2YXIgb3V0UG9pbnQgPVxuICAgICAgICAgIG5ldyBQb2ludEQodGhpcy5pbnZlcnNlVHJhbnNmb3JtWChpblBvaW50LngpLFxuICAgICAgICAgICAgICAgICAgdGhpcy5pbnZlcnNlVHJhbnNmb3JtWShpblBvaW50LnkpKTtcbiAgcmV0dXJuIG91dFBvaW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcbiIsImZ1bmN0aW9uIFVuaXF1ZUlER2VuZXJldG9yKCkge1xufVxuXG5VbmlxdWVJREdlbmVyZXRvci5sYXN0SUQgPSAwO1xuXG5VbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgaWYgKFVuaXF1ZUlER2VuZXJldG9yLmlzUHJpbWl0aXZlKG9iaikpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG4gIGlmIChvYmoudW5pcXVlSUQgIT0gbnVsbCkge1xuICAgIHJldHVybiBvYmoudW5pcXVlSUQ7XG4gIH1cbiAgb2JqLnVuaXF1ZUlEID0gVW5pcXVlSURHZW5lcmV0b3IuZ2V0U3RyaW5nKCk7XG4gIFVuaXF1ZUlER2VuZXJldG9yLmxhc3RJRCsrO1xuICByZXR1cm4gb2JqLnVuaXF1ZUlEO1xufVxuXG5VbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcgPSBmdW5jdGlvbiAoaWQpIHtcbiAgaWYgKGlkID09IG51bGwpXG4gICAgaWQgPSBVbmlxdWVJREdlbmVyZXRvci5sYXN0SUQ7XG4gIHJldHVybiBcIk9iamVjdCNcIiArIGlkICsgXCJcIjtcbn1cblxuVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUgPSBmdW5jdGlvbiAoYXJnKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGFyZztcbiAgcmV0dXJuIGFyZyA9PSBudWxsIHx8ICh0eXBlICE9IFwib2JqZWN0XCIgJiYgdHlwZSAhPSBcImZ1bmN0aW9uXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVuaXF1ZUlER2VuZXJldG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGltZW5zaW9uRCA9IHJlcXVpcmUoJy4vRGltZW5zaW9uRCcpO1xudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL1BvaW50Jyk7XG52YXIgUG9pbnREID0gcmVxdWlyZSgnLi9Qb2ludEQnKTtcbnZhciBSYW5kb21TZWVkID0gcmVxdWlyZSgnLi9SYW5kb21TZWVkJyk7XG52YXIgUmVjdGFuZ2xlRCA9IHJlcXVpcmUoJy4vUmVjdGFuZ2xlRCcpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG52YXIgVW5pcXVlSURHZW5lcmV0b3IgPSByZXF1aXJlKCcuL1VuaXF1ZUlER2VuZXJldG9yJyk7XG52YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xudmFyIExFZGdlID0gcmVxdWlyZSgnLi9MRWRnZScpO1xudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcbnZhciBMYXlvdXQgPSByZXF1aXJlKCcuL0xheW91dCcpO1xudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXQgPSByZXF1aXJlKCcuL0ZETGF5b3V0Jyk7XG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXRFZGdlID0gcmVxdWlyZSgnLi9GRExheW91dEVkZ2UnKTtcbnZhciBGRExheW91dE5vZGUgPSByZXF1aXJlKCcuL0ZETGF5b3V0Tm9kZScpO1xudmFyIENvU0VDb25zdGFudHMgPSByZXF1aXJlKCcuL0NvU0VDb25zdGFudHMnKTtcbnZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcbnZhciBDb1NFR3JhcGggPSByZXF1aXJlKCcuL0NvU0VHcmFwaCcpO1xudmFyIENvU0VHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvU0VHcmFwaE1hbmFnZXInKTtcbnZhciBDb1NFTGF5b3V0ID0gcmVxdWlyZSgnLi9Db1NFTGF5b3V0Jyk7XG52YXIgQ29TRU5vZGUgPSByZXF1aXJlKCcuL0NvU0VOb2RlJyk7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRyZWFkeWBcbiAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRzdG9wYFxuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIC8vIGluY2x1ZGUgbGFiZWxzIGluIG5vZGUgZGltZW5zaW9uc1xuICBub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAvLyBudW1iZXIgb2YgdGlja3MgcGVyIGZyYW1lOyBoaWdoZXIgaXMgZmFzdGVyIGJ1dCBtb3JlIGplcmt5XG4gIHJlZnJlc2g6IDMwLFxuICAvLyBXaGV0aGVyIHRvIGZpdCB0aGUgbmV0d29yayB2aWV3IGFmdGVyIHdoZW4gZG9uZVxuICBmaXQ6IHRydWUsXG4gIC8vIFBhZGRpbmcgb24gZml0XG4gIHBhZGRpbmc6IDEwLFxuICAvLyBXaGV0aGVyIHRvIGVuYWJsZSBpbmNyZW1lbnRhbCBtb2RlXG4gIHJhbmRvbWl6ZTogdHJ1ZSxcbiAgLy8gTm9kZSByZXB1bHNpb24gKG5vbiBvdmVybGFwcGluZykgbXVsdGlwbGllclxuICBub2RlUmVwdWxzaW9uOiA0NTAwLFxuICAvLyBJZGVhbCBlZGdlIChub24gbmVzdGVkKSBsZW5ndGhcbiAgaWRlYWxFZGdlTGVuZ3RoOiA1MCxcbiAgLy8gRGl2aXNvciB0byBjb21wdXRlIGVkZ2UgZm9yY2VzXG4gIGVkZ2VFbGFzdGljaXR5OiAwLjQ1LFxuICAvLyBOZXN0aW5nIGZhY3RvciAobXVsdGlwbGllcikgdG8gY29tcHV0ZSBpZGVhbCBlZGdlIGxlbmd0aCBmb3IgbmVzdGVkIGVkZ2VzXG4gIG5lc3RpbmdGYWN0b3I6IDAuMSxcbiAgLy8gR3Jhdml0eSBmb3JjZSAoY29uc3RhbnQpXG4gIGdyYXZpdHk6IDAuMjUsXG4gIC8vIE1heGltdW0gbnVtYmVyIG9mIGl0ZXJhdGlvbnMgdG8gcGVyZm9ybVxuICBudW1JdGVyOiAyNTAwLFxuICAvLyBGb3IgZW5hYmxpbmcgdGlsaW5nXG4gIHRpbGU6IHRydWUsXG4gIC8vIFR5cGUgb2YgbGF5b3V0IGFuaW1hdGlvbi4gVGhlIG9wdGlvbiBzZXQgaXMgeydkdXJpbmcnLCAnZW5kJywgZmFsc2V9XG4gIGFuaW1hdGU6ICdlbmQnLFxuICAvLyBEdXJhdGlvbiBmb3IgYW5pbWF0ZTplbmRcbiAgYW5pbWF0aW9uRHVyYXRpb246IDUwMCxcbiAgLy93aGV0aGVyIHRvIHNob3cgaXRlcmF0aW9ucyBkdXJpbmcgYW5pbWF0aW9uXG4gIHNob3dBbmltYXRpb246IGZhbHNlLCBcbiAgLy8gUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHRoZSB2ZXJ0aWNhbCBzcGFjZSB0byBwdXQgYmV0d2VlbiB0aGUgemVybyBkZWdyZWUgbWVtYmVycyBkdXJpbmcgdGhlIHRpbGluZyBvcGVyYXRpb24oY2FuIGFsc28gYmUgYSBmdW5jdGlvbilcbiAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiAxMCxcbiAgLy8gUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHRoZSBob3Jpem9udGFsIHNwYWNlIHRvIHB1dCBiZXR3ZWVuIHRoZSB6ZXJvIGRlZ3JlZSBtZW1iZXJzIGR1cmluZyB0aGUgdGlsaW5nIG9wZXJhdGlvbihjYW4gYWxzbyBiZSBhIGZ1bmN0aW9uKVxuICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogMTAsXG4gIC8vIEdyYXZpdHkgcmFuZ2UgKGNvbnN0YW50KSBmb3IgY29tcG91bmRzXG4gIGdyYXZpdHlSYW5nZUNvbXBvdW5kOiAxLjUsXG4gIC8vIEdyYXZpdHkgZm9yY2UgKGNvbnN0YW50KSBmb3IgY29tcG91bmRzXG4gIGdyYXZpdHlDb21wb3VuZDogMS4wLFxuICAvLyBHcmF2aXR5IHJhbmdlIChjb25zdGFudClcbiAgZ3Jhdml0eVJhbmdlOiAzLjgsXG4gIC8vIEluaXRpYWwgY29vbGluZyBmYWN0b3IgZm9yIGluY3JlbWVudGFsIGxheW91dFxuICBpbml0aWFsRW5lcmd5T25JbmNyZW1lbnRhbDogMC41XG59O1xuXG5mdW5jdGlvbiBleHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpIHtcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGZvciAodmFyIGkgaW4gZGVmYXVsdHMpIHtcbiAgICBvYmpbaV0gPSBkZWZhdWx0c1tpXTtcbiAgfVxuXG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xuICAgIG9ialtpXSA9IG9wdGlvbnNbaV07XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuZnVuY3Rpb24gX0NvU0VMYXlvdXQoX29wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBfb3B0aW9ucyk7XG4gIGdldFVzZXJPcHRpb25zKHRoaXMub3B0aW9ucyk7XG59XG5cbnZhciBnZXRVc2VyT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLm5vZGVSZXB1bHNpb24gIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEggPSBvcHRpb25zLm5vZGVSZXB1bHNpb247XG4gIGlmIChvcHRpb25zLmlkZWFsRWRnZUxlbmd0aCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPSBvcHRpb25zLmlkZWFsRWRnZUxlbmd0aDtcbiAgaWYgKG9wdGlvbnMuZWRnZUVsYXN0aWNpdHkgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9TUFJJTkdfU1RSRU5HVEggPSBvcHRpb25zLmVkZ2VFbGFzdGljaXR5O1xuICBpZiAob3B0aW9ucy5uZXN0aW5nRmFjdG9yICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5QRVJfTEVWRUxfSURFQUxfRURHRV9MRU5HVEhfRkFDVE9SID0gRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiA9IG9wdGlvbnMubmVzdGluZ0ZhY3RvcjtcbiAgaWYgKG9wdGlvbnMuZ3Jhdml0eSAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gb3B0aW9ucy5ncmF2aXR5O1xuICBpZiAob3B0aW9ucy5udW1JdGVyICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5NQVhfSVRFUkFUSU9OUyA9IEZETGF5b3V0Q29uc3RhbnRzLk1BWF9JVEVSQVRJT05TID0gb3B0aW9ucy5udW1JdGVyO1xuICBpZiAob3B0aW9ucy5ncmF2aXR5UmFuZ2UgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SID0gb3B0aW9ucy5ncmF2aXR5UmFuZ2U7XG4gIGlmKG9wdGlvbnMuZ3Jhdml0eUNvbXBvdW5kICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEggPSBvcHRpb25zLmdyYXZpdHlDb21wb3VuZDtcbiAgaWYob3B0aW9ucy5ncmF2aXR5UmFuZ2VDb21wb3VuZCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBvcHRpb25zLmdyYXZpdHlSYW5nZUNvbXBvdW5kO1xuICBpZiAob3B0aW9ucy5pbml0aWFsRW5lcmd5T25JbmNyZW1lbnRhbCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUwgPSBvcHRpb25zLmluaXRpYWxFbmVyZ3lPbkluY3JlbWVudGFsO1xuXG4gIENvU0VDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gRkRMYXlvdXRDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gTGF5b3V0Q29uc3RhbnRzLk5PREVfRElNRU5TSU9OU19JTkNMVURFX0xBQkVMUyA9IG9wdGlvbnMubm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzO1xuICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPVxuICAgICAgICAgICEob3B0aW9ucy5yYW5kb21pemUpO1xuICBDb1NFQ29uc3RhbnRzLkFOSU1BVEUgPSBGRExheW91dENvbnN0YW50cy5BTklNQVRFID0gTGF5b3V0Q29uc3RhbnRzLkFOSU1BVEUgPSBvcHRpb25zLmFuaW1hdGU7XG4gIENvU0VDb25zdGFudHMuVElMRSA9IG9wdGlvbnMudGlsZTtcbiAgQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19WRVJUSUNBTCA9IFxuICAgICAgICAgIHR5cGVvZiBvcHRpb25zLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsLmNhbGwoKSA6IG9wdGlvbnMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICBDb1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX0hPUklaT05UQUwgPSBcbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGlsaW5nUGFkZGluZ0hvcml6b250YWwuY2FsbCgpIDogb3B0aW9ucy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDtcbn07XG5cbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZWFkeTtcbiAgdmFyIGZyYW1lSWQ7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB2YXIgaWRUb0xOb2RlID0gdGhpcy5pZFRvTE5vZGUgPSB7fTtcbiAgdmFyIGxheW91dCA9IHRoaXMubGF5b3V0ID0gbmV3IENvU0VMYXlvdXQoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgc2VsZi5zdG9wcGVkID0gZmFsc2U7XG5cbiAgdGhpcy5jeSA9IHRoaXMub3B0aW9ucy5jeTtcblxuICB0aGlzLmN5LnRyaWdnZXIoeyB0eXBlOiAnbGF5b3V0c3RhcnQnLCBsYXlvdXQ6IHRoaXMgfSk7XG5cbiAgdmFyIGdtID0gbGF5b3V0Lm5ld0dyYXBoTWFuYWdlcigpO1xuICB0aGlzLmdtID0gZ207XG5cbiAgdmFyIG5vZGVzID0gdGhpcy5vcHRpb25zLmVsZXMubm9kZXMoKTtcbiAgdmFyIGVkZ2VzID0gdGhpcy5vcHRpb25zLmVsZXMuZWRnZXMoKTtcblxuICB0aGlzLnJvb3QgPSBnbS5hZGRSb290KCk7XG4gIHRoaXMucHJvY2Vzc0NoaWxkcmVuTGlzdCh0aGlzLnJvb3QsIHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKSwgbGF5b3V0KTtcblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgIHZhciBzb3VyY2VOb2RlID0gdGhpcy5pZFRvTE5vZGVbZWRnZS5kYXRhKFwic291cmNlXCIpXTtcbiAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuaWRUb0xOb2RlW2VkZ2UuZGF0YShcInRhcmdldFwiKV07XG4gICAgaWYoc291cmNlTm9kZS5nZXRFZGdlc0JldHdlZW4odGFyZ2V0Tm9kZSkubGVuZ3RoID09IDApe1xuICAgICAgdmFyIGUxID0gZ20uYWRkKGxheW91dC5uZXdFZGdlKCksIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpO1xuICAgICAgZTEuaWQgPSBlZGdlLmlkKCk7XG4gICAgfVxuICB9XG4gIFxuICAgdmFyIGdldFBvc2l0aW9ucyA9IGZ1bmN0aW9uKGVsZSwgaSl7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgdmFyIHRoZUlkID0gZWxlLmRhdGEoJ2lkJyk7XG4gICAgdmFyIGxOb2RlID0gc2VsZi5pZFRvTE5vZGVbdGhlSWRdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGxOb2RlLmdldFJlY3QoKS5nZXRDZW50ZXJYKCksXG4gICAgICB5OiBsTm9kZS5nZXRSZWN0KCkuZ2V0Q2VudGVyWSgpXG4gICAgfTtcbiAgfTtcbiAgXG4gIC8qXG4gICAqIFJlcG9zaXRpb24gbm9kZXMgaW4gaXRlcmF0aW9ucyBhbmltYXRlZGx5XG4gICAqL1xuICB2YXIgaXRlcmF0ZUFuaW1hdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaWdzIHRvIHBlcmZvcm0gYWZ0ZXIgbm9kZXMgYXJlIHJlcG9zaXRpb25lZCBvbiBzY3JlZW5cbiAgICB2YXIgYWZ0ZXJSZXBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3B0aW9ucy5maXQpIHtcbiAgICAgICAgb3B0aW9ucy5jeS5maXQob3B0aW9ucy5lbGVzLm5vZGVzKCksIG9wdGlvbnMucGFkZGluZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgcmVhZHkgPSB0cnVlO1xuICAgICAgICBzZWxmLmN5Lm9uZSgnbGF5b3V0cmVhZHknLCBvcHRpb25zLnJlYWR5KTtcbiAgICAgICAgc2VsZi5jeS50cmlnZ2VyKHt0eXBlOiAnbGF5b3V0cmVhZHknLCBsYXlvdXQ6IHNlbGZ9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIHZhciB0aWNrc1BlckZyYW1lID0gc2VsZi5vcHRpb25zLnJlZnJlc2g7XG4gICAgdmFyIGlzRG9uZTtcblxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGlja3NQZXJGcmFtZSAmJiAhaXNEb25lOyBpKysgKXtcbiAgICAgIGlzRG9uZSA9IHNlbGYuc3RvcHBlZCB8fCBzZWxmLmxheW91dC50aWNrKCk7XG4gICAgfVxuICAgIFxuICAgIC8vIElmIGxheW91dCBpcyBkb25lXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgLy8gSWYgdGhlIGxheW91dCBpcyBub3QgYSBzdWJsYXlvdXQgYW5kIGl0IGlzIHN1Y2Nlc3NmdWwgcGVyZm9ybSBwb3N0IGxheW91dC5cbiAgICAgIGlmIChsYXlvdXQuY2hlY2tMYXlvdXRTdWNjZXNzKCkgJiYgIWxheW91dC5pc1N1YkxheW91dCkge1xuICAgICAgICBsYXlvdXQuZG9Qb3N0TGF5b3V0KCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIElmIGxheW91dCBoYXMgYSB0aWxpbmdQb3N0TGF5b3V0IGZ1bmN0aW9uIHByb3BlcnR5IGNhbGwgaXQuXG4gICAgICBpZiAobGF5b3V0LnRpbGluZ1Bvc3RMYXlvdXQpIHtcbiAgICAgICAgbGF5b3V0LnRpbGluZ1Bvc3RMYXlvdXQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGF5b3V0LmlzTGF5b3V0RmluaXNoZWQgPSB0cnVlO1xuICAgICAgXG4gICAgICBzZWxmLm9wdGlvbnMuZWxlcy5ub2RlcygpLnBvc2l0aW9ucyhnZXRQb3NpdGlvbnMpO1xuICAgICAgXG4gICAgICBhZnRlclJlcG9zaXRpb24oKTtcbiAgICAgIFxuICAgICAgLy8gdHJpZ2dlciBsYXlvdXRzdG9wIHdoZW4gdGhlIGxheW91dCBzdG9wcyAoZS5nLiBmaW5pc2hlcylcbiAgICAgIHNlbGYuY3kub25lKCdsYXlvdXRzdG9wJywgc2VsZi5vcHRpb25zLnN0b3ApO1xuICAgICAgc2VsZi5jeS50cmlnZ2VyKHsgdHlwZTogJ2xheW91dHN0b3AnLCBsYXlvdXQ6IHNlbGYgfSk7XG5cbiAgICAgIGlmIChmcmFtZUlkKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGZyYW1lSWQpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZWFkeSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB2YXIgYW5pbWF0aW9uRGF0YSA9IHNlbGYubGF5b3V0LmdldFBvc2l0aW9uc0RhdGEoKTsgLy8gR2V0IHBvc2l0aW9ucyBvZiBsYXlvdXQgbm9kZXMgbm90ZSB0aGF0IGFsbCBub2RlcyBtYXkgbm90IGJlIGxheW91dCBub2RlcyBiZWNhdXNlIG9mIHRpbGluZ1xuICAgIHZhciBlZGdlRGF0YSA9IHNlbGYubGF5b3V0LmdldEVkZ2VzRGF0YSgpO1xuICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VuZCcsIHsnZGV0YWlsJzogW2FuaW1hdGlvbkRhdGEsIGVkZ2VEYXRhXX0pO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTsgXG4gICAgXG4gICAgaWYob3B0aW9ucy5zaG93QW5pbWF0aW9uKXtcbiAgICAgIC8vIFBvc2l0aW9uIG5vZGVzLCBmb3IgdGhlIG5vZGVzIHdob3NlIGlkIGRvZXMgbm90IGluY2x1ZGVkIGluIGRhdGEgKGJlY2F1c2UgdGhleSBhcmUgcmVtb3ZlZCBmcm9tIHRoZWlyIHBhcmVudHMgYW5kIGluY2x1ZGVkIGluIGR1bW15IGNvbXBvdW5kcylcbiAgICAgIC8vIHVzZSBwb3NpdGlvbiBvZiB0aGVpciBhbmNlc3RvcnMgb3IgZHVtbXkgYW5jZXN0b3JzXG4gICAgICBvcHRpb25zLmVsZXMubm9kZXMoKS5wb3NpdGlvbnMoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZUlkID0gZWxlLmlkKCk7XG4gICAgICAgIHZhciBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGhlSWRdO1xuICAgICAgICB2YXIgdGVtcCA9IGVsZTtcbiAgICAgICAgLy8gSWYgcE5vZGUgaXMgdW5kZWZpbmVkIHNlYXJjaCB1bnRpbCBmaW5kaW5nIHBvc2l0aW9uIGRhdGEgb2YgaXRzIGZpcnN0IGFuY2VzdG9yIChJdCBtYXkgYmUgZHVtbXkgYXMgd2VsbClcbiAgICAgICAgd2hpbGUgKHBOb2RlID09IG51bGwpIHtcbiAgICAgICAgICBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGVtcC5kYXRhKCdwYXJlbnQnKV0gfHwgYW5pbWF0aW9uRGF0YVsnRHVtbXlDb21wb3VuZF8nICsgdGVtcC5kYXRhKCdwYXJlbnQnKV07XG4gICAgICAgICAgYW5pbWF0aW9uRGF0YVt0aGVJZF0gPSBwTm9kZTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wYXJlbnQoKVswXTtcbiAgICAgICAgICBpZih0ZW1wID09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYocE5vZGUgIT0gbnVsbCl7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHBOb2RlLngsXG4gICAgICAgICAgICB5OiBwTm9kZS55XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBhZnRlclJlcG9zaXRpb24oKTtcblxuICAgIGZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaXRlcmF0ZUFuaW1hdGVkKTtcbiAgfTtcbiAgXG4gIC8qXG4gICogTGlzdGVuICdsYXlvdXRzdGFydGVkJyBldmVudCBhbmQgc3RhcnQgYW5pbWF0ZWQgaXRlcmF0aW9uIGlmIGFuaW1hdGUgb3B0aW9uIGlzICdkdXJpbmcnXG4gICovXG4gIGxheW91dC5hZGRMaXN0ZW5lcignbGF5b3V0c3RhcnRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi5vcHRpb25zLmFuaW1hdGUgPT09ICdkdXJpbmcnKSB7XG4gICAgICBmcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGl0ZXJhdGVBbmltYXRlZCk7XG4gICAgfVxuICB9KTtcbiAgXG4gIGxheW91dC5ydW5MYXlvdXQoKTsgLy8gUnVuIGNvc2UgbGF5b3V0XG4gIFxuICAvKlxuICAgKiBJZiBhbmltYXRlIG9wdGlvbiBpcyBub3QgJ2R1cmluZycgKCdlbmQnIG9yIGZhbHNlKSBwZXJmb3JtIHRoZXNlIGhlcmUgKElmIGl0IGlzICdkdXJpbmcnIHNpbWlsYXIgdGhpbmdzIGFyZSBhbHJlYWR5IHBlcmZvcm1lZClcbiAgICovXG4gIGlmKHRoaXMub3B0aW9ucy5hbmltYXRlICE9IFwiZHVyaW5nXCIpe1xuICAgIHNlbGYub3B0aW9ucy5lbGVzLm5vZGVzKCkubm90KFwiOnBhcmVudFwiKS5sYXlvdXRQb3NpdGlvbnMoc2VsZiwgc2VsZi5vcHRpb25zLCBnZXRQb3NpdGlvbnMpOyAvLyBVc2UgbGF5b3V0IHBvc2l0aW9ucyB0byByZXBvc2l0aW9uIHRoZSBub2RlcyBpdCBjb25zaWRlcnMgdGhlIG9wdGlvbnMgcGFyYW1ldGVyXG4gICAgcmVhZHkgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xufTtcblxuLy9HZXQgdGhlIHRvcCBtb3N0IG9uZXMgb2YgYSBsaXN0IG9mIG5vZGVzXG5fQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0VG9wTW9zdE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgdmFyIG5vZGVzTWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcbiAgfVxuICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGUgPSBpO1xuICAgICAgfVxuICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcbiAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcbiAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiByb290cztcbn07XG5cbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5wcm9jZXNzQ2hpbGRyZW5MaXN0ID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGRyZW4sIGxheW91dCkge1xuICB2YXIgc2l6ZSA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICB2YXIgdGhlQ2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICB2YXIgY2hpbGRyZW5fb2ZfY2hpbGRyZW4gPSB0aGVDaGlsZC5jaGlsZHJlbigpO1xuICAgIHZhciB0aGVOb2RlOyAgICBcblxuLy8gICAgdmFyIGRpbWVuc2lvbnMgPSB0aGVDaGlsZC5sYXlvdXREaW1lbnNpb25zKHtcbi8vICAgICAgbm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzOiB0aGlzLm9wdGlvbnMubm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzXG4vLyAgICB9KTtcblxuICAgIGlmICh0aGVDaGlsZC5vdXRlcldpZHRoKCkgIT0gbnVsbFxuICAgICAgICAgICAgJiYgdGhlQ2hpbGQub3V0ZXJIZWlnaHQoKSAhPSBudWxsKSB7XG4gICAgICB0aGVOb2RlID0gcGFyZW50LmFkZChuZXcgQ29TRU5vZGUobGF5b3V0LmdyYXBoTWFuYWdlcixcbiAgICAgICAgICAgICAgbmV3IFBvaW50RCh0aGVDaGlsZC5wb3NpdGlvbigneCcpIC0gdGhlQ2hpbGQub3V0ZXJXaWR0aCgpIC8gMiwgdGhlQ2hpbGQucG9zaXRpb24oJ3knKSAtIHRoZUNoaWxkLm91dGVySGVpZ2h0KCkgLyAyKSxcbiAgICAgICAgICAgICAgbmV3IERpbWVuc2lvbkQocGFyc2VGbG9hdCh0aGVDaGlsZC5vdXRlcldpZHRoKCkpLCBwYXJzZUZsb2F0KHRoZUNoaWxkLm91dGVySGVpZ2h0KCkpKSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoZU5vZGUgPSBwYXJlbnQuYWRkKG5ldyBDb1NFTm9kZSh0aGlzLmdyYXBoTWFuYWdlcikpO1xuICAgIH1cbiAgICAvLyBBdHRhY2ggaWQgdG8gdGhlIGxheW91dCBub2RlXG4gICAgdGhlTm9kZS5pZCA9IHRoZUNoaWxkLmRhdGEoXCJpZFwiKTtcbiAgICAvLyBBdHRhY2ggdGhlIHBhZGRpbmdzIG9mIGN5IG5vZGUgdG8gbGF5b3V0IG5vZGVcbiAgICB0aGVOb2RlLnBhZGRpbmdMZWZ0ID0gcGFyc2VJbnQoIHRoZUNoaWxkLmNzcygncGFkZGluZycpICk7XG4gICAgdGhlTm9kZS5wYWRkaW5nVG9wID0gcGFyc2VJbnQoIHRoZUNoaWxkLmNzcygncGFkZGluZycpICk7XG4gICAgdGhlTm9kZS5wYWRkaW5nUmlnaHQgPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICB0aGVOb2RlLnBhZGRpbmdCb3R0b20gPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICBcbiAgICAvL0F0dGFjaCB0aGUgbGFiZWwgcHJvcGVydGllcyB0byBjb21wb3VuZCBpZiBsYWJlbHMgd2lsbCBiZSBpbmNsdWRlZCBpbiBub2RlIGRpbWVuc2lvbnMgIFxuICAgIGlmKHRoaXMub3B0aW9ucy5ub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHMpe1xuICAgICAgaWYodGhlQ2hpbGQuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgdmFyIGxhYmVsV2lkdGggPSB0aGVDaGlsZC5ib3VuZGluZ0JveCh7IGluY2x1ZGVMYWJlbHM6IHRydWUsIGluY2x1ZGVOb2RlczogZmFsc2UgfSkudzsgICAgICAgICAgXG4gICAgICAgICAgdmFyIGxhYmVsSGVpZ2h0ID0gdGhlQ2hpbGQuYm91bmRpbmdCb3goeyBpbmNsdWRlTGFiZWxzOiB0cnVlLCBpbmNsdWRlTm9kZXM6IGZhbHNlIH0pLmg7XG4gICAgICAgICAgdmFyIGxhYmVsUG9zID0gdGhlQ2hpbGQuY3NzKFwidGV4dC1oYWxpZ25cIik7XG4gICAgICAgICAgdGhlTm9kZS5sYWJlbFdpZHRoID0gbGFiZWxXaWR0aDtcbiAgICAgICAgICB0aGVOb2RlLmxhYmVsSGVpZ2h0ID0gbGFiZWxIZWlnaHQ7XG4gICAgICAgICAgdGhlTm9kZS5sYWJlbFBvcyA9IGxhYmVsUG9zO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBNYXAgdGhlIGxheW91dCBub2RlXG4gICAgdGhpcy5pZFRvTE5vZGVbdGhlQ2hpbGQuZGF0YShcImlkXCIpXSA9IHRoZU5vZGU7XG5cbiAgICBpZiAoaXNOYU4odGhlTm9kZS5yZWN0LngpKSB7XG4gICAgICB0aGVOb2RlLnJlY3QueCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOKHRoZU5vZGUucmVjdC55KSkge1xuICAgICAgdGhlTm9kZS5yZWN0LnkgPSAwO1xuICAgIH1cblxuICAgIGlmIChjaGlsZHJlbl9vZl9jaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuX29mX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciB0aGVOZXdHcmFwaDtcbiAgICAgIHRoZU5ld0dyYXBoID0gbGF5b3V0LmdldEdyYXBoTWFuYWdlcigpLmFkZChsYXlvdXQubmV3R3JhcGgoKSwgdGhlTm9kZSk7XG4gICAgICB0aGlzLnByb2Nlc3NDaGlsZHJlbkxpc3QodGhlTmV3R3JhcGgsIGNoaWxkcmVuX29mX2NoaWxkcmVuLCBsYXlvdXQpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBAYnJpZWYgOiBjYWxsZWQgb24gY29udGludW91cyBsYXlvdXRzIHRvIHN0b3AgdGhlbSBiZWZvcmUgdGhleSBmaW5pc2hcbiAqL1xuX0NvU0VMYXlvdXQucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc3RvcHBlZCA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXM7IC8vIGNoYWluaW5nXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldChjeXRvc2NhcGUpIHtcbiAgcmV0dXJuIF9Db1NFTGF5b3V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxudmFyIGdldExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG5cbnZhciByZWdpc3RlciA9IGZ1bmN0aW9uKCBjeXRvc2NhcGUgKXtcbiAgdmFyIExheW91dCA9IGdldExheW91dCggY3l0b3NjYXBlICk7XG5cbiAgY3l0b3NjYXBlKCdsYXlvdXQnLCAnY29zZS1iaWxrZW50JywgTGF5b3V0KTtcbn07XG5cbi8vIGF1dG8gcmVnIGZvciBnbG9iYWxzXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuIl19
