import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property(Label)
    private score: Label
    public get Score(): Label {
        return this.score;
    }
    public set Score(value: Label) {
        this.score = value;
    }

    @property(Label)
    private bestscore: Label;
    public get BestScore(): Label {
        return this.bestscore;
    }
    public set BestScore(value: Label) {
        this.bestscore = value;
    }

    @property(Node)
    private gameOver: Node;
    public get GameOver(): Node {
        return this.gameOver;
    }
    public set GameOver(value: Node) {
        this.gameOver = value;
    }
    
    @property({
        type: Node
    })
    private muteBtn: Node;
    public get MuteBtn(): Node {
        return this.muteBtn;
    }
    public set MuteBtn(value: Node) {
        this.muteBtn = value;
    }

    @property({
        type: Node
    })
    private unMuteBtn: Node;
    public get UnMuteBtn(): Node {
        return this.unMuteBtn;
    }
    public set UnMuteBtn(value: Node) {
        this.unMuteBtn = value;
    }
}

