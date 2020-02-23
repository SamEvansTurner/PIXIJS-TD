import * as PIXI from "pixi.js";
import { GameObject } from "./util/gameobject";
export class Circle extends GameObject {
	sprite: PIXI.Sprite;
	constructor(
		public renderer: PIXI.AbstractRenderer,
		public stage: PIXI.Container,
		public texture: PIXI.Texture,
		public x: number,
		public y: number
	) {
		super(renderer, stage);
		this.sprite = new PIXI.Sprite(texture);
		this.sprite.anchor.set(0);
		this.stage.addChild(this.sprite);
	}

	update(_delta: number) {
		this.sprite.position.set(this.x, this.y);
		super.update(_delta);
	}

	render(_delta: number) {
		super.render(_delta);
	}
}
