/* @ds-bundle: {"format":3,"namespace":"GoldenShineDesignSystem_23f889","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"Rating","sourcePath":"components/data-display/Rating.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"7075d7ee870c","components/buttons/IconButton.jsx":"aec23af8356b","components/data-display/Avatar.jsx":"b38cad5c8f85","components/data-display/Badge.jsx":"5d57c6a9c6e4","components/data-display/Card.jsx":"79cae0040064","components/data-display/Rating.jsx":"f2e66d03f5d0","components/forms/Checkbox.jsx":"c6c383c9fd0b","components/forms/Input.jsx":"2ae34d9fdff7","components/forms/Select.jsx":"d86e24c6902c","ui_kits/website/App.jsx":"bbd73554bf4b","ui_kits/website/Footer.jsx":"ba2a65cb2e43","ui_kits/website/Header.jsx":"dfbf21af15ff","ui_kits/website/Hero.jsx":"4d4e0d40adbf","ui_kits/website/QuoteForm.jsx":"e66150128b3d","ui_kits/website/Sections.jsx":"c096a2e4babd","ui_kits/website/copy.js":"80d856235425","ui_kits/website/icons.jsx":"ee50b98fc204"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GoldenShineDesignSystem_23f889 = window.GoldenShineDesignSystem_23f889 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Golden Shine — Button
 * Primary action uses brand navy; the coral "accent" variant is the
 * high-energy CTA pulled straight from the spray-bottle color.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '0 14px',
      height: 36,
      fontSize: 14,
      gap: 7
    },
    md: {
      padding: '0 20px',
      height: 46,
      fontSize: 15,
      gap: 8
    },
    lg: {
      padding: '0 28px',
      height: 56,
      fontSize: 17,
      gap: 10
    }
  };
  const variants = {
    primary: {
      background: 'var(--navy-700)',
      color: 'var(--cream-100)',
      border: '1px solid var(--navy-700)',
      boxShadow: 'var(--shadow-sm)'
    },
    accent: {
      background: 'var(--coral-500)',
      color: 'var(--cream-100)',
      border: '1px solid var(--coral-500)',
      boxShadow: 'var(--shadow-coral)'
    },
    secondary: {
      background: 'var(--white)',
      color: 'var(--navy-700)',
      border: '1.5px solid var(--navy-700)',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--navy-700)',
      border: '1px solid transparent',
      boxShadow: 'none'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1,
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    WebkitTapHighlightColor: 'transparent',
    ...v,
    ...style
  };
  const onDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
  };
  const onUp = e => {
    e.currentTarget.style.transform = 'scale(1)';
  };
  const onEnter = e => {
    if (!disabled) e.currentTarget.style.filter = 'brightness(1.06)';
  };
  const onLeave = e => {
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.transform = 'scale(1)';
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseDown: onDown,
    onMouseUp: onUp,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave
  }, rest), leftIcon, children, rightIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Golden Shine — IconButton
 * Circular icon-only button. Pass an SVG/icon node as children.
 */
function IconButton({
  children,
  variant = 'soft',
  size = 'md',
  disabled = false,
  label,
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 36,
    md: 44,
    lg: 52
  };
  const dim = sizes[size] || sizes.md;
  const variants = {
    solid: {
      background: 'var(--navy-700)',
      color: 'var(--cream-100)',
      border: 'none'
    },
    accent: {
      background: 'var(--coral-500)',
      color: 'var(--cream-100)',
      border: 'none'
    },
    soft: {
      background: 'var(--navy-100)',
      color: 'var(--navy-700)',
      border: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--navy-700)',
      border: '1px solid var(--border-default)'
    }
  };
  const v = variants[variant] || variants.soft;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-circle)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out)',
    WebkitTapHighlightColor: 'transparent',
    padding: 0,
    ...v,
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(1.06)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
/**
 * Golden Shine — Avatar
 * Circular avatar with image or initials fallback. Initials sit on a navy ground.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  style = {}
}) {
  const sizes = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88
  };
  const dim = sizes[size] || sizes.md;
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const base = {
    width: dim,
    height: dim,
    borderRadius: 'var(--radius-circle)',
    flex: 'none',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--navy-700)',
    color: 'var(--cream-100)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: dim * 0.38,
    border: '2px solid var(--white)',
    boxShadow: 'var(--shadow-sm)',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: base,
    "aria-label": name || undefined
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", null, initials || '★'));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
/**
 * Golden Shine — Badge
 * Small status/label pill. Tones map to brand + semantic colors.
 */
