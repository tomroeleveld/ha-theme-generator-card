/* Card config example

	type: custom:ha-theme-generator-card
	title: Addons
	samples: 10
	invert: false
	changeTextColor: false
	primary_color: most_dominant
	accent_color: most_dominant
	dark_primary_color: second_most_dominant
  light_primary_color: lightest
	variables:
	'--app-header-background-color': second_most_dominant
	'--sidebar-background-color': second_most_dominant
	
*/
import {
	LitElement,
	html,
	css,
} from 'https://unpkg.com/lit-element@2.0.1/lit-element.js?module';

function loadScript(url) {
	const link = document.createElement('script');
	link.src = url;
	link.id = 'colorthief';
	document.head.appendChild(link);
}


loadScript(
	'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js'
);
class GeneratorCard extends LitElement {
	constructor(html) {
		super();
		this.isFinished = false;
		this.cardhtml = '';
		this.dataObject = {};
		this.dataRetrieved = false;
		this.paletteLightToDark = null;
		this.paletteDarkToLight = null;
		this.paletteDominant = null;
		this.palette = {
			dominant: [],
			lightToDark: [],
			darkToLight: [],
		};	

	}	
	static get properties() {		
		return {
			hass: {},
			config: {},
		};
		
	}

	render() {
		console.info("Theme generator render()")
		var _this = this;
		this.startColorThief(this.config).then((colors) => {
			console.log("Theme generator config:",_this.config)
			console.log("Theme generator colors:", colors)
			var previewImage = colors.previewImage.replace("'", "")
			if (document.location.href.indexOf('?edit=1') > -1) {
				_this.cardhtml = html`<div class="previewMainWrapper">
					<div>Options: <ul class='previewCircles'><li><div class='previewCircle' style='background-color:${_this.getColorByType("most_dominant")}'>&nbsp</div>most_dominant</li>
					    <li><div class='previewCircle' style='background-color:${_this.getColorByType("second_most_dominant")}'>&nbsp</div>second_most_dominant</li>
						<li><div class='previewCircle' style='background-color:${_this.getColorByType("least_dominant")}'>&nbsp</div>least_dominant</li>
						<li><div class='previewCircle' style='background-color:${_this.getColorByType("lightest")}'>&nbsp</div>lightest</li>
						<li><div class='previewCircle' style='background-color:${_this.getColorByType("darkest")}'>&nbsp</div>darkest</li></ul></div>
					<div>Current configured colors</div>
					<div class="previewWrapper ${_this.config.primary_color ?? 'hidden'}">
						<div
							class="previewColor"
							style="background-color:${colors.primaryColor}"
						></div>
						<div class="previewText">Primary</div>
					</div>
					<div class="previewWrapper ${_this.config.accentColor ?? 'hidden'}">
						<div
							class="previewColor"
							style="background-color:${colors.accentColor}"
						></div>
						<div class="previewText">Accent</div>
					</div>
					<div class="previewWrapper ${_this.config.darkPrimaryColor ?? 'hidden'}">
						<div
							class="previewColor"
							style="background-color:${colors.darkPrimaryColor}"
						></div>
						<div class="previewText">Dark primary</div>
					</div>
					<div class="previewWrapper ${_this.config.lightPrimaryColor ?? 'hidden'}">
						<div
							class="previewColor"
							style="background-color:${colors.lightPrimaryColor}"
						></div>
						<div class="previewText">Light primary</div>
					</div>
					<div class="previewImageWrapper ${previewImage.length <= 1 ?? 'hidden'}">
						<img src="${previewImage}" />
					</div>
				</div>`;
			} else {
				_this.cardhtml = html``;
			}
		});
		if (document.location.href.indexOf('?edit=1') <= -1) {
			_this.cardhtml = html``;
		}
		return html`${this.cardhtml}`;
	}

