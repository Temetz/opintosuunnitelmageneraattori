requirejs(["courses"], function(courses) {
  setupCourses(courses);
  setupSortable();
});

function setupSortable () {
  $( "#sortable1, #sortable2, #sortable3, #sortable4" ).sortable({
      connectWith: ".connectedSortable",
      update: handleSortableUpdate,
    }).disableSelection();
}

function handleSortableUpdate (event, ui) {
  var target = event.target;
  var sender = ui.sender ? ui.sender[0] : undefined;
  
  if (target && sender) {
    // TARGET
    var targetSum = $(target)
      .children()
      .map(function(){
        return $(this).data('points');
      })
      .toArray()
      .reduce(function(a, b) { return a + b; }, 0);
      
    var targetListId = $(target).attr('id');

    $(`#${targetListId}_points`)
      .data('points', targetSum)
      .text(`${targetSum} op`);

    // SENDER
    var senderSum = $(sender)
      .children()
      .map(function(){
        return $(this).data('points');
      })
      .toArray()
      .reduce(function(a, b) { return a + b; }, 0);
      
    var senderListId = $(sender).attr('id');

    $(`#${senderListId}_points`)
      .data('points', senderSum)
      .text(`${senderSum} op`);
  }
  
  //TOTALS
  var totalSum = $('#sortable2_points, #sortable3_points, #sortable4_points')
    .map(function(){
        return $(this).data('points');
      })
    .toArray()
    .reduce(function(a, b) { return a + b; }, 0);
  
  $(`#total_points`)
    .data('points', totalSum)
    .text(`${totalSum} op`);
};

function setupCourses(courses) {
  courses.forEach(function (course){
    $('#sortable1')
    .append(`<li class="list-group-item" data-points="${course.points}"><b>${course.name}</b> (${course.points} op)</li>`);
  });
}