import * as PIXI from "pixi.js";
export class GameObject {
	x: number;
	y: number;
	xVel: number;
	yVel: number;
	graphics: PIXI.Graphics;
	sprite: PIXI.Sprite;
	constructor(
		public renderer: PIXI.AbstractRenderer,
		public stage: PIXI.Container
	) {}
	remove(): any {}
	update(_delta: number): any {}
	render(_delta: number): any {}
	set_position(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	set_sprite(newsprite: PIXI.Sprite) {
		this.sprite = newsprite;
	}
	test_collision(other: GameObject) {
		const a = this.sprite.getBounds();
		const b = other.sprite.getBounds();
		return !(
			a.right < b.left ||
			a.left > b.right ||
			a.top > b.bottom ||
			a.bottom < b.top
		);
	}
	delete() {
		if (typeof this.graphics !== "undefined") {
			this.graphics.clear();
			this.graphics.destroy();
		}
		if (typeof this.sprite !== "undefined") {
			this.stage.removeChild(this.sprite);
			this.sprite.destroy();
		}
	}
}
