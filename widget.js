export class Widget {

	/** @type {JQuery<HTMLElement>} */
	$m_root = $(); // root widget container

	/** @type {string} */
	m_skin = "dfo"; // default skin

	/** @type {string} */
	m_widgetName;

	constructor() {
		this.m_widgetName = this.constructor.name;
	}

	/**
	 * @param {string} v
	 */
	skin(v) {
		this.m_skin = v;
		return this;
	}

	/**
	 * @param {string} basepath 
	 * @returns {void}
	 */
	loadCss(basepath = ".") {
		let widgetPath = this.m_widgetName.toLowerCase();
		let cssPath = `${basepath}/${widgetPath}/${widgetPath}.css`
		this.appendCss(cssPath);
	}

	/**
	 * @param {string} basepath 
	 * @returns {void}
	 */
	loadSkin(basepath = ".") {
		let widgetPath = this.m_widgetName.toLowerCase();
		let skinPath = `${basepath}/${widgetPath}/skins/${this.m_skin}.css`
		this.appendCss(skinPath);
	}

	/**
	 * @param {string} path 
	 */
	appendCss(path) {
		setTimeout(() => {
			if ($(`link[href="${path}"]`).length === 0) {
				let $link = $(`<link rel="stylesheet" href="${path}"></link>`);
				$(document.head).append($link);
			}
		}, 500);
	}

	/**
	 * This method is just a way to force child class overring it
	 * @returns {this}
	 */
	createHTML() {
		return this;
	}

	/**
	 * 
	 * @param {string | JQuery<HTMLElement>} to
	 * @returns {this}
	 */
	attachHTML(to) {

		if (!(to instanceof $)) {
			// @ts-ignore
			to = $(to);
		}

		if (to.length > 0) {
			this.$m_root.appendTo(to);
		} else {
			console.error(`Widget.attachHTML() -> selector ${to} doesn't exists`);
		}

		return this;

	}

}