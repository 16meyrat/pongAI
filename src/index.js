import p5 from "p5";

import Pong from "./pong";
import {HumanPlayer} from "./player";

let s = (sk) => {    

  const player1 = new HumanPlayer(new p5.Vector(0.05, 0));
  const player2 = new HumanPlayer(new p5.Vector(1 - 0.05, 0));
  const  game = new Pong(player1, player2);

  sk.setup = () => {
    let canvas = sk.createCanvas(500, 500);
    canvas.parent("canvas-container");
    sk.rectMode(sk.RADIUS);
    sk.frameRate(30);
  }
  
  sk.draw = () => {
    sk.clear();
    game.update(sk.deltaTime);
    game.render(sk);
  }
}

const P5 = new p5(s);