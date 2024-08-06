@extends('layouts.app')

@section('content')
    @include('todos.subview.create')
    <div class="container py-5">
        <h3 class="text-center">Ajax CRUD in Laravel 10</h3>
        <div class="row">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" id="testing123" class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#todo-modal">
                    Create Todo
                </button>
            </div>
        </div>

        <div class="table-responsive pt-4">
            <table class="table table-striped" id="todo-table">
                <thead>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Completed</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    @forelse ($todos as $todo)
                        <tr id="{{ 'todo_' . $todo->id }}">
                            <td>{{ $todo->id }}</td>
                            <td>{{ $todo->title }}</td>
                            <td>{{ $todo->description }}</td>
                            <td>{{ $todo->is_completed ? 'Yes' : 'No' }}</td>
                            <td><a class="btn btn-info btn-sm btn-view" href="javascript:void(0)"
                                    data-id="{{ $todo->id }}">View</a>
                                <a class="btn btn-success btn-sm btn-edit" href="javascript:void(0)"
                                    data-id="{{ $todo->id }}">Edit</a>
                                <a class="btn btn-danger btn-sm btn-delete" href="javascript:void(0)"
                                    data-id="{{ $todo->id }}">Delete</a>
                            </td>
                        </tr>

                    @empty
                        <tr>
                            <td colspan="5">
                                <p class="text-danger">No Todos Found!</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

    </div>
@endsection
