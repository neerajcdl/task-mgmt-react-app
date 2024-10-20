import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { MdEdit } from "react-icons/md";
import {
  IoCheckmarkDoneCircle,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";

const getLocalStorageItems = () => {
  let list = localStorage.getItem("lists");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

const Dashboard = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
  });

  const [taskData, setTaskData] = useState<
    { title: string; description: string; priority: string; done?: boolean }[]
  >(getLocalStorageItems());
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(taskData));
  }, [taskData]);

  // handle onchange
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing && currentIndex !== null) {
      const editedData = taskData.map((item, index) =>
        index === currentIndex ? task : item
      );
      setTaskData(editedData);
      setCurrentIndex(null);
      setIsEditing(false);
    } else {
      if (task.title && task.description && task.priority) {
        setTaskData([...taskData, task]);
      }
    }
    setTask({
      title: "",
      description: "",
      priority: "",
    });
  };

  // completed
  const handleCompleted = (id: number) => {
    const completedTask = taskData.map((item, index) =>
      id === index ? { ...item, done: !item.done } : item
    );
    setTaskData(completedTask);
  };

  // edit
  const handleEdit = (id: number) => {
    setIsEditing(true);
    setCurrentIndex(id);
    setTask(taskData[id]);
  };

  // delete
  const handleDelete = (id: number) => {
    const deletedData = taskData.filter((_, index) => index !== id);
    setTaskData(deletedData);
  };

  // sorting based on priority
  const sortedTaskData = taskData.sort((a, b) => {
    const priorityOrder: { [key: string]: number } = {
      high: 1,
      medium: 2,
      low: 3,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // searching
  const filteredTasks = sortedTaskData.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="form-wrapper">
        <h1 className="heading">Task Management App</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={task.title}
            placeholder="Title"
            onChange={handleChange}
            className="title"
          />
          <textarea
            name="description"
            value={task.description}
            placeholder="Description"
            onChange={handleChange}
            className="description"
          />

          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="priority"
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button type="submit">{isEditing ? "Edit" : "Submit"}</button>
        </form>
        {taskData.length > 0 && (
          <div className="search-part">
            <input
              type="search"
              className="search"
              placeholder="Search your task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IoSearchSharp />
          </div>
        )}
      </div>
      <div className="data-part-container">
        {taskData.length === 0 ? (
          <p className="no-task">No Task To Do</p>
        ) : (
          filteredTasks.map((item, index) => {
            return (
              <div key={index} className="tasks-part">
                <div className="task">
                  <p
                    className="title"
                    style={{ textDecoration: item.done ? "line-through" : "" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="desc"
                    style={{ textDecoration: item.done ? "line-through" : "" }}
                  >
                    {item.description}
                  </p>
                  <p
                    className={`priority ${
                      item.priority === "high"
                        ? "high-priority"
                        : item.priority === "medium"
                        ? "medium-priority"
                        : item.priority === "low"
                        ? "low-priority"
                        : ""
                    }`}
                  >
                    <FaRegThumbsUp /> {item.priority}
                  </p>
                </div>
                <div className="button-part">
                  <button
                    className="completed-btn"
                    onClick={() => handleCompleted(index)}
                  >
                    {item.done ? (
                      <>
                        <IoCheckmarkDoneCircle /> Completed
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircleOutline /> Pending
                      </>
                    )}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(index)}
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    <RiDeleteBin6Line /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
