import { Widget } from "../widget.js";

export class Spinner extends Widget {

	/**
	 * @readonly
	 * @enum {string}
	 */
	static SIZES = {
		SML: "sma",
		MED: "med",
		BIG: "big",
	};

	/** @type {?number} */
	m_duration = null;

	/** @type {?string} */
	m_image = null;

	/** @type {string} */
	m_imageSize = Spinner.SIZES.MED;

	constructor() {
		super();
		this.loadCss();
		this.loadSkin();
	}

	/**
	 * @param {number} v 
	 * @returns {this}
	 */
	duration(v) {
		this.m_duration = v;
		return this;
	}

	/**
	 * @param {string} url 
	 * @param {?string} size
	 */
	image(url, size = null) {
		this.m_image = url;
		if (size !== null) {
			this.m_imageSize = size;
		}
		return this;
	}

	removeHTML() {
		this.$m_root.remove();
	}

	/**
	 * This method is just a way to force child class overring it
	 * @returns {this}
	 */
	createHTML() {

		this.$m_root = $(`
			<div class="spinner"></div>
		`);

		this.$m_root.addClass(this.m_imageSize);

		if (this.m_image) {
			this.$m_root.append(`
				<img src="${this.skinsUrl()}/${this.m_image}">
			`);
		}

		return this;

	}

	/**
	 * 
	 * @param {string | JQuery<HTMLElement>} to 
	 * @returns {this}
	 */
	attachHTML(to) {

		if (this.m_duration) {
			setTimeout(() => {
				this.$m_root.remove();
			}, this.m_duration);
		}

		return super.attachHTML(to);

	}

}