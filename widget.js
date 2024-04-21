export class Widget {

	/** @type {JQuery<HTMLElement>} */
	$m_root = $(); // root widget container

	/** @type {string} */
	m_skin = "dfo"; // default skin

	/** @type {string} */
	m_widgetName;

	/** @type {string} */
	m_widgetFolder;

	constructor() {
		this.m_widgetName = this.constructor.name;
		this.m_widgetFolder = this.m_widgetName.toLowerCase();
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
	 * @returns {string}
	 */
	widgetUrl(basepath = ".") {
		return `${basepath}/${this.m_widgetFolder}`;
	}

	/**
	 * @param {string} basepath 
	 * @returns {string}
	 */
	skinsUrl(basepath = ".") {
		return `${this.widgetUrl(basepath)}/skins/${this.m_skin}`;
	}

	/**
	 * @param {string} basepath 
	 * @returns {this}
	 */
	loadCss(basepath = ".") {
		let widgetPath = this.m_widgetName.toLowerCase();
		let cssPath = `${basepath}/${widgetPath}/${widgetPath}.css`
		return this.appendCss(cssPath);
	}

	/**
	 * @param {string} basepath 
	 * @returns {this}
	 */
	loadSkin(basepath = ".") {
		let widgetPath = this.m_widgetName.toLowerCase();
		let skinPath = `${basepath}/${widgetPath}/skins/${this.m_skin}/${this.m_skin}.css`
		return this.appendCss(skinPath);
	}

	/**
	 * @param {string} path 
	 * @returns {this}
	 */
	appendCss(path) {
		if ($(`link[href="${path}"]`).length === 0) {
			let $link = $(`<link rel="stylesheet" href="${path}"></link>`);
			$(document.head).append($link);
		}
		return this;
	}

	/**
	 * This method is just a way to force child class overring it
	 * @returns {this}
	 */
	createHTML() {
		return this;
	}

	/**
	 * This method removing the widget main element
	 * @return {this}
	 */
	removeHTML() {
		this.$m_root.remove();
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

	/**
	 * 
	 * @param {string | JQuery<HTMLElement>} to
	 * @returns {this}
	 */
	replaceHTML(to) {

		/** @type {JQuery<HTMLElement>} */
		let $to;

		if (!(to instanceof $)) {
			// @ts-ignore
			$to = $(to);
		} else {
			$to = to;
		}

		if ($to.length > 0) {
			$to.empty();
			$to.append(this.$m_root);
		} else {
			console.error(`Widget.attachHTML() -> selector ${to} doesn't exists`);
		}

		return this;

	}

}