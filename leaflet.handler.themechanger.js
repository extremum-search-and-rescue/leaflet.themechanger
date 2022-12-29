var L;
(function (L) {
    let Handler;
    (function (Handler) {
        class ThemeChanger extends L.Handler {
            initialize(map) {
                this._map = map;
                this._map.getTheme = () => { return this._map.options.baseLayerTheme; };
            }
            addHooks() {
                this._map.on('baselayerchange', this._onBaseLayerChanged, this);
                this._map.on('applytheme', this._applyThemeToElement, this);
                const newThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.addClass(this._map.getContainer(), newThemeName);
            }
            removeHooks() {
                this._map.off('baselayerchange', this._onBaseLayerChanged, this);
                this._map.off('applytheme', this._applyThemeToElement, this);
                const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);
            }
            _onBaseLayerChanged(event) {
                if (event.layer instanceof L.TileLayer) {
                    if (this._map.options.baseLayerTheme === event.layer.options.theme)
                        return;
                    const oldThemeName = `gis-theme-${this._map.options.baseLayerTheme}`;
                    L.DomUtil.removeClass(this._map.getContainer(), oldThemeName);
                    const newThemeName = `gis-theme-${event.layer.options.theme || 'light'}`;
                    L.DomUtil.addClass(this._map.getContainer(), newThemeName);
                    this._map.options.baseLayerTheme = event.layer.options.theme;
                    this._map.fire('themechanged', { new: newThemeName, old: oldThemeName });
                    setTimeout(() => this._applyTheme(oldThemeName, newThemeName), 300);
                }
            }
            _applyThemeToElement(element) {
                const theme = this._map.options.baseLayerTheme;
                const themeAwareElements = element.getElementsByClassName("gis-themeaware");
                for (let i = 0; i < themeAwareElements.length; i++) {
                    L.DomUtil.addClass(element, theme);
                }
                return element;
            }
            _applyTheme(oldTheme, newTheme) {
                const backgroundAwareElements = document.getElementsByClassName('gis-themeaware');
                for (let i = 0; i < backgroundAwareElements.length; i++) {
                    const element = backgroundAwareElements[i];
                    const elementClassNames = element.className.baseVal ? element.className.baseVal : element.className;
                    if (elementClassNames && elementClassNames.indexOf(oldTheme) >= 0) {
                        const replacement = elementClassNames.replace(oldTheme, newTheme);
                        if (element.className.baseVal) {
                            element.className.baseVal = replacement;
                        }
                        else {
                            const tmp = element;
                            L.DomUtil.removeClass(tmp, oldTheme);
                            L.DomUtil.addClass(tmp, newTheme);
                        }
                    }
                    else {
                        element.classList.add(`gis-theme-${newTheme}`);
                    }
                }
            }
        }
        Handler.ThemeChanger = ThemeChanger;
    })(Handler = L.Handler || (L.Handler = {}));
    L.Map.mergeOptions({
        baseLayerThemesAvailable: [
            'light',
            'dark'
        ],
        baseLayerTheme: 'light',
        themeChanger: true,
    });
    function themeChanger(map) {
        return new L.Handler.ThemeChanger(map);
    }
    L.themeChanger = themeChanger;
    ;
    L.Map.addInitHook('addHandler', 'themeChanger', L.themeChanger);
})(L || (L = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZmxldC5oYW5kbGVyLnRoZW1lY2hhbmdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxlYWZsZXQuaGFuZGxlci50aGVtZWNoYW5nZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxDQUFDLENBMkdWO0FBM0dELFdBQVUsQ0FBQztJQXFCUCxJQUFpQixPQUFPLENBc0V2QjtJQXRFRCxXQUFpQixPQUFPO1FBQ3BCLE1BQWEsWUFBYSxTQUFRLENBQUMsQ0FBQyxPQUFPO1lBSXZDLFVBQVUsQ0FBRSxHQUFVO2dCQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUEsQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQztZQUVRLFFBQVE7Z0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLFlBQVksR0FBRyxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNyRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFFUSxXQUFXO2dCQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzdELE1BQU0sWUFBWSxHQUFHLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbEUsQ0FBQztZQUVPLG1CQUFtQixDQUFDLEtBQW1CO2dCQUMzQyxJQUFJLEtBQUssQ0FBQyxLQUFLLFlBQVksQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSzt3QkFBRSxPQUFPO29CQUUzRSxNQUFNLFlBQVksR0FBRyxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUU5RCxNQUFNLFlBQVksR0FBRyxhQUFhLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDekUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFFM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztvQkFFekUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUN2RTtZQUNMLENBQUM7WUFDTyxvQkFBb0IsQ0FBQyxPQUFvQjtnQkFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2dCQUMvQyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM1RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoRCxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO2dCQUNELE9BQU8sT0FBTyxDQUFDO1lBQ25CLENBQUM7WUFFTyxXQUFXLENBQUMsUUFBZSxFQUFFLFFBQWU7Z0JBQ2hELE1BQU0sdUJBQXVCLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ2xGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JELE1BQU0sT0FBTyxHQUFlLHVCQUF1QixDQUFDLENBQUMsQ0FBZSxDQUFDO29CQUNyRSxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDcEcsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUUsQ0FBQyxFQUFFO3dCQUM3RCxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNsRSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFOzRCQUMzQixPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUE7eUJBQzFDOzZCQUNJOzRCQUNELE1BQU0sR0FBRyxHQUFHLE9BQWtCLENBQUM7NEJBQy9CLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7NEJBQ3BELENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7eUJBQ3BEO3FCQUNKO3lCQUFNO3dCQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsUUFBUSxFQUFFLENBQUMsQ0FBQztxQkFDbEQ7aUJBQ0o7WUFDTCxDQUFDO1NBQ0o7UUFwRVksb0JBQVksZUFvRXhCLENBQUE7SUFDTCxDQUFDLEVBdEVnQixPQUFPLEdBQVAsU0FBTyxLQUFQLFNBQU8sUUFzRXZCO0lBRUQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFDZix3QkFBd0IsRUFBRTtZQUN0QixPQUFPO1lBQ1AsTUFBTTtTQUNUO1FBQ0QsY0FBYyxFQUFFLE9BQU87UUFDdkIsWUFBWSxFQUFFLElBQUk7S0FDckIsQ0FBQyxDQUFDO0lBRUgsU0FBZ0IsWUFBWSxDQUFFLEdBQVU7UUFDcEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFGZSxjQUFZLGVBRTNCLENBQUE7SUFBQSxDQUFDO0lBRUYsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEUsQ0FBQyxFQTNHUyxDQUFDLEtBQUQsQ0FBQyxRQTJHViJ9