import p5 from "p5";

import Pong from "./pong.js";
import {AIPlayer} from "./player.js";

const Neat = neataptic.Neat;
const Methods = neataptic.Methods;

export default class Evolution {

    // initialise population
    constructor(){

        const baseNetwork = new neataptic.Architect.Random(
            2+2+2,
            0,
            1
        )

        for (let node of baseNetwork.nodes){
            node.squash = Methods.Activation.TANH;
        }

        Methods.Mutation.MOD_ACTIVATION.allowed = [
            Methods.Activation.TANH,
        ];

        Methods.Mutation.MOD_ACTIVATION.allowed = [
            Methods.Activation.TANH,
        ];

        this.neat = new Neat(
            2 + 2 + 2,
            1,
            null,
            {
              mutation: [
                    Methods.Mutation.ADD_NODE,
                    Methods.Mutation.SUB_NODE,
                    Methods.Mutation.ADD_CONN,
                    Methods.Mutation.SUB_CONN,
                    Methods.Mutation.MOD_WEIGHT,
                    Methods.Mutation.MOD_BIAS,
                    Methods.Mutation.ADD_GATE,
                    Methods.Mutation.SUB_GATE,
              ],
              selection: Methods.Selection.TOURNAMENT,
              popsize: 40,
              mutationRate: 0.25,
              elitism: 5,
              network: baseNetwork,
            }
        );
    }

    // evaluate all individuals by making them compete againts each other. 4 games per players
    evaluate(){
        for (let brain of this.neat.population){
            const player1 = new AIPlayer(new p5.Vector(0.05, 0.5), brain);
            const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), brain);
            const game = new Pong(player1, player2);
            while(game.score < 30){
                const res = game.update(33.3);
                if (res.end){
                    break;
                }
            }
            // each brain plays againts itself
            brain.score = game.score;  
        }
    }

    // perform mutation / crossover
    nextGeneration(){
        console.log('Generation:', this.neat.generation, '- average score:', this.neat.getAverage());
      
        this.neat.sort();
        let newPopulation = [];
      
        // Elitism
        for(let i = 0; i < this.neat.elitism; i++){
          newPopulation.push(this.neat.population[i]);
        }
      
        // Breed the next individuals
        for(let i = 0; i < this.neat.popsize - this.neat.elitism; i++){
          newPopulation.push(this.neat.getOffspring());
        }
      
        // Replace the old population with the new population
        this.neat.population = newPopulation;
        this.neat.mutate();
      
      }
}
