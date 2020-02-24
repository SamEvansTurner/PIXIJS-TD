import { GameObject } from "./util/gameobject";
import * as PIXI from "pixi.js";
import { IPosition } from "./util/iposition";
import { Graph } from "./graph";
export class Grid extends GameObject {
	graphics: PIXI.Graphics;
	minorColor: number = 0xa0a0a0;
	majorColor: number = 0xa0ffa0;
	resolution: number;
	graph: Graph;

	constructor(
		public renderer: PIXI.AbstractRenderer,
		public stage: PIXI.Container,
		public interactionManager: PIXI.interaction.InteractionManager,
		maxWidth: number,
		maxHeight: number,
		public numCells: number
	) {
		super(renderer, stage);
		this.graphics = new PIXI.Graphics();
		this.stage.addChild(this.graphics);

		if (maxWidth > maxHeight) {
			this.resolution = maxWidth / this.numCells;
		} else {
			this.resolution = maxHeight / this.numCells;
		}

		for (var xStep = 0; xStep < numCells; xStep++) {
			this.graphics
				.lineStyle(
					2,
					xStep % 10 == 0 ? this.majorColor : this.minorColor
				)
				.moveTo(xStep * this.resolution, 0)
				.lineTo(xStep * this.resolution, maxHeight);
		}
		for (var yStep = 0; yStep < numCells; yStep++) {
			this.graphics
				.lineStyle(
					2,
					yStep % 10 == 0 ? this.majorColor : this.minorColor
				)
				.moveTo(0, yStep * this.resolution)
				.lineTo(maxWidth, yStep * this.resolution);
		}
		var obstacles: number[][] = [[]];
		for (var i = 0; i < numCells; i++) {
			for (var j = 0; j < numCells; j++) {
				obstacles[i].push(1);
			}
			if (i < numCells - 1) obstacles.push([]);
		}

		this.graph = new Graph(obstacles, {
			diagonal: true,
			pxPerGrid: this.resolution,
			width: numCells,
			height: numCells
		});
		this.graph.a_star_search(
			{ x: 0, y: 0 },
			{ x: numCells - 1, y: numCells - 1 }
		);
	}

	closest_centre(x: number, y: number): IPosition {
		var xCell = Math.floor(x / this.resolution);
		var yCell = Math.floor(y / this.resolution);
		return {
			x: xCell * this.resolution,
			y: yCell * this.resolution
		};
	}

	update_astar_grid(gameobjects: Array<GameObject>) {}

	update(delta) {
		return delta;
	}

	render(delta) {
		return delta;
	}
}
