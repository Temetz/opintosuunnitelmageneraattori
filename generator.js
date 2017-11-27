requirejs(["courses"], function(courses) {
  setupCourses(courses);
  setupSortable();
  setupSearch();
  setupAddBasicBtn();
});

function calculateAndSetSum(element) {
  var targetSum = $(element)
    .children()
    .map(function(){
      return $(this).data('points');
    })
    .toArray()
    .reduce(function(a, b) { return a + b; }, 0);

  var targetListId = $(element).attr('id');

  $(`#${targetListId}_points`)
    .data('points', targetSum)
    .text(`${targetSum} op`);
};

function calculateAndSetTotalSum(){
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

function handleSortableUpdate (event, ui) {
  var target = event.target;
  var sender = ui.sender ? ui.sender[0] : undefined;

  if (target && sender) {
    calculateAndSetSum(target);
    calculateAndSetSum(sender);
    calculateAndSetTotalSum();
  }
};

function courseStyleByCategoryId(id) {
  switch(id){
    case 1:
      return 'cat-style-basic';
      break;
    case 2:
      return 'cat-style-core';
      break;
    case 3:
      return 'cat-style-optional';
      break;
    default:
      return 'cat-style-default';
      break;
  }
};

function setupSortable () {
  $( "#sortable1, #sortable2, #sortable3, #sortable4" ).sortable({
      connectWith: ".connectedSortable",
      update: handleSortableUpdate,
    }).disableSelection();
};

function setupCourses(courses) {
  courses.forEach(function (course){
    $('#sortable1')
    .append(`<li class="list-group-item ${courseStyleByCategoryId(course.category)}" data-name="${course.name}" data-category="${course.category}" data-points="${course.points}"><b>${course.name}</b> (${course.points} op)</li>`);
  });
};

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
        var regexp = new RegExp(searchString, 'i');

        if(regexp.test(nodename)) {
          $(this).show();
        }
      });
  });
};

function setupAddBasicBtn() {
  $('#btnAddBasic')
    .click(function(){
      $('#sortable1')
        .children("[data-category='1']")
        .show()
        .each(function(){
          $('#sortable2').append(this);
        });

      calculateAndSetSum($('#sortable2'));
      calculateAndSetTotalSum();
    });
};
