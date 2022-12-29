namespace L {
    export interface MapOptions {
        baseLayerTheme: string;
        themeChanger: boolean;
        baseLayerThemesAvailable: Array<string>
    }
    export interface Evented {
        fire(type: "themechanged", fn: (e: { new: string, old?: string }) => void): this;
        on(type: "themechanged", fn: (e: { new: string, old?: string }) => void, context: L.Map) : this
        off(type: "themechanged", fn?: (e: { new: string, old?: string }) => void, context?: L.Map) : this

        fire(type: "applytheme", fn: (element: HTMLElement) => HTMLElement): this;
        on(type: "applytheme", fn: (element: HTMLElement) => HTMLElement, context: L.Map): this
        off(type: "applytheme", fn?: (element: HTMLElement) => HTMLElement, context?: L.Map) : this
    }
    export interface TileLayerOptions extends L.GridLayerOptions {
        theme?: string;
    }
    export interface Map extends Evented {
        getTheme?(): string;
    }
    export namespace Handler { 
        export class ThemeChanger extends L.Handler {
            _map: L.Map;
            _previousTheme: string

            initialize (map: L.Map) {
                this._map = map;
                this._map.getTheme = () => { return this._map.options.baseLayerTheme };
            }

            override addHooks () {
                this._map.on('baselayerchange', this._onBaseLayerChanged, this);
                this._map.on('applytheme', this._applyThemeToElement, this);
                const newThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.addClass(this._map.getContainer(), newThemeName);
            }

            override removeHooks() {
                this._map.off('baselayerchange', this._onBaseLayerChanged, this);
                this._map.off('applytheme', this._applyThemeToElement, this);
                const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);
            }

            private _onBaseLayerChanged(event: L.LayerEvent) {
                if (event.layer instanceof L.TileLayer) { 
                    if (this._map.options.baseLayerTheme === event.layer.options.theme) return;

                    const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                    L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);

                    const newThemeName = `gis-theme-${event.layer.options.theme || 'light'}`;
                    L.DomUtil.addClass(this._map.getContainer(), newThemeName);

                    this._map.options.baseLayerTheme = event.layer.options.theme;
                    this._map.fire('themechanged', { new: newThemeName, old: oldThemeName });

                    setTimeout(() => this._applyTheme(oldThemeName, newThemeName), 300);
                }
            }
            private _applyThemeToElement(element: HTMLElement) : HTMLElement {
                const theme = this._map.options.baseLayerTheme;
                const themeAwareElements = element.getElementsByClassName("gis-themeaware");
                for (let i = 0; i < themeAwareElements.length; i++) {
                    L.DomUtil.addClass(element, theme);
                }
                return element;
            }

            private _applyTheme(oldTheme:string, newTheme:string) {
                const backgroundAwareElements = document.getElementsByClassName('gis-themeaware');
                for (let i = 0; i < backgroundAwareElements.length; i++) {
                    const element: SVGElement = backgroundAwareElements[i] as SVGElement;
                    const elementClassNames = element.className.baseVal ? element.className.baseVal : element.className;
                    if (elementClassNames && elementClassNames.indexOf(oldTheme)>=0) {
                        const replacement = elementClassNames.replace(oldTheme, newTheme);
                        if (element.className.baseVal) {
                            element.className.baseVal = replacement
                        }
                        else {
                            const tmp = element as unknown;
                            L.DomUtil.removeClass(tmp as HTMLElement, oldTheme);
                            L.DomUtil.addClass(tmp as HTMLElement, newTheme);
                        }
                    } else {
                        element.classList.add(`gis-theme-${newTheme}`);
                    }
                }
            }
        }
    }

    L.Map.mergeOptions({
        baseLayerThemesAvailable: [
            'light',
            'dark'
        ],
        baseLayerTheme: 'light',
        themeChanger: true,
    });

    export function themeChanger (map: L.Map) {
        return new L.Handler.ThemeChanger(map);
    };

    L.Map.addInitHook('addHandler', 'themeChanger', L.themeChanger);
}