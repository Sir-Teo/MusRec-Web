<script setup>
import { ref, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs';
import {MusRec} from '../MusRec';
import imageURL from '../assets/lebron.jpg';

const isLoaded = ref(false);
const isPredicted = ref(false);
const resultDisplay = ref([]);


async function predict() {
  const musrec = new MusRec();
  console.time('Loading of model');
  await musrec.load();
  console.timeEnd('Loading of model');
  isLoaded.value = true;
  var pic0 = new Image();
  pic0.src = imageURL;
  pic0.onload = async () => {
    var img0 = tf.browser.fromPixels(pic0).resizeBilinear([180,180]);
    console.log(img0);
    console.time('First prediction Time');
    // input 180*180*3
    let result = musrec.predict(img0);
    const topK = musrec.getTopKClasses(result, 5);
    console.timeEnd('First prediction Time');
    isPredicted.value = true;
    var resultElement = ""
    topK.forEach(x => {
    resultElement += `${x.value.toFixed(3)}: ${x.label}\n`;
    resultDisplay.value.push ({value: x.value.toFixed(3),key: x.label});
  });
    console.log(resultElement);

  }

}
</script>


<template>
<div id="Display Text">
<button @click="predict" class = "predict-button">predict</button>
<p v-if = "isLoaded">Model Loaded...</p>
<p v-if = "isPredicted">Displaying Predicted value...</p>
<p v-if = "resultDisplay.length !=0" v-for="(r, i) in resultDisplay" :key="i">
        {{ r.key }}: {{ r.value }}
</p>
</div>
  
</template>

<style scoped>
.predict-button {
  width: 60px;
  height: 50px;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
</style>