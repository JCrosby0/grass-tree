<template>
<div class="page">

<h2>Grass Tree Builder</h2>
<p>Here's a web app to build a grass tree in scalable vector graphics (SVG). 
  Change the inputs to build the tree trunk and spike, and then click the button to generate the fronds and flower. <br>
  Warning: some inputs (marked with *) may cause strange behaviour, refresh page if things go wrong.</p>
<div class="container">
<div class="controls">
  <h6>Dimensions</h6>
  <div v-for="key in Object.keys(svg)" :key="key" class="item">
    <p>{{key}}<span style='{color: red}' v-if="refreshRequired.includes(key)">*</span>
    <input v-model="svg[key]" type="number">
    </p>
  </div>
    <button @click="generate">Generate Fronds & Flower</button>
    <button @click="randomise">Randomise Fronds</button>
  <br>
</div>
<div class="color">
  <h6>Color Theme</h6>
  <div class="radio" v-for="opt in colorStyle" :key="opt">
    <input type="radio" :id="opt.value" name="color" :value="opt.value" v-model="state.selectedStyle">
    <label :for="opt.value">{{opt.name}}</label><br>
  </div>
</div>
<div class="display">
  <svg :class="state.selectedStyle" xmlns="http://www.w3.org/2000/svg" :width="`${svg.width}px`" :height="`${svg.height}px`" viewbox="0 0 200px 200px">
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
          y2="8%"
          spreadMethod="repeat"
          >
          <stop offset="20%" stop-color="grey" />
          <stop offset="50%" stop-color="black" />
        </linearGradient>
        <!-- <filter id="shadow">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2"/>
        </filter> -->
      </defs>
    <g>
      <!-- trunk -->
      <path :class="['trunk', state.selectedStyle]" :d="`
      M ${svgComp.xMid} ${svg.height - svg.marginBottom} 
      Q ${svgComp.xTrunkMid} ${svgComp.yTrunkMid}
      ${svgComp.xTrunkTop} ${svgComp.yTrunkTop}`"/>
    </g>
    <g>
      <!-- flower spike -->
        <path id="spike" :class="state.selectedStyle" :d="`M ${svgComp.xTrunkTop} ${svgComp.yTrunkTop} 
        Q ${svgComp.xSpikeMid} ${svgComp.ySpikeMid} 
        ${svgComp.xSpikeTop} ${svgComp.ySpikeTop}`"/>
        <path :class="['flower', state.selectedStyle]" :d="`M ${svgFlower.xFlowerBot} ${svgFlower.yFlowerBot} 
        Q ${svgFlower.xFlowerMid} ${svgFlower.yFlowerMid} 
        ${svgFlower.xFlowerTop} ${svgFlower.yFlowerTop}`"/>
    </g>
    <g>
      <!-- fronds -->
      <path 
        v-for="(point, i) in svgPoints.xInner" 
        :key="'point'+i"
        :class="['fronds', frondTest(i), state.selectedStyle]"
        :d="`M ${svgPoints.xInner[i]} ${svgPoints.yInner[i]}
        Q ${svgPoints.xMid[i]} ${svgPoints.yMid[i]}
        ${svgPoints.xOuter[i]} ${svgPoints.yOuter[i]}`"
        />
    </g>
    <g>
      <!-- ellipses -->
      <ellipse id="inner" class="ellipse inner" :style="`{stroke: ${svg.showGuideCircles ? '1px red' : '0'}}`"
        :cx="svgComp.xTrunkTop"
        :cy="svgComp.yTrunkTop"
        rx="1"
        ry="1" />
      <ellipse id="mid" class="ellipse mid"
        :cx="svgComp.xTrunkTop"
        :cy="svgComp.yTrunkTop"
        rx="60"
        ry="60" />
      <ellipse id="outer" class="ellipse outer"
        :cx="svgComp.xTrunkTop"
        :cy="svgComp.yTrunkTop + parseInt(svg.frondDroop)"
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

/* list of inputs that will need a browser refresh - making them not really usable */
const refreshRequired = ['noFronds'];
/**
 * reactive values
 */
const state = reactive({
  count: 0,
  selectedStyle: 'default'
   })
const svg = reactive({
  width: 500,
  height: 500,
  marginBottom: 50,
  noFronds: 300,
  trunkSwayMid: -10,
  trunkSwayTop: 1,
  trunkHeight: 150,
  spikeSwayMid: -15,
  spikeSwayTop: -5,
  spikeHeight: 250,
  frondDroop: 20,
  showGuideCircles: 0,
  flowerStart: 0.5,
  flowerStop: 0.9,
  frondRandom: 20
})

// not needed if watchEffect works
// const { marginBottom } = toRefs(svg)
// toRefs(Object.keys(svg));
const svgPoints = reactive({
  xInner: Array(svg.noFronds).fill(250),
  yInner: Array(svg.noFronds).fill(250),
  xMid: Array(svg.noFronds).fill(250),
  yMid: Array(svg.noFronds).fill(250),
  xOuter: Array(svg.noFronds).fill(250),
  yOuter: Array(svg.noFronds).fill(250),
  xMidRandom: Array(svg.noFronds).fill(0),
  yMidRandom: Array(svg.noFronds).fill(0),
  xOuterRandom: Array(svg.noFronds).fill(0),
  yOuterRandom: Array(svg.noFronds).fill(0),
})
const svgFlower = reactive({
  xFlowerTop: 242,
  yFlowerTop: 70,
  xFlowerMid: 246,
  yFlowerMid: 100,
  xFlowerBot: 245,
  yFlowerBot: 160
})
/**
 * computed values
 */
const svgComp = computed(() => {
  return {
    xMid: svg.width / 2,
    yMid: svg.height / 2,
    trunkMid: parseFloat(svg.trunkHeight / 2.0),
    xTrunkMid: parseFloat(svg.width / 2.0 - parseInt(svg.trunkSwayMid)),
    yTrunkMid: parseFloat(svg.height - parseInt(svg.marginBottom) - parseInt(svg.trunkHeight) / 2.0),
    xTrunkTop: parseFloat(svg.width / 2.0 + parseInt(svg.trunkSwayTop)),
    yTrunkTop: parseFloat(svg.height - parseInt(svg.marginBottom) - parseInt(svg.trunkHeight)),
    spikeMid: svg.spikeHeight / 2.0,
    xSpikeMid: parseFloat(svg.width / 2.0 + parseInt(svg.trunkSwayTop) + parseInt(svg.spikeSwayMid)),
    ySpikeMid: parseFloat(svg.height - parseInt(svg.marginBottom) - parseInt(svg.trunkHeight) - parseInt(svg.spikeHeight) / 2.0),
    xSpikeTop: parseFloat(svg.width / 2.0 + parseInt(svg.trunkSwayTop) + parseInt(svg.spikeSwayTop)),
    ySpikeTop: parseFloat(svg.height - parseInt(svg.marginBottom) - parseInt(svg.trunkHeight) - parseInt(svg.spikeHeight))
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
function generateFronds(someElementId, noFronds = svg.noFronds) {
  console.log('someElementId: ', someElementId)
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
function generateFlower(someElementId = 'spike', start = parseFloat(svg.flowerStart), stop = parseFloat(svg.flowerStop)) {
  console.log('logging time for generating flower')
  console.time('flower')
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
  console.timeEnd('flower')
}

/**
 * frondTest
 * Test fronds by integer to apply styling to top and bottom quadrant
 * called from template
 * @param {number} i frond index to be tested
 * @returns {string} class to be used
 *  */
function frondTest(i) {
  const n = svg.noFronds;
  if (parseInt(i) <= parseInt(n * 1/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 3/8)) return 'lower'
  if (parseInt(i) <= parseInt(n * 5/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 7/8)) return 'upper'
  return 'mid'
}
watchEffect(() => {
  console.log('randomise', svg.frondRandom)
  randomise()
  // setTimeout(generate,1) // cannot getLength until after its been generated
})
// run the function once, track its dependencies, and run again when they change...
watchEffect(() => {
  // the following variables require a redraw. 
  // touching them here makes watchEffect trigger when they update without otherwise declaring as individual watch targets within an object (reactivity issues)
  console.log('watch test', svg.trunkSwayTop, 
  svg.frondDroop, 
  svg.marginBottom,
  svg.trunkHeight,
  )
  setTimeout(generate, 1);
})

// watchEffect for generating flower
// TODO: transform: translate() the fronds, spike and flower to the top of the trunk
watchEffect(() => {
  console.log('watch test for flower: ',
  svg.trunkSwayTop,
  svg.trunkHeight,
  svg.spikeSwayMid,
  svg.spikeSwayTop,
  svg.spikeHeight,
  svg.flowerStart,
  svg.flowerStop)

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

  console.log('logging time for generating fronds')
  console.time('fronds')
  const elements = ['inner', 'mid', 'outer']
  elements.forEach(element => {
    console.log('element: ', element)
    generateFronds(element)
  })
  console.timeEnd('fronds')
  }
  /**
   * create reandom scatter for the end and midpoint of fronds
   * store this to prevent it re-seeding on every change
   */
function randomise() {
  svgPoints.xMidRandom = svgPoints.xMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom))
  svgPoints.yMidRandom = svgPoints.yMidRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom))
  svgPoints.xOuterRandom = svgPoints.xOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom))
  svgPoints.yOuterRandom = svgPoints.yOuterRandom.map(_ => (Math.random() - 0.5)*parseInt(svg.frondRandom))
  setTimeout(generate,1)
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
/* SVG */
.trunk {
  stroke: url('#trunkColor');
  fill: none;
  stroke-width: 30px;
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
