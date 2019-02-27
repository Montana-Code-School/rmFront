import React, { Component } from 'react';
import styled from 'styled-components';

const baseURL = process.env.NODE_ENV === "development" ? 'http://localhost:3001' : 'https://radio-mirror-back.herokuapp.com/' ;

class App extends Component {
  state = {
    speeches: [],
    textToSay: "I am great and powerful, it is what it is",

  }

  synth = window.speechSynthesis;

  componentDidMount() {
    this.synth.cancel();
    fetch(baseURL)
      .then(response => response.json())
      .then((myJson) => {
        this.setState({speeches: myJson});
      })
  }

  componentWillUnmount() {
    this.synth.cancel();
  }

  speak = (event) => {
    event.preventDefault();
    if(this.synth.paused) {
      this.synth.resume();
    } else if (!this.synth.speaking) {
      const sayThis = new SpeechSynthesisUtterance(this.state.textToSay);
      this.synth.speak(sayThis);
    }
  }
  stop = (event) => {
    event.preventDefault();
    if (this.synth.speaking){
      this.synth.pause();
    }
  }
  handleChange = (event) => {
    event.preventDefault();
    this.setState({textToSay: event.target.value})
  }
   render() {
    return (
      <div className="App">
        <HeaderStyles className="App-header">
        <h1>Radio Mirror</h1>
          <p>
            Type or paste your speech in the box below.<br/>
            Press play to hear how it sounds, stop to stop, <br/>
            and save to save desirable outputs.
          </p>
        </HeaderStyles>
        <FormStyles>
        <form>
          <textarea
            rows="20"
            cols="50"
            value={this.state.textToSay}
            onChange={this.handleChange}
          />
          <br/>
          <button onClick={this.speak}>Play</button>
          <button onClick={this.stop}>Stop</button>
          <button>Save</button>
        </form>
        <br/>
        <p>Saved Speeches</p>
        <select>
          {this.state.speeches.map( (speech) =>
            <option value={speech.title} key={speech._id} >{speech.title}</option>
          )}

        </select>
        </FormStyles>
      </div>
    );
  }
}

const FormStyles = styled.div`
  margin: 30px 30px 30px 30px;
`

const HeaderStyles = styled.header`
  background-color: #282c34;
  text-align: center;
  font-size: calc(18px + 2vmin);
  color: white;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export default App;
