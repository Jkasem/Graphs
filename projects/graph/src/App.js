import React, { Component } from 'react';
import { Graph } from './graph';
import './App.css';

// !!! IMPLEMENT ME
const canvasWidth = 750;
const canvasHeight = 650;

/**
 * GraphView
 */
class GraphView extends Component {
  /**
   * On mount
   */
  componentDidMount() {
    this.updateCanvas();
  }

  /**
   * On state update
   */
  componentDidUpdate() {
    this.updateCanvas();
  }

  /**
   * Render the canvas
   */
  getRndColor() {
    const r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  handleClick(e) {
    const canvas = this.refs.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const v of this.props.graph.vertexes) {
        if ((x >= v.pos.x - 20 && x <= v.pos.x + 20) && (y >= v.pos.y - 20 && y <= v.pos.y + 20)){
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.lineWidth = 8;
          ctx.strokeStyle = 'black';
          ctx.arc(v.pos.x, v.pos.y, 21, 0, Math.PI * 2, true);
          ctx.stroke();
          break;
        }
      }
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // New Graph on each update
    const g = this.props.graph;
    g.randomize(5, 4, 150, 0.6);
    const connectedComponents = g.getConnectedComponents();

    for (const subgraph of connectedComponents) {
      const color = this.getRndColor();
      for (const v of subgraph) {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(v.pos.x, v.pos.y, 20, 0, Math.PI * 2, true);
          ctx.fill();
          for (let e of v.edges) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth=e.weight;
            ctx.moveTo(v.pos.x, v.pos.y);
            ctx.lineTo(e.destination.pos.x, e.destination.pos.y);
            ctx.closePath();
            ctx.stroke();

            ctx.font = '10px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(`${e.weight}`, (v.pos.x + e.destination.pos.x) / 2, (v.pos.y + e.destination.pos.y) / 2);
          }
      }
      for (let v of subgraph) {
        ctx.font = '18px serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`${v.value}`, v.pos.x - 10, v.pos.y + 4);
      }
    }
  }
  
  /**
   * Render
   */
  render() {
    this.handleClick = this.handleClick.bind(this);
    return (
    <div>
      <canvas onClick={this.handleClick} ref="canvas" width={canvasWidth} height={canvasHeight}></canvas>
    </div>
    );
  }
}


/**
 * App
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: new Graph(),
    };
  }

  newGraph = () => {
    const newGraph = new Graph();
    this.setState({ graph: newGraph });
  }

  listen = () => {
    this.setState({ listening: true });
  }

  render() {
    return (
      <div className="App">
        <GraphView graph={this.state.graph}></GraphView>
        <button onClick={this.newGraph}>MORE!</button>
      </div>
    );
  }
}

export default App;
