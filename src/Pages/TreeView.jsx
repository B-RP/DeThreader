import React from "react";
import { Tree } from "./Tree";

const TreeView = ({ data, handleAddField, handleDeleteField, handleChange, handleCheckboxChange, checkedMap}) => {
  return (
    <div>
      <Tree
        data={data}
        handleAddField={handleAddField}
        handleDeleteField={handleDeleteField}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        checkedMap={checkedMap}
      />
    </div>
  );
};

export { TreeView };
