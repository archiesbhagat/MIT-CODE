// For storing history of actions
let history = [];
let currentIndex = -1;

export const addActionToHistory = (action) => {
  // Remove future actions if there are any
  history = history.slice(0, currentIndex + 1);
  // Add the new action
  history.push(action);
  currentIndex = history.length - 1;
};

export const getHistory = () => history.slice(0, currentIndex + 1); // Return up to the current index

export const replayActions = (callback) => {
  getHistory().forEach((action, index) => {
    setTimeout(() => {
      callback(action);
    }, index * 1000); // Adjust the delay as needed
  });
};

export const undo = () => {
  if (currentIndex >= 0) {
    currentIndex--;
    return history[currentIndex + 1]; // Return the action that was undone
  }
  return null;
};

export const redo = () => {
  if (currentIndex < history.length - 1) {
    currentIndex++;
    return history[currentIndex]; // Return the action that was redone
  }
  return null;
};
