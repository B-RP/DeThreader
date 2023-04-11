import React, { useState } from "react";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Tree = ({
  data,
  handleAddField,
  handleDeleteField,
  handleChange,
  handleCheckboxChange,
  checkedMap,
}) => {
  const renderTree = (nodes, depth = 0) => {
    if (!nodes) {
      return null;
    }
    return nodes.map((node) => (
      <div key={node.id}>
        <div className={`task-container depth-${depth}`}>
          <div className="checkboxContainer">
            <input
              type="checkbox"
              checked={checkedMap[node.id] || node.checked} // update this
              onChange={() => handleCheckboxChange(node.id)}
            />
          </div>
          <div className="text-field">
            <input
              type="text"
              className={`texts ${checkedMap[node.id] || node.checked ? "checked" : ""}`}
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

  return <div className="treeContainer">{renderTree(data)}</div>;
};

export { Tree };
