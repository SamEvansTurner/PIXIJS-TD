import { IGraphOptions } from "./util/astarinterfaces";
import { IPosition } from "./util/iposition";
import { GraphNode } from "./graphnode";
import { PPair } from "./util/astarinterfaces";
import { Stack } from "./util/stack";
export class Graph {
	nodes: number[];
	diagonal: boolean;
	path: IPosition[];
	source: IPosition;
	dest: IPosition;
	width: number;
	height: number;
	pxPerGrid: number;
	constructor(public grid: number[][], public options: IGraphOptions) {
		window.console.log("new graph");
		this.diagonal = options.diagonal;
		this.pxPerGrid = options.pxPerGrid;
		this.width = options.width;
		this.height = options.height;
	}

	is_valid(row: number, column: number): boolean {
		return (
			row >= 0 && row < this.width && column >= 0 && column < this.height
		);
	}

	is_unblocked(row: number, col: number): boolean {
		var gc = this.grid[row][col];
		if (gc === 1) {
			return true;
		} else {
			return false;
		}
	}

	is_destination(row: number, col: number, dest: IPosition) {
		if (row == dest.x && col == dest.y) return true;
		else return false;
	}

	heuristic(pos0: IPosition, pos1: IPosition, weight: number) {
		var dx = Math.abs(pos1.x - pos1.y);
		var dy = Math.abs(pos1.y - pos0.y);

		return Math.max(dx, dy) * weight;
	}

	a_star_search(src: IPosition, dest: IPosition) {
		window.console.log("Starting A*");
		window.console.log(this.grid);
		this.source = src;
		this.dest = dest;
		if (!this.is_valid(src.x, src.y) || !this.is_valid(dest.x, dest.y)) {
			window.console.log("invalid Position");
			return;
		}

		if (
			!this.is_unblocked(src.x, src.y) ||
			!this.is_unblocked(dest.x, dest.y)
		) {
			window.console.log("position blocked");
			return;
		}

		if (this.is_destination(src.x, src.y, dest)) {
			window.console.log("src and dest are the same");
			return;
		}

		var closedList: boolean[][] = [[]];
		var cellDetails: GraphNode[][] = [[]];

		var i: number, j: number;

		for (i = 0; i < this.width; i++) {
			for (j = 0; j < this.height; j++) {
				cellDetails[i].push(new GraphNode());
				closedList[i].push(false);
			}
			if (i < this.width - 1) {
				cellDetails.push([]);
				closedList.push([]);
			}
		}

		i = src.x;
		j = src.y;

		cellDetails[i][j].f = 0.0;
		cellDetails[i][j].g = 0.0;
		cellDetails[i][j].h = 0.0;
		cellDetails[i][j].parent_i = i;
		cellDetails[i][j].parent_j = j;

		window.console.log("new set");
		var openList: Set<PPair> = new Set();
		openList.add([0.0, [i, j]]);

		var foundDest: boolean = false;

		while (!(openList.size === 0)) {
			var iter = openList.values();
			var p: PPair = iter.next().value;
			openList.delete(p);
			i = p[1][0];
			j = p[1][1];
			closedList[i][j] = true;

			var nodesAround: [number, number][] = [
				[i - 1, j],
				[i + 1, j],
				[i, j + 1],
				[i, j - 1],
				[i - 1, j + 1],
				[i - 1, j + 1],
				[i - 1, j - 1],
				[i + 1, j + 1],
				[i + 1, j - 1]
			];

			for (let obj of nodesAround) {
				foundDest = this.process_node(
					obj[0],
					obj[1],
					i,
					j,
					openList,
					closedList,
					cellDetails
				);
				if (foundDest) {
					this.print_path(cellDetails);
					return true;
				}
			}
		}
	}

	print_path(cellDetails: GraphNode[][]) {
		window.console.log("Path is ");
		var row = this.dest.x;
		var col = this.dest.y;
		var path: IPosition[] = [];
		var pI = cellDetails[row][col].parent_i;
		var pJ = cellDetails[row][col].parent_j;
		while (pI !== row && pJ !== col) {
			var newPos = { x: row, y: col };
			path.push(newPos);
			var newRow = pI;
			var newCol = pJ;
			row = newRow;
			col = newCol;
			var pI = cellDetails[row][col].parent_i;
			var pJ = cellDetails[row][col].parent_j;
		}
		path.push({ x: row, y: col });
		path = path.reverse();
		window.console.log(path);
		return path;
	}

	process_node(
		x: number,
		y: number,
		i: number,
		j: number,
		openList: Set<[number, [number, number]]>,
		closedList: boolean[][],
		cellDetails: GraphNode[][]
	): boolean {
		var gNew: number, hNew: number, fNew: number;
		if (!this.is_valid(x, y)) return;
		if (this.is_destination(x, y, this.dest)) {
			cellDetails[x][y].parent_i = i;
			cellDetails[x][y].parent_j = j;
			return true;
		} else if (closedList[x][y] == false && this.is_unblocked(x, y)) {
			gNew = cellDetails[i][j].g + 1.0;
			hNew = this.heuristic({ x, y }, this.dest, this.grid[x][y]);
			fNew = gNew + hNew;

			if (
				cellDetails[x][y].f == Number.MAX_SAFE_INTEGER ||
				cellDetails[x][y].f > fNew
			) {
				openList.add([fNew, [x, y]]);
				cellDetails[x][y].f = fNew;
				cellDetails[x][y].g = gNew;
				cellDetails[x][y].h = hNew;
				cellDetails[x][y].parent_i = i;
				cellDetails[x][y].parent_j = j;
			}
		}
		return false;
	}

	update_graph(row: number, col: number, state: number) {}
}
