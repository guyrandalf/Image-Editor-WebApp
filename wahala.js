const dqs = (sel, el) => (el ?? document).querySelector(sel)
const dqsa = (sel, el) => (el ?? document).querySelectorAll(sel)
const fileInput = dqs(".file-input")
const chooseImgBtn = dqs(".choose-img")
const clickChooseImg = dqs(".ci")
const resetFilterBtn = dqs(".reset-filter")
const previewCanvas = dqs(".preview-canvas img")
const filterOptions = dqsa(".filter button")
const rotateOptions = dqsa(".rotate button")
const filterName = dqs(".filter-info .name")
const filterSlider = dqs(".slider input")
const filterValue = dqs(".filter-info .value")
const downloadImgBtn = dqs(".download-img")

let brightness = 100
let saturation = 100
let inversion = 0
let grayscale = 0

let rotate = 0
let flipVertical = 1
let flipHorizontal = 1

const applyFilters = () => {
  previewCanvas.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
  previewCanvas.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImage = () => {
  let img = fileInput.files[0]
  if (!img) return
  previewCanvas.src = URL.createObjectURL(img)
  previewCanvas.addEventListener("load", () => {
    resetFilterBtn.click()
    dqs(".container").classList.remove("disabled")
  })
}

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    dqs(".filter .active").classList.remove("active")
    option.classList.add("active")
    filterName.innerText = option.innerText

    if (option.id === "brightness") {
      filterSlider.max = "200"
      filterSlider.value = brightness
      filterValue.innerText = `${brightness}%`
    } else if (option.id === "saturation") {
      filterSlider.max = "200"
      filterSlider.value = saturation
      filterValue.innerText = `${saturation}%`
    } else if (option.id === "inversion") {
      filterSlider.max = "100"
      filterSlider.value = inversion
      filterValue.innerText = `${inversion}%`
    } else {
      filterSlider.max = "100"
      filterSlider.value = grayscale
      filterValue.innerText = `${grayscale}%`
    }
  })
})

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`
  const selectedFilter = dqs(".filter .active")

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value
  } else {
    grayscale = filterSlider.value
  }
  applyFilters()
}

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90
    } else if (option.id === "right") {
      rotate += 90
    } else if (option.id === "vertical") {
      flipVertical = flipVertical === 1 ? -1 : 1
    } else {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1
    }
    applyFilters()
  })
})

const resetFilter = () => {
  brightness = 100
  saturation = 100
  inversion = 0
  grayscale = 0

  rotate = 0
  flipVertical = 1
  flipHorizontal = 1

  filterOptions[0].click()

  applyFilters()
}


const downloadImage = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') // returns a drawing context on canvas
    canvas.width = previewCanvas.naturalWidth
    canvas.height = previewCanvas.naturalHeight
    
    ctx.filter = previewCanvas.style.filter
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180)
    }
    ctx.scale(flipHorizontal, flipVertical)

    ctx.drawImage(previewCanvas, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    
    const link = document.createElement('a')
    link.download = "image.jpg" // passing <a> value to "image.jpg"
    link.href = canvas.toDataURL() // passing <a> tag href to canvas data url
    link.click() // Clicking <a> tag to download image
}

fileInput.addEventListener("change", loadImage)
filterSlider.addEventListener("input", updateFilter)
resetFilterBtn.addEventListener("click", resetFilter)
chooseImgBtn.addEventListener("click", () => fileInput.click())
clickChooseImg.addEventListener("click", () => fileInput.click())
downloadImgBtn.addEventListener("click", downloadImage)
