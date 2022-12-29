<script setup>
import { ref, onMounted } from 'vue'
import * as tf from '@tensorflow/tfjs';
import {MusRec} from '../MusRec';

const isLoaded = ref(false);
const isPredicted = ref(false);
const resultDisplay = ref([]);


async function predict() {
  var imageURL = window.sessionStorage.getItem('image-url');
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
    var resultString = ""
    var resultDict = {};
    topK.forEach(x => {
    resultDict[x.label] = x.value.toFixed(3);
    resultString += `${x.value.toFixed(3)}: ${x.label}\n`;
    resultDisplay.value.push ({value: x.value.toFixed(3),key: x.label});
  });
    window.sessionStorage.setItem('result', JSON.stringify(resultDict));
  }
}
</script>

<script>

const songList = ref([]);
const songID = ref([]);
const isRecommending = ref(false);

async function recommend() {
  var result = JSON.parse(window.sessionStorage.getItem('result'));
  var target_genre = Object.keys(result)[0].split(" ")[0];
  var limit = 5
  var client_id = 'deca4b76e5114fdbb97ce87467341145';
  var client_secret = '93f8fc29f4a3427881a6228835eefd16';

  fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  })
  .then(r => r.json())
  .then(r => {
      console.log(r.access_token);
      window.sessionStorage.setItem('access_token', r.access_token);
      isRecommending.value = true;
  })


  const endpoint = "https://api.spotify.com/v1/recommendations";
  const token = window.sessionStorage.getItem('access_token');
  const genre = target_genre;

  fetch(`${endpoint}?seed_genres=${genre}&limit=${limit}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(({tracks}) => {
    tracks.forEach(item => {
      //console.log(`${item.name} by ${item.artists[0].name}`);
      songList.value.push({value: `${item.name}`, key: `${item.artists[0].name}`});
      songID.value.push({value:`${item.id}`,key : `${item.name}`});
    })
  })
    
}
</script>


<template>
<div id="Display Text">
<button @click="predict" class = "predict-button">Predict</button>
<button @click="recommend" class = "recommend-button">Recommend</button>
<p v-if = "isLoaded">Model Loaded...</p>
<p v-if = "isPredicted">Displaying Predicted value...</p>
<p v-if = "resultDisplay.length !=0" v-for="(r, i) in resultDisplay" :key="i">
        {{ r.key }}: {{ r.value }}
</p>
<p v-if = "isRecommending">Displaying Recommendations...</p>
<div id = "spotify-embed" v-if = "songID.length !=0" v-for="(r, i) in songID" :key="i">
  <iframe :src="`https://open.spotify.com/embed/track/`+r.value" width="80%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
</div>

</div>
  
</template>

<style scoped>


.predict-button {
  width: 100px;
  height: 50px;
  background-color: transparent; 
  border: none;
  color: hsla(160, 100%, 37%, 1);
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}


button,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  button:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}


.recommend-button {
  width: 120px;
  height: 50px;
  background-color: transparent;
  border: none;
  color: hsla(160, 100%, 37%, 1);
  text-align: center;
  display: inline-block;
  font-size: 16px;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
</style>