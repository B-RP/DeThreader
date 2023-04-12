import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { Sessions } from "./Helper/Context";

const db = getDatabase(); //Initialize database

// Fetch the tasks associated with logged in user from database
// Define a function that fetches tasks from the database and updates the state

function LabelTree(props) {
  const [fields, setFields] = useState([]);
  const [topLevelFields, setTopLevelFields] = useState([]);
  const [checkedMap, setCheckedMap] = useState({});
  const { sessionsLength, setSessionsLength } = useContext(Sessions);

  const user = props.user;

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
        setSessionsLength(topLevelFields.length);
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setFields, setTopLevelFields, setCheckedMap);
    }
  }, [user]);

  const handleCheckboxChange = (fieldId) => {
    const newCheckedMap = { ...checkedMap };
    newCheckedMap[fieldId] = !newCheckedMap[fieldId];
    setCheckedMap(newCheckedMap);
    const newFields = fields.map((field) =>
      field.id === fieldId
        ? { ...field, checked: newCheckedMap[fieldId] }
        : field
    );
    setFields(newFields);
  };

  const renderTree = (fields, depth = 0) => {
    if (!fields) {
      return null;
    }
    return fields.map((node) => (
      <div key={node.id}>
        <div className={`task-container depth-${depth}`}>
          <div className="checkboxContainer">
            <input
              type="checkbox"
              checked={checkedMap[node.id] || node.checked} // update this
              onChange={() => handleCheckboxChange(node.id)}
            />
          </div>
          <div className="label-field" style={{color: "#FFFFFF"}}>
            <label
            type="text"
              className={`texts ${node.checked ? "checked" : ""}`}
            >{node.label}</label>
          </div>
        </div>
        {/* {node.children && node.children.length > 0 && ( */}
        <div className="childrenContainer" style={{ marginLeft: "20px" }}>
          {renderTree(node.children, depth + 1)}
        </div>
        {/* )} */}
      </div>
    ));
  };
    return (
        <>
            <div className="treeContainer">{renderTree(fields)}</div>
        </>);
}

export default LabelTree;
