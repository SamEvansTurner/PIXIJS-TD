export interface IGraphOptions {
	diagonal: boolean;
	pxPerGrid: number;
	width: number;
	height: number;
}
export interface IAStarOptions {
	closest: boolean;
	heuristic: Function;
}
export type Pair = [number, number];
export type PPair = [number, Pair];
