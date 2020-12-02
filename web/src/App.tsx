import React, {useContext} from "react";
import './App.css';
import Button from "./components/Button";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import MazeContainer from "./components/MazeContainer";

function App() {
    return (
      <div className="app">
        <div style={{ display: 'flex' }} >
          <Button title='Start Game' bgColor='green' />
          <Button title='End Game' bgColor='red' />
        </div>
        <DndProvider backend={HTML5Backend} >
          <div className='maze'>
            <MazeContainer hideSourceOnDrag={true}/>
          </div>
        </DndProvider>

      </div>
    );
}

export default App;
