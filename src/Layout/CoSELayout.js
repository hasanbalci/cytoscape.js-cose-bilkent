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
  this.getGraphManager().getGraphs().forEach(function (ownerGraph) {
    var zeroDegreeNodes = [];

    // do not process complex nodes (their members are already owned)
    if (ownerGraph.getParent().type != null && ownerGraph.getParent().isComplex()) {
      return;
    }

    ownerGraph.getNodes().forEach(function (node) {

      if (calcGraphDegree(node) === 0)
      {
        zeroDegreeNodes.add(node);
      }
    });

    if (zeroDegreeNodes.size() > 1)
    {
      // create a new dummy complex
      var complex = newNode(null);
      // TODO revise this
      //complex.type = SbgnPDConstants.COMPLEX;
      complex.label = "DummyComplex_" + ownerGraph.getParent().label;

      ownerGraph.add(complex);

      var childGraph = newGraph(null);

      zeroDegreeNodes.forEach(function (zeroNode) {
        ownerGraph.remove(zeroNode);
        childGraph.add(zeroNode);
      });
      // TODO revise dummyComplexList
      this.dummyComplexList.add(complex);
      childComplexMap.put(complex, childGraph);
    }
  });

  this.dummyComplexList.forEach(function (complex) {
    this.graphManager.add(childComplexMap.get(complex), complex);
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
  // LGraph>();
  this.getAllNodes().forEach(function (comp) {
    if (!comp.isComplex || !comp.isComplex()) {
      return;
    }

    // complex is found, recurse on it until no visited complex remains.
    if (!comp.visited)
      this.DFSVisitComplex(comp);
  });

  // clear each complex
  // TODO revise complexOrder
  this.complexOrder.forEach(function (comp) {
    clearComplex(comp);
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

  for (var i = this.complexOrder.size() - 1; i >= 0; i--)
  {
      var comp = this.complexOrder.get(i);
      // TODO revise childGraphMap
      var chGr = this.childGraphMap.get(comp);

      // repopulate the complex
      comp.setChild(chGr);

      // if the child graph is not null, adjust the positions of members
      if (chGr != null)
      {
          // adjust the positions of the members
          this.getGraphManager().getGraphs().add(chGr);
          
          // TODO revise memberPackMap
          var pack = this.memberPackMap.get(comp);
          pack.adjustLocations(comp.getLeft(), comp.getTop());
      }
  }
  
  // TODO revise emptiedDummyComplexMap
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

  for (var j = 0; j < chGr.getNodes().size(); j++)
  {
    var s = chGr.getNodes().get(j);

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
    if (childNode.getChild() != null && childNode.getEdges().size() == 0)
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
CoSELayout.prototype.removeDummyComplexes()
{
  // remove dummy complexes and connect children to original parent
  this.dummyComplexList.forEach(function (dummyComplex) {
    var childGraph = dummyComplex.getChild();
    var owner = dummyComplex.getOwner();

    this.getGraphManager().getGraphs().remove(childGraph);
    dummyComplex.setChild(null);

    owner.remove(dummyComplex);

    childGraph.getNodes().forEach(function (s) {
      owner.add(s);
    });
  });
}

module.exports = CoSELayout;
