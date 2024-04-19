export class Widget {

	/**
	 * @type {JQuery<HTMLElement>}
	 */
	$m_root = $(); // root widget container

	/**
	 * @type {string}
	 */
	m_skin = "dfo"; // default skin

	constructor() {}

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