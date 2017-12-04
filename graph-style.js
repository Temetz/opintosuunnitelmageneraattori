var graphStyle = [
  {
    "selector": "node",
    "style": {
      "height": 'data(size)',
      "width": 'data(size)',
      "background-color": "#ccc",
      "color": "#fff",
      "label": "data(label)",
      "text-valign": "center",
      "text-halign": "left"
    }
  },
  
  {
    "selector": "node.orientationnode",
    "style": {
      "background-color": "#ffb06a",
      "color": "#fff",
    }
  }, 
  
  {
    "selector": "edge",
    "style": {
      "width": 'mapData(weight, 0, 5, 1, 10)',
      "opacity": 0.9,
      "color": "#fff",
      "line-color": 'mapData(weight, 0, 10, green, red)',
      "label": "data(label)"
    }
  }, 
  
  {
    "selector": ".autorotate",
    "style": {
      "edge-text-rotation": "autorotate"
    }
  },
  
  {
    "selector": "edge.bezier",
    "style": {
      "curve-style": "bezier",
      "control-point-step-size": 40
    },
  },

  {
    "selector": ".top-center",
    "style": {
      "text-valign": "top",
      "text-halign": "center"
    }
  },

  {
    "selector": ".multiline-auto",
    "style": {
      "text-wrap": "wrap",
      "text-max-width": 80
    }
  },
];
    
define(function(){
  return graphStyle;
});