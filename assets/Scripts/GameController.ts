import {_decorator,CCInteger,Collider2D,color,Color,Component,Contact2DType,director,Input,input,instantiate,IPhysics2DContact,Node,Prefab,RigidBody2D,Sprite,UITransform,Vec2,Vec3,view} from "cc";
import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { Constant } from "./Data/Constant";
import { AudioController } from "./AudioController";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property({ type: Node })
    private Bird: Node;

    @property({ type: Node })
    private Wall: Node;

    @property({ type: GameModel })
    private gameModel: GameModel;

    @property({ type: GameView })
    private gameView: GameView;

    @property({type:CCInteger})
    private wallSpeed:number=-350;

    @property({ type: AudioController })
    private audioController: AudioController;


    private colorPool: Node[] = [];
    private wallStartPosition: Vec3;
    private colorPrefabStartPositions: Vec3[] = [];
    private checkPass:boolean=false;
    private Score:number=0;
    private highScoreFromLocalStorage:number;
    protected start():void {
        this.randomizeBirdProperties();
        this.contactBird();
        input.on(Input.EventType.TOUCH_START, this.bird_Fly, this);
        this.createWall();
        this.Wall.position = new Vec3(
        this.Wall.position.x,
        -view.getVisibleSize().height / 2
        );
        this.wallStartPosition = this.Wall.position.clone();
        this.showBestScore();
    }

    protected update(deltaTime: number):void {
        this.wallMove(deltaTime);
        this.gameView.Score.string = `${this.Score}`;
        this.saveBestScore();
        this.gameView.BestScore.string = `Best Score: ${this.highScoreFromLocalStorage}`;
        if(this.Bird.position.y>view.getVisibleSize().height/2-40||this.Bird.position.y<-view.getVisibleSize().height/2+40)
        {
            this.checkGameOver()
        }
    }

    protected bird_Fly(): void {
        this.audioController.onAudio(2);
        const rigidbody = this.Bird.getComponent(RigidBody2D);
        if (rigidbody) {
            rigidbody.linearVelocity = new Vec2(0, 15);
        }
       
      
    }

    protected contactBird(): void {
        const playerCollider = this.Bird.getComponent(Collider2D);
        if (playerCollider) {
            playerCollider.on(Contact2DType.BEGIN_CONTACT, this.onPlayerContact, this);
        }
    }

    protected onPlayerContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):void{
        if(selfCollider.tag===otherCollider.tag&&!this.checkPass)
        {
            this.Score++;
            this.randomizeBirdProperties();
            this.checkPass=true;
            this.audioController.onAudio(0);
        }else if(selfCollider.tag!==otherCollider.tag&&!this.checkPass){
            this.checkGameOver();
            this.audioController.onAudio(1)
        }
    }

    protected createWall(): void {
        const shuffledRowColor = this.rollArray(this.gameModel.RowColor);
        const screenSize = view.getVisibleSize();
        const prefabCount = shuffledRowColor.length;
        const size = screenSize.height / prefabCount;
        this.wallStartPosition = this.Wall.position.clone();
        for (let i = 0; i < prefabCount; i++) {
            const colorPrefab = instantiate(shuffledRowColor[i]);
            colorPrefab.getComponent(UITransform).height = size;
            colorPrefab.parent = this.Wall;
            colorPrefab.getComponent(Collider2D).apply();
            this.colorPool.push(colorPrefab);
            const x = 0;
            const y = (i + 0.5) * (screenSize.height/prefabCount);
            colorPrefab.setPosition(new Vec3(x, y));
            this.colorPrefabStartPositions.push(colorPrefab.position.clone());
        }
    }

    protected rollArray(array: any[]): any[] {
        const Array = array.slice();
        for (let i = Array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [Array[i], Array[j]] = [Array[j], Array[i]];
        }
        return Array;
    }

    private wallMove(dt: number): void {
        this.wallSpeed = -350;
        this.Wall.translate(new Vec3(this.wallSpeed * dt, 0, 0));
        this.Wall.children.forEach(child => {
            const collider = child.getComponent(Collider2D);
            if (collider) {
            collider.apply();
            }
        });
        if (this.Wall.position.x <= -view.getVisibleSize().width/2-30) {
        this.Wall.setPosition(this.wallStartPosition);
        this.shuffleColorPrefabPositions();
        this.checkPass=false;
        }
    }

    private shuffleColorPrefabPositions(): void {
        const positions = this.colorPrefabStartPositions.slice();
        const wallChildren = this.Wall.children;
        for (let i = 0; i < wallChildren.length; i++) {
            const randomIndex = Math.floor(Math.random() * positions.length);
            wallChildren[i].position = positions.splice(randomIndex, 1)[0];
        }
    }

    private randomizeBirdProperties(): void {
        const colorMapping = { 1: "FF0000", 2: "1EA7E1", 3: "73CD4B", 4: "FFCC00" };
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        const randomColor = colorMapping[randomNumber];
        if (this.Bird) {
            this.Bird.getComponent(Collider2D).tag = randomNumber;
            this.Bird.getComponent(Sprite).color=new Color(randomColor)
        }
    }

    private checkGameOver():void{
        this.gameView.GameOver.active=true;
        this.Bird.active=false;
    }

    private saveBestScore(): void {
        this.highScoreFromLocalStorage= parseInt(localStorage.getItem('highScoreFlappyColor')) || 0;
        if (this.Score > this.highScoreFromLocalStorage) {
            localStorage.setItem('highScoreFlappyColor', this.Score.toString());
        }
    }

    private showBestScore():void
    {
        const highScoreFromLocalStorage = localStorage.getItem('highScoreFlappyColor');
        if (highScoreFromLocalStorage !== null) {
            Constant.dataUser.highScore = parseInt(highScoreFromLocalStorage);
        } else {
            Constant.dataUser.highScore = 0;
        }
    }

    private onMuteBtnClick(): void {
        this.audioController.settingAudio(0);
        localStorage.setItem('SoundFlappyColor', '0');
        this.gameView.MuteBtn.active = false;
        this.gameView.UnMuteBtn.active = true;
    }

    private onUnMuteBtnClick(): void {
        this.audioController.settingAudio(1);
        localStorage.setItem('SoundFlappyColor', '1');
        this.gameView.MuteBtn.active = true;
        this.gameView.UnMuteBtn.active = false;
    }

    private replay():void
    {
        director.loadScene("Game");
    }
}
