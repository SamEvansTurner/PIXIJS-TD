import { IGraphOptions } from "./util/astarinterfaces";
import { IPosition } from "./util/iposition";
import { GraphNode } from "./graphnode";
import { PPair } from "./util/astarinterfaces";
import { Pair } from "./util/astarinterfaces";
import { Stack } from "./util/stack";
export class Graph {
	nodes: number[];
	diagonal: boolean;
	path: Pair[];
	source: Pair;
	dest: Pair;
	width: number;
	height: number;
	pxPerGrid: number;
	constructor(public grid: number[][], public options: IGraphOptions) {
		this.diagonal = options.diagonal;
		this.pxPerGrid = options.pxPerGrid;
		this.width = options.width;
		this.height = options.height;
	}

	private is_valid(row: number, column: number): boolean {
		return (
			row >= 0 && row < this.width && column >= 0 && column < this.height
		);
	}

	private is_unblocked(row: number, col: number): boolean {
		var gc = this.grid[row][col];
		if (gc === 1) {
			return true;
		} else {
			return false;
		}
	}

	private is_destination(row: number, col: number, dest: Pair) {
		if (row == dest[0] && col == dest[1]) return true;
		else return false;
	}

	private heuristic(pos0: Pair, pos1: Pair, weight: number) {
		var dx = Math.abs(pos1[0] - pos1[0]);
		var dy = Math.abs(pos1[1] - pos0[1]);

		return Math.max(dx, dy) * weight;
	}

	/*
	 ** Return a path between src and dest.
	 ** Returns a single node containing -1, -1 on error.
	 **
	 */
	public a_star_search(src: Pair, dest: Pair): Pair[] {
		this.source = src;
		this.dest = dest;
		if (
			!this.is_valid(src[0], src[1]) ||
			!this.is_valid(dest[0], dest[1])
		) {
			window.console.log("invalid Position");
			return [[-1, -1]];
		}

		if (
			!this.is_unblocked(src[0], src[1]) ||
			!this.is_unblocked(dest[0], dest[1])
		) {
			window.console.log("position blocked");
			return [[-1, -1]];
		}

		if (this.is_destination(src[0], src[1], dest)) {
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

		i = src[0];
		j = src[1];

		cellDetails[i][j].f = 0.0;
		cellDetails[i][j].g = 0.0;
		cellDetails[i][j].h = 0.0;
		cellDetails[i][j].parent_i = i;
		cellDetails[i][j].parent_j = j;

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
			var nodesAround: Pair[] = [
				[i - 1, j],
				[i + 1, j],
				[i, j + 1],
				[i, j - 1]
			];
			if (this.diagonal) {
				nodesAround.push([i - 1, j + 1]);
				nodesAround.push([i - 1, j - 1]);
				nodesAround.push([i + 1, j + 1]);
				nodesAround.push([i + 1, j - 1]);
			}

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
					var path = this.get_path(cellDetails);
					return path;
				}
			}
		}
		return [[-1, -1]];
	}

	public get_graph(): number[][] {
		return this.grid;
	}
	public set_graph(newGraph: number[][]) {
		this.grid = newGraph;
	}

	private get_path(cellDetails: GraphNode[][]): Pair[] {
		var row = this.dest[0];
		var col = this.dest[1];
		var path: Pair[] = [];
		var pI = cellDetails[row][col].parent_i;
		var pJ = cellDetails[row][col].parent_j;
		while (pI !== row || pJ !== col) {
			path.push([row, col]);
			var newRow = pI;
			var newCol = pJ;
			row = newRow;
			col = newCol;
			var pI = cellDetails[row][col].parent_i;
			var pJ = cellDetails[row][col].parent_j;
		}
		path.push([row, col]);
		path = path.reverse();

		return path;
	}

	private print_path(path: Pair[]) {
		window.console.log(path);
	}

	private process_node(
		x: number,
		y: number,
		i: number,
		j: number,
		openList: Set<PPair>,
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
			hNew = this.heuristic([x, y], this.dest, this.grid[x][y]);
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
