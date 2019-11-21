import Neat from "neataptic";
import p5 from "p5";
import Pong from "./pong.js";
import {AIPlayer} from "./player.js";


export default class Evolution {

    // initialise population
    constructor(){
        this.neat = new Neat(
            2 + 2 + 2 + 2,
            2,
            null,
            {
              mutation: Neat.methods.mutation.ALL,
              popsize: 100,
              mutationRate: 0.01,
              elitism: 30,
              network: new Neat.architect.Random(
                2+2+2+2,
                Neat.START_HIDDEN_SIZE,
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

        
        for(let [index, brain] of this.neat.population.entries()){
            for(let i = 0; i < 4; i++){
                if (brain.utilisations >= 4){ // can happen if played againts itself
                    break;
                }

                let competitorIndex = 0;
                let saveOpponentScore = true;
                if (availableOpponents.length > 0){
                    competitorIndex = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                } else {
                    // compete againts a random oponent, but don't save the score of the opponent
                    saveOpponentScore = false;
                    competitorIndex = Math.floor(Math.random() * this.neat.population.length);
                }

                const competitor = this.neat.population[competitorIndex];

                brain.utilisations++;
                if (brain.utilisations >= 4){
                    availableOpponents.filter((val) => val !== index);
                }
                competitor.utilisations++;
                if (competitor.utilisations >= 4){
                    availableOpponents.filter((val) => val !== competitorIndex);
                }

                const player1 = new AIPlayer(new p5.Vector(0.05, 0.5), brain);
                const player2 = new AIPlayer(new p5.Vector(1 - 0.05, 0.5), competitor);
                const game = new Pong(player1, player2);
    
                while(game.score < 30){
                    const res = game.update(0.033);
                    if (res.end){
                        if (saveOpponentScore || res.winner === player1)
                            res.winner.brain.score += game.score;
                        let other = game.other(res.winner);
                        if (saveOpponentScore || other === player1)
                            other.brain.score -= 30;
                        break;
                    }
                }
                // in case of draw, each player get average score
                if (game.score === 30) {
                    player1.brain.score += 15;
                    if (saveOpponentScore)
                        player2.brain.score += 15;
                } 
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
