namespace L {
    export interface MapOptions {
        baseLayerTheme: string;
        themeChanger: boolean;
        baseLayerThemesAvailable: Array<string>
    }
    export namespace Handler { 
         export class ThemeChanger extends L.Handler {
             _map: Map;
             _previousTheme: string

            initialize (map) {
                this._map = map;
            }
            addHooks () {
                this._map.on('baselayerchange', this._onBaseLayerChanged, this);
                const newThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.addClass(this._map.getContainer(), newThemeName);
            }
            removeHooks() {
                this._map.off('baselayerchange', this._onBaseLayerChanged, this);
                const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);
            }
             _onBaseLayerChanged(event) {
                if (this._map.options.baseLayerTheme === event.layer.options.theme) return;

                const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);

                const newThemeName = `gis-theme-${event.layer.options.theme || 'light'}`;
                L.DomUtil.addClass(this._map.getContainer(), newThemeName);

                this._map.options.baseLayerTheme = event.layer.options.theme;
                this._map.fire('themechanged', { new: newThemeName, old: oldThemeName });
                setTimeout(() => this._applyTheme(oldThemeName, newThemeName), 300);
            }
            _applyTheme(oldTheme:string, newTheme:string) {
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

    export function themeChanger (options?) {
        return new L.Handler.ThemeChanger(options);
    };

    L.Map.addInitHook('addHandler', 'themeChanger', L.themeChanger);
}