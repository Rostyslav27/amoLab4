
<template>
  <main class="container main">
    <section class="main__student-info">
      <StudentInfo class="student-info__info" /> 
    </section>
    <section class="main__content">
      <Card title="Вхідні дані" :active="true">
        <p class="main__title">Функція: x^3 - x - 3 = 0</p>
        <p>Очікуваний результат: 1.67169988</p>
        <div class="main__options">
            Проміжок: 
            <FormField class="main__range" v-model="rangeLeftString" @invalid="error='Введіть коректні дані'" @input="calcAnswer" /> - 
            <FormField class="main__range" v-model="rangeRightString" @invalid="error='Введіть коректні дані'" @input="calcAnswer" />
        </div>
        <div class="main__options">
          Точність:
          <FormField v-model="accuracyString" @invalid="error='Введіть коректні дані'"  @input="calcAnswer" />
        </div>
        <div class="main__options">
          <Download file-name="lab4.json" :data="JSON.stringify({a: rangeLeft, b: rangeRight, e: accuracy})" />
          <Upload @upload="handleUpload" />
        </div>
      </Card> 
      <Card :title="'Результати'" :active="true">
        <p v-if="error.length" class="main__err">{{ error }}</p>
        <div v-else>
          <p class="main__result">Відповідь: {{ answer }}</p>
          <p class="main__iter">Кількість ітерацій: {{ iterationsCount }}</p>
          <p class="main__title2">Графік на заданому проміжку:</p>
          <Line class="main__plot" :data="chartData" :options="chartOptions" />
        </div>
      </Card>   
    </section>
  </main>
  
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue';
  import StudentInfo from './components/StudentInfo.vue';
  import Card from './components/Card.vue';
  import Download from './components/Download.vue';
  import Upload from './components/Upload.vue';
  import FormField from './components/FormField.vue';
  import { newtonMethod } from './utils/newtonMethod';
  import { type TMathFunction } from './types';
  import { getFunctionValues } from './utils/utils';
  import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip } from 'chart.js'
  import { Line } from 'vue-chartjs'
  ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement, Title,Tooltip);

  const error = ref<string>('');

  const mathFunction: TMathFunction = (x) => (x**3) - x - 3;
  const mathFunctionDerivative: TMathFunction = (x) => 3 * (x**2) - 1;

  const chartData = ref({
    labels: [] as number[],
    datasets: [{ data: [] as number[] }]
  });

  const chartOptions = ref({
    responsive: true,
  });

  const rangeLeftString = ref<string>('0');
  const rangeRightString = ref<string>('2');
  const accuracyString = ref<string>('0.1');

  const rangeLeft = computed<number>(() => +rangeLeftString.value);
  const rangeRight = computed<number>(() => +rangeRightString.value);
  const accuracy = computed<number>(() => +accuracyString.value);

  watch(rangeLeftString, () => {
    rangeLeftString.value = (rangeLeftString.value[0] === '-' ? '-' : '') + rangeLeftString.value.replace(/[^0-9.]/g, '');

    if (+rangeLeftString.value >= +rangeRightString.value) {
      rangeRightString.value = String(+rangeLeftString.value + 1);
    }

    chatgePlot();
  });

  watch(rangeRightString, () => {
    rangeLeftString.value = (rangeLeftString.value[0] === '-' ? '-' : '') + rangeLeftString.value.replace(/[^0-9.]/g, '');

    if (+rangeLeftString.value >= +rangeRightString.value) {
      rangeLeftString.value = String(+rangeRightString.value - 1);
    }

    chatgePlot();
  });

  watch(accuracyString, () => {
    accuracyString.value = accuracyString.value.replace(/[^0-9.]/g, '');
    
  });

  const answer = ref<number | null>(null);
  const iterationsCount = ref<number>(0);

  const chatgePlot = ():void => {
    let xValues:number[];
    let yValues:number[];
    [xValues, yValues] = getFunctionValues(mathFunction, rangeLeft.value, rangeRight.value, (rangeRight.value - rangeLeft.value)/300);
    chartData.value = {
      labels: yValues as number[],
      datasets: [{ data: xValues as number[] }]
    };
  };
  chatgePlot();

  const calcAnswer = ():void => {
    nextTick().then(() => {
      try {
        error.value = '';
        let result:number;
        let iter:number;

        [result, iter] =  newtonMethod(mathFunction, mathFunctionDerivative, rangeLeft.value, rangeRight.value, accuracy.value);
        iterationsCount.value = iter;
        answer.value = result;
      } catch(err:any) {
        error.value = err.message;
        answer.value = null;
      }
    });
  };

  calcAnswer();

  const handleUpload = (e:string):void => {
    try {
      const result:any = JSON.parse(e);
      rangeLeftString.value = String(result.a) || rangeLeftString.value; 
      rangeRightString.value = String(result.b) || rangeRightString.value; 
      accuracyString.value = String(result.e) || accuracyString.value; 
    } catch(err) {
      alert('Помилка при читанні файлу');
    }
  };

</script>

<style lang="scss">

  * {
    box-sizing: border-box;
  }

  body {  
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    // background-color: #9a9a9a;
    
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c4c4c4;
    }
  }

  .container {
    width: 100%;
    max-width: 1240px;
    padding: 20px;
    margin: 0 auto;
  }

  .main {

    &__student-info {
      margin-bottom: 50px;
      display: flex;
    }

    &__title {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 0;
      margin-top: 50px;
    }

    &__title2 {
      font-size: 22px;
      width: 100%;
      text-align: center;
      font-weight: 600;
      margin-bottom: 0;
      margin-top: 50px;
    }

    &__plots {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    &__plot-title {
      font-weight: 600;
      font-size: 20px;
      margin-top: 70px;
      margin-bottom: 0;
    }

    &__plot {
      max-height: 500px;
      margin: 30px auto;
      width: 70%;
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    &__options {
      margin-top: 20px;
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    &__range {
      max-width: 70px;
    }

    &__result {
      width: 100%;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 0;
    }

    &__err {
      color: red;
      width: 100%;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
    }

    &__iter {
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
    }
  }
</style>
