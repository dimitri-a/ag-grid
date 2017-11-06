import {PreDestroy, Bean, Qualifier, Autowired, PostConstruct, Optional, Context} from './context/context';

let themeNames = ['fresh', 'dark', 'blue', 'bootstrap', 'material'];
const themes = themeNames.concat(themeNames.map(name => `theme-${name}`));
const themeClass = new RegExp(`ag-(${themes.join('|')})`);

const matGridSize = 8;
const matIconSize = 18;
type HardCodedSize = {[key: string]: {[key: string]: number}};

const freshGridSize = 4;
const freshIconSize = 14;

const HARD_CODED_SIZES: HardCodedSize = {
    'ag-theme-material': {
        autoSizePadding: matGridSize * 3,
        headerHeight: matGridSize * 7,
        groupPaddingSize: matGridSize * 3 + matIconSize,
        footerPaddingAddition: matGridSize * 4,
        virtualItemHeight: matGridSize * 5,
        aggFuncPopupHeight: matGridSize * 5 * 3.5,
        checkboxIndentWidth: matGridSize + matIconSize,
        leafNodePadding: matGridSize * 3,
        rowHeight: matGridSize * 6,
        gridSize: matGridSize,
        iconSize: matIconSize
    },
    'ag-theme-classic': {
        autoSizePadding: freshGridSize * 3,
        headerHeight: 25,
        groupPaddingSize: freshGridSize * 3 + freshIconSize,
        footerPaddingAddition: freshGridSize * 4,
        virtualItemHeight: freshGridSize * 5,
        aggFuncPopupHeight: freshGridSize * 5 * 3.5,
        checkboxIndentWidth: freshGridSize + freshIconSize,
        leafNodePadding: freshGridSize * 3,
        rowHeight: 25,
        gridSize: freshGridSize,
        iconSize: freshIconSize
    }
};

@Bean('environment')
export class Environment {
    @Autowired('eGridDiv') private eGridDiv: HTMLElement;

    private gridSize: number;
    private iconSize: number;
    private sassVariables: {[key: string]: string} = {};

    // Approach described here:
    // https://www.ofcodeandcolor.com/2017/04/02/encoding-data-in-css/
    public loadSassVariables(): void {
        /*
        var element = document.createElement('div');
        element.className = 'sass-variables';
        this.eGridDiv.appendChild(element);

        var content = window.getComputedStyle(element, '::after').content;

        try {
            this.sassVariables = JSON.parse(JSON.parse(content));
        } catch (e) {
            throw new Error("Failed loading the theme sizing - check that you have the theme set up correctly.");
        }

        this.eGridDiv.removeChild(element);
        */
    }

    public getSassVariable(theme: string, key: string): number {
        if (theme == 'ag-theme-material') {
            return HARD_CODED_SIZES['ag-theme-material'][key];
        }
        return HARD_CODED_SIZES['ag-theme-classic'][key];
        /*
        const result = parseInt(this.sassVariables[key]);
        if (!result || isNaN(result)) {
            throw new Error(`Failed loading ${key} Sass variable from ${this.sassVariables}`);
        }
        return result;
        */
    }

    public getTheme(): string {
        let themeMatch: RegExpMatchArray;
        let element: HTMLElement = this.eGridDiv;

        while (element != document.documentElement && themeMatch == null) {
            themeMatch = element.className.match(themeClass);
            element = element.parentElement;
            if (element == null) {
                break;
            }
        }

        if (themeMatch) {
            return themeMatch[0];
        } else {
            return 'ag-fresh';
        }
    }
}
