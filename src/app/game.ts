import * as PIXI from "pixi.js";
import { State } from "./util/state";
import { Circle } from "./circle";
import { GameObject } from "./util/gameobject";
import { Grid } from "./grid";
import { IPosition } from "./util/iposition";
export class Game implements State {
	graphics: PIXI.Graphics;
	gameObjects: Array<GameObject>;
	currentObject: GameObject;
	numCells: number = 31;
	cellWidth: number = 4;
	circleRadius: number;
	circleTexture: PIXI.Texture;
	gridResolution: number;
	grid: Grid;
	textures: Array<PIXI.Texture>;
	numTextures: number = 20;
	maxWidth: number;
	maxHeight: number;

	constructor(
		public renderer: PIXI.AbstractRenderer,
		public stage: PIXI.Container,
		public interactionManager: PIXI.interaction.InteractionManager
	) {
		this.graphics = new PIXI.Graphics();
		this.stage.addChild(this.graphics);
		this.gameObjects = [];

		this.maxWidth = this.renderer.width;
		this.maxHeight = this.renderer.height;

		this.textures = [];

		if (this.maxWidth > this.maxHeight) {
			this.gridResolution = this.maxWidth / this.numCells;
		} else {
			this.gridResolution = this.maxHeight / this.numCells;
		}

		this.grid = new Grid(
			this.renderer,
			this.stage,
			this.interactionManager,
			this.maxWidth,
			this.maxHeight,
			this.numCells
		);

		this.currentObject = null;
		this.circleRadius = this.gridResolution - 2;

		for (var i = 0; i < this.numTextures; i++) {
			var gr = new PIXI.Graphics();
			var fillColour = Math.floor(Math.random() * 0xdddddd);
			var lineColour = this.calculate_line_colour(fillColour);
			gr.beginFill(fillColour)
				.lineStyle(2, lineColour)
				.drawCircle(0, 0, this.circleRadius)
				.endFill();
			this.textures.push(
				this.renderer.generateTexture(
					gr,
					PIXI.SCALE_MODES.LINEAR,
					//window.devicePixelRatio || 1
					16
				)
			);
			gr.clear();
		}

		this.interactionManager.on("pointerdown", this.move_item, this);
		this.interactionManager.on("pointermove", this.move_item, this);
		this.interactionManager.on("pointerup", this.drop_circle, this);
	}

	calculate_line_colour(fillColour: number) {
		var red = Math.min(((fillColour & 0xff0000) >> 0x10) + 0x10, 0xff);
		var green = Math.min(((fillColour & 0x00ff00) >> 0x08) + 0x10, 0xff);
		var blue = Math.min((fillColour & 0x0000ff) + 0x10, 0xff);
		var lineColour = (red << 0x10) + (green << 8) + blue;
		return lineColour;
	}

	drop_circle() {
		if (this.test_all_collisions()) {
			this.gameObjects.push(this.currentObject);
			this.currentObject = null;
		}
	}

	test_all_collisions(): boolean {
		for (let obj of this.gameObjects) {
			if (this.currentObject.test_collision(obj)) {
				return false;
			}
		}
		var spriteBox = this.currentObject.sprite.getBounds();
		if (
			spriteBox.left < 0 ||
			spriteBox.right > this.maxWidth ||
			spriteBox.top < 0 ||
			spriteBox.bottom > this.maxHeight
		)
			return false;

		return true;
	}

	push_new_circle(x: number, y: number) {
		var textureIndex = Math.floor(Math.random() * this.numTextures);
		var texture = this.textures[textureIndex];
		this.currentObject = new Circle(
			this.renderer,
			this.stage,
			texture,
			x,
			y
		);
	}

	move_item(event: PIXI.interaction.InteractionEvent) {
		var mouseX = event.data.global.x;
		var mouseY = event.data.global.y;
		var newPos: IPosition = this.grid.closest_centre(mouseX, mouseY);
		if (this.currentObject === null) {
			this.push_new_circle(newPos.x, newPos.y);
		} else {
			this.currentObject.set_position(newPos.x, newPos.y);
		}
	}

	update(delta: number) {
		if (this.currentObject != null) {
			this.currentObject.update(delta);
		}
		for (let obj of this.gameObjects) {
			obj.update(delta);
		}
	}

	render(delta: number) {
		if (this.currentObject != null) {
			this.currentObject.render(delta);
		}
		for (let obj of this.gameObjects) {
			obj.render(delta);
		}
	}
}
