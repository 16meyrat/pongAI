import p5 from "p5";

import Pong from "./pong.js";
import {AIPlayer} from "./player.js";

const Neat = neataptic.Neat;
const Methods = neataptic.Methods;

export default class Evolution {

    // initialise population
    constructor(){

        const baseNetwork = new neataptic.Architect.Random(
            2+2+2+2,
            2,
            1
        )

        for (let node of baseNetwork.nodes){
            node.squash = Methods.Activation.TANH;
        }

        this.neat = new Neat(
            2 + 2 + 2 + 2,
            2,
            null,
            {
              mutation: [
                    Methods.Mutation.ADD_NODE,
                    Methods.Mutation.SUB_NODE,
                    Methods.Mutation.ADD_CONN,
                    Methods.Mutation.SUB_CONN,
                    Methods.Mutation.MOD_WEIGHT,
                    Methods.Mutation.MOD_BIAS,
                    Methods.Mutation.MOD_ACTIVATION,
                    Methods.Mutation.ADD_GATE,
                    Methods.Mutation.SUB_GATE,
                    Methods.Mutation.ADD_SELF_CONN,
                    Methods.Mutation.SUB_SELF_CONN,
                    Methods.Mutation.ADD_BACK_CONN,
                    Methods.Mutation.SUB_BACK_CONN,
              ],
              popsize: 40,
              mutationRate: 0.3,
              elitism: 5,
              network: baseNetwork,
            }
        );
    }

    // evaluate all individuals by making them compete againts each other. 4 games per players
    evaluate(){
        let availableOpponents = [];
        for (let [index, brain] of this.neat.population.entries()){
            brain.score = 0;
            brain.utilisations = 0;
            availableOpponents.push(index);
        }

        const getPlayerPair = () => {
            if (availableOpponents.length >= 2){
                let competitorIndex1 = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                let competitorIndex2 = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                while (competitorIndex1 === competitorIndex2){
                    competitorIndex2 = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                }

                let brain1 = this.neat.population[competitorIndex1];
                let brain2 = this.neat.population[competitorIndex2];
                brain1.utilisations++;
                brain2.utilisations++;
                if (brain1.utilisations >= 4){
                    availableOpponents = availableOpponents.filter((val) => val !== competitorIndex1);
                }
                if (brain2.utilisations >= 4){
                    availableOpponents = availableOpponents.filter((val) => val !== competitorIndex2);
                }

                return [competitorIndex1, competitorIndex2];
            } else {
                return null;
            }
        }

        while (availableOpponents.length >= 2){
            let brains = getPlayerPair().map((index) => this.neat.population[index]);
            if (!brains){
                break;
            }
            const player1 = new AIPlayer(new p5.Vector(0.05, 0.5), brains[0]);
            const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), brains[1]);
            const game = new Pong(player1, player2);
            while(game.score < 30){
                const res = game.update(33.3);
                if (res.end){
                    res.winner.brain.score += game.score;
                    let other = game.other(res.winner);
                    other.brain.score -= (30 - game.score);
                    break;
                }
            }
            // in case of draw, each player get average score
            if (game.score === 30) {
                player1.brain.score += 15;
                player2.brain.score += 15;
            } 
            
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
