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
		let tabView = new TabView(this);
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

	/**
	 * 
	 * @returns {?TabView}
	 */
	lookupActiveTab() {
		let activeTab = null;
		for (let i = 0; i < this.m_tabsList.length; i++) {
			let tab = this.m_tabsList[i];
			if (tab.m_active) {
				activeTab = tab;
				break;
			}
		}
		return activeTab;
	}

	createHTML() {

		this.$m_root = $(`
			<div class="tabs-view ${this.m_skin}"></div>
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

	/** @type {TabsView} */
	m_tabsView;

	/** @type {?string} */
	m_title = null;

	/** @type {?string} */
	m_url = null;

	/** @type {boolean} */
	m_active = false;

	/** @type {boolean} */
	m_disabled = false;

	/** @type {JQuery<HTMLElement>} */
	$m_root = $();

	/**
	 * @param {TabsView} tabsView 
	 */
	constructor(tabsView) {
		super();
		this.m_tabsView = tabsView;
	}

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
	 * @param {boolean} v 
	 * @returns {this}
	 */
	active(v) {

		if (v) {

			// la tab est désactivé on ne va pas plus loin
			if (this.m_disabled) {
				return this;
			}

			let activeTab = this.m_tabsView.lookupActiveTab();
			if (activeTab) {
				activeTab.active(false);
			}

			this.$m_root.addClass("active");

		} else {
			this.$m_root.removeClass("active");
		}

		this.m_active = v;
		return this;
	}

	/**
	 * @param {boolean} v 
	 * @returns {this}
	 */
	disabled(v) {
		if (v) {
			this.$m_root.addClass("disabled");
		} else {
			this.$m_root.removeClass("disabled");
		}
		this.m_disabled = v;
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

		if (this.m_active) {
			this.active(true);
		}

		if (this.m_disabled) {
			this.disabled(true);
		}

		if (this.m_title) {
			this.$m_root.append(`
				<div class="title">${this.m_title}</div>
			`);
		}

		this.$m_root.on("click", () => {
			this.active(true)
		});

		return this;

	}

}