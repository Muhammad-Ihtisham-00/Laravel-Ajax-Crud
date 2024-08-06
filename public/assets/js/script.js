$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
    }
});


toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


$(document).ready(function(){
    $("#testing123").click(function(){

        $("#todo-modal #title").val("");
        $("#todo-modal #description").val("");

        $("#todo-modal #title, #todo-modal #description ").removeAttr("disabled");
        $("#todo-form button[type=submit]").removeClass("d-none");
        $("#modal-title").text("create Todo");
        $("#todo-form").attr("action", `${baseUrl}/todos`);
        $("#hidden-todo-id").remove();

    });

    

    
 
    $("#todo-form").validate({

        rules: {
            title: {
                required: true,
                minlength: 3,
                maxlength: 50
            },

            description: {
                required: true,
                minlength: 10,
                maxlength: 255
            }
        },

        messages: {
            title: {
                required: 'please enter todo title',
                minlength: 'todo title must be atleast 3 chars',
                maxlength: 'todo title must not be greater then 50 chars'
            },

            description: {
                required: 'please enter todo description',
                minlength: 'todo description must be atleast 10 chars',
                maxlength: 'todo description must not be greater then 255 chars'
            }
        },

        submitHandler: function(form) {
           const formData =  $(form).serializeArray();

           const todoId = $("#hidden-todo-id").val();

           const methodType = todoId && 'PUT' || "POST";
           const formAction = $(form).attr("action");

           $.ajax({
                type: methodType,
                url: formAction,
                data: formData,
                beforeSend: function(){
                    console.log('Loading...');
                },
                success: function(response){
                    $("#todo-form")[0].reset();
                    $("#todo-modal").modal("toggle");
                    if (response.status === "success") {
                        toastr["success"](response.message)

                        if (todoId){
                            $(`#todo_${todoId} td:nth-child(2)`).html(response.todo.title);
                            $(`#todo_${todoId} td:nth-child(3)`).html(response.todo.description);

                        } else {
                            $("#todo-table").append(
                            `<tr id="todo_${response.todo.id}" class="table-success">
                            <td class="dt-type-numeric sorting_1">${response.todo.id}</td>
                            <td>${response.todo.title}</td>
                            <td>${response.todo.description}</td>
                            <td>${response.todo.is_completed ? 'Yes' : 'No'}</td>
                            <td><a class="btn btn-info btn-sm btn-view" href="javascript:void(0)" data-id="${response.todo.id}">View</a>
                                <a class="btn btn-success btn-sm btn-edit" href="javascript:void(0)" data-id="${response.todo.id}">Edit</a>
                                <a class="btn btn-danger btn-sm btn-delete" href="javascript:void(0)" data-id="${response.todo.id}">Delete</a>
                            </td>
                            </tr>`
                        );

                        }
                        
                    } else if (response.status === "failed") {
                        toastr["error"](response.message)
                    }
                    
                    
                },
                error: function(error){
                    toastr["error"](response.message)
                },
            });
        }
        
    
  });

  $("#todo-table").dataTable();

  $(".btn-view").click(function(){
    const todoId = $(this).data("id");
    const mode = "view";
    todoId && fetchTodo(todoId, mode);
  });

  function fetchTodo(todoId, mode = null) {
    if (todoId) {
        $.ajax({
            url: `todos/${todoId}`,
            type: "GET",
            success: function(response) {
                if (response.status === "success"){
                    const todo = response.todo;

                    $("#todo-modal #title").val(todo.title);
                    $("#todo-modal #description").val(todo.description);
                    
                    if (mode === "view") {

                        $("#todo-modal #title, #todo-modal #description ").attr("disabled", true);
                        $("#todo-form button[type=submit]").addClass("d-none");
                        $("#modal-title").text("Todo Details");
                        $("#todo-form").removeAttr("action");

                    } else if (mode === "edit"){
                        $("#todo-modal #title, #todo-modal #description ").removeAttr("disabled", true);
                        $("#todo-form button[type=submit]").removeClass("d-none");
                        $("#modal-title").text("Update Todo");
                        $("#todo-form").attr("action", `${baseUrl}/todos/${todo.id}`);
                        $("#todo-form").append(`<input type="hidden" id="hidden-todo-id" value="${todo.id}">`);

                    }

                    $("#todo-modal").modal("toggle");

                }

            },
            error: function(error) {
                console.error(error);
            }
        });
    }
  }

  $(".btn-edit").click(function(){
    const todoId = $(this).data("id");
    const mode = "edit";
    todoId && fetchTodo(todoId, mode);
  });

  // Delete functionality
    $("#todo-table tbody").on("click", ".btn-delete", function () {
        const todoId = $(this).data("id");
        const buttonObj = $(this);

        if (todoId) {
            // sweetalert

            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete",
            }).then((result) => {
                if (result.isConfirmed) {
                    // ajax call
                    $.ajax({
                        url: `todos/${todoId}`,
                        type: "DELETE",
                        success: function (response) {
                            if (response.status === "success") {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Todo has been deleted.",
                                    icon: "success",
                                    timer: 1500,
                                });

                                if (response.todo) {
                                    $(`#todo_${response.todo.id}`).remove();
                                }
                            } else {
                                Swal.fire({
                                    title: "Failed!",
                                    text: "Unable to delete Todo!",
                                    icon: "error",
                                });
                            }
                        },
                        error: function (error) {
                            Swal.fire({
                                title: "Failed!",
                                text: "Unable to delete Todo!",
                                icon: "error",
                            });
                        },
                    });
                }
            });
        }
    });
   
});