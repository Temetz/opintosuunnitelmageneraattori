requirejs(["courses"], function(courses) {
  setupCourses(courses);
  setupSortable();
  setupSearch();
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
    .append(`<li class="list-group-item" data-name="${course.name}" data-points="${course.points}"><b>${course.name}</b> (${course.points} op)</li>`);
  });
}

function setupSearch() {
  $('#search').keyup(function(){
    var searchString = $(this).val();

    if (searchString === "" || searchString === null) {
      $('#sortable1').children().show();
      return;
    }

    $('#sortable1').children().hide();
    $('#sortable1')
      .children()
      .each(function(){
        var nodename = $(this).data('name');
        var regexp = new RegExp(''+ searchString +'', 'i');

        if(regexp.test(nodename)) {
          $(this).show();
        }
      });
  });
}
