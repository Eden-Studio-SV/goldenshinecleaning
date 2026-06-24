// Golden Shine — icon set (Lucide-style, 2px line icons, ISC).
// Inline so the UI kit stays self-contained. Stroke uses currentColor.
const React = window.React;

function make(paths, opts = {}) {
  return function Icon({ size = 24, stroke = 2, color = 'currentColor', style = {}, ...rest }) {
    return React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: opts.fill || 'none',
      stroke: opts.fill ? 'none' : color, strokeWidth: stroke, strokeLinecap: 'round',
      strokeLinejoin: 'round', style: { display: 'block', ...style }, ...rest,
    }, paths.map((d, i) => React.createElement('path', { key: i, d })));
  };
}

const Home2     = make(['M3 9.5 12 3l9 6.5', 'M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9', 'M9 20v-6h6v6']);
const Building  = make(['M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16', 'M14 9h5a1 1 0 0 1 1 1v11', 'M8 8h2M8 12h2M8 16h2M17 13h.01M17 17h.01', 'M2 21h20']);
const Sparkles  = make(['M12 3l1.9 4.7L18.6 9.6 13.9 11.5 12 16.2 10.1 11.5 5.4 9.6 10.1 7.7z', 'M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z', 'M5 15l.6 1.5 1.5.6-1.5.6L5 19.7l-.6-1.5L2.9 17.6l1.5-.6z']);
const Spray     = make(['M9 11h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z', 'M10 11V7a1 1 0 0 1 1-1h2', 'M13 4h4l2 2', 'M19 3v3']);
const Truck     = make(['M3 6h11v9H3z', 'M14 9h4l3 3v3h-7', 'M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z']);
const Sofa      = make(['M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3', 'M2 13a2 2 0 0 1 2 2v2h16v-2a2 2 0 0 1 2-2', 'M5 17v2M19 17v2']);
const Calendar  = make(['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 9h18', 'M8 3v4M16 3v4']);
const Check     = make(['M20 6 9 17l-5-5']);
const CheckCircle = make(['M22 11.5V12a10 10 0 1 1-5.9-9.1', 'M22 4 12 14.1l-3-3']);
const Clock     = make(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 7v5l3 2']);
const Shield    = make(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4']);
const Leaf      = make(['M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 13-9 13z', 'M4 21c4-7 8-9 13-10']);
const Phone     = make(['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z']);
const Mail      = make(['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'm3 7 9 6 9-6']);
const MapPin    = make(['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']);
const Arrow     = make(['M5 12h14', 'm13 6 6 6-6 6']);
const Menu      = make(['M4 7h16M4 12h16M4 17h16']);
const X         = make(['M6 6 18 18M18 6 6 18']);
const Star      = make(['M12 2.5l2.9 5.88 6.49.94-4.69 4.57 1.1 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.57 6.49-.94L12 2.5z'], { fill: true });
const Wand      = make(['M15 4V2M15 10V8M9 4h12M9 10h12', 'M5 21l9-9', 'M14 6l4 4']);
const Phone2    = Phone;

Object.assign(window, {
  GsIcons: {
    Home2, Building, Sparkles, Spray, Truck, Sofa, Calendar, Check, CheckCircle,
    Clock, Shield, Leaf, Phone: Phone2, Mail, MapPin, Arrow, Menu, X, Star, Wand,
  },
});
