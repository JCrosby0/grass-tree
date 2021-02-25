<template>
<div class="page">

<h2>Paper-tree builder</h2>
<p>Here's a web app to build a paper-tree in scalable vector graphics (SVG). Change the inputs to build the tree trunk and spike, and then click the button to generate the fronds and flower. <br>Warning: some inputs break the SVG, refresh page if things go wrong.</p>
<div class="container">

<div class="controls">
  <div v-for="key in Object.keys(svg)" :key="key" class="item">
    <p>{{key}}
    <input v-model="svg[key]" type="number">
    </p>
  </div>
    <button @click="test">Generate Fronds & Flower</button>
  <br>
</div>
<div class="display">
  <svg xmlns="http://www.w3.org/2000/svg" :width="`${svg.width}px`" :height="`${svg.height}px`" viewbox="0 0 200px 200px">
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
      <path class="trunk" :d="`
      M ${svgComp.xMid} ${svg.height - svg.marginBottom} 
      Q ${svgComp.xTrunkMid} ${svgComp.yTrunkMid}
      ${svgComp.xTrunkTop} ${svgComp.yTrunkTop}`"/>
    </g>
      <g>
        <!-- flower spike -->
          <path id="spike" :d="`M ${svgComp.xTrunkTop} ${svgComp.yTrunkTop} 
          Q ${svgComp.xSpikeMid} ${svgComp.ySpikeMid} 
          ${svgComp.xSpikeTop} ${svgComp.ySpikeTop}`"/>
          <path class="flower" :d="`M ${svgFlower.xFlowerBot} ${svgFlower.yFlowerBot} 
          Q ${svgFlower.xFlowerMid} ${svgFlower.yFlowerMid} 
          ${svgFlower.xFlowerTop} ${svgFlower.yFlowerTop}`"/>
      </g>
    <g>
      <!-- fronds -->
      <path 
        v-for="(point, i) in svgPoints.xInner" 
        :key="'point'+i"
        :class="['fronds', frondTest(i)]"
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
        :cy="svgComp.yTrunkTop+parseInt(svg.frondDroop)"
        rx="100"
        ry="100" />
    </g>
  </svg>
</div>
</div>
<p>&copy; Joe Crosby, 2021</p>
  </div>
</template>

<script setup>
import { defineProps, reactive, computed } from 'vue'

defineProps({
  msg: String
})

function generateFronds(someElementId, noFronds = svg.noFronds) {
  console.log('someElementId: ', someElementId)
  const someElement = document.getElementById(someElementId)
  const length = someElement.getTotalLength() // float
  const period = length / noFronds; // float
  const points = Array(noFronds).fill({}).map((el, i) => someElement.getPointAtLength(i * period))
  const xPoints = points.map(p => p.x)
  const yPoints = points.map(p => p.y)
  if (someElementId === 'inner') {
    return [points, xPoints, yPoints]
  }
  const xPointsRandom = xPoints.map(p => p + (Math.random() - 0.5)*parseInt(svg.flowerRandom))
  const yPointsRandom = yPoints.map(p => p + (Math.random() - 0.5)*parseInt(svg.flowerRandom))
  return [points, xPointsRandom, yPointsRandom]

}

function generateFlower(someElementId = 'spike', start = parseFloat(svg.flowerStart), stop = parseFloat(svg.flowerStop)) {
  console.log('stop: ', stop)
  console.log('start: ', start)
  console.log('someElementId - flower', someElementId);
  const someElement = document.getElementById(someElementId)
  const length = someElement.getTotalLength() // float
  console.log('length: ', length)
  const top = someElement.getPointAtLength(start * length);
  console.log('top: ', top)
  const mid = someElement.getPointAtLength(parseFloat((start + stop)/2) * length);
  console.log('mid: ', mid)
  const bottom = someElement.getPointAtLength(stop * length)
  console.log('bottom: ', bottom)
  svgFlower.xFlowerTop = top.x
  svgFlower.xFlowerMid = mid.x
  svgFlower.xFlowerBot = bottom.x
  svgFlower.yFlowerTop = top.y
  svgFlower.yFlowerMid = mid.y
  svgFlower.yFlowerBot = bottom.y
}

function frondTest(i) {
  const n = svg.noFronds;
  if (parseInt(i) <= parseInt(n * 1/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 3/8)) return 'lower'
  if (parseInt(i) <= parseInt(n * 5/8)) return 'mid'
  if (parseInt(i) <= parseInt(n * 7/8)) return 'upper'
  return 'mid'
}

const state = reactive({ count: 0 })
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
  flowerRandom: 20
})

const svgPoints = reactive({
  xInner: Array(svg.noFronds).fill(250),
  yInner: Array(svg.noFronds).fill(250),
  xMid: Array(svg.noFronds).fill(250),
  yMid: Array(svg.noFronds).fill(250),
  xOuter: Array(svg.noFronds).fill(250),
  yOuter: Array(svg.noFronds).fill(250),
})
const svgFlower = reactive({
  xFlowerTop: 242,
  yFlowerTop: 70,
  xFlowerMid: 246,
  yFlowerMid: 100,
  xFlowerBot: 245,
  yFlowerBot: 160
})
const test = function() {
  console.time('test')
  generateFlower();
  let out = generateFronds('inner');
  svgPoints.xInner = out[1]
  svgPoints.yInner = out[2]
  out = generateFronds('mid');
  svgPoints.xMid = out[1]
  svgPoints.yMid = out[2]
  out = generateFronds('outer');
  svgPoints.xOuter = out[1]
  svgPoints.yOuter = out[2]
  console.timeEnd('test')
  }
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
</script>

<style scoped>
svg {
  border: 1px grey solid;
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
.controls,
.display {
  flex: 1 1 50%;
}
.controls {
  text-align: right;
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
</style>
