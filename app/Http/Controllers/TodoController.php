<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todos = Todo::all();
        return view('todos.index', compact('todos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required'
        ]);

        $todo = Todo::create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        if ($todo) {
            return response()->json(['status' => 'success', 'message' => 'Success! Todo is created', 'todo' => $todo]);
        } else {
            return response()->json(['status' => 'failed', 'message' => 'Failed! unable to create Todo']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        if ($todo) {
            return response()->json(['status' => 'success', 'todo' => $todo]);
        } else {
            return response()->json(['status' => 'failed', 'message' => 'Failed! no Todo found']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        if ($todo) {
            $todo['title'] = $request->title;
            $todo['description'] = $request->description;
            $todo->save();
            return response()->json(['status' => 'success', 'message' => 'Success! Todo is updated', 'todo' => $todo]);
        }
        return response()->json(['status' => 'failed', 'message' => 'Failed! unable to update Todo']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        if ($todo) {
            $todo->delete();
            return response()->json(['status' => 'success', 'message' => 'Success! Todo is deleted', 'todo' => $todo]);
        }
        return response()->json(['status' => 'failed', 'message' => 'Failed! unable to delete Todo']);
    }
}