function Badge({
  children,
  tone = 'navy',
  solid = false,
  style = {}
}) {
  const tones = {
    navy: {
      soft: ['var(--navy-100)', 'var(--navy-700)'],
      solid: ['var(--navy-700)', 'var(--cream-100)']
    },
    coral: {
      soft: ['var(--coral-100)', 'var(--coral-700)'],
      solid: ['var(--coral-500)', 'var(--cream-100)']
    },
    cream: {
      soft: ['var(--cream-200)', 'var(--navy-800)'],
      solid: ['var(--cream-200)', 'var(--navy-800)']
    },
    success: {
      soft: ['var(--success-100)', 'var(--success-600)'],
      solid: ['var(--success-500)', 'var(--white)']
    },
    warning: {
      soft: ['var(--warning-100)', 'var(--warning-600)'],
      solid: ['var(--warning-500)', 'var(--white)']
    },
    danger: {
      soft: ['var(--danger-100)', 'var(--danger-600)'],
      solid: ['var(--danger-500)', 'var(--white)']
    },
    neutral: {
      soft: ['var(--ink-100)', 'var(--ink-700)'],
      solid: ['var(--ink-700)', 'var(--white)']
    }
  };
  const t = tones[tone] || tones.navy;
  const [bg, fg] = solid ? t.solid : t.soft;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: bg,
    color: fg,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: 12.5,
    letterSpacing: '0.02em',
    lineHeight: 1,
    padding: '6px 12px',
    borderRadius: 'var(--radius-pill)',
    whiteSpace: 'nowrap',
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    style: base
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Golden Shine — Card
 * Rounded white surface with soft navy-tinted shadow. Optional hover lift.
 */
function Card({
  children,
  padding = 'md',
  interactive = false,
  style = {},
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  const base = {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-sm)',
    padding: pads[padding] ?? pads.md,
    transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...style
  };
  const hover = interactive ? {
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base
  }, hover, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Rating.jsx
try { (() => {
/**
 * Golden Shine — Rating
 * Star rating display (coral stars). Read-only by default; supports half stars.
 */
function Rating({
  value = 5,
  max = 5,
  size = 18,
  showValue = false,
  style = {}
}) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const fill = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
    stars.push(fill);
  }
  const Star = ({
    fill
  }) => {
    const id = 'gs-star-' + Math.random().toString(36).slice(2, 8);
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: id
    }, /*#__PURE__*/React.createElement("stop", {
      offset: fill * 100 + '%',
      stopColor: "var(--coral-500)"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: fill * 100 + '%',
      stopColor: "var(--ink-200)"
    }))), /*#__PURE__*/React.createElement("path", {
      fill: `url(#${id})`,
      d: "M12 2.5l2.9 5.88 6.49.94-4.69 4.57 1.1 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.57 6.49-.94L12 2.5z"
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      ...style
    }
  }, stars.map((f, i) => /*#__PURE__*/React.createElement(Star, {
    key: i,
    fill: f
  })), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: size * 0.82,
      color: 'var(--text-strong)'
    }
  }, value.toFixed(1)));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Rating.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Golden Shine — Checkbox
 * Square check with coral fill when selected. Use for service add-ons, consents.
 */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  const inputId = id || (label ? 'gs-cb-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const wrap = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--text-body)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    ...style
  };
  const box = {
    width: 22,
    height: 22,
    flex: 'none',
    borderRadius: 'var(--radius-xs)',
    border: on ? '1.5px solid var(--coral-500)' : '1.5px solid var(--border-strong)',
    background: on ? 'var(--coral-500)' : 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--dur-fast) var(--ease-out)'
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: wrap
  }, /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: box
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--cream-100)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Golden Shine — Input
 * Text field with optional label, helper/error text, and leading icon.
 */
function Input({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  helper,
  leftIcon = null,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const inputId = id || (label ? 'gs-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? 'var(--danger-500)' : focused ? 'var(--coral-400)' : 'var(--border-default)';
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontFamily: 'var(--font-body)',
    ...style
  };
  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-strong)'
  };
  const field = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    height: 50,
    padding: '0 16px',
    background: disabled ? 'var(--ink-100)' : 'var(--white)',
    border: '1.5px solid ' + borderColor,
    borderRadius: 'var(--radius-md)',
    boxShadow: focused ? '0 0 0 4px rgba(242,107,78,0.15)' : 'var(--shadow-xs)',
    transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
  };
  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--text-strong)',
    width: '100%',
    minWidth: 0
  };
  const msg = {
    fontSize: 13,
    color: error ? 'var(--danger-600)' : 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("div", {
    style: field
  }, leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--text-faint)'
    }
  }, leftIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    style: inputStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest))), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: msg
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/**
 * Golden Shine — Select
 * Native select styled to match the Input field, with a chevron.
 */
