import p5 from 'p5';

class Pong {
    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;

        this.ballPosition = new p5.Vector(0.5, 0.5);
        this.ballSpeed = new p5.Vector(Math.random() * 0.006 - 0.003, Math.random() * 0.006 - 0.003);
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
        if (this.ballPosition.y > 1 || this.ballPosition.y < 0){
            this.ballSpeed = -this.ballSpeed;
        }
        this.player1.update(this, deltatime, inputs);
        this.player2.update(this, deltatime, inputs);
        return {
            end: false
        };
    }

    render(sk){
        sk.fill(0, 0, 0);
        sk.circle(sk.width * this.ballPosition.x, sk.height * this.ballPosition.y, 30);
        this.player1.render(sk);
        this.player2.render(sk);
    }
}

export default Pong;
