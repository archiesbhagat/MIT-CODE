import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GitHubIcon from "@material-ui/icons/GitHub";
import {
  addActionToHistory,
  replayActions,
  getHistory,
} from "./components/history"; // Ensure these functions are correctly imported

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App({ complist }) {
  const classes = useStyles();
  const [isReplaying, setIsReplaying] = useState(false);
  const [history, setHistory] = useState([]);

  // Update Lists of Mid Area
  const onDragEnd = (result) => {
    if (!result.destination) return;

    let element = result.draggableId.split("-")[0];

    const old_list = complist.midAreaLists;
    let source_index = old_list.findIndex(
      (x) => x.id === result.source.droppableId
    );
    if (source_index > -1) {
      let comp_list = old_list[source_index].comps;
      comp_list.splice(result.source.index, 1);
      old_list[source_index].comps = comp_list;
    }

    let dest_index = old_list.findIndex(
      (x) => x.id === result.destination.droppableId
    );

    if (dest_index > -1) {
      let dest_comp_list = old_list[dest_index].comps;
      dest_comp_list.splice(result.destination.index, 0, `${element}`);
      old_list[dest_index].comps = dest_comp_list;
    }

    // Add the action to history
    addActionToHistory({
      type: "MOVE_BLOCK",
      blockId: element,
      source: result.source.droppableId,
      destination: result.destination.droppableId,
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    });
  };

  const handleReplay = () => {
    setIsReplaying(true);
    replayActions((action) => {
      console.log("Replaying action:", action);
      // You might want to update the state or trigger a re-render here based on the action
    }).finally(() => {
      setIsReplaying(false);
    });
  };

  const handleShowHistory = () => {
    const historyData = getHistory();
    setHistory(historyData);
  };

  return (
    <div className="bg-blue-100 font-sans">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Scratch app
            </Typography>
            <Button
              color="inherit"
              onClick={handleReplay}
              disabled={isReplaying}
            >
              Replay Actions
            </Button>
            <Button color="inherit" onClick={handleShowHistory}>
              Show History
            </Button>
            <Button color="inherit">
              <GitHubIcon
                onClick={() =>
                  (window.location.href = "https://github.com/archiesbhagat")
                }
              />
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div className="h-screen overflow-hidden flex flex-row pt-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar />
            <MidArea />
          </div>
          <div className="w-1/3 relative h-screen overflow-scroll flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
            <PreviewArea />
          </div>
        </DragDropContext>
      </div>
      <div className="p-4">
        <h2>History:</h2>
        <pre>{JSON.stringify(history, null, 2)}</pre>
      </div>
    </div>
  );
}

// mapping state to props
const mapStateToProps = (state) => {
  return {
    complist: state.list,
  };
};

export default connect(mapStateToProps)(App);
