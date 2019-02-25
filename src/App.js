import React, { Component } from 'react';
import styled from 'styled-components';


class App extends Component {
  render() {
    return (
      <div className="App">
        <headerStyles className="App-header">
        <h1>Radio Mirror</h1>
          <p>
            Type or paste your speech in the box below.<br/> 
            Press play to hear how it sounds, stop to stop, <br/> 
            and save to save desirable outputs.
          </p>
        </headerStyles>
        <formStyles>
        <form>
          <textarea 
            rows="20"
            cols="50"
          >
            Text here... 
          </textarea>
          <br/>
          <button>Play</button>
          <button>Stop</button>
          <button>Save</button>
        </form>
        <br/>
        <p>Saved Speeches</p>
        <select>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        </formStyles>
      </div>
    );
  }
}

const formStyles = styled.div`
  margin: 30px 30px 30px 30px;
`

const headerStyles = styled.header`
  background-color: #282c34;
  text-align: center;
  font-size: calc(18px + 2vmin);
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export default App;
