import p5 from "p5";

const PLAYER_HEIGHT = 0.1;
const PLAYER_WIDTH = 0.01;
const MAX_SPEED = 0.0015;
const ACCELERATION = 0.000002;

class Player {
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

export default Player;

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
