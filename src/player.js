import p5 from "p5";

const PLAYER_HEIGHT = 0.1;
const PLAYER_WIDTH = 0.01;
const MAX_SPEED = 0.0015;
const ACCELERATION = 0.000002;

export default class Player {
    constructor(position){
        this.position = position;
        this.speed = 0;
    }

    update(_game, deltatime){
        if (Math.abs(this.speed) > MAX_SPEED){
            this.speed = Math.sign(this.speed) * MAX_SPEED;
        }

        this.position.y += this.speed * deltatime;

        if (this.position.y < PLAYER_HEIGHT ) {
            this.position.y = PLAYER_HEIGHT;
            this.speed = 0;
        }else if(this.position.y > 1 - PLAYER_HEIGHT){
            this.position.y = 1 - PLAYER_HEIGHT;
            this.speed = 0;
        }
    }

    render(sk){
        sk.rect(sk.width * this.position.x, sk.height * this.position.y, PLAYER_WIDTH * sk.width, PLAYER_HEIGHT * sk.height);
    }

    collide(ballPosition, ballRadius){
        return ballPosition.x - ballRadius < this.position.x + PLAYER_WIDTH && ballPosition.x + ballRadius > this.position.x - PLAYER_WIDTH && 
            ballPosition.y - ballRadius < this.position.y + PLAYER_HEIGHT && ballPosition.y + ballRadius > this.position.y - PLAYER_HEIGHT;
    }
}

export class HumanPlayer extends Player {
    constructor(position){
        super(position);
    }

    render(sk){
        super.render(sk);
        if (sk.keyIsDown(sk.UP_ARROW)){
            this.speed -= ACCELERATION * sk.deltaTime;
        }
        if (sk.keyIsDown(sk.DOWN_ARROW)){
            this.speed += ACCELERATION * sk.deltaTime;
        }
    }
}

export class AIPlayer extends Player {
    constructor(position, brain){
        super(position);
        this.brain = brain;
    }

    update(game, deltatime){
        super.update(game, deltatime);

        let normalizedBallPosition = game.ballPosition;
        let normalizedBallSpeed = game.ballSpeed;
        if (this.position.x > 0.5) {
            normalizedBallPosition.x = 1 - normalizedBallPosition.x;
            normalizedBallSpeed.x = - normalizedBallSpeed;
        }

        let otherPlayer = game.player1 === this ? game.player2 : game.player1;

        const inputs = this.brain.activate([
            normalizedBallPosition.x, 
            normalizedBallPosition.y, 
            normalizedBallSpeed.x, 
            normalizedBallSpeed.y,
            this.position.y,
            this.speed,
            otherPlayer.position.y,
            otherPlayer.speed,
        ]);

        this.speed += ACCELERATION * inputs[0] * deltatime;
    }
}
