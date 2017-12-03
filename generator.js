var categories;
var RestApi;
var dataToStore = {
  surveyrole_uuid: null,
  orientation_uuid: null,
  categories: [],
};

var dataToStoreTemplate = {
  surveyrole_uuid: null,
  orientation_uuid: null,
  categories: [],
};

requirejs(["generator-api"], function(generatorApi) {
  RestApi = generatorApi;
  generatorApi.setupData
  .then(function(basedata){
    categories = basedata.categories;
    setupCourses(basedata.courses);
    setupModal(basedata.orientations, basedata.surveyroles);
  })
  .then(function(){
    setupSortable();
    setupSearch();
    setupButtons();
  });
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
    case 'b76cc5db-1798-481b-914d-eb0c13066935':
      return 'cat-style-basic';
      break;
    case '5006fbed-005d-4f1b-8088-540b1b297742':
      return 'cat-style-core';
      break;
    case '09df6ec4-c465-4669-93d3-b1dd297bbee5':
      return 'cat-style-optional';
      break;
    default:
      return 'cat-style-default';
      break;
  }
};

function setupModal(orientations, surveyroles){
  
  orientations.forEach(function(orientation) {
    $('#orientation').append(`<option value="${orientation.uuid}">${orientation.name}</option>`);
  });
  
  $('#orientation').on('change', function(){
    var selected = $(this).find("option:selected").val();
    dataToStore.orientation_uuid = selected;
  });
 
  surveyroles.forEach(function(surveyrole) {
    $('#surveyrole').append(`<option value="${surveyrole.uuid}">${surveyrole.name}</option>`);
  });
  
  $('#surveyrole').on('change', function(){
    var selected = $(this).find("option:selected").val();
    dataToStore.surveyrole_uuid = selected;
  });
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
    .append(`<li class="list-group-item ${courseStyleByCategoryId(course.category_uuid)}" data-name="${course.name}" data-courseid="${course.uuid}" data-category="${course.category_uuid}" data-points="${course.points}"><b>${course.name}</b> (${course.points} op)</li>`);
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

function setupButtons(){
  $("#btnSaveAsImage").click(function() { 
    html2canvas($("#selectedCoursesContainer"), {
      onrendered: function(canvas) {
        canvas.toBlob(function(blob) {
          saveAs(blob, "opintosuunnitelmageneraattori.png"); 
        });
      }
    });
  });
  
  $("#btnPrepareSaveToDatabase").click(function() {
    var selectedCourses = {};

    $('#sortable2, #sortable3, #sortable4')
    .children()
    .each(function(){
      if (!selectedCourses[$(this).parent().data('categoryid')]) {
        selectedCourses[$(this).parent().data('categoryid')] = [];
      }
      return this;
    })
    .each(function(){
      selectedCourses[$(this).parent().data('categoryid')].push($(this).data('courseid'));
    });
    
    Object
      .keys(selectedCourses)
      .forEach(function(key){
        dataToStore.categories.push({
          uuid: key,
          courses: selectedCourses[key],
        });
      });
    
    $('#additionalInfoModal').modal('show');
  });
  
  $("#btnSendToDatabase").click(function() {
    if (dataToStore.surveyrole_uuid === "" || !dataToStore.surveyrole_uuid 
    || dataToStore.orientation_uuid === "" || !dataToStore.orientation_uuid) {
      alert('Valitse koulutusohjelma ja oma roolisi');
      return;
    }
    
    $('#additionalInfoModal').modal('hide');

    RestApi.storeData(dataToStore)
    .then(function(result){
      dataToStore = dataToStoreTemplate;
      $('#orientation').val('');
      $('#surveyrole').val('');
      $('#thanksModal').modal('show');
    }, function(error){
      console.log(error);
    });    
  });

  $("#btnSaveAsText").click(function() { 
    var exportTxt = `Opintosuunnitelmageneraattori - ${new Date()}\n`;
    var selectedCourses = $('#sortable2, #sortable3, #sortable4')
    .children()
    .map(function(){
      return { 
        category: $(this).data('category'),
        name: `${$(this).data('name')} (${$(this).data('points')} op)`
      };
    })
    .toArray();
    
    for(var i = 0; i < categories.length; i++){
      exportTxt += '\n';
      exportTxt += categories[i].name;
      exportTxt += '\n*********************\n';
      
      selectedCourses
      .filter(function(course){
        return course.category === categories[i].uuid;
      })
      .forEach(function(course){
        exportTxt += `${course.name}\n`;
      });
    }
    
    var file = new File([exportTxt], "opintosuunnitelmageneraattori.txt", {type: "text/plain;charset=utf-8"});
    saveAs(file);
  });
  
  $('#btnAddBasic').click(function(){
    $('#sortable1')
      .children("[data-category='b76cc5db-1798-481b-914d-eb0c13066935']")
      .show()
      .each(function(){
        $('#sortable2').append(this);
      });

    calculateAndSetSum($('#sortable2'));
    calculateAndSetTotalSum();
  });
};
