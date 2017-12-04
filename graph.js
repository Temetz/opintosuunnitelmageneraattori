var baseData;
var cy;

requirejs(["generator-api"], function(generatorApi) {
  generatorApi.fetchResultsOrientation
  .then(function(resultsData){
    baseData = resultsData;
    setupGraph(resultsData);
  });
});

function setupGraph(data){
  var helperAddedNodes = [];
  var nodeJson = [];
  
  console.log(data);
  
  data.forEach(function(orientation){
    
    if (helperAddedNodes.indexOf(orientation.orientation_uuid) === -1){
      helperAddedNodes.push(orientation.orientation_uuid);
      nodeJson.push({
        data: {
          id: orientation.orientation_uuid,
          name: orientation.orientation_name,
          label: orientation.orientation_name,
          size: 40,
        },
        classes: 'top-center unbundled-bezier',
        group: 'nodes',
      });
    }
    
    orientation.courses.forEach(function(course){
      if (helperAddedNodes.indexOf(course.course_uuid) === -1){
        helperAddedNodes.push(course.course_uuid);
        nodeJson.push({
          data: {
            id: course.course_uuid,
            name: course.course_name,
            label: course.course_name,
            size: course.selection_count,
          },
          classes: 'top-center unbundled-bezier',
          group: 'nodes',
        });
      }
      
      nodeJson.push({
        data: {
          source: orientation.orientation_uuid,
          target: course.course_uuid,
          weight: course.selection_count,
        },
        classes: 'top-center unbundled-bezier',
        group: 'edges',
      });
    });
    
  });
  
  
  cy = cytoscape({
    container: document.getElementById('cyGraph'),
    elements: nodeJson,
    layout: {
      name: 'grid',
      padding: 10
    },
    style: [
      {
        "selector": "node",
        "style": {
          "height": 'mapData(size, 0, 4, 10, 40)',
          "width": 'mapData(size, 0, 4, 10, 40)',
          "background-color": "#ccc",
          "color": "#fff",
          "label": "data(label)",
          "text-valign": "center",
          "text-halign": "left"
        }
      }, {
        "selector": "edge",
        "style": {
          "width": 'mapData(weight, 0, 5, 1, 10)',
          "opacity": 0.666,
          "line-color": 'mapData(weight, 0, 10, yellow, red)',
          "label": "data(label)"
        }
      }, {
        "selector": "edge.bezier",
        "style": {
          "curve-style": "bezier",
          "control-point-step-size": 40
        }
      }, {
        "selector": "edge.unbundled-bezier",
        "style": {
          "curve-style": "unbundled-bezier",
          "control-point-distances": 120,
          "control-point-weights": 0.1
        }
      }, {
        "selector": "edge.multi-unbundled-bezier",
        "style": {
          "curve-style": "unbundled-bezier",
          "control-point-distances": [40, -40],
          "control-point-weights": [0.250, 0.75]
        }
      }, {
        "selector": "edge.haystack",
        "style": {
          "curve-style": "haystack",
          "haystack-radius": 0.5
        }
      }, {
        "selector": "edge.segments",
        "style": {
          "curve-style": "segments",
          "segment-distances": [ 40, -40 ],
          "segment-weights": [0.250 , 0.75]
        }
      },

      {
        "selector": ".top-left",
        "style": {
          "text-valign": "top",
          "text-halign": "left"
        }
      },

      {
        "selector": ".top-center",
        "style": {
          "text-valign": "top",
          "text-halign": "center"
        }
      },

      {
        "selector": ".top-right",
        "style": {
          "text-valign": "top",
          "text-halign": "right"
        }
      },

      {
        "selector": ".center-left",
        "style": {
          "text-valign": "center",
          "text-halign": "left"
        }
      },

      {
        "selector": ".center-center",
        "style": {
          "text-valign": "center",
          "text-halign": "center"
        }
      },

      {
        "selector": ".center-right",
        "style": {
          "text-valign": "center",
          "text-halign": "right"
        }
      },

      {
        "selector": ".bottom-left",
        "style": {
          "text-valign": "bottom",
          "text-halign": "left"
        }
      },

      {
        "selector": ".bottom-center",
        "style": {
          "text-valign": "bottom",
          "text-halign": "center"
        }
      },

      {
        "selector": ".bottom-right",
        "style": {
          "text-valign": "bottom",
          "text-halign": "right"
        }
      },

      {
        "selector": ".multiline-manual",
        "style": {
          "text-wrap": "wrap"
        }
      },

      {
        "selector": ".multiline-auto",
        "style": {
          "text-wrap": "wrap",
          "text-max-width": 80
        }
      },

      {
        "selector": ".autorotate",
        "style": {
          "edge-text-rotation": "autorotate"
        }
      },

      {
        "selector": ".background",
        "style": {
          "text-background-opacity": 1,
          "text-background-color": "#ccc",
          "text-background-shape": "roundrectangle",
          "text-border-color": "#000",
          "text-border-width": 1,
          "text-border-opacity": 1
        }
      },

      {
        "selector": ".outline",
        "style": {
          "text-outline-color": "#ccc",
          "text-outline-width": 3
        }
      }
    ]
  });

  console.log(nodeJson);
};