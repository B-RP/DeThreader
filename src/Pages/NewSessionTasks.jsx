import React, { useState, useEffect, useContext } from "react";
import "./Style.css";
import "./add-task.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { Tree } from "./Tree";
import { TreeView } from "./TreeView";
import { useNavigate } from "react-router-dom";
import { Sessions } from "./Helper/Context";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";

// const app = initializeApp(firebaseConfig);

const db = getDatabase(); //Initialize database

// Fetch the tasks associated with logged in user from database
// Define a function that fetches tasks from the database and updates the state
const fetchTasks = (userId, setFields, setTopLevelFields, setCheckedMap) => {

  // Get a reference to the `tasks` table in the database for the specified `userId`
  const tasksRef = ref(db, `tasks/${userId}`);

  // Attach an event listener to the reference that listens for changes in data
  onValue(tasksRef, (snapshot) => {

    // Get the data from the snapshot
    const data = snapshot.val();

    // If there is data, process it
    if (data) {

      // Create an empty array to store the task objects
      const fields = [];

      // Create an empty object to store whether each task is checked or not
      const checkedMap = {};

      // Iterate over the task objects and push them to the `fields` array
      // Also set the checked state of each task in the `checkedMap` object
      for (const [id, task] of Object.entries(data)) {
        fields.push({
          id,
          label: task.label,
          checked: task.checked,
          children: task.children || [],
          parentId: task.parentId,
        });
        checkedMap[id] = task.checked;
      }

      // Update the `fields` state with the `fields` array
      setFields(fields);

      // Update the `checkedMap` state with the `checkedMap` object
      setCheckedMap(checkedMap);

      // Find the root tasks (tasks with no parent) and set them as the top-level tasks
      const topLevelFields = fields.filter(
        (field) => field.parentId || !field.parentId
      );
      setTopLevelFields(topLevelFields);
    }
  });
};

// start the definition of the component
const NewSessionTasks = (props) => {
  const [fields, setFields] = useState([]);
  const [topLevelFields, setTopLevelFields] = useState([]);
  const [checkedMap, setCheckedMap] = useState({});
  const { sessionsLength, setSessionsLength } = useContext(Sessions);
  const user = props.user;
  let navigate = useNavigate();
  setSessionsLength(topLevelFields.length);
  console.log(sessionsLength);

  // this hook is to fetch data from database if the logged in user has any saved data in db
  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setFields, setTopLevelFields, setCheckedMap);
    }
  }, [user]);

  // Define a function `saveTasksData` that saves the `fields` state to the database
const saveTasksData = () => {

  // Check if the user is logged in and has a UID
  if (user && user.uid) {

    // Get a reference to the `tasks` table in the database for the current user
    const tasksRef = ref(db, `tasks/${user.uid}`);

    // Create a new object to store the updated task data
    const newTasks = {};

    // Iterate over each task in the `fields` array and add it to the `newTasks` object
    fields.forEach((field) => {

      // Set the properties of the task object in the `newTasks` object
      newTasks[field.id] = {
        label: field.label,
        checked: checkedMap[field.id] !== undefined ? checkedMap[field.id] : field.checked,
        children: field.children || [],
        parentId: field.parentId || null,
      };
    });

    // Update the `tasks` table in the database with the new task data using the `set` function from the Firebase SDK
    set(tasksRef, newTasks)
      .then(() => {
        // Navigate to a new page
        navigate("/play-session");
        // alert("Data Added Successfuly")
      })
      .catch((error) => {
        // Display an error message if the update fails
        alert("An Error Occured, Please Try Again!")
      });
  }
};

  // Define a function `handleAddParent` that adds a new task to the `fields` and `topLevelFields` states
const handleAddParent = () => {
  console.log("function called");

  // Create a copy of the `fields` array using the spread operator
  const newFields = [...fields];

  // Generate a new ID for the task
  const newFieldId = Date.now();

  // Create a new task object with the generated ID and default values for the other properties
  const newField = {
    id: newFieldId,
    label: "",
    checked: false,
    children: [],
    parentId: null,
  };

  // Push the new task object to the `newFields` array
  newFields.push(newField);

  // Update the `fields` state with the new array using the `setFields` updater function
  setFields(newFields);

  // Create a copy of the `topLevelFields` array using the spread operator
  const newTopLevelFields = [...topLevelFields];

  // Push the new task object to the `newTopLevelFields` array
  newTopLevelFields.push(newField);

  // Update the `topLevelFields` state with the new array using the `setTopLevelFields` updater function
  setTopLevelFields(newTopLevelFields);
};

  // Define a function `handleAddField` that adds a new task to the `fields` state with a specified parent and depth
