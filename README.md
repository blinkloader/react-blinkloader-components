# react-blinkloader-components
React components for Blinkloader

kudos to Stripe for inspiration (https://github.com/stripe/react-stripe-elements)

## components

### `<Img>`
Props:

- src (holds image URL)
- lazyload (optional, for lazy loading)
- all applicable for <img> DOM element

Example:

```
<Img src="some-src" lazyload={true} />
```

### `<ImgBlock>`
Props:

 - src (holds image url)
 - lazyload (optional, for lazyloading)

Example:

```
<ImgBlock src="some-src" lazyload={true} />
```

### `<Background>`
Props:

 - src (holds image url)
 - lazyload (optional, for lazyloading) 
 - gradient (optional, for background image gradient)
 - children (may contain nested elements)

Example:

```
<Background src="some-src" lazyload={true}>
  <h1>Some text</h1>
</Background>
```
