<template>
  <div class="page">

    <h2>Grass Tree Builder</h2>
    <p>Here's a web app to build a grass tree in scalable vector graphics (SVG). 
      Change the inputs to build the tree trunk and spike, and then click the button to generate the fronds and flower.</p>
  <div class="container">

    <!-- CONTROL PANEL -->
    <div class="controls">
      <h6>Dimensions</h6>
      <div v-for="key in Object.values(svg).filter(k => k.display === true)" :key="key" class="item">
        <p>{{key.label}}<span style='{color: red}' v-if="refreshRequired.includes(key)">*</span>
          <input v-model="key.value" type="range" :min="key.min" :max="key.max" :step="key.step">
        </p>
      </div>
      <!-- <button @click="generate">Generate Fronds & Flower</button> -->
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
      <!-- <h6>Animation</h6>
      <div class="radio" v-for="opt in animStyle" :key="opt+'anim'">
        <input type="radio" :id="opt.value" name="anim" :value="opt.value" v-model="state.selectedAnim">
        <label :for="opt.value">{{opt.name}}</label><br>
      </div> -->
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
              <stop offset="95%" stop-color="yellowgreen" />
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
        <g>
          <!-- trunk -->
          <path :class="['trunk', state.selectedColor]"
            :style="svgPaths" 
            :d="svgPaths['--trunk']">
            <!-- <animate
              v-if="['dance'].includes(state.selectedAnim)"
              attributeName="d"
              dur="1440ms"
              repeatCount="indefinite"
              keyTimes="0;
                       .0625;
                       .208333333;
                       .3125;
                       .395833333;
                       .645833333;
                       .833333333;
                       1"
              calcMode="spline"
              keySplines="0,0,1,1;
                         .42,0,.58,1;
                         .42,0,1,1;
                         0,0,.58,1;
                         .42,0,.58,1;
                         .42,0,.58,1;
                         .42,0,.58,1"
              :values="`${svgPaths['--trunk']}; ${svgPaths['--trunkAlt']};`"
            />-->
          </path>
        </g>
        <g :transform="`translate(${xTrunkTop} ${yTrunkTop})`">
          <!-- spike -->
          <path id="spike" :class="state.selectedColor" :style="svgPaths" :d="svgPaths['--spike']">
              <animateTransform
                v-if="['windy', 'gusty'].includes(state.selectedAnim)"
                id="s1"
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                begin="0;s2.end"
              :from="state.selectedAnim === 'windy' ? '0' : '50'"
                :to="state.selectedAnim === 'windy' ? '10' : '30'"
                :dur="state.selectedAnim === 'windy' ? '5s' : '1s'" />
              <animateTransform
                v-if="['windy', 'gusty'].includes(state.selectedAnim)"
                id="s2"
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                begin="s1.end"
              :from="state.selectedAnim === 'windy' ? '10' : '30'"
                :to="state.selectedAnim === 'windy' ? '0' : '50'"
                :dur="state.selectedAnim === 'windy' ? '5s' : '1s'" />
            </path>
            <!-- flower -->
          <path :class="['flower', state.selectedColor]" :style="svgPaths" :d="svgPaths['--flower']">
              <animateTransform
                v-if="['windy', 'gusty'].includes(state.selectedAnim)"
                id="f1"
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                begin="0;f2.end"
                :from="state.selectedAnim === 'windy' ? '0' : '50'"
                :to="state.selectedAnim === 'windy' ? '10' : '30'"
                :dur="state.selectedAnim === 'windy' ? '5s' : '1s'" />
              <animateTransform
                v-if="['windy', 'gusty'].includes(state.selectedAnim)"
                id="f2"
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                begin="f1.end"
            :from="state.selectedAnim === 'windy' ? '10' : '30'"
                :to="state.selectedAnim === 'windy' ? '0' : '50'"
                :dur="state.selectedAnim === 'windy' ? '5s' : '1s'" />
            </path>
        </g>
        <g :transform="`translate(${xTrunkTop} ${yTrunkTop})`">
          <!-- fronds -->
          <path 
            v-for="(point, i) in svgPoints.xInner" 
            :key="'point'+i"
            :class="['fronds', frondTest(i), state.selectedColor]"
            :d="`M ${svgPoints.xInner[i]} ${svgPoints.yInner[i]}
            Q ${svgPoints.xMid[i]} ${svgPoints.yMid[i]}
            ${svgPoints.xOuter[i]} ${svgPoints.yOuter[i]}`"
          />
        </g>
        <g :transform="`translate(${xTrunkTop} ${yTrunkTop})`">
          <!-- ellipses -->
          <ellipse id="inner" class="ellipse inner" :style="`{stroke: ${svg.showGuideCircles.value === 1 ? '1px red' : '0'}}`"
            cx="0"
            cy="0"
            rx="1"
            ry="1" />
          <ellipse id="mid" class="ellipse mid"
            cx="0"
            cy="0"
            rx="60"
            ry="60" />
          <ellipse id="outer" class="ellipse outer"
            :cx="parseInt(svg.frondSway.value)"
            :cy="parseInt(svg.frondDroop.value)"
            rx="100"
            ry="100" />
          </g>
        </svg>
      </div>
    </div>
    <p class="copy">Developed by Joe Crosby, &copy; 2021</p>
  </div>
</template>

<script setup>
import { defineProps, reactive, computed, watchEffect, toRefs } from 'vue'

defineProps({
  msg: String
})


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
  width: {value: 500, min: 300, max: 750, display: false},
  height: {value: 500, min: 300, max: 750, display: false},
  marginBottom: { label:"Bottom Margin", value:50, min:0, max: 200, display: true },
  noFronds: { label:"Number of Fronds", value:300, min:30, max: 720, display: false },
  trunkSwayMid: { label:"Trunk Sway - Mid", value:-10, min:-100, max: 100, display: true },
  trunkSwayTop: { label:"Trunk Sway - Top", value:2, min:-100, max: 100, display: true },
  trunkHeight: { label:"Trunk Height", value:150, min:50, max: 350, display: true },
  trunkWidth: { label:"Trunk Width", value:40, min:1, max: 100, display: true },
  spikeSwayMid: { label:"Spike Sway - Mid", value:-15, min:-100, max: 100, display: true },
  spikeSwayTop: { label:"Spike Sway - Top", value: -5, min:-100, max: 100, display: true },
  spikeHeight: { label:"Spike Height", value:250, min:50, max: 350, display: true },
  frondDroop: { label:"Frond Droop", value:15, min:0, max: 50, display: true },
  frondSway: { label:"Frond Sway", value:0, min:-50, max: 50, display: true },
  frondRandom: { label:"Frond Randomness", value:20, min:1, max: 100, display: true },
  showGuideCircles: { label:"DEV Show Guide Circles", value:0, min: 0, max: 1, display: false },
  flowerStart: { label:"Flower Start", value:0.5, min: 0, max: 1, step: 0.05, display: true },
  flowerStop: { label:"Flower Stop", value:0.9, min: 0, max: 1, step: 0.05, display: true },
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
const svgFlower = reactive({
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
// const svgComp = computed(() => {
//   return {
//     xMid: svg.width.value / 2,
//     yMid: svg.height.value / 2,
//     trunkMid: parseFloat(svg.trunkHeight.value / 2.0),
//     xTrunkMid: parseFloat(svg.width.value / 2.0 - parseInt(svg.trunkSwayMid.value)),
//     yTrunkMid: parseFloat(svg.height.value - parseInt(svg.marginBottom.value) - parseInt(svg.trunkHeight.value) / 2.0),
//     xTrunkTop: parseFloat(svg.width.value / 2.0 + parseInt(svg.trunkSwayTop.value)),
//     yTrunkTop: parseFloat(svg.height.value - parseInt(svg.marginBottom.value) - parseInt(svg.trunkHeight.value)),
//     spikeMid: svg.spikeHeight.value / 2.0,
//     xSpikeMid: parseFloat(svg.spikeSwayMid.value),
//     ySpikeMid: parseFloat(-svg.spikeHeight.value / 2.0),
//     xSpikeTop: parseFloat(svg.spikeSwayTop.value),
//     ySpikeTop: parseFloat(-svg.spikeHeight.value)
//   }
// })
const xMid = computed(() => { return svg.width.value / 2 })
const yMid = computed(() => { return svg.height.value / 2 })
const trunkMid = computed(() => { return svg.trunkHeight.value / 2 })
const xTrunkMid = computed(() => { return xMid.value - svg.trunkSwayMid.value })
const yTrunkMid = computed(() => { return svg.height.value - svg.marginBottom.value - trunkMid.value })
const xTrunkTop = computed(() => { return xMid.value + parseInt(svg.trunkSwayTop.value) })
const yTrunkTop = computed(() => { return svg.height.value - svg.marginBottom.value - svg.trunkHeight.value })
const spikeMid = computed(() => { return svg.spikeHeight.value / 2 })
const xSpikeMid = computed(() => { return svg.spikeSwayMid.value})
const ySpikeMid = computed(() => { return -svg.spikeHeight.value / 2 })
const xSpikeTop = computed(() => { return svg.spikeSwayTop.value })
const ySpikeTop = computed(() => { return -svg.spikeHeight.value })

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
    // '--trunkAlt': `M ${xMid.value} ${svg.height.value - svg.marginBottom.value} Q ${svg.width.value - xTrunkMid.value} ${yTrunkMid.value} ${svg.width.value - xTrunkTop.value} ${yTrunkTop.value}`,
    '--spike': `M 0 0 Q ${xSpikeMid.value} ${ySpikeMid.value} ${xSpikeTop.value} ${ySpikeTop.value}`,
    // '--spikeAlt': `M 0 0 Q ${svg.width.value - xSpikeMid.value} ${ySpikeMid.value} ${svg.width.value - xSpikeTop.value} ${ySpikeTop.value}`,
    '--flower': `M ${svgFlower.xFlowerBot} ${svgFlower.yFlowerBot} Q ${svgFlower.xFlowerMid} ${svgFlower.yFlowerMid} ${svgFlower.xFlowerTop} ${svgFlower.yFlowerTop}`,
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
 * @param {string} someElementId target elipse id
 * @param {int} noFronds number of fronds, number of points around the elipse
 * @returns array of point data to be used in generating SVG paths
 */
function generateFronds(someElementId, noFronds = svg.noFronds.value) {
  // console.log('someElementId: ', someElementId)
  const someElement = document.getElementById(someElementId)
  const length = someElement.getTotalLength() // float
  const period = length / noFronds; // float
  Array(noFronds).fill({}).forEach((el, i) => {
    //get the points
    const svgPoint = someElement.getPointAtLength(i * period)
    // write them to desired location while in first iteration
    switch (someElementId) {
      case 'inner':
        svgPoints.xInner[i] = svgPoint.x; // doesn't get random
        svgPoints.yInner[i] = svgPoint.y;
        break;
      case 'mid':
        svgPoints.xMid[i] = svgPoint.x + svgPoints.xMidRandom[i];
        svgPoints.yMid[i] = svgPoint.y + svgPoints.yMidRandom[i];
        break;
      case 'outer':
        svgPoints.xOuter[i] = svgPoint.x + svgPoints.xOuterRandom[i];
        svgPoints.yOuter[i] = svgPoint.y + svgPoints.yOuterRandom[i];
        break;
      default:    
    }
    return
  })
}
/**
 * generateFlower()
 * generate the flower along the spike
 * @param {string} someElementId element to be targetted
 * @param {int} start starting point for length calculation
 * @param {int} end end point for length calculation
 * @returns writes top, mid and bottom x,y coordinates to svgFlower
 */
function generateFlower(someElementId = 'spike', start = parseFloat(svg.flowerStart.value), stop = parseFloat(svg.flowerStop.value)) {
  // console.log('logging time for generating flower')
  // console.time('flower')
  const someElement = document.getElementById(someElementId)
  const length = someElement.getTotalLength() // float
  const top = someElement.getPointAtLength(start * length);
  const mid = someElement.getPointAtLength(parseFloat((start + stop)/2) * length);
  const bottom = someElement.getPointAtLength(stop * length)
  svgFlower.xFlowerTop = top.x
  svgFlower.xFlowerMid = mid.x
  svgFlower.xFlowerBot = bottom.x
  svgFlower.yFlowerTop = top.y
  svgFlower.yFlowerMid = mid.y
  svgFlower.yFlowerBot = bottom.y
  // console.timeEnd('flower')
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
  if (parseInt(i) <= parseInt(n * 1/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 3/8)) return 'lower'
  if (parseInt(i) <= parseInt(n * 5/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 7/8)) return 'upper'
  return 'mid'
}
watchEffect(() => {
  console.log('randomise', svg.frondRandom.value)
  randomise()
  // setTimeout(generate,1) // cannot getLength until after its been generated
})
// run the function once, track its dependencies, and run again when they change...
watchEffect(() => {
  // the following variables require a redraw. 
  // touching them here makes watchEffect trigger when they update without otherwise declaring as individual watch targets within an object (reactivity issues)
  console.log('watch test', 
  svg.frondDroop.value,
  svg.frondSway.value,
  svg.marginBottom.value,
  )
  setTimeout(generate, 1);
})

// watchEffect for generating flower
// TODO: transform: translate() the fronds, spike and flower to the top of the trunk
watchEffect(() => {
  console.log('watch test for flower: ',
  svg.spikeSwayMid.value,
  svg.spikeSwayTop.value,
  svg.spikeHeight.value,
  svg.flowerStart.value,
  svg.flowerStop.value)

  setTimeout(generateFlower,1);
})

/**
 * generate()
 * helper function to call everything that needs to be recalculated
 * hooked up to a button
 * TODO: automate this call
 */
function generate() {
  // timing this function for performance
  // goal: 16ms
  // latest: ~50ms

  // console.log('logging time for generating fronds')
  // console.time('fronds')
  const elements = ['inner', 'mid', 'outer']
  elements.forEach(element => {
    // console.log('element: ', element)
    generateFronds(element)
  })
  // console.timeEnd('fronds')
  }
  /**
   * create reandom scatter for the end and midpoint of fronds
   * store this to prevent it re-seeding on every change
   */
function randomise() {
  svgPoints.xMidRandom = svgPoints.xMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.yMidRandom = svgPoints.yMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.xOuterRandom = svgPoints.xOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  svgPoints.yOuterRandom = svgPoints.yOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom.value))
  setTimeout(generate,1)
}

function randomiseShape(shape) {
  console.log('randomising shape: ', shape)
  const x = parseInt(xMid.value)
  console.log('xMid.value: ', xMid.value)
  console.log('x: ', x)
  const y = parseInt(yMid.value)
  console.log('Math.random()*x+x: ', Math.random()*x+x)
  svgShapes[shape] = `${Math.random()*x},${Math.random()*y} 
  ${Math.random()*x+x},${Math.random()*y} 
  ${Math.random()*x+x},${Math.random()*y+y} 
  ${Math.random()*x},${Math.random()*y+y}`
}
</script>

<style scoped>
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
/* trunk animation */
/* from{d: } reported to only be working in some browsers */
/* @keyframes dance {
  from {d: path(var(--trunk));}
  to {d: path(var(--trunkAlt));}
}  */

.shape {
  transition: 0.3s ease-in-out;
}
.shape .orange { fill: #f6782b; stroke: none; }
.shape .grey { fill: grey; stroke: none; }
.shape .black { fill: black; stroke: none; }
.shape .white { fill: white; stroke: none; }

.trunk {
  stroke: url('#trunkColor');
  fill: none;
  /* d: var(--trunk)); */
  stroke-width: var(--strokeWidth);
  stroke-linecap: round;
  /* animation-name: var(--animationName);
  animation-duration: 2s;
  animation-iteration-count: infinite; */
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
#spike {
  stroke: olive;
  fill: none;
  stroke-width: 5px;
  stroke-linecap: round;
}
.flower {
  stroke: brown;
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
