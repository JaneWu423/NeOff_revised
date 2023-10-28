import './App.css';
import React, { useState } from 'react';


const NeonText = ({text}) => {
  return (
    <div className="neon-text-flicker">
      {text}
    </div>
  )
}

function App() {
  let [text, setText] = useState("");

  const neonEffect = function () {
    text = !text?"Neon Effect":""
    setText(text);
    console.log(text);
  }
  return (
    <div className="App" style={{backgroundColor:"black"}}>
      <header className="App-header">
      </header>
      <div className="container">
        <div className="neon-btn" onClick={neonEffect}>Click Me</div>
        <div style={{marginTop:"1em"}}>
          <NeonText text={text} />
        </div>
      </div>
    </div>
  );
}

export default App;
