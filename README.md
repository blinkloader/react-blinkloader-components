# react-blinkloader-components
React components for Blinkloader

## components

### `<Img/>`
Props:

- src (holds image URL)
- lazyload (optional, for lazy loading)
- progressive (optional, for progressive loading)
- all applicable for <img> DOM element

Example:

```
<Img src="some-src" lazyload={true} progressive={true} />
```

### `<ImgBlock/>`
Props:

 - src (holds image url)
 - lazyload (optional, for lazyloading)
 - progressive (optional, for progressive loading)

Example:

```
<ImgBlock src="some-src" lazyload={true} progressive={true} />
```

### `<Background/>`
Props:

 - src (holds image url)
 - lazyload (optional, for lazyloading) 
 - progressive (optional, for progressive loading)
 - gradient (optional, for background image gradient)
 - children (may contain nested elements)

Example:

```
<Background src="some-src" lazyload={true} progressive={true}>
  <h1>Some text</h1>
</Background>
```
