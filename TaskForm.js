import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const TaskForm = ({
  input,
  setInput,
  deadline,
  setDeadline,
  addTask,
  saveTask,
  cancelEdit,
  editMode,
  tasks,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (editMode && id) {
      const taskToEdit = tasks.find((task) => task.id === id);
      if (taskToEdit) {
        setInput(taskToEdit.task);
        setDeadline(new Date(taskToEdit.deadline));
      }
    }
  }, [editMode, id, setInput, setDeadline, tasks]);
  return (
    <div className="container">
      <div className="todo-container" style={{ maxWidth: "500px", margin: "auto" }}>
        <h1 className="fs-3 text-center">{editMode ? "Edit Task" : "Add Task"}</h1>
        <div className="border rounded-2 p-2">
          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="form-control"
              placeholderText="Deadline"
            />
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (editMode) {
                  saveTask();
                } else {
                  addTask();
                }
                navigate("/");
              }}
            >
              {editMode ? "Save" : "Add"}
            </button>
            {editMode && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  cancelEdit();
                  navigate("/");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskForm;