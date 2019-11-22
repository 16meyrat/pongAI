import p5 from "p5";
import Plotly from "plotly.js-dist";

import Evolution from "./evolution";
import Pong from "./pong";
import _ from "lodash";
import { HumanPlayer, AIPlayer } from "./player";


var game = null;

let s = (sk) => {

  sk.setup = () => {
    let canvas = sk.createCanvas(500, 500);
    canvas.parent("canvas-container");
    sk.rectMode(sk.RADIUS);
    sk.frameRate(30);
  }

  sk.draw = () => {
    sk.clear();
    if (game) {
      game.update(sk.deltaTime);
      game.render(sk);
    }
  }
}

const P5 = new p5(s);

const evo = new Evolution();

const avgScores = [];
const bestScores = [];
const generations = [];


window.nextGeneration = () => {
  computeNextGeneration(true);
}

window.autoEvolve = () => {
  const button = document.getElementById("autoEvolve");
  button.innerText = "Stop";

  let continueRunning = true;
  button.onclick = () => {
    continueRunning = false;
    button.innerText = "Run";
    button.onclick = window.autoEvolve;
  }

  // use timeout not to block the CPU for a long time
  const computation = () => {
    computeNextGeneration(false);
    if (continueRunning){
      setTimeout(computation, 0);
    }else{
      computeNextGeneration(true);
    }
  }
  setTimeout(computation, 0);
}

window.challengeHuman = () => {
  const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), _.cloneDeep(evo.neat.getFittest()));
  const player1 = new HumanPlayer(new p5.Vector(0.05, 0.5));
  game = new Pong(player1, player2);
}

window.playGame = () =>  {
  const player1 = new AIPlayer(new p5.Vector(0.05, 0.5), _.cloneDeep(evo.neat.getFittest()));
  const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), _.cloneDeep(evo.neat.getFittest()));
  game = new Pong(player1, player2);
}

const computeNextGeneration = (runGame) => {
  if (evo.neat.generation > 0) {
    evo.nextGeneration();
  }

  evo.evaluate();

  const fittest = evo.neat.getFittest();
  console.log(fittest);

  document.getElementById("generationNb").textContent = evo.neat.generation;
  document.getElementById("avgScore").textContent = evo.neat.getAverage();
  document.getElementById("bestScore").textContent = fittest.score;

  generations.push(evo.neat.generation);
  avgScores.push(evo.neat.getAverage());
  bestScores.push(fittest.score);
  plotScores();

  drawGraph(fittest.graph(500, 500), ".draw");
  if (runGame) {
    setTimeout(() => {
      const player1 = new AIPlayer(new p5.Vector(0.05, 0.5), _.cloneDeep(fittest));
      const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), _.cloneDeep(fittest));
      game = new Pong(player1, player2);
    }, 500);
  }


  evo.neat.generation++;
}

function plotScores() {
  let avgScore = {
    x: generations,
    y: avgScores,
    mode: 'lines+markers',
    type: 'scatter'
  };

  let bestScore = {
    x: generations,
    y: bestScores,
    mode: 'lines+markers',
    type: 'scatter'
  };

  Plotly.newPlot('plot', [avgScore, bestScore]);
}