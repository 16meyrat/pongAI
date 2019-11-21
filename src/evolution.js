import p5 from "p5";

import Pong from "./pong.js";
import {AIPlayer} from "./player.js";

const Neat = neataptic.Neat;


export default class Evolution {

    // initialise population
    constructor(){
        this.neat = new Neat(
            2 + 2 + 2 + 2,
            2,
            null,
            {
              mutation: neataptic.Methods.Mutation.ALL,
              popsize: 100,
              mutationRate: 0.01,
              elitism: 30,
              network: new neataptic.Architect.Random(
                2+2+2+2,
                neataptic.START_HIDDEN_SIZE,
                1
              )
            }
        );
    }

    // evaluate all individuals by making them compete againts each other. 4 games per players
    evaluate(){
        const availableOpponents = [];
        for (let [index, brain] of this.neat.population.entries()){
            brain.score = 0;
            brain.utilisations = 0;
            availableOpponents.push(index);
        }

        const getPlayerPair = ()=>{
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
                    availableOpponents.filter((val) => val !== competitorIndex1);
                }
                if (brain2.utilisations >= 4){
                    availableOpponents.filter((val) => val !== competitorIndex2);
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
                const res = game.update(0.033);
                if (res.end){
                    res.winner.brain.score += game.score;
                    let other = game.other(res.winner);
                    other.brain.score -= 30;
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
      
        this.neat.generation++;
      }
}
