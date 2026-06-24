Checkbox with a coral fill — use for service add-ons, consents, and filters. Works controlled or uncontrolled.

```jsx
<Checkbox label="Inside the oven" defaultChecked />
<Checkbox label="Interior windows" />
<Checkbox label="I agree to the terms" onChange={e => setOk(e.target.checked)} />
```
