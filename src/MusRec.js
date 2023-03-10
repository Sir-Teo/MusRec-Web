
import * as tf from '@tensorflow/tfjs';

const MUSIC_CLASSES = {
  0:"classical music",
  1:"country music",
  2:"jazz music",
  3:"pop music",
  4:"rock music",
}

const MODEL_URL = 'src/my_tfjs_model/model.json'


export class MusRec {
  constructor() {
  }

  async load() {
    this.model = await tf.loadGraphModel(MODEL_URL);
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
  /**
   * Infer through MobileNet. This does standard ImageNet pre-processing before
   * inferring through the model. This method returns named activations as well
   * as softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The softmax logits.
   */
  predict(input) {
    var prediction = this.model.predict(input.reshape([1, 180, 180, 3]));
    return prediction;
  }

  getTopKClasses(logits, topK) {
    const predictions = tf.tidy(() => {
      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], index: i});
    }
    predictionList = predictionList
                         .sort((a, b) => {
                           return b.value - a.value;
                         })
                         .slice(0, topK);

    return predictionList.map(x => {
      return {label: MUSIC_CLASSES[x.index], value: x.value};
    });
  }
}