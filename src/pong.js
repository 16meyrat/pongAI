import p5 from 'p5';

const BALL_RADIUS = 0.015;
const MAX_SPEED = 0.0005;

class Pong {
    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;

        this.ballPosition = new p5.Vector(0.5, 0.5);
        this.ballSpeed = new p5.Vector((Math.random() - 0.5) * MAX_SPEED, (Math.random() - 0.5 ) * MAX_SPEED);
        this.score = 0;
    }

    update(deltatime) {
        this.ballPosition.add(p5.Vector.mult(this.ballSpeed,deltatime));
        if (this.ballPosition.x < 0) {
            return {
                winner: this.player1,
                end: true,
            };
        }
        if (this.ballPosition.x > 1) {
            return {
                winner: this.player2,
                end: true,
            };
        }
        if (this.ballPosition.y > 1 - BALL_RADIUS || this.ballPosition.y < BALL_RADIUS){
            this.ballSpeed.y = -this.ballSpeed.y;
        }
        this.player1.update(this, deltatime);
        this.player2.update(this, deltatime);

        if (this.player1.collide(this.ballPosition, BALL_RADIUS) && this.ballSpeed.x < 0){
            this.ballSpeed.x = Math.abs(this.ballSpeed.x);
            const newSpeed = 0.1 * this.player1.speed;
            if (Math.abs(newSpeed < MAX_SPEED)){
                this.ballSpeed.y = newSpeed;
            }
            this.score++;
        } else if(this.player2.collide(this.ballPosition, BALL_RADIUS) && this.ballSpeed.x > 0){
            this.ballSpeed.x = -Math.abs(this.ballSpeed.x);
            const newSpeed = 0.1 * this.player2.speed;
            if (Math.abs(newSpeed < MAX_SPEED)){
                this.ballSpeed.y = newSpeed;
            }
            this.score++;
        }

        return {
            end: false
        };
    }

    render(sk){
        sk.fill(0, 0, 0);
        sk.line(0, 0, sk.width - 1, 0);
        sk.line(0, sk.height - 1, sk.width - 1, sk.height - 1);
        sk.textSize(20);
        sk.text(this.score, sk.width * 0.5, 20);
        sk.circle(sk.width * this.ballPosition.x, sk.height * this.ballPosition.y, 2 * sk.width * BALL_RADIUS);
        this.player1.render(sk);
        this.player2.render(sk);
    }

    // return the other player
    other(player){
        if (this.player1 === player){
            return this.player2;
        } else {
            return this.player1;
        }
    }
}

export default Pong;
