import { _decorator, Component, director, Label, Node } from 'cc';
import { Constant } from '../Data/Constant';
const { ccclass, property } = _decorator;

@ccclass('MainController')
export class MainController extends Component {
    @property({
        type: Label
    })
    private Best: Label;

    protected start(): void {
        const highScoreFromLocalStorage = localStorage.getItem('highScoreFlappyColor');
        if (highScoreFromLocalStorage !== null) {
            Constant.dataUser.highScore = parseInt(highScoreFromLocalStorage);
        } else {
            Constant.dataUser.highScore = 0;
        }

        this.Best.string=`Best Score\n${Constant.dataUser.highScore}`
    }

    update(deltaTime: number) {
        
    }

    private Play():void{
        director.loadScene("Game");
    }
}

