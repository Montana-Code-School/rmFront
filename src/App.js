import React, { Component } from 'react';
import styled from 'styled-components';

const baseURL = process.env.NODE_ENV === "development" ? 'http://localhost:3001' : 'https://radio-mirror-back.herokuapp.com/' ;

class App extends Component {
  state = {
    speeches: [],
    title:'',
    content:''
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
      const sayThis = new SpeechSynthesisUtterance(this.state.content);
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
    event.stopPropagation();
    this.setState({[event.target.name]: event.target.value});
  }

  addSpeech = (e) => {
    e.preventDefault();
    const {title, content} = this.state;
    if (!title || !content) {
      return;
    }
    //use body instead of query in path for parameters?
    fetch(`http://localhost:3001`, {
        method: "POST",
        body: JSON.stringify({title, content}),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then((newSpeech) => {
        const updatedSpeeches = this.state.speeches.slice();
        updatedSpeeches.push(newSpeech);
        this.setState({
          speeches: updatedSpeeches,
          title: "",
          content: ""
        });
      });
  }

  seeSavedSpeech = (e) => {
    e.preventDefault();
    const { speeches } = this.state;
    const { title, content } = speeches.find( (currentSpeech) => currentSpeech._id === e.currentTarget.value)
    this.setState({
      title,
      content
    })
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
          <form onSubmit={ (e) => e.preventDefault()}>
            <input
              type="text"
              id="SpeechTitle"
              name="title"
              placeholder="Enter new title"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <br/>
            <textarea
              rows="20"
              cols="50"
              name="content"
              placeholder="Enter new speech"
              value={this.state.content}
              onChange={this.handleChange}
            />
            <br/>
          </form>
          <button name="contribute" onClick={this.addSpeech}>Save</button>
          <button onClick={this.speak}>Play</button>
          <button onClick={this.stop}>Stop</button>
          <br/>
          <p>Saved Speeches</p>
          <select onChange={this.seeSavedSpeech}>
            {this.state.speeches.map( (speech) =>
              <option value={speech._id} key={speech._id} >{speech.title}</option>
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
