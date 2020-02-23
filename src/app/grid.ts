import { GameObject } from "./util/gameobject";
import * as PIXI from "pixi.js";
import { Position } from "./util/position";
export class Grid extends GameObject {
	graphics: PIXI.Graphics;
	minorColor: number = 0xa0a0a0;
	majorColor: number = 0xa0ffa0;

	constructor(
		public renderer: PIXI.AbstractRenderer,
		public stage: PIXI.Container,
		public interactionManager: PIXI.interaction.InteractionManager,
		maxWidth: number,
		maxHeight: number,
		public resolution: number
	) {
		super(renderer, stage);
		this.graphics = new PIXI.Graphics();
		this.stage.addChild(this.graphics);

		for (var xStep = 0; xStep < maxWidth; xStep += this.resolution) {
			this.graphics
				.lineStyle(
					2,
					Math.floor(xStep / this.resolution) % 10 == 0
						? this.majorColor
						: this.minorColor
				)
				.moveTo(xStep, 0)
				.lineTo(xStep, maxHeight);
		}
		for (var yStep = 0; yStep < maxHeight; yStep += this.resolution) {
			this.graphics
				.lineStyle(
					2,
					Math.floor(yStep / this.resolution) % 10 == 0
						? this.majorColor
						: this.minorColor
				)
				.moveTo(0, yStep)
				.lineTo(maxWidth, yStep);
		}
	}

	closest_centre(x: number, y: number): Position {
		var xCell = Math.floor(x / this.resolution);
		var yCell = Math.floor(y / this.resolution);
		return {
			x: xCell * this.resolution,
			y: yCell * this.resolution
		};
	}

	update(delta) {
		return delta;
	}

	render(delta) {
		return delta;
	}
}
