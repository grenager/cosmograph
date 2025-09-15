# Cosmograph Visualization Project

## Overview

This project uses [Cosmograph](https://cosmograph.app/docs/cosmograph/Cosmograph%20JavaScript/Cosmograph) - a powerful GPU-accelerated force graph visualization library built on WebGL. The current setup includes a 10,000 node animation with dynamic colors and interactive controls.

## Setup & Development

### Current Stack

- **Vite** - Development server with ES module support and hot reloading
- **@cosmograph/cosmograph** - Main visualization library
- **Static HTML** - Single page application approach

### Running the Project

```bash
npm run dev    # Start Vite dev server at http://localhost:5173
npm run build  # Build for production
npm run preview # Preview production build
```

## Cosmograph Key Features & Configuration

### Core Concepts

- **Nodes**: Objects with `id` (required), optional `x`, `y` positions
- **Links**: Objects with `source` and `target` referencing node IDs
- **GPU Acceleration**: Uses @cosmograph/cosmos engine for performance
- **Embeddings Mode**: Can render nodes without links (no simulation)

### Node Appearance Configuration

#### Basic Properties

```javascript
const config = {
  // Color: function or static value (hex, rgba array, color name)
  nodeColor: (node, index) => node.color, // or '#ff0000' or [255,0,0,1]

  // Size: function or static value in pixels
  nodeSize: (node, index) => node.size, // or 4 (default)

  // Global size scaling (useful for zoom sliders)
  nodeSizeScale: 1, // default: 1

  // Scale nodes when zooming
  scaleNodesOnZoom: true, // default: true
};
```

#### Node States & Visual Feedback

- **Selected**: Multiple nodes, triggered by `selectNode()`, `selectNodes()`, `selectNodesInRange()`
  - `nodeGreyoutOpacity: 0.1` - Opacity of unselected nodes when selection active
- **Focused**: Single node, triggered by `focusNode()`
  - `focusedNodeRingColor: 'white'` - Color of focus ring
- **Hovered**: Single node on mouse over
  - `renderHoveredNodeRing: true` - Enable/disable hover rings
  - `hoveredNodeRingColor: 'white'` - Color of hover ring

#### Node Labels

```javascript
const config = {
  // Custom label text generation
  nodeLabelAccessor: (node) => `${node.category} ${node.id}`, // default: n => n.id

  // Dynamic labels (appear/hide on zoom)
  showDynamicLabels: true, // default: true

  // Top labels (highest connected nodes)
  showTopLabels: false, // default: false
  showTopLabelsLimit: 10, // max number of top labels
  showTopLabelsValueKey: "connections", // custom property for "top" calculation

  // Hovered node labels
  showHoveredNodeLabel: true, // default: true
};
```

### Link Appearance Configuration

```javascript
const config = {
  // Link colors and styling
  linkColor: (link, index) => link.color, // or static color
  linkWidth: (link, index) => link.width, // or static width
  linkOpacity: 1, // global link opacity

  // Visual enhancements
  curvedLinks: true, // enable curved links
  curvedLinkWeight: 0.6, // curvature amount
  linkArrows: true, // show directional arrows

  // Link states
  linkGreyoutOpacity: 0.1, // opacity when nodes selected
};
```

### Simulation & Physics

```javascript
const config = {
  // Core simulation parameters
  simulationFriction: 0.9, // energy loss per tick
  simulationLinkSpring: 0.8, // link spring strength
  simulationLinkDistance: 5, // desired link length
  simulationRepulsion: 0.15, // node repulsion force
  simulationGravity: 0.02, // center gravity
  simulationCenter: 0.05, // centering force
  simulationDecay: 2000, // simulation duration

  // Disable simulation entirely (for embeddings)
  disableSimulation: false, // default: false
};
```

### Zoom & View Controls

```javascript
const config = {
  // Initial view settings
  fitViewOnInit: true, // auto-fit on load
  fitViewDelay: 500, // delay before auto-fit
  initialZoomLevel: 0.8, // starting zoom

  // Zoom behavior
  disableZoom: false, // allow/prevent zooming
  zoomScaleFactor: 1, // zoom sensitivity

  // Space and boundaries
  spaceSize: 6000, // simulation space size
};
```

### Performance & Rendering

```javascript
const config = {
  // Rendering quality
  pixelRatio: 2, // for high-DPI displays
  backgroundColor: "rgba(0,0,0,0.95)", // canvas background

  // Performance monitoring
  showFPSMonitor: false, // built-in FPS counter

  // Sampling for large datasets
  nodeSamplingDistance: 150, // distance between sampled nodes
};
```

## Event Handling & Callbacks

### Mouse & Interaction Events

```javascript
cosmograph.onClick = (node, index, position, event) => {
  // Handle node clicks
};

cosmograph.onNodeMouseOver = (node, index, position) => {
  // Handle node hover
};

cosmograph.onZoom = (event) => {
  // Handle zoom changes
  const zoomLevel = event.transform.k;
};
```

### Simulation Callbacks

```javascript
cosmograph.onSimulationTick = (alpha, hoveredNode, index, position) => {
  // Called every simulation frame
  // alpha decreases from 1 to 0 as simulation cools
};

cosmograph.onSimulationEnd = () => {
  // Simulation completed
};

cosmograph.onSimulationPause = () => {
  // Simulation paused
};
```

### Data Change Callbacks

```javascript
cosmograph.onSetData = (nodes, links) => {
  // Called when data is updated
};

cosmograph.onNodesFiltered = (filteredNodes) => {
  // Called when nodes are filtered (crossfilter)
};

cosmograph.onLinksFiltered = (filteredLinks) => {
  // Called when links are filtered (crossfilter)
};
```

## Control Methods

### Node Selection & Focus

```javascript
// Selection (multiple nodes)
cosmograph.selectNode(node, selectAdjacentNodes);
cosmograph.selectNodes([node1, node2, node3]);
cosmograph.selectNodesInRange([
  [x1, y1],
  [x2, y2],
]);
cosmograph.getSelectedNodes();
cosmograph.unselectNodes();

// Focus (single node with ring)
cosmograph.focusNode(node); // or focusNode() to clear

// Adjacent nodes
cosmograph.getAdjacentNodes(nodeId);
```

### Position & Coordinate Methods

```javascript
// Get node positions in different formats
cosmograph.getNodePositions(); // Object: {nodeId: {x, y}}
cosmograph.getNodePositionsMap(); // Map: nodeId -> [x, y]
cosmograph.getNodePositionsArray(); // Array: [[x, y], ...]
cosmograph.getSampledNodePositionsMap(); // Visible nodes only

// Coordinate conversion
cosmograph.spaceToScreenPosition([x, y]);
cosmograph.spaceToScreenRadius(radius);
```

### Zoom & View Control

```javascript
// View fitting
cosmograph.fitView((duration = 250));
cosmograph.fitViewByNodeIds(["node1", "node2"], (duration = 250));
cosmograph.zoomToNode(node);

// Manual zoom
cosmograph.setZoomLevel(2.0, (duration = 0));
cosmograph.getZoomLevel(); // getter
```

### Simulation Control

```javascript
// Simulation state
cosmograph.start((alpha = 1)); // Start with energy level
cosmograph.pause(); // Pause simulation
cosmograph.restart(); // Resume from current state
cosmograph.step(); // Single frame render

// Simulation info
cosmograph.progress; // getter: 0-1 completion
cosmograph.isSimulationRunning; // getter: boolean
```

## Current Implementation Notes

### Data Structure

- **10,000 nodes** with rainbow HSL colors
- **~3,000 links** (0.0003 density)
- **Categories**: star, planet, comet, asteroid, nebula
- **Dynamic properties**: size (2-10px), color, position

### Interactive Features

- **Click nodes**: Select and zoom to node
- **Hover effects**: Console logging and visual feedback
- **Control buttons**: Pause/Resume, Restart, Fit View, Color Randomization
- **Keyboard shortcuts**: Space (pause), R (restart), F (fit), C (colors)
- **Real-time stats**: Zoom level, FPS, simulation progress

### Color Schemes

- Rainbow (default)
- Ocean blues
- Fire reds/oranges
- Galaxy purples
- Neon bright colors

## Future Development Ideas

### Performance Optimizations

- Use `nodeSamplingDistance` for very large datasets
- Implement `disableSimulation` for static layouts
- Add WebGL context monitoring

### Enhanced Interactions

- Node clustering/grouping
- Custom selection tools
- Timeline-based animations
- Search and filtering integration

### Visual Enhancements

- Custom node shapes/icons
- Gradient link colors
- Particle effects
- Custom background patterns

### Data Integration

- Real-time data updates
- CSV/JSON data loading
- API integration
- Export capabilities

## Resources

- [Cosmograph Documentation](https://cosmograph.app/docs/cosmograph/Cosmograph%20JavaScript/Cosmograph)
- [Examples Gallery](https://cosmograph.app/examples)
- [GitHub Repository](https://github.com/cosmograph-org/cosmograph)
