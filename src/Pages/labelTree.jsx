import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { Sessions } from "./Helper/Context";
import "./Style.css"

const db = getDatabase(); //Initialize database

// Fetch the tasks associated with logged in user from database
// Define a function that fetches tasks from the database and updates the state
const createDataTree = dataset => {
  const hashTable = Object.create(null);
  dataset.forEach(aData => hashTable[aData.id] = { ...aData, children: [] });
  const dataTree = [];
  dataset.forEach(aData => {
    if (aData.parentId) hashTable[aData.parentId].children.push(hashTable[aData.id])
    else dataTree.push(hashTable[aData.id])
  });
  return dataTree;
};
function LabelTree({ fields,setFields }) {

  const handleCheckboxChange = (fieldId) => {
    const newFields = fields.map((field) =>
      field.id === fieldId
        ? { ...field, checked: !field.checked }
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
              className="checkmark"
              checked={node.checked} // update this
              onChange={() => handleCheckboxChange(node.id)}
            />
          </div>
          <div className="label-field" style={{ color: "#FFFFFF" }}>
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
  const renderData = createDataTree(fields)
  return (
    <>
      <div className="treeContainer">{renderTree(renderData)}</div>
    </>);
}

export default LabelTree;
