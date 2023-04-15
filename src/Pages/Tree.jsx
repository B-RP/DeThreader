import React, { useState } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//const tree = ({}) => {}
const createDataTree = dataset => {
  const hashTable = Object.create(null);
  dataset.forEach(aData => hashTable[aData.id] = {...aData, children: []});
  const dataTree = [];
  dataset.forEach(aData => {
    if(aData.parentId) hashTable[aData.parentId].children.push(hashTable[aData.id])
    else dataTree.push(hashTable[aData.id])
  });
  return dataTree;
};
const Tree = ({
  data,
  handleAddField,
  handleDeleteField,
  handleChange
}) => {
  console.log("this is the data",data)
  const renderData = createDataTree(data)
  const renderTree = (nodes, depth = 0) => {
    if (!nodes) {
      return null;
    }
    return nodes.map((node) => (
      <div key={node.id}>
        <div className={`task-container depth-${depth}`}>
          <div className="text-field">
            <input
              type="text"
              className={`texts`}
              value={node.label}
              onChange={(e) => handleChange(node.id, e)}
            />
          </div>
          <div className="addContainer">
            <button onClick={() => handleAddField(node.id)}>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "#ffffff" }}
                size={"lg"}
              />
            </button>
          </div>
          <div className="deleteContainer">
            <button onClick={() => handleDeleteField(node.id)}>
              <FontAwesomeIcon
                icon={faMinus}
                style={{ color: "#ffffff" }}
                size={"lg"}
              />
            </button>
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

  return <div className="treeContainer">{renderTree(renderData)}</div>;
};

export { Tree };
