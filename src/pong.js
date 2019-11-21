import p5 from 'p5';

const BALL_RADIUS = 0.03;

class Pong {
    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;

        this.ballPosition = new p5.Vector(0.5, 0.5);
        this.ballSpeed = new p5.Vector(Math.random() * 0.0003 - 0.0006, Math.random() * 0.0003 - 0.0006);

        this.score = 0;
    }

    update(deltatime, inputs) {
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
        this.player1.update(this, deltatime, inputs);
        this.player2.update(this, deltatime, inputs);

        if (this.player1.collide(this.ballPosition, BALL_RADIUS)){
            this.ballSpeed.x = Math.abs(this.ballSpeed.x);
            this.score++;
        } else if(this.player2.collide(this.ballPosition, BALL_RADIUS)){
            this.ballSpeed.x = -Math.abs(this.ballSpeed.x);
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
        sk.circle(sk.width * this.ballPosition.x, sk.height * this.ballPosition.y, sk.width * BALL_RADIUS);
        this.player1.render(sk);
        this.player2.render(sk);
    }
}

export default Pong;
