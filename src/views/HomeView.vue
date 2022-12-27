<script setup>
import { ref, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs';
import {MusRec} from '../MusRec';
import imageURL from '../assets/lebron.jpg';


async function predict() {
  const musrec = new MusRec();
  console.time('Loading of model');
  await musrec.load();
  console.timeEnd('Loading of model');
  var pic0 = new Image();
  pic0.src = imageURL;
  pic0.onload = async () => {
    var img0 = tf.browser.fromPixels(pic0).resizeBilinear([180,180]);
    console.log(img0);
    console.time('First prediction');

    // input 180*180*3
    let result = musrec.predict(img0);
    const topK = musrec.getTopKClasses(result, 5);
    console.timeEnd('First prediction');
    var resultElement = ""
    topK.forEach(x => {
    resultElement += `${x.value.toFixed(3)}: ${x.label}\n`;
  });
    console.log(resultElement);
  }
  //const result = await musrec.predict(imageURL);
}

</script>




<script>
</script>



<template>
<button @click="predict" class = "predict-button">predict</button>

<!--
<img src = "../assets/lebron.jpg" />
-->
<div id="result">

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