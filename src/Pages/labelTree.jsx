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
  let renderData = createDataTree(fields)

  function getBottomUp(node, path) {
    let uncheckedChilds = !!node.children.filter(n => !n.checked).length;
    if (node.children.length == 0) {
      return node
    }
    return {
      ...node,
      checked: !uncheckedChilds,
      children: node.children.map(v => getBottomUp(v, path))
    }
  }
  for (let i = 0; i < 5; i++) {
    renderData = renderData.map(n => getBottomUp(n))
  }
  const handleCheckboxChange = (fieldId, node, checked) => {
    let descendants = [fieldId]
    function recurseAndAdd(node) {
      descendants.push(node.id);
      var children = node.children;
      for (let i = 0; i < children.length; i++) {
        recurseAndAdd(children[i]);
      }
    }
    recurseAndAdd(node)
    const newFields = fields.map((field) => {
      if (descendants.includes(field.id)) {
        return { ...field, checked }
      } else {
        return field
      }
    });
    return newFields
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
              onChange={(e) => {
                const updatedTree = handleCheckboxChange(node.id, node, e.target.checked)
                setFields(updatedTree);
              }}
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
  return (
    <>
      <div className="treeContainer">{renderTree(renderData)}</div>
    </>);
}

export default LabelTree;
