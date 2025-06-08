export default class Color{
    constructor(hexCode){
        this.hexCode = hexCode;
    }

    get rgb() {
        const hex = this.hexCode.replace("#", "");
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    get hsl() {
        let { r, g, b } = this.rgb;
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; 
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    _hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h < 60) {
            r = c; g = x; b = 0;
        } else if (h < 120) {
            r = x; g = c; b = 0;
        } else if (h < 180) {
            r = 0; g = c; b = x;
        } else if (h < 240) {
            r = 0; g = x; b = c;
        } else if (h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        const hexColor = `#${Math.round((r + m) * 255).toString(16).padStart(2, '0')}${Math.round((g + m) * 255).toString(16).padStart(2, '0')}${Math.round((b + m) * 255).toString(16).padStart(2, '0')}`;
        return hexColor;
    }

    get TriadicColors() {
        const hsl = this.hsl;
        const triadicColors = [];
        for (let i = 0; i < 3; i++) {
            const angle = (hsl.h + i * 120) % 360;
            triadicColors.push(this._hslToHex(angle, hsl.s, hsl.l));
        }
        return triadicColors;
    }
}