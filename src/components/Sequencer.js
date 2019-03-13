import React, {Component} from 'react'
import Tone from 'tone';
import SamplerSeq from './SamplerSeq'
import BD from '../sounds/BD_808_01.wav'
import SN from '../sounds/Snare_808_01.wav'
import HH from '../sounds/CH_808_01.wav'
import OH from '../sounds/OH_A_808_03.wav'

// let defaultPattern = {
//   bd: [1, 0, 0, 0, 0, 1, 0, 0],
//   sn: [0, 0, 1, 0, 0, 0, 1, 0],
//   hh: [1, 1, 1, 1, 1, 0, 1, 1],
//   oh: [0, 0, 0, 0, 0, 1, 0, 0]
// }

const emptyPattern = {
  bd: [...Array(16).fill(0)],
  sn: [...Array(16).fill(0)],
  hh: [...Array(16).fill(0)],
  oh: [...Array(16).fill(0)]
}

const buffered = {
  bd : new Tone.Buffer(BD),
  sn : new Tone.Buffer(SN),
  hh : new Tone.Buffer(HH),
  oh : new Tone.Buffer(OH) 
}

const drumSamples = {
  bd : new Tone.Player(buffered.bd).toMaster(),
  sn : new Tone.Player(buffered.sn).toMaster(),
  hh : new Tone.Player(buffered.hh).toMaster(),
  oh : new Tone.Player(buffered.oh).toMaster() 
}

class Sequencer extends Component {

  state = {
    index: 0,
    steps: 16,
    play: false,
    timing: "16n",
    sequence:{
      "bd":[],
      "sn":[],
      "hh":[],
      "oh":[]
    }
  }

  componentDidMount(){
    this.setState({sequence:{...emptyPattern}})
  }

  handleChange = (on,i,sound) => {
    const {sequence} = this.state
    let sequenceUpdate = {...sequence}
    console.log('BEFORE',on,sequenceUpdate,sequenceUpdate[sound][i])
    if (on === 0) {sequenceUpdate[sound][i] = 1 }
    else{sequenceUpdate[sound][i] = 0}
    console.log('AFTER',sequenceUpdate,sequenceUpdate[sound][i])
    this.setState({sequence: sequenceUpdate})
  }

  transport = () =>{
    let bpmTiming = 90
    Tone.Transport.bpm.value = bpmTiming;
    Tone.Transport.scheduleRepeat(this.repeat, this.state.timing);
    Tone.Transport.bpm.value = bpmTiming; 
  }
    
  playStop = () => {
    this.transport()
    this.setState({play: !this.state.play},
    () => this.state.play ? Tone.Transport.start() : Tone.Transport.stop())
  }

  repeat = () =>{
    const {steps, index} = this.state
    
    let step = index % steps;

    let bdInputs = document.querySelector(
      `.bd div:nth-child(${step + 1})`
    );
    let snInputs = document.querySelector(
      `.sn div:nth-child(${step + 1})`
    );
    let hhInputs = document.querySelector(
      `.hh div:nth-child(${step + 1})`
    );
    let ohInputs = document.querySelector(
      `.oh div:nth-child(${step + 1})`
    );
      
      if (bdInputs.dataset.checked === "1") {
        drumSamples.bd.start();
      }
      if (snInputs.dataset.checked === "1") {
        drumSamples.sn.start();
      }
      if (hhInputs.dataset.checked === "1") {
        drumSamples.hh.start();
      }
      if (ohInputs.dataset.checked === "1") {
        drumSamples.oh.start();
      }
  
    this.setState({index: index + 1})
    console.log(index)
  } 

  render(){
    const {sequence} = this.state

  return(

    <React.Fragment>
      <SamplerSeq sound={{sample: drumSamples.bd, type:"bd"}} sequence={sequence.bd} handleChange={this.handleChange}/>
      <SamplerSeq sound={{sample: drumSamples.sn, type:"sn"}} sequence={sequence.sn} handleChange={this.handleChange}/>
      <SamplerSeq sound={{sample: drumSamples.hh, type:"hh"}} sequence={sequence.hh} handleChange={this.handleChange}/>
      <SamplerSeq sound={{sample: drumSamples.oh, type:"oh"}} sequence={sequence.oh} handleChange={this.handleChange}/>
      <button onClick={this.playStop}>{!this.state.play ? "play" : "stop" }</button>
    </React.Fragment>
  )
  }
}

export default Sequencer