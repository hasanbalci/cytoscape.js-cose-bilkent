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
      var distance = (Math.max(v.getPred1().getWidth(), v.getPred1().getHeight()) + Math.max(v.getPred2().getWidth(), v.getPred2().getHeight())) / 2 + 5;
      console.log(distance);
      var xPos = Math.random() * 2 * distance - distance;
      console.log(xPos);
      var yPos = Math.random() < 0.5 ? Math.sqrt(distance * distance - xPos * xPos) : -1 * Math.sqrt(distance * distance - xPos * xPos);
      console.log(yPos);

      v.getPred2().setCenter(v.getPred1().getCenterX + xPos, v.getPred1().getCenterY + yPos);

      //      v.getPred2().setLocation(v.getLeft()+this.idealEdgeLength, 
      //              v.getTop()+this.idealEdgeLength);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlua2VkbGlzdC1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9saW5rZWRsaXN0LWpzL3NyYy9MaXN0LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtlZGxpc3QtanMvc3JjL05vZGUuanMiLCJzcmMvTGF5b3V0L0NvU0VDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L0NvU0VFZGdlLmpzIiwic3JjL0xheW91dC9Db1NFR3JhcGguanMiLCJzcmMvTGF5b3V0L0NvU0VHcmFwaE1hbmFnZXIuanMiLCJzcmMvTGF5b3V0L0NvU0VMYXlvdXQuanMiLCJzcmMvTGF5b3V0L0NvU0VOb2RlLmpzIiwic3JjL0xheW91dC9Db2Fyc2VuaW5nRWRnZS5qcyIsInNyYy9MYXlvdXQvQ29hcnNlbmluZ0dyYXBoLmpzIiwic3JjL0xheW91dC9Db2Fyc2VuaW5nTm9kZS5qcyIsInNyYy9MYXlvdXQvRGltZW5zaW9uRC5qcyIsInNyYy9MYXlvdXQvRW1pdHRlci5qcyIsInNyYy9MYXlvdXQvRkRMYXlvdXQuanMiLCJzcmMvTGF5b3V0L0ZETGF5b3V0Q29uc3RhbnRzLmpzIiwic3JjL0xheW91dC9GRExheW91dEVkZ2UuanMiLCJzcmMvTGF5b3V0L0ZETGF5b3V0Tm9kZS5qcyIsInNyYy9MYXlvdXQvSGFzaE1hcC5qcyIsInNyYy9MYXlvdXQvSGFzaFNldC5qcyIsInNyYy9MYXlvdXQvSUdlb21ldHJ5LmpzIiwic3JjL0xheW91dC9JTWF0aC5qcyIsInNyYy9MYXlvdXQvSW50ZWdlci5qcyIsInNyYy9MYXlvdXQvTEVkZ2UuanMiLCJzcmMvTGF5b3V0L0xHcmFwaC5qcyIsInNyYy9MYXlvdXQvTEdyYXBoTWFuYWdlci5qcyIsInNyYy9MYXlvdXQvTEdyYXBoT2JqZWN0LmpzIiwic3JjL0xheW91dC9MTm9kZS5qcyIsInNyYy9MYXlvdXQvTGF5b3V0LmpzIiwic3JjL0xheW91dC9MYXlvdXRDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L1BvaW50LmpzIiwic3JjL0xheW91dC9Qb2ludEQuanMiLCJzcmMvTGF5b3V0L1JhbmRvbVNlZWQuanMiLCJzcmMvTGF5b3V0L1JlY3RhbmdsZUQuanMiLCJzcmMvTGF5b3V0L1RyYW5zZm9ybS5qcyIsInNyYy9MYXlvdXQvVW5pcXVlSURHZW5lcmV0b3IuanMiLCJzcmMvTGF5b3V0L2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkNBLElBQUksb0JBQW9CLFFBQVEscUJBQVIsQ0FBeEI7O0FBRUEsU0FBUyxhQUFULEdBQXlCLENBQ3hCOztBQUVEO0FBQ0EsS0FBSyxJQUFJLElBQVQsSUFBaUIsaUJBQWpCLEVBQW9DO0FBQ2xDLGdCQUFjLElBQWQsSUFBc0Isa0JBQWtCLElBQWxCLENBQXRCO0FBQ0Q7O0FBRUQsY0FBYywrQkFBZCxHQUFnRCxJQUFoRDtBQUNBLGNBQWMseUJBQWQsR0FBMEMsa0JBQWtCLG1CQUE1RDtBQUNBLGNBQWMsNEJBQWQsR0FBNkMsRUFBN0M7QUFDQSxjQUFjLElBQWQsR0FBcUIsSUFBckI7QUFDQSxjQUFjLHVCQUFkLEdBQXdDLEVBQXhDO0FBQ0EsY0FBYyx5QkFBZCxHQUEwQyxFQUExQzs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsYUFBakI7Ozs7O0FDakJBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5COztBQUVBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUN2QyxlQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsTUFBeEIsRUFBZ0MsTUFBaEMsRUFBd0MsS0FBeEM7QUFDRDs7QUFFRCxTQUFTLFNBQVQsR0FBcUIsT0FBTyxNQUFQLENBQWMsYUFBYSxTQUEzQixDQUFyQjtBQUNBLEtBQUssSUFBSSxJQUFULElBQWlCLFlBQWpCLEVBQStCO0FBQzdCLFdBQVMsSUFBVCxJQUFpQixhQUFhLElBQWIsQ0FBakI7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakI7Ozs7O0FDWEEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiOztBQUVBLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixRQUEzQixFQUFxQyxNQUFyQyxFQUE2QztBQUMzQyxTQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLEVBQW9DLE1BQXBDO0FBQ0Q7O0FBRUQsVUFBVSxTQUFWLEdBQXNCLE9BQU8sTUFBUCxDQUFjLE9BQU8sU0FBckIsQ0FBdEI7QUFDQSxLQUFLLElBQUksSUFBVCxJQUFpQixNQUFqQixFQUF5QjtBQUN2QixZQUFVLElBQVYsSUFBa0IsT0FBTyxJQUFQLENBQWxCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFNBQWpCOzs7OztBQ1hBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7QUFDQSxJQUFJLGtCQUFrQixRQUFRLG1CQUFSLENBQXRCO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFyQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQztBQUNoQyxnQkFBYyxJQUFkLENBQW1CLElBQW5CLEVBQXlCLE1BQXpCO0FBQ0Q7O0FBRUQsaUJBQWlCLFNBQWpCLEdBQTZCLE9BQU8sTUFBUCxDQUFjLGNBQWMsU0FBNUIsQ0FBN0I7QUFDQSxLQUFLLElBQUksSUFBVCxJQUFpQixhQUFqQixFQUFnQztBQUM5QixtQkFBaUIsSUFBakIsSUFBeUIsY0FBYyxJQUFkLENBQXpCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxpQkFBaUIsU0FBakIsQ0FBMkIsWUFBM0IsR0FBMEMsWUFDMUM7QUFDRSxNQUFJLFFBQVEsRUFBWjtBQUNBLE1BQUksYUFBSjtBQUNBLE1BQUksYUFBSjs7QUFFQTtBQUNBLFFBQU0sSUFBTixDQUFXLElBQVg7O0FBRUE7QUFDQTtBQUNBLE1BQUksSUFBSSxJQUFJLGVBQUosQ0FBb0IsS0FBSyxTQUFMLEVBQXBCLENBQVI7O0FBRUE7QUFDQSxPQUFLLHdCQUFMLENBQThCLEtBQUssT0FBTCxFQUE5QixFQUE4QyxDQUE5QztBQUNBLGtCQUFnQixFQUFFLFFBQUYsR0FBYSxNQUE3Qjs7QUFFQSxNQUFJLEtBQUosRUFBVyxJQUFYOztBQUVBO0FBQ0E7QUFDQSxLQUFHO0FBQ0Qsb0JBQWdCLGFBQWhCOztBQUVBO0FBQ0EsTUFBRSxPQUFGOztBQUVBO0FBQ0EsWUFBUSxNQUFNLE1BQU0sTUFBTixHQUFhLENBQW5CLENBQVI7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBUDs7QUFFQSxVQUFNLElBQU4sQ0FBVyxJQUFYO0FBQ0Esb0JBQWdCLEVBQUUsUUFBRixHQUFhLE1BQTdCO0FBRUQsR0FiRCxRQWFVLGlCQUFpQixhQUFsQixJQUFxQyxnQkFBZ0IsQ0FiOUQ7O0FBZUE7QUFDQSxPQUFLLFNBQUwsR0FBaUIsZUFBakIsQ0FBaUMsSUFBakM7O0FBRUEsUUFBTSxHQUFOO0FBQ0EsU0FBTyxLQUFQO0FBQ0QsQ0F6Q0Q7O0FBMkNBOzs7O0FBSUEsaUJBQWlCLFNBQWpCLENBQTJCLHdCQUEzQixHQUFzRCxVQUFTLEtBQVQsRUFBZ0IsQ0FBaEIsRUFDdEQ7QUFDRTtBQUNBLE1BQUksTUFBTSxJQUFJLE9BQUosRUFBVjs7QUFFQTtBQUNBLE1BQUksUUFBUSxNQUFNLFFBQU4sRUFBWjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFFBQUksSUFBSSxNQUFNLENBQU4sQ0FBUjs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxFQUFFLFFBQUYsTUFBZ0IsSUFBcEIsRUFDQTtBQUNFLFdBQUssd0JBQUwsQ0FBOEIsRUFBRSxRQUFGLEVBQTlCLEVBQTRDLENBQTVDO0FBQ0QsS0FIRCxNQUlLO0FBQ0w7QUFDRTtBQUNBLFlBQUksSUFBSSxJQUFJLGNBQUosRUFBUjtBQUNBLFVBQUUsWUFBRixDQUFlLENBQWY7O0FBRUE7QUFDQSxZQUFJLEdBQUosQ0FBUSxDQUFSLEVBQVcsQ0FBWDs7QUFFQSxVQUFFLEdBQUYsQ0FBTyxDQUFQO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLE1BQUksUUFBUSxNQUFNLFFBQU4sRUFBWjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFFBQUksSUFBSSxNQUFNLENBQU4sQ0FBUjtBQUNFO0FBQ0E7QUFDQSxRQUFLLEVBQUUsU0FBRixHQUFjLFFBQWQsTUFBNEIsSUFBN0IsSUFBdUMsRUFBRSxTQUFGLEdBQWMsUUFBZCxNQUE0QixJQUF2RSxFQUNBO0FBQ0UsUUFBRSxHQUFGLENBQU0sSUFBSSxjQUFKLEVBQU4sRUFBNEIsSUFBSSxHQUFKLENBQVEsRUFBRSxTQUFGLEVBQVIsQ0FBNUIsRUFBb0QsSUFBSSxHQUFKLENBQVEsRUFBRSxTQUFGLEVBQVIsQ0FBcEQ7QUFDRDtBQUNKO0FBQ0YsQ0F4Q0Q7O0FBMENBOzs7O0FBSUEsaUJBQWlCLFNBQWpCLENBQTJCLE9BQTNCLEdBQXFDLFVBQVMsS0FBVCxFQUFlOztBQUVsRDtBQUNBLE1BQUksT0FBTyxJQUFJLGdCQUFKLENBQXFCLE1BQU0sU0FBTixFQUFyQixDQUFYOztBQUVBO0FBQ0EsT0FBSyxTQUFMLEdBQWlCLGVBQWpCLENBQWlDLElBQWpDO0FBQ0EsT0FBSyxPQUFMOztBQUVBLE9BQUssT0FBTCxHQUFlLFlBQWYsR0FBOEIsTUFBTSxPQUFOLEdBQWdCLFlBQTlDOztBQUVBO0FBQ0EsT0FBSyxZQUFMLENBQWtCLE1BQU0sT0FBTixFQUFsQixFQUFtQyxLQUFLLE9BQUwsRUFBbkM7O0FBRUE7QUFDQSxRQUFNLFNBQU4sR0FBa0IsZUFBbEIsQ0FBa0MsS0FBbEM7O0FBRUE7QUFDQSxPQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQXFCLElBQXJCOztBQUVBLFNBQU8sSUFBUDtBQUNELENBckJEOztBQXVCQTs7OztBQUlBLGlCQUFpQixTQUFqQixDQUEyQixZQUEzQixHQUEwQyxVQUFTLENBQVQsRUFBWSxRQUFaLEVBQXFCO0FBQzdELE1BQUksUUFBUSxFQUFFLFFBQUYsRUFBWjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFFBQUksSUFBSSxNQUFNLENBQU4sQ0FBUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUksRUFBRSxRQUFGLE1BQWdCLElBQXBCLEVBQ0E7QUFDRSxRQUFFLE9BQUYsQ0FBVSxTQUFTLGVBQVQsR0FBMkIsU0FBM0IsR0FBdUMsT0FBdkMsQ0FBK0MsSUFBL0MsQ0FBVjtBQUNBLGVBQVMsZUFBVCxHQUEyQixHQUEzQixDQUErQixTQUFTLGVBQVQsR0FBMkIsU0FBM0IsR0FBdUMsUUFBdkMsQ0FBZ0QsSUFBaEQsQ0FBL0IsRUFBc0YsRUFBRSxPQUFGLEVBQXRGO0FBQ0EsUUFBRSxPQUFGLEdBQVksUUFBWixDQUFxQixDQUFyQjtBQUNBLGVBQVMsR0FBVCxDQUFhLEVBQUUsT0FBRixFQUFiOztBQUVBOztBQUVBLFdBQUssWUFBTCxDQUFrQixFQUFFLFFBQUYsRUFBbEIsRUFBZ0MsRUFBRSxPQUFGLEdBQVksUUFBWixFQUFoQztBQUNELEtBVkQsTUFZQTtBQUNFO0FBQ0EsVUFBSSxDQUFDLEVBQUUsT0FBRixHQUFZLFdBQVosRUFBTCxFQUNBO0FBQ0UsaUJBQVMsR0FBVCxDQUFjLEVBQUUsT0FBRixFQUFkO0FBQ0EsVUFBRSxPQUFGLEdBQVksWUFBWixDQUF5QixJQUF6QjtBQUNEO0FBQ0Y7QUFDRDs7QUFFQTtBQUNBLE1BQUUsT0FBRixHQUFZLFdBQVosQ0FBd0IsRUFBRSxXQUFGLEdBQWdCLENBQXhDLEVBQTJDLEVBQUUsV0FBRixHQUFnQixDQUEzRDtBQUNBLE1BQUUsT0FBRixHQUFZLFNBQVosQ0FBc0IsRUFBRSxTQUFGLEVBQXRCO0FBQ0EsTUFBRSxPQUFGLEdBQVksUUFBWixDQUFxQixFQUFFLFFBQUYsRUFBckI7QUFDRDtBQUNGLENBbENEOztBQW9DQTs7Ozs7QUFLQSxpQkFBaUIsU0FBakIsQ0FBMkIsUUFBM0IsR0FBc0MsVUFBUyxLQUFULEVBQWdCLElBQWhCLEVBQXFCOztBQUV6RCxNQUFJLFdBQVcsTUFBTSxXQUFOLEVBQWY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUEwQztBQUN4QyxRQUFJLElBQUksU0FBUyxDQUFULENBQVI7O0FBRUE7QUFDQTtBQUNBLFFBQUssRUFBRSxZQUFGLElBQW1CLEVBQUUsU0FBRixHQUFjLFFBQWQsTUFBNEIsSUFBL0MsSUFBeUQsRUFBRSxTQUFGLEdBQWMsUUFBZCxNQUE0QixJQUExRixFQUNBO0FBQ0U7QUFDQSxVQUFLLENBQUUsRUFBRSxTQUFGLEdBQWMsT0FBZCxHQUF3QixnQkFBeEIsR0FBMkMsUUFBM0MsQ0FBcUQsRUFBRSxTQUFGLEVBQUQsQ0FBZ0IsT0FBaEIsRUFBcEQsQ0FBUCxFQUNBO0FBQ0UsYUFBSyxHQUFMLENBQVMsS0FBSyxTQUFMLEdBQWlCLE9BQWpCLENBQXlCLElBQXpCLENBQVQsRUFBeUMsRUFBRSxTQUFGLEdBQWMsT0FBZCxFQUF6QyxFQUFrRSxFQUFFLFNBQUYsR0FBYyxPQUFkLEVBQWxFO0FBQ0Q7QUFDRjtBQUNEO0FBQ0E7QUFUQSxTQVdBO0FBQ0UsWUFBSSxFQUFFLFNBQUYsR0FBYyxPQUFkLE1BQTJCLEVBQUUsU0FBRixHQUFjLE9BQWQsRUFBL0IsRUFDQTtBQUNFO0FBQ0EsY0FBSSxDQUFDLEVBQUUsU0FBRixHQUFjLE9BQWQsR0FBd0IsZ0JBQXhCLEdBQTJDLFFBQTNDLENBQW9ELEVBQUUsU0FBRixHQUFjLE9BQWQsRUFBcEQsQ0FBTCxFQUNBO0FBQ0UsaUJBQUssR0FBTCxDQUFTLEtBQUssU0FBTCxHQUFpQixPQUFqQixDQUF5QixJQUF6QixDQUFULEVBQXlDLEVBQUUsU0FBRixHQUFjLE9BQWQsRUFBekMsRUFBa0UsRUFBRSxTQUFGLEdBQWMsT0FBZCxFQUFsRTtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsQ0E5QkQ7O0FBZ0NBLE9BQU8sT0FBUCxHQUFpQixnQkFBakI7Ozs7O0FDM05BLElBQUksV0FBVyxRQUFRLFlBQVIsQ0FBZjtBQUNBLElBQUksbUJBQW1CLFFBQVEsb0JBQVIsQ0FBdkI7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmO0FBQ0EsSUFBSSxXQUFXLFFBQVEsWUFBUixDQUFmO0FBQ0EsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFwQjtBQUNBLElBQUksb0JBQW9CLFFBQVEscUJBQVIsQ0FBeEI7QUFDQSxJQUFJLGtCQUFrQixRQUFRLG1CQUFSLENBQXRCO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiO0FBQ0EsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkO0FBQ0EsSUFBSSxZQUFZLFFBQVEsYUFBUixDQUFoQjtBQUNBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBYjtBQUNBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7O0FBRUEsU0FBUyxVQUFULEdBQXNCO0FBQ3BCLFdBQVMsSUFBVCxDQUFjLElBQWQ7O0FBRUEsT0FBSyxTQUFMLEdBQWlCLEVBQWpCLENBSG9CLENBR0M7QUFDdEI7O0FBRUQsV0FBVyxTQUFYLEdBQXVCLE9BQU8sTUFBUCxDQUFjLFNBQVMsU0FBdkIsQ0FBdkI7O0FBRUEsS0FBSyxJQUFJLElBQVQsSUFBaUIsUUFBakIsRUFBMkI7QUFDekIsYUFBVyxJQUFYLElBQW1CLFNBQVMsSUFBVCxDQUFuQjtBQUNEOztBQUVELFdBQVcsU0FBWCxDQUFxQixlQUFyQixHQUF1QyxZQUFZO0FBQ2pELE1BQUksS0FBSyxJQUFJLGdCQUFKLENBQXFCLElBQXJCLENBQVQ7QUFDQSxPQUFLLFlBQUwsR0FBb0IsRUFBcEI7QUFDQSxTQUFPLEVBQVA7QUFDRCxDQUpEOztBQU1BLFdBQVcsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxVQUFVLE1BQVYsRUFBa0I7QUFDaEQsU0FBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBQW9CLEtBQUssWUFBekIsRUFBdUMsTUFBdkMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsV0FBVyxTQUFYLENBQXFCLE9BQXJCLEdBQStCLFVBQVUsS0FBVixFQUFpQjtBQUM5QyxTQUFPLElBQUksUUFBSixDQUFhLEtBQUssWUFBbEIsRUFBZ0MsS0FBaEMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsV0FBVyxTQUFYLENBQXFCLE9BQXJCLEdBQStCLFVBQVUsS0FBVixFQUFpQjtBQUM5QyxTQUFPLElBQUksUUFBSixDQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsS0FBekIsQ0FBUDtBQUNELENBRkQ7O0FBSUEsV0FBVyxTQUFYLENBQXFCLGNBQXJCLEdBQXNDLFlBQVk7QUFDaEQsV0FBUyxTQUFULENBQW1CLGNBQW5CLENBQWtDLElBQWxDLENBQXVDLElBQXZDLEVBQTZDLFNBQTdDO0FBQ0EsTUFBSSxDQUFDLEtBQUssV0FBVixFQUF1QjtBQUNyQixRQUFJLGNBQWMsbUJBQWQsR0FBb0MsRUFBeEMsRUFDQTtBQUNFLFdBQUssZUFBTCxHQUF1QixFQUF2QjtBQUNELEtBSEQsTUFLQTtBQUNFLFdBQUssZUFBTCxHQUF1QixjQUFjLG1CQUFyQztBQUNEOztBQUVELFNBQUssa0NBQUwsR0FDUSxjQUFjLCtDQUR0QjtBQUVBLFNBQUssb0JBQUwsR0FDUSxjQUFjLCtCQUR0QjtBQUVBLFNBQUssY0FBTCxHQUNRLGtCQUFrQix1QkFEMUI7QUFFQSxTQUFLLGlCQUFMLEdBQ1Esa0JBQWtCLDBCQUQxQjtBQUVBLFNBQUssZUFBTCxHQUNRLGtCQUFrQix3QkFEMUI7QUFFQSxTQUFLLHVCQUFMLEdBQ1Esa0JBQWtCLGlDQUQxQjtBQUVBLFNBQUssa0JBQUwsR0FDUSxrQkFBa0IsNEJBRDFCO0FBRUEsU0FBSywwQkFBTCxHQUNRLGtCQUFrQixxQ0FEMUI7QUFFRDtBQUNGLENBN0JEOztBQStCQSxXQUFXLFNBQVgsQ0FBcUIsTUFBckIsR0FBOEIsWUFBWTtBQUN4QyxNQUFJLHNCQUFzQixnQkFBZ0IsOEJBQTFDO0FBQ0EsTUFBSSxtQkFBSixFQUNBO0FBQ0UsU0FBSyxnQkFBTDtBQUNBLFNBQUssWUFBTCxDQUFrQixhQUFsQjtBQUNEO0FBQ0QsTUFBRyxLQUFLLG9CQUFMLElBQTZCLENBQUMsS0FBSyxXQUF0QyxFQUNBO0FBQ0UsWUFBUSxHQUFSLENBQVksa0JBQVo7QUFDQSxXQUFPLEtBQUssdUJBQUwsRUFBUDtBQUNELEdBSkQsTUFLSztBQUNILFNBQUssS0FBTCxHQUFhLENBQWI7QUFDQSxXQUFPLEtBQUssYUFBTCxFQUFQO0FBQ0Q7QUFDRixDQWhCRDs7QUFrQkEsV0FBVyxTQUFYLENBQXFCLHVCQUFyQixHQUErQyxZQUFZO0FBQ3pELE1BQUksS0FBSyxLQUFLLFlBQWQ7O0FBRUE7O0FBRUE7QUFDQSxPQUFLLEtBQUwsR0FBYSxHQUFHLFlBQUgsRUFBYjs7QUFFQSxPQUFLLFVBQUwsR0FBa0IsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFrQixDQUFwQztBQUNBLE9BQUssS0FBTCxHQUFhLEtBQUssVUFBbEI7O0FBRUEsU0FBTyxLQUFLLEtBQUwsSUFBYyxDQUFyQixFQUNBO0FBQ0UsU0FBSyxZQUFMLEdBQW9CLEtBQUssS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFoQixDQUF6Qjs7QUFFQSxZQUFRLEdBQVIsQ0FBWSxNQUFNLEtBQUssS0FBWCxHQUFtQixpQkFBbkIsR0FBdUMsR0FBRyxXQUFILEdBQWlCLE1BQXhELEdBQWlFLFVBQTdFO0FBQ0EsU0FBSyxhQUFMO0FBQ0EsWUFBUSxHQUFSLENBQVksbUNBQVo7QUFDQTtBQUNBLFNBQUssV0FBTCxHQUFtQixJQUFuQjs7QUFFQSxRQUFJLEtBQUssS0FBTCxJQUFjLENBQWxCLEVBQ0E7QUFDRSxXQUFLLFNBQUwsR0FERixDQUNvQjtBQUNuQjs7QUFFRDtBQUNBLFNBQUssZUFBTCxHQUF1QixDQUF2Qjs7QUFFQSxTQUFLLEtBQUw7QUFDRDs7QUFFRCxPQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFPLElBQVA7QUFDRCxDQWxDRDs7QUFvQ0EsV0FBVyxTQUFYLENBQXFCLGFBQXJCLEdBQXFDLFlBQVk7QUFDL0MsT0FBSyxnQkFBTCxHQUF3QixLQUFLLGtDQUFMLEVBQXhCO0FBQ0EsT0FBSyxZQUFMLENBQWtCLDZCQUFsQixDQUFnRCxLQUFLLGdCQUFyRDtBQUNBLE9BQUssMkJBQUw7QUFDQSxPQUFLLFlBQUwsQ0FBa0IseUJBQWxCO0FBQ0EsT0FBSyxZQUFMLENBQWtCLHVCQUFsQjtBQUNBLE9BQUssWUFBTCxDQUFrQixPQUFsQixHQUE0QixpQkFBNUI7QUFDQSxPQUFLLG9CQUFMOztBQUVBLE1BQUksQ0FBQyxLQUFLLFdBQVYsRUFDQTtBQUNFLFFBQUksU0FBUyxLQUFLLGFBQUwsRUFBYjs7QUFFQTtBQUNBLFFBQUksT0FBTyxNQUFQLEdBQWdCLENBQXBCLEVBQ0E7QUFDRSxXQUFLLHFCQUFMLENBQTJCLE1BQTNCO0FBQ0Q7QUFDRDtBQUpBLFNBTUE7QUFDRTtBQUNOO0FBQ007QUFDQSxhQUFLLFlBQUwsQ0FBa0IsK0JBQWxCO0FBQ0EsWUFBSSxXQUFXLElBQUksR0FBSixDQUFRLEtBQUssV0FBTCxFQUFSLENBQWY7QUFDQSxZQUFJLGVBQWUsS0FBSyxnQkFBTCxDQUFzQixNQUF0QixDQUE2QjtBQUFBLGlCQUFLLFNBQVMsR0FBVCxDQUFhLENBQWIsQ0FBTDtBQUFBLFNBQTdCLENBQW5CO0FBQ0EsYUFBSyxZQUFMLENBQWtCLDZCQUFsQixDQUFnRCxZQUFoRDs7QUFFQSxhQUFLLHFCQUFMO0FBQ0Q7QUFDRjs7QUFFRCxPQUFLLGtCQUFMO0FBQ0EsT0FBSyxpQkFBTDs7QUFFQSxTQUFPLElBQVA7QUFDRCxDQXJDRDs7QUF1Q0EsSUFBSSxXQUFKO0FBQ0EsSUFBSSxXQUFKOztBQUVBLFdBQVcsU0FBWCxDQUFxQixJQUFyQixHQUE0QixZQUFXO0FBQ3JDLE9BQUssZUFBTDs7QUFFQSxNQUFJLEtBQUssZUFBTCxLQUF5QixLQUFLLGFBQTlCLElBQStDLENBQUMsS0FBSyxhQUFyRCxJQUFzRSxDQUFDLEtBQUssZ0JBQWhGLEVBQWtHO0FBQ2hHLFFBQUcsS0FBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTZCLENBQWhDLEVBQWtDO0FBQ2hDLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUNELEtBRkQsTUFHSztBQUNILGFBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQsTUFBSSxLQUFLLGVBQUwsR0FBdUIsa0JBQWtCLHdCQUF6QyxJQUFxRSxDQUFyRSxJQUEyRSxDQUFDLEtBQUssYUFBakYsSUFBa0csQ0FBQyxLQUFLLGdCQUE1RyxFQUNBO0FBQ0UsUUFBSSxLQUFLLFdBQUwsRUFBSixFQUNBO0FBQ0UsVUFBRyxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBaEMsRUFBa0M7QUFDaEMsYUFBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0QsT0FGRCxNQUdLO0FBQ0gsZUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFLLGFBQUwsR0FBcUIsS0FBSyxvQkFBTCxJQUNaLENBQUMsS0FBSyxhQUFMLEdBQXFCLEtBQUssZUFBM0IsSUFBOEMsS0FBSyxhQUR2QyxDQUFyQjtBQUVBLFNBQUssZUFBTCxHQUF1QixLQUFLLElBQUwsQ0FBVSxLQUFLLHNCQUFMLEdBQThCLEtBQUssSUFBTCxDQUFVLEtBQUssYUFBZixDQUF4QyxDQUF2QjtBQUNEO0FBQ0Q7QUFDQSxNQUFHLEtBQUssYUFBUixFQUFzQjtBQUNwQixRQUFHLEtBQUssa0JBQUwsR0FBMEIsRUFBMUIsSUFBZ0MsQ0FBbkMsRUFBcUM7QUFDbkMsVUFBRyxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsR0FBNkIsQ0FBaEMsRUFBbUM7QUFDakMsYUFBSyxZQUFMLENBQWtCLFlBQWxCO0FBQ0EsYUFBSyxVQUFMO0FBQ0EsYUFBSyxRQUFMLENBQWMsS0FBSyxjQUFuQjtBQUNBO0FBQ0EsYUFBSyxZQUFMLENBQWtCLCtCQUFsQjtBQUNBLFlBQUksV0FBVyxJQUFJLEdBQUosQ0FBUSxLQUFLLFdBQUwsRUFBUixDQUFmO0FBQ0EsWUFBSSxlQUFlLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsQ0FBNkI7QUFBQSxpQkFBSyxTQUFTLEdBQVQsQ0FBYSxDQUFiLENBQUw7QUFBQSxTQUE3QixDQUFuQjtBQUNBLGFBQUssWUFBTCxDQUFrQiw2QkFBbEIsQ0FBZ0QsWUFBaEQ7O0FBRUEsYUFBSyxZQUFMLENBQWtCLFlBQWxCO0FBQ0EsYUFBSyxVQUFMO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGtCQUFrQixrQ0FBdkM7QUFDRCxPQWJELE1BY0s7QUFDSCxhQUFLLGFBQUwsR0FBcUIsS0FBckI7QUFDQSxhQUFLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0Q7QUFDRjtBQUNELFNBQUssa0JBQUw7QUFDRDtBQUNEO0FBQ0EsTUFBRyxLQUFLLGdCQUFSLEVBQXlCO0FBQ3ZCLFFBQUksS0FBSyxXQUFMLEVBQUosRUFDQTtBQUNFLGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBRyxLQUFLLHFCQUFMLEdBQTZCLEVBQTdCLElBQW1DLENBQXRDLEVBQXdDO0FBQ3RDLFdBQUssWUFBTCxDQUFrQixZQUFsQjtBQUNBLFdBQUssVUFBTDtBQUNEO0FBQ0QsU0FBSyxhQUFMLEdBQXFCLGtCQUFrQixrQ0FBbEIsSUFBd0QsQ0FBQyxNQUFNLEtBQUsscUJBQVosSUFBcUMsR0FBN0YsQ0FBckI7QUFDQSxTQUFLLHFCQUFMO0FBQ0Q7O0FBRUQsT0FBSyxpQkFBTCxHQUF5QixDQUF6QjtBQUNBLE9BQUssWUFBTCxDQUFrQixZQUFsQjtBQUNBLGdCQUFjLEtBQUssZ0JBQUwsRUFBZDtBQUNBLE9BQUssbUJBQUw7QUFDQSxPQUFLLHVCQUFMO0FBQ0EsZ0JBQWMsS0FBSyxTQUFMLEVBQWQ7QUFDQSxPQUFLLE9BQUw7O0FBRUEsU0FBTyxLQUFQLENBMUVxQyxDQTBFdkI7QUFDZixDQTNFRDs7QUE2RUEsV0FBVyxTQUFYLENBQXFCLGdCQUFyQixHQUF3QyxZQUFXO0FBQ2pELE1BQUksV0FBVyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsRUFBZjtBQUNBLE1BQUksUUFBUSxFQUFaO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsUUFBSSxPQUFPLFNBQVMsQ0FBVCxFQUFZLElBQXZCO0FBQ0EsUUFBSSxLQUFLLFNBQVMsQ0FBVCxFQUFZLEVBQXJCO0FBQ0EsVUFBTSxFQUFOLElBQVk7QUFDVixVQUFJLEVBRE07QUFFVixTQUFHLEtBQUssVUFBTCxFQUZPO0FBR1YsU0FBRyxLQUFLLFVBQUwsRUFITztBQUlWLFNBQUcsS0FBSyxLQUpFO0FBS1YsU0FBRyxLQUFLLE1BTEU7QUFNVixvQkFBYyxZQUFZLENBQVosRUFBZSxZQU5uQjtBQU9WLG9CQUFjLFlBQVksQ0FBWixFQUFlLFlBUG5CO0FBUVYsdUJBQWlCLFlBQVksQ0FBWixFQUFlLGVBUnRCO0FBU1YsdUJBQWlCLFlBQVksQ0FBWixFQUFlLGVBVHRCO0FBVVYseUJBQW1CLFlBQVksQ0FBWixFQUFlLGlCQVZ4QjtBQVdWLHlCQUFtQixZQUFZLENBQVosRUFBZSxpQkFYeEI7QUFZVixxQkFBZSxZQUFZLENBQVosRUFBZSxhQVpwQjtBQWFWLHFCQUFlLFlBQVksQ0FBWixFQUFlO0FBYnBCLEtBQVo7QUFlRDtBQUNELFNBQU8sS0FBUDtBQUNELENBdkJEOztBQXlCQSxXQUFXLFNBQVgsQ0FBcUIsWUFBckIsR0FBb0MsWUFBVztBQUM3QyxNQUFJLFdBQVcsS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQWY7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLFFBQUksS0FBSyxTQUFTLENBQVQsRUFBWSxFQUFyQjtBQUNBLFVBQU0sRUFBTixJQUFZO0FBQ1YsVUFBSSxFQURNO0FBRVYsY0FBUyxZQUFZLENBQVosS0FBa0IsSUFBbkIsR0FBMkIsWUFBWSxDQUFaLEVBQWUsTUFBMUMsR0FBbUQsRUFGakQ7QUFHVixjQUFTLFlBQVksQ0FBWixLQUFrQixJQUFuQixHQUEyQixZQUFZLENBQVosRUFBZSxNQUExQyxHQUFtRCxFQUhqRDtBQUlWLGNBQVMsWUFBWSxDQUFaLEtBQWtCLElBQW5CLEdBQTJCLFlBQVksQ0FBWixFQUFlLE1BQTFDLEdBQW1ELEVBSmpEO0FBS1YsZUFBVSxZQUFZLENBQVosS0FBa0IsSUFBbkIsR0FBMkIsWUFBWSxDQUFaLEVBQWUsT0FBMUMsR0FBb0QsRUFMbkQ7QUFNVixlQUFVLFlBQVksQ0FBWixLQUFrQixJQUFuQixHQUEyQixZQUFZLENBQVosRUFBZSxPQUExQyxHQUFvRDtBQU5uRCxLQUFaO0FBUUQ7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQWZEOztBQWlCQSxXQUFXLFNBQVgsQ0FBcUIsaUJBQXJCLEdBQXlDLFlBQVk7QUFDbkQsT0FBSyxzQkFBTCxHQUE4QixFQUE5QjtBQUNBLE9BQUssZUFBTCxHQUF1QixLQUFLLHNCQUE1QjtBQUNBLE1BQUksY0FBYyxLQUFsQjs7QUFFQTtBQUNBLE1BQUssa0JBQWtCLE9BQWxCLEtBQThCLFFBQW5DLEVBQThDO0FBQzVDLFNBQUssSUFBTCxDQUFVLGVBQVY7QUFDRCxHQUZELE1BR0s7QUFDSDtBQUNBLFdBQU8sQ0FBQyxXQUFSLEVBQXFCO0FBQ25CLG9CQUFjLEtBQUssSUFBTCxFQUFkO0FBQ0Q7O0FBRUQsU0FBSyxZQUFMLENBQWtCLFlBQWxCO0FBQ0Q7QUFDRixDQWpCRDs7QUFtQkEsV0FBVyxTQUFYLENBQXFCLGtDQUFyQixHQUEwRCxZQUFZO0FBQ3BFLE1BQUksV0FBVyxFQUFmO0FBQ0EsTUFBSSxLQUFKOztBQUVBLE1BQUksU0FBUyxLQUFLLFlBQUwsQ0FBa0IsU0FBbEIsRUFBYjtBQUNBLE1BQUksT0FBTyxPQUFPLE1BQWxCO0FBQ0EsTUFBSSxDQUFKO0FBQ0EsT0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLElBQWhCLEVBQXNCLEdBQXRCLEVBQ0E7QUFDRSxZQUFRLE9BQU8sQ0FBUCxDQUFSOztBQUVBLFVBQU0sZUFBTjs7QUFFQSxRQUFJLENBQUMsTUFBTSxXQUFYLEVBQ0E7QUFDRSxpQkFBVyxTQUFTLE1BQVQsQ0FBZ0IsTUFBTSxRQUFOLEVBQWhCLENBQVg7QUFDRDtBQUNGOztBQUVELFNBQU8sUUFBUDtBQUNELENBcEJEOztBQXNCQSxXQUFXLFNBQVgsQ0FBcUIsMkJBQXJCLEdBQW1ELFlBQ25EO0FBQ0UsTUFBSSxJQUFKO0FBQ0EsTUFBSSxXQUFXLEtBQUssWUFBTCxDQUFrQixXQUFsQixFQUFmOztBQUVBLE9BQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLFNBQVMsTUFBNUIsRUFBb0MsR0FBcEMsRUFDQTtBQUNJLFdBQU8sU0FBUyxDQUFULENBQVA7QUFDQSxTQUFLLFlBQUwsR0FBb0IsS0FBSyxlQUFMLEVBQXBCO0FBQ0g7QUFDRixDQVZEOztBQVlBLFdBQVcsU0FBWCxDQUFxQixnQkFBckIsR0FBd0MsWUFBWTtBQUNsRCxNQUFJLFFBQVEsRUFBWjtBQUNBLFVBQVEsTUFBTSxNQUFOLENBQWEsS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQWIsQ0FBUjtBQUNBLE1BQUksVUFBVSxJQUFJLE9BQUosRUFBZDtBQUNBLE1BQUksQ0FBSjtBQUNBLE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxNQUFNLE1BQXRCLEVBQThCLEdBQTlCLEVBQ0E7QUFDRSxRQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7O0FBRUEsUUFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixJQUFqQixDQUFMLEVBQ0E7QUFDRSxVQUFJLFNBQVMsS0FBSyxTQUFMLEVBQWI7QUFDQSxVQUFJLFNBQVMsS0FBSyxTQUFMLEVBQWI7O0FBRUEsVUFBSSxVQUFVLE1BQWQsRUFDQTtBQUNFLGFBQUssYUFBTCxHQUFxQixJQUFyQixDQUEwQixJQUFJLE1BQUosRUFBMUI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FBMEIsSUFBSSxNQUFKLEVBQTFCO0FBQ0EsYUFBSyw2QkFBTCxDQUFtQyxJQUFuQztBQUNBLGdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0QsT0FORCxNQVFBO0FBQ0UsWUFBSSxXQUFXLEVBQWY7O0FBRUEsbUJBQVcsU0FBUyxNQUFULENBQWdCLE9BQU8saUJBQVAsQ0FBeUIsTUFBekIsQ0FBaEIsQ0FBWDtBQUNBLG1CQUFXLFNBQVMsTUFBVCxDQUFnQixPQUFPLGlCQUFQLENBQXlCLE1BQXpCLENBQWhCLENBQVg7O0FBRUEsWUFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixTQUFTLENBQVQsQ0FBakIsQ0FBTCxFQUNBO0FBQ0UsY0FBSSxTQUFTLE1BQVQsR0FBa0IsQ0FBdEIsRUFDQTtBQUNFLGdCQUFJLENBQUo7QUFDQSxpQkFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLFNBQVMsTUFBekIsRUFBaUMsR0FBakMsRUFDQTtBQUNFLGtCQUFJLFlBQVksU0FBUyxDQUFULENBQWhCO0FBQ0Esd0JBQVUsYUFBVixHQUEwQixJQUExQixDQUErQixJQUFJLE1BQUosRUFBL0I7QUFDQSxtQkFBSyw2QkFBTCxDQUFtQyxTQUFuQztBQUNEO0FBQ0Y7QUFDRCxrQkFBUSxNQUFSLENBQWUsSUFBZjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxRQUFJLFFBQVEsSUFBUixNQUFrQixNQUFNLE1BQTVCLEVBQ0E7QUFDRTtBQUNEO0FBQ0Y7QUFDRixDQWxERDs7QUFvREEsV0FBVyxTQUFYLENBQXFCLHFCQUFyQixHQUE2QyxVQUFVLE1BQVYsRUFBa0I7QUFDN0Q7QUFDQSxNQUFJLHVCQUF1QixJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUEzQjtBQUNBLE1BQUksa0JBQWtCLEtBQUssSUFBTCxDQUFVLEtBQUssSUFBTCxDQUFVLE9BQU8sTUFBakIsQ0FBVixDQUF0QjtBQUNBLE1BQUksU0FBUyxDQUFiO0FBQ0EsTUFBSSxXQUFXLENBQWY7QUFDQSxNQUFJLFdBQVcsQ0FBZjtBQUNBLE1BQUksUUFBUSxJQUFJLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFaOztBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQ0E7QUFDRSxRQUFJLElBQUksZUFBSixJQUF1QixDQUEzQixFQUNBO0FBQ0U7QUFDQTtBQUNBLGlCQUFXLENBQVg7QUFDQSxpQkFBVyxNQUFYOztBQUVBLFVBQUksS0FBSyxDQUFULEVBQ0E7QUFDRSxvQkFBWSxjQUFjLDRCQUExQjtBQUNEOztBQUVELGVBQVMsQ0FBVDtBQUNEOztBQUVELFFBQUksT0FBTyxPQUFPLENBQVAsQ0FBWDs7QUFFQTtBQUNBLFFBQUksYUFBYSxPQUFPLGdCQUFQLENBQXdCLElBQXhCLENBQWpCOztBQUVBO0FBQ0EseUJBQXFCLENBQXJCLEdBQXlCLFFBQXpCO0FBQ0EseUJBQXFCLENBQXJCLEdBQXlCLFFBQXpCOztBQUVBO0FBQ0EsWUFDUSxXQUFXLFlBQVgsQ0FBd0IsSUFBeEIsRUFBOEIsVUFBOUIsRUFBMEMsb0JBQTFDLENBRFI7O0FBR0EsUUFBSSxNQUFNLENBQU4sR0FBVSxNQUFkLEVBQ0E7QUFDRSxlQUFTLEtBQUssS0FBTCxDQUFXLE1BQU0sQ0FBakIsQ0FBVDtBQUNEOztBQUVELGVBQVcsS0FBSyxLQUFMLENBQVcsTUFBTSxDQUFOLEdBQVUsY0FBYyw0QkFBbkMsQ0FBWDtBQUNEOztBQUVELE9BQUssU0FBTCxDQUNRLElBQUksTUFBSixDQUFXLGdCQUFnQixjQUFoQixHQUFpQyxNQUFNLENBQU4sR0FBVSxDQUF0RCxFQUNRLGdCQUFnQixjQUFoQixHQUFpQyxNQUFNLENBQU4sR0FBVSxDQURuRCxDQURSO0FBR0QsQ0FsREQ7O0FBb0RBLFdBQVcsWUFBWCxHQUEwQixVQUFVLElBQVYsRUFBZ0IsVUFBaEIsRUFBNEIsYUFBNUIsRUFBMkM7QUFDbkUsTUFBSSxZQUFZLEtBQUssR0FBTCxDQUFTLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBVCxFQUNSLGNBQWMseUJBRE4sQ0FBaEI7QUFFQSxhQUFXLGtCQUFYLENBQThCLFVBQTlCLEVBQTBDLElBQTFDLEVBQWdELENBQWhELEVBQW1ELEdBQW5ELEVBQXdELENBQXhELEVBQTJELFNBQTNEO0FBQ0EsTUFBSSxTQUFTLE9BQU8sZUFBUCxDQUF1QixJQUF2QixDQUFiOztBQUVBLE1BQUksWUFBWSxJQUFJLFNBQUosRUFBaEI7QUFDQSxZQUFVLGFBQVYsQ0FBd0IsT0FBTyxPQUFQLEVBQXhCO0FBQ0EsWUFBVSxhQUFWLENBQXdCLE9BQU8sT0FBUCxFQUF4QjtBQUNBLFlBQVUsWUFBVixDQUF1QixjQUFjLENBQXJDO0FBQ0EsWUFBVSxZQUFWLENBQXVCLGNBQWMsQ0FBckM7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFDQTtBQUNFLFFBQUksT0FBTyxLQUFLLENBQUwsQ0FBWDtBQUNBLFNBQUssU0FBTCxDQUFlLFNBQWY7QUFDRDs7QUFFRCxNQUFJLGNBQ0ksSUFBSSxNQUFKLENBQVcsT0FBTyxPQUFQLEVBQVgsRUFBNkIsT0FBTyxPQUFQLEVBQTdCLENBRFI7O0FBR0EsU0FBTyxVQUFVLHFCQUFWLENBQWdDLFdBQWhDLENBQVA7QUFDRCxDQXRCRDs7QUF3QkEsV0FBVyxrQkFBWCxHQUFnQyxVQUFVLElBQVYsRUFBZ0IsWUFBaEIsRUFBOEIsVUFBOUIsRUFBMEMsUUFBMUMsRUFBb0QsUUFBcEQsRUFBOEQsZ0JBQTlELEVBQWdGO0FBQzlHO0FBQ0EsTUFBSSxlQUFlLENBQUUsV0FBVyxVQUFaLEdBQTBCLENBQTNCLElBQWdDLENBQW5EOztBQUVBLE1BQUksZUFBZSxDQUFuQixFQUNBO0FBQ0Usb0JBQWdCLEdBQWhCO0FBQ0Q7O0FBRUQsTUFBSSxZQUFZLENBQUMsZUFBZSxVQUFoQixJQUE4QixHQUE5QztBQUNBLE1BQUksT0FBUSxZQUFZLFVBQVUsTUFBdkIsR0FBaUMsR0FBNUM7O0FBRUE7QUFDQSxNQUFJLFdBQVcsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFmO0FBQ0EsTUFBSSxLQUFLLFdBQVcsS0FBSyxHQUFMLENBQVMsSUFBVCxDQUFwQjtBQUNBLE1BQUksS0FBSyxXQUFXLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBcEI7O0FBRUEsT0FBSyxTQUFMLENBQWUsRUFBZixFQUFtQixFQUFuQjs7QUFFQTtBQUNBO0FBQ0EsTUFBSSxnQkFBZ0IsRUFBcEI7QUFDQSxrQkFBZ0IsY0FBYyxNQUFkLENBQXFCLEtBQUssUUFBTCxFQUFyQixDQUFoQjtBQUNBLE1BQUksYUFBYSxjQUFjLE1BQS9COztBQUVBLE1BQUksZ0JBQWdCLElBQXBCLEVBQ0E7QUFDRTtBQUNEOztBQUVELE1BQUksY0FBYyxDQUFsQjs7QUFFQSxNQUFJLGdCQUFnQixjQUFjLE1BQWxDO0FBQ0EsTUFBSSxVQUFKOztBQUVBLE1BQUksUUFBUSxLQUFLLGVBQUwsQ0FBcUIsWUFBckIsQ0FBWjs7QUFFQTtBQUNBO0FBQ0EsU0FBTyxNQUFNLE1BQU4sR0FBZSxDQUF0QixFQUNBO0FBQ0U7QUFDQSxRQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFDQSxVQUFNLE1BQU4sQ0FBYSxDQUFiLEVBQWdCLENBQWhCO0FBQ0EsUUFBSSxRQUFRLGNBQWMsT0FBZCxDQUFzQixJQUF0QixDQUFaO0FBQ0EsUUFBSSxTQUFTLENBQWIsRUFBZ0I7QUFDZCxvQkFBYyxNQUFkLENBQXFCLEtBQXJCLEVBQTRCLENBQTVCO0FBQ0Q7QUFDRDtBQUNBO0FBQ0Q7O0FBRUQsTUFBSSxnQkFBZ0IsSUFBcEIsRUFDQTtBQUNFO0FBQ0EsaUJBQWEsQ0FBQyxjQUFjLE9BQWQsQ0FBc0IsTUFBTSxDQUFOLENBQXRCLElBQWtDLENBQW5DLElBQXdDLGFBQXJEO0FBQ0QsR0FKRCxNQU1BO0FBQ0UsaUJBQWEsQ0FBYjtBQUNEOztBQUVELE1BQUksWUFBWSxLQUFLLEdBQUwsQ0FBUyxXQUFXLFVBQXBCLElBQWtDLFVBQWxEOztBQUVBLE9BQUssSUFBSSxJQUFJLFVBQWIsRUFDUSxlQUFlLFVBRHZCLEVBRVEsSUFBSyxFQUFFLENBQUgsR0FBUSxhQUZwQixFQUdBO0FBQ0UsUUFBSSxrQkFDSSxjQUFjLENBQWQsRUFBaUIsV0FBakIsQ0FBNkIsSUFBN0IsQ0FEUjs7QUFHQTtBQUNBLFFBQUksbUJBQW1CLFlBQXZCLEVBQ0E7QUFDRTtBQUNEOztBQUVELFFBQUksa0JBQ0ksQ0FBQyxhQUFhLGNBQWMsU0FBNUIsSUFBeUMsR0FEakQ7QUFFQSxRQUFJLGdCQUFnQixDQUFDLGtCQUFrQixTQUFuQixJQUFnQyxHQUFwRDs7QUFFQSxlQUFXLGtCQUFYLENBQThCLGVBQTlCLEVBQ1EsSUFEUixFQUVRLGVBRlIsRUFFeUIsYUFGekIsRUFHUSxXQUFXLGdCQUhuQixFQUdxQyxnQkFIckM7O0FBS0E7QUFDRDtBQUNGLENBeEZEOztBQTBGQSxXQUFXLGlCQUFYLEdBQStCLFVBQVUsSUFBVixFQUFnQjtBQUM3QyxNQUFJLGNBQWMsUUFBUSxTQUExQjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUNBO0FBQ0UsUUFBSSxPQUFPLEtBQUssQ0FBTCxDQUFYO0FBQ0EsUUFBSSxXQUFXLEtBQUssV0FBTCxFQUFmOztBQUVBLFFBQUksV0FBVyxXQUFmLEVBQ0E7QUFDRSxvQkFBYyxRQUFkO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLFdBQVA7QUFDRCxDQWZEOztBQWlCQSxXQUFXLFNBQVgsQ0FBcUIsa0JBQXJCLEdBQTBDLFlBQVk7QUFDcEQ7QUFDQSxTQUFRLEtBQUssS0FBSyxLQUFMLEdBQWEsQ0FBbEIsSUFBdUIsS0FBSyxlQUFwQztBQUNELENBSEQ7O0FBS0E7O0FBRUE7OztBQUdBLFdBQVcsU0FBWCxDQUFxQixTQUFyQixHQUFpQyxZQUNqQztBQUNFLE1BQUksV0FBVyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsRUFBZjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUNBO0FBQ0UsUUFBSSxJQUFJLFNBQVMsQ0FBVCxDQUFSO0FBQ0E7QUFDQSxNQUFFLFFBQUYsR0FBYSxTQUFiLENBQXVCLEVBQUUsVUFBRixFQUF2QixFQUF1QyxFQUFFLFVBQUYsRUFBdkM7O0FBRUEsUUFBSSxFQUFFLFFBQUYsTUFBZ0IsSUFBcEIsRUFDQTtBQUNFO0FBQ0E7Ozs7O0FBS0EsVUFBSSxXQUFXLENBQUMsS0FBSyxHQUFMLENBQVMsRUFBRSxRQUFGLEdBQWEsUUFBYixFQUFULEVBQWtDLEVBQUUsUUFBRixHQUFhLFNBQWIsRUFBbEMsSUFBOEQsS0FBSyxHQUFMLENBQVMsRUFBRSxRQUFGLEdBQWEsUUFBYixFQUFULEVBQWtDLEVBQUUsUUFBRixHQUFhLFNBQWIsRUFBbEMsQ0FBL0QsSUFBOEgsQ0FBOUgsR0FBa0ksQ0FBako7QUFDQSxjQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0EsVUFBSSxPQUFPLEtBQUssTUFBTCxLQUFnQixDQUFoQixHQUFvQixRQUFwQixHQUErQixRQUExQztBQUNBLGNBQVEsR0FBUixDQUFZLElBQVo7QUFDQSxVQUFJLE9BQU8sS0FBSyxNQUFMLEtBQWdCLEdBQWhCLEdBQXVCLEtBQUssSUFBTCxDQUFVLFdBQVcsUUFBWCxHQUFzQixPQUFPLElBQXZDLENBQXZCLEdBQXdFLENBQUMsQ0FBRCxHQUFLLEtBQUssSUFBTCxDQUFVLFdBQVcsUUFBWCxHQUFzQixPQUFPLElBQXZDLENBQXhGO0FBQ0EsY0FBUSxHQUFSLENBQVksSUFBWjs7QUFFQSxRQUFFLFFBQUYsR0FBYSxTQUFiLENBQXVCLEVBQUUsUUFBRixHQUFhLFVBQWIsR0FBMEIsSUFBakQsRUFBdUQsRUFBRSxRQUFGLEdBQWEsVUFBYixHQUEwQixJQUFqRjs7QUFFTjtBQUNBO0FBQ0s7QUFDRjtBQUNGLENBL0JEOztBQWlDQTs7QUFFQTtBQUNBLFdBQVcsU0FBWCxDQUFxQixzQkFBckIsR0FBOEMsWUFBWTtBQUN4RCxNQUFJLE9BQU8sSUFBWDtBQUNBO0FBQ0EsTUFBSSxtQkFBbUIsRUFBdkIsQ0FId0QsQ0FHN0I7QUFDM0IsT0FBSyxZQUFMLEdBQW9CLEVBQXBCLENBSndELENBSWhDO0FBQ3hCLE9BQUssYUFBTCxHQUFxQixFQUFyQixDQUx3RCxDQUsvQjs7QUFFekIsTUFBSSxhQUFhLEVBQWpCLENBUHdELENBT25DO0FBQ3JCLE1BQUksV0FBVyxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsRUFBZjs7QUFFQTtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLFFBQUksT0FBTyxTQUFTLENBQVQsQ0FBWDtBQUNBLFFBQUksU0FBUyxLQUFLLFNBQUwsRUFBYjtBQUNBO0FBQ0EsUUFBSSxLQUFLLHlCQUFMLENBQStCLElBQS9CLE1BQXlDLENBQXpDLEtBQWdELE9BQU8sRUFBUCxJQUFhLFNBQWIsSUFBMEIsQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBM0UsQ0FBSixFQUE2RztBQUMzRyxpQkFBVyxJQUFYLENBQWdCLElBQWhCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxXQUFXLE1BQS9CLEVBQXVDLEdBQXZDLEVBQ0E7QUFDRSxRQUFJLE9BQU8sV0FBVyxDQUFYLENBQVgsQ0FERixDQUM0QjtBQUMxQixRQUFJLE9BQU8sS0FBSyxTQUFMLEdBQWlCLEVBQTVCLENBRkYsQ0FFa0M7O0FBRWhDLFFBQUksT0FBTyxpQkFBaUIsSUFBakIsQ0FBUCxLQUFrQyxXQUF0QyxFQUNFLGlCQUFpQixJQUFqQixJQUF5QixFQUF6Qjs7QUFFRixxQkFBaUIsSUFBakIsSUFBeUIsaUJBQWlCLElBQWpCLEVBQXVCLE1BQXZCLENBQThCLElBQTlCLENBQXpCLENBUEYsQ0FPZ0U7QUFDL0Q7O0FBRUQ7QUFDQSxTQUFPLElBQVAsQ0FBWSxnQkFBWixFQUE4QixPQUE5QixDQUFzQyxVQUFTLElBQVQsRUFBZTtBQUNuRCxRQUFJLGlCQUFpQixJQUFqQixFQUF1QixNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxVQUFJLGtCQUFrQixtQkFBbUIsSUFBekMsQ0FEcUMsQ0FDVTtBQUMvQyxXQUFLLFlBQUwsQ0FBa0IsZUFBbEIsSUFBcUMsaUJBQWlCLElBQWpCLENBQXJDLENBRnFDLENBRXdCOztBQUU3RCxVQUFJLFNBQVMsaUJBQWlCLElBQWpCLEVBQXVCLENBQXZCLEVBQTBCLFNBQTFCLEVBQWIsQ0FKcUMsQ0FJZTs7QUFFcEQ7QUFDQSxVQUFJLGdCQUFnQixJQUFJLFFBQUosQ0FBYSxLQUFLLFlBQWxCLENBQXBCO0FBQ0Esb0JBQWMsRUFBZCxHQUFtQixlQUFuQjtBQUNBLG9CQUFjLFdBQWQsR0FBNEIsT0FBTyxXQUFQLElBQXNCLENBQWxEO0FBQ0Esb0JBQWMsWUFBZCxHQUE2QixPQUFPLFlBQVAsSUFBdUIsQ0FBcEQ7QUFDQSxvQkFBYyxhQUFkLEdBQThCLE9BQU8sYUFBUCxJQUF3QixDQUF0RDtBQUNBLG9CQUFjLFVBQWQsR0FBMkIsT0FBTyxVQUFQLElBQXFCLENBQWhEOztBQUVBLFdBQUssYUFBTCxDQUFtQixlQUFuQixJQUFzQyxhQUF0Qzs7QUFFQSxVQUFJLG1CQUFtQixLQUFLLGVBQUwsR0FBdUIsR0FBdkIsQ0FBMkIsS0FBSyxRQUFMLEVBQTNCLEVBQTRDLGFBQTVDLENBQXZCO0FBQ0EsVUFBSSxjQUFjLE9BQU8sUUFBUCxFQUFsQjs7QUFFQTtBQUNBLGtCQUFZLEdBQVosQ0FBZ0IsYUFBaEI7O0FBRUE7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksaUJBQWlCLElBQWpCLEVBQXVCLE1BQTNDLEVBQW1ELEdBQW5ELEVBQXdEO0FBQ3RELFlBQUksT0FBTyxpQkFBaUIsSUFBakIsRUFBdUIsQ0FBdkIsQ0FBWDs7QUFFQSxvQkFBWSxNQUFaLENBQW1CLElBQW5CO0FBQ0EseUJBQWlCLEdBQWpCLENBQXFCLElBQXJCO0FBQ0Q7QUFDRjtBQUNGLEdBL0JEO0FBZ0NELENBakVEOztBQW1FQSxXQUFXLFNBQVgsQ0FBcUIsY0FBckIsR0FBc0MsWUFBWTtBQUNoRCxNQUFJLGdCQUFnQixFQUFwQjtBQUNBLE1BQUksV0FBVyxFQUFmOztBQUVBO0FBQ0EsT0FBSyxxQkFBTDs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxhQUFMLENBQW1CLE1BQXZDLEVBQStDLEdBQS9DLEVBQW9EOztBQUVsRCxhQUFTLEtBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixFQUEvQixJQUFxQyxLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsQ0FBckM7QUFDQSxrQkFBYyxLQUFLLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0IsRUFBcEMsSUFBMEMsR0FBRyxNQUFILENBQVUsS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLFFBQXRCLEdBQWlDLFFBQWpDLEVBQVYsQ0FBMUM7O0FBRUE7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLFFBQXRCLEVBQXpCO0FBQ0EsU0FBSyxhQUFMLENBQW1CLENBQW5CLEVBQXNCLEtBQXRCLEdBQThCLElBQTlCO0FBQ0Q7O0FBRUQsT0FBSyxZQUFMLENBQWtCLGFBQWxCOztBQUVBO0FBQ0EsT0FBSyxtQkFBTCxDQUF5QixhQUF6QixFQUF3QyxRQUF4QztBQUNELENBckJEOztBQXVCQSxXQUFXLFNBQVgsQ0FBcUIsc0JBQXJCLEdBQThDLFlBQVk7QUFDeEQsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLHNCQUFzQixLQUFLLG1CQUFMLEdBQTJCLEVBQXJEOztBQUVBLFNBQU8sSUFBUCxDQUFZLEtBQUssWUFBakIsRUFBK0IsT0FBL0IsQ0FBdUMsVUFBUyxFQUFULEVBQWE7QUFDbEQsUUFBSSxlQUFlLEtBQUssYUFBTCxDQUFtQixFQUFuQixDQUFuQixDQURrRCxDQUNQOztBQUUzQyx3QkFBb0IsRUFBcEIsSUFBMEIsS0FBSyxTQUFMLENBQWUsS0FBSyxZQUFMLENBQWtCLEVBQWxCLENBQWYsRUFBc0MsYUFBYSxXQUFiLEdBQTJCLGFBQWEsWUFBOUUsQ0FBMUI7O0FBRUE7QUFDQSxpQkFBYSxJQUFiLENBQWtCLEtBQWxCLEdBQTBCLG9CQUFvQixFQUFwQixFQUF3QixLQUFsRDtBQUNBLGlCQUFhLElBQWIsQ0FBa0IsTUFBbEIsR0FBMkIsb0JBQW9CLEVBQXBCLEVBQXdCLE1BQW5EO0FBQ0QsR0FSRDtBQVNELENBYkQ7O0FBZUEsV0FBVyxTQUFYLENBQXFCLG1CQUFyQixHQUEyQyxZQUFZO0FBQ3JELE9BQUssSUFBSSxJQUFJLEtBQUssYUFBTCxDQUFtQixNQUFuQixHQUE0QixDQUF6QyxFQUE0QyxLQUFLLENBQWpELEVBQW9ELEdBQXBELEVBQXlEO0FBQ3ZELFFBQUksZ0JBQWdCLEtBQUssYUFBTCxDQUFtQixDQUFuQixDQUFwQjtBQUNBLFFBQUksS0FBSyxjQUFjLEVBQXZCO0FBQ0EsUUFBSSxtQkFBbUIsY0FBYyxXQUFyQztBQUNBLFFBQUksaUJBQWlCLGNBQWMsVUFBbkM7O0FBRUEsU0FBSyxlQUFMLENBQXFCLEtBQUssZUFBTCxDQUFxQixFQUFyQixDQUFyQixFQUErQyxjQUFjLElBQWQsQ0FBbUIsQ0FBbEUsRUFBcUUsY0FBYyxJQUFkLENBQW1CLENBQXhGLEVBQTJGLGdCQUEzRixFQUE2RyxjQUE3RztBQUNEO0FBQ0YsQ0FURDs7QUFXQSxXQUFXLFNBQVgsQ0FBcUIsMkJBQXJCLEdBQW1ELFlBQVk7QUFDN0QsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLFlBQVksS0FBSyxtQkFBckI7O0FBRUEsU0FBTyxJQUFQLENBQVksU0FBWixFQUF1QixPQUF2QixDQUErQixVQUFTLEVBQVQsRUFBYTtBQUMxQyxRQUFJLGVBQWUsS0FBSyxhQUFMLENBQW1CLEVBQW5CLENBQW5CLENBRDBDLENBQ0M7QUFDM0MsUUFBSSxtQkFBbUIsYUFBYSxXQUFwQztBQUNBLFFBQUksaUJBQWlCLGFBQWEsVUFBbEM7O0FBRUE7QUFDQSxTQUFLLGVBQUwsQ0FBcUIsVUFBVSxFQUFWLENBQXJCLEVBQW9DLGFBQWEsSUFBYixDQUFrQixDQUF0RCxFQUF5RCxhQUFhLElBQWIsQ0FBa0IsQ0FBM0UsRUFBOEUsZ0JBQTlFLEVBQWdHLGNBQWhHO0FBQ0QsR0FQRDtBQVFELENBWkQ7O0FBY0EsV0FBVyxTQUFYLENBQXFCLFlBQXJCLEdBQW9DLFVBQVUsSUFBVixFQUFnQjtBQUNsRCxNQUFJLEtBQUssS0FBSyxFQUFkO0FBQ0E7QUFDQSxNQUFJLEtBQUssU0FBTCxDQUFlLEVBQWYsS0FBc0IsSUFBMUIsRUFBZ0M7QUFDOUIsV0FBTyxLQUFLLFNBQUwsQ0FBZSxFQUFmLENBQVA7QUFDRDs7QUFFRDtBQUNBLE1BQUksYUFBYSxLQUFLLFFBQUwsRUFBakI7QUFDQSxNQUFJLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEIsU0FBSyxTQUFMLENBQWUsRUFBZixJQUFxQixLQUFyQjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQUksV0FBVyxXQUFXLFFBQVgsRUFBZixDQWRrRCxDQWNaOztBQUV0QztBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLFFBQUksV0FBVyxTQUFTLENBQVQsQ0FBZjs7QUFFQSxRQUFJLEtBQUssYUFBTCxDQUFtQixRQUFuQixJQUErQixDQUFuQyxFQUFzQztBQUNwQyxXQUFLLFNBQUwsQ0FBZSxFQUFmLElBQXFCLEtBQXJCO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLFNBQVMsUUFBVCxNQUF1QixJQUEzQixFQUFpQztBQUMvQixXQUFLLFNBQUwsQ0FBZSxTQUFTLEVBQXhCLElBQThCLEtBQTlCO0FBQ0E7QUFDRDs7QUFFRCxRQUFJLENBQUMsS0FBSyxZQUFMLENBQWtCLFFBQWxCLENBQUwsRUFBa0M7QUFDaEMsV0FBSyxTQUFMLENBQWUsRUFBZixJQUFxQixLQUFyQjtBQUNBLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxPQUFLLFNBQUwsQ0FBZSxFQUFmLElBQXFCLElBQXJCO0FBQ0EsU0FBTyxJQUFQO0FBQ0QsQ0F0Q0Q7O0FBd0NBO0FBQ0EsV0FBVyxTQUFYLENBQXFCLGFBQXJCLEdBQXFDLFVBQVUsSUFBVixFQUFnQjtBQUNuRCxNQUFJLEtBQUssS0FBSyxFQUFkO0FBQ0EsTUFBSSxRQUFRLEtBQUssUUFBTCxFQUFaO0FBQ0EsTUFBSSxTQUFTLENBQWI7O0FBRUE7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxRQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFDQSxRQUFJLEtBQUssU0FBTCxHQUFpQixFQUFqQixJQUF1QixLQUFLLFNBQUwsR0FBaUIsRUFBNUMsRUFBZ0Q7QUFDOUMsZUFBUyxTQUFTLENBQWxCO0FBQ0Q7QUFDRjtBQUNELFNBQU8sTUFBUDtBQUNELENBYkQ7O0FBZUE7QUFDQSxXQUFXLFNBQVgsQ0FBcUIseUJBQXJCLEdBQWlELFVBQVUsSUFBVixFQUFnQjtBQUMvRCxNQUFJLFNBQVMsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQWI7QUFDQSxNQUFJLEtBQUssUUFBTCxNQUFtQixJQUF2QixFQUE2QjtBQUMzQixXQUFPLE1BQVA7QUFDRDtBQUNELE1BQUksV0FBVyxLQUFLLFFBQUwsR0FBZ0IsUUFBaEIsRUFBZjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLFFBQUksUUFBUSxTQUFTLENBQVQsQ0FBWjtBQUNBLGNBQVUsS0FBSyx5QkFBTCxDQUErQixLQUEvQixDQUFWO0FBQ0Q7QUFDRCxTQUFPLE1BQVA7QUFDRCxDQVhEOztBQWFBLFdBQVcsU0FBWCxDQUFxQixxQkFBckIsR0FBNkMsWUFBWTtBQUN2RCxPQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxPQUFLLG9CQUFMLENBQTBCLEtBQUssWUFBTCxDQUFrQixPQUFsQixHQUE0QixRQUE1QixFQUExQjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLG9CQUFyQixHQUE0QyxVQUFVLFFBQVYsRUFBb0I7QUFDOUQsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsUUFBSSxRQUFRLFNBQVMsQ0FBVCxDQUFaO0FBQ0EsUUFBSSxNQUFNLFFBQU4sTUFBb0IsSUFBeEIsRUFBOEI7QUFDNUIsV0FBSyxvQkFBTCxDQUEwQixNQUFNLFFBQU4sR0FBaUIsUUFBakIsRUFBMUI7QUFDRDtBQUNELFFBQUksS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQUosRUFBOEI7QUFDNUIsV0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLEtBQXhCO0FBQ0Q7QUFDRjtBQUNGLENBVkQ7O0FBWUE7OztBQUdBLFdBQVcsU0FBWCxDQUFxQixlQUFyQixHQUF1QyxVQUFVLFlBQVYsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsd0JBQTlCLEVBQXdELHNCQUF4RCxFQUFnRjtBQUNySCxPQUFLLHdCQUFMO0FBQ0EsT0FBSyxzQkFBTDs7QUFFQSxNQUFJLE9BQU8sQ0FBWDs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksYUFBYSxJQUFiLENBQWtCLE1BQXRDLEVBQThDLEdBQTlDLEVBQW1EO0FBQ2pELFFBQUksTUFBTSxhQUFhLElBQWIsQ0FBa0IsQ0FBbEIsQ0FBVjtBQUNBLFFBQUksSUFBSjtBQUNBLFFBQUksWUFBWSxDQUFoQjs7QUFFQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxVQUFJLFFBQVEsSUFBSSxDQUFKLENBQVo7O0FBRUEsWUFBTSxJQUFOLENBQVcsQ0FBWCxHQUFlLENBQWYsQ0FIbUMsQ0FHbEI7QUFDakIsWUFBTSxJQUFOLENBQVcsQ0FBWCxHQUFlLENBQWYsQ0FKbUMsQ0FJbEI7O0FBRWpCLFdBQUssTUFBTSxJQUFOLENBQVcsS0FBWCxHQUFtQixhQUFhLGlCQUFyQzs7QUFFQSxVQUFJLE1BQU0sSUFBTixDQUFXLE1BQVgsR0FBb0IsU0FBeEIsRUFDRSxZQUFZLE1BQU0sSUFBTixDQUFXLE1BQXZCO0FBQ0g7O0FBRUQsU0FBSyxZQUFZLGFBQWEsZUFBOUI7QUFDRDtBQUNGLENBekJEOztBQTJCQSxXQUFXLFNBQVgsQ0FBcUIsbUJBQXJCLEdBQTJDLFVBQVUsYUFBVixFQUF5QixRQUF6QixFQUFtQztBQUM1RSxNQUFJLE9BQU8sSUFBWDtBQUNBLE9BQUssZUFBTCxHQUF1QixFQUF2Qjs7QUFFQSxTQUFPLElBQVAsQ0FBWSxhQUFaLEVBQTJCLE9BQTNCLENBQW1DLFVBQVMsRUFBVCxFQUFhO0FBQzlDO0FBQ0EsUUFBSSxlQUFlLFNBQVMsRUFBVCxDQUFuQjs7QUFFQSxTQUFLLGVBQUwsQ0FBcUIsRUFBckIsSUFBMkIsS0FBSyxTQUFMLENBQWUsY0FBYyxFQUFkLENBQWYsRUFBa0MsYUFBYSxXQUFiLEdBQTJCLGFBQWEsWUFBMUUsQ0FBM0I7O0FBRUEsaUJBQWEsSUFBYixDQUFrQixLQUFsQixHQUEwQixLQUFLLGVBQUwsQ0FBcUIsRUFBckIsRUFBeUIsS0FBekIsR0FBaUMsRUFBM0Q7QUFDQSxpQkFBYSxJQUFiLENBQWtCLE1BQWxCLEdBQTJCLEtBQUssZUFBTCxDQUFxQixFQUFyQixFQUF5QixNQUF6QixHQUFrQyxFQUE3RDtBQUNELEdBUkQ7QUFTRCxDQWJEOztBQWVBLFdBQVcsU0FBWCxDQUFxQixTQUFyQixHQUFpQyxVQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkI7QUFDMUQsTUFBSSxrQkFBa0IsY0FBYyx1QkFBcEM7QUFDQSxNQUFJLG9CQUFvQixjQUFjLHlCQUF0QztBQUNBLE1BQUksZUFBZTtBQUNqQixVQUFNLEVBRFc7QUFFakIsY0FBVSxFQUZPO0FBR2pCLGVBQVcsRUFITTtBQUlqQixXQUFPLEVBSlU7QUFLakIsWUFBUSxFQUxTO0FBTWpCLHFCQUFpQixlQU5BO0FBT2pCLHVCQUFtQjtBQVBGLEdBQW5COztBQVVBO0FBQ0EsUUFBTSxJQUFOLENBQVcsVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQjtBQUMzQixRQUFJLEdBQUcsSUFBSCxDQUFRLEtBQVIsR0FBZ0IsR0FBRyxJQUFILENBQVEsTUFBeEIsR0FBaUMsR0FBRyxJQUFILENBQVEsS0FBUixHQUFnQixHQUFHLElBQUgsQ0FBUSxNQUE3RCxFQUNFLE9BQU8sQ0FBQyxDQUFSO0FBQ0YsUUFBSSxHQUFHLElBQUgsQ0FBUSxLQUFSLEdBQWdCLEdBQUcsSUFBSCxDQUFRLE1BQXhCLEdBQWlDLEdBQUcsSUFBSCxDQUFRLEtBQVIsR0FBZ0IsR0FBRyxJQUFILENBQVEsTUFBN0QsRUFDRSxPQUFPLENBQVA7QUFDRixXQUFPLENBQVA7QUFDRCxHQU5EOztBQVFBO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBSSxRQUFRLE1BQU0sQ0FBTixDQUFaOztBQUVBLFFBQUksYUFBYSxJQUFiLENBQWtCLE1BQWxCLElBQTRCLENBQWhDLEVBQW1DO0FBQ2pDLFdBQUssZUFBTCxDQUFxQixZQUFyQixFQUFtQyxLQUFuQyxFQUEwQyxDQUExQyxFQUE2QyxRQUE3QztBQUNELEtBRkQsTUFHSyxJQUFJLEtBQUssZ0JBQUwsQ0FBc0IsWUFBdEIsRUFBb0MsTUFBTSxJQUFOLENBQVcsS0FBL0MsRUFBc0QsTUFBTSxJQUFOLENBQVcsTUFBakUsQ0FBSixFQUE4RTtBQUNqRixXQUFLLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsS0FBbkMsRUFBMEMsS0FBSyxtQkFBTCxDQUF5QixZQUF6QixDQUExQyxFQUFrRixRQUFsRjtBQUNELEtBRkksTUFHQTtBQUNILFdBQUssZUFBTCxDQUFxQixZQUFyQixFQUFtQyxLQUFuQyxFQUEwQyxhQUFhLElBQWIsQ0FBa0IsTUFBNUQsRUFBb0UsUUFBcEU7QUFDRDs7QUFFRCxTQUFLLGNBQUwsQ0FBb0IsWUFBcEI7QUFDRDs7QUFFRCxTQUFPLFlBQVA7QUFDRCxDQXhDRDs7QUEwQ0EsV0FBVyxTQUFYLENBQXFCLGVBQXJCLEdBQXVDLFVBQVUsWUFBVixFQUF3QixJQUF4QixFQUE4QixRQUE5QixFQUF3QyxRQUF4QyxFQUFrRDtBQUN2RixNQUFJLGtCQUFrQixRQUF0Qjs7QUFFQTtBQUNBLE1BQUksWUFBWSxhQUFhLElBQWIsQ0FBa0IsTUFBbEMsRUFBMEM7QUFDeEMsUUFBSSxrQkFBa0IsRUFBdEI7O0FBRUEsaUJBQWEsSUFBYixDQUFrQixJQUFsQixDQUF1QixlQUF2QjtBQUNBLGlCQUFhLFFBQWIsQ0FBc0IsSUFBdEIsQ0FBMkIsZUFBM0I7QUFDQSxpQkFBYSxTQUFiLENBQXVCLElBQXZCLENBQTRCLENBQTVCO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLElBQUksYUFBYSxRQUFiLENBQXNCLFFBQXRCLElBQWtDLEtBQUssSUFBTCxDQUFVLEtBQXBEOztBQUVBLE1BQUksYUFBYSxJQUFiLENBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLEdBQXFDLENBQXpDLEVBQTRDO0FBQzFDLFNBQUssYUFBYSxpQkFBbEI7QUFDRDs7QUFFRCxlQUFhLFFBQWIsQ0FBc0IsUUFBdEIsSUFBa0MsQ0FBbEM7QUFDQTtBQUNBLE1BQUksYUFBYSxLQUFiLEdBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGlCQUFhLEtBQWIsR0FBcUIsQ0FBckI7QUFDRDs7QUFFRDtBQUNBLE1BQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFsQjtBQUNBLE1BQUksV0FBVyxDQUFmLEVBQ0UsS0FBSyxhQUFhLGVBQWxCOztBQUVGLE1BQUksY0FBYyxDQUFsQjtBQUNBLE1BQUksSUFBSSxhQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBUixFQUEwQztBQUN4QyxrQkFBYyxhQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZDtBQUNBLGlCQUFhLFNBQWIsQ0FBdUIsUUFBdkIsSUFBbUMsQ0FBbkM7QUFDQSxrQkFBYyxhQUFhLFNBQWIsQ0FBdUIsUUFBdkIsSUFBbUMsV0FBakQ7QUFDRDs7QUFFRCxlQUFhLE1BQWIsSUFBdUIsV0FBdkI7O0FBRUE7QUFDQSxlQUFhLElBQWIsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsQ0FBaUMsSUFBakM7QUFDRCxDQXpDRDs7QUEyQ0E7QUFDQSxXQUFXLFNBQVgsQ0FBcUIsbUJBQXJCLEdBQTJDLFVBQVUsWUFBVixFQUF3QjtBQUNqRSxNQUFJLElBQUksQ0FBQyxDQUFUO0FBQ0EsTUFBSSxNQUFNLE9BQU8sU0FBakI7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGFBQWEsSUFBYixDQUFrQixNQUF0QyxFQUE4QyxHQUE5QyxFQUFtRDtBQUNqRCxRQUFJLGFBQWEsUUFBYixDQUFzQixDQUF0QixJQUEyQixHQUEvQixFQUFvQztBQUNsQyxVQUFJLENBQUo7QUFDQSxZQUFNLGFBQWEsUUFBYixDQUFzQixDQUF0QixDQUFOO0FBQ0Q7QUFDRjtBQUNELFNBQU8sQ0FBUDtBQUNELENBWEQ7O0FBYUE7QUFDQSxXQUFXLFNBQVgsQ0FBcUIsa0JBQXJCLEdBQTBDLFVBQVUsWUFBVixFQUF3QjtBQUNoRSxNQUFJLElBQUksQ0FBQyxDQUFUO0FBQ0EsTUFBSSxNQUFNLE9BQU8sU0FBakI7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGFBQWEsSUFBYixDQUFrQixNQUF0QyxFQUE4QyxHQUE5QyxFQUFtRDs7QUFFakQsUUFBSSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsSUFBMkIsR0FBL0IsRUFBb0M7QUFDbEMsVUFBSSxDQUFKO0FBQ0EsWUFBTSxhQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxDQUFQO0FBQ0QsQ0FiRDs7QUFlQTs7OztBQUlBLFdBQVcsU0FBWCxDQUFxQixnQkFBckIsR0FBd0MsVUFBVSxZQUFWLEVBQXdCLFVBQXhCLEVBQW9DLFdBQXBDLEVBQWlEOztBQUV2RixNQUFJLE1BQU0sS0FBSyxtQkFBTCxDQUF5QixZQUF6QixDQUFWOztBQUVBLE1BQUksTUFBTSxDQUFWLEVBQWE7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLE1BQU0sYUFBYSxRQUFiLENBQXNCLEdBQXRCLENBQVY7O0FBRUEsTUFBSSxNQUFNLGFBQWEsaUJBQW5CLEdBQXVDLFVBQXZDLElBQXFELGFBQWEsS0FBdEUsRUFDRSxPQUFPLElBQVA7O0FBRUYsTUFBSSxRQUFRLENBQVo7O0FBRUE7QUFDQSxNQUFJLGFBQWEsU0FBYixDQUF1QixHQUF2QixJQUE4QixXQUFsQyxFQUErQztBQUM3QyxRQUFJLE1BQU0sQ0FBVixFQUNFLFFBQVEsY0FBYyxhQUFhLGVBQTNCLEdBQTZDLGFBQWEsU0FBYixDQUF1QixHQUF2QixDQUFyRDtBQUNIOztBQUVELE1BQUksZ0JBQUo7QUFDQSxNQUFJLGFBQWEsS0FBYixHQUFxQixHQUFyQixJQUE0QixhQUFhLGFBQWEsaUJBQTFELEVBQTZFO0FBQzNFLHVCQUFtQixDQUFDLGFBQWEsTUFBYixHQUFzQixLQUF2QixLQUFpQyxNQUFNLFVBQU4sR0FBbUIsYUFBYSxpQkFBakUsQ0FBbkI7QUFDRCxHQUZELE1BRU87QUFDTCx1QkFBbUIsQ0FBQyxhQUFhLE1BQWIsR0FBc0IsS0FBdkIsSUFBZ0MsYUFBYSxLQUFoRTtBQUNEOztBQUVEO0FBQ0EsVUFBUSxjQUFjLGFBQWEsZUFBbkM7QUFDQSxNQUFJLGlCQUFKO0FBQ0EsTUFBSSxhQUFhLEtBQWIsR0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsd0JBQW9CLENBQUMsYUFBYSxNQUFiLEdBQXNCLEtBQXZCLElBQWdDLFVBQXBEO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsd0JBQW9CLENBQUMsYUFBYSxNQUFiLEdBQXNCLEtBQXZCLElBQWdDLGFBQWEsS0FBakU7QUFDRDs7QUFFRCxNQUFJLG9CQUFvQixDQUF4QixFQUNFLG9CQUFvQixJQUFJLGlCQUF4Qjs7QUFFRixNQUFJLG1CQUFtQixDQUF2QixFQUNFLG1CQUFtQixJQUFJLGdCQUF2Qjs7QUFFRixTQUFPLG1CQUFtQixpQkFBMUI7QUFDRCxDQTVDRDs7QUE4Q0E7QUFDQTtBQUNBLFdBQVcsU0FBWCxDQUFxQixjQUFyQixHQUFzQyxVQUFVLFlBQVYsRUFBd0I7QUFDNUQsTUFBSSxVQUFVLEtBQUssa0JBQUwsQ0FBd0IsWUFBeEIsQ0FBZDtBQUNBLE1BQUksT0FBTyxhQUFhLFFBQWIsQ0FBc0IsTUFBdEIsR0FBK0IsQ0FBMUM7QUFDQSxNQUFJLE1BQU0sYUFBYSxJQUFiLENBQWtCLE9BQWxCLENBQVY7QUFDQSxNQUFJLE9BQU8sSUFBSSxJQUFJLE1BQUosR0FBYSxDQUFqQixDQUFYOztBQUVBLE1BQUksT0FBTyxLQUFLLEtBQUwsR0FBYSxhQUFhLGlCQUFyQzs7QUFFQTtBQUNBLE1BQUksYUFBYSxLQUFiLEdBQXFCLGFBQWEsUUFBYixDQUFzQixJQUF0QixDQUFyQixHQUFtRCxJQUFuRCxJQUEyRCxXQUFXLElBQTFFLEVBQWdGO0FBQzlFO0FBQ0EsUUFBSSxNQUFKLENBQVcsQ0FBQyxDQUFaLEVBQWUsQ0FBZjs7QUFFQTtBQUNBLGlCQUFhLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsQ0FBNkIsSUFBN0I7O0FBRUEsaUJBQWEsUUFBYixDQUFzQixPQUF0QixJQUFpQyxhQUFhLFFBQWIsQ0FBc0IsT0FBdEIsSUFBaUMsSUFBbEU7QUFDQSxpQkFBYSxRQUFiLENBQXNCLElBQXRCLElBQThCLGFBQWEsUUFBYixDQUFzQixJQUF0QixJQUE4QixJQUE1RDtBQUNBLGlCQUFhLEtBQWIsR0FBcUIsYUFBYSxRQUFiLENBQXNCLFNBQVMsa0JBQVQsQ0FBNEIsWUFBNUIsQ0FBdEIsQ0FBckI7O0FBRUE7QUFDQSxRQUFJLFlBQVksT0FBTyxTQUF2QjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFJLE1BQXhCLEVBQWdDLEdBQWhDLEVBQXFDO0FBQ25DLFVBQUksSUFBSSxDQUFKLEVBQU8sTUFBUCxHQUFnQixTQUFwQixFQUNFLFlBQVksSUFBSSxDQUFKLEVBQU8sTUFBbkI7QUFDSDtBQUNELFFBQUksVUFBVSxDQUFkLEVBQ0UsYUFBYSxhQUFhLGVBQTFCOztBQUVGLFFBQUksWUFBWSxhQUFhLFNBQWIsQ0FBdUIsT0FBdkIsSUFBa0MsYUFBYSxTQUFiLENBQXVCLElBQXZCLENBQWxEOztBQUVBLGlCQUFhLFNBQWIsQ0FBdUIsT0FBdkIsSUFBa0MsU0FBbEM7QUFDQSxRQUFJLGFBQWEsU0FBYixDQUF1QixJQUF2QixJQUErQixLQUFLLE1BQUwsR0FBYyxhQUFhLGVBQTlELEVBQ0UsYUFBYSxTQUFiLENBQXVCLElBQXZCLElBQStCLEtBQUssTUFBTCxHQUFjLGFBQWEsZUFBMUQ7O0FBRUYsUUFBSSxhQUFhLGFBQWEsU0FBYixDQUF1QixPQUF2QixJQUFrQyxhQUFhLFNBQWIsQ0FBdUIsSUFBdkIsQ0FBbkQ7QUFDQSxpQkFBYSxNQUFiLElBQXdCLGFBQWEsU0FBckM7O0FBRUEsU0FBSyxjQUFMLENBQW9CLFlBQXBCO0FBQ0Q7QUFDRixDQXhDRDs7QUEwQ0EsV0FBVyxTQUFYLENBQXFCLGVBQXJCLEdBQXVDLFlBQVc7QUFDaEQsTUFBSSxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCO0FBQ0EsU0FBSyxzQkFBTDtBQUNBO0FBQ0EsU0FBSyxjQUFMO0FBQ0E7QUFDQSxTQUFLLHNCQUFMO0FBQ0Q7QUFDRixDQVREOztBQVdBLFdBQVcsU0FBWCxDQUFxQixnQkFBckIsR0FBd0MsWUFBVztBQUNqRCxNQUFJLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEIsU0FBSywyQkFBTDtBQUNBLFNBQUssbUJBQUw7QUFDRDtBQUNGLENBTEQ7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLFVBQWpCOzs7OztBQzNsQ0EsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7O0FBRUEsU0FBUyxRQUFULENBQWtCLEVBQWxCLEVBQXNCLEdBQXRCLEVBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQXdDO0FBQ3RDLGVBQWEsSUFBYixDQUFrQixJQUFsQixFQUF3QixFQUF4QixFQUE0QixHQUE1QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QztBQUNEOztBQUdELFNBQVMsU0FBVCxHQUFxQixPQUFPLE1BQVAsQ0FBYyxhQUFhLFNBQTNCLENBQXJCO0FBQ0EsS0FBSyxJQUFJLElBQVQsSUFBaUIsWUFBakIsRUFBK0I7QUFDN0IsV0FBUyxJQUFULElBQWlCLGFBQWEsSUFBYixDQUFqQjtBQUNEOztBQUVELFNBQVMsU0FBVCxDQUFtQixJQUFuQixHQUEwQixZQUMxQjtBQUNFLE1BQUksU0FBUyxLQUFLLFlBQUwsQ0FBa0IsU0FBbEIsRUFBYjtBQUNBLE9BQUssYUFBTCxHQUFxQixPQUFPLGFBQVAsSUFDWixLQUFLLFlBQUwsR0FBb0IsS0FBSyxlQUF6QixHQUEyQyxLQUFLLGlCQURwQyxJQUN5RCxLQUFLLFlBRG5GO0FBRUEsT0FBSyxhQUFMLEdBQXFCLE9BQU8sYUFBUCxJQUNaLEtBQUssWUFBTCxHQUFvQixLQUFLLGVBQXpCLEdBQTJDLEtBQUssaUJBRHBDLElBQ3lELEtBQUssWUFEbkY7O0FBSUEsTUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLGFBQWQsSUFBK0IsT0FBTyxhQUFQLEdBQXVCLE9BQU8sbUJBQWpFLEVBQ0E7QUFDRSxTQUFLLGFBQUwsR0FBcUIsT0FBTyxhQUFQLEdBQXVCLE9BQU8sbUJBQTlCLEdBQ2IsTUFBTSxJQUFOLENBQVcsS0FBSyxhQUFoQixDQURSO0FBRUQ7O0FBRUQsTUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLGFBQWQsSUFBK0IsT0FBTyxhQUFQLEdBQXVCLE9BQU8sbUJBQWpFLEVBQ0E7QUFDRSxTQUFLLGFBQUwsR0FBcUIsT0FBTyxhQUFQLEdBQXVCLE9BQU8sbUJBQTlCLEdBQ2IsTUFBTSxJQUFOLENBQVcsS0FBSyxhQUFoQixDQURSO0FBRUQ7O0FBRUQ7QUFDQSxNQUFJLEtBQUssS0FBTCxJQUFjLElBQWxCLEVBQ0E7QUFDRSxTQUFLLE1BQUwsQ0FBWSxLQUFLLGFBQWpCLEVBQWdDLEtBQUssYUFBckM7QUFDRDtBQUNEO0FBSkEsT0FLSyxJQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFDTDtBQUNFLFdBQUssTUFBTCxDQUFZLEtBQUssYUFBakIsRUFBZ0MsS0FBSyxhQUFyQztBQUNEO0FBQ0Q7QUFKSyxTQU1MO0FBQ0UsYUFBSywrQkFBTCxDQUFxQyxLQUFLLGFBQTFDLEVBQ1EsS0FBSyxhQURiO0FBRUQ7O0FBRUQsU0FBTyxpQkFBUCxJQUNRLEtBQUssR0FBTCxDQUFTLEtBQUssYUFBZCxJQUErQixLQUFLLEdBQUwsQ0FBUyxLQUFLLGFBQWQsQ0FEdkM7O0FBR0EsTUFBSSxXQUFXO0FBQ2Isa0JBQWMsS0FBSyxZQUROO0FBRWIsa0JBQWMsS0FBSyxZQUZOO0FBR2IscUJBQWlCLEtBQUssZUFIVDtBQUliLHFCQUFpQixLQUFLLGVBSlQ7QUFLYix1QkFBbUIsS0FBSyxpQkFMWDtBQU1iLHVCQUFtQixLQUFLLGlCQU5YO0FBT2IsbUJBQWUsS0FBSyxhQVBQO0FBUWIsbUJBQWUsS0FBSztBQVJQLEdBQWY7O0FBV0EsT0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsT0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsT0FBSyxpQkFBTCxHQUF5QixDQUF6QjtBQUNBLE9BQUssaUJBQUwsR0FBeUIsQ0FBekI7QUFDQSxPQUFLLGFBQUwsR0FBcUIsQ0FBckI7QUFDQSxPQUFLLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsU0FBTyxRQUFQO0FBQ0QsQ0E5REQ7O0FBZ0VBLFNBQVMsU0FBVCxDQUFtQiwrQkFBbkIsR0FBcUQsVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUNyRDtBQUNFLE1BQUksUUFBUSxLQUFLLFFBQUwsR0FBZ0IsUUFBaEIsRUFBWjtBQUNBLE1BQUksSUFBSjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQ0E7QUFDRSxXQUFPLE1BQU0sQ0FBTixDQUFQO0FBQ0EsUUFBSSxLQUFLLFFBQUwsTUFBbUIsSUFBdkIsRUFDQTtBQUNFLFdBQUssTUFBTCxDQUFZLEVBQVosRUFBZ0IsRUFBaEI7QUFDQSxXQUFLLGFBQUwsSUFBc0IsRUFBdEI7QUFDQSxXQUFLLGFBQUwsSUFBc0IsRUFBdEI7QUFDRCxLQUxELE1BT0E7QUFDRSxXQUFLLCtCQUFMLENBQXFDLEVBQXJDLEVBQXlDLEVBQXpDO0FBQ0Q7QUFDRjtBQUNGLENBbEJEOztBQW9CQSxTQUFTLFNBQVQsQ0FBbUIsUUFBbkIsR0FBOEIsVUFBVSxLQUFWLEVBQzlCO0FBQ0UsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNELENBSEQ7O0FBS0EsU0FBUyxTQUFULENBQW1CLFFBQW5CLEdBQThCLFlBQzlCO0FBQ0UsU0FBTyxLQUFLLEtBQVo7QUFDRCxDQUhEOztBQUtBLFNBQVMsU0FBVCxDQUFtQixRQUFuQixHQUE4QixVQUFVLEtBQVYsRUFDOUI7QUFDRSxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0QsQ0FIRDs7QUFLQSxTQUFTLFNBQVQsQ0FBbUIsUUFBbkIsR0FBOEIsWUFDOUI7QUFDRSxTQUFPLEtBQUssS0FBWjtBQUNELENBSEQ7O0FBS0EsU0FBUyxTQUFULENBQW1CLE9BQW5CLEdBQTZCLFVBQVUsSUFBVixFQUM3QjtBQUNFLE9BQUssSUFBTCxHQUFZLElBQVo7QUFDRCxDQUhEOztBQUtBLFNBQVMsU0FBVCxDQUFtQixPQUFuQixHQUE2QixZQUM3QjtBQUNFLFNBQU8sS0FBSyxJQUFaO0FBQ0QsQ0FIRDs7QUFLQSxTQUFTLFNBQVQsQ0FBbUIsWUFBbkIsR0FBa0MsVUFBVSxTQUFWLEVBQ2xDO0FBQ0UsT0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0QsQ0FIRDs7QUFLQSxTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsWUFDakM7QUFDRSxTQUFPLEtBQUssU0FBWjtBQUNELENBSEQ7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7OztBQ3pJQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7O0FBRUEsU0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXdDLEtBQXhDLEVBQStDO0FBQzdDLFdBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsTUFBcEIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBcEM7QUFDRDs7QUFFRCxlQUFlLFNBQWYsR0FBMkIsT0FBTyxNQUFQLENBQWMsU0FBUyxTQUF2QixDQUEzQjtBQUNBLEtBQUssSUFBSSxJQUFULElBQWlCLFFBQWpCLEVBQTJCO0FBQ3pCLGlCQUFlLElBQWYsSUFBdUIsU0FBUyxJQUFULENBQXZCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLGNBQWpCOzs7OztBQ1hBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBYjtBQUNBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQXJCOztBQUVBLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQyxNQUFqQyxFQUF5QyxNQUF6QyxFQUFpRDs7QUFFL0MsTUFBRyxVQUFVLElBQVYsSUFBa0IsVUFBVSxJQUEvQixFQUNBO0FBQ0UsYUFBUyxNQUFUO0FBQ0EsV0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixJQUFsQixFQUF3QixNQUF4QixFQUFnQyxJQUFoQztBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDRCxHQUxELE1BT0E7QUFDRSxXQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLE1BQWxCLEVBQTBCLE1BQTFCLEVBQWtDLE1BQWxDO0FBQ0Q7QUFDRjs7QUFFRCxnQkFBZ0IsU0FBaEIsR0FBNEIsT0FBTyxNQUFQLENBQWMsT0FBTyxTQUFyQixDQUE1QjtBQUNBLEtBQUssSUFBSSxJQUFULElBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLGtCQUFnQixJQUFoQixJQUF3QixPQUFPLElBQVAsQ0FBeEI7QUFDRDs7QUFFRDs7O0FBR0EsZ0JBQWdCLFNBQWhCLENBQTBCLE9BQTFCLEdBQW9DLFlBQ3BDO0FBQ0UsT0FBSyxVQUFMO0FBQ0EsTUFBSSxDQUFKLEVBQU8sQ0FBUDs7QUFFQSxNQUFHLEtBQUssUUFBTCxHQUFnQixNQUFoQixHQUF5QixDQUE1QixFQUNBO0FBQ0U7QUFDQTtBQUNBLFdBQU0sQ0FBRyxLQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsRUFBbUIsU0FBbkIsRUFBVCxFQUNBO0FBQ0U7QUFDQSxVQUFJLEtBQUssUUFBTCxHQUFnQixDQUFoQixDQUFKLENBRkYsQ0FFMkI7QUFDekIsVUFBSSxFQUFFLFdBQUYsRUFBSjs7QUFFQTtBQUNBLFdBQUssUUFBTCxDQUFlLENBQWYsRUFBa0IsQ0FBbEI7QUFDRDs7QUFFRCxRQUFJLFFBQVEsS0FBSyxRQUFMLEVBQVo7O0FBRUEsU0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksTUFBTSxNQUF6QixFQUFpQyxHQUFqQyxFQUNBO0FBQ0UsVUFBSSxJQUFJLE1BQU0sQ0FBTixDQUFSOztBQUVBO0FBQ0EsVUFBSSxJQUFJLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsSUFBcEIsQ0FBUjs7QUFFQSxRQUFFLFFBQUYsQ0FBVyxFQUFFLFFBQUYsR0FBYSxZQUFiLEVBQVg7QUFDQSxRQUFFLFFBQUYsR0FBYSxZQUFiLEdBQTRCLE9BQTVCLENBQW9DLENBQXBDOztBQUVBO0FBQ0EsVUFBRyxFQUFFLFFBQUYsTUFBZ0IsSUFBbkIsRUFDQTtBQUNFLFVBQUUsUUFBRixDQUFXLEVBQUUsUUFBRixHQUFhLFlBQWIsRUFBWDtBQUNBLFVBQUUsUUFBRixHQUFhLFlBQWIsR0FBNEIsT0FBNUIsQ0FBb0MsQ0FBcEM7QUFDRDs7QUFFRCxRQUFFLFlBQUYsQ0FBZSxDQUFmO0FBQ0Q7QUFDRjtBQUNGLENBekNEOztBQTJDQTs7OztBQUlBLGdCQUFnQixTQUFoQixDQUEwQixVQUExQixHQUF1QyxZQUN2QztBQUNFLE1BQUksSUFBSjtBQUNBLE1BQUksUUFBUSxLQUFLLFFBQUwsRUFBWjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxRQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsS0FBaEI7QUFDRDtBQUNGLENBVEQ7O0FBV0E7OztBQUdBLGdCQUFnQixTQUFoQixDQUEwQixRQUExQixHQUFxQyxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQ3JDO0FBQ0U7QUFDQSxNQUFJLElBQUksSUFBSSxjQUFKLEVBQVI7QUFDQSxPQUFLLEdBQUwsQ0FBUyxDQUFULEVBSEYsQ0FHZTs7QUFFYixJQUFFLFFBQUYsQ0FBWSxDQUFaOztBQUVBLE1BQUksZ0JBQWdCLEVBQUUsZ0JBQUYsRUFBcEI7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLE1BQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxjQUFjLEdBQTFCLENBQVg7QUFDQSxNQUFJLFNBQVMsS0FBSyxNQUFsQjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFwQixFQUE0QixHQUE1QixFQUFpQztBQUMvQixRQUFJLElBQUksY0FBYyxHQUFkLENBQWtCLEtBQUssQ0FBTCxDQUFsQixDQUFSO0FBQ0EsUUFBRyxLQUFLLENBQVIsRUFDQTtBQUNFLFdBQUssR0FBTCxDQUFVLElBQUksY0FBSixFQUFWLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DO0FBQ0Q7QUFDRjs7QUFFRCxJQUFFLFNBQUYsQ0FBWSxFQUFFLFNBQUYsRUFBWjs7QUFFQTtBQUNBLE9BQUssTUFBTCxDQUFZLENBQVo7O0FBRUE7QUFDQTtBQUNBLE1BQUcsS0FBSyxJQUFSLEVBQ0E7QUFDRSxNQUFFLFFBQUYsQ0FBVyxDQUFYO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJLFFBQUksZ0JBQWdCLEVBQUUsZ0JBQUYsRUFBcEI7QUFDQSxRQUFJLE9BQU8sT0FBTyxJQUFQLENBQVksY0FBYyxHQUExQixDQUFYO0FBQ0EsUUFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsVUFBSSxJQUFJLGNBQWMsR0FBZCxDQUFrQixLQUFLLENBQUwsQ0FBbEIsQ0FBUjtBQUNBLFVBQUcsS0FBSyxDQUFSLEVBQ0E7QUFDRSxhQUFLLEdBQUwsQ0FBVSxJQUFJLGNBQUosRUFBVixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQztBQUNEO0FBQ0Y7QUFDRCxNQUFFLFNBQUYsQ0FBWSxFQUFFLFNBQUYsS0FBZ0IsRUFBRSxTQUFGLEVBQTVCOztBQUVBO0FBQ0EsU0FBSyxNQUFMLENBQVksQ0FBWjtBQUNEOztBQUVEO0FBQ0EsSUFBRSxVQUFGLENBQWMsSUFBZDtBQUNELENBOUREOztBQWdFQSxPQUFPLE9BQVAsR0FBaUIsZUFBakI7Ozs7O0FDdkpBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBZDs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsRUFBNEIsS0FBNUIsRUFBbUM7QUFDakMsTUFBRyxNQUFNLElBQU4sSUFBYyxTQUFTLElBQTFCLEVBQStCO0FBQzdCLFVBQU0sSUFBTixDQUFXLElBQVgsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkI7QUFDRCxHQUZELE1BR0s7QUFDSCxVQUFNLElBQU4sQ0FBVyxJQUFYLEVBQWlCLEVBQWpCLEVBQXFCLEtBQXJCO0FBQ0Q7QUFDRCxPQUFLLE1BQUwsR0FBYyxDQUFkO0FBQ0Q7O0FBRUQsZUFBZSxTQUFmLEdBQTJCLE9BQU8sTUFBUCxDQUFjLE1BQU0sU0FBcEIsQ0FBM0I7QUFDQSxLQUFLLElBQUksSUFBVCxJQUFpQixLQUFqQixFQUF3QjtBQUN0QixpQkFBZSxJQUFmLElBQXVCLE1BQU0sSUFBTixDQUF2QjtBQUNEOztBQUVELGVBQWUsU0FBZixDQUF5QixVQUF6QixHQUFzQyxVQUFTLE9BQVQsRUFDdEM7QUFDRSxPQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0QsQ0FIRDs7QUFLQSxlQUFlLFNBQWYsQ0FBeUIsU0FBekIsR0FBcUMsWUFDckM7QUFDRSxTQUFPLEtBQUssT0FBWjtBQUNELENBSEQ7O0FBS0EsZUFBZSxTQUFmLENBQXlCLFNBQXpCLEdBQXFDLFlBQ3JDO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLGVBQWUsU0FBZixDQUF5QixTQUF6QixHQUFxQyxVQUFTLE1BQVQsRUFDckM7QUFDRSxPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0QsQ0FIRDs7QUFLQSxlQUFlLFNBQWYsQ0FBeUIsUUFBekIsR0FBb0MsWUFDcEM7QUFDRSxTQUFPLEtBQUssS0FBWjtBQUNELENBSEQ7O0FBS0EsZUFBZSxTQUFmLENBQXlCLFFBQXpCLEdBQW9DLFVBQVMsS0FBVCxFQUNwQztBQUNFLE9BQUssS0FBTCxHQUFhLEtBQWI7QUFDRCxDQUhEOztBQUtBLGVBQWUsU0FBZixDQUF5QixRQUF6QixHQUFvQyxZQUNwQztBQUNFLFNBQU8sS0FBSyxLQUFaO0FBQ0QsQ0FIRDs7QUFLQSxlQUFlLFNBQWYsQ0FBeUIsUUFBekIsR0FBb0MsVUFBUyxLQUFULEVBQ3BDO0FBQ0UsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNELENBSEQ7O0FBS0EsZUFBZSxTQUFmLENBQXlCLFlBQXpCLEdBQXdDLFlBQ3hDO0FBQ0UsU0FBTyxLQUFLLFNBQVo7QUFDRCxDQUhEOztBQUtBLGVBQWUsU0FBZixDQUF5QixZQUF6QixHQUF3QyxVQUFTLFNBQVQsRUFDeEM7QUFDRSxPQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDRCxDQUhEOztBQUtBOzs7O0FBSUEsZUFBZSxTQUFmLENBQXlCLFdBQXpCLEdBQXVDLFlBQ3ZDO0FBQ0UsTUFBSSxjQUFjLElBQWxCO0FBQ0EsTUFBSSxZQUFZLFFBQVEsU0FBeEI7O0FBRUEsTUFBSSxnQkFBZ0IsS0FBSyxnQkFBTCxFQUFwQjs7QUFFQSxNQUFJLE9BQU8sT0FBTyxJQUFQLENBQVksY0FBYyxHQUExQixDQUFYO0FBQ0EsTUFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDbkM7QUFDSSxRQUFJLElBQUksY0FBYyxHQUFkLENBQWtCLEtBQUssQ0FBTCxDQUFsQixDQUFSOztBQUVBLFFBQUksQ0FBQyxFQUFFLFNBQUYsRUFBRixJQUFxQixLQUFLLElBQTFCLElBQW9DLEVBQUUsU0FBRixLQUFnQixTQUF2RCxFQUNBO0FBQ0Usb0JBQWMsQ0FBZDtBQUNBLGtCQUFZLEVBQUUsU0FBRixFQUFaO0FBQ0Q7QUFDRjtBQUNELFNBQU8sV0FBUDtBQUNELENBcEJEOztBQXNCQSxPQUFPLE9BQVAsR0FBaUIsY0FBakI7Ozs7O0FDOUZBLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQztBQUNqQyxPQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsT0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLE1BQUksVUFBVSxJQUFWLElBQWtCLFdBQVcsSUFBakMsRUFBdUM7QUFDckMsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDRDtBQUNGOztBQUVELFdBQVcsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxZQUNoQztBQUNFLFNBQU8sS0FBSyxLQUFaO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsUUFBckIsR0FBZ0MsVUFBVSxLQUFWLEVBQ2hDO0FBQ0UsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLFNBQXJCLEdBQWlDLFlBQ2pDO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixTQUFyQixHQUFpQyxVQUFVLE1BQVYsRUFDakM7QUFDRSxPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDN0JBLFNBQVMsT0FBVCxHQUFrQjtBQUNoQixPQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7QUFFRCxJQUFJLElBQUksUUFBUSxTQUFoQjs7QUFFQSxFQUFFLFdBQUYsR0FBZ0IsVUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCO0FBQ3pDLE9BQUssU0FBTCxDQUFlLElBQWYsQ0FBb0I7QUFDbEIsV0FBTyxLQURXO0FBRWxCLGNBQVU7QUFGUSxHQUFwQjtBQUlELENBTEQ7O0FBT0EsRUFBRSxjQUFGLEdBQW1CLFVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQjtBQUM1QyxPQUFLLElBQUksSUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUE1QixFQUFvQyxLQUFLLENBQXpDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQy9DLFFBQUksSUFBSSxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQVI7O0FBRUEsUUFBSSxFQUFFLEtBQUYsS0FBWSxLQUFaLElBQXFCLEVBQUUsUUFBRixLQUFlLFFBQXhDLEVBQWtEO0FBQ2hELFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUI7QUFDRDtBQUNGO0FBQ0YsQ0FSRDs7QUFVQSxFQUFFLElBQUYsR0FBUyxVQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUI7QUFDOUIsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLE1BQW5DLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLFFBQUksSUFBSSxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQVI7O0FBRUEsUUFBSSxVQUFVLEVBQUUsS0FBaEIsRUFBdUI7QUFDckIsUUFBRSxRQUFGLENBQVksSUFBWjtBQUNEO0FBQ0Y7QUFDRixDQVJEOztBQVVBLE9BQU8sT0FBUCxHQUFpQixPQUFqQjs7Ozs7OztBQ2pDQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7QUFDQSxJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXhCO0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0QjtBQUNBLElBQUksWUFBWSxRQUFRLGFBQVIsQ0FBaEI7QUFDQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7O0FBRUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCLFNBQU8sSUFBUCxDQUFZLElBQVo7O0FBRUEsT0FBSyxrQ0FBTCxHQUEwQyxrQkFBa0IsK0NBQTVEO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLGtCQUFrQixtQkFBekM7QUFDQSxPQUFLLGNBQUwsR0FBc0Isa0JBQWtCLHVCQUF4QztBQUNBLE9BQUssaUJBQUwsR0FBeUIsa0JBQWtCLDBCQUEzQztBQUNBLE9BQUssZUFBTCxHQUF1QixrQkFBa0Isd0JBQXpDO0FBQ0EsT0FBSyx1QkFBTCxHQUErQixrQkFBa0IsaUNBQWpEO0FBQ0EsT0FBSyxrQkFBTCxHQUEwQixrQkFBa0IsNEJBQTVDO0FBQ0EsT0FBSywwQkFBTCxHQUFrQyxrQkFBa0IscUNBQXBEO0FBQ0EsT0FBSyw0QkFBTCxHQUFxQyxNQUFNLGtCQUFrQixtQkFBekIsR0FBZ0QsR0FBcEY7QUFDQSxPQUFLLGFBQUwsR0FBcUIsa0JBQWtCLGtDQUF2QztBQUNBLE9BQUssb0JBQUwsR0FBNEIsa0JBQWtCLGtDQUE5QztBQUNBLE9BQUssaUJBQUwsR0FBeUIsR0FBekI7QUFDQSxPQUFLLG9CQUFMLEdBQTRCLEdBQTVCO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLGtCQUFrQixjQUF2QztBQUNEOztBQUVELFNBQVMsU0FBVCxHQUFxQixPQUFPLE1BQVAsQ0FBYyxPQUFPLFNBQXJCLENBQXJCOztBQUVBLEtBQUssSUFBSSxJQUFULElBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLFdBQVMsSUFBVCxJQUFpQixPQUFPLElBQVAsQ0FBakI7QUFDRDs7QUFFRCxTQUFTLFNBQVQsQ0FBbUIsY0FBbkIsR0FBb0MsWUFBWTtBQUM5QyxTQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsSUFBckMsRUFBMkMsU0FBM0M7O0FBRUEsTUFBSSxLQUFLLGFBQUwsSUFBc0IsZ0JBQWdCLGFBQTFDLEVBQ0E7QUFDRSxTQUFLLDRCQUFMLElBQXFDLElBQXJDO0FBQ0EsU0FBSyxhQUFMLElBQXNCLEdBQXRCO0FBQ0QsR0FKRCxNQUtLLElBQUksS0FBSyxhQUFMLElBQXNCLGdCQUFnQixhQUExQyxFQUNMO0FBQ0UsU0FBSyw0QkFBTCxJQUFxQyxJQUFyQztBQUNBLFNBQUssYUFBTCxJQUFzQixHQUF0QjtBQUNEOztBQUVELE9BQUssZUFBTCxHQUF1QixDQUF2QjtBQUNBLE9BQUsscUJBQUwsR0FBNkIsQ0FBN0I7O0FBRUEsT0FBSyxnQkFBTCxHQUF3QixrQkFBa0IsNkNBQTFDOztBQUVBLE9BQUssSUFBTCxHQUFZLEVBQVo7QUFDQTtBQUNBLE9BQUssY0FBTCxHQUFzQixFQUF0QjtBQUNBLE9BQUssa0JBQUwsR0FBMEIsQ0FBMUI7QUFDQSxPQUFLLHFCQUFMLEdBQTZCLENBQTdCO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLEtBQXJCO0FBQ0EsT0FBSyxnQkFBTCxHQUF3QixLQUF4QjtBQUNELENBMUJEOztBQTRCQSxTQUFTLFNBQVQsQ0FBbUIsb0JBQW5CLEdBQTBDLFlBQVk7QUFDcEQsTUFBSSxJQUFKO0FBQ0EsTUFBSSxRQUFKO0FBQ0EsTUFBSSxNQUFKO0FBQ0EsTUFBSSxNQUFKO0FBQ0EsTUFBSSxpQkFBSjtBQUNBLE1BQUksaUJBQUo7O0FBRUEsTUFBSSxXQUFXLEtBQUssZUFBTCxHQUF1QixXQUF2QixFQUFmO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFDQTtBQUNFLFdBQU8sU0FBUyxDQUFULENBQVA7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLEtBQUssZUFBeEI7O0FBRUEsUUFBSSxLQUFLLFlBQVQsRUFDQTtBQUNFLGVBQVMsS0FBSyxTQUFMLEVBQVQ7QUFDQSxlQUFTLEtBQUssU0FBTCxFQUFUOztBQUVBLDBCQUFvQixLQUFLLGNBQUwsR0FBc0IsZ0JBQXRCLEVBQXBCO0FBQ0EsMEJBQW9CLEtBQUssY0FBTCxHQUFzQixnQkFBdEIsRUFBcEI7O0FBRUEsVUFBSSxLQUFLLGtDQUFULEVBQ0E7QUFDRSxhQUFLLFdBQUwsSUFBb0Isb0JBQW9CLGlCQUFwQixHQUNaLElBQUksZ0JBQWdCLGdCQUQ1QjtBQUVEOztBQUVELGlCQUFXLEtBQUssTUFBTCxHQUFjLHFCQUFkLEVBQVg7O0FBRUEsV0FBSyxXQUFMLElBQW9CLGtCQUFrQixtQkFBbEIsR0FDWixrQkFBa0Isa0NBRE4sSUFFWCxPQUFPLHFCQUFQLEtBQ08sT0FBTyxxQkFBUCxFQURQLEdBQ3dDLElBQUksUUFIakMsQ0FBcEI7QUFJRDtBQUNGO0FBQ0YsQ0FyQ0Q7O0FBdUNBLFNBQVMsU0FBVCxDQUFtQixrQkFBbkIsR0FBd0MsWUFBWTs7QUFFbEQsTUFBSSxLQUFLLFdBQVQsRUFDQTtBQUNFLFNBQUssbUJBQUwsR0FDUSxrQkFBa0IsaUNBRDFCO0FBRUQsR0FKRCxNQU1BO0FBQ0UsU0FBSyxhQUFMLEdBQXFCLEdBQXJCO0FBQ0EsU0FBSyxvQkFBTCxHQUE0QixHQUE1QjtBQUNBLFNBQUssbUJBQUwsR0FDUSxrQkFBa0IscUJBRDFCO0FBRUQ7O0FBRUQsT0FBSyxhQUFMLEdBQ1EsS0FBSyxHQUFMLENBQVMsS0FBSyxXQUFMLEdBQW1CLE1BQW5CLEdBQTRCLENBQXJDLEVBQXdDLEtBQUssYUFBN0MsQ0FEUjs7QUFHQSxPQUFLLDBCQUFMLEdBQ1EsS0FBSyw0QkFBTCxHQUFvQyxLQUFLLFdBQUwsR0FBbUIsTUFEL0Q7O0FBR0EsT0FBSyxjQUFMLEdBQXNCLEtBQUssa0JBQUwsRUFBdEI7QUFDRCxDQXRCRDs7QUF3QkEsU0FBUyxTQUFULENBQW1CLGdCQUFuQixHQUFzQyxZQUFZO0FBQ2hELE1BQUksU0FBUyxLQUFLLFdBQUwsRUFBYjtBQUNBLE1BQUksSUFBSjtBQUNBLE1BQUksWUFBWSxFQUFoQjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxHQUFuQyxFQUNBO0FBQ0UsV0FBTyxPQUFPLENBQVAsQ0FBUDs7QUFFQSxjQUFVLENBQVYsSUFBZSxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsS0FBSyxXQUFoQyxDQUFmO0FBQ0Q7QUFDRCxTQUFPLFNBQVA7QUFDRCxDQVpEOztBQWNBLFNBQVMsU0FBVCxDQUFtQixtQkFBbkIsR0FBeUMsWUFBWTtBQUNuRCxNQUFJLENBQUosRUFBTyxDQUFQO0FBQ0EsTUFBSSxLQUFKLEVBQVcsS0FBWDtBQUNBLE1BQUksU0FBUyxLQUFLLFdBQUwsRUFBYjtBQUNBLE1BQUksZ0JBQUo7O0FBRUEsTUFBSSxLQUFLLGdCQUFULEVBQ0E7QUFDRSxRQUFLLEtBQUssZUFBTCxHQUF1QixrQkFBa0IsNkJBQXpDLElBQTBFLENBQTFFLElBQStFLENBQUMsS0FBSyxhQUFyRixJQUFzRyxDQUFDLEtBQUssZ0JBQWpILEVBQ0E7QUFDRSxXQUFLLFVBQUw7QUFDRDs7QUFFRCx1QkFBbUIsSUFBSSxHQUFKLEVBQW5COztBQUVBO0FBQ0EsU0FBSyxJQUFJLENBQVQsRUFBWSxJQUFJLE9BQU8sTUFBdkIsRUFBK0IsR0FBL0IsRUFDQTtBQUNFLGNBQVEsT0FBTyxDQUFQLENBQVI7QUFDQSxXQUFLLDhCQUFMLENBQW9DLEtBQXBDLEVBQTJDLGdCQUEzQztBQUNBLHVCQUFpQixHQUFqQixDQUFxQixLQUFyQjtBQUNEO0FBQ0YsR0FoQkQsTUFrQkE7QUFDRSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksT0FBTyxNQUF2QixFQUErQixHQUEvQixFQUNBO0FBQ0UsY0FBUSxPQUFPLENBQVAsQ0FBUjs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxHQUFuQyxFQUNBO0FBQ0UsZ0JBQVEsT0FBTyxDQUFQLENBQVI7O0FBRUE7QUFDQSxZQUFJLE1BQU0sUUFBTixNQUFvQixNQUFNLFFBQU4sRUFBeEIsRUFDQTtBQUNFO0FBQ0Q7O0FBRUQsYUFBSyxrQkFBTCxDQUF3QixLQUF4QixFQUErQixLQUEvQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLENBM0NEOztBQTZDQSxTQUFTLFNBQVQsQ0FBbUIsdUJBQW5CLEdBQTZDLFlBQVk7QUFDdkQsTUFBSSxJQUFKO0FBQ0EsTUFBSSxTQUFTLEtBQUssNkJBQUwsRUFBYjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxHQUFuQyxFQUNBO0FBQ0UsV0FBTyxPQUFPLENBQVAsQ0FBUDtBQUNBLFNBQUssc0JBQUwsQ0FBNEIsSUFBNUI7QUFDRDtBQUNGLENBVEQ7O0FBV0EsU0FBUyxTQUFULENBQW1CLFNBQW5CLEdBQStCLFlBQVk7QUFDekMsTUFBSSxTQUFTLEtBQUssV0FBTCxFQUFiO0FBQ0EsTUFBSSxJQUFKO0FBQ0EsTUFBSSxZQUFZLEVBQWhCO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQU8sTUFBM0IsRUFBbUMsR0FBbkMsRUFDQTtBQUNFLFdBQU8sT0FBTyxDQUFQLENBQVA7QUFDQSxjQUFVLENBQVYsSUFBZSxLQUFLLElBQUwsRUFBZjtBQUNEO0FBQ0QsU0FBTyxTQUFQO0FBQ0QsQ0FWRDs7QUFZQSxTQUFTLFNBQVQsQ0FBbUIsZUFBbkIsR0FBcUMsVUFBVSxJQUFWLEVBQWdCLFdBQWhCLEVBQTZCO0FBQ2hFLE1BQUksYUFBYSxLQUFLLFNBQUwsRUFBakI7QUFDQSxNQUFJLGFBQWEsS0FBSyxTQUFMLEVBQWpCOztBQUVBLE1BQUksTUFBSjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksV0FBSjtBQUNBLE1BQUksWUFBSjtBQUNBLE1BQUksWUFBSjs7QUFFQTtBQUNBLE1BQUksS0FBSyxvQkFBTCxJQUNJLFdBQVcsUUFBWCxNQUF5QixJQUQ3QixJQUNxQyxXQUFXLFFBQVgsTUFBeUIsSUFEbEUsRUFFQTtBQUNFLFNBQUssa0JBQUw7QUFDRCxHQUpELE1BTUE7QUFDRSxTQUFLLFlBQUw7O0FBRUEsUUFBSSxLQUFLLDJCQUFULEVBQ0E7QUFDRTtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxLQUFLLFNBQUwsRUFBVDtBQUNBLFlBQVUsS0FBSyxPQUFmO0FBQ0EsWUFBVSxLQUFLLE9BQWY7O0FBRUE7QUFDQSxnQkFBYyxLQUFLLGNBQUwsSUFBdUIsU0FBUyxXQUFoQyxDQUFkOztBQUVBO0FBQ0EsaUJBQWUsZUFBZSxLQUFLLE9BQUwsR0FBZSxNQUE5QixDQUFmO0FBQ0EsaUJBQWUsZUFBZSxLQUFLLE9BQUwsR0FBZSxNQUE5QixDQUFmOztBQUVBO0FBQ0EsYUFBVyxZQUFYLElBQTJCLFlBQTNCO0FBQ0EsYUFBVyxZQUFYLElBQTJCLFlBQTNCO0FBQ0EsYUFBVyxZQUFYLElBQTJCLFlBQTNCO0FBQ0EsYUFBVyxZQUFYLElBQTJCLFlBQTNCOztBQUVBLE1BQUksV0FBVztBQUNiLFlBQVEsVUFESztBQUViLFlBQVEsVUFGSztBQUdiLFlBQVEsTUFISztBQUliLGFBQVMsT0FKSTtBQUtiLGFBQVM7QUFMSSxHQUFmOztBQVFBLFNBQU8sUUFBUDtBQUNELENBckREOztBQXVEQSxTQUFTLFNBQVQsQ0FBbUIsa0JBQW5CLEdBQXdDLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUM5RCxNQUFJLFFBQVEsTUFBTSxPQUFOLEVBQVo7QUFDQSxNQUFJLFFBQVEsTUFBTSxPQUFOLEVBQVo7QUFDQSxNQUFJLGdCQUFnQixJQUFJLEtBQUosQ0FBVSxDQUFWLENBQXBCO0FBQ0EsTUFBSSxhQUFhLElBQUksS0FBSixDQUFVLENBQVYsQ0FBakI7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLGVBQUo7QUFDQSxNQUFJLFFBQUo7QUFDQSxNQUFJLGNBQUo7QUFDQSxNQUFJLGVBQUo7QUFDQSxNQUFJLGVBQUo7O0FBRUEsTUFBSSxNQUFNLFVBQU4sQ0FBaUIsS0FBakIsQ0FBSixFQUE0QjtBQUM1QjtBQUNFO0FBQ0EsZ0JBQVUsb0JBQVYsQ0FBK0IsS0FBL0IsRUFDUSxLQURSLEVBRVEsYUFGUixFQUdRLGtCQUFrQixtQkFBbEIsR0FBd0MsR0FIaEQ7O0FBS0Esd0JBQWtCLElBQUksY0FBYyxDQUFkLENBQXRCO0FBQ0Esd0JBQWtCLElBQUksY0FBYyxDQUFkLENBQXRCOztBQUVBLFVBQUksbUJBQW1CLE1BQU0sWUFBTixHQUFxQixNQUFNLFlBQTNCLElBQTJDLE1BQU0sWUFBTixHQUFxQixNQUFNLFlBQXRFLENBQXZCOztBQUVBO0FBQ0EsWUFBTSxlQUFOLElBQXlCLG1CQUFtQixlQUE1QztBQUNBLFlBQU0sZUFBTixJQUF5QixtQkFBbUIsZUFBNUM7QUFDQSxZQUFNLGVBQU4sSUFBeUIsbUJBQW1CLGVBQTVDO0FBQ0EsWUFBTSxlQUFOLElBQXlCLG1CQUFtQixlQUE1QztBQUNELEtBbEJELE1BbUJJO0FBQ0o7QUFDRTs7QUFFQSxVQUFJLEtBQUssb0JBQUwsSUFDSSxNQUFNLFFBQU4sTUFBb0IsSUFEeEIsSUFDZ0MsTUFBTSxRQUFOLE1BQW9CLElBRHhELEVBQzZEO0FBQzdEO0FBQ0Usc0JBQVksTUFBTSxVQUFOLEtBQXFCLE1BQU0sVUFBTixFQUFqQztBQUNBLHNCQUFZLE1BQU0sVUFBTixLQUFxQixNQUFNLFVBQU4sRUFBakM7QUFDRCxTQUxELE1BTUk7QUFDSjtBQUNFLG9CQUFVLGVBQVYsQ0FBMEIsS0FBMUIsRUFBaUMsS0FBakMsRUFBd0MsVUFBeEM7O0FBRUEsc0JBQVksV0FBVyxDQUFYLElBQWdCLFdBQVcsQ0FBWCxDQUE1QjtBQUNBLHNCQUFZLFdBQVcsQ0FBWCxJQUFnQixXQUFXLENBQVgsQ0FBNUI7QUFDRDs7QUFFRDtBQUNBLFVBQUksS0FBSyxHQUFMLENBQVMsU0FBVCxJQUFzQixrQkFBa0Isa0JBQTVDLEVBQ0E7QUFDRSxvQkFBWSxNQUFNLElBQU4sQ0FBVyxTQUFYLElBQ0osa0JBQWtCLGtCQUQxQjtBQUVEOztBQUVELFVBQUksS0FBSyxHQUFMLENBQVMsU0FBVCxJQUFzQixrQkFBa0Isa0JBQTVDLEVBQ0E7QUFDRSxvQkFBWSxNQUFNLElBQU4sQ0FBVyxTQUFYLElBQ0osa0JBQWtCLGtCQUQxQjtBQUVEOztBQUVELHdCQUFrQixZQUFZLFNBQVosR0FBd0IsWUFBWSxTQUF0RDtBQUNBLGlCQUFXLEtBQUssSUFBTCxDQUFVLGVBQVYsQ0FBWDs7QUFFQSx1QkFBaUIsS0FBSyxpQkFBTCxHQUF5QixNQUFNLFlBQS9CLEdBQThDLE1BQU0sWUFBcEQsR0FBbUUsZUFBcEY7O0FBRUE7QUFDQSx3QkFBa0IsaUJBQWlCLFNBQWpCLEdBQTZCLFFBQS9DO0FBQ0Esd0JBQWtCLGlCQUFpQixTQUFqQixHQUE2QixRQUEvQzs7QUFFQTtBQUNBLFlBQU0sZUFBTixJQUF5QixlQUF6QjtBQUNBLFlBQU0sZUFBTixJQUF5QixlQUF6QjtBQUNBLFlBQU0sZUFBTixJQUF5QixlQUF6QjtBQUNBLFlBQU0sZUFBTixJQUF5QixlQUF6QjtBQUNEO0FBQ0YsQ0E5RUQ7O0FBZ0ZBLFNBQVMsU0FBVCxDQUFtQixzQkFBbkIsR0FBNEMsVUFBVSxJQUFWLEVBQWdCO0FBQzFELE1BQUksVUFBSjtBQUNBLE1BQUksWUFBSjtBQUNBLE1BQUksWUFBSjtBQUNBLE1BQUksU0FBSjtBQUNBLE1BQUksU0FBSjtBQUNBLE1BQUksWUFBSjtBQUNBLE1BQUksWUFBSjtBQUNBLE1BQUksYUFBSjtBQUNBLGVBQWEsS0FBSyxRQUFMLEVBQWI7O0FBRUEsaUJBQWUsQ0FBQyxXQUFXLFFBQVgsS0FBd0IsV0FBVyxPQUFYLEVBQXpCLElBQWlELENBQWhFO0FBQ0EsaUJBQWUsQ0FBQyxXQUFXLE1BQVgsS0FBc0IsV0FBVyxTQUFYLEVBQXZCLElBQWlELENBQWhFO0FBQ0EsY0FBWSxLQUFLLFVBQUwsS0FBb0IsWUFBaEM7QUFDQSxjQUFZLEtBQUssVUFBTCxLQUFvQixZQUFoQztBQUNBLGlCQUFlLEtBQUssR0FBTCxDQUFTLFNBQVQsSUFBc0IsS0FBSyxRQUFMLEtBQWtCLENBQXZEO0FBQ0EsaUJBQWUsS0FBSyxHQUFMLENBQVMsU0FBVCxJQUFzQixLQUFLLFNBQUwsS0FBbUIsQ0FBeEQ7O0FBRUEsTUFBSSxLQUFLLFFBQUwsTUFBbUIsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEVBQXZCLEVBQW1EO0FBQ25EO0FBQ0Usc0JBQWdCLFdBQVcsZ0JBQVgsS0FBZ0MsS0FBSyxrQkFBckQ7O0FBRUEsVUFBSSxlQUFlLGFBQWYsSUFBZ0MsZUFBZSxhQUFuRCxFQUNBO0FBQ0UsYUFBSyxpQkFBTCxHQUF5QixDQUFDLEtBQUssZUFBTixHQUF3QixTQUFqRDtBQUNBLGFBQUssaUJBQUwsR0FBeUIsQ0FBQyxLQUFLLGVBQU4sR0FBd0IsU0FBakQ7QUFDRDtBQUNGLEtBVEQsTUFVSTtBQUNKO0FBQ0Usc0JBQWdCLFdBQVcsZ0JBQVgsS0FBZ0MsS0FBSywwQkFBckQ7O0FBRUEsVUFBSSxlQUFlLGFBQWYsSUFBZ0MsZUFBZSxhQUFuRCxFQUNBO0FBQ0UsYUFBSyxpQkFBTCxHQUF5QixDQUFDLEtBQUssZUFBTixHQUF3QixTQUF4QixHQUNqQixLQUFLLHVCQURiO0FBRUEsYUFBSyxpQkFBTCxHQUF5QixDQUFDLEtBQUssZUFBTixHQUF3QixTQUF4QixHQUNqQixLQUFLLHVCQURiO0FBRUQ7QUFDRjtBQUNGLENBeENEOztBQTBDQSxTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsWUFBWTtBQUMzQyxNQUFJLFNBQUo7QUFDQSxNQUFJLGFBQWEsS0FBakI7O0FBRUEsTUFBSSxLQUFLLGVBQUwsR0FBdUIsS0FBSyxhQUFMLEdBQXFCLENBQWhELEVBQ0E7QUFDRSxpQkFDUSxLQUFLLEdBQUwsQ0FBUyxLQUFLLGlCQUFMLEdBQXlCLEtBQUssb0JBQXZDLElBQStELENBRHZFO0FBRUQ7O0FBRUQsY0FBWSxLQUFLLGlCQUFMLEdBQXlCLEtBQUssMEJBQTFDOztBQUVBLE9BQUssb0JBQUwsR0FBNEIsS0FBSyxpQkFBakM7O0FBRUEsU0FBTyxhQUFhLFVBQXBCO0FBQ0QsQ0FmRDs7QUFpQkEsU0FBUyxTQUFULENBQW1CLE9BQW5CLEdBQTZCLFlBQVk7QUFDdkMsTUFBSSxLQUFLLHFCQUFMLElBQThCLENBQUMsS0FBSyxXQUF4QyxFQUNBO0FBQ0UsUUFBSSxLQUFLLHFCQUFMLElBQThCLEtBQUssZUFBdkMsRUFDQTtBQUNFLFdBQUssTUFBTDtBQUNBLFdBQUsscUJBQUwsR0FBNkIsQ0FBN0I7QUFDRCxLQUpELE1BTUE7QUFDRSxXQUFLLHFCQUFMO0FBQ0Q7QUFDRjtBQUNGLENBYkQ7O0FBZUE7QUFDQTtBQUNBOztBQUVBLFNBQVMsU0FBVCxDQUFtQixRQUFuQixHQUE4QixVQUFVLEtBQVYsRUFBZ0I7O0FBRTVDLE1BQUksUUFBUSxDQUFaO0FBQ0EsTUFBSSxRQUFRLENBQVo7O0FBRUEsVUFBUSxTQUFTLEtBQUssSUFBTCxDQUFVLENBQUMsTUFBTSxRQUFOLEtBQW1CLE1BQU0sT0FBTixFQUFwQixJQUF1QyxLQUFLLGNBQXRELENBQVQsQ0FBUjtBQUNBLFVBQVEsU0FBUyxLQUFLLElBQUwsQ0FBVSxDQUFDLE1BQU0sU0FBTixLQUFvQixNQUFNLE1BQU4sRUFBckIsSUFBdUMsS0FBSyxjQUF0RCxDQUFULENBQVI7O0FBRUEsTUFBSSxPQUFPLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBWDs7QUFFQSxPQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxLQUFuQixFQUEwQixHQUExQixFQUE4QjtBQUM1QixTQUFLLENBQUwsSUFBVSxJQUFJLEtBQUosQ0FBVSxLQUFWLENBQVY7QUFDRDs7QUFFRCxPQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxLQUFuQixFQUEwQixHQUExQixFQUE4QjtBQUM1QixTQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxLQUFuQixFQUEwQixHQUExQixFQUE4QjtBQUM1QixXQUFLLENBQUwsRUFBUSxDQUFSLElBQWEsSUFBSSxLQUFKLEVBQWI7QUFDRDtBQUNGOztBQUVELFNBQU8sSUFBUDtBQUNELENBckJEOztBQXVCQSxTQUFTLFNBQVQsQ0FBbUIsYUFBbkIsR0FBbUMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFtQixHQUFuQixFQUF1Qjs7QUFFeEQsTUFBSSxTQUFTLENBQWI7QUFDQSxNQUFJLFVBQVUsQ0FBZDtBQUNBLE1BQUksU0FBUyxDQUFiO0FBQ0EsTUFBSSxVQUFVLENBQWQ7O0FBRUEsV0FBUyxTQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsRUFBRSxPQUFGLEdBQVksQ0FBWixHQUFnQixJQUFqQixJQUF5QixLQUFLLGNBQXpDLENBQVQsQ0FBVDtBQUNBLFlBQVUsU0FBUyxLQUFLLEtBQUwsQ0FBVyxDQUFDLEVBQUUsT0FBRixHQUFZLEtBQVosR0FBb0IsRUFBRSxPQUFGLEdBQVksQ0FBaEMsR0FBb0MsSUFBckMsSUFBNkMsS0FBSyxjQUE3RCxDQUFULENBQVY7QUFDQSxXQUFTLFNBQVMsS0FBSyxLQUFMLENBQVcsQ0FBQyxFQUFFLE9BQUYsR0FBWSxDQUFaLEdBQWdCLEdBQWpCLElBQXdCLEtBQUssY0FBeEMsQ0FBVCxDQUFUO0FBQ0EsWUFBVSxTQUFTLEtBQUssS0FBTCxDQUFXLENBQUMsRUFBRSxPQUFGLEdBQVksTUFBWixHQUFxQixFQUFFLE9BQUYsR0FBWSxDQUFqQyxHQUFxQyxHQUF0QyxJQUE2QyxLQUFLLGNBQTdELENBQVQsQ0FBVjs7QUFFQSxPQUFLLElBQUksSUFBSSxNQUFiLEVBQXFCLEtBQUssT0FBMUIsRUFBbUMsR0FBbkMsRUFDQTtBQUNFLFNBQUssSUFBSSxJQUFJLE1BQWIsRUFBcUIsS0FBSyxPQUExQixFQUFtQyxHQUFuQyxFQUNBO0FBQ0UsV0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FBcUIsQ0FBckI7QUFDQSxRQUFFLGtCQUFGLENBQXFCLE1BQXJCLEVBQTZCLE9BQTdCLEVBQXNDLE1BQXRDLEVBQThDLE9BQTlDO0FBQ0Q7QUFDRjtBQUVGLENBckJEOztBQXVCQSxTQUFTLFNBQVQsQ0FBbUIsVUFBbkIsR0FBZ0MsWUFBVztBQUN6QyxNQUFJLENBQUo7QUFDQSxNQUFJLEtBQUo7QUFDQSxNQUFJLFNBQVMsS0FBSyxXQUFMLEVBQWI7O0FBRUEsT0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEVBQWQsQ0FBWjs7QUFFQTtBQUNBLE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxPQUFPLE1BQXZCLEVBQStCLEdBQS9CLEVBQ0E7QUFDRSxZQUFRLE9BQU8sQ0FBUCxDQUFSO0FBQ0EsU0FBSyxhQUFMLENBQW1CLEtBQW5CLEVBQTBCLEtBQUssWUFBTCxDQUFrQixPQUFsQixHQUE0QixPQUE1QixFQUExQixFQUFpRSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsR0FBNEIsTUFBNUIsRUFBakU7QUFDRDtBQUVGLENBZEQ7O0FBZ0JBLFNBQVMsU0FBVCxDQUFtQiw4QkFBbkIsR0FBb0QsVUFBVSxLQUFWLEVBQWlCLGdCQUFqQixFQUFrQzs7QUFFcEYsTUFBSyxLQUFLLGVBQUwsR0FBdUIsa0JBQWtCLDZCQUF6QyxJQUEwRSxDQUExRSxJQUErRSxDQUFDLEtBQUssYUFBckYsSUFBc0csQ0FBQyxLQUFLLGdCQUE3RyxJQUFtSSxLQUFLLGtCQUFMLEdBQTBCLEVBQTFCLElBQWdDLENBQWhDLElBQXFDLEtBQUssYUFBN0ssSUFBZ00sS0FBSyxxQkFBTCxHQUE2QixFQUE3QixJQUFtQyxDQUFuQyxJQUF3QyxLQUFLLGdCQUFqUCxFQUNBO0FBQ0UsUUFBSSxjQUFjLElBQUksR0FBSixFQUFsQjtBQUNBLFVBQU0sV0FBTixHQUFvQixJQUFJLEtBQUosRUFBcEI7QUFDQSxRQUFJLEtBQUo7QUFDQSxRQUFJLE9BQU8sS0FBSyxJQUFoQjs7QUFFQSxTQUFLLElBQUksSUFBSyxNQUFNLE1BQU4sR0FBZSxDQUE3QixFQUFpQyxJQUFLLE1BQU0sT0FBTixHQUFnQixDQUF0RCxFQUEwRCxHQUExRCxFQUNBO0FBQ0UsV0FBSyxJQUFJLElBQUssTUFBTSxNQUFOLEdBQWUsQ0FBN0IsRUFBaUMsSUFBSyxNQUFNLE9BQU4sR0FBZ0IsQ0FBdEQsRUFBMEQsR0FBMUQsRUFDQTtBQUNFLFlBQUksRUFBRyxJQUFJLENBQUwsSUFBWSxJQUFJLENBQWhCLElBQXVCLEtBQUssS0FBSyxNQUFqQyxJQUE2QyxLQUFLLEtBQUssQ0FBTCxFQUFRLE1BQTVELENBQUosRUFDQTtBQUNFLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsTUFBL0IsRUFBdUMsR0FBdkMsRUFBNEM7QUFDMUMsb0JBQVEsS0FBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLENBQVgsQ0FBUjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQUssTUFBTSxRQUFOLE1BQW9CLE1BQU0sUUFBTixFQUFyQixJQUEyQyxTQUFTLEtBQXhELEVBQ0E7QUFDRTtBQUNEOztBQUVEO0FBQ0E7QUFDQSxnQkFBSSxDQUFDLGlCQUFpQixHQUFqQixDQUFxQixLQUFyQixDQUFELElBQWdDLENBQUMsWUFBWSxHQUFaLENBQWdCLEtBQWhCLENBQXJDLEVBQ0E7QUFDRSxrQkFBSSxZQUFZLEtBQUssR0FBTCxDQUFTLE1BQU0sVUFBTixLQUFtQixNQUFNLFVBQU4sRUFBNUIsS0FDUixNQUFNLFFBQU4sS0FBaUIsQ0FBbEIsR0FBd0IsTUFBTSxRQUFOLEtBQWlCLENBRGhDLENBQWhCO0FBRUEsa0JBQUksWUFBWSxLQUFLLEdBQUwsQ0FBUyxNQUFNLFVBQU4sS0FBbUIsTUFBTSxVQUFOLEVBQTVCLEtBQ1IsTUFBTSxTQUFOLEtBQWtCLENBQW5CLEdBQXlCLE1BQU0sU0FBTixLQUFrQixDQURsQyxDQUFoQjs7QUFHQTtBQUNBO0FBQ0Esa0JBQUssYUFBYSxLQUFLLGNBQW5CLElBQXVDLGFBQWEsS0FBSyxjQUE3RCxFQUNBO0FBQ0U7QUFDQSw0QkFBWSxHQUFaLENBQWdCLEtBQWhCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNGOztBQUVELFVBQU0sV0FBTixnQ0FBd0IsV0FBeEI7QUFFRDtBQUNELE9BQUssSUFBSSxDQUFULEVBQVksSUFBSSxNQUFNLFdBQU4sQ0FBa0IsTUFBbEMsRUFBMEMsR0FBMUMsRUFDQTtBQUNFLFNBQUssa0JBQUwsQ0FBd0IsS0FBeEIsRUFBK0IsTUFBTSxXQUFOLENBQWtCLENBQWxCLENBQS9CO0FBQ0Q7QUFDRixDQXRERDs7QUF3REEsU0FBUyxTQUFULENBQW1CLGtCQUFuQixHQUF3QyxZQUFZO0FBQ2xELFNBQU8sR0FBUDtBQUNELENBRkQ7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVQsQ0FBbUIsV0FBbkIsR0FBaUMsWUFDakM7QUFDRSxNQUFJLGlCQUFpQixFQUFyQjtBQUNBLE1BQUksZUFBZSxJQUFuQjtBQUNBLE1BQUksSUFBSjs7QUFFQSxTQUFNLFlBQU4sRUFBb0I7QUFDbEIsUUFBSSxXQUFXLEtBQUssWUFBTCxDQUFrQixXQUFsQixFQUFmO0FBQ0EsUUFBSSx3QkFBd0IsRUFBNUI7QUFDQSxtQkFBZSxLQUFmOztBQUVBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLGFBQU8sU0FBUyxDQUFULENBQVA7QUFDQSxVQUFHLEtBQUssUUFBTCxHQUFnQixNQUFoQixJQUEwQixDQUExQixJQUErQixDQUFDLEtBQUssUUFBTCxHQUFnQixDQUFoQixFQUFtQixZQUFuRCxJQUFtRSxLQUFLLFFBQUwsTUFBbUIsSUFBekYsRUFBOEY7QUFDNUYsOEJBQXNCLElBQXRCLENBQTJCLENBQUMsSUFBRCxFQUFPLEtBQUssUUFBTCxHQUFnQixDQUFoQixDQUFQLEVBQTJCLEtBQUssUUFBTCxFQUEzQixDQUEzQjtBQUNBLHVCQUFlLElBQWY7QUFDRDtBQUNGO0FBQ0QsUUFBRyxnQkFBZ0IsSUFBbkIsRUFBd0I7QUFDdEIsVUFBSSxvQkFBb0IsRUFBeEI7QUFDQSxXQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxzQkFBc0IsTUFBekMsRUFBaUQsR0FBakQsRUFBcUQ7QUFDbkQsWUFBRyxzQkFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsUUFBNUIsR0FBdUMsTUFBdkMsSUFBaUQsQ0FBcEQsRUFBc0Q7QUFDcEQsNEJBQWtCLElBQWxCLENBQXVCLHNCQUFzQixDQUF0QixDQUF2QjtBQUNBLGdDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixRQUE1QixHQUF1QyxNQUF2QyxDQUE4QyxzQkFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsQ0FBOUM7QUFDRDtBQUNGO0FBQ0QscUJBQWUsSUFBZixDQUFvQixpQkFBcEI7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsYUFBbEI7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsYUFBbEI7QUFDRDtBQUNGO0FBQ0QsT0FBSyxjQUFMLEdBQXNCLGNBQXRCO0FBQ0QsQ0FoQ0Q7O0FBa0NBO0FBQ0EsU0FBUyxTQUFULENBQW1CLFFBQW5CLEdBQThCLFVBQVMsY0FBVCxFQUM5QjtBQUNFLE1BQUksNEJBQTRCLGVBQWUsTUFBL0M7QUFDQSxNQUFJLG9CQUFvQixlQUFlLDRCQUE0QixDQUEzQyxDQUF4Qjs7QUFFQSxNQUFJLFFBQUo7QUFDQSxPQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxrQkFBa0IsTUFBckMsRUFBNkMsR0FBN0MsRUFBaUQ7QUFDL0MsZUFBVyxrQkFBa0IsQ0FBbEIsQ0FBWDs7QUFFQSxTQUFLLHNCQUFMLENBQTRCLFFBQTVCOztBQUVBLGFBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBZ0IsU0FBUyxDQUFULENBQWhCO0FBQ0EsYUFBUyxDQUFULEVBQVksR0FBWixDQUFnQixTQUFTLENBQVQsQ0FBaEIsRUFBNkIsU0FBUyxDQUFULEVBQVksTUFBekMsRUFBaUQsU0FBUyxDQUFULEVBQVksTUFBN0Q7QUFDRDs7QUFFRCxpQkFBZSxNQUFmLENBQXNCLGVBQWUsTUFBZixHQUFzQixDQUE1QyxFQUErQyxDQUEvQztBQUNBLE9BQUssWUFBTCxDQUFrQixhQUFsQjtBQUNBLE9BQUssWUFBTCxDQUFrQixhQUFsQjtBQUNELENBbEJEOztBQW9CQTtBQUNBLFNBQVMsU0FBVCxDQUFtQixzQkFBbkIsR0FBNEMsVUFBUyxRQUFULEVBQWtCOztBQUU1RCxNQUFJLGlCQUFKO0FBQ0EsTUFBSSxhQUFKO0FBQ0EsTUFBSSxhQUFhLFNBQVMsQ0FBVCxDQUFqQjtBQUNBLE1BQUcsY0FBYyxTQUFTLENBQVQsRUFBWSxNQUE3QixFQUFvQztBQUNsQyxvQkFBZ0IsU0FBUyxDQUFULEVBQVksTUFBNUI7QUFDRCxHQUZELE1BR0s7QUFDSCxvQkFBZ0IsU0FBUyxDQUFULEVBQVksTUFBNUI7QUFDRDtBQUNELE1BQUksYUFBYSxjQUFjLE1BQS9CO0FBQ0EsTUFBSSxjQUFjLGNBQWMsT0FBaEM7QUFDQSxNQUFJLGFBQWEsY0FBYyxNQUEvQjtBQUNBLE1BQUksY0FBYyxjQUFjLE9BQWhDOztBQUVBLE1BQUksY0FBYyxDQUFsQjtBQUNBLE1BQUksZ0JBQWdCLENBQXBCO0FBQ0EsTUFBSSxpQkFBaUIsQ0FBckI7QUFDQSxNQUFJLGdCQUFnQixDQUFwQjtBQUNBLE1BQUksaUJBQWlCLENBQUMsV0FBRCxFQUFjLGNBQWQsRUFBOEIsYUFBOUIsRUFBNkMsYUFBN0MsQ0FBckI7O0FBRUEsTUFBRyxhQUFhLENBQWhCLEVBQWtCO0FBQ2hCLFNBQUksSUFBSSxJQUFJLFVBQVosRUFBd0IsS0FBSyxXQUE3QixFQUEwQyxHQUExQyxFQUErQztBQUM3QyxxQkFBZSxDQUFmLEtBQXNCLEtBQUssSUFBTCxDQUFVLENBQVYsRUFBYSxhQUFhLENBQTFCLEVBQTZCLE1BQTdCLEdBQXNDLEtBQUssSUFBTCxDQUFVLENBQVYsRUFBYSxVQUFiLEVBQXlCLE1BQS9ELEdBQXdFLENBQTlGO0FBQ0Q7QUFDRjtBQUNELE1BQUcsY0FBYyxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQXBDLEVBQXNDO0FBQ3BDLFNBQUksSUFBSSxJQUFJLFVBQVosRUFBd0IsS0FBSyxXQUE3QixFQUEwQyxHQUExQyxFQUErQztBQUM3QyxxQkFBZSxDQUFmLEtBQXNCLEtBQUssSUFBTCxDQUFVLGNBQWMsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsTUFBOUIsR0FBdUMsS0FBSyxJQUFMLENBQVUsV0FBVixFQUF1QixDQUF2QixFQUEwQixNQUFqRSxHQUEwRSxDQUFoRztBQUNEO0FBQ0Y7QUFDRCxNQUFHLGNBQWMsS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLE1BQWIsR0FBc0IsQ0FBdkMsRUFBeUM7QUFDdkMsU0FBSSxJQUFJLElBQUksVUFBWixFQUF3QixLQUFLLFdBQTdCLEVBQTBDLEdBQTFDLEVBQStDO0FBQzdDLHFCQUFlLENBQWYsS0FBc0IsS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLGNBQWMsQ0FBM0IsRUFBOEIsTUFBOUIsR0FBdUMsS0FBSyxJQUFMLENBQVUsQ0FBVixFQUFhLFdBQWIsRUFBMEIsTUFBakUsR0FBMEUsQ0FBaEc7QUFDRDtBQUNGO0FBQ0QsTUFBRyxhQUFhLENBQWhCLEVBQWtCO0FBQ2hCLFNBQUksSUFBSSxJQUFJLFVBQVosRUFBd0IsS0FBSyxXQUE3QixFQUEwQyxHQUExQyxFQUErQztBQUM3QyxxQkFBZSxDQUFmLEtBQXNCLEtBQUssSUFBTCxDQUFVLGFBQWEsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsTUFBN0IsR0FBc0MsS0FBSyxJQUFMLENBQVUsVUFBVixFQUFzQixDQUF0QixFQUF5QixNQUEvRCxHQUF3RSxDQUE5RjtBQUNEO0FBQ0Y7QUFDRCxNQUFJLE1BQU0sUUFBUSxTQUFsQjtBQUNBLE1BQUksUUFBSjtBQUNBLE1BQUksUUFBSjtBQUNBLE9BQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLGVBQWUsTUFBbEMsRUFBMEMsR0FBMUMsRUFBOEM7QUFDNUMsUUFBRyxlQUFlLENBQWYsSUFBb0IsR0FBdkIsRUFBMkI7QUFDekIsWUFBTSxlQUFlLENBQWYsQ0FBTjtBQUNBLGlCQUFXLENBQVg7QUFDQSxpQkFBVyxDQUFYO0FBQ0QsS0FKRCxNQUtLLElBQUcsZUFBZSxDQUFmLEtBQXFCLEdBQXhCLEVBQTRCO0FBQy9CO0FBQ0Q7QUFDRjs7QUFFRCxNQUFHLFlBQVksQ0FBWixJQUFpQixPQUFPLENBQTNCLEVBQTZCO0FBQzNCLFFBQUcsZUFBZSxDQUFmLEtBQXFCLENBQXJCLElBQTBCLGVBQWUsQ0FBZixLQUFxQixDQUEvQyxJQUFvRCxlQUFlLENBQWYsS0FBcUIsQ0FBNUUsRUFBOEU7QUFDNUUsMEJBQW9CLENBQXBCO0FBQ0QsS0FGRCxNQUdLLElBQUcsZUFBZSxDQUFmLEtBQXFCLENBQXJCLElBQTBCLGVBQWUsQ0FBZixLQUFxQixDQUEvQyxJQUFvRCxlQUFlLENBQWYsS0FBcUIsQ0FBNUUsRUFBOEU7QUFDakYsMEJBQW9CLENBQXBCO0FBQ0QsS0FGSSxNQUdBLElBQUcsZUFBZSxDQUFmLEtBQXFCLENBQXJCLElBQTBCLGVBQWUsQ0FBZixLQUFxQixDQUEvQyxJQUFvRCxlQUFlLENBQWYsS0FBcUIsQ0FBNUUsRUFBOEU7QUFDakYsMEJBQW9CLENBQXBCO0FBQ0QsS0FGSSxNQUdBLElBQUcsZUFBZSxDQUFmLEtBQXFCLENBQXJCLElBQTBCLGVBQWUsQ0FBZixLQUFxQixDQUEvQyxJQUFvRCxlQUFlLENBQWYsS0FBcUIsQ0FBNUUsRUFBOEU7QUFDakYsMEJBQW9CLENBQXBCO0FBQ0Q7QUFDRixHQWJELE1BY0ssSUFBRyxZQUFZLENBQVosSUFBaUIsT0FBTyxDQUEzQixFQUE2QjtBQUNoQyxRQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLENBQTNCLENBQWI7QUFDQSxRQUFHLGVBQWUsQ0FBZixLQUFxQixDQUFyQixJQUEwQixlQUFlLENBQWYsS0FBcUIsQ0FBbEQsRUFBb0Q7QUFBQztBQUNuRCxVQUFHLFVBQVUsQ0FBYixFQUFlO0FBQ2IsNEJBQW9CLENBQXBCO0FBQ0QsT0FGRCxNQUdJO0FBQ0YsNEJBQW9CLENBQXBCO0FBQ0Q7QUFDRixLQVBELE1BUUssSUFBRyxlQUFlLENBQWYsS0FBcUIsQ0FBckIsSUFBMEIsZUFBZSxDQUFmLEtBQXFCLENBQWxELEVBQW9EO0FBQ3ZELFVBQUcsVUFBVSxDQUFiLEVBQWU7QUFDYiw0QkFBb0IsQ0FBcEI7QUFDRCxPQUZELE1BR0k7QUFDRiw0QkFBb0IsQ0FBcEI7QUFDRDtBQUNGLEtBUEksTUFRQSxJQUFHLGVBQWUsQ0FBZixLQUFxQixDQUFyQixJQUEwQixlQUFlLENBQWYsS0FBcUIsQ0FBbEQsRUFBb0Q7QUFDdkQsVUFBRyxVQUFVLENBQWIsRUFBZTtBQUNiLDRCQUFvQixDQUFwQjtBQUNELE9BRkQsTUFHSTtBQUNGLDRCQUFvQixDQUFwQjtBQUNEO0FBQ0YsS0FQSSxNQVFBLElBQUcsZUFBZSxDQUFmLEtBQXFCLENBQXJCLElBQTBCLGVBQWUsQ0FBZixLQUFxQixDQUFsRCxFQUFvRDtBQUN2RCxVQUFHLFVBQVUsQ0FBYixFQUFlO0FBQ2IsNEJBQW9CLENBQXBCO0FBQ0QsT0FGRCxNQUdJO0FBQ0YsNEJBQW9CLENBQXBCO0FBQ0Q7QUFDRixLQVBJLE1BUUEsSUFBRyxlQUFlLENBQWYsS0FBcUIsQ0FBckIsSUFBMEIsZUFBZSxDQUFmLEtBQXFCLENBQWxELEVBQW9EO0FBQ3ZELFVBQUcsVUFBVSxDQUFiLEVBQWU7QUFDYiw0QkFBb0IsQ0FBcEI7QUFDRCxPQUZELE1BR0k7QUFDRiw0QkFBb0IsQ0FBcEI7QUFDRDtBQUNGLEtBUEksTUFRQTtBQUNILFVBQUcsVUFBVSxDQUFiLEVBQWU7QUFDYiw0QkFBb0IsQ0FBcEI7QUFDRCxPQUZELE1BR0k7QUFDRiw0QkFBb0IsQ0FBcEI7QUFDRDtBQUNGO0FBQ0YsR0FsREksTUFtREEsSUFBRyxZQUFZLENBQVosSUFBaUIsT0FBTyxDQUEzQixFQUE2QjtBQUNoQyxRQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLENBQTNCLENBQWI7QUFDQSx3QkFBb0IsTUFBcEI7QUFDRCxHQUhJLE1BSUE7QUFDSCx3QkFBb0IsUUFBcEI7QUFDRDs7QUFFRCxNQUFHLHFCQUFxQixDQUF4QixFQUEyQjtBQUN6QixlQUFXLFNBQVgsQ0FBcUIsY0FBYyxVQUFkLEVBQXJCLEVBQ3FCLGNBQWMsVUFBZCxLQUE2QixjQUFjLFNBQWQsS0FBMEIsQ0FBdkQsR0FBMkQsa0JBQWtCLG1CQUE3RSxHQUFtRyxXQUFXLFNBQVgsS0FBdUIsQ0FEL0k7QUFFRCxHQUhELE1BSUssSUFBRyxxQkFBcUIsQ0FBeEIsRUFBMkI7QUFDOUIsZUFBVyxTQUFYLENBQXFCLGNBQWMsVUFBZCxLQUE2QixjQUFjLFFBQWQsS0FBeUIsQ0FBdEQsR0FBMEQsa0JBQWtCLG1CQUE1RSxHQUFrRyxXQUFXLFFBQVgsS0FBc0IsQ0FBN0ksRUFDcUIsY0FBYyxVQUFkLEVBRHJCO0FBRUQsR0FISSxNQUlBLElBQUcscUJBQXFCLENBQXhCLEVBQTJCO0FBQzlCLGVBQVcsU0FBWCxDQUFxQixjQUFjLFVBQWQsRUFBckIsRUFDcUIsY0FBYyxVQUFkLEtBQTZCLGNBQWMsU0FBZCxLQUEwQixDQUF2RCxHQUEyRCxrQkFBa0IsbUJBQTdFLEdBQW1HLFdBQVcsU0FBWCxLQUF1QixDQUQvSTtBQUVELEdBSEksTUFJQTtBQUNILGVBQVcsU0FBWCxDQUFxQixjQUFjLFVBQWQsS0FBNkIsY0FBYyxRQUFkLEtBQXlCLENBQXRELEdBQTBELGtCQUFrQixtQkFBNUUsR0FBa0csV0FBVyxRQUFYLEtBQXNCLENBQTdJLEVBQ3FCLGNBQWMsVUFBZCxFQURyQjtBQUVEO0FBRUYsQ0FsSkQ7O0FBb0pBLE9BQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7QUM1dUJBLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBdEI7O0FBRUEsU0FBUyxpQkFBVCxHQUE2QixDQUM1Qjs7QUFFRDtBQUNBLEtBQUssSUFBSSxJQUFULElBQWlCLGVBQWpCLEVBQWtDO0FBQ2hDLG9CQUFrQixJQUFsQixJQUEwQixnQkFBZ0IsSUFBaEIsQ0FBMUI7QUFDRDs7QUFFRCxrQkFBa0IsY0FBbEIsR0FBbUMsSUFBbkM7O0FBRUEsa0JBQWtCLG1CQUFsQixHQUF3QyxFQUF4QztBQUNBLGtCQUFrQix1QkFBbEIsR0FBNEMsSUFBNUM7QUFDQSxrQkFBa0IsMEJBQWxCLEdBQStDLE1BQS9DO0FBQ0Esa0JBQWtCLHdCQUFsQixHQUE2QyxHQUE3QztBQUNBLGtCQUFrQixpQ0FBbEIsR0FBc0QsR0FBdEQ7QUFDQSxrQkFBa0IsNEJBQWxCLEdBQWlELEdBQWpEO0FBQ0Esa0JBQWtCLHFDQUFsQixHQUEwRCxHQUExRDtBQUNBLGtCQUFrQiwrQ0FBbEIsR0FBb0UsSUFBcEU7QUFDQSxrQkFBa0IsNkNBQWxCLEdBQWtFLElBQWxFO0FBQ0Esa0JBQWtCLGtDQUFsQixHQUF1RCxHQUF2RDtBQUNBLGtCQUFrQixpQ0FBbEIsR0FBc0QsS0FBdEQ7QUFDQSxrQkFBa0IscUJBQWxCLEdBQTBDLGtCQUFrQixpQ0FBbEIsR0FBc0QsQ0FBaEc7QUFDQSxrQkFBa0Isa0JBQWxCLEdBQXVDLGtCQUFrQixtQkFBbEIsR0FBd0MsSUFBL0U7QUFDQSxrQkFBa0Isd0JBQWxCLEdBQTZDLEdBQTdDO0FBQ0Esa0JBQWtCLGtDQUFsQixHQUF1RCxHQUF2RDtBQUNBLGtCQUFrQixlQUFsQixHQUFvQyxDQUFwQztBQUNBLGtCQUFrQiw2QkFBbEIsR0FBa0QsRUFBbEQ7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQjs7Ozs7QUM5QkEsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxvQkFBb0IsUUFBUSxxQkFBUixDQUF4Qjs7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsS0FBdEMsRUFBNkM7QUFDM0MsUUFBTSxJQUFOLENBQVcsSUFBWCxFQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQyxLQUFqQztBQUNBLE9BQUssV0FBTCxHQUFtQixrQkFBa0IsbUJBQXJDO0FBQ0Q7O0FBRUQsYUFBYSxTQUFiLEdBQXlCLE9BQU8sTUFBUCxDQUFjLE1BQU0sU0FBcEIsQ0FBekI7O0FBRUEsS0FBSyxJQUFJLElBQVQsSUFBaUIsS0FBakIsRUFBd0I7QUFDdEIsZUFBYSxJQUFiLElBQXFCLE1BQU0sSUFBTixDQUFyQjtBQUNEOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQjs7Ozs7QUNkQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7O0FBRUEsU0FBUyxZQUFULENBQXNCLEVBQXRCLEVBQTBCLEdBQTFCLEVBQStCLElBQS9CLEVBQXFDLEtBQXJDLEVBQTRDO0FBQzFDO0FBQ0EsUUFBTSxJQUFOLENBQVcsSUFBWCxFQUFpQixFQUFqQixFQUFxQixHQUFyQixFQUEwQixJQUExQixFQUFnQyxLQUFoQztBQUNBO0FBQ0EsT0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsT0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsT0FBSyxpQkFBTCxHQUF5QixDQUF6QjtBQUNBLE9BQUssaUJBQUwsR0FBeUIsQ0FBekI7QUFDQTtBQUNBLE9BQUssYUFBTCxHQUFxQixDQUFyQjtBQUNBLE9BQUssYUFBTCxHQUFxQixDQUFyQjs7QUFFQTtBQUNBLE9BQUssTUFBTCxHQUFjLENBQWQ7QUFDQSxPQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0EsT0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLE9BQUssT0FBTCxHQUFlLENBQWY7O0FBRUE7QUFDQSxPQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDRDs7QUFFRCxhQUFhLFNBQWIsR0FBeUIsT0FBTyxNQUFQLENBQWMsTUFBTSxTQUFwQixDQUF6Qjs7QUFFQSxLQUFLLElBQUksSUFBVCxJQUFpQixLQUFqQixFQUF3QjtBQUN0QixlQUFhLElBQWIsSUFBcUIsTUFBTSxJQUFOLENBQXJCO0FBQ0Q7O0FBRUQsYUFBYSxTQUFiLENBQXVCLGtCQUF2QixHQUE0QyxVQUFVLE9BQVYsRUFBbUIsUUFBbkIsRUFBNkIsT0FBN0IsRUFBc0MsUUFBdEMsRUFDNUM7QUFDRSxPQUFLLE1BQUwsR0FBYyxPQUFkO0FBQ0EsT0FBSyxPQUFMLEdBQWUsUUFBZjtBQUNBLE9BQUssTUFBTCxHQUFjLE9BQWQ7QUFDQSxPQUFLLE9BQUwsR0FBZSxRQUFmO0FBRUQsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7O0FDekNBLElBQUksb0JBQW9CLFFBQVEscUJBQVIsQ0FBeEI7O0FBRUEsU0FBUyxPQUFULEdBQW1CO0FBQ2pCLE9BQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxPQUFLLElBQUwsR0FBWSxFQUFaO0FBQ0Q7O0FBRUQsUUFBUSxTQUFSLENBQWtCLEdBQWxCLEdBQXdCLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDNUMsTUFBSSxRQUFRLGtCQUFrQixRQUFsQixDQUEyQixHQUEzQixDQUFaO0FBQ0EsTUFBSSxDQUFDLEtBQUssUUFBTCxDQUFjLEtBQWQsQ0FBTCxFQUEyQjtBQUN6QixTQUFLLEdBQUwsQ0FBUyxLQUFULElBQWtCLEtBQWxCO0FBQ0EsU0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLEdBQWY7QUFDRDtBQUNGLENBTkQ7O0FBUUEsUUFBUSxTQUFSLENBQWtCLFFBQWxCLEdBQTZCLFVBQVUsR0FBVixFQUFlO0FBQzFDLE1BQUksUUFBUSxrQkFBa0IsUUFBbEIsQ0FBMkIsR0FBM0IsQ0FBWjtBQUNBLFNBQU8sS0FBSyxHQUFMLENBQVMsR0FBVCxLQUFpQixJQUF4QjtBQUNELENBSEQ7O0FBS0EsUUFBUSxTQUFSLENBQWtCLEdBQWxCLEdBQXdCLFVBQVUsR0FBVixFQUFlO0FBQ3JDLE1BQUksUUFBUSxrQkFBa0IsUUFBbEIsQ0FBMkIsR0FBM0IsQ0FBWjtBQUNBLFNBQU8sS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFQO0FBQ0QsQ0FIRDs7QUFLQSxRQUFRLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsWUFBWTtBQUNyQyxTQUFPLEtBQUssSUFBWjtBQUNELENBRkQ7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCOzs7OztBQzdCQSxJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXhCOztBQUVBLFNBQVMsT0FBVCxHQUFtQjtBQUNqQixPQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0Q7QUFDRDs7QUFFQSxRQUFRLFNBQVIsQ0FBa0IsR0FBbEIsR0FBd0IsVUFBVSxHQUFWLEVBQWU7QUFDckMsTUFBSSxRQUFRLGtCQUFrQixRQUFsQixDQUEyQixHQUEzQixDQUFaO0FBQ0EsTUFBSSxDQUFDLEtBQUssUUFBTCxDQUFjLEtBQWQsQ0FBTCxFQUNFLEtBQUssR0FBTCxDQUFTLEtBQVQsSUFBa0IsR0FBbEI7QUFDSCxDQUpEOztBQU1BLFFBQVEsU0FBUixDQUFrQixNQUFsQixHQUEyQixVQUFVLEdBQVYsRUFBZTtBQUN4QyxTQUFPLEtBQUssR0FBTCxDQUFTLGtCQUFrQixRQUFsQixDQUEyQixHQUEzQixDQUFULENBQVA7QUFDRCxDQUZEOztBQUlBLFFBQVEsU0FBUixDQUFrQixLQUFsQixHQUEwQixZQUFZO0FBQ3BDLE9BQUssR0FBTCxHQUFXLEVBQVg7QUFDRCxDQUZEOztBQUlBLFFBQVEsU0FBUixDQUFrQixRQUFsQixHQUE2QixVQUFVLEdBQVYsRUFBZTtBQUMxQyxTQUFPLEtBQUssR0FBTCxDQUFTLGtCQUFrQixRQUFsQixDQUEyQixHQUEzQixDQUFULEtBQTZDLEdBQXBEO0FBQ0QsQ0FGRDs7QUFJQSxRQUFRLFNBQVIsQ0FBa0IsT0FBbEIsR0FBNEIsWUFBWTtBQUN0QyxTQUFPLEtBQUssSUFBTCxPQUFnQixDQUF2QjtBQUNELENBRkQ7O0FBSUEsUUFBUSxTQUFSLENBQWtCLElBQWxCLEdBQXlCLFlBQVk7QUFDbkMsU0FBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLEdBQWpCLEVBQXNCLE1BQTdCO0FBQ0QsQ0FGRDs7QUFJQTtBQUNBLFFBQVEsU0FBUixDQUFrQixRQUFsQixHQUE2QixVQUFVLElBQVYsRUFBZ0I7QUFDM0MsTUFBSSxPQUFPLE9BQU8sSUFBUCxDQUFZLEtBQUssR0FBakIsQ0FBWDtBQUNBLE1BQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLFNBQUssSUFBTCxDQUFVLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBTCxDQUFULENBQVY7QUFDRDtBQUNGLENBTkQ7O0FBUUEsUUFBUSxTQUFSLENBQWtCLElBQWxCLEdBQXlCLFlBQVk7QUFDbkMsU0FBTyxPQUFPLElBQVAsQ0FBWSxLQUFLLEdBQWpCLEVBQXNCLE1BQTdCO0FBQ0QsQ0FGRDs7QUFJQSxRQUFRLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsVUFBVSxJQUFWLEVBQWdCO0FBQ3pDLE1BQUksSUFBSSxLQUFLLE1BQWI7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDMUIsUUFBSSxJQUFJLEtBQUssQ0FBTCxDQUFSO0FBQ0EsU0FBSyxHQUFMLENBQVMsQ0FBVDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxPQUFPLE9BQVAsR0FBaUIsT0FBakI7Ozs7O0FDdERBLFNBQVMsU0FBVCxHQUFxQixDQUNwQjs7QUFFRCxVQUFVLG9CQUFWLEdBQWlDLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixhQUF4QixFQUF1QyxnQkFBdkMsRUFDakM7QUFDRSxNQUFJLENBQUMsTUFBTSxVQUFOLENBQWlCLEtBQWpCLENBQUwsRUFBOEI7QUFDNUIsVUFBTSxlQUFOO0FBQ0Q7QUFDRCxNQUFJLGFBQWEsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUFqQjtBQUNBLFlBQVUsbUNBQVYsQ0FBOEMsS0FBOUMsRUFBcUQsS0FBckQsRUFBNEQsVUFBNUQ7QUFDQSxnQkFBYyxDQUFkLElBQW1CLEtBQUssR0FBTCxDQUFTLE1BQU0sUUFBTixFQUFULEVBQTJCLE1BQU0sUUFBTixFQUEzQixJQUNYLEtBQUssR0FBTCxDQUFTLE1BQU0sQ0FBZixFQUFrQixNQUFNLENBQXhCLENBRFI7QUFFQSxnQkFBYyxDQUFkLElBQW1CLEtBQUssR0FBTCxDQUFTLE1BQU0sU0FBTixFQUFULEVBQTRCLE1BQU0sU0FBTixFQUE1QixJQUNYLEtBQUssR0FBTCxDQUFTLE1BQU0sQ0FBZixFQUFrQixNQUFNLENBQXhCLENBRFI7QUFFQTtBQUNBLE1BQUssTUFBTSxJQUFOLE1BQWdCLE1BQU0sSUFBTixFQUFqQixJQUFtQyxNQUFNLFFBQU4sTUFBb0IsTUFBTSxRQUFOLEVBQTNELEVBQ0E7QUFDRSxrQkFBYyxDQUFkLEtBQW9CLEtBQUssR0FBTCxDQUFVLE1BQU0sSUFBTixLQUFlLE1BQU0sSUFBTixFQUF6QixFQUNYLE1BQU0sUUFBTixLQUFtQixNQUFNLFFBQU4sRUFEUixDQUFwQjtBQUVELEdBSkQsTUFLSyxJQUFLLE1BQU0sSUFBTixNQUFnQixNQUFNLElBQU4sRUFBakIsSUFBbUMsTUFBTSxRQUFOLE1BQW9CLE1BQU0sUUFBTixFQUEzRCxFQUNMO0FBQ0Usa0JBQWMsQ0FBZCxLQUFvQixLQUFLLEdBQUwsQ0FBVSxNQUFNLElBQU4sS0FBZSxNQUFNLElBQU4sRUFBekIsRUFDWCxNQUFNLFFBQU4sS0FBbUIsTUFBTSxRQUFOLEVBRFIsQ0FBcEI7QUFFRDtBQUNELE1BQUssTUFBTSxJQUFOLE1BQWdCLE1BQU0sSUFBTixFQUFqQixJQUFtQyxNQUFNLFNBQU4sTUFBcUIsTUFBTSxTQUFOLEVBQTVELEVBQ0E7QUFDRSxrQkFBYyxDQUFkLEtBQW9CLEtBQUssR0FBTCxDQUFVLE1BQU0sSUFBTixLQUFlLE1BQU0sSUFBTixFQUF6QixFQUNYLE1BQU0sU0FBTixLQUFvQixNQUFNLFNBQU4sRUFEVCxDQUFwQjtBQUVELEdBSkQsTUFLSyxJQUFLLE1BQU0sSUFBTixNQUFnQixNQUFNLElBQU4sRUFBakIsSUFBbUMsTUFBTSxTQUFOLE1BQXFCLE1BQU0sU0FBTixFQUE1RCxFQUNMO0FBQ0Usa0JBQWMsQ0FBZCxLQUFvQixLQUFLLEdBQUwsQ0FBVSxNQUFNLElBQU4sS0FBZSxNQUFNLElBQU4sRUFBekIsRUFDWCxNQUFNLFNBQU4sS0FBb0IsTUFBTSxTQUFOLEVBRFQsQ0FBcEI7QUFFRDs7QUFFRDtBQUNBLE1BQUksUUFBUSxLQUFLLEdBQUwsQ0FBUyxDQUFDLE1BQU0sVUFBTixLQUFxQixNQUFNLFVBQU4sRUFBdEIsS0FDWixNQUFNLFVBQU4sS0FBcUIsTUFBTSxVQUFOLEVBRFQsQ0FBVCxDQUFaO0FBRUE7QUFDQSxNQUFLLE1BQU0sVUFBTixNQUFzQixNQUFNLFVBQU4sRUFBdkIsSUFDSyxNQUFNLFVBQU4sTUFBc0IsTUFBTSxVQUFOLEVBRC9CLEVBRUE7QUFDRTtBQUNBLFlBQVEsR0FBUjtBQUNEOztBQUVELE1BQUksVUFBVSxRQUFRLGNBQWMsQ0FBZCxDQUF0QjtBQUNBLE1BQUksVUFBVSxjQUFjLENBQWQsSUFBbUIsS0FBakM7QUFDQSxNQUFJLGNBQWMsQ0FBZCxJQUFtQixPQUF2QixFQUNBO0FBQ0UsY0FBVSxjQUFjLENBQWQsQ0FBVjtBQUNELEdBSEQsTUFLQTtBQUNFLGNBQVUsY0FBYyxDQUFkLENBQVY7QUFDRDtBQUNEO0FBQ0E7QUFDQSxnQkFBYyxDQUFkLElBQW1CLENBQUMsQ0FBRCxHQUFLLFdBQVcsQ0FBWCxDQUFMLElBQXVCLFVBQVUsQ0FBWCxHQUFnQixnQkFBdEMsQ0FBbkI7QUFDQSxnQkFBYyxDQUFkLElBQW1CLENBQUMsQ0FBRCxHQUFLLFdBQVcsQ0FBWCxDQUFMLElBQXVCLFVBQVUsQ0FBWCxHQUFnQixnQkFBdEMsQ0FBbkI7QUFDRCxDQTFERDs7QUE0REEsVUFBVSxtQ0FBVixHQUFnRCxVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsVUFBeEIsRUFDaEQ7QUFDRSxNQUFJLE1BQU0sVUFBTixLQUFxQixNQUFNLFVBQU4sRUFBekIsRUFDQTtBQUNFLGVBQVcsQ0FBWCxJQUFnQixDQUFDLENBQWpCO0FBQ0QsR0FIRCxNQUtBO0FBQ0UsZUFBVyxDQUFYLElBQWdCLENBQWhCO0FBQ0Q7O0FBRUQsTUFBSSxNQUFNLFVBQU4sS0FBcUIsTUFBTSxVQUFOLEVBQXpCLEVBQ0E7QUFDRSxlQUFXLENBQVgsSUFBZ0IsQ0FBQyxDQUFqQjtBQUNELEdBSEQsTUFLQTtBQUNFLGVBQVcsQ0FBWCxJQUFnQixDQUFoQjtBQUNEO0FBQ0YsQ0FuQkQ7O0FBcUJBLFVBQVUsZ0JBQVYsR0FBNkIsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCLE1BQXhCLEVBQzdCO0FBQ0U7QUFDQSxNQUFJLE1BQU0sTUFBTSxVQUFOLEVBQVY7QUFDQSxNQUFJLE1BQU0sTUFBTSxVQUFOLEVBQVY7QUFDQSxNQUFJLE1BQU0sTUFBTSxVQUFOLEVBQVY7QUFDQSxNQUFJLE1BQU0sTUFBTSxVQUFOLEVBQVY7O0FBRUE7QUFDQSxNQUFJLE1BQU0sVUFBTixDQUFpQixLQUFqQixDQUFKLEVBQ0E7QUFDRSxXQUFPLENBQVAsSUFBWSxHQUFaO0FBQ0EsV0FBTyxDQUFQLElBQVksR0FBWjtBQUNBLFdBQU8sQ0FBUCxJQUFZLEdBQVo7QUFDQSxXQUFPLENBQVAsSUFBWSxHQUFaO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRDtBQUNBLE1BQUksWUFBWSxNQUFNLElBQU4sRUFBaEI7QUFDQSxNQUFJLFlBQVksTUFBTSxJQUFOLEVBQWhCO0FBQ0EsTUFBSSxhQUFhLE1BQU0sUUFBTixFQUFqQjtBQUNBLE1BQUksZUFBZSxNQUFNLElBQU4sRUFBbkI7QUFDQSxNQUFJLGVBQWUsTUFBTSxTQUFOLEVBQW5CO0FBQ0EsTUFBSSxnQkFBZ0IsTUFBTSxRQUFOLEVBQXBCO0FBQ0EsTUFBSSxhQUFhLE1BQU0sWUFBTixFQUFqQjtBQUNBLE1BQUksY0FBYyxNQUFNLGFBQU4sRUFBbEI7QUFDQTtBQUNBLE1BQUksWUFBWSxNQUFNLElBQU4sRUFBaEI7QUFDQSxNQUFJLFlBQVksTUFBTSxJQUFOLEVBQWhCO0FBQ0EsTUFBSSxhQUFhLE1BQU0sUUFBTixFQUFqQjtBQUNBLE1BQUksZUFBZSxNQUFNLElBQU4sRUFBbkI7QUFDQSxNQUFJLGVBQWUsTUFBTSxTQUFOLEVBQW5CO0FBQ0EsTUFBSSxnQkFBZ0IsTUFBTSxRQUFOLEVBQXBCO0FBQ0EsTUFBSSxhQUFhLE1BQU0sWUFBTixFQUFqQjtBQUNBLE1BQUksY0FBYyxNQUFNLGFBQU4sRUFBbEI7QUFDQTtBQUNBLE1BQUksa0JBQWtCLEtBQXRCO0FBQ0EsTUFBSSxrQkFBa0IsS0FBdEI7O0FBRUE7QUFDQSxNQUFJLE9BQU8sR0FBWCxFQUNBO0FBQ0UsUUFBSSxNQUFNLEdBQVYsRUFDQTtBQUNFLGFBQU8sQ0FBUCxJQUFZLEdBQVo7QUFDQSxhQUFPLENBQVAsSUFBWSxTQUFaO0FBQ0EsYUFBTyxDQUFQLElBQVksR0FBWjtBQUNBLGFBQU8sQ0FBUCxJQUFZLFlBQVo7QUFDQSxhQUFPLEtBQVA7QUFDRCxLQVBELE1BUUssSUFBSSxNQUFNLEdBQVYsRUFDTDtBQUNFLGFBQU8sQ0FBUCxJQUFZLEdBQVo7QUFDQSxhQUFPLENBQVAsSUFBWSxZQUFaO0FBQ0EsYUFBTyxDQUFQLElBQVksR0FBWjtBQUNBLGFBQU8sQ0FBUCxJQUFZLFNBQVo7QUFDQSxhQUFPLEtBQVA7QUFDRCxLQVBJLE1BU0w7QUFDRTtBQUNEO0FBQ0Y7QUFDRDtBQXZCQSxPQXdCSyxJQUFJLE9BQU8sR0FBWCxFQUNMO0FBQ0UsVUFBSSxNQUFNLEdBQVYsRUFDQTtBQUNFLGVBQU8sQ0FBUCxJQUFZLFNBQVo7QUFDQSxlQUFPLENBQVAsSUFBWSxHQUFaO0FBQ0EsZUFBTyxDQUFQLElBQVksVUFBWjtBQUNBLGVBQU8sQ0FBUCxJQUFZLEdBQVo7QUFDQSxlQUFPLEtBQVA7QUFDRCxPQVBELE1BUUssSUFBSSxNQUFNLEdBQVYsRUFDTDtBQUNFLGVBQU8sQ0FBUCxJQUFZLFVBQVo7QUFDQSxlQUFPLENBQVAsSUFBWSxHQUFaO0FBQ0EsZUFBTyxDQUFQLElBQVksU0FBWjtBQUNBLGVBQU8sQ0FBUCxJQUFZLEdBQVo7QUFDQSxlQUFPLEtBQVA7QUFDRCxPQVBJLE1BU0w7QUFDRTtBQUNEO0FBQ0YsS0F0QkksTUF3Qkw7QUFDRTtBQUNBLFVBQUksU0FBUyxNQUFNLE1BQU4sR0FBZSxNQUFNLEtBQWxDO0FBQ0EsVUFBSSxTQUFTLE1BQU0sTUFBTixHQUFlLE1BQU0sS0FBbEM7O0FBRUE7QUFDQSxVQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQVAsS0FBZSxNQUFNLEdBQXJCLENBQWpCO0FBQ0EsVUFBSSxrQkFBSjtBQUNBLFVBQUksa0JBQUo7QUFDQSxVQUFJLFdBQUo7QUFDQSxVQUFJLFdBQUo7QUFDQSxVQUFJLFdBQUo7QUFDQSxVQUFJLFdBQUo7O0FBRUE7QUFDQSxVQUFLLENBQUMsTUFBRixJQUFhLFVBQWpCLEVBQ0E7QUFDRSxZQUFJLE1BQU0sR0FBVixFQUNBO0FBQ0UsaUJBQU8sQ0FBUCxJQUFZLFlBQVo7QUFDQSxpQkFBTyxDQUFQLElBQVksWUFBWjtBQUNBLDRCQUFrQixJQUFsQjtBQUNELFNBTEQsTUFPQTtBQUNFLGlCQUFPLENBQVAsSUFBWSxVQUFaO0FBQ0EsaUJBQU8sQ0FBUCxJQUFZLFNBQVo7QUFDQSw0QkFBa0IsSUFBbEI7QUFDRDtBQUNGLE9BZEQsTUFlSyxJQUFJLFVBQVUsVUFBZCxFQUNMO0FBQ0UsWUFBSSxNQUFNLEdBQVYsRUFDQTtBQUNFLGlCQUFPLENBQVAsSUFBWSxTQUFaO0FBQ0EsaUJBQU8sQ0FBUCxJQUFZLFNBQVo7QUFDQSw0QkFBa0IsSUFBbEI7QUFDRCxTQUxELE1BT0E7QUFDRSxpQkFBTyxDQUFQLElBQVksYUFBWjtBQUNBLGlCQUFPLENBQVAsSUFBWSxZQUFaO0FBQ0EsNEJBQWtCLElBQWxCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUssQ0FBQyxNQUFGLElBQWEsVUFBakIsRUFDQTtBQUNFLFlBQUksTUFBTSxHQUFWLEVBQ0E7QUFDRSxpQkFBTyxDQUFQLElBQVksWUFBWjtBQUNBLGlCQUFPLENBQVAsSUFBWSxZQUFaO0FBQ0EsNEJBQWtCLElBQWxCO0FBQ0QsU0FMRCxNQU9BO0FBQ0UsaUJBQU8sQ0FBUCxJQUFZLFVBQVo7QUFDQSxpQkFBTyxDQUFQLElBQVksU0FBWjtBQUNBLDRCQUFrQixJQUFsQjtBQUNEO0FBQ0YsT0FkRCxNQWVLLElBQUksVUFBVSxVQUFkLEVBQ0w7QUFDRSxZQUFJLE1BQU0sR0FBVixFQUNBO0FBQ0UsaUJBQU8sQ0FBUCxJQUFZLFNBQVo7QUFDQSxpQkFBTyxDQUFQLElBQVksU0FBWjtBQUNBLDRCQUFrQixJQUFsQjtBQUNELFNBTEQsTUFPQTtBQUNFLGlCQUFPLENBQVAsSUFBWSxhQUFaO0FBQ0EsaUJBQU8sQ0FBUCxJQUFZLFlBQVo7QUFDQSw0QkFBa0IsSUFBbEI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSSxtQkFBbUIsZUFBdkIsRUFDQTtBQUNFLGVBQU8sS0FBUDtBQUNEOztBQUVEO0FBQ0EsVUFBSSxNQUFNLEdBQVYsRUFDQTtBQUNFLFlBQUksTUFBTSxHQUFWLEVBQ0E7QUFDRSwrQkFBcUIsVUFBVSxvQkFBVixDQUErQixNQUEvQixFQUF1QyxVQUF2QyxFQUFtRCxDQUFuRCxDQUFyQjtBQUNBLCtCQUFxQixVQUFVLG9CQUFWLENBQStCLE1BQS9CLEVBQXVDLFVBQXZDLEVBQW1ELENBQW5ELENBQXJCO0FBQ0QsU0FKRCxNQU1BO0FBQ0UsK0JBQXFCLFVBQVUsb0JBQVYsQ0FBK0IsQ0FBQyxNQUFoQyxFQUF3QyxVQUF4QyxFQUFvRCxDQUFwRCxDQUFyQjtBQUNBLCtCQUFxQixVQUFVLG9CQUFWLENBQStCLENBQUMsTUFBaEMsRUFBd0MsVUFBeEMsRUFBb0QsQ0FBcEQsQ0FBckI7QUFDRDtBQUNGLE9BWkQsTUFjQTtBQUNFLFlBQUksTUFBTSxHQUFWLEVBQ0E7QUFDRSwrQkFBcUIsVUFBVSxvQkFBVixDQUErQixDQUFDLE1BQWhDLEVBQXdDLFVBQXhDLEVBQW9ELENBQXBELENBQXJCO0FBQ0EsK0JBQXFCLFVBQVUsb0JBQVYsQ0FBK0IsQ0FBQyxNQUFoQyxFQUF3QyxVQUF4QyxFQUFvRCxDQUFwRCxDQUFyQjtBQUNELFNBSkQsTUFNQTtBQUNFLCtCQUFxQixVQUFVLG9CQUFWLENBQStCLE1BQS9CLEVBQXVDLFVBQXZDLEVBQW1ELENBQW5ELENBQXJCO0FBQ0EsK0JBQXFCLFVBQVUsb0JBQVYsQ0FBK0IsTUFBL0IsRUFBdUMsVUFBdkMsRUFBbUQsQ0FBbkQsQ0FBckI7QUFDRDtBQUNGO0FBQ0Q7QUFDQSxVQUFJLENBQUMsZUFBTCxFQUNBO0FBQ0UsZ0JBQVEsa0JBQVI7QUFFRSxlQUFLLENBQUw7QUFDRSwwQkFBYyxTQUFkO0FBQ0EsMEJBQWMsTUFBTyxDQUFDLFdBQUYsR0FBaUIsVUFBckM7QUFDQSxtQkFBTyxDQUFQLElBQVksV0FBWjtBQUNBLG1CQUFPLENBQVAsSUFBWSxXQUFaO0FBQ0E7QUFDRixlQUFLLENBQUw7QUFDRSwwQkFBYyxhQUFkO0FBQ0EsMEJBQWMsTUFBTSxhQUFhLFVBQWpDO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQSxtQkFBTyxDQUFQLElBQVksV0FBWjtBQUNBO0FBQ0YsZUFBSyxDQUFMO0FBQ0UsMEJBQWMsWUFBZDtBQUNBLDBCQUFjLE1BQU0sY0FBYyxVQUFsQztBQUNBLG1CQUFPLENBQVAsSUFBWSxXQUFaO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQTtBQUNGLGVBQUssQ0FBTDtBQUNFLDBCQUFjLFlBQWQ7QUFDQSwwQkFBYyxNQUFPLENBQUMsVUFBRixHQUFnQixVQUFwQztBQUNBLG1CQUFPLENBQVAsSUFBWSxXQUFaO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQTtBQXpCSjtBQTJCRDtBQUNELFVBQUksQ0FBQyxlQUFMLEVBQ0E7QUFDRSxnQkFBUSxrQkFBUjtBQUVFLGVBQUssQ0FBTDtBQUNFLDBCQUFjLFNBQWQ7QUFDQSwwQkFBYyxNQUFPLENBQUMsV0FBRixHQUFpQixVQUFyQztBQUNBLG1CQUFPLENBQVAsSUFBWSxXQUFaO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQTtBQUNGLGVBQUssQ0FBTDtBQUNFLDBCQUFjLGFBQWQ7QUFDQSwwQkFBYyxNQUFNLGFBQWEsVUFBakM7QUFDQSxtQkFBTyxDQUFQLElBQVksV0FBWjtBQUNBLG1CQUFPLENBQVAsSUFBWSxXQUFaO0FBQ0E7QUFDRixlQUFLLENBQUw7QUFDRSwwQkFBYyxZQUFkO0FBQ0EsMEJBQWMsTUFBTSxjQUFjLFVBQWxDO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQSxtQkFBTyxDQUFQLElBQVksV0FBWjtBQUNBO0FBQ0YsZUFBSyxDQUFMO0FBQ0UsMEJBQWMsWUFBZDtBQUNBLDBCQUFjLE1BQU8sQ0FBQyxVQUFGLEdBQWdCLFVBQXBDO0FBQ0EsbUJBQU8sQ0FBUCxJQUFZLFdBQVo7QUFDQSxtQkFBTyxDQUFQLElBQVksV0FBWjtBQUNBO0FBekJKO0FBMkJEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQXRRRDs7QUF3UUEsVUFBVSxvQkFBVixHQUFpQyxVQUFVLEtBQVYsRUFBaUIsVUFBakIsRUFBNkIsSUFBN0IsRUFDakM7QUFDRSxNQUFJLFFBQVEsVUFBWixFQUNBO0FBQ0UsV0FBTyxJQUFQO0FBQ0QsR0FIRCxNQUtBO0FBQ0UsV0FBTyxJQUFJLE9BQU8sQ0FBbEI7QUFDRDtBQUNGLENBVkQ7O0FBWUEsVUFBVSxlQUFWLEdBQTRCLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFDNUI7QUFDRSxNQUFJLE1BQU0sSUFBVixFQUFnQjtBQUNkLFdBQU8sVUFBVSxnQkFBVixDQUEyQixFQUEzQixFQUErQixFQUEvQixFQUFtQyxFQUFuQyxDQUFQO0FBQ0Q7QUFDRCxNQUFJLEtBQUssR0FBRyxDQUFaO0FBQ0EsTUFBSSxLQUFLLEdBQUcsQ0FBWjtBQUNBLE1BQUksS0FBSyxHQUFHLENBQVo7QUFDQSxNQUFJLEtBQUssR0FBRyxDQUFaO0FBQ0EsTUFBSSxLQUFLLEdBQUcsQ0FBWjtBQUNBLE1BQUksS0FBSyxHQUFHLENBQVo7QUFDQSxNQUFJLEtBQUssR0FBRyxDQUFaO0FBQ0EsTUFBSSxLQUFLLEdBQUcsQ0FBWjtBQUNBLE1BQUksQ0FBSixFQUFPLENBQVAsQ0FaRixDQVlZO0FBQ1YsTUFBSSxFQUFKLEVBQVEsRUFBUixFQUFZLEVBQVosRUFBZ0IsRUFBaEIsRUFBb0IsRUFBcEIsRUFBd0IsRUFBeEIsQ0FiRixDQWE4QjtBQUM1QixNQUFJLEtBQUo7O0FBRUEsT0FBSyxLQUFLLEVBQVY7QUFDQSxPQUFLLEtBQUssRUFBVjtBQUNBLE9BQUssS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFwQixDQWxCRixDQWtCMkI7O0FBRXpCLE9BQUssS0FBSyxFQUFWO0FBQ0EsT0FBSyxLQUFLLEVBQVY7QUFDQSxPQUFLLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBcEIsQ0F0QkYsQ0FzQjJCOztBQUV6QixVQUFRLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBdkI7O0FBRUEsTUFBSSxTQUFTLENBQWIsRUFDQTtBQUNFLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQUksQ0FBQyxLQUFLLEVBQUwsR0FBVSxLQUFLLEVBQWhCLElBQXNCLEtBQTFCO0FBQ0EsTUFBSSxDQUFDLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBaEIsSUFBc0IsS0FBMUI7O0FBRUEsU0FBTyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFQO0FBQ0QsQ0FwQ0Q7O0FBc0NBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxVQUFVLE9BQVYsR0FBb0IsTUFBTSxLQUFLLEVBQS9CO0FBQ0EsVUFBVSxlQUFWLEdBQTRCLE1BQU0sS0FBSyxFQUF2QztBQUNBLFVBQVUsTUFBVixHQUFtQixNQUFNLEtBQUssRUFBOUI7QUFDQSxVQUFVLFFBQVYsR0FBcUIsTUFBTSxLQUFLLEVBQWhDOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFqQjs7Ozs7QUN6WkEsU0FBUyxLQUFULEdBQWlCLENBQ2hCOztBQUVEOzs7QUFHQSxNQUFNLElBQU4sR0FBYSxVQUFVLEtBQVYsRUFBaUI7QUFDNUIsTUFBSSxRQUFRLENBQVosRUFDQTtBQUNFLFdBQU8sQ0FBUDtBQUNELEdBSEQsTUFJSyxJQUFJLFFBQVEsQ0FBWixFQUNMO0FBQ0UsV0FBTyxDQUFDLENBQVI7QUFDRCxHQUhJLE1BS0w7QUFDRSxXQUFPLENBQVA7QUFDRDtBQUNGLENBYkQ7O0FBZUEsTUFBTSxLQUFOLEdBQWMsVUFBVSxLQUFWLEVBQWlCO0FBQzdCLFNBQU8sUUFBUSxDQUFSLEdBQVksS0FBSyxJQUFMLENBQVUsS0FBVixDQUFaLEdBQStCLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBdEM7QUFDRCxDQUZEOztBQUlBLE1BQU0sSUFBTixHQUFhLFVBQVUsS0FBVixFQUFpQjtBQUM1QixTQUFPLFFBQVEsQ0FBUixHQUFZLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBWixHQUFnQyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQXZDO0FBQ0QsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7O0FDN0JBLFNBQVMsT0FBVCxHQUFtQixDQUNsQjs7QUFFRCxRQUFRLFNBQVIsR0FBb0IsVUFBcEI7QUFDQSxRQUFRLFNBQVIsR0FBb0IsQ0FBQyxVQUFyQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsT0FBakI7Ozs7O0FDTkEsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaOztBQUVBLFNBQVMsS0FBVCxDQUFlLE1BQWYsRUFBdUIsTUFBdkIsRUFBK0IsS0FBL0IsRUFBc0M7QUFDcEMsZUFBYSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLEtBQXhCOztBQUVBLE9BQUssMkJBQUwsR0FBbUMsS0FBbkM7QUFDQSxPQUFLLFlBQUwsR0FBb0IsS0FBcEI7QUFDQSxPQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsT0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNEOztBQUVELE1BQU0sU0FBTixHQUFrQixPQUFPLE1BQVAsQ0FBYyxhQUFhLFNBQTNCLENBQWxCOztBQUVBLEtBQUssSUFBSSxJQUFULElBQWlCLFlBQWpCLEVBQStCO0FBQzdCLFFBQU0sSUFBTixJQUFjLGFBQWEsSUFBYixDQUFkO0FBQ0Q7O0FBRUQsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQzVCO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixZQUM1QjtBQUNFLFNBQU8sS0FBSyxNQUFaO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsWUFBaEIsR0FBK0IsWUFDL0I7QUFDRSxTQUFPLEtBQUssWUFBWjtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQzVCO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQiwyQkFBaEIsR0FBOEMsWUFDOUM7QUFDRSxTQUFPLEtBQUssMkJBQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixhQUFoQixHQUFnQyxZQUNoQztBQUNFLFNBQU8sS0FBSyxVQUFaO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsWUFDekI7QUFDRSxTQUFPLEtBQUssR0FBWjtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLGNBQWhCLEdBQWlDLFlBQ2pDO0FBQ0UsU0FBTyxLQUFLLFdBQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixjQUFoQixHQUFpQyxZQUNqQztBQUNFLFNBQU8sS0FBSyxXQUFaO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsVUFBVSxJQUFWLEVBQzlCO0FBQ0UsTUFBSSxLQUFLLE1BQUwsS0FBZ0IsSUFBcEIsRUFDQTtBQUNFLFdBQU8sS0FBSyxNQUFaO0FBQ0QsR0FIRCxNQUlLLElBQUksS0FBSyxNQUFMLEtBQWdCLElBQXBCLEVBQ0w7QUFDRSxXQUFPLEtBQUssTUFBWjtBQUNELEdBSEksTUFLTDtBQUNFLFVBQU0scUNBQU47QUFDRDtBQUNGLENBZEQ7O0FBZ0JBLE1BQU0sU0FBTixDQUFnQixrQkFBaEIsR0FBcUMsVUFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQ3JDO0FBQ0UsTUFBSSxXQUFXLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFmO0FBQ0EsTUFBSSxPQUFPLE1BQU0sZUFBTixHQUF3QixPQUF4QixFQUFYOztBQUVBLFNBQU8sSUFBUCxFQUNBO0FBQ0UsUUFBSSxTQUFTLFFBQVQsTUFBdUIsS0FBM0IsRUFDQTtBQUNFLGFBQU8sUUFBUDtBQUNEOztBQUVELFFBQUksU0FBUyxRQUFULE1BQXVCLElBQTNCLEVBQ0E7QUFDRTtBQUNEOztBQUVELGVBQVcsU0FBUyxRQUFULEdBQW9CLFNBQXBCLEVBQVg7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQXJCRDs7QUF1QkEsTUFBTSxTQUFOLENBQWdCLFlBQWhCLEdBQStCLFlBQy9CO0FBQ0UsTUFBSSx1QkFBdUIsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUEzQjs7QUFFQSxPQUFLLDJCQUFMLEdBQ1EsVUFBVSxlQUFWLENBQTBCLEtBQUssTUFBTCxDQUFZLE9BQVosRUFBMUIsRUFDUSxLQUFLLE1BQUwsQ0FBWSxPQUFaLEVBRFIsRUFFUSxvQkFGUixDQURSOztBQUtBLE1BQUksQ0FBQyxLQUFLLDJCQUFWLEVBQ0E7QUFDRSxTQUFLLE9BQUwsR0FBZSxxQkFBcUIsQ0FBckIsSUFBMEIscUJBQXFCLENBQXJCLENBQXpDO0FBQ0EsU0FBSyxPQUFMLEdBQWUscUJBQXFCLENBQXJCLElBQTBCLHFCQUFxQixDQUFyQixDQUF6Qzs7QUFFQSxRQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssT0FBZCxJQUF5QixHQUE3QixFQUNBO0FBQ0UsV0FBSyxPQUFMLEdBQWUsTUFBTSxJQUFOLENBQVcsS0FBSyxPQUFoQixDQUFmO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLE9BQWQsSUFBeUIsR0FBN0IsRUFDQTtBQUNFLFdBQUssT0FBTCxHQUFlLE1BQU0sSUFBTixDQUFXLEtBQUssT0FBaEIsQ0FBZjtBQUNEOztBQUVELFNBQUssTUFBTCxHQUFjLEtBQUssSUFBTCxDQUNOLEtBQUssT0FBTCxHQUFlLEtBQUssT0FBcEIsR0FBOEIsS0FBSyxPQUFMLEdBQWUsS0FBSyxPQUQ1QyxDQUFkO0FBRUQ7QUFDRixDQTNCRDs7QUE2QkEsTUFBTSxTQUFOLENBQWdCLGtCQUFoQixHQUFxQyxZQUNyQztBQUNFLE9BQUssT0FBTCxHQUFlLEtBQUssTUFBTCxDQUFZLFVBQVosS0FBMkIsS0FBSyxNQUFMLENBQVksVUFBWixFQUExQztBQUNBLE9BQUssT0FBTCxHQUFlLEtBQUssTUFBTCxDQUFZLFVBQVosS0FBMkIsS0FBSyxNQUFMLENBQVksVUFBWixFQUExQzs7QUFFQSxNQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssT0FBZCxJQUF5QixHQUE3QixFQUNBO0FBQ0UsU0FBSyxPQUFMLEdBQWUsTUFBTSxJQUFOLENBQVcsS0FBSyxPQUFoQixDQUFmO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFLLE9BQWQsSUFBeUIsR0FBN0IsRUFDQTtBQUNFLFNBQUssT0FBTCxHQUFlLE1BQU0sSUFBTixDQUFXLEtBQUssT0FBaEIsQ0FBZjtBQUNEOztBQUVELE9BQUssTUFBTCxHQUFjLEtBQUssSUFBTCxDQUNOLEtBQUssT0FBTCxHQUFlLEtBQUssT0FBcEIsR0FBOEIsS0FBSyxPQUFMLEdBQWUsS0FBSyxPQUQ1QyxDQUFkO0FBRUQsQ0FqQkQ7O0FBbUJBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7Ozs7QUN4SkEsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7QUFDQSxJQUFJLGtCQUFrQixRQUFRLG1CQUFSLENBQXRCO0FBQ0EsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFwQjtBQUNBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjtBQUNBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBZDtBQUNBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7QUFDQSxJQUFJLE9BQU8sUUFBUSxlQUFSLEVBQXlCLElBQXBDO0FBQ0EsSUFBSSxNQUFKOztBQUVBLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixFQUE4QixNQUE5QixFQUFzQztBQUNwQyxXQUFTLFFBQVEsVUFBUixDQUFUO0FBQ0EsZUFBYSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLE1BQXhCO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLFFBQVEsU0FBN0I7QUFDQSxPQUFLLE1BQUwsR0FBYyxnQkFBZ0Isb0JBQTlCO0FBQ0EsT0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLE9BQUssS0FBTCxHQUFhLEVBQWI7QUFDQSxPQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxPQUFLLE1BQUwsR0FBYyxNQUFkOztBQUVBLE1BQUksUUFBUSxJQUFSLElBQWdCLGdCQUFnQixhQUFwQyxFQUFtRDtBQUNqRCxTQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDRCxHQUZELE1BR0ssSUFBSSxRQUFRLElBQVIsSUFBZ0IsZ0JBQWdCLE1BQXBDLEVBQTRDO0FBQy9DLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQXpCO0FBQ0Q7QUFDRjs7QUFFRCxPQUFPLFNBQVAsR0FBbUIsT0FBTyxNQUFQLENBQWMsYUFBYSxTQUEzQixDQUFuQjtBQUNBLEtBQUssSUFBSSxJQUFULElBQWlCLFlBQWpCLEVBQStCO0FBQzdCLFNBQU8sSUFBUCxJQUFlLGFBQWEsSUFBYixDQUFmO0FBQ0Q7O0FBRUQsT0FBTyxTQUFQLENBQWlCLFFBQWpCLEdBQTRCLFlBQVk7QUFDdEMsU0FBTyxLQUFLLEtBQVo7QUFDRCxDQUZEOztBQUlBLE9BQU8sU0FBUCxDQUFpQixRQUFqQixHQUE0QixZQUFZO0FBQ3RDLFNBQU8sS0FBSyxLQUFaO0FBQ0QsQ0FGRDs7QUFJQSxPQUFPLFNBQVAsQ0FBaUIsZUFBakIsR0FBbUMsWUFDbkM7QUFDRSxTQUFPLEtBQUssWUFBWjtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLFNBQWpCLEdBQTZCLFlBQzdCO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixZQUMzQjtBQUNFLFNBQU8sS0FBSyxJQUFaO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsR0FBNEIsWUFDNUI7QUFDRSxTQUFPLEtBQUssS0FBWjtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLE1BQWpCLEdBQTBCLFlBQzFCO0FBQ0UsU0FBTyxLQUFLLEdBQVo7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixTQUFqQixHQUE2QixZQUM3QjtBQUNFLFNBQU8sS0FBSyxNQUFaO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsV0FBakIsR0FBK0IsWUFDL0I7QUFDRSxTQUFPLEtBQUssV0FBWjtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLEdBQWpCLEdBQXVCLFVBQVUsSUFBVixFQUFnQixVQUFoQixFQUE0QixVQUE1QixFQUF3QztBQUM3RCxNQUFJLGNBQWMsSUFBZCxJQUFzQixjQUFjLElBQXhDLEVBQThDO0FBQzVDLFFBQUksVUFBVSxJQUFkO0FBQ0EsUUFBSSxLQUFLLFlBQUwsSUFBcUIsSUFBekIsRUFBK0I7QUFDN0IsWUFBTSx5QkFBTjtBQUNEO0FBQ0QsUUFBSSxLQUFLLFFBQUwsR0FBZ0IsT0FBaEIsQ0FBd0IsT0FBeEIsSUFBbUMsQ0FBQyxDQUF4QyxFQUEyQztBQUN6QyxZQUFNLHdCQUFOO0FBQ0Q7QUFDRCxZQUFRLEtBQVIsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FBcUIsT0FBckI7O0FBRUEsV0FBTyxPQUFQO0FBQ0QsR0FaRCxNQWFLO0FBQ0gsUUFBSSxVQUFVLElBQWQ7QUFDQSxRQUFJLEVBQUUsS0FBSyxRQUFMLEdBQWdCLE9BQWhCLENBQXdCLFVBQXhCLElBQXNDLENBQUMsQ0FBdkMsSUFBNkMsS0FBSyxRQUFMLEdBQWdCLE9BQWhCLENBQXdCLFVBQXhCLENBQUQsR0FBd0MsQ0FBQyxDQUF2RixDQUFKLEVBQStGO0FBQzdGLFlBQU0sZ0NBQU47QUFDRDs7QUFFRCxRQUFJLEVBQUUsV0FBVyxLQUFYLElBQW9CLFdBQVcsS0FBL0IsSUFBd0MsV0FBVyxLQUFYLElBQW9CLElBQTlELENBQUosRUFBeUU7QUFDdkUsWUFBTSxpQ0FBTjtBQUNEOztBQUVELFFBQUksV0FBVyxLQUFYLElBQW9CLFdBQVcsS0FBbkMsRUFDQTtBQUNFLGFBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsWUFBUSxNQUFSLEdBQWlCLFVBQWpCO0FBQ0EsWUFBUSxNQUFSLEdBQWlCLFVBQWpCOztBQUVBO0FBQ0EsWUFBUSxZQUFSLEdBQXVCLEtBQXZCOztBQUVBO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLElBQWhCLENBQXFCLE9BQXJCOztBQUVBO0FBQ0EsZUFBVyxLQUFYLENBQWlCLElBQWpCLENBQXNCLE9BQXRCOztBQUVBLFFBQUksY0FBYyxVQUFsQixFQUNBO0FBQ0UsaUJBQVcsS0FBWCxDQUFpQixJQUFqQixDQUFzQixPQUF0QjtBQUNEOztBQUVELFdBQU8sT0FBUDtBQUNEO0FBQ0YsQ0FqREQ7O0FBbURBLE9BQU8sU0FBUCxDQUFpQixNQUFqQixHQUEwQixVQUFVLEdBQVYsRUFBZTtBQUN2QyxNQUFJLE9BQU8sR0FBWDtBQUNBLE1BQUksZUFBZSxLQUFuQixFQUEwQjtBQUN4QixRQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixZQUFNLGVBQU47QUFDRDtBQUNELFFBQUksRUFBRSxLQUFLLEtBQUwsSUFBYyxJQUFkLElBQXNCLEtBQUssS0FBTCxJQUFjLElBQXRDLENBQUosRUFBaUQ7QUFDL0MsWUFBTSx5QkFBTjtBQUNEO0FBQ0QsUUFBSSxLQUFLLFlBQUwsSUFBcUIsSUFBekIsRUFBK0I7QUFDN0IsWUFBTSxpQ0FBTjtBQUNEO0FBQ0Q7QUFDQSxRQUFJLG1CQUFtQixLQUFLLEtBQUwsQ0FBVyxLQUFYLEVBQXZCO0FBQ0EsUUFBSSxJQUFKO0FBQ0EsUUFBSSxJQUFJLGlCQUFpQixNQUF6QjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUNBO0FBQ0UsYUFBTyxpQkFBaUIsQ0FBakIsQ0FBUDs7QUFFQSxVQUFJLEtBQUssWUFBVCxFQUNBO0FBQ0UsYUFBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLElBQXpCO0FBQ0QsT0FIRCxNQUtBO0FBQ0UsYUFBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFsQixDQUF5QixJQUF6QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxRQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixJQUFuQixDQUFaO0FBQ0EsUUFBSSxTQUFTLENBQUMsQ0FBZCxFQUFpQjtBQUNmLFlBQU0sOEJBQU47QUFDRDs7QUFFRCxTQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCO0FBQ0QsR0FuQ0QsTUFvQ0ssSUFBSSxlQUFlLEtBQW5CLEVBQTBCO0FBQzdCLFFBQUksT0FBTyxHQUFYO0FBQ0EsUUFBSSxRQUFRLElBQVosRUFBa0I7QUFDaEIsWUFBTSxlQUFOO0FBQ0Q7QUFDRCxRQUFJLEVBQUUsS0FBSyxNQUFMLElBQWUsSUFBZixJQUF1QixLQUFLLE1BQUwsSUFBZSxJQUF4QyxDQUFKLEVBQW1EO0FBQ2pELFlBQU0sK0JBQU47QUFDRDtBQUNELFFBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxLQUFaLElBQXFCLElBQXJCLElBQTZCLEtBQUssTUFBTCxDQUFZLEtBQVosSUFBcUIsSUFBbEQsSUFDRSxLQUFLLE1BQUwsQ0FBWSxLQUFaLElBQXFCLElBRHZCLElBQytCLEtBQUssTUFBTCxDQUFZLEtBQVosSUFBcUIsSUFEdEQsQ0FBSixFQUNpRTtBQUMvRCxZQUFNLHdDQUFOO0FBQ0Q7O0FBRUQsUUFBSSxjQUFjLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsQ0FBMEIsSUFBMUIsQ0FBbEI7QUFDQSxRQUFJLGNBQWMsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixPQUFsQixDQUEwQixJQUExQixDQUFsQjtBQUNBLFFBQUksRUFBRSxjQUFjLENBQUMsQ0FBZixJQUFvQixjQUFjLENBQUMsQ0FBckMsQ0FBSixFQUE2QztBQUMzQyxZQUFNLDhDQUFOO0FBQ0Q7O0FBRUQsU0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFsQixDQUF5QixXQUF6QixFQUFzQyxDQUF0Qzs7QUFFQSxRQUFJLEtBQUssTUFBTCxJQUFlLEtBQUssTUFBeEIsRUFDQTtBQUNFLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsTUFBbEIsQ0FBeUIsV0FBekIsRUFBc0MsQ0FBdEM7QUFDRDs7QUFFRCxRQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixRQUFsQixHQUE2QixPQUE3QixDQUFxQyxJQUFyQyxDQUFaO0FBQ0EsUUFBSSxTQUFTLENBQUMsQ0FBZCxFQUFpQjtBQUNmLFlBQU0sMkJBQU47QUFDRDs7QUFFRCxTQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLFFBQWxCLEdBQTZCLE1BQTdCLENBQW9DLEtBQXBDLEVBQTJDLENBQTNDO0FBQ0Q7QUFDRixDQXZFRDs7QUF5RUEsT0FBTyxTQUFQLENBQWlCLGFBQWpCLEdBQWlDLFlBQ2pDO0FBQ0UsTUFBSSxNQUFNLFFBQVEsU0FBbEI7QUFDQSxNQUFJLE9BQU8sUUFBUSxTQUFuQjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksUUFBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFJLFFBQVEsS0FBSyxRQUFMLEVBQVo7QUFDQSxNQUFJLElBQUksTUFBTSxNQUFkOztBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUNBO0FBQ0UsUUFBSSxRQUFRLE1BQU0sQ0FBTixDQUFaO0FBQ0EsY0FBVSxNQUFNLE1BQU4sRUFBVjtBQUNBLGVBQVcsTUFBTSxPQUFOLEVBQVg7O0FBRUEsUUFBSSxNQUFNLE9BQVYsRUFDQTtBQUNFLFlBQU0sT0FBTjtBQUNEOztBQUVELFFBQUksT0FBTyxRQUFYLEVBQ0E7QUFDRSxhQUFPLFFBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSSxPQUFPLFFBQVEsU0FBbkIsRUFDQTtBQUNFLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQUcsTUFBTSxDQUFOLEVBQVMsU0FBVCxHQUFxQixXQUFyQixJQUFvQyxTQUF2QyxFQUFpRDtBQUMvQyxhQUFTLE1BQU0sQ0FBTixFQUFTLFNBQVQsR0FBcUIsV0FBOUI7QUFDRCxHQUZELE1BR0k7QUFDRixhQUFTLEtBQUssTUFBZDtBQUNEOztBQUVELE9BQUssSUFBTCxHQUFZLE9BQU8sTUFBbkI7QUFDQSxPQUFLLEdBQUwsR0FBVyxNQUFNLE1BQWpCOztBQUVBO0FBQ0EsU0FBTyxJQUFJLEtBQUosQ0FBVSxLQUFLLElBQWYsRUFBcUIsS0FBSyxHQUExQixDQUFQO0FBQ0QsQ0E5Q0Q7O0FBZ0RBLE9BQU8sU0FBUCxDQUFpQixZQUFqQixHQUFnQyxVQUFVLFNBQVYsRUFDaEM7QUFDRTtBQUNBLE1BQUksT0FBTyxRQUFRLFNBQW5CO0FBQ0EsTUFBSSxRQUFRLENBQUMsUUFBUSxTQUFyQjtBQUNBLE1BQUksTUFBTSxRQUFRLFNBQWxCO0FBQ0EsTUFBSSxTQUFTLENBQUMsUUFBUSxTQUF0QjtBQUNBLE1BQUksUUFBSjtBQUNBLE1BQUksU0FBSjtBQUNBLE1BQUksT0FBSjtBQUNBLE1BQUksVUFBSjtBQUNBLE1BQUksTUFBSjs7QUFFQSxNQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLE1BQUksSUFBSSxNQUFNLE1BQWQ7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFDQTtBQUNFLFFBQUksUUFBUSxNQUFNLENBQU4sQ0FBWjs7QUFFQSxRQUFJLGFBQWEsTUFBTSxLQUFOLElBQWUsSUFBaEMsRUFDQTtBQUNFLFlBQU0sWUFBTjtBQUNEO0FBQ0QsZUFBVyxNQUFNLE9BQU4sRUFBWDtBQUNBLGdCQUFZLE1BQU0sUUFBTixFQUFaO0FBQ0EsY0FBVSxNQUFNLE1BQU4sRUFBVjtBQUNBLGlCQUFhLE1BQU0sU0FBTixFQUFiOztBQUVBLFFBQUksT0FBTyxRQUFYLEVBQ0E7QUFDRSxhQUFPLFFBQVA7QUFDRDs7QUFFRCxRQUFJLFFBQVEsU0FBWixFQUNBO0FBQ0UsY0FBUSxTQUFSO0FBQ0Q7O0FBRUQsUUFBSSxNQUFNLE9BQVYsRUFDQTtBQUNFLFlBQU0sT0FBTjtBQUNEOztBQUVELFFBQUksU0FBUyxVQUFiLEVBQ0E7QUFDRSxlQUFTLFVBQVQ7QUFDRDtBQUNGOztBQUVELE1BQUksZUFBZSxJQUFJLFVBQUosQ0FBZSxJQUFmLEVBQXFCLEdBQXJCLEVBQTBCLFFBQVEsSUFBbEMsRUFBd0MsU0FBUyxHQUFqRCxDQUFuQjtBQUNBLE1BQUksUUFBUSxRQUFRLFNBQXBCLEVBQ0E7QUFDRSxTQUFLLElBQUwsR0FBWSxLQUFLLE1BQUwsQ0FBWSxPQUFaLEVBQVo7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQWI7QUFDQSxTQUFLLEdBQUwsR0FBVyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQVg7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxTQUFaLEVBQWQ7QUFDRDs7QUFFRCxNQUFHLE1BQU0sQ0FBTixFQUFTLFNBQVQsR0FBcUIsV0FBckIsSUFBb0MsU0FBdkMsRUFBaUQ7QUFDL0MsYUFBUyxNQUFNLENBQU4sRUFBUyxTQUFULEdBQXFCLFdBQTlCO0FBQ0QsR0FGRCxNQUdJO0FBQ0YsYUFBUyxLQUFLLE1BQWQ7QUFDRDs7QUFFRCxPQUFLLElBQUwsR0FBWSxhQUFhLENBQWIsR0FBaUIsTUFBN0I7QUFDQSxPQUFLLEtBQUwsR0FBYSxhQUFhLENBQWIsR0FBaUIsYUFBYSxLQUE5QixHQUFzQyxNQUFuRDtBQUNBLE9BQUssR0FBTCxHQUFXLGFBQWEsQ0FBYixHQUFpQixNQUE1QjtBQUNBLE9BQUssTUFBTCxHQUFjLGFBQWEsQ0FBYixHQUFpQixhQUFhLE1BQTlCLEdBQXVDLE1BQXJEO0FBQ0QsQ0FyRUQ7O0FBdUVBLE9BQU8sZUFBUCxHQUF5QixVQUFVLEtBQVYsRUFDekI7QUFDRSxNQUFJLE9BQU8sUUFBUSxTQUFuQjtBQUNBLE1BQUksUUFBUSxDQUFDLFFBQVEsU0FBckI7QUFDQSxNQUFJLE1BQU0sUUFBUSxTQUFsQjtBQUNBLE1BQUksU0FBUyxDQUFDLFFBQVEsU0FBdEI7QUFDQSxNQUFJLFFBQUo7QUFDQSxNQUFJLFNBQUo7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLFVBQUo7O0FBRUEsTUFBSSxJQUFJLE1BQU0sTUFBZDs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFDQTtBQUNFLFFBQUksUUFBUSxNQUFNLENBQU4sQ0FBWjtBQUNBLGVBQVcsTUFBTSxPQUFOLEVBQVg7QUFDQSxnQkFBWSxNQUFNLFFBQU4sRUFBWjtBQUNBLGNBQVUsTUFBTSxNQUFOLEVBQVY7QUFDQSxpQkFBYSxNQUFNLFNBQU4sRUFBYjs7QUFFQSxRQUFJLE9BQU8sUUFBWCxFQUNBO0FBQ0UsYUFBTyxRQUFQO0FBQ0Q7O0FBRUQsUUFBSSxRQUFRLFNBQVosRUFDQTtBQUNFLGNBQVEsU0FBUjtBQUNEOztBQUVELFFBQUksTUFBTSxPQUFWLEVBQ0E7QUFDRSxZQUFNLE9BQU47QUFDRDs7QUFFRCxRQUFJLFNBQVMsVUFBYixFQUNBO0FBQ0UsZUFBUyxVQUFUO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLGVBQWUsSUFBSSxVQUFKLENBQWUsSUFBZixFQUFxQixHQUFyQixFQUEwQixRQUFRLElBQWxDLEVBQXdDLFNBQVMsR0FBakQsQ0FBbkI7O0FBRUEsU0FBTyxZQUFQO0FBQ0QsQ0E3Q0Q7O0FBK0NBLE9BQU8sU0FBUCxDQUFpQixxQkFBakIsR0FBeUMsWUFDekM7QUFDRSxNQUFJLFFBQVEsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEVBQVosRUFDQTtBQUNFLFdBQU8sQ0FBUDtBQUNELEdBSEQsTUFLQTtBQUNFLFdBQU8sS0FBSyxNQUFMLENBQVkscUJBQVosRUFBUDtBQUNEO0FBQ0YsQ0FWRDs7QUFZQSxPQUFPLFNBQVAsQ0FBaUIsZ0JBQWpCLEdBQW9DLFlBQ3BDO0FBQ0UsTUFBSSxLQUFLLGFBQUwsSUFBc0IsUUFBUSxTQUFsQyxFQUE2QztBQUMzQyxVQUFNLGVBQU47QUFDRDtBQUNELFNBQU8sS0FBSyxhQUFaO0FBQ0QsQ0FORDs7QUFRQSxPQUFPLFNBQVAsQ0FBaUIsaUJBQWpCLEdBQXFDLFlBQ3JDO0FBQ0UsTUFBSSxPQUFPLENBQVg7QUFDQSxNQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLE1BQUksSUFBSSxNQUFNLE1BQWQ7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQ0E7QUFDRSxRQUFJLFFBQVEsTUFBTSxDQUFOLENBQVo7QUFDQSxZQUFRLE1BQU0saUJBQU4sRUFBUjtBQUNEOztBQUVELE1BQUksUUFBUSxDQUFaLEVBQ0E7QUFDRSxTQUFLLGFBQUwsR0FBcUIsZ0JBQWdCLHdCQUFyQztBQUNELEdBSEQsTUFLQTtBQUNFLFNBQUssYUFBTCxHQUFxQixPQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssS0FBTCxDQUFXLE1BQXJCLENBQTVCO0FBQ0Q7O0FBRUQsU0FBTyxLQUFLLGFBQVo7QUFDRCxDQXRCRDs7QUF3QkEsT0FBTyxTQUFQLENBQWlCLGVBQWpCLEdBQW1DLFlBQ25DO0FBQ0UsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsSUFBcUIsQ0FBekIsRUFDQTtBQUNFLFNBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBO0FBQ0Q7O0FBRUQsTUFBSSxjQUFjLElBQUksSUFBSixFQUFsQjtBQUNBLE1BQUksVUFBVSxJQUFJLE9BQUosRUFBZDtBQUNBLE1BQUksY0FBYyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQWxCO0FBQ0EsTUFBSSxhQUFKO0FBQ0EsTUFBSSxlQUFKO0FBQ0EsTUFBSSxpQkFBaUIsWUFBWSxZQUFaLEVBQXJCO0FBQ0EsaUJBQWUsT0FBZixDQUF1QixVQUFTLElBQVQsRUFBZTtBQUNwQyxnQkFBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0QsR0FGRDs7QUFJQSxTQUFPLENBQUMsWUFBWSxPQUFaLEVBQVIsRUFDQTtBQUNFLGtCQUFjLFlBQVksS0FBWixHQUFvQixLQUFwQixFQUFkO0FBQ0EsWUFBUSxHQUFSLENBQVksV0FBWjs7QUFFQTtBQUNBLG9CQUFnQixZQUFZLFFBQVosRUFBaEI7QUFDQSxRQUFJLElBQUksY0FBYyxNQUF0QjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUNBO0FBQ0UsVUFBSSxlQUFlLGNBQWMsQ0FBZCxDQUFuQjtBQUNBLHdCQUNRLGFBQWEsa0JBQWIsQ0FBZ0MsV0FBaEMsRUFBNkMsSUFBN0MsQ0FEUjs7QUFHQTtBQUNBLFVBQUksbUJBQW1CLElBQW5CLElBQ0ksQ0FBQyxRQUFRLFFBQVIsQ0FBaUIsZUFBakIsQ0FEVCxFQUVBO0FBQ0UsWUFBSSxxQkFBcUIsZ0JBQWdCLFlBQWhCLEVBQXpCOztBQUVBLDJCQUFtQixPQUFuQixDQUEyQixVQUFTLElBQVQsRUFBZTtBQUN4QyxzQkFBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0QsU0FGRDtBQUdEO0FBQ0Y7QUFDRjs7QUFFRCxPQUFLLFdBQUwsR0FBbUIsS0FBbkI7O0FBRUEsTUFBSSxRQUFRLElBQVIsTUFBa0IsS0FBSyxLQUFMLENBQVcsTUFBakMsRUFDQTtBQUNFLFFBQUkseUJBQXlCLENBQTdCOztBQUVBLFFBQUksSUFBSSxRQUFRLElBQVIsRUFBUjtBQUNDLFdBQU8sSUFBUCxDQUFZLFFBQVEsR0FBcEIsRUFBeUIsT0FBekIsQ0FBaUMsVUFBUyxTQUFULEVBQW9CO0FBQ3BELFVBQUksY0FBYyxRQUFRLEdBQVIsQ0FBWSxTQUFaLENBQWxCO0FBQ0EsVUFBSSxZQUFZLEtBQVosSUFBcUIsSUFBekIsRUFDQTtBQUNFO0FBQ0Q7QUFDRixLQU5BOztBQVFELFFBQUksMEJBQTBCLEtBQUssS0FBTCxDQUFXLE1BQXpDLEVBQ0E7QUFDRSxXQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDRDtBQUNGO0FBQ0YsQ0FsRUQ7O0FBb0VBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7QUNoZUEsSUFBSSxNQUFKO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaOztBQUVBLFNBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQjtBQUM3QixXQUFTLFFBQVEsVUFBUixDQUFULENBRDZCLENBQ0M7QUFDOUIsT0FBSyxNQUFMLEdBQWMsTUFBZDs7QUFFQSxPQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsT0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNEOztBQUVELGNBQWMsU0FBZCxDQUF3QixPQUF4QixHQUFrQyxZQUNsQztBQUNFLE1BQUksU0FBUyxLQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQWI7QUFDQSxNQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixJQUFwQixDQUFaO0FBQ0EsTUFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUIsS0FBakIsQ0FBWDtBQUNBLE9BQUssWUFBTCxDQUFrQixJQUFsQjtBQUNBLFNBQU8sS0FBSyxTQUFaO0FBQ0QsQ0FQRDs7QUFTQSxjQUFjLFNBQWQsQ0FBd0IsR0FBeEIsR0FBOEIsVUFBVSxRQUFWLEVBQW9CLFVBQXBCLEVBQWdDLE9BQWhDLEVBQXlDLFVBQXpDLEVBQXFELFVBQXJELEVBQzlCO0FBQ0U7QUFDQSxNQUFJLFdBQVcsSUFBWCxJQUFtQixjQUFjLElBQWpDLElBQXlDLGNBQWMsSUFBM0QsRUFBaUU7QUFDL0QsUUFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ3BCLFlBQU0sZ0JBQU47QUFDRDtBQUNELFFBQUksY0FBYyxJQUFsQixFQUF3QjtBQUN0QixZQUFNLHNCQUFOO0FBQ0Q7QUFDRCxRQUFJLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsUUFBcEIsSUFBZ0MsQ0FBQyxDQUFyQyxFQUF3QztBQUN0QyxZQUFNLGtDQUFOO0FBQ0Q7O0FBRUQsU0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixRQUFqQjs7QUFFQSxRQUFJLFNBQVMsTUFBVCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQixZQUFNLHVCQUFOO0FBQ0Q7QUFDRCxRQUFJLFdBQVcsS0FBWCxJQUFvQixJQUF4QixFQUE4QjtBQUM1QixZQUFPLHNCQUFQO0FBQ0Q7O0FBRUQsYUFBUyxNQUFULEdBQWtCLFVBQWxCO0FBQ0EsZUFBVyxLQUFYLEdBQW1CLFFBQW5COztBQUVBLFdBQU8sUUFBUDtBQUNELEdBeEJELE1BeUJLO0FBQ0g7QUFDQSxpQkFBYSxPQUFiO0FBQ0EsaUJBQWEsVUFBYjtBQUNBLGNBQVUsUUFBVjtBQUNBLFFBQUksY0FBYyxXQUFXLFFBQVgsRUFBbEI7QUFDQSxRQUFJLGNBQWMsV0FBVyxRQUFYLEVBQWxCOztBQUVBLFFBQUksRUFBRSxlQUFlLElBQWYsSUFBdUIsWUFBWSxlQUFaLE1BQWlDLElBQTFELENBQUosRUFBcUU7QUFDbkUsWUFBTSwrQkFBTjtBQUNEO0FBQ0QsUUFBSSxFQUFFLGVBQWUsSUFBZixJQUF1QixZQUFZLGVBQVosTUFBaUMsSUFBMUQsQ0FBSixFQUFxRTtBQUNuRSxZQUFNLCtCQUFOO0FBQ0Q7O0FBRUQsUUFBSSxlQUFlLFdBQW5CLEVBQ0E7QUFDRSxjQUFRLFlBQVIsR0FBdUIsS0FBdkI7QUFDQSxhQUFPLFlBQVksR0FBWixDQUFnQixPQUFoQixFQUF5QixVQUF6QixFQUFxQyxVQUFyQyxDQUFQO0FBQ0QsS0FKRCxNQU1BO0FBQ0UsY0FBUSxZQUFSLEdBQXVCLElBQXZCOztBQUVBO0FBQ0EsY0FBUSxNQUFSLEdBQWlCLFVBQWpCO0FBQ0EsY0FBUSxNQUFSLEdBQWlCLFVBQWpCOztBQUVBO0FBQ0EsVUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLE9BQW5CLElBQThCLENBQUMsQ0FBbkMsRUFBc0M7QUFDcEMsY0FBTSx3Q0FBTjtBQUNEOztBQUVELFdBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsT0FBaEI7O0FBRUE7QUFDQSxVQUFJLEVBQUUsUUFBUSxNQUFSLElBQWtCLElBQWxCLElBQTBCLFFBQVEsTUFBUixJQUFrQixJQUE5QyxDQUFKLEVBQXlEO0FBQ3ZELGNBQU0sb0NBQU47QUFDRDs7QUFFRCxVQUFJLEVBQUUsUUFBUSxNQUFSLENBQWUsS0FBZixDQUFxQixPQUFyQixDQUE2QixPQUE3QixLQUF5QyxDQUFDLENBQTFDLElBQStDLFFBQVEsTUFBUixDQUFlLEtBQWYsQ0FBcUIsT0FBckIsQ0FBNkIsT0FBN0IsS0FBeUMsQ0FBQyxDQUEzRixDQUFKLEVBQW1HO0FBQ2pHLGNBQU0sc0RBQU47QUFDRDs7QUFFRCxjQUFRLE1BQVIsQ0FBZSxLQUFmLENBQXFCLElBQXJCLENBQTBCLE9BQTFCO0FBQ0EsY0FBUSxNQUFSLENBQWUsS0FBZixDQUFxQixJQUFyQixDQUEwQixPQUExQjs7QUFFQSxhQUFPLE9BQVA7QUFDRDtBQUNGO0FBQ0YsQ0E5RUQ7O0FBZ0ZBLGNBQWMsU0FBZCxDQUF3QixNQUF4QixHQUFpQyxVQUFVLElBQVYsRUFBZ0I7QUFDL0MsTUFBSSxnQkFBZ0IsTUFBcEIsRUFBNEI7QUFDMUIsUUFBSSxRQUFRLElBQVo7QUFDQSxRQUFJLE1BQU0sZUFBTixNQUEyQixJQUEvQixFQUFxQztBQUNuQyxZQUFNLDZCQUFOO0FBQ0Q7QUFDRCxRQUFJLEVBQUUsU0FBUyxLQUFLLFNBQWQsSUFBNEIsTUFBTSxNQUFOLElBQWdCLElBQWhCLElBQXdCLE1BQU0sTUFBTixDQUFhLFlBQWIsSUFBNkIsSUFBbkYsQ0FBSixFQUErRjtBQUM3RixZQUFNLHNCQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLG1CQUFtQixFQUF2Qjs7QUFFQSx1QkFBbUIsaUJBQWlCLE1BQWpCLENBQXdCLE1BQU0sUUFBTixFQUF4QixDQUFuQjs7QUFFQSxRQUFJLElBQUo7QUFDQSxRQUFJLElBQUksaUJBQWlCLE1BQXpCO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQ0E7QUFDRSxhQUFPLGlCQUFpQixDQUFqQixDQUFQO0FBQ0EsWUFBTSxNQUFOLENBQWEsSUFBYjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxtQkFBbUIsRUFBdkI7O0FBRUEsdUJBQW1CLGlCQUFpQixNQUFqQixDQUF3QixNQUFNLFFBQU4sRUFBeEIsQ0FBbkI7O0FBRUEsUUFBSSxJQUFKO0FBQ0EsUUFBSSxpQkFBaUIsTUFBckI7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksQ0FBcEIsRUFBdUIsR0FBdkIsRUFDQTtBQUNFLGFBQU8saUJBQWlCLENBQWpCLENBQVA7QUFDQSxZQUFNLE1BQU4sQ0FBYSxJQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLFNBQVMsS0FBSyxTQUFsQixFQUNBO0FBQ0UsV0FBSyxZQUFMLENBQWtCLElBQWxCO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksT0FBWixDQUFvQixLQUFwQixDQUFaO0FBQ0EsU0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFuQixFQUEwQixDQUExQjs7QUFFQTtBQUNBLFVBQU0sTUFBTixHQUFlLElBQWY7QUFDRCxHQS9DRCxNQWdESyxJQUFJLGdCQUFnQixLQUFwQixFQUEyQjtBQUM5QixXQUFPLElBQVA7QUFDQSxRQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixZQUFNLGVBQU47QUFDRDtBQUNELFFBQUksQ0FBQyxLQUFLLFlBQVYsRUFBd0I7QUFDdEIsWUFBTSwwQkFBTjtBQUNEO0FBQ0QsUUFBSSxFQUFFLEtBQUssTUFBTCxJQUFlLElBQWYsSUFBdUIsS0FBSyxNQUFMLElBQWUsSUFBeEMsQ0FBSixFQUFtRDtBQUNqRCxZQUFNLCtCQUFOO0FBQ0Q7O0FBRUQ7O0FBRUEsUUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsQ0FBMEIsSUFBMUIsS0FBbUMsQ0FBQyxDQUFwQyxJQUF5QyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE9BQWxCLENBQTBCLElBQTFCLEtBQW1DLENBQUMsQ0FBL0UsQ0FBSixFQUF1RjtBQUNyRixZQUFNLDhDQUFOO0FBQ0Q7O0FBRUQsUUFBSSxRQUFRLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsQ0FBMEIsSUFBMUIsQ0FBWjtBQUNBLFNBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEM7QUFDQSxZQUFRLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsT0FBbEIsQ0FBMEIsSUFBMUIsQ0FBUjtBQUNBLFNBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEM7O0FBRUE7O0FBRUEsUUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLEtBQVosSUFBcUIsSUFBckIsSUFBNkIsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixlQUFsQixNQUF1QyxJQUF0RSxDQUFKLEVBQWlGO0FBQy9FLFlBQU0sa0RBQU47QUFDRDtBQUNELFFBQUksS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixlQUFsQixHQUFvQyxLQUFwQyxDQUEwQyxPQUExQyxDQUFrRCxJQUFsRCxLQUEyRCxDQUFDLENBQWhFLEVBQW1FO0FBQ2pFLFlBQU0seUNBQU47QUFDRDs7QUFFRCxRQUFJLFFBQVEsS0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixlQUFsQixHQUFvQyxLQUFwQyxDQUEwQyxPQUExQyxDQUFrRCxJQUFsRCxDQUFaO0FBQ0EsU0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixlQUFsQixHQUFvQyxLQUFwQyxDQUEwQyxNQUExQyxDQUFpRCxLQUFqRCxFQUF3RCxDQUF4RDtBQUNEO0FBQ0YsQ0FwRkQ7O0FBc0ZBLGNBQWMsU0FBZCxDQUF3QixZQUF4QixHQUF1QyxZQUN2QztBQUNFLE9BQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsSUFBNUI7QUFDRCxDQUhEOztBQUtBLGNBQWMsU0FBZCxDQUF3QixTQUF4QixHQUFvQyxZQUNwQztBQUNFLFNBQU8sS0FBSyxNQUFaO0FBQ0QsQ0FIRDs7QUFLQSxjQUFjLFNBQWQsQ0FBd0IsV0FBeEIsR0FBc0MsWUFDdEM7QUFDRSxNQUFJLEtBQUssUUFBTCxJQUFpQixJQUFyQixFQUNBO0FBQ0UsUUFBSSxXQUFXLEVBQWY7QUFDQSxRQUFJLFNBQVMsS0FBSyxTQUFMLEVBQWI7QUFDQSxRQUFJLElBQUksT0FBTyxNQUFmO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQ0E7QUFDRSxpQkFBVyxTQUFTLE1BQVQsQ0FBZ0IsT0FBTyxDQUFQLEVBQVUsUUFBVixFQUFoQixDQUFYO0FBQ0Q7QUFDRCxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDtBQUNELFNBQU8sS0FBSyxRQUFaO0FBQ0QsQ0FkRDs7QUFnQkEsY0FBYyxTQUFkLENBQXdCLGFBQXhCLEdBQXdDLFlBQ3hDO0FBQ0UsT0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0QsQ0FIRDs7QUFLQSxjQUFjLFNBQWQsQ0FBd0IsYUFBeEIsR0FBd0MsWUFDeEM7QUFDRSxPQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRCxDQUhEOztBQUtBLGNBQWMsU0FBZCxDQUF3QiwrQkFBeEIsR0FBMEQsWUFDMUQ7QUFDRSxPQUFLLDBCQUFMLEdBQWtDLElBQWxDO0FBQ0QsQ0FIRDs7QUFLQSxjQUFjLFNBQWQsQ0FBd0IsV0FBeEIsR0FBc0MsWUFDdEM7QUFDRSxNQUFJLEtBQUssUUFBTCxJQUFpQixJQUFyQixFQUNBO0FBQ0UsUUFBSSxXQUFXLEVBQWY7QUFDQSxRQUFJLFNBQVMsS0FBSyxTQUFMLEVBQWI7QUFDQSxRQUFJLElBQUksT0FBTyxNQUFmO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQU8sTUFBM0IsRUFBbUMsR0FBbkMsRUFDQTtBQUNFLGlCQUFXLFNBQVMsTUFBVCxDQUFnQixPQUFPLENBQVAsRUFBVSxRQUFWLEVBQWhCLENBQVg7QUFDRDs7QUFFRCxlQUFXLFNBQVMsTUFBVCxDQUFnQixLQUFLLEtBQXJCLENBQVg7O0FBRUEsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0Q7QUFDRCxTQUFPLEtBQUssUUFBWjtBQUNELENBakJEOztBQW1CQSxjQUFjLFNBQWQsQ0FBd0IsNkJBQXhCLEdBQXdELFlBQ3hEO0FBQ0UsU0FBTyxLQUFLLDBCQUFaO0FBQ0QsQ0FIRDs7QUFLQSxjQUFjLFNBQWQsQ0FBd0IsNkJBQXhCLEdBQXdELFVBQVUsUUFBVixFQUN4RDtBQUNFLE1BQUksS0FBSywwQkFBTCxJQUFtQyxJQUF2QyxFQUE2QztBQUMzQyxVQUFNLGVBQU47QUFDRDs7QUFFRCxPQUFLLDBCQUFMLEdBQWtDLFFBQWxDO0FBQ0QsQ0FQRDs7QUFTQSxjQUFjLFNBQWQsQ0FBd0IsT0FBeEIsR0FBa0MsWUFDbEM7QUFDRSxTQUFPLEtBQUssU0FBWjtBQUNELENBSEQ7O0FBS0EsY0FBYyxTQUFkLENBQXdCLFlBQXhCLEdBQXVDLFVBQVUsS0FBVixFQUN2QztBQUNFLE1BQUksTUFBTSxlQUFOLE1BQTJCLElBQS9CLEVBQXFDO0FBQ25DLFVBQU0sNkJBQU47QUFDRDs7QUFFRCxPQUFLLFNBQUwsR0FBaUIsS0FBakI7QUFDQTtBQUNBLE1BQUksTUFBTSxNQUFOLElBQWdCLElBQXBCLEVBQ0E7QUFDRSxVQUFNLE1BQU4sR0FBZSxLQUFLLE1BQUwsQ0FBWSxPQUFaLENBQW9CLFdBQXBCLENBQWY7QUFDRDtBQUNGLENBWkQ7O0FBY0EsY0FBYyxTQUFkLENBQXdCLFNBQXhCLEdBQW9DLFlBQ3BDO0FBQ0UsU0FBTyxLQUFLLE1BQVo7QUFDRCxDQUhEOztBQUtBLGNBQWMsU0FBZCxDQUF3QixvQkFBeEIsR0FBK0MsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQy9DO0FBQ0UsTUFBSSxFQUFFLGFBQWEsSUFBYixJQUFxQixjQUFjLElBQXJDLENBQUosRUFBZ0Q7QUFDOUMsVUFBTSxlQUFOO0FBQ0Q7O0FBRUQsTUFBSSxhQUFhLFVBQWpCLEVBQ0E7QUFDRSxXQUFPLElBQVA7QUFDRDtBQUNEO0FBQ0EsTUFBSSxhQUFhLFVBQVUsUUFBVixFQUFqQjtBQUNBLE1BQUksVUFBSjs7QUFFQSxLQUNBO0FBQ0UsaUJBQWEsV0FBVyxTQUFYLEVBQWI7O0FBRUEsUUFBSSxjQUFjLElBQWxCLEVBQ0E7QUFDRTtBQUNEOztBQUVELFFBQUksY0FBYyxVQUFsQixFQUNBO0FBQ0UsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsaUJBQWEsV0FBVyxRQUFYLEVBQWI7QUFDQSxRQUFJLGNBQWMsSUFBbEIsRUFDQTtBQUNFO0FBQ0Q7QUFDRixHQW5CRCxRQW1CUyxJQW5CVDtBQW9CQTtBQUNBLGVBQWEsV0FBVyxRQUFYLEVBQWI7O0FBRUEsS0FDQTtBQUNFLGlCQUFhLFdBQVcsU0FBWCxFQUFiOztBQUVBLFFBQUksY0FBYyxJQUFsQixFQUNBO0FBQ0U7QUFDRDs7QUFFRCxRQUFJLGNBQWMsU0FBbEIsRUFDQTtBQUNFLGFBQU8sSUFBUDtBQUNEOztBQUVELGlCQUFhLFdBQVcsUUFBWCxFQUFiO0FBQ0EsUUFBSSxjQUFjLElBQWxCLEVBQ0E7QUFDRTtBQUNEO0FBQ0YsR0FuQkQsUUFtQlMsSUFuQlQ7O0FBcUJBLFNBQU8sS0FBUDtBQUNELENBM0REOztBQTZEQSxjQUFjLFNBQWQsQ0FBd0IseUJBQXhCLEdBQW9ELFlBQ3BEO0FBQ0UsTUFBSSxJQUFKO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsTUFBSSxVQUFKO0FBQ0EsTUFBSSxtQkFBSjtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxRQUFRLEtBQUssV0FBTCxFQUFaO0FBQ0EsTUFBSSxJQUFJLE1BQU0sTUFBZDtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUNBO0FBQ0UsV0FBTyxNQUFNLENBQU4sQ0FBUDs7QUFFQSxpQkFBYSxLQUFLLE1BQWxCO0FBQ0EsaUJBQWEsS0FBSyxNQUFsQjtBQUNBLFNBQUssR0FBTCxHQUFXLElBQVg7QUFDQSxTQUFLLFdBQUwsR0FBbUIsVUFBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsVUFBbkI7O0FBRUEsUUFBSSxjQUFjLFVBQWxCLEVBQ0E7QUFDRSxXQUFLLEdBQUwsR0FBVyxXQUFXLFFBQVgsRUFBWDtBQUNBO0FBQ0Q7O0FBRUQsMEJBQXNCLFdBQVcsUUFBWCxFQUF0Qjs7QUFFQSxXQUFPLEtBQUssR0FBTCxJQUFZLElBQW5CLEVBQ0E7QUFDRSxXQUFLLFdBQUwsR0FBbUIsVUFBbkI7QUFDQSw0QkFBc0IsV0FBVyxRQUFYLEVBQXRCOztBQUVBLGFBQU8sS0FBSyxHQUFMLElBQVksSUFBbkIsRUFDQTtBQUNFLFlBQUksdUJBQXVCLG1CQUEzQixFQUNBO0FBQ0UsZUFBSyxHQUFMLEdBQVcsbUJBQVg7QUFDQTtBQUNEOztBQUVELFlBQUksdUJBQXVCLEtBQUssU0FBaEMsRUFDQTtBQUNFO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLEdBQUwsSUFBWSxJQUFoQixFQUFzQjtBQUNwQixnQkFBTSxlQUFOO0FBQ0Q7QUFDRCxhQUFLLFdBQUwsR0FBbUIsb0JBQW9CLFNBQXBCLEVBQW5CO0FBQ0EsOEJBQXNCLEtBQUssV0FBTCxDQUFpQixRQUFqQixFQUF0QjtBQUNEOztBQUVELFVBQUksdUJBQXVCLEtBQUssU0FBaEMsRUFDQTtBQUNFO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLLEdBQUwsSUFBWSxJQUFoQixFQUNBO0FBQ0UsYUFBSyxXQUFMLEdBQW1CLG9CQUFvQixTQUFwQixFQUFuQjtBQUNBLDhCQUFzQixLQUFLLFdBQUwsQ0FBaUIsUUFBakIsRUFBdEI7QUFDRDtBQUNGOztBQUVELFFBQUksS0FBSyxHQUFMLElBQVksSUFBaEIsRUFBc0I7QUFDcEIsWUFBTSxlQUFOO0FBQ0Q7QUFDRjtBQUNGLENBckVEOztBQXVFQSxjQUFjLFNBQWQsQ0FBd0Isd0JBQXhCLEdBQW1ELFVBQVUsU0FBVixFQUFxQixVQUFyQixFQUNuRDtBQUNFLE1BQUksYUFBYSxVQUFqQixFQUNBO0FBQ0UsV0FBTyxVQUFVLFFBQVYsRUFBUDtBQUNEO0FBQ0QsTUFBSSxrQkFBa0IsVUFBVSxRQUFWLEVBQXRCOztBQUVBLEtBQ0E7QUFDRSxRQUFJLG1CQUFtQixJQUF2QixFQUNBO0FBQ0U7QUFDRDtBQUNELFFBQUksbUJBQW1CLFdBQVcsUUFBWCxFQUF2Qjs7QUFFQSxPQUNBO0FBQ0UsVUFBSSxvQkFBb0IsSUFBeEIsRUFDQTtBQUNFO0FBQ0Q7O0FBRUQsVUFBSSxvQkFBb0IsZUFBeEIsRUFDQTtBQUNFLGVBQU8sZ0JBQVA7QUFDRDtBQUNELHlCQUFtQixpQkFBaUIsU0FBakIsR0FBNkIsUUFBN0IsRUFBbkI7QUFDRCxLQVpELFFBWVMsSUFaVDs7QUFjQSxzQkFBa0IsZ0JBQWdCLFNBQWhCLEdBQTRCLFFBQTVCLEVBQWxCO0FBQ0QsR0F2QkQsUUF1QlMsSUF2QlQ7O0FBeUJBLFNBQU8sZUFBUDtBQUNELENBbENEOztBQW9DQSxjQUFjLFNBQWQsQ0FBd0IsdUJBQXhCLEdBQWtELFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUN4RSxNQUFJLFNBQVMsSUFBVCxJQUFpQixTQUFTLElBQTlCLEVBQW9DO0FBQ2xDLFlBQVEsS0FBSyxTQUFiO0FBQ0EsWUFBUSxDQUFSO0FBQ0Q7QUFDRCxNQUFJLElBQUo7O0FBRUEsTUFBSSxRQUFRLE1BQU0sUUFBTixFQUFaO0FBQ0EsTUFBSSxJQUFJLE1BQU0sTUFBZDtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUNBO0FBQ0UsV0FBTyxNQUFNLENBQU4sQ0FBUDtBQUNBLFNBQUssa0JBQUwsR0FBMEIsS0FBMUI7O0FBRUEsUUFBSSxLQUFLLEtBQUwsSUFBYyxJQUFsQixFQUNBO0FBQ0UsV0FBSyx1QkFBTCxDQUE2QixLQUFLLEtBQWxDLEVBQXlDLFFBQVEsQ0FBakQ7QUFDRDtBQUNGO0FBQ0YsQ0FuQkQ7O0FBcUJBLGNBQWMsU0FBZCxDQUF3QixtQkFBeEIsR0FBOEMsWUFDOUM7QUFDRSxNQUFJLElBQUo7O0FBRUEsTUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQW5CO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQ0E7QUFDRSxXQUFPLEtBQUssS0FBTCxDQUFXLENBQVgsQ0FBUDs7QUFFQSxRQUFJLEtBQUssb0JBQUwsQ0FBMEIsS0FBSyxNQUEvQixFQUF1QyxLQUFLLE1BQTVDLENBQUosRUFDQTtBQUNFLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQWZEOztBQWlCQSxPQUFPLE9BQVAsR0FBaUIsYUFBakI7Ozs7O0FDMWVBLFNBQVMsWUFBVCxDQUFzQixZQUF0QixFQUFvQztBQUNsQyxPQUFLLFlBQUwsR0FBb0IsWUFBcEI7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7O0FDSkEsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7QUFDQSxJQUFJLGFBQWEsUUFBUSxjQUFSLENBQWpCO0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0QjtBQUNBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7QUFDQSxJQUFJLE1BQUo7O0FBRUEsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQixHQUFuQixFQUF3QixJQUF4QixFQUE4QixLQUE5QixFQUFxQztBQUNuQyxXQUFTLFFBQVEsVUFBUixDQUFUO0FBQ0E7QUFDQSxNQUFJLFFBQVEsSUFBUixJQUFnQixTQUFTLElBQTdCLEVBQW1DO0FBQ2pDLFlBQVEsR0FBUjtBQUNEOztBQUVELGVBQWEsSUFBYixDQUFrQixJQUFsQixFQUF3QixLQUF4Qjs7QUFFQTtBQUNBLE1BQUksY0FBYyxNQUFkLElBQXdCLEdBQUcsWUFBSCxJQUFtQixJQUEvQyxFQUNFLEtBQUssR0FBRyxZQUFSOztBQUVGLE9BQUssYUFBTCxHQUFxQixRQUFRLFNBQTdCO0FBQ0EsT0FBSyxrQkFBTCxHQUEwQixRQUFRLFNBQWxDO0FBQ0EsT0FBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0EsT0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLE9BQUssWUFBTCxHQUFvQixFQUFwQjs7QUFFQSxNQUFJLFFBQVEsSUFBUixJQUFnQixPQUFPLElBQTNCLEVBQ0UsS0FBSyxJQUFMLEdBQVksSUFBSSxVQUFKLENBQWUsSUFBSSxDQUFuQixFQUFzQixJQUFJLENBQTFCLEVBQTZCLEtBQUssS0FBbEMsRUFBeUMsS0FBSyxNQUE5QyxDQUFaLENBREYsS0FHRSxLQUFLLElBQUwsR0FBWSxJQUFJLFVBQUosRUFBWjtBQUNIOztBQUVELE1BQU0sU0FBTixHQUFrQixPQUFPLE1BQVAsQ0FBYyxhQUFhLFNBQTNCLENBQWxCO0FBQ0EsS0FBSyxJQUFJLElBQVQsSUFBaUIsWUFBakIsRUFBK0I7QUFDN0IsUUFBTSxJQUFOLElBQWMsYUFBYSxJQUFiLENBQWQ7QUFDRDs7QUFFRCxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsR0FBMkIsWUFDM0I7QUFDRSxTQUFPLEtBQUssS0FBWjtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQzNCO0FBQ0UsU0FBTyxLQUFLLEtBQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsU0FBTyxLQUFLLEtBQVo7QUFDRCxDQVREOztBQVdBLE1BQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUMzQjtBQUNFLFNBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixVQUFVLEtBQVYsRUFDM0I7QUFDRSxPQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLEtBQWxCO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsWUFDNUI7QUFDRSxTQUFPLEtBQUssSUFBTCxDQUFVLE1BQWpCO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsVUFBVSxNQUFWLEVBQzVCO0FBQ0UsT0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixNQUFuQjtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFVBQWhCLEdBQTZCLFlBQzdCO0FBQ0UsU0FBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUF2QztBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFVBQWhCLEdBQTZCLFlBQzdCO0FBQ0UsU0FBTyxLQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUF4QztBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQzVCO0FBQ0UsU0FBTyxJQUFJLE1BQUosQ0FBVyxLQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUEzQyxFQUNDLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBYyxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBRGxDLENBQVA7QUFFRCxDQUpEOztBQU1BLE1BQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixZQUM5QjtBQUNFLFNBQU8sSUFBSSxNQUFKLENBQVcsS0FBSyxJQUFMLENBQVUsQ0FBckIsRUFBd0IsS0FBSyxJQUFMLENBQVUsQ0FBbEMsQ0FBUDtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLE9BQWhCLEdBQTBCLFlBQzFCO0FBQ0UsU0FBTyxLQUFLLElBQVo7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixZQUM5QjtBQUNFLFNBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixLQUFLLElBQUwsQ0FBVSxLQUE1QixHQUNULEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsS0FBSyxJQUFMLENBQVUsTUFEOUIsQ0FBUDtBQUVELENBSkQ7O0FBTUEsTUFBTSxTQUFOLENBQWdCLE9BQWhCLEdBQTBCLFVBQVUsU0FBVixFQUFxQixTQUFyQixFQUMxQjtBQUNFLE9BQUssSUFBTCxDQUFVLENBQVYsR0FBYyxVQUFVLENBQXhCO0FBQ0EsT0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLFVBQVUsQ0FBeEI7QUFDQSxPQUFLLElBQUwsQ0FBVSxLQUFWLEdBQWtCLFVBQVUsS0FBNUI7QUFDQSxPQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLFVBQVUsTUFBN0I7QUFDRCxDQU5EOztBQVFBLE1BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQzVCO0FBQ0UsT0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLEtBQUssS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixDQUFyQztBQUNBLE9BQUssSUFBTCxDQUFVLENBQVYsR0FBYyxLQUFLLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBdEM7QUFDRCxDQUpEOztBQU1BLE1BQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQzlCO0FBQ0UsT0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLENBQWQ7QUFDQSxPQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsQ0FBZDtBQUNELENBSkQ7O0FBTUEsTUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFDekI7QUFDRSxPQUFLLElBQUwsQ0FBVSxDQUFWLElBQWUsRUFBZjtBQUNBLE9BQUssSUFBTCxDQUFVLENBQVYsSUFBZSxFQUFmO0FBQ0QsQ0FKRDs7QUFNQSxNQUFNLFNBQU4sQ0FBZ0IsaUJBQWhCLEdBQW9DLFVBQVUsRUFBVixFQUNwQztBQUNFLE1BQUksV0FBVyxFQUFmO0FBQ0EsTUFBSSxJQUFKO0FBQ0EsTUFBSSxPQUFPLElBQVg7O0FBRUEsT0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFTLElBQVQsRUFBZTs7QUFFaEMsUUFBSSxLQUFLLE1BQUwsSUFBZSxFQUFuQixFQUNBO0FBQ0UsVUFBSSxLQUFLLE1BQUwsSUFBZSxJQUFuQixFQUNFLE1BQU0sd0JBQU47O0FBRUYsZUFBUyxJQUFULENBQWMsSUFBZDtBQUNEO0FBQ0YsR0FURDs7QUFXQSxTQUFPLFFBQVA7QUFDRCxDQWxCRDs7QUFvQkEsTUFBTSxTQUFOLENBQWdCLGVBQWhCLEdBQWtDLFVBQVUsS0FBVixFQUNsQztBQUNFLE1BQUksV0FBVyxFQUFmO0FBQ0EsTUFBSSxJQUFKOztBQUVBLE1BQUksT0FBTyxJQUFYO0FBQ0EsT0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFTLElBQVQsRUFBZTs7QUFFaEMsUUFBSSxFQUFFLEtBQUssTUFBTCxJQUFlLElBQWYsSUFBdUIsS0FBSyxNQUFMLElBQWUsSUFBeEMsQ0FBSixFQUNFLE1BQU0scUNBQU47O0FBRUYsUUFBSyxLQUFLLE1BQUwsSUFBZSxLQUFoQixJQUEyQixLQUFLLE1BQUwsSUFBZSxLQUE5QyxFQUNBO0FBQ0UsZUFBUyxJQUFULENBQWMsSUFBZDtBQUNEO0FBQ0YsR0FURDs7QUFXQSxTQUFPLFFBQVA7QUFDRCxDQWxCRDs7QUFvQkEsTUFBTSxTQUFOLENBQWdCLGdCQUFoQixHQUFtQyxZQUNuQztBQUNFLE1BQUksWUFBWSxJQUFJLE9BQUosRUFBaEI7QUFDQSxNQUFJLElBQUo7O0FBRUEsTUFBSSxPQUFPLElBQVg7QUFDQSxPQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFVBQVMsSUFBVCxFQUFlOztBQUVoQyxRQUFJLEtBQUssTUFBTCxJQUFlLElBQW5CLEVBQ0E7QUFDRSxnQkFBVSxHQUFWLENBQWMsS0FBSyxNQUFuQjtBQUNELEtBSEQsTUFLQTtBQUNFLFVBQUksS0FBSyxNQUFMLElBQWUsSUFBbkIsRUFBeUI7QUFDdkIsY0FBTSxzQkFBTjtBQUNEOztBQUVELGdCQUFVLEdBQVYsQ0FBYyxLQUFLLE1BQW5CO0FBQ0Q7QUFDRixHQWREOztBQWdCQSxTQUFPLFNBQVA7QUFDRCxDQXZCRDs7QUF5QkEsTUFBTSxTQUFOLENBQWdCLFlBQWhCLEdBQStCLFlBQy9CO0FBQ0UsTUFBSSxvQkFBb0IsSUFBSSxHQUFKLEVBQXhCO0FBQ0EsTUFBSSxTQUFKO0FBQ0EsTUFBSSxRQUFKOztBQUVBLG9CQUFrQixHQUFsQixDQUFzQixJQUF0Qjs7QUFFQSxNQUFJLEtBQUssS0FBTCxJQUFjLElBQWxCLEVBQ0E7QUFDRSxRQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsUUFBWCxFQUFaO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFDQTtBQUNFLGtCQUFZLE1BQU0sQ0FBTixDQUFaO0FBQ0EsaUJBQVcsVUFBVSxZQUFWLEVBQVg7QUFDQSxlQUFTLE9BQVQsQ0FBaUIsVUFBUyxJQUFULEVBQWU7QUFDOUIsMEJBQWtCLEdBQWxCLENBQXNCLElBQXRCO0FBQ0QsT0FGRDtBQUdEO0FBQ0Y7O0FBRUQsU0FBTyxpQkFBUDtBQUNELENBdEJEOztBQXdCQSxNQUFNLFNBQU4sQ0FBZ0IsZUFBaEIsR0FBa0MsWUFDbEM7QUFDRSxNQUFJLGVBQWUsQ0FBbkI7QUFDQSxNQUFJLFNBQUo7O0FBRUEsTUFBRyxLQUFLLEtBQUwsSUFBYyxJQUFqQixFQUFzQjtBQUNwQixtQkFBZSxDQUFmO0FBQ0QsR0FGRCxNQUlBO0FBQ0UsUUFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLFFBQVgsRUFBWjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQ0E7QUFDRSxrQkFBWSxNQUFNLENBQU4sQ0FBWjs7QUFFQSxzQkFBZ0IsVUFBVSxlQUFWLEVBQWhCO0FBQ0Q7QUFDRjs7QUFFRCxNQUFHLGdCQUFnQixDQUFuQixFQUFxQjtBQUNuQixtQkFBZSxDQUFmO0FBQ0Q7QUFDRCxTQUFPLFlBQVA7QUFDRCxDQXZCRDs7QUF5QkEsTUFBTSxTQUFOLENBQWdCLGdCQUFoQixHQUFtQyxZQUFZO0FBQzdDLE1BQUksS0FBSyxhQUFMLElBQXNCLFFBQVEsU0FBbEMsRUFBNkM7QUFDM0MsVUFBTSxlQUFOO0FBQ0Q7QUFDRCxTQUFPLEtBQUssYUFBWjtBQUNELENBTEQ7O0FBT0EsTUFBTSxTQUFOLENBQWdCLGlCQUFoQixHQUFvQyxZQUFZO0FBQzlDLE1BQUksS0FBSyxLQUFMLElBQWMsSUFBbEIsRUFDQTtBQUNFLFdBQU8sS0FBSyxhQUFMLEdBQXFCLENBQUMsS0FBSyxJQUFMLENBQVUsS0FBVixHQUFrQixLQUFLLElBQUwsQ0FBVSxNQUE3QixJQUF1QyxDQUFuRTtBQUNELEdBSEQsTUFLQTtBQUNFLFNBQUssYUFBTCxHQUFxQixLQUFLLEtBQUwsQ0FBVyxpQkFBWCxFQUFyQjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsS0FBSyxhQUF2QjtBQUNBLFNBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsS0FBSyxhQUF4Qjs7QUFFQSxXQUFPLEtBQUssYUFBWjtBQUNEO0FBQ0YsQ0FiRDs7QUFlQSxNQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsR0FBMEIsWUFBWTtBQUNwQyxNQUFJLGFBQUo7QUFDQSxNQUFJLGFBQUo7O0FBRUEsTUFBSSxPQUFPLENBQUMsZ0JBQWdCLHNCQUE1QjtBQUNBLE1BQUksT0FBTyxnQkFBZ0Isc0JBQTNCO0FBQ0Esa0JBQWdCLGdCQUFnQixjQUFoQixHQUNQLFdBQVcsVUFBWCxNQUEyQixPQUFPLElBQWxDLENBRE8sR0FDb0MsSUFEcEQ7O0FBR0EsTUFBSSxPQUFPLENBQUMsZ0JBQWdCLHNCQUE1QjtBQUNBLE1BQUksT0FBTyxnQkFBZ0Isc0JBQTNCO0FBQ0Esa0JBQWdCLGdCQUFnQixjQUFoQixHQUNQLFdBQVcsVUFBWCxNQUEyQixPQUFPLElBQWxDLENBRE8sR0FDb0MsSUFEcEQ7O0FBR0EsT0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLGFBQWQ7QUFDQSxPQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsYUFBZDtBQUNELENBaEJEOztBQWtCQSxNQUFNLFNBQU4sQ0FBZ0IsWUFBaEIsR0FBK0IsWUFBWTtBQUN6QyxNQUFJLEtBQUssUUFBTCxNQUFtQixJQUF2QixFQUE2QjtBQUMzQixVQUFNLGVBQU47QUFDRDtBQUNELE1BQUksS0FBSyxRQUFMLEdBQWdCLFFBQWhCLEdBQTJCLE1BQTNCLElBQXFDLENBQXpDLEVBQ0E7QUFDRTtBQUNBLFFBQUksYUFBYSxLQUFLLFFBQUwsRUFBakI7QUFDQSxlQUFXLFlBQVgsQ0FBd0IsSUFBeEI7O0FBRUEsU0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLFdBQVcsT0FBWCxFQUFkO0FBQ0EsU0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLFdBQVcsTUFBWCxFQUFkOztBQUVBLFNBQUssUUFBTCxDQUFjLFdBQVcsUUFBWCxLQUF3QixXQUFXLE9BQVgsRUFBdEM7QUFDQSxTQUFLLFNBQUwsQ0FBZSxXQUFXLFNBQVgsS0FBeUIsV0FBVyxNQUFYLEVBQXhDOztBQUVBO0FBQ0EsUUFBRyxnQkFBZ0IsOEJBQW5CLEVBQWtEOztBQUVoRCxVQUFJLFFBQVEsV0FBVyxRQUFYLEtBQXdCLFdBQVcsT0FBWCxFQUFwQztBQUNBLFVBQUksU0FBUyxXQUFXLFNBQVgsS0FBeUIsV0FBVyxNQUFYLEVBQXRDOztBQUVBLFVBQUcsS0FBSyxVQUFMLEdBQWtCLEtBQXJCLEVBQTJCO0FBQ3pCLGFBQUssSUFBTCxDQUFVLENBQVYsSUFBZSxDQUFDLEtBQUssVUFBTCxHQUFrQixLQUFuQixJQUE0QixDQUEzQztBQUNBLGFBQUssUUFBTCxDQUFjLEtBQUssVUFBbkI7QUFDRDs7QUFFRCxVQUFHLEtBQUssV0FBTCxHQUFtQixNQUF0QixFQUE2QjtBQUMzQixZQUFHLEtBQUssUUFBTCxJQUFpQixRQUFwQixFQUE2QjtBQUMzQixlQUFLLElBQUwsQ0FBVSxDQUFWLElBQWUsQ0FBQyxLQUFLLFdBQUwsR0FBbUIsTUFBcEIsSUFBOEIsQ0FBN0M7QUFDRCxTQUZELE1BR0ssSUFBRyxLQUFLLFFBQUwsSUFBaUIsS0FBcEIsRUFBMEI7QUFDN0IsZUFBSyxJQUFMLENBQVUsQ0FBVixJQUFnQixLQUFLLFdBQUwsR0FBbUIsTUFBbkM7QUFDRDtBQUNELGFBQUssU0FBTCxDQUFlLEtBQUssV0FBcEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRixDQXRDRDs7QUF3Q0EsTUFBTSxTQUFOLENBQWdCLHFCQUFoQixHQUF3QyxZQUN4QztBQUNFLE1BQUksS0FBSyxrQkFBTCxJQUEyQixRQUFRLFNBQXZDLEVBQWtEO0FBQ2hELFVBQU0sZUFBTjtBQUNEO0FBQ0QsU0FBTyxLQUFLLGtCQUFaO0FBQ0QsQ0FORDs7QUFRQSxNQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsVUFBVSxLQUFWLEVBQzVCO0FBQ0UsTUFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLENBQXJCOztBQUVBLE1BQUksT0FBTyxnQkFBZ0IsY0FBM0IsRUFDQTtBQUNFLFdBQU8sZ0JBQWdCLGNBQXZCO0FBQ0QsR0FIRCxNQUlLLElBQUksT0FBTyxDQUFDLGdCQUFnQixjQUE1QixFQUNMO0FBQ0UsV0FBTyxDQUFDLGdCQUFnQixjQUF4QjtBQUNEOztBQUVELE1BQUksTUFBTSxLQUFLLElBQUwsQ0FBVSxDQUFwQjs7QUFFQSxNQUFJLE1BQU0sZ0JBQWdCLGNBQTFCLEVBQ0E7QUFDRSxVQUFNLGdCQUFnQixjQUF0QjtBQUNELEdBSEQsTUFJSyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsY0FBM0IsRUFDTDtBQUNFLFVBQU0sQ0FBQyxnQkFBZ0IsY0FBdkI7QUFDRDs7QUFFRCxNQUFJLFVBQVUsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFpQixHQUFqQixDQUFkO0FBQ0EsTUFBSSxXQUFXLE1BQU0scUJBQU4sQ0FBNEIsT0FBNUIsQ0FBZjs7QUFFQSxPQUFLLFdBQUwsQ0FBaUIsU0FBUyxDQUExQixFQUE2QixTQUFTLENBQXRDO0FBQ0QsQ0E1QkQ7O0FBOEJBLE1BQU0sU0FBTixDQUFnQixPQUFoQixHQUEwQixZQUMxQjtBQUNFLFNBQU8sS0FBSyxJQUFMLENBQVUsQ0FBakI7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUMzQjtBQUNFLFNBQU8sS0FBSyxJQUFMLENBQVUsQ0FBVixHQUFjLEtBQUssSUFBTCxDQUFVLEtBQS9CO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsWUFDekI7QUFDRSxTQUFPLEtBQUssSUFBTCxDQUFVLENBQWpCO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsWUFDNUI7QUFDRSxTQUFPLEtBQUssSUFBTCxDQUFVLENBQVYsR0FBYyxLQUFLLElBQUwsQ0FBVSxNQUEvQjtBQUNELENBSEQ7O0FBS0EsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQzVCO0FBQ0UsTUFBSSxLQUFLLEtBQUwsSUFBYyxJQUFsQixFQUNBO0FBQ0UsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQVA7QUFDRCxDQVJEOztBQVVBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7Ozs7QUNoWkEsSUFBSSxrQkFBa0IsUUFBUSxtQkFBUixDQUF0QjtBQUNBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBZDtBQUNBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7QUFDQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7QUFDQSxJQUFJLFFBQVEsUUFBUSxTQUFSLENBQVo7QUFDQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7QUFDQSxJQUFJLFNBQVMsUUFBUSxVQUFSLENBQWI7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkOztBQUVBLFNBQVMsTUFBVCxDQUFnQixXQUFoQixFQUE2QjtBQUMzQixVQUFRLElBQVIsQ0FBYyxJQUFkOztBQUVBO0FBQ0EsT0FBSyxhQUFMLEdBQXFCLGdCQUFnQixlQUFyQztBQUNBO0FBQ0EsT0FBSyxtQkFBTCxHQUNRLGdCQUFnQiw4QkFEeEI7QUFFQTtBQUNBLE9BQUssV0FBTCxHQUFtQixnQkFBZ0IsbUJBQW5DO0FBQ0E7QUFDQSxPQUFLLGlCQUFMLEdBQ1EsZ0JBQWdCLDJCQUR4QjtBQUVBO0FBQ0EsT0FBSyxxQkFBTCxHQUE2QixnQkFBZ0IsK0JBQTdDO0FBQ0E7QUFDQSxPQUFLLGVBQUwsR0FBdUIsZ0JBQWdCLHdCQUF2QztBQUNBOzs7Ozs7QUFNQSxPQUFLLG9CQUFMLEdBQ1EsZ0JBQWdCLCtCQUR4QjtBQUVBOzs7O0FBSUEsT0FBSyxnQkFBTCxHQUF3QixJQUFJLE9BQUosRUFBeEI7QUFDQSxPQUFLLFlBQUwsR0FBb0IsSUFBSSxhQUFKLENBQWtCLElBQWxCLENBQXBCO0FBQ0EsT0FBSyxnQkFBTCxHQUF3QixLQUF4QjtBQUNBLE9BQUssV0FBTCxHQUFtQixLQUFuQjtBQUNBLE9BQUssV0FBTCxHQUFtQixLQUFuQjs7QUFFQSxNQUFJLGVBQWUsSUFBbkIsRUFBeUI7QUFDdkIsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxPQUFPLFdBQVAsR0FBcUIsQ0FBckI7O0FBRUEsT0FBTyxTQUFQLEdBQW1CLE9BQU8sTUFBUCxDQUFlLFFBQVEsU0FBdkIsQ0FBbkI7O0FBRUEsT0FBTyxTQUFQLENBQWlCLGVBQWpCLEdBQW1DLFlBQVk7QUFDN0MsU0FBTyxLQUFLLFlBQVo7QUFDRCxDQUZEOztBQUlBLE9BQU8sU0FBUCxDQUFpQixXQUFqQixHQUErQixZQUFZO0FBQ3pDLFNBQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQVA7QUFDRCxDQUZEOztBQUlBLE9BQU8sU0FBUCxDQUFpQixXQUFqQixHQUErQixZQUFZO0FBQ3pDLFNBQU8sS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQVA7QUFDRCxDQUZEOztBQUlBLE9BQU8sU0FBUCxDQUFpQiw2QkFBakIsR0FBaUQsWUFBWTtBQUMzRCxTQUFPLEtBQUssWUFBTCxDQUFrQiw2QkFBbEIsRUFBUDtBQUNELENBRkQ7O0FBSUEsT0FBTyxTQUFQLENBQWlCLGVBQWpCLEdBQW1DLFlBQVk7QUFDN0MsTUFBSSxLQUFLLElBQUksYUFBSixDQUFrQixJQUFsQixDQUFUO0FBQ0EsT0FBSyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBTyxFQUFQO0FBQ0QsQ0FKRDs7QUFNQSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsR0FBNEIsVUFBVSxNQUFWLEVBQzVCO0FBQ0UsU0FBTyxJQUFJLE1BQUosQ0FBVyxJQUFYLEVBQWlCLEtBQUssWUFBdEIsRUFBb0MsTUFBcEMsQ0FBUDtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLE9BQWpCLEdBQTJCLFVBQVUsS0FBVixFQUMzQjtBQUNFLFNBQU8sSUFBSSxLQUFKLENBQVUsS0FBSyxZQUFmLEVBQTZCLEtBQTdCLENBQVA7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixVQUFVLEtBQVYsRUFDM0I7QUFDRSxTQUFPLElBQUksS0FBSixDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsS0FBdEIsQ0FBUDtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLGtCQUFqQixHQUFzQyxZQUFXO0FBQy9DLFNBQVEsS0FBSyxZQUFMLENBQWtCLE9BQWxCLE1BQStCLElBQWhDLElBQ0ksS0FBSyxZQUFMLENBQWtCLE9BQWxCLEdBQTRCLFFBQTVCLEdBQXVDLE1BQXZDLElBQWlELENBRHJELElBRUksS0FBSyxZQUFMLENBQWtCLG1CQUFsQixFQUZYO0FBR0QsQ0FKRDs7QUFNQSxPQUFPLFNBQVAsQ0FBaUIsU0FBakIsR0FBNkIsWUFDN0I7QUFDRSxPQUFLLGdCQUFMLEdBQXdCLEtBQXhCOztBQUVBLE1BQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLFNBQUssZUFBTDtBQUNEOztBQUVELE9BQUssY0FBTDtBQUNBLE1BQUksbUJBQUo7O0FBRUEsTUFBSSxLQUFLLGtCQUFMLEVBQUosRUFDQTtBQUNFLDBCQUFzQixLQUF0QjtBQUNELEdBSEQsTUFLQTtBQUNFLDBCQUFzQixLQUFLLE1BQUwsRUFBdEI7QUFDRDs7QUFFRCxNQUFJLGdCQUFnQixPQUFoQixLQUE0QixRQUFoQyxFQUEwQztBQUN4QztBQUNBO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxtQkFBSixFQUNBO0FBQ0UsUUFBSSxDQUFDLEtBQUssV0FBVixFQUNBO0FBQ0UsV0FBSyxZQUFMO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLEtBQUssZ0JBQVQsRUFBMkI7QUFDekIsU0FBSyxnQkFBTDtBQUNEOztBQUVELE9BQUssZ0JBQUwsR0FBd0IsSUFBeEI7O0FBRUEsU0FBTyxtQkFBUDtBQUNELENBekNEOztBQTJDQTs7O0FBR0EsT0FBTyxTQUFQLENBQWlCLFlBQWpCLEdBQWdDLFlBQ2hDO0FBQ0U7QUFDQTtBQUNBLE1BQUcsQ0FBQyxLQUFLLFdBQVQsRUFBcUI7QUFDbkIsU0FBSyxTQUFMO0FBQ0Q7QUFDRCxPQUFLLE1BQUw7QUFDRCxDQVJEOztBQVVBOzs7O0FBSUEsT0FBTyxTQUFQLENBQWlCLE9BQWpCLEdBQTJCLFlBQVk7QUFDckM7QUFDQSxNQUFJLEtBQUssbUJBQVQsRUFDQTtBQUNFLFNBQUssOEJBQUw7O0FBRUE7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsYUFBbEI7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsTUFBSSxDQUFDLEtBQUssV0FBVixFQUNBO0FBQ0U7QUFDQSxRQUFJLElBQUo7QUFDQSxRQUFJLFdBQVcsS0FBSyxZQUFMLENBQWtCLFdBQWxCLEVBQWY7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUNBO0FBQ0UsYUFBTyxTQUFTLENBQVQsQ0FBUDtBQUNOO0FBQ0s7O0FBRUQ7QUFDQSxRQUFJLElBQUo7QUFDQSxRQUFJLFFBQVEsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEdBQTRCLFFBQTVCLEVBQVo7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUNBO0FBQ0UsYUFBTyxNQUFNLENBQU4sQ0FBUDtBQUNOO0FBQ0s7O0FBRUQ7QUFDQSxTQUFLLE1BQUwsQ0FBWSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsRUFBWjtBQUNEO0FBQ0YsQ0FuQ0Q7O0FBcUNBLE9BQU8sU0FBUCxDQUFpQixNQUFqQixHQUEwQixVQUFVLEdBQVYsRUFBZTtBQUN2QyxNQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLFNBQUssT0FBTDtBQUNELEdBRkQsTUFHSyxJQUFJLGVBQWUsS0FBbkIsRUFBMEI7QUFDN0IsUUFBSSxPQUFPLEdBQVg7QUFDQSxRQUFJLEtBQUssUUFBTCxNQUFtQixJQUF2QixFQUNBO0FBQ0U7QUFDQSxVQUFJLFFBQVEsS0FBSyxRQUFMLEdBQWdCLFFBQWhCLEVBQVo7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUNBO0FBQ0UsZUFBTyxNQUFNLENBQU4sQ0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsUUFBSSxLQUFLLFlBQUwsSUFBcUIsSUFBekIsRUFDQTtBQUNFO0FBQ0EsVUFBSSxRQUFRLEtBQUssWUFBakI7O0FBRUE7QUFDQSxZQUFNLE1BQU4sQ0FBYSxJQUFiO0FBQ0Q7QUFDRixHQXZCSSxNQXdCQSxJQUFJLGVBQWUsS0FBbkIsRUFBMEI7QUFDN0IsUUFBSSxPQUFPLEdBQVg7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSSxLQUFLLFlBQUwsSUFBcUIsSUFBekIsRUFDQTtBQUNFO0FBQ0EsVUFBSSxRQUFRLEtBQUssWUFBakI7O0FBRUE7QUFDQSxZQUFNLE1BQU4sQ0FBYSxJQUFiO0FBQ0Q7QUFDRixHQWRJLE1BZUEsSUFBSSxlQUFlLE1BQW5CLEVBQTJCO0FBQzlCLFFBQUksUUFBUSxHQUFaO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQUksTUFBTSxZQUFOLElBQXNCLElBQTFCLEVBQ0E7QUFDRTtBQUNBLFVBQUksU0FBUyxNQUFNLFlBQW5COztBQUVBO0FBQ0EsYUFBTyxNQUFQLENBQWMsS0FBZDtBQUNEO0FBQ0Y7QUFDRixDQTFERDs7QUE0REE7Ozs7QUFJQSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsR0FBa0MsWUFBWTtBQUM1QyxNQUFJLENBQUMsS0FBSyxXQUFWLEVBQ0E7QUFDRSxTQUFLLGFBQUwsR0FBcUIsZ0JBQWdCLGVBQXJDO0FBQ0EsU0FBSyxxQkFBTCxHQUE2QixnQkFBZ0IsK0JBQTdDO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLGdCQUFnQix3QkFBdkM7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLGdCQUFnQiwyQkFBekM7QUFDQSxTQUFLLFdBQUwsR0FBbUIsZ0JBQWdCLG1CQUFuQztBQUNBLFNBQUssbUJBQUwsR0FBMkIsZ0JBQWdCLDhCQUEzQztBQUNBLFNBQUssb0JBQUwsR0FBNEIsZ0JBQWdCLCtCQUE1QztBQUNEOztBQUVELE1BQUksS0FBSyxxQkFBVCxFQUNBO0FBQ0UsU0FBSyxpQkFBTCxHQUF5QixLQUF6QjtBQUNEO0FBQ0YsQ0FoQkQ7O0FBa0JBLE9BQU8sU0FBUCxDQUFpQixTQUFqQixHQUE2QixVQUFVLFVBQVYsRUFBc0I7QUFDakQsTUFBSSxjQUFjLFNBQWxCLEVBQTZCO0FBQzNCLFNBQUssU0FBTCxDQUFlLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQWY7QUFDRCxHQUZELE1BR0s7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJLFFBQVEsSUFBSSxTQUFKLEVBQVo7QUFDQSxRQUFJLFVBQVUsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEdBQTRCLGFBQTVCLEVBQWQ7O0FBRUEsUUFBSSxXQUFXLElBQWYsRUFDQTtBQUNFLFlBQU0sWUFBTixDQUFtQixXQUFXLENBQTlCO0FBQ0EsWUFBTSxZQUFOLENBQW1CLFdBQVcsQ0FBOUI7O0FBRUEsWUFBTSxhQUFOLENBQW9CLFFBQVEsQ0FBNUI7QUFDQSxZQUFNLGFBQU4sQ0FBb0IsUUFBUSxDQUE1Qjs7QUFFQSxVQUFJLFFBQVEsS0FBSyxXQUFMLEVBQVo7QUFDQSxVQUFJLElBQUo7O0FBRUEsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFDQTtBQUNFLGVBQU8sTUFBTSxDQUFOLENBQVA7QUFDQSxhQUFLLFNBQUwsQ0FBZSxLQUFmO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsQ0EvQkQ7O0FBaUNBLE9BQU8sU0FBUCxDQUFpQixxQkFBakIsR0FBeUMsVUFBVSxLQUFWLEVBQWlCOztBQUV4RCxNQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QjtBQUNBLFNBQUsscUJBQUwsQ0FBMkIsS0FBSyxlQUFMLEdBQXVCLE9BQXZCLEVBQTNCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLE9BQXZCLEdBQWlDLFlBQWpDLENBQThDLElBQTlDO0FBQ0QsR0FKRCxNQUtLO0FBQ0gsUUFBSSxLQUFKO0FBQ0EsUUFBSSxVQUFKOztBQUVBLFFBQUksUUFBUSxNQUFNLFFBQU4sRUFBWjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQ0E7QUFDRSxjQUFRLE1BQU0sQ0FBTixDQUFSO0FBQ0EsbUJBQWEsTUFBTSxRQUFOLEVBQWI7O0FBRUEsVUFBSSxjQUFjLElBQWxCLEVBQ0E7QUFDRSxjQUFNLE9BQU47QUFDRCxPQUhELE1BSUssSUFBSSxXQUFXLFFBQVgsR0FBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFDTDtBQUNFLGNBQU0sT0FBTjtBQUNELE9BSEksTUFLTDtBQUNFLGFBQUsscUJBQUwsQ0FBMkIsVUFBM0I7QUFDQSxjQUFNLFlBQU47QUFDRDtBQUNGO0FBQ0Y7QUFDRixDQWhDRDs7QUFrQ0E7Ozs7OztBQU1BLE9BQU8sU0FBUCxDQUFpQixhQUFqQixHQUFpQyxZQUNqQztBQUNFLE1BQUksYUFBYSxFQUFqQjtBQUNBLE1BQUksV0FBVyxJQUFmOztBQUVBO0FBQ0E7QUFDQSxNQUFJLFdBQVcsS0FBSyxZQUFMLENBQWtCLE9BQWxCLEdBQTRCLFFBQTVCLEVBQWY7O0FBRUE7QUFDQSxNQUFJLFNBQVMsSUFBYjs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUNBO0FBQ0UsUUFBSSxTQUFTLENBQVQsRUFBWSxRQUFaLE1BQTBCLElBQTlCLEVBQ0E7QUFDRSxlQUFTLEtBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSSxDQUFDLE1BQUwsRUFDQTtBQUNFLFdBQU8sVUFBUDtBQUNEOztBQUVEOztBQUVBLE1BQUksVUFBVSxJQUFJLE9BQUosRUFBZDtBQUNBLE1BQUksY0FBYyxFQUFsQjtBQUNBLE1BQUksVUFBVSxJQUFJLE9BQUosRUFBZDtBQUNBLE1BQUksbUJBQW1CLEVBQXZCOztBQUVBLHFCQUFtQixpQkFBaUIsTUFBakIsQ0FBd0IsUUFBeEIsQ0FBbkI7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFNBQU8saUJBQWlCLE1BQWpCLEdBQTBCLENBQTFCLElBQStCLFFBQXRDLEVBQ0E7QUFDRSxnQkFBWSxJQUFaLENBQWlCLGlCQUFpQixDQUFqQixDQUFqQjs7QUFFQTtBQUNBO0FBQ0EsV0FBTyxZQUFZLE1BQVosR0FBcUIsQ0FBckIsSUFBMEIsUUFBakMsRUFDQTtBQUNFO0FBQ0EsVUFBSSxjQUFjLFlBQVksQ0FBWixDQUFsQjtBQUNBLGtCQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEI7QUFDQSxjQUFRLEdBQVIsQ0FBWSxXQUFaOztBQUVBO0FBQ0EsVUFBSSxnQkFBZ0IsWUFBWSxRQUFaLEVBQXBCOztBQUVBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxjQUFjLE1BQWxDLEVBQTBDLEdBQTFDLEVBQ0E7QUFDRSxZQUFJLGtCQUNJLGNBQWMsQ0FBZCxFQUFpQixXQUFqQixDQUE2QixXQUE3QixDQURSOztBQUdBO0FBQ0EsWUFBSSxRQUFRLEdBQVIsQ0FBWSxXQUFaLEtBQTRCLGVBQWhDLEVBQ0E7QUFDRTtBQUNBLGNBQUksQ0FBQyxRQUFRLFFBQVIsQ0FBaUIsZUFBakIsQ0FBTCxFQUNBO0FBQ0Usd0JBQVksSUFBWixDQUFpQixlQUFqQjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLFdBQTdCO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQVJBLGVBVUE7QUFDRSx5QkFBVyxLQUFYO0FBQ0E7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBO0FBQ0EsUUFBSSxDQUFDLFFBQUwsRUFDQTtBQUNFLG1CQUFhLEVBQWI7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQU5BLFNBUUE7QUFDRSxZQUFJLE9BQU8sRUFBWDtBQUNBLGdCQUFRLFFBQVIsQ0FBaUIsSUFBakI7QUFDQSxtQkFBVyxJQUFYLENBQWdCLElBQWhCO0FBQ0E7QUFDQTtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLGNBQUksUUFBUSxLQUFLLENBQUwsQ0FBWjtBQUNBLGNBQUksUUFBUSxpQkFBaUIsT0FBakIsQ0FBeUIsS0FBekIsQ0FBWjtBQUNBLGNBQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDZCw2QkFBaUIsTUFBakIsQ0FBd0IsS0FBeEIsRUFBK0IsQ0FBL0I7QUFDRDtBQUNGO0FBQ0Qsa0JBQVUsSUFBSSxPQUFKLEVBQVY7QUFDQSxrQkFBVSxJQUFJLE9BQUosRUFBVjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxVQUFQO0FBQ0QsQ0EvR0Q7O0FBaUhBOzs7OztBQUtBLE9BQU8sU0FBUCxDQUFpQiw2QkFBakIsR0FBaUQsVUFBVSxJQUFWLEVBQ2pEO0FBQ0UsTUFBSSxhQUFhLEVBQWpCO0FBQ0EsTUFBSSxPQUFPLEtBQUssTUFBaEI7O0FBRUEsTUFBSSxRQUFRLEtBQUssWUFBTCxDQUFrQix3QkFBbEIsQ0FBMkMsS0FBSyxNQUFoRCxFQUF3RCxLQUFLLE1BQTdELENBQVo7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssVUFBTCxDQUFnQixNQUFwQyxFQUE0QyxHQUE1QyxFQUNBO0FBQ0U7QUFDQSxRQUFJLFlBQVksS0FBSyxPQUFMLENBQWEsSUFBYixDQUFoQjtBQUNBLGNBQVUsT0FBVixDQUFrQixJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsQ0FBYixDQUFsQixFQUFtQyxJQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQW5DOztBQUVBLFVBQU0sR0FBTixDQUFVLFNBQVY7O0FBRUE7QUFDQSxRQUFJLFlBQVksS0FBSyxPQUFMLENBQWEsSUFBYixDQUFoQjtBQUNBLFNBQUssWUFBTCxDQUFrQixHQUFsQixDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxTQUF2Qzs7QUFFQSxlQUFXLEdBQVgsQ0FBZSxTQUFmO0FBQ0EsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSSxZQUFZLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBaEI7QUFDQSxPQUFLLFlBQUwsQ0FBa0IsR0FBbEIsQ0FBc0IsU0FBdEIsRUFBaUMsSUFBakMsRUFBdUMsS0FBSyxNQUE1Qzs7QUFFQSxPQUFLLGdCQUFMLENBQXNCLEdBQXRCLENBQTBCLElBQTFCLEVBQWdDLFVBQWhDOztBQUVBO0FBQ0EsTUFBSSxLQUFLLFlBQUwsRUFBSixFQUNBO0FBQ0UsU0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLElBQXpCO0FBQ0Q7QUFDRDtBQUpBLE9BTUE7QUFDRSxZQUFNLE1BQU4sQ0FBYSxJQUFiO0FBQ0Q7O0FBRUQsU0FBTyxVQUFQO0FBQ0QsQ0F4Q0Q7O0FBMENBOzs7O0FBSUEsT0FBTyxTQUFQLENBQWlCLDhCQUFqQixHQUFrRCxZQUNsRDtBQUNFLE1BQUksUUFBUSxFQUFaO0FBQ0EsVUFBUSxNQUFNLE1BQU4sQ0FBYSxLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsRUFBYixDQUFSO0FBQ0EsVUFBUSxLQUFLLGdCQUFMLENBQXNCLE1BQXRCLEdBQStCLE1BQS9CLENBQXNDLEtBQXRDLENBQVI7O0FBRUEsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFDQTtBQUNFLFFBQUksUUFBUSxNQUFNLENBQU4sQ0FBWjs7QUFFQSxRQUFJLE1BQU0sVUFBTixDQUFpQixNQUFqQixHQUEwQixDQUE5QixFQUNBO0FBQ0UsVUFBSSxPQUFPLEtBQUssZ0JBQUwsQ0FBc0IsR0FBdEIsQ0FBMEIsS0FBMUIsQ0FBWDs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUNBO0FBQ0UsWUFBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjtBQUNBLFlBQUksSUFBSSxJQUFJLE1BQUosQ0FBVyxVQUFVLFVBQVYsRUFBWCxFQUNBLFVBQVUsVUFBVixFQURBLENBQVI7O0FBR0E7QUFDQSxZQUFJLE1BQU0sTUFBTSxVQUFOLENBQWlCLEdBQWpCLENBQXFCLENBQXJCLENBQVY7QUFDQSxZQUFJLENBQUosR0FBUSxFQUFFLENBQVY7QUFDQSxZQUFJLENBQUosR0FBUSxFQUFFLENBQVY7O0FBRUE7QUFDQTtBQUNBLGtCQUFVLFFBQVYsR0FBcUIsTUFBckIsQ0FBNEIsU0FBNUI7QUFDRDs7QUFFRDtBQUNBLFdBQUssWUFBTCxDQUFrQixHQUFsQixDQUFzQixLQUF0QixFQUE2QixNQUFNLE1BQW5DLEVBQTJDLE1BQU0sTUFBakQ7QUFDRDtBQUNGO0FBQ0YsQ0FsQ0Q7O0FBb0NBLE9BQU8sU0FBUCxHQUFtQixVQUFVLFdBQVYsRUFBdUIsWUFBdkIsRUFBcUMsTUFBckMsRUFBNkMsTUFBN0MsRUFBcUQ7QUFDdEUsTUFBSSxVQUFVLFNBQVYsSUFBdUIsVUFBVSxTQUFyQyxFQUFnRDtBQUM5QyxRQUFJLFFBQVEsWUFBWjs7QUFFQSxRQUFJLGVBQWUsRUFBbkIsRUFDQTtBQUNFLFVBQUksV0FBVyxlQUFlLE1BQTlCO0FBQ0EsZUFBVSxDQUFDLGVBQWUsUUFBaEIsSUFBNEIsRUFBN0IsSUFBb0MsS0FBSyxXQUF6QyxDQUFUO0FBQ0QsS0FKRCxNQU1BO0FBQ0UsVUFBSSxXQUFXLGVBQWUsTUFBOUI7QUFDQSxlQUFVLENBQUMsV0FBVyxZQUFaLElBQTRCLEVBQTdCLElBQW9DLGNBQWMsRUFBbEQsQ0FBVDtBQUNEOztBQUVELFdBQU8sS0FBUDtBQUNELEdBZkQsTUFnQks7QUFDSCxRQUFJLENBQUosRUFBTyxDQUFQOztBQUVBLFFBQUksZUFBZSxFQUFuQixFQUNBO0FBQ0UsVUFBSSxNQUFNLFlBQU4sR0FBcUIsS0FBekI7QUFDQSxVQUFJLGVBQWUsSUFBbkI7QUFDRCxLQUpELE1BTUE7QUFDRSxVQUFJLE1BQU0sWUFBTixHQUFxQixJQUF6QjtBQUNBLFVBQUksQ0FBQyxDQUFELEdBQUssWUFBVDtBQUNEOztBQUVELFdBQVEsSUFBSSxXQUFKLEdBQWtCLENBQTFCO0FBQ0Q7QUFDRixDQWpDRDs7QUFtQ0E7Ozs7QUFJQSxPQUFPLGdCQUFQLEdBQTBCLFVBQVUsS0FBVixFQUMxQjtBQUNFLE1BQUksT0FBTyxFQUFYO0FBQ0EsU0FBTyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQVA7O0FBRUEsTUFBSSxlQUFlLEVBQW5CO0FBQ0EsTUFBSSxtQkFBbUIsSUFBSSxPQUFKLEVBQXZCO0FBQ0EsTUFBSSxjQUFjLEtBQWxCO0FBQ0EsTUFBSSxhQUFhLElBQWpCOztBQUVBLE1BQUksS0FBSyxNQUFMLElBQWUsQ0FBZixJQUFvQixLQUFLLE1BQUwsSUFBZSxDQUF2QyxFQUNBO0FBQ0Usa0JBQWMsSUFBZDtBQUNBLGlCQUFhLEtBQUssQ0FBTCxDQUFiO0FBQ0Q7O0FBRUQsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFDQTtBQUNFLFFBQUksT0FBTyxLQUFLLENBQUwsQ0FBWDtBQUNBLFFBQUksU0FBUyxLQUFLLGdCQUFMLEdBQXdCLElBQXhCLEVBQWI7QUFDQSxxQkFBaUIsR0FBakIsQ0FBcUIsSUFBckIsRUFBMkIsS0FBSyxnQkFBTCxHQUF3QixJQUF4QixFQUEzQjs7QUFFQSxRQUFJLFVBQVUsQ0FBZCxFQUNBO0FBQ0UsbUJBQWEsSUFBYixDQUFrQixJQUFsQjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSSxXQUFXLEVBQWY7QUFDQSxhQUFXLFNBQVMsTUFBVCxDQUFnQixZQUFoQixDQUFYOztBQUVBLFNBQU8sQ0FBQyxXQUFSLEVBQ0E7QUFDRSxRQUFJLFlBQVksRUFBaEI7QUFDQSxnQkFBWSxVQUFVLE1BQVYsQ0FBaUIsUUFBakIsQ0FBWjtBQUNBLGVBQVcsRUFBWDs7QUFFQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUNBO0FBQ0UsVUFBSSxPQUFPLEtBQUssQ0FBTCxDQUFYOztBQUVBLFVBQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQVo7QUFDQSxVQUFJLFNBQVMsQ0FBYixFQUFnQjtBQUNkLGFBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsQ0FBbkI7QUFDRDs7QUFFRCxVQUFJLGFBQWEsS0FBSyxnQkFBTCxFQUFqQjs7QUFFQSxhQUFPLElBQVAsQ0FBWSxXQUFXLEdBQXZCLEVBQTRCLE9BQTVCLENBQW9DLFVBQVMsQ0FBVCxFQUFZO0FBQzlDLFlBQUksWUFBWSxXQUFXLEdBQVgsQ0FBZSxDQUFmLENBQWhCO0FBQ0EsWUFBSSxhQUFhLE9BQWIsQ0FBcUIsU0FBckIsSUFBa0MsQ0FBdEMsRUFDQTtBQUNFLGNBQUksY0FBYyxpQkFBaUIsR0FBakIsQ0FBcUIsU0FBckIsQ0FBbEI7QUFDQSxjQUFJLFlBQVksY0FBYyxDQUE5Qjs7QUFFQSxjQUFJLGFBQWEsQ0FBakIsRUFDQTtBQUNFLHFCQUFTLElBQVQsQ0FBYyxTQUFkO0FBQ0Q7O0FBRUQsMkJBQWlCLEdBQWpCLENBQXFCLFNBQXJCLEVBQWdDLFNBQWhDO0FBQ0Q7QUFDRixPQWREO0FBZUQ7O0FBRUQsbUJBQWUsYUFBYSxNQUFiLENBQW9CLFFBQXBCLENBQWY7O0FBRUEsUUFBSSxLQUFLLE1BQUwsSUFBZSxDQUFmLElBQW9CLEtBQUssTUFBTCxJQUFlLENBQXZDLEVBQ0E7QUFDRSxvQkFBYyxJQUFkO0FBQ0EsbUJBQWEsS0FBSyxDQUFMLENBQWI7QUFDRDtBQUNGOztBQUVELFNBQU8sVUFBUDtBQUNELENBM0VEOztBQTZFQTs7OztBQUlBLE9BQU8sU0FBUCxDQUFpQixlQUFqQixHQUFtQyxVQUFVLEVBQVYsRUFDbkM7QUFDRSxPQUFLLFlBQUwsR0FBb0IsRUFBcEI7QUFDRCxDQUhEOztBQUtBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7QUNucUJBLFNBQVMsZUFBVCxHQUEyQixDQUMxQjs7QUFFRDs7O0FBR0EsZ0JBQWdCLGFBQWhCLEdBQWdDLENBQWhDO0FBQ0EsZ0JBQWdCLGVBQWhCLEdBQWtDLENBQWxDO0FBQ0EsZ0JBQWdCLGFBQWhCLEdBQWdDLENBQWhDOztBQUVBOzs7QUFHQSxnQkFBZ0IsOEJBQWhCLEdBQWlELEtBQWpEO0FBQ0E7QUFDQSxnQkFBZ0IsbUJBQWhCLEdBQXNDLEtBQXRDO0FBQ0EsZ0JBQWdCLDJCQUFoQixHQUE4QyxJQUE5QztBQUNBLGdCQUFnQiwrQkFBaEIsR0FBa0QsS0FBbEQ7QUFDQSxnQkFBZ0Isd0JBQWhCLEdBQTJDLEVBQTNDO0FBQ0EsZ0JBQWdCLCtCQUFoQixHQUFrRCxLQUFsRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLGdCQUFnQixvQkFBaEIsR0FBdUMsRUFBdkM7O0FBRUE7OztBQUdBLGdCQUFnQiw4QkFBaEIsR0FBaUQsS0FBakQ7O0FBRUE7OztBQUdBLGdCQUFnQixnQkFBaEIsR0FBbUMsRUFBbkM7O0FBRUE7OztBQUdBLGdCQUFnQixxQkFBaEIsR0FBd0MsZ0JBQWdCLGdCQUFoQixHQUFtQyxDQUEzRTs7QUFFQTs7OztBQUlBLGdCQUFnQix3QkFBaEIsR0FBMkMsRUFBM0M7O0FBRUE7OztBQUdBLGdCQUFnQixlQUFoQixHQUFrQyxDQUFsQzs7QUFFQTs7O0FBR0EsZ0JBQWdCLGNBQWhCLEdBQWlDLE9BQWpDOztBQUVBOzs7QUFHQSxnQkFBZ0Isc0JBQWhCLEdBQXlDLGdCQUFnQixjQUFoQixHQUFpQyxJQUExRTs7QUFFQTs7O0FBR0EsZ0JBQWdCLGNBQWhCLEdBQWlDLElBQWpDO0FBQ0EsZ0JBQWdCLGNBQWhCLEdBQWlDLEdBQWpDOztBQUVBLE9BQU8sT0FBUCxHQUFpQixlQUFqQjs7Ozs7QUN4RUE7OztBQUdBLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0I7QUFDdEIsT0FBSyxDQUFMLEdBQVMsSUFBVDtBQUNBLE9BQUssQ0FBTCxHQUFTLElBQVQ7QUFDQSxNQUFJLEtBQUssSUFBTCxJQUFhLEtBQUssSUFBbEIsSUFBMEIsS0FBSyxJQUFuQyxFQUF5QztBQUN2QyxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNELEdBSEQsTUFJSyxJQUFJLE9BQU8sQ0FBUCxJQUFZLFFBQVosSUFBd0IsT0FBTyxDQUFQLElBQVksUUFBcEMsSUFBZ0QsS0FBSyxJQUF6RCxFQUErRDtBQUNsRSxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNELEdBSEksTUFJQSxJQUFJLEVBQUUsV0FBRixDQUFjLElBQWQsSUFBc0IsT0FBdEIsSUFBaUMsS0FBSyxJQUF0QyxJQUE4QyxLQUFLLElBQXZELEVBQTZEO0FBQ2hFLFFBQUksQ0FBSjtBQUNBLFNBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBWDtBQUNBLFNBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBWDtBQUNEO0FBQ0Y7O0FBRUQsTUFBTSxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFlBQVk7QUFDakMsU0FBTyxLQUFLLENBQVo7QUFDRCxDQUZEOztBQUlBLE1BQU0sU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFZO0FBQ2pDLFNBQU8sS0FBSyxDQUFaO0FBQ0QsQ0FGRDs7QUFJQSxNQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsWUFBWTtBQUN4QyxTQUFPLElBQUksS0FBSixDQUFVLEtBQUssQ0FBZixFQUFrQixLQUFLLENBQXZCLENBQVA7QUFDRCxDQUZEOztBQUlBLE1BQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CO0FBQy9DLE1BQUksRUFBRSxXQUFGLENBQWMsSUFBZCxJQUFzQixPQUF0QixJQUFpQyxLQUFLLElBQXRDLElBQThDLEtBQUssSUFBdkQsRUFBNkQ7QUFDM0QsUUFBSSxDQUFKO0FBQ0EsU0FBSyxXQUFMLENBQWlCLEVBQUUsQ0FBbkIsRUFBc0IsRUFBRSxDQUF4QjtBQUNELEdBSEQsTUFJSyxJQUFJLE9BQU8sQ0FBUCxJQUFZLFFBQVosSUFBd0IsT0FBTyxDQUFQLElBQVksUUFBcEMsSUFBZ0QsS0FBSyxJQUF6RCxFQUErRDtBQUNsRTtBQUNBLFFBQUksU0FBUyxDQUFULEtBQWUsQ0FBZixJQUFvQixTQUFTLENBQVQsS0FBZSxDQUF2QyxFQUEwQztBQUN4QyxXQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsQ0FBYjtBQUNELEtBRkQsTUFHSztBQUNILFdBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLElBQUksR0FBZixDQUFUO0FBQ0EsV0FBSyxDQUFMLEdBQVMsS0FBSyxLQUFMLENBQVcsSUFBSSxHQUFmLENBQVQ7QUFDRDtBQUNGO0FBQ0YsQ0FmRDs7QUFpQkEsTUFBTSxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDckMsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDRCxDQUhEOztBQUtBLE1BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCO0FBQzVDLE9BQUssQ0FBTCxJQUFVLEVBQVY7QUFDQSxPQUFLLENBQUwsSUFBVSxFQUFWO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsVUFBVSxHQUFWLEVBQWU7QUFDdEMsTUFBSSxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsSUFBd0IsT0FBNUIsRUFBcUM7QUFDbkMsUUFBSSxLQUFLLEdBQVQ7QUFDQSxXQUFRLEtBQUssQ0FBTCxJQUFVLEdBQUcsQ0FBZCxJQUFxQixLQUFLLENBQUwsSUFBVSxHQUFHLENBQXpDO0FBQ0Q7QUFDRCxTQUFPLFFBQVEsR0FBZjtBQUNELENBTkQ7O0FBUUEsTUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVk7QUFDckMsU0FBTyxJQUFJLEtBQUosR0FBWSxXQUFaLENBQXdCLElBQXhCLEdBQStCLEtBQS9CLEdBQXVDLEtBQUssQ0FBNUMsR0FBZ0QsS0FBaEQsR0FBd0QsS0FBSyxDQUE3RCxHQUFpRSxHQUF4RTtBQUNELENBRkQ7O0FBSUEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7OztBQ3hFQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0I7QUFDcEIsTUFBSSxLQUFLLElBQUwsSUFBYSxLQUFLLElBQXRCLEVBQTRCO0FBQzFCLFNBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFNBQUssQ0FBTCxHQUFTLENBQVQ7QUFDRDtBQUNGOztBQUVELE9BQU8sU0FBUCxDQUFpQixJQUFqQixHQUF3QixZQUN4QjtBQUNFLFNBQU8sS0FBSyxDQUFaO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsWUFDeEI7QUFDRSxTQUFPLEtBQUssQ0FBWjtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLElBQWpCLEdBQXdCLFVBQVUsQ0FBVixFQUN4QjtBQUNFLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixJQUFqQixHQUF3QixVQUFVLENBQVYsRUFDeEI7QUFDRSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsYUFBakIsR0FBaUMsVUFBVSxFQUFWLEVBQ2pDO0FBQ0UsU0FBTyxJQUFJLFVBQUosQ0FBZSxLQUFLLENBQUwsR0FBUyxHQUFHLENBQTNCLEVBQThCLEtBQUssQ0FBTCxHQUFTLEdBQUcsQ0FBMUMsQ0FBUDtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLE9BQWpCLEdBQTJCLFlBQzNCO0FBQ0UsU0FBTyxJQUFJLE1BQUosQ0FBVyxLQUFLLENBQWhCLEVBQW1CLEtBQUssQ0FBeEIsQ0FBUDtBQUNELENBSEQ7O0FBS0EsT0FBTyxTQUFQLENBQWlCLFNBQWpCLEdBQTZCLFVBQVUsR0FBVixFQUM3QjtBQUNFLE9BQUssQ0FBTCxJQUFVLElBQUksS0FBZDtBQUNBLE9BQUssQ0FBTCxJQUFVLElBQUksTUFBZDtBQUNBLFNBQU8sSUFBUDtBQUNELENBTEQ7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLE1BQWpCOzs7OztBQy9DQSxTQUFTLFVBQVQsR0FBc0IsQ0FDckI7QUFDRCxXQUFXLElBQVgsR0FBa0IsQ0FBbEI7QUFDQSxXQUFXLENBQVgsR0FBZSxDQUFmOztBQUVBLFdBQVcsVUFBWCxHQUF3QixZQUFZO0FBQ2xDLGFBQVcsQ0FBWCxHQUFlLEtBQUssR0FBTCxDQUFTLFdBQVcsSUFBWCxFQUFULElBQThCLEtBQTdDO0FBQ0EsU0FBTyxXQUFXLENBQVgsR0FBZSxLQUFLLEtBQUwsQ0FBVyxXQUFXLENBQXRCLENBQXRCO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDVkEsU0FBUyxVQUFULENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCLEVBQWlDLE1BQWpDLEVBQXlDO0FBQ3ZDLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsT0FBSyxLQUFMLEdBQWEsQ0FBYjtBQUNBLE9BQUssTUFBTCxHQUFjLENBQWQ7O0FBRUEsTUFBSSxLQUFLLElBQUwsSUFBYSxLQUFLLElBQWxCLElBQTBCLFNBQVMsSUFBbkMsSUFBMkMsVUFBVSxJQUF6RCxFQUErRDtBQUM3RCxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7QUFDRjs7QUFFRCxXQUFXLFNBQVgsQ0FBcUIsSUFBckIsR0FBNEIsWUFDNUI7QUFDRSxTQUFPLEtBQUssQ0FBWjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLElBQXJCLEdBQTRCLFVBQVUsQ0FBVixFQUM1QjtBQUNFLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixJQUFyQixHQUE0QixZQUM1QjtBQUNFLFNBQU8sS0FBSyxDQUFaO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsSUFBckIsR0FBNEIsVUFBVSxDQUFWLEVBQzVCO0FBQ0UsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLFFBQXJCLEdBQWdDLFlBQ2hDO0FBQ0UsU0FBTyxLQUFLLEtBQVo7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxVQUFVLEtBQVYsRUFDaEM7QUFDRSxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsU0FBckIsR0FBaUMsWUFDakM7QUFDRSxTQUFPLEtBQUssTUFBWjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLFNBQXJCLEdBQWlDLFVBQVUsTUFBVixFQUNqQztBQUNFLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxZQUNoQztBQUNFLFNBQU8sS0FBSyxDQUFMLEdBQVMsS0FBSyxLQUFyQjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLFNBQXJCLEdBQWlDLFlBQ2pDO0FBQ0UsU0FBTyxLQUFLLENBQUwsR0FBUyxLQUFLLE1BQXJCO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsVUFBckIsR0FBa0MsVUFBVSxDQUFWLEVBQ2xDO0FBQ0UsTUFBSSxLQUFLLFFBQUwsS0FBa0IsRUFBRSxDQUF4QixFQUNBO0FBQ0UsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLLFNBQUwsS0FBbUIsRUFBRSxDQUF6QixFQUNBO0FBQ0UsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxFQUFFLFFBQUYsS0FBZSxLQUFLLENBQXhCLEVBQ0E7QUFDRSxXQUFPLEtBQVA7QUFDRDs7QUFFRCxNQUFJLEVBQUUsU0FBRixLQUFnQixLQUFLLENBQXpCLEVBQ0E7QUFDRSxXQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQXZCRDs7QUF5QkEsV0FBVyxTQUFYLENBQXFCLFVBQXJCLEdBQWtDLFlBQ2xDO0FBQ0UsU0FBTyxLQUFLLENBQUwsR0FBUyxLQUFLLEtBQUwsR0FBYSxDQUE3QjtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLE9BQXJCLEdBQStCLFlBQy9CO0FBQ0UsU0FBTyxLQUFLLElBQUwsRUFBUDtBQUNELENBSEQ7O0FBS0EsV0FBVyxTQUFYLENBQXFCLE9BQXJCLEdBQStCLFlBQy9CO0FBQ0UsU0FBTyxLQUFLLElBQUwsS0FBYyxLQUFLLEtBQTFCO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsVUFBckIsR0FBa0MsWUFDbEM7QUFDRSxTQUFPLEtBQUssQ0FBTCxHQUFTLEtBQUssTUFBTCxHQUFjLENBQTlCO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsT0FBckIsR0FBK0IsWUFDL0I7QUFDRSxTQUFPLEtBQUssSUFBTCxFQUFQO0FBQ0QsQ0FIRDs7QUFLQSxXQUFXLFNBQVgsQ0FBcUIsT0FBckIsR0FBK0IsWUFDL0I7QUFDRSxTQUFPLEtBQUssSUFBTCxLQUFjLEtBQUssTUFBMUI7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixZQUFyQixHQUFvQyxZQUNwQztBQUNFLFNBQU8sS0FBSyxLQUFMLEdBQWEsQ0FBcEI7QUFDRCxDQUhEOztBQUtBLFdBQVcsU0FBWCxDQUFxQixhQUFyQixHQUFxQyxZQUNyQztBQUNFLFNBQU8sS0FBSyxNQUFMLEdBQWMsQ0FBckI7QUFDRCxDQUhEOztBQUtBLE9BQU8sT0FBUCxHQUFpQixVQUFqQjs7Ozs7QUNqSUEsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiOztBQUVBLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QjtBQUN2QixPQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxPQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxPQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxPQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDQSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDRDs7QUFFRCxVQUFVLFNBQVYsQ0FBb0IsWUFBcEIsR0FBbUMsWUFDbkM7QUFDRSxTQUFPLEtBQUssVUFBWjtBQUNELENBSEQ7O0FBS0EsVUFBVSxTQUFWLENBQW9CLFlBQXBCLEdBQW1DLFVBQVUsR0FBVixFQUNuQztBQUNFLE9BQUssVUFBTCxHQUFrQixHQUFsQjtBQUNELENBSEQ7O0FBS0EsVUFBVSxTQUFWLENBQW9CLFlBQXBCLEdBQW1DLFlBQ25DO0FBQ0UsU0FBTyxLQUFLLFVBQVo7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixZQUFwQixHQUFtQyxVQUFVLEdBQVYsRUFDbkM7QUFDRSxPQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixZQUFwQixHQUFtQyxZQUNuQztBQUNFLFNBQU8sS0FBSyxVQUFaO0FBQ0QsQ0FIRDs7QUFLQSxVQUFVLFNBQVYsQ0FBb0IsWUFBcEIsR0FBbUMsVUFBVSxHQUFWLEVBQ25DO0FBQ0UsT0FBSyxVQUFMLEdBQWtCLEdBQWxCO0FBQ0QsQ0FIRDs7QUFLQSxVQUFVLFNBQVYsQ0FBb0IsWUFBcEIsR0FBbUMsWUFDbkM7QUFDRSxTQUFPLEtBQUssVUFBWjtBQUNELENBSEQ7O0FBS0EsVUFBVSxTQUFWLENBQW9CLFlBQXBCLEdBQW1DLFVBQVUsR0FBVixFQUNuQztBQUNFLE9BQUssVUFBTCxHQUFrQixHQUFsQjtBQUNELENBSEQ7O0FBS0E7O0FBRUEsVUFBVSxTQUFWLENBQW9CLGFBQXBCLEdBQW9DLFlBQ3BDO0FBQ0UsU0FBTyxLQUFLLFdBQVo7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixhQUFwQixHQUFvQyxVQUFVLEdBQVYsRUFDcEM7QUFDRSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixhQUFwQixHQUFvQyxZQUNwQztBQUNFLFNBQU8sS0FBSyxXQUFaO0FBQ0QsQ0FIRDs7QUFLQSxVQUFVLFNBQVYsQ0FBb0IsYUFBcEIsR0FBb0MsVUFBVSxHQUFWLEVBQ3BDO0FBQ0UsT0FBSyxXQUFMLEdBQW1CLEdBQW5CO0FBQ0QsQ0FIRDs7QUFLQSxVQUFVLFNBQVYsQ0FBb0IsYUFBcEIsR0FBb0MsWUFDcEM7QUFDRSxTQUFPLEtBQUssV0FBWjtBQUNELENBSEQ7O0FBS0EsVUFBVSxTQUFWLENBQW9CLGFBQXBCLEdBQW9DLFVBQVUsR0FBVixFQUNwQztBQUNFLE9BQUssV0FBTCxHQUFtQixHQUFuQjtBQUNELENBSEQ7O0FBS0EsVUFBVSxTQUFWLENBQW9CLGFBQXBCLEdBQW9DLFlBQ3BDO0FBQ0UsU0FBTyxLQUFLLFdBQVo7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixhQUFwQixHQUFvQyxVQUFVLEdBQVYsRUFDcEM7QUFDRSxPQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDRCxDQUhEOztBQUtBLFVBQVUsU0FBVixDQUFvQixVQUFwQixHQUFpQyxVQUFVLENBQVYsRUFDakM7QUFDRSxNQUFJLFVBQVUsR0FBZDtBQUNBLE1BQUksWUFBWSxLQUFLLFVBQXJCO0FBQ0EsTUFBSSxhQUFhLEdBQWpCLEVBQ0E7QUFDRSxjQUFVLEtBQUssV0FBTCxHQUNELENBQUMsSUFBSSxLQUFLLFVBQVYsSUFBd0IsS0FBSyxXQUE3QixHQUEyQyxTQURwRDtBQUVEOztBQUVELFNBQU8sT0FBUDtBQUNELENBWEQ7O0FBYUEsVUFBVSxTQUFWLENBQW9CLFVBQXBCLEdBQWlDLFVBQVUsQ0FBVixFQUNqQztBQUNFLE1BQUksVUFBVSxHQUFkO0FBQ0EsTUFBSSxZQUFZLEtBQUssVUFBckI7QUFDQSxNQUFJLGFBQWEsR0FBakIsRUFDQTtBQUNFLGNBQVUsS0FBSyxXQUFMLEdBQ0QsQ0FBQyxJQUFJLEtBQUssVUFBVixJQUF3QixLQUFLLFdBQTdCLEdBQTJDLFNBRHBEO0FBRUQ7O0FBR0QsU0FBTyxPQUFQO0FBQ0QsQ0FaRDs7QUFjQSxVQUFVLFNBQVYsQ0FBb0IsaUJBQXBCLEdBQXdDLFVBQVUsQ0FBVixFQUN4QztBQUNFLE1BQUksU0FBUyxHQUFiO0FBQ0EsTUFBSSxhQUFhLEtBQUssV0FBdEI7QUFDQSxNQUFJLGNBQWMsR0FBbEIsRUFDQTtBQUNFLGFBQVMsS0FBSyxVQUFMLEdBQ0EsQ0FBQyxJQUFJLEtBQUssV0FBVixJQUF5QixLQUFLLFVBQTlCLEdBQTJDLFVBRHBEO0FBRUQ7O0FBR0QsU0FBTyxNQUFQO0FBQ0QsQ0FaRDs7QUFjQSxVQUFVLFNBQVYsQ0FBb0IsaUJBQXBCLEdBQXdDLFVBQVUsQ0FBVixFQUN4QztBQUNFLE1BQUksU0FBUyxHQUFiO0FBQ0EsTUFBSSxhQUFhLEtBQUssV0FBdEI7QUFDQSxNQUFJLGNBQWMsR0FBbEIsRUFDQTtBQUNFLGFBQVMsS0FBSyxVQUFMLEdBQ0EsQ0FBQyxJQUFJLEtBQUssV0FBVixJQUF5QixLQUFLLFVBQTlCLEdBQTJDLFVBRHBEO0FBRUQ7QUFDRCxTQUFPLE1BQVA7QUFDRCxDQVZEOztBQVlBLFVBQVUsU0FBVixDQUFvQixxQkFBcEIsR0FBNEMsVUFBVSxPQUFWLEVBQzVDO0FBQ0UsTUFBSSxXQUNJLElBQUksTUFBSixDQUFXLEtBQUssaUJBQUwsQ0FBdUIsUUFBUSxDQUEvQixDQUFYLEVBQ1EsS0FBSyxpQkFBTCxDQUF1QixRQUFRLENBQS9CLENBRFIsQ0FEUjtBQUdBLFNBQU8sUUFBUDtBQUNELENBTkQ7O0FBUUEsT0FBTyxPQUFQLEdBQWlCLFNBQWpCOzs7Ozs7O0FDNUpBLFNBQVMsaUJBQVQsR0FBNkIsQ0FDNUI7O0FBRUQsa0JBQWtCLE1BQWxCLEdBQTJCLENBQTNCOztBQUVBLGtCQUFrQixRQUFsQixHQUE2QixVQUFVLEdBQVYsRUFBZTtBQUMxQyxNQUFJLGtCQUFrQixXQUFsQixDQUE4QixHQUE5QixDQUFKLEVBQXdDO0FBQ3RDLFdBQU8sR0FBUDtBQUNEO0FBQ0QsTUFBSSxJQUFJLFFBQUosSUFBZ0IsSUFBcEIsRUFBMEI7QUFDeEIsV0FBTyxJQUFJLFFBQVg7QUFDRDtBQUNELE1BQUksUUFBSixHQUFlLGtCQUFrQixTQUFsQixFQUFmO0FBQ0Esb0JBQWtCLE1BQWxCO0FBQ0EsU0FBTyxJQUFJLFFBQVg7QUFDRCxDQVZEOztBQVlBLGtCQUFrQixTQUFsQixHQUE4QixVQUFVLEVBQVYsRUFBYztBQUMxQyxNQUFJLE1BQU0sSUFBVixFQUNFLEtBQUssa0JBQWtCLE1BQXZCO0FBQ0YsU0FBTyxZQUFZLEVBQVosR0FBaUIsRUFBeEI7QUFDRCxDQUpEOztBQU1BLGtCQUFrQixXQUFsQixHQUFnQyxVQUFVLEdBQVYsRUFBZTtBQUM3QyxNQUFJLGNBQWMsR0FBZCx5Q0FBYyxHQUFkLENBQUo7QUFDQSxTQUFPLE9BQU8sSUFBUCxJQUFnQixRQUFRLFFBQVIsSUFBb0IsUUFBUSxVQUFuRDtBQUNELENBSEQ7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLGlCQUFqQjs7O0FDNUJBOztBQUVBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7QUFDQSxJQUFJLFVBQVUsUUFBUSxXQUFSLENBQWQ7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiO0FBQ0EsSUFBSSxhQUFhLFFBQVEsY0FBUixDQUFqQjtBQUNBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxvQkFBb0IsUUFBUSxxQkFBUixDQUF4QjtBQUNBLElBQUksZUFBZSxRQUFRLGdCQUFSLENBQW5CO0FBQ0EsSUFBSSxTQUFTLFFBQVEsVUFBUixDQUFiO0FBQ0EsSUFBSSxRQUFRLFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBSSxnQkFBZ0IsUUFBUSxpQkFBUixDQUFwQjtBQUNBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjtBQUNBLElBQUksU0FBUyxRQUFRLFVBQVIsQ0FBYjtBQUNBLElBQUksa0JBQWtCLFFBQVEsbUJBQVIsQ0FBdEI7QUFDQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7QUFDQSxJQUFJLG9CQUFvQixRQUFRLHFCQUFSLENBQXhCO0FBQ0EsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJLGVBQWUsUUFBUSxnQkFBUixDQUFuQjtBQUNBLElBQUksZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBcEI7QUFDQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7QUFDQSxJQUFJLFlBQVksUUFBUSxhQUFSLENBQWhCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxvQkFBUixDQUF2QjtBQUNBLElBQUksYUFBYSxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFJLFdBQVcsUUFBUSxZQUFSLENBQWY7O0FBRUEsSUFBSSxXQUFXO0FBQ2I7QUFDQSxTQUFPLGlCQUFZLENBQ2xCLENBSFk7QUFJYjtBQUNBLFFBQU0sZ0JBQVksQ0FDakIsQ0FOWTtBQU9iO0FBQ0EsK0JBQTZCLEtBUmhCO0FBU2I7QUFDQSxXQUFTLEVBVkk7QUFXYjtBQUNBLE9BQUssSUFaUTtBQWFiO0FBQ0EsV0FBUyxFQWRJO0FBZWI7QUFDQSxhQUFXLElBaEJFO0FBaUJiO0FBQ0EsaUJBQWUsSUFsQkY7QUFtQmI7QUFDQSxtQkFBaUIsRUFwQko7QUFxQmI7QUFDQSxrQkFBZ0IsSUF0Qkg7QUF1QmI7QUFDQSxpQkFBZSxHQXhCRjtBQXlCYjtBQUNBLFdBQVMsSUExQkk7QUEyQmI7QUFDQSxXQUFTLElBNUJJO0FBNkJiO0FBQ0EsUUFBTSxJQTlCTztBQStCYjtBQUNBLFdBQVMsS0FoQ0k7QUFpQ2I7QUFDQSxxQkFBbUIsR0FsQ047QUFtQ2I7QUFDQSxpQkFBZSxLQXBDRjtBQXFDYjtBQUNBLHlCQUF1QixFQXRDVjtBQXVDYjtBQUNBLDJCQUF5QixFQXhDWjtBQXlDYjtBQUNBLHdCQUFzQixHQTFDVDtBQTJDYjtBQUNBLG1CQUFpQixHQTVDSjtBQTZDYjtBQUNBLGdCQUFjLEdBOUNEO0FBK0NiO0FBQ0EsOEJBQTRCO0FBaERmLENBQWY7O0FBbURBLFNBQVMsTUFBVCxDQUFnQixRQUFoQixFQUEwQixPQUExQixFQUFtQztBQUNqQyxNQUFJLE1BQU0sRUFBVjs7QUFFQSxPQUFLLElBQUksQ0FBVCxJQUFjLFFBQWQsRUFBd0I7QUFDdEIsUUFBSSxDQUFKLElBQVMsU0FBUyxDQUFULENBQVQ7QUFDRDs7QUFFRCxPQUFLLElBQUksQ0FBVCxJQUFjLE9BQWQsRUFBdUI7QUFDckIsUUFBSSxDQUFKLElBQVMsUUFBUSxDQUFSLENBQVQ7QUFDRDs7QUFFRCxTQUFPLEdBQVA7QUFDRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsUUFBckIsRUFBK0I7QUFDN0IsT0FBSyxPQUFMLEdBQWUsT0FBTyxRQUFQLEVBQWlCLFFBQWpCLENBQWY7QUFDQSxpQkFBZSxLQUFLLE9BQXBCO0FBQ0Q7O0FBRUQsSUFBSSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBVSxPQUFWLEVBQW1CO0FBQ3RDLE1BQUksUUFBUSxhQUFSLElBQXlCLElBQTdCLEVBQ0UsY0FBYywwQkFBZCxHQUEyQyxrQkFBa0IsMEJBQWxCLEdBQStDLFFBQVEsYUFBbEc7QUFDRixNQUFJLFFBQVEsZUFBUixJQUEyQixJQUEvQixFQUNFLGNBQWMsbUJBQWQsR0FBb0Msa0JBQWtCLG1CQUFsQixHQUF3QyxRQUFRLGVBQXBGO0FBQ0YsTUFBSSxRQUFRLGNBQVIsSUFBMEIsSUFBOUIsRUFDRSxjQUFjLHVCQUFkLEdBQXdDLGtCQUFrQix1QkFBbEIsR0FBNEMsUUFBUSxjQUE1RjtBQUNGLE1BQUksUUFBUSxhQUFSLElBQXlCLElBQTdCLEVBQ0UsY0FBYyxrQ0FBZCxHQUFtRCxrQkFBa0Isa0NBQWxCLEdBQXVELFFBQVEsYUFBbEg7QUFDRixNQUFJLFFBQVEsT0FBUixJQUFtQixJQUF2QixFQUNFLGNBQWMsd0JBQWQsR0FBeUMsa0JBQWtCLHdCQUFsQixHQUE2QyxRQUFRLE9BQTlGO0FBQ0YsTUFBSSxRQUFRLE9BQVIsSUFBbUIsSUFBdkIsRUFDRSxjQUFjLGNBQWQsR0FBK0Isa0JBQWtCLGNBQWxCLEdBQW1DLFFBQVEsT0FBMUU7QUFDRixNQUFJLFFBQVEsWUFBUixJQUF3QixJQUE1QixFQUNFLGNBQWMsNEJBQWQsR0FBNkMsa0JBQWtCLDRCQUFsQixHQUFpRCxRQUFRLFlBQXRHO0FBQ0YsTUFBRyxRQUFRLGVBQVIsSUFBMkIsSUFBOUIsRUFDRSxjQUFjLGlDQUFkLEdBQWtELGtCQUFrQixpQ0FBbEIsR0FBc0QsUUFBUSxlQUFoSDtBQUNGLE1BQUcsUUFBUSxvQkFBUixJQUFnQyxJQUFuQyxFQUNFLGNBQWMscUNBQWQsR0FBc0Qsa0JBQWtCLHFDQUFsQixHQUEwRCxRQUFRLG9CQUF4SDtBQUNGLE1BQUksUUFBUSwwQkFBUixJQUFzQyxJQUExQyxFQUNFLGNBQWMsa0NBQWQsR0FBbUQsa0JBQWtCLGtDQUFsQixHQUF1RCxRQUFRLDBCQUFsSDs7QUFFRixnQkFBYyw4QkFBZCxHQUErQyxrQkFBa0IsOEJBQWxCLEdBQW1ELGdCQUFnQiw4QkFBaEIsR0FBaUQsUUFBUSwyQkFBM0o7QUFDQSxnQkFBYyxtQkFBZCxHQUFvQyxrQkFBa0IsbUJBQWxCLEdBQXdDLGdCQUFnQixtQkFBaEIsR0FDcEUsQ0FBRSxRQUFRLFNBRGxCO0FBRUEsZ0JBQWMsT0FBZCxHQUF3QixrQkFBa0IsT0FBbEIsR0FBNEIsZ0JBQWdCLE9BQWhCLEdBQTBCLFFBQVEsT0FBdEY7QUFDQSxnQkFBYyxJQUFkLEdBQXFCLFFBQVEsSUFBN0I7QUFDQSxnQkFBYyx1QkFBZCxHQUNRLE9BQU8sUUFBUSxxQkFBZixLQUF5QyxVQUF6QyxHQUFzRCxRQUFRLHFCQUFSLENBQThCLElBQTlCLEVBQXRELEdBQTZGLFFBQVEscUJBRDdHO0FBRUEsZ0JBQWMseUJBQWQsR0FDUSxPQUFPLFFBQVEsdUJBQWYsS0FBMkMsVUFBM0MsR0FBd0QsUUFBUSx1QkFBUixDQUFnQyxJQUFoQyxFQUF4RCxHQUFpRyxRQUFRLHVCQURqSDtBQUVELENBL0JEOztBQWlDQSxZQUFZLFNBQVosQ0FBc0IsR0FBdEIsR0FBNEIsWUFBWTtBQUN0QyxNQUFJLEtBQUo7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLFVBQVUsS0FBSyxPQUFuQjtBQUNBLE1BQUksWUFBWSxLQUFLLFNBQUwsR0FBaUIsRUFBakM7QUFDQSxNQUFJLFNBQVMsS0FBSyxNQUFMLEdBQWMsSUFBSSxVQUFKLEVBQTNCO0FBQ0EsTUFBSSxPQUFPLElBQVg7O0FBRUEsT0FBSyxPQUFMLEdBQWUsS0FBZjs7QUFFQSxPQUFLLEVBQUwsR0FBVSxLQUFLLE9BQUwsQ0FBYSxFQUF2Qjs7QUFFQSxPQUFLLEVBQUwsQ0FBUSxPQUFSLENBQWdCLEVBQUUsTUFBTSxhQUFSLEVBQXVCLFFBQVEsSUFBL0IsRUFBaEI7O0FBRUEsTUFBSSxLQUFLLE9BQU8sZUFBUCxFQUFUO0FBQ0EsT0FBSyxFQUFMLEdBQVUsRUFBVjs7QUFFQSxNQUFJLFFBQVEsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixFQUFaO0FBQ0EsTUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsS0FBbEIsRUFBWjs7QUFFQSxPQUFLLElBQUwsR0FBWSxHQUFHLE9BQUgsRUFBWjtBQUNBLE9BQUssbUJBQUwsQ0FBeUIsS0FBSyxJQUE5QixFQUFvQyxLQUFLLGVBQUwsQ0FBcUIsS0FBckIsQ0FBcEMsRUFBaUUsTUFBakU7O0FBR0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBSSxPQUFPLE1BQU0sQ0FBTixDQUFYO0FBQ0EsUUFBSSxhQUFhLEtBQUssU0FBTCxDQUFlLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBZixDQUFqQjtBQUNBLFFBQUksYUFBYSxLQUFLLFNBQUwsQ0FBZSxLQUFLLElBQUwsQ0FBVSxRQUFWLENBQWYsQ0FBakI7QUFDQSxRQUFHLFdBQVcsZUFBWCxDQUEyQixVQUEzQixFQUF1QyxNQUF2QyxJQUFpRCxDQUFwRCxFQUFzRDtBQUNwRCxVQUFJLEtBQUssR0FBRyxHQUFILENBQU8sT0FBTyxPQUFQLEVBQVAsRUFBeUIsVUFBekIsRUFBcUMsVUFBckMsQ0FBVDtBQUNBLFNBQUcsRUFBSCxHQUFRLEtBQUssRUFBTCxFQUFSO0FBQ0Q7QUFDRjs7QUFFQSxNQUFJLGVBQWUsU0FBZixZQUFlLENBQVMsR0FBVCxFQUFjLENBQWQsRUFBZ0I7QUFDbEMsUUFBRyxPQUFPLEdBQVAsS0FBZSxRQUFsQixFQUE0QjtBQUMxQixZQUFNLENBQU47QUFDRDtBQUNELFFBQUksUUFBUSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVo7QUFDQSxRQUFJLFFBQVEsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFaOztBQUVBLFdBQU87QUFDTCxTQUFHLE1BQU0sT0FBTixHQUFnQixVQUFoQixFQURFO0FBRUwsU0FBRyxNQUFNLE9BQU4sR0FBZ0IsVUFBaEI7QUFGRSxLQUFQO0FBSUQsR0FYQTs7QUFhRDs7O0FBR0EsTUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsR0FBWTtBQUNoQztBQUNBLFFBQUksa0JBQWtCLFNBQWxCLGVBQWtCLEdBQVc7QUFDL0IsVUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDZixnQkFBUSxFQUFSLENBQVcsR0FBWCxDQUFlLFFBQVEsSUFBUixDQUFhLEtBQWIsRUFBZixFQUFxQyxRQUFRLE9BQTdDO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLEtBQUwsRUFBWTtBQUNWLGdCQUFRLElBQVI7QUFDQSxhQUFLLEVBQUwsQ0FBUSxHQUFSLENBQVksYUFBWixFQUEyQixRQUFRLEtBQW5DO0FBQ0EsYUFBSyxFQUFMLENBQVEsT0FBUixDQUFnQixFQUFDLE1BQU0sYUFBUCxFQUFzQixRQUFRLElBQTlCLEVBQWhCO0FBQ0Q7QUFDRixLQVZEOztBQVlBLFFBQUksZ0JBQWdCLEtBQUssT0FBTCxDQUFhLE9BQWpDO0FBQ0EsUUFBSSxNQUFKOztBQUVBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxhQUFKLElBQXFCLENBQUMsTUFBdEMsRUFBOEMsR0FBOUMsRUFBbUQ7QUFDakQsZUFBUyxLQUFLLE9BQUwsSUFBZ0IsS0FBSyxNQUFMLENBQVksSUFBWixFQUF6QjtBQUNEOztBQUVEO0FBQ0EsUUFBSSxNQUFKLEVBQVk7QUFDVjtBQUNBLFVBQUksT0FBTyxrQkFBUCxNQUErQixDQUFDLE9BQU8sV0FBM0MsRUFBd0Q7QUFDdEQsZUFBTyxZQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLE9BQU8sZ0JBQVgsRUFBNkI7QUFDM0IsZUFBTyxnQkFBUDtBQUNEOztBQUVELGFBQU8sZ0JBQVAsR0FBMEIsSUFBMUI7O0FBRUEsV0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFsQixHQUEwQixTQUExQixDQUFvQyxZQUFwQzs7QUFFQTs7QUFFQTtBQUNBLFdBQUssRUFBTCxDQUFRLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLEtBQUssT0FBTCxDQUFhLElBQXZDO0FBQ0EsV0FBSyxFQUFMLENBQVEsT0FBUixDQUFnQixFQUFFLE1BQU0sWUFBUixFQUFzQixRQUFRLElBQTlCLEVBQWhCOztBQUVBLFVBQUksT0FBSixFQUFhO0FBQ1gsNkJBQXFCLE9BQXJCO0FBQ0Q7O0FBRUQsY0FBUSxLQUFSO0FBQ0E7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixLQUFLLE1BQUwsQ0FBWSxnQkFBWixFQUFwQixDQW5EZ0MsQ0FtRG9CO0FBQ3BELFFBQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxZQUFaLEVBQWY7QUFDQSxRQUFJLFFBQVEsSUFBSSxXQUFKLENBQWdCLE1BQWhCLEVBQXdCLEVBQUMsVUFBVSxDQUFDLGFBQUQsRUFBZ0IsUUFBaEIsQ0FBWCxFQUF4QixDQUFaO0FBQ0EsV0FBTyxhQUFQLENBQXFCLEtBQXJCOztBQUVBLFFBQUcsUUFBUSxhQUFYLEVBQXlCO0FBQ3ZCO0FBQ0E7QUFDQSxjQUFRLElBQVIsQ0FBYSxLQUFiLEdBQXFCLFNBQXJCLENBQStCLFVBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7QUFDL0MsWUFBSSxPQUFPLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUMzQixnQkFBTSxDQUFOO0FBQ0Q7QUFDRCxZQUFJLFFBQVEsSUFBSSxFQUFKLEVBQVo7QUFDQSxZQUFJLFFBQVEsY0FBYyxLQUFkLENBQVo7QUFDQSxZQUFJLE9BQU8sR0FBWDtBQUNBO0FBQ0EsZUFBTyxTQUFTLElBQWhCLEVBQXNCO0FBQ3BCLGtCQUFRLGNBQWMsS0FBSyxJQUFMLENBQVUsUUFBVixDQUFkLEtBQXNDLGNBQWMsbUJBQW1CLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBakMsQ0FBOUM7QUFDQSx3QkFBYyxLQUFkLElBQXVCLEtBQXZCO0FBQ0EsaUJBQU8sS0FBSyxNQUFMLEdBQWMsQ0FBZCxDQUFQO0FBQ0EsY0FBRyxRQUFRLFNBQVgsRUFBcUI7QUFDbkI7QUFDRDtBQUNGO0FBQ0QsWUFBRyxTQUFTLElBQVosRUFBaUI7QUFDZixpQkFBTztBQUNMLGVBQUcsTUFBTSxDQURKO0FBRUwsZUFBRyxNQUFNO0FBRkosV0FBUDtBQUlELFNBTEQsTUFNSTtBQUNGLGlCQUFPO0FBQ0wsZUFBRyxJQUFJLFFBQUosQ0FBYSxHQUFiLENBREU7QUFFTCxlQUFHLElBQUksUUFBSixDQUFhLEdBQWI7QUFGRSxXQUFQO0FBSUQ7QUFDRixPQTVCRDtBQTZCRDtBQUNEOztBQUVBLGNBQVUsc0JBQXNCLGVBQXRCLENBQVY7QUFDRCxHQTVGRDs7QUE4RkE7OztBQUdBLFNBQU8sV0FBUCxDQUFtQixlQUFuQixFQUFvQyxZQUFZO0FBQzlDLFFBQUksS0FBSyxPQUFMLENBQWEsT0FBYixLQUF5QixRQUE3QixFQUF1QztBQUNyQyxnQkFBVSxzQkFBc0IsZUFBdEIsQ0FBVjtBQUNEO0FBQ0YsR0FKRDs7QUFNQSxTQUFPLFNBQVAsR0F6SnNDLENBeUpsQjs7QUFFcEI7OztBQUdBLE1BQUcsS0FBSyxPQUFMLENBQWEsT0FBYixJQUF3QixRQUEzQixFQUFvQztBQUNsQyxTQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQWxCLEdBQTBCLEdBQTFCLENBQThCLFNBQTlCLEVBQXlDLGVBQXpDLENBQXlELElBQXpELEVBQStELEtBQUssT0FBcEUsRUFBNkUsWUFBN0UsRUFEa0MsQ0FDMEQ7QUFDNUYsWUFBUSxLQUFSO0FBQ0Q7O0FBRUQsU0FBTyxJQUFQLENBbktzQyxDQW1LekI7QUFDZCxDQXBLRDs7QUFzS0E7QUFDQSxZQUFZLFNBQVosQ0FBc0IsZUFBdEIsR0FBd0MsVUFBUyxLQUFULEVBQWdCO0FBQ3RELE1BQUksV0FBVyxFQUFmO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDbkMsYUFBUyxNQUFNLENBQU4sRUFBUyxFQUFULEVBQVQsSUFBMEIsSUFBMUI7QUFDSDtBQUNELE1BQUksUUFBUSxNQUFNLE1BQU4sQ0FBYSxVQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCO0FBQ3ZDLFFBQUcsT0FBTyxHQUFQLEtBQWUsUUFBbEIsRUFBNEI7QUFDMUIsWUFBTSxDQUFOO0FBQ0Q7QUFDRCxRQUFJLFNBQVMsSUFBSSxNQUFKLEdBQWEsQ0FBYixDQUFiO0FBQ0EsV0FBTSxVQUFVLElBQWhCLEVBQXFCO0FBQ25CLFVBQUcsU0FBUyxPQUFPLEVBQVAsRUFBVCxDQUFILEVBQXlCO0FBQ3ZCLGVBQU8sS0FBUDtBQUNEO0FBQ0QsZUFBUyxPQUFPLE1BQVAsR0FBZ0IsQ0FBaEIsQ0FBVDtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0gsR0FaVyxDQUFaOztBQWNBLFNBQU8sS0FBUDtBQUNELENBcEJEOztBQXNCQSxZQUFZLFNBQVosQ0FBc0IsbUJBQXRCLEdBQTRDLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixNQUE1QixFQUFvQztBQUM5RSxNQUFJLE9BQU8sU0FBUyxNQUFwQjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFwQixFQUEwQixHQUExQixFQUErQjtBQUM3QixRQUFJLFdBQVcsU0FBUyxDQUFULENBQWY7QUFDQSxRQUFJLHVCQUF1QixTQUFTLFFBQVQsRUFBM0I7QUFDQSxRQUFJLE9BQUo7O0FBRUo7QUFDQTtBQUNBOztBQUVJLFFBQUksU0FBUyxVQUFULE1BQXlCLElBQXpCLElBQ08sU0FBUyxXQUFULE1BQTBCLElBRHJDLEVBQzJDO0FBQ3pDLGdCQUFVLE9BQU8sR0FBUCxDQUFXLElBQUksUUFBSixDQUFhLE9BQU8sWUFBcEIsRUFDYixJQUFJLE1BQUosQ0FBVyxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsSUFBeUIsU0FBUyxVQUFULEtBQXdCLENBQTVELEVBQStELFNBQVMsUUFBVCxDQUFrQixHQUFsQixJQUF5QixTQUFTLFdBQVQsS0FBeUIsQ0FBakgsQ0FEYSxFQUViLElBQUksVUFBSixDQUFlLFdBQVcsU0FBUyxVQUFULEVBQVgsQ0FBZixFQUFrRCxXQUFXLFNBQVMsV0FBVCxFQUFYLENBQWxELENBRmEsQ0FBWCxDQUFWO0FBR0QsS0FMRCxNQU1LO0FBQ0gsZ0JBQVUsT0FBTyxHQUFQLENBQVcsSUFBSSxRQUFKLENBQWEsS0FBSyxZQUFsQixDQUFYLENBQVY7QUFDRDtBQUNEO0FBQ0EsWUFBUSxFQUFSLEdBQWEsU0FBUyxJQUFULENBQWMsSUFBZCxDQUFiO0FBQ0E7QUFDQSxZQUFRLFdBQVIsR0FBc0IsU0FBVSxTQUFTLEdBQVQsQ0FBYSxTQUFiLENBQVYsQ0FBdEI7QUFDQSxZQUFRLFVBQVIsR0FBcUIsU0FBVSxTQUFTLEdBQVQsQ0FBYSxTQUFiLENBQVYsQ0FBckI7QUFDQSxZQUFRLFlBQVIsR0FBdUIsU0FBVSxTQUFTLEdBQVQsQ0FBYSxTQUFiLENBQVYsQ0FBdkI7QUFDQSxZQUFRLGFBQVIsR0FBd0IsU0FBVSxTQUFTLEdBQVQsQ0FBYSxTQUFiLENBQVYsQ0FBeEI7O0FBRUE7QUFDQSxRQUFHLEtBQUssT0FBTCxDQUFhLDJCQUFoQixFQUE0QztBQUMxQyxVQUFHLFNBQVMsUUFBVCxFQUFILEVBQXVCO0FBQ25CLFlBQUksYUFBYSxTQUFTLFdBQVQsQ0FBcUIsRUFBRSxlQUFlLElBQWpCLEVBQXVCLGNBQWMsS0FBckMsRUFBckIsRUFBbUUsQ0FBcEY7QUFDQSxZQUFJLGNBQWMsU0FBUyxXQUFULENBQXFCLEVBQUUsZUFBZSxJQUFqQixFQUF1QixjQUFjLEtBQXJDLEVBQXJCLEVBQW1FLENBQXJGO0FBQ0EsWUFBSSxXQUFXLFNBQVMsR0FBVCxDQUFhLGFBQWIsQ0FBZjtBQUNBLGdCQUFRLFVBQVIsR0FBcUIsVUFBckI7QUFDQSxnQkFBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsZ0JBQVEsUUFBUixHQUFtQixRQUFuQjtBQUNIO0FBQ0Y7O0FBRUQ7QUFDQSxTQUFLLFNBQUwsQ0FBZSxTQUFTLElBQVQsQ0FBYyxJQUFkLENBQWYsSUFBc0MsT0FBdEM7O0FBRUEsUUFBSSxNQUFNLFFBQVEsSUFBUixDQUFhLENBQW5CLENBQUosRUFBMkI7QUFDekIsY0FBUSxJQUFSLENBQWEsQ0FBYixHQUFpQixDQUFqQjtBQUNEOztBQUVELFFBQUksTUFBTSxRQUFRLElBQVIsQ0FBYSxDQUFuQixDQUFKLEVBQTJCO0FBQ3pCLGNBQVEsSUFBUixDQUFhLENBQWIsR0FBaUIsQ0FBakI7QUFDRDs7QUFFRCxRQUFJLHdCQUF3QixJQUF4QixJQUFnQyxxQkFBcUIsTUFBckIsR0FBOEIsQ0FBbEUsRUFBcUU7QUFDbkUsVUFBSSxXQUFKO0FBQ0Esb0JBQWMsT0FBTyxlQUFQLEdBQXlCLEdBQXpCLENBQTZCLE9BQU8sUUFBUCxFQUE3QixFQUFnRCxPQUFoRCxDQUFkO0FBQ0EsV0FBSyxtQkFBTCxDQUF5QixXQUF6QixFQUFzQyxvQkFBdEMsRUFBNEQsTUFBNUQ7QUFDRDtBQUNGO0FBQ0YsQ0F6REQ7O0FBMkRBOzs7QUFHQSxZQUFZLFNBQVosQ0FBc0IsSUFBdEIsR0FBNkIsWUFBWTtBQUN2QyxPQUFLLE9BQUwsR0FBZSxJQUFmOztBQUVBLFNBQU8sSUFBUCxDQUh1QyxDQUcxQjtBQUNkLENBSkQ7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsR0FBVCxDQUFhLFNBQWIsRUFBd0I7QUFDdkMsU0FBTyxXQUFQO0FBQ0QsQ0FGRDs7O0FDeFlBOztBQUVBOztBQUNBLElBQUksWUFBWSxRQUFRLFVBQVIsQ0FBaEI7O0FBRUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFVLFNBQVYsRUFBcUI7QUFDbEMsTUFBSSxTQUFTLFVBQVcsU0FBWCxDQUFiOztBQUVBLFlBQVUsUUFBVixFQUFvQixjQUFwQixFQUFvQyxNQUFwQztBQUNELENBSkQ7O0FBTUE7QUFDQSxJQUFJLE9BQU8sU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUNwQyxXQUFVLFNBQVY7QUFDRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG5zID0ge1xuXHRMaXN0OiByZXF1aXJlKCcuL3NyYy9MaXN0JyksXG5cdE5vZGU6IHJlcXVpcmUoJy4vc3JjL05vZGUnKSxcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IG5zO1xufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJykge1xuXHRkZWZpbmUoJ0xpbmtlZExpc3RKUycsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbnM7XG5cdH0pO1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuXHR3aW5kb3cuTGlua2VkTGlzdEpTID0gbnM7XG59IiwidmFyIE5vZGUgPSByZXF1aXJlKCcuL05vZGUnKTtcblxudmFyIExpc3QgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuX2NvdW50ID0gMDtcblx0dGhpcy5faGVhZCA9IG51bGw7XG5cdHRoaXMuX3RhaWwgPSBudWxsO1xufTtcblxuTGlzdC5wcm90b3R5cGUuaGVhZCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX2hlYWQ7XG59O1xuXG5MaXN0LnByb3RvdHlwZS50YWlsID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fdGFpbDtcbn07XG5cbkxpc3QucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fY291bnQ7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcblx0dmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xuXHRcdG5vZGUgPSBub2RlLm5leHQoKTtcblx0fVxuXG5cdHJldHVybiBub2RlO1xufTtcblxuTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IHRoaXMuZ2V0KGluZGV4KTtcblx0bm9kZS5zZXQodmFsdWUpO1xufTtcblxuTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IG5ldyBOb2RlKHZhbHVlLCB0aGlzLl90YWlsLCBudWxsKTtcblxuXHRpZiAodGhpcy5fdGFpbCAhPT0gbnVsbCkge1xuXHRcdHRoaXMuX3RhaWwuc2V0TmV4dChub2RlKTtcblx0fVxuXG5cdGlmICh0aGlzLl9oZWFkID09PSBudWxsKSB7XG5cdFx0dGhpcy5faGVhZCA9IG5vZGU7XG5cdH1cblxuXHR0aGlzLl90YWlsID0gbm9kZTtcblx0dGhpcy5fY291bnQrKztcblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIG5vZGUgPSB0aGlzLl90YWlsO1xuXG5cdHZhciBuZXdfdGFpbCA9IG51bGw7XG5cdGlmICh0aGlzLl90YWlsLnByZXZpb3VzKCkgIT09IG51bGwpIHtcblx0XHRuZXdfdGFpbCA9IHRoaXMuX3RhaWwucHJldmlvdXMoKTtcblx0XHRuZXdfdGFpbC5zZXROZXh0KG51bGwpO1xuXHR9XG5cdFxuXHR0aGlzLl90YWlsID0gbmV3X3RhaWw7XG5cblx0dGhpcy5fY291bnQtLTtcblxuXHRpZiAodGhpcy5fY291bnQgPT09IDApIHtcblx0XHR0aGlzLl9oZWFkID0gbnVsbDtcblx0fVxuXG5cdHJldHVybiBub2RlO1xufTtcblxuTGlzdC5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IG5ldyBOb2RlKHZhbHVlLCBudWxsLCB0aGlzLl9oZWFkKTtcblxuXHRpZiAodGhpcy5faGVhZCAhPT0gbnVsbCkge1xuXHRcdHRoaXMuX2hlYWQuc2V0UHJldmlvdXMobm9kZSk7XG5cdH1cblxuXHRpZiAodGhpcy5fdGFpbCA9PT0gbnVsbCkge1xuXHRcdHRoaXMuX3RhaWwgPSBub2RlO1xuXHR9XG5cdFxuXHR0aGlzLl9oZWFkID0gbm9kZTtcblxuXHR0aGlzLl9jb3VudCsrO1xuXG5cdHJldHVybiBub2RlO1xufTtcblxuTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHR2YXIgbmV3X2hlYWQgPSBudWxsO1xuXHRpZiAodGhpcy5faGVhZC5uZXh0KCkgIT09IG51bGwpIHtcblx0XHRuZXdfaGVhZCA9IHRoaXMuX2hlYWQubmV4dCgpO1xuXHRcdG5ld19oZWFkLnNldFByZXZpb3VzKG51bGwpO1xuXHR9XG5cblx0dGhpcy5faGVhZCA9IG5ld19oZWFkO1xuXG5cdHRoaXMuX2NvdW50LS07XG5cblx0aWYgKHRoaXMuX2NvdW50ID09PSAwKSB7XG5cdFx0dGhpcy5fdGFpbCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLmFzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBhcnIgPSBbXTtcblx0dmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuXG5cdHdoaWxlIChub2RlKSB7XG5cdFx0YXJyLnB1c2gobm9kZS52YWx1ZSgpKTtcblx0XHRub2RlID0gbm9kZS5uZXh0KCk7XG5cdH1cblxuXHRyZXR1cm4gYXJyO1xufTtcblxuTGlzdC5wcm90b3R5cGUudHJ1bmNhdGVUbyA9IGZ1bmN0aW9uIChsZW5ndGgpIHtcblx0dGhpcy5fY291bnQgPSBsZW5ndGg7XG5cblx0aWYgKGxlbmd0aCA9PT0gMCkge1xuXHRcdHRoaXMuX2hlYWQgPSBudWxsO1xuXHRcdHRoaXMuX3RhaWwgPSBudWxsO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIG5vZGUgPSB0aGlzLmdldChsZW5ndGgtMSk7XG5cdG5vZGUuc2V0TmV4dChudWxsKTtcblx0dGhpcy5fdGFpbCA9IG5vZGU7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5lbXB0eSA9IGZ1bmN0aW9uICgpIHtcblx0dGhpcy50cnVuY2F0ZVRvKDApO1xufTtcblxuTGlzdC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX2hlYWQgPT09IG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHR3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuXHRcdGlmIChub2RlLnZhbHVlKCkgPT09IHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9XG5cblx0XHRub2RlID0gbm9kZS5uZXh0KCk7XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbkxpc3QucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0dmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuXHR2YXIgaSA9IDA7XG5cdHdoaWxlIChub2RlICE9PSBudWxsKSB7XG5cdFx0Y2FsbGJhY2soaSwgbm9kZSk7XG5cdFx0bm9kZSA9IG5vZGUubmV4dCgpO1xuXHRcdGkrKztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3Q7IiwidmFyIE5vZGUgPSBmdW5jdGlvbiAodmFsdWUsIHByZXZpb3VzLCBuZXh0KSB7XG5cdHRoaXMuX3ZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZTtcblx0XG5cdHRoaXMuX3ByZXZpb3VzID0gcHJldmlvdXMgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBwcmV2aW91cztcblx0dGhpcy5fbmV4dCA9IG5leHQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBuZXh0O1xufTtcblxuTm9kZS5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl92YWx1ZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnByZXZpb3VzID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fcHJldmlvdXM7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fbmV4dDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR0aGlzLl92YWx1ZSA9IHZhbHVlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0UHJldmlvdXMgPSBmdW5jdGlvbiAobm9kZSkge1xuXHR0aGlzLl9wcmV2aW91cyA9IG5vZGU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXROZXh0ID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0dGhpcy5fbmV4dCA9IG5vZGU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc0hlYWQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9wcmV2aW91cyA9PT0gbnVsbDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmlzVGFpbCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX25leHQgPT09IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGU7IiwidmFyIEZETGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9GRExheW91dENvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBDb1NFQ29uc3RhbnRzKCkge1xufVxuXG4vL0NvU0VDb25zdGFudHMgaW5oZXJpdHMgc3RhdGljIHByb3BzIGluIEZETGF5b3V0Q29uc3RhbnRzXG5mb3IgKHZhciBwcm9wIGluIEZETGF5b3V0Q29uc3RhbnRzKSB7XG4gIENvU0VDb25zdGFudHNbcHJvcF0gPSBGRExheW91dENvbnN0YW50c1twcm9wXTtcbn1cblxuQ29TRUNvbnN0YW50cy5ERUZBVUxUX1VTRV9NVUxUSV9MRVZFTF9TQ0FMSU5HID0gdHJ1ZTtcbkNvU0VDb25zdGFudHMuREVGQVVMVF9SQURJQUxfU0VQQVJBVElPTiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XG5Db1NFQ29uc3RhbnRzLkRFRkFVTFRfQ09NUE9ORU5UX1NFUEVSQVRJT04gPSA2MDtcbkNvU0VDb25zdGFudHMuVElMRSA9IHRydWU7XG5Db1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX1ZFUlRJQ0FMID0gMTA7XG5Db1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX0hPUklaT05UQUwgPSAxMDtcblxubW9kdWxlLmV4cG9ydHMgPSBDb1NFQ29uc3RhbnRzO1xuIiwidmFyIEZETGF5b3V0RWRnZSA9IHJlcXVpcmUoJy4vRkRMYXlvdXRFZGdlJyk7XG5cbmZ1bmN0aW9uIENvU0VFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xuICBGRExheW91dEVkZ2UuY2FsbCh0aGlzLCBzb3VyY2UsIHRhcmdldCwgdkVkZ2UpO1xufVxuXG5Db1NFRWRnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZETGF5b3V0RWRnZS5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBGRExheW91dEVkZ2UpIHtcbiAgQ29TRUVkZ2VbcHJvcF0gPSBGRExheW91dEVkZ2VbcHJvcF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRUVkZ2VcbiIsInZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xuXG5mdW5jdGlvbiBDb1NFR3JhcGgocGFyZW50LCBncmFwaE1nciwgdkdyYXBoKSB7XG4gIExHcmFwaC5jYWxsKHRoaXMsIHBhcmVudCwgZ3JhcGhNZ3IsIHZHcmFwaCk7XG59XG5cbkNvU0VHcmFwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaC5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGgpIHtcbiAgQ29TRUdyYXBoW3Byb3BdID0gTEdyYXBoW3Byb3BdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VHcmFwaDtcbiIsInZhciBMR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9MR3JhcGhNYW5hZ2VyJyk7XG52YXIgQ29hcnNlbmluZ0dyYXBoID0gcmVxdWlyZSgnLi9Db2Fyc2VuaW5nR3JhcGgnKTtcbnZhciBDb2Fyc2VuaW5nTm9kZSA9IHJlcXVpcmUoJy4vQ29hcnNlbmluZ05vZGUnKTtcbnZhciBDb2Fyc2VuaW5nRWRnZSA9IHJlcXVpcmUoJy4vQ29hcnNlbmluZ0VkZ2UnKTtcbnZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcbnZhciBIYXNoTWFwID0gcmVxdWlyZSgnLi9IYXNoTWFwJyk7XG5cbmZ1bmN0aW9uIENvU0VHcmFwaE1hbmFnZXIobGF5b3V0KSB7XG4gIExHcmFwaE1hbmFnZXIuY2FsbCh0aGlzLCBsYXlvdXQpO1xufVxuXG5Db1NFR3JhcGhNYW5hZ2VyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoTWFuYWdlci5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGhNYW5hZ2VyKSB7XG4gIENvU0VHcmFwaE1hbmFnZXJbcHJvcF0gPSBMR3JhcGhNYW5hZ2VyW3Byb3BdO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VjdGlvbjogQ29hcnNlbmluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbGlzdCBvZiBDb1NFR3JhcGhNYW5hZ2VyLiBcbiAqIFJldHVybmVkIGxpc3QgaG9sZHMgZ3JhcGhzIGZpbmVyIHRvIGNvYXJzZXIgKE0wIHRvIE1rKVxuICogQWRkaXRpb25hbGx5LCB0aGlzIG1ldGhvZCBpcyBvbmx5IGNhbGxlZCBieSBNMC5cbiAqL1xuXG5Db1NFR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jb2Fyc2VuR3JhcGggPSBmdW5jdGlvbigpIFxue1xuICB2YXIgTUxpc3QgPSBbXTtcbiAgdmFyIHByZXZOb2RlQ291bnQ7XG4gIHZhciBjdXJyTm9kZUNvdW50O1xuICBcbiAgLy8gXCJ0aGlzXCIgZ3JhcGggbWFuYWdlciBob2xkcyB0aGUgZmluZXN0IChpbnB1dCkgZ3JhcGhcbiAgTUxpc3QucHVzaCh0aGlzKTtcbiAgXG4gIC8vIGNvYXJzZW5pbmcgZ3JhcGggRyBob2xkcyBvbmx5IHRoZSBsZWFmIG5vZGVzIGFuZCB0aGUgZWRnZXMgYmV0d2VlbiB0aGVtIFxuICAvLyB3aGljaCBhcmUgY29uc2lkZXJlZCBmb3IgY29hcnNlbmluZyBwcm9jZXNzXG4gIHZhciBHID0gbmV3IENvYXJzZW5pbmdHcmFwaCh0aGlzLmdldExheW91dCgpKTtcbiAgXG4gIC8vIGNvbnN0cnVjdCBHMFxuICB0aGlzLmNvbnZlcnRUb0NvYXJzZW5pbmdHcmFwaCh0aGlzLmdldFJvb3QoKSwgRyk7XG4gIGN1cnJOb2RlQ291bnQgPSBHLmdldE5vZGVzKCkubGVuZ3RoO1xuICBcbiAgdmFyIGxhc3RNLCBuZXdNO1xuICBcbiAgLy8gaWYgdHdvIGdyYXBocyBHaSBhbmQgR2krMSBoYXZlIHRoZSBzYW1lIG9yZGVyLCBcbiAgLy8gdGhlbiBHaSA9IEdpKzEgaXMgdGhlIGNvYXJzZXN0IGdyYXBoIChHayksIHNvIHN0b3AgY29hcnNlbmluZyBwcm9jZXNzXG4gIGRvIHtcbiAgICBwcmV2Tm9kZUNvdW50ID0gY3Vyck5vZGVDb3VudDtcblxuICAgIC8vIGNvYXJzZW4gR2lcbiAgICBHLmNvYXJzZW4oKTtcblxuICAgIC8vIGdldCBjdXJyZW50IGNvYXJzZXN0IGdyYXBoIGxhc3RNID0gTWkgYW5kIGNvbnN0cnVjdCBuZXdNID0gTWkrMVxuICAgIGxhc3RNID0gTUxpc3RbTUxpc3QubGVuZ3RoLTFdO1xuICAgIG5ld00gPSB0aGlzLmNvYXJzZW4obGFzdE0pO1xuXG4gICAgTUxpc3QucHVzaChuZXdNKTtcbiAgICBjdXJyTm9kZUNvdW50ID0gRy5nZXROb2RlcygpLmxlbmd0aDtcblxuICB9IHdoaWxlICgocHJldk5vZGVDb3VudCAhPSBjdXJyTm9kZUNvdW50KSAmJiAoY3Vyck5vZGVDb3VudCA+IDEpKTsgIFxuICBcbiAgLy8gY2hhbmdlIGN1cnJlbnRseSBiZWluZyB1c2VkIGdyYXBoIG1hbmFnZXJcbiAgdGhpcy5nZXRMYXlvdXQoKS5zZXRHcmFwaE1hbmFnZXIodGhpcyk7XG5cbiAgTUxpc3QucG9wKCk7XG4gIHJldHVybiBNTGlzdDtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY29udmVydHMgZ2l2ZW4gQ29TRUdyYXBoIHRvIENvYXJzZW5pbmdHcmFwaCBHMFxuICogRzAgY29uc2lzdHMgb2YgbGVhZiBub2RlcyBvZiBDb1NFR3JhcGggYW5kIGVkZ2VzIGJldHdlZW4gdGhlbVxuICovXG5Db1NFR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jb252ZXJ0VG9Db2Fyc2VuaW5nR3JhcGggPSBmdW5jdGlvbihjb3NlRywgRylcbntcbiAgLy8gd2UgbmVlZCBhIG1hcHBpbmcgYmV0d2VlbiBub2RlcyBpbiBNMCBhbmQgRzAsIGZvciBjb25zdHJ1Y3RpbmcgdGhlIGVkZ2VzIG9mIEcwXG4gIHZhciBtYXAgPSBuZXcgSGFzaE1hcCgpO1xuICBcbiAgLy8gY29uc3RydWN0IG5vZGVzIG9mIEcwXG4gIHZhciBub2RlcyA9IGNvc2VHLmdldE5vZGVzKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdiA9IG5vZGVzW2ldO1xuXG4gICAgLy8gaWYgY3VycmVudCBub2RlIGlzIGNvbXBvdW5kLCBcbiAgICAvLyB0aGVuIG1ha2UgYSByZWN1cnNpdmUgY2FsbCB3aXRoIGNoaWxkIGdyYXBoIG9mIGN1cnJlbnQgY29tcG91bmQgbm9kZSBcbiAgICBpZiAodi5nZXRDaGlsZCgpICE9IG51bGwpXG4gICAge1xuICAgICAgdGhpcy5jb252ZXJ0VG9Db2Fyc2VuaW5nR3JhcGgodi5nZXRDaGlsZCgpLCBHKTtcbiAgICB9ICAgXG4gICAgZWxzZSAvLyBvdGhlcndpc2UgY3VycmVudCBub2RlIGlzIGEgbGVhZiwgYW5kIHNob3VsZCBiZSBpbiB0aGUgRzBcbiAgICB7XG4gICAgICAvLyB2IGlzIGEgbGVhZiBub2RlIGluIENvU0UgZ3JhcGgsIGFuZCBpcyByZWZlcmVuY2VkIGJ5IHUgaW4gRzBcbiAgICAgIHZhciB1ID0gbmV3IENvYXJzZW5pbmdOb2RlKCk7XG4gICAgICB1LnNldFJlZmVyZW5jZSh2KTtcblxuICAgICAgLy8gY29uc3RydWN0IGEgbWFwcGluZyBiZXR3ZWVuIHYgKGZyb20gQ29TRSBncmFwaCkgYW5kIHUgKGZyb20gY29hcnNlbmluZyBncmFwaClcbiAgICAgIG1hcC5wdXQodiwgdSk7XG5cbiAgICAgIEcuYWRkKCB1ICk7XG4gICAgfSAgXG4gIH1cbiAgXG4gIC8vIGNvbnN0cnVjdCBlZGdlcyBvZiBHMFxuICB2YXIgZWRnZXMgPSBjb3NlRy5nZXRFZGdlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGUgPSBlZGdlc1tpXTtcbiAgICAgIC8vIGlmIG5laXRoZXIgc291cmNlIG5vciB0YXJnZXQgb2YgZSBpcyBhIGNvbXBvdW5kIG5vZGVcbiAgICAgIC8vIHRoZW4sIGUgaXMgYW4gZWRnZSBiZXR3ZWVuIHR3byBsZWFmIG5vZGVzXG4gICAgICBpZiAoKGUuZ2V0U291cmNlKCkuZ2V0Q2hpbGQoKSA9PSBudWxsKSAmJiAoZS5nZXRUYXJnZXQoKS5nZXRDaGlsZCgpID09IG51bGwpKVxuICAgICAge1xuICAgICAgICBHLmFkZChuZXcgQ29hcnNlbmluZ0VkZ2UoKSwgbWFwLmdldChlLmdldFNvdXJjZSgpKSwgbWFwLmdldChlLmdldFRhcmdldCgpKSk7XG4gICAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgZ2V0cyBNaSAobGFzdE0pIGFuZCBjb2Fyc2VucyB0byBNaSsxXG4gKiBNaSsxIGlzIHJldHVybmVkLlxuICovXG5Db1NFR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jb2Fyc2VuID0gZnVuY3Rpb24obGFzdE0pe1xuXG4gIC8vIGNyZWF0ZSBNaSsxIGFuZCByb290IGdyYXBoIG9mIGl0XG4gIHZhciBuZXdNID0gbmV3IENvU0VHcmFwaE1hbmFnZXIobGFzdE0uZ2V0TGF5b3V0KCkpO1xuICBcbiAgLy8gY2hhbmdlIGN1cnJlbnRseSBiZWluZyB1c2VkIGdyYXBoIG1hbmFnZXJcbiAgbmV3TS5nZXRMYXlvdXQoKS5zZXRHcmFwaE1hbmFnZXIobmV3TSk7XG4gIG5ld00uYWRkUm9vdCgpO1xuICBcbiAgbmV3TS5nZXRSb290KCkudkdyYXBoT2JqZWN0ID0gbGFzdE0uZ2V0Um9vdCgpLnZHcmFwaE9iamVjdDtcbiAgXG4gIC8vIGNvbnN0cnVjdCBub2RlcyBvZiB0aGUgY29hcnNlciBncmFwaCBNaSsxXG4gIHRoaXMuY29hcnNlbk5vZGVzKGxhc3RNLmdldFJvb3QoKSwgbmV3TS5nZXRSb290KCkpO1xuICBcbiAgLy8gY2hhbmdlIGN1cnJlbnRseSBiZWluZyB1c2VkIGdyYXBoIG1hbmFnZXJcbiAgbGFzdE0uZ2V0TGF5b3V0KCkuc2V0R3JhcGhNYW5hZ2VyKGxhc3RNKTtcblxuICAvLyBhZGQgZWRnZXMgdG8gdGhlIGNvYXJzZXIgZ3JhcGggTWkrMVxuICB0aGlzLmFkZEVkZ2VzKGxhc3RNLCBuZXdNKTtcbiAgXG4gIHJldHVybiBuZXdNO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBjb2Fyc2VucyBub2RlcyBvZiBNaSBhbmQgY3JlYXRlcyBub2RlcyBvZiB0aGUgY29hcnNlciBncmFwaCBNaSsxXG4gKiBnOiBNaSwgY29hcnNlckc6IE1pKzFcbiAqL1xuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUuY29hcnNlbk5vZGVzID0gZnVuY3Rpb24oZywgY29hcnNlckcpe1xuICB2YXIgbm9kZXMgPSBnLmdldE5vZGVzKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdiA9IG5vZGVzW2ldO1xuICAgIC8vIGlmIHYgaXMgY29tcG91bmRcbiAgICAvLyB0aGVuLCBjcmVhdGUgdGhlIGNvbXBvdW5kIG5vZGUgdi5uZXh0IHdpdGggYW4gZW1wdHkgY2hpbGQgZ3JhcGhcbiAgICAvLyBhbmQsIG1ha2UgYSByZWN1cnNpdmUgY2FsbCB3aXRoIHYuY2hpbGQgKE1pKSBhbmQgdi5uZXh0LmNoaWxkIChNaSsxKVxuICAgIGlmICh2LmdldENoaWxkKCkgIT0gbnVsbClcbiAgICB7XG4gICAgICB2LnNldE5leHQoY29hcnNlckcuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0TGF5b3V0KCkubmV3Tm9kZShudWxsKSk7XG4gICAgICBjb2Fyc2VyRy5nZXRHcmFwaE1hbmFnZXIoKS5hZGQoY29hcnNlckcuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0TGF5b3V0KCkubmV3R3JhcGgobnVsbCksIHYuZ2V0TmV4dCgpKTtcbiAgICAgIHYuZ2V0TmV4dCgpLnNldFByZWQxKHYpO1xuICAgICAgY29hcnNlckcuYWRkKHYuZ2V0TmV4dCgpKTtcblxuICAgICAgLy92LmdldE5leHQoKS5nZXRDaGlsZCgpLnZHcmFwaE9iamVjdCA9IHYuZ2V0Q2hpbGQoKS52R3JhcGhPYmplY3Q7XG5cbiAgICAgIHRoaXMuY29hcnNlbk5vZGVzKHYuZ2V0Q2hpbGQoKSwgdi5nZXROZXh0KCkuZ2V0Q2hpbGQoKSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAvLyB2Lm5leHQgY2FuIGJlIHJlZmVyZW5jZWQgYnkgdHdvIG5vZGVzLCBzbyBmaXJzdCBjaGVjayBpZiBpdCBpcyBwcm9jZXNzZWQgYmVmb3JlXG4gICAgICBpZiAoIXYuZ2V0TmV4dCgpLmlzUHJvY2Vzc2VkKCkpXG4gICAgICB7XG4gICAgICAgIGNvYXJzZXJHLmFkZCggdi5nZXROZXh0KCkgKTtcbiAgICAgICAgdi5nZXROZXh0KCkuc2V0UHJvY2Vzc2VkKHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICAvL3YuZ2V0TmV4dCgpLnZHcmFwaE9iamVjdCA9IHYudkdyYXBoT2JqZWN0O1xuXG4gICAgLy8gc2V0IGxvY2F0aW9uXG4gICAgdi5nZXROZXh0KCkuc2V0TG9jYXRpb24odi5nZXRMb2NhdGlvbigpLngsIHYuZ2V0TG9jYXRpb24oKS55KTtcbiAgICB2LmdldE5leHQoKS5zZXRIZWlnaHQodi5nZXRIZWlnaHQoKSk7XG4gICAgdi5nZXROZXh0KCkuc2V0V2lkdGgodi5nZXRXaWR0aCgpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBhZGRzIGVkZ2VzIHRvIHRoZSBjb2Fyc2VyIGdyYXBoLlxuICogSXQgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBjb2Fyc2VuTm9kZXMgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiBsYXN0TTogTWksIG5ld006IE1pKzFcbiAqL1xuQ29TRUdyYXBoTWFuYWdlci5wcm90b3R5cGUuYWRkRWRnZXMgPSBmdW5jdGlvbihsYXN0TSwgbmV3TSl7XG5cbiAgdmFyIGFsbEVkZ2VzID0gbGFzdE0uZ2V0QWxsRWRnZXMoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlID0gYWxsRWRnZXNbaV07XG5cbiAgICAvLyBpZiBlIGlzIGFuIGludGVyLWdyYXBoIGVkZ2Ugb3Igc291cmNlIG9yIHRhcmdldCBvZiBlIGlzIGNvbXBvdW5kIFxuICAgIC8vIHRoZW4sIGUgaGFzIG5vdCBjb250cmFjdGVkIGR1cmluZyBjb2Fyc2VuaW5nIHByb2Nlc3MuIEFkZCBlIHRvIHRoZSBjb2Fyc2VyIGdyYXBoLlxuICAgIGlmICggZS5pc0ludGVyR3JhcGggfHwgKGUuZ2V0U291cmNlKCkuZ2V0Q2hpbGQoKSAhPSBudWxsKSB8fCAoZS5nZXRUYXJnZXQoKS5nZXRDaGlsZCgpICE9IG51bGwpIClcbiAgICB7XG4gICAgICAvLyBjaGVjayBpZiBlIGlzIG5vdCBhZGRlZCBiZWZvcmVcbiAgICAgIGlmICggISBlLmdldFNvdXJjZSgpLmdldE5leHQoKS5nZXROZWlnaGJvcnNMaXN0KCkuY29udGFpbnMoKGUuZ2V0VGFyZ2V0KCkpLmdldE5leHQoKSkgKVxuICAgICAge1xuICAgICAgICBuZXdNLmFkZChuZXdNLmdldExheW91dCgpLm5ld0VkZ2UobnVsbCksIGUuZ2V0U291cmNlKCkuZ2V0TmV4dCgpLCBlLmdldFRhcmdldCgpLmdldE5leHQoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIG90aGVyd2lzZSwgaWYgZSBpcyBub3QgY29udHJhY3RlZCBkdXJpbmcgY29hcnNlbmluZyBwcm9jZXNzXG4gICAgLy8gdGhlbiwgYWRkIGl0IHRvIHRoZSAgY29hcnNlciBncmFwaFxuICAgIGVsc2VcbiAgICB7XG4gICAgICBpZiAoZS5nZXRTb3VyY2UoKS5nZXROZXh0KCkgIT0gZS5nZXRUYXJnZXQoKS5nZXROZXh0KCkpXG4gICAgICB7XG4gICAgICAgIC8vIGNoZWNrIGlmIGUgaXMgbm90IGFkZGVkIGJlZm9yZVxuICAgICAgICBpZiAoIWUuZ2V0U291cmNlKCkuZ2V0TmV4dCgpLmdldE5laWdoYm9yc0xpc3QoKS5jb250YWlucyhlLmdldFRhcmdldCgpLmdldE5leHQoKSkpXG4gICAgICAgIHtcbiAgICAgICAgICBuZXdNLmFkZChuZXdNLmdldExheW91dCgpLm5ld0VkZ2UobnVsbCksIGUuZ2V0U291cmNlKCkuZ2V0TmV4dCgpLCBlLmdldFRhcmdldCgpLmdldE5leHQoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRUdyYXBoTWFuYWdlcjtcbiIsInZhciBGRExheW91dCA9IHJlcXVpcmUoJy4vRkRMYXlvdXQnKTtcbnZhciBDb1NFR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db1NFR3JhcGhNYW5hZ2VyJyk7XG52YXIgQ29TRUdyYXBoID0gcmVxdWlyZSgnLi9Db1NFR3JhcGgnKTtcbnZhciBDb1NFTm9kZSA9IHJlcXVpcmUoJy4vQ29TRU5vZGUnKTtcbnZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcbnZhciBDb1NFQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db1NFQ29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xudmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XG52YXIgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybScpO1xuXG5mdW5jdGlvbiBDb1NFTGF5b3V0KCkge1xuICBGRExheW91dC5jYWxsKHRoaXMpO1xuICBcbiAgdGhpcy50b0JlVGlsZWQgPSB7fTsgLy8gTWVtb3JpemUgaWYgYSBub2RlIGlzIHRvIGJlIHRpbGVkIG9yIGlzIHRpbGVkXG59XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGRExheW91dC5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIEZETGF5b3V0KSB7XG4gIENvU0VMYXlvdXRbcHJvcF0gPSBGRExheW91dFtwcm9wXTtcbn1cblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZ20gPSBuZXcgQ29TRUdyYXBoTWFuYWdlcih0aGlzKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcbiAgcmV0dXJuIGdtO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3R3JhcGggPSBmdW5jdGlvbiAodkdyYXBoKSB7XG4gIHJldHVybiBuZXcgQ29TRUdyYXBoKG51bGwsIHRoaXMuZ3JhcGhNYW5hZ2VyLCB2R3JhcGgpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3Tm9kZSA9IGZ1bmN0aW9uICh2Tm9kZSkge1xuICByZXR1cm4gbmV3IENvU0VOb2RlKHRoaXMuZ3JhcGhNYW5hZ2VyLCB2Tm9kZSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5uZXdFZGdlID0gZnVuY3Rpb24gKHZFZGdlKSB7XG4gIHJldHVybiBuZXcgQ29TRUVkZ2UobnVsbCwgbnVsbCwgdkVkZ2UpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIEZETGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycy5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG4gIGlmICghdGhpcy5pc1N1YkxheW91dCkge1xuICAgIGlmIChDb1NFQ29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPCAxMClcbiAgICB7XG4gICAgICB0aGlzLmlkZWFsRWRnZUxlbmd0aCA9IDEwO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgdGhpcy5pZGVhbEVkZ2VMZW5ndGggPSBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XG4gICAgfVxuXG4gICAgdGhpcy51c2VTbWFydElkZWFsRWRnZUxlbmd0aENhbGN1bGF0aW9uID1cbiAgICAgICAgICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT047XG4gICAgdGhpcy51c2VNdWx0aUxldmVsU2NhbGluZyA9XG4gICAgICAgICAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfVVNFX01VTFRJX0xFVkVMX1NDQUxJTkc7XG4gICAgdGhpcy5zcHJpbmdDb25zdGFudCA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSDtcbiAgICB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIO1xuICAgIHRoaXMuZ3Jhdml0eUNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9TVFJFTkdUSDtcbiAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSDtcbiAgICB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvciA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SO1xuICAgIHRoaXMuY29tcG91bmRHcmF2aXR5UmFuZ2VGYWN0b3IgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUjtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY3JlYXRlQmVuZHNBc05lZWRlZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQ7XG4gIGlmIChjcmVhdGVCZW5kc0FzTmVlZGVkKVxuICB7XG4gICAgdGhpcy5jcmVhdGVCZW5kcG9pbnRzKCk7XG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xuICB9XG4gIGlmKHRoaXMudXNlTXVsdGlMZXZlbFNjYWxpbmcgJiYgIXRoaXMuaW5jcmVtZW50YWwpXG4gIHtcbiAgICBjb25zb2xlLmxvZyhcIkhlbGxvIG11bHRpbGV2ZWxcIik7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlMZXZlbFNjYWxpbmdMYXlvdXQoKTtcbiAgfVxuICBlbHNlIHtcbiAgICB0aGlzLmxldmVsID0gMDtcbiAgICByZXR1cm4gdGhpcy5jbGFzc2ljTGF5b3V0KCk7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLm11bHRpTGV2ZWxTY2FsaW5nTGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZ20gPSB0aGlzLmdyYXBoTWFuYWdlcjtcbiAgXG4gIC8vIFN0YXJ0IGNvYXJzZW5pbmcgcHJvY2Vzc1xuXG4gIC8vIHNhdmUgZ3JhcGggbWFuYWdlcnMgTTAgdG8gTWsgaW4gYW4gYXJyYXkgbGlzdFxuICB0aGlzLk1MaXN0ID0gZ20uY29hcnNlbkdyYXBoKCk7XG4gIFxuICB0aGlzLm5vT2ZMZXZlbHMgPSB0aGlzLk1MaXN0Lmxlbmd0aC0xO1xuICB0aGlzLmxldmVsID0gdGhpcy5ub09mTGV2ZWxzO1xuICBcbiAgd2hpbGUgKHRoaXMubGV2ZWwgPj0gMClcbiAge1xuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ20gPSB0aGlzLk1MaXN0W3RoaXMubGV2ZWxdO1xuXG4gICAgY29uc29sZS5sb2coXCJAXCIgKyB0aGlzLmxldmVsICsgXCJ0aCBsZXZlbCwgd2l0aCBcIiArIGdtLmdldEFsbE5vZGVzKCkubGVuZ3RoICsgXCIgbm9kZXMuIFwiKTtcbiAgICB0aGlzLmNsYXNzaWNMYXlvdXQoKTtcbiAgICBjb25zb2xlLmxvZyhcIkxheW91dCBpcyBmaW5pc2hlZCBmb3IgdGhpcyBsZXZlbFwiKTtcbiAgICAvLyBhZnRlciBmaW5pc2hpbmcgbGF5b3V0IG9mIGZpcnN0IChjb2Fyc2VzdCkgbGV2ZWwsXG4gICAgdGhpcy5pbmNyZW1lbnRhbCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5sZXZlbCA+PSAxKSBcbiAgICB7XHRcbiAgICAgIHRoaXMudW5jb2Fyc2VuKCk7IC8vIGFsc28gbWFrZXMgaW5pdGlhbCBwbGFjZW1lbnQgZm9yIE1pLTFcbiAgICB9XG5cbiAgICAvLyByZXNldCB0b3RhbCBpdGVyYXRpb25zXG4gICAgdGhpcy50b3RhbEl0ZXJhdGlvbnMgPSAwO1xuXG4gICAgdGhpcy5sZXZlbC0tO1xuICB9XG4gIFxuICB0aGlzLmluY3JlbWVudGFsID0gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xhc3NpY0xheW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5ub2Rlc1dpdGhHcmF2aXR5ID0gdGhpcy5jYWxjdWxhdGVOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvblRvKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKHRoaXMubm9kZXNXaXRoR3Jhdml0eSk7XG4gIHRoaXMuY2FsY05vT2ZDaGlsZHJlbkZvckFsbE5vZGVzKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLmNhbGNMb3dlc3RDb21tb25BbmNlc3RvcnMoKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIuY2FsY0luY2x1c2lvblRyZWVEZXB0aHMoKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmNhbGNFc3RpbWF0ZWRTaXplKCk7XG4gIHRoaXMuY2FsY0lkZWFsRWRnZUxlbmd0aHMoKTtcbiAgXG4gIGlmICghdGhpcy5pbmNyZW1lbnRhbClcbiAge1xuICAgIHZhciBmb3Jlc3QgPSB0aGlzLmdldEZsYXRGb3Jlc3QoKTtcblxuICAgIC8vIFRoZSBncmFwaCBhc3NvY2lhdGVkIHdpdGggdGhpcyBsYXlvdXQgaXMgZmxhdCBhbmQgYSBmb3Jlc3RcbiAgICBpZiAoZm9yZXN0Lmxlbmd0aCA+IDApXG4gICAge1xuICAgICAgdGhpcy5wb3NpdGlvbk5vZGVzUmFkaWFsbHkoZm9yZXN0KTtcbiAgICB9XG4gICAgLy8gVGhlIGdyYXBoIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGxheW91dCBpcyBub3QgZmxhdCBvciBhIGZvcmVzdFxuICAgIGVsc2VcbiAgICB7XG4gICAgICAvLyBSZWR1Y2UgdGhlIHRyZWVzIHdoZW4gaW5jcmVtZW50YWwgbW9kZSBpcyBub3QgZW5hYmxlZCBhbmQgZ3JhcGggaXMgbm90IGEgZm9yZXN0IFxuLy8gICAgICB0aGlzLnJlZHVjZVRyZWVzKCk7XG4gICAgICAvLyBVcGRhdGUgbm9kZXMgdGhhdCBncmF2aXR5IHdpbGwgYmUgYXBwbGllZFxuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbigpO1xuICAgICAgdmFyIGFsbE5vZGVzID0gbmV3IFNldCh0aGlzLmdldEFsbE5vZGVzKCkpO1xuICAgICAgdmFyIGludGVyc2VjdGlvbiA9IHRoaXMubm9kZXNXaXRoR3Jhdml0eS5maWx0ZXIoeCA9PiBhbGxOb2Rlcy5oYXMoeCkpO1xuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIuc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oaW50ZXJzZWN0aW9uKTtcbiAgICAgIFxuICAgICAgdGhpcy5wb3NpdGlvbk5vZGVzUmFuZG9tbHkoKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmluaXRTcHJpbmdFbWJlZGRlcigpO1xuICB0aGlzLnJ1blNwcmluZ0VtYmVkZGVyKCk7XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG52YXIgbm9kZXNEZXRhaWw7XG52YXIgZWRnZXNEZXRhaWw7XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50b3RhbEl0ZXJhdGlvbnMrKztcbiAgXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyA9PT0gdGhpcy5tYXhJdGVyYXRpb25zICYmICF0aGlzLmlzVHJlZUdyb3dpbmcgJiYgIXRoaXMuaXNHcm93dGhGaW5pc2hlZCkge1xuICAgIGlmKHRoaXMucHJ1bmVkTm9kZXNBbGwubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLmlzVHJlZUdyb3dpbmcgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlOyAgXG4gICAgfVxuICB9XG4gIFxuICBpZiAodGhpcy50b3RhbEl0ZXJhdGlvbnMgJSBGRExheW91dENvbnN0YW50cy5DT05WRVJHRU5DRV9DSEVDS19QRVJJT0QgPT0gMCAgJiYgIXRoaXMuaXNUcmVlR3Jvd2luZyAmJiAhdGhpcy5pc0dyb3d0aEZpbmlzaGVkKVxuICB7XG4gICAgaWYgKHRoaXMuaXNDb252ZXJnZWQoKSlcbiAgICB7XG4gICAgICBpZih0aGlzLnBydW5lZE5vZGVzQWxsLmxlbmd0aCA+IDApe1xuICAgICAgICB0aGlzLmlzVHJlZUdyb3dpbmcgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlOyAgXG4gICAgICB9IFxuICAgIH1cblxuICAgIHRoaXMuY29vbGluZ0ZhY3RvciA9IHRoaXMuaW5pdGlhbENvb2xpbmdGYWN0b3IgKlxuICAgICAgICAgICAgKCh0aGlzLm1heEl0ZXJhdGlvbnMgLSB0aGlzLnRvdGFsSXRlcmF0aW9ucykgLyB0aGlzLm1heEl0ZXJhdGlvbnMpO1xuICAgIHRoaXMuYW5pbWF0aW9uUGVyaW9kID0gTWF0aC5jZWlsKHRoaXMuaW5pdGlhbEFuaW1hdGlvblBlcmlvZCAqIE1hdGguc3FydCh0aGlzLmNvb2xpbmdGYWN0b3IpKTtcbiAgfVxuICAvLyBPcGVyYXRpb25zIHdoaWxlIHRyZWUgaXMgZ3Jvd2luZyBhZ2FpbiBcbiAgaWYodGhpcy5pc1RyZWVHcm93aW5nKXtcbiAgICBpZih0aGlzLmdyb3dUcmVlSXRlcmF0aW9ucyAlIDEwID09IDApe1xuICAgICAgaWYodGhpcy5wcnVuZWROb2Rlc0FsbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUdyaWQoKTtcbiAgICAgICAgdGhpcy5ncm93VHJlZSh0aGlzLnBydW5lZE5vZGVzQWxsKTtcbiAgICAgICAgLy8gVXBkYXRlIG5vZGVzIHRoYXQgZ3Jhdml0eSB3aWxsIGJlIGFwcGxpZWRcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbigpO1xuICAgICAgICB2YXIgYWxsTm9kZXMgPSBuZXcgU2V0KHRoaXMuZ2V0QWxsTm9kZXMoKSk7XG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSB0aGlzLm5vZGVzV2l0aEdyYXZpdHkuZmlsdGVyKHggPT4gYWxsTm9kZXMuaGFzKHgpKTtcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIuc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oaW50ZXJzZWN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZUdyaWQoKTsgXG4gICAgICAgIHRoaXMuY29vbGluZ0ZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUw7IFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuaXNUcmVlR3Jvd2luZyA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMuaXNHcm93dGhGaW5pc2hlZCA9IHRydWU7IFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmdyb3dUcmVlSXRlcmF0aW9ucysrO1xuICB9XG4gIC8vIE9wZXJhdGlvbnMgYWZ0ZXIgZ3Jvd3RoIGlzIGZpbmlzaGVkXG4gIGlmKHRoaXMuaXNHcm93dGhGaW5pc2hlZCl7XG4gICAgaWYgKHRoaXMuaXNDb252ZXJnZWQoKSlcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTsgIFxuICAgIH1cbiAgICBpZih0aGlzLmFmdGVyR3Jvd3RoSXRlcmF0aW9ucyAlIDEwID09IDApe1xuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gICAgICB0aGlzLnVwZGF0ZUdyaWQoKTsgXG4gICAgfVxuICAgIHRoaXMuY29vbGluZ0ZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUwgKiAoKDEwMCAtIHRoaXMuYWZ0ZXJHcm93dGhJdGVyYXRpb25zKSAvIDEwMCk7XG4gICAgdGhpcy5hZnRlckdyb3d0aEl0ZXJhdGlvbnMrKztcbiAgfVxuICBcbiAgdGhpcy50b3RhbERpc3BsYWNlbWVudCA9IDA7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xuICBlZGdlc0RldGFpbCA9IHRoaXMuY2FsY1NwcmluZ0ZvcmNlcygpO1xuICB0aGlzLmNhbGNSZXB1bHNpb25Gb3JjZXMoKTtcbiAgdGhpcy5jYWxjR3Jhdml0YXRpb25hbEZvcmNlcygpO1xuICBub2Rlc0RldGFpbCA9IHRoaXMubW92ZU5vZGVzKCk7XG4gIHRoaXMuYW5pbWF0ZSgpO1xuICBcbiAgcmV0dXJuIGZhbHNlOyAvLyBMYXlvdXQgaXMgbm90IGVuZGVkIHlldCByZXR1cm4gZmFsc2Vcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldFBvc2l0aW9uc0RhdGEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcbiAgdmFyIHBEYXRhID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcmVjdCA9IGFsbE5vZGVzW2ldLnJlY3Q7XG4gICAgdmFyIGlkID0gYWxsTm9kZXNbaV0uaWQ7XG4gICAgcERhdGFbaWRdID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgeDogcmVjdC5nZXRDZW50ZXJYKCksXG4gICAgICB5OiByZWN0LmdldENlbnRlclkoKSxcbiAgICAgIHc6IHJlY3Qud2lkdGgsXG4gICAgICBoOiByZWN0LmhlaWdodCxcbiAgICAgIHNwcmluZ0ZvcmNlWDogbm9kZXNEZXRhaWxbaV0uc3ByaW5nRm9yY2VYLFxuICAgICAgc3ByaW5nRm9yY2VZOiBub2Rlc0RldGFpbFtpXS5zcHJpbmdGb3JjZVksXG4gICAgICByZXB1bHNpb25Gb3JjZVg6IG5vZGVzRGV0YWlsW2ldLnJlcHVsc2lvbkZvcmNlWCxcbiAgICAgIHJlcHVsc2lvbkZvcmNlWTogbm9kZXNEZXRhaWxbaV0ucmVwdWxzaW9uRm9yY2VZLFxuICAgICAgZ3Jhdml0YXRpb25Gb3JjZVg6IG5vZGVzRGV0YWlsW2ldLmdyYXZpdGF0aW9uRm9yY2VYLFxuICAgICAgZ3Jhdml0YXRpb25Gb3JjZVk6IG5vZGVzRGV0YWlsW2ldLmdyYXZpdGF0aW9uRm9yY2VZLFxuICAgICAgZGlzcGxhY2VtZW50WDogbm9kZXNEZXRhaWxbaV0uZGlzcGxhY2VtZW50WCxcbiAgICAgIGRpc3BsYWNlbWVudFk6IG5vZGVzRGV0YWlsW2ldLmRpc3BsYWNlbWVudFlcbiAgICB9O1xuICB9XG4gIHJldHVybiBwRGF0YTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldEVkZ2VzRGF0YSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYWxsRWRnZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpO1xuICB2YXIgZURhdGEgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IGFsbEVkZ2VzW2ldLmlkO1xuICAgIGVEYXRhW2lkXSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNvdXJjZTogKGVkZ2VzRGV0YWlsW2ldICE9IG51bGwpID8gZWRnZXNEZXRhaWxbaV0uc291cmNlIDogXCJcIixcbiAgICAgIHRhcmdldDogKGVkZ2VzRGV0YWlsW2ldICE9IG51bGwpID8gZWRnZXNEZXRhaWxbaV0udGFyZ2V0IDogXCJcIixcbiAgICAgIGxlbmd0aDogKGVkZ2VzRGV0YWlsW2ldICE9IG51bGwpID8gZWRnZXNEZXRhaWxbaV0ubGVuZ3RoIDogXCJcIixcbiAgICAgIHhMZW5ndGg6IChlZGdlc0RldGFpbFtpXSAhPSBudWxsKSA/IGVkZ2VzRGV0YWlsW2ldLnhMZW5ndGggOiBcIlwiLFxuICAgICAgeUxlbmd0aDogKGVkZ2VzRGV0YWlsW2ldICE9IG51bGwpID8gZWRnZXNEZXRhaWxbaV0ueUxlbmd0aCA6IFwiXCJcbiAgICB9O1xuICB9XG4gIHJldHVybiBlRGF0YTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnJ1blNwcmluZ0VtYmVkZGVyID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmluaXRpYWxBbmltYXRpb25QZXJpb2QgPSAyNTtcbiAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSB0aGlzLmluaXRpYWxBbmltYXRpb25QZXJpb2Q7XG4gIHZhciBsYXlvdXRFbmRlZCA9IGZhbHNlO1xuICBcbiAgLy8gSWYgYW1pbmF0ZSBvcHRpb24gaXMgJ2R1cmluZycgc2lnbmFsIHRoYXQgbGF5b3V0IGlzIHN1cHBvc2VkIHRvIHN0YXJ0IGl0ZXJhdGluZ1xuICBpZiAoIEZETGF5b3V0Q29uc3RhbnRzLkFOSU1BVEUgPT09ICdkdXJpbmcnICkge1xuICAgIHRoaXMuZW1pdCgnbGF5b3V0c3RhcnRlZCcpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIElmIGFtaW5hdGUgb3B0aW9uIGlzICdkdXJpbmcnIHRpY2soKSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbiBpbmRleC5qc1xuICAgIHdoaWxlICghbGF5b3V0RW5kZWQpIHtcbiAgICAgIGxheW91dEVuZGVkID0gdGhpcy50aWNrKCk7XG4gICAgfVxuXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlTGlzdCA9IFtdO1xuICB2YXIgZ3JhcGg7XG5cbiAgdmFyIGdyYXBocyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEdyYXBocygpO1xuICB2YXIgc2l6ZSA9IGdyYXBocy5sZW5ndGg7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgc2l6ZTsgaSsrKVxuICB7XG4gICAgZ3JhcGggPSBncmFwaHNbaV07XG5cbiAgICBncmFwaC51cGRhdGVDb25uZWN0ZWQoKTtcblxuICAgIGlmICghZ3JhcGguaXNDb25uZWN0ZWQpXG4gICAge1xuICAgICAgbm9kZUxpc3QgPSBub2RlTGlzdC5jb25jYXQoZ3JhcGguZ2V0Tm9kZXMoKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5vZGVMaXN0O1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2FsY05vT2ZDaGlsZHJlbkZvckFsbE5vZGVzID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIG5vZGU7XG4gIHZhciBhbGxOb2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICAgIG5vZGUgPSBhbGxOb2Rlc1tpXTtcbiAgICAgIG5vZGUubm9PZkNoaWxkcmVuID0gbm9kZS5nZXROb09mQ2hpbGRyZW4oKTtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY3JlYXRlQmVuZHBvaW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVkZ2VzID0gW107XG4gIGVkZ2VzID0gZWRnZXMuY29uY2F0KHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCkpO1xuICB2YXIgdmlzaXRlZCA9IG5ldyBIYXNoU2V0KCk7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuXG4gICAgaWYgKCF2aXNpdGVkLmNvbnRhaW5zKGVkZ2UpKVxuICAgIHtcbiAgICAgIHZhciBzb3VyY2UgPSBlZGdlLmdldFNvdXJjZSgpO1xuICAgICAgdmFyIHRhcmdldCA9IGVkZ2UuZ2V0VGFyZ2V0KCk7XG5cbiAgICAgIGlmIChzb3VyY2UgPT0gdGFyZ2V0KVxuICAgICAge1xuICAgICAgICBlZGdlLmdldEJlbmRwb2ludHMoKS5wdXNoKG5ldyBQb2ludEQoKSk7XG4gICAgICAgIGVkZ2UuZ2V0QmVuZHBvaW50cygpLnB1c2gobmV3IFBvaW50RCgpKTtcbiAgICAgICAgdGhpcy5jcmVhdGVEdW1teU5vZGVzRm9yQmVuZHBvaW50cyhlZGdlKTtcbiAgICAgICAgdmlzaXRlZC5hZGQoZWRnZSk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHZhciBlZGdlTGlzdCA9IFtdO1xuXG4gICAgICAgIGVkZ2VMaXN0ID0gZWRnZUxpc3QuY29uY2F0KHNvdXJjZS5nZXRFZGdlTGlzdFRvTm9kZSh0YXJnZXQpKTtcbiAgICAgICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQodGFyZ2V0LmdldEVkZ2VMaXN0VG9Ob2RlKHNvdXJjZSkpO1xuXG4gICAgICAgIGlmICghdmlzaXRlZC5jb250YWlucyhlZGdlTGlzdFswXSkpXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoZWRnZUxpc3QubGVuZ3RoID4gMSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBlZGdlTGlzdC5sZW5ndGg7IGsrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFyIG11bHRpRWRnZSA9IGVkZ2VMaXN0W2tdO1xuICAgICAgICAgICAgICBtdWx0aUVkZ2UuZ2V0QmVuZHBvaW50cygpLnB1c2gobmV3IFBvaW50RCgpKTtcbiAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEdW1teU5vZGVzRm9yQmVuZHBvaW50cyhtdWx0aUVkZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2aXNpdGVkLmFkZEFsbChsaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2aXNpdGVkLnNpemUoKSA9PSBlZGdlcy5sZW5ndGgpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5wb3NpdGlvbk5vZGVzUmFkaWFsbHkgPSBmdW5jdGlvbiAoZm9yZXN0KSB7XG4gIC8vIFdlIHRpbGUgdGhlIHRyZWVzIHRvIGEgZ3JpZCByb3cgYnkgcm93OyBmaXJzdCB0cmVlIHN0YXJ0cyBhdCAoMCwwKVxuICB2YXIgY3VycmVudFN0YXJ0aW5nUG9pbnQgPSBuZXcgUG9pbnQoMCwgMCk7XG4gIHZhciBudW1iZXJPZkNvbHVtbnMgPSBNYXRoLmNlaWwoTWF0aC5zcXJ0KGZvcmVzdC5sZW5ndGgpKTtcbiAgdmFyIGhlaWdodCA9IDA7XG4gIHZhciBjdXJyZW50WSA9IDA7XG4gIHZhciBjdXJyZW50WCA9IDA7XG4gIHZhciBwb2ludCA9IG5ldyBQb2ludEQoMCwgMCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3Jlc3QubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBpZiAoaSAlIG51bWJlck9mQ29sdW1ucyA9PSAwKVxuICAgIHtcbiAgICAgIC8vIFN0YXJ0IG9mIGEgbmV3IHJvdywgbWFrZSB0aGUgeCBjb29yZGluYXRlIDAsIGluY3JlbWVudCB0aGVcbiAgICAgIC8vIHkgY29vcmRpbmF0ZSB3aXRoIHRoZSBtYXggaGVpZ2h0IG9mIHRoZSBwcmV2aW91cyByb3dcbiAgICAgIGN1cnJlbnRYID0gMDtcbiAgICAgIGN1cnJlbnRZID0gaGVpZ2h0O1xuXG4gICAgICBpZiAoaSAhPSAwKVxuICAgICAge1xuICAgICAgICBjdXJyZW50WSArPSBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfQ09NUE9ORU5UX1NFUEVSQVRJT047XG4gICAgICB9XG5cbiAgICAgIGhlaWdodCA9IDA7XG4gICAgfVxuXG4gICAgdmFyIHRyZWUgPSBmb3Jlc3RbaV07XG5cbiAgICAvLyBGaW5kIHRoZSBjZW50ZXIgb2YgdGhlIHRyZWVcbiAgICB2YXIgY2VudGVyTm9kZSA9IExheW91dC5maW5kQ2VudGVyT2ZUcmVlKHRyZWUpO1xuXG4gICAgLy8gU2V0IHRoZSBzdGFyaW5nIHBvaW50IG9mIHRoZSBuZXh0IHRyZWVcbiAgICBjdXJyZW50U3RhcnRpbmdQb2ludC54ID0gY3VycmVudFg7XG4gICAgY3VycmVudFN0YXJ0aW5nUG9pbnQueSA9IGN1cnJlbnRZO1xuXG4gICAgLy8gRG8gYSByYWRpYWwgbGF5b3V0IHN0YXJ0aW5nIHdpdGggdGhlIGNlbnRlclxuICAgIHBvaW50ID1cbiAgICAgICAgICAgIENvU0VMYXlvdXQucmFkaWFsTGF5b3V0KHRyZWUsIGNlbnRlck5vZGUsIGN1cnJlbnRTdGFydGluZ1BvaW50KTtcblxuICAgIGlmIChwb2ludC55ID4gaGVpZ2h0KVxuICAgIHtcbiAgICAgIGhlaWdodCA9IE1hdGguZmxvb3IocG9pbnQueSk7XG4gICAgfVxuXG4gICAgY3VycmVudFggPSBNYXRoLmZsb29yKHBvaW50LnggKyBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfQ09NUE9ORU5UX1NFUEVSQVRJT04pO1xuICB9XG5cbiAgdGhpcy50cmFuc2Zvcm0oXG4gICAgICAgICAgbmV3IFBvaW50RChMYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1ggLSBwb2ludC54IC8gMixcbiAgICAgICAgICAgICAgICAgIExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWSAtIHBvaW50LnkgLyAyKSk7XG59O1xuXG5Db1NFTGF5b3V0LnJhZGlhbExheW91dCA9IGZ1bmN0aW9uICh0cmVlLCBjZW50ZXJOb2RlLCBzdGFydGluZ1BvaW50KSB7XG4gIHZhciByYWRpYWxTZXAgPSBNYXRoLm1heCh0aGlzLm1heERpYWdvbmFsSW5UcmVlKHRyZWUpLFxuICAgICAgICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9SQURJQUxfU0VQQVJBVElPTik7XG4gIENvU0VMYXlvdXQuYnJhbmNoUmFkaWFsTGF5b3V0KGNlbnRlck5vZGUsIG51bGwsIDAsIDM1OSwgMCwgcmFkaWFsU2VwKTtcbiAgdmFyIGJvdW5kcyA9IExHcmFwaC5jYWxjdWxhdGVCb3VuZHModHJlZSk7XG5cbiAgdmFyIHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTtcbiAgdHJhbnNmb3JtLnNldERldmljZU9yZ1goYm91bmRzLmdldE1pblgoKSk7XG4gIHRyYW5zZm9ybS5zZXREZXZpY2VPcmdZKGJvdW5kcy5nZXRNaW5ZKCkpO1xuICB0cmFuc2Zvcm0uc2V0V29ybGRPcmdYKHN0YXJ0aW5nUG9pbnQueCk7XG4gIHRyYW5zZm9ybS5zZXRXb3JsZE9yZ1koc3RhcnRpbmdQb2ludC55KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgbm9kZSA9IHRyZWVbaV07XG4gICAgbm9kZS50cmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgfVxuXG4gIHZhciBib3R0b21SaWdodCA9XG4gICAgICAgICAgbmV3IFBvaW50RChib3VuZHMuZ2V0TWF4WCgpLCBib3VuZHMuZ2V0TWF4WSgpKTtcblxuICByZXR1cm4gdHJhbnNmb3JtLmludmVyc2VUcmFuc2Zvcm1Qb2ludChib3R0b21SaWdodCk7XG59O1xuXG5Db1NFTGF5b3V0LmJyYW5jaFJhZGlhbExheW91dCA9IGZ1bmN0aW9uIChub2RlLCBwYXJlbnRPZk5vZGUsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBkaXN0YW5jZSwgcmFkaWFsU2VwYXJhdGlvbikge1xuICAvLyBGaXJzdCwgcG9zaXRpb24gdGhpcyBub2RlIGJ5IGZpbmRpbmcgaXRzIGFuZ2xlLlxuICB2YXIgaGFsZkludGVydmFsID0gKChlbmRBbmdsZSAtIHN0YXJ0QW5nbGUpICsgMSkgLyAyO1xuXG4gIGlmIChoYWxmSW50ZXJ2YWwgPCAwKVxuICB7XG4gICAgaGFsZkludGVydmFsICs9IDE4MDtcbiAgfVxuXG4gIHZhciBub2RlQW5nbGUgPSAoaGFsZkludGVydmFsICsgc3RhcnRBbmdsZSkgJSAzNjA7XG4gIHZhciB0ZXRhID0gKG5vZGVBbmdsZSAqIElHZW9tZXRyeS5UV09fUEkpIC8gMzYwO1xuXG4gIC8vIE1ha2UgcG9sYXIgdG8gamF2YSBjb3JkaW5hdGUgY29udmVyc2lvbi5cbiAgdmFyIGNvc190ZXRhID0gTWF0aC5jb3ModGV0YSk7XG4gIHZhciB4XyA9IGRpc3RhbmNlICogTWF0aC5jb3ModGV0YSk7XG4gIHZhciB5XyA9IGRpc3RhbmNlICogTWF0aC5zaW4odGV0YSk7XG5cbiAgbm9kZS5zZXRDZW50ZXIoeF8sIHlfKTtcblxuICAvLyBUcmF2ZXJzZSBhbGwgbmVpZ2hib3JzIG9mIHRoaXMgbm9kZSBhbmQgcmVjdXJzaXZlbHkgY2FsbCB0aGlzXG4gIC8vIGZ1bmN0aW9uLlxuICB2YXIgbmVpZ2hib3JFZGdlcyA9IFtdO1xuICBuZWlnaGJvckVkZ2VzID0gbmVpZ2hib3JFZGdlcy5jb25jYXQobm9kZS5nZXRFZGdlcygpKTtcbiAgdmFyIGNoaWxkQ291bnQgPSBuZWlnaGJvckVkZ2VzLmxlbmd0aDtcblxuICBpZiAocGFyZW50T2ZOb2RlICE9IG51bGwpXG4gIHtcbiAgICBjaGlsZENvdW50LS07XG4gIH1cblxuICB2YXIgYnJhbmNoQ291bnQgPSAwO1xuXG4gIHZhciBpbmNFZGdlc0NvdW50ID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XG4gIHZhciBzdGFydEluZGV4O1xuXG4gIHZhciBlZGdlcyA9IG5vZGUuZ2V0RWRnZXNCZXR3ZWVuKHBhcmVudE9mTm9kZSk7XG5cbiAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIGVkZ2VzLCBwcnVuZSB0aGVtIHVudGlsIHRoZXJlIHJlbWFpbnMgb25seSBvbmVcbiAgLy8gZWRnZS5cbiAgd2hpbGUgKGVkZ2VzLmxlbmd0aCA+IDEpXG4gIHtcbiAgICAvL25laWdoYm9yRWRnZXMucmVtb3ZlKGVkZ2VzLnJlbW92ZSgwKSk7XG4gICAgdmFyIHRlbXAgPSBlZGdlc1swXTtcbiAgICBlZGdlcy5zcGxpY2UoMCwgMSk7XG4gICAgdmFyIGluZGV4ID0gbmVpZ2hib3JFZGdlcy5pbmRleE9mKHRlbXApO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBuZWlnaGJvckVkZ2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIGluY0VkZ2VzQ291bnQtLTtcbiAgICBjaGlsZENvdW50LS07XG4gIH1cblxuICBpZiAocGFyZW50T2ZOb2RlICE9IG51bGwpXG4gIHtcbiAgICAvL2Fzc2VydCBlZGdlcy5sZW5ndGggPT0gMTtcbiAgICBzdGFydEluZGV4ID0gKG5laWdoYm9yRWRnZXMuaW5kZXhPZihlZGdlc1swXSkgKyAxKSAlIGluY0VkZ2VzQ291bnQ7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgc3RhcnRJbmRleCA9IDA7XG4gIH1cblxuICB2YXIgc3RlcEFuZ2xlID0gTWF0aC5hYnMoZW5kQW5nbGUgLSBzdGFydEFuZ2xlKSAvIGNoaWxkQ291bnQ7XG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXg7XG4gICAgICAgICAgYnJhbmNoQ291bnQgIT0gY2hpbGRDb3VudDtcbiAgICAgICAgICBpID0gKCsraSkgJSBpbmNFZGdlc0NvdW50KVxuICB7XG4gICAgdmFyIGN1cnJlbnROZWlnaGJvciA9XG4gICAgICAgICAgICBuZWlnaGJvckVkZ2VzW2ldLmdldE90aGVyRW5kKG5vZGUpO1xuXG4gICAgLy8gRG9uJ3QgYmFjayB0cmF2ZXJzZSB0byByb290IG5vZGUgaW4gY3VycmVudCB0cmVlLlxuICAgIGlmIChjdXJyZW50TmVpZ2hib3IgPT0gcGFyZW50T2ZOb2RlKVxuICAgIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBjaGlsZFN0YXJ0QW5nbGUgPVxuICAgICAgICAgICAgKHN0YXJ0QW5nbGUgKyBicmFuY2hDb3VudCAqIHN0ZXBBbmdsZSkgJSAzNjA7XG4gICAgdmFyIGNoaWxkRW5kQW5nbGUgPSAoY2hpbGRTdGFydEFuZ2xlICsgc3RlcEFuZ2xlKSAlIDM2MDtcblxuICAgIENvU0VMYXlvdXQuYnJhbmNoUmFkaWFsTGF5b3V0KGN1cnJlbnROZWlnaGJvcixcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBjaGlsZFN0YXJ0QW5nbGUsIGNoaWxkRW5kQW5nbGUsXG4gICAgICAgICAgICBkaXN0YW5jZSArIHJhZGlhbFNlcGFyYXRpb24sIHJhZGlhbFNlcGFyYXRpb24pO1xuXG4gICAgYnJhbmNoQ291bnQrKztcbiAgfVxufTtcblxuQ29TRUxheW91dC5tYXhEaWFnb25hbEluVHJlZSA9IGZ1bmN0aW9uICh0cmVlKSB7XG4gIHZhciBtYXhEaWFnb25hbCA9IEludGVnZXIuTUlOX1ZBTFVFO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciBub2RlID0gdHJlZVtpXTtcbiAgICB2YXIgZGlhZ29uYWwgPSBub2RlLmdldERpYWdvbmFsKCk7XG5cbiAgICBpZiAoZGlhZ29uYWwgPiBtYXhEaWFnb25hbClcbiAgICB7XG4gICAgICBtYXhEaWFnb25hbCA9IGRpYWdvbmFsO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXhEaWFnb25hbDtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGNSZXB1bHNpb25SYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gZm9ybXVsYSBpcyAyIHggKGxldmVsICsgMSkgeCBpZGVhbEVkZ2VMZW5ndGhcbiAgcmV0dXJuICgyICogKHRoaXMubGV2ZWwgKyAxKSAqIHRoaXMuaWRlYWxFZGdlTGVuZ3RoKTtcbn07XG5cbi8vIE11bHRpLWxldmVsIFNjYWxpbmcgbWV0aG9kXG5cbi8qKlxuICogVGhpcyBtZXRob2QgdW4tY29hcnNlbnMgTWkgdG8gTWktMSBhbmQgbWFrZXMgaW5pdGlhbCBwbGFjZW1lbnQgZm9yIE1pLTFcbiAqL1xuQ29TRUxheW91dC5wcm90b3R5cGUudW5jb2Fyc2VuID0gZnVuY3Rpb24oKVxue1xuICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2RlcygpO1xuICBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciB2ID0gYWxsTm9kZXNbaV07XG4gICAgLy8gc2V0IHBvc2l0aW9ucyBvZiB2LnByZWQxIGFuZCB2LnByZWQyXG4gICAgdi5nZXRQcmVkMSgpLnNldENlbnRlcih2LmdldENlbnRlclgoKSwgdi5nZXRDZW50ZXJZKCkpO1xuXG4gICAgaWYgKHYuZ2V0UHJlZDIoKSAhPSBudWxsKVxuICAgIHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIFxuICAgICAgLypcbiAgICAgIGRvdWJsZSB3ID0gdi5nZXRQcmVkMSgpLmdldFJlY3QoKS53aWR0aDtcbiAgICAgIGRvdWJsZSBsID0gdGhpcy5pZGVhbEVkZ2VMZW5ndGg7XG4gICAgICB2LmdldFByZWQyKCkuc2V0TG9jYXRpb24oKHYuZ2V0UHJlZDEoKS5nZXRMZWZ0KCkrdytsKSwgKHYuZ2V0UHJlZDEoKS5nZXRUb3AoKSt3K2wpKTtcbiAgICAgICovXG4gICAgICB2YXIgZGlzdGFuY2UgPSAoTWF0aC5tYXgodi5nZXRQcmVkMSgpLmdldFdpZHRoKCksIHYuZ2V0UHJlZDEoKS5nZXRIZWlnaHQoKSkgKyBNYXRoLm1heCh2LmdldFByZWQyKCkuZ2V0V2lkdGgoKSwgdi5nZXRQcmVkMigpLmdldEhlaWdodCgpKSkgLyAyICsgNTtcbiAgICAgIGNvbnNvbGUubG9nKGRpc3RhbmNlKTtcbiAgICAgIHZhciB4UG9zID0gTWF0aC5yYW5kb20oKSAqIDIgKiBkaXN0YW5jZSAtIGRpc3RhbmNlO1xuICAgICAgY29uc29sZS5sb2coeFBvcyk7XG4gICAgICB2YXIgeVBvcyA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAoTWF0aC5zcXJ0KGRpc3RhbmNlICogZGlzdGFuY2UgLSB4UG9zICogeFBvcykpIDogKC0xICogTWF0aC5zcXJ0KGRpc3RhbmNlICogZGlzdGFuY2UgLSB4UG9zICogeFBvcykpO1xuICAgICAgY29uc29sZS5sb2coeVBvcyk7XG4gICAgICBcbiAgICAgIHYuZ2V0UHJlZDIoKS5zZXRDZW50ZXIodi5nZXRQcmVkMSgpLmdldENlbnRlclggKyB4UG9zLCB2LmdldFByZWQxKCkuZ2V0Q2VudGVyWSArIHlQb3MpO1xuICAgICAgXG4vLyAgICAgIHYuZ2V0UHJlZDIoKS5zZXRMb2NhdGlvbih2LmdldExlZnQoKSt0aGlzLmlkZWFsRWRnZUxlbmd0aCwgXG4vLyAgICAgICAgICAgICAgdi5nZXRUb3AoKSt0aGlzLmlkZWFsRWRnZUxlbmd0aCk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBUaWxpbmcgbWV0aG9kc1xuXG4vLyBHcm91cCB6ZXJvIGRlZ3JlZSBtZW1iZXJzIHdob3NlIHBhcmVudHMgYXJlIG5vdCB0byBiZSB0aWxlZCwgY3JlYXRlIGR1bW15IHBhcmVudHMgd2hlcmUgbmVlZGVkIGFuZCBmaWxsIG1lbWJlckdyb3VwcyBieSB0aGVpciBkdW1tcCBwYXJlbnQgaWQnc1xuQ29TRUxheW91dC5wcm90b3R5cGUuZ3JvdXBaZXJvRGVncmVlTWVtYmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICAvLyBhcnJheSBvZiBbcGFyZW50X2lkIHggb25lRGVncmVlTm9kZV9pZF1cbiAgdmFyIHRlbXBNZW1iZXJHcm91cHMgPSB7fTsgLy8gQSB0ZW1wb3JhcnkgbWFwIG9mIHBhcmVudCBub2RlIGFuZCBpdHMgemVybyBkZWdyZWUgbWVtYmVyc1xuICB0aGlzLm1lbWJlckdyb3VwcyA9IHt9OyAvLyBBIG1hcCBvZiBkdW1teSBwYXJlbnQgbm9kZSBhbmQgaXRzIHplcm8gZGVncmVlIG1lbWJlcnMgd2hvc2UgcGFyZW50cyBhcmUgbm90IHRvIGJlIHRpbGVkXG4gIHRoaXMuaWRUb0R1bW15Tm9kZSA9IHt9OyAvLyBBIG1hcCBvZiBpZCB0byBkdW1teSBub2RlIFxuICBcbiAgdmFyIHplcm9EZWdyZWUgPSBbXTsgLy8gTGlzdCBvZiB6ZXJvIGRlZ3JlZSBub2RlcyB3aG9zZSBwYXJlbnRzIGFyZSBub3QgdG8gYmUgdGlsZWRcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcblxuICAvLyBGaWxsIHplcm8gZGVncmVlIGxpc3RcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gYWxsTm9kZXNbaV07XG4gICAgdmFyIHBhcmVudCA9IG5vZGUuZ2V0UGFyZW50KCk7XG4gICAgLy8gSWYgYSBub2RlIGhhcyB6ZXJvIGRlZ3JlZSBhbmQgaXRzIHBhcmVudCBpcyBub3QgdG8gYmUgdGlsZWQgaWYgZXhpc3RzIGFkZCB0aGF0IG5vZGUgdG8gemVyb0RlZ3JlcyBsaXN0XG4gICAgaWYgKHRoaXMuZ2V0Tm9kZURlZ3JlZVdpdGhDaGlsZHJlbihub2RlKSA9PT0gMCAmJiAoIHBhcmVudC5pZCA9PSB1bmRlZmluZWQgfHwgIXRoaXMuZ2V0VG9CZVRpbGVkKHBhcmVudCkgKSApIHtcbiAgICAgIHplcm9EZWdyZWUucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGUgYSBtYXAgb2YgcGFyZW50IG5vZGUgYW5kIGl0cyB6ZXJvIGRlZ3JlZSBtZW1iZXJzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgemVyb0RlZ3JlZS5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciBub2RlID0gemVyb0RlZ3JlZVtpXTsgLy8gWmVybyBkZWdyZWUgbm9kZSBpdHNlbGZcbiAgICB2YXIgcF9pZCA9IG5vZGUuZ2V0UGFyZW50KCkuaWQ7IC8vIFBhcmVudCBpZFxuXG4gICAgaWYgKHR5cGVvZiB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgdGVtcE1lbWJlckdyb3Vwc1twX2lkXSA9IFtdO1xuXG4gICAgdGVtcE1lbWJlckdyb3Vwc1twX2lkXSA9IHRlbXBNZW1iZXJHcm91cHNbcF9pZF0uY29uY2F0KG5vZGUpOyAvLyBQdXNoIG5vZGUgdG8gdGhlIGxpc3QgYmVsb25ncyB0byBpdHMgcGFyZW50IGluIHRlbXBNZW1iZXJHcm91cHNcbiAgfVxuXG4gIC8vIElmIHRoZXJlIGFyZSBhdCBsZWFzdCB0d28gbm9kZXMgYXQgYSBsZXZlbCwgY3JlYXRlIGEgZHVtbXkgY29tcG91bmQgZm9yIHRoZW1cbiAgT2JqZWN0LmtleXModGVtcE1lbWJlckdyb3VwcykuZm9yRWFjaChmdW5jdGlvbihwX2lkKSB7XG4gICAgaWYgKHRlbXBNZW1iZXJHcm91cHNbcF9pZF0ubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIGR1bW15Q29tcG91bmRJZCA9IFwiRHVtbXlDb21wb3VuZF9cIiArIHBfaWQ7IC8vIFRoZSBpZCBvZiBkdW1teSBjb21wb3VuZCB3aGljaCB3aWxsIGJlIGNyZWF0ZWQgc29vblxuICAgICAgc2VsZi5tZW1iZXJHcm91cHNbZHVtbXlDb21wb3VuZElkXSA9IHRlbXBNZW1iZXJHcm91cHNbcF9pZF07IC8vIEFkZCBkdW1teSBjb21wb3VuZCB0byBtZW1iZXJHcm91cHNcblxuICAgICAgdmFyIHBhcmVudCA9IHRlbXBNZW1iZXJHcm91cHNbcF9pZF1bMF0uZ2V0UGFyZW50KCk7IC8vIFRoZSBwYXJlbnQgb2YgemVybyBkZWdyZWUgbm9kZXMgd2lsbCBiZSB0aGUgcGFyZW50IG9mIG5ldyBkdW1teSBjb21wb3VuZFxuXG4gICAgICAvLyBDcmVhdGUgYSBkdW1teSBjb21wb3VuZCB3aXRoIGNhbGN1bGF0ZWQgaWRcbiAgICAgIHZhciBkdW1teUNvbXBvdW5kID0gbmV3IENvU0VOb2RlKHNlbGYuZ3JhcGhNYW5hZ2VyKTtcbiAgICAgIGR1bW15Q29tcG91bmQuaWQgPSBkdW1teUNvbXBvdW5kSWQ7XG4gICAgICBkdW1teUNvbXBvdW5kLnBhZGRpbmdMZWZ0ID0gcGFyZW50LnBhZGRpbmdMZWZ0IHx8IDA7XG4gICAgICBkdW1teUNvbXBvdW5kLnBhZGRpbmdSaWdodCA9IHBhcmVudC5wYWRkaW5nUmlnaHQgfHwgMDtcbiAgICAgIGR1bW15Q29tcG91bmQucGFkZGluZ0JvdHRvbSA9IHBhcmVudC5wYWRkaW5nQm90dG9tIHx8IDA7XG4gICAgICBkdW1teUNvbXBvdW5kLnBhZGRpbmdUb3AgPSBwYXJlbnQucGFkZGluZ1RvcCB8fCAwO1xuICAgICAgXG4gICAgICBzZWxmLmlkVG9EdW1teU5vZGVbZHVtbXlDb21wb3VuZElkXSA9IGR1bW15Q29tcG91bmQ7XG4gICAgICBcbiAgICAgIHZhciBkdW1teVBhcmVudEdyYXBoID0gc2VsZi5nZXRHcmFwaE1hbmFnZXIoKS5hZGQoc2VsZi5uZXdHcmFwaCgpLCBkdW1teUNvbXBvdW5kKTtcbiAgICAgIHZhciBwYXJlbnRHcmFwaCA9IHBhcmVudC5nZXRDaGlsZCgpO1xuXG4gICAgICAvLyBBZGQgZHVtbXkgY29tcG91bmQgdG8gcGFyZW50IHRoZSBncmFwaFxuICAgICAgcGFyZW50R3JhcGguYWRkKGR1bW15Q29tcG91bmQpO1xuXG4gICAgICAvLyBGb3IgZWFjaCB6ZXJvIGRlZ3JlZSBub2RlIGluIHRoaXMgbGV2ZWwgcmVtb3ZlIGl0IGZyb20gaXRzIHBhcmVudCBncmFwaCBhbmQgYWRkIGl0IHRvIHRoZSBncmFwaCBvZiBkdW1teSBwYXJlbnRcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcE1lbWJlckdyb3Vwc1twX2lkXS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IHRlbXBNZW1iZXJHcm91cHNbcF9pZF1baV07XG4gICAgICAgIFxuICAgICAgICBwYXJlbnRHcmFwaC5yZW1vdmUobm9kZSk7XG4gICAgICAgIGR1bW15UGFyZW50R3JhcGguYWRkKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jbGVhckNvbXBvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNoaWxkR3JhcGhNYXAgPSB7fTtcbiAgdmFyIGlkVG9Ob2RlID0ge307XG5cbiAgLy8gR2V0IGNvbXBvdW5kIG9yZGVyaW5nIGJ5IGZpbmRpbmcgdGhlIGlubmVyIG9uZSBmaXJzdFxuICB0aGlzLnBlcmZvcm1ERlNPbkNvbXBvdW5kcygpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb21wb3VuZE9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgXG4gICAgaWRUb05vZGVbdGhpcy5jb21wb3VuZE9yZGVyW2ldLmlkXSA9IHRoaXMuY29tcG91bmRPcmRlcltpXTtcbiAgICBjaGlsZEdyYXBoTWFwW3RoaXMuY29tcG91bmRPcmRlcltpXS5pZF0gPSBbXS5jb25jYXQodGhpcy5jb21wb3VuZE9yZGVyW2ldLmdldENoaWxkKCkuZ2V0Tm9kZXMoKSk7XG5cbiAgICAvLyBSZW1vdmUgY2hpbGRyZW4gb2YgY29tcG91bmRzXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVtb3ZlKHRoaXMuY29tcG91bmRPcmRlcltpXS5nZXRDaGlsZCgpKTtcbiAgICB0aGlzLmNvbXBvdW5kT3JkZXJbaV0uY2hpbGQgPSBudWxsO1xuICB9XG4gIFxuICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzKCk7XG4gIFxuICAvLyBUaWxlIHRoZSByZW1vdmVkIGNoaWxkcmVuXG4gIHRoaXMudGlsZUNvbXBvdW5kTWVtYmVycyhjaGlsZEdyYXBoTWFwLCBpZFRvTm9kZSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jbGVhclplcm9EZWdyZWVNZW1iZXJzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB0aWxlZFplcm9EZWdyZWVQYWNrID0gdGhpcy50aWxlZFplcm9EZWdyZWVQYWNrID0gW107XG5cbiAgT2JqZWN0LmtleXModGhpcy5tZW1iZXJHcm91cHMpLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgY29tcG91bmROb2RlID0gc2VsZi5pZFRvRHVtbXlOb2RlW2lkXTsgLy8gR2V0IHRoZSBkdW1teSBjb21wb3VuZFxuXG4gICAgdGlsZWRaZXJvRGVncmVlUGFja1tpZF0gPSBzZWxmLnRpbGVOb2RlcyhzZWxmLm1lbWJlckdyb3Vwc1tpZF0sIGNvbXBvdW5kTm9kZS5wYWRkaW5nTGVmdCArIGNvbXBvdW5kTm9kZS5wYWRkaW5nUmlnaHQpO1xuXG4gICAgLy8gU2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBkdW1teSBjb21wb3VuZCBhcyBjYWxjdWxhdGVkXG4gICAgY29tcG91bmROb2RlLnJlY3Qud2lkdGggPSB0aWxlZFplcm9EZWdyZWVQYWNrW2lkXS53aWR0aDtcbiAgICBjb21wb3VuZE5vZGUucmVjdC5oZWlnaHQgPSB0aWxlZFplcm9EZWdyZWVQYWNrW2lkXS5oZWlnaHQ7XG4gIH0pO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUucmVwb3B1bGF0ZUNvbXBvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMuY29tcG91bmRPcmRlci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsQ29tcG91bmROb2RlID0gdGhpcy5jb21wb3VuZE9yZGVyW2ldO1xuICAgIHZhciBpZCA9IGxDb21wb3VuZE5vZGUuaWQ7XG4gICAgdmFyIGhvcml6b250YWxNYXJnaW4gPSBsQ29tcG91bmROb2RlLnBhZGRpbmdMZWZ0O1xuICAgIHZhciB2ZXJ0aWNhbE1hcmdpbiA9IGxDb21wb3VuZE5vZGUucGFkZGluZ1RvcDtcblxuICAgIHRoaXMuYWRqdXN0TG9jYXRpb25zKHRoaXMudGlsZWRNZW1iZXJQYWNrW2lkXSwgbENvbXBvdW5kTm9kZS5yZWN0LngsIGxDb21wb3VuZE5vZGUucmVjdC55LCBob3Jpem9udGFsTWFyZ2luLCB2ZXJ0aWNhbE1hcmdpbik7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnJlcG9wdWxhdGVaZXJvRGVncmVlTWVtYmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdGlsZWRQYWNrID0gdGhpcy50aWxlZFplcm9EZWdyZWVQYWNrO1xuICBcbiAgT2JqZWN0LmtleXModGlsZWRQYWNrKS5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNvbXBvdW5kTm9kZSA9IHNlbGYuaWRUb0R1bW15Tm9kZVtpZF07IC8vIEdldCB0aGUgZHVtbXkgY29tcG91bmQgYnkgaXRzIGlkXG4gICAgdmFyIGhvcml6b250YWxNYXJnaW4gPSBjb21wb3VuZE5vZGUucGFkZGluZ0xlZnQ7XG4gICAgdmFyIHZlcnRpY2FsTWFyZ2luID0gY29tcG91bmROb2RlLnBhZGRpbmdUb3A7XG5cbiAgICAvLyBBZGp1c3QgdGhlIHBvc2l0aW9ucyBvZiBub2RlcyB3cnQgaXRzIGNvbXBvdW5kXG4gICAgc2VsZi5hZGp1c3RMb2NhdGlvbnModGlsZWRQYWNrW2lkXSwgY29tcG91bmROb2RlLnJlY3QueCwgY29tcG91bmROb2RlLnJlY3QueSwgaG9yaXpvbnRhbE1hcmdpbiwgdmVydGljYWxNYXJnaW4pO1xuICB9KTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldFRvQmVUaWxlZCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBpZCA9IG5vZGUuaWQ7XG4gIC8vZmlyc3RseSBjaGVjayB0aGUgcHJldmlvdXMgcmVzdWx0c1xuICBpZiAodGhpcy50b0JlVGlsZWRbaWRdICE9IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy50b0JlVGlsZWRbaWRdO1xuICB9XG5cbiAgLy9vbmx5IGNvbXBvdW5kIG5vZGVzIGFyZSB0byBiZSB0aWxlZFxuICB2YXIgY2hpbGRHcmFwaCA9IG5vZGUuZ2V0Q2hpbGQoKTtcbiAgaWYgKGNoaWxkR3JhcGggPT0gbnVsbCkge1xuICAgIHRoaXMudG9CZVRpbGVkW2lkXSA9IGZhbHNlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjaGlsZHJlbiA9IGNoaWxkR3JhcGguZ2V0Tm9kZXMoKTsgLy8gR2V0IHRoZSBjaGlsZHJlbiBub2Rlc1xuXG4gIC8vYSBjb21wb3VuZCBub2RlIGlzIG5vdCB0byBiZSB0aWxlZCBpZiBhbGwgb2YgaXRzIGNvbXBvdW5kIGNoaWxkcmVuIGFyZSBub3QgdG8gYmUgdGlsZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0aGVDaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKHRoaXMuZ2V0Tm9kZURlZ3JlZSh0aGVDaGlsZCkgPiAwKSB7XG4gICAgICB0aGlzLnRvQmVUaWxlZFtpZF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL3Bhc3MgdGhlIGNoaWxkcmVuIG5vdCBoYXZpbmcgdGhlIGNvbXBvdW5kIHN0cnVjdHVyZVxuICAgIGlmICh0aGVDaGlsZC5nZXRDaGlsZCgpID09IG51bGwpIHtcbiAgICAgIHRoaXMudG9CZVRpbGVkW3RoZUNoaWxkLmlkXSA9IGZhbHNlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmdldFRvQmVUaWxlZCh0aGVDaGlsZCkpIHtcbiAgICAgIHRoaXMudG9CZVRpbGVkW2lkXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICB0aGlzLnRvQmVUaWxlZFtpZF0gPSB0cnVlO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIEdldCBkZWdyZWUgb2YgYSBub2RlIGRlcGVuZGluZyBvZiBpdHMgZWRnZXMgYW5kIGluZGVwZW5kZW50IG9mIGl0cyBjaGlsZHJlblxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0Tm9kZURlZ3JlZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBpZCA9IG5vZGUuaWQ7XG4gIHZhciBlZGdlcyA9IG5vZGUuZ2V0RWRnZXMoKTtcbiAgdmFyIGRlZ3JlZSA9IDA7XG4gIFxuICAvLyBGb3IgdGhlIGVkZ2VzIGNvbm5lY3RlZFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICBpZiAoZWRnZS5nZXRTb3VyY2UoKS5pZCAhPSBlZGdlLmdldFRhcmdldCgpLmlkKSB7XG4gICAgICBkZWdyZWUgPSBkZWdyZWUgKyAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVncmVlO1xufTtcblxuLy8gR2V0IGRlZ3JlZSBvZiBhIG5vZGUgd2l0aCBpdHMgY2hpbGRyZW5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldE5vZGVEZWdyZWVXaXRoQ2hpbGRyZW4gPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgZGVncmVlID0gdGhpcy5nZXROb2RlRGVncmVlKG5vZGUpO1xuICBpZiAobm9kZS5nZXRDaGlsZCgpID09IG51bGwpIHtcbiAgICByZXR1cm4gZGVncmVlO1xuICB9XG4gIHZhciBjaGlsZHJlbiA9IG5vZGUuZ2V0Q2hpbGQoKS5nZXROb2RlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgZGVncmVlICs9IHRoaXMuZ2V0Tm9kZURlZ3JlZVdpdGhDaGlsZHJlbihjaGlsZCk7XG4gIH1cbiAgcmV0dXJuIGRlZ3JlZTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnBlcmZvcm1ERlNPbkNvbXBvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jb21wb3VuZE9yZGVyID0gW107XG4gIHRoaXMuZmlsbENvbXBleE9yZGVyQnlERlModGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldE5vZGVzKCkpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuZmlsbENvbXBleE9yZGVyQnlERlMgPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgIGlmIChjaGlsZC5nZXRDaGlsZCgpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZmlsbENvbXBleE9yZGVyQnlERlMoY2hpbGQuZ2V0Q2hpbGQoKS5nZXROb2RlcygpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0VG9CZVRpbGVkKGNoaWxkKSkge1xuICAgICAgdGhpcy5jb21wb3VuZE9yZGVyLnB1c2goY2hpbGQpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4qIFRoaXMgbWV0aG9kIHBsYWNlcyBlYWNoIHplcm8gZGVncmVlIG1lbWJlciB3cnQgZ2l2ZW4gKHgseSkgY29vcmRpbmF0ZXMgKHRvcCBsZWZ0KS5cbiovXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5hZGp1c3RMb2NhdGlvbnMgPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uLCB4LCB5LCBjb21wb3VuZEhvcml6b250YWxNYXJnaW4sIGNvbXBvdW5kVmVydGljYWxNYXJnaW4pIHtcbiAgeCArPSBjb21wb3VuZEhvcml6b250YWxNYXJnaW47XG4gIHkgKz0gY29tcG91bmRWZXJ0aWNhbE1hcmdpbjtcblxuICB2YXIgbGVmdCA9IHg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmdhbml6YXRpb24ucm93cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByb3cgPSBvcmdhbml6YXRpb24ucm93c1tpXTtcbiAgICB4ID0gbGVmdDtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gMDtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgcm93Lmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbG5vZGUgPSByb3dbal07XG5cbiAgICAgIGxub2RlLnJlY3QueCA9IHg7Ly8gKyBsbm9kZS5yZWN0LndpZHRoIC8gMjtcbiAgICAgIGxub2RlLnJlY3QueSA9IHk7Ly8gKyBsbm9kZS5yZWN0LmhlaWdodCAvIDI7XG5cbiAgICAgIHggKz0gbG5vZGUucmVjdC53aWR0aCArIG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZztcblxuICAgICAgaWYgKGxub2RlLnJlY3QuaGVpZ2h0ID4gbWF4SGVpZ2h0KVxuICAgICAgICBtYXhIZWlnaHQgPSBsbm9kZS5yZWN0LmhlaWdodDtcbiAgICB9XG5cbiAgICB5ICs9IG1heEhlaWdodCArIG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmc7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnRpbGVDb21wb3VuZE1lbWJlcnMgPSBmdW5jdGlvbiAoY2hpbGRHcmFwaE1hcCwgaWRUb05vZGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLnRpbGVkTWVtYmVyUGFjayA9IFtdO1xuXG4gIE9iamVjdC5rZXlzKGNoaWxkR3JhcGhNYXApLmZvckVhY2goZnVuY3Rpb24oaWQpIHtcbiAgICAvLyBHZXQgdGhlIGNvbXBvdW5kIG5vZGVcbiAgICB2YXIgY29tcG91bmROb2RlID0gaWRUb05vZGVbaWRdO1xuXG4gICAgc2VsZi50aWxlZE1lbWJlclBhY2tbaWRdID0gc2VsZi50aWxlTm9kZXMoY2hpbGRHcmFwaE1hcFtpZF0sIGNvbXBvdW5kTm9kZS5wYWRkaW5nTGVmdCArIGNvbXBvdW5kTm9kZS5wYWRkaW5nUmlnaHQpO1xuXG4gICAgY29tcG91bmROb2RlLnJlY3Qud2lkdGggPSBzZWxmLnRpbGVkTWVtYmVyUGFja1tpZF0ud2lkdGggKyAyMDtcbiAgICBjb21wb3VuZE5vZGUucmVjdC5oZWlnaHQgPSBzZWxmLnRpbGVkTWVtYmVyUGFja1tpZF0uaGVpZ2h0ICsgMjA7XG4gIH0pO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGlsZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCBtaW5XaWR0aCkge1xuICB2YXIgdmVydGljYWxQYWRkaW5nID0gQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19WRVJUSUNBTDtcbiAgdmFyIGhvcml6b250YWxQYWRkaW5nID0gQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19IT1JJWk9OVEFMO1xuICB2YXIgb3JnYW5pemF0aW9uID0ge1xuICAgIHJvd3M6IFtdLFxuICAgIHJvd1dpZHRoOiBbXSxcbiAgICByb3dIZWlnaHQ6IFtdLFxuICAgIHdpZHRoOiAyMCxcbiAgICBoZWlnaHQ6IDIwLFxuICAgIHZlcnRpY2FsUGFkZGluZzogdmVydGljYWxQYWRkaW5nLFxuICAgIGhvcml6b250YWxQYWRkaW5nOiBob3Jpem9udGFsUGFkZGluZ1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG5vZGVzIGluIGFzY2VuZGluZyBvcmRlciBvZiB0aGVpciBhcmVhc1xuICBub2Rlcy5zb3J0KGZ1bmN0aW9uIChuMSwgbjIpIHtcbiAgICBpZiAobjEucmVjdC53aWR0aCAqIG4xLnJlY3QuaGVpZ2h0ID4gbjIucmVjdC53aWR0aCAqIG4yLnJlY3QuaGVpZ2h0KVxuICAgICAgcmV0dXJuIC0xO1xuICAgIGlmIChuMS5yZWN0LndpZHRoICogbjEucmVjdC5oZWlnaHQgPCBuMi5yZWN0LndpZHRoICogbjIucmVjdC5oZWlnaHQpXG4gICAgICByZXR1cm4gMTtcbiAgICByZXR1cm4gMDtcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBvcmdhbml6YXRpb24gLT4gdGlsZSBtZW1iZXJzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcbiAgICBcbiAgICBpZiAob3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuaW5zZXJ0Tm9kZVRvUm93KG9yZ2FuaXphdGlvbiwgbE5vZGUsIDAsIG1pbldpZHRoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jYW5BZGRIb3Jpem9udGFsKG9yZ2FuaXphdGlvbiwgbE5vZGUucmVjdC53aWR0aCwgbE5vZGUucmVjdC5oZWlnaHQpKSB7XG4gICAgICB0aGlzLmluc2VydE5vZGVUb1Jvdyhvcmdhbml6YXRpb24sIGxOb2RlLCB0aGlzLmdldFNob3J0ZXN0Um93SW5kZXgob3JnYW5pemF0aW9uKSwgbWluV2lkdGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuaW5zZXJ0Tm9kZVRvUm93KG9yZ2FuaXphdGlvbiwgbE5vZGUsIG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aCwgbWluV2lkdGgpO1xuICAgIH1cblxuICAgIHRoaXMuc2hpZnRUb0xhc3RSb3cob3JnYW5pemF0aW9uKTtcbiAgfVxuXG4gIHJldHVybiBvcmdhbml6YXRpb247XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5pbnNlcnROb2RlVG9Sb3cgPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uLCBub2RlLCByb3dJbmRleCwgbWluV2lkdGgpIHtcbiAgdmFyIG1pbkNvbXBvdW5kU2l6ZSA9IG1pbldpZHRoO1xuXG4gIC8vIEFkZCBuZXcgcm93IGlmIG5lZWRlZFxuICBpZiAocm93SW5kZXggPT0gb3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoKSB7XG4gICAgdmFyIHNlY29uZERpbWVuc2lvbiA9IFtdO1xuXG4gICAgb3JnYW5pemF0aW9uLnJvd3MucHVzaChzZWNvbmREaW1lbnNpb24pO1xuICAgIG9yZ2FuaXphdGlvbi5yb3dXaWR0aC5wdXNoKG1pbkNvbXBvdW5kU2l6ZSk7XG4gICAgb3JnYW5pemF0aW9uLnJvd0hlaWdodC5wdXNoKDApO1xuICB9XG5cbiAgLy8gVXBkYXRlIHJvdyB3aWR0aFxuICB2YXIgdyA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtyb3dJbmRleF0gKyBub2RlLnJlY3Qud2lkdGg7XG5cbiAgaWYgKG9yZ2FuaXphdGlvbi5yb3dzW3Jvd0luZGV4XS5sZW5ndGggPiAwKSB7XG4gICAgdyArPSBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmc7XG4gIH1cblxuICBvcmdhbml6YXRpb24ucm93V2lkdGhbcm93SW5kZXhdID0gdztcbiAgLy8gVXBkYXRlIGNvbXBvdW5kIHdpZHRoXG4gIGlmIChvcmdhbml6YXRpb24ud2lkdGggPCB3KSB7XG4gICAgb3JnYW5pemF0aW9uLndpZHRoID0gdztcbiAgfVxuXG4gIC8vIFVwZGF0ZSBoZWlnaHRcbiAgdmFyIGggPSBub2RlLnJlY3QuaGVpZ2h0O1xuICBpZiAocm93SW5kZXggPiAwKVxuICAgIGggKz0gb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZztcblxuICB2YXIgZXh0cmFIZWlnaHQgPSAwO1xuICBpZiAoaCA+IG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbcm93SW5kZXhdKSB7XG4gICAgZXh0cmFIZWlnaHQgPSBvcmdhbml6YXRpb24ucm93SGVpZ2h0W3Jvd0luZGV4XTtcbiAgICBvcmdhbml6YXRpb24ucm93SGVpZ2h0W3Jvd0luZGV4XSA9IGg7XG4gICAgZXh0cmFIZWlnaHQgPSBvcmdhbml6YXRpb24ucm93SGVpZ2h0W3Jvd0luZGV4XSAtIGV4dHJhSGVpZ2h0O1xuICB9XG5cbiAgb3JnYW5pemF0aW9uLmhlaWdodCArPSBleHRyYUhlaWdodDtcblxuICAvLyBJbnNlcnQgbm9kZVxuICBvcmdhbml6YXRpb24ucm93c1tyb3dJbmRleF0ucHVzaChub2RlKTtcbn07XG5cbi8vU2NhbnMgdGhlIHJvd3Mgb2YgYW4gb3JnYW5pemF0aW9uIGFuZCByZXR1cm5zIHRoZSBvbmUgd2l0aCB0aGUgbWluIHdpZHRoXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRTaG9ydGVzdFJvd0luZGV4ID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbikge1xuICB2YXIgciA9IC0xO1xuICB2YXIgbWluID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtpXSA8IG1pbikge1xuICAgICAgciA9IGk7XG4gICAgICBtaW4gPSBvcmdhbml6YXRpb24ucm93V2lkdGhbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcblxuLy9TY2FucyB0aGUgcm93cyBvZiBhbiBvcmdhbml6YXRpb24gYW5kIHJldHVybnMgdGhlIG9uZSB3aXRoIHRoZSBtYXggd2lkdGhcbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldExvbmdlc3RSb3dJbmRleCA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24pIHtcbiAgdmFyIHIgPSAtMTtcbiAgdmFyIG1heCA9IE51bWJlci5NSU5fVkFMVUU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmdhbml6YXRpb24ucm93cy5sZW5ndGg7IGkrKykge1xuXG4gICAgaWYgKG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtpXSA+IG1heCkge1xuICAgICAgciA9IGk7XG4gICAgICBtYXggPSBvcmdhbml6YXRpb24ucm93V2lkdGhbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHI7XG59O1xuXG4vKipcbiogVGhpcyBtZXRob2QgY2hlY2tzIHdoZXRoZXIgYWRkaW5nIGV4dHJhIHdpZHRoIHRvIHRoZSBvcmdhbml6YXRpb24gdmlvbGF0ZXNcbiogdGhlIGFzcGVjdCByYXRpbygxKSBvciBub3QuXG4qL1xuQ29TRUxheW91dC5wcm90b3R5cGUuY2FuQWRkSG9yaXpvbnRhbCA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24sIGV4dHJhV2lkdGgsIGV4dHJhSGVpZ2h0KSB7XG5cbiAgdmFyIHNyaSA9IHRoaXMuZ2V0U2hvcnRlc3RSb3dJbmRleChvcmdhbml6YXRpb24pO1xuXG4gIGlmIChzcmkgPCAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbWluID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW3NyaV07XG5cbiAgaWYgKG1pbiArIG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZyArIGV4dHJhV2lkdGggPD0gb3JnYW5pemF0aW9uLndpZHRoKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIHZhciBoRGlmZiA9IDA7XG5cbiAgLy8gQWRkaW5nIHRvIGFuIGV4aXN0aW5nIHJvd1xuICBpZiAob3JnYW5pemF0aW9uLnJvd0hlaWdodFtzcmldIDwgZXh0cmFIZWlnaHQpIHtcbiAgICBpZiAoc3JpID4gMClcbiAgICAgIGhEaWZmID0gZXh0cmFIZWlnaHQgKyBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nIC0gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtzcmldO1xuICB9XG5cbiAgdmFyIGFkZF90b19yb3dfcmF0aW87XG4gIGlmIChvcmdhbml6YXRpb24ud2lkdGggLSBtaW4gPj0gZXh0cmFXaWR0aCArIG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZykge1xuICAgIGFkZF90b19yb3dfcmF0aW8gPSAob3JnYW5pemF0aW9uLmhlaWdodCArIGhEaWZmKSAvIChtaW4gKyBleHRyYVdpZHRoICsgb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBhZGRfdG9fcm93X3JhdGlvID0gKG9yZ2FuaXphdGlvbi5oZWlnaHQgKyBoRGlmZikgLyBvcmdhbml6YXRpb24ud2lkdGg7XG4gIH1cblxuICAvLyBBZGRpbmcgYSBuZXcgcm93IGZvciB0aGlzIG5vZGVcbiAgaERpZmYgPSBleHRyYUhlaWdodCArIG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmc7XG4gIHZhciBhZGRfbmV3X3Jvd19yYXRpbztcbiAgaWYgKG9yZ2FuaXphdGlvbi53aWR0aCA8IGV4dHJhV2lkdGgpIHtcbiAgICBhZGRfbmV3X3Jvd19yYXRpbyA9IChvcmdhbml6YXRpb24uaGVpZ2h0ICsgaERpZmYpIC8gZXh0cmFXaWR0aDtcbiAgfSBlbHNlIHtcbiAgICBhZGRfbmV3X3Jvd19yYXRpbyA9IChvcmdhbml6YXRpb24uaGVpZ2h0ICsgaERpZmYpIC8gb3JnYW5pemF0aW9uLndpZHRoO1xuICB9XG5cbiAgaWYgKGFkZF9uZXdfcm93X3JhdGlvIDwgMSlcbiAgICBhZGRfbmV3X3Jvd19yYXRpbyA9IDEgLyBhZGRfbmV3X3Jvd19yYXRpbztcblxuICBpZiAoYWRkX3RvX3Jvd19yYXRpbyA8IDEpXG4gICAgYWRkX3RvX3Jvd19yYXRpbyA9IDEgLyBhZGRfdG9fcm93X3JhdGlvO1xuXG4gIHJldHVybiBhZGRfdG9fcm93X3JhdGlvIDwgYWRkX25ld19yb3dfcmF0aW87XG59O1xuXG4vL0lmIG1vdmluZyB0aGUgbGFzdCBub2RlIGZyb20gdGhlIGxvbmdlc3Qgcm93IGFuZCBhZGRpbmcgaXQgdG8gdGhlIGxhc3Rcbi8vcm93IG1ha2VzIHRoZSBib3VuZGluZyBib3ggc21hbGxlciwgZG8gaXQuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5zaGlmdFRvTGFzdFJvdyA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24pIHtcbiAgdmFyIGxvbmdlc3QgPSB0aGlzLmdldExvbmdlc3RSb3dJbmRleChvcmdhbml6YXRpb24pO1xuICB2YXIgbGFzdCA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aC5sZW5ndGggLSAxO1xuICB2YXIgcm93ID0gb3JnYW5pemF0aW9uLnJvd3NbbG9uZ2VzdF07XG4gIHZhciBub2RlID0gcm93W3Jvdy5sZW5ndGggLSAxXTtcblxuICB2YXIgZGlmZiA9IG5vZGUud2lkdGggKyBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmc7XG5cbiAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIG9uIHRoZSBsYXN0IHJvd1xuICBpZiAob3JnYW5pemF0aW9uLndpZHRoIC0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2xhc3RdID4gZGlmZiAmJiBsb25nZXN0ICE9IGxhc3QpIHtcbiAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgbG9uZ2VzdCByb3dcbiAgICByb3cuc3BsaWNlKC0xLCAxKTtcblxuICAgIC8vIFB1c2ggaXQgdG8gdGhlIGxhc3Qgcm93XG4gICAgb3JnYW5pemF0aW9uLnJvd3NbbGFzdF0ucHVzaChub2RlKTtcblxuICAgIG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtsb25nZXN0XSA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtsb25nZXN0XSAtIGRpZmY7XG4gICAgb3JnYW5pemF0aW9uLnJvd1dpZHRoW2xhc3RdID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2xhc3RdICsgZGlmZjtcbiAgICBvcmdhbml6YXRpb24ud2lkdGggPSBvcmdhbml6YXRpb24ucm93V2lkdGhbaW5zdGFuY2UuZ2V0TG9uZ2VzdFJvd0luZGV4KG9yZ2FuaXphdGlvbildO1xuXG4gICAgLy8gVXBkYXRlIGhlaWdodHMgb2YgdGhlIG9yZ2FuaXphdGlvblxuICAgIHZhciBtYXhIZWlnaHQgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocm93W2ldLmhlaWdodCA+IG1heEhlaWdodClcbiAgICAgICAgbWF4SGVpZ2h0ID0gcm93W2ldLmhlaWdodDtcbiAgICB9XG4gICAgaWYgKGxvbmdlc3QgPiAwKVxuICAgICAgbWF4SGVpZ2h0ICs9IG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmc7XG5cbiAgICB2YXIgcHJldlRvdGFsID0gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsb25nZXN0XSArIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbGFzdF07XG5cbiAgICBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xvbmdlc3RdID0gbWF4SGVpZ2h0O1xuICAgIGlmIChvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xhc3RdIDwgbm9kZS5oZWlnaHQgKyBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nKVxuICAgICAgb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsYXN0XSA9IG5vZGUuaGVpZ2h0ICsgb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZztcblxuICAgIHZhciBmaW5hbFRvdGFsID0gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsb25nZXN0XSArIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbGFzdF07XG4gICAgb3JnYW5pemF0aW9uLmhlaWdodCArPSAoZmluYWxUb3RhbCAtIHByZXZUb3RhbCk7XG5cbiAgICB0aGlzLnNoaWZ0VG9MYXN0Um93KG9yZ2FuaXphdGlvbik7XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnRpbGluZ1ByZUxheW91dCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoQ29TRUNvbnN0YW50cy5USUxFKSB7XG4gICAgLy8gRmluZCB6ZXJvIGRlZ3JlZSBub2RlcyBhbmQgY3JlYXRlIGEgY29tcG91bmQgZm9yIGVhY2ggbGV2ZWxcbiAgICB0aGlzLmdyb3VwWmVyb0RlZ3JlZU1lbWJlcnMoKTtcbiAgICAvLyBUaWxlIGFuZCBjbGVhciBjaGlsZHJlbiBvZiBlYWNoIGNvbXBvdW5kXG4gICAgdGhpcy5jbGVhckNvbXBvdW5kcygpO1xuICAgIC8vIFNlcGFyYXRlbHkgdGlsZSBhbmQgY2xlYXIgemVybyBkZWdyZWUgbm9kZXMgZm9yIGVhY2ggbGV2ZWxcbiAgICB0aGlzLmNsZWFyWmVyb0RlZ3JlZU1lbWJlcnMoKTtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGlsaW5nUG9zdExheW91dCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoQ29TRUNvbnN0YW50cy5USUxFKSB7XG4gICAgdGhpcy5yZXBvcHVsYXRlWmVyb0RlZ3JlZU1lbWJlcnMoKTtcbiAgICB0aGlzLnJlcG9wdWxhdGVDb21wb3VuZHMoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb1NFTGF5b3V0O1xuIiwidmFyIEZETGF5b3V0Tm9kZSA9IHJlcXVpcmUoJy4vRkRMYXlvdXROb2RlJyk7XG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XG5cbmZ1bmN0aW9uIENvU0VOb2RlKGdtLCBsb2MsIHNpemUsIHZOb2RlKSB7XG4gIEZETGF5b3V0Tm9kZS5jYWxsKHRoaXMsIGdtLCBsb2MsIHNpemUsIHZOb2RlKTtcbn1cblxuXG5Db1NFTm9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEZETGF5b3V0Tm9kZS5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBGRExheW91dE5vZGUpIHtcbiAgQ29TRU5vZGVbcHJvcF0gPSBGRExheW91dE5vZGVbcHJvcF07XG59XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGxheW91dCA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldExheW91dCgpO1xuICB0aGlzLmRpc3BsYWNlbWVudFggPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqXG4gICAgICAgICAgKHRoaXMuc3ByaW5nRm9yY2VYICsgdGhpcy5yZXB1bHNpb25Gb3JjZVggKyB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYKSAvIHRoaXMubm9PZkNoaWxkcmVuO1xuICB0aGlzLmRpc3BsYWNlbWVudFkgPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqXG4gICAgICAgICAgKHRoaXMuc3ByaW5nRm9yY2VZICsgdGhpcy5yZXB1bHNpb25Gb3JjZVkgKyB0aGlzLmdyYXZpdGF0aW9uRm9yY2VZKSAvIHRoaXMubm9PZkNoaWxkcmVuO1xuXG5cbiAgaWYgKE1hdGguYWJzKHRoaXMuZGlzcGxhY2VtZW50WCkgPiBsYXlvdXQuY29vbGluZ0ZhY3RvciAqIGxheW91dC5tYXhOb2RlRGlzcGxhY2VtZW50KVxuICB7XG4gICAgdGhpcy5kaXNwbGFjZW1lbnRYID0gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudCAqXG4gICAgICAgICAgICBJTWF0aC5zaWduKHRoaXMuZGlzcGxhY2VtZW50WCk7XG4gIH1cblxuICBpZiAoTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRZKSA+IGxheW91dC5jb29saW5nRmFjdG9yICogbGF5b3V0Lm1heE5vZGVEaXNwbGFjZW1lbnQpXG4gIHtcbiAgICB0aGlzLmRpc3BsYWNlbWVudFkgPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqIGxheW91dC5tYXhOb2RlRGlzcGxhY2VtZW50ICpcbiAgICAgICAgICAgIElNYXRoLnNpZ24odGhpcy5kaXNwbGFjZW1lbnRZKTtcbiAgfVxuXG4gIC8vIGEgc2ltcGxlIG5vZGUsIGp1c3QgbW92ZSBpdFxuICBpZiAodGhpcy5jaGlsZCA9PSBudWxsKVxuICB7XG4gICAgdGhpcy5tb3ZlQnkodGhpcy5kaXNwbGFjZW1lbnRYLCB0aGlzLmRpc3BsYWNlbWVudFkpO1xuICB9XG4gIC8vIGFuIGVtcHR5IGNvbXBvdW5kIG5vZGUsIGFnYWluIGp1c3QgbW92ZSBpdFxuICBlbHNlIGlmICh0aGlzLmNoaWxkLmdldE5vZGVzKCkubGVuZ3RoID09IDApXG4gIHtcbiAgICB0aGlzLm1vdmVCeSh0aGlzLmRpc3BsYWNlbWVudFgsIHRoaXMuZGlzcGxhY2VtZW50WSk7XG4gIH1cbiAgLy8gbm9uLWVtcHR5IGNvbXBvdW5kIG5vZGUsIHByb3BvZ2F0ZSBtb3ZlbWVudCB0byBjaGlsZHJlbiBhcyB3ZWxsXG4gIGVsc2VcbiAge1xuICAgIHRoaXMucHJvcG9nYXRlRGlzcGxhY2VtZW50VG9DaGlsZHJlbih0aGlzLmRpc3BsYWNlbWVudFgsXG4gICAgICAgICAgICB0aGlzLmRpc3BsYWNlbWVudFkpO1xuICB9XG5cbiAgbGF5b3V0LnRvdGFsRGlzcGxhY2VtZW50ICs9XG4gICAgICAgICAgTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRYKSArIE1hdGguYWJzKHRoaXMuZGlzcGxhY2VtZW50WSk7XG4gICAgICBcbiAgdmFyIG5vZGVEYXRhID0ge1xuICAgIHNwcmluZ0ZvcmNlWDogdGhpcy5zcHJpbmdGb3JjZVgsXG4gICAgc3ByaW5nRm9yY2VZOiB0aGlzLnNwcmluZ0ZvcmNlWSxcbiAgICByZXB1bHNpb25Gb3JjZVg6IHRoaXMucmVwdWxzaW9uRm9yY2VYLFxuICAgIHJlcHVsc2lvbkZvcmNlWTogdGhpcy5yZXB1bHNpb25Gb3JjZVksXG4gICAgZ3Jhdml0YXRpb25Gb3JjZVg6IHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVgsXG4gICAgZ3Jhdml0YXRpb25Gb3JjZVk6IHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVksXG4gICAgZGlzcGxhY2VtZW50WDogdGhpcy5kaXNwbGFjZW1lbnRYLFxuICAgIGRpc3BsYWNlbWVudFk6IHRoaXMuZGlzcGxhY2VtZW50WVxuICB9O1xuICBcbiAgdGhpcy5zcHJpbmdGb3JjZVggPSAwO1xuICB0aGlzLnNwcmluZ0ZvcmNlWSA9IDA7XG4gIHRoaXMucmVwdWxzaW9uRm9yY2VYID0gMDtcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVkgPSAwO1xuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYID0gMDtcbiAgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWSA9IDA7XG4gIHRoaXMuZGlzcGxhY2VtZW50WCA9IDA7XG4gIHRoaXMuZGlzcGxhY2VtZW50WSA9IDA7XG4gIFxuICByZXR1cm4gbm9kZURhdGE7XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUucHJvcG9nYXRlRGlzcGxhY2VtZW50VG9DaGlsZHJlbiA9IGZ1bmN0aW9uIChkWCwgZFkpXG57XG4gIHZhciBub2RlcyA9IHRoaXMuZ2V0Q2hpbGQoKS5nZXROb2RlcygpO1xuICB2YXIgbm9kZTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBpZiAobm9kZS5nZXRDaGlsZCgpID09IG51bGwpXG4gICAge1xuICAgICAgbm9kZS5tb3ZlQnkoZFgsIGRZKTtcbiAgICAgIG5vZGUuZGlzcGxhY2VtZW50WCArPSBkWDtcbiAgICAgIG5vZGUuZGlzcGxhY2VtZW50WSArPSBkWTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIG5vZGUucHJvcG9nYXRlRGlzcGxhY2VtZW50VG9DaGlsZHJlbihkWCwgZFkpO1xuICAgIH1cbiAgfVxufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLnNldFByZWQxID0gZnVuY3Rpb24gKHByZWQxKVxue1xuICB0aGlzLnByZWQxID0gcHJlZDE7XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUuZ2V0UHJlZDEgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5wcmVkMTtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5zZXRQcmVkMiA9IGZ1bmN0aW9uIChwcmVkMilcbntcbiAgdGhpcy5wcmVkMiA9IHByZWQyO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLmdldFByZWQyID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucHJlZDI7XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUuc2V0TmV4dCA9IGZ1bmN0aW9uIChuZXh0KVxue1xuICB0aGlzLm5leHQgPSBuZXh0O1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLmdldE5leHQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5uZXh0O1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLnNldFByb2Nlc3NlZCA9IGZ1bmN0aW9uIChwcm9jZXNzZWQpXG57XG4gIHRoaXMucHJvY2Vzc2VkID0gcHJvY2Vzc2VkO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLmlzUHJvY2Vzc2VkID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucHJvY2Vzc2VkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb1NFTm9kZTtcbiIsInZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcblxuZnVuY3Rpb24gQ29hcnNlbmluZ0VkZ2Uoc291cmNlLCB0YXJnZXQsIHZFZGdlKSB7XG4gIENvU0VFZGdlLmNhbGwodGhpcywgc291cmNlLCB0YXJnZXQsIHZFZGdlKTtcbn1cblxuQ29hcnNlbmluZ0VkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDb1NFRWRnZS5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBDb1NFRWRnZSkge1xuICBDb2Fyc2VuaW5nRWRnZVtwcm9wXSA9IENvU0VFZGdlW3Byb3BdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvYXJzZW5pbmdFZGdlOyIsInZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xudmFyIENvYXJzZW5pbmdOb2RlID0gcmVxdWlyZSgnLi9Db2Fyc2VuaW5nTm9kZScpO1xudmFyIENvYXJzZW5pbmdFZGdlID0gcmVxdWlyZSgnLi9Db2Fyc2VuaW5nRWRnZScpO1xuXG5mdW5jdGlvbiBDb2Fyc2VuaW5nR3JhcGgocGFyZW50LCBsYXlvdXQsIHZHcmFwaCkge1xuICBcbiAgaWYobGF5b3V0ID09IG51bGwgJiYgdkdyYXBoID09IG51bGwpXG4gIHtcbiAgICBsYXlvdXQgPSBwYXJlbnQ7XG4gICAgTEdyYXBoLmNhbGwodGhpcywgbnVsbCwgbGF5b3V0LCBudWxsKTtcbiAgICB0aGlzLmxheW91dCA9IGxheW91dDtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBMR3JhcGguY2FsbCh0aGlzLCBwYXJlbnQsIGxheW91dCwgdkdyYXBoKTtcbiAgfVxufVxuXG5Db2Fyc2VuaW5nR3JhcGgucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGgucHJvdG90eXBlKTtcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoKSB7XG4gIENvYXJzZW5pbmdHcmFwaFtwcm9wXSA9IExHcmFwaFtwcm9wXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBjb2Fyc2VucyBHaSB0byBHaSsxXG4gKi9cbkNvYXJzZW5pbmdHcmFwaC5wcm90b3R5cGUuY29hcnNlbiA9IGZ1bmN0aW9uKClcbntcbiAgdGhpcy51bm1hdGNoQWxsKCk7XG4gIHZhciB2LCB1O1xuICBcbiAgaWYodGhpcy5nZXROb2RlcygpLmxlbmd0aCA+IDApXG4gIHsgIFxuICAgIC8vIG1hdGNoIGVhY2ggbm9kZSB3aXRoIHRoZSBvbmUgb2YgdGhlIHVubWF0Y2hlZCBuZWlnaGJvcnMgaGFzIG1pbmltdW0gd2VpZ2h0XG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gdW5tYXRjaGVkIG5laWdoYm9yLCB0aGVuIG1hdGNoIGN1cnJlbnQgbm9kZSB3aXRoIGl0c2VsZiAgICBcbiAgICB3aGlsZSghKCh0aGlzLmdldE5vZGVzKClbMF0uaXNNYXRjaGVkKCkpKSlcbiAgICB7XG4gICAgICAvLyBnZXQgYW4gdW5tYXRjaGVkIG5vZGUgKHYpIGFuZCAoaWYgZXhpc3RzKSBtYXRjaGluZyBvZiBpdCAodSkuXG4gICAgICB2ID0gdGhpcy5nZXROb2RlcygpWzBdOyAgLy9PcHRpbWl6ZVxuICAgICAgdSA9IHYuZ2V0TWF0Y2hpbmcoKTtcbiAgICAgIFxuICAgICAgLy8gbm9kZSB0IGlzIGNvbnN0cnVjdGVkIGJ5IGNvbnRyYWN0aW5nIHUgYW5kIHZcbiAgICAgIHRoaXMuY29udHJhY3QoIHYsIHUgKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIG5vZGVzID0gdGhpcy5nZXROb2RlcygpO1xuICAgIFxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICB2YXIgeSA9IG5vZGVzW2ldO1xuICAgICAgXG4gICAgICAvLyBuZXcgQ29TRSBub2RlIHdpbGwgYmUgaW4gTWkrMVxuICAgICAgdmFyIHogPSB0aGlzLmxheW91dC5uZXdOb2RlKG51bGwpO1xuICAgICAgXG4gICAgICB6LnNldFByZWQxKHkuZ2V0Tm9kZTEoKS5nZXRSZWZlcmVuY2UoKSk7XG4gICAgICB5LmdldE5vZGUxKCkuZ2V0UmVmZXJlbmNlKCkuc2V0TmV4dCh6KTtcbiAgICAgIFxuICAgICAgLy8gaWYgY3VycmVudCBub2RlIGlzIG5vdCBtYXRjaGVkIHdpdGggaXRzZWxmXG4gICAgICBpZih5LmdldE5vZGUyKCkgIT0gbnVsbClcbiAgICAgIHtcbiAgICAgICAgei5zZXRQcmVkMih5LmdldE5vZGUyKCkuZ2V0UmVmZXJlbmNlKCkpO1xuICAgICAgICB5LmdldE5vZGUyKCkuZ2V0UmVmZXJlbmNlKCkuc2V0TmV4dCh6KTsgICAgICAgIFxuICAgICAgfVxuICAgICAgXG4gICAgICB5LnNldFJlZmVyZW5jZSh6KTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgdW5mbGFncyBhbGwgbm9kZXMgYXMgdW5tYXRjaGVkXG4gKiBpdCBzaG91bGQgYmUgY2FsbGVkIGJlZm9yZSBlYWNoIGNvYXJzZW5pbmcgcHJvY2Vzc1xuICovXG5Db2Fyc2VuaW5nR3JhcGgucHJvdG90eXBlLnVubWF0Y2hBbGwgPSBmdW5jdGlvbigpXG57XG4gIHZhciBub2RlO1xuICB2YXIgbm9kZXMgPSB0aGlzLmdldE5vZGVzKCk7XG4gIFxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICBub2RlLnNldE1hdGNoZWQoZmFsc2UpO1xuICB9XG59O1xuXG4vKipcbiogVGhpcyBtZXRob2QgY29udHJhY3RzIHYgYW5kIHVcbiovXG5Db2Fyc2VuaW5nR3JhcGgucHJvdG90eXBlLmNvbnRyYWN0ID0gZnVuY3Rpb24odiwgdSlcbntcbiAgLy8gdCB3aWxsIGJlIGNvbnN0cnVjdGVkIGJ5IGNvbnRyYWN0aW5nIHYgYW5kIHVcdFxuICB2YXIgdCA9IG5ldyBDb2Fyc2VuaW5nTm9kZSgpO1xuICB0aGlzLmFkZCh0KTsgLy9DaGVjayB0aGlzXG4gIFxuICB0LnNldE5vZGUxKCB2ICk7XG4gIFxuICB2YXIgbmVpZ2hib3JzTGlzdCA9IHYuZ2V0TmVpZ2hib3JzTGlzdCgpO1xuLy8gIE9iamVjdC5rZXlzKG5laWdoYm9yc0xpc3Quc2V0KS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGVJZCl7XG4vLyAgICB2YXIgeCA9IG5laWdoYm9yc0xpc3Quc2V0W25vZGVJZF07XG4vLyAgICBpZih4ICE9IHQpXG4vLyAgICB7XG4vLyAgICAgIHRoaXMuYWRkKCBuZXcgQ29hcnNlbmluZ0VkZ2UoKSwgdCwgeCApO1xuLy8gICAgfVxuLy8gIH0pO1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG5laWdoYm9yc0xpc3Quc2V0KTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHggPSBuZWlnaGJvcnNMaXN0LnNldFtrZXlzW2ldXTtcbiAgICBpZih4ICE9IHQpXG4gICAge1xuICAgICAgdGhpcy5hZGQoIG5ldyBDb2Fyc2VuaW5nRWRnZSgpLCB0LCB4ICk7XG4gICAgfVxuICB9XG4gIFxuICB0LnNldFdlaWdodCh2LmdldFdlaWdodCgpKTtcbiAgXG4gIC8vcmVtb3ZlIGNvbnRyYWN0ZWQgbm9kZSBmcm9tIHRoZSBncmFwaFxuICB0aGlzLnJlbW92ZSh2KTtcblxuICAvLyBpZiB2IGhhcyBhbiB1bm1hdGNoZWQgbmVpZ2hib3IsIHRoZW4gdSBpcyBub3QgbnVsbCBhbmQgdC5ub2RlMiA9IHVcbiAgLy8gb3RoZXJ3aXNlLCBsZWF2ZSB0Lm5vZGUyIGFzIG51bGxcbiAgaWYodSAhPSBudWxsKVxuICB7XG4gICAgdC5zZXROb2RlMih1KTtcbi8vICAgIHZhciBuZWlnaGJvcnNMaXN0MiA9IHUuZ2V0TmVpZ2hib3JzTGlzdCgpO1xuLy8gICAgT2JqZWN0LmtleXMobmVpZ2hib3JzTGlzdDIuc2V0KS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGVJZCl7XG4vLyAgICAgIHZhciB4ID0gbmVpZ2hib3JzTGlzdDIuc2V0W25vZGVJZF07XG4vLyAgICAgIGlmKHggIT0gdClcbi8vICAgICAge1xuLy8gICAgICAgIHRoaXMuYWRkKG5ldyBDb2Fyc2VuaW5nRWRnZSgpLCB0LCB4KTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4gICAgdmFyIG5laWdoYm9yc0xpc3QgPSB1LmdldE5laWdoYm9yc0xpc3QoKTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG5laWdoYm9yc0xpc3Quc2V0KTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHggPSBuZWlnaGJvcnNMaXN0LnNldFtrZXlzW2ldXTtcbiAgICAgIGlmKHggIT0gdClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5hZGQoIG5ldyBDb2Fyc2VuaW5nRWRnZSgpLCB0LCB4ICk7XG4gICAgICB9XG4gICAgfVxuICAgIHQuc2V0V2VpZ2h0KHQuZ2V0V2VpZ2h0KCkgKyB1LmdldFdlaWdodCgpKTtcbiAgICBcbiAgICAvL3JlbW92ZSBjb250cmFjdGVkIG5vZGUgZnJvbSB0aGUgZ3JhcGhcbiAgICB0aGlzLnJlbW92ZSh1KTtcbiAgfVxuICBcbiAgLy8gdCBzaG91bGQgYmUgZmxhZ2dlZCBhcyBtYXRjaGVkXG4gIHQuc2V0TWF0Y2hlZCggdHJ1ZSApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2Fyc2VuaW5nR3JhcGg7XG5cbiIsInZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG5cbmZ1bmN0aW9uIENvYXJzZW5pbmdOb2RlKGdtLCB2Tm9kZSkge1xuICBpZihnbSA9PSBudWxsICYmIHZOb2RlID09IG51bGwpe1xuICAgIExOb2RlLmNhbGwodGhpcywgbnVsbCwgbnVsbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgTE5vZGUuY2FsbCh0aGlzLCBnbSwgdk5vZGUpO1xuICB9XG4gIHRoaXMud2VpZ2h0ID0gMTtcbn1cblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMTm9kZS5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBMTm9kZSkge1xuICBDb2Fyc2VuaW5nTm9kZVtwcm9wXSA9IExOb2RlW3Byb3BdO1xufVxuXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuc2V0TWF0Y2hlZCA9IGZ1bmN0aW9uKG1hdGNoZWQpXG57XG4gIHRoaXMubWF0Y2hlZCA9IG1hdGNoZWQ7XG59O1xuXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuaXNNYXRjaGVkID0gZnVuY3Rpb24oKVxue1xuICByZXR1cm4gdGhpcy5tYXRjaGVkO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLmdldFdlaWdodCA9IGZ1bmN0aW9uKClcbntcbiAgcmV0dXJuIHRoaXMud2VpZ2h0O1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLnNldFdlaWdodCA9IGZ1bmN0aW9uKHdlaWdodClcbntcbiAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG59O1xuXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuZ2V0Tm9kZTEgPSBmdW5jdGlvbigpXG57XG4gIHJldHVybiB0aGlzLm5vZGUxO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLnNldE5vZGUxID0gZnVuY3Rpb24obm9kZTEpXG57XG4gIHRoaXMubm9kZTEgPSBub2RlMTtcbn07XG5cbkNvYXJzZW5pbmdOb2RlLnByb3RvdHlwZS5nZXROb2RlMiA9IGZ1bmN0aW9uKClcbntcbiAgcmV0dXJuIHRoaXMubm9kZTI7XG59O1xuXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuc2V0Tm9kZTIgPSBmdW5jdGlvbihub2RlMilcbntcbiAgdGhpcy5ub2RlMiA9IG5vZGUyO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLmdldFJlZmVyZW5jZSA9IGZ1bmN0aW9uKClcbntcbiAgcmV0dXJuIHRoaXMucmVmZXJlbmNlO1xufTtcblxuQ29hcnNlbmluZ05vZGUucHJvdG90eXBlLnNldFJlZmVyZW5jZSA9IGZ1bmN0aW9uKHJlZmVyZW5jZSlcbntcbiAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG1hdGNoaW5nIG9mIHRoaXMgbm9kZVxuICogaWYgdGhpcyBub2RlIGRvZXMgbm90IGhhdmUgYW55IHVubWFjdGhlZCBuZWlnaGJvciB0aGVuIHJldHVybnMgbnVsbFxuICovXG5Db2Fyc2VuaW5nTm9kZS5wcm90b3R5cGUuZ2V0TWF0Y2hpbmcgPSBmdW5jdGlvbigpXG57XG4gIHZhciBtaW5XZWlnaHRlZCA9IG51bGw7XG4gIHZhciBtaW5XZWlnaHQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgXG4gIHZhciBuZWlnaGJvcnNMaXN0ID0gdGhpcy5nZXROZWlnaGJvcnNMaXN0KCk7IFxuICBcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhuZWlnaGJvcnNMaXN0LnNldCk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykgeyBcbi8vICBPYmplY3Qua2V5cyhuZWlnaGJvcnNMaXN0LnNldCkuZm9yRWFjaChmdW5jdGlvbihub2RlSWQpe1xuICAgIHZhciB2ID0gbmVpZ2hib3JzTGlzdC5zZXRba2V5c1tpXV07IFxuICAgIFxuICAgIGlmKCghdi5pc01hdGNoZWQoKSkgJiYgKHYgIT0gdGhpcykgJiYgKHYuZ2V0V2VpZ2h0KCkgPCBtaW5XZWlnaHQpKVxuICAgIHtcbiAgICAgIG1pbldlaWdodGVkID0gdjtcbiAgICAgIG1pbldlaWdodCA9IHYuZ2V0V2VpZ2h0KCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtaW5XZWlnaHRlZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29hcnNlbmluZ05vZGU7XG4iLCJmdW5jdGlvbiBEaW1lbnNpb25EKHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy53aWR0aCA9IDA7XG4gIHRoaXMuaGVpZ2h0ID0gMDtcbiAgaWYgKHdpZHRoICE9PSBudWxsICYmIGhlaWdodCAhPT0gbnVsbCkge1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgfVxufVxuXG5EaW1lbnNpb25ELnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLndpZHRoO1xufTtcblxuRGltZW5zaW9uRC5wcm90b3R5cGUuc2V0V2lkdGggPSBmdW5jdGlvbiAod2lkdGgpXG57XG4gIHRoaXMud2lkdGggPSB3aWR0aDtcbn07XG5cbkRpbWVuc2lvbkQucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmhlaWdodDtcbn07XG5cbkRpbWVuc2lvbkQucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQpXG57XG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaW1lbnNpb25EO1xuIiwiZnVuY3Rpb24gRW1pdHRlcigpe1xuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xufVxuXG52YXIgcCA9IEVtaXR0ZXIucHJvdG90eXBlO1xuXG5wLmFkZExpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50LCBjYWxsYmFjayApe1xuICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICBldmVudDogZXZlbnQsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0pO1xufTtcblxucC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudCwgY2FsbGJhY2sgKXtcbiAgZm9yKCB2YXIgaSA9IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSA+PSAwOyBpLS0gKXtcbiAgICB2YXIgbCA9IHRoaXMubGlzdGVuZXJzW2ldO1xuXG4gICAgaWYoIGwuZXZlbnQgPT09IGV2ZW50ICYmIGwuY2FsbGJhY2sgPT09IGNhbGxiYWNrICl7XG4gICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoIGksIDEgKTtcbiAgICB9XG4gIH1cbn07XG5cbnAuZW1pdCA9IGZ1bmN0aW9uKCBldmVudCwgZGF0YSApe1xuICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrICl7XG4gICAgdmFyIGwgPSB0aGlzLmxpc3RlbmVyc1tpXTtcblxuICAgIGlmKCBldmVudCA9PT0gbC5ldmVudCApe1xuICAgICAgbC5jYWxsYmFjayggZGF0YSApO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuIiwidmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcbnZhciBJR2VvbWV0cnkgPSByZXF1aXJlKCcuL0lHZW9tZXRyeScpO1xudmFyIElNYXRoID0gcmVxdWlyZSgnLi9JTWF0aCcpO1xudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcblxuZnVuY3Rpb24gRkRMYXlvdXQoKSB7XG4gIExheW91dC5jYWxsKHRoaXMpO1xuXG4gIHRoaXMudXNlU21hcnRJZGVhbEVkZ2VMZW5ndGhDYWxjdWxhdGlvbiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfVVNFX1NNQVJUX0lERUFMX0VER0VfTEVOR1RIX0NBTENVTEFUSU9OO1xuICB0aGlzLmlkZWFsRWRnZUxlbmd0aCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XG4gIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSDtcbiAgdGhpcy5yZXB1bHNpb25Db25zdGFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIO1xuICB0aGlzLmdyYXZpdHlDb25zdGFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9TVFJFTkdUSDtcbiAgdGhpcy5jb21wb3VuZEdyYXZpdHlDb25zdGFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSDtcbiAgdGhpcy5ncmF2aXR5UmFuZ2VGYWN0b3IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SO1xuICB0aGlzLmNvbXBvdW5kR3Jhdml0eVJhbmdlRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUjtcbiAgdGhpcy5kaXNwbGFjZW1lbnRUaHJlc2hvbGRQZXJOb2RlID0gKDMuMCAqIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEgpIC8gMTAwO1xuICB0aGlzLmNvb2xpbmdGYWN0b3IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPT0xJTkdfRkFDVE9SX0lOQ1JFTUVOVEFMO1xuICB0aGlzLmluaXRpYWxDb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTDtcbiAgdGhpcy50b3RhbERpc3BsYWNlbWVudCA9IDAuMDtcbiAgdGhpcy5vbGRUb3RhbERpc3BsYWNlbWVudCA9IDAuMDtcbiAgdGhpcy5tYXhJdGVyYXRpb25zID0gRkRMYXlvdXRDb25zdGFudHMuTUFYX0lURVJBVElPTlM7XG59XG5cbkZETGF5b3V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTGF5b3V0LnByb3RvdHlwZSk7XG5cbmZvciAodmFyIHByb3AgaW4gTGF5b3V0KSB7XG4gIEZETGF5b3V0W3Byb3BdID0gTGF5b3V0W3Byb3BdO1xufVxuXG5GRExheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIExheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMuY2FsbCh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIGlmICh0aGlzLmxheW91dFF1YWxpdHkgPT0gTGF5b3V0Q29uc3RhbnRzLkRSQUZUX1FVQUxJVFkpXG4gIHtcbiAgICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgKz0gMC4zMDtcbiAgICB0aGlzLm1heEl0ZXJhdGlvbnMgKj0gMC44O1xuICB9XG4gIGVsc2UgaWYgKHRoaXMubGF5b3V0UXVhbGl0eSA9PSBMYXlvdXRDb25zdGFudHMuUFJPT0ZfUVVBTElUWSlcbiAge1xuICAgIHRoaXMuZGlzcGxhY2VtZW50VGhyZXNob2xkUGVyTm9kZSAtPSAwLjMwO1xuICAgIHRoaXMubWF4SXRlcmF0aW9ucyAqPSAxLjI7XG4gIH1cblxuICB0aGlzLnRvdGFsSXRlcmF0aW9ucyA9IDA7XG4gIHRoaXMubm90QW5pbWF0ZWRJdGVyYXRpb25zID0gMDtcblxuICB0aGlzLnVzZUZSR3JpZFZhcmlhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9SRVBVTFNJT05fUkFOR0VfQ0FMQ1VMQVRJT047XG4gIFxuICB0aGlzLmdyaWQgPSBbXTtcbiAgLy8gdmFyaWFibGVzIGZvciB0cmVlIHJlZHVjdGlvbiBzdXBwb3J0XG4gIHRoaXMucHJ1bmVkTm9kZXNBbGwgPSBbXTtcbiAgdGhpcy5ncm93VHJlZUl0ZXJhdGlvbnMgPSAwO1xuICB0aGlzLmFmdGVyR3Jvd3RoSXRlcmF0aW9ucyA9IDA7XG4gIHRoaXMuaXNUcmVlR3Jvd2luZyA9IGZhbHNlO1xuICB0aGlzLmlzR3Jvd3RoRmluaXNoZWQgPSBmYWxzZTtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjSWRlYWxFZGdlTGVuZ3RocyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVkZ2U7XG4gIHZhciBsY2FEZXB0aDtcbiAgdmFyIHNvdXJjZTtcbiAgdmFyIHRhcmdldDtcbiAgdmFyIHNpemVPZlNvdXJjZUluTGNhO1xuICB2YXIgc2l6ZU9mVGFyZ2V0SW5MY2E7XG5cbiAgdmFyIGFsbEVkZ2VzID0gdGhpcy5nZXRHcmFwaE1hbmFnZXIoKS5nZXRBbGxFZGdlcygpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEVkZ2VzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgZWRnZSA9IGFsbEVkZ2VzW2ldO1xuXG4gICAgZWRnZS5pZGVhbExlbmd0aCA9IHRoaXMuaWRlYWxFZGdlTGVuZ3RoO1xuXG4gICAgaWYgKGVkZ2UuaXNJbnRlckdyYXBoKVxuICAgIHtcbiAgICAgIHNvdXJjZSA9IGVkZ2UuZ2V0U291cmNlKCk7XG4gICAgICB0YXJnZXQgPSBlZGdlLmdldFRhcmdldCgpO1xuXG4gICAgICBzaXplT2ZTb3VyY2VJbkxjYSA9IGVkZ2UuZ2V0U291cmNlSW5MY2EoKS5nZXRFc3RpbWF0ZWRTaXplKCk7XG4gICAgICBzaXplT2ZUYXJnZXRJbkxjYSA9IGVkZ2UuZ2V0VGFyZ2V0SW5MY2EoKS5nZXRFc3RpbWF0ZWRTaXplKCk7XG5cbiAgICAgIGlmICh0aGlzLnVzZVNtYXJ0SWRlYWxFZGdlTGVuZ3RoQ2FsY3VsYXRpb24pXG4gICAgICB7XG4gICAgICAgIGVkZ2UuaWRlYWxMZW5ndGggKz0gc2l6ZU9mU291cmNlSW5MY2EgKyBzaXplT2ZUYXJnZXRJbkxjYSAtXG4gICAgICAgICAgICAgICAgMiAqIExheW91dENvbnN0YW50cy5TSU1QTEVfTk9ERV9TSVpFO1xuICAgICAgfVxuXG4gICAgICBsY2FEZXB0aCA9IGVkZ2UuZ2V0TGNhKCkuZ2V0SW5jbHVzaW9uVHJlZURlcHRoKCk7XG5cbiAgICAgIGVkZ2UuaWRlYWxMZW5ndGggKz0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAqXG4gICAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLlBFUl9MRVZFTF9JREVBTF9FREdFX0xFTkdUSF9GQUNUT1IgKlxuICAgICAgICAgICAgICAoc291cmNlLmdldEluY2x1c2lvblRyZWVEZXB0aCgpICtcbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZ2V0SW5jbHVzaW9uVHJlZURlcHRoKCkgLSAyICogbGNhRGVwdGgpO1xuICAgIH1cbiAgfVxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmluaXRTcHJpbmdFbWJlZGRlciA9IGZ1bmN0aW9uICgpIHtcblxuICBpZiAodGhpcy5pbmNyZW1lbnRhbClcbiAge1xuICAgIHRoaXMubWF4Tm9kZURpc3BsYWNlbWVudCA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlRfSU5DUkVNRU5UQUw7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gMS4wO1xuICAgIHRoaXMuaW5pdGlhbENvb2xpbmdGYWN0b3IgPSAxLjA7XG4gICAgdGhpcy5tYXhOb2RlRGlzcGxhY2VtZW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLk1BWF9OT0RFX0RJU1BMQUNFTUVOVDtcbiAgfVxuXG4gIHRoaXMubWF4SXRlcmF0aW9ucyA9XG4gICAgICAgICAgTWF0aC5tYXgodGhpcy5nZXRBbGxOb2RlcygpLmxlbmd0aCAqIDUsIHRoaXMubWF4SXRlcmF0aW9ucyk7XG5cbiAgdGhpcy50b3RhbERpc3BsYWNlbWVudFRocmVzaG9sZCA9XG4gICAgICAgICAgdGhpcy5kaXNwbGFjZW1lbnRUaHJlc2hvbGRQZXJOb2RlICogdGhpcy5nZXRBbGxOb2RlcygpLmxlbmd0aDtcblxuICB0aGlzLnJlcHVsc2lvblJhbmdlID0gdGhpcy5jYWxjUmVwdWxzaW9uUmFuZ2UoKTtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjU3ByaW5nRm9yY2VzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbEVkZ2VzID0gdGhpcy5nZXRBbGxFZGdlcygpO1xuICB2YXIgZWRnZTtcbiAgdmFyIGVkZ2VzRGF0YSA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbEVkZ2VzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgZWRnZSA9IGxFZGdlc1tpXTtcblxuICAgIGVkZ2VzRGF0YVtpXSA9IHRoaXMuY2FsY1NwcmluZ0ZvcmNlKGVkZ2UsIGVkZ2UuaWRlYWxMZW5ndGgpO1xuICB9XG4gIHJldHVybiBlZGdlc0RhdGE7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvbkZvcmNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGksIGo7XG4gIHZhciBub2RlQSwgbm9kZUI7XG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XG4gIHZhciBwcm9jZXNzZWROb2RlU2V0O1xuXG4gIGlmICh0aGlzLnVzZUZSR3JpZFZhcmlhbnQpXG4gIHsgICAgICAgXG4gICAgaWYgKCh0aGlzLnRvdGFsSXRlcmF0aW9ucyAlIEZETGF5b3V0Q29uc3RhbnRzLkdSSURfQ0FMQ1VMQVRJT05fQ0hFQ0tfUEVSSU9EID09IDEgJiYgIXRoaXMuaXNUcmVlR3Jvd2luZyAmJiAhdGhpcy5pc0dyb3d0aEZpbmlzaGVkKSlcbiAgICB7ICAgICAgIFxuICAgICAgdGhpcy51cGRhdGVHcmlkKCk7ICBcbiAgICB9XG5cbiAgICBwcm9jZXNzZWROb2RlU2V0ID0gbmV3IFNldCgpO1xuICAgIFxuICAgIC8vIGNhbGN1bGF0ZSByZXB1bHNpb24gZm9yY2VzIGJldHdlZW4gZWFjaCBub2RlcyBhbmQgaXRzIHN1cnJvdW5kaW5nXG4gICAgZm9yIChpID0gMDsgaSA8IGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBub2RlQSA9IGxOb2Rlc1tpXTtcbiAgICAgIHRoaXMuY2FsY3VsYXRlUmVwdWxzaW9uRm9yY2VPZkFOb2RlKG5vZGVBLCBwcm9jZXNzZWROb2RlU2V0KTtcbiAgICAgIHByb2Nlc3NlZE5vZGVTZXQuYWRkKG5vZGVBKTtcbiAgICB9XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBub2RlQSA9IGxOb2Rlc1tpXTtcblxuICAgICAgZm9yIChqID0gaSArIDE7IGogPCBsTm9kZXMubGVuZ3RoOyBqKyspXG4gICAgICB7XG4gICAgICAgIG5vZGVCID0gbE5vZGVzW2pdO1xuXG4gICAgICAgIC8vIElmIGJvdGggbm9kZXMgYXJlIG5vdCBtZW1iZXJzIG9mIHRoZSBzYW1lIGdyYXBoLCBza2lwLlxuICAgICAgICBpZiAobm9kZUEuZ2V0T3duZXIoKSAhPSBub2RlQi5nZXRPd25lcigpKVxuICAgICAgICB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGNSZXB1bHNpb25Gb3JjZShub2RlQSwgbm9kZUIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2VzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbm9kZTtcbiAgdmFyIGxOb2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIG5vZGUgPSBsTm9kZXNbaV07XG4gICAgdGhpcy5jYWxjR3Jhdml0YXRpb25hbEZvcmNlKG5vZGUpO1xuICB9XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUubW92ZU5vZGVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbE5vZGVzID0gdGhpcy5nZXRBbGxOb2RlcygpO1xuICB2YXIgbm9kZTtcbiAgdmFyIG5vZGVzRGF0YSA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIG5vZGUgPSBsTm9kZXNbaV07XG4gICAgbm9kZXNEYXRhW2ldID0gbm9kZS5tb3ZlKCk7XG4gIH1cbiAgcmV0dXJuIG5vZGVzRGF0YTtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjU3ByaW5nRm9yY2UgPSBmdW5jdGlvbiAoZWRnZSwgaWRlYWxMZW5ndGgpIHtcbiAgdmFyIHNvdXJjZU5vZGUgPSBlZGdlLmdldFNvdXJjZSgpO1xuICB2YXIgdGFyZ2V0Tm9kZSA9IGVkZ2UuZ2V0VGFyZ2V0KCk7XG5cbiAgdmFyIGxlbmd0aDtcbiAgdmFyIHhMZW5ndGg7XG4gIHZhciB5TGVuZ3RoO1xuICB2YXIgc3ByaW5nRm9yY2U7XG4gIHZhciBzcHJpbmdGb3JjZVg7XG4gIHZhciBzcHJpbmdGb3JjZVk7XG5cbiAgLy8gVXBkYXRlIGVkZ2UgbGVuZ3RoXG4gIGlmICh0aGlzLnVuaWZvcm1MZWFmTm9kZVNpemVzICYmXG4gICAgICAgICAgc291cmNlTm9kZS5nZXRDaGlsZCgpID09IG51bGwgJiYgdGFyZ2V0Tm9kZS5nZXRDaGlsZCgpID09IG51bGwpXG4gIHtcbiAgICBlZGdlLnVwZGF0ZUxlbmd0aFNpbXBsZSgpO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIGVkZ2UudXBkYXRlTGVuZ3RoKCk7XG5cbiAgICBpZiAoZWRnZS5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQpXG4gICAge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGxlbmd0aCA9IGVkZ2UuZ2V0TGVuZ3RoKCk7XG4gIHhMZW5ndGggPSBlZGdlLmxlbmd0aFg7XG4gIHlMZW5ndGggPSBlZGdlLmxlbmd0aFk7XG5cbiAgLy8gQ2FsY3VsYXRlIHNwcmluZyBmb3JjZXNcbiAgc3ByaW5nRm9yY2UgPSB0aGlzLnNwcmluZ0NvbnN0YW50ICogKGxlbmd0aCAtIGlkZWFsTGVuZ3RoKTtcblxuICAvLyBQcm9qZWN0IGZvcmNlIG9udG8geCBhbmQgeSBheGVzXG4gIHNwcmluZ0ZvcmNlWCA9IHNwcmluZ0ZvcmNlICogKGVkZ2UubGVuZ3RoWCAvIGxlbmd0aCk7XG4gIHNwcmluZ0ZvcmNlWSA9IHNwcmluZ0ZvcmNlICogKGVkZ2UubGVuZ3RoWSAvIGxlbmd0aCk7XG4gIFxuICAvLyBBcHBseSBmb3JjZXMgb24gdGhlIGVuZCBub2Rlc1xuICBzb3VyY2VOb2RlLnNwcmluZ0ZvcmNlWCArPSBzcHJpbmdGb3JjZVg7XG4gIHNvdXJjZU5vZGUuc3ByaW5nRm9yY2VZICs9IHNwcmluZ0ZvcmNlWTtcbiAgdGFyZ2V0Tm9kZS5zcHJpbmdGb3JjZVggLT0gc3ByaW5nRm9yY2VYO1xuICB0YXJnZXROb2RlLnNwcmluZ0ZvcmNlWSAtPSBzcHJpbmdGb3JjZVk7XG4gIFxuICB2YXIgZWRnZURhdGEgPSB7XG4gICAgc291cmNlOiBzb3VyY2VOb2RlLFxuICAgIHRhcmdldDogdGFyZ2V0Tm9kZSxcbiAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICB4TGVuZ3RoOiB4TGVuZ3RoLFxuICAgIHlMZW5ndGg6IHlMZW5ndGhcbiAgfTtcbiAgXG4gIHJldHVybiBlZGdlRGF0YTtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjUmVwdWxzaW9uRm9yY2UgPSBmdW5jdGlvbiAobm9kZUEsIG5vZGVCKSB7XG4gIHZhciByZWN0QSA9IG5vZGVBLmdldFJlY3QoKTtcbiAgdmFyIHJlY3RCID0gbm9kZUIuZ2V0UmVjdCgpO1xuICB2YXIgb3ZlcmxhcEFtb3VudCA9IG5ldyBBcnJheSgyKTtcbiAgdmFyIGNsaXBQb2ludHMgPSBuZXcgQXJyYXkoNCk7XG4gIHZhciBkaXN0YW5jZVg7XG4gIHZhciBkaXN0YW5jZVk7XG4gIHZhciBkaXN0YW5jZVNxdWFyZWQ7XG4gIHZhciBkaXN0YW5jZTtcbiAgdmFyIHJlcHVsc2lvbkZvcmNlO1xuICB2YXIgcmVwdWxzaW9uRm9yY2VYO1xuICB2YXIgcmVwdWxzaW9uRm9yY2VZO1xuXG4gIGlmIChyZWN0QS5pbnRlcnNlY3RzKHJlY3RCKSkvLyB0d28gbm9kZXMgb3ZlcmxhcFxuICB7XG4gICAgLy8gY2FsY3VsYXRlIHNlcGFyYXRpb24gYW1vdW50IGluIHggYW5kIHkgZGlyZWN0aW9uc1xuICAgIElHZW9tZXRyeS5jYWxjU2VwYXJhdGlvbkFtb3VudChyZWN0QSxcbiAgICAgICAgICAgIHJlY3RCLFxuICAgICAgICAgICAgb3ZlcmxhcEFtb3VudCxcbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggLyAyLjApO1xuXG4gICAgcmVwdWxzaW9uRm9yY2VYID0gMiAqIG92ZXJsYXBBbW91bnRbMF07XG4gICAgcmVwdWxzaW9uRm9yY2VZID0gMiAqIG92ZXJsYXBBbW91bnRbMV07XG4gICAgXG4gICAgdmFyIGNoaWxkcmVuQ29uc3RhbnQgPSBub2RlQS5ub09mQ2hpbGRyZW4gKiBub2RlQi5ub09mQ2hpbGRyZW4gLyAobm9kZUEubm9PZkNoaWxkcmVuICsgbm9kZUIubm9PZkNoaWxkcmVuKTtcbiAgICBcbiAgICAvLyBBcHBseSBmb3JjZXMgb24gdGhlIHR3byBub2Rlc1xuICAgIG5vZGVBLnJlcHVsc2lvbkZvcmNlWCAtPSBjaGlsZHJlbkNvbnN0YW50ICogcmVwdWxzaW9uRm9yY2VYO1xuICAgIG5vZGVBLnJlcHVsc2lvbkZvcmNlWSAtPSBjaGlsZHJlbkNvbnN0YW50ICogcmVwdWxzaW9uRm9yY2VZO1xuICAgIG5vZGVCLnJlcHVsc2lvbkZvcmNlWCArPSBjaGlsZHJlbkNvbnN0YW50ICogcmVwdWxzaW9uRm9yY2VYO1xuICAgIG5vZGVCLnJlcHVsc2lvbkZvcmNlWSArPSBjaGlsZHJlbkNvbnN0YW50ICogcmVwdWxzaW9uRm9yY2VZO1xuICB9XG4gIGVsc2UvLyBubyBvdmVybGFwXG4gIHtcbiAgICAvLyBjYWxjdWxhdGUgZGlzdGFuY2VcblxuICAgIGlmICh0aGlzLnVuaWZvcm1MZWFmTm9kZVNpemVzICYmXG4gICAgICAgICAgICBub2RlQS5nZXRDaGlsZCgpID09IG51bGwgJiYgbm9kZUIuZ2V0Q2hpbGQoKSA9PSBudWxsKS8vIHNpbXBseSBiYXNlIHJlcHVsc2lvbiBvbiBkaXN0YW5jZSBvZiBub2RlIGNlbnRlcnNcbiAgICB7XG4gICAgICBkaXN0YW5jZVggPSByZWN0Qi5nZXRDZW50ZXJYKCkgLSByZWN0QS5nZXRDZW50ZXJYKCk7XG4gICAgICBkaXN0YW5jZVkgPSByZWN0Qi5nZXRDZW50ZXJZKCkgLSByZWN0QS5nZXRDZW50ZXJZKCk7XG4gICAgfVxuICAgIGVsc2UvLyB1c2UgY2xpcHBpbmcgcG9pbnRzXG4gICAge1xuICAgICAgSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbihyZWN0QSwgcmVjdEIsIGNsaXBQb2ludHMpO1xuXG4gICAgICBkaXN0YW5jZVggPSBjbGlwUG9pbnRzWzJdIC0gY2xpcFBvaW50c1swXTtcbiAgICAgIGRpc3RhbmNlWSA9IGNsaXBQb2ludHNbM10gLSBjbGlwUG9pbnRzWzFdO1xuICAgIH1cblxuICAgIC8vIE5vIHJlcHVsc2lvbiByYW5nZS4gRlIgZ3JpZCB2YXJpYW50IHNob3VsZCB0YWtlIGNhcmUgb2YgdGhpcy5cbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VYKSA8IEZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVClcbiAgICB7XG4gICAgICBkaXN0YW5jZVggPSBJTWF0aC5zaWduKGRpc3RhbmNlWCkgKlxuICAgICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1Q7XG4gICAgfVxuXG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlWSkgPCBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1QpXG4gICAge1xuICAgICAgZGlzdGFuY2VZID0gSU1hdGguc2lnbihkaXN0YW5jZVkpICpcbiAgICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUO1xuICAgIH1cblxuICAgIGRpc3RhbmNlU3F1YXJlZCA9IGRpc3RhbmNlWCAqIGRpc3RhbmNlWCArIGRpc3RhbmNlWSAqIGRpc3RhbmNlWTtcbiAgICBkaXN0YW5jZSA9IE1hdGguc3FydChkaXN0YW5jZVNxdWFyZWQpO1xuXG4gICAgcmVwdWxzaW9uRm9yY2UgPSB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ICogbm9kZUEubm9PZkNoaWxkcmVuICogbm9kZUIubm9PZkNoaWxkcmVuIC8gZGlzdGFuY2VTcXVhcmVkO1xuXG4gICAgLy8gUHJvamVjdCBmb3JjZSBvbnRvIHggYW5kIHkgYXhlc1xuICAgIHJlcHVsc2lvbkZvcmNlWCA9IHJlcHVsc2lvbkZvcmNlICogZGlzdGFuY2VYIC8gZGlzdGFuY2U7XG4gICAgcmVwdWxzaW9uRm9yY2VZID0gcmVwdWxzaW9uRm9yY2UgKiBkaXN0YW5jZVkgLyBkaXN0YW5jZTtcbiAgICAgXG4gICAgLy8gQXBwbHkgZm9yY2VzIG9uIHRoZSB0d28gbm9kZXMgICAgXG4gICAgbm9kZUEucmVwdWxzaW9uRm9yY2VYIC09IHJlcHVsc2lvbkZvcmNlWDtcbiAgICBub2RlQS5yZXB1bHNpb25Gb3JjZVkgLT0gcmVwdWxzaW9uRm9yY2VZO1xuICAgIG5vZGVCLnJlcHVsc2lvbkZvcmNlWCArPSByZXB1bHNpb25Gb3JjZVg7XG4gICAgbm9kZUIucmVwdWxzaW9uRm9yY2VZICs9IHJlcHVsc2lvbkZvcmNlWTtcbiAgfVxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2UgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgb3duZXJHcmFwaDtcbiAgdmFyIG93bmVyQ2VudGVyWDtcbiAgdmFyIG93bmVyQ2VudGVyWTtcbiAgdmFyIGRpc3RhbmNlWDtcbiAgdmFyIGRpc3RhbmNlWTtcbiAgdmFyIGFic0Rpc3RhbmNlWDtcbiAgdmFyIGFic0Rpc3RhbmNlWTtcbiAgdmFyIGVzdGltYXRlZFNpemU7XG4gIG93bmVyR3JhcGggPSBub2RlLmdldE93bmVyKCk7XG5cbiAgb3duZXJDZW50ZXJYID0gKG93bmVyR3JhcGguZ2V0UmlnaHQoKSArIG93bmVyR3JhcGguZ2V0TGVmdCgpKSAvIDI7XG4gIG93bmVyQ2VudGVyWSA9IChvd25lckdyYXBoLmdldFRvcCgpICsgb3duZXJHcmFwaC5nZXRCb3R0b20oKSkgLyAyO1xuICBkaXN0YW5jZVggPSBub2RlLmdldENlbnRlclgoKSAtIG93bmVyQ2VudGVyWDtcbiAgZGlzdGFuY2VZID0gbm9kZS5nZXRDZW50ZXJZKCkgLSBvd25lckNlbnRlclk7XG4gIGFic0Rpc3RhbmNlWCA9IE1hdGguYWJzKGRpc3RhbmNlWCkgKyBub2RlLmdldFdpZHRoKCkgLyAyO1xuICBhYnNEaXN0YW5jZVkgPSBNYXRoLmFicyhkaXN0YW5jZVkpICsgbm9kZS5nZXRIZWlnaHQoKSAvIDI7XG5cbiAgaWYgKG5vZGUuZ2V0T3duZXIoKSA9PSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkpLy8gaW4gdGhlIHJvb3QgZ3JhcGhcbiAge1xuICAgIGVzdGltYXRlZFNpemUgPSBvd25lckdyYXBoLmdldEVzdGltYXRlZFNpemUoKSAqIHRoaXMuZ3Jhdml0eVJhbmdlRmFjdG9yO1xuXG4gICAgaWYgKGFic0Rpc3RhbmNlWCA+IGVzdGltYXRlZFNpemUgfHwgYWJzRGlzdGFuY2VZID4gZXN0aW1hdGVkU2l6ZSlcbiAgICB7XG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VYID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VYO1xuICAgICAgbm9kZS5ncmF2aXRhdGlvbkZvcmNlWSA9IC10aGlzLmdyYXZpdHlDb25zdGFudCAqIGRpc3RhbmNlWTtcbiAgICB9XG4gIH1cbiAgZWxzZS8vIGluc2lkZSBhIGNvbXBvdW5kXG4gIHtcbiAgICBlc3RpbWF0ZWRTaXplID0gb3duZXJHcmFwaC5nZXRFc3RpbWF0ZWRTaXplKCkgKiB0aGlzLmNvbXBvdW5kR3Jhdml0eVJhbmdlRmFjdG9yO1xuXG4gICAgaWYgKGFic0Rpc3RhbmNlWCA+IGVzdGltYXRlZFNpemUgfHwgYWJzRGlzdGFuY2VZID4gZXN0aW1hdGVkU2l6ZSlcbiAgICB7XG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VYID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VYICpcbiAgICAgICAgICAgICAgdGhpcy5jb21wb3VuZEdyYXZpdHlDb25zdGFudDtcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVkgPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVkgKlxuICAgICAgICAgICAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50O1xuICAgIH1cbiAgfVxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmlzQ29udmVyZ2VkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29udmVyZ2VkO1xuICB2YXIgb3NjaWxhdGluZyA9IGZhbHNlO1xuXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyA+IHRoaXMubWF4SXRlcmF0aW9ucyAvIDMpXG4gIHtcbiAgICBvc2NpbGF0aW5nID1cbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudG90YWxEaXNwbGFjZW1lbnQgLSB0aGlzLm9sZFRvdGFsRGlzcGxhY2VtZW50KSA8IDI7XG4gIH1cblxuICBjb252ZXJnZWQgPSB0aGlzLnRvdGFsRGlzcGxhY2VtZW50IDwgdGhpcy50b3RhbERpc3BsYWNlbWVudFRocmVzaG9sZDtcblxuICB0aGlzLm9sZFRvdGFsRGlzcGxhY2VtZW50ID0gdGhpcy50b3RhbERpc3BsYWNlbWVudDtcblxuICByZXR1cm4gY29udmVyZ2VkIHx8IG9zY2lsYXRpbmc7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYW5pbWF0aW9uRHVyaW5nTGF5b3V0ICYmICF0aGlzLmlzU3ViTGF5b3V0KVxuICB7XG4gICAgaWYgKHRoaXMubm90QW5pbWF0ZWRJdGVyYXRpb25zID09IHRoaXMuYW5pbWF0aW9uUGVyaW9kKVxuICAgIHtcbiAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICB0aGlzLm5vdEFuaW1hdGVkSXRlcmF0aW9ucyA9IDA7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICB0aGlzLm5vdEFuaW1hdGVkSXRlcmF0aW9ucysrO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNlY3Rpb246IEZSLUdyaWQgVmFyaWFudCBSZXB1bHNpb24gRm9yY2UgQ2FsY3VsYXRpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjR3JpZCA9IGZ1bmN0aW9uIChncmFwaCl7XG5cbiAgdmFyIHNpemVYID0gMDsgXG4gIHZhciBzaXplWSA9IDA7XG4gIFxuICBzaXplWCA9IHBhcnNlSW50KE1hdGguY2VpbCgoZ3JhcGguZ2V0UmlnaHQoKSAtIGdyYXBoLmdldExlZnQoKSkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG4gIHNpemVZID0gcGFyc2VJbnQoTWF0aC5jZWlsKChncmFwaC5nZXRCb3R0b20oKSAtIGdyYXBoLmdldFRvcCgpKSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcbiAgXG4gIHZhciBncmlkID0gbmV3IEFycmF5KHNpemVYKTtcbiAgXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzaXplWDsgaSsrKXtcbiAgICBncmlkW2ldID0gbmV3IEFycmF5KHNpemVZKTsgICAgXG4gIH1cbiAgXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzaXplWDsgaSsrKXtcbiAgICBmb3IodmFyIGogPSAwOyBqIDwgc2l6ZVk7IGorKyl7XG4gICAgICBncmlkW2ldW2pdID0gbmV3IEFycmF5KCk7ICAgIFxuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIGdyaWQ7XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuYWRkTm9kZVRvR3JpZCA9IGZ1bmN0aW9uICh2LCBsZWZ0LCB0b3Ape1xuICAgIFxuICB2YXIgc3RhcnRYID0gMDtcbiAgdmFyIGZpbmlzaFggPSAwO1xuICB2YXIgc3RhcnRZID0gMDtcbiAgdmFyIGZpbmlzaFkgPSAwO1xuICBcbiAgc3RhcnRYID0gcGFyc2VJbnQoTWF0aC5mbG9vcigodi5nZXRSZWN0KCkueCAtIGxlZnQpIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuICBmaW5pc2hYID0gcGFyc2VJbnQoTWF0aC5mbG9vcigodi5nZXRSZWN0KCkud2lkdGggKyB2LmdldFJlY3QoKS54IC0gbGVmdCkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG4gIHN0YXJ0WSA9IHBhcnNlSW50KE1hdGguZmxvb3IoKHYuZ2V0UmVjdCgpLnkgLSB0b3ApIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuICBmaW5pc2hZID0gcGFyc2VJbnQoTWF0aC5mbG9vcigodi5nZXRSZWN0KCkuaGVpZ2h0ICsgdi5nZXRSZWN0KCkueSAtIHRvcCkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0WDsgaSA8PSBmaW5pc2hYOyBpKyspXG4gIHtcbiAgICBmb3IgKHZhciBqID0gc3RhcnRZOyBqIDw9IGZpbmlzaFk7IGorKylcbiAgICB7XG4gICAgICB0aGlzLmdyaWRbaV1bal0ucHVzaCh2KTtcbiAgICAgIHYuc2V0R3JpZENvb3JkaW5hdGVzKHN0YXJ0WCwgZmluaXNoWCwgc3RhcnRZLCBmaW5pc2hZKTsgXG4gICAgfVxuICB9ICBcblxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZUdyaWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGk7XG4gIHZhciBub2RlQTtcbiAgdmFyIGxOb2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXMoKTtcbiAgXG4gIHRoaXMuZ3JpZCA9IHRoaXMuY2FsY0dyaWQodGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpKTsgICBcblxuICAvLyBwdXQgYWxsIG5vZGVzIHRvIHByb3BlciBncmlkIGNlbGxzXG4gIGZvciAoaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBub2RlQSA9IGxOb2Rlc1tpXTtcbiAgICB0aGlzLmFkZE5vZGVUb0dyaWQobm9kZUEsIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXRMZWZ0KCksIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXRUb3AoKSk7XG4gIH0gXG5cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjdWxhdGVSZXB1bHNpb25Gb3JjZU9mQU5vZGUgPSBmdW5jdGlvbiAobm9kZUEsIHByb2Nlc3NlZE5vZGVTZXQpe1xuICBcbiAgaWYgKCh0aGlzLnRvdGFsSXRlcmF0aW9ucyAlIEZETGF5b3V0Q29uc3RhbnRzLkdSSURfQ0FMQ1VMQVRJT05fQ0hFQ0tfUEVSSU9EID09IDEgJiYgIXRoaXMuaXNUcmVlR3Jvd2luZyAmJiAhdGhpcy5pc0dyb3d0aEZpbmlzaGVkKSB8fCAodGhpcy5ncm93VHJlZUl0ZXJhdGlvbnMgJSAxMCA9PSAxICYmIHRoaXMuaXNUcmVlR3Jvd2luZykgfHwgKHRoaXMuYWZ0ZXJHcm93dGhJdGVyYXRpb25zICUgMTAgPT0gMSAmJiB0aGlzLmlzR3Jvd3RoRmluaXNoZWQpKVxuICB7XG4gICAgdmFyIHN1cnJvdW5kaW5nID0gbmV3IFNldCgpO1xuICAgIG5vZGVBLnN1cnJvdW5kaW5nID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIG5vZGVCO1xuICAgIHZhciBncmlkID0gdGhpcy5ncmlkO1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAobm9kZUEuc3RhcnRYIC0gMSk7IGkgPCAobm9kZUEuZmluaXNoWCArIDIpOyBpKyspXG4gICAge1xuICAgICAgZm9yICh2YXIgaiA9IChub2RlQS5zdGFydFkgLSAxKTsgaiA8IChub2RlQS5maW5pc2hZICsgMik7IGorKylcbiAgICAgIHtcbiAgICAgICAgaWYgKCEoKGkgPCAwKSB8fCAoaiA8IDApIHx8IChpID49IGdyaWQubGVuZ3RoKSB8fCAoaiA+PSBncmlkWzBdLmxlbmd0aCkpKVxuICAgICAgICB7ICBcbiAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGdyaWRbaV1bal0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIG5vZGVCID0gZ3JpZFtpXVtqXVtrXTtcblxuICAgICAgICAgICAgLy8gSWYgYm90aCBub2RlcyBhcmUgbm90IG1lbWJlcnMgb2YgdGhlIHNhbWUgZ3JhcGgsIFxuICAgICAgICAgICAgLy8gb3IgYm90aCBub2RlcyBhcmUgdGhlIHNhbWUsIHNraXAuXG4gICAgICAgICAgICBpZiAoKG5vZGVBLmdldE93bmVyKCkgIT0gbm9kZUIuZ2V0T3duZXIoKSkgfHwgKG5vZGVBID09IG5vZGVCKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSByZXB1bHNpb24gZm9yY2UgYmV0d2VlblxuICAgICAgICAgICAgLy8gbm9kZUEgYW5kIG5vZGVCIGhhcyBhbHJlYWR5IGJlZW4gY2FsY3VsYXRlZFxuICAgICAgICAgICAgaWYgKCFwcm9jZXNzZWROb2RlU2V0Lmhhcyhub2RlQikgJiYgIXN1cnJvdW5kaW5nLmhhcyhub2RlQikpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBkaXN0YW5jZVggPSBNYXRoLmFicyhub2RlQS5nZXRDZW50ZXJYKCktbm9kZUIuZ2V0Q2VudGVyWCgpKSAtIFxuICAgICAgICAgICAgICAgICAgICAoKG5vZGVBLmdldFdpZHRoKCkvMikgKyAobm9kZUIuZ2V0V2lkdGgoKS8yKSk7XG4gICAgICAgICAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhub2RlQS5nZXRDZW50ZXJZKCktbm9kZUIuZ2V0Q2VudGVyWSgpKSAtIFxuICAgICAgICAgICAgICAgICAgICAoKG5vZGVBLmdldEhlaWdodCgpLzIpICsgKG5vZGVCLmdldEhlaWdodCgpLzIpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyBpZiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBub2RlQSBhbmQgbm9kZUIgXG4gICAgICAgICAgICAgIC8vIGlzIGxlc3MgdGhlbiBjYWxjdWxhdGlvbiByYW5nZVxuICAgICAgICAgICAgICBpZiAoKGRpc3RhbmNlWCA8PSB0aGlzLnJlcHVsc2lvblJhbmdlKSAmJiAoZGlzdGFuY2VZIDw9IHRoaXMucmVwdWxzaW9uUmFuZ2UpKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy90aGVuIGFkZCBub2RlQiB0byBzdXJyb3VuZGluZyBvZiBub2RlQVxuICAgICAgICAgICAgICAgIHN1cnJvdW5kaW5nLmFkZChub2RlQik7XG4gICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH0gICAgICAgICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgbm9kZUEuc3Vycm91bmRpbmcgPSBbLi4uc3Vycm91bmRpbmddO1xuXHRcbiAgfVxuICBmb3IgKGkgPSAwOyBpIDwgbm9kZUEuc3Vycm91bmRpbmcubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB0aGlzLmNhbGNSZXB1bHNpb25Gb3JjZShub2RlQSwgbm9kZUEuc3Vycm91bmRpbmdbaV0pO1xuICB9XHRcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjUmVwdWxzaW9uUmFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAwLjA7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VjdGlvbjogVHJlZSBSZWR1Y3Rpb24gbWV0aG9kc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJlZHVjZSB0cmVlcyBcbkZETGF5b3V0LnByb3RvdHlwZS5yZWR1Y2VUcmVlcyA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBwcnVuZWROb2Rlc0FsbCA9IFtdO1xuICB2YXIgY29udGFpbnNMZWFmID0gdHJ1ZTtcbiAgdmFyIG5vZGU7XG4gIFxuICB3aGlsZShjb250YWluc0xlYWYpIHtcbiAgICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2RlcygpO1xuICAgIHZhciBwcnVuZWROb2Rlc0luU3RlcFRlbXAgPSBbXTtcbiAgICBjb250YWluc0xlYWYgPSBmYWxzZTtcbiAgICBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBub2RlID0gYWxsTm9kZXNbaV07XG4gICAgICBpZihub2RlLmdldEVkZ2VzKCkubGVuZ3RoID09IDEgJiYgIW5vZGUuZ2V0RWRnZXMoKVswXS5pc0ludGVyR3JhcGggJiYgbm9kZS5nZXRDaGlsZCgpID09IG51bGwpe1xuICAgICAgICBwcnVuZWROb2Rlc0luU3RlcFRlbXAucHVzaChbbm9kZSwgbm9kZS5nZXRFZGdlcygpWzBdLCBub2RlLmdldE93bmVyKCldKTtcbiAgICAgICAgY29udGFpbnNMZWFmID0gdHJ1ZTtcbiAgICAgIH0gIFxuICAgIH1cbiAgICBpZihjb250YWluc0xlYWYgPT0gdHJ1ZSl7XG4gICAgICB2YXIgcHJ1bmVkTm9kZXNJblN0ZXAgPSBbXTtcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBwcnVuZWROb2Rlc0luU3RlcFRlbXAubGVuZ3RoOyBqKyspe1xuICAgICAgICBpZihwcnVuZWROb2Rlc0luU3RlcFRlbXBbal1bMF0uZ2V0RWRnZXMoKS5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgcHJ1bmVkTm9kZXNJblN0ZXAucHVzaChwcnVuZWROb2Rlc0luU3RlcFRlbXBbal0pOyAgXG4gICAgICAgICAgcHJ1bmVkTm9kZXNJblN0ZXBUZW1wW2pdWzBdLmdldE93bmVyKCkucmVtb3ZlKHBydW5lZE5vZGVzSW5TdGVwVGVtcFtqXVswXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBydW5lZE5vZGVzQWxsLnB1c2gocHJ1bmVkTm9kZXNJblN0ZXApO1xuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2RlcygpO1xuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xuICAgIH1cbiAgfVxuICB0aGlzLnBydW5lZE5vZGVzQWxsID0gcHJ1bmVkTm9kZXNBbGw7XG59O1xuXG4vLyBHcm93IHRyZWUgb25lIHN0ZXAgXG5GRExheW91dC5wcm90b3R5cGUuZ3Jvd1RyZWUgPSBmdW5jdGlvbihwcnVuZWROb2Rlc0FsbClcbntcbiAgdmFyIGxlbmd0aE9mUHJ1bmVkTm9kZXNJblN0ZXAgPSBwcnVuZWROb2Rlc0FsbC5sZW5ndGg7IFxuICB2YXIgcHJ1bmVkTm9kZXNJblN0ZXAgPSBwcnVuZWROb2Rlc0FsbFtsZW5ndGhPZlBydW5lZE5vZGVzSW5TdGVwIC0gMV07ICBcblxuICB2YXIgbm9kZURhdGE7ICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IHBydW5lZE5vZGVzSW5TdGVwLmxlbmd0aDsgaSsrKXtcbiAgICBub2RlRGF0YSA9IHBydW5lZE5vZGVzSW5TdGVwW2ldO1xuXG4gICAgdGhpcy5maW5kUGxhY2Vmb3JQcnVuZWROb2RlKG5vZGVEYXRhKTtcbiAgICBcbiAgICBub2RlRGF0YVsyXS5hZGQobm9kZURhdGFbMF0pO1xuICAgIG5vZGVEYXRhWzJdLmFkZChub2RlRGF0YVsxXSwgbm9kZURhdGFbMV0uc291cmNlLCBub2RlRGF0YVsxXS50YXJnZXQpO1xuICB9XG5cbiAgcHJ1bmVkTm9kZXNBbGwuc3BsaWNlKHBydW5lZE5vZGVzQWxsLmxlbmd0aC0xLCAxKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2RlcygpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbEVkZ2VzKCk7XG59O1xuXG4vLyBGaW5kIGFuIGFwcHJvcHJpYXRlIHBvc2l0aW9uIHRvIHJlcGxhY2UgcHJ1bmVkIG5vZGUsIHRoaXMgbWV0aG9kIGNhbiBiZSBpbXByb3ZlZFxuRkRMYXlvdXQucHJvdG90eXBlLmZpbmRQbGFjZWZvclBydW5lZE5vZGUgPSBmdW5jdGlvbihub2RlRGF0YSl7XG4gIFxuICB2YXIgZ3JpZEZvclBydW5lZE5vZGU7ICBcbiAgdmFyIG5vZGVUb0Nvbm5lY3Q7XG4gIHZhciBwcnVuZWROb2RlID0gbm9kZURhdGFbMF07XG4gIGlmKHBydW5lZE5vZGUgPT0gbm9kZURhdGFbMV0uc291cmNlKXtcbiAgICBub2RlVG9Db25uZWN0ID0gbm9kZURhdGFbMV0udGFyZ2V0O1xuICB9XG4gIGVsc2Uge1xuICAgIG5vZGVUb0Nvbm5lY3QgPSBub2RlRGF0YVsxXS5zb3VyY2U7ICBcbiAgfVxuICB2YXIgc3RhcnRHcmlkWCA9IG5vZGVUb0Nvbm5lY3Quc3RhcnRYO1xuICB2YXIgZmluaXNoR3JpZFggPSBub2RlVG9Db25uZWN0LmZpbmlzaFg7XG4gIHZhciBzdGFydEdyaWRZID0gbm9kZVRvQ29ubmVjdC5zdGFydFk7XG4gIHZhciBmaW5pc2hHcmlkWSA9IG5vZGVUb0Nvbm5lY3QuZmluaXNoWTsgXG4gIFxuICB2YXIgdXBOb2RlQ291bnQgPSAwO1xuICB2YXIgZG93bk5vZGVDb3VudCA9IDA7XG4gIHZhciByaWdodE5vZGVDb3VudCA9IDA7XG4gIHZhciBsZWZ0Tm9kZUNvdW50ID0gMDtcbiAgdmFyIGNvbnRyb2xSZWdpb25zID0gW3VwTm9kZUNvdW50LCByaWdodE5vZGVDb3VudCwgZG93bk5vZGVDb3VudCwgbGVmdE5vZGVDb3VudF1cbiAgXG4gIGlmKHN0YXJ0R3JpZFkgPiAwKXtcbiAgICBmb3IodmFyIGkgPSBzdGFydEdyaWRYOyBpIDw9IGZpbmlzaEdyaWRYOyBpKysgKXtcbiAgICAgIGNvbnRyb2xSZWdpb25zWzBdICs9ICh0aGlzLmdyaWRbaV1bc3RhcnRHcmlkWSAtIDFdLmxlbmd0aCArIHRoaXMuZ3JpZFtpXVtzdGFydEdyaWRZXS5sZW5ndGggLSAxKTsgICBcbiAgICB9XG4gIH1cbiAgaWYoZmluaXNoR3JpZFggPCB0aGlzLmdyaWQubGVuZ3RoIC0gMSl7XG4gICAgZm9yKHZhciBpID0gc3RhcnRHcmlkWTsgaSA8PSBmaW5pc2hHcmlkWTsgaSsrICl7XG4gICAgICBjb250cm9sUmVnaW9uc1sxXSArPSAodGhpcy5ncmlkW2ZpbmlzaEdyaWRYICsgMV1baV0ubGVuZ3RoICsgdGhpcy5ncmlkW2ZpbmlzaEdyaWRYXVtpXS5sZW5ndGggLSAxKTsgICBcbiAgICB9XG4gIH1cbiAgaWYoZmluaXNoR3JpZFkgPCB0aGlzLmdyaWRbMF0ubGVuZ3RoIC0gMSl7XG4gICAgZm9yKHZhciBpID0gc3RhcnRHcmlkWDsgaSA8PSBmaW5pc2hHcmlkWDsgaSsrICl7XG4gICAgICBjb250cm9sUmVnaW9uc1syXSArPSAodGhpcy5ncmlkW2ldW2ZpbmlzaEdyaWRZICsgMV0ubGVuZ3RoICsgdGhpcy5ncmlkW2ldW2ZpbmlzaEdyaWRZXS5sZW5ndGggLSAxKTsgICBcbiAgICB9XG4gIH1cbiAgaWYoc3RhcnRHcmlkWCA+IDApe1xuICAgIGZvcih2YXIgaSA9IHN0YXJ0R3JpZFk7IGkgPD0gZmluaXNoR3JpZFk7IGkrKyApe1xuICAgICAgY29udHJvbFJlZ2lvbnNbM10gKz0gKHRoaXMuZ3JpZFtzdGFydEdyaWRYIC0gMV1baV0ubGVuZ3RoICsgdGhpcy5ncmlkW3N0YXJ0R3JpZFhdW2ldLmxlbmd0aCAtIDEpOyAgIFxuICAgIH1cbiAgfVxuICB2YXIgbWluID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciBtaW5Db3VudDtcbiAgdmFyIG1pbkluZGV4O1xuICBmb3IodmFyIGogPSAwOyBqIDwgY29udHJvbFJlZ2lvbnMubGVuZ3RoOyBqKyspe1xuICAgIGlmKGNvbnRyb2xSZWdpb25zW2pdIDwgbWluKXtcbiAgICAgIG1pbiA9IGNvbnRyb2xSZWdpb25zW2pdO1xuICAgICAgbWluQ291bnQgPSAxO1xuICAgICAgbWluSW5kZXggPSBqO1xuICAgIH0gIFxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbal0gPT0gbWluKXtcbiAgICAgIG1pbkNvdW50Kys7ICBcbiAgICB9XG4gIH1cbiAgXG4gIGlmKG1pbkNvdW50ID09IDMgJiYgbWluID09IDApe1xuICAgIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMV0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1syXSA9PSAwKXtcbiAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMTsgICAgXG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1sxXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzNdID09IDApe1xuICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAwOyAgXG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1syXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzNdID09IDApe1xuICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAzOyAgXG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMV0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1syXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzNdID09IDApe1xuICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAyOyAgXG4gICAgfVxuICB9XG4gIGVsc2UgaWYobWluQ291bnQgPT0gMiAmJiBtaW4gPT0gMCl7XG4gICAgdmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMV0gPT0gMCl7O1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDA7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1syXSA9PSAwKXtcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAwO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAyO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzBdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbM10gPT0gMCl7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMDtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMztcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1sxXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzJdID09IDApe1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDE7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDI7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMV0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1szXSA9PSAwKXtcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAxO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAzO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAyO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIGlmKG1pbkNvdW50ID09IDQgJiYgbWluID09IDApe1xuICAgIHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IHJhbmRvbTsgIFxuICB9XG4gIGVsc2Uge1xuICAgIGdyaWRGb3JQcnVuZWROb2RlID0gbWluSW5kZXg7XG4gIH1cbiAgXG4gIGlmKGdyaWRGb3JQcnVuZWROb2RlID09IDApIHtcbiAgICBwcnVuZWROb2RlLnNldENlbnRlcihub2RlVG9Db25uZWN0LmdldENlbnRlclgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVG9Db25uZWN0LmdldENlbnRlclkoKSAtIG5vZGVUb0Nvbm5lY3QuZ2V0SGVpZ2h0KCkvMiAtIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggLSBwcnVuZWROb2RlLmdldEhlaWdodCgpLzIpOyAgXG4gIH1cbiAgZWxzZSBpZihncmlkRm9yUHJ1bmVkTm9kZSA9PSAxKSB7XG4gICAgcHJ1bmVkTm9kZS5zZXRDZW50ZXIobm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJYKCkgKyBub2RlVG9Db25uZWN0LmdldFdpZHRoKCkvMiArIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggKyBwcnVuZWROb2RlLmdldFdpZHRoKCkvMixcbiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVG9Db25uZWN0LmdldENlbnRlclkoKSk7ICBcbiAgfVxuICBlbHNlIGlmKGdyaWRGb3JQcnVuZWROb2RlID09IDIpIHtcbiAgICBwcnVuZWROb2RlLnNldENlbnRlcihub2RlVG9Db25uZWN0LmdldENlbnRlclgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVG9Db25uZWN0LmdldENlbnRlclkoKSArIG5vZGVUb0Nvbm5lY3QuZ2V0SGVpZ2h0KCkvMiArIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggKyBwcnVuZWROb2RlLmdldEhlaWdodCgpLzIpOyAgXG4gIH1cbiAgZWxzZSB7IFxuICAgIHBydW5lZE5vZGUuc2V0Q2VudGVyKG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWCgpIC0gbm9kZVRvQ29ubmVjdC5nZXRXaWR0aCgpLzIgLSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIIC0gcHJ1bmVkTm9kZS5nZXRXaWR0aCgpLzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJZKCkpOyAgXG4gIH1cbiAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZETGF5b3V0O1xuIiwidmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG5cbmZ1bmN0aW9uIEZETGF5b3V0Q29uc3RhbnRzKCkge1xufVxuXG4vL0ZETGF5b3V0Q29uc3RhbnRzIGluaGVyaXRzIHN0YXRpYyBwcm9wcyBpbiBMYXlvdXRDb25zdGFudHNcbmZvciAodmFyIHByb3AgaW4gTGF5b3V0Q29uc3RhbnRzKSB7XG4gIEZETGF5b3V0Q29uc3RhbnRzW3Byb3BdID0gTGF5b3V0Q29uc3RhbnRzW3Byb3BdO1xufVxuXG5GRExheW91dENvbnN0YW50cy5NQVhfSVRFUkFUSU9OUyA9IDI1MDA7XG5cbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPSA1MDtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIID0gMC40NTtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIID0gNDUwMC4wO1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gMC40O1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1NUUkVOR1RIID0gMS4wO1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IDMuODtcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSAxLjU7XG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9JREVBTF9FREdFX0xFTkdUSF9DQUxDVUxBVElPTiA9IHRydWU7XG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9SRVBVTFNJT05fUkFOR0VfQ0FMQ1VMQVRJT04gPSB0cnVlO1xuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCA9IDAuNTtcbkZETGF5b3V0Q29uc3RhbnRzLk1BWF9OT0RFX0RJU1BMQUNFTUVOVF9JTkNSRU1FTlRBTCA9IDEwMC4wO1xuRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UID0gRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UX0lOQ1JFTUVOVEFMICogMztcbkZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggLyAxMC4wO1xuRkRMYXlvdXRDb25zdGFudHMuQ09OVkVSR0VOQ0VfQ0hFQ0tfUEVSSU9EID0gMTAwO1xuRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiA9IDAuMTtcbkZETGF5b3V0Q29uc3RhbnRzLk1JTl9FREdFX0xFTkdUSCA9IDE7XG5GRExheW91dENvbnN0YW50cy5HUklEX0NBTENVTEFUSU9OX0NIRUNLX1BFUklPRCA9IDEwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZETGF5b3V0Q29uc3RhbnRzO1xuIiwidmFyIExFZGdlID0gcmVxdWlyZSgnLi9MRWRnZScpO1xudmFyIEZETGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9GRExheW91dENvbnN0YW50cycpO1xuXG5mdW5jdGlvbiBGRExheW91dEVkZ2Uoc291cmNlLCB0YXJnZXQsIHZFZGdlKSB7XG4gIExFZGdlLmNhbGwodGhpcywgc291cmNlLCB0YXJnZXQsIHZFZGdlKTtcbiAgdGhpcy5pZGVhbExlbmd0aCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XG59XG5cbkZETGF5b3V0RWRnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExFZGdlLnByb3RvdHlwZSk7XG5cbmZvciAodmFyIHByb3AgaW4gTEVkZ2UpIHtcbiAgRkRMYXlvdXRFZGdlW3Byb3BdID0gTEVkZ2VbcHJvcF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRkRMYXlvdXRFZGdlO1xuIiwidmFyIExOb2RlID0gcmVxdWlyZSgnLi9MTm9kZScpO1xuXG5mdW5jdGlvbiBGRExheW91dE5vZGUoZ20sIGxvYywgc2l6ZSwgdk5vZGUpIHtcbiAgLy8gYWx0ZXJuYXRpdmUgY29uc3RydWN0b3IgaXMgaGFuZGxlZCBpbnNpZGUgTE5vZGVcbiAgTE5vZGUuY2FsbCh0aGlzLCBnbSwgbG9jLCBzaXplLCB2Tm9kZSk7XG4gIC8vU3ByaW5nLCByZXB1bHNpb24gYW5kIGdyYXZpdGF0aW9uYWwgZm9yY2VzIGFjdGluZyBvbiB0aGlzIG5vZGVcbiAgdGhpcy5zcHJpbmdGb3JjZVggPSAwO1xuICB0aGlzLnNwcmluZ0ZvcmNlWSA9IDA7XG4gIHRoaXMucmVwdWxzaW9uRm9yY2VYID0gMDtcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVkgPSAwO1xuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYID0gMDtcbiAgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWSA9IDA7XG4gIC8vQW1vdW50IGJ5IHdoaWNoIHRoaXMgbm9kZSBpcyB0byBiZSBtb3ZlZCBpbiB0aGlzIGl0ZXJhdGlvblxuICB0aGlzLmRpc3BsYWNlbWVudFggPSAwO1xuICB0aGlzLmRpc3BsYWNlbWVudFkgPSAwO1xuXG4gIC8vU3RhcnQgYW5kIGZpbmlzaCBncmlkIGNvb3JkaW5hdGVzIHRoYXQgdGhpcyBub2RlIGlzIGZhbGxlbiBpbnRvXG4gIHRoaXMuc3RhcnRYID0gMDtcbiAgdGhpcy5maW5pc2hYID0gMDtcbiAgdGhpcy5zdGFydFkgPSAwO1xuICB0aGlzLmZpbmlzaFkgPSAwO1xuXG4gIC8vR2VvbWV0cmljIG5laWdoYm9ycyBvZiB0aGlzIG5vZGVcbiAgdGhpcy5zdXJyb3VuZGluZyA9IFtdO1xufVxuXG5GRExheW91dE5vZGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMTm9kZS5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIExOb2RlKSB7XG4gIEZETGF5b3V0Tm9kZVtwcm9wXSA9IExOb2RlW3Byb3BdO1xufVxuXG5GRExheW91dE5vZGUucHJvdG90eXBlLnNldEdyaWRDb29yZGluYXRlcyA9IGZ1bmN0aW9uIChfc3RhcnRYLCBfZmluaXNoWCwgX3N0YXJ0WSwgX2ZpbmlzaFkpXG57XG4gIHRoaXMuc3RhcnRYID0gX3N0YXJ0WDtcbiAgdGhpcy5maW5pc2hYID0gX2ZpbmlzaFg7XG4gIHRoaXMuc3RhcnRZID0gX3N0YXJ0WTtcbiAgdGhpcy5maW5pc2hZID0gX2ZpbmlzaFk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRkRMYXlvdXROb2RlO1xuIiwidmFyIFVuaXF1ZUlER2VuZXJldG9yID0gcmVxdWlyZSgnLi9VbmlxdWVJREdlbmVyZXRvcicpO1xuXG5mdW5jdGlvbiBIYXNoTWFwKCkge1xuICB0aGlzLm1hcCA9IHt9O1xuICB0aGlzLmtleXMgPSBbXTtcbn1cblxuSGFzaE1hcC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQoa2V5KTtcbiAgaWYgKCF0aGlzLmNvbnRhaW5zKHRoZUlkKSkge1xuICAgIHRoaXMubWFwW3RoZUlkXSA9IHZhbHVlO1xuICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gIH1cbn07XG5cbkhhc2hNYXAucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xuICByZXR1cm4gdGhpcy5tYXBba2V5XSAhPSBudWxsO1xufTtcblxuSGFzaE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xuICByZXR1cm4gdGhpcy5tYXBbdGhlSWRdO1xufTtcblxuSGFzaE1hcC5wcm90b3R5cGUua2V5U2V0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5rZXlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoTWFwO1xuIiwidmFyIFVuaXF1ZUlER2VuZXJldG9yID0gcmVxdWlyZSgnLi9VbmlxdWVJREdlbmVyZXRvcicpO1xuXG5mdW5jdGlvbiBIYXNoU2V0KCkge1xuICB0aGlzLnNldCA9IHt9O1xufVxuO1xuXG5IYXNoU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciB0aGVJZCA9IFVuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKG9iaik7XG4gIGlmICghdGhpcy5jb250YWlucyh0aGVJZCkpXG4gICAgdGhpcy5zZXRbdGhlSWRdID0gb2JqO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG9iaikge1xuICBkZWxldGUgdGhpcy5zZXRbVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQob2JqKV07XG59O1xuXG5IYXNoU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zZXQgPSB7fTtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdGhpcy5zZXRbVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQob2JqKV0gPT0gb2JqO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc2V0KS5sZW5ndGg7XG59O1xuXG4vL2NvbmNhdHMgdGhpcy5zZXQgdG8gdGhlIGdpdmVuIGxpc3Rcbkhhc2hTZXQucHJvdG90eXBlLmFkZEFsbFRvID0gZnVuY3Rpb24gKGxpc3QpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNldCk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGxpc3QucHVzaCh0aGlzLnNldFtrZXlzW2ldXSk7XG4gIH1cbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnNldCkubGVuZ3RoO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUuYWRkQWxsID0gZnVuY3Rpb24gKGxpc3QpIHtcbiAgdmFyIHMgPSBsaXN0Lmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspIHtcbiAgICB2YXIgdiA9IGxpc3RbaV07XG4gICAgdGhpcy5hZGQodik7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaFNldDtcbiIsImZ1bmN0aW9uIElHZW9tZXRyeSgpIHtcbn1cblxuSUdlb21ldHJ5LmNhbGNTZXBhcmF0aW9uQW1vdW50ID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0Qiwgb3ZlcmxhcEFtb3VudCwgc2VwYXJhdGlvbkJ1ZmZlcilcbntcbiAgaWYgKCFyZWN0QS5pbnRlcnNlY3RzKHJlY3RCKSkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG4gIHZhciBkaXJlY3Rpb25zID0gbmV3IEFycmF5KDIpO1xuICBJR2VvbWV0cnkuZGVjaWRlRGlyZWN0aW9uc0Zvck92ZXJsYXBwaW5nTm9kZXMocmVjdEEsIHJlY3RCLCBkaXJlY3Rpb25zKTtcbiAgb3ZlcmxhcEFtb3VudFswXSA9IE1hdGgubWluKHJlY3RBLmdldFJpZ2h0KCksIHJlY3RCLmdldFJpZ2h0KCkpIC1cbiAgICAgICAgICBNYXRoLm1heChyZWN0QS54LCByZWN0Qi54KTtcbiAgb3ZlcmxhcEFtb3VudFsxXSA9IE1hdGgubWluKHJlY3RBLmdldEJvdHRvbSgpLCByZWN0Qi5nZXRCb3R0b20oKSkgLVxuICAgICAgICAgIE1hdGgubWF4KHJlY3RBLnksIHJlY3RCLnkpO1xuICAvLyB1cGRhdGUgdGhlIG92ZXJsYXBwaW5nIGFtb3VudHMgZm9yIHRoZSBmb2xsb3dpbmcgY2FzZXM6XG4gIGlmICgocmVjdEEuZ2V0WCgpIDw9IHJlY3RCLmdldFgoKSkgJiYgKHJlY3RBLmdldFJpZ2h0KCkgPj0gcmVjdEIuZ2V0UmlnaHQoKSkpXG4gIHtcbiAgICBvdmVybGFwQW1vdW50WzBdICs9IE1hdGgubWluKChyZWN0Qi5nZXRYKCkgLSByZWN0QS5nZXRYKCkpLFxuICAgICAgICAgICAgKHJlY3RBLmdldFJpZ2h0KCkgLSByZWN0Qi5nZXRSaWdodCgpKSk7XG4gIH1cbiAgZWxzZSBpZiAoKHJlY3RCLmdldFgoKSA8PSByZWN0QS5nZXRYKCkpICYmIChyZWN0Qi5nZXRSaWdodCgpID49IHJlY3RBLmdldFJpZ2h0KCkpKVxuICB7XG4gICAgb3ZlcmxhcEFtb3VudFswXSArPSBNYXRoLm1pbigocmVjdEEuZ2V0WCgpIC0gcmVjdEIuZ2V0WCgpKSxcbiAgICAgICAgICAgIChyZWN0Qi5nZXRSaWdodCgpIC0gcmVjdEEuZ2V0UmlnaHQoKSkpO1xuICB9XG4gIGlmICgocmVjdEEuZ2V0WSgpIDw9IHJlY3RCLmdldFkoKSkgJiYgKHJlY3RBLmdldEJvdHRvbSgpID49IHJlY3RCLmdldEJvdHRvbSgpKSlcbiAge1xuICAgIG92ZXJsYXBBbW91bnRbMV0gKz0gTWF0aC5taW4oKHJlY3RCLmdldFkoKSAtIHJlY3RBLmdldFkoKSksXG4gICAgICAgICAgICAocmVjdEEuZ2V0Qm90dG9tKCkgLSByZWN0Qi5nZXRCb3R0b20oKSkpO1xuICB9XG4gIGVsc2UgaWYgKChyZWN0Qi5nZXRZKCkgPD0gcmVjdEEuZ2V0WSgpKSAmJiAocmVjdEIuZ2V0Qm90dG9tKCkgPj0gcmVjdEEuZ2V0Qm90dG9tKCkpKVxuICB7XG4gICAgb3ZlcmxhcEFtb3VudFsxXSArPSBNYXRoLm1pbigocmVjdEEuZ2V0WSgpIC0gcmVjdEIuZ2V0WSgpKSxcbiAgICAgICAgICAgIChyZWN0Qi5nZXRCb3R0b20oKSAtIHJlY3RBLmdldEJvdHRvbSgpKSk7XG4gIH1cblxuICAvLyBmaW5kIHNsb3BlIG9mIHRoZSBsaW5lIHBhc3NlcyB0d28gY2VudGVyc1xuICB2YXIgc2xvcGUgPSBNYXRoLmFicygocmVjdEIuZ2V0Q2VudGVyWSgpIC0gcmVjdEEuZ2V0Q2VudGVyWSgpKSAvXG4gICAgICAgICAgKHJlY3RCLmdldENlbnRlclgoKSAtIHJlY3RBLmdldENlbnRlclgoKSkpO1xuICAvLyBpZiBjZW50ZXJzIGFyZSBvdmVybGFwcGVkXG4gIGlmICgocmVjdEIuZ2V0Q2VudGVyWSgpID09IHJlY3RBLmdldENlbnRlclkoKSkgJiZcbiAgICAgICAgICAocmVjdEIuZ2V0Q2VudGVyWCgpID09IHJlY3RBLmdldENlbnRlclgoKSkpXG4gIHtcbiAgICAvLyBhc3N1bWUgdGhlIHNsb3BlIGlzIDEgKDQ1IGRlZ3JlZSlcbiAgICBzbG9wZSA9IDEuMDtcbiAgfVxuXG4gIHZhciBtb3ZlQnlZID0gc2xvcGUgKiBvdmVybGFwQW1vdW50WzBdO1xuICB2YXIgbW92ZUJ5WCA9IG92ZXJsYXBBbW91bnRbMV0gLyBzbG9wZTtcbiAgaWYgKG92ZXJsYXBBbW91bnRbMF0gPCBtb3ZlQnlYKVxuICB7XG4gICAgbW92ZUJ5WCA9IG92ZXJsYXBBbW91bnRbMF07XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgbW92ZUJ5WSA9IG92ZXJsYXBBbW91bnRbMV07XG4gIH1cbiAgLy8gcmV0dXJuIGhhbGYgdGhlIGFtb3VudCBzbyB0aGF0IGlmIGVhY2ggcmVjdGFuZ2xlIGlzIG1vdmVkIGJ5IHRoZXNlXG4gIC8vIGFtb3VudHMgaW4gb3Bwb3NpdGUgZGlyZWN0aW9ucywgb3ZlcmxhcCB3aWxsIGJlIHJlc29sdmVkXG4gIG92ZXJsYXBBbW91bnRbMF0gPSAtMSAqIGRpcmVjdGlvbnNbMF0gKiAoKG1vdmVCeVggLyAyKSArIHNlcGFyYXRpb25CdWZmZXIpO1xuICBvdmVybGFwQW1vdW50WzFdID0gLTEgKiBkaXJlY3Rpb25zWzFdICogKChtb3ZlQnlZIC8gMikgKyBzZXBhcmF0aW9uQnVmZmVyKTtcbn1cblxuSUdlb21ldHJ5LmRlY2lkZURpcmVjdGlvbnNGb3JPdmVybGFwcGluZ05vZGVzID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0QiwgZGlyZWN0aW9ucylcbntcbiAgaWYgKHJlY3RBLmdldENlbnRlclgoKSA8IHJlY3RCLmdldENlbnRlclgoKSlcbiAge1xuICAgIGRpcmVjdGlvbnNbMF0gPSAtMTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBkaXJlY3Rpb25zWzBdID0gMTtcbiAgfVxuXG4gIGlmIChyZWN0QS5nZXRDZW50ZXJZKCkgPCByZWN0Qi5nZXRDZW50ZXJZKCkpXG4gIHtcbiAgICBkaXJlY3Rpb25zWzFdID0gLTE7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgZGlyZWN0aW9uc1sxXSA9IDE7XG4gIH1cbn1cblxuSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbjIgPSBmdW5jdGlvbiAocmVjdEEsIHJlY3RCLCByZXN1bHQpXG57XG4gIC8vcmVzdWx0WzAtMV0gd2lsbCBjb250YWluIGNsaXBQb2ludCBvZiByZWN0QSwgcmVzdWx0WzItM10gd2lsbCBjb250YWluIGNsaXBQb2ludCBvZiByZWN0QlxuICB2YXIgcDF4ID0gcmVjdEEuZ2V0Q2VudGVyWCgpO1xuICB2YXIgcDF5ID0gcmVjdEEuZ2V0Q2VudGVyWSgpO1xuICB2YXIgcDJ4ID0gcmVjdEIuZ2V0Q2VudGVyWCgpO1xuICB2YXIgcDJ5ID0gcmVjdEIuZ2V0Q2VudGVyWSgpO1xuXG4gIC8vaWYgdHdvIHJlY3RhbmdsZXMgaW50ZXJzZWN0LCB0aGVuIGNsaXBwaW5nIHBvaW50cyBhcmUgY2VudGVyc1xuICBpZiAocmVjdEEuaW50ZXJzZWN0cyhyZWN0QikpXG4gIHtcbiAgICByZXN1bHRbMF0gPSBwMXg7XG4gICAgcmVzdWx0WzFdID0gcDF5O1xuICAgIHJlc3VsdFsyXSA9IHAyeDtcbiAgICByZXN1bHRbM10gPSBwMnk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLy92YXJpYWJsZXMgZm9yIHJlY3RBXG4gIHZhciB0b3BMZWZ0QXggPSByZWN0QS5nZXRYKCk7XG4gIHZhciB0b3BMZWZ0QXkgPSByZWN0QS5nZXRZKCk7XG4gIHZhciB0b3BSaWdodEF4ID0gcmVjdEEuZ2V0UmlnaHQoKTtcbiAgdmFyIGJvdHRvbUxlZnRBeCA9IHJlY3RBLmdldFgoKTtcbiAgdmFyIGJvdHRvbUxlZnRBeSA9IHJlY3RBLmdldEJvdHRvbSgpO1xuICB2YXIgYm90dG9tUmlnaHRBeCA9IHJlY3RBLmdldFJpZ2h0KCk7XG4gIHZhciBoYWxmV2lkdGhBID0gcmVjdEEuZ2V0V2lkdGhIYWxmKCk7XG4gIHZhciBoYWxmSGVpZ2h0QSA9IHJlY3RBLmdldEhlaWdodEhhbGYoKTtcbiAgLy92YXJpYWJsZXMgZm9yIHJlY3RCXG4gIHZhciB0b3BMZWZ0QnggPSByZWN0Qi5nZXRYKCk7XG4gIHZhciB0b3BMZWZ0QnkgPSByZWN0Qi5nZXRZKCk7XG4gIHZhciB0b3BSaWdodEJ4ID0gcmVjdEIuZ2V0UmlnaHQoKTtcbiAgdmFyIGJvdHRvbUxlZnRCeCA9IHJlY3RCLmdldFgoKTtcbiAgdmFyIGJvdHRvbUxlZnRCeSA9IHJlY3RCLmdldEJvdHRvbSgpO1xuICB2YXIgYm90dG9tUmlnaHRCeCA9IHJlY3RCLmdldFJpZ2h0KCk7XG4gIHZhciBoYWxmV2lkdGhCID0gcmVjdEIuZ2V0V2lkdGhIYWxmKCk7XG4gIHZhciBoYWxmSGVpZ2h0QiA9IHJlY3RCLmdldEhlaWdodEhhbGYoKTtcbiAgLy9mbGFnIHdoZXRoZXIgY2xpcHBpbmcgcG9pbnRzIGFyZSBmb3VuZFxuICB2YXIgY2xpcFBvaW50QUZvdW5kID0gZmFsc2U7XG4gIHZhciBjbGlwUG9pbnRCRm91bmQgPSBmYWxzZTtcblxuICAvLyBsaW5lIGlzIHZlcnRpY2FsXG4gIGlmIChwMXggPT0gcDJ4KVxuICB7XG4gICAgaWYgKHAxeSA+IHAyeSlcbiAgICB7XG4gICAgICByZXN1bHRbMF0gPSBwMXg7XG4gICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XG4gICAgICByZXN1bHRbMl0gPSBwMng7XG4gICAgICByZXN1bHRbM10gPSBib3R0b21MZWZ0Qnk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHAxeSA8IHAyeSlcbiAgICB7XG4gICAgICByZXN1bHRbMF0gPSBwMXg7XG4gICAgICByZXN1bHRbMV0gPSBib3R0b21MZWZ0QXk7XG4gICAgICByZXN1bHRbMl0gPSBwMng7XG4gICAgICByZXN1bHRbM10gPSB0b3BMZWZ0Qnk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAvL25vdCBsaW5lLCByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgLy8gbGluZSBpcyBob3Jpem9udGFsXG4gIGVsc2UgaWYgKHAxeSA9PSBwMnkpXG4gIHtcbiAgICBpZiAocDF4ID4gcDJ4KVxuICAgIHtcbiAgICAgIHJlc3VsdFswXSA9IHRvcExlZnRBeDtcbiAgICAgIHJlc3VsdFsxXSA9IHAxeTtcbiAgICAgIHJlc3VsdFsyXSA9IHRvcFJpZ2h0Qng7XG4gICAgICByZXN1bHRbM10gPSBwMnk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKHAxeCA8IHAyeClcbiAgICB7XG4gICAgICByZXN1bHRbMF0gPSB0b3BSaWdodEF4O1xuICAgICAgcmVzdWx0WzFdID0gcDF5O1xuICAgICAgcmVzdWx0WzJdID0gdG9wTGVmdEJ4O1xuICAgICAgcmVzdWx0WzNdID0gcDJ5O1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgLy9ub3QgdmFsaWQgbGluZSwgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGVsc2VcbiAge1xuICAgIC8vc2xvcGVzIG9mIHJlY3RBJ3MgYW5kIHJlY3RCJ3MgZGlhZ29uYWxzXG4gICAgdmFyIHNsb3BlQSA9IHJlY3RBLmhlaWdodCAvIHJlY3RBLndpZHRoO1xuICAgIHZhciBzbG9wZUIgPSByZWN0Qi5oZWlnaHQgLyByZWN0Qi53aWR0aDtcblxuICAgIC8vc2xvcGUgb2YgbGluZSBiZXR3ZWVuIGNlbnRlciBvZiByZWN0QSBhbmQgY2VudGVyIG9mIHJlY3RCXG4gICAgdmFyIHNsb3BlUHJpbWUgPSAocDJ5IC0gcDF5KSAvIChwMnggLSBwMXgpO1xuICAgIHZhciBjYXJkaW5hbERpcmVjdGlvbkE7XG4gICAgdmFyIGNhcmRpbmFsRGlyZWN0aW9uQjtcbiAgICB2YXIgdGVtcFBvaW50QXg7XG4gICAgdmFyIHRlbXBQb2ludEF5O1xuICAgIHZhciB0ZW1wUG9pbnRCeDtcbiAgICB2YXIgdGVtcFBvaW50Qnk7XG5cbiAgICAvL2RldGVybWluZSB3aGV0aGVyIGNsaXBwaW5nIHBvaW50IGlzIHRoZSBjb3JuZXIgb2Ygbm9kZUFcbiAgICBpZiAoKC1zbG9wZUEpID09IHNsb3BlUHJpbWUpXG4gICAge1xuICAgICAgaWYgKHAxeCA+IHAyeClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0WzBdID0gYm90dG9tTGVmdEF4O1xuICAgICAgICByZXN1bHRbMV0gPSBib3R0b21MZWZ0QXk7XG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFswXSA9IHRvcFJpZ2h0QXg7XG4gICAgICAgIHJlc3VsdFsxXSA9IHRvcExlZnRBeTtcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoc2xvcGVBID09IHNsb3BlUHJpbWUpXG4gICAge1xuICAgICAgaWYgKHAxeCA+IHAyeClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0WzBdID0gdG9wTGVmdEF4O1xuICAgICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFswXSA9IGJvdHRvbVJpZ2h0QXg7XG4gICAgICAgIHJlc3VsdFsxXSA9IGJvdHRvbUxlZnRBeTtcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL2RldGVybWluZSB3aGV0aGVyIGNsaXBwaW5nIHBvaW50IGlzIHRoZSBjb3JuZXIgb2Ygbm9kZUJcbiAgICBpZiAoKC1zbG9wZUIpID09IHNsb3BlUHJpbWUpXG4gICAge1xuICAgICAgaWYgKHAyeCA+IHAxeClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0WzJdID0gYm90dG9tTGVmdEJ4O1xuICAgICAgICByZXN1bHRbM10gPSBib3R0b21MZWZ0Qnk7XG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFsyXSA9IHRvcFJpZ2h0Qng7XG4gICAgICAgIHJlc3VsdFszXSA9IHRvcExlZnRCeTtcbiAgICAgICAgY2xpcFBvaW50QkZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoc2xvcGVCID09IHNsb3BlUHJpbWUpXG4gICAge1xuICAgICAgaWYgKHAyeCA+IHAxeClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0WzJdID0gdG9wTGVmdEJ4O1xuICAgICAgICByZXN1bHRbM10gPSB0b3BMZWZ0Qnk7XG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHJlc3VsdFsyXSA9IGJvdHRvbVJpZ2h0Qng7XG4gICAgICAgIHJlc3VsdFszXSA9IGJvdHRvbUxlZnRCeTtcbiAgICAgICAgY2xpcFBvaW50QkZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL2lmIGJvdGggY2xpcHBpbmcgcG9pbnRzIGFyZSBjb3JuZXJzXG4gICAgaWYgKGNsaXBQb2ludEFGb3VuZCAmJiBjbGlwUG9pbnRCRm91bmQpXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vZGV0ZXJtaW5lIENhcmRpbmFsIERpcmVjdGlvbiBvZiByZWN0YW5nbGVzXG4gICAgaWYgKHAxeCA+IHAyeClcbiAgICB7XG4gICAgICBpZiAocDF5ID4gcDJ5KVxuICAgICAge1xuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVBLCBzbG9wZVByaW1lLCA0KTtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKHNsb3BlQiwgc2xvcGVQcmltZSwgMik7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQSA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbigtc2xvcGVBLCBzbG9wZVByaW1lLCAzKTtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUIsIHNsb3BlUHJpbWUsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgaWYgKHAxeSA+IHAyeSlcbiAgICAgIHtcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25BID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUEsIHNsb3BlUHJpbWUsIDEpO1xuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkIgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oLXNsb3BlQiwgc2xvcGVQcmltZSwgMyk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQSA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbihzbG9wZUEsIHNsb3BlUHJpbWUsIDIpO1xuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkIgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVCLCBzbG9wZVByaW1lLCA0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jYWxjdWxhdGUgY2xpcHBpbmcgUG9pbnQgaWYgaXQgaXMgbm90IGZvdW5kIGJlZm9yZVxuICAgIGlmICghY2xpcFBvaW50QUZvdW5kKVxuICAgIHtcbiAgICAgIHN3aXRjaCAoY2FyZGluYWxEaXJlY3Rpb25BKVxuICAgICAge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgdGVtcFBvaW50QXkgPSB0b3BMZWZ0QXk7XG4gICAgICAgICAgdGVtcFBvaW50QXggPSBwMXggKyAoLWhhbGZIZWlnaHRBKSAvIHNsb3BlUHJpbWU7XG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XG4gICAgICAgICAgcmVzdWx0WzFdID0gdGVtcFBvaW50QXk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IGJvdHRvbVJpZ2h0QXg7XG4gICAgICAgICAgdGVtcFBvaW50QXkgPSBwMXkgKyBoYWxmV2lkdGhBICogc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHRlbXBQb2ludEF5ID0gYm90dG9tTGVmdEF5O1xuICAgICAgICAgIHRlbXBQb2ludEF4ID0gcDF4ICsgaGFsZkhlaWdodEEgLyBzbG9wZVByaW1lO1xuICAgICAgICAgIHJlc3VsdFswXSA9IHRlbXBQb2ludEF4O1xuICAgICAgICAgIHJlc3VsdFsxXSA9IHRlbXBQb2ludEF5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgdGVtcFBvaW50QXggPSBib3R0b21MZWZ0QXg7XG4gICAgICAgICAgdGVtcFBvaW50QXkgPSBwMXkgKyAoLWhhbGZXaWR0aEEpICogc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjbGlwUG9pbnRCRm91bmQpXG4gICAge1xuICAgICAgc3dpdGNoIChjYXJkaW5hbERpcmVjdGlvbkIpXG4gICAgICB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICB0ZW1wUG9pbnRCeSA9IHRvcExlZnRCeTtcbiAgICAgICAgICB0ZW1wUG9pbnRCeCA9IHAyeCArICgtaGFsZkhlaWdodEIpIC8gc2xvcGVQcmltZTtcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcbiAgICAgICAgICByZXN1bHRbM10gPSB0ZW1wUG9pbnRCeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gYm90dG9tUmlnaHRCeDtcbiAgICAgICAgICB0ZW1wUG9pbnRCeSA9IHAyeSArIGhhbGZXaWR0aEIgKiBzbG9wZVByaW1lO1xuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBib3R0b21MZWZ0Qnk7XG4gICAgICAgICAgdGVtcFBvaW50QnggPSBwMnggKyBoYWxmSGVpZ2h0QiAvIHNsb3BlUHJpbWU7XG4gICAgICAgICAgcmVzdWx0WzJdID0gdGVtcFBvaW50Qng7XG4gICAgICAgICAgcmVzdWx0WzNdID0gdGVtcFBvaW50Qnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICB0ZW1wUG9pbnRCeCA9IGJvdHRvbUxlZnRCeDtcbiAgICAgICAgICB0ZW1wUG9pbnRCeSA9IHAyeSArICgtaGFsZldpZHRoQikgKiBzbG9wZVByaW1lO1xuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbklHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbiA9IGZ1bmN0aW9uIChzbG9wZSwgc2xvcGVQcmltZSwgbGluZSlcbntcbiAgaWYgKHNsb3BlID4gc2xvcGVQcmltZSlcbiAge1xuICAgIHJldHVybiBsaW5lO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHJldHVybiAxICsgbGluZSAlIDQ7XG4gIH1cbn1cblxuSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChzMSwgczIsIGYxLCBmMilcbntcbiAgaWYgKGYyID09IG51bGwpIHtcbiAgICByZXR1cm4gSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbjIoczEsIHMyLCBmMSk7XG4gIH1cbiAgdmFyIHgxID0gczEueDtcbiAgdmFyIHkxID0gczEueTtcbiAgdmFyIHgyID0gczIueDtcbiAgdmFyIHkyID0gczIueTtcbiAgdmFyIHgzID0gZjEueDtcbiAgdmFyIHkzID0gZjEueTtcbiAgdmFyIHg0ID0gZjIueDtcbiAgdmFyIHk0ID0gZjIueTtcbiAgdmFyIHgsIHk7IC8vIGludGVyc2VjdGlvbiBwb2ludFxuICB2YXIgYTEsIGEyLCBiMSwgYjIsIGMxLCBjMjsgLy8gY29lZmZpY2llbnRzIG9mIGxpbmUgZXFucy5cbiAgdmFyIGRlbm9tO1xuXG4gIGExID0geTIgLSB5MTtcbiAgYjEgPSB4MSAtIHgyO1xuICBjMSA9IHgyICogeTEgLSB4MSAqIHkyOyAgLy8geyBhMSp4ICsgYjEqeSArIGMxID0gMCBpcyBsaW5lIDEgfVxuXG4gIGEyID0geTQgLSB5MztcbiAgYjIgPSB4MyAtIHg0O1xuICBjMiA9IHg0ICogeTMgLSB4MyAqIHk0OyAgLy8geyBhMip4ICsgYjIqeSArIGMyID0gMCBpcyBsaW5lIDIgfVxuXG4gIGRlbm9tID0gYTEgKiBiMiAtIGEyICogYjE7XG5cbiAgaWYgKGRlbm9tID09IDApXG4gIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHggPSAoYjEgKiBjMiAtIGIyICogYzEpIC8gZGVub207XG4gIHkgPSAoYTIgKiBjMSAtIGExICogYzIpIC8gZGVub207XG5cbiAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNlY3Rpb246IENsYXNzIENvbnN0YW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qKlxuICogU29tZSB1c2VmdWwgcHJlLWNhbGN1bGF0ZWQgY29uc3RhbnRzXG4gKi9cbklHZW9tZXRyeS5IQUxGX1BJID0gMC41ICogTWF0aC5QSTtcbklHZW9tZXRyeS5PTkVfQU5EX0hBTEZfUEkgPSAxLjUgKiBNYXRoLlBJO1xuSUdlb21ldHJ5LlRXT19QSSA9IDIuMCAqIE1hdGguUEk7XG5JR2VvbWV0cnkuVEhSRUVfUEkgPSAzLjAgKiBNYXRoLlBJO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElHZW9tZXRyeTtcbiIsImZ1bmN0aW9uIElNYXRoKCkge1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIHNpZ24gb2YgdGhlIGlucHV0IHZhbHVlLlxuICovXG5JTWF0aC5zaWduID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA+IDApXG4gIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICBlbHNlIGlmICh2YWx1ZSA8IDApXG4gIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuSU1hdGguZmxvb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGguY2VpbCh2YWx1ZSkgOiBNYXRoLmZsb29yKHZhbHVlKTtcbn1cblxuSU1hdGguY2VpbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5mbG9vcih2YWx1ZSkgOiBNYXRoLmNlaWwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IElNYXRoO1xuIiwiZnVuY3Rpb24gSW50ZWdlcigpIHtcbn1cblxuSW50ZWdlci5NQVhfVkFMVUUgPSAyMTQ3NDgzNjQ3O1xuSW50ZWdlci5NSU5fVkFMVUUgPSAtMjE0NzQ4MzY0ODtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlZ2VyO1xuIiwidmFyIExHcmFwaE9iamVjdCA9IHJlcXVpcmUoJy4vTEdyYXBoT2JqZWN0Jyk7XG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcblxuZnVuY3Rpb24gTEVkZ2Uoc291cmNlLCB0YXJnZXQsIHZFZGdlKSB7XG4gIExHcmFwaE9iamVjdC5jYWxsKHRoaXMsIHZFZGdlKTtcblxuICB0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldCA9IGZhbHNlO1xuICB0aGlzLnZHcmFwaE9iamVjdCA9IHZFZGdlO1xuICB0aGlzLmJlbmRwb2ludHMgPSBbXTtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xufVxuXG5MRWRnZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE9iamVjdC5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIExHcmFwaE9iamVjdCkge1xuICBMRWRnZVtwcm9wXSA9IExHcmFwaE9iamVjdFtwcm9wXTtcbn1cblxuTEVkZ2UucHJvdG90eXBlLmdldFNvdXJjZSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnNvdXJjZTtcbn07XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRUYXJnZXQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy50YXJnZXQ7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuaXNJbnRlckdyYXBoID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuaXNJbnRlckdyYXBoO1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxlbmd0aDtcbn07XG5cbkxFZGdlLnByb3RvdHlwZS5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQ7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuZ2V0QmVuZHBvaW50cyA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmJlbmRwb2ludHM7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuZ2V0TGNhID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubGNhO1xufTtcblxuTEVkZ2UucHJvdG90eXBlLmdldFNvdXJjZUluTGNhID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuc291cmNlSW5MY2E7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUuZ2V0VGFyZ2V0SW5MY2EgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy50YXJnZXRJbkxjYTtcbn07XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRPdGhlckVuZCA9IGZ1bmN0aW9uIChub2RlKVxue1xuICBpZiAodGhpcy5zb3VyY2UgPT09IG5vZGUpXG4gIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQ7XG4gIH1cbiAgZWxzZSBpZiAodGhpcy50YXJnZXQgPT09IG5vZGUpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2U7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgdGhyb3cgXCJOb2RlIGlzIG5vdCBpbmNpZGVudCB3aXRoIHRoaXMgZWRnZVwiO1xuICB9XG59XG5cbkxFZGdlLnByb3RvdHlwZS5nZXRPdGhlckVuZEluR3JhcGggPSBmdW5jdGlvbiAobm9kZSwgZ3JhcGgpXG57XG4gIHZhciBvdGhlckVuZCA9IHRoaXMuZ2V0T3RoZXJFbmQobm9kZSk7XG4gIHZhciByb290ID0gZ3JhcGguZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0Um9vdCgpO1xuXG4gIHdoaWxlICh0cnVlKVxuICB7XG4gICAgaWYgKG90aGVyRW5kLmdldE93bmVyKCkgPT0gZ3JhcGgpXG4gICAge1xuICAgICAgcmV0dXJuIG90aGVyRW5kO1xuICAgIH1cblxuICAgIGlmIChvdGhlckVuZC5nZXRPd25lcigpID09IHJvb3QpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgb3RoZXJFbmQgPSBvdGhlckVuZC5nZXRPd25lcigpLmdldFBhcmVudCgpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5MRWRnZS5wcm90b3R5cGUudXBkYXRlTGVuZ3RoID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGNsaXBQb2ludENvb3JkaW5hdGVzID0gbmV3IEFycmF5KDQpO1xuXG4gIHRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0ID1cbiAgICAgICAgICBJR2VvbWV0cnkuZ2V0SW50ZXJzZWN0aW9uKHRoaXMudGFyZ2V0LmdldFJlY3QoKSxcbiAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlLmdldFJlY3QoKSxcbiAgICAgICAgICAgICAgICAgIGNsaXBQb2ludENvb3JkaW5hdGVzKTtcblxuICBpZiAoIXRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0KVxuICB7XG4gICAgdGhpcy5sZW5ndGhYID0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbMF0gLSBjbGlwUG9pbnRDb29yZGluYXRlc1syXTtcbiAgICB0aGlzLmxlbmd0aFkgPSBjbGlwUG9pbnRDb29yZGluYXRlc1sxXSAtIGNsaXBQb2ludENvb3JkaW5hdGVzWzNdO1xuXG4gICAgaWYgKE1hdGguYWJzKHRoaXMubGVuZ3RoWCkgPCAxLjApXG4gICAge1xuICAgICAgdGhpcy5sZW5ndGhYID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFgpO1xuICAgIH1cblxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxlbmd0aFkpIDwgMS4wKVxuICAgIHtcbiAgICAgIHRoaXMubGVuZ3RoWSA9IElNYXRoLnNpZ24odGhpcy5sZW5ndGhZKTtcbiAgICB9XG5cbiAgICB0aGlzLmxlbmd0aCA9IE1hdGguc3FydChcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoWCAqIHRoaXMubGVuZ3RoWCArIHRoaXMubGVuZ3RoWSAqIHRoaXMubGVuZ3RoWSk7XG4gIH1cbn07XG5cbkxFZGdlLnByb3RvdHlwZS51cGRhdGVMZW5ndGhTaW1wbGUgPSBmdW5jdGlvbiAoKVxue1xuICB0aGlzLmxlbmd0aFggPSB0aGlzLnRhcmdldC5nZXRDZW50ZXJYKCkgLSB0aGlzLnNvdXJjZS5nZXRDZW50ZXJYKCk7XG4gIHRoaXMubGVuZ3RoWSA9IHRoaXMudGFyZ2V0LmdldENlbnRlclkoKSAtIHRoaXMuc291cmNlLmdldENlbnRlclkoKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhYKSA8IDEuMClcbiAge1xuICAgIHRoaXMubGVuZ3RoWCA9IElNYXRoLnNpZ24odGhpcy5sZW5ndGhYKTtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxlbmd0aFkpIDwgMS4wKVxuICB7XG4gICAgdGhpcy5sZW5ndGhZID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFkpO1xuICB9XG5cbiAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoXG4gICAgICAgICAgdGhpcy5sZW5ndGhYICogdGhpcy5sZW5ndGhYICsgdGhpcy5sZW5ndGhZICogdGhpcy5sZW5ndGhZKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMRWRnZTtcbiIsInZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcbnZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XG52YXIgUmVjdGFuZ2xlRCA9IHJlcXVpcmUoJy4vUmVjdGFuZ2xlRCcpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9Qb2ludCcpO1xudmFyIExpc3QgPSByZXF1aXJlKCdsaW5rZWRsaXN0LWpzJykuTGlzdDtcbnZhciBMYXlvdXQ7XG5cbmZ1bmN0aW9uIExHcmFwaChwYXJlbnQsIG9iajIsIHZHcmFwaCkge1xuICBMYXlvdXQgPSByZXF1aXJlKCcuL0xheW91dCcpO1xuICBMR3JhcGhPYmplY3QuY2FsbCh0aGlzLCB2R3JhcGgpO1xuICB0aGlzLmVzdGltYXRlZFNpemUgPSBJbnRlZ2VyLk1JTl9WQUxVRTtcbiAgdGhpcy5tYXJnaW4gPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFQSF9NQVJHSU47XG4gIHRoaXMuZWRnZXMgPSBbXTtcbiAgdGhpcy5ub2RlcyA9IFtdO1xuICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXG4gIGlmIChvYmoyICE9IG51bGwgJiYgb2JqMiBpbnN0YW5jZW9mIExHcmFwaE1hbmFnZXIpIHtcbiAgICB0aGlzLmdyYXBoTWFuYWdlciA9IG9iajI7XG4gIH1cbiAgZWxzZSBpZiAob2JqMiAhPSBudWxsICYmIG9iajIgaW5zdGFuY2VvZiBMYXlvdXQpIHtcbiAgICB0aGlzLmdyYXBoTWFuYWdlciA9IG9iajIuZ3JhcGhNYW5hZ2VyO1xuICB9XG59XG5cbkxHcmFwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE9iamVjdC5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGhPYmplY3QpIHtcbiAgTEdyYXBoW3Byb3BdID0gTEdyYXBoT2JqZWN0W3Byb3BdO1xufVxuXG5MR3JhcGgucHJvdG90eXBlLmdldE5vZGVzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5ub2Rlcztcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuZ2V0RWRnZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmVkZ2VzO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXI7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnBhcmVudDtcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxlZnQ7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmlnaHQ7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnRvcDtcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUuZ2V0Qm90dG9tID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuYm90dG9tO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmlzQ29ubmVjdGVkO1xufTtcblxuTEdyYXBoLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAob2JqMSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSkge1xuICBpZiAoc291cmNlTm9kZSA9PSBudWxsICYmIHRhcmdldE5vZGUgPT0gbnVsbCkge1xuICAgIHZhciBuZXdOb2RlID0gb2JqMTtcbiAgICBpZiAodGhpcy5ncmFwaE1hbmFnZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJHcmFwaCBoYXMgbm8gZ3JhcGggbWdyIVwiO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXROb2RlcygpLmluZGV4T2YobmV3Tm9kZSkgPiAtMSkge1xuICAgICAgdGhyb3cgXCJOb2RlIGFscmVhZHkgaW4gZ3JhcGghXCI7XG4gICAgfVxuICAgIG5ld05vZGUub3duZXIgPSB0aGlzO1xuICAgIHRoaXMuZ2V0Tm9kZXMoKS5wdXNoKG5ld05vZGUpO1xuXG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIG5ld0VkZ2UgPSBvYmoxO1xuICAgIGlmICghKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKHNvdXJjZU5vZGUpID4gLTEgJiYgKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKHRhcmdldE5vZGUpKSA+IC0xKSkge1xuICAgICAgdGhyb3cgXCJTb3VyY2Ugb3IgdGFyZ2V0IG5vdCBpbiBncmFwaCFcIjtcbiAgICB9XG5cbiAgICBpZiAoIShzb3VyY2VOb2RlLm93bmVyID09IHRhcmdldE5vZGUub3duZXIgJiYgc291cmNlTm9kZS5vd25lciA9PSB0aGlzKSkge1xuICAgICAgdGhyb3cgXCJCb3RoIG93bmVycyBtdXN0IGJlIHRoaXMgZ3JhcGghXCI7XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZU5vZGUub3duZXIgIT0gdGFyZ2V0Tm9kZS5vd25lcilcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBzZXQgc291cmNlIGFuZCB0YXJnZXRcbiAgICBuZXdFZGdlLnNvdXJjZSA9IHNvdXJjZU5vZGU7XG4gICAgbmV3RWRnZS50YXJnZXQgPSB0YXJnZXROb2RlO1xuXG4gICAgLy8gc2V0IGFzIGludHJhLWdyYXBoIGVkZ2VcbiAgICBuZXdFZGdlLmlzSW50ZXJHcmFwaCA9IGZhbHNlO1xuXG4gICAgLy8gYWRkIHRvIGdyYXBoIGVkZ2UgbGlzdFxuICAgIHRoaXMuZ2V0RWRnZXMoKS5wdXNoKG5ld0VkZ2UpO1xuXG4gICAgLy8gYWRkIHRvIGluY2lkZW5jeSBsaXN0c1xuICAgIHNvdXJjZU5vZGUuZWRnZXMucHVzaChuZXdFZGdlKTtcblxuICAgIGlmICh0YXJnZXROb2RlICE9IHNvdXJjZU5vZGUpXG4gICAge1xuICAgICAgdGFyZ2V0Tm9kZS5lZGdlcy5wdXNoKG5ld0VkZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdFZGdlO1xuICB9XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIG5vZGUgPSBvYmo7XG4gIGlmIChvYmogaW5zdGFuY2VvZiBMTm9kZSkge1xuICAgIGlmIChub2RlID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiTm9kZSBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAoIShub2RlLm93bmVyICE9IG51bGwgJiYgbm9kZS5vd25lciA9PSB0aGlzKSkge1xuICAgICAgdGhyb3cgXCJPd25lciBncmFwaCBpcyBpbnZhbGlkIVwiO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmFwaE1hbmFnZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJPd25lciBncmFwaCBtYW5hZ2VyIGlzIGludmFsaWQhXCI7XG4gICAgfVxuICAgIC8vIHJlbW92ZSBpbmNpZGVudCBlZGdlcyBmaXJzdCAobWFrZSBhIGNvcHkgdG8gZG8gaXQgc2FmZWx5KVxuICAgIHZhciBlZGdlc1RvQmVSZW1vdmVkID0gbm9kZS5lZGdlcy5zbGljZSgpO1xuICAgIHZhciBlZGdlO1xuICAgIHZhciBzID0gZWRnZXNUb0JlUmVtb3ZlZC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gICAge1xuICAgICAgZWRnZSA9IGVkZ2VzVG9CZVJlbW92ZWRbaV07XG5cbiAgICAgIGlmIChlZGdlLmlzSW50ZXJHcmFwaClcbiAgICAgIHtcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVtb3ZlKGVkZ2UpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICBlZGdlLnNvdXJjZS5vd25lci5yZW1vdmUoZWRnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbm93IHRoZSBub2RlIGl0c2VsZlxuICAgIHZhciBpbmRleCA9IHRoaXMubm9kZXMuaW5kZXhPZihub2RlKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgIHRocm93IFwiTm9kZSBub3QgaW4gb3duZXIgbm9kZSBsaXN0IVwiO1xuICAgIH1cblxuICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMRWRnZSkge1xuICAgIHZhciBlZGdlID0gb2JqO1xuICAgIGlmIChlZGdlID09IG51bGwpIHtcbiAgICAgIHRocm93IFwiRWRnZSBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAoIShlZGdlLnNvdXJjZSAhPSBudWxsICYmIGVkZ2UudGFyZ2V0ICE9IG51bGwpKSB7XG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGlzIG51bGwhXCI7XG4gICAgfVxuICAgIGlmICghKGVkZ2Uuc291cmNlLm93bmVyICE9IG51bGwgJiYgZWRnZS50YXJnZXQub3duZXIgIT0gbnVsbCAmJlxuICAgICAgICAgICAgZWRnZS5zb3VyY2Uub3duZXIgPT0gdGhpcyAmJiBlZGdlLnRhcmdldC5vd25lciA9PSB0aGlzKSkge1xuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBvd25lciBpcyBpbnZhbGlkIVwiO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VJbmRleCA9IGVkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YoZWRnZSk7XG4gICAgdmFyIHRhcmdldEluZGV4ID0gZWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihlZGdlKTtcbiAgICBpZiAoIShzb3VyY2VJbmRleCA+IC0xICYmIHRhcmdldEluZGV4ID4gLTEpKSB7XG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGRvZXNuJ3Qga25vdyB0aGlzIGVkZ2UhXCI7XG4gICAgfVxuXG4gICAgZWRnZS5zb3VyY2UuZWRnZXMuc3BsaWNlKHNvdXJjZUluZGV4LCAxKTtcblxuICAgIGlmIChlZGdlLnRhcmdldCAhPSBlZGdlLnNvdXJjZSlcbiAgICB7XG4gICAgICBlZGdlLnRhcmdldC5lZGdlcy5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IGVkZ2Uuc291cmNlLm93bmVyLmdldEVkZ2VzKCkuaW5kZXhPZihlZGdlKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgIHRocm93IFwiTm90IGluIG93bmVyJ3MgZWRnZSBsaXN0IVwiO1xuICAgIH1cblxuICAgIGVkZ2Uuc291cmNlLm93bmVyLmdldEVkZ2VzKCkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufTtcblxuTEdyYXBoLnByb3RvdHlwZS51cGRhdGVMZWZ0VG9wID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgbGVmdCA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgbm9kZVRvcDtcbiAgdmFyIG5vZGVMZWZ0O1xuICB2YXIgbWFyZ2luO1xuXG4gIHZhciBub2RlcyA9IHRoaXMuZ2V0Tm9kZXMoKTtcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXG4gIHtcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcbiAgICBub2RlVG9wID0gbE5vZGUuZ2V0VG9wKCk7XG4gICAgbm9kZUxlZnQgPSBsTm9kZS5nZXRMZWZ0KCk7XG5cbiAgICBpZiAodG9wID4gbm9kZVRvcClcbiAgICB7XG4gICAgICB0b3AgPSBub2RlVG9wO1xuICAgIH1cblxuICAgIGlmIChsZWZ0ID4gbm9kZUxlZnQpXG4gICAge1xuICAgICAgbGVmdCA9IG5vZGVMZWZ0O1xuICAgIH1cbiAgfVxuXG4gIC8vIERvIHdlIGhhdmUgYW55IG5vZGVzIGluIHRoaXMgZ3JhcGg/XG4gIGlmICh0b3AgPT0gSW50ZWdlci5NQVhfVkFMVUUpXG4gIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBcbiAgaWYobm9kZXNbMF0uZ2V0UGFyZW50KCkucGFkZGluZ0xlZnQgIT0gdW5kZWZpbmVkKXtcbiAgICBtYXJnaW4gPSBub2Rlc1swXS5nZXRQYXJlbnQoKS5wYWRkaW5nTGVmdDtcbiAgfVxuICBlbHNle1xuICAgIG1hcmdpbiA9IHRoaXMubWFyZ2luO1xuICB9XG5cbiAgdGhpcy5sZWZ0ID0gbGVmdCAtIG1hcmdpbjtcbiAgdGhpcy50b3AgPSB0b3AgLSBtYXJnaW47XG5cbiAgLy8gQXBwbHkgdGhlIG1hcmdpbnMgYW5kIHJldHVybiB0aGUgcmVzdWx0XG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy5sZWZ0LCB0aGlzLnRvcCk7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uIChyZWN1cnNpdmUpXG57XG4gIC8vIGNhbGN1bGF0ZSBib3VuZHNcbiAgdmFyIGxlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIHJpZ2h0ID0gLUludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgdG9wID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciBib3R0b20gPSAtSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciBub2RlTGVmdDtcbiAgdmFyIG5vZGVSaWdodDtcbiAgdmFyIG5vZGVUb3A7XG4gIHZhciBub2RlQm90dG9tO1xuICB2YXIgbWFyZ2luO1xuXG4gIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gIHZhciBzID0gbm9kZXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgaWYgKHJlY3Vyc2l2ZSAmJiBsTm9kZS5jaGlsZCAhPSBudWxsKVxuICAgIHtcbiAgICAgIGxOb2RlLnVwZGF0ZUJvdW5kcygpO1xuICAgIH1cbiAgICBub2RlTGVmdCA9IGxOb2RlLmdldExlZnQoKTtcbiAgICBub2RlUmlnaHQgPSBsTm9kZS5nZXRSaWdodCgpO1xuICAgIG5vZGVUb3AgPSBsTm9kZS5nZXRUb3AoKTtcbiAgICBub2RlQm90dG9tID0gbE5vZGUuZ2V0Qm90dG9tKCk7XG5cbiAgICBpZiAobGVmdCA+IG5vZGVMZWZ0KVxuICAgIHtcbiAgICAgIGxlZnQgPSBub2RlTGVmdDtcbiAgICB9XG5cbiAgICBpZiAocmlnaHQgPCBub2RlUmlnaHQpXG4gICAge1xuICAgICAgcmlnaHQgPSBub2RlUmlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKHRvcCA+IG5vZGVUb3ApXG4gICAge1xuICAgICAgdG9wID0gbm9kZVRvcDtcbiAgICB9XG5cbiAgICBpZiAoYm90dG9tIDwgbm9kZUJvdHRvbSlcbiAgICB7XG4gICAgICBib3R0b20gPSBub2RlQm90dG9tO1xuICAgIH1cbiAgfVxuXG4gIHZhciBib3VuZGluZ1JlY3QgPSBuZXcgUmVjdGFuZ2xlRChsZWZ0LCB0b3AsIHJpZ2h0IC0gbGVmdCwgYm90dG9tIC0gdG9wKTtcbiAgaWYgKGxlZnQgPT0gSW50ZWdlci5NQVhfVkFMVUUpXG4gIHtcbiAgICB0aGlzLmxlZnQgPSB0aGlzLnBhcmVudC5nZXRMZWZ0KCk7XG4gICAgdGhpcy5yaWdodCA9IHRoaXMucGFyZW50LmdldFJpZ2h0KCk7XG4gICAgdGhpcy50b3AgPSB0aGlzLnBhcmVudC5nZXRUb3AoKTtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMucGFyZW50LmdldEJvdHRvbSgpO1xuICB9XG4gIFxuICBpZihub2Rlc1swXS5nZXRQYXJlbnQoKS5wYWRkaW5nTGVmdCAhPSB1bmRlZmluZWQpe1xuICAgIG1hcmdpbiA9IG5vZGVzWzBdLmdldFBhcmVudCgpLnBhZGRpbmdMZWZ0O1xuICB9XG4gIGVsc2V7XG4gICAgbWFyZ2luID0gdGhpcy5tYXJnaW47XG4gIH1cblxuICB0aGlzLmxlZnQgPSBib3VuZGluZ1JlY3QueCAtIG1hcmdpbjtcbiAgdGhpcy5yaWdodCA9IGJvdW5kaW5nUmVjdC54ICsgYm91bmRpbmdSZWN0LndpZHRoICsgbWFyZ2luO1xuICB0aGlzLnRvcCA9IGJvdW5kaW5nUmVjdC55IC0gbWFyZ2luO1xuICB0aGlzLmJvdHRvbSA9IGJvdW5kaW5nUmVjdC55ICsgYm91bmRpbmdSZWN0LmhlaWdodCArIG1hcmdpbjtcbn07XG5cbkxHcmFwaC5jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAobm9kZXMpXG57XG4gIHZhciBsZWZ0ID0gSW50ZWdlci5NQVhfVkFMVUU7XG4gIHZhciByaWdodCA9IC1JbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgYm90dG9tID0gLUludGVnZXIuTUFYX1ZBTFVFO1xuICB2YXIgbm9kZUxlZnQ7XG4gIHZhciBub2RlUmlnaHQ7XG4gIHZhciBub2RlVG9wO1xuICB2YXIgbm9kZUJvdHRvbTtcblxuICB2YXIgcyA9IG5vZGVzLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xuICAgIG5vZGVMZWZ0ID0gbE5vZGUuZ2V0TGVmdCgpO1xuICAgIG5vZGVSaWdodCA9IGxOb2RlLmdldFJpZ2h0KCk7XG4gICAgbm9kZVRvcCA9IGxOb2RlLmdldFRvcCgpO1xuICAgIG5vZGVCb3R0b20gPSBsTm9kZS5nZXRCb3R0b20oKTtcblxuICAgIGlmIChsZWZ0ID4gbm9kZUxlZnQpXG4gICAge1xuICAgICAgbGVmdCA9IG5vZGVMZWZ0O1xuICAgIH1cblxuICAgIGlmIChyaWdodCA8IG5vZGVSaWdodClcbiAgICB7XG4gICAgICByaWdodCA9IG5vZGVSaWdodDtcbiAgICB9XG5cbiAgICBpZiAodG9wID4gbm9kZVRvcClcbiAgICB7XG4gICAgICB0b3AgPSBub2RlVG9wO1xuICAgIH1cblxuICAgIGlmIChib3R0b20gPCBub2RlQm90dG9tKVxuICAgIHtcbiAgICAgIGJvdHRvbSA9IG5vZGVCb3R0b207XG4gICAgfVxuICB9XG5cbiAgdmFyIGJvdW5kaW5nUmVjdCA9IG5ldyBSZWN0YW5nbGVEKGxlZnQsIHRvcCwgcmlnaHQgLSBsZWZ0LCBib3R0b20gLSB0b3ApO1xuXG4gIHJldHVybiBib3VuZGluZ1JlY3Q7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmdldEluY2x1c2lvblRyZWVEZXB0aCA9IGZ1bmN0aW9uICgpXG57XG4gIGlmICh0aGlzID09IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKSlcbiAge1xuICAgIHJldHVybiAxO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKTtcbiAgfVxufTtcblxuTEdyYXBoLnByb3RvdHlwZS5nZXRFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKClcbntcbiAgaWYgKHRoaXMuZXN0aW1hdGVkU2l6ZSA9PSBJbnRlZ2VyLk1JTl9WQUxVRSkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG4gIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemU7XG59O1xuXG5MR3JhcGgucHJvdG90eXBlLmNhbGNFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIHNpemUgPSAwO1xuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICB2YXIgcyA9IG5vZGVzLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xuICAgIHNpemUgKz0gbE5vZGUuY2FsY0VzdGltYXRlZFNpemUoKTtcbiAgfVxuXG4gIGlmIChzaXplID09IDApXG4gIHtcbiAgICB0aGlzLmVzdGltYXRlZFNpemUgPSBMYXlvdXRDb25zdGFudHMuRU1QVFlfQ09NUE9VTkRfTk9ERV9TSVpFO1xuICB9XG4gIGVsc2VcbiAge1xuICAgIHRoaXMuZXN0aW1hdGVkU2l6ZSA9IHNpemUgLyBNYXRoLnNxcnQodGhpcy5ub2Rlcy5sZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZTtcbn07XG5cbkxHcmFwaC5wcm90b3R5cGUudXBkYXRlQ29ubmVjdGVkID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAodGhpcy5ub2Rlcy5sZW5ndGggPT0gMClcbiAge1xuICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0b0JlVmlzaXRlZCA9IG5ldyBMaXN0KCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcbiAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5ub2Rlc1swXTtcbiAgdmFyIG5laWdoYm9yRWRnZXM7XG4gIHZhciBjdXJyZW50TmVpZ2hib3I7XG4gIHZhciBjaGlsZHJlbk9mTm9kZSA9IGN1cnJlbnROb2RlLndpdGhDaGlsZHJlbigpO1xuICBjaGlsZHJlbk9mTm9kZS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0b0JlVmlzaXRlZC5wdXNoKG5vZGUpO1xuICB9KTtcblxuICB3aGlsZSAoIXRvQmVWaXNpdGVkLmlzRW1wdHkoKSlcbiAge1xuICAgIGN1cnJlbnROb2RlID0gdG9CZVZpc2l0ZWQuc2hpZnQoKS52YWx1ZSgpO1xuICAgIHZpc2l0ZWQuYWRkKGN1cnJlbnROb2RlKTtcblxuICAgIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXG4gICAgbmVpZ2hib3JFZGdlcyA9IGN1cnJlbnROb2RlLmdldEVkZ2VzKCk7XG4gICAgdmFyIHMgPSBuZWlnaGJvckVkZ2VzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAgICB7XG4gICAgICB2YXIgbmVpZ2hib3JFZGdlID0gbmVpZ2hib3JFZGdlc1tpXTtcbiAgICAgIGN1cnJlbnROZWlnaGJvciA9XG4gICAgICAgICAgICAgIG5laWdoYm9yRWRnZS5nZXRPdGhlckVuZEluR3JhcGgoY3VycmVudE5vZGUsIHRoaXMpO1xuXG4gICAgICAvLyBBZGQgdW52aXNpdGVkIG5laWdoYm9ycyB0byB0aGUgbGlzdCB0byB2aXNpdFxuICAgICAgaWYgKGN1cnJlbnROZWlnaGJvciAhPSBudWxsICYmXG4gICAgICAgICAgICAgICF2aXNpdGVkLmNvbnRhaW5zKGN1cnJlbnROZWlnaGJvcikpXG4gICAgICB7XG4gICAgICAgIHZhciBjaGlsZHJlbk9mTmVpZ2hib3IgPSBjdXJyZW50TmVpZ2hib3Iud2l0aENoaWxkcmVuKCk7XG4gICAgICAgIFxuICAgICAgICBjaGlsZHJlbk9mTmVpZ2hib3IuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgdG9CZVZpc2l0ZWQucHVzaChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuXG4gIGlmICh2aXNpdGVkLnNpemUoKSA+PSB0aGlzLm5vZGVzLmxlbmd0aClcbiAge1xuICAgIHZhciBub09mVmlzaXRlZEluVGhpc0dyYXBoID0gMDtcbiAgICBcbiAgICB2YXIgcyA9IHZpc2l0ZWQuc2l6ZSgpO1xuICAgICBPYmplY3Qua2V5cyh2aXNpdGVkLnNldCkuZm9yRWFjaChmdW5jdGlvbih2aXNpdGVkSWQpIHtcbiAgICAgIHZhciB2aXNpdGVkTm9kZSA9IHZpc2l0ZWQuc2V0W3Zpc2l0ZWRJZF07XG4gICAgICBpZiAodmlzaXRlZE5vZGUub3duZXIgPT0gc2VsZilcbiAgICAgIHtcbiAgICAgICAgbm9PZlZpc2l0ZWRJblRoaXNHcmFwaCsrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG5vT2ZWaXNpdGVkSW5UaGlzR3JhcGggPT0gdGhpcy5ub2Rlcy5sZW5ndGgpXG4gICAge1xuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExHcmFwaDtcbiIsInZhciBMR3JhcGg7XG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XG5cbmZ1bmN0aW9uIExHcmFwaE1hbmFnZXIobGF5b3V0KSB7XG4gIExHcmFwaCA9IHJlcXVpcmUoJy4vTEdyYXBoJyk7IC8vIEl0IG1heSBiZSBiZXR0ZXIgdG8gaW5pdGlsaXplIHRoaXMgb3V0IG9mIHRoaXMgZnVuY3Rpb24gYnV0IGl0IGdpdmVzIGFuIGVycm9yIChSaWdodC1oYW5kIHNpZGUgb2YgJ2luc3RhbmNlb2YnIGlzIG5vdCBjYWxsYWJsZSkgbm93LlxuICB0aGlzLmxheW91dCA9IGxheW91dDtcblxuICB0aGlzLmdyYXBocyA9IFtdO1xuICB0aGlzLmVkZ2VzID0gW107XG59XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmFkZFJvb3QgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgbmdyYXBoID0gdGhpcy5sYXlvdXQubmV3R3JhcGgoKTtcbiAgdmFyIG5ub2RlID0gdGhpcy5sYXlvdXQubmV3Tm9kZShudWxsKTtcbiAgdmFyIHJvb3QgPSB0aGlzLmFkZChuZ3JhcGgsIG5ub2RlKTtcbiAgdGhpcy5zZXRSb290R3JhcGgocm9vdCk7XG4gIHJldHVybiB0aGlzLnJvb3RHcmFwaDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChuZXdHcmFwaCwgcGFyZW50Tm9kZSwgbmV3RWRnZSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSlcbntcbiAgLy90aGVyZSBhcmUganVzdCAyIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCB0aGVuIGl0IGFkZHMgYW4gTEdyYXBoIGVsc2UgaXQgYWRkcyBhbiBMRWRnZVxuICBpZiAobmV3RWRnZSA9PSBudWxsICYmIHNvdXJjZU5vZGUgPT0gbnVsbCAmJiB0YXJnZXROb2RlID09IG51bGwpIHtcbiAgICBpZiAobmV3R3JhcGggPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJHcmFwaCBpcyBudWxsIVwiO1xuICAgIH1cbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBcIlBhcmVudCBub2RlIGlzIG51bGwhXCI7XG4gICAgfVxuICAgIGlmICh0aGlzLmdyYXBocy5pbmRleE9mKG5ld0dyYXBoKSA+IC0xKSB7XG4gICAgICB0aHJvdyBcIkdyYXBoIGFscmVhZHkgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XG4gICAgfVxuXG4gICAgdGhpcy5ncmFwaHMucHVzaChuZXdHcmFwaCk7XG5cbiAgICBpZiAobmV3R3JhcGgucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHRocm93IFwiQWxyZWFkeSBoYXMgYSBwYXJlbnQhXCI7XG4gICAgfVxuICAgIGlmIChwYXJlbnROb2RlLmNoaWxkICE9IG51bGwpIHtcbiAgICAgIHRocm93ICBcIkFscmVhZHkgaGFzIGEgY2hpbGQhXCI7XG4gICAgfVxuXG4gICAgbmV3R3JhcGgucGFyZW50ID0gcGFyZW50Tm9kZTtcbiAgICBwYXJlbnROb2RlLmNoaWxkID0gbmV3R3JhcGg7XG5cbiAgICByZXR1cm4gbmV3R3JhcGg7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9jaGFuZ2UgdGhlIG9yZGVyIG9mIHRoZSBwYXJhbWV0ZXJzXG4gICAgdGFyZ2V0Tm9kZSA9IG5ld0VkZ2U7XG4gICAgc291cmNlTm9kZSA9IHBhcmVudE5vZGU7XG4gICAgbmV3RWRnZSA9IG5ld0dyYXBoO1xuICAgIHZhciBzb3VyY2VHcmFwaCA9IHNvdXJjZU5vZGUuZ2V0T3duZXIoKTtcbiAgICB2YXIgdGFyZ2V0R3JhcGggPSB0YXJnZXROb2RlLmdldE93bmVyKCk7XG5cbiAgICBpZiAoIShzb3VyY2VHcmFwaCAhPSBudWxsICYmIHNvdXJjZUdyYXBoLmdldEdyYXBoTWFuYWdlcigpID09IHRoaXMpKSB7XG4gICAgICB0aHJvdyBcIlNvdXJjZSBub3QgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XG4gICAgfVxuICAgIGlmICghKHRhcmdldEdyYXBoICE9IG51bGwgJiYgdGFyZ2V0R3JhcGguZ2V0R3JhcGhNYW5hZ2VyKCkgPT0gdGhpcykpIHtcbiAgICAgIHRocm93IFwiVGFyZ2V0IG5vdCBpbiB0aGlzIGdyYXBoIG1nciFcIjtcbiAgICB9XG5cbiAgICBpZiAoc291cmNlR3JhcGggPT0gdGFyZ2V0R3JhcGgpXG4gICAge1xuICAgICAgbmV3RWRnZS5pc0ludGVyR3JhcGggPSBmYWxzZTtcbiAgICAgIHJldHVybiBzb3VyY2VHcmFwaC5hZGQobmV3RWRnZSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICBuZXdFZGdlLmlzSW50ZXJHcmFwaCA9IHRydWU7XG5cbiAgICAgIC8vIHNldCBzb3VyY2UgYW5kIHRhcmdldFxuICAgICAgbmV3RWRnZS5zb3VyY2UgPSBzb3VyY2VOb2RlO1xuICAgICAgbmV3RWRnZS50YXJnZXQgPSB0YXJnZXROb2RlO1xuXG4gICAgICAvLyBhZGQgZWRnZSB0byBpbnRlci1ncmFwaCBlZGdlIGxpc3RcbiAgICAgIGlmICh0aGlzLmVkZ2VzLmluZGV4T2YobmV3RWRnZSkgPiAtMSkge1xuICAgICAgICB0aHJvdyBcIkVkZ2UgYWxyZWFkeSBpbiBpbnRlci1ncmFwaCBlZGdlIGxpc3QhXCI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWRnZXMucHVzaChuZXdFZGdlKTtcblxuICAgICAgLy8gYWRkIGVkZ2UgdG8gc291cmNlIGFuZCB0YXJnZXQgaW5jaWRlbmN5IGxpc3RzXG4gICAgICBpZiAoIShuZXdFZGdlLnNvdXJjZSAhPSBudWxsICYmIG5ld0VkZ2UudGFyZ2V0ICE9IG51bGwpKSB7XG4gICAgICAgIHRocm93IFwiRWRnZSBzb3VyY2UgYW5kL29yIHRhcmdldCBpcyBudWxsIVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoIShuZXdFZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKG5ld0VkZ2UpID09IC0xICYmIG5ld0VkZ2UudGFyZ2V0LmVkZ2VzLmluZGV4T2YobmV3RWRnZSkgPT0gLTEpKSB7XG4gICAgICAgIHRocm93IFwiRWRnZSBhbHJlYWR5IGluIHNvdXJjZSBhbmQvb3IgdGFyZ2V0IGluY2lkZW5jeSBsaXN0IVwiO1xuICAgICAgfVxuXG4gICAgICBuZXdFZGdlLnNvdXJjZS5lZGdlcy5wdXNoKG5ld0VkZ2UpO1xuICAgICAgbmV3RWRnZS50YXJnZXQuZWRnZXMucHVzaChuZXdFZGdlKTtcblxuICAgICAgcmV0dXJuIG5ld0VkZ2U7XG4gICAgfVxuICB9XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAobE9iaikge1xuICBpZiAobE9iaiBpbnN0YW5jZW9mIExHcmFwaCkge1xuICAgIHZhciBncmFwaCA9IGxPYmo7XG4gICAgaWYgKGdyYXBoLmdldEdyYXBoTWFuYWdlcigpICE9IHRoaXMpIHtcbiAgICAgIHRocm93IFwiR3JhcGggbm90IGluIHRoaXMgZ3JhcGggbWdyXCI7XG4gICAgfVxuICAgIGlmICghKGdyYXBoID09IHRoaXMucm9vdEdyYXBoIHx8IChncmFwaC5wYXJlbnQgIT0gbnVsbCAmJiBncmFwaC5wYXJlbnQuZ3JhcGhNYW5hZ2VyID09IHRoaXMpKSkge1xuICAgICAgdGhyb3cgXCJJbnZhbGlkIHBhcmVudCBub2RlIVwiO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IHRoZSBlZGdlcyAobWFrZSBhIGNvcHkgdG8gZG8gaXQgc2FmZWx5KVxuICAgIHZhciBlZGdlc1RvQmVSZW1vdmVkID0gW107XG5cbiAgICBlZGdlc1RvQmVSZW1vdmVkID0gZWRnZXNUb0JlUmVtb3ZlZC5jb25jYXQoZ3JhcGguZ2V0RWRnZXMoKSk7XG5cbiAgICB2YXIgZWRnZTtcbiAgICB2YXIgcyA9IGVkZ2VzVG9CZVJlbW92ZWQubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICAgIHtcbiAgICAgIGVkZ2UgPSBlZGdlc1RvQmVSZW1vdmVkW2ldO1xuICAgICAgZ3JhcGgucmVtb3ZlKGVkZ2UpO1xuICAgIH1cblxuICAgIC8vIHRoZW4gdGhlIG5vZGVzIChtYWtlIGEgY29weSB0byBkbyBpdCBzYWZlbHkpXG4gICAgdmFyIG5vZGVzVG9CZVJlbW92ZWQgPSBbXTtcblxuICAgIG5vZGVzVG9CZVJlbW92ZWQgPSBub2Rlc1RvQmVSZW1vdmVkLmNvbmNhdChncmFwaC5nZXROb2RlcygpKTtcblxuICAgIHZhciBub2RlO1xuICAgIHMgPSBub2Rlc1RvQmVSZW1vdmVkLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAgICB7XG4gICAgICBub2RlID0gbm9kZXNUb0JlUmVtb3ZlZFtpXTtcbiAgICAgIGdyYXBoLnJlbW92ZShub2RlKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBncmFwaCBpcyB0aGUgcm9vdFxuICAgIGlmIChncmFwaCA9PSB0aGlzLnJvb3RHcmFwaClcbiAgICB7XG4gICAgICB0aGlzLnNldFJvb3RHcmFwaChudWxsKTtcbiAgICB9XG5cbiAgICAvLyBub3cgcmVtb3ZlIHRoZSBncmFwaCBpdHNlbGZcbiAgICB2YXIgaW5kZXggPSB0aGlzLmdyYXBocy5pbmRleE9mKGdyYXBoKTtcbiAgICB0aGlzLmdyYXBocy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gYWxzbyByZXNldCB0aGUgcGFyZW50IG9mIHRoZSBncmFwaFxuICAgIGdyYXBoLnBhcmVudCA9IG51bGw7XG4gIH1cbiAgZWxzZSBpZiAobE9iaiBpbnN0YW5jZW9mIExFZGdlKSB7XG4gICAgZWRnZSA9IGxPYmo7XG4gICAgaWYgKGVkZ2UgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJFZGdlIGlzIG51bGwhXCI7XG4gICAgfVxuICAgIGlmICghZWRnZS5pc0ludGVyR3JhcGgpIHtcbiAgICAgIHRocm93IFwiTm90IGFuIGludGVyLWdyYXBoIGVkZ2UhXCI7XG4gICAgfVxuICAgIGlmICghKGVkZ2Uuc291cmNlICE9IG51bGwgJiYgZWRnZS50YXJnZXQgIT0gbnVsbCkpIHtcbiAgICAgIHRocm93IFwiU291cmNlIGFuZC9vciB0YXJnZXQgaXMgbnVsbCFcIjtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZWRnZSBmcm9tIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzJyBpbmNpZGVuY3kgbGlzdHNcblxuICAgIGlmICghKGVkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YoZWRnZSkgIT0gLTEgJiYgZWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihlZGdlKSAhPSAtMSkpIHtcbiAgICAgIHRocm93IFwiU291cmNlIGFuZC9vciB0YXJnZXQgZG9lc24ndCBrbm93IHRoaXMgZWRnZSFcIjtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSBlZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKGVkZ2UpO1xuICAgIGVkZ2Uuc291cmNlLmVkZ2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgaW5kZXggPSBlZGdlLnRhcmdldC5lZGdlcy5pbmRleE9mKGVkZ2UpO1xuICAgIGVkZ2UudGFyZ2V0LmVkZ2VzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyByZW1vdmUgZWRnZSBmcm9tIG93bmVyIGdyYXBoIG1hbmFnZXIncyBpbnRlci1ncmFwaCBlZGdlIGxpc3RcblxuICAgIGlmICghKGVkZ2Uuc291cmNlLm93bmVyICE9IG51bGwgJiYgZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkgIT0gbnVsbCkpIHtcbiAgICAgIHRocm93IFwiRWRnZSBvd25lciBncmFwaCBvciBvd25lciBncmFwaCBtYW5hZ2VyIGlzIG51bGwhXCI7XG4gICAgfVxuICAgIGlmIChlZGdlLnNvdXJjZS5vd25lci5nZXRHcmFwaE1hbmFnZXIoKS5lZGdlcy5pbmRleE9mKGVkZ2UpID09IC0xKSB7XG4gICAgICB0aHJvdyBcIk5vdCBpbiBvd25lciBncmFwaCBtYW5hZ2VyJ3MgZWRnZSBsaXN0IVwiO1xuICAgIH1cblxuICAgIHZhciBpbmRleCA9IGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpLmVkZ2VzLmluZGV4T2YoZWRnZSk7XG4gICAgZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkuZWRnZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUudXBkYXRlQm91bmRzID0gZnVuY3Rpb24gKClcbntcbiAgdGhpcy5yb290R3JhcGgudXBkYXRlQm91bmRzKHRydWUpO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0R3JhcGhzID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuZ3JhcGhzO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKVxue1xuICBpZiAodGhpcy5hbGxOb2RlcyA9PSBudWxsKVxuICB7XG4gICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgdmFyIGdyYXBocyA9IHRoaXMuZ2V0R3JhcGhzKCk7XG4gICAgdmFyIHMgPSBncmFwaHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICAgIHtcbiAgICAgIG5vZGVMaXN0ID0gbm9kZUxpc3QuY29uY2F0KGdyYXBoc1tpXS5nZXROb2RlcygpKTtcbiAgICB9XG4gICAgdGhpcy5hbGxOb2RlcyA9IG5vZGVMaXN0O1xuICB9XG4gIHJldHVybiB0aGlzLmFsbE5vZGVzO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVzZXRBbGxOb2RlcyA9IGZ1bmN0aW9uICgpXG57XG4gIHRoaXMuYWxsTm9kZXMgPSBudWxsO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVzZXRBbGxFZGdlcyA9IGZ1bmN0aW9uICgpXG57XG4gIHRoaXMuYWxsRWRnZXMgPSBudWxsO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVzZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpXG57XG4gIHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBudWxsO1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0QWxsRWRnZXMgPSBmdW5jdGlvbiAoKVxue1xuICBpZiAodGhpcy5hbGxFZGdlcyA9PSBudWxsKVxuICB7XG4gICAgdmFyIGVkZ2VMaXN0ID0gW107XG4gICAgdmFyIGdyYXBocyA9IHRoaXMuZ2V0R3JhcGhzKCk7XG4gICAgdmFyIHMgPSBncmFwaHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JhcGhzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGVkZ2VMaXN0ID0gZWRnZUxpc3QuY29uY2F0KGdyYXBoc1tpXS5nZXRFZGdlcygpKTtcbiAgICB9XG5cbiAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdCh0aGlzLmVkZ2VzKTtcblxuICAgIHRoaXMuYWxsRWRnZXMgPSBlZGdlTGlzdDtcbiAgfVxuICByZXR1cm4gdGhpcy5hbGxFZGdlcztcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb247XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uIChub2RlTGlzdClcbntcbiAgaWYgKHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gIT0gbnVsbCkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG5cbiAgdGhpcy5hbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IG5vZGVMaXN0O1xufTtcblxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0Um9vdCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnJvb3RHcmFwaDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnNldFJvb3RHcmFwaCA9IGZ1bmN0aW9uIChncmFwaClcbntcbiAgaWYgKGdyYXBoLmdldEdyYXBoTWFuYWdlcigpICE9IHRoaXMpIHtcbiAgICB0aHJvdyBcIlJvb3Qgbm90IGluIHRoaXMgZ3JhcGggbWdyIVwiO1xuICB9XG5cbiAgdGhpcy5yb290R3JhcGggPSBncmFwaDtcbiAgLy8gcm9vdCBncmFwaCBtdXN0IGhhdmUgYSByb290IG5vZGUgYXNzb2NpYXRlZCB3aXRoIGl0IGZvciBjb252ZW5pZW5jZVxuICBpZiAoZ3JhcGgucGFyZW50ID09IG51bGwpXG4gIHtcbiAgICBncmFwaC5wYXJlbnQgPSB0aGlzLmxheW91dC5uZXdOb2RlKFwiUm9vdCBub2RlXCIpO1xuICB9XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRMYXlvdXQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sYXlvdXQ7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5pc09uZUFuY2VzdG9yT2ZPdGhlciA9IGZ1bmN0aW9uIChmaXJzdE5vZGUsIHNlY29uZE5vZGUpXG57XG4gIGlmICghKGZpcnN0Tm9kZSAhPSBudWxsICYmIHNlY29uZE5vZGUgIT0gbnVsbCkpIHtcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbiAgfVxuXG4gIGlmIChmaXJzdE5vZGUgPT0gc2Vjb25kTm9kZSlcbiAge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8vIElzIHNlY29uZCBub2RlIGFuIGFuY2VzdG9yIG9mIHRoZSBmaXJzdCBvbmU/XG4gIHZhciBvd25lckdyYXBoID0gZmlyc3ROb2RlLmdldE93bmVyKCk7XG4gIHZhciBwYXJlbnROb2RlO1xuXG4gIGRvXG4gIHtcbiAgICBwYXJlbnROb2RlID0gb3duZXJHcmFwaC5nZXRQYXJlbnQoKTtcblxuICAgIGlmIChwYXJlbnROb2RlID09IG51bGwpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudE5vZGUgPT0gc2Vjb25kTm9kZSlcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBvd25lckdyYXBoID0gcGFyZW50Tm9kZS5nZXRPd25lcigpO1xuICAgIGlmIChvd25lckdyYXBoID09IG51bGwpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTtcbiAgLy8gSXMgZmlyc3Qgbm9kZSBhbiBhbmNlc3RvciBvZiB0aGUgc2Vjb25kIG9uZT9cbiAgb3duZXJHcmFwaCA9IHNlY29uZE5vZGUuZ2V0T3duZXIoKTtcblxuICBkb1xuICB7XG4gICAgcGFyZW50Tm9kZSA9IG93bmVyR3JhcGguZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKVxuICAgIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnROb2RlID09IGZpcnN0Tm9kZSlcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBvd25lckdyYXBoID0gcGFyZW50Tm9kZS5nZXRPd25lcigpO1xuICAgIGlmIChvd25lckdyYXBoID09IG51bGwpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTtcblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3JzID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIGVkZ2U7XG4gIHZhciBzb3VyY2VOb2RlO1xuICB2YXIgdGFyZ2V0Tm9kZTtcbiAgdmFyIHNvdXJjZUFuY2VzdG9yR3JhcGg7XG4gIHZhciB0YXJnZXRBbmNlc3RvckdyYXBoO1xuXG4gIHZhciBlZGdlcyA9IHRoaXMuZ2V0QWxsRWRnZXMoKTtcbiAgdmFyIHMgPSBlZGdlcy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICB7XG4gICAgZWRnZSA9IGVkZ2VzW2ldO1xuXG4gICAgc291cmNlTm9kZSA9IGVkZ2Uuc291cmNlO1xuICAgIHRhcmdldE5vZGUgPSBlZGdlLnRhcmdldDtcbiAgICBlZGdlLmxjYSA9IG51bGw7XG4gICAgZWRnZS5zb3VyY2VJbkxjYSA9IHNvdXJjZU5vZGU7XG4gICAgZWRnZS50YXJnZXRJbkxjYSA9IHRhcmdldE5vZGU7XG5cbiAgICBpZiAoc291cmNlTm9kZSA9PSB0YXJnZXROb2RlKVxuICAgIHtcbiAgICAgIGVkZ2UubGNhID0gc291cmNlTm9kZS5nZXRPd25lcigpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc291cmNlQW5jZXN0b3JHcmFwaCA9IHNvdXJjZU5vZGUuZ2V0T3duZXIoKTtcblxuICAgIHdoaWxlIChlZGdlLmxjYSA9PSBudWxsKVxuICAgIHtcbiAgICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXROb2RlOyAgXG4gICAgICB0YXJnZXRBbmNlc3RvckdyYXBoID0gdGFyZ2V0Tm9kZS5nZXRPd25lcigpO1xuXG4gICAgICB3aGlsZSAoZWRnZS5sY2EgPT0gbnVsbClcbiAgICAgIHtcbiAgICAgICAgaWYgKHRhcmdldEFuY2VzdG9yR3JhcGggPT0gc291cmNlQW5jZXN0b3JHcmFwaClcbiAgICAgICAge1xuICAgICAgICAgIGVkZ2UubGNhID0gdGFyZ2V0QW5jZXN0b3JHcmFwaDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRBbmNlc3RvckdyYXBoID09IHRoaXMucm9vdEdyYXBoKVxuICAgICAgICB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWRnZS5sY2EgIT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXRBbmNlc3RvckdyYXBoLmdldFBhcmVudCgpO1xuICAgICAgICB0YXJnZXRBbmNlc3RvckdyYXBoID0gZWRnZS50YXJnZXRJbkxjYS5nZXRPd25lcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc291cmNlQW5jZXN0b3JHcmFwaCA9PSB0aGlzLnJvb3RHcmFwaClcbiAgICAgIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChlZGdlLmxjYSA9PSBudWxsKVxuICAgICAge1xuICAgICAgICBlZGdlLnNvdXJjZUluTGNhID0gc291cmNlQW5jZXN0b3JHcmFwaC5nZXRQYXJlbnQoKTtcbiAgICAgICAgc291cmNlQW5jZXN0b3JHcmFwaCA9IGVkZ2Uuc291cmNlSW5MY2EuZ2V0T3duZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZWRnZS5sY2EgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XG4gICAgfVxuICB9XG59O1xuXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3IgPSBmdW5jdGlvbiAoZmlyc3ROb2RlLCBzZWNvbmROb2RlKVxue1xuICBpZiAoZmlyc3ROb2RlID09IHNlY29uZE5vZGUpXG4gIHtcbiAgICByZXR1cm4gZmlyc3ROb2RlLmdldE93bmVyKCk7XG4gIH1cbiAgdmFyIGZpcnN0T3duZXJHcmFwaCA9IGZpcnN0Tm9kZS5nZXRPd25lcigpO1xuXG4gIGRvXG4gIHtcbiAgICBpZiAoZmlyc3RPd25lckdyYXBoID09IG51bGwpXG4gICAge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHZhciBzZWNvbmRPd25lckdyYXBoID0gc2Vjb25kTm9kZS5nZXRPd25lcigpO1xuXG4gICAgZG9cbiAgICB7XG4gICAgICBpZiAoc2Vjb25kT3duZXJHcmFwaCA9PSBudWxsKVxuICAgICAge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHNlY29uZE93bmVyR3JhcGggPT0gZmlyc3RPd25lckdyYXBoKVxuICAgICAge1xuICAgICAgICByZXR1cm4gc2Vjb25kT3duZXJHcmFwaDtcbiAgICAgIH1cbiAgICAgIHNlY29uZE93bmVyR3JhcGggPSBzZWNvbmRPd25lckdyYXBoLmdldFBhcmVudCgpLmdldE93bmVyKCk7XG4gICAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgICBmaXJzdE93bmVyR3JhcGggPSBmaXJzdE93bmVyR3JhcGguZ2V0UGFyZW50KCkuZ2V0T3duZXIoKTtcbiAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgcmV0dXJuIGZpcnN0T3duZXJHcmFwaDtcbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmNhbGNJbmNsdXNpb25UcmVlRGVwdGhzID0gZnVuY3Rpb24gKGdyYXBoLCBkZXB0aCkge1xuICBpZiAoZ3JhcGggPT0gbnVsbCAmJiBkZXB0aCA9PSBudWxsKSB7XG4gICAgZ3JhcGggPSB0aGlzLnJvb3RHcmFwaDtcbiAgICBkZXB0aCA9IDE7XG4gIH1cbiAgdmFyIG5vZGU7XG5cbiAgdmFyIG5vZGVzID0gZ3JhcGguZ2V0Tm9kZXMoKTtcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxuICB7XG4gICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgIG5vZGUuaW5jbHVzaW9uVHJlZURlcHRoID0gZGVwdGg7XG5cbiAgICBpZiAobm9kZS5jaGlsZCAhPSBudWxsKVxuICAgIHtcbiAgICAgIHRoaXMuY2FsY0luY2x1c2lvblRyZWVEZXB0aHMobm9kZS5jaGlsZCwgZGVwdGggKyAxKTtcbiAgICB9XG4gIH1cbn07XG5cbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmluY2x1ZGVzSW52YWxpZEVkZ2UgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgZWRnZTtcblxuICB2YXIgcyA9IHRoaXMuZWRnZXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcbiAge1xuICAgIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldO1xuXG4gICAgaWYgKHRoaXMuaXNPbmVBbmNlc3Rvck9mT3RoZXIoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KSlcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGhNYW5hZ2VyO1xuIiwiZnVuY3Rpb24gTEdyYXBoT2JqZWN0KHZHcmFwaE9iamVjdCkge1xuICB0aGlzLnZHcmFwaE9iamVjdCA9IHZHcmFwaE9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGhPYmplY3Q7XG4iLCJ2YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG52YXIgUmVjdGFuZ2xlRCA9IHJlcXVpcmUoJy4vUmVjdGFuZ2xlRCcpO1xudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgUmFuZG9tU2VlZCA9IHJlcXVpcmUoJy4vUmFuZG9tU2VlZCcpO1xudmFyIFBvaW50RCA9IHJlcXVpcmUoJy4vUG9pbnREJyk7XG52YXIgSGFzaFNldCA9IHJlcXVpcmUoJy4vSGFzaFNldCcpO1xudmFyIExheW91dDtcblxuZnVuY3Rpb24gTE5vZGUoZ20sIGxvYywgc2l6ZSwgdk5vZGUpIHtcbiAgTGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcbiAgLy9BbHRlcm5hdGl2ZSBjb25zdHJ1Y3RvciAxIDogTE5vZGUoTEdyYXBoTWFuYWdlciBnbSwgUG9pbnQgbG9jLCBEaW1lbnNpb24gc2l6ZSwgT2JqZWN0IHZOb2RlKVxuICBpZiAoc2l6ZSA9PSBudWxsICYmIHZOb2RlID09IG51bGwpIHtcbiAgICB2Tm9kZSA9IGxvYztcbiAgfVxuXG4gIExHcmFwaE9iamVjdC5jYWxsKHRoaXMsIHZOb2RlKTtcblxuICAvL0FsdGVybmF0aXZlIGNvbnN0cnVjdG9yIDIgOiBMTm9kZShMYXlvdXQgbGF5b3V0LCBPYmplY3Qgdk5vZGUpXG4gIGlmIChnbSBpbnN0YW5jZW9mIExheW91dCAmJiBnbS5ncmFwaE1hbmFnZXIgIT0gbnVsbClcbiAgICBnbSA9IGdtLmdyYXBoTWFuYWdlcjtcblxuICB0aGlzLmVzdGltYXRlZFNpemUgPSBJbnRlZ2VyLk1JTl9WQUxVRTtcbiAgdGhpcy5pbmNsdXNpb25UcmVlRGVwdGggPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2Tm9kZTtcbiAgdGhpcy5lZGdlcyA9IFtdO1xuICB0aGlzLmdyYXBoTWFuYWdlciA9IGdtO1xuXG4gIGlmIChzaXplICE9IG51bGwgJiYgbG9jICE9IG51bGwpXG4gICAgdGhpcy5yZWN0ID0gbmV3IFJlY3RhbmdsZUQobG9jLngsIGxvYy55LCBzaXplLndpZHRoLCBzaXplLmhlaWdodCk7XG4gIGVsc2VcbiAgICB0aGlzLnJlY3QgPSBuZXcgUmVjdGFuZ2xlRCgpO1xufVxuXG5MTm9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE9iamVjdC5wcm90b3R5cGUpO1xuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGhPYmplY3QpIHtcbiAgTE5vZGVbcHJvcF0gPSBMR3JhcGhPYmplY3RbcHJvcF07XG59XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRFZGdlcyA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmVkZ2VzO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldENoaWxkID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuY2hpbGQ7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0T3duZXIgPSBmdW5jdGlvbiAoKVxue1xuLy8gIGlmICh0aGlzLm93bmVyICE9IG51bGwpIHtcbi8vICAgIGlmICghKHRoaXMub3duZXIgPT0gbnVsbCB8fCB0aGlzLm93bmVyLmdldE5vZGVzKCkuaW5kZXhPZih0aGlzKSA+IC0xKSkge1xuLy8gICAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcbi8vICAgIH1cbi8vICB9XG5cbiAgcmV0dXJuIHRoaXMub3duZXI7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LndpZHRoO1xufTtcblxuTE5vZGUucHJvdG90eXBlLnNldFdpZHRoID0gZnVuY3Rpb24gKHdpZHRoKVxue1xuICB0aGlzLnJlY3Qud2lkdGggPSB3aWR0aDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LmhlaWdodDtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0KVxue1xuICB0aGlzLnJlY3QuaGVpZ2h0ID0gaGVpZ2h0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldENlbnRlclggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LnggKyB0aGlzLnJlY3Qud2lkdGggLyAyO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldENlbnRlclkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0IC8gMjtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXIgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gbmV3IFBvaW50RCh0aGlzLnJlY3QueCArIHRoaXMucmVjdC53aWR0aCAvIDIsXG4gICAgICAgICAgdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0IC8gMik7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gbmV3IFBvaW50RCh0aGlzLnJlY3QueCwgdGhpcy5yZWN0LnkpO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldFJlY3QgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldERpYWdvbmFsID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnJlY3Qud2lkdGggKiB0aGlzLnJlY3Qud2lkdGggK1xuICAgICAgICAgIHRoaXMucmVjdC5oZWlnaHQgKiB0aGlzLnJlY3QuaGVpZ2h0KTtcbn07XG5cbkxOb2RlLnByb3RvdHlwZS5zZXRSZWN0ID0gZnVuY3Rpb24gKHVwcGVyTGVmdCwgZGltZW5zaW9uKVxue1xuICB0aGlzLnJlY3QueCA9IHVwcGVyTGVmdC54O1xuICB0aGlzLnJlY3QueSA9IHVwcGVyTGVmdC55O1xuICB0aGlzLnJlY3Qud2lkdGggPSBkaW1lbnNpb24ud2lkdGg7XG4gIHRoaXMucmVjdC5oZWlnaHQgPSBkaW1lbnNpb24uaGVpZ2h0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLnNldENlbnRlciA9IGZ1bmN0aW9uIChjeCwgY3kpXG57XG4gIHRoaXMucmVjdC54ID0gY3ggLSB0aGlzLnJlY3Qud2lkdGggLyAyO1xuICB0aGlzLnJlY3QueSA9IGN5IC0gdGhpcy5yZWN0LmhlaWdodCAvIDI7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuc2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoeCwgeSlcbntcbiAgdGhpcy5yZWN0LnggPSB4O1xuICB0aGlzLnJlY3QueSA9IHk7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUubW92ZUJ5ID0gZnVuY3Rpb24gKGR4LCBkeSlcbntcbiAgdGhpcy5yZWN0LnggKz0gZHg7XG4gIHRoaXMucmVjdC55ICs9IGR5O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldEVkZ2VMaXN0VG9Ob2RlID0gZnVuY3Rpb24gKHRvKVxue1xuICB2YXIgZWRnZUxpc3QgPSBbXTtcbiAgdmFyIGVkZ2U7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuICAgIFxuICAgIGlmIChlZGdlLnRhcmdldCA9PSB0bylcbiAgICB7XG4gICAgICBpZiAoZWRnZS5zb3VyY2UgIT0gc2VsZilcbiAgICAgICAgdGhyb3cgXCJJbmNvcnJlY3QgZWRnZSBzb3VyY2UhXCI7XG5cbiAgICAgIGVkZ2VMaXN0LnB1c2goZWRnZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWRnZUxpc3Q7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0RWRnZXNCZXR3ZWVuID0gZnVuY3Rpb24gKG90aGVyKVxue1xuICB2YXIgZWRnZUxpc3QgPSBbXTtcbiAgdmFyIGVkZ2U7XG4gIFxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG5cbiAgICBpZiAoIShlZGdlLnNvdXJjZSA9PSBzZWxmIHx8IGVkZ2UudGFyZ2V0ID09IHNlbGYpKVxuICAgICAgdGhyb3cgXCJJbmNvcnJlY3QgZWRnZSBzb3VyY2UgYW5kL29yIHRhcmdldFwiO1xuXG4gICAgaWYgKChlZGdlLnRhcmdldCA9PSBvdGhlcikgfHwgKGVkZ2Uuc291cmNlID09IG90aGVyKSlcbiAgICB7XG4gICAgICBlZGdlTGlzdC5wdXNoKGVkZ2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVkZ2VMaXN0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldE5laWdoYm9yc0xpc3QgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgbmVpZ2hib3JzID0gbmV3IEhhc2hTZXQoKTtcbiAgdmFyIGVkZ2U7XG4gIFxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYuZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XG5cbiAgICBpZiAoZWRnZS5zb3VyY2UgPT0gc2VsZilcbiAgICB7XG4gICAgICBuZWlnaGJvcnMuYWRkKGVkZ2UudGFyZ2V0KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGlmIChlZGdlLnRhcmdldCAhPSBzZWxmKSB7XG4gICAgICAgIHRocm93IFwiSW5jb3JyZWN0IGluY2lkZW5jeSFcIjtcbiAgICAgIH1cbiAgICBcbiAgICAgIG5laWdoYm9ycy5hZGQoZWRnZS5zb3VyY2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5laWdoYm9ycztcbn07XG5cbkxOb2RlLnByb3RvdHlwZS53aXRoQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgd2l0aE5laWdoYm9yc0xpc3QgPSBuZXcgU2V0KCk7XG4gIHZhciBjaGlsZE5vZGU7XG4gIHZhciBjaGlsZHJlbjtcblxuICB3aXRoTmVpZ2hib3JzTGlzdC5hZGQodGhpcyk7XG5cbiAgaWYgKHRoaXMuY2hpbGQgIT0gbnVsbClcbiAge1xuICAgIHZhciBub2RlcyA9IHRoaXMuY2hpbGQuZ2V0Tm9kZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGNoaWxkTm9kZSA9IG5vZGVzW2ldO1xuICAgICAgY2hpbGRyZW4gPSBjaGlsZE5vZGUud2l0aENoaWxkcmVuKCk7XG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgd2l0aE5laWdoYm9yc0xpc3QuYWRkKG5vZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdpdGhOZWlnaGJvcnNMaXN0O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldE5vT2ZDaGlsZHJlbiA9IGZ1bmN0aW9uICgpXG57XG4gIHZhciBub09mQ2hpbGRyZW4gPSAwO1xuICB2YXIgY2hpbGROb2RlO1xuXG4gIGlmKHRoaXMuY2hpbGQgPT0gbnVsbCl7XG4gICAgbm9PZkNoaWxkcmVuID0gMTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmNoaWxkLmdldE5vZGVzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBjaGlsZE5vZGUgPSBub2Rlc1tpXTtcblxuICAgICAgbm9PZkNoaWxkcmVuICs9IGNoaWxkTm9kZS5nZXROb09mQ2hpbGRyZW4oKTtcbiAgICB9XG4gIH1cbiAgXG4gIGlmKG5vT2ZDaGlsZHJlbiA9PSAwKXtcbiAgICBub09mQ2hpbGRyZW4gPSAxO1xuICB9XG4gIHJldHVybiBub09mQ2hpbGRyZW47XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0RXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZXN0aW1hdGVkU2l6ZSA9PSBJbnRlZ2VyLk1JTl9WQUxVRSkge1xuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xuICB9XG4gIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemU7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuY2FsY0VzdGltYXRlZFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmNoaWxkID09IG51bGwpXG4gIHtcbiAgICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplID0gKHRoaXMucmVjdC53aWR0aCArIHRoaXMucmVjdC5oZWlnaHQpIC8gMjtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICB0aGlzLmVzdGltYXRlZFNpemUgPSB0aGlzLmNoaWxkLmNhbGNFc3RpbWF0ZWRTaXplKCk7XG4gICAgdGhpcy5yZWN0LndpZHRoID0gdGhpcy5lc3RpbWF0ZWRTaXplO1xuICAgIHRoaXMucmVjdC5oZWlnaHQgPSB0aGlzLmVzdGltYXRlZFNpemU7XG5cbiAgICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplO1xuICB9XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuc2NhdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJhbmRvbUNlbnRlclg7XG4gIHZhciByYW5kb21DZW50ZXJZO1xuXG4gIHZhciBtaW5YID0gLUxheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xuICB2YXIgbWF4WCA9IExheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xuICByYW5kb21DZW50ZXJYID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9YICtcbiAgICAgICAgICAoUmFuZG9tU2VlZC5uZXh0RG91YmxlKCkgKiAobWF4WCAtIG1pblgpKSArIG1pblg7XG5cbiAgdmFyIG1pblkgPSAtTGF5b3V0Q29uc3RhbnRzLklOSVRJQUxfV09STERfQk9VTkRBUlk7XG4gIHZhciBtYXhZID0gTGF5b3V0Q29uc3RhbnRzLklOSVRJQUxfV09STERfQk9VTkRBUlk7XG4gIHJhbmRvbUNlbnRlclkgPSBMYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1kgK1xuICAgICAgICAgIChSYW5kb21TZWVkLm5leHREb3VibGUoKSAqIChtYXhZIC0gbWluWSkpICsgbWluWTtcblxuICB0aGlzLnJlY3QueCA9IHJhbmRvbUNlbnRlclg7XG4gIHRoaXMucmVjdC55ID0gcmFuZG9tQ2VudGVyWVxufTtcblxuTE5vZGUucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZ2V0Q2hpbGQoKSA9PSBudWxsKSB7XG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XG4gIH1cbiAgaWYgKHRoaXMuZ2V0Q2hpbGQoKS5nZXROb2RlcygpLmxlbmd0aCAhPSAwKVxuICB7XG4gICAgLy8gd3JhcCB0aGUgY2hpbGRyZW4gbm9kZXMgYnkgcmUtYXJyYW5naW5nIHRoZSBib3VuZGFyaWVzXG4gICAgdmFyIGNoaWxkR3JhcGggPSB0aGlzLmdldENoaWxkKCk7XG4gICAgY2hpbGRHcmFwaC51cGRhdGVCb3VuZHModHJ1ZSk7XG5cbiAgICB0aGlzLnJlY3QueCA9IGNoaWxkR3JhcGguZ2V0TGVmdCgpO1xuICAgIHRoaXMucmVjdC55ID0gY2hpbGRHcmFwaC5nZXRUb3AoKTtcblxuICAgIHRoaXMuc2V0V2lkdGgoY2hpbGRHcmFwaC5nZXRSaWdodCgpIC0gY2hpbGRHcmFwaC5nZXRMZWZ0KCkpO1xuICAgIHRoaXMuc2V0SGVpZ2h0KGNoaWxkR3JhcGguZ2V0Qm90dG9tKCkgLSBjaGlsZEdyYXBoLmdldFRvcCgpKTtcbiAgICBcbiAgICAvLyBVcGRhdGUgY29tcG91bmQgYm91bmRzIGNvbnNpZGVyaW5nIGl0cyBsYWJlbCBwcm9wZXJ0aWVzICAgIFxuICAgIGlmKExheW91dENvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMpe1xuICAgICAgICBcbiAgICAgIHZhciB3aWR0aCA9IGNoaWxkR3JhcGguZ2V0UmlnaHQoKSAtIGNoaWxkR3JhcGguZ2V0TGVmdCgpO1xuICAgICAgdmFyIGhlaWdodCA9IGNoaWxkR3JhcGguZ2V0Qm90dG9tKCkgLSBjaGlsZEdyYXBoLmdldFRvcCgpO1xuXG4gICAgICBpZih0aGlzLmxhYmVsV2lkdGggPiB3aWR0aCl7XG4gICAgICAgIHRoaXMucmVjdC54IC09ICh0aGlzLmxhYmVsV2lkdGggLSB3aWR0aCkgLyAyO1xuICAgICAgICB0aGlzLnNldFdpZHRoKHRoaXMubGFiZWxXaWR0aCk7XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMubGFiZWxIZWlnaHQgPiBoZWlnaHQpe1xuICAgICAgICBpZih0aGlzLmxhYmVsUG9zID09IFwiY2VudGVyXCIpe1xuICAgICAgICAgIHRoaXMucmVjdC55IC09ICh0aGlzLmxhYmVsSGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLmxhYmVsUG9zID09IFwidG9wXCIpe1xuICAgICAgICAgIHRoaXMucmVjdC55IC09ICh0aGlzLmxhYmVsSGVpZ2h0IC0gaGVpZ2h0KTsgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWlnaHQodGhpcy5sYWJlbEhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0SW5jbHVzaW9uVHJlZURlcHRoID0gZnVuY3Rpb24gKClcbntcbiAgaWYgKHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoID09IEludGVnZXIuTUFYX1ZBTFVFKSB7XG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoO1xufTtcblxuTE5vZGUucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0cmFucylcbntcbiAgdmFyIGxlZnQgPSB0aGlzLnJlY3QueDtcblxuICBpZiAobGVmdCA+IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWSlcbiAge1xuICAgIGxlZnQgPSBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlk7XG4gIH1cbiAgZWxzZSBpZiAobGVmdCA8IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXG4gIHtcbiAgICBsZWZ0ID0gLUxheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWTtcbiAgfVxuXG4gIHZhciB0b3AgPSB0aGlzLnJlY3QueTtcblxuICBpZiAodG9wID4gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxuICB7XG4gICAgdG9wID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xuICB9XG4gIGVsc2UgaWYgKHRvcCA8IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXG4gIHtcbiAgICB0b3AgPSAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xuICB9XG5cbiAgdmFyIGxlZnRUb3AgPSBuZXcgUG9pbnREKGxlZnQsIHRvcCk7XG4gIHZhciB2TGVmdFRvcCA9IHRyYW5zLmludmVyc2VUcmFuc2Zvcm1Qb2ludChsZWZ0VG9wKTtcblxuICB0aGlzLnNldExvY2F0aW9uKHZMZWZ0VG9wLngsIHZMZWZ0VG9wLnkpO1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0Lng7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5yZWN0LnggKyB0aGlzLnJlY3Qud2lkdGg7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMucmVjdC55O1xufTtcblxuTE5vZGUucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnJlY3QueSArIHRoaXMucmVjdC5oZWlnaHQ7XG59O1xuXG5MTm9kZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKClcbntcbiAgaWYgKHRoaXMub3duZXIgPT0gbnVsbClcbiAge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMub3duZXIuZ2V0UGFyZW50KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExOb2RlO1xuIiwidmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgSGFzaE1hcCA9IHJlcXVpcmUoJy4vSGFzaE1hcCcpO1xudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcbnZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xudmFyIFBvaW50RCA9IHJlcXVpcmUoJy4vUG9pbnREJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi9FbWl0dGVyJyk7XG52YXIgSGFzaFNldCA9IHJlcXVpcmUoJy4vSGFzaFNldCcpO1xuXG5mdW5jdGlvbiBMYXlvdXQoaXNSZW1vdGVVc2UpIHtcbiAgRW1pdHRlci5jYWxsKCB0aGlzICk7XG5cbiAgLy9MYXlvdXQgUXVhbGl0eTogMDpwcm9vZiwgMTpkZWZhdWx0LCAyOmRyYWZ0XG4gIHRoaXMubGF5b3V0UXVhbGl0eSA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX1FVQUxJVFk7XG4gIC8vV2hldGhlciBsYXlvdXQgc2hvdWxkIGNyZWF0ZSBiZW5kcG9pbnRzIGFzIG5lZWRlZCBvciBub3RcbiAgdGhpcy5jcmVhdGVCZW5kc0FzTmVlZGVkID1cbiAgICAgICAgICBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DUkVBVEVfQkVORFNfQVNfTkVFREVEO1xuICAvL1doZXRoZXIgbGF5b3V0IHNob3VsZCBiZSBpbmNyZW1lbnRhbCBvciBub3RcbiAgdGhpcy5pbmNyZW1lbnRhbCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMO1xuICAvL1doZXRoZXIgd2UgYW5pbWF0ZSBmcm9tIGJlZm9yZSB0byBhZnRlciBsYXlvdXQgbm9kZSBwb3NpdGlvbnNcbiAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9XG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX09OX0xBWU9VVDtcbiAgLy9XaGV0aGVyIHdlIGFuaW1hdGUgdGhlIGxheW91dCBwcm9jZXNzIG9yIG5vdFxuICB0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9EVVJJTkdfTEFZT1VUO1xuICAvL051bWJlciBpdGVyYXRpb25zIHRoYXQgc2hvdWxkIGJlIGRvbmUgYmV0d2VlbiB0d28gc3VjY2Vzc2l2ZSBhbmltYXRpb25zXG4gIHRoaXMuYW5pbWF0aW9uUGVyaW9kID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX1BFUklPRDtcbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IGxlYWYgbm9kZXMgKG5vbi1jb21wb3VuZCBub2RlcykgYXJlIG9mIHVuaWZvcm0gc2l6ZXMuIFdoZW5cbiAgICogdGhleSBhcmUsIGJvdGggc3ByaW5nIGFuZCByZXB1bHNpb24gZm9yY2VzIGJldHdlZW4gdHdvIGxlYWYgbm9kZXMgY2FuIGJlXG4gICAqIGNhbGN1bGF0ZWQgd2l0aG91dCB0aGUgZXhwZW5zaXZlIGNsaXBwaW5nIHBvaW50IGNhbGN1bGF0aW9ucywgcmVzdWx0aW5nXG4gICAqIGluIG1ham9yIHNwZWVkLXVwLlxuICAgKi9cbiAgdGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyA9XG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfVU5JRk9STV9MRUFGX05PREVfU0laRVM7XG4gIC8qKlxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGNyZWF0aW9uIG9mIGJlbmRwb2ludHMgYnkgdXNpbmcgZHVtbXkgbm9kZXMgYW5kIGVkZ2VzLlxuICAgKiBNYXBzIGFuIExFZGdlIHRvIGl0cyBkdW1teSBiZW5kcG9pbnQgcGF0aC5cbiAgICovXG4gIHRoaXMuZWRnZVRvRHVtbXlOb2RlcyA9IG5ldyBIYXNoTWFwKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gbmV3IExHcmFwaE1hbmFnZXIodGhpcyk7XG4gIHRoaXMuaXNMYXlvdXRGaW5pc2hlZCA9IGZhbHNlO1xuICB0aGlzLmlzU3ViTGF5b3V0ID0gZmFsc2U7XG4gIHRoaXMuaXNSZW1vdGVVc2UgPSBmYWxzZTtcblxuICBpZiAoaXNSZW1vdGVVc2UgIT0gbnVsbCkge1xuICAgIHRoaXMuaXNSZW1vdGVVc2UgPSBpc1JlbW90ZVVzZTtcbiAgfVxufVxuXG5MYXlvdXQuUkFORE9NX1NFRUQgPSAxO1xuXG5MYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggRW1pdHRlci5wcm90b3R5cGUgKTtcblxuTGF5b3V0LnByb3RvdHlwZS5nZXRHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlcjtcbn07XG5cbkxheW91dC5wcm90b3R5cGUuZ2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2RlcygpO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5nZXRBbGxFZGdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCk7XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUubmV3R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZ20gPSBuZXcgTEdyYXBoTWFuYWdlcih0aGlzKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcbiAgcmV0dXJuIGdtO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5uZXdHcmFwaCA9IGZ1bmN0aW9uICh2R3JhcGgpXG57XG4gIHJldHVybiBuZXcgTEdyYXBoKG51bGwsIHRoaXMuZ3JhcGhNYW5hZ2VyLCB2R3JhcGgpO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5uZXdOb2RlID0gZnVuY3Rpb24gKHZOb2RlKVxue1xuICByZXR1cm4gbmV3IExOb2RlKHRoaXMuZ3JhcGhNYW5hZ2VyLCB2Tm9kZSk7XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLm5ld0VkZ2UgPSBmdW5jdGlvbiAodkVkZ2UpXG57XG4gIHJldHVybiBuZXcgTEVkZ2UobnVsbCwgbnVsbCwgdkVkZ2UpO1xufTtcblxuTGF5b3V0LnByb3RvdHlwZS5jaGVja0xheW91dFN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICh0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkgPT0gbnVsbClcbiAgICAgICAgICB8fCB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKS5sZW5ndGggPT0gMFxuICAgICAgICAgIHx8IHRoaXMuZ3JhcGhNYW5hZ2VyLmluY2x1ZGVzSW52YWxpZEVkZ2UoKTtcbn07XG5cbkxheW91dC5wcm90b3R5cGUucnVuTGF5b3V0ID0gZnVuY3Rpb24gKClcbntcbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gZmFsc2U7XG4gIFxuICBpZiAodGhpcy50aWxpbmdQcmVMYXlvdXQpIHtcbiAgICB0aGlzLnRpbGluZ1ByZUxheW91dCgpO1xuICB9XG5cbiAgdGhpcy5pbml0UGFyYW1ldGVycygpO1xuICB2YXIgaXNMYXlvdXRTdWNjZXNzZnVsbDtcblxuICBpZiAodGhpcy5jaGVja0xheW91dFN1Y2Nlc3MoKSlcbiAge1xuICAgIGlzTGF5b3V0U3VjY2Vzc2Z1bGwgPSBmYWxzZTtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBpc0xheW91dFN1Y2Nlc3NmdWxsID0gdGhpcy5sYXlvdXQoKTtcbiAgfVxuICBcbiAgaWYgKExheW91dENvbnN0YW50cy5BTklNQVRFID09PSAnZHVyaW5nJykge1xuICAgIC8vIElmIHRoaXMgaXMgYSAnZHVyaW5nJyBsYXlvdXQgYW5pbWF0aW9uLiBMYXlvdXQgaXMgbm90IGZpbmlzaGVkIHlldC4gXG4gICAgLy8gV2UgbmVlZCB0byBwZXJmb3JtIHRoZXNlIGluIGluZGV4LmpzIHdoZW4gbGF5b3V0IGlzIHJlYWxseSBmaW5pc2hlZC5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIGlmIChpc0xheW91dFN1Y2Nlc3NmdWxsKVxuICB7XG4gICAgaWYgKCF0aGlzLmlzU3ViTGF5b3V0KVxuICAgIHtcbiAgICAgIHRoaXMuZG9Qb3N0TGF5b3V0KCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMudGlsaW5nUG9zdExheW91dCkge1xuICAgIHRoaXMudGlsaW5nUG9zdExheW91dCgpO1xuICB9XG5cbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gdHJ1ZTtcblxuICByZXR1cm4gaXNMYXlvdXRTdWNjZXNzZnVsbDtcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcGVyZm9ybXMgdGhlIG9wZXJhdGlvbnMgcmVxdWlyZWQgYWZ0ZXIgbGF5b3V0LlxuICovXG5MYXlvdXQucHJvdG90eXBlLmRvUG9zdExheW91dCA9IGZ1bmN0aW9uICgpXG57XG4gIC8vYXNzZXJ0ICFpc1N1YkxheW91dCA6IFwiU2hvdWxkIG5vdCBiZSBjYWxsZWQgb24gc3ViLWxheW91dCFcIjtcbiAgLy8gUHJvcGFnYXRlIGdlb21ldHJpYyBjaGFuZ2VzIHRvIHYtbGV2ZWwgb2JqZWN0c1xuICBpZighdGhpcy5pbmNyZW1lbnRhbCl7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgfVxuICB0aGlzLnVwZGF0ZSgpO1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCB1cGRhdGVzIHRoZSBnZW9tZXRyeSBvZiB0aGUgdGFyZ2V0IGdyYXBoIGFjY29yZGluZyB0b1xuICogY2FsY3VsYXRlZCBsYXlvdXQuXG4gKi9cbkxheW91dC5wcm90b3R5cGUudXBkYXRlMiA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gdXBkYXRlIGJlbmQgcG9pbnRzXG4gIGlmICh0aGlzLmNyZWF0ZUJlbmRzQXNOZWVkZWQpXG4gIHtcbiAgICB0aGlzLmNyZWF0ZUJlbmRwb2ludHNGcm9tRHVtbXlOb2RlcygpO1xuXG4gICAgLy8gcmVzZXQgYWxsIGVkZ2VzLCBzaW5jZSB0aGUgdG9wb2xvZ3kgaGFzIGNoYW5nZWRcbiAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbEVkZ2VzKCk7XG4gIH1cblxuICAvLyBwZXJmb3JtIGVkZ2UsIG5vZGUgYW5kIHJvb3QgdXBkYXRlcyBpZiBsYXlvdXQgaXMgbm90IGNhbGxlZFxuICAvLyByZW1vdGVseVxuICBpZiAoIXRoaXMuaXNSZW1vdGVVc2UpXG4gIHtcbiAgICAvLyB1cGRhdGUgYWxsIGVkZ2VzXG4gICAgdmFyIGVkZ2U7XG4gICAgdmFyIGFsbEVkZ2VzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsRWRnZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEVkZ2VzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGVkZ2UgPSBhbGxFZGdlc1tpXTtcbi8vICAgICAgdGhpcy51cGRhdGUoZWRnZSk7XG4gICAgfVxuXG4gICAgLy8gcmVjdXJzaXZlbHkgdXBkYXRlIG5vZGVzXG4gICAgdmFyIG5vZGU7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldE5vZGVzKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcbiAgICB7XG4gICAgICBub2RlID0gbm9kZXNbaV07XG4vLyAgICAgIHRoaXMudXBkYXRlKG5vZGUpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSByb290IGdyYXBoXG4gICAgdGhpcy51cGRhdGUodGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpKTtcbiAgfVxufTtcblxuTGF5b3V0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHRoaXMudXBkYXRlMigpO1xuICB9XG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIExOb2RlKSB7XG4gICAgdmFyIG5vZGUgPSBvYmo7XG4gICAgaWYgKG5vZGUuZ2V0Q2hpbGQoKSAhPSBudWxsKVxuICAgIHtcbiAgICAgIC8vIHNpbmNlIG5vZGUgaXMgY29tcG91bmQsIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBjaGlsZCBub2Rlc1xuICAgICAgdmFyIG5vZGVzID0gbm9kZS5nZXRDaGlsZCgpLmdldE5vZGVzKCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxuICAgICAge1xuICAgICAgICB1cGRhdGUobm9kZXNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBsLWxldmVsIG5vZGUgaXMgYXNzb2NpYXRlZCB3aXRoIGEgdi1sZXZlbCBncmFwaCBvYmplY3QsXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgbm9kZSBpbXBsZW1lbnRzIHRoZVxuICAgIC8vIGludGVyZmFjZSBVcGRhdGFibGUuXG4gICAgaWYgKG5vZGUudkdyYXBoT2JqZWN0ICE9IG51bGwpXG4gICAge1xuICAgICAgLy8gY2FzdCB0byBVcGRhdGFibGUgd2l0aG91dCBhbnkgdHlwZSBjaGVja1xuICAgICAgdmFyIHZOb2RlID0gbm9kZS52R3JhcGhPYmplY3Q7XG5cbiAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBtZXRob2Qgb2YgdGhlIGludGVyZmFjZVxuICAgICAgdk5vZGUudXBkYXRlKG5vZGUpO1xuICAgIH1cbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMRWRnZSkge1xuICAgIHZhciBlZGdlID0gb2JqO1xuICAgIC8vIGlmIHRoZSBsLWxldmVsIGVkZ2UgaXMgYXNzb2NpYXRlZCB3aXRoIGEgdi1sZXZlbCBncmFwaCBvYmplY3QsXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgZWRnZSBpbXBsZW1lbnRzIHRoZVxuICAgIC8vIGludGVyZmFjZSBVcGRhdGFibGUuXG5cbiAgICBpZiAoZWRnZS52R3JhcGhPYmplY3QgIT0gbnVsbClcbiAgICB7XG4gICAgICAvLyBjYXN0IHRvIFVwZGF0YWJsZSB3aXRob3V0IGFueSB0eXBlIGNoZWNrXG4gICAgICB2YXIgdkVkZ2UgPSBlZGdlLnZHcmFwaE9iamVjdDtcblxuICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCBvZiB0aGUgaW50ZXJmYWNlXG4gICAgICB2RWRnZS51cGRhdGUoZWRnZSk7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIExHcmFwaCkge1xuICAgIHZhciBncmFwaCA9IG9iajtcbiAgICAvLyBpZiB0aGUgbC1sZXZlbCBncmFwaCBpcyBhc3NvY2lhdGVkIHdpdGggYSB2LWxldmVsIGdyYXBoIG9iamVjdCxcbiAgICAvLyB0aGVuIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgdi1sZXZlbCBvYmplY3QgaW1wbGVtZW50cyB0aGVcbiAgICAvLyBpbnRlcmZhY2UgVXBkYXRhYmxlLlxuXG4gICAgaWYgKGdyYXBoLnZHcmFwaE9iamVjdCAhPSBudWxsKVxuICAgIHtcbiAgICAgIC8vIGNhc3QgdG8gVXBkYXRhYmxlIHdpdGhvdXQgYW55IHR5cGUgY2hlY2tcbiAgICAgIHZhciB2R3JhcGggPSBncmFwaC52R3JhcGhPYmplY3Q7XG5cbiAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBtZXRob2Qgb2YgdGhlIGludGVyZmFjZVxuICAgICAgdkdyYXBoLnVwZGF0ZShncmFwaCk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gc2V0IGFsbCBsYXlvdXQgcGFyYW1ldGVycyB0byBkZWZhdWx0IHZhbHVlc1xuICogZGV0ZXJtaW5lZCBhdCBjb21waWxlIHRpbWUuXG4gKi9cbkxheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5pc1N1YkxheW91dClcbiAge1xuICAgIHRoaXMubGF5b3V0UXVhbGl0eSA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX1FVQUxJVFk7XG4gICAgdGhpcy5hbmltYXRpb25EdXJpbmdMYXlvdXQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVDtcbiAgICB0aGlzLmFuaW1hdGlvblBlcmlvZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9QRVJJT0Q7XG4gICAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9PTl9MQVlPVVQ7XG4gICAgdGhpcy5pbmNyZW1lbnRhbCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMO1xuICAgIHRoaXMuY3JlYXRlQmVuZHNBc05lZWRlZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQ7XG4gICAgdGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX1VOSUZPUk1fTEVBRl9OT0RFX1NJWkVTO1xuICB9XG5cbiAgaWYgKHRoaXMuYW5pbWF0aW9uRHVyaW5nTGF5b3V0KVxuICB7XG4gICAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9IGZhbHNlO1xuICB9XG59O1xuXG5MYXlvdXQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChuZXdMZWZ0VG9wKSB7XG4gIGlmIChuZXdMZWZ0VG9wID09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMudHJhbnNmb3JtKG5ldyBQb2ludEQoMCwgMCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIGNyZWF0ZSBhIHRyYW5zZm9ybWF0aW9uIG9iamVjdCAoZnJvbSBFY2xpcHNlIHRvIGxheW91dCkuIFdoZW4gYW5cbiAgICAvLyBpbnZlcnNlIHRyYW5zZm9ybSBpcyBhcHBsaWVkLCB3ZSBnZXQgdXBwZXItbGVmdCBjb29yZGluYXRlIG9mIHRoZVxuICAgIC8vIGRyYXdpbmcgb3IgdGhlIHJvb3QgZ3JhcGggYXQgZ2l2ZW4gaW5wdXQgY29vcmRpbmF0ZSAoc29tZSBtYXJnaW5zXG4gICAgLy8gYWxyZWFkeSBpbmNsdWRlZCBpbiBjYWxjdWxhdGlvbiBvZiBsZWZ0LXRvcCkuXG5cbiAgICB2YXIgdHJhbnMgPSBuZXcgVHJhbnNmb3JtKCk7XG4gICAgdmFyIGxlZnRUb3AgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkudXBkYXRlTGVmdFRvcCgpO1xuXG4gICAgaWYgKGxlZnRUb3AgIT0gbnVsbClcbiAgICB7XG4gICAgICB0cmFucy5zZXRXb3JsZE9yZ1gobmV3TGVmdFRvcC54KTtcbiAgICAgIHRyYW5zLnNldFdvcmxkT3JnWShuZXdMZWZ0VG9wLnkpO1xuXG4gICAgICB0cmFucy5zZXREZXZpY2VPcmdYKGxlZnRUb3AueCk7XG4gICAgICB0cmFucy5zZXREZXZpY2VPcmdZKGxlZnRUb3AueSk7XG5cbiAgICAgIHZhciBub2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXMoKTtcbiAgICAgIHZhciBub2RlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxuICAgICAge1xuICAgICAgICBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIG5vZGUudHJhbnNmb3JtKHRyYW5zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkxheW91dC5wcm90b3R5cGUucG9zaXRpb25Ob2Rlc1JhbmRvbWx5ID0gZnVuY3Rpb24gKGdyYXBoKSB7XG5cbiAgaWYgKGdyYXBoID09IHVuZGVmaW5lZCkge1xuICAgIC8vYXNzZXJ0ICF0aGlzLmluY3JlbWVudGFsO1xuICAgIHRoaXMucG9zaXRpb25Ob2Rlc1JhbmRvbWx5KHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0Um9vdCgpKTtcbiAgICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKS51cGRhdGVCb3VuZHModHJ1ZSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIGxOb2RlO1xuICAgIHZhciBjaGlsZEdyYXBoO1xuXG4gICAgdmFyIG5vZGVzID0gZ3JhcGguZ2V0Tm9kZXMoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIGxOb2RlID0gbm9kZXNbaV07XG4gICAgICBjaGlsZEdyYXBoID0gbE5vZGUuZ2V0Q2hpbGQoKTtcblxuICAgICAgaWYgKGNoaWxkR3JhcGggPT0gbnVsbClcbiAgICAgIHtcbiAgICAgICAgbE5vZGUuc2NhdHRlcigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2hpbGRHcmFwaC5nZXROb2RlcygpLmxlbmd0aCA9PSAwKVxuICAgICAge1xuICAgICAgICBsTm9kZS5zY2F0dGVyKCk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIHRoaXMucG9zaXRpb25Ob2Rlc1JhbmRvbWx5KGNoaWxkR3JhcGgpO1xuICAgICAgICBsTm9kZS51cGRhdGVCb3VuZHMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIGxpc3Qgb2YgdHJlZXMgd2hlcmUgZWFjaCB0cmVlIGlzIHJlcHJlc2VudGVkIGFzIGFcbiAqIGxpc3Qgb2YgbC1ub2Rlcy4gVGhlIG1ldGhvZCByZXR1cm5zIGEgbGlzdCBvZiBzaXplIDAgd2hlbjpcbiAqIC0gVGhlIGdyYXBoIGlzIG5vdCBmbGF0IG9yXG4gKiAtIE9uZSBvZiB0aGUgY29tcG9uZW50KHMpIG9mIHRoZSBncmFwaCBpcyBub3QgYSB0cmVlLlxuICovXG5MYXlvdXQucHJvdG90eXBlLmdldEZsYXRGb3Jlc3QgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgZmxhdEZvcmVzdCA9IFtdO1xuICB2YXIgaXNGb3Jlc3QgPSB0cnVlO1xuXG4gIC8vIFF1aWNrIHJlZmVyZW5jZSBmb3IgYWxsIG5vZGVzIGluIHRoZSBncmFwaCBtYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aFxuICAvLyB0aGlzIGxheW91dC4gVGhlIGxpc3Qgc2hvdWxkIG5vdCBiZSBjaGFuZ2VkLlxuICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKTtcblxuICAvLyBGaXJzdCBiZSBzdXJlIHRoYXQgdGhlIGdyYXBoIGlzIGZsYXRcbiAgdmFyIGlzRmxhdCA9IHRydWU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIGlmIChhbGxOb2Rlc1tpXS5nZXRDaGlsZCgpICE9IG51bGwpXG4gICAge1xuICAgICAgaXNGbGF0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIGVtcHR5IGZvcmVzdCBpZiB0aGUgZ3JhcGggaXMgbm90IGZsYXQuXG4gIGlmICghaXNGbGF0KVxuICB7XG4gICAgcmV0dXJuIGZsYXRGb3Jlc3Q7XG4gIH1cblxuICAvLyBSdW4gQkZTIGZvciBlYWNoIGNvbXBvbmVudCBvZiB0aGUgZ3JhcGguXG5cbiAgdmFyIHZpc2l0ZWQgPSBuZXcgSGFzaFNldCgpO1xuICB2YXIgdG9CZVZpc2l0ZWQgPSBbXTtcbiAgdmFyIHBhcmVudHMgPSBuZXcgSGFzaE1hcCgpO1xuICB2YXIgdW5Qcm9jZXNzZWROb2RlcyA9IFtdO1xuXG4gIHVuUHJvY2Vzc2VkTm9kZXMgPSB1blByb2Nlc3NlZE5vZGVzLmNvbmNhdChhbGxOb2Rlcyk7XG5cbiAgLy8gRWFjaCBpdGVyYXRpb24gb2YgdGhpcyBsb29wIGZpbmRzIGEgY29tcG9uZW50IG9mIHRoZSBncmFwaCBhbmRcbiAgLy8gZGVjaWRlcyB3aGV0aGVyIGl0IGlzIGEgdHJlZSBvciBub3QuIElmIGl0IGlzIGEgdHJlZSwgYWRkcyBpdCB0byB0aGVcbiAgLy8gZm9yZXN0IGFuZCBjb250aW51ZWQgd2l0aCB0aGUgbmV4dCBjb21wb25lbnQuXG5cbiAgd2hpbGUgKHVuUHJvY2Vzc2VkTm9kZXMubGVuZ3RoID4gMCAmJiBpc0ZvcmVzdClcbiAge1xuICAgIHRvQmVWaXNpdGVkLnB1c2godW5Qcm9jZXNzZWROb2Rlc1swXSk7XG5cbiAgICAvLyBTdGFydCB0aGUgQkZTLiBFYWNoIGl0ZXJhdGlvbiBvZiB0aGlzIGxvb3AgdmlzaXRzIGEgbm9kZSBpbiBhXG4gICAgLy8gQkZTIG1hbm5lci5cbiAgICB3aGlsZSAodG9CZVZpc2l0ZWQubGVuZ3RoID4gMCAmJiBpc0ZvcmVzdClcbiAgICB7XG4gICAgICAvL3Bvb2wgb3BlcmF0aW9uXG4gICAgICB2YXIgY3VycmVudE5vZGUgPSB0b0JlVmlzaXRlZFswXTtcbiAgICAgIHRvQmVWaXNpdGVkLnNwbGljZSgwLCAxKTtcbiAgICAgIHZpc2l0ZWQuYWRkKGN1cnJlbnROb2RlKTtcblxuICAgICAgLy8gVHJhdmVyc2UgYWxsIG5laWdoYm9ycyBvZiB0aGlzIG5vZGVcbiAgICAgIHZhciBuZWlnaGJvckVkZ2VzID0gY3VycmVudE5vZGUuZ2V0RWRnZXMoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWlnaGJvckVkZ2VzLmxlbmd0aDsgaSsrKVxuICAgICAge1xuICAgICAgICB2YXIgY3VycmVudE5laWdoYm9yID1cbiAgICAgICAgICAgICAgICBuZWlnaGJvckVkZ2VzW2ldLmdldE90aGVyRW5kKGN1cnJlbnROb2RlKTtcblxuICAgICAgICAvLyBJZiBCRlMgaXMgbm90IGdyb3dpbmcgZnJvbSB0aGlzIG5laWdoYm9yLlxuICAgICAgICBpZiAocGFyZW50cy5nZXQoY3VycmVudE5vZGUpICE9IGN1cnJlbnROZWlnaGJvcilcbiAgICAgICAge1xuICAgICAgICAgIC8vIFdlIGhhdmVuJ3QgcHJldmlvdXNseSB2aXNpdGVkIHRoaXMgbmVpZ2hib3IuXG4gICAgICAgICAgaWYgKCF2aXNpdGVkLmNvbnRhaW5zKGN1cnJlbnROZWlnaGJvcikpXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9CZVZpc2l0ZWQucHVzaChjdXJyZW50TmVpZ2hib3IpO1xuICAgICAgICAgICAgcGFyZW50cy5wdXQoY3VycmVudE5laWdoYm9yLCBjdXJyZW50Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFNpbmNlIHdlIGhhdmUgcHJldmlvdXNseSB2aXNpdGVkIHRoaXMgbmVpZ2hib3IgYW5kXG4gICAgICAgICAgLy8gdGhpcyBuZWlnaGJvciBpcyBub3QgcGFyZW50IG9mIGN1cnJlbnROb2RlLCBnaXZlblxuICAgICAgICAgIC8vIGdyYXBoIGNvbnRhaW5zIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHRyZWUsIGhlbmNlXG4gICAgICAgICAgLy8gaXQgaXMgbm90IGEgZm9yZXN0LlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpc0ZvcmVzdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIGdyYXBoIGNvbnRhaW5zIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IGEgdHJlZS4gRW1wdHlcbiAgICAvLyBwcmV2aW91c2x5IGZvdW5kIHRyZWVzLiBUaGUgbWV0aG9kIHdpbGwgZW5kLlxuICAgIGlmICghaXNGb3Jlc3QpXG4gICAge1xuICAgICAgZmxhdEZvcmVzdCA9IFtdO1xuICAgIH1cbiAgICAvLyBTYXZlIGN1cnJlbnRseSB2aXNpdGVkIG5vZGVzIGFzIGEgdHJlZSBpbiBvdXIgZm9yZXN0LiBSZXNldFxuICAgIC8vIHZpc2l0ZWQgYW5kIHBhcmVudHMgbGlzdHMuIENvbnRpbnVlIHdpdGggdGhlIG5leHQgY29tcG9uZW50IG9mXG4gICAgLy8gdGhlIGdyYXBoLCBpZiBhbnkuXG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHZhciB0ZW1wID0gW107XG4gICAgICB2aXNpdGVkLmFkZEFsbFRvKHRlbXApO1xuICAgICAgZmxhdEZvcmVzdC5wdXNoKHRlbXApO1xuICAgICAgLy9mbGF0Rm9yZXN0ID0gZmxhdEZvcmVzdC5jb25jYXQodGVtcCk7XG4gICAgICAvL3VuUHJvY2Vzc2VkTm9kZXMucmVtb3ZlQWxsKHZpc2l0ZWQpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRlbXBbaV07XG4gICAgICAgIHZhciBpbmRleCA9IHVuUHJvY2Vzc2VkTm9kZXMuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgdW5Qcm9jZXNzZWROb2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcbiAgICAgIHBhcmVudHMgPSBuZXcgSGFzaE1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmbGF0Rm9yZXN0O1xufTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGR1bW15IG5vZGVzIChhbiBsLWxldmVsIG5vZGUgd2l0aCBtaW5pbWFsIGRpbWVuc2lvbnMpXG4gKiBmb3IgdGhlIGdpdmVuIGVkZ2UgKG9uZSBwZXIgYmVuZHBvaW50KS4gVGhlIGV4aXN0aW5nIGwtbGV2ZWwgc3RydWN0dXJlXG4gKiBpcyB1cGRhdGVkIGFjY29yZGluZ2x5LlxuICovXG5MYXlvdXQucHJvdG90eXBlLmNyZWF0ZUR1bW15Tm9kZXNGb3JCZW5kcG9pbnRzID0gZnVuY3Rpb24gKGVkZ2UpXG57XG4gIHZhciBkdW1teU5vZGVzID0gW107XG4gIHZhciBwcmV2ID0gZWRnZS5zb3VyY2U7XG5cbiAgdmFyIGdyYXBoID0gdGhpcy5ncmFwaE1hbmFnZXIuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9yKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlLmJlbmRwb2ludHMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICAvLyBjcmVhdGUgbmV3IGR1bW15IG5vZGVcbiAgICB2YXIgZHVtbXlOb2RlID0gdGhpcy5uZXdOb2RlKG51bGwpO1xuICAgIGR1bW15Tm9kZS5zZXRSZWN0KG5ldyBQb2ludCgwLCAwKSwgbmV3IERpbWVuc2lvbigxLCAxKSk7XG5cbiAgICBncmFwaC5hZGQoZHVtbXlOb2RlKTtcblxuICAgIC8vIGNyZWF0ZSBuZXcgZHVtbXkgZWRnZSBiZXR3ZWVuIHByZXYgYW5kIGR1bW15IG5vZGVcbiAgICB2YXIgZHVtbXlFZGdlID0gdGhpcy5uZXdFZGdlKG51bGwpO1xuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLmFkZChkdW1teUVkZ2UsIHByZXYsIGR1bW15Tm9kZSk7XG5cbiAgICBkdW1teU5vZGVzLmFkZChkdW1teU5vZGUpO1xuICAgIHByZXYgPSBkdW1teU5vZGU7XG4gIH1cblxuICB2YXIgZHVtbXlFZGdlID0gdGhpcy5uZXdFZGdlKG51bGwpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5hZGQoZHVtbXlFZGdlLCBwcmV2LCBlZGdlLnRhcmdldCk7XG5cbiAgdGhpcy5lZGdlVG9EdW1teU5vZGVzLnB1dChlZGdlLCBkdW1teU5vZGVzKTtcblxuICAvLyByZW1vdmUgcmVhbCBlZGdlIGZyb20gZ3JhcGggbWFuYWdlciBpZiBpdCBpcyBpbnRlci1ncmFwaFxuICBpZiAoZWRnZS5pc0ludGVyR3JhcGgoKSlcbiAge1xuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlbW92ZShlZGdlKTtcbiAgfVxuICAvLyBlbHNlLCByZW1vdmUgdGhlIGVkZ2UgZnJvbSB0aGUgY3VycmVudCBncmFwaFxuICBlbHNlXG4gIHtcbiAgICBncmFwaC5yZW1vdmUoZWRnZSk7XG4gIH1cblxuICByZXR1cm4gZHVtbXlOb2Rlcztcbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBiZW5kcG9pbnRzIGZvciBlZGdlcyBmcm9tIHRoZSBkdW1teSBub2Rlc1xuICogYXQgbC1sZXZlbC5cbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVCZW5kcG9pbnRzRnJvbUR1bW15Tm9kZXMgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgZWRnZXMgPSBbXTtcbiAgZWRnZXMgPSBlZGdlcy5jb25jYXQodGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsRWRnZXMoKSk7XG4gIGVkZ2VzID0gdGhpcy5lZGdlVG9EdW1teU5vZGVzLmtleVNldCgpLmNvbmNhdChlZGdlcyk7XG5cbiAgZm9yICh2YXIgayA9IDA7IGsgPCBlZGdlcy5sZW5ndGg7IGsrKylcbiAge1xuICAgIHZhciBsRWRnZSA9IGVkZ2VzW2tdO1xuXG4gICAgaWYgKGxFZGdlLmJlbmRwb2ludHMubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICB2YXIgcGF0aCA9IHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5nZXQobEVkZ2UpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspXG4gICAgICB7XG4gICAgICAgIHZhciBkdW1teU5vZGUgPSBwYXRoW2ldO1xuICAgICAgICB2YXIgcCA9IG5ldyBQb2ludEQoZHVtbXlOb2RlLmdldENlbnRlclgoKSxcbiAgICAgICAgICAgICAgICBkdW1teU5vZGUuZ2V0Q2VudGVyWSgpKTtcblxuICAgICAgICAvLyB1cGRhdGUgYmVuZHBvaW50J3MgbG9jYXRpb24gYWNjb3JkaW5nIHRvIGR1bW15IG5vZGVcbiAgICAgICAgdmFyIGVicCA9IGxFZGdlLmJlbmRwb2ludHMuZ2V0KGkpO1xuICAgICAgICBlYnAueCA9IHAueDtcbiAgICAgICAgZWJwLnkgPSBwLnk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBkdW1teSBub2RlLCBkdW1teSBlZGdlcyBpbmNpZGVudCB3aXRoIHRoaXNcbiAgICAgICAgLy8gZHVtbXkgbm9kZSBpcyBhbHNvIHJlbW92ZWQgKHdpdGhpbiB0aGUgcmVtb3ZlIG1ldGhvZClcbiAgICAgICAgZHVtbXlOb2RlLmdldE93bmVyKCkucmVtb3ZlKGR1bW15Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCB0aGUgcmVhbCBlZGdlIHRvIGdyYXBoXG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5hZGQobEVkZ2UsIGxFZGdlLnNvdXJjZSwgbEVkZ2UudGFyZ2V0KTtcbiAgICB9XG4gIH1cbn07XG5cbkxheW91dC50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoc2xpZGVyVmFsdWUsIGRlZmF1bHRWYWx1ZSwgbWluRGl2LCBtYXhNdWwpIHtcbiAgaWYgKG1pbkRpdiAhPSB1bmRlZmluZWQgJiYgbWF4TXVsICE9IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcblxuICAgIGlmIChzbGlkZXJWYWx1ZSA8PSA1MClcbiAgICB7XG4gICAgICB2YXIgbWluVmFsdWUgPSBkZWZhdWx0VmFsdWUgLyBtaW5EaXY7XG4gICAgICB2YWx1ZSAtPSAoKGRlZmF1bHRWYWx1ZSAtIG1pblZhbHVlKSAvIDUwKSAqICg1MCAtIHNsaWRlclZhbHVlKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHZhciBtYXhWYWx1ZSA9IGRlZmF1bHRWYWx1ZSAqIG1heE11bDtcbiAgICAgIHZhbHVlICs9ICgobWF4VmFsdWUgLSBkZWZhdWx0VmFsdWUpIC8gNTApICogKHNsaWRlclZhbHVlIC0gNTApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgYSwgYjtcblxuICAgIGlmIChzbGlkZXJWYWx1ZSA8PSA1MClcbiAgICB7XG4gICAgICBhID0gOS4wICogZGVmYXVsdFZhbHVlIC8gNTAwLjA7XG4gICAgICBiID0gZGVmYXVsdFZhbHVlIC8gMTAuMDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIGEgPSA5LjAgKiBkZWZhdWx0VmFsdWUgLyA1MC4wO1xuICAgICAgYiA9IC04ICogZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiAoYSAqIHNsaWRlclZhbHVlICsgYik7XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBtZXRob2QgZmluZHMgYW5kIHJldHVybnMgdGhlIGNlbnRlciBvZiB0aGUgZ2l2ZW4gbm9kZXMsIGFzc3VtaW5nXG4gKiB0aGF0IHRoZSBnaXZlbiBub2RlcyBmb3JtIGEgdHJlZSBpbiB0aGVtc2VsdmVzLlxuICovXG5MYXlvdXQuZmluZENlbnRlck9mVHJlZSA9IGZ1bmN0aW9uIChub2RlcylcbntcbiAgdmFyIGxpc3QgPSBbXTtcbiAgbGlzdCA9IGxpc3QuY29uY2F0KG5vZGVzKTtcblxuICB2YXIgcmVtb3ZlZE5vZGVzID0gW107XG4gIHZhciByZW1haW5pbmdEZWdyZWVzID0gbmV3IEhhc2hNYXAoKTtcbiAgdmFyIGZvdW5kQ2VudGVyID0gZmFsc2U7XG4gIHZhciBjZW50ZXJOb2RlID0gbnVsbDtcblxuICBpZiAobGlzdC5sZW5ndGggPT0gMSB8fCBsaXN0Lmxlbmd0aCA9PSAyKVxuICB7XG4gICAgZm91bmRDZW50ZXIgPSB0cnVlO1xuICAgIGNlbnRlck5vZGUgPSBsaXN0WzBdO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKVxuICB7XG4gICAgdmFyIG5vZGUgPSBsaXN0W2ldO1xuICAgIHZhciBkZWdyZWUgPSBub2RlLmdldE5laWdoYm9yc0xpc3QoKS5zaXplKCk7XG4gICAgcmVtYWluaW5nRGVncmVlcy5wdXQobm9kZSwgbm9kZS5nZXROZWlnaGJvcnNMaXN0KCkuc2l6ZSgpKTtcblxuICAgIGlmIChkZWdyZWUgPT0gMSlcbiAgICB7XG4gICAgICByZW1vdmVkTm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgdGVtcExpc3QgPSBbXTtcbiAgdGVtcExpc3QgPSB0ZW1wTGlzdC5jb25jYXQocmVtb3ZlZE5vZGVzKTtcblxuICB3aGlsZSAoIWZvdW5kQ2VudGVyKVxuICB7XG4gICAgdmFyIHRlbXBMaXN0MiA9IFtdO1xuICAgIHRlbXBMaXN0MiA9IHRlbXBMaXN0Mi5jb25jYXQodGVtcExpc3QpO1xuICAgIHRlbXBMaXN0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspXG4gICAge1xuICAgICAgdmFyIG5vZGUgPSBsaXN0W2ldO1xuXG4gICAgICB2YXIgaW5kZXggPSBsaXN0LmluZGV4T2Yobm9kZSk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZWlnaGJvdXJzID0gbm9kZS5nZXROZWlnaGJvcnNMaXN0KCk7XG5cbiAgICAgIE9iamVjdC5rZXlzKG5laWdoYm91cnMuc2V0KS5mb3JFYWNoKGZ1bmN0aW9uKGopIHtcbiAgICAgICAgdmFyIG5laWdoYm91ciA9IG5laWdoYm91cnMuc2V0W2pdO1xuICAgICAgICBpZiAocmVtb3ZlZE5vZGVzLmluZGV4T2YobmVpZ2hib3VyKSA8IDApXG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgb3RoZXJEZWdyZWUgPSByZW1haW5pbmdEZWdyZWVzLmdldChuZWlnaGJvdXIpO1xuICAgICAgICAgIHZhciBuZXdEZWdyZWUgPSBvdGhlckRlZ3JlZSAtIDE7XG5cbiAgICAgICAgICBpZiAobmV3RGVncmVlID09IDEpXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGVtcExpc3QucHVzaChuZWlnaGJvdXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbWFpbmluZ0RlZ3JlZXMucHV0KG5laWdoYm91ciwgbmV3RGVncmVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlZE5vZGVzID0gcmVtb3ZlZE5vZGVzLmNvbmNhdCh0ZW1wTGlzdCk7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT0gMSB8fCBsaXN0Lmxlbmd0aCA9PSAyKVxuICAgIHtcbiAgICAgIGZvdW5kQ2VudGVyID0gdHJ1ZTtcbiAgICAgIGNlbnRlck5vZGUgPSBsaXN0WzBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjZW50ZXJOb2RlO1xufTtcblxuLyoqXG4gKiBEdXJpbmcgdGhlIGNvYXJzZW5pbmcgcHJvY2VzcywgdGhpcyBsYXlvdXQgbWF5IGJlIHJlZmVyZW5jZWQgYnkgdHdvIGdyYXBoIG1hbmFnZXJzXG4gKiB0aGlzIHNldHRlciBmdW5jdGlvbiBncmFudHMgYWNjZXNzIHRvIGNoYW5nZSB0aGUgY3VycmVudGx5IGJlaW5nIHVzZWQgZ3JhcGggbWFuYWdlclxuICovXG5MYXlvdXQucHJvdG90eXBlLnNldEdyYXBoTWFuYWdlciA9IGZ1bmN0aW9uIChnbSlcbntcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0O1xuIiwiZnVuY3Rpb24gTGF5b3V0Q29uc3RhbnRzKCkge1xufVxuXG4vKipcbiAqIExheW91dCBRdWFsaXR5XG4gKi9cbkxheW91dENvbnN0YW50cy5QUk9PRl9RVUFMSVRZID0gMDtcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX1FVQUxJVFkgPSAxO1xuTGF5b3V0Q29uc3RhbnRzLkRSQUZUX1FVQUxJVFkgPSAyO1xuXG4vKipcbiAqIERlZmF1bHQgcGFyYW1ldGVyc1xuICovXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9DUkVBVEVfQkVORFNfQVNfTkVFREVEID0gZmFsc2U7XG4vL0xheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gdHJ1ZTtcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gZmFsc2U7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fT05fTEFZT1VUID0gdHJ1ZTtcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9EVVJJTkdfTEFZT1VUID0gZmFsc2U7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EID0gNTA7XG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9VTklGT1JNX0xFQUZfTk9ERV9TSVpFUyA9IGZhbHNlO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VjdGlvbjogR2VuZXJhbCBvdGhlciBjb25zdGFudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICogTWFyZ2lucyBvZiBhIGdyYXBoIHRvIGJlIGFwcGxpZWQgb24gYm91ZGluZyByZWN0YW5nbGUgb2YgaXRzIGNvbnRlbnRzLiBXZVxuICogYXNzdW1lIG1hcmdpbnMgb24gYWxsIGZvdXIgc2lkZXMgdG8gYmUgdW5pZm9ybS5cbiAqL1xuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBUEhfTUFSR0lOID0gMTU7XG5cbi8qXG4gKiBXaGV0aGVyIHRvIGNvbnNpZGVyIGxhYmVscyBpbiBub2RlIGRpbWVuc2lvbnMgb3Igbm90XG4gKi9cbkxheW91dENvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMgPSBmYWxzZTtcblxuLypcbiAqIERlZmF1bHQgZGltZW5zaW9uIG9mIGEgbm9uLWNvbXBvdW5kIG5vZGUuXG4gKi9cbkxheW91dENvbnN0YW50cy5TSU1QTEVfTk9ERV9TSVpFID0gNDA7XG5cbi8qXG4gKiBEZWZhdWx0IGRpbWVuc2lvbiBvZiBhIG5vbi1jb21wb3VuZCBub2RlLlxuICovXG5MYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfSEFMRl9TSVpFID0gTGF5b3V0Q29uc3RhbnRzLlNJTVBMRV9OT0RFX1NJWkUgLyAyO1xuXG4vKlxuICogRW1wdHkgY29tcG91bmQgbm9kZSBzaXplLiBXaGVuIGEgY29tcG91bmQgbm9kZSBpcyBlbXB0eSwgaXRzIGJvdGhcbiAqIGRpbWVuc2lvbnMgc2hvdWxkIGJlIG9mIHRoaXMgdmFsdWUuXG4gKi9cbkxheW91dENvbnN0YW50cy5FTVBUWV9DT01QT1VORF9OT0RFX1NJWkUgPSA0MDtcblxuLypcbiAqIE1pbmltdW0gbGVuZ3RoIHRoYXQgYW4gZWRnZSBzaG91bGQgdGFrZSBkdXJpbmcgbGF5b3V0XG4gKi9cbkxheW91dENvbnN0YW50cy5NSU5fRURHRV9MRU5HVEggPSAxO1xuXG4vKlxuICogV29ybGQgYm91bmRhcmllcyB0aGF0IGxheW91dCBvcGVyYXRlcyBvblxuICovXG5MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkgPSAxMDAwMDAwO1xuXG4vKlxuICogV29ybGQgYm91bmRhcmllcyB0aGF0IHJhbmRvbSBwb3NpdGlvbmluZyBjYW4gYmUgcGVyZm9ybWVkIHdpdGhcbiAqL1xuTGF5b3V0Q29uc3RhbnRzLklOSVRJQUxfV09STERfQk9VTkRBUlkgPSBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkgLyAxMDAwO1xuXG4vKlxuICogQ29vcmRpbmF0ZXMgb2YgdGhlIHdvcmxkIGNlbnRlclxuICovXG5MYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1ggPSAxMjAwO1xuTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9ZID0gOTAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dENvbnN0YW50cztcbiIsIi8qXG4gKlRoaXMgY2xhc3MgaXMgdGhlIGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFBvaW50LmphdmEgY2xhc3MgaW4gamRrXG4gKi9cbmZ1bmN0aW9uIFBvaW50KHgsIHksIHApIHtcbiAgdGhpcy54ID0gbnVsbDtcbiAgdGhpcy55ID0gbnVsbDtcbiAgaWYgKHggPT0gbnVsbCAmJiB5ID09IG51bGwgJiYgcCA9PSBudWxsKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiB4ID09ICdudW1iZXInICYmIHR5cGVvZiB5ID09ICdudW1iZXInICYmIHAgPT0gbnVsbCkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuICBlbHNlIGlmICh4LmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1BvaW50JyAmJiB5ID09IG51bGwgJiYgcCA9PSBudWxsKSB7XG4gICAgcCA9IHg7XG4gICAgdGhpcy54ID0gcC54O1xuICAgIHRoaXMueSA9IHAueTtcbiAgfVxufVxuXG5Qb2ludC5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMueDtcbn1cblxuUG9pbnQucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnk7XG59XG5cblBvaW50LnByb3RvdHlwZS5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG59XG5cblBvaW50LnByb3RvdHlwZS5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICh4LCB5LCBwKSB7XG4gIGlmICh4LmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1BvaW50JyAmJiB5ID09IG51bGwgJiYgcCA9PSBudWxsKSB7XG4gICAgcCA9IHg7XG4gICAgdGhpcy5zZXRMb2NhdGlvbihwLngsIHAueSk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHggPT0gJ251bWJlcicgJiYgdHlwZW9mIHkgPT0gJ251bWJlcicgJiYgcCA9PSBudWxsKSB7XG4gICAgLy9pZiBib3RoIHBhcmFtZXRlcnMgYXJlIGludGVnZXIganVzdCBtb3ZlICh4LHkpIGxvY2F0aW9uXG4gICAgaWYgKHBhcnNlSW50KHgpID09IHggJiYgcGFyc2VJbnQoeSkgPT0geSkge1xuICAgICAgdGhpcy5tb3ZlKHgsIHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoeCArIDAuNSk7XG4gICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKHkgKyAwLjUpO1xuICAgIH1cbiAgfVxufVxuXG5Qb2ludC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG59XG5cblBvaW50LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAoZHgsIGR5KSB7XG4gIHRoaXMueCArPSBkeDtcbiAgdGhpcy55ICs9IGR5O1xufVxuXG5Qb2ludC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAob2JqLmNvbnN0cnVjdG9yLm5hbWUgPT0gXCJQb2ludFwiKSB7XG4gICAgdmFyIHB0ID0gb2JqO1xuICAgIHJldHVybiAodGhpcy54ID09IHB0LngpICYmICh0aGlzLnkgPT0gcHQueSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMgPT0gb2JqO1xufVxuXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgUG9pbnQoKS5jb25zdHJ1Y3Rvci5uYW1lICsgXCJbeD1cIiArIHRoaXMueCArIFwiLHk9XCIgKyB0aGlzLnkgKyBcIl1cIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcbiIsImZ1bmN0aW9uIFBvaW50RCh4LCB5KSB7XG4gIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxufVxuXG5Qb2ludEQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy54O1xufTtcblxuUG9pbnRELnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueTtcbn07XG5cblBvaW50RC5wcm90b3R5cGUuc2V0WCA9IGZ1bmN0aW9uICh4KVxue1xuICB0aGlzLnggPSB4O1xufTtcblxuUG9pbnRELnByb3RvdHlwZS5zZXRZID0gZnVuY3Rpb24gKHkpXG57XG4gIHRoaXMueSA9IHk7XG59O1xuXG5Qb2ludEQucHJvdG90eXBlLmdldERpZmZlcmVuY2UgPSBmdW5jdGlvbiAocHQpXG57XG4gIHJldHVybiBuZXcgRGltZW5zaW9uRCh0aGlzLnggLSBwdC54LCB0aGlzLnkgLSBwdC55KTtcbn07XG5cblBvaW50RC5wcm90b3R5cGUuZ2V0Q29weSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiBuZXcgUG9pbnREKHRoaXMueCwgdGhpcy55KTtcbn07XG5cblBvaW50RC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGRpbSlcbntcbiAgdGhpcy54ICs9IGRpbS53aWR0aDtcbiAgdGhpcy55ICs9IGRpbS5oZWlnaHQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludEQ7XG4iLCJmdW5jdGlvbiBSYW5kb21TZWVkKCkge1xufVxuUmFuZG9tU2VlZC5zZWVkID0gMTtcblJhbmRvbVNlZWQueCA9IDA7XG5cblJhbmRvbVNlZWQubmV4dERvdWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgUmFuZG9tU2VlZC54ID0gTWF0aC5zaW4oUmFuZG9tU2VlZC5zZWVkKyspICogMTAwMDA7XG4gIHJldHVybiBSYW5kb21TZWVkLnggLSBNYXRoLmZsb29yKFJhbmRvbVNlZWQueCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbVNlZWQ7XG4iLCJmdW5jdGlvbiBSZWN0YW5nbGVEKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy54ID0gMDtcbiAgdGhpcy55ID0gMDtcbiAgdGhpcy53aWR0aCA9IDA7XG4gIHRoaXMuaGVpZ2h0ID0gMDtcblxuICBpZiAoeCAhPSBudWxsICYmIHkgIT0gbnVsbCAmJiB3aWR0aCAhPSBudWxsICYmIGhlaWdodCAhPSBudWxsKSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxufVxuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLnNldFggPSBmdW5jdGlvbiAoeClcbntcbiAgdGhpcy54ID0geDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy55O1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0WSA9IGZ1bmN0aW9uICh5KVxue1xuICB0aGlzLnkgPSB5O1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy53aWR0aDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLnNldFdpZHRoID0gZnVuY3Rpb24gKHdpZHRoKVxue1xuICB0aGlzLndpZHRoID0gd2lkdGg7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5oZWlnaHQ7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0KVxue1xuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5pbnRlcnNlY3RzID0gZnVuY3Rpb24gKGEpXG57XG4gIGlmICh0aGlzLmdldFJpZ2h0KCkgPCBhLngpXG4gIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodGhpcy5nZXRCb3R0b20oKSA8IGEueSlcbiAge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChhLmdldFJpZ2h0KCkgPCB0aGlzLngpXG4gIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYS5nZXRCb3R0b20oKSA8IHRoaXMueSlcbiAge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0Q2VudGVyWCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMjtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1pblggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5nZXRYKCk7XG59O1xuXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRNYXhYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMuZ2V0WCgpICsgdGhpcy53aWR0aDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldENlbnRlclkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyO1xufTtcblxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0TWluWSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmdldFkoKTtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1heFkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5nZXRZKCkgKyB0aGlzLmhlaWdodDtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoSGFsZiA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLndpZHRoIC8gMjtcbn07XG5cblJlY3RhbmdsZUQucHJvdG90eXBlLmdldEhlaWdodEhhbGYgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5oZWlnaHQgLyAyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWN0YW5nbGVEO1xuIiwidmFyIFBvaW50RCA9IHJlcXVpcmUoJy4vUG9pbnREJyk7XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybSh4LCB5KSB7XG4gIHRoaXMubHdvcmxkT3JnWCA9IDAuMDtcbiAgdGhpcy5sd29ybGRPcmdZID0gMC4wO1xuICB0aGlzLmxkZXZpY2VPcmdYID0gMC4wO1xuICB0aGlzLmxkZXZpY2VPcmdZID0gMC4wO1xuICB0aGlzLmx3b3JsZEV4dFggPSAxLjA7XG4gIHRoaXMubHdvcmxkRXh0WSA9IDEuMDtcbiAgdGhpcy5sZGV2aWNlRXh0WCA9IDEuMDtcbiAgdGhpcy5sZGV2aWNlRXh0WSA9IDEuMDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sd29ybGRPcmdYO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkT3JnWCA9IGZ1bmN0aW9uICh3b3gpXG57XG4gIHRoaXMubHdvcmxkT3JnWCA9IHdveDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZE9yZ1kgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sd29ybGRPcmdZO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkT3JnWSA9IGZ1bmN0aW9uICh3b3kpXG57XG4gIHRoaXMubHdvcmxkT3JnWSA9IHdveTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZEV4dFggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sd29ybGRFeHRYO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkRXh0WCA9IGZ1bmN0aW9uICh3ZXgpXG57XG4gIHRoaXMubHdvcmxkRXh0WCA9IHdleDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sd29ybGRFeHRZO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkRXh0WSA9IGZ1bmN0aW9uICh3ZXkpXG57XG4gIHRoaXMubHdvcmxkRXh0WSA9IHdleTtcbn1cblxuLyogRGV2aWNlIHJlbGF0ZWQgKi9cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VPcmdYID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubGRldmljZU9yZ1g7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuc2V0RGV2aWNlT3JnWCA9IGZ1bmN0aW9uIChkb3gpXG57XG4gIHRoaXMubGRldmljZU9yZ1ggPSBkb3g7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0RGV2aWNlT3JnWSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdZO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1kgPSBmdW5jdGlvbiAoZG95KVxue1xuICB0aGlzLmxkZXZpY2VPcmdZID0gZG95O1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmdldERldmljZUV4dFggPSBmdW5jdGlvbiAoKVxue1xuICByZXR1cm4gdGhpcy5sZGV2aWNlRXh0WDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXREZXZpY2VFeHRYID0gZnVuY3Rpb24gKGRleClcbntcbiAgdGhpcy5sZGV2aWNlRXh0WCA9IGRleDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRZID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHRoaXMubGRldmljZUV4dFk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuc2V0RGV2aWNlRXh0WSA9IGZ1bmN0aW9uIChkZXkpXG57XG4gIHRoaXMubGRldmljZUV4dFkgPSBkZXk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUudHJhbnNmb3JtWCA9IGZ1bmN0aW9uICh4KVxue1xuICB2YXIgeERldmljZSA9IDAuMDtcbiAgdmFyIHdvcmxkRXh0WCA9IHRoaXMubHdvcmxkRXh0WDtcbiAgaWYgKHdvcmxkRXh0WCAhPSAwLjApXG4gIHtcbiAgICB4RGV2aWNlID0gdGhpcy5sZGV2aWNlT3JnWCArXG4gICAgICAgICAgICAoKHggLSB0aGlzLmx3b3JsZE9yZ1gpICogdGhpcy5sZGV2aWNlRXh0WCAvIHdvcmxkRXh0WCk7XG4gIH1cblxuICByZXR1cm4geERldmljZTtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2Zvcm1ZID0gZnVuY3Rpb24gKHkpXG57XG4gIHZhciB5RGV2aWNlID0gMC4wO1xuICB2YXIgd29ybGRFeHRZID0gdGhpcy5sd29ybGRFeHRZO1xuICBpZiAod29ybGRFeHRZICE9IDAuMClcbiAge1xuICAgIHlEZXZpY2UgPSB0aGlzLmxkZXZpY2VPcmdZICtcbiAgICAgICAgICAgICgoeSAtIHRoaXMubHdvcmxkT3JnWSkgKiB0aGlzLmxkZXZpY2VFeHRZIC8gd29ybGRFeHRZKTtcbiAgfVxuXG5cbiAgcmV0dXJuIHlEZXZpY2U7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVggPSBmdW5jdGlvbiAoeClcbntcbiAgdmFyIHhXb3JsZCA9IDAuMDtcbiAgdmFyIGRldmljZUV4dFggPSB0aGlzLmxkZXZpY2VFeHRYO1xuICBpZiAoZGV2aWNlRXh0WCAhPSAwLjApXG4gIHtcbiAgICB4V29ybGQgPSB0aGlzLmx3b3JsZE9yZ1ggK1xuICAgICAgICAgICAgKCh4IC0gdGhpcy5sZGV2aWNlT3JnWCkgKiB0aGlzLmx3b3JsZEV4dFggLyBkZXZpY2VFeHRYKTtcbiAgfVxuXG5cbiAgcmV0dXJuIHhXb3JsZDtcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlVHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxue1xuICB2YXIgeVdvcmxkID0gMC4wO1xuICB2YXIgZGV2aWNlRXh0WSA9IHRoaXMubGRldmljZUV4dFk7XG4gIGlmIChkZXZpY2VFeHRZICE9IDAuMClcbiAge1xuICAgIHlXb3JsZCA9IHRoaXMubHdvcmxkT3JnWSArXG4gICAgICAgICAgICAoKHkgLSB0aGlzLmxkZXZpY2VPcmdZKSAqIHRoaXMubHdvcmxkRXh0WSAvIGRldmljZUV4dFkpO1xuICB9XG4gIHJldHVybiB5V29ybGQ7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVBvaW50ID0gZnVuY3Rpb24gKGluUG9pbnQpXG57XG4gIHZhciBvdXRQb2ludCA9XG4gICAgICAgICAgbmV3IFBvaW50RCh0aGlzLmludmVyc2VUcmFuc2Zvcm1YKGluUG9pbnQueCksXG4gICAgICAgICAgICAgICAgICB0aGlzLmludmVyc2VUcmFuc2Zvcm1ZKGluUG9pbnQueSkpO1xuICByZXR1cm4gb3V0UG9pbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNmb3JtO1xuIiwiZnVuY3Rpb24gVW5pcXVlSURHZW5lcmV0b3IoKSB7XG59XG5cblVuaXF1ZUlER2VuZXJldG9yLmxhc3RJRCA9IDA7XG5cblVuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEID0gZnVuY3Rpb24gKG9iaikge1xuICBpZiAoVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUob2JqKSkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cbiAgaWYgKG9iai51bmlxdWVJRCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIG9iai51bmlxdWVJRDtcbiAgfVxuICBvYmoudW5pcXVlSUQgPSBVbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcoKTtcbiAgVW5pcXVlSURHZW5lcmV0b3IubGFzdElEKys7XG4gIHJldHVybiBvYmoudW5pcXVlSUQ7XG59XG5cblVuaXF1ZUlER2VuZXJldG9yLmdldFN0cmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICBpZiAoaWQgPT0gbnVsbClcbiAgICBpZCA9IFVuaXF1ZUlER2VuZXJldG9yLmxhc3RJRDtcbiAgcmV0dXJuIFwiT2JqZWN0I1wiICsgaWQgKyBcIlwiO1xufVxuXG5VbmlxdWVJREdlbmVyZXRvci5pc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xuICByZXR1cm4gYXJnID09IG51bGwgfHwgKHR5cGUgIT0gXCJvYmplY3RcIiAmJiB0eXBlICE9IFwiZnVuY3Rpb25cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVW5pcXVlSURHZW5lcmV0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBEaW1lbnNpb25EID0gcmVxdWlyZSgnLi9EaW1lbnNpb25EJyk7XG52YXIgSGFzaE1hcCA9IHJlcXVpcmUoJy4vSGFzaE1hcCcpO1xudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcbnZhciBJR2VvbWV0cnkgPSByZXF1aXJlKCcuL0lHZW9tZXRyeScpO1xudmFyIElNYXRoID0gcmVxdWlyZSgnLi9JTWF0aCcpO1xudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xudmFyIFJhbmRvbVNlZWQgPSByZXF1aXJlKCcuL1JhbmRvbVNlZWQnKTtcbnZhciBSZWN0YW5nbGVEID0gcmVxdWlyZSgnLi9SZWN0YW5nbGVEJyk7XG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcbnZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcbnZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xudmFyIExHcmFwaCA9IHJlcXVpcmUoJy4vTEdyYXBoJyk7XG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XG52YXIgTEdyYXBoTWFuYWdlciA9IHJlcXVpcmUoJy4vTEdyYXBoTWFuYWdlcicpO1xudmFyIExOb2RlID0gcmVxdWlyZSgnLi9MTm9kZScpO1xudmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcbnZhciBGRExheW91dCA9IHJlcXVpcmUoJy4vRkRMYXlvdXQnKTtcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcbnZhciBGRExheW91dEVkZ2UgPSByZXF1aXJlKCcuL0ZETGF5b3V0RWRnZScpO1xudmFyIEZETGF5b3V0Tm9kZSA9IHJlcXVpcmUoJy4vRkRMYXlvdXROb2RlJyk7XG52YXIgQ29TRUNvbnN0YW50cyA9IHJlcXVpcmUoJy4vQ29TRUNvbnN0YW50cycpO1xudmFyIENvU0VFZGdlID0gcmVxdWlyZSgnLi9Db1NFRWRnZScpO1xudmFyIENvU0VHcmFwaCA9IHJlcXVpcmUoJy4vQ29TRUdyYXBoJyk7XG52YXIgQ29TRUdyYXBoTWFuYWdlciA9IHJlcXVpcmUoJy4vQ29TRUdyYXBoTWFuYWdlcicpO1xudmFyIENvU0VMYXlvdXQgPSByZXF1aXJlKCcuL0NvU0VMYXlvdXQnKTtcbnZhciBDb1NFTm9kZSA9IHJlcXVpcmUoJy4vQ29TRU5vZGUnKTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAvLyBDYWxsZWQgb24gYGxheW91dHJlYWR5YFxuICByZWFkeTogZnVuY3Rpb24gKCkge1xuICB9LFxuICAvLyBDYWxsZWQgb24gYGxheW91dHN0b3BgXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgLy8gaW5jbHVkZSBsYWJlbHMgaW4gbm9kZSBkaW1lbnNpb25zXG4gIG5vZGVEaW1lbnNpb25zSW5jbHVkZUxhYmVsczogZmFsc2UsXG4gIC8vIG51bWJlciBvZiB0aWNrcyBwZXIgZnJhbWU7IGhpZ2hlciBpcyBmYXN0ZXIgYnV0IG1vcmUgamVya3lcbiAgcmVmcmVzaDogMzAsXG4gIC8vIFdoZXRoZXIgdG8gZml0IHRoZSBuZXR3b3JrIHZpZXcgYWZ0ZXIgd2hlbiBkb25lXG4gIGZpdDogdHJ1ZSxcbiAgLy8gUGFkZGluZyBvbiBmaXRcbiAgcGFkZGluZzogMTAsXG4gIC8vIFdoZXRoZXIgdG8gZW5hYmxlIGluY3JlbWVudGFsIG1vZGVcbiAgcmFuZG9taXplOiB0cnVlLFxuICAvLyBOb2RlIHJlcHVsc2lvbiAobm9uIG92ZXJsYXBwaW5nKSBtdWx0aXBsaWVyXG4gIG5vZGVSZXB1bHNpb246IDQ1MDAsXG4gIC8vIElkZWFsIGVkZ2UgKG5vbiBuZXN0ZWQpIGxlbmd0aFxuICBpZGVhbEVkZ2VMZW5ndGg6IDUwLFxuICAvLyBEaXZpc29yIHRvIGNvbXB1dGUgZWRnZSBmb3JjZXNcbiAgZWRnZUVsYXN0aWNpdHk6IDAuNDUsXG4gIC8vIE5lc3RpbmcgZmFjdG9yIChtdWx0aXBsaWVyKSB0byBjb21wdXRlIGlkZWFsIGVkZ2UgbGVuZ3RoIGZvciBuZXN0ZWQgZWRnZXNcbiAgbmVzdGluZ0ZhY3RvcjogMC4xLFxuICAvLyBHcmF2aXR5IGZvcmNlIChjb25zdGFudClcbiAgZ3Jhdml0eTogMC4yNSxcbiAgLy8gTWF4aW11bSBudW1iZXIgb2YgaXRlcmF0aW9ucyB0byBwZXJmb3JtXG4gIG51bUl0ZXI6IDI1MDAsXG4gIC8vIEZvciBlbmFibGluZyB0aWxpbmdcbiAgdGlsZTogdHJ1ZSxcbiAgLy8gVHlwZSBvZiBsYXlvdXQgYW5pbWF0aW9uLiBUaGUgb3B0aW9uIHNldCBpcyB7J2R1cmluZycsICdlbmQnLCBmYWxzZX1cbiAgYW5pbWF0ZTogJ2VuZCcsXG4gIC8vIER1cmF0aW9uIGZvciBhbmltYXRlOmVuZFxuICBhbmltYXRpb25EdXJhdGlvbjogNTAwLFxuICAvL3doZXRoZXIgdG8gc2hvdyBpdGVyYXRpb25zIGR1cmluZyBhbmltYXRpb25cbiAgc2hvd0FuaW1hdGlvbjogZmFsc2UsIFxuICAvLyBSZXByZXNlbnRzIHRoZSBhbW91bnQgb2YgdGhlIHZlcnRpY2FsIHNwYWNlIHRvIHB1dCBiZXR3ZWVuIHRoZSB6ZXJvIGRlZ3JlZSBtZW1iZXJzIGR1cmluZyB0aGUgdGlsaW5nIG9wZXJhdGlvbihjYW4gYWxzbyBiZSBhIGZ1bmN0aW9uKVxuICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IDEwLFxuICAvLyBSZXByZXNlbnRzIHRoZSBhbW91bnQgb2YgdGhlIGhvcml6b250YWwgc3BhY2UgdG8gcHV0IGJldHdlZW4gdGhlIHplcm8gZGVncmVlIG1lbWJlcnMgZHVyaW5nIHRoZSB0aWxpbmcgb3BlcmF0aW9uKGNhbiBhbHNvIGJlIGEgZnVuY3Rpb24pXG4gIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiAxMCxcbiAgLy8gR3Jhdml0eSByYW5nZSAoY29uc3RhbnQpIGZvciBjb21wb3VuZHNcbiAgZ3Jhdml0eVJhbmdlQ29tcG91bmQ6IDEuNSxcbiAgLy8gR3Jhdml0eSBmb3JjZSAoY29uc3RhbnQpIGZvciBjb21wb3VuZHNcbiAgZ3Jhdml0eUNvbXBvdW5kOiAxLjAsXG4gIC8vIEdyYXZpdHkgcmFuZ2UgKGNvbnN0YW50KVxuICBncmF2aXR5UmFuZ2U6IDMuOCxcbiAgLy8gSW5pdGlhbCBjb29saW5nIGZhY3RvciBmb3IgaW5jcmVtZW50YWwgbGF5b3V0XG4gIGluaXRpYWxFbmVyZ3lPbkluY3JlbWVudGFsOiAwLjVcbn07XG5cbmZ1bmN0aW9uIGV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykge1xuICB2YXIgb2JqID0ge307XG5cbiAgZm9yICh2YXIgaSBpbiBkZWZhdWx0cykge1xuICAgIG9ialtpXSA9IGRlZmF1bHRzW2ldO1xuICB9XG5cbiAgZm9yICh2YXIgaSBpbiBvcHRpb25zKSB7XG4gICAgb2JqW2ldID0gb3B0aW9uc1tpXTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiBfQ29TRUxheW91dChfb3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBleHRlbmQoZGVmYXVsdHMsIF9vcHRpb25zKTtcbiAgZ2V0VXNlck9wdGlvbnModGhpcy5vcHRpb25zKTtcbn1cblxudmFyIGdldFVzZXJPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMubm9kZVJlcHVsc2lvbiAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1JFUFVMU0lPTl9TVFJFTkdUSCA9IG9wdGlvbnMubm9kZVJlcHVsc2lvbjtcbiAgaWYgKG9wdGlvbnMuaWRlYWxFZGdlTGVuZ3RoICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IG9wdGlvbnMuaWRlYWxFZGdlTGVuZ3RoO1xuICBpZiAob3B0aW9ucy5lZGdlRWxhc3RpY2l0eSAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9TUFJJTkdfU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSCA9IG9wdGlvbnMuZWRnZUVsYXN0aWNpdHk7XG4gIGlmIChvcHRpb25zLm5lc3RpbmdGYWN0b3IgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLlBFUl9MRVZFTF9JREVBTF9FREdFX0xFTkdUSF9GQUNUT1IgPSBGRExheW91dENvbnN0YW50cy5QRVJfTEVWRUxfSURFQUxfRURHRV9MRU5HVEhfRkFDVE9SID0gb3B0aW9ucy5uZXN0aW5nRmFjdG9yO1xuICBpZiAob3B0aW9ucy5ncmF2aXR5ICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEggPSBvcHRpb25zLmdyYXZpdHk7XG4gIGlmIChvcHRpb25zLm51bUl0ZXIgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLk1BWF9JVEVSQVRJT05TID0gRkRMYXlvdXRDb25zdGFudHMuTUFYX0lURVJBVElPTlMgPSBvcHRpb25zLm51bUl0ZXI7XG4gIGlmIChvcHRpb25zLmdyYXZpdHlSYW5nZSAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBvcHRpb25zLmdyYXZpdHlSYW5nZTtcbiAgaWYob3B0aW9ucy5ncmF2aXR5Q29tcG91bmQgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IG9wdGlvbnMuZ3Jhdml0eUNvbXBvdW5kO1xuICBpZihvcHRpb25zLmdyYXZpdHlSYW5nZUNvbXBvdW5kICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfUkFOR0VfRkFDVE9SID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IG9wdGlvbnMuZ3Jhdml0eVJhbmdlQ29tcG91bmQ7XG4gIGlmIChvcHRpb25zLmluaXRpYWxFbmVyZ3lPbkluY3JlbWVudGFsICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPT0xJTkdfRkFDVE9SX0lOQ1JFTUVOVEFMID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCA9IG9wdGlvbnMuaW5pdGlhbEVuZXJneU9uSW5jcmVtZW50YWw7XG5cbiAgQ29TRUNvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMgPSBGRExheW91dENvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMgPSBMYXlvdXRDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gb3B0aW9ucy5ub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHM7XG4gIENvU0VDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9XG4gICAgICAgICAgIShvcHRpb25zLnJhbmRvbWl6ZSk7XG4gIENvU0VDb25zdGFudHMuQU5JTUFURSA9IEZETGF5b3V0Q29uc3RhbnRzLkFOSU1BVEUgPSBMYXlvdXRDb25zdGFudHMuQU5JTUFURSA9IG9wdGlvbnMuYW5pbWF0ZTtcbiAgQ29TRUNvbnN0YW50cy5USUxFID0gb3B0aW9ucy50aWxlO1xuICBDb1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX1ZFUlRJQ0FMID0gXG4gICAgICAgICAgdHlwZW9mIG9wdGlvbnMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy50aWxpbmdQYWRkaW5nVmVydGljYWwuY2FsbCgpIDogb3B0aW9ucy50aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gIENvU0VDb25zdGFudHMuVElMSU5HX1BBRERJTkdfSE9SSVpPTlRBTCA9IFxuICAgICAgICAgIHR5cGVvZiBvcHRpb25zLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbC5jYWxsKCkgOiBvcHRpb25zLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsO1xufTtcblxuX0NvU0VMYXlvdXQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlYWR5O1xuICB2YXIgZnJhbWVJZDtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHZhciBpZFRvTE5vZGUgPSB0aGlzLmlkVG9MTm9kZSA9IHt9O1xuICB2YXIgbGF5b3V0ID0gdGhpcy5sYXlvdXQgPSBuZXcgQ29TRUxheW91dCgpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICBzZWxmLnN0b3BwZWQgPSBmYWxzZTtcblxuICB0aGlzLmN5ID0gdGhpcy5vcHRpb25zLmN5O1xuXG4gIHRoaXMuY3kudHJpZ2dlcih7IHR5cGU6ICdsYXlvdXRzdGFydCcsIGxheW91dDogdGhpcyB9KTtcblxuICB2YXIgZ20gPSBsYXlvdXQubmV3R3JhcGhNYW5hZ2VyKCk7XG4gIHRoaXMuZ20gPSBnbTtcblxuICB2YXIgbm9kZXMgPSB0aGlzLm9wdGlvbnMuZWxlcy5ub2RlcygpO1xuICB2YXIgZWRnZXMgPSB0aGlzLm9wdGlvbnMuZWxlcy5lZGdlcygpO1xuXG4gIHRoaXMucm9vdCA9IGdtLmFkZFJvb3QoKTtcbiAgdGhpcy5wcm9jZXNzQ2hpbGRyZW5MaXN0KHRoaXMucm9vdCwgdGhpcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpLCBsYXlvdXQpO1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgdmFyIHNvdXJjZU5vZGUgPSB0aGlzLmlkVG9MTm9kZVtlZGdlLmRhdGEoXCJzb3VyY2VcIildO1xuICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5pZFRvTE5vZGVbZWRnZS5kYXRhKFwidGFyZ2V0XCIpXTtcbiAgICBpZihzb3VyY2VOb2RlLmdldEVkZ2VzQmV0d2Vlbih0YXJnZXROb2RlKS5sZW5ndGggPT0gMCl7XG4gICAgICB2YXIgZTEgPSBnbS5hZGQobGF5b3V0Lm5ld0VkZ2UoKSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSk7XG4gICAgICBlMS5pZCA9IGVkZ2UuaWQoKTtcbiAgICB9XG4gIH1cbiAgXG4gICB2YXIgZ2V0UG9zaXRpb25zID0gZnVuY3Rpb24oZWxlLCBpKXtcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGUgPSBpO1xuICAgIH1cbiAgICB2YXIgdGhlSWQgPSBlbGUuZGF0YSgnaWQnKTtcbiAgICB2YXIgbE5vZGUgPSBzZWxmLmlkVG9MTm9kZVt0aGVJZF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogbE5vZGUuZ2V0UmVjdCgpLmdldENlbnRlclgoKSxcbiAgICAgIHk6IGxOb2RlLmdldFJlY3QoKS5nZXRDZW50ZXJZKClcbiAgICB9O1xuICB9O1xuICBcbiAgLypcbiAgICogUmVwb3NpdGlvbiBub2RlcyBpbiBpdGVyYXRpb25zIGFuaW1hdGVkbHlcbiAgICovXG4gIHZhciBpdGVyYXRlQW5pbWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhpZ3MgdG8gcGVyZm9ybSBhZnRlciBub2RlcyBhcmUgcmVwb3NpdGlvbmVkIG9uIHNjcmVlblxuICAgIHZhciBhZnRlclJlcG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChvcHRpb25zLmZpdCkge1xuICAgICAgICBvcHRpb25zLmN5LmZpdChvcHRpb25zLmVsZXMubm9kZXMoKSwgb3B0aW9ucy5wYWRkaW5nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZWFkeSkge1xuICAgICAgICByZWFkeSA9IHRydWU7XG4gICAgICAgIHNlbGYuY3kub25lKCdsYXlvdXRyZWFkeScsIG9wdGlvbnMucmVhZHkpO1xuICAgICAgICBzZWxmLmN5LnRyaWdnZXIoe3R5cGU6ICdsYXlvdXRyZWFkeScsIGxheW91dDogc2VsZn0pO1xuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgdmFyIHRpY2tzUGVyRnJhbWUgPSBzZWxmLm9wdGlvbnMucmVmcmVzaDtcbiAgICB2YXIgaXNEb25lO1xuXG4gICAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aWNrc1BlckZyYW1lICYmICFpc0RvbmU7IGkrKyApe1xuICAgICAgaXNEb25lID0gc2VsZi5zdG9wcGVkIHx8IHNlbGYubGF5b3V0LnRpY2soKTtcbiAgICB9XG4gICAgXG4gICAgLy8gSWYgbGF5b3V0IGlzIGRvbmVcbiAgICBpZiAoaXNEb25lKSB7XG4gICAgICAvLyBJZiB0aGUgbGF5b3V0IGlzIG5vdCBhIHN1YmxheW91dCBhbmQgaXQgaXMgc3VjY2Vzc2Z1bCBwZXJmb3JtIHBvc3QgbGF5b3V0LlxuICAgICAgaWYgKGxheW91dC5jaGVja0xheW91dFN1Y2Nlc3MoKSAmJiAhbGF5b3V0LmlzU3ViTGF5b3V0KSB7XG4gICAgICAgIGxheW91dC5kb1Bvc3RMYXlvdXQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gSWYgbGF5b3V0IGhhcyBhIHRpbGluZ1Bvc3RMYXlvdXQgZnVuY3Rpb24gcHJvcGVydHkgY2FsbCBpdC5cbiAgICAgIGlmIChsYXlvdXQudGlsaW5nUG9zdExheW91dCkge1xuICAgICAgICBsYXlvdXQudGlsaW5nUG9zdExheW91dCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBsYXlvdXQuaXNMYXlvdXRGaW5pc2hlZCA9IHRydWU7XG4gICAgICBcbiAgICAgIHNlbGYub3B0aW9ucy5lbGVzLm5vZGVzKCkucG9zaXRpb25zKGdldFBvc2l0aW9ucyk7XG4gICAgICBcbiAgICAgIGFmdGVyUmVwb3NpdGlvbigpO1xuICAgICAgXG4gICAgICAvLyB0cmlnZ2VyIGxheW91dHN0b3Agd2hlbiB0aGUgbGF5b3V0IHN0b3BzIChlLmcuIGZpbmlzaGVzKVxuICAgICAgc2VsZi5jeS5vbmUoJ2xheW91dHN0b3AnLCBzZWxmLm9wdGlvbnMuc3RvcCk7XG4gICAgICBzZWxmLmN5LnRyaWdnZXIoeyB0eXBlOiAnbGF5b3V0c3RvcCcsIGxheW91dDogc2VsZiB9KTtcblxuICAgICAgaWYgKGZyYW1lSWQpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoZnJhbWVJZCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJlYWR5ID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHZhciBhbmltYXRpb25EYXRhID0gc2VsZi5sYXlvdXQuZ2V0UG9zaXRpb25zRGF0YSgpOyAvLyBHZXQgcG9zaXRpb25zIG9mIGxheW91dCBub2RlcyBub3RlIHRoYXQgYWxsIG5vZGVzIG1heSBub3QgYmUgbGF5b3V0IG5vZGVzIGJlY2F1c2Ugb2YgdGlsaW5nXG4gICAgdmFyIGVkZ2VEYXRhID0gc2VsZi5sYXlvdXQuZ2V0RWRnZXNEYXRhKCk7XG4gICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdzZW5kJywgeydkZXRhaWwnOiBbYW5pbWF0aW9uRGF0YSwgZWRnZURhdGFdfSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpOyBcbiAgICBcbiAgICBpZihvcHRpb25zLnNob3dBbmltYXRpb24pe1xuICAgICAgLy8gUG9zaXRpb24gbm9kZXMsIGZvciB0aGUgbm9kZXMgd2hvc2UgaWQgZG9lcyBub3QgaW5jbHVkZWQgaW4gZGF0YSAoYmVjYXVzZSB0aGV5IGFyZSByZW1vdmVkIGZyb20gdGhlaXIgcGFyZW50cyBhbmQgaW5jbHVkZWQgaW4gZHVtbXkgY29tcG91bmRzKVxuICAgICAgLy8gdXNlIHBvc2l0aW9uIG9mIHRoZWlyIGFuY2VzdG9ycyBvciBkdW1teSBhbmNlc3RvcnNcbiAgICAgIG9wdGlvbnMuZWxlcy5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgZWxlID0gaTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGhlSWQgPSBlbGUuaWQoKTtcbiAgICAgICAgdmFyIHBOb2RlID0gYW5pbWF0aW9uRGF0YVt0aGVJZF07XG4gICAgICAgIHZhciB0ZW1wID0gZWxlO1xuICAgICAgICAvLyBJZiBwTm9kZSBpcyB1bmRlZmluZWQgc2VhcmNoIHVudGlsIGZpbmRpbmcgcG9zaXRpb24gZGF0YSBvZiBpdHMgZmlyc3QgYW5jZXN0b3IgKEl0IG1heSBiZSBkdW1teSBhcyB3ZWxsKVxuICAgICAgICB3aGlsZSAocE5vZGUgPT0gbnVsbCkge1xuICAgICAgICAgIHBOb2RlID0gYW5pbWF0aW9uRGF0YVt0ZW1wLmRhdGEoJ3BhcmVudCcpXSB8fCBhbmltYXRpb25EYXRhWydEdW1teUNvbXBvdW5kXycgKyB0ZW1wLmRhdGEoJ3BhcmVudCcpXTtcbiAgICAgICAgICBhbmltYXRpb25EYXRhW3RoZUlkXSA9IHBOb2RlO1xuICAgICAgICAgIHRlbXAgPSB0ZW1wLnBhcmVudCgpWzBdO1xuICAgICAgICAgIGlmKHRlbXAgPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZihwTm9kZSAhPSBudWxsKXtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcE5vZGUueCxcbiAgICAgICAgICAgIHk6IHBOb2RlLnlcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICAgICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGFmdGVyUmVwb3NpdGlvbigpO1xuXG4gICAgZnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShpdGVyYXRlQW5pbWF0ZWQpO1xuICB9O1xuICBcbiAgLypcbiAgKiBMaXN0ZW4gJ2xheW91dHN0YXJ0ZWQnIGV2ZW50IGFuZCBzdGFydCBhbmltYXRlZCBpdGVyYXRpb24gaWYgYW5pbWF0ZSBvcHRpb24gaXMgJ2R1cmluZydcbiAgKi9cbiAgbGF5b3V0LmFkZExpc3RlbmVyKCdsYXlvdXRzdGFydGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuYW5pbWF0ZSA9PT0gJ2R1cmluZycpIHtcbiAgICAgIGZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaXRlcmF0ZUFuaW1hdGVkKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgbGF5b3V0LnJ1bkxheW91dCgpOyAvLyBSdW4gY29zZSBsYXlvdXRcbiAgXG4gIC8qXG4gICAqIElmIGFuaW1hdGUgb3B0aW9uIGlzIG5vdCAnZHVyaW5nJyAoJ2VuZCcgb3IgZmFsc2UpIHBlcmZvcm0gdGhlc2UgaGVyZSAoSWYgaXQgaXMgJ2R1cmluZycgc2ltaWxhciB0aGluZ3MgYXJlIGFscmVhZHkgcGVyZm9ybWVkKVxuICAgKi9cbiAgaWYodGhpcy5vcHRpb25zLmFuaW1hdGUgIT0gXCJkdXJpbmdcIil7XG4gICAgc2VsZi5vcHRpb25zLmVsZXMubm9kZXMoKS5ub3QoXCI6cGFyZW50XCIpLmxheW91dFBvc2l0aW9ucyhzZWxmLCBzZWxmLm9wdGlvbnMsIGdldFBvc2l0aW9ucyk7IC8vIFVzZSBsYXlvdXQgcG9zaXRpb25zIHRvIHJlcG9zaXRpb24gdGhlIG5vZGVzIGl0IGNvbnNpZGVycyB0aGUgb3B0aW9ucyBwYXJhbWV0ZXJcbiAgICByZWFkeSA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7IC8vIGNoYWluaW5nXG59O1xuXG4vL0dldCB0aGUgdG9wIG1vc3Qgb25lcyBvZiBhIGxpc3Qgb2Ygbm9kZXNcbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRUb3BNb3N0Tm9kZXMgPSBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgbm9kZXNNYXAgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZXNNYXBbbm9kZXNbaV0uaWQoKV0gPSB0cnVlO1xuICB9XG4gIHZhciByb290cyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZSA9IGk7XG4gICAgICB9XG4gICAgICB2YXIgcGFyZW50ID0gZWxlLnBhcmVudCgpWzBdO1xuICAgICAgd2hpbGUocGFyZW50ICE9IG51bGwpe1xuICAgICAgICBpZihub2Rlc01hcFtwYXJlbnQuaWQoKV0pe1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KClbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RzO1xufTtcblxuX0NvU0VMYXlvdXQucHJvdG90eXBlLnByb2Nlc3NDaGlsZHJlbkxpc3QgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZHJlbiwgbGF5b3V0KSB7XG4gIHZhciBzaXplID0gY2hpbGRyZW4ubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIHZhciB0aGVDaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgIHZhciBjaGlsZHJlbl9vZl9jaGlsZHJlbiA9IHRoZUNoaWxkLmNoaWxkcmVuKCk7XG4gICAgdmFyIHRoZU5vZGU7ICAgIFxuXG4vLyAgICB2YXIgZGltZW5zaW9ucyA9IHRoZUNoaWxkLmxheW91dERpbWVuc2lvbnMoe1xuLy8gICAgICBub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHM6IHRoaXMub3B0aW9ucy5ub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHNcbi8vICAgIH0pO1xuXG4gICAgaWYgKHRoZUNoaWxkLm91dGVyV2lkdGgoKSAhPSBudWxsXG4gICAgICAgICAgICAmJiB0aGVDaGlsZC5vdXRlckhlaWdodCgpICE9IG51bGwpIHtcbiAgICAgIHRoZU5vZGUgPSBwYXJlbnQuYWRkKG5ldyBDb1NFTm9kZShsYXlvdXQuZ3JhcGhNYW5hZ2VyLFxuICAgICAgICAgICAgICBuZXcgUG9pbnREKHRoZUNoaWxkLnBvc2l0aW9uKCd4JykgLSB0aGVDaGlsZC5vdXRlcldpZHRoKCkgLyAyLCB0aGVDaGlsZC5wb3NpdGlvbigneScpIC0gdGhlQ2hpbGQub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgICAgICBuZXcgRGltZW5zaW9uRChwYXJzZUZsb2F0KHRoZUNoaWxkLm91dGVyV2lkdGgoKSksIHBhcnNlRmxvYXQodGhlQ2hpbGQub3V0ZXJIZWlnaHQoKSkpKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhlTm9kZSA9IHBhcmVudC5hZGQobmV3IENvU0VOb2RlKHRoaXMuZ3JhcGhNYW5hZ2VyKSk7XG4gICAgfVxuICAgIC8vIEF0dGFjaCBpZCB0byB0aGUgbGF5b3V0IG5vZGVcbiAgICB0aGVOb2RlLmlkID0gdGhlQ2hpbGQuZGF0YShcImlkXCIpO1xuICAgIC8vIEF0dGFjaCB0aGUgcGFkZGluZ3Mgb2YgY3kgbm9kZSB0byBsYXlvdXQgbm9kZVxuICAgIHRoZU5vZGUucGFkZGluZ0xlZnQgPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICB0aGVOb2RlLnBhZGRpbmdUb3AgPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICB0aGVOb2RlLnBhZGRpbmdSaWdodCA9IHBhcnNlSW50KCB0aGVDaGlsZC5jc3MoJ3BhZGRpbmcnKSApO1xuICAgIHRoZU5vZGUucGFkZGluZ0JvdHRvbSA9IHBhcnNlSW50KCB0aGVDaGlsZC5jc3MoJ3BhZGRpbmcnKSApO1xuICAgIFxuICAgIC8vQXR0YWNoIHRoZSBsYWJlbCBwcm9wZXJ0aWVzIHRvIGNvbXBvdW5kIGlmIGxhYmVscyB3aWxsIGJlIGluY2x1ZGVkIGluIG5vZGUgZGltZW5zaW9ucyAgXG4gICAgaWYodGhpcy5vcHRpb25zLm5vZGVEaW1lbnNpb25zSW5jbHVkZUxhYmVscyl7XG4gICAgICBpZih0aGVDaGlsZC5pc1BhcmVudCgpKXtcbiAgICAgICAgICB2YXIgbGFiZWxXaWR0aCA9IHRoZUNoaWxkLmJvdW5kaW5nQm94KHsgaW5jbHVkZUxhYmVsczogdHJ1ZSwgaW5jbHVkZU5vZGVzOiBmYWxzZSB9KS53OyAgICAgICAgICBcbiAgICAgICAgICB2YXIgbGFiZWxIZWlnaHQgPSB0aGVDaGlsZC5ib3VuZGluZ0JveCh7IGluY2x1ZGVMYWJlbHM6IHRydWUsIGluY2x1ZGVOb2RlczogZmFsc2UgfSkuaDtcbiAgICAgICAgICB2YXIgbGFiZWxQb3MgPSB0aGVDaGlsZC5jc3MoXCJ0ZXh0LWhhbGlnblwiKTtcbiAgICAgICAgICB0aGVOb2RlLmxhYmVsV2lkdGggPSBsYWJlbFdpZHRoO1xuICAgICAgICAgIHRoZU5vZGUubGFiZWxIZWlnaHQgPSBsYWJlbEhlaWdodDtcbiAgICAgICAgICB0aGVOb2RlLmxhYmVsUG9zID0gbGFiZWxQb3M7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIE1hcCB0aGUgbGF5b3V0IG5vZGVcbiAgICB0aGlzLmlkVG9MTm9kZVt0aGVDaGlsZC5kYXRhKFwiaWRcIildID0gdGhlTm9kZTtcblxuICAgIGlmIChpc05hTih0aGVOb2RlLnJlY3QueCkpIHtcbiAgICAgIHRoZU5vZGUucmVjdC54ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNOYU4odGhlTm9kZS5yZWN0LnkpKSB7XG4gICAgICB0aGVOb2RlLnJlY3QueSA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkcmVuX29mX2NoaWxkcmVuICE9IG51bGwgJiYgY2hpbGRyZW5fb2ZfY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHRoZU5ld0dyYXBoO1xuICAgICAgdGhlTmV3R3JhcGggPSBsYXlvdXQuZ2V0R3JhcGhNYW5hZ2VyKCkuYWRkKGxheW91dC5uZXdHcmFwaCgpLCB0aGVOb2RlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0NoaWxkcmVuTGlzdCh0aGVOZXdHcmFwaCwgY2hpbGRyZW5fb2ZfY2hpbGRyZW4sIGxheW91dCk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEBicmllZiA6IGNhbGxlZCBvbiBjb250aW51b3VzIGxheW91dHMgdG8gc3RvcCB0aGVtIGJlZm9yZSB0aGV5IGZpbmlzaFxuICovXG5fQ29TRUxheW91dC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcblxuICByZXR1cm4gdGhpczsgLy8gY2hhaW5pbmdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0KGN5dG9zY2FwZSkge1xuICByZXR1cm4gX0NvU0VMYXlvdXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG52YXIgZ2V0TGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcblxudmFyIHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xuICB2YXIgTGF5b3V0ID0gZ2V0TGF5b3V0KCBjeXRvc2NhcGUgKTtcblxuICBjeXRvc2NhcGUoJ2xheW91dCcsICdjb3NlLWJpbGtlbnQnLCBMYXlvdXQpO1xufTtcblxuLy8gYXV0byByZWcgZm9yIGdsb2JhbHNcbmlmKCB0eXBlb2YgY3l0b3NjYXBlICE9PSAndW5kZWZpbmVkJyApe1xuICByZWdpc3RlciggY3l0b3NjYXBlICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG4iXX0=
