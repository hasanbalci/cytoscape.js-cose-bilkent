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

CoSEConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = false;
CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
CoSEConstants.DEFAULT_COMPONENT_SEPERATION = 60;
CoSEConstants.TILE = true;
CoSEConstants.TILING_PADDING_VERTICAL = 10;
CoSEConstants.TILING_PADDING_HORIZONTAL = 10;

module.exports = CoSEConstants;

},{"./FDLayoutConstants":13}],5:[function(require,module,exports){
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

},{"./FDLayoutEdge":14}],6:[function(require,module,exports){
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

},{"./LGraph":22}],7:[function(require,module,exports){
'use strict';

var LGraphManager = require('./LGraphManager');

function CoSEGraphManager(layout) {
  LGraphManager.call(this, layout);
}

CoSEGraphManager.prototype = Object.create(LGraphManager.prototype);
for (var prop in LGraphManager) {
  CoSEGraphManager[prop] = LGraphManager[prop];
}

module.exports = CoSEGraphManager;

},{"./LGraphManager":23}],8:[function(require,module,exports){
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

  this.level = 0;
  return this.classicLayout();
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
        this.reduceTrees();
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
    if (edge.getSource().id !== edge.getTarget().id) {
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

},{"./CoSEConstants":4,"./CoSEEdge":5,"./CoSEGraph":6,"./CoSEGraphManager":7,"./CoSENode":9,"./FDLayout":12,"./FDLayoutConstants":13,"./IGeometry":18,"./Integer":20,"./LGraph":22,"./Layout":26,"./LayoutConstants":27,"./Point":28,"./PointD":29,"./Transform":32}],9:[function(require,module,exports){
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
  return pred1;
};

CoSENode.prototype.getPred2 = function () {
  return pred2;
};

CoSENode.prototype.setNext = function (next) {
  this.next = next;
};

CoSENode.prototype.getNext = function () {
  return next;
};

CoSENode.prototype.setProcessed = function (processed) {
  this.processed = processed;
};

CoSENode.prototype.isProcessed = function () {
  return processed;
};

module.exports = CoSENode;

},{"./FDLayoutNode":15,"./IMath":19}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./FDLayoutConstants":13,"./IGeometry":18,"./IMath":19,"./Integer":20,"./Layout":26,"./LayoutConstants":27}],13:[function(require,module,exports){
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

},{"./LayoutConstants":27}],14:[function(require,module,exports){
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

},{"./FDLayoutConstants":13,"./LEdge":21}],15:[function(require,module,exports){
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

},{"./LNode":25}],16:[function(require,module,exports){
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

},{"./UniqueIDGeneretor":33}],17:[function(require,module,exports){
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

},{"./UniqueIDGeneretor":33}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
"use strict";

function Integer() {}

Integer.MAX_VALUE = 2147483647;
Integer.MIN_VALUE = -2147483648;

module.exports = Integer;

},{}],21:[function(require,module,exports){
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

},{"./IGeometry":18,"./IMath":19,"./LGraphObject":24}],22:[function(require,module,exports){
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

function LGraph(parent, obj2, vGraph) {
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

},{"./HashSet":17,"./Integer":20,"./LEdge":21,"./LGraphManager":23,"./LGraphObject":24,"./LNode":25,"./LayoutConstants":27,"./Point":28,"./RectangleD":31,"linkedlist-js":1}],23:[function(require,module,exports){
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

},{"./LEdge":21,"./LGraph":22}],24:[function(require,module,exports){
"use strict";

function LGraphObject(vGraphObject) {
  this.vGraphObject = vGraphObject;
}

module.exports = LGraphObject;

},{}],25:[function(require,module,exports){
'use strict';

var LGraphObject = require('./LGraphObject');
var Integer = require('./Integer');
var RectangleD = require('./RectangleD');
var LayoutConstants = require('./LayoutConstants');
var RandomSeed = require('./RandomSeed');
var PointD = require('./PointD');
var HashSet = require('./HashSet');

function LNode(gm, loc, size, vNode) {
  //Alternative constructor 1 : LNode(LGraphManager gm, Point loc, Dimension size, Object vNode)
  if (size == null && vNode == null) {
    vNode = loc;
  }

  LGraphObject.call(this, vNode);

  //Alternative constructor 2 : LNode(Layout layout, Object vNode)
  if (gm.graphManager != null) gm = gm.graphManager;

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

},{"./HashSet":17,"./Integer":20,"./LGraphObject":24,"./LayoutConstants":27,"./PointD":29,"./RandomSeed":30,"./RectangleD":31}],26:[function(require,module,exports){
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

},{"./Emitter":11,"./HashMap":16,"./HashSet":17,"./LEdge":21,"./LGraph":22,"./LGraphManager":23,"./LNode":25,"./LayoutConstants":27,"./PointD":29,"./Transform":32}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";

function RandomSeed() {}
RandomSeed.seed = 1;
RandomSeed.x = 0;

RandomSeed.nextDouble = function () {
  RandomSeed.x = Math.sin(RandomSeed.seed++) * 10000;
  return RandomSeed.x - Math.floor(RandomSeed.x);
};

module.exports = RandomSeed;

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"./PointD":29}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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
            x: ele.x,
            y: ele.y
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
  if (this.options.animate !== "during") {
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

},{"./CoSEConstants":4,"./CoSEEdge":5,"./CoSEGraph":6,"./CoSEGraphManager":7,"./CoSELayout":8,"./CoSENode":9,"./DimensionD":10,"./FDLayout":12,"./FDLayoutConstants":13,"./FDLayoutEdge":14,"./FDLayoutNode":15,"./HashMap":16,"./HashSet":17,"./IGeometry":18,"./IMath":19,"./Integer":20,"./LEdge":21,"./LGraph":22,"./LGraphManager":23,"./LGraphObject":24,"./LNode":25,"./Layout":26,"./LayoutConstants":27,"./Point":28,"./PointD":29,"./RandomSeed":30,"./RectangleD":31,"./Transform":32,"./UniqueIDGeneretor":33}],35:[function(require,module,exports){
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

},{"./Layout":34}]},{},[35])(35)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbGlua2VkbGlzdC1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9saW5rZWRsaXN0LWpzL3NyYy9MaXN0LmpzIiwibm9kZV9tb2R1bGVzL2xpbmtlZGxpc3QtanMvc3JjL05vZGUuanMiLCJzcmNcXExheW91dFxcQ29TRUNvbnN0YW50cy5qcyIsInNyY1xcTGF5b3V0XFxDb1NFRWRnZS5qcyIsInNyY1xcTGF5b3V0XFxDb1NFR3JhcGguanMiLCJzcmNcXExheW91dFxcQ29TRUdyYXBoTWFuYWdlci5qcyIsInNyY1xcTGF5b3V0XFxDb1NFTGF5b3V0LmpzIiwic3JjXFxMYXlvdXRcXENvU0VOb2RlLmpzIiwic3JjXFxMYXlvdXRcXERpbWVuc2lvbkQuanMiLCJzcmNcXExheW91dFxcRW1pdHRlci5qcyIsInNyY1xcTGF5b3V0XFxGRExheW91dC5qcyIsInNyY1xcTGF5b3V0XFxGRExheW91dENvbnN0YW50cy5qcyIsInNyY1xcTGF5b3V0XFxGRExheW91dEVkZ2UuanMiLCJzcmNcXExheW91dFxcRkRMYXlvdXROb2RlLmpzIiwic3JjXFxMYXlvdXRcXEhhc2hNYXAuanMiLCJzcmNcXExheW91dFxcSGFzaFNldC5qcyIsInNyY1xcTGF5b3V0XFxJR2VvbWV0cnkuanMiLCJzcmNcXExheW91dFxcSU1hdGguanMiLCJzcmNcXExheW91dFxcSW50ZWdlci5qcyIsInNyY1xcTGF5b3V0XFxMRWRnZS5qcyIsInNyY1xcTGF5b3V0XFxMR3JhcGguanMiLCJzcmNcXExheW91dFxcTEdyYXBoTWFuYWdlci5qcyIsInNyY1xcTGF5b3V0XFxMR3JhcGhPYmplY3QuanMiLCJzcmNcXExheW91dFxcTE5vZGUuanMiLCJzcmNcXExheW91dFxcTGF5b3V0LmpzIiwic3JjXFxMYXlvdXRcXExheW91dENvbnN0YW50cy5qcyIsInNyY1xcTGF5b3V0XFxQb2ludC5qcyIsInNyY1xcTGF5b3V0XFxQb2ludEQuanMiLCJzcmNcXExheW91dFxcUmFuZG9tU2VlZC5qcyIsInNyY1xcTGF5b3V0XFxSZWN0YW5nbGVELmpzIiwic3JjXFxMYXlvdXRcXFRyYW5zZm9ybS5qcyIsInNyY1xcTGF5b3V0XFxVbmlxdWVJREdlbmVyZXRvci5qcyIsInNyY1xcTGF5b3V0XFxpbmRleC5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q2xDLE1BQUksU0FBUyxVQUFXLFNBQVgsQ0FBYjs7QUFFQSxZQUFVLFFBQVYsRUFBb0IsY0FBcEIsRUFBb0MsTUFBcEM7QUFDRCxDQUpEOztBQU1BO0FBQ0EsSUFBSSxPQUFPLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFDcEMsV0FBVSxTQUFWO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFFBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBucyA9IHtcblx0TGlzdDogcmVxdWlyZSgnLi9zcmMvTGlzdCcpLFxuXHROb2RlOiByZXF1aXJlKCcuL3NyYy9Ob2RlJyksXG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBucztcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0ZGVmaW5lKCdMaW5rZWRMaXN0SlMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5zO1xuXHR9KTtcbn0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0d2luZG93LkxpbmtlZExpc3RKUyA9IG5zO1xufSIsInZhciBOb2RlID0gcmVxdWlyZSgnLi9Ob2RlJyk7XG5cbnZhciBMaXN0ID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLl9jb3VudCA9IDA7XG5cdHRoaXMuX2hlYWQgPSBudWxsO1xuXHR0aGlzLl90YWlsID0gbnVsbDtcbn07XG5cbkxpc3QucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9oZWFkO1xufTtcblxuTGlzdC5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX3RhaWw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5jb3VudCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX2NvdW50O1xufTtcblxuTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGluZGV4OyBpKyspIHtcblx0XHRub2RlID0gbm9kZS5uZXh0KCk7XG5cdH1cblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcblx0dmFyIG5vZGUgPSB0aGlzLmdldChpbmRleCk7XG5cdG5vZGUuc2V0KHZhbHVlKTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dmFyIG5vZGUgPSBuZXcgTm9kZSh2YWx1ZSwgdGhpcy5fdGFpbCwgbnVsbCk7XG5cblx0aWYgKHRoaXMuX3RhaWwgIT09IG51bGwpIHtcblx0XHR0aGlzLl90YWlsLnNldE5leHQobm9kZSk7XG5cdH1cblxuXHRpZiAodGhpcy5faGVhZCA9PT0gbnVsbCkge1xuXHRcdHRoaXMuX2hlYWQgPSBub2RlO1xuXHR9XG5cblx0dGhpcy5fdGFpbCA9IG5vZGU7XG5cdHRoaXMuX2NvdW50Kys7XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBub2RlID0gdGhpcy5fdGFpbDtcblxuXHR2YXIgbmV3X3RhaWwgPSBudWxsO1xuXHRpZiAodGhpcy5fdGFpbC5wcmV2aW91cygpICE9PSBudWxsKSB7XG5cdFx0bmV3X3RhaWwgPSB0aGlzLl90YWlsLnByZXZpb3VzKCk7XG5cdFx0bmV3X3RhaWwuc2V0TmV4dChudWxsKTtcblx0fVxuXHRcblx0dGhpcy5fdGFpbCA9IG5ld190YWlsO1xuXG5cdHRoaXMuX2NvdW50LS07XG5cblx0aWYgKHRoaXMuX2NvdW50ID09PSAwKSB7XG5cdFx0dGhpcy5faGVhZCA9IG51bGw7XG5cdH1cblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dmFyIG5vZGUgPSBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgdGhpcy5faGVhZCk7XG5cblx0aWYgKHRoaXMuX2hlYWQgIT09IG51bGwpIHtcblx0XHR0aGlzLl9oZWFkLnNldFByZXZpb3VzKG5vZGUpO1xuXHR9XG5cblx0aWYgKHRoaXMuX3RhaWwgPT09IG51bGwpIHtcblx0XHR0aGlzLl90YWlsID0gbm9kZTtcblx0fVxuXHRcblx0dGhpcy5faGVhZCA9IG5vZGU7XG5cblx0dGhpcy5fY291bnQrKztcblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cbkxpc3QucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cblx0dmFyIG5ld19oZWFkID0gbnVsbDtcblx0aWYgKHRoaXMuX2hlYWQubmV4dCgpICE9PSBudWxsKSB7XG5cdFx0bmV3X2hlYWQgPSB0aGlzLl9oZWFkLm5leHQoKTtcblx0XHRuZXdfaGVhZC5zZXRQcmV2aW91cyhudWxsKTtcblx0fVxuXG5cdHRoaXMuX2hlYWQgPSBuZXdfaGVhZDtcblxuXHR0aGlzLl9jb3VudC0tO1xuXG5cdGlmICh0aGlzLl9jb3VudCA9PT0gMCkge1xuXHRcdHRoaXMuX3RhaWwgPSBudWxsO1xuXHR9XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5hc0FycmF5ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXJyID0gW107XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblxuXHR3aGlsZSAobm9kZSkge1xuXHRcdGFyci5wdXNoKG5vZGUudmFsdWUoKSk7XG5cdFx0bm9kZSA9IG5vZGUubmV4dCgpO1xuXHR9XG5cblx0cmV0dXJuIGFycjtcbn07XG5cbkxpc3QucHJvdG90eXBlLnRydW5jYXRlVG8gPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG5cdHRoaXMuX2NvdW50ID0gbGVuZ3RoO1xuXG5cdGlmIChsZW5ndGggPT09IDApIHtcblx0XHR0aGlzLl9oZWFkID0gbnVsbDtcblx0XHR0aGlzLl90YWlsID0gbnVsbDtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBub2RlID0gdGhpcy5nZXQobGVuZ3RoLTEpO1xuXHRub2RlLnNldE5leHQobnVsbCk7XG5cdHRoaXMuX3RhaWwgPSBub2RlO1xufTtcblxuTGlzdC5wcm90b3R5cGUuZW1wdHkgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMudHJ1bmNhdGVUbygwKTtcbn07XG5cbkxpc3QucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9oZWFkID09PSBudWxsO1xufTtcblxuTGlzdC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHR2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cblx0d2hpbGUgKG5vZGUgIT09IG51bGwpIHtcblx0XHRpZiAobm9kZS52YWx1ZSgpID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXG5cdFx0bm9kZSA9IG5vZGUubmV4dCgpO1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59O1xuXG5MaXN0LnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdHZhciBub2RlID0gdGhpcy5faGVhZDtcblx0dmFyIGkgPSAwO1xuXHR3aGlsZSAobm9kZSAhPT0gbnVsbCkge1xuXHRcdGNhbGxiYWNrKGksIG5vZGUpO1xuXHRcdG5vZGUgPSBub2RlLm5leHQoKTtcblx0XHRpKys7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0OyIsInZhciBOb2RlID0gZnVuY3Rpb24gKHZhbHVlLCBwcmV2aW91cywgbmV4dCkge1xuXHR0aGlzLl92YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogdmFsdWU7XG5cdFxuXHR0aGlzLl9wcmV2aW91cyA9IHByZXZpb3VzID09PSB1bmRlZmluZWQgPyBudWxsIDogcHJldmlvdXM7XG5cdHRoaXMuX25leHQgPSBuZXh0ID09PSB1bmRlZmluZWQgPyBudWxsIDogbmV4dDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fdmFsdWU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5wcmV2aW91cyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX3ByZXZpb3VzO1xufTtcblxuTm9kZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuX25leHQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0dGhpcy5fdmFsdWUgPSB2YWx1ZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldFByZXZpb3VzID0gZnVuY3Rpb24gKG5vZGUpIHtcblx0dGhpcy5fcHJldmlvdXMgPSBub2RlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0TmV4dCA9IGZ1bmN0aW9uIChub2RlKSB7XG5cdHRoaXMuX25leHQgPSBub2RlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNIZWFkID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fcHJldmlvdXMgPT09IG51bGw7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc1RhaWwgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLl9uZXh0ID09PSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlOyIsInZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VDb25zdGFudHMoKSB7XHJcbn1cclxuXHJcbi8vQ29TRUNvbnN0YW50cyBpbmhlcml0cyBzdGF0aWMgcHJvcHMgaW4gRkRMYXlvdXRDb25zdGFudHNcclxuZm9yICh2YXIgcHJvcCBpbiBGRExheW91dENvbnN0YW50cykge1xyXG4gIENvU0VDb25zdGFudHNbcHJvcF0gPSBGRExheW91dENvbnN0YW50c1twcm9wXTtcclxufVxyXG5cclxuQ29TRUNvbnN0YW50cy5ERUZBVUxUX1VTRV9NVUxUSV9MRVZFTF9TQ0FMSU5HID0gZmFsc2U7XHJcbkNvU0VDb25zdGFudHMuREVGQVVMVF9SQURJQUxfU0VQQVJBVElPTiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XHJcbkNvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTiA9IDYwO1xyXG5Db1NFQ29uc3RhbnRzLlRJTEUgPSB0cnVlO1xyXG5Db1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX1ZFUlRJQ0FMID0gMTA7XHJcbkNvU0VDb25zdGFudHMuVElMSU5HX1BBRERJTkdfSE9SSVpPTlRBTCA9IDEwO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb1NFQ29uc3RhbnRzO1xyXG4iLCJ2YXIgRkRMYXlvdXRFZGdlID0gcmVxdWlyZSgnLi9GRExheW91dEVkZ2UnKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xyXG4gIEZETGF5b3V0RWRnZS5jYWxsKHRoaXMsIHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSk7XHJcbn1cclxuXHJcbkNvU0VFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRkRMYXlvdXRFZGdlLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXRFZGdlKSB7XHJcbiAgQ29TRUVkZ2VbcHJvcF0gPSBGRExheW91dEVkZ2VbcHJvcF07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29TRUVkZ2VcclxuIiwidmFyIExHcmFwaCA9IHJlcXVpcmUoJy4vTEdyYXBoJyk7XHJcblxyXG5mdW5jdGlvbiBDb1NFR3JhcGgocGFyZW50LCBncmFwaE1nciwgdkdyYXBoKSB7XHJcbiAgTEdyYXBoLmNhbGwodGhpcywgcGFyZW50LCBncmFwaE1nciwgdkdyYXBoKTtcclxufVxyXG5cclxuQ29TRUdyYXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoKSB7XHJcbiAgQ29TRUdyYXBoW3Byb3BdID0gTEdyYXBoW3Byb3BdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VHcmFwaDtcclxuIiwidmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VHcmFwaE1hbmFnZXIobGF5b3V0KSB7XHJcbiAgTEdyYXBoTWFuYWdlci5jYWxsKHRoaXMsIGxheW91dCk7XHJcbn1cclxuXHJcbkNvU0VHcmFwaE1hbmFnZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhNYW5hZ2VyLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoTWFuYWdlcikge1xyXG4gIENvU0VHcmFwaE1hbmFnZXJbcHJvcF0gPSBMR3JhcGhNYW5hZ2VyW3Byb3BdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VHcmFwaE1hbmFnZXI7XHJcbiIsInZhciBGRExheW91dCA9IHJlcXVpcmUoJy4vRkRMYXlvdXQnKTtcbnZhciBDb1NFR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db1NFR3JhcGhNYW5hZ2VyJyk7XG52YXIgQ29TRUdyYXBoID0gcmVxdWlyZSgnLi9Db1NFR3JhcGgnKTtcbnZhciBDb1NFTm9kZSA9IHJlcXVpcmUoJy4vQ29TRU5vZGUnKTtcbnZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcbnZhciBDb1NFQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db1NFQ29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xudmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XG52YXIgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL1RyYW5zZm9ybScpO1xuXG5mdW5jdGlvbiBDb1NFTGF5b3V0KCkge1xuICBGRExheW91dC5jYWxsKHRoaXMpO1xuICBcbiAgdGhpcy50b0JlVGlsZWQgPSB7fTsgLy8gTWVtb3JpemUgaWYgYSBub2RlIGlzIHRvIGJlIHRpbGVkIG9yIGlzIHRpbGVkXG59XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGRExheW91dC5wcm90b3R5cGUpO1xuXG5mb3IgKHZhciBwcm9wIGluIEZETGF5b3V0KSB7XG4gIENvU0VMYXlvdXRbcHJvcF0gPSBGRExheW91dFtwcm9wXTtcbn1cblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZ20gPSBuZXcgQ29TRUdyYXBoTWFuYWdlcih0aGlzKTtcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcbiAgcmV0dXJuIGdtO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3R3JhcGggPSBmdW5jdGlvbiAodkdyYXBoKSB7XG4gIHJldHVybiBuZXcgQ29TRUdyYXBoKG51bGwsIHRoaXMuZ3JhcGhNYW5hZ2VyLCB2R3JhcGgpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3Tm9kZSA9IGZ1bmN0aW9uICh2Tm9kZSkge1xuICByZXR1cm4gbmV3IENvU0VOb2RlKHRoaXMuZ3JhcGhNYW5hZ2VyLCB2Tm9kZSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5uZXdFZGdlID0gZnVuY3Rpb24gKHZFZGdlKSB7XG4gIHJldHVybiBuZXcgQ29TRUVkZ2UobnVsbCwgbnVsbCwgdkVkZ2UpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIEZETGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycy5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG4gIGlmICghdGhpcy5pc1N1YkxheW91dCkge1xuICAgIGlmIChDb1NFQ29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPCAxMClcbiAgICB7XG4gICAgICB0aGlzLmlkZWFsRWRnZUxlbmd0aCA9IDEwO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgdGhpcy5pZGVhbEVkZ2VMZW5ndGggPSBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XG4gICAgfVxuXG4gICAgdGhpcy51c2VTbWFydElkZWFsRWRnZUxlbmd0aENhbGN1bGF0aW9uID1cbiAgICAgICAgICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT047XG4gICAgdGhpcy5zcHJpbmdDb25zdGFudCA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSDtcbiAgICB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIO1xuICAgIHRoaXMuZ3Jhdml0eUNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9TVFJFTkdUSDtcbiAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSDtcbiAgICB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvciA9XG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SO1xuICAgIHRoaXMuY29tcG91bmRHcmF2aXR5UmFuZ2VGYWN0b3IgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUjtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUubGF5b3V0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY3JlYXRlQmVuZHNBc05lZWRlZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQ7XG4gIGlmIChjcmVhdGVCZW5kc0FzTmVlZGVkKVxuICB7XG4gICAgdGhpcy5jcmVhdGVCZW5kcG9pbnRzKCk7XG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xuICB9XG5cbiAgdGhpcy5sZXZlbCA9IDA7XG4gIHJldHVybiB0aGlzLmNsYXNzaWNMYXlvdXQoKTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmNsYXNzaWNMYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMubm9kZXNXaXRoR3Jhdml0eSA9IHRoaXMuY2FsY3VsYXRlTm9kZXNUb0FwcGx5R3Jhdml0YXRpb25UbygpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbih0aGlzLm5vZGVzV2l0aEdyYXZpdHkpO1xuICB0aGlzLmNhbGNOb09mQ2hpbGRyZW5Gb3JBbGxOb2RlcygpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3JzKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLmNhbGNJbmNsdXNpb25UcmVlRGVwdGhzKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5jYWxjRXN0aW1hdGVkU2l6ZSgpO1xuICB0aGlzLmNhbGNJZGVhbEVkZ2VMZW5ndGhzKCk7XG4gIFxuICBpZiAoIXRoaXMuaW5jcmVtZW50YWwpXG4gIHtcbiAgICB2YXIgZm9yZXN0ID0gdGhpcy5nZXRGbGF0Rm9yZXN0KCk7XG5cbiAgICAvLyBUaGUgZ3JhcGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgbGF5b3V0IGlzIGZsYXQgYW5kIGEgZm9yZXN0XG4gICAgaWYgKGZvcmVzdC5sZW5ndGggPiAwKVxuICAgIHtcbiAgICAgIHRoaXMucG9zaXRpb25Ob2Rlc1JhZGlhbGx5KGZvcmVzdCk7XG4gICAgfVxuICAgIC8vIFRoZSBncmFwaCBhc3NvY2lhdGVkIHdpdGggdGhpcyBsYXlvdXQgaXMgbm90IGZsYXQgb3IgYSBmb3Jlc3RcbiAgICBlbHNlXG4gICAge1xuICAgICAgLy8gUmVkdWNlIHRoZSB0cmVlcyB3aGVuIGluY3JlbWVudGFsIG1vZGUgaXMgbm90IGVuYWJsZWQgYW5kIGdyYXBoIGlzIG5vdCBhIGZvcmVzdCBcbiAgICAgIHRoaXMucmVkdWNlVHJlZXMoKTtcbiAgICAgIC8vIFVwZGF0ZSBub2RlcyB0aGF0IGdyYXZpdHkgd2lsbCBiZSBhcHBsaWVkXG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG4gICAgICB2YXIgYWxsTm9kZXMgPSBuZXcgU2V0KHRoaXMuZ2V0QWxsTm9kZXMoKSk7XG4gICAgICB2YXIgaW50ZXJzZWN0aW9uID0gdGhpcy5ub2Rlc1dpdGhHcmF2aXR5LmZpbHRlcih4ID0+IGFsbE5vZGVzLmhhcyh4KSk7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgXG4gICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seSgpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuaW5pdFNwcmluZ0VtYmVkZGVyKCk7XG4gIHRoaXMucnVuU3ByaW5nRW1iZWRkZXIoKTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnZhciBub2Rlc0RldGFpbDtcbnZhciBlZGdlc0RldGFpbDtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRvdGFsSXRlcmF0aW9ucysrO1xuICBcbiAgaWYgKHRoaXMudG90YWxJdGVyYXRpb25zID09PSB0aGlzLm1heEl0ZXJhdGlvbnMgJiYgIXRoaXMuaXNUcmVlR3Jvd2luZyAmJiAhdGhpcy5pc0dyb3d0aEZpbmlzaGVkKSB7XG4gICAgaWYodGhpcy5wcnVuZWROb2Rlc0FsbC5sZW5ndGggPiAwKXtcbiAgICAgIHRoaXMuaXNUcmVlR3Jvd2luZyA9IHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7ICBcbiAgICB9XG4gIH1cbiAgXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyAlIEZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9PSAwICAmJiAhdGhpcy5pc1RyZWVHcm93aW5nICYmICF0aGlzLmlzR3Jvd3RoRmluaXNoZWQpXG4gIHtcbiAgICBpZiAodGhpcy5pc0NvbnZlcmdlZCgpKVxuICAgIHtcbiAgICAgIGlmKHRoaXMucHJ1bmVkTm9kZXNBbGwubGVuZ3RoID4gMCl7XG4gICAgICAgIHRoaXMuaXNUcmVlR3Jvd2luZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7ICBcbiAgICAgIH0gXG4gICAgfVxuXG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gdGhpcy5pbml0aWFsQ29vbGluZ0ZhY3RvciAqXG4gICAgICAgICAgICAoKHRoaXMubWF4SXRlcmF0aW9ucyAtIHRoaXMudG90YWxJdGVyYXRpb25zKSAvIHRoaXMubWF4SXRlcmF0aW9ucyk7XG4gICAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBNYXRoLmNlaWwodGhpcy5pbml0aWFsQW5pbWF0aW9uUGVyaW9kICogTWF0aC5zcXJ0KHRoaXMuY29vbGluZ0ZhY3RvcikpO1xuICB9XG4gIC8vIE9wZXJhdGlvbnMgd2hpbGUgdHJlZSBpcyBncm93aW5nIGFnYWluIFxuICBpZih0aGlzLmlzVHJlZUdyb3dpbmcpe1xuICAgIGlmKHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zICUgMTAgPT0gMCl7XG4gICAgICBpZih0aGlzLnBydW5lZE5vZGVzQWxsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlR3JpZCgpO1xuICAgICAgICB0aGlzLmdyb3dUcmVlKHRoaXMucHJ1bmVkTm9kZXNBbGwpO1xuICAgICAgICAvLyBVcGRhdGUgbm9kZXMgdGhhdCBncmF2aXR5IHdpbGwgYmUgYXBwbGllZFxuICAgICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uKCk7XG4gICAgICAgIHZhciBhbGxOb2RlcyA9IG5ldyBTZXQodGhpcy5nZXRBbGxOb2RlcygpKTtcbiAgICAgICAgdmFyIGludGVyc2VjdGlvbiA9IHRoaXMubm9kZXNXaXRoR3Jhdml0eS5maWx0ZXIoeCA9PiBhbGxOb2Rlcy5oYXMoeCkpO1xuICAgICAgICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlR3JpZCgpOyBcbiAgICAgICAgdGhpcy5jb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTDsgXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5pc1RyZWVHcm93aW5nID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5pc0dyb3d0aEZpbmlzaGVkID0gdHJ1ZTsgXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ3Jvd1RyZWVJdGVyYXRpb25zKys7XG4gIH1cbiAgLy8gT3BlcmF0aW9ucyBhZnRlciBncm93dGggaXMgZmluaXNoZWRcbiAgaWYodGhpcy5pc0dyb3d0aEZpbmlzaGVkKXtcbiAgICBpZiAodGhpcy5pc0NvbnZlcmdlZCgpKVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlOyAgXG4gICAgfVxuICAgIGlmKHRoaXMuYWZ0ZXJHcm93dGhJdGVyYXRpb25zICUgMTAgPT0gMCl7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci51cGRhdGVCb3VuZHMoKTtcbiAgICAgIHRoaXMudXBkYXRlR3JpZCgpOyBcbiAgICB9XG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCAqICgoMTAwIC0gdGhpcy5hZnRlckdyb3d0aEl0ZXJhdGlvbnMpIC8gMTAwKTtcbiAgICB0aGlzLmFmdGVyR3Jvd3RoSXRlcmF0aW9ucysrO1xuICB9XG4gIFxuICB0aGlzLnRvdGFsRGlzcGxhY2VtZW50ID0gMDtcbiAgdGhpcy5ncmFwaE1hbmFnZXIudXBkYXRlQm91bmRzKCk7XG4gIGVkZ2VzRGV0YWlsID0gdGhpcy5jYWxjU3ByaW5nRm9yY2VzKCk7XG4gIHRoaXMuY2FsY1JlcHVsc2lvbkZvcmNlcygpO1xuICB0aGlzLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2VzKCk7XG4gIG5vZGVzRGV0YWlsID0gdGhpcy5tb3ZlTm9kZXMoKTtcbiAgdGhpcy5hbmltYXRlKCk7XG4gIFxuICByZXR1cm4gZmFsc2U7IC8vIExheW91dCBpcyBub3QgZW5kZWQgeWV0IHJldHVybiBmYWxzZVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0UG9zaXRpb25zRGF0YSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2RlcygpO1xuICB2YXIgcERhdGEgPSB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciByZWN0ID0gYWxsTm9kZXNbaV0ucmVjdDtcbiAgICB2YXIgaWQgPSBhbGxOb2Rlc1tpXS5pZDtcbiAgICBwRGF0YVtpZF0gPSB7XG4gICAgICBpZDogaWQsXG4gICAgICB4OiByZWN0LmdldENlbnRlclgoKSxcbiAgICAgIHk6IHJlY3QuZ2V0Q2VudGVyWSgpLFxuICAgICAgdzogcmVjdC53aWR0aCxcbiAgICAgIGg6IHJlY3QuaGVpZ2h0LFxuICAgICAgc3ByaW5nRm9yY2VYOiBub2Rlc0RldGFpbFtpXS5zcHJpbmdGb3JjZVgsXG4gICAgICBzcHJpbmdGb3JjZVk6IG5vZGVzRGV0YWlsW2ldLnNwcmluZ0ZvcmNlWSxcbiAgICAgIHJlcHVsc2lvbkZvcmNlWDogbm9kZXNEZXRhaWxbaV0ucmVwdWxzaW9uRm9yY2VYLFxuICAgICAgcmVwdWxzaW9uRm9yY2VZOiBub2Rlc0RldGFpbFtpXS5yZXB1bHNpb25Gb3JjZVksXG4gICAgICBncmF2aXRhdGlvbkZvcmNlWDogbm9kZXNEZXRhaWxbaV0uZ3Jhdml0YXRpb25Gb3JjZVgsXG4gICAgICBncmF2aXRhdGlvbkZvcmNlWTogbm9kZXNEZXRhaWxbaV0uZ3Jhdml0YXRpb25Gb3JjZVksXG4gICAgICBkaXNwbGFjZW1lbnRYOiBub2Rlc0RldGFpbFtpXS5kaXNwbGFjZW1lbnRYLFxuICAgICAgZGlzcGxhY2VtZW50WTogbm9kZXNEZXRhaWxbaV0uZGlzcGxhY2VtZW50WVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHBEYXRhO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0RWRnZXNEYXRhID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhbGxFZGdlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCk7XG4gIHZhciBlRGF0YSA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEVkZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gYWxsRWRnZXNbaV0uaWQ7XG4gICAgZURhdGFbaWRdID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc291cmNlOiAoZWRnZXNEZXRhaWxbaV0gIT0gbnVsbCkgPyBlZGdlc0RldGFpbFtpXS5zb3VyY2UgOiBcIlwiLFxuICAgICAgdGFyZ2V0OiAoZWRnZXNEZXRhaWxbaV0gIT0gbnVsbCkgPyBlZGdlc0RldGFpbFtpXS50YXJnZXQgOiBcIlwiLFxuICAgICAgbGVuZ3RoOiAoZWRnZXNEZXRhaWxbaV0gIT0gbnVsbCkgPyBlZGdlc0RldGFpbFtpXS5sZW5ndGggOiBcIlwiLFxuICAgICAgeExlbmd0aDogKGVkZ2VzRGV0YWlsW2ldICE9IG51bGwpID8gZWRnZXNEZXRhaWxbaV0ueExlbmd0aCA6IFwiXCIsXG4gICAgICB5TGVuZ3RoOiAoZWRnZXNEZXRhaWxbaV0gIT0gbnVsbCkgPyBlZGdlc0RldGFpbFtpXS55TGVuZ3RoIDogXCJcIlxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGVEYXRhO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUucnVuU3ByaW5nRW1iZWRkZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuaW5pdGlhbEFuaW1hdGlvblBlcmlvZCA9IDI1O1xuICB0aGlzLmFuaW1hdGlvblBlcmlvZCA9IHRoaXMuaW5pdGlhbEFuaW1hdGlvblBlcmlvZDtcbiAgdmFyIGxheW91dEVuZGVkID0gZmFsc2U7XG4gIFxuICAvLyBJZiBhbWluYXRlIG9wdGlvbiBpcyAnZHVyaW5nJyBzaWduYWwgdGhhdCBsYXlvdXQgaXMgc3VwcG9zZWQgdG8gc3RhcnQgaXRlcmF0aW5nXG4gIGlmICggRkRMYXlvdXRDb25zdGFudHMuQU5JTUFURSA9PT0gJ2R1cmluZycgKSB7XG4gICAgdGhpcy5lbWl0KCdsYXlvdXRzdGFydGVkJyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gSWYgYW1pbmF0ZSBvcHRpb24gaXMgJ2R1cmluZycgdGljaygpIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIG9uIGluZGV4LmpzXG4gICAgd2hpbGUgKCFsYXlvdXRFbmRlZCkge1xuICAgICAgbGF5b3V0RW5kZWQgPSB0aGlzLnRpY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYXBoTWFuYWdlci51cGRhdGVCb3VuZHMoKTtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2FsY3VsYXRlTm9kZXNUb0FwcGx5R3Jhdml0YXRpb25UbyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5vZGVMaXN0ID0gW107XG4gIHZhciBncmFwaDtcblxuICB2YXIgZ3JhcGhzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0R3JhcGhzKCk7XG4gIHZhciBzaXplID0gZ3JhcGhzLmxlbmd0aDtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gIHtcbiAgICBncmFwaCA9IGdyYXBoc1tpXTtcblxuICAgIGdyYXBoLnVwZGF0ZUNvbm5lY3RlZCgpO1xuXG4gICAgaWYgKCFncmFwaC5pc0Nvbm5lY3RlZClcbiAgICB7XG4gICAgICBub2RlTGlzdCA9IG5vZGVMaXN0LmNvbmNhdChncmFwaC5nZXROb2RlcygpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZUxpc3Q7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jYWxjTm9PZkNoaWxkcmVuRm9yQWxsTm9kZXMgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgbm9kZTtcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcbiAgXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBhbGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgICAgbm9kZSA9IGFsbE5vZGVzW2ldO1xuICAgICAgbm9kZS5ub09mQ2hpbGRyZW4gPSBub2RlLmdldE5vT2ZDaGlsZHJlbigpO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVCZW5kcG9pbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWRnZXMgPSBbXTtcbiAgZWRnZXMgPSBlZGdlcy5jb25jYXQodGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsRWRnZXMoKSk7XG4gIHZhciB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG5cbiAgICBpZiAoIXZpc2l0ZWQuY29udGFpbnMoZWRnZSkpXG4gICAge1xuICAgICAgdmFyIHNvdXJjZSA9IGVkZ2UuZ2V0U291cmNlKCk7XG4gICAgICB2YXIgdGFyZ2V0ID0gZWRnZS5nZXRUYXJnZXQoKTtcblxuICAgICAgaWYgKHNvdXJjZSA9PSB0YXJnZXQpXG4gICAgICB7XG4gICAgICAgIGVkZ2UuZ2V0QmVuZHBvaW50cygpLnB1c2gobmV3IFBvaW50RCgpKTtcbiAgICAgICAgZWRnZS5nZXRCZW5kcG9pbnRzKCkucHVzaChuZXcgUG9pbnREKCkpO1xuICAgICAgICB0aGlzLmNyZWF0ZUR1bW15Tm9kZXNGb3JCZW5kcG9pbnRzKGVkZ2UpO1xuICAgICAgICB2aXNpdGVkLmFkZChlZGdlKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgdmFyIGVkZ2VMaXN0ID0gW107XG5cbiAgICAgICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQoc291cmNlLmdldEVkZ2VMaXN0VG9Ob2RlKHRhcmdldCkpO1xuICAgICAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdCh0YXJnZXQuZ2V0RWRnZUxpc3RUb05vZGUoc291cmNlKSk7XG5cbiAgICAgICAgaWYgKCF2aXNpdGVkLmNvbnRhaW5zKGVkZ2VMaXN0WzBdKSlcbiAgICAgICAge1xuICAgICAgICAgIGlmIChlZGdlTGlzdC5sZW5ndGggPiAxKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhciBrO1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGVkZ2VMaXN0Lmxlbmd0aDsgaysrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgbXVsdGlFZGdlID0gZWRnZUxpc3Rba107XG4gICAgICAgICAgICAgIG11bHRpRWRnZS5nZXRCZW5kcG9pbnRzKCkucHVzaChuZXcgUG9pbnREKCkpO1xuICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUR1bW15Tm9kZXNGb3JCZW5kcG9pbnRzKG11bHRpRWRnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZpc2l0ZWQuYWRkQWxsKGxpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZpc2l0ZWQuc2l6ZSgpID09IGVkZ2VzLmxlbmd0aClcbiAgICB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnBvc2l0aW9uTm9kZXNSYWRpYWxseSA9IGZ1bmN0aW9uIChmb3Jlc3QpIHtcbiAgLy8gV2UgdGlsZSB0aGUgdHJlZXMgdG8gYSBncmlkIHJvdyBieSByb3c7IGZpcnN0IHRyZWUgc3RhcnRzIGF0ICgwLDApXG4gIHZhciBjdXJyZW50U3RhcnRpbmdQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcbiAgdmFyIG51bWJlck9mQ29sdW1ucyA9IE1hdGguY2VpbChNYXRoLnNxcnQoZm9yZXN0Lmxlbmd0aCkpO1xuICB2YXIgaGVpZ2h0ID0gMDtcbiAgdmFyIGN1cnJlbnRZID0gMDtcbiAgdmFyIGN1cnJlbnRYID0gMDtcbiAgdmFyIHBvaW50ID0gbmV3IFBvaW50RCgwLCAwKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZvcmVzdC5sZW5ndGg7IGkrKylcbiAge1xuICAgIGlmIChpICUgbnVtYmVyT2ZDb2x1bW5zID09IDApXG4gICAge1xuICAgICAgLy8gU3RhcnQgb2YgYSBuZXcgcm93LCBtYWtlIHRoZSB4IGNvb3JkaW5hdGUgMCwgaW5jcmVtZW50IHRoZVxuICAgICAgLy8geSBjb29yZGluYXRlIHdpdGggdGhlIG1heCBoZWlnaHQgb2YgdGhlIHByZXZpb3VzIHJvd1xuICAgICAgY3VycmVudFggPSAwO1xuICAgICAgY3VycmVudFkgPSBoZWlnaHQ7XG5cbiAgICAgIGlmIChpICE9IDApXG4gICAgICB7XG4gICAgICAgIGN1cnJlbnRZICs9IENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTjtcbiAgICAgIH1cblxuICAgICAgaGVpZ2h0ID0gMDtcbiAgICB9XG5cbiAgICB2YXIgdHJlZSA9IGZvcmVzdFtpXTtcblxuICAgIC8vIEZpbmQgdGhlIGNlbnRlciBvZiB0aGUgdHJlZVxuICAgIHZhciBjZW50ZXJOb2RlID0gTGF5b3V0LmZpbmRDZW50ZXJPZlRyZWUodHJlZSk7XG5cbiAgICAvLyBTZXQgdGhlIHN0YXJpbmcgcG9pbnQgb2YgdGhlIG5leHQgdHJlZVxuICAgIGN1cnJlbnRTdGFydGluZ1BvaW50LnggPSBjdXJyZW50WDtcbiAgICBjdXJyZW50U3RhcnRpbmdQb2ludC55ID0gY3VycmVudFk7XG5cbiAgICAvLyBEbyBhIHJhZGlhbCBsYXlvdXQgc3RhcnRpbmcgd2l0aCB0aGUgY2VudGVyXG4gICAgcG9pbnQgPVxuICAgICAgICAgICAgQ29TRUxheW91dC5yYWRpYWxMYXlvdXQodHJlZSwgY2VudGVyTm9kZSwgY3VycmVudFN0YXJ0aW5nUG9pbnQpO1xuXG4gICAgaWYgKHBvaW50LnkgPiBoZWlnaHQpXG4gICAge1xuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vcihwb2ludC55KTtcbiAgICB9XG5cbiAgICBjdXJyZW50WCA9IE1hdGguZmxvb3IocG9pbnQueCArIENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTik7XG4gIH1cblxuICB0aGlzLnRyYW5zZm9ybShcbiAgICAgICAgICBuZXcgUG9pbnREKExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWCAtIHBvaW50LnggLyAyLFxuICAgICAgICAgICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9ZIC0gcG9pbnQueSAvIDIpKTtcbn07XG5cbkNvU0VMYXlvdXQucmFkaWFsTGF5b3V0ID0gZnVuY3Rpb24gKHRyZWUsIGNlbnRlck5vZGUsIHN0YXJ0aW5nUG9pbnQpIHtcbiAgdmFyIHJhZGlhbFNlcCA9IE1hdGgubWF4KHRoaXMubWF4RGlhZ29uYWxJblRyZWUodHJlZSksXG4gICAgICAgICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX1JBRElBTF9TRVBBUkFUSU9OKTtcbiAgQ29TRUxheW91dC5icmFuY2hSYWRpYWxMYXlvdXQoY2VudGVyTm9kZSwgbnVsbCwgMCwgMzU5LCAwLCByYWRpYWxTZXApO1xuICB2YXIgYm91bmRzID0gTEdyYXBoLmNhbGN1bGF0ZUJvdW5kcyh0cmVlKTtcblxuICB2YXIgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybSgpO1xuICB0cmFuc2Zvcm0uc2V0RGV2aWNlT3JnWChib3VuZHMuZ2V0TWluWCgpKTtcbiAgdHJhbnNmb3JtLnNldERldmljZU9yZ1koYm91bmRzLmdldE1pblkoKSk7XG4gIHRyYW5zZm9ybS5zZXRXb3JsZE9yZ1goc3RhcnRpbmdQb2ludC54KTtcbiAgdHJhbnNmb3JtLnNldFdvcmxkT3JnWShzdGFydGluZ1BvaW50LnkpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKylcbiAge1xuICAgIHZhciBub2RlID0gdHJlZVtpXTtcbiAgICBub2RlLnRyYW5zZm9ybSh0cmFuc2Zvcm0pO1xuICB9XG5cbiAgdmFyIGJvdHRvbVJpZ2h0ID1cbiAgICAgICAgICBuZXcgUG9pbnREKGJvdW5kcy5nZXRNYXhYKCksIGJvdW5kcy5nZXRNYXhZKCkpO1xuXG4gIHJldHVybiB0cmFuc2Zvcm0uaW52ZXJzZVRyYW5zZm9ybVBvaW50KGJvdHRvbVJpZ2h0KTtcbn07XG5cbkNvU0VMYXlvdXQuYnJhbmNoUmFkaWFsTGF5b3V0ID0gZnVuY3Rpb24gKG5vZGUsIHBhcmVudE9mTm9kZSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGRpc3RhbmNlLCByYWRpYWxTZXBhcmF0aW9uKSB7XG4gIC8vIEZpcnN0LCBwb3NpdGlvbiB0aGlzIG5vZGUgYnkgZmluZGluZyBpdHMgYW5nbGUuXG4gIHZhciBoYWxmSW50ZXJ2YWwgPSAoKGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSkgKyAxKSAvIDI7XG5cbiAgaWYgKGhhbGZJbnRlcnZhbCA8IDApXG4gIHtcbiAgICBoYWxmSW50ZXJ2YWwgKz0gMTgwO1xuICB9XG5cbiAgdmFyIG5vZGVBbmdsZSA9IChoYWxmSW50ZXJ2YWwgKyBzdGFydEFuZ2xlKSAlIDM2MDtcbiAgdmFyIHRldGEgPSAobm9kZUFuZ2xlICogSUdlb21ldHJ5LlRXT19QSSkgLyAzNjA7XG5cbiAgLy8gTWFrZSBwb2xhciB0byBqYXZhIGNvcmRpbmF0ZSBjb252ZXJzaW9uLlxuICB2YXIgY29zX3RldGEgPSBNYXRoLmNvcyh0ZXRhKTtcbiAgdmFyIHhfID0gZGlzdGFuY2UgKiBNYXRoLmNvcyh0ZXRhKTtcbiAgdmFyIHlfID0gZGlzdGFuY2UgKiBNYXRoLnNpbih0ZXRhKTtcblxuICBub2RlLnNldENlbnRlcih4XywgeV8pO1xuXG4gIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlIGFuZCByZWN1cnNpdmVseSBjYWxsIHRoaXNcbiAgLy8gZnVuY3Rpb24uXG4gIHZhciBuZWlnaGJvckVkZ2VzID0gW107XG4gIG5laWdoYm9yRWRnZXMgPSBuZWlnaGJvckVkZ2VzLmNvbmNhdChub2RlLmdldEVkZ2VzKCkpO1xuICB2YXIgY2hpbGRDb3VudCA9IG5laWdoYm9yRWRnZXMubGVuZ3RoO1xuXG4gIGlmIChwYXJlbnRPZk5vZGUgIT0gbnVsbClcbiAge1xuICAgIGNoaWxkQ291bnQtLTtcbiAgfVxuXG4gIHZhciBicmFuY2hDb3VudCA9IDA7XG5cbiAgdmFyIGluY0VkZ2VzQ291bnQgPSBuZWlnaGJvckVkZ2VzLmxlbmd0aDtcbiAgdmFyIHN0YXJ0SW5kZXg7XG5cbiAgdmFyIGVkZ2VzID0gbm9kZS5nZXRFZGdlc0JldHdlZW4ocGFyZW50T2ZOb2RlKTtcblxuICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgZWRnZXMsIHBydW5lIHRoZW0gdW50aWwgdGhlcmUgcmVtYWlucyBvbmx5IG9uZVxuICAvLyBlZGdlLlxuICB3aGlsZSAoZWRnZXMubGVuZ3RoID4gMSlcbiAge1xuICAgIC8vbmVpZ2hib3JFZGdlcy5yZW1vdmUoZWRnZXMucmVtb3ZlKDApKTtcbiAgICB2YXIgdGVtcCA9IGVkZ2VzWzBdO1xuICAgIGVkZ2VzLnNwbGljZSgwLCAxKTtcbiAgICB2YXIgaW5kZXggPSBuZWlnaGJvckVkZ2VzLmluZGV4T2YodGVtcCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIG5laWdoYm9yRWRnZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgaW5jRWRnZXNDb3VudC0tO1xuICAgIGNoaWxkQ291bnQtLTtcbiAgfVxuXG4gIGlmIChwYXJlbnRPZk5vZGUgIT0gbnVsbClcbiAge1xuICAgIC8vYXNzZXJ0IGVkZ2VzLmxlbmd0aCA9PSAxO1xuICAgIHN0YXJ0SW5kZXggPSAobmVpZ2hib3JFZGdlcy5pbmRleE9mKGVkZ2VzWzBdKSArIDEpICUgaW5jRWRnZXNDb3VudDtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICBzdGFydEluZGV4ID0gMDtcbiAgfVxuXG4gIHZhciBzdGVwQW5nbGUgPSBNYXRoLmFicyhlbmRBbmdsZSAtIHN0YXJ0QW5nbGUpIC8gY2hpbGRDb3VudDtcblxuICBmb3IgKHZhciBpID0gc3RhcnRJbmRleDtcbiAgICAgICAgICBicmFuY2hDb3VudCAhPSBjaGlsZENvdW50O1xuICAgICAgICAgIGkgPSAoKytpKSAlIGluY0VkZ2VzQ291bnQpXG4gIHtcbiAgICB2YXIgY3VycmVudE5laWdoYm9yID1cbiAgICAgICAgICAgIG5laWdoYm9yRWRnZXNbaV0uZ2V0T3RoZXJFbmQobm9kZSk7XG5cbiAgICAvLyBEb24ndCBiYWNrIHRyYXZlcnNlIHRvIHJvb3Qgbm9kZSBpbiBjdXJyZW50IHRyZWUuXG4gICAgaWYgKGN1cnJlbnROZWlnaGJvciA9PSBwYXJlbnRPZk5vZGUpXG4gICAge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkU3RhcnRBbmdsZSA9XG4gICAgICAgICAgICAoc3RhcnRBbmdsZSArIGJyYW5jaENvdW50ICogc3RlcEFuZ2xlKSAlIDM2MDtcbiAgICB2YXIgY2hpbGRFbmRBbmdsZSA9IChjaGlsZFN0YXJ0QW5nbGUgKyBzdGVwQW5nbGUpICUgMzYwO1xuXG4gICAgQ29TRUxheW91dC5icmFuY2hSYWRpYWxMYXlvdXQoY3VycmVudE5laWdoYm9yLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGNoaWxkU3RhcnRBbmdsZSwgY2hpbGRFbmRBbmdsZSxcbiAgICAgICAgICAgIGRpc3RhbmNlICsgcmFkaWFsU2VwYXJhdGlvbiwgcmFkaWFsU2VwYXJhdGlvbik7XG5cbiAgICBicmFuY2hDb3VudCsrO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0Lm1heERpYWdvbmFsSW5UcmVlID0gZnVuY3Rpb24gKHRyZWUpIHtcbiAgdmFyIG1heERpYWdvbmFsID0gSW50ZWdlci5NSU5fVkFMVUU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgdmFyIG5vZGUgPSB0cmVlW2ldO1xuICAgIHZhciBkaWFnb25hbCA9IG5vZGUuZ2V0RGlhZ29uYWwoKTtcblxuICAgIGlmIChkaWFnb25hbCA+IG1heERpYWdvbmFsKVxuICAgIHtcbiAgICAgIG1heERpYWdvbmFsID0gZGlhZ29uYWw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1heERpYWdvbmFsO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvblJhbmdlID0gZnVuY3Rpb24gKCkge1xuICAvLyBmb3JtdWxhIGlzIDIgeCAobGV2ZWwgKyAxKSB4IGlkZWFsRWRnZUxlbmd0aFxuICByZXR1cm4gKDIgKiAodGhpcy5sZXZlbCArIDEpICogdGhpcy5pZGVhbEVkZ2VMZW5ndGgpO1xufTtcblxuLy8gVGlsaW5nIG1ldGhvZHNcblxuLy8gR3JvdXAgemVybyBkZWdyZWUgbWVtYmVycyB3aG9zZSBwYXJlbnRzIGFyZSBub3QgdG8gYmUgdGlsZWQsIGNyZWF0ZSBkdW1teSBwYXJlbnRzIHdoZXJlIG5lZWRlZCBhbmQgZmlsbCBtZW1iZXJHcm91cHMgYnkgdGhlaXIgZHVtbXAgcGFyZW50IGlkJ3NcbkNvU0VMYXlvdXQucHJvdG90eXBlLmdyb3VwWmVyb0RlZ3JlZU1lbWJlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgLy8gYXJyYXkgb2YgW3BhcmVudF9pZCB4IG9uZURlZ3JlZU5vZGVfaWRdXG4gIHZhciB0ZW1wTWVtYmVyR3JvdXBzID0ge307IC8vIEEgdGVtcG9yYXJ5IG1hcCBvZiBwYXJlbnQgbm9kZSBhbmQgaXRzIHplcm8gZGVncmVlIG1lbWJlcnNcbiAgdGhpcy5tZW1iZXJHcm91cHMgPSB7fTsgLy8gQSBtYXAgb2YgZHVtbXkgcGFyZW50IG5vZGUgYW5kIGl0cyB6ZXJvIGRlZ3JlZSBtZW1iZXJzIHdob3NlIHBhcmVudHMgYXJlIG5vdCB0byBiZSB0aWxlZFxuICB0aGlzLmlkVG9EdW1teU5vZGUgPSB7fTsgLy8gQSBtYXAgb2YgaWQgdG8gZHVtbXkgbm9kZSBcbiAgXG4gIHZhciB6ZXJvRGVncmVlID0gW107IC8vIExpc3Qgb2YgemVybyBkZWdyZWUgbm9kZXMgd2hvc2UgcGFyZW50cyBhcmUgbm90IHRvIGJlIHRpbGVkXG4gIHZhciBhbGxOb2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XG5cbiAgLy8gRmlsbCB6ZXJvIGRlZ3JlZSBsaXN0XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IGFsbE5vZGVzW2ldO1xuICAgIHZhciBwYXJlbnQgPSBub2RlLmdldFBhcmVudCgpO1xuICAgIC8vIElmIGEgbm9kZSBoYXMgemVybyBkZWdyZWUgYW5kIGl0cyBwYXJlbnQgaXMgbm90IHRvIGJlIHRpbGVkIGlmIGV4aXN0cyBhZGQgdGhhdCBub2RlIHRvIHplcm9EZWdyZXMgbGlzdFxuICAgIGlmICh0aGlzLmdldE5vZGVEZWdyZWVXaXRoQ2hpbGRyZW4obm9kZSkgPT09IDAgJiYgKCBwYXJlbnQuaWQgPT0gdW5kZWZpbmVkIHx8ICF0aGlzLmdldFRvQmVUaWxlZChwYXJlbnQpICkgKSB7XG4gICAgICB6ZXJvRGVncmVlLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbWFwIG9mIHBhcmVudCBub2RlIGFuZCBpdHMgemVybyBkZWdyZWUgbWVtYmVyc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHplcm9EZWdyZWUubGVuZ3RoOyBpKyspXG4gIHtcbiAgICB2YXIgbm9kZSA9IHplcm9EZWdyZWVbaV07IC8vIFplcm8gZGVncmVlIG5vZGUgaXRzZWxmXG4gICAgdmFyIHBfaWQgPSBub2RlLmdldFBhcmVudCgpLmlkOyAvLyBQYXJlbnQgaWRcblxuICAgIGlmICh0eXBlb2YgdGVtcE1lbWJlckdyb3Vwc1twX2lkXSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgIHRlbXBNZW1iZXJHcm91cHNbcF9pZF0gPSBbXTtcblxuICAgIHRlbXBNZW1iZXJHcm91cHNbcF9pZF0gPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdLmNvbmNhdChub2RlKTsgLy8gUHVzaCBub2RlIHRvIHRoZSBsaXN0IGJlbG9uZ3MgdG8gaXRzIHBhcmVudCBpbiB0ZW1wTWVtYmVyR3JvdXBzXG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYXQgbGVhc3QgdHdvIG5vZGVzIGF0IGEgbGV2ZWwsIGNyZWF0ZSBhIGR1bW15IGNvbXBvdW5kIGZvciB0aGVtXG4gIE9iamVjdC5rZXlzKHRlbXBNZW1iZXJHcm91cHMpLmZvckVhY2goZnVuY3Rpb24ocF9pZCkge1xuICAgIGlmICh0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBkdW1teUNvbXBvdW5kSWQgPSBcIkR1bW15Q29tcG91bmRfXCIgKyBwX2lkOyAvLyBUaGUgaWQgb2YgZHVtbXkgY29tcG91bmQgd2hpY2ggd2lsbCBiZSBjcmVhdGVkIHNvb25cbiAgICAgIHNlbGYubWVtYmVyR3JvdXBzW2R1bW15Q29tcG91bmRJZF0gPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdOyAvLyBBZGQgZHVtbXkgY29tcG91bmQgdG8gbWVtYmVyR3JvdXBzXG5cbiAgICAgIHZhciBwYXJlbnQgPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdWzBdLmdldFBhcmVudCgpOyAvLyBUaGUgcGFyZW50IG9mIHplcm8gZGVncmVlIG5vZGVzIHdpbGwgYmUgdGhlIHBhcmVudCBvZiBuZXcgZHVtbXkgY29tcG91bmRcblxuICAgICAgLy8gQ3JlYXRlIGEgZHVtbXkgY29tcG91bmQgd2l0aCBjYWxjdWxhdGVkIGlkXG4gICAgICB2YXIgZHVtbXlDb21wb3VuZCA9IG5ldyBDb1NFTm9kZShzZWxmLmdyYXBoTWFuYWdlcik7XG4gICAgICBkdW1teUNvbXBvdW5kLmlkID0gZHVtbXlDb21wb3VuZElkO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nTGVmdCA9IHBhcmVudC5wYWRkaW5nTGVmdCB8fCAwO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nUmlnaHQgPSBwYXJlbnQucGFkZGluZ1JpZ2h0IHx8IDA7XG4gICAgICBkdW1teUNvbXBvdW5kLnBhZGRpbmdCb3R0b20gPSBwYXJlbnQucGFkZGluZ0JvdHRvbSB8fCAwO1xuICAgICAgZHVtbXlDb21wb3VuZC5wYWRkaW5nVG9wID0gcGFyZW50LnBhZGRpbmdUb3AgfHwgMDtcbiAgICAgIFxuICAgICAgc2VsZi5pZFRvRHVtbXlOb2RlW2R1bW15Q29tcG91bmRJZF0gPSBkdW1teUNvbXBvdW5kO1xuICAgICAgXG4gICAgICB2YXIgZHVtbXlQYXJlbnRHcmFwaCA9IHNlbGYuZ2V0R3JhcGhNYW5hZ2VyKCkuYWRkKHNlbGYubmV3R3JhcGgoKSwgZHVtbXlDb21wb3VuZCk7XG4gICAgICB2YXIgcGFyZW50R3JhcGggPSBwYXJlbnQuZ2V0Q2hpbGQoKTtcblxuICAgICAgLy8gQWRkIGR1bW15IGNvbXBvdW5kIHRvIHBhcmVudCB0aGUgZ3JhcGhcbiAgICAgIHBhcmVudEdyYXBoLmFkZChkdW1teUNvbXBvdW5kKTtcblxuICAgICAgLy8gRm9yIGVhY2ggemVybyBkZWdyZWUgbm9kZSBpbiB0aGlzIGxldmVsIHJlbW92ZSBpdCBmcm9tIGl0cyBwYXJlbnQgZ3JhcGggYW5kIGFkZCBpdCB0byB0aGUgZ3JhcGggb2YgZHVtbXkgcGFyZW50XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBNZW1iZXJHcm91cHNbcF9pZF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0ZW1wTWVtYmVyR3JvdXBzW3BfaWRdW2ldO1xuICAgICAgICBcbiAgICAgICAgcGFyZW50R3JhcGgucmVtb3ZlKG5vZGUpO1xuICAgICAgICBkdW1teVBhcmVudEdyYXBoLmFkZChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xlYXJDb21wb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGlsZEdyYXBoTWFwID0ge307XG4gIHZhciBpZFRvTm9kZSA9IHt9O1xuXG4gIC8vIEdldCBjb21wb3VuZCBvcmRlcmluZyBieSBmaW5kaW5nIHRoZSBpbm5lciBvbmUgZmlyc3RcbiAgdGhpcy5wZXJmb3JtREZTT25Db21wb3VuZHMoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29tcG91bmRPcmRlci5sZW5ndGg7IGkrKykge1xuICAgIFxuICAgIGlkVG9Ob2RlW3RoaXMuY29tcG91bmRPcmRlcltpXS5pZF0gPSB0aGlzLmNvbXBvdW5kT3JkZXJbaV07XG4gICAgY2hpbGRHcmFwaE1hcFt0aGlzLmNvbXBvdW5kT3JkZXJbaV0uaWRdID0gW10uY29uY2F0KHRoaXMuY29tcG91bmRPcmRlcltpXS5nZXRDaGlsZCgpLmdldE5vZGVzKCkpO1xuXG4gICAgLy8gUmVtb3ZlIGNoaWxkcmVuIG9mIGNvbXBvdW5kc1xuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlbW92ZSh0aGlzLmNvbXBvdW5kT3JkZXJbaV0uZ2V0Q2hpbGQoKSk7XG4gICAgdGhpcy5jb21wb3VuZE9yZGVyW2ldLmNoaWxkID0gbnVsbDtcbiAgfVxuICBcbiAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2RlcygpO1xuICBcbiAgLy8gVGlsZSB0aGUgcmVtb3ZlZCBjaGlsZHJlblxuICB0aGlzLnRpbGVDb21wb3VuZE1lbWJlcnMoY2hpbGRHcmFwaE1hcCwgaWRUb05vZGUpO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xlYXJaZXJvRGVncmVlTWVtYmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgdGlsZWRaZXJvRGVncmVlUGFjayA9IHRoaXMudGlsZWRaZXJvRGVncmVlUGFjayA9IFtdO1xuXG4gIE9iamVjdC5rZXlzKHRoaXMubWVtYmVyR3JvdXBzKS5mb3JFYWNoKGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNvbXBvdW5kTm9kZSA9IHNlbGYuaWRUb0R1bW15Tm9kZVtpZF07IC8vIEdldCB0aGUgZHVtbXkgY29tcG91bmRcblxuICAgIHRpbGVkWmVyb0RlZ3JlZVBhY2tbaWRdID0gc2VsZi50aWxlTm9kZXMoc2VsZi5tZW1iZXJHcm91cHNbaWRdLCBjb21wb3VuZE5vZGUucGFkZGluZ0xlZnQgKyBjb21wb3VuZE5vZGUucGFkZGluZ1JpZ2h0KTtcblxuICAgIC8vIFNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZHVtbXkgY29tcG91bmQgYXMgY2FsY3VsYXRlZFxuICAgIGNvbXBvdW5kTm9kZS5yZWN0LndpZHRoID0gdGlsZWRaZXJvRGVncmVlUGFja1tpZF0ud2lkdGg7XG4gICAgY29tcG91bmROb2RlLnJlY3QuaGVpZ2h0ID0gdGlsZWRaZXJvRGVncmVlUGFja1tpZF0uaGVpZ2h0O1xuICB9KTtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnJlcG9wdWxhdGVDb21wb3VuZHMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSB0aGlzLmNvbXBvdW5kT3JkZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbENvbXBvdW5kTm9kZSA9IHRoaXMuY29tcG91bmRPcmRlcltpXTtcbiAgICB2YXIgaWQgPSBsQ29tcG91bmROb2RlLmlkO1xuICAgIHZhciBob3Jpem9udGFsTWFyZ2luID0gbENvbXBvdW5kTm9kZS5wYWRkaW5nTGVmdDtcbiAgICB2YXIgdmVydGljYWxNYXJnaW4gPSBsQ29tcG91bmROb2RlLnBhZGRpbmdUb3A7XG5cbiAgICB0aGlzLmFkanVzdExvY2F0aW9ucyh0aGlzLnRpbGVkTWVtYmVyUGFja1tpZF0sIGxDb21wb3VuZE5vZGUucmVjdC54LCBsQ29tcG91bmROb2RlLnJlY3QueSwgaG9yaXpvbnRhbE1hcmdpbiwgdmVydGljYWxNYXJnaW4pO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5yZXBvcHVsYXRlWmVyb0RlZ3JlZU1lbWJlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHRpbGVkUGFjayA9IHRoaXMudGlsZWRaZXJvRGVncmVlUGFjaztcbiAgXG4gIE9iamVjdC5rZXlzKHRpbGVkUGFjaykuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgIHZhciBjb21wb3VuZE5vZGUgPSBzZWxmLmlkVG9EdW1teU5vZGVbaWRdOyAvLyBHZXQgdGhlIGR1bW15IGNvbXBvdW5kIGJ5IGl0cyBpZFxuICAgIHZhciBob3Jpem9udGFsTWFyZ2luID0gY29tcG91bmROb2RlLnBhZGRpbmdMZWZ0O1xuICAgIHZhciB2ZXJ0aWNhbE1hcmdpbiA9IGNvbXBvdW5kTm9kZS5wYWRkaW5nVG9wO1xuXG4gICAgLy8gQWRqdXN0IHRoZSBwb3NpdGlvbnMgb2Ygbm9kZXMgd3J0IGl0cyBjb21wb3VuZFxuICAgIHNlbGYuYWRqdXN0TG9jYXRpb25zKHRpbGVkUGFja1tpZF0sIGNvbXBvdW5kTm9kZS5yZWN0LngsIGNvbXBvdW5kTm9kZS5yZWN0LnksIGhvcml6b250YWxNYXJnaW4sIHZlcnRpY2FsTWFyZ2luKTtcbiAgfSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRUb0JlVGlsZWQgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgaWQgPSBub2RlLmlkO1xuICAvL2ZpcnN0bHkgY2hlY2sgdGhlIHByZXZpb3VzIHJlc3VsdHNcbiAgaWYgKHRoaXMudG9CZVRpbGVkW2lkXSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHRoaXMudG9CZVRpbGVkW2lkXTtcbiAgfVxuXG4gIC8vb25seSBjb21wb3VuZCBub2RlcyBhcmUgdG8gYmUgdGlsZWRcbiAgdmFyIGNoaWxkR3JhcGggPSBub2RlLmdldENoaWxkKCk7XG4gIGlmIChjaGlsZEdyYXBoID09IG51bGwpIHtcbiAgICB0aGlzLnRvQmVUaWxlZFtpZF0gPSBmYWxzZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY2hpbGRyZW4gPSBjaGlsZEdyYXBoLmdldE5vZGVzKCk7IC8vIEdldCB0aGUgY2hpbGRyZW4gbm9kZXNcblxuICAvL2EgY29tcG91bmQgbm9kZSBpcyBub3QgdG8gYmUgdGlsZWQgaWYgYWxsIG9mIGl0cyBjb21wb3VuZCBjaGlsZHJlbiBhcmUgbm90IHRvIGJlIHRpbGVkXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdGhlQ2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICh0aGlzLmdldE5vZGVEZWdyZWUodGhlQ2hpbGQpID4gMCkge1xuICAgICAgdGhpcy50b0JlVGlsZWRbaWRdID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9wYXNzIHRoZSBjaGlsZHJlbiBub3QgaGF2aW5nIHRoZSBjb21wb3VuZCBzdHJ1Y3R1cmVcbiAgICBpZiAodGhlQ2hpbGQuZ2V0Q2hpbGQoKSA9PSBudWxsKSB7XG4gICAgICB0aGlzLnRvQmVUaWxlZFt0aGVDaGlsZC5pZF0gPSBmYWxzZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5nZXRUb0JlVGlsZWQodGhlQ2hpbGQpKSB7XG4gICAgICB0aGlzLnRvQmVUaWxlZFtpZF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgdGhpcy50b0JlVGlsZWRbaWRdID0gdHJ1ZTtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBHZXQgZGVncmVlIG9mIGEgbm9kZSBkZXBlbmRpbmcgb2YgaXRzIGVkZ2VzIGFuZCBpbmRlcGVuZGVudCBvZiBpdHMgY2hpbGRyZW5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldE5vZGVEZWdyZWUgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgaWQgPSBub2RlLmlkO1xuICB2YXIgZWRnZXMgPSBub2RlLmdldEVkZ2VzKCk7XG4gIHZhciBkZWdyZWUgPSAwO1xuICBcbiAgLy8gRm9yIHRoZSBlZGdlcyBjb25uZWN0ZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgaWYgKGVkZ2UuZ2V0U291cmNlKCkuaWQgIT09IGVkZ2UuZ2V0VGFyZ2V0KCkuaWQpIHtcbiAgICAgIGRlZ3JlZSA9IGRlZ3JlZSArIDE7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWdyZWU7XG59O1xuXG4vLyBHZXQgZGVncmVlIG9mIGEgbm9kZSB3aXRoIGl0cyBjaGlsZHJlblxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0Tm9kZURlZ3JlZVdpdGhDaGlsZHJlbiA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBkZWdyZWUgPSB0aGlzLmdldE5vZGVEZWdyZWUobm9kZSk7XG4gIGlmIChub2RlLmdldENoaWxkKCkgPT0gbnVsbCkge1xuICAgIHJldHVybiBkZWdyZWU7XG4gIH1cbiAgdmFyIGNoaWxkcmVuID0gbm9kZS5nZXRDaGlsZCgpLmdldE5vZGVzKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICBkZWdyZWUgKz0gdGhpcy5nZXROb2RlRGVncmVlV2l0aENoaWxkcmVuKGNoaWxkKTtcbiAgfVxuICByZXR1cm4gZGVncmVlO1xufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUucGVyZm9ybURGU09uQ29tcG91bmRzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNvbXBvdW5kT3JkZXIgPSBbXTtcbiAgdGhpcy5maWxsQ29tcGV4T3JkZXJCeURGUyh0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5maWxsQ29tcGV4T3JkZXJCeURGUyA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgaWYgKGNoaWxkLmdldENoaWxkKCkgIT0gbnVsbCkge1xuICAgICAgdGhpcy5maWxsQ29tcGV4T3JkZXJCeURGUyhjaGlsZC5nZXRDaGlsZCgpLmdldE5vZGVzKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXRUb0JlVGlsZWQoY2hpbGQpKSB7XG4gICAgICB0aGlzLmNvbXBvdW5kT3JkZXIucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiogVGhpcyBtZXRob2QgcGxhY2VzIGVhY2ggemVybyBkZWdyZWUgbWVtYmVyIHdydCBnaXZlbiAoeCx5KSBjb29yZGluYXRlcyAodG9wIGxlZnQpLlxuKi9cbkNvU0VMYXlvdXQucHJvdG90eXBlLmFkanVzdExvY2F0aW9ucyA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24sIHgsIHksIGNvbXBvdW5kSG9yaXpvbnRhbE1hcmdpbiwgY29tcG91bmRWZXJ0aWNhbE1hcmdpbikge1xuICB4ICs9IGNvbXBvdW5kSG9yaXpvbnRhbE1hcmdpbjtcbiAgeSArPSBjb21wb3VuZFZlcnRpY2FsTWFyZ2luO1xuXG4gIHZhciBsZWZ0ID0geDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHJvdyA9IG9yZ2FuaXphdGlvbi5yb3dzW2ldO1xuICAgIHggPSBsZWZ0O1xuICAgIHZhciBtYXhIZWlnaHQgPSAwO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciBsbm9kZSA9IHJvd1tqXTtcblxuICAgICAgbG5vZGUucmVjdC54ID0geDsvLyArIGxub2RlLnJlY3Qud2lkdGggLyAyO1xuICAgICAgbG5vZGUucmVjdC55ID0geTsvLyArIGxub2RlLnJlY3QuaGVpZ2h0IC8gMjtcblxuICAgICAgeCArPSBsbm9kZS5yZWN0LndpZHRoICsgb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nO1xuXG4gICAgICBpZiAobG5vZGUucmVjdC5oZWlnaHQgPiBtYXhIZWlnaHQpXG4gICAgICAgIG1heEhlaWdodCA9IGxub2RlLnJlY3QuaGVpZ2h0O1xuICAgIH1cblxuICAgIHkgKz0gbWF4SGVpZ2h0ICsgb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZztcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGlsZUNvbXBvdW5kTWVtYmVycyA9IGZ1bmN0aW9uIChjaGlsZEdyYXBoTWFwLCBpZFRvTm9kZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMudGlsZWRNZW1iZXJQYWNrID0gW107XG5cbiAgT2JqZWN0LmtleXMoY2hpbGRHcmFwaE1hcCkuZm9yRWFjaChmdW5jdGlvbihpZCkge1xuICAgIC8vIEdldCB0aGUgY29tcG91bmQgbm9kZVxuICAgIHZhciBjb21wb3VuZE5vZGUgPSBpZFRvTm9kZVtpZF07XG5cbiAgICBzZWxmLnRpbGVkTWVtYmVyUGFja1tpZF0gPSBzZWxmLnRpbGVOb2RlcyhjaGlsZEdyYXBoTWFwW2lkXSwgY29tcG91bmROb2RlLnBhZGRpbmdMZWZ0ICsgY29tcG91bmROb2RlLnBhZGRpbmdSaWdodCk7XG5cbiAgICBjb21wb3VuZE5vZGUucmVjdC53aWR0aCA9IHNlbGYudGlsZWRNZW1iZXJQYWNrW2lkXS53aWR0aCArIDIwO1xuICAgIGNvbXBvdW5kTm9kZS5yZWN0LmhlaWdodCA9IHNlbGYudGlsZWRNZW1iZXJQYWNrW2lkXS5oZWlnaHQgKyAyMDtcbiAgfSk7XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS50aWxlTm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIG1pbldpZHRoKSB7XG4gIHZhciB2ZXJ0aWNhbFBhZGRpbmcgPSBDb1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX1ZFUlRJQ0FMO1xuICB2YXIgaG9yaXpvbnRhbFBhZGRpbmcgPSBDb1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX0hPUklaT05UQUw7XG4gIHZhciBvcmdhbml6YXRpb24gPSB7XG4gICAgcm93czogW10sXG4gICAgcm93V2lkdGg6IFtdLFxuICAgIHJvd0hlaWdodDogW10sXG4gICAgd2lkdGg6IDIwLFxuICAgIGhlaWdodDogMjAsXG4gICAgdmVydGljYWxQYWRkaW5nOiB2ZXJ0aWNhbFBhZGRpbmcsXG4gICAgaG9yaXpvbnRhbFBhZGRpbmc6IGhvcml6b250YWxQYWRkaW5nXG4gIH07XG5cbiAgLy8gU29ydCB0aGUgbm9kZXMgaW4gYXNjZW5kaW5nIG9yZGVyIG9mIHRoZWlyIGFyZWFzXG4gIG5vZGVzLnNvcnQoZnVuY3Rpb24gKG4xLCBuMikge1xuICAgIGlmIChuMS5yZWN0LndpZHRoICogbjEucmVjdC5oZWlnaHQgPiBuMi5yZWN0LndpZHRoICogbjIucmVjdC5oZWlnaHQpXG4gICAgICByZXR1cm4gLTE7XG4gICAgaWYgKG4xLnJlY3Qud2lkdGggKiBuMS5yZWN0LmhlaWdodCA8IG4yLnJlY3Qud2lkdGggKiBuMi5yZWN0LmhlaWdodClcbiAgICAgIHJldHVybiAxO1xuICAgIHJldHVybiAwO1xuICB9KTtcblxuICAvLyBDcmVhdGUgdGhlIG9yZ2FuaXphdGlvbiAtPiB0aWxlIG1lbWJlcnNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xuICAgIFxuICAgIGlmIChvcmdhbml6YXRpb24ucm93cy5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5pbnNlcnROb2RlVG9Sb3cob3JnYW5pemF0aW9uLCBsTm9kZSwgMCwgbWluV2lkdGgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmNhbkFkZEhvcml6b250YWwob3JnYW5pemF0aW9uLCBsTm9kZS5yZWN0LndpZHRoLCBsTm9kZS5yZWN0LmhlaWdodCkpIHtcbiAgICAgIHRoaXMuaW5zZXJ0Tm9kZVRvUm93KG9yZ2FuaXphdGlvbiwgbE5vZGUsIHRoaXMuZ2V0U2hvcnRlc3RSb3dJbmRleChvcmdhbml6YXRpb24pLCBtaW5XaWR0aCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5pbnNlcnROb2RlVG9Sb3cob3JnYW5pemF0aW9uLCBsTm9kZSwgb3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoLCBtaW5XaWR0aCk7XG4gICAgfVxuXG4gICAgdGhpcy5zaGlmdFRvTGFzdFJvdyhvcmdhbml6YXRpb24pO1xuICB9XG5cbiAgcmV0dXJuIG9yZ2FuaXphdGlvbjtcbn07XG5cbkNvU0VMYXlvdXQucHJvdG90eXBlLmluc2VydE5vZGVUb1JvdyA9IGZ1bmN0aW9uIChvcmdhbml6YXRpb24sIG5vZGUsIHJvd0luZGV4LCBtaW5XaWR0aCkge1xuICB2YXIgbWluQ29tcG91bmRTaXplID0gbWluV2lkdGg7XG5cbiAgLy8gQWRkIG5ldyByb3cgaWYgbmVlZGVkXG4gIGlmIChyb3dJbmRleCA9PSBvcmdhbml6YXRpb24ucm93cy5sZW5ndGgpIHtcbiAgICB2YXIgc2Vjb25kRGltZW5zaW9uID0gW107XG5cbiAgICBvcmdhbml6YXRpb24ucm93cy5wdXNoKHNlY29uZERpbWVuc2lvbik7XG4gICAgb3JnYW5pemF0aW9uLnJvd1dpZHRoLnB1c2gobWluQ29tcG91bmRTaXplKTtcbiAgICBvcmdhbml6YXRpb24ucm93SGVpZ2h0LnB1c2goMCk7XG4gIH1cblxuICAvLyBVcGRhdGUgcm93IHdpZHRoXG4gIHZhciB3ID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW3Jvd0luZGV4XSArIG5vZGUucmVjdC53aWR0aDtcblxuICBpZiAob3JnYW5pemF0aW9uLnJvd3Nbcm93SW5kZXhdLmxlbmd0aCA+IDApIHtcbiAgICB3ICs9IG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZztcbiAgfVxuXG4gIG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtyb3dJbmRleF0gPSB3O1xuICAvLyBVcGRhdGUgY29tcG91bmQgd2lkdGhcbiAgaWYgKG9yZ2FuaXphdGlvbi53aWR0aCA8IHcpIHtcbiAgICBvcmdhbml6YXRpb24ud2lkdGggPSB3O1xuICB9XG5cbiAgLy8gVXBkYXRlIGhlaWdodFxuICB2YXIgaCA9IG5vZGUucmVjdC5oZWlnaHQ7XG4gIGlmIChyb3dJbmRleCA+IDApXG4gICAgaCArPSBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nO1xuXG4gIHZhciBleHRyYUhlaWdodCA9IDA7XG4gIGlmIChoID4gb3JnYW5pemF0aW9uLnJvd0hlaWdodFtyb3dJbmRleF0pIHtcbiAgICBleHRyYUhlaWdodCA9IG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbcm93SW5kZXhdO1xuICAgIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbcm93SW5kZXhdID0gaDtcbiAgICBleHRyYUhlaWdodCA9IG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbcm93SW5kZXhdIC0gZXh0cmFIZWlnaHQ7XG4gIH1cblxuICBvcmdhbml6YXRpb24uaGVpZ2h0ICs9IGV4dHJhSGVpZ2h0O1xuXG4gIC8vIEluc2VydCBub2RlXG4gIG9yZ2FuaXphdGlvbi5yb3dzW3Jvd0luZGV4XS5wdXNoKG5vZGUpO1xufTtcblxuLy9TY2FucyB0aGUgcm93cyBvZiBhbiBvcmdhbml6YXRpb24gYW5kIHJldHVybnMgdGhlIG9uZSB3aXRoIHRoZSBtaW4gd2lkdGhcbkNvU0VMYXlvdXQucHJvdG90eXBlLmdldFNob3J0ZXN0Um93SW5kZXggPSBmdW5jdGlvbiAob3JnYW5pemF0aW9uKSB7XG4gIHZhciByID0gLTE7XG4gIHZhciBtaW4gPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb3JnYW5pemF0aW9uLnJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3JnYW5pemF0aW9uLnJvd1dpZHRoW2ldIDwgbWluKSB7XG4gICAgICByID0gaTtcbiAgICAgIG1pbiA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG4vL1NjYW5zIHRoZSByb3dzIG9mIGFuIG9yZ2FuaXphdGlvbiBhbmQgcmV0dXJucyB0aGUgb25lIHdpdGggdGhlIG1heCB3aWR0aFxuQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0TG9uZ2VzdFJvd0luZGV4ID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbikge1xuICB2YXIgciA9IC0xO1xuICB2YXIgbWF4ID0gTnVtYmVyLk1JTl9WQUxVRTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9yZ2FuaXphdGlvbi5yb3dzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBpZiAob3JnYW5pemF0aW9uLnJvd1dpZHRoW2ldID4gbWF4KSB7XG4gICAgICByID0gaTtcbiAgICAgIG1heCA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcjtcbn07XG5cbi8qKlxuKiBUaGlzIG1ldGhvZCBjaGVja3Mgd2hldGhlciBhZGRpbmcgZXh0cmEgd2lkdGggdG8gdGhlIG9yZ2FuaXphdGlvbiB2aW9sYXRlc1xuKiB0aGUgYXNwZWN0IHJhdGlvKDEpIG9yIG5vdC5cbiovXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jYW5BZGRIb3Jpem9udGFsID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbiwgZXh0cmFXaWR0aCwgZXh0cmFIZWlnaHQpIHtcblxuICB2YXIgc3JpID0gdGhpcy5nZXRTaG9ydGVzdFJvd0luZGV4KG9yZ2FuaXphdGlvbik7XG5cbiAgaWYgKHNyaSA8IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBtaW4gPSBvcmdhbml6YXRpb24ucm93V2lkdGhbc3JpXTtcblxuICBpZiAobWluICsgb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nICsgZXh0cmFXaWR0aCA8PSBvcmdhbml6YXRpb24ud2lkdGgpXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgdmFyIGhEaWZmID0gMDtcblxuICAvLyBBZGRpbmcgdG8gYW4gZXhpc3Rpbmcgcm93XG4gIGlmIChvcmdhbml6YXRpb24ucm93SGVpZ2h0W3NyaV0gPCBleHRyYUhlaWdodCkge1xuICAgIGlmIChzcmkgPiAwKVxuICAgICAgaERpZmYgPSBleHRyYUhlaWdodCArIG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmcgLSBvcmdhbml6YXRpb24ucm93SGVpZ2h0W3NyaV07XG4gIH1cblxuICB2YXIgYWRkX3RvX3Jvd19yYXRpbztcbiAgaWYgKG9yZ2FuaXphdGlvbi53aWR0aCAtIG1pbiA+PSBleHRyYVdpZHRoICsgb3JnYW5pemF0aW9uLmhvcml6b250YWxQYWRkaW5nKSB7XG4gICAgYWRkX3RvX3Jvd19yYXRpbyA9IChvcmdhbml6YXRpb24uaGVpZ2h0ICsgaERpZmYpIC8gKG1pbiArIGV4dHJhV2lkdGggKyBvcmdhbml6YXRpb24uaG9yaXpvbnRhbFBhZGRpbmcpO1xuICB9IGVsc2Uge1xuICAgIGFkZF90b19yb3dfcmF0aW8gPSAob3JnYW5pemF0aW9uLmhlaWdodCArIGhEaWZmKSAvIG9yZ2FuaXphdGlvbi53aWR0aDtcbiAgfVxuXG4gIC8vIEFkZGluZyBhIG5ldyByb3cgZm9yIHRoaXMgbm9kZVxuICBoRGlmZiA9IGV4dHJhSGVpZ2h0ICsgb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZztcbiAgdmFyIGFkZF9uZXdfcm93X3JhdGlvO1xuICBpZiAob3JnYW5pemF0aW9uLndpZHRoIDwgZXh0cmFXaWR0aCkge1xuICAgIGFkZF9uZXdfcm93X3JhdGlvID0gKG9yZ2FuaXphdGlvbi5oZWlnaHQgKyBoRGlmZikgLyBleHRyYVdpZHRoO1xuICB9IGVsc2Uge1xuICAgIGFkZF9uZXdfcm93X3JhdGlvID0gKG9yZ2FuaXphdGlvbi5oZWlnaHQgKyBoRGlmZikgLyBvcmdhbml6YXRpb24ud2lkdGg7XG4gIH1cblxuICBpZiAoYWRkX25ld19yb3dfcmF0aW8gPCAxKVxuICAgIGFkZF9uZXdfcm93X3JhdGlvID0gMSAvIGFkZF9uZXdfcm93X3JhdGlvO1xuXG4gIGlmIChhZGRfdG9fcm93X3JhdGlvIDwgMSlcbiAgICBhZGRfdG9fcm93X3JhdGlvID0gMSAvIGFkZF90b19yb3dfcmF0aW87XG5cbiAgcmV0dXJuIGFkZF90b19yb3dfcmF0aW8gPCBhZGRfbmV3X3Jvd19yYXRpbztcbn07XG5cbi8vSWYgbW92aW5nIHRoZSBsYXN0IG5vZGUgZnJvbSB0aGUgbG9uZ2VzdCByb3cgYW5kIGFkZGluZyBpdCB0byB0aGUgbGFzdFxuLy9yb3cgbWFrZXMgdGhlIGJvdW5kaW5nIGJveCBzbWFsbGVyLCBkbyBpdC5cbkNvU0VMYXlvdXQucHJvdG90eXBlLnNoaWZ0VG9MYXN0Um93ID0gZnVuY3Rpb24gKG9yZ2FuaXphdGlvbikge1xuICB2YXIgbG9uZ2VzdCA9IHRoaXMuZ2V0TG9uZ2VzdFJvd0luZGV4KG9yZ2FuaXphdGlvbik7XG4gIHZhciBsYXN0ID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoLmxlbmd0aCAtIDE7XG4gIHZhciByb3cgPSBvcmdhbml6YXRpb24ucm93c1tsb25nZXN0XTtcbiAgdmFyIG5vZGUgPSByb3dbcm93Lmxlbmd0aCAtIDFdO1xuXG4gIHZhciBkaWZmID0gbm9kZS53aWR0aCArIG9yZ2FuaXphdGlvbi5ob3Jpem9udGFsUGFkZGluZztcblxuICAvLyBDaGVjayBpZiB0aGVyZSBpcyBlbm91Z2ggc3BhY2Ugb24gdGhlIGxhc3Qgcm93XG4gIGlmIChvcmdhbml6YXRpb24ud2lkdGggLSBvcmdhbml6YXRpb24ucm93V2lkdGhbbGFzdF0gPiBkaWZmICYmIGxvbmdlc3QgIT0gbGFzdCkge1xuICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBlbGVtZW50IG9mIHRoZSBsb25nZXN0IHJvd1xuICAgIHJvdy5zcGxpY2UoLTEsIDEpO1xuXG4gICAgLy8gUHVzaCBpdCB0byB0aGUgbGFzdCByb3dcbiAgICBvcmdhbml6YXRpb24ucm93c1tsYXN0XS5wdXNoKG5vZGUpO1xuXG4gICAgb3JnYW5pemF0aW9uLnJvd1dpZHRoW2xvbmdlc3RdID0gb3JnYW5pemF0aW9uLnJvd1dpZHRoW2xvbmdlc3RdIC0gZGlmZjtcbiAgICBvcmdhbml6YXRpb24ucm93V2lkdGhbbGFzdF0gPSBvcmdhbml6YXRpb24ucm93V2lkdGhbbGFzdF0gKyBkaWZmO1xuICAgIG9yZ2FuaXphdGlvbi53aWR0aCA9IG9yZ2FuaXphdGlvbi5yb3dXaWR0aFtpbnN0YW5jZS5nZXRMb25nZXN0Um93SW5kZXgob3JnYW5pemF0aW9uKV07XG5cbiAgICAvLyBVcGRhdGUgaGVpZ2h0cyBvZiB0aGUgb3JnYW5pemF0aW9uXG4gICAgdmFyIG1heEhlaWdodCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3cubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyb3dbaV0uaGVpZ2h0ID4gbWF4SGVpZ2h0KVxuICAgICAgICBtYXhIZWlnaHQgPSByb3dbaV0uaGVpZ2h0O1xuICAgIH1cbiAgICBpZiAobG9uZ2VzdCA+IDApXG4gICAgICBtYXhIZWlnaHQgKz0gb3JnYW5pemF0aW9uLnZlcnRpY2FsUGFkZGluZztcblxuICAgIHZhciBwcmV2VG90YWwgPSBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xvbmdlc3RdICsgb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsYXN0XTtcblxuICAgIG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbG9uZ2VzdF0gPSBtYXhIZWlnaHQ7XG4gICAgaWYgKG9yZ2FuaXphdGlvbi5yb3dIZWlnaHRbbGFzdF0gPCBub2RlLmhlaWdodCArIG9yZ2FuaXphdGlvbi52ZXJ0aWNhbFBhZGRpbmcpXG4gICAgICBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xhc3RdID0gbm9kZS5oZWlnaHQgKyBvcmdhbml6YXRpb24udmVydGljYWxQYWRkaW5nO1xuXG4gICAgdmFyIGZpbmFsVG90YWwgPSBvcmdhbml6YXRpb24ucm93SGVpZ2h0W2xvbmdlc3RdICsgb3JnYW5pemF0aW9uLnJvd0hlaWdodFtsYXN0XTtcbiAgICBvcmdhbml6YXRpb24uaGVpZ2h0ICs9IChmaW5hbFRvdGFsIC0gcHJldlRvdGFsKTtcblxuICAgIHRoaXMuc2hpZnRUb0xhc3RSb3cob3JnYW5pemF0aW9uKTtcbiAgfVxufTtcblxuQ29TRUxheW91dC5wcm90b3R5cGUudGlsaW5nUHJlTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIGlmIChDb1NFQ29uc3RhbnRzLlRJTEUpIHtcbiAgICAvLyBGaW5kIHplcm8gZGVncmVlIG5vZGVzIGFuZCBjcmVhdGUgYSBjb21wb3VuZCBmb3IgZWFjaCBsZXZlbFxuICAgIHRoaXMuZ3JvdXBaZXJvRGVncmVlTWVtYmVycygpO1xuICAgIC8vIFRpbGUgYW5kIGNsZWFyIGNoaWxkcmVuIG9mIGVhY2ggY29tcG91bmRcbiAgICB0aGlzLmNsZWFyQ29tcG91bmRzKCk7XG4gICAgLy8gU2VwYXJhdGVseSB0aWxlIGFuZCBjbGVhciB6ZXJvIGRlZ3JlZSBub2RlcyBmb3IgZWFjaCBsZXZlbFxuICAgIHRoaXMuY2xlYXJaZXJvRGVncmVlTWVtYmVycygpO1xuICB9XG59O1xuXG5Db1NFTGF5b3V0LnByb3RvdHlwZS50aWxpbmdQb3N0TGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIGlmIChDb1NFQ29uc3RhbnRzLlRJTEUpIHtcbiAgICB0aGlzLnJlcG9wdWxhdGVaZXJvRGVncmVlTWVtYmVycygpO1xuICAgIHRoaXMucmVwb3B1bGF0ZUNvbXBvdW5kcygpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VMYXlvdXQ7XG4iLCJ2YXIgRkRMYXlvdXROb2RlID0gcmVxdWlyZSgnLi9GRExheW91dE5vZGUnKTtcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcblxuZnVuY3Rpb24gQ29TRU5vZGUoZ20sIGxvYywgc2l6ZSwgdk5vZGUpIHtcbiAgRkRMYXlvdXROb2RlLmNhbGwodGhpcywgZ20sIGxvYywgc2l6ZSwgdk5vZGUpO1xufVxuXG5cbkNvU0VOb2RlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRkRMYXlvdXROb2RlLnByb3RvdHlwZSk7XG5mb3IgKHZhciBwcm9wIGluIEZETGF5b3V0Tm9kZSkge1xuICBDb1NFTm9kZVtwcm9wXSA9IEZETGF5b3V0Tm9kZVtwcm9wXTtcbn1cblxuQ29TRU5vZGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKVxue1xuICB2YXIgbGF5b3V0ID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0TGF5b3V0KCk7XG4gIHRoaXMuZGlzcGxhY2VtZW50WCA9IGxheW91dC5jb29saW5nRmFjdG9yICpcbiAgICAgICAgICAodGhpcy5zcHJpbmdGb3JjZVggKyB0aGlzLnJlcHVsc2lvbkZvcmNlWCArIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVgpIC8gdGhpcy5ub09mQ2hpbGRyZW47XG4gIHRoaXMuZGlzcGxhY2VtZW50WSA9IGxheW91dC5jb29saW5nRmFjdG9yICpcbiAgICAgICAgICAodGhpcy5zcHJpbmdGb3JjZVkgKyB0aGlzLnJlcHVsc2lvbkZvcmNlWSArIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVkpIC8gdGhpcy5ub09mQ2hpbGRyZW47XG5cblxuICBpZiAoTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRYKSA+IGxheW91dC5jb29saW5nRmFjdG9yICogbGF5b3V0Lm1heE5vZGVEaXNwbGFjZW1lbnQpXG4gIHtcbiAgICB0aGlzLmRpc3BsYWNlbWVudFggPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqIGxheW91dC5tYXhOb2RlRGlzcGxhY2VtZW50ICpcbiAgICAgICAgICAgIElNYXRoLnNpZ24odGhpcy5kaXNwbGFjZW1lbnRYKTtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFkpID4gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudClcbiAge1xuICAgIHRoaXMuZGlzcGxhY2VtZW50WSA9IGxheW91dC5jb29saW5nRmFjdG9yICogbGF5b3V0Lm1heE5vZGVEaXNwbGFjZW1lbnQgKlxuICAgICAgICAgICAgSU1hdGguc2lnbih0aGlzLmRpc3BsYWNlbWVudFkpO1xuICB9XG5cbiAgLy8gYSBzaW1wbGUgbm9kZSwganVzdCBtb3ZlIGl0XG4gIGlmICh0aGlzLmNoaWxkID09IG51bGwpXG4gIHtcbiAgICB0aGlzLm1vdmVCeSh0aGlzLmRpc3BsYWNlbWVudFgsIHRoaXMuZGlzcGxhY2VtZW50WSk7XG4gIH1cbiAgLy8gYW4gZW1wdHkgY29tcG91bmQgbm9kZSwgYWdhaW4ganVzdCBtb3ZlIGl0XG4gIGVsc2UgaWYgKHRoaXMuY2hpbGQuZ2V0Tm9kZXMoKS5sZW5ndGggPT0gMClcbiAge1xuICAgIHRoaXMubW92ZUJ5KHRoaXMuZGlzcGxhY2VtZW50WCwgdGhpcy5kaXNwbGFjZW1lbnRZKTtcbiAgfVxuICAvLyBub24tZW1wdHkgY29tcG91bmQgbm9kZSwgcHJvcG9nYXRlIG1vdmVtZW50IHRvIGNoaWxkcmVuIGFzIHdlbGxcbiAgZWxzZVxuICB7XG4gICAgdGhpcy5wcm9wb2dhdGVEaXNwbGFjZW1lbnRUb0NoaWxkcmVuKHRoaXMuZGlzcGxhY2VtZW50WCxcbiAgICAgICAgICAgIHRoaXMuZGlzcGxhY2VtZW50WSk7XG4gIH1cblxuICBsYXlvdXQudG90YWxEaXNwbGFjZW1lbnQgKz1cbiAgICAgICAgICBNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFgpICsgTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRZKTtcbiAgICAgIFxuICB2YXIgbm9kZURhdGEgPSB7XG4gICAgc3ByaW5nRm9yY2VYOiB0aGlzLnNwcmluZ0ZvcmNlWCxcbiAgICBzcHJpbmdGb3JjZVk6IHRoaXMuc3ByaW5nRm9yY2VZLFxuICAgIHJlcHVsc2lvbkZvcmNlWDogdGhpcy5yZXB1bHNpb25Gb3JjZVgsXG4gICAgcmVwdWxzaW9uRm9yY2VZOiB0aGlzLnJlcHVsc2lvbkZvcmNlWSxcbiAgICBncmF2aXRhdGlvbkZvcmNlWDogdGhpcy5ncmF2aXRhdGlvbkZvcmNlWCxcbiAgICBncmF2aXRhdGlvbkZvcmNlWTogdGhpcy5ncmF2aXRhdGlvbkZvcmNlWSxcbiAgICBkaXNwbGFjZW1lbnRYOiB0aGlzLmRpc3BsYWNlbWVudFgsXG4gICAgZGlzcGxhY2VtZW50WTogdGhpcy5kaXNwbGFjZW1lbnRZXG4gIH07XG4gIFxuICB0aGlzLnNwcmluZ0ZvcmNlWCA9IDA7XG4gIHRoaXMuc3ByaW5nRm9yY2VZID0gMDtcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVggPSAwO1xuICB0aGlzLnJlcHVsc2lvbkZvcmNlWSA9IDA7XG4gIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVggPSAwO1xuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VZID0gMDtcbiAgdGhpcy5kaXNwbGFjZW1lbnRYID0gMDtcbiAgdGhpcy5kaXNwbGFjZW1lbnRZID0gMDtcbiAgXG4gIHJldHVybiBub2RlRGF0YTtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5wcm9wb2dhdGVEaXNwbGFjZW1lbnRUb0NoaWxkcmVuID0gZnVuY3Rpb24gKGRYLCBkWSlcbntcbiAgdmFyIG5vZGVzID0gdGhpcy5nZXRDaGlsZCgpLmdldE5vZGVzKCk7XG4gIHZhciBub2RlO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgIGlmIChub2RlLmdldENoaWxkKCkgPT0gbnVsbClcbiAgICB7XG4gICAgICBub2RlLm1vdmVCeShkWCwgZFkpO1xuICAgICAgbm9kZS5kaXNwbGFjZW1lbnRYICs9IGRYO1xuICAgICAgbm9kZS5kaXNwbGFjZW1lbnRZICs9IGRZO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgbm9kZS5wcm9wb2dhdGVEaXNwbGFjZW1lbnRUb0NoaWxkcmVuKGRYLCBkWSk7XG4gICAgfVxuICB9XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUuc2V0UHJlZDEgPSBmdW5jdGlvbiAocHJlZDEpXG57XG4gIHRoaXMucHJlZDEgPSBwcmVkMTtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5nZXRQcmVkMSA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiBwcmVkMTtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5nZXRQcmVkMiA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiBwcmVkMjtcbn07XG5cbkNvU0VOb2RlLnByb3RvdHlwZS5zZXROZXh0ID0gZnVuY3Rpb24gKG5leHQpXG57XG4gIHRoaXMubmV4dCA9IG5leHQ7XG59O1xuXG5Db1NFTm9kZS5wcm90b3R5cGUuZ2V0TmV4dCA9IGZ1bmN0aW9uICgpXG57XG4gIHJldHVybiBuZXh0O1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLnNldFByb2Nlc3NlZCA9IGZ1bmN0aW9uIChwcm9jZXNzZWQpXG57XG4gIHRoaXMucHJvY2Vzc2VkID0gcHJvY2Vzc2VkO1xufTtcblxuQ29TRU5vZGUucHJvdG90eXBlLmlzUHJvY2Vzc2VkID0gZnVuY3Rpb24gKClcbntcbiAgcmV0dXJuIHByb2Nlc3NlZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29TRU5vZGU7XG4iLCJmdW5jdGlvbiBEaW1lbnNpb25EKHdpZHRoLCBoZWlnaHQpIHtcclxuICB0aGlzLndpZHRoID0gMDtcclxuICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgaWYgKHdpZHRoICE9PSBudWxsICYmIGhlaWdodCAhPT0gbnVsbCkge1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgfVxyXG59XHJcblxyXG5EaW1lbnNpb25ELnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy53aWR0aDtcclxufTtcclxuXHJcbkRpbWVuc2lvbkQucHJvdG90eXBlLnNldFdpZHRoID0gZnVuY3Rpb24gKHdpZHRoKVxyXG57XHJcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG59O1xyXG5cclxuRGltZW5zaW9uRC5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmhlaWdodDtcclxufTtcclxuXHJcbkRpbWVuc2lvbkQucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQpXHJcbntcclxuICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGltZW5zaW9uRDtcclxuIiwiZnVuY3Rpb24gRW1pdHRlcigpe1xyXG4gIHRoaXMubGlzdGVuZXJzID0gW107XHJcbn1cclxuXHJcbnZhciBwID0gRW1pdHRlci5wcm90b3R5cGU7XHJcblxyXG5wLmFkZExpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50LCBjYWxsYmFjayApe1xyXG4gIHRoaXMubGlzdGVuZXJzLnB1c2goe1xyXG4gICAgZXZlbnQ6IGV2ZW50LFxyXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgfSk7XHJcbn07XHJcblxyXG5wLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50LCBjYWxsYmFjayApe1xyXG4gIGZvciggdmFyIGkgPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkgPj0gMDsgaS0tICl7XHJcbiAgICB2YXIgbCA9IHRoaXMubGlzdGVuZXJzW2ldO1xyXG5cclxuICAgIGlmKCBsLmV2ZW50ID09PSBldmVudCAmJiBsLmNhbGxiYWNrID09PSBjYWxsYmFjayApe1xyXG4gICAgICB0aGlzLmxpc3RlbmVycy5zcGxpY2UoIGksIDEgKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5wLmVtaXQgPSBmdW5jdGlvbiggZXZlbnQsIGRhdGEgKXtcclxuICBmb3IoIHZhciBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJzLmxlbmd0aDsgaSsrICl7XHJcbiAgICB2YXIgbCA9IHRoaXMubGlzdGVuZXJzW2ldO1xyXG5cclxuICAgIGlmKCBldmVudCA9PT0gbC5ldmVudCApe1xyXG4gICAgICBsLmNhbGxiYWNrKCBkYXRhICk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG4iLCJ2YXIgTGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xuXG5mdW5jdGlvbiBGRExheW91dCgpIHtcbiAgTGF5b3V0LmNhbGwodGhpcyk7XG5cbiAgdGhpcy51c2VTbWFydElkZWFsRWRnZUxlbmd0aENhbGN1bGF0aW9uID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT047XG4gIHRoaXMuaWRlYWxFZGdlTGVuZ3RoID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSDtcbiAgdGhpcy5zcHJpbmdDb25zdGFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIO1xuICB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEg7XG4gIHRoaXMuZ3Jhdml0eUNvbnN0YW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIO1xuICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1NUUkVOR1RIO1xuICB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XG4gIHRoaXMuY29tcG91bmRHcmF2aXR5UmFuZ2VGYWN0b3IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfUkFOR0VfRkFDVE9SO1xuICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgPSAoMy4wICogRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCkgLyAxMDA7XG4gIHRoaXMuY29vbGluZ0ZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUw7XG4gIHRoaXMuaW5pdGlhbENvb2xpbmdGYWN0b3IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPT0xJTkdfRkFDVE9SX0lOQ1JFTUVOVEFMO1xuICB0aGlzLnRvdGFsRGlzcGxhY2VtZW50ID0gMC4wO1xuICB0aGlzLm9sZFRvdGFsRGlzcGxhY2VtZW50ID0gMC4wO1xuICB0aGlzLm1heEl0ZXJhdGlvbnMgPSBGRExheW91dENvbnN0YW50cy5NQVhfSVRFUkFUSU9OUztcbn1cblxuRkRMYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMYXlvdXQucHJvdG90eXBlKTtcblxuZm9yICh2YXIgcHJvcCBpbiBMYXlvdXQpIHtcbiAgRkRMYXlvdXRbcHJvcF0gPSBMYXlvdXRbcHJvcF07XG59XG5cbkZETGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgTGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycy5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgaWYgKHRoaXMubGF5b3V0UXVhbGl0eSA9PSBMYXlvdXRDb25zdGFudHMuRFJBRlRfUVVBTElUWSlcbiAge1xuICAgIHRoaXMuZGlzcGxhY2VtZW50VGhyZXNob2xkUGVyTm9kZSArPSAwLjMwO1xuICAgIHRoaXMubWF4SXRlcmF0aW9ucyAqPSAwLjg7XG4gIH1cbiAgZWxzZSBpZiAodGhpcy5sYXlvdXRRdWFsaXR5ID09IExheW91dENvbnN0YW50cy5QUk9PRl9RVUFMSVRZKVxuICB7XG4gICAgdGhpcy5kaXNwbGFjZW1lbnRUaHJlc2hvbGRQZXJOb2RlIC09IDAuMzA7XG4gICAgdGhpcy5tYXhJdGVyYXRpb25zICo9IDEuMjtcbiAgfVxuXG4gIHRoaXMudG90YWxJdGVyYXRpb25zID0gMDtcbiAgdGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMgPSAwO1xuXG4gIHRoaXMudXNlRlJHcmlkVmFyaWFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfVVNFX1NNQVJUX1JFUFVMU0lPTl9SQU5HRV9DQUxDVUxBVElPTjtcbiAgXG4gIHRoaXMuZ3JpZCA9IFtdO1xuICAvLyB2YXJpYWJsZXMgZm9yIHRyZWUgcmVkdWN0aW9uIHN1cHBvcnRcbiAgdGhpcy5wcnVuZWROb2Rlc0FsbCA9IFtdO1xuICB0aGlzLmdyb3dUcmVlSXRlcmF0aW9ucyA9IDA7XG4gIHRoaXMuYWZ0ZXJHcm93dGhJdGVyYXRpb25zID0gMDtcbiAgdGhpcy5pc1RyZWVHcm93aW5nID0gZmFsc2U7XG4gIHRoaXMuaXNHcm93dGhGaW5pc2hlZCA9IGZhbHNlO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNJZGVhbEVkZ2VMZW5ndGhzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWRnZTtcbiAgdmFyIGxjYURlcHRoO1xuICB2YXIgc291cmNlO1xuICB2YXIgdGFyZ2V0O1xuICB2YXIgc2l6ZU9mU291cmNlSW5MY2E7XG4gIHZhciBzaXplT2ZUYXJnZXRJbkxjYTtcblxuICB2YXIgYWxsRWRnZXMgPSB0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldEFsbEVkZ2VzKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsRWRnZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBlZGdlID0gYWxsRWRnZXNbaV07XG5cbiAgICBlZGdlLmlkZWFsTGVuZ3RoID0gdGhpcy5pZGVhbEVkZ2VMZW5ndGg7XG5cbiAgICBpZiAoZWRnZS5pc0ludGVyR3JhcGgpXG4gICAge1xuICAgICAgc291cmNlID0gZWRnZS5nZXRTb3VyY2UoKTtcbiAgICAgIHRhcmdldCA9IGVkZ2UuZ2V0VGFyZ2V0KCk7XG5cbiAgICAgIHNpemVPZlNvdXJjZUluTGNhID0gZWRnZS5nZXRTb3VyY2VJbkxjYSgpLmdldEVzdGltYXRlZFNpemUoKTtcbiAgICAgIHNpemVPZlRhcmdldEluTGNhID0gZWRnZS5nZXRUYXJnZXRJbkxjYSgpLmdldEVzdGltYXRlZFNpemUoKTtcblxuICAgICAgaWYgKHRoaXMudXNlU21hcnRJZGVhbEVkZ2VMZW5ndGhDYWxjdWxhdGlvbilcbiAgICAgIHtcbiAgICAgICAgZWRnZS5pZGVhbExlbmd0aCArPSBzaXplT2ZTb3VyY2VJbkxjYSArIHNpemVPZlRhcmdldEluTGNhIC1cbiAgICAgICAgICAgICAgICAyICogTGF5b3V0Q29uc3RhbnRzLlNJTVBMRV9OT0RFX1NJWkU7XG4gICAgICB9XG5cbiAgICAgIGxjYURlcHRoID0gZWRnZS5nZXRMY2EoKS5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKTtcblxuICAgICAgZWRnZS5pZGVhbExlbmd0aCArPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIICpcbiAgICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiAqXG4gICAgICAgICAgICAgIChzb3VyY2UuZ2V0SW5jbHVzaW9uVHJlZURlcHRoKCkgK1xuICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKSAtIDIgKiBsY2FEZXB0aCk7XG4gICAgfVxuICB9XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuaW5pdFNwcmluZ0VtYmVkZGVyID0gZnVuY3Rpb24gKCkge1xuXG4gIGlmICh0aGlzLmluY3JlbWVudGFsKVxuICB7XG4gICAgdGhpcy5tYXhOb2RlRGlzcGxhY2VtZW50ID1cbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLk1BWF9OT0RFX0RJU1BMQUNFTUVOVF9JTkNSRU1FTlRBTDtcbiAgfVxuICBlbHNlXG4gIHtcbiAgICB0aGlzLmNvb2xpbmdGYWN0b3IgPSAxLjA7XG4gICAgdGhpcy5pbml0aWFsQ29vbGluZ0ZhY3RvciA9IDEuMDtcbiAgICB0aGlzLm1heE5vZGVEaXNwbGFjZW1lbnQgPVxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UO1xuICB9XG5cbiAgdGhpcy5tYXhJdGVyYXRpb25zID1cbiAgICAgICAgICBNYXRoLm1heCh0aGlzLmdldEFsbE5vZGVzKCkubGVuZ3RoICogNSwgdGhpcy5tYXhJdGVyYXRpb25zKTtcblxuICB0aGlzLnRvdGFsRGlzcGxhY2VtZW50VGhyZXNob2xkID1cbiAgICAgICAgICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgKiB0aGlzLmdldEFsbE5vZGVzKCkubGVuZ3RoO1xuXG4gIHRoaXMucmVwdWxzaW9uUmFuZ2UgPSB0aGlzLmNhbGNSZXB1bHNpb25SYW5nZSgpO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNTcHJpbmdGb3JjZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsRWRnZXMgPSB0aGlzLmdldEFsbEVkZ2VzKCk7XG4gIHZhciBlZGdlO1xuICB2YXIgZWRnZXNEYXRhID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsRWRnZXMubGVuZ3RoOyBpKyspXG4gIHtcbiAgICBlZGdlID0gbEVkZ2VzW2ldO1xuXG4gICAgZWRnZXNEYXRhW2ldID0gdGhpcy5jYWxjU3ByaW5nRm9yY2UoZWRnZSwgZWRnZS5pZGVhbExlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGVkZ2VzRGF0YTtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjUmVwdWxzaW9uRm9yY2VzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSwgajtcbiAgdmFyIG5vZGVBLCBub2RlQjtcbiAgdmFyIGxOb2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXMoKTtcbiAgdmFyIHByb2Nlc3NlZE5vZGVTZXQ7XG5cbiAgaWYgKHRoaXMudXNlRlJHcmlkVmFyaWFudClcbiAgeyAgICAgICBcbiAgICBpZiAoKHRoaXMudG90YWxJdGVyYXRpb25zICUgRkRMYXlvdXRDb25zdGFudHMuR1JJRF9DQUxDVUxBVElPTl9DSEVDS19QRVJJT0QgPT0gMSAmJiAhdGhpcy5pc1RyZWVHcm93aW5nICYmICF0aGlzLmlzR3Jvd3RoRmluaXNoZWQpKVxuICAgIHsgICAgICAgXG4gICAgICB0aGlzLnVwZGF0ZUdyaWQoKTsgIFxuICAgIH1cblxuICAgIHByb2Nlc3NlZE5vZGVTZXQgPSBuZXcgU2V0KCk7XG4gICAgXG4gICAgLy8gY2FsY3VsYXRlIHJlcHVsc2lvbiBmb3JjZXMgYmV0d2VlbiBlYWNoIG5vZGVzIGFuZCBpdHMgc3Vycm91bmRpbmdcbiAgICBmb3IgKGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIG5vZGVBID0gbE5vZGVzW2ldO1xuICAgICAgdGhpcy5jYWxjdWxhdGVSZXB1bHNpb25Gb3JjZU9mQU5vZGUobm9kZUEsIHByb2Nlc3NlZE5vZGVTZXQpO1xuICAgICAgcHJvY2Vzc2VkTm9kZVNldC5hZGQobm9kZUEpO1xuICAgIH1cbiAgfVxuICBlbHNlXG4gIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxuICAgIHtcbiAgICAgIG5vZGVBID0gbE5vZGVzW2ldO1xuXG4gICAgICBmb3IgKGogPSBpICsgMTsgaiA8IGxOb2Rlcy5sZW5ndGg7IGorKylcbiAgICAgIHtcbiAgICAgICAgbm9kZUIgPSBsTm9kZXNbal07XG5cbiAgICAgICAgLy8gSWYgYm90aCBub2RlcyBhcmUgbm90IG1lbWJlcnMgb2YgdGhlIHNhbWUgZ3JhcGgsIHNraXAuXG4gICAgICAgIGlmIChub2RlQS5nZXRPd25lcigpICE9IG5vZGVCLmdldE93bmVyKCkpXG4gICAgICAgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsY1JlcHVsc2lvbkZvcmNlKG5vZGVBLCBub2RlQik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBub2RlO1xuICB2YXIgbE5vZGVzID0gdGhpcy5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbigpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgbm9kZSA9IGxOb2Rlc1tpXTtcbiAgICB0aGlzLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2Uobm9kZSk7XG4gIH1cbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5tb3ZlTm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XG4gIHZhciBub2RlO1xuICB2YXIgbm9kZXNEYXRhID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxuICB7XG4gICAgbm9kZSA9IGxOb2Rlc1tpXTtcbiAgICBub2Rlc0RhdGFbaV0gPSBub2RlLm1vdmUoKTtcbiAgfVxuICByZXR1cm4gbm9kZXNEYXRhO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNTcHJpbmdGb3JjZSA9IGZ1bmN0aW9uIChlZGdlLCBpZGVhbExlbmd0aCkge1xuICB2YXIgc291cmNlTm9kZSA9IGVkZ2UuZ2V0U291cmNlKCk7XG4gIHZhciB0YXJnZXROb2RlID0gZWRnZS5nZXRUYXJnZXQoKTtcblxuICB2YXIgbGVuZ3RoO1xuICB2YXIgeExlbmd0aDtcbiAgdmFyIHlMZW5ndGg7XG4gIHZhciBzcHJpbmdGb3JjZTtcbiAgdmFyIHNwcmluZ0ZvcmNlWDtcbiAgdmFyIHNwcmluZ0ZvcmNlWTtcblxuICAvLyBVcGRhdGUgZWRnZSBsZW5ndGhcbiAgaWYgKHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgJiZcbiAgICAgICAgICBzb3VyY2VOb2RlLmdldENoaWxkKCkgPT0gbnVsbCAmJiB0YXJnZXROb2RlLmdldENoaWxkKCkgPT0gbnVsbClcbiAge1xuICAgIGVkZ2UudXBkYXRlTGVuZ3RoU2ltcGxlKCk7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgZWRnZS51cGRhdGVMZW5ndGgoKTtcblxuICAgIGlmIChlZGdlLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldClcbiAgICB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgbGVuZ3RoID0gZWRnZS5nZXRMZW5ndGgoKTtcbiAgeExlbmd0aCA9IGVkZ2UubGVuZ3RoWDtcbiAgeUxlbmd0aCA9IGVkZ2UubGVuZ3RoWTtcblxuICAvLyBDYWxjdWxhdGUgc3ByaW5nIGZvcmNlc1xuICBzcHJpbmdGb3JjZSA9IHRoaXMuc3ByaW5nQ29uc3RhbnQgKiAobGVuZ3RoIC0gaWRlYWxMZW5ndGgpO1xuXG4gIC8vIFByb2plY3QgZm9yY2Ugb250byB4IGFuZCB5IGF4ZXNcbiAgc3ByaW5nRm9yY2VYID0gc3ByaW5nRm9yY2UgKiAoZWRnZS5sZW5ndGhYIC8gbGVuZ3RoKTtcbiAgc3ByaW5nRm9yY2VZID0gc3ByaW5nRm9yY2UgKiAoZWRnZS5sZW5ndGhZIC8gbGVuZ3RoKTtcbiAgXG4gIC8vIEFwcGx5IGZvcmNlcyBvbiB0aGUgZW5kIG5vZGVzXG4gIHNvdXJjZU5vZGUuc3ByaW5nRm9yY2VYICs9IHNwcmluZ0ZvcmNlWDtcbiAgc291cmNlTm9kZS5zcHJpbmdGb3JjZVkgKz0gc3ByaW5nRm9yY2VZO1xuICB0YXJnZXROb2RlLnNwcmluZ0ZvcmNlWCAtPSBzcHJpbmdGb3JjZVg7XG4gIHRhcmdldE5vZGUuc3ByaW5nRm9yY2VZIC09IHNwcmluZ0ZvcmNlWTtcbiAgXG4gIHZhciBlZGdlRGF0YSA9IHtcbiAgICBzb3VyY2U6IHNvdXJjZU5vZGUsXG4gICAgdGFyZ2V0OiB0YXJnZXROb2RlLFxuICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgIHhMZW5ndGg6IHhMZW5ndGgsXG4gICAgeUxlbmd0aDogeUxlbmd0aFxuICB9O1xuICBcbiAgcmV0dXJuIGVkZ2VEYXRhO1xufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNSZXB1bHNpb25Gb3JjZSA9IGZ1bmN0aW9uIChub2RlQSwgbm9kZUIpIHtcbiAgdmFyIHJlY3RBID0gbm9kZUEuZ2V0UmVjdCgpO1xuICB2YXIgcmVjdEIgPSBub2RlQi5nZXRSZWN0KCk7XG4gIHZhciBvdmVybGFwQW1vdW50ID0gbmV3IEFycmF5KDIpO1xuICB2YXIgY2xpcFBvaW50cyA9IG5ldyBBcnJheSg0KTtcbiAgdmFyIGRpc3RhbmNlWDtcbiAgdmFyIGRpc3RhbmNlWTtcbiAgdmFyIGRpc3RhbmNlU3F1YXJlZDtcbiAgdmFyIGRpc3RhbmNlO1xuICB2YXIgcmVwdWxzaW9uRm9yY2U7XG4gIHZhciByZXB1bHNpb25Gb3JjZVg7XG4gIHZhciByZXB1bHNpb25Gb3JjZVk7XG5cbiAgaWYgKHJlY3RBLmludGVyc2VjdHMocmVjdEIpKS8vIHR3byBub2RlcyBvdmVybGFwXG4gIHtcbiAgICAvLyBjYWxjdWxhdGUgc2VwYXJhdGlvbiBhbW91bnQgaW4geCBhbmQgeSBkaXJlY3Rpb25zXG4gICAgSUdlb21ldHJ5LmNhbGNTZXBhcmF0aW9uQW1vdW50KHJlY3RBLFxuICAgICAgICAgICAgcmVjdEIsXG4gICAgICAgICAgICBvdmVybGFwQW1vdW50LFxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAvIDIuMCk7XG5cbiAgICByZXB1bHNpb25Gb3JjZVggPSAyICogb3ZlcmxhcEFtb3VudFswXTtcbiAgICByZXB1bHNpb25Gb3JjZVkgPSAyICogb3ZlcmxhcEFtb3VudFsxXTtcbiAgICBcbiAgICB2YXIgY2hpbGRyZW5Db25zdGFudCA9IG5vZGVBLm5vT2ZDaGlsZHJlbiAqIG5vZGVCLm5vT2ZDaGlsZHJlbiAvIChub2RlQS5ub09mQ2hpbGRyZW4gKyBub2RlQi5ub09mQ2hpbGRyZW4pO1xuICAgIFxuICAgIC8vIEFwcGx5IGZvcmNlcyBvbiB0aGUgdHdvIG5vZGVzXG4gICAgbm9kZUEucmVwdWxzaW9uRm9yY2VYIC09IGNoaWxkcmVuQ29uc3RhbnQgKiByZXB1bHNpb25Gb3JjZVg7XG4gICAgbm9kZUEucmVwdWxzaW9uRm9yY2VZIC09IGNoaWxkcmVuQ29uc3RhbnQgKiByZXB1bHNpb25Gb3JjZVk7XG4gICAgbm9kZUIucmVwdWxzaW9uRm9yY2VYICs9IGNoaWxkcmVuQ29uc3RhbnQgKiByZXB1bHNpb25Gb3JjZVg7XG4gICAgbm9kZUIucmVwdWxzaW9uRm9yY2VZICs9IGNoaWxkcmVuQ29uc3RhbnQgKiByZXB1bHNpb25Gb3JjZVk7XG4gIH1cbiAgZWxzZS8vIG5vIG92ZXJsYXBcbiAge1xuICAgIC8vIGNhbGN1bGF0ZSBkaXN0YW5jZVxuXG4gICAgaWYgKHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgJiZcbiAgICAgICAgICAgIG5vZGVBLmdldENoaWxkKCkgPT0gbnVsbCAmJiBub2RlQi5nZXRDaGlsZCgpID09IG51bGwpLy8gc2ltcGx5IGJhc2UgcmVwdWxzaW9uIG9uIGRpc3RhbmNlIG9mIG5vZGUgY2VudGVyc1xuICAgIHtcbiAgICAgIGRpc3RhbmNlWCA9IHJlY3RCLmdldENlbnRlclgoKSAtIHJlY3RBLmdldENlbnRlclgoKTtcbiAgICAgIGRpc3RhbmNlWSA9IHJlY3RCLmdldENlbnRlclkoKSAtIHJlY3RBLmdldENlbnRlclkoKTtcbiAgICB9XG4gICAgZWxzZS8vIHVzZSBjbGlwcGluZyBwb2ludHNcbiAgICB7XG4gICAgICBJR2VvbWV0cnkuZ2V0SW50ZXJzZWN0aW9uKHJlY3RBLCByZWN0QiwgY2xpcFBvaW50cyk7XG5cbiAgICAgIGRpc3RhbmNlWCA9IGNsaXBQb2ludHNbMl0gLSBjbGlwUG9pbnRzWzBdO1xuICAgICAgZGlzdGFuY2VZID0gY2xpcFBvaW50c1szXSAtIGNsaXBQb2ludHNbMV07XG4gICAgfVxuXG4gICAgLy8gTm8gcmVwdWxzaW9uIHJhbmdlLiBGUiBncmlkIHZhcmlhbnQgc2hvdWxkIHRha2UgY2FyZSBvZiB0aGlzLlxuICAgIGlmIChNYXRoLmFicyhkaXN0YW5jZVgpIDwgRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUKVxuICAgIHtcbiAgICAgIGRpc3RhbmNlWCA9IElNYXRoLnNpZ24oZGlzdGFuY2VYKSAqXG4gICAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVDtcbiAgICB9XG5cbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VZKSA8IEZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVClcbiAgICB7XG4gICAgICBkaXN0YW5jZVkgPSBJTWF0aC5zaWduKGRpc3RhbmNlWSkgKlxuICAgICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1Q7XG4gICAgfVxuXG4gICAgZGlzdGFuY2VTcXVhcmVkID0gZGlzdGFuY2VYICogZGlzdGFuY2VYICsgZGlzdGFuY2VZICogZGlzdGFuY2VZO1xuICAgIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGRpc3RhbmNlU3F1YXJlZCk7XG5cbiAgICByZXB1bHNpb25Gb3JjZSA9IHRoaXMucmVwdWxzaW9uQ29uc3RhbnQgKiBub2RlQS5ub09mQ2hpbGRyZW4gKiBub2RlQi5ub09mQ2hpbGRyZW4gLyBkaXN0YW5jZVNxdWFyZWQ7XG5cbiAgICAvLyBQcm9qZWN0IGZvcmNlIG9udG8geCBhbmQgeSBheGVzXG4gICAgcmVwdWxzaW9uRm9yY2VYID0gcmVwdWxzaW9uRm9yY2UgKiBkaXN0YW5jZVggLyBkaXN0YW5jZTtcbiAgICByZXB1bHNpb25Gb3JjZVkgPSByZXB1bHNpb25Gb3JjZSAqIGRpc3RhbmNlWSAvIGRpc3RhbmNlO1xuICAgICBcbiAgICAvLyBBcHBseSBmb3JjZXMgb24gdGhlIHR3byBub2RlcyAgICBcbiAgICBub2RlQS5yZXB1bHNpb25Gb3JjZVggLT0gcmVwdWxzaW9uRm9yY2VYO1xuICAgIG5vZGVBLnJlcHVsc2lvbkZvcmNlWSAtPSByZXB1bHNpb25Gb3JjZVk7XG4gICAgbm9kZUIucmVwdWxzaW9uRm9yY2VYICs9IHJlcHVsc2lvbkZvcmNlWDtcbiAgICBub2RlQi5yZXB1bHNpb25Gb3JjZVkgKz0gcmVwdWxzaW9uRm9yY2VZO1xuICB9XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBvd25lckdyYXBoO1xuICB2YXIgb3duZXJDZW50ZXJYO1xuICB2YXIgb3duZXJDZW50ZXJZO1xuICB2YXIgZGlzdGFuY2VYO1xuICB2YXIgZGlzdGFuY2VZO1xuICB2YXIgYWJzRGlzdGFuY2VYO1xuICB2YXIgYWJzRGlzdGFuY2VZO1xuICB2YXIgZXN0aW1hdGVkU2l6ZTtcbiAgb3duZXJHcmFwaCA9IG5vZGUuZ2V0T3duZXIoKTtcblxuICBvd25lckNlbnRlclggPSAob3duZXJHcmFwaC5nZXRSaWdodCgpICsgb3duZXJHcmFwaC5nZXRMZWZ0KCkpIC8gMjtcbiAgb3duZXJDZW50ZXJZID0gKG93bmVyR3JhcGguZ2V0VG9wKCkgKyBvd25lckdyYXBoLmdldEJvdHRvbSgpKSAvIDI7XG4gIGRpc3RhbmNlWCA9IG5vZGUuZ2V0Q2VudGVyWCgpIC0gb3duZXJDZW50ZXJYO1xuICBkaXN0YW5jZVkgPSBub2RlLmdldENlbnRlclkoKSAtIG93bmVyQ2VudGVyWTtcbiAgYWJzRGlzdGFuY2VYID0gTWF0aC5hYnMoZGlzdGFuY2VYKSArIG5vZGUuZ2V0V2lkdGgoKSAvIDI7XG4gIGFic0Rpc3RhbmNlWSA9IE1hdGguYWJzKGRpc3RhbmNlWSkgKyBub2RlLmdldEhlaWdodCgpIC8gMjtcblxuICBpZiAobm9kZS5nZXRPd25lcigpID09IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKSkvLyBpbiB0aGUgcm9vdCBncmFwaFxuICB7XG4gICAgZXN0aW1hdGVkU2l6ZSA9IG93bmVyR3JhcGguZ2V0RXN0aW1hdGVkU2l6ZSgpICogdGhpcy5ncmF2aXR5UmFuZ2VGYWN0b3I7XG5cbiAgICBpZiAoYWJzRGlzdGFuY2VYID4gZXN0aW1hdGVkU2l6ZSB8fCBhYnNEaXN0YW5jZVkgPiBlc3RpbWF0ZWRTaXplKVxuICAgIHtcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVggPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVg7XG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VZID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VZO1xuICAgIH1cbiAgfVxuICBlbHNlLy8gaW5zaWRlIGEgY29tcG91bmRcbiAge1xuICAgIGVzdGltYXRlZFNpemUgPSBvd25lckdyYXBoLmdldEVzdGltYXRlZFNpemUoKSAqIHRoaXMuY29tcG91bmRHcmF2aXR5UmFuZ2VGYWN0b3I7XG5cbiAgICBpZiAoYWJzRGlzdGFuY2VYID4gZXN0aW1hdGVkU2l6ZSB8fCBhYnNEaXN0YW5jZVkgPiBlc3RpbWF0ZWRTaXplKVxuICAgIHtcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVggPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVggKlxuICAgICAgICAgICAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50O1xuICAgICAgbm9kZS5ncmF2aXRhdGlvbkZvcmNlWSA9IC10aGlzLmdyYXZpdHlDb25zdGFudCAqIGRpc3RhbmNlWSAqXG4gICAgICAgICAgICAgIHRoaXMuY29tcG91bmRHcmF2aXR5Q29uc3RhbnQ7XG4gICAgfVxuICB9XG59O1xuXG5GRExheW91dC5wcm90b3R5cGUuaXNDb252ZXJnZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb252ZXJnZWQ7XG4gIHZhciBvc2NpbGF0aW5nID0gZmFsc2U7XG5cbiAgaWYgKHRoaXMudG90YWxJdGVyYXRpb25zID4gdGhpcy5tYXhJdGVyYXRpb25zIC8gMylcbiAge1xuICAgIG9zY2lsYXRpbmcgPVxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy50b3RhbERpc3BsYWNlbWVudCAtIHRoaXMub2xkVG90YWxEaXNwbGFjZW1lbnQpIDwgMjtcbiAgfVxuXG4gIGNvbnZlcmdlZCA9IHRoaXMudG90YWxEaXNwbGFjZW1lbnQgPCB0aGlzLnRvdGFsRGlzcGxhY2VtZW50VGhyZXNob2xkO1xuXG4gIHRoaXMub2xkVG90YWxEaXNwbGFjZW1lbnQgPSB0aGlzLnRvdGFsRGlzcGxhY2VtZW50O1xuXG4gIHJldHVybiBjb252ZXJnZWQgfHwgb3NjaWxhdGluZztcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5hbmltYXRpb25EdXJpbmdMYXlvdXQgJiYgIXRoaXMuaXNTdWJMYXlvdXQpXG4gIHtcbiAgICBpZiAodGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMgPT0gdGhpcy5hbmltYXRpb25QZXJpb2QpXG4gICAge1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgIHRoaXMubm90QW5pbWF0ZWRJdGVyYXRpb25zID0gMDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHRoaXMubm90QW5pbWF0ZWRJdGVyYXRpb25zKys7XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VjdGlvbjogRlItR3JpZCBWYXJpYW50IFJlcHVsc2lvbiBGb3JjZSBDYWxjdWxhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNHcmlkID0gZnVuY3Rpb24gKGdyYXBoKXtcblxuICB2YXIgc2l6ZVggPSAwOyBcbiAgdmFyIHNpemVZID0gMDtcbiAgXG4gIHNpemVYID0gcGFyc2VJbnQoTWF0aC5jZWlsKChncmFwaC5nZXRSaWdodCgpIC0gZ3JhcGguZ2V0TGVmdCgpKSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcbiAgc2l6ZVkgPSBwYXJzZUludChNYXRoLmNlaWwoKGdyYXBoLmdldEJvdHRvbSgpIC0gZ3JhcGguZ2V0VG9wKCkpIC8gdGhpcy5yZXB1bHNpb25SYW5nZSkpO1xuICBcbiAgdmFyIGdyaWQgPSBuZXcgQXJyYXkoc2l6ZVgpO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNpemVYOyBpKyspe1xuICAgIGdyaWRbaV0gPSBuZXcgQXJyYXkoc2l6ZVkpOyAgICBcbiAgfVxuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNpemVYOyBpKyspe1xuICAgIGZvcih2YXIgaiA9IDA7IGogPCBzaXplWTsgaisrKXtcbiAgICAgIGdyaWRbaV1bal0gPSBuZXcgQXJyYXkoKTsgICAgXG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gZ3JpZDtcbn07XG5cbkZETGF5b3V0LnByb3RvdHlwZS5hZGROb2RlVG9HcmlkID0gZnVuY3Rpb24gKHYsIGxlZnQsIHRvcCl7XG4gICAgXG4gIHZhciBzdGFydFggPSAwO1xuICB2YXIgZmluaXNoWCA9IDA7XG4gIHZhciBzdGFydFkgPSAwO1xuICB2YXIgZmluaXNoWSA9IDA7XG4gIFxuICBzdGFydFggPSBwYXJzZUludChNYXRoLmZsb29yKCh2LmdldFJlY3QoKS54IC0gbGVmdCkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG4gIGZpbmlzaFggPSBwYXJzZUludChNYXRoLmZsb29yKCh2LmdldFJlY3QoKS53aWR0aCArIHYuZ2V0UmVjdCgpLnggLSBsZWZ0KSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcbiAgc3RhcnRZID0gcGFyc2VJbnQoTWF0aC5mbG9vcigodi5nZXRSZWN0KCkueSAtIHRvcCkgLyB0aGlzLnJlcHVsc2lvblJhbmdlKSk7XG4gIGZpbmlzaFkgPSBwYXJzZUludChNYXRoLmZsb29yKCh2LmdldFJlY3QoKS5oZWlnaHQgKyB2LmdldFJlY3QoKS55IC0gdG9wKSAvIHRoaXMucmVwdWxzaW9uUmFuZ2UpKTtcblxuICBmb3IgKHZhciBpID0gc3RhcnRYOyBpIDw9IGZpbmlzaFg7IGkrKylcbiAge1xuICAgIGZvciAodmFyIGogPSBzdGFydFk7IGogPD0gZmluaXNoWTsgaisrKVxuICAgIHtcbiAgICAgIHRoaXMuZ3JpZFtpXVtqXS5wdXNoKHYpO1xuICAgICAgdi5zZXRHcmlkQ29vcmRpbmF0ZXMoc3RhcnRYLCBmaW5pc2hYLCBzdGFydFksIGZpbmlzaFkpOyBcbiAgICB9XG4gIH0gIFxuXG59O1xuXG5GRExheW91dC5wcm90b3R5cGUudXBkYXRlR3JpZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaTtcbiAgdmFyIG5vZGVBO1xuICB2YXIgbE5vZGVzID0gdGhpcy5nZXRBbGxOb2RlcygpO1xuICBcbiAgdGhpcy5ncmlkID0gdGhpcy5jYWxjR3JpZCh0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkpOyAgIFxuXG4gIC8vIHB1dCBhbGwgbm9kZXMgdG8gcHJvcGVyIGdyaWQgY2VsbHNcbiAgZm9yIChpID0gMDsgaSA8IGxOb2Rlcy5sZW5ndGg7IGkrKylcbiAge1xuICAgIG5vZGVBID0gbE5vZGVzW2ldO1xuICAgIHRoaXMuYWRkTm9kZVRvR3JpZChub2RlQSwgdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldExlZnQoKSwgdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldFRvcCgpKTtcbiAgfSBcblxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGN1bGF0ZVJlcHVsc2lvbkZvcmNlT2ZBTm9kZSA9IGZ1bmN0aW9uIChub2RlQSwgcHJvY2Vzc2VkTm9kZVNldCl7XG4gIFxuICBpZiAoKHRoaXMudG90YWxJdGVyYXRpb25zICUgRkRMYXlvdXRDb25zdGFudHMuR1JJRF9DQUxDVUxBVElPTl9DSEVDS19QRVJJT0QgPT0gMSAmJiAhdGhpcy5pc1RyZWVHcm93aW5nICYmICF0aGlzLmlzR3Jvd3RoRmluaXNoZWQpIHx8ICh0aGlzLmdyb3dUcmVlSXRlcmF0aW9ucyAlIDEwID09IDEgJiYgdGhpcy5pc1RyZWVHcm93aW5nKSB8fCAodGhpcy5hZnRlckdyb3d0aEl0ZXJhdGlvbnMgJSAxMCA9PSAxICYmIHRoaXMuaXNHcm93dGhGaW5pc2hlZCkpXG4gIHtcbiAgICB2YXIgc3Vycm91bmRpbmcgPSBuZXcgU2V0KCk7XG4gICAgbm9kZUEuc3Vycm91bmRpbmcgPSBuZXcgQXJyYXkoKTtcbiAgICB2YXIgbm9kZUI7XG4gICAgdmFyIGdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IChub2RlQS5zdGFydFggLSAxKTsgaSA8IChub2RlQS5maW5pc2hYICsgMik7IGkrKylcbiAgICB7XG4gICAgICBmb3IgKHZhciBqID0gKG5vZGVBLnN0YXJ0WSAtIDEpOyBqIDwgKG5vZGVBLmZpbmlzaFkgKyAyKTsgaisrKVxuICAgICAge1xuICAgICAgICBpZiAoISgoaSA8IDApIHx8IChqIDwgMCkgfHwgKGkgPj0gZ3JpZC5sZW5ndGgpIHx8IChqID49IGdyaWRbMF0ubGVuZ3RoKSkpXG4gICAgICAgIHsgIFxuICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZ3JpZFtpXVtqXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgbm9kZUIgPSBncmlkW2ldW2pdW2tdO1xuXG4gICAgICAgICAgICAvLyBJZiBib3RoIG5vZGVzIGFyZSBub3QgbWVtYmVycyBvZiB0aGUgc2FtZSBncmFwaCwgXG4gICAgICAgICAgICAvLyBvciBib3RoIG5vZGVzIGFyZSB0aGUgc2FtZSwgc2tpcC5cbiAgICAgICAgICAgIGlmICgobm9kZUEuZ2V0T3duZXIoKSAhPSBub2RlQi5nZXRPd25lcigpKSB8fCAobm9kZUEgPT0gbm9kZUIpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHJlcHVsc2lvbiBmb3JjZSBiZXR3ZWVuXG4gICAgICAgICAgICAvLyBub2RlQSBhbmQgbm9kZUIgaGFzIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkXG4gICAgICAgICAgICBpZiAoIXByb2Nlc3NlZE5vZGVTZXQuaGFzKG5vZGVCKSAmJiAhc3Vycm91bmRpbmcuaGFzKG5vZGVCKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlWCA9IE1hdGguYWJzKG5vZGVBLmdldENlbnRlclgoKS1ub2RlQi5nZXRDZW50ZXJYKCkpIC0gXG4gICAgICAgICAgICAgICAgICAgICgobm9kZUEuZ2V0V2lkdGgoKS8yKSArIChub2RlQi5nZXRXaWR0aCgpLzIpKTtcbiAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlWSA9IE1hdGguYWJzKG5vZGVBLmdldENlbnRlclkoKS1ub2RlQi5nZXRDZW50ZXJZKCkpIC0gXG4gICAgICAgICAgICAgICAgICAgICgobm9kZUEuZ2V0SGVpZ2h0KCkvMikgKyAobm9kZUIuZ2V0SGVpZ2h0KCkvMikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vIGlmIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIG5vZGVBIGFuZCBub2RlQiBcbiAgICAgICAgICAgICAgLy8gaXMgbGVzcyB0aGVuIGNhbGN1bGF0aW9uIHJhbmdlXG4gICAgICAgICAgICAgIGlmICgoZGlzdGFuY2VYIDw9IHRoaXMucmVwdWxzaW9uUmFuZ2UpICYmIChkaXN0YW5jZVkgPD0gdGhpcy5yZXB1bHNpb25SYW5nZSkpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvL3RoZW4gYWRkIG5vZGVCIHRvIHN1cnJvdW5kaW5nIG9mIG5vZGVBXG4gICAgICAgICAgICAgICAgc3Vycm91bmRpbmcuYWRkKG5vZGVCKTtcbiAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfSAgICAgICAgICBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlQS5zdXJyb3VuZGluZyA9IFsuLi5zdXJyb3VuZGluZ107XG5cdFxuICB9XG4gIGZvciAoaSA9IDA7IGkgPCBub2RlQS5zdXJyb3VuZGluZy5sZW5ndGg7IGkrKylcbiAge1xuICAgIHRoaXMuY2FsY1JlcHVsc2lvbkZvcmNlKG5vZGVBLCBub2RlQS5zdXJyb3VuZGluZ1tpXSk7XG4gIH1cdFxufTtcblxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNSZXB1bHNpb25SYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIDAuMDtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTZWN0aW9uOiBUcmVlIFJlZHVjdGlvbiBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVkdWNlIHRyZWVzIFxuRkRMYXlvdXQucHJvdG90eXBlLnJlZHVjZVRyZWVzID0gZnVuY3Rpb24gKClcbntcbiAgdmFyIHBydW5lZE5vZGVzQWxsID0gW107XG4gIHZhciBjb250YWluc0xlYWYgPSB0cnVlO1xuICB2YXIgbm9kZTtcbiAgXG4gIHdoaWxlKGNvbnRhaW5zTGVhZikge1xuICAgIHZhciBhbGxOb2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XG4gICAgdmFyIHBydW5lZE5vZGVzSW5TdGVwVGVtcCA9IFtdO1xuICAgIGNvbnRhaW5zTGVhZiA9IGZhbHNlO1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG5vZGUgPSBhbGxOb2Rlc1tpXTtcbiAgICAgIGlmKG5vZGUuZ2V0RWRnZXMoKS5sZW5ndGggPT0gMSAmJiAhbm9kZS5nZXRFZGdlcygpWzBdLmlzSW50ZXJHcmFwaCAmJiBub2RlLmdldENoaWxkKCkgPT0gbnVsbCl7XG4gICAgICAgIHBydW5lZE5vZGVzSW5TdGVwVGVtcC5wdXNoKFtub2RlLCBub2RlLmdldEVkZ2VzKClbMF0sIG5vZGUuZ2V0T3duZXIoKV0pO1xuICAgICAgICBjb250YWluc0xlYWYgPSB0cnVlO1xuICAgICAgfSAgXG4gICAgfVxuICAgIGlmKGNvbnRhaW5zTGVhZiA9PSB0cnVlKXtcbiAgICAgIHZhciBwcnVuZWROb2Rlc0luU3RlcCA9IFtdO1xuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHBydW5lZE5vZGVzSW5TdGVwVGVtcC5sZW5ndGg7IGorKyl7XG4gICAgICAgIGlmKHBydW5lZE5vZGVzSW5TdGVwVGVtcFtqXVswXS5nZXRFZGdlcygpLmxlbmd0aCA9PSAxKXtcbiAgICAgICAgICBwcnVuZWROb2Rlc0luU3RlcC5wdXNoKHBydW5lZE5vZGVzSW5TdGVwVGVtcFtqXSk7ICBcbiAgICAgICAgICBwcnVuZWROb2Rlc0luU3RlcFRlbXBbal1bMF0uZ2V0T3duZXIoKS5yZW1vdmUocHJ1bmVkTm9kZXNJblN0ZXBUZW1wW2pdWzBdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJ1bmVkTm9kZXNBbGwucHVzaChwcnVuZWROb2Rlc0luU3RlcCk7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzKCk7XG4gICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbEVkZ2VzKCk7XG4gICAgfVxuICB9XG4gIHRoaXMucHJ1bmVkTm9kZXNBbGwgPSBwcnVuZWROb2Rlc0FsbDtcbn07XG5cbi8vIEdyb3cgdHJlZSBvbmUgc3RlcCBcbkZETGF5b3V0LnByb3RvdHlwZS5ncm93VHJlZSA9IGZ1bmN0aW9uKHBydW5lZE5vZGVzQWxsKVxue1xuICB2YXIgbGVuZ3RoT2ZQcnVuZWROb2Rlc0luU3RlcCA9IHBydW5lZE5vZGVzQWxsLmxlbmd0aDsgXG4gIHZhciBwcnVuZWROb2Rlc0luU3RlcCA9IHBydW5lZE5vZGVzQWxsW2xlbmd0aE9mUHJ1bmVkTm9kZXNJblN0ZXAgLSAxXTsgIFxuXG4gIHZhciBub2RlRGF0YTsgIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgcHJ1bmVkTm9kZXNJblN0ZXAubGVuZ3RoOyBpKyspe1xuICAgIG5vZGVEYXRhID0gcHJ1bmVkTm9kZXNJblN0ZXBbaV07XG5cbiAgICB0aGlzLmZpbmRQbGFjZWZvclBydW5lZE5vZGUobm9kZURhdGEpO1xuICAgIFxuICAgIG5vZGVEYXRhWzJdLmFkZChub2RlRGF0YVswXSk7XG4gICAgbm9kZURhdGFbMl0uYWRkKG5vZGVEYXRhWzFdLCBub2RlRGF0YVsxXS5zb3VyY2UsIG5vZGVEYXRhWzFdLnRhcmdldCk7XG4gIH1cblxuICBwcnVuZWROb2Rlc0FsbC5zcGxpY2UocHJ1bmVkTm9kZXNBbGwubGVuZ3RoLTEsIDEpO1xuICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzKCk7XG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsRWRnZXMoKTtcbn07XG5cbi8vIEZpbmQgYW4gYXBwcm9wcmlhdGUgcG9zaXRpb24gdG8gcmVwbGFjZSBwcnVuZWQgbm9kZSwgdGhpcyBtZXRob2QgY2FuIGJlIGltcHJvdmVkXG5GRExheW91dC5wcm90b3R5cGUuZmluZFBsYWNlZm9yUHJ1bmVkTm9kZSA9IGZ1bmN0aW9uKG5vZGVEYXRhKXtcbiAgXG4gIHZhciBncmlkRm9yUHJ1bmVkTm9kZTsgIFxuICB2YXIgbm9kZVRvQ29ubmVjdDtcbiAgdmFyIHBydW5lZE5vZGUgPSBub2RlRGF0YVswXTtcbiAgaWYocHJ1bmVkTm9kZSA9PSBub2RlRGF0YVsxXS5zb3VyY2Upe1xuICAgIG5vZGVUb0Nvbm5lY3QgPSBub2RlRGF0YVsxXS50YXJnZXQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgbm9kZVRvQ29ubmVjdCA9IG5vZGVEYXRhWzFdLnNvdXJjZTsgIFxuICB9XG4gIHZhciBzdGFydEdyaWRYID0gbm9kZVRvQ29ubmVjdC5zdGFydFg7XG4gIHZhciBmaW5pc2hHcmlkWCA9IG5vZGVUb0Nvbm5lY3QuZmluaXNoWDtcbiAgdmFyIHN0YXJ0R3JpZFkgPSBub2RlVG9Db25uZWN0LnN0YXJ0WTtcbiAgdmFyIGZpbmlzaEdyaWRZID0gbm9kZVRvQ29ubmVjdC5maW5pc2hZOyBcbiAgXG4gIHZhciB1cE5vZGVDb3VudCA9IDA7XG4gIHZhciBkb3duTm9kZUNvdW50ID0gMDtcbiAgdmFyIHJpZ2h0Tm9kZUNvdW50ID0gMDtcbiAgdmFyIGxlZnROb2RlQ291bnQgPSAwO1xuICB2YXIgY29udHJvbFJlZ2lvbnMgPSBbdXBOb2RlQ291bnQsIHJpZ2h0Tm9kZUNvdW50LCBkb3duTm9kZUNvdW50LCBsZWZ0Tm9kZUNvdW50XVxuICBcbiAgaWYoc3RhcnRHcmlkWSA+IDApe1xuICAgIGZvcih2YXIgaSA9IHN0YXJ0R3JpZFg7IGkgPD0gZmluaXNoR3JpZFg7IGkrKyApe1xuICAgICAgY29udHJvbFJlZ2lvbnNbMF0gKz0gKHRoaXMuZ3JpZFtpXVtzdGFydEdyaWRZIC0gMV0ubGVuZ3RoICsgdGhpcy5ncmlkW2ldW3N0YXJ0R3JpZFldLmxlbmd0aCAtIDEpOyAgIFxuICAgIH1cbiAgfVxuICBpZihmaW5pc2hHcmlkWCA8IHRoaXMuZ3JpZC5sZW5ndGggLSAxKXtcbiAgICBmb3IodmFyIGkgPSBzdGFydEdyaWRZOyBpIDw9IGZpbmlzaEdyaWRZOyBpKysgKXtcbiAgICAgIGNvbnRyb2xSZWdpb25zWzFdICs9ICh0aGlzLmdyaWRbZmluaXNoR3JpZFggKyAxXVtpXS5sZW5ndGggKyB0aGlzLmdyaWRbZmluaXNoR3JpZFhdW2ldLmxlbmd0aCAtIDEpOyAgIFxuICAgIH1cbiAgfVxuICBpZihmaW5pc2hHcmlkWSA8IHRoaXMuZ3JpZFswXS5sZW5ndGggLSAxKXtcbiAgICBmb3IodmFyIGkgPSBzdGFydEdyaWRYOyBpIDw9IGZpbmlzaEdyaWRYOyBpKysgKXtcbiAgICAgIGNvbnRyb2xSZWdpb25zWzJdICs9ICh0aGlzLmdyaWRbaV1bZmluaXNoR3JpZFkgKyAxXS5sZW5ndGggKyB0aGlzLmdyaWRbaV1bZmluaXNoR3JpZFldLmxlbmd0aCAtIDEpOyAgIFxuICAgIH1cbiAgfVxuICBpZihzdGFydEdyaWRYID4gMCl7XG4gICAgZm9yKHZhciBpID0gc3RhcnRHcmlkWTsgaSA8PSBmaW5pc2hHcmlkWTsgaSsrICl7XG4gICAgICBjb250cm9sUmVnaW9uc1szXSArPSAodGhpcy5ncmlkW3N0YXJ0R3JpZFggLSAxXVtpXS5sZW5ndGggKyB0aGlzLmdyaWRbc3RhcnRHcmlkWF1baV0ubGVuZ3RoIC0gMSk7ICAgXG4gICAgfVxuICB9XG4gIHZhciBtaW4gPSBJbnRlZ2VyLk1BWF9WQUxVRTtcbiAgdmFyIG1pbkNvdW50O1xuICB2YXIgbWluSW5kZXg7XG4gIGZvcih2YXIgaiA9IDA7IGogPCBjb250cm9sUmVnaW9ucy5sZW5ndGg7IGorKyl7XG4gICAgaWYoY29udHJvbFJlZ2lvbnNbal0gPCBtaW4pe1xuICAgICAgbWluID0gY29udHJvbFJlZ2lvbnNbal07XG4gICAgICBtaW5Db3VudCA9IDE7XG4gICAgICBtaW5JbmRleCA9IGo7XG4gICAgfSAgXG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1tqXSA9PSBtaW4pe1xuICAgICAgbWluQ291bnQrKzsgIFxuICAgIH1cbiAgfVxuICBcbiAgaWYobWluQ291bnQgPT0gMyAmJiBtaW4gPT0gMCl7XG4gICAgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1sxXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzJdID09IDApe1xuICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAxOyAgICBcbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzFdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbM10gPT0gMCl7XG4gICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDA7ICBcbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzJdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbM10gPT0gMCl7XG4gICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDM7ICBcbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1sxXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzJdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbM10gPT0gMCl7XG4gICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDI7ICBcbiAgICB9XG4gIH1cbiAgZWxzZSBpZihtaW5Db3VudCA9PSAyICYmIG1pbiA9PSAwKXtcbiAgICB2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1sxXSA9PSAwKXs7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMDtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1swXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzJdID09IDApe1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDA7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDI7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYoY29udHJvbFJlZ2lvbnNbMF0gPT0gMCAmJiBjb250cm9sUmVnaW9uc1szXSA9PSAwKXtcbiAgICAgIGlmKHJhbmRvbSA9PSAwKXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAwO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZ3JpZEZvclBydW5lZE5vZGUgPSAzO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmKGNvbnRyb2xSZWdpb25zWzFdID09IDAgJiYgY29udHJvbFJlZ2lvbnNbMl0gPT0gMCl7XG4gICAgICBpZihyYW5kb20gPT0gMCl7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGdyaWRGb3JQcnVuZWROb2RlID0gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZihjb250cm9sUmVnaW9uc1sxXSA9PSAwICYmIGNvbnRyb2xSZWdpb25zWzNdID09IDApe1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDE7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYocmFuZG9tID09IDApe1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDI7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBncmlkRm9yUHJ1bmVkTm9kZSA9IDM7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2UgaWYobWluQ291bnQgPT0gNCAmJiBtaW4gPT0gMCl7XG4gICAgdmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgIGdyaWRGb3JQcnVuZWROb2RlID0gcmFuZG9tOyAgXG4gIH1cbiAgZWxzZSB7XG4gICAgZ3JpZEZvclBydW5lZE5vZGUgPSBtaW5JbmRleDtcbiAgfVxuICBcbiAgaWYoZ3JpZEZvclBydW5lZE5vZGUgPT0gMCkge1xuICAgIHBydW5lZE5vZGUuc2V0Q2VudGVyKG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWSgpIC0gbm9kZVRvQ29ubmVjdC5nZXRIZWlnaHQoKS8yIC0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAtIHBydW5lZE5vZGUuZ2V0SGVpZ2h0KCkvMik7ICBcbiAgfVxuICBlbHNlIGlmKGdyaWRGb3JQcnVuZWROb2RlID09IDEpIHtcbiAgICBwcnVuZWROb2RlLnNldENlbnRlcihub2RlVG9Db25uZWN0LmdldENlbnRlclgoKSArIG5vZGVUb0Nvbm5lY3QuZ2V0V2lkdGgoKS8yICsgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCArIHBydW5lZE5vZGUuZ2V0V2lkdGgoKS8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWSgpKTsgIFxuICB9XG4gIGVsc2UgaWYoZ3JpZEZvclBydW5lZE5vZGUgPT0gMikge1xuICAgIHBydW5lZE5vZGUuc2V0Q2VudGVyKG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUb0Nvbm5lY3QuZ2V0Q2VudGVyWSgpICsgbm9kZVRvQ29ubmVjdC5nZXRIZWlnaHQoKS8yICsgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCArIHBydW5lZE5vZGUuZ2V0SGVpZ2h0KCkvMik7ICBcbiAgfVxuICBlbHNlIHsgXG4gICAgcHJ1bmVkTm9kZS5zZXRDZW50ZXIobm9kZVRvQ29ubmVjdC5nZXRDZW50ZXJYKCkgLSBub2RlVG9Db25uZWN0LmdldFdpZHRoKCkvMiAtIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggLSBwcnVuZWROb2RlLmdldFdpZHRoKCkvMixcbiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlVG9Db25uZWN0LmdldENlbnRlclkoKSk7ICBcbiAgfVxuICBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRkRMYXlvdXQ7XG4iLCJ2YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcclxuXHJcbmZ1bmN0aW9uIEZETGF5b3V0Q29uc3RhbnRzKCkge1xyXG59XHJcblxyXG4vL0ZETGF5b3V0Q29uc3RhbnRzIGluaGVyaXRzIHN0YXRpYyBwcm9wcyBpbiBMYXlvdXRDb25zdGFudHNcclxuZm9yICh2YXIgcHJvcCBpbiBMYXlvdXRDb25zdGFudHMpIHtcclxuICBGRExheW91dENvbnN0YW50c1twcm9wXSA9IExheW91dENvbnN0YW50c1twcm9wXTtcclxufVxyXG5cclxuRkRMYXlvdXRDb25zdGFudHMuTUFYX0lURVJBVElPTlMgPSAyNTAwO1xyXG5cclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IDUwO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSCA9IDAuNDU7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIID0gNDUwMC4wO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEggPSAwLjQ7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IDEuMDtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IDMuODtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IDEuNTtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT04gPSB0cnVlO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9SRVBVTFNJT05fUkFOR0VfQ0FMQ1VMQVRJT04gPSB0cnVlO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPT0xJTkdfRkFDVE9SX0lOQ1JFTUVOVEFMID0gMC41O1xyXG5GRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlRfSU5DUkVNRU5UQUwgPSAxMDAuMDtcclxuRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UID0gRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UX0lOQ1JFTUVOVEFMICogMztcclxuRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAvIDEwLjA7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9IDEwMDtcclxuRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiA9IDAuMTtcclxuRkRMYXlvdXRDb25zdGFudHMuTUlOX0VER0VfTEVOR1RIID0gMTtcclxuRkRMYXlvdXRDb25zdGFudHMuR1JJRF9DQUxDVUxBVElPTl9DSEVDS19QRVJJT0QgPSAxMDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRkRMYXlvdXRDb25zdGFudHM7XHJcbiIsInZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcclxudmFyIEZETGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9GRExheW91dENvbnN0YW50cycpO1xyXG5cclxuZnVuY3Rpb24gRkRMYXlvdXRFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xyXG4gIExFZGdlLmNhbGwodGhpcywgc291cmNlLCB0YXJnZXQsIHZFZGdlKTtcclxuICB0aGlzLmlkZWFsTGVuZ3RoID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSDtcclxufVxyXG5cclxuRkRMYXlvdXRFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEVkZ2UucHJvdG90eXBlKTtcclxuXHJcbmZvciAodmFyIHByb3AgaW4gTEVkZ2UpIHtcclxuICBGRExheW91dEVkZ2VbcHJvcF0gPSBMRWRnZVtwcm9wXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dEVkZ2U7XHJcbiIsInZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcclxuXHJcbmZ1bmN0aW9uIEZETGF5b3V0Tm9kZShnbSwgbG9jLCBzaXplLCB2Tm9kZSkge1xyXG4gIC8vIGFsdGVybmF0aXZlIGNvbnN0cnVjdG9yIGlzIGhhbmRsZWQgaW5zaWRlIExOb2RlXHJcbiAgTE5vZGUuY2FsbCh0aGlzLCBnbSwgbG9jLCBzaXplLCB2Tm9kZSk7XHJcbiAgLy9TcHJpbmcsIHJlcHVsc2lvbiBhbmQgZ3Jhdml0YXRpb25hbCBmb3JjZXMgYWN0aW5nIG9uIHRoaXMgbm9kZVxyXG4gIHRoaXMuc3ByaW5nRm9yY2VYID0gMDtcclxuICB0aGlzLnNwcmluZ0ZvcmNlWSA9IDA7XHJcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVggPSAwO1xyXG4gIHRoaXMucmVwdWxzaW9uRm9yY2VZID0gMDtcclxuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYID0gMDtcclxuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VZID0gMDtcclxuICAvL0Ftb3VudCBieSB3aGljaCB0aGlzIG5vZGUgaXMgdG8gYmUgbW92ZWQgaW4gdGhpcyBpdGVyYXRpb25cclxuICB0aGlzLmRpc3BsYWNlbWVudFggPSAwO1xyXG4gIHRoaXMuZGlzcGxhY2VtZW50WSA9IDA7XHJcblxyXG4gIC8vU3RhcnQgYW5kIGZpbmlzaCBncmlkIGNvb3JkaW5hdGVzIHRoYXQgdGhpcyBub2RlIGlzIGZhbGxlbiBpbnRvXHJcbiAgdGhpcy5zdGFydFggPSAwO1xyXG4gIHRoaXMuZmluaXNoWCA9IDA7XHJcbiAgdGhpcy5zdGFydFkgPSAwO1xyXG4gIHRoaXMuZmluaXNoWSA9IDA7XHJcblxyXG4gIC8vR2VvbWV0cmljIG5laWdoYm9ycyBvZiB0aGlzIG5vZGVcclxuICB0aGlzLnN1cnJvdW5kaW5nID0gW107XHJcbn1cclxuXHJcbkZETGF5b3V0Tm9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExOb2RlLnByb3RvdHlwZSk7XHJcblxyXG5mb3IgKHZhciBwcm9wIGluIExOb2RlKSB7XHJcbiAgRkRMYXlvdXROb2RlW3Byb3BdID0gTE5vZGVbcHJvcF07XHJcbn1cclxuXHJcbkZETGF5b3V0Tm9kZS5wcm90b3R5cGUuc2V0R3JpZENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKF9zdGFydFgsIF9maW5pc2hYLCBfc3RhcnRZLCBfZmluaXNoWSlcclxue1xyXG4gIHRoaXMuc3RhcnRYID0gX3N0YXJ0WDtcclxuICB0aGlzLmZpbmlzaFggPSBfZmluaXNoWDtcclxuICB0aGlzLnN0YXJ0WSA9IF9zdGFydFk7XHJcbiAgdGhpcy5maW5pc2hZID0gX2ZpbmlzaFk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dE5vZGU7XHJcbiIsInZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcclxuXHJcbmZ1bmN0aW9uIEhhc2hNYXAoKSB7XHJcbiAgdGhpcy5tYXAgPSB7fTtcclxuICB0aGlzLmtleXMgPSBbXTtcclxufVxyXG5cclxuSGFzaE1hcC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xyXG4gIGlmICghdGhpcy5jb250YWlucyh0aGVJZCkpIHtcclxuICAgIHRoaXMubWFwW3RoZUlkXSA9IHZhbHVlO1xyXG4gICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICB9XHJcbn07XHJcblxyXG5IYXNoTWFwLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xyXG4gIHJldHVybiB0aGlzLm1hcFtrZXldICE9IG51bGw7XHJcbn07XHJcblxyXG5IYXNoTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQoa2V5KTtcclxuICByZXR1cm4gdGhpcy5tYXBbdGhlSWRdO1xyXG59O1xyXG5cclxuSGFzaE1hcC5wcm90b3R5cGUua2V5U2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmtleXM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2hNYXA7XHJcbiIsInZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcclxuXHJcbmZ1bmN0aW9uIEhhc2hTZXQoKSB7XHJcbiAgdGhpcy5zZXQgPSB7fTtcclxufVxyXG47XHJcblxyXG5IYXNoU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQob2JqKTtcclxuICBpZiAoIXRoaXMuY29udGFpbnModGhlSWQpKVxyXG4gICAgdGhpcy5zZXRbdGhlSWRdID0gb2JqO1xyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gIGRlbGV0ZSB0aGlzLnNldFtVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChvYmopXTtcclxufTtcclxuXHJcbkhhc2hTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc2V0ID0ge307XHJcbn07XHJcblxyXG5IYXNoU2V0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChvYmopIHtcclxuICByZXR1cm4gdGhpcy5zZXRbVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQob2JqKV0gPT0gb2JqO1xyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5zaXplKCkgPT09IDA7XHJcbn07XHJcblxyXG5IYXNoU2V0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnNldCkubGVuZ3RoO1xyXG59O1xyXG5cclxuLy9jb25jYXRzIHRoaXMuc2V0IHRvIHRoZSBnaXZlbiBsaXN0XHJcbkhhc2hTZXQucHJvdG90eXBlLmFkZEFsbFRvID0gZnVuY3Rpb24gKGxpc3QpIHtcclxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuc2V0KTtcclxuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgbGlzdC5wdXNoKHRoaXMuc2V0W2tleXNbaV1dKTtcclxuICB9XHJcbn07XHJcblxyXG5IYXNoU2V0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnNldCkubGVuZ3RoO1xyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuYWRkQWxsID0gZnVuY3Rpb24gKGxpc3QpIHtcclxuICB2YXIgcyA9IGxpc3QubGVuZ3RoO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKSB7XHJcbiAgICB2YXIgdiA9IGxpc3RbaV07XHJcbiAgICB0aGlzLmFkZCh2KTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2hTZXQ7XHJcbiIsImZ1bmN0aW9uIElHZW9tZXRyeSgpIHtcclxufVxyXG5cclxuSUdlb21ldHJ5LmNhbGNTZXBhcmF0aW9uQW1vdW50ID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0Qiwgb3ZlcmxhcEFtb3VudCwgc2VwYXJhdGlvbkJ1ZmZlcilcclxue1xyXG4gIGlmICghcmVjdEEuaW50ZXJzZWN0cyhyZWN0QikpIHtcclxuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xyXG4gIH1cclxuICB2YXIgZGlyZWN0aW9ucyA9IG5ldyBBcnJheSgyKTtcclxuICBJR2VvbWV0cnkuZGVjaWRlRGlyZWN0aW9uc0Zvck92ZXJsYXBwaW5nTm9kZXMocmVjdEEsIHJlY3RCLCBkaXJlY3Rpb25zKTtcclxuICBvdmVybGFwQW1vdW50WzBdID0gTWF0aC5taW4ocmVjdEEuZ2V0UmlnaHQoKSwgcmVjdEIuZ2V0UmlnaHQoKSkgLVxyXG4gICAgICAgICAgTWF0aC5tYXgocmVjdEEueCwgcmVjdEIueCk7XHJcbiAgb3ZlcmxhcEFtb3VudFsxXSA9IE1hdGgubWluKHJlY3RBLmdldEJvdHRvbSgpLCByZWN0Qi5nZXRCb3R0b20oKSkgLVxyXG4gICAgICAgICAgTWF0aC5tYXgocmVjdEEueSwgcmVjdEIueSk7XHJcbiAgLy8gdXBkYXRlIHRoZSBvdmVybGFwcGluZyBhbW91bnRzIGZvciB0aGUgZm9sbG93aW5nIGNhc2VzOlxyXG4gIGlmICgocmVjdEEuZ2V0WCgpIDw9IHJlY3RCLmdldFgoKSkgJiYgKHJlY3RBLmdldFJpZ2h0KCkgPj0gcmVjdEIuZ2V0UmlnaHQoKSkpXHJcbiAge1xyXG4gICAgb3ZlcmxhcEFtb3VudFswXSArPSBNYXRoLm1pbigocmVjdEIuZ2V0WCgpIC0gcmVjdEEuZ2V0WCgpKSxcclxuICAgICAgICAgICAgKHJlY3RBLmdldFJpZ2h0KCkgLSByZWN0Qi5nZXRSaWdodCgpKSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKChyZWN0Qi5nZXRYKCkgPD0gcmVjdEEuZ2V0WCgpKSAmJiAocmVjdEIuZ2V0UmlnaHQoKSA+PSByZWN0QS5nZXRSaWdodCgpKSlcclxuICB7XHJcbiAgICBvdmVybGFwQW1vdW50WzBdICs9IE1hdGgubWluKChyZWN0QS5nZXRYKCkgLSByZWN0Qi5nZXRYKCkpLFxyXG4gICAgICAgICAgICAocmVjdEIuZ2V0UmlnaHQoKSAtIHJlY3RBLmdldFJpZ2h0KCkpKTtcclxuICB9XHJcbiAgaWYgKChyZWN0QS5nZXRZKCkgPD0gcmVjdEIuZ2V0WSgpKSAmJiAocmVjdEEuZ2V0Qm90dG9tKCkgPj0gcmVjdEIuZ2V0Qm90dG9tKCkpKVxyXG4gIHtcclxuICAgIG92ZXJsYXBBbW91bnRbMV0gKz0gTWF0aC5taW4oKHJlY3RCLmdldFkoKSAtIHJlY3RBLmdldFkoKSksXHJcbiAgICAgICAgICAgIChyZWN0QS5nZXRCb3R0b20oKSAtIHJlY3RCLmdldEJvdHRvbSgpKSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKChyZWN0Qi5nZXRZKCkgPD0gcmVjdEEuZ2V0WSgpKSAmJiAocmVjdEIuZ2V0Qm90dG9tKCkgPj0gcmVjdEEuZ2V0Qm90dG9tKCkpKVxyXG4gIHtcclxuICAgIG92ZXJsYXBBbW91bnRbMV0gKz0gTWF0aC5taW4oKHJlY3RBLmdldFkoKSAtIHJlY3RCLmdldFkoKSksXHJcbiAgICAgICAgICAgIChyZWN0Qi5nZXRCb3R0b20oKSAtIHJlY3RBLmdldEJvdHRvbSgpKSk7XHJcbiAgfVxyXG5cclxuICAvLyBmaW5kIHNsb3BlIG9mIHRoZSBsaW5lIHBhc3NlcyB0d28gY2VudGVyc1xyXG4gIHZhciBzbG9wZSA9IE1hdGguYWJzKChyZWN0Qi5nZXRDZW50ZXJZKCkgLSByZWN0QS5nZXRDZW50ZXJZKCkpIC9cclxuICAgICAgICAgIChyZWN0Qi5nZXRDZW50ZXJYKCkgLSByZWN0QS5nZXRDZW50ZXJYKCkpKTtcclxuICAvLyBpZiBjZW50ZXJzIGFyZSBvdmVybGFwcGVkXHJcbiAgaWYgKChyZWN0Qi5nZXRDZW50ZXJZKCkgPT0gcmVjdEEuZ2V0Q2VudGVyWSgpKSAmJlxyXG4gICAgICAgICAgKHJlY3RCLmdldENlbnRlclgoKSA9PSByZWN0QS5nZXRDZW50ZXJYKCkpKVxyXG4gIHtcclxuICAgIC8vIGFzc3VtZSB0aGUgc2xvcGUgaXMgMSAoNDUgZGVncmVlKVxyXG4gICAgc2xvcGUgPSAxLjA7XHJcbiAgfVxyXG5cclxuICB2YXIgbW92ZUJ5WSA9IHNsb3BlICogb3ZlcmxhcEFtb3VudFswXTtcclxuICB2YXIgbW92ZUJ5WCA9IG92ZXJsYXBBbW91bnRbMV0gLyBzbG9wZTtcclxuICBpZiAob3ZlcmxhcEFtb3VudFswXSA8IG1vdmVCeVgpXHJcbiAge1xyXG4gICAgbW92ZUJ5WCA9IG92ZXJsYXBBbW91bnRbMF07XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICBtb3ZlQnlZID0gb3ZlcmxhcEFtb3VudFsxXTtcclxuICB9XHJcbiAgLy8gcmV0dXJuIGhhbGYgdGhlIGFtb3VudCBzbyB0aGF0IGlmIGVhY2ggcmVjdGFuZ2xlIGlzIG1vdmVkIGJ5IHRoZXNlXHJcbiAgLy8gYW1vdW50cyBpbiBvcHBvc2l0ZSBkaXJlY3Rpb25zLCBvdmVybGFwIHdpbGwgYmUgcmVzb2x2ZWRcclxuICBvdmVybGFwQW1vdW50WzBdID0gLTEgKiBkaXJlY3Rpb25zWzBdICogKChtb3ZlQnlYIC8gMikgKyBzZXBhcmF0aW9uQnVmZmVyKTtcclxuICBvdmVybGFwQW1vdW50WzFdID0gLTEgKiBkaXJlY3Rpb25zWzFdICogKChtb3ZlQnlZIC8gMikgKyBzZXBhcmF0aW9uQnVmZmVyKTtcclxufVxyXG5cclxuSUdlb21ldHJ5LmRlY2lkZURpcmVjdGlvbnNGb3JPdmVybGFwcGluZ05vZGVzID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0QiwgZGlyZWN0aW9ucylcclxue1xyXG4gIGlmIChyZWN0QS5nZXRDZW50ZXJYKCkgPCByZWN0Qi5nZXRDZW50ZXJYKCkpXHJcbiAge1xyXG4gICAgZGlyZWN0aW9uc1swXSA9IC0xO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgZGlyZWN0aW9uc1swXSA9IDE7XHJcbiAgfVxyXG5cclxuICBpZiAocmVjdEEuZ2V0Q2VudGVyWSgpIDwgcmVjdEIuZ2V0Q2VudGVyWSgpKVxyXG4gIHtcclxuICAgIGRpcmVjdGlvbnNbMV0gPSAtMTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIGRpcmVjdGlvbnNbMV0gPSAxO1xyXG4gIH1cclxufVxyXG5cclxuSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbjIgPSBmdW5jdGlvbiAocmVjdEEsIHJlY3RCLCByZXN1bHQpXHJcbntcclxuICAvL3Jlc3VsdFswLTFdIHdpbGwgY29udGFpbiBjbGlwUG9pbnQgb2YgcmVjdEEsIHJlc3VsdFsyLTNdIHdpbGwgY29udGFpbiBjbGlwUG9pbnQgb2YgcmVjdEJcclxuICB2YXIgcDF4ID0gcmVjdEEuZ2V0Q2VudGVyWCgpO1xyXG4gIHZhciBwMXkgPSByZWN0QS5nZXRDZW50ZXJZKCk7XHJcbiAgdmFyIHAyeCA9IHJlY3RCLmdldENlbnRlclgoKTtcclxuICB2YXIgcDJ5ID0gcmVjdEIuZ2V0Q2VudGVyWSgpO1xyXG5cclxuICAvL2lmIHR3byByZWN0YW5nbGVzIGludGVyc2VjdCwgdGhlbiBjbGlwcGluZyBwb2ludHMgYXJlIGNlbnRlcnNcclxuICBpZiAocmVjdEEuaW50ZXJzZWN0cyhyZWN0QikpXHJcbiAge1xyXG4gICAgcmVzdWx0WzBdID0gcDF4O1xyXG4gICAgcmVzdWx0WzFdID0gcDF5O1xyXG4gICAgcmVzdWx0WzJdID0gcDJ4O1xyXG4gICAgcmVzdWx0WzNdID0gcDJ5O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIC8vdmFyaWFibGVzIGZvciByZWN0QVxyXG4gIHZhciB0b3BMZWZ0QXggPSByZWN0QS5nZXRYKCk7XHJcbiAgdmFyIHRvcExlZnRBeSA9IHJlY3RBLmdldFkoKTtcclxuICB2YXIgdG9wUmlnaHRBeCA9IHJlY3RBLmdldFJpZ2h0KCk7XHJcbiAgdmFyIGJvdHRvbUxlZnRBeCA9IHJlY3RBLmdldFgoKTtcclxuICB2YXIgYm90dG9tTGVmdEF5ID0gcmVjdEEuZ2V0Qm90dG9tKCk7XHJcbiAgdmFyIGJvdHRvbVJpZ2h0QXggPSByZWN0QS5nZXRSaWdodCgpO1xyXG4gIHZhciBoYWxmV2lkdGhBID0gcmVjdEEuZ2V0V2lkdGhIYWxmKCk7XHJcbiAgdmFyIGhhbGZIZWlnaHRBID0gcmVjdEEuZ2V0SGVpZ2h0SGFsZigpO1xyXG4gIC8vdmFyaWFibGVzIGZvciByZWN0QlxyXG4gIHZhciB0b3BMZWZ0QnggPSByZWN0Qi5nZXRYKCk7XHJcbiAgdmFyIHRvcExlZnRCeSA9IHJlY3RCLmdldFkoKTtcclxuICB2YXIgdG9wUmlnaHRCeCA9IHJlY3RCLmdldFJpZ2h0KCk7XHJcbiAgdmFyIGJvdHRvbUxlZnRCeCA9IHJlY3RCLmdldFgoKTtcclxuICB2YXIgYm90dG9tTGVmdEJ5ID0gcmVjdEIuZ2V0Qm90dG9tKCk7XHJcbiAgdmFyIGJvdHRvbVJpZ2h0QnggPSByZWN0Qi5nZXRSaWdodCgpO1xyXG4gIHZhciBoYWxmV2lkdGhCID0gcmVjdEIuZ2V0V2lkdGhIYWxmKCk7XHJcbiAgdmFyIGhhbGZIZWlnaHRCID0gcmVjdEIuZ2V0SGVpZ2h0SGFsZigpO1xyXG4gIC8vZmxhZyB3aGV0aGVyIGNsaXBwaW5nIHBvaW50cyBhcmUgZm91bmRcclxuICB2YXIgY2xpcFBvaW50QUZvdW5kID0gZmFsc2U7XHJcbiAgdmFyIGNsaXBQb2ludEJGb3VuZCA9IGZhbHNlO1xyXG5cclxuICAvLyBsaW5lIGlzIHZlcnRpY2FsXHJcbiAgaWYgKHAxeCA9PSBwMngpXHJcbiAge1xyXG4gICAgaWYgKHAxeSA+IHAyeSlcclxuICAgIHtcclxuICAgICAgcmVzdWx0WzBdID0gcDF4O1xyXG4gICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XHJcbiAgICAgIHJlc3VsdFsyXSA9IHAyeDtcclxuICAgICAgcmVzdWx0WzNdID0gYm90dG9tTGVmdEJ5O1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwMXkgPCBwMnkpXHJcbiAgICB7XHJcbiAgICAgIHJlc3VsdFswXSA9IHAxeDtcclxuICAgICAgcmVzdWx0WzFdID0gYm90dG9tTGVmdEF5O1xyXG4gICAgICByZXN1bHRbMl0gPSBwMng7XHJcbiAgICAgIHJlc3VsdFszXSA9IHRvcExlZnRCeTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAvL25vdCBsaW5lLCByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gbGluZSBpcyBob3Jpem9udGFsXHJcbiAgZWxzZSBpZiAocDF5ID09IHAyeSlcclxuICB7XHJcbiAgICBpZiAocDF4ID4gcDJ4KVxyXG4gICAge1xyXG4gICAgICByZXN1bHRbMF0gPSB0b3BMZWZ0QXg7XHJcbiAgICAgIHJlc3VsdFsxXSA9IHAxeTtcclxuICAgICAgcmVzdWx0WzJdID0gdG9wUmlnaHRCeDtcclxuICAgICAgcmVzdWx0WzNdID0gcDJ5O1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwMXggPCBwMngpXHJcbiAgICB7XHJcbiAgICAgIHJlc3VsdFswXSA9IHRvcFJpZ2h0QXg7XHJcbiAgICAgIHJlc3VsdFsxXSA9IHAxeTtcclxuICAgICAgcmVzdWx0WzJdID0gdG9wTGVmdEJ4O1xyXG4gICAgICByZXN1bHRbM10gPSBwMnk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgLy9ub3QgdmFsaWQgbGluZSwgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICAvL3Nsb3BlcyBvZiByZWN0QSdzIGFuZCByZWN0QidzIGRpYWdvbmFsc1xyXG4gICAgdmFyIHNsb3BlQSA9IHJlY3RBLmhlaWdodCAvIHJlY3RBLndpZHRoO1xyXG4gICAgdmFyIHNsb3BlQiA9IHJlY3RCLmhlaWdodCAvIHJlY3RCLndpZHRoO1xyXG5cclxuICAgIC8vc2xvcGUgb2YgbGluZSBiZXR3ZWVuIGNlbnRlciBvZiByZWN0QSBhbmQgY2VudGVyIG9mIHJlY3RCXHJcbiAgICB2YXIgc2xvcGVQcmltZSA9IChwMnkgLSBwMXkpIC8gKHAyeCAtIHAxeCk7XHJcbiAgICB2YXIgY2FyZGluYWxEaXJlY3Rpb25BO1xyXG4gICAgdmFyIGNhcmRpbmFsRGlyZWN0aW9uQjtcclxuICAgIHZhciB0ZW1wUG9pbnRBeDtcclxuICAgIHZhciB0ZW1wUG9pbnRBeTtcclxuICAgIHZhciB0ZW1wUG9pbnRCeDtcclxuICAgIHZhciB0ZW1wUG9pbnRCeTtcclxuXHJcbiAgICAvL2RldGVybWluZSB3aGV0aGVyIGNsaXBwaW5nIHBvaW50IGlzIHRoZSBjb3JuZXIgb2Ygbm9kZUFcclxuICAgIGlmICgoLXNsb3BlQSkgPT0gc2xvcGVQcmltZSlcclxuICAgIHtcclxuICAgICAgaWYgKHAxeCA+IHAyeClcclxuICAgICAge1xyXG4gICAgICAgIHJlc3VsdFswXSA9IGJvdHRvbUxlZnRBeDtcclxuICAgICAgICByZXN1bHRbMV0gPSBib3R0b21MZWZ0QXk7XHJcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMF0gPSB0b3BSaWdodEF4O1xyXG4gICAgICAgIHJlc3VsdFsxXSA9IHRvcExlZnRBeTtcclxuICAgICAgICBjbGlwUG9pbnRBRm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzbG9wZUEgPT0gc2xvcGVQcmltZSlcclxuICAgIHtcclxuICAgICAgaWYgKHAxeCA+IHAyeClcclxuICAgICAge1xyXG4gICAgICAgIHJlc3VsdFswXSA9IHRvcExlZnRBeDtcclxuICAgICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XHJcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMF0gPSBib3R0b21SaWdodEF4O1xyXG4gICAgICAgIHJlc3VsdFsxXSA9IGJvdHRvbUxlZnRBeTtcclxuICAgICAgICBjbGlwUG9pbnRBRm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9kZXRlcm1pbmUgd2hldGhlciBjbGlwcGluZyBwb2ludCBpcyB0aGUgY29ybmVyIG9mIG5vZGVCXHJcbiAgICBpZiAoKC1zbG9wZUIpID09IHNsb3BlUHJpbWUpXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMnggPiBwMXgpXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMl0gPSBib3R0b21MZWZ0Qng7XHJcbiAgICAgICAgcmVzdWx0WzNdID0gYm90dG9tTGVmdEJ5O1xyXG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzJdID0gdG9wUmlnaHRCeDtcclxuICAgICAgICByZXN1bHRbM10gPSB0b3BMZWZ0Qnk7XHJcbiAgICAgICAgY2xpcFBvaW50QkZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc2xvcGVCID09IHNsb3BlUHJpbWUpXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMnggPiBwMXgpXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMl0gPSB0b3BMZWZ0Qng7XHJcbiAgICAgICAgcmVzdWx0WzNdID0gdG9wTGVmdEJ5O1xyXG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzJdID0gYm90dG9tUmlnaHRCeDtcclxuICAgICAgICByZXN1bHRbM10gPSBib3R0b21MZWZ0Qnk7XHJcbiAgICAgICAgY2xpcFBvaW50QkZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vaWYgYm90aCBjbGlwcGluZyBwb2ludHMgYXJlIGNvcm5lcnNcclxuICAgIGlmIChjbGlwUG9pbnRBRm91bmQgJiYgY2xpcFBvaW50QkZvdW5kKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9kZXRlcm1pbmUgQ2FyZGluYWwgRGlyZWN0aW9uIG9mIHJlY3RhbmdsZXNcclxuICAgIGlmIChwMXggPiBwMngpXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMXkgPiBwMnkpXHJcbiAgICAgIHtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVBLCBzbG9wZVByaW1lLCA0KTtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkIgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVCLCBzbG9wZVByaW1lLCAyKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgIHtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oLXNsb3BlQSwgc2xvcGVQcmltZSwgMyk7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUIsIHNsb3BlUHJpbWUsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMXkgPiBwMnkpXHJcbiAgICAgIHtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oLXNsb3BlQSwgc2xvcGVQcmltZSwgMSk7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUIsIHNsb3BlUHJpbWUsIDMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQSA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbihzbG9wZUEsIHNsb3BlUHJpbWUsIDIpO1xyXG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQiA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbihzbG9wZUIsIHNsb3BlUHJpbWUsIDQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2NhbGN1bGF0ZSBjbGlwcGluZyBQb2ludCBpZiBpdCBpcyBub3QgZm91bmQgYmVmb3JlXHJcbiAgICBpZiAoIWNsaXBQb2ludEFGb3VuZClcclxuICAgIHtcclxuICAgICAgc3dpdGNoIChjYXJkaW5hbERpcmVjdGlvbkEpXHJcbiAgICAgIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeSA9IHRvcExlZnRBeTtcclxuICAgICAgICAgIHRlbXBQb2ludEF4ID0gcDF4ICsgKC1oYWxmSGVpZ2h0QSkgLyBzbG9wZVByaW1lO1xyXG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XHJcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRlbXBQb2ludEF4ID0gYm90dG9tUmlnaHRBeDtcclxuICAgICAgICAgIHRlbXBQb2ludEF5ID0gcDF5ICsgaGFsZldpZHRoQSAqIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcclxuICAgICAgICAgIHJlc3VsdFsxXSA9IHRlbXBQb2ludEF5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGVtcFBvaW50QXkgPSBib3R0b21MZWZ0QXk7XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IHAxeCArIGhhbGZIZWlnaHRBIC8gc2xvcGVQcmltZTtcclxuICAgICAgICAgIHJlc3VsdFswXSA9IHRlbXBQb2ludEF4O1xyXG4gICAgICAgICAgcmVzdWx0WzFdID0gdGVtcFBvaW50QXk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IGJvdHRvbUxlZnRBeDtcclxuICAgICAgICAgIHRlbXBQb2ludEF5ID0gcDF5ICsgKC1oYWxmV2lkdGhBKSAqIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcclxuICAgICAgICAgIHJlc3VsdFsxXSA9IHRlbXBQb2ludEF5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghY2xpcFBvaW50QkZvdW5kKVxyXG4gICAge1xyXG4gICAgICBzd2l0Y2ggKGNhcmRpbmFsRGlyZWN0aW9uQilcclxuICAgICAge1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRlbXBQb2ludEJ5ID0gdG9wTGVmdEJ5O1xyXG4gICAgICAgICAgdGVtcFBvaW50QnggPSBwMnggKyAoLWhhbGZIZWlnaHRCKSAvIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcclxuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGVtcFBvaW50QnggPSBib3R0b21SaWdodEJ4O1xyXG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBwMnkgKyBoYWxmV2lkdGhCICogc2xvcGVQcmltZTtcclxuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xyXG4gICAgICAgICAgcmVzdWx0WzNdID0gdGVtcFBvaW50Qnk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRCeSA9IGJvdHRvbUxlZnRCeTtcclxuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gcDJ4ICsgaGFsZkhlaWdodEIgLyBzbG9wZVByaW1lO1xyXG4gICAgICAgICAgcmVzdWx0WzJdID0gdGVtcFBvaW50Qng7XHJcbiAgICAgICAgICByZXN1bHRbM10gPSB0ZW1wUG9pbnRCeTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gYm90dG9tTGVmdEJ4O1xyXG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBwMnkgKyAoLWhhbGZXaWR0aEIpICogc2xvcGVQcmltZTtcclxuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xyXG4gICAgICAgICAgcmVzdWx0WzNdID0gdGVtcFBvaW50Qnk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbklHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbiA9IGZ1bmN0aW9uIChzbG9wZSwgc2xvcGVQcmltZSwgbGluZSlcclxue1xyXG4gIGlmIChzbG9wZSA+IHNsb3BlUHJpbWUpXHJcbiAge1xyXG4gICAgcmV0dXJuIGxpbmU7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICByZXR1cm4gMSArIGxpbmUgJSA0O1xyXG4gIH1cclxufVxyXG5cclxuSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChzMSwgczIsIGYxLCBmMilcclxue1xyXG4gIGlmIChmMiA9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gSUdlb21ldHJ5LmdldEludGVyc2VjdGlvbjIoczEsIHMyLCBmMSk7XHJcbiAgfVxyXG4gIHZhciB4MSA9IHMxLng7XHJcbiAgdmFyIHkxID0gczEueTtcclxuICB2YXIgeDIgPSBzMi54O1xyXG4gIHZhciB5MiA9IHMyLnk7XHJcbiAgdmFyIHgzID0gZjEueDtcclxuICB2YXIgeTMgPSBmMS55O1xyXG4gIHZhciB4NCA9IGYyLng7XHJcbiAgdmFyIHk0ID0gZjIueTtcclxuICB2YXIgeCwgeTsgLy8gaW50ZXJzZWN0aW9uIHBvaW50XHJcbiAgdmFyIGExLCBhMiwgYjEsIGIyLCBjMSwgYzI7IC8vIGNvZWZmaWNpZW50cyBvZiBsaW5lIGVxbnMuXHJcbiAgdmFyIGRlbm9tO1xyXG5cclxuICBhMSA9IHkyIC0geTE7XHJcbiAgYjEgPSB4MSAtIHgyO1xyXG4gIGMxID0geDIgKiB5MSAtIHgxICogeTI7ICAvLyB7IGExKnggKyBiMSp5ICsgYzEgPSAwIGlzIGxpbmUgMSB9XHJcblxyXG4gIGEyID0geTQgLSB5MztcclxuICBiMiA9IHgzIC0geDQ7XHJcbiAgYzIgPSB4NCAqIHkzIC0geDMgKiB5NDsgIC8vIHsgYTIqeCArIGIyKnkgKyBjMiA9IDAgaXMgbGluZSAyIH1cclxuXHJcbiAgZGVub20gPSBhMSAqIGIyIC0gYTIgKiBiMTtcclxuXHJcbiAgaWYgKGRlbm9tID09IDApXHJcbiAge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICB4ID0gKGIxICogYzIgLSBiMiAqIGMxKSAvIGRlbm9tO1xyXG4gIHkgPSAoYTIgKiBjMSAtIGExICogYzIpIC8gZGVub207XHJcblxyXG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XHJcbn1cclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIFNlY3Rpb246IENsYXNzIENvbnN0YW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vKipcclxuICogU29tZSB1c2VmdWwgcHJlLWNhbGN1bGF0ZWQgY29uc3RhbnRzXHJcbiAqL1xyXG5JR2VvbWV0cnkuSEFMRl9QSSA9IDAuNSAqIE1hdGguUEk7XHJcbklHZW9tZXRyeS5PTkVfQU5EX0hBTEZfUEkgPSAxLjUgKiBNYXRoLlBJO1xyXG5JR2VvbWV0cnkuVFdPX1BJID0gMi4wICogTWF0aC5QSTtcclxuSUdlb21ldHJ5LlRIUkVFX1BJID0gMy4wICogTWF0aC5QSTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSUdlb21ldHJ5O1xyXG4iLCJmdW5jdGlvbiBJTWF0aCgpIHtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIHNpZ24gb2YgdGhlIGlucHV0IHZhbHVlLlxyXG4gKi9cclxuSU1hdGguc2lnbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICh2YWx1ZSA+IDApXHJcbiAge1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHZhbHVlIDwgMClcclxuICB7XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn1cclxuXHJcbklNYXRoLmZsb29yID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHZhbHVlIDwgMCA/IE1hdGguY2VpbCh2YWx1ZSkgOiBNYXRoLmZsb29yKHZhbHVlKTtcclxufVxyXG5cclxuSU1hdGguY2VpbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLmZsb29yKHZhbHVlKSA6IE1hdGguY2VpbCh2YWx1ZSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSU1hdGg7XHJcbiIsImZ1bmN0aW9uIEludGVnZXIoKSB7XHJcbn1cclxuXHJcbkludGVnZXIuTUFYX1ZBTFVFID0gMjE0NzQ4MzY0NztcclxuSW50ZWdlci5NSU5fVkFMVUUgPSAtMjE0NzQ4MzY0ODtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW50ZWdlcjtcclxuIiwidmFyIExHcmFwaE9iamVjdCA9IHJlcXVpcmUoJy4vTEdyYXBoT2JqZWN0Jyk7XHJcbnZhciBJR2VvbWV0cnkgPSByZXF1aXJlKCcuL0lHZW9tZXRyeScpO1xyXG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBMRWRnZShzb3VyY2UsIHRhcmdldCwgdkVkZ2UpIHtcclxuICBMR3JhcGhPYmplY3QuY2FsbCh0aGlzLCB2RWRnZSk7XHJcblxyXG4gIHRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0ID0gZmFsc2U7XHJcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2RWRnZTtcclxuICB0aGlzLmJlbmRwb2ludHMgPSBbXTtcclxuICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxufVxyXG5cclxuTEVkZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhPYmplY3QucHJvdG90eXBlKTtcclxuXHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoT2JqZWN0KSB7XHJcbiAgTEVkZ2VbcHJvcF0gPSBMR3JhcGhPYmplY3RbcHJvcF07XHJcbn1cclxuXHJcbkxFZGdlLnByb3RvdHlwZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuc291cmNlO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldFRhcmdldCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy50YXJnZXQ7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuaXNJbnRlckdyYXBoID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmlzSW50ZXJHcmFwaDtcclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS5nZXRMZW5ndGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubGVuZ3RoO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQ7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0QmVuZHBvaW50cyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5iZW5kcG9pbnRzO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldExjYSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5sY2E7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0U291cmNlSW5MY2EgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuc291cmNlSW5MY2E7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0VGFyZ2V0SW5MY2EgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMudGFyZ2V0SW5MY2E7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0T3RoZXJFbmQgPSBmdW5jdGlvbiAobm9kZSlcclxue1xyXG4gIGlmICh0aGlzLnNvdXJjZSA9PT0gbm9kZSlcclxuICB7XHJcbiAgICByZXR1cm4gdGhpcy50YXJnZXQ7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHRoaXMudGFyZ2V0ID09PSBub2RlKVxyXG4gIHtcclxuICAgIHJldHVybiB0aGlzLnNvdXJjZTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIHRocm93IFwiTm9kZSBpcyBub3QgaW5jaWRlbnQgd2l0aCB0aGlzIGVkZ2VcIjtcclxuICB9XHJcbn1cclxuXHJcbkxFZGdlLnByb3RvdHlwZS5nZXRPdGhlckVuZEluR3JhcGggPSBmdW5jdGlvbiAobm9kZSwgZ3JhcGgpXHJcbntcclxuICB2YXIgb3RoZXJFbmQgPSB0aGlzLmdldE90aGVyRW5kKG5vZGUpO1xyXG4gIHZhciByb290ID0gZ3JhcGguZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0Um9vdCgpO1xyXG5cclxuICB3aGlsZSAodHJ1ZSlcclxuICB7XHJcbiAgICBpZiAob3RoZXJFbmQuZ2V0T3duZXIoKSA9PSBncmFwaClcclxuICAgIHtcclxuICAgICAgcmV0dXJuIG90aGVyRW5kO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvdGhlckVuZC5nZXRPd25lcigpID09IHJvb3QpXHJcbiAgICB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIG90aGVyRW5kID0gb3RoZXJFbmQuZ2V0T3duZXIoKS5nZXRQYXJlbnQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLnVwZGF0ZUxlbmd0aCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgY2xpcFBvaW50Q29vcmRpbmF0ZXMgPSBuZXcgQXJyYXkoNCk7XHJcblxyXG4gIHRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0ID1cclxuICAgICAgICAgIElHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24odGhpcy50YXJnZXQuZ2V0UmVjdCgpLFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5nZXRSZWN0KCksXHJcbiAgICAgICAgICAgICAgICAgIGNsaXBQb2ludENvb3JkaW5hdGVzKTtcclxuXHJcbiAgaWYgKCF0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldClcclxuICB7XHJcbiAgICB0aGlzLmxlbmd0aFggPSBjbGlwUG9pbnRDb29yZGluYXRlc1swXSAtIGNsaXBQb2ludENvb3JkaW5hdGVzWzJdO1xyXG4gICAgdGhpcy5sZW5ndGhZID0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbMV0gLSBjbGlwUG9pbnRDb29yZGluYXRlc1szXTtcclxuXHJcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhYKSA8IDEuMClcclxuICAgIHtcclxuICAgICAgdGhpcy5sZW5ndGhYID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxlbmd0aFkpIDwgMS4wKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmxlbmd0aFkgPSBJTWF0aC5zaWduKHRoaXMubGVuZ3RoWSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoWCAqIHRoaXMubGVuZ3RoWCArIHRoaXMubGVuZ3RoWSAqIHRoaXMubGVuZ3RoWSk7XHJcbiAgfVxyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLnVwZGF0ZUxlbmd0aFNpbXBsZSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB0aGlzLmxlbmd0aFggPSB0aGlzLnRhcmdldC5nZXRDZW50ZXJYKCkgLSB0aGlzLnNvdXJjZS5nZXRDZW50ZXJYKCk7XHJcbiAgdGhpcy5sZW5ndGhZID0gdGhpcy50YXJnZXQuZ2V0Q2VudGVyWSgpIC0gdGhpcy5zb3VyY2UuZ2V0Q2VudGVyWSgpO1xyXG5cclxuICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhYKSA8IDEuMClcclxuICB7XHJcbiAgICB0aGlzLmxlbmd0aFggPSBJTWF0aC5zaWduKHRoaXMubGVuZ3RoWCk7XHJcbiAgfVxyXG5cclxuICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhZKSA8IDEuMClcclxuICB7XHJcbiAgICB0aGlzLmxlbmd0aFkgPSBJTWF0aC5zaWduKHRoaXMubGVuZ3RoWSk7XHJcbiAgfVxyXG5cclxuICB0aGlzLmxlbmd0aCA9IE1hdGguc3FydChcclxuICAgICAgICAgIHRoaXMubGVuZ3RoWCAqIHRoaXMubGVuZ3RoWCArIHRoaXMubGVuZ3RoWSAqIHRoaXMubGVuZ3RoWSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTEVkZ2U7XHJcbiIsInZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xyXG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xyXG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcclxudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcclxudmFyIExOb2RlID0gcmVxdWlyZSgnLi9MTm9kZScpO1xyXG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XHJcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XHJcbnZhciBSZWN0YW5nbGVEID0gcmVxdWlyZSgnLi9SZWN0YW5nbGVEJyk7XHJcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vUG9pbnQnKTtcclxudmFyIExpc3QgPSByZXF1aXJlKCdsaW5rZWRsaXN0LWpzJykuTGlzdDtcclxuXHJcbmZ1bmN0aW9uIExHcmFwaChwYXJlbnQsIG9iajIsIHZHcmFwaCkge1xyXG4gIExHcmFwaE9iamVjdC5jYWxsKHRoaXMsIHZHcmFwaCk7XHJcbiAgdGhpcy5lc3RpbWF0ZWRTaXplID0gSW50ZWdlci5NSU5fVkFMVUU7XHJcbiAgdGhpcy5tYXJnaW4gPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFQSF9NQVJHSU47XHJcbiAgdGhpcy5lZGdlcyA9IFtdO1xyXG4gIHRoaXMubm9kZXMgPSBbXTtcclxuICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcblxyXG4gIGlmIChvYmoyICE9IG51bGwgJiYgb2JqMiBpbnN0YW5jZW9mIExHcmFwaE1hbmFnZXIpIHtcclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyID0gb2JqMjtcclxuICB9XHJcbiAgZWxzZSBpZiAob2JqMiAhPSBudWxsICYmIG9iajIgaW5zdGFuY2VvZiBMYXlvdXQpIHtcclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyID0gb2JqMi5ncmFwaE1hbmFnZXI7XHJcbiAgfVxyXG59XHJcblxyXG5MR3JhcGgucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhPYmplY3QucHJvdG90eXBlKTtcclxuZm9yICh2YXIgcHJvcCBpbiBMR3JhcGhPYmplY3QpIHtcclxuICBMR3JhcGhbcHJvcF0gPSBMR3JhcGhPYmplY3RbcHJvcF07XHJcbn1cclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuZ2V0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldEVkZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmVkZ2VzO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucGFyZW50O1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxlZnQ7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJpZ2h0O1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMudG9wO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuYm90dG9tO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5pc0Nvbm5lY3RlZDtcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG9iajEsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpIHtcclxuICBpZiAoc291cmNlTm9kZSA9PSBudWxsICYmIHRhcmdldE5vZGUgPT0gbnVsbCkge1xyXG4gICAgdmFyIG5ld05vZGUgPSBvYmoxO1xyXG4gICAgaWYgKHRoaXMuZ3JhcGhNYW5hZ2VyID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJHcmFwaCBoYXMgbm8gZ3JhcGggbWdyIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKG5ld05vZGUpID4gLTEpIHtcclxuICAgICAgdGhyb3cgXCJOb2RlIGFscmVhZHkgaW4gZ3JhcGghXCI7XHJcbiAgICB9XHJcbiAgICBuZXdOb2RlLm93bmVyID0gdGhpcztcclxuICAgIHRoaXMuZ2V0Tm9kZXMoKS5wdXNoKG5ld05vZGUpO1xyXG5cclxuICAgIHJldHVybiBuZXdOb2RlO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBuZXdFZGdlID0gb2JqMTtcclxuICAgIGlmICghKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKHNvdXJjZU5vZGUpID4gLTEgJiYgKHRoaXMuZ2V0Tm9kZXMoKS5pbmRleE9mKHRhcmdldE5vZGUpKSA+IC0xKSkge1xyXG4gICAgICB0aHJvdyBcIlNvdXJjZSBvciB0YXJnZXQgbm90IGluIGdyYXBoIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghKHNvdXJjZU5vZGUub3duZXIgPT0gdGFyZ2V0Tm9kZS5vd25lciAmJiBzb3VyY2VOb2RlLm93bmVyID09IHRoaXMpKSB7XHJcbiAgICAgIHRocm93IFwiQm90aCBvd25lcnMgbXVzdCBiZSB0aGlzIGdyYXBoIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzb3VyY2VOb2RlLm93bmVyICE9IHRhcmdldE5vZGUub3duZXIpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCBzb3VyY2UgYW5kIHRhcmdldFxyXG4gICAgbmV3RWRnZS5zb3VyY2UgPSBzb3VyY2VOb2RlO1xyXG4gICAgbmV3RWRnZS50YXJnZXQgPSB0YXJnZXROb2RlO1xyXG5cclxuICAgIC8vIHNldCBhcyBpbnRyYS1ncmFwaCBlZGdlXHJcbiAgICBuZXdFZGdlLmlzSW50ZXJHcmFwaCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIGFkZCB0byBncmFwaCBlZGdlIGxpc3RcclxuICAgIHRoaXMuZ2V0RWRnZXMoKS5wdXNoKG5ld0VkZ2UpO1xyXG5cclxuICAgIC8vIGFkZCB0byBpbmNpZGVuY3kgbGlzdHNcclxuICAgIHNvdXJjZU5vZGUuZWRnZXMucHVzaChuZXdFZGdlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0Tm9kZSAhPSBzb3VyY2VOb2RlKVxyXG4gICAge1xyXG4gICAgICB0YXJnZXROb2RlLmVkZ2VzLnB1c2gobmV3RWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld0VkZ2U7XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgdmFyIG5vZGUgPSBvYmo7XHJcbiAgaWYgKG9iaiBpbnN0YW5jZW9mIExOb2RlKSB7XHJcbiAgICBpZiAobm9kZSA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IFwiTm9kZSBpcyBudWxsIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCEobm9kZS5vd25lciAhPSBudWxsICYmIG5vZGUub3duZXIgPT0gdGhpcykpIHtcclxuICAgICAgdGhyb3cgXCJPd25lciBncmFwaCBpcyBpbnZhbGlkIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZ3JhcGhNYW5hZ2VyID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJPd25lciBncmFwaCBtYW5hZ2VyIGlzIGludmFsaWQhXCI7XHJcbiAgICB9XHJcbiAgICAvLyByZW1vdmUgaW5jaWRlbnQgZWRnZXMgZmlyc3QgKG1ha2UgYSBjb3B5IHRvIGRvIGl0IHNhZmVseSlcclxuICAgIHZhciBlZGdlc1RvQmVSZW1vdmVkID0gbm9kZS5lZGdlcy5zbGljZSgpO1xyXG4gICAgdmFyIGVkZ2U7XHJcbiAgICB2YXIgcyA9IGVkZ2VzVG9CZVJlbW92ZWQubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIGVkZ2UgPSBlZGdlc1RvQmVSZW1vdmVkW2ldO1xyXG5cclxuICAgICAgaWYgKGVkZ2UuaXNJbnRlckdyYXBoKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy5ncmFwaE1hbmFnZXIucmVtb3ZlKGVkZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIGVkZ2Uuc291cmNlLm93bmVyLnJlbW92ZShlZGdlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vdyB0aGUgbm9kZSBpdHNlbGZcclxuICAgIHZhciBpbmRleCA9IHRoaXMubm9kZXMuaW5kZXhPZihub2RlKTtcclxuICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICB0aHJvdyBcIk5vZGUgbm90IGluIG93bmVyIG5vZGUgbGlzdCFcIjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIExFZGdlKSB7XHJcbiAgICB2YXIgZWRnZSA9IG9iajtcclxuICAgIGlmIChlZGdlID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJFZGdlIGlzIG51bGwhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoIShlZGdlLnNvdXJjZSAhPSBudWxsICYmIGVkZ2UudGFyZ2V0ICE9IG51bGwpKSB7XHJcbiAgICAgIHRocm93IFwiU291cmNlIGFuZC9vciB0YXJnZXQgaXMgbnVsbCFcIjtcclxuICAgIH1cclxuICAgIGlmICghKGVkZ2Uuc291cmNlLm93bmVyICE9IG51bGwgJiYgZWRnZS50YXJnZXQub3duZXIgIT0gbnVsbCAmJlxyXG4gICAgICAgICAgICBlZGdlLnNvdXJjZS5vd25lciA9PSB0aGlzICYmIGVkZ2UudGFyZ2V0Lm93bmVyID09IHRoaXMpKSB7XHJcbiAgICAgIHRocm93IFwiU291cmNlIGFuZC9vciB0YXJnZXQgb3duZXIgaXMgaW52YWxpZCFcIjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc291cmNlSW5kZXggPSBlZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKGVkZ2UpO1xyXG4gICAgdmFyIHRhcmdldEluZGV4ID0gZWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihlZGdlKTtcclxuICAgIGlmICghKHNvdXJjZUluZGV4ID4gLTEgJiYgdGFyZ2V0SW5kZXggPiAtMSkpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBkb2Vzbid0IGtub3cgdGhpcyBlZGdlIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGVkZ2Uuc291cmNlLmVkZ2VzLnNwbGljZShzb3VyY2VJbmRleCwgMSk7XHJcblxyXG4gICAgaWYgKGVkZ2UudGFyZ2V0ICE9IGVkZ2Uuc291cmNlKVxyXG4gICAge1xyXG4gICAgICBlZGdlLnRhcmdldC5lZGdlcy5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbmRleCA9IGVkZ2Uuc291cmNlLm93bmVyLmdldEVkZ2VzKCkuaW5kZXhPZihlZGdlKTtcclxuICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICB0aHJvdyBcIk5vdCBpbiBvd25lcidzIGVkZ2UgbGlzdCFcIjtcclxuICAgIH1cclxuXHJcbiAgICBlZGdlLnNvdXJjZS5vd25lci5nZXRFZGdlcygpLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS51cGRhdGVMZWZ0VG9wID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciB0b3AgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgbGVmdCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBub2RlVG9wO1xyXG4gIHZhciBub2RlTGVmdDtcclxuICB2YXIgbWFyZ2luO1xyXG5cclxuICB2YXIgbm9kZXMgPSB0aGlzLmdldE5vZGVzKCk7XHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgbm9kZVRvcCA9IGxOb2RlLmdldFRvcCgpO1xyXG4gICAgbm9kZUxlZnQgPSBsTm9kZS5nZXRMZWZ0KCk7XHJcblxyXG4gICAgaWYgKHRvcCA+IG5vZGVUb3ApXHJcbiAgICB7XHJcbiAgICAgIHRvcCA9IG5vZGVUb3A7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxlZnQgPiBub2RlTGVmdClcclxuICAgIHtcclxuICAgICAgbGVmdCA9IG5vZGVMZWZ0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRG8gd2UgaGF2ZSBhbnkgbm9kZXMgaW4gdGhpcyBncmFwaD9cclxuICBpZiAodG9wID09IEludGVnZXIuTUFYX1ZBTFVFKVxyXG4gIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBcclxuICBpZihub2Rlc1swXS5nZXRQYXJlbnQoKS5wYWRkaW5nTGVmdCAhPSB1bmRlZmluZWQpe1xyXG4gICAgbWFyZ2luID0gbm9kZXNbMF0uZ2V0UGFyZW50KCkucGFkZGluZ0xlZnQ7XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBtYXJnaW4gPSB0aGlzLm1hcmdpbjtcclxuICB9XHJcblxyXG4gIHRoaXMubGVmdCA9IGxlZnQgLSBtYXJnaW47XHJcbiAgdGhpcy50b3AgPSB0b3AgLSBtYXJnaW47XHJcblxyXG4gIC8vIEFwcGx5IHRoZSBtYXJnaW5zIGFuZCByZXR1cm4gdGhlIHJlc3VsdFxyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy5sZWZ0LCB0aGlzLnRvcCk7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uIChyZWN1cnNpdmUpXHJcbntcclxuICAvLyBjYWxjdWxhdGUgYm91bmRzXHJcbiAgdmFyIGxlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgcmlnaHQgPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBib3R0b20gPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIG5vZGVMZWZ0O1xyXG4gIHZhciBub2RlUmlnaHQ7XHJcbiAgdmFyIG5vZGVUb3A7XHJcbiAgdmFyIG5vZGVCb3R0b207XHJcbiAgdmFyIG1hcmdpbjtcclxuXHJcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcclxuICB2YXIgcyA9IG5vZGVzLmxlbmd0aDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICB7XHJcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICBpZiAocmVjdXJzaXZlICYmIGxOb2RlLmNoaWxkICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGxOb2RlLnVwZGF0ZUJvdW5kcygpO1xyXG4gICAgfVxyXG4gICAgbm9kZUxlZnQgPSBsTm9kZS5nZXRMZWZ0KCk7XHJcbiAgICBub2RlUmlnaHQgPSBsTm9kZS5nZXRSaWdodCgpO1xyXG4gICAgbm9kZVRvcCA9IGxOb2RlLmdldFRvcCgpO1xyXG4gICAgbm9kZUJvdHRvbSA9IGxOb2RlLmdldEJvdHRvbSgpO1xyXG5cclxuICAgIGlmIChsZWZ0ID4gbm9kZUxlZnQpXHJcbiAgICB7XHJcbiAgICAgIGxlZnQgPSBub2RlTGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmlnaHQgPCBub2RlUmlnaHQpXHJcbiAgICB7XHJcbiAgICAgIHJpZ2h0ID0gbm9kZVJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0b3AgPiBub2RlVG9wKVxyXG4gICAge1xyXG4gICAgICB0b3AgPSBub2RlVG9wO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChib3R0b20gPCBub2RlQm90dG9tKVxyXG4gICAge1xyXG4gICAgICBib3R0b20gPSBub2RlQm90dG9tO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kaW5nUmVjdCA9IG5ldyBSZWN0YW5nbGVEKGxlZnQsIHRvcCwgcmlnaHQgLSBsZWZ0LCBib3R0b20gLSB0b3ApO1xyXG4gIGlmIChsZWZ0ID09IEludGVnZXIuTUFYX1ZBTFVFKVxyXG4gIHtcclxuICAgIHRoaXMubGVmdCA9IHRoaXMucGFyZW50LmdldExlZnQoKTtcclxuICAgIHRoaXMucmlnaHQgPSB0aGlzLnBhcmVudC5nZXRSaWdodCgpO1xyXG4gICAgdGhpcy50b3AgPSB0aGlzLnBhcmVudC5nZXRUb3AoKTtcclxuICAgIHRoaXMuYm90dG9tID0gdGhpcy5wYXJlbnQuZ2V0Qm90dG9tKCk7XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG5vZGVzWzBdLmdldFBhcmVudCgpLnBhZGRpbmdMZWZ0ICE9IHVuZGVmaW5lZCl7XHJcbiAgICBtYXJnaW4gPSBub2Rlc1swXS5nZXRQYXJlbnQoKS5wYWRkaW5nTGVmdDtcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIG1hcmdpbiA9IHRoaXMubWFyZ2luO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5sZWZ0ID0gYm91bmRpbmdSZWN0LnggLSBtYXJnaW47XHJcbiAgdGhpcy5yaWdodCA9IGJvdW5kaW5nUmVjdC54ICsgYm91bmRpbmdSZWN0LndpZHRoICsgbWFyZ2luO1xyXG4gIHRoaXMudG9wID0gYm91bmRpbmdSZWN0LnkgLSBtYXJnaW47XHJcbiAgdGhpcy5ib3R0b20gPSBib3VuZGluZ1JlY3QueSArIGJvdW5kaW5nUmVjdC5oZWlnaHQgKyBtYXJnaW47XHJcbn07XHJcblxyXG5MR3JhcGguY2FsY3VsYXRlQm91bmRzID0gZnVuY3Rpb24gKG5vZGVzKVxyXG57XHJcbiAgdmFyIGxlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgcmlnaHQgPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBib3R0b20gPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIG5vZGVMZWZ0O1xyXG4gIHZhciBub2RlUmlnaHQ7XHJcbiAgdmFyIG5vZGVUb3A7XHJcbiAgdmFyIG5vZGVCb3R0b207XHJcblxyXG4gIHZhciBzID0gbm9kZXMubGVuZ3RoO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICB7XHJcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcclxuICAgIG5vZGVMZWZ0ID0gbE5vZGUuZ2V0TGVmdCgpO1xyXG4gICAgbm9kZVJpZ2h0ID0gbE5vZGUuZ2V0UmlnaHQoKTtcclxuICAgIG5vZGVUb3AgPSBsTm9kZS5nZXRUb3AoKTtcclxuICAgIG5vZGVCb3R0b20gPSBsTm9kZS5nZXRCb3R0b20oKTtcclxuXHJcbiAgICBpZiAobGVmdCA+IG5vZGVMZWZ0KVxyXG4gICAge1xyXG4gICAgICBsZWZ0ID0gbm9kZUxlZnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJpZ2h0IDwgbm9kZVJpZ2h0KVxyXG4gICAge1xyXG4gICAgICByaWdodCA9IG5vZGVSaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodG9wID4gbm9kZVRvcClcclxuICAgIHtcclxuICAgICAgdG9wID0gbm9kZVRvcDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYm90dG9tIDwgbm9kZUJvdHRvbSlcclxuICAgIHtcclxuICAgICAgYm90dG9tID0gbm9kZUJvdHRvbTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBib3VuZGluZ1JlY3QgPSBuZXcgUmVjdGFuZ2xlRChsZWZ0LCB0b3AsIHJpZ2h0IC0gbGVmdCwgYm90dG9tIC0gdG9wKTtcclxuXHJcbiAgcmV0dXJuIGJvdW5kaW5nUmVjdDtcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuZ2V0SW5jbHVzaW9uVHJlZURlcHRoID0gZnVuY3Rpb24gKClcclxue1xyXG4gIGlmICh0aGlzID09IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKSlcclxuICB7XHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKTtcclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldEVzdGltYXRlZFNpemUgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgaWYgKHRoaXMuZXN0aW1hdGVkU2l6ZSA9PSBJbnRlZ2VyLk1JTl9WQUxVRSkge1xyXG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemU7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmNhbGNFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBzaXplID0gMDtcclxuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xyXG4gIHZhciBzID0gbm9kZXMubGVuZ3RoO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICB7XHJcbiAgICB2YXIgbE5vZGUgPSBub2Rlc1tpXTtcclxuICAgIHNpemUgKz0gbE5vZGUuY2FsY0VzdGltYXRlZFNpemUoKTtcclxuICB9XHJcblxyXG4gIGlmIChzaXplID09IDApXHJcbiAge1xyXG4gICAgdGhpcy5lc3RpbWF0ZWRTaXplID0gTGF5b3V0Q29uc3RhbnRzLkVNUFRZX0NPTVBPVU5EX05PREVfU0laRTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIHRoaXMuZXN0aW1hdGVkU2l6ZSA9IHNpemUgLyBNYXRoLnNxcnQodGhpcy5ub2Rlcy5sZW5ndGgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZTtcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUudXBkYXRlQ29ubmVjdGVkID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBpZiAodGhpcy5ub2Rlcy5sZW5ndGggPT0gMClcclxuICB7XHJcbiAgICB0aGlzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciB0b0JlVmlzaXRlZCA9IG5ldyBMaXN0KCk7XHJcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgSGFzaFNldCgpO1xyXG4gIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMubm9kZXNbMF07XHJcbiAgdmFyIG5laWdoYm9yRWRnZXM7XHJcbiAgdmFyIGN1cnJlbnROZWlnaGJvcjtcclxuICB2YXIgY2hpbGRyZW5PZk5vZGUgPSBjdXJyZW50Tm9kZS53aXRoQ2hpbGRyZW4oKTtcclxuICBjaGlsZHJlbk9mTm9kZS5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgIHRvQmVWaXNpdGVkLnB1c2gobm9kZSk7XHJcbiAgfSk7XHJcblxyXG4gIHdoaWxlICghdG9CZVZpc2l0ZWQuaXNFbXB0eSgpKVxyXG4gIHtcclxuICAgIGN1cnJlbnROb2RlID0gdG9CZVZpc2l0ZWQuc2hpZnQoKS52YWx1ZSgpO1xyXG4gICAgdmlzaXRlZC5hZGQoY3VycmVudE5vZGUpO1xyXG5cclxuICAgIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXHJcbiAgICBuZWlnaGJvckVkZ2VzID0gY3VycmVudE5vZGUuZ2V0RWRnZXMoKTtcclxuICAgIHZhciBzID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgdmFyIG5laWdoYm9yRWRnZSA9IG5laWdoYm9yRWRnZXNbaV07XHJcbiAgICAgIGN1cnJlbnROZWlnaGJvciA9XHJcbiAgICAgICAgICAgICAgbmVpZ2hib3JFZGdlLmdldE90aGVyRW5kSW5HcmFwaChjdXJyZW50Tm9kZSwgdGhpcyk7XHJcblxyXG4gICAgICAvLyBBZGQgdW52aXNpdGVkIG5laWdoYm9ycyB0byB0aGUgbGlzdCB0byB2aXNpdFxyXG4gICAgICBpZiAoY3VycmVudE5laWdoYm9yICE9IG51bGwgJiZcclxuICAgICAgICAgICAgICAhdmlzaXRlZC5jb250YWlucyhjdXJyZW50TmVpZ2hib3IpKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuT2ZOZWlnaGJvciA9IGN1cnJlbnROZWlnaGJvci53aXRoQ2hpbGRyZW4oKTtcclxuICAgICAgICBcclxuICAgICAgICBjaGlsZHJlbk9mTmVpZ2hib3IuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICB0b0JlVmlzaXRlZC5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XHJcblxyXG4gIGlmICh2aXNpdGVkLnNpemUoKSA+PSB0aGlzLm5vZGVzLmxlbmd0aClcclxuICB7XHJcbiAgICB2YXIgbm9PZlZpc2l0ZWRJblRoaXNHcmFwaCA9IDA7XHJcbiAgICBcclxuICAgIHZhciBzID0gdmlzaXRlZC5zaXplKCk7XHJcbiAgICAgT2JqZWN0LmtleXModmlzaXRlZC5zZXQpLmZvckVhY2goZnVuY3Rpb24odmlzaXRlZElkKSB7XHJcbiAgICAgIHZhciB2aXNpdGVkTm9kZSA9IHZpc2l0ZWQuc2V0W3Zpc2l0ZWRJZF07XHJcbiAgICAgIGlmICh2aXNpdGVkTm9kZS5vd25lciA9PSBzZWxmKVxyXG4gICAgICB7XHJcbiAgICAgICAgbm9PZlZpc2l0ZWRJblRoaXNHcmFwaCsrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobm9PZlZpc2l0ZWRJblRoaXNHcmFwaCA9PSB0aGlzLm5vZGVzLmxlbmd0aClcclxuICAgIHtcclxuICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGg7XHJcbiIsInZhciBMR3JhcGg7XHJcbnZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcclxuXHJcbmZ1bmN0aW9uIExHcmFwaE1hbmFnZXIobGF5b3V0KSB7XHJcbiAgTEdyYXBoID0gcmVxdWlyZSgnLi9MR3JhcGgnKTsgLy8gSXQgbWF5IGJlIGJldHRlciB0byBpbml0aWxpemUgdGhpcyBvdXQgb2YgdGhpcyBmdW5jdGlvbiBidXQgaXQgZ2l2ZXMgYW4gZXJyb3IgKFJpZ2h0LWhhbmQgc2lkZSBvZiAnaW5zdGFuY2VvZicgaXMgbm90IGNhbGxhYmxlKSBub3cuXHJcbiAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XHJcblxyXG4gIHRoaXMuZ3JhcGhzID0gW107XHJcbiAgdGhpcy5lZGdlcyA9IFtdO1xyXG59XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5hZGRSb290ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBuZ3JhcGggPSB0aGlzLmxheW91dC5uZXdHcmFwaCgpO1xyXG4gIHZhciBubm9kZSA9IHRoaXMubGF5b3V0Lm5ld05vZGUobnVsbCk7XHJcbiAgdmFyIHJvb3QgPSB0aGlzLmFkZChuZ3JhcGgsIG5ub2RlKTtcclxuICB0aGlzLnNldFJvb3RHcmFwaChyb290KTtcclxuICByZXR1cm4gdGhpcy5yb290R3JhcGg7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAobmV3R3JhcGgsIHBhcmVudE5vZGUsIG5ld0VkZ2UsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpXHJcbntcclxuICAvL3RoZXJlIGFyZSBqdXN0IDIgcGFyYW1ldGVycyBhcmUgcGFzc2VkIHRoZW4gaXQgYWRkcyBhbiBMR3JhcGggZWxzZSBpdCBhZGRzIGFuIExFZGdlXHJcbiAgaWYgKG5ld0VkZ2UgPT0gbnVsbCAmJiBzb3VyY2VOb2RlID09IG51bGwgJiYgdGFyZ2V0Tm9kZSA9PSBudWxsKSB7XHJcbiAgICBpZiAobmV3R3JhcGggPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIkdyYXBoIGlzIG51bGwhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IFwiUGFyZW50IG5vZGUgaXMgbnVsbCFcIjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmdyYXBocy5pbmRleE9mKG5ld0dyYXBoKSA+IC0xKSB7XHJcbiAgICAgIHRocm93IFwiR3JhcGggYWxyZWFkeSBpbiB0aGlzIGdyYXBoIG1nciFcIjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmdyYXBocy5wdXNoKG5ld0dyYXBoKTtcclxuXHJcbiAgICBpZiAobmV3R3JhcGgucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJBbHJlYWR5IGhhcyBhIHBhcmVudCFcIjtcclxuICAgIH1cclxuICAgIGlmIChwYXJlbnROb2RlLmNoaWxkICE9IG51bGwpIHtcclxuICAgICAgdGhyb3cgIFwiQWxyZWFkeSBoYXMgYSBjaGlsZCFcIjtcclxuICAgIH1cclxuXHJcbiAgICBuZXdHcmFwaC5wYXJlbnQgPSBwYXJlbnROb2RlO1xyXG4gICAgcGFyZW50Tm9kZS5jaGlsZCA9IG5ld0dyYXBoO1xyXG5cclxuICAgIHJldHVybiBuZXdHcmFwaDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICAvL2NoYW5nZSB0aGUgb3JkZXIgb2YgdGhlIHBhcmFtZXRlcnNcclxuICAgIHRhcmdldE5vZGUgPSBuZXdFZGdlO1xyXG4gICAgc291cmNlTm9kZSA9IHBhcmVudE5vZGU7XHJcbiAgICBuZXdFZGdlID0gbmV3R3JhcGg7XHJcbiAgICB2YXIgc291cmNlR3JhcGggPSBzb3VyY2VOb2RlLmdldE93bmVyKCk7XHJcbiAgICB2YXIgdGFyZ2V0R3JhcGggPSB0YXJnZXROb2RlLmdldE93bmVyKCk7XHJcblxyXG4gICAgaWYgKCEoc291cmNlR3JhcGggIT0gbnVsbCAmJiBzb3VyY2VHcmFwaC5nZXRHcmFwaE1hbmFnZXIoKSA9PSB0aGlzKSkge1xyXG4gICAgICB0aHJvdyBcIlNvdXJjZSBub3QgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoISh0YXJnZXRHcmFwaCAhPSBudWxsICYmIHRhcmdldEdyYXBoLmdldEdyYXBoTWFuYWdlcigpID09IHRoaXMpKSB7XHJcbiAgICAgIHRocm93IFwiVGFyZ2V0IG5vdCBpbiB0aGlzIGdyYXBoIG1nciFcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc291cmNlR3JhcGggPT0gdGFyZ2V0R3JhcGgpXHJcbiAgICB7XHJcbiAgICAgIG5ld0VkZ2UuaXNJbnRlckdyYXBoID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBzb3VyY2VHcmFwaC5hZGQobmV3RWRnZSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIG5ld0VkZ2UuaXNJbnRlckdyYXBoID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIHNldCBzb3VyY2UgYW5kIHRhcmdldFxyXG4gICAgICBuZXdFZGdlLnNvdXJjZSA9IHNvdXJjZU5vZGU7XHJcbiAgICAgIG5ld0VkZ2UudGFyZ2V0ID0gdGFyZ2V0Tm9kZTtcclxuXHJcbiAgICAgIC8vIGFkZCBlZGdlIHRvIGludGVyLWdyYXBoIGVkZ2UgbGlzdFxyXG4gICAgICBpZiAodGhpcy5lZGdlcy5pbmRleE9mKG5ld0VkZ2UpID4gLTEpIHtcclxuICAgICAgICB0aHJvdyBcIkVkZ2UgYWxyZWFkeSBpbiBpbnRlci1ncmFwaCBlZGdlIGxpc3QhXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZWRnZXMucHVzaChuZXdFZGdlKTtcclxuXHJcbiAgICAgIC8vIGFkZCBlZGdlIHRvIHNvdXJjZSBhbmQgdGFyZ2V0IGluY2lkZW5jeSBsaXN0c1xyXG4gICAgICBpZiAoIShuZXdFZGdlLnNvdXJjZSAhPSBudWxsICYmIG5ld0VkZ2UudGFyZ2V0ICE9IG51bGwpKSB7XHJcbiAgICAgICAgdGhyb3cgXCJFZGdlIHNvdXJjZSBhbmQvb3IgdGFyZ2V0IGlzIG51bGwhXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKG5ld0VkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YobmV3RWRnZSkgPT0gLTEgJiYgbmV3RWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihuZXdFZGdlKSA9PSAtMSkpIHtcclxuICAgICAgICB0aHJvdyBcIkVkZ2UgYWxyZWFkeSBpbiBzb3VyY2UgYW5kL29yIHRhcmdldCBpbmNpZGVuY3kgbGlzdCFcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbmV3RWRnZS5zb3VyY2UuZWRnZXMucHVzaChuZXdFZGdlKTtcclxuICAgICAgbmV3RWRnZS50YXJnZXQuZWRnZXMucHVzaChuZXdFZGdlKTtcclxuXHJcbiAgICAgIHJldHVybiBuZXdFZGdlO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChsT2JqKSB7XHJcbiAgaWYgKGxPYmogaW5zdGFuY2VvZiBMR3JhcGgpIHtcclxuICAgIHZhciBncmFwaCA9IGxPYmo7XHJcbiAgICBpZiAoZ3JhcGguZ2V0R3JhcGhNYW5hZ2VyKCkgIT0gdGhpcykge1xyXG4gICAgICB0aHJvdyBcIkdyYXBoIG5vdCBpbiB0aGlzIGdyYXBoIG1nclwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCEoZ3JhcGggPT0gdGhpcy5yb290R3JhcGggfHwgKGdyYXBoLnBhcmVudCAhPSBudWxsICYmIGdyYXBoLnBhcmVudC5ncmFwaE1hbmFnZXIgPT0gdGhpcykpKSB7XHJcbiAgICAgIHRocm93IFwiSW52YWxpZCBwYXJlbnQgbm9kZSFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmaXJzdCB0aGUgZWRnZXMgKG1ha2UgYSBjb3B5IHRvIGRvIGl0IHNhZmVseSlcclxuICAgIHZhciBlZGdlc1RvQmVSZW1vdmVkID0gW107XHJcblxyXG4gICAgZWRnZXNUb0JlUmVtb3ZlZCA9IGVkZ2VzVG9CZVJlbW92ZWQuY29uY2F0KGdyYXBoLmdldEVkZ2VzKCkpO1xyXG5cclxuICAgIHZhciBlZGdlO1xyXG4gICAgdmFyIHMgPSBlZGdlc1RvQmVSZW1vdmVkLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gICAge1xyXG4gICAgICBlZGdlID0gZWRnZXNUb0JlUmVtb3ZlZFtpXTtcclxuICAgICAgZ3JhcGgucmVtb3ZlKGVkZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZW4gdGhlIG5vZGVzIChtYWtlIGEgY29weSB0byBkbyBpdCBzYWZlbHkpXHJcbiAgICB2YXIgbm9kZXNUb0JlUmVtb3ZlZCA9IFtdO1xyXG5cclxuICAgIG5vZGVzVG9CZVJlbW92ZWQgPSBub2Rlc1RvQmVSZW1vdmVkLmNvbmNhdChncmFwaC5nZXROb2RlcygpKTtcclxuXHJcbiAgICB2YXIgbm9kZTtcclxuICAgIHMgPSBub2Rlc1RvQmVSZW1vdmVkLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gICAge1xyXG4gICAgICBub2RlID0gbm9kZXNUb0JlUmVtb3ZlZFtpXTtcclxuICAgICAgZ3JhcGgucmVtb3ZlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrIGlmIGdyYXBoIGlzIHRoZSByb290XHJcbiAgICBpZiAoZ3JhcGggPT0gdGhpcy5yb290R3JhcGgpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuc2V0Um9vdEdyYXBoKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG5vdyByZW1vdmUgdGhlIGdyYXBoIGl0c2VsZlxyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5ncmFwaHMuaW5kZXhPZihncmFwaCk7XHJcbiAgICB0aGlzLmdyYXBocy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgIC8vIGFsc28gcmVzZXQgdGhlIHBhcmVudCBvZiB0aGUgZ3JhcGhcclxuICAgIGdyYXBoLnBhcmVudCA9IG51bGw7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxPYmogaW5zdGFuY2VvZiBMRWRnZSkge1xyXG4gICAgZWRnZSA9IGxPYmo7XHJcbiAgICBpZiAoZWRnZSA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IFwiRWRnZSBpcyBudWxsIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCFlZGdlLmlzSW50ZXJHcmFwaCkge1xyXG4gICAgICB0aHJvdyBcIk5vdCBhbiBpbnRlci1ncmFwaCBlZGdlIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCEoZWRnZS5zb3VyY2UgIT0gbnVsbCAmJiBlZGdlLnRhcmdldCAhPSBudWxsKSkge1xyXG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGlzIG51bGwhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVtb3ZlIGVkZ2UgZnJvbSBzb3VyY2UgYW5kIHRhcmdldCBub2RlcycgaW5jaWRlbmN5IGxpc3RzXHJcblxyXG4gICAgaWYgKCEoZWRnZS5zb3VyY2UuZWRnZXMuaW5kZXhPZihlZGdlKSAhPSAtMSAmJiBlZGdlLnRhcmdldC5lZGdlcy5pbmRleE9mKGVkZ2UpICE9IC0xKSkge1xyXG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGRvZXNuJ3Qga25vdyB0aGlzIGVkZ2UhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluZGV4ID0gZWRnZS5zb3VyY2UuZWRnZXMuaW5kZXhPZihlZGdlKTtcclxuICAgIGVkZ2Uuc291cmNlLmVkZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICBpbmRleCA9IGVkZ2UudGFyZ2V0LmVkZ2VzLmluZGV4T2YoZWRnZSk7XHJcbiAgICBlZGdlLnRhcmdldC5lZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgIC8vIHJlbW92ZSBlZGdlIGZyb20gb3duZXIgZ3JhcGggbWFuYWdlcidzIGludGVyLWdyYXBoIGVkZ2UgbGlzdFxyXG5cclxuICAgIGlmICghKGVkZ2Uuc291cmNlLm93bmVyICE9IG51bGwgJiYgZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkgIT0gbnVsbCkpIHtcclxuICAgICAgdGhyb3cgXCJFZGdlIG93bmVyIGdyYXBoIG9yIG93bmVyIGdyYXBoIG1hbmFnZXIgaXMgbnVsbCFcIjtcclxuICAgIH1cclxuICAgIGlmIChlZGdlLnNvdXJjZS5vd25lci5nZXRHcmFwaE1hbmFnZXIoKS5lZGdlcy5pbmRleE9mKGVkZ2UpID09IC0xKSB7XHJcbiAgICAgIHRocm93IFwiTm90IGluIG93bmVyIGdyYXBoIG1hbmFnZXIncyBlZGdlIGxpc3QhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluZGV4ID0gZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkuZWRnZXMuaW5kZXhPZihlZGdlKTtcclxuICAgIGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpLmVkZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUudXBkYXRlQm91bmRzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHRoaXMucm9vdEdyYXBoLnVwZGF0ZUJvdW5kcyh0cnVlKTtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEdyYXBocyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5ncmFwaHM7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRBbGxOb2RlcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5hbGxOb2RlcyA9PSBudWxsKVxyXG4gIHtcclxuICAgIHZhciBub2RlTGlzdCA9IFtdO1xyXG4gICAgdmFyIGdyYXBocyA9IHRoaXMuZ2V0R3JhcGhzKCk7XHJcbiAgICB2YXIgcyA9IGdyYXBocy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgbm9kZUxpc3QgPSBub2RlTGlzdC5jb25jYXQoZ3JhcGhzW2ldLmdldE5vZGVzKCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hbGxOb2RlcyA9IG5vZGVMaXN0O1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5hbGxOb2RlcztcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlc2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdGhpcy5hbGxOb2RlcyA9IG51bGw7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5yZXNldEFsbEVkZ2VzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHRoaXMuYWxsRWRnZXMgPSBudWxsO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVzZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gbnVsbDtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEFsbEVkZ2VzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIGlmICh0aGlzLmFsbEVkZ2VzID09IG51bGwpXHJcbiAge1xyXG4gICAgdmFyIGVkZ2VMaXN0ID0gW107XHJcbiAgICB2YXIgZ3JhcGhzID0gdGhpcy5nZXRHcmFwaHMoKTtcclxuICAgIHZhciBzID0gZ3JhcGhzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JhcGhzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdChncmFwaHNbaV0uZ2V0RWRnZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQodGhpcy5lZGdlcyk7XHJcblxyXG4gICAgdGhpcy5hbGxFZGdlcyA9IGVkZ2VMaXN0O1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5hbGxFZGdlcztcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBmdW5jdGlvbiAobm9kZUxpc3QpXHJcbntcclxuICBpZiAodGhpcy5hbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiAhPSBudWxsKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcblxyXG4gIHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBub2RlTGlzdDtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmdldFJvb3QgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucm9vdEdyYXBoO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuc2V0Um9vdEdyYXBoID0gZnVuY3Rpb24gKGdyYXBoKVxyXG57XHJcbiAgaWYgKGdyYXBoLmdldEdyYXBoTWFuYWdlcigpICE9IHRoaXMpIHtcclxuICAgIHRocm93IFwiUm9vdCBub3QgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XHJcbiAgfVxyXG5cclxuICB0aGlzLnJvb3RHcmFwaCA9IGdyYXBoO1xyXG4gIC8vIHJvb3QgZ3JhcGggbXVzdCBoYXZlIGEgcm9vdCBub2RlIGFzc29jaWF0ZWQgd2l0aCBpdCBmb3IgY29udmVuaWVuY2VcclxuICBpZiAoZ3JhcGgucGFyZW50ID09IG51bGwpXHJcbiAge1xyXG4gICAgZ3JhcGgucGFyZW50ID0gdGhpcy5sYXlvdXQubmV3Tm9kZShcIlJvb3Qgbm9kZVwiKTtcclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRMYXlvdXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubGF5b3V0O1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuaXNPbmVBbmNlc3Rvck9mT3RoZXIgPSBmdW5jdGlvbiAoZmlyc3ROb2RlLCBzZWNvbmROb2RlKVxyXG57XHJcbiAgaWYgKCEoZmlyc3ROb2RlICE9IG51bGwgJiYgc2Vjb25kTm9kZSAhPSBudWxsKSkge1xyXG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgfVxyXG5cclxuICBpZiAoZmlyc3ROb2RlID09IHNlY29uZE5vZGUpXHJcbiAge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIC8vIElzIHNlY29uZCBub2RlIGFuIGFuY2VzdG9yIG9mIHRoZSBmaXJzdCBvbmU/XHJcbiAgdmFyIG93bmVyR3JhcGggPSBmaXJzdE5vZGUuZ2V0T3duZXIoKTtcclxuICB2YXIgcGFyZW50Tm9kZTtcclxuXHJcbiAgZG9cclxuICB7XHJcbiAgICBwYXJlbnROb2RlID0gb3duZXJHcmFwaC5nZXRQYXJlbnQoKTtcclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSA9PSBzZWNvbmROb2RlKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvd25lckdyYXBoID0gcGFyZW50Tm9kZS5nZXRPd25lcigpO1xyXG4gICAgaWYgKG93bmVyR3JhcGggPT0gbnVsbClcclxuICAgIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfSB3aGlsZSAodHJ1ZSk7XHJcbiAgLy8gSXMgZmlyc3Qgbm9kZSBhbiBhbmNlc3RvciBvZiB0aGUgc2Vjb25kIG9uZT9cclxuICBvd25lckdyYXBoID0gc2Vjb25kTm9kZS5nZXRPd25lcigpO1xyXG5cclxuICBkb1xyXG4gIHtcclxuICAgIHBhcmVudE5vZGUgPSBvd25lckdyYXBoLmdldFBhcmVudCgpO1xyXG5cclxuICAgIGlmIChwYXJlbnROb2RlID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXJlbnROb2RlID09IGZpcnN0Tm9kZSlcclxuICAgIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb3duZXJHcmFwaCA9IHBhcmVudE5vZGUuZ2V0T3duZXIoKTtcclxuICAgIGlmIChvd25lckdyYXBoID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0gd2hpbGUgKHRydWUpO1xyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3JzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBlZGdlO1xyXG4gIHZhciBzb3VyY2VOb2RlO1xyXG4gIHZhciB0YXJnZXROb2RlO1xyXG4gIHZhciBzb3VyY2VBbmNlc3RvckdyYXBoO1xyXG4gIHZhciB0YXJnZXRBbmNlc3RvckdyYXBoO1xyXG5cclxuICB2YXIgZWRnZXMgPSB0aGlzLmdldEFsbEVkZ2VzKCk7XHJcbiAgdmFyIHMgPSBlZGdlcy5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXHJcbiAge1xyXG4gICAgZWRnZSA9IGVkZ2VzW2ldO1xyXG5cclxuICAgIHNvdXJjZU5vZGUgPSBlZGdlLnNvdXJjZTtcclxuICAgIHRhcmdldE5vZGUgPSBlZGdlLnRhcmdldDtcclxuICAgIGVkZ2UubGNhID0gbnVsbDtcclxuICAgIGVkZ2Uuc291cmNlSW5MY2EgPSBzb3VyY2VOb2RlO1xyXG4gICAgZWRnZS50YXJnZXRJbkxjYSA9IHRhcmdldE5vZGU7XHJcblxyXG4gICAgaWYgKHNvdXJjZU5vZGUgPT0gdGFyZ2V0Tm9kZSlcclxuICAgIHtcclxuICAgICAgZWRnZS5sY2EgPSBzb3VyY2VOb2RlLmdldE93bmVyKCk7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNvdXJjZUFuY2VzdG9yR3JhcGggPSBzb3VyY2VOb2RlLmdldE93bmVyKCk7XHJcblxyXG4gICAgd2hpbGUgKGVkZ2UubGNhID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXROb2RlOyAgXHJcbiAgICAgIHRhcmdldEFuY2VzdG9yR3JhcGggPSB0YXJnZXROb2RlLmdldE93bmVyKCk7XHJcblxyXG4gICAgICB3aGlsZSAoZWRnZS5sY2EgPT0gbnVsbClcclxuICAgICAge1xyXG4gICAgICAgIGlmICh0YXJnZXRBbmNlc3RvckdyYXBoID09IHNvdXJjZUFuY2VzdG9yR3JhcGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZWRnZS5sY2EgPSB0YXJnZXRBbmNlc3RvckdyYXBoO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0QW5jZXN0b3JHcmFwaCA9PSB0aGlzLnJvb3RHcmFwaClcclxuICAgICAgICB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlZGdlLmxjYSAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWRnZS50YXJnZXRJbkxjYSA9IHRhcmdldEFuY2VzdG9yR3JhcGguZ2V0UGFyZW50KCk7XHJcbiAgICAgICAgdGFyZ2V0QW5jZXN0b3JHcmFwaCA9IGVkZ2UudGFyZ2V0SW5MY2EuZ2V0T3duZXIoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNvdXJjZUFuY2VzdG9yR3JhcGggPT0gdGhpcy5yb290R3JhcGgpXHJcbiAgICAgIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGVkZ2UubGNhID09IG51bGwpXHJcbiAgICAgIHtcclxuICAgICAgICBlZGdlLnNvdXJjZUluTGNhID0gc291cmNlQW5jZXN0b3JHcmFwaC5nZXRQYXJlbnQoKTtcclxuICAgICAgICBzb3VyY2VBbmNlc3RvckdyYXBoID0gZWRnZS5zb3VyY2VJbkxjYS5nZXRPd25lcigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVkZ2UubGNhID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9yID0gZnVuY3Rpb24gKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSlcclxue1xyXG4gIGlmIChmaXJzdE5vZGUgPT0gc2Vjb25kTm9kZSlcclxuICB7XHJcbiAgICByZXR1cm4gZmlyc3ROb2RlLmdldE93bmVyKCk7XHJcbiAgfVxyXG4gIHZhciBmaXJzdE93bmVyR3JhcGggPSBmaXJzdE5vZGUuZ2V0T3duZXIoKTtcclxuXHJcbiAgZG9cclxuICB7XHJcbiAgICBpZiAoZmlyc3RPd25lckdyYXBoID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdmFyIHNlY29uZE93bmVyR3JhcGggPSBzZWNvbmROb2RlLmdldE93bmVyKCk7XHJcblxyXG4gICAgZG9cclxuICAgIHtcclxuICAgICAgaWYgKHNlY29uZE93bmVyR3JhcGggPT0gbnVsbClcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2Vjb25kT3duZXJHcmFwaCA9PSBmaXJzdE93bmVyR3JhcGgpXHJcbiAgICAgIHtcclxuICAgICAgICByZXR1cm4gc2Vjb25kT3duZXJHcmFwaDtcclxuICAgICAgfVxyXG4gICAgICBzZWNvbmRPd25lckdyYXBoID0gc2Vjb25kT3duZXJHcmFwaC5nZXRQYXJlbnQoKS5nZXRPd25lcigpO1xyXG4gICAgfSB3aGlsZSAodHJ1ZSk7XHJcblxyXG4gICAgZmlyc3RPd25lckdyYXBoID0gZmlyc3RPd25lckdyYXBoLmdldFBhcmVudCgpLmdldE93bmVyKCk7XHJcbiAgfSB3aGlsZSAodHJ1ZSk7XHJcblxyXG4gIHJldHVybiBmaXJzdE93bmVyR3JhcGg7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5jYWxjSW5jbHVzaW9uVHJlZURlcHRocyA9IGZ1bmN0aW9uIChncmFwaCwgZGVwdGgpIHtcclxuICBpZiAoZ3JhcGggPT0gbnVsbCAmJiBkZXB0aCA9PSBudWxsKSB7XHJcbiAgICBncmFwaCA9IHRoaXMucm9vdEdyYXBoO1xyXG4gICAgZGVwdGggPSAxO1xyXG4gIH1cclxuICB2YXIgbm9kZTtcclxuXHJcbiAgdmFyIG5vZGVzID0gZ3JhcGguZ2V0Tm9kZXMoKTtcclxuICB2YXIgcyA9IG5vZGVzLmxlbmd0aDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICB7XHJcbiAgICBub2RlID0gbm9kZXNbaV07XHJcbiAgICBub2RlLmluY2x1c2lvblRyZWVEZXB0aCA9IGRlcHRoO1xyXG5cclxuICAgIGlmIChub2RlLmNoaWxkICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuY2FsY0luY2x1c2lvblRyZWVEZXB0aHMobm9kZS5jaGlsZCwgZGVwdGggKyAxKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5pbmNsdWRlc0ludmFsaWRFZGdlID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBlZGdlO1xyXG5cclxuICB2YXIgcyA9IHRoaXMuZWRnZXMubGVuZ3RoO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldO1xyXG5cclxuICAgIGlmICh0aGlzLmlzT25lQW5jZXN0b3JPZk90aGVyKGVkZ2Uuc291cmNlLCBlZGdlLnRhcmdldCkpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExHcmFwaE1hbmFnZXI7XHJcbiIsImZ1bmN0aW9uIExHcmFwaE9iamVjdCh2R3JhcGhPYmplY3QpIHtcclxuICB0aGlzLnZHcmFwaE9iamVjdCA9IHZHcmFwaE9iamVjdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGhPYmplY3Q7XHJcbiIsInZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xyXG52YXIgSW50ZWdlciA9IHJlcXVpcmUoJy4vSW50ZWdlcicpO1xyXG52YXIgUmVjdGFuZ2xlRCA9IHJlcXVpcmUoJy4vUmVjdGFuZ2xlRCcpO1xyXG52YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcclxudmFyIFJhbmRvbVNlZWQgPSByZXF1aXJlKCcuL1JhbmRvbVNlZWQnKTtcclxudmFyIFBvaW50RCA9IHJlcXVpcmUoJy4vUG9pbnREJyk7XHJcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XHJcblxyXG5mdW5jdGlvbiBMTm9kZShnbSwgbG9jLCBzaXplLCB2Tm9kZSkge1xyXG4gIC8vQWx0ZXJuYXRpdmUgY29uc3RydWN0b3IgMSA6IExOb2RlKExHcmFwaE1hbmFnZXIgZ20sIFBvaW50IGxvYywgRGltZW5zaW9uIHNpemUsIE9iamVjdCB2Tm9kZSlcclxuICBpZiAoc2l6ZSA9PSBudWxsICYmIHZOb2RlID09IG51bGwpIHtcclxuICAgIHZOb2RlID0gbG9jO1xyXG4gIH1cclxuXHJcbiAgTEdyYXBoT2JqZWN0LmNhbGwodGhpcywgdk5vZGUpO1xyXG5cclxuICAvL0FsdGVybmF0aXZlIGNvbnN0cnVjdG9yIDIgOiBMTm9kZShMYXlvdXQgbGF5b3V0LCBPYmplY3Qgdk5vZGUpXHJcbiAgaWYgKGdtLmdyYXBoTWFuYWdlciAhPSBudWxsKVxyXG4gICAgZ20gPSBnbS5ncmFwaE1hbmFnZXI7XHJcblxyXG4gIHRoaXMuZXN0aW1hdGVkU2l6ZSA9IEludGVnZXIuTUlOX1ZBTFVFO1xyXG4gIHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoID0gSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2Tm9kZTtcclxuICB0aGlzLmVkZ2VzID0gW107XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcclxuXHJcbiAgaWYgKHNpemUgIT0gbnVsbCAmJiBsb2MgIT0gbnVsbClcclxuICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0YW5nbGVEKGxvYy54LCBsb2MueSwgc2l6ZS53aWR0aCwgc2l6ZS5oZWlnaHQpO1xyXG4gIGVsc2VcclxuICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0YW5nbGVEKCk7XHJcbn1cclxuXHJcbkxOb2RlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoT2JqZWN0LnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoT2JqZWN0KSB7XHJcbiAgTE5vZGVbcHJvcF0gPSBMR3JhcGhPYmplY3RbcHJvcF07XHJcbn1cclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRFZGdlcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5lZGdlcztcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRDaGlsZCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5jaGlsZDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRPd25lciA9IGZ1bmN0aW9uICgpXHJcbntcclxuLy8gIGlmICh0aGlzLm93bmVyICE9IG51bGwpIHtcclxuLy8gICAgaWYgKCEodGhpcy5vd25lciA9PSBudWxsIHx8IHRoaXMub3duZXIuZ2V0Tm9kZXMoKS5pbmRleE9mKHRoaXMpID4gLTEpKSB7XHJcbi8vICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbi8vICAgIH1cclxuLy8gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMub3duZXI7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdC53aWR0aDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5zZXRXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aClcclxue1xyXG4gIHRoaXMucmVjdC53aWR0aCA9IHdpZHRoO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0LmhlaWdodDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0KVxyXG57XHJcbiAgdGhpcy5yZWN0LmhlaWdodCA9IGhlaWdodDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXJYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3QueCArIHRoaXMucmVjdC53aWR0aCAvIDI7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0Q2VudGVyWSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0IC8gMjtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXIgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIG5ldyBQb2ludEQodGhpcy5yZWN0LnggKyB0aGlzLnJlY3Qud2lkdGggLyAyLFxyXG4gICAgICAgICAgdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0IC8gMik7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIG5ldyBQb2ludEQodGhpcy5yZWN0LngsIHRoaXMucmVjdC55KTtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRSZWN0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3Q7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0RGlhZ29uYWwgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnJlY3Qud2lkdGggKiB0aGlzLnJlY3Qud2lkdGggK1xyXG4gICAgICAgICAgdGhpcy5yZWN0LmhlaWdodCAqIHRoaXMucmVjdC5oZWlnaHQpO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnNldFJlY3QgPSBmdW5jdGlvbiAodXBwZXJMZWZ0LCBkaW1lbnNpb24pXHJcbntcclxuICB0aGlzLnJlY3QueCA9IHVwcGVyTGVmdC54O1xyXG4gIHRoaXMucmVjdC55ID0gdXBwZXJMZWZ0Lnk7XHJcbiAgdGhpcy5yZWN0LndpZHRoID0gZGltZW5zaW9uLndpZHRoO1xyXG4gIHRoaXMucmVjdC5oZWlnaHQgPSBkaW1lbnNpb24uaGVpZ2h0O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnNldENlbnRlciA9IGZ1bmN0aW9uIChjeCwgY3kpXHJcbntcclxuICB0aGlzLnJlY3QueCA9IGN4IC0gdGhpcy5yZWN0LndpZHRoIC8gMjtcclxuICB0aGlzLnJlY3QueSA9IGN5IC0gdGhpcy5yZWN0LmhlaWdodCAvIDI7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuc2V0TG9jYXRpb24gPSBmdW5jdGlvbiAoeCwgeSlcclxue1xyXG4gIHRoaXMucmVjdC54ID0geDtcclxuICB0aGlzLnJlY3QueSA9IHk7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUubW92ZUJ5ID0gZnVuY3Rpb24gKGR4LCBkeSlcclxue1xyXG4gIHRoaXMucmVjdC54ICs9IGR4O1xyXG4gIHRoaXMucmVjdC55ICs9IGR5O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldEVkZ2VMaXN0VG9Ob2RlID0gZnVuY3Rpb24gKHRvKVxyXG57XHJcbiAgdmFyIGVkZ2VMaXN0ID0gW107XHJcbiAgdmFyIGVkZ2U7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBzZWxmLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xyXG4gICAgXHJcbiAgICBpZiAoZWRnZS50YXJnZXQgPT0gdG8pXHJcbiAgICB7XHJcbiAgICAgIGlmIChlZGdlLnNvdXJjZSAhPSBzZWxmKVxyXG4gICAgICAgIHRocm93IFwiSW5jb3JyZWN0IGVkZ2Ugc291cmNlIVwiO1xyXG5cclxuICAgICAgZWRnZUxpc3QucHVzaChlZGdlKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGVkZ2VMaXN0O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldEVkZ2VzQmV0d2VlbiA9IGZ1bmN0aW9uIChvdGhlcilcclxue1xyXG4gIHZhciBlZGdlTGlzdCA9IFtdO1xyXG4gIHZhciBlZGdlO1xyXG4gIFxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBzZWxmLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xyXG5cclxuICAgIGlmICghKGVkZ2Uuc291cmNlID09IHNlbGYgfHwgZWRnZS50YXJnZXQgPT0gc2VsZikpXHJcbiAgICAgIHRocm93IFwiSW5jb3JyZWN0IGVkZ2Ugc291cmNlIGFuZC9vciB0YXJnZXRcIjtcclxuXHJcbiAgICBpZiAoKGVkZ2UudGFyZ2V0ID09IG90aGVyKSB8fCAoZWRnZS5zb3VyY2UgPT0gb3RoZXIpKVxyXG4gICAge1xyXG4gICAgICBlZGdlTGlzdC5wdXNoKGVkZ2UpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZWRnZUxpc3Q7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3JzTGlzdCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgbmVpZ2hib3JzID0gbmV3IEhhc2hTZXQoKTtcclxuICB2YXIgZWRnZTtcclxuICBcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgc2VsZi5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcclxuXHJcbiAgICBpZiAoZWRnZS5zb3VyY2UgPT0gc2VsZilcclxuICAgIHtcclxuICAgICAgbmVpZ2hib3JzLmFkZChlZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIGlmIChlZGdlLnRhcmdldCAhPSBzZWxmKSB7XHJcbiAgICAgICAgdGhyb3cgXCJJbmNvcnJlY3QgaW5jaWRlbmN5IVwiO1xyXG4gICAgICB9XHJcbiAgICBcclxuICAgICAgbmVpZ2hib3JzLmFkZChlZGdlLnNvdXJjZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBuZWlnaGJvcnM7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUud2l0aENoaWxkcmVuID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciB3aXRoTmVpZ2hib3JzTGlzdCA9IG5ldyBTZXQoKTtcclxuICB2YXIgY2hpbGROb2RlO1xyXG4gIHZhciBjaGlsZHJlbjtcclxuXHJcbiAgd2l0aE5laWdoYm9yc0xpc3QuYWRkKHRoaXMpO1xyXG5cclxuICBpZiAodGhpcy5jaGlsZCAhPSBudWxsKVxyXG4gIHtcclxuICAgIHZhciBub2RlcyA9IHRoaXMuY2hpbGQuZ2V0Tm9kZXMoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIGNoaWxkTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBjaGlsZHJlbiA9IGNoaWxkTm9kZS53aXRoQ2hpbGRyZW4oKTtcclxuICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgd2l0aE5laWdoYm9yc0xpc3QuYWRkKG5vZGUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB3aXRoTmVpZ2hib3JzTGlzdDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXROb09mQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdmFyIG5vT2ZDaGlsZHJlbiA9IDA7XHJcbiAgdmFyIGNoaWxkTm9kZTtcclxuXHJcbiAgaWYodGhpcy5jaGlsZCA9PSBudWxsKXtcclxuICAgIG5vT2ZDaGlsZHJlbiA9IDE7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmNoaWxkLmdldE5vZGVzKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICBjaGlsZE5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICAgIG5vT2ZDaGlsZHJlbiArPSBjaGlsZE5vZGUuZ2V0Tm9PZkNoaWxkcmVuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGlmKG5vT2ZDaGlsZHJlbiA9PSAwKXtcclxuICAgIG5vT2ZDaGlsZHJlbiA9IDE7XHJcbiAgfVxyXG4gIHJldHVybiBub09mQ2hpbGRyZW47XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0RXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5lc3RpbWF0ZWRTaXplID09IEludGVnZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZTtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5jYWxjRXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAodGhpcy5jaGlsZCA9PSBudWxsKVxyXG4gIHtcclxuICAgIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemUgPSAodGhpcy5yZWN0LndpZHRoICsgdGhpcy5yZWN0LmhlaWdodCkgLyAyO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgdGhpcy5lc3RpbWF0ZWRTaXplID0gdGhpcy5jaGlsZC5jYWxjRXN0aW1hdGVkU2l6ZSgpO1xyXG4gICAgdGhpcy5yZWN0LndpZHRoID0gdGhpcy5lc3RpbWF0ZWRTaXplO1xyXG4gICAgdGhpcy5yZWN0LmhlaWdodCA9IHRoaXMuZXN0aW1hdGVkU2l6ZTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplO1xyXG4gIH1cclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5zY2F0dGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciByYW5kb21DZW50ZXJYO1xyXG4gIHZhciByYW5kb21DZW50ZXJZO1xyXG5cclxuICB2YXIgbWluWCA9IC1MYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWTtcclxuICB2YXIgbWF4WCA9IExheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xyXG4gIHJhbmRvbUNlbnRlclggPSBMYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1ggK1xyXG4gICAgICAgICAgKFJhbmRvbVNlZWQubmV4dERvdWJsZSgpICogKG1heFggLSBtaW5YKSkgKyBtaW5YO1xyXG5cclxuICB2YXIgbWluWSA9IC1MYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWTtcclxuICB2YXIgbWF4WSA9IExheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xyXG4gIHJhbmRvbUNlbnRlclkgPSBMYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1kgK1xyXG4gICAgICAgICAgKFJhbmRvbVNlZWQubmV4dERvdWJsZSgpICogKG1heFkgLSBtaW5ZKSkgKyBtaW5ZO1xyXG5cclxuICB0aGlzLnJlY3QueCA9IHJhbmRvbUNlbnRlclg7XHJcbiAgdGhpcy5yZWN0LnkgPSByYW5kb21DZW50ZXJZXHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUudXBkYXRlQm91bmRzID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmdldENoaWxkKCkgPT0gbnVsbCkge1xyXG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgfVxyXG4gIGlmICh0aGlzLmdldENoaWxkKCkuZ2V0Tm9kZXMoKS5sZW5ndGggIT0gMClcclxuICB7XHJcbiAgICAvLyB3cmFwIHRoZSBjaGlsZHJlbiBub2RlcyBieSByZS1hcnJhbmdpbmcgdGhlIGJvdW5kYXJpZXNcclxuICAgIHZhciBjaGlsZEdyYXBoID0gdGhpcy5nZXRDaGlsZCgpO1xyXG4gICAgY2hpbGRHcmFwaC51cGRhdGVCb3VuZHModHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5yZWN0LnggPSBjaGlsZEdyYXBoLmdldExlZnQoKTtcclxuICAgIHRoaXMucmVjdC55ID0gY2hpbGRHcmFwaC5nZXRUb3AoKTtcclxuXHJcbiAgICB0aGlzLnNldFdpZHRoKGNoaWxkR3JhcGguZ2V0UmlnaHQoKSAtIGNoaWxkR3JhcGguZ2V0TGVmdCgpKTtcclxuICAgIHRoaXMuc2V0SGVpZ2h0KGNoaWxkR3JhcGguZ2V0Qm90dG9tKCkgLSBjaGlsZEdyYXBoLmdldFRvcCgpKTtcclxuICAgIFxyXG4gICAgLy8gVXBkYXRlIGNvbXBvdW5kIGJvdW5kcyBjb25zaWRlcmluZyBpdHMgbGFiZWwgcHJvcGVydGllcyAgICBcclxuICAgIGlmKExheW91dENvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMpe1xyXG4gICAgICAgIFxyXG4gICAgICB2YXIgd2lkdGggPSBjaGlsZEdyYXBoLmdldFJpZ2h0KCkgLSBjaGlsZEdyYXBoLmdldExlZnQoKTtcclxuICAgICAgdmFyIGhlaWdodCA9IGNoaWxkR3JhcGguZ2V0Qm90dG9tKCkgLSBjaGlsZEdyYXBoLmdldFRvcCgpO1xyXG5cclxuICAgICAgaWYodGhpcy5sYWJlbFdpZHRoID4gd2lkdGgpe1xyXG4gICAgICAgIHRoaXMucmVjdC54IC09ICh0aGlzLmxhYmVsV2lkdGggLSB3aWR0aCkgLyAyO1xyXG4gICAgICAgIHRoaXMuc2V0V2lkdGgodGhpcy5sYWJlbFdpZHRoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodGhpcy5sYWJlbEhlaWdodCA+IGhlaWdodCl7XHJcbiAgICAgICAgaWYodGhpcy5sYWJlbFBvcyA9PSBcImNlbnRlclwiKXtcclxuICAgICAgICAgIHRoaXMucmVjdC55IC09ICh0aGlzLmxhYmVsSGVpZ2h0IC0gaGVpZ2h0KSAvIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5sYWJlbFBvcyA9PSBcInRvcFwiKXtcclxuICAgICAgICAgIHRoaXMucmVjdC55IC09ICh0aGlzLmxhYmVsSGVpZ2h0IC0gaGVpZ2h0KTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0SGVpZ2h0KHRoaXMubGFiZWxIZWlnaHQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldEluY2x1c2lvblRyZWVEZXB0aCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5pbmNsdXNpb25UcmVlRGVwdGggPT0gSW50ZWdlci5NQVhfVkFMVUUpIHtcclxuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5pbmNsdXNpb25UcmVlRGVwdGg7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gKHRyYW5zKVxyXG57XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJlY3QueDtcclxuXHJcbiAgaWYgKGxlZnQgPiBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXHJcbiAge1xyXG4gICAgbGVmdCA9IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWTtcclxuICB9XHJcbiAgZWxzZSBpZiAobGVmdCA8IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXHJcbiAge1xyXG4gICAgbGVmdCA9IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlk7XHJcbiAgfVxyXG5cclxuICB2YXIgdG9wID0gdGhpcy5yZWN0Lnk7XHJcblxyXG4gIGlmICh0b3AgPiBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlkpXHJcbiAge1xyXG4gICAgdG9wID0gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xyXG4gIH1cclxuICBlbHNlIGlmICh0b3AgPCAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxyXG4gIHtcclxuICAgIHRvcCA9IC1MYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlk7XHJcbiAgfVxyXG5cclxuICB2YXIgbGVmdFRvcCA9IG5ldyBQb2ludEQobGVmdCwgdG9wKTtcclxuICB2YXIgdkxlZnRUb3AgPSB0cmFucy5pbnZlcnNlVHJhbnNmb3JtUG9pbnQobGVmdFRvcCk7XHJcblxyXG4gIHRoaXMuc2V0TG9jYXRpb24odkxlZnRUb3AueCwgdkxlZnRUb3AueSk7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0Lng7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdC54ICsgdGhpcy5yZWN0LndpZHRoO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0Lnk7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0Qm90dG9tID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3QueSArIHRoaXMucmVjdC5oZWlnaHQ7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIGlmICh0aGlzLm93bmVyID09IG51bGwpXHJcbiAge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5vd25lci5nZXRQYXJlbnQoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTE5vZGU7XHJcbiIsInZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xyXG52YXIgSGFzaE1hcCA9IHJlcXVpcmUoJy4vSGFzaE1hcCcpO1xyXG52YXIgTEdyYXBoTWFuYWdlciA9IHJlcXVpcmUoJy4vTEdyYXBoTWFuYWdlcicpO1xyXG52YXIgTE5vZGUgPSByZXF1aXJlKCcuL0xOb2RlJyk7XHJcbnZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcclxudmFyIExHcmFwaCA9IHJlcXVpcmUoJy4vTEdyYXBoJyk7XHJcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcclxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCcuL0VtaXR0ZXInKTtcclxudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcclxuXHJcbmZ1bmN0aW9uIExheW91dChpc1JlbW90ZVVzZSkge1xyXG4gIEVtaXR0ZXIuY2FsbCggdGhpcyApO1xyXG5cclxuICAvL0xheW91dCBRdWFsaXR5OiAwOnByb29mLCAxOmRlZmF1bHQsIDI6ZHJhZnRcclxuICB0aGlzLmxheW91dFF1YWxpdHkgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9RVUFMSVRZO1xyXG4gIC8vV2hldGhlciBsYXlvdXQgc2hvdWxkIGNyZWF0ZSBiZW5kcG9pbnRzIGFzIG5lZWRlZCBvciBub3RcclxuICB0aGlzLmNyZWF0ZUJlbmRzQXNOZWVkZWQgPVxyXG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRDtcclxuICAvL1doZXRoZXIgbGF5b3V0IHNob3VsZCBiZSBpbmNyZW1lbnRhbCBvciBub3RcclxuICB0aGlzLmluY3JlbWVudGFsID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUw7XHJcbiAgLy9XaGV0aGVyIHdlIGFuaW1hdGUgZnJvbSBiZWZvcmUgdG8gYWZ0ZXIgbGF5b3V0IG5vZGUgcG9zaXRpb25zXHJcbiAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9XHJcbiAgICAgICAgICBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fT05fTEFZT1VUO1xyXG4gIC8vV2hldGhlciB3ZSBhbmltYXRlIHRoZSBsYXlvdXQgcHJvY2VzcyBvciBub3RcclxuICB0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9EVVJJTkdfTEFZT1VUO1xyXG4gIC8vTnVtYmVyIGl0ZXJhdGlvbnMgdGhhdCBzaG91bGQgYmUgZG9uZSBiZXR3ZWVuIHR3byBzdWNjZXNzaXZlIGFuaW1hdGlvbnNcclxuICB0aGlzLmFuaW1hdGlvblBlcmlvZCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9QRVJJT0Q7XHJcbiAgLyoqXHJcbiAgICogV2hldGhlciBvciBub3QgbGVhZiBub2RlcyAobm9uLWNvbXBvdW5kIG5vZGVzKSBhcmUgb2YgdW5pZm9ybSBzaXplcy4gV2hlblxyXG4gICAqIHRoZXkgYXJlLCBib3RoIHNwcmluZyBhbmQgcmVwdWxzaW9uIGZvcmNlcyBiZXR3ZWVuIHR3byBsZWFmIG5vZGVzIGNhbiBiZVxyXG4gICAqIGNhbGN1bGF0ZWQgd2l0aG91dCB0aGUgZXhwZW5zaXZlIGNsaXBwaW5nIHBvaW50IGNhbGN1bGF0aW9ucywgcmVzdWx0aW5nXHJcbiAgICogaW4gbWFqb3Igc3BlZWQtdXAuXHJcbiAgICovXHJcbiAgdGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyA9XHJcbiAgICAgICAgICBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VTklGT1JNX0xFQUZfTk9ERV9TSVpFUztcclxuICAvKipcclxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGNyZWF0aW9uIG9mIGJlbmRwb2ludHMgYnkgdXNpbmcgZHVtbXkgbm9kZXMgYW5kIGVkZ2VzLlxyXG4gICAqIE1hcHMgYW4gTEVkZ2UgdG8gaXRzIGR1bW15IGJlbmRwb2ludCBwYXRoLlxyXG4gICAqL1xyXG4gIHRoaXMuZWRnZVRvRHVtbXlOb2RlcyA9IG5ldyBIYXNoTWFwKCk7XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBuZXcgTEdyYXBoTWFuYWdlcih0aGlzKTtcclxuICB0aGlzLmlzTGF5b3V0RmluaXNoZWQgPSBmYWxzZTtcclxuICB0aGlzLmlzU3ViTGF5b3V0ID0gZmFsc2U7XHJcbiAgdGhpcy5pc1JlbW90ZVVzZSA9IGZhbHNlO1xyXG5cclxuICBpZiAoaXNSZW1vdGVVc2UgIT0gbnVsbCkge1xyXG4gICAgdGhpcy5pc1JlbW90ZVVzZSA9IGlzUmVtb3RlVXNlO1xyXG4gIH1cclxufVxyXG5cclxuTGF5b3V0LlJBTkRPTV9TRUVEID0gMTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBFbWl0dGVyLnByb3RvdHlwZSApO1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5nZXRHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5nZXRBbGxOb2RlcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUuZ2V0QWxsRWRnZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCk7XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLmdldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbigpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5uZXdHcmFwaE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGdtID0gbmV3IExHcmFwaE1hbmFnZXIodGhpcyk7XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIgPSBnbTtcclxuICByZXR1cm4gZ207XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLm5ld0dyYXBoID0gZnVuY3Rpb24gKHZHcmFwaClcclxue1xyXG4gIHJldHVybiBuZXcgTEdyYXBoKG51bGwsIHRoaXMuZ3JhcGhNYW5hZ2VyLCB2R3JhcGgpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5uZXdOb2RlID0gZnVuY3Rpb24gKHZOb2RlKVxyXG57XHJcbiAgcmV0dXJuIG5ldyBMTm9kZSh0aGlzLmdyYXBoTWFuYWdlciwgdk5vZGUpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5uZXdFZGdlID0gZnVuY3Rpb24gKHZFZGdlKVxyXG57XHJcbiAgcmV0dXJuIG5ldyBMRWRnZShudWxsLCBudWxsLCB2RWRnZSk7XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLmNoZWNrTGF5b3V0U3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiAodGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpID09IG51bGwpXHJcbiAgICAgICAgICB8fCB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKS5sZW5ndGggPT0gMFxyXG4gICAgICAgICAgfHwgdGhpcy5ncmFwaE1hbmFnZXIuaW5jbHVkZXNJbnZhbGlkRWRnZSgpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5ydW5MYXlvdXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgaWYgKHRoaXMudGlsaW5nUHJlTGF5b3V0KSB7XHJcbiAgICB0aGlzLnRpbGluZ1ByZUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbml0UGFyYW1ldGVycygpO1xyXG4gIHZhciBpc0xheW91dFN1Y2Nlc3NmdWxsO1xyXG5cclxuICBpZiAodGhpcy5jaGVja0xheW91dFN1Y2Nlc3MoKSlcclxuICB7XHJcbiAgICBpc0xheW91dFN1Y2Nlc3NmdWxsID0gZmFsc2U7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICBpc0xheW91dFN1Y2Nlc3NmdWxsID0gdGhpcy5sYXlvdXQoKTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKExheW91dENvbnN0YW50cy5BTklNQVRFID09PSAnZHVyaW5nJykge1xyXG4gICAgLy8gSWYgdGhpcyBpcyBhICdkdXJpbmcnIGxheW91dCBhbmltYXRpb24uIExheW91dCBpcyBub3QgZmluaXNoZWQgeWV0LiBcclxuICAgIC8vIFdlIG5lZWQgdG8gcGVyZm9ybSB0aGVzZSBpbiBpbmRleC5qcyB3aGVuIGxheW91dCBpcyByZWFsbHkgZmluaXNoZWQuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIFxyXG4gIGlmIChpc0xheW91dFN1Y2Nlc3NmdWxsKVxyXG4gIHtcclxuICAgIGlmICghdGhpcy5pc1N1YkxheW91dClcclxuICAgIHtcclxuICAgICAgdGhpcy5kb1Bvc3RMYXlvdXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICh0aGlzLnRpbGluZ1Bvc3RMYXlvdXQpIHtcclxuICAgIHRoaXMudGlsaW5nUG9zdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIGlzTGF5b3V0U3VjY2Vzc2Z1bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgcGVyZm9ybXMgdGhlIG9wZXJhdGlvbnMgcmVxdWlyZWQgYWZ0ZXIgbGF5b3V0LlxyXG4gKi9cclxuTGF5b3V0LnByb3RvdHlwZS5kb1Bvc3RMYXlvdXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgLy9hc3NlcnQgIWlzU3ViTGF5b3V0IDogXCJTaG91bGQgbm90IGJlIGNhbGxlZCBvbiBzdWItbGF5b3V0IVwiO1xyXG4gIC8vIFByb3BhZ2F0ZSBnZW9tZXRyaWMgY2hhbmdlcyB0byB2LWxldmVsIG9iamVjdHNcclxuICBpZighdGhpcy5pbmNyZW1lbnRhbCl7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xyXG4gIH1cclxuICB0aGlzLnVwZGF0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIHVwZGF0ZXMgdGhlIGdlb21ldHJ5IG9mIHRoZSB0YXJnZXQgZ3JhcGggYWNjb3JkaW5nIHRvXHJcbiAqIGNhbGN1bGF0ZWQgbGF5b3V0LlxyXG4gKi9cclxuTGF5b3V0LnByb3RvdHlwZS51cGRhdGUyID0gZnVuY3Rpb24gKCkge1xyXG4gIC8vIHVwZGF0ZSBiZW5kIHBvaW50c1xyXG4gIGlmICh0aGlzLmNyZWF0ZUJlbmRzQXNOZWVkZWQpXHJcbiAge1xyXG4gICAgdGhpcy5jcmVhdGVCZW5kcG9pbnRzRnJvbUR1bW15Tm9kZXMoKTtcclxuXHJcbiAgICAvLyByZXNldCBhbGwgZWRnZXMsIHNpbmNlIHRoZSB0b3BvbG9neSBoYXMgY2hhbmdlZFxyXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxFZGdlcygpO1xyXG4gIH1cclxuXHJcbiAgLy8gcGVyZm9ybSBlZGdlLCBub2RlIGFuZCByb290IHVwZGF0ZXMgaWYgbGF5b3V0IGlzIG5vdCBjYWxsZWRcclxuICAvLyByZW1vdGVseVxyXG4gIGlmICghdGhpcy5pc1JlbW90ZVVzZSlcclxuICB7XHJcbiAgICAvLyB1cGRhdGUgYWxsIGVkZ2VzXHJcbiAgICB2YXIgZWRnZTtcclxuICAgIHZhciBhbGxFZGdlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEVkZ2VzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICBlZGdlID0gYWxsRWRnZXNbaV07XHJcbi8vICAgICAgdGhpcy51cGRhdGUoZWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVjdXJzaXZlbHkgdXBkYXRlIG5vZGVzXHJcbiAgICB2YXIgbm9kZTtcclxuICAgIHZhciBub2RlcyA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXROb2RlcygpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgbm9kZSA9IG5vZGVzW2ldO1xyXG4vLyAgICAgIHRoaXMudXBkYXRlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZSByb290IGdyYXBoXHJcbiAgICB0aGlzLnVwZGF0ZSh0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkpO1xyXG4gIH1cclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gIGlmIChvYmogPT0gbnVsbCkge1xyXG4gICAgdGhpcy51cGRhdGUyKCk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIExOb2RlKSB7XHJcbiAgICB2YXIgbm9kZSA9IG9iajtcclxuICAgIGlmIChub2RlLmdldENoaWxkKCkgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgLy8gc2luY2Ugbm9kZSBpcyBjb21wb3VuZCwgcmVjdXJzaXZlbHkgdXBkYXRlIGNoaWxkIG5vZGVzXHJcbiAgICAgIHZhciBub2RlcyA9IG5vZGUuZ2V0Q2hpbGQoKS5nZXROb2RlcygpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgdXBkYXRlKG5vZGVzW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRoZSBsLWxldmVsIG5vZGUgaXMgYXNzb2NpYXRlZCB3aXRoIGEgdi1sZXZlbCBncmFwaCBvYmplY3QsXHJcbiAgICAvLyB0aGVuIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgdi1sZXZlbCBub2RlIGltcGxlbWVudHMgdGhlXHJcbiAgICAvLyBpbnRlcmZhY2UgVXBkYXRhYmxlLlxyXG4gICAgaWYgKG5vZGUudkdyYXBoT2JqZWN0ICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIC8vIGNhc3QgdG8gVXBkYXRhYmxlIHdpdGhvdXQgYW55IHR5cGUgY2hlY2tcclxuICAgICAgdmFyIHZOb2RlID0gbm9kZS52R3JhcGhPYmplY3Q7XHJcblxyXG4gICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIG9mIHRoZSBpbnRlcmZhY2VcclxuICAgICAgdk5vZGUudXBkYXRlKG5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMRWRnZSkge1xyXG4gICAgdmFyIGVkZ2UgPSBvYmo7XHJcbiAgICAvLyBpZiB0aGUgbC1sZXZlbCBlZGdlIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHYtbGV2ZWwgZ3JhcGggb2JqZWN0LFxyXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgZWRnZSBpbXBsZW1lbnRzIHRoZVxyXG4gICAgLy8gaW50ZXJmYWNlIFVwZGF0YWJsZS5cclxuXHJcbiAgICBpZiAoZWRnZS52R3JhcGhPYmplY3QgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgLy8gY2FzdCB0byBVcGRhdGFibGUgd2l0aG91dCBhbnkgdHlwZSBjaGVja1xyXG4gICAgICB2YXIgdkVkZ2UgPSBlZGdlLnZHcmFwaE9iamVjdDtcclxuXHJcbiAgICAgIC8vIGNhbGwgdGhlIHVwZGF0ZSBtZXRob2Qgb2YgdGhlIGludGVyZmFjZVxyXG4gICAgICB2RWRnZS51cGRhdGUoZWRnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIExHcmFwaCkge1xyXG4gICAgdmFyIGdyYXBoID0gb2JqO1xyXG4gICAgLy8gaWYgdGhlIGwtbGV2ZWwgZ3JhcGggaXMgYXNzb2NpYXRlZCB3aXRoIGEgdi1sZXZlbCBncmFwaCBvYmplY3QsXHJcbiAgICAvLyB0aGVuIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgdi1sZXZlbCBvYmplY3QgaW1wbGVtZW50cyB0aGVcclxuICAgIC8vIGludGVyZmFjZSBVcGRhdGFibGUuXHJcblxyXG4gICAgaWYgKGdyYXBoLnZHcmFwaE9iamVjdCAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAvLyBjYXN0IHRvIFVwZGF0YWJsZSB3aXRob3V0IGFueSB0eXBlIGNoZWNrXHJcbiAgICAgIHZhciB2R3JhcGggPSBncmFwaC52R3JhcGhPYmplY3Q7XHJcblxyXG4gICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIG9mIHRoZSBpbnRlcmZhY2VcclxuICAgICAgdkdyYXBoLnVwZGF0ZShncmFwaCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIGlzIHVzZWQgdG8gc2V0IGFsbCBsYXlvdXQgcGFyYW1ldGVycyB0byBkZWZhdWx0IHZhbHVlc1xyXG4gKiBkZXRlcm1pbmVkIGF0IGNvbXBpbGUgdGltZS5cclxuICovXHJcbkxheW91dC5wcm90b3R5cGUuaW5pdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmlzU3ViTGF5b3V0KVxyXG4gIHtcclxuICAgIHRoaXMubGF5b3V0UXVhbGl0eSA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX1FVQUxJVFk7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9EVVJJTkdfTEFZT1VUO1xyXG4gICAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EO1xyXG4gICAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9PTl9MQVlPVVQ7XHJcbiAgICB0aGlzLmluY3JlbWVudGFsID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUw7XHJcbiAgICB0aGlzLmNyZWF0ZUJlbmRzQXNOZWVkZWQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DUkVBVEVfQkVORFNfQVNfTkVFREVEO1xyXG4gICAgdGhpcy51bmlmb3JtTGVhZk5vZGVTaXplcyA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX1VOSUZPUk1fTEVBRl9OT0RFX1NJWkVTO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRoaXMuYW5pbWF0aW9uRHVyaW5nTGF5b3V0KVxyXG4gIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uT25MYXlvdXQgPSBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChuZXdMZWZ0VG9wKSB7XHJcbiAgaWYgKG5ld0xlZnRUb3AgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybShuZXcgUG9pbnREKDAsIDApKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICAvLyBjcmVhdGUgYSB0cmFuc2Zvcm1hdGlvbiBvYmplY3QgKGZyb20gRWNsaXBzZSB0byBsYXlvdXQpLiBXaGVuIGFuXHJcbiAgICAvLyBpbnZlcnNlIHRyYW5zZm9ybSBpcyBhcHBsaWVkLCB3ZSBnZXQgdXBwZXItbGVmdCBjb29yZGluYXRlIG9mIHRoZVxyXG4gICAgLy8gZHJhd2luZyBvciB0aGUgcm9vdCBncmFwaCBhdCBnaXZlbiBpbnB1dCBjb29yZGluYXRlIChzb21lIG1hcmdpbnNcclxuICAgIC8vIGFscmVhZHkgaW5jbHVkZWQgaW4gY2FsY3VsYXRpb24gb2YgbGVmdC10b3ApLlxyXG5cclxuICAgIHZhciB0cmFucyA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICAgIHZhciBsZWZ0VG9wID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLnVwZGF0ZUxlZnRUb3AoKTtcclxuXHJcbiAgICBpZiAobGVmdFRvcCAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICB0cmFucy5zZXRXb3JsZE9yZ1gobmV3TGVmdFRvcC54KTtcclxuICAgICAgdHJhbnMuc2V0V29ybGRPcmdZKG5ld0xlZnRUb3AueSk7XHJcblxyXG4gICAgICB0cmFucy5zZXREZXZpY2VPcmdYKGxlZnRUb3AueCk7XHJcbiAgICAgIHRyYW5zLnNldERldmljZU9yZ1kobGVmdFRvcC55KTtcclxuXHJcbiAgICAgIHZhciBub2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXMoKTtcclxuICAgICAgdmFyIG5vZGU7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIG5vZGUudHJhbnNmb3JtKHRyYW5zKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUucG9zaXRpb25Ob2Rlc1JhbmRvbWx5ID0gZnVuY3Rpb24gKGdyYXBoKSB7XHJcblxyXG4gIGlmIChncmFwaCA9PSB1bmRlZmluZWQpIHtcclxuICAgIC8vYXNzZXJ0ICF0aGlzLmluY3JlbWVudGFsO1xyXG4gICAgdGhpcy5wb3NpdGlvbk5vZGVzUmFuZG9tbHkodGhpcy5nZXRHcmFwaE1hbmFnZXIoKS5nZXRSb290KCkpO1xyXG4gICAgdGhpcy5nZXRHcmFwaE1hbmFnZXIoKS5nZXRSb290KCkudXBkYXRlQm91bmRzKHRydWUpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBsTm9kZTtcclxuICAgIHZhciBjaGlsZEdyYXBoO1xyXG5cclxuICAgIHZhciBub2RlcyA9IGdyYXBoLmdldE5vZGVzKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICBsTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICBjaGlsZEdyYXBoID0gbE5vZGUuZ2V0Q2hpbGQoKTtcclxuXHJcbiAgICAgIGlmIChjaGlsZEdyYXBoID09IG51bGwpXHJcbiAgICAgIHtcclxuICAgICAgICBsTm9kZS5zY2F0dGVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoY2hpbGRHcmFwaC5nZXROb2RlcygpLmxlbmd0aCA9PSAwKVxyXG4gICAgICB7XHJcbiAgICAgICAgbE5vZGUuc2NhdHRlcigpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25Ob2Rlc1JhbmRvbWx5KGNoaWxkR3JhcGgpO1xyXG4gICAgICAgIGxOb2RlLnVwZGF0ZUJvdW5kcygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBsaXN0IG9mIHRyZWVzIHdoZXJlIGVhY2ggdHJlZSBpcyByZXByZXNlbnRlZCBhcyBhXHJcbiAqIGxpc3Qgb2YgbC1ub2Rlcy4gVGhlIG1ldGhvZCByZXR1cm5zIGEgbGlzdCBvZiBzaXplIDAgd2hlbjpcclxuICogLSBUaGUgZ3JhcGggaXMgbm90IGZsYXQgb3JcclxuICogLSBPbmUgb2YgdGhlIGNvbXBvbmVudChzKSBvZiB0aGUgZ3JhcGggaXMgbm90IGEgdHJlZS5cclxuICovXHJcbkxheW91dC5wcm90b3R5cGUuZ2V0RmxhdEZvcmVzdCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgZmxhdEZvcmVzdCA9IFtdO1xyXG4gIHZhciBpc0ZvcmVzdCA9IHRydWU7XHJcblxyXG4gIC8vIFF1aWNrIHJlZmVyZW5jZSBmb3IgYWxsIG5vZGVzIGluIHRoZSBncmFwaCBtYW5hZ2VyIGFzc29jaWF0ZWQgd2l0aFxyXG4gIC8vIHRoaXMgbGF5b3V0LiBUaGUgbGlzdCBzaG91bGQgbm90IGJlIGNoYW5nZWQuXHJcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpLmdldE5vZGVzKCk7XHJcblxyXG4gIC8vIEZpcnN0IGJlIHN1cmUgdGhhdCB0aGUgZ3JhcGggaXMgZmxhdFxyXG4gIHZhciBpc0ZsYXQgPSB0cnVlO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gIHtcclxuICAgIGlmIChhbGxOb2Rlc1tpXS5nZXRDaGlsZCgpICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGlzRmxhdCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIGVtcHR5IGZvcmVzdCBpZiB0aGUgZ3JhcGggaXMgbm90IGZsYXQuXHJcbiAgaWYgKCFpc0ZsYXQpXHJcbiAge1xyXG4gICAgcmV0dXJuIGZsYXRGb3Jlc3Q7XHJcbiAgfVxyXG5cclxuICAvLyBSdW4gQkZTIGZvciBlYWNoIGNvbXBvbmVudCBvZiB0aGUgZ3JhcGguXHJcblxyXG4gIHZhciB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcclxuICB2YXIgdG9CZVZpc2l0ZWQgPSBbXTtcclxuICB2YXIgcGFyZW50cyA9IG5ldyBIYXNoTWFwKCk7XHJcbiAgdmFyIHVuUHJvY2Vzc2VkTm9kZXMgPSBbXTtcclxuXHJcbiAgdW5Qcm9jZXNzZWROb2RlcyA9IHVuUHJvY2Vzc2VkTm9kZXMuY29uY2F0KGFsbE5vZGVzKTtcclxuXHJcbiAgLy8gRWFjaCBpdGVyYXRpb24gb2YgdGhpcyBsb29wIGZpbmRzIGEgY29tcG9uZW50IG9mIHRoZSBncmFwaCBhbmRcclxuICAvLyBkZWNpZGVzIHdoZXRoZXIgaXQgaXMgYSB0cmVlIG9yIG5vdC4gSWYgaXQgaXMgYSB0cmVlLCBhZGRzIGl0IHRvIHRoZVxyXG4gIC8vIGZvcmVzdCBhbmQgY29udGludWVkIHdpdGggdGhlIG5leHQgY29tcG9uZW50LlxyXG5cclxuICB3aGlsZSAodW5Qcm9jZXNzZWROb2Rlcy5sZW5ndGggPiAwICYmIGlzRm9yZXN0KVxyXG4gIHtcclxuICAgIHRvQmVWaXNpdGVkLnB1c2godW5Qcm9jZXNzZWROb2Rlc1swXSk7XHJcblxyXG4gICAgLy8gU3RhcnQgdGhlIEJGUy4gRWFjaCBpdGVyYXRpb24gb2YgdGhpcyBsb29wIHZpc2l0cyBhIG5vZGUgaW4gYVxyXG4gICAgLy8gQkZTIG1hbm5lci5cclxuICAgIHdoaWxlICh0b0JlVmlzaXRlZC5sZW5ndGggPiAwICYmIGlzRm9yZXN0KVxyXG4gICAge1xyXG4gICAgICAvL3Bvb2wgb3BlcmF0aW9uXHJcbiAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRvQmVWaXNpdGVkWzBdO1xyXG4gICAgICB0b0JlVmlzaXRlZC5zcGxpY2UoMCwgMSk7XHJcbiAgICAgIHZpc2l0ZWQuYWRkKGN1cnJlbnROb2RlKTtcclxuXHJcbiAgICAgIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXHJcbiAgICAgIHZhciBuZWlnaGJvckVkZ2VzID0gY3VycmVudE5vZGUuZ2V0RWRnZXMoKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmVpZ2hib3JFZGdlcy5sZW5ndGg7IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIHZhciBjdXJyZW50TmVpZ2hib3IgPVxyXG4gICAgICAgICAgICAgICAgbmVpZ2hib3JFZGdlc1tpXS5nZXRPdGhlckVuZChjdXJyZW50Tm9kZSk7XHJcblxyXG4gICAgICAgIC8vIElmIEJGUyBpcyBub3QgZ3Jvd2luZyBmcm9tIHRoaXMgbmVpZ2hib3IuXHJcbiAgICAgICAgaWYgKHBhcmVudHMuZ2V0KGN1cnJlbnROb2RlKSAhPSBjdXJyZW50TmVpZ2hib3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLy8gV2UgaGF2ZW4ndCBwcmV2aW91c2x5IHZpc2l0ZWQgdGhpcyBuZWlnaGJvci5cclxuICAgICAgICAgIGlmICghdmlzaXRlZC5jb250YWlucyhjdXJyZW50TmVpZ2hib3IpKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0b0JlVmlzaXRlZC5wdXNoKGN1cnJlbnROZWlnaGJvcik7XHJcbiAgICAgICAgICAgIHBhcmVudHMucHV0KGN1cnJlbnROZWlnaGJvciwgY3VycmVudE5vZGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSBwcmV2aW91c2x5IHZpc2l0ZWQgdGhpcyBuZWlnaGJvciBhbmRcclxuICAgICAgICAgIC8vIHRoaXMgbmVpZ2hib3IgaXMgbm90IHBhcmVudCBvZiBjdXJyZW50Tm9kZSwgZ2l2ZW5cclxuICAgICAgICAgIC8vIGdyYXBoIGNvbnRhaW5zIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHRyZWUsIGhlbmNlXHJcbiAgICAgICAgICAvLyBpdCBpcyBub3QgYSBmb3Jlc3QuXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGlzRm9yZXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoZSBncmFwaCBjb250YWlucyBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCBhIHRyZWUuIEVtcHR5XHJcbiAgICAvLyBwcmV2aW91c2x5IGZvdW5kIHRyZWVzLiBUaGUgbWV0aG9kIHdpbGwgZW5kLlxyXG4gICAgaWYgKCFpc0ZvcmVzdClcclxuICAgIHtcclxuICAgICAgZmxhdEZvcmVzdCA9IFtdO1xyXG4gICAgfVxyXG4gICAgLy8gU2F2ZSBjdXJyZW50bHkgdmlzaXRlZCBub2RlcyBhcyBhIHRyZWUgaW4gb3VyIGZvcmVzdC4gUmVzZXRcclxuICAgIC8vIHZpc2l0ZWQgYW5kIHBhcmVudHMgbGlzdHMuIENvbnRpbnVlIHdpdGggdGhlIG5leHQgY29tcG9uZW50IG9mXHJcbiAgICAvLyB0aGUgZ3JhcGgsIGlmIGFueS5cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgdmFyIHRlbXAgPSBbXTtcclxuICAgICAgdmlzaXRlZC5hZGRBbGxUbyh0ZW1wKTtcclxuICAgICAgZmxhdEZvcmVzdC5wdXNoKHRlbXApO1xyXG4gICAgICAvL2ZsYXRGb3Jlc3QgPSBmbGF0Rm9yZXN0LmNvbmNhdCh0ZW1wKTtcclxuICAgICAgLy91blByb2Nlc3NlZE5vZGVzLnJlbW92ZUFsbCh2aXNpdGVkKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGVtcFtpXTtcclxuICAgICAgICB2YXIgaW5kZXggPSB1blByb2Nlc3NlZE5vZGVzLmluZGV4T2YodmFsdWUpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICB1blByb2Nlc3NlZE5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZpc2l0ZWQgPSBuZXcgSGFzaFNldCgpO1xyXG4gICAgICBwYXJlbnRzID0gbmV3IEhhc2hNYXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmbGF0Rm9yZXN0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgZHVtbXkgbm9kZXMgKGFuIGwtbGV2ZWwgbm9kZSB3aXRoIG1pbmltYWwgZGltZW5zaW9ucylcclxuICogZm9yIHRoZSBnaXZlbiBlZGdlIChvbmUgcGVyIGJlbmRwb2ludCkuIFRoZSBleGlzdGluZyBsLWxldmVsIHN0cnVjdHVyZVxyXG4gKiBpcyB1cGRhdGVkIGFjY29yZGluZ2x5LlxyXG4gKi9cclxuTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVEdW1teU5vZGVzRm9yQmVuZHBvaW50cyA9IGZ1bmN0aW9uIChlZGdlKVxyXG57XHJcbiAgdmFyIGR1bW15Tm9kZXMgPSBbXTtcclxuICB2YXIgcHJldiA9IGVkZ2Uuc291cmNlO1xyXG5cclxuICB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoTWFuYWdlci5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3IoZWRnZS5zb3VyY2UsIGVkZ2UudGFyZ2V0KTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlLmJlbmRwb2ludHMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgLy8gY3JlYXRlIG5ldyBkdW1teSBub2RlXHJcbiAgICB2YXIgZHVtbXlOb2RlID0gdGhpcy5uZXdOb2RlKG51bGwpO1xyXG4gICAgZHVtbXlOb2RlLnNldFJlY3QobmV3IFBvaW50KDAsIDApLCBuZXcgRGltZW5zaW9uKDEsIDEpKTtcclxuXHJcbiAgICBncmFwaC5hZGQoZHVtbXlOb2RlKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgbmV3IGR1bW15IGVkZ2UgYmV0d2VlbiBwcmV2IGFuZCBkdW1teSBub2RlXHJcbiAgICB2YXIgZHVtbXlFZGdlID0gdGhpcy5uZXdFZGdlKG51bGwpO1xyXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIuYWRkKGR1bW15RWRnZSwgcHJldiwgZHVtbXlOb2RlKTtcclxuXHJcbiAgICBkdW1teU5vZGVzLmFkZChkdW1teU5vZGUpO1xyXG4gICAgcHJldiA9IGR1bW15Tm9kZTtcclxuICB9XHJcblxyXG4gIHZhciBkdW1teUVkZ2UgPSB0aGlzLm5ld0VkZ2UobnVsbCk7XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIuYWRkKGR1bW15RWRnZSwgcHJldiwgZWRnZS50YXJnZXQpO1xyXG5cclxuICB0aGlzLmVkZ2VUb0R1bW15Tm9kZXMucHV0KGVkZ2UsIGR1bW15Tm9kZXMpO1xyXG5cclxuICAvLyByZW1vdmUgcmVhbCBlZGdlIGZyb20gZ3JhcGggbWFuYWdlciBpZiBpdCBpcyBpbnRlci1ncmFwaFxyXG4gIGlmIChlZGdlLmlzSW50ZXJHcmFwaCgpKVxyXG4gIHtcclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlbW92ZShlZGdlKTtcclxuICB9XHJcbiAgLy8gZWxzZSwgcmVtb3ZlIHRoZSBlZGdlIGZyb20gdGhlIGN1cnJlbnQgZ3JhcGhcclxuICBlbHNlXHJcbiAge1xyXG4gICAgZ3JhcGgucmVtb3ZlKGVkZ2UpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGR1bW15Tm9kZXM7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBiZW5kcG9pbnRzIGZvciBlZGdlcyBmcm9tIHRoZSBkdW1teSBub2Rlc1xyXG4gKiBhdCBsLWxldmVsLlxyXG4gKi9cclxuTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVCZW5kcG9pbnRzRnJvbUR1bW15Tm9kZXMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdmFyIGVkZ2VzID0gW107XHJcbiAgZWRnZXMgPSBlZGdlcy5jb25jYXQodGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsRWRnZXMoKSk7XHJcbiAgZWRnZXMgPSB0aGlzLmVkZ2VUb0R1bW15Tm9kZXMua2V5U2V0KCkuY29uY2F0KGVkZ2VzKTtcclxuXHJcbiAgZm9yICh2YXIgayA9IDA7IGsgPCBlZGdlcy5sZW5ndGg7IGsrKylcclxuICB7XHJcbiAgICB2YXIgbEVkZ2UgPSBlZGdlc1trXTtcclxuXHJcbiAgICBpZiAobEVkZ2UuYmVuZHBvaW50cy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICB2YXIgcGF0aCA9IHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5nZXQobEVkZ2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIGR1bW15Tm9kZSA9IHBhdGhbaV07XHJcbiAgICAgICAgdmFyIHAgPSBuZXcgUG9pbnREKGR1bW15Tm9kZS5nZXRDZW50ZXJYKCksXHJcbiAgICAgICAgICAgICAgICBkdW1teU5vZGUuZ2V0Q2VudGVyWSgpKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGJlbmRwb2ludCdzIGxvY2F0aW9uIGFjY29yZGluZyB0byBkdW1teSBub2RlXHJcbiAgICAgICAgdmFyIGVicCA9IGxFZGdlLmJlbmRwb2ludHMuZ2V0KGkpO1xyXG4gICAgICAgIGVicC54ID0gcC54O1xyXG4gICAgICAgIGVicC55ID0gcC55O1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgdGhlIGR1bW15IG5vZGUsIGR1bW15IGVkZ2VzIGluY2lkZW50IHdpdGggdGhpc1xyXG4gICAgICAgIC8vIGR1bW15IG5vZGUgaXMgYWxzbyByZW1vdmVkICh3aXRoaW4gdGhlIHJlbW92ZSBtZXRob2QpXHJcbiAgICAgICAgZHVtbXlOb2RlLmdldE93bmVyKCkucmVtb3ZlKGR1bW15Tm9kZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGFkZCB0aGUgcmVhbCBlZGdlIHRvIGdyYXBoXHJcbiAgICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLmFkZChsRWRnZSwgbEVkZ2Uuc291cmNlLCBsRWRnZS50YXJnZXQpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkxheW91dC50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoc2xpZGVyVmFsdWUsIGRlZmF1bHRWYWx1ZSwgbWluRGl2LCBtYXhNdWwpIHtcclxuICBpZiAobWluRGl2ICE9IHVuZGVmaW5lZCAmJiBtYXhNdWwgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XHJcblxyXG4gICAgaWYgKHNsaWRlclZhbHVlIDw9IDUwKVxyXG4gICAge1xyXG4gICAgICB2YXIgbWluVmFsdWUgPSBkZWZhdWx0VmFsdWUgLyBtaW5EaXY7XHJcbiAgICAgIHZhbHVlIC09ICgoZGVmYXVsdFZhbHVlIC0gbWluVmFsdWUpIC8gNTApICogKDUwIC0gc2xpZGVyVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICB2YXIgbWF4VmFsdWUgPSBkZWZhdWx0VmFsdWUgKiBtYXhNdWw7XHJcbiAgICAgIHZhbHVlICs9ICgobWF4VmFsdWUgLSBkZWZhdWx0VmFsdWUpIC8gNTApICogKHNsaWRlclZhbHVlIC0gNTApO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB2YXIgYSwgYjtcclxuXHJcbiAgICBpZiAoc2xpZGVyVmFsdWUgPD0gNTApXHJcbiAgICB7XHJcbiAgICAgIGEgPSA5LjAgKiBkZWZhdWx0VmFsdWUgLyA1MDAuMDtcclxuICAgICAgYiA9IGRlZmF1bHRWYWx1ZSAvIDEwLjA7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIGEgPSA5LjAgKiBkZWZhdWx0VmFsdWUgLyA1MC4wO1xyXG4gICAgICBiID0gLTggKiBkZWZhdWx0VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChhICogc2xpZGVyVmFsdWUgKyBiKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgZmluZHMgYW5kIHJldHVybnMgdGhlIGNlbnRlciBvZiB0aGUgZ2l2ZW4gbm9kZXMsIGFzc3VtaW5nXHJcbiAqIHRoYXQgdGhlIGdpdmVuIG5vZGVzIGZvcm0gYSB0cmVlIGluIHRoZW1zZWx2ZXMuXHJcbiAqL1xyXG5MYXlvdXQuZmluZENlbnRlck9mVHJlZSA9IGZ1bmN0aW9uIChub2Rlcylcclxue1xyXG4gIHZhciBsaXN0ID0gW107XHJcbiAgbGlzdCA9IGxpc3QuY29uY2F0KG5vZGVzKTtcclxuXHJcbiAgdmFyIHJlbW92ZWROb2RlcyA9IFtdO1xyXG4gIHZhciByZW1haW5pbmdEZWdyZWVzID0gbmV3IEhhc2hNYXAoKTtcclxuICB2YXIgZm91bmRDZW50ZXIgPSBmYWxzZTtcclxuICB2YXIgY2VudGVyTm9kZSA9IG51bGw7XHJcblxyXG4gIGlmIChsaXN0Lmxlbmd0aCA9PSAxIHx8IGxpc3QubGVuZ3RoID09IDIpXHJcbiAge1xyXG4gICAgZm91bmRDZW50ZXIgPSB0cnVlO1xyXG4gICAgY2VudGVyTm9kZSA9IGxpc3RbMF07XHJcbiAgfVxyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIG5vZGUgPSBsaXN0W2ldO1xyXG4gICAgdmFyIGRlZ3JlZSA9IG5vZGUuZ2V0TmVpZ2hib3JzTGlzdCgpLnNpemUoKTtcclxuICAgIHJlbWFpbmluZ0RlZ3JlZXMucHV0KG5vZGUsIG5vZGUuZ2V0TmVpZ2hib3JzTGlzdCgpLnNpemUoKSk7XHJcblxyXG4gICAgaWYgKGRlZ3JlZSA9PSAxKVxyXG4gICAge1xyXG4gICAgICByZW1vdmVkTm9kZXMucHVzaChub2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB0ZW1wTGlzdCA9IFtdO1xyXG4gIHRlbXBMaXN0ID0gdGVtcExpc3QuY29uY2F0KHJlbW92ZWROb2Rlcyk7XHJcblxyXG4gIHdoaWxlICghZm91bmRDZW50ZXIpXHJcbiAge1xyXG4gICAgdmFyIHRlbXBMaXN0MiA9IFtdO1xyXG4gICAgdGVtcExpc3QyID0gdGVtcExpc3QyLmNvbmNhdCh0ZW1wTGlzdCk7XHJcbiAgICB0ZW1wTGlzdCA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgdmFyIG5vZGUgPSBsaXN0W2ldO1xyXG5cclxuICAgICAgdmFyIGluZGV4ID0gbGlzdC5pbmRleE9mKG5vZGUpO1xyXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgIGxpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG5laWdoYm91cnMgPSBub2RlLmdldE5laWdoYm9yc0xpc3QoKTtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKG5laWdoYm91cnMuc2V0KS5mb3JFYWNoKGZ1bmN0aW9uKGopIHtcclxuICAgICAgICB2YXIgbmVpZ2hib3VyID0gbmVpZ2hib3Vycy5zZXRbal07XHJcbiAgICAgICAgaWYgKHJlbW92ZWROb2Rlcy5pbmRleE9mKG5laWdoYm91cikgPCAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhciBvdGhlckRlZ3JlZSA9IHJlbWFpbmluZ0RlZ3JlZXMuZ2V0KG5laWdoYm91cik7XHJcbiAgICAgICAgICB2YXIgbmV3RGVncmVlID0gb3RoZXJEZWdyZWUgLSAxO1xyXG5cclxuICAgICAgICAgIGlmIChuZXdEZWdyZWUgPT0gMSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGVtcExpc3QucHVzaChuZWlnaGJvdXIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlbWFpbmluZ0RlZ3JlZXMucHV0KG5laWdoYm91ciwgbmV3RGVncmVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZWROb2RlcyA9IHJlbW92ZWROb2Rlcy5jb25jYXQodGVtcExpc3QpO1xyXG5cclxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAxIHx8IGxpc3QubGVuZ3RoID09IDIpXHJcbiAgICB7XHJcbiAgICAgIGZvdW5kQ2VudGVyID0gdHJ1ZTtcclxuICAgICAgY2VudGVyTm9kZSA9IGxpc3RbMF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2VudGVyTm9kZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEdXJpbmcgdGhlIGNvYXJzZW5pbmcgcHJvY2VzcywgdGhpcyBsYXlvdXQgbWF5IGJlIHJlZmVyZW5jZWQgYnkgdHdvIGdyYXBoIG1hbmFnZXJzXHJcbiAqIHRoaXMgc2V0dGVyIGZ1bmN0aW9uIGdyYW50cyBhY2Nlc3MgdG8gY2hhbmdlIHRoZSBjdXJyZW50bHkgYmVpbmcgdXNlZCBncmFwaCBtYW5hZ2VyXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLnNldEdyYXBoTWFuYWdlciA9IGZ1bmN0aW9uIChnbSlcclxue1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDtcclxuIiwiZnVuY3Rpb24gTGF5b3V0Q29uc3RhbnRzKCkge1xyXG59XHJcblxyXG4vKipcclxuICogTGF5b3V0IFF1YWxpdHlcclxuICovXHJcbkxheW91dENvbnN0YW50cy5QUk9PRl9RVUFMSVRZID0gMDtcclxuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUVVBTElUWSA9IDE7XHJcbkxheW91dENvbnN0YW50cy5EUkFGVF9RVUFMSVRZID0gMjtcclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IHBhcmFtZXRlcnNcclxuICovXHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQgPSBmYWxzZTtcclxuLy9MYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9IHRydWU7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gZmFsc2U7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9PTl9MQVlPVVQgPSB0cnVlO1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVCA9IGZhbHNlO1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EID0gNTA7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX1VOSUZPUk1fTEVBRl9OT0RFX1NJWkVTID0gZmFsc2U7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBTZWN0aW9uOiBHZW5lcmFsIG90aGVyIGNvbnN0YW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vKlxyXG4gKiBNYXJnaW5zIG9mIGEgZ3JhcGggdG8gYmUgYXBwbGllZCBvbiBib3VkaW5nIHJlY3RhbmdsZSBvZiBpdHMgY29udGVudHMuIFdlXHJcbiAqIGFzc3VtZSBtYXJnaW5zIG9uIGFsbCBmb3VyIHNpZGVzIHRvIGJlIHVuaWZvcm0uXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFQSF9NQVJHSU4gPSAxNTtcclxuXHJcbi8qXHJcbiAqIFdoZXRoZXIgdG8gY29uc2lkZXIgbGFiZWxzIGluIG5vZGUgZGltZW5zaW9ucyBvciBub3RcclxuICovXHJcbkxheW91dENvbnN0YW50cy5OT0RFX0RJTUVOU0lPTlNfSU5DTFVERV9MQUJFTFMgPSBmYWxzZTtcclxuXHJcbi8qXHJcbiAqIERlZmF1bHQgZGltZW5zaW9uIG9mIGEgbm9uLWNvbXBvdW5kIG5vZGUuXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRSA9IDQwO1xyXG5cclxuLypcclxuICogRGVmYXVsdCBkaW1lbnNpb24gb2YgYSBub24tY29tcG91bmQgbm9kZS5cclxuICovXHJcbkxheW91dENvbnN0YW50cy5TSU1QTEVfTk9ERV9IQUxGX1NJWkUgPSBMYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRSAvIDI7XHJcblxyXG4vKlxyXG4gKiBFbXB0eSBjb21wb3VuZCBub2RlIHNpemUuIFdoZW4gYSBjb21wb3VuZCBub2RlIGlzIGVtcHR5LCBpdHMgYm90aFxyXG4gKiBkaW1lbnNpb25zIHNob3VsZCBiZSBvZiB0aGlzIHZhbHVlLlxyXG4gKi9cclxuTGF5b3V0Q29uc3RhbnRzLkVNUFRZX0NPTVBPVU5EX05PREVfU0laRSA9IDQwO1xyXG5cclxuLypcclxuICogTWluaW11bSBsZW5ndGggdGhhdCBhbiBlZGdlIHNob3VsZCB0YWtlIGR1cmluZyBsYXlvdXRcclxuICovXHJcbkxheW91dENvbnN0YW50cy5NSU5fRURHRV9MRU5HVEggPSAxO1xyXG5cclxuLypcclxuICogV29ybGQgYm91bmRhcmllcyB0aGF0IGxheW91dCBvcGVyYXRlcyBvblxyXG4gKi9cclxuTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZID0gMTAwMDAwMDtcclxuXHJcbi8qXHJcbiAqIFdvcmxkIGJvdW5kYXJpZXMgdGhhdCByYW5kb20gcG9zaXRpb25pbmcgY2FuIGJlIHBlcmZvcm1lZCB3aXRoXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWSA9IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWSAvIDEwMDA7XHJcblxyXG4vKlxyXG4gKiBDb29yZGluYXRlcyBvZiB0aGUgd29ybGQgY2VudGVyXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1ggPSAxMjAwO1xyXG5MYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1kgPSA5MDA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dENvbnN0YW50cztcclxuIiwiLypcclxuICpUaGlzIGNsYXNzIGlzIHRoZSBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBQb2ludC5qYXZhIGNsYXNzIGluIGpka1xyXG4gKi9cclxuZnVuY3Rpb24gUG9pbnQoeCwgeSwgcCkge1xyXG4gIHRoaXMueCA9IG51bGw7XHJcbiAgdGhpcy55ID0gbnVsbDtcclxuICBpZiAoeCA9PSBudWxsICYmIHkgPT0gbnVsbCAmJiBwID09IG51bGwpIHtcclxuICAgIHRoaXMueCA9IDA7XHJcbiAgICB0aGlzLnkgPSAwO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgeCA9PSAnbnVtYmVyJyAmJiB0eXBlb2YgeSA9PSAnbnVtYmVyJyAmJiBwID09IG51bGwpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gIH1cclxuICBlbHNlIGlmICh4LmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1BvaW50JyAmJiB5ID09IG51bGwgJiYgcCA9PSBudWxsKSB7XHJcbiAgICBwID0geDtcclxuICAgIHRoaXMueCA9IHAueDtcclxuICAgIHRoaXMueSA9IHAueTtcclxuICB9XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLng7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnk7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxufVxyXG5cclxuUG9pbnQucHJvdG90eXBlLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKHgsIHksIHApIHtcclxuICBpZiAoeC5jb25zdHJ1Y3Rvci5uYW1lID09ICdQb2ludCcgJiYgeSA9PSBudWxsICYmIHAgPT0gbnVsbCkge1xyXG4gICAgcCA9IHg7XHJcbiAgICB0aGlzLnNldExvY2F0aW9uKHAueCwgcC55KTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHggPT0gJ251bWJlcicgJiYgdHlwZW9mIHkgPT0gJ251bWJlcicgJiYgcCA9PSBudWxsKSB7XHJcbiAgICAvL2lmIGJvdGggcGFyYW1ldGVycyBhcmUgaW50ZWdlciBqdXN0IG1vdmUgKHgseSkgbG9jYXRpb25cclxuICAgIGlmIChwYXJzZUludCh4KSA9PSB4ICYmIHBhcnNlSW50KHkpID09IHkpIHtcclxuICAgICAgdGhpcy5tb3ZlKHgsIHkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoeCArIDAuNSk7XHJcbiAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoeSArIDAuNSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgdGhpcy54ID0geDtcclxuICB0aGlzLnkgPSB5O1xyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGR4LCBkeSkge1xyXG4gIHRoaXMueCArPSBkeDtcclxuICB0aGlzLnkgKz0gZHk7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgaWYgKG9iai5jb25zdHJ1Y3Rvci5uYW1lID09IFwiUG9pbnRcIikge1xyXG4gICAgdmFyIHB0ID0gb2JqO1xyXG4gICAgcmV0dXJuICh0aGlzLnggPT0gcHQueCkgJiYgKHRoaXMueSA9PSBwdC55KTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMgPT0gb2JqO1xyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCgpLmNvbnN0cnVjdG9yLm5hbWUgKyBcIlt4PVwiICsgdGhpcy54ICsgXCIseT1cIiArIHRoaXMueSArIFwiXVwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xyXG4iLCJmdW5jdGlvbiBQb2ludEQoeCwgeSkge1xyXG4gIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsKSB7XHJcbiAgICB0aGlzLnggPSAwO1xyXG4gICAgdGhpcy55ID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgfVxyXG59XHJcblxyXG5Qb2ludEQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueDtcclxufTtcclxuXHJcblBvaW50RC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy55O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB0aGlzLnggPSB4O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5zZXRZID0gZnVuY3Rpb24gKHkpXHJcbntcclxuICB0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5nZXREaWZmZXJlbmNlID0gZnVuY3Rpb24gKHB0KVxyXG57XHJcbiAgcmV0dXJuIG5ldyBEaW1lbnNpb25EKHRoaXMueCAtIHB0LngsIHRoaXMueSAtIHB0LnkpO1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5nZXRDb3B5ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiBuZXcgUG9pbnREKHRoaXMueCwgdGhpcy55KTtcclxufTtcclxuXHJcblBvaW50RC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGRpbSlcclxue1xyXG4gIHRoaXMueCArPSBkaW0ud2lkdGg7XHJcbiAgdGhpcy55ICs9IGRpbS5oZWlnaHQ7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50RDtcclxuIiwiZnVuY3Rpb24gUmFuZG9tU2VlZCgpIHtcclxufVxyXG5SYW5kb21TZWVkLnNlZWQgPSAxO1xyXG5SYW5kb21TZWVkLnggPSAwO1xyXG5cclxuUmFuZG9tU2VlZC5uZXh0RG91YmxlID0gZnVuY3Rpb24gKCkge1xyXG4gIFJhbmRvbVNlZWQueCA9IE1hdGguc2luKFJhbmRvbVNlZWQuc2VlZCsrKSAqIDEwMDAwO1xyXG4gIHJldHVybiBSYW5kb21TZWVkLnggLSBNYXRoLmZsb29yKFJhbmRvbVNlZWQueCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbVNlZWQ7XHJcbiIsImZ1bmN0aW9uIFJlY3RhbmdsZUQoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gIHRoaXMueCA9IDA7XHJcbiAgdGhpcy55ID0gMDtcclxuICB0aGlzLndpZHRoID0gMDtcclxuICB0aGlzLmhlaWdodCA9IDA7XHJcblxyXG4gIGlmICh4ICE9IG51bGwgJiYgeSAhPSBudWxsICYmIHdpZHRoICE9IG51bGwgJiYgaGVpZ2h0ICE9IG51bGwpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgfVxyXG59XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLng7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB0aGlzLnggPSB4O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy55O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0WSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdGhpcy55ID0geTtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLndpZHRoO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0V2lkdGggPSBmdW5jdGlvbiAod2lkdGgpXHJcbntcclxuICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodClcclxue1xyXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChhKVxyXG57XHJcbiAgaWYgKHRoaXMuZ2V0UmlnaHQoKSA8IGEueClcclxuICB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5nZXRCb3R0b20oKSA8IGEueSlcclxuICB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoYS5nZXRSaWdodCgpIDwgdGhpcy54KVxyXG4gIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmIChhLmdldEJvdHRvbSgpIDwgdGhpcy55KVxyXG4gIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0Q2VudGVyWCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCAvIDI7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRNaW5YID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmdldFgoKTtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1heFggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ2V0WCgpICsgdGhpcy53aWR0aDtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldENlbnRlclkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1pblkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ2V0WSgpO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0TWF4WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5nZXRZKCkgKyB0aGlzLmhlaWdodDtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoSGFsZiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHRIYWxmID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmhlaWdodCAvIDI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZUQ7XHJcbiIsInZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHgsIHkpIHtcclxuICB0aGlzLmx3b3JsZE9yZ1ggPSAwLjA7XHJcbiAgdGhpcy5sd29ybGRPcmdZID0gMC4wO1xyXG4gIHRoaXMubGRldmljZU9yZ1ggPSAwLjA7XHJcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IDAuMDtcclxuICB0aGlzLmx3b3JsZEV4dFggPSAxLjA7XHJcbiAgdGhpcy5sd29ybGRFeHRZID0gMS4wO1xyXG4gIHRoaXMubGRldmljZUV4dFggPSAxLjA7XHJcbiAgdGhpcy5sZGV2aWNlRXh0WSA9IDEuMDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubHdvcmxkT3JnWDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAod294KVxyXG57XHJcbiAgdGhpcy5sd29ybGRPcmdYID0gd294O1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmdldFdvcmxkT3JnWSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5sd29ybGRPcmdZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkT3JnWSA9IGZ1bmN0aW9uICh3b3kpXHJcbntcclxuICB0aGlzLmx3b3JsZE9yZ1kgPSB3b3k7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRFeHRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmx3b3JsZEV4dFg7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuc2V0V29ybGRFeHRYID0gZnVuY3Rpb24gKHdleClcclxue1xyXG4gIHRoaXMubHdvcmxkRXh0WCA9IHdleDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubHdvcmxkRXh0WTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAod2V5KVxyXG57XHJcbiAgdGhpcy5sd29ybGRFeHRZID0gd2V5O1xyXG59XHJcblxyXG4vKiBEZXZpY2UgcmVsYXRlZCAqL1xyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VPcmdYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdYO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1ggPSBmdW5jdGlvbiAoZG94KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlT3JnWCA9IGRveDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VPcmdZID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1kgPSBmdW5jdGlvbiAoZG95KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IGRveTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VFeHRYO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZUV4dFggPSBmdW5jdGlvbiAoZGV4KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlRXh0WCA9IGRleDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRZID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VFeHRZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZUV4dFkgPSBmdW5jdGlvbiAoZGV5KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlRXh0WSA9IGRleTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2Zvcm1YID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB2YXIgeERldmljZSA9IDAuMDtcclxuICB2YXIgd29ybGRFeHRYID0gdGhpcy5sd29ybGRFeHRYO1xyXG4gIGlmICh3b3JsZEV4dFggIT0gMC4wKVxyXG4gIHtcclxuICAgIHhEZXZpY2UgPSB0aGlzLmxkZXZpY2VPcmdYICtcclxuICAgICAgICAgICAgKCh4IC0gdGhpcy5sd29ybGRPcmdYKSAqIHRoaXMubGRldmljZUV4dFggLyB3b3JsZEV4dFgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHhEZXZpY2U7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUudHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdmFyIHlEZXZpY2UgPSAwLjA7XHJcbiAgdmFyIHdvcmxkRXh0WSA9IHRoaXMubHdvcmxkRXh0WTtcclxuICBpZiAod29ybGRFeHRZICE9IDAuMClcclxuICB7XHJcbiAgICB5RGV2aWNlID0gdGhpcy5sZGV2aWNlT3JnWSArXHJcbiAgICAgICAgICAgICgoeSAtIHRoaXMubHdvcmxkT3JnWSkgKiB0aGlzLmxkZXZpY2VFeHRZIC8gd29ybGRFeHRZKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4geURldmljZTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlVHJhbnNmb3JtWCA9IGZ1bmN0aW9uICh4KVxyXG57XHJcbiAgdmFyIHhXb3JsZCA9IDAuMDtcclxuICB2YXIgZGV2aWNlRXh0WCA9IHRoaXMubGRldmljZUV4dFg7XHJcbiAgaWYgKGRldmljZUV4dFggIT0gMC4wKVxyXG4gIHtcclxuICAgIHhXb3JsZCA9IHRoaXMubHdvcmxkT3JnWCArXHJcbiAgICAgICAgICAgICgoeCAtIHRoaXMubGRldmljZU9yZ1gpICogdGhpcy5sd29ybGRFeHRYIC8gZGV2aWNlRXh0WCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIHhXb3JsZDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlVHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdmFyIHlXb3JsZCA9IDAuMDtcclxuICB2YXIgZGV2aWNlRXh0WSA9IHRoaXMubGRldmljZUV4dFk7XHJcbiAgaWYgKGRldmljZUV4dFkgIT0gMC4wKVxyXG4gIHtcclxuICAgIHlXb3JsZCA9IHRoaXMubHdvcmxkT3JnWSArXHJcbiAgICAgICAgICAgICgoeSAtIHRoaXMubGRldmljZU9yZ1kpICogdGhpcy5sd29ybGRFeHRZIC8gZGV2aWNlRXh0WSk7XHJcbiAgfVxyXG4gIHJldHVybiB5V29ybGQ7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVBvaW50ID0gZnVuY3Rpb24gKGluUG9pbnQpXHJcbntcclxuICB2YXIgb3V0UG9pbnQgPVxyXG4gICAgICAgICAgbmV3IFBvaW50RCh0aGlzLmludmVyc2VUcmFuc2Zvcm1YKGluUG9pbnQueCksXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW52ZXJzZVRyYW5zZm9ybVkoaW5Qb2ludC55KSk7XHJcbiAgcmV0dXJuIG91dFBvaW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcclxuIiwiZnVuY3Rpb24gVW5pcXVlSURHZW5lcmV0b3IoKSB7XHJcbn1cclxuXHJcblVuaXF1ZUlER2VuZXJldG9yLmxhc3RJRCA9IDA7XHJcblxyXG5VbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICBpZiAoVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUob2JqKSkge1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgaWYgKG9iai51bmlxdWVJRCAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gb2JqLnVuaXF1ZUlEO1xyXG4gIH1cclxuICBvYmoudW5pcXVlSUQgPSBVbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcoKTtcclxuICBVbmlxdWVJREdlbmVyZXRvci5sYXN0SUQrKztcclxuICByZXR1cm4gb2JqLnVuaXF1ZUlEO1xyXG59XHJcblxyXG5VbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBpZiAoaWQgPT0gbnVsbClcclxuICAgIGlkID0gVW5pcXVlSURHZW5lcmV0b3IubGFzdElEO1xyXG4gIHJldHVybiBcIk9iamVjdCNcIiArIGlkICsgXCJcIjtcclxufVxyXG5cclxuVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xyXG4gIHJldHVybiBhcmcgPT0gbnVsbCB8fCAodHlwZSAhPSBcIm9iamVjdFwiICYmIHR5cGUgIT0gXCJmdW5jdGlvblwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVbmlxdWVJREdlbmVyZXRvcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGltZW5zaW9uRCA9IHJlcXVpcmUoJy4vRGltZW5zaW9uRCcpO1xudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcbnZhciBJbnRlZ2VyID0gcmVxdWlyZSgnLi9JbnRlZ2VyJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL1BvaW50Jyk7XG52YXIgUG9pbnREID0gcmVxdWlyZSgnLi9Qb2ludEQnKTtcbnZhciBSYW5kb21TZWVkID0gcmVxdWlyZSgnLi9SYW5kb21TZWVkJyk7XG52YXIgUmVjdGFuZ2xlRCA9IHJlcXVpcmUoJy4vUmVjdGFuZ2xlRCcpO1xudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XG52YXIgVW5pcXVlSURHZW5lcmV0b3IgPSByZXF1aXJlKCcuL1VuaXF1ZUlER2VuZXJldG9yJyk7XG52YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xudmFyIExFZGdlID0gcmVxdWlyZSgnLi9MRWRnZScpO1xudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcbnZhciBMYXlvdXQgPSByZXF1aXJlKCcuL0xheW91dCcpO1xudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXQgPSByZXF1aXJlKCcuL0ZETGF5b3V0Jyk7XG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XG52YXIgRkRMYXlvdXRFZGdlID0gcmVxdWlyZSgnLi9GRExheW91dEVkZ2UnKTtcbnZhciBGRExheW91dE5vZGUgPSByZXF1aXJlKCcuL0ZETGF5b3V0Tm9kZScpO1xudmFyIENvU0VDb25zdGFudHMgPSByZXF1aXJlKCcuL0NvU0VDb25zdGFudHMnKTtcbnZhciBDb1NFRWRnZSA9IHJlcXVpcmUoJy4vQ29TRUVkZ2UnKTtcbnZhciBDb1NFR3JhcGggPSByZXF1aXJlKCcuL0NvU0VHcmFwaCcpO1xudmFyIENvU0VHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvU0VHcmFwaE1hbmFnZXInKTtcbnZhciBDb1NFTGF5b3V0ID0gcmVxdWlyZSgnLi9Db1NFTGF5b3V0Jyk7XG52YXIgQ29TRU5vZGUgPSByZXF1aXJlKCcuL0NvU0VOb2RlJyk7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRyZWFkeWBcbiAgcmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRzdG9wYFxuICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gIH0sXG4gIC8vIGluY2x1ZGUgbGFiZWxzIGluIG5vZGUgZGltZW5zaW9uc1xuICBub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAvLyBudW1iZXIgb2YgdGlja3MgcGVyIGZyYW1lOyBoaWdoZXIgaXMgZmFzdGVyIGJ1dCBtb3JlIGplcmt5XG4gIHJlZnJlc2g6IDMwLFxuICAvLyBXaGV0aGVyIHRvIGZpdCB0aGUgbmV0d29yayB2aWV3IGFmdGVyIHdoZW4gZG9uZVxuICBmaXQ6IHRydWUsXG4gIC8vIFBhZGRpbmcgb24gZml0XG4gIHBhZGRpbmc6IDEwLFxuICAvLyBXaGV0aGVyIHRvIGVuYWJsZSBpbmNyZW1lbnRhbCBtb2RlXG4gIHJhbmRvbWl6ZTogdHJ1ZSxcbiAgLy8gTm9kZSByZXB1bHNpb24gKG5vbiBvdmVybGFwcGluZykgbXVsdGlwbGllclxuICBub2RlUmVwdWxzaW9uOiA0NTAwLFxuICAvLyBJZGVhbCBlZGdlIChub24gbmVzdGVkKSBsZW5ndGhcbiAgaWRlYWxFZGdlTGVuZ3RoOiA1MCxcbiAgLy8gRGl2aXNvciB0byBjb21wdXRlIGVkZ2UgZm9yY2VzXG4gIGVkZ2VFbGFzdGljaXR5OiAwLjQ1LFxuICAvLyBOZXN0aW5nIGZhY3RvciAobXVsdGlwbGllcikgdG8gY29tcHV0ZSBpZGVhbCBlZGdlIGxlbmd0aCBmb3IgbmVzdGVkIGVkZ2VzXG4gIG5lc3RpbmdGYWN0b3I6IDAuMSxcbiAgLy8gR3Jhdml0eSBmb3JjZSAoY29uc3RhbnQpXG4gIGdyYXZpdHk6IDAuMjUsXG4gIC8vIE1heGltdW0gbnVtYmVyIG9mIGl0ZXJhdGlvbnMgdG8gcGVyZm9ybVxuICBudW1JdGVyOiAyNTAwLFxuICAvLyBGb3IgZW5hYmxpbmcgdGlsaW5nXG4gIHRpbGU6IHRydWUsXG4gIC8vIFR5cGUgb2YgbGF5b3V0IGFuaW1hdGlvbi4gVGhlIG9wdGlvbiBzZXQgaXMgeydkdXJpbmcnLCAnZW5kJywgZmFsc2V9XG4gIGFuaW1hdGU6ICdlbmQnLFxuICAvLyBEdXJhdGlvbiBmb3IgYW5pbWF0ZTplbmRcbiAgYW5pbWF0aW9uRHVyYXRpb246IDUwMCxcbiAgLy93aGV0aGVyIHRvIHNob3cgaXRlcmF0aW9ucyBkdXJpbmcgYW5pbWF0aW9uXG4gIHNob3dBbmltYXRpb246IGZhbHNlLCBcbiAgLy8gUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHRoZSB2ZXJ0aWNhbCBzcGFjZSB0byBwdXQgYmV0d2VlbiB0aGUgemVybyBkZWdyZWUgbWVtYmVycyBkdXJpbmcgdGhlIHRpbGluZyBvcGVyYXRpb24oY2FuIGFsc28gYmUgYSBmdW5jdGlvbilcbiAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiAxMCxcbiAgLy8gUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHRoZSBob3Jpem9udGFsIHNwYWNlIHRvIHB1dCBiZXR3ZWVuIHRoZSB6ZXJvIGRlZ3JlZSBtZW1iZXJzIGR1cmluZyB0aGUgdGlsaW5nIG9wZXJhdGlvbihjYW4gYWxzbyBiZSBhIGZ1bmN0aW9uKVxuICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogMTAsXG4gIC8vIEdyYXZpdHkgcmFuZ2UgKGNvbnN0YW50KSBmb3IgY29tcG91bmRzXG4gIGdyYXZpdHlSYW5nZUNvbXBvdW5kOiAxLjUsXG4gIC8vIEdyYXZpdHkgZm9yY2UgKGNvbnN0YW50KSBmb3IgY29tcG91bmRzXG4gIGdyYXZpdHlDb21wb3VuZDogMS4wLFxuICAvLyBHcmF2aXR5IHJhbmdlIChjb25zdGFudClcbiAgZ3Jhdml0eVJhbmdlOiAzLjgsXG4gIC8vIEluaXRpYWwgY29vbGluZyBmYWN0b3IgZm9yIGluY3JlbWVudGFsIGxheW91dFxuICBpbml0aWFsRW5lcmd5T25JbmNyZW1lbnRhbDogMC41XG59O1xuXG5mdW5jdGlvbiBleHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpIHtcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGZvciAodmFyIGkgaW4gZGVmYXVsdHMpIHtcbiAgICBvYmpbaV0gPSBkZWZhdWx0c1tpXTtcbiAgfVxuXG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xuICAgIG9ialtpXSA9IG9wdGlvbnNbaV07XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxuZnVuY3Rpb24gX0NvU0VMYXlvdXQoX29wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBfb3B0aW9ucyk7XG4gIGdldFVzZXJPcHRpb25zKHRoaXMub3B0aW9ucyk7XG59XG5cbnZhciBnZXRVc2VyT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLm5vZGVSZXB1bHNpb24gIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEggPSBvcHRpb25zLm5vZGVSZXB1bHNpb247XG4gIGlmIChvcHRpb25zLmlkZWFsRWRnZUxlbmd0aCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPSBvcHRpb25zLmlkZWFsRWRnZUxlbmd0aDtcbiAgaWYgKG9wdGlvbnMuZWRnZUVsYXN0aWNpdHkgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9TUFJJTkdfU1RSRU5HVEggPSBvcHRpb25zLmVkZ2VFbGFzdGljaXR5O1xuICBpZiAob3B0aW9ucy5uZXN0aW5nRmFjdG9yICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5QRVJfTEVWRUxfSURFQUxfRURHRV9MRU5HVEhfRkFDVE9SID0gRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiA9IG9wdGlvbnMubmVzdGluZ0ZhY3RvcjtcbiAgaWYgKG9wdGlvbnMuZ3Jhdml0eSAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gb3B0aW9ucy5ncmF2aXR5O1xuICBpZiAob3B0aW9ucy5udW1JdGVyICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5NQVhfSVRFUkFUSU9OUyA9IEZETGF5b3V0Q29uc3RhbnRzLk1BWF9JVEVSQVRJT05TID0gb3B0aW9ucy5udW1JdGVyO1xuICBpZiAob3B0aW9ucy5ncmF2aXR5UmFuZ2UgIT0gbnVsbClcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SID0gb3B0aW9ucy5ncmF2aXR5UmFuZ2U7XG4gIGlmKG9wdGlvbnMuZ3Jhdml0eUNvbXBvdW5kICE9IG51bGwpXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEggPSBvcHRpb25zLmdyYXZpdHlDb21wb3VuZDtcbiAgaWYob3B0aW9ucy5ncmF2aXR5UmFuZ2VDb21wb3VuZCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBvcHRpb25zLmdyYXZpdHlSYW5nZUNvbXBvdW5kO1xuICBpZiAob3B0aW9ucy5pbml0aWFsRW5lcmd5T25JbmNyZW1lbnRhbCAhPSBudWxsKVxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9DT09MSU5HX0ZBQ1RPUl9JTkNSRU1FTlRBTCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09PTElOR19GQUNUT1JfSU5DUkVNRU5UQUwgPSBvcHRpb25zLmluaXRpYWxFbmVyZ3lPbkluY3JlbWVudGFsO1xuXG4gIENvU0VDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gRkRMYXlvdXRDb25zdGFudHMuTk9ERV9ESU1FTlNJT05TX0lOQ0xVREVfTEFCRUxTID0gTGF5b3V0Q29uc3RhbnRzLk5PREVfRElNRU5TSU9OU19JTkNMVURFX0xBQkVMUyA9IG9wdGlvbnMubm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzO1xuICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPVxuICAgICAgICAgICEob3B0aW9ucy5yYW5kb21pemUpO1xuICBDb1NFQ29uc3RhbnRzLkFOSU1BVEUgPSBGRExheW91dENvbnN0YW50cy5BTklNQVRFID0gTGF5b3V0Q29uc3RhbnRzLkFOSU1BVEUgPSBvcHRpb25zLmFuaW1hdGU7XG4gIENvU0VDb25zdGFudHMuVElMRSA9IG9wdGlvbnMudGlsZTtcbiAgQ29TRUNvbnN0YW50cy5USUxJTkdfUEFERElOR19WRVJUSUNBTCA9IFxuICAgICAgICAgIHR5cGVvZiBvcHRpb25zLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsLmNhbGwoKSA6IG9wdGlvbnMudGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICBDb1NFQ29uc3RhbnRzLlRJTElOR19QQURESU5HX0hPUklaT05UQUwgPSBcbiAgICAgICAgICB0eXBlb2Ygb3B0aW9ucy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGlsaW5nUGFkZGluZ0hvcml6b250YWwuY2FsbCgpIDogb3B0aW9ucy50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDtcbn07XG5cbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZWFkeTtcbiAgdmFyIGZyYW1lSWQ7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB2YXIgaWRUb0xOb2RlID0gdGhpcy5pZFRvTE5vZGUgPSB7fTtcbiAgdmFyIGxheW91dCA9IHRoaXMubGF5b3V0ID0gbmV3IENvU0VMYXlvdXQoKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgc2VsZi5zdG9wcGVkID0gZmFsc2U7XG5cbiAgdGhpcy5jeSA9IHRoaXMub3B0aW9ucy5jeTtcblxuICB0aGlzLmN5LnRyaWdnZXIoeyB0eXBlOiAnbGF5b3V0c3RhcnQnLCBsYXlvdXQ6IHRoaXMgfSk7XG5cbiAgdmFyIGdtID0gbGF5b3V0Lm5ld0dyYXBoTWFuYWdlcigpO1xuICB0aGlzLmdtID0gZ207XG5cbiAgdmFyIG5vZGVzID0gdGhpcy5vcHRpb25zLmVsZXMubm9kZXMoKTtcbiAgdmFyIGVkZ2VzID0gdGhpcy5vcHRpb25zLmVsZXMuZWRnZXMoKTtcblxuICB0aGlzLnJvb3QgPSBnbS5hZGRSb290KCk7XG4gIHRoaXMucHJvY2Vzc0NoaWxkcmVuTGlzdCh0aGlzLnJvb3QsIHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKSwgbGF5b3V0KTtcblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgIHZhciBzb3VyY2VOb2RlID0gdGhpcy5pZFRvTE5vZGVbZWRnZS5kYXRhKFwic291cmNlXCIpXTtcbiAgICB2YXIgdGFyZ2V0Tm9kZSA9IHRoaXMuaWRUb0xOb2RlW2VkZ2UuZGF0YShcInRhcmdldFwiKV07XG4gICAgaWYoc291cmNlTm9kZS5nZXRFZGdlc0JldHdlZW4odGFyZ2V0Tm9kZSkubGVuZ3RoID09IDApe1xuICAgICAgdmFyIGUxID0gZ20uYWRkKGxheW91dC5uZXdFZGdlKCksIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpO1xuICAgICAgZTEuaWQgPSBlZGdlLmlkKCk7XG4gICAgfVxuICB9XG4gIFxuICAgdmFyIGdldFBvc2l0aW9ucyA9IGZ1bmN0aW9uKGVsZSwgaSl7XG4gICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlID0gaTtcbiAgICB9XG4gICAgdmFyIHRoZUlkID0gZWxlLmRhdGEoJ2lkJyk7XG4gICAgdmFyIGxOb2RlID0gc2VsZi5pZFRvTE5vZGVbdGhlSWRdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGxOb2RlLmdldFJlY3QoKS5nZXRDZW50ZXJYKCksXG4gICAgICB5OiBsTm9kZS5nZXRSZWN0KCkuZ2V0Q2VudGVyWSgpXG4gICAgfTtcbiAgfTtcbiAgXG4gIC8qXG4gICAqIFJlcG9zaXRpb24gbm9kZXMgaW4gaXRlcmF0aW9ucyBhbmltYXRlZGx5XG4gICAqL1xuICB2YXIgaXRlcmF0ZUFuaW1hdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaWdzIHRvIHBlcmZvcm0gYWZ0ZXIgbm9kZXMgYXJlIHJlcG9zaXRpb25lZCBvbiBzY3JlZW5cbiAgICB2YXIgYWZ0ZXJSZXBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAob3B0aW9ucy5maXQpIHtcbiAgICAgICAgb3B0aW9ucy5jeS5maXQob3B0aW9ucy5lbGVzLm5vZGVzKCksIG9wdGlvbnMucGFkZGluZyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVhZHkpIHtcbiAgICAgICAgcmVhZHkgPSB0cnVlO1xuICAgICAgICBzZWxmLmN5Lm9uZSgnbGF5b3V0cmVhZHknLCBvcHRpb25zLnJlYWR5KTtcbiAgICAgICAgc2VsZi5jeS50cmlnZ2VyKHt0eXBlOiAnbGF5b3V0cmVhZHknLCBsYXlvdXQ6IHNlbGZ9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIHZhciB0aWNrc1BlckZyYW1lID0gc2VsZi5vcHRpb25zLnJlZnJlc2g7XG4gICAgdmFyIGlzRG9uZTtcblxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGlja3NQZXJGcmFtZSAmJiAhaXNEb25lOyBpKysgKXtcbiAgICAgIGlzRG9uZSA9IHNlbGYuc3RvcHBlZCB8fCBzZWxmLmxheW91dC50aWNrKCk7XG4gICAgfVxuICAgIFxuICAgIC8vIElmIGxheW91dCBpcyBkb25lXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgLy8gSWYgdGhlIGxheW91dCBpcyBub3QgYSBzdWJsYXlvdXQgYW5kIGl0IGlzIHN1Y2Nlc3NmdWwgcGVyZm9ybSBwb3N0IGxheW91dC5cbiAgICAgIGlmIChsYXlvdXQuY2hlY2tMYXlvdXRTdWNjZXNzKCkgJiYgIWxheW91dC5pc1N1YkxheW91dCkge1xuICAgICAgICBsYXlvdXQuZG9Qb3N0TGF5b3V0KCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIElmIGxheW91dCBoYXMgYSB0aWxpbmdQb3N0TGF5b3V0IGZ1bmN0aW9uIHByb3BlcnR5IGNhbGwgaXQuXG4gICAgICBpZiAobGF5b3V0LnRpbGluZ1Bvc3RMYXlvdXQpIHtcbiAgICAgICAgbGF5b3V0LnRpbGluZ1Bvc3RMYXlvdXQoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGF5b3V0LmlzTGF5b3V0RmluaXNoZWQgPSB0cnVlO1xuICAgICAgXG4gICAgICBzZWxmLm9wdGlvbnMuZWxlcy5ub2RlcygpLnBvc2l0aW9ucyhnZXRQb3NpdGlvbnMpO1xuICAgICAgXG4gICAgICBhZnRlclJlcG9zaXRpb24oKTtcbiAgICAgIFxuICAgICAgLy8gdHJpZ2dlciBsYXlvdXRzdG9wIHdoZW4gdGhlIGxheW91dCBzdG9wcyAoZS5nLiBmaW5pc2hlcylcbiAgICAgIHNlbGYuY3kub25lKCdsYXlvdXRzdG9wJywgc2VsZi5vcHRpb25zLnN0b3ApO1xuICAgICAgc2VsZi5jeS50cmlnZ2VyKHsgdHlwZTogJ2xheW91dHN0b3AnLCBsYXlvdXQ6IHNlbGYgfSk7XG5cbiAgICAgIGlmIChmcmFtZUlkKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGZyYW1lSWQpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZWFkeSA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB2YXIgYW5pbWF0aW9uRGF0YSA9IHNlbGYubGF5b3V0LmdldFBvc2l0aW9uc0RhdGEoKTsgLy8gR2V0IHBvc2l0aW9ucyBvZiBsYXlvdXQgbm9kZXMgbm90ZSB0aGF0IGFsbCBub2RlcyBtYXkgbm90IGJlIGxheW91dCBub2RlcyBiZWNhdXNlIG9mIHRpbGluZ1xuICAgIHZhciBlZGdlRGF0YSA9IHNlbGYubGF5b3V0LmdldEVkZ2VzRGF0YSgpO1xuICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnc2VuZCcsIHsnZGV0YWlsJzogW2FuaW1hdGlvbkRhdGEsIGVkZ2VEYXRhXX0pO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTsgXG4gICAgXG4gICAgaWYob3B0aW9ucy5zaG93QW5pbWF0aW9uKXtcbiAgICAgIC8vIFBvc2l0aW9uIG5vZGVzLCBmb3IgdGhlIG5vZGVzIHdob3NlIGlkIGRvZXMgbm90IGluY2x1ZGVkIGluIGRhdGEgKGJlY2F1c2UgdGhleSBhcmUgcmVtb3ZlZCBmcm9tIHRoZWlyIHBhcmVudHMgYW5kIGluY2x1ZGVkIGluIGR1bW15IGNvbXBvdW5kcylcbiAgICAgIC8vIHVzZSBwb3NpdGlvbiBvZiB0aGVpciBhbmNlc3RvcnMgb3IgZHVtbXkgYW5jZXN0b3JzXG4gICAgICBvcHRpb25zLmVsZXMubm9kZXMoKS5wb3NpdGlvbnMoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRoZUlkID0gZWxlLmlkKCk7XG4gICAgICAgIHZhciBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGhlSWRdO1xuICAgICAgICB2YXIgdGVtcCA9IGVsZTtcbiAgICAgICAgLy8gSWYgcE5vZGUgaXMgdW5kZWZpbmVkIHNlYXJjaCB1bnRpbCBmaW5kaW5nIHBvc2l0aW9uIGRhdGEgb2YgaXRzIGZpcnN0IGFuY2VzdG9yIChJdCBtYXkgYmUgZHVtbXkgYXMgd2VsbClcbiAgICAgICAgd2hpbGUgKHBOb2RlID09IG51bGwpIHtcbiAgICAgICAgICBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGVtcC5kYXRhKCdwYXJlbnQnKV0gfHwgYW5pbWF0aW9uRGF0YVsnRHVtbXlDb21wb3VuZF8nICsgdGVtcC5kYXRhKCdwYXJlbnQnKV07XG4gICAgICAgICAgYW5pbWF0aW9uRGF0YVt0aGVJZF0gPSBwTm9kZTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wYXJlbnQoKVswXTtcbiAgICAgICAgICBpZih0ZW1wID09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYocE5vZGUgIT0gbnVsbCl7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHBOb2RlLngsXG4gICAgICAgICAgICB5OiBwTm9kZS55XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlbGUueCxcbiAgICAgICAgICAgIHk6IGVsZS55XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGFmdGVyUmVwb3NpdGlvbigpO1xuXG4gICAgZnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShpdGVyYXRlQW5pbWF0ZWQpO1xuICB9O1xuICBcbiAgLypcbiAgKiBMaXN0ZW4gJ2xheW91dHN0YXJ0ZWQnIGV2ZW50IGFuZCBzdGFydCBhbmltYXRlZCBpdGVyYXRpb24gaWYgYW5pbWF0ZSBvcHRpb24gaXMgJ2R1cmluZydcbiAgKi9cbiAgbGF5b3V0LmFkZExpc3RlbmVyKCdsYXlvdXRzdGFydGVkJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLm9wdGlvbnMuYW5pbWF0ZSA9PT0gJ2R1cmluZycpIHtcbiAgICAgIGZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaXRlcmF0ZUFuaW1hdGVkKTtcbiAgICB9XG4gIH0pO1xuICBcbiAgbGF5b3V0LnJ1bkxheW91dCgpOyAvLyBSdW4gY29zZSBsYXlvdXRcbiAgXG4gIC8qXG4gICAqIElmIGFuaW1hdGUgb3B0aW9uIGlzIG5vdCAnZHVyaW5nJyAoJ2VuZCcgb3IgZmFsc2UpIHBlcmZvcm0gdGhlc2UgaGVyZSAoSWYgaXQgaXMgJ2R1cmluZycgc2ltaWxhciB0aGluZ3MgYXJlIGFscmVhZHkgcGVyZm9ybWVkKVxuICAgKi9cbiAgaWYodGhpcy5vcHRpb25zLmFuaW1hdGUgIT09IFwiZHVyaW5nXCIpe1xuICAgIHNlbGYub3B0aW9ucy5lbGVzLm5vZGVzKCkubm90KFwiOnBhcmVudFwiKS5sYXlvdXRQb3NpdGlvbnMoc2VsZiwgc2VsZi5vcHRpb25zLCBnZXRQb3NpdGlvbnMpOyAvLyBVc2UgbGF5b3V0IHBvc2l0aW9ucyB0byByZXBvc2l0aW9uIHRoZSBub2RlcyBpdCBjb25zaWRlcnMgdGhlIG9wdGlvbnMgcGFyYW1ldGVyXG4gICAgcmVhZHkgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xufTtcblxuLy9HZXQgdGhlIHRvcCBtb3N0IG9uZXMgb2YgYSBsaXN0IG9mIG5vZGVzXG5fQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0VG9wTW9zdE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgdmFyIG5vZGVzTWFwID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcbiAgfVxuICB2YXIgcm9vdHMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGUgPSBpO1xuICAgICAgfVxuICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcbiAgICAgIHdoaWxlKHBhcmVudCAhPSBudWxsKXtcbiAgICAgICAgaWYobm9kZXNNYXBbcGFyZW50LmlkKCldKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiByb290cztcbn07XG5cbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5wcm9jZXNzQ2hpbGRyZW5MaXN0ID0gZnVuY3Rpb24gKHBhcmVudCwgY2hpbGRyZW4sIGxheW91dCkge1xuICB2YXIgc2l6ZSA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICB2YXIgdGhlQ2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICB2YXIgY2hpbGRyZW5fb2ZfY2hpbGRyZW4gPSB0aGVDaGlsZC5jaGlsZHJlbigpO1xuICAgIHZhciB0aGVOb2RlOyAgICBcblxuLy8gICAgdmFyIGRpbWVuc2lvbnMgPSB0aGVDaGlsZC5sYXlvdXREaW1lbnNpb25zKHtcbi8vICAgICAgbm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzOiB0aGlzLm9wdGlvbnMubm9kZURpbWVuc2lvbnNJbmNsdWRlTGFiZWxzXG4vLyAgICB9KTtcblxuICAgIGlmICh0aGVDaGlsZC5vdXRlcldpZHRoKCkgIT0gbnVsbFxuICAgICAgICAgICAgJiYgdGhlQ2hpbGQub3V0ZXJIZWlnaHQoKSAhPSBudWxsKSB7XG4gICAgICB0aGVOb2RlID0gcGFyZW50LmFkZChuZXcgQ29TRU5vZGUobGF5b3V0LmdyYXBoTWFuYWdlcixcbiAgICAgICAgICAgICAgbmV3IFBvaW50RCh0aGVDaGlsZC5wb3NpdGlvbigneCcpIC0gdGhlQ2hpbGQub3V0ZXJXaWR0aCgpIC8gMiwgdGhlQ2hpbGQucG9zaXRpb24oJ3knKSAtIHRoZUNoaWxkLm91dGVySGVpZ2h0KCkgLyAyKSxcbiAgICAgICAgICAgICAgbmV3IERpbWVuc2lvbkQocGFyc2VGbG9hdCh0aGVDaGlsZC5vdXRlcldpZHRoKCkpLCBwYXJzZUZsb2F0KHRoZUNoaWxkLm91dGVySGVpZ2h0KCkpKSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoZU5vZGUgPSBwYXJlbnQuYWRkKG5ldyBDb1NFTm9kZSh0aGlzLmdyYXBoTWFuYWdlcikpO1xuICAgIH1cbiAgICAvLyBBdHRhY2ggaWQgdG8gdGhlIGxheW91dCBub2RlXG4gICAgdGhlTm9kZS5pZCA9IHRoZUNoaWxkLmRhdGEoXCJpZFwiKTtcbiAgICAvLyBBdHRhY2ggdGhlIHBhZGRpbmdzIG9mIGN5IG5vZGUgdG8gbGF5b3V0IG5vZGVcbiAgICB0aGVOb2RlLnBhZGRpbmdMZWZ0ID0gcGFyc2VJbnQoIHRoZUNoaWxkLmNzcygncGFkZGluZycpICk7XG4gICAgdGhlTm9kZS5wYWRkaW5nVG9wID0gcGFyc2VJbnQoIHRoZUNoaWxkLmNzcygncGFkZGluZycpICk7XG4gICAgdGhlTm9kZS5wYWRkaW5nUmlnaHQgPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICB0aGVOb2RlLnBhZGRpbmdCb3R0b20gPSBwYXJzZUludCggdGhlQ2hpbGQuY3NzKCdwYWRkaW5nJykgKTtcbiAgICBcbiAgICAvL0F0dGFjaCB0aGUgbGFiZWwgcHJvcGVydGllcyB0byBjb21wb3VuZCBpZiBsYWJlbHMgd2lsbCBiZSBpbmNsdWRlZCBpbiBub2RlIGRpbWVuc2lvbnMgIFxuICAgIGlmKHRoaXMub3B0aW9ucy5ub2RlRGltZW5zaW9uc0luY2x1ZGVMYWJlbHMpe1xuICAgICAgaWYodGhlQ2hpbGQuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgdmFyIGxhYmVsV2lkdGggPSB0aGVDaGlsZC5ib3VuZGluZ0JveCh7IGluY2x1ZGVMYWJlbHM6IHRydWUsIGluY2x1ZGVOb2RlczogZmFsc2UgfSkudzsgICAgICAgICAgXG4gICAgICAgICAgdmFyIGxhYmVsSGVpZ2h0ID0gdGhlQ2hpbGQuYm91bmRpbmdCb3goeyBpbmNsdWRlTGFiZWxzOiB0cnVlLCBpbmNsdWRlTm9kZXM6IGZhbHNlIH0pLmg7XG4gICAgICAgICAgdmFyIGxhYmVsUG9zID0gdGhlQ2hpbGQuY3NzKFwidGV4dC1oYWxpZ25cIik7XG4gICAgICAgICAgdGhlTm9kZS5sYWJlbFdpZHRoID0gbGFiZWxXaWR0aDtcbiAgICAgICAgICB0aGVOb2RlLmxhYmVsSGVpZ2h0ID0gbGFiZWxIZWlnaHQ7XG4gICAgICAgICAgdGhlTm9kZS5sYWJlbFBvcyA9IGxhYmVsUG9zO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBNYXAgdGhlIGxheW91dCBub2RlXG4gICAgdGhpcy5pZFRvTE5vZGVbdGhlQ2hpbGQuZGF0YShcImlkXCIpXSA9IHRoZU5vZGU7XG5cbiAgICBpZiAoaXNOYU4odGhlTm9kZS5yZWN0LngpKSB7XG4gICAgICB0aGVOb2RlLnJlY3QueCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGlzTmFOKHRoZU5vZGUucmVjdC55KSkge1xuICAgICAgdGhlTm9kZS5yZWN0LnkgPSAwO1xuICAgIH1cblxuICAgIGlmIChjaGlsZHJlbl9vZl9jaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuX29mX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciB0aGVOZXdHcmFwaDtcbiAgICAgIHRoZU5ld0dyYXBoID0gbGF5b3V0LmdldEdyYXBoTWFuYWdlcigpLmFkZChsYXlvdXQubmV3R3JhcGgoKSwgdGhlTm9kZSk7XG4gICAgICB0aGlzLnByb2Nlc3NDaGlsZHJlbkxpc3QodGhlTmV3R3JhcGgsIGNoaWxkcmVuX29mX2NoaWxkcmVuLCBsYXlvdXQpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBAYnJpZWYgOiBjYWxsZWQgb24gY29udGludW91cyBsYXlvdXRzIHRvIHN0b3AgdGhlbSBiZWZvcmUgdGhleSBmaW5pc2hcbiAqL1xuX0NvU0VMYXlvdXQucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc3RvcHBlZCA9IHRydWU7XG5cbiAgcmV0dXJuIHRoaXM7IC8vIGNoYWluaW5nXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldChjeXRvc2NhcGUpIHtcbiAgcmV0dXJuIF9Db1NFTGF5b3V0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIHJlZ2lzdGVycyB0aGUgZXh0ZW5zaW9uIG9uIGEgY3l0b3NjYXBlIGxpYiByZWZcclxudmFyIGdldExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XHJcblxyXG52YXIgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XHJcbiAgdmFyIExheW91dCA9IGdldExheW91dCggY3l0b3NjYXBlICk7XHJcblxyXG4gIGN5dG9zY2FwZSgnbGF5b3V0JywgJ2Nvc2UtYmlsa2VudCcsIExheW91dCk7XHJcbn07XHJcblxyXG4vLyBhdXRvIHJlZyBmb3IgZ2xvYmFsc1xyXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXtcclxuICByZWdpc3RlciggY3l0b3NjYXBlICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XHJcbiJdfQ==
