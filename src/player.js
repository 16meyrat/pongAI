import p5 from "p5";

const PLAYER_HEIGHT = 0.1;
const PLAYER_WIDTH = 0.05;
const MAX_SPEED = 0.001;
const ACCELERATION = 0.000001;

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

        if (this.position.y < PLAYER_HEIGHT / 2 ) {
            this.position.y = PLAYER_HEIGHT / 2;
            this.speed = 0;
        }else if(this.position.y > 1 - PLAYER_HEIGHT / 2){
            this.position.y = 1 - PLAYER_HEIGHT / 2;
            this.speed = 0;
        }
    }

    render(sk){
        sk.rect(sk.width * this.position.x, sk.height * this.position.y, PLAYER_WIDTH * sk.width, PLAYER_HEIGHT * sk.height);
    }
}

export default Player;

export class HumanPlayer extends Player {
    constructor(position){
        super(position);
    }

    update(game, deltatime, inputs) {
        super.update(game, deltatime);
        if (inputs){
            if (inputs.up_arrow) {
                this.speed -= ACCELERATION * deltatime;
            }else if (inputs.down_arrow) {
                this.speed += ACCELERATION * deltatime;
            }
        }
    }
}
