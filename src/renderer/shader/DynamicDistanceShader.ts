import { PostGenerationShader } from "./PostGenerationShader";
import { HSLColor } from "../../util/HSLColor";
import { Game } from "../../game/Game";
import { RGBColor } from "../../util/RGBColor";

/**
 * Shader affecting all tiles withing a fixed distance range.
 * Other than {@link FixedDistanceShader}, this shader decreases color intensity with distance.
 */
export class DynamicDistanceShader implements PostGenerationShader {
	private readonly color: RGBColor;
	private readonly min: number;
	private readonly max: number;
	private readonly gradient: number;
	private readonly game: Game;

	/**
	 * Create a new territory outline shader.
	 * @param color the color of the outline.
	 * @param min the minimum distance (inclusive).
	 * @param max the maximum distance (exclusive).
	 * @param gradient the gradient of the color decrease (higher values decrease color intensity faster, sign determines direction).
	 */
	constructor(game: Game, color: HSLColor, min: number, max: number, gradient: number) {
		this.game = game;
		this.color = color.toRGB();
		this.min = min;
		this.max = max;
		this.gradient = gradient;
	}

	apply(pixels: Uint8ClampedArray): void {
		const map = this.game.map.distanceMap;
		for (let i = 0; i < map.length; i++) {
			if (map[i] < this.max && map[i] >= this.min) {
				this.color.blendWithBuffer(pixels, i * 4, this.gradient > 0 ? this.gradient * (map[i] - this.min) : 1 + this.gradient * (map[i] - this.min));
			}
		}
	}
}