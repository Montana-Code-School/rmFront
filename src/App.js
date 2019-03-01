import React, { Component } from 'react';
import styled from 'styled-components';

const baseURL = process.env.NODE_ENV === "development" ? 'http://localhost:3001' : 'https://radio-mirror-back.herokuapp.com/' ;

class App extends Component {
  state = {
    speeches: [],
    title:'',
    content:'',
    _id: ''
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
    const { title, content, _id } = this.state;
    if (!title || !content) {
      return;
    }
    if(_id){
      fetch(baseURL, {
        method: "PUT",
        body: JSON.stringify({ title, content, _id }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then((newSpeech) => {
        const { speeches } = this.state;
        const updatedSpeeches = speeches.slice();
        const oldSpeechIndex = speeches.findIndex( (currentSpeech) => currentSpeech._id === _id)
        updatedSpeeches.splice(oldSpeechIndex, 1, newSpeech);
        this.setState({
          speeches: updatedSpeeches,
          title: '',
          content: '',
          _id: '',
        });
      });
    }

    if (!_id){
      fetch(baseURL, {
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
  }

  seeSavedSpeech = (e) => {
    e.preventDefault();
    const { speeches } = this.state;
    const { title, content, _id } = speeches.find( (currentSpeech) => currentSpeech._id === e.currentTarget.value)
    this.setState({
      title,
      content,
      _id
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
            <StyledInput
              type="text"
              id="SpeechTitle"
              name="title"
              placeholder="Enter new title"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <br/>
            <StyledTextarea
              rows="10"
              cols="30"
              name="content"
              placeholder="Enter new speech"
              value={this.state.content}
              onChange={this.handleChange}
            />
            <br/>
          </form>
          <ButtonWrapper>
            <ButtonStyles displayText={"Save"} buttonClass={"save-button button-shadow"} buttonName={"contribute"} buttonHandler={this.addSpeech} _id={this.state._id}/>
            <ButtonStyles displayText={"Play"} buttonClass={"play-button button-shadow"} buttonHandler={this.speak}/>
            <ButtonStyles displayText={"Stop"} buttonClass={"stop-button button-shadow"} buttonHandler={this.stop}/>
          </ButtonWrapper>
          
          <br/>
          <StyledP>Saved Speeches</StyledP>
          <StyledSelect onChange={this.seeSavedSpeech}>
            {this.state.speeches.map( (speech) =>
              <option value={speech._id} key={speech._id} >{speech.title}</option>
            )}
          </StyledSelect>
        </FormStyles>
      </div>
    );
  }
}

const StyledP = styled.p`
  font-size: x-large;
`

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 25px;
  font-size: x-large;
  background-color: #fffff0;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
`

const ButtonStyles = ({_id, buttonHandler, buttonName, buttonClass, displayText}) => {
  return(
    <button name={buttonName} value={_id} onClick={buttonHandler} className={buttonClass}>{displayText}</button>
  )
}

const StyledTextarea = styled.textarea`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 25px;
  font-size: x-large;
  background-color: #fffff0;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
`

const StyledInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 25px;
  font-size: x-large;
  background-color: #fffff0;
  -webkit-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  -moz-box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
  box-shadow: 3px 6px 25px -6px rgba(0,0,0,0.75);
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const FormStyles = styled.div`
  margin: 30px 30px 30px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const HeaderStyles = styled.header`
  padding: 5px;
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
