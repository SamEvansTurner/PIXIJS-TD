import * as PIXI from "pixi.js";
export interface State {
	stage: PIXI.Container;
	renderer: PIXI.AbstractRenderer;
	interactionManager: PIXI.interaction.InteractionManager;

	update(_delta): any;

	render(_delta): any;
}
