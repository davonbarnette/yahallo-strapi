function getHtmlText(width, height, text) {

  return (
    `
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Rubik:wght@700&display=swap"
        rel="stylesheet">

</head>
<style>
  body {
    width:${width}px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${height}px;
    background: transparent;
    padding: 5px;
    margin: 0;
  }

  .parent {
    width: ${width}px;
    height: 100%;
    display: block;
  }

  .text-container {
    width: 100%;
    height: 100%;
  }

  .text {
    font-size: 12px;
    display: block;
  }

  .text-container {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;

    font-family: Rubik, sans-serif;
    font-weight: 700;
    color: #111111;
  }

  .text {
    font-size: 24px;
    display: block;
  }
  .text-new {
    text-transform: uppercase;
    background: linear-gradient(to left, #30CFD0 0%, #330867 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font: {
        size: 4vw;
        weight:600;
    };
}
</style>
<body>
<div class="parent">
  <div class="text-container" data-id=2>
    <span class="text">
      ${text}
    </span>
  </div>
</div>
<script defer>
  const isOverflownHeight = ({clientHeight, scrollHeight}) => scrollHeight > clientHeight;
  const isOverflownWidth = ({clientWidth, scrollWidth}) => scrollWidth > clientWidth;
  const resizeText = ({element, parent}) => {
    let i = 10 // let's start with 12px
    let overflow = false
    const maxSize = 30 // very huge text size

    while (!overflow && i < maxSize) {

      element.style.fontSize = i + "px";
      overflow = isOverflownHeight(parent) || isOverflownWidth(parent)
      if (!overflow) i++
    }


    element.style.fontSize = (i - 1) + "px"
  }

  resizeText({
    element: document.querySelector('.text'),
    parent: document.querySelector('.text-container')
  })
</script>
</body>
</html>

`
  )
}

module.exports = {getHtmlText};
