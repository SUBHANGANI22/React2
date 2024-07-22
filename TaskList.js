import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import "./TaskManager.css";
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editDeadline, setEditDeadline] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    sortTasks(storedTasks, sortOrder);
    setTasks(storedTasks);
  }, [sortOrder]);
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
  const handleStatusChange = (id, status) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    sortTasks(newTasks, sortOrder);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };
  const getTaskColor = (task) => {
    if (task.status === "completed") return "green";
    if (!task.deadline) return "black";
    const timeDiff = new Date(task.deadline) - new Date();
    if (timeDiff < 12 * 60 * 60 * 1000) return "red";
    if (timeDiff < 24 * 60 * 60 * 1000) return "blue";
    return "black";
  };
  const handleDelete = () => {
    const newTasks = tasks.filter((task) => task.id !== taskToDelete);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
    setShowConfirm(false);
    setTaskToDelete(null);
  };
  return (
    <div className="container">
      <div
        className="todo-container"
        style={{ maxWidth: "500px", margin: "auto" }}
      >
        <h1 className="fs-3 text-center">Task Manager</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/add-task" className="btn btn-primary">
            Add
          </Link>
        </div>
        <div className="border rounded-2 p-2">
          <div className="mt-3 d-flex justify-content-between border-bottom">
            <h3 className="fs-6">Task</h3>
            <div>
              <select
                className="form-select"
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
              >
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
            <h3 className="fs-6">Action</h3>
          </div>
          <ul className="list-unstyled" id="list-container">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="d-flex justify-content-between align-items-center border-bottom">
                  <div className="d-flex flex-column w-50">
                    <p
                      className="p-1 mb-0 fs-6"
                      style={{ color: getTaskColor(task) }}
                    >
                      {task.task}
                    </p>
                    <small className="text-muted">
                      {new Date(task.deadline).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </small>
                  </div>
                  <select
                    className="w-25 task-status"
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div>
                    <button
                      className="btn btn-sm delete-btn p-0"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setShowConfirm(true);
                      }}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      className="btn btn-sm delete-btn p-0"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setShowConfirm(true);
                      }}
                    >
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default TaskList;

//React

//Reply
