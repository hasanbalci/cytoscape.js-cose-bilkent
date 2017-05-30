(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cytoscapeCoseBilkent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FDLayoutConstants = require('./FDLayoutConstants');

function CoSEConstants() {
}

//CoSEConstants inherits static props in FDLayoutConstants
for (var prop in FDLayoutConstants) {
  CoSEConstants[prop] = FDLayoutConstants[prop];
}

CoSEConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = false;
CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
CoSEConstants.DEFAULT_COMPONENT_SEPERATION = 60;
CoSEConstants.COMPLEX_MEM_HORIZONTAL_BUFFER = 5;
CoSEConstants.COMPLEX_MEM_VERTICAL_BUFFER = 5;
CoSEConstants.COMPLEX_MEM_MARGIN = 20;

module.exports = CoSEConstants;

},{"./FDLayoutConstants":10}],2:[function(require,module,exports){
var FDLayoutEdge = require('./FDLayoutEdge');

function CoSEEdge(source, target, vEdge) {
  FDLayoutEdge.call(this, source, target, vEdge);
}

CoSEEdge.prototype = Object.create(FDLayoutEdge.prototype);
for (var prop in FDLayoutEdge) {
  CoSEEdge[prop] = FDLayoutEdge[prop];
}

module.exports = CoSEEdge

},{"./FDLayoutEdge":11}],3:[function(require,module,exports){
var LGraph = require('./LGraph');

function CoSEGraph(parent, graphMgr, vGraph) {
  LGraph.call(this, parent, graphMgr, vGraph);
}

CoSEGraph.prototype = Object.create(LGraph.prototype);
for (var prop in LGraph) {
  CoSEGraph[prop] = LGraph[prop];
}

module.exports = CoSEGraph;

},{"./LGraph":19}],4:[function(require,module,exports){
var LGraphManager = require('./LGraphManager');

function CoSEGraphManager(layout) {
  LGraphManager.call(this, layout);
}

CoSEGraphManager.prototype = Object.create(LGraphManager.prototype);
for (var prop in LGraphManager) {
  CoSEGraphManager[prop] = LGraphManager[prop];
}

module.exports = CoSEGraphManager;

},{"./LGraphManager":20}],5:[function(require,module,exports){
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
var HashMap = require('./HashMap');

function CoSELayout() {
  FDLayout.call(this);
  
  this.childGraphMap = new HashMap();
  this.complexOrder = [];
  this.dummyComplexList = [];
  this.emptiedDummyComplexMap = new HashMap();
  this.memberPackMap = new HashMap();
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
    if (CoSEConstants.DEFAULT_EDGE_LENGTH < 10)
    {
      this.idealEdgeLength = 10;
    }
    else
    {
      this.idealEdgeLength = CoSEConstants.DEFAULT_EDGE_LENGTH;
    }

    this.useSmartIdealEdgeLengthCalculation =
            CoSEConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION;
    this.springConstant =
            FDLayoutConstants.DEFAULT_SPRING_STRENGTH;
    this.repulsionConstant =
            FDLayoutConstants.DEFAULT_REPULSION_STRENGTH;
    this.gravityConstant =
            FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH;
    this.compoundGravityConstant =
            FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH;
    this.gravityRangeFactor =
            FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR;
    this.compoundGravityRangeFactor =
            FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR;
  }
};

CoSELayout.prototype.layout = function () {
  // pre-layout step for tiling
  this.groupZeroDegreeMembers();
  this.applyDFSOnComplexes();
  
  // original cose layout
  var createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
  if (createBendsAsNeeded)
  {
    this.createBendpoints();
    this.graphManager.resetAllEdges();
  }

  this.level = 0;
  var retVal = this.classicLayout();
  
  // post layout step for tiling
  this.repopulateComplexes();
  
  return retVal;
};

CoSELayout.prototype.classicLayout = function () {
  this.calculateNodesToApplyGravitationTo();
  this.graphManager.calcLowestCommonAncestors();
  this.graphManager.calcInclusionTreeDepths();
  this.graphManager.getRoot().calcEstimatedSize();
  this.calcIdealEdgeLengths();
  if (!this.incremental)
  {
    var forest = this.getFlatForest();

    // The graph associated with this layout is flat and a forest
    if (forest.length > 0)

    {
      this.positionNodesRadially(forest);
    }
    // The graph associated with this layout is not flat or a forest
    else
    {
      this.positionNodesRandomly();
    }
  }

  this.initSpringEmbedder();
  this.runSpringEmbedder();

  return true;
};

CoSELayout.prototype.tick = function() {
  this.totalIterations++;
  
  if (this.totalIterations === this.maxIterations) {
    return true; // Layout is not ended return true
  }
  
  if (this.totalIterations % FDLayoutConstants.CONVERGENCE_CHECK_PERIOD == 0)
  {
    if (this.isConverged())
    {
      return true; // Layout is not ended return true
    }

    this.coolingFactor = this.initialCoolingFactor *
            ((this.maxIterations - this.totalIterations) / this.maxIterations);
    this.animationPeriod = Math.ceil(this.initialAnimationPeriod * Math.sqrt(this.coolingFactor));

  }
  this.totalDisplacement = 0;
  this.graphManager.updateBounds();
  this.calcSpringForces();
  this.calcRepulsionForces();
  this.calcGravitationalForces();
  this.moveNodes();
  this.animate();
  
  return false; // Layout is not ended yet return false
};

CoSELayout.prototype.getPositionsData = function() {
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
      h: rect.height
    };
  }
  
  return pData;
};

CoSELayout.prototype.runSpringEmbedder = function () {
  this.initialAnimationPeriod = 25;
  this.animationPeriod = this.initialAnimationPeriod;
  var layoutEnded = false;
  
  // If aminate option is 'during' signal that layout is supposed to start iterating
  if ( FDLayoutConstants.ANIMATE === 'during' ) {
    this.emit('layoutstarted');
  }
  else {
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
  for (i = 0; i < size; i++)
  {
    graph = graphs[i];

    graph.updateConnected();

    if (!graph.isConnected)
    {
      nodeList = nodeList.concat(graph.getNodes());
    }
  }

  this.graphManager.setAllNodesToApplyGravitation(nodeList);
};

CoSELayout.prototype.createBendpoints = function () {
  var edges = [];
  edges = edges.concat(this.graphManager.getAllEdges());
  var visited = new HashSet();
  var i;
  for (i = 0; i < edges.length; i++)
  {
    var edge = edges[i];

    if (!visited.contains(edge))
    {
      var source = edge.getSource();
      var target = edge.getTarget();

      if (source == target)
      {
        edge.getBendpoints().push(new PointD());
        edge.getBendpoints().push(new PointD());
        this.createDummyNodesForBendpoints(edge);
        visited.add(edge);
      }
      else
      {
        var edgeList = [];

        edgeList = edgeList.concat(source.getEdgeListToNode(target));
        edgeList = edgeList.concat(target.getEdgeListToNode(source));

        if (!visited.contains(edgeList[0]))
        {
          if (edgeList.length > 1)
          {
            var k;
            for (k = 0; k < edgeList.length; k++)
            {
              var multiEdge = edgeList[k];
              multiEdge.getBendpoints().push(new PointD());
              this.createDummyNodesForBendpoints(multiEdge);
            }
          }
          visited.addAll(list);
        }
      }
    }

    if (visited.size() == edges.length)
    {
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

  for (var i = 0; i < forest.length; i++)
  {
    if (i % numberOfColumns == 0)
    {
      // Start of a new row, make the x coordinate 0, increment the
      // y coordinate with the max height of the previous row
      currentX = 0;
      currentY = height;

      if (i != 0)
      {
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
    point =
            CoSELayout.radialLayout(tree, centerNode, currentStartingPoint);

    if (point.y > height)
    {
      height = Math.floor(point.y);
    }

    currentX = Math.floor(point.x + CoSEConstants.DEFAULT_COMPONENT_SEPERATION);
  }

  this.transform(
          new PointD(LayoutConstants.WORLD_CENTER_X - point.x / 2,
                  LayoutConstants.WORLD_CENTER_Y - point.y / 2));
};

CoSELayout.radialLayout = function (tree, centerNode, startingPoint) {
  var radialSep = Math.max(this.maxDiagonalInTree(tree),
          CoSEConstants.DEFAULT_RADIAL_SEPARATION);
  CoSELayout.branchRadialLayout(centerNode, null, 0, 359, 0, radialSep);
  var bounds = LGraph.calculateBounds(tree);

  var transform = new Transform();
  transform.setDeviceOrgX(bounds.getMinX());
  transform.setDeviceOrgY(bounds.getMinY());
  transform.setWorldOrgX(startingPoint.x);
  transform.setWorldOrgY(startingPoint.y);

  for (var i = 0; i < tree.length; i++)
  {
    var node = tree[i];
    node.transform(transform);
  }

  var bottomRight =
          new PointD(bounds.getMaxX(), bounds.getMaxY());

  return transform.inverseTransformPoint(bottomRight);
};

CoSELayout.branchRadialLayout = function (node, parentOfNode, startAngle, endAngle, distance, radialSeparation) {
  // First, position this node by finding its angle.
  var halfInterval = ((endAngle - startAngle) + 1) / 2;

  if (halfInterval < 0)
  {
    halfInterval += 180;
  }

  var nodeAngle = (halfInterval + startAngle) % 360;
  var teta = (nodeAngle * IGeometry.TWO_PI) / 360;

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

  if (parentOfNode != null)
  {
    childCount--;
  }

  var branchCount = 0;

  var incEdgesCount = neighborEdges.length;
  var startIndex;

  var edges = node.getEdgesBetween(parentOfNode);

  // If there are multiple edges, prune them until there remains only one
  // edge.
  while (edges.length > 1)
  {
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

  if (parentOfNode != null)
  {
    //assert edges.length == 1;
    startIndex = (neighborEdges.indexOf(edges[0]) + 1) % incEdgesCount;
  }
  else
  {
    startIndex = 0;
  }

  var stepAngle = Math.abs(endAngle - startAngle) / childCount;

  for (var i = startIndex;
          branchCount != childCount;
          i = (++i) % incEdgesCount)
  {
    var currentNeighbor =
            neighborEdges[i].getOtherEnd(node);

    // Don't back traverse to root node in current tree.
    if (currentNeighbor == parentOfNode)
    {
      continue;
    }

    var childStartAngle =
            (startAngle + branchCount * stepAngle) % 360;
    var childEndAngle = (childStartAngle + stepAngle) % 360;

    CoSELayout.branchRadialLayout(currentNeighbor,
            node,
            childStartAngle, childEndAngle,
            distance + radialSeparation, radialSeparation);

    branchCount++;
  }
};

CoSELayout.maxDiagonalInTree = function (tree) {
  var maxDiagonal = Integer.MIN_VALUE;

  for (var i = 0; i < tree.length; i++)
  {
    var node = tree[i];
    var diagonal = node.getDiagonal();

    if (diagonal > maxDiagonal)
    {
      maxDiagonal = diagonal;
    }
  }

  return maxDiagonal;
};

CoSELayout.prototype.calcRepulsionRange = function () {
  // formula is 2 x (level + 1) x idealEdgeLength
  return (2 * (this.level + 1) * this.idealEdgeLength);
};

// Section: Tiling Methods

/**
 * This method finds all the zero degree nodes in the graph which are not
 * owned by a complex node. Zero degree nodes at each level are grouped
 * together and placed inside a dummy complex to reduce bounds of root
 * graph.
 */
CoSELayout.prototype.groupZeroDegreeMembers = function () {
  var childComplexMap = new HashMap();
  var self = this;
  this.getGraphManager().getGraphs().forEach(function (ownerGraph) {
    var zeroDegreeNodes = [];

    // do not process complex nodes (their members are already owned)
    if (ownerGraph.getParent().type != null && ownerGraph.getParent().isComplex()) {
      return;
    }

    ownerGraph.getNodes().forEach(function (node) {

      if (self.calcGraphDegree(node) === 0)
      {
        zeroDegreeNodes.push(node);
      }
    });

    if (zeroDegreeNodes.length > 1)
    {
      // create a new dummy complex
      var complex = self.newNode(null);
      // TODO revise this
      //complex.type = SbgnPDConstants.COMPLEX;
      complex.label = "DummyComplex_" + ownerGraph.getParent().label;

      ownerGraph.add(complex);

      var childGraph = self.newGraph(null);

      zeroDegreeNodes.forEach(function (zeroNode) {
        ownerGraph.remove(zeroNode);
        childGraph.add(zeroNode);
      });
      
      self.dummyComplexList.push(complex);
      childComplexMap.put(complex, childGraph);
    }
  });

  this.dummyComplexList.forEach(function (complex) {
    self.graphManager.add(childComplexMap.get(complex), complex);
  });

  this.getGraphManager().updateBounds();

  this.graphManager.resetAllNodes();
  this.graphManager.resetAllNodesToApplyGravitation();
  this.graphManager.resetAllEdges();
  this.calculateNodesToApplyGravitationTo();
};

/**
 * This method searched unmarked complex nodes recursively, because they may
 * contain complex children. After the order is found, child graphs of each
 * complex node are cleared.
 */
CoSELayout.prototype.applyDFSOnComplexes = function ()
{
  var self = this;
  // LGraph>();
  this.getAllNodes().forEach(function (comp) {
    if (!comp.isComplex || !comp.isComplex()) {
      return;
    }

    // complex is found, recurse on it until no visited complex remains.
    if (!comp.visited)
      self.DFSVisitComplex(comp);
  });

  // clear each complex
  this.complexOrder.forEach(function (comp) {
    self.clearComplex(comp);
  });

  this.getGraphManager().updateBounds();

  this.getGraphManager().resetAllNodes();
  this.getGraphManager().resetAllNodesToApplyGravitation();
  this.getGraphManager().resetAllEdges();
};

/**
* Reassigns the complex content. The outermost complex is placed first.
*/
CoSELayout.prototype.repopulateComplexes = function() {
  var self = this;
  this.emptiedDummyComplexMap.keySet().forEach(function(comp){
    var chGr = this.emptiedDummyComplexMap.get(comp);
    comp.setChild(chGr);
    this.getGraphManager().getGraphs().add(chGr);
  });

  for (var i = this.complexOrder.length - 1; i >= 0; i--)
  {
      var comp = this.complexOrder[i];
      var chGr = this.childGraphMap.get(comp);

      // repopulate the complex
      comp.setChild(chGr);

      // if the child graph is not null, adjust the positions of members
      if (chGr != null)
      {
          // adjust the positions of the members
          this.getGraphManager().getGraphs().add(chGr);
          
          var pack = this.memberPackMap.get(comp);
          pack.adjustLocations(comp.getLeft(), comp.getTop());
      }
  }
  
  this.emptiedDummyComplexMap.keySet().forEach(function(){
     var chGr = this.emptiedDummyComplexMap.get(comp);

     self.adjustLocation(comp, chGr);
  });

  this.removeDummyComplexes();

  // reset
  this.getGraphManager().resetAllNodes();
  this.getGraphManager().resetAllNodesToApplyGravitation();
  this.getGraphManager().resetAllEdges();
  this.calculateNodesToApplyGravitationTo();
};

CoSELayout.prototype.clearComplex = function (comp) {
  var pack = null;
  var childGr = comp.getChild();
  this.childGraphMap.put(comp, childGr);

  if (childGr == null)
    return;

  pack = new MemberPack(childGr);
  this.memberPackMap.put(comp, pack);

  if (this.dummyComplexList.contains(comp))
  {
    comp.getChild().getNodes().forEach(function (o) {
      clearDummyComplexGraphs(o);
    });
  }

  this.getGraphManager().getGraphs().remove(childGr);
  comp.setChild(null);

  comp.setWidth(pack.getWidth());
  comp.setHeight(pack.getHeight());

  // Redirect the edges of complex members to the complex.
  if (childGr != null)
  {
    childGr.getNodes().forEach(function (ch) {
      var chNd = ch;

      chNd.getEdges().forEach(function (edge) {
        if (edge.getSource() == chNd)
        {
          chNd.getEdges().remove(edge);
          edge.setSource(comp);
          comp.getEdges().add(edge);
        }
        else if (edge.getTarget() == chNd)
        {
          chNd.getEdges().remove(edge);
          edge.setTarget(comp);
          comp.getEdges().add(edge);
        }
      });
    });
  }
};

/**
 * This method recurses on the complex objects. If a node does not contain
 * any complex nodes or all the nodes in the child graph is already marked,
 * it is reported. (Depth first)
 * 
 */
CoSELayout.prototype.DFSVisitComplex = function (node)
{
  var self = this;
  if (node.getChild() != null)
  {
    node.getChild().getNodes().forEach(function (sbgnChild) {
      self.DFSVisitComplex(sbgnChild);
    });
  }

  // TODO add node.containsUnmarkedComplex() if not exists
  if (node.isComplex() && !node.containsUnmarkedComplex())
  {
    this.complexOrder.add(node);
    node.visited = true;
    return;
  }
};

/**
 * Adjust locations of children of given complex wrt. the location of the
 * complex
 */
CoSELayout.prototype.adjustLocation = function (comp, chGr)
{
  var rect = calculateBounds(false, chGr.getNodes());

  var differenceX = parseInt(rect.x - comp.getLeft());
  var differenceY = parseInt(rect.y - comp.getTop());

  // TODO revise it
  // if the parent graph is a compound, add compound margins
//   if (!comp.type.equals(SbgnPDConstants.COMPLEX))
//   {
//       differenceX -= LayoutConstants.COMPOUND_NODE_MARGIN;
//       differenceY -= LayoutConstants.COMPOUND_NODE_MARGIN;
//   }

  for (var j = 0; j < chGr.getNodes().length; j++)
  {
    var s = chGr.getNodes()[j];

    s.setLocation(s.getLeft() - differenceX
            + CoSEConstants.COMPLEX_MEM_HORIZONTAL_BUFFER, s.getTop()
            - differenceY + CoSEConstants.COMPLEX_MEM_VERTICAL_BUFFER);

    if (s.getChild() != null)
      adjustLocation(s, s.getChild());
  }
};

/**
 * Recursively removes all dummy complex nodes (previously created to tile
 * group degree-zero nodes) from the graph.
 */
CoSELayout.prototype.clearDummyComplexGraphs = function (comp)
{
  if (comp.getChild() == null || comp.isDummyCompound) {
    return;
  }
  
  comp.getChild().getNodes().forEach(function (childNode) {
    if (childNode.getChild() != null && childNode.getEdges().length == 0)
      clearDummyComplexGraphs(childNode);
  });

  if (this.graphManager.getGraphs().contains(comp.getChild())) {
    if (calcGraphDegree(comp) == 0) {
      this.emptiedDummyComplexMap.put(comp, comp.getChild());

      this.getGraphManager().getGraphs().remove(comp.getChild());
      comp.setChild(null);
    }
  }
};

/**
 * Dummy complexes (placed in the "dummyComplexList") are removed from the
 * graph.
 */
CoSELayout.prototype.removeDummyComplexes = function()
{
  var self = this;
  // remove dummy complexes and connect children to original parent
  this.dummyComplexList.forEach(function (dummyComplex) {
    var childGraph = dummyComplex.getChild();
    var owner = dummyComplex.getOwner();

    // Remove child graph from graphs of this
    var graphs = self.getGraphManager().getGraphs();
    var index = graphs.indexOf(childGraph);
    
    if (index > -1) {
      graphs.splice(index, 1);
    }
    
    dummyComplex.setChild(null);

    owner.remove(dummyComplex);

    childGraph.getNodes().forEach(function (s) {
      owner.add(s);
    });
  });
};

/**
 * This method returns the bounding rectangle of the given set of nodes with
 * or without the margins
 */
CoSELayout.prototype.calculateBounds = function (isMarginIncluded, nodes)
{
  var boundLeft = Integer.MAX_VALUE;
  var boundRight = Integer.MIN_VALUE;
  var boundTop = Integer.MAX_VALUE;
  var boundBottom = Integer.MIN_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;

  nodes.forEach(function (lNode) {
    nodeLeft = parseInt(lNode.getLeft());
    nodeRight = parseInt(lNode.getRight());
    nodeTop = parseInt(lNode.getTop());
    nodeBottom = parseInt(lNode.getBottom());

    if (boundLeft > nodeLeft)
      boundLeft = nodeLeft;

    if (boundRight < nodeRight)
      boundRight = nodeRight;

    if (boundTop > nodeTop)
      boundTop = nodeTop;

    if (boundBottom < nodeBottom)
      boundBottom = nodeBottom;
  });


  if (isMarginIncluded)
  {
    return new RectangleD(boundLeft
            - CoSEConstants.COMPLEX_MEM_MARGIN, boundTop
            - CoSEConstants.COMPLEX_MEM_MARGIN, boundRight
            - boundLeft + 2 * CoSEConstants.COMPLEX_MEM_MARGIN,
            boundBottom - boundTop + 2
            * CoSEConstants.COMPLEX_MEM_MARGIN);
  }
  else
  {
    return new RectangleD(boundLeft, boundTop, boundRight - boundLeft,
            boundBottom - boundTop);
  }
};

/**
* Recursively calculate if the node or its child nodes have any edges to
* other nodes. Return the total number of edges.
*/
CoSELayout.prototype.calcGraphDegree = function(parentNode)
{
   var self = this;
   var degree = 0;
   if (parentNode.getChild() == null)
   {
       degree = parentNode.getEdges().length;
       return degree;
   }

   parentNode.getChild().getNodes().forEach(function(o) {
     degree = degree + parentNode.getEdges().length + self.calcGraphDegree(o);
   });

   return degree;
};

module.exports = CoSELayout;

},{"./CoSEConstants":1,"./CoSEEdge":2,"./CoSEGraph":3,"./CoSEGraphManager":4,"./CoSENode":6,"./FDLayout":9,"./FDLayoutConstants":10,"./HashMap":13,"./IGeometry":15,"./Integer":17,"./LGraph":19,"./Layout":23,"./LayoutConstants":24,"./Point":25,"./PointD":26,"./Transform":29}],6:[function(require,module,exports){
var FDLayoutNode = require('./FDLayoutNode');
var IMath = require('./IMath');

function CoSENode(gm, loc, size, vNode) {
  FDLayoutNode.call(this, gm, loc, size, vNode);
}


CoSENode.prototype = Object.create(FDLayoutNode.prototype);
for (var prop in FDLayoutNode) {
  CoSENode[prop] = FDLayoutNode[prop];
}

CoSENode.prototype.move = function ()
{
  var layout = this.graphManager.getLayout();
  this.displacementX = layout.coolingFactor *
          (this.springForceX + this.repulsionForceX + this.gravitationForceX);
  this.displacementY = layout.coolingFactor *
          (this.springForceY + this.repulsionForceY + this.gravitationForceY);


  if (Math.abs(this.displacementX) > layout.coolingFactor * layout.maxNodeDisplacement)
  {
    this.displacementX = layout.coolingFactor * layout.maxNodeDisplacement *
            IMath.sign(this.displacementX);
  }

  if (Math.abs(this.displacementY) > layout.coolingFactor * layout.maxNodeDisplacement)
  {
    this.displacementY = layout.coolingFactor * layout.maxNodeDisplacement *
            IMath.sign(this.displacementY);
  }

  // a simple node, just move it
  if (this.child == null)
  {
    this.moveBy(this.displacementX, this.displacementY);
  }
  // an empty compound node, again just move it
  else if (this.child.getNodes().length == 0)
  {
    this.moveBy(this.displacementX, this.displacementY);
  }
  // non-empty compound node, propogate movement to children as well
  else
  {
    this.propogateDisplacementToChildren(this.displacementX,
            this.displacementY);
  }

  layout.totalDisplacement +=
          Math.abs(this.displacementX) + Math.abs(this.displacementY);

  this.springForceX = 0;
  this.springForceY = 0;
  this.repulsionForceX = 0;
  this.repulsionForceY = 0;
  this.gravitationForceX = 0;
  this.gravitationForceY = 0;
  this.displacementX = 0;
  this.displacementY = 0;
};

CoSENode.prototype.propogateDisplacementToChildren = function (dX, dY)
{
  var nodes = this.getChild().getNodes();
  var node;
  for (var i = 0; i < nodes.length; i++)
  {
    node = nodes[i];
    if (node.getChild() == null)
    {
      node.moveBy(dX, dY);
      node.displacementX += dX;
      node.displacementY += dY;
    }
    else
    {
      node.propogateDisplacementToChildren(dX, dY);
    }
  }
};

CoSENode.prototype.setPred1 = function (pred1)
{
  this.pred1 = pred1;
};

CoSENode.prototype.getPred1 = function ()
{
  return pred1;
};

CoSENode.prototype.getPred2 = function ()
{
  return pred2;
};

CoSENode.prototype.setNext = function (next)
{
  this.next = next;
};

CoSENode.prototype.getNext = function ()
{
  return next;
};

CoSENode.prototype.setProcessed = function (processed)
{
  this.processed = processed;
};

CoSENode.prototype.isProcessed = function ()
{
  return processed;
};

module.exports = CoSENode;

},{"./FDLayoutNode":12,"./IMath":16}],7:[function(require,module,exports){
function DimensionD(width, height) {
  this.width = 0;
  this.height = 0;
  if (width !== null && height !== null) {
    this.height = height;
    this.width = width;
  }
}

DimensionD.prototype.getWidth = function ()
{
  return this.width;
};

DimensionD.prototype.setWidth = function (width)
{
  this.width = width;
};

DimensionD.prototype.getHeight = function ()
{
  return this.height;
};

DimensionD.prototype.setHeight = function (height)
{
  this.height = height;
};

module.exports = DimensionD;

},{}],8:[function(require,module,exports){
function Emitter(){
  this.listeners = [];
}

var p = Emitter.prototype;

p.addListener = function( event, callback ){
  this.listeners.push({
    event: event,
    callback: callback
  });
};

p.removeListener = function( event, callback ){
  for( var i = this.listeners.length; i >= 0; i-- ){
    var l = this.listeners[i];

    if( l.event === event && l.callback === callback ){
      this.listeners.splice( i, 1 );
    }
  }
};

p.emit = function( event, data ){
  for( var i = 0; i < this.listeners.length; i++ ){
    var l = this.listeners[i];

    if( event === l.event ){
      l.callback( data );
    }
  }
};

module.exports = Emitter;

},{}],9:[function(require,module,exports){
var Layout = require('./Layout');
var FDLayoutConstants = require('./FDLayoutConstants');
var LayoutConstants = require('./LayoutConstants');
var IGeometry = require('./IGeometry');
var IMath = require('./IMath');

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
  this.displacementThresholdPerNode = (3.0 * FDLayoutConstants.DEFAULT_EDGE_LENGTH) / 100;
  this.coolingFactor = 1.0;
  this.initialCoolingFactor = 1.0;
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

  if (this.layoutQuality == LayoutConstants.DRAFT_QUALITY)
  {
    this.displacementThresholdPerNode += 0.30;
    this.maxIterations *= 0.8;
  }
  else if (this.layoutQuality == LayoutConstants.PROOF_QUALITY)
  {
    this.displacementThresholdPerNode -= 0.30;
    this.maxIterations *= 1.2;
  }

  this.totalIterations = 0;
  this.notAnimatedIterations = 0;

//    this.useFRGridVariant = layoutOptionsPack.smartRepulsionRangeCalc;
};

FDLayout.prototype.calcIdealEdgeLengths = function () {
  var edge;
  var lcaDepth;
  var source;
  var target;
  var sizeOfSourceInLca;
  var sizeOfTargetInLca;

  var allEdges = this.getGraphManager().getAllEdges();
  for (var i = 0; i < allEdges.length; i++)
  {
    edge = allEdges[i];

    edge.idealLength = this.idealEdgeLength;

    if (edge.isInterGraph)
    {
      source = edge.getSource();
      target = edge.getTarget();

      sizeOfSourceInLca = edge.getSourceInLca().getEstimatedSize();
      sizeOfTargetInLca = edge.getTargetInLca().getEstimatedSize();

      if (this.useSmartIdealEdgeLengthCalculation)
      {
        edge.idealLength += sizeOfSourceInLca + sizeOfTargetInLca -
                2 * LayoutConstants.SIMPLE_NODE_SIZE;
      }

      lcaDepth = edge.getLca().getInclusionTreeDepth();

      edge.idealLength += FDLayoutConstants.DEFAULT_EDGE_LENGTH *
              FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR *
              (source.getInclusionTreeDepth() +
                      target.getInclusionTreeDepth() - 2 * lcaDepth);
    }
  }
};

FDLayout.prototype.initSpringEmbedder = function () {

  if (this.incremental)
  {
    this.coolingFactor = 0.8;
    this.initialCoolingFactor = 0.8;
    this.maxNodeDisplacement =
            FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL;
  }
  else
  {
    this.coolingFactor = 1.0;
    this.initialCoolingFactor = 1.0;
    this.maxNodeDisplacement =
            FDLayoutConstants.MAX_NODE_DISPLACEMENT;
  }

  this.maxIterations =
          Math.max(this.getAllNodes().length * 5, this.maxIterations);

  this.totalDisplacementThreshold =
          this.displacementThresholdPerNode * this.getAllNodes().length;

  this.repulsionRange = this.calcRepulsionRange();
};

FDLayout.prototype.calcSpringForces = function () {
  var lEdges = this.getAllEdges();
  var edge;

  for (var i = 0; i < lEdges.length; i++)
  {
    edge = lEdges[i];

    this.calcSpringForce(edge, edge.idealLength);
  }
};

FDLayout.prototype.calcRepulsionForces = function () {
  var i, j;
  var nodeA, nodeB;
  var lNodes = this.getAllNodes();

  for (i = 0; i < lNodes.length; i++)
  {
    nodeA = lNodes[i];

    for (j = i + 1; j < lNodes.length; j++)
    {
      nodeB = lNodes[j];

      // If both nodes are not members of the same graph, skip.
      if (nodeA.getOwner() != nodeB.getOwner())
      {
        continue;
      }

      this.calcRepulsionForce(nodeA, nodeB);
    }
  }
};

FDLayout.prototype.calcGravitationalForces = function () {
  var node;
  var lNodes = this.getAllNodesToApplyGravitation();

  for (var i = 0; i < lNodes.length; i++)
  {
    node = lNodes[i];
    this.calcGravitationalForce(node);
  }
};

FDLayout.prototype.moveNodes = function () {
  var lNodes = this.getAllNodes();
  var node;

  for (var i = 0; i < lNodes.length; i++)
  {
    node = lNodes[i];
    node.move();
  }
}

FDLayout.prototype.calcSpringForce = function (edge, idealLength) {
  var sourceNode = edge.getSource();
  var targetNode = edge.getTarget();

  var length;
  var springForce;
  var springForceX;
  var springForceY;

  // Update edge length
  if (this.uniformLeafNodeSizes &&
          sourceNode.getChild() == null && targetNode.getChild() == null)
  {
    edge.updateLengthSimple();
  }
  else
  {
    edge.updateLength();

    if (edge.isOverlapingSourceAndTarget)
    {
      return;
    }
  }

  length = edge.getLength();

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

  if (rectA.intersects(rectB))// two nodes overlap
  {
    // calculate separation amount in x and y directions
    IGeometry.calcSeparationAmount(rectA,
            rectB,
            overlapAmount,
            FDLayoutConstants.DEFAULT_EDGE_LENGTH / 2.0);

    repulsionForceX = overlapAmount[0];
    repulsionForceY = overlapAmount[1];
  }
  else// no overlap
  {
    // calculate distance

    if (this.uniformLeafNodeSizes &&
            nodeA.getChild() == null && nodeB.getChild() == null)// simply base repulsion on distance of node centers
    {
      distanceX = rectB.getCenterX() - rectA.getCenterX();
      distanceY = rectB.getCenterY() - rectA.getCenterY();
    }
    else// use clipping points
    {
      IGeometry.getIntersection(rectA, rectB, clipPoints);

      distanceX = clipPoints[2] - clipPoints[0];
      distanceY = clipPoints[3] - clipPoints[1];
    }

    // No repulsion range. FR grid variant should take care of this.
    if (Math.abs(distanceX) < FDLayoutConstants.MIN_REPULSION_DIST)
    {
      distanceX = IMath.sign(distanceX) *
              FDLayoutConstants.MIN_REPULSION_DIST;
    }

    if (Math.abs(distanceY) < FDLayoutConstants.MIN_REPULSION_DIST)
    {
      distanceY = IMath.sign(distanceY) *
              FDLayoutConstants.MIN_REPULSION_DIST;
    }

    distanceSquared = distanceX * distanceX + distanceY * distanceY;
    distance = Math.sqrt(distanceSquared);

    repulsionForce = this.repulsionConstant / distanceSquared;

    // Project force onto x and y axes
    repulsionForceX = repulsionForce * distanceX / distance;
    repulsionForceY = repulsionForce * distanceY / distance;
  }

  // Apply forces on the two nodes
  nodeA.repulsionForceX -= repulsionForceX;
  nodeA.repulsionForceY -= repulsionForceY;
  nodeB.repulsionForceX += repulsionForceX;
  nodeB.repulsionForceY += repulsionForceY;
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
  absDistanceX = Math.abs(distanceX);
  absDistanceY = Math.abs(distanceY);

  if (node.getOwner() == this.graphManager.getRoot())// in the root graph
  {
    Math.floor(80);
    estimatedSize = Math.floor(ownerGraph.getEstimatedSize() *
            this.gravityRangeFactor);

    if (absDistanceX > estimatedSize || absDistanceY > estimatedSize)
    {
      node.gravitationForceX = -this.gravityConstant * distanceX;
      node.gravitationForceY = -this.gravityConstant * distanceY;
    }
  }
  else// inside a compound
  {
    estimatedSize = Math.floor((ownerGraph.getEstimatedSize() *
            this.compoundGravityRangeFactor));

    if (absDistanceX > estimatedSize || absDistanceY > estimatedSize)
    {
      node.gravitationForceX = -this.gravityConstant * distanceX *
              this.compoundGravityConstant;
      node.gravitationForceY = -this.gravityConstant * distanceY *
              this.compoundGravityConstant;
    }
  }
};

FDLayout.prototype.isConverged = function () {
  var converged;
  var oscilating = false;

  if (this.totalIterations > this.maxIterations / 3)
  {
    oscilating =
            Math.abs(this.totalDisplacement - this.oldTotalDisplacement) < 2;
  }

  converged = this.totalDisplacement < this.totalDisplacementThreshold;

  this.oldTotalDisplacement = this.totalDisplacement;

  return converged || oscilating;
};

FDLayout.prototype.animate = function () {
  if (this.animationDuringLayout && !this.isSubLayout)
  {
    if (this.notAnimatedIterations == this.animationPeriod)
    {
      this.update();
      this.notAnimatedIterations = 0;
    }
    else
    {
      this.notAnimatedIterations++;
    }
  }
};

FDLayout.prototype.calcRepulsionRange = function () {
  return 0.0;
};

module.exports = FDLayout;

},{"./FDLayoutConstants":10,"./IGeometry":15,"./IMath":16,"./Layout":23,"./LayoutConstants":24}],10:[function(require,module,exports){
var LayoutConstants = require('./LayoutConstants');

function FDLayoutConstants() {
}

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
FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL = 100.0;
FDLayoutConstants.MAX_NODE_DISPLACEMENT = FDLayoutConstants.MAX_NODE_DISPLACEMENT_INCREMENTAL * 3;
FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
FDLayoutConstants.CONVERGENCE_CHECK_PERIOD = 100;
FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = 0.1;
FDLayoutConstants.MIN_EDGE_LENGTH = 1;
FDLayoutConstants.GRID_CALCULATION_CHECK_PERIOD = 10;

module.exports = FDLayoutConstants;

},{"./LayoutConstants":24}],11:[function(require,module,exports){
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

},{"./FDLayoutConstants":10,"./LEdge":18}],12:[function(require,module,exports){
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

FDLayoutNode.prototype.setGridCoordinates = function (_startX, _finishX, _startY, _finishY)
{
  this.startX = _startX;
  this.finishX = _finishX;
  this.startY = _startY;
  this.finishY = _finishY;

};

module.exports = FDLayoutNode;

},{"./LNode":22}],13:[function(require,module,exports){
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

HashMap.prototype.size = function () {
  return this.keys.length;
};

module.exports = HashMap;

},{"./UniqueIDGeneretor":30}],14:[function(require,module,exports){
var UniqueIDGeneretor = require('./UniqueIDGeneretor');

function HashSet() {
  this.set = {};
}
;

HashSet.prototype.add = function (obj) {
  var theId = UniqueIDGeneretor.createID(obj);
  if (!this.contains(theId))
    this.set[theId] = obj;
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

},{"./UniqueIDGeneretor":30}],15:[function(require,module,exports){
function IGeometry() {
}

IGeometry.calcSeparationAmount = function (rectA, rectB, overlapAmount, separationBuffer)
{
  if (!rectA.intersects(rectB)) {
    throw "assert failed";
  }
  var directions = new Array(2);
  IGeometry.decideDirectionsForOverlappingNodes(rectA, rectB, directions);
  overlapAmount[0] = Math.min(rectA.getRight(), rectB.getRight()) -
          Math.max(rectA.x, rectB.x);
  overlapAmount[1] = Math.min(rectA.getBottom(), rectB.getBottom()) -
          Math.max(rectA.y, rectB.y);
  // update the overlapping amounts for the following cases:
  if ((rectA.getX() <= rectB.getX()) && (rectA.getRight() >= rectB.getRight()))
  {
    overlapAmount[0] += Math.min((rectB.getX() - rectA.getX()),
            (rectA.getRight() - rectB.getRight()));
  }
  else if ((rectB.getX() <= rectA.getX()) && (rectB.getRight() >= rectA.getRight()))
  {
    overlapAmount[0] += Math.min((rectA.getX() - rectB.getX()),
            (rectB.getRight() - rectA.getRight()));
  }
  if ((rectA.getY() <= rectB.getY()) && (rectA.getBottom() >= rectB.getBottom()))
  {
    overlapAmount[1] += Math.min((rectB.getY() - rectA.getY()),
            (rectA.getBottom() - rectB.getBottom()));
  }
  else if ((rectB.getY() <= rectA.getY()) && (rectB.getBottom() >= rectA.getBottom()))
  {
    overlapAmount[1] += Math.min((rectA.getY() - rectB.getY()),
            (rectB.getBottom() - rectA.getBottom()));
  }

  // find slope of the line passes two centers
  var slope = Math.abs((rectB.getCenterY() - rectA.getCenterY()) /
          (rectB.getCenterX() - rectA.getCenterX()));
  // if centers are overlapped
  if ((rectB.getCenterY() == rectA.getCenterY()) &&
          (rectB.getCenterX() == rectA.getCenterX()))
  {
    // assume the slope is 1 (45 degree)
    slope = 1.0;
  }

  var moveByY = slope * overlapAmount[0];
  var moveByX = overlapAmount[1] / slope;
  if (overlapAmount[0] < moveByX)
  {
    moveByX = overlapAmount[0];
  }
  else
  {
    moveByY = overlapAmount[1];
  }
  // return half the amount so that if each rectangle is moved by these
  // amounts in opposite directions, overlap will be resolved
  overlapAmount[0] = -1 * directions[0] * ((moveByX / 2) + separationBuffer);
  overlapAmount[1] = -1 * directions[1] * ((moveByY / 2) + separationBuffer);
}

IGeometry.decideDirectionsForOverlappingNodes = function (rectA, rectB, directions)
{
  if (rectA.getCenterX() < rectB.getCenterX())
  {
    directions[0] = -1;
  }
  else
  {
    directions[0] = 1;
  }

  if (rectA.getCenterY() < rectB.getCenterY())
  {
    directions[1] = -1;
  }
  else
  {
    directions[1] = 1;
  }
}

IGeometry.getIntersection2 = function (rectA, rectB, result)
{
  //result[0-1] will contain clipPoint of rectA, result[2-3] will contain clipPoint of rectB
  var p1x = rectA.getCenterX();
  var p1y = rectA.getCenterY();
  var p2x = rectB.getCenterX();
  var p2y = rectB.getCenterY();

  //if two rectangles intersect, then clipping points are centers
  if (rectA.intersects(rectB))
  {
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
  if (p1x == p2x)
  {
    if (p1y > p2y)
    {
      result[0] = p1x;
      result[1] = topLeftAy;
      result[2] = p2x;
      result[3] = bottomLeftBy;
      return false;
    }
    else if (p1y < p2y)
    {
      result[0] = p1x;
      result[1] = bottomLeftAy;
      result[2] = p2x;
      result[3] = topLeftBy;
      return false;
    }
    else
    {
      //not line, return null;
    }
  }
  // line is horizontal
  else if (p1y == p2y)
  {
    if (p1x > p2x)
    {
      result[0] = topLeftAx;
      result[1] = p1y;
      result[2] = topRightBx;
      result[3] = p2y;
      return false;
    }
    else if (p1x < p2x)
    {
      result[0] = topRightAx;
      result[1] = p1y;
      result[2] = topLeftBx;
      result[3] = p2y;
      return false;
    }
    else
    {
      //not valid line, return null;
    }
  }
  else
  {
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
    if ((-slopeA) == slopePrime)
    {
      if (p1x > p2x)
      {
        result[0] = bottomLeftAx;
        result[1] = bottomLeftAy;
        clipPointAFound = true;
      }
      else
      {
        result[0] = topRightAx;
        result[1] = topLeftAy;
        clipPointAFound = true;
      }
    }
    else if (slopeA == slopePrime)
    {
      if (p1x > p2x)
      {
        result[0] = topLeftAx;
        result[1] = topLeftAy;
        clipPointAFound = true;
      }
      else
      {
        result[0] = bottomRightAx;
        result[1] = bottomLeftAy;
        clipPointAFound = true;
      }
    }

    //determine whether clipping point is the corner of nodeB
    if ((-slopeB) == slopePrime)
    {
      if (p2x > p1x)
      {
        result[2] = bottomLeftBx;
        result[3] = bottomLeftBy;
        clipPointBFound = true;
      }
      else
      {
        result[2] = topRightBx;
        result[3] = topLeftBy;
        clipPointBFound = true;
      }
    }
    else if (slopeB == slopePrime)
    {
      if (p2x > p1x)
      {
        result[2] = topLeftBx;
        result[3] = topLeftBy;
        clipPointBFound = true;
      }
      else
      {
        result[2] = bottomRightBx;
        result[3] = bottomLeftBy;
        clipPointBFound = true;
      }
    }

    //if both clipping points are corners
    if (clipPointAFound && clipPointBFound)
    {
      return false;
    }

    //determine Cardinal Direction of rectangles
    if (p1x > p2x)
    {
      if (p1y > p2y)
      {
        cardinalDirectionA = IGeometry.getCardinalDirection(slopeA, slopePrime, 4);
        cardinalDirectionB = IGeometry.getCardinalDirection(slopeB, slopePrime, 2);
      }
      else
      {
        cardinalDirectionA = IGeometry.getCardinalDirection(-slopeA, slopePrime, 3);
        cardinalDirectionB = IGeometry.getCardinalDirection(-slopeB, slopePrime, 1);
      }
    }
    else
    {
      if (p1y > p2y)
      {
        cardinalDirectionA = IGeometry.getCardinalDirection(-slopeA, slopePrime, 1);
        cardinalDirectionB = IGeometry.getCardinalDirection(-slopeB, slopePrime, 3);
      }
      else
      {
        cardinalDirectionA = IGeometry.getCardinalDirection(slopeA, slopePrime, 2);
        cardinalDirectionB = IGeometry.getCardinalDirection(slopeB, slopePrime, 4);
      }
    }
    //calculate clipping Point if it is not found before
    if (!clipPointAFound)
    {
      switch (cardinalDirectionA)
      {
        case 1:
          tempPointAy = topLeftAy;
          tempPointAx = p1x + (-halfHeightA) / slopePrime;
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
          tempPointAy = p1y + (-halfWidthA) * slopePrime;
          result[0] = tempPointAx;
          result[1] = tempPointAy;
          break;
      }
    }
    if (!clipPointBFound)
    {
      switch (cardinalDirectionB)
      {
        case 1:
          tempPointBy = topLeftBy;
          tempPointBx = p2x + (-halfHeightB) / slopePrime;
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
          tempPointBy = p2y + (-halfWidthB) * slopePrime;
          result[2] = tempPointBx;
          result[3] = tempPointBy;
          break;
      }
    }
  }
  return false;
}

IGeometry.getCardinalDirection = function (slope, slopePrime, line)
{
  if (slope > slopePrime)
  {
    return line;
  }
  else
  {
    return 1 + line % 4;
  }
}

IGeometry.getIntersection = function (s1, s2, f1, f2)
{
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
  c1 = x2 * y1 - x1 * y2;  // { a1*x + b1*y + c1 = 0 is line 1 }

  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;  // { a2*x + b2*y + c2 = 0 is line 2 }

  denom = a1 * b2 - a2 * b1;

  if (denom == 0)
  {
    return null;
  }

  x = (b1 * c2 - b2 * c1) / denom;
  y = (a2 * c1 - a1 * c2) / denom;

  return new Point(x, y);
}

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

},{}],16:[function(require,module,exports){
function IMath() {
}

/**
 * This method returns the sign of the input value.
 */
IMath.sign = function (value) {
  if (value > 0)
  {
    return 1;
  }
  else if (value < 0)
  {
    return -1;
  }
  else
  {
    return 0;
  }
}

IMath.floor = function (value) {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
}

IMath.ceil = function (value) {
  return value < 0 ? Math.floor(value) : Math.ceil(value);
}

module.exports = IMath;

},{}],17:[function(require,module,exports){
function Integer() {
}

Integer.MAX_VALUE = 2147483647;
Integer.MIN_VALUE = -2147483648;

module.exports = Integer;

},{}],18:[function(require,module,exports){
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

LEdge.prototype.getSource = function ()
{
  return this.source;
};

LEdge.prototype.getTarget = function ()
{
  return this.target;
};

LEdge.prototype.isInterGraph = function ()
{
  return this.isInterGraph;
};

LEdge.prototype.getLength = function ()
{
  return this.length;
};

LEdge.prototype.isOverlapingSourceAndTarget = function ()
{
  return this.isOverlapingSourceAndTarget;
};

LEdge.prototype.getBendpoints = function ()
{
  return this.bendpoints;
};

LEdge.prototype.getLca = function ()
{
  return this.lca;
};

LEdge.prototype.getSourceInLca = function ()
{
  return this.sourceInLca;
};

LEdge.prototype.getTargetInLca = function ()
{
  return this.targetInLca;
};

LEdge.prototype.getOtherEnd = function (node)
{
  if (this.source === node)
  {
    return this.target;
  }
  else if (this.target === node)
  {
    return this.source;
  }
  else
  {
    throw "Node is not incident with this edge";
  }
}

LEdge.prototype.getOtherEndInGraph = function (node, graph)
{
  var otherEnd = this.getOtherEnd(node);
  var root = graph.getGraphManager().getRoot();

  while (true)
  {
    if (otherEnd.getOwner() == graph)
    {
      return otherEnd;
    }

    if (otherEnd.getOwner() == root)
    {
      break;
    }

    otherEnd = otherEnd.getOwner().getParent();
  }

  return null;
};

LEdge.prototype.updateLength = function ()
{
  var clipPointCoordinates = new Array(4);

  this.isOverlapingSourceAndTarget =
          IGeometry.getIntersection(this.target.getRect(),
                  this.source.getRect(),
                  clipPointCoordinates);

  if (!this.isOverlapingSourceAndTarget)
  {
    this.lengthX = clipPointCoordinates[0] - clipPointCoordinates[2];
    this.lengthY = clipPointCoordinates[1] - clipPointCoordinates[3];

    if (Math.abs(this.lengthX) < 1.0)
    {
      this.lengthX = IMath.sign(this.lengthX);
    }

    if (Math.abs(this.lengthY) < 1.0)
    {
      this.lengthY = IMath.sign(this.lengthY);
    }

    this.length = Math.sqrt(
            this.lengthX * this.lengthX + this.lengthY * this.lengthY);
  }
};

LEdge.prototype.updateLengthSimple = function ()
{
  this.lengthX = this.target.getCenterX() - this.source.getCenterX();
  this.lengthY = this.target.getCenterY() - this.source.getCenterY();

  if (Math.abs(this.lengthX) < 1.0)
  {
    this.lengthX = IMath.sign(this.lengthX);
  }

  if (Math.abs(this.lengthY) < 1.0)
  {
    this.lengthY = IMath.sign(this.lengthY);
  }

  this.length = Math.sqrt(
          this.lengthX * this.lengthX + this.lengthY * this.lengthY);
}

module.exports = LEdge;

},{"./IGeometry":15,"./IMath":16,"./LGraphObject":21}],19:[function(require,module,exports){
var LGraphObject = require('./LGraphObject');
var Integer = require('./Integer');
var LayoutConstants = require('./LayoutConstants');
var LGraphManager = require('./LGraphManager');
var LNode = require('./LNode');
var HashSet = require('./HashSet');
var RectangleD = require('./RectangleD');
var Point = require('./Point');

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
  }
  else if (obj2 != null && obj2 instanceof Layout) {
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

LGraph.prototype.getGraphManager = function ()
{
  return this.graphManager;
};

LGraph.prototype.getParent = function ()
{
  return this.parent;
};

LGraph.prototype.getLeft = function ()
{
  return this.left;
};

LGraph.prototype.getRight = function ()
{
  return this.right;
};

LGraph.prototype.getTop = function ()
{
  return this.top;
};

LGraph.prototype.getBottom = function ()
{
  return this.bottom;
};

LGraph.prototype.isConnected = function ()
{
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
  }
  else {
    var newEdge = obj1;
    if (!(this.getNodes().indexOf(sourceNode) > -1 && (this.getNodes().indexOf(targetNode)) > -1)) {
      throw "Source or target not in graph!";
    }

    if (!(sourceNode.owner == targetNode.owner && sourceNode.owner == this)) {
      throw "Both owners must be this graph!";
    }

    if (sourceNode.owner != targetNode.owner)
    {
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

    if (targetNode != sourceNode)
    {
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
    for (var i = 0; i < s; i++)
    {
      edge = edgesToBeRemoved[i];

      if (edge.isInterGraph)
      {
        this.graphManager.remove(edge);
      }
      else
      {
        edge.source.owner.remove(edge);
      }
    }

    // now the node itself
    var index = this.nodes.indexOf(node);
    if (index == -1) {
      throw "Node not in owner node list!";
    }

    this.nodes.splice(index, 1);
  }
  else if (obj instanceof LEdge) {
    var edge = obj;
    if (edge == null) {
      throw "Edge is null!";
    }
    if (!(edge.source != null && edge.target != null)) {
      throw "Source and/or target is null!";
    }
    if (!(edge.source.owner != null && edge.target.owner != null &&
            edge.source.owner == this && edge.target.owner == this)) {
      throw "Source and/or target owner is invalid!";
    }

    var sourceIndex = edge.source.edges.indexOf(edge);
    var targetIndex = edge.target.edges.indexOf(edge);
    if (!(sourceIndex > -1 && targetIndex > -1)) {
      throw "Source and/or target doesn't know this edge!";
    }

    edge.source.edges.splice(sourceIndex, 1);

    if (edge.target != edge.source)
    {
      edge.target.edges.splice(targetIndex, 1);
    }

    var index = edge.source.owner.getEdges().indexOf(edge);
    if (index == -1) {
      throw "Not in owner's edge list!";
    }

    edge.source.owner.getEdges().splice(index, 1);
  }
};

LGraph.prototype.updateLeftTop = function ()
{
  var top = Integer.MAX_VALUE;
  var left = Integer.MAX_VALUE;
  var nodeTop;
  var nodeLeft;

  var nodes = this.getNodes();
  var s = nodes.length;

  for (var i = 0; i < s; i++)
  {
    var lNode = nodes[i];
    nodeTop = Math.floor(lNode.getTop());
    nodeLeft = Math.floor(lNode.getLeft());

    if (top > nodeTop)
    {
      top = nodeTop;
    }

    if (left > nodeLeft)
    {
      left = nodeLeft;
    }
  }

  // Do we have any nodes in this graph?
  if (top == Integer.MAX_VALUE)
  {
    return null;
  }

  this.left = left - this.margin;
  this.top = top - this.margin;

  // Apply the margins and return the result
  return new Point(this.left, this.top);
};

LGraph.prototype.updateBounds = function (recursive)
{
  // calculate bounds
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;

  var nodes = this.nodes;
  var s = nodes.length;
  for (var i = 0; i < s; i++)
  {
    var lNode = nodes[i];

    if (recursive && lNode.child != null)
    {
      lNode.updateBounds();
    }
    nodeLeft = Math.floor(lNode.getLeft());
    nodeRight = Math.floor(lNode.getRight());
    nodeTop = Math.floor(lNode.getTop());
    nodeBottom = Math.floor(lNode.getBottom());

    if (left > nodeLeft)
    {
      left = nodeLeft;
    }

    if (right < nodeRight)
    {
      right = nodeRight;
    }

    if (top > nodeTop)
    {
      top = nodeTop;
    }

    if (bottom < nodeBottom)
    {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);
  if (left == Integer.MAX_VALUE)
  {
    this.left = Math.floor(this.parent.getLeft());
    this.right = Math.floor(this.parent.getRight());
    this.top = Math.floor(this.parent.getTop());
    this.bottom = Math.floor(this.parent.getBottom());
  }

  this.left = boundingRect.x - this.margin;
  this.right = boundingRect.x + boundingRect.width + this.margin;
  this.top = boundingRect.y - this.margin;
  this.bottom = boundingRect.y + boundingRect.height + this.margin;
};

LGraph.calculateBounds = function (nodes)
{
  var left = Integer.MAX_VALUE;
  var right = -Integer.MAX_VALUE;
  var top = Integer.MAX_VALUE;
  var bottom = -Integer.MAX_VALUE;
  var nodeLeft;
  var nodeRight;
  var nodeTop;
  var nodeBottom;

  var s = nodes.length;

  for (var i = 0; i < s; i++)
  {
    var lNode = nodes[i];
    nodeLeft = Math.floor(lNode.getLeft());
    nodeRight = Math.floor(lNode.getRight());
    nodeTop = Math.floor(lNode.getTop());
    nodeBottom = Math.floor(lNode.getBottom());

    if (left > nodeLeft)
    {
      left = nodeLeft;
    }

    if (right < nodeRight)
    {
      right = nodeRight;
    }

    if (top > nodeTop)
    {
      top = nodeTop;
    }

    if (bottom < nodeBottom)
    {
      bottom = nodeBottom;
    }
  }

  var boundingRect = new RectangleD(left, top, right - left, bottom - top);

  return boundingRect;
};

LGraph.prototype.getInclusionTreeDepth = function ()
{
  if (this == this.graphManager.getRoot())
  {
    return 1;
  }
  else
  {
    return this.parent.getInclusionTreeDepth();
  }
};

LGraph.prototype.getEstimatedSize = function ()
{
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LGraph.prototype.calcEstimatedSize = function ()
{
  var size = 0;
  var nodes = this.nodes;
  var s = nodes.length;

  for (var i = 0; i < s; i++)
  {
    var lNode = nodes[i];
    size += lNode.calcEstimatedSize();
  }

  if (size == 0)
  {
    this.estimatedSize = LayoutConstants.EMPTY_COMPOUND_NODE_SIZE;
  }
  else
  {
    this.estimatedSize = Math.floor(size / Math.sqrt(this.nodes.length));
  }

  return Math.floor(this.estimatedSize);
};

LGraph.prototype.updateConnected = function ()
{
  if (this.nodes.length == 0)
  {
    this.isConnected = true;
    return;
  }

  var toBeVisited = [];
  var visited = new HashSet();
  var currentNode = this.nodes[0];
  var neighborEdges;
  var currentNeighbor;
  toBeVisited = toBeVisited.concat(currentNode.withChildren());

  while (toBeVisited.length > 0)
  {
    currentNode = toBeVisited.shift();
    visited.add(currentNode);

    // Traverse all neighbors of this node
    neighborEdges = currentNode.getEdges();
    var s = neighborEdges.length;
    for (var i = 0; i < s; i++)
    {
      var neighborEdge = neighborEdges[i];
      currentNeighbor =
              neighborEdge.getOtherEndInGraph(currentNode, this);

      // Add unvisited neighbors to the list to visit
      if (currentNeighbor != null &&
              !visited.contains(currentNeighbor))
      {
        toBeVisited = toBeVisited.concat(currentNeighbor.withChildren());
      }
    }
  }

  this.isConnected = false;

  if (visited.size() >= this.nodes.length)
  {
    var noOfVisitedInThisGraph = 0;

    var s = visited.size();
    for (var visitedId in visited.set)
    {
      var visitedNode = visited.set[visitedId];
      if (visitedNode.owner == this)
      {
        noOfVisitedInThisGraph++;
      }
    }

    if (noOfVisitedInThisGraph == this.nodes.length)
    {
      this.isConnected = true;
    }
  }
};

module.exports = LGraph;

},{"./HashSet":14,"./Integer":17,"./LGraphManager":20,"./LGraphObject":21,"./LNode":22,"./LayoutConstants":24,"./Point":25,"./RectangleD":28}],20:[function(require,module,exports){
function LGraphManager(layout) {
  this.layout = layout;

  this.graphs = [];
  this.edges = [];
}

LGraphManager.prototype.addRoot = function ()
{
  var ngraph = this.layout.newGraph();
  var nnode = this.layout.newNode(null);
  var root = this.add(ngraph, nnode);
  this.setRootGraph(root);
  return this.rootGraph;
};

LGraphManager.prototype.add = function (newGraph, parentNode, newEdge, sourceNode, targetNode)
{
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
      throw  "Already has a child!";
    }

    newGraph.parent = parentNode;
    parentNode.child = newGraph;

    return newGraph;
  }
  else {
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

    if (sourceGraph == targetGraph)
    {
      newEdge.isInterGraph = false;
      return sourceGraph.add(newEdge, sourceNode, targetNode);
    }
    else
    {
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
    if (!(graph == this.rootGraph || (graph.parent != null && graph.parent.graphManager == this))) {
      throw "Invalid parent node!";
    }

    // first the edges (make a copy to do it safely)
    var edgesToBeRemoved = [];

    edgesToBeRemoved = edgesToBeRemoved.concat(graph.getEdges());

    var edge;
    var s = edgesToBeRemoved.length;
    for (var i = 0; i < s; i++)
    {
      edge = edgesToBeRemoved[i];
      graph.remove(edge);
    }

    // then the nodes (make a copy to do it safely)
    var nodesToBeRemoved = [];

    nodesToBeRemoved = nodesToBeRemoved.concat(graph.getNodes());

    var node;
    s = nodesToBeRemoved.length;
    for (var i = 0; i < s; i++)
    {
      node = nodesToBeRemoved[i];
      graph.remove(node);
    }

    // check if graph is the root
    if (graph == this.rootGraph)
    {
      this.setRootGraph(null);
    }

    // now remove the graph itself
    var index = this.graphs.indexOf(graph);
    this.graphs.splice(index, 1);

    // also reset the parent of the graph
    graph.parent = null;
  }
  else if (lObj instanceof LEdge) {
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

LGraphManager.prototype.updateBounds = function ()
{
  this.rootGraph.updateBounds(true);
};

LGraphManager.prototype.getGraphs = function ()
{
  return this.graphs;
};

LGraphManager.prototype.getAllNodes = function ()
{
  if (this.allNodes == null)
  {
    var nodeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < s; i++)
    {
      nodeList = nodeList.concat(graphs[i].getNodes());
    }
    this.allNodes = nodeList;
  }
  return this.allNodes;
};

LGraphManager.prototype.resetAllNodes = function ()
{
  this.allNodes = null;
};

LGraphManager.prototype.resetAllEdges = function ()
{
  this.allEdges = null;
};

LGraphManager.prototype.resetAllNodesToApplyGravitation = function ()
{
  this.allNodesToApplyGravitation = null;
};

LGraphManager.prototype.getAllEdges = function ()
{
  if (this.allEdges == null)
  {
    var edgeList = [];
    var graphs = this.getGraphs();
    var s = graphs.length;
    for (var i = 0; i < graphs.length; i++)
    {
      edgeList = edgeList.concat(graphs[i].getEdges());
    }

    edgeList = edgeList.concat(this.edges);

    this.allEdges = edgeList;
  }
  return this.allEdges;
};

LGraphManager.prototype.getAllNodesToApplyGravitation = function ()
{
  return this.allNodesToApplyGravitation;
};

LGraphManager.prototype.setAllNodesToApplyGravitation = function (nodeList)
{
  if (this.allNodesToApplyGravitation != null) {
    throw "assert failed";
  }

  this.allNodesToApplyGravitation = nodeList;
};

LGraphManager.prototype.getRoot = function ()
{
  return this.rootGraph;
};

LGraphManager.prototype.setRootGraph = function (graph)
{
  if (graph.getGraphManager() != this) {
    throw "Root not in this graph mgr!";
  }

  this.rootGraph = graph;
  // root graph must have a root node associated with it for convenience
  if (graph.parent == null)
  {
    graph.parent = this.layout.newNode("Root node");
  }
};

LGraphManager.prototype.getLayout = function ()
{
  return this.layout;
};

LGraphManager.prototype.isOneAncestorOfOther = function (firstNode, secondNode)
{
  if (!(firstNode != null && secondNode != null)) {
    throw "assert failed";
  }

  if (firstNode == secondNode)
  {
    return true;
  }
  // Is second node an ancestor of the first one?
  var ownerGraph = firstNode.getOwner();
  var parentNode;

  do
  {
    parentNode = ownerGraph.getParent();

    if (parentNode == null)
    {
      break;
    }

    if (parentNode == secondNode)
    {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null)
    {
      break;
    }
  } while (true);
  // Is first node an ancestor of the second one?
  ownerGraph = secondNode.getOwner();

  do
  {
    parentNode = ownerGraph.getParent();

    if (parentNode == null)
    {
      break;
    }

    if (parentNode == firstNode)
    {
      return true;
    }

    ownerGraph = parentNode.getOwner();
    if (ownerGraph == null)
    {
      break;
    }
  } while (true);

  return false;
};

LGraphManager.prototype.calcLowestCommonAncestors = function ()
{
  var edge;
  var sourceNode;
  var targetNode;
  var sourceAncestorGraph;
  var targetAncestorGraph;

  var edges = this.getAllEdges();
  var s = edges.length;
  for (var i = 0; i < s; i++)
  {
    edge = edges[i];

    sourceNode = edge.source;
    targetNode = edge.target;
    edge.lca = null;
    edge.sourceInLca = sourceNode;
    edge.targetInLca = targetNode;

    if (sourceNode == targetNode)
    {
      edge.lca = sourceNode.getOwner();
      continue;
    }

    sourceAncestorGraph = sourceNode.getOwner();

    while (edge.lca == null)
    {
      targetAncestorGraph = targetNode.getOwner();

      while (edge.lca == null)
      {
        if (targetAncestorGraph == sourceAncestorGraph)
        {
          edge.lca = targetAncestorGraph;
          break;
        }

        if (targetAncestorGraph == this.rootGraph)
        {
          break;
        }

        if (edge.lca != null) {
          throw "assert failed";
        }
        edge.targetInLca = targetAncestorGraph.getParent();
        targetAncestorGraph = edge.targetInLca.getOwner();
      }

      if (sourceAncestorGraph == this.rootGraph)
      {
        break;
      }

      if (edge.lca == null)
      {
        edge.sourceInLca = sourceAncestorGraph.getParent();
        sourceAncestorGraph = edge.sourceInLca.getOwner();
      }
    }

    if (edge.lca == null) {
      throw "assert failed";
    }
  }
};

LGraphManager.prototype.calcLowestCommonAncestor = function (firstNode, secondNode)
{
  if (firstNode == secondNode)
  {
    return firstNode.getOwner();
  }
  var firstOwnerGraph = firstNode.getOwner();

  do
  {
    if (firstOwnerGraph == null)
    {
      break;
    }
    var secondOwnerGraph = secondNode.getOwner();

    do
    {
      if (secondOwnerGraph == null)
      {
        break;
      }

      if (secondOwnerGraph == firstOwnerGraph)
      {
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
  for (var i = 0; i < s; i++)
  {
    node = nodes[i];
    node.inclusionTreeDepth = depth;

    if (node.child != null)
    {
      this.calcInclusionTreeDepths(node.child, depth + 1);
    }
  }
};

LGraphManager.prototype.includesInvalidEdge = function ()
{
  var edge;

  var s = this.edges.length;
  for (var i = 0; i < s; i++)
  {
    edge = this.edges[i];

    if (this.isOneAncestorOfOther(edge.source, edge.target))
    {
      return true;
    }
  }
  return false;
};

module.exports = LGraphManager;

},{}],21:[function(require,module,exports){
function LGraphObject(vGraphObject) {
  this.vGraphObject = vGraphObject;
}

module.exports = LGraphObject;

},{}],22:[function(require,module,exports){
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
  if (gm.graphManager != null)
    gm = gm.graphManager;

  this.estimatedSize = Integer.MIN_VALUE;
  this.inclusionTreeDepth = Integer.MAX_VALUE;
  this.vGraphObject = vNode;
  this.edges = [];
  this.graphManager = gm;

  if (size != null && loc != null)
    this.rect = new RectangleD(loc.x, loc.y, size.width, size.height);
  else
    this.rect = new RectangleD();
}

LNode.prototype = Object.create(LGraphObject.prototype);
for (var prop in LGraphObject) {
  LNode[prop] = LGraphObject[prop];
}

LNode.prototype.getEdges = function ()
{
  return this.edges;
};

LNode.prototype.getChild = function ()
{
  return this.child;
};

/**
 * This method sets the child graph of this node. Only compound nodes will
 * have child graphs.
 */
LNode.prototype.setChild = function (child)
{
  if (child != null && child.getGraphManager() != this.graphManager) {
    throw "Child has different graph mgr!";
  }

  this.child = child;
};

LNode.prototype.getOwner = function ()
{
  if (this.owner != null) {
    if (!(this.owner == null || this.owner.getNodes().indexOf(this) > -1)) {
      throw "assert failed";
    }
  }

  return this.owner;
};

LNode.prototype.getWidth = function ()
{
  return this.rect.width;
};

LNode.prototype.setWidth = function (width)
{
  this.rect.width = width;
};

LNode.prototype.getHeight = function ()
{
  return this.rect.height;
};

LNode.prototype.setHeight = function (height)
{
  this.rect.height = height;
};

LNode.prototype.getCenterX = function ()
{
  return this.rect.x + this.rect.width / 2;
};

LNode.prototype.getCenterY = function ()
{
  return this.rect.y + this.rect.height / 2;
};

LNode.prototype.getCenter = function ()
{
  return new PointD(this.rect.x + this.rect.width / 2,
          this.rect.y + this.rect.height / 2);
};

LNode.prototype.getLocation = function ()
{
  return new PointD(this.rect.x, this.rect.y);
};

LNode.prototype.getRect = function ()
{
  return this.rect;
};

LNode.prototype.getDiagonal = function ()
{
  return Math.sqrt(this.rect.width * this.rect.width +
          this.rect.height * this.rect.height);
};

LNode.prototype.setRect = function (upperLeft, dimension)
{
  this.rect.x = upperLeft.x;
  this.rect.y = upperLeft.y;
  this.rect.width = dimension.width;
  this.rect.height = dimension.height;
};

LNode.prototype.setCenter = function (cx, cy)
{
  this.rect.x = cx - this.rect.width / 2;
  this.rect.y = cy - this.rect.height / 2;
};

LNode.prototype.setLocation = function (x, y)
{
  this.rect.x = x;
  this.rect.y = y;
};

LNode.prototype.moveBy = function (dx, dy)
{
  this.rect.x += dx;
  this.rect.y += dy;
};

LNode.prototype.getEdgeListToNode = function (to)
{
  var edgeList = [];
  var edge;

  for (var obj in this.edges)
  {
    edge = obj;

    if (edge.target == to)
    {
      if (edge.source != this)
        throw "Incorrect edge source!";

      edgeList.push(edge);
    }
  }

  return edgeList;
};

LNode.prototype.getEdgesBetween = function (other)
{
  var edgeList = [];
  var edge;

  for (var obj in this.edges)
  {
    edge = this.edges[obj];

    if (!(edge.source == this || edge.target == this))
      throw "Incorrect edge source and/or target";

    if ((edge.target == other) || (edge.source == other))
    {
      edgeList.push(edge);
    }
  }

  return edgeList;
};

LNode.prototype.getNeighborsList = function ()
{
  var neighbors = new HashSet();
  var edge;

  for (var obj in this.edges)
  {
    edge = this.edges[obj];

    if (edge.source == this)
    {
      neighbors.add(edge.target);
    }
    else
    {
      if (!edge.target == this)
        throw "Incorrect incidency!";
      neighbors.add(edge.source);
    }
  }

  return neighbors;
};

LNode.prototype.withChildren = function ()
{
  var withNeighborsList = [];
  var childNode;

  withNeighborsList.push(this);

  if (this.child != null)
  {
    var nodes = this.child.getNodes();
    for (var i = 0; i < nodes.length; i++)
    {
      childNode = nodes[i];

      withNeighborsList = withNeighborsList.concat(childNode.withChildren());
    }
  }

  return withNeighborsList;
};

LNode.prototype.getEstimatedSize = function () {
  if (this.estimatedSize == Integer.MIN_VALUE) {
    throw "assert failed";
  }
  return this.estimatedSize;
};

LNode.prototype.calcEstimatedSize = function () {
  if (this.child == null)
  {
    return this.estimatedSize = Math.floor((this.rect.width + this.rect.height) / 2);
  }
  else
  {
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
  randomCenterX = LayoutConstants.WORLD_CENTER_X +
          (RandomSeed.nextDouble() * (maxX - minX)) + minX;

  var minY = -LayoutConstants.INITIAL_WORLD_BOUNDARY;
  var maxY = LayoutConstants.INITIAL_WORLD_BOUNDARY;
  randomCenterY = LayoutConstants.WORLD_CENTER_Y +
          (RandomSeed.nextDouble() * (maxY - minY)) + minY;

  this.rect.x = randomCenterX;
  this.rect.y = randomCenterY
};

LNode.prototype.updateBounds = function () {
  if (this.getChild() == null) {
    throw "assert failed";
  }
  if (this.getChild().getNodes().length != 0)
  {
    // wrap the children nodes by re-arranging the boundaries
    var childGraph = this.getChild();
    childGraph.updateBounds(true);

    this.rect.x = childGraph.getLeft();
    this.rect.y = childGraph.getTop();

    this.setWidth(childGraph.getRight() - childGraph.getLeft());
    this.setHeight(childGraph.getBottom() - childGraph.getTop());
  }
};

LNode.prototype.getInclusionTreeDepth = function ()
{
  if (this.inclusionTreeDepth == Integer.MAX_VALUE) {
    throw "assert failed";
  }
  return this.inclusionTreeDepth;
};

LNode.prototype.transform = function (trans)
{
  var left = this.rect.x;

  if (left > LayoutConstants.WORLD_BOUNDARY)
  {
    left = LayoutConstants.WORLD_BOUNDARY;
  }
  else if (left < -LayoutConstants.WORLD_BOUNDARY)
  {
    left = -LayoutConstants.WORLD_BOUNDARY;
  }

  var top = this.rect.y;

  if (top > LayoutConstants.WORLD_BOUNDARY)
  {
    top = LayoutConstants.WORLD_BOUNDARY;
  }
  else if (top < -LayoutConstants.WORLD_BOUNDARY)
  {
    top = -LayoutConstants.WORLD_BOUNDARY;
  }

  var leftTop = new PointD(left, top);
  var vLeftTop = trans.inverseTransformPoint(leftTop);

  this.setLocation(vLeftTop.x, vLeftTop.y);
};

LNode.prototype.getLeft = function ()
{
  return this.rect.x;
};

LNode.prototype.getRight = function ()
{
  return this.rect.x + this.rect.width;
};

LNode.prototype.getTop = function ()
{
  return this.rect.y;
};

LNode.prototype.getBottom = function ()
{
  return this.rect.y + this.rect.height;
};

LNode.prototype.getParent = function ()
{
  if (this.owner == null)
  {
    return null;
  }

  return this.owner.getParent();
};

module.exports = LNode;

},{"./HashSet":14,"./Integer":17,"./LGraphObject":21,"./LayoutConstants":24,"./PointD":26,"./RandomSeed":27,"./RectangleD":28}],23:[function(require,module,exports){
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
  Emitter.call( this );

  //Layout Quality: 0:proof, 1:default, 2:draft
  this.layoutQuality = LayoutConstants.DEFAULT_QUALITY;
  //Whether layout should create bendpoints as needed or not
  this.createBendsAsNeeded =
          LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
  //Whether layout should be incremental or not
  this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
  //Whether we animate from before to after layout node positions
  this.animationOnLayout =
          LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
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
  this.uniformLeafNodeSizes =
          LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
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

Layout.prototype = Object.create( Emitter.prototype );

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

Layout.prototype.newGraph = function (vGraph)
{
  return new LGraph(null, this.graphManager, vGraph);
};

Layout.prototype.newNode = function (vNode)
{
  return new LNode(this.graphManager, vNode);
};

Layout.prototype.newEdge = function (vEdge)
{
  return new LEdge(null, null, vEdge);
};

Layout.prototype.runLayout = function ()
{
  this.isLayoutFinished = false;

  this.initParameters();
  var isLayoutSuccessfull;

  if ((this.graphManager.getRoot() == null)
          || this.graphManager.getRoot().getNodes().length == 0
          || this.graphManager.includesInvalidEdge())
  {
    isLayoutSuccessfull = false;
  }
  else
  {
    // calculate execution time
    var startTime = 0;

    if (!this.isSubLayout)
    {
      startTime = new Date().getTime()
    }

    isLayoutSuccessfull = this.layout();

    if (!this.isSubLayout)
    {
      var endTime = new Date().getTime();
      var excTime = endTime - startTime;
    }
  }

  if (isLayoutSuccessfull)
  {
    if (!this.isSubLayout)
    {
      this.doPostLayout();
    }
  }

  this.isLayoutFinished = true;

  return isLayoutSuccessfull;
};

/**
 * This method performs the operations required after layout.
 */
Layout.prototype.doPostLayout = function ()
{
  //assert !isSubLayout : "Should not be called on sub-layout!";
  // Propagate geometric changes to v-level objects
  this.transform();
  this.update();
};

/**
 * This method updates the geometry of the target graph according to
 * calculated layout.
 */
Layout.prototype.update2 = function () {
  // update bend points
  if (this.createBendsAsNeeded)
  {
    this.createBendpointsFromDummyNodes();

    // reset all edges, since the topology has changed
    this.graphManager.resetAllEdges();
  }

  // perform edge, node and root updates if layout is not called
  // remotely
  if (!this.isRemoteUse)
  {
    // update all edges
    var edge;
    var allEdges = this.graphManager.getAllEdges();
    for (var i = 0; i < allEdges.length; i++)
    {
      edge = allEdges[i];
//      this.update(edge);
    }

    // recursively update nodes
    var node;
    var nodes = this.graphManager.getRoot().getNodes();
    for (var i = 0; i < nodes.length; i++)
    {
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
  }
  else if (obj instanceof LNode) {
    var node = obj;
    if (node.getChild() != null)
    {
      // since node is compound, recursively update child nodes
      var nodes = node.getChild().getNodes();
      for (var i = 0; i < nodes.length; i++)
      {
        update(nodes[i]);
      }
    }

    // if the l-level node is associated with a v-level graph object,
    // then it is assumed that the v-level node implements the
    // interface Updatable.
    if (node.vGraphObject != null)
    {
      // cast to Updatable without any type check
      var vNode = node.vGraphObject;

      // call the update method of the interface
      vNode.update(node);
    }
  }
  else if (obj instanceof LEdge) {
    var edge = obj;
    // if the l-level edge is associated with a v-level graph object,
    // then it is assumed that the v-level edge implements the
    // interface Updatable.

    if (edge.vGraphObject != null)
    {
      // cast to Updatable without any type check
      var vEdge = edge.vGraphObject;

      // call the update method of the interface
      vEdge.update(edge);
    }
  }
  else if (obj instanceof LGraph) {
    var graph = obj;
    // if the l-level graph is associated with a v-level graph object,
    // then it is assumed that the v-level object implements the
    // interface Updatable.

    if (graph.vGraphObject != null)
    {
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
  if (!this.isSubLayout)
  {
    this.layoutQuality = LayoutConstants.DEFAULT_QUALITY;
    this.animationDuringLayout = LayoutConstants.DEFAULT_ANIMATION_ON_LAYOUT;
    this.animationPeriod = LayoutConstants.DEFAULT_ANIMATION_PERIOD;
    this.animationOnLayout = LayoutConstants.DEFAULT_ANIMATION_DURING_LAYOUT;
    this.incremental = LayoutConstants.DEFAULT_INCREMENTAL;
    this.createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
    this.uniformLeafNodeSizes = LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES;
  }

  if (this.animationDuringLayout)
  {
    animationOnLayout = false;
  }
};

Layout.prototype.transform = function (newLeftTop) {
  if (newLeftTop == undefined) {
    this.transform(new PointD(0, 0));
  }
  else {
    // create a transformation object (from Eclipse to layout). When an
    // inverse transform is applied, we get upper-left coordinate of the
    // drawing or the root graph at given input coordinate (some margins
    // already included in calculation of left-top).

    var trans = new Transform();
    var leftTop = this.graphManager.getRoot().updateLeftTop();

    if (leftTop != null)
    {
      trans.setWorldOrgX(newLeftTop.x);
      trans.setWorldOrgY(newLeftTop.y);

      trans.setDeviceOrgX(leftTop.x);
      trans.setDeviceOrgY(leftTop.y);

      var nodes = this.getAllNodes();
      var node;

      for (var i = 0; i < nodes.length; i++)
      {
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
  }
  else {
    var lNode;
    var childGraph;

    var nodes = graph.getNodes();
    for (var i = 0; i < nodes.length; i++)
    {
      lNode = nodes[i];
      childGraph = lNode.getChild();

      if (childGraph == null)
      {
        lNode.scatter();
      }
      else if (childGraph.getNodes().length == 0)
      {
        lNode.scatter();
      }
      else
      {
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
Layout.prototype.getFlatForest = function ()
{
  var flatForest = [];
  var isForest = true;

  // Quick reference for all nodes in the graph manager associated with
  // this layout. The list should not be changed.
  var allNodes = this.graphManager.getRoot().getNodes();

  // First be sure that the graph is flat
  var isFlat = true;

  for (var i = 0; i < allNodes.length; i++)
  {
    if (allNodes[i].getChild() != null)
    {
      isFlat = false;
    }
  }

  // Return empty forest if the graph is not flat.
  if (!isFlat)
  {
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

  while (unProcessedNodes.length > 0 && isForest)
  {
    toBeVisited.push(unProcessedNodes[0]);

    // Start the BFS. Each iteration of this loop visits a node in a
    // BFS manner.
    while (toBeVisited.length > 0 && isForest)
    {
      //pool operation
      var currentNode = toBeVisited[0];
      toBeVisited.splice(0, 1);
      visited.add(currentNode);

      // Traverse all neighbors of this node
      var neighborEdges = currentNode.getEdges();

      for (var i = 0; i < neighborEdges.length; i++)
      {
        var currentNeighbor =
                neighborEdges[i].getOtherEnd(currentNode);

        // If BFS is not growing from this neighbor.
        if (parents.get(currentNode) != currentNeighbor)
        {
          // We haven't previously visited this neighbor.
          if (!visited.contains(currentNeighbor))
          {
            toBeVisited.push(currentNeighbor);
            parents.put(currentNeighbor, currentNode);
          }
          // Since we have previously visited this neighbor and
          // this neighbor is not parent of currentNode, given
          // graph contains a component that is not tree, hence
          // it is not a forest.
          else
          {
            isForest = false;
            break;
          }
        }
      }
    }

    // The graph contains a component that is not a tree. Empty
    // previously found trees. The method will end.
    if (!isForest)
    {
      flatForest = [];
    }
    // Save currently visited nodes as a tree in our forest. Reset
    // visited and parents lists. Continue with the next component of
    // the graph, if any.
    else
    {
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
Layout.prototype.createDummyNodesForBendpoints = function (edge)
{
  var dummyNodes = [];
  var prev = edge.source;

  var graph = this.graphManager.calcLowestCommonAncestor(edge.source, edge.target);

  for (var i = 0; i < edge.bendpoints.length; i++)
  {
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
  if (edge.isInterGraph())
  {
    this.graphManager.remove(edge);
  }
  // else, remove the edge from the current graph
  else
  {
    graph.remove(edge);
  }

  return dummyNodes;
};

/**
 * This method creates bendpoints for edges from the dummy nodes
 * at l-level.
 */
Layout.prototype.createBendpointsFromDummyNodes = function ()
{
  var edges = [];
  edges = edges.concat(this.graphManager.getAllEdges());
  edges = this.edgeToDummyNodes.keySet().concat(edges);

  for (var k = 0; k < edges.length; k++)
  {
    var lEdge = edges[k];

    if (lEdge.bendpoints.length > 0)
    {
      var path = this.edgeToDummyNodes.get(lEdge);

      for (var i = 0; i < path.length; i++)
      {
        var dummyNode = path[i];
        var p = new PointD(dummyNode.getCenterX(),
                dummyNode.getCenterY());

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

    if (sliderValue <= 50)
    {
      var minValue = defaultValue / minDiv;
      value -= ((defaultValue - minValue) / 50) * (50 - sliderValue);
    }
    else
    {
      var maxValue = defaultValue * maxMul;
      value += ((maxValue - defaultValue) / 50) * (sliderValue - 50);
    }

    return value;
  }
  else {
    var a, b;

    if (sliderValue <= 50)
    {
      a = 9.0 * defaultValue / 500.0;
      b = defaultValue / 10.0;
    }
    else
    {
      a = 9.0 * defaultValue / 50.0;
      b = -8 * defaultValue;
    }

    return (a * sliderValue + b);
  }
};

/**
 * This method finds and returns the center of the given nodes, assuming
 * that the given nodes form a tree in themselves.
 */
Layout.findCenterOfTree = function (nodes)
{
  var list = [];
  list = list.concat(nodes);

  var removedNodes = [];
  var remainingDegrees = new HashMap();
  var foundCenter = false;
  var centerNode = null;

  if (list.length == 1 || list.length == 2)
  {
    foundCenter = true;
    centerNode = list[0];
  }

  for (var i = 0; i < list.length; i++)
  {
    var node = list[i];
    var degree = node.getNeighborsList().size();
    remainingDegrees.put(node, node.getNeighborsList().size());

    if (degree == 1)
    {
      removedNodes.push(node);
    }
  }

  var tempList = [];
  tempList = tempList.concat(removedNodes);

  while (!foundCenter)
  {
    var tempList2 = [];
    tempList2 = tempList2.concat(tempList);
    tempList = [];

    for (var i = 0; i < list.length; i++)
    {
      var node = list[i];

      var index = list.indexOf(node);
      if (index >= 0) {
        list.splice(index, 1);
      }

      var neighbours = node.getNeighborsList();

      for (var j in neighbours.set)
      {
        var neighbour = neighbours.set[j];
        if (removedNodes.indexOf(neighbour) < 0)
        {
          var otherDegree = remainingDegrees.get(neighbour);
          var newDegree = otherDegree - 1;

          if (newDegree == 1)
          {
            tempList.push(neighbour);
          }

          remainingDegrees.put(neighbour, newDegree);
        }
      }
    }

    removedNodes = removedNodes.concat(tempList);

    if (list.length == 1 || list.length == 2)
    {
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
Layout.prototype.setGraphManager = function (gm)
{
  this.graphManager = gm;
};

module.exports = Layout;

},{"./Emitter":8,"./HashMap":13,"./HashSet":14,"./LEdge":18,"./LGraph":19,"./LGraphManager":20,"./LNode":22,"./LayoutConstants":24,"./PointD":26,"./Transform":29}],24:[function(require,module,exports){
function LayoutConstants() {
}

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

},{}],25:[function(require,module,exports){
/*
 *This class is the javascript implementation of the Point.java class in jdk
 */
function Point(x, y, p) {
  this.x = null;
  this.y = null;
  if (x == null && y == null && p == null) {
    this.x = 0;
    this.y = 0;
  }
  else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    this.x = x;
    this.y = y;
  }
  else if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.x = p.x;
    this.y = p.y;
  }
}

Point.prototype.getX = function () {
  return this.x;
}

Point.prototype.getY = function () {
  return this.y;
}

Point.prototype.getLocation = function () {
  return new Point(this.x, this.y);
}

Point.prototype.setLocation = function (x, y, p) {
  if (x.constructor.name == 'Point' && y == null && p == null) {
    p = x;
    this.setLocation(p.x, p.y);
  }
  else if (typeof x == 'number' && typeof y == 'number' && p == null) {
    //if both parameters are integer just move (x,y) location
    if (parseInt(x) == x && parseInt(y) == y) {
      this.move(x, y);
    }
    else {
      this.x = Math.floor(x + 0.5);
      this.y = Math.floor(y + 0.5);
    }
  }
}

Point.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.translate = function (dx, dy) {
  this.x += dx;
  this.y += dy;
}

Point.prototype.equals = function (obj) {
  if (obj.constructor.name == "Point") {
    var pt = obj;
    return (this.x == pt.x) && (this.y == pt.y);
  }
  return this == obj;
}

Point.prototype.toString = function () {
  return new Point().constructor.name + "[x=" + this.x + ",y=" + this.y + "]";
}

module.exports = Point;

},{}],26:[function(require,module,exports){
function PointD(x, y) {
  if (x == null && y == null) {
    this.x = 0;
    this.y = 0;
  } else {
    this.x = x;
    this.y = y;
  }
}

PointD.prototype.getX = function ()
{
  return this.x;
};

PointD.prototype.getY = function ()
{
  return this.y;
};

PointD.prototype.setX = function (x)
{
  this.x = x;
};

PointD.prototype.setY = function (y)
{
  this.y = y;
};

PointD.prototype.getDifference = function (pt)
{
  return new DimensionD(this.x - pt.x, this.y - pt.y);
};

PointD.prototype.getCopy = function ()
{
  return new PointD(this.x, this.y);
};

PointD.prototype.translate = function (dim)
{
  this.x += dim.width;
  this.y += dim.height;
  return this;
};

module.exports = PointD;

},{}],27:[function(require,module,exports){
function RandomSeed() {
}
RandomSeed.seed = 1;
RandomSeed.x = 0;

RandomSeed.nextDouble = function () {
  RandomSeed.x = Math.sin(RandomSeed.seed++) * 10000;
  return RandomSeed.x - Math.floor(RandomSeed.x);
};

module.exports = RandomSeed;

},{}],28:[function(require,module,exports){
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

RectangleD.prototype.getX = function ()
{
  return this.x;
};

RectangleD.prototype.setX = function (x)
{
  this.x = x;
};

RectangleD.prototype.getY = function ()
{
  return this.y;
};

RectangleD.prototype.setY = function (y)
{
  this.y = y;
};

RectangleD.prototype.getWidth = function ()
{
  return this.width;
};

RectangleD.prototype.setWidth = function (width)
{
  this.width = width;
};

RectangleD.prototype.getHeight = function ()
{
  return this.height;
};

RectangleD.prototype.setHeight = function (height)
{
  this.height = height;
};

RectangleD.prototype.getRight = function ()
{
  return this.x + this.width;
};

RectangleD.prototype.getBottom = function ()
{
  return this.y + this.height;
};

RectangleD.prototype.intersects = function (a)
{
  if (this.getRight() < a.x)
  {
    return false;
  }

  if (this.getBottom() < a.y)
  {
    return false;
  }

  if (a.getRight() < this.x)
  {
    return false;
  }

  if (a.getBottom() < this.y)
  {
    return false;
  }

  return true;
};

RectangleD.prototype.getCenterX = function ()
{
  return this.x + this.width / 2;
};

RectangleD.prototype.getMinX = function ()
{
  return this.getX();
};

RectangleD.prototype.getMaxX = function ()
{
  return this.getX() + this.width;
};

RectangleD.prototype.getCenterY = function ()
{
  return this.y + this.height / 2;
};

RectangleD.prototype.getMinY = function ()
{
  return this.getY();
};

RectangleD.prototype.getMaxY = function ()
{
  return this.getY() + this.height;
};

RectangleD.prototype.getWidthHalf = function ()
{
  return this.width / 2;
};

RectangleD.prototype.getHeightHalf = function ()
{
  return this.height / 2;
};

module.exports = RectangleD;

},{}],29:[function(require,module,exports){
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

Transform.prototype.getWorldOrgX = function ()
{
  return this.lworldOrgX;
}

Transform.prototype.setWorldOrgX = function (wox)
{
  this.lworldOrgX = wox;
}

Transform.prototype.getWorldOrgY = function ()
{
  return this.lworldOrgY;
}

Transform.prototype.setWorldOrgY = function (woy)
{
  this.lworldOrgY = woy;
}

Transform.prototype.getWorldExtX = function ()
{
  return this.lworldExtX;
}

Transform.prototype.setWorldExtX = function (wex)
{
  this.lworldExtX = wex;
}

Transform.prototype.getWorldExtY = function ()
{
  return this.lworldExtY;
}

Transform.prototype.setWorldExtY = function (wey)
{
  this.lworldExtY = wey;
}

/* Device related */

Transform.prototype.getDeviceOrgX = function ()
{
  return this.ldeviceOrgX;
}

Transform.prototype.setDeviceOrgX = function (dox)
{
  this.ldeviceOrgX = dox;
}

Transform.prototype.getDeviceOrgY = function ()
{
  return this.ldeviceOrgY;
}

Transform.prototype.setDeviceOrgY = function (doy)
{
  this.ldeviceOrgY = doy;
}

Transform.prototype.getDeviceExtX = function ()
{
  return this.ldeviceExtX;
}

Transform.prototype.setDeviceExtX = function (dex)
{
  this.ldeviceExtX = dex;
}

Transform.prototype.getDeviceExtY = function ()
{
  return this.ldeviceExtY;
}

Transform.prototype.setDeviceExtY = function (dey)
{
  this.ldeviceExtY = dey;
}

Transform.prototype.transformX = function (x)
{
  var xDevice = 0.0;
  var worldExtX = this.lworldExtX;
  if (worldExtX != 0.0)
  {
    xDevice = this.ldeviceOrgX +
            ((x - this.lworldOrgX) * this.ldeviceExtX / worldExtX);
  }

  return xDevice;
}

Transform.prototype.transformY = function (y)
{
  var yDevice = 0.0;
  var worldExtY = this.lworldExtY;
  if (worldExtY != 0.0)
  {
    yDevice = this.ldeviceOrgY +
            ((y - this.lworldOrgY) * this.ldeviceExtY / worldExtY);
  }


  return yDevice;
}

Transform.prototype.inverseTransformX = function (x)
{
  var xWorld = 0.0;
  var deviceExtX = this.ldeviceExtX;
  if (deviceExtX != 0.0)
  {
    xWorld = this.lworldOrgX +
            ((x - this.ldeviceOrgX) * this.lworldExtX / deviceExtX);
  }


  return xWorld;
}

Transform.prototype.inverseTransformY = function (y)
{
  var yWorld = 0.0;
  var deviceExtY = this.ldeviceExtY;
  if (deviceExtY != 0.0)
  {
    yWorld = this.lworldOrgY +
            ((y - this.ldeviceOrgY) * this.lworldExtY / deviceExtY);
  }
  return yWorld;
}

Transform.prototype.inverseTransformPoint = function (inPoint)
{
  var outPoint =
          new PointD(this.inverseTransformX(inPoint.x),
                  this.inverseTransformY(inPoint.y));
  return outPoint;
}

module.exports = Transform;

},{"./PointD":26}],30:[function(require,module,exports){
function UniqueIDGeneretor() {
}

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
}

UniqueIDGeneretor.getString = function (id) {
  if (id == null)
    id = UniqueIDGeneretor.lastID;
  return "Object#" + id + "";
}

UniqueIDGeneretor.isPrimitive = function (arg) {
  var type = typeof arg;
  return arg == null || (type != "object" && type != "function");
}

module.exports = UniqueIDGeneretor;

},{}],31:[function(require,module,exports){
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
  ready: function () {
  },
  // Called on `layoutstop`
  stop: function () {
  },
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 10,
  // Padding for compounds
  paddingCompound: 15,
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
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8
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
//  TilingExtension(this); // Extend this instance with tiling functions
  this.options = extend(defaults, _options);
  getUserOptions(this.options);
}

var getUserOptions = function (options) {
  if (options.nodeRepulsion != null)
    CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
  if (options.idealEdgeLength != null)
    CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
  if (options.edgeElasticity != null)
    CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
  if (options.nestingFactor != null)
    CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.gravity != null)
    CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.numIter != null)
    CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.paddingCompound != null)
    CoSEConstants.DEFAULT_GRAPH_MARGIN = FDLayoutConstants.DEFAULT_GRAPH_MARGIN = LayoutConstants.DEFAULT_GRAPH_MARGIN = options.paddingCompound;
  if (options.gravityRange != null)
    CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if(options.gravityCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if(options.gravityRangeCompound != null)
    CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;

  CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL =
          !(options.randomize);
  CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = options.animate;
};

_CoSELayout.prototype.run = function () {
  var ready;
  var frameId;
  var options = this.options;
  var idToLNode = this.idToLNode = {};
  var layout = this.layout = new CoSELayout();
  var self = this;
  
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
    var e1 = gm.add(layout.newEdge(), sourceNode, targetNode);
    e1.id = edge.id();
  }
  
   var getPositions = function(ele, i){
    if(typeof ele === "number") {
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
  var iterateAnimated = function () {
    // Thigs to perform after nodes are repositioned on screen
    var afterReposition = function() {
      if (options.fit) {
        options.cy.fit(options.eles.nodes(), options.padding);
      }

      if (!ready) {
        ready = true;
        self.cy.one('layoutready', options.ready);
        self.cy.trigger({type: 'layoutready', layout: self});
      }
    };
    
    var ticksPerFrame = self.options.refresh;
    var isDone;

    for( var i = 0; i < ticksPerFrame && !isDone; i++ ){
      isDone = self.layout.tick();
    }
    
    // If layout is done
    if (isDone) {
      self.options.eles.nodes().positions(getPositions);
      
      afterReposition();
      
      // trigger layoutstop when the layout stops (e.g. finishes)
      self.cy.one('layoutstop', self.options.stop);
      self.cy.trigger('layoutstop');
      self.cy.trigger({ type: 'layoutstop', layout: self });

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      
      self.options.eles.nodes().removeScratch('coseBilkent');
      ready = false;
      return;
    }
    
    var animationData = self.layout.getPositionsData(); // Get positions of layout nodes note that all nodes may not be layout nodes because of tiling
    // Position nodes, for the nodes who are not passed to layout because of tiling return the position of their dummy compound
    options.eles.nodes().positions(function (ele, i) {
      if (typeof ele === "number") {
        ele = i;
      }
      if (ele.scratch('coseBilkent') && ele.scratch('coseBilkent').dummy_parent_id) {
        var dummyParent = ele.scratch('coseBilkent').dummy_parent_id;
        return {
          x: dummyParent.x,
          y: dummyParent.y
        };
      }
      var theId = ele.data('id');
      var pNode = animationData[theId];
      var temp = ele;
      while (pNode == null) {
        temp = temp.parent()[0];
        pNode = animationData[temp.id()];
        animationData[theId] = pNode;
      }
      return {
        x: pNode.x,
        y: pNode.y
      };
    });

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
  if(this.options.animate !== 'during'){
    setTimeout(function() {
      self.options.eles.nodes().not(":parent").layoutPositions(self, self.options, getPositions); // Use layout positions to reposition the nodes it considers the options parameter
      self.options.eles.nodes().removeScratch('coseBilkent');
      ready = false;
    }, 0);
    
  }

  return this; // chaining
};

//Get the top most ones of a list of nodes
_CoSELayout.prototype.getTopMostNodes = function(nodes) {
  var nodesMap = {};
  for (var i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
  }
  var roots = nodes.filter(function (ele, i) {
      if(typeof ele === "number") {
        ele = i;
      }
      var parent = ele.parent()[0];
      while(parent != null){
        if(nodesMap[parent.id()]){
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
    this.options.eles.nodes().length;
    var children_of_children = theChild.children();
    var theNode;

    if (theChild.width() != null
            && theChild.height() != null) {
      theNode = parent.add(new CoSENode(layout.graphManager,
              new PointD(theChild.position('x'), theChild.position('y')),
              new DimensionD(parseFloat(theChild.width()),
                      parseFloat(theChild.height()))));
    }
    else {
      theNode = parent.add(new CoSENode(this.graphManager));
    }
    theNode.id = theChild.data("id");
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
  
  this.trigger('layoutstop');

  return this; // chaining
};

module.exports = function get(cytoscape) {
  return _CoSELayout;
};

},{"./CoSEConstants":1,"./CoSEEdge":2,"./CoSEGraph":3,"./CoSEGraphManager":4,"./CoSELayout":5,"./CoSENode":6,"./DimensionD":7,"./FDLayout":9,"./FDLayoutConstants":10,"./FDLayoutEdge":11,"./FDLayoutNode":12,"./HashMap":13,"./HashSet":14,"./IGeometry":15,"./IMath":16,"./Integer":17,"./LEdge":18,"./LGraph":19,"./LGraphManager":20,"./LGraphObject":21,"./LNode":22,"./Layout":23,"./LayoutConstants":24,"./Point":25,"./PointD":26,"./RandomSeed":27,"./RectangleD":28,"./Transform":29,"./UniqueIDGeneretor":30}],32:[function(require,module,exports){
'use strict';

// registers the extension on a cytoscape lib ref
var getLayout = require('./Layout');

var register = function( cytoscape ){
  var Layout = getLayout( cytoscape );

  cytoscape('layout', 'cose-bilkent', Layout);
};

// auto reg for globals
if( typeof cytoscape !== 'undefined' ){
  register( cytoscape );
}

module.exports = register;

},{"./Layout":31}]},{},[32])(32)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvTGF5b3V0L0NvU0VDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L0NvU0VFZGdlLmpzIiwic3JjL0xheW91dC9Db1NFR3JhcGguanMiLCJzcmMvTGF5b3V0L0NvU0VHcmFwaE1hbmFnZXIuanMiLCJzcmMvTGF5b3V0L0NvU0VMYXlvdXQuanMiLCJzcmMvTGF5b3V0L0NvU0VOb2RlLmpzIiwic3JjL0xheW91dC9EaW1lbnNpb25ELmpzIiwic3JjL0xheW91dC9FbWl0dGVyLmpzIiwic3JjL0xheW91dC9GRExheW91dC5qcyIsInNyYy9MYXlvdXQvRkRMYXlvdXRDb25zdGFudHMuanMiLCJzcmMvTGF5b3V0L0ZETGF5b3V0RWRnZS5qcyIsInNyYy9MYXlvdXQvRkRMYXlvdXROb2RlLmpzIiwic3JjL0xheW91dC9IYXNoTWFwLmpzIiwic3JjL0xheW91dC9IYXNoU2V0LmpzIiwic3JjL0xheW91dC9JR2VvbWV0cnkuanMiLCJzcmMvTGF5b3V0L0lNYXRoLmpzIiwic3JjL0xheW91dC9JbnRlZ2VyLmpzIiwic3JjL0xheW91dC9MRWRnZS5qcyIsInNyYy9MYXlvdXQvTEdyYXBoLmpzIiwic3JjL0xheW91dC9MR3JhcGhNYW5hZ2VyLmpzIiwic3JjL0xheW91dC9MR3JhcGhPYmplY3QuanMiLCJzcmMvTGF5b3V0L0xOb2RlLmpzIiwic3JjL0xheW91dC9MYXlvdXQuanMiLCJzcmMvTGF5b3V0L0xheW91dENvbnN0YW50cy5qcyIsInNyYy9MYXlvdXQvUG9pbnQuanMiLCJzcmMvTGF5b3V0L1BvaW50RC5qcyIsInNyYy9MYXlvdXQvUmFuZG9tU2VlZC5qcyIsInNyYy9MYXlvdXQvUmVjdGFuZ2xlRC5qcyIsInNyYy9MYXlvdXQvVHJhbnNmb3JtLmpzIiwic3JjL0xheW91dC9VbmlxdWVJREdlbmVyZXRvci5qcyIsInNyYy9MYXlvdXQvaW5kZXguanMiLCJzcmMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VDb25zdGFudHMoKSB7XHJcbn1cclxuXHJcbi8vQ29TRUNvbnN0YW50cyBpbmhlcml0cyBzdGF0aWMgcHJvcHMgaW4gRkRMYXlvdXRDb25zdGFudHNcclxuZm9yICh2YXIgcHJvcCBpbiBGRExheW91dENvbnN0YW50cykge1xyXG4gIENvU0VDb25zdGFudHNbcHJvcF0gPSBGRExheW91dENvbnN0YW50c1twcm9wXTtcclxufVxyXG5cclxuQ29TRUNvbnN0YW50cy5ERUZBVUxUX1VTRV9NVUxUSV9MRVZFTF9TQ0FMSU5HID0gZmFsc2U7XHJcbkNvU0VDb25zdGFudHMuREVGQVVMVF9SQURJQUxfU0VQQVJBVElPTiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEg7XHJcbkNvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTiA9IDYwO1xyXG5Db1NFQ29uc3RhbnRzLkNPTVBMRVhfTUVNX0hPUklaT05UQUxfQlVGRkVSID0gNTtcclxuQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9WRVJUSUNBTF9CVUZGRVIgPSA1O1xyXG5Db1NFQ29uc3RhbnRzLkNPTVBMRVhfTUVNX01BUkdJTiA9IDIwO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb1NFQ29uc3RhbnRzO1xyXG4iLCJ2YXIgRkRMYXlvdXRFZGdlID0gcmVxdWlyZSgnLi9GRExheW91dEVkZ2UnKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xyXG4gIEZETGF5b3V0RWRnZS5jYWxsKHRoaXMsIHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSk7XHJcbn1cclxuXHJcbkNvU0VFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRkRMYXlvdXRFZGdlLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXRFZGdlKSB7XHJcbiAgQ29TRUVkZ2VbcHJvcF0gPSBGRExheW91dEVkZ2VbcHJvcF07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29TRUVkZ2VcclxuIiwidmFyIExHcmFwaCA9IHJlcXVpcmUoJy4vTEdyYXBoJyk7XHJcblxyXG5mdW5jdGlvbiBDb1NFR3JhcGgocGFyZW50LCBncmFwaE1nciwgdkdyYXBoKSB7XHJcbiAgTEdyYXBoLmNhbGwodGhpcywgcGFyZW50LCBncmFwaE1nciwgdkdyYXBoKTtcclxufVxyXG5cclxuQ29TRUdyYXBoLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoKSB7XHJcbiAgQ29TRUdyYXBoW3Byb3BdID0gTEdyYXBoW3Byb3BdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VHcmFwaDtcclxuIiwidmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VHcmFwaE1hbmFnZXIobGF5b3V0KSB7XHJcbiAgTEdyYXBoTWFuYWdlci5jYWxsKHRoaXMsIGxheW91dCk7XHJcbn1cclxuXHJcbkNvU0VHcmFwaE1hbmFnZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMR3JhcGhNYW5hZ2VyLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gTEdyYXBoTWFuYWdlcikge1xyXG4gIENvU0VHcmFwaE1hbmFnZXJbcHJvcF0gPSBMR3JhcGhNYW5hZ2VyW3Byb3BdO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VHcmFwaE1hbmFnZXI7XHJcbiIsInZhciBGRExheW91dCA9IHJlcXVpcmUoJy4vRkRMYXlvdXQnKTtcclxudmFyIENvU0VHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvU0VHcmFwaE1hbmFnZXInKTtcclxudmFyIENvU0VHcmFwaCA9IHJlcXVpcmUoJy4vQ29TRUdyYXBoJyk7XHJcbnZhciBDb1NFTm9kZSA9IHJlcXVpcmUoJy4vQ29TRU5vZGUnKTtcclxudmFyIENvU0VFZGdlID0gcmVxdWlyZSgnLi9Db1NFRWRnZScpO1xyXG52YXIgQ29TRUNvbnN0YW50cyA9IHJlcXVpcmUoJy4vQ29TRUNvbnN0YW50cycpO1xyXG52YXIgRkRMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0ZETGF5b3V0Q29uc3RhbnRzJyk7XHJcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xyXG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL1BvaW50Jyk7XHJcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xyXG52YXIgTGF5b3V0ID0gcmVxdWlyZSgnLi9MYXlvdXQnKTtcclxudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcclxudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XHJcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xyXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9UcmFuc2Zvcm0nKTtcclxudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcclxuXHJcbmZ1bmN0aW9uIENvU0VMYXlvdXQoKSB7XHJcbiAgRkRMYXlvdXQuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLmNoaWxkR3JhcGhNYXAgPSBuZXcgSGFzaE1hcCgpO1xyXG4gIHRoaXMuY29tcGxleE9yZGVyID0gW107XHJcbiAgdGhpcy5kdW1teUNvbXBsZXhMaXN0ID0gW107XHJcbiAgdGhpcy5lbXB0aWVkRHVtbXlDb21wbGV4TWFwID0gbmV3IEhhc2hNYXAoKTtcclxuICB0aGlzLm1lbWJlclBhY2tNYXAgPSBuZXcgSGFzaE1hcCgpO1xyXG59XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRkRMYXlvdXQucHJvdG90eXBlKTtcclxuXHJcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXQpIHtcclxuICBDb1NFTGF5b3V0W3Byb3BdID0gRkRMYXlvdXRbcHJvcF07XHJcbn1cclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLm5ld0dyYXBoTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZ20gPSBuZXcgQ29TRUdyYXBoTWFuYWdlcih0aGlzKTtcclxuICB0aGlzLmdyYXBoTWFuYWdlciA9IGdtO1xyXG4gIHJldHVybiBnbTtcclxufTtcclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLm5ld0dyYXBoID0gZnVuY3Rpb24gKHZHcmFwaCkge1xyXG4gIHJldHVybiBuZXcgQ29TRUdyYXBoKG51bGwsIHRoaXMuZ3JhcGhNYW5hZ2VyLCB2R3JhcGgpO1xyXG59O1xyXG5cclxuQ29TRUxheW91dC5wcm90b3R5cGUubmV3Tm9kZSA9IGZ1bmN0aW9uICh2Tm9kZSkge1xyXG4gIHJldHVybiBuZXcgQ29TRU5vZGUodGhpcy5ncmFwaE1hbmFnZXIsIHZOb2RlKTtcclxufTtcclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLm5ld0VkZ2UgPSBmdW5jdGlvbiAodkVkZ2UpIHtcclxuICByZXR1cm4gbmV3IENvU0VFZGdlKG51bGwsIG51bGwsIHZFZGdlKTtcclxufTtcclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gIEZETGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycy5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgaWYgKCF0aGlzLmlzU3ViTGF5b3V0KSB7XHJcbiAgICBpZiAoQ29TRUNvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIIDwgMTApXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuaWRlYWxFZGdlTGVuZ3RoID0gMTA7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuaWRlYWxFZGdlTGVuZ3RoID0gQ29TRUNvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXNlU21hcnRJZGVhbEVkZ2VMZW5ndGhDYWxjdWxhdGlvbiA9XHJcbiAgICAgICAgICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT047XHJcbiAgICB0aGlzLnNwcmluZ0NvbnN0YW50ID1cclxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9TUFJJTkdfU1RSRU5HVEg7XHJcbiAgICB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ID1cclxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEg7XHJcbiAgICB0aGlzLmdyYXZpdHlDb25zdGFudCA9XHJcbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9TVFJFTkdUSDtcclxuICAgIHRoaXMuY29tcG91bmRHcmF2aXR5Q29uc3RhbnQgPVxyXG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0NPTVBPVU5EX0dSQVZJVFlfU1RSRU5HVEg7XHJcbiAgICB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvciA9XHJcbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XHJcbiAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eVJhbmdlRmFjdG9yID1cclxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUjtcclxuICB9XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5sYXlvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gcHJlLWxheW91dCBzdGVwIGZvciB0aWxpbmdcclxuICB0aGlzLmdyb3VwWmVyb0RlZ3JlZU1lbWJlcnMoKTtcclxuICB0aGlzLmFwcGx5REZTT25Db21wbGV4ZXMoKTtcclxuICBcclxuICAvLyBvcmlnaW5hbCBjb3NlIGxheW91dFxyXG4gIHZhciBjcmVhdGVCZW5kc0FzTmVlZGVkID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRDtcclxuICBpZiAoY3JlYXRlQmVuZHNBc05lZWRlZClcclxuICB7XHJcbiAgICB0aGlzLmNyZWF0ZUJlbmRwb2ludHMoKTtcclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsRWRnZXMoKTtcclxuICB9XHJcblxyXG4gIHRoaXMubGV2ZWwgPSAwO1xyXG4gIHZhciByZXRWYWwgPSB0aGlzLmNsYXNzaWNMYXlvdXQoKTtcclxuICBcclxuICAvLyBwb3N0IGxheW91dCBzdGVwIGZvciB0aWxpbmdcclxuICB0aGlzLnJlcG9wdWxhdGVDb21wbGV4ZXMoKTtcclxuICBcclxuICByZXR1cm4gcmV0VmFsO1xyXG59O1xyXG5cclxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xhc3NpY0xheW91dCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8oKTtcclxuICB0aGlzLmdyYXBoTWFuYWdlci5jYWxjTG93ZXN0Q29tbW9uQW5jZXN0b3JzKCk7XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIuY2FsY0luY2x1c2lvblRyZWVEZXB0aHMoKTtcclxuICB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuY2FsY0VzdGltYXRlZFNpemUoKTtcclxuICB0aGlzLmNhbGNJZGVhbEVkZ2VMZW5ndGhzKCk7XHJcbiAgaWYgKCF0aGlzLmluY3JlbWVudGFsKVxyXG4gIHtcclxuICAgIHZhciBmb3Jlc3QgPSB0aGlzLmdldEZsYXRGb3Jlc3QoKTtcclxuXHJcbiAgICAvLyBUaGUgZ3JhcGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgbGF5b3V0IGlzIGZsYXQgYW5kIGEgZm9yZXN0XHJcbiAgICBpZiAoZm9yZXN0Lmxlbmd0aCA+IDApXHJcblxyXG4gICAge1xyXG4gICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYWRpYWxseShmb3Jlc3QpO1xyXG4gICAgfVxyXG4gICAgLy8gVGhlIGdyYXBoIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGxheW91dCBpcyBub3QgZmxhdCBvciBhIGZvcmVzdFxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5pbml0U3ByaW5nRW1iZWRkZXIoKTtcclxuICB0aGlzLnJ1blNwcmluZ0VtYmVkZGVyKCk7XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuQ29TRUxheW91dC5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xyXG4gIHRoaXMudG90YWxJdGVyYXRpb25zKys7XHJcbiAgXHJcbiAgaWYgKHRoaXMudG90YWxJdGVyYXRpb25zID09PSB0aGlzLm1heEl0ZXJhdGlvbnMpIHtcclxuICAgIHJldHVybiB0cnVlOyAvLyBMYXlvdXQgaXMgbm90IGVuZGVkIHJldHVybiB0cnVlXHJcbiAgfVxyXG4gIFxyXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyAlIEZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9PSAwKVxyXG4gIHtcclxuICAgIGlmICh0aGlzLmlzQ29udmVyZ2VkKCkpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiB0cnVlOyAvLyBMYXlvdXQgaXMgbm90IGVuZGVkIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb29saW5nRmFjdG9yID0gdGhpcy5pbml0aWFsQ29vbGluZ0ZhY3RvciAqXHJcbiAgICAgICAgICAgICgodGhpcy5tYXhJdGVyYXRpb25zIC0gdGhpcy50b3RhbEl0ZXJhdGlvbnMpIC8gdGhpcy5tYXhJdGVyYXRpb25zKTtcclxuICAgIHRoaXMuYW5pbWF0aW9uUGVyaW9kID0gTWF0aC5jZWlsKHRoaXMuaW5pdGlhbEFuaW1hdGlvblBlcmlvZCAqIE1hdGguc3FydCh0aGlzLmNvb2xpbmdGYWN0b3IpKTtcclxuXHJcbiAgfVxyXG4gIHRoaXMudG90YWxEaXNwbGFjZW1lbnQgPSAwO1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xyXG4gIHRoaXMuY2FsY1NwcmluZ0ZvcmNlcygpO1xyXG4gIHRoaXMuY2FsY1JlcHVsc2lvbkZvcmNlcygpO1xyXG4gIHRoaXMuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZXMoKTtcclxuICB0aGlzLm1vdmVOb2RlcygpO1xyXG4gIHRoaXMuYW5pbWF0ZSgpO1xyXG4gIFxyXG4gIHJldHVybiBmYWxzZTsgLy8gTGF5b3V0IGlzIG5vdCBlbmRlZCB5ZXQgcmV0dXJuIGZhbHNlXHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5nZXRQb3NpdGlvbnNEYXRhID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGFsbE5vZGVzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXMoKTtcclxuICB2YXIgcERhdGEgPSB7fTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcmVjdCA9IGFsbE5vZGVzW2ldLnJlY3Q7XHJcbiAgICB2YXIgaWQgPSBhbGxOb2Rlc1tpXS5pZDtcclxuICAgIHBEYXRhW2lkXSA9IHtcclxuICAgICAgaWQ6IGlkLFxyXG4gICAgICB4OiByZWN0LmdldENlbnRlclgoKSxcclxuICAgICAgeTogcmVjdC5nZXRDZW50ZXJZKCksXHJcbiAgICAgIHc6IHJlY3Qud2lkdGgsXHJcbiAgICAgIGg6IHJlY3QuaGVpZ2h0XHJcbiAgICB9O1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gcERhdGE7XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5ydW5TcHJpbmdFbWJlZGRlciA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmluaXRpYWxBbmltYXRpb25QZXJpb2QgPSAyNTtcclxuICB0aGlzLmFuaW1hdGlvblBlcmlvZCA9IHRoaXMuaW5pdGlhbEFuaW1hdGlvblBlcmlvZDtcclxuICB2YXIgbGF5b3V0RW5kZWQgPSBmYWxzZTtcclxuICBcclxuICAvLyBJZiBhbWluYXRlIG9wdGlvbiBpcyAnZHVyaW5nJyBzaWduYWwgdGhhdCBsYXlvdXQgaXMgc3VwcG9zZWQgdG8gc3RhcnQgaXRlcmF0aW5nXHJcbiAgaWYgKCBGRExheW91dENvbnN0YW50cy5BTklNQVRFID09PSAnZHVyaW5nJyApIHtcclxuICAgIHRoaXMuZW1pdCgnbGF5b3V0c3RhcnRlZCcpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIC8vIElmIGFtaW5hdGUgb3B0aW9uIGlzICdkdXJpbmcnIHRpY2soKSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbiBpbmRleC5qc1xyXG4gICAgd2hpbGUgKCFsYXlvdXRFbmRlZCkge1xyXG4gICAgICBsYXlvdXRFbmRlZCA9IHRoaXMudGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnVwZGF0ZUJvdW5kcygpO1xyXG4gIH1cclxufTtcclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG5vZGVMaXN0ID0gW107XHJcbiAgdmFyIGdyYXBoO1xyXG5cclxuICB2YXIgZ3JhcGhzID0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0R3JhcGhzKCk7XHJcbiAgdmFyIHNpemUgPSBncmFwaHMubGVuZ3RoO1xyXG4gIHZhciBpO1xyXG4gIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpKyspXHJcbiAge1xyXG4gICAgZ3JhcGggPSBncmFwaHNbaV07XHJcblxyXG4gICAgZ3JhcGgudXBkYXRlQ29ubmVjdGVkKCk7XHJcblxyXG4gICAgaWYgKCFncmFwaC5pc0Nvbm5lY3RlZClcclxuICAgIHtcclxuICAgICAgbm9kZUxpc3QgPSBub2RlTGlzdC5jb25jYXQoZ3JhcGguZ2V0Tm9kZXMoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLmdyYXBoTWFuYWdlci5zZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbihub2RlTGlzdCk7XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jcmVhdGVCZW5kcG9pbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBlZGdlcyA9IFtdO1xyXG4gIGVkZ2VzID0gZWRnZXMuY29uY2F0KHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbEVkZ2VzKCkpO1xyXG4gIHZhciB2aXNpdGVkID0gbmV3IEhhc2hTZXQoKTtcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcclxuXHJcbiAgICBpZiAoIXZpc2l0ZWQuY29udGFpbnMoZWRnZSkpXHJcbiAgICB7XHJcbiAgICAgIHZhciBzb3VyY2UgPSBlZGdlLmdldFNvdXJjZSgpO1xyXG4gICAgICB2YXIgdGFyZ2V0ID0gZWRnZS5nZXRUYXJnZXQoKTtcclxuXHJcbiAgICAgIGlmIChzb3VyY2UgPT0gdGFyZ2V0KVxyXG4gICAgICB7XHJcbiAgICAgICAgZWRnZS5nZXRCZW5kcG9pbnRzKCkucHVzaChuZXcgUG9pbnREKCkpO1xyXG4gICAgICAgIGVkZ2UuZ2V0QmVuZHBvaW50cygpLnB1c2gobmV3IFBvaW50RCgpKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUR1bW15Tm9kZXNGb3JCZW5kcG9pbnRzKGVkZ2UpO1xyXG4gICAgICAgIHZpc2l0ZWQuYWRkKGVkZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHZhciBlZGdlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICBlZGdlTGlzdCA9IGVkZ2VMaXN0LmNvbmNhdChzb3VyY2UuZ2V0RWRnZUxpc3RUb05vZGUodGFyZ2V0KSk7XHJcbiAgICAgICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQodGFyZ2V0LmdldEVkZ2VMaXN0VG9Ob2RlKHNvdXJjZSkpO1xyXG5cclxuICAgICAgICBpZiAoIXZpc2l0ZWQuY29udGFpbnMoZWRnZUxpc3RbMF0pKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlmIChlZGdlTGlzdC5sZW5ndGggPiAxKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaztcclxuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGVkZ2VMaXN0Lmxlbmd0aDsgaysrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIG11bHRpRWRnZSA9IGVkZ2VMaXN0W2tdO1xyXG4gICAgICAgICAgICAgIG11bHRpRWRnZS5nZXRCZW5kcG9pbnRzKCkucHVzaChuZXcgUG9pbnREKCkpO1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JlYXRlRHVtbXlOb2Rlc0ZvckJlbmRwb2ludHMobXVsdGlFZGdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmlzaXRlZC5hZGRBbGwobGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZpc2l0ZWQuc2l6ZSgpID09IGVkZ2VzLmxlbmd0aClcclxuICAgIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuQ29TRUxheW91dC5wcm90b3R5cGUucG9zaXRpb25Ob2Rlc1JhZGlhbGx5ID0gZnVuY3Rpb24gKGZvcmVzdCkge1xyXG4gIC8vIFdlIHRpbGUgdGhlIHRyZWVzIHRvIGEgZ3JpZCByb3cgYnkgcm93OyBmaXJzdCB0cmVlIHN0YXJ0cyBhdCAoMCwwKVxyXG4gIHZhciBjdXJyZW50U3RhcnRpbmdQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcclxuICB2YXIgbnVtYmVyT2ZDb2x1bW5zID0gTWF0aC5jZWlsKE1hdGguc3FydChmb3Jlc3QubGVuZ3RoKSk7XHJcbiAgdmFyIGhlaWdodCA9IDA7XHJcbiAgdmFyIGN1cnJlbnRZID0gMDtcclxuICB2YXIgY3VycmVudFggPSAwO1xyXG4gIHZhciBwb2ludCA9IG5ldyBQb2ludEQoMCwgMCk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZm9yZXN0Lmxlbmd0aDsgaSsrKVxyXG4gIHtcclxuICAgIGlmIChpICUgbnVtYmVyT2ZDb2x1bW5zID09IDApXHJcbiAgICB7XHJcbiAgICAgIC8vIFN0YXJ0IG9mIGEgbmV3IHJvdywgbWFrZSB0aGUgeCBjb29yZGluYXRlIDAsIGluY3JlbWVudCB0aGVcclxuICAgICAgLy8geSBjb29yZGluYXRlIHdpdGggdGhlIG1heCBoZWlnaHQgb2YgdGhlIHByZXZpb3VzIHJvd1xyXG4gICAgICBjdXJyZW50WCA9IDA7XHJcbiAgICAgIGN1cnJlbnRZID0gaGVpZ2h0O1xyXG5cclxuICAgICAgaWYgKGkgIT0gMClcclxuICAgICAge1xyXG4gICAgICAgIGN1cnJlbnRZICs9IENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaGVpZ2h0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdHJlZSA9IGZvcmVzdFtpXTtcclxuXHJcbiAgICAvLyBGaW5kIHRoZSBjZW50ZXIgb2YgdGhlIHRyZWVcclxuICAgIHZhciBjZW50ZXJOb2RlID0gTGF5b3V0LmZpbmRDZW50ZXJPZlRyZWUodHJlZSk7XHJcblxyXG4gICAgLy8gU2V0IHRoZSBzdGFyaW5nIHBvaW50IG9mIHRoZSBuZXh0IHRyZWVcclxuICAgIGN1cnJlbnRTdGFydGluZ1BvaW50LnggPSBjdXJyZW50WDtcclxuICAgIGN1cnJlbnRTdGFydGluZ1BvaW50LnkgPSBjdXJyZW50WTtcclxuXHJcbiAgICAvLyBEbyBhIHJhZGlhbCBsYXlvdXQgc3RhcnRpbmcgd2l0aCB0aGUgY2VudGVyXHJcbiAgICBwb2ludCA9XHJcbiAgICAgICAgICAgIENvU0VMYXlvdXQucmFkaWFsTGF5b3V0KHRyZWUsIGNlbnRlck5vZGUsIGN1cnJlbnRTdGFydGluZ1BvaW50KTtcclxuXHJcbiAgICBpZiAocG9pbnQueSA+IGhlaWdodClcclxuICAgIHtcclxuICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vcihwb2ludC55KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXJyZW50WCA9IE1hdGguZmxvb3IocG9pbnQueCArIENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT05FTlRfU0VQRVJBVElPTik7XHJcbiAgfVxyXG5cclxuICB0aGlzLnRyYW5zZm9ybShcclxuICAgICAgICAgIG5ldyBQb2ludEQoTGF5b3V0Q29uc3RhbnRzLldPUkxEX0NFTlRFUl9YIC0gcG9pbnQueCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgIExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWSAtIHBvaW50LnkgLyAyKSk7XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnJhZGlhbExheW91dCA9IGZ1bmN0aW9uICh0cmVlLCBjZW50ZXJOb2RlLCBzdGFydGluZ1BvaW50KSB7XHJcbiAgdmFyIHJhZGlhbFNlcCA9IE1hdGgubWF4KHRoaXMubWF4RGlhZ29uYWxJblRyZWUodHJlZSksXHJcbiAgICAgICAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfUkFESUFMX1NFUEFSQVRJT04pO1xyXG4gIENvU0VMYXlvdXQuYnJhbmNoUmFkaWFsTGF5b3V0KGNlbnRlck5vZGUsIG51bGwsIDAsIDM1OSwgMCwgcmFkaWFsU2VwKTtcclxuICB2YXIgYm91bmRzID0gTEdyYXBoLmNhbGN1bGF0ZUJvdW5kcyh0cmVlKTtcclxuXHJcbiAgdmFyIHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oKTtcclxuICB0cmFuc2Zvcm0uc2V0RGV2aWNlT3JnWChib3VuZHMuZ2V0TWluWCgpKTtcclxuICB0cmFuc2Zvcm0uc2V0RGV2aWNlT3JnWShib3VuZHMuZ2V0TWluWSgpKTtcclxuICB0cmFuc2Zvcm0uc2V0V29ybGRPcmdYKHN0YXJ0aW5nUG9pbnQueCk7XHJcbiAgdHJhbnNmb3JtLnNldFdvcmxkT3JnWShzdGFydGluZ1BvaW50LnkpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIG5vZGUgPSB0cmVlW2ldO1xyXG4gICAgbm9kZS50cmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICB9XHJcblxyXG4gIHZhciBib3R0b21SaWdodCA9XHJcbiAgICAgICAgICBuZXcgUG9pbnREKGJvdW5kcy5nZXRNYXhYKCksIGJvdW5kcy5nZXRNYXhZKCkpO1xyXG5cclxuICByZXR1cm4gdHJhbnNmb3JtLmludmVyc2VUcmFuc2Zvcm1Qb2ludChib3R0b21SaWdodCk7XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LmJyYW5jaFJhZGlhbExheW91dCA9IGZ1bmN0aW9uIChub2RlLCBwYXJlbnRPZk5vZGUsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBkaXN0YW5jZSwgcmFkaWFsU2VwYXJhdGlvbikge1xyXG4gIC8vIEZpcnN0LCBwb3NpdGlvbiB0aGlzIG5vZGUgYnkgZmluZGluZyBpdHMgYW5nbGUuXHJcbiAgdmFyIGhhbGZJbnRlcnZhbCA9ICgoZW5kQW5nbGUgLSBzdGFydEFuZ2xlKSArIDEpIC8gMjtcclxuXHJcbiAgaWYgKGhhbGZJbnRlcnZhbCA8IDApXHJcbiAge1xyXG4gICAgaGFsZkludGVydmFsICs9IDE4MDtcclxuICB9XHJcblxyXG4gIHZhciBub2RlQW5nbGUgPSAoaGFsZkludGVydmFsICsgc3RhcnRBbmdsZSkgJSAzNjA7XHJcbiAgdmFyIHRldGEgPSAobm9kZUFuZ2xlICogSUdlb21ldHJ5LlRXT19QSSkgLyAzNjA7XHJcblxyXG4gIC8vIE1ha2UgcG9sYXIgdG8gamF2YSBjb3JkaW5hdGUgY29udmVyc2lvbi5cclxuICB2YXIgY29zX3RldGEgPSBNYXRoLmNvcyh0ZXRhKTtcclxuICB2YXIgeF8gPSBkaXN0YW5jZSAqIE1hdGguY29zKHRldGEpO1xyXG4gIHZhciB5XyA9IGRpc3RhbmNlICogTWF0aC5zaW4odGV0YSk7XHJcblxyXG4gIG5vZGUuc2V0Q2VudGVyKHhfLCB5Xyk7XHJcblxyXG4gIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlIGFuZCByZWN1cnNpdmVseSBjYWxsIHRoaXNcclxuICAvLyBmdW5jdGlvbi5cclxuICB2YXIgbmVpZ2hib3JFZGdlcyA9IFtdO1xyXG4gIG5laWdoYm9yRWRnZXMgPSBuZWlnaGJvckVkZ2VzLmNvbmNhdChub2RlLmdldEVkZ2VzKCkpO1xyXG4gIHZhciBjaGlsZENvdW50ID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XHJcblxyXG4gIGlmIChwYXJlbnRPZk5vZGUgIT0gbnVsbClcclxuICB7XHJcbiAgICBjaGlsZENvdW50LS07XHJcbiAgfVxyXG5cclxuICB2YXIgYnJhbmNoQ291bnQgPSAwO1xyXG5cclxuICB2YXIgaW5jRWRnZXNDb3VudCA9IG5laWdoYm9yRWRnZXMubGVuZ3RoO1xyXG4gIHZhciBzdGFydEluZGV4O1xyXG5cclxuICB2YXIgZWRnZXMgPSBub2RlLmdldEVkZ2VzQmV0d2VlbihwYXJlbnRPZk5vZGUpO1xyXG5cclxuICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgZWRnZXMsIHBydW5lIHRoZW0gdW50aWwgdGhlcmUgcmVtYWlucyBvbmx5IG9uZVxyXG4gIC8vIGVkZ2UuXHJcbiAgd2hpbGUgKGVkZ2VzLmxlbmd0aCA+IDEpXHJcbiAge1xyXG4gICAgLy9uZWlnaGJvckVkZ2VzLnJlbW92ZShlZGdlcy5yZW1vdmUoMCkpO1xyXG4gICAgdmFyIHRlbXAgPSBlZGdlc1swXTtcclxuICAgIGVkZ2VzLnNwbGljZSgwLCAxKTtcclxuICAgIHZhciBpbmRleCA9IG5laWdoYm9yRWRnZXMuaW5kZXhPZih0ZW1wKTtcclxuICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgIG5laWdoYm9yRWRnZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIGluY0VkZ2VzQ291bnQtLTtcclxuICAgIGNoaWxkQ291bnQtLTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJlbnRPZk5vZGUgIT0gbnVsbClcclxuICB7XHJcbiAgICAvL2Fzc2VydCBlZGdlcy5sZW5ndGggPT0gMTtcclxuICAgIHN0YXJ0SW5kZXggPSAobmVpZ2hib3JFZGdlcy5pbmRleE9mKGVkZ2VzWzBdKSArIDEpICUgaW5jRWRnZXNDb3VudDtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIHN0YXJ0SW5kZXggPSAwO1xyXG4gIH1cclxuXHJcbiAgdmFyIHN0ZXBBbmdsZSA9IE1hdGguYWJzKGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSkgLyBjaGlsZENvdW50O1xyXG5cclxuICBmb3IgKHZhciBpID0gc3RhcnRJbmRleDtcclxuICAgICAgICAgIGJyYW5jaENvdW50ICE9IGNoaWxkQ291bnQ7XHJcbiAgICAgICAgICBpID0gKCsraSkgJSBpbmNFZGdlc0NvdW50KVxyXG4gIHtcclxuICAgIHZhciBjdXJyZW50TmVpZ2hib3IgPVxyXG4gICAgICAgICAgICBuZWlnaGJvckVkZ2VzW2ldLmdldE90aGVyRW5kKG5vZGUpO1xyXG5cclxuICAgIC8vIERvbid0IGJhY2sgdHJhdmVyc2UgdG8gcm9vdCBub2RlIGluIGN1cnJlbnQgdHJlZS5cclxuICAgIGlmIChjdXJyZW50TmVpZ2hib3IgPT0gcGFyZW50T2ZOb2RlKVxyXG4gICAge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2hpbGRTdGFydEFuZ2xlID1cclxuICAgICAgICAgICAgKHN0YXJ0QW5nbGUgKyBicmFuY2hDb3VudCAqIHN0ZXBBbmdsZSkgJSAzNjA7XHJcbiAgICB2YXIgY2hpbGRFbmRBbmdsZSA9IChjaGlsZFN0YXJ0QW5nbGUgKyBzdGVwQW5nbGUpICUgMzYwO1xyXG5cclxuICAgIENvU0VMYXlvdXQuYnJhbmNoUmFkaWFsTGF5b3V0KGN1cnJlbnROZWlnaGJvcixcclxuICAgICAgICAgICAgbm9kZSxcclxuICAgICAgICAgICAgY2hpbGRTdGFydEFuZ2xlLCBjaGlsZEVuZEFuZ2xlLFxyXG4gICAgICAgICAgICBkaXN0YW5jZSArIHJhZGlhbFNlcGFyYXRpb24sIHJhZGlhbFNlcGFyYXRpb24pO1xyXG5cclxuICAgIGJyYW5jaENvdW50Kys7XHJcbiAgfVxyXG59O1xyXG5cclxuQ29TRUxheW91dC5tYXhEaWFnb25hbEluVHJlZSA9IGZ1bmN0aW9uICh0cmVlKSB7XHJcbiAgdmFyIG1heERpYWdvbmFsID0gSW50ZWdlci5NSU5fVkFMVUU7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKylcclxuICB7XHJcbiAgICB2YXIgbm9kZSA9IHRyZWVbaV07XHJcbiAgICB2YXIgZGlhZ29uYWwgPSBub2RlLmdldERpYWdvbmFsKCk7XHJcblxyXG4gICAgaWYgKGRpYWdvbmFsID4gbWF4RGlhZ29uYWwpXHJcbiAgICB7XHJcbiAgICAgIG1heERpYWdvbmFsID0gZGlhZ29uYWw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWF4RGlhZ29uYWw7XHJcbn07XHJcblxyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5jYWxjUmVwdWxzaW9uUmFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLy8gZm9ybXVsYSBpcyAyIHggKGxldmVsICsgMSkgeCBpZGVhbEVkZ2VMZW5ndGhcclxuICByZXR1cm4gKDIgKiAodGhpcy5sZXZlbCArIDEpICogdGhpcy5pZGVhbEVkZ2VMZW5ndGgpO1xyXG59O1xyXG5cclxuLy8gU2VjdGlvbjogVGlsaW5nIE1ldGhvZHNcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBmaW5kcyBhbGwgdGhlIHplcm8gZGVncmVlIG5vZGVzIGluIHRoZSBncmFwaCB3aGljaCBhcmUgbm90XHJcbiAqIG93bmVkIGJ5IGEgY29tcGxleCBub2RlLiBaZXJvIGRlZ3JlZSBub2RlcyBhdCBlYWNoIGxldmVsIGFyZSBncm91cGVkXHJcbiAqIHRvZ2V0aGVyIGFuZCBwbGFjZWQgaW5zaWRlIGEgZHVtbXkgY29tcGxleCB0byByZWR1Y2UgYm91bmRzIG9mIHJvb3RcclxuICogZ3JhcGguXHJcbiAqL1xyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5ncm91cFplcm9EZWdyZWVNZW1iZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBjaGlsZENvbXBsZXhNYXAgPSBuZXcgSGFzaE1hcCgpO1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldEdyYXBocygpLmZvckVhY2goZnVuY3Rpb24gKG93bmVyR3JhcGgpIHtcclxuICAgIHZhciB6ZXJvRGVncmVlTm9kZXMgPSBbXTtcclxuXHJcbiAgICAvLyBkbyBub3QgcHJvY2VzcyBjb21wbGV4IG5vZGVzICh0aGVpciBtZW1iZXJzIGFyZSBhbHJlYWR5IG93bmVkKVxyXG4gICAgaWYgKG93bmVyR3JhcGguZ2V0UGFyZW50KCkudHlwZSAhPSBudWxsICYmIG93bmVyR3JhcGguZ2V0UGFyZW50KCkuaXNDb21wbGV4KCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG93bmVyR3JhcGguZ2V0Tm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcblxyXG4gICAgICBpZiAoc2VsZi5jYWxjR3JhcGhEZWdyZWUobm9kZSkgPT09IDApXHJcbiAgICAgIHtcclxuICAgICAgICB6ZXJvRGVncmVlTm9kZXMucHVzaChub2RlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHplcm9EZWdyZWVOb2Rlcy5sZW5ndGggPiAxKVxyXG4gICAge1xyXG4gICAgICAvLyBjcmVhdGUgYSBuZXcgZHVtbXkgY29tcGxleFxyXG4gICAgICB2YXIgY29tcGxleCA9IHNlbGYubmV3Tm9kZShudWxsKTtcclxuICAgICAgLy8gVE9ETyByZXZpc2UgdGhpc1xyXG4gICAgICAvL2NvbXBsZXgudHlwZSA9IFNiZ25QRENvbnN0YW50cy5DT01QTEVYO1xyXG4gICAgICBjb21wbGV4LmxhYmVsID0gXCJEdW1teUNvbXBsZXhfXCIgKyBvd25lckdyYXBoLmdldFBhcmVudCgpLmxhYmVsO1xyXG5cclxuICAgICAgb3duZXJHcmFwaC5hZGQoY29tcGxleCk7XHJcblxyXG4gICAgICB2YXIgY2hpbGRHcmFwaCA9IHNlbGYubmV3R3JhcGgobnVsbCk7XHJcblxyXG4gICAgICB6ZXJvRGVncmVlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoemVyb05vZGUpIHtcclxuICAgICAgICBvd25lckdyYXBoLnJlbW92ZSh6ZXJvTm9kZSk7XHJcbiAgICAgICAgY2hpbGRHcmFwaC5hZGQoemVyb05vZGUpO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIHNlbGYuZHVtbXlDb21wbGV4TGlzdC5wdXNoKGNvbXBsZXgpO1xyXG4gICAgICBjaGlsZENvbXBsZXhNYXAucHV0KGNvbXBsZXgsIGNoaWxkR3JhcGgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB0aGlzLmR1bW15Q29tcGxleExpc3QuZm9yRWFjaChmdW5jdGlvbiAoY29tcGxleCkge1xyXG4gICAgc2VsZi5ncmFwaE1hbmFnZXIuYWRkKGNoaWxkQ29tcGxleE1hcC5nZXQoY29tcGxleCksIGNvbXBsZXgpO1xyXG4gIH0pO1xyXG5cclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnVwZGF0ZUJvdW5kcygpO1xyXG5cclxuICB0aGlzLmdyYXBoTWFuYWdlci5yZXNldEFsbE5vZGVzKCk7XHJcbiAgdGhpcy5ncmFwaE1hbmFnZXIucmVzZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbigpO1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsRWRnZXMoKTtcclxuICB0aGlzLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8oKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBzZWFyY2hlZCB1bm1hcmtlZCBjb21wbGV4IG5vZGVzIHJlY3Vyc2l2ZWx5LCBiZWNhdXNlIHRoZXkgbWF5XHJcbiAqIGNvbnRhaW4gY29tcGxleCBjaGlsZHJlbi4gQWZ0ZXIgdGhlIG9yZGVyIGlzIGZvdW5kLCBjaGlsZCBncmFwaHMgb2YgZWFjaFxyXG4gKiBjb21wbGV4IG5vZGUgYXJlIGNsZWFyZWQuXHJcbiAqL1xyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5hcHBseURGU09uQ29tcGxleGVzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICAvLyBMR3JhcGg+KCk7XHJcbiAgdGhpcy5nZXRBbGxOb2RlcygpLmZvckVhY2goZnVuY3Rpb24gKGNvbXApIHtcclxuICAgIGlmICghY29tcC5pc0NvbXBsZXggfHwgIWNvbXAuaXNDb21wbGV4KCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbXBsZXggaXMgZm91bmQsIHJlY3Vyc2Ugb24gaXQgdW50aWwgbm8gdmlzaXRlZCBjb21wbGV4IHJlbWFpbnMuXHJcbiAgICBpZiAoIWNvbXAudmlzaXRlZClcclxuICAgICAgc2VsZi5ERlNWaXNpdENvbXBsZXgoY29tcCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNsZWFyIGVhY2ggY29tcGxleFxyXG4gIHRoaXMuY29tcGxleE9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGNvbXApIHtcclxuICAgIHNlbGYuY2xlYXJDb21wbGV4KGNvbXApO1xyXG4gIH0pO1xyXG5cclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnVwZGF0ZUJvdW5kcygpO1xyXG5cclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsTm9kZXMoKTtcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsRWRnZXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIFJlYXNzaWducyB0aGUgY29tcGxleCBjb250ZW50LiBUaGUgb3V0ZXJtb3N0IGNvbXBsZXggaXMgcGxhY2VkIGZpcnN0LlxyXG4qL1xyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5yZXBvcHVsYXRlQ29tcGxleGVzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuZW1wdGllZER1bW15Q29tcGxleE1hcC5rZXlTZXQoKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbXApe1xyXG4gICAgdmFyIGNoR3IgPSB0aGlzLmVtcHRpZWREdW1teUNvbXBsZXhNYXAuZ2V0KGNvbXApO1xyXG4gICAgY29tcC5zZXRDaGlsZChjaEdyKTtcclxuICAgIHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0R3JhcGhzKCkuYWRkKGNoR3IpO1xyXG4gIH0pO1xyXG5cclxuICBmb3IgKHZhciBpID0gdGhpcy5jb21wbGV4T3JkZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAge1xyXG4gICAgICB2YXIgY29tcCA9IHRoaXMuY29tcGxleE9yZGVyW2ldO1xyXG4gICAgICB2YXIgY2hHciA9IHRoaXMuY2hpbGRHcmFwaE1hcC5nZXQoY29tcCk7XHJcblxyXG4gICAgICAvLyByZXBvcHVsYXRlIHRoZSBjb21wbGV4XHJcbiAgICAgIGNvbXAuc2V0Q2hpbGQoY2hHcik7XHJcblxyXG4gICAgICAvLyBpZiB0aGUgY2hpbGQgZ3JhcGggaXMgbm90IG51bGwsIGFkanVzdCB0aGUgcG9zaXRpb25zIG9mIG1lbWJlcnNcclxuICAgICAgaWYgKGNoR3IgIT0gbnVsbClcclxuICAgICAge1xyXG4gICAgICAgICAgLy8gYWRqdXN0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIG1lbWJlcnNcclxuICAgICAgICAgIHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0R3JhcGhzKCkuYWRkKGNoR3IpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB2YXIgcGFjayA9IHRoaXMubWVtYmVyUGFja01hcC5nZXQoY29tcCk7XHJcbiAgICAgICAgICBwYWNrLmFkanVzdExvY2F0aW9ucyhjb21wLmdldExlZnQoKSwgY29tcC5nZXRUb3AoKSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgdGhpcy5lbXB0aWVkRHVtbXlDb21wbGV4TWFwLmtleVNldCgpLmZvckVhY2goZnVuY3Rpb24oKXtcclxuICAgICB2YXIgY2hHciA9IHRoaXMuZW1wdGllZER1bW15Q29tcGxleE1hcC5nZXQoY29tcCk7XHJcblxyXG4gICAgIHNlbGYuYWRqdXN0TG9jYXRpb24oY29tcCwgY2hHcik7XHJcbiAgfSk7XHJcblxyXG4gIHRoaXMucmVtb3ZlRHVtbXlDb21wbGV4ZXMoKTtcclxuXHJcbiAgLy8gcmVzZXRcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsTm9kZXMoKTtcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcclxuICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLnJlc2V0QWxsRWRnZXMoKTtcclxuICB0aGlzLmNhbGN1bGF0ZU5vZGVzVG9BcHBseUdyYXZpdGF0aW9uVG8oKTtcclxufTtcclxuXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLmNsZWFyQ29tcGxleCA9IGZ1bmN0aW9uIChjb21wKSB7XHJcbiAgdmFyIHBhY2sgPSBudWxsO1xyXG4gIHZhciBjaGlsZEdyID0gY29tcC5nZXRDaGlsZCgpO1xyXG4gIHRoaXMuY2hpbGRHcmFwaE1hcC5wdXQoY29tcCwgY2hpbGRHcik7XHJcblxyXG4gIGlmIChjaGlsZEdyID09IG51bGwpXHJcbiAgICByZXR1cm47XHJcblxyXG4gIHBhY2sgPSBuZXcgTWVtYmVyUGFjayhjaGlsZEdyKTtcclxuICB0aGlzLm1lbWJlclBhY2tNYXAucHV0KGNvbXAsIHBhY2spO1xyXG5cclxuICBpZiAodGhpcy5kdW1teUNvbXBsZXhMaXN0LmNvbnRhaW5zKGNvbXApKVxyXG4gIHtcclxuICAgIGNvbXAuZ2V0Q2hpbGQoKS5nZXROb2RlcygpLmZvckVhY2goZnVuY3Rpb24gKG8pIHtcclxuICAgICAgY2xlYXJEdW1teUNvbXBsZXhHcmFwaHMobyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0R3JhcGhzKCkucmVtb3ZlKGNoaWxkR3IpO1xyXG4gIGNvbXAuc2V0Q2hpbGQobnVsbCk7XHJcblxyXG4gIGNvbXAuc2V0V2lkdGgocGFjay5nZXRXaWR0aCgpKTtcclxuICBjb21wLnNldEhlaWdodChwYWNrLmdldEhlaWdodCgpKTtcclxuXHJcbiAgLy8gUmVkaXJlY3QgdGhlIGVkZ2VzIG9mIGNvbXBsZXggbWVtYmVycyB0byB0aGUgY29tcGxleC5cclxuICBpZiAoY2hpbGRHciAhPSBudWxsKVxyXG4gIHtcclxuICAgIGNoaWxkR3IuZ2V0Tm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChjaCkge1xyXG4gICAgICB2YXIgY2hOZCA9IGNoO1xyXG5cclxuICAgICAgY2hOZC5nZXRFZGdlcygpLmZvckVhY2goZnVuY3Rpb24gKGVkZ2UpIHtcclxuICAgICAgICBpZiAoZWRnZS5nZXRTb3VyY2UoKSA9PSBjaE5kKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNoTmQuZ2V0RWRnZXMoKS5yZW1vdmUoZWRnZSk7XHJcbiAgICAgICAgICBlZGdlLnNldFNvdXJjZShjb21wKTtcclxuICAgICAgICAgIGNvbXAuZ2V0RWRnZXMoKS5hZGQoZWRnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVkZ2UuZ2V0VGFyZ2V0KCkgPT0gY2hOZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjaE5kLmdldEVkZ2VzKCkucmVtb3ZlKGVkZ2UpO1xyXG4gICAgICAgICAgZWRnZS5zZXRUYXJnZXQoY29tcCk7XHJcbiAgICAgICAgICBjb21wLmdldEVkZ2VzKCkuYWRkKGVkZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgcmVjdXJzZXMgb24gdGhlIGNvbXBsZXggb2JqZWN0cy4gSWYgYSBub2RlIGRvZXMgbm90IGNvbnRhaW5cclxuICogYW55IGNvbXBsZXggbm9kZXMgb3IgYWxsIHRoZSBub2RlcyBpbiB0aGUgY2hpbGQgZ3JhcGggaXMgYWxyZWFkeSBtYXJrZWQsXHJcbiAqIGl0IGlzIHJlcG9ydGVkLiAoRGVwdGggZmlyc3QpXHJcbiAqIFxyXG4gKi9cclxuQ29TRUxheW91dC5wcm90b3R5cGUuREZTVmlzaXRDb21wbGV4ID0gZnVuY3Rpb24gKG5vZGUpXHJcbntcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKG5vZGUuZ2V0Q2hpbGQoKSAhPSBudWxsKVxyXG4gIHtcclxuICAgIG5vZGUuZ2V0Q2hpbGQoKS5nZXROb2RlcygpLmZvckVhY2goZnVuY3Rpb24gKHNiZ25DaGlsZCkge1xyXG4gICAgICBzZWxmLkRGU1Zpc2l0Q29tcGxleChzYmduQ2hpbGQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBUT0RPIGFkZCBub2RlLmNvbnRhaW5zVW5tYXJrZWRDb21wbGV4KCkgaWYgbm90IGV4aXN0c1xyXG4gIGlmIChub2RlLmlzQ29tcGxleCgpICYmICFub2RlLmNvbnRhaW5zVW5tYXJrZWRDb21wbGV4KCkpXHJcbiAge1xyXG4gICAgdGhpcy5jb21wbGV4T3JkZXIuYWRkKG5vZGUpO1xyXG4gICAgbm9kZS52aXNpdGVkID0gdHJ1ZTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQWRqdXN0IGxvY2F0aW9ucyBvZiBjaGlsZHJlbiBvZiBnaXZlbiBjb21wbGV4IHdydC4gdGhlIGxvY2F0aW9uIG9mIHRoZVxyXG4gKiBjb21wbGV4XHJcbiAqL1xyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5hZGp1c3RMb2NhdGlvbiA9IGZ1bmN0aW9uIChjb21wLCBjaEdyKVxyXG57XHJcbiAgdmFyIHJlY3QgPSBjYWxjdWxhdGVCb3VuZHMoZmFsc2UsIGNoR3IuZ2V0Tm9kZXMoKSk7XHJcblxyXG4gIHZhciBkaWZmZXJlbmNlWCA9IHBhcnNlSW50KHJlY3QueCAtIGNvbXAuZ2V0TGVmdCgpKTtcclxuICB2YXIgZGlmZmVyZW5jZVkgPSBwYXJzZUludChyZWN0LnkgLSBjb21wLmdldFRvcCgpKTtcclxuXHJcbiAgLy8gVE9ETyByZXZpc2UgaXRcclxuICAvLyBpZiB0aGUgcGFyZW50IGdyYXBoIGlzIGEgY29tcG91bmQsIGFkZCBjb21wb3VuZCBtYXJnaW5zXHJcbi8vICAgaWYgKCFjb21wLnR5cGUuZXF1YWxzKFNiZ25QRENvbnN0YW50cy5DT01QTEVYKSlcclxuLy8gICB7XHJcbi8vICAgICAgIGRpZmZlcmVuY2VYIC09IExheW91dENvbnN0YW50cy5DT01QT1VORF9OT0RFX01BUkdJTjtcclxuLy8gICAgICAgZGlmZmVyZW5jZVkgLT0gTGF5b3V0Q29uc3RhbnRzLkNPTVBPVU5EX05PREVfTUFSR0lOO1xyXG4vLyAgIH1cclxuXHJcbiAgZm9yICh2YXIgaiA9IDA7IGogPCBjaEdyLmdldE5vZGVzKCkubGVuZ3RoOyBqKyspXHJcbiAge1xyXG4gICAgdmFyIHMgPSBjaEdyLmdldE5vZGVzKClbal07XHJcblxyXG4gICAgcy5zZXRMb2NhdGlvbihzLmdldExlZnQoKSAtIGRpZmZlcmVuY2VYXHJcbiAgICAgICAgICAgICsgQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9IT1JJWk9OVEFMX0JVRkZFUiwgcy5nZXRUb3AoKVxyXG4gICAgICAgICAgICAtIGRpZmZlcmVuY2VZICsgQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9WRVJUSUNBTF9CVUZGRVIpO1xyXG5cclxuICAgIGlmIChzLmdldENoaWxkKCkgIT0gbnVsbClcclxuICAgICAgYWRqdXN0TG9jYXRpb24ocywgcy5nZXRDaGlsZCgpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVjdXJzaXZlbHkgcmVtb3ZlcyBhbGwgZHVtbXkgY29tcGxleCBub2RlcyAocHJldmlvdXNseSBjcmVhdGVkIHRvIHRpbGVcclxuICogZ3JvdXAgZGVncmVlLXplcm8gbm9kZXMpIGZyb20gdGhlIGdyYXBoLlxyXG4gKi9cclxuQ29TRUxheW91dC5wcm90b3R5cGUuY2xlYXJEdW1teUNvbXBsZXhHcmFwaHMgPSBmdW5jdGlvbiAoY29tcClcclxue1xyXG4gIGlmIChjb21wLmdldENoaWxkKCkgPT0gbnVsbCB8fCBjb21wLmlzRHVtbXlDb21wb3VuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBcclxuICBjb21wLmdldENoaWxkKCkuZ2V0Tm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZE5vZGUpIHtcclxuICAgIGlmIChjaGlsZE5vZGUuZ2V0Q2hpbGQoKSAhPSBudWxsICYmIGNoaWxkTm9kZS5nZXRFZGdlcygpLmxlbmd0aCA9PSAwKVxyXG4gICAgICBjbGVhckR1bW15Q29tcGxleEdyYXBocyhjaGlsZE5vZGUpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAodGhpcy5ncmFwaE1hbmFnZXIuZ2V0R3JhcGhzKCkuY29udGFpbnMoY29tcC5nZXRDaGlsZCgpKSkge1xyXG4gICAgaWYgKGNhbGNHcmFwaERlZ3JlZShjb21wKSA9PSAwKSB7XHJcbiAgICAgIHRoaXMuZW1wdGllZER1bW15Q29tcGxleE1hcC5wdXQoY29tcCwgY29tcC5nZXRDaGlsZCgpKTtcclxuXHJcbiAgICAgIHRoaXMuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0R3JhcGhzKCkucmVtb3ZlKGNvbXAuZ2V0Q2hpbGQoKSk7XHJcbiAgICAgIGNvbXAuc2V0Q2hpbGQobnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIER1bW15IGNvbXBsZXhlcyAocGxhY2VkIGluIHRoZSBcImR1bW15Q29tcGxleExpc3RcIikgYXJlIHJlbW92ZWQgZnJvbSB0aGVcclxuICogZ3JhcGguXHJcbiAqL1xyXG5Db1NFTGF5b3V0LnByb3RvdHlwZS5yZW1vdmVEdW1teUNvbXBsZXhlcyA9IGZ1bmN0aW9uKClcclxue1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICAvLyByZW1vdmUgZHVtbXkgY29tcGxleGVzIGFuZCBjb25uZWN0IGNoaWxkcmVuIHRvIG9yaWdpbmFsIHBhcmVudFxyXG4gIHRoaXMuZHVtbXlDb21wbGV4TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChkdW1teUNvbXBsZXgpIHtcclxuICAgIHZhciBjaGlsZEdyYXBoID0gZHVtbXlDb21wbGV4LmdldENoaWxkKCk7XHJcbiAgICB2YXIgb3duZXIgPSBkdW1teUNvbXBsZXguZ2V0T3duZXIoKTtcclxuXHJcbiAgICAvLyBSZW1vdmUgY2hpbGQgZ3JhcGggZnJvbSBncmFwaHMgb2YgdGhpc1xyXG4gICAgdmFyIGdyYXBocyA9IHNlbGYuZ2V0R3JhcGhNYW5hZ2VyKCkuZ2V0R3JhcGhzKCk7XHJcbiAgICB2YXIgaW5kZXggPSBncmFwaHMuaW5kZXhPZihjaGlsZEdyYXBoKTtcclxuICAgIFxyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgZ3JhcGhzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGR1bW15Q29tcGxleC5zZXRDaGlsZChudWxsKTtcclxuXHJcbiAgICBvd25lci5yZW1vdmUoZHVtbXlDb21wbGV4KTtcclxuXHJcbiAgICBjaGlsZEdyYXBoLmdldE5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbiAocykge1xyXG4gICAgICBvd25lci5hZGQocyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBib3VuZGluZyByZWN0YW5nbGUgb2YgdGhlIGdpdmVuIHNldCBvZiBub2RlcyB3aXRoXHJcbiAqIG9yIHdpdGhvdXQgdGhlIG1hcmdpbnNcclxuICovXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGN1bGF0ZUJvdW5kcyA9IGZ1bmN0aW9uIChpc01hcmdpbkluY2x1ZGVkLCBub2Rlcylcclxue1xyXG4gIHZhciBib3VuZExlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgYm91bmRSaWdodCA9IEludGVnZXIuTUlOX1ZBTFVFO1xyXG4gIHZhciBib3VuZFRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBib3VuZEJvdHRvbSA9IEludGVnZXIuTUlOX1ZBTFVFO1xyXG4gIHZhciBub2RlTGVmdDtcclxuICB2YXIgbm9kZVJpZ2h0O1xyXG4gIHZhciBub2RlVG9wO1xyXG4gIHZhciBub2RlQm90dG9tO1xyXG5cclxuICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChsTm9kZSkge1xyXG4gICAgbm9kZUxlZnQgPSBwYXJzZUludChsTm9kZS5nZXRMZWZ0KCkpO1xyXG4gICAgbm9kZVJpZ2h0ID0gcGFyc2VJbnQobE5vZGUuZ2V0UmlnaHQoKSk7XHJcbiAgICBub2RlVG9wID0gcGFyc2VJbnQobE5vZGUuZ2V0VG9wKCkpO1xyXG4gICAgbm9kZUJvdHRvbSA9IHBhcnNlSW50KGxOb2RlLmdldEJvdHRvbSgpKTtcclxuXHJcbiAgICBpZiAoYm91bmRMZWZ0ID4gbm9kZUxlZnQpXHJcbiAgICAgIGJvdW5kTGVmdCA9IG5vZGVMZWZ0O1xyXG5cclxuICAgIGlmIChib3VuZFJpZ2h0IDwgbm9kZVJpZ2h0KVxyXG4gICAgICBib3VuZFJpZ2h0ID0gbm9kZVJpZ2h0O1xyXG5cclxuICAgIGlmIChib3VuZFRvcCA+IG5vZGVUb3ApXHJcbiAgICAgIGJvdW5kVG9wID0gbm9kZVRvcDtcclxuXHJcbiAgICBpZiAoYm91bmRCb3R0b20gPCBub2RlQm90dG9tKVxyXG4gICAgICBib3VuZEJvdHRvbSA9IG5vZGVCb3R0b207XHJcbiAgfSk7XHJcblxyXG5cclxuICBpZiAoaXNNYXJnaW5JbmNsdWRlZClcclxuICB7XHJcbiAgICByZXR1cm4gbmV3IFJlY3RhbmdsZUQoYm91bmRMZWZ0XHJcbiAgICAgICAgICAgIC0gQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9NQVJHSU4sIGJvdW5kVG9wXHJcbiAgICAgICAgICAgIC0gQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9NQVJHSU4sIGJvdW5kUmlnaHRcclxuICAgICAgICAgICAgLSBib3VuZExlZnQgKyAyICogQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9NQVJHSU4sXHJcbiAgICAgICAgICAgIGJvdW5kQm90dG9tIC0gYm91bmRUb3AgKyAyXHJcbiAgICAgICAgICAgICogQ29TRUNvbnN0YW50cy5DT01QTEVYX01FTV9NQVJHSU4pO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVEKGJvdW5kTGVmdCwgYm91bmRUb3AsIGJvdW5kUmlnaHQgLSBib3VuZExlZnQsXHJcbiAgICAgICAgICAgIGJvdW5kQm90dG9tIC0gYm91bmRUb3ApO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4qIFJlY3Vyc2l2ZWx5IGNhbGN1bGF0ZSBpZiB0aGUgbm9kZSBvciBpdHMgY2hpbGQgbm9kZXMgaGF2ZSBhbnkgZWRnZXMgdG9cclxuKiBvdGhlciBub2Rlcy4gUmV0dXJuIHRoZSB0b3RhbCBudW1iZXIgb2YgZWRnZXMuXHJcbiovXHJcbkNvU0VMYXlvdXQucHJvdG90eXBlLmNhbGNHcmFwaERlZ3JlZSA9IGZ1bmN0aW9uKHBhcmVudE5vZGUpXHJcbntcclxuICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICB2YXIgZGVncmVlID0gMDtcclxuICAgaWYgKHBhcmVudE5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKVxyXG4gICB7XHJcbiAgICAgICBkZWdyZWUgPSBwYXJlbnROb2RlLmdldEVkZ2VzKCkubGVuZ3RoO1xyXG4gICAgICAgcmV0dXJuIGRlZ3JlZTtcclxuICAgfVxyXG5cclxuICAgcGFyZW50Tm9kZS5nZXRDaGlsZCgpLmdldE5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihvKSB7XHJcbiAgICAgZGVncmVlID0gZGVncmVlICsgcGFyZW50Tm9kZS5nZXRFZGdlcygpLmxlbmd0aCArIHNlbGYuY2FsY0dyYXBoRGVncmVlKG8pO1xyXG4gICB9KTtcclxuXHJcbiAgIHJldHVybiBkZWdyZWU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvU0VMYXlvdXQ7XHJcbiIsInZhciBGRExheW91dE5vZGUgPSByZXF1aXJlKCcuL0ZETGF5b3V0Tm9kZScpO1xyXG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBDb1NFTm9kZShnbSwgbG9jLCBzaXplLCB2Tm9kZSkge1xyXG4gIEZETGF5b3V0Tm9kZS5jYWxsKHRoaXMsIGdtLCBsb2MsIHNpemUsIHZOb2RlKTtcclxufVxyXG5cclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRkRMYXlvdXROb2RlLnByb3RvdHlwZSk7XHJcbmZvciAodmFyIHByb3AgaW4gRkRMYXlvdXROb2RlKSB7XHJcbiAgQ29TRU5vZGVbcHJvcF0gPSBGRExheW91dE5vZGVbcHJvcF07XHJcbn1cclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBsYXlvdXQgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRMYXlvdXQoKTtcclxuICB0aGlzLmRpc3BsYWNlbWVudFggPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqXHJcbiAgICAgICAgICAodGhpcy5zcHJpbmdGb3JjZVggKyB0aGlzLnJlcHVsc2lvbkZvcmNlWCArIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVgpO1xyXG4gIHRoaXMuZGlzcGxhY2VtZW50WSA9IGxheW91dC5jb29saW5nRmFjdG9yICpcclxuICAgICAgICAgICh0aGlzLnNwcmluZ0ZvcmNlWSArIHRoaXMucmVwdWxzaW9uRm9yY2VZICsgdGhpcy5ncmF2aXRhdGlvbkZvcmNlWSk7XHJcblxyXG5cclxuICBpZiAoTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRYKSA+IGxheW91dC5jb29saW5nRmFjdG9yICogbGF5b3V0Lm1heE5vZGVEaXNwbGFjZW1lbnQpXHJcbiAge1xyXG4gICAgdGhpcy5kaXNwbGFjZW1lbnRYID0gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudCAqXHJcbiAgICAgICAgICAgIElNYXRoLnNpZ24odGhpcy5kaXNwbGFjZW1lbnRYKTtcclxuICB9XHJcblxyXG4gIGlmIChNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFkpID4gbGF5b3V0LmNvb2xpbmdGYWN0b3IgKiBsYXlvdXQubWF4Tm9kZURpc3BsYWNlbWVudClcclxuICB7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFkgPSBsYXlvdXQuY29vbGluZ0ZhY3RvciAqIGxheW91dC5tYXhOb2RlRGlzcGxhY2VtZW50ICpcclxuICAgICAgICAgICAgSU1hdGguc2lnbih0aGlzLmRpc3BsYWNlbWVudFkpO1xyXG4gIH1cclxuXHJcbiAgLy8gYSBzaW1wbGUgbm9kZSwganVzdCBtb3ZlIGl0XHJcbiAgaWYgKHRoaXMuY2hpbGQgPT0gbnVsbClcclxuICB7XHJcbiAgICB0aGlzLm1vdmVCeSh0aGlzLmRpc3BsYWNlbWVudFgsIHRoaXMuZGlzcGxhY2VtZW50WSk7XHJcbiAgfVxyXG4gIC8vIGFuIGVtcHR5IGNvbXBvdW5kIG5vZGUsIGFnYWluIGp1c3QgbW92ZSBpdFxyXG4gIGVsc2UgaWYgKHRoaXMuY2hpbGQuZ2V0Tm9kZXMoKS5sZW5ndGggPT0gMClcclxuICB7XHJcbiAgICB0aGlzLm1vdmVCeSh0aGlzLmRpc3BsYWNlbWVudFgsIHRoaXMuZGlzcGxhY2VtZW50WSk7XHJcbiAgfVxyXG4gIC8vIG5vbi1lbXB0eSBjb21wb3VuZCBub2RlLCBwcm9wb2dhdGUgbW92ZW1lbnQgdG8gY2hpbGRyZW4gYXMgd2VsbFxyXG4gIGVsc2VcclxuICB7XHJcbiAgICB0aGlzLnByb3BvZ2F0ZURpc3BsYWNlbWVudFRvQ2hpbGRyZW4odGhpcy5kaXNwbGFjZW1lbnRYLFxyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYWNlbWVudFkpO1xyXG4gIH1cclxuXHJcbiAgbGF5b3V0LnRvdGFsRGlzcGxhY2VtZW50ICs9XHJcbiAgICAgICAgICBNYXRoLmFicyh0aGlzLmRpc3BsYWNlbWVudFgpICsgTWF0aC5hYnModGhpcy5kaXNwbGFjZW1lbnRZKTtcclxuXHJcbiAgdGhpcy5zcHJpbmdGb3JjZVggPSAwO1xyXG4gIHRoaXMuc3ByaW5nRm9yY2VZID0gMDtcclxuICB0aGlzLnJlcHVsc2lvbkZvcmNlWCA9IDA7XHJcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVkgPSAwO1xyXG4gIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVggPSAwO1xyXG4gIHRoaXMuZ3Jhdml0YXRpb25Gb3JjZVkgPSAwO1xyXG4gIHRoaXMuZGlzcGxhY2VtZW50WCA9IDA7XHJcbiAgdGhpcy5kaXNwbGFjZW1lbnRZID0gMDtcclxufTtcclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZS5wcm9wb2dhdGVEaXNwbGFjZW1lbnRUb0NoaWxkcmVuID0gZnVuY3Rpb24gKGRYLCBkWSlcclxue1xyXG4gIHZhciBub2RlcyA9IHRoaXMuZ2V0Q2hpbGQoKS5nZXROb2RlcygpO1xyXG4gIHZhciBub2RlO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgaWYgKG5vZGUuZ2V0Q2hpbGQoKSA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICBub2RlLm1vdmVCeShkWCwgZFkpO1xyXG4gICAgICBub2RlLmRpc3BsYWNlbWVudFggKz0gZFg7XHJcbiAgICAgIG5vZGUuZGlzcGxhY2VtZW50WSArPSBkWTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgbm9kZS5wcm9wb2dhdGVEaXNwbGFjZW1lbnRUb0NoaWxkcmVuKGRYLCBkWSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuQ29TRU5vZGUucHJvdG90eXBlLnNldFByZWQxID0gZnVuY3Rpb24gKHByZWQxKVxyXG57XHJcbiAgdGhpcy5wcmVkMSA9IHByZWQxO1xyXG59O1xyXG5cclxuQ29TRU5vZGUucHJvdG90eXBlLmdldFByZWQxID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiBwcmVkMTtcclxufTtcclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZS5nZXRQcmVkMiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gcHJlZDI7XHJcbn07XHJcblxyXG5Db1NFTm9kZS5wcm90b3R5cGUuc2V0TmV4dCA9IGZ1bmN0aW9uIChuZXh0KVxyXG57XHJcbiAgdGhpcy5uZXh0ID0gbmV4dDtcclxufTtcclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZS5nZXROZXh0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiBuZXh0O1xyXG59O1xyXG5cclxuQ29TRU5vZGUucHJvdG90eXBlLnNldFByb2Nlc3NlZCA9IGZ1bmN0aW9uIChwcm9jZXNzZWQpXHJcbntcclxuICB0aGlzLnByb2Nlc3NlZCA9IHByb2Nlc3NlZDtcclxufTtcclxuXHJcbkNvU0VOb2RlLnByb3RvdHlwZS5pc1Byb2Nlc3NlZCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gcHJvY2Vzc2VkO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb1NFTm9kZTtcclxuIiwiZnVuY3Rpb24gRGltZW5zaW9uRCh3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgdGhpcy53aWR0aCA9IDA7XHJcbiAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gIGlmICh3aWR0aCAhPT0gbnVsbCAmJiBoZWlnaHQgIT09IG51bGwpIHtcclxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gIH1cclxufVxyXG5cclxuRGltZW5zaW9uRC5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbn07XHJcblxyXG5EaW1lbnNpb25ELnByb3RvdHlwZS5zZXRXaWR0aCA9IGZ1bmN0aW9uICh3aWR0aClcclxue1xyXG4gIHRoaXMud2lkdGggPSB3aWR0aDtcclxufTtcclxuXHJcbkRpbWVuc2lvbkQucHJvdG90eXBlLmdldEhlaWdodCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbn07XHJcblxyXG5EaW1lbnNpb25ELnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaGVpZ2h0KVxyXG57XHJcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpbWVuc2lvbkQ7XHJcbiIsImZ1bmN0aW9uIEVtaXR0ZXIoKXtcclxuICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG59XHJcblxyXG52YXIgcCA9IEVtaXR0ZXIucHJvdG90eXBlO1xyXG5cclxucC5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudCwgY2FsbGJhY2sgKXtcclxuICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcclxuICAgIGV2ZW50OiBldmVudCxcclxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gIH0pO1xyXG59O1xyXG5cclxucC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudCwgY2FsbGJhY2sgKXtcclxuICBmb3IoIHZhciBpID0gdGhpcy5saXN0ZW5lcnMubGVuZ3RoOyBpID49IDA7IGktLSApe1xyXG4gICAgdmFyIGwgPSB0aGlzLmxpc3RlbmVyc1tpXTtcclxuXHJcbiAgICBpZiggbC5ldmVudCA9PT0gZXZlbnQgJiYgbC5jYWxsYmFjayA9PT0gY2FsbGJhY2sgKXtcclxuICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKCBpLCAxICk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxucC5lbWl0ID0gZnVuY3Rpb24oIGV2ZW50LCBkYXRhICl7XHJcbiAgZm9yKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVycy5sZW5ndGg7IGkrKyApe1xyXG4gICAgdmFyIGwgPSB0aGlzLmxpc3RlbmVyc1tpXTtcclxuXHJcbiAgICBpZiggZXZlbnQgPT09IGwuZXZlbnQgKXtcclxuICAgICAgbC5jYWxsYmFjayggZGF0YSApO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxuIiwidmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XHJcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcclxudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XHJcbnZhciBJR2VvbWV0cnkgPSByZXF1aXJlKCcuL0lHZW9tZXRyeScpO1xyXG52YXIgSU1hdGggPSByZXF1aXJlKCcuL0lNYXRoJyk7XHJcblxyXG5mdW5jdGlvbiBGRExheW91dCgpIHtcclxuICBMYXlvdXQuY2FsbCh0aGlzKTtcclxuXHJcbiAgdGhpcy51c2VTbWFydElkZWFsRWRnZUxlbmd0aENhbGN1bGF0aW9uID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT047XHJcbiAgdGhpcy5pZGVhbEVkZ2VMZW5ndGggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0VER0VfTEVOR1RIO1xyXG4gIHRoaXMuc3ByaW5nQ29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSDtcclxuICB0aGlzLnJlcHVsc2lvbkNvbnN0YW50ID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEg7XHJcbiAgdGhpcy5ncmF2aXR5Q29uc3RhbnQgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEg7XHJcbiAgdGhpcy5jb21wb3VuZEdyYXZpdHlDb25zdGFudCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSDtcclxuICB0aGlzLmdyYXZpdHlSYW5nZUZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XHJcbiAgdGhpcy5jb21wb3VuZEdyYXZpdHlSYW5nZUZhY3RvciA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1I7XHJcbiAgdGhpcy5kaXNwbGFjZW1lbnRUaHJlc2hvbGRQZXJOb2RlID0gKDMuMCAqIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEgpIC8gMTAwO1xyXG4gIHRoaXMuY29vbGluZ0ZhY3RvciA9IDEuMDtcclxuICB0aGlzLmluaXRpYWxDb29saW5nRmFjdG9yID0gMS4wO1xyXG4gIHRoaXMudG90YWxEaXNwbGFjZW1lbnQgPSAwLjA7XHJcbiAgdGhpcy5vbGRUb3RhbERpc3BsYWNlbWVudCA9IDAuMDtcclxuICB0aGlzLm1heEl0ZXJhdGlvbnMgPSBGRExheW91dENvbnN0YW50cy5NQVhfSVRFUkFUSU9OUztcclxufVxyXG5cclxuRkRMYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShMYXlvdXQucHJvdG90eXBlKTtcclxuXHJcbmZvciAodmFyIHByb3AgaW4gTGF5b3V0KSB7XHJcbiAgRkRMYXlvdXRbcHJvcF0gPSBMYXlvdXRbcHJvcF07XHJcbn1cclxuXHJcbkZETGF5b3V0LnByb3RvdHlwZS5pbml0UGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICBMYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzLmNhbGwodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgaWYgKHRoaXMubGF5b3V0UXVhbGl0eSA9PSBMYXlvdXRDb25zdGFudHMuRFJBRlRfUVVBTElUWSlcclxuICB7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgKz0gMC4zMDtcclxuICAgIHRoaXMubWF4SXRlcmF0aW9ucyAqPSAwLjg7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHRoaXMubGF5b3V0UXVhbGl0eSA9PSBMYXlvdXRDb25zdGFudHMuUFJPT0ZfUVVBTElUWSlcclxuICB7XHJcbiAgICB0aGlzLmRpc3BsYWNlbWVudFRocmVzaG9sZFBlck5vZGUgLT0gMC4zMDtcclxuICAgIHRoaXMubWF4SXRlcmF0aW9ucyAqPSAxLjI7XHJcbiAgfVxyXG5cclxuICB0aGlzLnRvdGFsSXRlcmF0aW9ucyA9IDA7XHJcbiAgdGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMgPSAwO1xyXG5cclxuLy8gICAgdGhpcy51c2VGUkdyaWRWYXJpYW50ID0gbGF5b3V0T3B0aW9uc1BhY2suc21hcnRSZXB1bHNpb25SYW5nZUNhbGM7XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0lkZWFsRWRnZUxlbmd0aHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGVkZ2U7XHJcbiAgdmFyIGxjYURlcHRoO1xyXG4gIHZhciBzb3VyY2U7XHJcbiAgdmFyIHRhcmdldDtcclxuICB2YXIgc2l6ZU9mU291cmNlSW5MY2E7XHJcbiAgdmFyIHNpemVPZlRhcmdldEluTGNhO1xyXG5cclxuICB2YXIgYWxsRWRnZXMgPSB0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldEFsbEVkZ2VzKCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKylcclxuICB7XHJcbiAgICBlZGdlID0gYWxsRWRnZXNbaV07XHJcblxyXG4gICAgZWRnZS5pZGVhbExlbmd0aCA9IHRoaXMuaWRlYWxFZGdlTGVuZ3RoO1xyXG5cclxuICAgIGlmIChlZGdlLmlzSW50ZXJHcmFwaClcclxuICAgIHtcclxuICAgICAgc291cmNlID0gZWRnZS5nZXRTb3VyY2UoKTtcclxuICAgICAgdGFyZ2V0ID0gZWRnZS5nZXRUYXJnZXQoKTtcclxuXHJcbiAgICAgIHNpemVPZlNvdXJjZUluTGNhID0gZWRnZS5nZXRTb3VyY2VJbkxjYSgpLmdldEVzdGltYXRlZFNpemUoKTtcclxuICAgICAgc2l6ZU9mVGFyZ2V0SW5MY2EgPSBlZGdlLmdldFRhcmdldEluTGNhKCkuZ2V0RXN0aW1hdGVkU2l6ZSgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudXNlU21hcnRJZGVhbEVkZ2VMZW5ndGhDYWxjdWxhdGlvbilcclxuICAgICAge1xyXG4gICAgICAgIGVkZ2UuaWRlYWxMZW5ndGggKz0gc2l6ZU9mU291cmNlSW5MY2EgKyBzaXplT2ZUYXJnZXRJbkxjYSAtXHJcbiAgICAgICAgICAgICAgICAyICogTGF5b3V0Q29uc3RhbnRzLlNJTVBMRV9OT0RFX1NJWkU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxjYURlcHRoID0gZWRnZS5nZXRMY2EoKS5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKTtcclxuXHJcbiAgICAgIGVkZ2UuaWRlYWxMZW5ndGggKz0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAqXHJcbiAgICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiAqXHJcbiAgICAgICAgICAgICAgKHNvdXJjZS5nZXRJbmNsdXNpb25UcmVlRGVwdGgoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuZ2V0SW5jbHVzaW9uVHJlZURlcHRoKCkgLSAyICogbGNhRGVwdGgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkZETGF5b3V0LnByb3RvdHlwZS5pbml0U3ByaW5nRW1iZWRkZXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmICh0aGlzLmluY3JlbWVudGFsKVxyXG4gIHtcclxuICAgIHRoaXMuY29vbGluZ0ZhY3RvciA9IDAuODtcclxuICAgIHRoaXMuaW5pdGlhbENvb2xpbmdGYWN0b3IgPSAwLjg7XHJcbiAgICB0aGlzLm1heE5vZGVEaXNwbGFjZW1lbnQgPVxyXG4gICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlRfSU5DUkVNRU5UQUw7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICB0aGlzLmNvb2xpbmdGYWN0b3IgPSAxLjA7XHJcbiAgICB0aGlzLmluaXRpYWxDb29saW5nRmFjdG9yID0gMS4wO1xyXG4gICAgdGhpcy5tYXhOb2RlRGlzcGxhY2VtZW50ID1cclxuICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5tYXhJdGVyYXRpb25zID1cclxuICAgICAgICAgIE1hdGgubWF4KHRoaXMuZ2V0QWxsTm9kZXMoKS5sZW5ndGggKiA1LCB0aGlzLm1heEl0ZXJhdGlvbnMpO1xyXG5cclxuICB0aGlzLnRvdGFsRGlzcGxhY2VtZW50VGhyZXNob2xkID1cclxuICAgICAgICAgIHRoaXMuZGlzcGxhY2VtZW50VGhyZXNob2xkUGVyTm9kZSAqIHRoaXMuZ2V0QWxsTm9kZXMoKS5sZW5ndGg7XHJcblxyXG4gIHRoaXMucmVwdWxzaW9uUmFuZ2UgPSB0aGlzLmNhbGNSZXB1bHNpb25SYW5nZSgpO1xyXG59O1xyXG5cclxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNTcHJpbmdGb3JjZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGxFZGdlcyA9IHRoaXMuZ2V0QWxsRWRnZXMoKTtcclxuICB2YXIgZWRnZTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsRWRnZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgZWRnZSA9IGxFZGdlc1tpXTtcclxuXHJcbiAgICB0aGlzLmNhbGNTcHJpbmdGb3JjZShlZGdlLCBlZGdlLmlkZWFsTGVuZ3RoKTtcclxuICB9XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvbkZvcmNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaSwgajtcclxuICB2YXIgbm9kZUEsIG5vZGVCO1xyXG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgbm9kZUEgPSBsTm9kZXNbaV07XHJcblxyXG4gICAgZm9yIChqID0gaSArIDE7IGogPCBsTm9kZXMubGVuZ3RoOyBqKyspXHJcbiAgICB7XHJcbiAgICAgIG5vZGVCID0gbE5vZGVzW2pdO1xyXG5cclxuICAgICAgLy8gSWYgYm90aCBub2RlcyBhcmUgbm90IG1lbWJlcnMgb2YgdGhlIHNhbWUgZ3JhcGgsIHNraXAuXHJcbiAgICAgIGlmIChub2RlQS5nZXRPd25lcigpICE9IG5vZGVCLmdldE93bmVyKCkpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jYWxjUmVwdWxzaW9uRm9yY2Uobm9kZUEsIG5vZGVCKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIG5vZGU7XHJcbiAgdmFyIGxOb2RlcyA9IHRoaXMuZ2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsTm9kZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgbm9kZSA9IGxOb2Rlc1tpXTtcclxuICAgIHRoaXMuY2FsY0dyYXZpdGF0aW9uYWxGb3JjZShub2RlKTtcclxuICB9XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUubW92ZU5vZGVzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBsTm9kZXMgPSB0aGlzLmdldEFsbE5vZGVzKCk7XHJcbiAgdmFyIG5vZGU7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbE5vZGVzLmxlbmd0aDsgaSsrKVxyXG4gIHtcclxuICAgIG5vZGUgPSBsTm9kZXNbaV07XHJcbiAgICBub2RlLm1vdmUoKTtcclxuICB9XHJcbn1cclxuXHJcbkZETGF5b3V0LnByb3RvdHlwZS5jYWxjU3ByaW5nRm9yY2UgPSBmdW5jdGlvbiAoZWRnZSwgaWRlYWxMZW5ndGgpIHtcclxuICB2YXIgc291cmNlTm9kZSA9IGVkZ2UuZ2V0U291cmNlKCk7XHJcbiAgdmFyIHRhcmdldE5vZGUgPSBlZGdlLmdldFRhcmdldCgpO1xyXG5cclxuICB2YXIgbGVuZ3RoO1xyXG4gIHZhciBzcHJpbmdGb3JjZTtcclxuICB2YXIgc3ByaW5nRm9yY2VYO1xyXG4gIHZhciBzcHJpbmdGb3JjZVk7XHJcblxyXG4gIC8vIFVwZGF0ZSBlZGdlIGxlbmd0aFxyXG4gIGlmICh0aGlzLnVuaWZvcm1MZWFmTm9kZVNpemVzICYmXHJcbiAgICAgICAgICBzb3VyY2VOb2RlLmdldENoaWxkKCkgPT0gbnVsbCAmJiB0YXJnZXROb2RlLmdldENoaWxkKCkgPT0gbnVsbClcclxuICB7XHJcbiAgICBlZGdlLnVwZGF0ZUxlbmd0aFNpbXBsZSgpO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgZWRnZS51cGRhdGVMZW5ndGgoKTtcclxuXHJcbiAgICBpZiAoZWRnZS5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxlbmd0aCA9IGVkZ2UuZ2V0TGVuZ3RoKCk7XHJcblxyXG4gIC8vIENhbGN1bGF0ZSBzcHJpbmcgZm9yY2VzXHJcbiAgc3ByaW5nRm9yY2UgPSB0aGlzLnNwcmluZ0NvbnN0YW50ICogKGxlbmd0aCAtIGlkZWFsTGVuZ3RoKTtcclxuXHJcbiAgLy8gUHJvamVjdCBmb3JjZSBvbnRvIHggYW5kIHkgYXhlc1xyXG4gIHNwcmluZ0ZvcmNlWCA9IHNwcmluZ0ZvcmNlICogKGVkZ2UubGVuZ3RoWCAvIGxlbmd0aCk7XHJcbiAgc3ByaW5nRm9yY2VZID0gc3ByaW5nRm9yY2UgKiAoZWRnZS5sZW5ndGhZIC8gbGVuZ3RoKTtcclxuXHJcbiAgLy8gQXBwbHkgZm9yY2VzIG9uIHRoZSBlbmQgbm9kZXNcclxuICBzb3VyY2VOb2RlLnNwcmluZ0ZvcmNlWCArPSBzcHJpbmdGb3JjZVg7XHJcbiAgc291cmNlTm9kZS5zcHJpbmdGb3JjZVkgKz0gc3ByaW5nRm9yY2VZO1xyXG4gIHRhcmdldE5vZGUuc3ByaW5nRm9yY2VYIC09IHNwcmluZ0ZvcmNlWDtcclxuICB0YXJnZXROb2RlLnNwcmluZ0ZvcmNlWSAtPSBzcHJpbmdGb3JjZVk7XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvbkZvcmNlID0gZnVuY3Rpb24gKG5vZGVBLCBub2RlQikge1xyXG4gIHZhciByZWN0QSA9IG5vZGVBLmdldFJlY3QoKTtcclxuICB2YXIgcmVjdEIgPSBub2RlQi5nZXRSZWN0KCk7XHJcbiAgdmFyIG92ZXJsYXBBbW91bnQgPSBuZXcgQXJyYXkoMik7XHJcbiAgdmFyIGNsaXBQb2ludHMgPSBuZXcgQXJyYXkoNCk7XHJcbiAgdmFyIGRpc3RhbmNlWDtcclxuICB2YXIgZGlzdGFuY2VZO1xyXG4gIHZhciBkaXN0YW5jZVNxdWFyZWQ7XHJcbiAgdmFyIGRpc3RhbmNlO1xyXG4gIHZhciByZXB1bHNpb25Gb3JjZTtcclxuICB2YXIgcmVwdWxzaW9uRm9yY2VYO1xyXG4gIHZhciByZXB1bHNpb25Gb3JjZVk7XHJcblxyXG4gIGlmIChyZWN0QS5pbnRlcnNlY3RzKHJlY3RCKSkvLyB0d28gbm9kZXMgb3ZlcmxhcFxyXG4gIHtcclxuICAgIC8vIGNhbGN1bGF0ZSBzZXBhcmF0aW9uIGFtb3VudCBpbiB4IGFuZCB5IGRpcmVjdGlvbnNcclxuICAgIElHZW9tZXRyeS5jYWxjU2VwYXJhdGlvbkFtb3VudChyZWN0QSxcclxuICAgICAgICAgICAgcmVjdEIsXHJcbiAgICAgICAgICAgIG92ZXJsYXBBbW91bnQsXHJcbiAgICAgICAgICAgIEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggLyAyLjApO1xyXG5cclxuICAgIHJlcHVsc2lvbkZvcmNlWCA9IG92ZXJsYXBBbW91bnRbMF07XHJcbiAgICByZXB1bHNpb25Gb3JjZVkgPSBvdmVybGFwQW1vdW50WzFdO1xyXG4gIH1cclxuICBlbHNlLy8gbm8gb3ZlcmxhcFxyXG4gIHtcclxuICAgIC8vIGNhbGN1bGF0ZSBkaXN0YW5jZVxyXG5cclxuICAgIGlmICh0aGlzLnVuaWZvcm1MZWFmTm9kZVNpemVzICYmXHJcbiAgICAgICAgICAgIG5vZGVBLmdldENoaWxkKCkgPT0gbnVsbCAmJiBub2RlQi5nZXRDaGlsZCgpID09IG51bGwpLy8gc2ltcGx5IGJhc2UgcmVwdWxzaW9uIG9uIGRpc3RhbmNlIG9mIG5vZGUgY2VudGVyc1xyXG4gICAge1xyXG4gICAgICBkaXN0YW5jZVggPSByZWN0Qi5nZXRDZW50ZXJYKCkgLSByZWN0QS5nZXRDZW50ZXJYKCk7XHJcbiAgICAgIGRpc3RhbmNlWSA9IHJlY3RCLmdldENlbnRlclkoKSAtIHJlY3RBLmdldENlbnRlclkoKTtcclxuICAgIH1cclxuICAgIGVsc2UvLyB1c2UgY2xpcHBpbmcgcG9pbnRzXHJcbiAgICB7XHJcbiAgICAgIElHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24ocmVjdEEsIHJlY3RCLCBjbGlwUG9pbnRzKTtcclxuXHJcbiAgICAgIGRpc3RhbmNlWCA9IGNsaXBQb2ludHNbMl0gLSBjbGlwUG9pbnRzWzBdO1xyXG4gICAgICBkaXN0YW5jZVkgPSBjbGlwUG9pbnRzWzNdIC0gY2xpcFBvaW50c1sxXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBObyByZXB1bHNpb24gcmFuZ2UuIEZSIGdyaWQgdmFyaWFudCBzaG91bGQgdGFrZSBjYXJlIG9mIHRoaXMuXHJcbiAgICBpZiAoTWF0aC5hYnMoZGlzdGFuY2VYKSA8IEZETGF5b3V0Q29uc3RhbnRzLk1JTl9SRVBVTFNJT05fRElTVClcclxuICAgIHtcclxuICAgICAgZGlzdGFuY2VYID0gSU1hdGguc2lnbihkaXN0YW5jZVgpICpcclxuICAgICAgICAgICAgICBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1Q7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKGRpc3RhbmNlWSkgPCBGRExheW91dENvbnN0YW50cy5NSU5fUkVQVUxTSU9OX0RJU1QpXHJcbiAgICB7XHJcbiAgICAgIGRpc3RhbmNlWSA9IElNYXRoLnNpZ24oZGlzdGFuY2VZKSAqXHJcbiAgICAgICAgICAgICAgRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3RhbmNlU3F1YXJlZCA9IGRpc3RhbmNlWCAqIGRpc3RhbmNlWCArIGRpc3RhbmNlWSAqIGRpc3RhbmNlWTtcclxuICAgIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGRpc3RhbmNlU3F1YXJlZCk7XHJcblxyXG4gICAgcmVwdWxzaW9uRm9yY2UgPSB0aGlzLnJlcHVsc2lvbkNvbnN0YW50IC8gZGlzdGFuY2VTcXVhcmVkO1xyXG5cclxuICAgIC8vIFByb2plY3QgZm9yY2Ugb250byB4IGFuZCB5IGF4ZXNcclxuICAgIHJlcHVsc2lvbkZvcmNlWCA9IHJlcHVsc2lvbkZvcmNlICogZGlzdGFuY2VYIC8gZGlzdGFuY2U7XHJcbiAgICByZXB1bHNpb25Gb3JjZVkgPSByZXB1bHNpb25Gb3JjZSAqIGRpc3RhbmNlWSAvIGRpc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgLy8gQXBwbHkgZm9yY2VzIG9uIHRoZSB0d28gbm9kZXNcclxuICBub2RlQS5yZXB1bHNpb25Gb3JjZVggLT0gcmVwdWxzaW9uRm9yY2VYO1xyXG4gIG5vZGVBLnJlcHVsc2lvbkZvcmNlWSAtPSByZXB1bHNpb25Gb3JjZVk7XHJcbiAgbm9kZUIucmVwdWxzaW9uRm9yY2VYICs9IHJlcHVsc2lvbkZvcmNlWDtcclxuICBub2RlQi5yZXB1bHNpb25Gb3JjZVkgKz0gcmVwdWxzaW9uRm9yY2VZO1xyXG59O1xyXG5cclxuRkRMYXlvdXQucHJvdG90eXBlLmNhbGNHcmF2aXRhdGlvbmFsRm9yY2UgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gIHZhciBvd25lckdyYXBoO1xyXG4gIHZhciBvd25lckNlbnRlclg7XHJcbiAgdmFyIG93bmVyQ2VudGVyWTtcclxuICB2YXIgZGlzdGFuY2VYO1xyXG4gIHZhciBkaXN0YW5jZVk7XHJcbiAgdmFyIGFic0Rpc3RhbmNlWDtcclxuICB2YXIgYWJzRGlzdGFuY2VZO1xyXG4gIHZhciBlc3RpbWF0ZWRTaXplO1xyXG4gIG93bmVyR3JhcGggPSBub2RlLmdldE93bmVyKCk7XHJcblxyXG4gIG93bmVyQ2VudGVyWCA9IChvd25lckdyYXBoLmdldFJpZ2h0KCkgKyBvd25lckdyYXBoLmdldExlZnQoKSkgLyAyO1xyXG4gIG93bmVyQ2VudGVyWSA9IChvd25lckdyYXBoLmdldFRvcCgpICsgb3duZXJHcmFwaC5nZXRCb3R0b20oKSkgLyAyO1xyXG4gIGRpc3RhbmNlWCA9IG5vZGUuZ2V0Q2VudGVyWCgpIC0gb3duZXJDZW50ZXJYO1xyXG4gIGRpc3RhbmNlWSA9IG5vZGUuZ2V0Q2VudGVyWSgpIC0gb3duZXJDZW50ZXJZO1xyXG4gIGFic0Rpc3RhbmNlWCA9IE1hdGguYWJzKGRpc3RhbmNlWCk7XHJcbiAgYWJzRGlzdGFuY2VZID0gTWF0aC5hYnMoZGlzdGFuY2VZKTtcclxuXHJcbiAgaWYgKG5vZGUuZ2V0T3duZXIoKSA9PSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkpLy8gaW4gdGhlIHJvb3QgZ3JhcGhcclxuICB7XHJcbiAgICBNYXRoLmZsb29yKDgwKTtcclxuICAgIGVzdGltYXRlZFNpemUgPSBNYXRoLmZsb29yKG93bmVyR3JhcGguZ2V0RXN0aW1hdGVkU2l6ZSgpICpcclxuICAgICAgICAgICAgdGhpcy5ncmF2aXR5UmFuZ2VGYWN0b3IpO1xyXG5cclxuICAgIGlmIChhYnNEaXN0YW5jZVggPiBlc3RpbWF0ZWRTaXplIHx8IGFic0Rpc3RhbmNlWSA+IGVzdGltYXRlZFNpemUpXHJcbiAgICB7XHJcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVggPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVg7XHJcbiAgICAgIG5vZGUuZ3Jhdml0YXRpb25Gb3JjZVkgPSAtdGhpcy5ncmF2aXR5Q29uc3RhbnQgKiBkaXN0YW5jZVk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UvLyBpbnNpZGUgYSBjb21wb3VuZFxyXG4gIHtcclxuICAgIGVzdGltYXRlZFNpemUgPSBNYXRoLmZsb29yKChvd25lckdyYXBoLmdldEVzdGltYXRlZFNpemUoKSAqXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG91bmRHcmF2aXR5UmFuZ2VGYWN0b3IpKTtcclxuXHJcbiAgICBpZiAoYWJzRGlzdGFuY2VYID4gZXN0aW1hdGVkU2l6ZSB8fCBhYnNEaXN0YW5jZVkgPiBlc3RpbWF0ZWRTaXplKVxyXG4gICAge1xyXG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VYID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VYICpcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50O1xyXG4gICAgICBub2RlLmdyYXZpdGF0aW9uRm9yY2VZID0gLXRoaXMuZ3Jhdml0eUNvbnN0YW50ICogZGlzdGFuY2VZICpcclxuICAgICAgICAgICAgICB0aGlzLmNvbXBvdW5kR3Jhdml0eUNvbnN0YW50O1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkZETGF5b3V0LnByb3RvdHlwZS5pc0NvbnZlcmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgY29udmVyZ2VkO1xyXG4gIHZhciBvc2NpbGF0aW5nID0gZmFsc2U7XHJcblxyXG4gIGlmICh0aGlzLnRvdGFsSXRlcmF0aW9ucyA+IHRoaXMubWF4SXRlcmF0aW9ucyAvIDMpXHJcbiAge1xyXG4gICAgb3NjaWxhdGluZyA9XHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudG90YWxEaXNwbGFjZW1lbnQgLSB0aGlzLm9sZFRvdGFsRGlzcGxhY2VtZW50KSA8IDI7XHJcbiAgfVxyXG5cclxuICBjb252ZXJnZWQgPSB0aGlzLnRvdGFsRGlzcGxhY2VtZW50IDwgdGhpcy50b3RhbERpc3BsYWNlbWVudFRocmVzaG9sZDtcclxuXHJcbiAgdGhpcy5vbGRUb3RhbERpc3BsYWNlbWVudCA9IHRoaXMudG90YWxEaXNwbGFjZW1lbnQ7XHJcblxyXG4gIHJldHVybiBjb252ZXJnZWQgfHwgb3NjaWxhdGluZztcclxufTtcclxuXHJcbkZETGF5b3V0LnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dCAmJiAhdGhpcy5pc1N1YkxheW91dClcclxuICB7XHJcbiAgICBpZiAodGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMgPT0gdGhpcy5hbmltYXRpb25QZXJpb2QpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgIHRoaXMubm90QW5pbWF0ZWRJdGVyYXRpb25zID0gMDtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgdGhpcy5ub3RBbmltYXRlZEl0ZXJhdGlvbnMrKztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5GRExheW91dC5wcm90b3R5cGUuY2FsY1JlcHVsc2lvblJhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiAwLjA7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZETGF5b3V0O1xyXG4iLCJ2YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcclxuXHJcbmZ1bmN0aW9uIEZETGF5b3V0Q29uc3RhbnRzKCkge1xyXG59XHJcblxyXG4vL0ZETGF5b3V0Q29uc3RhbnRzIGluaGVyaXRzIHN0YXRpYyBwcm9wcyBpbiBMYXlvdXRDb25zdGFudHNcclxuZm9yICh2YXIgcHJvcCBpbiBMYXlvdXRDb25zdGFudHMpIHtcclxuICBGRExheW91dENvbnN0YW50c1twcm9wXSA9IExheW91dENvbnN0YW50c1twcm9wXTtcclxufVxyXG5cclxuRkRMYXlvdXRDb25zdGFudHMuTUFYX0lURVJBVElPTlMgPSAyNTAwO1xyXG5cclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IDUwO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSCA9IDAuNDU7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUkVQVUxTSU9OX1NUUkVOR1RIID0gNDUwMC4wO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfU1RSRU5HVEggPSAwLjQ7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IDEuMDtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IDMuODtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IDEuNTtcclxuRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VU0VfU01BUlRfSURFQUxfRURHRV9MRU5HVEhfQ0FMQ1VMQVRJT04gPSB0cnVlO1xyXG5GRExheW91dENvbnN0YW50cy5ERUZBVUxUX1VTRV9TTUFSVF9SRVBVTFNJT05fUkFOR0VfQ0FMQ1VMQVRJT04gPSB0cnVlO1xyXG5GRExheW91dENvbnN0YW50cy5NQVhfTk9ERV9ESVNQTEFDRU1FTlRfSU5DUkVNRU5UQUwgPSAxMDAuMDtcclxuRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UID0gRkRMYXlvdXRDb25zdGFudHMuTUFYX05PREVfRElTUExBQ0VNRU5UX0lOQ1JFTUVOVEFMICogMztcclxuRkRMYXlvdXRDb25zdGFudHMuTUlOX1JFUFVMU0lPTl9ESVNUID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCAvIDEwLjA7XHJcbkZETGF5b3V0Q29uc3RhbnRzLkNPTlZFUkdFTkNFX0NIRUNLX1BFUklPRCA9IDEwMDtcclxuRkRMYXlvdXRDb25zdGFudHMuUEVSX0xFVkVMX0lERUFMX0VER0VfTEVOR1RIX0ZBQ1RPUiA9IDAuMTtcclxuRkRMYXlvdXRDb25zdGFudHMuTUlOX0VER0VfTEVOR1RIID0gMTtcclxuRkRMYXlvdXRDb25zdGFudHMuR1JJRF9DQUxDVUxBVElPTl9DSEVDS19QRVJJT0QgPSAxMDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRkRMYXlvdXRDb25zdGFudHM7XHJcbiIsInZhciBMRWRnZSA9IHJlcXVpcmUoJy4vTEVkZ2UnKTtcclxudmFyIEZETGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9GRExheW91dENvbnN0YW50cycpO1xyXG5cclxuZnVuY3Rpb24gRkRMYXlvdXRFZGdlKHNvdXJjZSwgdGFyZ2V0LCB2RWRnZSkge1xyXG4gIExFZGdlLmNhbGwodGhpcywgc291cmNlLCB0YXJnZXQsIHZFZGdlKTtcclxuICB0aGlzLmlkZWFsTGVuZ3RoID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSDtcclxufVxyXG5cclxuRkRMYXlvdXRFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEVkZ2UucHJvdG90eXBlKTtcclxuXHJcbmZvciAodmFyIHByb3AgaW4gTEVkZ2UpIHtcclxuICBGRExheW91dEVkZ2VbcHJvcF0gPSBMRWRnZVtwcm9wXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dEVkZ2U7XHJcbiIsInZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcclxuXHJcbmZ1bmN0aW9uIEZETGF5b3V0Tm9kZShnbSwgbG9jLCBzaXplLCB2Tm9kZSkge1xyXG4gIC8vIGFsdGVybmF0aXZlIGNvbnN0cnVjdG9yIGlzIGhhbmRsZWQgaW5zaWRlIExOb2RlXHJcbiAgTE5vZGUuY2FsbCh0aGlzLCBnbSwgbG9jLCBzaXplLCB2Tm9kZSk7XHJcbiAgLy9TcHJpbmcsIHJlcHVsc2lvbiBhbmQgZ3Jhdml0YXRpb25hbCBmb3JjZXMgYWN0aW5nIG9uIHRoaXMgbm9kZVxyXG4gIHRoaXMuc3ByaW5nRm9yY2VYID0gMDtcclxuICB0aGlzLnNwcmluZ0ZvcmNlWSA9IDA7XHJcbiAgdGhpcy5yZXB1bHNpb25Gb3JjZVggPSAwO1xyXG4gIHRoaXMucmVwdWxzaW9uRm9yY2VZID0gMDtcclxuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VYID0gMDtcclxuICB0aGlzLmdyYXZpdGF0aW9uRm9yY2VZID0gMDtcclxuICAvL0Ftb3VudCBieSB3aGljaCB0aGlzIG5vZGUgaXMgdG8gYmUgbW92ZWQgaW4gdGhpcyBpdGVyYXRpb25cclxuICB0aGlzLmRpc3BsYWNlbWVudFggPSAwO1xyXG4gIHRoaXMuZGlzcGxhY2VtZW50WSA9IDA7XHJcblxyXG4gIC8vU3RhcnQgYW5kIGZpbmlzaCBncmlkIGNvb3JkaW5hdGVzIHRoYXQgdGhpcyBub2RlIGlzIGZhbGxlbiBpbnRvXHJcbiAgdGhpcy5zdGFydFggPSAwO1xyXG4gIHRoaXMuZmluaXNoWCA9IDA7XHJcbiAgdGhpcy5zdGFydFkgPSAwO1xyXG4gIHRoaXMuZmluaXNoWSA9IDA7XHJcblxyXG4gIC8vR2VvbWV0cmljIG5laWdoYm9ycyBvZiB0aGlzIG5vZGVcclxuICB0aGlzLnN1cnJvdW5kaW5nID0gW107XHJcbn1cclxuXHJcbkZETGF5b3V0Tm9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExOb2RlLnByb3RvdHlwZSk7XHJcblxyXG5mb3IgKHZhciBwcm9wIGluIExOb2RlKSB7XHJcbiAgRkRMYXlvdXROb2RlW3Byb3BdID0gTE5vZGVbcHJvcF07XHJcbn1cclxuXHJcbkZETGF5b3V0Tm9kZS5wcm90b3R5cGUuc2V0R3JpZENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKF9zdGFydFgsIF9maW5pc2hYLCBfc3RhcnRZLCBfZmluaXNoWSlcclxue1xyXG4gIHRoaXMuc3RhcnRYID0gX3N0YXJ0WDtcclxuICB0aGlzLmZpbmlzaFggPSBfZmluaXNoWDtcclxuICB0aGlzLnN0YXJ0WSA9IF9zdGFydFk7XHJcbiAgdGhpcy5maW5pc2hZID0gX2ZpbmlzaFk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGRExheW91dE5vZGU7XHJcbiIsInZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcclxuXHJcbmZ1bmN0aW9uIEhhc2hNYXAoKSB7XHJcbiAgdGhpcy5tYXAgPSB7fTtcclxuICB0aGlzLmtleXMgPSBbXTtcclxufVxyXG5cclxuSGFzaE1hcC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xyXG4gIGlmICghdGhpcy5jb250YWlucyh0aGVJZCkpIHtcclxuICAgIHRoaXMubWFwW3RoZUlkXSA9IHZhbHVlO1xyXG4gICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICB9XHJcbn07XHJcblxyXG5IYXNoTWFwLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICB2YXIgdGhlSWQgPSBVbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRChrZXkpO1xyXG4gIHJldHVybiB0aGlzLm1hcFtrZXldICE9IG51bGw7XHJcbn07XHJcblxyXG5IYXNoTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgdmFyIHRoZUlkID0gVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQoa2V5KTtcclxuICByZXR1cm4gdGhpcy5tYXBbdGhlSWRdO1xyXG59O1xyXG5cclxuSGFzaE1hcC5wcm90b3R5cGUua2V5U2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmtleXM7XHJcbn07XHJcblxyXG5IYXNoTWFwLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmtleXMubGVuZ3RoO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXNoTWFwO1xyXG4iLCJ2YXIgVW5pcXVlSURHZW5lcmV0b3IgPSByZXF1aXJlKCcuL1VuaXF1ZUlER2VuZXJldG9yJyk7XHJcblxyXG5mdW5jdGlvbiBIYXNoU2V0KCkge1xyXG4gIHRoaXMuc2V0ID0ge307XHJcbn1cclxuO1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG9iaikge1xyXG4gIHZhciB0aGVJZCA9IFVuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKG9iaik7XHJcbiAgaWYgKCF0aGlzLmNvbnRhaW5zKHRoZUlkKSlcclxuICAgIHRoaXMuc2V0W3RoZUlkXSA9IG9iajtcclxufTtcclxuXHJcbkhhc2hTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICBkZWxldGUgdGhpcy5zZXRbVW5pcXVlSURHZW5lcmV0b3IuY3JlYXRlSUQob2JqKV07XHJcbn07XHJcblxyXG5IYXNoU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnNldCA9IHt9O1xyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgcmV0dXJuIHRoaXMuc2V0W1VuaXF1ZUlER2VuZXJldG9yLmNyZWF0ZUlEKG9iaildID09IG9iajtcclxufTtcclxuXHJcbkhhc2hTZXQucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zZXQpLmxlbmd0aDtcclxufTtcclxuXHJcbi8vY29uY2F0cyB0aGlzLnNldCB0byB0aGUgZ2l2ZW4gbGlzdFxyXG5IYXNoU2V0LnByb3RvdHlwZS5hZGRBbGxUbyA9IGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNldCk7XHJcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgIGxpc3QucHVzaCh0aGlzLnNldFtrZXlzW2ldXSk7XHJcbiAgfVxyXG59O1xyXG5cclxuSGFzaFNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zZXQpLmxlbmd0aDtcclxufTtcclxuXHJcbkhhc2hTZXQucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgdmFyIHMgPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKykge1xyXG4gICAgdmFyIHYgPSBsaXN0W2ldO1xyXG4gICAgdGhpcy5hZGQodik7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIYXNoU2V0O1xyXG4iLCJmdW5jdGlvbiBJR2VvbWV0cnkoKSB7XHJcbn1cclxuXHJcbklHZW9tZXRyeS5jYWxjU2VwYXJhdGlvbkFtb3VudCA9IGZ1bmN0aW9uIChyZWN0QSwgcmVjdEIsIG92ZXJsYXBBbW91bnQsIHNlcGFyYXRpb25CdWZmZXIpXHJcbntcclxuICBpZiAoIXJlY3RBLmludGVyc2VjdHMocmVjdEIpKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcbiAgdmFyIGRpcmVjdGlvbnMgPSBuZXcgQXJyYXkoMik7XHJcbiAgSUdlb21ldHJ5LmRlY2lkZURpcmVjdGlvbnNGb3JPdmVybGFwcGluZ05vZGVzKHJlY3RBLCByZWN0QiwgZGlyZWN0aW9ucyk7XHJcbiAgb3ZlcmxhcEFtb3VudFswXSA9IE1hdGgubWluKHJlY3RBLmdldFJpZ2h0KCksIHJlY3RCLmdldFJpZ2h0KCkpIC1cclxuICAgICAgICAgIE1hdGgubWF4KHJlY3RBLngsIHJlY3RCLngpO1xyXG4gIG92ZXJsYXBBbW91bnRbMV0gPSBNYXRoLm1pbihyZWN0QS5nZXRCb3R0b20oKSwgcmVjdEIuZ2V0Qm90dG9tKCkpIC1cclxuICAgICAgICAgIE1hdGgubWF4KHJlY3RBLnksIHJlY3RCLnkpO1xyXG4gIC8vIHVwZGF0ZSB0aGUgb3ZlcmxhcHBpbmcgYW1vdW50cyBmb3IgdGhlIGZvbGxvd2luZyBjYXNlczpcclxuICBpZiAoKHJlY3RBLmdldFgoKSA8PSByZWN0Qi5nZXRYKCkpICYmIChyZWN0QS5nZXRSaWdodCgpID49IHJlY3RCLmdldFJpZ2h0KCkpKVxyXG4gIHtcclxuICAgIG92ZXJsYXBBbW91bnRbMF0gKz0gTWF0aC5taW4oKHJlY3RCLmdldFgoKSAtIHJlY3RBLmdldFgoKSksXHJcbiAgICAgICAgICAgIChyZWN0QS5nZXRSaWdodCgpIC0gcmVjdEIuZ2V0UmlnaHQoKSkpO1xyXG4gIH1cclxuICBlbHNlIGlmICgocmVjdEIuZ2V0WCgpIDw9IHJlY3RBLmdldFgoKSkgJiYgKHJlY3RCLmdldFJpZ2h0KCkgPj0gcmVjdEEuZ2V0UmlnaHQoKSkpXHJcbiAge1xyXG4gICAgb3ZlcmxhcEFtb3VudFswXSArPSBNYXRoLm1pbigocmVjdEEuZ2V0WCgpIC0gcmVjdEIuZ2V0WCgpKSxcclxuICAgICAgICAgICAgKHJlY3RCLmdldFJpZ2h0KCkgLSByZWN0QS5nZXRSaWdodCgpKSk7XHJcbiAgfVxyXG4gIGlmICgocmVjdEEuZ2V0WSgpIDw9IHJlY3RCLmdldFkoKSkgJiYgKHJlY3RBLmdldEJvdHRvbSgpID49IHJlY3RCLmdldEJvdHRvbSgpKSlcclxuICB7XHJcbiAgICBvdmVybGFwQW1vdW50WzFdICs9IE1hdGgubWluKChyZWN0Qi5nZXRZKCkgLSByZWN0QS5nZXRZKCkpLFxyXG4gICAgICAgICAgICAocmVjdEEuZ2V0Qm90dG9tKCkgLSByZWN0Qi5nZXRCb3R0b20oKSkpO1xyXG4gIH1cclxuICBlbHNlIGlmICgocmVjdEIuZ2V0WSgpIDw9IHJlY3RBLmdldFkoKSkgJiYgKHJlY3RCLmdldEJvdHRvbSgpID49IHJlY3RBLmdldEJvdHRvbSgpKSlcclxuICB7XHJcbiAgICBvdmVybGFwQW1vdW50WzFdICs9IE1hdGgubWluKChyZWN0QS5nZXRZKCkgLSByZWN0Qi5nZXRZKCkpLFxyXG4gICAgICAgICAgICAocmVjdEIuZ2V0Qm90dG9tKCkgLSByZWN0QS5nZXRCb3R0b20oKSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gZmluZCBzbG9wZSBvZiB0aGUgbGluZSBwYXNzZXMgdHdvIGNlbnRlcnNcclxuICB2YXIgc2xvcGUgPSBNYXRoLmFicygocmVjdEIuZ2V0Q2VudGVyWSgpIC0gcmVjdEEuZ2V0Q2VudGVyWSgpKSAvXHJcbiAgICAgICAgICAocmVjdEIuZ2V0Q2VudGVyWCgpIC0gcmVjdEEuZ2V0Q2VudGVyWCgpKSk7XHJcbiAgLy8gaWYgY2VudGVycyBhcmUgb3ZlcmxhcHBlZFxyXG4gIGlmICgocmVjdEIuZ2V0Q2VudGVyWSgpID09IHJlY3RBLmdldENlbnRlclkoKSkgJiZcclxuICAgICAgICAgIChyZWN0Qi5nZXRDZW50ZXJYKCkgPT0gcmVjdEEuZ2V0Q2VudGVyWCgpKSlcclxuICB7XHJcbiAgICAvLyBhc3N1bWUgdGhlIHNsb3BlIGlzIDEgKDQ1IGRlZ3JlZSlcclxuICAgIHNsb3BlID0gMS4wO1xyXG4gIH1cclxuXHJcbiAgdmFyIG1vdmVCeVkgPSBzbG9wZSAqIG92ZXJsYXBBbW91bnRbMF07XHJcbiAgdmFyIG1vdmVCeVggPSBvdmVybGFwQW1vdW50WzFdIC8gc2xvcGU7XHJcbiAgaWYgKG92ZXJsYXBBbW91bnRbMF0gPCBtb3ZlQnlYKVxyXG4gIHtcclxuICAgIG1vdmVCeVggPSBvdmVybGFwQW1vdW50WzBdO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgbW92ZUJ5WSA9IG92ZXJsYXBBbW91bnRbMV07XHJcbiAgfVxyXG4gIC8vIHJldHVybiBoYWxmIHRoZSBhbW91bnQgc28gdGhhdCBpZiBlYWNoIHJlY3RhbmdsZSBpcyBtb3ZlZCBieSB0aGVzZVxyXG4gIC8vIGFtb3VudHMgaW4gb3Bwb3NpdGUgZGlyZWN0aW9ucywgb3ZlcmxhcCB3aWxsIGJlIHJlc29sdmVkXHJcbiAgb3ZlcmxhcEFtb3VudFswXSA9IC0xICogZGlyZWN0aW9uc1swXSAqICgobW92ZUJ5WCAvIDIpICsgc2VwYXJhdGlvbkJ1ZmZlcik7XHJcbiAgb3ZlcmxhcEFtb3VudFsxXSA9IC0xICogZGlyZWN0aW9uc1sxXSAqICgobW92ZUJ5WSAvIDIpICsgc2VwYXJhdGlvbkJ1ZmZlcik7XHJcbn1cclxuXHJcbklHZW9tZXRyeS5kZWNpZGVEaXJlY3Rpb25zRm9yT3ZlcmxhcHBpbmdOb2RlcyA9IGZ1bmN0aW9uIChyZWN0QSwgcmVjdEIsIGRpcmVjdGlvbnMpXHJcbntcclxuICBpZiAocmVjdEEuZ2V0Q2VudGVyWCgpIDwgcmVjdEIuZ2V0Q2VudGVyWCgpKVxyXG4gIHtcclxuICAgIGRpcmVjdGlvbnNbMF0gPSAtMTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIGRpcmVjdGlvbnNbMF0gPSAxO1xyXG4gIH1cclxuXHJcbiAgaWYgKHJlY3RBLmdldENlbnRlclkoKSA8IHJlY3RCLmdldENlbnRlclkoKSlcclxuICB7XHJcbiAgICBkaXJlY3Rpb25zWzFdID0gLTE7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICBkaXJlY3Rpb25zWzFdID0gMTtcclxuICB9XHJcbn1cclxuXHJcbklHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24yID0gZnVuY3Rpb24gKHJlY3RBLCByZWN0QiwgcmVzdWx0KVxyXG57XHJcbiAgLy9yZXN1bHRbMC0xXSB3aWxsIGNvbnRhaW4gY2xpcFBvaW50IG9mIHJlY3RBLCByZXN1bHRbMi0zXSB3aWxsIGNvbnRhaW4gY2xpcFBvaW50IG9mIHJlY3RCXHJcbiAgdmFyIHAxeCA9IHJlY3RBLmdldENlbnRlclgoKTtcclxuICB2YXIgcDF5ID0gcmVjdEEuZ2V0Q2VudGVyWSgpO1xyXG4gIHZhciBwMnggPSByZWN0Qi5nZXRDZW50ZXJYKCk7XHJcbiAgdmFyIHAyeSA9IHJlY3RCLmdldENlbnRlclkoKTtcclxuXHJcbiAgLy9pZiB0d28gcmVjdGFuZ2xlcyBpbnRlcnNlY3QsIHRoZW4gY2xpcHBpbmcgcG9pbnRzIGFyZSBjZW50ZXJzXHJcbiAgaWYgKHJlY3RBLmludGVyc2VjdHMocmVjdEIpKVxyXG4gIHtcclxuICAgIHJlc3VsdFswXSA9IHAxeDtcclxuICAgIHJlc3VsdFsxXSA9IHAxeTtcclxuICAgIHJlc3VsdFsyXSA9IHAyeDtcclxuICAgIHJlc3VsdFszXSA9IHAyeTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICAvL3ZhcmlhYmxlcyBmb3IgcmVjdEFcclxuICB2YXIgdG9wTGVmdEF4ID0gcmVjdEEuZ2V0WCgpO1xyXG4gIHZhciB0b3BMZWZ0QXkgPSByZWN0QS5nZXRZKCk7XHJcbiAgdmFyIHRvcFJpZ2h0QXggPSByZWN0QS5nZXRSaWdodCgpO1xyXG4gIHZhciBib3R0b21MZWZ0QXggPSByZWN0QS5nZXRYKCk7XHJcbiAgdmFyIGJvdHRvbUxlZnRBeSA9IHJlY3RBLmdldEJvdHRvbSgpO1xyXG4gIHZhciBib3R0b21SaWdodEF4ID0gcmVjdEEuZ2V0UmlnaHQoKTtcclxuICB2YXIgaGFsZldpZHRoQSA9IHJlY3RBLmdldFdpZHRoSGFsZigpO1xyXG4gIHZhciBoYWxmSGVpZ2h0QSA9IHJlY3RBLmdldEhlaWdodEhhbGYoKTtcclxuICAvL3ZhcmlhYmxlcyBmb3IgcmVjdEJcclxuICB2YXIgdG9wTGVmdEJ4ID0gcmVjdEIuZ2V0WCgpO1xyXG4gIHZhciB0b3BMZWZ0QnkgPSByZWN0Qi5nZXRZKCk7XHJcbiAgdmFyIHRvcFJpZ2h0QnggPSByZWN0Qi5nZXRSaWdodCgpO1xyXG4gIHZhciBib3R0b21MZWZ0QnggPSByZWN0Qi5nZXRYKCk7XHJcbiAgdmFyIGJvdHRvbUxlZnRCeSA9IHJlY3RCLmdldEJvdHRvbSgpO1xyXG4gIHZhciBib3R0b21SaWdodEJ4ID0gcmVjdEIuZ2V0UmlnaHQoKTtcclxuICB2YXIgaGFsZldpZHRoQiA9IHJlY3RCLmdldFdpZHRoSGFsZigpO1xyXG4gIHZhciBoYWxmSGVpZ2h0QiA9IHJlY3RCLmdldEhlaWdodEhhbGYoKTtcclxuICAvL2ZsYWcgd2hldGhlciBjbGlwcGluZyBwb2ludHMgYXJlIGZvdW5kXHJcbiAgdmFyIGNsaXBQb2ludEFGb3VuZCA9IGZhbHNlO1xyXG4gIHZhciBjbGlwUG9pbnRCRm91bmQgPSBmYWxzZTtcclxuXHJcbiAgLy8gbGluZSBpcyB2ZXJ0aWNhbFxyXG4gIGlmIChwMXggPT0gcDJ4KVxyXG4gIHtcclxuICAgIGlmIChwMXkgPiBwMnkpXHJcbiAgICB7XHJcbiAgICAgIHJlc3VsdFswXSA9IHAxeDtcclxuICAgICAgcmVzdWx0WzFdID0gdG9wTGVmdEF5O1xyXG4gICAgICByZXN1bHRbMl0gPSBwMng7XHJcbiAgICAgIHJlc3VsdFszXSA9IGJvdHRvbUxlZnRCeTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocDF5IDwgcDJ5KVxyXG4gICAge1xyXG4gICAgICByZXN1bHRbMF0gPSBwMXg7XHJcbiAgICAgIHJlc3VsdFsxXSA9IGJvdHRvbUxlZnRBeTtcclxuICAgICAgcmVzdWx0WzJdID0gcDJ4O1xyXG4gICAgICByZXN1bHRbM10gPSB0b3BMZWZ0Qnk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgLy9ub3QgbGluZSwgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGxpbmUgaXMgaG9yaXpvbnRhbFxyXG4gIGVsc2UgaWYgKHAxeSA9PSBwMnkpXHJcbiAge1xyXG4gICAgaWYgKHAxeCA+IHAyeClcclxuICAgIHtcclxuICAgICAgcmVzdWx0WzBdID0gdG9wTGVmdEF4O1xyXG4gICAgICByZXN1bHRbMV0gPSBwMXk7XHJcbiAgICAgIHJlc3VsdFsyXSA9IHRvcFJpZ2h0Qng7XHJcbiAgICAgIHJlc3VsdFszXSA9IHAyeTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocDF4IDwgcDJ4KVxyXG4gICAge1xyXG4gICAgICByZXN1bHRbMF0gPSB0b3BSaWdodEF4O1xyXG4gICAgICByZXN1bHRbMV0gPSBwMXk7XHJcbiAgICAgIHJlc3VsdFsyXSA9IHRvcExlZnRCeDtcclxuICAgICAgcmVzdWx0WzNdID0gcDJ5O1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIC8vbm90IHZhbGlkIGxpbmUsIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgLy9zbG9wZXMgb2YgcmVjdEEncyBhbmQgcmVjdEIncyBkaWFnb25hbHNcclxuICAgIHZhciBzbG9wZUEgPSByZWN0QS5oZWlnaHQgLyByZWN0QS53aWR0aDtcclxuICAgIHZhciBzbG9wZUIgPSByZWN0Qi5oZWlnaHQgLyByZWN0Qi53aWR0aDtcclxuXHJcbiAgICAvL3Nsb3BlIG9mIGxpbmUgYmV0d2VlbiBjZW50ZXIgb2YgcmVjdEEgYW5kIGNlbnRlciBvZiByZWN0QlxyXG4gICAgdmFyIHNsb3BlUHJpbWUgPSAocDJ5IC0gcDF5KSAvIChwMnggLSBwMXgpO1xyXG4gICAgdmFyIGNhcmRpbmFsRGlyZWN0aW9uQTtcclxuICAgIHZhciBjYXJkaW5hbERpcmVjdGlvbkI7XHJcbiAgICB2YXIgdGVtcFBvaW50QXg7XHJcbiAgICB2YXIgdGVtcFBvaW50QXk7XHJcbiAgICB2YXIgdGVtcFBvaW50Qng7XHJcbiAgICB2YXIgdGVtcFBvaW50Qnk7XHJcblxyXG4gICAgLy9kZXRlcm1pbmUgd2hldGhlciBjbGlwcGluZyBwb2ludCBpcyB0aGUgY29ybmVyIG9mIG5vZGVBXHJcbiAgICBpZiAoKC1zbG9wZUEpID09IHNsb3BlUHJpbWUpXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMXggPiBwMngpXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMF0gPSBib3R0b21MZWZ0QXg7XHJcbiAgICAgICAgcmVzdWx0WzFdID0gYm90dG9tTGVmdEF5O1xyXG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzBdID0gdG9wUmlnaHRBeDtcclxuICAgICAgICByZXN1bHRbMV0gPSB0b3BMZWZ0QXk7XHJcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc2xvcGVBID09IHNsb3BlUHJpbWUpXHJcbiAgICB7XHJcbiAgICAgIGlmIChwMXggPiBwMngpXHJcbiAgICAgIHtcclxuICAgICAgICByZXN1bHRbMF0gPSB0b3BMZWZ0QXg7XHJcbiAgICAgICAgcmVzdWx0WzFdID0gdG9wTGVmdEF5O1xyXG4gICAgICAgIGNsaXBQb2ludEFGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzBdID0gYm90dG9tUmlnaHRBeDtcclxuICAgICAgICByZXN1bHRbMV0gPSBib3R0b21MZWZ0QXk7XHJcbiAgICAgICAgY2xpcFBvaW50QUZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vZGV0ZXJtaW5lIHdoZXRoZXIgY2xpcHBpbmcgcG9pbnQgaXMgdGhlIGNvcm5lciBvZiBub2RlQlxyXG4gICAgaWYgKCgtc2xvcGVCKSA9PSBzbG9wZVByaW1lKVxyXG4gICAge1xyXG4gICAgICBpZiAocDJ4ID4gcDF4KVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzJdID0gYm90dG9tTGVmdEJ4O1xyXG4gICAgICAgIHJlc3VsdFszXSA9IGJvdHRvbUxlZnRCeTtcclxuICAgICAgICBjbGlwUG9pbnRCRm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHJlc3VsdFsyXSA9IHRvcFJpZ2h0Qng7XHJcbiAgICAgICAgcmVzdWx0WzNdID0gdG9wTGVmdEJ5O1xyXG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHNsb3BlQiA9PSBzbG9wZVByaW1lKVxyXG4gICAge1xyXG4gICAgICBpZiAocDJ4ID4gcDF4KVxyXG4gICAgICB7XHJcbiAgICAgICAgcmVzdWx0WzJdID0gdG9wTGVmdEJ4O1xyXG4gICAgICAgIHJlc3VsdFszXSA9IHRvcExlZnRCeTtcclxuICAgICAgICBjbGlwUG9pbnRCRm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgIHJlc3VsdFsyXSA9IGJvdHRvbVJpZ2h0Qng7XHJcbiAgICAgICAgcmVzdWx0WzNdID0gYm90dG9tTGVmdEJ5O1xyXG4gICAgICAgIGNsaXBQb2ludEJGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL2lmIGJvdGggY2xpcHBpbmcgcG9pbnRzIGFyZSBjb3JuZXJzXHJcbiAgICBpZiAoY2xpcFBvaW50QUZvdW5kICYmIGNsaXBQb2ludEJGb3VuZClcclxuICAgIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vZGV0ZXJtaW5lIENhcmRpbmFsIERpcmVjdGlvbiBvZiByZWN0YW5nbGVzXHJcbiAgICBpZiAocDF4ID4gcDJ4KVxyXG4gICAge1xyXG4gICAgICBpZiAocDF5ID4gcDJ5KVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25BID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKHNsb3BlQSwgc2xvcGVQcmltZSwgNCk7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25CID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKHNsb3BlQiwgc2xvcGVQcmltZSwgMik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25BID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUEsIHNsb3BlUHJpbWUsIDMpO1xyXG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQiA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbigtc2xvcGVCLCBzbG9wZVByaW1lLCAxKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICBpZiAocDF5ID4gcDJ5KVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FyZGluYWxEaXJlY3Rpb25BID0gSUdlb21ldHJ5LmdldENhcmRpbmFsRGlyZWN0aW9uKC1zbG9wZUEsIHNsb3BlUHJpbWUsIDEpO1xyXG4gICAgICAgIGNhcmRpbmFsRGlyZWN0aW9uQiA9IElHZW9tZXRyeS5nZXRDYXJkaW5hbERpcmVjdGlvbigtc2xvcGVCLCBzbG9wZVByaW1lLCAzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgIHtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkEgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVBLCBzbG9wZVByaW1lLCAyKTtcclxuICAgICAgICBjYXJkaW5hbERpcmVjdGlvbkIgPSBJR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24oc2xvcGVCLCBzbG9wZVByaW1lLCA0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9jYWxjdWxhdGUgY2xpcHBpbmcgUG9pbnQgaWYgaXQgaXMgbm90IGZvdW5kIGJlZm9yZVxyXG4gICAgaWYgKCFjbGlwUG9pbnRBRm91bmQpXHJcbiAgICB7XHJcbiAgICAgIHN3aXRjaCAoY2FyZGluYWxEaXJlY3Rpb25BKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGVtcFBvaW50QXkgPSB0b3BMZWZ0QXk7XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IHAxeCArICgtaGFsZkhlaWdodEEpIC8gc2xvcGVQcmltZTtcclxuICAgICAgICAgIHJlc3VsdFswXSA9IHRlbXBQb2ludEF4O1xyXG4gICAgICAgICAgcmVzdWx0WzFdID0gdGVtcFBvaW50QXk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeCA9IGJvdHRvbVJpZ2h0QXg7XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeSA9IHAxeSArIGhhbGZXaWR0aEEgKiBzbG9wZVByaW1lO1xyXG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XHJcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRlbXBQb2ludEF5ID0gYm90dG9tTGVmdEF5O1xyXG4gICAgICAgICAgdGVtcFBvaW50QXggPSBwMXggKyBoYWxmSGVpZ2h0QSAvIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMF0gPSB0ZW1wUG9pbnRBeDtcclxuICAgICAgICAgIHJlc3VsdFsxXSA9IHRlbXBQb2ludEF5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgdGVtcFBvaW50QXggPSBib3R0b21MZWZ0QXg7XHJcbiAgICAgICAgICB0ZW1wUG9pbnRBeSA9IHAxeSArICgtaGFsZldpZHRoQSkgKiBzbG9wZVByaW1lO1xyXG4gICAgICAgICAgcmVzdWx0WzBdID0gdGVtcFBvaW50QXg7XHJcbiAgICAgICAgICByZXN1bHRbMV0gPSB0ZW1wUG9pbnRBeTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIWNsaXBQb2ludEJGb3VuZClcclxuICAgIHtcclxuICAgICAgc3dpdGNoIChjYXJkaW5hbERpcmVjdGlvbkIpXHJcbiAgICAgIHtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRCeSA9IHRvcExlZnRCeTtcclxuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gcDJ4ICsgKC1oYWxmSGVpZ2h0QikgLyBzbG9wZVByaW1lO1xyXG4gICAgICAgICAgcmVzdWx0WzJdID0gdGVtcFBvaW50Qng7XHJcbiAgICAgICAgICByZXN1bHRbM10gPSB0ZW1wUG9pbnRCeTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRlbXBQb2ludEJ4ID0gYm90dG9tUmlnaHRCeDtcclxuICAgICAgICAgIHRlbXBQb2ludEJ5ID0gcDJ5ICsgaGFsZldpZHRoQiAqIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcclxuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGVtcFBvaW50QnkgPSBib3R0b21MZWZ0Qnk7XHJcbiAgICAgICAgICB0ZW1wUG9pbnRCeCA9IHAyeCArIGhhbGZIZWlnaHRCIC8gc2xvcGVQcmltZTtcclxuICAgICAgICAgIHJlc3VsdFsyXSA9IHRlbXBQb2ludEJ4O1xyXG4gICAgICAgICAgcmVzdWx0WzNdID0gdGVtcFBvaW50Qnk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICB0ZW1wUG9pbnRCeCA9IGJvdHRvbUxlZnRCeDtcclxuICAgICAgICAgIHRlbXBQb2ludEJ5ID0gcDJ5ICsgKC1oYWxmV2lkdGhCKSAqIHNsb3BlUHJpbWU7XHJcbiAgICAgICAgICByZXN1bHRbMl0gPSB0ZW1wUG9pbnRCeDtcclxuICAgICAgICAgIHJlc3VsdFszXSA9IHRlbXBQb2ludEJ5O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5JR2VvbWV0cnkuZ2V0Q2FyZGluYWxEaXJlY3Rpb24gPSBmdW5jdGlvbiAoc2xvcGUsIHNsb3BlUHJpbWUsIGxpbmUpXHJcbntcclxuICBpZiAoc2xvcGUgPiBzbG9wZVByaW1lKVxyXG4gIHtcclxuICAgIHJldHVybiBsaW5lO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgcmV0dXJuIDEgKyBsaW5lICUgNDtcclxuICB9XHJcbn1cclxuXHJcbklHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAoczEsIHMyLCBmMSwgZjIpXHJcbntcclxuICBpZiAoZjIgPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIElHZW9tZXRyeS5nZXRJbnRlcnNlY3Rpb24yKHMxLCBzMiwgZjEpO1xyXG4gIH1cclxuICB2YXIgeDEgPSBzMS54O1xyXG4gIHZhciB5MSA9IHMxLnk7XHJcbiAgdmFyIHgyID0gczIueDtcclxuICB2YXIgeTIgPSBzMi55O1xyXG4gIHZhciB4MyA9IGYxLng7XHJcbiAgdmFyIHkzID0gZjEueTtcclxuICB2YXIgeDQgPSBmMi54O1xyXG4gIHZhciB5NCA9IGYyLnk7XHJcbiAgdmFyIHgsIHk7IC8vIGludGVyc2VjdGlvbiBwb2ludFxyXG4gIHZhciBhMSwgYTIsIGIxLCBiMiwgYzEsIGMyOyAvLyBjb2VmZmljaWVudHMgb2YgbGluZSBlcW5zLlxyXG4gIHZhciBkZW5vbTtcclxuXHJcbiAgYTEgPSB5MiAtIHkxO1xyXG4gIGIxID0geDEgLSB4MjtcclxuICBjMSA9IHgyICogeTEgLSB4MSAqIHkyOyAgLy8geyBhMSp4ICsgYjEqeSArIGMxID0gMCBpcyBsaW5lIDEgfVxyXG5cclxuICBhMiA9IHk0IC0geTM7XHJcbiAgYjIgPSB4MyAtIHg0O1xyXG4gIGMyID0geDQgKiB5MyAtIHgzICogeTQ7ICAvLyB7IGEyKnggKyBiMip5ICsgYzIgPSAwIGlzIGxpbmUgMiB9XHJcblxyXG4gIGRlbm9tID0gYTEgKiBiMiAtIGEyICogYjE7XHJcblxyXG4gIGlmIChkZW5vbSA9PSAwKVxyXG4gIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgeCA9IChiMSAqIGMyIC0gYjIgKiBjMSkgLyBkZW5vbTtcclxuICB5ID0gKGEyICogYzEgLSBhMSAqIGMyKSAvIGRlbm9tO1xyXG5cclxuICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBTZWN0aW9uOiBDbGFzcyBDb25zdGFudHNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLyoqXHJcbiAqIFNvbWUgdXNlZnVsIHByZS1jYWxjdWxhdGVkIGNvbnN0YW50c1xyXG4gKi9cclxuSUdlb21ldHJ5LkhBTEZfUEkgPSAwLjUgKiBNYXRoLlBJO1xyXG5JR2VvbWV0cnkuT05FX0FORF9IQUxGX1BJID0gMS41ICogTWF0aC5QSTtcclxuSUdlb21ldHJ5LlRXT19QSSA9IDIuMCAqIE1hdGguUEk7XHJcbklHZW9tZXRyeS5USFJFRV9QSSA9IDMuMCAqIE1hdGguUEk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElHZW9tZXRyeTtcclxuIiwiZnVuY3Rpb24gSU1hdGgoKSB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBzaWduIG9mIHRoZSBpbnB1dCB2YWx1ZS5cclxuICovXHJcbklNYXRoLnNpZ24gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAodmFsdWUgPiAwKVxyXG4gIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH1cclxuICBlbHNlIGlmICh2YWx1ZSA8IDApXHJcbiAge1xyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5JTWF0aC5mbG9vciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLmNlaWwodmFsdWUpIDogTWF0aC5mbG9vcih2YWx1ZSk7XHJcbn1cclxuXHJcbklNYXRoLmNlaWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5mbG9vcih2YWx1ZSkgOiBNYXRoLmNlaWwodmFsdWUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IElNYXRoO1xyXG4iLCJmdW5jdGlvbiBJbnRlZ2VyKCkge1xyXG59XHJcblxyXG5JbnRlZ2VyLk1BWF9WQUxVRSA9IDIxNDc0ODM2NDc7XHJcbkludGVnZXIuTUlOX1ZBTFVFID0gLTIxNDc0ODM2NDg7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGVnZXI7XHJcbiIsInZhciBMR3JhcGhPYmplY3QgPSByZXF1aXJlKCcuL0xHcmFwaE9iamVjdCcpO1xyXG52YXIgSUdlb21ldHJ5ID0gcmVxdWlyZSgnLi9JR2VvbWV0cnknKTtcclxudmFyIElNYXRoID0gcmVxdWlyZSgnLi9JTWF0aCcpO1xyXG5cclxuZnVuY3Rpb24gTEVkZ2Uoc291cmNlLCB0YXJnZXQsIHZFZGdlKSB7XHJcbiAgTEdyYXBoT2JqZWN0LmNhbGwodGhpcywgdkVkZ2UpO1xyXG5cclxuICB0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldCA9IGZhbHNlO1xyXG4gIHRoaXMudkdyYXBoT2JqZWN0ID0gdkVkZ2U7XHJcbiAgdGhpcy5iZW5kcG9pbnRzID0gW107XHJcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbn1cclxuXHJcbkxFZGdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoTEdyYXBoT2JqZWN0LnByb3RvdHlwZSk7XHJcblxyXG5mb3IgKHZhciBwcm9wIGluIExHcmFwaE9iamVjdCkge1xyXG4gIExFZGdlW3Byb3BdID0gTEdyYXBoT2JqZWN0W3Byb3BdO1xyXG59XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0U291cmNlID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnNvdXJjZTtcclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS5nZXRUYXJnZXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMudGFyZ2V0O1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmlzSW50ZXJHcmFwaCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5pc0ludGVyR3JhcGg7XHJcbn07XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxlbmd0aDtcclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuaXNPdmVybGFwaW5nU291cmNlQW5kVGFyZ2V0O1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldEJlbmRwb2ludHMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuYmVuZHBvaW50cztcclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS5nZXRMY2EgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubGNhO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldFNvdXJjZUluTGNhID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnNvdXJjZUluTGNhO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldFRhcmdldEluTGNhID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnRhcmdldEluTGNhO1xyXG59O1xyXG5cclxuTEVkZ2UucHJvdG90eXBlLmdldE90aGVyRW5kID0gZnVuY3Rpb24gKG5vZGUpXHJcbntcclxuICBpZiAodGhpcy5zb3VyY2UgPT09IG5vZGUpXHJcbiAge1xyXG4gICAgcmV0dXJuIHRoaXMudGFyZ2V0O1xyXG4gIH1cclxuICBlbHNlIGlmICh0aGlzLnRhcmdldCA9PT0gbm9kZSlcclxuICB7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2U7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICB0aHJvdyBcIk5vZGUgaXMgbm90IGluY2lkZW50IHdpdGggdGhpcyBlZGdlXCI7XHJcbiAgfVxyXG59XHJcblxyXG5MRWRnZS5wcm90b3R5cGUuZ2V0T3RoZXJFbmRJbkdyYXBoID0gZnVuY3Rpb24gKG5vZGUsIGdyYXBoKVxyXG57XHJcbiAgdmFyIG90aGVyRW5kID0gdGhpcy5nZXRPdGhlckVuZChub2RlKTtcclxuICB2YXIgcm9vdCA9IGdyYXBoLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKTtcclxuXHJcbiAgd2hpbGUgKHRydWUpXHJcbiAge1xyXG4gICAgaWYgKG90aGVyRW5kLmdldE93bmVyKCkgPT0gZ3JhcGgpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBvdGhlckVuZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3RoZXJFbmQuZ2V0T3duZXIoKSA9PSByb290KVxyXG4gICAge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBvdGhlckVuZCA9IG90aGVyRW5kLmdldE93bmVyKCkuZ2V0UGFyZW50KCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS51cGRhdGVMZW5ndGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdmFyIGNsaXBQb2ludENvb3JkaW5hdGVzID0gbmV3IEFycmF5KDQpO1xyXG5cclxuICB0aGlzLmlzT3ZlcmxhcGluZ1NvdXJjZUFuZFRhcmdldCA9XHJcbiAgICAgICAgICBJR2VvbWV0cnkuZ2V0SW50ZXJzZWN0aW9uKHRoaXMudGFyZ2V0LmdldFJlY3QoKSxcclxuICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UuZ2V0UmVjdCgpLFxyXG4gICAgICAgICAgICAgICAgICBjbGlwUG9pbnRDb29yZGluYXRlcyk7XHJcblxyXG4gIGlmICghdGhpcy5pc092ZXJsYXBpbmdTb3VyY2VBbmRUYXJnZXQpXHJcbiAge1xyXG4gICAgdGhpcy5sZW5ndGhYID0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbMF0gLSBjbGlwUG9pbnRDb29yZGluYXRlc1syXTtcclxuICAgIHRoaXMubGVuZ3RoWSA9IGNsaXBQb2ludENvb3JkaW5hdGVzWzFdIC0gY2xpcFBvaW50Q29vcmRpbmF0ZXNbM107XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKHRoaXMubGVuZ3RoWCkgPCAxLjApXHJcbiAgICB7XHJcbiAgICAgIHRoaXMubGVuZ3RoWCA9IElNYXRoLnNpZ24odGhpcy5sZW5ndGhYKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sZW5ndGhZKSA8IDEuMClcclxuICAgIHtcclxuICAgICAgdGhpcy5sZW5ndGhZID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aFggKiB0aGlzLmxlbmd0aFggKyB0aGlzLmxlbmd0aFkgKiB0aGlzLmxlbmd0aFkpO1xyXG4gIH1cclxufTtcclxuXHJcbkxFZGdlLnByb3RvdHlwZS51cGRhdGVMZW5ndGhTaW1wbGUgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdGhpcy5sZW5ndGhYID0gdGhpcy50YXJnZXQuZ2V0Q2VudGVyWCgpIC0gdGhpcy5zb3VyY2UuZ2V0Q2VudGVyWCgpO1xyXG4gIHRoaXMubGVuZ3RoWSA9IHRoaXMudGFyZ2V0LmdldENlbnRlclkoKSAtIHRoaXMuc291cmNlLmdldENlbnRlclkoKTtcclxuXHJcbiAgaWYgKE1hdGguYWJzKHRoaXMubGVuZ3RoWCkgPCAxLjApXHJcbiAge1xyXG4gICAgdGhpcy5sZW5ndGhYID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKE1hdGguYWJzKHRoaXMubGVuZ3RoWSkgPCAxLjApXHJcbiAge1xyXG4gICAgdGhpcy5sZW5ndGhZID0gSU1hdGguc2lnbih0aGlzLmxlbmd0aFkpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5sZW5ndGggPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgICB0aGlzLmxlbmd0aFggKiB0aGlzLmxlbmd0aFggKyB0aGlzLmxlbmd0aFkgKiB0aGlzLmxlbmd0aFkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExFZGdlO1xyXG4iLCJ2YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcclxudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcclxudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XHJcbnZhciBMR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9MR3JhcGhNYW5hZ2VyJyk7XHJcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcclxudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcclxudmFyIFJlY3RhbmdsZUQgPSByZXF1aXJlKCcuL1JlY3RhbmdsZUQnKTtcclxudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9Qb2ludCcpO1xyXG5cclxuZnVuY3Rpb24gTEdyYXBoKHBhcmVudCwgb2JqMiwgdkdyYXBoKSB7XHJcbiAgTEdyYXBoT2JqZWN0LmNhbGwodGhpcywgdkdyYXBoKTtcclxuICB0aGlzLmVzdGltYXRlZFNpemUgPSBJbnRlZ2VyLk1JTl9WQUxVRTtcclxuICB0aGlzLm1hcmdpbiA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVBIX01BUkdJTjtcclxuICB0aGlzLmVkZ2VzID0gW107XHJcbiAgdGhpcy5ub2RlcyA9IFtdO1xyXG4gIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuXHJcbiAgaWYgKG9iajIgIT0gbnVsbCAmJiBvYmoyIGluc3RhbmNlb2YgTEdyYXBoTWFuYWdlcikge1xyXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIgPSBvYmoyO1xyXG4gIH1cclxuICBlbHNlIGlmIChvYmoyICE9IG51bGwgJiYgb2JqMiBpbnN0YW5jZW9mIExheW91dCkge1xyXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIgPSBvYmoyLmdyYXBoTWFuYWdlcjtcclxuICB9XHJcbn1cclxuXHJcbkxHcmFwaC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE9iamVjdC5wcm90b3R5cGUpO1xyXG5mb3IgKHZhciBwcm9wIGluIExHcmFwaE9iamVjdCkge1xyXG4gIExHcmFwaFtwcm9wXSA9IExHcmFwaE9iamVjdFtwcm9wXTtcclxufVxyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXROb2RlcyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5ub2RlcztcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuZ2V0RWRnZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZWRnZXM7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldEdyYXBoTWFuYWdlciA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXI7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5wYXJlbnQ7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubGVmdDtcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmlnaHQ7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldFRvcCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy50b3A7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5ib3R0b207XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLmlzQ29ubmVjdGVkID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmlzQ29ubmVjdGVkO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAob2JqMSwgc291cmNlTm9kZSwgdGFyZ2V0Tm9kZSkge1xyXG4gIGlmIChzb3VyY2VOb2RlID09IG51bGwgJiYgdGFyZ2V0Tm9kZSA9PSBudWxsKSB7XHJcbiAgICB2YXIgbmV3Tm9kZSA9IG9iajE7XHJcbiAgICBpZiAodGhpcy5ncmFwaE1hbmFnZXIgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIkdyYXBoIGhhcyBubyBncmFwaCBtZ3IhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5nZXROb2RlcygpLmluZGV4T2YobmV3Tm9kZSkgPiAtMSkge1xyXG4gICAgICB0aHJvdyBcIk5vZGUgYWxyZWFkeSBpbiBncmFwaCFcIjtcclxuICAgIH1cclxuICAgIG5ld05vZGUub3duZXIgPSB0aGlzO1xyXG4gICAgdGhpcy5nZXROb2RlcygpLnB1c2gobmV3Tm9kZSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIG5ld0VkZ2UgPSBvYmoxO1xyXG4gICAgaWYgKCEodGhpcy5nZXROb2RlcygpLmluZGV4T2Yoc291cmNlTm9kZSkgPiAtMSAmJiAodGhpcy5nZXROb2RlcygpLmluZGV4T2YodGFyZ2V0Tm9kZSkpID4gLTEpKSB7XHJcbiAgICAgIHRocm93IFwiU291cmNlIG9yIHRhcmdldCBub3QgaW4gZ3JhcGghXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEoc291cmNlTm9kZS5vd25lciA9PSB0YXJnZXROb2RlLm93bmVyICYmIHNvdXJjZU5vZGUub3duZXIgPT0gdGhpcykpIHtcclxuICAgICAgdGhyb3cgXCJCb3RoIG93bmVycyBtdXN0IGJlIHRoaXMgZ3JhcGghXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNvdXJjZU5vZGUub3duZXIgIT0gdGFyZ2V0Tm9kZS5vd25lcilcclxuICAgIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IHNvdXJjZSBhbmQgdGFyZ2V0XHJcbiAgICBuZXdFZGdlLnNvdXJjZSA9IHNvdXJjZU5vZGU7XHJcbiAgICBuZXdFZGdlLnRhcmdldCA9IHRhcmdldE5vZGU7XHJcblxyXG4gICAgLy8gc2V0IGFzIGludHJhLWdyYXBoIGVkZ2VcclxuICAgIG5ld0VkZ2UuaXNJbnRlckdyYXBoID0gZmFsc2U7XHJcblxyXG4gICAgLy8gYWRkIHRvIGdyYXBoIGVkZ2UgbGlzdFxyXG4gICAgdGhpcy5nZXRFZGdlcygpLnB1c2gobmV3RWRnZSk7XHJcblxyXG4gICAgLy8gYWRkIHRvIGluY2lkZW5jeSBsaXN0c1xyXG4gICAgc291cmNlTm9kZS5lZGdlcy5wdXNoKG5ld0VkZ2UpO1xyXG5cclxuICAgIGlmICh0YXJnZXROb2RlICE9IHNvdXJjZU5vZGUpXHJcbiAgICB7XHJcbiAgICAgIHRhcmdldE5vZGUuZWRnZXMucHVzaChuZXdFZGdlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3RWRnZTtcclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICB2YXIgbm9kZSA9IG9iajtcclxuICBpZiAob2JqIGluc3RhbmNlb2YgTE5vZGUpIHtcclxuICAgIGlmIChub2RlID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJOb2RlIGlzIG51bGwhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoIShub2RlLm93bmVyICE9IG51bGwgJiYgbm9kZS5vd25lciA9PSB0aGlzKSkge1xyXG4gICAgICB0aHJvdyBcIk93bmVyIGdyYXBoIGlzIGludmFsaWQhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ncmFwaE1hbmFnZXIgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIk93bmVyIGdyYXBoIG1hbmFnZXIgaXMgaW52YWxpZCFcIjtcclxuICAgIH1cclxuICAgIC8vIHJlbW92ZSBpbmNpZGVudCBlZGdlcyBmaXJzdCAobWFrZSBhIGNvcHkgdG8gZG8gaXQgc2FmZWx5KVxyXG4gICAgdmFyIGVkZ2VzVG9CZVJlbW92ZWQgPSBub2RlLmVkZ2VzLnNsaWNlKCk7XHJcbiAgICB2YXIgZWRnZTtcclxuICAgIHZhciBzID0gZWRnZXNUb0JlUmVtb3ZlZC5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgZWRnZSA9IGVkZ2VzVG9CZVJlbW92ZWRbaV07XHJcblxyXG4gICAgICBpZiAoZWRnZS5pc0ludGVyR3JhcGgpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmdyYXBoTWFuYWdlci5yZW1vdmUoZWRnZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgZWRnZS5zb3VyY2Uub3duZXIucmVtb3ZlKGVkZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm93IHRoZSBub2RlIGl0c2VsZlxyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5ub2Rlcy5pbmRleE9mKG5vZGUpO1xyXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgIHRocm93IFwiTm9kZSBub3QgaW4gb3duZXIgbm9kZSBsaXN0IVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICB9XHJcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTEVkZ2UpIHtcclxuICAgIHZhciBlZGdlID0gb2JqO1xyXG4gICAgaWYgKGVkZ2UgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIkVkZ2UgaXMgbnVsbCFcIjtcclxuICAgIH1cclxuICAgIGlmICghKGVkZ2Uuc291cmNlICE9IG51bGwgJiYgZWRnZS50YXJnZXQgIT0gbnVsbCkpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBpcyBudWxsIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCEoZWRnZS5zb3VyY2Uub3duZXIgIT0gbnVsbCAmJiBlZGdlLnRhcmdldC5vd25lciAhPSBudWxsICYmXHJcbiAgICAgICAgICAgIGVkZ2Uuc291cmNlLm93bmVyID09IHRoaXMgJiYgZWRnZS50YXJnZXQub3duZXIgPT0gdGhpcykpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBvd25lciBpcyBpbnZhbGlkIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzb3VyY2VJbmRleCA9IGVkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YoZWRnZSk7XHJcbiAgICB2YXIgdGFyZ2V0SW5kZXggPSBlZGdlLnRhcmdldC5lZGdlcy5pbmRleE9mKGVkZ2UpO1xyXG4gICAgaWYgKCEoc291cmNlSW5kZXggPiAtMSAmJiB0YXJnZXRJbmRleCA+IC0xKSkge1xyXG4gICAgICB0aHJvdyBcIlNvdXJjZSBhbmQvb3IgdGFyZ2V0IGRvZXNuJ3Qga25vdyB0aGlzIGVkZ2UhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZWRnZS5zb3VyY2UuZWRnZXMuc3BsaWNlKHNvdXJjZUluZGV4LCAxKTtcclxuXHJcbiAgICBpZiAoZWRnZS50YXJnZXQgIT0gZWRnZS5zb3VyY2UpXHJcbiAgICB7XHJcbiAgICAgIGVkZ2UudGFyZ2V0LmVkZ2VzLnNwbGljZSh0YXJnZXRJbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluZGV4ID0gZWRnZS5zb3VyY2Uub3duZXIuZ2V0RWRnZXMoKS5pbmRleE9mKGVkZ2UpO1xyXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgIHRocm93IFwiTm90IGluIG93bmVyJ3MgZWRnZSBsaXN0IVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGVkZ2Uuc291cmNlLm93bmVyLmdldEVkZ2VzKCkuc3BsaWNlKGluZGV4LCAxKTtcclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLnVwZGF0ZUxlZnRUb3AgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBsZWZ0ID0gSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIG5vZGVUb3A7XHJcbiAgdmFyIG5vZGVMZWZ0O1xyXG5cclxuICB2YXIgbm9kZXMgPSB0aGlzLmdldE5vZGVzKCk7XHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgbm9kZVRvcCA9IE1hdGguZmxvb3IobE5vZGUuZ2V0VG9wKCkpO1xyXG4gICAgbm9kZUxlZnQgPSBNYXRoLmZsb29yKGxOb2RlLmdldExlZnQoKSk7XHJcblxyXG4gICAgaWYgKHRvcCA+IG5vZGVUb3ApXHJcbiAgICB7XHJcbiAgICAgIHRvcCA9IG5vZGVUb3A7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxlZnQgPiBub2RlTGVmdClcclxuICAgIHtcclxuICAgICAgbGVmdCA9IG5vZGVMZWZ0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRG8gd2UgaGF2ZSBhbnkgbm9kZXMgaW4gdGhpcyBncmFwaD9cclxuICBpZiAodG9wID09IEludGVnZXIuTUFYX1ZBTFVFKVxyXG4gIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5sZWZ0ID0gbGVmdCAtIHRoaXMubWFyZ2luO1xyXG4gIHRoaXMudG9wID0gdG9wIC0gdGhpcy5tYXJnaW47XHJcblxyXG4gIC8vIEFwcGx5IHRoZSBtYXJnaW5zIGFuZCByZXR1cm4gdGhlIHJlc3VsdFxyXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy5sZWZ0LCB0aGlzLnRvcCk7XHJcbn07XHJcblxyXG5MR3JhcGgucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uIChyZWN1cnNpdmUpXHJcbntcclxuICAvLyBjYWxjdWxhdGUgYm91bmRzXHJcbiAgdmFyIGxlZnQgPSBJbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgcmlnaHQgPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIHRvcCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciBib3R0b20gPSAtSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIG5vZGVMZWZ0O1xyXG4gIHZhciBub2RlUmlnaHQ7XHJcbiAgdmFyIG5vZGVUb3A7XHJcbiAgdmFyIG5vZGVCb3R0b207XHJcblxyXG4gIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXHJcbiAge1xyXG4gICAgdmFyIGxOb2RlID0gbm9kZXNbaV07XHJcblxyXG4gICAgaWYgKHJlY3Vyc2l2ZSAmJiBsTm9kZS5jaGlsZCAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICBsTm9kZS51cGRhdGVCb3VuZHMoKTtcclxuICAgIH1cclxuICAgIG5vZGVMZWZ0ID0gTWF0aC5mbG9vcihsTm9kZS5nZXRMZWZ0KCkpO1xyXG4gICAgbm9kZVJpZ2h0ID0gTWF0aC5mbG9vcihsTm9kZS5nZXRSaWdodCgpKTtcclxuICAgIG5vZGVUb3AgPSBNYXRoLmZsb29yKGxOb2RlLmdldFRvcCgpKTtcclxuICAgIG5vZGVCb3R0b20gPSBNYXRoLmZsb29yKGxOb2RlLmdldEJvdHRvbSgpKTtcclxuXHJcbiAgICBpZiAobGVmdCA+IG5vZGVMZWZ0KVxyXG4gICAge1xyXG4gICAgICBsZWZ0ID0gbm9kZUxlZnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJpZ2h0IDwgbm9kZVJpZ2h0KVxyXG4gICAge1xyXG4gICAgICByaWdodCA9IG5vZGVSaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodG9wID4gbm9kZVRvcClcclxuICAgIHtcclxuICAgICAgdG9wID0gbm9kZVRvcDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYm90dG9tIDwgbm9kZUJvdHRvbSlcclxuICAgIHtcclxuICAgICAgYm90dG9tID0gbm9kZUJvdHRvbTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBib3VuZGluZ1JlY3QgPSBuZXcgUmVjdGFuZ2xlRChsZWZ0LCB0b3AsIHJpZ2h0IC0gbGVmdCwgYm90dG9tIC0gdG9wKTtcclxuICBpZiAobGVmdCA9PSBJbnRlZ2VyLk1BWF9WQUxVRSlcclxuICB7XHJcbiAgICB0aGlzLmxlZnQgPSBNYXRoLmZsb29yKHRoaXMucGFyZW50LmdldExlZnQoKSk7XHJcbiAgICB0aGlzLnJpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLnBhcmVudC5nZXRSaWdodCgpKTtcclxuICAgIHRoaXMudG9wID0gTWF0aC5mbG9vcih0aGlzLnBhcmVudC5nZXRUb3AoKSk7XHJcbiAgICB0aGlzLmJvdHRvbSA9IE1hdGguZmxvb3IodGhpcy5wYXJlbnQuZ2V0Qm90dG9tKCkpO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5sZWZ0ID0gYm91bmRpbmdSZWN0LnggLSB0aGlzLm1hcmdpbjtcclxuICB0aGlzLnJpZ2h0ID0gYm91bmRpbmdSZWN0LnggKyBib3VuZGluZ1JlY3Qud2lkdGggKyB0aGlzLm1hcmdpbjtcclxuICB0aGlzLnRvcCA9IGJvdW5kaW5nUmVjdC55IC0gdGhpcy5tYXJnaW47XHJcbiAgdGhpcy5ib3R0b20gPSBib3VuZGluZ1JlY3QueSArIGJvdW5kaW5nUmVjdC5oZWlnaHQgKyB0aGlzLm1hcmdpbjtcclxufTtcclxuXHJcbkxHcmFwaC5jYWxjdWxhdGVCb3VuZHMgPSBmdW5jdGlvbiAobm9kZXMpXHJcbntcclxuICB2YXIgbGVmdCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHZhciByaWdodCA9IC1JbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgdG9wID0gSW50ZWdlci5NQVhfVkFMVUU7XHJcbiAgdmFyIGJvdHRvbSA9IC1JbnRlZ2VyLk1BWF9WQUxVRTtcclxuICB2YXIgbm9kZUxlZnQ7XHJcbiAgdmFyIG5vZGVSaWdodDtcclxuICB2YXIgbm9kZVRvcDtcclxuICB2YXIgbm9kZUJvdHRvbTtcclxuXHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgbm9kZUxlZnQgPSBNYXRoLmZsb29yKGxOb2RlLmdldExlZnQoKSk7XHJcbiAgICBub2RlUmlnaHQgPSBNYXRoLmZsb29yKGxOb2RlLmdldFJpZ2h0KCkpO1xyXG4gICAgbm9kZVRvcCA9IE1hdGguZmxvb3IobE5vZGUuZ2V0VG9wKCkpO1xyXG4gICAgbm9kZUJvdHRvbSA9IE1hdGguZmxvb3IobE5vZGUuZ2V0Qm90dG9tKCkpO1xyXG5cclxuICAgIGlmIChsZWZ0ID4gbm9kZUxlZnQpXHJcbiAgICB7XHJcbiAgICAgIGxlZnQgPSBub2RlTGVmdDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmlnaHQgPCBub2RlUmlnaHQpXHJcbiAgICB7XHJcbiAgICAgIHJpZ2h0ID0gbm9kZVJpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0b3AgPiBub2RlVG9wKVxyXG4gICAge1xyXG4gICAgICB0b3AgPSBub2RlVG9wO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChib3R0b20gPCBub2RlQm90dG9tKVxyXG4gICAge1xyXG4gICAgICBib3R0b20gPSBub2RlQm90dG9tO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kaW5nUmVjdCA9IG5ldyBSZWN0YW5nbGVEKGxlZnQsIHRvcCwgcmlnaHQgLSBsZWZ0LCBib3R0b20gLSB0b3ApO1xyXG5cclxuICByZXR1cm4gYm91bmRpbmdSZWN0O1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS5nZXRJbmNsdXNpb25UcmVlRGVwdGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgaWYgKHRoaXMgPT0gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpKVxyXG4gIHtcclxuICAgIHJldHVybiAxO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldEluY2x1c2lvblRyZWVEZXB0aCgpO1xyXG4gIH1cclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuZ2V0RXN0aW1hdGVkU2l6ZSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5lc3RpbWF0ZWRTaXplID09IEludGVnZXIuTUlOX1ZBTFVFKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZTtcclxufTtcclxuXHJcbkxHcmFwaC5wcm90b3R5cGUuY2FsY0VzdGltYXRlZFNpemUgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdmFyIHNpemUgPSAwO1xyXG4gIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIHZhciBsTm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgc2l6ZSArPSBsTm9kZS5jYWxjRXN0aW1hdGVkU2l6ZSgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNpemUgPT0gMClcclxuICB7XHJcbiAgICB0aGlzLmVzdGltYXRlZFNpemUgPSBMYXlvdXRDb25zdGFudHMuRU1QVFlfQ09NUE9VTkRfTk9ERV9TSVpFO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgdGhpcy5lc3RpbWF0ZWRTaXplID0gTWF0aC5mbG9vcihzaXplIC8gTWF0aC5zcXJ0KHRoaXMubm9kZXMubGVuZ3RoKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmVzdGltYXRlZFNpemUpO1xyXG59O1xyXG5cclxuTEdyYXBoLnByb3RvdHlwZS51cGRhdGVDb25uZWN0ZWQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgaWYgKHRoaXMubm9kZXMubGVuZ3RoID09IDApXHJcbiAge1xyXG4gICAgdGhpcy5pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgdG9CZVZpc2l0ZWQgPSBbXTtcclxuICB2YXIgdmlzaXRlZCA9IG5ldyBIYXNoU2V0KCk7XHJcbiAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5ub2Rlc1swXTtcclxuICB2YXIgbmVpZ2hib3JFZGdlcztcclxuICB2YXIgY3VycmVudE5laWdoYm9yO1xyXG4gIHRvQmVWaXNpdGVkID0gdG9CZVZpc2l0ZWQuY29uY2F0KGN1cnJlbnROb2RlLndpdGhDaGlsZHJlbigpKTtcclxuXHJcbiAgd2hpbGUgKHRvQmVWaXNpdGVkLmxlbmd0aCA+IDApXHJcbiAge1xyXG4gICAgY3VycmVudE5vZGUgPSB0b0JlVmlzaXRlZC5zaGlmdCgpO1xyXG4gICAgdmlzaXRlZC5hZGQoY3VycmVudE5vZGUpO1xyXG5cclxuICAgIC8vIFRyYXZlcnNlIGFsbCBuZWlnaGJvcnMgb2YgdGhpcyBub2RlXHJcbiAgICBuZWlnaGJvckVkZ2VzID0gY3VycmVudE5vZGUuZ2V0RWRnZXMoKTtcclxuICAgIHZhciBzID0gbmVpZ2hib3JFZGdlcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgdmFyIG5laWdoYm9yRWRnZSA9IG5laWdoYm9yRWRnZXNbaV07XHJcbiAgICAgIGN1cnJlbnROZWlnaGJvciA9XHJcbiAgICAgICAgICAgICAgbmVpZ2hib3JFZGdlLmdldE90aGVyRW5kSW5HcmFwaChjdXJyZW50Tm9kZSwgdGhpcyk7XHJcblxyXG4gICAgICAvLyBBZGQgdW52aXNpdGVkIG5laWdoYm9ycyB0byB0aGUgbGlzdCB0byB2aXNpdFxyXG4gICAgICBpZiAoY3VycmVudE5laWdoYm9yICE9IG51bGwgJiZcclxuICAgICAgICAgICAgICAhdmlzaXRlZC5jb250YWlucyhjdXJyZW50TmVpZ2hib3IpKVxyXG4gICAgICB7XHJcbiAgICAgICAgdG9CZVZpc2l0ZWQgPSB0b0JlVmlzaXRlZC5jb25jYXQoY3VycmVudE5laWdoYm9yLndpdGhDaGlsZHJlbigpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmlzaXRlZC5zaXplKCkgPj0gdGhpcy5ub2Rlcy5sZW5ndGgpXHJcbiAge1xyXG4gICAgdmFyIG5vT2ZWaXNpdGVkSW5UaGlzR3JhcGggPSAwO1xyXG5cclxuICAgIHZhciBzID0gdmlzaXRlZC5zaXplKCk7XHJcbiAgICBmb3IgKHZhciB2aXNpdGVkSWQgaW4gdmlzaXRlZC5zZXQpXHJcbiAgICB7XHJcbiAgICAgIHZhciB2aXNpdGVkTm9kZSA9IHZpc2l0ZWQuc2V0W3Zpc2l0ZWRJZF07XHJcbiAgICAgIGlmICh2aXNpdGVkTm9kZS5vd25lciA9PSB0aGlzKVxyXG4gICAgICB7XHJcbiAgICAgICAgbm9PZlZpc2l0ZWRJblRoaXNHcmFwaCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vT2ZWaXNpdGVkSW5UaGlzR3JhcGggPT0gdGhpcy5ub2Rlcy5sZW5ndGgpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTEdyYXBoO1xyXG4iLCJmdW5jdGlvbiBMR3JhcGhNYW5hZ2VyKGxheW91dCkge1xyXG4gIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xyXG5cclxuICB0aGlzLmdyYXBocyA9IFtdO1xyXG4gIHRoaXMuZWRnZXMgPSBbXTtcclxufVxyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuYWRkUm9vdCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgbmdyYXBoID0gdGhpcy5sYXlvdXQubmV3R3JhcGgoKTtcclxuICB2YXIgbm5vZGUgPSB0aGlzLmxheW91dC5uZXdOb2RlKG51bGwpO1xyXG4gIHZhciByb290ID0gdGhpcy5hZGQobmdyYXBoLCBubm9kZSk7XHJcbiAgdGhpcy5zZXRSb290R3JhcGgocm9vdCk7XHJcbiAgcmV0dXJuIHRoaXMucm9vdEdyYXBoO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKG5ld0dyYXBoLCBwYXJlbnROb2RlLCBuZXdFZGdlLCBzb3VyY2VOb2RlLCB0YXJnZXROb2RlKVxyXG57XHJcbiAgLy90aGVyZSBhcmUganVzdCAyIHBhcmFtZXRlcnMgYXJlIHBhc3NlZCB0aGVuIGl0IGFkZHMgYW4gTEdyYXBoIGVsc2UgaXQgYWRkcyBhbiBMRWRnZVxyXG4gIGlmIChuZXdFZGdlID09IG51bGwgJiYgc291cmNlTm9kZSA9PSBudWxsICYmIHRhcmdldE5vZGUgPT0gbnVsbCkge1xyXG4gICAgaWYgKG5ld0dyYXBoID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgXCJHcmFwaCBpcyBudWxsIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmVudE5vZGUgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIlBhcmVudCBub2RlIGlzIG51bGwhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ncmFwaHMuaW5kZXhPZihuZXdHcmFwaCkgPiAtMSkge1xyXG4gICAgICB0aHJvdyBcIkdyYXBoIGFscmVhZHkgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncmFwaHMucHVzaChuZXdHcmFwaCk7XHJcblxyXG4gICAgaWYgKG5ld0dyYXBoLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgIHRocm93IFwiQWxyZWFkeSBoYXMgYSBwYXJlbnQhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyZW50Tm9kZS5jaGlsZCAhPSBudWxsKSB7XHJcbiAgICAgIHRocm93ICBcIkFscmVhZHkgaGFzIGEgY2hpbGQhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3R3JhcGgucGFyZW50ID0gcGFyZW50Tm9kZTtcclxuICAgIHBhcmVudE5vZGUuY2hpbGQgPSBuZXdHcmFwaDtcclxuXHJcbiAgICByZXR1cm4gbmV3R3JhcGg7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgLy9jaGFuZ2UgdGhlIG9yZGVyIG9mIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICB0YXJnZXROb2RlID0gbmV3RWRnZTtcclxuICAgIHNvdXJjZU5vZGUgPSBwYXJlbnROb2RlO1xyXG4gICAgbmV3RWRnZSA9IG5ld0dyYXBoO1xyXG4gICAgdmFyIHNvdXJjZUdyYXBoID0gc291cmNlTm9kZS5nZXRPd25lcigpO1xyXG4gICAgdmFyIHRhcmdldEdyYXBoID0gdGFyZ2V0Tm9kZS5nZXRPd25lcigpO1xyXG5cclxuICAgIGlmICghKHNvdXJjZUdyYXBoICE9IG51bGwgJiYgc291cmNlR3JhcGguZ2V0R3JhcGhNYW5hZ2VyKCkgPT0gdGhpcykpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2Ugbm90IGluIHRoaXMgZ3JhcGggbWdyIVwiO1xyXG4gICAgfVxyXG4gICAgaWYgKCEodGFyZ2V0R3JhcGggIT0gbnVsbCAmJiB0YXJnZXRHcmFwaC5nZXRHcmFwaE1hbmFnZXIoKSA9PSB0aGlzKSkge1xyXG4gICAgICB0aHJvdyBcIlRhcmdldCBub3QgaW4gdGhpcyBncmFwaCBtZ3IhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNvdXJjZUdyYXBoID09IHRhcmdldEdyYXBoKVxyXG4gICAge1xyXG4gICAgICBuZXdFZGdlLmlzSW50ZXJHcmFwaCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gc291cmNlR3JhcGguYWRkKG5ld0VkZ2UsIHNvdXJjZU5vZGUsIHRhcmdldE5vZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICBuZXdFZGdlLmlzSW50ZXJHcmFwaCA9IHRydWU7XHJcblxyXG4gICAgICAvLyBzZXQgc291cmNlIGFuZCB0YXJnZXRcclxuICAgICAgbmV3RWRnZS5zb3VyY2UgPSBzb3VyY2VOb2RlO1xyXG4gICAgICBuZXdFZGdlLnRhcmdldCA9IHRhcmdldE5vZGU7XHJcblxyXG4gICAgICAvLyBhZGQgZWRnZSB0byBpbnRlci1ncmFwaCBlZGdlIGxpc3RcclxuICAgICAgaWYgKHRoaXMuZWRnZXMuaW5kZXhPZihuZXdFZGdlKSA+IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgXCJFZGdlIGFscmVhZHkgaW4gaW50ZXItZ3JhcGggZWRnZSBsaXN0IVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmVkZ2VzLnB1c2gobmV3RWRnZSk7XHJcblxyXG4gICAgICAvLyBhZGQgZWRnZSB0byBzb3VyY2UgYW5kIHRhcmdldCBpbmNpZGVuY3kgbGlzdHNcclxuICAgICAgaWYgKCEobmV3RWRnZS5zb3VyY2UgIT0gbnVsbCAmJiBuZXdFZGdlLnRhcmdldCAhPSBudWxsKSkge1xyXG4gICAgICAgIHRocm93IFwiRWRnZSBzb3VyY2UgYW5kL29yIHRhcmdldCBpcyBudWxsIVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIShuZXdFZGdlLnNvdXJjZS5lZGdlcy5pbmRleE9mKG5ld0VkZ2UpID09IC0xICYmIG5ld0VkZ2UudGFyZ2V0LmVkZ2VzLmluZGV4T2YobmV3RWRnZSkgPT0gLTEpKSB7XHJcbiAgICAgICAgdGhyb3cgXCJFZGdlIGFscmVhZHkgaW4gc291cmNlIGFuZC9vciB0YXJnZXQgaW5jaWRlbmN5IGxpc3QhXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG5ld0VkZ2Uuc291cmNlLmVkZ2VzLnB1c2gobmV3RWRnZSk7XHJcbiAgICAgIG5ld0VkZ2UudGFyZ2V0LmVkZ2VzLnB1c2gobmV3RWRnZSk7XHJcblxyXG4gICAgICByZXR1cm4gbmV3RWRnZTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAobE9iaikge1xyXG4gIGlmIChsT2JqIGluc3RhbmNlb2YgTEdyYXBoKSB7XHJcbiAgICB2YXIgZ3JhcGggPSBsT2JqO1xyXG4gICAgaWYgKGdyYXBoLmdldEdyYXBoTWFuYWdlcigpICE9IHRoaXMpIHtcclxuICAgICAgdGhyb3cgXCJHcmFwaCBub3QgaW4gdGhpcyBncmFwaCBtZ3JcIjtcclxuICAgIH1cclxuICAgIGlmICghKGdyYXBoID09IHRoaXMucm9vdEdyYXBoIHx8IChncmFwaC5wYXJlbnQgIT0gbnVsbCAmJiBncmFwaC5wYXJlbnQuZ3JhcGhNYW5hZ2VyID09IHRoaXMpKSkge1xyXG4gICAgICB0aHJvdyBcIkludmFsaWQgcGFyZW50IG5vZGUhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZmlyc3QgdGhlIGVkZ2VzIChtYWtlIGEgY29weSB0byBkbyBpdCBzYWZlbHkpXHJcbiAgICB2YXIgZWRnZXNUb0JlUmVtb3ZlZCA9IFtdO1xyXG5cclxuICAgIGVkZ2VzVG9CZVJlbW92ZWQgPSBlZGdlc1RvQmVSZW1vdmVkLmNvbmNhdChncmFwaC5nZXRFZGdlcygpKTtcclxuXHJcbiAgICB2YXIgZWRnZTtcclxuICAgIHZhciBzID0gZWRnZXNUb0JlUmVtb3ZlZC5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgZWRnZSA9IGVkZ2VzVG9CZVJlbW92ZWRbaV07XHJcbiAgICAgIGdyYXBoLnJlbW92ZShlZGdlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGVuIHRoZSBub2RlcyAobWFrZSBhIGNvcHkgdG8gZG8gaXQgc2FmZWx5KVxyXG4gICAgdmFyIG5vZGVzVG9CZVJlbW92ZWQgPSBbXTtcclxuXHJcbiAgICBub2Rlc1RvQmVSZW1vdmVkID0gbm9kZXNUb0JlUmVtb3ZlZC5jb25jYXQoZ3JhcGguZ2V0Tm9kZXMoKSk7XHJcblxyXG4gICAgdmFyIG5vZGU7XHJcbiAgICBzID0gbm9kZXNUb0JlUmVtb3ZlZC5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICAgIHtcclxuICAgICAgbm9kZSA9IG5vZGVzVG9CZVJlbW92ZWRbaV07XHJcbiAgICAgIGdyYXBoLnJlbW92ZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVjayBpZiBncmFwaCBpcyB0aGUgcm9vdFxyXG4gICAgaWYgKGdyYXBoID09IHRoaXMucm9vdEdyYXBoKVxyXG4gICAge1xyXG4gICAgICB0aGlzLnNldFJvb3RHcmFwaChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBub3cgcmVtb3ZlIHRoZSBncmFwaCBpdHNlbGZcclxuICAgIHZhciBpbmRleCA9IHRoaXMuZ3JhcGhzLmluZGV4T2YoZ3JhcGgpO1xyXG4gICAgdGhpcy5ncmFwaHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAvLyBhbHNvIHJlc2V0IHRoZSBwYXJlbnQgb2YgdGhlIGdyYXBoXHJcbiAgICBncmFwaC5wYXJlbnQgPSBudWxsO1xyXG4gIH1cclxuICBlbHNlIGlmIChsT2JqIGluc3RhbmNlb2YgTEVkZ2UpIHtcclxuICAgIGVkZ2UgPSBsT2JqO1xyXG4gICAgaWYgKGVkZ2UgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBcIkVkZ2UgaXMgbnVsbCFcIjtcclxuICAgIH1cclxuICAgIGlmICghZWRnZS5pc0ludGVyR3JhcGgpIHtcclxuICAgICAgdGhyb3cgXCJOb3QgYW4gaW50ZXItZ3JhcGggZWRnZSFcIjtcclxuICAgIH1cclxuICAgIGlmICghKGVkZ2Uuc291cmNlICE9IG51bGwgJiYgZWRnZS50YXJnZXQgIT0gbnVsbCkpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBpcyBudWxsIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSBlZGdlIGZyb20gc291cmNlIGFuZCB0YXJnZXQgbm9kZXMnIGluY2lkZW5jeSBsaXN0c1xyXG5cclxuICAgIGlmICghKGVkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YoZWRnZSkgIT0gLTEgJiYgZWRnZS50YXJnZXQuZWRnZXMuaW5kZXhPZihlZGdlKSAhPSAtMSkpIHtcclxuICAgICAgdGhyb3cgXCJTb3VyY2UgYW5kL29yIHRhcmdldCBkb2Vzbid0IGtub3cgdGhpcyBlZGdlIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbmRleCA9IGVkZ2Uuc291cmNlLmVkZ2VzLmluZGV4T2YoZWRnZSk7XHJcbiAgICBlZGdlLnNvdXJjZS5lZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgaW5kZXggPSBlZGdlLnRhcmdldC5lZGdlcy5pbmRleE9mKGVkZ2UpO1xyXG4gICAgZWRnZS50YXJnZXQuZWRnZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICAvLyByZW1vdmUgZWRnZSBmcm9tIG93bmVyIGdyYXBoIG1hbmFnZXIncyBpbnRlci1ncmFwaCBlZGdlIGxpc3RcclxuXHJcbiAgICBpZiAoIShlZGdlLnNvdXJjZS5vd25lciAhPSBudWxsICYmIGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpICE9IG51bGwpKSB7XHJcbiAgICAgIHRocm93IFwiRWRnZSBvd25lciBncmFwaCBvciBvd25lciBncmFwaCBtYW5hZ2VyIGlzIG51bGwhXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoZWRnZS5zb3VyY2Uub3duZXIuZ2V0R3JhcGhNYW5hZ2VyKCkuZWRnZXMuaW5kZXhPZihlZGdlKSA9PSAtMSkge1xyXG4gICAgICB0aHJvdyBcIk5vdCBpbiBvd25lciBncmFwaCBtYW5hZ2VyJ3MgZWRnZSBsaXN0IVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbmRleCA9IGVkZ2Uuc291cmNlLm93bmVyLmdldEdyYXBoTWFuYWdlcigpLmVkZ2VzLmluZGV4T2YoZWRnZSk7XHJcbiAgICBlZGdlLnNvdXJjZS5vd25lci5nZXRHcmFwaE1hbmFnZXIoKS5lZGdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gIH1cclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZUJvdW5kcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB0aGlzLnJvb3RHcmFwaC51cGRhdGVCb3VuZHModHJ1ZSk7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRHcmFwaHMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ3JhcGhzO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgaWYgKHRoaXMuYWxsTm9kZXMgPT0gbnVsbClcclxuICB7XHJcbiAgICB2YXIgbm9kZUxpc3QgPSBbXTtcclxuICAgIHZhciBncmFwaHMgPSB0aGlzLmdldEdyYXBocygpO1xyXG4gICAgdmFyIHMgPSBncmFwaHMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIG5vZGVMaXN0ID0gbm9kZUxpc3QuY29uY2F0KGdyYXBoc1tpXS5nZXROb2RlcygpKTtcclxuICAgIH1cclxuICAgIHRoaXMuYWxsTm9kZXMgPSBub2RlTGlzdDtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuYWxsTm9kZXM7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5yZXNldEFsbE5vZGVzID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHRoaXMuYWxsTm9kZXMgPSBudWxsO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUucmVzZXRBbGxFZGdlcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB0aGlzLmFsbEVkZ2VzID0gbnVsbDtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnJlc2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdGhpcy5hbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IG51bGw7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRBbGxFZGdlcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5hbGxFZGdlcyA9PSBudWxsKVxyXG4gIHtcclxuICAgIHZhciBlZGdlTGlzdCA9IFtdO1xyXG4gICAgdmFyIGdyYXBocyA9IHRoaXMuZ2V0R3JhcGhzKCk7XHJcbiAgICB2YXIgcyA9IGdyYXBocy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyYXBocy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgZWRnZUxpc3QgPSBlZGdlTGlzdC5jb25jYXQoZ3JhcGhzW2ldLmdldEVkZ2VzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkZ2VMaXN0ID0gZWRnZUxpc3QuY29uY2F0KHRoaXMuZWRnZXMpO1xyXG5cclxuICAgIHRoaXMuYWxsRWRnZXMgPSBlZGdlTGlzdDtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuYWxsRWRnZXM7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5hbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbjtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnNldEFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gZnVuY3Rpb24gKG5vZGVMaXN0KVxyXG57XHJcbiAgaWYgKHRoaXMuYWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24gIT0gbnVsbCkge1xyXG4gICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgfVxyXG5cclxuICB0aGlzLmFsbE5vZGVzVG9BcHBseUdyYXZpdGF0aW9uID0gbm9kZUxpc3Q7XHJcbn07XHJcblxyXG5MR3JhcGhNYW5hZ2VyLnByb3RvdHlwZS5nZXRSb290ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJvb3RHcmFwaDtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLnNldFJvb3RHcmFwaCA9IGZ1bmN0aW9uIChncmFwaClcclxue1xyXG4gIGlmIChncmFwaC5nZXRHcmFwaE1hbmFnZXIoKSAhPSB0aGlzKSB7XHJcbiAgICB0aHJvdyBcIlJvb3Qgbm90IGluIHRoaXMgZ3JhcGggbWdyIVwiO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5yb290R3JhcGggPSBncmFwaDtcclxuICAvLyByb290IGdyYXBoIG11c3QgaGF2ZSBhIHJvb3Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggaXQgZm9yIGNvbnZlbmllbmNlXHJcbiAgaWYgKGdyYXBoLnBhcmVudCA9PSBudWxsKVxyXG4gIHtcclxuICAgIGdyYXBoLnBhcmVudCA9IHRoaXMubGF5b3V0Lm5ld05vZGUoXCJSb290IG5vZGVcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuZ2V0TGF5b3V0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxheW91dDtcclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmlzT25lQW5jZXN0b3JPZk90aGVyID0gZnVuY3Rpb24gKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSlcclxue1xyXG4gIGlmICghKGZpcnN0Tm9kZSAhPSBudWxsICYmIHNlY29uZE5vZGUgIT0gbnVsbCkpIHtcclxuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xyXG4gIH1cclxuXHJcbiAgaWYgKGZpcnN0Tm9kZSA9PSBzZWNvbmROb2RlKVxyXG4gIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICAvLyBJcyBzZWNvbmQgbm9kZSBhbiBhbmNlc3RvciBvZiB0aGUgZmlyc3Qgb25lP1xyXG4gIHZhciBvd25lckdyYXBoID0gZmlyc3ROb2RlLmdldE93bmVyKCk7XHJcbiAgdmFyIHBhcmVudE5vZGU7XHJcblxyXG4gIGRvXHJcbiAge1xyXG4gICAgcGFyZW50Tm9kZSA9IG93bmVyR3JhcGguZ2V0UGFyZW50KCk7XHJcblxyXG4gICAgaWYgKHBhcmVudE5vZGUgPT0gbnVsbClcclxuICAgIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBhcmVudE5vZGUgPT0gc2Vjb25kTm9kZSlcclxuICAgIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb3duZXJHcmFwaCA9IHBhcmVudE5vZGUuZ2V0T3duZXIoKTtcclxuICAgIGlmIChvd25lckdyYXBoID09IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0gd2hpbGUgKHRydWUpO1xyXG4gIC8vIElzIGZpcnN0IG5vZGUgYW4gYW5jZXN0b3Igb2YgdGhlIHNlY29uZCBvbmU/XHJcbiAgb3duZXJHcmFwaCA9IHNlY29uZE5vZGUuZ2V0T3duZXIoKTtcclxuXHJcbiAgZG9cclxuICB7XHJcbiAgICBwYXJlbnROb2RlID0gb3duZXJHcmFwaC5nZXRQYXJlbnQoKTtcclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSA9PSBmaXJzdE5vZGUpXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG93bmVyR3JhcGggPSBwYXJlbnROb2RlLmdldE93bmVyKCk7XHJcbiAgICBpZiAob3duZXJHcmFwaCA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9IHdoaWxlICh0cnVlKTtcclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuY2FsY0xvd2VzdENvbW1vbkFuY2VzdG9ycyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgZWRnZTtcclxuICB2YXIgc291cmNlTm9kZTtcclxuICB2YXIgdGFyZ2V0Tm9kZTtcclxuICB2YXIgc291cmNlQW5jZXN0b3JHcmFwaDtcclxuICB2YXIgdGFyZ2V0QW5jZXN0b3JHcmFwaDtcclxuXHJcbiAgdmFyIGVkZ2VzID0gdGhpcy5nZXRBbGxFZGdlcygpO1xyXG4gIHZhciBzID0gZWRnZXMubGVuZ3RoO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgczsgaSsrKVxyXG4gIHtcclxuICAgIGVkZ2UgPSBlZGdlc1tpXTtcclxuXHJcbiAgICBzb3VyY2VOb2RlID0gZWRnZS5zb3VyY2U7XHJcbiAgICB0YXJnZXROb2RlID0gZWRnZS50YXJnZXQ7XHJcbiAgICBlZGdlLmxjYSA9IG51bGw7XHJcbiAgICBlZGdlLnNvdXJjZUluTGNhID0gc291cmNlTm9kZTtcclxuICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXROb2RlO1xyXG5cclxuICAgIGlmIChzb3VyY2VOb2RlID09IHRhcmdldE5vZGUpXHJcbiAgICB7XHJcbiAgICAgIGVkZ2UubGNhID0gc291cmNlTm9kZS5nZXRPd25lcigpO1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBzb3VyY2VBbmNlc3RvckdyYXBoID0gc291cmNlTm9kZS5nZXRPd25lcigpO1xyXG5cclxuICAgIHdoaWxlIChlZGdlLmxjYSA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICB0YXJnZXRBbmNlc3RvckdyYXBoID0gdGFyZ2V0Tm9kZS5nZXRPd25lcigpO1xyXG5cclxuICAgICAgd2hpbGUgKGVkZ2UubGNhID09IG51bGwpXHJcbiAgICAgIHtcclxuICAgICAgICBpZiAodGFyZ2V0QW5jZXN0b3JHcmFwaCA9PSBzb3VyY2VBbmNlc3RvckdyYXBoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGVkZ2UubGNhID0gdGFyZ2V0QW5jZXN0b3JHcmFwaDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEFuY2VzdG9yR3JhcGggPT0gdGhpcy5yb290R3JhcGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWRnZS5sY2EgIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVkZ2UudGFyZ2V0SW5MY2EgPSB0YXJnZXRBbmNlc3RvckdyYXBoLmdldFBhcmVudCgpO1xyXG4gICAgICAgIHRhcmdldEFuY2VzdG9yR3JhcGggPSBlZGdlLnRhcmdldEluTGNhLmdldE93bmVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzb3VyY2VBbmNlc3RvckdyYXBoID09IHRoaXMucm9vdEdyYXBoKVxyXG4gICAgICB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlZGdlLmxjYSA9PSBudWxsKVxyXG4gICAgICB7XHJcbiAgICAgICAgZWRnZS5zb3VyY2VJbkxjYSA9IHNvdXJjZUFuY2VzdG9yR3JhcGguZ2V0UGFyZW50KCk7XHJcbiAgICAgICAgc291cmNlQW5jZXN0b3JHcmFwaCA9IGVkZ2Uuc291cmNlSW5MY2EuZ2V0T3duZXIoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChlZGdlLmxjYSA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbkxHcmFwaE1hbmFnZXIucHJvdG90eXBlLmNhbGNMb3dlc3RDb21tb25BbmNlc3RvciA9IGZ1bmN0aW9uIChmaXJzdE5vZGUsIHNlY29uZE5vZGUpXHJcbntcclxuICBpZiAoZmlyc3ROb2RlID09IHNlY29uZE5vZGUpXHJcbiAge1xyXG4gICAgcmV0dXJuIGZpcnN0Tm9kZS5nZXRPd25lcigpO1xyXG4gIH1cclxuICB2YXIgZmlyc3RPd25lckdyYXBoID0gZmlyc3ROb2RlLmdldE93bmVyKCk7XHJcblxyXG4gIGRvXHJcbiAge1xyXG4gICAgaWYgKGZpcnN0T3duZXJHcmFwaCA9PSBudWxsKVxyXG4gICAge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHZhciBzZWNvbmRPd25lckdyYXBoID0gc2Vjb25kTm9kZS5nZXRPd25lcigpO1xyXG5cclxuICAgIGRvXHJcbiAgICB7XHJcbiAgICAgIGlmIChzZWNvbmRPd25lckdyYXBoID09IG51bGwpXHJcbiAgICAgIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlY29uZE93bmVyR3JhcGggPT0gZmlyc3RPd25lckdyYXBoKVxyXG4gICAgICB7XHJcbiAgICAgICAgcmV0dXJuIHNlY29uZE93bmVyR3JhcGg7XHJcbiAgICAgIH1cclxuICAgICAgc2Vjb25kT3duZXJHcmFwaCA9IHNlY29uZE93bmVyR3JhcGguZ2V0UGFyZW50KCkuZ2V0T3duZXIoKTtcclxuICAgIH0gd2hpbGUgKHRydWUpO1xyXG5cclxuICAgIGZpcnN0T3duZXJHcmFwaCA9IGZpcnN0T3duZXJHcmFwaC5nZXRQYXJlbnQoKS5nZXRPd25lcigpO1xyXG4gIH0gd2hpbGUgKHRydWUpO1xyXG5cclxuICByZXR1cm4gZmlyc3RPd25lckdyYXBoO1xyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuY2FsY0luY2x1c2lvblRyZWVEZXB0aHMgPSBmdW5jdGlvbiAoZ3JhcGgsIGRlcHRoKSB7XHJcbiAgaWYgKGdyYXBoID09IG51bGwgJiYgZGVwdGggPT0gbnVsbCkge1xyXG4gICAgZ3JhcGggPSB0aGlzLnJvb3RHcmFwaDtcclxuICAgIGRlcHRoID0gMTtcclxuICB9XHJcbiAgdmFyIG5vZGU7XHJcblxyXG4gIHZhciBub2RlcyA9IGdyYXBoLmdldE5vZGVzKCk7XHJcbiAgdmFyIHMgPSBub2Rlcy5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzOyBpKyspXHJcbiAge1xyXG4gICAgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgbm9kZS5pbmNsdXNpb25UcmVlRGVwdGggPSBkZXB0aDtcclxuXHJcbiAgICBpZiAobm9kZS5jaGlsZCAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmNhbGNJbmNsdXNpb25UcmVlRGVwdGhzKG5vZGUuY2hpbGQsIGRlcHRoICsgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTEdyYXBoTWFuYWdlci5wcm90b3R5cGUuaW5jbHVkZXNJbnZhbGlkRWRnZSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgZWRnZTtcclxuXHJcbiAgdmFyIHMgPSB0aGlzLmVkZ2VzLmxlbmd0aDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHM7IGkrKylcclxuICB7XHJcbiAgICBlZGdlID0gdGhpcy5lZGdlc1tpXTtcclxuXHJcbiAgICBpZiAodGhpcy5pc09uZUFuY2VzdG9yT2ZPdGhlcihlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMR3JhcGhNYW5hZ2VyO1xyXG4iLCJmdW5jdGlvbiBMR3JhcGhPYmplY3QodkdyYXBoT2JqZWN0KSB7XHJcbiAgdGhpcy52R3JhcGhPYmplY3QgPSB2R3JhcGhPYmplY3Q7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTEdyYXBoT2JqZWN0O1xyXG4iLCJ2YXIgTEdyYXBoT2JqZWN0ID0gcmVxdWlyZSgnLi9MR3JhcGhPYmplY3QnKTtcclxudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcclxudmFyIFJlY3RhbmdsZUQgPSByZXF1aXJlKCcuL1JlY3RhbmdsZUQnKTtcclxudmFyIExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vTGF5b3V0Q29uc3RhbnRzJyk7XHJcbnZhciBSYW5kb21TZWVkID0gcmVxdWlyZSgnLi9SYW5kb21TZWVkJyk7XHJcbnZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xyXG52YXIgSGFzaFNldCA9IHJlcXVpcmUoJy4vSGFzaFNldCcpO1xyXG5cclxuZnVuY3Rpb24gTE5vZGUoZ20sIGxvYywgc2l6ZSwgdk5vZGUpIHtcclxuICAvL0FsdGVybmF0aXZlIGNvbnN0cnVjdG9yIDEgOiBMTm9kZShMR3JhcGhNYW5hZ2VyIGdtLCBQb2ludCBsb2MsIERpbWVuc2lvbiBzaXplLCBPYmplY3Qgdk5vZGUpXHJcbiAgaWYgKHNpemUgPT0gbnVsbCAmJiB2Tm9kZSA9PSBudWxsKSB7XHJcbiAgICB2Tm9kZSA9IGxvYztcclxuICB9XHJcblxyXG4gIExHcmFwaE9iamVjdC5jYWxsKHRoaXMsIHZOb2RlKTtcclxuXHJcbiAgLy9BbHRlcm5hdGl2ZSBjb25zdHJ1Y3RvciAyIDogTE5vZGUoTGF5b3V0IGxheW91dCwgT2JqZWN0IHZOb2RlKVxyXG4gIGlmIChnbS5ncmFwaE1hbmFnZXIgIT0gbnVsbClcclxuICAgIGdtID0gZ20uZ3JhcGhNYW5hZ2VyO1xyXG5cclxuICB0aGlzLmVzdGltYXRlZFNpemUgPSBJbnRlZ2VyLk1JTl9WQUxVRTtcclxuICB0aGlzLmluY2x1c2lvblRyZWVEZXB0aCA9IEludGVnZXIuTUFYX1ZBTFVFO1xyXG4gIHRoaXMudkdyYXBoT2JqZWN0ID0gdk5vZGU7XHJcbiAgdGhpcy5lZGdlcyA9IFtdO1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XHJcblxyXG4gIGlmIChzaXplICE9IG51bGwgJiYgbG9jICE9IG51bGwpXHJcbiAgICB0aGlzLnJlY3QgPSBuZXcgUmVjdGFuZ2xlRChsb2MueCwgbG9jLnksIHNpemUud2lkdGgsIHNpemUuaGVpZ2h0KTtcclxuICBlbHNlXHJcbiAgICB0aGlzLnJlY3QgPSBuZXcgUmVjdGFuZ2xlRCgpO1xyXG59XHJcblxyXG5MTm9kZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKExHcmFwaE9iamVjdC5wcm90b3R5cGUpO1xyXG5mb3IgKHZhciBwcm9wIGluIExHcmFwaE9iamVjdCkge1xyXG4gIExOb2RlW3Byb3BdID0gTEdyYXBoT2JqZWN0W3Byb3BdO1xyXG59XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0RWRnZXMgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZWRnZXM7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0Q2hpbGQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuY2hpbGQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2Qgc2V0cyB0aGUgY2hpbGQgZ3JhcGggb2YgdGhpcyBub2RlLiBPbmx5IGNvbXBvdW5kIG5vZGVzIHdpbGxcclxuICogaGF2ZSBjaGlsZCBncmFwaHMuXHJcbiAqL1xyXG5MTm9kZS5wcm90b3R5cGUuc2V0Q2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpXHJcbntcclxuICBpZiAoY2hpbGQgIT0gbnVsbCAmJiBjaGlsZC5nZXRHcmFwaE1hbmFnZXIoKSAhPSB0aGlzLmdyYXBoTWFuYWdlcikge1xyXG4gICAgdGhyb3cgXCJDaGlsZCBoYXMgZGlmZmVyZW50IGdyYXBoIG1nciFcIjtcclxuICB9XHJcblxyXG4gIHRoaXMuY2hpbGQgPSBjaGlsZDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRPd25lciA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5vd25lciAhPSBudWxsKSB7XHJcbiAgICBpZiAoISh0aGlzLm93bmVyID09IG51bGwgfHwgdGhpcy5vd25lci5nZXROb2RlcygpLmluZGV4T2YodGhpcykgPiAtMSkpIHtcclxuICAgICAgdGhyb3cgXCJhc3NlcnQgZmFpbGVkXCI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcy5vd25lcjtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0LndpZHRoO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnNldFdpZHRoID0gZnVuY3Rpb24gKHdpZHRoKVxyXG57XHJcbiAgdGhpcy5yZWN0LndpZHRoID0gd2lkdGg7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3QuaGVpZ2h0O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQpXHJcbntcclxuICB0aGlzLnJlY3QuaGVpZ2h0ID0gaGVpZ2h0O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldENlbnRlclggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdC54ICsgdGhpcy5yZWN0LndpZHRoIC8gMjtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRDZW50ZXJZID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3QueSArIHRoaXMucmVjdC5oZWlnaHQgLyAyO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gbmV3IFBvaW50RCh0aGlzLnJlY3QueCArIHRoaXMucmVjdC53aWR0aCAvIDIsXHJcbiAgICAgICAgICB0aGlzLnJlY3QueSArIHRoaXMucmVjdC5oZWlnaHQgLyAyKTtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gbmV3IFBvaW50RCh0aGlzLnJlY3QueCwgdGhpcy5yZWN0LnkpO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldFJlY3QgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXREaWFnb25hbCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMucmVjdC53aWR0aCAqIHRoaXMucmVjdC53aWR0aCArXHJcbiAgICAgICAgICB0aGlzLnJlY3QuaGVpZ2h0ICogdGhpcy5yZWN0LmhlaWdodCk7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuc2V0UmVjdCA9IGZ1bmN0aW9uICh1cHBlckxlZnQsIGRpbWVuc2lvbilcclxue1xyXG4gIHRoaXMucmVjdC54ID0gdXBwZXJMZWZ0Lng7XHJcbiAgdGhpcy5yZWN0LnkgPSB1cHBlckxlZnQueTtcclxuICB0aGlzLnJlY3Qud2lkdGggPSBkaW1lbnNpb24ud2lkdGg7XHJcbiAgdGhpcy5yZWN0LmhlaWdodCA9IGRpbWVuc2lvbi5oZWlnaHQ7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuc2V0Q2VudGVyID0gZnVuY3Rpb24gKGN4LCBjeSlcclxue1xyXG4gIHRoaXMucmVjdC54ID0gY3ggLSB0aGlzLnJlY3Qud2lkdGggLyAyO1xyXG4gIHRoaXMucmVjdC55ID0gY3kgLSB0aGlzLnJlY3QuaGVpZ2h0IC8gMjtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5zZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICh4LCB5KVxyXG57XHJcbiAgdGhpcy5yZWN0LnggPSB4O1xyXG4gIHRoaXMucmVjdC55ID0geTtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5tb3ZlQnkgPSBmdW5jdGlvbiAoZHgsIGR5KVxyXG57XHJcbiAgdGhpcy5yZWN0LnggKz0gZHg7XHJcbiAgdGhpcy5yZWN0LnkgKz0gZHk7XHJcbn07XHJcblxyXG5MTm9kZS5wcm90b3R5cGUuZ2V0RWRnZUxpc3RUb05vZGUgPSBmdW5jdGlvbiAodG8pXHJcbntcclxuICB2YXIgZWRnZUxpc3QgPSBbXTtcclxuICB2YXIgZWRnZTtcclxuXHJcbiAgZm9yICh2YXIgb2JqIGluIHRoaXMuZWRnZXMpXHJcbiAge1xyXG4gICAgZWRnZSA9IG9iajtcclxuXHJcbiAgICBpZiAoZWRnZS50YXJnZXQgPT0gdG8pXHJcbiAgICB7XHJcbiAgICAgIGlmIChlZGdlLnNvdXJjZSAhPSB0aGlzKVxyXG4gICAgICAgIHRocm93IFwiSW5jb3JyZWN0IGVkZ2Ugc291cmNlIVwiO1xyXG5cclxuICAgICAgZWRnZUxpc3QucHVzaChlZGdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBlZGdlTGlzdDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRFZGdlc0JldHdlZW4gPSBmdW5jdGlvbiAob3RoZXIpXHJcbntcclxuICB2YXIgZWRnZUxpc3QgPSBbXTtcclxuICB2YXIgZWRnZTtcclxuXHJcbiAgZm9yICh2YXIgb2JqIGluIHRoaXMuZWRnZXMpXHJcbiAge1xyXG4gICAgZWRnZSA9IHRoaXMuZWRnZXNbb2JqXTtcclxuXHJcbiAgICBpZiAoIShlZGdlLnNvdXJjZSA9PSB0aGlzIHx8IGVkZ2UudGFyZ2V0ID09IHRoaXMpKVxyXG4gICAgICB0aHJvdyBcIkluY29ycmVjdCBlZGdlIHNvdXJjZSBhbmQvb3IgdGFyZ2V0XCI7XHJcblxyXG4gICAgaWYgKChlZGdlLnRhcmdldCA9PSBvdGhlcikgfHwgKGVkZ2Uuc291cmNlID09IG90aGVyKSlcclxuICAgIHtcclxuICAgICAgZWRnZUxpc3QucHVzaChlZGdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBlZGdlTGlzdDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXROZWlnaGJvcnNMaXN0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBuZWlnaGJvcnMgPSBuZXcgSGFzaFNldCgpO1xyXG4gIHZhciBlZGdlO1xyXG5cclxuICBmb3IgKHZhciBvYmogaW4gdGhpcy5lZGdlcylcclxuICB7XHJcbiAgICBlZGdlID0gdGhpcy5lZGdlc1tvYmpdO1xyXG5cclxuICAgIGlmIChlZGdlLnNvdXJjZSA9PSB0aGlzKVxyXG4gICAge1xyXG4gICAgICBuZWlnaGJvcnMuYWRkKGVkZ2UudGFyZ2V0KTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgaWYgKCFlZGdlLnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHRocm93IFwiSW5jb3JyZWN0IGluY2lkZW5jeSFcIjtcclxuICAgICAgbmVpZ2hib3JzLmFkZChlZGdlLnNvdXJjZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmVpZ2hib3JzO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLndpdGhDaGlsZHJlbiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgd2l0aE5laWdoYm9yc0xpc3QgPSBbXTtcclxuICB2YXIgY2hpbGROb2RlO1xyXG5cclxuICB3aXRoTmVpZ2hib3JzTGlzdC5wdXNoKHRoaXMpO1xyXG5cclxuICBpZiAodGhpcy5jaGlsZCAhPSBudWxsKVxyXG4gIHtcclxuICAgIHZhciBub2RlcyA9IHRoaXMuY2hpbGQuZ2V0Tm9kZXMoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIGNoaWxkTm9kZSA9IG5vZGVzW2ldO1xyXG5cclxuICAgICAgd2l0aE5laWdoYm9yc0xpc3QgPSB3aXRoTmVpZ2hib3JzTGlzdC5jb25jYXQoY2hpbGROb2RlLndpdGhDaGlsZHJlbigpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB3aXRoTmVpZ2hib3JzTGlzdDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmVzdGltYXRlZFNpemUgPT0gSW50ZWdlci5NSU5fVkFMVUUpIHtcclxuICAgIHRocm93IFwiYXNzZXJ0IGZhaWxlZFwiO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5lc3RpbWF0ZWRTaXplO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmNhbGNFc3RpbWF0ZWRTaXplID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0aGlzLmNoaWxkID09IG51bGwpXHJcbiAge1xyXG4gICAgcmV0dXJuIHRoaXMuZXN0aW1hdGVkU2l6ZSA9IE1hdGguZmxvb3IoKHRoaXMucmVjdC53aWR0aCArIHRoaXMucmVjdC5oZWlnaHQpIC8gMik7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICB0aGlzLmVzdGltYXRlZFNpemUgPSB0aGlzLmNoaWxkLmNhbGNFc3RpbWF0ZWRTaXplKCk7XHJcbiAgICB0aGlzLnJlY3Qud2lkdGggPSB0aGlzLmVzdGltYXRlZFNpemU7XHJcbiAgICB0aGlzLnJlY3QuaGVpZ2h0ID0gdGhpcy5lc3RpbWF0ZWRTaXplO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmVzdGltYXRlZFNpemU7XHJcbiAgfVxyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnNjYXR0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHJhbmRvbUNlbnRlclg7XHJcbiAgdmFyIHJhbmRvbUNlbnRlclk7XHJcblxyXG4gIHZhciBtaW5YID0gLUxheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xyXG4gIHZhciBtYXhYID0gTGF5b3V0Q29uc3RhbnRzLklOSVRJQUxfV09STERfQk9VTkRBUlk7XHJcbiAgcmFuZG9tQ2VudGVyWCA9IExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWCArXHJcbiAgICAgICAgICAoUmFuZG9tU2VlZC5uZXh0RG91YmxlKCkgKiAobWF4WCAtIG1pblgpKSArIG1pblg7XHJcblxyXG4gIHZhciBtaW5ZID0gLUxheW91dENvbnN0YW50cy5JTklUSUFMX1dPUkxEX0JPVU5EQVJZO1xyXG4gIHZhciBtYXhZID0gTGF5b3V0Q29uc3RhbnRzLklOSVRJQUxfV09STERfQk9VTkRBUlk7XHJcbiAgcmFuZG9tQ2VudGVyWSA9IExheW91dENvbnN0YW50cy5XT1JMRF9DRU5URVJfWSArXHJcbiAgICAgICAgICAoUmFuZG9tU2VlZC5uZXh0RG91YmxlKCkgKiAobWF4WSAtIG1pblkpKSArIG1pblk7XHJcblxyXG4gIHRoaXMucmVjdC54ID0gcmFuZG9tQ2VudGVyWDtcclxuICB0aGlzLnJlY3QueSA9IHJhbmRvbUNlbnRlcllcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS51cGRhdGVCb3VuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHRoaXMuZ2V0Q2hpbGQoKSA9PSBudWxsKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcbiAgaWYgKHRoaXMuZ2V0Q2hpbGQoKS5nZXROb2RlcygpLmxlbmd0aCAhPSAwKVxyXG4gIHtcclxuICAgIC8vIHdyYXAgdGhlIGNoaWxkcmVuIG5vZGVzIGJ5IHJlLWFycmFuZ2luZyB0aGUgYm91bmRhcmllc1xyXG4gICAgdmFyIGNoaWxkR3JhcGggPSB0aGlzLmdldENoaWxkKCk7XHJcbiAgICBjaGlsZEdyYXBoLnVwZGF0ZUJvdW5kcyh0cnVlKTtcclxuXHJcbiAgICB0aGlzLnJlY3QueCA9IGNoaWxkR3JhcGguZ2V0TGVmdCgpO1xyXG4gICAgdGhpcy5yZWN0LnkgPSBjaGlsZEdyYXBoLmdldFRvcCgpO1xyXG5cclxuICAgIHRoaXMuc2V0V2lkdGgoY2hpbGRHcmFwaC5nZXRSaWdodCgpIC0gY2hpbGRHcmFwaC5nZXRMZWZ0KCkpO1xyXG4gICAgdGhpcy5zZXRIZWlnaHQoY2hpbGRHcmFwaC5nZXRCb3R0b20oKSAtIGNoaWxkR3JhcGguZ2V0VG9wKCkpO1xyXG4gIH1cclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRJbmNsdXNpb25UcmVlRGVwdGggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgaWYgKHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoID09IEludGVnZXIuTUFYX1ZBTFVFKSB7XHJcbiAgICB0aHJvdyBcImFzc2VydCBmYWlsZWRcIjtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuaW5jbHVzaW9uVHJlZURlcHRoO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0cmFucylcclxue1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yZWN0Lng7XHJcblxyXG4gIGlmIChsZWZ0ID4gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxyXG4gIHtcclxuICAgIGxlZnQgPSBMYXlvdXRDb25zdGFudHMuV09STERfQk9VTkRBUlk7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKGxlZnQgPCAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxyXG4gIHtcclxuICAgIGxlZnQgPSAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xyXG4gIH1cclxuXHJcbiAgdmFyIHRvcCA9IHRoaXMucmVjdC55O1xyXG5cclxuICBpZiAodG9wID4gTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZKVxyXG4gIHtcclxuICAgIHRvcCA9IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWTtcclxuICB9XHJcbiAgZWxzZSBpZiAodG9wIDwgLUxheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWSlcclxuICB7XHJcbiAgICB0b3AgPSAtTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZO1xyXG4gIH1cclxuXHJcbiAgdmFyIGxlZnRUb3AgPSBuZXcgUG9pbnREKGxlZnQsIHRvcCk7XHJcbiAgdmFyIHZMZWZ0VG9wID0gdHJhbnMuaW52ZXJzZVRyYW5zZm9ybVBvaW50KGxlZnRUb3ApO1xyXG5cclxuICB0aGlzLnNldExvY2F0aW9uKHZMZWZ0VG9wLngsIHZMZWZ0VG9wLnkpO1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdC54O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldFJpZ2h0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLnJlY3QueCArIHRoaXMucmVjdC53aWR0aDtcclxufTtcclxuXHJcbkxOb2RlLnByb3RvdHlwZS5nZXRUb3AgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMucmVjdC55O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5yZWN0LnkgKyB0aGlzLnJlY3QuaGVpZ2h0O1xyXG59O1xyXG5cclxuTE5vZGUucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICBpZiAodGhpcy5vd25lciA9PSBudWxsKVxyXG4gIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXMub3duZXIuZ2V0UGFyZW50KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExOb2RlO1xyXG4iLCJ2YXIgTGF5b3V0Q29uc3RhbnRzID0gcmVxdWlyZSgnLi9MYXlvdXRDb25zdGFudHMnKTtcclxudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcclxudmFyIExHcmFwaE1hbmFnZXIgPSByZXF1aXJlKCcuL0xHcmFwaE1hbmFnZXInKTtcclxudmFyIExOb2RlID0gcmVxdWlyZSgnLi9MTm9kZScpO1xyXG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XHJcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xyXG52YXIgUG9pbnREID0gcmVxdWlyZSgnLi9Qb2ludEQnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XHJcbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnLi9FbWl0dGVyJyk7XHJcbnZhciBIYXNoU2V0ID0gcmVxdWlyZSgnLi9IYXNoU2V0Jyk7XHJcblxyXG5mdW5jdGlvbiBMYXlvdXQoaXNSZW1vdGVVc2UpIHtcclxuICBFbWl0dGVyLmNhbGwoIHRoaXMgKTtcclxuXHJcbiAgLy9MYXlvdXQgUXVhbGl0eTogMDpwcm9vZiwgMTpkZWZhdWx0LCAyOmRyYWZ0XHJcbiAgdGhpcy5sYXlvdXRRdWFsaXR5ID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUVVBTElUWTtcclxuICAvL1doZXRoZXIgbGF5b3V0IHNob3VsZCBjcmVhdGUgYmVuZHBvaW50cyBhcyBuZWVkZWQgb3Igbm90XHJcbiAgdGhpcy5jcmVhdGVCZW5kc0FzTmVlZGVkID1cclxuICAgICAgICAgIExheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQ7XHJcbiAgLy9XaGV0aGVyIGxheW91dCBzaG91bGQgYmUgaW5jcmVtZW50YWwgb3Igbm90XHJcbiAgdGhpcy5pbmNyZW1lbnRhbCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMO1xyXG4gIC8vV2hldGhlciB3ZSBhbmltYXRlIGZyb20gYmVmb3JlIHRvIGFmdGVyIGxheW91dCBub2RlIHBvc2l0aW9uc1xyXG4gIHRoaXMuYW5pbWF0aW9uT25MYXlvdXQgPVxyXG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQU5JTUFUSU9OX09OX0xBWU9VVDtcclxuICAvL1doZXRoZXIgd2UgYW5pbWF0ZSB0aGUgbGF5b3V0IHByb2Nlc3Mgb3Igbm90XHJcbiAgdGhpcy5hbmltYXRpb25EdXJpbmdMYXlvdXQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVDtcclxuICAvL051bWJlciBpdGVyYXRpb25zIHRoYXQgc2hvdWxkIGJlIGRvbmUgYmV0d2VlbiB0d28gc3VjY2Vzc2l2ZSBhbmltYXRpb25zXHJcbiAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EO1xyXG4gIC8qKlxyXG4gICAqIFdoZXRoZXIgb3Igbm90IGxlYWYgbm9kZXMgKG5vbi1jb21wb3VuZCBub2RlcykgYXJlIG9mIHVuaWZvcm0gc2l6ZXMuIFdoZW5cclxuICAgKiB0aGV5IGFyZSwgYm90aCBzcHJpbmcgYW5kIHJlcHVsc2lvbiBmb3JjZXMgYmV0d2VlbiB0d28gbGVhZiBub2RlcyBjYW4gYmVcclxuICAgKiBjYWxjdWxhdGVkIHdpdGhvdXQgdGhlIGV4cGVuc2l2ZSBjbGlwcGluZyBwb2ludCBjYWxjdWxhdGlvbnMsIHJlc3VsdGluZ1xyXG4gICAqIGluIG1ham9yIHNwZWVkLXVwLlxyXG4gICAqL1xyXG4gIHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgPVxyXG4gICAgICAgICAgTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfVU5JRk9STV9MRUFGX05PREVfU0laRVM7XHJcbiAgLyoqXHJcbiAgICogVGhpcyBpcyB1c2VkIGZvciBjcmVhdGlvbiBvZiBiZW5kcG9pbnRzIGJ5IHVzaW5nIGR1bW15IG5vZGVzIGFuZCBlZGdlcy5cclxuICAgKiBNYXBzIGFuIExFZGdlIHRvIGl0cyBkdW1teSBiZW5kcG9pbnQgcGF0aC5cclxuICAgKi9cclxuICB0aGlzLmVkZ2VUb0R1bW15Tm9kZXMgPSBuZXcgSGFzaE1hcCgpO1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gbmV3IExHcmFwaE1hbmFnZXIodGhpcyk7XHJcbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gZmFsc2U7XHJcbiAgdGhpcy5pc1N1YkxheW91dCA9IGZhbHNlO1xyXG4gIHRoaXMuaXNSZW1vdGVVc2UgPSBmYWxzZTtcclxuXHJcbiAgaWYgKGlzUmVtb3RlVXNlICE9IG51bGwpIHtcclxuICAgIHRoaXMuaXNSZW1vdGVVc2UgPSBpc1JlbW90ZVVzZTtcclxuICB9XHJcbn1cclxuXHJcbkxheW91dC5SQU5ET01fU0VFRCA9IDE7XHJcblxyXG5MYXlvdXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggRW1pdHRlci5wcm90b3R5cGUgKTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUuZ2V0R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlcjtcclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUuZ2V0QWxsTm9kZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuZ3JhcGhNYW5hZ2VyLmdldEFsbE5vZGVzKCk7XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLmdldEFsbEVkZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5nZXRBbGxOb2Rlc1RvQXBwbHlHcmF2aXRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gdGhpcy5ncmFwaE1hbmFnZXIuZ2V0QWxsTm9kZXNUb0FwcGx5R3Jhdml0YXRpb24oKTtcclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUubmV3R3JhcGhNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBnbSA9IG5ldyBMR3JhcGhNYW5hZ2VyKHRoaXMpO1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XHJcbiAgcmV0dXJuIGdtO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5uZXdHcmFwaCA9IGZ1bmN0aW9uICh2R3JhcGgpXHJcbntcclxuICByZXR1cm4gbmV3IExHcmFwaChudWxsLCB0aGlzLmdyYXBoTWFuYWdlciwgdkdyYXBoKTtcclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUubmV3Tm9kZSA9IGZ1bmN0aW9uICh2Tm9kZSlcclxue1xyXG4gIHJldHVybiBuZXcgTE5vZGUodGhpcy5ncmFwaE1hbmFnZXIsIHZOb2RlKTtcclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUubmV3RWRnZSA9IGZ1bmN0aW9uICh2RWRnZSlcclxue1xyXG4gIHJldHVybiBuZXcgTEVkZ2UobnVsbCwgbnVsbCwgdkVkZ2UpO1xyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5ydW5MYXlvdXQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgdGhpcy5pc0xheW91dEZpbmlzaGVkID0gZmFsc2U7XHJcblxyXG4gIHRoaXMuaW5pdFBhcmFtZXRlcnMoKTtcclxuICB2YXIgaXNMYXlvdXRTdWNjZXNzZnVsbDtcclxuXHJcbiAgaWYgKCh0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkgPT0gbnVsbClcclxuICAgICAgICAgIHx8IHRoaXMuZ3JhcGhNYW5hZ2VyLmdldFJvb3QoKS5nZXROb2RlcygpLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgICB8fCB0aGlzLmdyYXBoTWFuYWdlci5pbmNsdWRlc0ludmFsaWRFZGdlKCkpXHJcbiAge1xyXG4gICAgaXNMYXlvdXRTdWNjZXNzZnVsbCA9IGZhbHNlO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgLy8gY2FsY3VsYXRlIGV4ZWN1dGlvbiB0aW1lXHJcbiAgICB2YXIgc3RhcnRUaW1lID0gMDtcclxuXHJcbiAgICBpZiAoIXRoaXMuaXNTdWJMYXlvdXQpXHJcbiAgICB7XHJcbiAgICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICB9XHJcblxyXG4gICAgaXNMYXlvdXRTdWNjZXNzZnVsbCA9IHRoaXMubGF5b3V0KCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzU3ViTGF5b3V0KVxyXG4gICAge1xyXG4gICAgICB2YXIgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICB2YXIgZXhjVGltZSA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoaXNMYXlvdXRTdWNjZXNzZnVsbClcclxuICB7XHJcbiAgICBpZiAoIXRoaXMuaXNTdWJMYXlvdXQpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZG9Qb3N0TGF5b3V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLmlzTGF5b3V0RmluaXNoZWQgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gaXNMYXlvdXRTdWNjZXNzZnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBwZXJmb3JtcyB0aGUgb3BlcmF0aW9ucyByZXF1aXJlZCBhZnRlciBsYXlvdXQuXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLmRvUG9zdExheW91dCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICAvL2Fzc2VydCAhaXNTdWJMYXlvdXQgOiBcIlNob3VsZCBub3QgYmUgY2FsbGVkIG9uIHN1Yi1sYXlvdXQhXCI7XHJcbiAgLy8gUHJvcGFnYXRlIGdlb21ldHJpYyBjaGFuZ2VzIHRvIHYtbGV2ZWwgb2JqZWN0c1xyXG4gIHRoaXMudHJhbnNmb3JtKCk7XHJcbiAgdGhpcy51cGRhdGUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCB1cGRhdGVzIHRoZSBnZW9tZXRyeSBvZiB0aGUgdGFyZ2V0IGdyYXBoIGFjY29yZGluZyB0b1xyXG4gKiBjYWxjdWxhdGVkIGxheW91dC5cclxuICovXHJcbkxheW91dC5wcm90b3R5cGUudXBkYXRlMiA9IGZ1bmN0aW9uICgpIHtcclxuICAvLyB1cGRhdGUgYmVuZCBwb2ludHNcclxuICBpZiAodGhpcy5jcmVhdGVCZW5kc0FzTmVlZGVkKVxyXG4gIHtcclxuICAgIHRoaXMuY3JlYXRlQmVuZHBvaW50c0Zyb21EdW1teU5vZGVzKCk7XHJcblxyXG4gICAgLy8gcmVzZXQgYWxsIGVkZ2VzLCBzaW5jZSB0aGUgdG9wb2xvZ3kgaGFzIGNoYW5nZWRcclxuICAgIHRoaXMuZ3JhcGhNYW5hZ2VyLnJlc2V0QWxsRWRnZXMoKTtcclxuICB9XHJcblxyXG4gIC8vIHBlcmZvcm0gZWRnZSwgbm9kZSBhbmQgcm9vdCB1cGRhdGVzIGlmIGxheW91dCBpcyBub3QgY2FsbGVkXHJcbiAgLy8gcmVtb3RlbHlcclxuICBpZiAoIXRoaXMuaXNSZW1vdGVVc2UpXHJcbiAge1xyXG4gICAgLy8gdXBkYXRlIGFsbCBlZGdlc1xyXG4gICAgdmFyIGVkZ2U7XHJcbiAgICB2YXIgYWxsRWRnZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxFZGdlcy5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgZWRnZSA9IGFsbEVkZ2VzW2ldO1xyXG4vLyAgICAgIHRoaXMudXBkYXRlKGVkZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBub2Rlc1xyXG4gICAgdmFyIG5vZGU7XHJcbiAgICB2YXIgbm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIG5vZGUgPSBub2Rlc1tpXTtcclxuLy8gICAgICB0aGlzLnVwZGF0ZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgcm9vdCBncmFwaFxyXG4gICAgdGhpcy51cGRhdGUodGhpcy5ncmFwaE1hbmFnZXIuZ2V0Um9vdCgpKTtcclxuICB9XHJcbn07XHJcblxyXG5MYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICBpZiAob2JqID09IG51bGwpIHtcclxuICAgIHRoaXMudXBkYXRlMigpO1xyXG4gIH1cclxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMTm9kZSkge1xyXG4gICAgdmFyIG5vZGUgPSBvYmo7XHJcbiAgICBpZiAobm9kZS5nZXRDaGlsZCgpICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIC8vIHNpbmNlIG5vZGUgaXMgY29tcG91bmQsIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBjaGlsZCBub2Rlc1xyXG4gICAgICB2YXIgbm9kZXMgPSBub2RlLmdldENoaWxkKCkuZ2V0Tm9kZXMoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIHVwZGF0ZShub2Rlc1tpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiB0aGUgbC1sZXZlbCBub2RlIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHYtbGV2ZWwgZ3JhcGggb2JqZWN0LFxyXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgbm9kZSBpbXBsZW1lbnRzIHRoZVxyXG4gICAgLy8gaW50ZXJmYWNlIFVwZGF0YWJsZS5cclxuICAgIGlmIChub2RlLnZHcmFwaE9iamVjdCAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAvLyBjYXN0IHRvIFVwZGF0YWJsZSB3aXRob3V0IGFueSB0eXBlIGNoZWNrXHJcbiAgICAgIHZhciB2Tm9kZSA9IG5vZGUudkdyYXBoT2JqZWN0O1xyXG5cclxuICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCBvZiB0aGUgaW50ZXJmYWNlXHJcbiAgICAgIHZOb2RlLnVwZGF0ZShub2RlKTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTEVkZ2UpIHtcclxuICAgIHZhciBlZGdlID0gb2JqO1xyXG4gICAgLy8gaWYgdGhlIGwtbGV2ZWwgZWRnZSBpcyBhc3NvY2lhdGVkIHdpdGggYSB2LWxldmVsIGdyYXBoIG9iamVjdCxcclxuICAgIC8vIHRoZW4gaXQgaXMgYXNzdW1lZCB0aGF0IHRoZSB2LWxldmVsIGVkZ2UgaW1wbGVtZW50cyB0aGVcclxuICAgIC8vIGludGVyZmFjZSBVcGRhdGFibGUuXHJcblxyXG4gICAgaWYgKGVkZ2UudkdyYXBoT2JqZWN0ICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIC8vIGNhc3QgdG8gVXBkYXRhYmxlIHdpdGhvdXQgYW55IHR5cGUgY2hlY2tcclxuICAgICAgdmFyIHZFZGdlID0gZWRnZS52R3JhcGhPYmplY3Q7XHJcblxyXG4gICAgICAvLyBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIG9mIHRoZSBpbnRlcmZhY2VcclxuICAgICAgdkVkZ2UudXBkYXRlKGVkZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBMR3JhcGgpIHtcclxuICAgIHZhciBncmFwaCA9IG9iajtcclxuICAgIC8vIGlmIHRoZSBsLWxldmVsIGdyYXBoIGlzIGFzc29jaWF0ZWQgd2l0aCBhIHYtbGV2ZWwgZ3JhcGggb2JqZWN0LFxyXG4gICAgLy8gdGhlbiBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHYtbGV2ZWwgb2JqZWN0IGltcGxlbWVudHMgdGhlXHJcbiAgICAvLyBpbnRlcmZhY2UgVXBkYXRhYmxlLlxyXG5cclxuICAgIGlmIChncmFwaC52R3JhcGhPYmplY3QgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgLy8gY2FzdCB0byBVcGRhdGFibGUgd2l0aG91dCBhbnkgdHlwZSBjaGVja1xyXG4gICAgICB2YXIgdkdyYXBoID0gZ3JhcGgudkdyYXBoT2JqZWN0O1xyXG5cclxuICAgICAgLy8gY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCBvZiB0aGUgaW50ZXJmYWNlXHJcbiAgICAgIHZHcmFwaC51cGRhdGUoZ3JhcGgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIHNldCBhbGwgbGF5b3V0IHBhcmFtZXRlcnMgdG8gZGVmYXVsdCB2YWx1ZXNcclxuICogZGV0ZXJtaW5lZCBhdCBjb21waWxlIHRpbWUuXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLmluaXRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5pc1N1YkxheW91dClcclxuICB7XHJcbiAgICB0aGlzLmxheW91dFF1YWxpdHkgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9RVUFMSVRZO1xyXG4gICAgdGhpcy5hbmltYXRpb25EdXJpbmdMYXlvdXQgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fT05fTEFZT1VUO1xyXG4gICAgdGhpcy5hbmltYXRpb25QZXJpb2QgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EO1xyXG4gICAgdGhpcy5hbmltYXRpb25PbkxheW91dCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9EVVJJTkdfTEFZT1VUO1xyXG4gICAgdGhpcy5pbmNyZW1lbnRhbCA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMO1xyXG4gICAgdGhpcy5jcmVhdGVCZW5kc0FzTmVlZGVkID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ1JFQVRFX0JFTkRTX0FTX05FRURFRDtcclxuICAgIHRoaXMudW5pZm9ybUxlYWZOb2RlU2l6ZXMgPSBMYXlvdXRDb25zdGFudHMuREVGQVVMVF9VTklGT1JNX0xFQUZfTk9ERV9TSVpFUztcclxuICB9XHJcblxyXG4gIGlmICh0aGlzLmFuaW1hdGlvbkR1cmluZ0xheW91dClcclxuICB7XHJcbiAgICBhbmltYXRpb25PbkxheW91dCA9IGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbkxheW91dC5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gKG5ld0xlZnRUb3ApIHtcclxuICBpZiAobmV3TGVmdFRvcCA9PSB1bmRlZmluZWQpIHtcclxuICAgIHRoaXMudHJhbnNmb3JtKG5ldyBQb2ludEQoMCwgMCkpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIC8vIGNyZWF0ZSBhIHRyYW5zZm9ybWF0aW9uIG9iamVjdCAoZnJvbSBFY2xpcHNlIHRvIGxheW91dCkuIFdoZW4gYW5cclxuICAgIC8vIGludmVyc2UgdHJhbnNmb3JtIGlzIGFwcGxpZWQsIHdlIGdldCB1cHBlci1sZWZ0IGNvb3JkaW5hdGUgb2YgdGhlXHJcbiAgICAvLyBkcmF3aW5nIG9yIHRoZSByb290IGdyYXBoIGF0IGdpdmVuIGlucHV0IGNvb3JkaW5hdGUgKHNvbWUgbWFyZ2luc1xyXG4gICAgLy8gYWxyZWFkeSBpbmNsdWRlZCBpbiBjYWxjdWxhdGlvbiBvZiBsZWZ0LXRvcCkuXHJcblxyXG4gICAgdmFyIHRyYW5zID0gbmV3IFRyYW5zZm9ybSgpO1xyXG4gICAgdmFyIGxlZnRUb3AgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkudXBkYXRlTGVmdFRvcCgpO1xyXG5cclxuICAgIGlmIChsZWZ0VG9wICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgIHRyYW5zLnNldFdvcmxkT3JnWChuZXdMZWZ0VG9wLngpO1xyXG4gICAgICB0cmFucy5zZXRXb3JsZE9yZ1kobmV3TGVmdFRvcC55KTtcclxuXHJcbiAgICAgIHRyYW5zLnNldERldmljZU9yZ1gobGVmdFRvcC54KTtcclxuICAgICAgdHJhbnMuc2V0RGV2aWNlT3JnWShsZWZ0VG9wLnkpO1xyXG5cclxuICAgICAgdmFyIG5vZGVzID0gdGhpcy5nZXRBbGxOb2RlcygpO1xyXG4gICAgICB2YXIgbm9kZTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgIHtcclxuICAgICAgICBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgbm9kZS50cmFuc2Zvcm0odHJhbnMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTGF5b3V0LnByb3RvdHlwZS5wb3NpdGlvbk5vZGVzUmFuZG9tbHkgPSBmdW5jdGlvbiAoZ3JhcGgpIHtcclxuXHJcbiAgaWYgKGdyYXBoID09IHVuZGVmaW5lZCkge1xyXG4gICAgLy9hc3NlcnQgIXRoaXMuaW5jcmVtZW50YWw7XHJcbiAgICB0aGlzLnBvc2l0aW9uTm9kZXNSYW5kb21seSh0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKSk7XHJcbiAgICB0aGlzLmdldEdyYXBoTWFuYWdlcigpLmdldFJvb3QoKS51cGRhdGVCb3VuZHModHJ1ZSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdmFyIGxOb2RlO1xyXG4gICAgdmFyIGNoaWxkR3JhcGg7XHJcblxyXG4gICAgdmFyIG5vZGVzID0gZ3JhcGguZ2V0Tm9kZXMoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIGxOb2RlID0gbm9kZXNbaV07XHJcbiAgICAgIGNoaWxkR3JhcGggPSBsTm9kZS5nZXRDaGlsZCgpO1xyXG5cclxuICAgICAgaWYgKGNoaWxkR3JhcGggPT0gbnVsbClcclxuICAgICAge1xyXG4gICAgICAgIGxOb2RlLnNjYXR0ZXIoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChjaGlsZEdyYXBoLmdldE5vZGVzKCkubGVuZ3RoID09IDApXHJcbiAgICAgIHtcclxuICAgICAgICBsTm9kZS5zY2F0dGVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbk5vZGVzUmFuZG9tbHkoY2hpbGRHcmFwaCk7XHJcbiAgICAgICAgbE5vZGUudXBkYXRlQm91bmRzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIGxpc3Qgb2YgdHJlZXMgd2hlcmUgZWFjaCB0cmVlIGlzIHJlcHJlc2VudGVkIGFzIGFcclxuICogbGlzdCBvZiBsLW5vZGVzLiBUaGUgbWV0aG9kIHJldHVybnMgYSBsaXN0IG9mIHNpemUgMCB3aGVuOlxyXG4gKiAtIFRoZSBncmFwaCBpcyBub3QgZmxhdCBvclxyXG4gKiAtIE9uZSBvZiB0aGUgY29tcG9uZW50KHMpIG9mIHRoZSBncmFwaCBpcyBub3QgYSB0cmVlLlxyXG4gKi9cclxuTGF5b3V0LnByb3RvdHlwZS5nZXRGbGF0Rm9yZXN0ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHZhciBmbGF0Rm9yZXN0ID0gW107XHJcbiAgdmFyIGlzRm9yZXN0ID0gdHJ1ZTtcclxuXHJcbiAgLy8gUXVpY2sgcmVmZXJlbmNlIGZvciBhbGwgbm9kZXMgaW4gdGhlIGdyYXBoIG1hbmFnZXIgYXNzb2NpYXRlZCB3aXRoXHJcbiAgLy8gdGhpcyBsYXlvdXQuIFRoZSBsaXN0IHNob3VsZCBub3QgYmUgY2hhbmdlZC5cclxuICB2YXIgYWxsTm9kZXMgPSB0aGlzLmdyYXBoTWFuYWdlci5nZXRSb290KCkuZ2V0Tm9kZXMoKTtcclxuXHJcbiAgLy8gRmlyc3QgYmUgc3VyZSB0aGF0IHRoZSBncmFwaCBpcyBmbGF0XHJcbiAgdmFyIGlzRmxhdCA9IHRydWU7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsTm9kZXMubGVuZ3RoOyBpKyspXHJcbiAge1xyXG4gICAgaWYgKGFsbE5vZGVzW2ldLmdldENoaWxkKCkgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgaXNGbGF0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm4gZW1wdHkgZm9yZXN0IGlmIHRoZSBncmFwaCBpcyBub3QgZmxhdC5cclxuICBpZiAoIWlzRmxhdClcclxuICB7XHJcbiAgICByZXR1cm4gZmxhdEZvcmVzdDtcclxuICB9XHJcblxyXG4gIC8vIFJ1biBCRlMgZm9yIGVhY2ggY29tcG9uZW50IG9mIHRoZSBncmFwaC5cclxuXHJcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgSGFzaFNldCgpO1xyXG4gIHZhciB0b0JlVmlzaXRlZCA9IFtdO1xyXG4gIHZhciBwYXJlbnRzID0gbmV3IEhhc2hNYXAoKTtcclxuICB2YXIgdW5Qcm9jZXNzZWROb2RlcyA9IFtdO1xyXG5cclxuICB1blByb2Nlc3NlZE5vZGVzID0gdW5Qcm9jZXNzZWROb2Rlcy5jb25jYXQoYWxsTm9kZXMpO1xyXG5cclxuICAvLyBFYWNoIGl0ZXJhdGlvbiBvZiB0aGlzIGxvb3AgZmluZHMgYSBjb21wb25lbnQgb2YgdGhlIGdyYXBoIGFuZFxyXG4gIC8vIGRlY2lkZXMgd2hldGhlciBpdCBpcyBhIHRyZWUgb3Igbm90LiBJZiBpdCBpcyBhIHRyZWUsIGFkZHMgaXQgdG8gdGhlXHJcbiAgLy8gZm9yZXN0IGFuZCBjb250aW51ZWQgd2l0aCB0aGUgbmV4dCBjb21wb25lbnQuXHJcblxyXG4gIHdoaWxlICh1blByb2Nlc3NlZE5vZGVzLmxlbmd0aCA+IDAgJiYgaXNGb3Jlc3QpXHJcbiAge1xyXG4gICAgdG9CZVZpc2l0ZWQucHVzaCh1blByb2Nlc3NlZE5vZGVzWzBdKTtcclxuXHJcbiAgICAvLyBTdGFydCB0aGUgQkZTLiBFYWNoIGl0ZXJhdGlvbiBvZiB0aGlzIGxvb3AgdmlzaXRzIGEgbm9kZSBpbiBhXHJcbiAgICAvLyBCRlMgbWFubmVyLlxyXG4gICAgd2hpbGUgKHRvQmVWaXNpdGVkLmxlbmd0aCA+IDAgJiYgaXNGb3Jlc3QpXHJcbiAgICB7XHJcbiAgICAgIC8vcG9vbCBvcGVyYXRpb25cclxuICAgICAgdmFyIGN1cnJlbnROb2RlID0gdG9CZVZpc2l0ZWRbMF07XHJcbiAgICAgIHRvQmVWaXNpdGVkLnNwbGljZSgwLCAxKTtcclxuICAgICAgdmlzaXRlZC5hZGQoY3VycmVudE5vZGUpO1xyXG5cclxuICAgICAgLy8gVHJhdmVyc2UgYWxsIG5laWdoYm9ycyBvZiB0aGlzIG5vZGVcclxuICAgICAgdmFyIG5laWdoYm9yRWRnZXMgPSBjdXJyZW50Tm9kZS5nZXRFZGdlcygpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWlnaGJvckVkZ2VzLmxlbmd0aDsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnROZWlnaGJvciA9XHJcbiAgICAgICAgICAgICAgICBuZWlnaGJvckVkZ2VzW2ldLmdldE90aGVyRW5kKGN1cnJlbnROb2RlKTtcclxuXHJcbiAgICAgICAgLy8gSWYgQkZTIGlzIG5vdCBncm93aW5nIGZyb20gdGhpcyBuZWlnaGJvci5cclxuICAgICAgICBpZiAocGFyZW50cy5nZXQoY3VycmVudE5vZGUpICE9IGN1cnJlbnROZWlnaGJvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvLyBXZSBoYXZlbid0IHByZXZpb3VzbHkgdmlzaXRlZCB0aGlzIG5laWdoYm9yLlxyXG4gICAgICAgICAgaWYgKCF2aXNpdGVkLmNvbnRhaW5zKGN1cnJlbnROZWlnaGJvcikpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRvQmVWaXNpdGVkLnB1c2goY3VycmVudE5laWdoYm9yKTtcclxuICAgICAgICAgICAgcGFyZW50cy5wdXQoY3VycmVudE5laWdoYm9yLCBjdXJyZW50Tm9kZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHByZXZpb3VzbHkgdmlzaXRlZCB0aGlzIG5laWdoYm9yIGFuZFxyXG4gICAgICAgICAgLy8gdGhpcyBuZWlnaGJvciBpcyBub3QgcGFyZW50IG9mIGN1cnJlbnROb2RlLCBnaXZlblxyXG4gICAgICAgICAgLy8gZ3JhcGggY29udGFpbnMgYSBjb21wb25lbnQgdGhhdCBpcyBub3QgdHJlZSwgaGVuY2VcclxuICAgICAgICAgIC8vIGl0IGlzIG5vdCBhIGZvcmVzdC5cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaXNGb3Jlc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlIGdyYXBoIGNvbnRhaW5zIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IGEgdHJlZS4gRW1wdHlcclxuICAgIC8vIHByZXZpb3VzbHkgZm91bmQgdHJlZXMuIFRoZSBtZXRob2Qgd2lsbCBlbmQuXHJcbiAgICBpZiAoIWlzRm9yZXN0KVxyXG4gICAge1xyXG4gICAgICBmbGF0Rm9yZXN0ID0gW107XHJcbiAgICB9XHJcbiAgICAvLyBTYXZlIGN1cnJlbnRseSB2aXNpdGVkIG5vZGVzIGFzIGEgdHJlZSBpbiBvdXIgZm9yZXN0LiBSZXNldFxyXG4gICAgLy8gdmlzaXRlZCBhbmQgcGFyZW50cyBsaXN0cy4gQ29udGludWUgd2l0aCB0aGUgbmV4dCBjb21wb25lbnQgb2ZcclxuICAgIC8vIHRoZSBncmFwaCwgaWYgYW55LlxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICB2YXIgdGVtcCA9IFtdO1xyXG4gICAgICB2aXNpdGVkLmFkZEFsbFRvKHRlbXApO1xyXG4gICAgICBmbGF0Rm9yZXN0LnB1c2godGVtcCk7XHJcbiAgICAgIC8vZmxhdEZvcmVzdCA9IGZsYXRGb3Jlc3QuY29uY2F0KHRlbXApO1xyXG4gICAgICAvL3VuUHJvY2Vzc2VkTm9kZXMucmVtb3ZlQWxsKHZpc2l0ZWQpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0ZW1wW2ldO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHVuUHJvY2Vzc2VkTm9kZXMuaW5kZXhPZih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgIHVuUHJvY2Vzc2VkTm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdmlzaXRlZCA9IG5ldyBIYXNoU2V0KCk7XHJcbiAgICAgIHBhcmVudHMgPSBuZXcgSGFzaE1hcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZsYXRGb3Jlc3Q7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBkdW1teSBub2RlcyAoYW4gbC1sZXZlbCBub2RlIHdpdGggbWluaW1hbCBkaW1lbnNpb25zKVxyXG4gKiBmb3IgdGhlIGdpdmVuIGVkZ2UgKG9uZSBwZXIgYmVuZHBvaW50KS4gVGhlIGV4aXN0aW5nIGwtbGV2ZWwgc3RydWN0dXJlXHJcbiAqIGlzIHVwZGF0ZWQgYWNjb3JkaW5nbHkuXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLmNyZWF0ZUR1bW15Tm9kZXNGb3JCZW5kcG9pbnRzID0gZnVuY3Rpb24gKGVkZ2UpXHJcbntcclxuICB2YXIgZHVtbXlOb2RlcyA9IFtdO1xyXG4gIHZhciBwcmV2ID0gZWRnZS5zb3VyY2U7XHJcblxyXG4gIHZhciBncmFwaCA9IHRoaXMuZ3JhcGhNYW5hZ2VyLmNhbGNMb3dlc3RDb21tb25BbmNlc3RvcihlZGdlLnNvdXJjZSwgZWRnZS50YXJnZXQpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVkZ2UuYmVuZHBvaW50cy5sZW5ndGg7IGkrKylcclxuICB7XHJcbiAgICAvLyBjcmVhdGUgbmV3IGR1bW15IG5vZGVcclxuICAgIHZhciBkdW1teU5vZGUgPSB0aGlzLm5ld05vZGUobnVsbCk7XHJcbiAgICBkdW1teU5vZGUuc2V0UmVjdChuZXcgUG9pbnQoMCwgMCksIG5ldyBEaW1lbnNpb24oMSwgMSkpO1xyXG5cclxuICAgIGdyYXBoLmFkZChkdW1teU5vZGUpO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBuZXcgZHVtbXkgZWRnZSBiZXR3ZWVuIHByZXYgYW5kIGR1bW15IG5vZGVcclxuICAgIHZhciBkdW1teUVkZ2UgPSB0aGlzLm5ld0VkZ2UobnVsbCk7XHJcbiAgICB0aGlzLmdyYXBoTWFuYWdlci5hZGQoZHVtbXlFZGdlLCBwcmV2LCBkdW1teU5vZGUpO1xyXG5cclxuICAgIGR1bW15Tm9kZXMuYWRkKGR1bW15Tm9kZSk7XHJcbiAgICBwcmV2ID0gZHVtbXlOb2RlO1xyXG4gIH1cclxuXHJcbiAgdmFyIGR1bW15RWRnZSA9IHRoaXMubmV3RWRnZShudWxsKTtcclxuICB0aGlzLmdyYXBoTWFuYWdlci5hZGQoZHVtbXlFZGdlLCBwcmV2LCBlZGdlLnRhcmdldCk7XHJcblxyXG4gIHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5wdXQoZWRnZSwgZHVtbXlOb2Rlcyk7XHJcblxyXG4gIC8vIHJlbW92ZSByZWFsIGVkZ2UgZnJvbSBncmFwaCBtYW5hZ2VyIGlmIGl0IGlzIGludGVyLWdyYXBoXHJcbiAgaWYgKGVkZ2UuaXNJbnRlckdyYXBoKCkpXHJcbiAge1xyXG4gICAgdGhpcy5ncmFwaE1hbmFnZXIucmVtb3ZlKGVkZ2UpO1xyXG4gIH1cclxuICAvLyBlbHNlLCByZW1vdmUgdGhlIGVkZ2UgZnJvbSB0aGUgY3VycmVudCBncmFwaFxyXG4gIGVsc2VcclxuICB7XHJcbiAgICBncmFwaC5yZW1vdmUoZWRnZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZHVtbXlOb2RlcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBjcmVhdGVzIGJlbmRwb2ludHMgZm9yIGVkZ2VzIGZyb20gdGhlIGR1bW15IG5vZGVzXHJcbiAqIGF0IGwtbGV2ZWwuXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLmNyZWF0ZUJlbmRwb2ludHNGcm9tRHVtbXlOb2RlcyA9IGZ1bmN0aW9uICgpXHJcbntcclxuICB2YXIgZWRnZXMgPSBbXTtcclxuICBlZGdlcyA9IGVkZ2VzLmNvbmNhdCh0aGlzLmdyYXBoTWFuYWdlci5nZXRBbGxFZGdlcygpKTtcclxuICBlZGdlcyA9IHRoaXMuZWRnZVRvRHVtbXlOb2Rlcy5rZXlTZXQoKS5jb25jYXQoZWRnZXMpO1xyXG5cclxuICBmb3IgKHZhciBrID0gMDsgayA8IGVkZ2VzLmxlbmd0aDsgaysrKVxyXG4gIHtcclxuICAgIHZhciBsRWRnZSA9IGVkZ2VzW2tdO1xyXG5cclxuICAgIGlmIChsRWRnZS5iZW5kcG9pbnRzLmxlbmd0aCA+IDApXHJcbiAgICB7XHJcbiAgICAgIHZhciBwYXRoID0gdGhpcy5lZGdlVG9EdW1teU5vZGVzLmdldChsRWRnZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgZHVtbXlOb2RlID0gcGF0aFtpXTtcclxuICAgICAgICB2YXIgcCA9IG5ldyBQb2ludEQoZHVtbXlOb2RlLmdldENlbnRlclgoKSxcclxuICAgICAgICAgICAgICAgIGR1bW15Tm9kZS5nZXRDZW50ZXJZKCkpO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgYmVuZHBvaW50J3MgbG9jYXRpb24gYWNjb3JkaW5nIHRvIGR1bW15IG5vZGVcclxuICAgICAgICB2YXIgZWJwID0gbEVkZ2UuYmVuZHBvaW50cy5nZXQoaSk7XHJcbiAgICAgICAgZWJwLnggPSBwLng7XHJcbiAgICAgICAgZWJwLnkgPSBwLnk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgZHVtbXkgbm9kZSwgZHVtbXkgZWRnZXMgaW5jaWRlbnQgd2l0aCB0aGlzXHJcbiAgICAgICAgLy8gZHVtbXkgbm9kZSBpcyBhbHNvIHJlbW92ZWQgKHdpdGhpbiB0aGUgcmVtb3ZlIG1ldGhvZClcclxuICAgICAgICBkdW1teU5vZGUuZ2V0T3duZXIoKS5yZW1vdmUoZHVtbXlOb2RlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYWRkIHRoZSByZWFsIGVkZ2UgdG8gZ3JhcGhcclxuICAgICAgdGhpcy5ncmFwaE1hbmFnZXIuYWRkKGxFZGdlLCBsRWRnZS5zb3VyY2UsIGxFZGdlLnRhcmdldCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTGF5b3V0LnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChzbGlkZXJWYWx1ZSwgZGVmYXVsdFZhbHVlLCBtaW5EaXYsIG1heE11bCkge1xyXG4gIGlmIChtaW5EaXYgIT0gdW5kZWZpbmVkICYmIG1heE11bCAhPSB1bmRlZmluZWQpIHtcclxuICAgIHZhciB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgICBpZiAoc2xpZGVyVmFsdWUgPD0gNTApXHJcbiAgICB7XHJcbiAgICAgIHZhciBtaW5WYWx1ZSA9IGRlZmF1bHRWYWx1ZSAvIG1pbkRpdjtcclxuICAgICAgdmFsdWUgLT0gKChkZWZhdWx0VmFsdWUgLSBtaW5WYWx1ZSkgLyA1MCkgKiAoNTAgLSBzbGlkZXJWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIHZhciBtYXhWYWx1ZSA9IGRlZmF1bHRWYWx1ZSAqIG1heE11bDtcclxuICAgICAgdmFsdWUgKz0gKChtYXhWYWx1ZSAtIGRlZmF1bHRWYWx1ZSkgLyA1MCkgKiAoc2xpZGVyVmFsdWUgLSA1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHZhciBhLCBiO1xyXG5cclxuICAgIGlmIChzbGlkZXJWYWx1ZSA8PSA1MClcclxuICAgIHtcclxuICAgICAgYSA9IDkuMCAqIGRlZmF1bHRWYWx1ZSAvIDUwMC4wO1xyXG4gICAgICBiID0gZGVmYXVsdFZhbHVlIC8gMTAuMDtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgYSA9IDkuMCAqIGRlZmF1bHRWYWx1ZSAvIDUwLjA7XHJcbiAgICAgIGIgPSAtOCAqIGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKGEgKiBzbGlkZXJWYWx1ZSArIGIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCBmaW5kcyBhbmQgcmV0dXJucyB0aGUgY2VudGVyIG9mIHRoZSBnaXZlbiBub2RlcywgYXNzdW1pbmdcclxuICogdGhhdCB0aGUgZ2l2ZW4gbm9kZXMgZm9ybSBhIHRyZWUgaW4gdGhlbXNlbHZlcy5cclxuICovXHJcbkxheW91dC5maW5kQ2VudGVyT2ZUcmVlID0gZnVuY3Rpb24gKG5vZGVzKVxyXG57XHJcbiAgdmFyIGxpc3QgPSBbXTtcclxuICBsaXN0ID0gbGlzdC5jb25jYXQobm9kZXMpO1xyXG5cclxuICB2YXIgcmVtb3ZlZE5vZGVzID0gW107XHJcbiAgdmFyIHJlbWFpbmluZ0RlZ3JlZXMgPSBuZXcgSGFzaE1hcCgpO1xyXG4gIHZhciBmb3VuZENlbnRlciA9IGZhbHNlO1xyXG4gIHZhciBjZW50ZXJOb2RlID0gbnVsbDtcclxuXHJcbiAgaWYgKGxpc3QubGVuZ3RoID09IDEgfHwgbGlzdC5sZW5ndGggPT0gMilcclxuICB7XHJcbiAgICBmb3VuZENlbnRlciA9IHRydWU7XHJcbiAgICBjZW50ZXJOb2RlID0gbGlzdFswXTtcclxuICB9XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKylcclxuICB7XHJcbiAgICB2YXIgbm9kZSA9IGxpc3RbaV07XHJcbiAgICB2YXIgZGVncmVlID0gbm9kZS5nZXROZWlnaGJvcnNMaXN0KCkuc2l6ZSgpO1xyXG4gICAgcmVtYWluaW5nRGVncmVlcy5wdXQobm9kZSwgbm9kZS5nZXROZWlnaGJvcnNMaXN0KCkuc2l6ZSgpKTtcclxuXHJcbiAgICBpZiAoZGVncmVlID09IDEpXHJcbiAgICB7XHJcbiAgICAgIHJlbW92ZWROb2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHRlbXBMaXN0ID0gW107XHJcbiAgdGVtcExpc3QgPSB0ZW1wTGlzdC5jb25jYXQocmVtb3ZlZE5vZGVzKTtcclxuXHJcbiAgd2hpbGUgKCFmb3VuZENlbnRlcilcclxuICB7XHJcbiAgICB2YXIgdGVtcExpc3QyID0gW107XHJcbiAgICB0ZW1wTGlzdDIgPSB0ZW1wTGlzdDIuY29uY2F0KHRlbXBMaXN0KTtcclxuICAgIHRlbXBMaXN0ID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKVxyXG4gICAge1xyXG4gICAgICB2YXIgbm9kZSA9IGxpc3RbaV07XHJcblxyXG4gICAgICB2YXIgaW5kZXggPSBsaXN0LmluZGV4T2Yobm9kZSk7XHJcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgbmVpZ2hib3VycyA9IG5vZGUuZ2V0TmVpZ2hib3JzTGlzdCgpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaiBpbiBuZWlnaGJvdXJzLnNldClcclxuICAgICAge1xyXG4gICAgICAgIHZhciBuZWlnaGJvdXIgPSBuZWlnaGJvdXJzLnNldFtqXTtcclxuICAgICAgICBpZiAocmVtb3ZlZE5vZGVzLmluZGV4T2YobmVpZ2hib3VyKSA8IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIG90aGVyRGVncmVlID0gcmVtYWluaW5nRGVncmVlcy5nZXQobmVpZ2hib3VyKTtcclxuICAgICAgICAgIHZhciBuZXdEZWdyZWUgPSBvdGhlckRlZ3JlZSAtIDE7XHJcblxyXG4gICAgICAgICAgaWYgKG5ld0RlZ3JlZSA9PSAxKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZW1wTGlzdC5wdXNoKG5laWdoYm91cik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmVtYWluaW5nRGVncmVlcy5wdXQobmVpZ2hib3VyLCBuZXdEZWdyZWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZWROb2RlcyA9IHJlbW92ZWROb2Rlcy5jb25jYXQodGVtcExpc3QpO1xyXG5cclxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAxIHx8IGxpc3QubGVuZ3RoID09IDIpXHJcbiAgICB7XHJcbiAgICAgIGZvdW5kQ2VudGVyID0gdHJ1ZTtcclxuICAgICAgY2VudGVyTm9kZSA9IGxpc3RbMF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gY2VudGVyTm9kZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEdXJpbmcgdGhlIGNvYXJzZW5pbmcgcHJvY2VzcywgdGhpcyBsYXlvdXQgbWF5IGJlIHJlZmVyZW5jZWQgYnkgdHdvIGdyYXBoIG1hbmFnZXJzXHJcbiAqIHRoaXMgc2V0dGVyIGZ1bmN0aW9uIGdyYW50cyBhY2Nlc3MgdG8gY2hhbmdlIHRoZSBjdXJyZW50bHkgYmVpbmcgdXNlZCBncmFwaCBtYW5hZ2VyXHJcbiAqL1xyXG5MYXlvdXQucHJvdG90eXBlLnNldEdyYXBoTWFuYWdlciA9IGZ1bmN0aW9uIChnbSlcclxue1xyXG4gIHRoaXMuZ3JhcGhNYW5hZ2VyID0gZ207XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDtcclxuIiwiZnVuY3Rpb24gTGF5b3V0Q29uc3RhbnRzKCkge1xyXG59XHJcblxyXG4vKipcclxuICogTGF5b3V0IFF1YWxpdHlcclxuICovXHJcbkxheW91dENvbnN0YW50cy5QUk9PRl9RVUFMSVRZID0gMDtcclxuTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfUVVBTElUWSA9IDE7XHJcbkxheW91dENvbnN0YW50cy5EUkFGVF9RVUFMSVRZID0gMjtcclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IHBhcmFtZXRlcnNcclxuICovXHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0NSRUFURV9CRU5EU19BU19ORUVERUQgPSBmYWxzZTtcclxuLy9MYXlvdXRDb25zdGFudHMuREVGQVVMVF9JTkNSRU1FTlRBTCA9IHRydWU7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gZmFsc2U7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX0FOSU1BVElPTl9PTl9MQVlPVVQgPSB0cnVlO1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fRFVSSU5HX0xBWU9VVCA9IGZhbHNlO1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9BTklNQVRJT05fUEVSSU9EID0gNTA7XHJcbkxheW91dENvbnN0YW50cy5ERUZBVUxUX1VOSUZPUk1fTEVBRl9OT0RFX1NJWkVTID0gZmFsc2U7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBTZWN0aW9uOiBHZW5lcmFsIG90aGVyIGNvbnN0YW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vKlxyXG4gKiBNYXJnaW5zIG9mIGEgZ3JhcGggdG8gYmUgYXBwbGllZCBvbiBib3VkaW5nIHJlY3RhbmdsZSBvZiBpdHMgY29udGVudHMuIFdlXHJcbiAqIGFzc3VtZSBtYXJnaW5zIG9uIGFsbCBmb3VyIHNpZGVzIHRvIGJlIHVuaWZvcm0uXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFQSF9NQVJHSU4gPSAxNTtcclxuXHJcbi8qXHJcbiAqIERlZmF1bHQgZGltZW5zaW9uIG9mIGEgbm9uLWNvbXBvdW5kIG5vZGUuXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRSA9IDQwO1xyXG5cclxuLypcclxuICogRGVmYXVsdCBkaW1lbnNpb24gb2YgYSBub24tY29tcG91bmQgbm9kZS5cclxuICovXHJcbkxheW91dENvbnN0YW50cy5TSU1QTEVfTk9ERV9IQUxGX1NJWkUgPSBMYXlvdXRDb25zdGFudHMuU0lNUExFX05PREVfU0laRSAvIDI7XHJcblxyXG4vKlxyXG4gKiBFbXB0eSBjb21wb3VuZCBub2RlIHNpemUuIFdoZW4gYSBjb21wb3VuZCBub2RlIGlzIGVtcHR5LCBpdHMgYm90aFxyXG4gKiBkaW1lbnNpb25zIHNob3VsZCBiZSBvZiB0aGlzIHZhbHVlLlxyXG4gKi9cclxuTGF5b3V0Q29uc3RhbnRzLkVNUFRZX0NPTVBPVU5EX05PREVfU0laRSA9IDQwO1xyXG5cclxuLypcclxuICogTWluaW11bSBsZW5ndGggdGhhdCBhbiBlZGdlIHNob3VsZCB0YWtlIGR1cmluZyBsYXlvdXRcclxuICovXHJcbkxheW91dENvbnN0YW50cy5NSU5fRURHRV9MRU5HVEggPSAxO1xyXG5cclxuLypcclxuICogV29ybGQgYm91bmRhcmllcyB0aGF0IGxheW91dCBvcGVyYXRlcyBvblxyXG4gKi9cclxuTGF5b3V0Q29uc3RhbnRzLldPUkxEX0JPVU5EQVJZID0gMTAwMDAwMDtcclxuXHJcbi8qXHJcbiAqIFdvcmxkIGJvdW5kYXJpZXMgdGhhdCByYW5kb20gcG9zaXRpb25pbmcgY2FuIGJlIHBlcmZvcm1lZCB3aXRoXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuSU5JVElBTF9XT1JMRF9CT1VOREFSWSA9IExheW91dENvbnN0YW50cy5XT1JMRF9CT1VOREFSWSAvIDEwMDA7XHJcblxyXG4vKlxyXG4gKiBDb29yZGluYXRlcyBvZiB0aGUgd29ybGQgY2VudGVyXHJcbiAqL1xyXG5MYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1ggPSAxMjAwO1xyXG5MYXlvdXRDb25zdGFudHMuV09STERfQ0VOVEVSX1kgPSA5MDA7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dENvbnN0YW50cztcclxuIiwiLypcclxuICpUaGlzIGNsYXNzIGlzIHRoZSBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBQb2ludC5qYXZhIGNsYXNzIGluIGpka1xyXG4gKi9cclxuZnVuY3Rpb24gUG9pbnQoeCwgeSwgcCkge1xyXG4gIHRoaXMueCA9IG51bGw7XHJcbiAgdGhpcy55ID0gbnVsbDtcclxuICBpZiAoeCA9PSBudWxsICYmIHkgPT0gbnVsbCAmJiBwID09IG51bGwpIHtcclxuICAgIHRoaXMueCA9IDA7XHJcbiAgICB0aGlzLnkgPSAwO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlb2YgeCA9PSAnbnVtYmVyJyAmJiB0eXBlb2YgeSA9PSAnbnVtYmVyJyAmJiBwID09IG51bGwpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gIH1cclxuICBlbHNlIGlmICh4LmNvbnN0cnVjdG9yLm5hbWUgPT0gJ1BvaW50JyAmJiB5ID09IG51bGwgJiYgcCA9PSBudWxsKSB7XHJcbiAgICBwID0geDtcclxuICAgIHRoaXMueCA9IHAueDtcclxuICAgIHRoaXMueSA9IHAueTtcclxuICB9XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLng7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLnk7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcclxufVxyXG5cclxuUG9pbnQucHJvdG90eXBlLnNldExvY2F0aW9uID0gZnVuY3Rpb24gKHgsIHksIHApIHtcclxuICBpZiAoeC5jb25zdHJ1Y3Rvci5uYW1lID09ICdQb2ludCcgJiYgeSA9PSBudWxsICYmIHAgPT0gbnVsbCkge1xyXG4gICAgcCA9IHg7XHJcbiAgICB0aGlzLnNldExvY2F0aW9uKHAueCwgcC55KTtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZW9mIHggPT0gJ251bWJlcicgJiYgdHlwZW9mIHkgPT0gJ251bWJlcicgJiYgcCA9PSBudWxsKSB7XHJcbiAgICAvL2lmIGJvdGggcGFyYW1ldGVycyBhcmUgaW50ZWdlciBqdXN0IG1vdmUgKHgseSkgbG9jYXRpb25cclxuICAgIGlmIChwYXJzZUludCh4KSA9PSB4ICYmIHBhcnNlSW50KHkpID09IHkpIHtcclxuICAgICAgdGhpcy5tb3ZlKHgsIHkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoeCArIDAuNSk7XHJcbiAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoeSArIDAuNSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgdGhpcy54ID0geDtcclxuICB0aGlzLnkgPSB5O1xyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGR4LCBkeSkge1xyXG4gIHRoaXMueCArPSBkeDtcclxuICB0aGlzLnkgKz0gZHk7XHJcbn1cclxuXHJcblBvaW50LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgaWYgKG9iai5jb25zdHJ1Y3Rvci5uYW1lID09IFwiUG9pbnRcIikge1xyXG4gICAgdmFyIHB0ID0gb2JqO1xyXG4gICAgcmV0dXJuICh0aGlzLnggPT0gcHQueCkgJiYgKHRoaXMueSA9PSBwdC55KTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMgPT0gb2JqO1xyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIG5ldyBQb2ludCgpLmNvbnN0cnVjdG9yLm5hbWUgKyBcIlt4PVwiICsgdGhpcy54ICsgXCIseT1cIiArIHRoaXMueSArIFwiXVwiO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xyXG4iLCJmdW5jdGlvbiBQb2ludEQoeCwgeSkge1xyXG4gIGlmICh4ID09IG51bGwgJiYgeSA9PSBudWxsKSB7XHJcbiAgICB0aGlzLnggPSAwO1xyXG4gICAgdGhpcy55ID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy54ID0geDtcclxuICAgIHRoaXMueSA9IHk7XHJcbiAgfVxyXG59XHJcblxyXG5Qb2ludEQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueDtcclxufTtcclxuXHJcblBvaW50RC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy55O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB0aGlzLnggPSB4O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5zZXRZID0gZnVuY3Rpb24gKHkpXHJcbntcclxuICB0aGlzLnkgPSB5O1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5nZXREaWZmZXJlbmNlID0gZnVuY3Rpb24gKHB0KVxyXG57XHJcbiAgcmV0dXJuIG5ldyBEaW1lbnNpb25EKHRoaXMueCAtIHB0LngsIHRoaXMueSAtIHB0LnkpO1xyXG59O1xyXG5cclxuUG9pbnRELnByb3RvdHlwZS5nZXRDb3B5ID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiBuZXcgUG9pbnREKHRoaXMueCwgdGhpcy55KTtcclxufTtcclxuXHJcblBvaW50RC5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKGRpbSlcclxue1xyXG4gIHRoaXMueCArPSBkaW0ud2lkdGg7XHJcbiAgdGhpcy55ICs9IGRpbS5oZWlnaHQ7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50RDtcclxuIiwiZnVuY3Rpb24gUmFuZG9tU2VlZCgpIHtcclxufVxyXG5SYW5kb21TZWVkLnNlZWQgPSAxO1xyXG5SYW5kb21TZWVkLnggPSAwO1xyXG5cclxuUmFuZG9tU2VlZC5uZXh0RG91YmxlID0gZnVuY3Rpb24gKCkge1xyXG4gIFJhbmRvbVNlZWQueCA9IE1hdGguc2luKFJhbmRvbVNlZWQuc2VlZCsrKSAqIDEwMDAwO1xyXG4gIHJldHVybiBSYW5kb21TZWVkLnggLSBNYXRoLmZsb29yKFJhbmRvbVNlZWQueCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbVNlZWQ7XHJcbiIsImZ1bmN0aW9uIFJlY3RhbmdsZUQoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG4gIHRoaXMueCA9IDA7XHJcbiAgdGhpcy55ID0gMDtcclxuICB0aGlzLndpZHRoID0gMDtcclxuICB0aGlzLmhlaWdodCA9IDA7XHJcblxyXG4gIGlmICh4ICE9IG51bGwgJiYgeSAhPSBudWxsICYmIHdpZHRoICE9IG51bGwgJiYgaGVpZ2h0ICE9IG51bGwpIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgfVxyXG59XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLng7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5zZXRYID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB0aGlzLnggPSB4O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy55O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0WSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdGhpcy55ID0geTtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLndpZHRoO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0V2lkdGggPSBmdW5jdGlvbiAod2lkdGgpXHJcbntcclxuICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKGhlaWdodClcclxue1xyXG4gIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRCb3R0b20gPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0O1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIChhKVxyXG57XHJcbiAgaWYgKHRoaXMuZ2V0UmlnaHQoKSA8IGEueClcclxuICB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAodGhpcy5nZXRCb3R0b20oKSA8IGEueSlcclxuICB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoYS5nZXRSaWdodCgpIDwgdGhpcy54KVxyXG4gIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmIChhLmdldEJvdHRvbSgpIDwgdGhpcy55KVxyXG4gIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0cnVlO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0Q2VudGVyWCA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCAvIDI7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRNaW5YID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmdldFgoKTtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1heFggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ2V0WCgpICsgdGhpcy53aWR0aDtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldENlbnRlclkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldE1pblkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMuZ2V0WSgpO1xyXG59O1xyXG5cclxuUmVjdGFuZ2xlRC5wcm90b3R5cGUuZ2V0TWF4WSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5nZXRZKCkgKyB0aGlzLmhlaWdodDtcclxufTtcclxuXHJcblJlY3RhbmdsZUQucHJvdG90eXBlLmdldFdpZHRoSGFsZiA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbn07XHJcblxyXG5SZWN0YW5nbGVELnByb3RvdHlwZS5nZXRIZWlnaHRIYWxmID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmhlaWdodCAvIDI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZUQ7XHJcbiIsInZhciBQb2ludEQgPSByZXF1aXJlKCcuL1BvaW50RCcpO1xyXG5cclxuZnVuY3Rpb24gVHJhbnNmb3JtKHgsIHkpIHtcclxuICB0aGlzLmx3b3JsZE9yZ1ggPSAwLjA7XHJcbiAgdGhpcy5sd29ybGRPcmdZID0gMC4wO1xyXG4gIHRoaXMubGRldmljZU9yZ1ggPSAwLjA7XHJcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IDAuMDtcclxuICB0aGlzLmx3b3JsZEV4dFggPSAxLjA7XHJcbiAgdGhpcy5sd29ybGRFeHRZID0gMS4wO1xyXG4gIHRoaXMubGRldmljZUV4dFggPSAxLjA7XHJcbiAgdGhpcy5sZGV2aWNlRXh0WSA9IDEuMDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubHdvcmxkT3JnWDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZE9yZ1ggPSBmdW5jdGlvbiAod294KVxyXG57XHJcbiAgdGhpcy5sd29ybGRPcmdYID0gd294O1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmdldFdvcmxkT3JnWSA9IGZ1bmN0aW9uICgpXHJcbntcclxuICByZXR1cm4gdGhpcy5sd29ybGRPcmdZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldFdvcmxkT3JnWSA9IGZ1bmN0aW9uICh3b3kpXHJcbntcclxuICB0aGlzLmx3b3JsZE9yZ1kgPSB3b3k7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuZ2V0V29ybGRFeHRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmx3b3JsZEV4dFg7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuc2V0V29ybGRFeHRYID0gZnVuY3Rpb24gKHdleClcclxue1xyXG4gIHRoaXMubHdvcmxkRXh0WCA9IHdleDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAoKVxyXG57XHJcbiAgcmV0dXJuIHRoaXMubHdvcmxkRXh0WTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5zZXRXb3JsZEV4dFkgPSBmdW5jdGlvbiAod2V5KVxyXG57XHJcbiAgdGhpcy5sd29ybGRFeHRZID0gd2V5O1xyXG59XHJcblxyXG4vKiBEZXZpY2UgcmVsYXRlZCAqL1xyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VPcmdYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdYO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1ggPSBmdW5jdGlvbiAoZG94KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlT3JnWCA9IGRveDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VPcmdZID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VPcmdZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZU9yZ1kgPSBmdW5jdGlvbiAoZG95KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlT3JnWSA9IGRveTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRYID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VFeHRYO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZUV4dFggPSBmdW5jdGlvbiAoZGV4KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlRXh0WCA9IGRleDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5nZXREZXZpY2VFeHRZID0gZnVuY3Rpb24gKClcclxue1xyXG4gIHJldHVybiB0aGlzLmxkZXZpY2VFeHRZO1xyXG59XHJcblxyXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldERldmljZUV4dFkgPSBmdW5jdGlvbiAoZGV5KVxyXG57XHJcbiAgdGhpcy5sZGV2aWNlRXh0WSA9IGRleTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS50cmFuc2Zvcm1YID0gZnVuY3Rpb24gKHgpXHJcbntcclxuICB2YXIgeERldmljZSA9IDAuMDtcclxuICB2YXIgd29ybGRFeHRYID0gdGhpcy5sd29ybGRFeHRYO1xyXG4gIGlmICh3b3JsZEV4dFggIT0gMC4wKVxyXG4gIHtcclxuICAgIHhEZXZpY2UgPSB0aGlzLmxkZXZpY2VPcmdYICtcclxuICAgICAgICAgICAgKCh4IC0gdGhpcy5sd29ybGRPcmdYKSAqIHRoaXMubGRldmljZUV4dFggLyB3b3JsZEV4dFgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHhEZXZpY2U7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUudHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdmFyIHlEZXZpY2UgPSAwLjA7XHJcbiAgdmFyIHdvcmxkRXh0WSA9IHRoaXMubHdvcmxkRXh0WTtcclxuICBpZiAod29ybGRFeHRZICE9IDAuMClcclxuICB7XHJcbiAgICB5RGV2aWNlID0gdGhpcy5sZGV2aWNlT3JnWSArXHJcbiAgICAgICAgICAgICgoeSAtIHRoaXMubHdvcmxkT3JnWSkgKiB0aGlzLmxkZXZpY2VFeHRZIC8gd29ybGRFeHRZKTtcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4geURldmljZTtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlVHJhbnNmb3JtWCA9IGZ1bmN0aW9uICh4KVxyXG57XHJcbiAgdmFyIHhXb3JsZCA9IDAuMDtcclxuICB2YXIgZGV2aWNlRXh0WCA9IHRoaXMubGRldmljZUV4dFg7XHJcbiAgaWYgKGRldmljZUV4dFggIT0gMC4wKVxyXG4gIHtcclxuICAgIHhXb3JsZCA9IHRoaXMubHdvcmxkT3JnWCArXHJcbiAgICAgICAgICAgICgoeCAtIHRoaXMubGRldmljZU9yZ1gpICogdGhpcy5sd29ybGRFeHRYIC8gZGV2aWNlRXh0WCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcmV0dXJuIHhXb3JsZDtcclxufVxyXG5cclxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnZlcnNlVHJhbnNmb3JtWSA9IGZ1bmN0aW9uICh5KVxyXG57XHJcbiAgdmFyIHlXb3JsZCA9IDAuMDtcclxuICB2YXIgZGV2aWNlRXh0WSA9IHRoaXMubGRldmljZUV4dFk7XHJcbiAgaWYgKGRldmljZUV4dFkgIT0gMC4wKVxyXG4gIHtcclxuICAgIHlXb3JsZCA9IHRoaXMubHdvcmxkT3JnWSArXHJcbiAgICAgICAgICAgICgoeSAtIHRoaXMubGRldmljZU9yZ1kpICogdGhpcy5sd29ybGRFeHRZIC8gZGV2aWNlRXh0WSk7XHJcbiAgfVxyXG4gIHJldHVybiB5V29ybGQ7XHJcbn1cclxuXHJcblRyYW5zZm9ybS5wcm90b3R5cGUuaW52ZXJzZVRyYW5zZm9ybVBvaW50ID0gZnVuY3Rpb24gKGluUG9pbnQpXHJcbntcclxuICB2YXIgb3V0UG9pbnQgPVxyXG4gICAgICAgICAgbmV3IFBvaW50RCh0aGlzLmludmVyc2VUcmFuc2Zvcm1YKGluUG9pbnQueCksXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW52ZXJzZVRyYW5zZm9ybVkoaW5Qb2ludC55KSk7XHJcbiAgcmV0dXJuIG91dFBvaW50O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcclxuIiwiZnVuY3Rpb24gVW5pcXVlSURHZW5lcmV0b3IoKSB7XHJcbn1cclxuXHJcblVuaXF1ZUlER2VuZXJldG9yLmxhc3RJRCA9IDA7XHJcblxyXG5VbmlxdWVJREdlbmVyZXRvci5jcmVhdGVJRCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICBpZiAoVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUob2JqKSkge1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgaWYgKG9iai51bmlxdWVJRCAhPSBudWxsKSB7XHJcbiAgICByZXR1cm4gb2JqLnVuaXF1ZUlEO1xyXG4gIH1cclxuICBvYmoudW5pcXVlSUQgPSBVbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcoKTtcclxuICBVbmlxdWVJREdlbmVyZXRvci5sYXN0SUQrKztcclxuICByZXR1cm4gb2JqLnVuaXF1ZUlEO1xyXG59XHJcblxyXG5VbmlxdWVJREdlbmVyZXRvci5nZXRTdHJpbmcgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBpZiAoaWQgPT0gbnVsbClcclxuICAgIGlkID0gVW5pcXVlSURHZW5lcmV0b3IubGFzdElEO1xyXG4gIHJldHVybiBcIk9iamVjdCNcIiArIGlkICsgXCJcIjtcclxufVxyXG5cclxuVW5pcXVlSURHZW5lcmV0b3IuaXNQcmltaXRpdmUgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2YgYXJnO1xyXG4gIHJldHVybiBhcmcgPT0gbnVsbCB8fCAodHlwZSAhPSBcIm9iamVjdFwiICYmIHR5cGUgIT0gXCJmdW5jdGlvblwiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVbmlxdWVJREdlbmVyZXRvcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIERpbWVuc2lvbkQgPSByZXF1aXJlKCcuL0RpbWVuc2lvbkQnKTtcclxudmFyIEhhc2hNYXAgPSByZXF1aXJlKCcuL0hhc2hNYXAnKTtcclxudmFyIEhhc2hTZXQgPSByZXF1aXJlKCcuL0hhc2hTZXQnKTtcclxudmFyIElHZW9tZXRyeSA9IHJlcXVpcmUoJy4vSUdlb21ldHJ5Jyk7XHJcbnZhciBJTWF0aCA9IHJlcXVpcmUoJy4vSU1hdGgnKTtcclxudmFyIEludGVnZXIgPSByZXF1aXJlKCcuL0ludGVnZXInKTtcclxudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9Qb2ludCcpO1xyXG52YXIgUG9pbnREID0gcmVxdWlyZSgnLi9Qb2ludEQnKTtcclxudmFyIFJhbmRvbVNlZWQgPSByZXF1aXJlKCcuL1JhbmRvbVNlZWQnKTtcclxudmFyIFJlY3RhbmdsZUQgPSByZXF1aXJlKCcuL1JlY3RhbmdsZUQnKTtcclxudmFyIFRyYW5zZm9ybSA9IHJlcXVpcmUoJy4vVHJhbnNmb3JtJyk7XHJcbnZhciBVbmlxdWVJREdlbmVyZXRvciA9IHJlcXVpcmUoJy4vVW5pcXVlSURHZW5lcmV0b3InKTtcclxudmFyIExHcmFwaE9iamVjdCA9IHJlcXVpcmUoJy4vTEdyYXBoT2JqZWN0Jyk7XHJcbnZhciBMR3JhcGggPSByZXF1aXJlKCcuL0xHcmFwaCcpO1xyXG52YXIgTEVkZ2UgPSByZXF1aXJlKCcuL0xFZGdlJyk7XHJcbnZhciBMR3JhcGhNYW5hZ2VyID0gcmVxdWlyZSgnLi9MR3JhcGhNYW5hZ2VyJyk7XHJcbnZhciBMTm9kZSA9IHJlcXVpcmUoJy4vTE5vZGUnKTtcclxudmFyIExheW91dCA9IHJlcXVpcmUoJy4vTGF5b3V0Jyk7XHJcbnZhciBMYXlvdXRDb25zdGFudHMgPSByZXF1aXJlKCcuL0xheW91dENvbnN0YW50cycpO1xyXG52YXIgRkRMYXlvdXQgPSByZXF1aXJlKCcuL0ZETGF5b3V0Jyk7XHJcbnZhciBGRExheW91dENvbnN0YW50cyA9IHJlcXVpcmUoJy4vRkRMYXlvdXRDb25zdGFudHMnKTtcclxudmFyIEZETGF5b3V0RWRnZSA9IHJlcXVpcmUoJy4vRkRMYXlvdXRFZGdlJyk7XHJcbnZhciBGRExheW91dE5vZGUgPSByZXF1aXJlKCcuL0ZETGF5b3V0Tm9kZScpO1xyXG52YXIgQ29TRUNvbnN0YW50cyA9IHJlcXVpcmUoJy4vQ29TRUNvbnN0YW50cycpO1xyXG52YXIgQ29TRUVkZ2UgPSByZXF1aXJlKCcuL0NvU0VFZGdlJyk7XHJcbnZhciBDb1NFR3JhcGggPSByZXF1aXJlKCcuL0NvU0VHcmFwaCcpO1xyXG52YXIgQ29TRUdyYXBoTWFuYWdlciA9IHJlcXVpcmUoJy4vQ29TRUdyYXBoTWFuYWdlcicpO1xyXG52YXIgQ29TRUxheW91dCA9IHJlcXVpcmUoJy4vQ29TRUxheW91dCcpO1xyXG52YXIgQ29TRU5vZGUgPSByZXF1aXJlKCcuL0NvU0VOb2RlJyk7XHJcblxyXG52YXIgZGVmYXVsdHMgPSB7XHJcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRyZWFkeWBcclxuICByZWFkeTogZnVuY3Rpb24gKCkge1xyXG4gIH0sXHJcbiAgLy8gQ2FsbGVkIG9uIGBsYXlvdXRzdG9wYFxyXG4gIHN0b3A6IGZ1bmN0aW9uICgpIHtcclxuICB9LFxyXG4gIC8vIG51bWJlciBvZiB0aWNrcyBwZXIgZnJhbWU7IGhpZ2hlciBpcyBmYXN0ZXIgYnV0IG1vcmUgamVya3lcclxuICByZWZyZXNoOiAzMCxcclxuICAvLyBXaGV0aGVyIHRvIGZpdCB0aGUgbmV0d29yayB2aWV3IGFmdGVyIHdoZW4gZG9uZVxyXG4gIGZpdDogdHJ1ZSxcclxuICAvLyBQYWRkaW5nIG9uIGZpdFxyXG4gIHBhZGRpbmc6IDEwLFxyXG4gIC8vIFBhZGRpbmcgZm9yIGNvbXBvdW5kc1xyXG4gIHBhZGRpbmdDb21wb3VuZDogMTUsXHJcbiAgLy8gV2hldGhlciB0byBlbmFibGUgaW5jcmVtZW50YWwgbW9kZVxyXG4gIHJhbmRvbWl6ZTogdHJ1ZSxcclxuICAvLyBOb2RlIHJlcHVsc2lvbiAobm9uIG92ZXJsYXBwaW5nKSBtdWx0aXBsaWVyXHJcbiAgbm9kZVJlcHVsc2lvbjogNDUwMCxcclxuICAvLyBJZGVhbCBlZGdlIChub24gbmVzdGVkKSBsZW5ndGhcclxuICBpZGVhbEVkZ2VMZW5ndGg6IDUwLFxyXG4gIC8vIERpdmlzb3IgdG8gY29tcHV0ZSBlZGdlIGZvcmNlc1xyXG4gIGVkZ2VFbGFzdGljaXR5OiAwLjQ1LFxyXG4gIC8vIE5lc3RpbmcgZmFjdG9yIChtdWx0aXBsaWVyKSB0byBjb21wdXRlIGlkZWFsIGVkZ2UgbGVuZ3RoIGZvciBuZXN0ZWQgZWRnZXNcclxuICBuZXN0aW5nRmFjdG9yOiAwLjEsXHJcbiAgLy8gR3Jhdml0eSBmb3JjZSAoY29uc3RhbnQpXHJcbiAgZ3Jhdml0eTogMC4yNSxcclxuICAvLyBNYXhpbXVtIG51bWJlciBvZiBpdGVyYXRpb25zIHRvIHBlcmZvcm1cclxuICBudW1JdGVyOiAyNTAwLFxyXG4gIC8vIEZvciBlbmFibGluZyB0aWxpbmdcclxuICB0aWxlOiB0cnVlLFxyXG4gIC8vIFR5cGUgb2YgbGF5b3V0IGFuaW1hdGlvbi4gVGhlIG9wdGlvbiBzZXQgaXMgeydkdXJpbmcnLCAnZW5kJywgZmFsc2V9XHJcbiAgYW5pbWF0ZTogJ2VuZCcsXHJcbiAgLy8gRHVyYXRpb24gZm9yIGFuaW1hdGU6ZW5kXHJcbiAgYW5pbWF0aW9uRHVyYXRpb246IDUwMCxcclxuICAvLyBSZXByZXNlbnRzIHRoZSBhbW91bnQgb2YgdGhlIHZlcnRpY2FsIHNwYWNlIHRvIHB1dCBiZXR3ZWVuIHRoZSB6ZXJvIGRlZ3JlZSBtZW1iZXJzIGR1cmluZyB0aGUgdGlsaW5nIG9wZXJhdGlvbihjYW4gYWxzbyBiZSBhIGZ1bmN0aW9uKVxyXG4gIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogMTAsXHJcbiAgLy8gUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHRoZSBob3Jpem9udGFsIHNwYWNlIHRvIHB1dCBiZXR3ZWVuIHRoZSB6ZXJvIGRlZ3JlZSBtZW1iZXJzIGR1cmluZyB0aGUgdGlsaW5nIG9wZXJhdGlvbihjYW4gYWxzbyBiZSBhIGZ1bmN0aW9uKVxyXG4gIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiAxMCxcclxuICAvLyBHcmF2aXR5IHJhbmdlIChjb25zdGFudCkgZm9yIGNvbXBvdW5kc1xyXG4gIGdyYXZpdHlSYW5nZUNvbXBvdW5kOiAxLjUsXHJcbiAgLy8gR3Jhdml0eSBmb3JjZSAoY29uc3RhbnQpIGZvciBjb21wb3VuZHNcclxuICBncmF2aXR5Q29tcG91bmQ6IDEuMCxcclxuICAvLyBHcmF2aXR5IHJhbmdlIChjb25zdGFudClcclxuICBncmF2aXR5UmFuZ2U6IDMuOFxyXG59O1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKSB7XHJcbiAgdmFyIG9iaiA9IHt9O1xyXG5cclxuICBmb3IgKHZhciBpIGluIGRlZmF1bHRzKSB7XHJcbiAgICBvYmpbaV0gPSBkZWZhdWx0c1tpXTtcclxuICB9XHJcblxyXG4gIGZvciAodmFyIGkgaW4gb3B0aW9ucykge1xyXG4gICAgb2JqW2ldID0gb3B0aW9uc1tpXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfQ29TRUxheW91dChfb3B0aW9ucykge1xyXG4vLyAgVGlsaW5nRXh0ZW5zaW9uKHRoaXMpOyAvLyBFeHRlbmQgdGhpcyBpbnN0YW5jZSB3aXRoIHRpbGluZyBmdW5jdGlvbnNcclxuICB0aGlzLm9wdGlvbnMgPSBleHRlbmQoZGVmYXVsdHMsIF9vcHRpb25zKTtcclxuICBnZXRVc2VyT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xyXG59XHJcblxyXG52YXIgZ2V0VXNlck9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIGlmIChvcHRpb25zLm5vZGVSZXB1bHNpb24gIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9SRVBVTFNJT05fU1RSRU5HVEggPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX1JFUFVMU0lPTl9TVFJFTkdUSCA9IG9wdGlvbnMubm9kZVJlcHVsc2lvbjtcclxuICBpZiAob3B0aW9ucy5pZGVhbEVkZ2VMZW5ndGggIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9FREdFX0xFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfRURHRV9MRU5HVEggPSBvcHRpb25zLmlkZWFsRWRnZUxlbmd0aDtcclxuICBpZiAob3B0aW9ucy5lZGdlRWxhc3RpY2l0eSAhPSBudWxsKVxyXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX1NQUklOR19TVFJFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfU1BSSU5HX1NUUkVOR1RIID0gb3B0aW9ucy5lZGdlRWxhc3RpY2l0eTtcclxuICBpZiAob3B0aW9ucy5uZXN0aW5nRmFjdG9yICE9IG51bGwpXHJcbiAgICBDb1NFQ29uc3RhbnRzLlBFUl9MRVZFTF9JREVBTF9FREdFX0xFTkdUSF9GQUNUT1IgPSBGRExheW91dENvbnN0YW50cy5QRVJfTEVWRUxfSURFQUxfRURHRV9MRU5HVEhfRkFDVE9SID0gb3B0aW9ucy5uZXN0aW5nRmFjdG9yO1xyXG4gIGlmIChvcHRpb25zLmdyYXZpdHkgIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1NUUkVOR1RIID0gb3B0aW9ucy5ncmF2aXR5O1xyXG4gIGlmIChvcHRpb25zLm51bUl0ZXIgIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuTUFYX0lURVJBVElPTlMgPSBGRExheW91dENvbnN0YW50cy5NQVhfSVRFUkFUSU9OUyA9IG9wdGlvbnMubnVtSXRlcjtcclxuICBpZiAob3B0aW9ucy5wYWRkaW5nQ29tcG91bmQgIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9HUkFQSF9NQVJHSU4gPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVBIX01BUkdJTiA9IExheW91dENvbnN0YW50cy5ERUZBVUxUX0dSQVBIX01BUkdJTiA9IG9wdGlvbnMucGFkZGluZ0NvbXBvdW5kO1xyXG4gIGlmIChvcHRpb25zLmdyYXZpdHlSYW5nZSAhPSBudWxsKVxyXG4gICAgQ29TRUNvbnN0YW50cy5ERUZBVUxUX0dSQVZJVFlfUkFOR0VfRkFDVE9SID0gRkRMYXlvdXRDb25zdGFudHMuREVGQVVMVF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IG9wdGlvbnMuZ3Jhdml0eVJhbmdlO1xyXG4gIGlmKG9wdGlvbnMuZ3Jhdml0eUNvbXBvdW5kICE9IG51bGwpXHJcbiAgICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9TVFJFTkdUSCA9IG9wdGlvbnMuZ3Jhdml0eUNvbXBvdW5kO1xyXG4gIGlmKG9wdGlvbnMuZ3Jhdml0eVJhbmdlQ29tcG91bmQgIT0gbnVsbClcclxuICAgIENvU0VDb25zdGFudHMuREVGQVVMVF9DT01QT1VORF9HUkFWSVRZX1JBTkdFX0ZBQ1RPUiA9IEZETGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfQ09NUE9VTkRfR1JBVklUWV9SQU5HRV9GQUNUT1IgPSBvcHRpb25zLmdyYXZpdHlSYW5nZUNvbXBvdW5kO1xyXG5cclxuICBDb1NFQ29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPSBGRExheW91dENvbnN0YW50cy5ERUZBVUxUX0lOQ1JFTUVOVEFMID0gTGF5b3V0Q29uc3RhbnRzLkRFRkFVTFRfSU5DUkVNRU5UQUwgPVxyXG4gICAgICAgICAgIShvcHRpb25zLnJhbmRvbWl6ZSk7XHJcbiAgQ29TRUNvbnN0YW50cy5BTklNQVRFID0gRkRMYXlvdXRDb25zdGFudHMuQU5JTUFURSA9IG9wdGlvbnMuYW5pbWF0ZTtcclxufTtcclxuXHJcbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHJlYWR5O1xyXG4gIHZhciBmcmFtZUlkO1xyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gIHZhciBpZFRvTE5vZGUgPSB0aGlzLmlkVG9MTm9kZSA9IHt9O1xyXG4gIHZhciBsYXlvdXQgPSB0aGlzLmxheW91dCA9IG5ldyBDb1NFTGF5b3V0KCk7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIFxyXG4gIHRoaXMuY3kgPSB0aGlzLm9wdGlvbnMuY3k7XHJcblxyXG4gIHRoaXMuY3kudHJpZ2dlcih7IHR5cGU6ICdsYXlvdXRzdGFydCcsIGxheW91dDogdGhpcyB9KTtcclxuXHJcbiAgdmFyIGdtID0gbGF5b3V0Lm5ld0dyYXBoTWFuYWdlcigpO1xyXG4gIHRoaXMuZ20gPSBnbTtcclxuXHJcbiAgdmFyIG5vZGVzID0gdGhpcy5vcHRpb25zLmVsZXMubm9kZXMoKTtcclxuICB2YXIgZWRnZXMgPSB0aGlzLm9wdGlvbnMuZWxlcy5lZGdlcygpO1xyXG5cclxuICB0aGlzLnJvb3QgPSBnbS5hZGRSb290KCk7XHJcblxyXG4gIHRoaXMucHJvY2Vzc0NoaWxkcmVuTGlzdCh0aGlzLnJvb3QsIHRoaXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKSwgbGF5b3V0KTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcclxuICAgIHZhciBzb3VyY2VOb2RlID0gdGhpcy5pZFRvTE5vZGVbZWRnZS5kYXRhKFwic291cmNlXCIpXTtcclxuICAgIHZhciB0YXJnZXROb2RlID0gdGhpcy5pZFRvTE5vZGVbZWRnZS5kYXRhKFwidGFyZ2V0XCIpXTtcclxuICAgIHZhciBlMSA9IGdtLmFkZChsYXlvdXQubmV3RWRnZSgpLCBzb3VyY2VOb2RlLCB0YXJnZXROb2RlKTtcclxuICAgIGUxLmlkID0gZWRnZS5pZCgpO1xyXG4gIH1cclxuICBcclxuICAgdmFyIGdldFBvc2l0aW9ucyA9IGZ1bmN0aW9uKGVsZSwgaSl7XHJcbiAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGVsZSA9IGk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGhlSWQgPSBlbGUuZGF0YSgnaWQnKTtcclxuICAgIHZhciBsTm9kZSA9IHNlbGYuaWRUb0xOb2RlW3RoZUlkXTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBsTm9kZS5nZXRSZWN0KCkuZ2V0Q2VudGVyWCgpLFxyXG4gICAgICB5OiBsTm9kZS5nZXRSZWN0KCkuZ2V0Q2VudGVyWSgpXHJcbiAgICB9O1xyXG4gIH07XHJcbiAgXHJcbiAgLypcclxuICAgKiBSZXBvc2l0aW9uIG5vZGVzIGluIGl0ZXJhdGlvbnMgYW5pbWF0ZWRseVxyXG4gICAqL1xyXG4gIHZhciBpdGVyYXRlQW5pbWF0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBUaGlncyB0byBwZXJmb3JtIGFmdGVyIG5vZGVzIGFyZSByZXBvc2l0aW9uZWQgb24gc2NyZWVuXHJcbiAgICB2YXIgYWZ0ZXJSZXBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmZpdCkge1xyXG4gICAgICAgIG9wdGlvbnMuY3kuZml0KG9wdGlvbnMuZWxlcy5ub2RlcygpLCBvcHRpb25zLnBhZGRpbmcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXJlYWR5KSB7XHJcbiAgICAgICAgcmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIHNlbGYuY3kub25lKCdsYXlvdXRyZWFkeScsIG9wdGlvbnMucmVhZHkpO1xyXG4gICAgICAgIHNlbGYuY3kudHJpZ2dlcih7dHlwZTogJ2xheW91dHJlYWR5JywgbGF5b3V0OiBzZWxmfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIHZhciB0aWNrc1BlckZyYW1lID0gc2VsZi5vcHRpb25zLnJlZnJlc2g7XHJcbiAgICB2YXIgaXNEb25lO1xyXG5cclxuICAgIGZvciggdmFyIGkgPSAwOyBpIDwgdGlja3NQZXJGcmFtZSAmJiAhaXNEb25lOyBpKysgKXtcclxuICAgICAgaXNEb25lID0gc2VsZi5sYXlvdXQudGljaygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBJZiBsYXlvdXQgaXMgZG9uZVxyXG4gICAgaWYgKGlzRG9uZSkge1xyXG4gICAgICBzZWxmLm9wdGlvbnMuZWxlcy5ub2RlcygpLnBvc2l0aW9ucyhnZXRQb3NpdGlvbnMpO1xyXG4gICAgICBcclxuICAgICAgYWZ0ZXJSZXBvc2l0aW9uKCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyB0cmlnZ2VyIGxheW91dHN0b3Agd2hlbiB0aGUgbGF5b3V0IHN0b3BzIChlLmcuIGZpbmlzaGVzKVxyXG4gICAgICBzZWxmLmN5Lm9uZSgnbGF5b3V0c3RvcCcsIHNlbGYub3B0aW9ucy5zdG9wKTtcclxuICAgICAgc2VsZi5jeS50cmlnZ2VyKCdsYXlvdXRzdG9wJyk7XHJcbiAgICAgIHNlbGYuY3kudHJpZ2dlcih7IHR5cGU6ICdsYXlvdXRzdG9wJywgbGF5b3V0OiBzZWxmIH0pO1xyXG5cclxuICAgICAgaWYgKGZyYW1lSWQpIHtcclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShmcmFtZUlkKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgc2VsZi5vcHRpb25zLmVsZXMubm9kZXMoKS5yZW1vdmVTY3JhdGNoKCdjb3NlQmlsa2VudCcpO1xyXG4gICAgICByZWFkeSA9IGZhbHNlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBhbmltYXRpb25EYXRhID0gc2VsZi5sYXlvdXQuZ2V0UG9zaXRpb25zRGF0YSgpOyAvLyBHZXQgcG9zaXRpb25zIG9mIGxheW91dCBub2RlcyBub3RlIHRoYXQgYWxsIG5vZGVzIG1heSBub3QgYmUgbGF5b3V0IG5vZGVzIGJlY2F1c2Ugb2YgdGlsaW5nXHJcbiAgICAvLyBQb3NpdGlvbiBub2RlcywgZm9yIHRoZSBub2RlcyB3aG8gYXJlIG5vdCBwYXNzZWQgdG8gbGF5b3V0IGJlY2F1c2Ugb2YgdGlsaW5nIHJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlaXIgZHVtbXkgY29tcG91bmRcclxuICAgIG9wdGlvbnMuZWxlcy5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgZWxlID0gaTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZWxlLnNjcmF0Y2goJ2Nvc2VCaWxrZW50JykgJiYgZWxlLnNjcmF0Y2goJ2Nvc2VCaWxrZW50JykuZHVtbXlfcGFyZW50X2lkKSB7XHJcbiAgICAgICAgdmFyIGR1bW15UGFyZW50ID0gZWxlLnNjcmF0Y2goJ2Nvc2VCaWxrZW50JykuZHVtbXlfcGFyZW50X2lkO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB4OiBkdW1teVBhcmVudC54LFxyXG4gICAgICAgICAgeTogZHVtbXlQYXJlbnQueVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHRoZUlkID0gZWxlLmRhdGEoJ2lkJyk7XHJcbiAgICAgIHZhciBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGhlSWRdO1xyXG4gICAgICB2YXIgdGVtcCA9IGVsZTtcclxuICAgICAgd2hpbGUgKHBOb2RlID09IG51bGwpIHtcclxuICAgICAgICB0ZW1wID0gdGVtcC5wYXJlbnQoKVswXTtcclxuICAgICAgICBwTm9kZSA9IGFuaW1hdGlvbkRhdGFbdGVtcC5pZCgpXTtcclxuICAgICAgICBhbmltYXRpb25EYXRhW3RoZUlkXSA9IHBOb2RlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogcE5vZGUueCxcclxuICAgICAgICB5OiBwTm9kZS55XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZnRlclJlcG9zaXRpb24oKTtcclxuXHJcbiAgICBmcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGl0ZXJhdGVBbmltYXRlZCk7XHJcbiAgfTtcclxuICBcclxuICAvKlxyXG4gICogTGlzdGVuICdsYXlvdXRzdGFydGVkJyBldmVudCBhbmQgc3RhcnQgYW5pbWF0ZWQgaXRlcmF0aW9uIGlmIGFuaW1hdGUgb3B0aW9uIGlzICdkdXJpbmcnXHJcbiAgKi9cclxuICBsYXlvdXQuYWRkTGlzdGVuZXIoJ2xheW91dHN0YXJ0ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoc2VsZi5vcHRpb25zLmFuaW1hdGUgPT09ICdkdXJpbmcnKSB7XHJcbiAgICAgIGZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaXRlcmF0ZUFuaW1hdGVkKTtcclxuICAgIH1cclxuICB9KTtcclxuICBcclxuICBsYXlvdXQucnVuTGF5b3V0KCk7IC8vIFJ1biBjb3NlIGxheW91dFxyXG4gIFxyXG4gIC8qXHJcbiAgICogSWYgYW5pbWF0ZSBvcHRpb24gaXMgbm90ICdkdXJpbmcnICgnZW5kJyBvciBmYWxzZSkgcGVyZm9ybSB0aGVzZSBoZXJlIChJZiBpdCBpcyAnZHVyaW5nJyBzaW1pbGFyIHRoaW5ncyBhcmUgYWxyZWFkeSBwZXJmb3JtZWQpXHJcbiAgICovXHJcbiAgaWYodGhpcy5vcHRpb25zLmFuaW1hdGUgIT09ICdkdXJpbmcnKXtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHNlbGYub3B0aW9ucy5lbGVzLm5vZGVzKCkubm90KFwiOnBhcmVudFwiKS5sYXlvdXRQb3NpdGlvbnMoc2VsZiwgc2VsZi5vcHRpb25zLCBnZXRQb3NpdGlvbnMpOyAvLyBVc2UgbGF5b3V0IHBvc2l0aW9ucyB0byByZXBvc2l0aW9uIHRoZSBub2RlcyBpdCBjb25zaWRlcnMgdGhlIG9wdGlvbnMgcGFyYW1ldGVyXHJcbiAgICAgIHNlbGYub3B0aW9ucy5lbGVzLm5vZGVzKCkucmVtb3ZlU2NyYXRjaCgnY29zZUJpbGtlbnQnKTtcclxuICAgICAgcmVhZHkgPSBmYWxzZTtcclxuICAgIH0sIDApO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpczsgLy8gY2hhaW5pbmdcclxufTtcclxuXHJcbi8vR2V0IHRoZSB0b3AgbW9zdCBvbmVzIG9mIGEgbGlzdCBvZiBub2Rlc1xyXG5fQ29TRUxheW91dC5wcm90b3R5cGUuZ2V0VG9wTW9zdE5vZGVzID0gZnVuY3Rpb24obm9kZXMpIHtcclxuICB2YXIgbm9kZXNNYXAgPSB7fTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG5vZGVzTWFwW25vZGVzW2ldLmlkKCldID0gdHJ1ZTtcclxuICB9XHJcbiAgdmFyIHJvb3RzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcclxuICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGVsZSA9IGk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBhcmVudCA9IGVsZS5wYXJlbnQoKVswXTtcclxuICAgICAgd2hpbGUocGFyZW50ICE9IG51bGwpe1xyXG4gICAgICAgIGlmKG5vZGVzTWFwW3BhcmVudC5pZCgpXSl7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQoKVswXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJvb3RzO1xyXG59O1xyXG5cclxuX0NvU0VMYXlvdXQucHJvdG90eXBlLnByb2Nlc3NDaGlsZHJlbkxpc3QgPSBmdW5jdGlvbiAocGFyZW50LCBjaGlsZHJlbiwgbGF5b3V0KSB7XHJcbiAgdmFyIHNpemUgPSBjaGlsZHJlbi5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuICAgIHZhciB0aGVDaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgdGhpcy5vcHRpb25zLmVsZXMubm9kZXMoKS5sZW5ndGg7XHJcbiAgICB2YXIgY2hpbGRyZW5fb2ZfY2hpbGRyZW4gPSB0aGVDaGlsZC5jaGlsZHJlbigpO1xyXG4gICAgdmFyIHRoZU5vZGU7XHJcblxyXG4gICAgaWYgKHRoZUNoaWxkLndpZHRoKCkgIT0gbnVsbFxyXG4gICAgICAgICAgICAmJiB0aGVDaGlsZC5oZWlnaHQoKSAhPSBudWxsKSB7XHJcbiAgICAgIHRoZU5vZGUgPSBwYXJlbnQuYWRkKG5ldyBDb1NFTm9kZShsYXlvdXQuZ3JhcGhNYW5hZ2VyLFxyXG4gICAgICAgICAgICAgIG5ldyBQb2ludEQodGhlQ2hpbGQucG9zaXRpb24oJ3gnKSwgdGhlQ2hpbGQucG9zaXRpb24oJ3knKSksXHJcbiAgICAgICAgICAgICAgbmV3IERpbWVuc2lvbkQocGFyc2VGbG9hdCh0aGVDaGlsZC53aWR0aCgpKSxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhlQ2hpbGQuaGVpZ2h0KCkpKSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoZU5vZGUgPSBwYXJlbnQuYWRkKG5ldyBDb1NFTm9kZSh0aGlzLmdyYXBoTWFuYWdlcikpO1xyXG4gICAgfVxyXG4gICAgdGhlTm9kZS5pZCA9IHRoZUNoaWxkLmRhdGEoXCJpZFwiKTtcclxuICAgIHRoaXMuaWRUb0xOb2RlW3RoZUNoaWxkLmRhdGEoXCJpZFwiKV0gPSB0aGVOb2RlO1xyXG5cclxuICAgIGlmIChpc05hTih0aGVOb2RlLnJlY3QueCkpIHtcclxuICAgICAgdGhlTm9kZS5yZWN0LnggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc05hTih0aGVOb2RlLnJlY3QueSkpIHtcclxuICAgICAgdGhlTm9kZS5yZWN0LnkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGlsZHJlbl9vZl9jaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuX29mX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgdmFyIHRoZU5ld0dyYXBoO1xyXG4gICAgICB0aGVOZXdHcmFwaCA9IGxheW91dC5nZXRHcmFwaE1hbmFnZXIoKS5hZGQobGF5b3V0Lm5ld0dyYXBoKCksIHRoZU5vZGUpO1xyXG4gICAgICB0aGlzLnByb2Nlc3NDaGlsZHJlbkxpc3QodGhlTmV3R3JhcGgsIGNoaWxkcmVuX29mX2NoaWxkcmVuLCBsYXlvdXQpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAYnJpZWYgOiBjYWxsZWQgb24gY29udGludW91cyBsYXlvdXRzIHRvIHN0b3AgdGhlbSBiZWZvcmUgdGhleSBmaW5pc2hcclxuICovXHJcbl9Db1NFTGF5b3V0LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuc3RvcHBlZCA9IHRydWU7XHJcbiAgXHJcbiAgdGhpcy50cmlnZ2VyKCdsYXlvdXRzdG9wJyk7XHJcblxyXG4gIHJldHVybiB0aGlzOyAvLyBjaGFpbmluZ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXQoY3l0b3NjYXBlKSB7XHJcbiAgcmV0dXJuIF9Db1NFTGF5b3V0O1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXHJcbnZhciBnZXRMYXlvdXQgPSByZXF1aXJlKCcuL0xheW91dCcpO1xyXG5cclxudmFyIHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xyXG4gIHZhciBMYXlvdXQgPSBnZXRMYXlvdXQoIGN5dG9zY2FwZSApO1xyXG5cclxuICBjeXRvc2NhcGUoJ2xheW91dCcsICdjb3NlLWJpbGtlbnQnLCBMYXlvdXQpO1xyXG59O1xyXG5cclxuLy8gYXV0byByZWcgZm9yIGdsb2JhbHNcclxuaWYoIHR5cGVvZiBjeXRvc2NhcGUgIT09ICd1bmRlZmluZWQnICl7XHJcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xyXG4iXX0=
