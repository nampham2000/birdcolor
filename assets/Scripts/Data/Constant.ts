import { _decorator, Color, Component, Node, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;
export type DataUser = {
    highScore: number
}
@ccclass('Constant')
export class Constant extends Component {
    public static readonly audioVolumeKey: string = 'bracket sound';
    public static dataUser: DataUser = {
        highScore: 0
    }
}
