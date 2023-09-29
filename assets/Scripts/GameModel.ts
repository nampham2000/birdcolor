import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property(Prefab)
    private rowColor: Prefab[] = [];
    public get RowColor(): Prefab[] {
        return this.rowColor;
    }
    public set RowColor(value: Prefab[]) {
        this.rowColor = value;
    }



}


