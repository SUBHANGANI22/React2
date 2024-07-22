import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./TaskManager.css";
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editDeadline, setEditDeadline] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("name");
  const calendarRef = useRef(null);
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    sortTasks(storedTasks, sortOrder);
    setTasks(storedTasks);
  }, [sortOrder]);
  const addTask = () => {
    if (!input.trim()) {
      alert("Task name is required");
      return;
    }
    if (!deadline) {
      alert("Deadline is required");
      return;
    }
    const newTasks = [
      ...tasks,
      { id: uuidv4(), task: input, status: "todo", deadline },
    ];
    sortTasks(newTasks, sortOrder);
    setTasks(newTasks);
    setInput("");
    setDeadline(null);
    saveTasksToLocalStorage(newTasks);
  };
  const saveTask = () => {
    if (!editInput.trim()) {
      alert("Task name is required");
      return;
    }
    if (!editDeadline) {
      alert("Deadline is required");
      return;
    }
    const newTasks = tasks.map((task) =>
      task.id === currentTaskId
        ? { ...task, task: editInput, deadline: editDeadline }
        : task
    );
    sortTasks(newTasks, sortOrder);
    setTasks(newTasks);
    setEditInput("");
    setEditDeadline(null);
    setEditMode(false);
    setCurrentTaskId(null);
    saveTasksToLocalStorage(newTasks);
  };
  const cancelEdit = () => {
    setEditInput("");
    setEditDeadline(null);
    setEditMode(false);
    setCurrentTaskId(null);
  };
  const handleDelete = () => {
    const newTasks = tasks.filter((task) => task.id !== taskToDelete);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
    setShowConfirm(false);
    setTaskToDelete(null);
  };
  const handleStatusChange = (id, status) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    sortTasks(newTasks, sortOrder);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };
  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };
  const sortTasks = (tasks, criteria) => {
    if (criteria === "name") {
      tasks.sort((a, b) => (a.task || "").localeCompare(b.task || ""));
    } else if (criteria === "status") {
      tasks.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    } else if (criteria === "date") {
      tasks.sort(
        (a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0)
      );
    }
  };
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <TaskList
              tasks={tasks}
              handleStatusChange={handleStatusChange}
              handleSort={handleSort}
              sortOrder={sortOrder}
              setEditInput={setEditInput}
              setEditDeadline={setEditDeadline}
              setCurrentTaskId={setCurrentTaskId}
              setEditMode={setEditMode}
              setShowConfirm={setShowConfirm}
              setTaskToDelete={setTaskToDelete}
            />
          }
        />
        <Route
          path="/add-task"
          element={
            <TaskForm
              input={input}
              setInput={setInput}
              deadline={deadline}
              setDeadline={setDeadline}
              addTask={addTask}
              editMode={editMode}
            />
          }
        />
        <Route
          path="/edit-task/:id"
          element={
            <TaskForm
              input={editInput}
              setInput={setEditInput}
              deadline={editDeadline}
              setDeadline={setEditDeadline}
              saveTask={saveTask}
              cancelEdit={cancelEdit}
              editMode={editMode}
              tasks={tasks}
            />
          }
        />
      </Routes>
    </div>
  );
};
export default TaskManager;
