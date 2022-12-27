<script setup>
</script>




<script>
import * as tf from '@tensorflow/tfjs';
import {MusRec} from '../MusRec';
import imageURL from '../assets/test.jpg';


const cat = readFile(imageURL);
cat.onload = async () => {
  const resultElement = document.getElementById('result');

  resultElement.innerText = 'Loading MusRec...';

  const musrec = new MusRec();
  console.time('Loading of model');
  await musrec.load();
  console.timeEnd('Loading of model');

  const pixels = tf.browser.fromPixels(cat);

  console.time('First prediction');
  let result = musrec.predict(pixels);
  const topK = musrec.getTopKClasses(result, 5);
  console.timeEnd('First prediction');

  resultElement.innerText = '';
  topK.forEach(x => {
    resultElement.innerText += `${x.value.toFixed(3)}: ${x.label}\n`;
  });

  console.time('Subsequent predictions');
  result = musrec.predict(pixels);
  musrec.getTopKClasses(result, 5);
  console.timeEnd('Subsequent predictions');

  musrec.dispose();
};
</script>



<template>

<img v-if="url" :src="url" />
<div id="result"></div>
  
</template>
