import { Spinner } from "../spinner/spinner.js";
import { Widget } from "../widget.js";

export class TabsView extends Widget {

	/** @type {TabsViewItem[]} */
	m_list = [];

	/** @type {boolean} */
	m_useIframe = false;

	/** @type {boolean} */
	m_useFetch = false;

	constructor() {
		super();
		this.loadCss();
		this.loadSkin();
	}

	addTab() {
		let tab = new TabsViewItem(this);
		this.m_list.push(tab);
		return tab;
	}

	/**
	 * @param {TabsViewItem} tab
	 * @returns {TabsViewItem}
	 */
	removeTab(tab) {
		let index = this.m_list.findIndex(item => item === tab);
		if (index > -1) {
			this.m_list.splice(index, 1);
		}
		return tab;
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
	 * @param {TabsViewItem} tab 
	 */
	activateTab(tab) {

		if (tab.m_url) {

			if (this.m_useIframe) {

				this.$m_root.find(".view iframe").hide();
				let spinner = this.createSpinner({iframe: true});

				this.$m_root.find(".view iframe").attr("src", tab.m_url).on("load", () => {
					this.$m_root.find(".view iframe").show();
					this.removeSpinner(spinner);
				});
			}

			if (this.m_useFetch) {

				let spinner = this.createSpinner();

				fetch(tab.m_url).then(
					(response) => {
						response.text().then(
							(value) => {
								this.removeSpinner(spinner);
								this.$m_root.find(".view").html(value);
							}, (reason) => {
								console.error(`can't get response data reason: ${reason}`);
							}
						);
					}, (reason) => {
						console.error(`can't fetch url '${tab.m_url}' reason: ${reason}`);
					}
				);

			}

		}

	}

	/**
	 * @param {?{iframe: boolean}} options
	 * @returns {Spinner}
	 */
	createSpinner(options = null) {

		let spinner = new Spinner();
		spinner.image("spin.gif", Spinner.SIZES.MED);
		spinner.skin("dfo").createHTML();

		if (options) {
			if (options.iframe) {
				spinner.attachHTML(this.$m_root.find(".view"));
				return spinner;
			}
		}

		spinner.replaceHTML(this.$m_root.find(".view"));
		return spinner;

	}

	/**
	 * @param {Spinner} spinner 
	 */
	removeSpinner(spinner) {
		spinner.removeHTML();
	}

	/**
	 * @returns {?TabsViewItem}
	 */
	activeDefaultTab() {
		if (this.m_list.length > 0) {
			for (let i = 0; i < this.m_list.length; i++) {
				let tab = this.m_list[i];
				if (!tab.m_disabled) {
					this.m_list[i].active(true);
					return this.m_list[i];
				}
			}
		}
		return null
	}

	/**
	 * 
	 * @returns {?TabsViewItem}
	 */
	lookupActiveTab() {
		let activeTab = null;
		for (let i = 0; i < this.m_list.length; i++) {
			let tab = this.m_list[i];
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

		if (this.m_list.length > 0) {

			this.$m_root.append(`
				<div class="tabs"></div>
			`);

			this.m_list.forEach(tab => {
				tab.createHTML().attachHTML(this.$m_root.find(".tabs"));
			});

		}

		if (this.m_useIframe) {
			this.$m_root.append(`
				<div class="view">
					<iframe src=""></iframe>
				</div>
			`);
		}

		if (this.m_useFetch) {
			this.$m_root.append(`
				<div class="view"></div>
			`);
		}

		if (this.lookupActiveTab() === null) {
			this.activeDefaultTab();
		}

		return this;

	}

}

class TabsViewItem extends Widget {

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

	/**
	 * @param {TabsView} tabsView 
	 */
	constructor(tabsView) {
		super();
		this.m_tabsView = tabsView;
	}

	/**
	 * @returns {this}
	 */
	remove() {
		this.m_tabsView.removeTab(this);
		return this;
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
			this.m_tabsView.activateTab(this);

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