const handleAddField = (parentId, depth = 0) => {

  // Create a copy of the `fields` array using the spread operator
  const newFields = [...fields];

  // Find the index of the parent task in the `fields` array, or set it to -1 if no parent ID is provided
  const parentIndex = parentId ? fields.findIndex((field) => field.id === parentId) : -1;

  // Generate a new ID for the task
  const newFieldId = Date.now();

  // Create a new task object with the generated ID and default values for the other properties
  const newField = {
    id: newFieldId,
    label: "",
    checked: false,
    children: [],
    parentId: parentId || null, // set parentId to null if none exists
  };

  // If a parent ID is provided, add the new task as a child of the parent
  if (parentId !== undefined) {

    // If the depth is greater than 0, recursively add the new task as a child of the parent
    if (depth > 0) {
      newField.children.push(handleAddField(parentId, depth - 1));
    }

    // If the parent task exists, add the new task as a direct child of the parent
    if (parentIndex >= 0) {

      // If the parent task does not have any children, create a new empty array for its children
      if (!newFields[parentIndex].children) {
        newFields[parentIndex].children = [];
        console.log("added 1");
      }

      // Push the new task to the `children` array of the parent task
      newFields[parentIndex].children.push(newField);
      console.log("added 2");
    }
  } else {
    // If no parent ID is provided, add the new task as a top-level field
    newFields.push(newField);
    console.log("added 3");
  }

  // Push the new task to the `newFields` array
  newFields.push(newField);
  console.log("added 4");

  // Update the `fields` state with the new array using the `setFields` updater function
  setFields(newFields);
};


  // Define a function `handleDeleteField` that deletes a task from the `fields` state and the database
const handleDeleteField = (fieldId) => {

  // Get a reference to the task in the database
  const fieldRef = ref(db, `tasks/${user.uid}/${fieldId}`);

  // Attach an event listener to the reference that listens for changes in data
  onValue(fieldRef, (snapshot) => {

    // Check if the task exists in the database
    if (snapshot.exists()) {

      // If the task exists in the database, delete it from both the UI and the database

      // Create a new array that excludes the task to be deleted using the `filter` method
      const newFields = fields.filter((field) => field.id !== fieldId);

      // Update the `fields` state with the new array using the `setFields` updater function
      setFields(newFields);

      // Remove the task from the database using the `remove` function from the Firebase SDK
      remove(fieldRef)
        .then(() => {})
        .catch((error) => {});
    } else {

      // If the task does not exist in the database, delete it from the UI only

      // Create a new array that excludes the task to be deleted using the `filter` method
      const newFields = fields.filter((field) => field.id !== fieldId);

      // Update the `fields` state with the new array using the `setFields` updater function
      setFields(newFields);
    }
  });
};

  // Define a function `handleChange` that updates the label of a task in the `fields` state
const handleChange = (fieldId, e) => {

  // Create a copy of the `fields` array using the spread operator
  const newFields = [...fields];

  // Find the index of the task in the `fields` array
  const fieldIndex = fields.findIndex((x) => x.id === fieldId);

  // If the task exists in the `fields` array, update its label property with the new value
  if (fieldIndex !== -1) {
    newFields[fieldIndex].label = e.target.value;

    // Update the `fields` state with the new array using the `setFields` updater function
    setFields(newFields);
  }
};

  // Define a function `handleCheckboxChange` that updates the checked state of a task in the `fields` state
const handleCheckboxChange = (fieldId) => {

  // Create a copy of the `checkedMap` object using the spread operator
  const newCheckedMap = {...checkedMap};

  // Invert the checked state of the task with the specified ID in the `newCheckedMap` object
  newCheckedMap[fieldId] = !newCheckedMap[fieldId];

  // Update the `checkedMap` state with the new object using the `setCheckedMap` updater function
  setCheckedMap(newCheckedMap);

  // Create a new array that maps each task in the `fields` array to a new object with the updated `checked` property
  const newFields = fields.map((field) =>
    field.id === fieldId ? { ...field, checked: newCheckedMap[fieldId] } : field
  );

  // Update the `fields` state with the new array using the `setFields` updater function
  setFields(newFields);
};

  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <div>
          <span className="titleDE">[DE]</span>
          <span className="titleTHREADER">THREADER</span>
        </div>
        <p>Take your big task apart, thread by thread</p>

        <div className="createTasksContainer">
          <TreeView
            data={topLevelFields}
            handleAddField={handleAddField}
            handleDeleteField={handleDeleteField}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            checkedMap={checkedMap}
          />
          <button onClick={handleAddParent}>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "#ffffff" }}
              size={"lg"}
            />
          </button>
          <label style={{ marginLeft: "10px" }}>Add Task</label>
        </div>
      </div>
      <button className="go-btn" onClick={saveTasksData}>
        Next
      </button>
    </div>
  );
};

export default NewSessionTasks;