	startColorThief(config) {
		return new Promise((resolve, reject) => {
			var _this = this;
			var bgFromConfig=false;
			var ret = {
				primaryColor: null,
				darkPrimaryColor: null,
				accentColor: null,
				previewImage: null,
			};
			if (typeof ColorThief == 'undefined') {
				setTimeout(() => {
					_this.startColorThief(config);
				}, 10);
			} else if (this.isFinished == false) {
				const colorThief = new ColorThief();
				const img = new Image();			
				let bg
                bg = document
					.querySelector('home-assistant')
					.shadowRoot.querySelector('home-assistant-main')
					.shadowRoot.querySelector('partial-panel-resolver')
					.querySelector('ha-panel-lovelace')
					.shadowRoot.querySelector('hui-root').style
				console.log(bg.cssText);
				if (bg == null || bg.length == 0) {
					bg = document.querySelector('home-assistant')
						.shadowRoot.querySelector('home-assistant-main')
						.shadowRoot.querySelector('partial-panel-resolver')
						.querySelector('ha-panel-lovelace')
						.shadowRoot.querySelector('hui-root').shadowRoot.querySelector("#view").style
				}
				//var bgUrl = bg.cssText.match(/\"(.*)\"/);
				var bgUrl;
				if(!this.config.backgroundUrl){
				    bgUrl = bg.cssText.match(/(\'\/.*jpg)/);
				}else{
				    bgUrl = this.config.backgroundUrl
				    bgFromConfig=true
				}			
				img.crossOrigin = 'Anonymous';			
				if (bgUrl != null && bgUrl.length > 0) {
				    if(!bgFromConfig){
					    img.src = bgUrl[1];
					    img.src = bgUrl[1].substring(1)
				    }else{
				        img.src=bgUrl
				    }
					img.addEventListener('load', function () {
						_this.palette.dominant = colorThief.getPalette(img, _this.config.samples);
						if (_this.palette.lightToDark.length <= 0 || this.isFinished == false) {
							_this.palette.lightToDark = _this.sortLightToDark(
								_this.palette.dominant
							);
						}
						if (_this.palette.darkToLight.length <= 0 || this.isFinished == false) {
							_this.palette.darkToLight = _this.sortDarkToLight(
								_this.palette.dominant
							);
						}
						if (_this.config.primary_color) {
							_this.setElementColor(
								'--primary-color',
								_this.getColorForElement('primary_color')
							);
							_this.setElementColor(
								'--info-color',
								_this.getColorForElement('primary_color')
							);
							_this.setElementColor(
								'--icon-color',
								_this.getColorForElement('primary_color')
							);
							_this.setElementColor(
								'--paper-item-icon-color',
								_this.getColorForElement('primary_color')
							);
						}
						if (_this.config.accent_color) {
							_this.setElementColor(
								'--accent-color',
								_this.getColorForElement('accent_color')
							);
						}
						if (_this.config.light_primary_color) {
							_this.setElementColor(
								'--light-primary-color',
								_this.getColorForElement('light_primary_color')
							);
						}
						if (_this.config.dark_primary_color) {
							_this.setElementColor(
								'--dark-primary-color',
								_this.getColorForElement('dark_primary_color')
							);
						}
						if (_this.config.changeTextColor)
							_this.setElementColor(
								'--primary-text-color',
								_this.config.invert
									? _this.getColorForElement('dark_primary_color')
									: _this.getColorForElement('light_primary_color')
							);
						Object.keys(_this.config.variables).map((k, i) => {
							_this.setElementColor(
								k,
								_this.getColorByType(_this.config.variables[k])
							);
						});
						try {
							ret.primaryColor = _this.getColorForElement('primary_color');
							ret.darkPrimaryColor = _this.getColorForElement('dark_primary_color');
							ret.accentColor = _this.getColorForElement('accent_color');
							ret.lightPrimaryColor = _this.getColorForElement('light_primary_color');
							ret.previewImage = bgUrl[1];
							_this.isFinished = true;
							resolve(ret);
						} catch (error) {
							console.error(error);
							resolve(null);
						}
					});
				}
			}
		});
	}
	getColorForElement(el) {
		return this.getColorByType(this.config[el]);
	}
	getColorByType(colorType) {
		var color = null;
		switch (colorType) {
			case 'most_dominant':
				color = this.rgbArrayToHex(this.palette.dominant[0]);
				break;
			case 'second_most_dominant':
				color = this.rgbArrayToHex(this.palette.dominant[1]);
				break;
			case 'least_dominant':
				color = this.rgbArrayToHex(
					this.palette.dominant[this.palette.dominant.length - 1]
				);
				break;
			case 'lightest':
				color = this.rgbArrayToHex(this.palette.lightToDark[0]);
				break;
			case 'darkest':
				color = this.rgbArrayToHex(this.palette.darkToLight[0]);
				break;
		}
		return color;
	}
	setElementColor(selector, color) {
		document.documentElement.style.setProperty(selector, color);
	}
	sortDarkToLight(c) {
		var r = [...c];
		r.sort((a, b) => {
			return a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]);
		});
		return r;
	}
	sortLightToDark(c) {
		var r = [...c];
		r.sort(function (a, b) {
			return b[0] + b[1] + b[2] - (a[0] + a[1] + a[2]);
		});
		return r;
	}
	getLightestColorIndex(c) {
		return 0;
	}
	getDarkestColorIndex(c) {
		return c.length - 1;
	}
	rgbArrayToHex(rgb) {
		return `#${this.componentToHex(rgb[0])}${this.componentToHex(
			rgb[1]
		)}${this.componentToHex(rgb[2])}`;
	}
	rgbToHex(r, g, b) {
		return (
			'#' +
			this.componentToHex(r) +
			this.componentToHex(g) +
			this.componentToHex(b)
		);
	}
	componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}
	static get styles() {
		return css`
			.hidden {
				/*display: none;*/
			}
			.previewCircles{list-style:none; margin-left:10px; padding-left:0px;}
			.previewCircle{
				width:16px;
				height:16px;
				border-radius:50%;
				float:left;
				margin-right:5px;
			}
			.previewWrapper {
				float:left;
				width: 64px;
				margin-right: 10px;
			}
			.previewColor {
				width: 64px;
				height: 64px;
				border-radius: 50%;
			}
			.previewText {
				font-size: 9px;
				font-weight: bold;
				text-align: center;
			}
			.previewImageWrapper img {
				max-width: 445px;
				border-radius: 10px;
			}
		`;
	}
	setConfig(config) {
	   
		if (!config.backgroundUrl) {
			//			throw new Error('You need to set backgroundUrl');
		}
		if (config.samples < 3) {
			throw new Error('Samples needs to be higher than 3');
		}

		this.isFinished = false;
		this.config = config;
	}
}
customElements.define('ha-theme-generator-card', GeneratorCard);
