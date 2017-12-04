var baseData;
var cy;
var graphStyle;

requirejs(["generator-api", "graph-style"], function(generatorApi, graphstyles) {
  graphStyle = graphstyles;
  
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
        classes: 'top-center multiline-auto orientationnode',
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
            size: 20,
          },
          classes: 'top-center multiline-auto',
          group: 'nodes',
        });
      }
      
      nodeJson.push({
        data: {
          source: orientation.orientation_uuid,
          target: course.course_uuid,
          weight: course.selection_count,
          label: `${course.surveyrole_name} (${course.selection_count})`
        },
        classes: 'bezier autorotate',
        group: 'edges',
      });
    });
    
  });
  
  
  cy = cytoscape({
    container: document.getElementById('cyGraph'),
    elements: nodeJson,
    layout: {
      name: 'concentric',
      concentric: function( node ){
        return node.degree()  * 20;
      },
      levelWidth: function( nodes ){
        return nodes.maxDegree() / 4;
      },
      minNodeSpacing: 20,
     },
    style: graphStyle,
  });
  
  cy.on('tap', 'node', function (evt) {
    cy.elements('edge').hide();
    var selectedNode = cy.$(`#${evt.target.id()}`);
    selectedNode.connectedEdges().show();
  });

  console.log(nodeJson);
};