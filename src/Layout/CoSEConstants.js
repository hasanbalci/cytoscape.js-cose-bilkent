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