function Select({
  label,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  id,
  style = {}
}) {
  const [focused, setFocused] = React.useState(false);
  const selectId = id || (label ? 'gs-sel-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontFamily: 'var(--font-body)',
    ...style
  };
  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-strong)'
  };
  const field = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: 50,
    background: disabled ? 'var(--ink-100)' : 'var(--white)',
    border: '1.5px solid ' + (focused ? 'var(--coral-400)' : 'var(--border-default)'),
    borderRadius: 'var(--radius-md)',
    boxShadow: focused ? '0 0 0 4px rgba(242,107,78,0.15)' : 'var(--shadow-xs)',
    transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
  };
  const selectStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--text-strong)',
    padding: '0 40px 0 16px',
    height: '100%',
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("div", {
    style: field
  }, /*#__PURE__*/React.createElement("select", {
    id: selectId,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    style: selectStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lab);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: 14,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
// Golden Shine website — App shell (composes all sections, manages language)
const React = window.React;
function App() {
  const [lang, setLang] = React.useState('en');
  const t = window.GsCopy[lang];
  const toggleLang = () => setLang(lang === 'en' ? 'es' : 'en');
  const nav = id => {
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };
  const book = () => nav('contact');
  return React.createElement('div', null, React.createElement(window.GsHeader, {
    t,
    lang,
    onToggleLang: toggleLang,
    onBook: book,
    onNav: nav
  }), React.createElement(window.GsHero, {
    t,
    onBook: book,
    onServices: () => nav('services')
  }), React.createElement(window.GsServices, {
    t,
    onBook: book
  }), React.createElement(window.GsHowItWorks, {
    t
  }), React.createElement(window.GsWhyUs, {
    t
  }), React.createElement(window.GsReviews, {
    t
  }), React.createElement(window.GsQuoteForm, {
    t
  }), React.createElement(window.GsFooter, {
    t
  }));
}
Object.assign(window, {
  GsApp: App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Golden Shine website — Footer
const React = window.React;
function Footer({
  t
}) {
  const I = window.GsIcons;
  const Lockup = window.GsBrandLockup;
  const colTitle = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--cream-100)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    margin: '0 0 14px'
  };
  const link = {
    fontFamily: 'var(--font-body)',
    color: 'var(--navy-200)',
    fontSize: 14.5,
    textDecoration: 'none',
    display: 'block',
    padding: '5px 0',
    cursor: 'pointer'
  };
  const contactRow = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'var(--navy-200)',
    fontFamily: 'var(--font-body)',
    fontSize: 14.5,
    padding: '5px 0'
  };
  return React.createElement('footer', {
    style: {
      background: 'var(--navy-900)',
      color: 'var(--cream-100)'
    }
  }, React.createElement('div', {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '56px var(--gutter) 28px'
    }
  }, React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))',
      gap: 36
    }
  }, React.createElement('div', null, React.createElement(Lockup, {
    onNavy: true
  }), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--navy-200)',
      fontSize: 14.5,
      lineHeight: 1.6,
      margin: '16px 0 0',
      maxWidth: 240
    }
  }, t.footer.tagline)), React.createElement('div', null, React.createElement('h4', {
    style: colTitle
  }, t.footer.col1), t.services.items.map((s, i) => React.createElement('a', {
    key: i,
    style: link
  }, s.name))), React.createElement('div', null, React.createElement('h4', {
    style: colTitle
  }, t.footer.col2), t.footer.company.map((c, i) => React.createElement('a', {
    key: i,
    style: link
  }, c))), React.createElement('div', null, React.createElement('h4', {
    style: colTitle
  }, t.footer.col3), React.createElement('div', {
    style: contactRow
  }, React.createElement(I.Phone, {
    size: 17,
    color: 'var(--coral-400)'
  }), '(555) 123-4567'), React.createElement('div', {
    style: contactRow
  }, React.createElement(I.Mail, {
    size: 17,
    color: 'var(--coral-400)'
  }), 'hello@goldenshine.com'), React.createElement('div', {
    style: contactRow
  }, React.createElement(I.MapPin, {
    size: 17,
    color: 'var(--coral-400)'
  }), t.footer.area), React.createElement('div', {
    style: contactRow
  }, React.createElement(I.Clock, {
    size: 17,
    color: 'var(--coral-400)'
  }), t.footer.hours))), React.createElement('div', {
    style: {
      borderTop: '1px solid var(--border-on-navy)',
      marginTop: 40,
      paddingTop: 22,
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      color: 'var(--navy-300)',
      fontSize: 13
    }
  }, t.footer.rights)));
}
Object.assign(window, {
  GsFooter: Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Golden Shine website — Brand lockup + Header
const React = window.React;

// Typographic brand lockup using the brand fonts (scales cleanly, on any bg)
function BrandLockup({
  onNavy = false,
  size = 1
}) {
  const cream = 'var(--cream-100)';
  const scriptColor = onNavy ? cream : 'var(--navy-700)';
  const capsColor = 'var(--coral-500)';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1,
      userSelect: 'none'
    }
  }, React.createElement('span', {
    style: {
      fontFamily: 'var(--font-script)',
      color: scriptColor,
      fontSize: 34 * size,
      lineHeight: 0.82,
      marginLeft: 2
    }
  }, 'Golden shine'), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-display)',
      color: capsColor,
      fontWeight: 600,
      fontSize: 11 * size,
      letterSpacing: '0.22em',
      textTransform: 'uppercase'
    }
  }, 'Cleaning Service'));
}
function Header({
  t,
  lang,
  onToggleLang,
  onBook,
  onNav
}) {
  const {
    Button,
    IconButton
  } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  const [open, setOpen] = React.useState(false);
  const links = [{
    k: 'services',
    id: 'services'
  }, {
    k: 'how',
    id: 'how'
  }, {
    k: 'reviews',
    id: 'reviews'
  }, {
    k: 'contact',
    id: 'contact'
  }];
  const go = id => {
    setOpen(false);
    onNav && onNav(id);
  };
  const linkStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 15,
    color: 'var(--cream-100)',
    cursor: 'pointer',
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    transition: 'color var(--dur-fast) var(--ease-out)'
  };
  return React.createElement('header', {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--navy-700)',
      borderBottom: '1px solid var(--border-on-navy)'
    }
  }, React.createElement('div', {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '14px var(--gutter)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, React.createElement('div', {
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('top')
  }, React.createElement(BrandLockup, {
    onNavy: true
  })),
  // desktop nav
  React.createElement('nav', {
    className: 'gs-desktop-nav',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, links.map(l => React.createElement('button', {
    key: l.k,
    style: linkStyle,
    onClick: () => go(l.id),
    onMouseEnter: e => e.currentTarget.style.color = 'var(--coral-300)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--cream-100)'
  }, t.nav[l.k]))), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement('button', {
    onClick: onToggleLang,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--cream-100)',
      background: 'transparent',
      border: '1.5px solid var(--border-on-navy)',
      borderRadius: 'var(--radius-pill)',
      padding: '7px 14px',
      cursor: 'pointer',
      letterSpacing: '0.04em'
    },
    title: lang === 'en' ? 'Cambiar a Español' : 'Switch to English'
  }, '🌐 ' + t.langLabel), React.createElement('div', {
    className: 'gs-desktop-nav'
  }, React.createElement(Button, {
    variant: 'accent',
    size: 'md',
    onClick: onBook
  }, t.nav.book)), React.createElement('div', {
    className: 'gs-mobile-only'
  }, React.createElement(IconButton, {
    label: 'Menu',
    variant: 'soft',
    onClick: () => setOpen(!open)
  }, React.createElement(open ? I.X : I.Menu, {
    size: 22
  }))))),
  // mobile dropdown
  open && React.createElement('div', {
    className: 'gs-mobile-only',
    style: {
      padding: '8px var(--gutter) 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      borderTop: '1px solid var(--border-on-navy)'
    }
  }, links.map(l => React.createElement('button', {
    key: l.k,
    onClick: () => go(l.id),
    style: {
      ...linkStyle,
      textAlign: 'left',
      fontSize: 17,
      padding: '12px 4px'
    }
  }, t.nav[l.k])), React.createElement(Button, {
    variant: 'accent',
    size: 'lg',
    fullWidth: true,
    onClick: () => {
      setOpen(false);
      onBook();
    },
    style: {
      marginTop: 8
    }
  }, t.nav.book)));
}
Object.assign(window, {
  GsHeader: Header,
  GsBrandLockup: BrandLockup
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Golden Shine website — Hero
const React = window.React;
function Hero({
  t,
  onBook,
  onServices
}) {
  const {
    Button,
    Badge,
    Rating
  } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  return React.createElement('section', {
    id: 'top',
    style: {
      background: 'var(--navy-700)',
      color: 'var(--cream-100)',
      position: 'relative',
      overflow: 'hidden'
    }
  },
  // soft decorative glow
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: -160,
      right: -120,
      width: 460,
      height: 460,
      background: 'radial-gradient(circle, rgba(232,88,68,0.30), transparent 70%)',
      pointerEvents: 'none'
    }
  }), React.createElement('div', {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: 'clamp(3rem,7vw,6rem) var(--gutter)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 'clamp(2rem,5vw,4rem)',
      alignItems: 'center',
      position: 'relative'
    }
  },
  // copy
  React.createElement('div', null, React.createElement('span', {
    className: 'gs-eyebrow',
    style: {
      color: 'var(--coral-300)'
    }
  }, t.hero.eyebrow), React.createElement('h1', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      color: 'var(--cream-100)',
      fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      margin: '14px 0 0'
    }
  }, t.hero.titleA, React.createElement('br'), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-script)',
      fontWeight: 400,
      color: 'var(--coral-400)',
      fontSize: 'clamp(3rem, 6.5vw, 4.8rem)',
      display: 'inline-block',
      lineHeight: 1,
      marginTop: 6
    }
  }, t.hero.titleScript)), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--navy-200)',
      fontSize: 'clamp(1rem,1.4vw,1.18rem)',
      lineHeight: 1.6,
      maxWidth: 520,
      margin: '20px 0 0'
    }
  }, t.hero.sub), React.createElement('div', {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 30
    }
  }, React.createElement(Button, {
    variant: 'accent',
    size: 'lg',
    onClick: onBook,
    rightIcon: React.createElement(I.Arrow, {
      size: 18
    })
  }, t.hero.ctaPrimary), React.createElement(Button, {
    variant: 'secondary',
    size: 'lg',
    onClick: onServices,
    style: {
      background: 'transparent',
      color: 'var(--cream-100)',
      borderColor: 'var(--border-on-navy)'
    }
  }, t.hero.ctaSecondary)), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 26,
      color: 'var(--navy-200)'
    }
  }, React.createElement(I.Shield, {
    size: 18,
    color: 'var(--coral-300)'
  }), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14
    }
  }, t.hero.trust))),
  // visual
  React.createElement('div', {
    style: {
      position: 'relative',
      justifySelf: 'center',
      width: '100%',
      maxWidth: 460
    }
  }, React.createElement('div', {
    style: {
      background: 'var(--cream-200)',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)',
      aspectRatio: '4 / 4.4',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }
  }, React.createElement('img', {
    src: '../../assets/logomark-spray.jpg',
    alt: 'Golden Shine spray bottle',
    style: {
      width: '92%',
      objectFit: 'contain',
      objectPosition: 'bottom',
      mixBlendMode: 'normal'
    }
  })),
  // floating rating card
  React.createElement('div', {
    style: {
      position: 'absolute',
      bottom: 22,
      left: -18,
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, React.createElement(Rating, {
    value: 5,
    size: 18
  }), React.createElement('span', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, t.hero.stat1)),
  // floating badge
  React.createElement('div', {
    style: {
      position: 'absolute',
      top: 18,
      right: -10
    }
  }, React.createElement(Badge, {
    tone: 'success',
    solid: true,
    style: {
      boxShadow: 'var(--shadow-md)',
      padding: '8px 14px'
    }
  }, React.createElement(I.CheckCircle, {
    size: 15
  }), t.hero.stat2)))));
}
Object.assign(window, {
  GsHero: Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/QuoteForm.jsx
try { (() => {
// Golden Shine website — Quote form (with success state)
const React = window.React;
function QuoteForm({
  t,
  embedded
}) {
  const {
    Card,
    Input,
    Select,
    Checkbox,
    Button,
    Badge
  } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  const [done, setDone] = React.useState(false);
  const [addons, setAddons] = React.useState({});
  const submit = e => {
    e.preventDefault();
    setDone(true);
  };
  const inner = done ? React.createElement('div', {
    style: {
      textAlign: 'center',
      padding: '24px 8px'
    }
  }, React.createElement('div', {
    style: {
      width: 72,
      height: 72,
      margin: '0 auto 18px',
      borderRadius: '50%',
      background: 'var(--success-100)',
      color: 'var(--success-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(I.CheckCircle, {
    size: 38
  })), React.createElement('h3', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--text-strong)',
      margin: '0 0 8px'
    }
  }, t.quote.successTitle), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      margin: '0 auto 20px',
      maxWidth: 360,
      lineHeight: 1.6
    }
  }, t.quote.successSub), React.createElement(Button, {
    variant: 'secondary',
    onClick: () => setDone(false)
  }, t.quote.again)) : React.createElement('form', {
    onSubmit: submit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
      gap: 16
    }
  }, React.createElement(Input, {
    label: t.quote.name,
    placeholder: t.quote.namePh,
    required: true
  }), React.createElement(Input, {
    label: t.quote.phone,
    placeholder: t.quote.phonePh,
    type: 'tel',
    required: true
  })), React.createElement(Input, {
    label: t.quote.email,
    placeholder: t.quote.emailPh,
    type: 'email'
  }), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
      gap: 16
    }
  }, React.createElement(Select, {
    label: t.quote.service,
    placeholder: t.quote.servicePh,
    options: t.quote.serviceOpts
  }), React.createElement(Select, {
    label: t.quote.size,
    placeholder: t.quote.sizePh,
    options: t.quote.sizeOpts
  })), React.createElement(Select, {
    label: t.quote.freq,
    options: t.quote.freqOpts
  }), React.createElement('div', null, React.createElement('span', {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)',
      display: 'block',
      marginBottom: 10
    }
  }, t.quote.addons), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
      gap: 10
    }
  }, t.quote.addonOpts.map((a, i) => React.createElement(Checkbox, {
    key: i,
    label: a,
    checked: !!addons[i],
    onChange: e => setAddons({
      ...addons,
      [i]: e.target.checked
    })
  })))), React.createElement('div', {
    style: {
      marginTop: 2
    }
  }, React.createElement(Checkbox, {
    label: t.quote.consent,
    defaultChecked: true
  })), React.createElement(Button, {
    variant: 'accent',
    size: 'lg',
    type: 'submit',
    fullWidth: true,
    rightIcon: React.createElement(I.Arrow, {
      size: 18
    })
  }, t.quote.submit));
  return React.createElement('section', {
    id: 'contact',
    style: {
      background: 'var(--cream-200)'
    }
  }, React.createElement('div', {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: 'clamp(3.5rem,8vw,6rem) var(--gutter)'
    }
  }, React.createElement('div', {
    style: {
      textAlign: 'center',
      marginBottom: 30
    }
  }, React.createElement('span', {
    className: 'gs-eyebrow'
  }, t.quote.eyebrow), React.createElement('h2', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'clamp(1.8rem,3.6vw,2.6rem)',
      color: 'var(--navy-800)',
      margin: '10px 0 0',
      letterSpacing: '-0.02em'
    }
  }, t.quote.title), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--navy-600)',
      margin: '12px 0 0',
      lineHeight: 1.6
    }
  }, t.quote.sub)), React.createElement(Card, {
    padding: 'lg',
    style: {
      boxShadow: 'var(--shadow-lg)',
      padding: 'clamp(1.5rem,3vw,2.5rem)'
    }
  }, inner)));
}
Object.assign(window, {
  GsQuoteForm: QuoteForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/QuoteForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
// Golden Shine website — content sections: Services, HowItWorks, WhyUs, Reviews
const React = window.React;
function Section({
  id,
  bg,
  children,
  style
}) {
  return React.createElement('section', {
    id,
    style: {
      background: bg || 'transparent',
      ...style
    }
  }, React.createElement('div', {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: 'clamp(3.5rem,8vw,6rem) var(--gutter)'
    }
  }, children));
}
function Head({
  eyebrow,
  title,
  sub,
  onNavy
}) {
  return React.createElement('div', {
    style: {
      textAlign: 'center',
      maxWidth: 640,
      margin: '0 auto 44px'
    }
  }, eyebrow && React.createElement('span', {
    className: 'gs-eyebrow'
  }, eyebrow), React.createElement('h2', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'clamp(1.8rem,3.6vw,2.6rem)',
      color: onNavy ? 'var(--cream-100)' : 'var(--text-strong)',
      margin: '10px 0 0',
      letterSpacing: '-0.02em'
    }
  }, title), sub && React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(1rem,1.3vw,1.12rem)',
      color: onNavy ? 'var(--navy-200)' : 'var(--text-muted)',
      margin: '14px 0 0',
      lineHeight: 1.6
    }
  }, sub));
}
function Services({
  t,
  onBook
}) {
  const {
    Card,
    Badge,
    Button
  } = window.GoldenShineDesignSystem_23f889;
  const I = window.GsIcons;
  return React.createElement(Section, {
    id: 'services',
    bg: 'var(--surface-page)'
  }, React.createElement(Head, {
    eyebrow: t.services.eyebrow,
    title: t.services.title,
    sub: t.services.sub
  }), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(290px,1fr))',
      gap: 22
    }
  }, t.services.items.map((s, i) => {
    const Icon = I[s.icon] || I.Sparkles;
    const popular = i === 2;
    return React.createElement(Card, {
      key: i,
      interactive: true,
      padding: 'lg',
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, popular && React.createElement('div', {
      style: {
        position: 'absolute',
        top: 16,
        right: 16
      }
    }, React.createElement(Badge, {
      tone: 'coral',
      solid: true
    }, '★')), React.createElement('div', {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: 'var(--coral-100)',
        color: 'var(--coral-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, React.createElement(Icon, {
      size: 26,
      stroke: 2
    })), React.createElement('h3', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 20,
        color: 'var(--text-strong)',
        margin: 0
      }
    }, s.name), React.createElement('p', {
      style: {
        fontFamily: 'var(--font-body)',
        color: 'var(--text-muted)',
        margin: 0,
        lineHeight: 1.55,
        flex: 1
      }
    }, s.desc), React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4
      }
    }, React.createElement('span', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--navy-700)',
        fontSize: 16
      }
    }, s.from), React.createElement(Button, {
      variant: 'ghost',
      size: 'sm',
      onClick: onBook,
      rightIcon: React.createElement(I.Arrow, {
        size: 16
      })
    }, t.services.cta)));
  })));
}
function HowItWorks({
  t
}) {
  const I = window.GsIcons;
  return React.createElement(Section, {
    id: 'how',
    bg: 'var(--cream-200)'
  }, React.createElement(Head, {
    eyebrow: t.how.eyebrow,
    title: t.how.title
  }), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))',
      gap: 28
    }
  }, t.how.steps.map((s, i) => {
    const Icon = I[s.icon] || I.Spray;
    return React.createElement('div', {
      key: i,
      style: {
        textAlign: 'center'
      }
    }, React.createElement('div', {
      style: {
        position: 'relative',
        width: 84,
        height: 84,
        margin: '0 auto 18px',
        borderRadius: 'var(--radius-circle)',
        background: 'var(--navy-700)',
        color: 'var(--cream-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)'
      }
    }, React.createElement(Icon, {
      size: 34,
      stroke: 1.8
    }), React.createElement('span', {
      style: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'var(--coral-500)',
        color: 'var(--cream-100)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, i + 1)), React.createElement('h3', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 20,
        color: 'var(--navy-800)',
        margin: '0 0 6px'
      }
    }, s.name), React.createElement('p', {
      style: {
        fontFamily: 'var(--font-body)',
        color: 'var(--navy-600)',
        margin: '0 auto',
        maxWidth: 280,
        lineHeight: 1.55
      }
    }, s.desc));
  })));
}
function WhyUs({
  t
}) {
  const I = window.GsIcons;
  return React.createElement(Section, {
    bg: 'var(--surface-page)'
  }, React.createElement(Head, {
    title: t.why.title
  }), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))',
      gap: 20
    }
  }, t.why.items.map((w, i) => {
    const Icon = I[w.icon] || I.Check;
    return React.createElement('div', {
      key: i,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start'
      }
    }, React.createElement('div', {
      style: {
        flex: 'none',
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        background: 'var(--navy-100)',
        color: 'var(--navy-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, React.createElement(Icon, {
      size: 22
    })), React.createElement('div', null, React.createElement('h3', {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 17,
        color: 'var(--text-strong)',
        margin: '2px 0 4px'
      }
    }, w.name), React.createElement('p', {
      style: {
        fontFamily: 'var(--font-body)',
        color: 'var(--text-muted)',
        margin: 0,
        fontSize: 14.5,
        lineHeight: 1.5
      }
    }, w.desc)));
  })));
}
function Reviews({
  t
}) {
  const {
    Card,
    Avatar,
    Rating,
    Badge
  } = window.GoldenShineDesignSystem_23f889;
  return React.createElement(Section, {
    id: 'reviews',
    bg: 'var(--navy-700)'
  }, React.createElement(Head, {
    eyebrow: t.reviews.eyebrow,
    title: t.reviews.title,
    sub: t.reviews.rating,
    onNavy: true
  }), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))',
      gap: 22
    }
  }, t.reviews.items.map((r, i) => React.createElement(Card, {
    key: i,
    padding: 'lg',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, React.createElement(Rating, {
    value: r.stars,
    size: 18
  }), React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-body)',
      margin: 0,
      lineHeight: 1.6,
      flex: 1,
      fontSize: 15.5
    }
  }, '“' + r.text + '”'), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, React.createElement(Avatar, {
    name: r.name,
    size: 'md'
  }), React.createElement('div', null, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      fontSize: 15
    }
  }, r.name), React.createElement('div', {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      fontSize: 13
    }
  }, r.city)))))));
}
Object.assign(window, {
  GsServices: Services,
  GsHowItWorks: HowItWorks,
  GsWhyUs: WhyUs,
  GsReviews: Reviews
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/copy.js
try { (() => {
// Golden Shine — bilingual website copy (EN / ES). Exposed as window.GsCopy.
window.GsCopy = {
  en: {
    nav: {
      services: 'Services',
      how: 'How it works',
      reviews: 'Reviews',
      contact: 'Contact',
      book: 'Get a quote',
      call: 'Call us'
    },
    hero: {
      eyebrow: 'Home & Office Cleaning',
      titleA: 'A sparkling clean,',
      titleScript: 'every single time',
      sub: 'Golden Shine brings vetted, insured cleaners to your door. Book in two minutes — we bring the supplies, the care, and the shine.',
      ctaPrimary: 'Get a free quote',
      ctaSecondary: 'See our services',
      stat1: '4.9/5 average rating',
      stat2: '2,400+ homes cleaned',
      trust: 'Insured & background-checked · 100% satisfaction guarantee'
    },
    services: {
      eyebrow: 'What we do',
      title: 'Cleaning for every space',
      sub: 'From a quick refresh to a top-to-bottom deep clean — pick what fits.',
      items: [{
        icon: 'Home2',
        name: 'House Cleaning',
        desc: 'Regular upkeep of kitchens, baths, floors and living spaces.',
        from: 'from $89'
      }, {
        icon: 'Building',
        name: 'Office & Commercial',
        desc: 'Reliable cleaning for offices, clinics and storefronts.',
        from: 'custom'
      }, {
        icon: 'Sparkles',
        name: 'Deep Cleaning',
        desc: 'A detailed, top-to-bottom reset for the whole home.',
        from: 'from $189'
      }, {
        icon: 'Truck',
        name: 'Move In / Move Out',
        desc: 'Leave it spotless — or arrive to a fresh, clean start.',
        from: 'from $229'
      }, {
        icon: 'Sofa',
        name: 'Carpet & Upholstery',
        desc: 'Steam-cleaned carpets, rugs and furniture.',
        from: 'from $99'
      }, {
        icon: 'Wand',
        name: 'Post-Construction',
        desc: 'Dust, debris and detail clean after a remodel.',
        from: 'custom'
      }],
      cta: 'Get a quote'
    },
    how: {
      eyebrow: 'Simple & flexible',
      title: 'How it works',
      steps: [{
        icon: 'Calendar',
        name: 'Book online',
        desc: 'Tell us your space and pick a time that works for you.'
      }, {
        icon: 'Spray',
        name: 'We clean',
        desc: 'Our insured team arrives on time with everything needed.'
      }, {
        icon: 'CheckCircle',
        name: 'You relax',
        desc: 'Enjoy a spotless space — guaranteed, or we make it right.'
      }]
    },
    why: {
      title: 'Why Golden Shine',
      items: [{
        icon: 'Shield',
        name: 'Insured & vetted',
        desc: 'Every cleaner is background-checked and fully insured.'
      }, {
        icon: 'Leaf',
        name: 'Eco-friendly',
        desc: 'Safe, non-toxic products — kind to kids and pets.'
      }, {
        icon: 'Clock',
        name: 'On time, always',
        desc: 'We respect your schedule and show up when we say.'
      }, {
        icon: 'CheckCircle',
        name: '100% guarantee',
        desc: "Not happy? We'll re-clean it free within 24 hours."
      }]
    },
    reviews: {
      eyebrow: 'Loved by locals',
      title: 'What our customers say',
      rating: '4.9 out of 5 · 312 reviews',
      items: [{
        name: 'Maria L.',
        city: 'Houston, TX',
        text: 'They left my kitchen absolutely spotless. Booking took two minutes and the team was so kind.',
        stars: 5
      }, {
        name: 'James P.',
        city: 'Houston, TX',
        text: 'We use Golden Shine for our office every week. Always on time, always thorough.',
        stars: 5
      }, {
        name: 'Aisha K.',
        city: 'Katy, TX',
        text: 'The deep clean before our move-out got us the full deposit back. Worth every penny.',
        stars: 5
      }]
    },
    quote: {
      eyebrow: 'Free, no obligation',
      title: 'Get your quote',
      sub: 'Tell us a bit about your space and we’ll text you a price within the hour.',
      name: 'Full name',
      namePh: 'Jane Doe',
      phone: 'Phone',
      phonePh: '(555) 123-4567',
      email: 'Email',
      emailPh: 'you@email.com',
      service: 'Service type',
      servicePh: 'Choose a service',
      serviceOpts: ['House Cleaning', 'Office & Commercial', 'Deep Cleaning', 'Move In / Move Out', 'Carpet & Upholstery', 'Post-Construction'],
      size: 'Property size',
      sizePh: 'Select size',
      sizeOpts: ['Studio / 1 bed', '2 bedrooms', '3 bedrooms', '4+ bedrooms', 'Office / commercial'],
      freq: 'How often?',
      freqOpts: ['One time', 'Weekly', 'Every 2 weeks', 'Monthly'],
      addons: 'Add-ons',
      addonOpts: ['Inside the oven', 'Interior windows', 'Inside the fridge', 'Laundry & folding'],
      submit: 'Request my quote',
      consent: 'I agree to be contacted about my quote.',
      successTitle: 'Quote requested!',
      successSub: "Thanks — we'll text you a price within the hour. Keep an eye on your phone.",
      again: 'Request another'
    },
    footer: {
      tagline: 'Home & office cleaning you can trust.',
      hours: 'Mon–Sat · 8am–7pm',
      area: 'Serving Houston & surrounding areas',
      col1: 'Services',
      col2: 'Company',
      col3: 'Get in touch',
      company: ['About us', 'Careers', 'Reviews', 'Gift cards'],
      rights: '© 2026 Golden Shine Cleaning Service. All rights reserved.'
    },
    langLabel: 'ES'
  },
  es: {
    nav: {
      services: 'Servicios',
      how: 'Cómo funciona',
      reviews: 'Reseñas',
      contact: 'Contacto',
      book: 'Cotizar',
      call: 'Llámanos'
    },
    hero: {
      eyebrow: 'Limpieza de Casas y Oficinas',
      titleA: 'Un brillo impecable,',
      titleScript: 'siempre',
      sub: 'Golden Shine lleva limpiadores verificados y asegurados a tu puerta. Reserva en dos minutos — nosotros llevamos los productos, el cuidado y el brillo.',
      ctaPrimary: 'Cotización gratis',
      ctaSecondary: 'Ver servicios',
      stat1: '4.9/5 de calificación',
      stat2: '+2,400 casas limpiadas',
      trust: 'Asegurados y verificados · Garantía de satisfacción 100%'
    },
    services: {
      eyebrow: 'Qué hacemos',
      title: 'Limpieza para cada espacio',
      sub: 'Desde un repaso rápido hasta una limpieza profunda — elige lo que necesites.',
      items: [{
        icon: 'Home2',
        name: 'Limpieza de Casas',
        desc: 'Mantenimiento regular de cocinas, baños, pisos y salas.',
        from: 'desde $89'
      }, {
        icon: 'Building',
        name: 'Oficinas y Comercial',
        desc: 'Limpieza confiable para oficinas, clínicas y locales.',
        from: 'a medida'
      }, {
        icon: 'Sparkles',
        name: 'Limpieza Profunda',
        desc: 'Una limpieza detallada de arriba a abajo para todo el hogar.',
        from: 'desde $189'
      }, {
        icon: 'Truck',
        name: 'Mudanzas (Entrada/Salida)',
        desc: 'Déjalo impecable — o llega a un comienzo limpio y fresco.',
        from: 'desde $229'
      }, {
        icon: 'Sofa',
        name: 'Alfombras y Tapicería',
        desc: 'Alfombras, tapetes y muebles limpiados al vapor.',
        from: 'desde $99'
      }, {
        icon: 'Wand',
        name: 'Post-Construcción',
        desc: 'Polvo, escombros y detalle tras una remodelación.',
        from: 'a medida'
      }],
      cta: 'Cotizar'
    },
    how: {
      eyebrow: 'Simple y flexible',
      title: 'Cómo funciona',
      steps: [{
        icon: 'Calendar',
        name: 'Reserva en línea',
        desc: 'Cuéntanos sobre tu espacio y elige la hora que te convenga.'
      }, {
        icon: 'Spray',
        name: 'Limpiamos',
        desc: 'Nuestro equipo asegurado llega a tiempo con todo lo necesario.'
      }, {
        icon: 'CheckCircle',
        name: 'Tú descansas',
        desc: 'Disfruta un espacio impecable — garantizado, o lo corregimos.'
      }]
    },
    why: {
      title: 'Por qué Golden Shine',
      items: [{
        icon: 'Shield',
        name: 'Asegurados y verificados',
        desc: 'Cada limpiador está verificado y totalmente asegurado.'
      }, {
        icon: 'Leaf',
        name: 'Eco-amigable',
        desc: 'Productos seguros y no tóxicos — buenos para niños y mascotas.'
      }, {
        icon: 'Clock',
        name: 'Siempre a tiempo',
        desc: 'Respetamos tu horario y llegamos cuando lo decimos.'
      }, {
        icon: 'CheckCircle',
        name: 'Garantía 100%',
        desc: '¿No te gustó? Lo limpiamos de nuevo gratis en 24 horas.'
      }]
    },
    reviews: {
      eyebrow: 'Queridos por la comunidad',
      title: 'Lo que dicen nuestros clientes',
      rating: '4.9 de 5 · 312 reseñas',
      items: [{
        name: 'María L.',
        city: 'Houston, TX',
        text: 'Dejaron mi cocina absolutamente impecable. Reservar tomó dos minutos y el equipo fue muy amable.',
        stars: 5
      }, {
        name: 'James P.',
        city: 'Houston, TX',
        text: 'Usamos Golden Shine para nuestra oficina cada semana. Siempre puntuales, siempre minuciosos.',
        stars: 5
      }, {
        name: 'Aisha K.',
        city: 'Katy, TX',
        text: 'La limpieza profunda antes de mudarnos nos devolvió todo el depósito. Vale cada centavo.',
        stars: 5
      }]
    },
    quote: {
      eyebrow: 'Gratis, sin compromiso',
      title: 'Obtén tu cotización',
      sub: 'Cuéntanos sobre tu espacio y te enviaremos un precio por mensaje en menos de una hora.',
      name: 'Nombre completo',
      namePh: 'María López',
      phone: 'Teléfono',
      phonePh: '(555) 123-4567',
      email: 'Correo',
      emailPh: 'tu@correo.com',
      service: 'Tipo de servicio',
      servicePh: 'Elige un servicio',
      serviceOpts: ['Limpieza de Casas', 'Oficinas y Comercial', 'Limpieza Profunda', 'Mudanzas', 'Alfombras y Tapicería', 'Post-Construcción'],
      size: 'Tamaño del lugar',
      sizePh: 'Selecciona el tamaño',
      sizeOpts: ['Estudio / 1 recámara', '2 recámaras', '3 recámaras', '4+ recámaras', 'Oficina / comercial'],
      freq: '¿Con qué frecuencia?',
      freqOpts: ['Una vez', 'Semanal', 'Cada 2 semanas', 'Mensual'],
      addons: 'Extras',
      addonOpts: ['Por dentro del horno', 'Ventanas interiores', 'Por dentro del refri', 'Lavado y doblado'],
      submit: 'Solicitar cotización',
      consent: 'Acepto que me contacten sobre mi cotización.',
      successTitle: '¡Cotización solicitada!',
      successSub: 'Gracias — te enviaremos un precio por mensaje en menos de una hora. Mantente pendiente de tu teléfono.',
      again: 'Solicitar otra'
    },
    footer: {
      tagline: 'Limpieza de casas y oficinas en la que puedes confiar.',
      hours: 'Lun–Sáb · 8am–7pm',
      area: 'Atendiendo Houston y alrededores',
      col1: 'Servicios',
      col2: 'Compañía',
      col3: 'Contáctanos',
      company: ['Sobre nosotros', 'Empleo', 'Reseñas', 'Tarjetas de regalo'],
      rights: '© 2026 Golden Shine Cleaning Service. Todos los derechos reservados.'
    },
    langLabel: 'EN'
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/copy.js", error: String((e && e.message) || e) }); }

// ui_kits/website/icons.jsx
try { (() => {
// Golden Shine — icon set (Lucide-style, 2px line icons, ISC).
// Inline so the UI kit stays self-contained. Stroke uses currentColor.
const React = window.React;
function make(paths, opts = {}) {
  return function Icon({
    size = 24,
    stroke = 2,
    color = 'currentColor',
    style = {},
    ...rest
  }) {
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: opts.fill || 'none',
      stroke: opts.fill ? 'none' : color,
      strokeWidth: stroke,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: {
        display: 'block',
        ...style
      },
      ...rest
    }, paths.map((d, i) => React.createElement('path', {
      key: i,
      d
    })));
  };
}
const Home2 = make(['M3 9.5 12 3l9 6.5', 'M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9', 'M9 20v-6h6v6']);
const Building = make(['M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16', 'M14 9h5a1 1 0 0 1 1 1v11', 'M8 8h2M8 12h2M8 16h2M17 13h.01M17 17h.01', 'M2 21h20']);
const Sparkles = make(['M12 3l1.9 4.7L18.6 9.6 13.9 11.5 12 16.2 10.1 11.5 5.4 9.6 10.1 7.7z', 'M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z', 'M5 15l.6 1.5 1.5.6-1.5.6L5 19.7l-.6-1.5L2.9 17.6l1.5-.6z']);
const Spray = make(['M9 11h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z', 'M10 11V7a1 1 0 0 1 1-1h2', 'M13 4h4l2 2', 'M19 3v3']);
const Truck = make(['M3 6h11v9H3z', 'M14 9h4l3 3v3h-7', 'M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z']);
const Sofa = make(['M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3', 'M2 13a2 2 0 0 1 2 2v2h16v-2a2 2 0 0 1 2-2', 'M5 17v2M19 17v2']);
const Calendar = make(['M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 9h18', 'M8 3v4M16 3v4']);
const Check = make(['M20 6 9 17l-5-5']);
const CheckCircle = make(['M22 11.5V12a10 10 0 1 1-5.9-9.1', 'M22 4 12 14.1l-3-3']);
const Clock = make(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 7v5l3 2']);
const Shield = make(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4']);
const Leaf = make(['M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 13-9 13z', 'M4 21c4-7 8-9 13-10']);
const Phone = make(['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z']);
const Mail = make(['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'm3 7 9 6 9-6']);
const MapPin = make(['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']);
const Arrow = make(['M5 12h14', 'm13 6 6 6-6 6']);
const Menu = make(['M4 7h16M4 12h16M4 17h16']);
const X = make(['M6 6 18 18M18 6 6 18']);
const Star = make(['M12 2.5l2.9 5.88 6.49.94-4.69 4.57 1.1 6.46L12 17.3l-5.8 3.05 1.1-6.46-4.69-4.57 6.49-.94L12 2.5z'], {
  fill: true
});
const Wand = make(['M15 4V2M15 10V8M9 4h12M9 10h12', 'M5 21l9-9', 'M14 6l4 4']);
const Phone2 = Phone;
Object.assign(window, {
  GsIcons: {
    Home2,
    Building,
    Sparkles,
    Spray,
    Truck,
    Sofa,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Shield,
    Leaf,
    Phone: Phone2,
    Mail,
    MapPin,
    Arrow,
    Menu,
    X,
    Star,
    Wand
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
