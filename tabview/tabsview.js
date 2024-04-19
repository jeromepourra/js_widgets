import { Widget } from "../widget.js";

export class TabsView extends Widget {

	/**
	 * @type {TabView[]}
	 */
	m_tabsList = [];
	m_skin = "dfo";
	m_useIframe = false;
	m_useFetch = false;

	constructor() {
		super();
	}

	/**
	 * @param {string} v
	 */
	skin(v) {
		this.m_skin = v;
		return this;
	}

	addTab() {
		let tabView = new TabView();
		this.m_tabsList.push(tabView);
		return tabView;
	}

	/**
	 * @param {boolean} v
	 */
	useIframe(v) {
		this.m_useIframe = v;
		if (this.m_useIframe && this.m_useFetch) {
			// using iframe, view cannot be fetched
			this.m_useFetch = false;
		}
		return this;
	}

	/**
	 * @param {boolean} v
	 */
	useFetch(v) {
		this.m_useFetch = v;
		if (this.m_useFetch && this.m_useIframe) {
			// using fetch, view cannot be an iframe
			this.m_useIframe = false;
		}
		return this;
	}

	createHTML() {

		this.$m_root = $(`
			<div class="${this.m_skin}-tabs-view"></div>
		`);

		if (this.m_tabsList.length > 0) {

			this.$m_root.append(`
				<div class="tabs-list"></div>
			`);

			this.m_tabsList.forEach(tab => {
				tab.createHTML().attachHTML(this.$m_root.find(".tabs-list"));
			});

		}

		if (this.m_useIframe) {
			this.$m_root.append(`
				<div class="tab-view">
					<iframe src="javascript:void(0)"></iframe>
				</div>
			`);
		}

		if (this.m_useFetch) {
			this.$m_root.append(`
				<div class="tab-view"></div>
			`);
		}

		return this;

	}

}

class TabView extends Widget {

	/** 
	 * @type {?string} 
	 */
	m_title = null;

	/**
	 * @type {?string}
	 */
	m_url = null;

	$m_root = $();

	constructor() { super() }

	/**
	 * @param {string} v
	 * @returns {this}
	 */
	title(v) {
		this.m_title = v;
		return this;
	}

	/**
	 * @param {string} v
	 * @returns {this}
	 */
	url(v) {
		this.m_url = v;
		return this;
	}

	/**
	 * @returns {this}
	 * @override
	 */
	createHTML() {

		this.$m_root = $(`
			<div class="tab"></div>
		`);

		if (this.m_title) {
			this.$m_root.append(`
				<div class="title">${this.m_title}</div>
			`);
		}

		return this;

	}

}