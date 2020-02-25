import { GameObject } from "./util/gameobject";
import * as PIXI from "pixi.js";
import { IPosition } from "./util/iposition";
import { Graph } from "./graph";
import { Pair } from "./util/astarinterfaces";
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
		public maxWidth: number,
		public maxHeight: number,
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

		var obstacles: number[][] = [[]];
		for (var i = 0; i < numCells; i++) {
			for (var j = 0; j < numCells; j++) {
				obstacles[i].push(1);
			}
			if (i < numCells - 1) obstacles.push([]);
		}

		this.draw_grid();

		this.graph = new Graph(obstacles, {
			diagonal: false,
			pxPerGrid: this.resolution,
			width: numCells,
			height: numCells
		});
	}

	draw_grid() {
		for (var xStep = 0; xStep < this.numCells; xStep++) {
			this.graphics
				.lineStyle(
					2,
					xStep % 10 == 0 ? this.majorColor : this.minorColor
				)
				.moveTo(xStep * this.resolution, 0)
				.lineTo(xStep * this.resolution, this.maxHeight);
		}
		for (var yStep = 0; yStep < this.numCells; yStep++) {
			this.graphics
				.lineStyle(
					2,
					yStep % 10 == 0 ? this.majorColor : this.minorColor
				)
				.moveTo(0, yStep * this.resolution)
				.lineTo(this.maxWidth, yStep * this.resolution);
		}
	}

	closest_centre(x: number, y: number): Pair {
		var xCell = Math.floor(x / this.resolution);
		var yCell = Math.floor(y / this.resolution);
		return [xCell * this.resolution + 1, yCell * this.resolution + 1];
	}

	grid_cell(x: number, y: number): Pair {
		var xCell = Math.round(x / this.resolution);
		var yCell = Math.round(y / this.resolution);
		return [xCell, yCell];
	}

	run_astar(src: Pair, dest: Pair): Pair[] {
		return this.graph.a_star_search(src, dest);
	}

	/* block_astar_grid
	 ** any 0s in the updates set the astar grid to be 0
	 ** assumes updates are a square, starting from topleft
	 */
	block_astar_grid(topleft: Pair, updates: number[][]) {
		var graph: number[][] = this.graph.get_graph();
		var width = updates.length;
		var height = updates[0].length;
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				if (updates[i][j] == 0) {
					graph[i + topleft[0]][j + topleft[1]] = 0;
				}
			}
		}
		this.graph.set_graph(graph);
	}

	set_astar_grid(topleft: Pair, updates: number[][]) {
		var graph: number[][] = this.graph.get_graph();
		var width = updates.length;
		var height = updates[0].length;
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				graph[i + topleft[0]][j + topleft[1]] = updates[i][j];
			}
		}
		this.graph.set_graph(graph);
	}

	draw_path(path: Pair[]) {
		this.graphics.clear();
		this.draw_grid();
		for (var p of path) {
			this.graphics
				.lineStyle(0, 0xffffff)
				.moveTo(0, 0)
				.beginFill(0xff0000)
				.drawRect(
					p[0] * this.resolution,
					p[1] * this.resolution,
					this.resolution,
					this.resolution
				)
				.endFill();
		}
	}

	update(delta) {
		return delta;
	}

	render(delta) {
		return delta;
	}
}
