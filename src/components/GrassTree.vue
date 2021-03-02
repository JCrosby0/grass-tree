<template>
  <div class="page">

    <h2>Grass Tree Builder Test</h2>
    <p>Here's a web app to build a grass tree in scalable vector graphics (SVG). 
      Change the inputs to build the tree trunk and spike, and then click the button to generate the fronds and flower.</p>
  <div class="container">

    <!-- CONTROL PANEL -->
    <div class="controls">
      <h6>Dimensions</h6>
      <div v-for="category in categories" :key="'category'+category">
        <h4 class="left">{{category}}</h4>
        <div v-for="key in Object.values(svg).filter(k => k.group === category && k.display === true)" :key="key" class="item">
          <p>{{key.label}}<span style='{color: red}' v-if="refreshRequired.includes(key)">*</span>
            <input v-model="key.value" type="range" :min="key.min" :max="key.max" :step="key.step">
          </p>
        </div>
      </div>
      <button @click="randomise">Randomise Fronds</button>
      <br>
    </div>

    <!-- COLOR PANEL -->
    <div class="color">
      <h6>Color Theme</h6>
      <div class="radio" v-for="opt in colorStyle" :key="opt+'color'">
        <input type="radio" :id="opt.value" name="color" :value="opt.value" v-model="state.selectedColor">
        <label :for="opt.value">{{opt.name}}</label><br>
      </div>
      <h6>Background Shapes</h6>
        <div class="checkbox" v-for="(opt, i) in shapeStyle" :key="opt+'color'">
          <input type="checkbox" :id="opt.value" name="shape" :value="opt.value" v-model="state.selectedShape[i]">
          <label :for="opt.value">{{opt.name}}</label>
          <button @click="randomiseShape(opt.value)">Randomise</button>
        </div>
    </div>

    <!-- DISPLAY PANEL -->
    <div class="display">
      <svg :class="state.selectedColor" xmlns="http://www.w3.org/2000/svg" :width="`${svg.width.value}px`" :height="`${svg.height.value}px`" viewbox="0 0 200px 200px">
        <defs>
          <linearGradient id="frondColorUpper" gradientTransform="rotate(90)">
              <stop offset="5%"  stop-color="darkgreen" />
              <stop offset="95%" stop-color="green" />
            </linearGradient>
            <linearGradient id="frondColorLower" gradientTransform="rotate(90)">
              <stop offset="5%"  stop-color="green" />
              <stop offset="70%" stop-color="yellow" />
              <stop offset="80%" stop-color="transparent" />>
            </linearGradient>
            <linearGradient
              id="trunkColor"
              gradientTransform="rotate(0)"
              x1="3%"
              y1="4%"
              x2="3%"
              y2="12%"
              spreadMethod="repeat"
              >
              <stop offset="20%" stop-color="#333" />
              <stop offset="50%" stop-color="black" />
            </linearGradient>
          </defs>
        <g>
          <!-- Shapes -->
          <g class="shape" v-for="(opt, i) in shapeStyle" :key="'g-shape'+opt">
            <polygon v-if="state.selectedShape[i]===true" :class="`${opt.value}`" :points="svgShapes[opt.value]"/>
          </g>

        </g>
        <!-- TRUNK GROUP -->
        <g>
          <!-- trunk -->
          <path :class="['trunk', state.selectedColor]"
            :style="svgPaths" 
            :d="svgPaths['--trunk']">          
          </path>
          <!-- trunk left -->
          <path v-if="svg.noBranches.value == '2'" :class="['trunk', state.selectedColor]"
            :style="svgPaths" 
            :d="svgPaths['--trunkLeft']">          
          </path>
          <!-- trunk right -->
          <path v-if="svg.noBranches.value == '2'" :class="['trunk', state.selectedColor]"
            :style="svgPaths" 
            :d="svgPaths['--trunkRight']">          
          </path>
        </g>
        <!-- spike/flower/fronds -- group 1 -->
        <g :transform="targetTrunk">
          <!-- spike/flower is visible -->
          <g v-show="svg.spikeVisible.value == '1'">
            <!-- spike -->
            <path id="spike" :class="state.selectedColor" :d="svgPaths['--spike']" />
            <!-- flower -->
            <path v-if="svg.flowerVisible.value == '1'" :class="['flower', state.selectedColor]" :d="svgPaths['--flower']" />
          </g>
          <!-- fronds grouped for collapsing in DOM view-->
          <g>
            <path 
              v-for="(point, i) in svgPoints.xInner" 
              :key="'point'+i"
              :class="['fronds', frondTest(i), state.selectedColor]"
              :d="`M ${svgPoints.xInner[i]} ${svgPoints.yInner[i]}
              Q ${svgPoints.xMid[i]} ${svgPoints.yMid[i]}
              ${svgPoints.xOuter[i]} ${svgPoints.yOuter[i]}`"
            />
          </g>
          <!-- ellipses -->
          <ellipse id="inner" class="ellipse inner" :style="`{stroke: ${svg.showGuideCircles.value === 1 ? '1px red' : '0'}}`"
            cx="0"
            cy="0"
            rx="1"
            ry="1" />
          <ellipse id="mid" class="ellipse mid"
            cx="0"
            cy="0"
            :rx="svg.frondLength.value/2"
            :ry="svg.frondLength.value/2" />
          <ellipse id="outer" class="ellipse outer"
            :cx="parseInt(svg.frondSway.value)"
            :cy="parseInt(svg.frondDroop.value)"
            :rx="svg.frondLength.value"
            :ry="svg.frondLength.value" />
        </g>
        <!-- spike/flower/fronds 2 -->
        <g v-if="svg.noBranches.value == '2'" 
          :transform="targetTrunk2">
          <!-- spike/flower is visible -->
          <g v-show="svg.spikeSecondVisible.value == '1'">
            <!-- spike -->
            <path id="spike2" :class="state.selectedColor" :d="svgPaths['--spike2']" />
              <!-- flower -->
            <path v-if="svg.flowerSecondVisible.value == '1'" :class="['flower', state.selectedColor]" :d="svgPaths['--flower2']" />
          </g>
          <!-- fronds (grouped for collapsing in DOM view)-->
          <g>
            <path 
              v-for="(point, i) in svgPoints2.xInner" 
              :key="'point'+i"
              :class="['fronds', frondTest(i), state.selectedColor]"
              :d="`M ${svgPoints.xInner[i]} ${svgPoints2.yInner[i]}
              Q ${svgPoints2.xMid[i]} ${svgPoints2.yMid[i]}
              ${svgPoints2.xOuter[i]} ${svgPoints2.yOuter[i]}`"
            />
          </g>
          <!-- ellipses -->
          <ellipse id="inner2" class="ellipse inner" :style="`{stroke: ${svg.showGuideCircles.value === 1 ? '1px red' : '0'}}`"
            cx="0"
            cy="0"
            rx="1"
            ry="1" />
          <ellipse id="mid2" class="ellipse mid"
            cx="0"
            cy="0"
            :rx="svg.frondLength2.value /2"
            :ry="svg.frondLength2.value /2" />
          <ellipse id="outer2" class="ellipse outer"
            :cx="parseInt(svg.frondSway.value)"
            :cy="parseInt(svg.frondDroop.value)"
            :rx="svg.frondLength2.value"
            :ry="svg.frondLength2.value" />
        </g>
        </svg>
      </div>
    </div>
    <p class="copy">Developed by Joe Crosby, &copy; 2021</p>
  </div>
</template>

<script setup>
import { defineProps, reactive, computed, watchEffect, toRefs, watch } from 'vue'

/** static values */
const colorStyle = [
  { name: 'Full Colour', value: 'default' },
  { name: 'White Silhouette', value: 'white' },
  { name: 'Black Silhouette', value: 'black' },
]
const animStyle = [
  { name: 'None', value: 'none' },
  { name: 'Windy', value: 'windy' },
  { name: 'Funky', value: 'dance' },
]
const shapeStyle = [
  { name: 'Orange', value: 'orange' },
  { name: 'Grey', value: 'grey' },
  { name: 'White', value: 'white' },
  { name: 'Black', value: 'black' },
]

/* list of inputs that will need a browser refresh - making them not really usable */
const refreshRequired = ['noFronds'];
/**
 * reactive values
 */
const state = reactive({
  count: 0,
  selectedColor: 'default',
  selectedAnim: 'none',
  selectedShape: [],
  selectedColors: []
})
const svg = reactive({
  width:                { value: 500, min: 300, max: 750, display: false},
  height:               { value: 500, min: 300, max: 750, display: false},
  marginBottom:         { group: 'Position', label: "Bottom Margin", value:30, min:0, max: 200, display: true },
  midOffset:            { group: 'Position', label: "Horizontal Offset", value:42, min:-100, max: 100, display: true },
  noBranches:           { group: "Trunk", label: "Number of Branches", value: 2, min: 1, max: 2, display: true },
  trunkSwayMid:         { group: 'Trunk', label:"Trunk Sway - Mid", value:0, min:-100, max: 100, display: true },
  trunkSwayTop:         { group: 'Trunk', label:"Trunk Sway - Top", value:-10, min:-100, max: 100, display: true },
  trunkHeight:          { group: 'Trunk', label:"Trunk Height", value:55, min:25, max: 350, display: true },
  trunkWidth:           { group: 'Trunk',  label: "Trunk Width", value:40, min:1, max: 100, display: true },
  trunkLeftMid:         { group: 'Trunk - Left', label:"Trunk Sway - Mid", value:-90, min:-150, max: 100, display: true },
  trunkLeftTop:         { group: 'Trunk - Left', label:"Trunk Sway - Top", value:-90, min:-150, max: 100, display: true },
  trunkLeftHeight:      { group: 'Trunk - Left', label:"Trunk Height", value:100, min:25, max: 350, display: true },
  trunkRightMid:        { group: 'Trunk - Right', label:"Trunk Sway - Mid", value:60, min:-100, max: 100, display: true },
  trunkRightTop:        { group: 'Trunk - Right', label:"Trunk Sway - Top", value:50, min:-100, max: 100, display: true },
  trunkRightHeight:     { group: 'Trunk - Right', label:"Trunk Height", value:120, min:25, max: 350, display: true },
  spikeVisible:         { group: 'Spike & Flower', label: 'Show Spike', value: 0, min: 0, max: 1, display: true },
  spikeSwayMid:         { group: 'Spike & Flower', label: "Spike Sway - Mid", value:-15, min:-100, max: 100, display: true },
  spikeSwayTop:         { group: 'Spike & Flower', label: "Spike Sway - Top", value: -5, min:-100, max: 100, display: true },
  spikeHeight:          { group: 'Spike & Flower', label: "Spike Height", value:250, min:50, max: 350, display: true },
  spikeSecondVisible:   { group: 'Spike & Flower 2', label: 'Show Spike', value: 1, min: 0, max: 1, display: true },
  spikeSecondSwayMid:   { group: 'Spike & Flower 2', label: "Spike Sway - Mid", value:-10, min:-100, max: 100, display: true },
  spikeSecondSwayTop:   { group: 'Spike & Flower 2', label: "Spike Sway - Top", value: 10, min:-100, max: 100, display: true },
  spikeSecondHeight:    { group: 'Spike & Flower 2', label: "Spike Height", value:250, min:50, max: 350, display: true },
  flowerVisible:        { group: 'Spike & Flower', label: "Show Flower", value: 1, min: 0, max: 1, display: true},
  flowerStart:          { group: 'Spike & Flower', label:"Flower Start", value:0.5, min: 0, max: 1, step: 0.05, display: true },
  flowerStop:           { group: 'Spike & Flower', label:"Flower Stop", value:0.9, min: 0, max: 1, step: 0.05, display: true },
  flowerSecondVisible:  { group: 'Spike & Flower 2', label: "Show Flower", value: 1, min: 0, max: 1, display: true},
  flowerSecondStart:    { group: 'Spike & Flower 2', label:"Flower Start", value:0.25, min: 0, max: 1, step: 0.05, display: true },
  flowerSecondStop:     { group: 'Spike & Flower 2',label:"Flower Stop", value:1, min: 0, max: 1, step: 0.05, display: true },
  noFronds:             { group: 'Fronds', label:"Number of Fronds", value:300, min:30, max: 720, display: false },
  frondLength:          { group: 'Fronds', label: "Frond Length", value: 100, min: 10, max: 200, display: true },
  frondLength2:         { group: 'Fronds', label: "Frond Length 2", value: 60, min: 10, max: 200, display: true },
  frondDroop:           { group: 'Fronds', label:"Frond Droop", value:15, min:0, max: 50, display: true },
  frondSway:            { group: 'Fronds', label:"Frond Sway", value:0, min:-50, max: 50, display: true },
  frondRandom:          { group: 'Fronds', label:"Frond Randomness", value:40, min:1, max: 100, display: true },
  frondRandom2:         { group: 'Fronds', label:"Frond Randomness 2", value:15, min:1, max: 100, display: true },
  showGuideCircles:     { label:"DEV Show Guide Circles", value:0, min: 0, max: 1, display: false },
})
// a list of groups above to save putting below code in template
const categories = computed(() => {
  return Object.values(svg)
    .filter(v => v.group && v.display == true)
    .reduce((acc, val, i, []) => {
      !acc.includes(val.group) && acc.push(val.group)
      return acc
    }, [])
})
// update shown categories depending on inputs. could be done as computed, but this way keeps inputs together

const noBranches = computed(() => svg.noBranches.value) // cannot watch within an object
watch(noBranches, (n, o) => {
  // categories relevant to two branches
  const options = [
    'trunkLeftMid', 'trunkLeftTop', 'trunkLeftHeight', 
    'trunkRightMid', 'trunkRightTop', 'trunkRightHeight',
    'spikeSecondSwayMid', 'spikeSecondSwayTop', 'spikeSecondHeight', 'spikeSecondVisible',
    'flowerSecondStart', 'flowerSecondStop', 'flowerSecondVisible'];
  options.forEach(option => svg[option].display = (n == "2"))
  svg.trunkHeight.value = parseInt((svg.trunkHeight.value) * ((n == "2") ? 0.5 : 2))
  svg.frondLength.value = parseInt((svg.frondLength.value) * ((n == "2") ? 0.75 : 1.3333))
  
})
// swap the transform:translate from main branch to left branch depending on number of branches selected
const targetTrunk = computed(() => {
  if (svg.noBranches.value == '2') return `translate(${xTrunkLeftTop.value} ${yTrunkLeftTop.value - parseInt(svg.trunkWidth.value/2)})`
  return `translate(${xTrunkTop.value} ${yTrunkTop.value - parseInt(svg.trunkWidth.value)})`
})
const targetTrunk2 = computed(() => {
  if (svg.noBranches.value == '2') return `translate(${xTrunkRightTop.value} ${yTrunkRightTop.value - parseInt(svg.trunkWidth.value/2)})`
  return `translate(${xTrunkTop.value} ${yTrunkTop.value})` // shouldn't get used?
})



// not needed if watchEffect works
// const { marginBottom } = toRefs(svg)
// toRefs(Object.keys(svg));
const svgPoints = reactive({
  xInner: Array(svg.noFronds.value).fill(0),
  yInner: Array(svg.noFronds.value).fill(0),
  xMid: Array(svg.noFronds.value).fill(0),
  yMid: Array(svg.noFronds.value).fill(0),
  xOuter: Array(svg.noFronds.value).fill(0),
  yOuter: Array(svg.noFronds.value).fill(0),
  xMidRandom: Array(svg.noFronds.value).fill(0),
  yMidRandom: Array(svg.noFronds.value).fill(0),
  xOuterRandom: Array(svg.noFronds.value).fill(0),
  yOuterRandom: Array(svg.noFronds.value).fill(0),
})
const svgPoints2 = reactive({
  xInner: Array(svg.noFronds.value).fill(0),
  yInner: Array(svg.noFronds.value).fill(0),
  xMid: Array(svg.noFronds.value).fill(0),
  yMid: Array(svg.noFronds.value).fill(0),
  xOuter: Array(svg.noFronds.value).fill(0),
  yOuter: Array(svg.noFronds.value).fill(0),
  xMidRandom: Array(svg.noFronds.value).fill(0),
  yMidRandom: Array(svg.noFronds.value).fill(0),
  xOuterRandom: Array(svg.noFronds.value).fill(0),
  yOuterRandom: Array(svg.noFronds.value).fill(0),
})
const svgFlower = reactive({
  xFlowerTop: 242,
  yFlowerTop: 70,
  xFlowerMid: 246,
  yFlowerMid: 100,
  xFlowerBot: 245,
  yFlowerBot: 160
})
const svgFlower2 = reactive({
  xFlowerTop: 242,
  yFlowerTop: 70,
  xFlowerMid: 246,
  yFlowerMid: 100,
  xFlowerBot: 245,
  yFlowerBot: 160
})

const svgShapes = reactive({
  orange: `125,125 375,125 375,375 125,375`,
  black: `125,125 375,125 375,375 125,375`,
  grey:`125,125 375,125 375,375 125,375`,
  white: `125,125 375,125 375,375 125,375`,
})
/**
 * computed values
 */
const xMid = computed(() => { return svg.width.value / 2 + parseInt(svg.midOffset.value)})
const yMid = computed(() => { return svg.height.value / 2 })
const trunkMid = computed(() => { return svg.trunkHeight.value / 2 })
const trunkLeftMid = computed(() => { return svg.trunkLeftHeight.value / 2 })
const trunkRightMid = computed(() => { return svg.trunkRightHeight.value / 2 })
const xTrunkMid = computed(() => { return xMid.value - svg.trunkSwayMid.value })
const yTrunkMid = computed(() => { return svg.height.value - svg.marginBottom.value - trunkMid.value })
const xTrunkTop = computed(() => { return xMid.value + parseInt(svg.trunkSwayTop.value) })
const yTrunkTop = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value })
const xTrunkLeftMid = computed(() => { return xTrunkTop.value + parseInt(svg.trunkLeftMid.value) })
const yTrunkLeftMid = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value - trunkLeftMid.value })
const xTrunkLeftTop = computed(() => { return xTrunkTop.value + parseInt(svg.trunkLeftTop.value) })
const yTrunkLeftTop = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value - svg.trunkLeftHeight.value })
const xTrunkRightMid = computed(() => { return xTrunkTop.value + parseInt(svg.trunkRightMid.value) })
const yTrunkRightMid = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value - trunkRightMid.value })
const xTrunkRightTop = computed(() => { return xTrunkTop.value + parseInt(svg.trunkRightTop.value)  })
const yTrunkRightTop = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value- svg.trunkRightHeight.value })
const spikeMid = computed(() => { return svg.spikeHeight.value / 2 })
const xSpikeMid = computed(() => { return svg.spikeSwayMid.value})
const ySpikeMid = computed(() => { return -svg.spikeHeight.value / 2 })
const xSpikeTop = computed(() => { return svg.spikeSwayTop.value })
const ySpikeTop = computed(() => { return -svg.spikeHeight.value })
const spikeSecondMid = computed(() => { return svg.spikeSecondHeight.value / 2 })
const xSpikeSecondMid = computed(() => { return svg.spikeSecondSwayMid.value})
const ySpikeSecondMid = computed(() => { return -svg.spikeSecondHeight.value / 2 })
const xSpikeSecondTop = computed(() => { return svg.spikeSecondSwayTop.value })
const ySpikeSecondTop = computed(() => { return -svg.spikeSecondHeight.value })

const polyOrangeTopLeft = computed(() => { return `${Math.random() * 250},${Math.random() * 250}`})
const polyOrangeTopRight = computed(() => { return `${Math.random() * 250 + 250},${Math.random() * 250}`})
const polyOrangeBotLeft = computed(() => { return `${Math.random() * 250},${Math.random() * 250 + 250}`})
const polyOrangeBotRight = computed(() => { return `${Math.random() * 250 + 250},${Math.random() * 250 + 250}`})

const pathTrunk = computed(() => {
  return `M ${xMid.value} ${svg.height.value - svg.marginBottom.value} Q ${xTrunkMid} ${yTrunkMid} ${xTrunkTop} ${yTrunkTop}`
})
const svgPaths = computed(() => {
  // this format worked to pass variables into css code, however the from: {d ... } doesn't work in all browsers
  // the --strokeWidth is being used in css as a variable
  return {
    '--trunk': `M ${xMid.value} ${svg.height.value - svg.marginBottom.value} Q ${xTrunkMid.value} ${yTrunkMid.value} ${xTrunkTop.value} ${yTrunkTop.value}`,
    '--trunkLeft': `M ${xTrunkTop.value} ${yTrunkTop.value} Q ${xTrunkLeftMid.value} ${yTrunkLeftMid.value} ${xTrunkLeftTop.value} ${yTrunkLeftTop.value}`,
    '--trunkRight': `M ${xTrunkTop.value} ${yTrunkTop.value} Q ${xTrunkRightMid.value} ${yTrunkRightMid.value} ${xTrunkRightTop.value} ${yTrunkRightTop.value}`,
    // '--trunkAlt': `M ${xMid.value} ${svg.height.value - svg.marginBottom.value} Q ${svg.width.value - xTrunkMid.value} ${yTrunkMid.value} ${svg.width.value - xTrunkTop.value} ${yTrunkTop.value}`,
    '--spike': `M 0 0 Q ${xSpikeMid.value} ${ySpikeMid.value} ${xSpikeTop.value} ${ySpikeTop.value}`,
    '--spike2': `M 0 0 Q ${xSpikeSecondMid.value} ${ySpikeSecondMid.value} ${xSpikeSecondTop.value} ${ySpikeSecondTop.value}`,
    // '--spikeAlt': `M 0 0 Q ${svg.width.value - xSpikeMid.value} ${ySpikeMid.value} ${svg.width.value - xSpikeTop.value} ${ySpikeTop.value}`,
    '--flower': `M ${svgFlower.xFlowerBot} ${svgFlower.yFlowerBot} Q ${svgFlower.xFlowerMid} ${svgFlower.yFlowerMid} ${svgFlower.xFlowerTop} ${svgFlower.yFlowerTop}`,
    '--flower2': `M ${svgFlower2.xFlowerBot} ${svgFlower2.yFlowerBot} Q ${svgFlower2.xFlowerMid} ${svgFlower2.yFlowerMid} ${svgFlower2.xFlowerTop} ${svgFlower2.yFlowerTop}`,
    // '--flowerAlt': `M ${svgFlower.xFlowerBot} ${svgFlower.yFlowerBot} Q ${svg.width.value - svgFlower.xFlowerMid} ${svgFlower.yFlowerMid} ${svg.width.value - svgFlower.xFlowerTop} ${svgFlower.yFlowerTop}`,
    '--strokeWidth': `${svg.trunkWidth.value}px`,
    '--animationName': state.selectedAnim,
  }
})
  /**
   * methods/functions
   */
/**
 * generateFronds()
 * generate the fronds by drawing paths from points generated around 3 elipses
 */
function generateFronds() {
  // predefine the period and the element lookup, since they will be reference many times
  // while iterating through the fronds
  let period = { inner: undefined, mid: undefined, outer: undefined }
  let element = { inner: undefined, mid: undefined, outer: undefined }
  // find the distance between points for each elipse
  const elipses = ['inner', 'mid', 'outer', 'inner2', 'mid2', 'outer2']
  elipses.forEach((id, i) => {
    element[id] = document.getElementById(id)
    try{
      period[id] = element[id].getTotalLength() / svg.noFronds.value
    }
    catch{
      console.warn('elipses are not yet drawn, cannot query for their length')
    }
  })
  // for each frond, and each elipse, calculate the points
  try{
    Array(svg.noFronds.value).fill({}).forEach((frond, i) => {
      elipses.forEach(id => {
        const svgPoint = element[id].getPointAtLength(i * period[id])
      switch (id) {
        case 'inner':
          svgPoints.xInner[i] = svgPoint.x; // doesn't get random
          svgPoints.yInner[i] = svgPoint.y;
          break;
        case 'inner2':
          svgPoints2.xInner[i] = svgPoint.x; // doesn't get random
          svgPoints2.yInner[i] = svgPoint.y;
          break;
        case 'mid':
          svgPoints.xMid[i] = svgPoint.x + svgPoints.xMidRandom[i];
          svgPoints.yMid[i] = svgPoint.y + svgPoints.yMidRandom[i];
          break;
        case 'mid2':
          svgPoints2.xMid[i] = svgPoint.x + svgPoints2.xMidRandom[i];
          svgPoints2.yMid[i] = svgPoint.y + svgPoints2.yMidRandom[i];
          break;
        case 'outer':
          svgPoints.xOuter[i] = svgPoint.x + svgPoints.xOuterRandom[i];
          svgPoints.yOuter[i] = svgPoint.y + svgPoints.yOuterRandom[i];
          break;
        case 'outer2':
          svgPoints2.xOuter[i] = svgPoint.x + svgPoints2.xOuterRandom[i];
          svgPoints2.yOuter[i] = svgPoint.y + svgPoints2.yOuterRandom[i];
          break;
        default:    
      }
    })
  })
  }catch{
    console.warn('unable to generate fronds before elipses exist')
  }
}
/**
 * generateFlower()
 * generate the flower along the spike
 */
function generateFlower(spike, start, stop) {
  try{
    // const start = parseFloat(svg.flowerStart.value)
    // const stop = parseFloat(svg.flowerStop.value)
    // const element = document.getElementById('spike')
    const element = document.getElementById(spike)
    const length = element.getTotalLength() // float
    const top = element.getPointAtLength(start * length);
    const mid = element.getPointAtLength(parseFloat((parseFloat(start)+parseFloat(stop))/2) * length);
    const bottom = element.getPointAtLength(stop * length)
    if (spike === 'spike') {
      svgFlower.xFlowerTop = top.x
      svgFlower.xFlowerMid = mid.x
      svgFlower.xFlowerBot = bottom.x
      svgFlower.yFlowerTop = top.y
      svgFlower.yFlowerMid = mid.y
      svgFlower.yFlowerBot = bottom.y
    } else if (spike === 'spike2') {
      svgFlower2.xFlowerTop = top.x
      svgFlower2.xFlowerMid = mid.x
      svgFlower2.xFlowerBot = bottom.x
      svgFlower2.yFlowerTop = top.y
      svgFlower2.yFlowerMid = mid.y
      svgFlower2.yFlowerBot = bottom.y
    }

  } catch {
    console.warn('unable to query length of spike before it exists')
  }
}

/**
 * frondTest
 * Test fronds by integer to apply styling to top and bottom quadrant
 * called from template
 * @param {number} i frond index to be tested
 * @returns {string} class to be used
 *  */
function frondTest(i) {
  const n = svg.noFronds.value;
  if (parseInt(i) <= parseInt(n * 1/16)) return 'mid'
  if (parseInt(i) <= parseInt(n * 7/16)) return 'lower'
  if (parseInt(i) <= parseInt(n * 9/16)) return 'mid'
  if (parseInt(i) <= parseInt(n * 15/16)) return 'upper'
  return 'mid'
}
// watchEffects call the function once, track the relevant variables, then call it again when they update
// calling the variables in the watchEffect helps make sure the right things are tracked
setTimeout(() => {
  watchEffect(() => { randomise() })
  watchEffect(() => {
    const watchVariables = [
      svg.noBranches.value,
      svg.frondDroop.value,
      svg.frondSway.value,
      svg.frondLength.value,
      svg.frondRandom.value,
      svg.frondRandom2.value]
    generateFronds();
  })
  watchEffect(() => {
    const watchVariables = [
      svg.spikeSwayMid.value,
      svg.spikeSwayTop.value,
      svg.spikeHeight.value,
      svg.flowerStart.value,
      svg.flowerStop.value,
      svg.spikeVisible.value]
    generateFlower('spike', svg.flowerStart.value, svg.flowerStop.value)
  })
    watchEffect(() => {
    const watchVariables = [
      svg.spikeSecondSwayMid.value,
      svg.spikeSecondSwayTop.value,
      svg.spikeSecondHeight.value,
      svg.flowerSecondStart.value,
      svg.flowerSecondStop.value,
      svg.spikeSecondVisible.value]
    generateFlower('spike2', svg.flowerSecondStart.value, svg.flowerSecondStop.value);
  })

},100)
  /**
   * create reandom scatter for the end and midpoint of fronds
   * store this to prevent it re-seeding on every change
   */
function randomise() {
  svgPoints.xMidRandom = svgPoints.xMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.yMidRandom = svgPoints.yMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.xOuterRandom = svgPoints.xOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.yOuterRandom = svgPoints.yOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints2.xMidRandom = svgPoints2.xMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom2.value))
  svgPoints2.yMidRandom = svgPoints2.yMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom2.value))
  svgPoints2.xOuterRandom = svgPoints2.xOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom2.value))
  svgPoints2.yOuterRandom = svgPoints2.yOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom2.value))
  generateFronds()
}
/**
 * randomise the shapes being drawn, one point in each quadrant
 * @param {string} shape which shape/color should be updated
 */
function randomiseShape(shape) {
  const x = parseInt(xMid.value)
  const y = parseInt(yMid.value)
  svgShapes[shape] = `${Math.random()*x},${Math.random()*y} 
  ${Math.random()*x+x},${Math.random()*y} 
  ${Math.random()*x+x},${Math.random()*y+y} 
  ${Math.random()*x},${Math.random()*y+y}`
}
</script>

<style scoped>
.left {
  text-align: left;
}
svg {
  border: 1px grey solid;
}
.default {
  background-color: white;
  /* dummy class to fall through to base styling */
}
/* used for silhouette's. important used to override defs patterns */
.white {
  stroke: white !important;
  background-color: black
}
.black {
  stroke: black !important;
  background-color: white;

}
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.page * {
  flex: 0 0 auto;
}
.container {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
}
.color,
.controls,
.display {
  flex: 1 1 auto;
  padding: 2rem;
  overflow-y: auto;
  height: 70vh;
}
.color {
  text-align: left;
}
.controls {
  text-align: right;
}
.item input {
  margin-left: 1rem;
}

div.checkbox {
  display: flex;
  flex-direction: row;
  align-items: space-between; 
}
div.checkbox * {
  flex: 1 0 33%
}
/* SVG */

.shape { transition: 0.3s ease-in-out; }
.shape .orange { fill: #f6782b; stroke: none; }
.shape .grey { fill: grey; stroke: none; }
.shape .black { fill: black; stroke: none; }
.shape .white { fill: white; stroke: none; }

.trunk {
  stroke: url('#trunkColor');
  fill: none;
  stroke-width: var(--strokeWidth);
  stroke-linecap: round;
}
.fronds{  
  stroke: green;
  fill: none;
  stroke-width: 1px;
  stroke-linejoin: arc;
}
.upper {
  stroke: url('#frondColorUpper')
}
.lower {
  stroke: url('#frondColorLower')
}
#spike,
#spike2 {
  stroke: rgb(63, 46, 71);
  fill: none;
  stroke-width: 5px;
  stroke-linecap: round;
}
.flower {
  stroke: rgb(235, 189, 91);
  fill: none;
  stroke-width: 15px;
  stroke-linecap: round;
}
.ellipse {
  fill: none;
  stroke: none;
  stroke-width: 1px;
  stroke-dasharray: 2 2;
}
.copy {
  font-size: 0.8rem;
  color: grey;
}
</style>
