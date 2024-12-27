export const getColumnKey = (columnName) => {
  const columnMap = {
    "To Do": "todo",
    "In Progress": "inProgress",
    Done: "done",
  };
  return columnMap[columnName];
};
