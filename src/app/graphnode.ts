export class GraphNode {
	parent_i: number;
	parent_j: number;
	f: number;
	g: number;
	h: number;
	constructor() {
		this.f = this.g = this.h = Number.MAX_SAFE_INTEGER;
		this.parent_i = this.parent_j = -1;
	}
}
